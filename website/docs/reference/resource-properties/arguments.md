---
title: arguments (для макросов)
sidebar_label: "arguments"
id: arguments
---

import MacroArgsNote from '/snippets/_validate-macro-args.md';
import ArgumentsShared from '/snippets/_arguments-shared.md';

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

<ArgumentsShared />

Для **макросов** вы можете добавить секцию `arguments` в [свойства макроса](/reference/macro-properties). Это помогает документировать макрос и понимать, какие входные параметры он ожидает.

## type {#type}

<VersionBlock lastVersion="1.9">

Тип данных аргумента. Он используется только в целях документации — никаких ограничений на значения, которые вы можете указать здесь, не накладывается.

</VersionBlock>
<VersionBlock firstVersion="1.10">

Тип данных аргумента. Установка параметра [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation) в значение `true` гарантирует, что задокументированные имена аргументов макроса совпадают с аргументами в его определении, а также проверяет их типы на соответствие [поддерживаемым типам](#supported-types). Если установлено значение `false`, поле `type` используется только для документации, и никаких ограничений на указываемые значения нет.

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

Начиная с версии <Constant name="core" /> v1.10, при использовании флага [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation) dbt поддерживает следующие типы аргументов макросов:

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

Обратите внимание, что синтаксис типов напоминает Python, однако они используются исключительно для документации и валидации. Это не Python-типы.

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
