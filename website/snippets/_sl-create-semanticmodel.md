Следующие шаги описывают, как настроить семантические модели. Семантические модели состоят из [сущностей](/docs/build/entities), [измерений](/docs/build/dimensions) и [мер](/docs/build/measures).

Мы настоятельно рекомендуем вам прочитать обзор того, что такое [семантическая модель](/docs/build/semantic-models), прежде чем начать. Если вы работаете с [примером Jaffle shop](https://github.com/dbt-labs/jaffle-sl-template), удалите конфигурацию `orders.yml` или удалите расширение .yml, чтобы оно игнорировалось при разборе. **Мы будем восстанавливать его шаг за шагом в этом примере.**

Если вы следуете руководству в своем собственном проекте, выберите модель, из которой вы хотите создать семантический манифест, и заполните значения конфигурации соответствующим образом.

1. Создайте новый YAML‑файл конфигурации для модели orders, например `orders.yml`.

Лучше всего создавать семантические модели в каталоге `/models/semantic_models` вашего проекта. Семантические модели вложены под ключом `semantic_models`. Сначала заполните имя и соответствующие метаданные, сопоставьте его с моделью в вашем проекте dbt и укажите значения по умолчанию для модели. На данный момент `default_agg_time_dimension` является единственным поддерживаемым значением по умолчанию.

```yaml
semantic_models:
  # Имя семантической модели.
  - name: orders
    defaults:
      agg_time_dimension: ordered_at
    description: |
      Таблица фактов заказов. Эта таблица на уровне заказа с одной строкой на заказ.
    # Имя модели dbt и схема
    model: ref('orders')
  ```

2. Определите ваши сущности. Это ключи в вашей таблице, которые MetricFlow будет использовать для соединения с другими семантическими моделями. Обычно это такие столбцы, как `customer_id`, `order_id` и так далее.

```yaml
  # Сущности. Обычно они соответствуют ключам в таблице.
    entities:
      - name: order_id
        type: primary
      - name: location
        type: foreign
        expr: location_id
      - name: customer
        type: foreign
        expr: customer_id
  ```

3. Определите ваши измерения и меры. Измерения — это свойства записей в вашей таблице, которые не подлежат агрегации. Они предоставляют категориальный или временной контекст для обогащения метрик. Меры — это строительные блоки для создания метрик. Это числовые столбцы, которые MetricFlow агрегирует для создания метрик.

```yaml
    # Меры. Это агрегации по столбцам в таблице.
    measures: 
      - name: order_total
        description: Общий доход по каждому заказу.
        agg: sum
      - name: order_count
        expr: 1
        agg: sum
      - name: tax_paid
        description: Общая сумма налога, уплаченного по каждому заказу.
        agg: sum
      - name: customers_with_orders
        description: Уникальное количество клиентов, размещающих заказы
        agg: count_distinct
        expr: customer_id
      - name: locations_with_orders
        description: Уникальное количество мест с заказами
        expr: location_id
        agg: count_distinct
      - name: order_cost
        description: Стоимость каждого элемента заказа. Стоимость рассчитывается как сумма стоимости поставки для каждого элемента заказа.
        agg: sum
  # Измерения. Либо категориальные, либо временные. Они добавляют дополнительный контекст к метрикам. Типичный шаблон запроса — Метрика по Измерению.
    dimensions:
      - name: ordered_at
        type: time
        type_params:
          time_granularity: day 
      - name: order_total_dim
        type: categorical
        expr: order_total
      - name: is_food_order
        type: categorical
      - name: is_drink_order
        type: categorical  
```

Объединяя все вместе, полная конфигурация семантической модели на основе модели заказа будет выглядеть следующим образом:

```yaml
semantic_models:
  # Имя семантической модели.
  - name: orders
    defaults:
      agg_time_dimension: ordered_at
    description: |
      Таблица фактов заказов. Эта таблица на уровне заказа с одной строкой на заказ.
    # Имя модели dbt и схема
    model: ref('orders')
# Сущности. Обычно они соответствуют ключам в таблице.
    entities:
      - name: order_id
        type: primary
      - name: location
        type: foreign
        expr: location_id
      - name: customer
        type: foreign
        expr: customer_id
    # Меры. Это агрегации по столбцам в таблице.
    measures: 
      - name: order_total
        description: Общий доход по каждому заказу.
        agg: sum
      - name: order_count
        expr: 1
        agg: sum
      - name: tax_paid
        description: Общая сумма налога, уплаченного по каждому заказу.
        agg: sum
      - name: customers_with_orders
        description: Уникальное количество клиентов, размещающих заказы
        agg: count_distinct
        expr: customer_id
      - name: locations_with_orders
        description: Уникальное количество мест с заказами
        expr: location_id
        agg: count_distinct
      - name: order_cost
        description: Стоимость каждого элемента заказа. Стоимость рассчитывается как сумма стоимости поставки для каждого элемента заказа.
        agg: sum
    # Измерения. Либо категориальные, либо временные. Они добавляют дополнительный контекст к метрикам. Типичный шаблон запроса — Метрика по Измерению.
    dimensions:
      - name: ordered_at
        type: time
        type_params:
          time_granularity: day 
      - name: order_total_dim
        type: categorical
        expr: order_total
      - name: is_food_order
        type: categorical
      - name: is_drink_order
        type: categorical  
```

:::tip
Если вы знакомы с написанием SQL, вы можете думать об измерениях как о столбцах, по которым вы бы группировали, а о мерах как о столбцах, которые вы бы агрегировали.

```sql
select
  metric_time_day,  -- время
  country,  -- категориальное измерение
  sum(revenue_usd) -- мера
from
```sql
snowflake.fact_transactions  -- SQL-таблица
group by metric_time_day, country  -- измерения
```
  ```

:::