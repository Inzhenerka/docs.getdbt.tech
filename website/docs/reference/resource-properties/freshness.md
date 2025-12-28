<Tabs>
<TabItem value="yml" label="Project file">

<File name="dbt_project.yml">
  
```yaml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-properties/freshness):
      warn_after:  
        count: <positive_integer>
        period: minute | hour | day
```
  
</File>
</TabItem>
<TabItem value="project" label="Model YAML">
<File name='models/<filename>.yml'>

```yaml


sources:
  - name: <source_name>
    config:
      freshness: # changed to config in v1.9
        warn_after:
          [count](#count): <positive_integer>
          [period](#period): minute | hour | day
        error_after:
          [count](#count): <positive_integer>
          [period](#period): minute | hour | day
        [filter](#filter): <boolean_sql_expression>
      # changed to config in v1.10
      [loaded_at_field](#loaded_at_field): <column_name_or_expression>
      # or use loaded_at_query in v1.10 or higher. Should not be used if loaded_at_field is defined
      [loaded_at_query](#loaded_at_query): <sql_expression>

    tables:
      - name: <table_name>
        config:
          # source.table.config.freshness overrides source.config.freshness
          freshness: 
            warn_after:
              [count](#count): <positive_integer>
              [period](#period): minute | hour | day
            error_after:
              [count](#count): <positive_integer>
              [period](#period): minute | hour | day
            [filter](#filter): <boolean_sql_expression>
          # changed to config in v1.10
          [loaded_at_field](#loaded_at_field): <column_name_or_expression>
          # or use loaded_at_query in v1.10 or higher. Should not be used if loaded_at_field is defined
          [loaded_at_query](#loaded_at_query): <sql_expression>

        ...
```
</File>
</TabItem>
</Tabs>

## Определение
Блок свежести используется для определения допустимого времени между самой последней записью и текущим моментом, чтобы <Term id="table" /> считалась "свежей".

В блоке `freshness` можно указать один или оба параметра `warn_after` и `error_after`. Если ни один из них не указан, dbt не будет рассчитывать снимки свежести для таблиц в этом источнике.

В большинстве случаев параметр `loaded_at_field` является обязательным. Некоторые адаптеры поддерживают вычисление свежести источника на основе таблиц метаданных хранилища данных и могут обходиться без `loaded_at_field`. <VersionBlock firstVersion="1.10">В качестве альтернативы вы можете определить `loaded_at_query`, чтобы использовать пользовательское SQL-выражение для расчёта временной метки.</VersionBlock>

Если у источника определён блок `freshness:`, dbt попытается вычислить свежесть для этого источника:
- Если указан `loaded_at_field`, dbt вычислит свежесть с помощью select-запроса.
- Если `loaded_at_field` _не_ указан, dbt будет вычислять свежесть через таблицы метаданных хранилища данных, когда это возможно.
<VersionBlock firstVersion="1.10"> 
- Если указан `loaded_at_query`, dbt вычислит свежесть с помощью предоставленного пользовательского SQL-запроса.
- Если указан `loaded_at_query`, параметр `loaded_at_field` не должен быть настроен.
</VersionBlock>

