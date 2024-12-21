---
resource_types: [models, seeds]
description: "Установка конфигурации full_refresh в значение false предотвращает перестроение модели или seed, даже если флаг `--full-refresh` включен в вызове."
datatype: boolean
---

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
    +full_refresh: false

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
    full_refresh = false
) }}

select ...

```

</File>

Настроенные модели не будут полностью обновляться при вызове `dbt run --full-refresh`.

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +full_refresh: false

```

</File>

Настроенные seeds не будут полностью обновляться при вызове `dbt seed --full-refresh`.

</TabItem>

</Tabs>

## Описание
Опционально установите ресурс для всегда или никогда полного обновления.
- Если указано как `true` или `false`, конфигурация `full_refresh` будет иметь приоритет над наличием или отсутствием флага `--full-refresh`.
- Если конфигурация `full_refresh` равна `none` или опущена, ресурс будет использовать значение флага `--full-refresh`.

**Примечание:** Флаг `--full-refresh` также поддерживает короткое имя, `-f`.

Эта логика закодирована в макросе [`should_full_refresh()`](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/configs.sql).

## Использование

### Инкрементные модели

* [Как перестроить инкрементную модель?](/docs/build/incremental-models#how-do-i-rebuild-an-incremental-model)
* [Что делать, если изменяются столбцы моей инкрементной модели?](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change)

### Seeds

<FAQ path="Seeds/full-refresh-seed" />

## Рекомендация
Установите `full_refresh: false` для моделей особенно больших наборов данных, которые вы _никогда_ не захотите, чтобы dbt полностью удалял и воссоздавал.

## Справочная документация
* [on_configuration_change](/reference/resource-configs/on_configuration_change)