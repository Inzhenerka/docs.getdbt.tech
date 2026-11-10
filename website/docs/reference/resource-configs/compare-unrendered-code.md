---
title: compare_unrendered_code
description: "Определяет, проверяет ли dbt State и шаблон Jinja (код до рендеринга), и SQL после рендеринга при определении того, изменилась ли модель."
id: "compare-unrendered-code"
tags: ['dbt State']
---

# compare_unrendered_code

<Tabs>
<TabItem value="project" label="YAML-файл проекта">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      compare_unrendered_code: true | false
```

</File>
</TabItem>

<TabItem value="property" label="YAML-файл свойств">

<File name="models/<filename>.yml">

```yaml
models:
  - name: my_model
    config:
      state:
        compare_unrendered_code: true | false
```

</File>
</TabItem>

<TabItem value="sql" label="Конфигурация в SQL-файле">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "compare_unrendered_code": true | false
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Определение

<SimpleTable>
| Значение | Поведение |
|-------|----------|
| `false` (по умолчанию) | dbt State сравнивает только SQL после рендеринга. Недетерминированные макросы или переменные окружения, которые изменяют SQL после рендеринга при каждом запуске, могут вызывать ненужные пересборки. |
| `true` | dbt State предотвращает ненужные пересборки, проверяя и шаблон Jinja, и SQL после рендеринга. Пересборка выполняется только в том случае, если изменились оба. |
</SimpleTable>

По умолчанию dbt State сравнивает только SQL после рендеринга и выполняет пересборку, когда хеш результата отличается от сохранённого хеша. Частота пересборок зависит от того, как часто меняются значения. Например:

- `{{ invocation_id() }}` принимает новое значение при каждом запуске, поэтому всегда вызывает пересборку.
- `{{ dbt_utils.get_column_values() }}` меняется только в том случае, если изменяются значения исходного столбца или порядок их возврата, поэтому пересборки происходят менее предсказуемо.
- `{{ modules.datetime.datetime.now().month }}` принимает новое значение только раз в месяц, поэтому вызывает пересборку при следующем запуске после смены месяца.

Установите `compare_unrendered_code: true`, чтобы избежать этих ненужных пересборок. Когда этот параметр включён, dbt State также проверяет шаблон Jinja до рендеринга и выполняет пересборку только в том случае, если изменились _и_ код до рендеринга, _и_ SQL после рендеринга. Это полезно для узлов с недетерминированными макросами или переменными окружения (например, с макросом, возвращающим UUID, или с `{{ env_var('AIRFLOW_RUN_ID') }}`), из-за которых SQL после рендеринга меняется при каждом запуске, даже если сам шаблон остаётся неизменным.

## Взаимодействие с `evaluate_volatile_sql`

Когда `compare_unrendered_code` включён, dbt State проверяет, изменился ли шаблон Jinja до рендеринга. Если шаблон не изменился, dbt State полностью пропускает разбор SQL &mdash; волатильные SQL-функции не вычисляются, а [`evaluate_volatile_sql`](/reference/resource-configs/evaluate-volatile-sql) не оказывает никакого влияния. Если шаблон до рендеринга изменился, dbt State переходит к разбору и сравнению SQL после рендеринга, и параметр `evaluate_volatile_sql` применяется.

## Примеры

### Модель с недетерминированной переменной окружения

Модель с недетерминированной переменной окружения используется повторно, пока не изменились ни собственный шаблон Jinja модели, ни исходный код вызываемых ею макросов, даже если переменная окружения (например, AIRFLOW_RUN_ID) принимает другое значение во время выполнения:

<File name="models/fct_events.sql">

```sql
{{ config(state={"compare_unrendered_code": true}) }}

select
  event_id,
  user_id,
  event_type,
  occurred_at,
  '{{ env_var("AIRFLOW_RUN_ID") }}' as airflow_run_id
from {{ ref('stg_events') }}
```

</File>

### Модель со столбцами метаданных запуска dbt

Модель, которая с помощью [`invocation_id()`](/reference/dbt-jinja-functions/invocation_id) или [`run_started_at`](/reference/dbt-jinja-functions/run_started_at) записывает, при каком запуске dbt была создана каждая строка, используется повторно, пока шаблон не изменился, даже если эти значения различаются при каждом запуске:

<File name="models/fct_orders.sql">

```sql
{{ config(state={"compare_unrendered_code": true}) }}

select
  *,
  '{{ invocation_id() }}' as dbt_invocation_id,
  '{{ run_started_at }}' as dbt_run_started_at
from {{ ref('stg_orders') }}
```

</File>

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Параметры конфигурации dbt State](/reference/resource-configs/dbt-state-configs)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
