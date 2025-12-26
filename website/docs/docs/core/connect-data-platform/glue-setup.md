---
title: "Настройка AWS Glue"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища AWS Glue в dbt."
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

Некоторая основная функциональность может быть ограничена. Если вы заинтересованы в участии, ознакомьтесь с исходным кодом для каждого из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

Для получения дополнительной (и, скорее всего, более актуальной) информации, смотрите [README](https://github.com/aws-samples/dbt-glue#readme)

## Методы подключения

### Настройка вашего профиля AWS для интерактивной сессии Glue
Существует два принципала IAM, используемых с интерактивными сессиями.
- Принципал клиента: Принципал (пользователь или роль), вызывающий API AWS (Glue, Lake Formation, Interactive Sessions) с локального клиента. Это принципал, настроенный в AWS CLI, и, вероятно, он тот же самый.
- Роль сервиса: Роль IAM, которую AWS Glue использует для выполнения вашей сессии. Это то же самое, что и AWS Glue ETL.

Прочтите [эту документацию](https://docs.aws.amazon.com/glue/latest/dg/glue-is-security.html), чтобы настроить этих принципалов.

Ниже вы найдете политику минимальных привилегий для использования всех функций адаптера **`dbt-glue`**.

Пожалуйста, обновите переменные между **`<>`**, вот объяснения этих аргументов:

|Аргументы|Описание|
|---|---|
|region|Регион, где хранится ваша база данных Glue|
|AWS Account|Аккаунт AWS, в котором вы запускаете свой конвейер|
|dbt output database|База данных, обновляемая dbt (это схема, настроенная в profile.yml вашей среды dbt)|
|dbt source database|Все базы данных, используемые в качестве источника|
|dbt output bucket|Имя корзины, где данные будут генерироваться dbt (местоположение, настроенное в profile.yml вашей среды dbt)|
|dbt source bucket|Имя корзины исходных баз данных (если они не управляются Lake Formation)|

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

### Настройка локальной среды

Поскольку адаптеры **`dbt`** и **`dbt-glue`** совместимы с версиями Python 3.9 или выше, проверьте версию Python:

```bash
$ python3 --version
```

Настройте виртуальную среду Python для изоляции версий пакетов и зависимостей кода:

```bash
$ sudo yum install git
$ python3 -m venv dbt_venv
$ source dbt_venv/bin/activate
$ python3 -m pip install --upgrade pip
```

Настройте последнюю версию AWS CLI

```bash
$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
$ unzip awscliv2.zip
$ sudo ./aws/install
```

Установите пакет boto3

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

Таблица ниже описывает все опции.

| Опция	                                 | Описание	                                                                                                                                                                                                                                                                                      | Обязательна |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| project_name	                           | Имя проекта dbt. Оно должно совпадать с тем, что настроено в проекте dbt.	                                                                                                                                                                                                            | да       |
| type	                                   | Драйвер для использования.	                                                                                                                                                                                                                                                                               | да       |
| query-comment	                          | Строка, которая будет добавлена в качестве комментария в каждый запрос, выполняемый dbt. 	                                                                                                                                                                                                                                    | нет        |
| role_arn	                               | ARN роли IAM для интерактивной сессии Glue.	                                                                                                                                                                                                                                                | да       |
| region	                                 | Регион AWS, в котором вы запускаете конвейер данных.	                                                                                                                                                                                                                                                   | да       |
| workers	                                | Количество рабочих, выделяемых при запуске задания.	                                                                                                                                                                                                                | да       |
| worker_type	                            | Тип предопределенного рабочего, выделяемого при запуске задания. Принимает значения Standard, G.1X или G.2X.	                                                                                                                                                                                     | да       |
| schema	                                 | Схема, используемая для организации данных, хранящихся в Amazon S3. Также это база данных в AWS Lake Formation, которая хранит метаданные таблиц в каталоге данных.	                                                                                                                                        | да       |
| session_provisioning_timeout_in_seconds | Тайм-аут в секундах для предоставления интерактивной сессии AWS Glue.	                                                                                                                                                                                                                            | да       |
| location	                               | Местоположение ваших целевых данных в Amazon S3.	                                                                                                                                                                                                                                                      | да       |
| query_timeout_in_minutes	               | Тайм-аут в минутах для одного запроса. По умолчанию 300                                                                                                                                                                                                                                         | нет        |
| idle_timeout	                           | Тайм-аут простоя сессии AWS Glue в минутах. (Сессия останавливается после простоя в течение указанного времени)	                                                                                                                                                                              | нет        |
| glue_version	                           | Версия AWS Glue для использования в этой сессии. В настоящее время допустимы только 2.0 и 3.0. Значение по умолчанию 3.0.	                                                                                                                                                                    | нет        |
| security_configuration	                 | Конфигурация безопасности для использования с этой сессией.	                                                                                                                                                                                                                                             | нет        |
| connections	                            | Список подключений, разделенных запятыми, для использования в сессии.	                                                                                                                                                                                                                                     | нет        |
| conf	                                   | Специфическая конфигурация, используемая при запуске интерактивной сессии Glue (аргумент --conf)	                                                                                                                                                                                                          | нет        |
| extra_py_files	                         | Дополнительные библиотеки Python, которые могут быть использованы интерактивной сессией.                                                                                                                                                                                                                                    | нет        |
| delta_athena_prefix	                    | Префикс, используемый для создания таблиц, совместимых с Athena, для таблиц Delta (если не указан, то таблица, совместимая с Athena, не будет создана)                                                                                                                                                             | нет        |
| tags	                                   | Карта пар ключ-значение (теги), принадлежащих сессии. Пример: `KeyName1=Value1,KeyName2=Value2`                                                                                                                                                                                                 | нет        |
| seed_format	                            | По умолчанию `parquet`, может быть совместимым с форматом Spark, таким как `csv` или `json`                                                                                                                                                                                                                         | нет        |
| seed_mode	                              | По умолчанию `overwrite`, данные семян будут перезаписаны, вы можете установить его на `append`, если хотите просто добавить новые данные в ваш набор данных                                                                                                                                                            | нет        |
| default_arguments	                      | Карта параметров пар ключ-значение, принадлежащих сессии. Подробнее о [параметрах задания, используемых AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html). Пример: `--enable-continuous-cloudwatch-log=true,--enable-continuous-log-filter=true` | нет        |
| glue_session_id                         | повторное использование сессии glue для выполнения нескольких команд dbt run: установите идентификатор сессии glue, который вы хотите использовать                                                                                                                                                                                                   | нет        | 
| glue_session_reuse                      | Повторное использование сессии glue для выполнения нескольких команд dbt run: Если установлено значение true, сессия glue не будет закрыта для повторного использования. Если установлено значение false, сессия будет закрыта                                                                                                                             | нет        | 
| datalake_formats	                      | Формат озера данных ACID, который вы хотите использовать, если вы выполняете слияние, может быть `hudi`, `ìceberg` или `delta`                                                                                                                                                                                          |нет|

## Конфигурации

### Настройка таблиц

При материализации модели как `table`, вы можете включить несколько дополнительных конфигураций, которые специфичны для плагина dbt-spark, в дополнение к стандартным [конфигурациям моделей](/reference/model-configs).

| Опция  | Описание                                        | Обязательна?               | Пример                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| file_format | Формат файла для использования при создании таблиц (`parquet`, `csv`, `json`, `text`, `jdbc` или `orc`). | Необязательно | `parquet`|
| partition_by  | Разделить созданную таблицу по указанным столбцам. Для каждого раздела создается каталог. | Необязательно                | `date_day`              |
| clustered_by  | Каждый раздел в созданной таблице будет разделен на фиксированное количество корзин по указанным столбцам. | Необязательно               | `country_code`              |
| buckets  | Количество корзин для создания при кластеризации | Обязательно, если указано `clustered_by`                | `8`              |
| custom_location  | По умолчанию адаптер будет хранить ваши данные в следующем пути: `location path`/`schema`/`table`. Если вы не хотите следовать этому поведению по умолчанию, вы можете использовать этот параметр для установки собственного местоположения на S3 | Нет | `s3://mycustombucket/mycustompath`              |
| hudi_options | При использовании формата файла `hudi` позволяет перезаписать любые параметры конфигурации по умолчанию. | Необязательно | `{'hoodie.schema.on.read.enable': 'true'}` |
## Инкрементные модели

dbt стремится предложить полезные и интуитивно понятные абстракции моделирования с помощью встроенных конфигураций и материализаций.

По этой причине плагин dbt-glue сильно опирается на конфигурацию [`incremental_strategy`](/docs/build/incremental-models). Эта конфигурация указывает, как инкрементальная материализация должна строить модели в запусках, следующих за первым. Она может быть установлена на одно из трех значений:
 - **`append`** (по умолчанию): Вставка новых записей без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Если указано `partition_by`, перезаписать разделы в таблице новыми данными. Если `partition_by` не указано, перезаписать всю таблицу новыми данными.
 - **`merge`** (только Apache Hudi и Apache Iceberg): Сопоставление записей на основе `unique_key`; обновление старых записей и вставка новых. (Если `unique_key` не указан, все новые данные вставляются, аналогично `append`.)
 
Каждая из этих стратегий имеет свои плюсы и минусы, которые мы обсудим ниже. Как и в случае любой конфигурации модели, `incremental_strategy` может быть указана в `dbt_project.yml` или в блоке `config()` файла модели.

**Примечания:**
Стратегия по умолчанию — **`insert_overwrite`**

### Стратегия `append`

Следуя стратегии `append`, dbt выполнит оператор `insert into` со всеми новыми данными. Привлекательность этой стратегии заключается в ее простоте и функциональности на всех платформах, типах файлов, методах подключения и версиях Apache Spark. Однако эта стратегия _не может_ обновлять, перезаписывать или удалять существующие данные, поэтому, вероятно, она будет вставлять дублирующие записи для многих источников данных.

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

Эта стратегия наиболее эффективна, когда указана вместе с клаузой `partition_by` в конфигурации вашей модели. dbt выполнит [атомарный оператор `insert overwrite`](https://spark.apache.org/docs/latest/sql-ref-syntax-dml-insert-overwrite-table.html), который динамически заменяет все разделы, включенные в ваш запрос. Убедитесь, что вы повторно выбираете _все_ соответствующие данные для раздела при использовании этой инкрементальной стратегии.

Если `partition_by` не указано, то стратегия `insert_overwrite` атомарно заменит все содержимое таблицы, перезаписывая все существующие данные только новыми записями. Однако схема столбцов таблицы остается прежней. Это может быть желательным в некоторых ограниченных обстоятельствах, поскольку минимизирует время простоя при перезаписи содержимого таблицы. Операция сопоставима с выполнением `truncate` + `insert` в других базах данных. Для атомарной замены таблиц в формате Delta используйте материализацию `table` (которая выполняет `create or replace`).

#### Исходный код
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

Указание `insert_overwrite` в качестве инкрементальной стратегии является необязательным, так как это стратегия по умолчанию, используемая, когда ничего не указано.

### Стратегия `merge`

**Совместимость:**
- Hudi : OK
- Delta Lake : OK
- Iceberg : OK
- Lake Formation Governed Tables : В процессе

NB: 

- Для Glue 3: вам нужно настроить [Glue connectors](https://docs.aws.amazon.com/glue/latest/ug/connectors-chapter.html).

- Для Glue 4: используйте опцию `datalake_formats` в вашем profile.yml

При использовании коннектора убедитесь, что ваша роль IAM имеет следующие политики:
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
и что управляемая политика `AmazonEC2ContainerRegistryReadOnly` прикреплена. 
Убедитесь, что вы следуете инструкциям по началу работы [здесь](https://docs.aws.amazon.com/glue/latest/ug/setting-up.html#getting-started-min-privs-connectors).

Этот [пост в блоге](https://aws.amazon.com/blogs/big-data/part-1-integrate-apache-hudi-delta-lake-apache-iceberg-datasets-at-scale-aws-glue-studio-notebook/) также объясняет, как настроить и работать с Glue Connectors

#### Hudi

**Примечания по использованию:** Стратегия `merge` с Hudi требует:
- Добавить `file_format: hudi` в вашу конфигурацию таблицы
- Добавить datalake_formats в ваш профиль: `datalake_formats: hudi`
  - В качестве альтернативы, добавить соединение в ваш профиль: `connections: name_of_your_hudi_connector`
- Добавить сериализатор Kryo в вашу конфигурацию интерактивной сессии (в вашем профиле):  `conf: spark.serializer=org.apache.spark.serializer.KryoSerializer --conf spark.sql.hive.convertMetastoreParquet=false`

dbt выполнит [атомарный оператор `merge`](https://hudi.apache.org/docs/writing_data#spark-datasource-writer), который выглядит почти идентично поведению слияния по умолчанию в Snowflake и BigQuery. Если указан `unique_key` (рекомендуется), dbt обновит старые записи значениями из новых записей, которые соответствуют ключевому столбцу. Если `unique_key` не указан, dbt откажется от критериев соответствия и просто вставит все новые записи (аналогично стратегии `append`).

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

Вы также можете использовать Delta Lake, чтобы иметь возможность использовать функцию слияния в таблицах.

**Примечания по использованию:** Стратегия `merge` с Delta требует:
- Добавить `file_format: delta` в вашу конфигурацию таблицы
- Добавить datalake_formats в ваш профиль: `datalake_formats: delta`
  - В качестве альтернативы, добавить соединение в ваш профиль: `connections: name_of_your_delta_connector`
- Добавить следующую конфигурацию в вашу конфигурацию интерактивной сессии (в вашем профиле):  `conf: "spark.sql.extensions=io.delta.sql.DeltaSparkSessionExtension --conf spark.sql.catalog.spark_catalog=org.apache.spark.sql.delta.catalog.DeltaCatalog`

**Athena:** Athena не совместима по умолчанию с таблицами delta, но вы можете настроить адаптер для создания таблиц Athena поверх вашей таблицы delta. Для этого вам нужно настроить следующие две опции в вашем профиле:
- Для Delta Lake 2.1.0, поддерживаемого нативно в Glue 4.0: `extra_py_files: "/opt/aws_glue_connectors/selected/datalake/delta-core_2.12-2.1.0.jar"`
- Для Delta Lake 1.0.0, поддерживаемого нативно в Glue 3.0: `extra_py_files: "/opt/aws_glue_connectors/selected/datalake/delta-core_2.12-1.0.0.jar"`
- `delta_athena_prefix: "the_prefix_of_your_choice"`
- Если ваша таблица разделена на разделы, то добавление нового раздела не происходит автоматически, вам нужно выполнить `MSCK REPAIR TABLE your_delta_table` после добавления каждого нового раздела

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

**Примечания по использованию:** Стратегия `merge` с Iceberg требует:
- Прикрепить управляемую политику AmazonEC2ContainerRegistryReadOnly к вашей роли выполнения:
- Добавить следующую политику к вашей роли выполнения, чтобы включить блокировку коммитов в таблице dynamodb (подробнее [здесь](https://iceberg.apache.org/docs/latest/aws/#dynamodb-lock-manager)). Обратите внимание, что таблица DynamoDB, указанная в поле ресурса этой политики, должна быть той, которая упоминается в ваших профилях dbt (`--conf spark.sql.catalog.glue_catalog.lock.table=myGlueLockTable`). По умолчанию эта таблица называется `myGlueLockTable` и создается автоматически (с использованием On-Demand Pricing) при запуске модели dbt-glue с инкрементальной материализацией и форматом файла Iceberg. Если вы хотите назвать таблицу по-другому или создать свою собственную таблицу без участия Glue, укажите параметр `iceberg_glue_commit_lock_table` с именем вашей таблицы (например, `MyDynamoDbTable`) в вашем профиле dbt.
```yaml
iceberg_glue_commit_lock_table: "MyDynamoDbTable"
```
- последний коннектор для iceberg на AWS marketplace использует версию 0.14.0 для Glue 3.0 и версию 1.2.1 для Glue 4.0, где сериализация Kryo не работает при записи iceberg, используйте "org.apache.spark.serializer.JavaSerializer" для spark.serializer, подробнее [здесь](https://github.com/apache/iceberg/pull/546)

Убедитесь, что вы обновили свою конфигурацию с `--conf spark.sql.catalog.glue_catalog.lock.table=<YourDynamoDBLockTableName>` и изменили ниже разрешение iam с правильным именем таблицы.
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
- Добавить `file_format: Iceberg` в вашу конфигурацию таблицы
- Добавить datalake_formats в ваш профиль: `datalake_formats: iceberg`
  - В качестве альтернативы, добавить соединения в ваш профиль: `connections: name_of_your_iceberg_connector` (
    - Для версии Athena 3: 
      - Адаптер совместим с коннектором Iceberg из AWS Marketplace с Glue 3.0 в качестве Fulfillment option и 0.14.0 (11 октября 2022 г.) в качестве Software version)
      - последний коннектор для iceberg на AWS marketplace использует версию 0.14.0 для Glue 3.0 и версию 1.2.1 для Glue 4.0, где сериализация Kryo не работает при записи iceberg, используйте "org.apache.spark.serializer.JavaSerializer" для spark.serializer, подробнее [здесь](https://github.com/apache/iceberg/pull/546) 
    - Для версии Athena 2: Адаптер совместим с коннектором Iceberg из AWS Marketplace с Glue 3.0 в качестве Fulfillment option и 0.12.0-2 (14 февраля 2022 г.) в качестве Software version)
- Добавить следующую конфигурацию в вашу конфигурацию интерактивной сессии (в вашем профиле):  
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
  - Для Glue 3.0 установите `spark.sql.catalog.glue_catalog.lock-impl` на `org.apache.iceberg.aws.glue.DynamoLockManager` вместо этого

dbt выполнит [атомарный оператор `merge`](https://iceberg.apache.org/docs/latest/spark-writes/), который выглядит почти идентично поведению слияния по умолчанию в Snowflake и BigQuery. Вам нужно предоставить `unique_key`, чтобы выполнить операцию слияния, в противном случае она завершится неудачей. Этот ключ нужно предоставить в формате списка Python и он может содержать несколько имен столбцов для создания составного `unique_key`. 

##### Примечания
- При использовании `custom_location` в Iceberg избегайте использования конечного слэша. Добавление конечного слэша приводит к неправильной обработке местоположения и проблемам при чтении данных из движков запросов, таких как Trino. Проблема должна быть исправлена для версии Iceberg > 0.13. Связанная проблема на Github может быть найдена [здесь](https://github.com/apache/iceberg/issues/4582).
- Iceberg также поддерживает стратегии `insert_overwrite` и `append`. 
- Конфигурация `warehouse` должна быть предоставлена, но она перезаписывается адаптером `location` в вашем профиле или `custom_location` в конфигурации модели.
- По умолчанию эта материализация имеет `iceberg_expire_snapshots`, установленный на 'True', если вам нужно иметь исторически проверяемые изменения, установите: `iceberg_expire_snapshots='False'`.
- В настоящее время, из-за некоторых внутренних особенностей dbt, каталог iceberg, используемый внутри при запуске интерактивных сессий glue с dbt-glue, имеет жестко заданное имя `glue_catalog`. Это имя является псевдонимом, указывающим на каталог AWS Glue, но специфично для каждой сессии. Если вы хотите взаимодействовать с вашими данными в другой сессии без использования dbt-glue (например, из блокнота Glue Studio), вы можете настроить другой псевдоним (т.е. другое имя для каталога Iceberg). Чтобы проиллюстрировать эту концепцию, вы можете установить в вашем конфигурационном файле: 
```
--conf spark.sql.catalog.RandomCatalogName=org.apache.iceberg.spark.SparkCatalog
```
А затем запустить в блокноте AWS Glue Studio сессию со следующей конфигурацией: 
```
--conf spark.sql.catalog.AnotherRandomCatalogName=org.apache.iceberg.spark.SparkCatalog
```
В обоих случаях подлежащим каталогом будет каталог AWS Glue, уникальный в вашем аккаунте AWS и регионе, и вы сможете работать с точно такими же данными. Также убедитесь, что если вы измените имя псевдонима каталога Glue, вы измените его во всех других `--conf`, где оно используется: 
```
 --conf spark.sql.catalog.RandomCatalogName=org.apache.iceberg.spark.SparkCatalog 
 --conf spark.sql.catalog.RandomCatalogName.catalog-impl=org.apache.iceberg.aws.glue.GlueCatalog 
 ...
 --conf spark.sql.catalog.RandomCatalogName.lock-impl=org.apache.iceberg.aws.glue.DynamoLockManager
```
- Полную ссылку на `table_properties` можно найти [здесь](https://iceberg.apache.org/docs/latest/configuration/).
- Таблицы Iceberg нативно поддерживаются Athena. Таким образом, вы можете выполнять запросы к таблицам, созданным и управляемым с помощью адаптера dbt-glue, из Athena.
- Инкрементальная материализация с форматом файла Iceberg поддерживает снимки dbt. Вы можете выполнить команду dbt snapshot, которая запрашивает таблицу Iceberg и создает снимок в формате dbt. 

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
#### Пример исходного кода снимка Iceberg

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

Мониторинг является важной частью поддержания надежности, доступности и производительности AWS Glue и других ваших решений AWS. AWS предоставляет инструменты мониторинга, которые вы можете использовать для наблюдения за AWS Glue, определения необходимого количества рабочих для вашей интерактивной сессии Glue, сообщения о проблемах и автоматического принятия мер, когда это необходимо. AWS Glue предоставляет Spark UI, а также журналы и метрики CloudWatch для мониторинга ваших заданий AWS Glue. Подробнее: [Мониторинг заданий AWS Glue Spark](https://docs.aws.amazon.com/glue/latest/dg/monitor-spark.html)

**Примечания по использованию:** Мониторинг требует:
- Добавить следующую политику IAM к вашей роли IAM:
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

- Добавить параметры мониторинга в вашу конфигурацию интерактивной сессии (в вашем профиле).
Подробнее о [параметрах задания, используемых AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

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

Если вы хотите использовать Spark UI, вы можете запустить сервер истории Spark, используя шаблон AWS CloudFormation, который размещает сервер на экземпляре EC2, или запустить его локально, используя Docker. Подробнее: [Запуск сервера истории Spark](https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-history.html#monitor-spark-ui-history-local)

## Включение автоматического масштабирования AWS Glue
Автоматическое масштабирование доступно с версии AWS Glue 3.0 или выше. Подробнее в следующем блоге AWS: ["Введение в автоматическое масштабирование AWS Glue: автоматическое изменение размера серверных вычислительных ресурсов для снижения затрат с оптимизированным Apache Spark"](https://aws.amazon.com/blogs/big-data/introducing-aws-glue-auto-scaling-automatically-resize-serverless-computing-resources-for-lower-cost-with-optimized-apache-spark/)

С включенным автоматическим масштабированием вы получите следующие преимущества:

* AWS Glue автоматически добавляет и удаляет рабочих из кластера в зависимости от параллелизма на каждом этапе или микропакете выполнения задания.

* Это устраняет необходимость в экспериментах и принятии решения о количестве рабочих, которые нужно назначить для ваших интерактивных сессий AWS Glue.

* Как только вы выберете максимальное количество рабочих, AWS Glue выберет правильный размер ресурсов для рабочей нагрузки.

* Вы можете увидеть, как размер кластера изменяется во время выполнения интерактивных сессий Glue, посмотрев на метрики CloudWatch.
Подробнее: [Мониторинг вашей интерактивной сессии Glue](#Monitoring-your-Glue-Interactive-Session).

**Примечания по использованию:** Автоматическое масштабирование AWS Glue требует:
- Установить версию AWS Glue 3.0 или выше.
- Установить максимальное количество рабочих (если автоматическое масштабирование включено, параметр `workers` устанавливает максимальное количество рабочих)
- Установить параметр `--enable-auto-scaling=true` в вашей конфигурации интерактивной сессии Glue (в вашем профиле).
Подробнее о [параметрах задания, используемых AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

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

## Доступ к каталогу Glue в другом аккаунте AWS
Во многих случаях вам может понадобиться запускать ваши задания dbt для чтения из другого аккаунта AWS.

Просмотрите следующую ссылку https://repost.aws/knowledge-center/glue-tables-cross-accounts, чтобы настроить политики доступа в исходных и целевых аккаунтах

Добавьте следующую строку `"spark.hadoop.hive.metastore.glue.catalogid=<AWS-ACCOUNT-ID>"` в конфигурацию `conf` в профиле dbt. Таким образом, вы сможете иметь несколько `outputs` — по одному для каждого аккаунта, к которому у вас есть доступ.

Примечание: доступ между аккаунтами должен быть в пределах одного региона AWS
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

Поддерживается сохранение документации на уровне relation. Подробнее о настройке сохранения документации см. в [документации](/reference/resource-configs/persist_docs).

Когда опция `persist_docs` настроена должным образом, вы сможете
видеть описания моделей в поле `Comment` команды `describe [table] extended`
или `show table extended in [database] like '*'`.

## Всегда `schema`, никогда `database`

Apache Spark использует термины "schema" и "database" взаимозаменяемо. dbt понимает
`database` как существующий на более высоком уровне, чем `schema`. Таким образом, вы _никогда_
не должны использовать или устанавливать `database` в качестве конфигурации узла или в целевом профиле при запуске dbt-glue.

Если вы хотите управлять схемой/базой данных, в которой dbt будет материализовывать модели,  
используйте **только** конфигурацию `schema` и макрос `generate_schema_name`.

Для получения дополнительной информации см. документацию dbt о [пользовательских схемах](/docs/build/custom-schemas).

## Интеграция с AWS Lakeformation
Адаптер поддерживает управление тегами AWS Lake Formation, позволяя вам ассоциировать существующие теги, определенные вне dbt-glue, с объектами базы данных, созданными dbt-glue (база данных, таблица, представление, снимок, инкрементальные модели, семена).

- Вы можете включить или отключить управление тегами lf через конфигурацию на уровне модели и проекта dbt (по умолчанию отключено)
- Если включено, теги lf будут обновляться при каждом запуске dbt. Существуют конфигурации тегов lf на уровне таблицы и конфигурации тегов lf на уровне столбцов. 
- Вы можете указать, что хотите удалить существующие теги базы данных, таблицы и столбцов Lake Formation, установив поле конфигурации drop_existing в True (по умолчанию False, что означает, что существующие теги сохраняются)
- Обратите внимание, что если тег, который вы хотите ассоциировать с таблицей, не существует, выполнение dbt-glue вызовет ошибку

Адаптер также поддерживает фильтрацию данных ячеек AWS Lakeformation. 
- Вы можете включить или отключить фильтрацию данных ячеек через конфигурацию на уровне модели и проекта dbt (по умолчанию отключено)
- Если включено, фильтры данных ячеек будут обновляться при каждом запуске dbt.
- Вы можете указать, что хотите удалить существующие фильтры данных ячеек таблицы, установив поле конфигурации drop_existing в True (по умолчанию False, что означает, что существующие фильтры сохраняются)
- Вы можете использовать поля конфигурации excluded_columns_names **ИЛИ** columns для выполнения безопасности на уровне столбцов. **Обратите внимание, что вы можете использовать одно или другое, но не оба**.
- По умолчанию, если вы не указываете ни один столбец или исключенные столбцы, dbt-glue не выполняет фильтрацию на уровне столбцов и позволяет принципалу получить доступ ко всем столбцам.

Ниже приведена конфигурация, которая позволяет указанному принципалу (пользователю IAM lf-data-scientist) получить доступ к строкам, у которых customer_lifetime_value > 15, и ко всем указанным столбцам ('customer_id', 'first_order', 'most_recent_order', 'number_of_orders')

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
Ниже приведена конфигурация, которая позволяет указанному принципалу (пользователю IAM lf-data-scientist) получить доступ к строкам, у которых customer_lifetime_value > 15, и ко всем столбцам, *кроме* указанного ('first_name')

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

Смотрите ниже несколько примеров того, как вы можете интегрировать управление тегами LF и фильтрацию данных в ваши конфигурации: 

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
Таким образом, вы можете указать теги и политику фильтрации данных для определенного пути в вашем проекте dbt (например, models, seeds, models/model_group1 и т.д.)
Это особенно полезно для семян, для которых вы не можете определить конфигурацию непосредственно в файле.

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

Для выполнения функционального теста:
1. Установите требования для разработки:
```bash
$ pip3 install -r dev-requirements.txt
```

2. Установите dev локально
```bash
$ python3 setup.py build && python3 setup.py install_lib
```

3. Экспортируйте переменные
```bash
$ export DBT_S3_LOCATION=s3://mybucket/myprefix
$ export DBT_ROLE_ARN=arn:aws:iam::1234567890:role/GlueInteractiveSessionRole
```

4. Запустите тест
```bash
$ python3 -m pytest tests/functional
```

Для получения дополнительной информации ознакомьтесь с документацией dbt о [тестировании нового адаптера](/guides/adapter-creation).

## Ограничения

### Поддерживаемая функциональность

Поддерживается большая часть функциональности <Constant name="core" />, однако некоторые возможности доступны только при использовании Apache Hudi.

Функции, доступные только в Apache Hudi:
1. Обновления инкрементальных моделей по `unique_key` вместо `partition_by` (см. [стратегию `merge`](/reference/resource-configs/glue-configs#the-merge-strategy))

Некоторые функции dbt, доступные в основных адаптерах, еще не поддерживаются в Glue:
1. [Сохранение](/reference/resource-configs/persist_docs) описаний на уровне столбцов в виде комментариев базы данных
2. [Снимки](/docs/build/snapshots)