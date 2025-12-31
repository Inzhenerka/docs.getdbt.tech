---
title: "О переменной контекста on-run-end"
sidebar_label: "Контекст on-run-end"
id: "on-run-end-context"
description: "Используйте эти переменные в контексте для хуков `on-run-end`."
---

:::caution Внимание

Эти переменные доступны только в контексте для хуков `on-run-end`. Они будут равны `none`, если использовать их вне хука `on-run-end`!

:::

## schemas {#schemas}

Переменная контекста `schemas` может быть использована для ссылки на схемы, в которые dbt создал модели во время выполнения. Эта переменная может быть использована для предоставления прав на использование этих схем определенным пользователям в конце выполнения dbt.

Пример:

<File name='dbt_project.yml'>

```sql

on-run-end:
 - "{% for schema in schemas %}grant usage on schema {{ schema }} to db_reader;{% endfor %}"

```

</File>

На практике, возможно, стоит поместить этот код в макрос:

<File name='macros/grants.sql'>

```jinja2

{% macro grant_usage_to_schemas(schemas, user) %}
  {% for schema in schemas %}
    grant usage on schema {{ schema }} to {{ user }};
  {% endfor %}
{% endmacro %}

```

</File>

<File name='dbt_project.yml'>

```yaml

on-run-end:
 - "{{ grant_usage_to_schemas(schemas, 'user') }}"

```

</File>

## database_schemas {#database_schemas}

Переменная контекста `database_schemas` может быть использована для ссылки на базы данных _и_ схемы, в которые dbt создал модели во время выполнения. Эта переменная аналогична переменной `schemas` и должна использоваться, если выполнение dbt создает ресурсы в нескольких разных базах данных.

Пример:

<File name='macros/grants.sql'>

```jinja2

{% macro grant_usage_to_schemas(database_schemas, user) %}
  {% for (database, schema) in database_schemas %}
    grant usage on {{ database }}.{{ schema }} to {{ user }};
  {% endfor %}
{% endmacro %}

```

</File>

<File name='dbt_project.yml'>

```yaml

on-run-end:
 - "{{ grant_usage_to_schemas(database_schemas, user) }}"

```

</File>

## Results {#results}

Переменная `results` содержит список [объектов Result](/reference/dbt-classes#result-objects) с одним элементом на каждый ресурс, выполненный в задаче dbt. Объект Result предоставляет доступ в контексте Jinja on-run-end к информации, которая будет заполнять [артефакт JSON результатов выполнения](/reference/artifacts/run-results-json).

Пример использования:

<File name='macros/log_results.sql'>

```sql
{% macro log_results(results) %}

  {% if execute %}
  {{ log("========== Begin Summary ==========", info=True) }}
  {% for res in results -%}
    {% set line -%}
        node: {{ res.node.unique_id }}; status: {{ res.status }} (message: {{ res.message }})
    {%- endset %}

    {{ log(line, info=True) }}
  {% endfor %}
  {{ log("========== End Summary ==========", info=True) }}
  {% endif %}

{% endmacro %}
```

</File>

<File name='dbt_project.yml'>

```yaml

on-run-end: "{{ log_results(results) }}"
```

</File>

Результаты:
```
12:48:17 | Concurrency: 1 threads (target='dev')
12:48:17 |
12:48:17 | 1 of 2 START view model dbt_jcohen.abc............................... [RUN]
12:48:17 | 1 of 2 OK created view model dbt_jcohen.abc.......................... [CREATE VIEW in 0.11s]
12:48:17 | 2 of 2 START table model dbt_jcohen.def.............................. [RUN]
12:48:17 | 2 of 2 ERROR creating table model dbt_jcohen.def..................... [ERROR in 0.09s]
12:48:17 |
12:48:17 | Running 1 on-run-end hook
========== Begin Summary ==========
node: model.testy.abc; status: success (message: CREATE VIEW)
node: model.testy.def; status: error (message: Database Error in model def (models/def.sql)
  division by zero
  compiled SQL at target/run/testy/models/def.sql)
========== End Summary ==========
12:48:17 | 1 of 1 START hook: testy.on-run-end.0................................ [RUN]
12:48:17 | 1 of 1 OK hook: testy.on-run-end.0................................... [OK in 0.00s]
12:48:17 |
12:48:17 |
12:48:17 | Finished running 1 view model, 1 table model, 1 hook in 1.94s.
```