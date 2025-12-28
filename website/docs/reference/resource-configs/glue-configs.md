---
title: "Конфигурации AWS Glue"
description: "Конфигурации AWS Glue - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "glue-configs"
---

<!----
Список дел:
- использовать структуру справочного документа для этой статьи/разделить на отдельные статьи
--->

## Конфигурация таблиц

При материализации модели как `table`, вы можете включить несколько дополнительных конфигураций, специфичных для плагина dbt-glue, в дополнение к [конфигурации модели Apache Spark](/reference/resource-configs/spark-configs#configuring-tables).

| Опция  | Описание                                        | Обязательно?               | Пример                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| custom_location  | По умолчанию адаптер будет сохранять ваши данные в следующем пути: `location path`/`database`/`table`. Если вы не хотите следовать этому поведению по умолчанию, вы можете использовать этот параметр для установки собственного местоположения на S3 | Нет | `s3://mycustombucket/mycustompath`              |

## Инкрементальные модели

dbt стремится предложить полезные, интуитивно понятные абстракции моделирования с помощью встроенных конфигураций и материализаций.

По этой причине плагин dbt-glue сильно опирается на [конфигурацию `incremental_strategy`](/docs/build/incremental-strategy). Эта конфигурация указывает, как инкрементальная материализация должна строить модели в запусках, следующих за первым. Она может быть установлена на одно из трех значений:
 - **`append`** (по умолчанию): Вставка новых записей без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Если указано `partition_by`, перезаписывает разделы в таблице новыми данными. Если `partition_by` не указано, перезаписывает всю таблицу новыми данными.
 - **`merge`** (только Apache Hudi): Сопоставляет записи на основе `unique_key`; обновляет старые записи, вставляет новые. (Если `unique_key` не указан, все новые данные вставляются, аналогично `append`.)

Каждая из этих стратегий имеет свои плюсы и минусы, которые мы обсудим ниже. Как и в любой конфигурации модели, `incremental_strategy` может быть указана в `dbt_project.yml` или в блоке `config()` файла модели.

**Примечания:**
Стратегия по умолчанию — **`insert_overwrite`**

### Стратегия `append`

Следуя стратегии `append`, dbt выполнит оператор `insert into` со всеми новыми данными. Привлекательность этой стратегии заключается в ее простоте и функциональности на всех платформах, типах файлов, методах подключения и версиях Apache Spark. Однако эта стратегия _не может_ обновлять, перезаписывать или удалять существующие данные, поэтому она, вероятно, будет вставлять дублирующиеся записи для многих источников данных.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='glue_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='append',
) }}

--  Все строки, возвращенные этим запросом, будут добавлены в существующую таблицу

select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```
</File>
</TabItem>
<TabItem value="run">

<File name='glue_incremental.sql'>

```sql
create view spark_incremental__dbt_tmp as

    select * from analytics.events

    where event_ts >= (select max(event_ts) from {{ this }})

;

insert into table analytics.spark_incremental
    select `date_day`, `users` from spark_incremental__dbt_tmp
```

;

drop view spark_incremental__dbt_tmp

</File>
</TabItem>
</Tabs>

### Стратегия `insert_overwrite`

Эта стратегия наиболее эффективна, когда указана вместе с клаузой `partition_by` в конфигурации вашей модели. dbt выполнит [атомарный оператор `insert overwrite`](https://spark.apache.org/docs/3.1.2/sql-ref-syntax-dml-insert-overwrite-table.html), который динамически заменяет все разделы, включенные в ваш запрос. Убедитесь, что вы повторно выбираете _все_ соответствующие данные для раздела при использовании этой инкрементальной стратегии.

Если `partition_by` не указано, то стратегия `insert_overwrite` атомарно заменит все содержимое таблицы, перезаписывая все существующие данные только новыми записями. Однако схема столбцов таблицы остается прежней. Это может быть желательным в некоторых ограниченных обстоятельствах, поскольку это минимизирует время простоя при перезаписи содержимого таблицы. Операция сопоставима с выполнением `truncate` + `insert` в других базах данных. Для атомарной замены таблиц в формате Delta используйте материализацию `table` (которая выполняет `create or replace`).

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='spark_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    partition_by=['date_day'],
    file_format='parquet'
) }}

/*
  Каждый раздел, возвращенный этим запросом, будет перезаписан
  при выполнении этой модели
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

<File name='spark_incremental.sql'>

```sql
create view spark_incremental__dbt_tmp as

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

insert overwrite table analytics.spark_incremental
    partition (date_day)
    select `date_day`, `users` from spark_incremental__dbt_tmp

;

drop view spark_incremental__dbt_tmp
```

</File>
</TabItem>
</Tabs>

Указание `insert_overwrite` в качестве инкрементальной стратегии является необязательным, так как это стратегия по умолчанию, используемая, когда ничего не указано.

### Стратегия `merge`

**Примечания по использованию:** Инкрементальная стратегия `merge` требует:
- `file_format: hudi`
- AWS Glue runtime 2 с библиотеками hudi в качестве дополнительных jar-файлов

Вы можете добавить библиотеки hudi в качестве дополнительных jar-файлов в classpath, используя опции extra_jars в вашем profiles.yml.
Вот пример:
```yml
extra_jars: "s3://dbt-glue-hudi/Dependencies/hudi-spark.jar,s3://dbt-glue-hudi/Dependencies/spark-avro_2.11-2.4.4.jar"
```

dbt выполнит [атомарный оператор `merge`](https://hudi.apache.org/docs/writing_data#spark-datasource-writer), который выглядит почти идентично поведению слияния по умолчанию в Snowflake и BigQuery. Если указан `unique_key` (рекомендуется), dbt обновит старые записи значениями из новых записей, которые совпадают по ключевому столбцу. Если `unique_key` не указан, dbt откажется от критериев совпадения и просто вставит все новые записи (аналогично стратегии `append`).

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
  ]
}>
<TabItem value="source">

<File name='hudi_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='merge',
    unique_key='user_id',
    file_format='hudi'
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
</Tabs>

## Сохранение описаний моделей

Сохранение документации на уровне отношений наследуется от dbt-spark, для получения более подробной информации, ознакомьтесь с [конфигурацией модели Apache Spark](/reference/resource-configs/spark-configs#persisting-model-descriptions).

## Всегда `schema`, никогда `database`

Этот раздел также наследуется от dbt-spark, для получения более подробной информации, ознакомьтесь с [конфигурацией модели Apache Spark](/reference/resource-configs/spark-configs#always-schema-never-database).
