---
description: "Snapshot-name - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
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


## Описание

Имя снимка, которое используется при выборе из снимка с помощью функции [`ref`](/reference/dbt-jinja-functions/ref).

Это имя не должно конфликтовать с именем любого другого ресурса, на который можно ссылаться (модели, семена, другие снимки), определенного в этом проекте или пакете.

Имя не обязательно должно совпадать с именем файла. В результате имена файлов снимков не обязательно должны быть уникальными.

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


Чтобы выбрать из этого снимка в последующей модели:

```sql
select * from {{ ref('orders_snapshot') }}
```