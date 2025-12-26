---
title: "Конфигурации Databricks"
id: "databricks-configs"
tags: ['Databricks', 'dbt Fusion', 'dbt Core']
---

## Конфигурация таблиц

При материализации модели как `table`, вы можете включить несколько дополнительных конфигураций, специфичных для плагина dbt-databricks, в дополнение к стандартным [конфигурациям моделей](/reference/model-configs).

dbt-databricks v1.9 adds support for the `table_format: iceberg` config. Try it now on the [<Constant name="cloud" /> "Latest" release track](/docs/dbt-versions/cloud-release-tracks). All other table configurations were also supported in 1.8.

| Option    | Description| Required?     | Model support   | Example      |
|-------------|--------|-----------|-----------------|---------------|
| table_format   | Нужно ли включать совместимость с [Iceberg](https://docs.databricks.com/en/delta/uniform.html) для данной materialization | Optional     | SQL, Python     | `iceberg`    |
| file_format <sup>†</sup>        | Формат файлов, который будет использоваться при создании таблиц (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` или `libsvm`).   | Optional     | SQL, Python     | `delta`     |
| location_root       | Создаваемая таблица использует указанный каталог для хранения данных. К этому пути будет добавлен алиас таблицы.     | Optional  | SQL, Python     | `/mnt/root`  |
| partition_by        | Разбивает создаваемую таблицу на партиции по указанным колонкам. Для каждой партиции создаётся отдельный каталог. | Optional   | SQL, Python     | `date_day`  |
| liquid_clustered_by<sup>^</sup>  | Кластеризует создаваемую таблицу по указанным колонкам. Метод кластеризации основан на функциональности [Liquid Clustering в Delta](https://docs.databricks.com/en/delta/clustering.html). Доступно начиная с dbt-databricks 1.6.2. | Optional          | SQL, Python     | `date_day` |
| auto_liquid_cluster\+ | Создаваемая таблица [автоматически кластеризуется Databricks](https://docs.databricks.com/aws/en/delta/clustering#automatic-liquid-clustering). Доступно начиная с dbt-databricks 1.10.0 | Optional | SQL, Python | `auto_liquid_cluster: true` |
| clustered_by        | Каждая партиция в создаваемой таблице будет разбита на фиксированное количество бакетов по указанным колонкам.      | Optional     | SQL, Python     | `country_code`           |
| buckets    | Количество бакетов, создаваемых при кластеризации   | Required if `clustered_by` is specified   | SQL, Python     | `8`        |
| tblproperties   | [Tblproperties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html), которые будут установлены для создаваемой таблицы   | Optional     | SQL, Python*    | `{'this.is.my.key': 12}` |
| databricks_tags     | [Теги](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html), которые будут заданы для создаваемой таблицы     | Optional    | SQL <sup>‡</sup> , Python <sup>‡</sup> | `{'my_tag': 'my_value'}` |
| compression   | Устанавливает алгоритм сжатия.   | Optional    | SQL, Python     | `zstd`    |

\* В настоящее время в PySpark нет API для задания tblproperties при создании таблицы, поэтому эта возможность в первую очередь предназначена для того, чтобы пользователи могли аннотировать таблицы, созданные из Python, с помощью tblproperties.

† When `table_format` is `iceberg`, `file_format` must be `delta`.

‡ `databricks_tags` are applied via `ALTER` statements. Tags cannot be removed via dbt-databricks once applied. To remove tags, use Databricks directly or a post-hook.

<sup>^</sup> When `liquid_clustered_by` is enabled, dbt-databricks issues an `OPTIMIZE` (Liquid Clustering) operation after each run. To disable this behavior, set the variable `DATABRICKS_SKIP_OPTIMIZE=true`, which can be passed into the dbt run command (`dbt run --vars "{'databricks_skip_optimize': true}"`) or set as an environment variable. See [issue #802](https://github.com/databricks/dbt-databricks/issues/802).

\+ Do not use `liquid_clustered_by` and `auto_liquid_cluster` on the same model.

In dbt-databricks v1.10, there are several new model configurations options gated behind the `use_materialization_v2` flag.
For details, see the [documentation of Databricks behavior flags](/reference/global-configs/databricks-changes).

### Python submission methods
_Доступно в версиях 1.9 и выше_

В dbt-databricks v1.9 (попробуйте уже сейчас в [треке релизов <Constant name="cloud" /> «Latest»](/docs/dbt-versions/cloud-release-tracks)) вы можете использовать следующие четыре варианта для `submission_method`:

* `all_purpose_cluster`: Выполняет модель Python либо напрямую с использованием [command api](https://docs.databricks.com/api/workspace/commandexecution), либо загружая блокнот и создавая одноразовый запуск задания
* `job_cluster`: Создает новый кластер заданий для выполнения загруженного блокнота как одноразового запуска задания
* `serverless_cluster`: Использует [безсерверный кластер](https://docs.databricks.com/en/jobs/run-serverless-jobs.html) для выполнения загруженного блокнота как одноразового запуска задания
* `workflow_job`: Создает/обновляет повторно используемый рабочий процесс и загруженный блокнот для выполнения на кластерах общего назначения, задания или безсерверных кластерах.
   :::caution 
   Этот подход дает вам максимальную гибкость, но создаст постоянные артефакты в Databricks (рабочий процесс), которые пользователи могут запускать вне dbt.
   :::

В настоящее время мы находимся в переходном периоде, когда существует разрыв между старыми методами отправки (которые были сгруппированы по вычислениям) и логически различными методами отправки (команда, запуск задания, рабочий процесс).

Таким образом, поддерживаемая матрица конфигурации несколько сложна:

| Конфигурация          | Использование                                                              | По умолчанию        | `all_purpose_cluster`* | `job_cluster` | `serverless_cluster` | `workflow_job` |
| --------------------- | -------------------------------------------------------------------------- | ------------------ | ---------------------- | ------------- | -------------------- | -------------- |
| `create_notebook`     | если false, используйте Command API, иначе загрузите блокнот и используйте запуск задания | `false`            | ✅                     | ❌             | ❌                   | ❌             |
| `timeout`             | максимальное время ожидания выполнения команды/задания                    | `0` (Без таймаута) | ✅                     | ✅             | ✅                   | ✅             |
| `job_cluster_config`  | настраивает [новый кластер](https://docs.databricks.com/api/workspace/jobs/submit#tasks-new_cluster) для выполнения модели | `{}` | ❌ | ✅ | ❌            | ✅             |
| `access_control_list` | напрямую настраивает [контроль доступа](https://docs.databricks.com/api/workspace/jobs/submit#access_control_list) для задания | `{}` | ✅ | ✅ | ✅          | ✅             |
| `packages`            | список пакетов для установки на выполняющем кластере                       | `[]`               | ✅                     | ✅             | ✅                   | ✅             |
| `index_url`           | URL для установки `packages`                                               | `None` (использует pypi) | ✅                     | ✅             | ✅                   | ✅             |
| `additional_libs`     | напрямую настраивает [библиотеки](https://docs.databricks.com/api/workspace/jobs/submit#tasks-libraries) | `[]` | ✅ | ✅             | ✅                   | ✅             |
| `python_job_config`   | дополнительная конфигурация для заданий/рабочих процессов (см. таблицу ниже) | `{}`               | ✅                     | ✅             | ✅                   | ✅             |
| `cluster_id`          | идентификатор существующего кластера общего назначения для выполнения      | `None`             | ✅                     | ❌             | ❌                   | ✅             |
| `http_path`           | путь к существующему кластеру общего назначения для выполнения             | `None`             | ✅                     | ❌             | ❌                   | ❌             |

\* Только `timeout` и `cluster_id`/`http_path` поддерживаются, когда `create_notebook` равно false

С введением метода отправки `workflow_job`, мы выбрали дальнейшую сегрегацию конфигурации отправки модели Python под верхнеуровневую конфигурацию, названную `python_job_config`. Это позволяет конфигурационным опциям для заданий и рабочих процессов быть пространственно именованными таким образом, чтобы они не мешали другим конфигурациям модели, что позволяет нам быть гораздо более гибкими в том, что поддерживается для выполнения заданий.

Матрица поддержки для этой функции разделена на `workflow_job` и все остальные (предполагая `all_purpose_cluster` с `create_notebook`==true).
Каждая опция конфигурации, указанная ниже, должна быть вложена под `python_job_config`:

| Конфигурация                 | Использование                                                                                                                     | По умолчанию | `workflow_job` | Все остальные |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------- | ---------- |
| `name`                       | Имя, которое будет присвоено (или использовано для поиска) созданному рабочему процессу                                          | `None`  | ✅             | ❌          |
| `grants`                     | Упрощенный способ указать контроль доступа для рабочего процесса                                                                 | `{}`    | ✅             | ✅          |
| `existing_job_id`            | Идентификатор для использования при поиске созданного рабочего процесса (вместо `name`)                                          | `None`  | ✅             | ❌          |
| `post_hook_tasks`            | [Задачи](https://docs.databricks.com/api/workspace/jobs/create#tasks), которые будут включены после выполнения блокнота модели  | `[]`    | ✅             | ❌          |
| `additional_task_settings`   | Дополнительная [конфигурация задачи](https://docs.databricks.com/api/workspace/jobs/create#tasks), которая будет включена в задачу модели | `{}`    | ✅             | ❌          |
| [Другие настройки запуска задания](https://docs.databricks.com/api/workspace/jobs/submit) | Конфигурация будет скопирована в запрос, вне задачи модели  | `None`  | ❌             | ✅          |
| [Другие настройки рабочего процесса](https://docs.databricks.com/api/workspace/jobs/create) | Конфигурация будет скопирована в запрос, вне задачи модели | `None`  | ✅             | ❌          |

Этот пример использует новые опции конфигурации из предыдущей таблицы:

<File name='schema.yml'>

```yaml
models:
  - name: my_model
    config:
      submission_method: workflow_job

      # Определите кластер заданий для создания для выполнения этого рабочего процесса
      # В качестве альтернативы можно указать cluster_id для использования существующего кластера или не указывать ни одного, чтобы использовать безсерверный кластер
      job_cluster_config:
        spark_version: "15.3.x-scala2.12"
        node_type_id: "rd-fleet.2xlarge"
        runtime_engine: "{{ var('job_cluster_defaults.runtime_engine') }}"
        data_security_mode: "{{ var('job_cluster_defaults.data_security_mode') }}"
        autoscale: { "min_workers": 1, "max_workers": 4 }

      python_job_config:
        # Эти настройки передаются, как есть, в запрос
        email_notifications: { on_failure: ["me@example.com"] }
        max_retries: 2

        name: my_workflow_name

        # Переопределите настройки для задачи dbt вашей модели. Например, вы можете
        # изменить ключ задачи
        additional_task_settings: { "task_key": "my_dbt_task" }

        # Определите задачи для выполнения до/после модели
        # Этот пример предполагает, что вы уже загрузили блокнот в /my_notebook_path для выполнения оптимизации и очистки
        post_hook_tasks:
          [
            {
              "depends_on": [{ "task_key": "my_dbt_task" }],
              "task_key": "OPTIMIZE_AND_VACUUM",
              "notebook_task":
                { "notebook_path": "/my_notebook_path", "source": "WORKSPACE" },
            },
          ]

        # Упрощенная структура, вместо необходимости указывать разрешения отдельно для каждого пользователя
        grants:
          view: [{ "group_name": "marketing-team" }]
          run: [{ "user_name": "other_user@example.com" }]
          manage: []
```

</File>


## Настройка колонок
_Доступно в версиях 1.10 и выше_

При материализации моделей различных типов вы можете указывать несколько необязательных конфигураций на уровне колонок, которые специфичны для плагина dbt-databricks, в дополнение к стандартным [настройкам колонок](/reference/resource-properties/columns). Поддержка тегов колонок и масок колонок была добавлена в dbt-databricks версии 1.10.4.

| Option    | Description   | Required?| Model support | Materialization support | Example  |
|-----------|---------------|----------|---------------|----------------------------|----------|
| databricks_tags     | [Tags](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) to be set on individual columns    | Optional    |  SQL†, Python† | Table, Incremental, Materialized View, Streaming Table  | `{'data_classification': 'pii'}`  |
| column_mask   | [Column mask](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-column-mask) configuration for dynamic data masking. Accepts `function` and optional `using_columns` properties*  | Optional     | SQL, Python   | Table, Incremental, Streaming Table | `{'function': 'my_catalog.my_schema.mask_email'}`   |

\* `using_columns` supports all parameter types listed in [Databricks column mask parameters](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-column-mask#parameters).


† `databricks_tags` are applied via `ALTER` statements. Tags cannot be removed via dbt-databricks once applied. To remove tags, use Databricks directly or a post-hook.

This example uses the column-level configurations in the previous table:

<File name='schema.yml'>

```yaml
models:
  - name: customers
    columns:
      - name: customer_id
        databricks_tags:
          data_classification: "public"
      - name: email
        databricks_tags:
          data_classification: "pii"
        column_mask:
          function: my_catalog.my_schema.mask_email
          using_columns: "customer_id, 'literal string'"
```

</File>

## Инкрементальные модели
_Доступно в версиях 1.9 и выше_

:::caution Ломающее изменение в v1.11.0

<details> 
<summary>dbt-databricks v1.11.0 требует Databricks Runtime 12.2 LTS или выше для инкрементальных моделей</summary>

В этой версии добавлено исправление проблемы с несоответствием порядка колонок в инкрементальных моделях за счёт использования синтаксиса Databricks `INSERT BY NAME` (доступен начиная с DBR 12.2). Это предотвращает повреждение данных, которое могло возникать при изменении порядка колонок в моделях с настройкой `on_schema_change: sync_all_columns`.

Если вы используете более старую версию runtime:
- Зафиксируйте версию `dbt-databricks` на `1.10.x`
- Или обновитесь до DBR 12.2 LTS или выше

Это ломающее изменение затрагивает все стратегии инкрементальной загрузки: `append`, `insert_overwrite`, `replace_where`, `delete+insert` и `merge` (через создание промежуточной таблицы).

Подробнее об изменениях в v1.11.0 см. в [dbt-databricks v1.11.0 changelog](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md).

</details> 

:::

Плагин dbt-databricks в значительной степени опирается на конфигурацию [`incremental_strategy`](/docs/build/incremental-strategy). Эта настройка определяет, как инкрементальная материализация будет собирать модель при запусках после первого. Она может принимать одно из шести значений:
 - `append`: Вставляет новые записи, не обновляя и не перезаписывая существующие данные.
 - `insert_overwrite`: Если задан `partition_by`, перезаписывает соответствующие партиции в <Term id="table" /> новыми данными. Если `partition_by` не указан, перезаписывает всю таблицу новыми данными.
 - `merge` (по умолчанию; только для форматов файлов Delta и Hudi): Сопоставляет записи на основе `unique_key`, обновляя существующие записи и вставляя новые. (Если `unique_key` не указан, все новые данные вставляются — аналогично `append`.)
 - `replace_where` (только для формата файлов Delta): Сопоставляет записи на основе `incremental_predicates`, заменяя все записи в существующей таблице, которые соответствуют предикатам, на записи из новых данных с теми же предикатами. (Если `incremental_predicates` не указаны, все новые данные вставляются — аналогично `append`.)
 - `delete+insert` (только для формата файлов Delta, доступно в v1.11+): Сопоставляет записи на основе обязательного `unique_key`, удаляет совпадающие записи и вставляет новые. Дополнительно может применяться фильтрация с помощью `incremental_predicates`.
 - `microbatch` (только для формата файлов Delta): Реализует [стратегию microbatch](/docs/build/incremental-microbatch), используя `replace_where` с предикатами, которые генерируются на основе `event_time`.
 
Каждая из этих стратегий имеет свои плюсы и минусы, которые мы обсудим ниже. Как и в случае любой конфигурации модели, `incremental_strategy` может быть указана в `dbt_project.yml` или в блоке `config()` файла модели.

### Стратегия `append`

Следуя стратегии `append`, dbt выполнит оператор `insert into` со всеми новыми данными. Привлекательность этой стратегии заключается в том, что она проста и функциональна на всех платформах, типах файлов, методах подключения и версиях Apache Spark. Однако эта стратегия _не может_ обновлять, перезаписывать или удалять существующие данные, поэтому она, вероятно, будет вставлять дублирующиеся записи для многих источников данных.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='databricks_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='append',
) }}

--  Все строки, возвращаемые этим запросом, будут добавлены к существующей таблице

select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```
</File>
</TabItem>
<TabItem value="run">

<File name='databricks_incremental.sql'>

```sql
create temporary view databricks_incremental__dbt_tmp as

    select * from analytics.events

    where event_ts >= (select max(event_ts) from {{ this }})

;

insert into table analytics.databricks_incremental
    select `date_day`, `users` from databricks_incremental__dbt_tmp
```

</File>
</TabItem>
</Tabs>

### Стратегия `insert_overwrite`

Стратегия `insert_overwrite` обновляет данные в таблице, **заменяя существующие записи**, а не просто добавляя новые. Эта стратегия наиболее эффективна, когда она указана вместе с параметром `partition_by` или `liquid_clustered_by` в конфигурации модели — это помогает определить конкретные партиции или кластеры, на которые влияет ваш запрос. dbt выполнит [атомарный оператор `insert into ... replace on`](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-dml-insert-into#replace-on), который динамически заменяет все партиции или кластеры, затронутые запросом, вместо перестроения всей таблицы целиком.

**Важно!** При использовании этой инкрементальной стратегии обязательно повторно выбирайте (_re-select_) **все** релевантные данные для соответствующей партиции или кластера.

При использовании `liquid_clustered_by` ключи `replace on` будут совпадать с ключами `liquid_clustered_by` (аналогично поведению `partition_by`).

Если установить [`use_replace_on_for_insert_overwrite`](/reference/global-configs/databricks-changes#use-replace-on-for-insert_overwrite-strategy) в `True` (в SQL warehouses или при использовании кластерных вычислений), dbt будет динамически перезаписывать партиции и заменять **только** те партиции или кластеры, которые возвращаются запросом модели. В этом случае dbt выполняет оператор [`insert overwrite` с `partitionOverwriteMode='dynamic'`](https://docs.databricks.com/aws/en/delta/selective-overwrite#dynamic-partition-overwrites-with-partitionoverwritemode-legacyl), что помогает сократить количество ненужных перезаписей и повысить производительность.

Если установить [`use_replace_on_for_insert_overwrite`](/reference/global-configs/databricks-changes#use-replace-on-for-insert_overwrite-strategy) в `False` в SQL warehouses, dbt будет обрезать (полностью очищать) таблицу перед вставкой новых данных. Это приводит к замене всех строк таблицы при каждом запуске модели, что может увеличить время выполнения и стоимость для больших наборов данных.

Если вы не укажете `partition_by` или `liquid_clustered_by`, стратегия `insert_overwrite` будет атомарно заменять **всё содержимое таблицы**, перезаписывая все существующие данные только новыми записями. При этом схема столбцов таблицы остаётся неизменной. В некоторых ограниченных случаях такое поведение может быть желательным, так как оно минимизирует простой во время перезаписи содержимого таблицы. Эта операция сопоставима с выполнением `truncate` и `insert` в других базах данных. Для атомарной замены таблиц в формате Delta вместо этого используйте материализацию `table` (которая выполняет `create or replace`).

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='databricks_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    partition_by=['date_day'],
    file_format='parquet'
) }}

/*
  Каждый раздел, возвращаемый этим запросом, будет перезаписан
  при выполнении этой модели
*/

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    date_day,
    count(*) as users

from new_events
group by 1
```

</File>
</TabItem>
<TabItem value="run">

<File name='databricks_incremental.sql'>

```sql
create temporary view databricks_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events


        where date_day >= date_add(current_date, -1)


    )

    select
        date_day,
        count(*) as users

    from events
    group by 1

;

insert overwrite table analytics.databricks_incremental
    partition (date_day)
    select `date_day`, `users` from databricks_incremental__dbt_tmp
```

</File>
</TabItem>
</Tabs>

### Стратегия `merge`

Инкрементальная стратегия `merge` требует:
- `file_format: delta или hudi`
- Databricks Runtime 5.1 и выше для формата файла delta
- Apache Spark для формата файла hudi

Адаптер Databricks выполнит [атомарный оператор `merge`](https://docs.databricks.com/spark/latest/spark-sql/language-manual/merge-into.html), аналогичный поведению слияния по умолчанию в Snowflake и BigQuery. Если указан `unique_key` (рекомендуется), dbt обновит старые записи значениями из новых записей, которые совпадают по ключевому столбцу. Если `unique_key` не указан, dbt пропустит критерии совпадения и просто вставит все новые записи (аналогично стратегии `append`).

Указание `merge` в качестве инкрементальной стратегии является необязательным, так как это стратегия по умолчанию, используемая, когда никакая не указана.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
]
}>
<TabItem value="source">

<File name='merge_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta', # или 'hudi'
    unique_key='user_id',
    incremental_strategy='merge'
) }}

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    user_id,
    max(date_day) as last_seen

from events
group by 1
```

</File>
</TabItem>
<TabItem value="run">

<File name='target/run/merge_incremental.sql'>

```sql
create temporary view merge_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events


        where date_day >= date_add(current_date, -1)


    )

    select
        user_id,
        max(date_day) as last_seen

    from events
    group by 1

;

merge into analytics.merge_incremental as DBT_INTERNAL_DEST
    using merge_incremental__dbt_tmp as DBT_INTERNAL_SOURCE
    on DBT_INTERNAL_SOURCE.user_id = DBT_INTERNAL_DEST.user_id
    when matched then update set *
    when not matched then insert *
```

</File>

</TabItem>
</Tabs>

Начиная с версии 1.9, поведение `merge` можно изменить с помощью следующих дополнительных параметров конфигурации:

- `target_alias`, `source_alias`: Алиасы для целевой и исходной таблиц, которые позволяют более наглядно описывать условия merge. По умолчанию используются `DBT_INTERNAL_DEST` и `DBT_INTERNAL_SOURCE` соответственно.
- `skip_matched_step`: Если установлено в `true`, секция `matched` в операторе merge не будет включена.
- `skip_not_matched_step`: Если установлено в `true`, секция `not matched` не будет включена.
- `matched_condition`: Условие, применяемое к секции `WHEN MATCHED`. Для написания условного выражения следует использовать `target_alias` и `source_alias`, например: `DBT_INTERNAL_DEST.col1 = hash(DBT_INTERNAL_SOURCE.col2, DBT_INTERNAL_SOURCE.col3)`. Это условие дополнительно ограничивает набор строк, считающихся совпавшими.
- `not_matched_condition`: Условие, применяемое к секции `WHEN NOT MATCHED [BY TARGET]`. Это условие дополнительно ограничивает набор строк в целевой таблице, которые не совпадают с источником и будут вставлены в результирующую таблицу.
- `not_matched_by_source_condition`: Условие, применяемое как дополнительный фильтр в секции `WHEN NOT MATCHED BY SOURCE`. Используется только совместно с `not_matched_by_source_action`.
- `not_matched_by_source_action`: Действие, которое выполняется при выполнении условия. Настраивается как выражение. Например: `not_matched_by_source_action: "update set t.attr1 = 'deleted', t.tech_change_ts = current_timestamp()"`.
- `merge_with_schema_evolution`: Если установлено в `true`, оператор merge будет включать секцию `WITH SCHEMA EVOLUTION`.

Для получения более подробной информации о значении каждого условия слияния, пожалуйста, обратитесь к [документации Databricks](https://docs.databricks.com/en/sql/language-manual/delta-merge-into.html).

Ниже приведен пример, демонстрирующий использование этих новых опций:

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
]
}>
<TabItem value="source">

