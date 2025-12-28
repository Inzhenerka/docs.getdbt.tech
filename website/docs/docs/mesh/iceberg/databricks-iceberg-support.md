---
title: "Databricks и Apache Iceberg"
id: databricks-iceberg-support
sidebar_label: "Поддержка Iceberg в Databricks"
description: Узнайте о поддержке Apache Iceberg в Databricks.
---

Databricks построен на базе [Delta Lake](https://docs.databricks.com/aws/en/delta/) и хранит данные в формате [Delta table](https://docs.databricks.com/aws/en/introduction/delta-comparison#delta-tables-default-data-table-architecture). Databricks не поддерживает запись в каталоги Iceberg.  
При этом Databricks может создавать как управляемые Iceberg-таблицы, так и Delta-таблицы, совместимые с Iceberg, за счёт хранения метаданных таблиц одновременно в Iceberg и Delta, что позволяет внешним клиентам их читать. Что касается чтения, Unity Catalog поддерживает чтение из внешних каталогов Iceberg.

Когда модель dbt сконфигурирована с табличным свойством `UniForm`, метаданные Delta дублируются в метаданные, совместимые с Iceberg. Это позволяет внешним вычислительным движкам Iceberg читать данные из Unity Catalog.

Пример SQL:

```sql
{{ config(
    tblproperties={
      'delta.enableIcebergCompatV2': 'true'
      'delta.universalFormat.enabledFormats': 'iceberg'
    }
 ) }}

```

Чтобы настроить Databricks для чтения и выполнения запросов к внешним таблицам, необходимо сконфигурировать [Lakehouse Federation](https://docs.databricks.com/aws/en/query-federation/) и определить каталог как внешний (foreign catalog). Эта настройка выполняется вне dbt, и после её завершения каталог будет доступен как ещё одна база данных, к которой можно выполнять запросы.

В настоящее время новые возможности Databricks managed Iceberg tables, находящиеся в статусе Private Preview, не поддерживаются.

## Конфигурации интеграции dbt Catalog для Databricks

В таблице ниже перечислены поля конфигурации, необходимые для настройки интеграции каталога для [Iceberg-совместимых таблиц в Databricks](https://docs.databricks.com/aws/en/delta/uniform).

| Field | Description | Required | Accepted values |
| :---- | :---- | :---- | :---- |
| name | Имя каталога в Databricks | Yes | “my_unity_catalog” |
| catalog_type | Тип каталога | Yes | unity, hive_metastore |
| table_format | Формат таблиц, создаваемых моделями dbt. | Optional | Автоматически устанавливается в `iceberg` для `catalog_type=unity` и в `default` для `hive_metastore`. |
| file_format | Формат файлов, используемый для результатов моделей dbt. | Optional | По умолчанию `delta`, если не переопределён на уровне аккаунта Databricks. |

#### Примечание

В Databricks, если у модели в конфигурации указано `catalog_name=<>`, имя каталога становится частью FQN модели. Например, если каталог называется `my_database`, модель с `catalog_name='my_database'` будет материализована как `my_database.<schema>.<model>`.

### Настройте интеграцию каталога для управляемых таблиц Iceberg

1. Создайте файл `catalogs.yml` в корне проекта dbt (на одном уровне с `dbt_project.yml`).  
<br />Пример использования Unity Catalog в качестве каталога:

```yaml

catalogs:
  - name: unity_catalog
    active_write_integration: unity_catalog_integration
    write_integrations:
      - name: unity_catalog_integration
        table_format: iceberg
        catalog_type: unity
        file_format: delta   
```

2. Добавьте параметр конфигурации `catalog_name` либо в блок `config` (внутри `.sql`-файла модели), либо в YAML-файл свойств (папка модели), либо в файл проекта (`dbt_project.yml`).  
<br />

Пример `iceberg_model.sql`:

```yaml

{{
    config(
        materialized = 'table',
        catalog_name = 'unity_catalog'

    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

3. Запустите модель dbt с помощью команды `dbt run -s iceberg_model`.
