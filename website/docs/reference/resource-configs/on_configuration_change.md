---
resource_types: [models]
description: "on_configuration_change - Прочтите это подробное руководство, чтобы узнать о мониторинге изменений конфигурации в dbt."
datatype: "string"
---

:::info
Эта функциональность в настоящее время поддерживается только для [материализованных представлений](/docs/build/materializations#materialized-view) на ограниченном наборе адаптеров.
:::

Конфигурация `on_configuration_change` имеет три настройки:
- `apply` (по умолчанию) &mdash; Пытается обновить существующий объект базы данных, если это возможно, избегая полного пересоздания.
  - *Примечание:* Если любое отдельное изменение конфигурации требует полного обновления, выполняется полное обновление вместо отдельных операторов изменения.
- `continue` &mdash; Позволяет продолжить выполнение, при этом выдавая предупреждение о том, что объект остался нетронутым.
  - *Примечание:* Это может привести к сбоям в последующих моделях, так как они могут зависеть от этих не реализованных изменений.
- `fail` &mdash; Принудительно завершает выполнение, если обнаружено изменение.

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'YAML-файл проекта', value: 'project-yaml', },
    { label: 'YAML-файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация в SQL-файле', value: 'config', },
  ]
}>


<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): <materialization_name>
    [+](/reference/resource-configs/plus-prefix)on_configuration_change: apply | continue | fail
```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): <materialization_name>
      on_configuration_change: apply | continue | fail
```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)="<materialization_name>",
    on_configuration_change="apply" | "continue" | "fail"
) }}
```

</File>

</TabItem>

</Tabs>

Материализации реализуются в соответствии с этим "сквозным" жизненным циклом:
1. Если модель не существует по указанному пути, создается новая модель.
2. Если модель существует, но имеет другой тип, удаляется существующая модель и создается новая.
3. Если указан параметр [`--full-refresh`](/reference/resource-configs/full_refresh), заменяется существующая модель независимо от изменений конфигурации и настройки `on_configuration_change`.
4. Если изменений конфигурации нет, выполняется действие по умолчанию для этого типа (например, применяется обновление для материализованного представления).
5. Определяется, следует ли применять изменения конфигурации в соответствии с настройкой `on_configuration_change`.