---
id: order-by
title: SQL ORDER BY
description: Прочтите это руководство, чтобы узнать о SQL ORDER BY в dbt.
slug: /sql-reference/order-by
---

<head>
    <title>Работа с SQL ORDER BY</title>
</head>

Клаузула ORDER BY позволяет указать порядок строк в результате запроса. На практике вы используете ORDER BY, чтобы указать, по какому полю(ям) вы хотите упорядочить данные и в каком порядке (по возрастанию или убыванию). Это полезно при проведении разовых анализов и для создания соответствующих значений столбцов для разделенных строк в оконных функциях.

## Как использовать SQL ORDER BY

Клаузулы ORDER BY имеют множество применений в аналитической работе, но чаще всего их используют для:
- Упорядочивания результата запроса или подзапроса по столбцу или группе столбцов
- Соответствующего упорядочивания подмножества строк в оконной функции

Чтобы использовать ORDER BY в запросе или модели, используйте следующий синтаксис:

```sql
select
	column_1,
	column_2
from source_table
order by <field(s)> <asc/desc> -- идет после FROM, WHERE и GROUP BY
```
Вы можете упорядочить результат запроса по нескольким столбцам, указав их имя или номер в операторе select (например, `order by column_2 == order by 2`). Вы также можете указать тип упорядочивания (по возрастанию или убыванию), чтобы получить нужный порядок строк.

Давайте рассмотрим практический пример использования ORDER BY.

### Пример ORDER BY

```sql
select
	date_trunc('month, order_date') as order_month,
	round(avg(amount)) as avg_order_amount
from {{ ref('orders') }}
group by 1
order by 1 desc
```

Этот запрос, использующий таблицу `orders` из [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop), вернет округленную сумму заказов за каждый месяц в порядке убывания:

| order_month | avg_order_amount |
|:---:|:---:|
| 2018-04-01 | 17 |
| 2018-03-01 | 18 |
| 2018-02-01 | 15 |
| 2018-01-01 | 17 |

## Синтаксис SQL ORDER BY в Snowflake, Databricks, BigQuery и Redshift

Поскольку ORDER BY является основой SQL, все хранилища данных, включая Snowflake, Databricks, Google BigQuery и Amazon Redshift, поддерживают возможность добавления клаузул ORDER BY в запросы и оконные функции.

## Примеры использования ORDER BY

Чаще всего мы видим использование ORDER BY в работе с данными для:
- Анализа данных как для первоначального изучения исходных данных, так и для разовых запросов [мартов данных](/best-practices/how-we-structure/4-marts)
- Определения топ-5/10/50/100 в наборе данных при использовании вместе с [LIMIT](/sql-reference/limit)
- (Для Snowflake) Оптимизации производительности крупных инкрементных моделей, которые используют как `cluster_by` [конфигурацию](https://docs.getdbt.com/reference/resource-configs/snowflake-configs#using-cluster_by), так и ORDER BY
- Контроля порядка разделов оконных функций (например, `row_number() over (partition by user_id order by updated_at)`)

Это не исчерпывающий список того, где ваша команда может использовать ORDER BY в ваших dbt моделях, разовых запросах и логике BI инструментов, но он содержит некоторые общие сценарии, с которыми аналитики сталкиваются ежедневно.