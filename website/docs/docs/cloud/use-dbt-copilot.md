--- 
title: "Use dbt Copilot" 
sidebar_label: "Use dbt Copilot" 
description: "Use dbt Copilot to generate documentation, tests, semantic models, and sql code from scratch, giving you the flexibility to modify or fix generated code." 
---

import CopilotResources from '/snippets/_use-copilot-resources.md';
import CopilotEditCode from '/snippets/_use-copilot-edit-code.md';
import CopilotVE from '/snippets/_use-copilot-ve.md';

# Use dbt Copilot <Lifecycle status="enterprise" /> 

<IntroText>
Use dbt Copilot to generate documentation, tests, semantic models, and code from scratch, giving you the flexibility to modify or fix generated code.

</IntroText>

This page explains how to use dbt Copilot to:

- [Generate resources](#generate-resources) &mdash; Save time by using dbt Copilot’s generation button to generate documentation, tests, and semantic model files during your development in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).
- [Generate and edit SQL inline](#generate-and-edit-sql-inline) &mdash; Use natural language prompts to generate SQL code from scratch or to edit existing SQL file by using keyboard shortcuts or highlighting code in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).
- [Build visual models](#build-visual-models)<Lifecycle status='beta'/> &mdash; Use dbt Copilot to generate models in the [Visual Editor](/docs/cloud/use-visual-editor) with natural language prompts.

## Generate resources

<CopilotResources/>

## Generate and edit SQL inline

<CopilotEditCode/>

## Build visual models <Lifecycle status='beta'/>

:::info
Building visual models in the Visual Editor is currently in private beta for [dbt Cloud Enterprise accounts](https://www.getdbt.com/pricing). To join the private beta, [register your interest](https://docs.google.com/forms/d/e/1FAIpQLScPjRGyrtgfmdY919Pf3kgqI5E95xxPXz-8JoVruw-L9jVtxg/viewform) or reach out to your account team to begin this process.
:::

dbt Copilot seamlessly integrates with the [Visual Editor](/docs/cloud/visual-editor), a drag-and-drop experience that helps you build your visual models using natural language prompts. Before you begin, make sure you can [access the Visual Editor](/docs/cloud/use-visual-editor#access-visual-editor).

<CopilotVE/>
