---
title: "concurrent_batches"
resource_types: [models]
datatype: model_name
description: "Узнайте о concurrent_batches в dbt."
---

:::note

Доступно в dbt Core версии 1.9+ или в [последних релизах dbt Cloud](/docs/dbt-versions/cloud-release-tracks).

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

`concurrent_batches` — это переопределение, которое позволяет вам решить, хотите ли вы запускать пакеты параллельно или последовательно (по одному за раз).

Для получения дополнительной информации обратитесь к разделу [как работает выполнение пакетов](/docs/build/incremental-microbatch#how-parallel-batch-execution-works).

## Пример

По умолчанию dbt автоматически определяет, могут ли пакеты выполняться параллельно для моделей микропакетов. Однако вы можете переопределить определение dbt, установив конфигурацию `concurrent_batches` в `false` в вашем файле `dbt_project.yml` или `.sql` файле модели, чтобы указать параллельное или последовательное выполнение, если вы соответствуете следующим условиям: 
* Вы настроили стратегию инкрементного обновления микропакетов.
* Вы работаете с кумулятивными метриками или любой логикой, которая зависит от порядка пакетов.

Установите конфигурацию `concurrent_batches` в `false`, чтобы гарантировать последовательную обработку пакетов. Например