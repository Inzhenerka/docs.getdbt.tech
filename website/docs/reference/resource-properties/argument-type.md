---
title: тип
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
Тип данных вашего аргумента. Обратите внимание, что это используется только в документационных целях — нет никаких ограничений на значения, которые вы можете использовать здесь.

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
        type: имя столбца или выражение
        description: "Имя столбца или выражение — все, что можно выбрать как столбец"

      - name: scale
        type: целое число
        description: "Количество знаков после запятой для округления. По умолчанию 2."

```

</File>