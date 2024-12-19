---
title: "Кумулятивные метрики"
id: cumulative
description: "Используйте кумулятивные метрики для агрегирования показателя за заданный период."
sidebar_label: Кумулятивные
tags: [Метрики, Семантический уровень]
---

Кумулятивные метрики агрегируют показатель за заданный период накопления. Если период не указан, он считается бесконечным и накапливает значения за все время. Вам необходимо создать [модель временной оси](/docs/build/metricflow-time-spine) перед добавлением кумулятивных метрик.

Кумулятивные метрики полезны для расчета таких показателей, как количество активных пользователей за неделю или доход с начала месяца. Параметры, описание и типы для кумулятивных метрик:

:::tip
Обратите внимание, что мы используем двойной двоеточие (::) для указания, является ли параметр вложенным в другой параметр. Например, `measure::name` означает, что параметр `name` вложен в `measure`.
:::

## Параметры

<VersionBlock firstVersion="1.9">

| Параметр   | <div style={{width:'350px'}}>Описание</div>   | Обязательный | Тип      |
|-------------|---------------------------------------------------|----------|-----------|
| `name`  | Имя метрики.       | Обязательный  | Строка |
| `description`       | Описание метрики.     | Необязательный  | Строка |
| `type`    | Тип метрики (кумулятивная, производная, отношение или простая).       | Обязательный  | Строка |  
| `label`     | Обязательная строка, определяющая отображаемое значение в инструментах. Принимает простой текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`).  | Обязательный  | Строка |
| `type_params`    | Параметры типа метрики. Поддерживает вложенные параметры, обозначенные двойным двоеточием, такими как `type_params::measure`.  | Обязательный  | Словарь |
| `type_params::measure`   | Показатель, связанный с метрикой. Поддерживает как сокращенный (строковый), так и объектный синтаксис. Сокращенный синтаксис используется, если нужно только имя, в то время как объектный синтаксис позволяет указать дополнительные атрибуты. | Обязательный  | Словарь |
| `measure::name`    | Имя показателя, на который ссылаются. Обязательный, если используется объектный синтаксис для `type_params::measure`.  | Необязательный  | Строка |
| `measure::fill_nulls_with`     | Устанавливает значение (например, 0) для замены null в определении метрики.    | Необязательный  | Целое число или строка |
| `measure::join_to_timespine` | Логическое значение, указывающее, следует ли присоединять агрегированный показатель к таблице временной оси для заполнения пропущенных дат. По умолчанию `false`. | Необязательный  | Логическое |
| `type_params::cumulative_type_params`     | Настраивает атрибуты, такие как `window`, `period_agg` и `grain_to_date` для кумулятивных метрик. | Необязательный  | Словарь |
| `cumulative_type_params::window`      | Указывает период накопления, такой как `1 месяц`, `7 дней` или `1 год`. Не может использоваться с `grain_to_date`.   | Необязательный  | Строка |
| `cumulative_type_params::grain_to_date`   | Устанавливает период накопления, такой как `месяц`, перезапуская накопление в начале каждого указанного периода. Не может использоваться с `window`. | Необязательный  | Строка |
| `cumulative_type_params::period_agg`  | Определяет, как агрегировать кумулятивную метрику при обобщении данных до другой гранулярности: `first`, `last` или `average`. По умолчанию `first`, если `window` не указан. | Необязательный  | Строка |

</VersionBlock>

<VersionBlock lastVersion="1.8">

| Параметр | <div style={{width:'350px'}}>Описание</div> | Тип |
| --------- | ----------- | ---- |
| `name` | Имя метрики. | Обязательный |
| `description` | Описание метрики. | Необязательный |
| `type` | Тип метрики (кумулятивная, производная, отношение или простая). | Обязательный |
| `label` | Обязательная строка, определяющая отображаемое значение в инструментах. Принимает простой текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Обязательный |
| `type_params` | Параметры типа метрики. Поддерживает вложенные параметры, обозначенные двойным двоеточием, такими как `type_params::measure`. | Обязательный |
| `window` | Период накопления, такой как `1 месяц`, `7 дней` или `1 год`. Не может использоваться с `grain_to_date`. | Необязательный  |
| `grain_to_date` | Устанавливает период накопления, такой как `месяц`, который будет накапливать данные в течение одного месяца и затем перезапустится в начале следующего. Не может использоваться с `window`. | Необязательный |
| `type_params::measure` | Список входных показателей | Обязательный |
| `measure:name` | Имя показателя, на который ссылаются. Обязательный, если используется объектный синтаксис для `type_params::measure`.  | Необязательный  |
| `measure:fill_nulls_with` | Установите значение в определении вашей метрики вместо null (например, ноль).| Необязательный |
| `measure:join_to_timespine` | Логическое значение, указывающее, следует ли присоединять агрегированный показатель к таблице временной оси для заполнения пропущенных дат. По умолчанию `false`. | Необязательный |

</VersionBlock>

<Expandable alt_header="Объяснение type_params::measure">
  
Конфигурация `type_params::measure` может быть записана разными способами:
- Синтаксис сокращения &mdash;  Чтобы указать только имя показателя, используйте простое строковое значение. Это сокращенный подход, когда не требуются другие атрибуты.
  ```yaml
  type_params:
    measure: revenue
  ```
- Объектный синтаксис &mdash; Чтобы добавить больше деталей или атрибутов к показателю (например, добавить фильтр, обработать `null` значения или указать, следует ли присоединять к временной оси), необходимо использовать объектный синтаксис. Это позволяет добавить дополнительную конфигурацию помимо имени показателя.

  ```yaml
  type_params:
    measure:
      name: order_total
      fill_nulls_with: 0
      join_to_timespine: true
  ```
</Expandable>

### Полная спецификация
Следующее отображает полную спецификацию для кумулятивных метрик, вместе с примером:

<File name='models/marts/sem_semantic_model_name.yml'>

<VersionBlock firstVersion="1.9">

```yaml
metrics:
  - name: Имя метрики # Обязательный
    description: Описание метрики # Необязательный
    type: cumulative # Обязательный
    label: Значение, которое будет отображаться в инструментах # Обязательный
    type_params: # Обязательный
      cumulative_type_params:
        period_agg: first # Необязательный. По умолчанию first. Допустимые значения: first|last|average
        window: Период накопления, такой как 1 месяц, 7 дней, 1 год. # Необязательный. Не может использоваться с grain_to_date.
        grain_to_date: Устанавливает период накопления, такой как месяц, который будет накапливать данные в течение одного месяца, затем перезапустится в начале следующего.  # Необязательный. Не может использоваться с window.
      measure: 
        name: Показатель, на который вы ссылаетесь. # Обязательный
        fill_nulls_with: Установите значение в определении вашей метрики вместо null (например, ноль). # Необязательный
        join_to_timespine: true/false # Логическое значение, указывающее, следует ли присоединять агрегированный показатель к таблице временной оси для заполнения пропущенных дат. По умолчанию `false`. # Необязательный

