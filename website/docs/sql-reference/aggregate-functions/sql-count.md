---
id: count
title: SQL COUNT
description: COUNT — это агрегатная функция, которая используется для возврата количества строк указанного поля или всех строк в наборе данных. Она часто используется для получения базовой статистической информации о наборе данных, проверки уникальности первичных ключей и расчета бизнес-метрик.
slug: /sql-reference/count
---

<head>
    <title>Работа с функцией SQL COUNT</title>
</head>

COUNT — это SQL-функция, которую необходимо уметь использовать. Будь то в произвольном запросе, модели данных или в расчете BI-инструмента, вы будете использовать функцию SQL COUNT бесчисленное количество раз (каламбур уместен) в своей работе с данными.

Формально, COUNT — это агрегатная функция, которая используется для возврата количества строк указанного поля (`count(<field_name>)`) или всех строк в наборе данных (`count(*)`). Она часто используется для получения базовой статистической информации о наборе данных, проверки уникальности первичных ключей и расчета бизнес-метрик.

## Как использовать SQL COUNT в запросе

Используйте следующий синтаксис для генерации агрегатного количества поля:

`count(<field_name>)`

Поскольку COUNT является агрегатной функцией, вам понадобится оператор GROUP BY в вашем запросе, если вы хотите получить количество, разбитое по измерениям. Если вы рассчитываете отдельные количества полей без необходимости разбивать их по другому полю, оператор GROUP BY не нужен.

Давайте рассмотрим практический пример использования COUNT, DISTINCT и GROUP BY ниже.

### Пример COUNT

Следующий пример выполняет запрос из образца набора данных, созданного dbt Labs, под названием [jaffle_shop](https://github.com/dbt-labs/jaffle_shop):

```sql
select
	date_part('month', order_date) as order_month,
	count(order_id) as count_all_orders,
	count(distinct(customer_id)) as count_distinct_customers
from {{ ref('orders') }}
group by 1
```

Этот простой запрос может быть выполнен во время начального исследования ваших данных; он вернет количество `order_ids` и количество уникальных `customer_ids` за каждый месяц заказов, которые появляются в таблице `orders` Jaffle Shop:

| order_month | count_all_orders | count_distinct_customers |
|:---:|:---:|:---:|
| 1 | 29 | 24 |
| 2 | 27 | 25 |
| 3 | 35 | 31 |
| 4 | 8 | 8 |

Аналитик или инженер по аналитике может захотеть выполнить такой запрос, чтобы понять соотношение заказов к клиентам и увидеть, как оно меняется по сезонам.

## Синтаксис SQL COUNT в Snowflake, Databricks, BigQuery и Redshift

Все современные хранилища данных поддерживают возможность использования функции COUNT (и следуют одному и тому же синтаксису!).

Некоторые хранилища данных, такие как Snowflake и Google BigQuery, дополнительно поддерживают функцию COUNT_IF/COUNTIF, которая позволяет передавать логическое выражение для определения, следует ли учитывать строку или нет.

## Примеры использования COUNT

Мы чаще всего видим запросы с использованием COUNT для:
- Первоначального исследования данных в наборе данных, чтобы понять объем данных, уникальность первичных ключей, распределение значений столбцов и многое другое.
- Расчета количества ключевых бизнес-метрик (ежедневные заказы, созданные клиенты и т.д.) в ваших моделях данных или BI-инструменте.
- Определения [метрик](/docs/build/build-metrics-intro) для агрегации ключевых метрик.

Это не исчерпывающий список того, где ваша команда может использовать COUNT в процессе разработки, моделях dbt и логике BI-инструментов, но он содержит некоторые общие сценарии, с которыми аналитики сталкиваются ежедневно.