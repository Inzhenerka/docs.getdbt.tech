---
title: "Функция DATEDIFF в SQL: Почему мы её любим"
description: "Функция DATEDIFF возвращает разницу в указанных единицах (например, дни, недели, годы) между начальной и конечной датой/временем. Это простая и широко используемая функция, которую вы будете использовать чаще, чем ожидаете."
slug: datediff-sql-love-letter
canonical_url: https://docs.getdbt.tech/sql-reference/datediff

authors: [kira_furuichi]

tags: [sql magic]
hide_table_of_contents: false

date: 2022-07-13
is_featured: false
---

*«Сколько времени прошло с тех пор, как этот клиент последний раз делал у нас заказ?»*

*«Какое среднее количество дней до конверсии?»*

Бизнес-пользователи будут задавать эти вопросы, а специалисты по данным должны будут на них ответить, и единственный способ решить их — это вычислить время между двумя разными датами. К счастью, есть удобная функция DATEDIFF, которая может это сделать за вас.

Функция DATEDIFF возвращает разницу в указанных единицах (например, дни, недели, годы) между начальной и конечной датой/временем. Это простая и широко используемая функция, которую вы будете использовать чаще, чем ожидаете.

<!--truncate-->

> **Что такое SQL функция?**
> На высоком уровне функция принимает входные данные (или несколько входных данных) и возвращает манипуляцию с этими данными. Некоторые распространенные SQL функции — это [COALESCE](https://getdbt.com/sql-foundations/coalesce-sql-love-letter/), [LOWER](https://getdbt.com/sql-foundations/lower-sql-love-letter/) и [EXTRACT](https://getdbt.com/sql-foundations/extract-sql-love-letter/). Например, функция COALESCE принимает группу значений и возвращает первое ненулевое значение из этой группы.

DATEDIFF немного похожа на вашу любимую пару носков; вы обычно легко находите первый и чувствуете, что день будет отличным. Но по какой-то причине, чтобы найти второй носок, нужно немного покопаться в ящике. DATEDIFF — это эта пара носков: вы неизбежно будете гуглить синтаксис почти каждый раз, когда используете её, но не сможете обойтись без неё в течение дня.

В этом посте мы рассмотрим, как использовать функцию DATEDIFF в различных хранилищах данных и как писать более стандартизированные функции DATEDIFF с использованием макроса dbt (или успешно находить свои носки в паре за один раз).

## Как использовать функцию DATEDIFF

Для функции DATEDIFF передаются три элемента или аргумента:

* Часть даты: Это дни/месяцы/недели/годы (единица) разницы, которая вычисляется
* Первая (начальная) дата/время
* Вторая (конечная) дата/время

Функция DATEDIFF может использоваться в операторах SELECT и WHERE.

Большинство современных облачных хранилищ данных поддерживают некоторый тип функции DATEDIFF. Могут быть небольшие различия в порядке аргументов и названии функции DATEDIFF в разных хранилищах данных, но функциональность остается практически одинаковой.

Ниже мы опишем некоторые незначительные различия в реализации между некоторыми хранилищами данных.

### DATEDIFF в Snowflake, Amazon Redshift и Databricks

Синтаксис для использования функции DATEDIFF в [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/datediff.html), [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_DATEDIFF_function.html) и [Databricks](https://docs.databricks.com/sql/language-manual/functions/datediff3.html) выглядит следующим образом:

```sql
datediff(<date part>, <start date/time>, <end date/time>)
```

> **Примечание о Databricks:**
> Databricks дополнительно поддерживает отдельную [функцию DATEDIFF](https://docs.databricks.com/sql/language-manual/functions/datediff.html), которая принимает только два аргумента: начальную и конечную дату. Функция всегда возвращает разницу между двумя датами в днях.

### DATEDIFF в Google BigQuery

Синтаксис для использования функции DATEDIFF в [Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/datetime_functions#datetime_diff) выглядит следующим образом:

Три небольших различия в реализации здесь:

* В отличие от Snowflake, Amazon Redshift и Databricks, где `<date part>` передается в качестве первого аргумента, в Google BigQuery `<date part>` передается в качестве последнего аргумента.
* Google BigQuery также называет функцию DATETIME_DIFF с дополнительным подчеркиванием, разделяющим имя функции. Это соответствует [предпочтению Google BigQuery использовать подчеркивания в именах функций](https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions).
* Аргументы DATETIME_DIFF — это datetime, а не date; функции DATEDIFF в Snowflake, Redshift и Databricks поддерживают несколько типов дат, таких как date и timestamp. BigQuery также поддерживает отдельную [функцию DATE_DIFF](https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions#date_diff), которая возвращает разницу между двумя типами `date`, в отличие от DATETIME_DIFF, которая поддерживает только тип `datetime`.

## Герой в тени: макрос DATEDIFF в dbt!

Вы можете запомнить синтаксис функции DATEDIFF для основного хранилища данных, которое вы используете. Что произойдет, когда вы перейдете на другое для новой работы или нового стека данных? Запоминание, есть ли подчеркивание в имени функции или в каком аргументе передается `<date part>`, не доставляет удовольствия и приводит к неизбежным, бесчисленным поискам в Google «datediff в bigquery».

К счастью, [dbt-core](https://github.com/dbt-labs/dbt-core) вас поддерживает! dbt Core — это открытый продукт dbt, который помогает специалистам по данным писать свои [преобразования данных](https://www.getdbt.com/analytics-engineering/transformation/), следуя лучшим практикам программной инженерии.

С dbt v1.2 [адаптеры](https://docs.getdbt.tech/docs/supported-data-platforms) теперь поддерживают [кросс-базовые макросы](https://docs.getdbt.tech/reference/dbt-jinja-functions/cross-database-macros), чтобы помочь вам писать определенные функции, такие как [DATE_TRUNC](https://docs.getdbt.tech/reference/dbt-jinja-functions/cross-database-macros#date_trunc) и [DATEDIFF](https://docs.getdbt.tech/reference/dbt-jinja-functions/cross-database-macros#datediff), без необходимости запоминать сложный синтаксис функций.

> **Примечание:**
> Ранее [dbt_utils](https://github.com/dbt-labs/dbt-utils), пакет макросов и тестов, который специалисты по данным могут использовать для написания более DRY кода в своем проекте dbt, обеспечивал работу кросс-базовых макросов. Теперь кросс-базовые макросы доступны **независимо от того, установлен ли dbt utils или нет.**

Используя [макрос DATEDIFF](https://docs.getdbt.tech/reference/dbt-jinja-functions/cross-database-macros#datediff), вы можете вычислить разницу между двумя датами, не беспокоясь о сложном синтаксисе. Это означает, что вы можете успешно запускать *один и тот же код* в нескольких базах данных, не беспокоясь о сложных различиях в синтаксисе.

Используя [jaffle shop](https://github.com/dbt-labs/jaffle_shop/blob/main/models/orders.sql), простой набор данных и проект dbt, мы можем вычислить разницу между двумя датами, используя макрос DATEDIFF в dbt:

```sql
select
	*,
	{{ datediff("order_date", "'2022-06-09'", "day") }}
from {{ ref('orders') }}
```

Это вернет все поля из таблицы `orders` и разницу в днях между датами заказов и 9 июня 2022 года.

Под капотом этот макрос принимает ваши входные данные и создает соответствующий SQL-синтаксис для функции DATEDIFF, *специфичный для вашего хранилища данных.*

*Этот пост является частью серии SQL love letters — серии о SQL функциях, которые используют и любят члены команды данных dbt Labs. Вы можете найти [всю коллекцию здесь](https://getdbt.com/sql-foundations/top-sql-functions).*