--- 
title: "dbt Copilot FAQs" 
sidebar_label: "dbt Copilot FAQs" 
description: "Answers to common questions about dbt Copilot."
intro_text: "Learn the answers to common questions about dbt Copilot."
---

# dbt Copilot FAQs <Lifecycle status="enterprise" /> 

dbt Copilot is a powerful AI engine that handles the tedious tasks, speeds up workflows, and ensures consistency, helping you deliver exceptional data products faster.

## Overview 

<Expandable alt_header="What is dbt Copilot?">
dbt Copilot is a powerful artificial intelligence (AI) engine that's fully integrated into your dbt Cloud experience and designed to accelerate your analytics workflows. dbt Copilot embeds AI-driven assistance across every stage of the analytics development life cycle (ADLC), empowering data practitioners to deliver data products faster, improve data quality, and enhance data accessibility. 

With automatic code generation, let dbt Copilot [generate code](/docs/cloud/use-dbt-copilot) using natural language, and [generate documentation](/docs/build/documentation), [tests](/docs/build/data-tests), [metrics](/docs/build/metrics-overview), and [semantic models](/docs/build/semantic-models) for you with the click of a button.
</Expandable>

<Expandable alt_header="What are the benefits of using dbt Copilot?">

Use dbt Copilot to:

- Generate code from scratch or edit existing code with natural language.
- Generate documentation, tests, metrics, and semantic models for your models.
- Accelerate your development workflow with AI-driven assistance.

with a click of a button and ensuring data privacy and security.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-copilot-doc.gif" width="100%" title="Example of using dbt Copilot to generate documentation in the IDE" />

</Expandable>

## Availability 

<Expandable alt_header="Who can use dbt Copilot?">

dbt Copilot is available to all dbt Cloud [developer license users](/docs/cloud/manage-access/seats-and-users) on a dbt Cloud [Enterprise account](https://www.getdbt.com/contact).

</Expandable>

<Expandable alt_header="Where can I use dbt Copilot?">

You can use dbt Copilot in the dbt Cloud IDE to generate documentation, tests, metrics, and semantic models for your models _or_ the Visual Editor to [generate SQL expressions for models](/docs/cloud/use-visual-editor#use-dbt-copilot-to-generate-sql-expressions).
</Expandable>

<Expandable alt_header="What provider is dbt Copilot using?">

dbt Copilot uses OpenAI to generate documentation, tests, metrics, and semantic models for your models. You can provide your organization's OpenAI API key, use dbt Labs' managed OpenAI key, or Azure OpenAI key. Check out [Bringing your own OpenAI API key](/docs/cloud/enable-dbt-copilot#bringing-your-own-openai-api-key-byok) for more information.

dbt Cloud will then leverage your OpenAI account and terms to power dbt Copilot. This will incur billing charges to your organization from OpenAI for requests made by dbt Copilot.

</Expandable>

## How it works 

<Expandable alt_header="How does dbt Copilot work?">

dbt Copilot uses AI to generate documentation, tests, metrics, and semantic models for your models. It also uses AI to generate SQL expressions for models in the Visual Editor. It works as follows:

- Access dbt Copilot through the dbt Cloud IDE to generate documentation, tests, semantic models, or SQL code using natural language prompts.
- dbt Copilot gathers metadata (like column names, model SQL, documentation) but never accesses row-level warehouse data.
- The metadata and user prompts are sent to the AI provider (in this case, OpenAI) through API calls for processing.
- The AI-generated content is returned to dbt Cloud for you to review, edit, and save within your project files.
- dbt Copilot does not use warehouse data to train AI models.
- No sensitive data persists on dbt Labs' systems, except for usage data.
- You can request the deletion of personal or sensitive data within 30 days.

</Expandable>

## Data

<Expandable alt_header="What data does dbt Copilot use?">

- dbt Copilot does not use warehouse data to train AI models.
- No sensitive data persists on dbt Labs' systems, except for usage data.
- Clients can request the deletion of personal or sensitive data within 30 days.

For more details, check out [dbt Copilot privacy](/docs/cloud/dbt-copilot-data).
</Expandable>

## Limitations 

<Expandable alt_header="What are the limitations of dbt Copilot?">

dbt Copilot has the following limitations:

- dbt Copilot is not available in the dbt Cloud CLI.
- dbt Copilot is not available in the dbt Cloud API.
</Expandable>
