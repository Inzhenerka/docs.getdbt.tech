---
title: "Производные метрики"
id: derived
description: "Производные метрики определяются как выражение других метрик."
sidebar_label: Производные
tags: [Метрики, Семантический слой]
---

В MetricFlow производные метрики создаются путем определения выражения с использованием других метрик. Они позволяют выполнять вычисления с существующими метриками. Это полезно для комбинирования метрик и выполнения математических функций на агрегированных столбцах, например, для создания метрики прибыли.

Параметры, описание и тип для производных метрик:

| Параметр | Описание | Обязательный | Тип | 
| --------- | ----------- | ---- | ---- |
| `name` | Имя метрики. | Обязательный | Строка |  
| `description` | Описание метрики. | Необязательный | Строка |
| `type` | Тип метрики (накопительный, производный, отношение или простой). | Обязательный | Строка |  
| `label` | Определяет отображаемое значение в инструментах нижнего уровня. Принимает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Обязательный | Строка |
| `type_params` | Параметры типа метрики. | Обязательный | Dict |  
| `expr` | Производное выражение. Вы увидите предупреждения о проверке, если в производной метрике отсутствует `expr` или `expr` не использует все входные метрики. | Обязательный | Строка |
| `metrics` | Список метрик, используемых в производных метриках. Каждая запись может включать необязательные поля, такие как `alias`, `filter` или `offset_window`. | Обязательный  | Список |  
| `alias` | Необязательный псевдоним для метрики, который можно использовать в `expr`. | Необязательный | Строка |
| `filter` | Необязательный фильтр для применения к метрике. | Необязательный | Строка |  
| `offset_window` | Установите период для окна смещения, например, 1 месяц. Это вернет значение метрики через месяц от времени метрики.  | Необязательный | Строка |

Ниже представлена полная спецификация для производных метрик вместе с примером.

```yaml
metrics:
  - name: the metric name # Обязательный
    description: the metric description # Необязательный
    type: derived # Обязательный
    label: The value that will be displayed in downstream tools #Обязательный
    type_params: # Обязательный
      expr: the derived expression # Обязательный
      metrics: # Список метрик, используемых в производных метриках # Обязательный
        - name: the name of the metrics. must reference a metric you have already defined # Обязательный
          alias: optional alias for the metric that you can use in the expr # Необязательный
          filter: optional filter to apply to the metric # Необязательный
          offset_window: set the period for the offset window, such as 1 month. This will return the value of the metric one month from the metric time. # Необязательный
```

Для продвинутого моделирования данных вы можете использовать `fill_nulls_with` и `join_to_timespine`, чтобы [установить нулевые значения метрик в ноль](/docs/build/fill-nulls-advanced), обеспечивая числовые значения для каждой строки данных.

## Пример производных метрик {#derived-metrics-example}

```yaml
metrics:
  - name: order_gross_profit
    description: Валовая прибыль с каждого заказа.
    type: derived
    label: Order gross profit
    type_params:
      expr: revenue - cost
      metrics:
        - name: order_total
          alias: revenue
        - name: order_cost
          alias: cost
  - name: food_order_gross_profit
    label: Food order gross profit
    description: "Валовая прибыль для каждого заказа на еду."
    type: derived
    type_params:
      expr: revenue - cost
      metrics:
        - name: order_total
          alias: revenue
          filter: |
            {{ Dimension('order__is_food_order') }} = True
        - name: order_cost
          alias: cost
          filter: |
            {{ Dimension('order__is_food_order') }} = True
  - name: order_total_growth_mom
    description: "Процентный рост общего количества заказов по сравнению с 1 месяцем назад"
    type: derived
    label: Order total growth % M/M
    type_params:
      expr: (order_total - order_total_prev_month)*100/order_total_prev_month
      metrics: 
        - name: order_total
        - name: order_total
          offset_window: 1 month
          alias: order_total_prev_month
```

## Смещение производной метрики {#derived-metric-offset}

Чтобы выполнять вычисления, используя значение метрики из предыдущего периода времени, вы можете добавить параметр смещения к производной метрике. Например, если вы хотите рассчитать рост за период или отслеживать удержание пользователей, вы можете использовать это смещение метрики.

**Примечание:** Вы должны включить [измерение `metric_time`](/docs/build/dimensions#time) при запросе производной метрики с окном смещения.

Следующий пример показывает, как можно рассчитать ежемесячный рост выручки, используя окно смещения в 1 месяц:

```yaml
- name: customer_retention
  description: Процент клиентов, которые активны сейчас и были активны 1 месяц назад
  label: customer_retention
  type_params:
    expr: (active_customers/ active_customers_prev_month)
    metrics:
      - name: active_customers
        alias: current_active_customers
      - name: active_customers
        offset_window: 1 month
        alias: active_customers_prev_month
```

### Окна смещения и гранулярность {#offset-windows-and-granularity}

Вы можете запрашивать любую комбинацию гранулярности и окна смещения. Следующий пример запрашивает метрику с 7-дневным смещением и месячной гранулярностью:

```yaml
- name: d7_booking_change
  description: Разница между бронированиями сейчас и 7 дней назад
  type: derived
  label: d7 bookings change
  type_params:
    expr: bookings - bookings_7_days_ago
    metrics:
      - name: bookings
        alias: current_bookings
      - name: bookings
        offset_window: 7 days
        alias: bookings_7_days_ago
```

Когда вы выполняете запрос `dbt sl query --metrics d7_booking_change --group-by metric_time__month` для метрики, вот как он рассчитывается. Для dbt Core вы можете использовать префикс `mf query`.

1. Получите необработанный, неагрегированный набор данных с указанными мерами и измерениями на самом низком уровне детализации, который в настоящее время является 'днем'.
2. Затем выполните смещенное соединение на ежедневном наборе данных, после чего выполните усечение даты и агрегацию до запрашиваемой гранулярности.
   Например, чтобы рассчитать `d7_booking_change` за июль 2017 года:
   - Сначала сложите все значения бронирования за каждый день июля, чтобы рассчитать метрику бронирования.
   - Следующая таблица показывает диапазон дней, составляющих эту месячную агрегацию.

|   | Заказы | Время метрики |
| - | ---- | -------- |
|   | 330 | 2017-07-31 |
|   | 7030 | 2017-07-30 до 2017-07-02 |
|   | 78 | 2017-07-01 |
| Итого  | 7438 | 2017-07-01 |

3. Рассчитайте бронирования за июль с 7-дневным смещением. Следующая таблица показывает диапазон дней, составляющих эту месячную агрегацию. Обратите внимание, что месяц начинается на 7 дней позже (смещен на 7 дней) 2017-07-24.

|   | Заказы | Время метрики |
| - | ---- | -------- |
|   | 329 | 2017-07-24 |
|   | 6840 | 2017-07-23 до 2017-06-30 |
|   | 83 | 2017-06-24 |
| Итого  | 7252 | 2017-07-01 |

4. Наконец, рассчитайте производную метрику и верните окончательный набор результатов:

```bash
bookings - bookings_7_days_ago будет вычислено как 7438 - 7252 = 186. 
```

| d7_booking_change | metric_time__month |
| ----------------- | ------------------ |
| 186 | 2017-07-01 |

## Связанные документы {#related-docs}
- [Заполнение нулевых значений для простых, производных или относительных метрик](/docs/build/fill-nulls-advanced)