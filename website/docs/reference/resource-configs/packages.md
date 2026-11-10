---
title: packages
description: "Укажите сторонние пакеты PyPI, необходимые пользовательской функции (UDF) на Python, чтобы хранилище данных установило их при создании функции."
sidebar_label: "packages"
id: packages
---

# packages

<VersionCallout version="1.12" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      packages: [<string>] # optional, Python UDFs only
```

</File>

## Определение

При создании UDF на Python можно использовать необязательную конфигурацию `packages`, чтобы указать общедоступные сторонние пакеты PyPI. Можно перечислить имена пакетов (например, `numpy` и `pandas`) и закрепить их версии (например, `pandas==1.5.0`). Хранилище данных устанавливает эти пакеты при создании UDF, чтобы функция могла использовать возможности внешних библиотек Python.

В Snowflake некоторые пакеты устанавливаются из репозитория Anaconda, и для их использования может потребоваться [принять условия обслуживания Anaconda](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages#using-third-party-packages-from-anaconda).

В настоящее время UDF на Python поддерживаются в Snowflake и BigQuery. Каждое хранилище данных использует свой механизм указания пакетов. Например:

<Tabs
  defaultValue="snowflake"
  values={[
    { label: 'Snowflake', value: 'snowflake', },
    { label: 'BigQuery', value: 'bigquery', },
  ]
}>

<TabItem value="snowflake">

<File name='functions/schema.yml'>

```yaml
functions:
  - name: is_positive_int
    description: Returns 1 if a_string matches ^[0-9]+$, else 0
    config:
      runtime_version: "3.11"
      entry_point: main
      packages:
        - numpy
        - pandas==1.5.0
    arguments:
      - name: a_string
        data_type: string
    returns:
      data_type: integer
```

</File>

Скомпилированный SQL:

```sql
CREATE OR REPLACE FUNCTION my_schema.is_positive_int(a_string STRING)
  RETURNS INTEGER
  LANGUAGE PYTHON
  RUNTIME_VERSION = '3.11'
  HANDLER = 'main'
  PACKAGES = ('numpy','pandas==1.5.0')
AS $$
def main(a_string):
    ...
$$
```

</TabItem>

<TabItem value="bigquery">

<File name='functions/schema.yml'>

```yaml
functions:
  - name: is_positive_int
    description: Returns 1 if a_string matches ^[0-9]+$, else 0
    config:
      runtime_version: "3.11"
      entry_point: main
      packages:
        - numpy
        - pandas==1.5.0
    arguments:
      - name: a_string
        data_type: string
    returns:
      data_type: integer
```

</File>

Скомпилированный SQL:

```sql
CREATE OR REPLACE FUNCTION my_dataset.is_positive_int(a_string STRING)
  RETURNS INT64
  LANGUAGE python
  OPTIONS(
    runtime_version = "python-3.11",
    entry_point = "main",
    packages = ['numpy', 'pandas==1.5.0']
  )
AS r'''
def main(a_string):
    ...
'''
```

</TabItem>

</Tabs>

## Связанная документация

- [Пользовательские функции](/docs/build/udfs)
- [Свойства функций](/reference/function-properties)
- [Конфигурации функций](/reference/function-configs)
- [runtime_version](/reference/resource-configs/runtime-version)
- [entry_point](/reference/resource-configs/entry-point)
- [type](/reference/resource-configs/type)
- [volatility](/reference/resource-configs/volatility)
- [arguments](/reference/resource-properties/function-arguments)
- [returns](/reference/resource-properties/returns)
