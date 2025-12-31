---
id: trim
title: SQL TRIM
description: Функция SQL TRIM удаляет начальные и конечные символы строки. По умолчанию она удаляет пробелы в начале и конце строки.
slug: /sql-reference/trim
---

<head>
    <title>Работа с функцией SQL TRIM</title>
</head>

Мы все с этим сталкивались: назойливые пробелы, странные, непоследовательные форматы или необъяснимые звездочки, скрывающиеся в конце значения столбца — [строки](/sql-reference/strings) являются одним из самых изменчивых типов данных в ваших наборах данных. Они, вероятно, не имеют единого регистра, различаются по длине и неизбежно содержат символы, которые нужно удалить.

Представляем: функция SQL TRIM, которая удаляет начальные и конечные символы строки. По умолчанию она удаляет пробелы в начале и конце строки.

## Как использовать функцию SQL TRIM {#how-to-use-the-sql-trim-function}

Синтаксис использования функции TRIM выглядит следующим образом:

```sql
trim(<field_name> [, <characters_to_remove>])
```

Как мы уже говорили, по умолчанию `<characters_to_remove>` — это пробел, так что если вы выполните `trim(' string with extra leading space')`, это вернет `'string with extra leading space'`. Вы можете явно указать отдельные символы или шаблон для удаления из ваших строк.

### Пример использования функции SQL TRIM {#sql-trim-function-example}

```sql
select
    first_name,
    concat('*', first_name, '**') as test_string,
    trim(test_string, '*') as back_to_first_name
from {{ ref('customers') }}
limit 3
```

После выполнения этого запроса результирующая таблица `orders` будет выглядеть следующим образом:

| first_name | test_string | back_to_first_name |
|---|---|---|
| Julia | *Julia** | Julia |
| Max | *Max** | Max |
| Laura | *Laura** | Laura |

В этом запросе вы добавляете лишние звездочки к строке, используя функцию [CONCAT](/sql-reference/concat), и очищаете ее с помощью функции TRIM. Хотя я указал одну звездочку в самой функции TRIM, она распознает это как шаблон для удаления из начала и конца строки, поэтому двойные звездочки (**) были удалены из конца столбца `test_string`.

## Синтаксис функции SQL TRIM в Snowflake, Databricks, BigQuery и Redshift {#sql-trim-function-syntax-in-snowflake-databricks-bigquery-and-redshift}

[Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/string_functions#trim), [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_TRIM.html), [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/trim.html) и [Databricks](https://docs.databricks.com/sql/language-manual/functions/trim.html) поддерживают возможность использования функции TRIM. Кроме того, синтаксис для обрезки строк одинаков во всех них с использованием функции TRIM. Эти хранилища данных также поддерживают функции RTRIM и LTRIM, которые позволяют удалять символы только с правой и левой стороны строки соответственно.

## Примеры использования функции TRIM {#trim-function-use-cases}

Если строковые значения в ваших сырых данных содержат лишние пробелы или посторонние символы, вы можете использовать функции TRIM (а также их подмножества RTRIM и LTRIM), чтобы быстро удалить их. Чаще всего такую очистку выполняют в [staging models](/best-practices/how-we-structure/2-staging), где обычно также стандартизируют регистр и выполняют другие незначительные изменения форматирования строковых значений. Это позволяет использовать чистый и согласованный формат во всех последующих моделях.
