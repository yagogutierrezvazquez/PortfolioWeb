---
title: "Let's GoPhishing"
description: "Walkthrough of the GoPhish phishing-simulation framework in a lab: configuring a sending profile, building a cloned landing page and email template, importing a target group, launching a campaign and reviewing the tracking results."
date: 2025-12-16
platform: "INE Labs"
difficulty: "Medium"
tags: ["Social Engineering", "Phishing Simulation", "GoPhish", "Awareness", "Campaign"]
cover: "./photo20.png"
---

# Let's GoPhishing

**Classification:** Host & Network Penetration Testing / Social Engineering<br>
**Environment:** Isolated lab (no internet); GoPhish server + a victim VM with Thunderbird

> This is an **authorized phishing-simulation exercise** in a closed lab. The same workflow is
> what blue teams use to run awareness campaigns and measure click/submit rates against their
> own employees — always with authorization.

## 1. Executive Summary

**GoPhish** is an open-source phishing-simulation framework. In this lab we run the full
campaign workflow against a lab mailbox: set up a sending profile, build a landing page and
email template, import a target group, schedule a campaign, and review the results GoPhish
tracks (opens, clicks, submissions).

## 2. Lab Setup

Two provided files: the email content and the target list.

![Provided files (code + targets)](./photo1.png)

The victim VM uses Thunderbird as its mail client.

![Thunderbird on the victim VM](./photo2.png)

Because the lab is offline, we edit the `base.html` / `login.html` templates to remove the
external Google APIs calls, and check `config.json`.

![Editing templates (1)](./photo3.png)

![Removing external calls (2)](./photo4.png)

![config.json](./photo5.png)

Starting GoPhish and opening its admin UI.

![Starting GoPhish](./photo6.png)

![GoPhish admin UI](./photo7.png)

## 3. Sending Profile

Configuring the SMTP sending profile and sending a test email.

![Creating the sending profile](./photo8.png)

![Test email (1)](./photo9.png)

![Test email (2)](./photo10.png)

![Test email delivered (3)](./photo11.png)

## 4. Landing Page

Cloning the INE "Reset Password" page as the landing page (hosted on `localhost:8080`).

![Landing page — clone (1)](./photo12.png)

![Landing page config (2)](./photo13.png)

![Landing page saved (3)](./photo14.png)

## 5. Email Template

Importing the provided `Password Reset Email.txt` as the email template.

![Email template (1)](./photo15.png)

![Email template content (2)](./photo16.png)

Templates can also carry attachments.

![Attachment option](./photo17.png)

## 6. Target Group

Importing `targets.csv` as the recipient group.

![Creating the group (1)](./photo18.png)

![Imported targets (2)](./photo19.png)

## 7. Launching the Campaign

Creating the campaign from the profile, landing page, template and group.

![New campaign (1)](./photo20.png)

![Campaign settings (2)](./photo21.png)

![Campaign scheduled (3)](./photo22.png)

## 8. Results & Tracking

At the scheduled time the email arrives in the victim's mailbox.

![Email in the victim's mailbox](./photo23.png)

GoPhish registers the link click.

![Click registered](./photo24.png)

When the landing page loads and credentials are submitted, GoPhish records the event (in a
real simulation this is where the metric "credentials submitted" comes from).

![Landing page submission tracked](./photo25.png)

## 9. Defensive Takeaways

1. **User awareness training** is the primary control — measured, recurring phishing
   simulations (exactly this workflow) reduce click/submit rates over time.
2. **Technical controls:** SPF/DKIM/DMARC, external-sender banners, link rewriting/sandboxing,
   and MFA so a submitted password isn't sufficient.
3. **Reporting:** make it easy for users to report suspected phishing, and monitor for
   credential submission to look-alike pages.
