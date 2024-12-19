---
title: Что делать, если мой источник находится в плохо названной схеме или таблице?
description: "Используйте свойства schema и identifier для определения имен"
sidebar_label: 'Источник в плохо названной схеме или таблице'
id: source-has-bad-name

---

По умолчанию dbt будет использовать параметры `name:` для создания ссылки на источник.

Если эти имена не идеальны, используйте свойства [schema](/reference/resource-properties/schema) и [identifier](/reference/resource-properties/identifier), чтобы определить имена в соответствии с базой данных, а свойство `name:` используйте для имени, которое имеет смысл!

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: jaffle_shop
    schema: postgres_backend_public_schema
    database: raw
    tables:
      - name: orders
        identifier: api_orders

```

</File>

В модели ниже:
```sql
select * from {{ source('jaffle_shop', 'orders') }}
```

Будет скомпилировано в:
```sql
select * from raw.postgres_backend_public_schema.api_orders
```