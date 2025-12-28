---
title: Joins
id: join-logic
description: "Соединения позволяют объединять данные из разных таблиц и создавать новые метрики"
sidebar_label: "Соединения"
tags: [Metrics, Semantic Layer]
---

Соединения являются мощной частью MetricFlow и упрощают процесс предоставления всех доступных измерений для ваших метрик во время выполнения запроса, независимо от того, где они определены в различных семантических моделях. С помощью соединений вы также можете создавать метрики, используя меры из разных семантических моделей.

Соединения используют `entities`, определенные в конфигурациях вашей семантической модели, в качестве ключей соединения между таблицами. Предполагая, что сущности определены в семантической модели, MetricFlow создает граф, используя семантические модели в качестве узлов и пути соединения в качестве ребер для автоматического выполнения соединений. MetricFlow выбирает подходящий тип соединения и избегает фан-аут или хазм соединений с другими таблицами на основе типов сущностей.

<Expandable alt_header="Что такое fan-out и chasm joins?" >
- **Fan-out joins** — это ситуации, когда одна строка в одной таблице соединяется с несколькими строками в другой таблице, в результате чего количество строк в результирующем наборе данных больше, чем во входных таблицах.
- **Chasm joins** — это случаи, когда две таблицы имеют связь «многие-ко-многим» через промежуточную таблицу, и в результате соединения возникают дубликаты данных или, наоборот, часть данных теряется.
</Expandable>

:::tip Соединения генерируются автоматически
MetricFlow автоматически генерирует необходимые соединения с определенными семантическими объектами, устраняя необходимость создания новых семантических моделей или конфигурационных файлов.

:::tip Джоины генерируются автоматически
MetricFlow автоматически генерирует необходимые соединения (joins) с определёнными семантическими объектами, избавляя вас от необходимости создавать новые семантические модели или конфигурационные файлы.

В этом разделе объясняются различные типы соединений, которые могут использоваться с сущностями, а также то, как выполнять запросы с их использованием.
:::

MetricFlow использует следующие стратегии соединений:

- В основном используются left joins при соединении моделей `fct` и `dim`. Left join гарантирует, что все строки из «базовой» таблицы будут сохранены, а из присоединяемой таблицы будут добавлены только совпадающие строки.
- Для запросов, которые затрагивают несколько моделей `fct`, MetricFlow применяет full outer joins, чтобы охватить все точки данных, даже если некоторые модели `dim` или `fct` отсутствуют в отдельных таблицах.
- MetricFlow ограничивает использование fan-out и chasm joins.

