---
title: "О переменной контекста on-run-end"
sidebar_label: "Контекст on-run-end"
id: "on-run-end-context"
description: "Используйте эти переменные в контексте для хуков `on-run-end`."
---

:::caution Внимание

Эти переменные доступны только в контексте хуков `on-run-end`. Если они используются вне хука `on-run-end`, то будут иметь значение `none`!

:::

## schemas

Переменная контекста `schemas` может использоваться для ссылки на схемы, в которые dbt создал модели во время выполнения dbt. Эта переменная может быть использована для предоставления прав на использование этих схем определенным пользователям в конце выполнения dbt.

Пример:

<File name='dbt_project.yml'>

```sql

on-run-end:
 - "{% for schema in schemas %}grant usage on schema {{ schema }} to db_reader;{% endfor %}"

```

</File>

На практике может быть неплохой идеей поместить этот код в макрос:

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

## database_schemas

Переменная контекста `database_schemas` может использоваться для ссылки на базы данных _и_ схемы, в которые dbt создал модели во время выполнения dbt. Эта переменная аналогична переменной `schemas` и должна использоваться, если выполнение dbt создает ресурсы в нескольких различных базах данных.

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

## Results

Переменная `results` содержит список [объектов Result](/reference/dbt-classes#result-objects) с одним элементом для каждого ресурса, который был выполнен в задаче dbt. Объект Result предоставляет доступ в контексте Jinja on-run-end к информации, которая будет заполнять [артефакт JSON результатов выполнения](/reference/artifacts/run-results-json).

Пример использования:

<File name='macros/log_results.sql'>

```sql
{% macro log_results(results) %}

  {% if execute %}
  {{ log("========== Начало сводки ==========", info=True) }}
  {% for res in results -%}
    {% set line -%}
        node: {{ res.node.unique_id }}; status: {{ res.status }} (message: {{ res.message }})
    {%- endset %}

    {{ log(line, info=True) }}
  {% endfor %}
  {{ log("========== Конец сводки ==========", info=True) }}
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
12:48:17 | Конкуренция: 1 поток (target='dev')
12:48:17 |
12:48:17 | 1 из 2 НАЧАЛО представления модели dbt_jcohen.abc............................... [RUN]
12:48:17 | 1 из 2 ОК создано представление модели dbt_jcohen.abc.......................... [CREATE VIEW in 0.11s]
12:48:17 | 2 из 2 НАЧАЛО таблицы модели dbt_jcohen.def.............................. [RUN]
12:48:17 | 2 из 2 ОШИБКА при создании таблицы модели dbt_jcohen.def..................... [ERROR in 0.09s]
12:48:17 |
12:48:17 | Выполнение 1 хука on-run-end
========== Начало сводки ==========
node: model.testy.abc; status: success (message: CREATE VIEW)
node: model.testy.def; status: error (message: Database Error in model def (models/def.sql)
  division by zero
  compiled SQL at target/run/testy/models/def.sql)
========== Конец сводки ==========
12:48:17 | 1 из 1 НАЧАЛО хука: testy.on-run-end.0................................ [RUN]
12:48:17 | 1 из 1 ОК хук: testy.on-run-end.0................................... [OK in 0.00s]
12:48:17 |
12:48:17 |
12:48:17 | Завершено выполнение 1 представления модели, 1 таблицы модели, 1 хука за 1.94s.
```