```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
metrics:
  - name: Имя метрики  # Обязательный
    description: Описание метрики  # Необязательный
    type: cumulative  # Обязательный
    label: Значение, которое будет отображаться в инструментах  # Обязательный
    type_params:  # Обязательный
      measure: 
        name: Показатель, на который вы ссылаетесь  # Обязательный
        fill_nulls_with: Установите значение в определении вашей метрики вместо null (например, ноль)  # Необязательный
        join_to_timespine: false  # Логическое значение, указывающее, следует ли присоединять агрегированный показатель к таблице временной оси для заполнения пропущенных дат. По умолчанию `false`. # Необязательный
      window: 1 месяц  # Период накопления, такой как 1 месяц, 7 дней, 1 год. Необязательный. Не может использоваться с grain_to_date.
      grain_to_date: месяц  # Устанавливает период накопления, такой как месяц, который будет накапливать данные в течение одного месяца, затем перезапустится в начале следующего. Необязательный. Не может использоваться с window.
```
</VersionBlock>

</File>

## Пример кумулятивных метрик

Кумулятивные метрики измеряют данные за заданный период и считают период бесконечным, когда параметр окна не передан, накапливая данные за все время.

Следующий пример показывает, как определить кумулятивные метрики в YAML файле:

<VersionBlock firstVersion="1.9">

