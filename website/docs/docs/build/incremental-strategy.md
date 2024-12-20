---
title: "О стратегии инкрементального обновления"
description: "Узнайте о различных способах (стратегиях) реализации инкрементальных материализаций."
id: "incremental-strategy"
---

Существует несколько стратегий для реализации концепции инкрементальных материализаций. Ценность каждой стратегии зависит от:

* Объема данных.
* Надежности вашего `unique_key`.
* Поддержки определенных функций в вашей платформе данных.

Некоторые адаптеры предоставляют необязательную конфигурацию `incremental_strategy`, которая управляет кодом, используемым dbt для построения инкрементальных моделей.

:::info Microbatch <Lifecycle status="beta" />

[`microbatch` стратегия инкрементального обновления](/docs/build/incremental-microbatch) предназначена для больших наборов данных временных рядов. dbt будет обрабатывать инкрементальную модель в нескольких запросах (или "пакетах") на основе настроенного столбца `event_time`. В зависимости от объема и характера ваших данных, это может быть более эффективным и устойчивым, чем использование одного запроса для добавления новых данных.

:::

### Поддерживаемые стратегии инкрементального обновления по адаптерам

Эта таблица представляет доступность каждой стратегии инкрементального обновления на основе последней версии dbt Core и каждого адаптера.

Нажмите на название адаптера в таблице ниже для получения дополнительной информации о поддерживаемых стратегиях инкрементального обновления.

| Адаптер платформы данных | `append` | `merge` | `delete+insert` | `insert_overwrite` | `microbatch` <Lifecycle status="beta"/> |
|--------------------------|:--------:|:-------:|:---------------:|:------------------:|:-------------------:|
| [dbt-postgres](/reference/resource-configs/postgres-configs#incremental-materialization-strategies) |     ✅    |    ✅   |        ✅        |                    |      ✅            |
| [dbt-redshift](/reference/resource-configs/redshift-configs#incremental-materialization-strategies) |     ✅    |    ✅   |        ✅        |                    |      ✅        |
| [dbt-bigquery](/reference/resource-configs/bigquery-configs#merge-behavior-incremental-models)      |           |    ✅   |                 |          ✅         |      ✅            |
| [dbt-spark](/reference/resource-configs/spark-configs#incremental-models)                           |     ✅    |    ✅   |                 |          ✅         |      ✅            |
| [dbt-databricks](/reference/resource-configs/databricks-configs#incremental-models)                 |     ✅    |    ✅   |                 |          ✅         |          ✅         |
| [dbt-snowflake](/reference/resource-configs/snowflake-configs#merge-behavior-incremental-models)    |     ✅    |    ✅   |        ✅        |                    |      ✅            |
| [dbt-trino](/reference/resource-configs/trino-configs#incremental)                                  |     ✅    |    ✅   |        ✅        |                    |                    |
| [dbt-fabric](/reference/resource-configs/fabric-configs#incremental)                                |     ✅    |         |        ✅          |                    |                    |
| [dbt-athena](/reference/resource-configs/athena-configs#incremental-models)                         |     ✅    |    ✅   |                 |          ✅         |                    |

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

На адаптерах, которые поддерживают стратегию `merge` (включая Snowflake, BigQuery, Apache Spark и Databricks), вы можете дополнительно передать список имен столбцов в конфигурацию `merge_update_columns`. В этом случае dbt обновит _только_ столбцы, указанные в конфигурации, и сохранит предыдущие значения других столбцов.

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

### О `incremental_predicates`

`incremental_predicates` — это продвинутое использование инкрементальных моделей, когда объем данных достаточно велик, чтобы оправдать дополнительные инвестиции в производительность. Эта конфигурация принимает список любых допустимых SQL-выражений. dbt не проверяет синтаксис SQL-выражений.

Пример конфигурации модели в файле `yml`, который вы можете ожидать увидеть в Snowflake:

```yml

models:
  - name: my_incremental_model
    config:
      materialized: incremental
      unique_key: id
      # это повлияет на то, как данные хранятся на диске и индексируются для ограничения сканирования
      cluster_by: ['session_start']  
      incremental_strategy: merge
      # это ограничивает сканирование существующей таблицы последними 7 днями данных
      incremental_predicates: ["DBT_INTERNAL_DEST.session_start > dateadd(day, -7, current_date)"]
      # `incremental_predicates` принимает список SQL-выражений. 
      # `DBT_INTERNAL_DEST` и `DBT_INTERNAL_SOURCE` — это стандартные псевдонимы для целевой таблицы и временной таблицы соответственно во время инкрементального запуска с использованием стратегии merge. 
```

В качестве альтернативы, вот те же конфигурации, настроенные в файле модели:

```sql
-- в models/my_incremental_model.sql

{{
  config(
    materialized = 'incremental',
    unique_key = 'id',
    cluster_by = ['session_start'],  
    incremental_strategy = 'merge',
    incremental_predicates = [
      "DBT_INTERNAL_DEST.session_start > dateadd(day, -7, current_date)"
    ]
  )
}}

...

```

Это создаст (в файле `dbt.log`) оператор `merge` вида:
```sql
merge into <existing_table> DBT_INTERNAL_DEST
    from <temp_table_with_new_records> DBT_INTERNAL_SOURCE
    on
        -- уникальный ключ
        DBT_INTERNAL_DEST.id = DBT_INTERNAL_SOURCE.id
        and
        -- пользовательский предикат: ограничивает сканирование данных в "старых" данных / существующей таблице
        DBT_INTERNAL_DEST.session_start > dateadd(day, -7, current_date)
    when matched then update ...
    when not matched then insert ...
```

Ограничьте сканирование данных _входящих_ таблиц в теле их инкрементальной модели SQL, что ограничит количество "новых" данных, обрабатываемых/трансформируемых.

```sql
with large_source_table as (

    select * from {{ ref('large_source_table') }}
    {% if is_incremental() %}
        where session_start >= dateadd(day, -3, current_date)
    {% endif %}

),

...
```

:::info
Синтаксис зависит от того, как вы настраиваете свою `incremental_strategy`:
- Если вы используете стратегию `merge`, вам может потребоваться явно указать псевдонимы для любых столбцов с помощью `DBT_INTERNAL_DEST` ("старые" данные) или `DBT_INTERNAL_SOURCE` ("новые" данные). 
- Существует значительное концептуальное пересечение со стратегией инкрементального обновления `insert_overwrite`.
:::

### Встроенные стратегии

Прежде чем углубляться в [пользовательские стратегии](#custom-strategies), важно понять встроенные стратегии инкрементального обновления в dbt и их соответствующие макросы:

| `incremental_strategy` | Соответствующий макрос                 |
|------------------------|----------------------------------------|
| `append`               | `get_incremental_append_sql`           |
| `delete+insert`        | `get_incremental_delete_insert_sql`    |
| `merge`                | `get_incremental_merge_sql`            |
| `insert_overwrite`     | `get_incremental_insert_overwrite_sql` |
| `microbatch`  <Lifecycle status="beta"/>         | `get_incremental_microbatch_sql`       |


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