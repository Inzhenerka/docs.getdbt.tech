---
id: strings
title: SQL Strings
description: Строки в SQL — это слова или комбинации символов, которые обычно заключены в одинарные кавычки (например, 'Jaffle Shop', '1234 Shire Lane', 'Plan A').
slug: /sql-reference/strings
---

<head>
    <title>Работа со строками в SQL</title>
</head>

Мы можем почти гарантировать, что в вашей базе данных нет ни одной модели dbt или таблицы, в которой не было бы хотя бы одного столбца строкового типа.

Строки повсюду в данных — они позволяют иметь описательные текстовые поля, использовать регулярные выражения в работе с данными, и, честно говоря, они просто делают мир данных более понятным.

Ниже мы рассмотрим различные форматы строк, которые вы можете встретить в современном облачном хранилище данных, и общие случаи использования строк.

## Использование строк в SQL

Строки являются неотъемлемой частью ваших данных — это поля с именами, которые кто-то вводит при регистрации учетной записи, они представляют товар, который кто-то купил в вашем интернет-магазине, они описывают адрес клиента и так далее.

Чтобы немного формализовать, строковый тип — это слово или комбинация символов, которые обычно заключены в одинарные кавычки (например, 'Jaffle Shop', '1234 Shire Lane', 'Plan A').

Чаще всего, работая со строками в модели dbt или запросе, вы:

- Изменяете регистр (верхний/нижний), чтобы создать некоторый стандарт для ваших строковых столбцов в хранилище данных
- Конкатенируете строки, чтобы создать более надежные, единообразные или описательные строковые значения
- Разворачиваете <Term id="json" /> или более сложные структурированные объекты данных и преобразуете эти значения в явные строки
- Приводите столбец другого типа к строке для лучшей совместимости или удобства использования в BI-инструменте
- Фильтруете запросы по определенным строковым значениям
- Создаете новый строковый столбец на основе оператора CASE WHEN для группировки данных
- Разделяете строку на подстроку

Это не исчерпывающий список функциональности строк или случаев их использования, но он содержит некоторые общие сценарии, с которыми аналитики сталкиваются ежедневно.

### Строки в примерном запросе

```sql
select
	date_trunc('month', order_date)::string as order_month,
	round(avg(amount)) as avg_order_amount
from {{ ref('orders') }}
where status not in ('returned', 'return_pending')
group by 1
```

Этот запрос, использующий таблицу `orders` из [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop), вернет месяц заказа в виде строки и округленную сумму заказа только для заказов со статусами, не равными строковым значениям `returned` или `pending`:

| order_month | avg_order_amount |
|:---:|:---:|
| 2018-01-01 | 18 |
| 2018-02-01 | 15 |
| 2018-03-01 | 18 |
| 2018-04-01 | 17 |

## Поддержка строк в Snowflake, Databricks, BigQuery и Redshift

Snowflake, Databricks, Google BigQuery и Amazon Redshift поддерживают строковый [тип данных](/sql-reference/data-types#string-data-types). У них могут быть немного разные подтипы для строк; некоторые хранилища данных, такие как Snowflake и Redshift, поддерживают текстовые, символьные и строковые типы, которые обычно различаются по длине в байтах по сравнению с общим строковым типом.

Опять же, поскольку большинство строковых столбцов являются неотъемлемой частью ваших данных, вы, вероятно, сможете использовать общий varchar или строки для приведения типов, но никогда не помешает ознакомиться с документацией, специфичной для поддержки строк в вашем хранилище данных!