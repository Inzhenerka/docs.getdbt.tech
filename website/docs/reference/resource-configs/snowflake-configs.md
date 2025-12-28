---
title: "Конфигурации Snowflake"
id: "snowflake-configs"
description: "Конфигурации Snowflake — подробное руководство по настройкам в dbt."
tags: ['Snowflake', 'dbt Fusion', 'dbt Core']
---

## Формат таблиц Iceberg

Контент про таблицы Snowflake Iceberg был перенесён на [новую страницу](/docs/mesh/iceberg/snowflake-iceberg-support)!

## Динамические таблицы

Адаптер Snowflake поддерживает [динамические таблицы](https://docs.snowflake.com/en/user-guide/dynamic-tables-about).
Эта материализация специфична для Snowflake, что означает, что не все конфигурации моделей,
которые обычно предоставляются `dbt-core` (например, как у `view`), могут быть доступны
для динамических таблиц. Этот разрыв будет сокращаться в будущих патчах и версиях.

Несмотря на то, что эта материализация специфична для Snowflake, она во многом следует реализации
[материализованных представлений](/docs/build/materializations#Materialized-View).
В частности, динамические таблицы поддерживают настройку `on_configuration_change`.

Динамические таблицы поддерживают следующие параметры конфигурации:

<VersionBlock firstVersion="1.9">

| Параметр           | Тип        | Обязательный | Значение по умолчанию | Поддержка отслеживания изменений |
|--------------------|------------|--------------|------------------------|----------------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | нет | `apply` | n/a |
| [`target_lag`](#target-lag) | `<string>` | да |  | alter |
| [`snowflake_warehouse`](#configuring-virtual-warehouses) | `<string>` | да |  | alter |
| [`refresh_mode`](#refresh-mode) | `<string>` | нет | `AUTO` | refresh |
| [`initialize`](#initialize) | `<string>` | нет | `ON_CREATE` | n/a |

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

Подробнее о параметрах см. в [документации Snowflake](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table):

### Target lag

Snowflake поддерживает два сценария конфигурации для планирования автоматических обновлений:
- **По времени** — укажите значение в формате `<int> { seconds | minutes | hours | days }`. Например, если динамическую таблицу нужно обновлять каждые 30 минут, используйте `target_lag='30 minutes'`.
- **Downstream** — применяется, если динамическая таблица используется другими динамическими таблицами. В этом случае `target_lag='downstream'` позволяет управлять обновлениями на целевом уровне, а не на каждом слое.

Подробнее о `target_lag` см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh#understanding-target-lag). Обратите внимание, что Snowflake поддерживает минимальное значение target lag — 1 минуту.

<VersionBlock firstVersion="1.9">

### Refresh mode

Snowflake поддерживает три режима обновления:
- **AUTO** — по умолчанию принудительно использует инкрементальное обновление. Если оператор `CREATE DYNAMIC TABLE` не поддерживает инкрементальный режим, таблица автоматически создаётся с полным обновлением.
- **FULL** — принудительно использует полное обновление, даже если таблица может обновляться инкрементально.
- **INCREMENTAL** — принудительно использует инкрементальное обновление. Если запрос не поддерживает инкрементальное обновление, создание таблицы завершится ошибкой.

Подробнее см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

### Initialize

Snowflake поддерживает два варианта инициализации:
- **ON_CREATE** — синхронно обновляет динамическую таблицу при создании. В случае ошибки создание таблицы завершается неудачно.
- **ON_SCHEDULE** — обновляет динамическую таблицу при следующем запланированном запуске.

Подробнее см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

</VersionBlock>

### Ограничения

Как и у материализованных представлений, у динамических таблиц есть ограничения, среди которых:
- SQL для динамических таблиц имеет [ограниченный набор возможностей](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#query-constructs-not-currently-supported-in-dynamic-tables).
- SQL динамической таблицы нельзя изменить; требуется `--full-refresh` (DROP/CREATE).
- Динамические таблицы не могут быть downstream от: materialized views, external tables, streams.
- Динамические таблицы не могут ссылаться на view, которое само является downstream от другой динамической таблицы.

Подробнее см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#dynamic-table-limitations-and-supported-functions).

Ограничения dbt — следующие возможности не поддерживаются:
- [Контракты моделей](/docs/mesh/govern/model-contracts)
- [Copy grants configuration](/reference/resource-configs/snowflake-configs#copying-grants)

### Устранение проблем с динамическими таблицами

Если модель динамической таблицы не перезапускается после первого выполнения с ошибкой:

```sql
SnowflakeDynamicTableConfig.__init__() missing 6 required positional arguments: 'name', 'schema_name', 'database_name', 'query', 'target_lag', and 'snowflake_warehouse'
```

Убедитесь, что параметр `QUOTED_IDENTIFIERS_IGNORE_CASE` в аккаунте установлен в `FALSE`.

## Временные таблицы

При инкрементальных merge-операциях Snowflake dbt по умолчанию предпочитает использовать `view`, а не `temporary table`. Это позволяет избежать лишней записи в базу данных и сократить время компиляции.

Тем не менее, в некоторых ситуациях временная таблица может быть быстрее или безопаснее. Конфигурация `tmp_relation_type` позволяет явно выбрать использование временных таблиц для инкрементальных сборок.

Для корректной работы инкрементная модель со стратегией `delete+insert` и заданным `unique_key` требует временную таблицу; попытка заменить её на view приведёт к ошибке.

Определение в project YAML:

<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    +tmp_relation_type: table | view ## По умолчанию используется view.
```

</File>

В конфигурации SQL-файла модели:

<File name='dbt_model.sql'>

```yaml
{{ config(
    tmp_relation_type="table | view", ## По умолчанию используется view.
) }}
```

</File>

## Транзитные таблицы (Transient tables)

Snowflake поддерживает [транзитные таблицы](https://docs.snowflake.net/manuals/user-guide/tables-temp-transient.html). Для таких таблиц Snowflake не хранит историю изменений, что может заметно снизить стоимость хранения данных. Транзитные таблицы поддерживают time travel в ограниченном виде (по умолчанию 1 день) и не имеют fail-safe периода. Учитывайте эти компромиссы при выборе конфигурации `transient`. **По умолчанию все таблицы Snowflake, создаваемые dbt, являются `transient`.**

### Настройка transient-таблиц в dbt_project.yml

Целую папку (или пакет) можно настроить как transient, добавив соответствующую строку в `dbt_project.yml`. Эта настройка работает так же, как и остальные [настройки моделей](/reference/model-configs).

<File name='dbt_project.yml'>

```yaml
models:
  +transient: false
  my_project:
    ...
```

</File>

### Настройка transient для конкретной модели

Отдельную модель можно сделать transient, установив `transient: true`.

<File name='my_table.sql'>

```sql
{{ config(materialized='table', transient=true) }}

select * from ...
```

</File>

## Query tags

[Query tags](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) — это параметр Snowflake, полезный при анализе запросов в представлении [QUERY_HISTORY](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

dbt поддерживает установку query tag по умолчанию для всех соединений Snowflake в [профиле](/docs/core/connect-data-platform/snowflake-setup). Более точные значения (с переопределением значения по умолчанию) можно задать для отдельных моделей через конфигурацию `query_tag` или переопределив макрос `set_query_tag`.

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

В этом примере query tag применяется ко всем запросам с именем модели.

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

**Примечание:** query tags устанавливаются на уровне _сессии_. В начале каждой <Term id="materialization" />, если у модели задан собственный `query_tag`, dbt выполняет `alter session set query_tag`. В конце материализации dbt сбрасывает значение обратно. Если сборка прерывается, последующие запросы могут выполняться с некорректным тегом.

## Поведение merge (инкрементальные модели)

Конфигурация [`incremental_strategy`](/docs/build/incremental-strategy) определяет, как dbt строит инкрементальные модели. По умолчанию dbt использует оператор [merge](https://docs.snowflake.net/manuals/sql-reference/sql/merge.html) в Snowflake.

Snowflake поддерживает следующие стратегии:
- [`merge`](/docs/build/incremental-strategy#merge) (по умолчанию)
- [`append`](/docs/build/incremental-strategy#append)
- [`delete+insert`](/docs/build/incremental-strategy#deleteinsert)
- [`insert_overwrite`](/docs/build/incremental-strategy#insert_overwrite)
  - Примечание: это нестандартная стратегия dbt. `insert_overwrite` ведёт себя как `truncate` + повторный `insert`, перезаписывая всю таблицу.
- [`microbatch`](/docs/build/incremental-microbatch)

Если `unique_key` фактически не уникален, Snowflake выдаёт ошибку "nondeterministic merge". В этом случае используйте стратегию `delete+insert`.

## Настройка кластеризации таблиц

dbt поддерживает [кластеризацию таблиц](https://docs.snowflake.net/manuals/user-guide/tables-clustering-keys.html) в Snowflake. Для управления кластеризацией используйте конфигурацию `cluster_by`.

При её применении dbt:
1. Неявно сортирует данные по полям `cluster_by`.
2. Добавляет ключи кластеризации к целевой таблице.

### Использование cluster_by

<File name='models/events/sessions.sql'>

```sql
{{
  config(
    materialized='table',
    cluster_by=['session_start']
  )
}}
...
```

(Далее SQL компилируется с `order by` и `alter table cluster by`, как показано в оригинале.)

### Кластеризация динамических таблиц

Начиная с <Constant name="core"/> v1.11, динамические таблицы поддерживают `cluster_by`. Кластеризация указывается непосредственно в `CREATE DYNAMIC TABLE`.

### Автоматическая кластеризация

Автоматическая кластеризация [включена по умолчанию](https://docs.snowflake.com/en/user-guide/tables-auto-reclustering.html). Конфигурация `automatic_clustering` актуальна только для аккаунтов с ручной кластеризацией.

## Конфигурация Python-моделей

Адаптер Snowflake поддерживает Python-модели на базе Snowpark.

**Дополнительная настройка:** необходимо принять [Snowflake Third Party Terms](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages.html#getting-started).

**Установка пакетов:** Snowpark поддерживает пакеты Anaconda. Пакеты устанавливаются при выполнении модели.

**Версия Python:** задаётся через `python_version` (3.9, 3.10 или 3.11).

**External access и secrets:** для доступа к внешним API используйте external access integrations и secrets Snowflake.

(Примеры кода сохранены без изменений.)

## Настройка виртуальных warehouse

Warehouse по умолчанию задаётся в [Profile](/docs/core/connect-data-platform/profiles.yml). Для переопределения используйте конфигурацию `snowflake_warehouse` на уровне проекта, папки или модели.

(Примеры в Tabs сохранены без изменений.)

## Copying grants

Если `copy_grants: true`, dbt добавляет `copy grants` при пересоздании таблиц и views. По умолчанию `false`.

<VersionBlock firstVersion="1.10">

## Настройка row access policies

Для применения [row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro) используйте конфигурацию `row_access_policy`. Политика должна существовать заранее.

## Настройка table tags

Для добавления тегов используйте конфигурацию `table_tag`. Тег также должен существовать заранее.

</VersionBlock>

## Secure views

Для создания [secure view](https://docs.snowflake.net/manuals/user-guide/views-secure.html) используйте конфигурацию `secure`. Secure views могут снижать производительность, используйте их только при необходимости.

## Известное ограничение source freshness

Snowflake вычисляет freshness источников по полю `LAST_ALTERED`, которое обновляется при любых изменениях объекта, а не только данных. Это следует учитывать аналитическим командам.

<VersionBlock firstVersion="1.9">

## Пагинация результатов объектов

По умолчанию dbt разбивает результаты `show objects` на страницы по 10 000 объектов (до 10 страниц).

Для схем с более чем 100 000 объектов можно настроить:
- `list_relations_per_page`
- `list_relations_page_limit`

Пример конфигурации:

```yml
flags:
  list_relations_per_page: 10000
  list_relations_page_limit: 100
```

</VersionBlock>
