---
title: "Кумулятивные метрики"
id: cumulative
description: "Используйте кумулятивные метрики для агрегации измерения за заданный период."
sidebar_label: Кумулятивные
tags: [Метрики, Семантический слой]
---

Кумулятивные метрики агрегируют измерение за заданный период накопления. Если окно не указано, оно считается бесконечным и накапливает значения за все время. Вам нужно будет создать [модель временной оси](/docs/build/metricflow-time-spine) перед добавлением кумулятивных метрик.

Кумулятивные метрики полезны для расчета таких показателей, как еженедельные активные пользователи или доход с начала месяца. Параметры, описание и типы для кумулятивных метрик следующие:

:::tip
Обратите внимание, что мы используем точечную нотацию (`.`), чтобы показать, что один параметр вложен в другой. Например, `measure.name` означает, что параметр `name` вложен в параметр `measure`.
:::

## Параметры {#parameters}

<VersionBlock firstVersion="1.9">

| Параметр   | <div style={{width:'350px'}}>Описание</div>   | Обязательный | Тип      |
|-------------|---------------------------------------------------|----------|-----------|
| `name`  | Имя метрики. | Required | String |
| `description` | Описание метрики. | Optional | String |
| `type` | Тип метрики (cumulative, derived, ratio или simple). | Required | String |  
| `label` | Обязательная строка, определяющая отображаемое значение в downstream‑инструментах. Поддерживает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Required | String |
| `type_params` | Параметры типа метрики. Поддерживаются вложенные параметры, указываемые с помощью точечной нотации, например `type_params.measure`. | Required | Dict |
| `type_params.measure` | Мера, связанная с метрикой. Поддерживает как сокращённый синтаксис (строка), так и объектный синтаксис. Сокращённый синтаксис используется, если требуется только имя, а объектный — если нужно задать дополнительные атрибуты. | Required | Dict |
| `measure.name` | Имя используемой меры. Обязательно при использовании объектного синтаксиса для `type_params.measure`. | Optional | String |
| `measure.fill_nulls_with` | Задаёт значение (например, 0), которым будут заменяться `null` в определении метрики. | Optional | Integer |
| `measure.join_to_timespine` | Логическое значение, указывающее, должна ли агрегированная мера соединяться с таблицей time spine для заполнения отсутствующих дат. Значение по умолчанию — `false`. | Optional | Boolean |
| `type_params.cumulative_type_params` | Настраивает такие атрибуты, как `window`, `period_agg` и `grain_to_date` для кумулятивных метрик. | Optional | Dict |
| `cumulative_type_params.window` | Определяет окно накопления, например `1 month`, `7 days` или `1 year`. Не может использоваться вместе с `grain_to_date`. | Optional | String |
| `cumulative_type_params.grain_to_date` | Задаёт зерно накопления, например `month`, при котором накопление перезапускается в начале каждого указанного периода зерна. Не может использоваться вместе с `window`. | Optional | String |
| `cumulative_type_params.period_agg` | Определяет способ агрегации кумулятивной метрики при своде данных к другой гранулярности: `first`, `last` или `average`. Если `window` не указан, по умолчанию используется `first`. | Optional | String |

</VersionBlock>

<Expandable alt_header="Explanation of type_params.measure">

Конфигурация `type_params.measure` может быть записана несколькими способами:
- **Сокращённый синтаксис** &mdash; чтобы указать только имя меры, используйте простое строковое значение. Это сокращённый вариант, применяемый, когда не требуются дополнительные атрибуты.
  ```yaml
  type_params:
    measure: revenue
  ```
- Объектный синтаксис &mdash; Чтобы добавить больше деталей или атрибутов к измерению (например, добавление фильтра, обработка значений `null` или указание, следует ли присоединять к временной оси), необходимо использовать объектный синтаксис. Это позволяет дополнительную конфигурацию помимо имени измерения.

  ```yaml
  type_params:
    measure:
      name: order_total
      fill_nulls_with: 0
      join_to_timespine: true
  ```
