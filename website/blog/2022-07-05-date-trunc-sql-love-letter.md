---
title: "Функция SQL DATE_TRUNC: Почему мы её любим"
description: "Функция DATE_TRUNC усечет дату или время до первой единицы заданной части даты, сохраняя формат даты. Многословно, многословно, многословно! Что это на самом деле значит?"
slug: date-trunc-sql
canonical_url: https://docs.getdbt.tech/sql-reference/date-trunc

authors: [kira_furuichi]

tags: [sql magic]
hide_table_of_contents: true

date: 2022-07-13
is_featured: false
---
В общем, люди, работающие с данными, предпочитают более детализированные данные менее детализированным. [Метки времени > даты](https://docs.getdbt.tech/blog/when-backend-devs-spark-joy#signs-the-data-is-sparking-joy), ежедневные данные > еженедельные данные и т.д.; наличие данных на более детализированном уровне всегда позволяет вам приблизиться. Однако, скорее всего, вы смотрите на свои данные на несколько отдаленном уровне — еженедельно, ежемесячно или даже ежегодно. Для этого вам понадобится удобная функция, которая поможет округлить поля даты или времени.

Функция DATE_TRUNC усечет дату или время до первой единицы заданной части даты. Многословно, многословно, многословно! Что это на самом деле значит? Если вы усечете `2021-12-13` до месяца, она вернет `2021-12-01` (первый день месяца).

С помощью функции DATE_TRUNC вы можете усекать до недель, месяцев, лет или других частей даты для поля даты или времени. Это может сделать поля даты/времени более удобочитаемыми, а также помочь в проведении более чистого анализа, основанного на времени.

<!--truncate-->

> **Что такое SQL-функция?**
> На высоком уровне функция принимает входные данные (или несколько входных данных) и возвращает манипуляцию с этими данными. Некоторые распространенные SQL-функции: [COALESCE](https://getdbt.com/sql-foundations/coalesce-sql-love-letter/), [LOWER](https://getdbt.com/sql-foundations/lower-sql-love-letter/) и [EXTRACT](https://getdbt.com/sql-foundations/extract-sql-love-letter/). Например, функция COALESCE принимает группу значений и возвращает первое ненулевое значение из этой группы.

В целом, это отличная функция, которая поможет вам агрегировать ваши данные в определенные части даты, сохраняя формат даты. Однако функция DATE_TRUNC не является вашим швейцарским ножом — она не может творить чудеса или решать все ваши проблемы (мы смотрим на вас, [звезда](https://getdbt.com/sql-foundations/star-sql-love-letter/)). Вместо этого DATE_TRUNC — это ваш стандартный кухонный нож — он прост и эффективен, и вы почти никогда не начинаете готовить (моделирование данных) без него.

## Как использовать функцию DATE_TRUNC {#how-to-use-the-date_trunc-function}

Для функции DATE_TRUNC необходимо передать два аргумента:

* Часть даты: Это дни/месяцы/недели/годы (уровень), до которого вы хотите усечь ваше поле
* Дата/время, которое вы хотите усечь

Функция DATE_TRUNC может использоваться в операторах SELECT и WHERE.

Большинство, если не все, современные облачные хранилища данных поддерживают некоторый тип функции DATE_TRUNC. Могут быть небольшие различия в порядке аргументов для DATE_TRUNC в разных хранилищах данных, но функциональность остается практически одинаковой.

Ниже мы опишем некоторые незначительные различия в реализации между некоторыми хранилищами данных.

### Функция DATE_TRUNC в Snowflake и Databricks {#the-date_trunc-function-in-snowflake-and-databricks}

В [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/date_trunc.html) и [Databricks](https://docs.databricks.com/sql/language-manual/functions/date_trunc.html) вы можете использовать функцию DATE_TRUNC с помощью следующего синтаксиса:

```sql
date_trunc(<date_part>, <date/time field>)
```

На этих платформах `<date_part>` передается в качестве первого аргумента в функции DATE_TRUNC.

### Функция DATE_TRUNC в Google BigQuery и Amazon Redshift {#the-date_trunc-function-in-google-bigquery-and-amazon-redshift}

В [Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions#date_trunc) и [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_DATE_TRUNC.html) `<date_part>` передается в качестве первого аргумента, а `<date/time field>` — в качестве второго аргумента.

```sql
date_trunc(<date/time field>, <date part>)
```

> **Примечание о BigQuery:**
> Функция DATE_TRUNC в BigQuery поддерживает усечение типов данных даты, тогда как в Snowflake, Redshift и Databricks `date/time field` может быть типом данных даты или метки времени. BigQuery также поддерживает функции DATETIME_TRUNC и TIMESTAMP_TRUNC для усечения более детализированных типов данных даты/времени.

## Макрос dbt, который стоит запомнить {#a-dbt-macro-to-remember}

Почему Snowflake, Amazon Redshift, Databricks и Google BigQuery решили использовать разные реализации по сути одной и той же функции, остается загадкой, и не стоит ломать голову, пытаясь это понять. Вместо того чтобы запоминать, что идет первым — `<date_part>` или `<date/time field>`, (что, честно говоря, мы никогда не можем запомнить) вы можете полагаться на макрос dbt Core, чтобы избежать сложного синтаксиса.

С dbt v1.2 [адаптеры](https://docs.getdbt.tech/docs/supported-data-platforms) теперь поддерживают [кросс-базовые макросы](https://docs.getdbt.tech/reference/dbt-jinja-functions/cross-database-macros), которые помогут вам писать определенные функции, такие как [DATE_TRUNC](https://docs.getdbt.tech/reference/dbt-jinja-functions/cross-database-macros#date_trunc) и [DATEDIFF](https://docs.getdbt.tech/reference/dbt-jinja-functions/cross-database-macros#datediff), без необходимости запоминать сложный синтаксис функций.

> **Примечание:**
> Ранее [dbt_utils](https://github.com/dbt-labs/dbt-utils), пакет макросов и тестов, который могут использовать специалисты по данным для написания более DRY-кода в своем проекте dbt, обеспечивал работу кросс-базовых макросов. Теперь кросс-базовые макросы доступны **независимо от того, установлен ли dbt utils или нет.**

Используя [jaffle shop](https://github.com/dbt-labs/jaffle_shop/blob/main/models/orders.sql), простой набор данных и проект dbt, вы можете усечь `order_date` из таблицы `orders`, используя макрос dbt [DATE_TRUNC](https://docs.getdbt.tech/reference/dbt-jinja-functions/cross-database-macros#date_trunc):

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

| order_id | order_date | order_week | order_month | order_year |
|:---:|:---:|:---:|:---:|:---:|
| 1 | 2018-01-01 | 2018-01-01 | 2018-01-01 | 2018-01-01 |
| 70 | 2018-03-12 | 2018-03-12 | 2018-03-01 | 2018-01-01 |
| 91 | 2018-03-31 | 2018-03-26 | 2018-03-01 | 2018-01-01 |

Поля `order_week`, `order_month` и `order_year` являются усеченными значениями из поля `order_date`.

**Небольшое предупреждение:** Если вы используете функцию DATE_TRUNC для изменения полей или создания новых, важно использовать сильные соглашения об именах для этих полей. Поскольку вывод функции DATE_TRUNC выглядит как обычная дата, другие специалисты по данным или бизнес-пользователи могут не понять, что это измененное поле, и могут принять его за фактическую дату, когда что-то произошло.

## Почему мы её любим {#why-we-love-it}

Функция DATE_TRUNC — отличный способ для анализа данных и моделирования данных, которые должны происходить на более отдаленной части даты. Она часто используется для работы, связанной с временем, такой как моделирование удержания клиентов или анализ. Функция DATE_TRUNC также позволяет сохранить формат даты поля, что обеспечивает максимальное удобство и совместимость в большинстве инструментов BI (бизнес-аналитики).

Кратко — DATE_TRUNC — это удобная, широко используемая SQL-функция, и dbt сделал её использование еще проще!

*Этот пост является частью серии SQL love letters — серии о SQL-функциях, которые используют и любят члены команды данных dbt Labs. Вы можете найти [всю коллекцию здесь](https://getdbt.com/sql-foundations/top-sql-functions).*