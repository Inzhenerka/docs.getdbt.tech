---
title: "Databricks и Apache Iceberg"
id: databricks-iceberg-support
sidebar_label: "Поддержка Iceberg в Databricks"
description: Узнайте о поддержке Apache Iceberg в Databricks.
---

import BaseLocationEnvIsolation from '/snippets/_base-location-env-isolation-warning.md';

dbt поддерживает два способа материализации таблиц Iceberg в Unity Catalog:

- **Самый простой:** конфигурация модели `table_format = 'iceberg'` указывает dbt материализовать эту модель как таблицу Iceberg в Unity Catalog
- **Расширяемый:** определите каталог Iceberg в `catalogs.yml` и настройте эту модель с помощью `catalog_name`

dbt поддерживает создание таблиц Iceberg для двух материализаций Databricks:

- [Таблица](/docs/build/materializations#table)
- [Инкрементальная](/docs/build/materializations#incremental)

## Поддержка Iceberg в Databricks

Databricks построен на основе [Delta Lake](https://docs.databricks.com/aws/en/delta/) и хранит данные в формате [таблиц Delta](https://docs.databricks.com/aws/en/introduction/delta-comparison#delta-tables-default-data-table-architecture).

Databricks поддерживает два способа создания таблиц Iceberg в своём каталоге данных [Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/):

- Создание [управляемых таблиц Iceberg в Unity Catalog](https://docs.databricks.com/aws/en/tables/managed). Эта возможность поддерживается в Databricks Runtime 16.4 LTS и более поздних версиях.
- Включение [чтения в формате Iceberg](https://docs.databricks.com/aws/en/delta/uniform) для таблиц Delta. Эти таблицы по-прежнему используют формат файлов Delta, но генерируют метаданные как для Delta, так и для Iceberg. Эта возможность поддерживается в Databricks Runtime 14.3 LTS и более поздних версиях.

dbt поддерживает создание как управляемых таблиц Iceberg, так и таблиц Delta с поддержкой Iceberg (ранее — [UniForm](https://www.databricks.com/blog/delta-uniform-universal-format-lakehouse-interoperability)).

<VersionBlock lastVersion="1.12">

Флаг поведения [`use_managed_iceberg`](/reference/global-configs/databricks-changes#use-managed-iceberg) определяет, какую таблицу создаёт dbt: управляемую таблицу Iceberg или таблицу Delta.

:::caution `use_uniform` не действует в dbt v1

`dbt-databricks` пока не поддерживает свойство каталога `use_uniform`. Если вы зададите его, адаптер запишет предупреждение в журнал и проигнорирует значение. Вместо этого используйте флаг поведения `use_managed_iceberg`.

:::

</VersionBlock>

<VersionBlock firstVersion="2.0">

Параметр конфигурации [`use_uniform`](#choose-between-managed-iceberg-and-uniform) определяет, какую таблицу создаёт dbt: управляемую таблицу Iceberg или таблицу Delta. Поскольку значение `use_uniform` по умолчанию — `false`, при настройке `table_format: 'iceberg'` создаётся управляемая таблица Iceberg.

</VersionBlock>

Внешние вычислительные движки Iceberg могут читать данные из этих таблиц Iceberg и записывать в них данные через [конечную точку Iceberg REST API](https://docs.databricks.com/aws/en/external-access/iceberg) в Unity Catalog. Однако Databricks предоставляет лишь ограниченную поддержку чтения из внешних каталогов Iceberg (и таблиц Iceberg под внешним управлением) через [федерацию каталогов Databricks](https://docs.databricks.com/aws/en/query-federation/catalog-federation) (настраивается вне dbt).

dbt пока не поддерживает включение [Iceberg v3](https://docs.databricks.com/aws/en/iceberg/iceberg-v3) для управляемых таблиц Iceberg.

<VersionBlock firstVersion="2.0">

### Выбор между управляемыми таблицами Iceberg и UniForm {#choose-between-managed-iceberg-and-uniform}

Задайте `table_format: 'iceberg'` для модели, чтобы создать управляемую таблицу Iceberg в Unity Catalog. Файл `catalogs.yml` и параметр конфигурации `catalog_name` для этого не нужны.

Два параметра конфигурации модели определяют, какой тип таблицы Iceberg создаёт dbt:

| Параметр | Тип | Обязательный | Описание | По умолчанию |
| ------ | ---- | -------- | ----------- | ------- |
| `table_format` | String | Да, для создания таблицы Iceberg | Задайте значение `iceberg`, чтобы материализовать модель как таблицу Iceberg. | `default` |
| `use_uniform` | Boolean | Нет | При значении `false` dbt создаёт управляемую таблицу Iceberg в Unity Catalog (`create table ... using iceberg`). При значении `true` dbt создаёт таблицу Delta с включённым чтением в формате Iceberg (`create table ... using delta tblproperties (...)`). | `false` |

Эта модель создаёт управляемую таблицу Iceberg:

<File name='models/my_iceberg_model.sql'>

```sql
{{
    config(
        materialized='table',
        table_format='iceberg'
    )
}}

select * from {{ ref('raw_orders') }}
```

</File>

Чтобы вместо этого создать таблицу Delta с поддержкой Iceberg, задайте для `use_uniform` значение `true`:

<File name='models/my_uniform_model.sql'>

```sql
{{
    config(
        materialized='table',
        table_format='iceberg',
        use_uniform=true
    )
}}

select * from {{ ref('raw_orders') }}
```

</File>

</VersionBlock>

### Внешние таблицы

dbt также поддерживает создание таблиц Iceberg под внешним управлением с помощью параметра конфигурации модели [`location_root`](/reference/resource-configs/databricks-configs#configuring-tables). DDL Databricks для создания таблиц требует полностью заданного пути `location`. dbt определяет этот параметр за пользователя, чтобы упростить использование и обеспечить базовую изоляцию данных таблиц:

- Если вы задаёте строку `location_root`, dbt генерирует строку `location` вида: `{{ location_root }}/{{ model_name }}`.
- Если вы задаёте для параметра конфигурации `include_full_name_in_path` значение `true`, dbt генерирует строку `location` вида `{{ location_root }}/{{ database_name}}/{{ schema_name }}/{{ model_name }}`.

В dbt v2 вы можете задать `location_root` в определении каталога в `catalogs.yml`, в разделе `config.databricks` (в новой спецификации каталогов) или `adapter_properties` (в старой спецификации каталогов).

### Каталоги

Настройте каталоги, чтобы:

- Определить несколько конфигураций для таблиц Iceberg под управлением Databricks в одном каталоге
- Обеспечить поддержку межплатформенного Mesh

Примечания:
- <VersionBlock lastVersion="1.99">В каждом каталоге Databricks настраивается параметр `table_format`, который принимает значения `default` и `iceberg`.</VersionBlock><VersionBlock firstVersion="2.0">В каждом каталоге Databricks настраивается параметр `table_format`. Для `type: unity` требуется `iceberg`, а для `type: hive_metastore` — `default`.</VersionBlock>
- В Databricks параметр `catalog_name` имеет приоритет над параметром `catalog` при определении пространства имён верхнего уровня для модели.

## Настройка интеграции каталога для таблиц Iceberg

1. Создайте файл `catalogs.yml` в корневой директории вашего проекта dbt. Пример использования Unity Catalog в качестве каталога:

<Tabs defaultValue="new">
<TabItem value="new" label={<><VersionBlock lastVersion="1.99">Новая спецификация (бета)</VersionBlock><VersionBlock firstVersion="2.0">Новая спецификация</VersionBlock></>}>

<File name="catalogs.yml">

```yaml

catalogs:
  - name: unity_catalog
    type: unity
    table_format: iceberg
    config:
      databricks:
        # optional
        location_root: s3://cloud-storage-uri
```

</File>

</TabItem>

<TabItem value="old" label="Старая спецификация">

<File name="catalogs.yml">

```yaml

catalogs:
  - name: unity_catalog
    active_write_integration: unity_catalog_integration
    write_integrations:
      - name: unity_catalog_integration
        table_format: iceberg
        catalog_type: unity
        file_format: delta   
        adapter_properties:
          location_root: s3://cloud-storage-uri
```

</File>

</TabItem>

</Tabs>

2. Добавьте параметр конфигурации `catalog_name` в блок конфигурации (внутри .sql-файла модели), в YAML-файл свойств (в папке моделей) или в YAML-файл проекта (`dbt_project.yml`). <br />
<br />

Пример файла `iceberg_model.sql`:

```yaml

{{
    config(
        materialized = 'table',
        catalog_name = 'unity_catalog'

    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

3. Выполните модель dbt с помощью команды `dbt run -s iceberg_model`.
