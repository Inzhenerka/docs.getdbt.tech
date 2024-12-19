---
title: "Конфигурации Apache Spark"
id: "spark-configs"
description: "Конфигурации Apache Spark - Прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
---

<!----
To-do:
- используйте структуру справочной документации для этой статьи/разделите на отдельные статьи
--->

<Snippet path="dbt-databricks-for-databricks" />

:::note
Смотрите [конфигурацию Databricks](#databricks-configs) для версии этой страницы для Databricks.
:::

## Конфигурирование таблиц

При материализации модели как `table` вы можете включить несколько дополнительных конфигураций, специфичных для плагина dbt-spark, помимо стандартных [конфигураций модели](/reference/model-configs).

| Опция  | Описание                                                                                                                        | Обязательно?               | Пример                  |
|--------|---------------------------------------------------------------------------------------------------------------------------------|----------------------------|--------------------------|
| file_format | Формат файла, который будет использоваться при создании таблиц (`parquet`, `delta`, `iceberg`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` или `libsvm`). | Необязательно | `parquet`|
| location_root  | Созданная таблица использует указанную директорию для хранения своих данных. К ней добавляется псевдоним таблицы.                               | Необязательно                | `/mnt/root`              |
| partition_by  | Разделите созданную таблицу по указанным столбцам. Для каждого раздела создается директория.                                   | Необязательно                | `date_day`              |
| clustered_by  | Каждый раздел в созданной таблице будет разделен на фиксированное количество бакетов по указанным столбцам.                         | Необязательно               | `country_code`              |
| buckets  | Количество бакетов, которые нужно создать при кластеризации                                                                                   | Обязательно, если указано `clustered_by`                | `8`              |

## Инкрементальные модели

dbt стремится предложить полезные, интуитивно понятные абстракции моделирования с помощью своих встроенных конфигураций и <Term id="materialization">материализаций</Term>. Поскольку существует так много вариаций между кластерами Apache Spark в мире — не говоря уже о мощных функциях, предлагаемых пользователям Databricks форматом Delta и пользовательским временем выполнения — разобраться во всех доступных опциях является отдельной задачей.

В качестве альтернативы вы можете использовать формат файлов Apache Iceberg или Apache Hudi с временем выполнения Apache Spark для создания инкрементальных моделей.

По этой причине плагин dbt-spark сильно полагается на конфигурацию [`incremental_strategy`](/docs/build/incremental-strategy). Эта конфигурация указывает инкрементальной материализации, как строить модели в запусках после первого. Она может быть установлена в одно из трех значений:
 - **`append`** (по умолчанию): Вставить новые записи без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Если указано `partition_by`, перезаписать разделы в <Term id="table" /> новыми данными. Если `partition_by` не указано, перезаписать всю таблицу новыми данными.
 - **`merge`** (только для форматов файлов Delta, Iceberg и Hudi): Сопоставить записи на основе `unique_key`; обновить старые записи, вставить новые. (Если `unique_key` не указан, все новые данные вставляются, аналогично стратегии `append`.)
- `microbatch` Реализует [стратегию микропакетов](/docs/build/incremental-microbatch), используя `event_time` для определения временных диапазонов для фильтрации данных.

Каждая из этих стратегий имеет свои плюсы и минусы, которые мы обсудим ниже. Как и в случае с любой конфигурацией модели, `incremental_strategy` может быть указана в `dbt_project.yml` или в блоке `config()` файла модели.

### Стратегия `append`

Следуя стратегии `append`, dbt выполнит оператор `insert into` со всеми новыми данными. Привлекательность этой стратегии заключается в том, что она проста и функциональна на всех платформах, типах файлов, методах подключения и версиях Apache Spark. Однако эта стратегия _не может_ обновлять, перезаписывать или удалять существующие данные, поэтому она, вероятно, вставит дублирующиеся записи для многих источников данных.

Указание `append` в качестве инкрементальной стратегии является необязательным, так как это стратегия по умолчанию, используемая, когда ничего не указано.

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
    incremental_strategy='append',
) }}

--  Все строки, возвращаемые этим запросом, будут добавлены к существующей таблице

select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```
</File>
</TabItem>
<TabItem value="run">

<File name='spark_incremental.sql'>

```sql
create temporary view spark_incremental__dbt_tmp as

    select * from analytics.events

    where event_ts >= (select max(event_ts) from {{ this }})

;

insert into table analytics.spark_incremental
    select `date_day`, `users` from spark_incremental__dbt_tmp
```

</File>
</TabItem>
</Tabs>

### Стратегия `insert_overwrite`

Эта стратегия наиболее эффективна, когда указана вместе с условием `partition_by` в конфигурации вашей модели. dbt выполнит [атомарный оператор `insert overwrite`](https://spark.apache.org/docs/3.0.0-preview/sql-ref-syntax-dml-insert-overwrite-table.html), который динамически заменяет все разделы, включенные в ваш запрос. Обязательно повторно выберите _все_ соответствующие данные для раздела при использовании этой инкрементальной стратегии.

Если `partition_by` не указано, то стратегия `insert_overwrite` атомарно заменит все содержимое таблицы, перезаписывая все существующие данные только новыми записями. Однако схема столбцов таблицы остается прежней. Это может быть желаемо в некоторых ограниченных обстоятельствах, поскольку это минимизирует время простоя во время перезаписи содержимого таблицы. Операция сопоставима с выполнением `truncate` + `insert` в других базах данных. Для атомарной замены таблиц в формате Delta используйте материализацию `table` (которая выполняет `create or replace`) вместо этого.

**Примечания по использованию:**
- Эта стратегия не поддерживается для таблиц с `file_format: delta`.
- Эта стратегия недоступна при подключении через конечные точки Databricks SQL (`method: odbc` + `endpoint`).
- Если подключение осуществляется через кластер Databricks + драйвер ODBC (`method: odbc` + `cluster`), вы **должны** включить `set spark.sql.sources.partitionOverwriteMode DYNAMIC` в [конфигурацию Spark кластера](https://docs.databricks.com/clusters/configure.html#spark-config), чтобы динамическая замена разделов работала (`incremental_strategy: insert_overwrite` + `partition_by`).

<Lightbox src="/img/reference/databricks-cluster-sparkconfig-partition-overwrite.png" title="Кластер Databricks: Конфигурация Spark" />

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
  Каждый раздел, возвращаемый этим запросом, будет перезаписан
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
create temporary view spark_incremental__dbt_tmp as

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
```

</File>
</TabItem>
</Tabs>

### Стратегия `merge`

**Примечания по использованию:** Стратегия инкрементирования `merge` требует:
- `file_format: delta, iceberg или hudi`
- Databricks Runtime 5.1 и выше для формата файла delta
- Apache Spark для форматов файлов Iceberg или Hudi

dbt выполнит [атомарный оператор `merge`](https://docs.databricks.com/spark/latest/spark-sql/language-manual/merge-into.html), который выглядит почти идентично поведению по умолчанию для слияния в Snowflake и BigQuery. Если указан `unique_key` (рекомендуется), dbt обновит старые записи значениями из новых записей, которые совпадают по ключевому столбцу. Если `unique_key` не указан, dbt не будет учитывать критерии совпадения и просто вставит все новые записи (аналогично стратегии `append`).

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='merge_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta', # или 'iceberg' или 'hudi'
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

Поддержка сохранения документации на уровне отношений доступна в dbt v0.17.0. Для получения дополнительной информации о конфигурации сохранения документации смотрите [документацию](/reference/resource-configs/persist_docs).

Когда опция `persist_docs` настроена должным образом, вы сможете видеть описания моделей в поле `Comment` команды `describe [table] extended` или `show table extended in [database] like '*'`.

## Всегда `schema`, никогда `database`

Apache Spark использует термины "schema" и "database" взаимозаменяемо. dbt понимает, что `database` существует на более высоком уровне, чем `schema`. Таким образом, вы _никогда_ не должны использовать или устанавливать `database` в качестве конфигурации узла или в целевом профиле при запуске dbt-spark.

Если вы хотите контролировать схему/базу данных, в которой dbt будет материализовать модели, используйте конфигурацию `schema` и макрос `generate_schema_name` _только_.

## Конфигурации формата файла по умолчанию

Чтобы получить доступ к функциям расширенных инкрементальных стратегий, таким как 
[снимки](/docs/build/snapshots) и инкрементальная стратегия `merge`, вы захотите использовать формат файлов Delta, Iceberg или Hudi в качестве формата файла по умолчанию при материализации моделей как таблиц.

Это довольно удобно сделать, установив конфигурацию верхнего уровня в вашем файле проекта:

<File name='dbt_project.yml'>

```yml
models:
  +file_format: delta # или iceberg или hudi
  
seeds:
  +file_format: delta # или iceberg или hudi
  
snapshots:
  +file_format: delta # или iceberg или hudi
```

</File>