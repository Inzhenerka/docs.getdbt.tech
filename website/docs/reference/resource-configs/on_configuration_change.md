---
resource_types: [models]
description: "on_configuration_change - Прочитайте это подробное руководство, чтобы узнать о мониторинге изменений конфигурации в dbt."
datatype: "string"
---

:::info
Эта функциональность в настоящее время поддерживается только для [материализованных представлений](/docs/build/materializations#materialized-view) на ограниченном наборе адаптеров.
:::

Конфигурация `on_configuration_change` имеет три настройки:
- `apply` (по умолчанию) &mdash; Попытаться обновить существующий объект базы данных, если это возможно, избегая полной перестройки.
  - *Примечание:* Если любое отдельное изменение конфигурации требует полной перезагрузки, выполняется полная перезагрузка вместо отдельных операторов изменения.
- `continue` &mdash; Позволить запускам продолжаться, одновременно предоставляя предупреждение о том, что объект остался нетронутым.
  - *Примечание:* Это может привести к сбоям на следующих этапах, так как эти модели могут зависеть от этих не реализованных изменений.
- `fail` &mdash; Принудительно завершить весь запуск с ошибкой, если обнаружено изменение.

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Блок конфигурации', value: 'config', },
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
version: 2

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

Материализации реализуются в соответствии с этим циклом жизни "drop through":
1. Если модель не существует по указанному пути, создайте новую модель.
2. Если модель существует, но имеет другой тип, удалите существующую модель и создайте новую.
3. Если указан [`--full-refresh`](/reference/resource-configs/full_refresh), замените существующую модель независимо от изменений конфигурации и настройки `on_configuration_change`.
4. Если изменений конфигурации нет, выполните действие по умолчанию для этого типа (например, примените обновление для материализованного представления).
5. Определите, следует ли применять изменения конфигурации в соответствии с настройкой `on_configuration_change`.