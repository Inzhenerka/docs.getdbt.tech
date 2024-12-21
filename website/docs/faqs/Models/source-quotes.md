---
title: Мне нужно использовать кавычки для выбора из моего источника, что мне делать?
description: "Используйте свойство quoting для обрамления значений в кавычки"
sidebar_label: 'Как обрамлять значения в кавычки'
id: source-quotes

---

Это довольно часто встречается, особенно в Snowflake.

По умолчанию dbt не будет обрамлять в кавычки базу данных, схему или идентификатор для указанных вами исходных таблиц.

Чтобы заставить dbt обрамлять одно из этих значений в кавычки, используйте [свойство `quoting`](/reference/resource-properties/quoting):

<File name='models/<filename>.yml'>

```yaml
version: 2

sources:
  - name: jaffle_shop
    database: raw
    quoting:
      database: true
      schema: true
      identifier: true

    tables:
      - name: order_items
      - name: orders
        # Это переопределяет конфигурацию quoting для `jaffle_shop`
        quoting:
          identifier: false
```

</File>