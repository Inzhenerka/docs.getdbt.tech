---
title: "Таблицы dbt Information Schema"
sidebar_label: "Таблицы Information Schema"
description: "Справочник по всем таблицам, доступным в dbt Information Schema, с группировкой по пространствам имён."
id: "info-schema"
availability:
  engine: v2
  access: free
---

[dbt Information Schema](/docs/build/dbt-information-schema) — это интерфейс с определённым контрактом для доступа к метаданным всех ресурсов вашего проекта dbt. Таблицы Information Schema создаются командами [`dbt build`](/reference/commands/build), [`dbt run`](/reference/commands/run), [`dbt compile`](/reference/commands/compile) или [`dbt parse`](/reference/commands/parse) с флагом `--generate-info-schema`.

## Таблицы

dbt Information Schema v1 создаёт таблицы в следующих пространствах имён:

- [`dbt`](#dbt-namespace): содержит метаданные о структуре, ресурсах и конфигурации проекта. Отвечает на вопрос: *Что представляет собой ваш проект?*
- [`dbt_rt`](#dbt_rt-namespace): содержит данные о выполнении. Отвечает на вопрос: *Что произошло при запуске вашего проекта?*

### Пространство имён `dbt` {#dbt-namespace}

Таблицы пространства имён `dbt` содержат метаданные о структуре, ресурсах и конфигурации проекта.

| Таблица | Описание |
|-------|-------------|
| `dbt.dag_nodes` | Все участники DAG с `unique_id` и `resource_type` |
| `dbt.project` | Метаданные уровня проекта |
| `dbt.packages` | Установленные пакеты, по одной строке на пакет |
| `dbt.project_vars` | Переменные проекта, по одной строке на пару (область действия проекта, имя переменной) |
| `dbt.project_env_vars` | Переменные окружения, используемые в проекте |
| `dbt.models` | Все модели |
| `dbt.seeds` | Все seed-файлы |
| `dbt.sources` | Все источники |
| `dbt.snapshots` | Все снимки |
| `dbt.functions` | Все пользовательские функции |
| `dbt.analyses` | Все анализы |
| `dbt.hooks` | Все операции хуков `on-run-start` и `on-run-end` |
| `dbt.checks` | Все проверки |
| `dbt.data_tests` | Все тесты данных (универсальные и единичные) |
| `dbt.unit_tests` | Все модульные тесты |
| `dbt.macros` | Все макросы |
| `dbt.groups` | Все группы |
| `dbt.exposures` | Все экспозиции |
| `dbt.metrics` | Все метрики |
| `dbt.docs_blocks` | Все блоки документации |
| `dbt.saved_queries` | Все сохранённые запросы |
| `dbt.semantic_models` | Все семантические модели |
| `dbt.semantic_entities` | Сущности семантических моделей |
| `dbt.semantic_measures` | Меры семантических моделей |
| `dbt.semantic_dimensions` | Измерения семантических моделей |
| `dbt.semantic_relationships` | Связи между семантическими моделями |
| `dbt.time_spines` | Определения временных осей |
| `dbt.classifiers` | Классификаторы ресурсов |
| `dbt.edges` | Рёбра DAG (родительский узел → дочерний узел) |
| `dbt.node_columns` | Имена, типы и описания столбцов узлов; для источников включаются только столбцы, объявленные в YAML (используйте [`--write-catalog`](/docs/build/dbt-information-schema#generating-the-information-schema), чтобы включить все столбцы источников, используемых выбранными узлами) |
| `dbt.column_lineage` | Происхождение данных на уровне столбцов (заполняется при использовании `--static-analysis strict`) |

### Пространство имён `dbt_rt` {#dbt_rt-namespace}

Таблицы пространства имён `dbt_rt` содержат данные о выполнении. Эти таблицы недоступны для проверок на этапе разбора.

| Таблица | Описание |
|-------|-------------|
| `dbt_rt.invocations` | По одной строке на вызов dbt |
| `dbt_rt.run_results` | Результаты для каждого узла в каждом вызове |
| `dbt_rt.run_results_latest` | Представление с последним результатом выполнения для каждого узла |
| `dbt_rt.relations` | Данные каталога хранилища для каждого материализованного объекта (заполняется при использовании `--write-catalog`) |
| `dbt_rt.freshness` | Результаты проверок свежести данных для источников и моделей; `resource_type` указывает, относится ли строка к `source` или `model` |
| `dbt_rt.diagnostics` | Диагностические данные вызовов |
| `dbt_rt.adapter_queries` | Запросы адаптера, отправленные во время вызовов |


## Столбцы, доступные для проверок {#columns-available-for-checks}

При использовании макроса `{{ info_schema() }}` в проверке доступны только столбцы, определяемые на этапе разбора. dbt предоставляет доступ к этим столбцам через представление с тем же именем, что и таблица Information Schema. Передайте это имя в макрос без префикса `dbt.`.

Полная таблица в `target/info_schema/v1/` может содержать больше столбцов. Доступ ко всем столбцам можно получить, используя макрос с `dbt show --inline`.


| Представление | Столбцы |
|------|---------|
| `models` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `ingested_at` |
| `seeds` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `ingested_at` |
| `snapshots` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `raw_code`, `ingested_at` |
| `functions` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `raw_code`, `ingested_at` |
| `analyses` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `raw_code`, `ingested_at` |
| `hooks` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `raw_code`, `ingested_at` |
| `checks` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `raw_code`, `ingested_at` |
| `sources` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `source_name`, `source_description`, `loader`, `loaded_at_field`, `ingested_at` |
| `data_tests` | `unique_id`, `name`, `package_name`, `original_file_path`, `fqn`, `description`, `database_name`, `schema_name`, `relation_name`, `enabled`, `materialized`, `config`, `tags`, `meta`, `group`, `properties_yml_file_path`, `test_name`, `test_definition_package`, `arguments`, `column_name`, `node_unique_id`, `severity`, `warn_if`, `error_if`, `fail_calc`, `store_failures`, `store_failures_as`, `ingested_at` |
| `unit_tests` | `unique_id`, `name`, `model`, `description`, `package_name`, `original_file_path`, `fqn`, `given`, `expect`, `overrides`, `versions`, `ingested_at` |
| `node_columns` | `node_unique_id`, `column_name`, `data_type_declared`, `description`, `tags`, `ingested_at` |
| `dag_nodes` | `unique_id`, `resource_type`, `ingested_at` — по одной строке на каждый включённый ресурс, участвующий в DAG, включая экспозиции, метрики и модульные тесты |
| `edges` | `parent_unique_id`, `child_unique_id`, `ingested_at` |
| `macros` | `unique_id`, `name`, `package_name`, `original_file_path`, `macro_sql`, `description`, `depends_on_macros`, `arguments`, `docs_show`, `properties_yml_file_path`, `meta`, `created_at`, `ingested_at` |
| `docs_blocks` | `unique_id`, `name`, `package_name`, `original_file_path`, `content`, `ingested_at` |
| `groups` | `unique_id`, `name`, `description`, `owner_name`, `owner_email`, `ingested_at` |
| `exposures` | `unique_id`, `name`, `exposure_type`, `label`, `owner_name`, `owner_email`, `url`, `maturity`, `description`, `package_name`, `original_file_path`, `fqn`, `depends_on`, `tags`, `created_at`, `ingested_at` |
| `metrics` | `unique_id`, `name`, `label`, `metric_type`, `description`, `package_name`, `original_file_path`, `fqn`, `type_params`, `metric_filter`, `time_granularity`, `input_metric_names`, `group`, `tags`, `meta`, `config`, `created_at`, `ingested_at` |
| `saved_queries` | `unique_id`, `name`, `label`, `description`, `package_name`, `original_file_path`, `fqn`, `query_params`, `exports`, `depends_on`, `group`, `tags`, `created_at`, `ingested_at` |
| `semantic_models` | `unique_id`, `name`, `model`, `label`, `description`, `fqn`, `node_relation`, `primary_entity`, `defaults`, `group`, `created_at`, `ingested_at` |
| `semantic_entities` | `unique_id`, `name`, `entity_type`, `description`, `label`, `entity_role`, `expr`, `ingested_at` |
| `semantic_measures` | `unique_id`, `name`, `agg`, `description`, `label`, `expr`, `create_metric`, `agg_time_dimension`, `agg_params`, `non_additive_dimension`, `ingested_at` |
| `semantic_dimensions` | `unique_id`, `name`, `dimension_type`, `description`, `label`, `expr`, `is_partition`, `time_granularity`, `validity_params`, `ingested_at` |
| `time_spines` | `unique_id`, `primary_column`, `primary_granularity`, `custom_granularities`, `node_relation`, `ingested_at` |
| `project` | `project_name`, `dbt_version`, `adapter_type`, `git_sha`, `git_branch`, `git_uncommitted_changes`, `ingested_at` |
| `packages` | `package_name`, `ingested_at` |
| `project_vars` | `project_name`, `var_name`, `var_value`, `ingested_at` — переменная с областью действия пакета отображается с `project_name` этого пакета |
| `project_env_vars` | `env_var_name`, `ingested_at` |

## Связанная документация

- [dbt Information Schema](/docs/build/dbt-information-schema)
- [Проверки](/docs/build/checks)
