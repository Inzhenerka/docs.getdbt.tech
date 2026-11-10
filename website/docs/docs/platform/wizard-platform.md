---
title: "О dbt Wizard на платформе dbt"
id: "wizard-platform"
sidebar_label: "Обзор"
description: "dbt Wizard на платформе dbt помогает командам исследовать, изменять, проверять и выпускать надежные решения на dbt с помощью ИИ, учитывающего контекст хранилища данных."
hide_table_of_contents: false
image: /img/docs/dbt-platform/wizard-home-empty.png
tags: [AI, Wizard]
keywords: ["dbt Wizard", "dbt platform", "AI", "agent", "dbt"]
availability: platform_usage
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';
import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';
import WizardVideoCourse from '/snippets/_wizard-video-course.md';

# О dbt Wizard на платформе dbt <Lifecycle status="preview" />

<IntroText>
<Constant name="wizard" /> — это ИИ-агент dbt в <Constant name="dbt_platform" />, который помогает командам исследовать, изменять, проверять и выпускать надежные решения на dbt, опираясь на контекст хранилища данных.
</IntroText>

<Constant name="wizard" /> — это не просто универсальный агент для написания кода с доступом к dbt. Он создан для разработки данных в dbt с соблюдением правил управления, понимает зависимости данных, документацию, тесты и семантические определения, а также учитывает сборки в среде разработки, вычислительные ресурсы, время выполнения и проверку результатов сборки. Его предложения основаны на реальных данных вашего проекта _и_ его контексте. Но будьте осторожны: говорят, этот волшебник умеет <WizardPopcorn>творить заклинания</WizardPopcorn>.

Функции ИИ включаются по умолчанию. Они уже включены для новых аккаунтов и вскоре будут включены для существующих. Если ваша организация отказалась от их использования, они останутся отключенными. Администраторы могут в любой момент [отключить или снова включить ИИ и настроить провайдеров](/docs/platform/manage-dbt-ai).

<WizardTrialBilling />

## Где можно использовать dbt Wizard

- **[Главная вкладка Wizard](/docs/platform/wizard-home):** Задавайте вопросы о проекте, создавайте изменения, просматривайте различия и запускайте проверки &mdash; всё в одном месте.
- **[Studio IDE](/docs/dbt-ai/wizard-ide):** Работайте с <Constant name="wizard" /> рядом с редактором кода, консолью и проводником файлов.
- **[Терминал (CLI)](/docs/dbt-ai/wizard-cli):** Используйте того же агента из терминала, с аккаунтом <Constant name="dbt_platform" /> или без него.
- **[Wizard Desktop](/docs/dbt-ai/wizard-desktop):** Нативное приложение для создания и проверки данных, в котором рядом с чатом отображаются наглядные визуализации данных, различия в данных и граф зависимостей.

Вы можете обучить <Constant name="wizard" /> правилам вашей команды с помощью [навыков](/docs/dbt-ai/wizard-platform-skills), поручить более масштабные задачи [субагентам](/docs/dbt-ai/wizard-platform-subagents) или подключить проект к другим ИИ-инструментам через [MCP-сервер <Constant name="dbt_platform" />](/docs/dbt-ai/wizard-platform-mcp).


## Что вы можете делать

