---
title: "Обновление до v1.11"
id: upgrading-to-v1.11
description: Новые возможности и изменения в dbt v1.11
displayed_sidebar: "docs"
availability:
  engine: v1
  access: free
---

# Обновление до v1.11

## Ресурсы

- [Журнал изменений <Constant name="dbt" /> v1.11](https://github.com/dbt-labs/dbt/blob/1.11.latest/CHANGELOG.md)
- [Руководство по установке CLI <Constant name="core" />](/docs/local/install-dbt)
- [Руководство по обновлению платформы dbt](/docs/dbt-versions/upgrade-dbt-platform-version)

## Что нужно знать перед обновлением

dbt Labs стремится обеспечивать обратную совместимость для всех версий 1.x. Любые изменения поведения будут сопровождаться [флагом изменения поведения](/reference/global-configs/behavior-changes#behavior-change-flags), чтобы предоставить время для миграции существующих проектов. Если после обновления возникнет ошибка, сообщите нам об этом, [создав issue](https://github.com/dbt-labs/dbt/issues/new).

<Constant name="dbt" /> предоставляет функциональность новых версий <Constant name="core" /> через [каналы выпуска](/docs/dbt-versions/dbt-release-tracks) с автоматическим обновлением. Если вы выбрали канал выпуска **v1 Latest** в <Constant name="dbt" />, вам уже доступны все возможности, исправления и другая функциональность последней версии <Constant name="core" />! Если вы выбрали канал выпуска **v1 Compatible**, вы получите доступ к ним в следующем ежемесячном выпуске **v1 Compatible** после выхода финальной версии <Constant name="dbt" /> v1.11.

## Новые и изменённые возможности и функциональность

Новые возможности и функциональность, доступные в <Constant name="dbt" /> v1.11

### Пользовательские функции (UDF)

В <Constant name="dbt" /> v1.11 появилась поддержка пользовательских функций (UDF), позволяющая определять и регистрировать собственные функции в хранилище данных. Как и макросы, UDF способствуют повторному использованию кода, но при этом являются объектами хранилища, поэтому одну и ту же логику можно повторно использовать в инструментах за пределами dbt.

Основные возможности:

- **Определение UDF как полноценных ресурсов dbt**: создавайте файлы UDF в каталоге `functions/` с соответствующей конфигурацией YAML.
- **Выполнение**: создавайте, обновляйте и переименовывайте UDF в рамках выполнения DAG с помощью `dbt build --select "resource_type:function"`
- **Интеграция с DAG**: при выполнении `dbt build` UDF создаются до моделей, которые на них ссылаются, что обеспечивает корректное управление зависимостями.
- **Новый макрос `function()`**: ссылайтесь на UDF в моделях с помощью макроса Jinja `{{ function('function_name') }}`.
- **Отложенное разрешение ссылок**: при запуске команды dbt с `--defer` и `--state` вызовы `function()` разрешаются в UDF из манифеста состояния, поэтому вы можете запускать модели, зависящие от UDF, без предварительного создания этих UDF.

Подробнее об UDF, включая предварительные требования, способы определения и использования, читайте в [документации по UDF](/docs/build/udfs).

### Префикс `DBT_ENGINE_` для переменных окружения

Переменные окружения для настройки движка используют префикс `DBT_ENGINE_`. Например, `DBT_STATE` становится `DBT_ENGINE_STATE`, `DBT_PROJECT_DIR` — `DBT_ENGINE_PROJECT_DIR` и так далее. Полное соответствие приведено в разделе [О флагах (глобальные настройки)](/reference/global-configs/about-global-configs).

### Управление изменениями устаревшего поведения

В <Constant name="dbt" /> v1.11 появились новые флаги для [управления изменениями устаревшего поведения](/reference/global-configs/behavior-changes). Вы можете включить недавно представленные изменения (отключённые по умолчанию) или отключить устоявшиеся изменения (включённые по умолчанию), задав соответственно значения `true` / `false` для `flags` в `dbt_project.yml`.

Подробнее о каждом из этих изменений поведения можно прочитать по следующим ссылкам:

- (Новый, отключён по умолчанию) [`require_unique_project_resource_names`](/reference/global-configs/behavior-flags/require_unique_project_resource_names). По умолчанию этот флаг имеет значение `false`. При таком значении, если два ресурса без версий в одном пакете имеют одинаковое имя, dbt продолжает работу и выдаёт предупреждение [`DuplicateNameDistinctNodeTypesDeprecation`](/reference/deprecations#duplicatenamedistinctnodetypesdeprecation). При значении `true` dbt выдаёт ошибку `DuplicateResourceNameError`.

- (Новый, отключён по умолчанию) [`require_ref_searches_node_package_before_root`](/reference/global-configs/behavior-flags/require_ref_searches_node_package_before_root). По умолчанию этот флаг имеет значение `false`. При таком значении, когда dbt разрешает `ref()` в модели пакета, он _сначала_ ищет целевую модель в корневом проекте, а затем — в пакете, где определена модель. При значении `true` dbt ищет в пакете, где определена модель, _прежде чем_ искать в корневом проекте.

### Предупреждения об устаревших возможностях включены по умолчанию

Предупреждения об устаревших возможностях, выявленных при проверке по JSON-схеме, теперь включены по умолчанию при валидации файлов конфигурации YAML (таких как `schema.yml` и `dbt_project.yml`) в проектах, использующих адаптеры Snowflake, Databricks, BigQuery и Redshift.

Эти предупреждения помогают заблаговременно выявлять и обновлять устаревшие настройки (например, ключи конфигурации с опечатками, устаревшие свойства или некорректные типы данных).

По умолчанию вы увидите следующие предупреждения об устаревших возможностях:
* [CustomKeyInConfigDeprecation](/reference/deprecations#customkeyinconfigdeprecation)
* [CustomKeyInObjectDeprecation](/reference/deprecations#customkeyinobjectdeprecation)
* [CustomTopLevelKeyDeprecation](/reference/deprecations#customtoplevelkeydeprecation)
* [MissingPlusPrefixDeprecation](/reference/deprecations#missingplusprefixdeprecation)
* [SourceOverrideDeprecation](/reference/deprecations#sourceoverridedeprecation)

Предупреждения каждого типа можно подавить с помощью настройки проекта [warn-error-options](/reference/global-configs/warnings#configuration). Например, чтобы подавить все перечисленные выше предупреждения, добавьте в `dbt_project.yml`: 

<File name='dbt_project.yml'>
```yml

flags:
  warn_error_options:
    silence:
      - CustomTopLevelKeyDeprecation
      - CustomKeyInConfigDeprecation
      - CustomKeyInObjectDeprecation
      - MissingPlusPrefixDeprecation
      - SourceOverrideDeprecation
```
</File>

Кроме того, для подавления конкретных предупреждений из командной строки можно использовать флаг `--warn-error-options`:
```sh
dbt parse --warn-error-options '{"silence": ["CustomTopLevelKeyDeprecation", "CustomKeyInConfigDeprecation", "CustomKeyInObjectDeprecation", "MissingPlusPrefixDeprecation", "SourceOverrideDeprecation"]}'
```

Чтобы подавить _все_ предупреждения об устаревших возможностях, добавьте в `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml

flags:
  warn_error_options:
    silence:
      - Deprecations
```
</File>

Аналогично все предупреждения об устаревших возможностях можно подавить с помощью флага командной строки `--warn-error-options`:

```sh
dbt parse --warn-error-options '{"silence": ["Deprecations"]}'
```

## Возможности и функциональность отдельных адаптеров

### Snowflake

- Адаптер Snowflake поддерживает базовую материализацию в виде таблицы для таблиц Iceberg, зарегистрированных в каталоге Glue через [базу данных, связанную с каталогом](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database#label-catalog-linked-db-create). Подробнее см. в разделе [Glue Data Catalog](/docs/build/iceberg/adapters/snowflake-iceberg-support#external-catalogs).
- В динамических таблицах поддерживается настройка `cluster_by`. Подробнее см. в разделе [Кластеризация динамических таблиц](/reference/resource-configs/snowflake-configs#dynamic-table-clustering).
- В динамических таблицах поддерживается настройка `immutable_where`. Подробнее см. в разделе [Настройки Snowflake](/reference/resource-configs/snowflake-configs#immutable-where).
- Вы можете задать [`copy_grants: true`](/reference/resource-configs/snowflake-configs#copy-grants-dynamic-tables) для динамической таблицы, чтобы dbt добавлял `COPY GRANTS` при её повторном создании во время `--full-refresh`. Значение по умолчанию — `false`.
- Задайте параметр [`refresh_warehouse`](/reference/resource-configs/snowflake-configs#refresh-warehouse), чтобы выбрать, какой вычислительный склад Snowflake будет выполнять автоматические обновления динамической таблицы. Этот параметр независим от `snowflake_warehouse`, который используется для выполнения <Term id="ddl" />. Например, для обновлений можно использовать склад меньшего размера, а для DDL — большего. Если `refresh_warehouse` не задан, `snowflake_warehouse` используется и для выполнения DDL, и для автоматических обновлений.

### BigQuery

- Для повышения производительности dbt может выполнять один пакетный запрос при проверке актуальности источников по метаданным вместо отдельного запроса для каждого источника. Чтобы включить эту возможность, задайте для [bigquery_use_batch_source_freshness](/reference/global-configs/bigquery-changes#the-bigquery_use_batch_source_freshness-flag) значение `true`.

### Redshift

- Новый параметр подключения профиля `datasharing` позволяет `dbt-redshift` использовать собственные команды Redshift для работы с метаданными (команды `SHOW`, такие как `SHOW TABLES` и `SHOW COLUMNS`) вместо таблиц системного каталога PostgreSQL, таких как `pg_*` и `information_schema`. Это обеспечивает доступ между базами данных и кластерами с помощью [Redshift Datasharing](https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html). Подробности настройки см. в разделе [Настройка Redshift](/docs/local/connect-data-platform/redshift-setup?version=1.12#datasharing).
- Параметр подключения профиля `drop_without_cascade` обеспечивает формирование инструкций `DROP TABLE/VIEW/MATERIALIZED VIEW` без `CASCADE`. Redshift обрабатывает граф зависимостей `CASCADE` при каждом `DROP`, что создаёт дополнительные накладные расходы в больших кластерах. Если у объектов вашего проекта нет зависимых объектов (например, используются только представления без привязки к схеме), можно задать `drop_without_cascade: true`, чтобы избежать этих затрат. Если этот параметр включён и зависимый объект существует, Redshift выдаёт ошибку. Подробности настройки см. в разделе [Настройка Redshift](/docs/local/connect-data-platform/redshift-setup).

### Spark

- Добавлены новые настройки профиля для улучшения [обработки повторных попыток для подключений PyHive](/reference/resource-configs/spark-configs#retry-handling-for-pyhive-connections):
  - `poll_interval`: определяет, как часто адаптер опрашивает сервер Thrift, чтобы проверить, завершился ли асинхронный запрос.
  - `query_timeout`: задаёт общий тайм-аут (в секундах) выполнения запроса. Если во время опроса выясняется, что запрос превысил заданную длительность, возникает ошибка `DbtRuntimeError`. Это помогает предотвратить бесконечное зависание запросов.
  - `query_retries`: обрабатывает потерю соединения во время опроса состояния запроса, автоматически выполняя повторные попытки.

### Starburst/Trino

- Адаптер Starburst/Trino поддерживает скалярные SQL-[UDF](/docs/build/udfs). Подробности настройки и ограничения см. в разделе [Настройки Starburst/Trino](/reference/resource-configs/trino-configs#user-defined-functions).

## Другие изменения в кратком обзоре

В <Constant name="dbt" /> v1.11 также доступны следующие изменения:
- Флаг [`--sqlparse`](/reference/global-configs/sqlparse) задаёт параметры `MAX_GROUPING_DEPTH` и `MAX_GROUPING_TOKENS` библиотеки [`sqlparse`](https://sqlparse.readthedocs.io/en/latest/api.html#security-and-performance-considerations), когда dbt разбирает SQL во время компиляции.
- Команда `dbt ls` теперь может выводить вложенные ключи. Это упрощает отладку проекта и устранение неполадок. Пример: `dbt ls --output json --output-keys config.materialized`
- Метаданные манифеста теперь включают `run_started_at`, что позволяет точнее отслеживать время начала запусков dbt.
- При отключении модели её модульные тесты также автоматически отключаются.
- Вы можете использовать новые функции [`config.meta_get()`](/reference/dbt-jinja-functions/config#configmeta_get) и [`config.meta_require()`](/reference/dbt-jinja-functions/config#configmeta_require) для доступа к пользовательским настройкам, хранящимся в `meta`. Эти функции также перенесены в <Constant name="dbt" /> v1.10.
