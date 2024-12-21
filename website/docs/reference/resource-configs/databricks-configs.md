---
title: "Конфигурации Databricks"
id: "databricks-configs"
---

## Конфигурация таблиц

При материализации модели как `table`, вы можете включить несколько дополнительных конфигураций, специфичных для плагина dbt-databricks, в дополнение к стандартным [конфигурациям моделей](/reference/model-configs).

<VersionBlock lastVersion="1.7">

| Опция               | Описание                                                                                                                                                                                                 | Обязательна?                              | Поддержка моделей | Пример                  |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|-------------------|--------------------------|
| file_format         | Формат файла, используемый при создании таблиц (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` или `libsvm`).                                                                 | Необязательно                             | SQL, Python       | `delta`                  |
| location_root       | Созданная таблица использует указанный каталог для хранения своих данных. К нему добавляется псевдоним таблицы.                                                                                          | Необязательно                             | SQL, Python       | `/mnt/root`              |
| partition_by        | Разделение созданной таблицы по указанным столбцам. Для каждого раздела создается каталог.                                                                                                               | Необязательно                             | SQL, Python       | `date_day`               |
| liquid_clustered_by | Кластеризация созданной таблицы по указанным столбцам. Метод кластеризации основан на [функции Liquid Clustering Delta](https://docs.databricks.com/en/delta/clustering.html). Доступно с dbt-databricks 1.6.2. | Необязательно                             | SQL               | `date_day`               |
| clustered_by        | Каждый раздел в созданной таблице будет разделен на фиксированное количество корзин по указанным столбцам.                                                                                               | Необязательно                             | SQL, Python       | `country_code`           |
| buckets             | Количество корзин, создаваемых при кластеризации                                                                                                                                                        | Обязательно, если указано `clustered_by` | SQL, Python       | `8`                      |
| tblproperties       | [Tblproperties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html), которые будут установлены на созданной таблице                                                | Необязательно                             | SQL, Python*      | `{'this.is.my.key': 12}` |
| compression         | Установить алгоритм сжатия.                                                                                                                                                                              | Необязательно                             | SQL, Python       | `zstd`                   |

\* Начиная с версии 1.7.12, мы добавили tblproperties в модели Python через оператор alter, который выполняется после создания таблицы.
У нас пока нет API PySpark для установки tblproperties при создании таблицы, поэтому эта функция в основном предназначена для того, чтобы пользователи могли аннотировать свои таблицы, созданные на основе Python, с помощью tblproperties.

</VersionBlock>

<VersionBlock firstVersion="1.8" lastVersion="1.8">

Версия 1.8 вводит поддержку [Тегов](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) на уровне таблицы, в дополнение ко всем конфигурациям таблицы, поддерживаемым в версии 1.7.

| Опция               | Описание                                                                                                                                                                                                 | Обязательна?                              | Поддержка моделей | Пример                  |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|-------------------|--------------------------|
| file_format         | Формат файла, используемый при создании таблиц (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` или `libsvm`).                                                                 | Необязательно                             | SQL, Python       | `delta`                  |
| location_root       | Созданная таблица использует указанный каталог для хранения своих данных. К нему добавляется псевдоним таблицы.                                                                                          | Необязательно                             | SQL, Python       | `/mnt/root`              |
| partition_by        | Разделение созданной таблицы по указанным столбцам. Для каждого раздела создается каталог.                                                                                                               | Необязательно                             | SQL, Python       | `date_day`               |
| liquid_clustered_by | Кластеризация созданной таблицы по указанным столбцам. Метод кластеризации основан на [функции Liquid Clustering Delta](https://docs.databricks.com/en/delta/clustering.html). Доступно с dbt-databricks 1.6.2. | Необязательно                             | SQL, Python       | `date_day`               |
| clustered_by        | Каждый раздел в созданной таблице будет разделен на фиксированное количество корзин по указанным столбцам.                                                                                               | Необязательно                             | SQL, Python       | `country_code`           |
| buckets             | Количество корзин, создаваемых при кластеризации                                                                                                                                                        | Обязательно, если указано `clustered_by` | SQL, Python       | `8`                      |
| tblproperties       | [Tblproperties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html), которые будут установлены на созданной таблице                                                | Необязательно                             | SQL, Python*      | `{'this.is.my.key': 12}` |
| databricks_tags     | [Теги](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html), которые будут установлены на созданной таблице                                                                           | Необязательно                             | SQL+, Python+     | `{'my_tag': 'my_value'}`  |
| compression         | Установить алгоритм сжатия.                                                                                                                                                                              | Необязательно                             | SQL, Python       | `zstd`                   |

\* Начиная с версии 1.7.12, мы добавили tblproperties в модели Python через оператор alter, который выполняется после создания таблицы.
У нас пока нет API PySpark для установки tblproperties при создании таблицы, поэтому эта функция в основном предназначена для того, чтобы пользователи могли аннотировать свои таблицы, созданные на основе Python, с помощью tblproperties.

\+ `databricks_tags` в настоящее время поддерживаются только на уровне таблицы и применяются через операторы `ALTER`.

</VersionBlock>

<VersionBlock firstVersion="1.9">

dbt-databricks v1.9 добавляет поддержку конфигурации `table_format: iceberg`. Попробуйте это сейчас на [dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks). Все остальные конфигурации таблиц также поддерживались в версии 1.8.

| Опция               | Описание                 | Обязательна?                              | Поддержка моделей   | Пример                  |
|---------------------|-----------------------------|-------------------------------------------|---------------------|--------------------------|
| table_format        | Предоставить ли совместимость с [Iceberg](https://docs.databricks.com/en/delta/uniform.html) для материализации                                                                                     | Необязательно                             | SQL, Python         | `iceberg`                |
| file_format+        | Формат файла, используемый при создании таблиц (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` или `libsvm`).                                                                 | Необязательно                             | SQL, Python         | `delta`                  |
| location_root       | Созданная таблица использует указанный каталог для хранения своих данных. К нему добавляется псевдоним таблицы.                                                                                          | Необязательно                             | SQL, Python         | `/mnt/root`              |
| partition_by        | Разделение созданной таблицы по указанным столбцам. Для каждого раздела создается каталог.                                                                                                               | Необязательно                             | SQL, Python         | `date_day`               |
| liquid_clustered_by | Кластеризация созданной таблицы по указанным столбцам. Метод кластеризации основан на [функции Liquid Clustering Delta](https://docs.databricks.com/en/delta/clustering.html). Доступно с dbt-databricks 1.6.2. | Необязательно          | SQL, Python     | `date_day` |
| clustered_by        | Каждый раздел в созданной таблице будет разделен на фиксированное количество корзин по указанным столбцам.                                                                                               | Необязательно                             | SQL, Python         | `country_code`           |
| buckets             | Количество корзин, создаваемых при кластеризации                                                                                                                                                        | Обязательно, если указано `clustered_by` | SQL, Python         | `8`                      |
| tblproperties       | [Tblproperties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html), которые будут установлены на созданной таблице                                                | Необязательно                             | SQL, Python*        | `{'this.is.my.key': 12}` |
| databricks_tags     | [Теги](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html), которые будут установлены на созданной таблице                                                                           | Необязательно                             | SQL++, Python++     | `{'my_tag': 'my_value'}` |
| compression         | Установить алгоритм сжатия.                                                                                                                                                                              | Необязательно                             | SQL, Python         | `zstd`                   |

\* У нас пока нет API PySpark для установки tblproperties при создании таблицы, поэтому эта функция в основном предназначена для того, чтобы пользователи могли аннотировать свои таблицы, созданные на основе Python, с помощью tblproperties.
\+ Когда `table_format` равно `iceberg`, `file_format` должен быть `delta`.
\++ `databricks_tags` в настоящее время поддерживаются только на уровне таблицы и применяются через операторы `ALTER`.

</VersionBlock>

<VersionBlock firstVersion="1.9">

### Методы отправки Python

В dbt-databricks v1.9 (попробуйте это сейчас в [dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks)), вы можете использовать эти четыре опции для `submission_method`: 

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

</VersionBlock>

<VersionBlock lastVersion="1.8">
## Инкрементальные модели

Плагин dbt-databricks сильно опирается на конфигурацию [`incremental_strategy`](/docs/build/incremental-strategy). Эта конфигурация указывает, как инкрементальная материализация должна строить модели в запусках после первого. Она может быть установлена на одно из четырех значений:
 - **`append`**: Вставка новых записей без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Если указано `partition_by`, перезаписать разделы в <Term id="table" /> новыми данными. Если `partition_by` не указано, перезаписать всю таблицу новыми данными.
 - **`merge`** (по умолчанию; только форматы файлов Delta и Hudi): Сопоставление записей на основе `unique_key`, обновление старых записей и вставка новых. (Если `unique_key` не указан, все новые данные вставляются, аналогично `append`.)
 - **`replace_where`** (только формат файла Delta): Сопоставление записей на основе `incremental_predicates`, замена всех записей, соответствующих предикатам из существующей таблицы, на записи, соответствующие предикатам из новых данных. (Если `incremental_predicates` не указаны, все новые данные вставляются, аналогично `append`.)
 
Каждая из этих стратегий имеет свои плюсы и минусы, которые мы обсудим ниже. Как и в случае любой конфигурации модели, `incremental_strategy` может быть указана в `dbt_project.yml` или в блоке `config()` файла модели.

</VersionBlock>

<VersionBlock firstVersion="1.9">

## Инкрементальные модели

Плагин dbt-databricks сильно опирается на конфигурацию [`incremental_strategy`](/docs/build/incremental-strategy). Эта конфигурация указывает, как инкрементальная материализация должна строить модели в запусках после первого. Она может быть установлена на одно из пяти значений:
 - **`append`**: Вставка новых записей без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Если указано `partition_by`, перезаписать разделы в <Term id="table" /> новыми данными. Если `partition_by` не указано, перезаписать всю таблицу новыми данными.
 - **`merge`** (по умолчанию; только форматы файлов Delta и Hudi): Сопоставление записей на основе `unique_key`, обновление старых записей и вставка новых. (Если `unique_key` не указан, все новые данные вставляются, аналогично `append`.)
 - **`replace_where`** (только формат файла Delta): Сопоставление записей на основе `incremental_predicates`, замена всех записей, соответствующих предикатам из существующей таблицы, на записи, соответствующие предикатам из новых данных. (Если `incremental_predicates` не указаны, все новые данные вставляются, аналогично `append`.)
 - **`microbatch`** (только формат файла Delta): Реализует [стратегию микропакетов](/docs/build/incremental-microbatch) с использованием `replace_where` с предикатами, сгенерированными на основе `event_time`.
 
Каждая из этих стратегий имеет свои плюсы и минусы, которые мы обсудим ниже. Как и в случае любой конфигурации модели, `incremental_strategy` может быть указана в `dbt_project.yml` или в блоке `config()` файла модели.

</VersionBlock>

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

:::caution
Эта стратегия в настоящее время совместима только с кластерами общего назначения, а не с SQL-складами.
:::

Эта стратегия наиболее эффективна, когда указана вместе с `partition_by` в конфигурации вашей модели. dbt выполнит [атомарный оператор `insert overwrite`](https://spark.apache.org/docs/3.0.0-preview/sql-ref-syntax-dml-insert-overwrite-table.html), который динамически заменяет все разделы, включенные в ваш запрос. Убедитесь, что вы повторно выбираете _все_ соответствующие данные для раздела при использовании этой инкрементальной стратегии.

Если `partition_by` не указано, то стратегия `insert_overwrite` атомарно заменит все содержимое таблицы, перезаписывая все существующие данные только новыми записями. Однако схема столбцов таблицы остается прежней. Это может быть желательным в некоторых ограниченных случаях, так как минимизирует время простоя при перезаписи содержимого таблицы. Операция сравнима с выполнением `truncate` + `insert` на других базах данных. Для атомарной замены таблиц в формате Delta используйте материализацию `table` (которая выполняет `create or replace`).

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

<VersionBlock firstVersion="1.9">

Начиная с версии 1.9, поведение `merge` может быть изменено с помощью следующих дополнительных опций конфигурации:

- `target_alias`, `source_alias`: Псевдонимы для цели и источника, чтобы вы могли описывать условия слияния более естественно. По умолчанию они равны `DBT_INTERNAL_DEST` и `DBT_INTERNAL_SOURCE`, соответственно.
- `skip_matched_step`: Если установлено в `true`, то условие 'matched' в операторе слияния не будет включено.
- `skip_not_matched_step`: Если установлено в `true`, то условие 'not matched' не будет включено.
- `matched_condition`: Условие, применяемое к условию `WHEN MATCHED`. Вы должны использовать `target_alias` и `source_alias` для написания условного выражения, такого как `DBT_INTERNAL_DEST.col1 = hash(DBT_INTERNAL_SOURCE.col2, DBT_INTERNAL_SOURCE.col3)`. Это условие дополнительно ограничивает совпадающий набор строк.
- `not_matched_condition`: Условие, применяемое к условию `WHEN NOT MATCHED [BY TARGET]`. Это условие дополнительно ограничивает набор строк в цели, которые не совпадают с источником и будут вставлены в объединенную таблицу.
- `not_matched_by_source_condition`: Условие, применяемое к дальнейшему фильтру `WHEN NOT MATCHED BY SOURCE`. Используется только в сочетании с `not_matched_by_source_action: delete`.
- `not_matched_by_source_action`: Если установлено в `delete`, то в оператор слияния добавляется условие `DELETE` для `WHEN NOT MATCHED BY SOURCE`.
- `merge_with_schema_evolution`: Если установлено в `true`, то в оператор слияния включается условие `WITH SCHEMA EVOLUTION`.

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

</VersionBlock>

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

<VersionBlock firstVersion="1.9">

### Стратегия `microbatch`

Адаптер Databricks реализует стратегию `microbatch` с использованием `replace_where`. Обратите внимание на требования и предупреждения для `replace_where`, указанные выше. Для получения дополнительной информации об этой стратегии см. [страницу справки по микропакетам](/docs/build/incremental-microbatch).

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

</VersionBlock>


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

Чтобы настроить это в dbt Cloud, используйте [функцию расширенных атрибутов](/docs/dbt-cloud-environments#extended-attributes-) на нужных средах:

```yaml

compute:
  Compute1:
    http_path: /SOME/OTHER/PATH
  Compute2:
    http_path: /SOME/OTHER/PATH

```

### Указание вычислительных ресурсов для моделей

Как и во многих других опциях конфигурации, вы можете указать вычислительные ресурсы для модели несколькими способами, используя `databricks_compute`.
В вашем `dbt_project.yml` выбранные вычислительные ресурсы могут быть указаны для всех моделей в заданном каталоге:

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


В качестве альтернативы склад может быть указан в блоке конфигурации SQL-файла модели.

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

Материализация модели Python требует выполнения SQL, а также Python.
В частности, если ваша модель Python является инкрементальной, текущий шаблон выполнения включает выполнение Python для создания промежуточной таблицы, которая затем объединяется с вашей целевой таблицей с использованием SQL.
<VersionBlock lastVersion="1.8">
Код Python должен выполняться на кластере общего назначения, в то время как код SQL может выполняться на кластере общего назначения или SQL-складе.
</VersionBlock>
<VersionBlock firstVersion="1.9">
Код Python должен выполняться на кластере общего назначения (или безсерверном кластере, см. [Методы отправки Python](#python-submission-methods)), в то время как код SQL может выполняться на кластере общего назначения или SQL-складе.
</VersionBlock>
Когда вы указываете `databricks_compute` для модели Python, вы в настоящее время указываете только, какой вычислительный ресурс использовать при выполнении SQL, специфичного для модели.
Если вы хотите использовать другой вычислительный ресурс для выполнения самого Python, вы должны указать альтернативный вычислительный ресурс в конфигурации модели.
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

Поддержка сохранения документов на уровне отношений доступна в dbt v0.17.0. Для получения дополнительной информации о настройке сохранения документов см. [документацию](/reference/resource-configs/persist_docs).

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

<VersionBlock lastVersion="1.7">

## Материализованные представления и потоковые таблицы
Начиная с версии 1.6.0, адаптер dbt-databricks поддерживает [материализованные представления](https://docs.databricks.com/en/sql/user/materialized-views.html) и [потоковые таблицы](https://docs.databricks.com/en/sql/load-data-streaming-table.html) в качестве альтернатив инкрементальным таблицам, которые поддерживаются [Delta Live Tables](https://docs.databricks.com/en/delta-live-tables/index.html).
См. [Что такое Delta Live Tables?](https://docs.databricks.com/en/delta-live-tables/index.html#what-are-delta-live-tables-datasets) для получения дополнительной информации и примеров использования.
Эти функции все еще находятся в стадии предварительного просмотра, и поддержка в адаптере dbt-databricks пока должна считаться _экспериментальной_.
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

Когда dbt обнаруживает существующее отношение одного из этих типов, он выдает команду `REFRESH` [command](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-refresh-full.html).

### Ограничения

Как упоминалось выше, поддержка этих материализаций в адаптере Databricks все еще ограничена.
На данный момент следующие опции конфигурации недоступны:

* Указание расписания обновления для этих материализаций
* Указание настроек `on_configuration_change`.

Кроме того, если вы измените определение модели вашего материализованного представления или потоковой таблицы, вам нужно будет удалить материализацию в вашем складе напрямую перед повторным запуском dbt; в противном случае вы получите ошибку обновления.

Пожалуйста, ознакомьтесь с последней документацией для получения обновлений об этих ограничениях.

</VersionBlock>

<VersionBlock firstVersion="1.8">

 ## Материализованные представления и потоковые таблицы

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

Мы поддерживаем [on_configuration_change](https://docs.getdbt.com/reference/resource-configs/on_configuration_change) для большинства доступных свойств этих материализаций.
Следующая таблица резюмирует нашу поддержку конфигурации:

| Концепция Databricks | Имя конфигурации | Поддержка MV/ST |
| ------------------ | ------------| ------------- |
| [PARTITIONED BY](https://docs.databricks.com/en/sql/language-manual/sql-ref-partition.html#partitioned-by) | `partition_by` | MV/ST |
| COMMENT | [`description`](https://docs.getdbt.com/reference/resource-properties/description) | MV/ST |
| [TBLPROPERTIES](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html#tblproperties) | `tblproperties` | MV/ST |
| [SCHEDULE CRON](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view.html#parameters) | `schedule: { 'cron': '\<cron schedule\>', 'time_zone_value': '\<time zone value\>' }` | MV/ST |
| query | определено вашим SQL модели | on_configuration_change только для MV |

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

#### Потоковые таблицы
Для потоковых таблиц только изменения в разделении в настоящее время требуют, чтобы таблица была удалена и воссоздана.
Для любого другого поддерживаемого изменения конфигурации мы используем `CREATE OR REFRESH` (+ оператор `ALTER` для изменений в расписании) для применения изменений.
В настоящее время нет механизма для адаптера, чтобы обнаружить, изменился ли запрос потоковой таблицы, поэтому в этом случае, независимо от поведения, запрашиваемого `on_configuration_change`, мы будем использовать оператор `create or refresh` (предполагая, что `partitioned by` не изменился); это приведет к тому, что запрос будет применяться к будущим строкам без повторного выполнения на любых ранее обработанных строках.
Если ваши исходные данные все еще доступны, запуск с `--full-refresh` повторно обработает доступные данные с обновленным текущим запросом.

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