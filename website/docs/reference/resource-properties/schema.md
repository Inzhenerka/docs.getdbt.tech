---
title: "Определение свойства источника схемы"
sidebar_label: "схема"
resource_types: sources
datatype: schema_name
---

<File name='models/<filename>.yml'>

```yml

[sources](/reference/source-properties):
  - name: <source_name>
    database: <database_name>
    schema: <schema_name>
    tables:
      - name: <table_name>
      - ...

```

</File>

## Определение {#definition}
Имя схемы, как оно хранится в базе данных.

Этот параметр полезен, если вы хотите использовать имя [источника](/reference/source-properties), отличное от имени схемы.


:::info Терминология BigQuery

Если вы используете BigQuery, используйте имя _dataset_ в качестве свойства `schema`.

:::

## По умолчанию {#default}
По умолчанию dbt будет использовать параметр `name` источника в качестве имени схемы.

## Примеры {#examples}
### Использование более простого имени для схемы источника, чем в вашей базе данных {#use-a-simpler-name-for-a-source-schema-than-the-one-in-your-database}

<File name='models/<filename>.yml'>

```yml

sources:
  - name: jaffle_shop
    schema: postgres_backend_public_schema
    tables:
      - name: orders

```

</File>


В модели, использующей данные:
```sql
select * from {{ source('jaffle_shop', 'orders') }}
```

Будет скомпилировано в:
```sql
select * from postgres_backend_public_schema.orders
```