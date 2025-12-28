---
title: "Конфигурации Snowflake"
id: "snowflake-configs"
description: "Конфигурации Snowflake — подробное руководство по настройкам в dbt."
tags: ['Snowflake', 'dbt Fusion', 'dbt Core']
---

## Формат таблиц Iceberg

Материалы про таблицы Snowflake Iceberg были перенесены на [новую страницу](/docs/mesh/iceberg/snowflake-iceberg-support)!

## Динамические таблицы

Адаптер Snowflake поддерживает [dynamic tables](https://docs.snowflake.com/en/user-guide/dynamic-tables-about).
Этот тип материализации является специфичным для Snowflake, что означает, что некоторые конфигурации моделей,
которые обычно приходят «в комплекте» с `dbt-core` (например, как у `view`), могут быть недоступны
для динамических таблиц. Со временем, в будущих патчах и версиях, этот разрыв будет сокращаться.
Несмотря на то, что данная материализация специфична для Snowflake, она во многом следует реализации
[материализованных представлений](/docs/build/materializations#Materialized-View).
В частности, динамические таблицы поддерживают настройку `on_configuration_change`.
Динамические таблицы поддерживаются со следующими параметрами конфигурации:

<VersionBlock firstVersion="1.9">

| Parameter          | Type       | Required | Default     | Change Monitoring Support |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | no       | `apply`     | n/a                       |
| [`target_lag`](#target-lag)      | `<string>` | yes      |        | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | yes      |       | alter  |
| [`refresh_mode`](#refresh-mode)       | `<string>` | no       | `AUTO`      | refresh        |
| [`initialize`](#initialize)     | `<string>` | no       | `ON_CREATE` | n/a   |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project YAML file', value: 'project-yaml', },
    { label: 'Properties YAML file', value: 'property-yaml', },
    { label: 'SQL file config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): dynamic_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](#initialize): ON_CREATE | ON_SCHEDULE 
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): dynamic_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [target_lag](#target-lag): downstream | <time-delta>
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
      [refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL 
      [initialize](#initialize): ON_CREATE | ON_SCHEDULE 
```

</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",
    [refresh_mode](#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](#initialize)="ON_CREATE" | "ON_SCHEDULE", 
) }}
```

</File>

</TabItem>

</Tabs>

</VersionBlock>

Подробнее об этих параметрах можно узнать в [документации Snowflake](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table):

### Target lag

Snowflake поддерживает два сценария конфигурации для планирования автоматических обновлений:
- **По времени** &mdash; Указывается значение в формате `<int> { seconds | minutes | hours | days }`. Например, если динамическую таблицу нужно обновлять каждые 30 минут, используйте `target_lag='30 minutes'`.
- **Downstream** &mdash; Применимо, когда динамическая таблица используется другими динамическими таблицами. В этом сценарии `target_lag='downstream'` позволяет управлять обновлениями на целевом уровне, а не на каждом уровне цепочки.

Подробнее о `target_lag` см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh#understanding-target-lag). Обратите внимание, что Snowflake поддерживает минимальный target lag от 1 минуты.

<VersionBlock firstVersion="1.9">

### Refresh mode

Snowflake поддерживает три варианта режима обновления:
- **AUTO** &mdash; По умолчанию принудительно использует инкрементальное обновление динамической таблицы. Если оператор `CREATE DYNAMIC TABLE` не поддерживает инкрементальный режим, таблица автоматически создаётся с полным обновлением.
- **FULL** &mdash; Принудительно выполняет полное обновление динамической таблицы, даже если она может обновляться инкрементально.
- **INCREMENTAL** &mdash; Принудительно использует инкрементальное обновление динамической таблицы. Если запрос, лежащий в основе таблицы, не может быть обновлён инкрементально, создание динамической таблицы завершится ошибкой.

Подробнее о `refresh_mode` см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

### Initialize

Snowflake поддерживает два варианта инициализации:
- **ON_CREATE** &mdash; Синхронно обновляет динамическую таблицу при создании. Если обновление завершается ошибкой, создание таблицы также завершается ошибкой.
- **ON_SCHEDULE** &mdash; Обновляет динамическую таблицу при следующем запланированном обновлении.

Подробнее о `initialize` см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

</VersionBlock>

### Ограничения

Как и в случае с материализованными представлениями на большинстве платформ, динамические таблицы имеют ряд ограничений. Среди наиболее важных:

- SQL для динамических таблиц имеет [ограниченный набор возможностей](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#query-constructs-not-currently-supported-in-dynamic-tables).
- SQL динамической таблицы нельзя обновить; таблица должна быть пересоздана через `--full-refresh` (DROP/CREATE).
- Динамические таблицы не могут зависеть от: materialized views, external tables, streams.
- Динамические таблицы не могут ссылаться на view, которые находятся ниже по цепочке от другой динамической таблицы.

Дополнительную информацию об ограничениях динамических таблиц см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#dynamic-table-limitations-and-supported-functions).

Ограничения со стороны dbt: следующие возможности dbt не поддерживаются:
- [Контракты моделей](/docs/mesh/govern/model-contracts)
- [Конфигурация copy grants](/reference/resource-configs/snowflake-configs#copying-grants)

### Устранение неполадок с динамическими таблицами

Если модель динамической таблицы не удаётся повторно выполнить после первого запуска и появляется следующая ошибка:

```sql
SnowflakeDynamicTableConfig.__init__() missing 6 required positional arguments: 'name', 'schema_name', 'database_name', 'query', 'target_lag', and 'snowflake_warehouse'
```

Убедитесь, что параметр `QUOTED_IDENTIFIERS_IGNORE_CASE` в вашем аккаунте установлен в `FALSE`.

## Временные таблицы

При инкрементальных merge-операциях в Snowflake dbt предпочитает использовать `view`, а не `temporary table`. Это позволяет избежать дополнительной записи в базу данных, которую инициирует временная таблица, и сократить время компиляции.

Тем не менее, существуют ситуации, когда временная таблица может быть быстрее или безопаснее. Конфигурация `tmp_relation_type` позволяет явно выбрать использование временных таблиц для инкрементальных сборок. Она задаётся как часть конфигурации модели.

Для гарантии корректности инкрементная модель со стратегией `delete+insert` и определённым `unique_key` требует использования временной таблицы; попытка заменить её на view приведёт к ошибке.

Определение в project YAML:

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  <resource-path>:
    +tmp_relation_type: table | view ## If not defined, view is the default.
```

</File>

В формате конфигурации SQL-файла модели:

<File name='dbt_model.sql'>

```yaml
{{ config(
    tmp_relation_type="table | view", ## If not defined, view is the default.
) }}
```

</File>

## Transient таблицы

Snowflake поддерживает создание [transient tables](https://docs.snowflake.net/manuals/user-guide/tables-temp-transient.html). Snowflake не хранит историю для таких таблиц, что может существенно снизить стоимость хранения данных. Transient таблицы участвуют в time travel в ограниченном объёме: по умолчанию период хранения составляет 1 день и отсутствует fail-safe период. При принятии решения о конфигурации моделей dbt как `transient` необходимо учитывать эти компромиссы. **По умолчанию все таблицы Snowflake, создаваемые dbt, являются `transient`.**

### Настройка transient таблиц в dbt_project.yml

Целую папку (или пакет) можно настроить как transient (или наоборот), добавив соответствующую строку в файл `dbt_project.yml`. Эта конфигурация работает так же, как и остальные [конфигурации моделей](/reference/model-configs), определённые в `dbt_project.yml`.

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  +transient: false
  my_project:
    ...
```

</File>

### Настройка transient для конкретной модели

Конкретную модель можно настроить как transient, установив конфигурацию `transient` в `true`.

<File name='my_table.sql'>

```sql
{{ config(materialized='table', transient=true) }}

select * from ...
```

</File>

## Теги запросов (Query tags)

[Query tags](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) — это параметр Snowflake,
который может быть полезен при последующем поиске в представлении [QUERY_HISTORY](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

dbt поддерживает задание значения query tag по умолчанию на время всех подключений к Snowflake
в [профиле](/docs/core/connect-data-platform/snowflake-setup). Более точные значения (а также переопределение значения по умолчанию) можно задать для подмножеств моделей с помощью конфигурации модели `query_tag` или переопределив макрос `set_query_tag`:

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +query_tag: dbt_special
```

</File>

<File name='models/<modelname>.sql'>

```sql
{{ config(
    query_tag = 'dbt_special'
) }}

select ...
```

</File>

В этом примере можно настроить query tag, который будет применяться к каждому запросу с именем модели.

```sql
{% macro set_query_tag() -%}
  {% set new_query_tag = model.name %} 
  {% if new_query_tag %}
    {% set original_query_tag = get_current_query_tag() %}
    {{ log("Setting query_tag to '" ~ new_query_tag ~ "'. Will reset to '" ~ original_query_tag ~ "' after materialization.") }}
    {% do run_query("alter session set query_tag = '{}'".format(new_query_tag)) %}
    {{ return(original_query_tag)}}
  {% endif %}
  {{ return(none)}}
{% endmacro %}
```

**Примечание:** query tags задаются на уровне _сессии_. В начале каждой <Term id="materialization" />, если у модели настроен собственный `query_tag`, dbt выполняет `alter session set query_tag`, чтобы установить новое значение. В конце материализации dbt выполняет ещё один `alter`, чтобы вернуть значение по умолчанию. Поэтому сбои сборки в середине материализации могут привести к тому, что последующие запросы будут выполняться с некорректным тегом.

## Поведение merge (инкрементные модели)

Конфигурация [`incremental_strategy`](/docs/build/incremental-strategy) управляет тем, как dbt строит инкрементные модели. По умолчанию dbt использует оператор [merge](https://docs.snowflake.net/manuals/sql-reference/sql/merge.html) в Snowflake для обновления инкрементных таблиц.

Snowflake поддерживает следующие инкрементные стратегии:
- [`merge`](/docs/build/incremental-strategy#merge) (по умолчанию)
- [`append`](/docs/build/incremental-strategy#append)
- [`delete+insert`](/docs/build/incremental-strategy#deleteinsert)
- [`insert_overwrite`](/docs/build/incremental-strategy#insert_overwrite)
  - Примечание: это нестандартная инкрементная стратегия dbt. `insert_overwrite` ведёт себя как команды `truncate` + повторный `insert` в Snowflake. Она не поддерживает перезапись по партициям и намеренно перезаписывает всю таблицу. Реализована как инкрементная стратегия, так как соответствует рабочему процессу dbt без удаления существующих таблиц.
- [`microbatch`](/docs/build/incremental-microbatch)

Оператор `merge` в Snowflake завершается ошибкой «nondeterministic merge», если `unique_key`, указанный в конфигурации модели, на самом деле не является уникальным. В этом случае можно указать dbt использовать двухшаговый инкрементный подход, установив для модели `incremental_strategy` в `delete+insert`.

## Настройка кластеризации таблиц

dbt поддерживает [кластеризацию таблиц](https://docs.snowflake.net/manuals/user-guide/tables-clustering-keys.html) в Snowflake. Для управления кластеризацией <Term id="table" /> или инкрементной модели используется конфигурация `cluster_by`. При её применении dbt выполняет два действия:

1. Неявно сортирует результаты таблицы по указанным полям `cluster_by`.
2. Добавляет указанные ключи кластеризации в целевую таблицу.

Используя поля `cluster_by` для сортировки таблицы, dbt минимизирует объём работы, необходимый для автоматической кластеризации Snowflake. Если инкрементная модель настроена с кластеризацией, dbt также сортирует промежуточный датасет перед merge в целевую таблицу. Таким образом, таблица, управляемая dbt, практически всегда остаётся в кластеризованном состоянии.

### Использование cluster_by

Конфигурация `cluster_by` принимает строку или список строк, используемых в качестве ключей кластеризации. В следующем примере создаётся таблица sessions, кластеризованная по колонке `session_start`.

<File name='models/events/sessions.sql'>

```sql
{{
  config(
    materialized='table',
    cluster_by=['session_start']
  )
}}

select
  session_id,
  min(event_time) as session_start,
  max(event_time) as session_end,
  count(*) as count_pageviews

from {{ source('snowplow', 'event') }}
group by 1
```

</File>

Этот код будет скомпилирован в SQL, который выглядит примерно так:

```sql
create or replace table my_database.my_schema.my_table as (

  select * from (
    select
      session_id,
      min(event_time) as session_start,
      max(event_time) as session_end,
      count(*) as count_pageviews

    from {{ source('snowplow', 'event') }}
    group by 1
  )

  -- этот order by добавляется dbt для создания
  -- таблицы уже в кластеризованном виде
  order by session_start

);

alter table my_database.my_schema.my_table cluster by (session_start);
```

### Кластеризация динамических таблиц

Начиная с <Constant name="core"/> v1.11, динамические таблицы поддерживают конфигурацию `cluster_by`. При её указании dbt включает параметры кластеризации в оператор `CREATE DYNAMIC TABLE`.

Например:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='COMPUTE_WH',
    target_lag='1 minute',
    cluster_by=['session_start', 'user_id']
) }}

select
    session_id,
    user_id,
    min(event_time) as session_start,
    max(event_time) as session_end,
    count(*) as count_pageviews
from {{ source('snowplow', 'event') }}
group by 1, 2
```

Эта конфигурация сгенерирует следующий SQL при компиляции:

```sql
create or replace dynamic table my_database.my_schema.my_table
  target_lag = '1 minute'
  warehouse = COMPUTE_WH
  cluster by (session_start, user_id)
as (
  select
    session_id,
    user_id,
    min(event_time) as session_start,
    max(event_time) as session_end,
    count(*) as count_pageviews
  from source_table
  group by 1, 2
);
```

Кластеризацию для динамических таблиц можно указать при создании с помощью `CLUSTER BY` в операторе `CREATE DYNAMIC TABLE`. Выполнять отдельный `ALTER TABLE` не требуется.

### Автоматическая кластеризация

Автоматическая кластеризация [включена по умолчанию в Snowflake](https://docs.snowflake.com/en/user-guide/tables-auto-reclustering.html), и для её использования не требуется никаких дополнительных действий. Хотя существует конфигурация `automatic_clustering`, она не оказывает эффекта, за исключением аккаунтов с (устаревшей) ручной кластеризацией.

Если [в вашем аккаунте всё ещё включена ручная кластеризация](https://docs.snowflake.com/en/user-guide/tables-clustering-manual.html), можно использовать конфигурацию `automatic_clustering`, чтобы управлять автоматической кластеризацией для моделей dbt. Когда `automatic_clustering` установлена в `true`, dbt выполнит запрос `alter table <table name> resume recluster` после сборки целевой таблицы.

Конфигурацию `automatic_clustering` можно указать в файле `dbt_project.yml` или в блоке `config()` модели.

<File name='dbt_project.yml'>

```yaml
models:
  +automatic_clustering: true
```

</File>

## Конфигурация Python-моделей

Адаптер Snowflake поддерживает Python-модели. Snowflake использует собственный фреймворк Snowpark, который во многом похож на PySpark.

**Дополнительная настройка:** для использования пакетов Anaconda необходимо [принять условия Snowflake Third Party Terms](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages.html#getting-started).

**Установка пакетов:** Snowpark поддерживает ряд популярных пакетов через Anaconda. См. [полный список](https://repo.anaconda.com/pkgs/snowflake/) для подробностей. Пакеты устанавливаются во время выполнения модели. Разные модели могут иметь разные зависимости. При использовании сторонних пакетов Snowflake рекомендует использовать выделенный виртуальный warehouse для лучшей производительности.

**Версия Python:** чтобы указать другую версию Python, используйте следующую конфигурацию:

```python
def model(dbt, session):
    dbt.config(
        materialized = "table",
        python_version="3.11"
    )
```

Конфигурация `python_version` позволяет запускать Snowpark-модели с версиями Python [3.9, 3.10 или 3.11](https://docs.snowflake.com/en/developer-guide/snowpark/python/setup).

**External access integrations и secrets:** для запросов к внешним API внутри Python-моделей dbt используйте Snowflake [external access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview) вместе с [secrets](https://docs.snowflake.com/en/developer-guide/external-network-access/secret-api-reference). Ниже приведён пример дополнительных конфигураций:

```python
import pandas
import snowflake.snowpark as snowpark

def model(dbt, session: snowpark.Session):
    dbt.config(
        materialized="table",
        secrets={"secret_variable_name": "test_secret"},
        external_access_integrations=["test_external_access_integration"],
    )
    import _snowflake
    return session.create_dataframe(
        pandas.DataFrame(
            [{"secret_value": _snowflake.get_generic_secret_string('secret_variable_name')}]
        )
    )
```

**Документация:** ["Developer Guide: Snowpark Python"](https://docs.snowflake.com/en/developer-guide/snowpark/python/index.html)

### Сторонние пакеты Snowflake

Чтобы использовать сторонний пакет Snowflake, отсутствующий в Snowflake Anaconda, загрузите его, следуя [этому примеру](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages#importing-packages-through-a-snowflake-stage), а затем настройте параметр `imports` в Python-модели dbt, указав zip-файл в Snowflake staging.

Ниже приведён полный пример конфигурации с использованием zip-файла и параметра `imports`:

```python
def model(dbt, session):
    # Configure the model
    dbt.config(
        materialized="table",
        imports=["@mystage/mycustompackage.zip"],  # Specify the external package location
    )
    
    # Example data transformation using the imported package
    # (Assuming `some_external_package` has a function we can call)
    data = {
        "name": ["Alice", "Bob", "Charlie"],
        "score": [85, 90, 88]
    }
    df = pd.DataFrame(data)

    # Process data with the external package
    df["adjusted_score"] = df["score"].apply(lambda x: some_external_package.adjust_score(x))
    
    # Return the DataFrame as the model output
    return df
```

Подробнее см. в [документации Snowflake](https://community.snowflake.com/s/article/how-to-use-other-python-packages-in-snowpark) о загрузке и использовании сторонних Python-пакетов в Snowpark, не опубликованных в канале Anaconda.

## Настройка виртуальных warehouse

Виртуальный warehouse по умолчанию, который использует dbt, можно настроить в [профиле](/docs/core/connect-data-platform/profiles.yml) для подключений Snowflake. Чтобы переопределить warehouse для отдельных моделей (или групп моделей), используйте конфигурацию `snowflake_warehouse`. Это позволяет назначать более крупный warehouse для определённых моделей, чтобы управлять стоимостью Snowflake и временем сборки проекта.

<Tabs
  defaultValue="dbt_project.yml"
  values={[
    { label: 'Project file', value: 'dbt_project.yml', },
    { label: 'Property file', value: 'models/my_model.yml', },
    { label: 'SQL file config', value: 'models/events/sessions.sql', },
    ]}
>

<TabItem value="dbt_project.yml">

Ниже приведён пример изменения warehouse для группы моделей с помощью аргумента конфигурации в YAML.

<File name='dbt_project.yml'>

```yaml
name: my_project
version: 1.0.0

...

models:
  +snowflake_warehouse: "EXTRA_SMALL"    # default Snowflake virtual warehouse for all models in the project.
  my_project:
    clickstream:
      +snowflake_warehouse: "EXTRA_LARGE"    # override the default Snowflake virtual warehouse for all models under the `clickstream` directory.
snapshots:
  +snowflake_warehouse: "EXTRA_LARGE"    # all Snapshot models are configured to use the `EXTRA_LARGE` warehouse.
```

</File>
</TabItem>

<TabItem value="models/my_model.yml">

В следующем примере переопределяется Snowflake warehouse для одной модели с помощью конфигурации в property-файле.

<File name='models/my_model.yml'>

```yaml
models:
  - name: my_model
    config:
      snowflake_warehouse: "EXTRA_LARGE"    # override the Snowflake virtual warehouse just for this model
```

</File>
</TabItem>

<TabItem value="models/events/sessions.sql">

В следующем примере warehouse переопределяется для одной модели с помощью блока `config()` в SQL-модели.

<File name='models/events/sessions.sql'>

```sql
# override the Snowflake virtual warehouse for just this model
{{
  config(
    materialized='table',
    snowflake_warehouse='EXTRA_LARGE'
  )
}}

with

aggregated_page_events as (

    select
        session_id,
        min(event_time) as session_start,
        max(event_time) as session_end,
        count(*) as count_page_views
    from {{ source('snowplow', 'event') }}
    group by 1

),

index_sessions as (

    select
        *,
        row_number() over (
            partition by session_id
            order by session_start
        ) as page_view_in_session_index
    from aggregated_page_events

)

select * from index_sessions
```

</File>
</TabItem>
</Tabs>

## Копирование прав (Copying grants)

Когда конфигурация `copy_grants` установлена в `true`, dbt добавляет квалификатор `copy grants` к <Term id="ddl" /> при пересборке таблиц и <Term id="view">представлений</Term>. Значение по умолчанию — `false`.

<File name='dbt_project.yml'>

```yaml
models:
  +copy_grants: true
```

</File>

<VersionBlock firstVersion="1.10">

## Настройка row access policies

Настройка [row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro) для таблиц, представлений и динамических таблиц выполняется с помощью конфигурации `row_access_policy`. Политика должна уже существовать в Snowflake до применения к модели.

<File name='models/<modelname>.sql'>

```sql
{{ config(
    row_access_policy = 'my_database.my_schema.my_row_access_policy_name on (id)'
) }}

select ...
```

</File>

## Настройка table tags

Для добавления тегов к таблицам, представлениям и динамическим таблицам используйте конфигурацию `table_tag`. Обратите внимание: тег должен уже существовать в Snowflake до применения.

<File name='models/<modelname>.sql'>

```sql
{{ config(
    table_tag = "my_tag_name = 'my_tag_value'"
) }}

select ...
```

</File>

</VersionBlock>

## Secure views

Чтобы создать [secure view](https://docs.snowflake.net/manuals/user-guide/views-secure.html) в Snowflake, используйте конфигурацию `secure` для моделей с материализацией view. Secure views применяются для ограничения доступа к чувствительным данным. Примечание: secure views могут снижать производительность, поэтому используйте их только при необходимости.

Следующий пример настраивает модели в папке `sensitive/` как secure views.

<File name='dbt_project.yml'>

```yaml
name: my_project
version: 1.0.0

models:
  my_project:
    sensitive:
      +materialized: view
      +secure: true
```

</File>

## Известное ограничение source freshness

Snowflake рассчитывает source freshness на основе значения колонки `LAST_ALTERED`, то есть использует поле, обновляемое при любых изменениях объекта, а не только при обновлении данных. Никаких действий предпринимать не нужно, однако аналитическим командам следует учитывать этот нюанс.

Согласно [документации Snowflake](https://docs.snowflake.com/en/sql-reference/info-schema/tables#usage-notes):

  >Колонка `LAST_ALTERED` обновляется при выполнении следующих операций над объектом:
  >- DDL-операции.
  >- DML-операции (только для таблиц).
  >- Фоновые операции обслуживания метаданных, выполняемые Snowflake.

<VersionBlock firstVersion="1.9">

## Пагинация результатов объектов

По умолчанию, если dbt обнаруживает схему с количеством объектов до 100 000, результаты `show objects` разбиваются на страницы по 10 000 объектов, максимум до 10 страниц.

В окружениях с более чем 100 000 объектов в схеме можно настроить количество результатов на страницу и лимит страниц с помощью следующих [флагов](/reference/global-configs/about-global-configs) в `dbt_project.yml`:

- `list_relations_per_page` &mdash; количество объектов на странице (максимум 10 000 — это ограничение Snowflake).
- `list_relations_page_limit` &mdash; максимальное количество страниц.

Например, чтобы получать по 10 000 объектов на страницу и включать до 100 страниц (1 000 000 объектов), настройте флаги следующим образом:

```yml
flags:
  list_relations_per_page: 10000
  list_relations_page_limit: 100
```

</VersionBlock>
