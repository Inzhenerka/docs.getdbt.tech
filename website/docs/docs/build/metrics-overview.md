---
title: Создание метрик
id: metrics-overview
description: "Определяйте метрики в своём проекте dbt для создания количественных показателей."
sidebar_label: "Создание метрик"
tags: [Metrics, Semantic Layer]
pagination_next: "docs/build/cumulative"
availability: all_users
---
После создания [семантических моделей](/docs/build/semantic-models) можно приступать к добавлению метрик. На этой странице описаны поддерживаемые типы метрик, которые можно добавить в ваш проект dbt.

<VersionBlock lastVersion="1.11">
  
Метрики необходимо определять в YAML-файле &mdash; либо в том же файле, что и семантические модели, либо в отдельном YAML-файле в подкаталоге вашего проекта dbt. Их не следует определять в блоке `config` модели.

</VersionBlock>

<VersionBlock firstVersion="1.12">

Метрики можно определять в двух местах в YAML-файлах `models`:

- **Внутри семантических моделей** (в `models` -> `semantic_model` -> `metrics`) — для метрик, использующих измерения из одной семантической модели. Рекомендуется для простых метрик.
- **На верхнем уровне** (в отдельном ключе `metrics`) — для расширенных метрик (накопительных, метрик отношения, производных метрик и метрик конверсии), которые ссылаются на метрики из разных семантических моделей. Простые метрики нельзя определять на верхнем уровне.

Определяйте метрики в YAML-файлах вашего проекта dbt, а не в блоке `config` модели.

</VersionBlock>

## Параметры

Ключи параметров метрик:

<VersionBlock lastVersion="1.11">

