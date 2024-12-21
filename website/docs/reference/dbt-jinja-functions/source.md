---
title: "О функции source"
sidebar_label: "source"
id: "source"
description: "Прочтите это руководство, чтобы понять функцию source в Jinja в dbt."
---

```sql
select * from {{ source("source_name", "table_name") }}
```

## Определение

Эта функция:
- Возвращает [Relation](/reference/dbt-classes#relation) для [источника](/docs/build/sources)
- Создает зависимости между источником и текущей моделью, что полезно для документации и [выбора узлов](/reference/node-selection/syntax)
- Компилируется в полное имя объекта в базе данных

## Связанные руководства
- [Использование источников](/docs/build/sources)

## Аргументы
* `source_name`: `name:`, определенное под ключом `sources:`
* `table_name`: `name:`, определенное под ключом `tables:`

## Пример

Рассмотрим источник, определенный следующим образом:

<File name='models/<filename>.yml'>

```yaml
version: 2

sources:
  - name: jaffle_shop # это source_name
    database: raw

    tables:
      - name: customers # это table_name
      - name: orders
```

</File>

Выборка из источника в модели:

<File name='models/orders.sql'>

```sql
select
  ...

from {{ source('jaffle_shop', 'customers') }}

left join {{ source('jaffle_shop', 'orders') }} using (customer_id)

```

</File>