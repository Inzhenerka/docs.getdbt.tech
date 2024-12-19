---
title: Могу ли я строить свои модели в схеме, отличной от целевой схемы, или разделить свои модели по нескольким схемам?
description: "Вы можете строить модели вне целевой схемы"
sidebar_label: 'Как строить модели в схеме(ах), отличных от целевой схемы'
id: model-custom-schemas

---

Да! Используйте конфигурацию [schema](reference/resource-configs/schema.md) в вашем файле `dbt_project.yml` или используйте блок `config`:

<File name='dbt_project.yml'>

```yml

name: jaffle_shop
...

models:
  jaffle_shop:
    marketing:
      schema: marketing # семена в подкаталоге `models/mapping/` будут использовать схему marketing
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