---
title: "Простые метрики"
id: simple
description: "Используйте простые метрики для агрегации данных непосредственно из столбцов ваших семантических моделей."
sidebar_label: Простые
tags: [Metrics, Semantic Layer]
pagination_next: null
availability: all_users
---

<VersionBlock lastVersion="1.11">
Простые метрики — это метрики, которые напрямую ссылаются на одну меру без использования дополнительных мер. Они представляют собой агрегации по столбцу на вашей платформе данных и могут фильтроваться по одному или нескольким измерениям.

Параметры, описание и тип простых метрик:

:::tip
Обратите внимание, что мы используем точечную нотацию (`.`), чтобы указать, что один параметр вложен в другой параметр. Например, `measure.name` означает, что параметр `name` вложен в `measure`.
:::


| Параметр | Описание | Обязательно | Тип |
| --------- | ----------- | ---- | ---- |
| `name` | Имя метрики. Оно должно быть уникальным в пределах проекта и может содержать строчные буквы, цифры и символы подчёркивания. Используйте это имя для обращения к метрике через API <Constant name="semantic_layer" />. | Обязательный | String |
| `description` | Описание метрики. | Необязательный | String |
| `type` | Тип метрики (cumulative, derived, ratio или simple). | Обязательный | String |
| `label` | Задаёт отображаемое значение в инструментах, использующих метрику. Допускает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Обязательный | String |
| `type_params` | Параметры типа метрики. | Обязательный | Dict |
| `measure` | Список входных мер. | Обязательный | List |
| `measure.name` | Мера, на которую вы ссылаетесь. | Обязательный | String |
| `measure.alias` | Необязательный [`alias`](/reference/resource-configs/alias) для переименования меры. | Необязательный | String |
| `measure.filter` | Необязательный `filter`, применяемый к мере. | Необязательный | String |
| `measure.fill_nulls_with` | Задаёт в определении метрики значение для замены null (например, ноль). | Необязательный | Integer |
| `measure.join_to_timespine` | Указывает, следует ли присоединять агрегированную меру к таблице временной шкалы, чтобы заполнить отсутствующие даты. По умолчанию — `false`. | Необязательный | Boolean |

</VersionBlock>

<VersionBlock firstVersion="1.12">

Простые метрики — это метрики, которые напрямую ссылаются на выражение одного столбца в семантической модели, без участия дополнительных столбцов. Они представляют собой агрегации по столбцу на вашей платформе данных и могут фильтроваться по одному или нескольким измерениям.

Параметры простых метрик, их описания и типы:

| Параметр | Описание | Обязательность | Тип |
| --------- | ----------- | ---- | ---- |
| `name` | Имя метрики. Оно должно быть уникальным в пределах проекта и может содержать строчные буквы, цифры и символы подчёркивания. Используйте это имя для обращения к метрике через API <Constant name="semantic_layer" />. | Обязательный | String |
| `description` | Описание метрики. | Необязательный | String |
| `type` | Тип метрики (cumulative, derived, ratio или simple). | Обязательный | String |
| `label` | Задаёт отображаемое значение в инструментах, использующих метрику. Допускает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Необязательный | String |
| `agg` | Используемая функция агрегации. Используйте `sum`,  `max`,  `min`,  `average`,  `median`, `count`, `count_distinct`,  `percentile` и `sum_boolean`.| Обязательный | String |
| `expr` | Используемое выражение, например имя столбца. По умолчанию используется имя метрики. | Необязательный | String |
| `percentile` | Используемый процентиль. Обязателен, если `agg` имеет значение `percentile`. | Необязательный | Integer |
| `percentile_type` | Используемый тип процентиля. Используйте `discrete` или `continuous`. Обязателен для метрик `percentile`. | Необязательный | String |
| `non_additive_dimension` | Используемое неаддитивное измерение. | Необязательный | String |
| `agg_time_dimension` | Используемое временное измерение. | Необязательный | String |
| `join_to_timespine` | Указывает, следует ли присоединять агрегированную меру к таблице временной шкалы, чтобы заполнить отсутствующие даты. По умолчанию — `false`. | Необязательный | Boolean |
| `fill_nulls_with` | Задаёт в определении метрики значение для замены null (например, ноль). | Необязательный | Integer |

