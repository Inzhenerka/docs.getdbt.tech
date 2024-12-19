---
title: "Настройка AWS Glue"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища AWS Glue в dbt."
id: "glue-setup"
meta:
  maintained_by: Сообщество
  authors: 'Бенжамен Менюэ, Мошир Микаэль, Армандо Сегнини и Амин Эль Маллем'
  github_repo: 'aws-samples/dbt-glue'
  pypi_package: 'dbt-glue'
  min_core_version: 'v0.24.0'
  cloud_support: Не поддерживается
  min_supported_version: 'Glue 2.0'
  slack_channel_name: '#db-glue'
  slack_channel_link: 'https://getdbt.slack.com/archives/C02R4HSMBAT'
  platform_name: 'AWS Glue'
  config_page: '/reference/resource-configs/glue-configs'
---

:::info Плагин сообщества

Некоторые основные функции могут быть ограничены. Если вы хотите внести свой вклад, ознакомьтесь с исходным кодом для каждого из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

Для получения дополнительной (и, вероятно, более актуальной) информации смотрите [README](https://github.com/aws-samples/dbt-glue#readme)

## Методы подключения

### Настройка вашего профиля AWS для интерактивной сессии Glue
Существует два IAM-принципала, используемых в интерактивных сессиях.
- Принципал клиента: Принципал (пользователь или роль), вызывающий API AWS (Glue, Lake Formation, Интерактивные сессии) из локального клиента. Это тот же принципал, который настроен в AWS CLI.
- Роль службы: IAM-роль, которую AWS Glue использует для выполнения вашей сессии. Это то же самое, что и AWS Glue ETL.

Прочитайте [эту документацию](https://docs.aws.amazon.com/glue/latest/dg/glue-is-security.html), чтобы настроить этих принципалов.

Ниже приведена политика с наименьшими привилегиями, чтобы вы могли воспользоваться всеми функциями адаптера **`dbt-glue`**.

Пожалуйста, обновите переменные между **`<>`**; вот объяснения этих аргументов:

|Args	|Описание	|
|---|---|
|region|Регион, в котором хранится ваша база данных Glue |
|AWS Account|AWS-аккаунт, в котором вы запускаете свой конвейер|
|dbt output database|База данных, обновляемая dbt (это схема, настроенная в profile.yml вашей среды dbt)|
|dbt source database|Все базы данных, используемые в качестве источника|
|dbt output bucket|Имя ведра, в котором данные будут генерироваться dbt (расположение, настроенное в profile.yml вашей среды dbt)|
|dbt source bucket|Имя ведра исходных баз данных (если они не управляются Lake Formation)|

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
                "lakeformation:GetLFTag"
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

### Настройка локальной среды

Поскольку адаптеры **`dbt`** и **`dbt-glue`** совместимы с версиями Python 3.9 и выше, проверьте версию Python:

```bash
$ python3 --version
```

Настройте виртуальную среду Python, чтобы изолировать версии пакетов и зависимости кода:

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
query-comment: Это пример dbt для Glue
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

Таблица ниже описывает все параметры.

| Параметр	                                 | Описание	                                                                                                                                                                                                                                                                                      | Обязательный |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| project_name	                           | Имя проекта dbt. Это должно быть таким же, как и в проекте dbt.	                                                                                                                                                                                                            | да       |
| type	                                   | Драйвер, который нужно использовать.	                                                                                                                                                                                                                                                                               | да       |
| query-comment	                          | Строка, которая будет добавлена в качестве комментария в каждый запрос, который выполняет dbt. 	                                                                                                                                                                                                                                    | нет        |
| role_arn	                               | ARN IAM-ролей интерактивной сессии Glue.	                                                                                                                                                                                                                                                | да       |
| region	                                 | Регион AWS, в котором вы запускаете конвейер данных.	                                                                                                                                                                                                                                                   | да       |
| workers	                                | Количество рабочих процессов определенного типа workerType, которые выделяются при запуске задания.	                                                                                                                                                                                                                | да       |
| worker_type	                            | Тип предопределенного рабочего процесса, который выделяется при запуске задания. Принимает значение Standard, G.1X или G.2X.	                                                                                                                                                                                     | да       |
| schema	                                 | Схема, используемая для организации данных, хранящихся в Amazon S3. Кроме того, это база данных в AWS Lake Formation, которая хранит таблицы метаданных в каталоге данных.	                                                                                                                                        | да       |
| session_provisioning_timeout_in_seconds | Таймаут в секундах для предоставления интерактивной сессии AWS Glue.	                                                                                                                                                                                                                            | да       |
| location	                               | Местоположение Amazon S3 ваших целевых данных.	                                                                                                                                                                                                                                                      | да       |
| query_timeout_in_minutes	               | Таймаут в минутах для одного запроса. По умолчанию 300.                                                                                                                                                                                                                                         | нет        |
| idle_timeout	                           | Таймаут простоя сессии AWS Glue в минутах. (Сессия останавливается после простоя в течение указанного времени)	                                                                                                                                                                              | нет        |
| glue_version	                           | Версия AWS Glue, которую следует использовать для этой сессии. В настоящее время единственными допустимыми вариантами являются 2.0 и 3.0. Значение по умолчанию - 3.0.	                                                                                                                                                                    | нет        |
| security_configuration	                 | Конфигурация безопасности, которую следует использовать с этой сессией.	                                                                                                                                                                                                                                             | нет        |
| connections	                            | Список соединений, разделенных запятыми, которые следует использовать в сессии.	                                                                                                                                                                                                                                     | нет        |
| conf	                                   | Специфическая конфигурация, используемая при запуске интерактивной сессии Glue (аргумент --conf).	                                                                                                                                                                                                          | нет        |
| extra_py_files	                         | Дополнительные библиотеки Python, которые могут использоваться интерактивной сессией.                                                                                                                                                                                                                                    | нет        |
| delta_athena_prefix	                    | Префикс, используемый для создания таблиц, совместимых с Athena, для таблиц Delta (если не указано, то таблица, совместимая с Athena, не будет создана).                                                                                                                                                             | нет        |
| tags	                                   | Карта пар ключ-значение (теги), принадлежащих сессии. Пример: `KeyName1=Value1,KeyName2=Value2`.                                                                                                                                                                                                 | нет        |
| seed_format	                            | По умолчанию `parquet`, может быть совместимым с форматом Spark, например, `csv` или `json`.                                                                                                                                                                                                                         | нет        |
| seed_mode	                              | По умолчанию `overwrite`, данные семян будут перезаписаны, вы можете установить его на `append`, если хотите просто добавить новые данные в свой набор данных.                                                                                                                                                            | нет        |
| default_arguments	                      | Карта параметров пар ключ-значение, принадлежащих сессии. Дополнительную информацию см. в [Параметрах заданий, используемых AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html). Пример: `--enable-continuous-cloudwatch-log=true,--enable-continuous-log-filter=true`. | нет        |
| glue_session_id                         | Повторное использование glue-сессии для выполнения нескольких команд dbt run: установите идентификатор glue-сессии, который вам нужно использовать.                                                                                                                                                                                                   | нет        | 
| glue_session_reuse                      | Повторное использование glue-сессии для выполнения нескольких команд dbt run: если установлено в true, glue-сессия не будет закрыта для повторного использования. Если установлено в false, сессия будет закрыта.                                                                                                                             | нет        | 
| datalake_formats	                      | Формат ACID-озера данных, который вы хотите использовать, если вы выполняете слияние, может быть `hudi`, `iceberg` или `delta`.                                                                                                                                                                                          | нет |

## Конфигурации

### Настройка таблиц

При материализации модели как `table` вы можете включить несколько дополнительных конфигураций, которые специфичны для плагина dbt-spark, в дополнение к стандартным [конфигурациям модели](/reference/model-configs).

| Параметр  | Описание                                        | Обязательный?               | Пример                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| file_format | Формат файла, который следует использовать при создании таблиц (`parquet`, `csv`, `json`, `text`, `jdbc` или `orc`). | Необязательный | `parquet`|
| partition_by  | Разделите созданную таблицу по указанным столбцам. Для каждого раздела создается каталог. | Необязательный                | `date_day`              |
| clustered_by  | Каждый раздел в созданной таблице будет разделен на фиксированное количество бакетов по указанным столбцам. | Необязательный               | `country_code`              |
| buckets  | Количество бакетов, которые нужно создать при кластеризации | Обязательный, если указано `clustered_by`                | `8`              |
| custom_location  | По умолчанию адаптер будет хранить ваши данные по следующему пути: `location path`/`schema`/`table`. Если вы не хотите следовать этому поведению по умолчанию, вы можете использовать этот параметр, чтобы установить свое собственное пользовательское местоположение на S3. | Нет | `s3://mycustombucket/mycustompath`              |
| hudi_options | При использовании формата файла `hudi` позволяет переопределить любые параметры конфигурации по умолчанию. | Необязательный | `{'hoodie.schema.on.read.enable': 'true'}` |

## Инкрементальные модели

dbt стремится предложить полезные и интуитивно понятные абстракции моделирования с помощью своих встроенных конфигураций и материализаций.

По этой причине плагин dbt-glue сильно полагается на конфигурацию [`incremental_strategy`](/docs/build/incremental-models). Эта конфигурация указывает инкрементальной материализации, как строить модели в запусках после первого. Она может быть установлена на одно из трех значений:
 - **`append`** (по умолчанию): Вставить новые записи без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Если указано `partition_by`, перезаписать разделы в таблице новыми данными. Если `partition_by` не указано, перезаписать всю таблицу новыми данными.
 - **`merge`** (только для Apache Hudi и Apache Iceberg): Сопоставить записи на основе `unique_key`; обновить старые записи и вставить новые. (Если `unique_key` не указан, все новые данные вставляются, аналогично `append`.)
 
Каждая из этих стратегий имеет свои плюсы и минусы, которые мы обсудим ниже. Как и с любой конфигурацией модели, `incremental_strategy` может быть указана в `dbt_project.yml` или в блоке `config()` файла модели.

**Примечания:**
Стратегия по умолчанию - **`insert_overwrite`**.

### Стратегия `append`

Следуя стратегии `append`, dbt выполнит оператор `insert into` со всеми новыми данными. Привлекательность этой стратегии заключается в том, что она проста и функциональна на всех платформах, типах файлов, методах подключения и версиях Apache Spark. Однако эта стратегия _не может_ обновлять, перезаписывать или удалять существующие данные, поэтому она, вероятно, вставит дублирующиеся записи для многих источников данных.

#### Исходный код
```sql
{{ config(
    materialized='incremental',
    incremental_strategy='append',
) }}

--  Все строки, возвращаемые этим запросом, будут добавлены в существующую таблицу

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

Эта стратегия наиболее эффективна, когда указано условие `partition_by` в конфигурации вашей модели. dbt выполнит [атомарный оператор `insert overwrite`](https://spark.apache.org/docs/latest/sql-ref-syntax-dml-insert-overwrite-table.html), который динамически заменяет все разделы, включенные в ваш запрос. Обязательно повторно выберите _все_ соответствующие данные для раздела при использовании этой инкрементальной стратегии.

Если `partition_by` не указано, то стратегия `insert_overwrite` атомарно заменит все содержимое таблицы, перезаписывая все существующие данные только новыми записями. Однако схема столбцов таблицы остается прежней. Это может быть желаемо в некоторых ограниченных обстоятельствах, поскольку это минимизирует время простоя во время перезаписи содержимого таблицы. Операция сопоставима с выполнением `truncate` + `insert` в других базах данных. Для атомарной замены таблиц в формате Delta используйте материализацию `table` (которая выполняет `create or replace`) вместо этого.

#### Исходный код
```sql
{{ config(
    materialized='incremental',
    partition_by=['date_day'],
    file_format='parquet'
) }}

/*
  Каждый раздел, возвращаемый этим запросом, будет перезаписан
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

Указание `insert_overwrite` в качестве инкрементальной стратегии является необязательным, поскольку это стратегия по умолчанию, используемая, когда ничего не указано.

### Стратегия `merge`

**Совместимость:**
- Hudi : ОК
- Delta Lake : ОК
- Iceberg : ОК
- Таблицы, управляемые Lake Formation : В процессе

Примечание: 

- Для Glue 3: вам необходимо настроить [коннекторы Glue](https://docs.aws.amazon.com/glue/latest/ug/connectors-chapter.html).

- Для Glue 4: используйте параметр `datalake_formats` в вашем profile.yml.

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
и что к управляемой политике `AmazonEC2ContainerRegistryReadOnly` прикреплена. 
Убедитесь, что вы следуете инструкциям по началу работы [здесь](https://docs.aws.amazon.com/glue/latest/ug/setting-up.html#getting-started-min-privs-connectors).

Этот [блог](https://aws.amazon.com/blogs/big-data/part-1-integrate-apache-hudi-delta-lake-apache-iceberg-datasets-at-scale-aws-glue-studio-notebook/) также объясняет, как настроить и работать с коннекторами Glue.

#### Hudi

**Примечания по использованию:** Стратегия `merge` с инкрементальным обновлением Hudi требует:
- Добавить `file_format: hudi` в конфигурацию вашей таблицы.
- Добавить `datalake_formats` в ваш профиль: `datalake_formats: hudi`.
  - В качестве альтернативы, добавить соединение в ваш профиль: `connections: name_of_your_hudi_connector`.
- Добавить сериализатор Kryo в конфигурацию вашей интерактивной сессии (в вашем профиле):  `conf: spark.serializer=org.apache.spark.serializer.KryoSerializer --conf spark.sql.hive.convertMetastoreParquet=false`.

dbt выполнит [атомарный оператор `merge`](https://hudi.apache.org/docs/writing_data#spark-datasource-writer), который выглядит почти идентично поведению по умолчанию для слияния в Snowflake и BigQuery. Если указан `unique_key` (рекомендуется), dbt обновит старые записи значениями из новых записей, которые соответствуют ключевому столбцу. Если `unique_key` не указан, dbt пропустит критерии соответствия и просто вставит все новые записи (аналогично стратегии `append`).

#### Пример конфигурации профиля
```yaml
test_project:
  target: dev
  outputs:
    dev:
      type: glue
      query-comment: мой комментарий
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

Вы также можете использовать Delta Lake, чтобы иметь возможность использовать функцию слияния в таблицах.

**Примечания по использованию:** Стратегия `merge` с инкрементальным обновлением Delta требует:
- Добавить `file_format: delta` в конфигурацию вашей таблицы.
- Добавить `datalake_formats` в ваш профиль: `datalake_formats: delta`.
  - В качестве альтернативы, добавить соединение в ваш профиль: `connections: name_of_your_delta_connector`.
- Добавить следующую конфигурацию в вашу интерактивную сессию (в вашем профиле):  `conf: "spark.sql.extensions=io.delta.sql.DeltaSparkSessionExtension --conf spark.sql.catalog.spark_catalog=org.apache.spark.sql.delta.catalog.DeltaCatalog"`.

**Athena:** Athena по умолчанию не совместима с таблицами delta, но вы можете настроить адаптер для создания таблиц Athena на основе вашей таблицы delta. Для этого вам нужно настроить два следующих параметра в вашем профиле:
- Для Delta Lake 2.1.0, поддерживаемого нативно в Glue 4.0: `extra_py_files: "/opt/aws_glue_connectors/selected/datalake/delta-core_2.12-2.1.0.jar"`.
- Для Delta Lake 1.0.0, поддерживаемого нативно в Glue 3.0: `extra_py_files: "/opt/aws_glue_connectors/selected/datalake/delta-core_2.12-1.0.0.jar"`.
- `delta_athena_prefix: "префикс на ваш выбор"`.
- Если ваша таблица разделена, то добавление нового раздела не является автоматическим, вам нужно выполнить `MSCK REPAIR TABLE your_delta_table` после добавления каждого нового раздела.

#### Пример конфигурации профиля
```yaml
test_project:
  target: dev
  outputs:
    dev:
      type: glue
      query-comment: мой комментарий
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

#### Исходный код для снимка Iceberg

<VersionBlock lastVersion="1.8">

```sql

{% snapshot demosnapshot %}

{{
    config(
        strategy='timestamp',
        target_schema='jaffle_db',
        updated_at='dt',
        file_format='iceberg'
) }}

select * from {{ ref('customers') }}

{% endsnapshot %}

```

</VersionBlock>

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

## Мониторинг вашей интерактивной сессии Glue

Мониторинг является важной частью поддержания надежности, доступности и производительности AWS Glue и других решений AWS. AWS предоставляет инструменты мониторинга, которые вы можете использовать для наблюдения за AWS Glue, определения необходимого количества рабочих процессов для вашей интерактивной сессии Glue, сообщения о том, когда что-то идет не так, и автоматического выполнения действий, когда это необходимо. AWS Glue предоставляет Spark UI и журналы и метрики CloudWatch для мониторинга ваших заданий AWS Glue.
Дополнительную информацию см. в разделе: [Мониторинг заданий AWS Glue Spark](https://docs.aws.amazon.com/glue/latest/dg/monitor-spark.html).

**Примечания по использованию:** Мониторинг требует:
- Добавить следующую IAM-политику к вашей IAM-роле:
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

- Добавить параметры мониторинга в конфигурацию вашей интерактивной сессии (в вашем профиле).
Дополнительную информацию см. в [Параметрах заданий, используемых AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html).

#### Пример конфигурации профиля
```yaml
test_project:
  target: dev
  outputs:
    dev:
      type: glue
      query-comment: мой комментарий
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

Если вы хотите использовать Spark UI, вы можете запустить сервер истории Spark, используя шаблон AWS CloudFormation, который размещает сервер на экземпляре EC2, или запустить локально с помощью Docker. Дополнительную информацию см. в разделе [Запуск сервера истории Spark](https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-history.html#monitor-spark-ui-history-local).

## Включение автоматического масштабирования AWS Glue
Автоматическое масштабирование доступно с версии AWS Glue 3.0 или более поздней. Дополнительную информацию можно найти в следующем блоге AWS: ["Введение в автоматическое масштабирование AWS Glue: автоматически изменяйте размер серверных вычислительных ресурсов для снижения затрат с оптимизированным Apache Spark"](https://aws.amazon.com/blogs/big-data/introducing-aws-glue-auto-scaling-automatically-resize-serverless-computing-resources-for-lower-cost-with-optimized-apache-spark/).

С включенным автоматическим масштабированием вы получите следующие преимущества:

* AWS Glue автоматически добавляет и удаляет рабочих процессов из кластера в зависимости от параллелизма на каждом этапе или микропакете выполнения задания.

* Это устраняет необходимость вам экспериментировать и решать, сколько рабочих процессов назначить для ваших интерактивных сессий AWS Glue.

* Как только вы выберете максимальное количество рабочих процессов, AWS Glue выберет правильные ресурсы для рабочей нагрузки.

* Вы можете видеть, как размер кластера изменяется во время выполнения интерактивных сессий Glue, просматривая метрики CloudWatch.
Дополнительную информацию см. в разделе [Мониторинг вашей интерактивной сессии Glue](#Мониторинг-вшей-интерактивной-сессии-Glue).

**Примечания по использованию:** Автоматическое масштабирование AWS Glue требует:
- Установить вашу версию AWS Glue 3.0 или более позднюю.
- Установить максимальное количество рабочих процессов (если автоматическое масштабирование включено, параметр `workers` устанавливает максимальное количество рабочих процессов).
- Установить параметр `--enable-auto-scaling=true` в конфигурации вашей интерактивной сессии Glue (в вашем профиле).
Дополнительную информацию см. в [Параметрах заданий, используемых AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html).

#### Пример конфигурации профиля
```yaml
test_project:
  target: dev
  outputs:
    dev:
      type: glue
      query-comment: мой комментарий
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

## Доступ к каталогу Glue в другом AWS-аккаунте
Во многих случаях вам может потребоваться запускать ваши задания dbt для чтения из другого AWS-аккаунта.

Просмотрите следующую ссылку https://repost.aws/knowledge-center/glue-tables-cross-accounts, чтобы настроить политики доступа в исходных и целевых аккаунтах.

Добавьте следующее `"spark.hadoop.hive.metastore.glue.catalogid=<AWS-ACCOUNT-ID>"` в ваш conf в профиле DBT, таким образом, вы можете иметь несколько выходов для каждого из аккаунтов, к которым у вас есть доступ.

Примечание: Доступ к кросс-аккаунтам должен находиться в одном и том же регионе AWS.
#### Пример конфигурации профиля
```yaml
test_project:
  target: dev
  outputsAccountB:
    dev:
      type: glue
      query-comment: мой комментарий
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

Сохранение документации на уровне отношений поддерживается с версии dbt v0.17.0. Для получения дополнительной информации о настройке сохранения документации смотрите [документацию](/reference/resource-configs/persist_docs).

Когда параметр `persist_docs` настроен должным образом, вы сможете видеть описания моделей в поле `Comment` команды `describe [table] extended` или `show table extended in [database] like '*'`.

## Всегда `schema`, никогда `database`

Apache Spark использует термины "схема" и "база данных" взаимозаменяемо. dbt понимает, что `database` существует на более высоком уровне, чем `schema`. Таким образом, вы _никогда_ не должны использовать или устанавливать `database` в качестве конфигурации узла или в целевом профиле при запуске dbt-glue.

Если вы хотите контролировать схему/базу данных, в которой dbt будет материализовать модели, используйте конфигурацию `schema` и макрос `generate_schema_name` _только_.
Для получения дополнительной информации ознакомьтесь с документацией dbt о [пользовательских схемах](https://docs.getdbt.com/docs/build/custom-schemas).

## Интеграция AWS Lakeformation
Адаптер поддерживает управление тегами AWS Lake Formation, позволяя вам связывать существующие теги, определенные вне dbt-glue, с объектами базы данных, созданными dbt-glue (база данных, таблица, представление, снимок, инкрементальные модели, семена).

- Вы можете включить или отключить управление lf-тегами через конфигурацию на уровне модели и проекта dbt (по умолчанию отключено).
- Если включено, lf-теги будут обновляться при каждом запуске dbt. Существуют конфигурации lf-тегов на уровне таблицы и на уровне столбца.
- Вы можете указать, что хотите удалить существующие теги базы данных, таблицы или столбца Lake Formation, установив поле конфигурации drop_existing в True (по умолчанию False, что означает, что существующие теги сохраняются).
- Обратите внимание, что если тег, который вы хотите связать с таблицей, не существует, выполнение dbt-glue вызовет ошибку.

Адаптер также поддерживает фильтрацию ячеек данных AWS Lakeformation. 
- Вы можете включить или отключить фильтрацию ячеек данных через конфигурацию на уровне модели и проекта dbt (по умолчанию отключено).
- Если включено, фильтры ячеек данных будут обновляться при каждом запуске dbt.
- Вы можете указать, что хотите удалить существующие фильтры ячеек данных таблицы, установив поле конфигурации drop_existing в True (по умолчанию False, что означает, что существующие фильтры сохраняются).
- Вы можете использовать поля excluded_columns_names **ИЛИ** columns для выполнения безопасности на уровне столбца. **Обратите внимание, что вы можете использовать одно или другое, но не оба**.
- По умолчанию, если вы не укажете ни один столбец или исключенные столбцы, dbt-glue не выполняет фильтрацию на уровне столбца и позволяет принципалу получить доступ ко всем столбцам.

Ниже приведена конфигурация, позволяющая указанному принципалу (IAM-пользователю lf-data-scientist) получать доступ к строкам, у которых значение customer_lifetime_value > 15, и ко всем указанным столбцам ('customer_id', 'first_order', 'most_recent_order', 'number_of_orders'):

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
Ниже приведена конфигурация, позволяющая указанному принципалу (IAM-пользователю lf-data-scientist) получать доступ к строкам, у которых значение customer_lifetime_value > 15, и ко всем столбцам *кроме* указанного ('first_name'):

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

Смотрите ниже несколько примеров того, как вы можете интегрировать управление LF-тегами и фильтрацию ячеек данных в ваши конфигурации: 

#### На уровне модели
Этот способ определения ваших правил Lakeformation подходит, если вы хотите управлять политикой тегирования и фильтрации на уровне объекта. Помните, что он переопределяет любую конфигурацию, определенную на уровне проекта dbt. 

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

#### На уровне проекта dbt
Таким образом, вы можете указать теги и политику фильтрации данных для определенного пути в вашем проекте dbt (например, модели, семена, модели/model_group1 и т. д.)
Это особенно полезно для семян, для которых вы не можете определить конфигурацию в файле напрямую.

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

Чтобы выполнить функциональный тест:
1. Установите требования для разработки:
```bash
$ pip3 install -r dev-requirements.txt
```

2. Установите dev локально:
```bash
$ python3 setup.py build && python3 setup.py install_lib
```

3. Экспортируйте переменные:
```bash
$ export DBT_S3_LOCATION=s3://mybucket/myprefix
$ export DBT_ROLE_ARN=arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
```

4. Запустите тест:
```bash
$ python3 -m pytest tests/functional
```

Для получения дополнительной информации ознакомьтесь с документацией dbt о [тестировании нового адаптера](https://docs.getdbt.com/docs/contributing/testing-a-new-adapter).

## Ограничения

### Поддерживаемая функциональность

Большинство функций dbt Core поддерживается, но некоторые функции доступны только с Apache Hudi.

Функции только для Apache Hudi:
1. Инкрементальные обновления модели по `unique_key` вместо `partition_by` (см. [`merge` strategy](/reference/resource-configs/glue-configs#the-merge-strategy)).

Некоторые функции dbt, доступные в основных адаптерах, еще не поддерживаются в Glue:
1. [Сохранение](/reference/resource-configs/persist_docs) описаний на уровне столбца в качестве комментариев базы данных.
2. [Снимки](/docs/build/snapshots).