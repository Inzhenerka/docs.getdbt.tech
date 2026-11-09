---
title: "О макросе run_query"
sidebar_label: "run_query"
id: "run_query"
description: "Используйте макрос `run_query` для выполнения запросов и получения результатов; узнайте, когда он обращается к хранилищу данных при компиляции и выполнении `dbt docs generate`, а также как ограничить выполнение SQL с побочными эффектами с помощью `flags.WHICH`."
---

Макрос `run_query` предоставляет удобный способ выполнять запросы и получать их результаты. Это обёртка над [блоком statement](/reference/dbt-jinja-functions/statement-blocks), который более гибок, но и сложнее в использовании. Если вы только начинаете работать с `run_query`, обратитесь к [руководству по использованию Jinja](/guides/using-jinja?step=8), где приведён пример работы с результатами макроса `run_query` (шаг 8).

:::warning
[`run_query`](/reference/dbt-jinja-functions/run_query) выполняет SQL в хранилище данных всякий раз, когда dbt *компилирует* ваш проект с активным подключением, в том числе при выполнении [`dbt compile`](/reference/commands/compile) и [`dbt docs generate`](/reference/commands/cmd-docs) (по умолчанию). Это ожидаемое поведение, поскольку при компиляции обрабатываются Jinja и макросы. Если вы помещаете операторы <Term id="dml" /> или другие операторы с побочными эффектами внутрь `run_query`, они также выполняются в этих процессах, если вы не ограничите их выполнение, например с помощью [`flags.WHICH`](/reference/dbt-jinja-functions/flags#flagswhich). См. раздел [Как `run_query` выполняется при компиляции и выполнении `dbt docs generate`](#run-query-compilation-and-docs).
:::

## Аргументы

 * `sql`: SQL-запрос для выполнения

Возвращает объект [Table](https://agate.readthedocs.io/page/api/table.html) с результатом запроса. Если указанный запрос не возвращает результатов (например, запрос <Term id="ddl" />, <Term id="dml" /> или запрос для обслуживания), возвращаемое значение будет `none`.

<VersionBlock firstVersion="2.0">

## Проверка типов в dbt v2

<Constant name="fusion_engine" /> обрабатывает наборы результатов с более строгой проверкой значений null. Это может приводить к ошибкам при использовании `run_query` для операций <Term id="ddl" /> или обслуживания (таких как `OPTIMIZE`, `VACUUM`). Если набор результатов содержит значения null в столбцах, объявленных как не допускающие null, v2 завершится с ошибкой, тогда как <Constant name="core" /> молча проигнорировал бы это.

Для операций по принципу «выполнить и забыть», когда набор результатов не нужен, используйте вместо этого [блок statement](/reference/dbt-jinja-functions/statement-blocks) с `fetch_result=False`, как показано в этом примере для Databricks:

```jinja
{% macro run_optimize(table, zorder_fields) %}
  {% set zorder_str = zorder_fields | join(', ') %}

  {% set query %}
    OPTIMIZE {{ table }}
    {% if zorder_str | length > 0 %}
      ZORDER BY ({{ zorder_str }})
    {% endif %}
  {% endset %}

  {% call statement('optimize', fetch_result=False) %}
    {{ query }}
  {% endcall %}
{% endmacro %}
```



</VersionBlock>

:::info Впервые используете run_query?
Посмотрите раздел руководства по началу работы о [использовании Jinja](/guides/using-jinja#dynamically-retrieve-the-list-of-payment-methods) для примера работы с результатами макроса `run_query`!
:::
**Note:** The `run_query` macro will not begin a transaction automatically - if you wish to run your query inside of a transaction, please use `begin` and `commit` statements as appropriate.

### Примеры

<File name='models/my_model.sql'>

```jinja2
{% if execute %}
{% set results = run_query('select 1 as id') %}
{% else %}
{% set results = none %}
{% endif %}

{% if results is not none %}
  {{ log(results.print_table(), info=True) }}
{% endif %}

{# do something with `results` here... #}
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

Вот пример использования этого (хотя если вы используете `run_query` для возврата значений столбца, ознакомьтесь с макросом [get_column_values](https://github.com/dbt-labs/dbt-utils#get_column_values-source) в пакете dbt-utils).

<File name='models/my_model.sql'>

```sql

{% set payment_methods_query %}
select distinct payment_method from app_data.payments
order by 1
{% endset %}

{% set results = run_query(payment_methods_query) %}

{% if execute %}
{# Возвращаем первый столбец #}
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

Вы также можете использовать `run_query` для выполнения SQL-запросов, которые не являются операторами SELECT.

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

Используйте фильтр `length`, чтобы проверить, вернул ли `run_query` какие-либо строки. Оберните эту логику в блок [if execute](/reference/dbt-jinja-functions/execute), чтобы `run_query` не выполнялся во время разбора, когда [`execute`](/reference/dbt-jinja-functions/execute) имеет значение `False`.

```sql
{% if execute %}
{% set results = run_query(payment_methods_query) %}
{% if results|length > 0 %}
-- выполните здесь какие-либо действия с `results`...
{% else %}
    -- выполните резервное действие здесь...
{% endif %}
{% endif %}
```

## Как выполняется `run_query` при компиляции и запуске `dbt docs generate` {#run-query-compilation-and-docs}

Когда dbt *компилирует* модели и другие ресурсы с активным подключением к хранилищу данных, он обрабатывает ваш код Jinja и выполняет все вызовы `run_query()`, до которых доходит выполнение в вашем проекте. Это нормальное поведение: макросам интроспекции требуется доступ к хранилищу данных так же, как и другим этапам компиляции. Компиляция происходит при выполнении `dbt run` и `dbt build`, а также `dbt compile`, `dbt docs generate` (если выполняется компиляция) и других команд, которые компилируют проект, — а не только на тех этапах, на которых dbt, как можно было бы ожидать, «создаёт» таблицы.

[`dbt docs generate`](/reference/commands/cmd-docs) **по умолчанию компилирует ваш проект** (если не передать [`--no-compile`](/reference/commands/cmd-docs)). Поэтому при генерации документации `run_query()` выполняется по тем же правилам, что и в других процессах компиляции, в том числе для ресурсов, которые не входят в выборку конкретного запуска `dbt run`.

### При компиляции `execute` имеет значение `True`

Переменная контекста [`execute`](/reference/dbt-jinja-functions/execute) имеет значение `True` всякий раз, когда dbt выполняет компиляцию с подключением к хранилищу данных, а не только при материализации моделей во время `dbt run`. Условие вида `{% if execute %}` по-прежнему допускает выполнение `run_query()` при запуске [`dbt docs generate`](/reference/commands/cmd-docs) и [`dbt compile`](/reference/commands/compile), поскольку эти команды компилируют ваш проект. Условия вида `{% if execute and is_incremental() %}` меняют то, когда выполняется SQL-код инкрементальной модели, но не отключают саму компиляцию. Поэтому сами по себе они не предотвращают выполнение `run_query()` при генерации документации или компиляции, если только ваш код Jinja не исключает этот вызов в соответствующих ветвях выполнения.

Если вы хотите, чтобы <Term id="dml" /> или другой SQL-код с побочными эффектами выполнялся только для определённых команд dbt, добавьте ещё одно условие, например с использованием [`flags.WHICH`](/reference/dbt-jinja-functions/flags#flagswhich).

### Ограничьте выполнение SQL-кода с побочными эффектами с помощью `flags.WHICH`

Используйте [`execute`](/reference/dbt-jinja-functions/execute) вместе с [`flags.WHICH`](/reference/dbt-jinja-functions/flags#flagswhich), чтобы <Term id="dml" /> выполнялся только при запуске нужной вам команды (`run`, `build` и так далее), а не когда dbt выполняет компиляцию для `docs`, `compile` или других команд, при которых побочные эффекты были бы неожиданными. Полный список значений команд приведён в таблице `flags.WHICH`.

```sql
{% if execute and flags.WHICH in ['run', 'build'] %}
  {% do run_query('delete from my_scratch_table where session_id = ...') %}
{% endif %}
```

Скорректируйте список команд в соответствии с тем, при выполнении каких команд должен запускаться ваш макрос.
