---
title: "Свойства семантических моделей"
id: semantic-model-properties
sidebar_label: "Свойства семантических моделей"
description: "Полный справочник свойств семантических моделей dbt Semantic Layer: name, model, entities, dimensions, measures и конфигурация."
keywords:
  - dbt semantic layer
  - semantic model
  - semantic model configuration
  - MetricFlow
---

Семантические модели определяют структуру, которую MetricFlow использует для построения семантического графа. В *новой спецификации* их можно объявлять в блоке `semantic_model:` верхнего уровня в [модели](/reference/model-properties). В *устаревшей спецификации* использовались отдельные YAML-файлы. Подробнее см. в разделе [Семантические модели](/docs/build/semantic-models).

import LatestYamlSpecAvailability from '/snippets/_latest-yaml-spec-availability-versioned.md';

<LatestYamlSpecAvailability />

<VersionBlock firstVersion="1.12">

## Новая спецификация (YAML модели)

В новой спецификации модель определяет семантическую модель с помощью ключа `semantic_model`, значение которого может быть:

- **`true` или `false`**: сокращённая запись с логическим значением. `true` включает семантическую модель и использует **имя модели** в качестве имени семантической модели (а также другие значения по умолчанию для незаданных полей). `false` отключает семантическую модель для этой модели.
- **Сопоставлением**: объектом с ключами `enabled`, необязательными `name`, `group`, `config` и так далее, как показано в таблице ниже.

Измерения и сущности определяются на уровне столбца.

### Доступные свойства семантической модели (новая спецификация)

| Свойство / расположение | Тип | Обязательно | Описание |
|---------------------|------|----------|-------------|
| `semantic_model` | boolean или object | При использовании семантического слоя для модели | `true` / `false` или сопоставление. Необязательные ключи сопоставления приведены в следующих строках. |
| `semantic_model.enabled` | boolean | Нет (при записи в виде сопоставления) | По умолчанию `true`, если `semantic_model` — сопоставление. Установите `false` для отключения. Не указывайте при использовании `semantic_model: true` или `false`. |
| `semantic_model.name` | string | Нет | Уникальное имя; по умолчанию — имя модели. Избегайте двойных подчёркиваний (`__`) в имени; см. [Имя](/docs/build/semantic-models#name) в разделе **Семантические модели**. |
| `semantic_model.group` | string | Нет | Группа для организации ресурсов. |
| `semantic_model.config` | object | Нет | Поддерживает [meta](/reference/resource-configs/meta), [group](/reference/resource-configs/group), [enabled](/reference/resource-configs/enabled). |
| `agg_time_dimension` (верхний уровень) | string | Да | Временное измерение по умолчанию для метрик; ссылается на имя измерения. |
| `primary_entity` (верхний уровень) | string | Нет | Имя первичной сущности, если ни у одного столбца не задано `type: primary`. |
| `columns` | array | Да | Список столбцов; каждый может содержать блок `entity:` или `dimension:`; для временных измерений на уровне столбца задаётся `granularity`. |
| `derived_semantics` (верхний уровень) | object | Нет | Необязательные измерения и сущности с `expr`. |
| `metrics` (верхний уровень) | array | Нет | Метрики, получаемые из этой семантической модели; список расположен на одном уровне с `semantic_model`, а не внутри него. |

### Пример минимальной структуры

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true    # задано явно; по умолчанию true, если опущено при записи в виде сопоставления
      name: optional_override   # необязательно; по умолчанию — имя модели
      group: optional_group
      config:
        meta: {}
    agg_time_dimension: my_time_dimension   # верхний уровень; ссылается на имя измерения
    primary_entity: my_primary_entity       # необязательно; используйте, если ни у одного столбца нет type: primary
    columns:
      - name: my_entity_column
        entity:
          type: primary | foreign | unique | natural
          name: optional_entity_name
      - name: my_time_dimension_column
        granularity: day    # обязательно для временных измерений
        dimension:
          type: time
          name: my_time_dimension
      - name: my_categorical_dimension_column
        dimension:
          type: categorical
          name: my_categorical_dimension
    derived_semantics:    # необязательно
      dimensions: []
      entities: []
    metrics:
      - name: my_simple_metric
        type: simple
        agg: count
        expr: optional_expr
```

### Пример с логическим значением вместо сопоставления

Структура такая же, как в предыдущем примере, но вместо сопоставления `semantic_model:` используется логическое значение (имя семантической модели по умолчанию совпадает с именем модели):

```yaml
models:
  - name: my_model
    semantic_model: true
    agg_time_dimension: my_time_dimension
    primary_entity: my_primary_entity       # необязательно
    columns:
      - name: my_entity_column
        entity:
          type: primary | foreign | unique | natural
      - name: my_time_dimension_column
        granularity: day
        dimension:
          type: time
          name: my_time_dimension
    metrics:
      - name: my_simple_metric
        type: simple
        agg: count
```

Подробнее о новой спецификации (записи внутри модели с ключами `semantic_model:` и `metrics:` на верхнем уровне модели) см. в разделе [Семантические модели](/docs/build/semantic-models).

</VersionBlock>

<VersionBlock lastVersion="1.11">

## Устаревшая спецификация

Семантические модели определяются в списке `semantic_models:` верхнего уровня в отдельном YAML-файле с ключами `model`, `defaults`, `entities`, `dimensions` и `measures`.

### Доступные свойства семантической модели (устаревшая спецификация)

| Свойство | Тип | Обязательно | Описание |
|----------|------|----------|-------------|
| name | string | Да | Уникальное имя семантической модели. Избегайте двойных подчёркиваний (`__`). |
| description | string | Нет | Документация семантической модели. |
| model | string | Да | Ссылка на модель dbt (например, `ref('my_model')`). |
| defaults | object | Да | Значения по умолчанию; обычно `agg_time_dimension`. |
| entities | array | Да | Ключи соединения и их типы (primary, foreign, unique); для каждого задаются `name`, `type` и необязательный `expr`. |
| primary_entity | string | Нет | Имя первичной сущности, если оно не задано в объявлении сущности. |
| dimensions | array | Да | Список определений [измерений](/reference/dimension-properties) (временных или категориальных). |
| measures | array | Нет | Список мер (простых агрегаций). |
| label | string | Нет | Отображаемое имя в инструментах, использующих эти данные. |
| config | object | Нет | Поддерживает [meta](/reference/resource-configs/meta), [group](/reference/resource-configs/group), [enabled](/reference/resource-configs/enabled). |

### Полная структура

```yaml
semantic_models:
  - name: <unique_name>
    description: <string>
    model: "{{ ref('my_model') }}"
    defaults:
      agg_time_dimension: <time_dimension_name>
    entities:
      - name: <entity_name>
        type: primary | foreign | unique
        expr: <optional_sql_expr>
    dimensions:
      - name: <dimension_name>
        type: time | categorical
        # ... см. dimension-properties
    measures:
      - name: <measure_name>
        agg: sum | count | count_distinct | avg | min | max | ...
        expr: <column_or_expr>
    label: <display_name>
    config:
      meta: {}
      group: <string>
      enabled: true | false
```

Подробнее о новой спецификации (записи внутри модели с ключами `semantic_model:` и `metrics:` на верхнем уровне модели) см. в разделе [Семантические модели](/docs/build/semantic-models).

</VersionBlock>
