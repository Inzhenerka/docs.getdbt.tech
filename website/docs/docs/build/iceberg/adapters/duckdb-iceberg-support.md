---
title: "DuckDB и Apache Iceberg"
id: duckdb-iceberg-support
sidebar_label: "Поддержка Iceberg в DuckDB"
description: Узнайте о поддержке Apache Iceberg в DuckDB.
---

# DuckDB и Apache Iceberg

:::info Только для <Constant name="fusion" />

Для поддержки `catalogs.yml` в DuckDB требуется [<Constant name="fusion_engine" />](/docs/introduction) с включённым флагом поведения `use_catalogs_v2`. Эта возможность недоступна в устаревшем Python-адаптере `dbt-duckdb` для <Constant name="core" />.

<File name='dbt_project.yml'>

```yaml
flags:
  use_catalogs_v2: true
```

</File>

В отличие от Snowflake, Databricks и BigQuery, DuckDB не поставляется с единым встроенным «управляемым» каталогом Iceberg. Это означает, что в DuckDB нельзя обойтись одним лишь `table_format='iceberg'` &mdash; для каждой модели Iceberg требуется `catalog_name`, указывающий на запись в [`catalogs.yml`](/docs/build/iceberg/catalogs-yml).

dbt поддерживает создание таблиц Iceberg для двух материализаций DuckDB:

