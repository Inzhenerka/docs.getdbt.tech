---
title: "О переменной контекста project_name"
sidebar_label: "project_name"
id: "project_name"
description: "Прочтите это руководство, чтобы понять функцию Jinja project_name в dbt."
---

Переменная контекста `project_name` возвращает `name` для проекта верхнего уровня, который выполняется с помощью dbt. Эта переменная может быть использована для передачи выполнения макросу проекта верхнего уровня, если он существует.

### Пример использования

<File name="redshift/macros/helper.sql">

```sql
/*
  Этот макрос выполняет очистку таблиц в базе данных Redshift. Если в проекте верхнего уровня существует макрос с именем `get_tables_to_vacuum`, этот макрос вызовет _тот_ макрос для определения таблиц, которые нужно очистить. Если макрос не определен в корневом проекте, этот макрос использует стандартную реализацию.
*/

{% macro vacuum_tables() %}

  {% set root_project = context[project_name] %}
  {% if root_project.get_tables_to_vacuum %}
    {% set tables = root_project.get_tables_to_vacuum() %}
  {% else %}
    {% set tables = redshift.get_tables_to_vacuum() %}
  {% endif %}

  {% for table in tables %}
    {% do redshift.vacuum_table(table) %}
  {% endfor %}

{% endmacro %}
```

</File>