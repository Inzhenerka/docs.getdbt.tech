---
id: ratio
title: "Метрики отношений"
description: "Используйте метрики отношений для вычисления отношения двух метрик. "
sidebar_label: Отношение
tags: [Metrics, Semantic Layer]
availability: all_users
---

Метрики отношений позволяют вычислять отношение двух метрик. Вы указываете метрику для числителя и метрику для знаменателя. При вычислении метрики можно дополнительно применять фильтры, имена и псевдонимы как к числителю, так и к знаменателю.

Параметры метрик отношений:

<VersionBlock lastVersion="1.11">

| Параметр | Описание | Обязательный | Тип | 
| --------- | ----------- | ---- | ---- |
| `name` | Имя метрики. | Обязательный | Строка |
| `description` | Описание метрики. | Необязательный | Строка |
| `type` | Тип метрики (накопительная, производная, отношение или простая). | Обязательный | Строка |
| `label` | Определяет отображаемое значение в инструментах нижнего уровня. Принимает обычный текст, пробелы и кавычки (например, `orders_total` или `"orders_total"`). | Обязательный | Строка |
| `type_params` | Параметры типа метрики. | Обязательный | Словарь |
| `numerator` | Имя метрики, используемой для числителя, или структура свойств. | Обязательный | Строка или словарь |
| `denominator` | Имя метрики, используемой для знаменателя, или структура свойств. | Обязательный | Строка или словарь |
| `filter` | Необязательный фильтр для числителя или знаменателя. | Необязательный | Строка |
| `alias` | Необязательный псевдоним для числителя или знаменателя. | Необязательный | Строка |

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Параметр | Описание | Обязательность | Тип |
| --------- | ----------- | ---- | ---- |
| `name` | Имя метрики. | Обязательный | Строка |
| `description` | Описание метрики. | Необязательный | Строка |
| `type` | Тип метрики (`cumulative`, `derived`, `ratio` или `simple`). | Обязательный | Строка |
| `label` | Подпись для внешних инструментов. Допускаются обычный текст, пробелы и кавычки, например `orders_total` или `"orders_total"`. | Необязательный | Строка |
| `numerator` | Метрика для числителя. Можно указать имя метрики строкой или словарь с полями `name`, `filter` и `alias`. | Обязательный | Строка или словарь |
| `denominator` | Метрика для знаменателя. Можно указать имя метрики строкой или словарь с полями `name`, `filter` и `alias`. | Обязательный | Строка или словарь |

#### Поля словарей числителя и знаменателя {#numeratordenominator-dictionary-properties}
Для словарей числителя и знаменателя доступны следующие поля:

| Поле | Описание | Обязательность | Тип |
| -------- | ----------- | -------- | ---- |
| `name` | Имя метрики. | Обязательное | Строка |
| `filter` | Фильтр для метрики. | Необязательное | Строка |
| `alias` | Псевдоним метрики. | Необязательное | Строка |

</VersionBlock>

Полная спецификация метрики-отношения:

<VersionBlock lastVersion="1.11">
<File name="models/metrics/file_name.yml">
 
```yaml
metrics:
  - name: Имя метрики # Обязательный
    description: Описание метрики # Необязательный
    type: ratio # Обязательный
    label: Строка, определяющая отображаемое значение в инструментах нижнего уровня. (например, orders_total или "orders_total") # Обязательный
    type_params: # Обязательный
      numerator: Имя метрики, используемой для числителя, или структура свойств # Обязательный
        name: Имя метрики, используемой для числителя # Обязательный
        filter: Фильтр для числителя # Необязательный
        alias: Псевдоним для числителя # Необязательный
      denominator: Имя метрики, используемой для знаменателя, или структура свойств # Обязательный
        name: Имя метрики, используемой для знаменателя # Обязательный
        filter: Фильтр для знаменателя # Необязательный
        alias: Псевдоним для знаменателя # Необязательный
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">

```yaml
models:
  - name: file_name
    semantic_model:
      - enabled: true # required
      - name: my_semantic_model
      ... rest of config...
    metrics:
      - name: my_advanced_ratio_metric
        type: ratio
        numerator:
          name: my_simple_metric
          filter: "{{ Dimension('my_primary_entity__my_categorical_dimension_column') }} > 10"
          alias: joel_loves_data
        denominator:
          name: my_simple_metric_that_uses_the_other_time_dimension_but_is_also_from_another_semantic_model
          filter: "{{ Dimension('my_primary_entity__my_categorical_dimension_column') }} < 10"
          alias: joel_hates_data
```
</File>

</VersionBlock>

Для продвинутого моделирования данных можно использовать `fill_nulls_with` и `join_to_timespine`, чтобы [заменить значения null в метриках на нули](/docs/build/fill-nulls-advanced), обеспечивая числовые значения в каждой строке данных.

## Пример метрик отношения {#ratio-metrics-example}

Эти примеры демонстрируют, как создать метрики отношения в вашей модели. Они охватывают базовые и продвинутые случаи использования, включая применение фильтров к метрикам числителя и знаменателя.

#### Пример 1 {#example-1}
Этот пример представляет собой базовую метрику отношения, которая вычисляет отношение заказов на еду к общему количеству заказов:

<VersionBlock lastVersion="1.11">
<File name="models/metrics/file_name.yml">
 
```yaml
metrics:
  - name: food_order_pct
    description: "Количество заказов на еду как отношение к общему количеству заказов"
    label: Food order ratio
    type: ratio
    type_params: 
      numerator: food_orders
      denominator: orders
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">
 
