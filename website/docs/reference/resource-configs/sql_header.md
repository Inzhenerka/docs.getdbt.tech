---
resource_types: [models]
description: "Sql_header - Прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: "string"
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Модели', value: 'models', },
    { label: 'Сиды', value: 'seeds', },
    { label: 'Снимки', value: 'snapshots', },
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

Эта конфигурация не реализована для сидов.

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot [snapshot_name](snapshot_name) %}

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
Необязательная конфигурация для внедрения SQL перед операциями `create table as` и `create view as`, которые dbt выполняет при создании моделей и снимков.

`sql_header` можно установить с помощью конфигурации или вызвав макрос `set_sql_header` (пример ниже).

## Сравнение с предшествующими хуками
[Предшествующие хуки](/reference/resource-configs/pre-hook-post-hook) также предоставляют возможность выполнить SQL перед созданием модели, как _предшествующий_ запрос. В отличие от этого, SQL в `sql_header` выполняется в том же _запросе_, что и оператор `create table|view as`.

В результате это делает его более полезным для [параметров сессии Snowflake](https://docs.snowflake.com/en/sql-reference/parameters.html) и [временных UDF BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/user-defined-functions#sql-udf-examples).

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

### Создание временной UDF BigQuery

Этот пример вызывает макрос `set_sql_header`. Этот макрос является удобной оберткой, которую вы можете использовать, если у вас есть многострочное SQL выражение для внедрения. В этом случае вам не нужно использовать ключ конфигурации `sql_header`.

<File name='models/my_model.sql'>

```sql
-- Укажите SQL заголовок:
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