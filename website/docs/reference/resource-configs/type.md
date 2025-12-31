---
title: type
sidebar_label: "type"
id: type
description: "Конфигурация type задаёт тип пользовательской функции (UDF), которую вы создаёте."
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: function_name
    config:
      type: scalar | aggregate 
```

</File>

В будущем мы рассматриваем возможность добавления поддержки типа `table`. Следите за прогрессом и оставляйте обратную связь в [этом issue](https://github.com/dbt-labs/dbt-core/issues/11917).

## Определение {#definition}

Конфигурация `type` определяет тип пользовательской функции (UDF), которую вы создаёте. Этот параметр является необязательным и по умолчанию принимает значение `scalar`, если он не указан.

## Поддерживаемые типы функций {#supported-function-types}

Поддерживаются следующие типы функций:
<!-- no toc -->
- [scalar (по умолчанию)](#scalar-default)
- [aggregate](#aggregate)

Поддержка параметра `type` зависит от используемого хранилища данных и языка (SQL или Python):

| Adapter	| scalar SQL	| scalar Python	| aggregate SQL	| aggregate Python |
| --- | --- | --- | --- | --- |
| dbt-bigquery	| ✅	| ✅	| ✅	| ❌ |
| dbt-snowflake	| ✅	| ✅	| ❌	| ✅ |
| dbt-databricks	| ✅	| ❌	| ❌	| ❌ |
| dbt-postgres	| ✅	| ❌	| ❌	| ❌ |
| dbt-redshift	| ✅	| ❌	| ❌	| ❌ |

### scalar (по умолчанию) {#scalar-default}

Скалярная функция возвращает одно значение для каждой входной строки. Это наиболее распространённый тип UDF.

**Примеры сценариев использования:**
- Валидация данных (проверка, соответствует ли строка шаблону)
- Преобразование данных (конвертация форматов, очистка строк)
- Пользовательские вычисления (сложные математические операции)

<File name='functions/schema.yml'>

```yml
functions:
  - name: is_positive_int
    description: Determines if a string represents a positive integer
    config:
      type: scalar
    arguments:
      - name: input_string
        data_type: STRING
    returns:
      data_type: BOOLEAN
```

</File>

### aggregate {#aggregate}

Агрегатные функции работают с несколькими строками и возвращают одно значение — например, суммируют значения или вычисляют среднее для группы. В запросах такие функции используются в операциях `GROUP BY`.

В настоящее время агрегатные функции поддерживаются только для:
- Python-функций в Snowflake
- SQL-функций в BigQuery

**Примеры сценариев использования:**
- Вычисление сумм или средних значений для групп данных (например, общий объём продаж по клиенту)
- Агрегация данных по времени (например, дневные, месячные или годовые итоги)

<File name='functions/schema.yml'>

```yml
functions:
  - name: double_total
    description: Sums values and doubles the result
    config:
      type: aggregate
    arguments:
      - name: values
        data_type: FLOAT
        description: A sequence of numbers to aggregate
    returns:
      data_type: FLOAT
```

</File>

## Связанная документация {#related-documentation}

- [Пользовательские функции (UDF)](/docs/build/udfs)
- [Свойства функций](/reference/function-properties)
- [Конфигурации функций](/reference/function-configs)
- [Volatility](/reference/resource-configs/volatility)
- [Аргументы](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
