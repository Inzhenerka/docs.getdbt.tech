---
title: Как определить тип столбца?
description: "Использование функции cast для определения типа столбца"
sidebar_label: 'Как определить тип столбца'
id: define-a-column-type

---

SQL-движок вашего хранилища данных автоматически присваивает [тип данных](https://www.w3schools.com/sql/sql_datatypes.asp) каждому столбцу, будь то источник или модель. Чтобы заставить SQL обрабатывать столбцы как определенный тип данных, используйте функции `cast`:

<File name='models/order_prices.sql'>

```sql
select
    cast(order_id as integer),
    cast(order_price as double(6,2)) -- более общий способ преобразования типа
from {{ ref('stg_orders') }}

```

</File>

Многие современные <Term id="data-warehouse" /> теперь поддерживают синтаксис `::` как сокращение для `cast( as )`.

<File name='models/orders_prices_colon_syntax.sql'>

```sql
select
    order_id::integer,
    order_price::numeric(6,2) -- вы можете встретить это в Redshift, Snowflake и Postgres
from {{ ref('stg_orders') }}

```

</File>

Будьте осторожны, чтение данных и их приведение может не всегда давать ожидаемые результаты, и у каждого хранилища есть свои особенности. Некоторые приведения могут быть недопустимы (например, в Bigquery нельзя привести значение типа `boolean` к `float64`). Приведения, которые связаны с потерей точности (например, `float` к `integer`), полагаются на ваш SQL-движок, чтобы сделать наилучшее предположение или следовать определенной схеме, не используемой конкурентными сервисами. При выполнении приведений важно быть знакомым с правилами приведения вашего хранилища, чтобы правильно обозначать поля в ваших источниках и моделях.

К счастью, популярные сервисы баз данных, как правило, имеют документацию по типам данных--[Redshift](https://docs.amazonaws.cn/en_us/redshift/latest/dg/r_CAST_function.html) и [Bigquery](https://cloud.google.com/bigquery/docs/reference/standard-sql/conversion_rules).