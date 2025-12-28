---
title: "Конфигурации Microsoft Fabric Data Warehouse"
id: "fabric-configs"
---

На этой странице описываются параметры конфигурации, специфичные для адаптера `dbt-fabric` при работе с Microsoft Fabric Data Warehouse. Здесь приводится обзор поддерживаемых материализаций, стратегий инкрементальной загрузки (включая [merge](#merge) и ]microbatch](#microbatch)), межхранилищных ссылок, снапшотов хранилища и настройки профиля.

## Материализации

Эфемерная материализация не поддерживается, так как T-SQL не поддерживает вложенные CTE. Она может работать в некоторых случаях, когда вы работаете с очень простыми эфемерными моделями.

### Таблицы

Таблицы — это материализация по умолчанию в dbt-fabric. Когда вы настраиваете модель как `table`, dbt при каждом запуске будет создавать или заменять таблицу в Fabric Data Warehouse.

<Tabs
defaultValue="model"
values={[
{label: 'Конфигурация модели', value: 'model'},
{label: 'Конфигурация проекта', value: 'project'}
]}
>

<TabItem value="model">

<File name="models/example.sql">

```sql
{{
    config(
        materialized='table'
        )
}}

select *
from ...
```

</File>

</TabItem>

<TabItem value="project">

<File name="dbt_project.yml">

```yaml
models:
  your_project_name:
    materialized: view
    staging:
      materialized: table
```

</File>

</TabItem>

</Tabs>

> **Ограничение:** Вложенные <Term id="cte"/> не поддерживаются при материализации моделей. Модели, использующие несколько вложенных CTE, могут завершиться с ошибкой во время компиляции или выполнения.

## Клонирование таблиц
Материализация `table_clone` создает физическую копию существующей таблицы, используя возможности клонирования Fabric. Это полезно для версионирования, ветвления или рабочих процессов наподобие снапшотов.

```sql
{{ config(materialized='table_clone', clone_from='staging_table') }}
select * from staging_table
```

**Заметки:**
- Исходная таблица должна существовать в целевом хранилище данных.
- Клонирование сохраняет схему и состояние данных на момент создания.
- Идеально подходит для сценариев, требующих быстрого дублирования без копирования данных (zero-copy) для тестирования или отката.

## Сиды (Seeds)

По умолчанию `dbt-fabric` пытается загружать seed‑файлы пакетами по 400 строк.  
Если это значение превышает ограничение Microsoft Fabric Data Warehouse в 2100 параметров, адаптер автоматически уменьшит размер пакета до максимально допустимого безопасного значения.

Чтобы установить другое значение по умолчанию для seed, вы можете задать переменную `max_batch_size` в конфигурации вашего проекта.

<File name="dbt_project.yml">

```yaml
vars:
  max_batch_size: 200 # Любое целое число, меньшее или равное 2100, подойдет.
```

</File>

## Views
Вы можете создавать представления (views), используя материализацию `view`:

```sql
{{ config(materialized='view') }}
select * from source_data
```

Также это можно задать глобально:

```yaml
models:
  my_project:
    +materialized: view
```

> **Ограничение:** В материализациях моделей не поддерживаются вложенные CTE (Common Table Expressions). Модели, использующие несколько уровней вложенных CTE, могут завершиться ошибкой на этапе компиляции или выполнения.


## Снимки (Snapshots)

Столбцы в исходных таблицах не могут иметь никаких ограничений. Если, например, любой столбец имеет ограничение `NOT NULL`, будет выдана ошибка.

## Индексы

Индексы не поддерживаются в Microsoft Fabric Data Warehouse. Любые индексы, указанные в конфигурации, игнорируются адаптером.

## Права с автоматическим предоставлением

Гранты с автоматическим предоставлением (auto provisioning) в настоящее время не поддерживаются Microsoft Fabric Data Warehouse.

## Инкрементальные модели

Инкрементальные материализации поддерживаются с использованием нескольких стратегий. В **dbt-fabric** **стратегией по умолчанию является `merge`**, представленная в версии v1.9.7. Другие поддерживаемые стратегии включают `append`, `delete+insert` и `microbatch`.

### Merge (по умолчанию)
Стратегия `merge` автоматически обновляет существующие записи и вставляет новые на основе настроенного `unique_key`.

```sql
{{
  config(
    materialized='incremental',
    unique_key='id'
  )
}}
select * from source_table
{% if is_incremental() %}
  where updated_at > (select max(updated_at) from {{ this }})
{% endif %}
```

### Append
Добавляет новые записи к существующему набору данных.

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='append'
  )
}}
select * from new_data
```

### Delete+Insert
Удаляет и повторно вставляет данные на основе `unique_key`.

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='delete+insert',
    unique_key='id'
  )
}}
select * from updated_data
```

