---
title: Создание метрик
id: metrics-overview
description: "Метрики могут быть определены в тех же YAML-файлах, что и семантические модели, или в отдельных YAML-файлах в любых других подкаталогах в пределах одного репозитория проекта dbt."
sidebar_label: "Создание метрик"
tags: [Metrics, Semantic Layer]
pagination_next: "docs/build/cumulative"
---

После того как вы создали свои семантические модели, пора начать добавлять метрики. Метрики могут быть определены в тех же YAML-файлах, что и ваши семантические модели, или разделены на отдельные YAML-файлы в любых других подкаталогах (при условии, что эти подкаталоги также находятся в пределах одного репозитория проекта dbt).

Эта статья объясняет различные поддерживаемые типы метрик, которые вы можете добавить в свой проект dbt. Ключи для определения метрик:

<!-- для v1.8 и выше -->

<VersionBlock firstVersion="1.8">

| Параметр | Описание | Обязательный | Тип |
| --------- | ----------- | ---- | ---- |
| `name` | Укажите ссылочное имя для метрики. Это имя должно быть уникальным и может состоять из строчных букв, цифр и подчеркиваний.  | Обязательный | Строка |
| `description` | Опишите вашу метрику.   | Необязательный | Строка |
| `type` | Определите тип метрики, который может быть `conversion`, `cumulative`, `derived`, `ratio` или `simple`. | Обязательный | Строка |
| `type_params` | Дополнительные параметры, используемые для настройки метрик. `type_params` различаются для каждого типа метрики. | Обязательный | Словарь |
| `label` | Обязательная строка, определяющая отображаемое значение в инструментах нижнего уровня. Принимает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`).  | Обязательный | Строка |
| `config` | Используйте свойство [`config`](/reference/resource-properties/config) для указания конфигураций для вашей метрики. Поддерживает конфигурации [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group) и [`enabled`](/reference/resource-configs/enabled).  | Необязательный | Словарь |
| `filter` | Вы можете дополнительно добавить строку [фильтра](#filters) к любому типу метрики, применяя фильтры к измерениям, сущностям, временным измерениям или другим метрикам во время вычисления метрики. Рассматривайте это как ваш WHERE-клауз.   | Необязательный | Строка |

Вот полный пример конфигурации спецификации метрик:

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: metric name                     ## Обязательный
    description: description               ## Необязательный
    type: the type of the metric          ## Обязательный
    type_params:                          ## Обязательный
      - specific properties for the metric type
    config:                               ## Необязательный
      meta:
        my_meta_config:  'config'         ## Необязательный
    label: The display name for your metric. This value will be shown in downstream tools. ## Обязательный
    filter: |                             ## Необязательный            
      {{  Dimension('entity__name') }} > 0 and {{ Dimension(' entity__another_name') }} is not
      null and {{ Metric('metric_name', group_by=['entity_name']) }} > 5
```

</File>
</VersionBlock>

<!-- для v1.7 и ниже -->

<VersionBlock lastVersion="1.7">

| Параметр | Описание | Обязательный | Тип  |
| --------- | ----------- | ---- | ---- |
| `name` | Укажите ссылочное имя для метрики. Это имя должно быть уникальным среди всех метрик.   | Обязательный | Строка |
| `description` | Опишите вашу метрику.   | Необязательный | Строка |
| `type` | Определите тип метрики, который может быть `simple`, `ratio`, `cumulative` или `derived`.  | Обязательный | Строка |
| `type_params` | Дополнительные параметры, используемые для настройки метрик. `type_params` различаются для каждого типа метрики. | Обязательный | Словарь |
| `config` | Укажите конкретные конфигурации для вашей метрики.   | Необязательный | Словарь |
| `meta` | Используйте конфигурацию [`meta`](/reference/resource-configs/meta) для установки метаданных для ресурса.  | Необязательный | Строка |
| `label` | Обязательная строка, определяющая отображаемое значение в инструментах нижнего уровня. Принимает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`).   | Обязательный | Строка |
| `filter` | Вы можете дополнительно добавить строку фильтра к любому типу метрики, применяя фильтры к измерениям, сущностям или временным измерениям во время вычисления метрики. Рассматривайте это как ваш WHERE-клауз.   | Необязательный | Строка |

Вот полный пример конфигурации спецификации метрик:

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: metric name                     ## Обязательный
    description: same as always           ## Необязательный
    type: the type of the metric          ## Обязательный
    type_params:                          ## Обязательный
      - specific properties for the metric type
    config: here for `enabled`            ## Необязательный
    meta:
        my_meta_direct: 'direct'           ## Необязательный
    label: The display name for your metric. This value will be shown in downstream tools. ## Обязательный
    filter: |                             ## Необязательный            
      {{  Dimension('entity__name') }} > 0 and {{ Dimension(' entity__another_name') }} is not
      null and {{ Metric('metric_name', group_by=['entity_name']) }} > 5
```
</File>

</VersionBlock>

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Гранулярность по умолчанию для метрик

<VersionBlock lastVersion="1.8">
Гранулярность времени по умолчанию для метрик полезна, если ваше временное измерение имеет очень мелкую гранулярность, например, секунду или час, но вы обычно запрашиваете метрики, свернутые на более грубой гранулярности.

