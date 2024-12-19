<File name='models/<filename>.yml'>

```yaml

version: 2

sources:
  - name: <source_name>
    freshness:
      warn_after:
        [count](#count): <positive_integer>
        [period](#period): minute | hour | day
      error_after:
        [count](#count): <positive_integer>
        [period](#period): minute | hour | day
      [filter](#filter): <boolean_sql_expression>
    [loaded_at_field](#loaded_at_field): <column_name_or_expression>

    tables:
      - name: <table_name>
        freshness:
          warn_after:
            [count](#count): <positive_integer>
            [period](#period): minute | hour | day
          error_after:
            [count](#count): <positive_integer>
            [period](#period): minute | hour | day
          [filter](#filter): <boolean_sql_expression>
        [loaded_at_field](#loaded_at_field): <column_name_or_expression>
        ...
```

</File>

## Определение
Блок свежести используется для определения допустимого времени между самой последней записью и текущим моментом, чтобы <Term id="table" /> считалась "свежей".

В блоке `freshness` можно указать один или оба параметра `warn_after` и `error_after`. Если ни один из них не указан, dbt не будет рассчитывать снимки свежести для таблиц в этом источнике.

В большинстве случаев требуется указать `loaded_at_field`. Некоторые адаптеры поддерживают расчет свежести источника на основе метаданных таблиц хранилища и могут исключить `loaded_at_field`.

Если у источника есть блок `freshness:`, dbt попытается рассчитать свежесть для этого источника:
- Если указан `loaded_at_field`, dbt будет рассчитывать свежесть с помощью запроса select (поведение до версии v1.7).
- Если `loaded_at_field` _не_ указан, dbt будет рассчитывать свежесть с помощью метаданных таблиц хранилища, когда это возможно (новое в v1.7 для поддерживаемых адаптеров).

В настоящее время расчет свежести на основе метаданных таблиц хранилища поддерживается для следующих адаптеров:
- [Snowflake](/reference/resource-configs/snowflake-configs)
- [Redshift](/reference/resource-configs/redshift-configs)
- [BigQuery](/reference/resource-configs/bigquery-configs) (Поддерживается в версии [`dbt-bigquery`](https://github.com/dbt-labs/dbt-bigquery) 1.7.3 или выше)

Поддержка скоро появится для адаптера [Spark](/reference/resource-configs/spark-configs).

Блоки свежести применяются иерархически:
- свойства `freshness` и `loaded_at_field`, добавленные к источнику, будут применены ко всем таблицам, определенным в этом источнике.
- свойства `freshness` и `loaded_at_field`, добавленные к таблице источника, переопределят любые свойства, примененные к источнику.

Это полезно, когда все таблицы в источнике имеют одно и то же значение `loaded_at_field`, что часто бывает.

Чтобы исключить источник из расчетов свежести, у вас есть два варианта:
- Не добавлять блок `freshness:`.
- Явно установить `freshness: null`.

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

version: 2

sources:
  - name: jaffle_shop
    database: raw

    freshness: # стандартная свежесть
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}

    loaded_at_field: _etl_loaded_at

    tables:
      - name: customers # это будет использовать свежесть, определенную выше

      - name: orders
        freshness: # сделаем это немного более строгим
          warn_after: {count: 6, period: hour}
          error_after: {count: 12, period: hour}
          # Примените условие where в запросе свежести
          filter: datediff('day', _etl_loaded_at, current_timestamp) < 2

      - name: product_skus
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