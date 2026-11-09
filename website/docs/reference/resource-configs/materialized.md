---
resource_types: [models]
description: "Материализация - Прочтите это подробное руководство, чтобы узнать о материализациях в dbt."
datatype: "string"
---

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
[config-version](/reference/project-configs/config-version): 2

models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +materialized: [<materialization_name>](/docs/build/materializations#materializations)
```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml

models:
  - name: <model_name>
    config:
      materialized: [<materialization_name>](/docs/build/materializations#materializations)

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
  materialized="[<materialization_name>](/docs/build/materializations#materializations)"
) }}

select ...
```

</File>

</TabItem>

</Tabs>

## Определение {#definition}

[Материализации](/docs/build/materializations#materializations) — это стратегии для сохранения моделей dbt в хранилище данных. Вот типы материализаций, встроенные в dbt:

- `ephemeral` &mdash; [эфемерные](/docs/build/materializations#ephemeral) модели не создаются непосредственно в базе данных
- `table` &mdash; модель пересоздаётся как [таблица](/docs/build/materializations#table) при каждом запуске
- `view` &mdash; модель пересоздаётся как [представление](/docs/build/materializations#view) при каждом запуске
- `materialized_view` &mdash; позволяет создавать и поддерживать [материализованные представления](/docs/build/materializations#materialized-view) в целевой базе данных
- `incremental` &mdash; [инкрементальные](/docs/build/materializations#incremental) модели позволяют dbt вставлять или обновлять записи в `table`, изменившиеся с момента последнего запуска этой модели

Вы также можете настроить [пользовательские материализации](/guides/create-new-materializations?step=1) в dbt. Пользовательские материализации — это мощный способ расширить функциональность dbt в соответствии с вашими конкретными потребностями.

import Creationprecedence from '/snippets/_creation-precedence.md';

<Creationprecedence />
