---
title: pre-hook и post-hook
description: "Pre-hook и Post-hook - Прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
resource_types: [models, seeds, snapshots]
datatype: sql-statement | [sql-statement]
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

<Snippet path="post-and-pre-hooks-sql-statement" /> 

<File name='dbt_project.yml'>

```yml

models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +pre-hook: SQL-statement | [SQL-statement]
    +post-hook: SQL-statement | [SQL-statement]

```

</File>

<File name='models/<model_name>.sql'>

```sql

{{ config(
    pre_hook="SQL-statement" | ["SQL-statement"],
    post_hook="SQL-statement" | ["SQL-statement"],
) }}

select ...

```

</File>

<File name='models/properties.yml'>

```yml
models:
  - name: [<model_name>]
    config:
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
```

</File>

</TabItem>

<TabItem value="seeds">

<Snippet path="post-and-pre-hooks-sql-statement" /> 

<File name='dbt_project.yml'>

```yml

seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +pre-hook: SQL-statement | [SQL-statement]
    +post-hook: SQL-statement | [SQL-statement]

```

</File>

<File name='seeds/properties.yml'>

```yml
seeds:
  - name: [<seed_name>]
    config:
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
```

</File>

</TabItem>

<TabItem value="snapshots">

<Snippet path="post-and-pre-hooks-sql-statement" /> 

<File name='dbt_project.yml'>

```yml

snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +pre-hook: SQL-statement | [SQL-statement]
    +post-hook: SQL-statement | [SQL-statement]

```

</File>

<VersionBlock lastVersion="1.8">

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot snapshot_name %}
{{ config(
    pre_hook="SQL-statement" | ["SQL-statement"],
    post_hook="SQL-statement" | ["SQL-statement"],
) }}

select ...

{% end_snapshot %}

```

</File>
</VersionBlock>

<File name='snapshots/snapshot.yml'>

```yml
snapshots:
  - name: [<snapshot_name>]
    [config](/reference/resource-properties/config):
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
```

</File>

</TabItem>

</Tabs>

## Определение
SQL-оператор (или список SQL-операторов), который будет выполнен до или после создания модели, сида или снимка.

Pre- и post-hooks также могут вызывать макросы, которые возвращают SQL-операторы. Если ваш макрос зависит от значений, доступных только во время выполнения, таких как использование конфигураций модели или вызовов `ref()` к другим ресурсам в качестве входных данных, вам нужно будет [обернуть вызов вашего макроса в дополнительный набор фигурных скобок](/best-practices/dont-nest-your-curlies#an-exception).

### Зачем мне использовать хуки?

dbt стремится предоставить весь необходимый шаблонный SQL (DDL, DML и DCL) через функциональность "из коробки", которую вы можете быстро и лаконично настроить. В некоторых случаях может быть SQL, который вы хотите или должны выполнить, специфичный для функциональности вашей платформы данных, который dbt не предлагает (пока) в качестве встроенной функции. В таких случаях вы можете написать необходимый SQL, используя контекст компиляции dbt, и передать его в `pre-` или `post-` хук для выполнения до или после вашей модели, сида или снимка.

import SQLCompilationError from '/snippets/_render-method.md';

<SQLCompilationError />

## Примеры

### [Redshift] Выгрузка одной модели в S3

<File name='model.sql'>

```sql
{{ config(
  post_hook = "unload ('select from {{ this }}') to 's3:/bucket_name/{{ this }}"
) }}

select ...
```

</File>

Смотрите: [документация Redshift по `UNLOAD`](https://docs.aws.amazon.com/redshift/latest/dg/r_UNLOAD.html)

### [Apache Spark] Анализ таблиц после создания

<File name='dbt_project.yml'>

```yml

models:
  jaffle_shop: # это имя проекта
    marts:
      finance:
        +post-hook:
          # это может быть список
          - "analyze table {{ this }} compute statistics for all columns"
          # или вызвать макрос вместо этого
          - "{{ analyze_table() }}"
```

Смотрите: [документация Apache Spark по `ANALYZE TABLE`](https://spark.apache.org/docs/latest/sql-ref-syntax-aux-analyze-table.html)

</File>

### Дополнительные примеры
Мы собрали еще несколько более подробных примеров [здесь](/docs/build/hooks-operations#additional-examples).

## Примечания по использованию
### Хуки являются кумулятивными
Если вы определяете хуки как в вашем `dbt_project.yml`, так и в блоке `config` модели, оба набора хуков будут применены к вашей модели.

### Порядок выполнения
Если определено несколько экземпляров любых хуков, dbt будет выполнять каждый хук в следующем порядке:
1. Хуки из зависимых пакетов будут выполнены перед хуками в активном пакете.
2. Хуки, определенные внутри самой модели, будут выполнены после хуков, определенных в `dbt_project.yml`.
3. Хуки в данном контексте будут выполнены в порядке их определения.

### Поведение транзакций
Если вы используете адаптер, который использует транзакции (в частности, Postgres или Redshift), стоит отметить, что по умолчанию хуки выполняются внутри той же транзакции, что и создаваемая модель.

Могут быть случаи, когда вам нужно выполнить эти хуки _вне_ транзакции, например:
* Вы хотите выполнить `VACUUM` в `post-hook`, однако это не может быть выполнено в рамках транзакции ([документация Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_VACUUM_command.html#r_VACUUM_usage_notes))
* Вы хотите вставить запись в таблицу аудита <Term id="table" /> в начале выполнения и не хотите, чтобы это выражение было отменено, если создание модели завершится неудачно.

Чтобы достичь этого поведения, вы можете использовать один из следующих синтаксисов:
  - Важное примечание: Не используйте этот синтаксис, если вы используете базу данных, в которой dbt не поддерживает транзакции. Это включает базы данных, такие как Snowflake, BigQuery и Spark или Databricks.

<Tabs>
<TabItem value="beforebegin" label="Используйте before_begin и after_commit">

#### Блок конфигурации: используйте вспомогательные макросы `before_begin` и `after_commit`

<File name='models/<modelname>.sql'>

```sql
{{
  config(
    pre_hook=before_begin("SQL-statement"),
    post_hook=after_commit("SQL-statement")
  )
}}

select ...

```

</File>
</TabItem>

<TabItem value="dictionary" label="Используйте словарь">

#### Блок конфигурации: используйте словарь
<File name='models/<modelname>.sql'>

```sql
{{
  config(
    pre_hook={
      "sql": "SQL-statement",
      "transaction": False
    },
    post_hook={
      "sql": "SQL-statement",
      "transaction": False
    }
  )
}}

select ...

```

</File>

</TabItem>

<TabItem value="dbt_project.yml" label="Используйте dbt_project.yml">

#### `dbt_project.yml`: используйте словарь

<File name='dbt_project.yml'>

```yml

models:
  +pre-hook:
    sql: "SQL-statement"
    transaction: false
  +post-hook:
    sql: "SQL-statement"
    transaction: false

```

</File>
</TabItem>
</Tabs>