- `cumulative_order_total`: Рассчитывает кумулятивный общий заказ за все время. Использует `type params` для указания показателя `order_total`, который будет агрегирован.

- `cumulative_order_total_l1m`: Рассчитывает кумулятивный общий заказ за последние 1 месяц. Использует `cumulative_type_params` для указания `window` в 1 месяц.

- `cumulative_order_total_mtd`: Рассчитывает кумулятивный общий заказ с начала месяца. Использует `cumulative_type_params` для указания `grain_to_date` в `month`.

</VersionBlock>

<VersionBlock lastVersion="1.8">

- `cumulative_order_total`: Рассчитывает кумулятивный общий заказ за все время. Использует `type params` для указания показателя `order_total`, который будет агрегирован.

- `cumulative_order_total_l1m`: Рассчитывает кумулятивный общий заказ за последние 1 месяц. Использует `type params` для указания `window` в 1 месяц.

- `cumulative_order_total_mtd`: Рассчитывает кумулятивный общий заказ с начала месяца. Использует `type params` для указания `grain_to_date` в `month`.

</VersionBlock>

<File name='models/marts/sem_semantic_model_name.yml'>

<VersionBlock firstVersion="1.9">

```yaml
metrics:
  - name: cumulative_order_total
    label: Кумулятивный общий заказ (все время)    
    description: Кумулятивное значение всех заказов
    type: cumulative
    type_params:
      measure: 
        name: order_total
  
  - name: cumulative_order_total_l1m
    label: Кумулятивный общий заказ (L1M)   
    description: Кумулятивный общий заказ за последние 1 месяц
    type: cumulative
    type_params:
      measure: 
        name: order_total
      cumulative_type_params:
        window: 1 месяц
  
  - name: cumulative_order_total_mtd
    label: Кумулятивный общий заказ (MTD)
    description: Кумулятивное значение всех заказов с начала месяца
    type: cumulative
    type_params:
      measure: 
        name: order_total
      cumulative_type_params:
        grain_to_date: month
```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
metrics:
  - name: cumulative_order_total
    label: Кумулятивный общий заказ (все время)    
    description: Кумулятивное значение всех заказов
    type: cumulative
    type_params:
      measure: 
        name: order_total
  
  - name: cumulative_order_total_l1m
    label: Кумулятивный общий заказ (L1M)   
    description: Кумулятивный общий заказ за последние 1 месяц
    type: cumulative
    type_params:
      measure: 
        name: order_total
      window: 1 месяц
  
  - name: cumulative_order_total_mtd
    label: Кумулятивный общий заказ (MTD)
    description: Кумулятивное значение всех заказов с начала месяца
    type: cumulative
    type_params:
      measure: 
        name: order_total
      grain_to_date: month
```
</VersionBlock>

</File>

<VersionBlock firstVersion="1.9">

### Опции гранулярности

Используйте параметр `period_agg` с функциями `first()`, `last()` и `average()` для агрегирования кумулятивных метрик за запрашиваемый период. Это связано с тем, что опции гранулярности для кумулятивных метрик отличаются от опций для других типов метрик. 
- Для других метрик мы используем функцию `date_trunc` для реализации гранулярности. 
- Однако кумулятивные метрики неаддитивны (значения не могут быть сложены), поэтому мы не можем использовать функцию `date_trunc` для изменения их временной гранулярности.
- По умолчанию мы берем первое значение периода. Вы можете изменить это, указав другую функцию с помощью параметра `period_agg`.

В следующем примере мы определяем кумулятивную метрику `cumulative_revenue`, которая рассчитывает кумулятивный доход от всех заказов:

<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
- name: cumulative_revenue
  description: Кумулятивный доход от всех заказов.
  label: Кумулятивный доход (все время)
  type: cumulative
  type_params:
    measure: revenue
    cumulative_type_params:
      period_agg: first # Необязательный. По умолчанию first. Допустимые значения: first|end|average
```
</File>

В этом примере `period_agg` установлен на `first`, что выбирает первое значение для выбранного окна гранулярности. Чтобы запросить `cumulative_revenue` по неделям, используйте следующий синтаксис запроса: 
- `dbt sl query --metrics cumulative_revenue --group-by metric_time__week`

<Expandable alt_header="Раскрыть, чтобы увидеть, как компилируется SQL">

