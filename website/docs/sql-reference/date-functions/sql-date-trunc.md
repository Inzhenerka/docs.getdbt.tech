---
id: datetrunc
title: SQL DATE_TRUNC
description: Функция DATE_TRUNC усекает дату или время до первого вхождения указанной части даты. Вы можете усекать до недель, месяцев, лет или других частей даты для поля даты или времени.
slug: /sql-reference/date-trunc
---

<head>
    <title>Работа с функцией SQL DATE_TRUNC</title>
</head>

В общем, специалисты по данным предпочитают более детализированные данные менее детализированным. [Метки времени > даты](https://docs.getdbt.com/blog/when-backend-devs-spark-joy#signs-the-data-is-sparking-joy), ежедневные данные > еженедельные данные и т.д.; наличие данных на более детализированном уровне всегда позволяет вам приблизиться. Однако, скорее всего, вы смотрите на свои данные на несколько более отдаленном уровне — еженедельно, ежемесячно или даже ежегодно. Для этого вам понадобится удобная функция, которая поможет округлить поля даты или времени.

Функция DATE_TRUNC усечет дату или время до первого вхождения указанной части даты. Многословно, многословно, многословно! Что это действительно значит? Если вы усечете `2021-12-13` до месяца, это вернет `2021-12-01` (первый день месяца).

С помощью функции DATE_TRUNC вы можете усекать до недель, месяцев, лет или других частей даты для поля даты или времени. Это может сделать поля даты/времени более читаемыми, а также помочь выполнять более чистый анализ на основе времени.

В целом, это отличная функция, которую можно использовать для агрегации данных в определенные части даты, сохраняя формат даты. Однако функция DATE_TRUNC не является вашим швейцарским ножом — она не может творить чудеса или решать все ваши проблемы (мы смотрим на вас, [звезда](https://getdbt.com/sql-foundations/star-sql-love-letter/)). Вместо этого DATE_TRUNC — это ваш стандартный кухонный нож — он прост и эффективен, и вы почти никогда не начинаете готовить (моделирование данных) без него.

## Как использовать функцию DATE_TRUNC

Для функции DATE_TRUNC необходимо передать два аргумента:

- Часть даты: Это дни/месяцы/недели/годы (уровень), до которых вы хотите усечь ваше поле
- Дата/время, которые вы хотите усечь

Функция DATE_TRUNC может использоваться в [SELECT](/sql-reference/select) операторах и [WHERE](/sql-reference/where) условиях.

Большинство современных облачных хранилищ данных поддерживают некоторый тип функции DATE_TRUNC. Могут быть небольшие различия в порядке аргументов для DATE_TRUNC в разных хранилищах данных, но функциональность остается практически одинаковой.

Ниже мы опишем некоторые незначительные различия в реализации между некоторыми хранилищами данных.

## Функция DATE_TRUNC в Snowflake и Databricks

В [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/date_trunc.html) и [Databricks](https://docs.databricks.com/sql/language-manual/functions/date_trunc.html) вы можете использовать функцию DATE_TRUNC с помощью следующего синтаксиса:

```sql
date_trunc(<date_part>, <date/time field>)
```

На этих платформах `<date_part>` передается в качестве первого аргумента в функции DATE_TRUNC.

## Функция DATE_TRUNC в Google BigQuery и Amazon Redshift

В [Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions#date_trunc) и [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_DATE_TRUNC.html) `<date_part>` передается в качестве первого аргумента, а `<date/time field>` — в качестве второго аргумента:

```sql
date_trunc(<date/time field>, <date part>)
```

Примечание о BigQuery: функция DATE_TRUNC в BigQuery поддерживает усечение типов данных даты, тогда как в Snowflake, Redshift и Databricks `<date/time field>` может быть типом данных даты или метки времени. BigQuery также поддерживает функции DATETIME_TRUNC и TIMESTAMP_TRUNC для усечения более детализированных типов данных даты/времени.

## Макрос dbt, который стоит запомнить

Почему Snowflake, Amazon Redshift, Databricks и Google BigQuery решили использовать разные реализации по сути одной и той же функции, остается загадкой, и не стоит ломать голову, пытаясь это выяснить. Вместо того чтобы запоминать, что идет первым — `<date_part>` или `<date/time field>`, (что, честно говоря, мы никогда не можем запомнить) вы можете полагаться на макрос dbt Core, чтобы избежать капризного синтаксиса.

[Адаптеры](https://docs.getdbt.com/docs/supported-data-platforms) поддерживают [кросс-базовые макросы](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros), которые помогают вам писать определенные функции, такие как DATE_TRUNC и DATEDIFF, без необходимости запоминать сложный синтаксис функций.

Используя [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop/blob/main/models/orders.sql), простой набор данных и проект dbt, вы можете усечь `order_date` из таблицы заказов, используя [макрос dbt DATE_TRUNC](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros#date_trunc):

```sql
select
   order_id,
   order_date,
   {{ date_trunc("week", "order_date") }} as order_week,
   {{ date_trunc("month", "order_date") }} as order_month,
   {{ date_trunc("year", "order_date") }} as order_year
from {{ ref('orders') }}
```

Выполнение вышеуказанного кода даст следующие примерные результаты:

| **order_id** | **order_date** | **order_week** | **order_month** | **order_year** |
|:---:|:---:|:---:|:---:|:---:|
| 1 | 2018-01-01 | 2018-01-01 | 2018-01-01 | 2018-01-01 |
| 70 | 2018-03-12 | 2018-03-12 | 2018-03-01 | 2018-01-01 |
| 91 | 2018-03-31 | 2018-03-26 | 2018-03-01 | 2018-01-01 |

Поля `order_week`, `order_month` и `order_year` являются усеченными значениями из поля `order_date`.