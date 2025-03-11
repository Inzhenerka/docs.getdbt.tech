--- 
title: "dbt Copilot FAQs" 
sidebar_label: "dbt Copilot FAQs" 
description: "Answers to common questions about dbt Copilot."
---

# dbt Copilot FAQs <Lifecycle status="enterprise" /> 

<IntroText>
Read about common questions about dbt Copilot to understand how it works and how it can help you.
</IntroText>

dbt Copilot is a powerful AI engine that handles the tedious tasks, speeds up workflows, and ensures consistency, helping you deliver exceptional data products faster.

dbt Labs is committed to protecting your privacy and data. This page provides information about how the dbt Copilot AI engine handles your data. For more information, check out the [dbt Labs AI development principles](https://www.getdbt.com/legal/ai-principles) page.

## Overview 

<Expandable alt_header="What is dbt Copilot?">
dbt Copilot is a powerful artificial intelligence (AI) engine that's fully integrated into your dbt Cloud experience and designed to accelerate your analytics workflows. dbt Copilot embeds AI-driven assistance across every stage of the analytics development life cycle (ADLC), empowering data practitioners to deliver data products faster, improve data quality, and enhance data accessibility. 

With automatic code generation, let dbt Copilot [generate code](/docs/cloud/use-dbt-copilot) using natural language, and [generate documentation](/docs/build/documentation), [tests](/docs/build/data-tests), [metrics](/docs/build/metrics-overview), and [semantic models](/docs/build/semantic-models) for you with the click of a button in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-copilot) and [Visual Editor](/docs/cloud/build-ve-copilot).

</Expandable>

<Expandable alt_header="Where can I find dbt Copilot?">

dbt Copilot can currently be found in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-copilot) and [Visual Editor](/docs/cloud/build-ve-copilot). Future releases will bring dbt Copilot to even more parts of the dbt Cloud application.

To use dbt Copilot, you must have a dbt Cloud [Enterprise account](https://www.getdbt.com/contact) and opt-in to the feature.

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

<Expandable alt_header="Who has access to dbt Copilot?" >

dbt Copilot is available on a dbt Cloud [Enterprise account](https://www.getdbt.com/contact) to all dbt Cloud [developer license users](/docs/cloud/manage-access/seats-and-users).

</Expandable>

<Expandable alt_header="Is dbt copilot available for all deployment types?">

Yes, dbt Copilot is powered by ai-codegen-api, which is deployed everywhere including [multi-tenant and single-tenant deployments](/docs/cloud/about-cloud/access-regions-ip-addresses).

</Expandable>

## How it works 

<Expandable alt_header="What data/code is used to train the model supporting dbt Copilot?">

dbt Copilot is not a large language model (LLM). dbt Labs does not train any models at all. Currently, we use OpenAI models as per our agreement with OpenAI they do not use our data for training their OpenAI models. Refer our [dbt Labs AI principles page](https://www.getdbt.com/legal/ai-principles) for more information.
</Expandable>

<Expandable alt_header="Which model providers does dbt Copilot use?">

dbt Labs works with OpenAI to build and operationalize dbt Copilot. Enterprise accounts can [supply their own OpenAI keys](/docs/cloud/enable-dbt-copilot#bringing-your-own-openai-api-key-byok)

</Expandable>

<Expandable alt_header="Do we support BYOK (bring your own key) at the project level?">

The dbt Copilot BYOK option is currently an account-only configuration. However, there may be a future where we make this configurable on a project-level.

</Expandable>

## Privacy and data

<Expandable alt_header="Does dbt Copilot store or use personal data?">

The user clicks the dbt Copilot button, and the user does not otherwise enter data. 

</Expandable>

<Expandable alt_header="Does dbt Copilot access my warehouse data?">

dbt Copilot utilizes metadata, including column names, model SQL, the model's name, and model documentation. The row-level data from the warehouse is never used or sent to a third-party provider. Such output must be double-checked by the user for completeness and accuracy.

</Expandable>

<Expandable alt_header="Can dbt Copilot data be deleted upon client written request?">

The data from using dbt Copilot, aside from usage data, _doesn't_ persist on dbt Labs systems. Usage data is retained by dbt Labs. dbt Labs doesn't have possession of any personal or sensitive data. To the extent client identifies personal or sensitive information uploaded by or on behalf of client to dbt Labs systems, such data can be deleted within 30 days of written request.

</Expandable>

<Expandable alt_header="Does dbt Labs own the output generated by dbt Copilot?">

No, you keep your rights to any code or artifacts generated when you use dbt Copilot. Your code will never be used to train AI models for other customers. For more information, see the [dbt Labs AI principles page](https://www.getdbt.com/legal/ai-principles).

</Expandable>

## Considerations

<Expandable alt_header="What are the considerations for using dbt Copilot?">

dbt Copilot has the following considerations to keep in mind:

- dbt Copilot is not available in the dbt Cloud CLI.
- dbt Copilot is not available in the dbt Cloud API.

Future releases will bring dbt Copilot to even more parts of the dbt Cloud application.

</Expandable>
