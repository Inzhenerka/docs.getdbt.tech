---
title: "Кумулятивные метрики"
id: cumulative
description: "Используйте накопительные метрики для агрегации метрики за заданный временной интервал."
sidebar_label: Накопительные
tags: [Metrics, Semantic Layer]
availability: all_users
---

<VersionBlock firstVersion="1.12">

Накопительные метрики агрегируют значения других метрик за заданный период накопления. Если период не указан, метрика накапливает значения за весь доступный временной диапазон.

Используйте накопительные метрики для расчета значений за скользящий период или с начала текущего периода, например количества активных пользователей за неделю или выручки с начала месяца.

- Перед определением накопительных метрик необходимо создать [модель временной шкалы](/docs/build/metricflow-time-spine), чтобы MetricFlow мог соединять агрегированные по времени данные с временной шкалой.
- Если накопительная метрика зависит от метрик или измерений, определенных в другой семантической модели, задайте накопительные метрики в ключе `metrics` верхнего уровня.
</VersionBlock>

<VersionBlock lastVersion="1.11">

Накопительные метрики агрегируют меру за заданный период накопления. Если временное окно не указано, период считается бесконечным, и значения накапливаются за все время. Перед добавлением накопительных метрик необходимо создать [модель временной шкалы](/docs/build/metricflow-time-spine).

Кумулятивные метрики полезны для расчета таких показателей, как еженедельные активные пользователи или доход с начала месяца. Параметры, описание и типы для кумулятивных метрик следующие:

:::tip
Обратите внимание, что мы используем точечную нотацию (`.`), чтобы показать, что один параметр вложен в другой. Например, `measure.name` означает, что параметр `name` вложен в параметр `measure`.
:::

</VersionBlock>

## Параметры {#parameters}

<VersionBlock firstVersion="1.12">