<File name='merge_incremental_options.sql'>

```sql
{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    incremental_strategy='merge',
    target_alias='t',
    source_alias='s',
    matched_condition='t.tech_change_ts < s.tech_change_ts',
    not_matched_condition='s.attr1 IS NOT NULL',
    not_matched_by_source_condition='t.tech_change_ts < current_timestamp()',
    not_matched_by_source_action='delete',
    merge_with_schema_evolution=true
) }}

select
    id,
    attr1,
    attr2,
    tech_change_ts
from
    {{ ref('source_table') }} as s
```

</File>
</TabItem>
<TabItem value="run">

<File name='target/run/merge_incremental_options.sql'>

```sql
create temporary view merge_incremental__dbt_tmp as

    select
        id,
        attr1,
        attr2,
        tech_change_ts
    from upstream.source_table
;

merge 
    with schema evolution
into
    target_table as t
using (
    select
        id,
        attr1,
        attr2,
        tech_change_ts
    from
        source_table as s
)
on
    t.id <=> s.id
when matched
    and t.tech_change_ts < s.tech_change_ts
    then update set
        id = s.id,
        attr1 = s.attr1,
        attr2 = s.attr2,
        tech_change_ts = s.tech_change_ts

when not matched
    and s.attr1 IS NOT NULL
    then insert (
        id,
        attr1,
        attr2,
        tech_change_ts
    ) values (
        s.id,
        s.attr1,
        s.attr2,
        s.tech_change_ts
    )
    
when not matched by source
    and t.tech_change_ts < current_timestamp()
    then delete
```

