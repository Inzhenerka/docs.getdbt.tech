---
resource_types: [models, seeds]
description: "Установка конфигурации full_refresh в значение false предотвращает перестройку модели или семени, даже если флаг `--full-refresh` включен в вызов."
datatype: boolean
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Модели', value: 'models', },
    { label: 'Семена', value: 'seeds', },
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

Настроенные модель(и) не будут полностью обновлены, когда будет вызван `dbt run --full-refresh`.

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +full_refresh: false

```

</File>

Настроенные семена не будут полностью обновлены, когда будет вызван `dbt seed --full-refresh`.

</TabItem>

</Tabs>

## Описание
Опционально установите ресурс для всегда или никогда не обновлять полностью.
- Если указано как `true` или `false`, конфигурация `full_refresh` будет иметь приоритет над наличием или отсутствием флага `--full-refresh`.
- Если конфигурация `full_refresh` равна `none` или опущена, ресурс будет использовать значение флага `--full-refresh`.

**Примечание:** Флаг `--full-refresh` также поддерживает короткое имя `-f`.

Эта логика закодирована в макросе [`should_full_refresh()`](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/configs.sql).

## Использование

### Инкрементальные модели

* [Как мне перестроить инкрементальную модель?](/docs/build/incremental-models#how-do-i-rebuild-an-incremental-model)
* [Что если столбцы моей инкрементальной модели изменятся?](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change)

### Семена

<FAQ path="Seeds/full-refresh-seed" />

## Рекомендация
Установите `full_refresh: false` для моделей особенно больших наборов данных, которые вы _никогда_ не хотите, чтобы dbt полностью удалял и воссоздавал.

## Справочная документация
* [on_configuration_change](/reference/resource-configs/on_configuration_change)