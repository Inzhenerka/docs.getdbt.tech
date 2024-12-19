---
title: "О переменной execute"
sidebar_label: "execute"
id: "execute"
description: "Используйте `execute`, чтобы вернуть True, когда dbt находится в режиме 'execute'."
---

`execute` — это переменная Jinja, которая возвращает True, когда dbt находится в режиме "execute".

Когда вы выполняете команду `dbt compile` или `dbt run`, dbt:

1. Читает все файлы в вашем проекте и генерирует [манифест](/reference/artifacts/manifest-json), состоящий из моделей, тестов и других узлов графа, присутствующих в вашем проекте. На этом этапе dbt использует найденные инструкции [`ref`](/reference/dbt-jinja-functions/ref) и [`source`](/reference/dbt-jinja-functions/source) для генерации DAG вашего проекта. **На этом этапе SQL не выполняется**, и `execute == False`.
2. Компилирует (и выполняет) каждый узел (например, строит модели или запускает тесты). **SQL выполняется на этом этапе**, и `execute == True`.

Любая Jinja, которая зависит от результата, возвращаемого из базы данных, вызовет ошибку на этапе разбора. Например, следующий SQL вернет ошибку:

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
10  {# Вернуть первый столбец #}
11  {% set payment_methods = results.columns[0].values() %}

```

</File>

Ошибка, возвращаемая dbt, будет выглядеть следующим образом:
```
Обнаружена ошибка:
Ошибка компиляции в модели order_payment_methods (models/order_payment_methods.sql)
  'None' не имеет атрибута 'table'

```
Это происходит потому, что строка #11 в предыдущем примере кода (`{% set payment_methods = results.columns[0].values() %}`) предполагает, что был возвращен <Term id="table" />, когда на этапе разбора этот запрос еще не был выполнен.

Чтобы обойти это, оберните любую проблемную Jinja в инструкцию `{% if execute %}`:

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
{# Вернуть первый столбец #}
{% set payment_methods = results.columns[0].values() %}
{% else %}
{% set payment_methods = [] %}
{% endif %}
```

</File>