| Parameter | Description | Required | Type |
| --------- | ----------- | ---- | ---- |
| `name` | Укажите ссылочное имя метрики. Это имя должно быть уникальным и может состоять из строчных букв, цифр и символов подчеркивания. | Required | String |
| `description` | Описание метрики. | Optional | String |
| `type` | Тип метрики: `conversion`, `cumulative`, `derived`, `ratio` или `simple`. | Required | String |
| `type_params` | Дополнительные параметры для настройки метрики. Набор `type_params` различается для каждого типа метрик. | Required | Dict |
| `label` | Обязательная строка, определяющая отображаемое имя метрики в downstream‑инструментах. Поддерживает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Required | String |
| `config` | Используйте свойство [`config`](/reference/resource-properties/config) для задания конфигурации метрики. Поддерживаются настройки [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group) и [`enabled`](/reference/resource-configs/enabled). | Optional | Dict |
| `filter` | Необязательная строка [фильтра](#filters), применяемая к измерениям, сущностям, временным измерениям или другим метрикам во время вычисления метрики. По сути, это аналог условия WHERE. | Optional | String |

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Параметр | Описание | Обязательность | Тип |
| --------- | ----------- | ---- | ---- |
| `name` | Укажите имя для ссылки на метрику. Это имя должно быть уникальным среди метрик и может состоять из строчных латинских букв, цифр и символов подчёркивания.  | Обязательный | String |
| `description` | Добавьте описание метрики.   | Необязательный | String |
| `type` | Задайте тип метрики: `conversion`, `cumulative`, `derived`, `ratio` или `simple`. | Обязательный | String |
| `label` | Определяет отображаемое значение в инструментах, использующих метрику. Допускает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`).  | Необязательный | String |
| `config` | Используйте свойство [`config`](/reference/resource-properties/config), чтобы задать настройки метрики. Поддерживаются настройки [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group), [`tags`](/reference/resource-configs/tags) и [`enabled`](/reference/resource-configs/enabled).  | Необязательный | Dict |
| `filter` | К метрике любого типа можно добавить строку [фильтра](#filters), чтобы применять фильтры к измерениям, сущностям, временным измерениям или другим метрикам при вычислении метрики. Рассматривайте её как условие WHERE.   | Необязательный | String |

</VersionBlock>

### Параметры, зависящие от типа метрики

Для каждого типа метрики предусмотрены дополнительные параметры:

- **Простые метрики**: `agg` (обязательный), `expr`, `percentile`, `percentile_type`, `non_additive_dimension`, `agg_time_dimension`, `join_to_timespine`, `fill_nulls_with`
- **Накопительные метрики**: `input_metric` (обязательный), `window`, `grain_to_date`, `period_agg`
- **Производные метрики**: `expr` (обязательный), `input_metrics` (обязательный)
- **Метрики-отношения**: `numerator` (обязательный), `denominator` (обязательный)
- **Метрики конверсии**: `entity` (обязательный), `calculation` (обязательный), `base_metric` (обязательный), `conversion_metric` (обязательный), `window`, `constant_properties`

Подробную информацию о параметрах, зависящих от типа метрики, см. в следующих разделах, посвящённых каждому типу метрик.

### Пример

Ниже приведён полный пример конфигурации спецификации метрик:

<VersionBlock lastVersion="1.11">
<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: metric name                     ## Required
    description: description               ## Optional
    type: the type of the metric          ## Required
    type_params:                          ## Required
      - specific properties for the metric type
    config:                               ## Optional
      meta:
        my_meta_config:  'config'         ## Optional
    label: The display name for your metric. This value will be shown in downstream tools. ## Required
    filter: |                             ## Optional            
      {{  Dimension('entity__name') }} > 0 and {{ Dimension(' entity__another_name') }} is not
      null and {{ Metric('metric_name', group_by=['entity_name']) }} > 5
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
      name: my_semantic_model
    
    # Define columns, dimensions, entities...
    columns:
      - name: my_column
        # column config...
    
    # Metrics defined within the semantic model
    metrics:
      - name: my_simple_metric
        description: A metric description
        type: simple
        label: My Simple Metric
        agg: sum
        expr: revenue_column  # Optional, defaults to metric name
        config:
          meta:
            owner: "@analytics_team"

# Advanced metrics that reference metrics from different semantic models
metrics:
  - name: my_advanced_cumulative_metric
    type: cumulative
    window: 1 week 
    input_metric: 
      name: my_metric_name_from_another_semantic_model
      filter: my_filter
      alias: my_metric_name_a_week_ago_in_another_semantic_model
```

</File>

</VersionBlock>

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Гранулярность по умолчанию для метрик {#default-granularity-for-metrics}

<VersionBlock lastVersion="1.11">

Для метрик можно задать детализацию по времени по умолчанию, если она отличается от детализации временных измерений, используемых по умолчанию для агрегации (`metric_time`). Это полезно, если ваше временное измерение имеет очень высокую детализацию, например до секунды или часа, но обычно вы запрашиваете метрики, агрегированные на более крупном временном интервале.

Гранулярность задается с помощью параметра `time_granularity` у метрики и по умолчанию равна `day`. Если `day` недоступен, так как измерение определено с более крупной гранулярностью, будет использована гранулярность, определенная для самого измерения.

### Пример

- У вас есть семантическая модель `orders` с временным измерением `order_time`.
- Вы хотите, чтобы метрика `orders` по умолчанию агрегировалась по месяцам (`monthly`), но при этом сохранялась возможность просматривать значения этой метрики по часам.
- Вы можете задать для параметра `time_granularity` измерения `order_time` значение `hour`, а затем для параметра `time_granularity` в метрике — значение `month`.

```yaml
semantic_models:
  ...
  dimensions:
    - name: order_time
      type: time
      type_params:
      time_granularity: hour
  measures:
    - name: orders
      expr: 1
      agg: sum

metrics:
  - name: orders
    type: simple
    label: Count of Orders
    type_params:
      measure:
        name: orders
    time_granularity: month -- Optional, defaults to day
```

</VersionBlock>

<VersionBlock firstVersion="1.12">

Задайте исходную детализацию столбца временного измерения и выбирайте детализацию агрегирования при выполнении запроса.

- Определите детализацию данных в столбце временного измерения с помощью granularity (например, час, день, месяц).
- Метрики наследуют временное измерение для агрегирования по умолчанию, заданное на уровне модели. При необходимости его можно переопределить для отдельной метрики с помощью `agg_time_dimension`.
- При выполнении запроса выбирайте детализацию агрегирования (день/неделя/месяц/год) в BI-инструменте или через [API семантического слоя](/docs/dbt-apis/sl-api-overview). Агрегировать данные можно только до уровня детализации, равного исходному уровню столбца или более крупного.

### Пример

- `order_time` хранится с почасовой детализацией.
- Метрика `orders` использует это временное измерение; вы агрегируете её по месяцам при выполнении запроса (а не в спецификации метрики).
- Вторая метрика показывает, как указать другое временное измерение с помощью `agg_time_dimension`.

<File name="models/file_name.yml">

```yaml
models:
  - name: orders
    semantic_model:
      enabled: true

    # Временное измерение для агрегирования по умолчанию на уровне модели (необязательно)
    agg_time_dimension: order_time

    columns:
      - name: order_time
        granularity: hour  # Исходная детализация столбца
        dimension:
          type: time

      - name: created_at
        granularity: day
        dimension:
          type: time

    metrics:
      - name: orders
        type: simple
        agg: count
        expr: 1
        # Здесь нет time_granularity. Агрегируйте по месяцам при выполнении запроса.

      - name: orders_by_created_day
        type: simple
        agg: count
        expr: 1
        agg_time_dimension: created_at  # Используйте другое временное измерение для этой метрики

```
</File>

</VersionBlock>

## Метрики конверсии {#conversion-metrics}

[Метрики конверсии](/docs/build/conversion) помогают отслеживать, когда для сущности происходит базовое событие и последующее событие конверсии в рамках заданного временного окна.

<VersionBlock lastVersion="1.11">

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: The metric name 
    description: The metric description 
    type: conversion 
    label: YOUR_LABEL 
    type_params: #
      conversion_type_params: 
        entity: ENTITY
        calculation: CALCULATION_TYPE 
        base_measure: 
          name: The name of the measure 
          fill_nulls_with: Set the value in your metric definition instead of null (such as zero) 
          join_to_timespine: true/false
        conversion_measure:
          name: The name of the measure 
          fill_nulls_with: Set the value in your metric definition instead of null (such as zero) 
          join_to_timespine: true/false
        window: TIME_WINDOW
        constant_properties:
          - base_property: DIMENSION or ENTITY
            conversion_property: DIMENSION or ENTITY
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
    
    # Define columns, dimensions, entities...
    
    metrics:
      - name: my_conversion_metric
        description: Conversion metric description
        type: conversion
        label: My conversion metric
        entity: my_primary_entity  # Required
        calculation: conversion_rate  # conversion_rate | conversions
        base_metric: simple_metric # Required, must refer to metric name or metric dict
        conversion_metric: my_simple_metric_that_uses_the_other_time_dimension # Required, must refer to metric name or metric dict
        window: 1 week  # Optional time window
        constant_properties:  # Optional
          - base_property: dimension_or_entity_name  # Dimension or entity from base metric's semantic model
            conversion_property: dimension_or_entity_name  # Dimension or entity from conversion metric's semantic model

# For conversion metrics referencing metrics from different semantic models
metrics:
  - name: my_advanced_conversion_metric
    config:
      group: example_group
      tags:
        - example_tag
        - another_tag
      meta:
        owner: "@docs-team"
    type: conversion
    entity: my_primary_entity # required for conversion metrics
    calculation: conversion_rate # conversion_rate | conversions # required for conversion metrics
    base_metric: my_simple_metric # str | metric dict (if filters are needed)
    conversion_metric: my_other_metric_from_another_semantic_model # str | metric dict (if filters are needed)
    window: 1 week # optional, as above
    constant_properties: # optional - DIMENSION OR ENTITY
      - base_property: my_primary_entity # Required. A reference to a dimension/entity of the semantic model linked to the base_metric
        conversion_property: another_semantic_model_categorical_dimension
```

</File>

</VersionBlock>

## Накопительные метрики

<VersionBlock lastVersion="1.11">

[Накопительные метрики](/docs/build/cumulative) агрегируют меру в пределах заданного временного окна. Если окно не задано, мера накапливается за весь период, за который имеются данные. Обратите внимание: перед добавлением накопительных метрик необходимо создать [модель временной шкалы](/docs/build/metricflow-time-spine).

<File name="models/metrics/file_name.yml" >

```yaml
# Cumulative metrics aggregate a measure over a given window. The window is considered infinite if no window parameter is passed (accumulate the measure over all of time)
metrics:
  - name: wau_rolling_7
    type: cumulative
    label: Weekly active users
    type_params:
      measure:
        name: active_users
        fill_nulls_with: 0
        join_to_timespine: true
      cumulative_type_params:
        window: 7 days
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

[Кумулятивные метрики](/docs/build/cumulative) агрегируют простую метрику за заданный период. Если период не указан, окно будет накапливать простую метрику за весь период, за который имеются данные. Обратите внимание: перед добавлением кумулятивных метрик необходимо создать [модель временной шкалы](/docs/build/metricflow-time-spine).

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
    
    # Define columns, dimensions, entities...
    
    metrics:
      - name: active_users
        type: simple
        agg: count_distinct
        expr: user_id
      
      - name: wau_rolling_7
        type: cumulative
        label: Weekly active users
        description: Rolling 7 day window of active users
        input_metric: active_users  # Required - must refer to metric name or dict
        window: 7 days  # Optional - omit for infinite window (all time)
        join_to_timespine: true  # Optional
        fill_nulls_with: 0  # Optional

# For cumulative metrics using metrics from different semantic models
metrics:
  - name: my_advanced_cumulative_metric
    type: cumulative
    label: Advanced cumulative metric
    input_metric:
      name: metric_from_another_model
      filter: "{{ Dimension('entity__dimension') }} > 0"
      alias: filtered_metric
    window: 1 week  # Optional: can specify window OR grain_to_date, not both
    # grain_to_date: month  # Alternative to window
    # period_agg: first  # Optional: first | last | average
```

</File>

</VersionBlock>

## Производные метрики {#derived-metrics}

[Производные метрики](/docs/build/derived) позволяют выполнять вычисления с использованием других метрик. Например, можно вычислить `gross_profit`, вычтя метрику `cost` из метрики `revenue`, или рассчитать рост, сравнив метрику с её значением за предыдущий период.

<VersionBlock lastVersion="1.11">

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: order_gross_profit
    description: Gross profit from each order.
    type: derived
    label: Order gross profit
    type_params:
      expr: revenue - cost
      metrics:
        - name: order_total
          alias: revenue
        - name: order_cost
          alias: cost
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
    
    # Define columns, dimensions, entities...
    
    metrics:
      - name: order_total
        type: simple
        agg: sum
        expr: order_amount
      
      - name: order_cost
        type: simple
        agg: sum
        expr: cost_amount
      
      - name: order_gross_profit
        description: Gross profit from each order
        type: derived
        label: Order gross profit
        expr: revenue - cost  # Required for derived metrics
        input_metrics:  # Required for derived metrics
          - name: order_total
            alias: revenue
          - name: order_cost
            alias: cost

# For derived metrics using metrics from different semantic models
metrics:
  - name: my_advanced_derived_metric
    type: derived
    label: Advanced derived metric
    expr: metric_a - metric_b_offset + metric_c  # Required
    input_metrics:  # Required - list of metric names or dicts
      - name: metric_a
        filter: "{{ Dimension('entity__dimension') }} > 10"
      - name: metric_b
        alias: metric_b_offset
        offset_window: 1 week  # Only allowed for derived metrics
      - name: metric_c
        offset_to_grain: month  # Only allowed for derived metrics
```

</File>

</VersionBlock>


## Метрики отношения {#ratio-metrics}

[Метрики отношения](/docs/build/ratio) включают метрику числителя и метрику знаменателя. Строку `filter` можно применить как к числителю и знаменателю одновременно, так и отдельно к числителю или знаменателю.

<VersionBlock lastVersion="1.11">

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: cancellation_rate
    type: ratio
    label: Cancellation rate
    type_params:
      numerator: cancellations
      denominator: transaction_amount
    filter: |   
      {{ Dimension('customer__country') }} = 'MX'
  - name: enterprise_cancellation_rate
    type: ratio
    type_params:
      numerator:
        name: cancellations
        filter: {{ Dimension('company__tier') }} = 'enterprise'  
      denominator: transaction_amount
    filter: | 
      {{ Dimension('customer__country') }} = 'MX' 
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
    
    # Определите столбцы, измерения, сущности...
    
    metrics:
      - name: cancellations
        type: simple
        agg: sum
      
      - name: transaction_amount
        description: Сумма транзакций
        label: Сумма транзакций
        type: simple
        agg: sum
      
      - name: cancellation_rate
        type: ratio
        label: Доля отмен
        numerator: cancellations  # Может быть строкой или словарём
        denominator: transaction_amount  # Может быть строкой или словарём
        filter: |  # Необязательно — применяется к числителю и знаменателю
          "{{ Dimension('customer__country') }} = 'MX'"
      
      - name: enterprise_cancellation_rate
        type: ratio
        label: Доля отмен для корпоративных клиентов
        numerator:
          name: cancellations
          filter: "{{ Dimension('company__tier') }} = 'enterprise'"  # Необязательно
          alias: enterprise_cancellations  # Необязательно
        denominator: transaction_amount
        filter: |  # Необязательно — применяется к числителю и знаменателю
          {{ Dimension('customer__country') }} = 'MX'

# Для метрик отношения, использующих метрики из разных семантических моделей
metrics:
  - name: my_advanced_ratio_metric
    type: ratio
    label: Расширенная метрика отношения
    numerator:
      name: metric_from_model_a
      filter: "{{ Dimension('entity__dimension') }} > 10"
      alias: filtered_numerator
    denominator:
      name: metric_from_model_b
      filter: "{{ Dimension('entity__dimension') }} < 100"
```

</File>

</VersionBlock>

## Простые метрики {#simple-metrics}

<VersionBlock lastVersion="1.11">

[Простые метрики](/docs/build/simple) напрямую ссылаются на меру. Такую метрику можно рассматривать как функцию, которая принимает на вход только одну меру.

- `name` &mdash; используется для задания ссылочного имени метрики. Имя должно быть уникальным среди всех метрик и может включать строчные буквы, цифры и символы подчеркивания. Это имя можно использовать для вызова метрики через API <Constant name="semantic_layer" />.

**Примечание:** если вы уже определили меру с помощью параметра `create_metric: True`, создавать простую метрику не требуется. Однако если вы хотите добавить дополнительное ограничение поверх меры, необходимо создать метрику типа `simple`.

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: cancellations
    description: The number of cancellations
    type: simple
    label: Cancellations
    type_params:
      measure:
        name: cancellations_usd  # Specify the measure you are creating a proxy for.
        fill_nulls_with: 0
        join_to_timespine: true
    filter: |
      {{ Dimension('order__value')}} > 100 and {{Dimension('user__acquisition')}} is not null
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

[Простые метрики](/docs/build/simple) напрямую ссылаются на выражение для одного столбца в семантической модели. Простую метрику можно рассматривать как базовый строительный блок для других метрик. Она выполняет агрегацию (например, `sum`, `count`, `average` и т. д.) по одному полю вашей модели.

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
    
    # Define columns, dimensions, entities...
    
    metrics:
      - name: cancellations
        description: The number of cancellations
        type: simple
        label: Cancellations
        agg: sum  # Required: sum | max | min | average | median | count_distinct | percentile | count | sum_boolean
        expr: cancellations_usd  # Optional, defaults to metric name
        join_to_timespine: true  # Optional
        fill_nulls_with: 0  # Optional
        filter: |  # Optional
          {{ Dimension('order__value') }} > 100 and "{{ Dimension('user__acquisition') }} is not null
      
      # Example with percentile aggregation
      - name: order_percentile
        type: simple
        label: Order 95th Percentile
        agg: percentile
        expr: order_value
        percentile: 95.0  # Required if agg is percentile
        percentile_type: discrete  # Required: discrete | continuous
      
      # Example with non-additive dimension
      - name: account_balance
        type: simple
        label: Account balance
        agg: sum
        expr: balance_amount
        non_additive_dimension:
          name: snapshot_date  # Must be a dimension
          window_agg: max  # min | max
          group_by:  # Optional - list of entity names
            - account_id
      
      # Example with config
      - name: revenue
        type: simple
        label: Total revenue
        agg: sum
        expr: revenue_amount
        config:
          meta:
            owner: "@finance_team"
            team: "Revenue analytics"
```

</File>

</VersionBlock>

## Фильтры {#filters}

Настройте фильтр с помощью шаблонов Jinja и следующего синтаксиса для ссылки на сущности, измерения, временные измерения или метрики в фильтрах.

Подробности о том, как использовать метрики в качестве измерений в фильтрах, см. в разделе [Metrics as dimensions](/docs/build/ref-metrics-in-filters):

<File name="models/metrics/file_name.yml" >

```yaml
filter: |
  {{ Entity('entity_name') }}

filter: |
  {{ Dimension('primary_entity__dimension_name') }}

filter: |
  {{ TimeDimension('time_dimension', 'granularity') }}

filter: |
 {{ Metric('metric_name', group_by=['entity_name']) }}

```

</File>

Например, если вы хотите отфильтровать данные по измерению даты заказа с группировкой по месяцам, используйте следующий синтаксис:

```yaml
filter: |
  {{ TimeDimension('order_date', 'month') }}

```

## Связанная документация

- [Semantic models](/docs/build/semantic-models)
- [Fill null values for metrics](/docs/build/fill-nulls-advanced)
- [Metrics as dimensions with metric filters](/docs/build/ref-metrics-in-filters)