</File>

</TabItem>
</Tabs>

### Стратегия `replace_where`

Инкрементальная стратегия `replace_where` требует:
- `file_format: delta`
- Databricks Runtime 12.0 и выше

dbt выполнит [атомарный оператор `replace where`](https://docs.databricks.com/en/delta/selective-overwrite.html#arbitrary-selective-overwrite-with-replacewhere), который избирательно перезаписывает данные, соответствующие одному или нескольким `incremental_predicates`, указанным в виде строки или массива. Только строки, соответствующие предикатам, будут вставлены. Если `incremental_predicates` не указаны, dbt выполнит атомарную вставку, как в случае `append`.  

:::caution

`replace_where` вставляет данные в столбцы в порядке их предоставления, а не по имени столбца. Если вы измените порядок столбцов и данные совместимы с существующей схемой, вы можете незаметно вставить значения в неожиданный столбец. Если входные данные несовместимы с существующей схемой, вы получите ошибку.

:::

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
]
}>
<TabItem value="source">

<File name='replace_where_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta',
    incremental_strategy = 'replace_where'
    incremental_predicates = 'user_id >= 10000' # Никогда не заменяйте пользователей с id < 10000
) }}

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    user_id,
    max(date_day) as last_seen

from events
group by 1
```

</File>
</TabItem>
<TabItem value="run">

<File name='target/run/replace_where_incremental.sql'>

```sql
create temporary view replace_where__dbt_tmp as

    with new_events as (

        select * from analytics.events


        where date_day >= date_add(current_date, -1)


    )

    select
        user_id,
        max(date_day) as last_seen

    from events
    group by 1

