---
title: "Используйте Jinja для улучшения вашего SQL-кода"
id: "using-jinja"
description: "Узнайте, как улучшить ваш SQL-код с помощью Jinja."
hoverSnippet: "Улучшите ваш SQL-код с Jinja"
# time_to_complete: '30 minutes' комментируем до тестирования
icon: 'guides'
hide_table_of_contents: true
tags: ['Jinja', 'dbt Core']
level: 'Advanced'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве мы рассмотрим распространенный шаблон, используемый в SQL, и затем применим Jinja для улучшения нашего кода.

Если вы хотите поработать с этим запросом, добавьте [этот CSV](https://github.com/dbt-labs/jaffle_shop/blob/core-v1.0.0/seeds/raw_payments.csv) в папку `seeds/` вашего проекта dbt, а затем выполните `dbt seed`.

Во время работы над шагами этой модели мы рекомендуем также открыть скомпилированный SQL, чтобы проверить, как ваш Jinja компилируется. Для этого:
* **Используя dbt Cloud:** Нажмите кнопку компиляции, чтобы увидеть скомпилированный SQL в правой панели
* **Используя dbt Core:** Запустите `dbt compile` из командной строки. Затем откройте скомпилированный SQL файл в директории `target/compiled/{имя проекта}/`. Используйте разделенный экран в вашем редакторе кода, чтобы держать оба файла открытыми одновременно.

## Напишите SQL без Jinja
Рассмотрим модель данных, в которой `order` может иметь много `payments`. Каждый `payment` может иметь `payment_method` как `bank_transfer`, `credit_card` или `gift_card`, и, следовательно, каждый `order` может иметь несколько `payment_methods`.

С аналитической точки зрения важно знать, сколько из каждого `order` было оплачено с помощью каждого `payment_method`. В вашем проекте dbt вы можете создать модель с именем `order_payment_method_amounts` со следующим SQL:

<File name='models/order_payment_method_amounts.sql'>

```sql
select
order_id,
sum(case when payment_method = 'bank_transfer' then amount end) as bank_transfer_amount,
sum(case when payment_method = 'credit_card' then amount end) as credit_card_amount,
sum(case when payment_method = 'gift_card' then amount end) as gift_card_amount,
sum(amount) as total_amount
from {{ ref('raw_payments') }}
group by 1
```

</File>

SQL для каждого количества платежного метода повторяется, что может быть сложно поддерживать по нескольким причинам:
* Если логика или имя поля изменятся, код нужно будет обновить в трех местах.
* Часто этот код создается путем копирования и вставки, что может привести к ошибкам.
* Другие аналитики, которые просматривают код, менее склонны замечать ошибки, так как обычно просто просматривают повторяющийся код.

Поэтому мы собираемся использовать Jinja, чтобы помочь нам упростить его или сделать наш код более "DRY" ("Не повторяйте себя").

## Используйте цикл for в моделях для повторяющегося SQL
Здесь повторяющийся код можно заменить на цикл `for`. Следующий код будет скомпилирован в тот же запрос, но его значительно легче поддерживать.

<File name='/models/order_payment_method_amounts.sql'>

```sql
select
order_id,
{% for payment_method in ["bank_transfer", "credit_card", "gift_card"] %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount,
{% endfor %}
sum(amount) as total_amount
from {{ ref('raw_payments') }}
group by 1
```

</File>

## Установите переменные в верхней части модели
Мы рекомендуем устанавливать переменные в верхней части модели, так как это помогает с читаемостью и позволяет вам ссылаться на список в нескольких местах, если это необходимо. Это практика, заимствованная из многих других языков программирования.

<File name='/models/order_payment_method_amounts.sql'>

```sql
{% set payment_methods = ["bank_transfer", "credit_card", "gift_card"] %}

select
order_id,
{% for payment_method in payment_methods %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount,
{% endfor %}
sum(amount) as total_amount
from {{ ref('raw_payments') }}
group by 1
```

</File>

## Используйте loop.last, чтобы избежать висячих запятых
В приведенном выше запросе наш последний столбец находится вне цикла `for`. Однако это может быть не всегда так. Если последняя итерация цикла является нашим финальным столбцом, нам нужно убедиться, что в конце нет висячей запятой.

Мы часто используем оператор `if` вместе с переменной Jinja `loop.last`, чтобы убедиться, что мы не добавляем лишнюю запятую:

<File name='/models/order_payment_method_amounts.sql'>

```sql
{% set payment_methods = ["bank_transfer", "credit_card", "gift_card"] %}

select
order_id,
{% for payment_method in payment_methods %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount
{% if not loop.last %},{% endif %}
{% endfor %}
from {{ ref('raw_payments') }}
group by 1
```

</File>

Альтернативный способ записи этого: `{{ "," if not loop.last }}`.

## Используйте управление пробелами для упорядочивания скомпилированного кода
Если вы проверяли свой код в папке `target/compiled`, вы могли заметить, что этот код приводит к большому количеству пробелов:

<File name='target/compiled/jaffle_shop/order_payment_method_amounts.sql'>

```sql


select
order_id,

sum(case when payment_method = 'bank_transfer' then amount end) as bank_transfer_amount
,

sum(case when payment_method = 'credit_card' then amount end) as credit_card_amount
,

sum(case when payment_method = 'gift_card' then amount end) as gift_card_amount


from raw_jaffle_shop.payments
group by 1
```

</File>

Мы можем использовать [управление пробелами](https://jinja.palletsprojects.com/page/templates/#whitespace-control), чтобы упорядочить наш код:

<File name='models/order_payment_method_amounts.sql'>

```sql
{%- set payment_methods = ["bank_transfer", "credit_card", "gift_card"] -%}

select
order_id,
{%- for payment_method in payment_methods %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount
{%- if not loop.last %},{% endif -%}
{% endfor %}
from {{ ref('raw_payments') }}
group by 1

```

</File>

Правильное управление пробелами часто требует много проб и ошибок! Мы рекомендуем приоритизировать читаемость вашего модельного кода над читаемостью скомпилированного кода и делать это только как дополнительную полировку.

## Используйте макрос для возврата методов оплаты
Здесь мы жестко закодировали список методов оплаты в нашей модели. Возможно, нам нужно будет получить доступ к этому списку из другой модели. Хорошим решением здесь будет использовать [переменную](/docs/build/project-variables), но для целей этого руководства мы вместо этого будем использовать макрос!

[Макросы](/docs/build/jinja-macros#macros) в Jinja — это фрагменты кода, которые можно вызывать несколько раз — они аналогичны функции в Python и чрезвычайно полезны, если вы обнаружите, что повторяете код в нескольких моделях.

Наш макрос просто вернет список методов оплаты:

<File name='/macros/get_payment_methods.sql'>

```sql
{% macro get_payment_methods() %}
{{ return(["bank_transfer", "credit_card", "gift_card"]) }}
{% endmacro %}
```

</File>

Есть несколько моментов, на которые стоит обратить внимание:
* Обычно макросы принимают аргументы — мы увидим это позже, но на данный момент нам все равно нужно настроить наш макрос с пустыми скобками, где обычно находятся аргументы (т.е. `get_payment_methods()`)
* Мы использовали функцию [return](/reference/dbt-jinja-functions/return), чтобы вернуть список — без этой функции макрос вернул бы строку.

Теперь, когда у нас есть макрос для наших методов оплаты, мы можем обновить нашу модель следующим образом:

<File name='models/order_payment_method_amounts.sql'>

```sql
{%- set payment_methods = get_payment_methods() -%}

select
order_id,
{%- for payment_method in payment_methods %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount
{%- if not loop.last %},{% endif -%}
{% endfor %}
from {{ ref('raw_payments') }}
group by 1

```

</File>

Обратите внимание, что мы не использовали фигурные скобки при вызове макроса — мы уже находимся внутри оператора Jinja, поэтому нет необходимости использовать скобки снова.

## Динамически извлекайте список методов оплаты
До сих пор мы жестко закодировали список возможных методов оплаты. Если новый `payment_method` был введен или один из существующих методов был переименован, список нужно будет обновить.

Тем не менее, в любой момент вы можете узнать, какие `payment_methods` используются для совершения платежа, выполнив следующий запрос:
```sql
select distinct
payment_method
from {{ ref('raw_payments') }}
order by 1
```
[Операторы](/reference/dbt-jinja-functions/statement-blocks) предоставляют способ выполнить этот запрос и вернуть результаты в ваш контекст Jinja. Это означает, что список `payment_methods` может быть установлен на основе данных в вашей базе данных, а не жестко закодированного значения.

Самый простой способ использовать оператор — это через макрос [run_query](/reference/dbt-jinja-functions/run_query). Для первой версии давайте проверим, что мы получаем от базы данных, записывая результаты в командной строке с помощью функции [log](/reference/dbt-jinja-functions/log).

<File name='macros/get_payment_methods.sql'>

```sql
{% macro get_payment_methods() %}

{% set payment_methods_query %}
select distinct
payment_method
from {{ ref('raw_payments') }}
order by 1
{% endset %}

{% set results = run_query(payment_methods_query) %}

{{ log(results, info=True) }}

{{ return([]) }}

{% endmacro %}
```

</File>

Командная строка возвращает нам следующее:
```bash
| column         | data_type |
| -------------- | --------- |
| payment_method | Text      |
```
Это на самом деле [таблица Agate](https://agate.readthedocs.io/page/api/table.html). Чтобы получить методы оплаты в виде списка, нам нужно сделать некоторые дополнительные преобразования.

```sql
{% macro get_payment_methods() %}

{% set payment_methods_query %}
select distinct
payment_method
from {{ ref('raw_payments') }}
order by 1
{% endset %}

{% set results = run_query(payment_methods_query) %}

{% if execute %}
{# Вернуть первый столбец #}
{% set results_list = results.columns[0].values() %}
{% else %}
{% set results_list = [] %}
{% endif %}

{{ return(results_list) }}

{% endmacro %}
```

Здесь есть несколько сложных моментов:
* Мы использовали переменную [execute](/reference/dbt-jinja-functions/execute), чтобы убедиться, что код выполняется на этапе `parse` dbt (в противном случае возникла бы ошибка).
* Мы использовали методы Agate, чтобы получить столбец в виде списка.

К счастью, наш код модели не нужно обновлять, так как мы уже вызываем макрос, чтобы получить список методов оплаты. И теперь любые новые `payment_methods`, добавленные в основную модель данных, будут автоматически обрабатываться моделью dbt.

## Пишите модульные макросы
Вы можете захотеть использовать аналогичный шаблон в другом месте вашего проекта dbt. В результате вы решаете разбить вашу логику на два отдельных макроса — один для общего возврата столбца из отношения, а другой, который вызывает этот макрос с правильными аргументами, чтобы получить список методов оплаты.

<File name='macros/get_payment_methods.sql'>

```sql
{% macro get_column_values(column_name, relation) %}

{% set relation_query %}
select distinct
{{ column_name }}
from {{ relation }}
order by 1
{% endset %}

{% set results = run_query(relation_query) %}

{% if execute %}
{# Вернуть первый столбец #}
{% set results_list = results.columns[0].values() %}
{% else %}
{% set results_list = [] %}
{% endif %}

{{ return(results_list) }}

{% endmacro %}


{% macro get_payment_methods() %}

{{ return(get_column_values('payment_method', ref('raw_payments'))) }}

{% endmacro %}

```

</File>

## Используйте макрос из пакета
Макросы позволяют аналитикам применять принципы программной инженерии к SQL, который они пишут. Одна из функций макросов, которая делает их еще более мощными, — это возможность делиться ими между проектами.

Уже написано множество полезных макросов dbt в [пакете dbt-utils](https://github.com/dbt-labs/dbt-utils). Например, макрос [get_column_values](https://github.com/dbt-labs/dbt-utils#get_column_values-source) из dbt-utils можно использовать вместо макроса `get_column_values`, который мы написали сами (что сэкономит нам много времени, но, по крайней мере, мы чему-то научились на этом пути!).

Установите пакет [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) в ваш проект (документация [здесь](/docs/build/packages)), а затем обновите вашу модель, чтобы использовать макрос из пакета:

<File name='models/order_payment_method_amounts.sql'>

```sql
{%- set payment_methods = dbt_utils.get_column_values(
    table=ref('raw_payments'),
    column='payment_method'
) -%}

select
order_id,
{%- for payment_method in payment_methods %}
sum(case when payment_method = '{{payment_method}}' then amount end) as {{payment_method}}_amount
{%- if not loop.last %},{% endif -%}
{% endfor %}
from {{ ref('raw_payments') }}
group by 1

```

</File>

Затем вы можете удалить макросы, которые мы создали на предыдущих этапах. Каждый раз, когда вы пытаетесь решить проблему, которую, как вы думаете, другие могли решить ранее, стоит проверить пакет [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/), чтобы увидеть, поделился ли кто-то своим кодом!

</div>