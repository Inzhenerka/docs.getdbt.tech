---
id: ratio
title: "Метрики отношения"
description: "Используйте метрики отношения для создания отношения из двух измерений."
sidebar_label: Отношение
tags: [Метрики, Семантический слой]
---

Метрика отношения позволяет создать отношение между двумя метриками. Вы просто указываете метрику числителя и метрику знаменателя. Кроме того, вы можете применить фильтр по измерению как к числителю, так и к знаменателю, используя строку ограничения при вычислении метрики.

Параметры, описание и тип для метрик отношения:

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

Ниже представлена полная спецификация для метрик отношения, а также пример.

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

Для продвинутого моделирования данных вы можете использовать `fill_nulls_with` и `join_to_timespine`, чтобы [установить нулевые значения метрик в ноль](/docs/build/fill-nulls-advanced), обеспечивая числовые значения для каждой строки данных.

## Пример метрик отношения {#ratio-metrics-example}

Эти примеры демонстрируют, как создать метрики отношения в вашей модели. Они охватывают базовые и продвинутые случаи использования, включая применение фильтров к метрикам числителя и знаменателя.

#### Пример 1 {#example-1}
Этот пример представляет собой базовую метрику отношения, которая вычисляет отношение заказов на еду к общему количеству заказов:

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

#### Пример 2 {#example-2}
Этот пример представляет собой метрику отношения, которая вычисляет отношение заказов на еду к общему количеству заказов с применением фильтра и псевдонима к числителю. Обратите внимание, что для добавления этих атрибутов вам также потребуется использовать явный ключ для атрибута имени.

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

## Метрики отношения с использованием различных семантических моделей {#ratio-metrics-using-different-semantic-models}

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

Обратите внимание на параметры `filter` и `alias` для метрики, указанной в числителе.
- Используйте параметр `filter`, чтобы применить фильтр к метрике, к которой он прикреплен.
- Параметр `alias` используется для избежания конфликтов имен в сгенерированных SQL-запросах, когда одна и та же метрика используется с различными фильтрами.
- Если конфликтов имен нет, параметр `alias` можно не указывать.

## Связанные документы {#related-docs}
- [Заполнение нулевых значений для простых, производных или метрик отношения](/docs/build/fill-nulls-advanced)