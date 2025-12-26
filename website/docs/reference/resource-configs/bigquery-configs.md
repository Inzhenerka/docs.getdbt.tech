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
Это позволит читать данные и записывать их в несколько проектов BigQuery. Аналогично работает и для `dataset`.

## Использование разбиения и кластеризации таблиц

### Разделение на части

BigQuery поддерживает использование [разделения на части](https://cloud.google.com/bigquery/docs/data-definition-language#specifying_table_partitioning_options) для легкого разбиения <Term id="table" /> по столбцу или выражению. Эта опция может помочь уменьшить задержку и стоимость при запросе больших таблиц. Обратите внимание, что обрезка разделов [работает](https://cloud.google.com/bigquery/docs/querying-partitioned-tables#use_a_constant_filter_expression) только тогда, когда разделы фильтруются с использованием литеральных значений (поэтому выбор разделов с использованием <Term id="subquery" /> не улучшит производительность).

Конфигурация `partition_by` может быть предоставлена в виде словаря следующего формата:

```python
{
  "field": "<field name>",
  "data_type": "<timestamp | date | datetime | int64>",
  "granularity": "<hour | day | month | year>"

  # Обязательно, если data_type равно "int64"
  "range": {
    "start": <int>,
    "end": <int>,
    "interval": <int>
  }
}
```

#### Разделение по дате или временной метке

При использовании столбца `datetime` или `timestamp` для разбиения данных вы можете создавать разделы с гранулярностью час, день, месяц или год. Столбец `date` поддерживает гранулярность день, месяц и год. Ежедневное разбиение является значением по умолчанию для всех типов столбцов.

Если `data_type` указано как `date` и гранулярность — день, dbt предоставит поле как есть при настройке разбиения таблицы.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Скомпилированный код', value: 'compiled', },
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

#### Разделение по дате или временной метке "ингестации"

BigQuery поддерживает [старый механизм разбиения](https://cloud.google.com/bigquery/docs/partitioned-tables#ingestion_time), основанный на времени, когда каждая строка была загружена. Хотя мы рекомендуем использовать новый и более удобный подход к разбиению, когда это возможно, для очень больших наборов данных может быть некоторое улучшение производительности при использовании этого старого, более механистического подхода. [Подробнее о стратегии `insert_overwrite` ниже](#copying-ingestion-time-partitions).

dbt всегда будет инструктировать BigQuery разбивать вашу таблицу по значениям столбца, указанного в `partition_by.field`. Настроив вашу модель с `partition_by.time_ingestion_partitioning`, установленным в `True`, dbt будет использовать этот столбец в качестве входных данных для псевдостолбца `_PARTITIONTIME`. В отличие от нового разбиения на основе столбцов, вы должны убедиться, что значения вашего столбца разбиения точно соответствуют временной гранулярности ваших разделов.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Скомпилированный код', value: 'compiled', },
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
  -- значения этого столбца должны соответствовать типу данных + гранулярности, определенной выше
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
      -- значения этого столбца должны соответствовать гранулярности, определенной выше
      timestamp_trunc(created_at, day) as created_date

    from `projectname`.`analytics`.`events`
);
```

</File>

</TabItem>
</Tabs>

#### Разделение с использованием целочисленных сегментов

Если `data_type` указано как `int64`, то также должен быть предоставлен ключ `range` в словаре `partition_by`. dbt будет использовать значения, предоставленные в словаре `range`, для генерации разделяющего выражения для таблицы.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Скомпилированный код', value: 'compiled', },
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

#### Дополнительные конфигурации разбиения

Если ваша модель имеет настроенный `partition_by`, вы можете дополнительно указать две дополнительные конфигурации:

- `require_partition_filter` (логическое значение): Если установлено в `true`, любой, кто выполняет запрос к этой модели, _должен_ указать фильтр раздела, в противном случае их запрос завершится неудачей. Это рекомендуется для очень больших таблиц с очевидными схемами разбиения, такими как потоки событий, сгруппированные по дням. Обратите внимание, что это также повлияет на другие модели dbt или тесты, которые пытаются выбрать из этой модели.

- `partition_expiration_days` (целое число): Если установлено для разделов типа дата или временная метка, раздел истечет через указанное количество дней после даты, которую он представляет. Например, раздел, представляющий `2021-01-01`, установленный на истечение через 7 дней, больше не будет доступен для запросов с `2021-01-08`, его стоимость хранения будет обнулена, и его содержимое в конечном итоге будет удалено. Обратите внимание, что [истечение срока действия таблицы](#controlling-table-expiration) будет иметь приоритет, если указано.

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

### Кластеризация

Таблицы BigQuery могут быть [кластеризованы](https://cloud.google.com/bigquery/docs/clustered-tables) для совместного размещения связанных данных.

Кластеризация по одному столбцу:

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

Кластеризация по нескольким столбцам:

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

[Ключи шифрования, управляемые клиентом](https://cloud.google.com/bigquery/docs/customer-managed-encryption) могут быть настроены для таблиц BigQuery с использованием конфигурации модели `kms_key_name`.

### Использование шифрования KMS

Чтобы указать имя ключа KMS для модели (или группы моделей), используйте конфигурацию модели `kms_key_name`. В следующем примере устанавливается `kms_key_name` для всех моделей в каталоге `encrypted/` вашего проекта dbt.

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

### Указание меток

dbt поддерживает указание меток BigQuery для таблиц и <Term id="view">представлений</Term>, которые он создает. Эти метки могут быть указаны с помощью конфигурации модели `labels`.

Конфигурацию `labels` можно задать либо в конфигурации модели, либо в файле `dbt_project.yml`, как показано ниже.

Пары ключ–значение BigQuery для `labels`, длина которых превышает 63 символа, будут усечены.

  Записи пар ключ-значение BigQuery для меток, превышающих 63 символа, обрезаются.

**Настройка меток в файле модели**

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

**Настройка меток в dbt_project.yml**

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

<Lightbox src="/img/docs/building-a-dbt-project/building-models/73eaa8a-Screen_Shot_2020-01-20_at_12.12.54_PM.png" title="Просмотр меток в консоли BigQuery"/>

### Применение меток к заданиям (jobs)

Хотя настройка `labels` применяется к таблицам и представлениям, создаваемым dbt, вы также можете применять метки к заданиям BigQuery (_jobs_), которые выполняет dbt. Метки заданий полезны для отслеживания стоимости запросов, мониторинга производительности заданий и организации истории заданий BigQuery с использованием метаданных dbt.

По умолчанию метки напрямую к заданиям не применяются. Однако вы можете включить маркировку заданий через комментарии к запросам, выполнив следующие шаги:

#### Шаг 1
Определите макрос `query_comment`, который будет добавлять метки в ваши запросы через комментарий запроса:

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

Этот макрос создаёт JSON-комментарий, содержащий метаданные dbt (приложение, версию, профиль, таргет), и объединяет их с любыми метками, заданными на уровне конкретной модели.

#### Шаг 2
Включите маркировку заданий в вашем `dbt_project.yml`, указав `comment: "{{ query_comment(node) }}"` и `job-label: true` в настройке `query-comment`:

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

После включения BigQuery будет разбирать JSON-комментарий и применять пары ключ–значение в качестве меток к каждому заданию. Затем вы сможете фильтровать и анализировать задания в консоли BigQuery или через представление `INFORMATION_SCHEMA.JOBS`, используя эти метки.

### Указание тегов

*Теги* таблиц и представлений BigQuery могут быть созданы, если передать пустую строку в качестве значения метки.

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

Label с ключом, у которого указано пустое значение, в BigQuery также может называться [tag](https://cloud.google.com/bigquery/docs/adding-labels#adding_a_label_without_a_value). Однако это **не то же самое**, что [BigQuery tag](https://cloud.google.com/bigquery/docs/tags), который используется для условного применения IAM-политик к таблицам и датасетам BigQuery. Подробнее см. в документации [Tags](https://cloud.google.com/resource-manager/docs/tags/tags-overview).

### Resource tags

[BigQuery tags](https://cloud.google.com/bigquery/docs/tags) позволяют реализовать условный контроль доступа IAM для таблиц и представлений BigQuery. Вы можете применять такие BigQuery tags с помощью конфигурационного параметра `resource_tags`. В этом разделе приведены рекомендации по использованию параметра `resource_tags`.

Resource tags — это пары ключ–значение, которые должны соответствовать формату тегов BigQuery: `{google_cloud_project_id}/{key_name}: value`. В отличие от labels, BigQuery tags в первую очередь предназначены для управления доступом IAM с использованием условных политик, что позволяет организациям:

- **Реализовывать условный контроль доступа**: применять IAM-политики в зависимости от BigQuery tags (например, предоставлять доступ только к таблицам с тегом `environment:production`).
- **Обеспечивать управление данными**: использовать BigQuery tags вместе с IAM-политиками для защиты чувствительных данных.
- **Управлять доступом в масштабе**: единообразно управлять шаблонами доступа в разных проектах и окружениях.

#### Предварительные требования
- Заранее [создайте ключи и значения тегов](https://cloud.google.com/bigquery/docs/tags#create_tag_keys_and_values) перед их использованием в dbt.
- Предоставьте [необходимые IAM-права](https://cloud.google.com/bigquery/docs/tags#required_permissions) для применения тегов к ресурсам.

#### Настройка тегов в файле модели
Чтобы настроить теги в файле модели, см. следующий пример:
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
Чтобы настроить теги в файле `dbt_project.yml`, см. следующий пример:
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

Вы можете использовать существующую конфигурацию `tags` в dbt одновременно с `resource_tags` из BigQuery:

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

Подробнее о настройке условных IAM-политик с использованием BigQuery tags см. документацию BigQuery по [tags](https://cloud.google.com/bigquery/docs/tags).

### Политические теги
BigQuery позволяет [безопасность на уровне столбцов](https://cloud.google.com/bigquery/docs/column-level-security-intro) путем установки [политических тегов](https://cloud.google.com/bigquery/docs/best-practices-policy-tags) на конкретные столбцы.

dbt включает эту функцию как свойство ресурса столбца, `policy_tags` (_не_ конфигурация узла).

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

Обратите внимание, что для того, чтобы политические теги вступили в силу, [сохранение документов на уровне столбцов](/reference/resource-configs/persist_docs) должно быть включено для модели, семени или снимка. Рассмотрите возможность использования [переменных](/docs/build/project-variables) для управления таксономиями и обязательно добавьте необходимые [роли безопасности](https://cloud.google.com/bigquery/docs/column-level-security-intro#roles) в ключ учетной записи службы BigQuery.

## Поведение слияния (инкрементальные модели)

Конфигурация [`incremental_strategy`](/docs/build/incremental-strategy) управляет тем, как dbt строит инкрементальные модели. dbt использует [оператор слияния](https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax) в BigQuery для обновления инкрементальных таблиц.

Конфигурация `incremental_strategy` может быть установлена на одно из следующих значений:
- `merge` (по умолчанию)
- `insert_overwrite`
- [`microbatch`](/docs/build/incremental-microbatch)

### Производительность и стоимость

Операции, выполняемые dbt при построении инкрементальной модели BigQuery, могут быть сделаны дешевле и быстрее с использованием [кластеризации](#clustering-clause) в конфигурации вашей модели. См. [это руководство](https://discourse.getdbt.com/t/benchmarking-incremental-strategies-on-bigquery/981) для получения дополнительной информации о настройке производительности для инкрементальных моделей BigQuery.

**Примечание:** Эти преимущества в производительности и стоимости применимы к инкрементальным моделям, построенным с использованием как стратегии `merge`, так и стратегии `insert_overwrite`.

### Стратегия `merge`
 Инкрементальная стратегия `merge` сгенерирует оператор `merge`, который будет выглядеть примерно так:

```merge
merge into {{ destination_table }} DEST
using ({{ model_sql }}) SRC
on SRC.{{ unique_key }} = DEST.{{ unique_key }}

when matched then update ...
when not matched then insert ...
```

Подход 'merge' автоматически обновляет новые данные в целевой инкрементальной таблице, но требует сканирования всех исходных таблиц, упомянутых в SQL модели, а также целевых таблиц. Это может быть медленно и дорого для больших объемов данных. Упомянутые ранее техники [разбиения и кластеризации](#using-table-partitioning-and-clustering) могут помочь смягчить эти проблемы.

**Примечание:** Конфигурация `unique_key` обязательна, когда выбрана инкрементальная стратегия `merge`.

### Стратегия `insert_overwrite`

Стратегия `insert_overwrite` генерирует оператор слияния, который заменяет целые разделы в целевой таблице. **Примечание:** эта конфигурация требует, чтобы модель была настроена с [разделением на части](#partition-clause). Оператор `merge`, который генерирует dbt, когда выбрана стратегия `insert_overwrite`, выглядит примерно так:

```sql
/*
  Создание временной таблицы из SQL модели
*/
create temporary table {{ model_name }}__dbt_tmp as (
  {{ model_sql }}
);

/*
  Если применимо, определите разделы для замены, запросив временную таблицу.
*/

declare dbt_partitions_for_replacement array<date>;
set (dbt_partitions_for_replacement) = (
    select as struct
        array_agg(distinct date(max_tstamp))
    from `my_project`.`my_dataset`.{{ model_name }}__dbt_tmp
);

/*
  Перезапись разделов в целевой таблице, которые совпадают
  с разделами во временной таблице
*/
merge into {{ destination_table }} DEST
using {{ model_name }}__dbt_tmp SRC
on FALSE

when not matched by source and {{ partition_column }} in unnest(dbt_partitions_for_replacement)
then delete

when not matched then insert ...
```

Для полного описания механики этого подхода см. [этот пост-объяснение](https://discourse.getdbt.com/t/bigquery-dbt-incremental-changes/982).

#### Определение разделов для перезаписи

dbt может динамически определять разделы для перезаписи из значений, присутствующих во временной таблице, или статически с использованием конфигурации, предоставленной пользователем.

"Динамический" подход является самым простым (и по умолчанию), но "статический" подход снизит затраты, устранив множественные запросы в скрипте построения модели.

#### Статические разделы

Чтобы предоставить статический список разделов для перезаписи, используйте конфигурацию `partitions`.

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
        -- пересчитать вчера + сегодня
        where timestamp_trunc(event_timestamp, day) in ({{ partitions_to_replace | join(',') }})
    {% endif %}

),

... остальная часть модели ...
```

</File>

Эта примерная модель служит для замены данных в целевой таблице как для _сегодня_, так и для _вчера_ каждый день, когда она запускается. Это самый быстрый и дешевый способ инкрементального обновления таблицы с использованием dbt. Если бы мы хотели, чтобы это выполнялось более динамично — скажем, всегда за последние 3 дня — мы могли бы использовать встроенные в dbt [макросы даты и времени](https://github.com/dbt-labs/dbt-core/blob/dev/octavius-catto/core/dbt/include/global_project/macros/etc/datetime.sql) и написать несколько своих.

Рассматривайте это как режим «полного контроля». Вы должны убедиться, что выражения или литеральные значения в конфигурации `partitions` корректно заключены в кавычки при использовании шаблонов и что они соответствуют значению `partition_by.data_type` (`timestamp`, `datetime`, `date` или `int64`). В противном случае фильтр в инкрементальном операторе `merge` вызовет ошибку.

#### Динамические разделы

Если конфигурация `partitions` не предоставлена, dbt вместо этого:

1. Создаст временную таблицу для вашего SQL модели
2. Запросит временную таблицу, чтобы найти уникальные разделы для перезаписи
3. Запросит целевую таблицу, чтобы найти _максимальный_ раздел в базе данных

При написании SQL для модели вы можете воспользоваться механизмами интроспекции dbt, чтобы отфильтровать только *новые* данные. Максимальное значение в поле партиционирования целевой таблицы будет доступно через переменную BigQuery scripting `_dbt_max_partition`. **Обратите внимание:** это переменная SQL уровня BigQuery, а не Jinja‑переменная dbt, поэтому для доступа к ней не требуется использовать Jinja‑скобки.

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

    -- пересчитать данные за последний день + предыдущий
    -- ПРИМЕЧАНИЕ: Переменная _dbt_max_partition используется для introspection целевой таблицы
    where date(event_timestamp) >= date_sub(date(_dbt_max_partition), interval 1 day)

{% endif %}

),

... остальная часть модели ...
```

#### Копирование разделов

Если вы заменяете целые разделы в ваших инкрементальных запусках, вы можете сделать это с помощью [API копирования таблиц](https://cloud.google.com/bigquery/docs/managing-tables#copy-table) и декораторов разделов, а не оператора `merge`. Хотя этот механизм не предлагает такой же видимости и простоты отладки, как оператор SQL `merge`, он может привести к значительной экономии времени и затрат для больших наборов данных, поскольку API копирования таблиц не несет никаких затрат на вставку данных - это эквивалентно команде `bq cp` в командной строке gcloud.

Вы можете включить это, включив `copy_partitions: True` в конфигурации `partition_by`. Этот подход работает только в сочетании с "динамической" заменой разделов.

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
  -- значения этого столбца должны соответствовать типу данных + гранулярности, определенной выше
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

## Управление сроком действия таблицы

По умолчанию, таблицы, созданные dbt, никогда не истекают. Вы можете настроить определенные модели, чтобы они истекали через заданное количество часов, установив `hours_to_expiration`.

:::info Примечание
`hours_to_expiration` применяется только к первоначальному созданию базовой таблицы. Он не сбрасывается для инкрементальных моделей, когда они выполняют другой запуск.
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

## Авторизованные представления

Если конфигурация `grant_access_to` указана для модели, материализованной как представление, dbt предоставит модели представления доступ для выбора из списка предоставленных наборов данных. См. [документацию BQ об авторизованных представлениях](https://cloud.google.com/bigquery/docs/share-access-views) для получения дополнительных сведений.

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

Представления с этой конфигурацией смогут выбирать из объектов в `project_1.dataset_1` и `project_2.dataset_2`, даже если они находятся в другом месте и запрашиваются пользователями, которые в противном случае не имеют доступа к `project_1.dataset_1` и `project_2.dataset_2`.

## Материализованные представления

Адаптер BigQuery поддерживает [материализованные представления](https://cloud.google.com/bigquery/docs/materialized-views-intro) с следующими параметрами конфигурации:

| Параметр                                                                        | Тип                   | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|----------------------------------------------------------------------------------|------------------------|----------|---------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`             | no       | `apply` | n/a                       |
| [`cluster_by`](#clustering-clause)                                               | `[<string>]`           | no       | `none`  | drop/create               |
| [`partition_by`](#partition-clause)                                              | `{<dictionary>}`       | no       | `none`  | drop/create               |
| [`enable_refresh`](#auto-refresh)                                                | `<boolean>`            | no       | `true`  | alter                     |
| [`refresh_interval_minutes`](#auto-refresh)                                      | `<float>`              | no       | `30`    | alter                     |
| [`max_staleness`](#auto-refresh) (в режиме Preview)                              | `<interval>`           | no       | `none`  | alter                     |
| [`description`](/reference/resource-properties/description)                      | `<string>`             | no       | `none`  | alter                     |
| [`labels`](#specifying-labels)                                                   | `{<string>: <string>}` | no       | `none`  | alter                     |
| [`resource_tags`](#resource-tags)                                                | `{<string>: <string>}` | no       | `none`  | alter                     |
| [`hours_to_expiration`](#controlling-table-expiration)                           | `<integer>`            | no       | `none`  | alter                     |
| [`kms_key_name`](#using-kms-encryption)                                          | `<string>`             | no       | `none`  | alter                     |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
```js
{ label: 'Файл проекта', value: 'project-yaml', },
{ label: 'Файл свойств', value: 'property-yaml', },
{ label: 'Конфигурация SQL-файла', value: 'config', },
```
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
        # только если `data_type` равно 'int64'
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
          # только если `data_type` равно 'int64'
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

        # только если `data_type` равно 'int64'
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

Многие из этих параметров соответствуют их аналогам для таблиц и были связаны выше. Набор параметров, уникальных для материализованных представлений, охватывает [функциональность автообновления](#auto-refresh).

Узнайте больше об этих параметрах в документации BigQuery:
- [Оператор CREATE MATERIALIZED VIEW](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#create_materialized_view_statement)
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)

### Автообновление

| Параметр                    | Тип         | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|------------------------------|--------------|----------|---------|---------------------------|
| `enable_refresh`             | `<boolean>`  | нет       | `true`  | alter                     |
| `refresh_interval_minutes`   | `<float>`    | нет       | `30`    | alter                     |
| `max_staleness` (в предварительном просмотре) | `<interval>` | нет       | `none`  | alter                     |

BigQuery поддерживает [автоматическую настройку обновления](https://cloud.google.com/bigquery/docs/materialized-views-manage#automatic_refresh) для материализованных представлений. По умолчанию материализованное представление будет автоматически обновляться в течение 5 минут после изменений в базовой таблице, но не чаще, чем раз в 30 минут. BigQuery официально поддерживает только настройку частоты (частота "раз в 30 минут"); однако существует функция в предварительном просмотре, которая позволяет настроить устаревание (обновление "5 минут"). dbt будет отслеживать эти параметры на предмет изменений и применять их с помощью оператора `ALTER`.

Узнайте больше об этих параметрах в документации BigQuery:
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)
- [max_staleness](https://cloud.google.com/bigquery/docs/materialized-views-create#max_staleness)

### Ограничения

Как и в большинстве платформ данных, существуют ограничения, связанные с материализованными представлениями. Некоторые из них, которые стоит отметить, включают:

- SQL материализованного представления имеет [ограниченный набор функций](https://cloud.google.com/bigquery/docs/materialized-views-create#supported-mvs).
- SQL материализованного представления не может быть обновлен; материализованное представление должно пройти через `--full-refresh` (DROP/CREATE).
- Разделение в материализованном представлении должно соответствовать разделению в базовой таблице.
- Хотя материализованные представления могут иметь описания, *столбцы* материализованных представлений не могут.
- Пересоздание/удаление базовой таблицы требует пересоздания/удаления материализованного представления.

Более подробную информацию об ограничениях материализованных представлений можно найти в [документации](https://cloud.google.com/bigquery/docs/materialized-views-intro#limitations) Google BigQuery.

## Конфигурация Python‑моделей

**Способы отправки (submission methods):**  
BigQuery поддерживает несколько механизмов для отправки Python‑кода, каждый из которых имеет свои преимущества. Адаптер `dbt-bigquery` использует BigQuery DataFrames (BigFrames) или Dataproc. В обоих случаях данные считываются из BigQuery, вычисления выполняются либо нативно с помощью BigQuery DataFrames, либо в Dataproc, а результаты записываются обратно в BigQuery.

<Tabs
  defaultValue="dataframes"
  values={[
    { label: 'BigQuery DataFrames', value: 'dataframes', },
    { label: 'Dataproc', value: 'dataproc', },
  ]
}>
<TabItem value="dataframes">

BigQuery DataFrames могут выполнять код на pandas и scikit‑learn. Нет необходимости управлять инфраструктурой — используется распределённый движок запросов BigQuery. Это хороший вариант для аналитиков, data scientists и ML‑инженеров, которым нужно работать с большими объёмами данных, используя синтаксис, похожий на pandas.

**Примечание:** BigQuery DataFrames запускаются в стандартном runtime Google Colab. Если runtime‑шаблон с именем `default` недоступен, адаптер автоматически создаст его и пометит как `default` для последующего использования (при наличии необходимых прав).

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

Dataproc (`serverless` или заранее настроенный `cluster`) может выполнять Python‑модели как задания PySpark, читая данные из BigQuery и записывая их обратно. Режим `serverless` проще в использовании, но работает медленнее и имеет ограниченные возможности настройки, а также предустановленный набор пакетов (`pandas`, `numpy`, `scikit-learn`). Режим `cluster` даёт полный контроль и более быстрое выполнение. Dataproc хорошо подходит для сложных, длительных batch‑пайплайнов и легаси‑workflow на Hadoop/Spark, но часто оказывается медленнее для ad‑hoc или интерактивных задач.

**Настройка Dataproc:**
- Создайте или используйте существующий [Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets).
- Включите Dataproc API для вашего проекта и региона.
- Если используется метод `cluster`: создайте или используйте существующий [Dataproc cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster) с [инициализационным действием Spark BigQuery connector](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/connectors#bigquery-connectors). (Google рекомендует скопировать это действие в собственный Cloud Storage bucket, а не использовать пример из репозитория.)

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-connector-initialization.png" title="Add the Spark BigQuery connector as an initialization action"/>

Для запуска Python‑моделей в Dataproc требуются следующие настройки. Их можно добавить в [BigQuery profile](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc) или указать непосредственно в конкретных Python‑моделях:
- `gcs_bucket`: bucket, в который dbt будет загружать скомпилированный PySpark‑код модели.
- `dataproc_region`: регион GCP, в котором включён Dataproc (например, `us-central1`).
- `dataproc_cluster_name`: имя Dataproc‑кластера для запуска Python‑модели (выполнения PySpark‑job). Требуется только при `submission_method: cluster`.

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

Python‑модели, запущенные в Dataproc Serverless, могут быть дополнительно настроены в вашем [BigQuery profile](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc).

Любой пользователь или service account, запускающий dbt Python‑модели, должен иметь следующие разрешения в дополнение к обязательным правам BigQuery:
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
Подробнее см. [Dataproc IAM roles and permissions](https://cloud.google.com/dataproc/docs/concepts/iam/iam).

**Установка пакетов:**  

Установка сторонних Python‑пакетов в Dataproc зависит от того, используется ли [cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster) или [serverless](https://cloud.google.com/dataproc-serverless/docs).

- **Dataproc Cluster** — Google рекомендует устанавливать Python‑пакеты при создании кластера с помощью initialization actions:  
  - [Как используются initialization actions](https://github.com/GoogleCloudDataproc/initialization-actions/blob/master/README.md#how-initialization-actions-are-used)  
  - [Действия для установки через `pip` или `conda`](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/python)

  Также можно устанавливать пакеты при создании кластера, [задав свойства кластера](https://cloud.google.com/dataproc/docs/tutorials/python-configuration#image_version_20): `dataproc:pip.packages` или `dataproc:conda.packages`.

- **Dataproc Serverless** — Google рекомендует использовать [кастомный docker‑образ](https://cloud.google.com/dataproc-serverless/docs/guides/custom-containers) для установки сторонних пакетов. Образ должен быть размещён в [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs). Затем его можно указать в профилях dbt:

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

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-pip-packages.png" title="Adding packages to install via pip at cluster startup"/>

</TabItem>
</Tabs>

### Дополнительные параметры

Python‑модели для BigQuery также поддерживают следующие дополнительные параметры конфигурации:

| Parameter               | Type        | Required | Default   | Valid values     |
| :---------------------- | :---------- | :------- | :-------- | :--------------- |
| `enable_list_inference` | `<boolean>` | no       | `True`    | `True`, `False`  |
| `intermediate_format`   | `<string>`  | no       | `parquet` | `parquet`, `orc` |
| `submission_method`     | `<string>`  | no       | ``        | `serverless`, `bigframes`, `cluster` |
| `notebook_template_id`  | `<Integer>` | no       | ``        | `<NOTEBOOK RUNTIME TEMPLATE_ID>` |
| `compute_region`        | `<string>`  | no       | ``        | `<COMPUTE_REGION>` |
| `gcs_bucket`            | `<string>`  | no       | ``        | `<GCS_BUCKET>` |
| `packages`              | `<string>`  | no       | ``        | `['numpy<=1.1.1', 'pandas', 'mlflow']` |
| `enable_change_history` | `<boolean>` | no       | ``        | `True`, `False`   |

- Параметр `enable_list_inference`  
  - Включает возможность чтения нескольких записей за одну операцию в PySpark DataFrame. По умолчанию установлен в `True` для поддержки стандартного значения `intermediate_format` — `parquet`.

- Параметр `intermediate_format`  
  - Определяет формат файлов, используемый при записи записей в таблицу. Значение по умолчанию — `parquet`.

- Параметр `submission_method`  
  - Определяет, будет ли задание выполняться с использованием BigQuery DataFrames или Serverless Spark. Параметр `submission_method` не требуется, если указан `dataproc_cluster_name`.

- Параметр `notebook_template_id`  
  - Указывает runtime‑шаблон в Colab Enterprise.

- Параметр `compute_region`  
  - Определяет регион выполнения задания.

- Параметр `gcs_bucket`  
  - Указывает GCS‑bucket, используемый для хранения артефактов задания.

- Параметр `enable_change_history`  
  - Включает [функцию change history в BigQuery](https://cloud.google.com/bigquery/docs/change-history), которая отслеживает изменения, внесённые в таблицу BigQuery. При включении эту историю можно использовать для аудита и отладки поведения инкрементальных моделей.

**Связанные материалы:**

- [Dataproc overview](https://cloud.google.com/dataproc/docs/concepts/overview)
- [Create a Dataproc cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster)
- [Create a Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets)
- [PySpark DataFrame syntax](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)


## Ограничения модульных тестов

Вы должны указать все поля в BigQuery `STRUCT` для [модульных тестов](/docs/build/unit-tests). Вы не можете использовать только подмножество полей в `STRUCT`.

