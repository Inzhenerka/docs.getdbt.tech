---
title: "BigQuery и Apache Iceberg"
id: bigquery-iceberg-support
sidebar_label: "Поддержка Iceberg в BigQuery"
description: Узнайте о поддержке Apache Iceberg в BigQuery.
---

import BaseLocationEnvIsolation from '/snippets/_base-location-env-isolation-warning.md';

dbt поддерживает материализацию моделей в формате таблиц Iceberg двумя способами:

- **Самый простой:** конфигурация модели `table_format = 'iceberg'` указывает dbt материализовать эту модель как таблицу Iceberg в BigLake Metastore (управляемом каталоге)
- **Расширяемый:** определите каталог Iceberg в `catalogs.yml` и настройте для этой модели параметр `catalog_name`

## Создание таблиц Iceberg

dbt поддерживает создание таблиц Iceberg для двух материализаций BigQuery: 

- [Таблица](/docs/build/materializations#table)
- [Инкрементальная](/docs/build/materializations#incremental)

## Каталоги Iceberg

В настоящее время BigQuery поддерживает таблицы Iceberg через встроенный каталог [BigLake Metastore](https://cloud.google.com/bigquery/docs/iceberg-tables#architecture). Для доступа к BigLake Metastore настройка не требуется. Однако перед созданием таблицы Iceberg необходимо настроить [бакет хранилища](https://docs.cloud.google.com/storage/docs/buckets#buckets) и [необходимые роли BigQuery](https://cloud.google.com/bigquery/docs/iceberg-tables#required-roles). 


## Конфигурации BigQuery для каталогов `biglake_metastore`

В следующей таблице описаны поля конфигурации, необходимые для настройки интеграции с каталогом для [таблиц BigLake Iceberg в BigQuery](https://docs.cloud.google.com/bigquery/docs/iceberg-tables).

Укажите эти дополнительные конфигурации, специфичные для BigQuery, вложив их в `config.bigquery` (в новой спецификации каталогов) или `adapter_properties` (в старой спецификации каталогов).

| Поле | Тип | Обязательно | Описание | Примечание |
| ----- | ---- | -------- | ----------- | ---- |
| `file_format` | String | Да, кроме каталогов [Lakehouse Runtime Catalog (LRC)](#lakehouse-runtime-catalog-lrc) | Формат файлов таблицы Iceberg. | Единственное допустимое значение — `parquet`. |
| `external_volume` | String | Да, кроме каталогов LRC | Бакет Cloud Storage, в который записываются данные таблицы Iceberg. | Например, `gs://BUCKET_NAME`. |
| `lakehouse_catalog` | String | Нет | Имя LRC, в котором хранятся таблицы этого каталога. | Только для новой спецификации; требуется <Constant name="fusion" /> (v2). Задавайте в `catalogs.yml`, а не для отдельных моделей. |
| `base_location_root` | String | Нет | Если задано, это значение переопределяет значение `base_location`, которое в dbt по умолчанию равно `_dbt`. | Можно задать в `catalogs.yml`. |
| `base_location_subpath` | String | Нет | Необязательный суффикс, добавляемый к пути `base_location`, который dbt задаёт автоматически. | Настраивается только для отдельных моделей. |
| `storage_uri` | String | Нет | Если задано, это значение переопределяет значение `storage_uri` в dbt. | Настраивается только для отдельных моделей. |

- `lakehouse_catalog`: указывает dbt, что таблицы этого каталога находятся в [Lakehouse Runtime Catalog](#lakehouse-runtime-catalog-lrc), поэтому dbt обращается к ним с помощью имени BigQuery из четырёх частей. Каталогам LRC не нужны `external_volume` и `file_format`, поскольку LRC определяет расположение хранилища на основе пространства имён.
- `base_location_root`: задаёт префикс базового пути в бакете хранилища, куда записываются данные таблицы Iceberg.
- `base_location_subpath`: задаёт суффикс базового пути в бакете хранилища, куда записываются данные таблицы Iceberg. Это свойство можно задать только в конфигурациях моделей, но не в `catalogs.yml`.
- `storage_uri`: полностью переопределяет storage_uri, позволяя указать полный путь напрямую вместо использования external volume и компонентов base_location интеграции с каталогом.

### Пример

1. Создайте `catalogs.yml` в корневом каталоге вашего проекта dbt.

<Tabs defaultValue="new">
<TabItem value="new" label={<><VersionBlock lastVersion="1.99">Новая спецификация (бета)</VersionBlock><VersionBlock firstVersion="2.0">Новая спецификация</VersionBlock></>}>

<File name="catalogs.yml">

```yaml
catalogs:
  - name: my_biglake_catalog
    type: biglake_metastore
    table_format: iceberg
    config:
      bigquery:
        external_volume: 'gs://mydbtbucket'
        file_format: parquet

```

</File>

</TabItem>
<TabItem value="old" label="Старая спецификация">

<File name="catalogs.yml">

```yaml
catalogs:
  - name: my_biglake_catalog
    active_write_integration: biglake_metastore
    write_integrations:
      - name: biglake_metastore
        external_volume: 'gs://mydbtbucket'
        table_format: iceberg
        file_format: parquet
        catalog_type: biglake_metastore

```

</File>

</TabItem>
</Tabs>

2. Примените конфигурацию каталога на уровне модели, папки или проекта:

<File name="iceberg_model.sql">

```sql

{{
    config(
        materialized='table',
        catalog_name='my_biglake_catalog'

    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

</File>


3. Наконец, запустите модель: `dbt run -s my_iceberg_model`.

### Ограничения

В настоящее время BigQuery не поддерживает подключение к внешним каталогам Iceberg. Дополнительную информацию об операциях SQL и возможностях управления таблицами см. в [документации BigQuery](https://cloud.google.com/bigquery/docs/iceberg-tables#limitations). 

### Базовое расположение

DDL BigQuery для создания таблиц Iceberg требует указания полного `storage_uri`, включая путь к объекту. После того как пользователь укажет имя бакета в качестве `external_volume` в интеграции с каталогом, dbt управляет значением `storage_uri`. По умолчанию dbt задаёт путь к объекту, называемый в dbt `base_location`, в формате `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`. Мы рекомендуем использовать поведение по умолчанию, но если вам нужно изменить результирующий `base_location`, вы можете настроить `base_location` с помощью полей конфигурации модели `base_location_root` и `base_location_subpath`.

- Если входные значения не заданы, dbt формирует для base_location `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- Если base_location_root = `foo`, dbt формирует `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- Если base_location_subpath = `bar`, dbt формирует `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- Если base_location_root = `foo` и base_location_subpath = `bar`, dbt формирует `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

<BaseLocationEnvIsolation />

Вы также можете полностью переопределить `storage_uri` с помощью поля конфигурации модели `storage_uri`. Оно переопределяет как путь интеграции с каталогом, так и остальные поля конфигурации модели, позволяя напрямую указать полный путь `storage_uri`.

Пример модели с настроенным `base_location`:

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

<Tabs defaultValue="new">
<TabItem value="new" label={<><VersionBlock lastVersion="1.99">Новая спецификация (бета)</VersionBlock><VersionBlock firstVersion="2.0">Новая спецификация</VersionBlock></>}>

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: my_bigquery_iceberg_catalog
    type: biglake_metastore
    table_format: iceberg
    config:
      bigquery:
        external_volume: 'gs://mydbtbucket'
        file_format: parquet
        base_location_root: foo

```

</File>

</TabItem>
<TabItem value="old" label="Старая спецификация">

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

</TabItem>
</Tabs>

#### Обоснование

По умолчанию dbt управляет полным `storage_uri` от имени пользователей для удобства работы. Параметр `base_location` задаёт расположение в бакете хранилища, куда записываются данные. Без защитных механизмов (например, если пользователь забудет указать корень базового пути) BigQuery может повторно использовать один и тот же путь для нескольких таблиц.  

Такое поведение может привести к техническому долгу в будущем, поскольку оно ограничивает возможности:

- Навигации по базовому объектному хранилищу 
- Чтения таблиц Iceberg через интеграцию с объектным хранилищем
- Предоставления доступа к таблицам для отдельных схем через объектное хранилище
- Использования сканера, направленного на таблицы во внешнем хранилище, для создания нового каталога с помощью другого инструмента

Чтобы обеспечить соблюдение рекомендуемых практик, dbt требует задания пути и по умолчанию записывает ваши таблицы с префиксом `_dbt/{SCHEMA_NAME}/{TABLE_NAME}`, упрощая наблюдение за объектным хранилищем и его аудит.

<VersionBlock firstVersion="2.0">

## Lakehouse Runtime Catalog (LRC) <Lifecycle status="beta" /> {#lakehouse-runtime-catalog-lrc}

:::info Только <Constant name="fusion" />

Для `lakehouse_catalog` требуется [<Constant name="fusion_engine" />](/docs/introduction) (v2) с включённым флагом поведения `use_catalogs_v2`.

<File name='dbt_project.yml'>

```yaml
flags:
  use_catalogs_v2: true
```

</File>

:::

[Lakehouse Runtime Catalog](https://cloud.google.com/bigquery/docs/blms-rest-catalog) (LRC) в BigQuery использует для адресации таблицы четыре части — проект, каталог, пространство имён и таблицу, — но SQL BigQuery принимает только три сегмента, заключённых в обратные кавычки. dbt решает эту задачу, заключая каталог и пространство имён вместе в обратные кавычки как средний сегмент:

```sql
`{project}`.`{catalog}.{namespace}`.`{table}`
```

Задайте `lakehouse_catalog` для каталога `biglake_metastore`, чтобы указать dbt, что его таблицы находятся в LRC. После этого dbt использует имя из четырёх частей и опускает предложение подключения и параметр `table_format`, поскольку BigQuery не принимает их для таблиц LRC.

### Предварительные требования

Создайте каталог LRC и пространство имён перед запуском dbt. В BigQuery нет SQL-инструкции для их создания, поэтому dbt может создать только таблицу.

Из-за этого dbt при каждом запуске с каталогом LRC пытается создать пространство имён, а BigQuery отклоняет эту операцию со следующим предупреждением:

```shell
[FailedToCreateDatabase (dbt1051)]: Failed to create schema 'sales_catalog.analytics' in database
'my_project' in remote for model.my_project.my_lrc_model: [BigQuery] googleapi: Error 400:
Invalid project ID 'my_project.sales_catalog'.
```

Это ожидаемое предупреждение &mdash; оно не приводит к сбою запуска. Если каталог и пространство имён существуют, dbt создаёт таблицу.

### Пример LRC

1. Добавьте каталог с заданным `lakehouse_catalog`. Каталогу LRC не нужны `external_volume` и `file_format`.

<File name="catalogs.yml">

```yaml
catalogs:
  - name: my_lrc_catalog
    type: biglake_metastore
    table_format: iceberg
    config:
      bigquery:
        lakehouse_catalog: sales_catalog
```

</File>

2. Настройте модель с помощью `catalog_name`:

<File name="my_lrc_model.sql">

```sql

{{
    config(
        materialized='table',
        catalog_name='my_lrc_catalog'
    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

</File>

3. Запустите модель: `dbt run -s my_lrc_model`. dbt сгенерирует следующий DDL:

```sql
create or replace table `my_project`.`sales_catalog.analytics`.`my_lrc_model`
  OPTIONS()
  as (
    select * from `my_project`.`analytics`.`jaffle_shop_customers`
  )
```

### Ограничения LRC

BigQuery не предоставляет сведения о таблицах LRC через `INFORMATION_SCHEMA`, поэтому ваши запросы к этим представлениям не возвращают такие таблицы. Это не влияет на `dbt docs generate`.

</VersionBlock>
