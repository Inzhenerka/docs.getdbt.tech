---
title: "Метрики конверсии"
id: conversion
description: "Используйте метрики конверсии для измерения событий конверсии."
sidebar_label: Конверсия
tags: [Metrics, Semantic Layer]
availability: all_users
---

Метрики конверсии позволяют измерять, как часто одно событие приводит к другому для определённой сущности в пределах заданного временного окна.

Например, вы можете отслеживать, как часто пользователь (сущность), посетивший ваш сайт (базовое событие), совершает покупку (событие конверсии) в течение 7 дней (временное окно). Для настройки нужно указать временной диапазон и сущность, которая связывает два события.

Метрики конверсии отличаются от [метрик отношения](/docs/build/ratio), потому что вам нужно включить сущность в предварительно агрегированное объединение.

## Параметры {#parameters}

Спецификация для метрик конверсии следующая:

<VersionBlock lastVersion="1.11">

:::tip
Обратите внимание, что мы используем точечную нотацию (`.`), чтобы указать, что один параметр вложен в другой параметр. Например, `base_measure.name` означает, что параметр `name` вложен в параметр `base_measure`.
:::

| Параметр | Описание | Обязательный | Тип |
| --- | --- | --- | --- |
| `name` | Имя метрики. | Required | String |
| `description` | Описание метрики. | Optional | String |
| `type` | Тип метрики (например, derived, ratio и т.д.). В данном случае должно быть указано значение `conversion`. | Required | String |
| `label` | Обязательная строка, определяющая отображаемое значение в downstream-инструментах. Принимает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Required | String |
| `type_params` | Конфигурации, специфичные для каждого типа метрик. | Required | Dict |
| `conversion_type_params` | Дополнительные настройки, специфичные для метрик конверсии. | Required | Dict |
| `entity` | Сущность для каждого события конверсии. | Required | String |
| `calculation` | Метод вычисления. Возможные значения: `conversion_rate` или `conversions`. По умолчанию используется `conversion_rate`. | Optional | String |
| `base_measure` | Набор входных параметров базовой меры. | Required | Dict |
| `base_measure.name` | Базовая мера события конверсии. | Required | String |
| `base_measure.fill_nulls_with` | Значение, которым следует заменять `null` в определении метрики (например, ноль). | Optional | Integer |
| `base_measure.join_to_timespine` | Логический параметр, указывающий, нужно ли присоединять агрегированную меру к таблице time spine для заполнения пропущенных дат. Значение по умолчанию — `false`. | Optional | Boolean |
| `base_measure.filter` | Необязательный `filter`, применяемый к базовой мере. | Optional | String |
| `conversion_measure` | Набор входных параметров меры конверсии. | Required | Dict |
| `conversion_measure.name` | Базовая мера события конверсии. | Required | String |
| `conversion_measure.fill_nulls_with` | Значение, которым следует заменять `null` в определении метрики (например, ноль). | Optional | Integer |
| `conversion_measure.join_to_timespine` | Логический параметр, указывающий, нужно ли присоединять агрегированную меру к таблице time spine для заполнения пропущенных дат. Значение по умолчанию — `false`. | Optional | Boolean |
| `window` | Временное окно для события конверсии, например 7 дней, 1 неделя, 3 месяца. По умолчанию — бесконечность. | Optional | String |
| `constant_properties` | Список константных свойств. | Optional | List |
| `base_property` | Свойство из базовой семантической модели, которое необходимо зафиксировать как константное. | Optional | String |
| `conversion_property` | Свойство из семантической модели конверсии, которое необходимо зафиксировать как константное. | Optional | String |

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Параметр | Описание | Обязательность | Тип |
| --- | --- | --- | --- |
| `name` | Название метрики. | Обязательный | Строка |
| `description` | Описание метрики. | Необязательный | Строка |
| `type` | Тип метрики. Для метрик конверсии укажите `conversion`. | Обязательный | Строка |
| `label` | Отображаемая подпись метрики. Допускает обычный текст, пробелы и кавычки. | Необязательный | Строка |
| `config` | Настройки конфигурации метрики. | Необязательный | Словарь |
| `config.group` | Группа, к которой относится метрика. | Необязательный | Строка |
| `config.tags` | Теги, связанные с метрикой. | Необязательный | Список |
| `config.meta` | Метаданные метрики. | Необязательный | Словарь |
| `entity` | Сущность для каждого события конверсии. | Обязательный | Строка |
| `calculation` | Метод расчёта: `conversion_rate` или `conversions`. По умолчанию — `conversion_rate`. | Необязательный | Строка |
| `base_metric` | Название базовой метрики или её конфигурация для события конверсии. Может быть строкой (названием метрики) или словарём (для дополнительной настройки). | Обязательный | Строка или словарь |
| `base_metric.name` | Название базовой метрики (при использовании формата словаря). | Обязательный | Строка |
| `base_metric.filter` | Фильтр, применяемый к базовой метрике (при использовании формата словаря). | Необязательный | Строка |
| `base_metric.alias` | Псевдоним базовой метрики (при использовании формата словаря). | Необязательный | Строка |
| `conversion_metric` | Название метрики конверсии или её конфигурация. Может быть строкой (названием метрики) или словарём (для дополнительной настройки). | Обязательный | Строка или словарь |
| `conversion_metric.name` | Название метрики конверсии (при использовании формата словаря). | Обязательный | Строка |
| `conversion_metric.filter` | Фильтр, применяемый к метрике конверсии (при использовании формата словаря). | Необязательный | Строка |
| `conversion_metric.alias` | Псевдоним метрики конверсии (при использовании формата словаря). | Необязательный | Строка |
| `window` | Временное окно для события конверсии (например, `7 days`, `1 week`, `3 months`). По умолчанию не ограничено. | Необязательный | Строка |
| `constant_properties` | Список свойств, значения которых должны оставаться неизменными между базовым событием и событием конверсии. Свойством может быть измерение или сущность.| Необязательный | Список |
| `constant_properties.base_property` | Измерение или сущность семантической модели, связанной с `base_metric`. | Обязательный | Строка |
| `constant_properties.conversion_property` | Измерение или сущность семантической модели, связанной с `conversion_metric`. | Обязательный | Строка |