</Expandable>

### Полная спецификация {#complete-specification}
Ниже представлена полная спецификация для кумулятивных метрик с примером:

<File name='models/marts/sem_semantic_model_name.yml'>

<VersionBlock firstVersion="1.9">

```yaml
metrics:
  - name: The metric name # Обязательный
    description: The metric description # Необязательный
    type: cumulative # Обязательный
    label: The value that will be displayed in downstream tools # Обязательный
    type_params: # Обязательный
      cumulative_type_params:
        period_agg: first # Необязательный. По умолчанию first. Допустимые значения: first|last|average
        window: The accumulation window, such as 1 month, 7 days, 1 year. # Необязательный. Не может использоваться с grain_to_date.
        grain_to_date: Sets the accumulation grain, such as month will accumulate data for one month, then restart at the beginning of the next.  # Необязательный. Не может использоваться с window.
      measure: 
        name: The measure you are referencing. # Обязательный
        fill_nulls_with: Set the value in your metric definition instead of null (such as zero). # Необязательный
        join_to_timespine: true/false # Булево значение, указывающее, следует ли присоединить агрегированное измерение к таблице временной оси для заполнения отсутствующих дат. По умолчанию `false`. # Необязательный

```
</VersionBlock>

</File>

## Пример кумулятивных метрик {#cumulative-metrics-example}

Кумулятивные метрики измеряют данные за заданный период и считают период бесконечным, если параметр окна не передан, накапливая данные за все время.

Следующий пример показывает, как определить кумулятивные метрики в YAML-файле:

<VersionBlock firstVersion="1.9">

- `cumulative_order_total`: Вычисляет кумулятивную сумму заказов за все время. Использует `type params` для указания измерения `order_total`, которое будет агрегировано.

- `cumulative_order_total_l1m`: Вычисляет кумулятивную сумму заказов за последний месяц. Использует `cumulative_type_params` для указания `window` в 1 месяц.

- `cumulative_order_total_mtd`: Вычисляет кумулятивную сумму заказов с начала месяца. Использует `cumulative_type_params` для указания `grain_to_date` в `month`.

</VersionBlock>

<File name='models/marts/sem_semantic_model_name.yml'>

<VersionBlock firstVersion="1.9">

```yaml
metrics:
  - name: cumulative_order_total
    label: Cumulative order total (All-Time)    
    description: The cumulative value of all orders
    type: cumulative
    type_params:
      measure: 
        name: order_total
  
  - name: cumulative_order_total_l1m
    label: Cumulative order total (L1M)   
    description: Trailing 1-month cumulative order total
    type: cumulative
    type_params:
      measure: 
        name: order_total
      cumulative_type_params:
        window: 1 month
  
  - name: cumulative_order_total_mtd
    label: Cumulative order total (MTD)
    description: The month-to-date value of all orders
    type: cumulative
    type_params:
      measure: 
        name: order_total
      cumulative_type_params:
        grain_to_date: month
```
</VersionBlock>

</File>

<VersionBlock firstVersion="1.9">

### Опции гранулярности {#granularity-options}

Используйте параметр `period_agg` с функциями `first()`, `last()` и `average()`, чтобы агрегировать кумулятивные метрики за запрашиваемый период. Это связано с тем, что опции гранулярности для кумулятивных метрик отличаются от опций для других типов метрик.
- Для других метрик мы используем функцию `date_trunc` для реализации гранулярности.
- Однако кумулятивные метрики не являются аддитивными (значения не могут быть сложены), поэтому мы не можем использовать функцию `date_trunc` для изменения их временной гранулярности.
- По умолчанию мы берем первое значение периода. Вы можете изменить это, указав другую функцию с помощью параметра `period_agg`.

В следующем примере мы определяем кумулятивную метрику `cumulative_revenue`, которая вычисляет кумулятивный доход для всех заказов:

