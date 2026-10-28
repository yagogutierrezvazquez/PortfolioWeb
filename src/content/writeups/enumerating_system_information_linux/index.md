---
title: "Enumerating System Information (Linux)"
description: "Linux post-exploitation system enumeration: OS/release and kernel version, environment variables, CPU, mounted filesystems and storage devices, and installed packages (dpkg) on a Debian host."
date: 2025-12-05
platform: "INE Labs"
difficulty: "Easy"
tags: ["Linux", "Post-Exploitation", "Enumeration", "System Information", "uname", "dpkg"]
cover: "./photo4.png"
---

# Enumerating System Information (Linux)

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** Debian 9.5 (root Meterpreter via vsFTPd 2.3.4)

## 1. Executive Summary

After exploiting the **vsFTPd 2.3.4** backdoor and upgrading to Meterpreter, we profile the
host — OS/kernel, environment, hardware and installed packages — to inform kernel-exploit
selection and further post-exploitation.

## 2. Foothold

```bash
nmap -sV <target>
use exploit/unix/ftp/vsftpd_234_backdoor
run
```

![Nmap scans](./photo1.png)

![vsFTPd backdoor — shell](./photo2.png)

![Upgraded to Meterpreter](./photo3.png)

## 3. OS & Kernel

```bash
sysinfo        # root @ Debian 9.5
```

![sysinfo](./photo4.png)

```bash
shell
hostname
cat /etc/*release
```

![hostname / distribution](./photo5.png)

![Release information](./photo6.png)

```bash
uname -a
```

![Kernel version and architecture](./photo7.png)

## 4. Environment & Hardware

```bash
env
```

![Environment variables](./photo8.png)

```bash
cat /proc/cpuinfo
```

![CPU information](./photo9.png)

```bash
mount ; df -h
```

![Filesystems and mounts](./photo10.png)

![Common drives](./photo11.png)

```bash
lsblk
```

![Storage devices](./photo12.png)

## 5. Installed Packages

```bash
dpkg -l        # Debian
```

![Installed packages (dpkg)](./photo13.png)

## 6. Notes

OS/kernel version drives kernel-exploit selection; installed packages reveal extra software
(and their own vulnerabilities).
