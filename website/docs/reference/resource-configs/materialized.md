---
resource_types: [models]
description: "Материализация - Прочитайте это подробное руководство, чтобы узнать о материализациях в dbt."
datatype: "string"
---

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
[config-version](/reference/project-configs/config-version): 2

models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +materialized: [<materialization_name>](https://docs.getdbt.com/docs/build/materializations#materializations)
```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: <model_name>
    config:
      materialized: [<materialization_name>](https://docs.getdbt.com/docs/build/materializations#materializations)

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
  materialized="[<materialization_name>](https://docs.getdbt.com/docs/build/materializations#materializations)"
) }}

select ...
```

</File>

</TabItem>

</Tabs>

## Определение 

[Материализации](/docs/build/materializations#materializations) — это стратегии для сохранения моделей dbt в хранилище данных. Вот типы материализаций, встроенные в dbt:

- `ephemeral` &mdash; [эпhemeral](/docs/build/materializations#ephemeral) модели не создаются непосредственно в базе данных
- `table` &mdash; модель пересоздается как [таблица](/docs/build/materializations#table) при каждом запуске
- `view` &mdash; модель пересоздается как [представление](/docs/build/materializations#view) при каждом запуске
- `materialized_view` &mdash; позволяет создавать и поддерживать [материализованные представления](/docs/build/materializations#materialized-view) в целевой базе данных
- `incremental` &mdash; [инкрементальные](/docs/build/materializations#incremental) модели позволяют dbt вставлять или обновлять записи в таблице с момента последнего запуска этой модели

Вы также можете настраивать [пользовательские материализации](/guides/create-new-materializations?step=1) в dbt. Пользовательские материализации — это мощный способ расширить функциональность dbt в соответствии с вашими конкретными потребностями.

## Приоритет создания
<!-- Этот текст скопирован из /reference/resource-configs/on_configuration_change.md -->
Материализации реализуются в соответствии с этим жизненным циклом "drop through":

1. Если модель с указанным путем не существует, создайте новую модель.
2. Если модель существует, но имеет другой тип, удалите существующую модель и создайте новую.
3. Если указан [`--full-refresh`](/reference/resource-configs/full_refresh), замените существующую модель независимо от изменений конфигурации и настройки [`on_configuration_change`](/reference/resource-configs/on_configuration_change).
4. Если изменений конфигурации нет, выполните действие по умолчанию для этого типа (например, примените обновление для материализованного представления).
5. Определите, следует ли применять изменения конфигурации в соответствии с настройкой `on_configuration_change`.