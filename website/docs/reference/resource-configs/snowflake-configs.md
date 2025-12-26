---
title: "Конфигурации Snowflake"
id: "snowflake-configs"
description: "Конфигурации Snowflake — подробное руководство по изучению настроек в dbt."
tags: ['Snowflake', 'dbt Fusion', 'dbt Core']
---

## Iceberg table format

Материалы о таблицах Iceberg в Snowflake были перенесены на [новую страницу](/docs/mesh/iceberg/snowflake-iceberg-support)!

## Динамические таблицы

Адаптер Snowflake поддерживает [динамические таблицы](https://docs.snowflake.com/en/user-guide/dynamic-tables-about).
Эта материализация специфична для Snowflake, что означает, что любая конфигурация модели, которая обычно идет вместе с `dbt-core` (например, как с `view`), может быть недоступна для динамических таблиц. Этот разрыв будет уменьшаться в будущих патчах и версиях.
Хотя эта материализация специфична для Snowflake, она во многом следует реализации [материализованных представлений](/docs/build/materializations#Materialized-View).
В частности, динамические таблицы имеют доступ к настройке `on_configuration_change`.
Динамические таблицы поддерживаются с следующими параметрами конфигурации:

<VersionBlock firstVersion="1.9">

| Параметр          | Тип       | Обязательно | По умолчанию     | Поддержка мониторинга изменений |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | нет       | `apply`     | n/a                       |
| [`target_lag`](#target-lag)      | `<string>` | да      |        | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | да      |       | alter  |
| [`refresh_mode`](#refresh-mode)       | `<string>` | нет       | `AUTO`      | refresh        |
| [`initialize`](#initialize)     | `<string>` | нет       | `ON_CREATE` | n/a   |


<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'YAML‑файл проекта', value: 'project-yaml', },
    { label: 'YAML‑файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация в SQL‑файле', value: 'config', },
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

Узнайте больше об этих параметрах в [документации Snowflake](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table):

### Целевое отставание

Snowflake позволяет два сценария конфигурации для планирования автоматических обновлений:
- **На основе времени** &mdash; Укажите значение в формате `<int> { seconds | minutes | hours | days }`. Например, если динамическую таблицу нужно обновлять каждые 30 минут, используйте `target_lag='30 minutes'`.
- **Нисходящий поток** &mdash; Применимо, когда динамическая таблица ссылается на другие динамические таблицы. В этом сценарии `target_lag='downstream'` позволяет контролировать обновления на целевом уровне, а не на каждом уровне.

Узнайте больше о `target_lag` в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh#understanding-target-lag). Обратите внимание, что Snowflake поддерживает целевое отставание в 1 минуту или дольше.

<VersionBlock firstVersion="1.9">

### Режим обновления

Snowflake позволяет три варианта режима обновления:
- **AUTO** &mdash; По умолчанию обеспечивает инкрементное обновление динамической таблицы. Если оператор `CREATE DYNAMIC TABLE` не поддерживает режим инкрементного обновления, динамическая таблица автоматически создается в режиме полного обновления.
- **FULL** &mdash; Обеспечивает полное обновление динамической таблицы, даже если динамическая таблица может быть обновлена инкрементно.
- **INCREMENTAL** &mdash; Обеспечивает инкрементное обновление динамической таблицы. Если запрос, лежащий в основе динамической таблицы, не может выполнить инкрементное обновление, создание динамической таблицы завершается с ошибкой.

Узнайте больше о `refresh_mode` в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

### Инициализация

Snowflake позволяет два варианта инициализации:
- **ON_CREATE** &mdash; Обновляет динамическую таблицу синхронно при создании. Если это обновление не удается, создание динамической таблицы завершается с ошибкой.
- **ON_SCHEDULE** &mdash; Обновляет динамическую таблицу при следующем запланированном обновлении.

Узнайте больше о `initialize` в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

</VersionBlock>

### Ограничения

Как и в случае с материализованными представлениями на большинстве платформ данных, существуют ограничения, связанные с динамическими таблицами. Некоторые из них, которые стоит отметить, включают:

- SQL динамической таблицы имеет [ограниченный набор функций](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#query-constructs-not-currently-supported-in-dynamic-tables).
- SQL динамической таблицы не может быть обновлен; динамическая таблица должна пройти через `--full-refresh` (DROP/CREATE).
- Динамические таблицы не могут быть ниже по потоку от: материализованных представлений, внешних таблиц, потоков.
- Динамические таблицы не могут ссылаться на представление, которое находится ниже по потоку от другой динамической таблицы.

Найдите больше информации об ограничениях динамических таблиц в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#dynamic-table-limitations-and-supported-functions).

Из-за ограничений dbt следующие возможности dbt не поддерживаются:
- [Model contracts](/docs/mesh/govern/model-contracts)
- [Copy grants configuration](/reference/resource-configs/snowflake-configs#copying-grants)

### Устранение неполадок с dynamic tables

Если ваша модель dynamic table не удаётся повторно выполнить после первоначального запуска и вы видите следующее сообщение об ошибке:

```sql
SnowflakeDynamicTableConfig.__init__() missing 6 required positional arguments: 'name', 'schema_name', 'database_name', 'query', 'target_lag', and 'snowflake_warehouse'
```

Убедитесь, что параметр `QUOTED_IDENTIFIERS_IGNORE_CASE` в вашем аккаунте установлен в значение `FALSE`.

## Temporary tables

Инкрементные слияния таблиц для Snowflake предпочитают использовать `view`, а не `temporary table`. Причина в том, чтобы избежать шага записи в базу данных, который инициировала бы временная таблица, и сэкономить время компиляции.

Однако остаются некоторые ситуации, когда временная таблица может достичь результатов быстрее или безопаснее. Конфигурация `tmp_relation_type` позволяет вам выбрать временные таблицы для инкрементных сборок. Это определяется как часть конфигурации модели.

Чтобы гарантировать точность, инкрементная модель, использующая стратегию `delete+insert` с определенным `unique_key`, требует временной таблицы; попытка изменить это на представление приведет к ошибке.

Определено в YAML проекта:

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  <resource-path>:
    +tmp_relation_type: table | view ## Если не определено, по умолчанию используется view.
  
```

</File>

В формате конфигурации для SQL файла модели:

<File name='dbt_model.sql'>

```yaml

{{ config(
    tmp_relation_type="table | view", ## Если не определено, по умолчанию используется view.
) }}

```

</File>

## Переходные таблицы

Snowflake поддерживает создание [переходных таблиц](https://docs.snowflake.net/manuals/user-guide/tables-temp-transient.html). Snowflake не сохраняет историю для этих таблиц, что может привести к заметному снижению ваших затрат на хранение в Snowflake. Переходные таблицы участвуют в путешествии во времени в ограниченной степени с периодом удержания по умолчанию в 1 день без периода резервного копирования. Взвесьте эти компромиссы при принятии решения о том, следует ли настраивать ваши модели dbt как `transient`. **По умолчанию все таблицы Snowflake, созданные dbt, являются `transient`.**

### Настройка переходных таблиц в dbt_project.yml

Целая папка (или пакет) может быть настроена как переходная (или нет) путем добавления строки в файл `dbt_project.yml`. Эта конфигурация работает так же, как и все [конфигурации моделей](/reference/model-configs), определенные в `dbt_project.yml`.

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

### Настройка переходности для конкретной модели

Конкретная модель может быть настроена как переходная, установив конфигурацию модели `transient` в `true`.

<File name='my_table.sql'>

```sql
{{ config(materialized='table', transient=true) }}

select * from ...
```

</File>

## Теги запросов

[Теги запросов](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) — это параметр Snowflake, который может быть весьма полезен позже при поиске в [представлении QUERY_HISTORY](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

dbt поддерживает установку тега запроса по умолчанию на время своих соединений Snowflake в [вашем профиле](/docs/core/connect-data-platform/snowflake-setup). Вы можете установить более точные значения (и переопределить значение по умолчанию) для подмножеств моделей, установив конфигурацию модели `query_tag` или переопределив макрос `set_query_tag` по умолчанию:

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
  
В этом примере вы можете настроить тег запроса, который будет применяться к каждому запросу с именем модели.
  
```sql 

  {% macro set_query_tag() -%}
  {% set new_query_tag = model.name %} 
  {% if new_query_tag %}
    {% set original_query_tag = get_current_query_tag() %}
    {{ log("Установка query_tag на '" ~ new_query_tag ~ "'. Будет сброшен на '" ~ original_query_tag ~ "' после материализации.") }}
    {% do run_query("alter session set query_tag = '{}'".format(new_query_tag)) %}
    {{ return(original_query_tag)}}
  {% endif %}
  {{ return(none)}}
{% endmacro %}

```

**Примечание:** теги запросов устанавливаются на уровне _сессии_. В начале каждой <Term id="materialization" /> модели, если у модели настроен пользовательский `query_tag`, dbt выполнит `alter session set query_tag`, чтобы установить новое значение. В конце материализации dbt выполнит еще один оператор `alter`, чтобы сбросить тег на его значение по умолчанию. Таким образом, сбои сборки в середине материализации могут привести к тому, что последующие запросы будут выполняться с неправильным тегом.

</File>

## Поведение слияния (инкрементные модели)

Конфигурация [`incremental_strategy`](/docs/build/incremental-strategy) управляет тем, как dbt строит инкрементные модели. По умолчанию dbt будет использовать [оператор слияния](https://docs.snowflake.net/manuals/sql-reference/sql/merge.html) в Snowflake для обновления инкрементных таблиц.

Snowflake поддерживает следующие стратегии инкрементальной загрузки:
- [`merge`](/docs/build/incremental-strategy#merge) (по умолчанию)
- [`append`](/docs/build/incremental-strategy#append)
- [`delete+insert`](/docs/build/incremental-strategy#deleteinsert)
- [`insert_overwrite`](/docs/build/incremental-strategy#insert_overwrite)
  - Примечание: это не стандартная инкрементальная стратегия dbt. `insert_overwrite` ведёт себя как выполнение команд `truncate` + повторный `insert` в Snowflake. Она не поддерживает перезапись по партициям, то есть намеренно перезаписывает всю таблицу целиком. Эта стратегия реализована как инкрементальная, поскольку она соответствует рабочему процессу dbt, в котором существующие таблицы не удаляются.
- [`microbatch`](/docs/build/incremental-microbatch)

Оператор `merge` Snowflake завершится с ошибкой "недетерминированное слияние", если `unique_key`, указанный в конфигурации вашей модели, не является уникальным. Если вы столкнулись с этой ошибкой, вы можете указать dbt использовать двухэтапный инкрементный подход, установив конфигурацию `incremental_strategy` для вашей модели на `delete+insert`.

## Настройка кластеризации таблиц

dbt поддерживает [кластеризацию таблиц](https://docs.snowflake.net/manuals/user-guide/tables-clustering-keys.html) в Snowflake. Чтобы управлять кластеризацией для <Term id="table" /> или инкрементной модели, используйте конфигурацию `cluster_by`. Когда эта конфигурация применяется, dbt выполнит два действия:

1. Он неявно упорядочит результаты таблицы по указанным полям `cluster_by`
2. Он добавит указанные ключи кластеризации в целевую таблицу

1. Он неявно отсортирует результаты таблицы по указанным полям `cluster_by`.
2. Он добавит указанные ключи кластеризации в целевую таблицу.

### Использование cluster_by

Конфигурация `cluster_by` принимает либо строку, либо список строк для использования в качестве ключей кластеризации. Следующий пример создаст таблицу сессий, кластеризованную по столбцу `session_start`.

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

Код выше будет скомпилирован в SQL, который выглядит (примерно) так:

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
  -- таблицы в уже кластеризованном виде.
  order by session_start

);

 alter table my_database.my_schema.my_table cluster by (session_start);
```

### Динамическая кластеризация таблиц

Начиная с версии <Constant name="core"/> v1.11, динамические таблицы поддерживают конфигурацию `cluster_by`. Если она задана, dbt включает спецификацию кластеризации в оператор `CREATE DYNAMIC TABLE`.

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

Эта конфигурация при компиляции генерирует следующий SQL:

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

Вы можете задать кластеризацию для динамических таблиц в момент их создания, используя `CLUSTER BY` в операторе `CREATE DYNAMIC TABLE`. Нет необходимости выполнять отдельный оператор `ALTER TABLE`.

### Автоматическая кластеризация

Автоматическая кластеризация [включена по умолчанию в Snowflake сегодня](https://docs.snowflake.com/en/user-guide/tables-auto-reclustering.html), никаких действий не требуется для ее использования. Хотя существует конфигурация `automatic_clustering`, она не имеет эффекта, кроме как для аккаунтов с (устаревшей) ручной кластеризацией.

Если [ручная кластеризация все еще включена для вашего аккаунта](https://docs.snowflake.com/en/user-guide/tables-clustering-manual.html), вы можете использовать конфигурацию `automatic_clustering`, чтобы управлять тем, включена ли автоматическая кластеризация для моделей dbt. Когда `automatic_clustering` установлено в `true`, dbt выполнит запрос `alter table <table name> resume recluster` после сборки целевой таблицы.

Конфигурация `automatic_clustering` может быть указана в файле `dbt_project.yml` или в блоке `config()` модели.

<File name='dbt_project.yml'>

```yaml
models:
  +automatic_clustering: true
```

</File>

## Конфигурация Python‑моделей

Адаптер Snowflake поддерживает Python‑модели. Snowflake использует собственный фреймворк Snowpark, который во многом похож на PySpark.

**Дополнительная настройка:** Для использования пакетов Anaconda вам потребуется [подтвердить и принять условия Snowflake Third Party Terms](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages.html#getting-started).

**Установка пакетов:** Snowpark поддерживает несколько популярных пакетов через Anaconda. Подробности смотрите в [полном списке](https://repo.anaconda.com/pkgs/snowflake/). Пакеты устанавливаются во время выполнения модели. Разные модели могут иметь разные зависимости от пакетов. Если вы используете сторонние пакеты, Snowflake рекомендует для лучшей производительности использовать выделенный virtual warehouse, а не warehouse с большим количеством одновременных пользователей.

**Версия Python:** Чтобы указать другую версию Python, используйте следующую конфигурацию:

```python
def model(dbt, session):
    dbt.config(
        materialized = "table",
        python_version="3.11"
    )
```

Параметр `python_version` позволяет запускать Snowpark‑модель с версиями Python [3.9, 3.10 или 3.11](https://docs.snowflake.com/en/developer-guide/snowpark/python/setup).

**External access integrations и secrets:** Для обращения к внешним API внутри Python‑моделей dbt используйте Snowflake [external access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview) совместно с [secrets](https://docs.snowflake.com/en/developer-guide/external-network-access/secret-api-reference). Ниже приведён пример дополнительных конфигураций, которые можно использовать:

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

Чтобы использовать сторонний пакет Snowflake, который недоступен в Snowflake Anaconda, загрузите его, следуя [этому примеру](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages#importing-packages-through-a-snowflake-stage), а затем настройте параметр `imports` в Python‑модели dbt, указав путь к zip‑файлу в Snowflake stage.

Ниже приведён полный пример конфигурации с использованием zip‑файла, включая применение `imports` в Python‑модели:

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

Для получения дополнительной информации об использовании этой конфигурации см. [документацию Snowflake](https://community.snowflake.com/s/article/how-to-use-other-python-packages-in-snowpark) о загрузке и использовании других Python‑пакетов в Snowpark, которые не опубликованы в канале Anaconda Snowflake.

## Настройка virtual warehouses

Склад по умолчанию, который использует dbt, можно настроить в вашем [профиле](/docs/core/connect-data-platform/profiles.yml) для соединений Snowflake. Чтобы переопределить склад, который используется для конкретных моделей (или групп моделей), используйте конфигурацию модели `snowflake_warehouse`. Эта конфигурация может быть использована для указания большего склада для определенных моделей, чтобы контролировать затраты на Snowflake и время сборки проекта.

<Tabs
  defaultValue="dbt_project.yml"
  values={[
    { label: 'Файл проекта', value: 'dbt_project.yml', },
    { label: 'Файл свойств', value: 'models/my_model.yml', },
    { label: 'Конфигурация SQL-файла', value: 'models/events/sessions.sql', },
    ]}
>

<TabItem value="dbt_project.yml">

В следующем примере для группы моделей изменяется хранилище данных с помощью аргумента `config`, заданного в YAML.

<File name='dbt_project.yml'>

```yaml
name: my_project
version: 1.0.0

...

models:
  +snowflake_warehouse: "EXTRA_SMALL"    # виртуальный склад Snowflake по умолчанию для всех моделей в проекте.
  my_project:
    clickstream:
      +snowflake_warehouse: "EXTRA_LARGE"    # переопределяет виртуальный склад Snowflake по умолчанию для всех моделей в директории `clickstream`.
snapshots:
  +snowflake_warehouse: "EXTRA_LARGE"    # все модели Snapshot настроены на использование склада `EXTRA_LARGE`.
```

</File>
</TabItem>
<TabItem value="models/my_model.yml">

The following example overrides the Snowflake warehouse for a single model using a config argument in the property file.

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

В следующем примере склад данных изменяется для одной модели с помощью блока `config()` в SQL-модели.

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

## Копирование грантов

Когда конфигурация `copy_grants` установлена в `true`, dbt добавит квалификатор `copy grants` <Term id="ddl" /> при перестроении таблиц и <Term id="view">представлений</Term>. Значение по умолчанию — `false`.

<File name='dbt_project.yml'>

```yaml
models:
  +copy_grants: true
```

</File>

<VersionBlock firstVersion="1.10">

## Настройка политик доступа к строкам

Настройте [политики доступа к строкам](https://docs.snowflake.com/en/user-guide/security-row-intro) для таблиц, представлений (views) и динамических таблиц, используя конфигурацию `row_access_policy` для моделей. Политика должна **уже существовать в Snowflake** до того, как вы примените её к модели.

<File name='models/<modelname>.sql'>

```sql
{{ config(
    row_access_policy = 'my_database.my_schema.my_row_access_policy_name on (id)'
) }}

select ...

```
</File>

## Настройка тегов таблиц

Чтобы добавить теги к таблицам, представлениям и динамическим таблицам, используйте конфигурацию `table_tag`. Обратите внимание: тег должен **уже существовать в Snowflake** до того, как вы примените его.

<File name='models/<modelname>.sql'>

```sql
{{ config(
    table_tag = "my_tag_name = 'my_tag_value'"
) }}

select ...

```

</File>

</VersionBlock>

## Защищённые представления

Чтобы создать [безопасное представление](https://docs.snowflake.net/manuals/user-guide/views-secure.html) в Snowflake, используйте конфигурацию `secure` для моделей представлений. Безопасные представления могут быть использованы для ограничения доступа к конфиденциальным данным. Примечание: безопасные представления могут привести к снижению производительности, поэтому вы должны использовать их только в случае необходимости.

Следующий пример настраивает модели в папке `sensitive/` как безопасные представления.

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

## Известное ограничение свежести источников

Согласно [документации Snowflake](https://docs.snowflake.com/en/sql-reference/info-schema/tables#usage-notes):

> Столбец `LAST_ALTERED` обновляется, когда выполняются следующие операции над объектом:
> - Операции DDL.
> - Операции DML (только для таблиц).
> - Фоновые операции по обслуживанию метаданных, выполняемые Snowflake.

<VersionBlock firstVersion="1.9">

## Постраничная навигация для результатов объектов

По умолчанию, когда dbt сталкивается со схемой с до 100,000 объектов, он будет разбивать результаты из `show objects` на страницы по 10,000 на страницу для до 10 страниц.

Среды с более чем 100,000 объектов в схеме могут настроить количество результатов на страницу и лимит страниц, используя следующие [флаги](/reference/global-configs/about-global-configs) в `dbt_project.yml`:

- `list_relations_per_page` &mdash; Количество отношений на каждой странице (Максимум 10k, так как это максимум, который позволяет Snowflake).
- `list_relations_page_limit` &mdash; Максимальное количество страниц для включения в результаты.

Например, если вы хотите включить 10,000 объектов на страницу и включить до 100 страниц (1 миллион объектов), настройте флаги следующим образом:

```yml

flags:
  list_relations_per_page: 10000
  list_relations_page_limit: 100

```

</VersionBlock>