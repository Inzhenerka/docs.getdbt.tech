---
title: arguments (для макросов)
sidebar_label: "arguments"
id: arguments
---

import MacroArgsNote from '/snippets/_validate-macro-args.md';

<File name='macros/<filename>.yml'>

```yml


macros:
  - name: <macro name>
    arguments:
      - name: <arg name>
        [type](#supported-types): <string>
        description: <markdown_string>

```

</File>

## Определение {#definition}

The `arguments` property is used to define the parameters that a resource can accept. Each argument can have a `name`, a `type` field, and an optional `description`.

Для **макросов** вы можете добавить секцию `arguments` в [свойства макроса](/reference/macro-properties). Это помогает документировать макрос и понимать, какие входные параметры он ожидает.

## type {#type}

<VersionBlock lastVersion="1.9">

Тип данных аргумента. Он используется только в целях документации — никаких ограничений на значения, которые вы можете указать здесь, не накладывается.

</VersionBlock>
<VersionBlock firstVersion="1.10">

Тип данных аргумента. Если параметр [`validate_macro_args`](/reference/global-configs/behavior-flags/validate_macro_args) установлен в `true`, dbt проверяет, что имена аргументов макроса в документации совпадают с именами в определении макроса, а их типы входят в число [поддерживаемых типов](#supported-types). Если параметр установлен в `false`, `type` используется только для документации, и на указываемые значения не накладывается никаких ограничений.

</VersionBlock>

<MacroArgsNote />

<File name='macros/<filename>.yml'>

```yml

macros:
  - name: <macro name>
    arguments:
      - name: <arg name>
        type: <string>

```

</File>

### Поддерживаемые типы {#supported-types}

<VersionBlock lastVersion="1.99">

Начиная с <Constant name="dbt" /> v1.10, при использовании флага [`validate_macro_args`](/reference/global-configs/behavior-flags/validate_macro_args) dbt поддерживает следующие типы аргументов макросов:

- `string` или `str`
- `bool` (`boolean` не поддерживается и вызывает предупреждение о недопустимом типе)
- `integer` или `int`
- `float`
- `any`
- `list[<Type>]`, например, `list[string]`
- `dict[<Type>, <Type>]`, например, `dict[str, list[int]]`
- `optional[<Type>]`, например, `optional[integer]`
- [`relation`](/reference/dbt-classes#relation)
- [`column`](/reference/dbt-classes#column)

</VersionBlock>

<VersionBlock firstVersion="2.0">

При использовании флага [`validate_macro_args`](/reference/global-configs/behavior-flags/validate_macro_args) dbt поддерживает следующие типы аргументов макросов:

- `string` или `str`
- `boolean` или `bool`
- `integer` или `int`
- `float`
- `any`
- `list[<Type>]`, например `list[string]`
- `dict[<Type>, <Type>]`, например `dict[str, list[int]]`
- `optional[<Type>]`, например `optional[integer]`
- [`relation`](/reference/dbt-classes#relation)
- [`column`](/reference/dbt-classes#column)

</VersionBlock>

Обратите внимание, что типы оформлены в стиле Python, но используются только для документирования и валидации. Это не типы Python.

## Примеры {#examples}


<File name='macros/cents_to_dollars.sql'>

```sql
{% macro cents_to_dollars(column_name, scale=2) %}
    ({{ column_name }} / 100)::numeric(16, {{ scale }})
{% endmacro %}

```

</File>

<File name='macros/cents_to_dollars.yml'>

```yml

macros:
  - name: cents_to_dollars
    arguments:
      - name: column_name
        type: column
        description: "The name of a column"
      - name: scale
        type: integer
        description: "The number of decimal places to round to. Default is 2."

```

</File>

## Связанная документация {#related-documentation}

- [Свойства макросов](/reference/macro-properties)
- [arguments (для функций)](/reference/resource-properties/function-arguments)
