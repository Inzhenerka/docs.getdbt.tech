---
title: "О команде dbt compile"
description: "Команда dbt compile создаёт исполняемый SQL из файлов моделей, тестов и аналитических запросов."
sidebar_label: "compile"
id: "compile"
---

`dbt compile` генерирует исполняемый SQL из исходных файлов `model`, `test` и `analysis`. Вы можете найти эти скомпилированные SQL файлы в директории `target/` вашего проекта dbt.

Команда `compile` полезна для:

1. Визуальный просмотр скомпилированного вывода файлов моделей. Это полезно для проверки сложной логики Jinja или использования макросов.
2. Ручной запуск скомпилированного SQL. При отладке модели или schema test часто бывает полезно выполнить лежащий в основе `select`‑запрос, чтобы найти источник ошибки.
3. Компиляция файлов `analysis`. Подробнее о файлах analysis читайте [здесь](/docs/build/analyses).

Некоторые распространенные заблуждения:
- `dbt compile` _не_ является предварительным условием для `dbt run` или других команд сборки. Эти команды сами выполнят компиляцию.
- Если вы хотите, чтобы dbt просто прочитал и проверил код вашего проекта без подключения к хранилищу данных, используйте `dbt parse`.

### Интерактивная компиляция

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

Команда обращается к платформе данных для кэширования связанной метаинформации и выполнения интроспективных запросов. Используйте флаги:
- `--no-populate-cache`, чтобы отключить начальное заполнение кэша. Если метаданные необходимы, это будет промах кэша, требующий выполнения dbt запроса метаданных. Это флаг `dbt`, что означает, что вам нужно добавить `dbt` как префикс. Например: `dbt --no-populate-cache`.
- `--no-introspect`, чтобы отключить [интроспективные запросы](/faqs/Warehouse/db-connection-dbt-compile#introspective-queries). dbt выдаст ошибку, если определение модели требует выполнения одного из них. Это флаг `dbt compile`, что означает, что вам нужно добавить `dbt compile` как префикс. Например: `dbt compile --no-introspect`.

### Часто задаваемые вопросы
<FAQ path="Warehouse/db-connection-dbt-compile" />