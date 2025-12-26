---
title: "О команде dbt test"
sidebar_label: "test"
id: "test"
---

`dbt test` запускает тесты данных, определенные для моделей, источников, снимков и семян, а также модульные тесты, определенные для SQL-моделей. Ожидается, что вы уже создали эти ресурсы с помощью соответствующих команд.

Тесты для запуска можно выбрать с помощью флага `--select`, обсуждаемого [здесь](/reference/node-selection/syntax).

```bash
# запуск тестов данных и модульных тестов
dbt test

# запуск только тестов данных
dbt test --select test_type:data

# запуск только модульных тестов
dbt test --select test_type:unit

# запуск тестов для one_specific_model
dbt test --select "one_specific_model"

# запуск тестов для всех моделей в пакете
dbt test --select "some_package.*"

# запуск только индивидуально определенных тестов данных
dbt test --select "test_type:singular"

# запуск только общих тестов данных
dbt test --select "test_type:generic"

# запуск тестов данных, ограниченных one_specific_model
dbt test --select "one_specific_model,test_type:data"

# запуск модульных тестов, ограниченных one_specific_model
dbt test --select "one_specific_model,test_type:unit"
```

Чтобы узнать больше о написании тестов, ознакомьтесь с документацией по [data testing](/docs/build/data-tests) и [unit testing](/docs/build/unit-tests).

</VersionBlock>