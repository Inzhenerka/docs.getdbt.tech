---
title: type
resource_types: macro_argument
datatype: argument_type
---

<File name='macros/<filename>.yml'>

```yml
version: 2

macros:
  - name: <macro name>
    arguments:
      - name: <arg name>
        type: <string>

```

</File>

## Определение
Тип данных вашего аргумента. Обратите внимание, что это используется только в целях документации — здесь нет ограничений на значения, которые вы можете использовать.

## Примеры
### Документирование макроса

<File name='macros/cents_to_dollars.sql'>

```sql
{% macro cents_to_dollars(column_name, scale=2) %}
    ({{ column_name }} / 100)::numeric(16, {{ scale }})
{% endmacro %}

```

</File>

<File name='macros/cents_to_dollars.yml'>

```yml
version: 2

macros:
  - name: cents_to_dollars
    arguments:
      - name: column_name
        type: column name or expression
        description: "Имя столбца или выражение — все, что может быть выбрано как столбец"

      - name: scale
        type: integer
        description: "Количество десятичных знаков для округления. По умолчанию 2."

```

</File>