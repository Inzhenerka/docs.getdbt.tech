---
title: "begin"
id: "begin"
sidebar_label: "begin"
resource_types: [models]
description: "dbt использует `begin` для определения момента, с которого должен начинаться микропакетный инкрементальный модель. Когда `begin` определен для микропакетного инкрементального модели, он используется в качестве нижней временной границы, когда модель строится впервые или полностью обновляется."
datatype: string
---

Доступно в [dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks) и dbt Core версии 1.9 и выше.

## Определение

Установите конфигурацию `begin` на значение временной метки, с которого ваши данные микропакетной модели должны начинаться &mdash; в тот момент, когда данные становятся актуальными для микропакетной модели. Вы можете настроить `begin` для [модели](/docs/build/models) в вашем файле `dbt_project.yml`, YAML-файле свойств или блоке конфигурации. Значение для `begin` должно быть строкой, представляющей дату в формате ISO ИЛИ дату и время.

## Примеры

Следующие примеры устанавливают `2024-01-01 00:00:00` в качестве конфигурации `begin` для модели `user_sessions`.

Пример в файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    user_sessions:
      +begin: "2024-01-01 00:00:00"
```
</File>

Пример в YAML-файле свойств:

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      begin: "2024-01-01 00:00:00"
```

</File>

Пример в блоке конфигурации SQL модели:

<File name="models/user_sessions.sql">

```sql
{{ config(
    begin='2024-01-01 00:00:00'
) }}
```

</File> 