;

insert into analytics.replace_where_incremental
    replace where user_id >= 10000
    table `replace_where__dbt_tmp`
```

</File>

</TabItem>
</Tabs>

### The `delete+insert` strategy

_Available in versions 1.11 or higher_

The `delete+insert` incremental strategy requires:
- `file_format: delta`
- A required `unique_key` configuration
- Databricks Runtime 12.2 LTS or higher

The `delete+insert` strategy is a simpler alternative to the `merge` strategy for cases where you want to replace matching records without the complexity of updating specific columns. This strategy works in two steps:

1. **Delete**: Remove all rows from the target table where the `unique_key` matches rows in the new data.
2. **Insert**: Insert all new rows from the staging data.

This strategy is particularly useful when:
- You want to replace entire records rather than update specific columns
- Your business logic requires a clean "remove and replace" approach
- You need a simpler incremental strategy than `merge` for full record replacement

When using Databricks Runtime 17.1 or higher, dbt uses the efficient [`INSERT INTO ... REPLACE ON` syntax](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-dml-insert-into#replace-on) to perform this operation atomically. For older runtime versions, dbt executes separate `DELETE` and `INSERT` statements.

You can optionally use `incremental_predicates` to further filter which records are processed, providing more control over which rows are deleted and inserted.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code (DBR 17.1+)', value: 'run_new', },
    { label: 'Run code (DBR < 17.1)', value: 'run_legacy', },
]
}>
<TabItem value="source">

<File name='delete_insert_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta',
    incremental_strategy='delete+insert',
    unique_key='user_id'
) }}

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    user_id,
    max(date_day) as last_seen

from new_events
group by 1
```

