---
title: invalidate_hard_deletes (устаревший)
resource_types: [snapshots]
description: "Invalidate_hard_deletes - Прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: column_name
sidebar_label: invalidate_hard_deletes (устаревший)
---

:::warning Это устаревшая конфигурация &mdash; используйте конфигурацию [`hard_deletes`](/reference/resource-configs/hard-deletes) вместо нее.

В версиях без версии и dbt Core 1.9 и выше конфигурация [`hard_deletes`](/reference/resource-configs/hard-deletes) заменяет конфигурацию `invalidate_hard_deletes`, обеспечивая лучший контроль над тем, как обрабатывать удаленные строки из источника.

Для новых снимков установите конфигурацию на `hard_deletes='invalidate'`, а не `invalidate_hard_deletes=true`. Для существующих снимков [организуйте обновление](/reference/snapshot-configs#snapshot-configuration-migration) предварительно существующих таблиц перед включением этой настройки. Смотрите 
:::

<VersionBlock firstVersion="1.9">

<File name='snapshots/<filename>.yml'>

```yaml
snapshots:
  - name: snapshot
    relation: source('my_source', 'my_table')
    [config](/reference/snapshot-configs):
      strategy: timestamp
      invalidate_hard_deletes: true | false
```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.8">

import SnapshotYaml from '/snippets/_snapshot-yaml-spec.md';

<SnapshotYaml/>

<File name='snapshots/<filename>.sql'>

```jinja2
{{
  config(
    strategy="timestamp",
    invalidate_hard_deletes=True
  )
}}

```

</File>
</VersionBlock>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +strategy: timestamp
    +invalidate_hard_deletes: true

```

</File>

## Описание
Функция по умолчанию для включения аннулирования жестко удаленных записей во время создания снимка запроса.

## По умолчанию
По умолчанию функция отключена.

## Пример

<VersionBlock firstVersion="1.9">
<File name='snapshots/orders.yml'>

```yaml
snapshots:
  - name: orders_snapshot
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      database: analytics
      unique_key: id
      strategy: timestamp
      updated_at: updated_at
      invalidate_hard_deletes: true
  ```
</File>

</VersionBlock>

<VersionBlock lastVersion="1.8">
<File name='snapshots/orders.sql'>

```sql
{% snapshot orders_snapshot %}

    {{
        config(
          target_schema='snapshots',
          strategy='timestamp',
          unique_key='id',
          updated_at='updated_at',
          invalidate_hard_deletes=True,
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>
</VersionBlock>