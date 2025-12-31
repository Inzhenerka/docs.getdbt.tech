---
id: having
title: SQL HAVING
description: Прочтите это руководство, чтобы узнать о предложении SQL HAVING в dbt.
slug: /sql-reference/having
---

<head>
    <title>Работа с предложением HAVING в SQL</title>
</head>

SQL HAVING — это одна из тех мелочей, которые сделают вашу работу с данными немного проще.

Не очень приятный факт о [WHERE clause](/sql-reference/where) заключается в том, что с его помощью нельзя фильтровать агрегаты... и вот тут на помощь приходит HAVING. С HAVING вы можете не только определить агрегат в [select](/sql-reference/select) запросе, но и фильтровать по этому вновь созданному агрегату в предложении HAVING.

На этой странице мы рассмотрим, как использовать HAVING, когда его следует использовать, и обсудим поддержку этого предложения в различных хранилищах данных.

## Как использовать предложение HAVING в SQL {#how-to-use-the-having-clause-in-sql}

Предложение HAVING по сути требует одного: агрегатного поля для оценки. Поскольку HAVING технически является булевым, он будет возвращать строки, которые выполняются как истинные, аналогично предложению WHERE.

Условие HAVING следует после [GROUP BY statement](/sql-reference/group-by) и может быть дополнительно заключено в ORDER BY:

```sql
select
	-- запрос
from <table>
group by <field(s)>
having condition
[optional order by]
```

Этот пример синтаксиса выглядит немного непонятно без реальных полей, поэтому давайте рассмотрим практический пример использования HAVING.

### Пример использования SQL HAVING {#sql-having-example}

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
having num_orders > 1 --если заменить это на `where`, запрос не выполнится успешно
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

Этот простой запрос, использующий пример набора данных таблицы `orders` из [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop), вернет клиентов, у которых было более одного заказа:

| customer_id | num_orders |
|:---:|:---:|
| 1 | 2 |
| 3 | 3 |
| 94 | 2 |
| 64 | 2 |
| 54 | 4 |

Запрос выше, использующий <Term id="cte" />, использует больше строк по сравнению с более простым запросом с использованием HAVING, но даст тот же результат.

## Синтаксис предложения SQL HAVING в Snowflake, Databricks, BigQuery и Redshift {#sql-having-clause-syntax-in-snowflake-databricks-bigquery-and-redshift}

[Snowflake](https://docs.snowflake.com/en/sql-reference/constructs/having.html), [Databricks](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-qry-select-having.html), [BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#having_clause) и [Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_HAVING_clause.html) все поддерживают предложение HAVING, и синтаксис для использования HAVING одинаков во всех этих хранилищах данных.