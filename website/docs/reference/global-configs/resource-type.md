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


## Положительные и отрицательные фильтры {#positive-vs-negative-filters}

- `--resource-type` — это положительный фильтр &mdash; dbt запускает только те типы ресурсов, которые указаны в команде, неявно пропуская все остальные.
- `--exclude-resource-type` — это отрицательный фильтр &mdash; dbt начинает с полного каталога типов ресурсов и затем исключает типы, указанные в команде. dbt запускает всё, _кроме_ этих типов ресурсов.

Вы можете использовать оба флага в одной команде: dbt сначала применяет положительный фильтр (`--resource-type`), а затем удаляет типы, перечисленные в отрицательном фильтре (`--exclude-resource-type`). Например:

```text
dbt build --resource-type model test snapshot --exclude-resource-type snapshot
```

Обратите внимание: список типов ресурсов dbt является взаимно исключающим и вместе исчерпывающим (MECE). Это означает, что любой выбор `--resource-type` можно получить, исключив остальные типы ресурсов с помощью `--exclude-resource-type`, и наоборот.

## Примеры {#examples}

Вместо таргетинга конкретных ресурсов используйте флаги `--resource-type` или `--exclude-resource-type`, чтобы выбрать все ресурсы определенного типа: `dbt build --resource-type RESOURCE_TYPE`, заменив `RESOURCE_TYPE` на нужный тип ресурса.

Ниже приведены примеры команд для включения или исключения типов ресурсов. Обратите внимание, что флаг `--exclude-resource-type` доступен только в dbt версии 1.8 и выше.

<Expandable alt_header="Включить типы ресурсов">

### Включить несколько типов ресурсов {#include-multiple-resource-types}

Используйте следующую команду, чтобы включить несколько типов ресурсов, например data tests и models, в процессе сборки:

<File name='Использование'>

```text
dbt build --resource-type test model
```

</File>

### Включить все snapshots {#include-all-snapshots}

Используйте следующую команду, чтобы включить в процесс сборки dbt только snapshots:

<File name='Использование'>

```text
dbt build --resource-type snapshot
```

</File>


### Включить все saved queries {#include-all-saved-queries}

Используйте следующую команду, чтобы включить только saved queries с флагом `--resource-type`:

<File name='Использование'>

```text
dbt build --resource-type saved_query
```

</File>

### Включить все data tests {#include-all-data-tests}

Используйте следующую команду, чтобы включить в процесс сборки только data tests:

<File name='Использование'>

```text
dbt build --resource-type test
```

</File>

<VersionBlock firstVersion="1.9">

### Включать все data-тесты при выполнении тестирования {#include-all-data-tests-during-testing}

Используйте следующую команду, чтобы при запуске тестов включить только data tests:

<File name='Использование'>

```text
dbt test --resource-type test
```

</File>

</VersionBlock>

</Expandable>
<Expandable alt_header="Исключить типы ресурсов">

### Исключение нескольких типов ресурсов {#exclude-multiple-resource-types}

Используйте следующую команду, чтобы исключить несколько типов ресурсов, таких как data tests и models, из процесса сборки:

<File name='Использование'>

```text
dbt build --exclude-resource-type test model
```

</File>

### Исключение всех unit-тестов {#exclude-all-unit-tests}

Используйте следующую команду, чтобы исключить unit-тесты из процесса сборки dbt.

<File name='Usage'>

```text
dbt build --exclude-resource-type unit_test
```

</File>

<VersionBlock firstVersion="1.9">

### Исключение всех unit-тестов при запуске тестов {#exclude-all-unit-tests-during-testing}

Используйте следующую команду, чтобы исключить unit-тесты при выполнении тестов:

<File name='Usage'>

```text
dbt test --exclude-resource-type unit_test
```

</File>

</VersionBlock>
</Expandable>
