--- 
title: "Use dbt Copilot" 
sidebar_label: "Use dbt Copilot" 
description: "Use dbt Copilot to generate documentation, tests, semantic models, and sql code from scratch, giving you the flexibility to modify or fix generated code." 
intro_text: "Use dbt Copilot to generate documentation, tests, semantic models, and code from scratch, giving you the flexibility to modify or fix generated code."
---

import CopilotResources from '/snippets/_use-copilot-resources.md';
import CopilotEditCode from '/snippets/_use-copilot-edit-code.md';
import CopilotVE from '/snippets/_use-copilot-ve.md';

# Use dbt Copilot <Lifecycle status="enterprise" /> 

Use dbt Copilot to generate documentation, tests, semantic models, and code from scratch, giving you the flexibility to modify or fix generated code.

This page explains how to use dbt Copilot to:

- [Generate resources](#generate-resources) &mdash; Save time by using dbt Copilot’s generation button to generate documentation, tests, and semantic model files during your development in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).
- [Generate and edit SQL inline](#generate-and-edit-sql-inline) &mdash; Use natural language prompts to generate SQL code from scratch or to edit existing SQL file by using keyboard shortcuts or highlighting code in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).
- [Generate and build models](#generate-and-build-models)<Lifecycle status='beta'/> &mdash; Use dbt Copilot to generate models in the [Visual Editor](/docs/cloud/use-visual-editor) with natural language prompts.
  - [Generate SQL expressions for models](#generate-and-build-models) &mdash; Use dbt Copilot to generate SQL expressions for models in the [Visual Editor](/docs/cloud/use-visual-editor).
  - [Build your visual models](#build-your-visual-models) &mdash; Use dbt Copilot to generate models in the [Visual Editor](/docs/cloud/use-visual-editor) with natural language prompts.


## Generate resources

<CopilotResources/>

## Generate and edit SQL inline

<CopilotEditCode/>

## Generate and build models <Lifecycle status='beta'/>

:::info
All features in this section, including [Generate SQL expressions](#generate-sql-expressions) and [Build your visual models](#build-your-visual-models), are currently in beta.
:::

dbt Copilot seamlessly integrates with the [Visual Editor](/docs/cloud/visual-editor), a drag-and-drop experience that helps you:

- [Generate SQL expressions](#generate-and-build-models) directly within in the Visual Editor operators.
- [Build your visual models](#build-your-visual-models) using natural language prompts

Before you being, make sure you can access the [Visual Editor](/docs/cloud/use-visual-editor#access-visual-editor).


<CopilotVE/>
