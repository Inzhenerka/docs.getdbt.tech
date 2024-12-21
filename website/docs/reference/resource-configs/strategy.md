---
resource_types: [snapshots]
description: "Стратегия - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: timestamp | check
---

<VersionBlock lastVersion="1.8">

import SnapshotYaml from '/snippets/_snapshot-yaml-spec.md';

<SnapshotYaml/>
</VersionBlock>

<Tabs
  defaultValue="timestamp"
  values={[
    { label: 'timestamp', value: 'timestamp', },
    { label: 'check', value: 'check', }
  ]
}>
<TabItem value="timestamp">

<VersionBlock firstVersion="1.9">

<File name='snapshots/<filename>.yml'>
  
  ```yaml
  snapshots:
  - [name: snapshot_name](/reference/resource-configs/snapshot_name):
    relation: source('my_source', 'my_table')
    config:
      strategy: timestamp
      updated_at: column_name
  ```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

<File name='snapshots/<filename>.sql'>

```jinja2
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  strategy="timestamp",
  updated_at="column_name"
) }}

select ...

{% endsnapshot %}

```

</File>
</VersionBlock>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +strategy: timestamp
    +updated_at: column_name

```

</File>

</TabItem>

<TabItem value="check">

<VersionBlock firstVersion="1.9">

<File name='snapshots/<filename>.yml'>
  
  ```yaml
  snapshots:
  - [name: snapshot_name](/reference/resource-configs/snapshot_name):
    relation: source('my_source', 'my_table')
    config:
      strategy: check
      check_cols: [column_name] | "all"
  ```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">
<File name='snapshots/<filename>.sql'>

```jinja2
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  strategy="check",
  check_cols=[column_name] | "all"
) }}

{% endsnapshot %}

```

</File>
</VersionBlock>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +strategy: check
    +check_cols: [column_name] | all

```

</File>

</TabItem>

</Tabs>

## Описание
Стратегия снимка, которую dbt должен использовать для обнаружения изменений записей. Прочтите руководство по [снимкам](/docs/build/snapshots#detecting-row-changes), чтобы понять различия между двумя стратегиями.

## По умолчанию
Это **обязательная конфигурация**. Значение по умолчанию отсутствует.

## Примеры
### Использование стратегии timestamp

<VersionBlock firstVersion="1.9">
<File name='snapshots/timestamp_example.yml'>

```yaml
snapshots:
  - name: orders_snapshot_timestamp
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      strategy: timestamp
      unique_key: id
      updated_at: updated_at

```

</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">
<File name='snapshots/timestamp_example.sql'>

```sql
{% snapshot orders_snapshot_timestamp %}

    {{
        config(
          target_schema='snapshots',
          strategy='timestamp',
          unique_key='id',
          updated_at='updated_at',
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>
</VersionBlock>


### Использование стратегии check

<VersionBlock firstVersion="1.9">
<File name='snapshots/check_example.yml'>

```yaml
snapshots:
  - name: orders_snapshot_check
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: check
      check_cols:
        - status
        - is_cancelled

```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          target_schema='snapshots',
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</VersionBlock>

### Продвинутое: определение и использование пользовательской стратегии снимка
Внутренне стратегии снимков реализованы как макросы, названные `snapshot_<strategy>_strategy`
* [Исходный код](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/snapshots/strategies.sql#L52) для стратегии timestamp
* [Исходный код](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/snapshots/strategies.sql#L136) для стратегии check

Возможно реализовать собственную стратегию снимка, добавив макрос с тем же шаблоном именования в ваш проект. Например, вы можете создать стратегию, которая фиксирует жесткие удаления, названную `timestamp_with_deletes`.

1. Создайте макрос с именем `snapshot_timestamp_with_deletes_strategy`. Используйте существующий код в качестве руководства и при необходимости корректируйте.
2. Используйте эту стратегию через конфигурацию `strategy`:

<VersionBlock firstVersion="1.9">
<File name='snapshots/<filename>.yml'>

```yaml
snapshots:
  - name: my_custom_snapshot
    relation: source('my_source', 'my_table')
    config:
      strategy: timestamp_with_deletes
      updated_at: updated_at_column
      unique_key: id
```
</File>
</VersionBlock>


<VersionBlock lastVersion="1.8">
<File name='snapshots/<filename>.sql'>

```jinja2
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  strategy="timestamp_with_deletes",
  updated_at="column_name"
) }}

{% endsnapshot %}

```

</File>
</VersionBlock>