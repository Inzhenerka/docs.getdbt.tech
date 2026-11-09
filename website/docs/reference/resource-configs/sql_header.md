---
resource_types: [models]
description: "Sql_header - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: "string"
---

:::info `sql_header` не поддерживает Jinja или макросы вроде `ref` и `source`

В отличие от [pre-хуков и post-хуков](/reference/resource-configs/pre-hook-post-hook), макросы вроде [`ref`](/reference/dbt-jinja-functions/ref), [`source`](/reference/dbt-jinja-functions/source) и ссылки вроде [`{{ this }}`](/reference/dbt-jinja-functions/this) не поддерживаются.

Основная функция `set_sql_header` довольно ограничена. Она предназначена для:
- [Создания UDF](/reference/resource-configs/sql_header#create-a-bigquery-temporary-udf)
- [Установки переменных скрипта](https://cloud.google.com/bigquery/docs/reference/standard-sql/procedural-language) (BigQuery)
- [Установки временных параметров сеанса](/reference/resource-configs/sql_header#set-snowflake-session-parameters-for-a-particular-model) (Snowflake)

:::

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
{ label: 'Файл свойств', value: 'property-yaml', },
  ]
}>
<TabItem value="models">

<File name='models/<modelname>.sql'>

```sql
{{ config(
  sql_header="<sql-statement>"
) }}

select ...


```

</File>

<File name='dbt_project.yml'>

```yml
[config-version](/reference/project-configs/config-version): 2

models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +sql_header: <sql-statement>

```

</File>

</TabItem>


<TabItem value="seeds">

Эта конфигурация не реализована для seeds

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot [snapshot_name](/reference/resource-configs/snapshot_name) %}

{{ config(
  sql_header="<sql-statement>"
) }}

select ...

{% endsnapshot %}

```

</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +sql_header: <sql-statement>

```

</File>

</TabItem>

<TabItem value="property-yaml">

Setting `sql_header` in the `config` of a [generic data test](/docs/build/data-tests) is available starting in <Constant name="dbt" /> v1.12. Enable the [`require_sql_header_in_test_configs`](/reference/global-configs/behavior-flags/require_sql_header_in_test_configs) flag to use `sql_header` in `properties.yml` for generic data tests.


Here's an example of a model-level configuration:

<File name="models/properties.yml">

```yaml
models:
  - name: orders
    data_tests:
      - unique:
          name: unique_orders_order_id
          arguments:
            column_name: order_id
          config:
            sql_header: "-- SQL_HEADER_TEST_MARKER"
```
</File>

You can also use `sql_header` for column-level data tests:

<File name="models/properties.yml">

```yaml
models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - not_null:
              name: not_null_orders_order_id
              config:
                sql_header: "-- SQL_HEADER_TEST_MARKER"
```

</File>

</TabItem>

</Tabs>


## Определение {#definition}
Необязательная конфигурация для вставки SQL выше операторов `create table as` и `create view as`, которые dbt выполняет при построении моделей и снимков.

`sql_header` можно задать с помощью конфигурации или вызовом макроса `set_sql_header` (пример ниже).

<VersionBlock firstVersion="1.12">

Вы также можете задать `sql_header` в `config` [универсального теста данных](/docs/build/data-tests) на уровне модели или столбца в файле `properties.yml`. Используйте `sql_header`, чтобы определить SQL, который должен выполняться перед запуском теста (например, для создания временных функций, настройки параметров сеанса или объявления переменных, необходимых для запроса теста). dbt выполняет этот SQL перед выполнением теста.

Включите флаг [`require_sql_header_in_test_configs`](/reference/global-configs/behavior-flags/require_sql_header_in_test_configs), чтобы использовать `sql_header` для тестов данных. Дополнительную информацию см. в разделе [Конфигурации тестов данных](/reference/data-test-configs).

</VersionBlock>

## Сравнение с pre-hooks
[Pre-hooks](/reference/resource-configs/pre-hook-post-hook) также позволяют выполнять SQL перед созданием модели в виде _предшествующего_ запроса. В отличие от них, SQL в `sql_header` выполняется в том же _запросе_, что и инструкция `create table|view as`.

В результате это делает его более полезным для [параметров сессии Snowflake](https://docs.snowflake.com/en/sql-reference/parameters.html) и [временных UDF в BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/user-defined-functions#sql-udf-examples).

## Примеры {#examples}

### Установка параметров сессии Snowflake для конкретной модели {#set-snowflake-session-parameters-for-a-particular-model}
Это использует синтаксис блока конфигурации:
<File name='models/my_model.sql'>

```sql
{{ config(
  sql_header="alter session set timezone = 'Australia/Sydney';"
) }}

select * from {{ ref('other_model') }}
```

</File>

### Установка параметров сессии Snowflake для всех моделей {#set-snowflake-session-parameters-for-all-models}

<File name='dbt_project.yml'>

```yml
config-version: 2

models:
  +sql_header: "alter session set timezone = 'Australia/Sydney';"
```

</File>

### Создание временной UDF в BigQuery {#create-a-bigquery-temporary-udf}

Этот пример вызывает макрос `set_sql_header`. Этот макрос является удобной оберткой, которую вы можете использовать, если у вас есть многострочное SQL-выражение для вставки. В этом случае вам не нужно использовать ключ конфигурации `sql_header`.

<File name='models/my_model.sql'>

```sql
-- Укажите SQL-заголовок:
{% call set_sql_header(config) %}
  CREATE TEMPORARY FUNCTION yes_no_to_boolean(answer STRING)
  RETURNS BOOLEAN AS (
    CASE
    WHEN LOWER(answer) = 'yes' THEN True
    WHEN LOWER(answer) = 'no' THEN False
    ELSE NULL
    END
  );
{%- endcall %}

-- Укажите код вашей модели:


select yes_no_to_boolean(yes_no) from {{ ref('other_model') }}
```

</File>


