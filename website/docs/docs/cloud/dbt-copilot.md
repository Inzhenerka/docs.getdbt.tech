--- 
title: "About dbt Copilot" 
sidebar_label: "About dbt Copilot" 
description: "dbt Copilot is a powerful AI engine designed to accelerate your analytics workflows throughout your entire ADLC." 
pagination_next: "docs/cloud/enable-dbt-copilot"
intro_text: "dbt Copilot is a powerful AI engine that handles the tedious tasks, speeds up workflows, and ensures consistency, helping you deliver exceptional data products faster."
---

# About dbt Copilot <Lifecycle status="enterprise" /> 

dbt Copilot is a powerful artificial intelligence (AI) engine that's fully integrated into your dbt Cloud experience and designed to accelerate your analytics workflows. dbt Copilot embeds AI-driven assistance across every stage of the analytics development life cycle (ADLC), empowering data practitioners to deliver data products faster, improve data quality, and enhance data accessibility. 

With automatic code generation, let dbt Copilot [generate code](/docs/cloud/use-dbt-copilot) using natural language, and [generate documentation](/docs/build/documentation), [tests](/docs/build/data-tests), [metrics](/docs/build/metrics-overview), and [semantic models](/docs/build/semantic-models) for you with the click of a button.

:::tip
dbt Copilot is available to Enterprise accounts. If you're interested in using dbt Copilot, [reach out to dbt Labs](https://www.getdbt.com/contact) and we'll help you get started!
:::

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-copilot-doc.gif" width="100%" title="Example of using dbt Copilot to generate documentation in the IDE" />

## How dbt Copilot works

:::tip
dbt Copilot accelerates, but doesn’t replace, your analytics development lifecycle. It helps deliver better data products faster, but always review AI-generated content, as it may be incorrect.
:::

dbt Copilot enhances efficiency by automating repetitive tasks while ensuring data privacy and security. It works as follows:

- Access dbt Copilot through the dbt Cloud IDE to generate documentation, tests, semantic models, or in the Visual Editor to generate SQL code using natural language prompts.
- dbt Copilot gathers metadata (like column names, model SQL, documentation) but never accesses row-level warehouse data.
- The metadata and user prompts are sent to the AI provider (in this case, OpenAI) through API calls for processing.
- The AI-generated content is returned to dbt Cloud for you to review, edit, and save within your project files.
- dbt Copilot does not use warehouse data to train AI models.
- No sensitive data persists on dbt Labs' systems, except for usage data.
- You can request the deletion of personal or sensitive data within 30 days.

WE CAN ADD ARCHITECTURAL DIAGRAM HERE
