---
title: "Конфигурации Databricks"
id: "databricks-configs"
---

## Конфигурирование таблиц

При материализации модели как `table` вы можете включить несколько дополнительных конфигураций, специфичных для плагина dbt-databricks, помимо стандартных [конфигураций модели](/reference/model-configs).

<VersionBlock lastVersion="1.7">

 
| Опция               | Описание                                                                                                                                                                                                        | Обязательно?                             | Поддержка модели | Пример                  |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|------------------|--------------------------|
| file_format         | Формат файла, который будет использоваться при создании таблиц (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` или `libsvm`).                                                        | Необязательно                            | SQL, Python      | `delta`                  |
| location_root       | Созданная таблица использует указанную директорию для хранения своих данных. К ней добавляется псевдоним таблицы.                                                                                              | Необязательно                            | SQL, Python      | `/mnt/root`              |
| partition_by        | Разделите созданную таблицу по указанным столбцам. Для каждой партиции создается директория.                                                                                                                  | Необязательно                            | SQL, Python      | `date_day`               |
| liquid_clustered_by | Кластеризуйте созданную таблицу по указанным столбцам. Метод кластеризации основан на [функции Liquid Clustering от Delta](https://docs.databricks.com/en/delta/clustering.html). Доступно с версии dbt-databricks 1.6.2. | Необязательно                            | SQL              | `date_day`               |
| clustered_by        | Каждая партиция в созданной таблице будет разделена на фиксированное количество бакетов по указанным столбцам.                                                                                               | Необязательно                            | SQL, Python      | `country_code`           |
| buckets             | Количество бакетов, которые нужно создать при кластеризации                                                                                                                                                   | Обязательно, если указано `clustered_by` | SQL, Python      | `8`                      |
| tblproperties       | [Tblproperties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html), которые будут установлены на созданной таблице                                                                 | Необязательно                            | SQL, Python*     | `{'this.is.my.key': 12}` |
| compression         | Установите алгоритм сжатия.                                                                                                                                                                                   | Необязательно                            | SQL, Python      | `zstd`                   |

\* Начиная с версии 1.7.12, мы добавили tblproperties для Python моделей через оператор alter, который выполняется после создания таблицы. У нас еще нет API PySpark для установки tblproperties при создании таблицы, поэтому эта функция в первую очередь предназначена для того, чтобы позволить пользователям аннотировать свои таблицы, созданные на Python, с помощью tblproperties.

</VersionBlock>

<VersionBlock firstVersion="1.8" lastVersion="1.8">

Версия 1.8 вводит поддержку [Тегов](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) на уровне таблицы, помимо всех конфигураций таблицы, поддерживаемых в 1.7.

| Опция               | Описание                                                                                                                                                                                                        | Обязательно?                             | Поддержка модели | Пример                  |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|------------------|--------------------------|
| file_format         | Формат файла, который будет использоваться при создании таблиц (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` или `libsvm`).                                                        | Необязательно                            | SQL, Python      | `delta`                  |
| location_root       | Созданная таблица использует указанную директорию для хранения своих данных. К ней добавляется псевдоним таблицы.                                                                                              | Необязательно                            | SQL, Python      | `/mnt/root`              |
| partition_by        | Разделите созданную таблицу по указанным столбцам. Для каждой партиции создается директория.                                                                                                                  | Необязательно                            | SQL, Python      | `date_day`               |
| liquid_clustered_by | Кластеризуйте созданную таблицу по указанным столбцам. Метод кластеризации основан на [функции Liquid Clustering от Delta](https://docs.databricks.com/en/delta/clustering.html). Доступно с версии dbt-databricks 1.6.2. | Необязательно                            | SQL, Python      | `date_day`               |
| clustered_by        | Каждая партиция в созданной таблице будет разделена на фиксированное количество бакетов по указанным столбцам.                                                                                               | Необязательно                            | SQL, Python      | `country_code`           |
| buckets             | Количество бакетов, которые нужно создать при кластеризации                                                                                                                                                   | Обязательно, если указано `clustered_by` | SQL, Python      | `8`                      |
| tblproperties       | [Tblproperties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html), которые будут установлены на созданной таблице                                                                 | Необязательно                            | SQL, Python*     | `{'this.is.my.key': 12}` |
| databricks_tags     | [Теги](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html), которые будут установлены на созданной таблице                                                                                  | Необязательно                            | SQL+, Python+    | `{'my_tag': 'my_value'}`  |
| compression         | Установите алгоритм сжатия.                                                                                                                                                                                   | Необязательно                            | SQL, Python      | `zstd`                   |

\* Начиная с версии 1.7.12, мы добавили tblproperties для Python моделей через оператор alter, который выполняется после создания таблицы. У нас еще нет API PySpark для установки tblproperties при создании таблицы, поэтому эта функция в первую очередь предназначена для того, чтобы позволить пользователям аннотировать свои таблицы, созданные на Python, с помощью tblproperties.

\+ `databricks_tags` в настоящее время поддерживаются только на уровне таблицы и применяются через операторы `ALTER`.

</VersionBlock>

<VersionBlock firstVersion="1.9">

dbt-databricks v1.9 добавляет поддержку конфигурации `table_format: iceberg`. Попробуйте это сейчас на [последнем релизе dbt Cloud](/docs/dbt-versions/cloud-release-tracks). Все другие конфигурации таблиц также поддерживались в 1.8.

| Опция               | Описание                 | Обязательно?                             | Поддержка модели   | Пример                  |
|---------------------|-------------------------|------------------------------------------|---------------------|--------------------------|
| table_format        | Указывает, следует ли обеспечить совместимость с [Iceberg](https://docs.databricks.com/en/delta/uniform.html) для материализации                                                                                     | Необязательно                            | SQL, Python           | `iceberg`                |
| file_format+        | Формат файла, который будет использоваться при создании таблиц (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` или `libsvm`).                                                        | Необязательно                            | SQL, Python           | `delta`                  |
| location_root       | Созданная таблица использует указанную директорию для хранения своих данных. К ней добавляется псевдоним таблицы.                                                                                              | Необязательно                            | SQL, Python           | `/mnt/root`              |
| partition_by        | Разделите созданную таблицу по указанным столбцам. Для каждой партиции создается директория.                                                                                                                  | Необязательно                            | SQL, Python           | `date_day`               |
| liquid_clustered_by | Кластеризуйте созданную таблицу по указанным столбцам. Метод кластеризации основан на [функции Liquid Clustering от Delta](https://docs.databricks.com/en/delta/clustering.html). Доступно с версии dbt-databricks 1.6.2. | Необязательно                            | SQL, Python           | `date_day`               |
| clustered_by        | Каждая партиция в созданной таблице будет разделена на фиксированное количество бакетов по указанным столбцам.                                                                                               | Необязательно                            | SQL, Python           | `country_code`           |
| buckets             | Количество бакетов, которые нужно создать при кластеризации                                                                                                                                                   | Обязательно, если указано `clustered_by` | SQL, Python           | `8`                      |
| tblproperties       | [Tblproperties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html), которые будут установлены на созданной таблице                                                                 | Необязательно                            | SQL, Python*          | `{'this.is.my.key': 12}` |
| databricks_tags     | [Теги](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html), которые будут установлены на созданной таблице                                                                                  | Необязательно                            | SQL++, Python++       | `{'my_tag': 'my_value'}` |
| compression         | Установите алгоритм сжатия.                                                                                                                                                                                   | Необязательно                            | SQL, Python           | `zstd`                   |

\* У нас еще нет API PySpark для установки tblproperties при создании таблицы, поэтому эта функция в первую очередь предназначена для того, чтобы позволить пользователям аннотировать свои таблицы, созданные на Python, с помощью tblproperties.
\+ Когда `table_format` равно `iceberg`, `file_format` должен быть `delta`.
\++ `databricks_tags` в настоящее время поддерживаются только на уровне таблицы и применяются через операторы `ALTER`.

</VersionBlock>

<VersionBlock firstVersion="1.9">

### Методы отправки Python

В dbt-databricks v1.9 (попробуйте это сейчас в [последнем релизе dbt Cloud](/docs/dbt-versions/cloud-release-tracks)) вы можете использовать эти четыре варианта для `submission_method`: 

* `all_purpose_cluster`: Выполняет модель Python либо напрямую с использованием [command api](https://docs.databricks.com/api/workspace/commandexecution), либо загружая блокнот и создавая одноразовый запуск задания.
* `job_cluster`: Создает новый кластер задания для выполнения загруженного блокнота как одноразового запуска задания.
* `serverless_cluster`: Использует [серверный кластер](https://docs.databricks.com/en/jobs/run-serverless-jobs.html) для выполнения загруженного блокнота как одноразового запуска задания.
* `workflow_job`: Создает/обновляет повторно используемый рабочий процесс и загруженный блокнот для выполнения на кластерах общего назначения, заданиях или серверных кластерах.
   :::caution 
   Этот подход дает вам максимальную гибкость, но создаст постоянные артефакты в Databricks (рабочий процесс), которые пользователи могут запускать вне dbt.
   :::

В настоящее время мы находимся в переходный период, когда существует разрыв между старыми методами отправки (которые были сгруппированы по вычислениям) и логически различными методами отправки (команда, запуск задания, рабочий процесс).

Таким образом, поддерживаемая матрица конфигураций несколько сложна:

| Конфигурация         | Использование                                                        | По умолчанию       | `all_purpose_cluster`* | `job_cluster` | `serverless_cluster` | `workflow_job` |
|----------------------|---------------------------------------------------------------------|--------------------|-------------------------|---------------|----------------------|------------------|
| `create_notebook`    | если false, используйте Command API, в противном случае загрузите блокнот и используйте запуск задания | `false`            | ✅                      | ❌            | ❌                   | ❌               |
| `timeout`            | максимальное время ожидания выполнения команды/задания               | `0` (без таймаута) | ✅                      | ✅            | ✅                   | ✅               |
| `job_cluster_config` | конфигурирует [новый кластер](https://docs.databricks.com/api/workspace/jobs/submit#tasks-new_cluster) для выполнения модели | `{}`                | ❌                      | ✅            | ❌                   | ✅               |
| `access_control_list`| напрямую конфигурирует [контроль доступа](https://docs.databricks.com/api/workspace/jobs/submit#access_control_list) для задания | `{}`                | ✅                      | ✅            | ✅                   | ✅               |
| `packages`           | список пакетов для установки на выполняемом кластере                | `[]`                | ✅                      | ✅            | ✅                   | ✅               |
| `index_url`         | URL для установки `packages`                                        | `None` (использует pypi) | ✅                      | ✅            | ✅                   | ✅               |
| `additional_libs`    | напрямую конфигурирует [библиотеки](https://docs.databricks.com/api/workspace/jobs/submit#tasks-libraries) | `[]`                | ✅                      | ✅            | ✅                   | ✅               |
| `python_job_config`  | дополнительная конфигурация для заданий/рабочих процессов (см. таблицу ниже) | `{}`                | ✅                      | ✅            | ✅                   | ✅               |
| `cluster_id`         | ID существующего кластера общего назначения для выполнения           | `None`             | ✅                      | ❌            | ❌                   | ✅               |
| `http_path`          | путь к существующему кластеру общего назначения для выполнения      | `None`             | ✅                      | ❌            | ❌                   | ❌               |

\* Поддерживаются только `timeout` и `cluster_id`/`http_path`, когда `create_notebook` равно false.

С введением метода отправки `workflow_job` мы решили дополнительно разделить конфигурацию отправки модели Python под верхнюю конфигурацию с именем `python_job_config`. Это позволяет сохранить параметры конфигурации для заданий и рабочих процессов в таком виде, чтобы они не мешали другим конфигурациям модели, что позволяет нам быть гораздо более гибкими в том, что поддерживается для выполнения заданий.

Матрица поддержки для этой функции делится на `workflow_job` и все остальные (при условии, что `all_purpose_cluster` с `create_notebook`==true). Каждая опция конфигурации, указанная в таблице, должна быть вложена под `python_job_config`:

| Конфигурация                | Использование                                                                                                           | По умолчанию | `workflow_job` | Все остальные |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------|--------------|----------------|---------------|
| `name`                      | Имя, которое будет дано (или используется для поиска) созданного рабочего процесса                                     | `None`       | ✅              | ❌            |
| `grants`                    | Упрощенный способ указать контроль доступа для рабочего процесса                                                       | `{}`         | ✅              | ✅            |
| `existing_job_id`           | ID для поиска созданного рабочего процесса (вместо `name`)                                                            | `None`       | ✅              | ❌            |
| `post_hook_tasks`           | [Задачи](https://docs.databricks.com/api/workspace/jobs/create#tasks), которые нужно включить после выполнения блокнота модели | `[]`         | ✅              | ❌            |
| `additional_task_settings`  | Дополнительная [конфигурация задач](https://docs.databricks.com/api/workspace/jobs/create#tasks), которую нужно включить в задачу модели | `{}`         | ✅              | ❌            |
| [Другие настройки запуска заданий](https://docs.databricks.com/api/workspace/jobs/submit) | Конфигурация будет скопирована в запрос, вне задачи модели | `None`       | ❌              | ✅            |
| [Другие настройки рабочего процесса](https://docs.databricks.com/api/workspace/jobs/create) | Конфигурация будет скопирована в запрос, вне задачи модели | `None`       | ✅              | ❌            |

В этом примере используются новые параметры конфигурации из предыдущей таблицы:

<File name='schema.yml'>

```yaml
models:
  - name: my_model
    config:
      submission_method: workflow_job

      # Определите кластер задания, который будет создан для выполнения этого рабочего процесса
      # В качестве альтернативы можно указать cluster_id для использования существующего кластера или не указывать ничего, чтобы использовать серверный кластер
      job_cluster_config:
        spark_version: "15.3.x-scala2.12"
        node_type_id: "rd-fleet.2xlarge"
        runtime_engine: "{{ var('job_cluster_defaults.runtime_engine') }}"
        data_security_mode: "{{ var('job_cluster_defaults.data_security_mode') }}"
        autoscale: { "min_workers": 1, "max_workers": 4 }

      python_job_config:
        # Эти настройки передаются в запрос, как есть
        email_notifications: { on_failure: ["me@example.com"] }
        max_retries: 2

        name: my_workflow_name

        # Переопределите настройки для задачи dbt вашей модели. Например, вы можете
        # изменить ключ задачи
        additional_task_settings: { "task_key": "my_dbt_task" }

        # Определите задачи, которые нужно выполнить до/после модели
        # Этот пример предполагает, что вы уже загрузили блокнот по пути /my_notebook_path для выполнения оптимизации и очистки
        post_hook_tasks:
          [
            {
              "depends_on": [{ "task_key": "my_dbt_task" }],
              "task_key": "OPTIMIZE_AND_VACUUM",
              "notebook_task":
                { "notebook_path": "/my_notebook_path", "source": "WORKSPACE" },
            },
          ]

        # Упрощенная структура, вместо того чтобы указывать разрешения отдельно для каждого пользователя
        grants:
          view: [{ "group_name": "marketing-team" }]
          run: [{ "user_name": "other_user@example.com" }]
          manage: []
```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.8">
## Инкрементальные модели

Плагин dbt-databricks сильно полагается на конфигурацию [`incremental_strategy` config](/docs/build/incremental-strategy). Эта конфигурация указывает инкрементальной материализации, как строить модели в запусках после первого. Она может быть установлена на одно из четырех значений:
 - **`append`**: Вставить новые записи без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Если указано `partition_by`, перезаписать партиции в <Term id="table" /> новыми данными. Если `partition_by` не указано, перезаписать всю таблицу новыми данными.
 - **`merge`** (по умолчанию; только для формата файлов Delta и Hudi): Сопоставить записи на основе `unique_key`, обновляя старые записи и вставляя новые. (Если `unique_key` не указан, все новые данные вставляются, аналогично `append`.)
 - **`replace_where`** (только для формата файлов Delta): Сопоставить записи на основе `incremental_predicates`, заменяя все записи, которые соответствуют предикатам из существующей таблицы, записями, соответствующими предикатам из новых данных. (Если `incremental_predicates` не указаны, все новые данные вставляются, аналогично `append`.)
 
Каждая из этих стратегий имеет свои плюсы и минусы, которые мы обсудим ниже. Как и с любой конфигурацией модели, `incremental_strategy` может быть указана в `dbt_project.yml` или в блоке `config()` файла модели.

</VersionBlock>

<VersionBlock firstVersion="1.9">

## Инкрементальные модели

Плагин dbt-databricks сильно полагается на конфигурацию [`incremental_strategy` config](/docs/build/incremental-strategy). Эта конфигурация указывает инкрементальной материализации, как строить модели в запусках после первого. Она может быть установлена на одно из пяти значений:
 - **`append`**: Вставить новые записи без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Если указано `partition_by`, перезаписать партиции в <Term id="table" /> новыми данными. Если `partition_by` не указано, перезаписать всю таблицу новыми данными.
 - **`merge`** (по умолчанию; только для формата файлов Delta и Hudi): Сопоставить записи на основе `unique_key`, обновляя старые записи и вставляя новые. (Если `unique_key` не указан, все новые данные вставляются, аналогично `append`.)
 - **`replace_where`** (только для формата файлов Delta): Сопоставить записи на основе `incremental_predicates`, заменяя все записи, которые соответствуют предикатам из существующей таблицы, записями, соответствующими предикатам из новых данных. (Если `incremental_predicates` не указаны, все новые данные вставляются, аналогично `append`.)
 - **`microbatch`** (только для формата файлов Delta): Реализует [стратегию микропакетов](/docs/build/incremental-microbatch) с использованием `replace_where` с предикатами, сгенерированными на основе `event_time`.
 
Каждая из этих стратегий имеет свои плюсы и минусы, которые мы обсудим ниже. Как и с любой конфигурацией модели, `incremental_strategy` может быть указана в `dbt_project.yml` или в блоке `config()` файла модели.

</VersionBlock>

### Стратегия `append`

Следуя стратегии `append`, dbt выполнит оператор `insert into` со всеми новыми данными. Привлекательность этой стратегии заключается в том, что она проста и функциональна на всех платформах, типах файлов, методах подключения и версиях Apache Spark. Однако эта стратегия _не может_ обновлять, перезаписывать или удалять существующие данные, поэтому она, вероятно, вставит дублирующиеся записи для многих источников данных.

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

:::caution
Эта стратегия в настоящее время совместима только с кластерами общего назначения, а не с SQL-складом.
:::

Эта стратегия наиболее эффективна, когда она указана вместе с оператором `partition_by` в конфигурации вашей модели. dbt выполнит [атомарный оператор `insert overwrite`](https://spark.apache.org/docs/3.0.0-preview/sql-ref-syntax-dml-insert-overwrite-table.html), который динамически заменяет все партиции, включенные в ваш запрос. Обязательно повторно выберите _все_ соответствующие данные для партиции при использовании этой инкрементальной стратегии.

Если `partition_by` не указано, то стратегия `insert_overwrite` атомарно заменит все содержимое таблицы, перезаписывая все существующие данные только новыми записями. Однако схема столбцов таблицы остается прежней. Это может быть желаемо в некоторых ограниченных обстоятельствах, поскольку это минимизирует время простоя во время перезаписи содержимого таблицы. Операция сопоставима с выполнением `truncate` + `insert` в других базах данных. Для атомарной замены таблиц в формате Delta используйте материализацию `table` (которая выполняет `create or replace`) вместо этого.

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
  Каждая партиция, возвращаемая этим запросом, будет перезаписана
  когда эта модель будет запущена
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

Стратегия инкрементирования `merge` требует:
- `file_format: delta or hudi`
- Databricks Runtime 5.1 и выше для формата файлов delta
- Apache Spark для формата файлов hudi

Адаптер Databricks выполнит [атомарный оператор `merge`](https://docs.databricks.com/spark/latest/spark-sql/language-manual/merge-into.html), аналогичный поведению по умолчанию для слияния в Snowflake и BigQuery. Если указан `unique_key` (рекомендуется), dbt обновит старые записи значениями из новых записей, которые совпадают по ключевому столбцу. Если `unique_key` не указан, dbt не будет использовать критерии совпадения и просто вставит все новые записи (аналогично стратегии `append`).

Указание `merge` в качестве стратегии инкрементирования является необязательным, так как это стратегия по умолчанию, используемая, когда ничего не указано.

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

<VersionBlock firstVersion="1.9">

Начиная с версии 1.9, поведение `merge` можно изменить с помощью следующих дополнительных параметров конфигурации:

- `target_alias`, `source_alias`: Псевдонимы для цели и источника, чтобы вы могли более естественно описывать свои условия слияния. По умолчанию они равны `DBT_INTERNAL_DEST` и `DBT_INTERNAL_SOURCE`, соответственно.
- `skip_matched_step`: Если установлено в `true`, в операторе слияния не будет включен раздел 'matched'.
- `skip_not_matched_step`: Если установлено в `true`, в операторе слияния не будет включен раздел 'not matched'.
- `matched_condition`: Условие, которое применяется к разделу `WHEN MATCHED`. Вы должны использовать `target_alias` и `source_alias`, чтобы написать условное выражение, например `DBT_INTERNAL_DEST.col1 = hash(DBT_INTERNAL_SOURCE.col2, DBT_INTERNAL_SOURCE.col3)`. Это условие дополнительно ограничивает совпадающий набор строк.
- `not_matched_condition`: Условие, которое применяется к разделу `WHEN NOT MATCHED [BY TARGET]`. Это условие дополнительно ограничивает набор строк в цели, которые не совпадают с источником, которые будут вставлены в объединенную таблицу.
- `not_matched_by_source_condition`: Условие, которое применяется к дальнейшему фильтру `WHEN NOT MATCHED BY SOURCE`. Используется только в сочетании с `not_matched_by_source_action: delete`.
- `not_matched_by_source_action`: Если установлено в `delete`, в оператор слияния добавляется оператор `DELETE` для `WHEN NOT MATCHED BY SOURCE`.
- `merge_with_schema_evolution`: Если установлено в `true`, оператор слияния включает раздел `WITH SCHEMA EVOLUTION`.

Для получения дополнительной информации о значении каждого раздела слияния, пожалуйста, смотрите [документацию Databricks](https://docs.databricks.com/en/sql/language-manual/delta-merge-into.html).

Следующий пример демонстрирует использование этих новых опций:

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

</VersionBlock>

### Стратегия `replace_where`

Стратегия инкрементирования `replace_where` требует:
- `file_format: delta`
- Databricks Runtime 12.0 и выше

dbt выполнит [атомарный оператор `replace where`](https://docs.databricks.com/en/delta/selective-overwrite.html#arbitrary-selective-overwrite-with-replacewhere), который выборочно перезаписывает данные, соответствующие одному или нескольким `incremental_predicates`, указанным в виде строки или массива. Только строки, соответствующие предикатам, будут вставлены. Если `incremental_predicates` не указаны, dbt выполнит атомарную вставку, как в случае с `append`.  

:::caution

`replace_where` вставляет данные в столбцы в порядке, указанном в запросе, а не по имени столбца. Если вы измените порядок столбцов, и данные совместимы с существующей схемой, вы можете незаметно вставить значения в неожиданный столбец. Если входящие данные несовместимы с существующей схемой, вы получите ошибку.

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
    incremental_strategy = 'replace_where',
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

<VersionBlock firstVersion="1.9">

### Стратегия `microbatch`

Адаптер Databricks реализует стратегию `microbatch` с использованием `replace_where`. Обратите внимание на требования и предостережения для `replace_where`, указанные выше. Для получения дополнительной информации об этой стратегии смотрите [страницу справки по микропакетам](/docs/build/incremental-microbatch).

В следующем примере исходная таблица `events` была аннотирована с помощью столбца `event_time`, называемого `ts`, в ее файле схемы.

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
    incremental_strategy = 'microbatch',
    event_time='date' # Используйте 'date' в качестве зерна для этой таблицы микропакетов
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

</VersionBlock>


## Выбор вычислений для каждой модели

Начиная с версии 1.7.2, вы можете назначить, какой вычислительный ресурс использовать для каждой модели.
Для SQL моделей вы можете выбрать SQL Warehouse (серверный или выделенный) или кластер общего назначения.
Для получения подробной информации о том, как эта функция взаимодействует с моделями Python, смотрите [Указание вычислений для моделей Python](#specifying-compute-for-python-models).

:::note

Это необязательная настройка. Если вы не настроите это, как показано ниже, мы по умолчанию будем использовать вычисления, указанные в http_path в верхнем уровне секции вывода в вашем профиле. Это также вычисления, которые будут использоваться для задач, не связанных с конкретной моделью, таких как сбор метаданных для всех таблиц в схеме.

:::


Чтобы воспользоваться этой возможностью, вам нужно будет добавить блоки вычислений в ваш профиль:

<File name='profile.yml'>

```yaml

profile-name:
  target: target-name # это целевой по умолчанию
  outputs:
    target-name:
      type: databricks
      catalog: необязательное имя каталога, если вы используете Unity Catalog
      schema: имя схемы # Обязательно        
      host: yourorg.databrickshost.com # Обязательно

      ### Этот путь используется в качестве вычислений по умолчанию
      http_path: /sql/your/http/path # Обязательно        
      
      ### Новый раздел вычислений
      compute:

        ### Имя, которое вы будете использовать для ссылки на альтернативные вычисления
       Compute1:
          http_path: '/sql/your/http/path' # Обязательно для каждого альтернативного вычисления

        ### Третьи вычисления, используйте любое имя, которое вам нравится
        Compute2:
          http_path: '/some/other/path' # Обязательно для каждого альтернативного вычисления
      ...

    target-name: # дополнительные цели
      ...
      ### Для каждой цели вам нужно определить те же вычисления,
      ### но вы можете указать разные пути
      compute:

        ### Имя, которое вы будете использовать для ссылки на альтернативные вычисления
        Compute1:
          http_path: '/sql/your/http/path' # Обязательно для каждого альтернативного вычисления

        ### Третьи вычисления, используйте любое имя, которое вам нравится
        Compute2:
          http_path: '/some/other/path' # Обязательно для каждого альтернативного вычисления
      ...

```

</File>

Новый раздел вычислений представляет собой карту имен, выбранных пользователем, к объектам с свойством http_path.
Каждое вычисление имеет ключ, который используется в определении/конфигурации модели, чтобы указать, какие вычисления вы хотите использовать для этой модели/выбора моделей. 
Мы рекомендуем выбирать имя, которое легко распознается как ресурсы вычислений, которые вы используете, например, имя ресурса вычислений в интерфейсе Databricks. 

:::note

Вам нужно использовать один и тот же набор имен для вычислений в разных выходах, хотя вы можете предоставить разные http_paths, что позволяет использовать разные вычисления в разных сценариях развертывания.

:::

Чтобы настроить это в dbt Cloud, используйте функцию [расширенных атрибутов](/docs/dbt-cloud-environments#extended-attributes-) для желаемых окружений:

```yaml

compute:
  Compute1:
    http_path: /SOME/OTHER/PATH
  Compute2:
    http_path: /SOME/OTHER/PATH

```

### Указание вычислений для моделей

Как и с многими другими параметрами конфигурации, вы можете указать вычисления для модели несколькими способами, используя `databricks_compute`.
В вашем `dbt_project.yml` выбранные вычисления могут быть указаны для всех моделей в данной директории:

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

Для отдельной модели вычисления могут быть указаны в конфигурации модели в вашем файле схемы.

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


Или склад может быть указан в блоке конфигурации SQL файла модели.

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


Чтобы проверить, что указанные вычисления используются, ищите строки в вашем dbt.log, такие как:

```
Адаптер Databricks ... использует вычислительный ресурс по умолчанию.
```

или

```
Адаптер Databricks ... использует вычислительный ресурс <имя вычисления>.
```

### Указание вычислений для моделей Python

Материализация модели Python требует выполнения SQL, а также Python.
В частности, если ваша модель Python инкрементальная, текущий шаблон выполнения включает выполнение Python для создания промежуточной таблицы, которая затем объединяется с вашей целевой таблицей с использованием SQL.
<VersionBlock lastVersion="1.8">
Код Python должен выполняться на кластере общего назначения, в то время как SQL код может выполняться на кластере общего назначения или SQL Warehouse.
</VersionBlock>
<VersionBlock firstVersion="1.9">
Код Python должен выполняться на кластере общего назначения (или серверном кластере, см. [Методы отправки Python](#python-submission-methods)), в то время как SQL код может выполняться на кластере общего назначения или SQL Warehouse.
</VersionBlock>
Когда вы указываете свой `databricks_compute` для модели Python, вы в настоящее время указываете только, какие вычисления использовать при выполнении SQL, специфичного для модели.
Если вы хотите использовать другие вычисления для выполнения самого Python, вам нужно указать альтернативные вычисления в конфигурации модели.
Например:

<File name="model.py">

 ```python

def model(dbt, session):
    dbt.config(
      http_path="sql/protocolv1/..."
    )

```

</File>

Если ваши вычисления по умолчанию — это SQL Warehouse, вам нужно будет указать http_path к кластеру общего назначения таким образом.

## Сохранение описаний моделей

Поддержка сохранения документации на уровне отношений доступна в dbt v0.17.0. Для получения дополнительной информации о настройке сохранения документации смотрите [документацию](/reference/resource-configs/persist_docs).

Когда параметр `persist_docs` настроен соответствующим образом, вы сможете видеть описания моделей в поле `Comment` команды `describe [table] extended` или `show table extended in [database] like '*'`.


## Конфигурации формата файла по умолчанию

Чтобы получить доступ к функциям расширенных стратегий инкрементирования, таким как 
[снимки](/reference/commands/snapshot) и стратегия инкрементирования `merge`, вы захотите
использовать формат файла Delta или Hudi в качестве формата файла по умолчанию при материализации моделей как таблиц.

Это довольно удобно сделать, установив конфигурацию верхнего уровня в вашем
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

<VersionBlock lastVersion="1.7">

## Материализованные представления и потоковые таблицы
Начиная с версии 1.6.0, адаптер dbt-databricks поддерживает [материализованные представления](https://docs.databricks.com/en/sql/user/materialized-views.html) и [потоковые таблицы](https://docs.databricks.com/en/sql/load-data-streaming-table.html) в качестве альтернатив инкрементальным таблицам, которые поддерживаются [Delta Live Tables](https://docs.databricks.com/en/delta-live-tables/index.html).
Смотрите [Что такое Delta Live Tables?](https://docs.databricks.com/en/delta-live-tables/index.html#what-are-delta-live-tables-datasets) для получения дополнительной информации и примеров использования.
Эти функции все еще находятся в предварительном просмотре, и поддержку в адаптере dbt-databricks следует на данный момент считать _экспериментальной_.
Чтобы использовать эти стратегии материализации, вам потребуется рабочая область, включенная для Unity Catalog и серверных SQL Warehouse.

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

Когда dbt обнаруживает существующее отношение одного из этих типов, он выполняет команду `REFRESH` [command](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-refresh-full.html).

### Ограничения

Как упоминалось выше, поддержка этих материализаций в адаптере Databricks все еще ограничена.
В настоящее время следующие параметры конфигурации недоступны:

* Указание расписания обновления для этих материализаций
* Указание параметров `on_configuration_change`.

Кроме того, если вы измените определение модели вашего материализованного представления или потоковой таблицы, вам нужно будет удалить материализацию непосредственно в вашем складе перед повторным запуском dbt; в противном случае вы получите ошибку обновления.

Пожалуйста, смотрите последнюю документацию для получения обновлений по этим ограничениям.

</VersionBlock>

<VersionBlock firstVersion="1.8">

 ## Материализованные представления и потоковые таблицы

[Материализованные представления](https://docs.databricks.com/en/sql/user/materialized-views.html) и [потоковые таблицы](https://docs.databricks.com/en/sql/load-data-streaming-table.html) являются альтернативами инкрементальным таблицам, которые поддерживаются [Delta Live Tables](https://docs.databricks.com/en/delta-live-tables/index.html).
Смотрите [Что такое Delta Live Tables?](https://docs.databricks.com/en/delta-live-tables/index.html#what-are-delta-live-tables-datasets) для получения дополнительной информации и примеров использования.

Чтобы использовать эти стратегии материализации, вам потребуется рабочая область, включенная для Unity Catalog и серверных SQL Warehouse.

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

Мы поддерживаем [on_configuration_change](https://docs.getdbt.com/reference/resource-configs/on_configuration_change) для большинства доступных свойств этих материализаций.
Следующая таблица обобщает нашу поддержку конфигурации:

| Концепция Databricks | Имя конфигурации | Поддержка MV/ST |
| --------------------- | ---------------- | ---------------- |
| [PARTITIONED BY](https://docs.databricks.com/en/sql/language-manual/sql-ref-partition.html#partitioned-by) | `partition_by` | MV/ST |
| COMMENT | [`description`](https://docs.getdbt.com/reference/resource-properties/description) | MV/ST |
| [TBLPROPERTIES](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html#tblproperties) | `tblproperties` | MV/ST |
| [SCHEDULE CRON](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view.html#parameters) | `schedule: { 'cron': '\<cron schedule\>', 'time_zone_value': '\<time zone value\>' }` | MV/ST |
| query | определяется вашим SQL запросом модели | on_configuration_change только для MV |

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

#### description
Как и для представлений и таблиц, добавление `description` к вашей конфигурации приведет к добавлению комментария на уровне таблицы к вашей материализации.

#### tblproperties
`tblproperties` работает так же, как для представлений и таблиц с важным исключением: адаптер поддерживает список ключей, которые устанавливаются Databricks при создании материализованного представления или потоковой таблицы, которые игнорируются для целей определения изменений конфигурации.

#### schedule
Используйте это, чтобы установить расписание обновления для модели. Если вы используете ключ `schedule`, ключ `cron` обязателен в связанной словарной структуре, но `time_zone_value` является необязательным (см. пример выше). Значение `cron` должно быть отформатировано в соответствии с документацией Databricks.
Если расписание установлено на материализацию в Databricks, а ваш проект dbt не указывает расписание для него (когда `on_configuration_change` установлено в `apply`), расписание обновления будет установлено на ручное при следующем запуске проекта.
Даже когда расписания установлены, dbt будет запрашивать, чтобы материализация была обновлена вручную при запуске.

#### query
Для материализованных представлений, если скомпилированный запрос для модели отличается от запроса в базе данных, мы примем действие, настроенное в `on_configuration_change`.
Изменения в запросе в настоящее время не обнаруживаются для потоковых таблиц; смотрите следующий раздел для получения подробностей.

### on_configuration_change 
`on_configuration_change` поддерживается для материализованных представлений и потоковых таблиц, хотя две материализации обрабатывают это по-разному.

#### Материализованные представления
В настоящее время единственное изменение, которое можно применить без воссоздания материализованного представления в Databricks, — это обновление расписания.
Это связано с ограничениями в SQL API Databricks.

#### Потоковые таблицы
Для потоковых таблиц только изменения в разбиении в настоящее время требуют, чтобы таблица была удалена и воссоздана.
Для любых других поддерживаемых изменений конфигурации мы используем `CREATE OR REFRESH` (+ оператор `ALTER` для изменений расписания), чтобы применить изменения.
В настоящее время нет механизма для адаптера, чтобы обнаружить, изменился ли запрос потоковой таблицы, поэтому в этом случае, независимо от поведения, запрашиваемого `on_configuration_change`, мы будем использовать оператор `create or refresh` (при условии, что `partitioned by` не изменился); это приведет к тому, что запрос будет применен к будущим строкам без повторной обработки любых ранее обработанных строк.
Если ваши исходные данные все еще доступны, запуск с '--full-refresh' повторно обработает доступные данные с обновленным текущим запросом.

</VersionBlock>

## Установка свойств таблицы
[Свойства таблицы](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html) могут быть установлены с вашей конфигурацией для таблиц или представлений с использованием `tblproperties`:

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

Эти свойства отправляются непосредственно в Databricks без проверки в dbt, поэтому будьте внимательны с тем, как вы используете эту функцию. Вам нужно будет выполнить полное обновление инкрементальных материализаций, если вы измените их `tblproperties`.

:::

Одно из применений этой функции — сделать таблицы `delta` совместимыми с читателями `iceberg`, используя [Универсальный формат](https://docs.databricks.com/en/delta/uniform.html).

```sql
{{ config(
    tblproperties={
      'delta.enableIcebergCompatV2' = 'true',
      'delta.universalFormat.enabledFormats' = 'iceberg'
    }
 ) }}
```

`tblproperties` могут быть указаны для моделей Python, но они будут применены через оператор `ALTER` после создания таблицы.
Это связано с ограничением в PySpark.