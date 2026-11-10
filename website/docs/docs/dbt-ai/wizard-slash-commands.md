---
title: "Справочник по слеш-командам Wizard"
id: "wizard-slash-commands"
description: "Полный справочник по слеш-командам интерактивного текстового интерфейса Wizard."
sidebar_label: "Справочник по слеш-командам"
tags: [AI, Wizard, Reference]
availability: local_all
---


import SlashGenerated from './_wizard-slash-commands-generated.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Справочник по слеш-командам <Constant name="wizard" /> <Lifecycle status="beta"/>

<IntroText>
Полный справочник по слеш-командам интерактивного текстового интерфейса <Constant name="wizard" />.
</IntroText>

:::info Автоматически сгенерированная страница
Эта страница сгенерирована автоматически. Если вы заметите какие-либо проблемы, [сообщите о них](https://github.com/dbt-labs/docs.getdbt.com/issues), и мы с радостью поможем их устранить.
:::

На этой странице описаны слеш-команды, поддерживаемые <Constant name="wizard" />. Это команды вида `/commands`, которые вводятся в сеансе интерактивного текстового пользовательского интерфейса (TUI) для управления поведением <Constant name="wizard" /> во время сеанса.

<WizardFeedbackCallout />

<SlashGenerated />

## Связанная документация

- [Справочник по командам CLI Wizard](/docs/dbt-ai/wizard-cli-reference) — флаги и подкоманды
- [Использование субагентов](/docs/dbt-ai/wizard-subagents) — команды `/agent` и `/subagents`
- [Режим без интерактивного интерфейса](/docs/dbt-ai/wizard-headless) — использование `wizard exec` в скриптах и CI
- [Справочник по конфигурации](/docs/dbt-ai/wizard-config) — ключи `config.toml` и порядок приоритета настроек
- [Справочник по командам dbt](/reference/dbt-commands) — `dbt run`, `dbt build` и другие команды dbt
