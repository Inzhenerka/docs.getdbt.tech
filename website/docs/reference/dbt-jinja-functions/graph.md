---
title: "О переменной контекста graph"
sidebar_label: "graph"
id: "graph"
description: "Переменная контекста `graph` содержит информацию о узлах в вашем проекте."
---

Переменная контекста `graph` содержит информацию о _узлах_ в вашем проекте dbt. Модели, источники, тесты и снимки — все это примеры узлов в проектах dbt.

:::danger Внимание

dbt активно строит переменную `graph` в ходе [фазы разбора](/reference/dbt-jinja-functions/execute) выполнения проектов dbt, поэтому некоторые свойства переменной контекста `graph` могут отсутствовать или быть некорректными во время разбора. Пожалуйста, внимательно прочитайте информацию ниже, чтобы понять, как эффективно использовать эту переменную.

:::

### Переменная контекста graph

Переменная контекста `graph` представляет собой словарь, который сопоставляет идентификаторы узлов со словарными представлениями этих узлов. Упрощенный пример может выглядеть так:

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

Точный контракт для этих узлов моделей и источников в настоящее время не задокументирован, но это изменится в будущем.

### Доступ к моделям

Записи `model` в словаре `graph` будут неполными или некорректными во время разбора. Если вы обращаетесь к моделям в вашем проекте через переменную `graph`, обязательно используйте флаг [execute](/reference/dbt-jinja-functions/execute), чтобы гарантировать, что этот код выполняется только во время выполнения, а не во время разбора. Не используйте переменную `graph` для построения вашего DAG, так как поведение dbt в результате будет неопределенным и, вероятно, некорректным. Пример использования:

<File name='graph-usage.sql'>

```sql

/*
  Вывести информацию обо всех моделях в пакете Snowplow
*/

{% if execute %}
  {% for node in graph.nodes.values()
     | selectattr("resource_type", "equalto", "model")
     | selectattr("package_name", "equalto", "snowplow") %}
  
    {% do log(node.unique_id ~ ", materialized: " ~ node.config.materialized, info=true) %}
  
  {% endfor %}
{% endif %}

/*
  Пример вывода
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

Чтобы программно получить доступ к источникам в вашем проекте dbt, используйте атрибут `sources` объекта `graph`.

Пример использования:

<File name='models/events_unioned.sql'>

```sql
/*
  Объединить все источники Snowplow, определенные в проекте,
  которые начинаются со строки "event_"
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
  Пример скомпилированного SQL
---------------------------------------------------------------
select * from (
  select * from raw.snowplow.event_add_to_cart union all
  select * from raw.snowplow.event_remove_from_cart union all
  select * from raw.snowplow.event_checkout
)
*/

```

</File>

### Доступ к экспозициям

Чтобы программно получить доступ к экспозициям в вашем проекте dbt, используйте атрибут `exposures` объекта `graph`.

Пример использования:

<File name='models/my_important_view_model.sql'>

```sql
{# Включите SQL-комментарий, указывающий все экспозиции, в которые попадает эта модель #}

{% set exposures = [] -%}
{% for exposure in graph.exposures.values() -%}
  {%- if model['unique_id'] in exposure.depends_on.nodes -%}
    {%- do exposures.append(exposure) -%}
  {%- endif -%}
{%- endfor %}

-- ЗДРАВСТВУЙТЕ, администратор базы данных! Прежде чем удалить этот вид,
-- пожалуйста, имейте в виду, что это повлияет на:

{% for exposure in exposures %}
--   * {{ exposure.name }} ({{ exposure.type }})
{% endfor %}

/*
  Пример скомпилированного SQL
---------------------------------------------------------------
-- ЗДРАВСТВУЙТЕ, администратор базы данных! Прежде чем удалить этот вид,
-- пожалуйста, имейте в виду, что это повлияет на:

--   * our_metrics (dashboard)
--   * my_sync (application)
*/

```

</File>

### Доступ к метрикам

Чтобы программно получить доступ к метрикам в вашем проекте dbt, используйте атрибут `metrics` объекта `graph`.

Пример использования:

<File name='macros/get_metric.sql'>

```sql
{% macro get_metric_sql_for(metric_name) %}

  {% set metrics = graph.metrics.values() %}
  
  {% set metric = (metrics | selectattr('name', 'equalto', metric_name) | list).pop() %}

  /* В другом месте я определил макрос get_metric_timeseries_sql, который вернет 
     SQL, необходимый для выполнения временной агрегации расчета этой метрики */

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

Чтобы программно получить доступ к группам в вашем проекте dbt, используйте атрибут `groups` объекта `graph`.

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