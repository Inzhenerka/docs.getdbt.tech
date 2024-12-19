---
title: "О переменной modules"
sidebar_label: "modules"
id: "modules"
description: "Переменные jinja `modules` содержат полезные модули Python для работы с данными."
---

Переменная `modules` в контексте Jinja содержит полезные модули Python для работы с данными.

## datetime
Эта переменная указывает на модуль Python [datetime](https://docs.python.org/3/library/datetime.html), который поддерживает сложную логику работы с датами и временем.

Она включает контексты модулей `date`, `datetime`, `time`, `timedelta` и `tzinfo`.

**Использование**

```
{% set now = modules.datetime.datetime.now() %}
{% set three_days_ago_iso = (now - modules.datetime.timedelta(3)).isoformat() %}
```
Этот модуль будет возвращать текущую дату и время при каждой оценке Jinja. 
Для даты и времени начала выполнения см. 
[run_started_at](/reference/dbt-jinja-functions/run_started_at).

## pytz
Эта переменная указывает на модуль Python [pytz](https://pypi.org/project/pytz/), который поддерживает логику часовых поясов.

**Использование**

```
{% set dt = modules.datetime.datetime(2002, 10, 27, 6, 0, 0) %}
{% set dt_local = modules.pytz.timezone('US/Eastern').localize(dt) %}
{{ dt_local }}
```

## re
Эта переменная указывает на модуль Python [re](https://docs.python.org/3/library/re.html), который поддерживает регулярные выражения.

**Использование**

```
{% set my_string = 's3://example/path' %}
{% set s3_path_pattern = 's3://[a-z0-9-_/]+' %}

{% set re = modules.re %}
{% set is_match = re.match(s3_path_pattern, my_string, re.IGNORECASE) %}
{% if not is_match %}
    {%- do exceptions.raise_compiler_error(
        my_string ~ ' не является допустимым s3 путем'
    ) -%}
{% endif %}
```

## itertools
Эта переменная указывает на модуль Python [itertools](https://docs.python.org/3/library/itertools.html), который включает полезные функции для работы с итераторами (циклами, списками и т.д.).

Поддерживаемые функции:
- `count`
- `cycle`
- `repeat`
- `accumulate`
- `chain`
- `compress`
- `islice`
- `starmap`
- `tee`
- `zip_longest`
- `product`
- `permutations`
- `combinations`
- `combinations_with_replacement`

**Использование**

```
{%- set A = [1, 2] -%}
{%- set B = ['x', 'y', 'z'] -%}
{%- set AB_cartesian = modules.itertools.product(A, B) -%}

{%- for item in AB_cartesian %}
  {{ item }}
{%- endfor -%}
```
```
  (1, 'x')
  (1, 'y')
  (1, 'z')
  (2, 'x')
  (2, 'y')
  (2, 'z')
```