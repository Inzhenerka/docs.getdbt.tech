---
title: Измерения
id: dimensions
description: "Измерения определяют уровень агрегации для метрики и являются неагрегируемыми выражениями."
sidebar_label: "Измерения"
tags: [Metrics, Semantic Layer]
availability: all_users
---

<VersionBlock lastVersion="1.11">

Измерения представляют собой неагрегируемые столбцы в вашем наборе данных — атрибуты, признаки или характеристики, которые описывают или классифицируют данные. В контексте <Constant name="semantic_layer" /> измерения являются частью более крупной структуры, называемой семантической моделью. Они создаются вместе с другими элементами, такими как [сущности](/docs/build/entities) и [меры](/docs/build/measures), и используются для добавления дополнительных сведений к данным. В SQL измерения обычно включаются в предложение `group by` SQL-запроса.

</VersionBlock>

<VersionBlock firstVersion="1.12">

Измерения представляют собой неагрегируемые столбцы в вашем наборе данных — атрибуты, признаки или характеристики, которые описывают или классифицируют данные. В контексте <Constant name="semantic_layer" /> измерения являются частью более крупной структуры, называемой семантической моделью. Они создаются вместе с другими элементами, такими как [сущности](/docs/build/entities) и [простые метрики](/docs/build/simple), и используются для добавления дополнительных сведений к данным. В SQL измерения обычно включаются в предложение `group by` SQL-запроса.

</VersionBlock>



<!--измерения — это неагрегируемые выражения, которые определяют уровень агрегации метрики и задают, как данные разбиваются на срезы или группируются в метрике. Поскольку группы нельзя агрегировать, они считаются свойством первичной или уникальной сущности таблицы.

Группы определяются в семантических моделях наряду с сущностями и мерами и соответствуют неагрегируемым столбцам в вашей модели dbt, которые предоставляют категориальный или временной контекст. В SQL измерения обычно включаются в предложение GROUP BY.-->

<VersionBlock lastVersion="1.11">

Для всех измерений необходимо указать `name` и `type`; также можно добавить необязательный параметр `expr`. Значение `name` для измерения должно быть уникальным в пределах одной семантической модели.


| Параметр | Описание | Обязательный | Тип |
| --------- | ----------- | ---- | ---- |
| `name` | Ссылается на имя группы, которое будет видно пользователю в downstream‑инструментах. Также может использоваться как алиас, если имя колонки или ссылка на SQL‑выражение отличаются и заданы в параметре `expr`. <br /><br /> Имена измерений должны быть уникальными внутри одного семантического модели, но могут повторяться между разными моделями, так как MetricFlow использует [joins](/docs/build/join-logic) для определения корректного измерения. | Required | String |
| `type` | Задает тип группы, создаваемой в семантической модели. Существует два типа:<br /><br />- **Categorical**: Описывает атрибуты или характеристики, например географию или регион продаж. <br />- **Time**: Временные измерения, такие как временные метки или даты. | Required | String |  
| `type_params` | Специфичные параметры типа, например является ли время первичным или используется ли оно как партиция. | Required | Dict |
| `description` | Понятное описание измерения. | Optional | String |  
| `expr` | Определяет базовую колонку или SQL‑выражение для измерения. Если `expr` не указан, MetricFlow будет использовать колонку с тем же именем, что и у группы. В качестве SQL‑выражения можно передать само имя колонки. | Optional | String |
| `label` | Определяет отображаемое значение в downstream‑инструментах. Принимает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Optional | String |
| [`meta`](/reference/resource-configs/meta) | Задает метаданные для ресурса и используется для организации ресурсов. Принимает обычный текст, пробелы и кавычки. | Optional | Dictionary |

Обратитесь к следующему для полной спецификации измерений:

```yaml
dimensions:
  - name: Имя группы, которое будет видно пользователю в инструментах нижнего уровня # Обязательный
    type: Категориальный или Временной # Обязательный
    label: Рекомендуется добавить строку, определяющую отображаемое значение в инструментах нижнего уровня. # Необязательный
    type_params: Специфические параметры типа, такие как, например, является ли время основным или используется в качестве раздела # Обязательный
    description: Как всегда # Необязательный
    expr: Имя столбца или выражение. Если не указано, по умолчанию используется имя измерения # Необязательный
```

</VersionBlock>

