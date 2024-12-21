---
title: Могу ли я создавать свои seeds в схеме, отличной от целевой, или могу ли я распределить свои seeds по нескольким схемам?
description: "Используйте конфигурацию schema в вашем файле dbt_project.yml"
sidebar_label: 'Создание seeds в схеме вне целевой схемы'
id: seed-custom-schemas

---

Да! Используйте конфигурацию [schema](reference/resource-configs/schema.md) в вашем файле `dbt_project.yml`.

<File name='dbt_project.yml'>

```yml

name: jaffle_shop
...

seeds:
  jaffle_shop:
    schema: mappings # все seeds в этом проекте по умолчанию будут использовать схему "mappings"
    marketing:
      schema: marketing # seeds в подкаталоге "seeds/marketing/" будут использовать схему "marketing"
```

</File>