Обратите внимание на использование функции `window` для выбора `first` значения. Для `last` и `average` мы заменим функцию `first_value()` в сгенерированном SQL на `last_value()` и `average` соответственно.

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
    -- соединение с самим собой по диапазону времени
    -- передать только элементы: ['txn_revenue', 'metric_time__week', 'metric_time__quarter', 'metric_time__day']
    -- агрегировать показатели
    -- вычислить метрики через выражения
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

### Опции окна

В этом разделе приведены примеры, когда следует указывать и не указывать параметры окна.

- Когда окно указано, MetricFlow применяет скользящее окно к базовому показателю, например, отслеживая активных пользователей за неделю с 7-дневным окном.
- Без указания окна кумулятивные метрики накапливают значения за все время, что полезно для текущих сумм, таких как текущий доход и активные подписки.

<Expandable alt_header="Пример с указанным окном">

Если параметр окна указан, MetricFlow применяет скользящее окно к базовому показателю.

Предположим, что базовый показатель `customers` настроен для подсчета уникальных клиентов, делающих заказы в магазине Jaffle.

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
  - name: weekly_customers # Определите показатель и окно.
  type: cumulative
  type_params:
    measure: customers
    cumulative_type_params:
      window: 7 days # Устанавливаем окно на 7 дней, так как хотим отслеживать активных пользователей за неделю
      period_agg: first # Это выберет первое значение окна гранулярности при изменении гранулярности.
```
</File>

Из приведенного примера YAML обратите внимание на следующее:

* `type`: Укажите cumulative, чтобы указать тип метрики. 
* `type_params`: Настройте кумулятивную метрику, предоставив `measure`.
* `cumulative_type_params`: При необходимости добавьте конфигурацию `window`, `period_agg` и `grain_to_date`.

Например, в кумулятивной метрике `weekly_customers` MetricFlow берет скользящее 7-дневное окно соответствующих клиентов и применяет функцию подсчета уникальных.

Если вы уберете `window`, показатель будет накапливаться за все время.
</VersionBlock>

<VersionBlock lastVersion="1.8">

<File name='models/marts/sem_semantic_model_name.yml'>

``` yaml
metrics: 
  - name: weekly_customers # Определите показатель и окно.
  type: cumulative
  type_params:
    measure: customers
    window: 7 days # Устанавливаем окно на 7 дней, так как хотим отслеживать активных пользователей за неделю
```
</File>
</VersionBlock>

Из приведенного примера YAML обратите внимание на следующее:

* `type`: Укажите cumulative, чтобы указать тип метрики. 
* `type_params`: Настройте кумулятивную метрику, предоставив `measure` и, при необходимости, добавив конфигурацию `window` или `grain_to_date`.

Например, в кумулятивной метрике `weekly_customers` MetricFlow берет скользящее 7-дневное окно соответствующих клиентов и применяет функцию подсчета уникальных.

Если вы уберете `window`, показатель будет накапливаться за все время.

</Expandable>

<Expandable alt_header="Пример, когда окно не указано">

Предположим, что у вас (для примера, основанного на подписках) есть таблица событий с следующими столбцами: 

* `date`: столбец даты 
* `user_id`: (целое число) ID, указанный для каждого пользователя, ответственного за событие 
* `subscription_plan`: (целое число) столбец, который указывает конкретный план подписки, связанный с пользователем. 
* `subscription_revenue`: (целое число) столбец, который указывает значение, связанное с планом подписки.  
* `event_type`: (целое число) столбец, который заполняется +1 для указания добавленной подписки или -1 для указания удаленной подписки. 
* `revenue`: (целое число) столбец, который умножает `event_type` и `subscription_revenue`, чтобы показать сумму дохода, добавленного или потерянного за конкретную дату. 

Используя кумулятивные метрики без указания окна, вы можете рассчитать текущие суммы для таких метрик, как количество активных подписок и доход в любой момент времени. Следующий YAML файл показывает создание кумулятивных метрик для получения текущего дохода и общего количества активных подписок в виде кумулятивной суммы:

<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
measures:
  - name: revenue
    description: Общий доход
    agg: sum
    expr: revenue
  - name: subscription_count
    description: Количество активных подписок
    agg: sum
    expr: event_type
metrics:
  - name: current_revenue
    description: Текущий доход
    label: Текущий доход
    type: cumulative
    type_params:
      measure: revenue
  - name: active_subscriptions
    description: Количество активных подписок
    label: Активные подписки
    type: cumulative
    type_params:
      measure: subscription_count

```

