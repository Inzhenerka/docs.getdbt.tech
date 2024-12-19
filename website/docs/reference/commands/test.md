---
title: "О команде dbt test"
sidebar_label: "test"
id: "test"
---
<VersionBlock lastVersion="1.7">

`dbt test` выполняет тесты, определенные для моделей, источников, снимков и семян. Ожидается, что вы уже создали эти ресурсы с помощью соответствующих команд.

Тесты, которые нужно выполнить, можно выбрать с помощью флага `--select`, о котором говорится [здесь](/reference/node-selection/syntax).

```bash
# запустить тесты для one_specific_model
dbt test --select "one_specific_model"

# запустить тесты для всех моделей в пакете
dbt test --select "some_package.*"

# запустить только тесты, определенные в единственном числе
dbt test --select "test_type:singular"

# запустить только тесты, определенные в общем виде
dbt test --select "test_type:generic"

# запустить тесты в единственном числе, ограниченные one_specific_model
dbt test --select "one_specific_model,test_type:singular"

# запустить общие тесты, ограниченные one_specific_model
dbt test --select "one_specific_model,test_type:generic"
```

Для получения дополнительной информации о написании тестов смотрите [документацию по тестированию](/docs/build/data-tests).

</VersionBlock>

<VersionBlock firstVersion="1.8">

`dbt test` выполняет тесты данных, определенные для моделей, источников, снимков и семян, а также модульные тесты, определенные для SQL моделей. Ожидается, что вы уже создали эти ресурсы с помощью соответствующих команд.

Тесты, которые нужно выполнить, можно выбрать с помощью флага `--select`, о котором говорится [здесь](/reference/node-selection/syntax).

```bash
# запустить тесты данных и модульные тесты
dbt test

# запустить только тесты данных
dbt test --select test_type:data

# запустить только модульные тесты
dbt test --select test_type:unit

# запустить тесты для one_specific_model
dbt test --select "one_specific_model"

# запустить тесты для всех моделей в пакете
dbt test --select "some_package.*"

# запустить только тесты данных, определенные в единственном числе
dbt test --select "test_type:singular"

# запустить только тесты данных, определенные в общем виде
dbt test --select "test_type:generic"

# запустить тесты данных, ограниченные one_specific_model
dbt test --select "one_specific_model,test_type:data"

# запустить модульные тесты, ограниченные one_specific_model
dbt test --select "one_specific_model,test_type:unit"
```

Для получения дополнительной информации о написании тестов читайте документацию по [тестированию данных](/docs/build/data-tests) и [модульному тестированию](/docs/build/unit-tests).

</VersionBlock>