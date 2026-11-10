---
title: evaluate_volatile_sql
description: "Настройте, будет ли dbt State сохранять и сравнивать результаты выполнения недетерминированных SQL-функций при принятии решения о пересборке узла."
id: "evaluate-volatile-sql"
tags: ['dbt State']
---

# evaluate_volatile_sql

<Tabs>
<TabItem value="project" label="YAML-файл проекта">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      evaluate_volatile_sql: true | false
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
        evaluate_volatile_sql: true | false
```

</File>
</TabItem>

<TabItem value="sql" label="Конфигурация в SQL-файле">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "evaluate_volatile_sql": true | false
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Определение

dbt State определяет, изменились ли данные узла, на основе актуальности данных его родительских узлов. Однако недетерминированные SQL-функции, такие как `CURRENT_TIMESTAMP()`, `RANDOM()` или `UUID_STRING()`, могут изменять результат узла от запуска к запуску, даже если данные вышестоящих узлов не изменились.

По умолчанию dbt State рассматривает недетерминированные функции как статические части скомпилированного кода узла, а не как источник новых данных. В большинстве случаев это правильный выбор — иначе ни один узел, содержащий `CURRENT_TIMESTAMP()`, нельзя было бы использовать повторно.

Когда для `evaluate_volatile_sql` установлено значение `true`, dbt State сохраняет _результат_ каждого вызова недетерминированной функции и использует эти сохранённые значения для последующих сравнений. Это означает, что узел пересобирается при изменении результата функции &mdash; например, когда `current_date()` возвращает новое значение после полуночи.

| Значение | Поведение |
|-------|----------|
| `false` (по умолчанию) | Недетерминированные функции рассматриваются как статический код. Узел можно использовать повторно, даже если результаты функций при разных запусках различались бы. |
| `true` | dbt State сохраняет и сравнивает результаты выполнения недетерминированных функций. Узел пересобирается при изменении этих результатов. |

## Примеры

### Пересборка при изменении даты

Используйте `evaluate_volatile_sql: true` для узла, на результат которого существенно влияет текущая дата:

<File name="models/<filename>.sql">

```sql
{{ config(state={"evaluate_volatile_sql": true}) }}

select
  *,
  account_created_at >= current_date() as signed_up_today
from {{ ref('dim_customers') }}
```

</File>

Если эта настройка включена, dbt State сохраняет результат `current_date()` после каждой сборки. При следующем запуске после полуночи сохранённое значение уже не совпадает с текущим, и узел пересобирается, даже если `dim_customers` не изменился.

### Поведение по умолчанию

Для узлов, в которых результат недетерминированной функции не влияет на бизнес-логику, дополнительная настройка не требуется:

<File name="models/<filename>.sql">

```sql
select
  *,
  getdate() as _dbt_built_at
from {{ ref('dim_customers') }}
```

</File>

dbt State рассматривает `getdate()` как статический код. Узел остаётся доступным для повторного использования, пока его родительские узлы не изменились.

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
