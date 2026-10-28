---
title: "Enumerating Network Information (Windows)"
description: "Windows post-exploitation network enumeration: interfaces (ipconfig /all), routing table, ARP neighbours, listening services (netstat) and firewall state (netsh)."
date: 2025-12-04
platform: "INE Labs"
difficulty: "Easy"
tags: ["Windows", "Post-Exploitation", "Enumeration", "Network", "ipconfig", "netstat", "Firewall"]
cover: "./photo2.png"
---

# Enumerating Network Information (Windows)

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** Windows host (Meterpreter via Rejetto HFS)

## 1. Executive Summary

After exploiting **Rejetto HFS**, we enumerate the Windows host's network context —
interfaces, routing, ARP neighbours, listening services and firewall state — to plan lateral
movement.

## 2. Interfaces

```cmd
shell
ipconfig
ipconfig /all
```

![ipconfig](./photo1.png)

![ipconfig /all (1)](./photo2.png)

![ipconfig /all (2)](./photo3.png)

## 3. Routing & ARP

```cmd
route print
```

![Routing table (1)](./photo4.png)

![Routing table (2)](./photo5.png)

```cmd
arp -a
```

![ARP — devices on the network](./photo6.png)

## 4. Listening Services

```cmd
netstat -ano
```

![netstat (1)](./photo7.png)

![netstat (2)](./photo8.png)

## 5. Firewall State

```cmd
netsh advfirewall show allprofiles
```

The firewall is not running here.

![Firewall state (1)](./photo9.png)

![Firewall state (2)](./photo10.png)

## 6. Notes

ARP neighbours and the routing table reveal reachable internal hosts; a disabled firewall
widens lateral-movement options.
