---
title: "Настройка BYOK для dbt Wizard на платформе dbt"
sidebar_label: "Настройка BYOK"
description: "Используйте собственный API-ключ для работы с dbt Wizard и dbt Copilot на платформе dbt. Поддерживаются OpenAI, Azure AI Foundry и Anthropic."
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import OpenAiProjectRegion from '/snippets/_open-ai-project-region.md';
import WizardConfigureAiProvider from '/snippets/_wizard-configure-ai-provider.md';

<IntroText>
Используйте собственный ключ (bring-your-own-key, BYOK), чтобы подключить <Constant name="wizard" /> или dbt Copilot на <Constant name="dbt_platform" /> к своей учётной записи у поставщика ИИ вместо использования инфраструктуры под управлением dbt Labs.
</IntroText>

Приведённые ниже инструкции по настройке BYOK применимы только к <Constant name="dbt_platform" />. О настройке BYOK для CLI см. в разделе [Настройка BYOK для dbt Wizard](/docs/dbt-ai/wizard-byok).

При настройке поставщика с собственным ключом расходы на использование отражаются в вашей учётной записи у поставщика, а не в учётной записи dbt Labs, и оплату за токены взимает выбранный вами поставщик.

Если вы предпочитаете обойтись без самостоятельного обслуживания, [вариант под управлением dbt Labs (<Term id="managed" />)](/docs/platform/manage-dbt-ai#configure-ai-provider) готов к использованию без настройки и включает [пробные и ежемесячные кредиты на использование](/docs/dbt-ai/pricing-billing/trial-and-billing).

## Предварительные требования

- [Учётная запись <Constant name="dbt_platform" />](https://www.getdbt.com/pricing) на тарифном плане Starter, Enterprise или Enterprise+
- Права администратора <Constant name="dbt" /> для включения функций ИИ и настройки поставщиков в **Account settings**
- API-ключ или учётные данные для поддерживаемого поставщика ИИ
<Expandable alt_header="Посмотреть полный список поддерживаемых поставщиков ИИ">

<WizardSupportedProviders />

#### dbt Copilot

dbt Copilot поддерживает различных поставщиков ИИ, в том числе использование собственного ключа (BYOK) на тарифных планах Starter, Enterprise и Enterprise+:

- API-ключ OpenAI под управлением dbt Labs (<Term id="managed" />)
- Собственный API-ключ OpenAI (BYOK)
- Собственный API-ключ Azure OpenAI (BYOK)

Snowflake Cortex, AWS Bedrock, Azure AI Foundry и Anthropic не поддерживаются в dbt Copilot.

</Expandable>

## Настройка поставщика ИИ

<WizardConfigureAiProvider />
