---
id: concat
title: SQL CONCAT
description: Функция CONCAT позволяет аналитикам объединять несколько строковых значений в запросе.
slug: /sql-reference/concat
---

<head>
    <title>Работа с SQL CONCAT</title>
</head>

Нет лучшего и более простого способа объединить несколько строковых значений в запросе, чем использование функции CONCAT. Точка.

Это простая функция с довольно простыми случаями использования. Используйте эту страницу, чтобы понять, как использовать функцию CONCAT в вашем хранилище данных и почему аналитики используют её в своих моделях dbt.

## Как использовать функцию CONCAT {#how-to-use-the-concat-function}

Использование функции CONCAT довольно просто: вы передаете строки или бинарные значения, которые хотите объединить в нужном порядке, в функцию CONCAT. Вы можете передать в функцию CONCAT столько выражений, сколько захотите.

### Пример функции CONCAT {#concat-function-example}

```sql
select
	user_id,
	first_name,
	last_name,
	concat(first_name, ' ', last_name) as full_name
from {{ ref('customers') }}
limit 3
```

Этот запрос, использующий таблицу `customers` из [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop), вернет результаты с новым столбцом, объединяющим поля `first_name` и `last_name` с пробелом между ними:

| user_id | first_name | last_name | full_name |
|:---:|:---:|:---:|:---:|
| 1 | Michael | P. | Michael P. |
| 2 | Shawn | M. | Shawn M. |
| 3 | Kathleen | P. | Kathleen P. |

## Синтаксис функции CONCAT в Snowflake, Databricks, BigQuery и Redshift {#concat-function-syntax-in-snowflake-databricks-bigquery-and-redshift}

Snowflake, Databricks, Google BigQuery и Amazon Redshift поддерживают функцию CONCAT с одинаковым синтаксисом на каждой платформе. Вы также можете увидеть функцию CONCAT, представленную оператором `||` (например, `select first_name || last_name AS full_name from {{ ref('customers') }}`), который имеет ту же функциональность, что и функция CONCAT на этих платформах данных.

## Сценарии использования CONCAT {#concat-use-cases}

Наиболее часто мы видим конкатенацию в SQL для строк, чтобы:

- Объединять адресные/географические столбцы в одно поле
- Добавлять жестко закодированные строковые значения к столбцам для создания более понятных значений столбцов
- Создавать <Term id="surrogate-key">суррогатные ключи</Term> с использованием метода хеширования и нескольких значений столбцов (например, `md5(column_1 || column_2) as unique_id`)

Это не исчерпывающий список всех мест, где ваша команда может использовать `CONCAT` в работе с данными, но он охватывает некоторые распространённые сценарии, с которыми аналитические инженеры сталкиваются в повседневной работе.
