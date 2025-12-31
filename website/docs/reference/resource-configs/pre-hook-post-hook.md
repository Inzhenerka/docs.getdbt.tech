---
title: pre-hook & post-hook
description: "Настройте хуки для выполнения SQL до (pre) и после (post) выполнения модели в dbt."
resource_types: [models, seeds, snapshots]
datatype: sql-statement | [sql-statement]
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
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

## Определение {#definition}
SQL-выражение (или список SQL-выражений), которое выполняется до или после построения модели, seed или snapshot.

Pre- и post-хуки также могут вызывать макросы, которые возвращают SQL-выражения. Если ваш макрос зависит от значений, доступных только во время выполнения, таких как использование конфигураций модели или вызовы `ref()` к другим ресурсам в качестве входных данных, вам нужно будет [обернуть вызов макроса в дополнительный набор фигурных скобок](/best-practices/dont-nest-your-curlies#an-exception).

### Зачем использовать хуки? {#why-would-i-use-hooks}

dbt стремится предоставить весь необходимый шаблонный SQL (DDL, DML и DCL) через встроенные функции, которые можно быстро и лаконично настроить. В некоторых случаях может быть SQL, который вы хотите или должны выполнить, специфичный для функциональности вашей платформы данных, который dbt пока не предлагает как встроенную функцию. В таких случаях вы можете написать точный SQL, который вам нужен, используя контекст компиляции dbt, и передать его в `pre-` или `post-` хук для выполнения до или после вашей модели, seed или snapshot.

import SQLCompilationError from '/snippets/_render-method.md';

<SQLCompilationError />

## Примеры {#examples}

### [Redshift] Выгрузка одной модели в S3 {#redshift-unload-one-model-to-s3}

<File name='model.sql'>

```sql
{{ config(
  post_hook = "unload ('select from {{ this }}') to 's3:/bucket_name/{{ this }}"
) }}

select ...
```

</File>

См.: [Документация Redshift по `UNLOAD`](https://docs.aws.amazon.com/redshift/latest/dg/r_UNLOAD.html)

### [Apache Spark] Анализ таблиц после создания {#apache-spark-analyze-tables-after-creation}

<File name='dbt_project.yml'>

```yml

models:
  jaffle_shop: # это имя проекта
    marts:
      finance:
        +post-hook:
          # это может быть список
          - "analyze table {{ this }} compute statistics for all columns"
          # или вызов макроса
          - "{{ analyze_table() }}"
```

См.: [Документация Apache Spark по `ANALYZE TABLE`](https://spark.apache.org/docs/latest/sql-ref-syntax-aux-analyze-table.html)

</File>

### Дополнительные примеры {#additional-examples}
Мы собрали более подробные примеры [здесь](/docs/build/hooks-operations#additional-examples).

## Примечания по использованию {#usage-notes}
### Хуки являются кумулятивными {#hooks-are-cumulative}
Если вы определяете хуки как в вашем `dbt_project.yml`, так и в блоке `config` модели, оба набора хуков будут применены к вашей модели.

### Порядок выполнения {#execution-ordering}
Если определено несколько экземпляров любых хуков, dbt выполнит каждый хук в следующем порядке:
1. Хуки из зависимых пакетов будут выполнены перед хуками в активном пакете.
2. Хуки, определенные в самой модели, будут выполнены после хуков, определенных в `dbt_project.yml`.
3. Хуки в данном контексте будут выполнены в порядке их определения.

### Поведение транзакций {#transaction-behavior}
Если вы используете адаптер, который использует транзакции (например, Postgres или Redshift), стоит отметить, что по умолчанию хуки выполняются внутри той же транзакции, что и создаваемая модель.

Могут быть случаи, когда вам нужно выполнить эти хуки _вне_ транзакции, например:
* Вы хотите выполнить `VACUUM` в `post-hook`, однако это не может быть выполнено в транзакции ([Документация Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_VACUUM_command.html#r_VACUUM_usage_notes))
* Вы хотите вставить запись в аудиторскую <Term id="table" /> в начале выполнения и не хотите, чтобы это выражение было отменено, если создание модели не удастся.

Чтобы достичь этого поведения, вы можете использовать один из следующих синтаксисов:
  - Важное замечание: не используйте этот синтаксис, если вы используете базу данных, где dbt не поддерживает транзакции. Это включает базы данных, такие как Snowflake, BigQuery и Spark или Databricks.

<Tabs>
<TabItem value="beforebegin" label="Используйте before_begin и after_commit">

#### Блок конфигурации: используйте вспомогательные макросы `before_begin` и `after_commit` {#config-block-use-the-beforebegin-and-aftercommit-helper-macros}

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

#### Блок конфигурации: используйте словарь {#config-block-use-a-dictionary}
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

#### `dbt_project.yml`: Используйте словарь {#dbt_projectyml-use-a-dictionary}

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