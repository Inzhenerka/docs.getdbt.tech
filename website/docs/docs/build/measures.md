---
title: Меры
id: measures
description: "Меры — это агрегирования, выполняемые по столбцам в вашей модели."
sidebar_label: "Меры"
tags: [Метрики, Семантический уровень]
---

Меры — это агрегирования, выполняемые по столбцам в вашей модели. Они могут использоваться как окончательные метрики или как строительные блоки для более сложных метрик.

У мер есть несколько входных параметров, которые описаны в следующей таблице вместе с их типами полей.

import MeasuresParameters from '/snippets/_sl-measures-parameters.md';

<MeasuresParameters />

## Спецификация меры

Пример полной спецификации мер в формате YAML приведен ниже. Фактическая конфигурация ваших мер будет зависеть от используемого агрегирования.

```yaml
measures:
  - name: Имя меры
    description: 'так же, как всегда' ## Необязательно
    agg: тип агрегирования.
    expr: поле
    agg_params: 'специфические свойства агрегирования, такие как процентиль'  ## Необязательно
    agg_time_dimension: Временное поле. По умолчанию используется стандартное временное измерение для семантической модели. ##  Необязательно
    non_additive_dimension: 'Используйте эти настройки, когда вам нужны неаддитивные измерения.' ## Необязательно
```

### Имя

Когда вы создаете меру, вы можете либо дать ей собственное имя, либо использовать `name` столбца платформы данных напрямую. Если `name` меры отличается от имени столбца, вам нужно добавить `expr`, чтобы указать имя столбца. `name` меры используется при создании метрики.

Имена мер должны быть уникальными для всех семантических моделей в проекте и не могут совпадать с существующими `entity` или `dimension` в той же модели.

### Описание

Описание описывает вычисляемую меру. Настоятельно рекомендуется создавать подробные и читаемые описания в этом поле.

### Агрегирование

Агрегирование определяет, как поле будет агрегироваться. Например, тип агрегирования `sum` с гранулярностью `day` будет суммировать значения за определенный день.

Поддерживаемые агрегирования включают:

| Типы агрегирования | Описание              |
|-------------------|--------------------------|
| sum               | Сумма значений    |
| min               | Минимум значений|
| max               | Максимум значений|
| average           | Среднее значение |
| sum_boolean       | Сумма для булевого типа |
| count_distinct    | Уникальный подсчет значений |
| median            | Вычисление медианы (p50) |
| percentile        | Вычисление процентиля. |

#### Пример агрегирования по процентилю
Если вы используете агрегирование `percentile`, вы должны использовать поле `agg_params`, чтобы указать детали для агрегирования по процентилю (например, какой процентиль вычислять и использовать ли дискретные или непрерывные вычисления).

```yaml
name: p99_transaction_value
description: Значение транзакции на 99-м процентиле
expr: transaction_amount_usd
agg: percentile
agg_params:
  percentile: .99
  use_discrete_percentile: False  # False вычисляет непрерывный процентиль, True вычисляет дискретный процентиль.
```

#### Процентиль по поддерживаемым типам движков
Следующая таблица показывает, какие SQL-движки поддерживают непрерывные, дискретные, приближенные, непрерывные и приближенные дискретные процентильные вычисления.

