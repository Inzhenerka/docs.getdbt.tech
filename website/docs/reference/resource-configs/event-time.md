---
title: "event_time"
id: "event-time"
sidebar_label: "event_time"
resource_types: [models, seeds, source]
description: "dbt использует event_time для понимания, когда произошло событие. При определении event_time позволяет использовать микропакетные инкрементальные модели и более точное сравнение наборов данных во время расширенной CI."
datatype: string
---

Доступно в [треке релизов "Latest" dbt Cloud](/docs/dbt-versions/cloud-release-tracks) и dbt Core версии 1.9 и выше.

<Tabs>
<TabItem value="model" label="Модели">

<File name='dbt_project.yml'>

```yml
models:
  [resource-path:](/reference/resource-configs/resource-path)
    +event_time: my_time_field
```
</File>


<File name='models/properties.yml'>

```yml
models:
  - name: model_name
    [config](/reference/resource-properties/config):
      event_time: my_time_field
```
</File>

<File name="models/modelname.sql">

```sql
{{ config(
    event_time='my_time_field'
) }}
```

</File>

</TabItem>

<TabItem value="seeds" label="Сиды">

<File name='dbt_project.yml'>

```yml
seeds:
  [resource-path:](/reference/resource-configs/resource-path)
    +event_time: my_time_field
```
</File>

<File name='seeds/properties.yml'>

```yml
seeds:
  - name: seed_name
    [config](/reference/resource-properties/config):
      event_time: my_time_field
```

</File>
</TabItem>

<TabItem value="snapshot" label="Снапшоты">

<File name='dbt_project.yml'>

```yml
snapshots:
  [resource-path:](/reference/resource-configs/resource-path)
    +event_time: my_time_field
```
</File>

<VersionBlock firstVersion="1.9">
<File name='snapshots/properties.yml'>

```yml
snapshots:
  - name: snapshot_name
    [config](/reference/resource-properties/config):
      event_time: my_time_field
```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

<File name="models/modlename.sql">

```sql

{{ config(
    event_time: 'my_time_field'
) }}
```

</File>


import SnapshotYaml from '/snippets/_snapshot-yaml-spec.md';

<SnapshotYaml/>
</VersionBlock>



</TabItem>

<TabItem value="sources" label="Источники">

<File name='dbt_project.yml'>

```yml
sources:
  [resource-path:](/reference/resource-configs/resource-path)
    +event_time: my_time_field
```
</File>

<File name='models/properties.yml'>

```yml
sources:
  - name: source_name
    [config](/reference/resource-properties/config):
      event_time: my_time_field
```

</File>
</TabItem>
</Tabs>

## Определение

Установите `event_time` в имя поля, которое представляет временную метку события — "в какое время произошла строка" — в отличие от даты загрузки события. Вы можете настроить `event_time` для [модели](/docs/build/models), [сида](/docs/build/seeds) или [источника](/docs/build/sources) в вашем файле `dbt_project.yml`, файле свойств YAML или блоке конфигурации.

Вот несколько примеров хороших и плохих столбцов `event_time`:

- ✅ Хорошо:
  - `account_created_at` &mdash; Это представляет конкретное время, когда была создана учетная запись, что делает его фиксированным событием во времени.
  - `session_began_at` &mdash; Это фиксирует точную временную метку, когда началась пользовательская сессия, которая не изменится и напрямую связана с событием.

- ❌ Плохо:

  - `_fivetran_synced` &mdash; Это не время, когда произошло событие, это время, когда событие было загружено.
  - `last_updated_at` &mdash; Это не лучший вариант, так как он будет постоянно изменяться со временем.

`event_time` требуется для [инкрементальных микропакетов](/docs/build/incremental-microbatch) и настоятельно рекомендуется для [сравнения изменений в расширенной CI](/docs/deploy/advanced-ci#optimizing-comparisons) в рабочих процессах CI/CD, где он обеспечивает правильное сравнение одного и того же временного среза данных между вашими средами CI и производства.

## Примеры

<Tabs> 

<TabItem value="model" label="Модели">

Вот пример в файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    user_sessions:
      +event_time: session_start_time
```
</File>

Пример в файле свойств YAML:

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      event_time: session_start_time
```

</File>

Пример в блоке конфигурации SQL модели:

<File name="models/user_sessions.sql">

```sql
{{ config(
    event_time='session_start_time'
) }}
```

</File> 

Эта настройка устанавливает `session_start_time` как `event_time` для модели `user_sessions`.
</TabItem> 

<TabItem value="seeds" label="Сиды">

Вот пример в файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
seeds:
  my_project:
    my_seed:
      +event_time: record_timestamp
```

</File>

Пример в файле свойств сида YAML:

<File name='seeds/properties.yml'>

```yml
seeds:
  - name: my_seed
    config:
      event_time: record_timestamp
```
</File>

Эта настройка устанавливает `record_timestamp` как `event_time` для `my_seed`. 

</TabItem> 

<TabItem value="snapshot" label="Снапшоты">

Вот пример в файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
snapshots:
  my_project:
    my_snapshot:
      +event_time: record_timestamp
```

</File>

Пример в файле свойств снапшота YAML:

<File name='my_project/properties.yml'>

```yml
snapshots:
  - name: my_snapshot
    config:
      event_time: record_timestamp
```
</File>

Эта настройка устанавливает `record_timestamp` как `event_time` для `my_snapshot`. 

</TabItem> 

<TabItem value="sources" label="Источники">

Вот пример файла свойств источника YAML:

<File name='models/properties.yml'>

```yml
sources:
  - name: source_name
    tables:
      - name: table_name
        config:
          event_time: event_timestamp
```
</File>

Эта настройка устанавливает `event_timestamp` как `event_time` для указанной таблицы источника.

</TabItem> 
</Tabs>