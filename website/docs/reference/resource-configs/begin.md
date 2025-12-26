---
title: "begin"
id: "begin"
sidebar_label: "begin"
resource_types: [models]
description: "dbt использует `begin` для определения момента, с которого должен начинаться микропакетный инкрементальный модель. Когда `begin` определен для микропакетного инкрементального модели, он используется в качестве нижней временной границы, когда модель строится впервые или полностью обновляется."
datatype: string
---

<VersionCallout version="1.9" />

## Определение

Установите конфигурацию `begin` в значение временной метки, с которой должны начинаться данные вашего [инкрементального microbatch‑моделя](/docs/build/incremental-microbatch) — то есть в момент, когда данные становятся релевантными для microbatch‑модели.  

Вы можете настроить `begin` для [модели](/docs/build/models) в файле `dbt_project.yml`, в property YAML‑файле или в config‑блоке. Значение `begin` должно быть строкой, представляющей дату в формате ISO, _или_ дату и время, _или_ [относительные даты](#set-begin-to-use-relative-dates). Подробнее смотрите [примеры](#examples) в следующем разделе.

## Примеры

Следующие примеры устанавливают `2024-01-01 00:00:00` в качестве конфигурации `begin` для модели `user_sessions`.

#### Пример в файле `dbt_project.yml`

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    user_sessions:
      +begin: "2024-01-01 00:00:00"
```
</File>

#### Пример в YAML-файле свойств

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      begin: "2024-01-01 00:00:00"
```

</File>

#### Пример в блоке конфигурации SQL‑модели

<File name="models/user_sessions.sql">

```sql
{{ config(
    begin='2024-01-01 00:00:00'
) }}
```

#### Установка `begin` с использованием относительных дат

Чтобы настроить `begin` с использованием относительных дат, вы можете использовать переменные модулей [`modules.datetime`](/reference/dbt-jinja-functions/modules#datetime) и [`modules.pytz`](/reference/dbt-jinja-functions/modules#pytz), чтобы динамически задавать относительные временные метки, например дату вчерашнего дня или начало текущей недели.

Например, чтобы установить `begin` на дату вчерашнего дня:

```sql
{{
    config(
        materialized = 'incremental',
        incremental_strategy='microbatch',
        unique_key = 'run_id',
        begin=(modules.datetime.datetime.now() - modules.datetime.timedelta(1)).isoformat(),
        event_time='created_at',
        batch_size='day',
    )
}}
```
