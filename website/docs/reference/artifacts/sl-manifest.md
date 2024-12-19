---
title: "Семантический манифест"
id: sl-manifest
description: "Узнайте о файле semantic manifest.json и о том, как вы можете использовать артефакты для получения информации о вашем семантическом слое dbt."
tags: [Семантический слой, API]
sidebar_label: "Семантический манифест"
pagination_next: null
---

**Создано с помощью:** Любой команды, которая анализирует ваш проект. Это включает все команды, _кроме_ [`deps`](/reference/commands/deps), [`clean`](/reference/commands/clean), [`debug`](/reference/commands/debug) и [`init`](/reference/commands/init).

dbt создает файл [артефакта](/reference/artifacts/dbt-artifacts) под названием _Семантический манифест_ (`semantic_manifest.json`), который MetricFlow требует для правильного построения и выполнения запросов метрик для семантического слоя dbt. Этот артефакт содержит полную информацию о вашем семантическом слое dbt. Это внутренний файл, который служит точкой интеграции с MetricFlow.

Используя семантический манифест, созданный dbt Core, MetricFlow будет инстанцировать план потока данных и генерировать SQL из запросов к семантическому слою. Это ценная справка, которую вы можете использовать для понимания структуры и деталей ваших моделей данных.

Аналогично файлу [`manifest.json`](/reference/artifacts/manifest-json), файл `semantic_manifest.json` также находится в [каталоге target](/reference/global-configs/json-artifacts) вашего проекта dbt, где dbt хранит различные артефакты (такие как скомпилированные модели и тесты), созданные в процессе выполнения вашего проекта.

## Ключи верхнего уровня

Ключи верхнего уровня для семантического манифеста:
-  `semantic_models` &mdash; Начальные точки данных с сущностями, измерениями и метриками, которые соответствуют моделям в вашем проекте dbt.
-  `metrics` &mdash; Функции, объединяющие измерения, ограничения и так далее для определения количественных показателей.
- `project_configuration` &mdash; Содержит информацию о конфигурациях вашего проекта.

### Пример

<File name="target/semantic_manifest.json"> 

```json
{
    "semantic_models": [
        {
            "name": "имя семантической модели",
            "defaults": null,
            "description": "описание семантической модели",
            "node_relation": {
                "alias": "псевдоним модели",
                "schema_name": "схема модели",
                "database": "база данных модели",
                "relation_name": "Полное имя отношения"
            },
            "entities": ["сущности в семантической модели"],
            "measures": ["измерения в семантической модели"],
            "dimensions": ["измерения в семантической модели"],
            "metrics": [
                {
                    "name": "имя метрики",
                    "description": "описание метрики",
                    "type": "тип метрики",
                    "type_params": {
                        "measure": {
                            "name": "имя для измерения",
                            "filter": "фильтр для измерения",
                            "alias": "псевдоним для измерения"
                        },
                        "numerator": null,
                        "denominator": null,
                        "expr": null,
                        "window": null,
                        "grain_to_date": null,
                        "metrics": ["метрики, используемые для определения метрики. это используется в производных метриках"],
                        "input_measures": []
                    },
                    "filter": null,
                    "metadata": null
                }
            ],
            "project_configuration": {
                "time_spine_table_configurations": [
                    {
                        "location": "полное имя таблицы для временной оси",
                        "column_name": "столбец даты",
                        "grain": "день"
                    }
                ],
                "metadata": null,
                "dsi_package_version": {}
            },
            "saved_queries": [
                {
                    "name": "имя сохраненного запроса",
                    "query_params": {
                        "metrics": [
                            "метрики, используемые в сохраненном запросе"
                        ],
                        "group_by": [
                            "TimeDimension('model_primary_key__date_column', 'day')",
                            "Dimension('model_primary_key__metric_one')",
                            "Dimension('model__dimension')"
                        ],
                        "where": null
                    },
                    "description": "Описание сохраненного запроса",
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
    ]
}
```

</File>

## Связанные документы

- [API семантического слоя dbt](/docs/dbt-cloud-apis/sl-api-overview)
- [О артефактах dbt](/reference/artifacts/dbt-artifacts)