<VersionBlock firstVersion="1.12">

Измерения определяются для столбцов, которым они соответствуют, поэтому для них требуется только `type`. По умолчанию `name` совпадает с именем столбца и должно быть уникальным в пределах одной семантической модели.

:::note
В блоке `dimension` нельзя использовать `expr`. Чтобы определить измерение на основе SQL-выражения, а не отдельного столбца, используйте [`derived_semantics`](#derived_semantics-in-dimensions).
:::

| Параметр | Описание | Обязательность | Тип |
| --------- | ----------- | ---- | ---- |
| `name` |  Имя измерения, которое будет видно пользователю в инструментах, использующих эти данные. Оно также может служить псевдонимом для производных измерений. <br /><br /> Имена измерений должны быть уникальными в пределах семантической модели, но могут повторяться в разных моделях, поскольку MetricFlow использует [соединения](/docs/build/join-logic) для определения нужного измерения. | Необязательный (по умолчанию совпадает с именем столбца) | Строка |
| `type` | Указывает тип группировки, создаваемой в семантической модели. Существует два типа:<br /><br />- **Категориальный**: описывает атрибуты или характеристики, например географическое положение или регион продаж. <br />- **Временной**: измерения на основе времени, например временные метки или даты. | Обязательный | Строка |  
| `description` | Понятное описание измерения. | Необязательный | Строка |  
| `label` | Определяет отображаемое значение в инструментах, использующих эти данные. Допускает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`).  | Необязательный | Строка |
| [`meta`](/reference/resource-configs/meta) |  Задает метаданные ресурса и позволяет организовывать ресурсы. Допускает обычный текст, пробелы и кавычки. | Необязательный | Словарь | 

Полная спецификация измерений приведена ниже:

```yaml
models:
  - name: Model name # Required
    semantic_model:
      enabled: true # bool. Required

    columns: # Any column can have either an entity or a dimension, but not both
      - name: my_dimension_column # Required
        description: Column description # Optional
        dimension:
          name: my_dimension # Optional, defaults to column name
          type: categorical # Required. Accepted values: categorical | time
          label: Recommended adding a string that defines the display value in downstream tools # Optional
          description: Same as always # Optional, defaults to the column description if not otherwise specified
```

</VersionBlock>

Следующий пример показывает, как измерения используются в семантической модели:

<VersionBlock firstVersion="1.9" lastVersion="1.11">

```yaml
semantic_models:
  - name: transactions
description: Запись для каждой совершённой транзакции. Корзины учитываются как несколько транзакций для каждого SKU. 
    model: {{ ref('fct_transactions') }}
    defaults:
      agg_time_dimension: order_date
# --- сущности --- 
  entities: 
    - name: transaction
      type: primary
      ...
# --- меры --- 
  measures: 
      ... 
# --- измерения ---
  dimensions:
    - name: order_date
      type: time
      type_params:
        time_granularity: day
      label: "Date of transaction" # Рекомендуется добавить label, чтобы предоставить больше контекста пользователям, которые потребляют эти данные
      config: 
        meta:
          data_owner: "Finance team"
      expr: ts
    - name: is_bulk
      type: categorical
      expr: case when quantity > 10 then true else false end
    - name: type
      type: categorical
```
</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
models:
  - name: fct_transactions
    semantic_model:
      enabled: true
      name: transactions

    agg_time_dimension: order_date


    columns:
      # --- entities ---
      - name: transaction_column
        entity:
          type: primary
          name: transaction

      # --- dimensions tied 1:1 to columns ---
      - name: another_transaction_column
        granularity: day
        dimension:
          type: time
          name: order_date
          label: "Date of transaction"
          description: "A record for every transaction that takes place. Carts are considered multiple transactions for each SKU."

      - name: type
        dimension:
          type: categorical
          name: type
```

## `derived_semantics` в `dimensions` {#derived_semantics-in-dimensions}

Используйте ключ `derived_semantics` в YAML-описании модели, когда нужно определить измерение, которое не соответствует напрямую одному физическому столбцу в соотношении 1:1. При использовании `derived_semantics` поле `expr` обязательно.

```yaml
models: 
  - name: my_model
    semantic_model:
      enabled: true
    ...
    derived_semantics: 
      dimensions:
        - name: is_bulk
          type: categorical
          expr: "case when quantity > 10 then true else false end" # Required
```

</VersionBlock>

<VersionBlock lastVersion="1.11">

Измерения привязаны к первичной сущности семантической модели, в которой они определены. Например, измерение `type` определено в модели, где первичной сущностью является `transaction`. Измерение `type` относится к сущности `transaction`, и для обращения к этому измерению нужно использовать его полное имя, то есть `transaction__type`.

MetricFlow требует, чтобы все семантические модели имели основную сущность. Это необходимо для гарантии уникальности имен измерений. Если в вашем источнике данных нет основной сущности, вам нужно назначить сущности имя, используя ключ `primary_entity`. Это не обязательно должно соответствовать столбцу в этой таблице, и назначение имени не влияет на генерацию запросов. Мы рекомендуем делать эти "виртуальные основные сущности" уникальными в вашей семантической модели. Пример определения основной сущности для источника данных, у которого нет столбца основной сущности, приведен ниже:

```yaml
semantic_model:
  name: bookings_monthly_source
  description: bookings_monthly_source
  defaults:
    agg_time_dimension: ds
  model: ref('bookings_monthly_source')
  measures:
    - name: bookings_monthly
      agg: sum
      create_metric: true
  primary_entity: booking_id
```
</VersionBlock>

<VersionBlock firstVersion="1.12">

Измерения привязаны к первичной сущности семантической модели, в которой они определены.

MetricFlow требует первичную сущность в каждой семантической модели, чтобы имена измерений были уникальными. Если у источника данных нет первичной сущности, задайте ей имя с помощью ключа `entity`. Имя может не соответствовать столбцу таблицы и не влияет на генерацию запросов. Используйте уникальные имена для таких виртуальных первичных сущностей. Ниже показано, как определить первичную сущность:

```yaml
models:
  - name: bookings_monthly_source
    semantic_model:
      enabled: true

    agg_time_dimension: ds

    columns:
      # Primary entity
      - name: booking_id
        entity:
          type: primary
          name: booking_id

      - name: order_date
        granularity: day
        dimension:
          type: time
          label: "Date"

    metrics:
      - name: bookings_monthly
        type: simple
        agg: sum
```

Первичную сущность можно объявить, даже если в таблице нет столбца с физическим первичным ключом. Чтобы задать детализацию модели, укажите `primary_entity`. В новой спецификации YAML детализация модели соответствует этой сущности.

```yaml
models:
  - name: model_without_pk
    semantic_model:
      enabled: true
    primary_entity: order  # "virtual primary entity"
    columns:
      - name: customer_id
        entity: foreign
```

</VersionBlock>

## Типы измерений {#dimensions-types}
В этом разделе более подробно объясняются определения измерений с примерами. Измерения имеют следующие типы:

- [`derived_semantics` в `dimensions`](#derived_semantics-in-dimensions)
- [Типы измерений](#dimensions-types)
- [Категориальные](#categorical)
- [Временные](#time)
  - [SCD типа II](#scd-type-ii)
    - [Базовая структура](#basic-structure)
    - [Параметры и ключи семантической модели](#semantic-model-parameters-and-keys)
    - [Реализация](#implementation)
    - [Примеры SCD](#scd-examples)

## Категориальные {#categorical}

Категориальные измерения используются для группировки метрик по различным атрибутам, признакам или характеристикам, например по типу продукта.

<VersionBlock firstVersion="1.9" lastVersion="1.11">

Измерения могут ссылаться на существующие столбцы модели dbt или вычисляться через SQL-выражение в параметре `expr`. Например, категориальное измерение `is_bulk_transaction` вычисляется выражением `CASE` по столбцу `quantity` и позволяет группировать или фильтровать данные по признаку оптовой покупки.

```yaml
dimensions: 
  - name: is_bulk_transaction
    type: categorical
    expr: case when quantity > 10 then true else false end
    config:
      meta:
        usage: "Filter to identify bulk transactions, like where quantity > 10."
```
</VersionBlock>

<VersionBlock firstVersion="1.12">

Определите категориальное измерение для нужного столбца. Например, столбец `transaction_type` становится измерением, по которому можно группировать или фильтровать метрики:

```yaml
models:
  - name: fct_transactions
    semantic_model:
      enabled: true

    columns:
      - name: transaction_type
        dimension:
          type: categorical
          config:
            meta:
              usage: "Group transactions by their type, like refund or purchase."
```

Чтобы вычислить категориальное измерение по SQL-выражению, определите его в [`derived_semantics`](#derived_semantics-in-dimensions) и задайте `expr`. Например, измерение `is_bulk_transaction` вычисляется выражением `CASE` по столбцу `quantity` и позволяет группировать или фильтровать данные по признаку оптовой покупки:

```yaml
models:
  - name: fct_transactions
    semantic_model:
      enabled: true

    derived_semantics:
      dimensions:
        - name: is_bulk_transaction
          type: categorical
          expr: "case when quantity > 10 then true else false end"
```

</VersionBlock>


## Временные {#time}

<VersionBlock lastVersion="1.11">

Для времени предусмотрены дополнительные параметры, которые задаются в разделе `type_params`. При запросе одной или нескольких метрик временным измерением по умолчанию для каждой метрики является временное измерение агрегации, к которому можно обращаться как `metric_time` или по имени самого измерения. 

</VersionBlock>
<VersionBlock firstVersion="1.12">

Временные измерения больше не используют `type_params`. 
- Для измерений, определённых в записи столбца, добавьте `granularity` на уровне столбца. 
- Для производных измерений добавьте `granularity` в конфигурацию измерения. 

Временное измерение агрегации по умолчанию для семантической модели задаётся свойством `agg_time_dimension` на верхнем уровне модели. Метрика может переопределить его с помощью собственного свойства `agg_time_dimension`. Подробнее см. в разделе [Миграция на последнюю версию спецификации YAML](/docs/build/latest-metrics-spec).

В разных метриках можно использовать несколько временных групп. Например, метрика `users_created` использует `created_at`, а метрика `users_deleted` — `deleted_at`:
</VersionBlock>

```bash
# Пользователи dbt
dbt sl query --metrics users_created,users_deleted --group-by metric_time__year --order-by metric_time__year

# dbt v1 users
mf query --metrics users_created,users_deleted --group-by metric_time__year --order-by metric_time__year
```

Вы можете задать `is_partition` для временного измерения, чтобы определить конкретные временные интервалы. <VersionBlock lastVersion="1.11">Кроме того, используйте раздел `type_params`, чтобы задать `time_granularity` и настроить детализацию агрегации (по дням, неделям и так далее).</VersionBlock>

<Tabs queryString="dimension">

<TabItem value="is_partition" label="is_partition">

Используйте `is_partition: True`, чтобы указать, что измерение существует в рамках определённого временного окна. Например, для размерной таблицы, разбитой по датам. Когда вы запрашиваете метрики из разных таблиц, <Constant name="semantic_layer" /> использует этот параметр, чтобы гарантировать, что к показателям будут корректно присоединены соответствующие размерные значения.

<VersionBlock firstVersion="1.9" lastVersion="1.11">

```yaml
dimensions: 
  - name: created_at
    type: time
label: "Дата создания"
expr: ts_created # ts_created — это имя исходного столбца из таблицы
config:
  meta:
    notes: "Актуально только для заказов, начиная с 2022 года"
    is_partition: True
    type_params:
      time_granularity: day
  - name: deleted_at
    type: time
    label: "Дата удаления"
    expr: ts_deleted # ts_deleted - это базовое имя столбца из таблицы
    is_partition: True 
    type_params:
      time_granularity: day

measures:
  - name: users_deleted
    expr: 1
    agg: sum
    agg_time_dimension: deleted_at
  - name: users_created
    expr: 1
    agg: sum
```
</VersionBlock>
<VersionBlock firstVersion="1.12">

```yaml
models:
  - name: orders
    semantic_model:
      enabled: true

    agg_time_dimension: created_at

    columns:
      - name: ts_created
        granularity: day
        dimension:
          type: time
          name: created_at
          label: "Date of creation"
          config:
            meta:
              notes: "Only valid for orders from 2022 onward"
          is_partition: true

      - name: ts_deleted
        granularity: day
        dimension:
          type: time
          name: deleted_at
          label: "Date of deletion"
          is_partition: true

    metrics:
      - name: users_deleted
        type: simple
        agg: sum
        expr: 1
        agg_time_dimension: deleted_at

      - name: users_created
        type: simple
        agg: sum
        expr: 1
```


</VersionBlock>

</TabItem>

<TabItem value="time_gran" label="time_granularity">

<VersionBlock firstVersion="1.9" lastVersion="1.11">

`time_granularity` указывает зернистость временного измерения. MetricFlow преобразует базовый столбец в указанную зернистость. Например, если вы добавите часовую зернистость к столбцу временного измерения, MetricFlow выполнит функцию `date_trunc`, чтобы преобразовать временную метку в часовую. Вы можете легко изменить временную зернистость во время запроса и агрегировать ее до более грубой зернистости, например, с часовой до месячной. Однако вы не можете перейти от более грубой зернистости к более тонкой (с месячной до часовой).

Поддерживаемые нами зернистости:
* наносекунда (только Snowflake)
* микросекунда 
* миллисекунда
* секунда
* минута
* час
* день
* неделя
* месяц
* квартал
* год

Агрегация между метриками с разной гранулярностью возможна: по умолчанию <Constant name="semantic_layer" /> возвращает результаты на самой грубой (наименее детализированной) гранулярности. Например, при запросе двух метрик с дневной и месячной гранулярностью итоговая агрегация будет выполнена на месячном уровне.

```yaml
dimensions: 
  - name: created_at
    type: time
    label: "Дата создания"
    expr: ts_created # ts_created - это базовое имя столбца из таблицы 
    is_partition: True 
    type_params:
      time_granularity: hour 
  - name: deleted_at
    type: time
    label: "Дата удаления"
    expr: ts_deleted # ts_deleted - это базовое имя столбца из таблицы 
    is_partition: True 
    type_params:
      time_granularity: day 

measures:
  - name: users_deleted
    expr: 1
    agg: sum 
    agg_time_dimension: deleted_at
  - name: users_created
    expr: 1
    agg: sum
```

</VersionBlock>

<VersionBlock firstVersion="1.12">

Параметр `granularity` задаёт детализацию временного измерения. MetricFlow приводит исходный столбец к заданной детализации. Например, при почасовой детализации он округляет метку времени до часа с помощью `date_trunc`. При запросе можно перейти к более крупному интервалу, например от часа к месяцу. Обратный переход невозможен.

Поддерживаемые уровни детализации:
* `nanosecond` (только Snowflake)
* microsecond 
* millisecond
* second
* minute
* hour
* day
* week
* month
* quarter
* year

Метрики с разной детализацией можно агрегировать вместе. По умолчанию <Constant name="semantic_layer" /> возвращает результат на самом крупном уровне. Например, при совместном запросе дневной и месячной метрик результат будет агрегирован по месяцам.

```yaml
models:
  - name: your_model_name
    semantic_model:
      enabled: true

    agg_time_dimension: created_at

    columns:
      - name: ts_created
        granularity: hour
        dimension:
          type: time
          name: created_at
          label: "Date of creation"
          is_partition: true

      - name: ts_deleted
        granularity: day
        dimension:
          type: time
          name: deleted_at
          label: "Date of deletion"
          is_partition: true

    metrics:
      - name: users_deleted
        type: simple
        agg: sum
        expr: 1
        agg_time_dimension: deleted_at

      - name: users_created
        type: simple
        agg: sum
        expr: 1
```

</VersionBlock>

</TabItem>

</Tabs>

<VersionBlock firstVersion="1.12">

Чтобы создать временное измерение на основе SQL-выражения, а не отдельного столбца, определите его в разделе [`derived_semantics`](#derived_semantics-in-dimensions) и добавьте `expr` и `granularity`. Например, `order_month` усекает `ts_created` до месяца:

```yaml
models:
  - name: orders
    semantic_model:
      enabled: true

    derived_semantics:
      dimensions:
        - name: order_month
          type: time
          granularity: month
          expr: "date_trunc('month', ts_created)"
```

</VersionBlock>

### SCD типа II {#scd-type-ii}

<VersionBlock lastVersion="1.11">
:::caution
В настоящее время семантические модели с измерениями SCD Типа II не могут содержать меры.
:::
</VersionBlock>

<VersionBlock firstVersion="1.12">
:::caution
Сейчас семантические модели с измерениями SCD типа II не могут содержать простые метрики.
:::
</VersionBlock>

MetricFlow поддерживает соединения с значениями измерений в семантической модели, построенной на основе таблицы медленно изменяющихся измерений (SCD) Типа II. Это полезно, когда вам нужна определенная метрика, разбитая по группе, которая меняется со временем, например, исторические тенденции продаж по стране клиента.

#### Основная структура {#basic-structure}

SCD типа II — это группы, значения которых изменяются с более крупным временным шагом. Таблицы SCD типа II обычно содержат два временных столбца, которые указывают период действия измерения: `valid_from` (или `tier_start`) и `valid_to` (или `tier_end`). Таким образом формируется набор строк с разными значениями измерения для метрики<VersionBlock lastVersion="1.11"> или меры</VersionBlock>, каждая из которых действительна в определённом временном диапазоне.

MetricFlow связывает метрику с самым ранним доступным значением измерения в пределах более грубого временного окна, например, месяца. По умолчанию используется группа, действительная в начале этой временной зернистости.

MetricFlow поддерживает следующую основную структуру таблицы данных платформы SCD Типа II:

| entity_key | dimensions_1 | dimensions_2 | ... | dimensions_x | valid_from | valid_to |
|------------|-------------|-------------|-----|-------------|------------|----------|
| 123 | value_a | value_x | ... | value_n | 2024-01-01 | 2024-06-30 |
| 123 | value_b | value_y | ... | value_m | 2024-07-01 | 2024-12-31 |  

* `entity_key` (обязательно): Уникальный идентификатор для каждой строки в таблице, такой как первичный ключ или другой уникальный идентификатор, специфичный для сущности.
* `valid_from`  (обязательно): Дата начала действия измерения. Используйте `validity_params: is_start: True` в семантической модели, чтобы указать это.
* `valid_to`  (обязательно): Дата окончания действия измерения. Используйте `validity_params: is_end: True` в семантической модели, чтобы указать это.

#### Параметры и ключи семантической модели {#semantic-model-parameters-and-keys}
При настройке таблицы SCD Типа II в семантической модели используйте `validity_params`, чтобы указать начало (`valid_from`) и конец (`valid_to`) периода действия для каждого измерения. 

- `validity_params`: Параметры, определяющие период действия.
  - `is_start: True`: Указывает начало периода действия. Отображается как `valid_from` в таблице SCD.
  - `is_end: True`: Указывает конец периода действия. Отображается как `valid_to` в таблице SCD.

Вот пример конфигурации:

<VersionBlock lastVersion="1.11">

```yaml
- name: tier_start # Имя измерения.
  type: time # Тип измерения (например, временной)
  label: "Дата начала уровня" # Читаемая метка для измерения
  expr: start_date # Выражение или имя столбца, которое представляет измерение
  type_params: # Дополнительные параметры для типа измерения
    time_granularity: day # Указывает зернистость временного измерения (например, день)
    validity_params: # Определяет период действия
      is_start: True # Указывает начало периода действия. 
- name: tier_end 
  type: time
  label: "Дата окончания уровня"
  expr: end_date
  type_params:
    time_granularity: day
    validity_params:
      is_end: True # Указывает конец периода действия.
```

</VersionBlock>
<VersionBlock firstVersion="1.12">

```yaml
models:
  - name: tiers
    semantic_model:
      enabled: true
    
    agg_time_dimension: tier_start

    columns:
      - name: start_date
        granularity: day
        dimension:
          type: time # Тип измерения
          name: tier_start # Имя измерения.
          label: "Start date of tier" # Понятная подпись для измерения
          validity_params: # Определяет период действия
            is_start: true # Указывает начало периода действия

      - name: end_date
        granularity: day
        dimension:
          type: time
          name: tier_end
          label: "End date of tier"
          validity_params:
            is_end: true # Указывает конец периода действия
```

</VersionBlock>

В таблицах SCD типа II есть специальное измерение с датами начала и окончания действия. Чтобы соединять таблицы:
- Задайте для дополнительного параметра [сущности `type`](/docs/build/entities#entity-types) значение `natural`. 
- Используйте ключ `natural` в качестве [типа сущности (`type`)](/docs/build/entities#entity-types) — в этом случае ключ `primary` не нужен.
- В большинстве случаев в таблицах SCD нет логически пригодного для использования ключа `primary`, поскольку ключи `natural` соответствуют нескольким строкам.

#### Реализация {#implementation}

Вот некоторые рекомендации, которые следует учитывать при реализации таблиц SCD Типа II:

- Таблица SCD должна иметь временные измерения `valid_to` и `valid_from`, которые являются логическими конструкциями.
- Свойства `valid_from` и `valid_to` должны быть указаны ровно один раз для каждой конфигурации таблицы SCD.
- Свойства `valid_from` и `valid_to` не должны использоваться или указываться на одном и том же временном измерении.
- Временные измерения `valid_from` и `valid_to` должны охватывать неперекрывающийся период, где одна строка соответствует каждому значению естественного ключа (то есть они не должны перекрываться и должны быть различными).
- Мы рекомендуем определять базовую модель dbt с помощью [снимков dbt](/docs/build/snapshots). Это поддерживает макет таблицы SCD Типа II и гарантирует, что таблица обновляется с последними данными.

Это пример SQL-кода, который показывает, как пример метрики, называемой `num_events`, соединяется с данными версионных измерений (хранящимися в таблице, называемой `scd_dimensions`) с использованием первичного ключа, состоящего из столбцов `entity_key` и `timestamp`. 

```sql
select metric_time, dimensions_1, sum(1) as num_events
from events a
left outer join scd_dimensions b
on 
  a.entity_key = b.entity_key 
  and a.metric_time >= b.valid_from 
  and (a.metric_time < b. valid_to or b.valid_to is null)
group by 1, 2
```

#### Примеры SCD {#scd-examples}

Ниже приведены примеры использования таблиц SCD Типа II в семантической модели:

<Expandable alt_header="Измерения SCD для уровней продаж и продолжительности этого уровня.">

Этот пример показывает, как создать медленно изменяющиеся измерения (SCD) с использованием семантической модели. Таблица SCD содержит информацию об уровне продавцов и продолжительности этого уровня. Предположим, у вас есть базовая таблица SCD:

| sales_person_id | tier | start_date | end_date | 
|-----------------|------|------------|----------|
| 111             | 1    | 2019-02-03 | 2020-01-05| 
| 111             | 2    | 2020-01-05 | 2048-01-01| 
| 222             | 2    | 2020-03-05 | 2048-01-01| 
| 333             | 2    | 2020-08-19 | 2021-10-22| 
| 333             | 3    | 2021-10-22 | 2048-01-01|  

Как упоминалось ранее, `validity_params` включают два важных аргумента, которые указывают столбцы в таблице SCD, отмечающие даты начала и окончания (или временные метки) для каждого уровня или измерения:
- `is_start`
- `is_end`

Кроме того, сущность помечена как `natural`, чтобы отличить ее от `primary` сущности. В `primary` сущности каждое значение сущности имеет одну строку. В отличие от этого, `natural` сущность имеет одну строку для каждой комбинации значения сущности и периода его действия.


<VersionBlock lastVersion="1.11">

```yaml 
semantic_models:
  - name: sales_person_tiers
    description: SCD Тип II таблица уровней для продавцов 
    model: {{ ref('sales_person_tiers') }}
    defaults:
      agg_time_dimension: tier_start

    dimensions:
      - name: tier_start
        type: time
        label: "Дата начала уровня"
        expr: start_date
        type_params:
          time_granularity: day
          validity_params:
            is_start: True
      - name: tier_end 
        type: time
        label: "Дата окончания уровня"
        expr: end_date
        type_params:
          time_granularity: day
          validity_params:
            is_end: True
      - name: tier
        type: categorical

    primary_entity: sales_person

    entities:
      - name: sales_person
        type: natural 
        expr: sales_person_id
```

</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
models:
  - name: sales_person_tiers
    semantic_model:
      enabled: true

    agg_time_dimension: tier_start

    # You can use a virtual primary entity name
    primary_entity: sales_person

    columns:
      - name: start_date
        granularity: day
        dimension:
          type: time
          name: tier_start
          label: "Start date of tier"
          validity_params:
            is_start: true

      - name: end_date
        granularity: day
        dimension:
          type: time
          name: tier_end
          label: "End date of tier"
          validity_params:
            is_end: true

      - name: tier
        dimension:
          type: categorical
          name: tier

      - name: sales_person_id
        entity:
          type: natural
          name: sales_person
```
</VersionBlock>

Следующий код представляет отдельную семантическую модель, содержащую таблицу фактов для `transactions`:

<VersionBlock lastVersion="1.11">

```yaml
semantic_models: 
  - name: transactions 
    description: |
Каждая строка представляет одну транзакцию.
      Для каждой транзакции указаны идентификаторы транзакции, продукта, продавца и
      клиента. Каждой транзакции соответствует только один
      идентификатор транзакции. Значение `metric_time`, или дата, указано в UTC.
    model: {{ ref('fct_transactions') }}
    defaults:
      agg_time_dimension: metric_time

    entities:
      - name: transaction_id
        type: primary
      - name: customer
        type: foreign
        expr: customer_id
      - name: product
        type: foreign
        expr: product_id
      - name: sales_person
        type: foreign
        expr: sales_person_id

    measures:
      - name: transactions
        expr: 1
        agg: sum
      - name: gross_sales
        expr: sales_price
        agg: sum
      - name: sales_persons_with_a_sale
        expr: sales_person_id
        agg: count_distinct

    dimensions:
      - name: metric_time
        type: time
        label: "Дата транзакции"
        is_partition: true
        type_params:
          time_granularity: day
      - name: sales_geo
        type: categorical
```

</VersionBlock>
<VersionBlock firstVersion="1.12">

```yaml
models:
  - name: fct_transactions
    semantic_model:
      enabled: true

    agg_time_dimension: metric_time

    columns:
      - name: transaction_id
        entity:
          type: primary
          name: transaction_id

      - name: customer_id
        entity:
          type: foreign
          name: customer

      - name: product_id
        entity:
          type: foreign
          name: product

      - name: sales_person_id
        entity:
          type: foreign
          name: sales_person

      - name: metric_time
        granularity: day
        dimension:
          type: time
          name: metric_time
          label: "Date of transaction"
          is_partition: true

      - name: sales_geo
        dimension:
          type: categorical
          name: sales_geo

    metrics:
      - name: transactions
        type: simple
        agg: sum
        expr: 1

      - name: gross_sales
        type: simple
        agg: sum
        expr: sales_price

      - name: sales_persons_with_a_sale
        type: simple
        agg: count_distinct
        expr: sales_person_id
```

</VersionBlock>

Теперь вы можете обращаться к метрикам в семантической модели `transactions` в разрезе медленно изменяющегося измерения `tier`.

В примере с уровнем продаж, если продавец был на уровне 1 с 2022-03-01 по 2022-03-12, и был повышен до уровня 2 с 2022-03-12, все транзакции за март будут отнесены к уровню 1, так как значение измерения уровня 1 приходит раньше (и является точкой начала по умолчанию), даже если продавец был повышен до уровня 2 2022-03-12.

</Expandable>

<Expandable alt_header="Измерения SCD с уровнями продаж и группировкой транзакций по месяцам, когда уровни отсутствуют" anchor_id="scd-details-2">

Этот пример показывает, как создать медленно изменяющиеся измерения (SCD) с использованием семантической модели. Таблица SCD содержит информацию об уровне продавцов и продолжительности этого уровня. Предположим, у вас есть базовая таблица SCD:

| sales_person_id | tier | start_date | end_date | 
|-----------------|------|------------|----------|
| 111             | 1    | 2019-02-03 | 2020-01-05| 
| 111             | 2    | 2020-01-05 | 2048-01-01| 
| 222             | 2    | 2020-03-05 | 2048-01-01| 
| 333             | 2    | 2020-08-19 | 2021-10-22| 
| 333             | 3    | 2021-10-22 | 2048-01-01|  

В примере с уровнем продаж, если sales_person_id 456 находится на уровне 2 с 2022-03-08, но для этого человека нет связанного уровня с 2022-03-01 по 2022-03-08, то все транзакции, связанные с sales_person_id 456 за март, будут сгруппированы под 'NA', так как до уровня 2 нет уровня.

Следующая команда или код представляет, как вернуть количество транзакций, сгенерированных каждым уровнем продаж за месяц:

```bash
# Пользователи платформы dbt
dbt sl query --metrics transactions --group-by metric_time__month,sales_person__tier --order-by metric_time__month,sales_person__tier

# Пользователи dbt v1
mf query --metrics transactions --group-by metric_time__month,sales_person__tier --order-by metric_time__month,sales_person__tier

```

</Expandable>