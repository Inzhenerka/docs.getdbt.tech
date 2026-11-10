---
title: quote_args
description: "Определяет, заключает ли Snowflake имена аргументов в кавычки при создании пользовательской функции (UDF) на JavaScript с помощью dbt, что влияет на регистр этих имён."
sidebar_label: "quote_args"
id: quote_args
---
<VersionCallout version="1.12" />

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      snowflake:
        quote_args: true | false  # необязательно, по умолчанию: true
```

</File>

## Определение

При создании пользовательских функций (UDF) на JavaScript в Snowflake параметр `quote_args` определяет, заключаются ли имена аргументов в кавычки в инструкции `CREATE FUNCTION`. Значение по умолчанию — `true`.

Если `quote_args` имеет значение `true`, Snowflake заключает имена аргументов в кавычки, сохраняя их регистр в точности. В теле функции обращайтесь к аргументам, используя тот же регистр, что и в YAML (например, `a_string`).

Если `quote_args` имеет значение `false`, имена аргументов не заключаются в кавычки. Snowflake автоматически переводит их в верхний регистр, поэтому в теле функции необходимо обращаться к ним в верхнем регистре (например, `A_STRING`).

Эта настройка применяется только к UDF на JavaScript в Snowflake. Она не влияет на другие адаптеры или языки.

## Пример

В этом примере для `quote_args` задано значение `false`, поэтому имена аргументов не заключаются в кавычки в сгенерированной инструкции `CREATE FUNCTION`:

<File name='functions/is_positive_int.yml'>

```yaml
functions:
  - name: is_positive_int
    description: Возвращает 1, если строка представляет положительное целое число, иначе 0
    config:
      snowflake:
        quote_args: false
    arguments:
      - name: a_string
        data_type: string
    returns:
      data_type: integer
```
</File>

<File name='functions/is_positive_int.js'>

```js
return /^[0-9]+$/.test(A_STRING) ? 1 : 0;
```
</File>

При `quote_args: false` dbt генерирует:

```sql
CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
RETURNS INTEGER
LANGUAGE JAVASCRIPT
AS $$
return /^[0-9]+$/.test(A_STRING) ? 1 : 0;
$$;
```

При значении по умолчанию `quote_args: true` dbt генерирует:

```sql
CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int("a_string" STRING)
RETURNS INTEGER
LANGUAGE JAVASCRIPT
AS $$
return /^[0-9]+$/.test(a_string) ? 1 : 0;
$$;
```

## Связанная документация

- [Пользовательские функции](/docs/build/udfs)
- [Свойства функций](/reference/function-properties)
- [Настройки функций](/reference/function-configs)
- [volatility](/reference/resource-configs/volatility)
- [type](/reference/resource-configs/type)
- [arguments](/reference/resource-properties/function-arguments)
- [returns](/reference/resource-properties/returns)
