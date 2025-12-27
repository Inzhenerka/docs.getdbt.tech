---
title: arguments (для функций)
sidebar_label: "arguments"
id: function-arguments
---
<VersionCallout version="1.11" /> 
import ArgumentsShared from '/snippets/_arguments-shared.md';

<File name='functions/<filename>.yml'>

```yml

functions:
  - name: <function name>
    arguments:
      - name: <arg name>
        data_type: <string> # зависит от хранилища данных
        description: <markdown_string>
        default_value: <string | boolean | integer> # опционально, доступно в Snowflake и Postgres

```

</File>

## Определение

<ArgumentsShared />

Для **functions** вы можете добавить свойство `arguments` к [свойствам функции](/reference/function-properties). Оно определяет параметры пользовательских функций (UDF) в вашем хранилище данных. Поле `data_type` для аргументов функции зависит от конкретного хранилища (например, `STRING`, `VARCHAR`, `INTEGER`) и должно соответствовать типам данных, поддерживаемым вашей платформой данных.

## Свойства

### name

Имя аргумента. Это обязательное поле, если указано свойство `arguments`.

### data_type

Тип данных, который ожидает хранилище для данного параметра. Это обязательное поле, если указано свойство `arguments`, и оно должно соответствовать типам данных, поддерживаемым вашей конкретной платформой данных.

:::important Типы данных, зависящие от хранилища

Значения `data_type` зависят от конкретного хранилища. Используйте синтаксис типов данных, который требуется вашим хранилищем:

- **Snowflake**: `STRING`, `NUMBER`, `BOOLEAN`, `TIMESTAMP_NTZ` и т.д.
- **BigQuery**: `STRING`, `INT64`, `BOOL`, `TIMESTAMP`, `ARRAY<STRING>` и т.д.
- **Redshift**: `VARCHAR`, `INTEGER`, `BOOLEAN`, `TIMESTAMP` и т.д.
- **Postgres**: `TEXT`, `INTEGER`, `BOOLEAN`, `TIMESTAMP` и т.д.

Полный список поддерживаемых типов данных смотрите в документации вашего хранилища.

:::

### description

Необязательная строка в формате markdown, описывающая аргумент. Полезно для целей документации.

### default_value

Используйте свойство `default_value`, чтобы сделать аргумент функции необязательным.

- Если аргумент не определён с помощью `default_value`, он становится обязательным, и при использовании функции вы должны передать для него значение. Если обязательный аргумент не передан, вызов функции завершится ошибкой.
- Аргументы с `default_value` являются необязательными &mdash; если вы не передадите значение для такого аргумента, хранилище использует значение, указанное в `default_value`.

Это свойство поддерживается в [Snowflake](https://docs.snowflake.com/en/developer-guide/udf-stored-procedure-arguments#designating-an-argument-as-optional) и [Postgres](https://www.postgresql.org/docs/current/sql-createfunction.html). 

При использовании `default_value` порядок аргументов имеет значение. Все обязательные аргументы (то есть аргументы без значений по умолчанию) должны идти перед необязательными. Ниже приведён пример с корректным порядком:

<File name='functions/schema.yml'>

```yml
functions:
  - name: sum_2_values
    description: Add two values together
    arguments:
      - name: val1 # this argument comes first because it has no default value
        data_type: integer
        description: The first value
      - name: val2
        data_type: integer
        description: The second value
        default_value: 0 
    returns:
      data_type: integer
```
</File>

В этом примере:
- `val1` не имеет `default_value`, поэтому является обязательным.
- `val2` имеет `default_value`, равный `0`, поэтому является необязательным. Если вы не передадите значение для `val2`, функция использует `0`.

Ниже приведены примеры вызова функции `sum_2_values`:

```text
sum_2_values(5)                # val1 = 5, val2 = 0 (используется значение по умолчанию, так как пользователь не указал val2)
sum_2_values(5, 10)            # val1 = 5, val2 = 10
sum_2_values()                 # ❌ ошибка: val1 является обязательным и должен быть передан
```

## Примеры

### Простые аргументы функций

<File name='functions/schema.yml'>

```yml

functions:
  - name: is_positive_int
    arguments:
      - name: a_string
        data_type: string
        description: "The string that I want to check if it's representing a positive integer (like '10')"
    returns:
      data_type: boolean
```

</File>

### Сложные типы данных

<File name='functions/schema.yml'>

```yml

functions:
  - name: calculate_discount
    arguments:
      - name: original_price
        data_type: DECIMAL(10,2)
        description: "The original price before discount"
      - name: discount_percent
        data_type: INTEGER
        description: "The discount percentage to apply"
    returns:
      data_type: DECIMAL(10,2)
      description: "The discounted price"
```

</File>

### Типы данных Array (пример для BigQuery)

<File name='functions/schema.yml'>

```yml

functions:
  - name: get_tags
    arguments:
      - name: tag_string
        data_type: STRING
        description: "Comma-separated string of tags"
    returns:
      data_type: ARRAY<STRING>
      description: "An array of individual tag strings"
```

</File>

## Связанная документация

- [Свойства функций](/reference/function-properties)
- [Конфигурации функций](/reference/function-configs)
- [Аргументы (для макросов)](/reference/resource-properties/arguments)
- [Returns](/reference/resource-properties/returns)
