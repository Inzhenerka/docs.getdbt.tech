---
id: having
title: SQL HAVING
description: Прочитайте это руководство, чтобы узнать о предложении SQL HAVING в dbt.
slug: /sql-reference/having
---

<head>
    <title>Работа с предложением HAVING в SQL</title>
</head>

SQL HAVING — это одна из тех небольших вещей, которые сделают вашу работу с данными немного проще.

Не очень приятный факт о [предложении WHERE](/sql-reference/where) заключается в том, что вы не можете фильтровать по агрегатам с его помощью... вот тут и приходит на помощь HAVING. С помощью HAVING вы можете не только определить агрегат в [предложении select](/sql-reference/select), но и фильтровать по только что созданному агрегату в предложении HAVING.

Эта страница объяснит, как использовать HAVING, когда его следует использовать и обсудит поддержку этого предложения в хранилищах данных.


## Как использовать предложение HAVING в SQL

Предложение HAVING по сути требует одного: агрегатного поля для оценки. Поскольку HAVING технически является булевым значением, оно вернет строки, которые выполняются как истинные, аналогично предложению WHERE.

Условие HAVING следует после [предложения GROUP BY](/sql-reference/group-by) и, при необходимости, может быть заключено в предложение ORDER BY:

```sql
select
	-- запрос
from <table>
group by <field(s)>
having condition
[опционально order by]
```

Этот пример синтаксиса выглядит немного непонятно без реальных полей, поэтому давайте рассмотрим практический пример использования HAVING.

### Пример SQL HAVING

<Tabs
  defaultValue="having"
  values={[
    { label: 'Пример HAVING', value: 'having', },
    {label: 'Пример CTE', value: 'cte', },
  ]
}>
<TabItem value="having">

```sql
select
    customer_id,
    count(order_id) as num_orders
from {{ ref('orders') }}
group by 1
having num_orders > 1 --если вы замените это на `where`, этот запрос не выполнится успешно
```
</TabItem>
<TabItem value="cte">

```sql
with counts as (
	select
		customer_id,
		count(order_id) as num_orders
	from {{ ref('orders') }}
	group by 1
)
select
	customer_id,
	num_orders
from counts
where num_orders > 1
```

</TabItem>
</Tabs>

Этот простой запрос, использующий образец данных из таблицы `orders` [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop), вернет клиентов, у которых было более одного заказа:

| customer_id | num_orders |
|:---:|:---:|
| 1 | 2 |
| 3 | 3 |
| 94 | 2 |
| 64 | 2 |
| 54 | 4 |

Запрос выше, использующий <Term id="cte" />, содержит больше строк по сравнению с более простым запросом, использующим HAVING, но даст тот же результат.

## Синтаксис предложения SQL HAVING в Snowflake, Databricks, BigQuery и Redshift

[Snowflake](https://docs.snowflake.com/en/sql-reference/constructs/having.html), [Databricks](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-qry-select-having.html), [BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#having_clause) и [Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_HAVING_clause.html) все поддерживают предложение HAVING, и синтаксис его использования одинаков во всех этих хранилищах данных.