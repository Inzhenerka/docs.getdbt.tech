---
title: "Amazon Web Services и Apache Iceberg"
id: aws-iceberg-support
sidebar_label: "Поддержка Iceberg в AWS"
description: Узнайте о поддержке Apache Iceberg в AWS в dbt, включая AWS Glue Data Catalog, Amazon Athena и Amazon S3 Tables.
---

dbt материализует таблицы Iceberg в AWS через [AWS Glue Data Catalog](#aws-glue-data-catalog) — каталог, общий для аналитических движков AWS. Настроить это можно двумя способами:

- **Самый простой:** задайте `table_type = 'iceberg'` в конфигурации модели, чтобы dbt материализовал эту модель как таблицу Iceberg в AWS Glue Data Catalog через Amazon Athena.
- **Расширяемый:** определите каталог Iceberg в `catalogs.yml` и настройте для этой модели `catalog_name`. Это обязательно для работы с [Amazon S3 Tables](#amazon-s3-tables).

dbt поддерживает создание таблиц Iceberg для двух материализаций Athena:

- [Таблица](/docs/build/materializations#table)
- [Инкрементальная](/docs/build/materializations#incremental), со стратегией `merge`

## AWS Glue Data Catalog

В AWS [AWS Glue Data Catalog](https://docs.aws.amazon.com/athena/latest/ug/glue-athena.html) — это слой метаданных, в котором регистрируются таблицы Iceberg. Он служит общим источником достоверных данных, позволяющим одному движку записывать таблицу, а другому — читать её: Amazon Athena, Amazon Redshift, Amazon EMR и Apache Spark обращаются к таблицам Iceberg через Glue. Чтобы создавать такие таблицы с помощью dbt через Amazon Athena, используйте [dbt-athena](/docs/local/connect-data-platform/athena-setup).

Amazon S3 Tables расширяет эту модель управляемым каталогом Iceberg с собственным хранилищем, доступным в Glue через федеративный каталог. Оба подхода позволяют регистрировать таблицы Iceberg с управлением доступом, которые может читать любой движок, подключённый к Glue.

## Amazon Athena и Iceberg

Athena выполняет запросы к таблицам Iceberg, зарегистрированным в AWS Glue Data Catalog. 

### Предварительные требования
- Для таблиц Iceberg требуется [версия 3 движка Athena](https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html).
- Каждой таблице также необходимо уникальное расположение хранилища, если вы не используете Amazon S3 Tables, который управляет хранилищем за вас.

1. Чтобы локально подключить dbt к Athena, определите целевое подключение dbt-athena в `profiles.yml`:

  <File name='profiles.yml'>

  ```yaml
  my_profile:
    target: dev
    outputs:
      dev:
        type: athena
        s3_staging_dir: s3://my-athena-results-bucket/staging/
        region_name: <region>
        database: awsdatacatalog
        schema: my_schema
        threads: 4
  ```

  </File>

Полный список параметров подключения приведён на [странице настройки dbt-athena](/docs/local/connect-data-platform/athena-setup).

2. Чтобы создать таблицу Iceberg без `catalogs.yml`, задайте `table_type='iceberg'` в конфигурации модели:

  <File name="models/my_iceberg_model.sql">

  ```sql
  {{
      config(
          materialized = 'table',
          table_type = 'iceberg',
          format = 'parquet'
      )
  }}

  select * from {{ ref('jaffle_shop_customers') }}
  ```

  </File>

## Amazon S3 Tables

[Amazon S3 Tables](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables.html) — это управляемое хранилище Apache Iceberg в AWS. S3 Tables управляет собственным расположением хранилища и снимками Iceberg, поэтому обращение к нему отличается от обращения к обычной таблице Iceberg, зарегистрированной в Glue &mdash; для него требуется специальная интеграция каталога `type: s3_tables`.

:::info Доступность адаптера

Поддержка S3 Tables доступна в <Constant name="dbt_platform"/> и в `dbt-athena` версии `1.11.1` или более поздней.
:::

### Включение интеграции S3 Tables с Glue

Athena обращается к бакету S3 Tables через федеративный каталог Glue с именем `s3tablescatalog`. Каждый бакет таблиц отображается в этом каталоге. Включите интеграцию один раз для каждой учётной записи AWS и региона: либо в консоли Amazon S3, выбрав **Enable integration** при создании бакета таблиц, либо с помощью AWS CLI:

```shell
aws glue create-catalog \
  --name "s3tablescatalog" \
  --catalog-input '{
    "Description": "Federated catalog for S3 Tables",
    "FederatedCatalog": {
      "Identifier": "arn:aws:s3tables:<region>:<account-id>:bucket/*",
      "ConnectionName": "aws:s3tables"
    },
    "CreateDatabaseDefaultPermissions": [{
      "Principal": {"DataLakePrincipalIdentifier": "IAM_ALLOWED_PRINCIPALS"},
      "Permissions": ["ALL"]
    }],
    "CreateTableDefaultPermissions": [{
      "Principal": {"DataLakePrincipalIdentifier": "IAM_ALLOWED_PRINCIPALS"},
      "Permissions": ["ALL"]
    }]
  }'
```

В этом примере используется `IAM_ALLOWED_PRINCIPALS` для настройки доступа исключительно через IAM. Доступ контролируется разрешениями IAM роли, выполняющей запросы, без необходимости настраивать AWS Lake Formation.

При необходимости детальных разрешений или централизованного управления доступом можно дополнительно использовать Lake Formation. Оба варианта описаны в разделе [Включение интеграции S3 Tables с Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/enable-s3-tables-catalog-integration.html).

### Настройка проекта dbt

1. Включите флаг поведения `use_catalogs_v2` в `dbt_project.yml`:

   <File name="dbt_project.yml">

   ```yaml
   flags:
     use_catalogs_v2: true
   ```

   </File>

2. Создайте файл `catalogs.yml` в корневом каталоге проекта dbt:

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: s3_tables_catalog
    type: s3_tables
    table_format: iceberg
    config:
      athena:
        catalog_database: s3tablescatalog/<your-table-bucket-name>
        file_format: parquet
```

</File>

  Задайте в `catalog_database` имя федеративного каталога Glue для вашего бакета таблиц S3 (то же имя, которое Athena использует для обращения к нему). dbt использует это значение в качестве `database` модели. Если `catalog_database` не указан, используется `database` из профиля.  Итоговое значение `schema` модели определяет пространство имён S3 Tables.

3. Добавьте параметр конфигурации `catalog_name` в блок конфигурации (внутри файла модели `.sql`), в YAML-файл свойств (в папке моделей) или в YAML-файл проекта (`dbt_project.yml`):

<File name='models/my_s3_tables_model.sql'>

```sql
{{
    config(
        materialized = 'table',
        catalog_name = 's3_tables_catalog',
        schema = 'my_namespace'
    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

4. Запустите модель dbt:

 ```shell
   dbt run -s my_s3_tables_model
   ```

### Создание инкрементальной модели

:::info Полное обновление не поддерживается

Реализация, добавленная в [dbt-adapters#2047](https://github.com/dbt-labs/dbt-adapters/pull/2047), поддерживает первоначальный и повторные инкрементальные запуски с `merge`, но не поддерживает `--full-refresh` для инкрементальных моделей S3 Tables.

Перед повторным созданием инкрементальной таблицы ознакомьтесь с разделом [Ограничение полного обновления](#full-refresh-limitation).

:::

Чтобы обновить существующую таблицу новыми или изменёнными строками, используйте материализацию `incremental` со стратегией `merge`. Задайте `unique_key`, чтобы dbt мог сопоставлять входящие записи с существующими строками:

<File name='models/my_incremental_s3_tables_model.sql'>

```sql
{{
    config(
        materialized = 'incremental',
        incremental_strategy = 'merge',
        unique_key = 'id',
        catalog_name = 's3_tables_catalog',
        schema = 'my_namespace'
    )
}}

select * from {{ ref('my_s3_tables_model') }}
```

</File>

При первом запуске, когда целевая таблица ещё не существует, dbt создаёт инкрементальную модель с помощью `CREATE TABLE AS` (используя тот же механизм, учитывающий удаление и повторное создание таблиц, что и материализация `table`), а при последующих запусках переходит на `merge`. Для первоначального создания таблицы `--full-refresh` не требуется.

### Как dbt записывает данные в S3 Tables

Интеграция каталога `s3_tables` учитывает различия в работе с хранилищем и DDL между S3 Tables и стандартной таблицей Iceberg, зарегистрированной в Glue:

- **Расположения хранилища:** dbt не включает `LOCATION` в `CREATE TABLE AS`, поскольку S3 Tables управляет хранилищем самостоятельно и не допускает явного указания расположения.
- **Замена таблиц:** dbt удаляет и повторно создаёт таблицы вместо их переименования. S3 Tables не поддерживает `ALTER TABLE ... RENAME`, который стандартная материализация таблиц Glue использует для подмены таблиц с практически нулевым временем простоя. dbt удаляет метаданные таблицы через Glue Data Catalog, а не выполняет SQL-команду `DROP TABLE` и не удаляет файлы S3 напрямую.
- **Распознавание таблиц:** dbt распознаёт S3 Tables как таблицы Iceberg, хотя Glue возвращает для их `TableType` значение `customer` или `aws` для таблиц, управляемых сервисом.

### Ограничение полного обновления {#full-refresh-limitation}

Запуск инкрементальной модели S3 Tables с `--full-refresh` завершается следующей ошибкой:


```
An error occurred (InvalidRequestException) when calling the StartQueryExecution
operation: Unsupported DDL query for S3 table buckets
```

Это происходит потому, что при полном обновлении инкрементальная материализация по-прежнему подменяет таблицы с помощью `ALTER TABLE ... RENAME TO ...__bkp`, который S3 Tables не поддерживает.  Исправление с удалением и повторным созданием таблиц для материализации `table` пока не распространяется на этот сценарий. 

Пока эта проблема не решена в исходном проекте, не используйте `--full-refresh` для инкрементальных моделей S3 Tables. Чтобы заново создать таблицу:
- Удалите таблицу через API или консоль S3 Tables, затем повторно запустите модель.
- Создайте её заново, используя материализацию `table`.

## Параметры конфигурации каталогов Iceberg для AWS

Укажите эти параметры во вложенном разделе `config.athena` записи каталога в `catalogs.yml`:

<SimpleTable>

| Поле | Обязательность | Описание |
| --- | --- | --- |
| `catalog_database` | Необязательно | Имя федеративного каталога Glue для целевого бакета, например `s3tablescatalog/<bucket-name>`. Определяет `database` модели. Если не указано, используется `database` из профиля. |
| `file_format` | Необязательно | Формат записываемых файлов данных. По умолчанию — `parquet`. |
</SimpleTable>

## Другие движки AWS

На этой странице описана интеграция каталогов Iceberg через `dbt-athena`.

Информацию о поддержке других движков AWS см. на [странице адаптеров с поддержкой Apache Iceberg](/docs/build/iceberg/apache-iceberg-support).

В настоящее время такие движки, как dbt-spark (в Amazon EMR), dbt-trino и dbt-redshift, могут читать и записывать таблицы Iceberg, зарегистрированные в Glue, если настроить собственный каталог Iceberg движка на работу с AWS Glue Data Catalog или REST-эндпоинтом Iceberg для S3 Tables, но они пока не предоставляют встроенный AWS `catalog_type` в `catalogs.yml`.
