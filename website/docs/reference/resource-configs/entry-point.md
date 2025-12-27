---
title: entry_point
sidebar_label: "entry_point"
id: entry-point
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      entry_point: <string> # обязательно для Python UDF
```

</File>

## Определение

При создании Python UDF необходимо указать Python‑функцию, которая будет вызываться, с помощью параметра `entry_point`.

В настоящее время Python UDF поддерживаются в Snowflake и BigQuery. В каждом хранилище данных используется своё название для функции точки входа. В следующей таблице показано, как именно используется `entry_point`:

| Warehouse  | How `entry_point` is used | 
| -- | -- | 
| Snowflake | Преобразуется в имя `HANDLER` в `LANGUAGE PYTHON UDF` | 
| BigQuery | Преобразуется в `entry_point` в `OPTIONS(...)` |  

## Пример

Например, если у вас есть Python UDF в файле `functions/my_function.py` со следующим кодом, где функция `main` используется в качестве точки входа:

<File name='functions/my_function.py'>

```python
import re

def _digits_only(s: str) -> bool:
    return bool(re.search(r'^[0-9]+$', s or ''))

def _to_flag(is_match: bool) -> int:
    return 1 if is_match else 0

def main(a_string: str) -> int:
    """
    This is used as the entry point for the UDF.
    Returns 1 if a_string represents a positive integer (e.g., "10"),
    else 0.
    """
    return _to_flag(_digits_only(a_string))
```

</File>

После определения UDF вы можете указать `main` в качестве значения `entry_point` в YAML‑файле. Значение `entry_point: main` указывает на функцию `main` как на точку входа для UDF, тогда как `_digits_only` и `_to_flag` являются вспомогательными функциями.

<File name='functions/schema.yml'>

```yaml
functions:
  - name: is_positive_int
    description: Returns 1 if a_string matches ^[0-9]+$, else 0
    config:
      runtime_version: "3.11"    # required
      entry_point: main          # required: points to the function above
    arguments:
      - name: a_string
        data_type: string
    returns:
      data_type: integer

```
</File>

## Связанная документация

- [Пользовательские функции (UDF)](/docs/build/udfs)
- [Свойства функций](/reference/function-properties)
- [Конфигурации функций](/reference/function-configs)
- [Type](/reference/resource-configs/type)
- [Volatility](/reference/resource-configs/volatility)
- [runtime_version](/reference/resource-configs/runtime-version)
- [Аргументы](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
