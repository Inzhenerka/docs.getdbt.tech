---
title: "Быстрый старт с dbt"
id: get-started-dbt
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
---

Начните свой путь в dbt, попробовав один из наших quickstart‑гайдов. Они предлагают пошаговое руководство, которое поможет вам настроить [<Constant name="cloud" />](#dbt-cloud) или [<Constant name="core" />](#dbt-core) для работы с [различными платформами данных](/docs/cloud/connect-data-platform/about-connections).

## The dbt platform (formerly dbt Cloud) {#the-dbt-platform}

<Constant name="cloud" /> — это масштабируемое решение, которое позволяет разрабатывать, тестировать, развёртывать и исследовать дата‑продукты с помощью единого, полностью управляемого программного сервиса. Оно даёт командам с разным уровнем и профилем экспертизы возможность создавать надёжные дата‑продукты любого масштаба, предоставляя, в частности, следующие возможности:

- Среды разработки, адаптированные под разные роли (в браузере — [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) или локально с помощью [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation)).
- Готовые «из коробки» [CI/CD workflows](/docs/deploy/ci-jobs).
- [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) для единых и согласованных метрик, которые можно доставлять в любые целевые системы.
- Доменная ответственность за данные с использованием мультипроектных конфигураций [<Constant name="mesh" />](/best-practices/how-we-mesh/mesh-1-intro).
- [<Constant name="explorer" />](/docs/explore/explore-projects) для совместного исследования данных и лучшего понимания их структуры и содержания.

Узнайте больше о [возможностях <Constant name="cloud" />](/docs/cloud/about-cloud/dbt-cloud-features) и [начните бесплатный пробный период](https://www.getdbt.com/signup/) уже сегодня.

<div className="grid--3-col">

<Card
    title="Быстрый старт для dbt и Amazon Athena"
    body="Интегрируйте dbt с Amazon Athena для выполнения преобразований данных."
    link="https://docs.getdbt.com/guides/athena"
    icon="athena"/>

<Card
    title="Быстрый старт для dbt и Azure Synapse Analytics"
    body="Узнайте, как интегрировать dbt с Azure Synapse Analytics для выполнения преобразований данных."
    link="https://docs.getdbt.com/guides/azure-synapse-analytics"
    icon="azure-synapse-analytics-2"/>

<Card
    title="Быстрый старт для dbt и BigQuery"
    body="Узнайте, как использовать dbt вместе с BigQuery для упрощения аналитических рабочих процессов."
    link="https://docs.getdbt.com/guides/bigquery"
    icon="bigquery"/>

<Card
    title="Быстрый старт для dbt и Databricks"
    body="Узнайте, как интегрировать dbt с Databricks для эффективной обработки и анализа данных."
    link="https://docs.getdbt.com/guides/databricks"
    icon="databricks"/>

<Card
    title="Быстрый старт с dbt и Microsoft Fabric"
    body="Узнайте, как dbt и Microsoft Fabric работают вместе, чтобы оптимизировать ваши преобразования данных."
    link="https://docs.getdbt.com/guides/microsoft-fabric"
    icon="fabric"/>

<Card
    title="Быстрый старт для dbt и Redshift"
    body="Узнайте, как подключить dbt к Redshift для более гибких преобразований данных."
    link="https://docs.getdbt.com/guides/redshift"
    icon="redshift"/>

<Card
    title="Быстрый старт для dbt и Snowflake"
    body="Раскройте весь потенциал использования dbt вместе со Snowflake для преобразования данных."
    link="https://docs.getdbt.com/guides/snowflake"
    icon="snowflake"/>

<Card
    title="Быстрый старт для dbt и Starburst Galaxy"
    body="Используйте dbt вместе со Starburst Galaxy, чтобы улучшить процессы трансформации данных."
    link="https://docs.getdbt.com/guides/starburst-galaxy"
    icon="starburst"/>

<Card
    title="Быстрый старт с dbt и Teradata"
    body="Познакомьтесь с dbt и использованием Teradata, чтобы улучшить рабочие процессы преобразования данных."
    link="https://docs.getdbt.com/guides/teradata"
    icon="teradata"/>

</div>

## dbt local installations

[<Constant name="core" /> and <Constant name="fusion_engine" />](/docs/about-dbt-install) предоставляют инструменты командной строки, которые позволяют специалистам по данным трансформировать данные, применяя лучшие практики аналитической инженерии. Эти инструменты подходят для отдельных пользователей и небольших технических команд, которые предпочитают ручную настройку и кастомизацию, поддерживают community‑адаптеры и следуют стандартам open source.

<div className="grid--3-col">

<Card
    title="dbt Fusion engine при ручной установке"
    body="Узнайте, как установить dbt Fusion и настроить проект."
    link="/guides/fusion?step=2"
    icon="dbt-bit"/>
<Card
    title="dbt Core при ручной установке"
    body="Узнайте, как установить dbt Core и настроить проект."
    link="/guides/manual-install"
    icon="dbt-bit"/>

<Card
    title="Быстрый старт для dbt Core с использованием DuckDB"
    body="Узнайте, как подключиться к DuckDB."
    link="/guides/duckdb?step=1"
    icon="duckdb"/>
</div>

## Связанные документы

Расширьте свои знания и опыт работы с dbt с помощью этих дополнительных ресурсов:

- [Присоединяйтесь к ежемесячным демо](https://www.getdbt.com/resources/webinars/dbt-cloud-demos-with-experts), чтобы увидеть <Constant name="cloud" /> в действии и задать вопросы.
- [<Constant name="cloud" /> AWS marketplace](https://aws.amazon.com/marketplace/pp/prodview-tjpcf42nbnhko) содержит информацию о том, как развернуть <Constant name="cloud" /> в AWS, отзывы пользователей и многое другое.
- [Best practices](/best-practices) содержит информацию о том, как dbt Labs подходит к построению проектов, исходя из наших текущих взглядов на структуру, стиль и настройку.
- [dbt Learn](https://learn.getdbt.com) предлагает бесплатные онлайн‑курсы, которые охватывают основы dbt, продвинутые темы и многое другое.
- [Присоединяйтесь к сообществу dbt](https://www.getdbt.com/community/join-the-community), чтобы узнать, как специалисты по данным по всему миру используют dbt, поделиться собственным опытом и получить помощь с вашими dbt‑проектами.
