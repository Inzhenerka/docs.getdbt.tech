---
title: "Метрики конверсии"
id: conversion
description: "Используйте метрики конверсии для измерения событий конверсии."
sidebar_label: Конверсия
tags: [Метрики, Семантический уровень]
---

Метрики конверсии позволяют вам определить, когда происходит базовое событие и последующее событие конверсии для конкретной сущности в определенном временном диапазоне.

Например, использование метрик конверсии позволяет отслеживать, как часто пользователь (сущность) завершает визит (базовое событие), а затем совершает покупку (событие конверсии) в течение 7 дней (временной интервал). Вам нужно будет добавить временной диапазон и сущность для соединения.

Метрики конверсии отличаются от [метрик соотношения](/docs/build/ratio), потому что вам нужно включить сущность в предварительно агрегированное соединение.

## Параметры

Спецификация для метрик конверсии выглядит следующим образом:

:::tip
Обратите внимание, что мы используем двойной двоеточие (::) для указания, является ли параметр вложенным в другой параметр. Например, `query_params::metrics` означает, что параметр `metrics` вложен под `query_params`.
:::

| Параметр | Описание | Обязательный | Тип |
| --- | --- | --- | --- |
| `name` | Название метрики. | Обязательный | Строка |
| `description` | Описание метрики. | Необязательный | Строка |
| `type` | Тип метрики (например, производная, соотношение и т.д.). В этом случае устанавливается как 'conversion'. | Обязательный | Строка |
| `label` | Обязательная строка, определяющая отображаемое значение в инструментах нижнего уровня. Принимает простой текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Обязательный | Строка |
| `type_params` | Специфические настройки для каждого типа метрики. | Обязательный | Словарь |
| `conversion_type_params` | Дополнительная конфигурация, специфичная для метрик конверсии. | Обязательный | Словарь |
| `entity` | Сущность для каждого события конверсии. | Обязательный | Строка |  
| `calculation` | Метод расчета. Либо `conversion_rate`, либо `conversions`. По умолчанию `conversion_rate`.  | Необязательный | Строка |
| `base_measure` | Список входных данных базовой меры. | Обязательный | Словарь |
| `base_measure:name` | Мера базового события конверсии. | Обязательный | Строка |
| `base_measure:fill_nulls_with` | Установите значение в определении вашей метрики вместо null (например, ноль). | Необязательный | Строка |
| `base_measure:join_to_timespine` | Булевый параметр, указывающий, следует ли соединять агрегированную меру с таблицей временной оси для заполнения пропущенных дат. По умолчанию `false`. | Необязательный | Булевый |
| `base_measure:filter` | Необязательный `filter`, используемый для применения к базовой мере. | Необязательный | Строка |
| `conversion_measure` | Список входных данных меры конверсии. | Обязательный | Словарь |
| `conversion_measure:name` | Мера базового события конверсии. | Обязательный | Строка |
| `conversion_measure:fill_nulls_with` | Установите значение в определении вашей метрики вместо null (например, ноль). | Необязательный | Строка |
| `conversion_measure:join_to_timespine` | Булевый параметр, указывающий, следует ли соединять агрегированную меру с таблицей временной оси для заполнения пропущенных дат. По умолчанию `false`. | Необязательный | Булевый |  
| `window` | Временной интервал для события конверсии, например, 7 дней, 1 неделя, 3 месяца. По умолчанию бесконечность. | Необязательный | Строка |
| `constant_properties` | Список постоянных свойств.  | Необязательный | Список |
| `base_property` | Свойство из базовой семантической модели, которое вы хотите сохранить постоянным.  |  Необязательный | Строка |
| `conversion_property` | Свойство из семантической модели конверсии, которое вы хотите сохранить постоянным.  | Необязательный | Строка |

