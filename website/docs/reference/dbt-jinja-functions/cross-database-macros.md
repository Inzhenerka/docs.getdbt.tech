---
title: "О кросс-базовым макросам"
sidebar_label: "кросс-базовые макросы"
id: "cross-database-macros"
description: "Прочтите это руководство, чтобы понять кросс-базовые макросы в dbt."
---

# Кросс-базовые макросы

Эти макросы полезны для трех различных групп пользователей:
- Если вы поддерживаете пакет, ваш пакет с большей вероятностью будет работать на других адаптерах, используя эти макросы (вместо SQL-синтаксиса конкретной базы данных).
- Если вы поддерживаете адаптер, ваш адаптер с большей вероятностью будет поддерживать больше пакетов, реализуя (и тестируя) эти макросы.
- Если вы конечный пользователь, больше пакетов и адаптеров, вероятно, будут "просто работать" для вас (без необходимости что-либо делать).

:::note Примечание
Пожалуйста, обязательно ознакомьтесь с [разделом о SQL-выражениях](#sql-expressions), чтобы понять синтаксис кавычек для строковых значений и литералов дат.
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
  - [SQL-выражения](#sql-expressions)

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

- Результат может быть с учетом часового пояса или без.
- Результат может соответствовать началу выполнения оператора или началу транзакции.

**Аргументы**
- Нет

**Использование**
- Вы можете использовать макрос `current_timestamp()` в ваших SQL-файлах dbt следующим образом:

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

`except` — это один из операторов множеств, определенных в ANSI SQL-92 (наряду с `union` и `intersect`), и аналогичен [разности множеств](https://en.wikipedia.org/wiki/Complement_(set_theory)#Relative_complement).

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

`intersect` — это один из операторов множеств, определенных в ANSI SQL-92 (наряду с `union` и `except`), и аналогичен [пересечению множеств](https://en.wikipedia.org/wiki/Intersection_(set_theory)).

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

 * `array` (обязательный): Массив, к которому добавляется элемент.
 * `new_element` (обязательный): Элемент, который будет добавлен. Этот элемент должен *соответствовать типу данных существующих элементов* в массиве, чтобы соответствовать функциональности PostgreSQL, и *не быть null*, чтобы соответствовать функциональности BigQuery.

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

 * `array_1` (обязательный): Массив, к которому добавляется другой массив.
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

 * `inputs` (необязательный): Список содержимого массива. Если не предоставлено, этот макрос создаст пустой массив. Все входные данные должны быть *одного типа данных*, чтобы соответствовать функциональности PostgreSQL, и *не быть null*, чтобы соответствовать функциональности BigQuery.
 * `data_type` (необязательный): Указывает тип данных создаваемого массива. Это актуально только при создании пустого массива (в противном случае будет использоваться тип данных входных данных). Если `inputs` и `data_type` не предоставлены, этот макрос создаст пустой массив типа integer.

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

 * `fields`: Jinja массив [имен атрибутов или выражений](#sql-expressions).

Этот макрос объединяет список строк.

**Использование**:

```sql
{{ dbt.concat(["column_1", "column_2"]) }}
{{ dbt.concat(["year_column", "'-'" , "month_column", "'-'" , "day_column"]) }}
{{ dbt.concat(["first_part_column", "'.'" , "second_part_column"]) }}
{{ dbt.concat(["first_part_column", "','" , "second_part_column"]) }}
```

**Пример вывода (PostgreSQL)**:

```sql
column_1 || column_2
year_column || '-' || month_column || '-' || day_column
first_part_column || '.' || second_part_column
first_part_column || ',' || second_part_column
```

### hash
__Аргументы__:

 * `field`: [имя атрибута или выражение](#sql-expressions).

Этот макрос предоставляет хэш (например, [MD5](https://en.wikipedia.org/wiki/MD5)) [выражения](#sql-expressions), приведенного к строке.

**Использование**:

```sql
{{ dbt.hash("column") }}
{{ dbt.hash("'Pennsylvania'") }}
```

**Пример вывода (PostgreSQL)**:

```sql
md5(cast(column as 
    varchar
))
md5(cast('Pennsylvania' as 
    varchar
))
```

### length
__Аргументы__:

 * `expression`: строковое [выражение](#sql-expressions).

Этот макрос вычисляет количество символов в строке.

**Использование**:

```sql
{{ dbt.length("column") }}
```

**Пример вывода (PostgreSQL)**:

```sql
    length(
        column
    )
```

### position
__Аргументы__:

 * `substring_text`: [имя атрибута или выражение](#sql-expressions).
 * `string_text`: [имя атрибута или выражение](#sql-expressions).

Этот макрос ищет первое вхождение `substring_text` в `string_text` и возвращает позицию, начиная с 1, если найдено.

**Использование**:

```sql
{{ dbt.position("substring_column", "text_column") }}
{{ dbt.position("'-'", "text_column") }}
```

**Пример вывода (PostgreSQL)**:

```sql
    position(
        substring_column in text_column
    )

    position(
        '-' in text_column
    )
```

### replace
__Аргументы__:

 * `field`: [имя атрибута или выражение](#sql-expressions).
 * `old_chars`: [имя атрибута или выражение](#sql-expressions).
 * `new_chars`: [имя атрибута или выражение](#sql-expressions).

Этот макрос обновляет строку и заменяет все вхождения одной подстроки на другую. Точное поведение может незначительно отличаться в зависимости от адаптера.

**Использование**:

```sql
{{ dbt.replace("string_text_column", "old_chars_column", "new_chars_column") }}
{{ dbt.replace("string_text_column", "'-'", "'_'") }}
```

**Пример вывода (PostgreSQL)**:

```sql
    replace(
        string_text_column,
        old_chars_column,
        new_chars_column
    )

    replace(
        string_text_column,
        '-',
        '_'
    )
```

### right
__Аргументы__:

 * `string_text`: [имя атрибута или выражение](#sql-expressions).
 * `length_expression`: числовое [выражение](#sql-expressions).

Этот макрос возвращает N правых символов из строки.

**Использование**:

```sql
{{ dbt.right("string_text_column", "length_column") }}
{{ dbt.right("string_text_column", "3") }}
```

**Пример вывода (PostgreSQL)**:

```sql
    right(
        string_text_column,
        length_column
    )

    right(
        string_text_column,
        3
    )
```

### split_part
__Аргументы__:

* `string_text` (обязательный): Текст, который нужно разделить на части.
* `delimiter_text` (обязательный): Текст, представляющий разделитель, по которому нужно разделить.
* `part_number` (обязательный): Запрашиваемая часть разделенного текста (начиная с 1). Если значение отрицательное, части считаются с конца строки.

Этот макрос разделяет строку текста, используя указанный разделитель, и возвращает указанную часть (индексация с 1).

**Использование**:

При ссылке на столбец используйте одну пару кавычек. При ссылке на строку используйте одинарные кавычки, заключенные в двойные.

```sql
{{ dbt.split_part(string_text='column_to_split', delimiter_text='delimiter_column', part_number=1) }}
{{ dbt.split_part(string_text="'1|2|3'", delimiter_text="'|'", part_number=1) }}
```

**Пример вывода (PostgreSQL)**:

```sql
    split_part(
        column_to_split,
        delimiter_column,
        1
        )

    split_part(
        '1|2|3',
        '|',
        1
        )
```

## Функции строковых литералов

### escape_single_quotes
__Аргументы__:

 * `value`: строковое значение Jinja

Этот макрос добавляет символы экранирования для любых одинарных кавычек в предоставленном строковом литерале. Примечание: если передан столбец, он будет работать только с именем столбца, а не с его значениями.

Чтобы экранировать кавычки для значений столбцов, рассмотрите макрос, такой как [replace](#replace) или замену с использованием регулярных выражений.

**Использование**:

```sql
{{ dbt.escape_single_quotes("they're") }}
{{ dbt.escape_single_quotes("ain't ain't a word") }}
```

**Пример вывода (PostgreSQL)**:

```sql
they''re
ain''t ain''t a word
```

### string_literal
__Аргументы__:

 * `value`: строковое значение Jinja

Этот макрос преобразует строку Jinja в строковый литерал SQL.

Чтобы привести значения столбцов к строке, рассмотрите макрос, такой как [safe_cast](#safe_cast) или обычное приведение типов.

**Использование**:

```sql
select {{ dbt.string_literal("Pennsylvania") }}
```

**Пример вывода (PostgreSQL)**:

```sql
select 'Pennsylvania'
```

## Агрегатные и оконные функции

### any_value
__Аргументы__:

 * `expression`: [выражение](#sql-expressions).

Этот макрос возвращает некоторое значение выражения из группы. Выбранное значение является недетерминированным (а не случайным).

**Использование**:

```sql
{{ dbt.any_value("column_name") }}
```

**Пример вывода (PostgreSQL)**:

```sql
any(column_name)
```

### bool_or
__Аргументы__:

 * `expression`: [имя атрибута или выражение](#sql-expressions).

Этот макрос возвращает логическое `OR` всех не-`NULL` выражений -- `true`, если хотя бы одна запись в группе оценивается как `true`.

**Использование**:

```sql
{{ dbt.bool_or("boolean_column") }}
{{ dbt.bool_or("integer_column = 3") }}
{{ dbt.bool_or("string_column = 'Pennsylvania'") }}
{{ dbt.bool_or("column1 = column2") }}
```

**Пример вывода (PostgreSQL)**:

```sql
bool_or(boolean_column)
bool_or(integer_column = 3)
bool_or(string_column = 'Pennsylvania')
bool_or(column1 = column2)
```

### listagg
__Аргументы__:

 * `measure` (обязательный): [имя атрибута или выражение](#sql-expressions), определяющее значения для конкатенации. Чтобы включить только уникальные значения, добавьте ключевое слово `DISTINCT` в начало выражения (например, 'DISTINCT column_to_agg').
 * `delimiter_text` (обязательный): Текст, представляющий разделитель для разделения конкатенированных значений.
 * `order_by_clause` (необязательный): Выражение (обычно одно или несколько имен столбцов, разделенных запятыми), определяющее порядок конкатенированных значений.
 * `limit_num` (необязательный): Указывает максимальное количество значений для конкатенации.

Этот макрос возвращает конкатенированные входные значения из группы строк, разделенные указанным разделителем.

**Использование**:

Примечание: Если в вашем `measure` есть экземпляры `delimiter_text`, вы не можете включить `limit_num`.

```sql
{{ dbt.listagg(measure="column_to_agg", delimiter_text="','", order_by_clause="order by order_by_column", limit_num=10) }}
```

**Пример вывода (PostgreSQL)**:

```sql
array_to_string(
        (array_agg(
            column_to_agg
            order by order_by_column
        ))[1:10],
        ','
        )
```

## Функции приведения типов

### cast

**Доступность**:
dbt v1.8 или выше. Для получения дополнительной информации выберите версию в меню навигации документации.


__Аргументы__:

 * `field`: [имя атрибута или выражение](#sql-expressions).
 * `type`: тип данных для преобразования

Этот макрос приводит значение к указанному типу данных. В отличие от [safe\_cast](#safe_cast), этот макрос вызовет ошибку, если приведение не удастся.

**Использование**:

```sql
{{ dbt.cast("column_1", api.Column.translate_type("string")) }}
{{ dbt.cast("column_2", api.Column.translate_type("integer")) }}
{{ dbt.cast("'2016-03-09'", api.Column.translate_type("date")) }}
```

**Пример вывода (PostgreSQL)**:

```sql
    cast(column_1 as TEXT)
    cast(column_2 as INT)
    cast('2016-03-09' as date)
```


### cast_bool_to_text
__Аргументы__:

 * `field`: логическое [имя атрибута или выражение](#sql-expressions).

Этот макрос приводит логическое значение к строке.

**Использование**:

```sql
{{ dbt.cast_bool_to_text("boolean_column_name") }}
{{ dbt.cast_bool_to_text("false") }}
{{ dbt.cast_bool_to_text("true") }}
{{ dbt.cast_bool_to_text("0 = 1") }}
{{ dbt.cast_bool_to_text("1 = 1") }}
{{ dbt.cast_bool_to_text("null") }}
```

**Пример вывода (PostgreSQL)**:

```sql
    cast(boolean_column_name as 
    varchar
)

    cast(false as 
    varchar
)

    cast(true as 
    varchar
)

    cast(0 = 1 as 
    varchar
)

    cast(1 = 1 as 
    varchar
)

    cast(null as 
    varchar
)
```

### safe_cast
__Аргументы__:

 * `field`: [имя атрибута или выражение](#sql-expressions).
 * `type`: тип данных для преобразования

Для баз данных, которые это поддерживают, этот макрос вернет `NULL`, если приведение не удастся (вместо вызова ошибки).

**Использование**:

```sql
{{ dbt.safe_cast("column_1", api.Column.translate_type("string")) }}
{{ dbt.safe_cast("column_2", api.Column.translate_type("integer")) }}
{{ dbt.safe_cast("'2016-03-09'", api.Column.translate_type("date")) }}
```

**Пример вывода (PostgreSQL)**:

```sql
    cast(column_1 as TEXT)
    cast(column_2 as INT)
    cast('2016-03-09' as date)
```

## Функции даты и времени

### date

**Доступность**:
dbt v1.8 или выше. Для получения дополнительной информации выберите версию в меню навигации документации.

__Аргументы__:

 * `year`: целое число
 * `month`: целое число
 * `day`: целое число

Этот макрос преобразует `year`, `month` и `day` в SQL-тип `DATE`.
 
**Использование**:

```sql
{{ dbt.date(2023, 10, 4) }}
```

**Пример вывода (PostgreSQL)**:

```sql
to_date('2023-10-04', 'YYYY-MM-DD')
```

### dateadd
__Аргументы__:

 * `datepart`: [часть даты или времени](#date-and-time-parts).
 * `interval`: целочисленное количество `datepart` для добавления (может быть положительным или отрицательным)
 * `from_date_or_timestamp`: дата/время [выражение](#sql-expressions).

Этот макрос добавляет временной/дневной интервал к указанной дате/времени. Примечание: Аргумент `datepart` является специфичным для базы данных.

**Использование**:

```sql
{{ dbt.dateadd(datepart="day", interval=1, from_date_or_timestamp="'2016-03-09'") }}
{{ dbt.dateadd(datepart="month", interval=-2, from_date_or_timestamp="'2016-03-09'") }}
```

**Пример вывода (PostgreSQL)**:

```sql
    '2016-03-09' + ((interval '10 day') * (1))
    '2016-03-09' + ((interval '10 month') * (-2))
```

### datediff
__Аргументы__:

 * `first_date`: дата/время [выражение](#sql-expressions).
 * `second_date`: дата/время [выражение](#sql-expressions).
 * `datepart`: [часть даты или времени](#date-and-time-parts).

Этот макрос вычисляет разницу между двумя датами.

**Использование**:

```sql
{{ dbt.datediff("column_1", "column_2", "day") }}
{{ dbt.datediff("column", "'2016-03-09'", "month") }}
{{ dbt.datediff("'2016-03-09'", "column", "year") }}
```

**Пример вывода (PostgreSQL)**:

```sql
        ((column_2)::date - (column_1)::date)

        ((date_part('year', ('2016-03-09')::date) - date_part('year', (column)::date))
     * 12 + date_part('month', ('2016-03-09')::date) - date_part('month', (column)::date))

        (date_part('year', (column)::date) - date_part('year', ('2016-03-09')::date))
```

### date_trunc
__Аргументы__:

 * `datepart`: [часть даты или времени](#date-and-time-parts).
 * `date`: дата/время [выражение](#sql-expressions).

Этот макрос усекает/округляет временную метку до первого момента для данной [части даты или времени](#date-and-time-parts).

**Использование**:

```sql
{{ dbt.date_trunc("day", "updated_at") }}
{{ dbt.date_trunc("month", "updated_at") }}
{{ dbt.date_trunc("year", "'2016-03-09'") }}
```

**Пример вывода (PostgreSQL)**:

```sql
date_trunc('day', updated_at)
date_trunc('month', updated_at)
date_trunc('year', '2016-03-09')
```

### last_day
__Аргументы__:

 * `date`: дата/время [выражение](#sql-expressions).
 * `datepart`: [часть даты или времени](#date-and-time-parts).

Этот макрос получает последний день для данной даты и части даты.

**Использование**:
- Аргумент `datepart` является специфичным для базы данных.
- Этот макрос в настоящее время поддерживает только части даты `month` и `quarter`.

```sql
{{ dbt.last_day("created_at", "month") }}
{{ dbt.last_day("'2016-03-09'", "year") }}
```

**Пример вывода (PostgreSQL)**:

```sql
cast(
    date_trunc('month', created_at) + ((interval '10 month') * (1))
 + ((interval '10 day') * (-1))
        as date)

cast(
    date_trunc('year', '2016-03-09') + ((interval '10 year') * (1))
 + ((interval '10 day') * (-1))
        as date)
```

## Части даты и времени

Часто поддерживаемые части даты и времени (регистр не имеет значения):
* `year`
* `quarter`
* `month`
* `week`
* `day`
* `hour`
* `minute`
* `second`
* `millisecond`
* `microsecond`
* `nanosecond`

Этот список не является исчерпывающим, и некоторые из этих частей даты и времени могут не поддерживаться для определенных адаптеров.
Некоторые макросы могут не поддерживать все части даты и времени. Некоторые адаптеры могут поддерживать больше или меньше точности.

## SQL-выражения

SQL-выражение может принимать формы, такие как:
- функция
- имя столбца
- литерал даты
- строковый литерал
- &lt;другой тип данных&gt; литерал (число и т.д.)
- `NULL`

Пример:
Предположим, есть таблица `orders` с колонкой `order_date`. Следующее показывает 3 различных типа выражений:
```sql
select
    date_trunc(month, order_date) as expression_function,
    order_date as expression_column_name,
    '2016-03-09' as expression_date_literal,
    'Pennsylvania' as expression_string_literal,
    3 as expression_number_literal,
    NULL as expression_null,
from orders
```

Обратите внимание, что пример строкового литерала включает одинарные кавычки. (Примечание: символ строкового литерала может варьироваться в зависимости от базы данных. Для этого примера предполагается одинарная кавычка.) Чтобы ссылаться на строковый литерал SQL в Jinja, требуются окружающие двойные кавычки.

Таким образом, в Jinja строковые значения будут:
- `"date_trunc(month, order_date)"`
- `"order_date"`
- `"'2016-03-09'"`
- `"'Pennsylvania'"`
- `"NULL"`