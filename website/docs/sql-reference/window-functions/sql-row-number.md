---
id: row-number
title: SQL ROW_NUMBER
description: Функция ROW_NUMBER возвращает уникальный номер строки в упорядоченной группе или наборе данных.
slug: /sql-reference/row-number
---

<head>
    <title>Работа с SQL ROW_NUMBER</title>
</head>

На этой странице мы подробно рассмотрим функцию ROW_NUMBER, поговорим о том, что это такое, как ее использовать и почему она важна в аналитической инженерии.

Оконная функция ROW_NUMBER — это эффективный способ создания ранжированного столбца или фильтрации запроса на основе ранжирования. Более конкретно, функция ROW_NUMBER возвращает *уникальный* номер строки в упорядоченной группе или наборе данных.

В отличие от функций [RANK](/sql-reference/rank) и DENSE_RANK, ROW_NUMBER является недетерминированной, что означает, что *уникальный* номер присваивается произвольно для строк с дублирующимися значениями.

## Как использовать функцию ROW_NUMBER {#how-to-use-the-row_number-function}

Функция ROW_NUMBER имеет довольно простой синтаксис с необязательным полем разделения и поддержкой настройки порядка:

`row_number() over ([partition by <field(s)>] order by field(s) [asc | desc])`

Некоторые примечания по синтаксису этой функции:

- Поле `partition by` является необязательным; если вы хотите получить номера строк для всего набора данных (по сравнению с получением номера строки в группе строк в вашем наборе данных), вы просто опустите `partition by` из вызова функции (см. пример ниже).
- По умолчанию порядок в функции ROW_NUMBER установлен на возрастание. Чтобы явно сделать результирующий порядок убывающим, вам нужно передать `desc` в часть `order by` функции.

Давайте рассмотрим практический пример использования функции ROW_NUMBER ниже.

### Пример функции ROW_NUMBER {#row_number-function-example}

```sql
select
    customer_id,
    order_id,
    order_date,
    row_number() over (partition by customer_id order by order_date) as row_n
from {{ ref('orders') }}
order by 1
```

Этот простой запрос, использующий таблицу `orders` из [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop), вернет уникальный номер строки для каждого клиента по их `order_date`:

| customer_id | order_id | order_date | row_n |
|:---:|:---:|:---:|:---:|
| 1 | 1 | 2018-01-01 | 1 |
| 1 | 37 | 2018-02-10 | 2 |
| 2 | 8 | 2018-01-11 | 1 |
| 3 | 2 | 2018-01-02 | 1 |
| 3 | 24 | 2018-01-27 | 2 |
| 3 | 69 | 2018-03-11 | 3 |

Поскольку ROW_NUMBER является недетерминированной, заказы для клиента с одинаковым `order_date` будут иметь уникальные значения `row_n` (в отличие от использования функций RANK или DENSE_RANK).

## Синтаксис ROW_NUMBER в Snowflake, Databricks, BigQuery и Redshift {#row_number-syntax-in-snowflake-databricks-bigquery-and-redshift}

Большинство современных хранилищ данных поддерживают ROW_NUMBER и другие аналогичные функции ранжирования; синтаксис также одинаков для всех них. Используйте таблицу ниже, чтобы узнать больше о документации для функции ROW_NUMBER в вашем хранилище данных.

| Хранилище данных | Поддержка ROW_NUMBER? |
|:---:|:---:|
| [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/row_number.html) | ✅ |
| [Databricks](https://docs.databricks.com/sql/language-manual/functions/row_number.html) | ✅ |
| [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_WF_ROW_NUMBER.html) | ✅ |
| [Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/numbering_functions#row_number) | ✅ |

## Примеры использования функции ROW_NUMBER {#row_number-function-use-cases}

Чаще всего мы видим использование функции ROW_NUMBER в работе с данными для:

- В [операторах SELECT](/sql-reference/select) для добавления явных и уникальных номеров строк в группу данных или по всей таблице
- В сочетании с оператором QUALIFY для фильтрации <Term id="cte">CTE</Term>, запросов или моделей, чтобы захватить одну уникальную строку на указанную партицию с помощью функции ROW_NUMBER. Это особенно полезно, когда вам нужно удалить дублирующиеся строки из набора данных (но используйте это с умом!).

Это не исчерпывающий список всех мест, где ваша команда может использовать функцию `ROW_NUMBER` в своих dbt‑проектах, а лишь некоторые распространённые сценарии, с которыми аналитические инженеры сталкиваются в повседневной работе.
