---
id: any-all
title: SQL ANY и ALL
description: Оператор ANY вернет true, если любое из переданных условий оценивается как true, в то время как ALL вернет true только если все переданные условия истинны.
slug: /sql-reference/any-all
---

<head>
    <title>Работа с операторами SQL ANY и ALL</title>
</head>

Операторы SQL ANY и ALL полезны для оценки условий с целью ограничения результатов запроса; их часто используют вместе с операторами [LIKE](/sql-reference/like) и [ILIKE](/sql-reference/ilike). Оператор ANY вернет true, если любое из переданных условий оценивается как true, в то время как ALL вернет true только если *все* переданные условия истинны.

Используйте эту страницу, чтобы лучше понять, как использовать операторы ANY и ALL, случаи их применения и какие хранилища данных их поддерживают.

## Как использовать операторы SQL ANY и ALL {#how-to-use-the-sql-any-and-all-operators}

Операторы ANY и ALL имеют очень простой синтаксис и часто используются с оператором LIKE/ILIKE или <Term id="subquery" />:

`where <field_name> like/ilike any/all (array_of_options)`

`where <field_name> = any/all (subquery)`

Некоторые замечания по синтаксису и функциональности этих операторов:
- Вы можете передать подзапрос в оператор ANY или ALL вместо массива опций
- Используйте оператор ILIKE с ANY или ALL, чтобы избежать чувствительности к регистру

Давайте теперь рассмотрим практический пример использования оператора ANY.

### Пример SQL ANY {#sql-any-example}

```sql
select
    order_id,
    status
from {{ ref('orders') }}
where status like any ('return%', 'ship%')
```

Этот простой запрос, использующий таблицу `orders` из [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop), вернет заказы, статус которых соответствует шаблонам `начинается с 'return'` или `начинается с 'ship'`:

| order_id | status |
|:---:|:---:|
| 18 | returned |
| 23 | return_pending |
| 74 | shipped |

Поскольку LIKE чувствителен к регистру, он не вернет результаты в этом запросе для заказов, статус которых, например, `RETURNED` или `SHIPPED`. Если в ваших данных есть смесь строк в верхнем и нижнем регистре, рассмотрите возможность стандартизации регистра строк с помощью функций [UPPER](/sql-reference/upper) и [LOWER](/sql-reference/lower) или используйте более гибкий оператор ILIKE.

## Синтаксис ANY и ALL в Snowflake, Databricks, BigQuery и Redshift {#any-and-all-syntax-in-snowflake-databricks-bigquery-and-redshift}

Snowflake и Databricks поддерживают возможность использования ANY в операторе LIKE. Однако Amazon Redshift и Google BigQuery не поддерживают использование ANY в операторах LIKE или ILIKE. Используйте таблицу ниже, чтобы узнать больше о документации для оператора ANY в вашем хранилище данных.

| **Хранилище данных** | **Поддержка ANY?** | **Поддержка ALL?** |
|:---:|:---:|:---:|
| [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/like_any.html) | ✅ | ✅ |
| [Databricks](https://docs.databricks.com/sql/language-manual/functions/like.html) | ✅ | ✅ |
| Amazon Redshift | ❌Не поддерживается; рассмотрите возможность использования нескольких OR выражений или [операторов IN](/sql-reference/in). | ❌Не поддерживается; рассмотрите возможность использования нескольких [AND выражений](/sql-reference/and) |
| Google BigQuery | ❌Не поддерживается; рассмотрите возможность использования [нескольких OR выражений](https://stackoverflow.com/questions/54645666/how-to-implement-like-any-in-bigquery-standard-sql) или операторов IN. | ❌Не поддерживается; рассмотрите возможность использования нескольких AND выражений |