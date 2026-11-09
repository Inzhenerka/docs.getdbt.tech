---
title: "Производные метрики"
id: derived
description: "Производные метрики определяются как выражение, использующее другие метрики"
sidebar_label: Производные
tags: [Metrics, Semantic Layer]
availability: all_users
---

В MetricFlow производные метрики создаются путем определения выражения с использованием других метрик. Они позволяют выполнять вычисления с существующими метриками. Это полезно для комбинирования метрик и выполнения математических функций на агрегированных столбцах, например, для создания метрики прибыли.

Параметры, описание и тип для производных метрик: 

<VersionBlock lastVersion="1.11">

| Параметр | Описание | Обязательный | Тип | 
| --------- | ----------- | ---- | ---- |
| `name` | Имя метрики. | Обязательный | Строка |  
| `description` | Описание метрики. | Необязательный | Строка |
| `type` | Тип метрики (cumulative, derived, ratio или simple). | Обязательный | Строка |  
| `label` | Определяет отображаемое значение в инструментах, использующих эту метрику. Допускает обычный текст, пробелы и кавычки (например, `'orders_total'` или `"orders_total"`). |Обязательный | Строка |
| `type_params` | Параметры типа метрики. | Обязательный | Словарь |  
| `expr` | Выражение для вычисления производной метрики. При проверке появятся предупреждения, если у производной метрики отсутствует `expr` или  если `expr` использует не все входные метрики. | Обязательный | Строка |
| `metrics` |  Список метрик, используемых в производных метриках. Каждая запись может включать необязательные поля, такие как `alias`, `filter` или `offset_window`. | Обязательный  | Список |  
| `alias` | Необязательный псевдоним метрики, который можно использовать в `expr`. | Необязательный | Строка |
| `filter` | Необязательный фильтр, применяемый к метрике. | Необязательный | Строка |  
| `offset_window` | Задает период окна смещения, например 1 месяц. В этом случае возвращается значение метрики со смещением на один месяц относительно времени метрики.  | Необязательный | Строка |

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Параметр | Описание | Обязательность | Тип | 
| --------- | ----------- | ---- | ---- |
| `name` | Имя метрики. | Обязательный | Строка |  
| `description` | Краткое описание метрики в удобочитаемом виде. | Необязательный | Строка |
| `type` | Тип метрики (`simple`, `cumulative`, `ratio`, `derived` или `conversion`). | Обязательный | Строка |  
| `label` | Отображаемое имя для инструментов, использующих эту метрику. Допускает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Необязательный | Строка |
| `expr` | Выражение, объединяющее другие метрики. При проверке появится предупреждение, если оно отсутствует или ссылается на неопределенные метрики. | Обязательный | Строка |
| `input_metrics` | Определяет псевдонимы, фильтры или смещения для метрик, на которые ссылается выражение. Требуется только при настройке этих атрибутов. | Необязательный | Список |
| `input_metrics.name` | Имя метрики, на которую ссылается выражение и которая определена в другом месте проекта. | Обязательный, если указан `metric_aliases` | Строка |
| `input_metrics.alias` | Альтернативное имя, которое можно использовать в `expr`. | Необязательный | Строка |
| `input_metrics.filter` | Фильтр, применяемый к метрике, на которую ссылается выражение. | Необязательный | Строка |  
| `input_metrics.offset_window` | Смещение, применяемое к метрике, на которую ссылается выражение (например, `1 week`). Допускается только для производных метрик.  | Необязательный | Строка |

</VersionBlock>

Ниже приведена полная спецификация производных метрик вместе с примером.

<VersionBlock lastVersion="1.11">

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

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name='models/model.yml'>

```yaml
metrics:
  - name: my_derived_metric
    description: cool derived metric # Optional
    label: my derived metric label # Optional
    type: derived # Required 
    expr: my_simple_metric - my_simple_metric_a_week_ago # Required for derived
    input_metrics: # Required for derived if using aliases / filters / offset_window for portions of the expression
      - name: my_simple_metric
        alias: my_simple_metric_a_week_ago
        filter: "{{ Dimension('my_primary_entity__my_categorical_dimension_column') }} > 10"
        offset_window: 1 week # Allowed for derived metrics
```
</File>
</VersionBlock>


Для расширенного моделирования данных можно использовать `fill_nulls_with` и `join_to_timespine`, чтобы [заменять значения null в метриках нулями](/docs/build/fill-nulls-advanced), обеспечивая числовые значения для каждой строки данных.

