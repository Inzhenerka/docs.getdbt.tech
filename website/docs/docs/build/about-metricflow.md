---
title: "О MetricFlow"
id: about-metricflow
description: "Узнайте больше о MetricFlow и его ключевых концепциях"
sidebar_label: О MetricFlow
tags: [Метрики, Семантический слой]
pagination_next: "docs/build/join-logic"
pagination_prev: null
availability: all_users
---

Это руководство знакомит с базовыми идеями MetricFlow для тех, кто только начинает работать с этой функциональностью. MetricFlow, который лежит в основе <Constant name="semantic_layer" />, помогает определять и управлять логикой метрик в вашей компании. Это набор абстракций с чётко заданным подходом, который помогает потребителям данных быстро и эффективно получать датасеты метрик из платформы данных.

MetricFlow отвечает за построение SQL-запросов и определяет спецификацию семантических моделей и метрик dbt. Он позволяет определять метрики в проекте dbt и запрашивать их с помощью [команд MetricFlow](/docs/build/metricflow-commands) как в <Constant name="dbt" />, так и в <Constant name="core" />.


## Предварительные требования
Прежде чем начать, ознакомьтесь со следующими рекомендациями:

<VersionBlock lastVersion="1.11">

- Определяйте метрики в YAML и запрашивайте их, используя эти [новые спецификации метрик](https://github.com/dbt-labs/dbt/discussions/7456).
- Для использования MetricFlow необходима [версия dbt](/docs/dbt-versions/upgrade-dbt-platform-version) 1.6 или выше. 
- Используйте MetricFlow со Snowflake, BigQuery, Databricks, Postgres (только в <Constant name="core" />), Trino или Redshift. 
- Получайте аналитические выводы и запрашивайте метрики с помощью [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) и широкого набора [доступных интеграций](/docs/platform-integrations/avail-sl-integrations). 

</VersionBlock>

<VersionBlock firstVersion="1.12">

- Определяйте метрики в YAML и запрашивайте их, используя [актуальные спецификации метрик](/docs/build/semantic-models).
- Доступно в [<Constant name="fusion_engine"/>](/docs/local/install-dbt) или [dbt Latest](/docs/dbt-versions/dbt-release-tracks) на платформе <Constant name="dbt_platform" />.
- Используйте MetricFlow со Snowflake, BigQuery, Databricks, Postgres (только в <Constant name="core" />) или Redshift. 
- Получайте аналитические выводы и запрашивайте метрики с помощью [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) и широкого набора [доступных интеграций](/docs/platform-integrations/avail-sl-integrations).

</VersionBlock>

## MetricFlow {#metricflow}

MetricFlow — это инструмент генерации SQL-запросов, предназначенный для упрощения создания метрик в различных разрезах данных для разнообразных бизнес-задач. 
- Он работает с YAML-файлами, в которых семантический граф связывает язык с данными. Этот граф состоит из [семантических моделей](/docs/build/semantic-models) (точек доступа к данным) и [метрик](/docs/build/metrics-overview) (функций для создания количественных показателей).
- MetricFlow разрабатывается и поддерживается dbt Labs и работает с форматом [Apache Ossie](https://github.com/apache/ossie). Начиная с <Constant name="dbt" /> v1.12, вы также можете определять семантические модели с помощью [документов Ossie](/docs/build/ossie-semantic-models) в качестве альтернативы собственной конфигурации dbt в формате YAML.
- MetricFlow совместим с dbt версии 1.6 и выше.
- MetricFlow распространяется по [лицензии Apache 2.0](https://github.com/dbt-labs/metricflow/blob/main/LICENSE). Мы приветствуем участие специалистов по работе с данными и энтузиастов в развитии проекта. Подробнее об [истории лицензирования MetricFlow](https://github.com/dbt-labs/metricflow?tab=readme-ov-file#license-history). 
- Как часть <Constant name="semantic_layer" />, MetricFlow позволяет организациям определять метрики с помощью абстракций на основе YAML.
- Для запроса измерений метрик и значений измерений, а также проверки конфигураций используйте [команды MetricFlow](/docs/build/metricflow-commands).

:::note
В настоящее время MetricFlow не поддерживает [встроенные функции или пакеты dbt](/reference/dbt-jinja-functions/builtins), однако поддержка планируется в будущем.
:::

- **Гибкость с полнотой**: Определяйте логику метрик, используя гибкие абстракции на любой модели данных.
- **DRY (Don't Repeat Yourself)**: Минимизируйте избыточность, позволяя определять метрики, где это возможно.
- **Простота с постепенной сложностью**: Подходите к MetricFlow, используя знакомые концепции моделирования данных.
- **Производительность и эффективность**: Оптимизируйте производительность, поддерживая централизованную инженерию данных и распределенное владение логикой.

### Семантический граф {#semantic-graph}

Мы вводим новую концепцию: "семантический граф". Это отношение между семантическими моделями и конфигурациями YAML, которое создает ландшафт данных для построения метрик. Вы можете думать о нем как о карте, где таблицы подобны местам, а связи между ними (ребра) подобны дорогам. Хотя это скрыто, семантический граф является подмножеством <Term id="dag" />, и вы можете видеть семантические модели как узлы на DAG.

Семантический граф помогает нам решить, какая информация доступна для использования и какая нет. Связи между таблицами в семантическом графе больше касаются отношений между информацией. Это отличается от DAG, где связи показывают зависимости между задачами.

Когда MetricFlow генерирует метрику, он использует свой SQL-движок, чтобы определить лучший путь между таблицами, используя фреймворк, определенный в YAML-файлах для семантических моделей и метрик. Когда эти модели и метрики правильно определены, они могут быть использованы далее с интеграциями семантического слоя dbt.

Когда MetricFlow генерирует метрику, он использует свой SQL‑движок, чтобы определить оптимальный путь между таблицами, опираясь на фреймворк, заданный в YAML‑файлах семантических моделей и метрик. Если эти модели и метрики определены корректно, их можно использовать далее вместе с интеграциями <Constant name="semantic_layer" />.

### Семантические модели {#semantic-models}

Семантические модели — это отправные точки для работы с вашими данными, которые соответствуют моделям в вашем проекте dbt. На основе каждой модели можно создать несколько семантических моделей. Семантические модели, как и таблицы данных, содержат метаданные, которые определяют важную информацию, например имя таблицы и первичные ключи, необходимую для корректного обхода графа.

* [Сущности](/docs/build/entities): Ключи соединения вашей семантической модели (их можно представить как пути обхода или рёбра между семантическими моделями).
* [Измерения](/docs/build/dimensions): Способы группировки метрик или формирования их срезов.
<VersionBlock lastVersion="1.11">
* [Меры](/docs/build/measures): Функции агрегации, которые возвращают числовой результат и могут использоваться для создания метрик.
</VersionBlock>
<VersionBlock firstVersion="1.12">
* [Простые метрики](/docs/build/simple): Метрики, которые напрямую ссылаются на выражение с одним столбцом в семантической модели, без участия дополнительных столбцов.
</VersionBlock>

<VersionBlock lastVersion="1.11">
<Lightbox src="/img/docs/dbt-platform/semantic-layer/semantic_foundation.jpg" width="70%" title="Семантическая модель состоит из различных компонентов: сущностей, мер и измерений."/>
</VersionBlock>

### Метрики {#metrics}

<VersionBlock lastVersion="1.11">
Метрики — одно из ключевых понятий — представляют собой функции, которые объединяют меры, ограничения или другие математические функции для определения новых количественных показателей. MetricFlow использует меры и различные типы агрегации, такие как среднее, сумма и количество уникальных значений, для создания метрик. Измерения добавляют контекст метрикам, а без них метрика — это просто число за всё время. Вы можете определять метрики в тех же YAML-файлах, что и семантические модели, или создать новый файл.
</VersionBlock>

<VersionBlock firstVersion="1.12">
Метрики — одно из ключевых понятий — представляют собой функции, которые объединяют простые метрики, ограничения или другие математические функции для определения новых количественных показателей. MetricFlow использует различные типы агрегации, такие как среднее, сумма и количество уникальных значений, для создания метрик. Измерения добавляют контекст метрикам, а без них метрика — это просто число за всё время. Вы можете определять метрики в тех же YAML-файлах, что и семантические модели, или создать новый файл.
</VersionBlock>

<VersionBlock lastVersion="1.11">

- [Конверсионная](/docs/build/conversion): Отслеживает, когда для сущности происходят базовое событие и последующее событие конверсии в течение заданного периода времени.
- [Накопительная](/docs/build/cumulative): Агрегирует меру в пределах заданного окна.
- [Производная](/docs/build/derived): Определяет метрику как выражение на основе других метрик, что позволяет выполнять вычисления с использованием метрик.
- [Отношение](/docs/build/ratio): Определяет метрику как отношение двух мер, например выручку на одного клиента.
- [Простая](/docs/build/simple): Определяет метрику, которая напрямую ссылается на одну меру.
</VersionBlock>

<VersionBlock firstVersion="1.12">
- [Конверсионная](/docs/build/conversion): Отслеживает, когда для сущности происходят базовое событие и последующее событие конверсии в течение заданного периода времени.
- [Накопительная](/docs/build/cumulative): Агрегирует простую метрику в пределах заданного окна.
- [Производная](/docs/build/derived): Определяет метрику как выражение на основе других метрик, что позволяет выполнять вычисления с использованием метрик.
- [Отношение](/docs/build/ratio): Определяет метрику как отношение двух простых метрик, например выручку на одного клиента.
- [Простая](/docs/build/simple): Определяет метрику, которая напрямую ссылается на одно выражение столбца в семантической модели.
</VersionBlock>

## Пример использования {#use-case}

В следующих разделах мы покажем, как специалисты по данным в настоящее время рассчитывают метрики и сравним это с тем, как MetricFlow упрощает и делает более гибким определение метрик.

Следующий пример данных основан на репозитории Jaffle Shop. Вы можете просмотреть полный [проект dbt](https://github.com/dbt-labs/jaffle-sl-template). Таблицы, которые мы используем в нашем примерной модели:

- `orders` — это экспорт производственной платформы данных, который был очищен и организован для аналитического потребления.
- `customers` — это частично денормализованная таблица в данном случае с колонкой, полученной из таблицы заказов через некоторый процесс на более высоком уровне.

Чтобы сделать объяснение более наглядным, рассмотрим метрику `order_total`, которая определяется с помощью SQL-выражения:

`select sum(order_total) as order_total from orders` 
Это выражение вычисляет общую выручку по всем заказам, суммируя значения столбца `order_total` в таблице orders. В бизнес-контексте метрику `order_total` часто рассчитывают в различных разрезах, например:
- По времени, например `date_trunc(ordered_at, 'day')`
- По типу заказа, используя измерение `is_food_order` из таблицы `orders`

### Расчет метрик {#calculate-metrics}

Далее мы сравним, как специалисты по данным в настоящее время рассчитывают метрики с помощью нескольких запросов, и как MetricFlow упрощает и оптимизирует этот процесс.

<Tabs>
<TabItem value="mulqueries" label="Расчет с помощью нескольких запросов">

Следующий пример показывает, как специалисты по данным обычно рассчитывают метрику `order_total` в агрегированном виде. Также вероятно, что аналитиков просят предоставить больше деталей по метрике, например, сколько дохода поступило от новых клиентов.

Использование следующего запроса создает ситуацию, когда несколько аналитиков работают с одними и теми же данными, каждый используя свой метод запроса &mdash; это может привести к путанице, несоответствиям и головной боли для управления данными.

```sql
select
    date_trunc('day',orders.ordered_at) as day, 
    case when customers.first_ordered_at is not null then true else false end as is_new_customer,
    sum(orders.order_total) as order_total
from
  orders
left join
  customers
on
  orders.customer_id = customers.customer_id
group by 1, 2
```

</TabItem>
<TabItem value="metricflow" label="Расчет с помощью MetricFlow">

В следующих трёх вкладках с примерами используйте MetricFlow, чтобы определить семантическую модель, в которой `order_total` используется как метрика, и пример схемы для получения согласованных и точных результатов &mdash; это позволит избежать путаницы и дублирования кода, а также оптимизировать рабочий процесс.

<Tabs>
<TabItem value="example1" label="Пример дохода">

<VersionBlock lastVersion="1.11">

В этом примере мера с именем `order_total` определена на основе столбца order_total в таблице `orders`. 

Временное измерение `metric_time` обеспечивает детализацию по дням и может агрегироваться по неделям или месяцам. Кроме того, в семантической модели `customers` задано категориальное измерение `is_new_customer`.
```yaml
semantic_models:
  - name: orders    # Имя семантической модели
    description: |
      Модель, содержащая данные о заказах. Зерно таблицы — это идентификатор заказа.
    model: ref('orders') # Имя модели и схемы dbt
    defaults:
      agg_time_dimension: metric_time
    entities: # Сущности, которые обычно соответствуют ключам в таблице.
      - name: order_id
        type: primary
      - name: customer
        type: foreign
        expr: customer_id
    measures:   # Меры, которые являются агрегациями на колонках в таблице.
      - name: order_total
        agg: sum
    dimensions: # Измерения могут быть категориальными или временными. Они добавляют дополнительный контекст к метрикам, и типичный шаблон запроса — Метрика по Измерению.
      - name: metric_time
        expr: cast(ordered_at as date)
        type: time
        type_params:
          time_granularity: day
  - name: customers    # Имя второй семантической модели
    description: >
      Таблица измерений клиентов. Зерно таблицы — одна строка на клиента.
    model: ref('customers') # Имя модели и схемы dbt
    defaults:
      agg_time_dimension: first_ordered_at
    entities: # Сущности, которые обычно соответствуют ключам в таблице.
      - name: customer 
        type: primary
        expr: customer_id
    dimensions: # Измерения могут быть категориальными или временными. Они добавляют дополнительный контекст к метрикам, и типичный шаблон запроса — Метрика по Измерению.
      - name: is_new_customer
        type: categorical
        expr: case when first_ordered_at is not null then true else false end
      - name: first_ordered_at
        type: time
        type_params:
          time_granularity: day
```
</VersionBlock>

<VersionBlock firstVersion="1.12">

В этом примере простая метрика `order_total` определена на основе модели `orders` и соответствующей семантической модели. Она суммирует значения столбца `order_total`. Временное измерение `metric_time` задаёт дневную детализацию. Результаты можно агрегировать по неделям или месяцам.

В семантической модели `customers` также определено производное категориальное измерение `is_new_customer`. Оно возвращает `true`, если значение `first_ordered_at` не равно `null`, и `false` в остальных случаях.

```yaml
models:
  - name: orders    # The name of the model
    semantic_model:
      enabled: true
      name: orders_semantic_model
    
    agg_time_dimension: metric_time # Default aggregation time dimension
    
    columns:
      # Primary entity - order_id
      - name: order_id
        description: "Primary key for orders table"
        entity:
          type: primary
          name: order_id
          label: "Order ID"
      
      # Foreign entity - customer
      - name: customer_id
        description: "Foreign key linking to customers"
        entity:
          type: foreign
          name: customer
          label: "Customer"
      
      # Time dimension - metric_time
      - name: ordered_at
        granularity: day
        dimension:
          type: time
          label: "Order Date"
          description: "Date when the order was placed"
    
    metrics:
      # Simple metric for order total revenue
      - name: order_total
        description: "Total revenue from orders"
        label: "Order Total Revenue"
        type: simple
        agg: sum
        expr: order_total

  - name: customers    # The customers model with semantic layer constructs defined
    semantic_model:
      enabled: true
      name: customers_semantic_model
    
    agg_time_dimension: first_ordered_at
    
    columns:
      # Primary entity - customer
      - name: customer_id
        description: "Primary key for customers table"
        entity:
          type: primary
          name: customer
          label: "Customer"
      
      # Time dimension - first_ordered_at
      - name: first_ordered_at
        description: "Date of customer's first order"
        granularity: day
        dimension:
          type: time
          name: first_ordered_at
          label: "First Order Date"
```
</VersionBlock>

</TabItem>
<TabItem value="example2" label="Пример с дополнительными измерениями">

Аналогичным образом вы можете добавлять в свои семантические модели дополнительные измерения, например `is_food_order`, чтобы анализировать выручку `order_total` в ещё большем количестве разрезов. 

<VersionBlock lastVersion="1.11">

```yaml
semantic_models:
  - name: orders
    description: |
      Модель, содержащая данные о заказах. Зерно таблицы — это идентификатор заказа.
    model: ref('orders')  # Имя модели и схемы dbt
    defaults:
      agg_time_dimension: metric_time
    entities: # Сущности, которые обычно соответствуют ключам в таблице
      - name: order_id
        type: primary
      - name: customer
        type: foreign
        expr: customer_id
    measures: # Меры, которые являются агрегациями на колонках в таблице.
      - name: order_total
        agg: sum
    dimensions: # Измерения могут быть категориальными или временными. Они добавляют дополнительный контекст к метрикам, и типичный шаблон запроса — Метрика по Измерению.
      - name: metric_time
        expr: cast(ordered_at as date)
        type: time
        type_params:
          time_granularity: day
      - name: is_food_order
        type: categorical
```
</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
models:
  - name: orders    # The name of the semantic model
    semantic_model:
      enabled: true
      name: orders_semantic_model
    
    agg_time_dimension: metric_time # Default aggregation time dimension
    
    columns:
      # Primary entity - order_id
      - name: order_id
        description: "Primary key for orders table"
        entity:
          type: primary
          name: order_id
          label: "Order ID"
      
      # Foreign entity - customer
      - name: customer_id
        description: "Foreign key linking to customers"
        entity:
          type: foreign
          name: customer
          label: "Customer"
      
      # Time dimension - metric_time
      - name: ordered_at
        description: "Date when the order was placed"
        granularity: day
        dimension:
          type: time
          name: metric_time
          label: "Order Date"
      
      # Categorical dimension - is_food_order
      - name: is_food_order
        description: "Indicates if this is a food order"
        dimension:
          type: categorical
          name: is_food_order
          label: "Is Food Order"
    
    metrics:
      # Simple metric for order total revenue
      - name: order_total
        description: "Total revenue from orders"
        label: "Order Total Revenue"
        type: simple
        agg: sum
        expr: order_total
```

</VersionBlock>

</TabItem>
<TabItem value="example3" label="Продвинутый пример">

Представим, что нужна ещё более сложная метрика, например сумма ежедневной выручки от заказов еды, сделанных постоянными клиентами. Без MetricFlow исходный SQL-запрос специалиста по данным мог бы выглядеть так:

```sql
select
    date_trunc('day',orders.ordered_at) as day, 
    sum(case when is_food_order = true then order_total else null end) as food_order,
    sum(orders.order_total) as sum_order_total,
    food_order/sum_order_total
from
  orders
left join
  customers
on
  orders.customer_id = customers.customer_id
where
  case when customers.first_ordered_at is not null then true else false end = true
group by 1
```

MetricFlow упрощает работу с SQL с помощью конфигураций метрик в формате YAML, как показано ниже. Вы также можете сохранить их в своём git-репозитории, чтобы все участники команд по работе с данными и бизнес-команд могли просматривать и утверждать их в качестве единого достоверного источника информации.

<VersionBlock lastVersion="1.11">

```yaml
metrics:
  - name: food_order_pct_of_order_total_returning
    description: Доход от заказов на еду от возвращающихся клиентов
    label: "Процент еды от общего заказа"
    type: ratio
    type_params:
      numerator: food_order
      denominator: order_total
    filter: |
      {{ Dimension('customer__is_new_customer') }} = false
```
</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
models:
  - name: orders    
    semantic_model:
      enabled: true
      name: orders_semantic_model
    
    agg_time_dimension: ordered_at # Default aggregation time dimension
    
    columns:
      # Primary entity - order_id
      - name: order_id
        description: "Primary key for orders table"
        entity:
          type: primary
          name: order_id
          label: "Order ID"
      
      # Foreign entity - customer
      - name: customer_id
        description: "Foreign key linking to customers"
        entity:
          type: foreign
          name: customer
          label: "Customer"
      
      # Time dimension - ordered_at
      - name: ordered_at
        description: "Date when the order was placed"
        granularity: day
        dimension:
          type: time
          label: "Order Date"
      
      # Categorical dimension - is_food_order
      - name: is_food_order
        description: "Indicates if this is a food order"
        dimension:
          type: categorical
          name: is_food_order
          label: "Is Food Order"
    
    metrics:
      # Simple metric for total order revenue
      - name: order_total
        description: "Total revenue from orders"
        label: "Order Total Revenue"
        type: simple
        agg: sum
        expr: order_total
      
      # Simple metric for food order revenue
      - name: food_revenue
        description: "Revenue from food orders only"
        label: "Food order revenue"
        type: simple
        agg: sum
        expr: "case when is_food_order = true then order_total else 0 end"

      # Simple metric for count of distinct customers in orders
      - name: total_customers
        description: "Count of unique customers with orders"
        label: "Total customers"
        type: simple
        agg: count_distinct
        expr: customer_id

  - name: customers    # The name of the second semantic model
    semantic_model:
      enabled: true
      name: customers_semantic_model
    
    agg_time_dimension: first_ordered_at
    
    columns:
      # Primary entity - customer
      - name: customer_id
        description: "Primary key for customers table"
        entity:
          type: primary
          name: customer
          label: "Customer"
      
      # Time dimension - first_ordered_at
      - name: first_ordered_at
        description: "Date of customer's first order"
        granularity: day
        dimension:
          type: time
          name: first_ordered_at
          label: "First Order Date"

metrics:
  - name: food_revenue_per_customer
    description: "Revenue from food orders from returning customers"
    label: "Food % of order total"
    type: ratio
    numerator:
      name: food_revenue
    denominator:
      name: total_customers
```

</VersionBlock>

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## Часто задаваемые вопросы {#faqs}

<DetailsToggle alt_header="Нужно ли нормализовать мои наборы данных?">

Вовсе нет! Хотя очищенный и хорошо смоделированный набор данных может быть чрезвычайно полезным и идеально подходит в качестве входных данных, вы можете использовать любые наборы данных — от необработанных до полностью денормализованных.

Рекомендуется обеспечивать качество и согласованность данных на уровне вышестоящих приложений — например, отфильтровывать некорректные данные, нормализовать общие объекты, а также выполнять моделирование ключей и таблиц. <Constant name="semantic_layer" /> более эффективен для денормализации данных, чем для их нормализации.

Если вы пока не инвестировали в обеспечение согласованности данных, это не проблема. <Constant name="semantic_layer" /> позволяет использовать SQL‑запросы или выражения для определения согласованных наборов данных.

</DetailsToggle>

<DetailsToggle alt_header="Почему нормализованные данные являются идеальным входом?">

MetricFlow создан для эффективной денормализации. Существуют лучшие инструменты для обработки сырых наборов данных и выполнения различных задач, необходимых для построения согласованности данных и организованных моделей данных. С другой стороны, вводя денормализованные данные, вы потенциально создаете избыточность, которую технически сложно управлять, и уменьшаете потенциальную детализацию, которую MetricFlow может использовать для агрегации метрик.
</DetailsToggle>
<VersionBlock lastVersion="1.11">
<DetailsToggle alt_header="Почему бы просто не сделать метрики тем же самым, что и меры?">
Один из принципов MetricFlow — сокращать дублирование логики. Этот принцип также называют Don't Repeat Yourself (DRY), или «Не повторяйся».

Многие метрики создаются на основе повторно используемых мер, а в некоторых случаях — на основе мер из разных семантических моделей. Это позволяет создавать метрики по принципу «сначала в ширину» (метрики, которые могут использоваться самостоятельно), а не «сначала в глубину» (когда несколько метрик вычисляются как функции других метрик).

Кроме того, не все метрики строятся на основе мер. Например, метрика конверсии, вероятно, определяется наличием или отсутствием записи события после некоторой другой записи события.

</DetailsToggle>
</VersionBlock>
<DetailsToggle alt_header="Как dbt Semantic Layer обрабатывает соединения?">
Слой dbt <Constant name="semantic_layer" />, работающий на базе MetricFlow, строит соединения на основе типов ключей и параметров, передаваемых сущностям. Чтобы лучше понять, как строятся соединения, см. документацию о [типах соединений](/docs/build/join-logic#types-of-joins).

Вместо того чтобы фиксировать произвольную логику соединений, MetricFlow фиксирует типы каждого идентификатора, а затем помогает пользователям выбирать подходящие соединения. Это позволяет избегать соединений с разветвлением (fan out) и соединений с разрывом (chasm), а также генерировать понятный SQL.
</DetailsToggle>

<DetailsToggle alt_header="Являются ли сущности и ключи соединения одним и тем же?">
Если вам помогает думать о сущностях как о ключах соединения, это вполне разумно. Сущности в MetricFlow имеют применение за пределами соединения двух таблиц, например, действуя как измерение.
</DetailsToggle>

<DetailsToggle alt_header="Может ли таблица без первичной или уникальной сущности иметь измерения?">
Да, но поскольку измерение считается атрибутом первичной или уникальной сущности таблицы, такие измерения можно использовать только с метриками, определёнными в этой таблице. Их нельзя соединять с метриками из других таблиц. Такая ситуация часто встречается в журналах событий.
</DetailsToggle>

## Связанные документы {#related-docs}
- [Соединения](/docs/build/join-logic)
- [Валидации](/docs/build/validation)
-
