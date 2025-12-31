---
title: "Классы dbt"
---

dbt имеет ряд классов, которые он использует для представления объектов в <Term id="data-warehouse" />, частей проекта dbt и результатов выполнения команды.

Эти классы часто полезны при создании продвинутых моделей и макросов dbt.

## Relation {#relation}

Объект `Relation` используется для вставки имен схем и <Term id="table" /> в SQL-код с соответствующими кавычками. Этот объект _всегда_ должен использоваться вместо прямой вставки значений с помощью `{{ schema }}.{{ table }}`. Кавычки для объекта Relation можно настроить с помощью [конфигурации `quoting`](/reference/project-configs/quoting).

### Создание отношений {#creating-relations}

`Relation` можно создать, вызвав метод класса `create` на классе `Relation`.

<File name='Relation.create'>

```python
class Relation:
  def create(database=None, schema=None, identifier=None,
             type=None):
  """
    database (optional): Имя базы данных для этого отношения
    schema (optional): Имя схемы (или набора данных, если используется BigQuery) для этого отношения
    identifier (optional): Имя идентификатора для этого отношения
    type (optional): Метаданные об этом отношении, например: "table", "view", "cte"
  """
```

</File>

### Использование отношений {#using-relations}

В дополнение к `api.Relation.create`, dbt возвращает Relation, когда вы используете [`ref`](/reference/dbt-jinja-functions/ref), [`source`](/reference/dbt-jinja-functions/source) или [`this`](/reference/dbt-jinja-functions/this).
<File name='relation_usage.sql'>

```jinja2
{% set relation = api.Relation.create(schema='snowplow', identifier='events') %}

-- Возвращает `database` для этого отношения
{{ relation.database }}

-- Возвращает `schema` (или набор данных) для этого отношения
{{ relation.schema }}

-- Возвращает `identifier` для этого отношения
{{ relation.identifier }}

-- Возвращает имя отношения без базы данных
{{ relation.include(database=false) }}

-- Возвращает true, если отношение является таблицей
{{ relation.is_table }}

-- Возвращает true, если отношение является представлением
{{ relation.is_view }}

-- Возвращает true, если отношение является cte
{{ relation.is_cte }}

```

</File>

## Column {#column}

Объект `Column` используется для кодирования информации о столбце в отношении.

<File name='column.py'>

```python
class Column(object):
  def __init__(self, column, dtype, char_size=None, numeric_size=None):
    """
      column: Имя столбца, представленного этим объектом
      dtype: Тип данных столбца (зависит от базы данных)
      char_size: Если dtype является типом переменной ширины символов, размер столбца, иначе None
      numeric_size: Если dtype является типом фиксированной точности чисел, размер столбца, иначе None
   """


# Пример использования:
col = Column('name', 'varchar', 255)
col.is_string() # True
col.is_numeric() # False
col.is_number() # False
col.is_integer() # False
col.is_float() # False
col.string_type() # character varying(255)
col.numeric_type('numeric', 12, 4) # numeric(12,4)
```

</File>

### API столбца {#column-api}

### Свойства {#properties}

- **char_size**: Возвращает максимальный размер для столбцов переменной ширины символов
- **column**: Возвращает имя столбца
- **data_type**: Возвращает тип данных столбца (включая размер/точность/масштаб)
- **dtype**: Возвращает тип данных столбца (без учета размера/точности/масштаба)
- **name**: Возвращает имя столбца (идентично `column`, предоставляется как псевдоним).
- **numeric_precision**: Возвращает максимальную точность для столбцов с фиксированной десятичной точностью
- **numeric_scale**: Возвращает максимальный масштаб для столбцов с фиксированной десятичной точностью
- **quoted**: Возвращает имя столбца, заключенное в кавычки

### Методы экземпляра {#instance-methods}

