---
title: "Часто задаваемые вопросы об ИИ в dbt"
sidebar_label: "Вопросы об ИИ в dbt"
description: "Ответы на распространённые вопросы о функциях ИИ в dbt, включая dbt Wizard и dbt Copilot."
availability: all_users
---

import WizardArchitecturePlatform from '/snippets/_wizard-architecture-platform.md';

# Часто задаваемые вопросы об ИИ в dbt

<IntroText>
Ответы на распространённые вопросы о функциях ИИ в dbt, включая <Constant name="wizard" /> и dbt Copilot.
</IntroText>

<Constant name="wizard" /> — это ИИ-помощник, полностью интегрированный в вашу работу с <Constant name="dbt" />. Он берёт на себя рутинные задачи, ускоряет рабочие процессы и обеспечивает единообразие, помогая вам быстрее создавать высококачественные продукты на основе данных.

dbt Labs стремится защищать вашу конфиденциальность и данные. На этой странице описано, как <Constant name="wizard" /> обрабатывает ваши данные. Дополнительные сведения см. на странице [Принципы разработки ИИ в dbt Labs](https://www.getdbt.com/legal/ai-principles).

## Обзор

<Expandable alt_header="Что такое dbt Wizard?">

<Constant name="wizard" /> — это новейший и рекомендуемый инструмент на основе ИИ-агента для разработки с контролем и управлением данными в dbt. Wizard доступен в <Constant name="dbt_platform" />, в терминале через CLI и как [настольное приложение](/docs/dbt-ai/wizard-desktop). Он помогает командам быстрее и с меньшим риском внедрять надёжные изменения в dbt: учитывает контекст проекта, выбирает подходящие инструменты dbt, проверяет изменения и позволяет просматривать их перед сохранением.

Используйте <Constant name="wizard" />, чтобы исследовать происхождение данных и влияние на нижестоящие объекты, генерировать SQL или выполнять его рефакторинг по запросам на естественном языке, создавать [документацию](/docs/build/documentation), [тесты данных](/docs/build/data-tests), [метрики](/docs/build/metrics-overview) и [семантические модели](/docs/build/semantic-models), а также проверять изменения с учётом контекста хранилища данных.

В <Constant name="dbt_platform" /> инструмент <Constant name="wizard" /> доступен в [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-studio-ai) и на [главной вкладке <Constant name="wizard" />](/docs/platform/wizard-home). dbt Copilot доступен в [<Constant name="insights" />](/docs/explore/dbt-insights).

В CLI вы можете использовать <Constant name="wizard" /> из терминала для локальных процессов разработки.

В [Wizard Desktop](/docs/dbt-ai/wizard-desktop) инструмент <Constant name="wizard" /> доступен как нативное приложение. Просматривайте подробные визуализации данных, различия в данных и их происхождение, чтобы лучше понимать свои данные и изменения, и ведите несколько диалогов одновременно, каждый в отдельной ветке, чтобы работать над несколькими задачами параллельно.

</Expandable>

<Expandable alt_header="Где доступен dbt Wizard?" anchor_id="dbt-wizard-details-2">

<Constant name="wizard" /> доступен в <Constant name="dbt_platform" />, в терминале через CLI и как Wizard Desktop.

- На платформе вы можете использовать <Constant name="wizard" /> в [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) для разработки с контролем и управлением данными в dbt.
- В CLI используйте [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli) для локальной разработки и автоматизации.
- В [Wizard Desktop](/docs/dbt-ai/wizard-desktop) используйте нативное приложение с подробными визуализациями данных, сравнением данных, просмотром их происхождения и несколькими одновременными диалогами.

Чтобы использовать <Constant name="wizard" /> на платформе, вам нужна любая [учётная запись платформы](https://www.getdbt.com/contact) <Constant name="dbt" />. 

Все тарифные планы <Constant name="dbt_platform"/> предоставляют доступ к <Constant name="wizard" /> в <Constant name="studio_ide" /> и на [главной вкладке](/docs/platform/wizard-home).

Функции ИИ включены по умолчанию. Администраторы могут [отключать и снова включать их в любое время](/docs/platform/manage-dbt-ai).

</Expandable>

<Expandable alt_header="Каковы преимущества использования dbt Wizard?" anchor_id="dbt-wizard-details-3">

<Constant name="wizard" /> помогает командам быстрее и с меньшим риском внедрять надёжные изменения в dbt. Используйте его, чтобы:

- Задавать вопросы с учётом контекста проекта и исследовать происхождение данных, зависимости и влияние на нижестоящие объекты.
- Генерировать SQL или выполнять его рефакторинг по запросам на естественном языке.
- Генерировать документацию, тесты, метрики и семантические модели.
- Проверять изменения с учётом контекста хранилища данных перед рецензированием.
- Просматривать предлагаемые изменения файлов в виде различий перед их сохранением.

<Constant name="wizard" /> встроен в инструменты dbt и использует механизмы dbt для управления, защиты конфиденциальности и обеспечения безопасности.

</Expandable>

<Expandable anchor_id="is-dbt-wizard-the-same-as-dbt-copilot" alt_header="dbt Wizard и dbt Copilot — это одно и то же?">

Нет, <Constant name="wizard" /> и dbt Copilot — это отдельные продукты.

<Constant name="wizard" /> — это новейший продукт на основе ИИ-агента нового поколения, доступный в <Constant name="dbt_platform" /> и как CLI. Он использует контекст вашего проекта, помогая быстрее разрабатывать изменения в dbt с соблюдением правил управления. Представьте его как умного ИИ-агента, у которого есть карта вашего проекта. Вместо того чтобы вам приходилось читать каждый файл и разбираться в контексте, он может отвечать на вопросы и помогать вам быстрее разрабатывать _и_ проверять изменения.

Для пользователей, имеющих доступ к функциям dbt Copilot, они включают кнопки быстрых действий в <Constant name="studio_ide" /> и панель Copilot в <Constant name="insights" />.

</Expandable>

<Expandable alt_header="Можно ли использовать имеющийся лимит действий dbt Copilot в dbt Wizard?">

Нет, действия dbt Copilot применяются только к использованию dbt Copilot. См. [часто задаваемые вопросы об оплате и доступе к ИИ в <Constant name="wizard" />](/docs/dbt-ai/wizard-billing-faqs).

</Expandable>

## Доступность

<Expandable alt_header="У кого есть доступ к dbt Wizard?" anchor_id="dbt-wizard-details-4">

**В <Constant name="dbt_platform" />**:

После включения администратором <Constant name="wizard" /> доступен пользователям с [лицензией разработчика](/docs/platform/manage-access/seats-and-users) <Constant name="dbt" /> в любой [учётной записи платформы dbt](https://www.getdbt.com/contact).
**В Wizard Desktop**:

<Constant name="wizard" /> Desktop работает без учётной записи <Constant name="dbt_platform" />, поэтому его можно использовать с самостоятельно размещённым проектом dbt. Используйте [BYOK](/docs/dbt-ai/wizard-byok), чтобы подключить собственные учётные данные провайдера ИИ без входа в систему. Если вместо этого вы зарегистрируете бесплатную учётную запись <Constant name="dbt" />, вы получите 30-дневный пробный период с ключами, управляемыми dbt.

Инструкции по установке и настройке см. в разделе [Wizard Desktop](/docs/dbt-ai/wizard-desktop).

**В CLI**:

<Constant name="wizard" /> CLI использует модели под управлением dbt Labs (OpenAI, Anthropic или модели с открытыми весами), оплата за которые осуществляется через систему dbt с лимитом расходов. Вы также можете использовать собственный API-ключ или учётные данные поддерживаемого провайдера с помощью [BYOK](/docs/dbt-ai/wizard-byok): OpenAI, Anthropic, Azure AI Foundry, AWS Bedrock, Google Gemini или Snowflake Cortex (предварительная версия). BYOK — хороший запасной вариант, если вы хотите напрямую управлять расходами на ИИ &mdash; оплату за токены взимает непосредственно выбранный вами провайдер. Установите и настройте CLI на своём локальном компьютере.

Дополнительные сведения см. в разделе [Wizard в CLI](/docs/platform/wizard-overview#wizard-in-the-cli-).

</Expandable>

<Expandable alt_header="Доступен ли dbt Wizard для всех типов развёртывания?" anchor_id="dbt-wizard-details-5">

Да, <Constant name="wizard" /> развёрнут во всех средах, включая [многопользовательские и выделенные развёртывания](/docs/platform/about-platform/access-regions-ip-addresses).

</Expandable>

## Как это работает

<Expandable alt_header="Какие данные и код используются для обучения ИИ-модели, на которой работает dbt Wizard?" anchor_id="dbt-wizard-details-6">


<Constant name="wizard" /> работает на моделях под управлением dbt Labs (OpenAI, Anthropic или моделях с открытыми весами) либо, по вашему выбору, на предварительно обученных ИИ-моделях сторонних провайдеров (BYOK OpenAI, BYOK Anthropic, BYOK Azure AI Foundry и т. д.). При использовании OpenAI в режиме <Term id="managed" /> наше соглашение с OpenAI запрещает OpenAI сохранять ваши данные на постоянной основе. Дополнительные сведения см. на [странице принципов ИИ dbt Labs](https://www.getdbt.com/legal/ai-principles).


</Expandable>

<Expandable alt_header="Каких провайдеров ИИ-моделей использует dbt Wizard?" anchor_id="dbt-wizard-details-7">

В <Constant name="dbt_platform" /> инструмент <Constant name="wizard" /> по умолчанию использует управляемую модель OpenAI. dbt Labs также предлагает управляемые модели с открытыми весами. На любом тарифном плане вы также можете [использовать собственные ключи провайдера](/docs/platform/wizard-byok-platform) для OpenAI, Anthropic или Azure AI Foundry.

[<Constant name="wizard"/> CLI](/docs/dbt-ai/wizard-cli) поддерживает те же модели под управлением dbt Labs, а также OpenAI, Anthropic, Azure AI Foundry, AWS Bedrock, Google Gemini и Snowflake Cortex (предварительная версия) в режиме использования собственного ключа. Дополнительные сведения см. в разделах [Настройка BYOK](/docs/dbt-ai/wizard-byok) и [Поддерживаемые провайдеры ИИ](/docs/dbt-ai/pricing-billing/overview#supported-ai-providers).

О том, как выбор модели влияет на стоимость, какие модели расходуют общий лимит потребления и как работает оплата при использовании BYOK, см. в разделе [Часто задаваемые вопросы об оплате и доступе к <Constant name="wizard" />](/docs/dbt-ai/wizard-billing-faqs).

Дополнительные сведения см. в [таблице тарифов провайдеров моделей](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) и [таблице потребления сервисов](https://www.getdbt.com/legal/service-consumption-table).

</Expandable>

<Expandable alt_header="Поддерживается ли BYOK (использование собственного ключа) на уровне проекта?">

В <Constant name="dbt_platform" /> параметр BYOK для <Constant name="wizard"/> сейчас настраивается только на уровне учётной записи. Однако в будущем мы можем добавить возможность настройки на уровне проекта. BYOK — хороший вариант, если вы хотите напрямую управлять расходами на ИИ вместо использования модели под управлением dbt Labs.

<Constant name="wizard" /> CLI поддерживает BYOK локально для OpenAI, Anthropic, Azure AI Foundry, AWS Bedrock, Google Gemini и Snowflake Cortex (предварительная версия). 

</Expandable>

## Конфиденциальность и данные {#privacy-and-data}

В этом разделе рассматривается <Constant name="wizard" /> в <Constant name="dbt_platform" />. Сведения о том, какие данные собирает CLI и как отказаться от их сбора, см. в разделе [Использование данных и телеметрия в <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-telemetry).

<WizardArchitecturePlatform />

<Expandable alt_header="Получает ли dbt Wizard доступ к данным моего хранилища?" anchor_id="dbt-wizard-details-8">

<Constant name="wizard" /> может выполнять команды dbt и запросы от вашего имени, причём для каждого запроса сначала требуется ваше явное разрешение. При выполнении запроса <Constant name="wizard" /> отправляет его результаты &mdash; которые могут включать данные на уровне строк &mdash; провайдеру ИИ, чтобы тот мог сформировать ответ в вашем сеансе.

Для провайдеров ИИ, работающих в режиме dbt-<Term id="managed"/>, у нас действуют соглашения, запрещающие провайдеру использовать эти данные для обучения и ограничивающие срок их хранения. Если вы используете собственного провайдера ИИ (BYOK), хранение данных и их использование для обучения регулируются условиями этого провайдера. Всегда проверяйте точность результатов работы ИИ.

Дополнительные сведения см. в [таблице тарифов провайдеров моделей](https://www.getdbt.com/legal/dbt-wizard-token-costs-by-model) и [таблице потребления сервисов](https://www.getdbt.com/legal/service-consumption-table).

</Expandable>

<Expandable alt_header="Хранит или использует ли dbt Wizard персональные данные?" anchor_id="dbt-wizard-details-9">

<Constant name="wizard" /> хранит историю ваших диалогов &mdash; включая ваши запросы, ответы и любые результаты запросов к данным, полученные во время сеанса, &mdash; чтобы вы могли возвращаться к прошлым беседам. История диалогов хранится 90 дней; отзывы, которые вы оставляете о диалогах с <Constant name="wizard" />, хранятся 400 дней. Вы можете в любое время удалить историю диалогов или отзывы в интерфейсе продукта.

Вы сами контролируете информацию, которую передаёте <Constant name="wizard" />. dbt Labs не использует ваши запросы, историю диалогов, результаты команд или отзывы для обучения ИИ-моделей.

</Expandable>

<Expandable alt_header="Использует ли dbt Labs мои данные для обучения ИИ-моделей?">

Нет. dbt Labs не использует содержимое клиентов, обрабатываемое <Constant name="wizard" />, &mdash; включая результаты запросов к хранилищу данных, запросы пользователей и историю диалогов &mdash; для обучения ИИ-моделей. Наши условия с провайдерами ИИ также запрещают обучение на стороне провайдера.

</Expandable>

<Expandable alt_header="Передаёт ли dbt Labs мои персональные данные третьим лицам?" anchor_id="dbt-labs-details-2">

dbt Labs передаёт персональные данные клиентов только в той мере, в какой это необходимо для оказания услуг, по указанию клиента либо по юридическим, налоговым причинам или для соблюдения нормативных требований.

</Expandable>

<Expandable alt_header="Можно ли удалить данные dbt Wizard по письменному запросу клиента?" anchor_id="dbt-wizard-details-10">

Да. История диалогов с <Constant name="wizard" /> по умолчанию хранится 90 дней, отзывы, которые вы оставляете о диалогах с <Constant name="wizard" />, хранятся 400 дней, и вы можете в любое время удалить эту информацию в интерфейсе продукта. Если клиент укажет, какие персональные или конфиденциальные сведения были загружены в системы dbt Labs, эти данные могут быть удалены в течение 30 дней после письменного запроса.

</Expandable>

<Expandable alt_header="Принадлежат ли dbt Labs права на результаты, созданные dbt Wizard?">


dbt Labs не будет оспаривать ваше право собственности на любые уникальные для вашей компании результаты (например, код или артефакты), созданные при использовании <Constant name="wizard" />. Ваш код не будет использоваться для обучения ИИ-моделей в интересах dbt Labs или других третьих лиц, включая других клиентов dbt Labs.

</Expandable>

<Expandable alt_header="Есть ли у dbt Labs соответствующие условия использования?" anchor_id="dbt-labs-details-3">


Использование dbt Wizard регулируется нашими [Условиями использования](https://www.getdbt.com/terms-of-use). Если клиентам нужны дополнительные условия, они могут заключить предварительно подписанное Дополнение об ИИ и бета-версиях (AI & Beta Addendum); подпись dbt Labs будет датирована датой подписания клиентом. Для получения дополнительной информации обратитесь к своему менеджеру по работе с клиентами.

Клиентам, подписавшим договор с условиями после января 2024 года, не требуются дополнительные условия перед включением <Constant name="wizard" />. Данные клиентов, заключивших договор ранее, также защищены обязательствами по соблюдению конфиденциальности и удалению данных. Если клиентам нужны дополнительные условия, они могут заключить предварительно подписанное Дополнение об ИИ и бета-версиях (AI & Beta Addendum); подпись dbt Labs будет датирована датой подписания клиентом.

</Expandable>

## Особенности использования

<Expandable alt_header="Что следует учитывать при использовании dbt Wizard?" anchor_id="dbt-wizard-details-11">

- <Constant name="wizard" /> недоступен в API <Constant name="dbt" />.

В будущих выпусках планируется сделать <Constant name="wizard" /> доступным в ещё большем числе разделов приложения <Constant name="dbt" />.

</Expandable>

## URL-адреса dbt Wizard для списка разрешённых

<Expandable alt_header="Добавление URL-адресов в список разрешённых">

<Constant name="wizard" /> не блокирует специально URL-адреса, связанные с ИИ. Однако если ваша организация использует платформы защиты конечных точек, межсетевые экраны или сетевые прокси (например, Zscaler), при работе с <Constant name="wizard" /> вы можете столкнуться со следующими проблемами:

    - Блокировка неизвестных доменов или доменов, связанных с ИИ.
    - Прерывание TLS/SSL-трафика для его проверки.
    - Запрет определённых портов или сервисов.

Рекомендуем добавить следующие URL-адреса в список разрешённых:

**Для <Constant name="wizard" /> в IDE**:

- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_generic_tests/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_documentation/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_semantic_model/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_inline`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_metrics/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/track_response`

</Expandable>
