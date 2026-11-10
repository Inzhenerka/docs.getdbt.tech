---
title: "Свойства метрик"
id: metric-properties
sidebar_label: "Свойства метрик"
description: "Справочник свойств метрик семантического слоя: простых, накопительных, отношений, производных и конверсионных."
keywords:
  - dbt semantic layer
  - metrics
  - metric configuration
  - MetricFlow
---

Метрики определяют измеримые величины, которые можно запрашивать через <Constant name="semantic_layer" />. Место их определения зависит от версии <Constant name="dbt" />:

- В модели с использованием *новейшей* спецификации YAML. Список `metrics:` верхнего уровня в [модели](/reference/model-properties) с включённым семантическим моделированием, наряду с `semantic_model:` и `columns:`. Доступно в канале выпусков **v1 Latest** <Constant name="dbt_platform" /> и в <Constant name="fusion_engine" />.
- В отдельном файле с использованием *устаревшей* спецификации YAML.  Подробнее см. в разделе [Создание метрик](/docs/build/metrics-overview).

import LatestYamlSpecAvailability from '/snippets/_latest-yaml-spec-availability-versioned.md';

<LatestYamlSpecAvailability />

<VersionBlock firstVersion="1.12">

## Новейшая спецификация (YAML модели)

В новейшей спецификации YAML метрики можно определять в модели с включённым семантическим моделированием. Добавьте список `metrics` верхнего уровня наряду с `semantic_model` и `columns` (метрики не вкладываются в `semantic_model`). Настройки, зависящие от типа, задаются ключами верхнего уровня в каждой метрике.

### Доступные свойства метрик (новейшая спецификация)

| Свойство | Тип | Обязательное | Описание |
|----------|------|----------|-------------|
| name | string | Да | Уникальное имя метрики. Используйте строчные латинские буквы, цифры и символы подчёркивания. |
| type | string | Да | Одно из значений: `simple`, `cumulative`, `ratio`, `derived`, `conversion`. |
| description | string | Нет | Документация метрики. |
| label | string | Нет | Отображаемое имя в инструментах, использующих метрику. |
| filter | string | Нет | Выражение фильтра MetricFlow (измерения, сущности или другие метрики). |
| config | object | Нет | Поддерживает [meta](/reference/resource-configs/meta), [group](/reference/resource-configs/group), [tags](/reference/resource-configs/tags), [enabled](/reference/resource-configs/enabled). |

### Свойства по типам метрик (новейшая спецификация)

| Тип метрики | Основные свойства |
|-------------|-----------------|
| Все | name, type, description, label, hidden, filter, config |
| [Простая](/docs/build/simple) | agg, expr, time_granularity, agg_time_dimension, join_to_timespine, fill_nulls_with; необязательное свойство non_additive_dimension |
| [Производная](/docs/build/derived) | expr, input_metrics (для каждой метрики необязательные alias, filter, offset_window) |
| [Отношение](/docs/build/ratio) | numerator, denominator (каждое значение — имя метрики или словарь с name, filter, alias) |
| [Конверсионная](/docs/build/conversion) | entity, calculation, base_metric, conversion_metric, window; необязательное свойство constant_properties |
| [Накопительная](/docs/build/cumulative) | input_metric, window, grain_to_date, period_agg |

**Метрики, использующие несколько моделей:** Метрики в списке `metrics:` модели могут ссылаться только на эту семантическую модель. Метрики, зависящие от других семантических моделей (например, накопительные, отношения, производные или конверсионные метрики, использующие несколько моделей), размещаются в блоке `metrics:` верхнего уровня (вне `models:`). Этот блок может находиться в том же файле YAML или в отдельном файле.

**Примечание:** В устаревшей спецификации все метрики определялись в отдельных файлах YAML; списка `metrics:` на уровне модели не было.

Подробнее о новейшей спецификации см. в разделе [Семантические модели](/docs/build/semantic-models). О типах метрик, `type_params` и дополнительных примерах см. в разделе [Создание метрик](/docs/build/metrics-overview).

</VersionBlock>

<VersionBlock lastVersion="1.11">

## Устаревшая спецификация (отдельный YAML)

Метрики определяются в ключе `metrics:` верхнего уровня в отдельном файле YAML. Настройки, зависящие от типа, размещаются в `type_params`.

### Доступные свойства метрик (устаревшая спецификация)

| Свойство | Тип | Обязательное | Описание |
|----------|------|----------|-------------|
| name | string | Да | Уникальное имя метрики. Используйте строчные латинские буквы, цифры и символы подчёркивания. |
| type | string | Да | Одно из значений: `simple`, `cumulative`, `ratio`, `derived`, `conversion`. |
| type_params | object | Да | Параметры, зависящие от типа; структура определяется значением `type`. См. список по типам ниже. |
| description | string | Нет | Документация метрики. |
| label | string | Да | Отображаемое имя в инструментах, использующих метрику. |
| filter | string | Нет | Выражение фильтра MetricFlow (измерения, сущности или другие метрики). |
| config | object | Нет | Поддерживает [meta](/reference/resource-configs/meta), [group](/reference/resource-configs/group), [tags](/reference/resource-configs/tags), [enabled](/reference/resource-configs/enabled). |

### Параметры, зависящие от типа (устаревшая спецификация)

Следующие параметры задаются в `type_params` в зависимости от типа метрики:

- **[Простая](/docs/build/simple)**: `agg` (обязательный), `expr`, `percentile`, `percentile_type`, `non_additive_dimension`, `agg_time_dimension`, `join_to_timespine`, `fill_nulls_with`
- **[Накопительная](/docs/build/cumulative)**: `input_metric` (обязательный), `window`, `grain_to_date`, `period_agg`
- **[Производная](/docs/build/derived)**: `expr` (обязательный), `input_metrics` (обязательный)
- **[Отношение](/docs/build/ratio)**: `numerator` (обязательный), `denominator` (обязательный)
- **[Конверсионная](/docs/build/conversion)**: `entity` (обязательный), `calculation` (обязательный), `base_metric` (обязательный), `conversion_metric` (обязательный), `window`, `constant_properties`

Полное описание `type_params` и примеры для каждого типа см. в разделах [Создание метрик](/docs/build/metrics-overview), [Простые метрики](/docs/build/simple), [Накопительные метрики](/docs/build/cumulative), [Метрики отношений](/docs/build/ratio), [Производные метрики](/docs/build/derived) и [Конверсионные метрики](/docs/build/conversion).

</VersionBlock>
