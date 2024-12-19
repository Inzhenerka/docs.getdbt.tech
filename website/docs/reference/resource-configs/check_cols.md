---
resource_types: [snapshots]
description: "Прочитайте это руководство, чтобы понять конфигурацию check_cols в dbt."
datatype: "[column_name] | all"
---

<VersionBlock firstVersion="1.9">
<File name="snapshots/<filename>.yml">
  
  ```yml
  snapshots:
  - name: snapshot_name
    relation: source('my_source', 'my_table')
    config:
      schema: string
      unique_key: column_name_or_expression
      strategy: check
      check_cols:
        - column_name
  ```
  
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

import SnapshotYaml from '/snippets/_snapshot-yaml-spec.md';

<SnapshotYaml/>

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  strategy="check",
  check_cols=["column_name"]
) }}

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

## Описание
Список столбцов в результатах вашего запроса снимка, которые необходимо проверить на изменения.

В качестве альтернативы можно использовать все столбцы, указав значение `all` (однако это может быть менее производительно).

Этот параметр является **обязательным при использовании стратегии `check` [strategy](/reference/resource-configs/strategy)**.

## По умолчанию
По умолчанию значение не предоставляется.

## Примеры

### Проверка списка столбцов на изменения

<VersionBlock firstVersion="1.9">

<File name="snapshots/orders_snapshot_check.yml">

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

Чтобы выбрать из этого снимка в последующей модели: `select * from {{ ref('orders_snapshot_check') }}`
</VersionBlock>

<VersionBlock lastVersion="1.8">

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</VersionBlock>

### Проверка всех столбцов на изменения

<VersionBlock firstVersion="1.9">

<File name="orders_snapshot_check.yml">

```yaml
snapshots:
  - name: orders_snapshot_check
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: check
      check_cols:
        - all
  ```
</File>

Чтобы выбрать из этого снимка в последующей модели: `select * from {{{ ref('orders_snapshot_check') }}`
</VersionBlock>

<VersionBlock lastVersion="1.8">

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols='all',
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</VersionBlock>