| Параметр   | <div style={{width:'350px'}}>Описание</div>   | Обязательный | Тип      |
|-------------|---------------------------------------------------|----------|-----------|
| `name`  | Название метрики.       | Обязательный  | String |
| `description`       | Описание метрики.     | Необязательный  | String |
| `type`    | Тип метрики (cumulative, derived, ratio или simple).       | Обязательный  | String |  
| `label`     | Необязательная строка, определяющая отображаемое значение в инструментах, использующих метрику. Допускает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`).  | Необязательный  | String |
| `input_metric`     | Название метрики, на которую ссылаются. Поддерживает следующие вложенные параметры: `name`, `filter` и `alias`. | Обязательный  | Dict |
| `input_metric.name`     | Название метрики, на которую ссылаются. | Обязательный  | String |
| `input_metric.filter`     | [Фильтр](/docs/build/metrics-overview#filters), применяемый к метрике. | Необязательный  | String |
| `input_metric.alias`     | Псевдоним, применяемый к метрике. | Необязательный  | String |
| `join_to_timespine` | Логическое значение, указывающее, следует ли соединять агрегированную метрику с таблицей временной шкалы, чтобы заполнить пропущенные даты. По умолчанию — `false`. | Необязательный  | Boolean |
| `window`      | Задаёт окно накопления, например `1 month`, `7 days` или `1 year`. Нельзя использовать вместе с `grain_to_date`.   | Необязательный  | String |
| `grain_to_date`   | Задаёт гранулярность накопления, например `hour`, `day`, `week`, `month`, `year`, при этом накопление начинается заново в начале каждого периода указанной гранулярности. Например, при выборе `month` метрика агрегируется с начала месяца до текущей даты (`month to date`). Нельзя использовать вместе с `window`. | Необязательный  | String |
| `period_agg`  | Определяет способ повторной агрегации накопительной метрики при запросе с гранулярностью, отличной от заданной по умолчанию: `first`, `last` или `average`. Если `period_agg` не указан, по умолчанию используется `first`. | Необязательный  | String |

</VersionBlock>

<VersionBlock firstVersion="1.9" lastVersion="1.11">

| Параметр   | <div style={{width:'350px'}}>Описание</div>   | Обязательность | Тип      |
|-------------|---------------------------------------------------|----------|-----------|
| `name`  | Название метрики.       | Обязательный  | String |
| `description`       | Описание метрики.     | Необязательный  | String |
| `type`    | Тип метрики (cumulative, derived, ratio или simple).       | Обязательный  | String |  
| `label`     | Необязательная строка, определяющая отображаемое значение в инструментах, использующих метрику. Допускает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`).  | Необязательный  | String |
| `type_params`    | Параметры типа метрики. Поддерживает вложенные параметры, обозначенные с помощью точечной нотации, например `type_params.measure`.  | Обязательный  | Dict |
| `type_params.measure`   | Мера, связанная с метрикой. Поддерживает как сокращённый синтаксис (строка), так и объектный синтаксис. Сокращённый синтаксис используется, если требуется только название, а объектный синтаксис позволяет указать дополнительные атрибуты. | Обязательный  | Dict |
| `measure.name`    | Название меры, на которую ссылаются. Обязательно при использовании объектного синтаксиса для `type_params.measure`.  | Необязательный  | String |
| `measure.fill_nulls_with`     | Задаёт значение (например, 0) для замены null-значений в определении метрики.    | Необязательный  | Integer |
| `measure.join_to_timespine` | Логическое значение, указывающее, следует ли соединять агрегированную меру с таблицей временной шкалы, чтобы заполнить пропущенные даты. По умолчанию — `false`. | Необязательный  | Boolean |
| `type_params.cumulative_type_params`     | Настраивает такие атрибуты накопительных метрик, как `window`, `period_agg` и `grain_to_date`. | Необязательный  | Dict |
| `cumulative_type_params.window`      | Задаёт окно накопления, например `1 month`, `7 days` или `1 year`. Нельзя использовать вместе с `grain_to_date`.   | Необязательный  | String |
| `cumulative_type_params.grain_to_date`   | Задаёт гранулярность накопления, например `month`, при этом накопление начинается заново в начале каждого периода указанной гранулярности. Нельзя использовать вместе с `window`. | Необязательный  | String |
| `cumulative_type_params.period_agg`  | Определяет способ агрегации накопительной метрики при обобщении данных до другой гранулярности: `first`, `last` или `average`. Если `window` не указан, по умолчанию используется `first`. | Необязательный  | String |

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

</VersionBlock>

### Полная спецификация

Ниже приведена полная спецификация накопительных метрик вместе с примером:

<VersionBlock firstVersion="1.9" lastVersion="1.11">

<File name='models/marts/sem_semantic_model_name.yml'>

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

</File>
</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
metrics:
  - name: my_advanced_cumulative_metric # required 
    description: my_description # optional
    label: my_label # optional
    type: cumulative # required --  cumulative | ratio | derived | conversion
    # if cumulative, optionally can supply window or grain_to_date, but not both
    window: 1 week # (interval)
    # grain_to_date: hour # hour | day | week | month | year | ...
    input_metric: # required, must refer to metric name or metric dict
      name: my_metric_name_from_another_semantic_model
      filter: "{{ Dimension('entity__dimension_name') }} > 10"
      alias: my_metric_name_a_week_ago_in_another_semantic_model