Для получения дополнительной информации о том, как MetricFlow обрабатывает соединения на практике, см. раздел [SQL examples](#sql-examples).

В следующей таблице указано, какие соединения разрешены в зависимости от конкретных типов сущностей, чтобы предотвратить создание потенциально рискованных соединений. Эта таблица в первую очередь описывает left joins, если не указано иное. Для сценариев с участием нескольких моделей `fct` MetricFlow использует full outer joins.

| entity type - Table A | entity type - Table B | Join type            |
|---------------------------|---------------------------|----------------------|
| Primary                   | Primary                   | ✅ Left                 |
| Primary                   | Unique                    | ✅ Left                 |
| Primary                   | Foreign                   | ❌ Fan-out (Not allowed) |
| Unique                    | Primary                   | ✅ Left                 |
| Unique                    | Unique                    | ✅ Left                 |
| Unique                    | Foreign                   | ❌ Fan-out (Not allowed) |
| Foreign                   | Primary                   | ✅ Left                 |
| Foreign                   | Unique                    | ✅ Left                 |
| Foreign                   | Foreign                   | ❌ Fan-out (Not allowed) |

### Семантическая валидация

MetricFlow выполняет семантическую валидацию, исполняя запросы `explain` на платформе данных, чтобы убедиться, что сгенерированный SQL может быть выполнен без ошибок. Такая валидация включает в себя:

- Проверку того, что все используемые таблицы и столбцы существуют.
- Проверку поддержки платформой данных SQL‑функций, например `date_diff(x, y)`.
- Выявление неоднозначных соединений или путей в многошаговых (multi-hop) join‑ах.

Если валидация завершается с ошибкой, MetricFlow сообщает о них пользователю, чтобы он мог исправить проблемы до выполнения запроса.

## Пример

Следующий пример использует две семантические модели с общей сущностью и показывает запрос MetricFlow, который требует соединения между двумя семантическими моделями. Две семантические модели:
- `transactions`
- `user_signup`

```yaml
semantic_models:
  - name: transactions
    entities:
      - name: id
        type: primary
      - name: user
        type: foreign
        expr: user_id
    measures:
      - name: average_purchase_price
        agg: avg
        expr: purchase_price
  - name: user_signup
    entities:
      - name: user
        type: primary
        expr: user_id
    dimensions:
      - name: type
        type: categorical
```

- MetricFlow использует `user_id` в качестве ключа соединения для связывания двух семантических моделей, `transactions` и `user_signup`. Это позволяет вам запрашивать метрику `average_purchase_price` в семантической модели `transactions`, сгруппированную по измерению `type` в семантической модели `user_signup`.
  - Обратите внимание, что мера `average_purchase_price` определена в `transactions`, где `user_id` является внешней сущностью. Однако в `user_signup` `user_id` является основной сущностью.
- Поскольку `user_id` является внешним ключом в `transactions` и основным ключом в `user_signup`, MetricFlow выполняет левое соединение, где `transactions` соединяется с `user_signup`, чтобы получить доступ к мере `average_purchase_price`, определенной в `transactions`.
- Чтобы запрашивать измерения из разных семантических моделей, добавьте двойное подчеркивание (или dunder) к имени измерения после соединения сущности в вашем инструменте редактирования. Следующий запрос, `user_id__type`, включен в качестве измерения с использованием флага `--group-by` (`type` является измерением).

```bash
dbt sl query --metrics average_purchase_price --group-by metric_time,user_id__type # In <Constant name="cloud" />
```

```bash
mf query --metrics average_purchase_price --group-by metric_time,user_id__type # In <Constant name="core" />
```

#### Примеры SQL

Эти примеры SQL показывают, как MetricFlow на практике обрабатывает сценарии с `left join` и `full outer join`:

<Tabs>
<TabItem value="SQL example for left join"> 

Используя предыдущий пример с семантическими моделями `transactions` и `user_signup`, здесь показан `left join` между этими двумя семантическими моделями.

```sql
select
  transactions.user_id,
  transactions.purchase_price,
  user_signup.type
from transactions
left outer join user_signup
  on transactions.user_id = user_signup.user_id
where transactions.purchase_price is not null
group by
  transactions.user_id,
  user_signup.type;
```
</TabItem>

<TabItem value="SQL example for outer joins"> 

Если у вас есть несколько моделей типа `fct`, например `sales` и `returns`, MetricFlow использует `full outer join`, чтобы гарантировать, что будут учтены все точки данных.

В этом примере показан `full outer join` между семантическими моделями `sales` и `returns`.

```sql
select
  sales.user_id,
  sales.total_sales,
  returns.total_returns
from sales
full outer join returns
  on sales.user_id = returns.user_id
where sales.user_id is not null or returns.user_id is not null;
```

</TabItem>
</Tabs>

## Многошаговые (multi-hop) соединения

MetricFlow позволяет пользователям соединять меры и измерения через граф сущностей, переходя от одной таблицы к другой в графе. Это называется "мульти-хоп соединение".

MetricFlow может соединять до трех таблиц, поддерживая мульти-хоп соединения с ограничением в два хопа. Это позволяет:
- Выполнять сложный анализ данных без неоднозначных путей.
- Поддерживать навигацию через модели данных, например, переход от `orders` к `customers` и к `country` таблицам.

Хотя прямые треххоповые пути ограничены, чтобы предотвратить путаницу из-за множества маршрутов к одним и тем же данным, MetricFlow позволяет соединять более трех таблиц, если соединения не превышают двух хопов для достижения измерения.

Например, если у вас есть две модели, `country` и `region`, где клиенты связаны с странами, которые, в свою очередь, связаны с регионами, вы можете соединить их все в одном SQL-запросе и анализировать `orders` по `customer__country_country_name`, но не по `customer__country__region_name`.

![Multi-Hop-Join](/img/docs/building-a-dbt-project/multihop-diagram.png "Пример схемы для справки")

Обратите внимание, как схема может быть переведена в следующие три семантические модели MetricFlow для создания метрики 'Средняя цена покупки по странам', используя меру `purchase_price` из таблицы продаж и измерение `country_name` из таблицы `country_dim`.

```yaml
semantic_models:
  - name: sales
    defaults:
      agg_time_dimension: first_ordered_at
    entities:
      - name: id
        type: primary
      - name: user_id
        type: foreign
    measures:
      - name: average_purchase_price
        agg: avg
        expr: purchase_price
    dimensions:
      - name: metric_time
        type: time
        type_params:
  - name: user_signup
    entities:
      - name: user_id
        type: primary
      - name: country_id
        type: unique
    dimensions:
      - name: signup_date
        type: time
      - name: country_dim

  - name: country
    entities:
      - name: country_id
        type: primary
    dimensions:
      - name: country_name
        type: categorical
```

### Запрос мульти-хоп соединений

Чтобы запрашивать измерения _без_ участия мульти-хоп соединения, вы можете использовать полностью квалифицированное имя измерения с синтаксисом сущность двойное подчеркивание (dunder) измерение, например, `entity__dimension`.

Для измерений, полученных с помощью мульти-хоп соединения, вам нужно дополнительно указать путь сущности в виде списка, например, `user_id`.
