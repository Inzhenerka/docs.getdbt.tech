---
title: "Функция SQL EXTRACT: Почему мы её любим"
description: "В этом посте мы подробно рассмотрим функцию EXTRACT, как она работает и почему мы её используем. Функция EXTRACT позволяет извлечь указанную часть даты из даты/времени."
slug: extract-sql-love-letter

authors: [kira_furuichi]

tags: [sql magic]
hide_table_of_contents: false

date: 2022-05-15
is_featured: false
---
Существует множество различных функций для работы с датами в SQL — например, [DATEDIFF](https://docs.getdbt.tech/blog/datediff-sql-love-letter/), [DATEADD](https://docs.getdbt.tech/blog/sql-dateadd), DATE_PART и [DATE_TRUNC](https://docs.getdbt.tech/date-trunc-sql). У каждой из них свои случаи использования, и понимание того, как и когда их использовать, является основой работы с SQL. Является ли какая-либо из них такой же простой в использовании, как функция EXTRACT? Ну, это тема для другого обсуждения...

В этом посте мы подробно рассмотрим функцию EXTRACT, как она работает и почему мы её используем.

<!--truncate-->

Функция EXTRACT позволяет извлечь указанную часть даты из даты/времени. Например, если вы извлечете месяц из даты 14 февраля 2022 года, она вернёт 2, так как февраль — это второй месяц в году.

> **Что такое функция SQL?**
> На высоком уровне функция принимает входные данные (или несколько входных данных) и возвращает их обработку. Некоторые распространённые функции SQL — это [COALESCE](https://docs.getdbt.tech/blog/coalesce-sql-love-letter/), [LOWER](https://docs.getdbt.tech/blog/lower-sql-love-letter/) и [DATEDIFF](https://docs.getdbt.tech/blog/datediff-sql-love-letter/). Например, функция COALESCE принимает группу значений и возвращает первое ненулевое значение из этой группы.

## Как использовать функцию EXTRACT

Одной из наших любимых особенностей функции EXTRACT является её читаемость. Иногда вы можете столкнуться с функциями SQL и не сразу понять, какие аргументы используются и какой должен быть ожидаемый результат. (Мы смотрим на тебя, SPLIT_PART.) Функция EXTRACT не такая.

Чтобы использовать функцию EXTRACT, вам просто нужно указать часть даты, которую вы хотите извлечь, и поле, из которого вы хотите извлечь. Вы можете извлечь множество различных частей даты, но чаще всего вы увидите извлечение года, месяца, недели года или квартала из даты.

```yaml
extract(<date_part> from <date/time field>)
```

В зависимости от используемого вами хранилища данных, значение, возвращаемое функцией EXTRACT, часто является числовым значением или тем же типом даты, что и входное поле `<date/time field>`. Ознакомьтесь с [документацией вашего хранилища данных](#data-warehouse-support-for-extract-function), чтобы лучше понять результаты EXTRACT.

> **Примечание:**
> Вы также можете увидеть использование запятой вместо 'from' в функции EXTRACT, как `extract(<date_part>, <date/time field>)`. Мы считаем, что использование 'from' в функции делает её немного более читаемой.

### Функция DATE_PART

Вы также можете увидеть использование функции DATE_PART вместо функции EXTRACT. Обе функции, DATE_PART и EXTRACT, выполняют одну и ту же функциональность, это просто вопрос предпочтений, какую из них вы хотите использовать.

> **Postgres и DATE_PART:**
> Это может показаться излишне педантичным, и вы, вероятно, никогда не столкнётесь с проблемой, когда DATE_PART и EXTRACT дают различия в значениях, которые действительно имеют значение, но это стоит отметить. Ранее функции DATE_PART и EXTRACT в Postgres давали одинаковый результат. Однако с Postgres 14 [функция EXTRACT теперь возвращает числовой тип вместо 8-байтового числа с плавающей запятой.](https://stackoverflow.com/questions/38442340/difference-between-extractyear-from-timestamp-function-and-date-partyear-t)

### Поддержка функции EXTRACT в хранилищах данных

[Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/datetime_functions#extract), [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_EXTRACT_function.html), [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/extract.html), [Postgres](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-extract/) и [Databricks](https://docs.databricks.com/sql/language-manual/functions/extract.html) поддерживают функцию EXTRACT. Кроме того, синтаксис использования EXTRACT одинаков во всех них.

## Пример использования функции EXTRACT

Давайте рассмотрим реальный пример! Мы будем использовать [jaffle shop](https://github.com/dbt-labs/jaffle_shop/blob/main/models/orders.sql), простой набор данных и проект dbt, чтобы помочь нам. В таблице `orders` <Term id="table" /> jaffle shop есть некоторые поля, связанные со статусом заказа, датой заказа и суммой заказа.

Вы можете извлечь различные значения, основанные на времени (недели, месяцы, годы и т.д.), из `order_date` в модели `orders`, используя следующий код:

```sql
select 
	order_id,
	order_date,
	extract(week from order_date) as order_week,
	extract(month from order_date) as order_month,
	extract(year from order_date) as order_year
from {{ ref('orders') }}
```

После выполнения этого запроса ваши результаты будут выглядеть примерно так:

| **order_id** | **order_date** | **order_week** | **order_month** | **order_year** |
| ------------ | -------------- | -------------- | --------------- | -------------- |
| 1            | 2018-01-01     | 1              | 1               | 2018           |
| 9            | 2018-01-12     | 2              | 1               | 2018           |
| 72           | 2018-03-23     | 12             | 3               | 2018           |

Как видите, этот запрос извлёк неделю года, месяц года и год из `order_date`.

## Почему мы её любим

Будем честны: EXTRACT не является самой широко используемой функцией SQL в нашем проекте dbt. Однако у EXTRACT есть своё время и место:

* Фискальные календари: Если ваш бизнес использует фискальные годы или календари, отличающиеся от обычного 12-месячного цикла, функции EXTRACT могут помочь создать соответствие между фискальными и обычными календарями.
* Разовые анализы: Функции EXTRACT полезны в разовых анализах и запросах, когда вам нужно рассмотреть значения, сгруппированные по периодам дат или для сравнения периодов.

EXTRACT — это последовательная, полезная и простая функция — что ещё можно пожелать от ~~друга~~ функции?