- [Таблица](/docs/build/materializations#table)
- [Инкрементальная](/docs/build/materializations#incremental)

## Как DuckDB подключает каталоги

Когда вы настраиваете каталог с блоком `duckdb` в `catalogs.yml`, dbt самостоятельно формирует и выполняет соответствующий оператор DuckDB [`ATTACH`](https://duckdb.org/docs/sql/statements/attach.html) &mdash; вам не нужно писать SQL с `ATTACH` вручную. Затем dbt сопоставляет любую модель с соответствующим `catalog_name` с этой подключённой базой данных.

## Каталоги Iceberg REST

DuckDB может подключать любой каталог, реализующий протокол Iceberg REST, включая самостоятельно размещённые каталоги (например, [Lakekeeper](https://github.com/lakekeeper/lakekeeper) или [Nessie](https://github.com/projectnessie/nessie)), AWS Glue и AWS S3 Tables.

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: rest_catalog
    type: iceberg_rest
    table_format: iceberg
    config:
      duckdb:
        endpoint: "https://my-iceberg-rest.example.com"
        secret: my_iceberg_secret
```

</File>

<File name='models/my_iceberg_model.sql'>

```sql
{{
    config(
        materialized = 'table',
        catalog_name = 'rest_catalog'
    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

Запустите модель командой `dbt run -s my_iceberg_model`. Вместо `endpoint` можно использовать `endpoint_type: GLUE` или `endpoint_type: S3_TABLES`, чтобы подключить одну из этих известных конечных точек Iceberg REST, управляемых AWS, без указания URL:

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: s3_tables_catalog
    type: iceberg_rest
    table_format: iceberg
    config:
      duckdb:
        endpoint_type: S3_TABLES
        warehouse: "arn:aws:s3tables:us-east-1:123456789012:bucket/example"
```

</File>

Параметры `endpoint` и `endpoint_type` являются взаимоисключающими.

### Запись в S3 Tables

Для записи в S3 Tables используйте явно заданный `endpoint` с `authorization_type: SIGV4`.

В текущих предварительных сборках v2 сокращённая настройка `endpoint_type: S3_TABLES` работает для _чтения_, но при записи ошибочно использует OAuth2 вместо SigV4 по умолчанию. Это проявляется в виде одной из следующих ошибок:

```text
Invalid Configuration Error: AUTHORIZATION_TYPE is 'oauth2', yet no 'secret' was provided...
```

```text
InvalidArguments: HTTP Error: Failed to retrieve OAuth2 token from  (sqlstate: ...)
```

S3 Tables требует аутентификации SigV4. Пока эта проблема не исправлена, используйте конфигурацию с явно заданным `endpoint` и `authorization_type: SIGV4`. Для любого каталога S3 Tables, в который вы записываете данные, следуйте инструкциям из раздела [Запись в Amazon S3 Tables](#write-to-amazon-s3-tables).

<a id="amazon-s3-tables-write-path" />

## Запись в Amazon S3 Tables {#write-to-amazon-s3-tables}

Чтобы материализовать модели Iceberg в бакете S3 Tables, настройте каталог, учётные данные AWS и модель следующим образом.

### Настройка каталога
В `catalogs.yml` определите каталог `iceberg_rest` с явно заданной конечной точкой и аутентификацией SigV4, а также задайте параметры совместимости записи для S3 Tables:

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: s3_tables_catalog
    type: iceberg_rest
    table_format: iceberg
    config:
      duckdb:
        endpoint: "https://s3tables.<region>.amazonaws.com/iceberg"
        warehouse: "arn:aws:s3tables:<region>:<account-id>:bucket/<bucket-name>"
        authorization_type: SIGV4
        secret: s3_tables_secret
        default_schema: <namespace>
        stage_create_tables: false        # S3 Tables не поддерживает поэтапное создание через CREATE TABLE AS SELECT
        disable_multi_table_commit: true  # В S3 Tables нет конечной точки для фиксации транзакций с несколькими таблицами
        purge_requested: true             # S3 Tables допускает DROP TABLE только с включённым удалением файлов
```

</File>

Замените заполнители своим регионом AWS, идентификатором аккаунта, именем бакета таблиц и пространством имён.

`secret` ссылается на секрет типа `s3` с цепочкой поставщиков учётных данных, определённый в `profiles.yml` (см. [Секреты](#secrets)) &mdash; он предоставляет учётные данные SigV4, а не токен OAuth2.

### Настройка учётных данных AWS

В `profiles.yml` определите секрет типа `s3` с тем же именем, которое вы использовали в `catalogs.yml`. Поставщик `credential_chain` предоставляет учётные данные AWS для аутентификации SigV4.

<File name='profiles.yml'>

```yaml
my_profile:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: ':memory:'
      extensions:
        - iceberg
        - aws
        - httpfs
      secrets:
        - type: s3
          name: s3_tables_secret
          provider: credential_chain
          region: <region>
```

</File>

### Настройка модели
Задайте для `catalog_name` имя вашего каталога, а для `schema` &mdash; пространство имён S3 Tables:

<File name='models/my_s3_tables_model.sql'>

```sql
{{
    config(
        materialized = 'table',
        catalog_name = 's3_tables_catalog',
        schema = '<namespace>'
    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

### Согласование схемы с пространством имён

Поскольку схема DuckDB по умолчанию &mdash; `main`, стандартная логика именования схем в dbt объединяет её с пользовательской схемой модели (например, `main_my_namespace`), и полученное имя не совпадает с существующим пространством имён S3 Tables. 

Добавьте переопределение на уровне проекта, чтобы итоговое имя схемы точно совпадало с вашим пространством имён:

<File name='macros/generate_schema_name.sql'>

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- if custom_schema_name is none -%}
        {{ target.schema }}
    {%- else -%}
        {{ custom_schema_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

</File>

## Кроссплатформенный Mesh: чтение каталогов, управляемых другими платформами

Поскольку одна запись каталога в `catalogs.yml` может одновременно содержать конфигурацию для нескольких платформ, вы можете направить DuckDB к тому же физическому каталогу, в который записывает данные Snowflake или Databricks &mdash; это позволяет использовать [кроссплатформенный Mesh](/docs/mesh/cross-platform-mesh) без копирования данных.

### Snowflake Horizon

[Snowflake Horizon](/docs/build/iceberg/adapters/snowflake-iceberg-support) &mdash; это управляемый каталог Iceberg от Snowflake. Добавьте блок `duckdb` рядом с блоком `snowflake`, чтобы DuckDB мог подключить тот же каталог:

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: horizon_catalog
    type: horizon
    table_format: iceberg
    config:
      snowflake:
        external_volume: my_external_volume
      duckdb:
        warehouse: horizon_wh
        endpoint: "https://horizon.example.com/catalog"
        secret: horizon_secret
        default_schema: demo
```

</File>

### Databricks Unity Catalog

Аналогично для [Databricks Unity Catalog](/docs/build/iceberg/adapters/databricks-iceberg-support):

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: unity_catalog
    type: unity
    table_format: iceberg
    config:
      databricks:
        file_format: delta
        use_uniform: true
      duckdb:
        warehouse: unity_wh
        endpoint: "https://dbc-example.cloud.databricks.com/api/2.1/unity-catalog/iceberg"
        default_schema: demo
```

</File>

### Только чтение или чтение и запись

По умолчанию dbt подключает каталоги Horizon и Unity в режиме чтения и записи (`read_only: false`) и применяет для каждого из них параметры `ATTACH` по умолчанию, обеспечивающие совместимость записи (например, отключает фиксацию транзакций с несколькими таблицами в Unity). Для записи в эти каталоги из DuckDB требуются DuckDB 1.5.4+ и [duckdb-iceberg#1017](https://github.com/duckdb/duckdb-iceberg/issues/1017). Если вам нужно только *читать* таблицы Iceberg, записанные другой платформой, задайте `read_only: true`:

```yaml
      duckdb:
        warehouse: horizon_wh
        endpoint: "https://horizon.example.com/catalog"
        read_only: true
```

## DuckLake

[DuckLake](https://ducklake.select/) &mdash; это отдельный открытый формат таблиц (не Apache Iceberg), созданный для DuckDB, но настраивается он точно так же, через `catalogs.yml`. Поскольку DuckLake не является Iceberg, в записях его каталогов используется `table_format: default`.

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: local_lake
    type: ducklake
    table_format: default
    config:
      duckdb:
        metadata_path: "metadata.ducklake"
        data_path: "s3://my-bucket/lake" # необязательно
```

</File>

<File name='models/my_ducklake_model.sql'>

```sql
{{
    config(
        materialized = 'table',
        catalog_name = 'local_lake'
    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

dbt устанавливает расширение DuckLake и подключает каталог перед запуском вашей модели:

```sql
INSTALL ducklake
ATTACH IF NOT EXISTS 'ducklake:metadata.ducklake' AS local_lake (DATA_PATH 's3://my-bucket/lake')
```

## Секреты {#secrets}

Поле `secret` в блоке каталога `duckdb` ссылается на именованный секрет, определённый в `profiles.yml`, который dbt преобразует в оператор DuckDB [`CREATE SECRET`](https://duckdb.org/docs/configuration/secrets_manager.html):

<File name='profiles.yml'>

```yaml
my_profile:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: ':memory:'
      secrets:
        - type: iceberg
          name: my_iceberg_secret
          # Дополнительные пары ключ-значение становятся параметрами CREATE SECRET
          # (например, token, client_id, client_secret) — параметры для вашего каталога
          # см. в документации расширения iceberg для DuckDB.
```

</File>

Для Amazon S3 Tables вместо этого используйте секрет с `type: s3` / `provider: credential_chain` (SigV4, а не OAuth2 или аутентификацию по токену) &mdash; см. раздел [Amazon S3 Tables (запись)](#amazon-s3-tables-write-path) выше.

## Настройки каталогов Iceberg, специфичные для DuckDB

Для каталогов `horizon`, `unity` и `iceberg_rest` можно задать следующие настройки внутри `config.duckdb`:

| Поле | Обязательность | Описание |
| --- | --- | --- |
| `endpoint` | Один из параметров `endpoint`/`endpoint_type` | Полный URL каталога Iceberg REST. |
| `endpoint_type` | Один из параметров `endpoint`/`endpoint_type` | `GLUE` или `S3_TABLES` для известных конечных точек, управляемых AWS. Для записи в S3 Tables предпочтительно явно задавать `endpoint` (см. предупреждение выше). |
| `warehouse` | Обязательно для `horizon`; обязательно для любого каталога Amazon S3 Tables (как с `endpoint_type: S3_TABLES`, так и с явно заданным `endpoint` для записи) | Идентификатор хранилища, передаваемый в качестве источника для `ATTACH`. |
| `secret` | Необязательно | Имя секрета DuckDB из `profiles.yml`, используемого для аутентификации. |
| `attach_as` | Необязательно | Переопределяет псевдоним подключения DuckDB. По умолчанию используется `name` каталога. |
| `default_region` | Необязательно | Регион AWS, если применимо. |
| `default_schema` | Необязательно | Схема/пространство имён по умолчанию в каталоге. |
| `max_table_staleness` | Необязательно | Как долго DuckDB может использовать кешированные метаданные до их обновления. |
| `authorization_type` | Необязательно | `OAUTH2`, `SIGV4` или `NONE`. Нельзя сочетать с `endpoint_type`. Для записи в S3 Tables обязательно значение `SIGV4`. |
| `access_delegation_mode` | Необязательно | `VENDED_CREDENTIALS` или `NONE`. |
| `read_only` | Необязательно | Подключать каталог только для чтения. По умолчанию `false` (чтение и запись). |
| `support_nested_namespaces` | Необязательно | Поддерживает ли каталог вложенные пространства имён. |
| `stage_create_tables` | Необязательно | Совместимость записи: использовать поэтапную запись для `CREATE TABLE AS SELECT`. Требуется DuckDB 1.5.4+. Для Amazon S3 Tables задайте `false`. |
| `disable_multi_table_commit` | Необязательно | Совместимость записи: отключить фиксацию транзакций с несколькими таблицами. Требуется DuckDB 1.5.4+. Для Amazon S3 Tables задайте `true`. |
| `skip_create_table_metadata_updates` | Необязательно | Совместимость записи: пропускать обновления метаданных при `CREATE TABLE`. Требуется DuckDB 1.5.4+. |
| `remove_files_on_delete` | Необязательно | Совместимость записи: удалять соответствующие файлы данных при удалении таблицы. Требуется DuckDB 1.5.4+. |
| `purge_requested` | Необязательно | Удалять соответствующие файлы, если каталог поддерживает эту возможность. Для Amazon S3 Tables задайте `true`, поскольку этот сервис допускает `DROP TABLE` только с включённым удалением файлов. |
| `encode_entire_prefix` | Необязательно | Применять процентное кодирование ко всему префиксу ключа объекта. |

Для каталогов `ducklake` в `config.duckdb` доступны следующие параметры:

| Поле | Обязательность | Описание |
| --- | --- | --- |
| `metadata_path` | Обязательно | Путь к хранилищу метаданных DuckLake, например `metadata.ducklake`, или строка подключения к базе данных. |
| `data_path` | Необязательно | Расположение, в которое DuckLake записывает файлы данных. |
| `attach_as` | Необязательно | Переопределяет псевдоним подключения DuckDB. По умолчанию используется `name` каталога. |
| `metadata_schema` | Необязательно | Используемая схема в хранилище метаданных. |
| `metadata_catalog` | Необязательно | Имя каталога/базы данных в хранилище метаданных. |
| `data_inlining_row_limit` | Необязательно | Встраивать группы строк, содержащие меньше указанного количества строк, в каталог метаданных вместо записи в файл Parquet. |
| `create_if_not_exists` | Необязательно | Создавать каталог DuckLake, если он ещё не существует. |
| `read_only` | Необязательно | Подключать только для чтения. |
| `encrypted` | Необязательно | Шифровать каталог DuckLake. |
| `automatic_migration` | Необязательно | Автоматически выполнять миграцию версии формата DuckLake в каталоге при подключении. |
| `override_data_path` | Необязательно | Разрешать подключение с `data_path`, отличающимся от пути, записанного в существующем каталоге. |
