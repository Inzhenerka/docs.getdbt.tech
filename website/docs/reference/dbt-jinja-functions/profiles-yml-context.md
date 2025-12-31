---
title: "О контексте profiles.yml"
sidebar_label: "Контекст profiles.yml"
id: "profiles-yml-context"
description: "Используйте эти методы контекста для настройки ресурсов в файле `profiles.yml`."
---

Следующие методы контекста доступны при настройке
ресурсов в файле `profiles.yml`.

**Доступные методы контекста:**
- [env_var](/reference/dbt-jinja-functions/env_var)
- [var](/reference/dbt-jinja-functions/var) (_Примечание: доступны только переменные, определенные с помощью `--vars`_)

### Пример использования {#example-usage}

<File name="~/.dbt/profiles.yml">

```yml
jaffle_shop:
  target: dev
  outputs:
    dev:
      type: redshift
      host: "{{ env_var('DBT_HOST') }}"
      user: "{{ env_var('DBT_USER') }}"
      password: "{{ env_var('DBT_PASS') }}"
      port: 5439
      dbname: analytics
      schema: dbt_dbanin
      threads: 4
```

</File>