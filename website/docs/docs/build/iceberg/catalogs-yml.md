---
title: "Использование catalogs.yml"
id: catalogs-yml
sidebar_label: "Использование catalogs.yml"
description: Узнайте, как каталоги Iceberg вписываются в конфигурации dbt Mesh.
---

Теперь, когда вы знаете, [что такое каталог Iceberg](/docs/build/iceberg/about-catalogs), давайте поговорим о том, как использовать такие каталоги в dbt.

## Начало работы: управляемые каталоги

Некоторые платформы данных предлагают собственные «управляемые» каталоги, которые поддерживают формат таблиц Iceberg без дополнительной настройки. К ним относятся Snowflake Horizon, Databricks Unity, AWS Glue (для Athena + Redshift) и BigLake (для BigQuery).

Если вы используете dbt с платформой данных, предлагающей управляемый каталог Iceberg, то самый простой способ материализовать первую модель dbt в виде таблицы Iceberg — задать параметр `table_format`:

<File name='models/hello_iceberg.sql'>

```sql
{{ config(
  materialized = 'table',
  table_format = 'iceberg'
) }}

select 'hello_iceberg' as message
```

</File>

Вот и всё. Эта модель материализуется в виде таблицы Iceberg со всеми настройками по умолчанию для этого адаптера и сохраняется в каталоге по умолчанию (управляемом), который предоставляет платформа данных. Теперь вы можете подключиться к этому каталогу с помощью другого движка (например, DuckDB), чтобы прочитать эту таблицу. Поздравляем, вы используете Iceberg!

:::note

Большинство движков запросов с открытым исходным кодом, включая DuckDB и Apache Spark, хорошо работают с внешними каталогами, но не предоставляют «управляемого» каталога. Вместо этого при материализации таблиц Iceberg они по умолчанию записывают файлы Parquet и метаданные Iceberg в локальную файловую систему (там, где работает движок запросов).

:::

## Следующий шаг: использование каталогов

Вам стоит начать использовать `catalogs`, если:
- Вы хотите в одном месте определять пользовательские настройки материализации таблиц Iceberg в dbt
- Вы хотите записывать данные в несколько каталогов (как «внешних», так и встроенных / управляемых)
- Вы хотите обращаться к одному и тому же каталогу из нескольких платформ данных / проектов dbt

<VersionBlock lastVersion="1.99">

dbt определяет `catalogs` в едином файле верхнего уровня `catalogs.yml`, который находится в корне каталога проекта. Мы впервые представили `catalogs.yml` в <Constant name="dbt" /> v1.10; начиная с <Constant name="dbt" /> v1.12 доступна новая, более простая спецификация (рекомендуемая), которую можно включить с помощью флага поведения.

</VersionBlock>

<VersionBlock firstVersion="2.0">

dbt определяет `catalogs` в едином файле верхнего уровня `catalogs.yml`, который находится в корне каталога проекта. Мы впервые представили `catalogs.yml` в <Constant name="dbt" /> v1.10, а в <Constant name="dbt" /> v1.12 добавили новую, более простую спецификацию (рекомендуемую). В <Constant name="fusion" /> новая спецификация используется по умолчанию. Чтобы продолжить использовать старую спецификацию, задайте `use_catalogs_v2: false` в разделе `flags:` файла `dbt_project.yml`.

</VersionBlock>

### Новая спецификация (рекомендуется) <VersionBlock lastVersion="1.99"><Lifecycle status="beta" /></VersionBlock> {#new-spec-recommended-}

