---
title: "Классы dbt"
---

dbt использует несколько классов для представления объектов в <Term id="data-warehouse" />, частях проекта dbt и результатах команды.

Эти классы часто полезны при создании сложных моделей и макросов dbt.

## Relation

Объект `Relation` используется для интерполяции схемы и <Term id="table" /> имен в SQL код с соответствующей кавычкой. Этот объект следует _всегда_ использовать вместо интерполяции значений с помощью `{{ schema }}.{{ table }}` напрямую. Кавычки для объекта Relation можно настроить с помощью [`quoting` config](/reference/project-configs/quoting).

### Создание отношений

`Relation` можно создать, вызвав метод класса `create` на классе `Relation`.

<File name='Relation.create'>

```python
class Relation:
  def create(database=None, schema=None, identifier=None,
             type=None):
  """
    database (необязательно): Имя базы данных для этого отношения
    schema (необязательно): Имя схемы (или набора данных, если на BigQuery) для этого отношения
    identifier (необязательно): Имя идентификатора для этого отношения
    type (необязательно): Метаданные об этом отношении, например: "table", "view", "cte"
  """
```

</File>

### Использование отношений

В дополнение к `api.Relation.create`, dbt возвращает Relation, когда вы используете [`ref`](/reference/dbt-jinja-functions/ref), [`source`](/reference/dbt-jinja-functions/source) или  [`this`](/reference/dbt-jinja-functions/this).
<File name='relation_usage.sql'>

```jinja2
{% set relation = api.Relation.create(schema='snowplow', identifier='events') %}

-- Вернуть `database` для этого отношения
{{ relation.database }}

-- Вернуть `schema` (или набор данных) для этого отношения
{{ relation.schema }}

-- Вернуть `identifier` для этого отношения
{{ relation.identifier }}

-- Вернуть имя отношения без базы данных
{{ relation.include(database=false) }}

-- Вернуть true, если отношение является таблицей
{{ relation.is_table }}

-- Вернуть true, если отношение является представлением
{{ relation.is_view }}

-- Вернуть true, если отношение является cte
{{ relation.is_cte }}

```

</File>

## Column
Объект `Column` используется для кодирования информации о столбце в отношении.

<File name='column.py'>

```python
class Column(object):
  def __init__(self, column, dtype, char_size=None, numeric_size=None):
    """
      column: Имя столбца, представленного этим объектом
      dtype: Тип данных столбца (специфичный для базы данных)
      char_size: Если dtype является типом переменной ширины символов, размер столбца, иначе None
      numeric_size: Если dtype является типом фиксированной точности, размер столбца, иначе None
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

### API столбца

### Свойства

- **char_size**: Возвращает максимальный размер для столбцов переменной длины
- **column**: Возвращает имя столбца
- **data_type**: Возвращает тип данных столбца (с учетом размера/точности/масшта)
- **dtype**: Возвращает тип данных столбца (без учета размера/точности/масшта)
- **name**: Возвращает имя столбца (идентично `column`, предоставлено как псевдоним).
- **numeric_precision**: Возвращает максимальную точность для фиксированных десятичных столбцов
- **numeric_scale**: Возвращает максимальный масштаб для фиксированных десятичных столбцов
- **quoted**: Возвращает имя столбца, заключенное в кавычки

### Методы экземпляра

- **is_string()**: Возвращает True, если столбец является строковым типом (например, text, varchar), иначе False
- **is_numeric()**: Возвращает True, если столбец является типом фиксированной точности (например, `numeric`), иначе False
- **is_number()**: Возвращает True, если столбец является числовым типом (например, `numeric`, `int`, `float` или аналогичным), иначе False
- **is_integer()**: Возвращает True, если столбец является целым числом (например, `int`, `bigint`, `serial` или аналогичным), иначе False
- **is_float()**: Возвращает True, если столбец является типом float (например, `float`, `float64` или аналогичным), иначе False
- **string_size()**: Возвращает ширину столбца, если он является строковым типом, иначе возникает исключение

### Статические методы
- **string_type(size)**: Возвращает представление типа строки, пригодное для использования в базе данных (например, `character varying(255)`)
- **numeric_type(dtype, precision, scale)**: Возвращает представление числового типа, пригодное для использования в базе данных (например, `numeric(12, 4)`)

### Использование столбцов

<File name='column_usage.sql'>

```jinja2
-- Строковый столбец
{%- set string_column = api.Column('name', 'varchar', char_size=255) %}

-- Вернуть true, если столбец является строкой
{{ string_column.is_string() }}

-- Вернуть true, если столбец является числовым
{{ string_column.is_numeric() }}

-- Вернуть true, если столбец является числом
{{ string_column.is_number() }}

-- Вернуть true, если столбец является целым числом
{{ string_column.is_integer() }}

-- Вернуть true, если столбец является числом с плавающей запятой
{{ string_column.is_float() }}

-- Числовой столбец
{%- set numeric_column = api.Column('distance_traveled', 'numeric', numeric_precision=12, numeric_scale=4) %}

-- Вернуть true, если столбец является строкой
{{ numeric_column.is_string() }}

-- Вернуть true, если столбец является числовым
{{ numeric_column.is_numeric() }}

-- Вернуть true, если столбец является числом
{{ numeric_column.is_number() }}

-- Вернуть true, если столбец является целым числом
{{ numeric_column.is_integer() }}

-- Вернуть true, если столбец является числом с плавающей запятой
{{ numeric_column.is_float() }}

-- Статические методы

-- Вернуть строковый тип данных для этого адаптера базы данных с заданным размером
{{ api.Column.string_type(255) }}

-- Вернуть числовой тип данных для этого адаптера базы данных с заданной точностью и масштабом
{{ api.Column.numeric_type('numeric', 12, 4) }}
```

</File>

## Столбцы BigQuery
Тип `Column` переопределяется как `BigQueryColumn` в проектах dbt на BigQuery. Этот объект работает так же, как и тип `Column`, описанный выше, за исключением дополнительных свойств и методов:

### Свойства
- **fields**: Возвращает список подполей, содержащихся в поле (если столбец является STRUCT)
- **mode**: Возвращает "режим" столбца, например, `REPEATED`

### Методы экземпляра
**flatten()**: Возвращает плоский список `BigQueryColumns`, в котором подполе расширяется в свои собственные столбцы. Например, это вложенное поле:

```
[{"hits": {"pageviews": 1, "bounces": 0}}]
```

будет расширено до:
```
[{"hits.pageviews": 1, "hits.bounces": 0}]
```

## Объекты результата

Выполнение ресурса в dbt генерирует объект `Result`. Этот объект содержит информацию о выполненном узле, времени, статусе и метаданных, возвращенных адаптером. В конце вызова dbt записывает эти объекты в [`run_results.json`](/reference/artifacts/run-results-json).

- `node`: Полное представление объекта ресурса dbt (модель, seed, snapshot, test), включая его `unique_id`
- `status`: Интерпретация dbt успеха, неудачи или ошибки во время выполнения
- `thread_id`: Какой поток выполнил этот узел? Например, `Thread-1`
- `execution_time`: Общее время, затраченное на выполнение этого узла, измеряемое в секундах.
- `timing`: Массив, который разбивает время выполнения на этапы (часто `compile` + `execute`)
- `message`: Как dbt будет сообщать этот результат в CLI, на основе информации, возвращенной из базы данных

import RowsAffected from '/snippets/_run-result.md'; 

<RowsAffected/>