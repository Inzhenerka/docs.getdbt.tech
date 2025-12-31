---
title: "Конфигурации Apache Spark"
id: "spark-configs"
description: "Конфигурации Apache Spark - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
---

<!----
Сделать:
- использовать структуру справочного документа для этой статьи/разделить на отдельные статьи
--->

<Snippet path="dbt-databricks-for-databricks" />

:::note
См. [Конфигурация Databricks](#databricks-configs) для версии этой страницы для Databricks.
:::

## Конфигурация таблиц {#configuring-tables}

При материализации модели как `table`, вы можете включить несколько дополнительных конфигураций, специфичных для плагина dbt-spark, в дополнение к стандартным [конфигурациям модели](/reference/model-configs).

| Option  | Description          | Required?        | <div style={{width:'350px'}}>Example</div>       |
|---------|----------------------|------------------|--------------------------------------------------|
| file_format | Формат файла, который будет использоваться при создании таблиц (`parquet`, `delta`, `iceberg`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` или `libsvm`). | Optional | `parquet`|
| location_root [^1]  | Создаваемая таблица использует указанный каталог для хранения своих данных. К этому пути будет добавлен алиас таблицы. | Optional                | `/mnt/root`              |
| partition_by  | Разбивает создаваемую таблицу на партиции по указанным столбцам. Для каждой партиции создаётся отдельный каталог. | Optional                | `date_day`              |
| clustered_by  | Каждая партиция в создаваемой таблице будет дополнительно разбита на фиксированное количество бакетов по указанным столбцам. | Optional               | `country_code`              |
| buckets  | Количество бакетов, которые будут созданы при кластеризации. | Required if `clustered_by` is specified                | `8`              |
| tblproperties | Свойства таблицы, которые настраивают её поведение. Набор доступных свойств зависит от формата файла, см. справочную документацию ([Iceberg](https://iceberg.apache.org/docs/latest/configuration/#table-properties), [Parquet](https://spark.apache.org/docs/3.5.4/sql-data-sources-parquet.html#data-source-option), [Delta](https://docs.databricks.com/aws/en/delta/table-properties#delta-table-properties), [Hudi](https://hudi.apache.org/docs/sql_ddl/#table-properties)). | Optional |<code># Iceberg Example<br /> tblproperties:<br />   read.split.target-size: 268435456<br />   commit.retry.num-retries: 10</code> |

[^1]: Если вы настраиваете `location_root`, dbt указывает путь размещения в выражении `create table`. Это изменяет тип таблицы с «managed» на «external» в Spark/Databricks.

## Инкрементальные модели {#incremental-models}

dbt стремится предложить полезные, интуитивно понятные абстракции моделирования с помощью встроенных конфигураций и <Term id="materialization">материализаций</Term>. Поскольку существует так много вариаций между кластерами Apache Spark в мире, не говоря уже о мощных функциях, предлагаемых пользователям Databricks форматом файлов Delta и пользовательским временем выполнения, понимание всех доступных опций само по себе является задачей.

В качестве альтернативы, вы можете использовать формат файлов Apache Iceberg или Apache Hudi с временем выполнения Apache Spark для построения инкрементальных моделей.

По этой причине плагин dbt-spark сильно полагается на конфигурацию [`incremental_strategy`](/docs/build/incremental-strategy). Эта конфигурация указывает, как инкрементальная материализация должна строить модели в запусках после первого. Она может быть установлена на одно из трех значений:
 - **`append`** (по умолчанию): Вставка новых записей без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Если указано `partition_by`, перезаписать разделы в <Term id="table" /> новыми данными. Если `partition_by` не указано, перезаписать всю таблицу новыми данными.
 - **`merge`** (только для форматов файлов Delta, Iceberg и Hudi): Сопоставление записей на основе `unique_key`; обновление старых записей, вставка новых. (Если `unique_key` не указан, все новые данные вставляются, аналогично `append`.)
- `microbatch` Реализует [стратегию микропакетов](/docs/build/incremental-microbatch) с использованием `event_time` для определения временных диапазонов для фильтрации данных.

Каждая из этих стратегий имеет свои плюсы и минусы, которые мы обсудим ниже. Как и в случае любой конфигурации модели, `incremental_strategy` может быть указан в `dbt_project.yml` или в блоке `config()` файла модели.

### Стратегия `append` {#the-append-strategy}

Следуя стратегии `append`, dbt выполнит оператор `insert into` со всеми новыми данными. Привлекательность этой стратегии заключается в ее простоте и функциональности на всех платформах, типах файлов, методах подключения и версиях Apache Spark. Однако эта стратегия _не может_ обновлять, перезаписывать или удалять существующие данные, поэтому она, вероятно, будет вставлять дублирующиеся записи для многих источников данных.

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

### Стратегия `insert_overwrite` {#the-insert_overwrite-strategy}

Эта стратегия наиболее эффективна, когда она указана вместе с параметром `partition_by` в конфигурации модели. dbt выполнит [атомарный оператор `insert overwrite`](https://downloads.apache.org/spark/docs/3.0.0/sql-ref-syntax-dml-insert-overwrite-table.html), который динамически заменяет все партиции, попавшие в ваш запрос. При использовании этой инкрементальной стратегии обязательно повторно выбирайте (_re-select_) **все** релевантные данные для каждой партиции.

Если `partition_by` не указано, то стратегия `insert_overwrite` атомарно заменит все содержимое таблицы, перезаписывая все существующие данные только новыми записями. Однако схема столбцов таблицы остается прежней. Это может быть желательным в некоторых ограниченных обстоятельствах, так как это минимизирует время простоя при перезаписи содержимого таблицы. Операция сопоставима с выполнением `truncate` + `insert` в других базах данных. Для атомарной замены таблиц в формате Delta используйте материализацию `table` (которая выполняет `create or replace`) вместо этого.

**Примечания по использованию:**
- Эта стратегия не поддерживается для таблиц с `file_format: delta`.
- Эта стратегия недоступна при подключении через SQL-эндпоинты Databricks (`method: odbc` + `endpoint`).
- Если вы подключаетесь через кластер Databricks + драйвер ODBC (`method: odbc` + `cluster`), вы **должны** включить `set spark.sql.sources.partitionOverwriteMode DYNAMIC` в [конфигурации Spark кластера](https://docs.databricks.com/clusters/configure.html#spark-config), чтобы динамическая замена разделов работала (`incremental_strategy: insert_overwrite` + `partition_by`).

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
    file_format='parquet',
    incremental_strategy='insert_overwrite'
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

### Стратегия `merge` {#the-merge-strategy}

**Примечания по использованию:** Инкрементальная стратегия `merge` требует:
- `file_format: delta, iceberg или hudi`
- Databricks Runtime 5.1 и выше для формата файлов delta
- Apache Spark для формата файлов Iceberg или Hudi

dbt выполнит [атомарный оператор `merge`](https://docs.databricks.com/spark/latest/spark-sql/language-manual/merge-into.html), который выглядит почти идентично поведению слияния по умолчанию в Snowflake и BigQuery. Если указан `unique_key` (рекомендуется), dbt обновит старые записи значениями из новых записей, которые совпадают по ключевому столбцу. Если `unique_key` не указан, dbt откажется от критериев совпадения и просто вставит все новые записи (аналогично стратегии `append`).

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

## Сохранение описаний моделей {#persisting-model-descriptions}

В dbt поддерживается сохранение документации на уровне relation.  
Подробнее о настройке сохранения документации см. [документацию](/reference/resource-configs/persist_docs).

Когда опция `persist_docs` настроена должным образом, вы сможете
увидеть описания моделей в поле `Comment` команды `describe [table] extended`
или `show table extended in [database] like '*'`.

## Всегда `schema`, никогда `database` {#always-schema-never-database}

Apache Spark использует термины "schema" и "database" взаимозаменяемо. dbt понимает
`database` как существующий на более высоком уровне, чем `schema`. Таким образом, вы _никогда_
не должны использовать или устанавливать `database` в качестве конфигурации узла или в целевом профиле при запуске dbt-spark.

Если вы хотите управлять схемой/базой данных, в которой dbt будет материализовать модели,
используйте конфигурацию `schema` и макрос `generate_schema_name` _только_.

## Конфигурации формата файлов по умолчанию {#default-file-format-configurations}

Чтобы получить доступ к расширенным функциям инкрементальных стратегий, таким как 
[снимки](/docs/build/snapshots) и инкрементальная стратегия `merge`, вы захотите
использовать формат файлов Delta, Iceberg или Hudi в качестве формата файлов по умолчанию при материализации моделей как таблиц.

Это довольно удобно сделать, установив конфигурацию верхнего уровня в вашем
файле проекта:

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

<VersionBlock firstVersion="1.11">

## Обработка повторных попыток для подключений PyHive {#retry-handling-for-pyhive-connections}

При использовании методов подключения HTTP или Thrift вы можете настроить, как dbt обрабатывает опрос состояния, тайм-ауты и повторные попытки подключения для длительно выполняющихся запросов. Эти настройки помогают предотвратить зависание запросов на неопределённое время и автоматически восстанавливаться после разрывов соединения во время выполнения запроса.

Доступны три конфигурации профиля:

| Parameter	| Type	| Default |	Description |
|-----------|-------|---------|-------------|
| `poll_interval` | Integer |	5 |	Как часто (в секундах) адаптер опрашивает Thrift-сервер, чтобы проверить, завершился ли асинхронный запрос. |
| `query_timeout`	| Integer |	None | Максимальная продолжительность выполнения запроса (в секундах). Если во время опроса запрос превышает это значение, dbt выбрасывает `DbtRuntimeError`. По умолчанию тайм-аут не задан. |
| `query_retries` | Integer |	1 |	Сколько раз адаптер повторяет попытку при потере соединения во время выполнения запроса. |

Адаптер перехватывает определённые исключения соединения (такие как `ConnectionResetError`, `BrokenPipeError` и `TTransportException`) и выполняет повторную попытку с новым курсором при потере соединения. После исчерпания всех попыток dbt выбрасывает `DbtRuntimeError` и предлагает увеличить значение `query_retries` в вашем профиле.

</VersionBlock>
