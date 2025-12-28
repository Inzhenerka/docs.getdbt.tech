---
title: "Простые метрики"
id: simple
description: "Используйте простые метрики для прямой ссылки на одну меру."
sidebar_label: Простые
tags: [Метрики, Семантический слой]
pagination_next: null
---

Простые метрики — это метрики, которые напрямую ссылаются на одну меру, без участия дополнительных мер. Они представляют собой агрегации по столбцу в вашей платформе данных и могут быть отфильтрованы по одному или нескольким измерениям.

Параметры, описание и тип для простых метрик:

:::tip
Обратите внимание, что мы используем точечную нотацию (`.`), чтобы указать, что один параметр вложен в другой параметр. Например, `measure.name` означает, что параметр `name` вложен в `measure`.
:::


| Параметр | Описание | Обязательно | Тип |
| --------- | ----------- | ---- | ---- |
| `name` | Имя метрики. | Required | String |
| `description` | Описание метрики. | Optional | String |
| `type` | Тип метрики (cumulative, derived, ratio или simple). | Required | String |
| `label` | Определяет отображаемое значение в downstream‑инструментах. Принимает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Required | String |
| `type_params` | Параметры типа метрики. | Required | Dict |
| `measure` | Список входных measure. | Required | List |
| `measure.name` | Measure, на которую вы ссылаетесь. | Required | String |
| `measure.alias` | Необязательный [`alias`](/reference/resource-configs/alias) для переименования measure. | Optional | String |
| `measure.filter` | Необязательный `filter`, применяемый к measure. | Optional | String |
| `measure.fill_nulls_with` | Задает значение в определении метрики вместо null (например, ноль). | Optional | Integer |
| `measure.join_to_timespine` | Указывает, нужно ли присоединять агрегированную measure к таблице time spine для заполнения отсутствующих дат. По умолчанию `false`. | Optional | Boolean |

Ниже представлена полная спецификация для простых метрик, а также пример.

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

Для продвинутого моделирования данных вы можете использовать `fill_nulls_with` и `join_to_timespine`, чтобы [установить значения null метрик в ноль](/docs/build/fill-nulls-advanced), обеспечивая числовые значения для каждой строки данных.

<!-- create_metric пока не поддерживается
:::tip

Если вы уже определили measure с помощью параметра `create_metric: true`, вам не нужно создавать simple metrics. Однако если вы хотите включить фильтр в итоговую метрику, вам нужно будет определить и создать simple metric.
:::
-->

## Пример простых метрик

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

## Связанные документы
- [Заполнение значений null для простых, производных или относительных метрик](/docs/build/fill-nulls-advanced)