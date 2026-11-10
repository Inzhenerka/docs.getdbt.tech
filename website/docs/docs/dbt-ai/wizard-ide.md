---
title: "dbt Wizard в Studio IDE"
id: "wizard-ide"
description: "Используйте dbt Wizard в Studio IDE для создания или рефакторинга моделей dbt по запросам на естественном языке, проверки с помощью движка dbt и выполнения запросов в хранилище данных с учетом полного контекста проекта."
sidebar_label: "Wizard в Studio IDE"
tags: [AI, Agents, Studio]
availability: platform_usage
---

import CopilotResources from '/snippets/_use-copilot-resources.md';
import WizardIde from '/snippets/_wizard-ide.md';
import WizardExploreUsage from '/snippets/_wizard-explore-usage.md';
import WizardModelPicker from '/snippets/_wizard-model-picker.md';
import WizardVideoCourse from '/snippets/_wizard-video-course.md';

# dbt Wizard в Studio IDE <Lifecycle status="preview"/>

<IntroText>
Используйте <Constant name="wizard" /> в <Constant name="studio_ide" />, чтобы быстрее вносить надежные изменения в dbt. Он понимает ваш проект, отвечает на вопросы с учетом контекста, генерирует модели, тесты, документацию и определения <Constant name="semantic_layer" />, а также показывает различия в файлах перед сохранением изменений.
</IntroText>

<Constant name="wizard" /> поддерживает весь жизненный цикл разработки dbt — от исследования до проверки изменений. Используйте его, чтобы:

- Задавать вопросы о проекте с учетом связей между данными, метаданных и контекста каталога.
- Создавать модели или выполнять их рефакторинг по запросам на естественном языке.
- Генерировать и проверять YAML для тестов, документации, семантических моделей и метрик.
- Вносить целевые изменения в логику, имена, материализации, тесты и связанные YAML-файлы.
- Исследовать сбои заданий и запусков с помощью dbt Agent Skills.

Агент включает следующие возможности, доступные сразу и не требующие настройки:

- [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills): рекомендуемые dbt руководства и инструкции, поддерживаемые dbt Labs.
- [Набор инструментов Product docs сервера dbt MCP](/docs/dbt-ai/mcp-available-tools#product-docs): инструменты для поиска и получения материалов из официальной документации dbt.

Функции ИИ включаются по умолчанию. Они уже включены для новых аккаунтов и вскоре будут включены для существующих. Если ваша организация отказалась от их использования, они останутся выключенными. Администраторы могут в любое время [выключить или снова включить ИИ и настроить провайдеров](/docs/platform/manage-dbt-ai).

<WizardVideoCourse />

### Предварительные требования

- [Аккаунт <Constant name="dbt_platform" />](https://www.getdbt.com/signup) и [лицензия Developer](/docs/platform/manage-access/seats-and-users).
  - [Устаревшие тарифы Team](/docs/platform/billing/plans-and-billing#legacy-plans) не предоставляют доступ к <Constant name="wizard" />. Чтобы использовать его, перейдите на [тариф Starter, Enterprise или Enterprise+](https://www.getdbt.com/pricing).
- [Среда разработки](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) и учетные данные, настроенные в <Constant name="studio_ide" />.
- Используйте поддерживаемого провайдера ИИ. См. [Поддерживаемые провайдеры ИИ](/docs/platform/wizard-platform#supported-ai-providers) или [Таблицу тарифов провайдеров моделей](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model), где приведены полный список моделей и тарифы.

Если <Constant name="wizard" /> перестал отвечать, возможно, ваш аккаунт исчерпал доступные кредиты на использование. См. [Пробный период и оплата](/docs/dbt-ai/pricing-billing/trial-and-billing).

<WizardIde />

:::tip Рекомендации по использованию dbt Wizard
Рекомендуемые рабочие процессы для реальных задач проекта &mdash; изучения проекта, проверки изменений, создания определений Semantic Layer и других &mdash; см. в разделе [Как использовать dbt Wizard в проекте dbt](/best-practices/how-to-use-wizard/wizard-1-intro). Большинство этих запросов работают в Studio IDE аналогичным образом.
:::

## Задавайте вопросы в режиме Explore {#ask-questions-in-explore-mode}

Режим Explore в <Constant name="studio_ide"/> позволяет задавать вопросы о данных производственной среды на обычном языке. <Constant name="wizard" /> в режиме Explore отвечает и дает пояснения, но никогда не изменяет ваш проект. Этот режим отлично подходит для разведочного анализа данных и быстрого знакомства с ними.

В режиме Explore запросы выполняются с использованием ваших личных учетных данных для хранилища данных.

<WizardExploreUsage />

В <Constant name="studio_ide" /> ответ и его визуализация отображаются непосредственно на панели <Constant name="wizard" /> рядом с вашим проектом.

<Lightbox src="/img/docs/dbt-platform/wizard-ide-explore-viz.png" width="100%" title="Режим Explore в Studio IDE: диаграмма и переключатели Chart/Table/SQL на панели dbt Wizard." />

## Выбор модели

<WizardModelPicker />

## Связанная документация

- [О dbt Wizard на платформе dbt](/docs/platform/wizard-platform)
- [Контрольный список готовности к dbt v2](/docs/dbt/dbt-readiness)
- [Разработка с dbt Wizard](/docs/platform/studio-ide/develop-studio-ai)
- [Сборник примеров запросов](/guides/prompt-cookbook)
- [Семантические модели](/docs/build/semantic-models)
- [Об ИИ и интеллектуальных возможностях dbt](/docs/dbt-ai/about-dbt-ai)
