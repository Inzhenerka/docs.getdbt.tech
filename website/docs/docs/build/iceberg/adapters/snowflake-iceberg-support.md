---
title: "Snowflake и Apache Iceberg"
id: snowflake-iceberg-support
sidebar_label: "Поддержка Iceberg в Snowflake"
description: Узнайте о поддержке Apache Iceberg в Snowflake.
---

import BaseLocationEnvIsolation from '/snippets/_base-location-env-isolation-warning.md';

dbt поддерживает материализацию моделей в формате таблиц Iceberg двумя способами:

- **Самый простой:** Конфигурация модели `table_format = 'iceberg'` указывает dbt материализовать эту модель как таблицу Iceberg в Snowflake Horizon (управляемом каталоге). Будет ли dbt по умолчанию записывать данные в хранилище, управляемое Snowflake, зависит от используемой версии &mdash; см. раздел [Значения по умолчанию для внешнего тома](#external-volume-defaults).
- **Расширяемый:** Определите каталог Iceberg в `catalogs.yml` и настройте для этой модели `catalog_name`

## Создание таблиц Iceberg

dbt поддерживает создание таблиц Iceberg для трёх материализаций Snowflake: 

- [Таблица](/docs/build/materializations#table)
- [Инкрементальная](/docs/build/materializations#incremental)
- [Динамическая таблица](/reference/resource-configs/snowflake-configs#dynamic-tables) 

## Каталоги Iceberg

Snowflake поддерживает запись таблиц Iceberg в Snowflake Horizon (собственный управляемый каталог), а также во внешние каталоги через [базы данных, связанные с каталогом](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database). К таким внешним каталогам относятся Polaris (с самостоятельным размещением), Open Catalog (Polaris под управлением Snowflake), AWS Glue, GCP BigLake, Databricks Unity и (теоретически) любой другой каталог, совместимый с Iceberg REST.

### Snowflake Horizon (под управлением Snowflake)

#### Самый простой способ: создание одной таблицы Iceberg

<File name='models/MODEL_NAME.sql'>

```sql

{{
  config(
    materialized = "table",
    table_format="iceberg",
  )
}}

select * from {{ ref('raw_orders') }}

```

</File>

Поддерживаются следующие параметры конфигурации.

Дополнительную информацию см. в справочнике Snowflake по [`CREATE ICEBERG TABLE` (Snowflake в качестве каталога)](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake).

| Параметр | Тип   | Обязательный | Описание   | Пример значения | Примечание   |
| ------ | ----- | -------- | ------------- | ------------ | ------ |
| `table_format` | Строка | Да     | Задаёт формат таблиц для объектов.  | `iceberg`  | Единственное допустимое значение — `iceberg`.    |
| `external_volume` | Строка | Нет   | Указывает идентификатор (имя) внешнего тома, в который Snowflake записывает метаданные и файлы данных таблицы Iceberg. Установите значение `SNOWFLAKE_MANAGED` для записи в [хранилище, управляемое Snowflake](https://docs.snowflake.com/en/user-guide/tables-iceberg-internal-storage). | `my_s3_bucket`<br />`SNOWFLAKE_MANAGED` | См. раздел [Значения по умолчанию для внешнего тома](#external-volume-defaults). |
| `base_location_root` | Строка  | Нет  | Если указано, это значение переопределяет значение `base_location`, используемое dbt по умолчанию: `_dbt` | `foo` |  |
| `base_location_subpath` | Строка | Нет       | Необязательный суффикс, добавляемый к пути `base_location`, который dbt задаёт автоматически.     | `jaffle_marketing_folder` | Рекомендуем не указывать этот параметр. Изменение этого параметра приводит к созданию новой таблицы Iceberg. Дополнительную информацию см. в разделе [Базовое расположение](#base-location).                                                                                              |
| `iceberg_version` | Целое число | Нет | Задаёт версию формата Iceberg для таблицы. По умолчанию — `2`. Нельзя изменить после создания таблицы. | `3` | Установите значение `3` для улучшенной поддержки типа `VARIANT` и повышения производительности инкрементальных операций и снимков благодаря векторам удаления. |

#### Значения по умолчанию для внешнего тома {#external-volume-defaults}

Если в модели задано `table_format: iceberg`, но не указан `external_volume`, поведение dbt зависит от используемой версии.

<VersionBlock firstVersion="2.0">

dbt добавляет `external_volume = 'SNOWFLAKE_MANAGED'` в DDL-инструкцию `CREATE ICEBERG TABLE` и не указывает `base_location`, поэтому таблица использует хранилище, управляемое Snowflake.

</VersionBlock>

<VersionBlock lastVersion="1.12">

Начиная с `dbt-snowflake` v1.12, этим поведением управляет [флаг поведения](/reference/global-configs/snowflake-changes#the-snowflake_managed_iceberg_default-flag) `snowflake_managed_iceberg_default`:

- При значении `false` (по умолчанию): dbt не добавляет `external_volume`. Snowflake использует [внешний том по умолчанию](https://docs.snowflake.com/user-guide/tables-iceberg-configure-external-volume#set-a-default-external-volume-at-the-account-database-or-schema-level), заданный на уровне аккаунта, базы данных или схемы, а dbt по-прежнему формирует `base_location`.
- При значении `true`: dbt добавляет `external_volume = 'SNOWFLAKE_MANAGED'` и не указывает `base_location`.

</VersionBlock>

Если установить для `external_volume` значение `SNOWFLAKE_MANAGED`, dbt не указывает `base_location` в любой версии. dbt сначала определяет `external_volume` из конфигурации модели, а затем — из определения каталога в `catalogs.yml`, поэтому установка этого значения в любом из этих мест приводит к исключению `base_location`. Если `external_volume` указывает на пользовательский том, например бакет Amazon S3, dbt добавляет и `external_volume`, и `base_location`.

#### Расширяемый способ: настройка каталога `horizon`

Сначала настройте каталог с `type: horizon` в `catalogs.yml`:

<Tabs defaultValue="new">
<TabItem value="new" label={<><VersionBlock lastVersion="1.99">Новая спецификация (бета)</VersionBlock><VersionBlock firstVersion="2.0">Новая спецификация</VersionBlock></>}>

<File name='catalogs.yml'>

```yaml

catalogs:
  - name: my_horizon_catalog
    type: horizon
    table_format: iceberg
    config:
      snowflake:
        # optional - specify additional Snowflake-specific configurations
        change_tracking: true
        iceberg_version: 3  # available in v1.12+
```

</File>

</TabItem>

<TabItem value="old" label="Старая спецификация">

<File name='catalogs.yml'>

```yml
catalogs:
  - name: my_horizon_catalog
    active_write_integration: snowflake_write_integration
    write_integrations:
      - name: snowflake_write_integration
        external_volume: dbt_external_volume
        table_format: iceberg
        catalog_type: built_in
        adapter_properties:
          change_tracking: True
          iceberg_version: 3  # available in v1.12+
```

</File>

</TabItem>

</Tabs>

Затем укажите имя вашего каталога Horizon в конфигурации модели dbt.

<File name='models/my_iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='my_horizon_catalog',
        iceberg_version=3,  # available in v1.12+
    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

</File>

Наконец, запустите модель: `dbt run -s my_iceberg_model`. Поскольку dbt понимает, что `type: horizon` обозначает управляемый каталог Snowflake, он формирует соответствующие инструкции DDL/DML Snowflake для создания и обновления управляемых таблиц Iceberg.

### Внешние каталоги {#external-catalogs}

dbt также может формировать инструкции DDL/DML Snowflake для создания и обновления таблиц Iceberg, управляемых внешними каталогами.

Сначала необходимо настроить в Snowflake интеграцию с каталогом и (рекомендуется) базу данных, связанную с каталогом. Инструкции по [созданию интеграции с каталогом](https://docs.snowflake.com/en/sql-reference/sql/create-catalog-integration) и [базы данных, связанной с каталогом](https://docs.snowflake.com/en/sql-reference/sql/create-database-catalog-linked), см. в документации Snowflake.

Особенности:
- Для некоторых внешних каталогов (например, AWS Glue) идентификаторы таблиц и столбцов должны содержать только буквенно-цифровые символы (буквы и цифры), быть в нижнем регистре и заключаться в двойные кавычки.

<VersionBlock lastVersion="1.12">

- Начиная с <Constant name="dbt" /> v1.11, dbt-snowflake поддерживает базовую материализацию таблиц Iceberg, зарегистрированных в каталоге Glue через базу данных, связанную с каталогом. Поддержка инкрементальных моделей в настоящее время доступна только в v2.

</VersionBlock>

<VersionBlock firstVersion="2.0">

- <Constant name="dbt" /> поддерживает табличную и инкрементальную материализации (стратегии `append`, `merge` и `delete+insert`) для таблиц Iceberg, зарегистрированных в каталоге Glue через базу данных, связанную с каталогом. Для инкрементальных моделей: 
    - Они должны ссылаться (через `catalog_name`) на каталог с `type: glue` в `catalogs.yml`, в котором `config.snowflake.catalog_database` указывает имя базы данных, связанной с каталогом. 
    - Их идентификаторы должны соответствовать правилам Glue: нижний регистр и двойные кавычки (например, задайте `quoting: {schema: true, identifier: true}` на уровне проекта).

</VersionBlock>

После создания интеграции с внешним каталогом доступны два варианта:

- **Запросы к таблице под внешним управлением:** Snowflake может выполнять запросы к таблицам Iceberg, метаданные которых находятся во внешнем каталоге. В этом сценарии Snowflake выступает «читателем» внешнего каталога. Данные таблицы остаются во внешнем облачном хранилище (AWS S3 или бакете GCP), определённом в конфигурации хранилища каталога. Snowflake использует интеграцию с каталогом для получения метаданных через REST API. Затем Snowflake считывает файлы данных из облачного хранилища.

- **Запись таблиц во внешний каталог с использованием вычислительных ресурсов Snowflake:** Вы можете материализовать модель dbt как таблицу Iceberg с помощью вычислительных ресурсов Snowflake, а Snowflake зарегистрирует эту таблицу во внешнем каталоге (например, AWS Glue или Databricks Unity) и будет синхронизировать её с ним. Модель dbt появится в этом каталоге, и другие движки запросов смогут считывать оттуда её данные.

Теперь можно настроить этот внешний каталог в `catalogs.yml`. Вот пример для каталога AWS Glue:

<Tabs defaultValue="new">
<TabItem value="new" label={<><VersionBlock lastVersion="1.99">Новая спецификация (бета)</VersionBlock><VersionBlock firstVersion="2.0">Новая спецификация</VersionBlock></>}>

<File name='catalogs.yml'>

```yaml

catalogs:
  - name: my_glue_catalog
    type: glue
    table_format: iceberg
    config:
      snowflake:
        catalog_database: catalog_linked_db_glue  # name of catalog-linked database in Snowflake
```

</File>

</TabItem>

<TabItem value="old" label="Старая спецификация">

<File name='catalogs.yml'>

```yml
catalogs:
  - name: my_glue_catalog
    active_write_integration: glue_rest
    write_integrations:
      - name: glue_rest
        catalog_type: iceberg_rest
        table_format: iceberg
        adapter_properties:
          catalog_linked_database: catalog_linked_db_glue  # name of catalog-linked database in Snowflake
          catalog_linked_database_type: glue
```

</File>

</TabItem>

</Tabs>

## Параметры каталогов Iceberg, специфичные для Snowflake

Это дополнительные параметры, специфичные для Snowflake, которые можно указать внутри `config.snowflake` (в новой спецификации каталогов) или `adapter_properties` (в старой спецификации каталогов). Доступные параметры различаются в зависимости от того, записываются ли модели dbt как таблицы Iceberg под управлением Snowflake (каталог Snowflake Horizon) или во внешние каталоги.

#### Под управлением Snowflake (Horizon)

<VersionBlock lastVersion="1.11">

| Поле | Обязательность | Допустимые значения |
| --- | --- | --- |
| `change_tracking` | Необязательно | `True` или `False`    |
| `data_retention_time_in_days` | Необязательно | Аккаунт Standard: `1`, Enterprise или выше: от `0` до `90`, по умолчанию `1`  |
| `max_data_extension_time_in_days` | Необязательно |  От `0` до `90`, по умолчанию `14`  |
| `storage_serialization_policy` | Необязательно | `COMPATIBLE` или `OPTIMIZED`     |
| `base_location_root` | Необязательно | Сегмент относительного пути (например, `'subpath1/subpath2'`) |
| `base_location_subpath` | Необязательно | Сегмент относительного пути (например, `'subpath1/subpath2'`), настраивается только для отдельных моделей |

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Поле | Обязательность | Допустимые значения |
| --- | --- | --- |
| `change_tracking` | Необязательно | `True` или `False`    |
| `data_retention_time_in_days` | Необязательно | Аккаунт Standard: `1`, Enterprise или выше: от `0` до `90`, по умолчанию `1`  |
| `max_data_extension_time_in_days` | Необязательно |  От `0` до `90`, по умолчанию `14`  |
| `storage_serialization_policy` | Необязательно | `COMPATIBLE` или `OPTIMIZED`     |
| `base_location_root` | Необязательно | Сегмент относительного пути (например, `'subpath1/subpath2'`) |
| `base_location_subpath` | Необязательно | Сегмент относительного пути (например, `'subpath1/subpath2'`), настраивается только для отдельных моделей |
| `iceberg_version` (v1.12+) | Необязательно | `2` (по умолчанию) или `3` |

</VersionBlock>

#### Внешние каталоги

<VersionBlock lastVersion="1.11">

| Поле | Обязательность | Допустимые значения |
| --- | --- | --- |
| `auto_refresh` | Необязательно | `True` или `False`    |
| `catalog_linked_database` | Обязательно для `catalog type: iceberg_rest` | Имя базы данных, связанной с каталогом   |
| `catalog_linked_database_type` | Необязательно | Тип базы данных, связанной с каталогом. Например, `glue`  |
| `max_data_extension_time_in_days` | Необязательно |  От `0` до `90` (по умолчанию: `14`)  |
| `target_file_size` | Необязательно | Значения вида `'AUTO'`, `'16MB'`, `'32MB'`, `'64MB'`, `'128MB'`. Регистр не учитывается  |

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Поле | Обязательность | Допустимые значения |
| --- | --- | --- |
| `auto_refresh` | Необязательно | `True` или `False`    |
| `catalog_linked_database` | Обязательно для `catalog type: iceberg_rest` | Имя базы данных, связанной с каталогом   |
| `catalog_linked_database_type` | Необязательно | Тип базы данных, связанной с каталогом. Например, `glue`  |
| `max_data_extension_time_in_days` | Необязательно |  От `0` до `90` (по умолчанию: `14`)  |
| `target_file_size` | Необязательно | Значения вида `'AUTO'`, `'16MB'`, `'32MB'`, `'64MB'`, `'128MB'`. Регистр не учитывается  |
| `iceberg_version` (v1.12+) | Необязательно | `2` (по умолчанию) или `3` |

</VersionBlock>

-  **storage_serialization_policy:** Политика сериализации определяет, какие способы кодирования и сжатия Snowflake применяет к файлам данных таблицы. Если параметр не указан при создании таблицы, она наследует значение, заданное на уровне схемы, базы данных или аккаунта. Если значение не задано ни на одном уровне, таблица использует значение по умолчанию. Значение этого параметра нельзя изменить после создания таблицы.
- **max_data_extension_time_in_days:** Максимальное количество дней, на которое Snowflake может продлить срок хранения данных таблиц, чтобы потоки изменений этих таблиц не устарели. Параметр `MAX_DATA_EXTENSION_TIME_IN_DAYS` позволяет ограничить период автоматического продления для контроля расходов на хранение данных или соблюдения нормативных требований. 
- **data_retention_time_in_days:** Для управляемых таблиц Iceberg можно задать срок хранения данных для Snowflake Time Travel и восстановления удалённой таблицы, переопределив значения аккаунта по умолчанию. Для таблиц, использующих внешний каталог, Snowflake применяет значение параметра DATA_RETENTION_TIME_IN_DAYS, чтобы задать срок хранения данных для Snowflake Time Travel и восстановления удалённой таблицы. По истечении этого срока Snowflake не удаляет метаданные или снимки Iceberg из вашего внешнего облачного хранилища.
- **change_tracking:** Указывает, следует ли включить отслеживание изменений в таблице.
- **catalog_linked_database:** [Базы данных, связанные с каталогом](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database) (CLD), в Snowflake позволяют автоматически синхронизировать метаданные (включая пространства имён и таблицы Iceberg) из внешнего каталога Iceberg и регистрировать соответствующие объекты как удалённые таблицы в базе данных, связанной с каталогом. Мы требуем использовать базы данных, связанные с каталогом, для создания таблиц Iceberg во внешних каталогах, поскольку без них dbt не может полноценно управлять всем жизненным циклом таблицы. В базах данных, не являющихся CLD, Snowflake не поддерживает удаление таблицы Iceberg из внешнего каталога; вместо этого он позволяет лишь отвязать таблицу Snowflake, что противоречит тому, как dbt должен управлять материализованным объектом.
- **auto_refresh:** Указывает, должен ли Snowflake автоматически опрашивать внешний каталог Iceberg на наличие обновлений метаданных. Если в интеграции с каталогом не задан `REFRESH_INTERVAL_SECONDS`, интервал обновления по умолчанию составляет 30 секунд. 
- **target_file_size:** Задаёт целевой размер файла Parquet. По умолчанию — `AUTO`.
<VersionBlock firstVersion="1.12">
- **iceberg_version:** Задаёт версию формата Iceberg для таблицы. Значение по умолчанию — `2`. Установите `3` для улучшенной поддержки типов данных `VARIANT` и ускорения инкрементальных операций. Версия 3 использует [векторы удаления](https://docs.snowflake.com/en/user-guide/tables-iceberg-manage#tables-iceberg-deletion-vectors), которые позволяют Snowflake помечать строки как удалённые без перезаписи лежащих в основе файлов данных, ускоряя инкрементальные запуски. Обратите внимание: версию Iceberg нельзя изменить после создания таблицы. В качестве альтернативы можно [настроить версию Iceberg по умолчанию](https://docs.snowflake.com/en/user-guide/tables-iceberg-v3-specification-support#configure-the-default-iceberg-version) на уровне аккаунта, базы данных или схемы в Snowflake.
</VersionBlock>

- **base_location_root:** Задаёт префикс [`BASE_LOCATION`](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake#optional-parameters) — пути записи для таблицы Iceberg.
- **base_location_subpath:** Задаёт суффикс [`BASE_LOCATION`](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake#optional-parameters) — пути записи для таблицы Iceberg. Это свойство можно задать только в конфигурациях моделей, но не в `catalogs.yml`.

### Базовое расположение {#base-location}

DDL-инструкция Snowflake `CREATE ICEBERG TABLE` требует указания `base_location`, если таблица использует пользовательский внешний том. dbt задаёт этот параметр за вас, чтобы упростить использование и обеспечить базовую изоляцию данных таблиц внутри `EXTERNAL VOLUME`. По умолчанию dbt задаёт строку `base_location` вида `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`.

Snowflake не допускает `BASE_LOCATION` для таблиц Iceberg, использующих хранилище под управлением Snowflake, поэтому dbt не указывает этот параметр, когда `external_volume` имеет значение `SNOWFLAKE_MANAGED`. dbt также может не указывать его, если `external_volume` не задан, в зависимости от используемой версии &mdash; см. раздел [Значения по умолчанию для внешнего тома](#external-volume-defaults).

Рекомендуем использовать поведение по умолчанию, но если вам необходимо изменить результирующий `base_location`, его можно настроить с помощью полей конфигурации модели `base_location_root` и `base_location_subpath`. <VersionBlock firstVersion="2.0"> `base_location_subpath` допускается только в конфигурациях моделей. </VersionBlock>

- Если значения не заданы, dbt формирует для base_location `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- Если base_location_root = `foo`, dbt формирует `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- Если base_location_subpath = `bar`, dbt формирует `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- Если base_location_root = `foo` и base_location_subpath = `bar`, dbt формирует `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

Хотя пути можно настраивать с помощью `base_location_root` и `base_location_subpath`, мы не рекомендуем полагаться на эти параметры для изоляции сред (например, для разделения среды разработки и рабочей среды). Любой пользователь с доступом к репозиторию может легко изменить эти значения конфигурации. Для полноценной изоляции сред используйте отдельные `EXTERNAL VOLUME` с контролем доступа на уровне инфраструктуры.

Пример модели с настроенным `base_location`:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='my_horizon_catalog',
        base_location_root='foo',
        base_location_subpath='bar',

    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

<BaseLocationEnvIsolation />

#### Обоснование

По умолчанию dbt управляет `base_location` за пользователей, чтобы обеспечить соблюдение рекомендуемых практик. При использовании таблиц формата Iceberg под управлением Snowflake пользователь владеет хранилищем данных таблиц и обслуживает его во внешней системе хранения (объявленном `external volume`). Параметр `base_location` определяет, куда записывать данные внутри внешнего тома. Каталог Snowflake Iceberg отслеживает вашу таблицу Iceberg независимо от того, где находятся данные внутри объявленного `external volume` при заданном `base_location`. Однако Snowflake допускает передачу любых значений в поле `base_location`, включая пустую строку, и даже повторное использование одного пути для нескольких таблиц. Такое поведение может привести к техническому долгу в будущем, поскольку ограничивает следующие возможности:

- Навигация по базовому объектному хранилищу (S3/Azure Blob)
- Чтение таблиц Iceberg через интеграцию с объектным хранилищем
- Предоставление доступа к таблицам отдельных схем через объектное хранилище
- Использование сканера, направленного на таблицы во внешнем томе, для создания нового каталога с помощью другого инструмента

Для соблюдения рекомендуемых практик dbt требует наличия значения и по умолчанию записывает таблицы с префиксом `_dbt/{SCHEMA_NAME}/{TABLE_NAME}`, чтобы упростить наблюдение за объектным хранилищем и его аудит.

### Ограничения

-  При использовании таблиц Iceberg с dbt ваш запрос материализуется в Iceberg. Однако для некоторых материализаций, например инкрементальных, dbt часто создаёт промежуточные объекты в виде временных таблиц (temporary) и таблиц типа transient. Настроить для этих временных объектов формат Iceberg нельзя. В журналах могут отображаться таблицы не в формате Iceberg, создаваемые для поддержки отдельных материализаций, но после использования они удаляются.
- Нельзя преобразовать уже существующую инкрементальную модель в таблицу Iceberg с помощью инкрементального обновления. Для этого необходимо полностью пересоздать таблицу с флагом `--full-refresh`.
- Начиная с пакета изменений Snowflake `2025-01`, команда `SHOW TABLES` не включает столбец `is_iceberg` в свои результаты. Это вынудило dbt v1.9 выполнять команду, аналогичную следующему запросу, для всех моделей в проекте dbt (независимо от того, настроены ли они как модели `iceberg`):

    ```sql
    select all_objects.*, is_iceberg
    from table(result_scan(last_query_id(-1))) all_objects
    left join INFORMATION_SCHEMA.tables as all_tables
    on all_tables.table_name = all_objects."name"
    and all_tables.table_schema = all_objects."schema_name"
    and all_tables.table_catalog = all_objects."database_name"
    ``` 
    
    Этот запрос может быть относительно неэффективным и потенциально затратным в зависимости от размера вашего вычислительного склада Snowflake. Поэтому возможность запуска моделей Iceberg включается флагом `enable_iceberg_materializations`.
