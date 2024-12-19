---
title: "Конфигурации ClickHouse"
description: "Прочитайте это руководство, чтобы понять конфигурации ClickHouse в dbt."
id: "clickhouse-configs"
---

## Модели

| Тип                          | Поддерживается? | Подробности                                                                                                                        |
|------------------------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------|
| материализация представления   | ДА              | Создает [представление](https://clickhouse.com/docs/en/sql-reference/table-functions/view/).                                       |
| материализация таблицы        | ДА              | Создает [таблицу](https://clickhouse.com/docs/en/operations/system-tables/tables/). См. ниже список поддерживаемых движков.      |
| инкрементальная материализация | ДА              | Создает таблицу, если она не существует, и затем записывает только обновления в нее.                                            |
| эфемерная материализация      | ДА              | Создает эфемерную/CTE материализацию. Эта модель является внутренней для dbt и не создает никаких объектов базы данных.            |

## Экспериментальные модели
Следующие функции являются [экспериментальными](https://clickhouse.com/docs/en/beta-and-experimental-features) в ClickHouse:

| Тип                                      | Поддерживается?        | Подробности                                                                                                                                                                                                                                         |
|------------------------------------------|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Материализация материализованного представления | ДА, экспериментально    | Создает [материализованное представление](https://clickhouse.com/docs/en/materialized-view).                                                                                                                                                      |
| Материализация распределенной таблицы    | ДА, экспериментально    | Создает [распределенную таблицу](https://clickhouse.com/docs/en/engines/table-engines/special/distributed).                                                                                                                                      |
| Инкрементальная материализация распределенной таблицы | ДА, экспериментально    | Инкрементальная модель, основанная на той же идее, что и распределенная таблица. Обратите внимание, что не все стратегии поддерживаются, посетите [это](https://github.com/ClickHouse/dbt-clickhouse?tab=readme-ov-file#distributed-incremental-materialization) для получения дополнительной информации. |
| Материализация словаря                  | ДА, экспериментально    | Создает [словарь](https://clickhouse.com/docs/en/engines/table-engines/special/dictionary).                                                                                                                                                      |

### Материализация представления

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

### Материализация таблицы

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

| Опция          | Описание                                                                                                                                          | Обязательно?                         |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
| `materialized` | Как модель будет материализована в ClickHouse. Должно быть `table`, чтобы создать модель таблицы.                                              | Обязательно                          |
| `engine`       | Движок таблицы, который будет использоваться при создании таблиц. См. список поддерживаемых движков ниже.                                       | Необязательно (по умолчанию: `MergeTree()`) |
| `order_by`     | Кортеж имен столбцов или произвольных выражений. Это позволяет создать небольшой разреженный индекс, который помогает быстрее находить данные. | Необязательно (по умолчанию: `tuple()`)     |
| `partition_by` | Разделение — это логическая комбинация записей в таблице по заданному критерию. Ключ разделения может быть любым выражением из столбцов таблицы. | Необязательно                        |

### Инкрементальная материализация

Модель таблицы будет перестраиваться для каждого выполнения dbt. Это может быть непрактично и крайне затратно для больших наборов результатов или сложных преобразований. Чтобы решить эту проблему и сократить время сборки, модель dbt может быть создана как инкрементальная таблица ClickHouse и настроена с использованием следующего синтаксиса:

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

| Опция                   | Описание                                                                                                                                                                                                                                                       | Обязательно?                                                                            |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| `materialized`           | Как модель будет материализована в ClickHouse. Должно быть `table`, чтобы создать модель таблицы.                                                                                                                                                                      | Обязательно                                                                             |
| `unique_key`             | Кортеж имен столбцов, которые уникально идентифицируют строки. Для получения дополнительной информации о ограничениях уникальности смотрите [здесь](/docs/build/incremental-models#defining-a-unique-key-optional).                                                                                       | Обязательно. Если не указано, измененные строки будут добавлены дважды в инкрементальную таблицу. |
| `engine`                 | Движок таблицы, который будет использоваться при создании таблиц. См. список поддерживаемых движков ниже.                                                                                                                                                                                | Необязательно (по умолчанию: `MergeTree()`)                                                    |
| `order_by`               | Кортеж имен столбцов или произвольных выражений. Это позволяет создать небольшой разреженный индекс, который помогает быстрее находить данные.                                                                                                                                     | Необязательно (по умолчанию: `tuple()`)                                                        |
| `partition_by`           | Разделение — это логическая комбинация записей в таблице по заданному критерию. Ключ разделения может быть любым выражением из столбцов таблицы.                                                                                                              | Необязательно                                                                             |
| `inserts_only`           | (Устарело, см. стратегию материализации `append`). Если True, инкрементальные обновления будут вставлены непосредственно в целевую инкрементальную таблицу без создания промежуточной таблицы.                                                                          | Необязательно (по умолчанию: `False`)                                                          |
| `incremental_strategy`   | Стратегия, используемая для инкрементальной материализации. Поддерживаются `delete+insert`, `append` и `insert_overwrite` (экспериментально). Для получения дополнительной информации о стратегиях смотрите [здесь](https://github.com/ClickHouse/dbt-clickhouse#incremental-model-strategies) | Необязательно (по умолчанию: 'default')                                                        |
| `incremental_predicates` | Условие инкрементального предиката, которое будет применено к материализациям `delete+insert`                                                                                                                                                                                    | Необязательно                                                                             |

## Снимок

Снимки dbt позволяют зафиксировать изменения в изменяемой модели с течением времени. Это, в свою очередь, позволяет выполнять запросы на модели в определенный момент времени, когда аналитики могут "ознакомиться с прошлым" с предыдущим состоянием модели. Эта функциональность поддерживается коннектором ClickHouse и настраивается с использованием следующего синтаксиса:

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

Для получения дополнительной информации о конфигурации ознакомьтесь со страницей [конфигурации снимков](/reference/snapshot-configs).

## Поддерживаемые движки таблиц

| Тип                     | Подробности                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------|
| MergeTree (по умолчанию) | https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/mergetree/.         |
| HDFS                   | https://clickhouse.com/docs/en/engines/table-engines/integrations/hdfs                    |
| MaterializedPostgreSQL | https://clickhouse.com/docs/en/engines/table-engines/integrations/materialized-postgresql |
| S3                     | https://clickhouse.com/docs/en/engines/table-engines/integrations/s3                      |
| EmbeddedRocksDB        | https://clickhouse.com/docs/en/engines/table-engines/integrations/embedded-rocksdb        |
| Hive                   | https://clickhouse.com/docs/en/engines/table-engines/integrations/hive                    |

## Экспериментально поддерживаемые движки таблиц

| Тип                  | Подробности                                                                   |
|----------------------|---------------------------------------------------------------------------|
| Распределенная таблица | https://clickhouse.com/docs/en/engines/table-engines/special/distributed. |
| Словарь              | https://clickhouse.com/docs/en/engines/table-engines/special/dictionary   |

Если вы столкнулись с проблемами подключения к ClickHouse из dbt с одним из вышеуказанных движков, пожалуйста, сообщите об этом [здесь](https://github.com/ClickHouse/dbt-clickhouse/issues).

## Поддержка макросов между базами данных

dbt-clickhouse поддерживает большинство макросов между базами данных, теперь включенных в dbt-core, с следующими исключениями:

* SQL-функция `split_part` реализована в ClickHouse с использованием функции splitByChar. Эта функция требует использования постоянной строки для разделителя "split", поэтому параметр `delimeter`, используемый для этого макроса, будет интерпретироваться как строка, а не как имя столбца.
* Аналогично, SQL-функция `replace` в ClickHouse требует постоянных строк для параметров `old_chars` и `new_chars`, поэтому эти параметры будут интерпретироваться как строки, а не как имена столбцов при вызове этого макроса.

## Установка `quote_columns`

Чтобы избежать предупреждения, убедитесь, что вы явно установили значение для `quote_columns` в вашем `dbt_project.yml`. См. [документацию по quote_columns](https://docs.getdbt.com/reference/resource-configs/quote_columns) для получения дополнительной информации.

```yaml
seeds:
  +quote_columns: false  #или `true`, если у вас есть заголовки столбцов csv с пробелами
```