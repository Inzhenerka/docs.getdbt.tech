---
title: "Install Fusion"
description: "Install the Fusion engine locally to take data transformation to the next level."
id: install-fusion
---

# About Fusion installation <Lifecycle status="beta" />

import FusionBeta from '/snippets/_fusion-beta-callout.md';
import FusionDWH from '/snippets/_fusion-dwh.md';

<FusionBeta />

This guide walks you through installing Fusion locally, including important prerequisites, step-by-step installation instructions, troubleshooting common issues, and configuration guidance.

## Prerequisites

Before installing Fusion, ensure:

- You have administrative privileges to install software on your local machine.
- You are familiar with command-line interfaces (Terminal on macOS/Linux<!--, PowerShell on Windows-->).
- You are using a supported data warehouse and authentication method.
  <FusionDWH /> 
- You are using a supported OS and architecture:

  🟢 - Supported <br/>
  🟡 - Not yet supported

  | Operating System    | X86-64 | ARM  |
  |-------------------|----------|------|
  | macOS             |   🟢     |  🟢  |
  | Linux             |   🟢     |  🟢  |
  | Windows*           |   🟡     |  🟡  |
  
  *Support for Windows is coming soon. Watch this page for updates. 
 
<div className="grid--2-col">

<Card
    title="dbt VS Code Extension"
    body="Learn how to connect to a data platform, integrate with secure authentication methods, and configure a sync with a git repo."
    link="/docs/install-dbt-extension"
    icon="dbt-bit"/>

<Card
    title="dbt Fusion engine CLI installation"
    body="Learn how to install the dbt ."
    link="/docs/fusion/install-fusion-cli"
    icon="dbt-bit"/>

</div>
