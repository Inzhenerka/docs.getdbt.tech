---
title: "О кросс-базовых макросах"
sidebar_label: "кросс-базовые макросы"
id: "cross-database-macros"
description: "Прочитайте это руководство, чтобы понять кросс-базовые макросы в dbt."
---

# Кросс-базовые макросы

Эти макросы полезны для трех различных групп пользователей:
- Если вы поддерживаете пакет, ваш пакет с большей вероятностью будет работать с другими адаптерами, если вы используете эти макросы (вместо специфического синтаксиса SQL для конкретной базы данных).
- Если вы поддерживаете адаптер, ваш адаптер с большей вероятностью будет поддерживать больше пакетов, если вы реализуете (и протестируете) эти макросы.
- Если вы конечный пользователь, больше пакетов и адаптеров, вероятно, будут "просто работать" для вас (без необходимости что-либо делать).

:::note Примечание
Пожалуйста, убедитесь, что вы ознакомились с разделом [SQL выражения](#sql-expressions), чтобы понять синтаксис кавычек для строковых значений и литералов дат.
:::

## Все функции (в алфавитном порядке)

- [Кросс-базовые макросы](#cross-database-macros)
  - [Все функции (в алфавитном порядке)](#all-functions-alphabetical)
  - [Функции типов данных](#data-type-functions)
    - [type\_bigint](#type_bigint)
    - [type\_boolean](#type_boolean)
    - [type\_float](#type_float)
    - [type\_int](#type_int)
    - [type\_numeric](#type_numeric)
    - [type\_string](#type_string)
    - [type\_timestamp](#type_timestamp)
    - [current\_timestamp](#current_timestamp)
  - [Функции множеств](#set-functions)
    - [except](#except)
    - [intersect](#intersect)
  - [Функции массивов](#array-functions)
    - [array\_append](#array_append)
    - [array\_concat](#array_concat)
    - [array\_construct](#array_construct)
  - [Строковые функции](#string-functions)
    - [concat](#concat)
    - [hash](#hash)
    - [length](#length)
    - [position](#position)
    - [replace](#replace)
    - [right](#right)
    - [split\_part](#split_part)
  - [Функции строковых литералов](#string-literal-functions)
    - [escape\_single\_quotes](#escape_single_quotes)
    - [string\_literal](#string_literal)
  - [Агрегатные и оконные функции](#aggregate-and-window-functions)
    - [any\_value](#any_value)
    - [bool\_or](#bool_or)
    - [listagg](#listagg)
  - [Функции приведения типов](#cast-functions)
    - [cast](#cast)
    - [cast\_bool\_to\_text](#cast_bool_to_text)
    - [safe\_cast](#safe_cast)
  - [Функции даты и времени](#date-and-time-functions)
    - [date](#date)
    - [dateadd](#dateadd)
    - [datediff](#datediff)
    - [date\_trunc](#date_trunc)
    - [last\_day](#last_day)
  - [Части даты и времени](#date-and-time-parts)
  - [SQL выражения](#sql-expressions)

[**Функции типов данных**](#data-type-functions)
- [type_bigint](#type_bigint)
- [type_boolean](#type_boolean)
- [type_float](#type_float)
- [type_int](#type_int)
- [type_numeric](#type_numeric)
- [type_string](#type_string)
- [type_timestamp](#type_timestamp)

[**Функции множеств**](#set-functions)
- [except](#except)
- [intersect](#intersect)

[**Функции массивов**](#array-functions)
- [array_append](#array_append)
- [array_concat](#array_concat)
- [array_construct](#array_construct)

[**Строковые функции**](#string-functions)
- [concat](#concat)
- [hash](#hash)
- [length](#length)
- [position](#position)
- [replace](#replace)
- [right](#right)
- [split_part](#split_part)

[**Функции строковых литералов**](#string-literal-functions)
- [escape_single_quotes](#escape_single_quotes)
- [string_literal](#string_literal)

[**Агрегатные и оконные функции**](#aggregate-and-window-functions)
- [any_value](#any_value)
- [bool_or](#bool_or)
- [listagg](#listagg)

[**Функции приведения типов**](#cast-functions)
- [cast](#cast)
- [cast_bool_to_text](#cast_bool_to_text)
- [safe_cast](#safe_cast)

[**Функции даты и времени**](#date-and-time-functions)
- [date](#date)
- [dateadd](#dateadd)
- [datediff](#datediff)
- [date_trunc](#date_trunc)
- [last_day](#last_day)

## Функции типов данных

### type_bigint
__Аргументы__:

 * Нет

Этот макрос возвращает специфичный для базы данных тип данных для `BIGINT`.

**Использование**:

```sql
{{ dbt.type_bigint() }}
```

**Пример вывода (PostgreSQL)**:

```sql
bigint
```

### type_boolean

__Аргументы__:

 * Нет

Этот макрос возвращает специфичный для базы данных тип данных для `BOOLEAN`.

**Использование**:

```sql
{{ dbt.type_boolean() }}
```

**Пример вывода (PostgreSQL)**:

```sql
BOOLEAN
```

### type_float

__Аргументы__:

 * Нет

Этот макрос возвращает специфичный для базы данных тип данных для `FLOAT`.

**Использование**:

```sql
{{ dbt.type_float() }}
```

**Пример вывода (PostgreSQL)**:

```sql
FLOAT
```

### type_int
__Аргументы__:

 * Нет

Этот макрос возвращает специфичный для базы данных тип данных для `INT`.

**Использование**:

```sql
{{ dbt.type_int() }}
```

**Пример вывода (PostgreSQL)**:

```sql
INT
```

### type_numeric

__Аргументы__:

 * Нет

Этот макрос возвращает специфичный для базы данных тип данных для `NUMERIC`.

**Использование**:

```sql
{{ dbt.type_numeric() }}
```

**Пример вывода (PostgreSQL)**:

```sql
numeric(28,6)
```

### type_string
__Аргументы__:

 * Нет

Этот макрос возвращает специфичный для базы данных тип данных для `TEXT`.

**Использование**:

```sql
{{ dbt.type_string() }}
```

**Пример вывода (PostgreSQL)**:

```sql
TEXT
```

### type_timestamp
__Аргументы__:

 * Нет

Этот макрос возвращает специфичный для базы данных тип данных для `TIMESTAMP` (который может или не может соответствовать поведению `TIMESTAMP WITHOUT TIMEZONE` из ANSI SQL-92).

**Использование**:

```sql
{{ dbt.type_timestamp() }}
```

**Пример вывода (PostgreSQL)**:

```sql
TIMESTAMP
```

### current_timestamp

Этот макрос возвращает текущую дату и время для системы. В зависимости от адаптера:

- Результат может быть осведомленным или неосведомленным временным штампом.
- Результат может соответствовать началу оператора или началу транзакции.

**Аргументы**
- Нет

**Использование**
- Вы можете использовать макрос `current_timestamp()` в ваших SQL файлах dbt следующим образом:

```sql
{{ dbt.current_timestamp() }}
```
**Пример вывода (PostgreSQL)**

```sql
now()
```

## Функции множеств

### except
__Аргументы__:

 * Нет

`except` является одним из операторов множеств, указанных в ANSI SQL-92 (наряду с `union` и `intersect`) и аналогичен [разности множеств](https://en.wikipedia.org/wiki/Complement_(set_theory)#Relative_complement).

**Использование**:

```sql
{{ dbt.except() }}
```

**Пример вывода (PostgreSQL)**:

```sql
except
```

### intersect
__Аргументы__:

 * Нет

`intersect` является одним из операторов множеств, указанных в ANSI SQL-92 (наряду с `union` и `except`) и аналогичен [пересечению множеств](https://en.wikipedia.org/wiki/Intersection_(set_theory)).

**Использование**:

```sql
{{ dbt.intersect() }}
```

**Пример вывода (PostgreSQL)**:

```sql
intersect
```

## Функции массивов

### array_append
__Аргументы__:

 * `array` (обязательный): Массив, к которому нужно добавить элемент.
 * `new_element` (обязательный): Элемент, который нужно добавить. Этот элемент должен *соответствовать типу данных существующих элементов* в массиве, чтобы соответствовать функциональности PostgreSQL, и *не должен быть null*, чтобы соответствовать функциональности BigQuery.

Этот макрос добавляет элемент в конец массива и возвращает обновленный массив.

**Использование**:

```sql
{{ dbt.array_append("array_column", "element_column") }}
{{ dbt.array_append("array_column", "5") }}
{{ dbt.array_append("array_column", "'blue'") }}
```

**Пример вывода (PostgreSQL)**:

```sql
array_append(array_column, element_column)
array_append(array_column, 5)
array_append(array_column, 'blue')
```

### array_concat
__Аргументы__:

 * `array_1` (обязательный): Массив, к которому нужно добавить другой массив.
 * `array_2` (обязательный): Массив, который будет добавлен к `array_1`. Этот массив должен соответствовать типу данных `array_1`, чтобы соответствовать функциональности PostgreSQL.

Этот макрос возвращает конкатенацию двух массивов.

**Использование**:

```sql
{{ dbt.array_concat("array_column_1", "array_column_2") }}
```

**Пример вывода (PostgreSQL)**:

```sql
array_cat(array_column_1, array_column_2)
```

### array_construct
__Аргументы__:

 * `inputs` (необязательный): Список содержимого массива. Если не предоставлено, этот макрос создаст пустой массив. Все входные данные должны быть *одного типа данных*, чтобы соответствовать функциональности PostgreSQL, и *не должны быть null*, чтобы соответствовать функциональности BigQuery.
 * `data_type` (необязательный): Указывает тип данных создаваемого массива. Это имеет значение только при создании пустого массива (в противном случае будет использоваться тип данных входных данных). Если `inputs` и `data_type` оба не предоставлены, этот макрос создаст пустой массив типа integer.

Этот макрос возвращает массив, созданный из набора входных данных.

**Использование**:

```sql
{{ dbt.array_construct(["column_1", "column_2", "column_3"]) }}
{{ dbt.array_construct([], "integer") }}
{{ dbt.array_construct([1, 2, 3, 4]) }}
{{ dbt.array_construct(["'blue'", "'green'"]) }}
```

**Пример вывода (PostgreSQL)**:

```sql
array[ column_1 , column_2 , column_3 ]
array[]::integer[]
array[ 1 , 2 , 3 , 4 ]
array[ 'blue' , 'green' ]
```

## Строковые функции

### concat
__Аргументы__:

 * `fields`: Массив Jinja из [имен атрибутов или выражений](#sql-expressions).

Этот макрос объединяет список строк.

**Использование**:

```sql
{{ dbt.concat(["column_1", "column_2"]) }}
{{ dbt.concat(["year_column", "'-'" , "month_column", "'-'" , "day_column"]) }}
{{ dbt.concat(["first_part_column", "'.'" , "second