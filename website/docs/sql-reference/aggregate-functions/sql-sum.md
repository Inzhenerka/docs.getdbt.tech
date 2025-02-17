---
id: sum
title: SQL SUM 
description: Функция агрегирования SUM позволяет вычислить сумму числового столбца или по набору строк для столбца.
slug: /sql-reference/sum
---

<head>
    <title>Работа с SQL SUM</title>
</head>

Функция SQL SUM является полезным и всегда присутствующим инструментом в работе с данными. Давайте разберем, что это такое, как ее использовать и почему она ценна.

Погружаясь в детали, функция агрегирования SUM позволяет вычислить сумму числового столбца или по набору строк для столбца. В конечном итоге, функция SUM невероятно полезна для расчета значимых бизнес-метрик, таких как пожизненная ценность клиента (LTV), и создания ключевых числовых полей в [`fct_` и `dim_` моделях](https://www.getdbt.com/blog/guide-to-dimensional-modeling).

## Как использовать функцию SUM в запросе

Используйте следующий синтаксис в запросе, чтобы найти сумму числового поля:

`sum(<field_name>)`

Поскольку SUM является агрегатной функцией, вам понадобится оператор GROUP BY в вашем запросе, если вы рассматриваете подсчеты, разбитые по измерениям. Если вы вычисляете отдельную сумму числового поля без необходимости разбивать их по другому полю, оператор GROUP BY не нужен.

SUM также может использоваться как оконная функция для работы по указанным или разделенным строкам. Вы также можете передать оператор DISTINCT в функцию SUM, чтобы суммировать только уникальные значения в столбце.

Давайте рассмотрим практический пример использования функции SUM ниже.

### Пример использования SUM

Следующий пример выполняет запрос из тестового набора данных, созданного dbt Labs, под названием [jaffle_shop](https://github.com/dbt-labs/jaffle_shop):

```sql
select
	customer_id,
	sum(order_amount) as all_orders_amount
from {{ ref('orders') }}
group by 1
limit 3
```

Этот простой запрос возвращает сумму всех заказов для клиента в таблице `orders` магазина Jaffle:

| customer_id | all_orders_amount |
|:---:|:---:|
| 1 | 33 |
| 3 | 65 |
| 94 | 24 |

## Синтаксис функции SQL SUM в Snowflake, Databricks, BigQuery и Redshift

Все современные хранилища данных поддерживают возможность использования функции SUM (и следуют одному и тому же синтаксису).

## Примеры использования функции SUM

Мы чаще всего видим запросы с использованием SUM для:

- Вычисления накопленной суммы метрики по идентификатору клиента/пользователя с использованием оператора CASE WHEN (например, `sum(case when order_array is not null then 1 else 0 end) as count_orders`)
- Создания [метрик dbt](/docs/build/build-metrics-intro) для ключевых бизнес-значений, таких как LTV
- Вычисления итога поля по измерению (например, общее время сессии, общее время, проведенное на билет), которые вы обычно используете в `fct_` или `dim_` моделях
- Суммирования кликов, затрат, показов и других ключевых метрик отчетности по рекламе в таблицах из рекламных платформ

Это не исчерпывающий список того, где ваша команда может использовать SUM в вашей разработке, моделях dbt и логике BI-инструментов, но он содержит некоторые общие сценарии, с которыми аналитики сталкиваются ежедневно.