---
title: Что делать, если источник находится в схеме или таблице с неудачным именем?
description: "Используйте свойства schema и identifier для задания имен"
sidebar_label: 'Источник в схеме или таблице с неудачным именем'
id: source-has-bad-name

---

По умолчанию dbt будет использовать параметры `name:` для построения ссылки на источник.

Если эти имена не совсем идеальны, используйте свойства [schema](/reference/resource-properties/schema) и [identifier](/reference/resource-properties/identifier), чтобы определить имена в соответствии с базой данных, и используйте свойство `name:` для имени, которое имеет смысл!

<File name='models/<filename>.yml'>

```yml
sources:
  - name: jaffle_shop
    database: raw
    schema: postgres_backend_public_schema
    tables:
      - name: orders
        identifier: api_orders
```

</File>


В модели, использующей этот источник:
```sql
select * from {{ source('jaffle_shop', 'orders') }}
```

Будет скомпилировано в:
```sql
select * from raw.postgres_backend_public_schema.api_orders
```