---
title: "Конфигурации ClickHouse"
description: "Прочтите это руководство, чтобы понять конфигурации ClickHouse в dbt."
id: "clickhouse-configs"
---

## Модели

| Тип                         | Поддерживается? | Подробности                                                                                                                          |
|-----------------------------|-----------------|-------------------------------------------------------------------------------------------------------------------------------------|
| материализация view         | ДА              | Создает [представление](https://clickhouse.com/docs/en/sql-reference/table-functions/view/).                                         |
| материализация table        | ДА              | Создает [таблицу](https://clickhouse.com/docs/en/operations/system-tables/tables/). См. ниже список поддерживаемых движков.          |
| материализация incremental  | ДА              | Создает таблицу, если она не существует, и затем записывает в нее только обновления.                                                 |
| материализация ephemeral    | ДА              | Создает временную/CTE материализацию. Эта модель является внутренней для dbt и не создает никаких объектов в базе данных.            |

## Экспериментальные модели

Следующие функции являются [экспериментальными](https://clickhouse.com/docs/en/beta-and-experimental-features) в ClickHouse:

| Тип                                     | Поддерживается?        | Подробности                                                                                                                                                                                                                                         |
|-----------------------------------------|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Материализация Materialized View        | ДА, Экспериментально   | Создает [материализованное представление](https://clickhouse.com/docs/en/materialized-view).                                                                                                                                                        |
| Материализация Distributed table        | ДА, Экспериментально   | Создает [распределенную таблицу](https://clickhouse.com/docs/en/engines/table-engines/special/distributed).                                                                                                                                         |
| Материализация Distributed incremental  | ДА, Экспериментально   | Инкрементальная модель на основе той же идеи, что и распределенная таблица. Обратите внимание, что не все стратегии поддерживаются, посетите [эту страницу](https://github.com/ClickHouse/dbt-clickhouse?tab=readme-ov-file#distributed-incremental-materialization) для получения дополнительной информации. |
| Материализация Dictionary               | ДА, Экспериментально   | Создает [словарь](https://clickhouse.com/docs/en/engines/table-engines/special/dictionary).                                                                                                                                                         |

### Материализация View

Модель dbt может быть создана как [представление ClickHouse](https://clickhouse.com/docs/en/sql-reference/table-functions/view/) и настроена с использованием следующего синтаксиса:

<Tabs
groupId="config-view"
defaultValue="project-yaml"
values={[
{ label: 'Файл проекта', value: 'project-yaml', },
{ label: 'Блок конфигурации', value: 'config', },
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

### Материализация Table

Модель dbt может быть создана как [таблица ClickHouse](https://clickhouse.com/docs/en/operations/system-tables/tables/) и настроена с использованием следующего синтаксиса:

<Tabs
groupId="config-table"
defaultValue="project-yaml"
values={[
{ label: 'Файл проекта', value: 'project-yaml', },
{ label: 'Блок конфигурации', value: 'config', },
]
}>

<TabItem value="project-yaml">
<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    +materialized: table
    +order_by: [ <column-name>, ... ]
    +engine: <engine-type>
    +partition_by: [ <column-name>, ... ]
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = "table",
    engine = "<engine-type>",
    order_by = [ "<column-name>", ... ],
    partition_by = [ "<column-name>", ... ],
      ...
    ]
) }}
```

</File>
</TabItem>
</Tabs>

#### Конфигурация таблицы

| Опция            | Описание                                                                                                                                          | Обязательно?                        |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
| `materialized`   | Как модель будет материализована в ClickHouse. Должно быть `table`, чтобы создать модель таблицы.                                                 | Обязательно                         |
| `engine`         | Движок таблицы, используемый при создании таблиц. См. список поддерживаемых движков ниже.                                                         | Необязательно (по умолчанию: `MergeTree()`) |
| `order_by`       | Кортеж имен столбцов или произвольных выражений. Это позволяет создать небольшой разреженный индекс, который помогает быстрее находить данные.    | Необязательно (по умолчанию: `tuple()`)     |
| `partition_by`   | Раздел — это логическое объединение записей в таблице по заданному критерию. Ключ раздела может быть любым выражением из столбцов таблицы.        | Необязательно                        |

### Инкрементальная материализация

Модель таблицы будет перестраиваться при каждом выполнении dbt. Это может быть нецелесообразно и чрезвычайно затратно для больших наборов данных или сложных преобразований. Чтобы решить эту проблему и сократить время сборки, модель dbt может быть создана как инкрементальная таблица ClickHouse и настроена с использованием следующего синтаксиса:

<Tabs
groupId="config-incremental"
defaultValue="project-yaml"
values={[
{ label: 'Файл проекта', value: 'project-yaml', },
{ label: 'Блок конфигурации', value: 'config', },
]}
>

<TabItem value="project-yaml">
<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    +materialized: incremental
    +order_by: [ <column-name>, ... ]
    +engine: <engine-type>
    +partition_by: [ <column-name>, ... ]
    +unique_key: [ <column-name>, ... ]
    +inserts_only: [ True|False ]
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = "incremental",
    engine = "<engine-type>",
    order_by = [ "<column-name>", ... ],
    partition_by = [ "<column-name>", ... ],
    unique_key = [ "<column-name>", ... ],
    inserts_only = [ True|False ],
      ...
    ]
) }}
```

</File>
</TabItem>
</Tabs>

#### Конфигурация инкрементальной таблицы

| Опция                    | Описание                                                                                                                                                                                                                                                       | Обязательно?                                                                            |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| `materialized`           | Как модель будет материализована в ClickHouse. Должно быть `table`, чтобы создать модель таблицы.                                                                                                                                                              | Обязательно                                                                             |
| `unique_key`             | Кортеж имен столбцов, которые уникально идентифицируют строки. Для получения более подробной информации об ограничениях уникальности см. [здесь](/docs/build/incremental-models#defining-a-unique-key-optional).                                              | Обязательно. Если не указано, измененные строки будут добавлены дважды в инкрементальную таблицу. |
| `engine`                 | Движок таблицы, используемый при создании таблиц. См. список поддерживаемых движков ниже.                                                                                                                                                                      | Необязательно (по умолчанию: `MergeTree()`)                                             |
| `order_by`               | Кортеж имен столбцов или произвольных выражений. Это позволяет создать небольшой разреженный индекс, который помогает быстрее находить данные.                                                                                                                 | Необязательно (по умолчанию: `tuple()`)                                                 |
| `partition_by`           | Раздел — это логическое объединение записей в таблице по заданному критерию. Ключ раздела может быть любым выражением из столбцов таблицы.                                                                                                                    | Необязательно                                                                           |
| `inserts_only`           | (Устарело, см. стратегию материализации `append`). Если True, инкрементальные обновления будут вставлены непосредственно в целевую инкрементальную таблицу без создания промежуточной таблицы.                                                                | Необязательно (по умолчанию: `False`)                                                   |
| `incremental_strategy`   | Стратегия, используемая для инкрементальной материализации. Поддерживаются `delete+insert`, `append` и `insert_overwrite` (экспериментально). Для получения дополнительной информации о стратегиях см. [здесь](https://github.com/ClickHouse/dbt-clickhouse#incremental-model-strategies) | Необязательно (по умолчанию: 'default')                                                 |
| `incremental_predicates` | Условие инкрементального предиката, применяемое к материализациям `delete+insert`                                                                                                                                                                              | Необязательно                                                                           |

## Снимок

Снимки dbt позволяют фиксировать изменения в изменяемой модели с течением времени. Это, в свою очередь, позволяет выполнять запросы на модели с указанием времени, где аналитики могут "вернуться в прошлое" и посмотреть на предыдущее состояние модели. Эта функциональность поддерживается коннектором ClickHouse и настраивается с использованием следующего синтаксиса:

<VersionBlock lastVersion="1.8">

<File name='snapshots/<model_name>.sql'>

```jinja
{{
   config(
     target_schema = "<schema_name>",
     unique_key = "<column-name>",
     strategy = "<strategy>",
     updated_at = "<unpdated_at_column-name>",
   )
}}
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.9">

<File name='snapshots/<model_name>.sql'>

```jinja
{{
   config(
     schema = "<schema-name>",
     unique_key = "<column-name>",
     strategy = "<strategy>",
     updated_at = "<updated-at-column-name>",
   )
}}
```

</File>

</VersionBlock>

Для получения дополнительной информации о конфигурации, ознакомьтесь со страницей справки [snapshot configs](/reference/snapshot-configs).

## Поддерживаемые движки таблиц

| Тип                    | Подробности                                                                                   |
|------------------------|-----------------------------------------------------------------------------------------------|
| MergeTree (по умолчанию) | https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/mergetree/.           |
| HDFS                   | https://clickhouse.com/docs/en/engines/table-engines/integrations/hdfs                        |
| MaterializedPostgreSQL | https://clickhouse.com/docs/en/engines/table-engines/integrations/materialized-postgresql     |
| S3                     | https://clickhouse.com/docs/en/engines/table-engines/integrations/s3                          |
| EmbeddedRocksDB        | https://clickhouse.com/docs/en/engines/table-engines/integrations/embedded-rocksdb            |
| Hive                   | https://clickhouse.com/docs/en/engines/table-engines/integrations/hive                        |

## Экспериментальные поддерживаемые движки таблиц

| Тип               | Подробности                                                                   |
|-------------------|-------------------------------------------------------------------------------|
| Distributed Table | https://clickhouse.com/docs/en/engines/table-engines/special/distributed.     |
| Dictionary        | https://clickhouse.com/docs/en/engines/table-engines/special/dictionary       |

Если у вас возникли проблемы с подключением к ClickHouse из dbt с использованием одного из указанных выше движков, пожалуйста, сообщите о проблеме [здесь](https://github.com/ClickHouse/dbt-clickhouse/issues).

## Поддержка макросов для работы с несколькими базами данных

dbt-clickhouse поддерживает большинство макросов для работы с несколькими базами данных, которые теперь включены в dbt-core, за исключением следующих:

* SQL-функция `split_part` реализована в ClickHouse с использованием функции splitByChar. Эта функция требует использования постоянной строки в качестве разделителя, поэтому параметр `delimeter`, используемый для этого макроса, будет интерпретироваться как строка, а не имя столбца.
* Аналогично, SQL-функция `replace` в ClickHouse требует постоянных строк для параметров `old_chars` и `new_chars`, поэтому эти параметры будут интерпретироваться как строки, а не имена столбцов при вызове этого макроса.

## Установка `quote_columns`

Чтобы избежать предупреждения, убедитесь, что вы явно установили значение для `quote_columns` в вашем `dbt_project.yml`. См. [документацию о quote_columns](https://docs.getdbt.com/reference/resource-configs/quote_columns) для получения дополнительной информации.

```yaml
seeds:
  +quote_columns: false  #или `true`, если у вас есть заголовки столбцов csv с пробелами
```