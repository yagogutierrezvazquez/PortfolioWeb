---
title: "Enumerating Users & Groups (Linux)"
description: "Linux post-exploitation enumeration of users and groups: reading /etc/passwd, filtering for no-login accounts, creating and privileging a new account, and listing login history."
date: 2025-12-05
platform: "INE Labs"
difficulty: "Easy"
tags: ["Linux", "Post-Exploitation", "Enumeration", "Users", "Groups", "/etc/passwd"]
cover: "./photo2.png"
---

# Enumerating Users & Groups (Linux)

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** Linux host (root Meterpreter via vsFTPd)

## 1. Executive Summary

After exploiting the **vsFTPd** backdoor and upgrading to Meterpreter, we enumerate the
host's local users and groups, identify service/no-login accounts, demonstrate creating a
privileged account, and review login history.

## 2. Foothold

![Root Meterpreter via vsFTPd](./photo1.png)

## 3. Users & Groups

```bash
cat /etc/passwd
cat /etc/group
```

![/etc/passwd — users](./photo2.png)

Filtering for accounts without a login shell.

```bash
grep -E "nologin|false" /etc/passwd
```

![No-login accounts](./photo3.png)

## 4. Creating a Privileged Account (demo)

```bash
useradd john
ls -al /home/john
```

![Creating user john](./photo4.png)

```bash
usermod -aG root john
groups john
```

![Adding john to the root group](./photo5.png)

## 5. Login History

```bash
last
who
```

![Login history](./photo6.png)

## 6. Notes & Remediation

1. **Audit accounts** — alert on new users and unexpected membership in the root/sudo groups.
2. Service accounts should have `nologin` shells; apply least privilege.
3. Centralise auth logs so account creation and logins are visible off-host.
