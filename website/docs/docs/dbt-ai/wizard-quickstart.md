---
title: "Использование dbt Wizard локально"
id: "wizard-quickstart"
description: "Установите локальный CLI dbt Wizard, выполните первоначальную настройку и отправьте первый запрос из терминала."
sidebar_label: "Использование dbt Wizard локально"
tags: [AI, CLI, dbt Wizard]
availability: local_all
unlisted: true
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardCliOnboarding from '/snippets/_wizard-cli-onboarding.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';

# Использование <Constant name="wizard" /> локально <Lifecycle status="beta"/>

<IntroText>
Установите <Constant name="wizard" /> локально и начните сеанс разработки dbt с ИИ-агентом из терминала. 

</IntroText>

<WizardCliDbtCliSupport />

<WizardTrialBilling />

## Предварительные требования

- Доступ к [поддерживаемому поставщику ИИ](#supported-ai-providers). Используйте поставщика, управляемого dbt, или настройте [BYOK](/docs/dbt-ai/wizard-byok) с собственными учётными данными поставщика.
- Проект dbt со сформированным каталогом `target/` (выполните `dbt parse`, `dbt compile` или `dbt build`)

<Constant name="wizard" /> не зависит от используемого хранилища данных и работает как с v1, так и с v2.

## Поддерживаемые поставщики ИИ {#supported-ai-providers}

<WizardSupportedProviders defaultSurface="local" />

<VersionBlock lastVersion="1.99">

:::tip Перейдите на <Constant name="fusion_engine" />
При использовании <Constant name="fusion_engine"/> (версии 2.0 и выше) запускайте <Constant name="wizard"/> командой `wizard`, а для команд CLI используйте `wizard COMMAND_NAME`.
:::

</VersionBlock>


## Установка и настройка dbt Wizard

<WizardCliOnboarding />

:::tip Рекомендации по использованию dbt Wizard
После завершения настройки ознакомьтесь с руководством [Как использовать dbt Wizard в проекте dbt](/best-practices/how-to-use-wizard/wizard-1-intro), в котором описаны рекомендуемые рабочие процессы для реальных задач проекта.
:::

## Полезные команды терминала

Для начала работы используйте следующие команды:

<SimpleTable>

| Команда | Описание | Пример |
|---------|-------------|---------|
| `wizard "[prompt]"` | Запустить интерактивный сеанс с начальным запросом. После активации сеанса запросы можно вводить без кавычек. | `wizard "summarize what this project does"` |
| `wizard exec "[prompt]"` | Выполнить один запрос в неинтерактивном режиме и завершить работу | `wizard exec "list all models with no tests"` |
| `wizard review --uncommitted` | Выполнить проверку кода для незакоммиченных изменений в неинтерактивном режиме | `wizard review --uncommitted` |
| `wizard review --base BRANCH` | Проверить изменения относительно базовой ветки | `wizard review --base main` |
| `wizard resume` | Возобновить предыдущий сеанс | `wizard resume --last` |
| `wizard apply` | Применить последние изменения Wizard к рабочему каталогу | `wizard apply TASK_ID` |
| `wizard login` / `logout` | Пройти аутентификацию с помощью учётной записи dbt | `wizard login` |
| `wizard mcp` | Управлять подключениями к серверам MCP | `wizard mcp add dbt` |
| `wizard update` | Обновить Wizard до последней версии | `wizard update` |

</SimpleTable>

:::tip Нужно повторить первоначальную настройку?
Если вы хотите повторить первоначальную настройку — заново пройти аутентификацию, сбросить конфигурацию проекта или повторно вызвать запрос о доверии к папке &mdash; обратитесь к разделу [Повторный запуск процедур первоначальной настройки](/docs/dbt-ai/wizard-config#re-trigger-onboarding-flows).
:::

## Дальнейшие шаги

- [Варианты использования и примеры](/docs/dbt-ai/wizard-use-cases) — практические сценарии аналитической инженерии
- [Справочник по установке и обновлению](/docs/dbt-ai/wizard-cli) — подробные сведения об установке, обновлении и удалении
- [Настройка BYOK](/docs/dbt-ai/wizard-byok) — управление ключом API и выбор модели ИИ
- [Как использовать dbt Wizard в проекте dbt](/best-practices/how-to-use-wizard/wizard-1-intro) — рекомендуемые рабочие процессы
- [Использование навыков локально](/docs/dbt-ai/wizard-skills) — предоставление Wizard многократно используемых инструкций для вашего проекта
- [Использование серверов MCP](/docs/dbt-ai/wizard-mcp) — подключение CLI <Constant name="wizard" /> к дополнительным инструментам и источникам контекста
- [Переход с Claude Code](/docs/dbt-ai/wizard-migrate) — перенос существующего контекста проекта из Claude Code в <Constant name="wizard" />

<WizardFeedbackCallout />
