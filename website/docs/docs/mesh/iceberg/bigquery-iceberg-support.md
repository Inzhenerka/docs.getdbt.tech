---
title: "BigQuery и Apache Iceberg"
id: bigquery-iceberg-support
sidebar_label: "Поддержка Iceberg в BigQuery"
description: Узнайте о поддержке Apache Iceberg в BigQuery.
---

import BaseLocationEnvIsolation from '/snippets/_base-location-env-isolation-warning.md';

dbt поддерживает материализацию таблиц Iceberg в BigQuery через интеграцию с каталогом, начиная с релиза dbt-bigquery 1.10.

## Создание таблиц Iceberg

dbt поддерживает создание таблиц Iceberg для двух materialization в BigQuery:

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)

## Каталоги BigQuery Iceberg

В настоящее время BigQuery поддерживает таблицы Iceberg через встроенный каталог [BigLake Metastore](https://cloud.google.com/bigquery/docs/iceberg-tables#architecture). Для доступа к BigLake Metastore не требуется дополнительная настройка. Однако перед созданием таблицы Iceberg необходимо заранее настроить [storage bucket](https://docs.cloud.google.com/storage/docs/buckets#buckets) и [необходимые роли BigQuery](https://cloud.google.com/bigquery/docs/iceberg-tables#required-roles).

### Конфигурации интеграции каталога dbt для BigQuery

В таблице ниже приведены поля конфигурации, необходимые для настройки интеграции каталога для [таблиц BigLake Iceberg в BigQuery](https://docs.cloud.google.com/bigquery/docs/iceberg-tables).

<VersionBlock lastVersion="1.99">

| Поле            | Обязательно | Допустимые значения                                                                         |
|------------------|----------|-----------------------------------------------------------------------------------------|
| `name`           | yes      | Имя интеграции каталога                                                                 |
| `catalog_name`   | yes      | Имя интеграции каталога в BigQuery. Например, `biglake_metastore`.                     |
| `external_volume`| yes      | `gs://<bucket_name>`                                                                    |
| `table_format`   | yes      | `iceberg`                                                                               |
| `catalog_type`   | yes      | `biglake_metastore`                                                                     |
| `file_format`    | yes      | `parquet`                                                                               |

</VersionBlock>

<VersionBlock firstVersion="2.0">

| Поле            | Обязательно | Допустимые значения                                                                         |
|------------------|----------|-----------------------------------------------------------------------------------------|
| `name`           | yes      | Имя интеграции каталога                                                                 |
| `catalog_name`   | yes      | Имя интеграции каталога в BigQuery. Например, `biglake_metastore`.                     |
| `external_volume`| yes      | `gs://<bucket_name>`                                                                    |
| `table_format`   | yes      | `iceberg`                                                                               |
| `catalog_type`   | yes      | `biglake_metastore`                                                                     |
| `file_format`    | yes      | `parquet`                                                                               |
| `adapter_properties` | optional | См. ниже |

### Свойства адаптера

Передавайте и вкладывайте эти дополнительные параметры конфигурации, специфичные для BigQuery, в поле `adapter_properties`.

| Поле | Тип   | Обязательно | Описание   | Примечание   |
| ------ | ----- | -------- | ------------- | ------ |
| `base_location_root` | String | No     | Если указано, значение переопределяет стандартное значение dbt для `base_location`, равное `_dbt`. | Может быть задано в `catalogs.yml` |
| `base_location_subpath` | String | No     | Необязательный суффикс, добавляемый к пути `base_location`, который dbt формирует автоматически. | Настраивается только на уровне модели |
| `storage_uri` | String | No     | Если указано, значение переопределяет `storage_uri`, используемый dbt. | Настраивается только на уровне модели |

Эти свойства можно задавать либо в конфигурации модели в поле `adapter_properties`, либо как поля верхнего уровня. Если они заданы в обоих местах, приоритет имеет значение из `adapter_properties`. Подробнее см. раздел [Base location](#base-location).

- `base_location_root`: определяет префикс пути base location внутри storage bucket, куда будут записываться данные таблицы Iceberg.
- `base_location_subpath`: определяет суффикс пути base location внутри storage bucket, куда будут записываться данные таблицы Iceberg. Это свойство можно задавать только в конфигурации модели, но не в `catalogs.yml`.
- `storage_uri`: полностью переопределяет `storage_uri`, позволяя задать полный путь напрямую, без использования `external_volume` и компонентов `base_location` из интеграции каталога.

</VersionBlock>

### Настройка интеграции каталога для управляемых таблиц Iceberg

1. Создайте файл `catalogs.yml` в корне вашего dbt‑проекта.<br />
<br />Пример:

```yaml

catalogs:
  - name: my_bigquery_iceberg_catalog
    active_write_integration: biglake_metastore
    write_integrations:
      - name: biglake_metastore
        external_volume: 'gs://mydbtbucket'
        table_format: iceberg
        file_format: parquet
        catalog_type: biglake_metastore

```

2. Примените конфигурацию каталога на уровне модели, папки или всего проекта:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='my_bigquery_iceberg_catalog'

    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

</File>

3. Выполните модель dbt с помощью команды `dbt run -s iceberg_model`.

### Ограничения

На данный момент BigQuery не поддерживает подключение к внешним каталогам Iceberg. Что касается SQL‑операций и возможностей управления таблицами, см. [документацию BigQuery](https://cloud.google.com/bigquery/docs/iceberg-tables#limitations) для получения дополнительной информации.

<VersionBlock firstVersion="1.9">

### Параметр base_location

<VersionBlock lastVersion="1.99">

DDL BigQuery для создания таблиц Iceberg требует указания полностью квалифицированного `storage_uri`, включая путь к объекту. После того как пользователь укажет имя bucket в параметре `external_volume` интеграции каталога, dbt будет самостоятельно управлять значением `storage_uri`. Поведение dbt по умолчанию — формировать путь к объекту, который в dbt называется `base_location`, в виде `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`. Мы рекомендуем использовать это поведение по умолчанию, однако при необходимости dbt позволяет настраивать итоговый `base_location` с помощью параметров конфигурации модели `base_location_root` и `base_location_subpath`.

- Если параметры не заданы, dbt сформирует `base_location` как `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- Если `base_location_root = foo`, dbt сформирует `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- Если `base_location_subpath = bar`, dbt сформирует `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- Если `base_location_root = foo` и `base_location_subpath = bar`, dbt сформирует `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

<BaseLocationEnvIsolation />

dbt также позволяет полностью переопределить `storage_uri` с помощью параметра конфигурации модели `storage_uri`. В этом случае игнорируются путь из интеграции каталога и другие параметры конфигурации модели, а полный путь `storage_uri` задаётся напрямую.

Пример модели с кастомизированным `base_location`:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='my_bigquery_iceberg_catalog',
        base_location_root='foo',
        base_location_subpath='bar',

    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

</VersionBlock>

<VersionBlock firstVersion="2.0">

DDL BigQuery для создания таблиц Iceberg требует указания полностью квалифицированного `storage_uri`, включая путь к объекту. После того как пользователь укажет имя bucket в параметре `external_volume` интеграции каталога, dbt будет самостоятельно управлять значением `storage_uri`. Поведение dbt по умолчанию — формировать путь к объекту, который в dbt называется `base_location`, в виде `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`. Мы рекомендуем использовать это поведение по умолчанию, однако при необходимости dbt позволяет настраивать итоговый `base_location` через конфигурацию `adapter_properties`.

Доступные adapter properties для настройки: `base_location_root`, `base_location_subpath` и `storage_uri`. Параметры `base_location_subpath` и `storage_uri` принимаются только в конфигурации модели (см. [Adapter properties](#adapter-properties)).

- Если параметры не заданы, dbt сформирует `base_location` как `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- Если `base_location_root = foo`, dbt сформирует `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- Если `base_location_subpath = bar`, dbt сформирует `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- Если `base_location_root = foo` и `base_location_subpath = bar`, dbt сформирует `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

<BaseLocationEnvIsolation />

dbt также позволяет полностью переопределить `storage_uri` с помощью adapter property `storage_uri`. В этом случае игнорируются путь из интеграции каталога и любые переопределения `base_location`, а полный путь `storage_uri` задаётся напрямую.

#### Примеры конфигурации

Пример модели с кастомизированным `base_location`:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='my_bigquery_iceberg_catalog',
        adapter_properties={
          'base_location_root': 'foo',
          'base_location_subpath': 'bar',
        },

    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

Пример `catalogs.yml` с кастомизированным `base_location_root`, заданным через `adapter_properties`:

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: my_bigquery_iceberg_catalog
    active_write_integration: biglake_metastore
    write_integrations:
      - name: biglake_metastore
        external_volume: 'gs://mydbtbucket'
        table_format: iceberg
        file_format: parquet
        catalog_type: biglake_metastore
        adapter_properties:
          base_location_root: foo
```

</File>

:::info Legacy model configuration for base_location

Для обратной совместимости dbt <Constant name="fusion"/> также поддерживает задание параметров `base_location` и `storage_uri` как полей конфигурации модели верхнего уровня. Конфигурации, заданные в `adapter_properties`, имеют приоритет над устаревшими настройками.

Например, в следующей конфигурации модели значение `base_location_root`=`bar` переопределяет `base_location_root`=`foo`.

```sql
config(
    materialized='table',
    catalog_name='my_bigquery_iceberg_catalog',
    'base_location_root': 'foo',
    'base_location_subpath': 'bar',
    adapter_properties={
      'base_location_root': 'bar',
    },
)

```

Результат этой конфигурации: `storage_uri` = `{{ external_volume }}/bar/{{ schema }}/{{ model_name }}/bar`
:::

</VersionBlock>

#### Обоснование

По умолчанию dbt управляет полным значением `storage_uri` от имени пользователя для упрощения работы. Параметр `base_location` определяет расположение внутри storage bucket, куда будут записываться данные. Без защитных механизмов (например, если пользователь забудет указать `base_location_root`) BigQuery может повторно использовать один и тот же путь для нескольких таблиц.

Такое поведение может привести к будущему техническому долгу, поскольку оно ограничивает возможность:

- Навигации по объектному хранилищу
- Чтения таблиц Iceberg через интеграцию с объектным хранилищем
- Предоставления доступа к таблицам на уровне схем через объектное хранилище
- Использования crawler, указывающего на таблицы во внешнем хранилище, для построения нового каталога с помощью другого инструмента

Для соблюдения лучших практик dbt требует явного ввода и по умолчанию записывает таблицы в префикс `_dbt/{SCHEMA_NAME}/{TABLE_NAME}`, что обеспечивает лучшую наблюдаемость и аудитируемость данных в объектном хранилище.

</VersionBlock>