_Доступна в <Constant name="dbt" /> v1.12+ (включая v2). Объяснение причин появления новой спецификации и обзор изменений см. в обсуждении на GitHub [dbt-labs/dbt#12723](https://github.com/dbt-labs/dbt/discussions/12723)._

<VersionBlock lastVersion="1.99">

Чтобы использовать новую спецификацию, сначала задайте этот флаг поведения:

<File name='dbt_project.yml'>

```yml
flags:
  use_catalogs_v2: true
```

</File>

</VersionBlock>

Каждая запись в `catalogs` ссылается на конкретный каталог, содержащий таблицы Iceberg. Каждый каталог **должен** соответствовать логическому пространству имён верхнего уровня (в dbt его часто называют «базой данных»). Для данной платформы данных каталог может быть управляемым или внешним. К каждому каталогу могут обращаться (для чтения и записи) одна или несколько платформ данных.

Поэтому настройки каждого каталога, специфичные для адаптера, вложены в ключи `ADAPTER` (например, `snowflake:` и `databricks:`). Если вы запускаете один и тот же проект dbt с одним и тем же файлом `catalogs.yml`, используя разные адаптеры, dbt всегда использует конфигурацию каталога для текущего активного адаптера.

При этом один «каталог» **обязательно должен** указывать на одни и те же фактические данные (таблицы Iceberg в объектном хранилище), независимо от того, является ли он внешним по отношению к текущему активному адаптеру или управляется им.

<VersionBlock firstVersion="1.12">

<File name='catalogs.yml'>

```yml
catalogs:
  - name: my_iceberg_catalog
    type: CATALOG_TYPE     # см. ниже
    table_format: iceberg  # обязательно
    config:
      ADAPTER:
        # Настройки для интеграции конкретного адаптера с этим каталогом.
        # См. доступные настройки для каждой комбинации адаптера и каталога.
```

</File>

</VersionBlock>

#### Типы каталогов

| `type` каталога   | по умолчанию для | поддерживается в              | Примечания                                                                                    |
|-------------------|-------------|-------------------------------|-----------------------------------------------------------------------------------------------|
| horizon           | snowflake   | snowflake, duckdb             |                                                                                               |
| glue              | athena      | athena, snowflake, duckdb     | Тип каталога по умолчанию для Athena. См. [Каталоги Iceberg](/reference/resource-configs/athena-configs#iceberg-catalogs). |
| s3_tables         |             | athena                        | Каталоги Iceberg, управляемые Amazon S3 Tables (`dbt-athena` 1.11.1 и более поздние версии). См. [AWS S3 Tables](/reference/resource-configs/athena-configs#aws-s3-tables). |
| biglake_metastore | bigquery    | bigquery, snowflake           | Поддерживает [таблицы Lakehouse Runtime Catalog](/docs/build/iceberg/adapters/bigquery-iceberg-support#lakehouse-runtime-catalog-lrc) в BigQuery через параметр `lakehouse_catalog` |
| unity             | databricks  | databricks, snowflake, duckdb | Поддерживает форматы Iceberg (нативный), Delta, «Uniform»                                      |
| hive_metastore    |             | databricks                    | Поддерживает формат Hudi в дополнение к Iceberg + Delta                                       |
| ducklake          |             | duckdb                        |                                                                                               |
| local_filesystem  |             | duckdb                        |                                                                                               |
| iceberg_rest      |             | snowflake, duckdb             | Теоретически этот вариант может поддерживать любой каталог, реализующий REST API, совместимый с Iceberg |

#### Наследование настроек

Настройки, определённые в `catalogs.yml`, имеют самый низкий [приоритет среди настроек модели](/reference/model-configs). Это означает, что более конкретные настройки для отдельной модели (в её файле `.sql` или `.py`) или настройки на уровне проекта имеют приоритет над ними.

Например, вы задаёте значение `base_location_root` по умолчанию для всех моделей в каталоге `finance_db`:

<File name='catalogs.yml'>

```yml
catalogs:
  - name: finance_db
    type: unity
    config:
      snowflake:
        base_location_root: 's3://my-bucket/finance_db'
```

</File>

Но затем переопределяете эту настройку для одной конкретной модели:

<File name='models/finance/my_special_model.sql'>

```sql
{{ config(
    catalog_name = 'finance_db',
    base_location_root = 's3://my-bucket/somewhere_else'
) 
}}
```

</File>

Некоторые настройки, связанные с Iceberg, доступны только на уровне конфигурации модели, поэтому их нельзя задать в `catalogs.yml`. Например, связанный параметр `base_location_subpath` определяет точный путь записи для отдельной таблицы Iceberg, поэтому его имеет смысл задавать для каждой модели отдельно, а не устанавливать значение по умолчанию для всех моделей в каталоге.

#### Параметр `catalog_database`

Для имени базы данных, сопоставленной с этим каталогом в каждом адаптере, предусмотрен отдельный параметр. В отличие от других настроек уровня каталога, `catalog_database` применяется ко *всем* моделям с данным значением `catalog_name`: его нельзя изменить для отдельных моделей, и на него не распространяются обычные правила работы параметра `database` или макроса `generate_database_name`.

Это означает, что если у модели заданы и `database`, и `catalog_name`, то значение `catalog_database` каталога имеет приоритет над настройкой базы данных модели и указывает dbt, где материализовать эту модель.

Почему? Мы настоятельно рекомендуем устанавливать соответствие 1:1 между каждым каталогом Iceberg и пространством имён верхнего уровня (логической «базой данных»), с которым он связан или синхронизирован. Имена пространств имён не обязательно должны совпадать, но если сделать их одинаковыми везде, это упростит понимание конфигурации и отладку.

Если вы не укажете `catalog_database`, dbt будет материализовывать модели на основе их настройки `database`. В этом случае каталог служит набором общих настроек Iceberg, но не соответствует единому пространству имён, содержащему все его таблицы Iceberg.

### Старая спецификация

_Доступна в <Constant name="dbt" /> v1.10+_

<VersionBlock firstVersion="2.0">

Чтобы использовать старую спецификацию, сначала задайте этот флаг поведения:

<File name='dbt_project.yml'>

```yml
flags:
  use_catalogs_v2: false
```

</File>

</VersionBlock>

В каждом каталоге настраивается одна или несколько интеграций записи `write_integrations`, а затем указывается «активная» интеграция записи для текущего вызова / хранилища данных.

<File name='catalogs.yml'>

```yml
catalogs:
  - name: my_glue_catalog
    active_write_integration: glue_rest
    write_integrations:
      - name: glue_rest
        catalog_type: iceberg_rest
        table_format: iceberg
        adapter_properties:
          catalog_linked_database: catalog_linked_db_glue
          catalog_linked_database_type: glue
```

</File>
