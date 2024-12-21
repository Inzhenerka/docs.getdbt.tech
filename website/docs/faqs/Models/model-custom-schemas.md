---
title: Могу ли я создавать свои модели в схеме, отличной от целевой, или распределять модели по нескольким схемам?
description: "Вы можете создавать модели вне целевой схемы"
sidebar_label: 'Как создавать модели в схемах вне целевой схемы'
id: model-custom-schemas

---

Да! Используйте конфигурацию [schema](reference/resource-configs/schema.md) в вашем файле `dbt_project.yml` или с помощью блока `config`:

<File name='dbt_project.yml'>

```yml

name: jaffle_shop
...

models:
  jaffle_shop:
    marketing:
      schema: marketing # seeds в подкаталоге `models/mapping/` будут использовать схему marketing
```

</File>

<File name='models/customers.sql'>

```sql
{{
  config(
    schema='core'
  )
}}
```

</File>