---
title: "Enumerating Users & Groups (Windows)"
description: "Windows post-exploitation enumeration of users and groups: current user and privileges, logged-on users (enum_logged_on_users), local accounts (net user), and local groups including Administrators and Remote Desktop Users."
date: 2025-12-04
platform: "INE Labs"
difficulty: "Easy"
tags: ["Windows", "Post-Exploitation", "Enumeration", "Users", "Groups", "net user"]
cover: "./photo7.png"
---

# Enumerating Users & Groups (Windows)

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** Windows host (Meterpreter via Rejetto HFS)

## 1. Executive Summary

After exploiting **Rejetto HFS**, we enumerate the Windows host's users, privileges and
groups — identifying the current context, logged-on users, local accounts and
privileged-group membership (Administrators, Remote Desktop Users).

## 2. Foothold & Current User

![Meterpreter via Rejetto HFS](./photo1.png)

```bash
getuid
getprivs
```

![Current user](./photo2.png)

![Current user privileges (admin)](./photo3.png)

## 3. Logged-on Users

```bash
run post/windows/gather/enum_logged_on_users
```

![enum_logged_on_users — SIDs and usernames](./photo4.png)

```cmd
shell
whoami /priv
```

![Shell — user and privileges](./photo5.png)

```cmd
query user
```

![Currently logged-on users](./photo6.png)

## 4. Local Accounts

```cmd
net user
```

![All local accounts](./photo7.png)

```cmd
net user administrator
```

![Specific account details](./photo8.png)

```cmd
net user guest
```

![Guest account (inactive)](./photo9.png)

## 5. Groups

```cmd
net localgroup
```

![Local groups](./photo10.png)

```cmd
net localgroup Administrators
```

![Administrators group members](./photo11.png)

## 6. Notes

Membership in **Administrators** (full control), **Remote Desktop Users** (RDP logon) and
backup/privileged groups directly informs privilege escalation and lateral movement.
