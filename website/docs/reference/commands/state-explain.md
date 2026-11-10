---
title: "dbt state explain"
sidebar_label: "state explain"
id: "state-explain"
description: "Используйте dbt state explain, чтобы узнать, почему dbt State принял каждое решение после запуска."
---

<VersionBlock firstVersion="2.0">`dbt state explain`</VersionBlock><VersionBlock lastVersion="1.99">`dbt-state explain`</VersionBlock> — это команда CLI, доступная при включении [dbt State](/docs/deploy/dbt-state-about). После завершения задания выполните эту команду, чтобы узнать, почему dbt State принял то или иное решение для каждого узла и был ли узел выполнен, пропущен или клонирован. Используйте её для проверки поведения State, отладки неожиданных пропусков или подтверждения того, что проверки актуальности данных и запросов работают должным образом.

<VersionBlock firstVersion="2.0">

```bash
dbt state explain
```

В выводе отображаются все узлы из последнего запуска с кратким описанием решения State для каждого из них:

```shell
SKIP_EXECUTION model.jaffle_shop.customers - model was a no-op because its query is up to date and its upstream data is within freshness tolerance
READY_TO_EXECUTE model.jaffle_shop.orders - model was executed because the view definition is newer than the cached execution
READY_TO_EXECUTE test.jaffle_shop.not_null_customers_customer_id - data test was executed because it has no prior execution or its query changed
UNKNOWN unit_test.jaffle_shop.orders.test_order_items_compute_to_bools_correctly - dbt State explain details unavailable
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

```bash
dbt-state explain
```

В выводе отображаются все узлы из последнего запуска с кратким описанием решения State для каждого из них:

```shell
Last run: 2 minutes ago

customers
└── [No-op] model was a no-op because its query is up to date and its upstream data is within freshness tolerance

locations
└── [Execute] model was executed because either its query didn't match or its upstream data is out of date

not_null_stg_locations_location_id
└── [Execute] data test was executed because it has no prior execution or its query changed
```


</VersionBlock>

Если вы используете <Constant name="dbt_platform" />, та же информация доступна без выполнения команды &mdash; перейдите на [**вкладку Explain**](/docs/deploy/dbt-state-interface#explain-tab) на странице сведений о запуске задания, чтобы просмотреть подробное обоснование решения для каждого узла.

## Указание файла журнала

По умолчанию <VersionBlock firstVersion="2.0">`dbt state explain`</VersionBlock><VersionBlock lastVersion="1.99">`dbt-state explain`</VersionBlock> считывает данные последнего выполнения. Чтобы проанализировать предыдущий запуск, используйте `--log-file` (или `-l`) и укажите файл состояния из каталога `logs/state/`:

<VersionBlock firstVersion="2.0">

```bash
dbt state explain --log-file 'logs/state/responses_2026_08_25_11_00_15_667.jsonl'
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

```bash
dbt-state explain --log-file 'logs/state/responses_2026_08_25_11_00_15_667.jsonl'
```

</VersionBlock>

## Использование подробного режима

Используйте флаг `--verbose`, чтобы увидеть полный пошаговый анализ для каждого узла и добавить сводку конфигурации запуска. Используйте `-s`, чтобы ограничить вывод определённым узлом.

<VersionBlock firstVersion="2.0">

```bash
dbt state explain --verbose -s my_node_name
```

В dbt v2 флаг `--verbose` добавляет сводку конфигурации запуска в начало вывода и отображает полный пошаговый анализ для каждого узла.

```shell
Run configuration:
  - started at: 2026-08-17T12:24:15.822733+00:00
  - profile: my_profile
  - target: dev
  - defer to target: prod
  - freshness tolerance: 2700 seconds
  - tolerate nondeterminism: true
  - clone incremental in dev: IF_TABLE_MISSING
  - metadata cache TTL: 0 seconds
  - select: fqn:my_node_name
SKIP_EXECUTION model.jaffle_shop.customers - model was a no-op because its query is up to date and its upstream data is within freshness tolerance
  - table analysis ("ANALYTICS"."MY_SCHEMA"."CUSTOMERS")
    - the model table exists already [SUCCESS, TARGET_TABLE_EXISTS]
  - query analysis
    - the model query has not changed [SUCCESS, NODE_QUERY_UNCHANGED]
    - upstream model queries have not changed [SUCCESS]
  - data freshness analysis
    - upstream dependencies
      - "ANALYTICS"."MY_SCHEMA_RAW"."RAW_CUSTOMERS" [FRESH]
        - no updates since "ANALYTICS"."MY_SCHEMA"."CUSTOMERS" last executed
        - last updated: 5 days ago
    - upstream data is up to date [SUCCESS]
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

```bash
dbt-state explain --verbose -s my_node_name
```

Подробный вывод отображает полный пошаговый анализ и добавляет сводку конфигурации запуска:

```shell
Last run: 2026-08-19 20:19:00 PST (10 minutes ago)

  Run configuration:
  ├── dbt State:
  │   ├── defer to target: prod
  │   ├── freshness tolerance: 45 minutes (2700 seconds)
  │   ├── tolerate non-determinism: True
  │   ├── clone incremental in dev: IF_TABLE_MISSING
  │   └── metadata cache ttl: infinite (cache never expires)
  └── dbt:
      ├── profile: jaffle_shop
      └── target: dev

  customers
  ├── table analysis ("ANALYTICS"."DBT_SCHEMA"."CUSTOMERS")
  │   └── ✓ the model table exists already in 'dev'
  ├── query analysis
  │   ├── ✓ the model query has not changed
  │   └── ✓ upstream model queries have not changed
  └── data freshness analysis
      ├── upstream dependencies
      │   ├── [fresh] "ANALYTICS"."RAW"."RAW_CUSTOMERS"
      │   │   ├── no updates since "ANALYTICS"."DBT_SCHEMA"."CUSTOMERS" last
      │   │   │   executed
      │   │   └── last updated: a month ago, 2026-07-31 13:22:30 UTC
      │   └── [within tolerance] "ANALYTICS"."DBT_SCHEMA"."ORDERS"
      │       ├── updated a moment after "ANALYTICS"."DBT_SCHEMA"."CUSTOMERS" last
      │       │   executed (tolerance: 45 minutes)
      │       └── last updated: 39 seconds ago, 2026-08-19 12:18:40 UTC
      └── ✓ upstream data is outdated (within tolerance)
  decision: [No-op] model was a no-op because its query is up to date and its upstream data is within freshness tolerance
```

</VersionBlock>

Флаг `--verbose` выводит подробное обоснование решения, которое в зависимости от типа узла может включать следующие виды анализа:

- **Анализ таблицы**: существует ли целевая таблица в схеме
- **Анализ запросов**: изменился ли запрос модели или запросы вышестоящих моделей
- **Анализ актуальности данных**: актуальны ли данные вышестоящих узлов или находится ли их отставание в пределах настроенного значения [`lag_tolerance`](/reference/resource-configs/lag-tolerance)

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Мониторинг работы dbt State](/docs/deploy/dbt-state-interface)
- [Настройки dbt State](/reference/resource-configs/dbt-state-configs)
