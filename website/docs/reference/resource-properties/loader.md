---
resource_types: sources
datatype: string
---

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <source_name>
    database: <database_name>
    loader: <string>
    tables:
      - ...

```

</File>

## Определение
Опишите инструмент, который загружает этот источник в ваш хранилище данных. Обратите внимание, что это свойство используется только в документации — dbt не использует его каким-либо значимым образом.

## Примеры
### Указание, какой инструмент EL загрузил данные

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: jaffle_shop
    loader: fivetran
    tables:
      - name: orders
      - name: customers

  - name: stripe
    loader: stitch
    tables:
      - name: payments
```

</File>