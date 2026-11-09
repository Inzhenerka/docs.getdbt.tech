---
title: "О команде dbt compile"
description: "Команда dbt compile создает исполняемый SQL-код из моделей, тестов данных, аналитических запросов, функций и снимков."
sidebar_label: "compile"
id: "compile"
---

import InfoSchemaStaticAnalysis from '/snippets/_info-schema-static-analysis.md';
import InfoSchemaIntro from '/snippets/_info-schema-intro.md';

`dbt compile` генерирует исполняемый SQL из исходных файлов для следующих ресурсов:

<VersionBlock lastVersion="1.11">
- [Модели](/docs/build/models)
- [Тесты данных](/docs/build/data-tests)
- [Анализы](/docs/build/analyses)
- [Функции](/docs/build/udfs)
</VersionBlock>
<VersionBlock firstVersion="1.12">
- [Модели](/docs/build/models)
- [Тесты данных](/docs/build/data-tests)
- [Анализы](/docs/build/analyses)
- [Функции](/docs/build/udfs)
- [Снимки](/docs/build/snapshots) (доступны в <Constant name="dbt" /> v1.12)
</VersionBlock>

Эти скомпилированные SQL-файлы находятся в каталоге `target/` вашего проекта dbt.

Команда `compile` полезна для:

- Визуальная проверка скомпилированного содержимого файлов ресурсов. Это полезно для проверки сложной логики Jinja или использования макросов.
- Ручное выполнение скомпилированного SQL. При отладке модели или [теста данных](/docs/build/data-tests) часто полезно выполнить лежащий в их основе оператор `select`, чтобы найти источник ошибки.
- Компиляция файлов `analysis`. Подробнее о файлах анализа читайте [здесь](/docs/build/analyses).

Некоторые распространенные заблуждения:
- `dbt compile` _не_ является предварительным условием для `dbt run` или других команд сборки. Эти команды сами выполнят компиляцию.
- Если вы хотите, чтобы dbt просто прочитал и проверил код вашего проекта без подключения к хранилищу данных, используйте `dbt parse`.

<a id="interactive-compile" />

## Интерактивная компиляция

Начиная с dbt версии 1.5, `compile` может быть "интерактивной" в CLI, отображая скомпилированный код узла или произвольного dbt-SQL запроса:
- `--select` конкретный узел _по имени_
- `--inline` произвольный dbt-SQL запрос

Это выведет скомпилированный SQL в терминал, а также запишет его в директорию `target/`.

Например:

```bash
dbt compile --select "stg_orders"                           
dbt compile --inline "select * from {{ ref('raw_orders') }}"
```

возвращает следующее:

```bash
dbt compile --select "stg_orders"                           

21:17:09  Running with dbt=1.7.5
21:17:09  Registered adapter: postgres=1.7.5
21:17:09  Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 401 macros, 0 groups, 0 semantic models
21:17:09  
21:17:09 Concurrency: 24 threads (target='dev')
21:17:09  
21:17:09  Compiled node 'stg_orders' is:
with source as (
    select * from "jaffle_shop"."main"."raw_orders"

),

renamed as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from source

)

select * from renamed
```

```bash
dbt compile --inline "select * from {{ ref('raw_orders') }}"

18:15:49  Running with dbt=1.7.5
18:15:50  Registered adapter: postgres=1.7.5
18:15:50  Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 401 macros, 0 groups, 0 semantic models
18:15:50  
18:15:50  Concurrency: 5 threads (target='postgres')
18:15:50  
18:15:50  Compiled inline node is:
select * from "jaffle_shop"."main"."raw_orders"
```

Команда обращается к платформе данных для получения метаданных, связанных с кешем, и выполнения интроспективных запросов. Используйте следующие флаги:
- `--no-populate-cache` — отключает первоначальное заполнение кеша. Если потребуются метаданные, их не окажется в кеше, и dbt потребуется выполнить запрос метаданных. Это флаг команды `dbt`, поэтому перед ним нужно указать `dbt`. Например: `dbt --no-populate-cache`.
- `--no-introspect` — отключает [интроспективные запросы](/faqs/Warehouse/db-connection-dbt-compile#introspective-queries). dbt выдаст ошибку, если определение ресурса требует выполнения такого запроса. Это флаг команды `dbt compile`, поэтому перед ним нужно указать `dbt compile`. Например: `dbt compile --no-introspect`.

:::caution Ресурсы, использующие интроспективные запросы
Скомпилированный SQL для ресурсов, использующих интроспективные запросы, может зависеть от метаданных вашего хранилища. Компиляция может быть неполной или давать разные результаты в зависимости от состояния этих метаданных.
:::

## Компиляция тестов с помощью `--select`

Вы можете использовать `dbt compile` для компиляции тестов, если ваш селектор соответствует узлу теста в проекте. Вы также можете выбирать группы тестов с помощью методов селекторов:

**Скомпилировать все узлы тестов:**

```bash
dbt compile --select "resource_type:test"
```

**Скомпилировать только универсальные тесты:**

```bash
dbt compile --select "test_type:generic"
```

**Скомпилировать только единичные тесты:**

```bash
dbt compile --select "test_type:singular"
```

Если dbt возвращает `selection does not match any nodes`, ваш селектор не соответствует ни одному обнаруженному узлу. Чтобы устранить проблему:

1. Выведите список тестов для селектора модели:

```bash
dbt ls --resource-type test --select "MODEL_NAME"
```

2. Скопируйте одно из возвращённых имён узлов тестов в `dbt compile --select`:

```bash
dbt compile --select "TEST_NODE_NAME"
```

Например, возвращённое имя узла теста может выглядеть так:

```text
FULL_TEST_NODE_NAME
```

3. Если список тестов пуст, проверьте определения тестов и пути проекта, прежде чем снова запускать `compile`.

Дополнительные варианты селекторов приведены в разделе [Примеры выбора тестов](/reference/node-selection/test-selection-examples).

<VersionBlock firstVersion="2.0">

## Информационная схема dbt

<InfoSchemaIntro />

```shell
dbt compile --generate-info-schema --static-analysis strict
```

</VersionBlock>

## Часто задаваемые вопросы
<FAQ path="Warehouse/db-connection-dbt-compile" />
