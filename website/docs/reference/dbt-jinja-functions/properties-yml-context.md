---
title: "О контексте properties.yml"
sidebar_label: "Контекст properties.yml"
id: "dbt-properties-yml-context"
description: "Методы и переменные контекста, доступные при настройке ресурсов в файле properties.yml."
---

Следующие методы и переменные контекста доступны при настройке ресурсов в файле `properties.yml`.

**Доступные методы контекста:**
- [env_var](/reference/dbt-jinja-functions/env_var)
- [var](/reference/dbt-jinja-functions/var)

**Доступные переменные контекста:**
- [target](/reference/dbt-jinja-functions/target)
- [builtins](/reference/dbt-jinja-functions/builtins)
- [dbt_version](/reference/dbt-jinja-functions/dbt_version)

### Пример конфигурации {#example-configuration}

<File name='properties.yml'>

```yml
# Настройте эту модель для материализации как представление
# в среде разработки и как таблицу в контекстах производства/CI

models:
  - name: dim_customers
    config:
      materialized: "{{ 'view' if target.name == 'dev' else 'table' }}"
```

</File>