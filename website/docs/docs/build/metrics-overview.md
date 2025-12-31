---
title: Создание метрик
id: metrics-overview
description: "Метрики могут быть определены в тех же YAML-файлах, что и семантические модели, или в отдельных YAML-файлах в рамках одного репозитория dbt-проекта."
sidebar_label: "Создание метрик"
tags: [Metrics, Semantic Layer]
pagination_next: "docs/build/cumulative"
---
  
После создания [семантических моделей](/docs/build/semantic-models) можно переходить к добавлению метрик. На этой странице описаны поддерживаемые типы метрик, которые вы можете добавить в свой dbt‑проект.

Метрики должны быть определены в YAML‑файле — либо в том же файле, что и семантические модели, либо в отдельном YAML‑файле в поддиректории вашего dbt‑проекта. Их не следует определять в блоке `config` модели.

Ключи, используемые для определения метрик:

| Parameter | Description | Required | Type |
| --------- | ----------- | ---- | ---- |
| `name` | Укажите ссылочное имя метрики. Это имя должно быть уникальным и может состоять из строчных букв, цифр и символов подчеркивания. | Required | String |
| `description` | Описание метрики. | Optional | String |
| `type` | Тип метрики: `conversion`, `cumulative`, `derived`, `ratio` или `simple`. | Required | String |
| `type_params` | Дополнительные параметры для настройки метрики. Набор `type_params` различается для каждого типа метрик. | Required | Dict |
| `label` | Обязательная строка, определяющая отображаемое имя метрики в downstream‑инструментах. Поддерживает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Required | String |
| `config` | Используйте свойство [`config`](/reference/resource-properties/config) для задания конфигурации метрики. Поддерживаются настройки [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group) и [`enabled`](/reference/resource-configs/enabled). | Optional | Dict |
| `filter` | Необязательная строка [фильтра](#filters), применяемая к измерениям, сущностям, временным измерениям или другим метрикам во время вычисления метрики. По сути, это аналог условия WHERE. | Optional | String |

Ниже приведен полный пример конфигурации спецификации метрик:

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

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Гранулярность по умолчанию для метрик {#default-granularity-for-metrics}

<VersionBlock firstVersion="1.9">

Можно задать гранулярность времени по умолчанию для метрик, если она отличается от гранулярности временного измерения агрегации по умолчанию (`metric_time`). Это полезно, если временное измерение имеет очень мелкую детализацию (например, секунды или часы), но обычно метрики запрашиваются на более крупном уровне агрегации.

Гранулярность задается с помощью параметра `time_granularity` у метрики и по умолчанию равна `day`. Если `day` недоступен, так как измерение определено с более крупной гранулярностью, будет использована гранулярность, определенная для самого измерения.

### Пример {#example}
- У вас есть семантическая модель `orders` с временным измерением `order_time`.
- Вы хотите, чтобы метрика `orders` по умолчанию агрегировалась помесячно (`monthly`), но при этом оставалась возможность анализировать данные почасово.
- Для этого можно задать параметр `time_granularity` измерения `order_time` как `hour`, а затем указать `time_granularity` у метрики как `month`.

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

Помните, что метрики могут быть определены в тех же YAML‑файлах, что и семантические модели, но должны находиться в отдельной секции верхнего уровня и не быть вложенными в ключ `semantic_models`. Также вы можете определять метрики в отдельных YAML‑файлах, расположенных в любых поддиректориях того же репозитория dbt‑проекта.

</VersionBlock>

## Метрики конверсии {#conversion-metrics}

[Метрики конверсии](/docs/build/conversion) помогают отслеживать, когда для сущности происходит базовое событие и последующее событие конверсии в рамках заданного временного окна.

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

## Кумулятивные метрики {#cumulative-metrics}

[Кумулятивные метрики](/docs/build/cumulative) агрегируют меру в рамках заданного окна. Если окно не указано, агрегация выполняется за весь доступный период времени. Обратите внимание, что перед добавлением кумулятивных метрик необходимо создать [модель временной шкалы (time spine)](/docs/build/metricflow-time-spine).

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

## Производные метрики {#derived-metrics}

[Производные метрики](/docs/build/derived) определяются как выражения на основе других метрик. Они позволяют выполнять вычисления поверх уже существующих метрик.

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

<!-- not supported
### Метрики выражений {#expression-metrics}
Используйте [expression metrics](/docs/build/expr), когда вы создаёте метрику, которая включает SQL-выражение из нескольких мер.

```yaml
# Expression metric
metrics:
  name: revenue_usd
  type: expr # Expression metrics allow you to pass in any valid SQL expression.
  type_params:
    expr: transaction_amount_usd - cancellations_usd + alterations_usd # Define the SQL expression 
    measures: # Define all the measures that are to be used in this expression metric 
      - transaction_amount_usd
      - cancellations_usd
      - alterations_usd
```
-->

## Относительные метрики (Ratio metrics) {#ratio-metrics}

[Относительные метрики](/docs/build/ratio) состоят из метрики‑числителя и метрики‑знаменателя. Строка `filter` может быть применена как к числителю и знаменателю одновременно, так и отдельно к каждому из них.

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

## Простые метрики {#simple-metrics}

[Простые метрики](/docs/build/simple) напрямую указывают на меру. Их можно рассматривать как функцию, принимающую одну меру в качестве входных данных.

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

## Фильтры {#filters}

Фильтр настраивается с использованием шаблонов Jinja. Используйте следующий синтаксис для ссылки на сущности, измерения, временные измерения или метрики в фильтрах.

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

## Дополнительная конфигурация {#further-configuration}

Вы можете задать дополнительную метаинформацию для метрик, которая в дальнейшем может использоваться другими инструментами. Способ использования этих данных зависит от конкретной интеграции.

- **Description** &mdash; подробное описание метрики.

## Связанные материалы {#related-docs}

- [Semantic models](/docs/build/semantic-models)
- [Fill null values for metrics](/docs/build/fill-nulls-advanced)
- [Metrics as dimensions with metric filters](/docs/build/ref-metrics-in-filters)
