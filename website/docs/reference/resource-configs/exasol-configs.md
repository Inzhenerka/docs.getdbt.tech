---
title: "Конфигурации Exasol"
description: "Конфигурации Exasol — прочитайте это подробное руководство, чтобы узнать о настройках в dbt."
id: "exasol-configs"
---

## Стратегии инкрементальной материализации

В dbt-exasol поддерживаются следующие стратегии инкрементальной материализации:

- `append` (по умолчанию, если `unique_key` не задан)
- `merge`
- `delete+insert` (по умолчанию, если `unique_key` задан)
- [`microbatch`](/docs/build/incremental-microbatch)

Все эти стратегии унаследованы от dbt. Дополнительную информацию об инкрементальных стратегиях см. в [документации по инкрементальным стратегиям](/docs/build/incremental-strategy).

## Оптимизация производительности

### Распределение и секционирование таблиц

Начиная с dbt-exasol 1.8.1, вы можете настраивать стратегии распределения и секционирования таблиц для оптимизации производительности запросов в Exasol. Эти настройки доступны для моделей с материализацией `table` или `incremental`.

Exasol поддерживает следующие настройки оптимизации производительности:

| Параметр | Тип | Обязательный | Описание |
|-----------|------|----------|-------------|
| `partition_by_config` | `<string>` или `[<string>]` | нет | Секционирует таблицу по указанным столбцам для повышения производительности запросов |
| `distribute_by_config` | `<string>` | нет | Распределяет данные по узлам кластера по указанному столбцу |
| `primary_key_config` | `[<string>]` | нет | Определяет ограничения первичного ключа |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'YAML-файл проекта', value: 'project-yaml', },
    { label: 'YAML-файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация в SQL-файле', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): table
    [+](/reference/resource-configs/plus-prefix)partition_by_config: <column-name>
    [+](/reference/resource-configs/plus-prefix)distribute_by_config: <column-name>
    [+](/reference/resource-configs/plus-prefix)primary_key_config: [<column-name>]
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): table
      partition_by_config: <column-name>
      distribute_by_config: <column-name>
      primary_key_config: [<column-name>]
```

</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)="table",
    partition_by_config="<column-name>",
    distribute_by_config="<column-name>",
    primary_key_config=["<column-name>"]
) }}
```

</File>

</TabItem>

</Tabs>

#### Пример с одним столбцом

Следующий пример создаёт таблицу, секционированную по `order_date`, с распределением по `customer_id` и первичным ключом по `customer_id`:

<File name='models/orders.sql'>

```sql
{{
    config(
        materialized='table',
        primary_key_config=['customer_id'],
        partition_by_config='order_date',
        distribute_by_config='customer_id'
    )
}}

select
    customer_id,
    order_date,
    order_total,
    order_status
from {{ source('sales', 'orders') }}
```

</File>

#### Пример с несколькими столбцами

При настройке нескольких столбцов для `primary_key_config` укажите их в виде списка:

<File name='models/order_items.sql'>

```sql
{{
    config(
        materialized='incremental',
        primary_key_config=['order_id', 'item_id'],
        partition_by_config='order_date',
        distribute_by_config='order_id',
        unique_key=['order_id', 'item_id']
    )
}}

select
    order_id,
    item_id,
    order_date,
    quantity,
    price
from {{ source('sales', 'order_items') }}
```

</File>

:::info
При настройке нескольких столбцов для `primary_key_config` всегда указывайте их в виде списка: `['column1', 'column2']`
:::

