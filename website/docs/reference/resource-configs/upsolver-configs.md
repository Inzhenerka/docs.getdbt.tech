---
title: "Конфигурации Upsolver"
id: "upsolver-configs"
description: "Конфигурации Upsolver - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
---

## Поддерживаемая функциональность Upsolver SQLake {#supported-upsolver-sqlake-functionality}

| КОМАНДА | СОСТОЯНИЕ | МАТЕРИАЛИЗОВАНО |
| ------ | ------ | ------ |
| SQL вычислительный кластер | не поддерживается | - |
| SQL соединения | поддерживается | connection |
| SQL копирование задания | поддерживается | incremental |
| SQL слияние задания | поддерживается | incremental |
| SQL вставка задания | поддерживается | incremental |
| SQL материализованные представления | поддерживается | materializedview |
| Ожидания | поддерживается | incremental |

## Материализация конфигураций {#configs-materialization}

| Конфигурация | Обязательно | Материализация | Описание | Пример |
| ------ | --------- | --------------- | ---------- | ------- |
| connection_type | Да | connection | Идентификатор соединения: S3/GLUE_CATALOG/KINESIS | connection_type='S3' |
| connection_options | Да | connection | Словарь опций, поддерживаемых выбранным соединением | connection_options=\{ 'aws_role': 'aws_role', 'external_id': 'SAMPLES', 'read_only': True \} |
| incremental_strategy | Нет | incremental | Определите одну из стратегий инкрементного обновления: merge/copy/insert. По умолчанию: copy | incremental_strategy='merge' |
| source | Нет | incremental | Определите источник для копирования: S3/KAFKA/KINESIS | source = 'S3' |
| target_type | Нет | incremental | Определите тип цели REDSHIFT/ELASTICSEARCH/S3/SNOWFLAKE/POSTGRES. По умолчанию None для Data lake | target_type='Snowflake' |
| target_prefix | Нет | incremental | Определите ПРЕФИКС для типа цели ELASTICSEARCH | target_prefix = 'orders' |
| target_location | Нет | incremental | Определите ЛОКАЦИЮ для типа цели S3 | target_location = 's3://your-bucket-name/path/to/folder/' |
| schema | Да/Нет | incremental | Определите схему цели. Обязательно, если target_type, таблица не создается в соединении метахранилища | schema = 'target_schema' |
| database | Да/Нет | incremental | Определите соединение цели. Обязательно, если target_type, таблица не создается в соединении метахранилища | database = 'target_connection' |
| alias | Да/Нет | incremental | Определите таблицу цели. Обязательно, если target_type, таблица не создается в соединении метахранилища | alias = 'target_table' |
| delete_condition | Нет | incremental | Записи, которые соответствуют условию ON и условию удаления, могут быть удалены | delete_condition='nettotal > 1000' |
| partition_by | Нет | incremental | Список словарей для определения partition_by для таблицы метахранилища цели | partition_by=[\{'field':'$field_name'\}] |
| primary_key | Нет | incremental | Список словарей для определения partition_by для таблицы метахранилища цели | primary_key=[\{'field':'customer_email', 'type':'string'\}] |
| map_columns_by_name | Нет | incremental | Соответствует столбцам из оператора SELECT таблице. Логическое значение. По умолчанию: False | map_columns_by_name=True |
| sync | Нет | incremental/materializedview | Логическая опция для определения, синхронизировано ли задание или нет. По умолчанию: False | sync=True |
| options | Нет | incremental/materializedview | Словарь опций задания | options=\{ 'START_FROM': 'BEGINNING', 'ADD_MISSING_COLUMNS': True \} |

## SQL соединение {#sql-connection}

