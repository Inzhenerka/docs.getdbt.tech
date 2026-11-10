---
title: "Примеры использования dbt State"
sidebar_label: "Примеры dbt State"
description: "Сравнение сценариев локального выполнения dbt без dbt State и с dbt State на примере проекта Jaffle Shop."
id: "dbt-state-examples"
tags: ['dbt State']
pagination_prev: "docs/deploy/dbt-state-deferral"
pagination_next: "docs/deploy/dbt-state-migration"
availability: everywhere_usage
---

# Примеры использования dbt State

<IntroText>

В этих примерах используется проект Jaffle Shop для наглядного сравнения вывода CLI с включённым dbt State и без него. Чтобы включить dbt State, следуйте инструкциям в разделе [Настройка dbt State](/docs/deploy/dbt-state-setup).

</IntroText>

В следующих примерах в качестве ориентира используется DAG [проекта Jaffle Shop](https://github.com/dbt-labs/jaffle-shop). Обращайтесь к нему, чтобы понять зависимости между моделями в каждом сценарии.

<Lightbox src="/img/docs/dbt-state/dbt_state_dag.png" title="DAG проекта Jaffle Shop" />

Каждый из следующих сценариев показывает, чем отличается запуск <Constant name="dbt" /> без dbt State от запуска <Constant name="dbt" /> с dbt State при использовании одной и той же команды и проекта.

| Сценарий | Команда | Что меняет dbt State |
| --- | --- | --- |
| [Первый запуск в пустой схеме](#initial-run-in-empty-schema) | `dbt run --target prod` | Тот же результат |
| [Второй запуск](#second-run) | `dbt run --target prod` | Повторно использует неизменённые табличные модели и большинство представлений; может пересоздавать представления с `select *`, обращающимся непосредственно к `ref()` или `source()` |
| [Выбор модели в новой среде разработки после изменения модели customers](#selecting-a-model-in-a-fresh-dev-environment-after-changing-the-customers-model) | `dbt run --target dev --select "customers"` | Использует вышестоящие модели из prod за счёт перенаправления ссылок |
| [Выбор модели в новой схеме разработки без изменений в моделях](#selecting-a-model-in-a-new-dev-schema-with-no-model-changes) | `dbt run --target dev --select "customers"` | Перенаправляет ссылки и клонирует неизменённые модели |
<br></br>

Каждая пропущенная модель — это модель, за повторное построение которой вам не пришлось платить. dbt State отслеживает изменения и пропускает всё остальное &mdash; сокращая время выполнения и затраты на хранилище данных.

## Первый запуск в пустой схеме {#initial-run-in-empty-schema}

```shell
dbt run --target prod
```

Если предыдущего состояния для сравнения нет, dbt строит каждую модель с нуля. dbt State сохраняет метаданные этого запуска для последующих сравнений.

<Tabs queryString="initial-run">
<TabItem value="without" label="Без dbt State">


```shell
Running with dbt=1.12.0-b2
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 644 macros, 3 unit tests

Concurrency: 1 threads (target='prod')

1 of 12 START sql view model jaffle_analytics.stg_customers .................... [RUN]
1 of 12 OK created sql view model jaffle_analytics.stg_customers ............... [SUCCESS 1 in 0.54s]
2 of 12 START sql view model jaffle_analytics.stg_locations .................... [RUN]
2 of 12 OK created sql view model jaffle_analytics.stg_locations ............... [SUCCESS 1 in 0.48s]
3 of 12 START sql view model jaffle_analytics.stg_order_items .................. [RUN]
3 of 12 OK created sql view model jaffle_analytics.stg_order_items ............. [SUCCESS 1 in 0.51s]
4 of 12 START sql view model jaffle_analytics.stg_orders ....................... [RUN]
4 of 12 OK created sql view model jaffle_analytics.stg_orders .................. [SUCCESS 1 in 0.77s]
5 of 12 START sql view model jaffle_analytics.stg_products ..................... [RUN]
5 of 12 OK created sql view model jaffle_analytics.stg_products ................ [SUCCESS 1 in 0.58s]
6 of 12 START sql view model jaffle_analytics.stg_supplies ..................... [RUN]
6 of 12 OK created sql view model jaffle_analytics.stg_supplies ................ [SUCCESS 1 in 0.63s]
7 of 12 START sql table model jaffle_analytics.locations ....................... [RUN]
7 of 12 OK created sql table model jaffle_analytics.locations .................. [SUCCESS 1 in 1.81s]
8 of 12 START sql table model jaffle_analytics.products ........................ [RUN]
8 of 12 OK created sql table model jaffle_analytics.products ................... [SUCCESS 1 in 1.33s]
9 of 12 START sql table model jaffle_analytics.order_items ..................... [RUN]
9 of 12 OK created sql table model jaffle_analytics.order_items ................ [SUCCESS 1 in 2.09s]
10 of 12 START sql table model jaffle_analytics.supplies ....................... [RUN]
10 of 12 OK created sql table model jaffle_analytics.supplies .................. [SUCCESS 1 in 1.26s]
11 of 12 START sql table model jaffle_analytics.orders ......................... [RUN]
11 of 12 OK created sql table model jaffle_analytics.orders .................... [SUCCESS 1 in 1.70s]
12 of 12 START sql table model jaffle_analytics.customers ...................... [RUN]
12 of 12 OK created sql table model jaffle_analytics.customers ................. [SUCCESS 1 in 1.77s]

Finished running 6 table models, 6 view models in 0 hours 0 minutes and 17.77 seconds (17.77s).

Completed successfully

Done. PASS=12 WARN=0 ERROR=0 SKIP=0 NO-OP=0 TOTAL=12
```


</TabItem>
<TabItem value="with" label="С dbt State">

```shell
Running with dbt=1.12.0-b2
State adapter: dbt-state v2.43.1 is enabled
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 644 macros, 3 unit tests

Concurrency: 1 threads (target='prod')

1 of 12 START sql view model jaffle_analytics.stg_customers .................... [RUN]
State adapter: Fetching freshness metadata
1 of 12 OK created sql view model jaffle_analytics.stg_customers ............... [SUCCESS 1 in 0.54s]
2 of 12 START sql view model jaffle_analytics.stg_locations .................... [RUN]
2 of 12 OK created sql view model jaffle_analytics.stg_locations ............... [SUCCESS 1 in 0.48s]
3 of 12 START sql view model jaffle_analytics.stg_order_items .................. [RUN]
3 of 12 OK created sql view model jaffle_analytics.stg_order_items ............. [SUCCESS 1 in 0.51s]
4 of 12 START sql view model jaffle_analytics.stg_orders ....................... [RUN]
4 of 12 OK created sql view model jaffle_analytics.stg_orders .................. [SUCCESS 1 in 0.77s]
5 of 12 START sql view model jaffle_analytics.stg_products ..................... [RUN]
5 of 12 OK created sql view model jaffle_analytics.stg_products ................ [SUCCESS 1 in 0.58s]
6 of 12 START sql view model jaffle_analytics.stg_supplies ..................... [RUN]
6 of 12 OK created sql view model jaffle_analytics.stg_supplies ................ [SUCCESS 1 in 0.63s]
7 of 12 START sql table model jaffle_analytics.locations ....................... [RUN]
7 of 12 OK created sql table model jaffle_analytics.locations .................. [SUCCESS 1 in 1.81s]
8 of 12 START sql table model jaffle_analytics.products ........................ [RUN]
8 of 12 OK created sql table model jaffle_analytics.products ................... [SUCCESS 1 in 1.33s]
9 of 12 START sql table model jaffle_analytics.order_items ..................... [RUN]
9 of 12 OK created sql table model jaffle_analytics.order_items ................ [SUCCESS 1 in 2.09s]
10 of 12 START sql table model jaffle_analytics.supplies ....................... [RUN]
10 of 12 OK created sql table model jaffle_analytics.supplies .................. [SUCCESS 1 in 1.26s]
11 of 12 START sql table model jaffle_analytics.orders ......................... [RUN]
11 of 12 OK created sql table model jaffle_analytics.orders .................... [SUCCESS 1 in 1.70s]
12 of 12 START sql table model jaffle_analytics.customers ...................... [RUN]
12 of 12 OK created sql table model jaffle_analytics.customers ................. [SUCCESS 1 in 1.77s]

Finished running 6 table models, 6 view models in 0 hours 0 minutes and 17.77 seconds (17.77s).

Completed successfully. Total cache hits: 0. Estimated time saved: 0.00s. Freshness tolerance: 45m.

Done. PASS=12 WARN=0 ERROR=0 SKIP=0 NO-OP=0 REUSED=0 TOTAL=12
```

</TabItem>
</Tabs>

## Второй запуск {#second-run}

```shell
dbt run --target prod
```

Для каждой модели dbt State сравнивает текущую логику и данные вышестоящих моделей с предыдущим запуском. Если ничего не изменилось, dbt State пропускает построение или клонирует результат из другой среды.

При включённом dbt State все двенадцать моделей используются повторно &mdash; ничего не изменилось, поэтому пересоздавать нечего.

dbt State повторно использует представления, если их SQL-логика не изменилась, даже если в вышестоящих моделях появились новые данные. Поскольку представления не хранят данные, при выполнении запроса они всегда читают их непосредственно из базовых таблиц. В показанных здесь промежуточных представлениях используется `select *` из CTE, и dbt State может использовать такие представления повторно. Подробнее о вариантах использования `select *`, которые могут привести к пересозданию, см. в разделе [Представления с `select *`](/faqs/State/views-rebuilt#views-with-select).

<Tabs queryString="second-run">
<TabItem value="without" label="Без dbt State">

```shell
Running with dbt=1.12.0-b2
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 644 macros, 3 unit tests

Concurrency: 1 threads (target='prod')

1 of 12 START sql view model jaffle_analytics.stg_customers .................... [RUN]
1 of 12 OK created sql view model jaffle_analytics.stg_customers ............... [SUCCESS 1 in 0.54s]
2 of 12 START sql view model jaffle_analytics.stg_locations .................... [RUN]
2 of 12 OK created sql view model jaffle_analytics.stg_locations ............... [SUCCESS 1 in 0.48s]
3 of 12 START sql view model jaffle_analytics.stg_order_items .................. [RUN]
3 of 12 OK created sql view model jaffle_analytics.stg_order_items ............. [SUCCESS 1 in 0.51s]
4 of 12 START sql view model jaffle_analytics.stg_orders ....................... [RUN]
4 of 12 OK created sql view model jaffle_analytics.stg_orders .................. [SUCCESS 1 in 0.77s]
5 of 12 START sql view model jaffle_analytics.stg_products ..................... [RUN]
5 of 12 OK created sql view model jaffle_analytics.stg_products ................ [SUCCESS 1 in 0.58s]
6 of 12 START sql view model jaffle_analytics.stg_supplies ..................... [RUN]
6 of 12 OK created sql view model jaffle_analytics.stg_supplies ................ [SUCCESS 1 in 0.63s]
7 of 12 START sql table model jaffle_analytics.locations ....................... [RUN]
7 of 12 OK created sql table model jaffle_analytics.locations .................. [SUCCESS 1 in 1.81s]
8 of 12 START sql table model jaffle_analytics.products ........................ [RUN]
8 of 12 OK created sql table model jaffle_analytics.products ................... [SUCCESS 1 in 1.33s]
9 of 12 START sql table model jaffle_analytics.order_items ..................... [RUN]
9 of 12 OK created sql table model jaffle_analytics.order_items ................ [SUCCESS 1 in 2.09s]
10 of 12 START sql table model jaffle_analytics.supplies ....................... [RUN]
10 of 12 OK created sql table model jaffle_analytics.supplies .................. [SUCCESS 1 in 1.26s]
11 of 12 START sql table model jaffle_analytics.orders ......................... [RUN]
11 of 12 OK created sql table model jaffle_analytics.orders .................... [SUCCESS 1 in 1.70s]
12 of 12 START sql table model jaffle_analytics.customers ...................... [RUN]
12 of 12 OK created sql table model jaffle_analytics.customers ................. [SUCCESS 1 in 1.77s]

Finished running 6 table models, 6 view models in 0 hours 0 minutes and 17.77 seconds (17.77s).

Completed successfully

Done. PASS=12 WARN=0 ERROR=0 SKIP=0 NO-OP=0 TOTAL=12
```

</TabItem>
<TabItem value="with" label="С dbt State">

```shell
Running with dbt=1.12.0-b2
State adapter: dbt-state v2.43.1 is enabled
Registered adapter: snowflake=1.11.5
Unable to do partial parsing because of a version mismatch
Found 12 models, 6 seeds, 27 data tests, 6 sources, 658 macros, 3 unit tests

Concurrency: 1 threads (target='prod')

1 of 12 START sql view model jaffle_analytics.stg_customers .................... [RUN]
State adapter: Fetching freshness metadata
1 of 12 OK created sql view model jaffle_analytics.stg_customers ............... [No new changes in 2.73s]
2 of 12 START sql view model jaffle_analytics.stg_locations .................... [RUN]
2 of 12 OK created sql view model jaffle_analytics.stg_locations ............... [No new changes in 0.87s]
3 of 12 START sql view model jaffle_analytics.stg_order_items .................. [RUN]
3 of 12 OK created sql view model jaffle_analytics.stg_order_items ............. [No new changes in 1.04s]
4 of 12 START sql view model jaffle_analytics.stg_orders ....................... [RUN]
4 of 12 OK created sql view model jaffle_analytics.stg_orders .................. [No new changes in 0.74s]
5 of 12 START sql view model jaffle_analytics.stg_products ..................... [RUN]
5 of 12 OK created sql view model jaffle_analytics.stg_products ................ [No new changes in 1.47s]
6 of 12 START sql view model jaffle_analytics.stg_supplies ..................... [RUN]
6 of 12 OK created sql view model jaffle_analytics.stg_supplies ................ [No new changes in 0.92s]
7 of 12 START sql table model jaffle_analytics.locations ....................... [RUN]
7 of 12 OK created sql table model jaffle_analytics.locations .................. [No new changes in 1.84s]
8 of 12 START sql table model jaffle_analytics.products ........................ [RUN]
8 of 12 OK created sql table model jaffle_analytics.products ................... [No new changes in 1.99s]
9 of 12 START sql table model jaffle_analytics.order_items ..................... [RUN]
9 of 12 OK created sql table model jaffle_analytics.order_items ................ [No new changes in 2.35s]
10 of 12 START sql table model jaffle_analytics.supplies ....................... [RUN]
10 of 12 OK created sql table model jaffle_analytics.supplies .................. [No new changes in 0.24s]
11 of 12 START sql table model jaffle_analytics.orders ......................... [RUN]
11 of 12 OK created sql table model jaffle_analytics.orders .................... [No new changes in 1.07s]
12 of 12 START sql table model jaffle_analytics.customers ...................... [RUN]
12 of 12 OK created sql table model jaffle_analytics.customers ................. [No new changes in 2.19s]

Finished running 6 table models, 6 view models in 0 hours 0 minutes and 19.79 seconds (19.79s).

Completed successfully. Total cache hits: 12. Estimated time saved: 17.77s. Freshness tolerance: 45m.

Done. PASS=0 WARN=0 ERROR=0 SKIP=0 NO-OP=0 REUSED=12 TOTAL=12
```

</TabItem>
</Tabs>

## Выбор модели в новой среде разработки после изменения модели customers {#selecting-a-model-in-a-fresh-dev-environment-after-changing-the-customers-model}

```shell
dbt run --target dev --select "customers"
```

Представьте, что вы внесли небольшое изменение в модель `customers` и запустили её в новой схеме разработчика. Без dbt State <Constant name="core" /> завершается с ошибкой, поскольку вышестоящие объекты базы данных отсутствуют. С dbt State dbt [перенаправляет ссылки](/docs/deploy/dbt-state-deferral) на вышестоящие модели в prod и запускает только обновлённую модель `customers`.

<Tabs queryString="select-customers-fresh-dev">
<TabItem value="without" label="Без dbt State">

```shell
Running with dbt=1.12.0-b2
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 658 macros, 3 unit tests

Concurrency: 1 threads (target='dev')

1 of 1 START sql table model dbt_schema.customers .............................. [RUN]
1 of 1 ERROR creating sql table model dbt_schema.customers ..................... [ERROR in 0.36s]

Finished running 1 table model in 0 hours 0 minutes and 5.11 seconds (5.11s).

Completed with 1 error, 0 partial successes, and 0 warnings:

[ERROR]: in model customers (models/marts/customers.sql)
  Database Error in model customers (models/marts/customers.sql)
  002003 (42S02): SQL compilation error:
  Object 'ANALYTICS.DBT_SCHEMA.STG_CUSTOMERS' does not exist or not authorized.
  compiled code at target/run/jaffle_shop/models/marts/customers.sql

  compiled code at target/compiled/jaffle_shop/models/marts/customers.sql

Done. PASS=0 WARN=0 ERROR=1 SKIP=0 NO-OP=0 REUSED=0 TOTAL=1
```

</TabItem>
<TabItem value="with" label="С dbt State">

```shell
Running with dbt=1.12.0-b2
State adapter: dbt-state v2.43.1 is enabled
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 658 macros, 3 unit tests

Concurrency: 1 threads (target='dev')

1 of 1 START sql table model dbt_schema.customers .............................. [RUN]
State adapter: Fetching freshness metadata
1 of 1 OK created sql table model dbt_schema.customers ......................... [SUCCESS 128 in 52.46s]

Finished running 1 table model in 0 hours 0 minutes and 58.06 seconds (58.06s).

Completed successfully

Done. PASS=1 WARN=0 ERROR=0 SKIP=0 NO-OP=0 REUSED=0 TOTAL=1
```


</TabItem>
</Tabs>


## Выбор модели в новой схеме разработки без изменений в моделях {#selecting-a-model-in-a-new-dev-schema-with-no-model-changes}

```shell
dbt run --target dev --select "customers"
```

Предположим, вы создаёте новую схему разработки и запускаете только модель `customers`. Без dbt State <Constant name="core" /> завершается с ошибкой, поскольку в схеме нет данных. С dbt State dbt знает, что модель `customers` только что была построена в другой схеме: он перенаправляет ссылки на вышестоящие модели в prod и клонирует `customers`, поскольку результат не изменился.

<Tabs queryString="select-customers-new-dev">
<TabItem value="without" label="Без dbt State">

```shell
Running with dbt=1.12.0-b2
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 658 macros, 3 unit tests

Concurrency: 1 threads (target='dev')

1 of 1 START sql table model dbt_schema.customers .............................. [RUN]
1 of 1 ERROR creating sql table model dbt_schema.customers ..................... [ERROR in 0.36s]

Finished running 1 table model in 0 hours 0 minutes and 5.11 seconds (5.11s).

Completed with 1 error, 0 partial successes, and 0 warnings:

[ERROR]: in model customers (models/marts/customers.sql)
  Database Error in model customers (models/marts/customers.sql)
  002003 (42S02): SQL compilation error:
  Object 'ANALYTICS.DBT_SCHEMA.STG_CUSTOMERS' does not exist or not authorized.
  compiled code at target/run/jaffle_shop/models/marts/customers.sql

  compiled code at target/compiled/jaffle_shop/models/marts/customers.sql

Done. PASS=0 WARN=0 ERROR=1 SKIP=0 NO-OP=0 REUSED=0 TOTAL=1
```

</TabItem>
<TabItem value="with" label="С dbt State">

```shell
Running with dbt=1.12.0-b2
State adapter: dbt-state v2.43.1 is enabled
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 658 macros, 3 unit tests

Concurrency: 1 threads (target='dev')

1 of 1 START sql table model dbt_schema.customers .............................. [RUN]
State adapter: Fetching freshness metadata
1 of 1 OK created sql table model dbt_schema.customers ......................... [Cloned from other environment in 57.19s]

Finished running 1 table model in 0 hours 1 minutes and 3.50 seconds (63.50s).

Completed successfully. Total cache hits: 1. Estimated time saved: 2.20s. Freshness tolerance: 45m.

Done. PASS=0 WARN=0 ERROR=0 SKIP=0 NO-OP=0 REUSED=1 TOTAL=1
```

</TabItem>
</Tabs>

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
- [Настройка аутентификации для неинтерактивных сред](/docs/deploy/dbt-state-cicd)
- [Настройка перенаправления ссылок в dbt State](/docs/deploy/dbt-state-deferral)
- [Мониторинг активности dbt State на платформе dbt](/docs/deploy/dbt-state-interface)
- [Переход с оркестрации с учётом состояния на dbt State](/docs/deploy/dbt-state-migration)
- [Параметры конфигурации dbt State](/reference/resource-configs/dbt-state-configs)
