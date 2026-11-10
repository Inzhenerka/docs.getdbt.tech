---
title: "sql_header в тестах данных"
id: "require_sql_header_in_test_configs"
sidebar_label: "sql_header в конфигурациях тестов"
---

| require_sql_header_in_test_configs | <Constant name="dbt" /> **v1 Latest** | <Constant name="core" /> |
|---|---|---|
| Введён | 2026.3 | 1.12.0 |
| Стабилизирован (по умолчанию → `true`) | — | — |
| Удалён | — | — |

Установите флаг `require_sql_header_in_test_configs` в значение `true`, чтобы включить поддержку конфигурации [`sql_header`](/reference/resource-configs/sql_header) для универсальных тестов данных. Когда флаг включён, вы можете задать `sql_header` в разделе `config` универсального теста данных на уровне модели или столбца в файле `properties.yml`. С помощью `sql_header` можно определить SQL-код, который должен выполняться перед запуском теста (например, для создания временных функций, установки параметров сеанса или объявления переменных, необходимых для запроса теста). dbt выполняет этот SQL-код перед выполнением теста.

Например:

<File name="models/properties.yml">

```yaml
models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - not_null:
              name: not_null_orders_order_id
              config:
                sql_header: "-- SQL_HEADER_TEST_MARKER"
```

</File>

Дополнительную информацию см. в разделе [Конфигурации тестов данных](/reference/data-test-configs).
