---
title: runtime_version
description: "Specify the Python runtime version used to run a Python user-defined function (UDF) on Snowflake and BigQuery."
sidebar_label: "runtime_version"
id: runtime-version
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
runtime_version: <string> # обязателен для Snowflake и BigQuery; необязателен и игнорируется в Databricks
```

</File>

## Определение {#definition}

При создании Python UDF необходимо указать версию Python, которая будет использоваться для выполнения функции, с помощью параметра `runtime_version`.

## Поддерживаемые версии {#supported-values}

- [Snowflake](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-introduction): `3.10`, `3.11`, `3.12` и `3.13`
- [BigQuery](https://cloud.google.com/bigquery/docs/user-defined-functions-python): `3.11`
- Databricks: Accepted for compatibility but has no effect. Databricks manages the Python runtime internally, so dbt displays a warning if you set it. Available in `dbt-databricks` v1.12+.

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

- [Пользовательские функции](/docs/build/udfs)
- [Свойства функций](/reference/function-properties)
- [Конфигурации функций](/reference/function-configs)
- [type](/reference/resource-configs/type)
- [volatility](/reference/resource-configs/volatility)
- [entry_point](/reference/resource-configs/entry-point)
- [packages](/reference/resource-configs/packages)
- [arguments](/reference/resource-properties/function-arguments)
- [returns](/reference/resource-properties/returns)
