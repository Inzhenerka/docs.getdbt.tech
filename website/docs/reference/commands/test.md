---
title: "О команде dbt test"
sidebar_label: "test"
id: "test"
---
<VersionBlock lastVersion="1.7">

`dbt test` запускает тесты, определенные для моделей, источников, снимков и семян. Ожидается, что вы уже создали эти ресурсы с помощью соответствующих команд.

Тесты для запуска можно выбрать с помощью флага `--select`, обсуждаемого [здесь](/reference/node-selection/syntax).

```bash
# запуск тестов для one_specific_model
dbt test --select "one_specific_model"

# запуск тестов для всех моделей в пакете
dbt test --select "some_package.*"

# запуск только индивидуально определенных тестов
dbt test --select "test_type:singular"

# запуск только общих тестов
dbt test --select "test_type:generic"

# запуск индивидуальных тестов, ограниченных one_specific_model
dbt test --select "one_specific_model,test_type:singular"

# запуск общих тестов, ограниченных one_specific_model
dbt test --select "one_specific_model,test_type:generic"
```

Для получения дополнительной информации о написании тестов, см. [Документацию по тестированию](/docs/build/data-tests).

</VersionBlock>

<VersionBlock firstVersion="1.8">

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

Для получения дополнительной информации о написании тестов, прочитайте документацию по [тестированию данных](/docs/build/data-tests) и [модульному тестированию](/docs/build/unit-tests).

</VersionBlock>