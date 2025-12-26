---
title: "Конфигурации Postgres"
description: "Конфигурации Postgres - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "postgres-configs"
---

## Стратегии инкрементальной материализации

В dbt-postgres поддерживаются следующие стратегии инкрементальной материализации:

- `append` (по умолчанию, если `unique_key` не определен)
- `merge`
- `delete+insert` (по умолчанию, если `unique_key` определен)
- [`microbatch`](/docs/build/incremental-microbatch)

## Оптимизация производительности

### Unlogged

"Unlogged" таблицы могут быть значительно быстрее обычных таблиц, так как они не записываются в журнал предзаписи и не реплицируются на реплики для чтения. Однако они также значительно менее безопасны, чем обычные таблицы. Подробности см. в [документации Postgres](https://www.postgresql.org/docs/current/sql-createtable.html#SQL-CREATETABLE-UNLOGGED).

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

Хотя Postgres работает достаточно хорошо для наборов данных размером менее 10 миллионов строк, иногда требуется настройка базы данных. Важно создавать индексы для столбцов, которые часто используются в соединениях или в условиях where.

Модели таблиц, инкрементальные модели, seeds, snapshots и материализованные представления могут иметь список определенных `indexes`. Каждый индекс Postgres может иметь три компонента:
- `columns` (список, обязательный): один или несколько столбцов, по которым определяется индекс
- `unique` (логический, необязательный): должен ли индекс быть [объявлен уникальным](https://www.postgresql.org/docs/9.4/indexes-unique.html)
- `type` (строка, необязательный): поддерживаемый [тип индекса](https://www.postgresql.org/docs/current/indexes-types.html) (B-tree, Hash, GIN и т.д.)

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

Если один или несколько индексов настроены на ресурсе, dbt выполнит оператор(ы) `create index` <Term id="ddl" /> как часть <Term id="materialization" /> этого ресурса, в рамках той же транзакции, что и основной оператор `create`. Для имени индекса dbt использует хэш его свойств и текущую временную метку, чтобы гарантировать уникальность и избежать конфликта имен с другими индексами.

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

| Параметр                                                                         | Тип               | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|----------------------------------------------------------------------------------|-------------------|--------------|--------------|-------------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`        | нет          | `apply`      | н/д                           |
| [`indexes`](#indexes)                                                            | `[{<dictionary>}]`| нет          | `none`       | alter                         |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
```js
{ label: 'YAML-файл проекта', value: 'project-yaml', },
{ label: 'YAML-файл свойств', value: 'property-yaml', },
{ label: 'Конфигурация в SQL-файле', value: 'config', },
```
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

Параметр [`indexes`](#indexes) соответствует параметру таблицы, как объяснено выше.
Стоит отметить, что, в отличие от таблиц, dbt отслеживает этот параметр на предмет изменений и применяет изменения без удаления материализованного представления.
Это происходит через `DROP/CREATE` индексов, что можно рассматривать как `ALTER` материализованного представления.

Узнайте больше об этих параметрах в [документации Postgres](https://www.postgresql.org/docs/current/sql-creatematerializedview.html).