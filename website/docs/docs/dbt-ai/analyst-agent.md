---
title: "dbt Copilot в Insights"
id: "analyst-agent"
description: "Общайтесь со своими данными с помощью агента Analyst на базе dbt Semantic Layer"
sidebar_label: "Copilot в Insights"
tags: [AI, Agents, Semantic Layer]
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# dbt Copilot в Insights  <Lifecycle status="beta"/>

dbt Copilot в Insights позволяет общаться со своими данными и получать точные ответы на базе [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). В отличие от универсальных чат-интерфейсов с ИИ, <Constant name="wizard" /> в <Constant name="insights" /> предоставляет согласованные, объяснимые результаты с прозрачным SQL, информацией о происхождении данных и политиках работы с ними.

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';

<CopilotWizardDifferences/>


## Предварительные требования 

- Включите бета-функции в разделе **Account settings** > **Personal profile** > **Experimental features**. Инструкции см. в разделе [Предварительное знакомство с новыми функциями платформы dbt](/docs/dbt-versions/experimental-features).
- Получите доступ к [dbt Insights](/docs/explore/dbt-insights) и выполните предварительные требования для его использования.
- Используйте тарифный план [уровня Enterprise](https://www.getdbt.com/pricing) на <Constant name="dbt_platform" /> &mdash; [запишитесь на демонстрацию](https://www.getdbt.com/contact), чтобы узнать больше о <Constant name="insights" />.
- Функция доступна во всех конфигурациях [тенантов](/docs/platform/about-platform/tenancy). 
- У вас должна быть [лицензия разработчика](/docs/platform/manage-access/seats-and-users) <Constant name="dbt" /> с доступом к <Constant name="insights" />.
- Настройте [учётные данные пользователя](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide).

## Использование dbt Copilot в Insights

import AnalystAgentsCopilot from '/snippets/_analyst_agents-copilot.md';

<AnalystAgentsCopilot/>
