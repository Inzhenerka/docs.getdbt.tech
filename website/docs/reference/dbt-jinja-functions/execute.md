---
title: "О переменной execute"
sidebar_label: "execute"
id: "execute"
description: "Используйте `execute`, чтобы вернуть True, когда dbt находится в режиме 'execute'."
---

`execute` — это переменная Jinja, которая возвращает True, когда dbt находится в режиме "execute".

Когда вы выполняете команду `dbt compile` или `dbt run`, dbt:

1. Читает все файлы в вашем проекте и генерирует [манифест](/reference/artifacts/manifest-json), состоящий из моделей, тестов и других узлов графа, присутствующих в вашем проекте. В этом этапе dbt использует операторы [`ref`](/reference/dbt-jinja-functions/ref) и [`source`](/reference/dbt-jinja-functions/source), которые он находит, чтобы сгенерировать DAG для вашего проекта. **На этом этапе SQL не выполняется**, и `execute == False`.
2. Компилирует (и выполняет) каждый узел (например, строит модели или запускает тесты). **На этом этапе SQL выполняется**, и `execute == True`.

Любая Jinja, которая полагается на результат, возвращаемый из базы данных, вызовет ошибку на этапе разбора. Например, этот SQL вызовет ошибку:

<File name='models/order_payment_methods.sql'>

```sql
1   {% set payment_method_query %}
2   select distinct
3   payment_method
4   from {{ ref('raw_payments') }}
5   order by 1
6   {% endset %}
7
8   {% set results = run_query(payment_method_query) %}
9
10  {# Возвращает первый столбец #}
11  {% set payment_methods = results.columns[0].values() %}

```

</File>

Ошибка, возвращаемая dbt, будет выглядеть следующим образом:
```
Encountered an error:
Compilation Error in model order_payment_methods (models/order_payment_methods.sql)
  'None' has no attribute 'table'

```
Это происходит потому, что строка №11 в предыдущем примере кода (`{% set payment_methods = results.columns[0].values() %}`) предполагает, что был возвращен <Term id="table" />, тогда как на этапе разбора этот запрос не был выполнен.

Чтобы обойти это, оберните любую проблемную Jinja в оператор `{% if execute %}`:

<File name='models/order_payment_methods.sql'>

```sql
{% set payment_method_query %}
select distinct
payment_method
from {{ ref('raw_payments') }}
order by 1
{% endset %}

{% set results = run_query(payment_method_query) %}
{% if execute %}
{# Возвращает первый столбец #}
{% set payment_methods = results.columns[0].values() %}
{% else %}
{% set payment_methods = [] %}
{% endif %}
```

</File>

## Парсинг и выполнение {#parsing-vs-execution}

Парсинг (parsing) в Jinja — это этап, на котором dbt:

- Читает файлы вашего проекта.
- Находит вызовы [`ref`](/reference/dbt-jinja-functions/ref) и [`source`](/reference/dbt-jinja-functions/source).
- Находит определения макросов.
- Строит граф зависимостей (DAG).

На этом этапе dbt **не выполняет никакой SQL** — `execute == False`.

Выполнение (execution) — это этап, когда dbt действительно выполняет SQL и строит модели — `execute == True`.

Во время выполнения dbt:

- Рендерит полные Jinja-шаблоны в SQL.
- Разрешает все вызовы `ref()` и `source()` в соответствующие имена таблиц или представлений.
- Выполняет SQL из ваших моделей при выполнении таких команд, как [`dbt run`](/reference/commands/run), [`dbt test`](/reference/commands/test), [`dbt seed`](/reference/commands/seed) или [`dbt snapshot`](/reference/commands/snapshot).
- Создаёт или обновляет таблицы/представления в хранилище данных.
- Применяет материализации (incremental, table, view, ephemeral).

Флаг `execute` влияет на значения, возвращаемые `ref()` и `source()`, и не будет работать так, как ожидается, внутри [`sql_header`](/reference/resource-configs/sql_header#usage).

Причина в том, что при первоначальном парсинге проекта dbt находит все использования `ref()` и `source()` для построения DAG, но **не разрешает их в реальные идентификаторы базы данных**. Вместо этого dbt подставляет временные значения-заглушки, чтобы SQL корректно компилировался на этапе парсинга.

## Примеры {#examples}

Макросы вроде [`log()`](/reference/dbt-jinja-functions/log) и [`exceptions.warn()`](/reference/dbt-jinja-functions/exceptions#warn) всё равно вычисляются на этапе парсинга, во время «первого прохода» рендера Jinja, который dbt использует для извлечения `ref`, `source` и `config`. В результате dbt также выполняет любой логгинг или вывод предупреждений уже на этом этапе.

Несмотря на то, что фактическое выполнение ещё не происходит, dbt всё равно выводит эти лог-сообщения во время парсинга. Это может сбивать с толку — выглядит так, будто dbt что-то реально делает, хотя на самом деле он лишь парсит проект.

```
$ dbt run
15:42:01  Running with dbt=1.10.2
15:42:01  I'm running a query now.  <------ это вводит в заблуждение!!!! на самом деле запрос не выполняется
15:42:01  Found 1 model, 0 tests, 0 snapshots, 0 macros, 0 operations, 0 seed files, 0 sources, 0 exposures, 0 metrics
15:42:01
15:42:01  Concurrency: 8 threads (target='dev')
15:42:01
15:42:01  1 of 1 START table model analytics.my_model .................................. [RUN]
15:42:01  I'm running a query now
15:42:02  1 of 1 OK created table model analytics.my_model ............................. [OK in 0.36s]
```

### Логирование полностью квалифицированных имён отношений {#logging-fully-qualified-relation-names}

Предположим, у вас есть отношение `relation`, полученное, например, так: `{% set relation = ref('my_model') %}` или `{% set relation = source('source_name', 'table_name') %}`. Это может привести к неожиданному или запутывающему поведению на этапе парсинга:

```jinja

{%- if load_relation(relation) is none -%}
    {{ log("Relation is missing: " ~ relation, True) }}
{% endif %}

```

Чтобы избежать этого, добавьте проверку флага `execute`, чтобы код выполнялся **только тогда, когда dbt действительно выполняет модели**, а не просто подготавливает их.

Используйте команду `do exceptions.warn`, чтобы вывести предупреждение во время выполнения модели, не прерывая запуск.

```jinja

{%- if execute and load_relation(relation) is none -%}
    {% [do exceptions.warn](/reference/dbt-jinja-functions/exceptions#warn)("Relation is missing: " ~ relation) %}
    {{ log("Relation is missing: " ~ relation, info=True) }}
{%- endif -%}


```