```

</VersionBlock>

## Пример кумулятивных метрик {#cumulative-metrics-example}

Кумулятивные метрики измеряют данные за заданный период и считают период бесконечным, если параметр окна не передан, накапливая данные за все время.

Следующий пример показывает, как определить кумулятивные метрики в YAML-файле:

<VersionBlock firstVersion="1.9" lastVersion="1.11">

- `cumulative_order_total`: Вычисляет кумулятивную сумму заказов за все время. Использует `type params` для указания измерения `order_total`, которое будет агрегировано.

- `cumulative_order_total_l1m`: Вычисляет кумулятивную сумму заказов за последний месяц. Использует `cumulative_type_params` для указания `window` в 1 месяц.

- `cumulative_order_total_mtd`: Вычисляет кумулятивную сумму заказов с начала месяца. Использует `cumulative_type_params` для указания `grain_to_date` в `month`.

</VersionBlock>

<VersionBlock firstVersion="1.12">

- `cumulative_order_total`: Calculates the cumulative order total over all time. Uses `input_metric` to specify the simple metric `order_total` to be aggregated.

- `cumulative_order_total_l1m`: Calculates the trailing 1-month cumulative order total. Uses `window` parameter to specify a window of 1 month.

- `cumulative_order_total_mtd`: Calculates the month-to-date cumulative order total. Uses `grain_to_date` parameter to specify a grain of `month`.

<File name='models/marts/fct_orders.yml'>

```yaml
metrics:
  - name: cumulative_order_total
    label: "Cumulative order total (All-Time)"    
    description: "The cumulative value of all orders"
    type: cumulative
    input_metric: order_total
  
  - name: cumulative_order_total_l1m
    label: "Cumulative order total (L1M)"   
    description: "Trailing 1-month cumulative order total"
    type: cumulative
    window: 1 month
    input_metric: order_total
  
  - name: cumulative_order_total_mtd
    label: "Cumulative order total (MTD)"
    description: "The month-to-date value of all orders"
    type: cumulative
    grain_to_date: month
    input_metric: order_total
```

</File>

</VersionBlock>


<VersionBlock firstVersion="1.9" lastVersion="1.11">

<File name='models/marts/sem_semantic_model_name.yml'>

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

</File>
</VersionBlock>

### Опции гранулярности {#granularity-options}

<VersionBlock firstVersion="1.9" lastVersion="1.11">

Используйте параметр `period_agg` с функциями `first()`, `last()` и `average()` для агрегации накопительных метрик за запрошенный период. Это необходимо, поскольку возможности изменения гранулярности накопительных метрик отличаются от возможностей для других типов метрик. 
- Для других метрик мы используем функцию `date_trunc`, чтобы задать гранулярность. 
- Однако накопительные метрики неаддитивны (их значения нельзя суммировать), поэтому мы не можем использовать функцию `date_trunc` для изменения их временной гранулярности.
- Для накопительных метрик мы сначала выполняем вычисления с гранулярностью по умолчанию. Когда вы запрашиваете другую гранулярность, мы повторно агрегируем эти результаты с помощью `period_agg` (по умолчанию используется первое значение в каждом периоде).

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

</VersionBlock>

<VersionBlock firstVersion="1.12">

Используйте параметр `period_agg` с функциями `first`, `last` и `average` для агрегации накопительных метрик за запрошенный период. Это необходимо, поскольку варианты гранулярности для накопительных метрик отличаются от вариантов для других типов метрик. 
- Для других метрик мы используем функцию `date_trunc`, чтобы задать гранулярность. 
- Однако накопительные метрики неаддитивны (их значения нельзя суммировать), поэтому мы не можем использовать функцию `date_trunc` для изменения их временной гранулярности.
- По умолчанию мы берём первое значение периода. Вы можете изменить это поведение, указав другую функцию с помощью параметра `period_agg`.

В следующем примере мы определяем накопительную метрику `cumulative_revenue`, которая рассчитывает накопительную выручку по всем заказам:

<File name='models/marts/fct_orders.yml'>

```yaml
metrics:
  - name: cumulative_revenue
    description: "Накопительная выручка по всем заказам."
    label: "Накопительная выручка (за всё время)"
    type: cumulative
    input_metric: revenue
    period_agg: first # Необязательный параметр. По умолчанию: first. Допустимые значения: first|last|average
