---
title: "Enumerating Network Information (Linux)"
description: "Linux post-exploitation network enumeration: interfaces and connections (ifconfig/netstat), routing table, /etc/networks, hostname and /etc/hosts, DNS (/etc/resolv.conf), and subnet host discovery."
date: 2025-12-08
platform: "INE Labs"
difficulty: "Easy"
tags: ["Linux", "Post-Exploitation", "Enumeration", "Network", "ifconfig", "netstat"]
cover: "./photo2.png"
---

# Enumerating Network Information (Linux)

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** Linux host (root Meterpreter via vsFTPd)

## 1. Executive Summary

After exploiting the **vsFTPd** backdoor and upgrading to Meterpreter, we map the host's
network context — interfaces, connections, routing, DNS and neighbouring hosts — to plan
lateral movement and pivoting.

## 2. Foothold

![Root Meterpreter via vsFTPd](./photo1.png)

## 3. Interfaces & Connections

```bash
ifconfig
netstat -antp
```

![ifconfig / netstat (1)](./photo2.png)

![netstat (2)](./photo3.png)

## 4. Routing

```bash
route -n        # or netstat -rn
```

![Routing table](./photo4.png)

```bash
shell
ip a s          # adapter details
```

![Network adapters](./photo5.png)

## 5. Hosts, DNS & Neighbours

```bash
cat /etc/networks
```

![/etc/networks](./photo6.png)

```bash
hostname
cat /etc/hosts
```

![hostname / /etc/hosts](./photo7.png)

```bash
cat /etc/resolv.conf
```

![DNS — /etc/resolv.conf](./photo8.png)

```bash
arp -a          # systems on the subnet (none here)
```

![ARP neighbours](./photo9.png)

## 6. Notes

This network context (routes, DNS, neighbours) is the basis for autoroute/portfwd pivoting
to internal hosts.
