---
title: runtime_version
sidebar_label: "runtime_version"
id: runtime-version
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      runtime_version: <string> # обязательно для Python UDF
```

</File>

## Определение {#definition}

При создании Python UDF необходимо указать версию Python, которая будет использоваться для выполнения функции, с помощью параметра `runtime_version`.

## Поддерживаемые версии {#supported-values}

- [Snowflake](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-introduction): `3.10`, `3.11`, `3.12` и `3.13`
- [BigQuery](https://cloud.google.com/bigquery/docs/user-defined-functions-python): `3.11`

## Пример {#example}

В этом примере для UDF используется версия Python `3.11`.

<File name='functions/schema.yml'>

```yaml
functions:
  - name: is_positive_int
    config:
      runtime_version: "3.11"
```
</File>

## Связанная документация {#related-documentation}

- [Пользовательские функции (UDF)](/docs/build/udfs)
- [Свойства функций](/reference/function-properties)
- [Конфигурации функций](/reference/function-configs)
- [Type](/reference/resource-configs/type)
- [Volatility](/reference/resource-configs/volatility)
- [entry_point](/reference/resource-configs/entry-point)
- [Аргументы](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
