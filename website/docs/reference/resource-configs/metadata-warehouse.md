---
title: metadata_warehouse
description: "Укажите выделенный warehouse Snowflake для запросов метаданных dbt State, чтобы избежать ожидания в очереди на основном вычислительном warehouse."
id: "metadata-warehouse"
tags: ['dbt State']
---

# metadata_warehouse

:::note Только для Snowflake
Эта настройка доступна только в Snowflake.
:::

<File name="profiles.yml">

```yaml
my_project:
  outputs:
    prod:
      type: snowflake
      # ... другие настройки подключения
      warehouse: TRANSFORMING
      metadata_warehouse: METADATA_XS
  target: prod
```

</File>

## Определение

dbt State выполняет запросы для анализа метаданных, чтобы определить, нужно ли пересоздавать модели. В Snowflake эти запросы по умолчанию выполняются на настроенном `warehouse`, что может приводить к ожиданию в очереди при высокой нагрузке на основной warehouse.

`metadata_warehouse` позволяет направлять эти запросы на отдельный warehouse меньшего размера, чтобы не нагружать основной вычислительный ресурс анализом метаданных. Если эта настройка задана, dbt параллельно выполняет несколько отдельных запросов (по одному на каждую схему) на выделенном warehouse &mdash; это быстрее, чем один сводный запрос, который dbt выполняет по умолчанию, когда `metadata_warehouse` не настроен.

Если запросы метаданных на основном warehouse занимают более 15 секунд, dbt выводит предупреждение с предложением настроить выделенный warehouse.

Вы также можете использовать `metadata_warehouse` на <Constant name="dbt_platform" />, добавив его как [расширенный атрибут](/docs/dbt-platform-environments#extended-attributes) в [профиль подключения](/docs/platform/about-profiles) для среды развертывания.

:::note
В настоящее время эта настройка применяется только к запросам метаданных dbt State. В будущем область ее применения может быть расширена. Запрос на добавление этой возможности см. в [dbt-labs/dbt#12122](https://github.com/dbt-labs/dbt/issues/12122).
:::

## Значение по умолчанию

Используется значение настройки `warehouse` из `profiles.yml`.

## Пример

### Отдельные warehouse для метаданных и выполнения моделей

<File name="profiles.yml">

```yaml
my_project:
  outputs:
    prod:
      type: snowflake
      account: abc12345
      database: ANALYTICS
      schema: DBT_PROD
      warehouse: TRANSFORMING          # используется для выполнения моделей
      metadata_warehouse: METADATA_XS  # используется для анализа метаданных dbt State
  target: prod
```

</File>

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка Snowflake](/reference/resource-configs/snowflake-configs)
