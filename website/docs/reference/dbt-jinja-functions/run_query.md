---
title: "О макросе run_query"
sidebar_label: "run_query"
id: "run_query"
description: "Используйте макрос `run_query` для выполнения запросов и получения результатов."
---

Макрос `run_query` предоставляет удобный способ выполнения запросов и получения их результатов. Это обертка вокруг [блока операторов](/reference/dbt-jinja-functions/statement-blocks), который более гибкий, но также более сложный в использовании.

__Аргументы__:
 * `query`: SQL-запрос для выполнения

Возвращает объект [Table](https://agate.readthedocs.io/page/api/table.html) с результатом запроса. Если указанный запрос не возвращает результатов (например, <Term id="ddl" />, <Term id="dml" /> или запрос на обслуживание), то возвращаемое значение будет `none`.

**Примечание:** Макрос `run_query` не начнет транзакцию автоматически - если вы хотите выполнить ваш запрос внутри транзакции, пожалуйста, используйте операторы `begin` и `commit` по мере необходимости.

:::info Используете run_query в первый раз?
Посмотрите раздел руководства по началу работы о [использовании Jinja](/guides/using-jinja#dynamically-retrieve-the-list-of-payment-methods) для примера работы с результатами макроса `run_query`!
:::

**Пример использования:**

<File name='models/my_model.sql'>

```jinja2
{% set results = run_query('select 1 as id') %}
{% do results.print_table() %}

-- сделайте что-то с `results` здесь...
```

</File>



<File name='macros/run_grants.sql'>

```jinja2
{% macro run_vacuum(table) %}

  {% set query %}
    vacuum table {{ table }}
  {% endset %}

  {% do run_query(query) %}
{% endmacro %}
```

</File>

Вот пример использования этого (хотя если вы используете `run_query` для возврата значений столбца, посмотрите макрос [get_column_values](https://github.com/dbt-labs/dbt-utils#get_column_values-source) в пакете dbt-utils).

<File name='models/my_model.sql'>

```sql

{% set payment_methods_query %}
select distinct payment_method from app_data.payments
order by 1
{% endset %}

{% set results = run_query(payment_methods_query) %}

{% if execute %}
{# Вернуть первый столбец #}
{% set results_list = results.columns[0].values() %}
{% else %}
{% set results_list = [] %}
{% endif %}

select
order_id,
{% for payment_method in results_list %}
sum(case when payment_method = '{{ payment_method }}' then amount end) as {{ payment_method }}_amount,
{% endfor %}
sum(amount) as total_amount
from {{ ref('raw_payments') }}
group by 1

```
</File>


Вы также можете использовать `run_query` для выполнения SQL-запросов, которые не являются операторами select.

<File name='macros/run_vacuum.sql'>

```sql
{% macro run_vacuum(table) %}

  {% set query %}
    vacuum table {{ table }}
  {% endset %}

  {% do run_query(query) %}
{% endmacro %}
```

</File>


Используйте фильтр `length`, чтобы проверить, вернул ли `run_query` какие-либо строки или нет. Убедитесь, что вы обернули логику в блок [if execute](/reference/dbt-jinja-functions/execute), чтобы избежать неожиданных результатов во время разбора. 

```sql
{% if execute %}
{% set results = run_query(payment_methods_query) %}
{% if results|length > 0 %}
  	-- сделайте что-то с `results` здесь...
{% else %}
    -- выполните резервный вариант здесь...
{% endif %}
{% endif %}
```