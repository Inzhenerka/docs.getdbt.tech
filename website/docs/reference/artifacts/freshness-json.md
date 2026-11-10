---
title: "JSON-файл актуальности данных"
sidebar_label: "Актуальность данных"
availability:
  engine: v2
  access: free
---

# JSON-файл актуальности данных

- **Текущая схема**: [v0](https://schemas.getdbt.com/dbt/freshness/v0/index.html)
- **Создаётся командой:** [`dbt freshness`](/reference/commands/freshness)

Этот файл содержит результаты проверки актуальности данных для всех источников и моделей, для которых настроен параметр [freshness](/reference/resource-configs/freshness). dbt записывает его в `target/freshness.json` после каждого вызова `dbt freshness`.

Каждая запись содержит поле `resource_type`, которое указывает, является ли ресурс источником или моделью.

### Ключи верхнего уровня

- `metadata`: Метаданные вызова со следующими полями:
  - `dbt_schema_version`: URL схемы этого артефакта (всегда `https://schemas.getdbt.com/dbt/freshness/v0.json`).
  - `dbt_version`: Версия dbt, создавшая файл.
  - `generated_at`: Метка времени записи файла.
  - `invocation_id`: Уникальный идентификатор этого вызова.
  - `invocation_started_at`: Метка времени начала вызова. Поле опускается, если значение недоступно.
  - `env`: Словарь переменных окружения `DBT_ENV_CUSTOM_ENV_*`, если они заданы.
- `results`: Массив результатов проверки актуальности данных.

Каждая запись в `results` — это словарь со следующими ключами:

- `unique_id`: Уникальный идентификатор узла, связывающий результаты с `nodes` или `sources` в [манифесте](/reference/artifacts/manifest-json).
- `resource_type`: Значение `model` или `source`.
- `max_loaded_at`: Максимальное значение метки времени загрузки, полученное при выполнении запроса.
- `snapshotted_at`: Метка времени выполнения проверки.
- `max_loaded_at_time_ago_in_s`: Интервал между `max_loaded_at` и `snapshotted_at` в секундах.
- `status`: Статус актуальности данных: `Pass`, `Warn` или `Error`. Если запрос для проверки актуальности данных завершается с ошибкой, dbt записывает ошибку в журнал, но исключает узел из файла, а не записывает его со статусом сбоя.
- `criteria`: Настройки актуальности данных для этого узла, включая `warn_after`, `error_after`, `filter`, `loaded_at_field` и `loaded_at_query`.
- `thread_id`: Идентификатор потока, выполнившего эту проверку.
