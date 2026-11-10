---
title: Конфигурации проверок
description: "Настройте severity, enabled, selection_filter_on, tags и meta для проверок."
availability:
  engine: v2
meta:
  resource_type: Checks
---

## Связанная документация
- [Проверки](/docs/build/checks)
- [Свойства проверок](/reference/check-properties)
- [Команда `dbt check`](/reference/commands/check)

## Доступные конфигурации

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'YAML-файл проекта', value: 'project-yaml', },
    { label: 'YAML-файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация в SQL', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
checks:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[severity](/reference/resource-configs/severity): error | warn
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[selection_filter_on](/reference/resource-configs/selection-filter-on): column_name | [column_names] | none
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): string | [string]
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta): {dictionary}
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='checks/_checks.yml'>

```yaml
version: 2

checks:
  - name: check-name
    config:
      [severity](/reference/resource-configs/severity): error | warn
      [enabled](/reference/resource-configs/enabled): true | false
      [selection_filter_on](/reference/resource-configs/selection-filter-on): column_name | [column_names] | none
      [tags](/reference/resource-configs/tags): string | [string]
      [meta](/reference/resource-configs/meta): {dictionary}
```

</File>

</TabItem>

<TabItem value="config">

<File name='checks/<check_name>.sql'>

```sql
{{ config(
    severity = "error" | "warn",
    enabled = true | false,
    selection_filter_on = "column_name" | ["column_names"] | "none",
    tags = ["string"],
    meta = {"key": "value"}
) }}

select ...
from {{ info_schema('models') }}
where ...
```

</File>

</TabItem>

</Tabs>

## Примеры

Следующие примеры показывают распространённые способы настройки проверок.

### Предупреждение при неуспешной проверке

Вы можете использовать `severity: warn` при постепенном внедрении нового правила. Проблемы записываются в журнал, но не приводят к ошибке сборки.

<File name='checks/_public_models_have_owners.yml'>

```yaml
checks:
  - name: public_models_have_owners
    config:
      severity: warn  # по умолчанию — error
```

</File>

### Фильтрация по определённому столбцу

В таблице `edges` нет столбца `unique_id`, поэтому проверки, которые обращаются к ней, не возвращают этот столбец. При использовании `--select` dbt ищет столбец `unique_id`, чтобы ограничить результаты, но не находит его, поэтому проверка выполняется для всего проекта независимо от селектора. Укажите в `selection_filter_on` столбцы, содержащие идентификаторы ресурсов, чтобы `--select` фильтровал строки по этим столбцам. Например, проверка `multiple_sources_joined` выполняет агрегацию по `child_unique_id`, поэтому достаточно указать только этот столбец:

<File name='checks/_multiple_sources_joined.yml'>

```yaml
checks:
  - name: multiple_sources_joined
    config:
      selection_filter_on: child_unique_id
```

</File>
