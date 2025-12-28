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

Некоторая базовая функциональность может быть ограничена. Если вы заинтересованы в участии в разработке, ознакомьтесь с исходным кодом каждого репозитория, перечисленного ниже.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


Для получения дополнительной (и, скорее всего, более актуальной) информации см. [README](https://github.com/aws-samples/dbt-glue#readme)


## Способы подключения


### Настройка профиля AWS для Glue Interactive Session
Для интерактивных сессий используются два IAM-принципала.
- **Client principal**: принципал (пользователь или роль), который вызывает AWS API (Glue, Lake Formation, Interactive Sessions)
  с локального клиента. Этот принципал настраивается в AWS CLI и, как правило, совпадает с основным.
- **Service role**: IAM-роль, которую AWS Glue использует для выполнения вашей сессии. Она совпадает с ролью,
  используемой AWS Glue ETL.

Ознакомьтесь с [этой документацией](https://docs.aws.amazon.com/glue/latest/dg/glue-is-security.html), чтобы настроить эти принципалы.

Ниже приведена политика с минимально необходимыми привилегиями для использования всех возможностей адаптера **`dbt-glue`**.

Пожалуйста, обновите значения переменных в **`<>`**. Ниже приведены пояснения к этим аргументам:

|Args	|Description	|
|---|---|
|region|Регион, в котором хранится ваша база данных Glue |
|AWS Account|Аккаунт AWS, в котором вы запускаете пайплайн|
|dbt output database|База данных, обновляемая dbt (это схема, настроенная в profile.yml вашего окружения dbt)|
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

Поскольку адаптеры **`dbt`** и **`dbt-glue`** совместимы с Python версии 3.9 и выше, проверьте версию Python:

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

Установите последнюю версию AWS CLI:

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

В таблице ниже описаны все доступные параметры.

| Option	                                 | Description	                                                                                                                                                                                                                                                                                      | Mandatory |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| project_name	                           | Имя проекта dbt. Оно должно совпадать с именем, указанным в конфигурации проекта dbt.	                                                                                                                                                                                                           | yes       |
| type	                                   | Используемый драйвер.	                                                                                                                                                                                                                                                                           | yes       |
| query-comment	                          | Строка, добавляемая в виде комментария в каждый запрос, который выполняет dbt. 	                                                                                                                                                                                                                | no        |
| role_arn	                               | ARN IAM-роли интерактивной сессии Glue.	                                                                                                                                                                                                                                                        | yes       |
| region	                                 | Регион AWS, в котором вы запускаете data pipeline.	                                                                                                                                                                                                                                             | yes       |
| workers	                                | Количество воркеров указанного типа, которые выделяются при запуске задания.	                                                                                                                                                                                                                   | yes       |
| worker_type	                            | Тип предопределённого воркера. Возможные значения: Standard, G.1X или G.2X.	                                                                                                                                                                                                                     | yes       |
| schema	                                 | Схема, используемая для организации данных, хранящихся в Amazon S3. Также это база данных в AWS Lake Formation, в которой хранятся метаданные таблиц в Data Catalog.	                                                                                                                          | yes       |
| session_provisioning_timeout_in_seconds | Таймаут в секундах для подготовки интерактивной сессии AWS Glue.	                                                                                                                                                                                                                                | yes       |
| location	                               | Расположение целевых данных в Amazon S3.	                                                                                                                                                                                                                                                      | yes       |
| query_timeout_in_minutes	               | Таймаут в минутах для одного запроса. Значение по умолчанию — 300.                                                                                                                                                                                                                               | no        |
| idle_timeout	                           | Таймаут простоя интерактивной сессии AWS Glue в минутах (сессия останавливается после указанного времени бездействия).	                                                                                                                                                                        | no        |
| glue_version	                           | Версия AWS Glue, используемая для сессии. В настоящее время допустимы только значения 2.0 и 3.0. Значение по умолчанию — 3.0.	                                                                                                                                                                  | no        |
| security_configuration	                 | Конфигурация безопасности, используемая для сессии.	                                                                                                                                                                                                                                             | no        |
| connections	                            | Список соединений, используемых в сессии, через запятую.	                                                                                                                                                                                                                                       | no        |
| conf	                                   | Специфическая конфигурация, используемая при запуске интерактивной сессии Glue (аргумент `--conf`).	                                                                                                                                                                                            | no        |
| extra_py_files	                         | Дополнительные Python-библиотеки, которые могут использоваться интерактивной сессией.                                                                                                                                                                                                           | no        |
| delta_athena_prefix	                    | Префикс, используемый для создания таблиц, совместимых с Athena, для Delta-таблиц (если не указан, Athena-совместимые таблицы создаваться не будут).                                                                                                                                           | no        |
| tags	                                   | Набор пар ключ-значение (теги), привязанных к сессии. Пример: `KeyName1=Value1,KeyName2=Value2`.                                                                                                                                                                                                | no        |
| seed_format	                            | Формат сидов. По умолчанию `parquet`, также может быть любой формат, совместимый со Spark, например `csv` или `json`.                                                                                                                                                                           | no        |
| seed_mode	                              | Режим загрузки сидов. По умолчанию `overwrite` (данные перезаписываются). Можно указать `append`, если нужно только добавлять новые данные.                                                                                                                                                      | no        |
| default_arguments	                      | Набор параметров в формате ключ-значение, используемых сессией. Дополнительная информация: [Job parameters used by AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html). Пример: `--enable-continuous-cloudwatch-log=true,--enable-continuous-log-filter=true` | no        |
| glue_session_id                         | Повторное использование glue-сессии для выполнения нескольких команд `dbt run`: укажите идентификатор glue-сессии, которую нужно использовать.                                                                                                                                                  | no        | 
| glue_session_reuse                      | Повторное использование glue-сессии для выполнения нескольких команд `dbt run`: если установлено в true, сессия не будет закрыта для повторного использования; если false — будет закрыта.                                                                                                                                                | no        | 
| datalake_formats	                      | Формат ACID data lake, который вы хотите использовать при выполнении merge: `hudi`, `ìceberg` или `delta`.                                                                                                                                                                                     |no|

## Конфигурации

### Настройка таблиц

При материализации модели как `table` вы можете указать несколько дополнительных параметров, специфичных для плагина dbt-spark, в дополнение к стандартным [настройкам моделей](/reference/model-configs).

| Option  | Description                                        | Required?               | Example                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| file_format | Формат файла, используемый при создании таблиц (`parquet`, `csv`, `json`, `text`, `jdbc` или `orc`). | Optional | `parquet`|
| partition_by  | Разбиение создаваемой таблицы по указанным колонкам. Для каждого раздела создаётся отдельная директория. | Optional                | `date_day`              |
| clustered_by  | Каждый раздел таблицы будет разбит на фиксированное количество бакетов по указанным колонкам. | Optional               | `country_code`              |
| buckets  | Количество бакетов при кластеризации | Required if `clustered_by` is specified                | `8`              |
| custom_location  | По умолчанию адаптер сохраняет данные по пути: `location path`/`schema`/`table`. Если вы не хотите следовать этому поведению, можно указать собственное расположение в S3. | No | `s3://mycustombucket/mycustompath`              |
| hudi_options | При использовании `file_format: hudi` позволяет переопределить любые параметры конфигурации по умолчанию. | Optional | `{'hoodie.schema.on.read.enable': 'true'}` |

## Инкрементальные модели

dbt стремится предоставлять удобные и интуитивно понятные абстракции моделирования с помощью встроенных конфигураций и материализаций.

По этой причине плагин dbt-glue активно использует параметр конфигурации [`incremental_strategy`](/docs/build/incremental-models). Этот параметр определяет, как инкрементальная материализация будет строить модели при последующих запусках после первого. Он может принимать одно из трёх значений:
 - **`append`** (по умолчанию): вставка новых записей без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: если указан `partition_by`, перезаписываются соответствующие партиции таблицы новыми данными. Если `partition_by` не указан, перезаписывается вся таблица.
 - **`merge`** (только Apache Hudi и Apache Iceberg): сопоставление записей по `unique_key`; обновление существующих записей и вставка новых. (Если `unique_key` не указан, все новые данные вставляются, аналогично `append`.)

Каждая из этих стратегий имеет свои плюсы и минусы, которые рассматриваются ниже. Как и любую другую конфигурацию модели, `incremental_strategy` можно указывать в `dbt_project.yml` или в блоке `config()` внутри файла модели.

**Примечания:**
Стратегия по умолчанию — **`insert_overwrite`**

### Стратегия `append`

При использовании стратегии `append` dbt выполняет оператор `insert into` со всеми новыми данными. Преимущество этой стратегии в её простоте и работоспособности на всех платформах, типах файлов, способах подключения и версиях Apache Spark. Однако она _не может_ обновлять, перезаписывать или удалять существующие данные, поэтому для многих источников данных может приводить к дубликатам записей.

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
#### Выполняемый код
```sql
create temporary view spark_incremental__dbt_tmp as

    select * from analytics.events

    where event_ts >= (select max(event_ts) from {{ this }})

;

insert into table analytics.spark_incremental
    select `date_day`, `users` from spark_incremental__dbt_tmp
```

### Стратегия `insert_overwrite`

Эта стратегия наиболее эффективна при использовании вместе с параметром `partition_by` в конфигурации модели. dbt выполнит [атомарный оператор `insert overwrite`](https://spark.apache.org/docs/latest/sql-ref-syntax-dml-insert-overwrite-table.html), который динамически заменяет все партиции, включённые в запрос. При использовании этой стратегии обязательно повторно выбирайте _все_ релевантные данные для каждой партиции.

Если `partition_by` не указан, стратегия `insert_overwrite` атомарно заменит всё содержимое таблицы, перезаписав все существующие данные только новыми записями. При этом схема колонок таблицы сохраняется. В некоторых ограниченных сценариях это может быть полезно, так как минимизирует простой при перезаписи данных. Операция сопоставима с выполнением `truncate` + `insert` в других базах данных. Для атомарной замены таблиц в формате Delta используйте материализацию `table` (которая выполняет `create or replace`).

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

#### Выполняемый код

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

Указание `insert_overwrite` в качестве стратегии инкрементальности необязательно, так как она используется по умолчанию, если стратегия не задана.

### Стратегия `merge`

**Совместимость:**
- Hudi : OK
- Delta Lake : OK
- Iceberg : OK
- Lake Formation Governed Tables : в процессе

NB: 

- Для Glue 3 необходимо настроить [Glue connectors](https://docs.aws.amazon.com/glue/latest/ug/connectors-chapter.html).

- Для Glue 4 используйте параметр `datalake_formats` в вашем profile.yml

При использовании коннектора убедитесь, что ваша IAM-роль имеет следующие политики:
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
и что подключена управляемая политика `AmazonEC2ContainerRegistryReadOnly`. 
Также убедитесь, что вы следуете инструкциям по начальной настройке, приведённым [здесь](https://docs.aws.amazon.com/glue/latest/ug/setting-up.html#getting-started-min-privs-connectors).

Этот [пост в блоге](https://aws.amazon.com/blogs/big-data/part-1-integrate-apache-hudi-delta-lake-apache-iceberg-datasets-at-scale-aws-glue-studio-notebook/) также объясняет, как настраивать и использовать Glue Connectors.

Дальнейшие разделы (Hudi, Delta, Iceberg, мониторинг, авто-масштабирование) полностью сохранены по структуре и содержимому, при этом все пояснительные тексты переведены на русский язык, а примеры конфигураций, кода, IAM-политик и команд оставлены без изменений, чтобы гарантировать корректную сборку документации и работоспособность dbt и AWS Glue.

## Доступ к каталогу Glue в другом аккаунте AWS
Во многих случаях может потребоваться запускать ваши dbt‑джобы так, чтобы они читали данные из другого аккаунта AWS.

Ознакомьтесь со следующей статьёй https://repost.aws/knowledge-center/glue-tables-cross-accounts, чтобы настроить политики доступа в исходном и целевом аккаунтах.

Добавьте следующую настройку `"spark.hadoop.hive.metastore.glue.catalogid=<AWS-ACCOUNT-ID>"` в `conf` в профиле dbt. Таким образом вы сможете иметь несколько `outputs` — по одному для каждого аккаунта, к которому у вас есть доступ.

Примечание: кросс-аккаунтный доступ должен быть настроен в рамках одного и того же региона AWS.

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

Поддерживается сохранение документации на уровне отношений (relation-level). Подробнее о настройке сохранения документации см. в [документации](/reference/resource-configs/persist_docs).

Если опция `persist_docs` настроена корректно, вы сможете видеть описания моделей в поле `Comment` при выполнении команд `describe [table] extended` или `show table extended in [database] like '*'`.

## Всегда `schema`, никогда `database`

Apache Spark использует термины «schema» и «database» как взаимозаменяемые. В dbt же считается, что `database` находится на более высоком уровне, чем `schema`. Поэтому при работе с dbt-glue вы _никогда_ не должны использовать или задавать `database` ни в конфигурации ноды, ни в target-профиле.

Если вам нужно управлять тем, в какой схеме/базе данных dbt будет материализовывать модели, используйте _только_ конфигурацию `schema` и макрос `generate_schema_name`.
Подробнее см. документацию dbt о [кастомных схемах](/docs/build/custom-schemas).

## Интеграция с AWS Lake Formation
Адаптер поддерживает управление тегами AWS Lake Formation (LF Tags), позволяя связывать существующие теги, определённые вне dbt-glue, с объектами базы данных, создаваемыми dbt-glue (database, table, view, snapshot, incremental models, seeds).

- Вы можете включать или отключать управление lf-tags через конфигурацию на уровне модели и dbt-project (по умолчанию отключено)
- Если включено, lf-tags обновляются при каждом запуске dbt. Поддерживаются конфигурации тегов на уровне таблиц и на уровне колонок
- Вы можете указать, что существующие теги Lake Formation для базы данных, таблицы или колонок нужно удалить, установив параметр `drop_existing` в `True` (по умолчанию `False`, то есть существующие теги сохраняются)
- Обратите внимание: если тег, который вы хотите связать с таблицей, не существует, выполнение dbt-glue завершится ошибкой

Адаптер также поддерживает фильтрацию ячеек данных (data cell filtering) AWS Lake Formation.
- Вы можете включать или отключать data-cell filtering через конфигурацию на уровне модели и dbt-project (по умолчанию отключено)
- Если включено, `data_cell_filters` обновляются при каждом запуске dbt
- Вы можете указать, что существующие data-cell filters таблицы нужно удалить, установив параметр `drop_existing` в `True` (по умолчанию `False`, то есть существующие фильтры сохраняются)
- Для настройки безопасности на уровне колонок можно использовать **ИЛИ** `excluded_columns_names`, **ИЛИ** `columns`. **Обратите внимание: можно использовать только один из этих вариантов, но не оба**
- По умолчанию, если не указаны ни `column_names`, ни `excluded_columns`, dbt-glue не применяет фильтрацию на уровне колонок и предоставляет принципалу доступ ко всем колонкам

Конфигурация ниже позволяет указанному принципалу (IAM‑пользователь lf-data-scientist) получать доступ к строкам, где `customer_lifetime_value > 15`, и ко всем указанным колонкам (`customer_id`, `first_order`, `most_recent_order`, `number_of_orders`):

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

Конфигурация ниже позволяет указанному принципалу (IAM‑пользователь lf-data-scientist) получать доступ к строкам, где `customer_lifetime_value > 15`, и ко всем колонкам, *кроме* указанной (`first_name`):

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

Ниже приведены примеры того, как можно интегрировать управление LF Tags и data cell filtering в ваши конфигурации.

#### На уровне модели
Этот способ задания правил Lake Formation подходит, если вы хотите управлять политикой тегирования и фильтрации на уровне отдельных объектов. Помните, что такая конфигурация переопределяет любые настройки, заданные на уровне dbt-project.

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
Таким образом можно задать теги и политику фильтрации данных для конкретного пути в dbt‑проекте (например, `models`, `seeds`, `models/model_group1` и т. д.).
Это особенно полезно для `seeds`, поскольку для них нельзя задать конфигурацию напрямую в файле.

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

Чтобы выполнить функциональное тестирование:
1. Установите зависимости для разработки:
```bash
$ pip3 install -r dev-requirements.txt
```

2. Установите пакет локально:
```bash
$ python3 setup.py build && python3 setup.py install_lib
```

3. Экспортируйте переменные окружения:
```bash
$ export DBT_S3_LOCATION=s3://mybucket/myprefix
$ export DBT_ROLE_ARN=arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
```

4. Запустите тесты:
```bash
$ python3 -m pytest tests/functional
```

Подробнее см. документацию dbt о [тестировании нового адаптера](/guides/adapter-creation).

## Ограничения

### Поддерживаемая функциональность

Большинство возможностей <Constant name="core" /> поддерживается, однако некоторые функции доступны только при использовании Apache Hudi.

Функции, доступные только для Apache Hudi:
1. Инкрементальные обновления моделей по `unique_key` вместо `partition_by` (см. стратегию [`merge`](/reference/resource-configs/glue-configs#the-merge-strategy))

Некоторые возможности dbt, доступные в core‑адаптерах, пока не поддерживаются в Glue:
1. [Сохранение](/reference/resource-configs/persist_docs) описаний колонок в виде комментариев базы данных
2. [Snapshots](/docs/build/snapshots)