Соединения используются для предоставления Upsolver правильных учетных данных для загрузки ваших данных в SQLake, а также для записи преобразованных данных в различные сервисы. Подробнее о ["Upsolver SQL соединениях"](https://docs.upsolver.com/sqlake/sql-command-reference/sql-connections)
В dbt модель соединения - это модель с materialized='connection'

```sql
{{ config(
        materialized='connection',
        connection_type={ 'S3' | 'GLUE_CATALOG' | 'KINESIS' | 'KAFKA'| 'SNOWFLAKE' },
        connection_options={}
        )
}}
```

Запуск этой модели скомпилирует SQL CREATE CONNECTION (или ALTER CONNECTION, если существует) и отправит его в движок Upsolver. Имя соединения будет именем модели.

## SQL копирование задания {#sql-copy-job}

Задание COPY FROM позволяет копировать ваши данные из заданного источника в таблицу, созданную в соединении метахранилища. Эта таблица затем служит вашей промежуточной таблицей и может использоваться с заданиями трансформации SQLake для записи в различные целевые местоположения. Подробнее о ["Upsolver SQL copy-from"](https://docs.upsolver.com/sqlake/sql-command-reference/sql-jobs/create-job/copy-from)

В dbt модель копирования задания - это модель с materialized='incremental'

```sql
{{ config(  materialized='incremental',
            sync=True|False,
            source = 'S3'| 'KAFKA' | ... ,
            options={
              'option_name': 'option_value'
            },
            partition_by=[{}]
          )
}}
SELECT * FROM {{ ref(<model>) }}
```

Запуск этой модели скомпилирует SQL CREATE TABLE для типа цели Data lake (или ALTER TABLE, если существует) и SQL CREATE COPY JOB (или ALTER COPY JOB, если существует) и отправит его в движок Upsolver. Имя таблицы будет именем модели. Имя задания будет именем модели плюс '_job'

## SQL вставка задания {#sql-insert-job}

Задание INSERT определяет запрос, который извлекает набор данных на основе заданного оператора SELECT и вставляет его в назначенную цель. Этот запрос затем выполняется периодически на основе RUN_INTERVAL, определенного в задании. Подробнее о ["Upsolver SQL insert"](https://docs.upsolver.com/sqlake/sql-command-reference/sql-jobs/create-job/sql-transformation-jobs/insert).

В dbt модель вставки задания - это модель с materialized='incremental' и incremental_strategy='insert'

```sql
{{ config(  materialized='incremental',
            sync=True|False,
            map_columns_by_name=True|False,
            incremental_strategy='insert',
            options={
              'option_name': 'option_value'
            },
            primary_key=[{}]
          )
}}
SELECT ...
FROM {{ ref(<model>) }}
WHERE ...
GROUP BY ...
HAVING COUNT(DISTINCT orderid::string) ...
```

Запуск этой модели скомпилирует SQL CREATE TABLE для типа цели Data lake (или ALTER TABLE, если существует) и SQL CREATE INSERT JOB (или ALTER INSERT JOB, если существует) и отправит его в движок Upsolver. Имя таблицы будет именем модели. Имя задания будет именем модели плюс '_job'

## SQL слияние задания {#sql-merge-job}

Задание MERGE определяет запрос, который извлекает набор данных на основе заданного оператора SELECT и вставляет, заменяет или удаляет данные из назначенной цели на основе определения задания. Этот запрос затем выполняется периодически на основе RUN_INTERVAL, определенного в задании. Подробнее о ["Upsolver SQL merge"](https://docs.upsolver.com/sqlake/sql-command-reference/sql-jobs/create-job/sql-transformation-jobs/merge).

В dbt модель слияния задания - это модель с materialized='incremental' и incremental_strategy='merge'

```sql
{{ config(  materialized='incremental',
            sync=True|False,
            map_columns_by_name=True|False,
            incremental_strategy='merge',
            options={
              'option_name': 'option_value'
            },
            primary_key=[{}]
          )
}}
SELECT ...
FROM {{ ref(<model>) }}
WHERE ...
GROUP BY ...
HAVING COUNT ...
```

Запуск этой модели скомпилирует SQL CREATE TABLE для типа цели Data lake (или ALTER TABLE, если существует) и SQL CREATE MERGE JOB (или ALTER MERGE JOB, если существует) и отправит его в движок Upsolver. Имя таблицы будет именем модели. Имя задания будет именем модели плюс '_job'

## SQL материализованные представления {#sql-materialized-views}

При преобразовании данных вы можете обнаружить, что вам нужны данные из нескольких исходных таблиц для достижения желаемого результата.
В таком случае вы можете создать материализованное представление из одной таблицы SQLake, чтобы объединить его с другой таблицей (которая в этом случае считается основной таблицей). Подробнее о ["Upsolver SQL материализованные представления"](https://docs.upsolver.com/sqlake/sql-command-reference/sql-jobs/create-job/sql-transformation-jobs/sql-materialized-views).

В dbt модель материализованных представлений - это модель с materialized='materializedview'.

```sql
{{ config(  materialized='materializedview',
            sync=True|False,
            options={'option_name': 'option_value'}
        )
}}
SELECT ...
FROM {{ ref(<model>) }}
WHERE ...
GROUP BY ...
```

Запуск этой модели скомпилирует SQL CREATE MATERIALIZED VIEW (или ALTER MATERIALIZED VIEW, если существует) и отправит его в движок Upsolver. Имя materializedview будет именем модели.

## Ожидания/ограничения {#expectationsconstraints}

Условия качества данных могут быть добавлены в ваше задание, чтобы удалить строку или вызвать предупреждение, когда столбец нарушает предопределенное условие.

```sql
WITH EXPECTATION <expectation_name> EXPECT <sql_predicate>
ON VIOLATION WARN
```

Ожидания могут быть реализованы с помощью ограничений dbt
Поддерживаемые ограничения: check и not_null

```yaml
models:
  - name: <model name>
    # обязательно
    config:
      contract:
        enforced: true
    # ограничения на уровне модели
    constraints:
      - type: check
        columns: ['<column1>', '<column2>']
        expression: "column1 <= column2"
        name: <constraint_name>
      - type: not_null
        columns: ['column1', 'column2']
        name: <constraint_name>

    columns:
      - name: <column3>
        data_type: string

        # ограничения на уровне столбца
        constraints:
          - type: not_null
          - type: check
            expression: "REGEXP_LIKE(<column3>, '^[0-9]{4}[a-z]{5}$')"
            name: <constraint_name>
```

## Примеры проектов {#projects-examples}

> ссылка на примеры проектов: [github.com/dbt-upsolver/examples/](https://github.com/Upsolver/dbt-upsolver/tree/main/examples)

## Опции соединения {#connection-options}

| Опция | Хранилище | Редактируемо | Необязательно | Синтаксис конфигурации |
| -------| --------- | -------- | -------- | ------------- |
| aws_role | s3 | Да | Да | 'aws_role': `'<aws_role>'` |
| external_id | s3 | Да | Да | 'external_id': `'<external_id>'` |
| aws_access_key_id | s3 | Да | Да | 'aws_access_key_id': `'<aws_access_key_id>'` |
| aws_secret_access_key | s3 | Да | Да | 'aws_secret_access_key_id': `'<aws_secret_access_key_id>'` |
| path_display_filter | s3 | Да | Да | 'path_display_filter': `'<path_display_filter>'` |
| path_display_filters | s3 | Да | Да | 'path_display_filters': (`'<filter>'`, ...) |
| read_only | s3 | Да | Да | 'read_only': True/False |
| encryption_kms_key | s3 | Да | Да | 'encryption_kms_key': `'<encryption_kms_key>'` |
| encryption_customer_managed_key | s3 | Да | Да | 'encryption_customer_kms_key': `'<encryption_customer_kms_key>'` |
| comment | s3 | Да | Да | 'comment': `'<comment>'` |
| host | kafka | Нет | Нет | 'host': `'<host>'` |
| hosts | kafka | Нет | Нет | 'hosts': (`'<host>'`, ...) |
| consumer_properties | kafka | Да | Да | 'consumer_properties': `'<consumer_properties>'` |
| version | kafka | Нет | Да | 'version': `'<value>'` |
| require_static_ip | kafka | Да | Да | 'require_static_ip': True/False |
| ssl | kafka | Да | Да | 'ssl': True/False |
| topic_display_filter | kafka | Да | Да | 'topic_display_filter': `'<topic_display_filter>'` |
| topic_display_filters | kafka | Да | Да | 'topic_display_filter': (`'<filter>'`, ...) |
| comment | kafka | Да | Да | 'comment': `'<comment>'` |
| aws_role | glue_catalog | Да | Да | 'aws_role': `'<aws_role>'` |
| external_id | glue_catalog | Да | Да | 'external_id': `'<external_id>'` |
| aws_access_key_id | glue_catalog | Да | Да | 'aws_access_key_id': `'<aws_access_key_id>'` |
| aws_secret_access_key | glue_catalog | Да | Да | 'aws_secret_access_key': `'<aws_secret_access_key>'` |
| default_storage_connection | glue_catalog | Нет | Нет | 'default_storage_connection': `'<default_storage_connection>'` |
| default_storage_location | glue_catalog | Нет | Нет | 'default_storage_location': `'<default_storage_location>'` |
| region | glue_catalog | Нет | Да | 'region': `'<region>'` |
| database_display_filter | glue_catalog | Да | Да | 'database_display_filter': `'<database_display_filter>'` |
| database_display_filters | glue_catalog | Да | Да | 'database_display_filters': (`'<filter>'`, ...) |
| comment | glue_catalog | Да | Да | 'comment': `'<comment>'` |
| aws_role | kinesis | Да | Да | 'aws_role': `'<aws_role>'` |
| external_id | kinesis | Да | Да | 'external_id': `'<external_id>'` |
| aws_access_key_id | kinesis | Да | Да | 'aws_access_key_id': `'<aws_access_key_id>'` |
| aws_secret_access_key | kinesis | Да | Да | 'aws_secret_access_key': `'<aws_secret_access_key>'` |
| region | kinesis | Нет | Нет | 'region': `'<region>'` |
| read_only | kinesis | Нет | Да | 'read_only': True/False |
| max_writers | kinesis | Да | Да | 'max_writers': `<integer>` |
| stream_display_filter | kinesis | Да | Да | 'stream_display_filter': `'<stream_display_filter>'` |
| stream_display_filters | kinesis | Да | Да | 'stream_display_filters': (`'<filter>'`, ...) |
| comment | kinesis | Да | Да | 'comment': `'<comment>'` |
| connection_string | snowflake | Да | Нет | 'connection_string': `'<connection_string>'` |
| user_name | snowflake | Да | Нет | 'user_name': `'<user_name>'` |
| password | snowflake | Да | Нет | 'password': `'<password>'` |
| max_concurrent_connections | snowflake | Да | Да | 'max_concurrent_connections': `<integer>` |
| comment | snowflake | Да | Да | 'comment': `'<comment>'` |
| connection_string | redshift | Да | Нет | 'connection_string': `'<connection_string>'` |
| user_name | redshift | Да | Нет | 'user_name': `'<user_name>'` |
| password | redshift | Да | Нет | 'password': `'<password>'` |
| max_concurrent_connections | redshift | Да | Да | 'max_concurrent_connections': `<integer>` |
| comment | redshift | Да | Да | 'comment': `'<comment>'` |
| connection_string | mysql | Да | Нет | 'connection_string': `'<connection_string>'` |
| user_name | mysql | Да | Нет | 'user_name': `'<user_name>'` |
| password | mysql | Да | Нет | 'password': `'<password>'` |
| comment | mysql | Да | Да | 'comment': `'<comment>'` |
| connection_string | postgres | Да | Нет | 'connection_string': `'<connection_string>'` |
| user_name | postgres | Да | Нет | 'user_name': `'<user_name>'` |
| password | postgres | Да | Нет | 'password': `'<password>'` |
| comment | postgres | Да | Да | 'comment': `'<comment>'` |
| connection_string | elasticsearch | Да | Нет | 'connection_string': `'<connection_string>'` |
| user_name | elasticsearch | Да | Нет | 'user_name': `'<user_name>'` |
| password | elasticsearch | Да | Нет | 'password': `'<password>'` |
| comment | elasticsearch | Да | Да | 'comment': `'<comment>'` |
| connection_string | mongodb | Да | Нет | 'connection_string': `'<connection_string>'` |
| user_name | mongodb | Да | Нет | 'user_name': `'<user_name>'` |
| password | mongodb | Да | Нет | 'password': `'<password>'` |
| timeout | mongodb | Да | Да | 'timeout': "INTERVAL 'N' SECONDS" |
| comment | mongodb | Да | Да | 'comment': `'<comment>'` |
| connection_string | mssql | Да | Нет | 'connection_string': `'<connection_string>'` |
| user_name | mssql | Да | Нет | 'user_name': `'<user_name>'` |
| password | mssql | Да | Нет | 'password': `'<password>'` |
| comment | mssql | Да | Да | 'comment': `'<comment>'` |

## Опции цели {#target-options}

| Опция | Хранилище | Редактируемо | Необязательно | Синтаксис конфигурации |
| -------| --------- | -------- | -------- | ------------- |
| globally_unique_keys | datalake | Нет | Да | 'globally_unique_keys': True/False |
| storage_connection | datalake | Нет | Да | 'storage_connection': `'<storage_connection>'` |
| storage_location | datalake | Нет | Да | 'storage_location': `'<storage_location>'` |
| compute_cluster | datalake | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| compression | datalake | Да | Да | 'compression': 'SNAPPY/GZIP' |
| compaction_processes | datalake | Да | Да | 'compaction_processes': `<integer>` |
| disable_compaction | datalake | Да | Да | 'disable_compaction': True/False |
| retention_date_partition | datalake | Нет | Да | 'retention_date_partition': `'<column>'` |
| table_data_retention | datalake | Да | Да | 'table_data_retention': `'<N DAYS>'` |
| column_data_retention | datalake | Да | Да | 'column_data_retention': (\{'COLUMN' : `'<column>'`,'DURATION': `'<N DAYS>'`\}) |
| comment | datalake | Да | Да | 'comment': `'<comment>'` |
| storage_connection | materialized_view | Нет | Да | 'storage_connection': `'<storage_connection>'` |
| storage_location | materialized_view | Нет | Да | 'storage_location': `'<storage_location>'` |
| max_time_travel_duration | materialized_view | Да | Да | 'max_time_travel_duration': `'<N DAYS>'` |
| compute_cluster | materialized_view | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| column_transformations | snowflake | Нет | Да | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| deduplicate_with | snowflake | Нет | Да | 'deduplicate_with': \{'COLUMNS' : ['col1', 'col2'],'WINDOW': 'N HOURS'\} |
| exclude_columns | snowflake | Нет | Да | 'exclude_columns': (`'<exclude_column>'`, ...) |
| create_table_if_missing | snowflake | Нет | Да | 'create_table_if_missing': True/False} |
| run_interval | snowflake | Нет | Да | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |

## Опции трансформации {#transformation-options}

| Опция | Хранилище | Редактируемо | Необязательно | Синтаксис конфигурации |
| -------| --------- | -------- | -------- | ------------- |
| run_interval | s3 | Нет | Да | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| start_from | s3 | Нет | Да | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | s3 | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | s3 | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| comment | s3 | Да | Да | 'comment': `'<comment>'` |
| skip_validations | s3 | Нет | Да | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | s3 | Нет | Да | 'skip_all_validations': True/False |
| aggregation_parallelism | s3 | Да | Да | 'aggregation_parallelism': `<integer>` |
| run_parallelism | s3 | Да | Да | 'run_parallelism': `<integer>` |
| file_format | s3 | Нет | Нет | 'file_format': '(type = `<file_format>`)' |
| compression | s3 | Нет | Да | 'compression': 'SNAPPY/GZIP ...' |
| date_pattern | s3 | Нет | Да | 'date_pattern': `'<date_pattern>'` |
| output_offset | s3 | Нет | Да | 'output_offset': `'<N MINUTES/HOURS/DAYS>'` |
| run_interval | elasticsearch | Нет | Да | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| routing_field_name | elasticsearch | Да | Да | 'routing_field_name': `'<routing_field_name>'` |
| start_from | elasticsearch | Нет | Да | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | elasticsearch | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | elasticsearch | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| skip_validations | elasticsearch | Нет | Да | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | elasticsearch | Нет | Да | 'skip_all_validations': True/False |
| aggregation_parallelism | elasticsearch | Да | Да | 'aggregation_parallelism': `<integer>` |
| run_parallelism | elasticsearch | Да | Да | 'run_parallelism': `<integer>` |
| bulk_max_size_bytes | elasticsearch | Да | Да | 'bulk_max_size_bytes': `<integer>` |
| index_partition_size | elasticsearch | Да | Да | 'index_partition_size': 'HOURLY/DAILY ...' |
| comment | elasticsearch | Да | Да | 'comment': `'<comment>'` |
| custom_insert_expressions | snowflake | Да | Да | 'custom_insert_expressions': \{'INSERT_TIME' : 'CURRENT_TIMESTAMP()','MY_VALUE': `'<value>'`\} |
| custom_update_expressions | snowflake | Да | Да | 'custom_update_expressions': \{'UPDATE_TIME' : 'CURRENT_TIMESTAMP()','MY_VALUE': `'<value>'`\} |
| keep_existing_values_when_null | snowflake | Да | Да | 'keep_existing_values_when_null': True/False |
| add_missing_columns | snowflake | Нет | Да | 'add_missing_columns': True/False |
| run_interval | snowflake | Нет | Да | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| commit_interval | snowflake | Да | Да | 'commit_interval': `'<N MINUTE[S]/HOUR[S]/DAY[S]>'` |
| start_from | snowflake | Нет | Да | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | snowflake | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | snowflake | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| skip_validations | snowflake | Нет | Да | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | snowflake | Нет | Да | 'skip_all_validations': True/False |
| aggregation_parallelism | snowflake | Да | Да | 'aggregation_parallelism': `<integer>` |
| run_parallelism | snowflake | Да | Да | 'run_parallelism': `<integer>` |
| comment | snowflake | Да | Да | 'comment': `'<comment>'` |
| add_missing_columns | datalake | Нет | Да | 'add_missing_columns': True/False |
| run_interval | datalake | Нет | Да | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| start_from | datalake | Нет | Да | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | datalake | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | datalake | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| skip_validations | datalake | Нет | Да | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | datalake | Нет | Да | 'skip_all_validations': True/False |
| aggregation_parallelism | datalake | Да | Да | 'aggregation_parallelism': `<integer>` |
| run_parallelism | datalake | Да | Да | 'run_parallelism': `<integer>` |
| comment | datalake | Да | Да | 'comment': `'<comment>'` |
| run_interval | redshift | Нет | Да | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| start_from | redshift | Нет | Да | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | redshift | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | redshift | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| skip_validations | redshift | Нет | Да | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | redshift | Нет | Да | 'skip_all_validations': True/False |
| aggregation_parallelism | redshift | Да | Да | 'aggregation_parallelism': `<integer>` |
| run_parallelism | redshift | Да | Да | 'run_parallelism': `<integer>` |
| skip_failed_files | redshift | Нет | Да | 'skip_failed_files': True/False |
| fail_on_write_error | redshift | Нет | Да | 'fail_on_write_error': True/False |
| comment | redshift | Да | Да | 'comment': `'<comment>'` |
| run_interval | postgres | Нет | Да | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| start_from | postgres | Нет | Да | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | postgres | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | postgres | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| skip_validations | postgres | Нет | Да | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | postgres | Нет | Да | 'skip_all_validations': True/False |
| aggregation_parallelism | postgres | Да | Да | 'aggregation_parallelism': `<integer>` |
| run_parallelism | postgres | Да | Да | 'run_parallelism': `<integer>` |
| comment | postgres | Да | Да | 'comment': `'<comment>'` |

## Опции копирования {#copy-options}

| Опция | Хранилище | Категория | Редактируемо | Необязательно | Синтаксис конфигурации |
| -------| ---------- | -------- | -------- | -------- | ------------- |
| topic | kafka | source_options | Нет | Нет | 'topic': `'<topic>'` |
| exclude_columns | kafka | job_options | Нет | Да | 'exclude_columns': (`'<exclude_column>'`, ...) |
| deduplicate_with | kafka | job_options | Нет | Да | 'deduplicate_with': \{'COLUMNS' : ['col1', 'col2'],'WINDOW': 'N HOURS'\} |
| consumer_properties | kafka | job_options | Да | Да | 'consumer_properties': `'<consumer_properties>'` |
| reader_shards | kafka | job_options | Да | Да | 'reader_shards': `<integer>` |
| store_raw_data | kafka | job_options | Нет | Да | 'store_raw_data': True/False |
| start_from | kafka | job_options | Нет | Да | 'start_from': 'BEGINNING/NOW' |
| end_at | kafka | job_options | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | kafka | job_options | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| run_parallelism | kafka | job_options | Да | Да | 'run_parallelism': `<integer>` |
| content_type | kafka | job_options | Да | Да | 'content_type': 'AUTO/CSV/...' |
| compression | kafka | job_options | Нет | Да | 'compression': 'AUTO/GZIP/...' |
| column_transformations | kafka | job_options | Нет | Да | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| commit_interval | kafka | job_options | Да | Да | 'commit_interval': `'<N MINUTE[S]/HOUR[S]/DAY[S]>'` |
| skip_validations | kafka | job_options | Нет | Да | 'skip_validations': ('MISSING_TOPIC') |
| skip_all_validations | kafka | job_options | Нет | Да | 'skip_all_validations': True/False |
| comment | kafka | job_options | Да | Да | 'comment': `'<comment>'` |
| table_include_list | mysql | source_options | Да | Да | 'table_include_list': (`'<regexFilter>'`, ...) |
| column_exclude_list | mysql | source_options | Да | Да | 'column_exclude_list': (`'<regexFilter>'`, ...) |
| exclude_columns | mysql | job_options | Нет | Да | 'exclude_columns': (`'<exclude_column>'`, ...) |
| column_transformations | mysql | job_options | Нет | Да | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| skip_snapshots | mysql | job_options | Да | Да | 'skip_snapshots': True/False |
| end_at | mysql | job_options | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | mysql | job_options | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| snapshot_parallelism | mysql | job_options | Да | Да | 'snapshot_parallelism': `<integer>` |
| ddl_filters | mysql | job_options | Нет | Да | 'ddl_filters': (`'<filter>'`, ...) |
| comment | mysql | job_options | Да | Да | 'comment': `'<comment>'` |
| table_include_list | postgres | source_options | Нет | Нет | 'table_include_list': (`'<regexFilter>'`, ...) |
| column_exclude_list | postgres | source_options | Нет | Да | 'column_exclude_list': (`'<regexFilter>'`, ...) |
| heartbeat_table | postgres | job_options | Нет | Да | 'heartbeat_table': `'<heartbeat_table>'` |
| skip_snapshots | postgres | job_options | Нет | Да | 'skip_snapshots': True/False |
| publication_name | postgres | job_options | Нет | Нет | 'publication_name': `'<publication_name>'` |
| end_at | postgres | job_options | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | postgres | job_options | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| comment | postgres | job_options | Да | Да | 'comment': `'<comment>'` |
| parse_json_columns | postgres | job_options | Нет | Нет | 'parse_json_columns': True/False |
| column_transformations | postgres | job_options | Нет | Да | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| snapshot_parallelism | postgres | job_options | Да | Да | 'snapshot_parallelism': `<integer>` |
| exclude_columns | postgres | job_options | Нет | Да | 'exclude_columns': (`'<exclude_column>'`, ...) |
| location | s3 | source_options | Нет | Нет | 'location': `'<location>'` |
| date_pattern | s3 | job_options | Нет | Да | 'date_pattern': `'<date_pattern>'` |
| file_pattern | s3 | job_options | Нет | Да | 'file_pattern': `'<file_pattern>'` |
| initial_load_pattern | s3 | job_options | Нет | Да | 'initial_load_pattern': `'<initial_load_pattern>'` |
| initial_load_prefix | s3 | job_options | Нет | Да | 'initial_load_prefix': `'<initial_load_prefix>'` |
| delete_files_after_load | s3 | job_options | Нет | Да | 'delete_files_after_load': True/False |
| deduplicate_with | s3 | job_options | Нет | Да | 'deduplicate_with': \{'COLUMNS' : ['col1', 'col2'],'WINDOW': 'N HOURS'\} |
| end_at | s3 | job_options | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| start_from | s3 | job_options | Нет | Да | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| compute_cluster | s3 | job_options | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| run_parallelism | s3 | job_options | Да | Да | 'run_parallelism': `<integer>` |
| content_type | s3 | job_options | Да | Да | 'content_type': 'AUTO/CSV...' |
| compression | s3 | job_options | Нет | Да | 'compression': 'AUTO/GZIP...' |
| comment | s3 | job_options | Да | Да | 'comment': `'<comment>'` |
| column_transformations | s3 | job_options | Нет | Да | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| commit_interval | s3 | job_options | Да | Да | 'commit_interval': `'<N MINUTE[S]/HOUR[S]/DAY[S]>'` |
| skip_validations | s3 | job_options | Нет | Да | 'skip_validations': ('EMPTY_PATH') |
| skip_all_validations | s3 | job_options | Нет | Да | 'skip_all_validations': True/False |
| exclude_columns | s3 | job_options | Нет | Да | 'exclude_columns': (`'<exclude_column>'`, ...) |
| stream | kinesis | source_options | Нет | Нет | 'stream': `'<stream>'` |
| reader_shards | kinesis | job_options | Да | Да | 'reader_shards': `<integer>` |
| store_raw_data | kinesis | job_options | Нет | Да | 'store_raw_data': True/False |
| start_from | kinesis | job_options | Нет | Да | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | kinesis | job_options | Нет | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | kinesis | job_options | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| run_parallelism | kinesis | job_options | Нет | Да | 'run_parallelism': `<integer>` |
| content_type | kinesis | job_options | Да | Да | 'content_type': 'AUTO/CSV...' |
| compression | kinesis | job_options | Нет | Да | 'compression': 'AUTO/GZIP...' |
| comment | kinesis | job_options | Да | Да | 'comment': `'<comment>'` |
| column_transformations | kinesis | job_options | Да | Да | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| deduplicate_with | kinesis | job_options | Нет | Да | 'deduplicate_with': \{'COLUMNS' : ['col1', 'col2'],'WINDOW': 'N HOURS'\} |
| commit_interval | kinesis | job_options | Да | Да | 'commit_interval': `'<N MINUTE[S]/HOUR[S]/DAY[S]>'` |
| skip_validations | kinesis | job_options | Нет | Да | 'skip_validations': ('MISSING_STREAM') |
| skip_all_validations | kinesis | job_options | Нет | Да | 'skip_all_validations': True/False |
| exclude_columns | kinesis | job_options | Нет | Да | 'exclude_columns': (`'<exclude_column>'`, ...) |
| table_include_list | mssql | source_options | Да | Да | 'table_include_list': (`'<regexFilter>'`, ...) |
| column_exclude_list | mssql | source_options | Да | Да | 'column_exclude_list': (`'<regexFilter>'`, ...) |
| exclude_columns | mssql | job_options | Нет | Да | 'exclude_columns': (`'<exclude_column>'`, ...) |
| column_transformations | mssql | job_options | Нет | Да | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| skip_snapshots | mssql | job_options | Да | Да | 'skip_snapshots': True/False |
| end_at | mssql | job_options | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | mssql | job_options | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| snapshot_parallelism | mssql | job_options | Да | Да | 'snapshot_parallelism': `<integer>` |
| parse_json_columns | mssql | job_options | Нет | Нет | 'parse_json_columns': True/False |
| comment | mssql | job_options | Да | Да | 'comment': `'<comment>'` |
| collection_include_list | mongodb | source_options | Да | Да | 'collection_include_list': (`'<regexFilter>'`, ...) |
| exclude_columns | mongodb | job_options | Нет | Да | 'exclude_columns': (`'<exclude_column>'`, ...) |
| column_transformations | mongodb | job_options | Нет | Да | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| skip_snapshots | mongodb | job_options | Да | Да | 'skip_snapshots': True/False |
| end_at | mongodb | job_options | Да | Да | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | mongodb | job_options | Да | Да | 'compute_cluster': `'<compute_cluster>'` |
| snapshot_parallelism | mongodb | job_options | Да | Да | 'snapshot_parallelism': `<integer>` |
| comment | mongodb | job_options | Да | Да | 'comment': `'<comment>'` |