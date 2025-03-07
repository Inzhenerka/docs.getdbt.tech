---
id: avg
title: SQL AVG
description: Функция AVG используется для вычисления простого среднего значения числового столбца, но также может использоваться в оконной функции для расчета скользящих средних.
slug: /sql-reference/avg
---

<head>
    <title>Работа с функцией SQL AVG</title>
</head>

Вы работаете с данными, поэтому мы предполагаем, что в какой-то момент вашей карьеры вы будете вычислять средние значения некоторых метрик \**машет руками в воздухе*\*. И способ вычисления средних значений числового столбца в SQL — это использование функции AVG.

## Как использовать функцию AVG

Функция AVG является частью группы математических или агрегатных функций (например, MIN, MAX, SUM), которые часто используются в SQL для суммирования наборов данных. Вы, скорее всего, увидите использование функции AVG для простого вычисления среднего значения числового столбца, но также можете увидеть её использование в оконной функции для расчета скользящих средних.

### Пример использования функции AVG

Следующий пример выполняет запрос из образца набора данных, созданного dbt Labs, под названием [jaffle_shop](https://github.com/dbt-labs/jaffle_shop):

```sql
select
	date_trunc('month', order_date) as order_month,
	round(avg(amount)) as avg_order_amount
from {{ ref('orders') }}
where status not in ('returned', 'return_pending')
group by 1
```

Этот запрос, использующий таблицу `orders` из Jaffle Shop, вернет округленную сумму заказа за каждый месяц заказа:

| order_month | avg_order_amount |
|:---:|:---:|
| 2018-01-01 | 18 |
| 2018-02-01 | 15 |
| 2018-03-01 | 18 |
| 2018-04-01 | 17 |

Функция AVG, как и многие другие математические функции, является агрегатной функцией. Агрегатные функции работают по всем строкам или группе строк, чтобы вернуть одно значение. При вычислении среднего значения столбца по измерению (или группе измерений) — в нашем примере выше, `order_month` — вам необходимо использовать оператор GROUP BY; без него запрос выше не будет успешно выполнен.

## Синтаксис функции SQL AVG в Snowflake, Databricks, BigQuery и Redshift

Snowflake, Databricks, Google BigQuery и Amazon Redshift поддерживают возможность вычисления среднего значения столбца, и синтаксис для функций AVG одинаков на всех этих платформах данных.

## Примеры использования функции AVG

Чаще всего мы видим использование функции AVG в работе с данными для вычисления:
- Среднего значения ключевых метрик (например, средний CSAT, среднее время выполнения, средняя сумма заказа) в последующих [факт или измерительных моделях](/best-practices/how-we-structure/4-marts)
- Скользящих или движущихся средних (например, 7-дневные, 30-дневные средние для ключевых метрик) с использованием оконных функций
- Средних значений в [метриках dbt](https://docs.getdbt.com/docs/build/metrics)

Это не исчерпывающий список того, где ваша команда может использовать функцию AVG в ваших моделях dbt и логике BI-инструментов, но он содержит некоторые общие сценарии, с которыми аналитики сталкиваются в своей повседневной работе.