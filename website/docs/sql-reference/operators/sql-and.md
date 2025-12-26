---
id: and
title: SQL AND
description: Оператор AND возвращает результаты, которые соответствуют всем переданным в него условиям. Вы часто увидите оператор AND в предложении WHERE для фильтрации результатов запроса.
slug: /sql-reference/and
---

<head>
    <title>Работа с оператором SQL AND</title>
</head>

Оператор AND возвращает результаты, которые соответствуют всем переданным в него условиям; в отличие от [оператора OR](/sql-reference/or), которому достаточно одного истинного условия. Вы часто увидите оператор AND в [предложении WHERE](/sql-reference/where) для фильтрации результатов запроса или в операторе case для создания нескольких критериев для результата.

Используйте эту страницу, чтобы понять, как использовать оператор AND и почему он может быть полезен в аналитической инженерии.

## Как использовать оператор AND

Использовать оператор AND просто, и вы обычно увидите его в предложении WHERE для соответствующей фильтрации результатов запроса, в операторах case или в объединениях, которые включают несколько полей.

```sql
-- and в предложении where
where <condition_1> and <condition_2> and…

-- and в операторе case
case when <condition_1> and <condition_2> then <result_1> …

-- and в объединении
from <table_a>
join <table_b> on
<a_id_1> = <b_id_1> and <a_id_2> = <b_id_2>
```

:::tip Surrogate keys > joins with AND
Использование <Term id="surrogate-key">surrogate keys</Term> — хешированных значений из нескольких колонок — отличный способ избежать использования операторов AND в join-ах. Как правило, наличие AND или [OR operators](/sql-reference/or) в условии join может приводить к потенциально неэффективным запросам или моделям, особенно при больших объёмах данных. Поэтому создание surrogate keys заранее в upstream-таблицах ([using the surrogate key macro](/blog/sql-surrogate-keys)) может потенциально повысить производительность downstream-моделей.
:::
:::

### Пример оператора SQL AND

```sql
select
	order_id,
	status,
	round(amount) as amount
from {{ ref('orders') }}
where status = 'shipped' and amount > 20
limit 3
```

Этот запрос, использующий пример набора данных таблицы `orders` магазина Jaffle, вернет результаты, где статус заказа — отправлен, а сумма заказа превышает $20:

| **order_id** | **status** | **amount** |
|:---:|:---:|:---:|
| 74 | shipped | 30 |
| 88 | shipped | 29 |
| 78 | shipped | 26 |

## Синтаксис оператора AND в Snowflake, Databricks, BigQuery и Redshift

Snowflake, Databricks, Google BigQuery и Amazon Redshift поддерживают оператор AND с одинаковым синтаксисом на каждой платформе.