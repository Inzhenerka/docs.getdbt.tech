---
title: "Поддержка Apache Iceberg"
id: apache-iceberg-support
sidebar_label: "Поддержка Apache Iceberg"
pagination_next: "docs/mesh/iceberg/about-catalogs"
description: Узнайте о поддержке каталогов Iceberg в dbt platform.
---

Apache Iceberg — это открытый стандарт табличного формата, который обеспечивает большую портируемость и совместимость в экосистеме данных. За счёт стандартизации способов хранения и доступа к данным Iceberg позволяет командам уверенно работать с разными движками и платформами. Iceberg состоит из нескольких компонентов, но основные из них, с которыми взаимодействует dbt, следующие:

- **Iceberg Table Format** — формат таблиц с открытым исходным кодом. Таблицы, материализованные в формате Iceberg, хранятся в инфраструктуре пользователя, например в S3 Bucket.
- **Iceberg Data Catalog** — система управления метаданными с открытым исходным кодом, которая отслеживает схемы, партиции и версии таблиц Iceberg.
- **Iceberg REST Protocol** (также называемый Iceberg REST API) — протокол, с помощью которого вычислительные движки могут поддерживать и взаимодействовать с другими каталогами, совместимыми с Iceberg.

dbt абстрагирует сложность табличных форматов, чтобы команды могли сосредоточиться на создании надёжных и хорошо смоделированных данных. Первоначальная интеграция dbt с Iceberg поддерживает материализации таблиц и интеграции с каталогами, позволяя пользователям определять и управлять таблицами Iceberg напрямую в своих проектах dbt. Чтобы узнать больше, выберите один из следующих разделов:

<div className="grid--4-col">

<Card
    title="Using dbt + Iceberg Catalog overview"
    body="dbt support for Apache Iceberg"
    link="/docs/mesh/iceberg/about-catalogs"
    icon="dbt-icon"/>

<Card
    title="Snowflake"
    body="Snowflake Iceberg Configurations"
    link="/docs/mesh/iceberg/snowflake-iceberg-support"
    icon="snowflake"/>

<Card
    title="BigQuery"
    body="BigQuery Iceberg Configurations"
    link="/docs/mesh/iceberg/bigquery-iceberg-support"
    icon="bigquery"/>

<Card
    title="Databricks"
    body="Databricks Iceberg Configurations"
    link="/docs/mesh/iceberg/databricks-iceberg-support"
    icon="databricks"/>

</div>
