---
title: "Конфигурации BigQuery"
description: "Прочитайте это руководство, чтобы понять конфигурации BigQuery в dbt."
id: "bigquery-configs"
---

## Использование `project` и `dataset` в конфигурациях

- `schema` является взаимозаменяемым с концепцией `dataset` в BigQuery.
- `database` является взаимозаменяемым с концепцией `project` в BigQuery.

В нашей справочной документации вы можете объявить `project` вместо `database`. Это позволит вам читать и записывать данные из нескольких проектов BigQuery. То же самое касается `dataset`.

## Использование партиционирования и кластеризации таблиц

### Клаузула партиционирования

BigQuery поддерживает использование [клаузулы partition by](https://cloud.google.com/bigquery/docs/data-definition-language#specifying_table_partitioning_options) для легкого партиционирования <Term id="table" /> по столбцу или выражению. Эта опция может помочь уменьшить задержку и стоимость при запросах к большим таблицам. Обратите внимание, что обрезка партиций [работает только](https://cloud.google.com/bigquery/docs/querying-partitioned-tables#use_a_constant_filter_expression) при фильтрации партиций с использованием литералов (поэтому выбор партиций с использованием <Term id="subquery" /> не улучшит производительность).

Конфигурация `partition_by` может быть предоставлена в виде словаря со следующим форматом:

```python
{
  "field": "<имя поля>",
  "data_type": "<timestamp | date | datetime | int64>",
  "granularity": "<hour | day | month | year>"

  # Обязательно, если data_type - "int64"
  "range": {
    "start": <int>,
    "end": <int>,
    "interval": <int>
  }
}
```

#### Партиционирование по дате или временной метке

При использовании столбца `datetime` или `timestamp` для партиционирования данных вы можете создавать партиции с гранулярностью в час, день, месяц или год. Столбец `date` поддерживает гранулярность в день, месяц и год. Ежедневное партиционирование является значением по умолчанию для всех типов столбцов.

Если `data_type` указан как `date`, а гранулярность - день, dbt будет предоставлять поле как есть при конфигурировании партиционирования таблицы.

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

#### Партиционирование по дате или временной метке "ингеста"

BigQuery поддерживает [старый механизм партиционирования](https://cloud.google.com/bigquery/docs/partitioned-tables#ingestion_time), основанный на времени, когда каждая строка была загружена. Хотя мы рекомендуем использовать более новый и удобный подход к партиционированию, когда это возможно, для очень больших наборов данных могут быть некоторые улучшения производительности при использовании этого старого, более механистического подхода. [Читать больше о стратегии инкрементного обновления `insert_overwrite` ниже](#copying-ingestion-time-partitions).

dbt всегда будет указывать BigQuery партиционировать вашу таблицу по значениям столбца, указанного в `partition_by.field`. Настроив вашу модель с `partition_by.time_ingestion_partitioning`, установленным в `True`, dbt будет использовать этот столбец в качестве входа для псевдостолбца `_PARTITIONTIME`. В отличие от более новых подходов к партиционированию по столбцам, вы должны убедиться, что значения вашего столбца партиционирования точно соответствуют временной гранулярности ваших партиций.

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

#### Партиционирование с помощью целочисленных бакетов

Если `data_type` указан как `int64`, то ключ `range` также должен быть предоставлен в словаре `partition_by`. dbt будет использовать значения, предоставленные в словаре `range`, для генерации клаузулы партиционирования для таблицы.

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

#### Дополнительные конфигурации партиционирования

Если ваша модель имеет настроенное `partition_by`, вы можете дополнительно указать две конфигурации:

- `require_partition_filter` (логическое): Если установлено в `true`, любой, кто запрашивает эту модель, _должен_ указать фильтр партиции, в противном случае их запрос завершится неудачей. Это рекомендуется для очень больших таблиц с очевидными схемами партиционирования, такими как потоки событий, сгруппированные по дням. Обратите внимание, что это повлияет и на другие модели dbt или тесты, которые пытаются выбрать из этой модели.

- `partition_expiration_days` (целое): Если установлено для партиций типа даты или временной метки, партиция истечет через указанное количество дней после даты, которую она представляет. Например, партиция, представляющая `2021-01-01`, установленная на истечение через 7 дней, больше не будет доступна для запросов с `2021-01-08`, ее стоимость хранения будет обнулена, и ее содержимое в конечном итоге будет удалено. Обратите внимание, что [истечение таблицы](#controlling-table-expiration) будет иметь приоритет, если оно указано.

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

### Клаузула кластеризации

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

[Управляемые клиентом ключи шифрования](https://cloud.google.com/bigquery/docs/customer-managed-encryption) могут быть настроены для таблиц BigQuery с использованием конфигурации модели `kms_key_name`.

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

Метки в виде пар ключ-значение, превышающие 63 символа, будут обрезаны.

**Конфигурирование меток в файле модели**

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

**Конфигурирование меток в dbt_project.yml**

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
Теги таблиц и представлений BigQuery могут быть созданы, предоставив пустую строку для значения метки.

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

Метка с ключом, имеющим пустое значение, также может быть [упомянута](https://cloud.google.com/bigquery/docs/adding-labels#adding_a_label_without_a_value) как тег в BigQuery. Однако это не следует путать с [ресурсом тегов](https://cloud.google.com/bigquery/docs/tags), который условно применяет IAM-политики к таблицам и наборам данных BigQuery. Узнайте больше в [метках и тегах](https://cloud.google.com/resource-manager/docs/tags/tags-overview).

В настоящее время невозможно применять IAM-теги в BigQuery, однако вы можете высказать свое мнение, проголосовав за [проблему на GitHub 1134](https://github.com/dbt-labs/dbt-bigquery/issues/1134).

### Политические теги
BigQuery позволяет устанавливать [безопасность на уровне столбцов](https://cloud.google.com/bigquery/docs/column-level-security-intro) с помощью установки [политических тегов](https://cloud.google.com/bigquery/docs/best-practices-policy-tags) на определенные столбцы.

dbt включает эту функцию как свойство ресурса столбца `policy_tags` (не конфигурация узла).

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

Обратите внимание, что для того чтобы политические теги вступили в силу, [документация на уровне столбцов](/reference/resource-configs/persist_docs) должна быть включена для модели, семени или снимка. Рассмотрите возможность использования [переменных](/docs/build/project-variables) для управления таксономиями и убедитесь, что вы добавили необходимые [роли](https://cloud.google.com/bigquery/docs/column-level-security-intro#roles) к ключу службы BigQuery.

## Поведение слияния (инкрементальные модели)

Конфигурация [`incremental_strategy`](/docs/build/incremental-strategy) управляет тем, как dbt строит инкрементальные модели. dbt использует [оператор merge](https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax) в BigQuery для обновления инкрементальных таблиц.

Конфигурация `incremental_strategy` может быть установлена на одно из следующих значений:
- `merge` (по умолчанию)
- `insert_overwrite`
- [`microbatch`](/docs/build/incremental-microbatch)

### Производительность и стоимость

Операции, выполняемые dbt при построении инкремальной модели BigQuery, могут быть сделаны дешевле и быстрее с помощью [клаузулы кластеризации](#clustering-clause) в конфигурации вашей модели. См. [это руководство](https://discourse.getdbt.com/t/benchmarking-incremental-strategies-on-bigquery/981) для получения дополнительной информации о настройке производительности для инкремальных моделей BigQuery.

**Примечание:** Эти преимущества производительности и стоимости применимы к инкрементальным моделям, построенным как с помощью стратегии `merge`, так и с помощью стратегии `insert_overwrite`.

### Стратегия `merge`
Стратегия инкрементального обновления `merge` сгенерирует оператор `merge`, который будет выглядеть примерно так:

```merge
merge into {{ destination_table }} DEST
using ({{ model_sql }}) SRC
on SRC.{{ unique_key }} = DEST.{{ unique_key }}

when matched then update ...
when not matched then insert ...
```

Подход "слияния" автоматически обновляет новые данные в целевой инкрементальной таблице, но требует сканирования всех исходных таблиц, упомянутых в SQL модели, а также целевых таблиц. Это может быть медленным и дорогим для больших объемов данных. Упомянутые ранее [техники партиционирования и кластеризации](#using-table-partitioning-and-clustering) могут помочь смягчить эти проблемы.

**Примечание:** Конфигурация `unique_key` обязательна при выборе стратегии инкрементального обновления `merge`.

### Стратегия `insert_overwrite`

Стратегия `insert_overwrite` генерирует оператор merge, который заменяет целые партиции в целевой таблице. **Примечание:** эта конфигурация требует, чтобы модель была настроена с [клаузой партиционирования](#partition-clause). Оператор `merge`, который dbt генерирует при выборе стратегии `insert_overwrite`, выглядит примерно так:

```sql
/*
  Создание временной таблицы из SQL модели
*/
create temporary table {{ model_name }}__dbt_tmp as (
  {{ model_sql }}
);

/*
  Если применимо, определите партиции для замены, запрашивая временную таблицу.
*/

declare dbt_partitions_for_replacement array<date>;
set (dbt_partitions_for_replacement) = (
    select as struct
        array_agg(distinct date(max_tstamp))
    from `my_project`.`my_dataset`.{{ model_name }}__dbt_tmp
);

/*
  Замените партиции в целевой таблице, которые соответствуют
  партициям во временной таблице
*/
merge into {{ destination_table }} DEST
using {{ model_name }}__dbt_tmp SRC
on FALSE

when not matched by source and {{ partition_column }} in unnest(dbt_partitions_for_replacement)
then delete

when not matched then insert ...
```

Для полного описания механики этого подхода смотрите [этот пост-объяснитель](https://discourse.getdbt.com/t/bigquery-dbt-incremental-changes/982).

#### Определение партиций для замены

dbt может динамически определять партиции для замены из значений, присутствующих во временной таблице, или статически, используя конфигурацию, предоставленную пользователем.

"Динамический" подход является самым простым (и значением по умолчанию), но "статический" подход снизит затраты, устранив несколько запросов в скрипте сборки модели.

#### Статические партиции

Чтобы предоставить статический список партиций для замены, используйте конфигурацию `partitions`.

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

Эта модель служит для замены данных в целевой таблице как для _сегодня_, так и для _вчера_ каждый раз, когда она выполняется. Это самый быстрый и дешевый способ инкрементально обновить таблицу с помощью dbt. Если бы мы хотели, чтобы это выполнялось более динамично — скажем, всегда за последние 3 дня — мы могли бы использовать встроенные [макросы datetime](https://github.com/dbt-labs/dbt-core/blob/dev/octavius-catto/core/dbt/include/global_project/macros/etc/datetime.sql) dbt и написать несколько своих.

Думайте об этом как о режиме "полного контроля". Вы должны убедиться, что выражения или литералы в конфигурации `partitions` имеют правильные кавычки при шаблонизации и что они соответствуют `partition_by.data_type` (`timestamp`, `datetime`, `date` или `int64`). В противном случае фильтр в инкрементальном операторе `merge` вызовет ошибку.

#### Динамические партиции

Если конфигурация `partitions` не предоставлена, dbt вместо этого:

1. Создает временную таблицу для вашего SQL модели
2. Запрашивает временную таблицу, чтобы найти уникальные партиции, которые нужно заменить
3. Запрашивает целевую таблицу, чтобы найти _максимальную_ партицию в базе данных

При построении вашего SQL модели вы можете воспользоваться интроспекцией, выполняемой dbt, чтобы фильтровать только _новые_ данные. Максимальное значение в поле партиционирования в целевой таблице будет доступно с использованием переменной скрипта BigQuery `_dbt_max_partition`. **Примечание:** это переменная SQL BigQuery, а не переменная Jinja dbt, поэтому для доступа к этой переменной не требуются фигурные скобки jinja.

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

    -- пересчитать данные последнего дня + предыдущие
    -- ПРИМЕЧАНИЕ: Переменная _dbt_max_partition используется для интроспекции целевой таблицы
    where date(event_timestamp) >= date_sub(date(_dbt_max_partition), interval 1 day)

{% endif %}

),

... остальная часть модели ...
```

#### Копирование партиций

Если вы заменяете целые партиции в своих инкрементальных запусках, вы можете выбрать сделать это с помощью [API копирования таблицы](https://cloud.google.com/bigquery/docs/managing-tables#copy-table) и декораторов партиций, а не с помощью оператора `merge`. Хотя этот механизм не предлагает такой же видимости и простоты отладки, как оператор SQL `merge`, он может обеспечить значительную экономию времени и затрат для больших наборов данных, поскольку API копирования таблицы не несет никаких затрат на вставку данных - это эквивалентно команде интерфейса командной строки (CLI) `bq cp`.

Вы можете включить это, включив `copy_partitions: True` в конфигурации `partition_by`. Этот подход работает только в сочетании с "динамической" заменой партиций.

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
[0m16:03:13.017641 [debug] [Thread-3 (]: Адаптер BigQuery: Копирование таблицы(ц) "/projects/projectname/datasets/analytics/tables/bigquery_table__dbt_tmp$20230112" в "/projects/projectname/datasets/analytics/tables/bigquery_table$20230112" с условием: "WRITE_TRUNCATE"
...
```

</File>

## Контроль истечения таблицы

По умолчанию таблицы, созданные dbt, никогда не истекают. Вы можете настроить определенные модели на истечение через установленное количество часов, установив `hours_to_expiration`.

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

Если для модели, материализованной как представление, указана конфигурация `grant_access_to`, dbt предоставит модели представления доступ для выбора из предоставленного списка наборов данных. См. [документацию BQ по авторизованным представлениям](https://cloud.google.com/bigquery/docs/share-access-views) для получения дополнительных сведений.

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

Представления с этой конфигурацией смогут выбирать объекты в `project_1.dataset_1` и `project_2.dataset_2`, даже когда они находятся в другом месте и запрашиваются пользователями, которые в противном случае не имеют доступа к `project_1.dataset_1` и `project_2.dataset_2`.

## Материализованные представления

Адаптер BigQuery поддерживает [материализованные представления](https://cloud.google.com/bigquery/docs/materialized-views-intro) с следующими параметрами конфигурации:

| Параметр                                                                        | Тип                   | Обязательно | По умолчанию | Поддержка мониторинга изменений |
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
        # только если `data_type` 'int64'
      - range:
        - start: <integer>
        - end: <integer>
        - interval: <integer>
    [+](/reference/resource-configs/plus-prefix)[enable_refresh](#auto-refresh): true | false
    [+](/reference/resource-configs/plus-prefix)[refresh_interval_minutes](#auto-refresh): <float>
    [+](/reference/resource-configs/plus-prefix)[max_staleness](#auto-refresh): <interval>
    [+](/reference/resource-configs/plus-prefix)[description](/reference/resource-properties/description): <string>
    [+](/reference/resource-configs/plus-prefix)[labels](#specifying-labels): {<label-name>: <label-value>}
    [+](/reference/resource-configs/plus-prefix)[hours_to_expiration](#controlling-table-expiration): <integer>
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
          # только если `data_type` 'int64'
        - range:
          - start: <integer>
          - end: <integer>
          - interval: <integer>
      [enable_refresh](#auto-refresh): true | false
      [refresh_interval_minutes](#auto-refresh): <float>
      [max_staleness](#auto-refresh): <interval>
      [description](/reference/resource-properties/description): <string>
      [labels](#specifying-labels): {<label-name>: <label-value>}
      [hours_to_expiration](#controlling-table-expiration): <integer>
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

        # только если `data_type` 'int64'
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
    [hours_to_expiration](#controlling-table-expiration)=<integer>,
    [kms_key_name](##using-kms-encryption)="<path_to_key>",
) }}
```

</File>

</TabItem>

</Tabs>

Многие из этих параметров соответствуют их таблицам и были связаны выше.
Набор параметров, уникальных для материализованных представлений, охватывает [функциональность автообновления](#auto-refresh).

Узнайте больше о этих параметрах в документации BigQuery:
- [CREATE MATERIALIZED VIEW statement](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#create_materialized_view_statement)
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)

### Автообновление

| Параметр                    | Тип         | Обязательно | По умолчанию | Поддержка мониторинга изменений |
|------------------------------|--------------|----------|---------|---------------------------|
| `enable_refresh`             | `<boolean>`  | нет       | `true`  | alter                     |
| `refresh_interval_minutes`   | `<float>`    | нет       | `30`    | alter                     |
| `max_staleness` (в предварительном просмотре) | `<interval>` | нет       | `none`  | alter                     |

BigQuery поддерживает [автоматическое обновление](https://cloud.google.com/bigquery/docs/materialized-views-manage#automatic_refresh) для материализованных представлений.
По умолчанию материализованное представление будет автоматически обновляться в течение 5 минут после изменений в базовой таблице, но не чаще одного раза каждые 30 минут.
BigQuery официально поддерживает только настройку частоты (частота "раз в 30 минут");
однако есть функция в предварительном просмотре, которая позволяет настраивать устаревание (обновление "раз в 5 минут").
dbt будет отслеживать эти параметры на предмет изменений и применять их с помощью оператора `ALTER`.

Узнайте больше о этих параметрах в документации BigQuery:
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)
- [max_staleness](https://cloud.google.com/bigquery/docs/materialized-views-create#max_staleness)

### Ограничения

Как и на большинстве платформ данных, существуют ограничения, связанные с материализованными представлениями. Некоторые из них стоит отметить:

- SQL материализованного представления имеет [ограниченный набор функций](https://cloud.google.com/bigquery/docs/materialized-views-create#supported-mvs).
- SQL материализованного представления не может быть обновлено; материализованное представление должно пройти через `--full-refresh` (DROP/CREATE).
- Клаузула `partition_by` в материализованном представлении должна соответствовать таковой в базовой таблице.
- Хотя материализованные представления могут иметь описания, *столбцы* материализованного представления не могут.
- Воссоздание/удаление базовой таблицы требует воссоздания/удаления материализованного представления.

Узнайте больше о ограничениях материализованных представлений в документации Google BigQuery [docs](https://cloud.google.com/bigquery/docs/materialized-views-intro#limitations).

## Модели Python

Адаптер BigQuery поддерживает модели Python с следующими дополнительными параметрами конфигурации:

| Параметр               | Тип        | Обязательно | По умолчанию   | Допустимые значения     |
|-------------------------|-------------|----------|-----------|------------------|
| `enable_list_inference` | `<boolean>` | нет       | `True`    | `True`, `False`  |
| `intermediate_format`   | `<string>`  | нет       | `parquet` | `parquet`, `orc` |

### Параметр `enable_list_inference`
Параметр `enable_list_inference` позволяет фрейму данных PySpark читать несколько записей в одной операции.
По умолчанию это значение установлено в `True`, чтобы поддерживать значение по умолчанию `intermediate_format` как `parquet`.

### Параметр `intermediate_format`
Параметр `intermediate_format` указывает, какой формат файла использовать при записи записей в таблицу. По умолчанию используется `parquet`.

<VersionBlock firstVersion="1.8">

## Ограничения юнит-тестов

Вы должны указать все поля в `STRUCT` BigQuery для [юнит-тестов](/docs/build/unit-tests). Вы не можете использовать только подмножество полей в `STRUCT`.

</VersionBlock>