---
title: "Snowflake и Apache Iceberg"
id: snowflake-iceberg-support
sidebar_label: "Поддержка Iceberg в Snowflake"
description: Узнайте о поддержке Apache Iceberg в Snowflake.
---

import BaseLocationEnvIsolation from '/snippets/_base-location-env-isolation-warning.md';

dbt поддерживает материализацию таблиц в формате Iceberg двумя разными способами:

- Поле конфигурации модели `table_format = 'iceberg'` (устаревший способ)
- Интеграция с каталогом, которую можно настроить в config-блоке (внутри `.sql` файла модели), в properties YAML файле (папка модели) или в YAML файле проекта ([`dbt_project.yml`](/reference/dbt_project.yml)) 

:::info Конфигурация интеграции с каталогом

Для использования интеграции необходимо создать файл `catalogs.yml` и применить эту интеграцию на уровне конфигурации.

Подробнее см. в разделе [Configure catalog integration](#configure-catalog-integration-for-managed-iceberg-tables).

:::

Мы рекомендуем использовать конфигурацию Iceberg-каталога и указывать каталог в конфигурации модели — это проще в использовании и позволит подготовить код к будущим изменениям. Прямое использование `table_format = 'iceberg'` в конфигурации модели является устаревшим подходом и ограничивает использование только Snowflake Horizon в качестве каталога. Поддержка каталогов доступна начиная с dbt 1.10+.

## Создание Iceberg-таблиц

dbt поддерживает создание Iceberg-таблиц для трёх типов материализаций Snowflake: 

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)
- [Dynamic Table](/reference/resource-configs/snowflake-configs#dynamic-tables) 

## Iceberg-каталоги

Snowflake поддерживает Iceberg-таблицы как через встроенные, так и через внешние каталоги, включая:
- Snowflake Horizon (встроенный каталог) 
- Polaris/Open Catalog (управляемый Polaris)
- Glue Data Catalog (поддерживается в dbt-snowflake через [catalog-linked database](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database#label-catalog-linked-db-create) с Iceberg REST)
- Iceberg REST-совместимые каталоги 

dbt поддерживает встроенный каталог Snowflake и Iceberg REST-совместимые каталоги (включая Polaris и Unity Catalog) в dbt-snowflake. 

Чтобы использовать внешний каталог (любой каталог, кроме встроенного), необходимо настроить интеграцию с каталогом. Для этого нужно выполнить SQL-команду, аналогичную приведённой ниже.

### Внешние каталоги

Примеры конфигураций для внешних каталогов.

<Tabs>

<TabItem value="Polaris/Open Catalog">

Для использования Polaris/Open Catalog (управляемый Polaris) необходимо настроить интеграцию с каталогом. 

Пример кода:

```sql
CREATE CATALOG INTEGRATION my_polaris_catalog_int 
  CATALOG_SOURCE = POLARIS 
  TABLE_FORMAT = ICEBERG 
  REST_CONFIG = (
    CATALOG_URI = 'https://<org>-<account>.snowflakecomputing.com/polaris/api/catalog' 
    CATALOG_NAME = '<open_catalog_name>' 
  ) 
  REST_AUTHENTICATION = (
    TYPE = OAUTH 
    OAUTH_CLIENT_ID = '<client_id>' 
    OAUTH_CLIENT_SECRET = '<client_secret>' 
    OAUTH_ALLOWED_SCOPES = ('PRINCIPAL_ROLE:ALL') 
  ) 
  ENABLED = TRUE;
```

Выполнение этой команды зарегистрирует внешний каталог Polaris в Snowflake. После настройки dbt сможет создавать Iceberg-таблицы в Snowflake, регистрируя существование нового объекта базы данных в каталоге как метаданные, а также выполнять запросы к таблицам, управляемым Polaris. 

</TabItem>

<TabItem value="Glue Data Catalog" >

Чтобы настроить Glue Data Catalog в качестве внешнего каталога, необходимо выполнить два предварительных шага:

- **Создать AWS IAM роль для доступа к Glue:** Настройте AWS-права так, чтобы Snowflake мог читать Glue Catalog. Обычно это означает создание AWS IAM роли, которую Snowflake будет использовать, с политиками, разрешающими операции чтения каталога Glue (как минимум `glue:GetTable` и `glue:GetTables` для соответствующих баз Glue). Также необходимо добавить trust policy, позволяющую Snowflake принимать эту роль (через external ID).

- **Настроить интеграцию с каталогом:** В Snowflake создайте интеграцию каталога типа GLUE. Это зарегистрирует информацию о Glue Data Catalog и IAM роли в Snowflake. Например:

```sql
CREATE CATALOG INTEGRATION my_glue_catalog_int
  CATALOG_SOURCE = GLUE
  CATALOG_NAMESPACE = 'dbt_database' 
  TABLE_FORMAT = ICEBERG
  GLUE_AWS_ROLE_ARN = 'arn:aws:iam::123456789012:role/myGlueRole'
  GLUE_CATALOG_ID = '123456789012'
  GLUE_REGION = 'us-east-2'
  ENABLED = TRUE;
```

Glue Data Catalog поддерживает спецификацию Iceberg REST, поэтому к Glue можно подключаться через Iceberg REST API.

#### Материализация таблиц в Snowflake

Начиная с dbt Core v1.11, dbt-snowflake поддерживает базовую материализацию таблиц Iceberg, зарегистрированных в Glue Catalog, через catalog-linked database. Обратите внимание, что инкрементальные материализации пока не поддерживаются.

Для использования этой функциональности требуется:

- **Catalog-linked database:** необходимо использовать [catalog-linked database](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database#label-catalog-linked-db-create), настроенную для вашей интеграции Glue Catalog.
- **Формат идентификаторов:** имена таблиц и колонок должны состоять только из букв и цифр, быть в нижнем регистре и заключаться в двойные кавычки для совместимости с Glue.

Чтобы указать Glue как тип базы данных, добавьте `catalog_linked_database_type: glue` в разделе `adapter_properties`:

```yml
catalogs:
  - name: my_glue_catalog
    active_write_integration: glue_rest
    write_integrations:
      - name: glue_rest
        catalog_type: iceberg_rest
        table_format: iceberg
        adapter_properties:
          catalog_linked_database: catalog_linked_db_glue
          catalog_linked_database_type: glue
```

</TabItem>

<TabItem value="Iceberg REST API">

Вы можете настроить интеграцию для каталогов, совместимых со спецификацией Apache Iceberg REST с открытым исходным кодом.

Пример кода: 

```sql
CREATE CATALOG INTEGRATION my_iceberg_catalog_int
  CATALOG_SOURCE = ICEBERG_REST
  TABLE_FORMAT = ICEBERG
  CATALOG_NAMESPACE = 'dbt_database'
  REST_CONFIG = (
    restConfigParams
  )
  REST_AUTHENTICATION = (
    restAuthenticationParams
  )
  ENABLED = TRUE
  REFRESH_INTERVAL_SECONDS = <value> 
  COMMENT = 'catalog integration for dbt iceberg tables'
```

Для Unity Catalog с bearer token:

```sql
CREATE OR REPLACE CATALOG INTEGRATION my_unity_catalog_int_pat
  CATALOG_SOURCE = ICEBERG_REST
  TABLE_FORMAT = ICEBERG
  CATALOG_NAMESPACE = 'my_namespace'
  REST_CONFIG = (
    CATALOG_URI = 'https://my-api/api/2.1/unity-catalog/iceberg'
    CATALOG_NAME= '<catalog_name>'
  )
  REST_AUTHENTICATION = (
    TYPE = BEARER
    BEARER_TOKEN = '<bearer_token>'
  )
  ENABLED = TRUE;
```

</TabItem>

</Tabs>

После создания интеграции с внешним каталогом вы сможете:

- **Выполнять запросы к таблицам, управляемым внешним каталогом:** Snowflake может выполнять запросы к Iceberg-таблицам, чьи метаданные хранятся во внешнем каталоге. В этом сценарии Snowflake выступает как «читатель» внешнего каталога. Данные таблиц остаются во внешнем облачном хранилище (AWS S3 или GCP Bucket), определённом в конфигурации хранилища каталога. Snowflake использует интеграцию с каталогом для получения метаданных через REST API, а затем читает файлы данных из облачного хранилища.

- **Синхронизировать таблицы, управляемые Snowflake, с внешним каталогом:** Вы можете создать Iceberg-таблицу в Snowflake, управляемую Snowflake через облачное хранилище, и затем зарегистрировать/синхронизировать эту таблицу с внешним каталогом. Это позволяет другим движкам обнаруживать эту таблицу.

## Конфигурации интеграции каталога dbt для Snowflake

В таблице ниже перечислены поля конфигурации, необходимые для настройки интеграции каталога для [Iceberg-таблиц в Snowflake](/reference/resource-configs/snowflake-configs#iceberg-table-format).

| Field            | Required | Accepted values                                                                         |
|------------------|----------|-----------------------------------------------------------------------------------------|
| `name`           | yes      | Имя интеграции каталога                                                                |
| `catalog_name`   | yes      | Имя интеграции каталога в Snowflake. Например, `my_dbt_iceberg_catalog`               |
| `external_volume`| yes      | `<external_volume_name>`                                                                |
| `table_format`   | yes      | `iceberg`                                                                               |
| `catalog_type`   | yes      | `built_in`, `iceberg_rest`                                                             |
| `adapter_properties`| optional| См. ниже                                                                               |

Вы можете подключаться к внешним Iceberg-совместимым каталогам, таким как Polaris и Unity Catalog, через тип `catalog_type = iceberg_rest`. Обратите внимание, что поддержка Iceberg REST доступна только при использовании [Catalog Linked Databases](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database). 

### Свойства адаптера

Это дополнительные конфигурации, специфичные для Snowflake, которые можно указывать внутри `adapter_properties`. 

#### Встроенный каталог

<VersionBlock lastVersion="1.99">
| Field | Required | Accepted values |
| --- | --- | --- |
| `change_tracking` | Optional | `True` или `False`    |
| `data_retention_time_in_days` | Optional | Standard Account: `1`, Enterprise и выше: `0`–`90`, по умолчанию `1`  |
| `max_data_extension_time_in_days` | Optional |  `0`–`90`, по умолчанию `14`  |
| `storage_serialization_policy` | Optional | `COMPATIBLE` или `OPTIMIZED`     |
</VersionBlock>

<VersionBlock firstVersion="2.0">
| Field | Required | Accepted values |
| --- | --- | --- |
| `change_tracking` | Optional | `True` или `False`    |
| `data_retention_time_in_days` | Optional | Standard Account: `1`, Enterprise и выше: `0`–`90`, по умолчанию `1`  |
| `max_data_extension_time_in_days` | Optional |  `0`–`90`, по умолчанию `14`  |
| `storage_serialization_policy` | Optional | `COMPATIBLE` или `OPTIMIZED`     |
| `base_location_root` | Optional | относительный сегмент пути (например, `'subpath1/subpath2'`) |
| `base_location_subpath` | Optional | относительный сегмент пути (например, `'subpath1/subpath2'`), настраивается только на уровне модели |
</VersionBlock>

#### REST-каталог

| Field | Required | Accepted values |
| --- | --- | --- |
| `auto_refresh` | Optional | `True` или `False`    |
| `catalog_linked_database` | Required для `catalog type: iceberg_rest` | Имя catalog-linked database   |
| `catalog_linked_database_type` | Optional | Тип catalog-linked database. Например, `glue`  |
| `max_data_extension_time_in_days` | Optional |  `0`–`90`, по умолчанию `14`  |
| `target_file_size` | Optional | Значения вроде `'AUTO'`, `'16MB'`, `'32MB'`, `'64MB'`, `'128MB'`. Регистр не важен  |

- **storage_serialization_policy:** Политика сериализации определяет, какое кодирование и сжатие Snowflake будет применять к файлам данных таблицы. Если значение не указано при создании таблицы, оно наследуется от схемы, базы данных или аккаунта. Если значение не указано нигде, используется значение по умолчанию. Изменить этот параметр после создания таблицы нельзя.
- **max_data_extension_time_in_days:** Максимальное количество дней, на которое Snowflake может автоматически продлить период хранения данных таблицы, чтобы стримы не стали устаревшими. Параметр позволяет ограничить этот период для контроля затрат на хранение или по требованиям комплаенса.
- **data_retention_time_in_days:** Для управляемых Iceberg-таблиц можно задать период хранения для Snowflake Time Travel и восстановления таблиц сверх значений аккаунта по умолчанию. Для таблиц с внешним каталогом Snowflake использует значение этого параметра для Time Travel и восстановления. По истечении периода хранения Snowflake не удаляет Iceberg-метаданные или снимки из внешнего облачного хранилища.
- **change_tracking:** Определяет, включено ли отслеживание изменений для таблицы.
- **catalog_linked_database:** [Catalog-linked databases](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database) (CLD) позволяют Snowflake автоматически синхронизировать метаданные (включая пространства имён и Iceberg-таблицы) из внешнего Iceberg-каталога и регистрировать их как удалённые таблицы. Использование CLD обязательно, потому что без него dbt не сможет управлять таблицей end-to-end. Snowflake не поддерживает удаление Iceberg-таблиц во внешнем каталоге без CLD — возможно только отвязывание таблицы, что расходится с ожиданиями dbt.
- **auto_refresh:** Определяет, должен ли Snowflake автоматически опрашивать внешний Iceberg-каталог на наличие обновлений метаданных. Если `REFRESH_INTERVAL_SECONDS` не задан, используется интервал по умолчанию — 30 секунд.
- **target_file_size:** Задаёт целевой размер файлов Parquet. Значение по умолчанию — `AUTO`.

<VersionBlock firstVersion="2.0">
Следующие свойства можно задавать в конфигурации модели в поле `adapter_properties` или как верхнеуровневые поля. Если они заданы в обоих местах, приоритет имеет значение из `adapter_properties`. Подробнее см. [Base location](#base-location).
- **base_location_root:** Определяет префикс параметра [`BASE_LOCATION`](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake#optional-parameters), то есть путь записи Iceberg-таблицы.
- **base_location_subpath:** Определяет суффикс `BASE_LOCATION`. Этот параметр можно задавать только в конфигурации модели, но не в `catalogs.yml`.
</VersionBlock>

### Настройте интеграцию каталога для управляемых таблиц Iceberg

1. Создайте файл `catalogs.yml` в корне проекта dbt.<br />
<br />Пример использования Snowflake Horizon в качестве каталога:

```yaml
catalogs:
  - name: catalog_horizon
    active_write_integration: snowflake_write_integration
    write_integrations:
      - name: snowflake_write_integration
        external_volume: dbt_external_volume
        table_format: iceberg
        catalog_type: built_in
        adapter_properties:
          change_tracking: True
```

2. Добавьте параметр конфигурации `catalog_name` либо в config-блок (внутри `.sql` файла модели), либо в properties YAML файл (папка модели), либо в YAML файл проекта (`dbt_project.yml`). <br />
<br />Пример `iceberg_model.sql`:

```sql
{{
    config(
        materialized='table',
        catalog_name = 'catalog_horizon'
    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

3. Запустите модель dbt командой `dbt run -s iceberg_model`.

Дополнительную информацию см. в документации по [Snowflake configurations](/reference/resource-configs/snowflake-configs).

### Ограничения

Для внешних каталогов Snowflake поддерживает только режим `read`, то есть может выполнять запросы к таблице, но не может вставлять или изменять данные. 

Процесс синхронизации зависит от выбранного каталога. Некоторые каталоги обновляются автоматически, и это можно настраивать через параметры интеграции. Для других каталогов может потребоваться отдельный процесс или джоб для синхронизации метаданных. 

<VersionBlock firstVersion="1.9">

## Формат таблиц Iceberg

Адаптер dbt-snowflake также поддерживает применение `table_format` как отдельной конфигурации для моделей dbt-snowflake. Мы не рекомендуем использовать это, так как это устаревшее поведение, и вы сможете записывать данные только в Snowflake Horizon (а не во внешние каталоги Iceberg).

Поддерживаются следующие конфигурации.
Подробнее см. документацию Snowflake по [`CREATE ICEBERG TABLE` (Snowflake как каталог)](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake).

| Параметр | Тип   | Обязательно | Описание   | Пример значения | Примечание   |
| ------ | ----- | -------- | ------------- | ------------ | ------ |
| `table_format` | String | Да     | Настраивает формат таблицы объекта.  | `iceberg`  | Единственное допустимое значение — `iceberg`.    |
| `external_volume` | String | Да(*)   | Указывает идентификатор (имя) external volume, куда Snowflake записывает метаданные и файлы данных таблицы Iceberg. | `my_s3_bucket`            | *Указывать не нужно, если на уровне аккаунта, базы данных или схемы уже задан external volume по умолчанию. [Подробнее](https://docs.snowflake.com/user-guide/tables-iceberg-configure-external-volume#set-a-default-external-volume-at-the-account-database-or-schema-level) |
| `base_location_root` | String  | Нет  | Если задано, значение переопределит base_location по умолчанию в dbt — `_dbt` |
| `base_location_subpath` | String | Нет       | Необязательный суффикс, который добавляется к пути `base_location`, который dbt задаёт автоматически.     | `jaffle_marketing_folder` | Мы рекомендуем не указывать это. Изменение этого параметра приводит к созданию новой таблицы Iceberg. Подробнее см. в разделе [Base Location](#base-location).                                                                                                  |

### Пример конфигурации

Чтобы настроить материализацию Iceberg table в dbt, см. пример конфигурации:

<File name='models/<modelname>.sql'>

```sql

{{
  config(
    materialized = "table",
    table_format="iceberg",
    external_volume="s3_iceberg_snow",
  )
}}

select * from {{ ref('raw_orders') }}

```

</File>

### Base location

<VersionBlock lastVersion="1.99">
DDL-команда Snowflake `CREATE ICEBERG TABLE` требует указать `base_location`. dbt задаёт этот параметр за пользователя, чтобы упростить использование и обеспечить базовую изоляцию данных таблицы внутри `EXTERNAL VOLUME`. Поведение dbt по умолчанию — задавать строку `base_location` в виде: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`.

Мы рекомендуем использовать поведение по умолчанию, но если вам нужно кастомизировать итоговый `base_location`, dbt позволяет настроить base_location с помощью полей конфигурации модели `base_location_root` и `base_location_subpath`.

- Если входные параметры не заданы, dbt выведет base_location: `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- Если base_location_root = `foo`, dbt выведет: `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- Если base_location_subpath = `bar`, dbt выведет: `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- Если base_location = `foo` и base_location_subpath = `bar`, dbt выведет: `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

Хотя вы можете кастомизировать пути с помощью `base_location_root` и `base_location_subpath`, мы не рекомендуем полагаться на них для изоляции окружений (например, для разделения development и production). Эти значения конфигурации может легко изменить любой человек с доступом к репозиторию. Для настоящей изоляции окружений используйте отдельные `EXTERNAL VOLUME` с инфраструктурными контролями доступа.

#### Примеры конфигураций

Пример модели с кастомизированным `base_location`:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='catalog_horizon',
        base_location_root='foo',
        base_location_subpath='bar',

    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

</VersionBlock>

<VersionBlock firstVersion="2.0">
DDL-команда Snowflake `CREATE ICEBERG TABLE` требует указать `base_location`. dbt задаёт этот параметр за пользователя, чтобы упростить использование и обеспечить базовую изоляцию данных таблицы внутри `EXTERNAL VOLUME`. Поведение dbt по умолчанию — задавать строку `base_location` в виде: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`.

Мы рекомендуем использовать поведение по умолчанию, но если вам нужно кастомизировать итоговый `base_location`, dbt позволяет настроить base_location с помощью adapter properties `base_location_root` и `base_location_subpath`. `base_location_subpath` принимается только в конфигурациях модели. Подробнее см. [Adapter Properties](#adapter-properties).

- Если входные параметры не заданы, dbt выведет base_location: `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- Если base_location_root = `foo`, dbt выведет: `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- Если base_location_subpath = `bar`, dbt выведет: `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- Если base_location = `foo` и base_location_subpath = `bar`, dbt выведет: `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

<BaseLocationEnvIsolation />

#### Примеры конфигураций

Пример модели с кастомизированным `base_location`:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='catalog_horizon',
        adapter_properties={
          'base_location_root': 'foo',
          'base_location_subpath': 'bar',
        }

    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

:::info Устаревшая конфигурация модели для base_location

Для обратной совместимости dbt <Constant name="fusion"/> также поддерживает задание `base_location_root` и `base_location_subpath` как top-level полей конфигурации модели. Конфигурации `adapter_properties` имеют приоритет над устаревшими конфигурациями.

Например, в следующей конфигурации модели `base_location_root`=`bar` переопределяет `base_location_root`=`foo`.

```sql
config(
    materialized='table',
    catalog_name='catalog_horizon',
    base_location_root='foo',
    base_location_subpath='bar',
    adapter_properties={
      'base_location_root': 'bar',
    },
)
```
Эта конфигурация даёт результат: `base_location` = `{{ external_volume }}/bar/{{ schema }}/{{ model_name }}/bar`
:::

</VersionBlock>


#### Обоснование

По умолчанию dbt управляет `base_location` за пользователя, чтобы обеспечивать best practices. Для таблиц формата Iceberg, управляемых Snowflake, пользователь владеет и обслуживает хранилище данных таблиц во внешнем хранилище (заданном как `external volume`). Параметр `base_location` определяет, куда записывать данные внутри external volume. Каталог Snowflake Iceberg отслеживает вашу Iceberg‑таблицу независимо от того, где именно находятся данные внутри объявленного `external volume` и какого `base_location` вы указали. Однако Snowflake позволяет передавать в поле `base_location` что угодно, включая пустую строку, и даже переиспользовать один и тот же путь для нескольких таблиц. Такое поведение может привести к техническому долгу в будущем, потому что ограничит возможности:

- Навигации по базовому объектному хранилищу (S3/Azure blob)
- Чтения Iceberg‑таблиц через интеграцию с объектным хранилищем
- Выдачи schema‑специфичного доступа к таблицам через объектное хранилище
- Использования crawler, нацеленного на таблицы в external volume, чтобы построить новый каталог другим инструментом

Чтобы поддерживать best practices, dbt требует корректного ввода и по умолчанию записывает таблицы под префиксом `_dbt/{SCHEMA_NAME}/{TABLE_NAME}`, чтобы упростить observability и auditability в объектном хранилище.

### Ограничения

О следующих ограничениях реализации следует знать:

- При использовании Iceberg‑таблиц с dbt ваш запрос материализуется в Iceberg. Однако dbt часто создаёт промежуточные объекты в виде временных (temporary) и transient‑таблиц для некоторых материализаций, например incremental. Нельзя настроить эти временные объекты так, чтобы они были в формате Iceberg. В логах вы можете увидеть создание не‑Iceberg таблиц для поддержки конкретных материализаций, но после использования они будут удалены.
- Нельзя инкрементально обновить уже существующую incremental‑модель так, чтобы она стала Iceberg‑таблицей. Для этого нужно полностью пересобрать таблицу с флагом `--full-refresh`.
- Начиная с Snowflake change bundle `2025-01`, команда `SHOW TABLES` не включает колонку `is_iceberg` в вывод. Из‑за этого dbt v1.9 вынужден выполнять команду, похожую на следующий запрос, для всех моделей в dbt‑проекте (вне зависимости от того, настроены ли они как модели `iceberg`):

    ```sql
    select all_objects.*, is_iceberg
    from table(result_scan(last_query_id(-1))) all_objects
    left join INFORMATION_SCHEMA.tables as all_tables
    on all_tables.table_name = all_objects."name"
    and all_tables.table_schema = all_objects."schema_name"
    and all_tables.table_catalog = all_objects."database_name"
    ``` 
    
    Этот запрос может быть относительно неэффективным и потенциально дорогим — в зависимости от размера вашего Snowflake warehouse. Поэтому возможность выполнять iceberg‑модели доступна только при включённом флаге `enable_iceberg_materializations`.

</VersionBlock>
