---
title: "О блоках statement"
sidebar_label: "statement blocks"
id: "statement-blocks"
description: "SQL‑запросы, которые выполняются в базе данных и возвращают результаты в ваш Jinja‑контекст."
---

:::tip Рекомендация

Мы рекомендуем использовать макрос [`run_query`](/reference/dbt-jinja-functions/run_query) вместо блоков `statement`. Макрос `run_query` предоставляет более удобный способ выполнения запросов и получения их результатов, оборачивая блоки `statement`. Вы можете использовать этот макрос для написания более лаконичного кода, который легче поддерживать.

:::

`statement` — это SQL‑запросы, которые выполняются в базе данных и возвращают результаты в ваш Jinja‑контекст. Ниже приведён пример `statement`, который получает список всех штатов из <Term id="table" /> с пользователями.

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