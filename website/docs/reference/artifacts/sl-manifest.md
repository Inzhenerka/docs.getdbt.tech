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

Используя семантический манифест, созданный dbt, MetricFlow формирует план потока данных и генерирует SQL на основе запросов к <Constant name="semantic_layer" />. Этот манифест — ценный справочный ресурс, который поможет вам разобраться в структуре и деталях ваших моделей данных.

Подобно файлу [`manifest.json`](/reference/artifacts/manifest-json), файл `semantic_manifest.json` также находится в [целевой директории](/reference/global-configs/json-artifacts) вашего dbt проекта, где dbt хранит различные артефакты (такие как скомпилированные модели и тесты), созданные во время выполнения вашего проекта.

Есть две причины, по которым файл `semantic_manifest.json` существует наряду с `manifest.json`:

- Десериализация: dbt и MetricFlow используют разные библиотеки для сериализации данных.
- Эффективность и производительность: MetricFlow и семантическому слою dbt нужны определённые семантические сведения из манифеста. Сокращение объёма информации, записываемой в `semantic_manifest.json`, повышает эффективность процесса и ускоряет обмен данными между `dbt` и MetricFlow.

## Ключи верхнего уровня
<VersionBlock firstVersion="1.12">
Ключи верхнего уровня семантического манифеста:
-  `semantic_models` &mdash; Отправные точки для работы с данными, содержащие сущности и измерения и соответствующие моделям в вашем проекте dbt. 
-  `metrics` &mdash; Функции, объединяющие сущности, измерения и другие элементы для определения количественных показателей.
- `project_configuration` &mdash; Содержит информацию о настройках вашего проекта
- `saved_queries` &mdash; Сохраняет часто используемые запросы в MetricFlow
</VersionBlock>
<VersionBlock lastVersion="1.9">
Ключи верхнего уровня семантического манифеста:
-  `semantic_models` &mdash; Отправные точки для работы с данными, содержащие сущности, измерения и меры и соответствующие моделям в вашем проекте dbt. 
-  `metrics` &mdash; Функции, объединяющие меры, ограничения и другие элементы для определения количественных показателей.
- `project_configuration` &mdash; Содержит информацию о настройках вашего проекта
- `saved_queries` &mdash; Сохраняет часто используемые запросы в MetricFlow
</VersionBlock>

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

<VersionBlock firstVersion="1.12">

<a id="osi-document" />

## Документ Apache Ossie {#apache-ossie-document}

**Создаётся:** любой командой, которая выполняет разбор вашего проекта (как и семантический манифест).

Начиная с <Constant name="dbt" /> v1.12, во время разбора dbt также записывает файл `osi_document.json` в каталог `target/` рядом с `semantic_manifest.json`. Этот файл представляет <Constant name="semantic_layer" /> вашего проекта в формате [Apache Ossie](https://github.com/apache/ossie) — схеме для описания семантических моделей и метрик, не зависящей от поставщика.

Документ Ossie создаётся путём преобразования полного `PydanticSemanticManifest` в формат Ossie. Не все конструкции семантического слоя dbt имеют эквивалент в Ossie, поэтому dbt выводит предупреждения (код события `I078`), когда при преобразовании элементы исключаются или теряют часть семантики:

| Предупреждение | Причина |
|---|---|
| `CONVERSION_METRIC_DROPPED` | Метрики конверсии невозможно представить в Ossie, поэтому они исключаются. |
| `PRIVATE_METRIC_DROPPED` | Приватные метрики не включаются в выходной документ Ossie. |
| `NATURAL_ENTITY_DROPPED` | Естественные сущности не имеют эквивалента в Ossie, поэтому они исключаются. |
| `CUMULATIVE_SEMANTICS_LOSS` | Метрика включается, но семантику её накопительного окна и гранулярности невозможно представить. |

Если семантический манифест не проходит валидацию, dbt записывает в журнал событие `SemanticValidationFailure` уровня `error` и пропускает запись `osi_document.json` для этого вызова.

</VersionBlock>

## Связанная документация

- [API <Constant name="semantic_layer" />](/docs/dbt-apis/sl-api-overview)
- [Об артефактах dbt](/reference/artifacts/dbt-artifacts)
