---
title: "About execute variable"
sidebar_label: "execute"
id: "execute"
description: "Use `execute` to return True when dbt is in 'execute' mode."
---

`execute` is a Jinja variable that returns True when dbt is in "execute" mode.

When you execute a `dbt compile` or `dbt run` command, dbt:

1. Reads all of the files in your project and generates a [manifest](/reference/artifacts/manifest-json) comprised of models, tests, and other graph nodes present in your project. During this phase, dbt uses the [`ref`](/reference/dbt-jinja-functions/ref) and [`source`](/reference/dbt-jinja-functions/source) statements it finds to generate the DAG for your project. **No SQL is run during this phase**, and `execute == False`.
2. Compiles (and runs) each node (eg. building models, or running tests). **SQL is run during this phase**, and `execute == True`.

Any Jinja that relies on a result being returned from the database will error during the parse phase. For example, this SQL will return an error:

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
10  {# Return the first column #}
11  {% set payment_methods = results.columns[0].values() %}

```

</File>

The error returned by dbt will look as follows:
```
Encountered an error:
Compilation Error in model order_payment_methods (models/order_payment_methods.sql)
  'None' has no attribute 'table'

```
This is because line #11 in the earlier code example (`{% set payment_methods = results.columns[0].values() %}`) assumes that a <Term id="table" /> has been returned, when, during the parse phase, this query hasn't been run.

To work around this, wrap any problematic Jinja in an `{% if execute %}` statement:

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
{# Return the first column #}
{% set payment_methods = results.columns[0].values() %}
{% else %}
{% set payment_methods = [] %}
{% endif %}
```

</File>

## Parsing vs execution

Parsing in Jinja is when dbt:

- Reads your project files.
- Identifies [`ref`](/reference/dbt-jinja-functions/ref) and [`source`](/reference/dbt-jinja-functions/source).
- Identifies macro definitions.
- Builds the dependency graph (DAG).

It doesn't run any SQL &mdash; `execute == False`.

Execution is when dbt actually runs SQL and builds models &mdash; `execute == True`.

During execution:

- dbt renders full Jinja templates into SQL.
- Resolves all instances of `ref()` and `source()` to their corresponding table or view names.
- Runs the SQL in your models like, ([`dbt run`](/reference/commands/run)), tests ([`dbt test`](/reference/commands/test)), [seeds](/reference/seed-properties), or [snapshots](/reference/snapshot-properties).
- Creates or updates tables/views in the warehouse.
- Applies any materializations (incremental, table, view, ephemeral).

`execute` impacts the values of `ref()` and `source()`, and won't work as expected inside of a [`sql_header`](/reference/resource-configs/sql_header#usage).

This is because in the initial parse of the project, dbt identifies every use of `ref()` and `source()` to build the DAG, but doesn’t resolve them to actual database identifiers. Instead, it replaces each with a placeholder value to ensure the SQL compiles cleanly during parsing.

Additionally, macros like [`log()`](/reference/dbt-jinja-functions/log) and [`exceptions.warn()`](/reference/dbt-jinja-functions/exceptions#warn) are still evaluated at parse time, during dbt's "first-pass" Jinja render to extract `ref`, `source` and `config`. As a result, dbt will also run any logging or warning messages during this process.

Even though nothing is being executed yet, dbt still runs those log lines while parsing which may cause some confusion &mdash; it looks like dbt is doing something real but it’s just parsing.
