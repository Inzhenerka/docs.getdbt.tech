---
title: "Обновление до v1.11"
id: upgrading-to-v1.11
description: Новые возможности и изменения в dbt Core v1.11
displayed_sidebar: "docs"
---

# Обновление до v1.11

## Ресурсы

- [Журнал изменений <Constant name="core" /> v1.11](https://github.com/dbt-labs/dbt-core/blob/1.11.latest/CHANGELOG.md)
- [Руководство по установке CLI <Constant name="core" />](/docs/core/installation-overview)
- [Руководство по обновлению в Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud#release-tracks)

## Что важно знать перед обновлением

dbt Labs стремится обеспечивать обратную совместимость для всех версий 1.x. Любые изменения поведения сопровождаются [флагом изменения поведения](/reference/global-configs/behavior-changes#behavior-change-flags), который предоставляет окно для миграции существующих проектов. Если при обновлении вы столкнулись с ошибкой, пожалуйста, сообщите нам, [создав issue](https://github.com/dbt-labs/dbt-core/issues/new).

Начиная с 2024 года <Constant name="cloud" /> предоставляет функциональность новых версий <Constant name="core" /> через [release tracks](/docs/dbt-versions/cloud-release-tracks) с автоматическими обновлениями. Если в <Constant name="cloud" /> выбран трек «Latest», у вас уже есть доступ ко всем возможностям, исправлениям и другой функциональности, включённой в последнюю версию <Constant name="core" />. Если выбран трек «Compatible», доступ появится в следующем ежемесячном релизе «Compatible» после финального релиза <Constant name="core" /> v1.11.

Мы по‑прежнему рекомендуем явно устанавливать как `dbt-core`, так и `dbt-<youradapter>`. В будущих версиях dbt это может стать обязательным требованием. Например:

```sql
python3 -m pip install dbt-core dbt-snowflake
```

## Новые и изменённые возможности и функциональность

Новые возможности и функциональность, доступные в <Constant name="core" /> v1.11.

### Пользовательские функции (UDF)

dbt Core v1.11 добавляет поддержку пользовательских функций (UDF), которые позволяют определять и регистрировать собственные функции в хранилище данных. Как и макросы, UDF способствуют повторному использованию кода, однако они являются объектами в хранилище, поэтому одну и ту же логику можно использовать и в инструментах вне dbt.

Ключевые возможности:

- **Определение UDF как ресурсов первого класса в dbt**: создание файлов UDF в директории `functions/` с соответствующей YAML‑конфигурацией.
- **Выполнение**: создание, обновление и переименование UDF в рамках выполнения DAG с помощью `dbt build --select "resource_type:function"`.
- **Интеграция с DAG**: при выполнении `dbt build` UDF создаются до моделей, которые на них ссылаются, что обеспечивает корректное управление зависимостями.
- **Новый макрос `function()`**: использование UDF в моделях с помощью Jinja‑макроса `{{ function('function_name') }}`.

Подробнее о UDF, включая предварительные требования и способы их определения и использования, см. в [документации по UDF](/docs/build/udfs).

### Управление изменениями устаревшего поведения

В <Constant name="core" /> v1.11 добавлены новые флаги для [управления изменениями устаревшего поведения](/reference/global-configs/behavior-changes). Вы можете включать недавно добавленные изменения (по умолчанию отключены) или отключать зрелые изменения (по умолчанию включены), задавая значения `True` / `False` для `flags` в `dbt_project.yml`.

Подробнее о каждом из этих изменений поведения можно прочитать по следующим ссылкам:

- (Добавлен, по умолчанию отключён) [`require_unique_project_resource_names`](/reference/global-configs/behavior-changes#unique-project-resource-names). По умолчанию установлен в `False`. При таком значении, если два неверсионированных ресурса в одном пакете имеют одинаковое имя, dbt продолжает выполнение и выводит предупреждение [`DuplicateNameDistinctNodeTypesDeprecation`](/reference/deprecations#duplicatenamedistinctnodetypesdeprecation). При значении `True` dbt выбрасывает ошибку `DuplicateResourceNameError`.

- (Добавлен, по умолчанию отключён) [`require_ref_searches_node_package_before_root`](/reference/global-configs/behavior-changes#package-ref-search-order). По умолчанию установлен в `False`. При таком значении, когда dbt разрешает `ref()` в модели пакета, он сначала ищет целевую модель в корневом проекте, а затем в пакете, где определена модель. При значении `True` dbt сначала ищет в пакете, где определена модель, и только потом — в корневом проекте.

### Предупреждения об устаревании, включённые по умолчанию

Предупреждения об устаревании, возникающие при валидации JSON‑схем, теперь включены по умолчанию при проверке YAML‑конфигурационных файлов (таких как `schema.yml` и `dbt_project.yml`) для проектов, использующих адаптеры Snowflake, Databricks, BigQuery и Redshift.

Эти предупреждения помогают заранее выявлять и обновлять устаревшие конфигурации (например, опечатки в ключах конфигурации, устаревшие свойства или некорректные типы данных).

По умолчанию вы будете видеть следующие предупреждения об устаревании:
* [CustomKeyInConfigDeprecation](/reference/deprecations#customkeyinconfigdeprecation)
* [CustomKeyInObjectDeprecation](/reference/deprecations#customkeyinobjectdeprecation)
* [CustomTopLevelKeyDeprecation](/reference/deprecations#customtoplevelkeydeprecation)
* [MissingPlusPrefixDeprecation](/reference/deprecations#missingplusprefixdeprecation)
* [SourceOverrideDeprecation](/reference/deprecations#sourceoverridedeprecation)

Каждый тип устаревания можно подавить с помощью конфигурации проекта [warn-error-options](/reference/global-configs/warnings#configuration). Например, чтобы подавить все перечисленные выше предупреждения в `dbt_project.yml`:

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

В качестве альтернативы можно использовать флаг командной строки `--warn-error-options`, чтобы подавить конкретные предупреждения:

```sh
dbt parse --warn-error-options '{"silence": ["CustomTopLevelKeyDeprecation", "CustomKeyInConfigDeprecation", "CustomKeyInObjectDeprecation", "MissingPlusPrefixDeprecation", "SourceOverrideDeprecation"]}'
```

Чтобы подавить _все_ предупреждения об устаревании в `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml

flags:
  warn_error_options:
    silence:
      - Deprecations
```
</File>

Аналогично, все предупреждения об устаревании можно подавить через флаг командной строки `--warn-error-options`:

```sh
dbt parse --warn-error-options '{"silence": ["Deprecations"]}'
```

## Функциональность, специфичная для адаптеров

### Snowflake

- Адаптер Snowflake поддерживает базовую материализацию таблиц для Iceberg‑таблиц, зарегистрированных в каталоге Glue, через [catalog-linked database](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database#label-catalog-linked-db-create). Подробнее см. [Glue Data Catalog](/docs/mesh/iceberg/snowflake-iceberg-support#external-catalogs).
- Конфигурация `cluster_by` поддерживается в динамических таблицах. Подробнее см. [Dynamic table clustering](/reference/resource-configs/snowflake-configs#dynamic-table-clustering).

### BigQuery

- Для повышения производительности dbt может выполнять один пакетный запрос при расчёте freshness источников через метаданные, вместо выполнения отдельного запроса для каждого источника. Чтобы включить эту возможность, установите [bigquery_use_batch_source_freshness](/reference/global-configs/bigquery-changes#the-bigquery_use_batch_source_freshness-flag) в `True`.

### Spark

- Добавлены новые конфигурации профиля для улучшения [обработки повторных попыток для соединений PyHive](/reference/resource-configs/spark-configs#retry-handling-for-pyhive-connections):
  - `poll_interval`: управляет тем, как часто адаптер опрашивает Thrift‑сервер, чтобы проверить, завершился ли асинхронный запрос.
  - `query_timeout`: добавляет общий тайм‑аут (в секундах) для выполнения запроса. Если запрос превышает заданную продолжительность во время опроса, выбрасывается `DbtRuntimeError`. Это помогает избежать бесконечно «зависших» запросов.
  - `query_retries`: обрабатывает потерю соединения во время опроса запроса, автоматически выполняя повторные попытки.

## Кратко о важном

В dbt Core v1.11 вы найдёте следующие улучшения:
- Команда `dbt ls` теперь может выводить вложенные ключи, что упрощает отладку и анализ проекта. Пример: `dbt ls --output json --output-keys config.materialized`
- Метаданные манифеста теперь включают `run_started_at`, что позволяет лучше отслеживать момент запуска dbt.
- Если модель отключена, модульные тесты для этой модели также автоматически отключаются.
- Вы можете использовать новые функции [`config.meta_get()`](/reference/dbt-jinja-functions/config#configmeta_get) и [`config.meta_require()`](/reference/dbt-jinja-functions/config#configmeta_require) для доступа к пользовательским конфигурациям, хранящимся в `meta`.
