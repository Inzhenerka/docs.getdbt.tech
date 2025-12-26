---
title: "Конфигурации Starrocks"
id: "starrocks-configs"
description: "Конфигурации Starrocks - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
---

## Конфигурация модели

Модель dbt может быть настроена с использованием следующего синтаксиса:

<Tabs
  groupId="config-fact"
  defaultValue="project-yaml"
  values={[
    { label: 'YAML-файл проекта', value: 'project-yaml', },
    { label: 'YAML-файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация в SQL-файле', value: 'config', },
  ]
}>

<TabItem value="project-yaml">
<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    materialized: table       // table или view или materialized_view
    keys: ['id', 'name', 'some_date']
    table_type: 'PRIMARY'     // PRIMARY или DUPLICATE или UNIQUE
    distributed_by: ['id']
    buckets: 3                // по умолчанию 10
    partition_by: ['some_date']
    partition_by_init: ["PARTITION p1 VALUES [('1971-01-01 00:00:00'), ('1991-01-01 00:00:00')),PARTITION p1972 VALUES [('1991-01-01 00:00:00'), ('1999-01-01 00:00:00'))"]
    properties: [{"replication_num":"1", "in_memory": "true"}]
    refresh_method: 'async' // только для materialized view, по умолчанию manual
```

</File>
</TabItem>

<TabItem value="property-yaml">
<File name='models/properties.yml'>

```yaml
models:
  - name: <model-name>
    config:
      materialized: table       // table или view или materialized_view
      keys: ['id', 'name', 'some_date']
      table_type: 'PRIMARY'     // PRIMARY или DUPLICATE или UNIQUE
      distributed_by: ['id']
      buckets: 3                // по умолчанию 10
      partition_by: ['some_date']
      partition_by_init: ["PARTITION p1 VALUES [('1971-01-01 00:00:00'), ('1991-01-01 00:00:00')),PARTITION p1972 VALUES [('1991-01-01 00:00:00'), ('1999-01-01 00:00:00'))"]
      properties: [{"replication_num":"1", "in_memory": "true"}]
      refresh_method: 'async' // только для materialized view, по умолчанию manual
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = 'table',
    keys=['id', 'name', 'some_date'],
    table_type='PRIMARY',
    distributed_by=['id'],
    buckets=3,
    partition_by=['some_date'],
    ....
) }}
```
</File>
</TabItem>
</Tabs>

### Описание конфигурации

| Опция               | Описание                                                                                                                                                                                     |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `materialized`      | Как модель будет материализована в Starrocks. Поддерживает view, table, incremental, ephemeral и materialized_view.                                                                          |
| `keys`              | Какие столбцы служат ключами.                                                                                                                                                                |
| `table_type`        | Тип таблицы, поддерживаются PRIMARY, DUPLICATE или UNIQUE.                                                                                                                                   |
| `distributed_by`    | Указывает столбец для распределения данных. Если не указано, по умолчанию используется случайное распределение.                                                                               |
| `buckets`           | Количество бакетов в одном разделе. Если не указано, будет автоматически определено.                                                                                                          |
| `partition_by`      | Список столбцов для разделения.                                                                                                                                                              |
| `partition_by_init` | Правило разделения или некоторые реальные элементы разделов.                                                                                                                                 |
| `properties`        | Конфигурация свойств таблицы Starrocks. ([Свойства таблицы Starrocks](https://docs.starrocks.io/en-us/latest/sql-reference/sql-statements/data-definition/CREATE_TABLE#properties))          |
| `refresh_method`    | Как обновлять материализованные представления.                                                                                                                                               |

## Чтение из каталога
Сначала вам нужно добавить этот каталог в starrocks. Ниже приведен пример для hive.

```sql
CREATE EXTERNAL CATALOG `hive_catalog`
PROPERTIES (
    "hive.metastore.uris"  =  "thrift://127.0.0.1:8087",
    "type"="hive"
);
```
Как добавить другие типы каталогов, можно найти в документации. [Обзор каталога](https://docs.starrocks.io/en-us/latest/data_source/catalog/catalog_overview) Затем напишите файл sources.yaml.
```yaml
sources:
  - name: external_example
    schema: hive_catalog.hive_db
    tables:
      - name: hive_table_name
```
Наконец, вы можете использовать следующий макрос quote
```jinja
{{ source('external_example', 'hive_table_name') }}
```
