---
title: "Быстрый старт с dbt"
id: get-started-dbt
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
availability: all_users
---

Начните знакомство с dbt, выбрав удобный для вас способ разработки:

- [**<Constant name="dbt_platform" />** ](#the-dbt-platform) &mdash; Разрабатывайте в браузере с помощью <Constant name="studio_ide" /> или используйте локальные инструменты (расширение для VS Code, <Constant name="platform_cli" />), подключённые к вашей учётной записи на платформе. Платформа предоставляет управляемые средства CI/CD, хостинг документации, <Constant name="insights" /> и многое другое. Поддерживаются оба движка: [<Constant name="fusion_engine" />](/docs/introduction) и [<Constant name="core" />](/docs/local/install-dbt).
- [**Только на собственной инфраструктуре**](#self-hosted-dbt-installations) &mdash; Используйте локальные инструменты, такие как [расширение dbt для VS Code](/docs/about-dbt-extension), или [установите dbt](/docs/local/install-dbt) локально, чтобы разрабатывать и запускать dbt на собственной инфраструктуре. Локальные инструменты можно использовать как с учётной записью <Constant name="dbt_platform" />, так и без неё.
- **Локальная разработка + <Constant name="dbt_platform" />** &mdash; Используйте расширение для VS Code или <Constant name="platform_cli" /> с учётной записью <Constant name="dbt_platform" />, чтобы разрабатывать локально и при этом пользоваться возможностями платформы, такими как CI/CD, хостинг документации и многое другое.
- [**<Constant name="wizard" />**](/docs/platform/wizard-overview) &mdash; ИИ-агент для аналитической инженерии, доступный в <Constant name="dbt_platform" /> и из терминала. В своей работе опирается на граф зависимостей вашего проекта, состояние моделей и семантические определения.

## Платформа dbt {#the-dbt-platform}

<Constant name="dbt" /> предоставляет полностью управляемую среду для разработки, запуска и развёртывания проектов dbt — с CI/CD, хостингом документации и многим другим. Узнайте больше о [возможностях <Constant name="dbt" />](/docs/platform/about-platform/dbt-platform-features) и [начните бесплатный пробный период](https://www.getdbt.com/signup/) уже сегодня. 

<Constant name="fusion_engine" /> добавляет управляемое выполнение и единый процесс разработки, чтобы вы могли сосредоточиться на создании проектов, а не на инфраструктуре.

Выберите своё хранилище данных, чтобы начать работу с кратким руководством:

<div className="grid--3-col">

<Card
    title="Быстрый старт для dbt и Amazon Athena"
    body="Интегрируйте dbt с Amazon Athena для выполнения преобразований данных."
    link="https://docs.getdbt.tech/guides/athena"
    icon="athena"/>

<Card
    title="Быстрый старт для dbt и Azure Synapse Analytics"
    body="Узнайте, как интегрировать dbt с Azure Synapse Analytics для выполнения преобразований данных."
    link="https://docs.getdbt.tech/guides/azure-synapse-analytics"
    icon="azure-synapse-analytics-2"/>

<Card
    title="Быстрый старт для dbt и BigQuery"
    body="Узнайте, как использовать dbt вместе с BigQuery для упрощения аналитических рабочих процессов."
    link="https://docs.getdbt.tech/guides/bigquery"
    icon="bigquery"/>

<Card
    title="Быстрый старт для dbt и Databricks"
    body="Узнайте, как интегрировать dbt с Databricks для эффективной обработки и анализа данных."
    link="https://docs.getdbt.tech/guides/databricks"
    icon="databricks"/>

<Card
    title="Быстрый старт с dbt и Microsoft Fabric"
    body="Узнайте, как dbt и Microsoft Fabric работают вместе, чтобы оптимизировать ваши преобразования данных."
    link="https://docs.getdbt.tech/guides/microsoft-fabric"
    icon="fabric"/>

<Card
    title="Быстрый старт для dbt и Redshift"
    body="Узнайте, как подключить dbt к Redshift для более гибких преобразований данных."
    link="https://docs.getdbt.tech/guides/redshift"
    icon="redshift"/>

<Card
    title="Быстрый старт для dbt и Snowflake"
    body="Раскройте весь потенциал использования dbt вместе со Snowflake для преобразования данных."
    link="https://docs.getdbt.tech/guides/snowflake"
    icon="snowflake"/>

<Card
    title="Быстрый старт для dbt и Starburst Galaxy"
    body="Используйте dbt вместе со Starburst Galaxy, чтобы улучшить процессы трансформации данных."
    link="https://docs.getdbt.tech/guides/starburst-galaxy"
    icon="starburst"/>

<Card
    title="Быстрый старт с dbt и Teradata"
    body="Познакомьтесь с dbt и использованием Teradata, чтобы улучшить рабочие процессы преобразования данных."
    link="https://docs.getdbt.tech/guides/teradata"
    icon="teradata"/>

</div>

## Самостоятельная установка dbt {#self-hosted-dbt-installations}

При установке dbt в среде Windows, macOS или Linux вы получаете инструменты командной строки и расширение для VS Code, которые позволяют преобразовывать данные с применением лучших практик аналитической инженерии.

Вы можете использовать инструменты, установленные в собственной инфраструктуре, как с учётной записью <Constant name="dbt_platform" />, так и без неё. При наличии учётной записи расширение для VS Code и <Constant name="platform_cli" /> синхронизируются с вашим проектом на платформе для CI/CD, работы с документацией и других задач. Без учётной записи вы запускаете dbt полностью в собственной инфраструктуре.

<div className="grid--3-col">

<Card
title="Самостоятельное размещение dbt v2 с ручной установкой"
    body="Узнайте, как установить самостоятельно размещаемую версию v2 и настроить проект."
    link="/guides/dbt?step=2"
    icon="dbt-bit"/>
<Card
    title="Самостоятельное размещение dbt v1 с ручной установкой"
    body="Узнайте, как установить самостоятельно размещаемую версию v1 и настроить проект."
    link="/guides/manual-install"
    icon="dbt-bit"/>

<Card
title="Быстрый старт с dbt и DuckDB"
    body="Узнайте, как подключить dbt к DuckDB."
    link="/guides/duckdb?step=1"
    icon="duckdb-seeklogo"/>
</div>

## Подключите ИИ к своим данным

Вам не нужно выбирать между изучением dbt и использованием ИИ &mdash; их можно совмещать с самого первого дня:

- Используйте <Constant name="wizard" /> и просите его на естественном языке создать, переработать или документировать модель с опорой на реальные связи между ресурсами и тесты вашего проекта. [Начните работу с <Constant name="wizard" />](/docs/platform/wizard-overview#get-started).
- Настройте сервер dbt MCP для подключения к Claude, Cursor или другому инструменту ИИ, чтобы получать информацию о проекте, выполнять команды dbt и напрямую извлекать метрики. [Подключите сервер dbt MCP](/docs/dbt-ai/about-mcp).
- Подключитесь к контекстному слою Fivetran, чтобы предоставить любому инструменту ИИ более полный контекст о ваших данных и получать ответы, основанные на их реальном значении. [Узнайте о контекстном слое](https://fivetran.com/docs/context-layer).

## Связанная документация

Расширьте свои знания и опыт работы с dbt с помощью этих дополнительных ресурсов:

- [Присоединяйтесь к ежемесячным демонстрациям](https://www.getdbt.com/resources/webinars/dbt-cloud-demos-with-experts), чтобы увидеть <Constant name="dbt" /> в действии и задать вопросы.
- [<Constant name="dbt" /> в AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-tjpcf42nbnhko) содержит информацию о том, как развернуть <Constant name="dbt" /> в AWS, отзывы пользователей и многое другое.
- [Рекомендации](/best-practices) содержат информацию о подходе dbt Labs к созданию проектов с учётом наших текущих взглядов на структуру, стиль и настройку.
- [dbt Learn](https://learn.getdbt.com) предлагает бесплатные онлайн-курсы по основам dbt, углублённым темам и многому другому.
- [Присоединяйтесь к сообществу dbt](https://www.getdbt.com/community/join-the-community), чтобы узнать, как специалисты по работе с данными по всему миру используют dbt, поделиться собственным опытом и получить помощь с вашими проектами dbt.
