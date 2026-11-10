---
title: "Настройки Databricks"
description: "Настройте специфичные для Databricks параметры моделей в dbt, включая форматы файлов, свойства таблиц и материализации."
id: "databricks-configs"
tags: ['Databricks', 'dbt v2', 'dbt v1']
---

## Конфигурация таблиц {#configuring-tables}

При материализации модели как `table` вы можете указать несколько необязательных параметров конфигурации, специфичных для плагина dbt-databricks, в дополнение к стандартным [параметрам конфигурации моделей](/reference/model-configs).

В dbt-databricks v1.9 добавлена поддержка параметра конфигурации `table_format: iceberg`. Попробуйте его уже сейчас в [канале выпусков <Constant name="dbt" /> **v1 Latest**](/docs/dbt-versions/dbt-release-tracks). Все остальные параметры конфигурации таблиц также поддерживались в версии 1.8.

dbt-databricks v1.9 добавляет поддержку конфигурации `table_format: iceberg`. Попробуйте уже сейчас в ветке релизов [<Constant name="cloud" /> "Latest"](/docs/dbt-versions/dbt-release-tracks). Все остальные конфигурации таблиц также поддерживались в версии 1.8.

| Параметр    | Описание                                                                                                                                                                                                                                                                                                                              | Обязательный?     | Поддержка моделей   | Пример      |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-----------------|---------------|
| table_format   | Определяет, нужно ли обеспечивать совместимость материализации с [Iceberg](https://docs.databricks.com/en/delta/uniform.html)                                                                                                                                                                                                           | Необязательный     | SQL, Python     | `iceberg`    |
| use_uniform <sup>1</sup>   | Определяет, создает ли dbt управляемую таблицу Iceberg в Unity Catalog (`false`) или таблицу Delta в формате UniForm с поддержкой чтения через Iceberg (`true`), когда `table_format` имеет значение `iceberg`. Подробнее см. в разделе [Поддержка Iceberg в Databricks](/docs/build/iceberg/adapters/databricks-iceberg-support#choose-between-managed-iceberg-and-uniform). | Необязательный | SQL, Python | `true` |
| file_format <sup>2</sup>        | Формат файлов, используемый при создании таблиц (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` или `libsvm`).                                                                                                                                                                                                      | Необязательный     | SQL, Python     | `delta`     |
| location_root       | Созданная таблица использует указанный каталог для хранения своих данных. К пути этого каталога добавляется псевдоним таблицы.                                                                                                                                                                                                                                     | Необязательный  | SQL, Python     | `/mnt/root`  |
| include_full_name_in_path   | Определяет, нужно ли использовать полный путь таблицы для уточнения корневого каталога хранения. Если параметр включен, к пути корневого каталога добавляются база данных, схема и псевдоним таблицы.                                                                                                                                                                            | Необязательный  | SQL, Python     | `true`  |
| partition_by        | Разбивает созданную таблицу на партиции по указанным столбцам. Для каждой партиции создается отдельный каталог.                                                                                                                                                                                                                                         | Необязательный   | SQL, Python     | `date_day`  |
| liquid_clustered_by<sup>3</sup>  | Кластеризует созданную таблицу по указанным столбцам. Метод кластеризации основан на [функции Liquid Clustering в Delta](https://docs.databricks.com/en/delta/clustering.html). Доступен начиная с dbt-databricks 1.6.2.                                                                                                                       | Необязательный          | SQL, Python     | `date_day` |
| auto_liquid_cluster<sup>4</sup> | Созданная таблица [автоматически кластеризуется средствами Databricks](https://docs.databricks.com/aws/en/delta/clustering#automatic-liquid-clustering). Доступен начиная с dbt-databricks 1.10.0                                                                                                                                                    | Необязательный | SQL, Python | `auto_liquid_cluster: true` |
| clustered_by        | Каждая партиция созданной таблицы разбивается на фиксированное количество бакетов по указанным столбцам.                                                                                                                                                                                                                               | Необязательный     | SQL, Python     | `country_code`           |
| buckets    | Количество бакетов, создаваемых при кластеризации                                                                                                                                                                                                                                                                                         | Обязательный, если указан `clustered_by`   | SQL, Python     | `8`        |
| tblproperties   | [Свойства таблицы (Tblproperties)](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html), задаваемые для созданной таблицы                                                                                                                                                                                                 | Необязательный     | SQL, Python<sup>5</sup>    | `{'this.is.my.key': 12}` |
| databricks_tags     | [Теги](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html), задаваемые для созданной таблицы                                                                                                                                                                                                                            | Необязательный    | SQL <sup>6</sup> , Python <sup>6</sup> | `{'my_tag': 'my_value'}` |
| compression   | Задает алгоритм сжатия.                                                                                                                                                                                                                                                                                                           | Необязательный    | SQL, Python     | `zstd`    |
| skip_optimize<sup>7</sup>   | Пропускает операцию `OPTIMIZE` после материализации этой модели, сохраняя `zorder` / `liquid_clustered_by` / `auto_liquid_cluster` в определении таблицы. Доступен начиная с dbt-databricks 1.12.2.                                                                                                                                 | Необязательный    | SQL, Python     | `skip_optimize: true`    |

<sup>1</sup> `use_uniform` применяется только к <Constant name="fusion" />. `dbt-databricks` пока не поддерживает этот параметр &mdash; адаптер записывает предупреждение в журнал и игнорирует значение. В `dbt-databricks` вместо него используйте флаг поведения [`use_managed_iceberg`](/reference/global-configs/databricks-changes#use-managed-iceberg).

<sup>2</sup> Если `table_format` равен `iceberg`, в `dbt-databricks` укажите `file_format: delta`. Это требование относится только к `dbt-databricks`. Управляемые Iceberg-таблицы в <Constant name="fusion" /> используют `parquet`.

<sup>3</sup> При настройке `liquid_clustered_by` адаптер dbt-databricks выполняет `OPTIMIZE` (Liquid Clustering) после каждого запуска. Чтобы отключить операцию, задайте переменную окружения `DATABRICKS_SKIP_OPTIMIZE=true` или передайте параметр в команду `dbt run --vars "{'databricks_skip_optimize': true}"`. См. [задачу #802](https://github.com/databricks/dbt-databricks/issues/802).

<sup>4</sup>  Не используйте `liquid_clustered_by` и `auto_liquid_cluster` в одной модели.

<sup>5</sup> В PySpark пока нет API для задания tblproperties при создании таблицы, поэтому эта функция предназначена прежде всего для того, чтобы пользователи могли добавлять tblproperties к таблицам, созданным с помощью Python.

<sup>6</sup> `databricks_tags` применяются с помощью операторов `ALTER`. После применения теги нельзя удалить через dbt-databricks. Для удаления тегов используйте Databricks напрямую или post-hook. Начиная с `dbt-databricks` v1.12, значения `databricks_tags`, заданные на нескольких уровнях иерархии конфигурации, [объединяются с добавлением значений](#databricks_tags), а не полностью заменяются значениями с нижнего (более конкретного) уровня.

<sup>7</sup> `skip_optimize` позволяет управлять вызовом `OPTIMIZE` после материализации для каждой модели отдельно. Поскольку это стандартный параметр конфигурации модели dbt, его также можно задать на уровне папки или проекта через наследование конфигурации. Переменная `DATABRICKS_SKIP_OPTIMIZE`, действующая на весь запуск, имеет приоритет над `skip_optimize`: если задать `DATABRICKS_SKIP_OPTIMIZE=true` (или `databricks_skip_optimize: true`), переменная отключит `OPTIMIZE` для всех моделей, и повторно включить его для отдельной модели с помощью `skip_optimize: false` будет невозможно. Используйте `skip_optimize`, если хотите оставить `OPTIMIZE` включённым для большинства моделей, но отключить его для отдельных моделей &mdash; например, если вы передаёте выполнение `OPTIMIZE` механизму [Predictive Optimization](https://docs.databricks.com/en/optimizations/predictive-optimization.html) или запускаете его отдельно по расписанию. См. [issue #703](https://github.com/databricks/dbt-databricks/issues/703).


В dbt-databricks v1.10 появилось несколько новых вариантов конфигурации моделей, доступных при включённом флаге `use_materialization_v2`.
Подробнее см. [документацию по флагам поведения Databricks](/reference/global-configs/databricks-changes).

### Методы отправки Python {#python-submission-methods}
_Доступно в версиях 1.9 и выше_

В dbt-databricks v1.9 (попробуйте уже сейчас в [треке релизов <Constant name="dbt" /> **v1 Latest**](/docs/dbt-versions/dbt-release-tracks)) для `submission_method` доступны четыре варианта: 

* `all_purpose_cluster`: выполняет модель Python либо напрямую через [command API](https://docs.databricks.com/api/command-execution/v2/execute), либо загружая блокнот и [создавая одноразовый запуск задания](https://docs.databricks.com/api/jobs/v2/submit-run)
* `job_cluster`: создаёт новый кластер заданий для выполнения загруженного блокнота в рамках одноразового запуска задания
* `serverless_cluster`: использует [бессерверный кластер](https://docs.databricks.com/en/jobs/run-serverless-jobs.html) для выполнения загруженного блокнота в рамках одноразового запуска задания
* `workflow_job`: создаёт или обновляет многократно используемый рабочий процесс и загруженный блокнот для выполнения на универсальных кластерах, кластерах заданий или бессерверных кластерах.
   :::caution 
   Этот подход дает вам максимальную гибкость, но создаст постоянные артефакты в Databricks (рабочий процесс), которые пользователи могут запускать вне dbt.
   :::

В настоящее время мы находимся в переходном периоде, когда существует разрыв между старыми методами отправки (которые были сгруппированы по вычислениям) и логически различными методами отправки (команда, запуск задания, рабочий процесс).

Таким образом, матрица поддерживаемых конфигураций довольно сложна. В столбце **По умолчанию** `[]` означает пустой список, а `{}` — пустой словарь (значения ещё не заданы).

| Параметр              | Назначение                                                           | По умолчанию       | `all_purpose_cluster`* | `job_cluster` | `serverless_cluster` | `workflow_job` |
| --------------------- | -------------------------------------------------------------------- | ------------------ | ---------------------- | ------------- | -------------------- | -------------- |
| `create_notebook`     | если задано false, используется Command API, иначе загружается блокнот и запускается задание | `false`            | ✅                     | ❌             | ❌                   | ❌             |
| `timeout`             | максимальное время ожидания выполнения команды или задания           | `0` (без ограничения времени) | ✅                     | ✅             | ✅                   | ✅             |
| `job_cluster_config`  | настраивает [новый кластер](https://docs.databricks.com/api/workspace/jobs/submit#tasks-new_cluster) для выполнения модели | `{}` | ❌ | ✅ | ❌            | ✅             |
| `access_control_list` | определяет, кто может просматривать [задание](https://docs.databricks.com/api/workspace/jobs/submit#access_control_list) Databricks, выполняющее эту Python-модель, или управлять им | `[]` | ✅ | ✅ | ✅          | ✅             |
| `notebook_access_control_list` | определяет, кто может просматривать, запускать или редактировать [блокнот](https://docs.databricks.com/aws/en/security/auth/access-control/#notebook-acls), который dbt создаёт в Databricks на основе этой Python-модели | `[]` | ✅ | ✅ | ✅ | ✅ |
| `packages`            | список пакетов для установки на кластере, выполняющем модель          | `[]`               | ✅                     | ✅             | ✅                   | ✅             |
| `index_url`           | URL для установки `packages`                                         | `None` (используется pypi) | ✅                     | ✅             | ✅                   | ✅             |
| `additional_libs`     | напрямую настраивает [библиотеки](https://docs.databricks.com/api/workspace/jobs/submit#tasks-libraries) | `[]` | ✅ | ✅             | ✅                   | ✅             |
| `python_job_config`   | дополнительная конфигурация заданий и рабочих процессов (см. таблицу ниже) | `{}`               | ✅                     | ✅             | ✅                   | ✅             |
| `cluster_id`          | идентификатор существующего универсального кластера для выполнения модели | `None`             | ✅                     | ❌             | ❌                   | ✅             |
| `http_path`           | путь к существующему универсальному кластеру для выполнения модели   | `None`             | ✅                     | ❌             | ❌                   | ❌             |

\* Если `create_notebook` имеет значение false, поддерживаются только `timeout` и `cluster_id`/`http_path`. Параметр `notebook_access_control_list` применяется только тогда, когда dbt создаёт блокнот в Databricks.

Когда dbt создаёт блокнот для Python-модели, он копирует код модели в ваше рабочее пространство Databricks и запускает этот блокнот как задание. Исключение — метод отправки `all_purpose_cluster`, который по умолчанию выполняет код непосредственно на универсальном кластере, не создавая блокнот или задание.

Когда dbt создаёт блокнот и задание, вы можете управлять доступом к каждому из них:

- `access_control_list` определяет, кто может просматривать задание или управлять им. Уровни разрешений описаны в разделе [Списки управления доступом к заданиям](https://docs.databricks.com/aws/en/security/auth/access-control/#job-acls).
- `notebook_access_control_list` определяет, кто может открывать блокнот, например для изучения кода после неудачного запуска. Уровни разрешений описаны в разделе [Списки управления доступом к блокнотам](https://docs.databricks.com/aws/en/security/auth/access-control/#notebook-acls).

Рекомендуем использовать названия разрешений, которые ожидает API Databricks, например `CAN_READ`, а не CAN VIEW, как в пользовательском интерфейсе.

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


## Настройка колонок {#configuring-columns}
_Доступно в версиях 1.10 и выше_

При материализации моделей различных типов вы можете указывать несколько необязательных конфигураций на уровне колонок, которые специфичны для плагина dbt-databricks, в дополнение к стандартным [настройкам колонок](/reference/resource-properties/columns). Поддержка тегов колонок и масок колонок была добавлена в dbt-databricks версии 1.10.4.

| Параметр | Описание | Обязательный? | Поддерживаемые модели | Поддерживаемые материализации | Пример |
|-----------|---------------|----------|---------------|----------------------------|----------|
| databricks_tags | [Теги](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) для отдельных столбцов | Нет | SQL†, Python† | Table, Incremental, Materialized View, Streaming Table | `{'data_classification': 'pii'}` |
| column_mask | [Маска столбца](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-column-mask) для динамического маскирования. Принимает `function` и необязательное поле `using_columns`* | Нет | SQL, Python | Table, Incremental, Streaming Table | `{'function': 'my_catalog.my_schema.mask_email'}` |

\* В `using_columns` поддерживаются все типы параметров из раздела [Параметры маски столбца Databricks](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-column-mask#parameters).


† Теги `databricks_tags` применяются через инструкции `ALTER`. После применения их нельзя удалить средствами dbt-databricks. Удалите теги в Databricks или через post-hook. Начиная с `dbt-databricks` v1.12, теги с разных уровней конфигурации [объединяются](#databricks_tags), а более конкретный уровень больше не заменяет весь набор вышестоящего.

В примере используются настройки столбцов из таблицы выше:

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

## Настройка фильтров строк {#setting-row-filters}
_Доступно в версиях 1.12 и выше_

Вы можете задать `row_filter`, чтобы применить к модели [фильтр строк Unity Catalog](https://docs.databricks.com/aws/en/tables/row-and-column-filters), ограничивающий строки, возвращаемые запросом, с помощью SQL UDF. dbt применяет фильтр с помощью предложения `WITH ROW FILTER` при создании отношения и выполняет `ALTER ... SET ROW FILTER` / `ALTER ... DROP ROW FILTER` для добавления, обновления или удаления фильтра при последующих запусках.

`row_filter` — необязательная конфигурация уровня модели. Если вы задаёте её, оба следующих свойства обязательны:

| Свойство   | Описание   | Обязательно?| Пример  |
|------------|---------------|----------|----------|
| function   | UDF для фильтрации строк, которую нужно применить. Укажите либо неквалифицированное имя (dbt дополнит его каталогом и схемой модели), либо полностью квалифицированное имя `catalog.schema.function`. dbt отклоняет имя из двух частей schema.function как неоднозначное. | Да | `region_filter` |
| columns    | Столбцы, передаваемые в качестве аргументов функции фильтрации. Можно указать одну строку или список. Обязательно, если задано свойство `function`. | Да | `[region]` |

Фильтры строк поддерживаются для материализаций `table`, `incremental`, `materialized_view` и `streaming_table`. Они _не_ поддерживаются для обычных представлений и отношений в Hive Metastore. Настройка `row_filter` для любого из этих двух типов объектов вызывает ошибку компиляции.

В этом примере к модели применяется фильтр строк:

<File name='schema.yml'>

```yaml
models:
  - name: orders
    config:
      row_filter:
        function: my_catalog.my_schema.region_filter
        columns: [region]
```

</File>

## Инкрементальные модели {#incremental-models}
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

### Стратегия `append` {#the-append-strategy}

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

### Стратегия `insert_overwrite` {#the-insert_overwrite-strategy}

Стратегия `insert_overwrite` обновляет данные в таблице, **заменяя существующие записи**, а не просто добавляя новые. Эта стратегия наиболее эффективна, когда она указана вместе с параметром `partition_by` или `liquid_clustered_by` в конфигурации модели — это помогает определить конкретные партиции или кластеры, на которые влияет ваш запрос. dbt выполнит [атомарный оператор `insert into ... replace on`](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-dml-insert-into#replace-on), который динамически заменяет все партиции или кластеры, затронутые запросом, вместо перестроения всей таблицы целиком.

**Важно!** При использовании этой инкрементальной стратегии обязательно повторно выбирайте (_re-select_) **все** релевантные данные для соответствующей партиции или кластера.

При использовании `liquid_clustered_by` ключи `replace on` будут совпадать с ключами `liquid_clustered_by` (аналогично поведению `partition_by`).

Если задать для [`use_replace_on_for_insert_overwrite`](/reference/global-configs/databricks-changes#use-replace-on-for-insert_overwrite-strategy) значение `true` (в SQL-хранилищах или при использовании кластерных вычислительных ресурсов), dbt динамически перезаписывает партиции и заменяет только те партиции или кластеры, которые возвращает запрос модели. dbt выполняет [оператор `insert overwrite` с partitionOverwriteMode='dynamic'](https://docs.databricks.com/aws/en/delta/selective-overwrite#dynamic-partition-overwrites-with-partitionoverwritemode-legacyl), что помогает сократить количество ненужных перезаписей и повысить производительность. 

Если задать для [`use_replace_on_for_insert_overwrite`](/reference/global-configs/databricks-changes#use-replace-on-for-insert_overwrite-strategy) значение `false` в SQL-хранилищах, dbt полностью очищает таблицу перед вставкой новых данных. При этом все строки в таблице заменяются при каждом запуске модели, что может увеличить время выполнения и затраты при работе с большими наборами данных

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

### Стратегия `merge` {#the-merge-strategy}

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

### Стратегия `replace_where` {#the-replace_where-strategy}

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

### Стратегия `delete+insert` {#the-deleteinsert-strategy}
 
_Доступно в версиях 1.11 или выше_

Инкрементальная стратегия `delete+insert` требует:
- `file_format: delta`
- Обязательной конфигурации `unique_key`
- Databricks Runtime 12.2 LTS или выше

Стратегия `delete+insert` проще, чем `merge`, когда нужно заменить целые записи вместо обновления отдельных столбцов. Она работает в два шага:

1. **Удаление**: из целевой таблицы удаляются все строки, чей `unique_key` совпадает с ключом в новых данных.
2. **Вставка**: все новые строки из промежуточных данных вставляются в целевую таблицу.

Эта стратегия полезна, если:
- Нужно заменить целые записи, не обновляя отдельные столбцы.
- Бизнес-логика требует сначала удалить, а затем заново вставить запись.
- Для полной замены записей нужна более простая инкрементальная стратегия, чем `merge`.

При использовании Databricks Runtime версии 17.1 или выше dbt применяет эффективный синтаксис [`INSERT INTO ... REPLACE ON`](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-dml-insert-into#replace-on) для атомарного выполнения этой операции. Для более старых версий runtime dbt выполняет отдельные операторы `DELETE` и `INSERT`.

При необходимости вы можете использовать `incremental_predicates`, чтобы дополнительно отфильтровать обрабатываемые записи, получив больший контроль над тем, какие строки удаляются и вставляются.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Выполнение (DBR 17.1+)', value: 'run_new', },
    { label: 'Выполнение (DBR < 17.1)', value: 'run_legacy', },
]
}>
<TabItem value="source">

<File name='delete_insert_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta',
    incremental_strategy='delete+insert',
    unique_key='user_id',
    incremental_predicates='user_id >= 10000' # Never delete/insert users with ids < 10000
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
   from delete_insert_incremental__dbt_tmp where user_id >= 10000) as temp
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
  and user_id >= 10000;

-- Step 2: Insert new rows
insert into analytics.delete_insert_incremental by name
select `user_id`, `last_seen`
from delete_insert_incremental__dbt_tmp
where user_id >= 10000
```

</File>

</TabItem>
</Tabs>


### Стратегия `microbatch` {#the-microbatch-strategy}

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

## Настройка моделей Python {#python-model-configuration}

Адаптер Databricks поддерживает Python-модели. Databricks использует PySpark в качестве фреймворка обработки для этих моделей.

**Методы отправки:** Databricks поддерживает несколько различных механизмов отправки кода PySpark, каждый из которых имеет свои относительные преимущества. Одни лучше подходят для итеративной разработки, другие — для более дешёвых продакшн-развёртываний. Доступны следующие варианты:
- `all_purpose_cluster` (по умолчанию): dbt будет запускать вашу Python-модель, используя идентификатор кластера, настроенный как `cluster` в вашем профиле подключения или для конкретной модели. Эти кластеры дороже, но значительно более отзывчивы. Мы рекомендуем использовать интерактивный all-purpose кластер для более быстрой итерации при разработке.
  - `create_notebook: True`: dbt загрузит скомпилированный PySpark-код вашей модели в ноутбук в пространстве имён `/Shared/dbt_python_model/{schema}`, где `{schema}` — это настроенная схема модели, и выполнит этот ноутбук с использованием all-purpose кластера. Преимущество этого подхода в том, что вы можете легко открыть ноутбук в интерфейсе Databricks для отладки или тонкой настройки сразу после выполнения модели. Не забудьте скопировать все изменения обратно в код вашей dbt-модели `.py` перед повторным запуском.
  - `create_notebook: False` (по умолчанию): dbt будет использовать [Command API](https://docs.databricks.com/dev-tools/api/1.2/index.html#run-a-command), который работает немного быстрее.
- `job_cluster`: dbt загрузит скомпилированный PySpark-код вашей модели в ноутбук в пространстве имён `/Shared/dbt_python_model/{schema}`, где `{schema}` — это настроенная схема модели, и выполнит этот ноутбук, используя краткоживущий jobs-кластер. Для каждой Python-модели Databricks потребуется поднять кластер, выполнить PySpark-трансформацию модели, а затем остановить кластер. Поэтому job-кластеры требуют больше времени до и после выполнения модели, но они также дешевле, поэтому мы рекомендуем их для длительно выполняющихся Python-моделей в продакшене. Чтобы использовать метод отправки `job_cluster`, ваша модель должна быть настроена с `job_cluster_config`, который определяет свойства ключ-значение для `new_cluster`, как описано в [JobRunsSubmit API](https://docs.databricks.com/dev-tools/api/latest/jobs.html#operation/JobsRunsSubmit).
 
Вы можете настроить `submission_method` для каждой модели всеми стандартными способами задания конфигурации:

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

Если конфигурация не задана, `dbt-spark` будет использовать встроенные значения по умолчанию: all-purpose кластер (на основе `cluster` в вашем профиле подключения) без создания ноутбука. Адаптер `dbt-databricks` по умолчанию будет использовать кластер, настроенный в `http_path`. Мы рекомендуем явно настраивать кластеры для Python-моделей в проектах Databricks.
 
**Установка пакетов:** если используются универсальные кластеры, установите на них пакеты, нужные для выполнения моделей Python.

**Связанная документация:**
- [Синтаксис PySpark DataFrame](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)
- [Databricks: Введение в DataFrames — Python](https://docs.databricks.com/spark/latest/dataframes-datasets/introduction-to-dataframes-python.html)
 
## Выбор вычислительных ресурсов для каждой модели {#selecting-compute-per-model}

Начиная с версии 1.7.2, вы можете назначать, какой вычислительный ресурс использовать для каждой модели.
Для SQL-моделей вы можете выбрать SQL Warehouse (безсерверный или предоставленный) или кластер общего назначения.
Для получения подробной информации о том, как эта функция взаимодействует с моделями Python, см. [Указание вычислительных ресурсов для моделей Python](#specifying-compute-for-python-models).

:::note

Это необязательная настройка. Если вы не настроите это, как показано ниже, мы будем использовать вычислительные ресурсы, указанные в http_path в верхнем уровне раздела output в вашем профиле. 
Это также вычислительные ресурсы, которые будут использоваться для задач, не связанных с конкретной моделью, таких как сбор метаданных для всех таблиц в схеме.

:::


Чтобы воспользоваться этой возможностью, вам нужно будет добавить блоки вычислений в ваш профиль:

<File name='profiles.yml'>

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

Чтобы настроить это в <Constant name="dbt" />, используйте [функцию расширенных атрибутов](/docs/dbt-platform-environments#extended-attributes) в нужных окружениях:

```yaml

compute:
  Compute1:
    http_path: /SOME/OTHER/PATH
  Compute2:
    http_path: /SOME/OTHER/PATH

```

### Указание вычислительных ресурсов для моделей {#specifying-the-compute-for-models}

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

### Указание вычислительных ресурсов для моделей Python {#specifying-compute-for-python-models}

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

## Сохранение описаний моделей {#persisting-model-descriptions}

Поддерживается сохранение документации на уровне relation. Для получения дополнительной информации о настройке сохранения документации см. [документацию](/reference/resource-configs/persist_docs).

Когда опция `persist_docs` настроена соответствующим образом, вы сможете
увидеть описания моделей в поле `Comment` команды `describe [table] extended`
или `show table extended in [database] like '*'`.

## Теги запросов {#query-tags}
_Доступно в версиях 1.11 и выше_

[Теги запросов](https://docs.databricks.com/aws/en/sql/user/queries/query-tags) позволяют добавлять к SQL-запросам в Databricks собственные метаданные в виде пар ключ–значение. Они видны в системных таблицах и истории запросов, где помогают отслеживать расходы, отлаживать запросы и проводить аудит.

:::note Доступность функции

Теги запросов могут быть доступны не во всех рабочих областях Databricks. Актуальные сведения см. в [документации Databricks](https://docs.databricks.com/aws/en/sql/user/queries/query-tags).

:::

В dbt-databricks теги запросов можно задать на уровне подключения в профиле и на уровне отдельной модели. При запуске dbt автоматически добавляет теги с метаданными, например именем модели и версией dbt.

### Теги запросов по умолчанию {#default-query-tags}

dbt-databricks автоматически добавляет к каждому запросу следующие теги:

| Ключ тега | Описание |
|---------|-------------|
| `@@dbt_model_name` | Имя выполняемой модели |
| `@@dbt_core_version` | Версия dbt |
| `@@dbt_databricks_version` | Версия dbt-databricks |
| `@@dbt_materialized` | Тип материализации: таблица, представление, инкрементальная и т. д. |

Пользовательские теги не могут переопределить эти зарезервированные ключи.

### Настройка тегов запросов {#configuring-query-tags}

Теги задаются на уровне подключения в профиле или на уровне модели в её настройках. Теги модели имеют приоритет над тегами подключения.

#### Теги запросов на уровне подключения {#connection-level-query-tags}

Чтобы задать теги для всех запросов подключения, добавьте в `profiles.yml` параметр `query_tags` в виде строки JSON:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: my_catalog
      schema: my_schema
      host: yourorg.databrickshost.com
      http_path: /sql/your/http/path
      token: dapiXXXXXXXXXXXXXXXXXXXXXXX
      query_tags: '{"team": "analytics", "project": "customer_360"}'
```

</File>

#### Теги запросов на уровне модели {#model-level-query-tags}

Чтобы задать теги для отдельной модели, используйте настройку `query_tags`:

<File name='models/my_model.sql'>

```sql
{{ config(
    query_tags = {'cost_center': 'marketing', 'priority': 'high'}
) }}

select * from {{ ref('upstream_model') }}
```

</File>

Теги для групп моделей можно задать в `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    marketing:
      +query_tags: {'department': 'marketing'}
    finance:
      +query_tags: {'department': 'finance'}
```

</File>

### Приоритет и объединение тегов {#tag-precedence-and-merging}

Если теги заданы на нескольких уровнях, они объединяются в следующем порядке приоритета:

1. Теги модели из `config()` или `schema.yml`.
2. Теги подключения из `profiles.yml`.
3. Теги по умолчанию, добавленные dbt автоматически.

Если один ключ задан на нескольких уровнях, используется значение с наивысшим приоритетом.

:::note Зачем задавать теги на уровне подключения?

Если задать `query_tags` на уровне модели в `config()` или `schema.yml`, они **заменят** настройки `query_tags` из `dbt_project.yml` целиком. Так dbt обрабатывает параметры конфигурации типа «словарь».

Чтобы обойти это ограничение, задайте `query_tags` в профиле подключения (`profiles.yml`). dbt-databricks объединяет теги подключения с тегами модели. Общие теги можно задать один раз в профиле, а в модели добавить или переопределить нужные ключи.

**Рекомендуемый подход:**
- Задайте общие теги, например команду, проект и среду, в `query_tags` профиля.
- Для тегов отдельной модели используйте `query_tags` на уровне модели.

:::

### Ограничения {#limitations}

- **Не более 20 тегов:** учитываются все теги запросов, включая добавленные по умолчанию.
- **Длина значения:** не более 128 символов. Более длинные значения тегов по умолчанию автоматически обрезаются.
- **Специальные символы:** обратная косая черта (`\`), запятая (`,`) и двоеточие (`:`) в значениях экранируются автоматически. При этом в журнал пишется предупреждение.
- **Зарезервированные ключи:** `@@dbt_model_name`, `@@dbt_core_version`, `@@dbt_databricks_version` и `@@dbt_materialized` нельзя использовать в пользовательских тегах.

### Просмотр тегов запросов {#viewing-query-tags}

Теги запросов отображаются в системных таблицах и истории запросов Databricks. Как запрашивать и анализировать их, описано в [документации Databricks](https://docs.databricks.com/aws/en/sql/user/queries/query-tags).

## Конфигурации формата файлов по умолчанию {#default-file-format-configurations}

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


## Материализованные представления и стриминговые таблицы {#materialized-views-and-streaming-tables}

[Материализованные представления](https://docs.databricks.com/en/sql/user/materialized-views.html) и [потоковые таблицы](https://docs.databricks.com/en/sql/load-data-streaming-table.html) — это альтернативы инкрементальным таблицам, работающие на базе [Delta Live Tables](https://docs.databricks.com/en/delta-live-tables/index.html).

Дополнительную информацию и примеры использования см. в разделе [Что такое Delta Live Tables?](https://docs.databricks.com/en/delta-live-tables/index.html#what-are-delta-live-tables-datasets)

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

Мы поддерживаем [on_configuration_change](/reference/resource-configs/on_configuration_change) для большинства доступных свойств этих материализаций. В следующей таблице приведена сводная информация о поддерживаемых конфигурациях. Подробнее о каждой конфигурации см. в разделе [Сведения о конфигурациях](#configuration-details):

<SimpleTable>

| Концепция Databricks | Имя конфига | Поддержка MV/ST | Версия |
| ------------------- | ------------| --------------- | ------- |
| [PARTITIONED BY](https://docs.databricks.com/en/sql/language-manual/sql-ref-partition.html#partitioned-by) | `partition_by` | MV/ST | Все |
| [CLUSTER BY](https://docs.databricks.com/en/delta/clustering.html) | `liquid_clustered_by` | MV/ST | v1.11+ |
| COMMENT | [`description`](/reference/resource-properties/description) | MV/ST | Все |
| [TBLPROPERTIES](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html#tblproperties) | `tblproperties` | MV/ST | Все |
| [TAGS](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) | `databricks_tags` | MV/ST | v1.11+ |
| [SCHEDULE CRON](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view.html#parameters) | `schedule: { 'cron': '\<cron schedule\>', 'time_zone_value': '\<time zone value\>' }` | MV/ST | Все |
| [SCHEDULE EVERY](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view#parameters) | `schedule: { 'every': '\<n\> \<unit\>' }` | MV/ST | v1.12+ |
| [TRIGGER ON UPDATE](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view#parameters) | `schedule: { 'on_update': true, 'at_most_every': '\<n\> \<unit\>' }` | MV/ST | v1.12+ |
| [WITH ROW FILTER](https://docs.databricks.com/aws/en/tables/row-and-column-filters) | `row_filter` | MV/ST | v1.12+ |
| query | определяется SQL-кодом вашей модели | on_configuration_change только для MV | Все |
</SimpleTable>

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

### Подробности конфигурации {#configuration-details}

#### partition_by {#partition_by}
`partition_by` работает так же, как для представлений и таблиц, т.е. может быть одним столбцом или массивом столбцов для разделения.

#### liquid_clustered_by {#liquidclusteredby}
_Доступно в версиях 1.11 или выше_

`liquid_clustered_by` включает [liquid clustering](https://docs.databricks.com/en/delta/clustering.html) для материализованных представлений и стриминговых таблиц. Liquid clustering оптимизирует производительность запросов за счёт совместного размещения похожих данных в одних и тех же файлах, что особенно полезно для запросов с селективными фильтрами по кластеризованным столбцам.

**Примечание:** Нельзя использовать `partition_by` и `liquid_clustered_by` одновременно в одной материализации, так как Databricks не позволяет комбинировать эти возможности.

#### databricks_tags {#databricks_tags}
_Доступно в версиях 1.11 или выше_

`databricks_tags` позволяет применять [теги Unity Catalog](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) к вашим материализованным представлениям и стриминговым таблицам для управления данными и их организации. Теги представляют собой пары ключ-значение и могут использоваться для классификации данных, политик контроля доступа и управления метаданными.

```sql
{{ config(
    materialized='streaming_table',
    databricks_tags={'pii': 'contains_email', 'team': 'analytics'}
) }}
```

В `dbt-databricks` v1.12+ добавлена поддержка тегов, состоящих только из ключа. Чтобы задать тег с ключом, но без значения, укажите в качестве значения тега пустую строку `''` или `None`:

```sql
{{ config(
    materialized='streaming_table',
    databricks_tags={'sensitive': '', 'reviewed': None}
) }}
```

Это относится к `databricks_tags` как на уровне таблиц, так и на уровне столбцов. Значения, не являющиеся строками, например числа или логические значения, преобразуются в строки.

Теги применяются с помощью операторов `ALTER` после создания материализации. После применения теги нельзя удалить путём изменения конфигурации dbt-databricks. Чтобы удалить теги, необходимо использовать Databricks напрямую или post-hook.

:::caution Изменение поведения в v1.12
Начиная с `dbt-databricks` v1.12.0, конфигурации `databricks_tags` объединяются с сохранением тегов на разных уровнях иерархии конфигурации (например, на уровне проекта и на уровне модели), а не полностью заменяются конфигурациями нижележащих уровней.

Если один и тот же ключ тега определён на нескольких уровнях, приоритет имеет значение с нижележащего уровня. Ключи тегов, определённые только на вышележащих уровнях, сохраняются.

Это поведение действует везде, где можно настроить `databricks_tags`, включая таблицы, столбцы, материализованные представления и потоковые таблицы.
:::

Например, при следующих конфигурациях на уровне проекта и модели:

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    +databricks_tags:
      a: "b"
      c: "project_value"
```

</File>

<File name='models/my_model.sql'>

```sql
{{ config(
    databricks_tags={'c': 'model_value', 'k': 'v'}
) }}
```

</File>

В результате будут применены следующие теги:

- `a: b` — сохранён с уровня проекта
- `c: model_value` — значение на уровне модели переопределяет значение `c` на уровне проекта
- `k: v` — добавлен на уровне модели

#### description
Как и для представлений и таблиц, добавление `description` в конфигурацию приведёт к добавлению комментария на уровне таблицы к вашей материализации.

#### tblproperties {#tblproperties}
`tblproperties` работает так же, как для представлений и таблиц, с важным исключением: адаптер поддерживает список ключей, которые устанавливаются Databricks при создании материализованного представления или потоковой таблицы, которые игнорируются для определения изменений конфигурации.

#### schedule
Задайте расписание обновления модели, используя один из трёх взаимоисключающих режимов:
 
| Режим | Конфигурация | Формат | Версия |
|------|--------|--------|---------|
| `cron` | `schedule: { 'cron': '...', 'time_zone_value': '...' }` | Строка Cron ([формат Databricks](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view#parameters)). Параметр `time_zone_value` необязателен. | Все |
| `every` | `schedule: { 'every': '<n> <unit>' }` | `'<n> <unit>'`, где unit — `HOURS`, `DAYS` или `WEEKS`, например `'2 HOURS'` | v1.12+ |
| `on_update` | `schedule: { 'on_update': true, 'at_most_every': '<n> <unit>' }` | Установите `true` для обновления при изменении вышестоящих данных. Необязательный параметр `at_most_every` ограничивает частоту обновлений (минимальный интервал — 60 секунд). Например, `'15 MINUTES'` | v1.12+ |
 
**Поведение обновления в зависимости от режима:**
- `cron`: dbt запрашивает ручное обновление при каждом запуске.
- `every` и `on_update`: Databricks автоматически управляет обновлением; dbt не инициирует ручное обновление при повторном запуске без изменений.
Если в Databricks задано расписание, но в вашем проекте dbt оно не указано, при следующем запуске обновление переключается в ручной режим (если для `on_configuration_change` установлено значение `apply`).
 
#### query
Для материализованных представлений, если скомпилированный запрос отличается от запроса в базе данных, dbt выполняет действие, заданное параметром `on_configuration_change`. Изменения запросов для потоковых таблиц в настоящее время не обнаруживаются. Подробнее см. в разделе [on_configuration_change](#on_configuration_change).

#### row_filter
_Доступно в версиях 1.12 и выше_

`row_filter` применяет к модели [фильтр строк Unity Catalog](https://docs.databricks.com/aws/en/tables/row-and-column-filters). Он поддерживается для материализаций `table`, `incremental`, `materialized_view` и `streaming_table`. Полное описание конфигурации и примеры см. в разделе [Настройка фильтров строк](#setting-row-filters).

### on_configuration_change
 
| Материализация | Требуется удаление и повторное создание? | Примечания |
|----------------|----------------------------|-------|
| Материализованные представления | Да, для всех изменений, кроме обновлений расписания | Ограничение Databricks SQL API |
| Потоковые таблицы | Только при изменении `partition_by` | Для всех остальных поддерживаемых изменений используется `CREATE OR REFRESH`, а для изменения расписания дополнительно используется `ALTER` |
 
Примечание об изменениях запросов потоковых таблиц: в настоящее время адаптер не может определить, изменился ли запрос потоковой таблицы. Независимо от поведения `on_configuration_change`, dbt использует `CREATE OR REFRESH`, который применяет обновлённый запрос только к будущим строкам &mdash; ранее обработанные строки не обрабатываются повторно.
 
Чтобы повторно обработать доступные исходные данные с обновлённым запросом, выполните запуск с `--full-refresh`.
 
<VersionBlock firstVersion="1.12">

## Представления метрик

Установите `materialized='metric_view'`, чтобы управлять [представлением метрик Unity Catalog](https://docs.databricks.com/aws/en/metric-views/) с помощью dbt. Вместо SQL тело модели содержит YAML-определение представления метрик: `version`, `source`, `dimensions`, `measures` и необязательный `filter`. dbt создаёт представление метрик с помощью `CREATE OR REPLACE VIEW ... WITH METRICS LANGUAGE YAML`.

<File name='order_metrics.sql'>

```sql
{{ config(materialized='metric_view') }}

version: 1.1
source: "{{ ref('source_orders') }}"
filter: status = 'completed'
dimensions:
  - name: order_date
    expr: order_date
  - name: status
    expr: status
    synonyms: [state, order_state]
measures:
  - name: total_orders
    expr: count(1)
  - name: total_revenue
    expr: sum(revenue)
    synonyms: [revenue, sales]
```

</File>

Укажите ссылку на исходный объект в `source` с помощью `ref()`, чтобы dbt мог определить зависимости. Для запросов к полученному представлению метрик используйте функцию `MEASURE()`.

dbt передаёт YAML-содержимое в Databricks без изменений, поэтому представление метрик поддерживает **всю** [спецификацию YAML для представлений метрик Unity Catalog](https://docs.databricks.com/aws/en/business-semantics/metric-views/yaml-reference), а не только показанные выше ключи. Через dbt можно использовать любое поле, которое Databricks принимает на стороне сервера, включая [`synonyms`](https://docs.databricks.com/aws/en/metric-views/semantic-metadata) и `display_name` для измерений и мер, а также `format` и `window` для мер.

Для представления метрик также можно задать `databricks_tags` и [`grants`](/reference/resource-configs/grants). Свойства `tblproperties` применяются только при обновлении представления на месте (с помощью `view_update_via_alter`) или его замене, но не при первоначальном создании.

### Обновление представления метрик

По умолчанию dbt пересоздаёт представление метрик с помощью `CREATE OR REPLACE VIEW` при каждом запуске.

Если для [`view_update_via_alter`](/reference/global-configs/databricks-changes#changes-to-the-view-materialization) установлено значение `true`, dbt применяет изменения на месте, не заменяя представление:

- Изменения YAML-определения применяются с помощью `ALTER VIEW ... AS`.
- Изменения `databricks_tags` или `tblproperties` применяются с помощью `ALTER VIEW ... SET`.

Если ни определение, ни теги, ни свойства не изменились, dbt пропускает обновление.

</VersionBlock>

## Настройка свойств таблиц
[Свойства таблиц](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html) можно задать в конфигурации таблиц или представлений с помощью `tblproperties`:
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
Эти свойства передаются напрямую в Databricks без проверки в dbt. При изменении `tblproperties` инкрементальных материализаций потребуется выполнить их полное обновление.
 
:::
 
Один из вариантов использования — обеспечение совместимости таблиц `delta` со средствами чтения `iceberg` с помощью [Universal Format](https://docs.databricks.com/en/delta/uniform.html):
```sql
{{ config(
    tblproperties={
      'delta.enableIcebergCompatV2' = 'true'
      'delta.universalFormat.enabledFormats' = 'iceberg'
    }
 ) }}
```
`tblproperties` можно указать для моделей Python, но из-за ограничения PySpark они применяются с помощью оператора `ALTER` после создания таблицы.
