---
title: "Enumerating Processes & Services (Windows)"
description: "Windows post-exploitation enumeration of processes, services and scheduled tasks: ps/tasklist, Meterpreter migration to an x64 process, sc/wmic service details, and schtasks for scheduled jobs."
date: 2025-12-04
platform: "INE Labs"
difficulty: "Easy"
tags: ["Windows", "Post-Exploitation", "Enumeration", "Processes", "Services", "Scheduled Tasks"]
cover: "./photo5.png"
---

# Enumerating Processes & Services (Windows)

**Classification:** Host & Network Penetration Testing / Post-Exploitation<br>
**Target:** Windows host (Meterpreter via Rejetto HFS)

## 1. Executive Summary

After exploiting **Rejetto HFS**, we enumerate the host's running processes, Windows services
and scheduled tasks — identifying privileged/abusable services and persistence opportunities.

## 2. Processes

```bash
ps
```

![Running processes (1)](./photo1.png)

![Running processes (2)](./photo2.png)

Searching for a specific PID.

![Specific PID](./photo3.png)

Migrating into an x64 process for a stable x64 session.

```bash
migrate <pid>
```

![Migrating to an x64 process](./photo4.png)

## 3. Services

```cmd
shell
net start
sc query
```

![Running services (1)](./photo5.png)

![Running services (2)](./photo6.png)

More detail (ExitCode, ProcessId, StartMode, State, Status) via WMIC.

```cmd
wmic service list brief
```

![Service details](./photo7.png)

Mapping services to their hosting processes.

```cmd
tasklist /svc
```

![Processes with their services (1)](./photo8.png)

![tasklist /svc (2)](./photo9.png)

## 4. Scheduled Tasks

```cmd
schtasks /query /fo LIST /v
```

(Best piped to a file given the volume.)

![schtasks — scheduled tasks](./photo10.png)

## 5. Notes

Services running as SYSTEM with weak permissions (unquoted paths, writable binaries) and
scheduled tasks are prime privilege-escalation and persistence targets.
