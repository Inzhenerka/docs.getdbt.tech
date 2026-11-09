---
title: "Изменения в поведении адаптера Snowflake"
id: "snowflake-changes"
sidebar: "Snowflake"
---

Ниже перечислены текущие [флаги изменения поведения](/reference/global-configs/behavior-changes#behavior-change-flags), специфичные для `dbt-snowflake`:

| Флаг | `dbt-snowflake`: введён | `dbt-snowflake`: переход к стабильному поведению | Статус |
| ---- | ---------------------- | ------------------------- | ------ |
| [`snowflake_default_transient_dynamic_tables`](#the-snowflake_default_transient_dynamic_tables-flag) | 1.12.0 | Пока не определено | Активен |
| [`snowflake_managed_iceberg_default`](#the-snowflake_managed_iceberg_default-flag) | 1.12.0 | Пока не определено | Активен |

## Флаг `snowflake_default_transient_dynamic_tables` {#the-snowflake_default_transient_dynamic_tables-flag}

Доступен начиная с `dbt-snowflake` v1.12. Флаг `snowflake_default_transient_dynamic_tables` определяет, создаются ли динамические таблицы Snowflake как временные (transient), если в конфигурации модели явно не задан параметр [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables).

- Если задано значение `false` (по умолчанию): динамические таблицы создаются как постоянные таблицы с [периодом Fail-safe](https://docs.snowflake.com/en/user-guide/data-failsafe), если для конкретной модели не задано `transient: true`.
- Если задано значение `true`: динамические таблицы создаются как временные (transient), без периода Fail-safe, если в конфигурации модели не указан параметр `transient`. Временные динамические таблицы могут снизить затраты на хранение.

Задайте флаг `snowflake_default_transient_dynamic_tables` в файле `dbt_project.yml` в разделе `flags`. Настройку по умолчанию можно переопределить с помощью параметра [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) в моделях динамических таблиц.

## Флаг `snowflake_managed_iceberg_default` {#the-snowflake_managed_iceberg_default-flag}

:::note dbt v2

В v2 это поведение используется по умолчанию, и задавать флаг не требуется — он отсутствует. Значение `external_volume` по умолчанию — `SNOWFLAKE_MANAGED`, а dbt не включает `base_location`, если таблица использует хранилище под управлением Snowflake.

:::

Доступен начиная с `dbt-snowflake` v1.12. Флаг `snowflake_managed_iceberg_default` определяет поведение dbt, когда в модели задано `table_format: iceberg` для [таблицы Iceberg](/docs/build/iceberg/adapters/snowflake-iceberg-support), но не указан `external_volume`.

Snowflake не допускает указание `BASE_LOCATION` для таблиц Iceberg, использующих [хранилище под управлением Snowflake](https://docs.snowflake.com/en/user-guide/tables-iceberg-internal-storage), и возвращает ошибку `BASE_LOCATION property is not supported for Iceberg tables using Snowflake Managed Storage`. Этот флаг позволяет dbt генерировать инструкции языка определения данных (DDL), которые принимает Snowflake Horizon, без необходимости настраивать каталог.

- Если задано значение `false` (по умолчанию): dbt не включает `external_volume`. Snowflake использует [внешний том по умолчанию](https://docs.snowflake.com/user-guide/tables-iceberg-configure-external-volume#set-a-default-external-volume-at-the-account-database-or-schema-level), заданный на уровне учётной записи, базы данных или схемы, а dbt по-прежнему генерирует `base_location`.
- Если задано значение `true`: dbt включает `external_volume = 'SNOWFLAKE_MANAGED'` и не включает `base_location`, поэтому таблица использует хранилище под управлением Snowflake.

По умолчанию флаг имеет значение `false`, чтобы не менять целевое хранилище для проектов, которые используют внешний том по умолчанию, заданный на уровне учётной записи, базы данных или схемы.

Два случая не зависят от этого флага:

- Если задать для `external_volume` значение `SNOWFLAKE_MANAGED`, dbt всегда исключает `base_location`. dbt сначала определяет значение `external_volume` по конфигурации модели, а затем — по определению каталога в `catalogs.yml`, поэтому указание этого значения в любом из этих мест приводит к исключению `base_location`.
- Если задать для `external_volume` пользовательский том, например Amazon S3, Azure или Google Cloud Storage, dbt всегда включает и `external_volume`, и `base_location`.

Задайте флаг в файле `dbt_project.yml` в разделе `flags`:

<File name='dbt_project.yml'>

```yaml
flags:
  snowflake_managed_iceberg_default: true
```

</File>