</VersionBlock>

См. раздел [Дополнительные настройки](#additional-settings), чтобы узнать, как настроить метрики конверсии с помощью параметров для значений null, типа расчёта и свойств с неизменными значениями.

Следующий пример кода демонстрирует полную спецификацию для метрик конверсии и подробно описывает, как они применяются:

<VersionBlock lastVersion="1.11">

```yaml
metrics:
  - name: The metric name # Обязательный
    description: The metric description # Необязательный
    type: conversion # Обязательный
    label: YOUR_LABEL # Обязательный
    type_params: # Обязательный
      conversion_type_params: # Обязательный
        entity: ENTITY # Обязательный
        calculation: CALCULATION_TYPE # Необязательный. по умолчанию: conversion_rate. варианты: conversions(buys) или conversion_rate (buys/visits), и другие.
        base_measure: 
          name: The name of the measure # Обязательный
          fill_nulls_with: Set the value in your metric definition instead of null (such as zero) # Необязательный
          join_to_timespine: true/false # Булево значение, указывающее, следует ли объединять агрегированную меру с таблицей временной оси для заполнения отсутствующих дат. По умолчанию `false`. # Необязательный
          filter: The filter used to apply to the base measure. # Необязательный
        conversion_measure:
          name: The name of the measure # Обязательный
          fill_nulls_with: Set the value in your metric definition instead of null (such as zero) # Необязательный
          join_to_timespine: true/false # Булево значение, указывающее, следует ли объединять агрегированную меру с таблицей временной оси для заполнения отсутствующих дат. По умолчанию `false`. # Необязательный
        window: TIME_WINDOW # Необязательный. по умолчанию: бесконечность. окно для объединения двух событий. Следует аналогичному формату, как временные окна в других местах (например, 7 дней)
        constant_properties: # Необязательный. Список постоянных свойств по умолчанию: None
          - base_property: DIMENSION or ENTITY # Обязательный. Ссылка на измерение/сущность семантической модели, связанной с base_measure
            conversion_property: DIMENSION or ENTITY # То же, что и base выше, но для семантической модели conversion_measure
```

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml" >

```yaml
models:
  - name: your_model_name
    semantic_model:
      enabled: true
.... rest of configs....
    metrics:
      - name: my_conversion_metric
        description: "Отслеживает, как часто базовое событие приводит к событию конверсии для сущности"
        label: "Моя метрика конверсии"
        type: conversion
        entity: my_primary_entity   # Обязательно; сущность, для которой отслеживается конверсия
        calculation: conversion_rate       # Необязательно; conversion_rate | conversions
        base_metric: my_base_event_metric  # Обязательно; метрика, определённая в другой семантической модели
        conversion_metric: my_conversion_event_metric  # Обязательно; метрика, определённая в другой семантической модели
        window: 7 days   # Необязательно; определяет временное окно конверсии
        constant_properties:  # Необязательно; список постоянных свойств
          - base_property: my_dimension_or_entity
            conversion_property: my_dimension_or_entity

```
</File>

</VersionBlock>

## Пример метрики конверсии

Следующий пример измерит конверсии от посещений веб-сайта (`VISITS` таблица) до завершения заказа (`BUYS` таблица) и рассчитает метрику конверсии для этого сценария шаг за шагом.

Предположим, у вас есть две семантические модели, `VISITS` и `BUYS`:

- Таблица `VISITS` представляет посещения на сайте электронной коммерции.
- Таблица `BUYS` представляет завершение заказа на этом сайте.  

Исходные таблицы выглядят следующим образом:

`VISITS`<br />
Содержит посещения пользователей с `USER_ID` и `REFERRER_ID`.

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

<VersionBlock lastVersion="1.11">

```yaml
- name: visit_to_buy_conversion_rate_7d
  description: "Конверсия от посещения до транзакции за 7 дней"
  type: conversion
  label: Конверсия от посещения до покупки (7-дневное окно)
  type_params:
    conversion_type_params:
      base_measure:
        name: visits
        fill_nulls_with: 0
        filter: {{ Dimension('visits__referrer_id') }} = 'facebook'
      conversion_measure:
        name: buys
      entity: user
      window: 7 days
```
</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
models:
  - name: your_model_name
    semantic_model:
      enabled: true
.... rest of configs....
    metrics:
      - name: visit_to_buy_conversion_rate_7d
        description: "Conversion rate from visiting to transaction in 7 days"
        type: conversion
        label: Visit to buy conversion rate (7-day window)
        entity: user
        calculation: conversion_rate
        base_metric:
          name: visits
          filter: {{ Dimension('visits__referrer_id') }} = 'facebook'
        conversion_metric: buys
        window: 7 days
```
</VersionBlock>

Для расчета конверсии свяжите событие `BUYS` с ближайшим событием `VISITS` (или ближайшим базовым событием). Следующие шаги объясняют этот процесс более подробно:

### Шаг 1: Объедините `VISITS` и `BUYS` {#step-1-join-visits-and-buys}

Этот шаг объединяет таблицу `BUYS` с таблицей `VISITS` и получает все комбинации событий посещений-покупок, которые соответствуют условию объединения, где покупки происходят в течение 7 дней после посещения (любые строки, которые имеют того же пользователя и покупка произошла не более чем через 7 дней после посещения).

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

Набор данных возвращает следующее (обратите внимание, что для первого посещения есть два потенциальных события конверсии):

| V.DS | V.USER_ID | V.REFERRER_ID | B.DS | UUID | BUYS |
| --- | --- | --- | --- | --- | --- |
| 2020-01-01 | bob | facebook | 2020-01-02 | uuid1 | 1 |
| 2020-01-01 | bob | facebook | 2020-01-07 | uuid2 | 1 |
| 2020-01-04 | bob | google | 2020-01-07 | uuid2 | 1 |
| 2020-01-07 | bob | amazon | 2020-01-07 | uuid2 | 1 |

### Шаг 2: Уточните с помощью оконной функции {#step-2-refine-with-window-function}

Вместо возврата сырых значений посещений используйте оконные функции, чтобы связать конверсии с ближайшим базовым событием. Вы можете разделить по источнику конверсии и получить `first_value`, упорядоченный по `visit ds`, по убыванию, чтобы получить ближайшее базовое событие от события конверсии:

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

Этот рабочий процесс связывает две конверсии с правильными событиями посещения. Из-за объединения вы получаете несколько комбинаций, что приводит к результатам с разветвлением. После применения оконной функции появляются дубликаты.

Чтобы решить эту проблему и устранить дубликаты, используйте distinct select. UUID также помогает определить, какая конверсия уникальна. Следующие шаги предоставляют больше деталей о том, как это сделать.

### Шаг 3: Удалите дубликаты {#step-3-remove-duplicates}

Вместо обычного select, используемого в [Шаге 2](#step-2-refine-with-window-function), используйте distinct select, чтобы удалить дубликаты:

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

Теперь у вас есть набор данных, где каждая конверсия связана с событием посещения. Чтобы продолжить:

1. Сложите общее количество конверсий в таблице "conversions".
2. Объедините эту таблицу с таблицей "opportunities", сопоставив их на основе ключей группировки.
3. Рассчитайте коэффициент конверсии.

### Шаг 4: Агрегируйте и рассчитайте {#step-4-aggregate-and-calculate}

Теперь, когда вы связали каждое событие конверсии с посещением, можно рассчитать <VersionBlock lastVersion="1.11">меру</VersionBlock><VersionBlock firstVersion="1.12">простую метрику</VersionBlock> для агрегированных конверсий и возможностей. Затем можно объединить их, чтобы рассчитать фактический коэффициент конверсии. SQL-запрос для расчёта коэффициента конверсии выглядит следующим образом:

```sql
select
  coalesce(subq_3.metric_time__day, subq_13.metric_time__day) as metric_time__day,
  cast(max(subq_13.buys) as double) / cast(nullif(max(subq_3.visits), 0) as double) as visit_to_buy_conversion_rate_7d
from ( -- основа
  select
    metric_time__day,
    sum(visits) as visits
  from (
    select
      date_trunc('day', first_contact_date) as metric_time__day,
      1 as visits
    from visits
  ) subq_2
  group by
    metric_time__day
) subq_3
full outer join ( -- преобразование
  select
    metric_time__day,
    sum(buys) as buys
  from (
    -- ...
    -- Вывод этого подзапроса - таблица, полученная на Шаге 3. SQL скрыт для удобочитаемости.
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

### Дополнительные настройки {#additional-settings}

Используйте следующие дополнительные настройки, чтобы настроить ваши метрики конверсии:

- **Значения конверсии null:** Установите значения null конверсий в ноль, используя `fill_nulls_with`. Обратитесь к [Заполнению значений null для метрик](/docs/build/fill-nulls-advanced) для получения дополнительной информации.
- **Тип расчета:** Выберите между отображением сырых конверсий или коэффициента конверсии.
- **Постоянное свойство:** Добавьте условия для конкретных сценариев, чтобы объединить конверсии по постоянным свойствам.

<Tabs>
<TabItem value="null" label="Установить события конверсии null в ноль">

Чтобы вернуть ноль в итоговом наборе данных, вы можете установить значение события конверсии null в ноль вместо null. Вы можете добавить параметр `fill_nulls_with` в определение вашей метрики конверсии следующим образом:

<VersionBlock lastVersion="1.11">

```yaml
- name: visit_to_buy_conversion_rate_7_day_window
  description: "Коэффициент конверсии от просмотра страницы до покупки"
  type: conversion
  label: Коэффициент конверсии от посещения до продавца (7-дневное окно)
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
</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
metrics:
  - name: visits
    type: simple
    agg: count
    expr: visit_id
    fill_nulls_with: 0 # set null conversion values to zero in a simple metric
      
  - name: buys
    type: simple
    agg: count
    expr: purchase_id
    fill_nulls_with: 0
      
  - name: visit_to_buy_conversion_rate_7_day_window
    description: "Conversion rate from viewing a page to making a purchase"
    type: conversion
    label: Visit to buy conversion rate (7 day window)
    entity: user
    calculation: conversions
    base_metric: visits
    conversion_metric: buys
    window: 7 days
```
</VersionBlock>

Это вернет следующие результаты:

<Lightbox src="/img/docs/dbt-platform/semantic-layer/conversion-metrics-fill-null.png" width="75%" title="Метрика конверсии с заполнением значений null с помощью параметра"/>

Обратитесь к [Заполнению значений null для метрик](/docs/build/fill-nulls-advanced) для получения дополнительной информации.

</TabItem>

<TabItem value="calctype" label="Установить параметр типа расчета">

Используйте параметр расчета конверсии, чтобы либо показать сырое количество конверсий, либо коэффициент конверсии. Значение по умолчанию - коэффициент конверсии.

Вы можете изменить значение по умолчанию, чтобы отображать количество конверсий, установив параметр `calculation: conversion`:

<VersionBlock lastVersion="1.11">

```yaml
- name: visit_to_buy_conversions_1_week_window
    description: "Конверсии от посещения до покупки"
    type: conversion
    label: Конверсии от посещения до покупки (1-недельное окно)
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

</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
metrics:
  - name: visit_to_buy_conversions_1_week_window
    description: "Visit to buy conversions"
    type: conversion
    label: Visit to buy conversions (1 week window)
    entity: user
    calculation: conversions
    base_metric: visits
    conversion_metric: buys
    window: 1 week
    fill_nulls_with: 0
```

</VersionBlock>

</TabItem>

<TabItem value="constproperty" label="Установить постоянное свойство">

*Обратитесь к [блогам Amplitude о постоянных свойствах](https://amplitude.com/blog/holding-constant), чтобы узнать об этой концепции.*

Вы можете добавить постоянное свойство к метрике конверсии, чтобы учитывать только те конверсии, где конкретное измерение или сущность совпадают как в базовых, так и в событиях конверсии.

Например, если вы работаете в компании электронной коммерции и хотите ответить на следующий вопрос:
- _Как часто посетители конвертировались из `Просмотра деталей товара` в `Завершение покупки` с тем же продуктом на каждом этапе?_<br />
  - Этот вопрос сложно ответить, потому что пользователи могли завершить эти два этапа конверсии по многим продуктам. Например, они могли просмотреть пару обуви, затем футболку, и в конечном итоге оформить заказ с бабочкой. Это все равно будет считаться конверсией, даже если событие конверсии произошло только для бабочки.

Возвращаясь к первоначальным вопросам, вы хотите увидеть, сколько клиентов просмотрели страницу деталей товара, а затем завершили покупку для _того же_ продукта.

В этом случае вы хотите установить `product_id` как постоянное свойство. Вы можете указать это в конфигурациях следующим образом:

<VersionBlock lastVersion="1.11">

```yaml
- name: view_item_detail_to_purchase_with_same_item
description: "Коэффициент конверсии пользователей, которые просмотрели страницу с подробной информацией о товаре и приобрели его"
  type: conversion
  label: Просмотр подробной информации о товаре > Покупка
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

</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
metrics:
  - name: view_item_detail_to_purchase_with_same_item
    description: "Conversion rate for users who viewed the item detail page and purchased the item"
    type: conversion
    label: View item detail > Purchase
    entity: user
    calculation: conversions
    base_metric: view_item_detail
    conversion_metric: purchase
    window: 1 week
    constant_properties:
      - base_property: product
        conversion_property: product
```
</VersionBlock>

Вы добавите дополнительное условие соединения, чтобы значение постоянного свойства совпадало у исходного события и события конверсии.

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
  and buy_source.product_id = v.product_id --Объединение по постоянному свойству product_id
```

</TabItem>
</Tabs>

## Связанные документы {#related-docs}
- [Заполнение значений null для метрик](/docs/build/fill-nulls-advanced)