Дополнительную информацию о распределении и секционировании таблиц в Exasol см. в [документации Exasol](https://docs.exasol.com/db/latest/sql/create_table.htm).

## Контракты моделей

Exasol поддерживает [контракты моделей](/docs/mesh/govern/model-contracts) со следующими ограничениями базы данных:

| Тип ограничения | Статус поддержки | Описание |
|----------------|----------------|-------------|
| `not_null`     | ✅ Применяется    | Запрещает значения NULL в столбце |
| `primary_key`  | ✅ Применяется    | Обеспечивает уникальность и NOT NULL |
| `foreign_key`  | ✅ Применяется    | Ссылается на первичный ключ другой таблицы |
| `check`        | ❌ Не поддерживается | Пользовательские выражения проверки не поддерживаются |
| `unique`       | ❌ Не поддерживается | Ограничения уникальности не поддерживаются |

### Пример с применяемыми ограничениями

<File name='models/customers.yml'>

```yaml
models:
  - name: customers
    config:
      contract:
        enforced: true
    columns:
      - name: customer_id
        data_type: integer
        constraints:
          - type: not_null
          - type: primary_key
      - name: email
        data_type: varchar(255)
        constraints:
          - type: not_null
      - name: country_id
        data_type: integer
        constraints:
          - type: foreign_key
            expression: countries (country_id)
```

</File>

Дополнительную информацию о контрактах моделей см. в [документации по контрактам моделей](/docs/mesh/govern/model-contracts).

## Формат временных меток

Начиная с dbt-exasol 1.2.2, формат временных меток по умолчанию — `YYYY-MM-DDTHH:MI:SS.FF6`.

Вы можете изменить формат временных меток в [конфигурации профиля](/docs/local/connect-data-platform/exasol-setup):

<File name='profiles.yml'>

```yaml
outputs:
  dev:
    type: exasol
    timestamp_format: 'YYYY-MM-DD HH24:MI:SS.FF3'
    # ... другие настройки
```

</File>

### Особенности стратегии microbatch

При использовании инкрементальной стратегии [`microbatch`](/docs/build/incremental-microbatch) Exasol требует, чтобы временные метки в определениях моделей не содержали суффикса часового пояса:

```sql
-- ✅ Правильно (совместимо с Exasol)
TIMESTAMP '2024-01-01 10:00:00'

-- ❌ Неправильно (вызовет ошибки синтаксического анализа)
TIMESTAMP '2024-01-01 10:00:00-0'
```

Адаптер dbt-exasol автоматически обрабатывает форматирование временных меток для границ микропакетов.

Дополнительную информацию о стратегии microbatch см. в [документации по microbatch](/docs/build/incremental-microbatch).

## Материализованные представления

Exasol не поддерживает материализованные представления. При попытке использовать `materialized='materialized_view'` операция завершится с ошибкой.

### Обходные решения

- Используйте `materialized='table'` с соответствующей логикой обновления
- Используйте `materialized='incremental'` с подходящими [инкрементальными стратегиями](/docs/build/incremental-strategy)

## Операции клонирования

Exasol не поддерживает операции клонирования таблиц. Это влияет на возможности dbt, которые зависят от функциональности `CLONE`.

## Ограничения модульного тестирования

В Exasol существуют определённые ограничения для [модульных тестов](/docs/build/unit-tests):

### Обработка пустых строк

В Exasol пустые строки обрабатываются как `NULL`. Это влияет на тестовые фикстуры, использующие пустые строковые литералы для имитации пустых значений. При написании модульных тестов с seed-данными учитывайте следующее:

```yaml
# Эти seed-данные
id,name,value
1,test,""  # Пустая строка

# Будут интерпретированы как
id,name,value
1,test,NULL  # Значение NULL в Exasol
```

### Тестирование с использованием разных баз данных

Модульные тесты, использующие источники из базы данных, отличной от базы данных моделей, не поддерживаются. Все тестовые фикстуры и модели должны находиться в одной базе данных.

### Агрегатные функции в CTE

Exasol не поддерживает некоторые агрегатные функции (`LISTAGG`, `MEDIAN`, `PERCENTILE_CONT`) при их использовании внутри общих табличных выражений (CTE), созданных на основе фикстур модульных тестов dbt. Для этих функций требуются таблицы, созданные пользователем.

**Обходное решение:** При тестировании моделей с этими функциями создавайте реальные таблицы для тестовых фикстур вместо использования встроенных CTE.

Если вы заинтересованы в поддержке материализованных тестовых фикстур, приглашаем вас принять участие в обсуждении этой задачи на GitHub: [dbt-labs/dbt#8499](https://github.com/dbt-labs/dbt/issues/8499)

## Настройка подключения

Информацию о параметрах подключения, таких как шифрование, проверка SSL/TLS, аутентификация OpenID и другие настройки профиля, см. в [документации по настройке Exasol](/docs/local/connect-data-platform/exasol-setup).
