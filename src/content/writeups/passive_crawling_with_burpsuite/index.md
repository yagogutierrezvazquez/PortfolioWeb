---
title: "Passive Crawling with Burp Suite"
description: "Passively mapping a web application (OWASP Mutillidae) by proxying traffic through Burp Suite to build the site map, then using OWASP ZAP's spider to actively crawl and discover hidden content such as a passwords file."
date: 2026-01-02
platform: "INE Labs"
difficulty: "Easy"
tags: ["Web", "Burp Suite", "OWASP ZAP", "Crawling", "Spider", "Mutillidae", "FoxyProxy"]
cover: "./photo4.png"
---

# Passive Crawling with Burp Suite

**Classification:** Host & Network Penetration Testing / Web & HTTP Protocol<br>
**Target:** OWASP Mutillidae web application

## 1. Executive Summary

Passive crawling builds a site map from traffic you generate by browsing, without actively
hammering the server. We proxy the browser through **Burp Suite** (via FoxyProxy, intercept
off) to map **OWASP Mutillidae**, then use **OWASP ZAP**'s spider to actively crawl and
surface hidden content — including a `passwords` file.

## 2. Recon

```bash
ping -c 4 <target>
```

![Ping target](./photo1.png)

The site hosts OWASP Mutillidae.

![OWASP Mutillidae](./photo2.png)

## 3. Passive Crawling (Burp Suite)

Routing the browser through Burp (FoxyProxy on, Intercept off) and browsing the app builds
the site map passively.

![Burp Suite — proxy configured](./photo3.png)

Clicking through the app populates Burp's site map.

![Burp site map taking form](./photo4.png)

## 4. Active Crawling (OWASP ZAP)

```
Open ZAP -> reload the page -> Spider the site
```

![OWASP ZAP](./photo5.png)

![ZAP Spider started](./photo6.png)

![Spider progressing](./photo7.png)

The spider discovers a `passwords` resource.

![ZAP — passwords file discovered (1)](./photo8.png)

![Discovered content (2)](./photo9.png)

## 5. Notes

1. **Passive crawling** (Burp) is low-noise and maps what you actually visit; **active
   spidering** (ZAP) follows links to find unlinked/hidden content.
2. Discovered sensitive files (`passwords`, backups, admin panels) are prime follow-up
   targets — and, defensively, should never be reachable.
