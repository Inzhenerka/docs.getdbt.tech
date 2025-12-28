---
resource_types: [models, seeds]
description: "Установить конфигурацию full_refresh для моделей и других ресурсов в dbt."
datatype: boolean
---

Конфигурация `full_refresh` позволяет управлять тем, будет ли ресурс всегда или никогда выполнять полное обновление. Эта конфигурация переопределяет флаг командной строки `--full-refresh`.

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
  ]
}>

<TabItem value="models">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +full_refresh: false | true 
```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
    full_refresh = false | true
) }}

select ...
```

</File>

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +full_refresh: false | true

```

</File>

</TabItem>

</Tabs>

## Описание

Конфигурация `full_refresh` позволяет опционально задать, будет ли ресурс **всегда** или **никогда** выполнять полный пересчёт (full refresh). Эта конфигурация является переопределением флага командной строки `--full-refresh`, который используется при запуске команд dbt.

Вы можете задать конфигурацию `full_refresh` в файле `dbt_project.yml` или в конфигурации конкретного ресурса.

| Значение `full_refresh` | Поведение |
| ---------------------------- | -------- |
| Если установлено в `true` | Ресурс **всегда** выполняет полный пересчёт, независимо от того, передаёте ли вы флаг `--full-refresh` в команде dbt. |
| Если установлено в `false` | Ресурс **никогда** не выполняет полный пересчёт, независимо от того, передаёте ли вы флаг `--full-refresh` в команде dbt. |
| Если установлено в `none` или не указано | Ресурс следует поведению флага `--full-refresh`. Если флаг используется, ресурс выполнит полный пересчёт; в противном случае — нет. |

#### Примечание
- Флаг `--full-refresh` также поддерживает короткую форму `-f`.
- В макросе [`should_full_refresh()`](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/configs.sql) реализована соответствующая логика.

## Использование

### Инкрементные модели

* [Как перестроить инкрементную модель?](/docs/build/incremental-models#how-do-i-rebuild-an-incremental-model)
* [Что делать, если изменяются столбцы моей инкрементной модели?](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change)

### Seeds

<FAQ path="Seeds/full-refresh-seed" />

## Рекомендация
- Устанавливайте `full_refresh: false` для моделей с особенно большими наборами данных, которые вы _никогда_ не хотели бы, чтобы dbt полностью удалял и пересоздавал.
- Вы не можете переопределить уже заданный параметр `full_refresh`. Чтобы изменить его поведение в определённых случаях, необходимо удалить логику конфигурации или обновить её с использованием переменных, чтобы при необходимости поведение можно было переопределять. Например, если у вас есть инкрементальная модель со следующей конфигурацией:
  ```sql
  {{ config(
      materialized = 'incremental',
      full_refresh = var("force_full_refresh", false)
  ) }}
  ```

  Тогда вы можете переопределить параметр `full_refresh`, установив его в `true`, с помощью флага [`--vars`](/docs/build/project-variables#defining-variables-on-the-command-line):  
  `dbt run --vars '{"force_full_refresh": true}'`.

## Справочная документация
* [on_configuration_change](/reference/resource-configs/on_configuration_change)