<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
- name: cumulative_revenue
  description: The cumulative revenue for all orders.
  label: Cumulative revenue (all-time)
  type: cumulative
  type_params:
    measure: revenue
    cumulative_type_params:
      period_agg: first # Необязательный. По умолчанию first. Допустимые значения: first|end|average
```
</File>

В этом примере `period_agg` установлен в `first`, что выбирает первое значение для выбранного окна гранулярности. Чтобы запросить `cumulative_revenue` по неделям, используйте следующий синтаксис запроса:
- `dbt sl query --metrics cumulative_revenue --group-by metric_time__week`

<Expandable alt_header="Разверните, чтобы увидеть, как компилируется SQL">

Обратите внимание на использование функции `window` для выбора первого значения. Для `last` и `average` мы заменили бы функцию `first_value()` в сгенерированном SQL на `last_value()` и `average` соответственно.

```sql
-- повторная агрегация метрики через group by
select
  metric_time__week,
  metric_time__quarter,
  revenue_all_time
from (
  -- оконная функция для повторной агрегации метрики
  select
    metric_time__week,
    metric_time__quarter,
    first_value(revenue_all_time) over (
      partition by
        metric_time__week,
        metric_time__quarter
      order by metric_time__day
      rows between unbounded preceding and unbounded following
    ) as revenue_all_time
  from (
    -- соединение с самим собой по временной шкале
    -- передача только элементов: ['txn_revenue', 'metric_time__week', 'metric_time__quarter', 'metric_time__day']
    -- агрегация измерений
    -- вычисление метрик через выражения
    select
      subq_11.metric_time__day as metric_time__day,
      subq_11.metric_time__week as metric_time__week,
      subq_11.metric_time__quarter as metric_time__quarter,
      sum(revenue_src_28000.revenue) as revenue_all_time
    from (
      -- временная ось
      select
        ds as metric_time__day,
        date_trunc('week', ds) as metric_time__week,
        date_trunc('quarter', ds) as metric_time__quarter
      from mf_time_spine subq_12
      group by
        ds,
        date_trunc('week', ds),
        date_trunc('quarter', ds)
    ) subq_11
    inner join fct_revenue revenue_src_28000
    on (
      date_trunc('day', revenue_src_28000.created_at) <= subq_11.metric_time__day
    )
    group by
      subq_11.metric_time__day,
      subq_11.metric_time__week,
      subq_11.metric_time__quarter
  ) subq_16
) subq_17
group by
  metric_time__week,
  metric_time__quarter,
  revenue_all_time

```

</Expandable>

</VersionBlock>

### Опции окна {#window-options}

Этот раздел содержит примеры, когда следует указывать и не указывать опции окна.

- Когда окно указано, MetricFlow применяет скользящее окно к базовому измерению, например, отслеживание еженедельных активных пользователей с 7-дневным окном.
- Без указания окна кумулятивные метрики накапливают значения за все время, что полезно для текущих итогов, таких как текущий доход и активные подписки.

<Expandable alt_header="Пример с указанным окном">

Если указана опция окна, MetricFlow применяет скользящее окно к базовому измерению.

Предположим, базовое измерение `customers` настроено для подсчета уникальных клиентов, совершающих заказы в магазине Jaffle.

<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
measures:
  - name: customers
    expr: customer_id
    agg: count_distinct

```
</File>

Мы можем написать кумулятивную метрику `weekly_customers` следующим образом:

<VersionBlock firstVersion="1.9">

<File name='models/marts/sem_semantic_model_name.yml'>

``` yaml
metrics: 
  - name: weekly_customers # Определите измерение и окно.
  type: cumulative
  type_params:
    measure: customers
    cumulative_type_params:
      window: 7 days # Установка окна на 7 дней, так как мы хотим отслеживать еженедельных активных
      period_agg: first # Это выберет первое значение окна гранулярности при изменении гранулярности.
```
</File>

Из примера YAML-файла обратите внимание на следующее:

* `type`: Укажите cumulative, чтобы указать тип метрики. 
* `type_params`: Настройте кумулятивную метрику, предоставив `measure`.
* `cumulative_type_params`: Необязательно добавьте конфигурацию `window`, `period_agg` и `grain_to_date`.

