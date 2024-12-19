---
title: "О переменной контекста project_name"
sidebar_label: "project_name"
id: "project_name"
description: "Прочитайте это руководство, чтобы понять функцию Jinja project_name в dbt."
---

Переменная контекста `project_name` возвращает `name` корневого проекта, который выполняется с помощью dbt. Эта переменная может быть использована для отложенного выполнения макроса корневого проекта, если таковой существует.

### Пример использования

<File name="redshift/macros/helper.sql">

```sql
/*
  Этот макрос выполняет очистку таблиц в базе данных Redshift. Если в
  корневом проекте существует макрос с именем `get_tables_to_vacuum`, этот
  макрос вызовет _тот самый_ макрос для поиска таблиц, которые нужно очистить.
  Если макрос не определен в корневом проекте, этот макрос будет использовать
  реализацию по умолчанию.
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