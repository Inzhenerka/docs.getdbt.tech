---
title: invalidate_hard_deletes
resource_types: [snapshots]
description: "Invalidate_hard_deletes - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: column_name
sidebar_label: invalidate_hard_deletes
---

# invalidate_hard_deletes <Lifecycle status="legacy" />

<IntroText>

Устаревшая опциональная конфигурация, позволяющая помечать жёстко удалённые записи как невалидные при выполнении snapshot‑запроса.

</IntroText>

:::warning Это устаревшая конфигурация &mdash; используйте конфигурацию [`hard_deletes`](/reference/resource-configs/hard-deletes) вместо этого.

В релизных ветках <Constant name="cloud" />, а также в dbt Core версии 1.9 и выше, конфигурация [`hard_deletes`](/reference/resource-configs/hard-deletes) заменяет `invalidate_hard_deletes`, обеспечивая более гибкий контроль над тем, как обрабатывать строки, удалённые из источника.

Для новых snapshot’ов используйте настройку `hard_deletes='invalidate'` вместо `invalidate_hard_deletes=true`. Для уже существующих snapshot’ов сначала [выполните обновление](/reference/snapshot-configs#snapshot-configuration-migration) ранее созданных таблиц, а затем включайте эту настройку.
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

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +strategy: timestamp
    +invalidate_hard_deletes: true

```

</File>

## Описание
Функция, включаемая по желанию, для аннулирования жёстко удалённых записей при создании снимков запроса.

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
