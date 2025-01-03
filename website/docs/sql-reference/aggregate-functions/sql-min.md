---
id: min 
title: SQL MIN 
description: Агрегатная функция MIN позволяет вычислить минимальное значение из столбца или по набору строк для столбца.
slug: /sql-reference/min
---

<head>
    <title>Работа с SQL MIN</title>
</head>

SQL MIN, MAX, SUM... агрегатные функции, которые станут вашими основными инструментами как аналитика. В этом посте мы разберем функцию SQL MIN, как ее использовать и почему она ценна в работе с данными.

Агрегатная функция MIN позволяет вычислить минимальное значение из столбца или по набору строк для столбца. Результаты функции MIN полезны для понимания распределения значений столбца и определения первых временных меток ключевых событий.

## Как использовать функцию MIN в запросе

Используйте следующий синтаксис в запросе, чтобы найти минимальное значение поля:

`min(<field_name>)`

Поскольку MIN является агрегатной функцией, вам понадобится оператор GROUP BY в вашем запросе, если вы рассматриваете подсчеты, разбитые по измерениям. Если вы вычисляете минимальное значение полей без необходимости разбивать их по другому полю, оператор GROUP BY не нужен.

MIN также может использоваться как оконная функция для работы с указанными или разделенными строками.

Давайте рассмотрим практический пример использования MIN ниже.

### Пример MIN

Следующий пример выполняет запрос из образца набора данных, созданного dbt Labs, под названием [jaffle_shop](https://github.com/dbt-labs/jaffle_shop):

```sql
select
	customer_id,
	min(order_date) as first_order_date,
	max(order_date) as last_order_date
from {{ ref('orders') }}
group by 1
limit 3
```

Этот простой запрос возвращает первую и последнюю дату заказа для клиента в таблице `orders` магазина Jaffle:

| customer_id | first_order_date | last_order_date |
|:---:|:---:|:---:|
| 1 | 2018-01-01 | 2018-02-10 |
| 3 | 2018-01-02 | 2018-03-11 |
| 94 | 2018-01-04 | 2018-01-29 |

## Синтаксис функции SQL MIN в Snowflake, Databricks, BigQuery и Redshift

Все современные хранилища данных поддерживают возможность использования функции MIN (и следуют одному и тому же синтаксису).

## Примеры использования функции MIN

Чаще всего мы видим запросы с использованием MIN для:
- Первоначального исследования данных в наборе данных для понимания распределения значений столбца.
- Определения первой временной метки для ключевых событий (например, `min(login_timestamp_utc) as first_login`).

Это не исчерпывающий список того, где ваша команда может использовать MIN в процессе разработки, моделях dbt и логике BI-инструментов, но он содержит некоторые общие сценарии, с которыми аналитики сталкиваются ежедневно.