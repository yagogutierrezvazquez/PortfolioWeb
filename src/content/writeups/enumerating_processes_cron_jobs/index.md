---
title: "Enumerating Processes & Cron Jobs"
description: "Linux post-exploitation enumeration: listing running processes (ps, top) and inspecting the cron configuration (/etc/cron*) to find scheduled jobs worth abusing."
date: 2025-12-08
platform: "INE Labs"
difficulty: "Easy"
tags: ["Linux", "Post-Exploitation", "Enumeration", "Processes", "Cron", "ps", "top"]
cover: "./photo5.png"
---

# Enumerating Processes & Cron Jobs

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** Linux host (root Meterpreter via vsFTPd)

## 1. Executive Summary

After exploiting the **vsFTPd** backdoor and upgrading to Meterpreter, we enumerate the
host's running processes and scheduled cron jobs — a key post-exploitation step for finding
privileged processes and abusable scheduled tasks.

## 2. Foothold

```bash
use exploit/unix/ftp/vsftpd_234_backdoor
# ... shell -> shell_to_meterpreter
```

![Root Meterpreter via vsFTPd](./photo1.png)

## 3. Enumerating Processes

```bash
ps aux
```

![Running processes (ps)](./photo2.png)

Filtering for specific PIDs/processes.

![Specific process details](./photo3.png)

```bash
top
```

![top — live process list](./photo4.png)

## 4. Enumerating Cron Jobs

```bash
ls -al /etc/cron*
cat /etc/crontab
```

The cron directories (`/etc/cron.d`, `/etc/cron.daily`, ...) list scheduled jobs — check them
for user-writable scripts run as root.

![/etc/cron* listing (1)](./photo5.png)

![cron contents (2)](./photo6.png)

## 5. Notes & Remediation

1. World-writable scripts invoked by root cron are a common privesc vector — keep cron
   scripts `root:root` and non-writable by others.
2. Monitor for unexpected processes and cron modifications (auditd / file integrity).