Например, в кумулятивной метрике `weekly_customers` MetricFlow берет скользящее 7-дневное окно соответствующих клиентов и применяет функцию count distinct.

Если вы удалите `window`, измерение будет накапливаться за все время.
</VersionBlock>


Из примера YAML-файла обратите внимание на следующее:

* `type`: Укажите cumulative, чтобы указать тип метрики. 
* `type_params`: Настройте кумулятивную метрику, предоставив `measure` и необязательно добавьте конфигурацию `window` или `grain_to_date`.

Например, в кумулятивной метрике `weekly_customers` MetricFlow берет скользящее 7-дневное окно соответствующих клиентов и применяет функцию count distinct.

Если вы удалите `window`, измерение будет накапливаться за все время.

</Expandable>

<Expandable alt_header="Пример без указанного окна">

Предположим, у вас (компания, основанная на подписке, для примера) есть таблица событийных логов со следующими столбцами: 

* `date`: столбец с датой 
* `user_id`: (целое число) идентификатор, указанный для каждого пользователя, ответственного за событие 
* `subscription_plan`: (целое число) столбец, указывающий конкретный план подписки, связанный с пользователем. 
* `subscription_revenue`: (целое число) столбец, указывающий значение, связанное с планом подписки.  
* `event_type`: (целое число) столбец, заполняющийся значением +1 для указания добавленной подписки или -1 для указания удаленной подписки. 
* `revenue`: (целое число) столбец, умножающий `event_type` и `subscription_revenue`, чтобы показать сумму дохода, добавленного или потерянного за конкретную дату. 

Используя кумулятивные метрики без указания окна, вы можете рассчитать текущие итоги для таких метрик, как количество активных подписок и доход в любой момент времени. Следующий YAML-файл показывает создание кумулятивных метрик для получения текущего дохода и общего количества активных подписок в виде кумулятивной суммы:

<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
measures:
  - name: revenue
    description: Total revenue
    agg: sum
    expr: revenue
  - name: subscription_count
    description: Count of active subscriptions
    agg: sum
    expr: event_type
metrics:
  - name: current_revenue
    description: Current revenue
    label: Current Revenue
    type: cumulative
    type_params:
      measure: revenue
  - name: active_subscriptions
    description: Count of active subscriptions
    label: Active Subscriptions
    type: cumulative
    type_params:
      measure: subscription_count

```

</File>
</Expandable>

### Зерно до даты {#grain-to-date}

Вы можете выбрать указание зерна до даты в конфигурации вашей кумулятивной метрики, чтобы накапливать метрику с начала зерна (например, неделя, месяц или год). При использовании окна, например, месяц, MetricFlow вернется на один полный календарный месяц назад. Однако зерно до даты всегда будет начинать накопление с начала зерна, независимо от последней даты данных.

Например, рассмотрим базовое измерение `order_total.`

<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
    measures:
      - name: order_total
        agg: sum
```
</File>

Мы можем сравнить разницу между 1-месячным окном и месячным зерном до даты. 
- Кумулятивная метрика в подходе окна применяет скользящее окно в 1 месяц
- Зерно до даты по месяцам сбрасывается в начале каждого месяца.

<File name='models/marts/sem_semantic_model_name.yml'>

<VersionBlock firstVersion="1.9">

```yaml
metrics:
  - name: cumulative_order_total_l1m  # Для этой метрики мы используем окно в 1 месяц 
    label: Cumulative order total (L1M)
    description: Trailing 1-month cumulative order amount
    type: cumulative
    type_params:
      measure: order_total
      cumulative_type_params:
        window: 1 month # Применяет скользящее окно в 1 месяц
  - name: cumulative_order_total_mtd   # Для этой метрики мы используем месячное зерно до даты 
    label: Cumulative order total (MTD)
    description: The month-to-date value of all orders
    type: cumulative
    type_params:
      measure: order_total
      cumulative_type_params:
        grain_to_date: month # Сбрасывается в начале каждого месяца
        period_agg: first # Необязательный. По умолчанию first. Допустимые значения: first|last|average
```
</VersionBlock>
</File>

