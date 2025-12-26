---
title: "Об инкрементальной стратегии"
sidebar_label: "Инкрементальная стратегия"
description: "Инкрементальные стратегии для материализаций оптимизируют производительность, определяя, как обрабатывать новые и изменённые данные."
id: "incremental-strategy"
intro_text: "Incremental strategies for materializations optimize performance by defining how to handle new and changed data."
---

Существует несколько стратегий для реализации концепции инкрементальных материализаций. Ценность каждой стратегии зависит от:

* Объема данных.
* Надежности вашего `unique_key`.
* Поддержки определенных функций в вашей платформе данных.

Некоторые адаптеры предоставляют необязательную конфигурацию `incremental_strategy`, которая управляет кодом, используемым dbt для построения инкрементальных моделей.

:::info Microbatch

[`microbatch` стратегия инкрементального обновления](/docs/build/incremental-microbatch) предназначена для больших наборов данных временных рядов. dbt будет обрабатывать инкрементальную модель в нескольких запросах (или "пакетах") на основе настроенного столбца `event_time`. В зависимости от объема и характера ваших данных, это может быть более эффективным и устойчивым, чем использование одного запроса для добавления новых данных.

:::

### Поддерживаемые стратегии инкрементального обновления по адаптерам

Эта таблица показывает поддержку каждой инкрементальной стратегии для адаптеров, доступных в <Constant name="cloud" /> на [треке последних релизов](/docs/dbt-versions/cloud-release-tracks). Некоторые стратегии могут быть недоступны, если вы используете не трек **Latest**, и соответствующая функциональность ещё не была выпущена на трек **Compatible**.  

Если вас интересует адаптер, доступный только в <Constant name="core" />, ознакомьтесь с [индивидуальной страницей конфигурации адаптера](/reference/resource-configs/resource-configs) для получения более подробной информации.

Нажмите на название адаптера в таблице ниже, чтобы узнать больше о поддерживаемых инкрементальных стратегиях:

