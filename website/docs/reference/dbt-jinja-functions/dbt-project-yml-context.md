---
title: "О контексте dbt_project.yml"
sidebar_label: "Контекст dbt_project.yml"
id: "dbt-project-yml-context"
description: "Методы и переменные контекста, доступные при конфигурации ресурсов в файле dbt_project.yml."
---

Следующие методы и переменные контекста доступны при конфигурации
ресурсов в файле `dbt_project.yml`. Это относится к ключам `models:`, `seeds:`
и `snapshots:` в файле `dbt_project.yml`.

**Доступные методы контекста:**
- [env_var](/reference/dbt-jinja-functions/env_var)
- [var](/reference/dbt-jinja-functions/var) (_Примечание: доступны только переменные, определённые с помощью `--vars`_)

**Доступные переменные контекста:**
- [target](/reference/dbt-jinja-functions/target)
- [builtins](/reference/dbt-jinja-functions/builtins)
- [dbt_version](/reference/dbt-jinja-functions/dbt_version)

### Пример конфигурации

<File name='dbt_project.yml'>

```yml
name: my_project
version: 1.0.0

# Настройка моделей в models/facts/ так, чтобы они материализовались как views
# в среде разработки и как tables в production/CI контекстах

models:
  my_project:
    facts:
      +materialized: "{{ 'view' if target.name == 'dev' else 'table' }}"
```

</File>
