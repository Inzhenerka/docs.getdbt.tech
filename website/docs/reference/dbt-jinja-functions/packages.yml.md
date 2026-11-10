---
title: "О контексте packages.yml"
sidebar_label: "Контекст packages.yml"
id: "packages.yml context"
description: "Используйте эти методы контекста для настройки зависимостей в файле packages.yml."
---

Следующие методы и переменные контекста доступны при настройке файла `packages.yml`. 

**Доступные методы контекста:**
- [env_var](/reference/dbt-jinja-functions/env_var)
    - Используйте `env_var()` в любом YAML-файле dbt, который поддерживает Jinja. Только `packages.yml` и `profiles.yml` поддерживают переменные окружения для [секретных значений](/docs/build/dbt-tips#yaml-tips) (с префиксом `DBT_ENV_SECRET_`).
- [var](/reference/dbt-jinja-functions/var) (Примечание: доступны только переменные, заданные с помощью `--vars`. Дополнительную информацию см. в разделе [Советы по YAML](/docs/build/dbt-tips#yaml-tips))

**Доступные переменные контекста:**
- [builtins](/reference/dbt-jinja-functions/builtins)
- [dbt_version](/reference/dbt-jinja-functions/dbt_version)
- [target](/reference/dbt-jinja-functions/target)

## Примеры использования

Следующие примеры показывают, как использовать различные методы и переменные контекста в файле `packages.yml`.

Используйте `builtins` в файле `packages.yml`:

```
packages:
  - package: dbt-labs/dbt_utils
    version: "{% if builtins is defined %}0.14.0{% else %}0.13.1{% endif %}"

```

Используйте `env_var` в файле `packages.yml`:

```
packages:
  - package: dbt-labs/dbt_utils
    version: "{{ env_var('DBT_UTILS_VERSION') }}"
```

Используйте `dbt_version` в файле `packages.yml`:

```
packages:
  - package: dbt-labs/dbt_utils
    version: "{% if dbt_version is defined %}0.14.0{% else %}0.13.1{% endif %}"

```

Используйте `target` в файле `packages.yml`:

```

packages:
  - package: dbt-labs/dbt_utils
    version: "{% if target.name == 'prod' %}0.14.0{% else %}0.13.1{% endif %}"

```

## Связанная документация

- [Пакеты](/docs/build/packages)