```yaml
metrics:
  - name: food_order_pct
    description: "Количество заказов еды как доля от общего количества заказов"
    label: Food order ratio
    type: ratio
    numerator: food_orders
    denominator: orders
```
</File>
</VersionBlock>

#### Пример 2 
В этом примере метрика отношения вычисляет отношение количества заказов еды к общему количеству заказов, при этом к числителю применяются фильтр и псевдоним. Обратите внимание: чтобы добавить эти атрибуты, вам также потребуется явно указать ключ для атрибута name.

<VersionBlock lastVersion="1.11">

<File name="models/metrics/file_name.yml">
 
```yaml
metrics:
  - name: food_order_pct
    description: "Количество заказов на еду как отношение к общему количеству заказов, отфильтрованное по местоположению"
    label: Food order ratio by location
    type: ratio
    type_params:
      numerator:
        name: food_orders
        filter: location = 'New York'
        alias: ny_food_orders
      denominator:
        name: orders
        filter: location = 'New York'
        alias: ny_orders
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">
 
```yaml
metrics:
  - name: food_order_pct
    description: "Количество заказов еды как доля от общего количества заказов"
    label: Доля заказов еды по местоположению
    type: ratio
    numerator:
      name: food_orders
      filter: location = 'New York'
      alias: ny_food_orders
    denominator:
      name: orders
      filter: location = 'New York'
      alias: ny_orders
```
</File>

</VersionBlock>

## Метрики отношения с использованием разных семантических моделей

Система упростит вычисление метрики отношения на основе разных семантических моделей, вычислив значения числителя и знаменателя в подзапросах. Затем она объединит результирующие наборы данных по общим измерениям, чтобы вычислить итоговое отношение. Ниже приведён пример SQL, сгенерированного для такой метрики отношения.

Система упростит и преобразует числитель и знаменатель в метрику отношения из различных семантических моделей, вычисляя их значения в подзапросах. Затем она объединит результирующий набор на основе общих измерений для вычисления окончательного отношения. Вот пример SQL, сгенерированного для такой метрики отношения.

```sql
select
  subq_15577.metric_time as metric_time,
  cast(subq_15577.mql_queries_created_test as double) / cast(nullif(subq_15582.distinct_query_users, 0) as double) as mql_queries_per_active_user
from (
  select
    metric_time,
    sum(mql_queries_created_test) as mql_queries_created_test
  from (
    select
      cast(query_created_at as date) as metric_time,
      case when query_status in ('PENDING','MODE') then 1 else 0 end as mql_queries_created_test
    from prod_dbt.mql_query_base mql_queries_test_src_2552 
  ) subq_15576
  group by
    metric_time
) subq_15577
inner join (
  select
    metric_time,
    count(distinct distinct_query_users) as distinct_query_users
  from (
    select
      cast(query_created_at as date) as metric_time,
      case when query_status in ('MODE','PENDING') then email else null end as distinct_query_users
    from prod_dbt.mql_query_base mql_queries_src_2585 
  ) subq_15581
  group by
    metric_time
) subq_15582
on
  (
    (
      subq_15577.metric_time = subq_15582.metric_time
    ) or (
      (
        subq_15577.metric_time is null
      ) and (
        subq_15582.metric_time is null
      )
    )
  )
```

## Добавление фильтра {#add-filter}

Пользователи могут определять ограничения на входные метрики для метрики отношения, применяя фильтр непосредственно к входной метрике, следующим образом:

<VersionBlock lastVersion="1.11">

<File name="models/metrics/file_name.yml">
 
```yaml
metrics:
  - name: frequent_purchaser_ratio
    description: Доля активных пользователей, которые квалифицируются как частые покупатели
    type: ratio
    type_params:
      numerator:
        name: distinct_purchasers
        filter: |
          {{Dimension('customer__is_frequent_purchaser')}}
        alias: frequent_purchasers
      denominator:
        name: distinct_purchasers
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">
 
```yaml
metrics:
  - name: frequent_purchaser_ratio
    description: Fraction of active users who qualify as frequent purchasers
    type: ratio
    numerator:
      name: distinct_purchasers
      filter: | 
        "{{ Dimension('customer__is_frequent_purchaser') }}"
      alias: frequent_purchasers
    denominator:
      name: distinct_purchasers
```
</File>

</VersionBlock>

Обратите внимание на параметры `filter` и `alias` для метрики, указанной в числителе. 
- Используйте параметр `filter`, чтобы применить фильтр к метрике, к которой он относится. 
- Параметр `alias` используется для предотвращения конфликтов имен в сгенерированных SQL-запросах, когда одна и та же метрика используется с разными фильтрами. 
- Если конфликтов имен нет, параметр `alias` можно опустить.

## Связанные документы {#related-docs}
- [Заполнение нулевых значений для простых, производных или метрик отношения](/docs/build/fill-nulls-advanced)