| Data platform adapter | `append` | `merge` | `delete+insert` | `insert_overwrite` | `microbatch`        |
|-----------------------|:--------:|:-------:|:---------------:|:------------------:|:-------------------:|
| [dbt-postgres](/reference/resource-configs/postgres-configs#incremental-materialization-strategies) |     ✅    |    ✅   |  ✅ |   |   ✅   |
| [dbt-redshift](/reference/resource-configs/redshift-configs#incremental-materialization-strategies) |     ✅    |    ✅   |  ✅ |   |   ✅   |
| [dbt-bigquery](/reference/resource-configs/bigquery-configs#merge-behavior-incremental-models)      |           |    ✅   |    | ✅ |  ✅    |
| [dbt-spark](/reference/resource-configs/spark-configs#incremental-models)                           |     ✅    |    ✅   |    |    ✅   | ✅ |
| [dbt-databricks](/reference/resource-configs/databricks-configs#incremental-models)                 |     ✅    |    ✅   |    |          ✅         |          ✅         |
| [dbt-snowflake](/reference/resource-configs/snowflake-configs#merge-behavior-incremental-models)    |     ✅    |    ✅   | ✅  | ✅ | ✅  |
| [dbt-trino](/reference/resource-configs/trino-configs#incremental)                                  |     ✅    |    ✅   | ✅  |    |  ✅  |
| [dbt-fabric](/reference/resource-configs/fabric-configs#incremental)                                |     ✅    |    ✅   | ✅  |    |    |
| [dbt-athena](/reference/resource-configs/athena-configs#incremental-models)                         |     ✅    |    ✅   |     | ✅ | ✅  |
| [dbt-teradata](/reference/resource-configs/teradata-configs#valid_history-incremental-materialization-strategy)  | ✅    |  ✅   |   ✅   |    |         ✅    |

### Настройка стратегии инкрементального обновления

Конфигурация `incremental_strategy` может быть определена как в конкретных моделях, так и для всех моделей в вашем файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
models:
  +incremental_strategy: "insert_overwrite"
```

</File>

или:

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized='incremental',
    unique_key='date_day',
    incremental_strategy='delete+insert',
    ...
  )
}}

select ...
```

</File>

### Конфигурации, специфичные для стратегии

Если вы используете стратегию `merge` и указываете `unique_key`, по умолчанию dbt полностью перезапишет совпадающие строки новыми значениями.

На адаптерах, которые поддерживают стратегию `merge`, вы можете дополнительно передать список имён колонок в конфигурацию `merge_update_columns`. В этом случае dbt будет обновлять **только** те колонки, которые указаны в конфигурации, а значения остальных колонок будут сохранены без изменений.

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized = 'incremental',
    unique_key = 'id',
    merge_update_columns = ['email', 'ip_address'],
    ...
  )
}}

select ...
```

</File>

В качестве альтернативы, вы можете указать список столбцов, которые следует исключить из обновления, передав список имен столбцов в конфигурацию `merge_exclude_columns`.

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized = 'incremental',
    unique_key = 'id',
    merge_exclude_columns = ['created_at'],
    ...
  )
}}

select ...
```

</File>

import Incrementalpredicates from '/snippets/_incremental-predicates.md';

<Incrementalpredicates />

:::info
Синтаксис зависит от того, как вы настраиваете свою `incremental_strategy`:
- Если вы используете стратегию `merge`, вам может потребоваться явно указать псевдонимы для любых столбцов с помощью `DBT_INTERNAL_DEST` ("старые" данные) или `DBT_INTERNAL_SOURCE` ("новые" данные). 
- Существует значительное концептуальное пересечение со стратегией инкрементального обновления `insert_overwrite`.
:::

### Встроенные стратегии

Прежде чем углубляться в [пользовательские стратегии](#custom-strategies), важно понять встроенные стратегии инкрементального обновления в dbt и их соответствующие макросы:

| `incremental_strategy` | Соответствующий макрос                                               |
|------------------------|---------------------------------------------------------------------|
|[`append`](/docs/build/incremental-strategy#append)|`get_incremental_append_sql`|
|[`delete+insert`](/docs/build/incremental-strategy#deleteinsert)| `get_incremental_delete_insert_sql`|
|[`merge` ](/docs/build/incremental-strategy#merge)|`get_incremental_merge_sql`|
|[`insert_overwrite`](/docs/build/incremental-strategy#insert_overwrite)|`get_incremental_insert_overwrite_sql`|
|[`microbatch`](/docs/build/incremental-strategy#microbatch) | `get_incremental_microbatch_sql`       |


Например, встроенная стратегия для `append` может быть определена и использована с помощью следующих файлов:

<File name='macros/append.sql'>

```sql
{% macro get_incremental_append_sql(arg_dict) %}

  {% do return(some_custom_macro_with_sql(arg_dict["target_relation"], arg_dict["temp_relation"], arg_dict["unique_key"], arg_dict["dest_columns"], arg_dict["incremental_predicates"])) %}

{% endmacro %}


{% macro some_custom_macro_with_sql(target_relation, temp_relation, unique_key, dest_columns, incremental_predicates) %}

    {%- set dest_cols_csv = get_quoted_csv(dest_columns | map(attribute="name")) -%}

    insert into {{ target_relation }} ({{ dest_cols_csv }})
    (
        select {{ dest_cols_csv }}
        from {{ temp_relation }}
    )

{% endmacro %}
```
</File>

Определите модель models/my_model.sql:

```sql
{{ config(
    materialized="incremental",
    incremental_strategy="append",
) }}

select * from {{ ref("some_model") }}
```

#### О встроенных инкрементальных стратегиях

##### `append`

Стратегия `append` проста в реализации и имеет низкие вычислительные затраты. Она вставляет выбранные записи в целевую таблицу, не обновляя и не удаляя уже существующие данные. Эта стратегия напрямую не соответствует [медленно изменяющимся измерениям](https://www.thoughtspot.com/data-trends/data-modeling/slowly-changing-dimensions-in-data-warehouse) (Slowly Changing Dimensions, SCD) типа 1 или 2. Она отличается от SCD1, где существующие записи перезаписываются, и лишь отдалённо напоминает SCD2. Хотя она добавляет новые строки (как SCD2), в ней отсутствует управление версиями и явное отслеживание исторических изменений.

Важно отметить, что `append` не проверяет наличие дубликатов и не определяет, существует ли запись уже в целевой таблице. Если одна и та же запись появляется в источнике несколько раз, она будет вставлена повторно, что потенциально приведёт к появлению дублирующихся строк. В зависимости от сценария использования и требований к качеству данных это может быть допустимо.

##### `delete+insert`

Стратегия `delete+insert` удаляет данные с указанным `unique_key` из целевой таблицы, а затем вставляет данные с тем же `unique_key`. Для больших наборов данных это может быть менее эффективно. Такой подход гарантирует, что обновлённые записи полностью заменяются, без частичных обновлений, и может быть полезен, если `unique_key` на самом деле не является уникальным или если `merge` не поддерживается.

`delete+insert` не соответствует напрямую логике SCD (ни типу 1, ни типу 2), так как данные перезаписываются, а история изменений не отслеживается.

Для реализации SCD2 используйте [dbt snapshots](/docs/build/snapshots#what-are-snapshots), а не `delete+insert`.

##### `merge`

Стратегия `merge` вставляет записи с `unique_key`, которых ещё нет в целевой таблице, и обновляет записи с ключами, которые уже существуют &mdash; тем самым повторяя логику SCD1, где изменения перезаписываются, а не сохраняются как история.

Эту стратегию не следует путать с `delete+insert`, которая сначала удаляет совпадающие записи, а затем вставляет новые.

При указании `unique_key` (который может состоять из одного или нескольких столбцов) `merge` также помогает устранять дубликаты. Если `unique_key` уже существует в целевой таблице, `merge` обновит запись, и дубликаты не появятся. Если записи не существуют, `merge` вставит их.

Обратите внимание: если использовать `merge` без указания `unique_key`, он будет вести себя так же, как стратегия `append`.

Хотя стратегия `merge` удобна для поддержания таблиц в актуальном состоянии, она лучше всего подходит для небольших таблиц или инкрементальных наборов данных. Для больших таблиц она может быть дорогостоящей, так как требуется сканирование всей целевой таблицы, чтобы определить, какие записи нужно обновить или вставить.

##### `insert_overwrite`

Стратегия [`insert_overwrite`](https://downloads.apache.org/spark/docs/3.1.1/sql-ref-syntax-dml-insert-overwrite-table.html) используется для эффективного обновления партиционированных таблиц путём замены целых партиций новыми данными, а не слияния или обновления отдельных строк. Она перезаписывает только затронутые партиции, а не всю таблицу целиком.

Поскольку эта стратегия предназначена для партиционированных данных и полностью заменяет целые партиции, она не соответствует типичной логике SCD, где отслеживаются изменения или история на уровне строк.

Она идеально подходит для таблиц, партиционированных по дате или другому ключу, и полезна для обновления недавних или скорректированных данных без полной пересборки таблицы.

##### `microbatch`

[`microbatch`](/docs/build/incremental-microbatch#what-is-microbatch-in-dbt) — это инкрементальная стратегия, предназначенная для обработки больших временных рядов путём разбиения данных на временные батчи (например, по дням или по часам). Она поддерживает [параллельное выполнение батчей](/docs/build/parallel-batch-execution#how-parallel-batch-execution-works), что позволяет ускорить выполнение.

Подробную информацию о том, какие инкрементальные стратегии поддерживаются каждым адаптером, см. в разделе [Supported incremental strategies by adapter](/docs/build/incremental-strategy#supported-incremental-strategies-by-adapter).

### Пользовательские стратегии

:::note ограниченная поддержка

Пользовательские стратегии в настоящее время не поддерживаются на адаптерах BigQuery и Spark.

:::

Начиная с dbt v1.2 и далее, пользователи имеют более простую альтернативу [созданию совершенно новой материализации](/guides/create-new-materializations). Они определяют и используют свои собственные "пользовательские" стратегии инкрементального обновления, выполняя следующие шаги:

1. Определите макрос с именем `get_incremental_STRATEGY_sql`. Обратите внимание, что `STRATEGY` является заполнителем, и вы должны заменить его на имя вашей пользовательской стратегии инкрементального обновления.
2. Настройте `incremental_strategy: STRATEGY` в инкрементальной модели.

dbt не будет проверять пользовательские стратегии, он просто будет искать макрос с таким именем и выдаст ошибку, если не сможет его найти.

Например, пользовательская стратегия с именем `insert_only` может быть определена и использована с помощью следующих файлов:

<File name='macros/my_custom_strategies.sql'>

```sql
{% macro get_incremental_insert_only_sql(arg_dict) %}

  {% do return(some_custom_macro_with_sql(arg_dict["target_relation"], arg_dict["temp_relation"], arg_dict["unique_key"], arg_dict["dest_columns"], arg_dict["incremental_predicates"])) %}

{% endmacro %}


{% macro some_custom_macro_with_sql(target_relation, temp_relation, unique_key, dest_columns, incremental_predicates) %}

    {%- set dest_cols_csv = get_quoted_csv(dest_columns | map(attribute="name")) -%}

    insert into {{ target_relation }} ({{ dest_cols_csv }})
    (
        select {{ dest_cols_csv }}
        from {{ temp_relation }}
    )

{% endmacro %}
```

</File>

<File name='models/my_model.sql'>

```sql
{{ config(
    materialized="incremental",
    incremental_strategy="insert_only",
    ...
) }}

...
```

</File>

Если вы используете пользовательский макрос microbatch, установите [флаг поведения `require_batched_execution_for_custom_microbatch_strategy`](/reference/global-configs/behavior-changes#custom-microbatch-strategy) в вашем `dbt_project.yml`, чтобы включить пакетное выполнение вашей пользовательской стратегии. 

### Пользовательские стратегии из пакета

Чтобы использовать пользовательскую стратегию инкрементального обновления `merge_null_safe` из пакета `example`:
- [Установите пакет](/docs/build/packages#how-do-i-add-a-package-to-my-project)
- Добавьте следующий макрос в ваш проект:

<File name='macros/my_custom_strategies.sql'>

```sql
{% macro get_incremental_merge_null_safe_sql(arg_dict) %}
    {% do return(example.get_incremental_merge_null_safe_sql(arg_dict)) %}
{% endmacro %}
```

</File>

<Snippet path="discourse-help-feed-header" />
<DiscourseHelpFeed tags="incremental"/>