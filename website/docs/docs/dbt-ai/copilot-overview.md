---
title: "dbt Copilot"
id: "copilot-overview"
description: "dbt Copilot — встроенный ИИ-помощник dbt, позволяющий генерировать SQL, документацию, тесты и семантические модели одним нажатием."
sidebar_label: "Обзор dbt Copilot"
tags: [AI, Copilot]
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';
import CopilotConfigureAiProvider from '/snippets/_copilot-configure-ai-provider.md';

# dbt Copilot

<IntroText>
dbt Copilot помогает генерировать SQL, документацию, тесты и семантические модели в <Constant name="dbt_platform" />.
</IntroText>

<CopilotWizardDifferences/>


_Ранняя версия dbt Copilot в Studio IDE доступна только ограниченному числу аккаунтов. dbt Wizard доступен для всех аккаунтов и рекомендуется для разработки с использованием ИИ в Studio IDE &mdash; он поддерживает все возможности быстрых действий dbt Copilot, а также многошаговые изменения со встроенной проверкой._

## Лимиты действий по тарифным планам

Использование dbt Copilot измеряется в действиях &mdash; один выполненный запрос к ИИ считается одним действием. Каждый тарифный план включает ежемесячный лимит действий на одну лицензию:

<SimpleTable>
|Тарифный план              |Действий в месяц  |
|---------------------------|------------------|
|Developer                  | ❌               |
|Starter                    |100               |
|Enterprise                 |5,000             |
|Enterprise+                |10,000            |
</SimpleTable>

Лимиты Enterprise и Enterprise+ не действуют, если вы [используете собственный ключ (BYOK)](/docs/platform/wizard-byok-platform), поскольку оплату за такое использование взимает напрямую ваш поставщик ИИ. Для прежних тарифных планов уровня Enterprise, подключённых до 1 мая 2025 года, действует лимит в 1 000 действий.

В разделе [Использование ИИ в dbt](/docs/platform/billing/dbt-ai-usage) описано, что считается действием, что происходит при достижении лимита и как проверить объём использования. 

## Настройка поставщика ИИ для dbt Copilot {#configure-ai-provider-for-dbt-copilot}

Для изменения настроек аккаунта и настройки поставщиков необходимы права администратора <Constant name="dbt" />. dbt Copilot настраивается отдельно от <Constant name="wizard" /> &mdash; сведения о поставщиках для <Constant name="wizard" /> см. в разделе [Управление функциями ИИ](/docs/platform/manage-dbt-ai#configure-ai-provider).

<CopilotConfigureAiProvider />

## Важные замечания

- dbt Copilot — отдельный инструмент, отличающийся от <Constant name="wizard" />. Для разработки с ИИ-агентом на всех этапах жизненного цикла используйте [<Constant name="wizard" />](/docs/platform/wizard-overview).
- Функции ИИ включены по умолчанию. Администраторы могут [в любой момент отключить или снова включить их](/docs/platform/manage-dbt-ai).
- Некоторые функции доступны только в тарифных планах Enterprise и Enterprise+. Подробности см. в разделе [Оплата](/docs/platform/billing).
- dbt Copilot пока не поддерживает генерацию семантических моделей с использованием последней версии спецификации YAML.
