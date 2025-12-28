---
title: "О контекстной переменной graph"
sidebar_label: "graph"
id: "graph"
description: "Контекстная переменная `graph` содержит информацию об узлах в вашем проекте."
---

Контекстная переменная `graph` содержит информацию об _узлах_ (nodes) в вашем dbt‑проекте. Модели, источники, тесты и снимки (snapshots) — всё это примеры узлов в проектах dbt.

:::danger Важно

dbt активно формирует переменную `graph` во время [фазы парсинга](/reference/dbt-jinja-functions/execute) при выполнении dbt‑проекта, поэтому некоторые свойства контекстной переменной `graph` будут отсутствовать или содержать некорректные значения во время парсинга. Пожалуйста, внимательно прочитайте информацию ниже, чтобы понять, как эффективно использовать эту переменную.

:::

### Контекстная переменная graph

Контекстная переменная `graph` — это словарь, который сопоставляет идентификаторы узлов с их словарными представлениями. Упрощённый пример может выглядеть так:

```json
{
  "nodes": {
    "model.my_project.model_name": {
      "unique_id": "model.my_project.model_name",
      "config": {"materialized": "table", "sort": "id"},
      "tags": ["abc", "123"],
      "path": "models/path/to/model_name.sql",
      ...
    },
    ...
  },
  "sources": {
    "source.my_project.snowplow.event": {
      "unique_id": "source.my_project.snowplow.event",
      "database": "analytics",
      "schema": "analytics",
      "tags": ["abc", "123"],
      "path": "models/path/to/schema.yml",
      ...
    },
    ...
  },
  "exposures": {
    "exposure.my_project.traffic_dashboard": {
      "unique_id": "exposure.my_project.traffic_dashboard",
      "type": "dashboard",
      "maturity": "high",
      "path": "models/path/to/schema.yml",
      ...
    },
    ...
  },
  "metrics": {
    "metric.my_project.count_all_events": {
      "unique_id": "metric.my_project.count_all_events",
      "type": "count",
      "path": "models/path/to/schema.yml",
      ...
    },
    ...
  },
  "groups": {
    "group.my_project.finance": {
      "unique_id": "group.my_project.finance",
      "name": "finance",
      "owner": {
        "email": "finance@jaffleshop.com"
      }
      ...
    },
    ...
  }
}
```

Точный контракт для этих узлов моделей и источников в настоящее время не задокументирован, но в будущем это изменится.

### Доступ к моделям

Записи `model` в словаре `graph` будут неполными или некорректными во время парсинга. Если вы обращаетесь к моделям вашего проекта через переменную `graph`, обязательно используйте флаг [execute](/reference/dbt-jinja-functions/execute), чтобы этот код выполнялся только во время выполнения (run‑time), а не во время парсинга. Не используйте переменную `graph` для построения DAG, так как поведение dbt в этом случае будет неопределённым и, скорее всего, некорректным. Пример использования:

<File name='graph-usage.sql'>

```sql

/*
  Print information about all of the models in the Snowplow package
*/

{% if execute %}
  {% for node in graph.nodes.values()
     | selectattr("resource_type", "equalto", "model")
     | selectattr("package_name", "equalto", "snowplow") %}
  
    {% do log(node.unique_id ~ ", materialized: " ~ node.config.materialized, info=true) %}
  
  {% endfor %}
{% endif %}

/*
  Example output
---------------------------------------------------------------
model.snowplow.snowplow_id_map, materialized: incremental
model.snowplow.snowplow_page_views, materialized: incremental
model.snowplow.snowplow_web_events, materialized: incremental
model.snowplow.snowplow_web_page_context, materialized: table
model.snowplow.snowplow_web_events_scroll_depth, materialized: incremental
model.snowplow.snowplow_web_events_time, materialized: incremental
model.snowplow.snowplow_web_events_internal_fixed, materialized: ephemeral
model.snowplow.snowplow_base_web_page_context, materialized: ephemeral
model.snowplow.snowplow_base_events, materialized: ephemeral
model.snowplow.snowplow_sessions_tmp, materialized: incremental
model.snowplow.snowplow_sessions, materialized: table
*/
```

</File>

### Доступ к источникам

Чтобы программно получить доступ к источникам в вашем dbt‑проекте, используйте атрибут `sources` объекта `graph`.

Пример использования:

<File name='models/events_unioned.sql'>

```sql
/*
  Union all of the Snowplow sources defined in the project
  which begin with the string "event_"
*/

{% set sources = [] -%}
{% for node in graph.sources.values() -%}
  {%- if node.name.startswith('event_') and node.source_name == 'snowplow' -%}
    {%- do sources.append(source(node.source_name, node.name)) -%}
  {%- endif -%}
{%- endfor %}

select * from (
  {%- for source in sources %}
    select * from {{ source }} {% if not loop.last %} union all {% endif %}
  {% endfor %}
)

/*
  Example compiled SQL
---------------------------------------------------------------
select * from (
  select * from raw.snowplow.event_add_to_cart union all
  select * from raw.snowplow.event_remove_from_cart union all
  select * from raw.snowplow.event_checkout
)
*/

```

</File>

### Доступ к exposures

Чтобы программно получить доступ к exposures в вашем dbt‑проекте, используйте атрибут `exposures` объекта `graph`.

Пример использования:

<File name='models/my_important_view_model.sql'>

```sql
{# Include a SQL comment naming all of the exposures that this model feeds into #}

{% set exposures = [] -%}
{% for exposure in graph.exposures.values() -%}
  {%- if model['unique_id'] in exposure.depends_on.nodes -%}
    {%- do exposures.append(exposure) -%}
  {%- endif -%}
{%- endfor %}

-- HELLO database administrator! Before dropping this view,
-- please be aware that doing so will affect:

{% for exposure in exposures %}
--   * {{ exposure.name }} ({{ exposure.type }})
{% endfor %}

/*
  Example compiled SQL
---------------------------------------------------------------
-- HELLO database administrator! Before dropping this view,
-- please be aware that doing so will affect:

--   * our_metrics (dashboard)
--   * my_sync (application)
*/

```

</File>

### Доступ к метрикам

Чтобы программно получить доступ к метрикам в вашем dbt‑проекте, используйте атрибут `metrics` объекта `graph`.

Пример использования:

<File name='macros/get_metric.sql'>

```sql
{% macro get_metric_sql_for(metric_name) %}

  {% set metrics = graph.metrics.values() %}
  
  {% set metric = (metrics | selectattr('name', 'equalto', metric_name) | list).pop() %}

  /* Elsewhere, I've defined a macro, get_metric_timeseries_sql, that will return 
     the SQL needed to perform a time-based rollup of this metric's calculation */

  {% set metric_sql = get_metric_timeseries_sql(
      relation = metric['model'],
      type = metric['type'],
      expression = metric['sql'],
      ...
  ) %}

  {{ return(metric_sql) }}

{% endmacro %}
```

</File>

### Доступ к группам

Чтобы программно получить доступ к группам в вашем dbt‑проекте, используйте атрибут `groups` объекта `graph`.

Пример использования:

<File name='macros/get_group.sql'>

```sql

{% macro get_group_owner_for(group_name) %}

  {% set groups = graph.groups.values() %}
  
  {% set owner = (groups | selectattr('owner', 'equalto', group_name) | list).pop() %}

  {{ return(owner) }}

{% endmacro %}
```

</File>
