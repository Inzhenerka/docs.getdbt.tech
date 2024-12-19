---
description: "Имя снимка - Прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
---

<VersionBlock firstVersion="1.9">
<File name='snapshots/<filename>.yml'>

```yaml
snapshots:
  - name: snapshot_name
    relation: source('my_source', 'my_table')
    config:
      schema: string
      database: string
      unique_key: column_name_or_expression
      strategy: timestamp | check
      updated_at: column_name  # Обязательно, если стратегия 'timestamp'

```

</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

<File name='snapshots/<filename>.sql'>

```jinja2
{% snapshot snapshot_name %}

{% endsnapshot %}

```

</File>

import SnapshotYaml from '/snippets/_snapshot-yaml-spec.md';

<SnapshotYaml/>

</VersionBlock>

## Описание

Имя снимка, которое используется при выборке из снимка с помощью функции [`ref` function](/reference/dbt-jinja-functions/ref).

Это имя не должно конфликтовать с именем любого другого "refable" ресурса (модели, семена, другие снимки), определенного в этом проекте или пакете.

Имя не обязательно должно совпадать с именем файла. В результате имена файлов снимков не должны быть уникальными.

## Примеры
### Назовите снимок `order_snapshot`

<VersionBlock firstVersion="1.9">
<File name='snapshots/order_snapshot.yml'>


```yaml
snapshots:
  - name: order_snapshot
    relation: source('my_source', 'my_table')
    config:
      schema: string
      database: string
      unique_key: column_name_or_expression
      strategy: timestamp | check
      updated_at: column_name  # Обязательно, если стратегия 'timestamp'
```
</File>

</VersionBlock>

<VersionBlock lastVersion="1.8">
<File name='snapshots/orders.sql'>

```jinja2
{% snapshot orders_snapshot %}
...
{% endsnapshot %}

```

</File>

</VersionBlock>

Чтобы выбрать из этого снимка в модели ниже по потоку:

```sql
select * from {{ ref('orders_snapshot') }}
```