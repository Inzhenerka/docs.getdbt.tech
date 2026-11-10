---
title: "О подключениях к платформам данных"
id: "about-dbt-connections"
description: "Узнайте, как подключить dbt к вашей платформе данных"
sidebar_label: "О подключениях к платформам данных"
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
availability: local_free
---

dbt подключается к вашей платформе данных для выполнения SQL-преобразований ваших данных. 
<VersionBlock firstVersion="2.0">

## Платформы данных, поддерживаемые dbt v2

<Constant name="fusion_engine" /> включает встроенную поддержку следующих платформ:

- [Snowflake](/docs/local/connect-data-platform/snowflake-setup)
- [Databricks](/docs/local/connect-data-platform/databricks-setup)
- [Amazon Redshift](/docs/local/connect-data-platform/redshift-setup)
- [Google BigQuery](/docs/local/connect-data-platform/bigquery-setup)
- [DuckDB](/docs/local/connect-data-platform/duckdb-setup)
- [Apache Spark](/docs/local/connect-data-platform/spark-setup) <Lifecycle status="beta" />
- [ClickHouse](/docs/local/connect-data-platform/clickhouse-setup) <Lifecycle status="beta" />

<small> _Стадии жизненного цикла адаптеров могут различаться в <Constant name="dbt_platform" /> и при локальной разработке. Адаптер может стать общедоступным (GA) в платформе dbt раньше, чем для локального использования._ </small> <br /><br />

<Constant name="fusion" /> использует драйверы [ADBC (Arrow Database Connectivity)](https://arrow.apache.org/adbc/) для высокопроизводительных подключений к этим платформам. Отдельная установка адаптера не требуется.

## Профили подключений

При локальном запуске dbt считывает файл `dbt_project.yml`, чтобы определить имя профиля, а затем ищет профиль с таким же именем в файле `profiles.yml`. Этот профиль содержит параметры подключения к вашей платформе данных.

Подробные сведения о параметрах настройки см. в разделе [Профили подключений](/docs/local/profiles.yml).

</VersionBlock>

<VersionBlock lastVersion="1.99">

## Платформы данных, поддерживаемые <Constant name="core" />

<Constant name="core" /> подключается к платформам данных через адаптеры. Среди популярных платформ:

- [Snowflake](/docs/local/connect-data-platform/snowflake-setup)
- [Databricks](/docs/local/connect-data-platform/databricks-setup) 
- [Amazon Redshift](/docs/local/connect-data-platform/redshift-setup) 
- [Google BigQuery](/docs/local/connect-data-platform/bigquery-setup)
- [PostgreSQL](/docs/local/connect-data-platform/postgres-setup)
- [Apache Spark](/docs/local/connect-data-platform/spark-setup) 
- [Starburst или Trino](/docs/local/connect-data-platform/trino-setup)
- [Microsoft Fabric](/docs/local/connect-data-platform/fabric-setup)
- [Azure Synapse](/docs/local/connect-data-platform/azuresynapse-setup)

При установке <Constant name="core" /> также необходимо установить адаптер для вашей платформы данных. Адаптеры поддерживаются dbt Labs, партнёрами и участниками сообщества. См. раздел [Адаптеры сообщества](/docs/community-adapters).

Полный список поддерживаемых платформ см. в разделе [Поддерживаемые платформы данных](/docs/supported-data-platforms).

## Профили подключений

При запуске dbt из командной строки dbt считывает файл `dbt_project.yml`, чтобы определить имя профиля, а затем ищет профиль с таким же именем в файле `profiles.yml`. Этот профиль содержит параметры подключения к вашей платформе данных.

Подробные сведения о параметрах настройки см. в разделе [Профили подключений](/docs/local/profiles.yml).

## Возможности адаптеров

В следующей таблице перечислены возможности, доступные для адаптеров:

| Адаптер | Каталог | Актуальность источников |
|---------|---------|------------------|
| Конфигурация dbt по умолчанию | полное построение | `loaded_at_field` |
| `dbt-bigquery` | частичное и полное построение | на основе метаданных и `loaded_at_field` |
| `dbt-databricks` | полное построение | на основе метаданных и `loaded_at_field` |
| `dbt-postgres` | частичное и полное построение | `loaded_at_field` |
| `dbt-redshift` | частичное и полное построение | на основе метаданных и `loaded_at_field` |
| `dbt-snowflake` | частичное и полное построение | на основе метаданных и `loaded_at_field` |
| `dbt-spark` | полное построение | `loaded_at_field` |

### Каталог 

Для адаптеров, поддерживающих эту возможность, можно частично построить каталог (только в <Constant name="core_v1" />). При этом каталог строится только для выбранных моделей с помощью `dbt docs generate --select ...`. Для адаптеров, которые не поддерживают частичное построение каталога, выполните `dbt docs generate`, чтобы построить полный каталог.

### Актуальность источников

При использовании поддерживаемых адаптеров можно оценивать актуальность источников с помощью таблиц метаданных хранилища. Это позволяет вычислять актуальность источников без использования [`loaded_at_field`](/reference/resource-configs/freshness) и без прямых запросов к таблице. Такой подход быстрее и гибче (хотя иногда он может давать неточные результаты в зависимости от того, как хранилище отслеживает изменения таблиц). Это поведение можно переопределить, указав `loaded_at_field` в [конфигурации источника](/reference/source-configs). Если адаптер не поддерживает этот подход, вы по-прежнему можете использовать `loaded_at_field`.

</VersionBlock>

## Дальнейшие шаги

Пошаговые инструкции по настройке с использованием данных демонстрационного проекта см. в наших [руководствах по быстрому началу работы](/guides).