В настоящее время расчет свежести на основе метаданных таблиц хранилища поддерживается для следующих адаптеров:
- [Snowflake](/reference/resource-configs/snowflake-configs)
- [Redshift](/reference/resource-configs/redshift-configs)
- [BigQuery](/reference/resource-configs/bigquery-configs) (поддерживается в версии [`dbt-bigquery`](https://github.com/dbt-labs/dbt-bigquery) 1.7.3 или выше)
- [Databricks](/reference/resource-configs/databricks-configs) (поддерживается в <Constant name="fusion_engine" />)

Блоки freshness применяются иерархически:
- Свойства `freshness` и `loaded_at_field`, добавленные к источнику (source), будут применяться ко всем таблицам, определённым в этом источнике.
- Свойства `freshness` и `loaded_at_field`, добавленные к _таблице_ источника (source table), переопределяют любые свойства, заданные на уровне источника.

Это полезно, когда все таблицы в источнике имеют одно и то же значение `loaded_at_field`, что часто бывает.

Чтобы исключить источник из расчётов свежести, явно укажите `freshness: null`.

В state-aware orchestration dbt по умолчанию использует метаданные хранилища данных, чтобы проверять, являются ли источники (или вышестоящие модели в случае Mesh) свежими. Подробнее о том, как свежесть используется в state-aware orchestration, см. раздел [Advanced configurations](/docs/deploy/state-aware-setup#advanced-configurations).

## loaded_at_field

Необязателен для адаптеров, которые поддерживают получение свежести из метаданных таблиц хранилища, в противном случае требуется.
<br/><br/>Имя столбца (или выражение), которое возвращает временную метку, указывающую на свежесть.

Если используется поле даты, возможно, вам придется привести его к типу timestamp:
```yml
loaded_at_field: "completed_date::timestamp"
```

Или, в зависимости от вашего варианта SQL:
```yml
loaded_at_field: "CAST(completed_date AS TIMESTAMP)"
```

Если используется временная метка, не относящаяся к UTC, сначала приведите ее к UTC:

```yml
loaded_at_field: "convert_timezone('Australia/Sydney', 'UTC', created_at_local)"
```

<VersionBlock firstVersion="1.10">

## loaded_at_query

Укажите пользовательский SQL для генерации временной метки `maxLoadedAt` на источнике (а не через метаданные хранилища или конфигурацию `loaded_at_field`). Обратите внимание, что `loaded_at_query` не следует использовать, если определён `loaded_at_field`.

Examples: 

```yaml

sources:
  - name: your_source
    config:
      freshness: # changed to config in v1.9
        error_after:
          count: 2
          period: hour
      loaded_at_query: |
        select max(_sdc_batched_at) from (
        select * from {{ this }}
        where _sdc_batched_at > dateadd(day, -7, current_date)
        qualify count(*) over (partition by _sdc_batched_at::date) > 2000
        )

```

```yaml

sources: 
  - name: ecom
    schema: raw
    description: E-commerce data for the Jaffle Shop
    config: 
      freshness: 
        warn_after:
          count: 24
          period: hour
    tables:
      - name: raw_orders
        description: One record per order
        config:
          loaded_at_query: "select {{ current_timestamp() }}"
...

```

Не следует настраивать, если также настроен `loaded_at_field`, но если это сделано, dbt будет использовать то значение, которое ближе всего к таблице.

[Filter](#filter) не будет работать для `loaded_at_query`.

</VersionBlock>

## count
(Обязательный)

Положительное целое число, указывающее количество периодов, в течение которых источник данных все еще считается "свежим".

## period
(Обязательный)

Период времени, используемый в расчете свежести. Один из `minute`, `hour` или `day`.

## filter
(необязательный)

Добавьте условие where к запросу, выполняемому `dbt source freshness`, чтобы ограничить объем обрабатываемых данных.

Этот фильтр *применяется только* к запросам свежести источника dbt - он не повлияет на другие использования таблицы источника.

Это особенно полезно, если:
- Вы используете BigQuery, и ваши таблицы источников являются [разделенными таблицами](https://cloud.google.com/bigquery/docs/partitioned-tables).
- Вы используете Snowflake, Databricks или Spark с большими таблицами, и это приводит к улучшению производительности.

## Примеры

### Полный пример
<File name='models/<filename>.yml'>

```yaml


sources:
  - name: jaffle_shop
    database: raw
    config: 
      # changed to config in v1.9
      freshness: # default freshness
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}

      loaded_at_field: _etl_loaded_at

    tables:
      - name: customers # это будет использовать свежесть, определенную выше

      - name: orders
        config:
          freshness: # сделаем требования немного строже
            warn_after: {count: 6, period: hour}
            error_after: {count: 12, period: hour}
            # Применить условие where в запросе для проверки свежести данных

      - name: product_skus
        config:
          freshness: # не проверять свежесть для этой таблицы
```

</File>

При выполнении `dbt source freshness` будет выполнен следующий запрос:

<Tabs
  defaultValue="compiled"
  values={[
    { label: 'Скомпилированный SQL', value: 'compiled', },
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

_[Исходный код](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L262)_

</TabItem>

</Tabs>