</File>
</TabItem>
<TabItem value="run_new">

<File name='target/run/delete_insert_incremental.sql'>

```sql
create temporary view delete_insert_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events

        where date_day >= date_add(current_date, -1)

    )

    select
        user_id,
        max(date_day) as last_seen

    from new_events
    group by 1

;

insert into table analytics.delete_insert_incremental as target
replace on (target.user_id <=> temp.user_id)
(select `user_id`, `last_seen`
   from delete_insert_incremental__dbt_tmp where date_day >= date_add(current_date, -1)) as temp
```

</File>

</TabItem>
<TabItem value="run_legacy">

<File name='target/run/delete_insert_incremental.sql'>

```sql
create temporary view delete_insert_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events

        where date_day >= date_add(current_date, -1)

    )

    select
        user_id,
        max(date_day) as last_seen

    from new_events
    group by 1

;

-- Step 1: Delete matching rows
delete from analytics.delete_insert_incremental
where analytics.delete_insert_incremental.user_id IN (SELECT user_id FROM delete_insert_incremental__dbt_tmp)
  and date_day >= date_add(current_date, -1);

-- Step 2: Insert new rows
insert into analytics.delete_insert_incremental by name
select `user_id`, `last_seen`
from delete_insert_incremental__dbt_tmp
where date_day >= date_add(current_date, -1)
```

</File>

</TabItem>
</Tabs>


### Стратегия `microbatch`

_Доступно в версиях 1.9 и выше_

Адаптер Databricks реализует стратегию `microbatch`, используя `replace_where`. Обратите внимание на требования и предупреждения, указанные выше для `replace_where`. Дополнительную информацию об этой стратегии см. на странице справки [microbatch](/docs/build/incremental-microbatch).

В следующем примере в таблице `events` добавлен столбец `event_time`, называемый `ts`, в ее схеме.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
]
}>
<TabItem value="source">

