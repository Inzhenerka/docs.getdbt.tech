---
title: "Семантический манифест"
id: sl-manifest
description: "Узнайте о файле semantic manifest.json и о том, как вы можете использовать артефакты для получения информации о вашем dbt Semantic Layer."
tags: [Semantic Layer, APIs]
sidebar_label: "Семантический манифест"
pagination_next: null
---

**Создается при выполнении:** Любой команды, которая анализирует ваш проект. Это включает все команды, _кроме_ [`deps`](/reference/commands/deps), [`clean`](/reference/commands/clean), [`debug`](/reference/commands/debug) и [`init`](/reference/commands/init).

dbt создает файл [артефакта](/reference/artifacts/dbt-artifacts) под названием _Semantic Manifest_ (`semantic_manifest.json`), который необходим MetricFlow для правильного построения и выполнения запросов метрик для dbt Semantic Layer. Этот артефакт содержит полную информацию о вашем dbt Semantic Layer. Это внутренний файл, который служит точкой интеграции с MetricFlow.

Используя семантический манифест, сформированный <Constant name="core" />, MetricFlow создаёт план потока данных и генерирует SQL на основе запросов к <Constant name="semantic_layer" />. Это ценный справочный материал, который можно использовать для понимания структуры и деталей ваших моделей данных.

Подобно файлу [`manifest.json`](/reference/artifacts/manifest-json), файл `semantic_manifest.json` также находится в [целевой директории](/reference/global-configs/json-artifacts) вашего dbt проекта, где dbt хранит различные артефакты (такие как скомпилированные модели и тесты), созданные во время выполнения вашего проекта.

Есть две причины, по которым файл `semantic_manifest.json` существует наряду с `manifest.json`:

- **Deserialization**: `dbt-core` и MetricFlow используют разные библиотеки для работы с сериализацией данных.
- **Efficiency and performance**: MetricFlow и семантический слой dbt нуждаются в конкретных семантических деталях из манифеста. За счёт сокращения объёма информации, выводимой в `semantic_manifest.json`, процесс становится более эффективным и обеспечивает более быструю передачу и обработку данных между `dbt-core` и MetricFlow.

## Ключи верхнего уровня {#top-level-keys}

Ключи верхнего уровня в semantic manifest:

- `semantic_models` &mdash; Начальные точки данных с сущностями, измерениями и мерами; соответствуют моделям в вашем dbt‑проекте.
- `metrics` &mdash; Функции, объединяющие меры, ограничения и другие элементы для определения количественных показателей.
- `project_configuration` &mdash; Содержит информацию о конфигурации вашего проекта.
- `saved_queries` &mdash; Сохраняет часто используемые запросы в MetricFlow.

### Пример {#example}

<File name="target/semantic_manifest.json"> 

```json
{
    "semantic_models": [
        {
            "name": "semantic model name",
            "defaults": null,
            "description": "semantic model description",
            "node_relation": {
                "alias": "model alias",
                "schema_name": "model schema",
                "database": "model db",
                "relation_name": "Fully qualified relation name"
            },
            "entities": ["entities in the semantic model"],
            "measures": ["measures in the semantic model"],
            "dimensions": ["dimensions in the semantic model" ],
        }
    ],
    "metrics": [
        {
            "name": "name of the metric",
            "description": "metric description",
            "type": "metric type",
            "type_params": {
                "measure": {
                    "name": "name for measure",
                    "filter": "filter for measure",
                    "alias": "alias for measure"
                },
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": ["metrics used in defining the metric. this is used in derived metrics"],
                "input_measures": []
            },
            "filter": null,
            "metadata": null
        }
    ],
    "project_configuration": {
        "time_spine_table_configurations": [
            {
                "location": "fully qualified table name for timespine",
                "column_name": "date column",
                "grain": "day"
            }
        ],
        "metadata": null,
        "dsi_package_version": {}
    },
    "saved_queries": [
        {
            "name": "name of the saved query",
            "query_params": {
                "metrics": [
                    "metrics used in the saved query"
                ],
                "group_by": [
                    "TimeDimension('model_primary_key__date_column', 'day')",
                    "Dimension('model_primary_key__metric_one')",
                    "Dimension('model__dimension')"
                ],
                "where": null
            },
            "description": "Description of the saved query",
            "metadata": null,
            "label": null,
            "exports": [
                {
                    "name": "saved_query_name",
                    "config": {
                        "export_as": "view",
                        "schema_name": null,
                        "alias": null
                    }
                }
            ]
        }
    ]
}
```

</File>

## Связанные документы {#related-docs}

- [<Constant name="semantic_layer" /> API](/docs/dbt-cloud-apis/sl-api-overview)
- [Об артефактах dbt](/reference/artifacts/dbt-artifacts)
