---
title: "Конфигурации BigQuery"
description: "Справочное руководство по конфигурациям BigQuery в dbt."
id: "bigquery-configs"
tags: ['BigQuery', 'dbt Fusion', 'dbt Core']
---

<!----
Список дел:
- использовать структуру reference-доков для этой статьи / разбить на отдельные статьи
--->

## Использование `project` и `dataset` в конфигурациях

- `schema` является взаимозаменяемым с понятием BigQuery `dataset`
- `database` является взаимозаменяемым с понятием BigQuery `project`

В справочной документации вы можете объявлять `project` вместо `database`.
Это позволит читать и записывать данные из нескольких BigQuery‑проектов. То же самое относится и к `dataset`.

## Использование партиционирования и кластеризации таблиц

### Предложение PARTITION

BigQuery поддерживает использование выражения [partition by](https://cloud.google.com/bigquery/docs/data-definition-language#specifying_table_partitioning_options), которое позволяет легко партиционировать <Term id="table" /> по колонке или выражению. Эта опция помогает снизить задержки и стоимость при запросах к большим таблицам. Обратите внимание, что отсечение партиций (partition pruning) [работает только](https://cloud.google.com/bigquery/docs/querying-partitioned-tables#use_a_constant_filter_expression) в том случае, если фильтрация партиций выполняется с использованием литеральных значений (то есть выбор партиций через <Term id="subquery" /> не улучшит производительность).

Конфигурация `partition_by` может быть задана в виде словаря следующего формата:

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

При использовании колонки типа `datetime` или `timestamp` для партиционирования данных вы можете создавать партиции с гранулярностью час, день, месяц или год. Колонка типа `date` поддерживает гранулярность день, месяц и год. Ежедневное партиционирование является значением по умолчанию для всех типов колонок.

Если `data_type` указан как `date`, а гранулярность — `day`, dbt будет передавать поле без изменений
при настройке партиционирования таблицы.

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

BigQuery поддерживает [более старый механизм партиционирования](https://cloud.google.com/bigquery/docs/partitioned-tables#ingestion_time), основанный на времени загрузки каждой строки. Хотя мы рекомендуем по возможности использовать более новый и удобный подход к партиционированию, для очень больших наборов данных этот более механистичный подход может дать некоторые улучшения производительности. Подробнее см. [описание инкрементальной стратегии `insert_overwrite` ниже](#copying-ingestion-time-partitions).

dbt всегда инструктирует BigQuery партиционировать таблицу по значениям колонки, указанной в `partition_by.field`. Если в конфигурации модели указать `partition_by.time_ingestion_partitioning` равным `True`, dbt будет использовать эту колонку как вход для псевдоколонки `_PARTITIONTIME`. В отличие от более нового партиционирования по колонке, в этом случае вы должны убедиться, что значения в колонке партиционирования точно соответствуют временной гранулярности ваших партиций.

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

Если `data_type` указан как `int64`, необходимо также указать ключ `range`
в словаре `partition_by`. dbt использует значения, указанные в `range`,
для генерации выражения партиционирования таблицы.

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

Если для вашей модели настроен `partition_by`, вы можете дополнительно указать две конфигурации:

- `require_partition_filter` (boolean): если установлено в `true`, любой запрос к этой модели _обязан_ указывать фильтр по партиции, иначе запрос завершится ошибкой. Это рекомендуется для очень больших таблиц с очевидной схемой партиционирования, например потоков событий, сгруппированных по дням. Обратите внимание, что это также повлияет на другие модели или тесты dbt, которые пытаются выбирать данные из этой модели.

- `partition_expiration_days` (integer): если задано для партиций типа date или timestamp, партиция истечёт через указанное количество дней после даты, которую она представляет. Например, партиция для `2021-01-01` с истечением через 7 дней перестанет быть доступной для запросов с `2021-01-08`, стоимость её хранения станет нулевой, а содержимое со временем будет удалено. Обратите внимание, что если указано [истечение всей таблицы](#controlling-table-expiration), оно будет иметь приоритет.

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

### Предложение CLUSTERING

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

### Использование KMS‑шифрования

Чтобы указать имя KMS‑ключа для модели (или группы моделей), используйте конфигурацию модели `kms_key_name`. В следующем примере `kms_key_name` задаётся для всех моделей в директории `encrypted/` вашего dbt‑проекта.

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

## Labels и tags

### Задание labels

dbt поддерживает задание labels BigQuery для таблиц и <Term id="view">представлений</Term>, которые он создаёт. Эти labels можно указать с помощью конфигурации модели `labels`.

Конфигурация `labels` может быть задана в конфигурации модели или в файле `dbt_project.yml`, как показано ниже.

  Пары ключ‑значение BigQuery для labels длиной более 63 символов обрезаются.

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

Хотя конфигурация `labels` применяет labels к таблицам и представлениям, создаваемым dbt, вы также можете применять labels к BigQuery‑_заданиям_, которые выполняет dbt. Labels заданий полезны для отслеживания стоимости запросов, мониторинга производительности заданий и организации истории заданий BigQuery по метаданным dbt.

По умолчанию labels не применяются напрямую к заданиям. Однако вы можете включить маркировку заданий через комментарии к запросам, выполнив следующие шаги:

#### Шаг 1
Определите макрос `query_comment`, чтобы добавлять labels в ваши запросы через комментарий:

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

Этот макрос создаёт JSON‑комментарий, содержащий метаданные dbt (приложение, версия, профиль, target) и объединяет их с любыми labels, настроенными на уровне модели.

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

После включения BigQuery будет разбирать JSON‑комментарий и применять пары ключ‑значение в качестве labels к каждому заданию. Затем вы сможете фильтровать и анализировать задания в консоли BigQuery или через представление INFORMATION_SCHEMA.JOBS, используя эти labels.

### Задание tags

*Tags* таблиц и представлений BigQuery могут быть созданы путём указания пустой строки в качестве значения label.

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

Label с ключом, имеющим пустое значение, также может называться [tag](https://cloud.google.com/bigquery/docs/adding-labels#adding_a_label_without_a_value) в BigQuery. Однако это отличается от [BigQuery tag](https://cloud.google.com/bigquery/docs/tags), который условно применяет IAM‑политики к таблицам и датасетам BigQuery. Подробнее см. в [документации по Tags](https://cloud.google.com/resource-manager/docs/tags/tags-overview).

### Resource tags

[BigQuery tags](https://cloud.google.com/bigquery/docs/tags) позволяют реализовать условный контроль доступа IAM для таблиц и представлений BigQuery. Вы можете применять такие BigQuery tags с помощью конфигурации `resource_tags`. В этом разделе приведены рекомендации по использованию параметра конфигурации `resource_tags`.

Resource tags — это пары ключ‑значение, которые должны соответствовать формату тегов BigQuery: `{google_cloud_project_id}/{key_name}: value`. В отличие от labels, BigQuery tags в первую очередь предназначены для контроля доступа IAM с использованием условных политик, что позволяет организациям:

- **Реализовывать условный контроль доступа**: применять IAM‑политики в зависимости от BigQuery tags (например, предоставлять доступ только к таблицам с тегом `environment:production`).
- **Обеспечивать управление данными**: использовать BigQuery tags вместе с IAM‑политиками для защиты чувствительных данных.
- **Управлять доступом в масштабе**: единообразно управлять шаблонами доступа в разных проектах и окружениях.

#### Предварительные требования
- Заранее [создайте ключи и значения тегов](https://cloud.google.com/bigquery/docs/tags#create_tag_keys_and_values) перед использованием их в dbt.
- Предоставьте [необходимые IAM‑разрешения](https://cloud.google.com/bigquery/docs/tags#required_permissions) для применения тегов к ресурсам.

#### Настройка tags в файле модели
Пример настройки tags в файле модели:
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

#### Настройка tags в `dbt_project.yml`
Пример настройки tags в файле `dbt_project.yml`:
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

#### Совместное использование dbt tags и BigQuery tags

Вы можете использовать существующую конфигурацию `tags` в dbt вместе с `resource_tags` BigQuery:

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

Для получения дополнительной информации о настройке условных IAM‑политик с использованием BigQuery tags см. документацию BigQuery по [tags](https://cloud.google.com/bigquery/docs/tags).

### Policy tags
BigQuery поддерживает [безопасность на уровне колонок](https://cloud.google.com/bigquery/docs/column-level-security-intro) за счёт задания [policy tags](https://cloud.google.com/bigquery/docs/best-practices-policy-tags) для отдельных колонок.

dbt поддерживает эту возможность как свойство ресурса колонки — `policy_tags` (_не_ как конфигурацию узла).

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

Обратите внимание, что для того, чтобы policy tags начали действовать, для модели, seed или snapshot должна быть включена настройка [column-level `persist_docs`](/reference/resource-configs/persist_docs). Рекомендуется использовать [variables](/docs/build/project-variables) для управления таксономиями и убедиться, что к сервисному аккаунту BigQuery добавлены необходимые [роли](https://cloud.google.com/bigquery/docs/column-level-security-intro#roles).

## Поведение merge (инкрементальные модели)

Конфигурация [`incremental_strategy`](/docs/build/incremental-strategy) определяет, как dbt строит инкрементальные модели. В BigQuery dbt использует оператор [merge](https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax) для обновления инкрементальных таблиц.

Значение `incremental_strategy` может быть одним из следующих:
- `merge` (по умолчанию)
- `insert_overwrite`
- [`microbatch`](/docs/build/incremental-microbatch)

### Производительность и стоимость

Операции, выполняемые dbt при сборке инкрементальной модели BigQuery, 
можно сделать более дешёвыми и быстрыми, используя [кластеризацию](#clustering-clause) в конфигурации модели. 
Подробнее о тюнинге производительности инкрементальных моделей BigQuery см. в [этом руководстве](https://discourse.getdbt.com/t/benchmarking-incremental-strategies-on-bigquery/981).

**Примечание:** Эти преимущества по производительности и стоимости применимы к инкрементальным моделям, 
построенным как со стратегией `merge`, так и со стратегией `insert_overwrite`.

### Стратегия `merge`
Инкрементальная стратегия `merge` генерирует оператор `merge`, 
который выглядит примерно так:

```merge
merge into {{ destination_table }} DEST
using ({{ model_sql }}) SRC
on SRC.{{ unique_key }} = DEST.{{ unique_key }}

when matched then update ...
when not matched then insert ...
```

Подход `merge` автоматически обновляет новые данные в целевой инкрементальной таблице, но требует сканирования всех исходных таблиц, на которые ссылается SQL модели, а также целевой таблицы. Это может быть медленно и дорого при больших объёмах данных. Упомянутые ранее техники [партиционирования и кластеризации](#using-table-partitioning-and-clustering) помогают смягчить эти проблемы.

**Примечание:** Конфигурация `unique_key` обязательна при выборе инкрементальной 
стратегии `merge`.

### Стратегия `insert_overwrite`

Стратегия `insert_overwrite` генерирует оператор merge, который заменяет целые партиции 
в целевой таблице. **Примечание:** эта конфигурация требует, чтобы модель была 
настроена с использованием [Partition clause](#partition-clause). Оператор `merge`, 
который генерирует dbt при выборе стратегии `insert_overwrite`, выглядит примерно так:

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
[этом поясняющем посте](https://discourse.getdbt.com/t/bigquery-dbt-incremental-changes/982).

#### Определение партиций для перезаписи

dbt может определять партиции для перезаписи динамически на основе значений,
присутствующих во временной таблице, либо статически — с использованием пользовательской конфигурации.

«Динамический» подход является самым простым (и используется по умолчанию), однако «статический» подход
позволяет снизить стоимость за счёт исключения нескольких запросов в скрипте сборки модели.

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

Этот пример модели каждый день заменяет данные в целевой таблице как за _сегодня_, так 
и за _вчера_. Это самый быстрый и дешёвый способ инкрементального обновления таблицы с 
помощью dbt. Если бы мы хотели сделать это более динамичным образом — например, всегда 
за последние 3 дня, — мы могли бы использовать встроенные в dbt [datetime‑макросы](https://github.com/dbt-labs/dbt-core/blob/dev/octavius-catto/core/dbt/include/global_project/macros/etc/datetime.sql) и написать несколько собственных.

Это можно рассматривать как режим «полного контроля». Вы должны убедиться, что выражения или литеральные значения в конфигурации `partitions` корректно экранированы при шаблонизации и соответствуют `partition_by.data_type` (`timestamp`, `datetime`, `date` или `int64`). В противном случае фильтр в инкрементальном операторе `merge` приведёт к ошибке.

#### Динамические партиции

Если конфигурация `partitions` не указана, dbt выполнит следующие шаги:

1. Создаст временную таблицу на основе SQL модели
2. Выполнит запрос к временной таблице, чтобы определить уникальные партиции для перезаписи
3. Выполнит запрос к целевой таблице, чтобы найти _максимальную_ партицию в базе данных

При написании SQL модели вы можете воспользоваться интроспекцией, выполняемой dbt, 
чтобы отфильтровать только _новые_ данные. Максимальное значение в партиционированном 
поле целевой таблицы будет доступно через переменную BigQuery `_dbt_max_partition`. 
**Примечание:** это SQL‑переменная BigQuery, а не Jinja‑переменная dbt, поэтому для 
доступа к ней не требуются фигурные скобки Jinja.

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

Если при инкрементальных запусках вы заменяете целые партиции, вы можете использовать [copy table API](https://cloud.google.com/bigquery/docs/managing-tables#copy-table) и декораторы партиций вместо оператора `merge`. Хотя этот механизм не предоставляет такой же прозрачности и удобства отладки, как SQL‑оператор `merge`, он может дать значительную экономию времени и средств для больших наборов данных, поскольку copy table API не взимает плату за вставку данных — это эквивалент команды `bq cp` в интерфейсе командной строки gcloud (CLI).

Вы можете включить этот режим, установив `copy_partitions: True` в конфигурации `partition_by`. Этот подход работает только в сочетании с «динамической» заменой партиций.

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

По умолчанию таблицы, созданные dbt, никогда не истекают. Вы можете настроить отдельные модели
на истечение через заданное количество часов, установив `hours_to_expiration`.

:::info Note
Параметр `hours_to_expiration` применяется только при первоначальном создании таблицы. Он не сбрасывается для инкрементальных моделей при последующих запусках.
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

Если для модели, материализованной как представление (view), указана конфигурация `grant_access_to`,
dbt предоставит модели представления доступ на `SELECT` к списку указанных датасетов.
Подробнее см. 
[документацию BigQuery об авторизованных представлениях](https://cloud.google.com/bigquery/docs/share-access-views).

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

Представления с такой конфигурацией смогут выполнять `SELECT` из объектов в `project_1.dataset_1` и `project_2.dataset_2`, даже если они физически расположены в другом месте и запрашиваются пользователями, которые в противном случае не имеют доступа к `project_1.dataset_1` и `project_2.dataset_2`.

## Материализованные представления (Materialized views)

Адаптер BigQuery поддерживает [материализованные представления](https://cloud.google.com/bigquery/docs/materialized-views-intro)
со следующими параметрами конфигурации:

| Параметр                                                                          | Тип                    | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|-----------------------------------------------------------------------------------|------------------------|--------------|--------------|----------------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`             | нет          | `apply`      | n/a                              |
| [`cluster_by`](#clustering-clause)                                                | `[<string>]`           | нет          | `none`       | drop/create                      |
| [`partition_by`](#partition-clause)                                               | `{<dictionary>}`       | нет          | `none`       | drop/create                      |
| [`enable_refresh`](#auto-refresh)                                                 | `<boolean>`            | нет          | `true`       | alter                            |
| [`refresh_interval_minutes`](#auto-refresh)                                      | `<float>`              | нет          | `30`         | alter                            |
| [`max_staleness`](#auto-refresh) (Preview)                                       | `<interval>`           | нет          | `none`       | alter                            |
| [`description`](/reference/resource-properties/description)                       | `<string>`             | нет          | `none`       | alter                            |
| [`labels`](#specifying-labels)                                                    | `{<string>: <string>}` | нет          | `none`       | alter                            |
| [`resource_tags`](#resource-tags)                                                 | `{<string>: <string>}` | нет          | `none`       | alter                            |
| [`hours_to_expiration`](#controlling-table-expiration)                            | `<integer>`            | нет          | `none`       | alter                            |
| [`kms_key_name`](#using-kms-encryption)                                           | `<string>`             | нет          | `none`       | alter                            |

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
        # only if `data_type` is not 'int64'
      - granularity: hour | day | month | year
        # only if `data_type` is 'int64'
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
          # only if `data_type` is not 'int64'
        - granularity: hour | day | month | year
          # only if `data_type` is 'int64'
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

        # only if `data_type` is not 'int64'
        "granularity": "hour" | "day" | "month" | "year,

        # only if `data_type` is 'int64'
        "range": {
            "start": <integer>,
            "end": <integer>,
            "interval": <integer>,
        }
    },

    # auto-refresh options
    [enable_refresh](#auto-refresh)= true | false,
    [refresh_interval_minutes](#auto-refresh)=<float>,
    [max_staleness](#auto-refresh)="<interval>",

    # additional options
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

Многие из этих параметров соответствуют аналогичным параметрам для таблиц и были связаны выше.
Набор параметров, уникальных для материализованных представлений, охватывает функциональность [автообновления](#auto-refresh).

Подробнее об этих параметрах см. в документации BigQuery:
- [оператор CREATE MATERIALIZED VIEW](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#create_materialized_view_statement)
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)

### Автообновление (Auto-refresh)

| Параметр                     | Тип          | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|------------------------------|--------------|--------------|--------------|----------------------------------|
| `enable_refresh`             | `<boolean>`  | нет          | `true`       | alter                            |
| `refresh_interval_minutes`   | `<float>`    | нет          | `30`         | alter                            |
| `max_staleness` (Preview)    | `<interval>` | нет          | `none`       | alter                            |

BigQuery поддерживает конфигурацию [автоматического обновления](https://cloud.google.com/bigquery/docs/materialized-views-manage#automatic_refresh) для материализованных представлений.
По умолчанию материализованное представление автоматически обновляется в течение 5 минут после изменений в базовой таблице, но не чаще чем один раз в 30 минут.
BigQuery официально поддерживает настройку только частоты обновления (то есть «не чаще одного раза в 30 минут»);
однако в режиме Preview доступна возможность настройки допустимой устарелости данных (staleness), то есть «обновление через 5 минут».
dbt отслеживает изменения этих параметров и применяет их с помощью оператора `ALTER`.

Подробнее см. документацию BigQuery:
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)
- [max_staleness](https://cloud.google.com/bigquery/docs/materialized-views-create#max_staleness)

### Ограничения

Как и на большинстве платформ обработки данных, у материализованных представлений есть ограничения. Среди наиболее важных:

- SQL для материализованных представлений имеет [ограниченный набор возможностей](https://cloud.google.com/bigquery/docs/materialized-views-create#supported-mvs).
- SQL материализованного представления нельзя изменить; требуется `--full-refresh` (DROP/CREATE).
- Параметр `partition_by` у материализованного представления должен совпадать с параметром базовой таблицы.
- Материализованные представления могут иметь описание, но *столбцы* материализованного представления — нет.
- Пересоздание или удаление базовой таблицы требует пересоздания или удаления материализованного представления.

Дополнительную информацию об ограничениях см. в [документации BigQuery](https://cloud.google.com/bigquery/docs/materialized-views-intro#limitations).

## Конфигурация Python-моделей

**Способы отправки заданий (Submission methods):**
BigQuery поддерживает несколько механизмов для выполнения Python-кода, каждый со своими преимуществами. Адаптер `dbt-bigquery` использует BigQuery DataFrames (BigFrames) или Dataproc. В этом процессе данные считываются из BigQuery, вычисления выполняются либо нативно с помощью BigQuery DataFrames, либо в Dataproc, а результаты записываются обратно в BigQuery.

<Tabs
  defaultValue="dataframes"
  values={[
    { label: 'BigQuery DataFrames', value: 'dataframes', },
    { label: 'Dataproc', value: 'dataproc', },
  ]
}>
<TabItem value="dataframes">

BigQuery DataFrames позволяют выполнять код pandas и scikit-learn. Нет необходимости управлять инфраструктурой, при этом используются распределённые движки запросов BigQuery. Это отличный вариант для аналитиков, дата-сайентистов и ML-инженеров, которым нужно работать с большими объёмами данных с помощью синтаксиса, похожего на pandas.

**Примечание:** BigQuery DataFrames выполняются в стандартной среде выполнения Google Colab. Если шаблон runtime с именем `default` недоступен, адаптер автоматически создаст его и пометит как `default` для последующего использования (при наличии необходимых прав).

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

Dataproc (`serverless` или заранее настроенный `cluster`) может выполнять Python-модели как задания PySpark, читая данные из BigQuery и записывая результаты обратно в BigQuery. Режим `serverless` проще в настройке, но медленнее и имеет ограниченные возможности конфигурации и предустановленные пакеты (`pandas`, `numpy`, `scikit-learn`). Режим `cluster` даёт полный контроль и более высокую производительность. Dataproc хорошо подходит для сложных, долгих пакетных пайплайнов и унаследованных Hadoop/Spark-нагрузок, но часто медленнее для ad-hoc или интерактивных задач.

**Настройка Dataproc:**
- Создайте или используйте существующий [Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets).
- Включите Dataproc API для вашего проекта и региона.
- Если используется метод отправки `cluster`: создайте или используйте существующий [кластер Dataproc](https://cloud.google.com/dataproc/docs/guides/create-cluster) с [инициализационным действием для Spark BigQuery connector](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/connectors#bigquery-connectors). (Google рекомендует копировать действие в собственный Cloud Storage bucket, а не использовать пример из скриншота.)

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-connector-initialization.png" title="Добавление Spark BigQuery connector в качестве initialization action"/>

Для запуска Python-моделей на Dataproc необходимы следующие конфигурации. Их можно добавить в [профиль BigQuery](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc) или задать для конкретных Python-моделей:
- `gcs_bucket`: bucket, в который dbt загрузит скомпилированный PySpark-код модели.
- `dataproc_region`: регион GCP, в котором включён Dataproc (например, `us-central1`).
- `dataproc_cluster_name`: имя кластера Dataproc для запуска Python-модели (PySpark job). Требуется только при `submission_method: cluster`.

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

Python-модели, выполняемые в Dataproc Serverless, могут быть дополнительно настроены в вашем [профиле BigQuery](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc).

Любой пользователь или сервисный аккаунт, запускающий Python-модели dbt, должен иметь следующие права, помимо необходимых прав BigQuery:
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

    Также пакеты можно установить при создании кластера, [задав свойства кластера](https://cloud.google.com/dataproc/docs/tutorials/python-configuration#image_version_20): `dataproc:pip.packages` или `dataproc:conda.packages`.

- **Dataproc Serverless** — Google рекомендует использовать [пользовательский Docker-образ](https://cloud.google.com/dataproc-serverless/docs/guides/custom-containers) для установки сторонних пакетов. Образ должен быть размещён в [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs). После этого его можно указать в профилях dbt:

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
            
            # for dbt Python models to be run on Dataproc Serverless
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

| Параметр               | Тип          | Обязательный | По умолчанию | Допустимые значения |
| :--------------------- | :----------- | :----------- | :----------- | :------------------ |
| `enable_list_inference` | `<boolean>` | нет          | `True`       | `True`, `False`     |
| `intermediate_format`   | `<string>`  | нет          | `parquet`    | `parquet`, `orc`    |
| `submission_method`     | `<string>`  | нет          | ``           | `serverless`, `bigframes`, `cluster` |
| `notebook_template_id`  | `<Integer>` | нет          | ``           | `<NOTEBOOK RUNTIME TEMPLATE_ID>` |
| `compute_region`        | `<string>`  | нет          | ``           | `<COMPUTE_REGION>`  |
| `gcs_bucket`            | `<string>`  | нет          | ``           | `<GCS_BUCKET>`     |
| `packages`              | `<string>`  | нет          | ``           | `['numpy<=1.1.1', 'pandas', 'mlflow']` |
| `enable_change_history` | `<boolean>` | нет          | ``           | `True`, `False`     |

- Параметр `enable_list_inference`
  - Включает возможность чтения нескольких записей за одну операцию в PySpark DataFrame. По умолчанию установлен в `True` для поддержки формата `intermediate_format` по умолчанию (`parquet`).

- Параметр `intermediate_format`
  - Определяет формат файлов, используемый при записи данных в таблицу. По умолчанию используется `parquet`.

- Параметр `submission_method`
  - Определяет, будет ли задание выполняться в BigQuery DataFrames или в Serverless Spark. Параметр не обязателен, если задан `dataproc_cluster_name`.

- Параметр `notebook_template_id`
  - Указывает шаблон runtime в Colab Enterprise.

- Параметр `compute_region`
  - Определяет регион выполнения задания.

- Параметр `gcs_bucket`
  - Указывает GCS bucket, используемый для хранения артефактов задания.

- Параметр `enable_change_history`
  - Включает [функцию истории изменений BigQuery](https://cloud.google.com/bigquery/docs/change-history), которая отслеживает изменения, внесённые в таблицу BigQuery. При включении можно использовать историю изменений для аудита и отладки поведения инкрементальных моделей.

**Связанная документация:**

- [Обзор Dataproc](https://cloud.google.com/dataproc/docs/concepts/overview)
- [Создание кластера Dataproc](https://cloud.google.com/dataproc/docs/guides/create-cluster)
- [Создание Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets)
- [Синтаксис PySpark DataFrame](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)

## Ограничения unit-тестов

Для [unit-тестов](/docs/build/unit-tests) необходимо указывать все поля в BigQuery `STRUCT`. Использовать только подмножество полей в `STRUCT` нельзя.
