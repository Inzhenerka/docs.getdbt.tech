---
title: execute_hooks_on_any_reuse
description: "Настройте выполнение pre- и post-хуков, когда dbt State пропускает узел, поскольку он всё ещё актуален."
id: "execute-hooks-on-any-reuse"
tags: ['dbt State']
---

# execute_hooks_on_any_reuse

<Tabs>
<TabItem value="project" label="YAML-файл проекта">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      execute_hooks_on_any_reuse: true | false
```

</File>
</TabItem>

<TabItem value="property" label="YAML-файл свойств">

<File name="models/<filename>.yml">

```yaml
models:
  - name: my_model
    config:
      state:
        execute_hooks_on_any_reuse: true | false
```

</File>
</TabItem>

<TabItem value="sql" label="Конфигурация в SQL-файле">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "execute_hooks_on_any_reuse": true | false
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Определение

Когда dbt State пропускает узел, поскольку он всё ещё актуален, pre- и post-хуки этого узла по умолчанию не выполняются. Это соответствует стандартному поведению dbt: если узел не выполнялся, его хуки не запускаются.

Установите `execute_hooks_on_any_reuse: true`, если у вас есть хуки аудита или другие хуки, которые должны запускаться при каждом запуске задания независимо от того, был ли узел перестроен или использован повторно.

| Значение | Поведение |
|-------|----------|
| `false` (по умолчанию) | Хуки пропускаются, когда узел используется повторно без перестроения. |
| `true` | Хуки запускаются, даже когда узел используется повторно. |

Хуки всегда выполняются, когда dbt State _клонирует_ узел из другого окружения, поскольку на этапе клонирования в хранилище данных создаётся новый объект.

## Пример

### Всегда запускать хуки аудита

Используйте `execute_hooks_on_any_reuse: true` для узлов с хуками аудита или отслеживания происхождения данных, которые должны выполняться при каждом запуске задания:

<File name="models/fct_orders.yml">

```yaml
models:
  - name: fct_orders
    config:
      state:
        execute_hooks_on_any_reuse: true
      post-hook:
        - "INSERT INTO audit_log VALUES ('{{ model.name }}', CURRENT_TIMESTAMP())"
```

</File>

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
- [Хуки](/docs/build/hooks-operations)
