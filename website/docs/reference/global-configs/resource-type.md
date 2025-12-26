---
title: "Тип ресурса"
id: "resource-type"
sidebar: "resource type"
---

<VersionBlock firstVersion="1.9">

Флаги `--resource-type` и `--exclude-resource-type` включают или исключают типы ресурсов из команд `dbt build`, `dbt test`, `dbt clone` и `dbt list`.

</VersionBlock>

Это означает, что флаги позволяют вам указать, какие типы ресурсов включать или исключать при выполнении команд, вместо того чтобы нацеливаться на конкретные ресурсы.

:::tip Примечание
Флаг `--exclude-resource-type` доступен только в версии dbt 1.8 и выше. Если вы используете более старые версии, этот флаг будет недоступен.
:::

Доступные типы ресурсов:

<VersionBlock lastVersion="1.10">

- [`analysis`](/docs/build/analyses)
- [`exposure`](/docs/build/exposures)
- [`metric`](/docs/build/build-metrics-intro)
- [`model`](/docs/build/models)
- [`saved_query`](/docs/build/saved-queries)
- [`seed`](/docs/build/seeds)
- [`semantic_model`](/docs/build/semantic-models)
- [`snapshot`](/docs/build/snapshots)
- [`source`](/docs/build/sources)
- [`test`](/docs/build/data-tests)
- [`unit_test`](/docs/build/unit-tests)
</VersionBlock>

<VersionBlock firstVersion="1.11">

- [`analysis`](/docs/build/analyses)
- [`exposure`](/docs/build/exposures)
- [`function`](/docs/build/udfs)
- [`metric`](/docs/build/build-metrics-intro)
- [`model`](/docs/build/models)
- [`saved_query`](/docs/build/saved-queries)
- [`seed`](/docs/build/seeds)
- [`semantic_model`](/docs/build/semantic-models)
- [`snapshot`](/docs/build/snapshots)
- [`source`](/docs/build/sources)
- [`test`](/docs/build/data-tests)
- [`unit_test`](/docs/build/unit-tests)
</VersionBlock>


## Positive vs negative filters

- `--resource-type` is a positive filter &mdash; dbt only runs the resource types selected in the command, implicitly skipping every other type.
- `--exclude-resource-type` is a negative filter &mdash; dbt starts with the full catalog of resource types and then omits the types selected in the command. dbt runs everything _except_ those resource types. 

You can use both flags in a command; dbt first applies the positive filter (`--resource-type`) and then removes the types listed in the negative filter (`--exclude-resource-type`). For example:

```text
dbt build --resource-type model test snapshot --exclude-resource-type snapshot
```

Note that the list of dbt resource types is mutually exclusive and collectively exhaustive (MECE). This means that any `--resource-type` selection can also be achieved by excluding the other resource types using `--exclude-resource-type`, and vice versa.

## Examples

Instead of targeting specific resources, use the `--resource-type` or `--exclude-resource-type` flags to target all resources of a certain type: `dbt build --resource-type RESOURCE_TYPE`, replacing `RESOURCE_TYPE` with the resource type you want to include.

See the following sample commands for including or excluding resource types. Note that the `--exclude-resource-type` flag is only available in dbt version 1.8 and higher.

<Expandable alt_header="Include resource types">

### Include multiple resource types

Use the following command to include multiple resource types such as data tests and models in your build process:

<File name='Usage'>

```text
dbt build --resource-type test model
```

</File>

### Include all snapshots

Use the following command to only include snapshots in your dbt build process:

<File name='Usage'>

```text
dbt build --resource-type snapshot
```

</File>


### Include all saved queries

Use the following command to only include saved queries with the `--resource-type` flag:

<File name='Usage'>

```text
dbt build --resource-type saved_query
```

</File>

### Include all data tests

Use the following command to only include data tests in your build process:

<File name='Usage'>

```text
dbt build --resource-type test
```

</File>

<VersionBlock firstVersion="1.9">

### Включать все data-тесты при выполнении тестирования

Use the following command to only include data tests when running tests:

<File name='Usage'>

```text
dbt test --resource-type test
```

</File>

</VersionBlock>

</Expandable>
<Expandable alt_header="Exclude resource types">

### Исключение нескольких типов ресурсов

Используйте следующую команду, чтобы исключить несколько типов ресурсов, таких как data tests и models, из процесса сборки:

<File name='Usage'>

```text
dbt build --exclude-resource-type test model
```

</File>

### Исключение всех unit-тестов

Используйте следующую команду, чтобы исключить unit-тесты из процесса сборки dbt.

<File name='Usage'>

```text
dbt build --exclude-resource-type unit_test
```

</File>

<VersionBlock firstVersion="1.9">

### Исключение всех unit-тестов при запуске тестов

Используйте следующую команду, чтобы исключить unit-тесты при выполнении тестов:

<File name='Usage'>

```text
dbt test --exclude-resource-type unit_test
```

</File>

</VersionBlock>
</Expandable>
