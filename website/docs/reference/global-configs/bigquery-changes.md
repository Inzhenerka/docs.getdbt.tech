---
title: "Изменения в поведении адаптера BigQuery"
id: "bigquery-changes"
sidebar: "BigQuery"
---

<a id="the-bigquery_use_batch_source_freshness-flag" />

## Флаг `bigquery_use_batch_source_freshness` {#the-bigqueryusebatchsourcefreshness-flag}

Флаг `bigquery_use_batch_source_freshness` по умолчанию имеет значение `false`. Если установить для него значение `true` в файле `dbt_project.yml`, dbt будет вычислять результаты `source freshness` с помощью одного пакетного запроса к представлению BigQuery [`INFORMATION_SCHEMA.TABLE_STORAGE`](https://cloud.google.com/bigquery/docs/information-schema-table-storage), а не отправлять отдельный запрос метаданных для каждого источника.

Установка этого флага в `true` значительно ускоряет выполнение команды `source freshness`, особенно если проект содержит большое количество источников (1000 и более).

:::caution Использование `loaded_at_field` с пакетной проверкой актуальности
Если флаг `bigquery_use_batch_source_freshness` включён, dbt определяет актуальность данных по таблицам метаданных BigQuery.

Если для источника настроен `loaded_at_field`, dbt проверяет актуальность данных этого источника на основе столбца, а не метаданных.

Однако если `loaded_at_field` задан для _всех_ источников, проверка актуальности завершается ошибкой компиляции (`list object has no element 0` в `get_relation_last_modified`). Это происходит потому, что флаг `bigquery_use_batch_source_freshness` предполагает, что хотя бы один источник использует проверку актуальности на основе метаданных; настройка `loaded_at_field` для всех источников нарушает это условие.

Чтобы избежать этого, удалите `loaded_at_field` у тех источников, для которых вы хотите использовать пакетную проверку актуальности.
:::

<VersionBlock firstVersion="1.12">

## Флаг `bigquery_reject_wildcard_metadata_source_freshness` {#the-bigquery_reject_wildcard_metadata_source_freshness-flag}

Если источник BigQuery использует идентификатор таблицы с подстановочным знаком (например, `events_*`), проверки актуальности данных источника на основе метаданных возвращают неверные результаты. Метод `client.get_table()` в BigQuery создаёт для таких идентификаторов временную объединённую таблицу, время изменения которой соответствует текущему времени &mdash; а не фактическому времени изменения исходных таблиц. В результате проверки актуальности сообщают, что возраст данных составляет примерно 0 секунд, скрывая устаревшие данные без каких-либо предупреждений.

Флаг `bigquery_reject_wildcard_metadata_source_freshness` управляет тем, как dbt обрабатывает проверки актуальности на основе метаданных для источников BigQuery, использующих идентификаторы таблиц с подстановочными знаками.

По умолчанию этот флаг имеет значение `false`. Для таблиц с идентификаторами, содержащими подстановочные знаки, проверки актуальности на основе метаданных продолжают выполняться, но dbt выводит предупреждение об устаревшем поведении с рекомендацией включить новое поведение. Например:

```
WARNING: Raise an error when metadata-based source freshness is used with a
wildcard table identifier (e.g. 'events_*'). BigQuery returns the current time
as the modified timestamp for wildcard tables, causing freshness checks to
always report ~0 seconds.
You may opt into the new behavior sooner by setting
`flags.bigquery_reject_wildcard_metadata_source_freshness` to `true` in `dbt_project.yml`.
```

Если установить для этого флага значение `true`, dbt выдаст ошибку `DbtRuntimeError` при запуске проверок актуальности на основе метаданных для идентификаторов таблиц с подстановочными знаками. Например:

```
Runtime Error in source my_* (models/schema.yml)
  Metadata-based source freshness is not supported for wildcard table
  '`dbt-test-env`.`dbt_username`.`events_*`'. Please set 'loaded_at_field' on
  this source to use a query-based freshness check instead.
```

Чтобы вычислять актуальность данных для таблиц с подстановочными знаками, настройте [`loaded_at_field`](/reference/resource-configs/freshness) для источника и используйте проверки актуальности на основе запросов. 

Пример конфигурации:

<File name='models/schema.yml'>

```yaml
sources:
  - name: events
    database: dbt-test-env
    schema: dbt_username
    tables:
      - name: events           
        identifier: "events_*"  # wildcard table identifier in BigQuery
        config:
          freshness:
            warn_after: {count: 12, period: hour}
            error_after: {count: 24, period: hour}
          loaded_at_field: _etl_loaded_at
```

</File>


## Флаг `bigquery_use_standard_sql_for_partitions` {#the-bigquery_use_standard_sql_for_partitions-flag}

В BigQuery [устаревший диалект SQL объявлен устаревшим](https://docs.cloud.google.com/bigquery/docs/release-notes#February_25_2026). В настоящее время макрос `get_partitions_metadata()` использует устаревший диалект SQL с `$__PARTITIONS_SUMMARY__` и не будет работать в проектах без [поддержки устаревшего диалекта SQL](https://docs.cloud.google.com/bigquery/docs/legacy-sql-feature-availability)

Флаг `bigquery_use_standard_sql_for_partitions` определяет, использует ли dbt стандартный SQL (`INFORMATION_SCHEMA.PARTITIONS`) вместо устаревшего диалекта SQL (`$__PARTITIONS_SUMMARY__`) при вызове `get_partitions_metadata()`.

По умолчанию этот флаг имеет значение `true`, что включает использование стандартного SQL. Чтобы вернуться к устаревшему диалекту SQL, установите для флага значение `false` в файле `dbt_project.yml`.

При переходе с устаревшего диалекта SQL учитывайте следующее:

- **Стоимость:** Запросы к `$__PARTITIONS_SUMMARY__` бесплатны. Запросы к `INFORMATION_SCHEMA.PARTITIONS` оплачиваются за каждый запрос по фиксированному тарифу BigQuery, а не за объём обработанных байтов.
- **Различия в столбцах:** Из столбцов этих двух источников совместим только `partition_id`. Устаревшая таблица метаданных также возвращала `project_id`, `dataset_id`, `table_id`, `creation_time` и `last_modified_time`. Если ваши пользовательские макросы обращаются к этим столбцам в результатах `get_partitions_metadata()`, их необходимо обновить.
- **Разрешения IAM:** Для `INFORMATION_SCHEMA.PARTITIONS` требуются разрешения `bigquery.tables.get` и `bigquery.tables.list` вместо `bigquery.tables.getData`. Пользовательские роли IAM может потребоваться обновить. Стандартные предопределённые роли (`roles/bigquery.dataViewer`, `roles/bigquery.dataEditor`, `roles/bigquery.admin`) уже включают все необходимые разрешения, поэтому эти изменения на них не влияют.

</VersionBlock>