- **is_string()**: Возвращает True, если столбец является строковым типом (например, text, varchar), иначе False
- **is_numeric()**: Возвращает True, если столбец является типом фиксированной точности чисел (например, `numeric`), иначе False
- **is_number()**: Возвращает True, если столбец является числовым типом (например, `numeric`, `int`, `float` или подобным), иначе False
- **is_integer()**: Возвращает True, если столбец является целым числом (например, `int`, `bigint`, `serial` или подобным), иначе False
- **is_float()**: Возвращает True, если столбец является типом с плавающей запятой (например, `float`, `float64` или подобным), иначе False
- **string_size()**: Возвращает ширину столбца, если он является строковым типом, иначе возникает исключение

### Статические методы {#static-methods}

- **string_type(size)**: Возвращает пригодное для использования в базе данных представление строкового типа (например, `character varying(255)`)
- **numeric_type(dtype, precision, scale)**: Возвращает пригодное для использования в базе данных представление числового типа (например, `numeric(12, 4)`)

### Использование столбцов {#using-columns}

<File name='column_usage.sql'>

```jinja2
-- Строковый столбец
{%- set string_column = api.Column('name', 'varchar', char_size=255) %}

-- Возвращает true, если столбец является строкой
{{ string_column.is_string() }}

-- Возвращает true, если столбец является числовым
{{ string_column.is_numeric() }}

-- Возвращает true, если столбец является числом
{{ string_column.is_number() }}

-- Возвращает true, если столбец является целым числом
{{ string_column.is_integer() }}

-- Возвращает true, если столбец является типом с плавающей запятой
{{ string_column.is_float() }}

-- Числовой столбец
{%- set numeric_column = api.Column('distance_traveled', 'numeric', numeric_precision=12, numeric_scale=4) %}

-- Возвращает true, если столбец является строкой
{{ numeric_column.is_string() }}

-- Возвращает true, если столбец является числовым
{{ numeric_column.is_numeric() }}

-- Возвращает true, если столбец является числом
{{ numeric_column.is_number() }}

-- Возвращает true, если столбец является целым числом
{{ numeric_column.is_integer() }}

-- Возвращает true, если столбец является типом с плавающей запятой
{{ numeric_column.is_float() }}

-- Статические методы

-- Возвращает строковый тип данных для этого адаптера базы данных с заданным размером
{{ api.Column.string_type(255) }}

-- Возвращает числовой тип данных для этого адаптера базы данных с заданной точностью и масштабом
{{ api.Column.numeric_type('numeric', 12, 4) }}
```

</File>

## Столбцы BigQuery {#bigquery-columns}

Тип `Column` переопределяется как `BigQueryColumn` в проектах dbt для BigQuery. Этот объект работает так же, как и тип `Column`, описанный выше, за исключением дополнительных свойств и методов:

### Свойства {#properties-1}

- **fields**: Возвращает список подполей, содержащихся в поле (если столбец является STRUCT)
- **mode**: Возвращает "режим" столбца, например, `REPEATED`

### Методы экземпляра {#instance-methods-1}

**flatten()**: Возвращает уплощенный список `BigQueryColumns`, в котором подполей разворачиваются в отдельные столбцы. Например, это вложенное поле:

```
[{"hits": {"pageviews": 1, "bounces": 0}}]
```

будет развернуто в:
```
[{"hits.pageviews": 1, "hits.bounces": 0}]
```

## Объекты результата {#result-objects}

Выполнение ресурса в dbt генерирует объект `Result`. Этот объект содержит информацию о выполненном узле, времени выполнения, статусе и метаданных, возвращенных адаптером. В конце вызова dbt записывает эти объекты в [`run_results.json`](/reference/artifacts/run-results-json).

- `node`: Полное представление объекта ресурса dbt (модель, seed, snapshot, тест), выполненного, включая его `unique_id`
- `status`: Интерпретация dbt успеха, неудачи или ошибки во время выполнения
- `thread_id`: Какая нить выполнила этот узел? Например, `Thread-1`
- `execution_time`: Общее время, затраченное на выполнение этого узла, измеренное в секундах.
- `timing`: Массив, который разбивает время выполнения на этапы (часто `compile` + `execute`)
- `message`: Как dbt будет сообщать об этом результате в CLI, на основе информации, возвращенной из базы данных

import RowsAffected from '/snippets/_run-result.md'; 

<RowsAffected/>