|  | Непр. | Дискр. | Прибл. непр. | Прибл. дискр. |
| -- | -- | -- | -- | -- |
|Snowflake | [Да](https://docs.snowflake.com/en/sql-reference/functions/percentile_cont.html) | [Да](https://docs.snowflake.com/en/sql-reference/functions/percentile_disc.html) | [Да](https://docs.snowflake.com/en/sql-reference/functions/approx_percentile.html) (t-digest) | Нет |
| Bigquery | Нет (окно) | Нет (окно) | [Да](https://cloud.google.com/bigquery/docs/reference/standard-sql/functions-and-operators#approx_quantiles) | Нет |
| Databricks | [Да](https://docs.databricks.com/sql/language-manual/functions/percentile_cont.html) | [Нет](https://docs.databricks.com/sql/language-manual/functions/percentile_disc.html) | Нет | [Да](https://docs.databricks.com/sql/language-manual/functions/approx_percentile.html) |
| Redshift | [Да](https://docs.aws.amazon.com/redshift/latest/dg/r_PERCENTILE_CONT.html) | Нет (окно) | Нет | [Да](https://docs.aws.amazon.com/redshift/latest/dg/r_APPROXIMATE_PERCENTILE_DISC.html) |
| [Postgres](https://www.postgresql.org/docs/9.4/functions-aggregate.html) | Да | Да | Нет | Нет |
| [DuckDB](https://duckdb.org/docs/sql/aggregates.html) | Да | Да | Да (t-digest) | Нет |

### Expr

Если `name`, который вы указали для меры, не совпадает с именем столбца в вашей модели, вы можете использовать параметр `expr` вместо этого. Это позволяет вам использовать любой допустимый SQL для преобразования имени базового столбца в конкретный вывод. Параметр `name` затем служит псевдонимом для вашей меры.

**Примечания**: При использовании SQL-функций в параметре `expr` **всегда используйте специфичный для платформы данных SQL**. Это связано с тем, что результаты могут различаться в зависимости от вашей конкретной платформы данных.

:::tip Для пользователей Snowflake
Для пользователей Snowflake, если вы используете функцию уровня недели в параметре `expr`, она теперь будет возвращать понедельник как день начала недели по умолчанию в соответствии со стандартами ISO. Если у вас есть какие-либо настройки на уровне учетной записи или сессии для параметра `WEEK_START`, которые фиксируют его на значение, отличное от 0 или 1, вы все равно увидите понедельник как начало недели.

Если вы используете функцию `dayofweek` в параметре `expr` с устаревшим значением по умолчанию Snowflake `WEEK_START = 0`, она теперь будет возвращать значения стандартов ISO от 1 (понедельник) до 7 (воскресенье) вместо устаревших значений Snowflake от 0 (понедельник) до 6 (воскресенье).
:::

### Модель с различными агрегированиями

```yaml
semantic_models:
  - name: transactions
    description: Запись каждой транзакции, которая происходит. Корзины считаются несколькими транзакциями для каждого SKU.
    model: ref('schema.transactions')
    defaults:
      agg_time_dimension: transaction_date

# --- entities ---
    entities:
      - name: transaction_id
        type: primary
      - name: customer_id
        type: foreign
      - name: store_id
        type: foreign
      - name: product_id
        type: foreign

# --- measures ---
    measures:
      - name: transaction_amount_usd
        description: Общая сумма транзакций в USD
        expr: transaction_amount_usd
        agg: sum
      - name: transaction_amount_usd_avg
        description: Средняя сумма транзакций в USD
        expr: transaction_amount_usd
        agg: average
      - name: transaction_amount_usd_max
        description: Максимальная сумма транзакций в USD
        expr: transaction_amount_usd
        agg: max
      - name: transaction_amount_usd_min
        description: Минимальная сумма транзакций в USD
        expr: transaction_amount_usd
        agg: min
      - name: quick_buy_transactions 
        description: Общее количество транзакций, купленных как быстрые покупки
        expr: quick_buy_flag 
        agg: sum_boolean 
      - name: distinct_transactions_count
        description: Уникальный подсчет транзакций 
        expr: transaction_id
        agg: count_distinct
      - name: transaction_amount_avg 
        description: Средняя сумма транзакций 
        expr: transaction_amount_usd
        agg: average 
      - name: transactions_amount_usd_valid # Обратите внимание, как мы используем expr для вычисления агрегирования на основе условия
        description: Общая сумма транзакций в USD только для действительных транзакций
        expr: CASE WHEN is_valid = True then transaction_amount_usd else 0 end 
        agg: sum
      - name: transactions
        description: Средняя сумма транзакций.
        expr: transaction_amount_usd
        agg: average
      - name: p99_transaction_value
        description: Значение транзакции на 99-м процентиле
        expr: transaction_amount_usd
        agg: percentile
        agg_params:
          percentile: .99
          use_discrete_percentile: False # False вычисляет непрерывный процентиль, True вычисляет дискретный процентиль.
      - name: median_transaction_value
        description: Медианная сумма транзакции
        expr: transaction_amount_usd
        agg: median
        
# --- dimensions ---
    dimensions:
      - name: transaction_date
        type: time
        expr: date_trunc('day', ts) # expr ссылается на базовый столбец ts
        type_params:
          time_granularity: day
      - name: is_bulk_transaction
        type: categorical
        expr: case when quantity > 10 then true else false end

```

### Неаддитивные измерения

Некоторые меры не могут быть агрегированы по определенным измерениям, таким как время, поскольку это может привести к неправильным результатам. Примеры включают балансы банковских счетов, где не имеет смысла переносить балансы из месяца в месяц, и ежемесячные повторяющиеся доходы, где ежедневные повторяющиеся доходы не могут быть суммированы для достижения ежемесячных повторяющихся доходов. Вы можете указать неаддитивные измерения, чтобы справиться с этим, исключив определенные измерения из агрегирования.

Чтобы продемонстрировать конфигурацию для неаддитивных мер, рассмотрим таблицу подписок, которая включает одну строку на каждую дату зарегистрированного пользователя, активные подписочные планы пользователя и значение подписки плана (доход) с следующими столбцами:

- `date_transaction`: Ежедневная дата.
- `user_id`: Идентификатор зарегистрированного пользователя.
- `subscription_plan`: Столбец для указания идентификатора подписочного плана.
- `subscription_value`: Столбец для указания ежемесячного значения подписки (дохода) для конкретного идентификатора подписочного плана.

Параметры в `non_additive_dimension` будут указывать измерения, по которым мера не должна агрегироваться.

| Параметр | Описание | Тип поля |
| --- | --- | --- |
| `name`| Это будет имя временного измерения (которое уже было определено в источнике данных), по которому мера не должна агрегироваться. | Обязательно |
| `window_choice` | Выберите либо `min`, либо `max`, где `min` отражает начало временного периода, а `max` отражает конец временного периода. | Обязательно |
| `window_groupings` | Укажите сущности, по которым вы хотите сгруппировать. | Необязательно |


```yaml
semantic_models:
  - name: subscriptions
    description: Таблица подписок с одной строкой на каждую дату для каждого активного пользователя и их подписочных планов. 
    model: ref('your_schema.subscription_table')
    defaults:
      agg_time_dimension: subscription_date

    entities:
      - name: user_id
        type: foreign
    primary_entity: subscription

    dimensions:
      - name: subscription_date
        type: time
        expr: date_transaction
        type_params:
          time_granularity: day

    measures: 
      - name: count_users
        description: Подсчет пользователей на конец месяца 
        expr: user_id
        agg: count_distinct
        non_additive_dimension: 
          name: subscription_date
          window_choice: max 
      - name: mrr
        description: Агрегирование путем суммирования всех активных подписочных планов пользователей
        expr: subscription_value
        agg: sum 
        non_additive_dimension: 
          name: subscription_date
          window_choice: max
      - name: user_mrr
        description: Группировка по user_id для достижения MRR каждого пользователя
        expr: subscription_value
        agg: sum  
        non_additive_dimension: 
          name: subscription_date
          window_choice: max
          window_groupings: 
            - user_id 

metrics:
  - name: mrr_metrics
    type: simple
    type_params:
        measure: mrr
```

Мы можем запрашивать полунадитивные метрики, используя следующий синтаксис:

Для dbt Cloud:

```bash
dbt sl query --metrics mrr_by_end_of_month --group-by subscription__subscription_date__month --order subscription__subscription_date__month 
dbt sl query --metrics mrr_by_end_of_month --group-by subscription__subscription_date__week --order subscription__subscription_date__week 
```

Для dbt Core:

```bash
mf query --metrics mrr_by_end_of_month --group-by subscription__subscription_date__month --order subscription__subscription_date__month 
mf query --metrics mrr_by_end_of_month --group-by subscription__subscription_date__week --order subscription__subscription_date__week 
```

import SetUpPages from '/snippets/_metrics-dependencies.md';

<SetUpPages /> 