<File name='microbatch_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta',
    incremental_strategy = 'microbatch'
    event_time='date' # Используйте 'date' как зерно для этой таблицы микропакетов
) }}

with new_events as (

    select * from {{ ref('events') }}

)

select
    user_id,
    date,
    count(*) as visits

from events
group by 1, 2
```

</File>
</TabItem>
<TabItem value="run">

<File name='target/run/replace_where_incremental.sql'>

```sql
create temporary view replace_where__dbt_tmp as

    with new_events as (

        select * from (select * from analytics.events where ts >= '2024-10-01' and ts < '2024-10-02')

    )

    select
        user_id,
        date,
        count(*) as visits
    from events
    group by 1, 2
;

insert into analytics.replace_where_incremental
    replace where CAST(date as TIMESTAMP) >= '2024-10-01' and CAST(date as TIMESTAMP) < '2024-10-02'
    table `replace_where__dbt_tmp`
```

</File>

</TabItem>
</Tabs>

## Python model configuration

The Databricks adapter supports Python models. Databricks uses PySpark as the processing framework for these models. 

**Submission methods:** Databricks supports a few different mechanisms to submit PySpark code, each with relative advantages. Some are better for supporting iterative development, while others are better for supporting lower-cost production deployments. The options are:
- `all_purpose_cluster` (default): dbt will run your Python model using the cluster ID configured as `cluster` in your connection profile or for this specific model. These clusters are more expensive but also much more responsive. We recommend using an interactive all-purpose cluster for quicker iteration in development.
  - `create_notebook: True`: dbt will upload your model's compiled PySpark code to a notebook in the namespace `/Shared/dbt_python_model/{schema}`, where `{schema}` is the configured schema for the model, and execute that notebook to run using the all-purpose cluster. The appeal of this approach is that you can easily open the notebook in the Databricks UI for debugging or fine-tuning right after running your model. Remember to copy any changes into your dbt `.py` model code before re-running.
  - `create_notebook: False` (default): dbt will use the [Command API](https://docs.databricks.com/dev-tools/api/1.2/index.html#run-a-command), which is slightly faster.
- `job_cluster`: dbt will upload your model's compiled PySpark code to a notebook in the namespace `/Shared/dbt_python_model/{schema}`, where `{schema}` is the configured schema for the model, and execute that notebook to run using a short-lived jobs cluster. For each Python model, Databricks will need to spin up the cluster, execute the model's PySpark transformation, and then spin down the cluster. As such, job clusters take longer before and after model execution, but they're also less expensive, so we recommend these for longer-running Python models in production. To use the `job_cluster` submission method, your model must be configured with `job_cluster_config`, which defines key-value properties for `new_cluster`, as defined in the [JobRunsSubmit API](https://docs.databricks.com/dev-tools/api/latest/jobs.html#operation/JobsRunsSubmit).

You can configure each model's `submission_method` in all the standard ways you supply configuration:

```python
def model(dbt, session):
    dbt.config(
        submission_method="all_purpose_cluster",
        create_notebook=True,
        cluster_id="abcd-1234-wxyz"
    )
    ...
```
```yml
models:
  - name: my_python_model
    config:
      submission_method: job_cluster
      job_cluster_config:
        spark_version: ...
        node_type_id: ...
```
```yml
# dbt_project.yml
models:
  project_name:
    subfolder:
      # set defaults for all .py models defined in this subfolder
      +submission_method: all_purpose_cluster
      +create_notebook: False
      +cluster_id: abcd-1234-wxyz
```

If not configured, `dbt-spark` will use the built-in defaults: the all-purpose cluster (based on `cluster` in your connection profile) without creating a notebook. The `dbt-databricks` adapter will default to the cluster configured in `http_path`. We encourage explicitly configuring the clusters for Python models in Databricks projects.

**Installing packages:** When using all-purpose clusters, we recommend installing packages which you will be using to run your Python models.

**Related docs:**
- [PySpark DataFrame syntax](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)
- [Databricks: Introduction to DataFrames - Python](https://docs.databricks.com/spark/latest/dataframes-datasets/introduction-to-dataframes-python.html)

## Выбор вычислительных ресурсов для каждой модели

Начиная с версии 1.7.2, вы можете назначать, какой вычислительный ресурс использовать для каждой модели.
Для SQL-моделей вы можете выбрать SQL Warehouse (безсерверный или предоставленный) или кластер общего назначения.
Для получения подробной информации о том, как эта функция взаимодействует с моделями Python, см. [Указание вычислительных ресурсов для моделей Python](#specifying-compute-for-python-models).

:::note

Это необязательная настройка. Если вы не настроите это, как показано ниже, мы будем использовать вычислительные ресурсы, указанные в http_path в верхнем уровне раздела output в вашем профиле. 
Это также вычислительные ресурсы, которые будут использоваться для задач, не связанных с конкретной моделью, таких как сбор метаданных для всех таблиц в схеме.

:::


Чтобы воспользоваться этой возможностью, вам нужно будет добавить блоки вычислений в ваш профиль:

<File name='profile.yml'>

```yaml

profile-name:
  target: target-name # это целевой объект по умолчанию
  outputs:
    target-name:
      type: databricks
      catalog: optional catalog name if you are using Unity Catalog
      schema: schema name # Обязательно        
      host: yourorg.databrickshost.com # Обязательно

      ### Этот путь используется как вычислительный ресурс по умолчанию
      http_path: /sql/your/http/path # Обязательно        
      
      ### Новый раздел вычислений
      compute:

        ### Имя, которое вы будете использовать для ссылки на альтернативный вычислительный ресурс
       Compute1:
          http_path: '/sql/your/http/path' # Обязательно для каждого альтернативного вычислительного ресурса

        ### Третий именованный вычислительный ресурс, используйте любое имя, которое вам нравится
        Compute2:
          http_path: '/some/other/path' # Обязательно для каждого альтернативного вычислительного ресурса
      ...

    target-name: # дополнительные целевые объекты
      ...
      ### Для каждого целевого объекта вам нужно определить те же вычислительные ресурсы,
      ### но вы можете указать разные пути
      compute:

        ### Имя, которое вы будете использовать для ссылки на альтернативный вычислительный ресурс
        Compute1:
          http_path: '/sql/your/http/path' # Обязательно для каждого альтернативного вычислительного ресурса

        ### Третий именованный вычислительный ресурс, используйте любое имя, которое вам нравится
        Compute2:
          http_path: '/some/other/path' # Обязательно для каждого альтернативного вычислительного ресурса
      ...

