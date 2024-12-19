---
title: "Конфигурации Postgres"
description: "Конфигурации Postgres - Прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "postgres-configs"
---

## Стратегии инкрементальной материализации

В dbt-postgres поддерживаются следующие стратегии инкрементальной материализации:

- `append` (по умолчанию, когда `unique_key` не определен)
- `merge`
- `delete+insert` (по умолчанию, когда `unique_key` определен)
- [`microbatch`](/docs/build/incremental-microbatch)

## Оптимизация производительности

### Unlogged

"Unlogged" таблицы могут быть значительно быстрее, чем обычные таблицы, так как они не записываются в журнал предварительной записи и не реплицируются на резервные реплики. Однако они также значительно менее безопасны, чем обычные таблицы. См. [документацию Postgres](https://www.postgresql.org/docs/current/sql-createtable.html#SQL-CREATETABLE-UNLOGGED) для получения подробной информации.

<File name='my_table.sql'>

```sql
{{ config(materialized='table', unlogged=True) }}

select ...
```

</File>

<File name='dbt_project.yml'>

```yaml
models:
  +unlogged: true
```

</File>

### Индексы

Хотя Postgres работает достаточно хорошо для наборов данных размером менее 10 миллионов строк, иногда требуется настройка базы данных. Важно создавать индексы для столбцов, которые часто используются в операциях соединения или в условиях where.

Модели таблиц, инкрементальные модели, семена, снимки и материализованные представления могут иметь определенный список `indexes`. Каждый индекс Postgres может иметь три компонента:
- `columns` (список, обязательный): один или несколько столбцов, по которым определяется индекс
- `unique` (логическое, необязательное): должен ли индекс быть [объявлен уникальным](https://www.postgresql.org/docs/9.4/indexes-unique.html)
- `type` (строка, необязательное): поддерживаемый [тип индекса](https://www.postgresql.org/docs/current/indexes-types.html) (B-tree, Hash, GIN и т.д.)

<File name='my_table.sql'>

```sql
{{ config(
    materialized = 'table',
    indexes=[
      {'columns': ['column_a'], 'type': 'hash'},
      {'columns': ['column_a', 'column_b'], 'unique': True},
    ]
)}}

select ...
```

</File>

Если для ресурса настроены один или несколько индексов, dbt выполнит оператор `create index` <Term id="ddl" /> как часть <Term id="materialization" /> этого ресурса, в рамках той же транзакции, что и основной оператор `create`. Для имени индекса dbt использует хэш его свойств и текущее время, чтобы гарантировать уникальность и избежать конфликтов пространств имен с другими индексами.

```sql
create index if not exists
"3695050e025a7173586579da5b27d275"
on "my_target_database"."my_target_schema"."indexed_model" 
using hash
(column_a);

create unique index if not exists
"1bf5f4a6b48d2fd1a9b0470f754c1b0d"
on "my_target_database"."my_target_schema"."indexed_model" 
(column_a, column_b);
```

Вы также можете настроить индексы для нескольких ресурсов одновременно:

<File name='dbt_project.yml'>

```yaml
models:
  project_name:
    subdirectory:
      +indexes:
        - columns: ['column_a']
          type: hash
```

</File>

## Материализованные представления

Адаптер Postgres поддерживает [материализованные представления](https://www.postgresql.org/docs/current/rules-materializedviews.html) с следующими параметрами конфигурации:

| Параметр                                                                        | Тип               | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|----------------------------------------------------------------------------------|--------------------|--------------|--------------|---------------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`         | нет          | `apply`      | н/д                             |
| [`indexes`](#indexes)                                                            | `[{<dictionary>}]` | нет          | `none`       | alter                           |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Блок конфигурации', value: 'config', },
  ]
}>


<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): materialized_view
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[indexes](#indexes):
      - columns: [<column-name>]
        unique: true | false
        type: hash | btree
```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): materialized_view
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [indexes](#indexes):
        - columns: [<column-name>]
          unique: true | false
          type: hash | btree
```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)="materialized_view",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [indexes](#indexes)=[
        {
            "columns": ["<column-name>"],
            "unique": true | false,
            "type": "hash" | "btree",
        }
    ]
) }}
```

</File>

</TabItem>

</Tabs>

Параметр [`indexes`](#indexes) соответствует параметру таблицы, как объяснялось выше. Стоит отметить, что, в отличие от таблиц, dbt отслеживает этот параметр на предмет изменений и применяет изменения без удаления материализованного представления. Это происходит через `DROP/CREATE` индексов, что можно рассматривать как `ALTER` материализованного представления.

Узнайте больше об этих параметрах в [документации](https://www.postgresql.org/docs/current/sql-creatematerializedview.html) Postgres.