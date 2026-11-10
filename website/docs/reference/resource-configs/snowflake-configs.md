---
title: "Конфигурации Snowflake"
id: "snowflake-configs"
description: "Конфигурации Snowflake — прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
tags: ['Snowflake', 'dbt v2', 'dbt v1']
---

import SnowflakeColumn from '/snippets/_snowflake-column-size.md';
import SnowflakePythonParams from '/snippets/_snowflake-python-config-params.md';

<SnowflakeColumn />

## Формат таблиц Iceberg {#iceberg-table-format}

Наши материалы о таблицах Iceberg в Snowflake переехали на [новую страницу](/docs/build/iceberg/adapters/snowflake-iceberg-support)!

## Динамические таблицы {#dynamic-tables}

Адаптер Snowflake поддерживает [динамические таблицы](https://docs.snowflake.com/en/user-guide/dynamic-tables-about).
Эта материализация специфична для Snowflake, поэтому настройки модели, которые
обычно доступны в `dbt` (например, для `view`), могут быть недоступны
для динамических таблиц. Эти различия будут сокращаться в будущих исправлениях и версиях.
Хотя эта материализация специфична для Snowflake, она во многом следует реализации
[материализованных представлений](/docs/build/materializations#materialized-view).
В частности, для динамических таблиц доступна настройка `on_configuration_change`.
Для динамических таблиц поддерживаются следующие параметры конфигурации:

<VersionBlock lastVersion="1.10">

| Параметр | Тип | Обязательный | По умолчанию | Поддержка отслеживания изменений |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | no       | `apply`     | n/a                       |
| [`target_lag`](#target-lag)      | `<string>` | yes      |        | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | yes      |       | alter  |
| [`refresh_mode`](#refresh-mode)       | `<string>` | no       | `AUTO`      | refresh        |
| [`initialize`](#initialize)     | `<string>` | no       | `ON_CREATE` | n/a   |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'YAML-файл проекта', value: 'project-yaml', },
    { label: 'YAML-файл свойств', value: 'property-yaml', },
    { label: 'Настройка в SQL-файле', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): dynamic_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](#initialize): ON_CREATE | ON_SCHEDULE 
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): dynamic_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [target_lag](#target-lag): downstream | <time-delta>
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
      [refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL 
      [initialize](#initialize): ON_CREATE | ON_SCHEDULE 
```

</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",
    [refresh_mode](#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](#initialize)="ON_CREATE" | "ON_SCHEDULE", 
) }}
```

</File>

</TabItem>

</Tabs>

</VersionBlock>

<VersionBlock lastVersion="1.11">

| Параметр          | Тип       | Обязательный | По умолчанию     | Поддержка отслеживания изменений |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | нет       | `apply`     | неприменимо                       |
| [`target_lag`](#target-lag)      | `<string>` | да      |        | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | да      |       | alter  |
| [`refresh_warehouse`](#refresh-warehouse)   | `<string>` | нет       | `None`      | alter  |
| [`refresh_mode`](#refresh-mode)       | `<string>` | нет       | `AUTO`      | обновление        |
| [`initialize`](#initialize)     | `<string>` | нет       | `ON_CREATE` | неприменимо   |
| [`cluster_by`](#dynamic-table-clustering)     | `<string>` или `<list>` | нет       | `None` | alter   |
| [`immutable_where`](#immutable-where)     | `<string>` | нет       | `None` | alter   |
| [`copy_grants`](#copy-grants-dynamic-tables)     | `<boolean>` | нет       | `false` | полное обновление   |


<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'YAML-файл проекта', value: 'project-yaml', },
    { label: 'YAML-файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация в SQL-файле', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): dynamic_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_warehouse](#refresh-warehouse): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](#initialize): ON_CREATE | ON_SCHEDULE 
    [+](/reference/resource-configs/plus-prefix)[cluster_by](#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
    [+](/reference/resource-configs/plus-prefix)[immutable_where](#immutable-where): <condition>
    [+](/reference/resource-configs/plus-prefix)[copy_grants](#copy-grants-dynamic-tables): true | false

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): dynamic_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [target_lag](#target-lag): downstream | <time-delta>
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
      [refresh_warehouse](#refresh-warehouse): <warehouse-name>
      [refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
      [initialize](#initialize): ON_CREATE | ON_SCHEDULE 
      [cluster_by](#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
      [immutable_where](#immutable-where): <condition>
      [copy_grants](#copy-grants-dynamic-tables): true | false

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",
    [refresh_warehouse](#refresh-warehouse)="<warehouse-name>",
    [refresh_mode](#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](#initialize)="ON_CREATE" | "ON_SCHEDULE", 
    [cluster_by](#dynamic-table-clustering)="<column-name>" | ["<column-name>", "<column-name>", ...],
    [immutable_where](#immutable-where)="<condition>",
    [copy_grants](#copy-grants-dynamic-tables)=true | false,

) }}

```

</File>

</TabItem>

</Tabs>

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Параметр          | Тип       | Обязательный | По умолчанию     | Поддержка отслеживания изменений |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | нет       | `apply`     | неприменимо                       |
| [`target_lag`](#target-lag)      | `<string>` | нет      |        | alter          |
| [`scheduler`](#scheduler)       | `<string>` | нет       | `DISABLE`   | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | да      |       | alter  |
| [`snowflake_initialization_warehouse`](#initialization-warehouse)   | `<string>` | нет       | `None`      | alter  |
| [`refresh_warehouse`](#refresh-warehouse)   | `<string>` | нет       | `None`      | alter  |
| [`refresh_mode`](#refresh-mode)       | `<string>` | нет       | `AUTO`      | обновление        |
| [`initialize`](#initialize)     | `<string>` | нет       | `ON_CREATE` | неприменимо   |
| [`cluster_by`](#dynamic-table-clustering)     | `<string>` или `<list>` | нет       | `None` | alter   |
| [`immutable_where`](#immutable-where)     | `<string>` | нет       | `None` | alter   |
| [`copy_grants`](#copy-grants-dynamic-tables)     | `<boolean>` | нет       | `false` | полное обновление   |
| [`transient`](#transient-dynamic-tables)     | `<boolean>` | нет       | `false` | полное обновление   |


<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'YAML-файл проекта', value: 'project-yaml', },
    { label: 'YAML-файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация в SQL-файле', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): dynamic_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[scheduler](#scheduler): ENABLE | DISABLE
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[snowflake_initialization_warehouse](#initialization-warehouse): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_warehouse](#refresh-warehouse): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](#initialize): ON_CREATE | ON_SCHEDULE 
    [+](/reference/resource-configs/plus-prefix)[cluster_by](#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
    [+](/reference/resource-configs/plus-prefix)[immutable_where](#immutable-where): <condition>
    [+](/reference/resource-configs/plus-prefix)[copy_grants](#copy-grants-dynamic-tables): true | false
    [+](/reference/resource-configs/plus-prefix)[transient](#transient-dynamic-tables): true | false

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): dynamic_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [target_lag](#target-lag): downstream | <time-delta>
      [scheduler](#scheduler): ENABLE | DISABLE
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
      [snowflake_initialization_warehouse](#initialization-warehouse): <warehouse-name>
      [refresh_warehouse](#refresh-warehouse): <warehouse-name>
      [refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
      [initialize](#initialize): ON_CREATE | ON_SCHEDULE 
      [cluster_by](#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
      [immutable_where](#immutable-where): <condition>
      [copy_grants](#copy-grants-dynamic-tables): true | false
      [transient](#transient-dynamic-tables): true | false

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [scheduler](#scheduler)="ENABLE" | "DISABLE",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",
    [snowflake_initialization_warehouse](#initialization-warehouse)="<warehouse-name>",
    [refresh_warehouse](#refresh-warehouse)="<warehouse-name>",
    [refresh_mode](#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](#initialize)="ON_CREATE" | "ON_SCHEDULE", 
    [cluster_by](#dynamic-table-clustering)="<column-name>" | ["<column-name>", "<column-name>", ...],
    [immutable_where](#immutable-where)="<condition>",
    [copy_grants](#copy-grants-dynamic-tables)=true | false,
    [transient](#transient-dynamic-tables)=true | false,

) }}

```

</File>

</TabItem>

</Tabs>

</VersionBlock>

Подробнее об этих параметрах см. в [документации](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table) Snowflake:

### Target lag {#target-lag}

Snowflake поддерживает два сценария конфигурации для планирования автоматических обновлений:
- **По времени** &mdash; Указывается значение в формате `<int> { seconds | minutes | hours | days }`. Например, если динамическую таблицу нужно обновлять каждые 30 минут, используйте `target_lag='30 minutes'`.
- **Downstream** &mdash; Применимо, когда динамическая таблица используется другими динамическими таблицами. В этом сценарии `target_lag='downstream'` позволяет управлять обновлениями на целевом уровне, а не на каждом уровне цепочки.

<VersionBlock firstVersion="1.12">

#### Как `target_lag` взаимодействует с `scheduler`

`target_lag` работает совместно с [`scheduler`](#scheduler), определяя, как управлять обновлениями динамических таблиц:

<SimpleTable>

| `target_lag` | `scheduler` | Поведение |
|---|---|---|
| Задан | `ENABLE` или не указан | Snowflake управляет обновлениями автоматически. Если `scheduler` не указан, dbt по умолчанию использует `ENABLE`. |
| Не задан | `DISABLE` или не указан | dbt управляет обновлениями во время выполнения модели. Если `scheduler` не указан, dbt по умолчанию использует `DISABLE`. |
| Задан | `DISABLE` | Недопустимо: `DISABLE` не допускает указания `target_lag`. dbt выдает ошибку. |
| Не задан | `ENABLE` | Недопустимо: `ENABLE` требует указания `target_lag`. dbt выдает ошибку. |

</SimpleTable>

</VersionBlock>

Подробнее о `target_lag` читайте в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh#understanding-target-lag). Обратите внимание: Snowflake поддерживает целевую задержку не менее 1 минуты.

<VersionBlock firstVersion="1.12">

### Scheduler

Параметр `scheduler` определяет, кто обновляет динамическую таблицу: фоновый планировщик Snowflake или внешний оркестратор, например dbt. Snowflake принимает два значения:
- **ENABLE** &mdash; планировщик Snowflake автоматически обновляет таблицу по заданному `target_lag`. Обновления распространяются по графу зависимостей, чтобы сохранять согласованность снимков данных. Для этого варианта `target_lag` обязателен.
- **DISABLE** &mdash; Snowflake исключает таблицу из автоматического фонового обновления. Запускайте обновление вручную или внешним оркестратором, например через `dbt run`, который выполняет `ALTER DYNAMIC TABLE ... REFRESH`. Если этот режим указан явно, установка `target_lag` вызывает ошибку.

:::info Значения по умолчанию в dbt и Snowflake различаются
Если в DDL Snowflake опустить `SCHEDULER`, используется `ENABLE`, а параметр `TARGET_LAG` обязателен.

В dbt по умолчанию используется `DISABLE`. Если не заданы ни `scheduler`, ни `target_lag`, dbt создаёт динамическую таблицу с `scheduler: DISABLE` и сам управляет обновлениями.

Если задан `target_lag` без явного значения `scheduler`, dbt устанавливает `scheduler: ENABLE`.
:::

**Важные особенности:**
- Явное сочетание `scheduler: DISABLE` и `target_lag` вызывает ошибку. Если `scheduler` опущен, а `target_lag` задан, dbt автоматически выбирает `scheduler: ENABLE`.
- При `scheduler: DISABLE` ручное обновление не затрагивает вышестоящие динамические таблицы. Это позволяет dbt обновлять отдельные таблицы без запуска всего пайплайна. В режиме `ENABLE` обновления распространяются по графу зависимостей.
- Если таблица с `scheduler: DISABLE` зависит от других динамических таблиц, они не обновятся при обновлении зависимой таблицы. dbt должен явно управлять порядком обновления.

Пример, в котором dbt управляет обновлениями по умолчанию:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='MY_WH',
) }}

select * from {{ source('raw', 'events') }}
```

Чтобы включить планировщик Snowflake и указать целевое отставание:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='MY_WH',
    target_lag='5 minutes',
) }}

select * from {{ source('raw', 'events') }}
```

Подробнее о `scheduler` см. в [документации Snowflake](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table#optional-parameters).

</VersionBlock>

<VersionBlock firstVersion="1.11">

### Refresh warehouse

Начиная с `dbt-snowflake` v1.11, параметр `refresh_warehouse` в конфигурации модели задаёт отдельное вычислительное хранилище для автоматических обновлений динамической таблицы. Настройка [`snowflake_warehouse`](#configuring-virtual-warehouses) по-прежнему определяет хранилище для операций <Term id="ddl" />. Например, для автоматических обновлений можно использовать меньшее хранилище, а для DDL — более крупное.

Пример настройки `refresh_warehouse` в модели:

<File name='models/<model_name>.sql'>

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='LARGE_EXECUTION_WH',
    refresh_warehouse='SMALL_REFRESH_WH',
    target_lag='1 hour'
) }}

select * from {{ source('raw', 'events') }}
```

</File>

**Важные особенности:**
- Если `refresh_warehouse` не задан, `snowflake_warehouse` используется и для DDL, и для автоматических обновлений.
- Значение `refresh_warehouse` существующей динамической таблицы можно изменить без полной пересборки.
- Чтобы вернуться к поведению по умолчанию, удалите `refresh_warehouse` из конфигурации модели или явно установите `None`.

Подробнее о параметре `WAREHOUSE` см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-warehouses).

</VersionBlock>

<VersionBlock firstVersion="1.9">

### Refresh mode {#refresh-mode}

Snowflake поддерживает три варианта режима обновления:
- **AUTO** &mdash; По умолчанию принудительно использует инкрементальное обновление динамической таблицы. Если оператор `CREATE DYNAMIC TABLE` не поддерживает инкрементальный режим, таблица автоматически создаётся с полным обновлением.
- **FULL** &mdash; Принудительно выполняет полное обновление динамической таблицы, даже если она может обновляться инкрементально.
- **INCREMENTAL** &mdash; Принудительно использует инкрементальное обновление динамической таблицы. Если запрос, лежащий в основе таблицы, не может быть обновлён инкрементально, создание динамической таблицы завершится ошибкой.

Подробнее о `refresh_mode` см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

### Initialize {#initialize}

Snowflake поддерживает два варианта инициализации:
- **ON_CREATE** &mdash; Синхронно обновляет динамическую таблицу при создании. Если обновление завершается ошибкой, создание таблицы также завершается ошибкой.
- **ON_SCHEDULE** &mdash; Обновляет динамическую таблицу при следующем запланированном обновлении.

Подробнее о `initialize` см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

</VersionBlock>

<VersionBlock firstVersion="1.11">

### Неизменяемые строки {#immutable-where}

Snowflake позволяет помечать определённые строки динамической таблицы как неизменяемые с помощью предложения `IMMUTABLE WHERE`. Это запрещает Snowflake обновлять или удалять соответствующие строки при обновлении таблицы, поэтому исторические данные остаются неизменными, а обновления выполняются быстрее.

Начиная с <Constant name="dbt"/> v1.11, это поведение можно настроить с помощью параметра `immutable_where`. Этот параметр принимает SQL-выражение условия: строки, соответствующие ему, считаются неизменяемыми и не будут обновляться или удаляться при последующих обновлениях таблицы.

Например, чтобы пометить данные старше 1 дня как неизменяемые, поскольку исторические данные обычно не меняются:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='MY_WH',
    target_lag='1 hour',
    immutable_where='ts < CURRENT_TIMESTAMP() - INTERVAL \'1 DAY\''
) }}

select
    id,
    ts,
    value
from {{ source('raw', 'events') }}
```

**Ключевые моменты:**
- Параметр поддерживает рендеринг Jinja (например, переменные и макросы dbt), если результат рендеринга является допустимым SQL-условием Snowflake.
- Чтобы снять ограничение неизменяемости с существующей динамической таблицы, задайте для `immutable_where` значение `None`.
- Значение `immutable_where` можно изменять без полного обновления.

Подробнее об `IMMUTABLE WHERE` см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-immutability-constraints).

### Копирование прав доступа (динамические таблицы) {#copy-grants-dynamic-tables}

Если для динамической таблицы в dbt задано `copy_grants: true`, dbt добавляет `COPY GRANTS` в команду `CREATE OR REPLACE DYNAMIC TABLE` при выполнении `--full-refresh`. Snowflake сохраняет существующие права доступа для новой таблицы (за исключением права владения). Значение по умолчанию — `false`.

Это тот же параметр [`copy_grants`](#copying-grants), который используется для таблиц и представлений. В описании [изменения прав доступа при CREATE OR REPLACE](https://docs.snowflake.com/en/release-notes/bcr-bundles/2026_08/bcr-2433) в Snowflake динамические таблицы не указаны, и dbt не добавляет для них `IGNORE GRANTS`.

Чтобы настроить параметр `copy_grants`, используйте следующий пример:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='MY_WH',
    target_lag='1 hour',
    copy_grants=true
) }}

select * from {{ source('raw', 'events') }}
```

Подробнее о `COPY GRANTS` см. в [документации Snowflake](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table).

</VersionBlock>

<VersionBlock firstVersion="1.12">

### Транзитные динамические таблицы {#transient-dynamic-tables}

Динамические таблицы можно создавать как транзитные, чтобы снизить затраты на хранение. Для транзитных динамических таблиц не используется период [Fail-safe](https://docs.snowflake.com/en/user-guide/data-failsafe) в Snowflake, поэтому они занимают меньше места, чем постоянные динамические таблицы. Чтобы создать динамическую таблицу как транзитную, задайте `transient: true` в конфигурации модели.

Если вы хотите, чтобы все динамические таблицы по умолчанию были транзитными (без указания `transient: true` для каждой из них), включите флаг [`snowflake_default_transient_dynamic_tables`](/reference/global-configs/snowflake-changes#the-snowflake_default_transient_dynamic_tables-flag) в файле `dbt_project.yml`. По умолчанию этот флаг имеет значение `false`, то есть динамические таблицы по умолчанию создаются как постоянные.

**Ключевые моменты:**
- При указании `transient: true` динамическая таблица создаётся с ключевым словом `TRANSIENT` в команде `CREATE DYNAMIC TABLE`.
- Snowflake не поддерживает изменение свойства транзитности существующей динамической таблицы. Изменение `transient` с `true` на `false` или наоборот приводит к полному пересозданию таблицы.
- Чтобы все новые динамические таблицы по умолчанию создавались как транзитные, когда `transient` не указан, включите флаг `snowflake_default_transient_dynamic_tables` в файле `dbt_project.yml`.

Например:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='MY_WH',
    target_lag='1 hour',
    transient=true
) }}

select * from {{ source('raw', 'events') }}
```

### Виртуальный склад для инициализации {#initialization-warehouse}

Snowflake поддерживает параметр `INITIALIZATION_WAREHOUSE`, который определяет, какой виртуальный склад использовать при инициализации или повторной инициализации динамической таблицы. 

Начиная с `dbt-snowflake` v1.12, для этой настройки можно использовать параметр `snowflake_initialization_warehouse`. Он не связан с параметром `snowflake_warehouse`, который используется для регулярных инкрементальных обновлений. Задав `snowflake_initialization_warehouse`, вы можете использовать более мощный виртуальный склад для первоначального построения и повторной инициализации, сохранив менее мощный `snowflake_warehouse` для регулярных обновлений.

Чтобы настроить параметр `snowflake_initialization_warehouse`, используйте следующий пример:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='COMPUTE_WH',
    snowflake_initialization_warehouse='LARGE_WH',
    target_lag='1 minute'
) }}

select * from {{ source('raw', 'events') }}
```

**Ключевые моменты:**
- Если `snowflake_initialization_warehouse` не задан, Snowflake использует `snowflake_warehouse` как для инициализации, так и для регулярных обновлений.
- Значение `snowflake_initialization_warehouse` можно изменить для существующей динамической таблицы без полного обновления.
- Чтобы вернуться к поведению по умолчанию после настройки виртуального склада для инициализации, удалите параметр `snowflake_initialization_warehouse` из конфигурации модели или явно задайте для него значение `None`.

Подробнее об `INITIALIZATION_WAREHOUSE` см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-warehouses).

</VersionBlock>

### Ограничения

Как и в случае с материализованными представлениями на большинстве платформ, динамические таблицы имеют ряд ограничений. Среди наиболее важных:

- SQL для динамических таблиц имеет [ограниченный набор возможностей](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#query-constructs-not-currently-supported-in-dynamic-tables).
- SQL динамической таблицы нельзя обновить; таблица должна быть пересоздана через `--full-refresh` (DROP/CREATE).
- Динамические таблицы не могут зависеть от: materialized views, external tables, streams.
- Динамические таблицы не могут ссылаться на view, которые находятся ниже по цепочке от другой динамической таблицы.

Дополнительную информацию об ограничениях динамических таблиц см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#dynamic-table-limitations-and-supported-functions).

Из ограничений dbt: [контракты моделей](/docs/mesh/govern/model-contracts) не поддерживаются.

### Устранение неполадок с динамическими таблицами {#troubleshooting-dynamic-tables}

Если модель динамической таблицы не удаётся повторно выполнить после первого запуска и появляется следующая ошибка:

```sql
SnowflakeDynamicTableConfig.__init__() missing 6 required positional arguments: 'name', 'schema_name', 'database_name', 'query', 'target_lag', and 'snowflake_warehouse'
```

## Интерактивные таблицы <Lifecycle status="beta" /> {#interactive-tables}

Начиная с `dbt-snowflake` v1.12, адаптер Snowflake поддерживает [интерактивные таблицы](https://docs.snowflake.com/en/user-guide/interactive), оптимизированные для выполнения запросов с низкой задержкой. Эта материализация специфична для Snowflake, поэтому настройки моделей, которые dbt обычно предоставляет по умолчанию (например, для `view`), могут быть неприменимы к интерактивным таблицам.

:::info Поддержка интерактивных таблиц в dbt находится на стадии бета-тестирования
Интерактивные таблицы общедоступны в Snowflake, но поддержка материализации `interactive_table` в dbt находится на стадии бета-тестирования как в движке v1, так и в движке v2. Поведение и параметры настройки могут измениться.

- **<Constant name="dbt_platform" />**
- **dbt v2**
- **dbt v1** (`dbt-snowflake` v1.12+)
:::

Настройка [`target_lag`](#target-lag-interactive-tables) делает интерактивную таблицу _динамической_: Snowflake обновляет её автоматически. Без этой настройки таблица _статическая_ и пересоздаётся только при запуске dbt. Поведение некоторых из приведённых ниже настроек зависит от того, какой вариант вы используете.

Как и для динамических таблиц, для интерактивных таблиц доступна настройка [`on_configuration_change`](/reference/resource-configs/on_configuration_change). Интерактивные таблицы поддерживают следующие параметры конфигурации:

| Параметр          | Тип       | Обязательный | Значение по умолчанию     | Поддержка отслеживания изменений |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | нет       | `apply`     | неприменимо                       |
| [`cluster_by`](#cluster-by-interactive-tables)     | `<string>` или `<list>` | да       |  | полное обновление   |
| [`target_lag`](#target-lag-interactive-tables)      | `<string>` | нет      | `None`       | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | нет      | `None`      | alter  |
| [`refresh_warehouse`](#refresh-warehouse-interactive-tables)   | `<string>` | нет       | `None`      | alter  |
| [`snowflake_initialization_warehouse`](#initialization-warehouse-interactive-tables)   | `<string>` | нет       | `None`      | alter  |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'YAML-файл проекта', value: 'project-yaml', },
    { label: 'YAML-файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация в SQL-файле', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): interactive_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[cluster_by](#cluster-by-interactive-tables): <column-name> | [<column-name>, <column-name>, ...]
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag-interactive-tables): <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_warehouse](#refresh-warehouse-interactive-tables): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[snowflake_initialization_warehouse](#initialization-warehouse-interactive-tables): <warehouse-name>

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): interactive_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [cluster_by](#cluster-by-interactive-tables): <column-name> | [<column-name>, <column-name>, ...]
      [target_lag](#target-lag-interactive-tables): <time-delta>
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
      [refresh_warehouse](#refresh-warehouse-interactive-tables): <warehouse-name>
      [snowflake_initialization_warehouse](#initialization-warehouse-interactive-tables): <warehouse-name>
```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="interactive_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [cluster_by](#cluster-by-interactive-tables)="<column-name>" | ["<column-name>", "<column-name>", ...],
    [target_lag](#target-lag-interactive-tables)="<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",
    [refresh_warehouse](#refresh-warehouse-interactive-tables)="<warehouse-name>",
    [snowflake_initialization_warehouse](#initialization-warehouse-interactive-tables)="<warehouse-name>",

) }}

```

</File>

</TabItem>

</Tabs>

Подробнее об этих параметрах см. в [документации](https://docs.snowflake.com/en/sql-reference/sql/create-interactive-table) Snowflake. Перечисленные выше параметры вычислительных складов относятся к обычным виртуальным складам, которые выполняют <Term id="ddl" /> и обновления. Они не привязывают таблицу к [интерактивному складу](https://docs.snowflake.com/en/user-guide/interactive) &mdash; см. раздел [Ограничения интерактивных таблиц](#limitations-of-interactive-tables).

### Кластеризация (интерактивные таблицы) {#cluster-by-interactive-tables}

В отличие от динамических таблиц, для которых [`cluster_by`](#dynamic-table-clustering) необязателен, интерактивные таблицы _требуют_ его указания:

```sql
{{ config(
    materialized='interactive_table',
    cluster_by=['order_id'],
) }}

select * from {{ ref('stg_orders') }}
```

**Ключевые моменты:**
- dbt проверяет `cluster_by` при разборе проекта, поэтому отсутствие значения, пустой список или пустой элемент списка (например, `["id", "  "]`) приводят к ошибке на этапе разбора, а не выполнения.
- Изменение `cluster_by` для существующей интерактивной таблицы запускает полное обновление.

Рекомендации по выбору столбцов кластеризации см. в разделе [CREATE INTERACTIVE TABLE](https://docs.snowflake.com/en/sql-reference/sql/create-interactive-table) документации Snowflake.

### Целевая задержка (интерактивные таблицы) {#target-lag-interactive-tables}

Задайте `target_lag`, чтобы сделать таблицу динамической (автоматически обновляемой). Snowflake также требует указать вычислительный склад для этих обновлений, поэтому dbt выдаёт ошибку на этапе разбора, если вы задаёте `target_lag`, не указав ни [`refresh_warehouse`](#refresh-warehouse-interactive-tables), ни [`snowflake_warehouse`](#configuring-virtual-warehouses).

```sql
{{ config(
    materialized='interactive_table',
    cluster_by=['order_id'],
    target_lag='30 minutes',
    snowflake_warehouse='MY_WH',
) }}

select * from {{ ref('stg_orders') }}
```

**Ключевые моменты:**
- Изменение `target_lag` с одного значения на другое обновляет таблицу на месте с помощью инструкции `alter`.
- Добавление `target_lag` к статической таблице или его удаление из динамической таблицы приводит к замене таблицы. Snowflake не может переключаться между статическим и динамическим вариантами с помощью `alter`, поэтому dbt вместо этого выполняет `create or replace`. Передавать --full-refresh не требуется — dbt делает это за вас.

Подробнее о `TARGET_LAG` см. в разделе [CREATE INTERACTIVE TABLE](https://docs.snowflake.com/en/sql-reference/sql/create-interactive-table) документации Snowflake.

### Вычислительный склад для обновления (интерактивные таблицы) {#refresh-warehouse-interactive-tables}

Используйте `refresh_warehouse`, чтобы выполнять автоматические обновления динамической интерактивной таблицы на другом вычислительном складе, отличном от того, который dbt использует для выполнения <Term id="ddl" /> ([`snowflake_warehouse`](#configuring-virtual-warehouses)). Это позволяет использовать меньший склад для обновлений и больший — для DDL.

```sql
{{ config(
    materialized='interactive_table',
    cluster_by=['order_id'],
    target_lag='1 hour',
    snowflake_warehouse='LARGE_EXECUTION_WH',
    refresh_warehouse='SMALL_REFRESH_WH',
) }}

select * from {{ ref('stg_orders') }}
```

**Ключевые моменты:**
- Для динамической интерактивной таблицы, если `refresh_warehouse` не задан, `snowflake_warehouse` используется как для выполнения DDL, так и для операций автоматического обновления.
- Для статической интерактивной таблицы `refresh_warehouse` игнорируется, поскольку таблица никогда не обновляется автоматически. При этом `snowflake_warehouse` по-прежнему определяет, какой склад dbt использует для создания таблицы.
- Вы можете изменить `refresh_warehouse` для существующей интерактивной таблицы без полного обновления.
- Для динамической интерактивной таблицы можно изменить `refresh_warehouse` без замены таблицы. dbt обновляет её на месте с помощью инструкции `alter`.
- Чтобы снова использовать `snowflake_warehouse` для обновлений, удалите `refresh_warehouse` из конфигурации модели.

### Вычислительный склад для инициализации (интерактивные таблицы) {#initialization-warehouse-interactive-tables}

Используйте `snowflake_initialization_warehouse`, чтобы указать виртуальный склад, который Snowflake использует при инициализации или повторной инициализации динамической интерактивной таблицы. Это позволяет использовать больший склад для первоначального создания, сохранив меньший `snowflake_warehouse` для регулярных обновлений.

```sql
{{ config(
    materialized='interactive_table',
    cluster_by=['order_id'],
    target_lag='1 hour',
    snowflake_warehouse='COMPUTE_WH',
    snowflake_initialization_warehouse='LARGE_WH',
) }}

select * from {{ ref('stg_orders') }}
```

**Ключевые моменты:**
- Этот параметр применяется только к автоматически обновляемым таблицам. Если задать его для статической интерактивной таблицы (без `target_lag`), dbt проигнорирует его и выдаст предупреждение при запуске модели.
- Вы можете изменить `snowflake_initialization_warehouse` для существующей интерактивной таблицы без полного обновления.
- Чтобы вернуться к поведению по умолчанию, удалите параметр из конфигурации модели или явно задайте для него значение `None`.

### Отслеживание изменений для интерактивных таблиц

Интерактивные таблицы поддерживают [`on_configuration_change`](/reference/resource-configs/on_configuration_change).  Snowflake определяет, какие изменения конфигурации dbt может применить на месте, а какие требуют полного пересоздания:

<SimpleTable>

| Изменение конфигурации | Поведение dbt |
|---|---|
| Изменение `target_lag` с одного значения на другое | Изменяет таблицу на месте |
| `refresh_warehouse` | Изменяет таблицу на месте |
| `snowflake_initialization_warehouse` | Изменяет таблицу на месте |
| `cluster_by` | Пересоздаёт таблицу с помощью `CREATE OR REPLACE` |
| Добавление или удаление `target_lag` (переход от статической таблицы к динамической или наоборот) | Пересоздаёт таблицу с помощью `CREATE OR REPLACE` |

</SimpleTable>

### Неподдерживаемые настройки для интерактивных таблиц

Следующие настройки не поддерживаются для интерактивных таблиц. Первые две dbt отклоняет при разборе проекта, не дожидаясь ошибки выполнения в Snowflake:

- `table_format: iceberg`: У интерактивных таблиц нет варианта Iceberg.
- `transient: true`: Snowflake не допускает создание интерактивной таблицы типа transient (ошибка 001003). Если задать `transient: true` на уровне проекта в dbt_project.yml, модели интерактивных таблиц унаследуют эту настройку и завершатся с ошибкой. Задайте `transient: false` для этих моделей, чтобы переопределить её.
- `change_tracking`: Принимается, но не оказывает никакого действия. `CREATE INTERACTIVE TABLE` не принимает параметр отслеживания изменений.

### Ограничения интерактивных таблиц {#limitations-of-interactive-tables}

Ограничения, которые стоит учитывать при создании интерактивных таблиц с помощью dbt:

- В настоящее время dbt не привязывает интерактивные таблицы к [интерактивным складам](https://docs.snowflake.com/en/user-guide/interactive) и не отвязывает их. Управляйте этой связью в Snowflake. Это независимые объекты; Snowflake также может привязывать интерактивный склад к [другим типам отношений](https://docs.snowflake.com/en/user-guide/interactive#all-table-format-support-preview).
- Удаление столбца из интерактивной таблицы не поддерживается. Такая ситуация может возникнуть, если модель `incremental` с настройкой [`on_schema_change: sync_all_columns`](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change) выполняется для отношения, которое ранее было интерактивной таблицей.
- Для преобразования интерактивной таблицы в модель `incremental` требуется `--full-refresh`.
- Интерактивные таблицы нельзя клонировать или создавать в персональной базе данных.
- [Контракты моделей](/docs/mesh/govern/model-contracts) не поддерживаются.

Дополнительные сведения об ограничениях интерактивных таблиц и интерактивных складов, включая ограничения на количество таблиц на склад, см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/interactive).

### Устранение неполадок с интерактивными таблицами

:::warning Динамическая интерактивная таблица, зависящая от модели `table`, может возвращать устаревшие данные
Когда динамическая интерактивная таблица читает данные из табличной модели, управляемой dbt, инструкция `create or replace`, которую dbt выполняет для этой вышестоящей модели, уничтожает историю отслеживания изменений Snowflake. После этого интерактивная таблица больше не может обновляться автоматически, но `dbt run` по-прежнему сообщает об успехе, поэтому даже запуск без ошибок может привести к тому, что таблица будет возвращать устаревшие строки.

Для восстановления выполните запуск интерактивной таблицы с `--full-refresh`. Чтобы предотвратить проблему, добавьте к вышестоящей модели post-hook, который повторно включает отслеживание изменений:

```sql
{{ config(
    materialized='table',
    post_hook="alter table {{ this }} set change_tracking = true",
) }}
```

Обратите внимание: настройка модели `change_tracking` здесь _не_ заменяет этот хук, поскольку для обычных таблиц она не попадает в SQL. Обычные динамические таблицы подвержены той же проблеме.
:::

Если повторный запуск модели интерактивной таблицы после первоначального выполнения завершается ошибкой об отсутствующих позиционных аргументах, убедитесь, что параметр `QUOTED_IDENTIFIERS_IGNORE_CASE` в вашей учётной записи имеет значение `FALSE`.

## Семантические представления
[Семантические представления Snowflake](https://docs.snowflake.com/en/user-guide/views-semantic/overview) — это встроенные объекты уровня схемы, позволяющие централизовать определения метрик и уменьшить разрозненность логики метрик в инструментах BI и аналитики.

Используйте [пакет `dbt_semantic_view`](https://hub.getdbt.com/Snowflake-Labs/dbt_semantic_view/latest/), чтобы определять семантические представления Snowflake и управлять ими в проекте dbt. Это позволяет хранить определения семантических представлений в системе контроля версий и применять существующие процессы тестирования и CI/CD к <Constant name="semantic_layer" />.

### Установка пакета
:::note Предварительные требования
- Для этого пакета требуется `dbt` версии `>=1.0.0, <2.0.0`. Актуальные сведения о совместимости см. на странице [пакета `dbt_semantic_view`](https://hub.getdbt.com/Snowflake-Labs/dbt_semantic_view/latest/).
- Ваша учётная запись Snowflake поддерживает семантические представления.
- У вашей роли есть разрешение на создание семантических представлений.
- Вы можете записывать данные в базу данных и схему, в которых у вас есть права на создание объектов.
:::

Добавьте `dbt_semantic_view` в файл `packages.yml`:

```yaml
packages:
  - package: Snowflake-Labs/dbt_semantic_view
    version: 1.0.3
```

Выполните `dbt deps`, чтобы установить зависимости пакета:

```shell
dbt deps
```

Убедитесь, что пакет установлен: проверьте наличие `dbt_semantic_view` в каталоге `dbt_packages/`.

### Основные возможности

Пакет `dbt_semantic_view` предоставляет следующие возможности для определения семантических представлений Snowflake и управления ими в проектах dbt.

#### Материализация моделей в виде семантических представлений Snowflake

Используйте материализацию `semantic_view`, чтобы определять семантические представления Snowflake в dbt, включая таблицы, связи, факты, измерения и метрики.

Модели семантических представлений используют синтаксис семантических представлений Snowflake (например, `TABLES`, `DIMENSIONS` и `METRICS`), а не стандартный запрос `SELECT`.

Приведённый ниже пример адаптирован из руководства [Начало работы с семантическими представлениями Snowflake](https://quickstarts.snowflake.com/guide/snowflake-semantic-view/index.html?index=..%2F..index#3).
```sql
{{ config(materialized='semantic_view') }}

tables (
    CUSTOMER as {{ SOURCE('<SOURCE_NAME>', 'CUSTOMER') }} primary key (C_CUSTOMER_SK),
    DATE as {{ SOURCE('<SOURCE_NAME>', 'DATE_DIM') }} primary key (D_DATE_SK),
    DEMO as {{ SOURCE('<SOURCE_NAME>', 'CUSTOMER_DEMOGRAPHICS') }} primary key (CD_DEMO_SK),
    ITEM as {{ SOURCE('<SOURCE_NAME>', 'ITEM') }} primary key (I_ITEM_SK),
    STORE as {{ SOURCE('<SOURCE_NAME>', 'STORE') }} primary key (S_STORE_SK),
    STORESALES as {{ SOURCE('<SOURCE_NAME>', 'STORESALES') }}
    primary key (SS_SOLD_DATE_SK,SS_CDEMO_SK,SS_ITEM_SK,SS_STORE_SK,SS_CUSTOMER_SK)
)
relationships (
    SALESTOCUSTOMER as STORESALES(SS_CUSTOMER_SK) references CUSTOMER(C_CUSTOMER_SK),
    SALESTODATE as STORESALES(SS_SOLD_DATE_SK) references DATE(D_DATE_SK),
    SALESTODEMO as STORESALES(SS_CDEMO_SK) references DEMO(CD_DEMO_SK),
    SALESTOITEM as STORESALES(SS_ITEM_SK) references ITEM(I_ITEM_SK),
    SALETOSTORE as STORESALES(SS_STORE_SK) references STORE(S_STORE_SK)
)
facts (
    ITEM.COST as i_wholesale_cost,
    ITEM.PRICE as i_current_price,
    STORE.TAX_RATE as S_TAX_PERCENTAGE,
    STORESALES.SALES_QUANTITY as SS_QUANTITY
)
dimensions (
    CUSTOMER.BIRTHYEAR as C_BIRTH_YEAR,
    CUSTOMER.COUNTRY as C_BIRTH_COUNTRY,
    CUSTOMER.C_CUSTOMER_SK as c_customer_sk,
    DATE.DATE as D_DATE,
    DATE.D_DATE_SK as d_date_sk,
    DATE.MONTH as D_MOY,
    DATE.WEEK as D_WEEK_SEQ,
    DATE.YEAR as D_YEAR,
    DEMO.CD_DEMO_SK as cd_demo_sk,
    DEMO.CREDIT_RATING as CD_CREDIT_RATING,
    DEMO.MARITAL_STATUS as CD_MARITAL_STATUS,
    ITEM.BRAND as I_BRAND,
    ITEM.CATEGORY as I_CATEGORY,
    ITEM.CLASS as I_CLASS,
    ITEM.I_ITEM_SK as i_item_sk,
    STORE.MARKET as S_MARKET_ID,
    STORE.SQUAREFOOTAGE as S_FLOOR_SPACE,
    STORE.STATE as S_STATE,
    STORE.STORECOUNTRY as S_COUNTRY,
    STORE.S_STORE_SK as s_store_sk,
    STORESALES.SS_CDEMO_SK as ss_cdemo_sk,
    STORESALES.SS_CUSTOMER_SK as ss_customer_sk,
    STORESALES.SS_ITEM_SK as ss_item_sk,
    STORESALES.SS_SOLD_DATE_SK as ss_sold_date_sk,
    STORESALES.SS_STORE_SK as ss_store_sk
)
metrics (
    STORESALES.TOTALCOST as SUM(item.cost),
    STORESALES.TOTALSALESPRICE as SUM(SS_SALES_PRICE),
    STORESALES.TOTALSALESQUANTITY as SUM(SS_QUANTITY)
        WITH SYNONYMS = ('total sales quantity', 'total sales amount')
)
```

При запуске dbt эта модель компилируется в инструкцию Snowflake `CREATE SEMANTIC VIEW`.

#### Ссылки на семантические представления в других моделях dbt

Используйте `ref()` для семантических представлений, определённых в вашем проекте dbt, и `source()` для существующих внешних семантических представлений.

```sql
{{ config(materialized='view') }}

select * from semantic_view(
  {{ ref('<semantic_view_model_name>') }}
  METRICS ...
  DIMENSIONS ...
  WHERE ...
)
```

```sql
{{ config(materialized='table') }}

select * from semantic_view(
  {{ source('<source_name>', '<semantic_view>') }}
  METRICS ...
  DIMENSIONS ...
  WHERE ...
)
```

## Временные таблицы

Чтобы сократить время компиляции и избежать этапа записи в базу данных, необходимого при использовании временной таблицы, операции слияния для инкрементальных таблиц в Snowflake по умолчанию используют `view`, а не `temporary table` .

Иногда временная таблица позволяет получить результат быстрее или безопаснее. Вы можете включить использование временных таблиц или таблиц типа transient для инкрементальных построений с помощью настройки `tmp_relation_type`. Эта настройка задаётся в конфигурации модели.

Тем не менее, существуют ситуации, когда временная таблица может быть быстрее или безопаснее. Конфигурация `tmp_relation_type` позволяет явно выбрать использование временных таблиц для инкрементальных сборок. Она задаётся как часть конфигурации модели.

`tmp_relation_type` принимает следующие значения:

- `view` (по умолчанию): Пропускает промежуточный шаг создания временной физической таблицы для временного отношения; самый быстрый вариант, но подходит не для всех стратегий.
- `table`: Временная таблица, существующая в пределах сеанса; не отображается в каталоге Snowflake и изолирована от других сеансов.
- `transient`: Транзитная таблица; сохраняется в каталоге, обеспечивая [отслеживание происхождения данных встроенными средствами Snowflake](https://docs.snowflake.com/en/user-guide/ui-snowsight-lineage), и при этом позволяет избежать затрат на хранение в течение 7-дневного периода Fail-safe, предусмотренного для постоянных таблиц.
  **Примечание:** Это значение отличается от отдельной настройки `transient` на уровне модели, описанной далее, которая управляет итоговым отношением модели. 

Задаётся в YAML-файле проекта:

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  <resource-path>:
+tmp_relation_type: table | view | transient ## Если не задано, по умолчанию используется view.
```

</File>

В формате конфигурации SQL-файла модели:

<File name='dbt_model.sql'>

```sql
{{ config(
    tmp_relation_type="table | view | transient", 
    -- If not defined, view is the default.
) }}
```

</File>

:::warning Конфликты параллельных запусков при использовании `transient`

Когда для `tmp_relation_type` задано значение `transient`, временный объект становится реальной таблицей, которая сохраняется в целевой схеме под детерминированным именем. Если несколько запусков одной и той же инкрементальной модели выполняются параллельно в одной схеме, они могут перезаписывать временные объекты друг друга, что приводит к дублированию данных или некорректным результатам. Например, это может происходить, когда разработчики используют общую целевую схему или когда запуски в CI и в рабочей среде пересекаются по времени.

Этот риск зависит от того, как вы настраиваете схемы и базы данных для своих моделей dbt. Чтобы предотвратить конфликты, используйте `snowflake__resolve_incremental_tmp_relation` для размещения временных объектов в схеме, уникальной для каждого запуска или среды. Подробнее см. в разделе [Предотвращение конфликтов временных объектов](#avoiding-tmp-relation-conflicts).

:::

### Предотвращение конфликтов временных объектов {#avoiding-tmp-relation-conflicts}

Чтобы предотвратить конфликты имён при параллельных запусках, переопределите макрос диспетчеризации `snowflake__resolve_incremental_tmp_relation`, чтобы размещать временный объект в выделенной схеме:

<File name='macros/snowflake_incremental.sql'>

```sql
{% macro snowflake__resolve_incremental_tmp_relation(tmp_relation) %}
  {{ return(tmp_relation.incorporate(schema='scratch')) }}
{% endmacro %}
```

</File>

Этот макрос получает объект временного отношения по умолчанию и возвращает его изменённую версию. Распространённые варианты переопределения включают добавление имени пользователя разработчика, идентификатора задания CI или имени целевой конфигурации к имени схемы, чтобы обеспечить изоляцию параллельных запусков. 

Чтобы добавить имя целевой конфигурации к имени схемы:

<File name='macros/snowflake_incremental.sql'>

```sql
{% macro snowflake__resolve_incremental_tmp_relation(tmp_relation) %}
  {%- set scratch_schema = target.schema ~ '_scratch_' ~ env_var('DBT_JOB_ID', target.name) -%}
  {{ return(tmp_relation.incorporate(schema=scratch_schema)) }}
{% endmacro %}
```

</File>

Snowflake поддерживает создание [transient tables](https://docs.snowflake.net/manuals/user-guide/tables-temp-transient.html). Snowflake не хранит историю для таких таблиц, что может существенно снизить стоимость хранения данных. Transient таблицы участвуют в time travel в ограниченном объёме: по умолчанию период хранения составляет 1 день и отсутствует fail-safe период. При принятии решения о конфигурации моделей dbt как `transient` необходимо учитывать эти компромиссы. **По умолчанию все таблицы Snowflake, создаваемые dbt, являются `transient`.**

### Настройка transient таблиц в dbt_project.yml {#configuring-transient-tables-in-dbt_projectyml}

Целую папку (или пакет) можно настроить как transient (или наоборот), добавив соответствующую строку в файл `dbt_project.yml`. Эта конфигурация работает так же, как и остальные [конфигурации моделей](/reference/model-configs), определённые в `dbt_project.yml`.

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  +transient: false
  my_project:
    ...
```

</File>

### Настройка transient для конкретной модели {#configuring-transience-for-a-specific-model}

Конкретную модель можно настроить как transient, установив конфигурацию `transient` в `true`.

<File name='my_table.sql'>

```sql
{{ config(materialized='table', transient=true) }}

select * from ...
```

</File>

## Теги запросов (Query tags) {#query-tags}

[Query tags](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) — это параметр Snowflake,
который может быть полезен при последующем поиске в представлении [QUERY_HISTORY](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

dbt поддерживает установку тега запроса по умолчанию на время действия подключений к Snowflake в
[вашем профиле](/docs/local/connect-data-platform/snowflake-setup). Вы можете задать более точные значения (и переопределить значение по умолчанию) для отдельных групп моделей, указав
конфигурацию модели `query_tag` или переопределив стандартный макрос `set_query_tag`:

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +query_tag: dbt_special
```

</File>

<File name='models/<modelname>.sql'>

```sql
{{ config(
    query_tag = 'dbt_special'
) }}

select ...
```

</File>

В этом примере можно настроить query tag, который будет применяться к каждому запросу с именем модели.

```sql
{% macro set_query_tag() -%}
  {% set new_query_tag = model.name %} 
  {% if new_query_tag %}
    {% set original_query_tag = get_current_query_tag() %}
    {{ log("Setting query_tag to '" ~ new_query_tag ~ "'. Will reset to '" ~ original_query_tag ~ "' after materialization.") }}
    {% do run_query("alter session set query_tag = '{}'".format(new_query_tag)) %}
    {{ return(original_query_tag)}}
  {% endif %}
  {{ return(none)}}
{% endmacro %}
```

**Примечание:** query tags задаются на уровне _сессии_. В начале каждой <Term id="materialization" />, если у модели настроен собственный `query_tag`, dbt выполняет `alter session set query_tag`, чтобы установить новое значение. В конце материализации dbt выполняет ещё один `alter`, чтобы вернуть значение по умолчанию. Поэтому сбои сборки в середине материализации могут привести к тому, что последующие запросы будут выполняться с некорректным тегом.

## Поведение merge (инкрементные модели) {#merge-behavior-incremental-models}

Конфигурация [`incremental_strategy`](/docs/build/incremental-strategy) управляет тем, как dbt строит инкрементные модели. По умолчанию dbt использует оператор [merge](https://docs.snowflake.net/manuals/sql-reference/sql/merge.html) в Snowflake для обновления инкрементных таблиц.

Snowflake поддерживает следующие инкрементные стратегии:
- [`merge`](/docs/build/incremental-strategy#merge) (по умолчанию)
- [`append`](/docs/build/incremental-strategy#append)
- [`delete+insert`](/docs/build/incremental-strategy#deleteinsert)
- [`insert_overwrite`](/docs/build/incremental-strategy#insert_overwrite)
- Примечание: Это не стандартная стратегия инкрементального обновления dbt. `insert_overwrite` работает как сочетание команд `truncate` и повторного `insert` в Snowflake. Она не поддерживает перезапись на уровне партиций, то есть намеренно перезаписывает всю таблицу. Она реализована как стратегия инкрементального обновления, поскольку соответствует рабочему процессу dbt, при котором существующие таблицы не удаляются. Вы можете использовать [`overwrite_columns`](#overwrite_columns), чтобы управлять тем, какие столбцы включаются в оператор `INSERT OVERWRITE`.
- [`microbatch`](/docs/build/incremental-microbatch)

Оператор `merge` в Snowflake завершается ошибкой «nondeterministic merge», если `unique_key`, указанный в конфигурации модели, на самом деле не является уникальным. В этом случае можно указать dbt использовать двухшаговый инкрементный подход, установив для модели `incremental_strategy` в `delete+insert`.

### `overwrite_columns`

При использовании `incremental_strategy='insert_overwrite'` в Snowflake можно задать `overwrite_columns`, чтобы управлять тем, как dbt формирует оператор `INSERT OVERWRITE` для вашей инкрементальной модели. Например:

<File name='models/my_model.sql'>

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='insert_overwrite',
    overwrite_columns=['id', 'value', 'event_date']
) }}

select id, value, event_date
from {{ ref('my_source') }}
```

</File>

- Если задать `overwrite_columns`, dbt генерирует SQL, в котором столбцы явно перечислены как в целевой части `INSERT`, так и в списке выбираемых столбцов `SELECT`:

  ```sql
  insert overwrite into my_schema.my_table (id, value, event_date)
  select id, value, event_date
  from staging_table
  ```

- Если не задать `overwrite_columns`, dbt в настоящее время по умолчанию использует `SELECT *`:

  ```sql
  insert overwrite into my_schema.my_table
  select *
  from staging_table
  ```

dbt поддерживает [кластеризацию таблиц](https://docs.snowflake.net/manuals/user-guide/tables-clustering-keys.html) в Snowflake. Для управления кластеризацией <Term id="table" /> или инкрементной модели используется конфигурация `cluster_by`. При её применении dbt выполняет два действия:

1. Неявно сортирует результаты таблицы по указанным полям `cluster_by`.
2. Добавляет указанные ключи кластеризации в целевую таблицу.

Используя поля `cluster_by` для сортировки таблицы, dbt минимизирует объём работы, необходимый для автоматической кластеризации Snowflake. Если инкрементная модель настроена с кластеризацией, dbt также сортирует промежуточный датасет перед merge в целевую таблицу. Таким образом, таблица, управляемая dbt, практически всегда остаётся в кластеризованном состоянии.

### Использование cluster_by {#using-cluster_by}

Конфигурация `cluster_by` принимает строку или список строк, используемых в качестве ключей кластеризации. В следующем примере создаётся таблица sessions, кластеризованная по колонке `session_start`.

<File name='models/events/sessions.sql'>

```sql
{{
  config(
    materialized='table',
    cluster_by=['session_start']
  )
}}

select
  session_id,
  min(event_time) as session_start,
  max(event_time) as session_end,
  count(*) as count_pageviews

from {{ source('snowplow', 'event') }}
group by 1
```

</File>

Этот код будет скомпилирован в SQL, который выглядит примерно так:

```sql
create or replace table my_database.my_schema.my_table as (

  select * from (
    select
      session_id,
      min(event_time) as session_start,
      max(event_time) as session_end,
      count(*) as count_pageviews

    from {{ source('snowplow', 'event') }}
    group by 1
  )

  -- этот order by добавляется dbt для создания
  -- таблицы уже в кластеризованном виде
  order by session_start

);

alter table my_database.my_schema.my_table cluster by (session_start);
```

### Кластеризация динамических таблиц {#dynamic-table-clustering}

Начиная с <Constant name="core"/> v1.11, динамические таблицы поддерживают конфигурацию `cluster_by`. При её указании dbt включает параметры кластеризации в оператор `CREATE DYNAMIC TABLE`.

Начиная с версии <Constant name="dbt"/> v1.11, динамические таблицы поддерживают конфигурацию `cluster_by`. Если она задана, dbt включает спецификацию кластеризации в оператор `CREATE DYNAMIC TABLE`.

Например:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='COMPUTE_WH',
    target_lag='1 minute',
    cluster_by=['session_start', 'user_id']
) }}

select
    session_id,
    user_id,
    min(event_time) as session_start,
    max(event_time) as session_end,
    count(*) as count_pageviews
from {{ source('snowplow', 'event') }}
group by 1, 2
```

Эта конфигурация сгенерирует следующий SQL при компиляции:

```sql
create or replace dynamic table my_database.my_schema.my_table
  target_lag = '1 minute'
  warehouse = COMPUTE_WH
  cluster by (session_start, user_id)
as (
  select
    session_id,
    user_id,
    min(event_time) as session_start,
    max(event_time) as session_end,
    count(*) as count_pageviews
  from source_table
  group by 1, 2
);
```

Кластеризацию для динамических таблиц можно указать при создании с помощью `CLUSTER BY` в операторе `CREATE DYNAMIC TABLE`. Выполнять отдельный `ALTER TABLE` не требуется.

### Автоматическая кластеризация {#automatic-clustering}

Автоматическая кластеризация [включена по умолчанию в Snowflake](https://docs.snowflake.com/en/user-guide/tables-auto-reclustering.html), и для её использования не требуется никаких дополнительных действий. Хотя существует конфигурация `automatic_clustering`, она не оказывает эффекта, за исключением аккаунтов с (устаревшей) ручной кластеризацией.

Если [в вашем аккаунте всё ещё включена ручная кластеризация](https://docs.snowflake.com/en/user-guide/tables-clustering-manual.html), можно использовать конфигурацию `automatic_clustering`, чтобы управлять автоматической кластеризацией для моделей dbt. Когда `automatic_clustering` установлена в `true`, dbt выполнит запрос `alter table <table name> resume recluster` после сборки целевой таблицы.

Конфигурацию `automatic_clustering` можно указать в файле `dbt_project.yml` или в блоке `config()` модели.

<File name='dbt_project.yml'>

```yaml
models:
  +automatic_clustering: true
```

</File>

## Конфигурация Python-моделей {#python-model-configuration}

Адаптер Snowflake поддерживает Python-модели. Snowflake использует собственный фреймворк Snowpark, который во многом похож на PySpark.

**Дополнительная настройка:** для использования пакетов Anaconda необходимо [принять условия Snowflake Third Party Terms](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages.html#getting-started).

**Установка пакетов:** Snowpark поддерживает ряд популярных пакетов через Anaconda. См. [полный список](https://repo.anaconda.com/pkgs/snowflake/) для подробностей. Пакеты устанавливаются во время выполнения модели. Разные модели могут иметь разные зависимости. При использовании сторонних пакетов Snowflake рекомендует использовать выделенный виртуальный warehouse для лучшей производительности.

**Версия Python:** чтобы указать другую версию Python, используйте следующую конфигурацию:

```python
def model(dbt, session):
    dbt.config(
        materialized = "table",
        python_version="3.11"
    )
```

Конфигурация `python_version` позволяет запускать Snowpark-модели с версиями Python [3.9, 3.10 или 3.11](https://docs.snowflake.com/en/developer-guide/snowpark/python/setup).

**External access integrations и secrets:** для запросов к внешним API внутри Python-моделей dbt используйте Snowflake [external access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview) вместе с [secrets](https://docs.snowflake.com/en/developer-guide/external-network-access/secret-api-reference). Ниже приведён пример дополнительных конфигураций:

```python
import pandas
import snowflake.snowpark as snowpark

def model(dbt, session: snowpark.Session):
    dbt.config(
        materialized="table",
        secrets={"secret_variable_name": "test_secret"},
        external_access_integrations=["test_external_access_integration"],
    )
    import _snowflake
    return session.create_dataframe(
        pandas.DataFrame(
            [{"secret_value": _snowflake.get_generic_secret_string('secret_variable_name')}]
        )
    )
```

**Документация:** ["Developer Guide: Snowpark Python"](https://docs.snowflake.com/en/developer-guide/snowpark/python/index.html)

### Дополнительные параметры {#additional-parameters}

Модели Python в Snowflake принимают эти параметры в `dbt.config()`. Подробнее см. в разделе [Настройка моделей Python](/docs/build/python-models#configuring-python-models).

<SnowflakePythonParams />

### Сторонние пакеты Snowflake {#third-party-snowflake-packages}

Чтобы использовать сторонний пакет Snowflake, отсутствующий в Snowflake Anaconda, загрузите его, следуя [этому примеру](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages#importing-packages-through-a-snowflake-stage), а затем настройте параметр `imports` в Python-модели dbt, указав zip-файл в Snowflake staging.

Ниже приведён полный пример конфигурации с использованием zip-файла и параметра `imports`:

```python
def model(dbt, session):
    # Configure the model
    dbt.config(
        materialized="table",
        imports=["@mystage/mycustompackage.zip"],  # Specify the external package location
    )
    
    # Example data transformation using the imported package
    # (Assuming `some_external_package` has a function we can call)
    data = {
        "name": ["Alice", "Bob", "Charlie"],
        "score": [85, 90, 88]
    }
    df = pd.DataFrame(data)

    # Process data with the external package
    df["adjusted_score"] = df["score"].apply(lambda x: some_external_package.adjust_score(x))
    
    # Return the DataFrame as the model output
    return df
```

Подробнее см. в [документации Snowflake](https://community.snowflake.com/s/article/how-to-use-other-python-packages-in-snowpark) о загрузке и использовании сторонних Python-пакетов в Snowpark, не опубликованных в канале Anaconda.

## Настройка виртуальных warehouse {#configuring-virtual-warehouses}

Хранилище, которое dbt использует по умолчанию, можно настроить в [профиле](/docs/local/profiles.yml) для подключений к Snowflake. Чтобы переопределить хранилище для определённых моделей (или групп моделей), используйте конфигурацию модели `snowflake_warehouse`. Эта конфигурация позволяет указать более мощное хранилище для отдельных моделей, чтобы управлять затратами на Snowflake и временем сборки проекта.

[Тесты](/docs/build/data-tests) также поддерживают конфигурацию `snowflake_warehouse`. Это полезно, если вы хотите запускать тесты в виртуальном хранилище Snowflake, отличном от того, которое используется для сборки моделей. Например, можно использовать менее мощное хранилище для простых тестов данных, а модели выполнять в более мощном хранилище.

<Tabs
  defaultValue="dbt_project.yml"
  values={[
    { label: 'Project file', value: 'dbt_project.yml', },
    { label: 'Property file', value: 'models/my_model.yml', },
    { label: 'SQL file config', value: 'models/events/sessions.sql', },
    ]}
>

<TabItem value="dbt_project.yml">

Ниже приведён пример изменения warehouse для группы моделей с помощью аргумента конфигурации в YAML.

<File name='dbt_project.yml'>

```yaml
name: my_project
version: 1.0.0

...

models:
  +snowflake_warehouse: "EXTRA_SMALL"    # default Snowflake virtual warehouse for all models in the project.
  my_project:
    clickstream:
      +snowflake_warehouse: "EXTRA_LARGE"    # override the default Snowflake virtual warehouse for all models under the `clickstream` directory.
snapshots:
  +snowflake_warehouse: "EXTRA_LARGE"    # all Snapshot models are configured to use the `EXTRA_LARGE` warehouse.
data_tests:
  +snowflake_warehouse: "EXTRA_SMALL"    # all data tests are configured to use the `EXTRA_SMALL` warehouse.
```

</File>
</TabItem>

<TabItem value="models/my_model.yml">

В следующем примере переопределяется warehouse Snowflake для одной модели и конкретного теста с помощью аргумента config в файле свойств.

<File name='models/my_model.yml'>

```yaml
models:
  - name: my_model
    config:
      snowflake_warehouse: "EXTRA_LARGE"    # override the Snowflake virtual warehouse just for this model
    columns:
      - name: id
        data_tests:
          - unique:
              config:
                snowflake_warehouse: "EXTRA_SMALL"    # use a smaller warehouse for this test
```

</File>
</TabItem>

<TabItem value="models/events/sessions.sql">

В следующем примере warehouse переопределяется для одной модели с помощью блока `config()` в SQL-модели.

<File name='models/events/sessions.sql'>

```sql
# override the Snowflake virtual warehouse for just this model
{{
  config(
    materialized='table',
    snowflake_warehouse='EXTRA_LARGE'
  )
}}

with

aggregated_page_events as (

    select
        session_id,
        min(event_time) as session_start,
        max(event_time) as session_end,
        count(*) as count_page_views
    from {{ source('snowplow', 'event') }}
    group by 1

),

index_sessions as (

    select
        *,
        row_number() over (
            partition by session_id
            order by session_start
        ) as page_view_in_session_index
    from aggregated_page_events

)

select * from index_sessions
```

</File>
</TabItem>
</Tabs>

## Копирование прав (Copying grants) {#copying-grants}

Когда вы задаёте `copy_grants: true` в dbt, это указывает Snowflake сохранять существующие привилегии при пересоздании таблицы, <Term id="view">представления</Term> или [динамической таблицы](#copy-grants-dynamic-tables), добавляя `COPY GRANTS` в SQL-код. Для динамических таблиц требуется `dbt-snowflake` версии 1.11 или новее. Значение по умолчанию — `false`.

<File name='dbt_project.yml'>

```yaml
models:
  +copy_grants: true
```

</File>

При выполнении `CREATE OR REPLACE` в Snowflake конструкция `COPY GRANTS` сохраняет существующие права на таблицу, представление или динамическую таблицу, кроме права владения. Владельцем остаётся роль, выполняющая пересоздание.

<VersionBlock firstVersion="1.13">

Если `copy_grants` равен `false` или не задан, dbt добавляет `IGNORE GRANTS` для таблиц, представлений и клонов. При пересоздании существующие права сбрасываются, поэтому функция [копирования прав при CREATE OR REPLACE](https://docs.snowflake.com/en/release-notes/bcr-bundles/2026_08/bcr-2433) не оставляет старых разрешений. Затем dbt применяет настройки [`grants`](/reference/resource-configs/grants) как обычно.

Этот вариант с `IGNORE GRANTS` не применяется к [динамическим таблицам](#copy-grants-dynamic-tables).

</VersionBlock>

<VersionBlock lastVersion="1.12">

При `copy_grants: false` dbt выполняет обычный `CREATE OR REPLACE` для таблиц и представлений. Если в аккаунте включено [копирование прав при CREATE OR REPLACE](https://docs.snowflake.com/en/release-notes/bcr-bundles/2026_08/bcr-2433), Snowflake сохраняет существующие права даже при `copy_grants: false`. dbt добавляет настроенные разрешения и не удаляет остальные.

Чтобы в этих версиях dbt управлял полным списком прав после пересоздания, задайте `copy_grants: true` и явно перечислите разрешения. Если `grants` отсутствует или равен `{}`, старые разрешения сохраняются. Начиная с `dbt-snowflake` v1.13, при `copy_grants: false` для таблиц, представлений и клонов используется `IGNORE GRANTS`.

</VersionBlock>

<VersionBlock firstVersion="1.10">

## Настройка row access policies {#setting-row-access-policies}

Настройка [row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro) для таблиц, представлений и динамических таблиц выполняется с помощью конфигурации `row_access_policy`. Политика должна уже существовать в Snowflake до применения к модели.

<File name='models/<modelname>.sql'>

```sql
{{ config(
    row_access_policy = 'my_database.my_schema.my_row_access_policy_name on (id)'
) }}

select ...
```

</File>

## Настройка table tags {#configuring-table-tags}

Для добавления тегов к таблицам, представлениям и динамическим таблицам используйте конфигурацию `table_tag`. Обратите внимание: тег должен уже существовать в Snowflake до применения.

<File name='models/<modelname>.sql'>

```sql
{{ config(
    table_tag = "my_tag_name = 'my_tag_value'"
) }}

select ...
```

</File>

</VersionBlock>

## Secure views {#secure-views}

Чтобы создать [secure view](https://docs.snowflake.net/manuals/user-guide/views-secure.html) в Snowflake, используйте конфигурацию `secure` для моделей с материализацией view. Secure views применяются для ограничения доступа к чувствительным данным. Примечание: secure views могут снижать производительность, поэтому используйте их только при необходимости.

Следующий пример настраивает модели в папке `sensitive/` как secure views.

<File name='dbt_project.yml'>

```yaml
name: my_project
version: 1.0.0

models:
  my_project:
    sensitive:
      +materialized: view
      +secure: true
```

</File>

## Известное ограничение source freshness {#source-freshness-known-limitation}

Snowflake рассчитывает source freshness на основе значения колонки `LAST_ALTERED`, то есть использует поле, обновляемое при любых изменениях объекта, а не только при обновлении данных. Никаких действий предпринимать не нужно, однако аналитическим командам следует учитывать этот нюанс.

Согласно [документации Snowflake](https://docs.snowflake.com/en/sql-reference/info-schema/tables#usage-notes):

  >Колонка `LAST_ALTERED` обновляется при выполнении следующих операций над объектом:
  >- DDL-операции.
  >- DML-операции (только для таблиц).
  >- Фоновые операции обслуживания метаданных, выполняемые Snowflake.

<VersionBlock firstVersion="1.9">

## Пагинация результатов объектов {#pagination-for-object-results}

По умолчанию, если dbt обнаруживает схему с количеством объектов до 100 000, результаты `show objects` разбиваются на страницы по 10 000 объектов, максимум до 10 страниц.

В окружениях с более чем 100 000 объектов в схеме можно настроить количество результатов на страницу и лимит страниц с помощью следующих [флагов](/reference/global-configs/about-global-configs) в `dbt_project.yml`:

- `list_relations_per_page` &mdash; количество объектов на странице (максимум 10 000 — это ограничение Snowflake).
- `list_relations_page_limit` &mdash; максимальное количество страниц.

Например, чтобы получать по 10 000 объектов на страницу и включать до 100 страниц (1 000 000 объектов), настройте флаги следующим образом:

```yml
flags:
  list_relations_per_page: 10000
  list_relations_page_limit: 100
```

</VersionBlock>