Обратитесь к [дополнительным настройкам](#additional-settings), чтобы узнать, как настроить метрики конверсии с помощью настроек для значений null, типа расчета и постоянных свойств.

Следующий пример кода демонстрирует полную спецификацию для метрик конверсии и детали их применения:

```yaml
metrics:
  - name: The metric name # Обязательный
    description: The metric description # Необязательный
    type: conversion # Обязательный
    label: YOUR_LABEL # Обязательный
    type_params: # Обязательный
      conversion_type_params: # Обязательный
        entity: ENTITY # Обязательный
        calculation: CALCULATION_TYPE # Необязательный. по умолчанию: conversion_rate. варианты: conversions(buys) или conversion_rate (buys/visits), и многое другое.
        base_measure: 
          name: The name of the measure # Обязательный
          fill_nulls_with: Set the value in your metric definition instead of null (such as zero) # Необязательный
          join_to_timespine: true/false # Булевый параметр, указывающий, следует ли соединять агрегированную меру с таблицей временной оси для заполнения пропущенных дат. По умолчанию `false`. # Необязательный
          filter: The filter used to apply to the base measure. # Необязательный
        conversion_measure:
          name: The name of the measure # Обязательный
          fill_nulls_with: Set the value in your metric definition instead of null (such as zero) # Необязательный
          join_to_timespine: true/false # Булевый параметр, указывающий, следует ли соединять агрегированную меру с таблицей временной оси для заполнения пропущенных дат. По умолчанию `false`. # Необязательный
        window: TIME_WINDOW # Необязательный. по умолчанию: бесконечность. окно для соединения двух событий. Следует аналогичному формату, как временные окна в других местах (например, 7 дней)
        constant_properties: # Необязательный. Список постоянных свойств по умолчанию: None
          - base_property: DIMENSION or ENTITY # Обязательный. Ссылка на измерение/сущность семантической модели, связанной с базовой мерой
            conversion_property: DIMENSION or ENTITY # То же самое, что и выше, но для семантической модели меры конверсии
```

## Пример метрики конверсии

Следующий пример будет измерять конверсии с веб-визитов (`VISITS` таблица) до завершения заказов (`BUYS` таблица) и шаг за шагом рассчитывать метрику конверсии для этого сценария.

Предположим, у вас есть две семантические модели, `VISITS` и `BUYS`:

- Таблица `VISITS` представляет визиты на сайт электронной коммерции.
- Таблица `BUYS` представляет собой завершение заказа на этом сайте.  

Основные таблицы выглядят следующим образом:

`VISITS`<br />
Содержит визиты пользователей с `USER_ID` и `REFERRER_ID`.

| DS | USER_ID | REFERRER_ID |
| --- | --- | --- |
| 2020-01-01 | bob | facebook |
| 2020-01-04 | bob | google |
| 2020-01-07 | bob | amazon |

`BUYS`<br />
Записывает завершенные заказы с `USER_ID` и `REFERRER_ID`.

| DS | USER_ID | REFERRER_ID |
| --- | --- | --- |
| 2020-01-02 | bob | facebook |
| 2020-01-07 | bob | amazon |

Далее определите метрику конверсии следующим образом:

```yaml
- name: visit_to_buy_conversion_rate_7d
  description: "Коэффициент конверсии от визита к транзакции за 7 дней"
  type: conversion
  label: Коэффициент конверсии визита в покупку (7-дневное окно)
  type_params:
    conversion_type_params:
      base_measure:
        name: visits
        fill_nulls_with: 0
        filter: {{ Dimension('visits__referrer_id') }} = 'facebook'
      conversion_measure:
        name: sellers
      entity: user
      window: 7 days
```

Чтобы рассчитать конверсию, свяжите событие `BUYS` с ближайшим событием `VISITS` (или ближайшим базовым событием). Следующие шаги объясняют этот процесс более подробно:

### Шаг 1: Соедините `VISITS` и `BUYS`

Этот шаг соединяет таблицу `BUYS` с таблицей `VISITS` и получает все комбинации событий визитов-покупок, которые соответствуют условию соединения, где покупки происходят в течение 7 дней после визита (любые строки, где у одного и того же пользователя покупка произошла не более чем через 7 дней после визита).

Сгенерированный SQL на этих шагах выглядит следующим образом:

```sql
select
  v.ds,
  v.user_id,
  v.referrer_id,
  b.ds,
  b.uuid,
  1 as buys
from visits v
inner join (
    select *, uuid_string() as uuid from buys -- Добавляет столбец uuid для уникальной идентификации различных строк
) b
on
v.user_id = b.user_id and v.ds <= b.ds and v.ds > b.ds - interval '7 days'
```

Набор данных возвращает следующее (обратите внимание, что для первого визита есть два потенциальных события конверсии):

| V.DS | V.USER_ID | V.REFERRER_ID | B.DS | UUID | BUYS |
| --- | --- | --- | --- | --- | --- |
| 2020-01-01 | bob | facebook | 2020-01-02 | uuid1 | 1 |
| 2020-01-01 | bob | facebook | 2020-01-07 | uuid2 | 1 |
| 2020-01-04 | bob | google | 2020-01-07 | uuid2 | 1 |
| 2020-01-07 | bob | amazon | 2020-01-07 | uuid2 | 1 |

### Шаг 2: Уточните с помощью оконной функции

Вместо возврата сырых значений визитов используйте оконные функции, чтобы связать конверсии с ближайшим базовым событием. Вы можете разделить по источнику конверсии и получить `first_value`, упорядоченный по `visit ds`, по убыванию, чтобы получить ближайшее базовое событие от события конверсии:

```sql
select
  first_value(v.ds) over (partition by b.ds, b.user_id, b.uuid order by v.ds desc) as v_ds,
  first_value(v.user_id) over (partition by b.ds, b.user_id, b.uuid order by v.ds desc) as user_id,
  first_value(v.referrer_id) over (partition by b.ds, b.user_id, b.uuid order by v.ds desc) as referrer_id,
  b.ds,
  b.uuid,
  1 as buys
from visits v
inner join (
    select *, uuid_string() as uuid from buys
) b
on
v.user_id = b.user_id and v.ds <= b.ds and v.ds > b.ds - interval '7 day'
```

Набор данных возвращает следующее:

| V.DS | V.USER_ID | V.REFERRER_ID | B.DS | UUID | BUYS |
| --- | --- | --- | --- | --- | --- |
| 2020-01-01 | bob | facebook | 2020-01-02 | uuid1 | 1 |
| 2020-01-07 | bob | amazon | 2020-01-07 | uuid2 | 1 |
| 2020-01-07 | bob | amazon | 2020-01-07 | uuid2 | 1 |
| 2020-01-07 | bob | amazon | 2020-01-07 | uuid2 | 1 |

Этот рабочий процесс связывает две конверсии с правильными событиями визитов. Из-за соединения вы получаете несколько комбинаций, что приводит к результатам с разветвлением. После применения оконной функции появляются дубликаты.

Чтобы разрешить это и устранить дубликаты, используйте выборку distinct. UUID также помогает идентифицировать, какая конверсия уникальна. Следующие шаги предоставляют более подробную информацию о том, как это сделать.

### Шаг 3: Удалите дубликаты

Вместо обычного выбора, используемого в [Шаге 2](#step-2-refine-with-window-function), используйте выборку distinct, чтобы удалить дубликаты:

```sql
select distinct
  first_value(v.ds) over (partition by b.ds, b.user_id, b.uuid order by v.ds desc) as v_ds,
  first_value(v.user_id) over (partition by b.ds, b.user_id, b.uuid order by v.ds desc) as user_id,
  first_value(v.referrer_id) over (partition by b.ds, b.user_id, b.uuid order by v.ds desc) as referrer_id,
  b.ds,
  b.uuid,
  1 as buys
from visits v
inner join (
    select *, uuid_string() as uuid from buys
) b
on
v.user_id = b.user_id and v.ds <= b.ds and v.ds > b.ds - interval '7 day';
```

Набор данных возвращает следующее:

| V.DS | V.USER_ID | V.REFERRER_ID | B.DS | UUID | BUYS |
| --- | --- | --- | --- | --- | --- |
| 2020-01-01 | bob | facebook | 2020-01-02 | uuid1 | 1 |
| 2020-01-07 | bob | amazon | 2020-01-07 | uuid2 | 1 |

Теперь у вас есть набор данных, в котором каждое событие конверсии связано с событием визита. Чтобы продолжить:

1. Суммируйте общее количество конверсий в таблице "conversions".
2. Объедините эту таблицу с таблицей "opportunities", сопоставив их по ключам группировки.
3. Рассчитайте коэффициент конверсии.

### Шаг 4: Агрегируйте и рассчитывайте

Теперь, когда вы связали каждое событие конверсии с визитом, вы можете рассчитать агрегированные меры конверсий и возможностей. Затем вы можете объединить их, чтобы рассчитать фактический коэффициент конверсии. SQL для расчета коэффициента конверсии выглядит следующим образом:

```sql
select
  coalesce(subq_3.metric_time__day, subq_13.metric_time__day) as metric_time__day,
  cast(max(subq_13.buys) as double) / cast(nullif(max(subq_3.visits), 0) as double) as visit_to_buy_conversion_rate_7d
from ( -- базовая мера
  select
    metric_time__day,
    sum(visits) as mqls
  from (
    select
      date_trunc('day', first_contact_date) as metric_time__day,
      1 as visits
    from visits
  ) subq_2
  group by
    metric_time__day
) subq_3
full outer join ( -- мера конверсии
  select
    metric_time__day,
    sum(buys) as sellers
  from (
    -- ...
    -- Выходные данные этого подзапроса - таблица, созданная на Шаге 3. SQL скрыт для удобочитаемости.
    -- Чтобы увидеть полный вывод SQL, добавьте --explain к вашему запросу метрики конверсии. 
  ) subq_10
  group by
    metric_time__day
) subq_13
on
  subq_3.metric_time__day = subq_13.metric_time__day
group by
  metric_time__day
```

### Дополнительные настройки

Используйте следующие дополнительные настройки, чтобы настроить свои метрики конверсии:

- **Значения конверсии null:** Установите нулевые конверсии в ноль, используя `fill_nulls_with`. Обратитесь к [Заполнить значения null для метрик](/docs/build/fill-nulls-advanced) для получения дополнительной информации.
- **Тип расчета:** Выберите между отображением сырых конверсий или коэффициента конверсии.
- **Постоянное свойство:** Добавьте условия для конкретных сценариев, чтобы соединить конверсии по постоянным свойствам.

<Tabs>
<TabItem value="null" label="Установить нулевые события конверсии в ноль">

Чтобы вернуть ноль в конечном наборе данных, вы можете установить значение нулевого события конверсии в ноль вместо null. Вы можете добавить параметр `fill_nulls_with` в определение вашей метрики конверсии следующим образом:

```yaml
- name: visit_to_buy_conversion_rate_7_day_window
  description: "Коэффициент конверсии от просмотра страницы до совершения покупки"
  type: conversion
  label: Коэффициент конверсии визита в продавца (7-дневное окно)
  type_params:
    conversion_type_params:
      calculation: conversions
      base_measure:
        name: visits
      conversion_measure: 
        name: buys
        fill_nulls_with: 0
      entity: user
      window: 7 days 

```

Это вернет следующие результаты:

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/conversion-metrics-fill-null.png" width="75%" title="Метрика конверсии с параметром заполнения нулей"/>

Обратитесь к [Заполнить значения null для метрик](/docs/build/fill-nulls-advanced) для получения дополнительной информации.

</TabItem>

<TabItem value="calctype" label="Установить параметр типа расчета">

Используйте параметр расчета конверсии, чтобы показать либо общее количество конверсий, либо коэффициент конверсии. Значение по умолчанию - коэффициент конверсии.

Вы можете изменить значение по умолчанию, чтобы отобразить количество конверсий, установив параметр `calculation: conversion`:

```yaml
- name: visit_to_buy_conversions_1_week_window
    description: "Конверсии визита в покупку"
    type: conversion
    label: Конверсии визита в покупку (1 неделя)
    type_params:
      conversion_type_params:
        calculation: conversions
        base_measure:
          name: visits
        conversion_measure: 
          name: buys
          fill_nulls_with: 0
        entity: user
        window: 1 week
```

</TabItem>

<TabItem value="constproperty" label="Установить постоянное свойство">

*Обратитесь к [блогам Amplitude о постоянных свойствах](https://amplitude.com/blog/holding-constant), чтобы узнать об этой концепции.*

Вы можете добавить постоянное свойство к метрике конверсии, чтобы учитывать только те конверсии, где конкретное измерение или сущность совпадают в обоих событиях базовой и конверсии. 

Например, если вы работаете в компании электронной коммерции и хотите ответить на следующий вопрос:
- _Как часто посетители конвертировались из `Просмотр деталей товара` в `Завершение покупки` с тем же продуктом на каждом этапе?_<br />
  - Этот вопрос сложно ответить, потому что пользователи могли завершить эти два этапа конверсии по многим продуктам. Например, они могли просмотреть пару обуви, затем футболку и в конечном итоге оформить заказ с бабочкой. Это все равно будет считаться конверсией, даже если событие конверсии произошло только для бабочки.

Возвращаясь к первоначальным вопросам, вы хотите увидеть, сколько клиентов просмотрели страницу деталей товара и затем завершили покупку для _того же_ продукта.

В этом случае вы хотите установить `product_id` в качестве постоянного свойства. Вы можете указать это в конфигурациях следующим образом:

```yaml
- name: view_item_detail_to_purchase_with_same_item
  description: "Коэффициент конверсии для пользователей, которые просмотрели страницу деталей товара и купили товар"
  type: Conversion
  label: Просмотр деталей товара > Покупка
  type_params:
    conversion_type_params:
      calculation: conversions
      base_measure:
        name: view_item_detail 
      conversion_measure: purchase
      entity: user
      window: 1 week
      constant_properties:
        - base_property: product
          conversion_property: product
```

Вы добавите дополнительное условие к соединению, чтобы убедиться, что постоянное свойство одинаково для конверсий.

```sql
select distinct
  first_value(v.ds) over (partition by buy_source.ds, buy_source.user_id, buy_source.session_id order by v.ds desc rows between unbounded preceding and unbounded following) as ds,
  first_value(v.user_id) over (partition by buy_source.ds, buy_source.user_id, buy_source.session_id order by v.ds desc rows between unbounded preceding and unbounded following) as user_id,
  first_value(v.referrer_id) over (partition by buy_source.ds, buy_source.user_id, buy_source.session_id order by v.ds desc rows between unbounded preceding and unbounded following) as referrer_id,
  buy_source.uuid,
  1 as buys
from {{ source_schema }}.fct_view_item_details v
inner join
  (
    select *, {{ generate_random_uuid() }} as uuid from {{ source_schema }}.fct_purchases
  ) buy_source
on
  v.user_id = buy_source.user_id
  and v.ds <= buy_source.ds
  and v.ds > buy_source.ds - interval '7 day'
  and buy_source.product_id = v.product_id -- Соединение по постоянному свойству product_id
```

</TabItem>
</Tabs>

## Связанные документы
- [Заполнить значения null для метрик](/docs/build/fill-nulls-advanced)