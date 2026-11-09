---
title: "О блоках statement"
sidebar_label: "statement blocks"
id: "statement-blocks"
description: "SQL‑запросы, которые выполняются в базе данных и возвращают результаты в ваш Jinja‑контекст."
---

<VersionBlock lastVersion="1.99">

:::tip Рекомендация

Мы рекомендуем использовать макрос [`run_query`](/reference/dbt-jinja-functions/run_query) вместо блоков `statement`. Макрос `run_query` предоставляет более удобный способ выполнения запросов и получения их результатов, оборачивая блоки `statement`. Вы можете использовать этот макрос для написания более лаконичного кода, который легче поддерживать.

:::

</VersionBlock>

<VersionBlock firstVersion="2.0">

:::tip Когда использовать блоки statement в <Constant name="fusion" />

Для запросов, результаты которых нужно получить (например, когда вашему макросу или коду Jinja нужны данные, возвращаемые из базы данных), можно использовать блоки `statement` с `fetch_result=True` или [макрос `run_query`](/reference/dbt-jinja-functions/run_query).

Для операций <Term id="ddl" /> или служебных операций (таких как `OPTIMIZE`, `VACUUM` или запросы для обслуживания) используйте блоки `statement` с `fetch_result=False`, если вам не нужен доступ к результатам в Jinja. Это позволяет избежать проблем со строгой проверкой типов в <Constant name="fusion" />, которая может завершиться ошибкой при обработке наборов результатов, содержащих значения `NULL` в столбцах, объявленных как не допускающие `NULL`.

:::

</VersionBlock>

Блоки `statement` — это SQL-запросы, которые обращаются к базе данных и возвращают результаты в ваш контекст Jinja. Вот пример блока `statement`, который получает все штаты из таблицы пользователей (<Term id="table" />).

<File name='get_states_statement.sql'>

```sql
-- depends_on: {{ ref('users') }}

{%- call statement('states', fetch_result=True) -%}

    select distinct state from {{ ref('users') }}

{%- endcall -%}
```

</File>

Сигнатура блока `statement` выглядит следующим образом:

```
statement(name=None, fetch_result=False, auto_begin=True)
```

При выполнении `statement` dbt должен понимать, как разрешать ссылки на другие модели или ресурсы dbt. Если вы уже используете `ref` для модели вне блока statement, зависимость будет автоматически определена, но в противном случае вам нужно будет [принудительно указать зависимость](/reference/dbt-jinja-functions/ref#forcing-dependencies) с помощью `-- depends_on`.

<Expandable alt_header="Пример использования -- depends_on">

```sql
-- depends_on: {{ ref('users') }}

{% call statement('states', fetch_result=True) -%}

    select distinct state from {{ ref('users') }}

    /*
    Уникальные штаты: {{ load_result('states')['data'] }}
    */
{%- endcall %}
```
</Expandable>

<Expandable alt_header="Пример использования функции ref()">

```sql

{% call statement('states', fetch_result=True) -%}

    select distinct state from {{ ref('users') }}

    /*
    Уникальные штаты: {{ load_result('states')['data'] }}
    */

{%- endcall %}

select id * 2 from {{ ref('users') }}
```
</Expandable>

__Аргументы__:
 - `name` (строка): Имя для набора результатов, возвращаемого этим statement
 - `fetch_result` (bool): Если True, загрузить результаты statement в Jinja-контекст
 - `auto_begin` (bool): Если True, открыть транзакцию, если она не существует. Если False, не открывать транзакцию.

После выполнения блока statement набор результатов доступен через функцию `load_result`. Объект результата включает три ключа:
- `response`: Структурированный объект, содержащий метаданные, возвращаемые из базы данных, которые зависят от адаптера. Например, код успеха `code`, количество затронутых строк `rows_affected`, общий объем обработанных байт `bytes_processed` и т.д. Сравнимо с `adapter_response` в [объекте результата](/reference/dbt-classes#result-objects).
- `data`: Питоническое представление данных, возвращаемых запросом (массивы, кортежи, словари).
- `table`: Представление данных в виде таблицы [Agate](https://agate.readthedocs.io/page/api/table.html), возвращаемых запросом.

Для приведенного выше statement это может выглядеть так:

<File name='load_states.sql'>

```sql
{%- set states = load_result('states') -%}
{%- set states_data = states['data'] -%}
{%- set states_status = states['response'] -%}
```

</File>

Содержимое возвращаемого поля `data` — это матрица. Она содержит список строк, каждая из которых является списком значений, возвращаемых базой данных. Для приведенного выше примера эта структура данных может выглядеть так:

<File name='states.sql'>

```python
>>> log(states_data)

[
  ['PA'],
  ['NY'],
  ['CA'],
	...
]
```

</File>

<VersionBlock firstVersion="2.0">

## Операции без получения результатов

Для операций <Term id="ddl" /> или служебных операций, результаты которых вам не нужны (поскольку вы не используете возвращаемые строки в Jinja), задайте `fetch_result=False`. Этот подход рекомендуется для таких операций, как `OPTIMIZE` или `VACUUM` в Databricks, которые возвращают наборы результатов, способные содержать значения null в столбцах, не допускающих null.

<File name='macros/optimize_table.sql'>

```jinja
{% macro optimize_table(table, zorder_fields=[]) %}
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

</File>

Этот макрос можно использовать в post-hook:

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    +post-hook:
      - "{{ optimize_table(this, ['customer_id', 'order_date']) }}"
```

</File>

</VersionBlock>
