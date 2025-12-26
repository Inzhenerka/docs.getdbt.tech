---
title: "batch_size"
id: "batch-size"
sidebar_label: "batch_size"
resource_types: [models]
description: "dbt использует `batch_size` для определения размера пакетов при запуске микропакетной инкрементальной модели."
datatype: hour | day | month | year
---

<VersionCallout version="1.9" />

## Определение

Параметр конфигурации `batch_size` определяет, какого размера будут батчи при выполнении [инкрементальной модели с микробатчами](/docs/build/incremental-microbatch). Допустимые значения: `hour`, `day`, `month` или `year`. Вы можете настроить `batch_size` для [модели](/docs/build/models) в файле `dbt_project.yml`, в YAML‑файле свойств или в блоке `config`.

## Примеры

Следующие примеры устанавливают `day` в качестве `batch_size` для модели `user_sessions`.

Пример конфигурации `batch_size` в файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    user_sessions:
      +batch_size: day
```
</File>

Пример в YAML-файле свойств:

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      batch_size: day
```

</File>

Пример в блоке `config` SQL‑модели:

<File name="models/user_sessions.sql">

```sql
{{ config(
    materialized='incremental',
    batch_size='day'
) }}
```

</File> 