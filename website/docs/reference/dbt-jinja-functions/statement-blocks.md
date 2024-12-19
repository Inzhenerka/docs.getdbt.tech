---
title: "О блоках операторов"
sidebar_label: "блоки операторов"
id: "statement-blocks"
description: "SQL-запросы, которые обращаются к базе данных и возвращают результаты в ваш контекст Jinja."
---

:::tip Рекомендация

Мы рекомендуем использовать [`макрос run_query`](/reference/dbt-jinja-functions/run_query) вместо блоков `statement`. Макрос `run_query` предоставляет более удобный способ выполнения запросов и получения их результатов, оборачивая блоки `statement`. Вы можете использовать этот макрос для написания более лаконичного кода, который легче поддерживать.

:::

`statement` — это SQL-запросы, которые обращаются к базе данных и возвращают результаты в ваш контекст Jinja. Вот пример `statement`, который получает все штаты из таблицы пользователей <Term id="table" />.

<File name='get_states_statement.sql'>

```sql
-- depends_on: {{ ref('users') }}

{%- call statement('states', fetch_result=True) -%}

    select distinct state from {{ ref('users') }}

{%- endcall -%}
```

</File>

Подпись блока `statement` выглядит следующим образом:

```
statement(name=None, fetch_result=False, auto_begin=True)
```

При выполнении `statement` dbt необходимо понять, как разрешить ссылки на другие модели или ресурсы dbt. Если вы уже используете `ref` для модели вне блока statement, зависимость будет автоматически определена, но в противном случае вам нужно будет [принудительно установить зависимость](/reference/dbt-jinja-functions/ref#forcing-dependencies) с помощью `-- depends_on`.

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
 - `name` (строка): Имя для набора результатов, возвращаемого этим оператором
 - `fetch_result` (логическое): Если True, загрузить результаты оператора в контекст Jinja
 - `auto_begin` (логическое): Если True, открыть транзакцию, если она не существует. Если false, не открывать транзакцию.

После выполнения блока оператора набор результатов доступен через функцию `load_result`. Объект результата включает три ключа:
- `response`: Структурированный объект, содержащий метаданные, возвращенные из базы данных, которые варьируются в зависимости от адаптера. Например, код `success`, количество `rows_affected`, общее количество `bytes_processed` и т.д. Сравнимо с `adapter_response` в [Объекте результата](/reference/dbt-classes#result-objects).
- `data`: Питоническое представление данных, возвращенных запросом (массивы, кортежи, словари).
- `table`: [Agate](https://agate.readthedocs.io/page/api/table.html) представление данных, возвращенных запросом.

Для приведенного выше оператора это может выглядеть так:

<File name='load_states.sql'>

```sql
{%- set states = load_result('states') -%}
{%- set states_data = states['data'] -%}
{%- set states_status = states['response'] -%}
```

</File>

Содержимое возвращаемого поля `data` представляет собой матрицу. Она содержит список строк, каждая из которых является списком значений, возвращенных базой данных. Для приведенного выше примера эта структура данных может выглядеть так:

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