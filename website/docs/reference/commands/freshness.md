---
title: "О команде dbt freshness"
sidebar_label: "freshness"
id: "freshness"
availability:
  engine: v2
  access: free
---

# dbt freshness

Команда `dbt freshness` проверяет, соответствуют ли источники и модели с настроенной [проверкой актуальности данных](/reference/resource-configs/freshness) пороговым значениям `warn_after` и `error_after`, и сообщает о предупреждениях и ошибках соответственно.

## Использование

```bash
dbt freshness [--select SELECTOR] [--resource-type RESOURCE_TYPE] [--exclude-resource-type RESOURCE_TYPE]
```

### Запуск проверки актуальности данных для всех источников и моделей

```bash
dbt freshness
```

### Включение или исключение типов ресурсов
Используйте флаг, чтобы указать, какой тип ресурса нужно включить или исключить при выполнении команды:

```bash
# Include sources only
dbt freshness --resource-type source

# Include models only
dbt freshness --resource-type model

# Exclude sources only
dbt freshness --exclude-resource-type source
```

### Выбор конкретной модели или источника
Используйте `--select`, чтобы указать, какую модель или источник нужно включить при выполнении команды:

```bash
# Select a specific model 
dbt freshness --select stg_orders

# Select all sources in a namespace
dbt freshness --select "source:jaffle_shop"

# Select a specific source table
dbt freshness --select "source:jaffle_shop.orders"
```

## Как оценивается актуальность данных {#how-freshness-is-evaluated}

`dbt freshness` проверяет источники или модели, у которых в [конфигурации `freshness`](/reference/resource-configs/freshness?version=2) задан параметр `warn_after` или `error_after`.

dbt получает последнюю временную метку одним из следующих способов, а затем сравнивает её с текущей временной меткой, чтобы определить возраст данных.

<SimpleTable>

| Способ | Когда используется | Как dbt получает временную метку |
| --- | --- | --- |
| `loaded_at_query` | Если настроен для ресурса | Выполняет пользовательское SQL-выражение для получения последней временной метки. |
| `loaded_at_field` | Если настроен для ресурса | Выполняет запрос `MAX(<loaded_at_field>)` к материализованному объекту базы данных. |
| Метаданные адаптера | Если не настроен ни `loaded_at_query`, ни `loaded_at_field` | Получает время последнего изменения из метаданных объекта базы данных, предоставляемых адаптером. Доступно для источников и для моделей с материализацией `table`, `incremental`, `materialized_view` или `dynamic_table`, если адаптер это поддерживает.  Для моделей с материализацией `view` или `external` необходимо использовать `loaded_at_field` или `loaded_at_query`. |

</SimpleTable>

Нельзя настроить одновременно `loaded_at_query` и `loaded_at_field` для одного ресурса. Если заданы оба параметра, возникает ошибка разбора.

## Вывод команды

### freshness.json

После завершения `dbt freshness` dbt записывает результаты проверки источников и моделей в `target/freshness.json`. Каждая запись содержит поле `resource_type`, указывающее, является ли ресурс источником или моделью.

Полную схему см. в разделе [`freshness.json`](/reference/artifacts/freshness-json).

```json
{
  "metadata": {
    "generated_at": "2026-08-28T00:00:00.000000Z"
  },
  "results": [
    {
      "unique_id": "model.jaffle_shop.stg_orders",
      "resource_type": "model",
      "max_loaded_at": "2026-08-27T22:00:00+00:00",
      "snapshotted_at": "2026-08-28T00:00:00+00:00",
      "max_loaded_at_time_ago_in_s": 7200,
      "status": "Pass",
      "criteria": {
        "warn_after": {"count": 24, "period": "hour"},
        "error_after": {"count": 48, "period": "hour"}
      }
    },
    {
      "unique_id": "source.jaffle_shop.jaffle_shop.orders",
      "resource_type": "source",
      "max_loaded_at": "2026-08-27T23:30:00+00:00",
      "snapshotted_at": "2026-08-28T00:00:00+00:00",
      "max_loaded_at_time_ago_in_s": 1800,
      "status": "Pass",
      "criteria": {
        "warn_after": {"count": 12, "period": "hour"},
        "error_after": {"count": 24, "period": "hour"}
      }
    }
  ]
}
```

### sources.json (устаревший формат) {#sources-json}

Для обратной совместимости, если в запуск `dbt freshness` включены источники, dbt также записывает файл `target/sources.json`. Он содержит только источники, без поля `resource_type`. Если запуск включает только модели, dbt не перезаписывает `sources.json`.

Полную схему см. в разделе [`sources.json`](/reference/artifacts/sources-json).

Устаревшая команда [`dbt source freshness`](/reference/commands/source) по-прежнему работает для обратной совместимости и создаёт только `sources.json`.

## Связанная документация

- [Конфигурация freshness](/reference/resource-configs/freshness)
- [Актуальность данных источников](/docs/build/sources#source-data-freshness)
- [Артефакты dbt](/reference/artifacts/dbt-artifacts)
