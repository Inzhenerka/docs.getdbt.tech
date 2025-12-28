---
title: "Конфигурации BigQuery"
description: "Справочное руководство по конфигурациям BigQuery в dbt."
id: "bigquery-configs"
tags: ['BigQuery', 'dbt Fusion', 'dbt Core']
---

<!----
To-do:
- use the reference doc structure for this article/split into separate articles
--->

## Использование `project` и `dataset` в конфигурациях

- `schema` взаимозаменяемо с понятием BigQuery `dataset`
- `database` взаимозаменяемо с понятием BigQuery `project`

В справочной документации вы можете указывать `project` вместо `database`.
Это позволяет читать и записывать данные в несколько проектов BigQuery. Аналогично — для `dataset`.

## Использование партиционирования и кластеризации таблиц

### Clause партиционирования

BigQuery поддерживает использование clause [`partition by`](https://cloud.google.com/bigquery/docs/data-definition-language#specifying_table_partitioning_options), который позволяет легко партиционировать <Term id="table" /> по колонке или выражению. Это помогает снизить задержки и стоимость запросов к большим таблицам. Обратите внимание, что отсечение партиций (partition pruning) [работает](https://cloud.google.com/bigquery/docs/querying-partitioned-tables#use_a_constant_filter_expression) только в том случае, если партиции фильтруются по литеральным значениям (то есть выбор партиций с использованием <Term id="subquery" /> не улучшит производительность).

Конфигурация `partition_by` задаётся в виде словаря со следующим форматом:

```python
{
  "field": "<field name>",
  "data_type": "<timestamp | date | datetime | int64>",
  "granularity": "<hour | day | month | year>"

  # Only required if data_type is "int64"
  "range": {
    "start": <int>,
    "end": <int>,
    "interval": <int>
  }
}
```

#### Партиционирование по дате или timestamp

При использовании колонок типа `datetime` или `timestamp` для партиционирования данных можно создавать партиции с гранулярностью час, день, месяц или год. Колонка типа `date` поддерживает гранулярность день, месяц и год. Ежедневное партиционирование является значением по умолчанию для всех типов колонок.

Если `data_type` указан как `date` и гранулярность — `day`, dbt передаст поле без изменений при настройке партиционирования таблицы.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Compiled code', value: 'compiled', },
  ]
}>
<TabItem value="source">

<File name='bigquery_table.sql'>

```sql
{{ config(
    materialized='table',
    partition_by={
      "field": "created_at",
      "data_type": "timestamp",
      "granularity": "day"
    }
)}}

select
  user_id,
  event_name,
  created_at

from {{ ref('events') }}
```

</File>

</TabItem>
<TabItem value="compiled">

<File name='bigquery_table.sql'>

```sql
create table `projectname`.`analytics`.`bigquery_table`
partition by timestamp_trunc(created_at, day)
as (

  select
    user_id,
    event_name,
    created_at

  from `analytics`.`events`

)
```

</File>

</TabItem>
</Tabs>

#### Партиционирование по дате или timestamp загрузки (ingestion)

BigQuery поддерживает [более старый механизм партиционирования](https://cloud.google.com/bigquery/docs/partitioned-tables#ingestion_time), основанный на времени загрузки каждой строки. Хотя мы рекомендуем по возможности использовать более новый и удобный способ партиционирования, для очень больших датасетов этот старый, более механистичный подход может давать прирост производительности. [Подробнее про инкрементальную стратегию `insert_overwrite` см. ниже](#copying-ingestion-time-partitions).

dbt всегда указывает BigQuery партиционировать таблицу по значениям колонки, заданной в `partition_by.field`. Если в конфигурации модели установить `partition_by.time_ingestion_partitioning` в `True`, dbt будет использовать эту колонку как входные данные для псевдоколонки `_PARTITIONTIME`. В отличие от нового партиционирования по колонкам, в этом случае вы должны самостоятельно обеспечить, чтобы значения в колонке партиционирования точно соответствовали временной гранулярности партиций.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Compiled code', value: 'compiled', },
  ]
}>
<TabItem value="source">

<File name='bigquery_table.sql'>

```sql
{{ config(
    materialized="incremental",
    partition_by={
      "field": "created_date",
      "data_type": "timestamp",
      "granularity": "day",
      "time_ingestion_partitioning": true
    }
) }}

select
  user_id,
  event_name,
  created_at,
  -- values of this column must match the data type + granularity defined above
  timestamp_trunc(created_at, day) as created_date

from {{ ref('events') }}
```

</File>

</TabItem>
<TabItem value="compiled">

<File name='bigquery_table.sql'>

```sql
create table `projectname`.`analytics`.`bigquery_table` (`user_id` INT64, `event_name` STRING, `created_at` TIMESTAMP)
partition by timestamp_trunc(_PARTITIONTIME, day);

insert into `projectname`.`analytics`.`bigquery_table` (_partitiontime, `user_id`, `event_name`, `created_at`)
select created_date as _partitiontime, * EXCEPT(created_date) from (
    select
      user_id,
      event_name,
      created_at,
      -- values of this column must match granularity defined above
      timestamp_trunc(created_at, day) as created_date

    from `projectname`.`analytics`.`events`
);
```

</File>

</TabItem>
</Tabs>

#### Партиционирование с использованием целочисленных диапазонов

