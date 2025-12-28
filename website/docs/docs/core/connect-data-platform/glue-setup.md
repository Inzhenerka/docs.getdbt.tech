---
title: "Настройка AWS Glue"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища AWS Glue в dbt."
id: "glue-setup"
meta:
  maintained_by: Community
  authors: 'Benjamin Menuet, Moshir Mikael, Armando Segnini and Amine El Mallem'
  github_repo: 'aws-samples/dbt-glue'
  pypi_package: 'dbt-glue'
  min_core_version: 'v0.24.0'
  cloud_support: Not Supported
  min_supported_version: 'Glue 2.0'
  slack_channel_name: '#db-glue'
  slack_channel_link: 'https://getdbt.slack.com/archives/C02R4HSMBAT'
  platform_name: 'AWS Glue'
  config_page: '/reference/resource-configs/glue-configs'
---

:::info Плагин сообщества

Некоторая базовая функциональность может быть ограничена. Если вы заинтересованы в том, чтобы внести вклад, ознакомьтесь с исходным кодом каждого репозитория, перечисленного ниже.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


Для получения дополнительной (и, скорее всего, более актуальной) информации см. [README](https://github.com/aws-samples/dbt-glue#readme)


## Способы подключения


### Настройка AWS‑профиля для Glue Interactive Session
Для интерактивных сессий используются два IAM‑принципала.
- Клиентский принципал: принципал (пользователь или роль), который вызывает AWS API (Glue, Lake Formation, Interactive Sessions)
  с локального клиента. Этот принципал настраивается в AWS CLI и, как правило, совпадает с основным.
- Сервисная роль: IAM‑роль, которую AWS Glue использует для выполнения вашей сессии. Это та же роль, что используется в AWS Glue
  ETL.

Прочитайте [эту документацию](https://docs.aws.amazon.com/glue/latest/dg/glue-is-security.html), чтобы настроить эти принципалы.

Ниже приведена политика с минимально необходимыми правами, позволяющая использовать все возможности адаптера **`dbt-glue`**.

Пожалуйста, обновите значения переменных между **`<>`**. Ниже приведены пояснения к этим аргументам:

|Args	|Описание	|
|---|---|
|region|Регион, в котором хранится ваша база данных Glue |
|AWS Account|Аккаунт AWS, в котором вы запускаете пайплайн |
|dbt output database|База данных, обновляемая dbt (это schema, настроенная в profile.yml вашего окружения dbt)|
|dbt source database|Все базы данных, используемые как источники|
|dbt output bucket|Имя бакета, в котором будут генерироваться данные dbt (location, настроенный в profile.yml вашего окружения dbt)|
|dbt source bucket|Имя бакета с исходными базами данных (если они не управляются Lake Formation)|

<File name='sample_IAM_Policy.yml'>

```yml
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Read_and_write_databases",
            "Action": [
                "glue:SearchTables",
                "glue:BatchCreatePartition",
                "glue:CreatePartitionIndex",
                "glue:DeleteDatabase",
                "glue:GetTableVersions",
                "glue:GetPartitions",
                "glue:DeleteTableVersion",
                "glue:UpdateTable",
                "glue:DeleteTable",
                "glue:DeletePartitionIndex",
                "glue:GetTableVersion",
                "glue:UpdateColumnStatisticsForTable",
                "glue:CreatePartition",
                "glue:UpdateDatabase",
                "glue:CreateTable",
                "glue:GetTables",
                "glue:GetDatabases",
                "glue:GetTable",
                "glue:GetDatabase",
                "glue:GetPartition",
                "glue:UpdateColumnStatisticsForPartition",
                "glue:CreateDatabase",
                "glue:BatchDeleteTableVersion",
                "glue:BatchDeleteTable",
                "glue:DeletePartition",
                "glue:GetUserDefinedFunctions",
                "lakeformation:ListResources",
                "lakeformation:BatchGrantPermissions",
                "lakeformation:ListPermissions", 
                "lakeformation:GetDataAccess",
                "lakeformation:GrantPermissions",
                "lakeformation:RevokePermissions",
                "lakeformation:BatchRevokePermissions",
                "lakeformation:AddLFTagsToResource",
                "lakeformation:RemoveLFTagsFromResource",
                "lakeformation:GetResourceLFTags",
                "lakeformation:ListLFTags",
                "lakeformation:GetLFTag",
            ],
            "Resource": [
                "arn:aws:glue:<region>:<AWS Account>:catalog",
                "arn:aws:glue:<region>:<AWS Account>:table/<dbt output database>/*",
                "arn:aws:glue:<region>:<AWS Account>:database/<dbt output database>"
            ],
            "Effect": "Allow"
        },
        {
            "Sid": "Read_only_databases",
            "Action": [
                "glue:SearchTables",
                "glue:GetTableVersions",
                "glue:GetPartitions",
                "glue:GetTableVersion",
                "glue:GetTables",
                "glue:GetDatabases",
                "glue:GetTable",
                "glue:GetDatabase",
                "glue:GetPartition",
                "lakeformation:ListResources",
                "lakeformation:ListPermissions"
            ],
            "Resource": [
                "arn:aws:glue:<region>:<AWS Account>:table/<dbt source database>/*",
                "arn:aws:glue:<region>:<AWS Account>:database/<dbt source database>",
                "arn:aws:glue:<region>:<AWS Account>:database/default",
                "arn:aws:glue:<region>:<AWS Account>:database/global_temp"
            ],
            "Effect": "Allow"
        },
        {
            "Sid": "Storage_all_buckets",
            "Action": [
                "s3:GetBucketLocation",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::<dbt output bucket>",
                "arn:aws:s3:::<dbt source bucket>"
            ],
            "Effect": "Allow"
        },
        {
            "Sid": "Read_and_write_buckets",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::<dbt output bucket>"
            ],
            "Effect": "Allow"
        },
        {
            "Sid": "Read_only_buckets",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::<dbt source bucket>"
            ],
            "Effect": "Allow"
        }
    ]
}
```
</File>

### Настройка локального окружения

Поскольку адаптеры **`dbt`** и **`dbt-glue`** совместимы с Python версии 3.9 или выше, проверьте версию Python:

```bash
$ python3 --version
```

Настройте виртуальное окружение Python, чтобы изолировать версии пакетов и зависимости кода:

```bash
$ sudo yum install git
$ python3 -m venv dbt_venv
$ source dbt_venv/bin/activate
$ python3 -m pip install --upgrade pip
```

Настройте последнюю версию AWS CLI:

```bash
$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
$ unzip awscliv2.zip
$ sudo ./aws/install
```

Установите пакет boto3:

```bash
$ sudo yum install gcc krb5-devel.x86_64 python3-devel.x86_64 -y
$ pip3 install —upgrade boto3
```

Установите пакет:

```bash
$ pip3 install dbt-glue
```

### Пример конфигурации
<File name='profiles.yml'>

```yml
type: glue
query-comment: This is a glue dbt example
role_arn: arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
region: us-east-1
workers: 2
worker_type: G.1X
idle_timeout: 10
schema: "dbt_demo"
session_provisioning_timeout_in_seconds: 120
location: "s3://dbt_demo_bucket/dbt_demo_data"
```

</File>

В таблице ниже описаны все доступные опции.

| Option	                                 | Описание	                                                                                                                                                                                                                                                                                      | Mandatory |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| project_name	                           | Имя проекта dbt. Оно должно совпадать с именем, настроенным в dbt‑проекте.	                                                                                                                                                                                                                     | yes       |
| type	                                   | Используемый драйвер.	                                                                                                                                                                                                                                                                          | yes       |
| query-comment	                          | Строка, добавляемая в виде комментария к каждому запросу, который выполняет dbt. 	                                                                                                                                                                                                             | no        |
| role_arn	                               | ARN IAM‑роли для Glue Interactive Session.	                                                                                                                                                                                                                                                     | yes       |
| region	                                 | Регион AWS, в котором запускается пайплайн данных.	                                                                                                                                                                                                                                             | yes       |
| workers	                                | Количество воркеров указанного типа, выделяемых при запуске задания.	                                                                                                                                                                                                                           | yes       |
| worker_type	                            | Тип предопределённого воркера. Возможные значения: Standard, G.1X или G.2X.	                                                                                                                                                                                                                    | yes       |
| schema	                                 | Schema, используемая для организации данных в Amazon S3. Также это база данных в AWS Lake Formation, в которой хранятся метаданные таблиц в Data Catalog.	                                                                                                                                   | yes       |
| session_provisioning_timeout_in_seconds | Таймаут (в секундах) на создание Glue Interactive Session.	                                                                                                                                                                                                                                     | yes       |
| location	                               | Расположение целевых данных в Amazon S3.	                                                                                                                                                                                                                                                       | yes       |
| query_timeout_in_minutes	               | Таймаут одного запроса в минутах. Значение по умолчанию — 300.                                                                                                                                                                                                                                   | no        |
| idle_timeout	                           | Таймаут простоя Glue‑сессии в минутах (сессия останавливается после указанного времени бездействия).	                                                                                                                                                                                           | no        |
| glue_version	                           | Версия AWS Glue, используемая для сессии. В настоящее время допустимы значения 2.0 и 3.0. Значение по умолчанию — 3.0.	                                                                                                                                                                       | no        |
| security_configuration	                 | Конфигурация безопасности, используемая для сессии.	                                                                                                                                                                                                                                            | no        |
| connections	                            | Список подключений, используемых в сессии, через запятую.	                                                                                                                                                                                                                                      | no        |
| conf	                                   | Специфическая конфигурация, используемая при старте Glue Interactive Session (аргумент `--conf`).	                                                                                                                                                                                             | no        |
| extra_py_files	                         | Дополнительные Python‑библиотеки, которые могут использоваться интерактивной сессией.                                                                                                                                                                                                           | no        |
| delta_athena_prefix	                    | Префикс для создания Athena‑совместимых таблиц для Delta‑таблиц (если не указан, Athena‑совместимая таблица не будет создана).                                                                                                                                                                  | no        |
| tags	                                   | Набор пар ключ‑значение (теги), принадлежащие сессии. Пример: `KeyName1=Value1,KeyName2=Value2`.                                                                                                                                                                                                | no        |
| seed_format	                            | По умолчанию `parquet`, может быть любым форматом, совместимым со Spark, например `csv` или `json`.                                                                                                                                                                                             | no        |
| seed_mode	                              | По умолчанию `overwrite` — seed‑данные будут перезаписаны. Можно указать `append`, если нужно только добавить новые данные.                                                                                                                                                                     | no        |
| default_arguments	                      | Набор параметров (ключ‑значение), передаваемых в сессию. Подробнее см. [Job parameters used by AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html). Пример: `--enable-continuous-cloudwatch-log=true,--enable-continuous-log-filter=true` | no        |
| glue_session_id                         | Повторное использование glue‑сессии для запуска нескольких команд `dbt run`: укажите идентификатор сессии, который нужно использовать.                                                                                                                                                         | no        | 
| glue_session_reuse                      | Повторное использование glue‑сессии для запуска нескольких команд `dbt run`: если установлено в true, сессия не будет закрыта; если false — будет закрыта.                                                                                                                                     | no        | 
| datalake_formats	                      | ACID‑формат data lake, используемый при выполнении merge: `hudi`, `ìceberg` или `delta`.                                                                                                                                                                                                        | no        |

## Configs

### Настройка таблиц

При материализации модели как `table` вы можете указать несколько дополнительных конфигураций, специфичных для плагина dbt‑spark, в дополнение к стандартным [настройкам моделей](/reference/model-configs).

| Option  | Описание                                        | Required?               | Example                  |
|---------|--------------------------------------------------|-------------------------|--------------------------|
| file_format | Формат файла, используемый при создании таблиц (`parquet`, `csv`, `json`, `text`, `jdbc` или `orc`). | Optional | `parquet`|
| partition_by  | Разделение создаваемой таблицы по указанным колонкам. Для каждого раздела создаётся отдельный каталог. | Optional                | `date_day`              |
| clustered_by  | Каждый раздел таблицы будет разбит на фиксированное количество бакетов по указанным колонкам. | Optional               | `country_code`              |
| buckets  | Количество бакетов при кластеризации | Required if `clustered_by` is specified                | `8`              |
| custom_location  | По умолчанию адаптер сохраняет данные по пути: `location path`/`schema`/`table`. Если вы не хотите использовать это поведение, можно задать собственное расположение в S3 с помощью этого параметра. | No | `s3://mycustombucket/mycustompath`              |
| hudi_options | При использовании `file_format: hudi` позволяет переопределить любые параметры конфигурации по умолчанию. | Optional | `{'hoodie.schema.on.read.enable': 'true'}` |
## Инкрементальные модели

dbt стремится предоставлять удобные и интуитивно понятные абстракции моделирования с помощью встроенных конфигураций и материализаций.

Поэтому плагин dbt‑glue активно использует конфигурацию [`incremental_strategy`](/docs/build/incremental-models). Эта настройка определяет, как именно будет выполняться инкрементальная материализация при запусках после первого. Возможны три значения:
 - **`append`** (по умолчанию): вставляет новые записи, не обновляя и не перезаписывая существующие данные.
 - **`insert_overwrite`**: если указан `partition_by`, перезаписывает разделы таблицы новыми данными. Если `partition_by` не указан, перезаписывает всю таблицу.
 - **`merge`** (только Apache Hudi и Apache Iceberg): сопоставляет записи по `unique_key`, обновляет старые записи и вставляет новые. (Если `unique_key` не указан, все новые данные просто вставляются, аналогично `append`.)

Каждая из этих стратегий имеет свои плюсы и минусы, которые рассмотрены ниже. Как и любую конфигурацию модели, `incremental_strategy` можно задать в `dbt_project.yml` или в блоке `config()` внутри файла модели.

**Примечания:**
Стратегия по умолчанию — **`insert_overwrite`**

### Стратегия `append`

При использовании стратегии `append` dbt выполняет оператор `insert into` со всеми новыми данными. Преимущество этой стратегии в её простоте и универсальности — она работает на всех платформах, для всех типов файлов, способов подключения и версий Apache Spark. Однако эта стратегия _не может_ обновлять, перезаписывать или удалять существующие данные, поэтому для многих источников данных возможна вставка дубликатов.

#### Исходный код
```sql
{{ config(
    materialized='incremental',
    incremental_strategy='append',
) }}

--  All rows returned by this query will be appended to the existing table

select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```
#### Код выполнения
```sql
create temporary view spark_incremental__dbt_tmp as

    select * from analytics.events

    where event_ts >= (select max(event_ts) from {{ this }})

;

insert into table analytics.spark_incremental
    select `date_day`, `users` from spark_incremental__dbt_tmp
```

### Стратегия `insert_overwrite`

Эта стратегия наиболее эффективна при использовании вместе с параметром `partition_by` в конфигурации модели. dbt выполнит [атомарный оператор `insert overwrite`](https://spark.apache.org/docs/latest/sql-ref-syntax-dml-insert-overwrite-table.html), который динамически заменяет все разделы, затронутые запросом. При использовании этой стратегии обязательно выбирайте _все_ релевантные данные для каждого раздела.

Если `partition_by` не указан, стратегия `insert_overwrite` атомарно заменит всё содержимое таблицы, перезаписав существующие данные только новыми записями. Схема колонок при этом сохраняется. В некоторых случаях это может быть полезно, так как минимизирует простой при перезаписи данных. По смыслу операция аналогична `truncate` + `insert` в других базах данных. Для атомарной замены таблиц в формате Delta используйте материализацию `table` (которая выполняет `create or replace`).

#### Исходный код
```sql
{{ config(
    materialized='incremental',
    partition_by=['date_day'],
    file_format='parquet'
) }}

/*
  Every partition returned by this query will be overwritten
  when this model runs
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

from events
group by 1
```

#### Код выполнения

```sql
create temporary view spark_incremental__dbt_tmp as

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

insert overwrite table analytics.spark_incremental
    partition (date_day)
    select `date_day`, `users` from spark_incremental__dbt_tmp
```

Указывать `insert_overwrite` в качестве стратегии необязательно, так как она используется по умолчанию, если стратегия не задана.

### Стратегия `merge`

**Совместимость:**
- Hudi : OK
- Delta Lake : OK
- Iceberg : OK
- Таблицы под управлением Lake Formation : в процессе

NB:

- Для Glue 3 необходимо настроить [Glue connectors](https://docs.aws.amazon.com/glue/latest/ug/connectors-chapter.html).

- Для Glue 4 используйте параметр `datalake_formats` в profile.yml.

При использовании коннектора убедитесь, что ваша IAM‑роль содержит следующие политики:
```
{
    "Sid": "access_to_connections",
    "Action": [
        "glue:GetConnection",
        "glue:GetConnections"
    ],
    "Resource": [
        "arn:aws:glue:<region>:<AWS Account>:catalog",
        "arn:aws:glue:<region>:<AWS Account>:connection/*"
    ],
    "Effect": "Allow"
}
```
и что к роли прикреплена управляемая политика `AmazonEC2ContainerRegistryReadOnly`.  
Также убедитесь, что вы выполнили инструкции по начальной настройке, описанные [здесь](https://docs.aws.amazon.com/glue/latest/ug/setting-up.html#getting-started-min-privs-connectors).

В этом [посте блога](https://aws.amazon.com/blogs/big-data/part-1-integrate-apache-hudi-delta-lake-apache-iceberg-datasets-at-scale-aws-glue-studio-notebook/) также объясняется, как настроить и использовать Glue Connectors.


#### Hudi

**Примечания по использованию:** стратегия инкремента `merge` с Hudi требует:
- Добавить `file_format: hudi` в конфигурацию таблицы
- Добавить `datalake_formats` в профиль: `datalake_formats: hudi`
  - Либо добавить подключение в профиль: `connections: name_of_your_hudi_connector`
- Добавить Kryo serializer в Interactive Session Config (в профиле): `conf: spark.serializer=org.apache.spark.serializer.KryoSerializer --conf spark.sql.hive.convertMetastoreParquet=false`

dbt выполнит [атомарный `merge`‑statement](https://hudi.apache.org/docs/writing_data#spark-datasource-writer), который выглядит почти идентично поведению merge по умолчанию в Snowflake и BigQuery. Если указан `unique_key` (рекомендуется), dbt обновит старые записи значениями из новых записей, которые совпадают по ключевой колонке. Если `unique_key` не указан, dbt не будет использовать критерии сопоставления и просто вставит все новые записи (аналогично стратегии `append`).

#### Пример конфигурации профиля
```yaml
test_project:
  target: dev
  outputs:
    dev:
      type: glue
      query-comment: my comment
      role_arn: arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
      region: eu-west-1
      glue_version: "4.0"
      workers: 2
      worker_type: G.1X
      schema: "dbt_test_project"
      session_provisioning_timeout_in_seconds: 120
      location: "s3://aws-dbt-glue-datalake-1234567890-eu-west-1/"
      conf: spark.serializer=org.apache.spark.serializer.KryoSerializer --conf spark.sql.hive.convertMetastoreParquet=false
      datalake_formats: hudi
```

#### Пример исходного кода
```sql
{{ config(
    materialized='incremental',
    incremental_strategy='merge',
    unique_key='user_id',
    file_format='hudi',
    hudi_options={
        'hoodie.datasource.write.precombine.field': 'eventtime',
    }
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

#### Delta

Вы также можете использовать Delta Lake, чтобы иметь возможность применять merge к таблицам.

**Примечания по использованию:** стратегия инкремента `merge` с Delta требует:
- Добавить `file_format: delta` в конфигурацию таблицы
- Добавить `datalake_formats` в профиль: `datalake_formats: delta`
  - Либо добавить подключение в профиль: `connections: name_of_your_delta_connector`
- Добавить следующую конфигурацию в Interactive Session Config (в профиле): `conf: "spark.sql.extensions=io.delta.sql.DeltaSparkSessionExtension --conf spark.sql.catalog.spark_catalog=org.apache.spark.sql.delta.catalog.DeltaCatalog`

**Athena:** Athena по умолчанию не совместима с delta‑таблицами, но вы можете настроить адаптер так, чтобы он создавал таблицы Athena поверх вашей delta‑таблицы. Для этого нужно настроить в профиле следующие опции:
- Для Delta Lake 2.1.0, нативно поддерживаемого в Glue 4.0: `extra_py_files: "/opt/aws_glue_connectors/selected/datalake/delta-core_2.12-2.1.0.jar"`
- Для Delta Lake 1.0.0, нативно поддерживаемого в Glue 3.0: `extra_py_files: "/opt/aws_glue_connectors/selected/datalake/delta-core_2.12-1.0.0.jar"`
- `delta_athena_prefix: "the_prefix_of_your_choice"`
- Если ваша таблица партиционирована, добавление новых партиций не происходит автоматически — после добавления каждой новой партиции нужно выполнять `MSCK REPAIR TABLE your_delta_table`

#### Пример конфигурации профиля
```yaml
test_project:
  target: dev
  outputs:
    dev:
      type: glue
      query-comment: my comment
      role_arn: arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
      region: eu-west-1
      glue_version: "4.0"
      workers: 2
      worker_type: G.1X
      schema: "dbt_test_project"
      session_provisioning_timeout_in_seconds: 120
      location: "s3://aws-dbt-glue-datalake-1234567890-eu-west-1/"
      datalake_formats: delta
      conf: "spark.sql.extensions=io.delta.sql.DeltaSparkSessionExtension --conf spark.sql.catalog.spark_catalog=org.apache.spark.sql.delta.catalog.DeltaCatalog"
      extra_py_files: "/opt/aws_glue_connectors/selected/datalake/delta-core_2.12-2.1.0.jar"
      delta_athena_prefix: "delta"
```

#### Пример исходного кода
```sql
{{ config(
    materialized='incremental',
    incremental_strategy='merge',
    unique_key='user_id',
    partition_by=['dt'],
    file_format='delta'
) }}

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    user_id,
    max(date_day) as last_seen,
    current_date() as dt

from events
group by 1
```

#### Iceberg

**Примечания по использованию:** стратегия инкремента `merge` с Iceberg требует:
- Прикрепить managed policy AmazonEC2ContainerRegistryReadOnly к вашей execution role:
- Добавить следующую политику к вашей execution role, чтобы включить commit locking в таблице DynamoDB (подробнее [здесь](https://iceberg.apache.org/docs/latest/aws/#dynamodb-lock-manager)). Обратите внимание: таблица DynamoDB, указанная в поле resource этой политики, должна совпадать с той, что указана в ваших dbt profiles (`--conf spark.sql.catalog.glue_catalog.lock.table=myGlueLockTable`). По умолчанию эта таблица называется `myGlueLockTable` и создаётся автоматически (с On-Demand Pricing) при запуске модели dbt-glue с инкрементальной материализацией и форматом файла Iceberg. Если вы хотите назвать таблицу иначе или создать свою таблицу, не позволяя Glue делать это за вас, укажите параметр `iceberg_glue_commit_lock_table` с именем вашей таблицы (например, `MyDynamoDbTable`) в профиле dbt.
```yaml
iceberg_glue_commit_lock_table: "MyDynamoDbTable"
```
- Последний коннектор для Iceberg в AWS Marketplace использует версию 0.14.0 для Glue 3.0 и версию 1.2.1 для Glue 4.0. В Glue 4.0 Kryo serialization падает при записи Iceberg, поэтому вместо этого используйте `"org.apache.spark.serializer.JavaSerializer"` для `spark.serializer`. Подробнее [здесь](https://github.com/apache/iceberg/pull/546).

Убедитесь, что вы обновили `conf`, добавив `--conf spark.sql.catalog.glue_catalog.lock.table=<YourDynamoDBLockTableName>`, и что вы заменили IAM‑права ниже на корректное имя вашей таблицы.
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CommitLockTable",
            "Effect": "Allow",
            "Action": [
                "dynamodb:CreateTable",
                "dynamodb:BatchGetItem",
                "dynamodb:BatchWriteItem",
                "dynamodb:ConditionCheckItem",
                "dynamodb:PutItem",
                "dynamodb:DescribeTable",
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:UpdateItem"
            ],
            "Resource": "arn:aws:dynamodb:<AWS_REGION>:<AWS_ACCOUNT_ID>:table/myGlueLockTable"
        }
    ]
}
```
- Добавить `file_format: Iceberg` в конфигурацию таблицы
- Добавить `datalake_formats` в профиль: `datalake_formats: iceberg`
  - Либо добавить connections в профиль: `connections: name_of_your_iceberg_connector` (
    - Для Athena версии 3:
      - Адаптер совместим с Iceberg Connector из AWS Marketplace с Fulfillment option Glue 3.0 и версией ПО 0.14.0 (11 октября 2022)
      - Последний коннектор для Iceberg в AWS Marketplace использует версию 0.14.0 для Glue 3.0 и версию 1.2.1 для Glue 4.0. В Glue 4.0 Kryo serialization падает при записи Iceberg, поэтому вместо этого используйте "org.apache.spark.serializer.JavaSerializer" для spark.serializer. Подробнее [здесь](https://github.com/apache/iceberg/pull/546)
    - Для Athena версии 2: адаптер совместим с Iceberg Connector из AWS Marketplace с Fulfillment option Glue 3.0 и версией ПО 0.12.0-2 (14 февраля 2022)
- Добавить следующую конфигурацию в Interactive Session Config (в профиле):
```--conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions 
    --conf spark.serializer=org.apache.spark.serializer.KryoSerializer
    --conf spark.sql.warehouse=s3://<your-bucket-name>
    --conf spark.sql.catalog.glue_catalog=org.apache.iceberg.spark.SparkCatalog 
    --conf spark.sql.catalog.glue_catalog.catalog-impl=org.apache.iceberg.aws.glue.GlueCatalog 
    --conf spark.sql.catalog.glue_catalog.io-impl=org.apache.iceberg.aws.s3.S3FileIO 
    --conf spark.sql.catalog.glue_catalog.lock-impl=org.apache.iceberg.aws.dynamodb.DynamoDbLockManager
    --conf spark.sql.catalog.glue_catalog.lock.table=myGlueLockTable  
    --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions
```
  - Для Glue 3.0 вместо этого установите `spark.sql.catalog.glue_catalog.lock-impl` в `org.apache.iceberg.aws.glue.DynamoLockManager`

dbt выполнит [атомарный `merge`‑statement](https://iceberg.apache.org/docs/latest/spark-writes/), который выглядит почти идентично поведению merge по умолчанию в Snowflake и BigQuery. Чтобы выполнить merge, нужно указать `unique_key`, иначе операция завершится ошибкой. Этот ключ нужно указывать в формате Python‑списка; он может содержать несколько имён колонок, чтобы создать составной (composite) unique_key.

##### Примечания
- При использовании custom_location в Iceberg избегайте завершающего слэша. Добавление завершающего слэша приводит к некорректной обработке location и проблемам при чтении данных движками запросов, например Trino. Проблема должна быть исправлена для Iceberg версии > 0.13. Связанный issue на GitHub — [здесь](https://github.com/apache/iceberg/issues/4582).
- Iceberg также поддерживает стратегии `insert_overwrite` и `append`.
- Параметр `warehouse` в `conf` обязателен, но переопределяется значением `location` в профиле адаптера или `custom_location` в конфигурации модели.
- По умолчанию у этой материализации `iceberg_expire_snapshots` установлен в 'True'. Если вам нужно сохранять исторические изменения для аудита, задайте: `iceberg_expire_snapshots='False'`.
- Сейчас из‑за некоторых внутренних особенностей dbt iceberg‑каталог, который используется внутри при запуске glue interactive sessions с dbt-glue, имеет захардкоженное имя `glue_catalog`. Это имя — алиас, указывающий на AWS Glue Catalog, но он специфичен для каждой сессии. Если вы хотите работать с данными в другой сессии без dbt-glue (например, из Glue Studio notebook), вы можете настроить другой алиас (то есть другое имя для Iceberg Catalog). Чтобы проиллюстрировать это, в конфигурационном файле можно задать: 
```
--conf spark.sql.catalog.RandomCatalogName=org.apache.iceberg.spark.SparkCatalog
```
Затем запустите сессию в AWS Glue Studio Notebook со следующей конфигурацией:
```
--conf spark.sql.catalog.AnotherRandomCatalogName=org.apache.iceberg.spark.SparkCatalog
```
В обоих случаях базовым каталогом будет AWS Glue Catalog, уникальный для вашего AWS Account и Region, и вы сможете работать с ровно теми же данными. Также убедитесь, что если вы меняете имя алиаса Glue Catalog, вы меняете его во всех остальных `--conf`, где он используется:
```
 --conf spark.sql.catalog.RandomCatalogName=org.apache.iceberg.spark.SparkCatalog 
 --conf spark.sql.catalog.RandomCatalogName.catalog-impl=org.apache.iceberg.aws.glue.GlueCatalog 
 ...
 --conf spark.sql.catalog.RandomCatalogName.lock-impl=org.apache.iceberg.aws.glue.DynamoLockManager
```
- Полная справка по `table_properties` доступна [здесь](https://iceberg.apache.org/docs/latest/configuration/).
- Таблицы Iceberg нативно поддерживаются Athena. Поэтому вы можете выполнять запросы к таблицам, созданным и обслуживаемым адаптером dbt-glue, из Athena.
- Инкрементальная материализация с форматом файла Iceberg поддерживает dbt snapshot. Вы можете запустить команду dbt snapshot, которая делает запрос к таблице Iceberg, и создать для неё snapshot в стиле dbt.

#### Пример конфигурации профиля
```yaml
test_project:
  target: dev
  outputs:
    dev:
      type: glue
      query-comment: my comment
      role_arn: arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
      region: eu-west-1
      glue_version: "4.0"
      workers: 2
      worker_type: G.1X
      schema: "dbt_test_project"
      session_provisioning_timeout_in_seconds: 120
      location: "s3://aws-dbt-glue-datalake-1234567890-eu-west-1/"
      datalake_formats: iceberg
      conf: --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions --conf spark.serializer=org.apache.spark.serializer.KryoSerializer --conf spark.sql.warehouse=s3://aws-dbt-glue-datalake-1234567890-eu-west-1/dbt_test_project --conf spark.sql.catalog.glue_catalog=org.apache.iceberg.spark.SparkCatalog --conf spark.sql.catalog.glue_catalog.catalog-impl=org.apache.iceberg.aws.glue.GlueCatalog --conf spark.sql.catalog.glue_catalog.io-impl=org.apache.iceberg.aws.s3.S3FileIO --conf spark.sql.catalog.glue_catalog.lock-impl=org.apache.iceberg.aws.dynamodb.DynamoDbLockManager --conf spark.sql.catalog.glue_catalog.lock.table=myGlueLockTable  --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions 
```

#### Пример исходного кода
```sql
{{ config(
    materialized='incremental',
    incremental_strategy='merge',
    unique_key=['user_id'],
    file_format='iceberg',
    iceberg_expire_snapshots='False', 
    partition_by=['status']
    table_properties={'write.target-file-size-bytes': '268435456'}
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
#### Пример исходного кода Iceberg Snapshot

<VersionBlock firstVersion="1.9">

```sql

{% snapshot demosnapshot %}

{{
    config(
        strategy='timestamp',
        schema='jaffle_db',
        updated_at='dt',
        file_format='iceberg'
) }}

select * from {{ ref('customers') }}

{% endsnapshot %}

```

</VersionBlock>

## Мониторинг Glue Interactive Session

Мониторинг — важная часть поддержания надёжности, доступности
и производительности AWS Glue и ваших других AWS‑решений. AWS предоставляет инструменты мониторинга,
которые можно использовать, чтобы наблюдать за AWS Glue, определить нужное количество workers
для вашей Glue Interactive Session, сообщать, когда что-то идёт не так, и
при необходимости автоматически предпринимать действия. AWS Glue предоставляет Spark UI,
а также логи и метрики CloudWatch для мониторинга ваших AWS Glue jobs.
Подробнее: [Monitoring AWS Glue Spark jobs](https://docs.aws.amazon.com/glue/latest/dg/monitor-spark.html)

**Примечания по использованию:** для мониторинга требуется:
- Добавить следующую IAM‑политику к вашей IAM role:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CloudwatchMetrics",
            "Effect": "Allow",
            "Action": "cloudwatch:PutMetricData",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "cloudwatch:namespace": "Glue"
                }
            }
        },
        {
            "Sid": "CloudwatchLogs",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "logs:CreateLogStream",
                "logs:CreateLogGroup",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:*:*:/aws-glue/*",
                "arn:aws:s3:::bucket-to-write-sparkui-logs/*"
            ]
        }
    ]
}
```

- Добавить параметры мониторинга в Interactive Session Config (в профиле).
Подробнее см. [Job parameters used by AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

#### Пример конфигурации профиля
```yaml
test_project:
  target: dev
  outputs:
    dev:
      type: glue
      query-comment: my comment
      role_arn: arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
      region: eu-west-1
      glue_version: "4.0"
      workers: 2
      worker_type: G.1X
      schema: "dbt_test_project"
      session_provisioning_timeout_in_seconds: 120
      location: "s3://aws-dbt-glue-datalake-1234567890-eu-west-1/"
      default_arguments: "--enable-metrics=true, --enable-continuous-cloudwatch-log=true, --enable-continuous-log-filter=true, --enable-spark-ui=true, --spark-event-logs-path=s3://bucket-to-write-sparkui-logs/dbt/"
```

Если вы хотите использовать Spark UI, вы можете запустить Spark history server с помощью
шаблона AWS CloudFormation, который размещает сервер на EC2‑инстансе,
или запустить локально с помощью Docker. Подробнее см. [Launching the Spark history server](https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-history.html#monitor-spark-ui-history-local)

## Включение AWS Glue Auto Scaling
Auto Scaling доступен начиная с AWS Glue версии 3.0 и выше. Подробнее см.
в посте AWS: ["Introducing AWS Glue Auto Scaling: Automatically resize serverless computing resources for lower cost with optimized Apache Spark"](https://aws.amazon.com/blogs/big-data/introducing-aws-glue-auto-scaling-automatically-resize-serverless-computing-resources-for-lower-cost-with-optimized-apache-spark/)

При включённом Auto Scaling вы получаете следующие преимущества:

* AWS Glue автоматически добавляет и удаляет workers из кластера в зависимости от параллелизма на каждом этапе или microbatch выполнения job.

* Не нужно экспериментировать и решать, сколько workers назначать для ваших AWS Glue Interactive sessions.

* После того как вы выберете максимальное число workers, AWS Glue подберёт ресурсы нужного размера для нагрузки.

* Вы можете увидеть, как меняется размер кластера во время выполнения Glue Interactive sessions, посмотрев метрики CloudWatch.
Подробнее см. [Monitoring your Glue Interactive Session](#Monitoring-your-Glue-Interactive-Session).

**Примечания по использованию:** для AWS Glue Auto Scaling требуется:
- Установить AWS Glue версии 3.0 или выше.
- Задать максимальное число workers (если Auto Scaling включён, параметр `workers`
задаёт максимальное число workers)
- Указать параметр `--enable-auto-scaling=true` в Glue Interactive Session Config (в профиле).
Подробнее см. [Job parameters used by AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

#### Пример конфигурации профиля
```yaml
test_project:
  target: dev
  outputs:
    dev:
      type: glue
      query-comment: my comment
      role_arn: arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
      region: eu-west-1
      glue_version: "3.0"
      workers: 2
      worker_type: G.1X
      schema: "dbt_test_project"
      session_provisioning_timeout_in_seconds: 120
      location: "s3://aws-dbt-glue-datalake-1234567890-eu-west-1/"
      default_arguments: "--enable-auto-scaling=true"
```

## Доступ к Glue catalog в другом AWS account
Во многих случаях вам может понадобиться запускать dbt jobs, чтобы читать данные из другого AWS account.

Ознакомьтесь со ссылкой https://repost.aws/knowledge-center/glue-tables-cross-accounts, чтобы настроить политики доступа в source и target accounts.

Добавьте `"spark.hadoop.hive.metastore.glue.catalogid=<AWS-ACCOUNT-ID>"` в `conf` в dbt profile — так вы сможете иметь несколько outputs для каждого account, к которому у вас есть доступ.

Примечание: кросс‑аккаунтный доступ должен быть в пределах одного и того же AWS Region.
#### Пример конфигурации профиля
```yaml
test_project:
  target: dev
  outputsAccountB:
    dev:
      type: glue
      query-comment: my comment
      role_arn: arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
      region: eu-west-1
      glue_version: "3.0"
      workers: 2
      worker_type: G.1X
      schema: "dbt_test_project"
      session_provisioning_timeout_in_seconds: 120
      location: "s3://aws-dbt-glue-datalake-1234567890-eu-west-1/"
      conf: "--conf hive.metastore.client.factory.class=com.amazonaws.glue.catalog.metastore.AWSGlueDataCatalogHiveClientFactory 
             --conf spark.hadoop.hive.metastore.glue.catalogid=<TARGET-AWS-ACCOUNT-ID-B>"
```

## Сохранение описаний моделей

Поддерживается сохранение документации на уровне relations. Для получения
дополнительной информации о настройке сохранения документации см. [документацию](/reference/resource-configs/persist_docs).

Когда опция `persist_docs` настроена соответствующим образом, вы сможете
видеть описания моделей в поле `Comment` вывода команды `describe [table] extended`
или `show table extended in [database] like '*'`.

## Всегда `schema`, никогда `database`

Apache Spark использует термины «schema» и «database» как взаимозаменяемые. dbt же
понимает `database` как уровень, находящийся выше, чем `schema`. Поэтому при работе с dbt-glue
вам _никогда_ не следует использовать или задавать `database` ни в конфигурации узлов, ни в целевом профиле.

Если вы хотите управлять схемой/базой данных, в которой dbt будет материализовывать модели,
используйте только конфигурацию `schema` и макрос `generate_schema_name`.
Подробнее см. документацию dbt о [пользовательских схемах](/docs/build/custom-schemas).

## Интеграция с AWS Lake Formation
Адаптер поддерживает управление тегами AWS Lake Formation, позволяя ассоциировать существующие теги, определённые вне dbt-glue, с объектами базы данных, создаваемыми dbt-glue (database, table, view, snapshot, incremental models, seeds).

- Вы можете включать или отключать управление lf‑тегами через конфигурацию на уровне модели и dbt‑project (по умолчанию отключено)
- Если включено, lf‑теги будут обновляться при каждом запуске dbt. Поддерживаются конфигурации lf‑тегов на уровне таблиц и на уровне колонок.
- Вы можете указать, что хотите удалить существующие теги Lake Formation на уровне базы данных, таблицы или колонок, установив поле конфигурации `drop_existing` в значение True (по умолчанию False, что означает сохранение существующих тегов)
- Обратите внимание: если тег, который вы хотите связать с таблицей, не существует, выполнение dbt-glue завершится ошибкой

Адаптер также поддерживает фильтрацию ячеек данных (data cell filtering) AWS Lake Formation.
- Вы можете включать или отключать фильтрацию ячеек данных через конфигурацию на уровне модели и dbt‑project (по умолчанию отключено)
- Если включено, `data_cell_filters` будут обновляться при каждом запуске dbt
- Вы можете указать, что хотите удалить существующие фильтры ячеек данных таблицы, установив поле `drop_existing` в значение True (по умолчанию False, что означает сохранение существующих фильтров)
- Для реализации безопасности на уровне колонок вы можете использовать **OR** поле `excluded_columns_names` **OR** поле `columns`. **Обратите внимание, что можно использовать только одно из них, но не оба одновременно**.
- По умолчанию, если вы не указываете ни `columns`, ни `excluded_columns`, dbt-glue не выполняет фильтрацию на уровне колонок и позволяет принципалу доступ ко всем колонкам.

Приведённая ниже конфигурация позволяет указанному принципалу (IAM‑пользователь lf-data-scientist) получать доступ к строкам, у которых `customer_lifetime_value > 15`, и ко всем указанным колонкам (`customer_id`, `first_order`, `most_recent_order`, `number_of_orders`):

```sql
lf_grants={
        'data_cell_filters': {
            'enabled': True,
            'drop_existing' : True,
            'filters': {
                'the_name_of_my_filter': {
                    'row_filter': 'customer_lifetime_value>15',
                    'principals': ['arn:aws:iam::123456789:user/lf-data-scientist'], 
                    'column_names': ['customer_id', 'first_order', 'most_recent_order', 'number_of_orders']
                }
            }, 
        }
    }
```
Следующая конфигурация позволяет указанному принципалу (IAM‑пользователь lf-data-scientist) получать доступ к строкам, у которых `customer_lifetime_value > 15`, и ко всем колонкам, *кроме* указанной (`first_name`):

```sql
lf_grants={
        'data_cell_filters': {
            'enabled': True,
            'drop_existing' : True,
            'filters': {
                'the_name_of_my_filter': {
                    'row_filter': 'customer_lifetime_value>15',
                    'principals': ['arn:aws:iam::123456789:user/lf-data-scientist'], 
                    'excluded_column_names': ['first_name']
                }
            }, 
        }
    }
```

Ниже приведены примеры того, как можно интегрировать управление LF‑тегами и фильтрацию ячеек данных в ваши конфигурации:

#### На уровне модели
Такой способ задания правил Lake Formation подходит, если вы хотите управлять политиками тегирования и фильтрации на уровне отдельных объектов. Помните, что он переопределяет любую конфигурацию, заданную на уровне dbt‑project.

```sql
{{ config(
    materialized='incremental',
    unique_key="customer_id",
    incremental_strategy='append',
    lf_tags_config={
          'enabled': true,
          'drop_existing' : False,
          'tags_database': 
          {
            'name_of_my_db_tag': 'value_of_my_db_tag'          
            }, 
          'tags_table': 
          {
            'name_of_my_table_tag': 'value_of_my_table_tag'          
            }, 
          'tags_columns': {
            'name_of_my_lf_tag': {
              'value_of_my_tag': ['customer_id', 'customer_lifetime_value', 'dt']
            }}},
    lf_grants={
        'data_cell_filters': {
            'enabled': True,
            'drop_existing' : True,
            'filters': {
                'the_name_of_my_filter': {
                    'row_filter': 'customer_lifetime_value>15',
                    'principals': ['arn:aws:iam::123456789:user/lf-data-scientist'], 
                    'excluded_column_names': ['first_name']
                }
            }, 
        }
    }
) }}

    select
        customers.customer_id,
        customers.first_name,
        customers.last_name,
        customer_orders.first_order,
        customer_orders.most_recent_order,
        customer_orders.number_of_orders,
        customer_payments.total_amount as customer_lifetime_value,
        current_date() as dt
        
    from customers

    left join customer_orders using (customer_id)

    left join customer_payments using (customer_id)

```

#### На уровне dbt-project
Таким образом вы можете задать теги и политику фильтрации данных для определённого пути в вашем dbt‑проекте (например, models, seeds, models/model_group1 и т.д.).
Это особенно полезно для seeds, для которых нельзя задать конфигурацию непосредственно в файле.

```yml
seeds:
  +lf_tags_config:
    enabled: true
    tags_table: 
      name_of_my_table_tag: 'value_of_my_table_tag'  
    tags_database: 
      name_of_my_database_tag: 'value_of_my_database_tag'
models:
  +lf_tags_config:
    enabled: true
    drop_existing: True
    tags_database: 
      name_of_my_database_tag: 'value_of_my_database_tag'
    tags_table: 
      name_of_my_table_tag: 'value_of_my_table_tag'
```

## Тесты

Для выполнения функционального тестирования:
1. Установите зависимости для разработки:
```bash
$ pip3 install -r dev-requirements.txt
```

2. Установите пакет локально в dev‑режиме
```bash
$ python3 setup.py build && python3 setup.py install_lib
```

3. Экспортируйте переменные окружения
```bash
$ export DBT_S3_LOCATION=s3://mybucket/myprefix
$ export DBT_ROLE_ARN=arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
```

4. Запустите тесты
```bash
$ python3 -m pytest tests/functional
```

Для получения дополнительной информации см. документацию dbt о [тестировании нового адаптера](/guides/adapter-creation).

## Ограничения

### Поддерживаемая функциональность

Большая часть функциональности <Constant name="core" /> поддерживается, однако некоторые возможности доступны только при использовании Apache Hudi.

Функции, доступные только с Apache Hudi:
1. Инкрементальные обновления моделей по `unique_key` вместо `partition_by` (см. [стратегию `merge`](/reference/resource-configs/glue-configs#the-merge-strategy))


Некоторые возможности dbt, доступные в core‑адаптерах, пока не поддерживаются в Glue:
1. [Сохранение](/reference/resource-configs/persist_docs) описаний колонок в виде комментариев базы данных
2. [Snapshots](/docs/build/snapshots)