- Задавать вопросы о проекте и получать ответы, основанные на его контексте
- Создавать документацию, семантические модели, тесты и метрики
- Создавать модели или выполнять их рефакторинг по запросам на естественном языке
- Просматривать изменения файлов в виде сравнения версий перед сохранением
- Выполнять задачи от начала до конца в [режиме агента](/docs/dbt-ai/wizard-ide#agent-modes), подтверждая каждое изменение файла или разрешая <Constant name="wizard" /> вносить изменения автоматически
- Задавать вопросы о данных рабочей среды в [режиме Explore](/docs/dbt-ai/wizard-ide#agent-modes), в том числе [пользователям с доступом только для чтения](/docs/platform/wizard-read-only-users), у которых нет доступа к разработке
- Следить за ходом работы на панели навигации wayfinder, которая показывает текущие проект и ветку и помогает выполнять задачи Git, например создавать коммиты файлов или новые ветки
- Получать согласованные результаты с помощью [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills), в которых уже заложены лучшие практики dbt

Больше примеров см. в разделе [Сценарии использования и примеры](/docs/dbt-ai/wizard-use-cases).

:::tip Лучшие практики использования dbt Wizard
Большинство рабочих процессов из руководства [Как использовать dbt Wizard в проекте dbt](/best-practices/how-to-use-wizard/wizard-1-intro) применимы и здесь &mdash; запросы работают одинаково в <Constant name="studio_ide" /> и на главной вкладке <Constant name="wizard" />.
:::

## Поддерживаемые провайдеры ИИ {#supported-ai-providers}

<WizardSupportedProviders />

## Открытие dbt Wizard

1. Войдите в <Constant name="dbt_platform" />.
2. Выберите значок <Constant name="wizard" /> в меню навигации или откройте его в <Constant name="studio_ide"/>.
3. Введите запрос. Чтобы освоиться, попробуйте один из следующих:
   - `summarize what this project does`
   - `which models in this project have no tests?`
   - `add not_null and unique tests to the primary key of stg_customers`
4. ...и это всё 🎉!


<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-platform/wizard-ide-refactor-lineage.png" width="85%" title="dbt Wizard в Studio IDE выполняет рефакторинг модели и отображает граф зависимостей в интерфейсе чата."/>

<Lightbox src="/img/docs/dbt-platform/wizard-ide-refactor-diff.png" width="85%" title="Итоговый результат рефакторинга Wizard в виде сравнения версий в Studio IDE"/>

</DocCarousel>

Дополнительные идеи запросов см. в [сборнике запросов](/guides/prompt-cookbook).

Если <Constant name="wizard" /> недоступен, убедитесь, что ваш тарифный план поддерживает его и что администратор [включил доступ к функциям ИИ для аккаунта](/docs/platform/manage-dbt-ai#manage-ai-features).

<WizardVideoCourse />

## Пробный период и кредиты на использование

Каждый запрос, который вы отправляете в <Constant name="wizard" />, расходует токены ИИ-модели. Стоимость этих токенов зависит от вашего тарифного плана и от того, используете ли вы модель под <Term id="managed" /> управлением <Constant name="dbt" /> Labs или собственный ключ. Если вы [используете собственный ключ](/docs/platform/wizard-byok-platform), провайдер ИИ выставляет вам счета напрямую, а использование не списывается из вашего пула потребления.

[Устаревшие тарифные планы Team](/docs/platform/billing/plans-and-billing#legacy-plans) не предоставляют доступ к <Constant name="wizard" />. Чтобы использовать его, можно перейти на [тарифный план Starter, Enterprise или Enterprise+](https://www.getdbt.com/pricing).

Инструкции по запуску пробного периода и управлению расходами см. в разделах [Начало пробного периода](/docs/dbt-ai/pricing-billing/trial-and-billing#start-your-trial) и [Управление лимитом расходов](/docs/dbt-ai/pricing-billing/trial-and-billing#manage-your-spend-limit).

Чтобы выбрать провайдера или использовать собственный ключ, см. раздел [Управление функциями ИИ](/docs/platform/manage-dbt-ai#configure-ai-provider).

## Другие функции ИИ на платформе dbt

В <Constant name="dbt_platform" /> также есть функции ИИ, которые работают отдельно от <Constant name="wizard" />:

- [dbt Copilot](/docs/dbt-ai/copilot-overview) создает SQL, документацию, тесты и семантические модели одним нажатием в <Constant name="studio_ide" /> или <Constant name="insights" />.
- [dbt Support Assistant](/docs/dbt-support?version=2#ask-dbt-support-assistant) отвечает на вопросы о продукте и помогает создать обращение в поддержку. За дополнительной информацией обращайтесь в [службу поддержки dbt](mailto:support@getdbt.com).

<Expandable alt_header="Чем dbt Wizard отличается от dbt Copilot?">

<CopilotWizardDifferences />

</Expandable>

## Связанная документация

- [Главная вкладка <Constant name="wizard" />](/docs/platform/wizard-home)
- [<Constant name="wizard" /> в <Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide)
- [Как работает <Constant name="wizard" />](/docs/dbt-ai/wizard-how-it-works#in-the-dbt-platform) &mdash; архитектура и потоки данных в <Constant name="dbt_platform" />
- [Управление функциями ИИ в <Constant name="dbt_platform" />](/docs/platform/manage-dbt-ai) &mdash; настройка доступа к ИИ и провайдеров администратором
- [Настройка BYOK в <Constant name="dbt_platform" />](/docs/platform/wizard-byok-platform)
- [Модели и цены](/docs/dbt-ai/pricing-billing/overview)
- [Данные и конфиденциальность в <Constant name="dbt_platform" />](/docs/dbt-ai/dbt-ai-faqs#privacy-and-data)
