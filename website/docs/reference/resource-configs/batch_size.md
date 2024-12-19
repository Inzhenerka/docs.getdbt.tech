---
title: "batch_size"
id: "batch-size"
sidebar_label: "batch_size"
resource_types: [models]
description: "dbt использует `batch_size` для определения размера партий при выполнении модели с микропартиями."
datatype: hour | day | month | year
---

Доступно в [последней версии dbt Cloud](/docs/dbt-versions/cloud-release-tracks) и dbt Core версии 1.9 и выше.

## Определение

Конфигурация `batch_size` определяет, насколько велики партии при выполнении микропартии. Допустимые значения: `hour`, `day`, `month` или `year`. Вы можете настроить `batch_size` для [модели](/docs/build/models) в вашем файле `dbt_project.yml`, файле свойств YAML или блоке конфигурации.

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

Пример в файле свойств YAML:

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      batch_size: day
```

</File>

Пример в блоке конфигурации SQL модели:

<File name="models/user_sessions.sql">

```sql
{{ config(
    lookback='day
) }}
```

</File> 