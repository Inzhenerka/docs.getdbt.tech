---
title: freshness
description: "Прочитайте это руководство, чтобы понять конфигурацию `freshness` в dbt."
id: "freshness"
availability:
  access: free
---
import SaoDeprecated from '/snippets/_sao-deprecated.md';
import SourceFreshnessLegacy from '/snippets/_source-freshness-legacy.md';

# freshness

Используйте конфигурацию `freshness`, чтобы указать, насколько свежими должны быть данные вашего [источника](#source-freshness) или [модели](#model-freshness).

<VersionBlock firstVersion="2.0">

Выполните [`dbt freshness`](/reference/commands/freshness), чтобы проверить все источники и модели, для которых настроена проверка свежести данных.

<SourceFreshnessLegacy />

</VersionBlock>

<VersionBlock lastVersion="1.99">

Выполните [`dbt source freshness`](/reference/commands/source), чтобы проверить ваши источники. Настройка свежести данных моделей доступна только в dbt v2. Дополнительные сведения см. в разделе [Свежесть данных источников](#source-freshness).

</VersionBlock>

## Конфигурация

Используйте следующие поля для настройки свежести данных источников и моделей, если не указано иное:

<SimpleTable>
| Поле | Описание |
|---|---|
| `warn_after` | Максимально допустимый возраст самых свежих данных, при превышении которого проверка свежести выдает предупреждение. Требует указания и `count`, и `period`. |
| `error_after` | Максимально допустимый возраст самых свежих данных, при превышении которого проверка свежести выдает ошибку. Формат такой же, как у `warn_after`. |
| `loaded_at_field` | Столбец, к которому dbt обращается, чтобы определить временную метку последней загрузки. Обязателен, если метаданные адаптера недоступны. |
| `loaded_at_query` | SQL-выражение, возвращающее временную метку последней загрузки. Альтернатива `loaded_at_field`. Одновременное указание `loaded_at_query` и `loaded_at_field` для одного ресурса вызывает ошибку разбора. Доступно в dbt v1.10 и более поздних версиях. |
| `filter` | Добавляет условие `WHERE` в запрос проверки свежести, чтобы ограничить объем сканируемых данных. Полезно для секционированных таблиц BigQuery или больших таблиц в Snowflake, Databricks или Spark. Не влияет на другие способы использования источника или модели. Не применяется к `loaded_at_query`. |
</SimpleTable>

Можно указать один из параметров `warn_after` и `error_after` или оба. Если ни один из них не задан, dbt не будет проверять свежесть данных этого ресурса. Для каждого из параметров `warn_after` и `error_after` необходимо указать и `count`, и `period`; указание только одного из них приводит к предупреждению при разборе, но вызывает ошибку при выполнении `dbt freshness`.

## Свежесть данных источников {#source-freshness}

<Tabs>
<TabItem value="project" label="Файл проекта">

<File name="dbt_project.yml">

```yaml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-configs/freshness):
warn_after:
        count: <positive_integer>
        period: minute | hour | day
```

</File>
</TabItem>

<TabItem value="property" label="Property file">

<File name='models/<filename>.yml'>

```yaml
sources:
  - name: <source_name>
    config:
      freshness: # changed to config in v1.9
        warn_after:
          count: <positive_integer>
          period: minute | hour | day
        error_after:
          count: <positive_integer>
          period: minute | hour | day
        filter: <boolean_sql_expression>
      # changed to config in v1.10
      loaded_at_field: <column_name_or_expression>
      # or use loaded_at_query in v1.10 or higher
      loaded_at_query: <sql_expression>

    tables:
      - name: <table_name>
        config:
          # source.table.config.freshness overrides source.config.freshness
          freshness:
            warn_after:
              count: <positive_integer>
              period: minute | hour | day
            error_after:
              count: <positive_integer>
              period: minute | hour | day
            filter: <boolean_sql_expression>
          loaded_at_field: <column_name_or_expression>
          loaded_at_query: <sql_expression>
```

</File>
</TabItem>
</Tabs>

Freshness blocks are applied hierarchically:
- A `freshness` and `loaded_at_field` set on a source apply to all tables in that source.
- A `freshness` and `loaded_at_field` set on a source _table_ override the source-level values.

To exclude a source from freshness calculations, explicitly set `freshness: null`.

If a source has a `freshness:` block, dbt will attempt to calculate freshness for that source:
- If `loaded_at_field` is provided, dbt calculates freshness via a select query.
- If `loaded_at_field` is _not_ provided, dbt calculates freshness via warehouse metadata tables when possible.

<VersionBlock lastVersion="1.99">

Currently, calculating freshness from warehouse metadata tables is supported on the following adapters:
- [Snowflake](/reference/resource-configs/snowflake-configs)
- [Redshift](/reference/resource-configs/redshift-configs)
- [BigQuery](/reference/resource-configs/bigquery-configs) (requires [`dbt-bigquery`](https://github.com/dbt-labs/dbt-bigquery) version 1.7.3 or higher)
- [Databricks](/reference/resource-configs/databricks-configs)

</VersionBlock>

<VersionBlock firstVersion="1.12">
:::note Wildcard table identifiers
On BigQuery, metadata-based freshness checks are not reliable for sources defined with wildcard table identifiers (for example, `events_*`).

To prevent incorrect freshness results, enable the [`bigquery_reject_wildcard_metadata_source_freshness`](/reference/global-configs/bigquery-changes#%D1%84%D0%BB%D0%B0%D0%B3-bigquery_reject_wildcard_metadata_source_freshness) flag in your `dbt_project.yml`. When enabled, dbt raises an error if metadata-based freshness is used with a wildcard table identifier.

To calculate freshness for wildcard tables, configure `loaded_at_field` to use query-based freshness checks instead.
:::
</VersionBlock>

### Examples

#### Using `loaded_at_field`

```yml
sources:
  - name: jaffle_shop
    config:
      # Cast a date field to timestamp
      loaded_at_field: "completed_date::timestamp"

    tables:
      - name: orders
        config:
          # Cast a non-UTC timestamp to UTC
          loaded_at_field: "convert_timezone('Australia/Sydney', 'UTC', created_at_local)"
          freshness:
            warn_after: {count: 12, period: hour}
```

#### Using `loaded_at_query`

<VersionBlock firstVersion="1.10">

```yaml
sources:
  - name: jaffle_shop
    tables:
      - name: orders
        loaded_at_query: |
          select max(_sdc_batched_at) from (
            select * from {{ this }}
            where _sdc_batched_at > dateadd(day, -7, current_date)
            qualify count(*) over (partition by _sdc_batched_at::date) > 2000
          )
        config:
          freshness:
            warn_after: {count: 12, period: hour}
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

`loaded_at_query` is available in dbt v1.10 and later. 

</VersionBlock>


#### Complete example

<File name='models/<filename>.yml'>

```yaml
sources:
  - name: jaffle_shop
    database: raw
    config:
      freshness: # default freshness for all tables
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}
      loaded_at_field: _etl_loaded_at

    tables:
      - name: customers # uses the freshness defined above

      - name: orders
        config:
          freshness: # more strict for orders
            warn_after: {count: 6, period: hour}
            error_after: {count: 12, period: hour}
            filter: datediff('day', _etl_loaded_at, current_timestamp) < 2

      - name: product_skus
        config:
          freshness: null # do not check freshness for this table
```

</File>

<VersionBlock firstVersion="2.0">

When running [`dbt freshness`](/reference/commands/freshness), the following query will be run against the `orders` table:

</VersionBlock>

<VersionBlock lastVersion="1.99">

When running [`dbt source freshness`](/reference/commands/source), the following query will be run against the `orders` table:

</VersionBlock>

<Tabs
  defaultValue="compiled"
  values={[
    { label: 'Compiled SQL', value: 'compiled', },
    { label: 'Jinja SQL', value: 'jinja', },
  ]
}>
<TabItem value="compiled">

```sql
select
  max(_etl_loaded_at) as max_loaded_at,
  convert_timezone('UTC', current_timestamp()) as snapshotted_at
from raw.jaffle_shop.orders
where datediff('day', _etl_loaded_at, current_timestamp) < 2
```

</TabItem>

<TabItem value="jinja">

```sql
select
  max({{ loaded_at_field }}) as max_loaded_at,
  {{ current_timestamp() }} as snapshotted_at
from {{ source }}
{% if filter %}
where {{ filter }}
{% endif %}
```

_[Source code](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/src/dbt/include/global_project/macros/adapters/freshness.sql#L5-L16)_

</TabItem>
</Tabs>

<VersionBlock firstVersion="2.0">

## Model freshness

Use the `freshness` config on a model to:

- **Set a freshness threshold**: Set `warn_after` and `error_after` thresholds to declare how stale a model's data can get, then run `dbt freshness` to check each model against its thresholds and report a warning or an error.
- **Schedule builds (`build_after`)**: Control how often a model rebuilds when new upstream data is available. Available on dbt platform Enterprise tiers only. `build_after` is part of state-aware orchestration, which has been deprecated and is now [dbt State](/docs/deploy/dbt-state-about).

<Tabs>
<TabItem value="project" label="Project file">

<File name="dbt_project.yml">

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)loaded_at_field: <column_name>    # or loaded_at_query
    [+](/reference/resource-configs/plus-prefix)loaded_at_query: <sql_expression> # alternative to loaded_at_field
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-configs/freshness):
      warn_after: {count: <positive_integer>, period: minute | hour | day}
      error_after: {count: <positive_integer>, period: minute | hour | day}
```

</File>
</TabItem>

<TabItem value="property" label="Property file">

<File name="models/<filename>.yml">

```yml
models:
  - name: stg_orders
    config:
      loaded_at_field: updated_at    # or loaded_at_query
      freshness:
warn_after: {count: 24, period: hour}
        error_after: {count: 48, period: hour}
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">
<File name="models/<filename>.sql">

```sql
{{
    config(
      loaded_at_field="updated_at",
      freshness={
"warn_after": {"count": 24, "period": "hour"},
        "error_after": {"count": 48, "period": "hour"}
      }
    )
}}
```

</File>
</TabItem>
</Tabs>

Not all materializations support freshness checks the same way. dbt validates your config at parse time and raises an error for invalid combinations.

<SimpleTable>
| Материализация | `loaded_at_field` / `loaded_at_query` | Поведение |
|---|---|---|
| `table`, `incremental`, `materialized_view`, `dynamic_table` | Необязательно | Если не задано, dbt использует метаданные адаптера (например, время последнего изменения таблицы). |
| `view`, `external` | Обязательно | Представления не предоставляют метаданные на уровне строк. Задайте `loaded_at_field` или `loaded_at_query` для оценки свежести данных. Пустая строка (`loaded_at_field: ""`) считается отсутствующим значением и вызывает ошибку разбора. |
| `ephemeral` | Не поддерживается | Ничего не материализуется, поэтому оценить свежесть данных невозможно. Вызывает ошибку разбора. |
</SimpleTable>

An incomplete freshness rule (for example, `warn_after` with `count` but no `period`) issues a warning at parse time for all materializations; `dbt run` and `dbt build` warn but still succeed. Only `dbt freshness` treats it as an error. Separately, `view` and `external` models require l`oaded_at_field` or `loaded_at_query` &mdash; omitting both is a parse error that fails `dbt run`, `dbt build`, and `dbt freshness`, regardless of whether the freshness rule is complete.

### Проверка свежести данных между проектами

Для публичных моделей в [dbt Mesh](/docs/mesh/about-mesh) dbt сохраняет конфигурацию свежести данных, чтобы зависимые проекты могли проверять свежесть данных вышестоящих моделей без запуска вышестоящего проекта.

Например, `project_a` содержит публичную модель `orders` с настроенной проверкой свежести данных:

```yaml
# project_a: models/orders.yml
models:
  - name: orders
    access: public
    config:
      loaded_at_field: updated_at
      freshness:
        warn_after: {count: 24, period: hour}
        error_after: {count: 48, period: hour}
```

`project_b` зависит от `orders`. Чтобы проверить свежесть данных в `orders`, выполните `dbt freshness` из `project_b` &mdash; повторно запускать `project_a` не нужно:

```bash
# run from project_b
dbt freshness --select project_a.orders
```

### Примеры

#### Использование только `warn_after`

```yaml
models:
  - name: stg_orders
    config:
      materialized: table
      freshness:
        warn_after: {count: 24, period: hour}
```

#### Использование `loaded_at_query`

```yaml
models:
  - name: stg_events
    config:
      materialized: table
      freshness:
        warn_after: {count: 6, period: hour}
        error_after: {count: 12, period: hour}
      loaded_at_query: "select max(_loaded_at) from {{ this }} where _batch_complete = true"
```

### Планирование сборок {#scheduling-builds}

<SaoDeprecated />

<Tabs>
<TabItem value="project" label="Файл проекта">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-configs/freshness):
      [build_after](#scheduling-builds): # Available only on dbt platform Enterprise tiers
        count: <positive_integer>
        period: minute | hour | day
        updates_on: any | all # optional, default is `any`
```

</File>
</TabItem>

<TabItem value="property" label="Файл свойств">

<File name="models/<filename>.yml">

```yml
models:
  - name: stg_orders
    config:
      freshness:
        [build_after](#scheduling-builds):  # Available only on dbt platform Enterprise tiers
          count: <positive_integer>
          period: minute | hour | day
          updates_on: any | all # optional, default is `any`
```

</File>
</TabItem>

<TabItem value="sql" label="Конфигурация в SQL-файле">
<File name="models/<filename>.sql">

```sql
{{
    config(
      freshness={
        "build_after": {
          "count": <positive_integer>,
          "period": "minute" | "hour" | "day",
          "updates_on": "any" | "all"
        }
      }
    )
}}
```

</File>
</TabItem>
</Tabs>

Параметр конфигурации `build_after` применяется к оркестрации с учётом состояния (SAO), которая теперь считается устаревшей. `build_after` выполняет повторную сборку моделей _только при наличии новых данных в источниках или вышестоящих моделях_. Это полезно для моделей, которые зависят от других моделей, но требуют лишь периодического обновления.

`freshness` работает совместно с оркестрацией джобов dbt и помогает определить, когда модели действительно нужно пересобирать в рамках запланированного запуска. При каждом запуске джоба dbt гарантирует, что модели выполняются только при необходимости, что позволяет избежать избыточных сборок. Для этого dbt:

- Проверяет, появились ли новые данные для модели
- Убеждается, что с момента последней сборки прошло достаточно времени, на основе параметров `count` и `period`

Для источников и апстрим-моделей (в случае mesh) dbt определяет «новизну» данных на основе пользовательских вычислений freshness (если они настроены). Если freshness источника превышает заданный порог warning или error, dbt выдает предупреждение или ошибку во время сборки.

Конфигурация состоит из следующих частей:

| Конфигурация | Описание |
|--------------|-------------|
| `build_after` | Доступно только на тарифах Enterprise платформы dbt. Конфигурация, вложенная в `freshness`. Определяет, следует ли пересобирать модель при наличии новых данных, исходя из того, прошло ли с момента последней сборки модели время, заданное параметрами count и period. Хотя dbt проверяет наличие новых данных при каждом запуске задания, `build_after` гарантирует, что модель будет пересобрана только в том случае, если прошло достаточно времени и появились новые данные. |
| `count` и `period` | Указывают, как часто dbt должен проверять наличие новых данных. Например, `count: 4, period: hour` означает, что dbt будет выполнять проверку каждые 4 часа. При настройке `build_after` обязательны оба параметра: `count` и `period`. |
| `updates_on` | Необязательный параметр. Значение по умолчанию — `any`. Определяет, когда изменения в вышестоящих данных должны запускать сборку в рамках задания. Используйте следующие значения:<br /> - `any` (по умолчанию): модель будет собрана, как только с момента последней сборки появятся новые данные в _любом_ непосредственно вышестоящем узле. Быстрее, но может увеличить расходы.<br /> - `all`: модель будет собрана только тогда, когда с момента последней сборки появятся новые данные во _всех_ непосредственно вышестоящих узлах. Меньше расходов, но больше условий для запуска сборки. |

Если вы используете [dbt State](/docs/deploy/dbt-state-about), настройки `build_after` перенесены из блока `freshness` в блок `state`:

| Оркестрация с учётом состояния | dbt State |
|---|---|
| `freshness.build_after.count` + `freshness.build_after.period` | [`state.lag_tolerance`](/reference/resource-configs/lag-tolerance) |
| `freshness.build_after.updates_on` | [`state.require_fresh_data_from`](/reference/resource-configs/require-fresh-data-from) |

Дополнительную информацию см. в разделе [Миграция с оркестрации с учётом состояния](/docs/deploy/dbt-state-migration).

#### Значение по умолчанию

Значение по умолчанию для ключа `build_after`:

```yaml
build_after:
  count: 0
  period: minute
  updates_on: any
```

Значение по умолчанию для `updates_on` — `any`. Это означает, что по умолчанию модель будет строиться при каждом запуске задания по расписанию при наличии любого объёма новых данных.

#### Примеры

Ниже приведены примеры настройки моделей для более редкого, более частого или пользовательского расписания сборки.

##### Реже

Вы можете настроить модель так, чтобы она запускалась реже (что снижает затраты): сборка будет выполняться не чаще одного раза за заданный интервал времени и только при наличии новых данных.

```yaml
models:
  - name: stg_wizards
    config:
      freshness:
        build_after:
          count: 4
          period: hour
          updates_on: all
  - name: stg_worlds
    config:
      freshness:
        build_after:
          count: 4
          period: hour
          updates_on: all
```

Когда срабатывает state-aware orchestration job, dbt проверяет два условия:

- Появились ли новые исходные данные во всех апстрим-моделях
- Были ли модели `stg_wizards` и `stg_worlds` собраны более 4 часов назад

Когда выполняются _оба_ условия, dbt собирает модель. В этом случае используется настройка `updates_on: all`. Если источник `raw.wizards` получил новые данные, но `stg_wizards` и `stg_worlds` были собраны 3 часа назад, сборка не произойдет.

##### Более частые запуски

Если вы хотите запускать модель чаще, можно настроить её так, чтобы она строилась, как только в _любой_ из её зависимостей появляются новые данные, не дожидаясь обновления всех зависимостей.

```yaml
models:
  - name: stg_wizards
    config:
      freshness:
        build_after:
          count: 1
          period: hour
          updates_on: any
  - name: stg_worlds
    config:
      freshness:
        build_after:
          count: 1
          period: hour
          updates_on: any
```

При запуске state-aware orchestration job dbt проверяет:

- Если новые исходные данные доступны хотя бы для одной вышестоящей модели.
- Если `stg_wizards` или `stg_worlds` не была построена за последний час.

Если выполнены _оба_ условия, dbt перестраивает модель. Если ни у одной из моделей нет новых данных, ничего построено не будет.

В этом примере, поскольку задано `updates_on: any`, даже если новые данные есть только в источнике `raw.wizards` и за последний час была построена только модель `stg_wizards` (а `stg_worlds` не обновлялась), dbt всё равно построит модель, поскольку для этого достаточно одного обновлённого источника и одной подходящей (устаревшей) модели.

##### Настраиваемая периодичность

Вы также можете использовать собственную логику с `build_after`, чтобы задать разную периодичность для разных дней или пропускать построения в определённый период (например, в выходные).

<Tabs>
<TabItem value="yml" label="Project file">

<File name="dbt_project.yml">

```yaml
+freshness:
  build_after:
    # если сегодня суббота или воскресенье, ждать минимум 48 часов перед следующей сборкой
    # в противном случае — ждать минимум 1 час
    count: "{{ 48 if modules.datetime.datetime.today().weekday() in (5, 6) else 1 }}"
    period: hour
    updates_on: any
```
</File>
</TabItem>

<TabItem value="sql" label="SQL file config">
<File name="models/<filename>.sql">

```sql
{{
    config(
      freshness={
        "build_after": {
          "count": 48 if modules.datetime.datetime.today().weekday() in (5, 6) else 1,
          "period": "hour",
          "updates_on": "any"
        }
      }
    )
}}
```

</File>
</TabItem>
</Tabs>
</VersionBlock>
