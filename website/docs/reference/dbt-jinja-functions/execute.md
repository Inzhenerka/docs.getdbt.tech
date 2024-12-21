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