```
</File>

В этом примере для `period_agg` задано значение `first`, при котором выбирается первое значение в пределах интервала выбранной гранулярности. Чтобы запросить `cumulative_revenue` по неделям, используйте следующий синтаксис запроса: 
- `dbt sl query --metrics cumulative_revenue --group-by metric_time__week`

</VersionBlock>

<Expandable alt_header="Разверните, чтобы увидеть скомпилированный SQL">

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

### Параметры окна

Этот раздел содержит примеры, когда следует указывать и не указывать опции окна.

<VersionBlock firstVersion="1.12">

- Если указан период, MetricFlow применяет скользящее окно к базовой простой метрике, например для отслеживания активных пользователей за неделю с окном в 7 дней.
- Если период не указан, накопительные метрики накапливают значения за всё время, что полезно для расчёта нарастающих итогов, таких как текущая выручка и количество активных подписок.

<Expandable alt_header="Пример с указанным окном">

Если указан параметр окна, MetricFlow применяет скользящее окно к базовой метрике.

Предположим, базовая метрика `customers` настроена на подсчёт уникальных клиентов, размещающих заказы в Jaffle shop:

<File name='models/marts/customers.yml'>

```yaml
models:
  - name: customers
    semantic_model:
      enabled: true
      ...

    metrics:
      - name: customers
        description: "Уникальные клиенты, размещающие заказы в Jaffle shop"
        label: "Клиенты"
        type: simple
        agg: count_distinct
        expr: customer_id
```
</File>

Накопительную метрику `weekly_customers` можно определить следующим образом:


<File name='models/marts/customers.yml'>

``` yaml
metrics:
  - name: weekly_customers
    description: "Активные клиенты за неделю со скользящим окном в 7 дней"
    label: "Активные клиенты за неделю"
    type: cumulative
    input_metric: customers
    window: 7 days
    period_agg: first # При использовании нестандартной детализации с накопительными метриками требуется повторная агрегация. period_agg: first выбирает первое значение в каждом окне детализации при повторной агрегации.
```
</File>

В приведённом примере YAML обратите внимание на следующие параметры:

* `type`: укажите `cumulative`, чтобы обозначить тип метрики. 
* `input_metric`: укажите метрику для агрегации (в данном случае — `customers`).
* `window`: укажите окно накопления (в данном случае — 7 дней).
* `period_agg`: укажите функцию повторной агрегации (в данном случае — `first`).
* `grain_to_date`: укажите интервал детализации, с начала которого накапливаются значения (в данном случае — `week`).

Например, для накопительной метрики `weekly_customers` MetricFlow берёт скользящее окно в 7 дней с соответствующими клиентами и применяет функцию подсчёта уникальных значений.

Если удалить `window`, метрика будет накапливать значения за всё время.


</Expandable>

<Expandable alt_header="Пример без указания окна">

Предположим, у вас (для этого примера — компании, работающей по подписной модели) есть таблица журнала событий со следующими столбцами: 

* `date`: столбец с датой. 
* `user_id`: (целое число) идентификатор пользователя, ответственного за событие. 
* `subscription_plan`: (целое число) столбец, указывающий конкретный тарифный план подписки пользователя. 
* `subscription_revenue`: (целое число) столбец, указывающий стоимость тарифного плана подписки.  
* `event_type`: (целое число) столбец, принимающий значение +1 при добавлении подписки или -1 при удалении подписки. 
* `revenue`: (целое число) столбец, в котором `event_type` умножается на `subscription_revenue`, чтобы отразить сумму прироста или потери выручки за определённую дату. 

Используя накопительные метрики без указания окна, можно рассчитывать нарастающие итоги для таких показателей, как количество активных подписок и выручка, на любой момент времени. Следующий YAML-файл показывает, как создать накопительные метрики для получения текущей выручки и общего количества активных подписок в виде накопительной суммы на основе метрик `revenue` и `subscription_count`:

<File name='models/marts/fct_orders.yml'>

```yaml
metrics:
  - name: current_revenue
    description: "Текущая выручка"
    label: "Текущая выручка"
    type: cumulative
    input_metric: revenue
  - name: active_subscriptions
    description: "Количество активных подписок"
    label: "Активные подписки"
    type: cumulative
    input_metric: subscription_count
