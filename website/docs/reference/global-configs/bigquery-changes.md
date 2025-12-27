---
title: "Изменения в поведении адаптера BigQuery"
id: "bigquery-changes"
sidebar: "BigQuery"
---

## Флаг `bigquery_use_batch_source_freshness`

Флаг `bigquery_use_batch_source_freshness` по умолчанию имеет значение `False`. Установка его в `True` в файле `dbt_project.yml` включает режим, при котором dbt вычисляет результаты `source freshness` с помощью одного пакетного запроса к представлению BigQuery [`INFORMATION_SCHEMA.TABLE_STORAGE`](https://cloud.google.com/bigquery/docs/information-schema-table-storage), вместо отправки отдельного запроса метаданных для каждого источника.

Установка этого флага в `True` значительно повышает производительность команды `source freshness`, особенно в проектах с большим количеством источников (1000 и более).
