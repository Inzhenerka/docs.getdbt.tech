---
title: "О переменной modules"
sidebar_label: "modules"
id: "modules"
description: "Переменная Jinja `modules` предоставляет доступ к полезным модулям Python для работы с данными."
---

Переменная `modules` в контексте Jinja — это предопределённое пространство имён, которое содержит только ограниченный набор поддерживаемых модулей Python для работы с данными. В Jinja нельзя импортировать произвольные модули Python (например, `os`, `requests` или сторонние библиотеки, не входящие в этот набор) или обращаться к ним.

Пользовательских настроек для изменения или расширения пространства имён `modules` нет. Это ограничение помогает обеспечить согласованность поведения, безопасность и переносимость между средами.

Если для вашего рабочего процесса нужны возможности дополнительных библиотек Python, используйте [модель Python](/docs/build/python-models) (если поддерживается) вместо Jinja. Модели Python выполняются в другом контексте выполнения и позволяют импортировать и использовать внешние библиотеки по мере необходимости.

## datetime
Эта переменная указывает на модуль Python [`datetime`](https://docs.python.org/3/library/datetime.html), который поддерживает сложную логику работы с датами и временем.

Она включает в себя контексты модулей `date`, `datetime`, `time`, `timedelta` и `tzinfo`.

**Использование**

```
{% set now = modules.datetime.datetime.now() %}
{% set three_days_ago_iso = (now - modules.datetime.timedelta(3)).isoformat() %}
```
Этот модуль будет возвращать текущую дату и время при каждом выполнении Jinja. 
Для получения даты и времени начала выполнения, пожалуйста, смотрите
[run_started_at](/reference/dbt-jinja-functions/run_started_at).

## pytz
Эта переменная ссылается на модуль Python [`pytz`](https://pypi.org/project/pytz/), который поддерживает работу с часовыми поясами.

**Использование**

```
{% set dt = modules.datetime.datetime(2002, 10, 27, 6, 0, 0) %}
{% set dt_local = modules.pytz.timezone('US/Eastern').localize(dt) %}
{{ dt_local }}
```

## re
Эта переменная ссылается на модуль Python [`re`](https://docs.python.org/3/library/re.html), который обеспечивает поддержку регулярных выражений.

**Использование**

```
{% set my_string = 's3://example/path' %}
{% set s3_path_pattern = 's3://[a-z0-9-_/]+' %}

{% set re = modules.re %}
{% set is_match = re.match(s3_path_pattern, my_string, re.IGNORECASE) %}
{% if not is_match %}
    {%- do exceptions.raise_compiler_error(
        my_string ~ ' is not a valid s3 path'
    ) -%}
{% endif %}
```

## itertools {#itertools}
:::info Примечание
Начиная с версии `dbt-core==1.10.6`, использование `modules.itertools` вызывает предупреждение об устаревании. Для получения дополнительной информации и рекомендуемых обходных решений см. [документацию по `ModulesItertoolsUsageDeprecation`](/reference/deprecations.md#modulesitertoolsusagedeprecation).
:::

Эта переменная — ссылка на модуль Python [`itertools`](https://docs.python.org/3/library/itertools.html), который содержит полезные функции для работы с итераторами (циклами, списками и т. п.).

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