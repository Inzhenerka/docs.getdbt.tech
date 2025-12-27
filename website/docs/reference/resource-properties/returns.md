---
title: returns
sidebar_label: "returns"
id: returns
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml


functions:
  - name: <function name>
    returns:
      data_type: <string> # обязательно; зависит от хранилища данных
      description: <markdown_string> # опционально

```

</File>

## Определение

Свойство `returns` определяет результат выполнения пользовательской функции (UDF). Это обязательное свойство для всех функций, которое указывает, какой тип данных функция будет возвращать при выполнении.

## Свойства

### data_type (обязательно)

Поле `data_type` задаёт тип данных, который возвращает функция. Это обязательное поле, и его значение должно соответствовать типам данных, поддерживаемым вашей конкретной платформой хранения данных.

:::important Типы данных зависят от хранилища
Значения `data_type` зависят от конкретного хранилища. Используйте синтаксис типов данных, который требуется вашим хранилищем:
- **Snowflake**: `STRING`, `NUMBER`, `BOOLEAN`, `TIMESTAMP_NTZ`, `VARIANT` и т.д.
- **BigQuery**: `STRING`, `INT64`, `BOOL`, `TIMESTAMP`, `ARRAY<STRING>`, `STRUCT` и т.д.
- **Redshift**: `VARCHAR`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, `SUPER` и т.д.
- **Postgres**: `TEXT`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, `JSONB` и т.д.

Обратитесь к документации вашего хранилища для получения полного списка поддерживаемых типов данных и их синтаксиса.
:::

### description

Необязательная строка в формате markdown, описывающая, что именно возвращает функция. Полезна для целей документирования.

## Примеры

### Простая скалярная функция

<File name='functions/schema.yml'>

```yml

functions:
  - name: is_valid_email
    description: Validates if a string is a properly formatted email address
    arguments:
      - name: email_string
        data_type: STRING
        description: The email address to validate
    returns:
      data_type: BOOLEAN
      description: Returns true if the string is a valid email format, false otherwise
```

</File>

### Функция со сложным типом возвращаемого значения

<File name='functions/schema.yml'>

```yml

functions:
  - name: calculate_metrics
    description: Calculates revenue and profit metrics
    arguments:
      - name: revenue
        data_type: DECIMAL(18,2)
      - name: cost
        data_type: DECIMAL(18,2)
    returns:
      data_type: DECIMAL(18,2)
      description: The calculated profit margin as a percentage
```

</File>

### Функция BigQuery с типом возвращаемого значения ARRAY

<File name='functions/schema.yml'>

```yml

functions:
  - name: split_tags
    description: Splits a comma-separated string into an array of tags
    arguments:
      - name: tag_string
        data_type: STRING
    returns:
      data_type: ARRAY<STRING>
      description: An array of individual tag strings
```

</File>

## Связанная документация

- [Пользовательские функции (UDF)](/docs/build/udfs)
- [Свойства функций](/reference/function-properties)
- [Конфигурации функций](/reference/function-configs)
- [Аргументы](/reference/resource-properties/function-arguments)
