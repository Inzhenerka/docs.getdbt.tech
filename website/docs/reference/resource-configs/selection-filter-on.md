---
title: selection_filter_on
id: "selection-filter-on"
description: "Настройте, какие выходные столбцы dbt использует для сопоставления строк результатов проверки с селектором."
resource_types: [checks]
datatype: string | [string] | none
availability:
  engine: v2
---

Когда вы передаёте селектор (`--select`, `--exclude`, `--selector`) в `dbt check` или `dbt build`, dbt использует его, чтобы определить, какие ресурсы проекта оценивает каждая проверка. `selection_filter_on` указывает dbt, какой столбец в результатах проверки содержит идентификаторы ресурсов для сопоставления с выборкой.


## Значения

import SelectionFilterOnValues from '/snippets/_selection-filter-on-values.md';

<SelectionFilterOnValues />

## Когда задавать эту настройку

Если ваша проверка возвращает столбец `unique_id`, задавать эту настройку не нужно.

Используйте `selection_filter_on`, если ваша проверка возвращает строки со столбцами идентификаторов, отличными от `unique_id`. Укажите в этой настройке столбцы, содержащие идентификаторы ресурсов, чтобы селекторы могли ограничивать набор строк по этим столбцам.

Следующая проверка запрашивает таблицу `edges` и возвращает `child_unique_id` вместо `unique_id`, поэтому необходимо задать `selection_filter_on`:

<File name='checks/multiple_sources_joined.sql'>

```sql
select child_unique_id, count(*) as source_parents
from {{ info_schema('edges') }}
where parent_unique_id like 'source.%'
group by child_unique_id
having count(*) > 1
```
</File>

Настройте `selection_filter_on` для этой проверки одним из следующих способов:

<Tabs
  groupId="config-languages"
  defaultValue="property-yaml"
  values={[
    { label: 'YAML-файл проекта', value: 'project-yaml', },
    { label: 'YAML-файл свойств', value: 'property-yaml', },
    { label: 'Настройка в SQL-файле', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
checks:
  +selection_filter_on: child_unique_id
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='checks/_checks.yml'>

```yaml
version: 2
checks:
  - name: multiple_sources_joined
    description: "Проверка завершается неудачей, если какая-либо модель читает данные напрямую более чем из одного источника."
    config:
      selection_filter_on: child_unique_id
```

</File>

</TabItem>

<TabItem value="config">

<File name='checks/multiple_sources_joined.sql'>

```sql
{{ config(
    selection_filter_on = "child_unique_id"
) }}
```

</File>

</TabItem>

</Tabs>

## Связанная документация

- [Проверки](/docs/build/checks)
- [Настройки проверок](/reference/check-configs)
- [Использование селекторов с проверками](/docs/build/checks#using-selectors-with-checks)
