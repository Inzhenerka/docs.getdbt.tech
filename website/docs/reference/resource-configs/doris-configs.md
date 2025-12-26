---
title: "Конфигурации Doris/SelectDB"
description: "Конфигурации Doris/SelectDB - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "doris-configs"
---

## Модели

| Тип                        | Поддерживается? | Подробности                                                                                                                                             |
|----------------------------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| материализация представления | ДА              | Создает [представление](https://doris.apache.org/docs/sql-manual/sql-reference/Data-Definition-Statements/Create/CREATE-VIEW/).                          |
| материализация таблицы     | ДА              | Создает [таблицу](https://doris.apache.org/docs/sql-manual/sql-reference/Data-Definition-Statements/Create/CREATE-TABLE/).                               |
| инкрементальная материализация | ДА           | Создает таблицу, если она не существует, и затем модель таблицы должна быть '[уникальной](https://doris.apache.org/docs/data-table/data-model#uniq-model/)'. |

### Материализация представления

Модель dbt может быть создана как представление Doris и настроена с использованием следующего синтаксиса:

<Tabs
groupId="config-view"
defaultValue="project-yaml"
values={[
  { label: 'YAML‑файл проекта', value: 'project-yaml', },
  { label: 'Конфигурация в SQL‑файле', value: 'config', },
]
}>

<TabItem value="project-yaml">
<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    +materialized: view
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(materialized = "view") }}
```

</File>
</TabItem>
</Tabs>

### Материализация таблицы

Модель dbt может быть создана как [таблица Doris](https://doris.apache.org/docs/sql-manual/sql-reference/Data-Definition-Statements/Create/CREATE-TABLE/) и настроена с использованием следующего синтаксиса:

<Tabs
groupId="config-table"
defaultValue="project-yaml"
values={[
  { label: 'Файл проекта YAML', value: 'project-yaml', },
  { label: 'Конфигурация в SQL‑файле', value: 'config', },
]
}>

<TabItem value="project-yaml">
<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    +materialized: table
    +duplicate_key: [ <column-name>, ... ],
    +partition_by: [ <column-name>, ... ],
    +partition_type: <engine-type>,
    +partition_by_init: [<pertition-init>, ... ]
    +distributed_by: [ <column-name>, ... ],
    +buckets: int,
    +properties: {<key>:<value>,...}
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = "table",
    duplicate_key = [ "<column-name>", ... ],
    partition_by = [ "<column-name>", ... ],
    partition_type = "<engine-type>",
    partition_by_init = ["<pertition-init>", ... ]
    distributed_by = [ "<column-name>", ... ],
    buckets = "int",
    properties = {"<key>":"<value>",...}
      ...
    ]
) }}
```

</File>
</TabItem>
</Tabs>

#### Конфигурация таблицы

| Опция               | Описание                                                                                                                                                                              | Обязательно?                |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| `materialized`      | Как модель будет материализована в Doris. Должно быть `table` для создания модели таблицы.                                                                                            | Обязательно                 |
| `duplicate_key`     | Список ключей модели таблицы Doris: '[duplicate](https://doris.apache.org/docs/data-table/data-model#duplicate-model)'.                                                               | Обязательно                 |
| `partition_by`      | Список ключей разделов Doris. ([Разделение Doris](https://doris.apache.org/docs/data-table/data-partition))                                                                           | Необязательно               |
| `partition_type`    | Тип раздела Doris.                                                                                                                                                                    | Необязательно (по умолчанию: `RANGE`) |
| `partition_by_init` | Правило разделения или некоторые реальные элементы разделов.                                                                                                                          | Необязательно               |
| `distributed_by`    | Список ключей распределения Doris.  ([Распределение Doris](https://doris.apache.org/docs/data-table/data-partition#partitioning-and-bucket))                                          | Обязательно                 |
| `buckets`           | Количество корзин в одном разделе Doris.                                                                                                                                              | Обязательно                 |
| `properties`        | Другие конфигурации Doris. ([Свойства Doris](https://doris.apache.org/docs/sql-manual/sql-reference/Data-Definition-Statements/Create/CREATE-TABLE/?&_highlight=properties))           | Обязательно                 |

### Инкрементальная материализация

Инкрементальная таблица Doris, модель таблицы должна быть 'уникальной' и настраивается с использованием следующего синтаксиса:

<Tabs
groupId="config-incremental"
defaultValue="project-yaml"
values={[
  { label: 'YAML-файл проекта', value: 'project-yaml', },
  { label: 'Конфигурация в SQL-файле', value: 'config', },
]}
>

<TabItem value="project-yaml">
<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    +materialized: incremental
    +unique_key: [ <column-name>, ... ],
    +partition_by: [ <column-name>, ... ],
    +partition_type: <engine-type>,
    +partition_by_init: [<pertition-init>, ... ]
    +distributed_by: [ <column-name>, ... ],
    +buckets: int,
    +properties: {<key>:<value>,...}
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = "incremental",
    unique_key = [ "<column-name>", ... ],
    partition_by = [ "<column-name>", ... ],
    partition_type = "<engine-type>",
    partition_by_init = ["<pertition-init>", ... ]
    distributed_by = [ "<column-name>", ... ],
    buckets = "int",
    properties = {"<key>":"<value>",...}
      ...
    ]
) }}
```

</File>
</TabItem>
</Tabs>

#### Конфигурация инкрементальной таблицы

| Опция               | Описание                                                                                                                                                                              | Обязательно?                |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| `materialized`      | Как модель будет материализована в Doris. Должно быть `table` для создания модели таблицы.                                                                                            | Обязательно                 |
| `unique_key`        | Список ключей модели таблицы Doris: '[Doris unique](https://doris.apache.org/docs/data-table/data-model#uniq-model)'.                                                                 | Обязательно                 |
| `partition_by`      | Список ключей разделов Doris. ([Разделение Doris](https://doris.apache.org/docs/data-table/data-partition))                                                                           | Необязательно               |
| `partition_type`    | Тип раздела Doris.                                                                                                                                                                    | Необязательно (по умолчанию: `RANGE`) |
| `partition_by_init` | Правило разделения или некоторые реальные элементы разделов.                                                                                                                          | Необязательно               |
| `distributed_by`    | Список ключей распределения Doris.  ([Распределение Doris](https://doris.apache.org/docs/data-table/data-partition#partitioning-and-bucket))                                          | Обязательно                 |
| `buckets`           | Количество корзин в одном разделе Doris.                                                                                                                                              | Обязательно                 |
| `properties`        | Другие конфигурации Doris. ([Свойства Doris](https://doris.apache.org/docs/sql-manual/sql-reference/Data-Definition-Statements/Create/CREATE-TABLE/?&_highlight=properties))           | Обязательно                 |