Если `data_type` указан как `int64`, необходимо также указать ключ `range` в словаре `partition_by`. dbt использует значения из `range` для генерации clause партиционирования таблицы.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Compiled code', value: 'compiled', },
  ]
}>
<TabItem value="source">

<File name='bigquery_table.sql'>

```sql
{{ config(
    materialized='table',
    partition_by={
      "field": "user_id",
      "data_type": "int64",
      "range": {
        "start": 0,
        "end": 100,
        "interval": 10
      }
    }
)}}

select
  user_id,
  event_name,
  created_at

from {{ ref('events') }}
```

</File>

</TabItem>
<TabItem value="compiled">

<File name='bigquery_table.sql'>

```sql
create table analytics.bigquery_table
partition by range_bucket(
  user_id,
  generate_array(0, 100, 10)
)
as (

  select
    user_id,
    event_name,
    created_at

  from analytics.events

)
```

</File>

</TabItem>
</Tabs>

#### Дополнительные настройки партиционирования

Если для модели настроен `partition_by`, вы можете дополнительно указать две опциональные конфигурации:

- `require_partition_filter` (boolean): если установлено в `true`, любой запрос к этой модели _обязан_ указывать фильтр по партиции, иначе запрос завершится с ошибкой. Рекомендуется для очень больших таблиц с очевидной схемой партиционирования, например потоков событий, сгруппированных по дням. Обратите внимание, что это также повлияет на другие модели или тесты dbt, которые выбирают данные из этой модели.