```

</File>

Новый раздел вычислений представляет собой карту имен, выбранных пользователем, к объектам с свойством http_path.
Каждый вычислительный ресурс имеет ключ, который используется в определении/конфигурации модели для указания, какой вычислительный ресурс вы хотите использовать для этой модели/выбора моделей. 
Мы рекомендуем выбирать имя, которое легко распознается как используемые вами вычислительные ресурсы, например, имя вычислительного ресурса в интерфейсе Databricks. 

:::note

Вам нужно использовать один и тот же набор имен для вычислительных ресурсов во всех ваших выходных данных, хотя вы можете предоставить разные http_paths, что позволяет использовать разные вычислительные ресурсы в разных сценариях развертывания.

:::

Чтобы настроить это внутри `<Constant name="cloud" />`, используйте [функцию расширенных атрибутов](/docs/dbt-cloud-environments#extended-attributes-) в нужных окружениях:

```yaml

compute:
  Compute1:
    http_path: /SOME/OTHER/PATH
  Compute2:
    http_path: /SOME/OTHER/PATH

```

### Указание вычислительных ресурсов для моделей

Как и многие другие параметры конфигурации, вычислительные ресурсы (compute) для модели можно указать несколькими способами, используя `databricks_compute`.
В файле `dbt_project.yml` выбранный compute можно задать сразу для всех моделей в определённом каталоге:

<File name='dbt_project.yml'>

```yaml

...

models:
  +databricks_compute: "Compute1"     # используйте склад/кластер `Compute1` для всех моделей в проекте...
  my_project:
    clickstream:
      +databricks_compute: "Compute2" # ...за исключением моделей в папке `clickstream`, которые будут использовать `Compute2`.

snapshots:
  +databricks_compute: "Compute1"     # все модели Snapshot настроены на использование `Compute1`.

```

</File>

Для отдельной модели вычислительные ресурсы могут быть указаны в конфигурации модели в вашем файле схемы.

<File name='schema.yml'>

```yaml

models:
  - name: table_model
    config:
      databricks_compute: Compute1
    columns:
      - name: id
        data_type: int

```

</File>


В качестве альтернативы хранилище данных можно указать в конфигурации SQL‑файла модели.

<File name='model.sql'>

```sql

{{
  config(
    materialized='table',
    databricks_compute='Compute1'
  )
}}
select * from {{ ref('seed') }}

```

</File>


Чтобы убедиться, что указанные вычислительные ресурсы используются, ищите строки в вашем dbt.log, такие как:

```
Адаптер Databricks ... использует вычислительный ресурс по умолчанию.
```

или

```
Адаптер Databricks ... использует вычислительный ресурс <имя вычислительного ресурса>.
```

### Указание вычислительных ресурсов для моделей Python

Материализация python‑модели требует выполнения как SQL, так и Python‑кода.  
В частности, если ваша python‑модель является инкрементальной, текущий шаблон выполнения предполагает запуск Python для создания staging‑таблицы, которая затем объединяется (merge) с целевой таблицей с помощью SQL.

Python‑код должен выполняться на all purpose кластере (или serverless кластере, см. [Python Submission Methods](#python-submission-methods)), тогда как SQL‑код может выполняться как на all purpose кластере, так и на SQL Warehouse.

Когда вы указываете `databricks_compute` для python‑модели, в настоящее время вы задаёте только то вычислительное окружение, которое используется при выполнении SQL, специфичного для модели.  
Если вы хотите использовать другое вычислительное окружение для выполнения самого Python‑кода, необходимо указать альтернативный compute в конфигурации модели.

Например:

<File name="model.py">

 ```python

def model(dbt, session):
    dbt.config(
      http_path="sql/protocolv1/..."
    )

```

</File>

Если ваш вычислительный ресурс по умолчанию является SQL-складом, вам нужно будет указать http_path кластера общего назначения таким образом.

## Сохранение описаний моделей

Поддерживается сохранение документации на уровне relation. Для получения дополнительной информации о настройке сохранения документации см. [документацию](/reference/resource-configs/persist_docs).

Когда опция `persist_docs` настроена соответствующим образом, вы сможете
увидеть описания моделей в поле `Comment` команды `describe [table] extended`
или `show table extended in [database] like '*'`.


## Конфигурации формата файлов по умолчанию

Чтобы получить доступ к расширенным функциям инкрементальных стратегий, таким как 
[снимки](/reference/commands/snapshot) и инкрементальная стратегия `merge`, вы захотите
использовать формат файлов Delta или Hudi в качестве формата файлов по умолчанию при материализации моделей как таблиц.

Это довольно удобно сделать, установив верхнеуровневую конфигурацию в вашем
файле проекта:

<File name='dbt_project.yml'>

```yml
models:
  +file_format: delta # или hudi
  
seeds:
  +file_format: delta # или hudi
  
snapshots:
  +file_format: delta # или hudi
```

</File>


## Материализованные представления и стриминговые таблицы

[Материализованные представления](https://docs.databricks.com/en/sql/user/materialized-views.html) и [потоковые таблицы](https://docs.databricks.com/en/sql/load-data-streaming-table.html) являются альтернативами инкрементальным таблицам, которые поддерживаются [Delta Live Tables](https://docs.databricks.com/en/delta-live-tables/index.html).
См. [Что такое Delta Live Tables?](https://docs.databricks.com/en/delta-live-tables/index.html#what-are-delta-live-tables-datasets) для получения дополнительной информации и примеров использования.

Чтобы использовать эти стратегии материализации, вам потребуется рабочее пространство, включенное для Unity Catalog и безсерверных SQL-складов.

<File name='materialized_view.sql'>

```sql
{{ config(
   materialized = 'materialized_view'
 ) }}
```

</File>

или

<File name='streaming_table.sql'>

```sql
{{ config(
   materialized = 'streaming_table'
 ) }}