```
</File>

</Expandable>

</VersionBlock>

<VersionBlock lastVersion="1.11">

- Если указано окно, MetricFlow применяет скользящее окно к базовой мере, например для отслеживания активных пользователей за неделю с окном в 7 дней.
- Если окно не указано, накопительные метрики накапливают значения за всё время, что полезно для расчёта нарастающих итогов, таких как текущая выручка и количество активных подписок.

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

<File name='models/marts/sem_semantic_model_name.yml'>

``` yaml
metrics: 
  - name: weekly_customers # Определите измерение и окно.
  type: cumulative
  type_params:
    measure: customers
    cumulative_type_params:
window: 7 days # Устанавливаем окно в 7 дней, поскольку хотим отслеживать активность за неделю
      period_agg: first #  При использовании нестандартной гранулярности с накопительными метриками требуется повторная агрегация. period_agg: first выбирает первое значение в каждом окне гранулярности при повторной агрегации.
```
</File>

Из примера YAML-файла обратите внимание на следующее:

* `type`: Укажите cumulative, чтобы указать тип метрики. 
* `type_params`: Настройте кумулятивную метрику, предоставив `measure`.
* `cumulative_type_params`: Необязательно добавьте конфигурацию `window`, `period_agg` и `grain_to_date`.

Например, в кумулятивной метрике `weekly_customers` MetricFlow берет скользящее 7-дневное окно соответствующих клиентов и применяет функцию count distinct.

Если убрать `window`, мера будет накапливаться за всё время.
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

</VersionBlock>

### Нарастающий итог с начала периода

Вы можете выбрать указание зерна до даты в конфигурации вашей кумулятивной метрики, чтобы накапливать метрику с начала зерна (например, неделя, месяц или год). При использовании окна, например, месяц, MetricFlow вернется на один полный календарный месяц назад. Однако зерно до даты всегда будет начинать накопление с начала зерна, независимо от последней даты данных.

<VersionBlock lastVersion="1.11">

Например, рассмотрим базовую меру `order_total.`

<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
    measures:
      - name: order_total
        agg: sum
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

Например, рассмотрим базовую простую метрику `order_total`, определённую в семантической модели:

```yaml
models:
  - name: fct_orders
    semantic_model:
      enabled: true
    
    # Simple metrics defined within semantic model
    metrics:
      - name: order_total
        description: "Сумма итоговых сумм заказов"
        type: simple
        agg: sum
        expr: order_total
```

</VersionBlock>

Сравним окно длительностью 1 месяц и накопление с начала текущего месяца (grain to date). 
- При использовании окна к накопительной метрике применяется скользящее окно длительностью 1 месяц
- При накоплении с начала текущего месяца значение сбрасывается в начале каждого месяца.

<VersionBlock firstVersion="1.9" lastVersion="1.11">
<File name='models/marts/sem_semantic_model_name.yml'>

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

</File>
</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name='models/marts/fct_orders.yml'>

```yaml
# Top-level metrics key for cumulative metrics
metrics:
  - name: cumulative_order_total_mtd
    label: "Cumulative order total (MTD)"
    description: "The month-to-date value of all orders"
    type: cumulative
    grain_to_date: month
    input_metric: order_total
```
</File>

</VersionBlock>

Кумулятивная метрика с зерном до даты:

<VersionBlock firstVersion="1.9" lastVersion="1.11">
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

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name='models/marts/fct_orders.yml'>

```yaml
# Ключ metrics верхнего уровня для накопительных метрик
metrics:
  - name: orders_last_month_to_date
    label: "Заказы с начала месяца"
    description: "Количество заказов с начала месяца"
    type: cumulative
    grain_to_date: month
    input_metric: order_count
```
</File>
</VersionBlock>

<Expandable alt_header="Разверните, чтобы посмотреть результат компиляции в SQL">

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