- `partition_expiration_days` (integer): если задано для партиций типа date или timestamp, партиция истекает через указанное количество дней после представляемой ею даты. Например, партиция для `2021-01-01` с истечением через 7 дней перестанет быть доступной для запросов с `2021-01-08`, её стоимость хранения будет обнулена, а содержимое со временем будет удалено. Обратите внимание, что если указано [истечение таблицы](#controlling-table-expiration), оно будет иметь приоритет.

<File name='bigquery_table.sql'>

```sql
{{ config(
    materialized = 'table',
    partition_by = {
      "field": "created_at",
      "data_type": "timestamp",
      "granularity": "day"
    },
    require_partition_filter = true,
    partition_expiration_days = 7
)}}

```

</File>

### Clause кластеризации

Таблицы BigQuery могут быть [кластеризованы](https://cloud.google.com/bigquery/docs/clustered-tables) для совместного размещения связанных данных.

Кластеризация по одной колонке:

<File name='bigquery_table.sql'>

```sql
{{
  config(
    materialized = "table",
    cluster_by = "order_id",
  )
}}

select * from ...
```

</File>

Кластеризация по нескольким колонкам:

<File name='bigquery_table.sql'>

```sql
{{
  config(
    materialized = "table",
    cluster_by = ["customer_id", "order_id"],
  )
}}

select * from ...
```

</File>

## Управление шифрованием KMS

[Ключи шифрования, управляемые клиентом](https://cloud.google.com/bigquery/docs/customer-managed-encryption), могут быть настроены для таблиц BigQuery с помощью конфигурации модели `kms_key_name`.

### Использование шифрования KMS

Чтобы указать имя KMS-ключа для модели (или группы моделей), используйте конфигурацию `kms_key_name`. В следующем примере `kms_key_name` задаётся для всех моделей в директории `encrypted/` вашего проекта dbt.

<File name='dbt_project.yml'>

```yaml

name: my_project
version: 1.0.0

...

models:
  my_project:
    encrypted:
      +kms_key_name: 'projects/PROJECT_ID/locations/global/keyRings/test/cryptoKeys/quickstart'
```

</File>

## Метки и теги

### Указание labels

dbt поддерживает задание labels BigQuery для таблиц и <Term id="view">представлений</Term>, которые он создаёт. Эти labels можно задать с помощью конфигурации модели `labels`.

Конфигурация `labels` может быть указана как в файле модели, так и в `dbt_project.yml`, как показано ниже.

Записи key-value BigQuery для labels длиной более 63 символов усекаются.

**Настройка labels в файле модели**

<File name='model.sql'>

```sql
{{
  config(
    materialized = "table",
    labels = {'contains_pii': 'yes', 'contains_pie': 'no'}
  )
}}

select * from {{ ref('another_model') }}
```

</File>

**Настройка labels в dbt_project.yml**

<File name='dbt_project.yml'>

```yaml

models:
  my_project:
    snowplow:
      +labels:
        domain: clickstream
    finance:
      +labels:
        domain: finance
```

</File>

<Lightbox src="/img/docs/building-a-dbt-project/building-models/73eaa8a-Screen_Shot_2020-01-20_at_12.12.54_PM.png" title="Просмотр labels в консоли BigQuery"/>

### Применение labels к заданиям (jobs)

Хотя конфигурация `labels` применяет labels к таблицам и представлениям, создаваемым dbt, вы также можете применять labels к _заданиям_ BigQuery, которые запускает dbt. Labels заданий полезны для отслеживания стоимости запросов, мониторинга производительности заданий и организации истории заданий BigQuery по метаданным dbt.

По умолчанию labels не применяются напрямую к заданиям. Однако вы можете включить маркировку заданий через комментарии к запросам, выполнив следующие шаги:

#### Шаг 1
Определите макрос `query_comment`, чтобы добавлять labels к вашим запросам через комментарий запроса:

```sql
-- macros/query_comment.sql
{% macro query_comment(node) %}
    {%- set comment_dict = {} -%}
    {%- do comment_dict.update(
        app='dbt',
        dbt_version=dbt_version,
        profile_name=target.get('profile_name'),
        target_name=target.get('target_name'),
    ) -%}
    {%- if node is not none -%}
      {%- do comment_dict.update(node.config.get("labels", {})) -%}
    {% else %}
      {%- do comment_dict.update(node_id='internal') -%}
    {%- endif -%}
    {% do return(tojson(comment_dict)) %}
{% endmacro %}
```

Этот макрос создаёт JSON-комментарий с метаданными dbt (приложение, версия, профиль, target) и объединяет их с labels, настроенными для конкретной модели.

#### Шаг 2
Включите маркировку заданий в `dbt_project.yml`, установив `comment: "{{ query_comment(node) }}"` и `job-label: true` в конфигурации `query-comment`:

```yaml
# dbt_project.yml
name: analytics
profile: bq
version: "1.0.0"

models:
  analytics:
    +materialized: table

query-comment:
  comment: "{{ query_comment(node) }}"
  job-label: true
```

Когда эта настройка включена, BigQuery будет разбирать JSON-комментарий и применять пары ключ-значение как labels к каждому заданию. После этого вы сможете фильтровать и анализировать задания в консоли BigQuery или через представление INFORMATION_SCHEMA.JOBS, используя эти labels.

### Указание tags

*Теги* таблиц и представлений BigQuery можно создавать, передав пустую строку в качестве значения label.

<File name='model.sql'>

```sql
{{
  config(
    materialized = "table",
    labels = {'contains_pii': ''}
  )
}}

select * from {{ ref('another_model') }}
```

</File>

Вы можете создать новый label без значения или удалить значение у существующего ключа label.

Label с ключом и пустым значением также может называться [tag](https://cloud.google.com/bigquery/docs/adding-labels#adding_a_label_without_a_value) в BigQuery. Однако это отличается от [BigQuery tag](https://cloud.google.com/bigquery/docs/tags), который используется для условного применения IAM-политик к таблицам и датасетам BigQuery. Подробнее см. в документации [Tags](https://cloud.google.com/resource-manager/docs/tags/tags-overview).

### Resource tags

[BigQuery tags](https://cloud.google.com/bigquery/docs/tags) позволяют реализовать условный IAM-контроль доступа для таблиц и представлений BigQuery. Вы можете применять эти BigQuery tags с помощью конфигурации `resource_tags`. В этом разделе приведены рекомендации по использованию параметра конфигурации `resource_tags`.

Resource tags — это пары ключ-значение, которые должны соответствовать формату тегов BigQuery: `{google_cloud_project_id}/{key_name}: value`. В отличие от labels, BigQuery tags в первую очередь предназначены для управления доступом с помощью условных IAM-политик, позволяя организациям:

- **Реализовывать условный контроль доступа**: применять IAM-политики на основе BigQuery tags (например, предоставлять доступ только к таблицам с тегом `environment:production`).
- **Обеспечивать управление данными**: использовать BigQuery tags вместе с IAM-политиками для защиты чувствительных данных.
- **Масштабно управлять доступом**: единообразно управлять паттернами доступа в разных проектах и окружениях.

#### Предварительные требования
- Заранее [создайте ключи и значения тегов](https://cloud.google.com/bigquery/docs/tags#create_tag_keys_and_values) перед их использованием в dbt.
- Предоставьте [необходимые IAM-права](https://cloud.google.com/bigquery/docs/tags#required_permissions) для применения тегов к ресурсам.

#### Настройка тегов в файле модели

<File name='model.sql'>

```sql
{{
  config(
    materialized = "table",
    resource_tags = {
      "my-project-id/environment": "production",
      "my-project-id/data_classification": "sensitive",
      "my-project-id/access_level": "restricted"
    }
  )
}}

select * from {{ ref('another_model') }}
```

</File>

#### Настройка тегов в `dbt_project.yml`

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    production:
      +resource_tags:
        my-project-id/environment: production
        my-project-id/data_classification: sensitive
    staging:
      +resource_tags:
        my-project-id/environment: staging
        my-project-id/data_classification: internal
```

</File>

#### Использование одновременно dbt tags и BigQuery tags

Вы можете использовать стандартную конфигурацию `tags` в dbt вместе с `resource_tags` BigQuery:

<File name='model.sql'>

```sql
{{
  config(
    materialized = "materialized_view",
    tags = ["reporting", "daily"],  # dbt tags for internal organization
    resource_tags = {  # BigQuery tags for IAM access control
      "my-project-id/environment": "production",
      "my-project-id/data_classification": "sensitive"
    }
  )
}}

select * from {{ ref('my_table') }}
```

</File>

Для получения дополнительной информации о настройке условных IAM-политик с использованием BigQuery tags см. документацию BigQuery по [tags](https://cloud.google.com/bigquery/docs/tags).

### Policy tags

BigQuery поддерживает [безопасность на уровне колонок](https://cloud.google.com/bigquery/docs/column-level-security-intro) с помощью задания [policy tags](https://cloud.google.com/bigquery/docs/best-practices-policy-tags) для отдельных колонок.

dbt поддерживает эту возможность как свойство ресурса колонки — `policy_tags` (_не_ конфигурация ноды).

<File name='models/<filename>.yml'>

```yaml

models:
- name: policy_tag_table
  columns:
    - name: field
      policy_tags:
        - 'projects/<gcp-project>/locations/<location>/taxonomies/<taxonomy>/policyTags/<tag>'
```

</File>

Обратите внимание, что для того, чтобы policy tags начали действовать, необходимо включить [column-level `persist_docs`](/reference/resource-configs/persist_docs) для модели, сида или снапшота. Рассмотрите использование [variables](/docs/build/project-variables) для управления таксономиями и убедитесь, что вашему сервисному аккаунту BigQuery назначены необходимые [роли](https://cloud.google.com/bigquery/docs/column-level-security-intro#roles).

## Поведение merge (инкрементальные модели)

Конфигурация [`incremental_strategy`](/docs/build/incremental-strategy) определяет, как dbt строит инкрементальные модели. В BigQuery dbt использует оператор [`merge`](https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax) для обновления инкрементальных таблиц.

Параметр `incremental_strategy` может принимать следующие значения:
- `merge` (по умолчанию)
- `insert_overwrite`
- [`microbatch`](/docs/build/incremental-microbatch)

### Производительность и стоимость

Операции, которые dbt выполняет при построении инкрементальной модели BigQuery, можно сделать быстрее и дешевле, используя [clustering clause](#clustering-clause) в конфигурации модели. Подробнее о настройке производительности инкрементальных моделей BigQuery см. в [этом руководстве](https://discourse.getdbt.com/t/benchmarking-incremental-strategies-on-bigquery/981).

**Примечание:** эти преимущества по производительности и стоимости применимы к инкрементальным моделям, построенным как со стратегией `merge`, так и с `insert_overwrite`.

### Стратегия `merge`

Инкрементальная стратегия `merge` генерирует оператор `merge`, который выглядит примерно так:

```merge
merge into {{ destination_table }} DEST
using ({{ model_sql }}) SRC
on SRC.{{ unique_key }} = DEST.{{ unique_key }}

when matched then update ...
when not matched then insert ...
```

Подход с использованием `merge` автоматически обновляет данные в целевой инкрементальной таблице, но требует сканирования всех исходных таблиц, используемых в SQL модели, а также целевой таблицы. Это может быть медленно и дорого для больших объёмов данных. Упомянутые ранее техники [партиционирования и кластеризации](#using-table-partitioning-and-clustering) помогают смягчить эти проблемы.

**Примечание:** конфигурация `unique_key` обязательна при выборе инкрементальной стратегии `merge`.

### Стратегия `insert_overwrite`

Стратегия `insert_overwrite` генерирует оператор `merge`, который заменяет целые партиции в целевой таблице. **Примечание:** эта конфигурация требует, чтобы модель была настроена с помощью [Partition clause](#partition-clause). Оператор `merge`, который генерирует dbt при выборе стратегии `insert_overwrite`, выглядит примерно так:

```sql
/*
  Create a temporary table from the model SQL
*/
create temporary table {{ model_name }}__dbt_tmp as (
  {{ model_sql }}
);

/*
  If applicable, determine the partitions to overwrite by
  querying the temp table.
*/

declare dbt_partitions_for_replacement array<date>;
set (dbt_partitions_for_replacement) = (
    select as struct
        array_agg(distinct date(max_tstamp))
    from `my_project`.`my_dataset`.{{ model_name }}__dbt_tmp
);

/*
  Overwrite partitions in the destination table which match
  the partitions in the temporary table
*/
merge into {{ destination_table }} DEST
using {{ model_name }}__dbt_tmp SRC
on FALSE

when not matched by source and {{ partition_column }} in unnest(dbt_partitions_for_replacement)
then delete

when not matched then insert ...
```

Подробное описание механики этого подхода см. в
[этом разъясняющем посте](https://discourse.getdbt.com/t/bigquery-dbt-incremental-changes/982).

#### Определение партиций для перезаписи

dbt может определять партиции для перезаписи динамически — на основе значений во временной таблице, либо статически — на основе конфигурации, заданной пользователем.

«Динамический» подход является самым простым (и используется по умолчанию), однако «статический» подход снижает стоимость за счёт устранения нескольких запросов в скрипте сборки модели.

#### Статические партиции

Чтобы задать статический список партиций для перезаписи, используйте конфигурацию `partitions`.

<File name="models/session.sql">

```sql
{% set partitions_to_replace = [
  'timestamp(current_date)',
  'timestamp(date_sub(current_date, interval 1 day))'
] %}

{{
  config(
    materialized = 'incremental',
    incremental_strategy = 'insert_overwrite',
    partition_by = {'field': 'session_start', 'data_type': 'timestamp'},
    partitions = partitions_to_replace
  )
}}

with events as (

    select * from {{ref('events')}}

    {% if is_incremental() %}
        -- recalculate yesterday + today
        where timestamp_trunc(event_timestamp, day) in ({{ partitions_to_replace | join(',') }})
    {% endif %}

),

... rest of model ...
```

</File>

Этот пример модели ежедневно заменяет данные в целевой таблице за _сегодня_ и _вчера_. Это самый быстрый и дешёвый способ инкрементально обновлять таблицу с помощью dbt. Если требуется более динамичное поведение — например, всегда за последние 3 дня — можно использовать встроенные [datetime macros](https://github.com/dbt-labs/dbt-core/blob/dev/octavius-catto/core/dbt/include/global_project/macros/etc/datetime.sql) dbt и написать несколько собственных.

Это можно рассматривать как режим «полного контроля». Вы должны убедиться, что выражения или литеральные значения в конфигурации `partitions` корректно экранируются при шаблонизации и соответствуют `partition_by.data_type` (`timestamp`, `datetime`, `date` или `int64`). В противном случае фильтр в инкрементальном операторе `merge` вызовет ошибку.

#### Динамические партиции

Если конфигурация `partitions` не указана, dbt выполнит следующие шаги:

1. Создаст временную таблицу для SQL модели
2. Выполнит запрос к временной таблице, чтобы определить уникальные партиции для перезаписи
3. Выполнит запрос к целевой таблице, чтобы найти _максимальную_ партицию в базе данных

При написании SQL модели вы можете использовать интроспекцию, выполняемую dbt, чтобы фильтровать только _новые_ данные. Максимальное значение в поле партиционирования целевой таблицы будет доступно через переменную BigQuery scripting `_dbt_max_partition`. **Примечание:** это SQL-переменная BigQuery, а не Jinja-переменная dbt, поэтому для доступа к ней не требуются Jinja-скобки.

**Пример SQL модели:**

```sql
{{
  config(
    materialized = 'incremental',
    partition_by = {'field': 'session_start', 'data_type': 'timestamp'},
    incremental_strategy = 'insert_overwrite'
  )
}}

with events as (

  select * from {{ref('events')}}

  {% if is_incremental() %}

    -- recalculate latest day's data + previous
    -- NOTE: The _dbt_max_partition variable is used to introspect the destination table
    where date(event_timestamp) >= date_sub(date(_dbt_max_partition), interval 1 day)

{% endif %}

),

... rest of model ...
```

#### Копирование партиций

Если при инкрементальных запусках вы заменяете целые партиции, вы можете использовать [Copy Table API](https://cloud.google.com/bigquery/docs/managing-tables#copy-table) и декораторы партиций вместо оператора `merge`. Хотя этот механизм не даёт такой же прозрачности и удобства отладки, как SQL `merge`, он может значительно сократить время и стоимость для больших датасетов, поскольку Copy Table API не взимает плату за вставку данных — это эквивалент команды `bq cp` в CLI gcloud.

Для этого включите `copy_partitions: True` в конфигурации `partition_by`. Этот подход работает только в сочетании с «динамической» заменой партиций.

<File name='bigquery_table.sql'>

```sql
{{ config(
    materialized="incremental",
    incremental_strategy="insert_overwrite",
    partition_by={
      "field": "created_date",
      "data_type": "timestamp",
      "granularity": "day",
      "time_ingestion_partitioning": true,
      "copy_partitions": true
    }
) }}

select
  user_id,
  event_name,
  created_at,
  -- values of this column must match the data type + granularity defined above
  timestamp_trunc(created_at, day) as created_date

from {{ ref('events') }}
```

</File>

<File name='logs/dbt.log'>

```
...
[0m16:03:13.017641 [debug] [Thread-3 (]: BigQuery adapter: Copying table(s) "/projects/projectname/datasets/analytics/tables/bigquery_table__dbt_tmp$20230112" to "/projects/projectname/datasets/analytics/tables/bigquery_table$20230112" with disposition: "WRITE_TRUNCATE"
...
```

</File>

## Управление сроком хранения таблиц

По умолчанию таблицы, создаваемые dbt, не имеют срока истечения. Вы можете настроить истечение срока хранения для отдельных моделей, указав `hours_to_expiration`.

:::info Note
Параметр `hours_to_expiration` применяется только при первоначальном создании таблицы. Для инкрементальных моделей он не сбрасывается при последующих запусках.
:::

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +hours_to_expiration: 6

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
    hours_to_expiration = 6
) }}

select ...

```

</File>

## Авторизованные представления (Authorized views)

Если для модели, материализованной как представление (view), указан конфиг `grant_access_to`,
dbt предоставит этому представлению доступ на `SELECT` к списку датасетов, которые вы указали.
Подробнее см. [документацию BigQuery об авторизованных представлениях](https://cloud.google.com/bigquery/docs/share-access-views).

<Snippet path="grants-vs-access-to" />

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +grant_access_to:
      - project: project_1
        dataset: dataset_1
      - project: project_2
        dataset: dataset_2
```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
    grant_access_to=[
      {'project': 'project_1', 'dataset': 'dataset_1'},
      {'project': 'project_2', 'dataset': 'dataset_2'}
    ]
) }}
```

</File>

Представления с такой конфигурацией смогут выполнять `SELECT` из объектов в `project_1.dataset_1` и `project_2.dataset_2`, даже если сами они расположены в другом месте и запрашиваются пользователями, которые в обычном случае не имеют доступа к `project_1.dataset_1` и `project_2.dataset_2`.

## Материализованные представления (Materialized views)

Адаптер BigQuery поддерживает [материализованные представления](https://cloud.google.com/bigquery/docs/materialized-views-intro)
со следующими параметрами конфигурации:

| Параметр                                                                          | Тип                    | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|-----------------------------------------------------------------------------------|------------------------|--------------|--------------|---------------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change)  | `<string>`             | нет          | `apply`      | n/a                             |
| [`cluster_by`](#clustering-clause)                                                 | `[<string>]`           | нет          | `none`       | drop/create                    |
| [`partition_by`](#partition-clause)                                                | `{<dictionary>}`       | нет          | `none`       | drop/create                    |
| [`enable_refresh`](#auto-refresh)                                                  | `<boolean>`            | нет          | `true`       | alter                          |
| [`refresh_interval_minutes`](#auto-refresh)                                       | `<float>`              | нет          | `30`         | alter                          |
| [`max_staleness`](#auto-refresh) (в Preview)                                      | `<interval>`           | нет          | `none`       | alter                          |
| [`description`](/reference/resource-properties/description)                        | `<string>`             | нет          | `none`       | alter                          |
| [`labels`](#specifying-labels)                                                     | `{<string>: <string>}` | нет          | `none`       | alter                          |
| [`resource_tags`](#resource-tags)                                                  | `{<string>: <string>}` | нет          | `none`       | alter                          |
| [`hours_to_expiration`](#controlling-table-expiration)                             | `<integer>`            | нет          | `none`       | alter                          |
| [`kms_key_name`](#using-kms-encryption)                                            | `<string>`             | нет          | `none`       | alter                          |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'SQL file config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): materialized_view
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[cluster_by](#clustering-clause): <field-name> | [<field-name>]
    [+](/reference/resource-configs/plus-prefix)[partition_by](#partition-clause):
      - field: <field-name>
      - data_type: timestamp | date | datetime | int64
        # только если `data_type` не 'int64'
      - granularity: hour | day | month | year
        # только если `data_type` — 'int64'
      - range:
        - start: <integer>
        - end: <integer>
        - interval: <integer>
    [+](/reference/resource-configs/plus-prefix)[enable_refresh](#auto-refresh): true | false
    [+](/reference/resource-configs/plus-prefix)[refresh_interval_minutes](#auto-refresh): <float>
    [+](/reference/resource-configs/plus-prefix)[max_staleness](#auto-refresh): <interval>
    [+](/reference/resource-configs/plus-prefix)[description](/reference/resource-properties/description): <string>
    [+](/reference/resource-configs/plus-prefix)[labels](#specifying-labels): {<label-name>: <label-value>}
    [+](/reference/resource-configs/plus-prefix)[resource_tags](#resource-tags): {<tag-key>: <tag-value>}
    [+](/reference/resource-configs/plus-prefix)[hours_to_expiration](#acontrolling-table-expiration): <integer>
    [+](/reference/resource-configs/plus-prefix)[kms_key_name](##using-kms-encryption): <path-to-key>
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): materialized_view
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [cluster_by](#clustering-clause): <field-name> | [<field-name>]
      [partition_by](#partition-clause):
        - field: <field-name>
        - data_type: timestamp | date | datetime | int64
          # только если `data_type` не 'int64'
        - granularity: hour | day | month | year
          # только если `data_type` — 'int64'
        - range:
          - start: <integer>
          - end: <integer>
          - interval: <integer>
      [enable_refresh](#auto-refresh): true | false
      [refresh_interval_minutes](#auto-refresh): <float>
      [max_staleness](#auto-refresh): <interval>
      [description](/reference/resource-properties/description): <string>
      [labels](#specifying-labels): {<label-name>: <label-value>}
      [resource_tags](#resource-tags): {<tag-key>: <tag-value>}
      [hours_to_expiration](#acontrolling-table-expiration): <integer>
      [kms_key_name](##using-kms-encryption): <path-to-key>
```

</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)='materialized_view',
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [cluster_by](#clustering-clause)="<field-name>" | ["<field-name>"],
    [partition_by](#partition-clause)={
        "field": "<field-name>",
        "data_type": "timestamp" | "date" | "datetime" | "int64",

        # только если `data_type` не 'int64'
        "granularity": "hour" | "day" | "month" | "year,

        # только если `data_type` — 'int64'
        "range": {
            "start": <integer>,
            "end": <integer>,
            "interval": <integer>,
        }
    },

    # параметры автообновления
    [enable_refresh](#auto-refresh)= true | false,
    [refresh_interval_minutes](#auto-refresh)=<float>,
    [max_staleness](#auto-refresh)="<interval>",

    # дополнительные параметры
    [description](/reference/resource-properties/description)="<description>",
    [labels](#specifying-labels)={
        "<label-name>": "<label-value>",
    },
    [resource_tags](#resource-tags)={
        "<tag-key>": "<tag-value>",
    },
    [hours_to_expiration](#acontrolling-table-expiration)=<integer>,
    [kms_key_name](##using-kms-encryption)="<path_to_key>",
) }}
```

</File>

</TabItem>

</Tabs>

Многие из этих параметров соответствуют аналогичным параметрам таблиц и были связаны выше.
Набор параметров, уникальных для материализованных представлений, охватывает [функциональность автообновления](#auto-refresh).

Подробнее об этих параметрах см. в документации BigQuery:
- [Оператор CREATE MATERIALIZED VIEW](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#create_materialized_view_statement)
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)

### Автообновление (Auto-refresh)

| Параметр                     | Тип          | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|------------------------------|--------------|--------------|--------------|---------------------------------|
| `enable_refresh`             | `<boolean>`  | нет          | `true`       | alter                           |
| `refresh_interval_minutes`   | `<float>`    | нет          | `30`         | alter                           |
| `max_staleness` (в Preview)  | `<interval>` | нет          | `none`       | alter                           |

BigQuery поддерживает настройку [автоматического обновления](https://cloud.google.com/bigquery/docs/materialized-views-manage#automatic_refresh) для материализованных представлений.
По умолчанию материализованное представление автоматически обновляется в течение 5 минут после изменений в базовой таблице, но не чаще одного раза в 30 минут.
BigQuery официально поддерживает только настройку частоты обновления (то самое «раз в 30 минут»);
однако существует функция в режиме preview, которая позволяет настраивать допустимую устарелость данных (те самые «5 минут»).
dbt отслеживает изменения этих параметров и применяет их с помощью оператора `ALTER`.

Подробнее об этих параметрах см. в документации BigQuery:
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)
- [max_staleness](https://cloud.google.com/bigquery/docs/materialized-views-create#max_staleness)

### Ограничения

Как и у большинства платформ для работы с данными, у материализованных представлений есть ограничения. Среди наиболее важных:

- SQL для материализованных представлений имеет [ограниченный набор возможностей](https://cloud.google.com/bigquery/docs/materialized-views-create#supported-mvs).
- SQL материализованного представления нельзя обновлять; для этого требуется `--full-refresh` (DROP/CREATE).
- Параметр `partition_by` у материализованного представления должен совпадать с параметром базовой таблицы.
- Хотя материализованные представления могут иметь описание, *колонки* материализованных представлений — нет.
- Пересоздание или удаление базовой таблицы требует пересоздания или удаления материализованного представления.

Больше информации об ограничениях материализованных представлений см. в [документации BigQuery](https://cloud.google.com/bigquery/docs/materialized-views-intro#limitations).

## Конфигурация Python-моделей

**Способы выполнения (Submission methods):**  
BigQuery поддерживает несколько механизмов выполнения Python-кода, каждый со своими преимуществами. Адаптер `dbt-bigquery` использует BigQuery DataFrames (BigFrames) или Dataproc. В рамках этого процесса данные считываются из BigQuery, вычисления выполняются либо нативно с помощью BigQuery DataFrames, либо в Dataproc, а результаты записываются обратно в BigQuery.

<Tabs
  defaultValue="dataframes"
  values={[
    { label: 'BigQuery DataFrames', value: 'dataframes', },
    { label: 'Dataproc', value: 'dataproc', },
  ]
}>
<TabItem value="dataframes">

BigQuery DataFrames позволяют выполнять код pandas и scikit-learn. Нет необходимости управлять инфраструктурой, при этом используются распределённые движки запросов BigQuery. Это отличный вариант для аналитиков, data scientist’ов и ML-инженеров, которые хотят работать с большими данными в pandas-подобном синтаксисе.

**Примечание:** BigQuery DataFrames запускаются в стандартном runtime Google Colab. Если runtime-шаблон с именем `default` недоступен, адаптер автоматически создаст его и пометит как `default` для дальнейшего использования (при наличии необходимых прав).

**Настройка BigQuery DataFrames:**

```bash
# IAM permission if using service account

#Create Service Account
gcloud iam service-accounts create dbt-bigframes-sa
#Grant BigQuery User Role
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.user
#Grant BigQuery Data Editor role. This can be restricted at dataset level
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.dataEditor
#Grant Service Account user 
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/iam.serviceAccountUser
#Grant Colab Entperprise User
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/aiplatform.colabEnterpriseUser
```

<File name='dbt_project.yml'>

```yaml
models:
  my_dbt_project:
    submission_method: bigframes
```

</File>

<File name='profiles.yml'>

```yaml
my_dbt_project_sa:
  outputs:
    dev:
      compute_region: us-central1
      dataset: <BIGQUERY_DATESET>
      gcs_bucket: <GCS BUCKET USED FOR BIGFRAME LOGS>
      job_execution_timeout_seconds: 300
      job_retries: 1
      keyfile: <SERVICE ACCOUNT KEY FILE>
      location: US
      method: service-account
      priority: interactive
      project: <BIGQUERY_PROJECT>
      threads: 1
      type: bigquery
  target: dev
```

</File>

</TabItem>

<TabItem value="dataproc">

Dataproc (`serverless` или заранее настроенный `cluster`) позволяет выполнять Python-модели как задания PySpark, читая данные из BigQuery и записывая результаты обратно в BigQuery.  
`serverless` проще в использовании, но медленнее и имеет ограниченные возможности конфигурации и предустановленные пакеты (`pandas`, `numpy`, `scikit-learn`), тогда как `cluster` даёт полный контроль и более высокую производительность. Dataproc хорошо подходит для сложных, длительных batch-пайплайнов и легаси Hadoop/Spark-нагрузок, но часто уступает для ad-hoc или интерактивных сценариев.

**Настройка Dataproc:**
- Создайте или используйте существующий [Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets).
- Включите API Dataproc для вашего проекта и региона.
- При использовании способа `cluster`: создайте или используйте существующий [Dataproc cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster) с [инициализационным действием для Spark BigQuery connector](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/connectors#bigquery-connectors). (Google рекомендует скопировать action в собственный Cloud Storage bucket, а не использовать пример из скриншота.)

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-connector-initialization.png" title="Добавление Spark BigQuery connector в качестве initialization action"/>

Для запуска Python-моделей на Dataproc необходимы следующие настройки. Их можно добавить в [BigQuery profile](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc) или задать на уровне конкретных Python-моделей:
- `gcs_bucket`: бакет, в который dbt будет загружать скомпилированный PySpark-код модели.
- `dataproc_region`: регион GCP, в котором включён Dataproc (например, `us-central1`).
- `dataproc_cluster_name`: имя Dataproc-кластера для выполнения Python-модели (PySpark job). Требуется только при `submission_method: cluster`.

```python
def model(dbt, session):
    dbt.config(
        submission_method="cluster",
        dataproc_cluster_name="my-favorite-cluster"
    )
    ...
```
```yml
models:
  - name: my_python_model
    config:
      submission_method: serverless
```

Python-модели, работающие на Dataproc Serverless, могут быть дополнительно настроены в вашем [BigQuery profile](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc).

Любой пользователь или сервисный аккаунт, запускающий dbt Python-модели, должен иметь следующие разрешения (в дополнение к обязательным правам BigQuery):
```
dataproc.batches.create
dataproc.clusters.use
dataproc.jobs.create
dataproc.jobs.get
dataproc.operations.get
dataproc.operations.list
storage.buckets.get
storage.objects.create
storage.objects.delete
```
Подробнее см. [IAM-роли и разрешения Dataproc](https://cloud.google.com/dataproc/docs/concepts/iam/iam).

**Установка пакетов:** 

Установка сторонних пакетов в Dataproc зависит от того, используется ли [cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster) или [serverless](https://cloud.google.com/dataproc-serverless/docs).

- **Dataproc Cluster** — Google рекомендует устанавливать Python-пакеты при создании кластера с помощью initialization actions:  
    - [Как используются initialization actions](https://github.com/GoogleCloudDataproc/initialization-actions/blob/master/README.md#how-initialization-actions-are-used)  
    - [Actions для установки через `pip` или `conda`](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/python)

    Также можно устанавливать пакеты при создании кластера, [задавая свойства кластера](https://cloud.google.com/dataproc/docs/tutorials/python-configuration#image_version_20): `dataproc:pip.packages` или `dataproc:conda.packages`.

- **Dataproc Serverless** — Google рекомендует использовать [кастомный Docker-образ](https://cloud.google.com/dataproc-serverless/docs/guides/custom-containers) для установки сторонних пакетов. Образ должен храниться в [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs). Затем его можно указать в профиле dbt:

    <File name='profiles.yml'>
    ```yml
    my-profile:
        target: dev
        outputs:
            dev:
            type: bigquery
            method: oauth
            project: abc-123
            dataset: my_dataset
            
            # для dbt Python-моделей, выполняемых в Dataproc Serverless
            gcs_bucket: dbt-python
            dataproc_region: us-central1
            submission_method: serverless
            dataproc_batch:
                runtime_config:
                    container_image: {HOSTNAME}/{PROJECT_ID}/{IMAGE}:{TAG}
    ```
    </File>

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-pip-packages.png" title="Добавление пакетов для установки через pip при запуске кластера"/>

</TabItem>
</Tabs>

### Дополнительные параметры

Python-модели BigQuery также поддерживают следующие дополнительные параметры конфигурации:

| Параметр                | Тип          | Обязательный | По умолчанию | Допустимые значения            |
| :---------------------- | :----------- | :----------- | :----------- | :----------------------------- |
| `enable_list_inference` | `<boolean>`  | нет          | `True`       | `True`, `False`                |
| `intermediate_format`   | `<string>`   | нет          | `parquet`    | `parquet`, `orc`               |
| `submission_method`     | `<string>`   | нет          | ``           | `serverless`, `bigframes`, `cluster` |
| `notebook_template_id`  | `<Integer>`  | нет          | ``           | `<NOTEBOOK RUNTIME TEMPLATE_ID>` |
| `compute_region`        | `<string>`   | нет          | ``           | `<COMPUTE_REGION>`             |
| `gcs_bucket`            | `<string>`   | нет          | ``           | `<GCS_BUCKET>`                 |
| `packages`              | `<string>`   | нет          | ``           | `['numpy<=1.1.1', 'pandas', 'mlflow']` |
| `enable_change_history` | `<boolean>`  | нет          | ``           | `True`, `False`                |

- Параметр `enable_list_inference`
  - Включает возможность PySpark DataFrame считывать несколько записей за одну операцию. По умолчанию установлен в `True`, чтобы поддерживать формат `intermediate_format` по умолчанию — `parquet`.

- Параметр `intermediate_format`
  - Определяет формат файлов, используемый при записи данных в таблицу. По умолчанию используется `parquet`.

- Параметр `submission_method`
  - Определяет, будет ли задание выполняться в BigQuery DataFrames или в Serverless Spark. Не требуется, если указан `dataproc_cluster_name`.

- Параметр `notebook_template_id`
  - Задаёт runtime-шаблон в Colab Enterprise.

- Параметр `compute_region`
  - Указывает регион выполнения задания.

- Параметр `gcs_bucket`
  - Указывает GCS-бакет, используемый для хранения артефактов задания.

- Параметр `enable_change_history`
  - Включает [функцию истории изменений BigQuery](https://cloud.google.com/bigquery/docs/change-history), которая отслеживает изменения, внесённые в таблицу BigQuery. При включении вы можете использовать историю изменений для аудита и отладки поведения инкрементальных моделей.

**Связанные документы:**

- [Обзор Dataproc](https://cloud.google.com/dataproc/docs/concepts/overview)
- [Создание Dataproc-кластера](https://cloud.google.com/dataproc/docs/guides/create-cluster)
- [Создание Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets)
- [Синтаксис PySpark DataFrame](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)

## Ограничения unit-тестов

При написании [unit-тестов](/docs/build/unit-tests) вы должны указывать **все** поля в BigQuery `STRUCT`. Использовать только подмножество полей в `STRUCT` нельзя.
