---
title: "Тип ресурса"
id: "resource-type"
sidebar: "тип ресурса"
---

<VersionBlock lastVersion="1.8">

Флаги `--resource-type` и `--exclude-resource-type` включают или исключают типы ресурсов из команд `dbt build`, `dbt clone` и `dbt list`. Начиная с версии dbt v1.9, эти флаги также поддерживаются в команде `dbt test`.

</VersionBlock>

<VersionBlock firstVersion="1.9">

Флаги `--resource-type` и `--exclude-resource-type` включают или исключают типы ресурсов из команд `dbt build`, `dbt test`, `dbt clone` и `dbt list`.

</VersionBlock>

Это означает, что флаги позволяют вам указывать, какие типы ресурсов включать или исключать при выполнении команд, вместо того чтобы нацеливаться на конкретные ресурсы.

:::tip Примечание
Флаг `--exclude-resource-type` доступен только в версиях dbt 1.8 и выше. Если вы используете более старые версии, этот флаг не будет доступен.
:::

Доступные типы ресурсов:

<VersionBlock lastVersion="1.7">

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

</VersionBlock>

<VersionBlock firstVersion="1.8">

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

## Пример

Вместо того чтобы нацеливаться на конкретные ресурсы, используйте флаги `--resource-type` или `--exclude-resource-type`, чтобы нацелиться на все ресурсы определенного типа: `dbt build --resource-type RESOURCE_TYPE`, заменив `RESOURCE_TYPE` на тип ресурса, который вы хотите включить.

- Например, используйте следующую команду, чтобы включить _все_ снимки из вашего процесса сборки dbt:

    <File name='Usage'>

    ```text
    dbt build --resource-type snapshot
    ```

    </File>


- В этом примере выполните следующую команду, чтобы включить _все_ сохраненные запросы с флагом `--resource-type`:

    <File name='Usage'>

    ```text
    dbt build --resource-type saved_query
    ```

    </File>

<VersionBlock firstVersion="1.8">

- В этом примере используйте следующую команду, чтобы исключить _все_ модульные тесты из вашего процесса сборки dbt. Обратите внимание, что флаг `--exclude-resource-type` доступен только в версиях dbt 1.8 и выше:

    <File name='Usage'>

    ```text
    dbt build --exclude-resource-type unit_test
    ```

    </File>

- В этом примере используйте следующую команду, чтобы включить все тесты данных в вашем процессе сборки:

    <File name='Usage'>

    ```text
    dbt build --resource-type test
    ```

    </File>

</VersionBlock>

<VersionBlock firstVersion="1.9">

- В этом примере используйте следующую команду, чтобы исключить _все_ модульные тесты при выполнении тестов:

    <File name='Usage'>

    ```text
    dbt test --exclude-resource-type unit_test
    ```

    </File>

- В этом примере используйте следующую команду, чтобы включить все тесты данных при выполнении тестов:

    <File name='Usage'>

    ```text
    dbt test --resource-type test
    ```

    </File>

</VersionBlock>