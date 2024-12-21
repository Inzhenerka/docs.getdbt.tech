---
title: "concurrent_batches"
resource_types: [models]
datatype: model_name
description: "Узнайте о concurrent_batches в dbt."
---

:::note

Доступно в dbt Core версии 1.9+ или в [dbt Cloud "Latest" релизных треках](/docs/dbt-versions/cloud-release-tracks).

:::

<Tabs>
<TabItem value="Project file">


<File name='dbt_project.yml'>

```yaml
models:
  +concurrent_batches: true
```

</File>

</TabItem>


<TabItem value="sql file">

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

Для получения дополнительной информации обратитесь к [как работает выполнение пакетов](/docs/build/incremental-microbatch#how-parallel-batch-execution-works).
## Пример

По умолчанию dbt автоматически определяет, могут ли пакеты выполняться параллельно для моделей с микропакетами. Однако вы можете переопределить это определение dbt, установив конфигурацию `concurrent_batches` в `false` в вашем файле `dbt_project.yml` или в модели `.sql`, чтобы указать параллельное или последовательное выполнение, если вы соответствуете следующим условиям:
* Вы настроили стратегию инкрементального обновления микропакетами.
* Вы работаете с накопительными метриками или любой логикой, зависящей от порядка выполнения пакетов.

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