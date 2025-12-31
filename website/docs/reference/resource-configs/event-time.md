---
title: "event_time"
id: "event-time"
sidebar_label: "event_time"
resource_types: [models, seeds, source]
description: "dbt использует event_time, чтобы понимать, когда произошло событие. Если event_time определён, он включает микропакетные инкрементальные модели, флаг sample, а также более точное сравнение датасетов во время Advanced CI."
datatype: string
---

import EventTimeRequired from '/snippets/_event_time_required.md';

<VersionCallout version="1.9" />

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

## Определение {#definition}

dbt использует `event_time`, чтобы понимать, когда произошло событие. Его можно настроить в YAML-файле проекта (`dbt_project.yml`), YAML-файле свойств (`models/properties.yml`) или в конфигурации SQL-файла для [models](/docs/build/models), [seeds](/docs/build/seeds) или [sources](/docs/build/sources).

<EventTimeRequired/>

### Использование {#usage}

`event_time` **обязателен** для стратегии [incremental microbatch](/docs/build/incremental-microbatch)<VersionBlock firstVersion="1.10">, для флага [`--sample`](/docs/build/sample-flag),</VersionBlock> и **настоятельно рекомендуется** для [сравнения изменений в Advanced CI](/docs/deploy/advanced-ci#optimizing-comparisons) в CI/CD‑процессах, где он гарантирует, что между CI‑окружением и продакшеном сравнивается один и тот же временной срез данных.

### Лучшие практики {#best-practices}

Указывайте `event_time` как имя поля, которое отражает **фактический временной момент события** (например, `account_created_at`). Временная метка должна отвечать на вопрос: *«в какой момент произошла эта строка данных»*, а не быть датой загрузки или обработки. Назначение `event_time` колонке, которая не соответствует этому смыслу, нарушает семантику поля и может привести к путанице, когда другие инструменты будут использовать эти метаданные.

Тем не менее, если единственные временные метки, которые вы используете, — это даты загрузки (например, `loaded_at`, `ingested_at` или `last_updated_at`), вы можете задать `event_time` на основе этих полей. В этом случае стоит учитывать следующие моменты:

- Использование `last_updated_at` или `loaded_at` — может приводить к дублирующимся записям в результирующей таблице хранилища данных при нескольких запусках. Установка подходящего значения [lookback](/reference/resource-configs/lookback) может уменьшить количество дубликатов, но не устранит их полностью, так как некоторые обновления за пределами окна lookback не будут обработаны.
- Использование `ingested_at` — поскольку этот столбец создаётся инструментом загрузки/ELT, а не поступает из исходной системы, его значение изменится, если вам потребуется повторная синхронизация коннектора. В результате данные будут повторно обработаны и загружены в хранилище с другой датой. Пока этого не происходит (или если вы выполняете full refresh в таких случаях), микробатчи будут корректно обрабатываться при использовании `ingested_at`.

Ниже приведены примеры рекомендуемых и нерекомендуемых колонок для `event_time`:

| <div style={{width:'200px'}}>Статус</div> | Имя колонки            | Описание |
|--------------------|-------------------------|-------------------------|
| ✅ Рекомендуется | `account_created_at` | Представляет конкретный момент времени создания аккаунта, то есть фиксированное событие во времени. |
| ✅ Рекомендуется | `session_began_at`    | Фиксирует точную временную метку начала пользовательской сессии, которая не изменяется и напрямую связана с событием. |
| ❌ Не рекомендуется | `_fivetran_synced`    | Отражает момент загрузки события, а не момент, когда оно произошло. |
| ❌ Не рекомендуется | `last_updated_at`    | Меняется со временем и не привязано к самому событию. При использовании учитывайте соображения, описанные выше в разделе [лучшие практики](#best-practices). |

## Примеры {#examples}

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

Пример в property-файле:

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      event_time: session_start_time
```

</File>

Пример в блоке `config` для модели:

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

Вот пример файла свойств источника:

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