```

</File>

Мы поддерживаем параметр [on_configuration_change](/reference/resource-configs/on_configuration_change) для большинства доступных свойств этих материализаций.  
В следующей таблице приведено обобщение поддержки конфигураций:

| Концепция Databricks | Имя конфига | Поддержка MV/ST | Версия |
| ------------------- | ------------| --------------- | ------- |
| [PARTITIONED BY](https://docs.databricks.com/en/sql/language-manual/sql-ref-partition.html#partitioned-by) | `partition_by` | MV/ST | Все |
| [CLUSTER BY](https://docs.databricks.com/en/delta/clustering.html) | `liquid_clustered_by` | MV/ST | v1.11+ |
| COMMENT | [`description`](/reference/resource-properties/description) | MV/ST | Все |
| [TBLPROPERTIES](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html#tblproperties) | `tblproperties` | MV/ST | Все |
| [TAGS](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) | `databricks_tags` | MV/ST | v1.11+ |
| [SCHEDULE CRON](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view.html#parameters) | `schedule: { 'cron': '\<cron schedule\>', 'time_zone_value': '\<time zone value\>' }` | MV/ST | Все |
| query | определяется SQL вашего model | on_configuration_change только для MV | Все |

<File name='mv_example.sql'>

```sql

{{ config(
    materialized='materialized_view',
    partition_by='id',
    schedule = {
        'cron': '0 0 * * * ? *',
        'time_zone_value': 'Etc/UTC'
    },
    tblproperties={
        'key': 'value'
    },
) }}
select * from {{ ref('my_seed') }}

```

</File>

### Подробности конфигурации

#### partition_by
`partition_by` работает так же, как для представлений и таблиц, т.е. может быть одним столбцом или массивом столбцов для разделения.

#### liquid_clustered_by
_Available in versions 1.11 or higher_

`liquid_clustered_by` enables [liquid clustering](https://docs.databricks.com/en/delta/clustering.html) for materialized views and streaming tables. Liquid clustering optimizes query performance by co-locating similar data within the same files, particularly beneficial for queries with selective filters on the clustered columns.

**Note:** You cannot use both `partition_by` and `liquid_clustered_by` on the same materialization, as Databricks doesn't allow combining these features.

#### databricks_tags
_Available in versions 1.11 or higher_

`databricks_tags` allows you to apply [Unity Catalog tags](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) to your materialized views and streaming tables for data governance and organization. Tags are key-value pairs that can be used for data classification, access control policies, and metadata management.

```sql
{{ config(
    materialized='streaming_table',
    databricks_tags={'pii': 'contains_email', 'team': 'analytics'}
) }}
```

Tags are applied via `ALTER` statements after the materialization is created. Once applied, tags cannot be removed through dbt-databricks configuration changes. To remove tags, you must use Databricks directly or a post-hook.

#### description
Как и в случае представлений и таблиц, добавление `description` в вашу конфигурацию приведет к добавлению комментария на уровне таблицы в вашу материализацию.

#### tblproperties
`tblproperties` работает так же, как для представлений и таблиц, с важным исключением: адаптер поддерживает список ключей, которые устанавливаются Databricks при создании материализованного представления или потоковой таблицы, которые игнорируются для определения изменений конфигурации.

#### schedule
Используйте это для установки расписания обновления для модели. Если вы используете ключ `schedule`, ключ `cron` обязателен в связанном словаре, но `time_zone_value` является необязательным (см. пример выше). Значение `cron` должно быть отформатировано, как это задокументировано Databricks.
Если расписание установлено на материализации в Databricks, а ваш проект dbt не указывает расписание для него (когда `on_configuration_change` установлено в `apply`), расписание обновления будет установлено на ручное при следующем запуске проекта.
Даже когда расписания установлены, dbt будет запрашивать, чтобы материализация обновлялась вручную при запуске.

#### query
Для материализованных представлений, если скомпилированный запрос для модели отличается от запроса в базе данных, мы примем действие, указанное в `on_configuration_change`.
Изменения в запросе в настоящее время не обнаруживаются для потоковых таблиц; см. следующий раздел для подробностей.

### on_configuration_change 
`on_configuration_change` поддерживается для материализованных представлений и потоковых таблиц, хотя две материализации обрабатывают это по-разному.

#### Материализованные представления
В настоящее время единственное изменение, которое можно применить без воссоздания материализованного представления в Databricks, - это обновление расписания.
Это связано с ограничениями в SQL API Databricks.

#### Streaming Tables
Для стриминговых таблиц в настоящее время **только изменения в партиционировании** требуют, чтобы таблица была удалена и создана заново.  
Для любых других поддерживаемых изменений конфигурации мы используем `CREATE OR REFRESH` (а также оператор `ALTER` для изменений расписания), чтобы применить эти изменения.

В настоящее время у адаптера нет механизма для определения того, изменилась ли SQL‑запрос стриминговой таблицы. Поэтому в этом случае, независимо от поведения, заданного в `on_configuration_change`, будет использован оператор `create or refresh` (при условии, что `partitioned by` не изменился). Это приведёт к тому, что обновлённый запрос будет применяться только к будущим строкам, без повторного выполнения для уже обработанных данных.

Если исходные данные всё ещё доступны, запуск с флагом `--full-refresh` повторно обработает доступные данные с использованием обновлённого текущего запроса.

## Setting table properties
[Table properties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html) можно задавать в конфигурации таблиц или представлений с помощью параметра `tblproperties`:

<File name='with_table_properties.sql'>

```sql
{{ config(
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
 ) }}
```

</File>

:::caution

Эти свойства отправляются напрямую в Databricks без проверки в dbt, поэтому будьте внимательны при использовании этой функции. Вам нужно будет выполнить полное обновление инкрементальных материализаций, если вы измените их `tblproperties`.

:::

Одним из применений этой функции является обеспечение совместимости таблиц `delta` с читателями `iceberg` с использованием [Универсального формата](https://docs.databricks.com/en/delta/uniform.html).

```sql
{{ config(
    tblproperties={
      'delta.enableIcebergCompatV2' = 'true'
      'delta.universalFormat.enabledFormats' = 'iceberg'
    }
 ) }}
```

`tblproperties` могут быть указаны для моделей Python, но они будут применены через оператор `ALTER` после создания таблицы.
Это связано с ограничением в PySpark.