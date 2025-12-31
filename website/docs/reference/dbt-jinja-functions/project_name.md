---
title: "О контекстной переменной project_name"
sidebar_label: "project_name"
id: "project_name"
description: "Прочитайте это руководство, чтобы понять Jinja-функцию project_name в dbt."
---

Контекстная переменная `project_name` возвращает значение `name` для корневого проекта,
который в данный момент выполняется dbt. Эту переменную можно использовать для
делегирования выполнения макроса корневому проекту, если такой макрос существует.

### Пример использования {#example-usage}

<File name="redshift/macros/helper.sql">

```sql
/*
  Этот макрос выполняет vacuum таблиц в базе данных Redshift. Если в корневом
  проекте существует макрос с именем `get_tables_to_vacuum`, этот макрос вызовет
  _его_ для определения таблиц, которые нужно vacuum-ить. Если макрос не определён
  в корневом проекте, вместо этого будет использована реализация по умолчанию.
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
