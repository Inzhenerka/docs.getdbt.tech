--- 
title: "About dbt Copilot" 
sidebar_label: "About dbt Copilot" 
description: "dbt Copilot is a powerful AI engine designed to accelerate your analytics workflows throughout your entire ADLC." 
pagination_next: "docs/cloud/enable-dbt-copilot"
---

# About dbt Copilot <Lifecycle status="enterprise" /> 

<IntroText>
dbt Copilot is a powerful artificial intelligence (AI) engine that's fully integrated into your dbt Cloud experience and designed to accelerate your analytics workflows.

</IntroText>

dbt Copilot embeds AI-driven assistance across every stage of the [analytics development life cycle (ADLC)](https://www.getdbt.com/resources/guides/the-analytics-development-lifecycle), empowering data practitioners to deliver data products faster, improve data quality, and enhance data accessibility. 

With automatic code generation, let dbt Copilot [generate code](/docs/cloud/use-dbt-copilot) using natural language, and [generate documentation](/docs/build/documentation), [tests](/docs/build/data-tests), [metrics](/docs/build/metrics-overview), and [semantic models](/docs/build/semantic-models) for you with the click of a button in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-copilot) and [Visual Editor](/docs/cloud/build-ve-copilot).

:::tip
dbt Copilot is available to all Enterprise accounts. If you're interested in using dbt Copilot, [book a demo](https://www.getdbt.com/contact) and we'll help answer any questions you have.
:::

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-copilot-doc.gif" width="100%" title="Example of using dbt Copilot to generate documentation in the IDE" />

## How dbt Copilot works

dbt Copilot enhances efficiency by automating repetitive tasks while ensuring data privacy and security. It works as follows:

- Access dbt Copilot through the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-copilot) to generate documentation, tests, semantic models, or in the [Visual Editor](/docs/cloud/build-ve-copilot) to generate SQL code using natural language prompts.
- dbt Copilot gathers metadata (like column names, model SQL, documentation) but never accesses row-level warehouse data.
- The metadata and user prompts are sent to the AI provider (in this case, OpenAI) through API calls for processing.
- The AI-generated content is returned to dbt Cloud for you to review, edit, and save within your project files.
- dbt Copilot does not use warehouse data to train AI models.
- No sensitive data persists on dbt Labs' systems, except for usage data.
- You can request the deletion of personal or sensitive data within 30 days.

:::tip
dbt Copilot accelerates, but doesn’t replace, your analytics development lifecycle. It helps deliver better data products faster, but always reviews AI-generated content, as it may be incorrect.
:::

WE CAN ADD ARCHITECTURAL DIAGRAM HERE
