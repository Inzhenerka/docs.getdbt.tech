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
  ]}
>
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

</Tabs>


## Определение
Необязательная конфигурация для вставки SQL выше операторов `create table as` и `create view as`, которые dbt выполняет при построении моделей и снимков.

`sql_header` можно задать с помощью конфигурации или вызовом макроса `set_sql_header` (пример ниже).

## Сравнение с pre-hooks
[Pre-hooks](/reference/resource-configs/pre-hook-post-hook) также предоставляют возможность выполнить SQL перед созданием модели, как _предшествующий_ запрос. В сравнении, SQL в `sql_header` выполняется в том же _запросе_, что и оператор `create table|view as`.

В результате это делает его более полезным для [параметров сессии Snowflake](https://docs.snowflake.com/en/sql-reference/parameters.html) и [временных UDF в BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/user-defined-functions#sql-udf-examples).

## Примеры

### Установка параметров сессии Snowflake для конкретной модели
Это использует синтаксис блока конфигурации:
<File name='models/my_model.sql'>

```sql
{{ config(
  sql_header="alter session set timezone = 'Australia/Sydney';"
) }}

select * from {{ ref('other_model') }}
```

</File>

### Установка параметров сессии Snowflake для всех моделей

<File name='dbt_project.yml'>

```yml
config-version: 2

models:
  +sql_header: "alter session set timezone = 'Australia/Sydney';"
```

</File>

### Создание временной UDF в BigQuery

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
