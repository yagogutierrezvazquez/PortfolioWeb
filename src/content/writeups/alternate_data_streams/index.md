---
title: "Alternate Data Streams"
description: "Using NTFS Alternate Data Streams to hide a WinPEAS executable inside a benign text file, then abusing a symbolic link to execute the hidden stream by name."
date: 2025-11-05
platform: "INE Labs"
difficulty: "Easy"
tags: ["Alternate Data Streams", "NTFS", "Windows", "Defense Evasion", "WinPEAS", "mklink"]
cover: "./photo2.png"
---

# Alternate Data Streams

**Classification:** Host & Network Penetration Testing / System & Host-Based Attacks<br>
**Target:** Windows host (local file system, `C:\Temp`)<br>
**Technique:** NTFS Alternate Data Streams (ADS) for hiding an executable

## 1. Executive Summary

NTFS **Alternate Data Streams** let a file carry hidden secondary streams that don't show
up in Explorer or a normal directory listing. Here we hide the WinPEAS privilege-escalation
executable inside the ADS of a harmless `windowslog.txt`, delete the original payload, and
then execute the hidden stream through a symbolic link (`wupdate.exe`), since ADS binaries
cannot be launched directly by path.

## 2. Staging the Payload

The payload (WinPEAS) is dropped to `C:\Temp`.

![payload.exe in C:\Temp](./photo1.png)

## 3. Hiding the Executable in an ADS

Piping the executable into an alternate data stream of a text file.

```cmd
type payload.exe > windowslog.txt:winpeas.exe
```

![Hiding payload in windowslog.txt ADS](./photo2.png)

Explorer now shows only `windowslog.txt` (reported as 0 KB) — the executable is concealed
in the stream.

![windowslog.txt appears as a normal text file](./photo3.png)

## 4. Confirming the Cover File & Removing the Original

Opening `windowslog.txt` shows ordinary text content, so it looks benign.

![windowslog.txt opens as a normal text file](./photo4.png)

The original `payload.exe` is deleted — only the hidden stream remains.

![Deleting the original payload](./photo5.png)

## 5. Executing the Hidden Stream

A stream can't be opened/launched directly — Windows refuses it.

```cmd
notepad windowslog.txt:winpeas.exe      # no program associated
start windowslog.txt:winpeas.exe        # Access is denied
```

![No program associated error](./photo6.png)

![start — Access is denied](./photo7.png)

## 6. Symbolic Link Workaround

Creating a symbolic link to the ADS lets us invoke it by a normal name. This requires an
elevated prompt (`mklink` needs `SeCreateSymbolicLinkPrivilege`).

```cmd
mklink wupdate.exe C:\Temp\windowslog.txt:winpeas.exe
```

Without elevation it fails:

![mklink without privilege — fails](./photo8.png)

From an elevated command prompt the link is created:

```
symbolic link created for wupdate.exe <<===>> C:\Temp\windowslog.txt:winpeas.exe
```

![mklink succeeds in elevated prompt](./photo9.png)

## 7. Running the Hidden Executable

Now typing `wupdate` anywhere executes the hidden WinPEAS stream.

```cmd
wupdate
```

![wupdate launches the hidden WinPEAS](./photo10.png)

## 8. Remediation Recommendations

1. **Monitor for ADS creation/use** — EDR and Sysmon (FileCreateStreamHash) flag writes to
   `file:stream` and execution via streams; `dir /r` and `Get-Item -Stream *` reveal them.
2. **Application allow-listing** (WDAC/AppLocker) to block execution of unapproved binaries,
   including those reached via symbolic links.
3. **Restrict `SeCreateSymbolicLinkPrivilege`** to administrators only.
4. **Consider non-NTFS or policy controls** on sensitive shares where ADS is not needed.
