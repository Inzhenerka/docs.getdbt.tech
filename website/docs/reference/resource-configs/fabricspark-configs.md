---
title: "Конфигурации Microsoft Fabric Spark"
id: "fabricspark-configs"
description: "Конфигурации Microsoft Fabric Spark — прочитайте этот подробный гайд, чтобы узнать о конфигурациях в dbt."
---

## Конфигурация таблиц

При материализации модели как `table` вы можете указать несколько необязательных конфигураций, специфичных для плагина dbt-spark, в дополнение к стандартным [настройкам моделей](/reference/model-configs).

| Option  | Description          | Required?        | <div style={{width:'350px'}}>Example</div>       |
|---------|----------------------|------------------|--------------------------------------------------|
| file_format | Формат файла, который будет использоваться при создании таблиц (`parquet`, `delta`, `csv`). | Optional | `delta`|
| location_root [^1]  | Указанный каталог, используемый для хранения данных таблицы. К нему добавляется алиас таблицы. | Optional | `Files/<folder>` or `Tables/<tableName>` |
| partition_by  | Разбиение таблицы по указанным колонкам. Для каждого раздела создаётся отдельный каталог. | Optional | `date_day` |
| clustered_by  | Каждый раздел таблицы будет разбит на фиксированное количество бакетов по указанным колонкам. | Optional | `country_code` |
| buckets  | Количество бакетов, создаваемых при кластеризации. | Required if `clustered_by` is specified | `8` |
| tblproperties | Свойства таблицы, которые настраивают её поведение. Набор свойств зависит от формата файла, см. справочную документацию ([Parquet](https://spark.apache.org/docs/3.5.4/sql-data-sources-parquet.html#data-source-option), [Delta](https://docs.delta.io/latest/table-properties.html)). | Optional |<code>Provider=delta Location=abfss://.../Files/tables/sales_data TableProperty.created.by=data_engineering_team TableProperty.purpose=sales analytics CreatedBy=Delta Lake CreatedAt=2024-12-01 14:21:00 Format=Parquet PartitionColumns=region MinReaderVersion=1 MinWriterVersion=2</code> |

[^1]: Если вы настраиваете `location_root`, dbt указывает путь расположения в операторе `create table`. Это переводит таблицу из состояния «managed» в «external» в Fabric Lakehouse.

## Инкрементальные модели

dbt стремится предоставлять удобные и интуитивно понятные абстракции моделирования с помощью встроенных конфигураций и <Term id="materialization">материализаций</Term>. Поскольку в мире существует большое разнообразие Spark‑кластеров — не говоря уже о мощных возможностях, доступных пользователям open source благодаря формату Delta и кастомным runtime, — разобраться во всех доступных опциях само по себе является нетривиальной задачей.

По этой причине плагин dbt-fabricspark в значительной степени опирается на конфигурацию [`incremental_strategy`](/docs/build/incremental-strategy). Эта настройка указывает инкрементальной материализации, как собирать модели при запусках после первого. Она может принимать одно из следующих значений:
 - **`append`** (по умолчанию): вставлять новые записи без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: если указано `partition_by`, перезаписывать разделы в <Term id="table" /> новыми данными. Если `partition_by` не указано, перезаписывать всю таблицу новыми данными.
 - **`merge`** (только формат Delta): сопоставлять записи по `unique_key`, обновлять старые записи и вставлять новые. (Если `unique_key` не указан, все новые данные будут вставлены, аналогично стратегии `append`.)
 - **`microbatch`**: реализует [стратегию microbatch](/docs/build/incremental-microbatch), используя `event_time` для определения временных диапазонов фильтрации данных.

У каждой из этих стратегий есть свои плюсы и минусы, которые мы рассмотрим ниже. Как и любую другую конфигурацию модели, `incremental_strategy` можно указывать в `dbt_project.yml` или внутри блока `config()` в файле модели.

### Стратегия `append`

При использовании стратегии `append` dbt выполняет оператор `insert into` со всеми новыми данными. Привлекательность этой стратегии заключается в её простоте и работоспособности на всех платформах, типах файлов, способах подключения и версиях Fabric Spark. Однако эта стратегия _не может_ обновлять, перезаписывать или удалять существующие данные, поэтому для многих источников данных она, скорее всего, будет приводить к вставке дубликатов.

Указывать `append` в качестве инкрементальной стратегии необязательно, так как это стратегия по умолчанию, если явно ничего не задано.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='fabricspark_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='append',
) }}

--  All rows returned by this query will be appended to the existing table

select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```
</File>
</TabItem>
<TabItem value="run">

<File name='fabricspark_incremental.sql'>

```sql
create temporary view fabricspark_incremental__dbt_tmp as

    select * from analytics.events

    where event_ts >= (select max(event_ts) from {{ this }})

;

