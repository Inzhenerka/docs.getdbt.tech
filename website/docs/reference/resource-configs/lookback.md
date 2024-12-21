---
title: "lookback"
id: "lookback"
sidebar_label: "lookback"
resource_types: [models]
description: "dbt использует `lookback`, чтобы определить, сколько 'пакетов' размера `batch_size` необходимо перепроцессировать, когда микропакетная инкрементальная модель выполняется инкрементально."
datatype: int
---

Доступно в [dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks) и dbt Core версии 1.9 и выше.

## Определение

Установите `lookback` в целое число, большее или равное нулю. Значение по умолчанию — `1`. Вы можете настроить `lookback` для [модели](/docs/build/models) в вашем файле `dbt_project.yml`, YAML-файле свойств или блоке конфигурации.

## Примеры

Следующие примеры устанавливают `2` в качестве конфигурации `lookback` для модели `user_sessions`.

Пример в файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    user_sessions:
      +lookback: 2
```
</File>

Пример в YAML-файле свойств:

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      lookback: 2
```

</File>

Пример в блоке конфигурации SQL-модели:

<File name="models/user_sessions.sql">

```sql
{{ config(
    lookback=2
) }}
```

</File> 