Гранулярность времени по умолчанию для метрик доступна сейчас в [последней версии в dbt Cloud](/docs/dbt-versions/cloud-release-tracks), и она будет доступна в [dbt Core v1.9+](/docs/dbt-versions/core-upgrade/upgrading-to-v1.9).

</VersionBlock>

<VersionBlock firstVersion="1.9">

Можно определить гранулярность времени по умолчанию для метрик, если она отличается от гранулярности временных измерений агрегации по умолчанию (`metric_time`). Это полезно, если ваше временное измерение имеет очень мелкую гранулярность, например, секунду или час, но вы обычно запрашиваете метрики, свернутые на более грубой гранулярности.

Гранулярность может быть установлена с помощью параметра `time_granularity` для метрики и по умолчанию равна `day`. Если день недоступен, потому что измерение определено на более грубой гранулярности, оно будет по умолчанию использовать определенную гранулярность для измерения.

### Пример
У вас есть семантическая модель под названием `orders` с временным измерением под названием `order_time`. Вы хотите, чтобы метрика `orders` по умолчанию сворачивалась до `monthly`, однако вы хотите иметь возможность просматривать эти метрики по часам. Вы можете установить параметр `time_granularity` для измерения `order_time` на `hour`, а затем установить параметр `time_granularity` в метрике на `month`.
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
      time_granularity: month -- Необязательный, по умолчанию day
```
</VersionBlock>

## Метрики конверсии

[Метрики конверсии](/docs/build/conversion) помогают отслеживать, когда базовое событие и последующее событие конверсии происходят для сущности в течение заданного периода времени.

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

## Кумулятивные метрики

[Кумулятивные метрики](/docs/build/cumulative) агрегируют измерение за заданное окно. Если окно не указано, оно будет накапливать измерение за весь записанный период времени. Обратите внимание, что вам нужно будет создать [модель временной шкалы](/docs/build/metricflow-time-spine) перед добавлением кумулятивных метрик.

<File name="models/metrics/file_name.yml" >

```yaml
# Кумулятивные метрики агрегируют измерение за заданное окно. Окно считается бесконечным, если параметр окна не передан (накапливает измерение за все время)
metrics:
  - name: wau_rolling_7
    type: cumulative
    label: Weekly active users
    type_params:
      measure:
        name: active_users
        fill_nulls_with: 0
        join_to_timespine: true
        window: 7 days
```
</File>

## Производные метрики

[Производные метрики](/docs/build/derived) определяются как выражение других метрик. Производные метрики позволяют выполнять вычисления на основе метрик.

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

## Метрики отношения

[Метрики отношения](/docs/build/ratio) включают числитель и знаменатель. Строка `filter` может быть применена как к числителю и знаменателю вместе, так и отдельно к числителю или знаменателю.

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

## Простые метрики

[Простые метрики](/docs/build/simple) указывают непосредственно на измерение. Вы можете рассматривать это как функцию, которая принимает только одно измерение в качестве входных данных.

- `name` &mdash; Используйте этот параметр для определения ссылочного имени метрики. Имя должно быть уникальным среди метрик и может включать строчные буквы, цифры и подчеркивания. Вы можете использовать это имя для вызова метрики из API семантического слоя dbt.

**Примечание:** Если вы уже определили измерение с использованием параметра `create_metric: True`, вам не нужно создавать простые метрики. Однако, если вы хотите включить ограничение поверх измерения, вам нужно будет создать метрику простого типа.

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: cancellations
    description: The number of cancellations
    type: simple
    label: Cancellations
    type_params:
      measure:
        name: cancellations_usd  # Укажите измерение, для которого вы создаете прокси.
        fill_nulls_with: 0
    filter: |
      {{ Dimension('order__value')}} > 100 and {{Dimension('user__acquisition')}} is not null
    join_to_timespine: true
```
</File>

## Фильтры

Фильтр настраивается с использованием шаблонов Jinja. Используйте следующий синтаксис для ссылки на сущности, измерения, временные измерения или метрики в фильтрах.

Обратитесь к [Метрики как измерения](/docs/build/ref-metrics-in-filters) для получения подробной информации о том, как использовать метрики как измерения с фильтрами метрик:

<VersionBlock firstVersion="1.8">

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
</VersionBlock>

<VersionBlock lastVersion="1.7">


<File name="models/metrics/file_name.yml" >

```yaml
filter: | 
  {{ Entity('entity_name') }}

filter: |  
  {{ Dimension('primary_entity__dimension_name') }}

filter: |  
  {{ TimeDimension('time_dimension', 'granularity') }}

```
</File>
</VersionBlock>

Например, если вы хотите отфильтровать по дате заказа, сгруппированной по месяцам, используйте следующий синтаксис:

```yaml
filter: |  
  {{ TimeDimension('order_date', 'month') }}

```

## Дополнительная конфигурация

Вы можете установить больше метаданных для ваших метрик, которые могут быть использованы другими инструментами позже. Способ использования этих метаданных будет варьироваться в зависимости от конкретного партнера по интеграции.

- **Описание** &mdash; Напишите подробное описание метрики.

## Связанные документы

- [Семантические модели](/docs/build/semantic-models)
- [Заполнение нулевых значений для метрик](/docs/build/fill-nulls-advanced)
- [Метрики как измерения с фильтрами метрик](/docs/build/ref-metrics-in-filters)