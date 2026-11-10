---
title: "Обзор dbt Wizard"
id: "wizard-overview"
description: "dbt Wizard — ИИ-агент, специально созданный для разработки данных с соблюдением правил управления в dbt. Доступен в dbt platform, Wizard Desktop и в терминале."
sidebar_label: "Обзор"
pagination_next: null
keywords: ["dbt Wizard", "dbt Agents", "AI", "analytics", "dbt"]
availability:
  surface:
    - local
    - platform
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardCliInstall from '/snippets/_wizard-cli-install-by-version.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';
import WizardVideoCourse from '/snippets/_wizard-video-course.md';

# О dbt Wizard

<IntroText>
Ваш персональный dbt-агент &mdash; где бы вы ни работали.
</IntroText>

<Constant name="wizard" /> — ИИ-агент, специально созданный для разработки данных с соблюдением правил управления в dbt. В отличие от универсальных агентов для написания кода, он понимает ваш проект dbt благодаря [dbt Information Schema](/docs/build/dbt-information-schema) &mdash; структурированному представлению графа зависимостей, состояния моделей, тестов, контрактов, результатов запусков и семантических определений.

Представьте карту вашего города: <Constant name="wizard" /> знает, как всё связано, ещё до начала работы, а не обходит каждую улицу, чтобы разобраться в планировке. <Constant name="wizard"/> предоставляет следующие возможности:

