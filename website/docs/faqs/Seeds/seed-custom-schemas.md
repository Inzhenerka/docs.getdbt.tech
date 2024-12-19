---
title: Могу ли я создавать свои семена в схеме, отличной от целевой схемы, или могу ли я разделить свои семена по нескольким схемам?
description: "Используйте конфигурацию схемы в вашем файле dbt_project.yml"
sidebar_label: 'Создание семян в схеме вне целевой схемы'
id: seed-custom-schemas

---

Да! Используйте конфигурацию [schema](reference/resource-configs/schema.md) в вашем файле `dbt_project.yml`.

<File name='dbt_project.yml'>

```yml

name: jaffle_shop
...

seeds:
  jaffle_shop:
    schema: mappings # все семена в этом проекте будут использовать схему "mappings" по умолчанию
    marketing:
      schema: marketing # семена в подкаталоге "seeds/marketing/" будут использовать схему "marketing"
```

</File>