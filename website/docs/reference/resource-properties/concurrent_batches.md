---
title: "concurrent_batches"
resource_types: [models]
datatype: model_name
description: "Узнайте о concurrent_batches в dbt."
---

<VersionCallout version="1.9" />

<Tabs>
<TabItem value="Project file">


<File name='dbt_project.yml'>

```yaml
models:
  +concurrent_batches: true
```

</File>

</TabItem>


<TabItem value="Config block">

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized='incremental',
    concurrent_batches=true,
    incremental_strategy='microbatch'
        ...
  )
}}
select ...
```

</File>

</TabItem>
</Tabs>

## Определение

`concurrent_batches` — это параметр, который позволяет вам решить, хотите ли вы запускать пакеты параллельно или последовательно (по одному за раз).

Для получения дополнительной информации см. [как работает пакетное выполнение](/docs/build/parallel-batch-execution#how-parallel-batch-execution-works).

## Example

По умолчанию dbt автоматически определяет, могут ли пакеты выполняться параллельно для моделей с микропакетной обработкой (microbatch). Однако вы можете переопределить это определение dbt, установив конфигурацию `concurrent_batches` в значение `false` в файле `dbt_project.yml` или в `.sql`‑файле модели, чтобы явно указать параллельное или последовательное выполнение, при условии что выполняются следующие требования:
* У вас настроена [микропакетная стратегия инкрементальной загрузки](/docs/build/incremental-microbatch).
* Вы работаете с кумулятивными метриками или с логикой, которая зависит от порядка выполнения пакетов.

Установите конфигурацию `concurrent_batches` в `false`, чтобы гарантировать последовательную обработку пакетов. Например:

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    cumulative_metrics_model:
      +concurrent_batches: false
```
</File>


<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='microbatch'
    concurrent_batches=false
  )
}}
select ...

```
</File>