---
title: "Поддержка Apache Iceberg"
id: apache-iceberg-support
sidebar_label: "Поддержка Apache Iceberg"
description: Узнайте о поддержке каталогов Iceberg на платформе dbt.
---

Apache Iceberg — это открытый формат таблиц, который повышает переносимость данных и совместимость инструментов в экосистеме данных. Стандартизируя хранение данных и доступ к ним, Iceberg позволяет командам использовать одни и те же данные в нескольких движках и платформах без репликации.

Поддержка Iceberg на платформах данных и в dbt охватывает несколько уровней:

- **Формат таблиц Iceberg** &mdash; Формат таблиц с открытым исходным кодом. Таблицы Iceberg представляют собой сочетание файлов данных в объектном хранилище (например, файлов Parquet в бакете S3) и файлов метаданных (содержащих сведения о схеме таблицы, её версиях и многом другом), которые также находятся в объектном хранилище.
- **Каталог данных Iceberg** &mdash; Открытая спецификация системы метаданных, которая отслеживает схемы, секции и версии нескольких таблиц Iceberg.
- **Протокол Iceberg REST** (также называемый Iceberg REST API) &mdash; Определяет стандартные конечные точки для взаимодействия с каталогами, совместимыми с Iceberg.

В теории стандарт Iceberg позволяет одному движку запросов читать данные из таблиц Iceberg или записывать данные в них во внешнем каталоге, управляемом другим движком или платформой. На практике различные каталоги Iceberg работают по-разному, а разные движки запросов поддерживают спецификацию Iceberg в разной степени.

По мере возможности dbt старается скрыть сложность форматов таблиц и различия между реализациями Iceberg у разных поставщиков, чтобы команды могли сосредоточиться на предоставлении надёжных данных с продуманной моделью. Чтобы узнать больше, выберите одну из следующих карточек:

<div className="grid--4-col">

<Card
    title="Каталоги Iceberg"
    body="О каталогах Iceberg"
    link="/docs/build/iceberg/about-catalogs"
    icon="dbt-icon"/>

<Card
    title="Использование table_format + catalogs.yml"
    body="Поддержка Iceberg и каталогов в dbt"
    link="/docs/build/iceberg/catalogs-yml"
    icon="dbt-icon"/>

<Card
    title="Snowflake + Iceberg"
    body="Настройки Iceberg в Snowflake"
    link="/docs/build/iceberg/adapters/snowflake-iceberg-support"
    icon="snowflake"/>

<Card
    title="BigQuery + Iceberg"
    body="Настройки Iceberg в BigQuery"
    link="/docs/build/iceberg/adapters/bigquery-iceberg-support"
    icon="bigquery"/>

<Card
    title="Databricks + Iceberg"
    body="Настройки Iceberg в Databricks"
    link="/docs/build/iceberg/adapters/databricks-iceberg-support"
    icon="databricks"/>

<Card
    title="DuckDB + Iceberg"
    body="Настройки Iceberg в DuckDB"
    link="/docs/build/iceberg/adapters/duckdb-iceberg-support"
    icon="duckdb-seeklogo"/>

<Card
    title="AWS + Iceberg"
    body="Настройки Iceberg в AWS, включая Amazon S3 Tables"
    link="/docs/build/iceberg/adapters/aws-iceberg-support"
    icon="aws"/>

</div>
