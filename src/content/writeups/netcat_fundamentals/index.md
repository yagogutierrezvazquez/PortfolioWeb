---
title: "Netcat Fundamentals"
description: "Hands-on with Netcat: port scanning, setting up TCP listeners, bidirectional message/command chat, UDP listeners, and transferring files between two systems."
date: 2025-11-20
platform: "INE Labs"
difficulty: "Easy"
tags: ["Netcat", "TCP", "UDP", "Port Scanning", "File Transfer", "Fundamentals"]
cover: "./photo3.png"
---

# Netcat Fundamentals

**Classification:** Host & Network Penetration Testing / Exploitation<br>
**Target:** demo.ine.local (10.2.30.239)<br>
**Attacker:** Kali (attackdefense)<br>
**Objective:** Use Netcat to set up listeners and transfer messages and files between systems.

## 1. Executive Summary

Netcat ("the TCP/IP swiss army knife") reads and writes arbitrary TCP/UDP connections. This
lab walks through its core uses: probing ports, running listeners, chatting between hosts in
both directions, UDP connections, and transferring files.

## 2. Recon & Help

```bash
ping -c 4 demo.ine.local      # 10.2.30.239
nc -h
```

![Ping target](./photo1.png)

![Netcat help menu](./photo2.png)

## 3. Port Scanning

Connecting to a port tells us if it's open (80/HTTP) or refused (21/FTP).

```bash
nc -nv 10.2.30.239 80         # 80 (http) open
nc -nv 10.2.30.239 21         # 21 (ftp) Connection refused
```

![Netcat port probing](./photo3.png)

![More port-scan examples](./photo4.png)

## 4. Transferring the Windows nc.exe

Kali ships pre-compiled Windows binaries, including `nc.exe`.

```bash
cd /usr/share/windows-binaries
python -m SimpleHTTPServer 80
```

![windows-binaries folder](./photo5.png)

![Hosting the binaries (1)](./photo6.png)

![Downloading nc.exe on the target (2)](./photo7.png)

## 5. TCP Listener + Connection

Attacker listens; the target connects in.

```bash
nc -nvlp 1234                 # attacker
```

![Netcat listener on 1234](./photo8.png)

![Target connecting (1)](./photo9.png)

![Connection established (2)](./photo10.png)

## 6. Bidirectional Messaging

Once connected, each side can send lines (messages or commands) to the other — it works both
ways.

![Sending a message (1)](./photo11.png)

![Message received (2)](./photo12.png)

![Reply direction (1)](./photo13.png)

![Reply direction (2)](./photo14.png)

## 7. UDP Listener

Add `-u` for UDP; the client must also specify UDP or the connection fails.

```bash
nc -nvlup 1234                # UDP listener
nc -nvu 10.2.30.239 1234      # UDP client
```

![UDP listener](./photo15.png)

![TCP client fails against a UDP listener](./photo16.png)

## 8. File Transfer

Create a file, send it with input redirection, and write it on the receiver with output
redirection.

```bash
nano example.txt
# receiver:  nc -nvlp 1234 > received.txt
# sender:    nc -nv 10.2.30.239 1234 < example.txt
```

![Creating example.txt](./photo17.png)

![Receiver writing to a file](./photo18.png)

![Sending the file](./photo19.png)

![File transfer in progress](./photo20.png)

![File received](./photo21.png)

## 9. Notes

1. Netcat is a powerful dual-use tool — the same features enable reverse/bind shells and
   exfiltration, so its presence on production hosts should be restricted/monitored.
2. Prefer `ncat` (with SSL/auth) over classic `nc` where encryption or access control matters.