- **Понимание проекта:** dbt Information Schema предоставляет сведения о графе зависимостей, контрактах, тестах и контексте выполнения
- **Оценка влияния:** проверяет вышестоящие и нижестоящие зависимости до изменения кода
- **Безопасная проверка:** компилирует и собирает изменения перед проверкой
- **Полный рабочий процесс:** исследование, внесение изменений, проверка и рецензирование в одном месте
- **Настройка и управление:** работает сразу после установки со встроенными механизмами управления dbt
- **Диалоговая аналитика:** отвечает на вопросы о производственных данных на естественном языке через [режим Explore](/docs/dbt-ai/wizard-ide#agent-modes), опираясь на управляемые определения метрик

<WizardTrialBilling/>

## Использование dbt Wizard

<Constant name="wizard" /> предназначен для всех, кто занимается разработкой с помощью dbt или изучает его. Вы можете использовать его в <Constant name="dbt_platform" />, локально в терминале или IDE, а также в нативном приложении [Wizard Desktop](/docs/dbt-ai/wizard-desktop), где рядом с чатом отображаются расширенные визуализации данных, различия в данных и граф зависимостей. <Constant name="wizard" /> работает с любым хранилищем данных и любой [версией dbt](/docs/introduction#dbt-versions).

<Constant name="wizard" /> также подходит тем, кто не разрабатывает модели данных. В <Constant name="dbt_platform" /> [режим Explore](/docs/dbt-ai/wizard-ide#agent-modes) позволяет [пользователям с доступом только для чтения](/docs/platform/wizard-read-only-users) задавать вопросы о производственных данных на естественном языке без лицензии разработчика и дополнительной настройки.

В следующей таблице показано, где доступен <Constant name="wizard" />, какие ключи доступа к ИИ используются в каждой среде и как оплачивается использование:

<SimpleTable>

| Где | Статус | Варианты доступа к ИИ |
|---|---|---|
| [<Constant name="dbt_platform" />: <Constant name="studio_ide" /> ](/docs/dbt-ai/wizard-ide) | Общедоступная предварительная версия | dbt <Term id="managed" /> или BYOK |
| [<Constant name="dbt_platform" />: домашняя вкладка Wizard](/docs/platform/wizard-home) | Общедоступная предварительная версия | dbt <Term id="managed" /> или BYOK |
| [Локально: Wizard Desktop](/docs/dbt-ai/wizard-desktop) | Общедоступная бета-версия | dbt <Term id="managed" /> или BYOK |
| [Локально: Wizard в терминале (CLI)](/docs/dbt-ai/wizard-cli) | Общедоступная бета-версия | dbt <Term id="managed" />, BYOK или подписка OpenAI |
</SimpleTable>

<WizardVideoCourse />

## Поддерживаемые провайдеры

<WizardSupportedProviders />

Сведения о ценах и порядке оплаты см. в разделе [Модели и цены](/docs/dbt-ai/pricing-billing/overview). 

Если у провайдера ИИ-моделей (OpenAI, Anthropic или Fireworks) происходит сбой, трафик dbt <Term id="managed" /> в <Constant name="dbt_platform"/> переключается на [резервного провайдера](/docs/dbt-ai/pricing-billing/overview#automatic-backup-during-outages), поэтому <Constant name="wizard" /> продолжает работать.

## Начало работы {#get-started}

Вы можете начать работу с Wizard в привычной среде, будь то терминал или <Constant name="dbt_platform" />:
- [Wizard Desktop](#wizard-desktop)
- [Wizard в <Constant name="dbt_platform"/>](#wizard-in-dbt-platform)
- [Wizard в CLI](#wizard-in-the-cli)

(Будьте осторожны: этот волшебник умеет <WizardPopcorn>творить заклинания</WizardPopcorn>.)

### Wizard Desktop <Lifecycle status="beta"/> {#wizard-desktop}

Wizard Desktop — это Wizard в виде нативного приложения. Wizard Desktop использует тот же движок, что и dbt Wizard CLI, но даёт полную картину: диаграммы, таблицы, различия и граф зависимостей отображаются прямо в приложении, чтобы вы могли видеть ход работы, направлять её и вести несколько чатов одновременно, каждый в своей ветке.

Возможности Desktop:

- **Параллельные чаты:** каждый чат получает собственное <Term id="git-worktree" /> <Constant name="git" />, поэтому несколько задач выполняются одновременно без конфликтов.
- **Наглядная проверка:** просматривайте структурированные результаты, включая представление `dbt-compare`, показывающее, как ваши изменения повлияли на данные.
- **Контекстные комментарии:** наведите указатель почти на любой элемент, чтобы оставить комментарий именно к нему, а затем отправьте несколько комментариев вместе.
- **Диаграммы и таблицы:** задайте вопрос о своих данных и получите ответ прямо в чате.
- **Влияние изменений в контексте:** смотрите, какие модели затрагивают изменения <Constant name="wizard" />, и открывайте различия прямо на месте.
- **Просмотр графа зависимостей, файлов и метрик:** изучайте проект рядом с чатом.

<DownloadCard />

Подробнее см. в разделе [Начало работы с Wizard Desktop](/docs/dbt-ai/wizard-desktop).

### Wizard в dbt platform <Lifecycle status="preview"/> {#wizard-in-dbt-platform}

Используйте возможности агента в основном приложении или [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) для разработки данных с соблюдением правил управления в dbt.

Функции ИИ включены по умолчанию, поэтому большинство аккаунтов могут сразу приступить к работе. Если в вашем аккаунте они отключены, администратор может снова включить их в разделе [настройках аккаунта](/docs/platform/manage-dbt-ai#manage-ai-features).

Чтобы начать работу:

1. Войдите в [<Constant name="dbt_platform" />](https://www.getdbt.com/signup) или создайте бесплатный аккаунт, если у вас его ещё нет.
2. Откройте <Constant name="wizard" /> на **домашней вкладке** в левой боковой панели или из [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide), чтобы работать рядом с редактором файлов.
3. Начните работу с доступными кредитами на использование или воспользуйтесь 30-дневным пробным периодом. Аккаунты Enterprise и Enterprise+ получают кредиты на использование ежемесячно; на всех остальных тарифах можно начать пробный период. См. раздел [Пробный период и оплата](/docs/dbt-ai/pricing-billing/trial-and-billing).
4. Попробуйте ввести запрос, например:
    - `summarize what this project does`
    - `list all models with no tests`
    - `add not_null and unique tests to the primary key of stg_customers`

Другие запросы см. в разделе [Сценарии использования и примеры](/docs/dbt-ai/wizard-use-cases).

<a id="wizard-in-the-cli-" />

### Wizard в CLI <Lifecycle status="beta"/> {#wizard-in-the-cli}

Агент для работы в терминале, предназначенный для разработки данных с соблюдением правил управления в dbt, независимо от того, использует ли ваша команда <Constant name="dbt_platform" /> или размещает dbt самостоятельно. Используйте собственный ключ, чтобы пройти полный цикл аналитической разработки с помощью агента.

<WizardCliInstall />
<NewToTerminal />

## Связанная документация

- [dbt Wizard в Studio IDE](/docs/dbt-ai/wizard-ide) — создавайте документацию, тесты, семантические модели и SQL, а также делегируйте полный цикл работы с моделями
- [Приглашение пользователей с доступом только для чтения в dbt Wizard](/docs/platform/wizard-read-only-users) — дайте бизнес-пользователям возможность задавать вопросы о производственных данных в режиме Explore без доступа к разработке
- [Использование навыков в dbt platform](/docs/dbt-ai/wizard-platform-skills) — предоставляйте dbt Wizard многократно используемые инструкции для вашего проекта
- [Использование MCP-серверов с dbt Wizard CLI](/docs/dbt-ai/wizard-mcp) — подключайте к dbt Wizard CLI дополнительные инструменты и источники контекста
- [Переход на dbt Wizard](/docs/dbt-ai/wizard-migrate) — переходите с Claude Code, Cursor или другого ИИ-агента на dbt Wizard
- [Часто задаваемые вопросы о конфиденциальности и данных](/docs/dbt-ai/dbt-ai-faqs#privacy-and-data) — узнайте, как dbt Wizard обеспечивает конфиденциальность и работает с данными

<WizardFeedbackCallout />