</File>
</Expandable>

### Grain to date

Вы можете выбрать указать grain to date в конфигурации вашей кумулятивной метрики, чтобы накапливать метрику с начала зерна (например, недели, месяца или года). При использовании окна, такого как месяц, MetricFlow будет возвращаться на целый календарный месяц. Однако grain to date всегда начнет накапливать с начала зерна, независимо от последней даты данных.

Например, рассмотрим базовый показатель `order_total.`

<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
    measures:
      - name: order_total
        agg: sum
```
</File>

Мы можем сравнить разницу между 1-месячным окном и месячным grain to date. 
- Кумулятивная метрика в подходе с окном применяет скользящее окно в 1 месяц
- Grain to date по месяцам сбрасывается в начале каждого месяца.

<File name='models/marts/sem_semantic_model_name.yml'>

<VersionBlock firstVersion="1.9">

```yaml
metrics:
  - name: cumulative_order_total_l1m  # Для этой метрики мы используем окно в 1 месяц 
    label: Кумулятивный общий заказ (L1M)
    description: Кумулятивная сумма заказов за последний месяц
    type: cumulative
    type_params:
      measure: order_total
      cumulative_type_params:
        window: 1 месяц # Применяет скользящее окно в 1 месяц
  - name: cumulative_order_total_mtd   # Для этой метрики мы используем месячный grain-to-date 
    label: Кумулятивный общий заказ (MTD)
    description: Кумулятивное значение всех заказов с начала месяца
    type: cumulative
    type_params:
      measure: order_total
      cumulative_type_params:
        grain_to_date: month # Сбрасывается в начале каждого месяца
        period_agg: first # Необязательный. По умолчанию first. Допустимые значения: first|last|average
```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
metrics:
  - name: cumulative_order_total_l1m  # Для этой метрики мы используем окно в 1 месяц 
    label: Кумулятивный общий заказ (L1M)
    description: Кумулятивная сумма заказов за последний месяц
    type: cumulative
    type_params:
      measure: order_total
    window: 1 месяц # Применяет скользящее окно в 1 месяц
  - name: cumulative_order_total_mtd   # Для этой метрики мы используем месячный grain-to-date 
    label: Кумулятивный общий заказ (MTD)
    description: Кумулятивное значение всех заказов с начала месяца
    type: cumulative
    type_params:
      measure: order_total
      grain_to_date: month # Сбрасывается в начале каждого месяца
```
</VersionBlock>
</File>

Кумулятивная метрика с grain to date:

<VersionBlock firstVersion="1.9">
<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
- name: orders_last_month_to_date
  label: Заказы с начала месяца
  type: cumulative
  type_params:
    measure: order_count
    cumulative_type_params:
      grain_to_date: month
```
</File>

<Expandable alt_header="Раскрыть, чтобы увидеть, как компилируется SQL">

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

<VersionBlock lastVersion="1.8">
<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
- name: orders_last_month_to_date
  label: Заказы с начала месяца
  type: cumulative
  type_params:
    measure: order_count
    grain_to_date: month
```
</File>
</VersionBlock>

## Пример реализации SQL

Чтобы рассчитать кумулятивное значение метрики за заданный период, мы выполняем соединение по диапазону времени с таблицей временной оси, используя основное временное измерение в качестве ключа соединения. Мы используем период накопления в соединении, чтобы решить, следует ли включать запись в определенный день. Следующий SQL код, полученный из примера кумулятивной метрики, предоставлен для справки:

Для реализации кумулятивных метрик обратитесь к примеру SQL кода:

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

## Ограничения

Если вы указываете `window` в определении вашей кумулятивной метрики, вы должны включить `metric_time` в запрос SQL. Это связано с тем, что период накопления основан на времени метрики. Например,

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

## Связанные документы
- [Заполнение значений null для простых, производных или отношенческих метрик](/docs/build/fill-nulls-advanced)