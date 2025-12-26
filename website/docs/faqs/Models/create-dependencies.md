---
title: Как создать зависимости между моделями?
description: "Использование функции ref для создания зависимостей"
sidebar_label: 'Создание зависимостей между моделями'
id: create-dependencies

---

Когда вы используете функцию `ref` [function](/reference/dbt-jinja-functions/ref), dbt автоматически определяет зависимости между моделями.

Например, рассмотрим модель `customer_orders`, которая выглядит следующим образом:

<File name='models/customer_orders.sql'>

```sql
select
    customer_id,
    min(order_date) as first_order_date,
    max(order_date) as most_recent_order_date,
    count(order_id) as number_of_orders
from {{ ref('stg_orders') }}
group by 1

```

</File>

**Нет необходимости явно определять эти зависимости.** dbt поймет, что модель `stg_orders` должна быть построена перед вышеуказанной моделью (`customer_orders`). Когда вы выполняете `dbt run`, вы увидите, что они строятся в порядке:

```txt
$ dbt run
Running with dbt=1.6.0
Found 2 models, 28 tests, 0 snapshots, 0 analyses, 130 macros, 0 operations, 0 seed files, 3 sources

11:42:52 | Concurrency: 8 threads (target='dev_snowflake')
11:42:52 |
11:42:52 | 1 of 2 START view model dbt_claire.stg_jaffle_shop__orders........... [RUN]
11:42:55 | 1 of 2 OK creating view model dbt_claire.stg_jaffle_shop__orders..... [CREATE VIEW in 2.50s]
11:42:55 | 2 of 2 START relation dbt_claire.customer_orders..................... [RUN]
11:42:56 | 2 of 2 OK creating view model dbt_claire.customer_orders............. [CREATE VIEW in 0.60s]
11:42:56 | Finished running 2 view models in 15.13s.


Done. PASS=2 WARN=0 ERROR=0 SKIP=0 TOTAL=2
```

Чтобы узнать больше о создании проекта dbt, мы рекомендуем вам пройти [руководство по быстрому старту](/guides).