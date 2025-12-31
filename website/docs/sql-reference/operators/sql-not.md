---
id: not
title: SQL NOT
description: Оператор SQL NOT позволяет возвращать результаты из условий, которые не являются истинными. Булевый оператор NOT похож на прилагательное — его часто ставят перед другим оператором.
slug: /sql-reference/not
---

<head>
    <title>Работа с оператором SQL NOT</title>
</head>

Это будет не *не* полезная страница о полезном операторе SQL.

Хорошо, мы должны были это сказать. Оператор SQL NOT позволяет возвращать результаты из условий, которые не являются истинными. Довольно интуитивно, правда?

На этой странице мы углубимся в то, как использовать оператор NOT, продемонстрируем пример и разберем потенциальные случаи использования.

## Как использовать оператор SQL NOT {#how-to-use-the-sql-not-operator}

Булевый оператор NOT похож на прилагательное — его часто ставят перед другим оператором, таким как [BETWEEN](/sql-reference/between), [LIKE](/sql-reference/like)/[ILIKE](/sql-reference/ilike), IS и [IN](/sql-reference/in), чтобы вернуть строки, которые не соответствуют указанным критериям. Ниже приведен пример использования NOT перед оператором LIKE:

`where <field_name> not like <value>`

Этот синтаксис можно легко изменить для других операторов:
- `where not between <value_1> and <value_2>`
- `where <field_name> is not null`
- `where <field_name> is not in (array_of_options)`
- ...или разместить в другом месте, например, в операторе case (например, `case when <field_name> is not null then 1 else 0 end`)

Давайте углубимся в практический пример использования оператора NOT.

### Пример SQL NOT {#sql-not-example}

```sql
select
   payment_id,
   order_id,
   payment_method
from {{ ref('payments') }}
where payment_method not like '%card' 
```

Этот простой запрос, использующий пример набора данных таблицы `payments` из [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop), возвращает все строки, у которых `payment_method` не является типом карты (например, подарочная карта или кредитная карта):

| **payment_id** | **order_id** | **payment_method** |
|:---:|:---:|:---:|
| 3 | 3 | coupon |
| 4 | 4 | coupon |
| 5 | 5 | bank_transfer |
| 10 | 9 | bank_transfer |

## Синтаксис SQL NOT в Snowflake, Databricks, BigQuery и Redshift {#sql-not-syntax-in-snowflake-databricks-bigquery-and-redshift}

[Snowflake](https://docs.snowflake.com/en/sql-reference/operators-logical.html), [Databricks](https://docs.databricks.com/sql/language-manual/functions/not.html), [BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/operators) и [Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_logical_condition.html) поддерживают оператор NOT, но могут не поддерживать все вторичные операторы, которые вы обычно используете в паре с оператором NOT. Например, `where <field_name> not ilike <pattern>` является допустимым в Snowflake, Databricks и Redshift, но оператор ILIKE не поддерживается в BigQuery, поэтому этот пример не будет действителен во всех хранилищах данных.

## Примеры использования оператора NOT {#not-operator-example-use-cases}

Вероятно, существует множество сценариев, в которых вам может понадобиться использовать операторы `NOT` в `WHERE`-условиях или `CASE`-выражениях. Однако на практике мы чаще всего видим использование `NOT` для исключения `NULL`-значений или строк, помеченных как удалённые с помощью булевых флагов, в исходных данных в [staging models](/best-practices/how-we-structure/2-staging). Удаление таких ненужных строк потенциально может повысить производительность последующих [intermediate](/best-practices/how-we-structure/3-intermediate) и [mart models](/best-practices/how-we-structure/4-marts).