insert into table analytics.fabricspark_incremental
    select `date_day`, `users` from spark_incremental__dbt_tmp
```

</File>
</TabItem>
</Tabs>

### Стратегия `insert_overwrite`

Эта стратегия наиболее эффективна при использовании совместно с параметром `partition_by` в конфигурации модели. dbt выполнит [атомарный оператор `insert overwrite`](https://spark.apache.org/docs/3.0.0-preview/sql-ref-syntax-dml-insert-overwrite-table.html), который динамически заменяет все разделы, затронутые запросом. При использовании этой инкрементальной стратегии обязательно повторно выбирайте _все_ релевантные данные для каждого раздела.

Если `partition_by` не указан, стратегия `insert_overwrite` атомарно заменит всё содержимое таблицы, перезаписав все существующие данные только новыми записями. При этом схема колонок таблицы остаётся неизменной. В некоторых ограниченных случаях это может быть желаемым поведением, так как минимизирует простой во время перезаписи содержимого таблицы. Такая операция сопоставима с выполнением `truncate` + `insert` в других базах данных. Для атомарной замены таблиц в формате Delta вместо этого используйте материализацию `table` (которая выполняет `create or replace`).

**Примечания по использованию:**
- Эта стратегия не поддерживается для таблиц с `file_format: delta`.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='fabricspark_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    partition_by=['date_day'],
    file_format='parquet'
) }}

/*
  Every partition returned by this query will be overwritten
  when this model runs
*/

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    date_day,
    count(*) as users

from events
group by 1
```

</File>
</TabItem>
<TabItem value="run">

<File name='fabricspark_incremental.sql'>

```sql
create temporary view fabricspark_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events


        where date_day >= date_add(current_date, -1)


    )

    select
        date_day,
        count(*) as users

    from events
    group by 1

;

insert overwrite table analytics.fabricspark_incremental
    partition (date_day)
    select `date_day`, `users` from spark_incremental__dbt_tmp
```

</File>
</TabItem>
</Tabs>

### Стратегия `merge`

**Примечания по использованию:** инкрементальная стратегия `merge` требует:
- `file_format: delta`
- Fabric Spark Runtime версии 3.0 и выше для формата Delta

dbt выполнит атомарный оператор `merge`, который по своему виду и поведению практически идентичен стандартному `merge` в Fabric Warehouse, SQL‑базах данных, Snowflake и BigQuery. Если указан `unique_key` (рекомендуется), dbt будет обновлять старые записи значениями из новых записей, совпадающих по ключу. Если `unique_key` не указан, dbt не будет использовать условия сопоставления и просто вставит все новые записи (аналогично стратегии `append`).

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
]
}>
<TabItem value="source">

<File name='merge_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta',
    unique_key='user_id',
    incremental_strategy='merge'
) }}

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    user_id,
    max(date_day) as last_seen

from events
group by 1
```

</File>
</TabItem>
<TabItem value="run">

<File name='target/run/merge_incremental.sql'>

```sql
create temporary view merge_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events


        where date_day >= date_add(current_date, -1)


    )

    select
        user_id,
        max(date_day) as last_seen

    from events
    group by 1

;

merge into analytics.merge_incremental as DBT_INTERNAL_DEST
    using merge_incremental__dbt_tmp as DBT_INTERNAL_SOURCE
    on DBT_INTERNAL_SOURCE.user_id = DBT_INTERNAL_DEST.user_id
    when matched then update set *
    when not matched then insert *
```

</File>

</TabItem>
</Tabs>

## Сохранение описаний моделей

dbt поддерживает сохранение документации на уровне отношений. Подробнее
о настройке сохранения документации см. [документацию](/reference/resource-configs/persist_docs).

При корректной настройке параметра `persist_docs` вы сможете
видеть описания моделей в поле `Comment` результатов команд
`describe [table] extended` или `show table extended in [database] like '*'`.

## Всегда `schema`, никогда `database`

Fabric Spark использует термины «schema» и «database» как взаимозаменяемые. dbt же понимает
`database` как уровень, находящийся выше `schema`. Поэтому при использовании dbt-fabricspark
вам _никогда_ не следует использовать или задавать `database` ни в конфигурации узлов, ни в целевом профиле. 
Привыкайте: адаптер не поддерживает схемы внутри Lakehouse.

## Конфигурации формата файлов по умолчанию

Чтобы получить доступ к расширенным возможностям инкрементальных стратегий, таким как
[snapshots](/docs/build/snapshots) и инкрементальная стратегия `merge`, рекомендуется
использовать формат Delta в качестве формата файлов по умолчанию при материализации моделей в таблицы.

Это удобно сделать, задав конфигурацию верхнего уровня в файле проекта:

<File name='dbt_project.yml'>

```yml
models:
  +file_format: delta
  
seeds:
  +file_format: delta
  
snapshots:
  +file_format: delta
```

</File>
