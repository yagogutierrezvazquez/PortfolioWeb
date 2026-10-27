---
title: "Port Scanning and Enumeration with Armitage"
description: "Using Armitage, the Metasploit GUI, to add a target host, run TCP and OS-detection scans, review the discovered services, and use the Find Attacks feature — a visual front-end to the Metasploit workflow."
date: 2025-11-18
platform: "INE Labs"
difficulty: "Easy"
tags: ["Armitage", "Metasploit", "Port Scanning", "Enumeration", "GUI"]
cover: "./photo14.png"
---

# Port Scanning and Enumeration with Armitage

**Classification:** Host & Network Penetration Testing / The Metasploit Framework<br>
**Target:** demo.ine.local (10.2.29.143) — Windows Server 2008 R2–2012, Rejetto HFS<br>
**Objective:** Enumerate and port-scan the target using Armitage.

## 1. Executive Summary

**Armitage** is a graphical front-end for Metasploit that visualises hosts, scans, services
and attacks. Here we start the database and Armitage, add the target, run TCP and OS-detection
scans, review the service table, and use the **Find Attacks** feature.

## 2. Setup

```bash
ping -c 4 demo.ine.local
service postgresql start
msfdb status
```

![Ping target](./photo1.png)

![MSF database connection](./photo2.png)

Launching Armitage.

```bash
armitage
```

![Starting Armitage (1)](./photo3.png)

![Armitage connecting (2)](./photo4.png)

![Armitage running](./photo5.png)

## 3. Interface Tour

The GUI has a module search bar + tree, a target view, and a console.

![Module tree and console](./photo6.png)

The **Hosts** menu handles import/add hosts, scans and DNS enumeration.

![Hosts menu](./photo7.png)

![Help menu](./photo8.png)

## 4. Adding the Host

```
Hosts -> Add Hosts -> 10.2.29.143
```

![Adding the host (1)](./photo9.png)

![Host added, labelled "Victim1" (2)](./photo10.png)

## 5. Scanning

Running a basic TCP port scan (right-click host → Scan); results appear in the **Services**
window.

![TCP scan (1)](./photo11.png)

![Services discovered (2)](./photo12.png)

Running a **Quick Scan (OS detect)** to fingerprint versions and OS.

![Quick scan — OS detect (1)](./photo13.png)

The service table shows **Rejetto HFS (HttpFileServer 2.3)** on 80, SMB, RDP, WinRM, etc.

![Services and OS identified](./photo14.png)

## 6. Find Attacks

```
Attacks -> Find Attacks
```

![Find Attacks](./photo15.png)

Armitage couldn't auto-match attacks here; the Rejetto module can be configured manually
(covered in the next lab).

![Configuring a module manually](./photo16.png)

## 7. Notes

1. Armitage is a convenient visual layer over Metasploit for scanning, enumeration and
   managing sessions across many hosts.
2. "Find Attacks" is only a heuristic — manual module selection is still needed for reliable
   exploitation.