## Пример производных метрик {#derived-metrics-example}

<VersionBlock lastVersion="1.11">

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

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name='models/model.yml'>

```yaml
models:
  - name: fct_orders
    semantic_model:
      enabled: true
      name: order
    ... rest of config ...
    metrics:
      - name: order_gross_profit
        description: "Валовая прибыль от каждого заказа."
        label: Валовая прибыль от заказа
        type: derived
        expr: revenue - cost
        input_metrics:
          - name: order_total
            alias: revenue
          - name: order_cost
            alias: cost
      - name: food_order_gross_profit
        label: Валовая прибыль от заказа еды
        description: "Валовая прибыль от каждого заказа еды."
        type: derived
        expr: revenue - cost
        input_metrics:
          - name: order_total
            alias: revenue
            filter: |
              {{ Dimension('order__is_food_order') }} = True
          - name: order_cost
            alias: cost
            filter: |
              {{ Dimension('order__is_food_order') }} = True
      - name: order_total_growth_mom
        description: "Рост общей суммы заказов в процентах по сравнению с предыдущим месяцем"
        label: Рост общей суммы заказов, % м/м
        type: derived
        expr: (order_total - order_total_prev_month) * 100 / order_total_prev_month
        input_metrics:
          - name: order_total
          - name: order_total
            alias: order_total_prev_month
            offset_window: 1 month
```
</File>

</VersionBlock>

## Временное смещение производной метрики {#derived-metric-offset}

Чтобы выполнять вычисления, используя значение метрики из предыдущего периода времени, вы можете добавить параметр смещения к производной метрике. Например, если вы хотите рассчитать рост за период или отслеживать удержание пользователей, вы можете использовать это смещение метрики.

**Примечание:** Вы должны включить [измерение `metric_time`](/docs/build/dimensions#time) при запросе производной метрики с окном смещения.

Следующий пример показывает, как можно рассчитать ежемесячный рост выручки, используя окно смещения в 1 месяц:

<VersionBlock lastVersion="1.11">

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

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name='models/model.yml'>

```yaml
models:
  - name: customers
    semantic_model:
      enabled: true
      name: customers_semantic_model
    metrics:
      - name: customer_retention
        description: Процентное соотношение клиентов, активных сейчас, и клиентов, активных 1 месяц назад
        label: customer_retention
        type: derived
        expr: current_active_customers / active_customers_prev_month
        input_metrics:
          - name: active_customers
            alias: current_active_customers
          - name: active_customers
            alias: active_customers_prev_month
            offset_window: 1 month
```
</File>
</VersionBlock>

### Окна смещения и детализация

Вы можете запрашивать любую комбинацию гранулярности и окна смещения. Следующий пример запрашивает метрику с 7-дневным смещением и месячной гранулярностью:

<VersionBlock lastVersion="1.11">

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

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name='models/model.yml'>

```yaml
models:
  - name: customers
    semantic_model:
      enabled: true
      name: customers_semantic_model
    ... rest of config ...
    metrics:
      - name: d7_booking_change
        description: Разница между текущим количеством бронирований и количеством бронирований 7 дней назад
        type: derived
        label: Изменение бронирований за 7 дней
        expr: current_bookings - bookings_7_days_ago
        input_metrics:
          - name: bookings
            alias: current_bookings
          - name: bookings
            offset_window: 7 days
            alias: bookings_7_days_ago
```
</File>
</VersionBlock>

Когда вы выполняете запрос `dbt sl query --metrics d7_booking_change --group-by metric_time__month` для этой метрики, она рассчитывается следующим образом. Для <Constant name="core" /> можно использовать префикс `mf query`. 

1. Получите исходный неагрегированный набор данных с указанными <VersionBlock lastVersion="1.11">мерой</VersionBlock><VersionBlock firstVersion="1.12">простой метрикой</VersionBlock> и измерениями на самом детальном уровне, которым в настоящее время является день ('day').
2. Затем выполните соединение со смещением для ежедневного набора данных, после чего выполните усечение дат и агрегацию до запрошенного уровня детализации.
   Например, чтобы рассчитать `d7_booking_change` за июль 2017 года: 
   - Сначала просуммируйте все значения бронирований за каждый день июля, чтобы рассчитать метрику bookings.
   - В следующей таблице показан диапазон дней, составляющих эту месячную агрегацию.

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