</VersionBlock>

Ниже приведена полная спецификация простых метрик вместе с примером.


<VersionBlock lastVersion="1.11">

```yaml
metrics:
  - name: Имя метрики # Обязательный
    description: Описание метрики # Необязательный
    type: simple # Обязательный
    label: Значение, которое будет отображаться в инструментах нижнего уровня # Обязательный
    type_params: # Обязательный
      measure: 
        name: Имя вашей меры # Обязательный
        alias: Псевдоним, применяемый к мере. # Необязательный
        filter: Фильтр, применяемый к мере. # Необязательный
        fill_nulls_with: Установите значение вместо null (например, ноль) # Необязательный
        join_to_timespine: true/false # Логический параметр, указывающий, должна ли агрегированная мера быть присоединена к таблице временной шкалы для заполнения отсутствующих дат. # Необязательный

```

</VersionBlock>

<VersionBlock firstVersion="1.12">

Обратите внимание: простые метрики необходимо определять в YAML-записи семантической модели.

```yaml
models: 
  - name: my_model
    semantic_model: 
      enabled: true
     ...
    metrics:
      - name: my_simple_metric # Обязательно
        description: The metric description # Необязательно
        label: My simple metric label # Необязательно
        type: simple  # Обязательно
        agg: count_distinct # Обязательно: sum | max | min | average | median | count_distinct | percentile и sum_boolean
        expr: case when is_a then 1 else 0 end # Необязательно для простой метрики; по умолчанию используется имя метрики
        join_to_timespine: true
        fill_nulls_with: 0

      - name: my_simple_metric_that_uses_the_other_time_dimension
        description: The metric description
        label: My simple metric that uses the other time dimension label
        type: simple
        agg: count_distinct
        agg_time_dimension: my_other_time_dimension_column # Необязательно, если используется не временное измерение по умолчанию
```

</VersionBlock>

Для расширенного моделирования данных можно использовать `fill_nulls_with` и `join_to_timespine`, чтобы [заменять значения null в метриках нулями](/docs/build/fill-nulls-advanced), обеспечивая числовые значения для каждой строки данных.

<!-- create_metric пока не поддерживается
:::tip

Если вы уже определили measure с помощью параметра `create_metric: true`, вам не нужно создавать simple metrics. Однако если вы хотите включить фильтр в итоговую метрику, вам нужно будет определить и создать simple metric.
:::
-->

## Пример простых метрик {#simple-metrics-example}

<VersionBlock lastVersion="1.11">

```yaml
  metrics: 
    - name: customers
      description: Количество клиентов
      type: simple # Указатель на меру, созданную в семантической модели
      label: Количество клиентов
      type_params:
        measure: 
          name: customers # Мера, для которой вы создаете прокси.
          fill_nulls_with: 0 
          join_to_timespine: true
          alias: customer_count
          filter: {{ Dimension('customer__customer_total') }} >= 20
    - name: large_orders
      description: "Заказы с суммой заказа более 20."
      type: simple
      label: Большие заказы
      type_params:
        measure: 
          name: orders
      filter: | # Для любой метрики вы можете дополнительно включить фильтр по значениям измерений
        {{Dimension('customer__order_total_dim')}} >= 20
```

</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
  metrics:
    - name: customers
      description: Количество клиентов
      type: simple
      label: Количество клиентов
      agg: count
      expr: customers 
      fill_nulls_with: 0
      join_to_timespine: true
      filter: "{{ Dimension('customer__customer_total') }} >= 20"
      # alias не поддерживается для простых метрик 
      # используйте alias в input_metrics при ссылке на эту метрику в производных метриках, метриках отношения или конверсии

    - name: large_orders
      description: "Заказ со стоимостью более 20."
      type: simple
      label: Крупные заказы
      agg: count
      expr: orders 
      filter: "{{ Dimension('customer__order_total_dim') }} >= 20"
```

</VersionBlock>

## Связанная документация
- [Заполнение значений null для простых, производных метрик или метрик отношения](/docs/build/fill-nulls-advanced)