Кумулятивная метрика с зерном до даты:

<VersionBlock firstVersion="1.9">
<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
- name: orders_last_month_to_date
  label: Orders month to date
  type: cumulative
  type_params:
    measure: order_count
    cumulative_type_params:
      grain_to_date: month
```
</File>

<Expandable alt_header="Разверните, чтобы увидеть, как компилируется SQL">

```sql
with staging as (
    select
        subq_3.date_day as metric_time__day,
        date_trunc('week', subq_3.date_day) as metric_time__week,
        sum(subq_1.order_count) as orders_last_month_to_date
    from dbt_jstein.metricflow_time_spine subq_3
    inner join (
        select
            date_trunc('day', ordered_at) as metric_time__day,
            1 as order_count
        from analytics.dbt_jstein.orders orders_src_10000
    ) subq_1
    on (
        subq_1.metric_time__day <= subq_3.date_day
    ) and (
        subq_1.metric_time__day >= date_trunc('month', subq_3.date_day)
    )
    group by
        subq_3.date_day,
        date_trunc('week', subq_3.date_day)
)

select
    *
from (
    select
        metric_time__week,
        first_value(orders_last_month_to_date) over (partition by date_trunc('week', metric_time__day) order by metric_time__day) as cumulative_revenue
    from
        staging
)
group by
    metric_time__week,
    cumulative_revenue
order by
    metric_time__week
    1
```

</Expandable>
</VersionBlock>


## Пример реализации SQL {#sql-implementation-example}

Чтобы вычислить кумулятивное значение метрики за заданный период, мы выполняем соединение по временной шкале с таблицей временной оси, используя основное временное измерение в качестве ключа соединения. Мы используем окно накопления в соединении, чтобы решить, следует ли включать запись в конкретный день. Следующий SQL-код, полученный из примера кумулятивной метрики, предоставлен для справки:

Чтобы реализовать кумулятивные метрики, обратитесь к примеру SQL-кода:

``` sql
select
  count(distinct distinct_users) as weekly_active_users,
  metric_time
from (
  select
    subq_3.distinct_users as distinct_users,
    subq_3.metric_time as metric_time
  from (
    select
      subq_2.distinct_users as distinct_users,
      subq_1.metric_time as metric_time
    from (
      select
        metric_time
      from transform_prod_schema.mf_time_spine subq_1356
      where (
        metric_time >= cast('2000-01-01' as timestamp)
      ) and (
        metric_time <= cast('2040-12-31' as timestamp)
      )
    ) subq_1
    inner join (
      select
        distinct_users as distinct_users,
        date_trunc('day', ds) as metric_time
      from demo_schema.transactions transactions_src_426
      where (
        (date_trunc('day', ds)) >= cast('1999-12-26' as timestamp)
      ) AND (
        (date_trunc('day', ds)) <= cast('2040-12-31' as timestamp)
      )
    ) subq_2
    on
      (
        subq_2.metric_time <= subq_1.metric_time
      ) and (
        subq_2.metric_time > dateadd(day, -7, subq_1.metric_time)
      )
  ) subq_3
)
group by
  metric_time,
limit 100;

```

## Ограничения {#limitations}

Если вы указываете `window` в определении вашей кумулятивной метрики, вы должны включить `metric_time` в качестве измерения в SQL-запросе. Это связано с тем, что окно накопления основано на времени метрики. Например,

```sql
select
  count(distinct subq_3.distinct_users) as weekly_active_users,
  subq_3.metric_time
from (
  select
    subq_2.distinct_users as distinct_users,
    subq_1.metric_time as metric_time
group by
  subq_3.metric_time
```

## Связанные документы {#related-docs}
- [Заполнение значений null для простых, производных или относительных метрик](/docs/build/fill-nulls-advanced)