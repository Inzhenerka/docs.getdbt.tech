---
resource_types: sources
datatype: string
---

<File name='models/<filename>.yml'>

```yml

sources:
  - name: <source_name>
    database: <database_name>
    loader: <string>
    tables:
      - ...

```

</File>

## Определение {#definition}
Опишите инструмент, который загружает этот источник в ваш хранилище данных. Обратите внимание, что это свойство используется только в документации — dbt не использует его каким-либо значимым образом.

## Примеры {#examples}
### Указание, какой инструмент EL загрузил данные {#indicate-which-el-tool-loaded-data}

<File name='models/<filename>.yml'>

```yml

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