### Microbatch
Стратегия `microbatch` обрабатывает данные в ограниченных временных интервалах, используя колонку с временной меткой события.

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='microbatch',
    event_time='event_timestamp',
    batch_size='1 day'
  )
}}

select * from raw_events
```

#### Примечания
- [`event_time`](/reference/resource-configs/event-time) должен быть корректной колонкой с типом timestamp.
- dbt обрабатывает каждый батч независимо, что позволяет эффективно выполнять инкрементальное обновление больших временных рядов.
- Если `unique_key` не указан, dbt-fabric по умолчанию использует стратегию `append`.

Подробнее см. [Incremental models](/docs/build/incremental-models).

## Разрешения

Идентификатор Microsoft Entra (пользователь или служебный принципал) должен быть администратором рабочей области Fabric, чтобы работать на уровне базы данных в настоящее время. В будущем будет внедрен более детальный контроль доступа.

## Ссылки между хранилищами

Адаптер **dbt-fabric** поддерживает межхранилищные запросы (cross-warehouse queries) с использованием макросов `source()` или `ref()`.

```sql
select * from {{ source('sales_dw', 'transactions') }}
union all
select * from {{ ref('customer_dim') }}
```

Убедитесь, что соответствующие определения моделей или источников указывают корректный параметр `database:`, чтобы ссылаться на другое хранилище Fabric Warehouse.

Пример `sources.yml`:
```yaml
sources:
  - name: sales_dw
    database: saleswarehouse
    schema: sales
    tables:
      - name: transactions
```

> Чтобы использовать межхранилищные ссылки или снимки хранилища (warehouse snapshots), убедитесь, что настроенная здесь учётная запись (identity) имеет доступ ко всем используемым Fabric Warehouses.

## Снимки хранилища

Снимки хранилища Microsoft Fabric (warehouse snapshots) — это доступные только для чтения копии вашего хранилища на определённый момент времени, которые хранятся до 30 дней. Они позволяют аналитикам выполнять запросы к стабильному набору данных, даже когда ELT-процессы обновляют хранилище. При перемещении временной метки снимка вперёд все изменения применяются одновременно (атомарно).

dbt-fabric поддерживает снимки хранилища, что помогает отслеживать изменения объектов Fabric Data Warehouse между запусками dbt. Fabric автоматически создаёт снимки _до_ и _после_ выполнения команд `dbt run`, `dbt build` или `dbt snapshot`.

Для их использования в вашем `profiles.yml` необходимо указать `workspace_id` и имя снимка хранилища, чтобы dbt мог создать снимок как дочерний объект вашего хранилища.

Подробнее см. [здесь](https://learn.microsoft.com/en-us/fabric/data-warehouse/warehouse-snapshot)

```yaml
fabric_dw:
  target: dev
  outputs:
    dev:
      type: fabric
      server: "<your-fabric-server-name>"
      database: "<your-warehouse-name>"
      schema: "<default-schema>"
      authentication: CLI
      workspace_id: e4487eff-d67d-4b58-917c-ffbb61a5c05f
      warehouse_snapshot_name: dbt-dwtests-snpshot
```

### Поведение
- Перед выполнением операции dbt (`run`, `build`, `snapshot`) адаптер фиксирует состояние затронутых таблиц до изменений.
- После выполнения создаётся снимок хранилища с соответствующей временной меткой.

Дополнительные сведения:
- [Документация dbt по snapshot](/docs/build/snapshots)
- [Справочник по snapshot в Fabric adapter](/reference/resource-configs/fabric-configs)

## dbt-utils

В настоящий момент не поддерживается. Однако dbt-fabric предоставляет некоторые макросы из dbt-utils. Подробности см. в пакете [tsql-utils](https://github.com/dbt-msft/tsql-utils).
