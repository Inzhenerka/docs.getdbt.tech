---
title: "Конфигурации BigQuery"
description: "Прочтите это руководство, чтобы понять конфигурации BigQuery в dbt."
id: "bigquery-configs"
---

<!----
To-do:
- use the reference doc structure for this article/split into separate articles
--->

## Использование `project` и `dataset` в конфигурациях

- `schema` взаимозаменяемо с понятием BigQuery `dataset`
- `database` взаимозаменяемо с понятием BigQuery `project`

Для нашей справочной документации вы можете объявить `project` вместо `database`. Это позволит вам читать и записывать данные из нескольких проектов BigQuery. То же самое касается `dataset`.

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
  customer_id,
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

Конфигурация `labels` может быть предоставлена в конфигурации модели или в файле `dbt_project.yml`, как показано ниже.

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

### Указание тегов
Таблицы и представления BigQuery могут иметь *теги*, создаваемые путем указания пустой строки для значения метки.

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

Вы можете создать новую метку без значения или удалить значение из существующего ключа метки.

Метка с ключом, у которого пустое значение, также может быть [упомянута](https://cloud.google.com/bigquery/docs/adding-labels#adding_a_label_without_a_value) как тег в BigQuery. Однако это не следует путать с [ресурсом тега](https://cloud.google.com/bigquery/docs/tags), который условно применяет политики IAM к таблицам и наборам данных BigQuery. Узнайте больше в [метках и тегах](https://cloud.google.com/resource-manager/docs/tags/tags-overview).

В настоящее время невозможно применять теги IAM в BigQuery, однако вы можете высказать свое мнение, проголосовав за [GitHub issue 1134](https://github.com/dbt-labs/dbt-bigquery/issues/1134).

### Политические теги
BigQuery позволяет [безопасность на уровне столбцов](https://cloud.google.com/bigquery/docs/column-level-security-intro) путем установки [политических тегов](https://cloud.google.com/bigquery/docs/best-practices-policy-tags) на конкретные столбцы.

dbt включает эту функцию как свойство ресурса столбца, `policy_tags` (_не_ конфигурация узла).

<File name='models/<filename>.yml'>

```yaml
version: 2

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

Думайте об этом как о режиме "полного контроля". Вы должны убедиться, что выражения или литеральные значения в конфигурации `partitions` имеют правильные кавычки при шаблонизации и что они соответствуют `partition_by.data_type` (`timestamp`, `datetime`, `date` или `int64`). В противном случае фильтр в инкрементальном операторе `merge` вызовет ошибку.

#### Динамические разделы

Если конфигурация `partitions` не предоставлена, dbt вместо этого:

1. Создаст временную таблицу для вашего SQL модели
2. Запросит временную таблицу, чтобы найти уникальные разделы для перезаписи
3. Запросит целевую таблицу, чтобы найти _максимальный_ раздел в базе данных

При построении вашего SQL модели вы можете воспользоваться introspection, выполненной dbt, чтобы фильтровать только _новые_ данные. Максимальное значение в поле разбиения в целевой таблице будет доступно с использованием переменной сценария BigQuery `_dbt_max_partition`. **Примечание:** это переменная SQL BigQuery, а не переменная Jinja dbt, поэтому для доступа к этой переменной не требуются скобки jinja.

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
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`             | нет       | `apply` | н/д                       |
| [`cluster_by`](#clustering-clause)                                               | `[<string>]`           | нет       | `none`  | drop/create               |
| [`partition_by`](#partition-clause)                                              | `{<dictionary>}`       | нет       | `none`  | drop/create               |
| [`enable_refresh`](#auto-refresh)                                                | `<boolean>`            | нет       | `true`  | alter                     |
| [`refresh_interval_minutes`](#auto-refresh)                                      | `<float>`              | нет       | `30`    | alter                     |
| [`max_staleness`](#auto-refresh) (в предварительном просмотре)                   | `<interval>`           | нет       | `none`  | alter                     |
| [`description`](/reference/resource-properties/description)                      | `<string>`             | нет       | `none`  | alter                     |
| [`labels`](#specifying-labels)                                                   | `{<string>: <string>}` | нет       | `none`  | alter                     |
| [`hours_to_expiration`](#controlling-table-expiration)                           | `<integer>`            | нет       | `none`  | alter                     |
| [`kms_key_name`](#using-kms-encryption)                                          | `<string>`             | нет       | `none`  | alter                     |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Блок конфигурации', value: 'config', },
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
    [+](/reference/resource-configs/plus-prefix)[hours_to_expiration](#acontrolling-table-expiration): <integer>
    [+](/reference/resource-configs/plus-prefix)[kms_key_name](##using-kms-encryption): <path-to-key>
```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

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

## Модели на Python

Адаптер BigQuery поддерживает модели на Python с следующими дополнительными параметрами конфигурации:

| Параметр               | Тип        | Обязательный | По умолчанию   | Допустимые значения     |
|-------------------------|-------------|----------|-----------|------------------|
| `enable_list_inference` | `<boolean>` | нет       | `True`    | `True`, `False`  |
| `intermediate_format`   | `<string>`  | нет       | `parquet` | `parquet`, `orc` |

### Параметр `enable_list_inference`
Параметр `enable_list_inference` позволяет PySpark data frame читать несколько записей в одной операции. По умолчанию он установлен в `True`, чтобы поддерживать формат `parquet` по умолчанию.

### Параметр `intermediate_format`
Параметр `intermediate_format` указывает, какой формат файла использовать при записи записей в таблицу. По умолчанию используется `parquet`.

<VersionBlock firstVersion="1.8">

## Ограничения модульных тестов

Вы должны указать все поля в BigQuery `STRUCT` для [модульных тестов](/docs/build/unit-tests). Вы не можете использовать только подмножество полей в `STRUCT`.

</VersionBlock>