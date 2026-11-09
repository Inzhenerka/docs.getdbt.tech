---
title: "О флагах (глобальные конфигурации)"
id: "about-global-configs"
sidebar: "О флагах (глобальные конфигурации)"
pagination_next: null
description: "Configure dbt flags using dbt_project.yml, environment variables, and CLI options."
---

В dbt «флаги» (также называемые «глобальными настройками» и часто задаваемые с помощью [переменных окружения](/reference/global-configs/environment-variable-configs)) — это настройки для точного управления тем, _как_ dbt выполняет ваш проект. Они отличаются от [настроек отдельных ресурсов](/reference/configs-and-properties), которые указывают dbt, _что_ выполнять.

Флаги управляют такими вещами, как визуальный вывод логов, следует ли рассматривать определенные предупреждения как ошибки, или следует ли "быстро завершать" выполнение после первой ошибки. Флаги являются "глобальными" конфигурациями, потому что они доступны для всех команд dbt и могут быть установлены в нескольких местах.

Вы можете использовать флаги с движком <Constant name="fusion_engine"/> или <Constant name="core"/> через CLI при локальной разработке или в <Constant name="dbt_platform"/>.

Флаги dbt и параметры командной строки dbt во многом пересекаются, но между ними есть различия:
- Некоторые флаги можно задать только в [`dbt_project.yml`](/reference/dbt_project.yml), и их нельзя переопределить для отдельных запусков с помощью параметров CLI.
- Если параметр CLI поддерживается только определёнными командами, а не всеми командами (то есть не является «глобальным»), он обычно не считается «флагом».

Вы можете настраивать флаги в `dbt_project.yml`, с помощью переменных окружения и параметров CLI. Подробности см. в разделе [Настройка с помощью переменных окружения](/reference/global-configs/environment-variable-configs).

### Настройка флагов

import SettingFlags from '/snippets/_setting-flags.md';

<SettingFlags />

### Доступ к флагам {#accessing-flags}

Пользовательская логика, написанная на Jinja, может проверять значения флагов, используя [контекстную переменную `flags`](/reference/dbt-jinja-functions/flags).

```yaml
# dbt_project.yml

on-run-start:
  - '{{ log("Я остановлюсь при первом признаке проблемы", info = true) if flags.FAIL_FAST }}'
```

## Доступные флаги {#available-flags}

Поскольку значения `flags` могут различаться от запуска к запуску, мы настоятельно рекомендуем не использовать `flags` в качестве входных данных для конфигураций или зависимостей (`ref` + `source`), которые dbt разрешает [во время разбора](/reference/parsing#known-limitations).

Используйте эту таблицу для сравнения всех доступных флагов и способов их настройки через различные интерфейсы:

- **CLI <Constant name="dbt" />**: Указывает, поддерживается ли флаг в [CLI, поддерживаемом <Constant name="dbt_platform" />](/docs/platform/dbt-cli-installation).
- **Тип / значение по умолчанию**: Показывает допустимый тип значения и значение по умолчанию.
- **В проекте**: Указывает, можно ли задать флаг в `dbt_project.yml`.
- **Переменная окружения**: Показывает имя соответствующей переменной окружения, если она доступна. Как правило, в версии v1.10 и более ранних используется префикс `DBT_`, а в v1.11 и более поздних — префикс `DBT_ENGINE_`.
- **Флаги CLI**: Перечисляет параметры командной строки для задания флага на конкретный запуск.

<VersionBlock lastVersion="1.10">

| Flag | <Constant name="dbt" /> CLI? | Type / default | In project? | Env var | <div style={{width:'200px'}}>CLI flags</div> |
|------|----------------|----------------|-------------|---------|-----------|
| [cache_selected_only](/reference/global-configs/cache) | ✅ | boolean <br /> default: False | ✅ | `DBT_CACHE_SELECTED_ONLY` | `--cache-selected-only` <br /> `--no-cache-selected-only` |
| [clean_project_files_only](/reference/commands/clean#clean-project-files-only) | ❌ | boolean <br /> default: True | ❌ | `DBT_CLEAN_PROJECT_FILES_ONLY` | `--clean-project-files-only` <br /> `--no-clean-project-files-only` |
| [debug](/reference/global-configs/logs#debug-level-logging) | ✅ | boolean <br /> default: False | ✅ | `DBT_DEBUG` | `--debug` <br /> `--no-debug` |
| [defer](/reference/node-selection/defer) | ✅ (default) | boolean <br /> default: False | ❌ | `DBT_DEFER` | `--defer` <br /> `--no-defer` |
| [defer_state](/reference/node-selection/defer) | ❌ | path <br /> default: None | ❌ | `DBT_DEFER_STATE` | `--defer-state` |
| [favor_state](/reference/node-selection/defer#favor-state) | ✅ | boolean <br /> default: False | ❌ | `DBT_FAVOR_STATE` | `--favor-state` <br /> `--no-favor-state` |
| [empty](/docs/build/empty-flag) | ✅ | boolean <br /> default: False | ❌ | `DBT_EMPTY` | `--empty` <br /> `--no-empty` |
| [event_time_start](/reference/dbt-jinja-functions/model#batch-properties-for-microbatch-models) | ✅ | datetime <br /> default: None | ❌ | `DBT_EVENT_TIME_START` | `--event-time-start` |
| [event_time_end](/reference/dbt-jinja-functions/model#batch-properties-for-microbatch-models) | ✅ | datetime <br /> default: None | ❌ | `DBT_EVENT_TIME_END` | `--event-time-end` |
| [fail_fast](/reference/global-configs/failing-fast) | ✅ | boolean <br /> default: False | ✅ | `DBT_FAIL_FAST` | `--fail-fast` <br /> `-x` <br /> `--no-fail-fast` |
| [full_refresh](/reference/resource-configs/full_refresh) | ✅ | boolean <br /> default: False | ✅ (as resource config) | `DBT_FULL_REFRESH` | `--full-refresh` <br /> `--no-full-refresh` |
| [indirect_selection](/reference/node-selection/test-selection-examples#test-selection-syntax-examples) | ❌ | enum <br /> default: eager | ✅ | `DBT_INDIRECT_SELECTION` | `--indirect-selection` |
| [introspect](/reference/commands/compile#introspective-queries) | ❌ | boolean <br /> default: True | ❌ | `DBT_INTROSPECT` | `--introspect` <br /> `--no-introspect` |
| [log_cache_events](/reference/global-configs/logs#logging-relational-cache-events) | ❌ | boolean <br /> default: False | ❌ | `DBT_LOG_CACHE_EVENTS` | `--log-cache-events` <br /> `--no-log-cache-events` |
| [log_format_file](/reference/global-configs/logs#log-formatting) | ❌ | enum <br /> default: default (text) | ✅ | `DBT_LOG_FORMAT_FILE` | `--log-format-file` |
| [log_format](/reference/global-configs/logs#log-formatting) | ❌ | enum <br /> default: default (text) | ✅ | `DBT_LOG_FORMAT` | `--log-format` |
| [log_level_file](/reference/global-configs/logs#log-level) | ❌ | enum <br /> default: debug | ✅ | `DBT_LOG_LEVEL_FILE` | `--log-level-file` |
| [log_level](/reference/global-configs/logs#log-level) | ❌ | enum <br /> default: info | ✅ | `DBT_LOG_LEVEL` | `--log-level` |
| [log_path](/reference/global-configs/logs) | ❌ | path <br /> default: None (uses `logs/`) | ❌ | `DBT_LOG_PATH` | `--log-path` |
| [partial_parse](/reference/global-configs/parsing#partial-parsing) | ✅ | boolean <br /> default: True | ✅ | `DBT_PARTIAL_PARSE` | `--partial-parse` <br /> `--no-partial-parse` |
| [populate_cache](/reference/global-configs/cache) | ✅ | boolean <br /> default: True | ✅ | `DBT_POPULATE_CACHE` | `--populate-cache` <br /> `--no-populate-cache` |
| [print](/reference/global-configs/print-output#suppress-print-messages-in-stdout) | ❌ | boolean <br /> default: True | ❌ | `DBT_PRINT` | `--print` <br /> `--no-print` |
| [printer_width](/reference/global-configs/print-output#printer-width) | ❌ | int <br /> default: 80 | ✅ | `DBT_PRINTER_WIDTH` | `--printer-width` |
| [profile](/docs/local/profiles.yml#about-profiles) | ❌ | string <br /> default: None | ✅ (as top-level key) | `DBT_PROFILE`  | [`--profile`](/docs/local/profiles.yml#%D0%BF%D0%B5%D1%80%D0%B5%D0%BE%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D0%B5%D0%B9-%D0%B8-%D1%86%D0%B5%D0%BB%D0%B5%D0%B2%D1%8B%D1%85-%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9) |
| [profiles_dir](/docs/local/profiles.yml#about-profiles) | ❌ | path <br /> default: None (current dir, then HOME dir) | ❌ | `DBT_PROFILES_DIR` | `--profiles-dir` |
| [project_dir](/reference/dbt_project.yml) | ❌ | path <br /> default: (empty) | ❌ | `DBT_PROJECT_DIR` | `--project-dir` |
| [quiet](/reference/global-configs/logs#dbt-list-logging) | ✅ | boolean <br /> default: False | ❌ | `DBT_QUIET` | `--quiet` |
| [resource-type](/reference/global-configs/resource-type) (v1.8+) | ✅ | string <br /> default: None | ❌ | `DBT_RESOURCE_TYPES` <br></br> `DBT_EXCLUDE_RESOURCE_TYPES` | `--resource-type` <br></br> `--exclude-resource-type` |
| [sample](/docs/build/sample-flag) | ✅ | string <br /> default: None | ❌ | `DBT_SAMPLE` | `--sample` |
| [send_anonymous_usage_stats](/reference/global-configs/usage-stats) | ❌ | boolean <br /> default: True | ✅ | `DBT_SEND_ANONYMOUS_USAGE_STATS` | `--send-anonymous-usage-stats` <br /> `--no-send-anonymous-usage-stats` |
| [source_freshness_run_project_hooks](/reference/global-configs/behavior-flags/source_freshness_run_project_hooks) | ❌ | boolean <br /> default: True | ✅ | ❌ | ❌ |
| [state](/reference/node-selection/defer) | ❌ | path <br /> default: none | ❌ | `DBT_STATE`, `DBT_DEFER_STATE` | `--state` <br /> `--defer-state` |
| [static_parser](/reference/global-configs/parsing#static-parser) | ❌ | boolean <br /> default: True | ✅ | `DBT_STATIC_PARSER` | `--static-parser` <br /> `--no-static-parser` |
| [store_failures](/reference/resource-configs/store_failures) | ✅ | boolean <br /> default: False | ✅ (as resource config) | `DBT_STORE_FAILURES` | `--store-failures` <br /> `--no-store-failures` |
| [target_path](/reference/global-configs/json-artifacts) | ❌ | path <br /> default: None (uses `target/`) | ❌ | `DBT_TARGET_PATH` | `--target-path` |
| [target](/docs/local/profiles.yml#about-profiles) | ❌ | string <br /> default: None | ❌ | `DBT_TARGET` | [`--target`](/docs/local/profiles.yml#%D0%BF%D0%B5%D1%80%D0%B5%D0%BE%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D0%B5%D0%B9-%D0%B8-%D1%86%D0%B5%D0%BB%D0%B5%D0%B2%D1%8B%D1%85-%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9) |
| [use_colors_file](/reference/global-configs/logs#color) | ❌ | boolean <br /> default: True | ✅ | `DBT_USE_COLORS_FILE` | `--use-colors-file` <br /> `--no-use-colors-file` |
| [use_colors](/reference/global-configs/print-output#print-color) | ❌ | boolean <br /> default: True | ✅ | `DBT_USE_COLORS` | `--use-colors` <br /> `--no-use-colors` |
| [use_experimental_parser](/reference/global-configs/parsing#opt-in-v2-parser) | ❌ | boolean <br /> default: False | ✅ | `DBT_USE_EXPERIMENTAL_PARSER` | `--use-experimental-parser` <br /> `--no-use-experimental-parser` |
| [use_fast_test_edges](/reference/global-configs/fast-test-edges) | ✅ | boolean <br /> default: False | ❌ | `DBT_USE_FAST_TEST_EDGES` | `--use-fast-test-edges` <br /> `--no-use-fast-test-edges` |
| [version_check](/reference/global-configs/version-compatibility) | ❌ | boolean <br /> default: varies | ✅ | `DBT_VERSION_CHECK` | `--version-check` <br /> `--no-version-check` |
| [warn_error_options](/reference/global-configs/warnings) | ✅ | dict <br /> default: {} | ✅ | `DBT_WARN_ERROR_OPTIONS` | `--warn-error-options` |
| [warn_error](/reference/global-configs/warnings) | ✅ | boolean <br /> default: False | ✅ | `DBT_WARN_ERROR` | `--warn-error` |
| [write_json](/reference/global-configs/json-artifacts) | ✅ | boolean <br /> default: True | ✅ | `DBT_WRITE_JSON` | `--write-json` <br /> `--no-write-json` |


</VersionBlock>

<VersionBlock firstVersion="1.11">

| Flag | <Constant name="dbt" /> CLI? | Type / default | In project? | Env var | <div style={{width:'200px'}}>CLI flags</div> |
|------|----------------|----------------|-------------|---------|-----------|
| [ai_provider](/docs/dbt-ai/package-skills#set-the-ai_provider-flag) (v2.0+) | ❌ | list <br /> default: None | ✅ | `DBT_ENGINE_AI_PROVIDER` | `--ai-provider` |
| [batch_tests](/reference/global-configs/batch-tests) (v2.0+) | ❌ | boolean <br /> default: False | ✅ | `DBT_ENGINE_BATCH_TESTS` | `--batch-tests` |
| [cache_selected_only](/reference/global-configs/cache) | ✅ | boolean <br /> default: False | ✅ | `DBT_ENGINE_CACHE_SELECTED_ONLY` | `--cache-selected-only` <br /> `--no-cache-selected-only` |
| [clean_project_files_only](/reference/commands/clean#clean-project-files-only) | ❌ | boolean <br /> default: True | ❌ | `DBT_ENGINE_CLEAN_PROJECT_FILES_ONLY` | `--clean-project-files-only` <br /> `--no-clean-project-files-only` |
| [debug](/reference/global-configs/logs#debug-level-logging) | ✅ | boolean <br /> default: False | ✅ | `DBT_ENGINE_DEBUG` | `--debug` <br /> `--no-debug` |
| [defer](/reference/node-selection/defer) | ✅ (default) | boolean <br /> default: False | ❌ | `DBT_ENGINE_DEFER` | `--defer` <br /> `--no-defer` |
| [defer_state](/reference/node-selection/defer) | ❌ | path <br /> default: None | ❌ | `DBT_ENGINE_DEFER_STATE` | `--defer-state` |
| [favor_state](/reference/node-selection/defer#favor-state) | ✅ | boolean <br /> default: False | ❌ | `DBT_ENGINE_FAVOR_STATE` | `--favor-state` <br /> `--no-favor-state` |
| [empty](/docs/build/empty-flag) | ✅ | boolean <br /> default: False | ❌ | `DBT_ENGINE_EMPTY` | `--empty` <br /> `--no-empty` |
| [event_time_start](/reference/dbt-jinja-functions/model#batch-properties-for-microbatch-models) | ✅ | datetime <br /> default: None | ❌ | `DBT_ENGINE_EVENT_TIME_START` | `--event-time-start` |
| [event_time_end](/reference/dbt-jinja-functions/model#batch-properties-for-microbatch-models) | ✅ | datetime <br /> default: None | ❌ | `DBT_ENGINE_EVENT_TIME_END` | `--event-time-end` |
| [fail_fast](/reference/global-configs/failing-fast) | ✅ | boolean <br /> default: False | ✅ | `DBT_ENGINE_FAIL_FAST` | `--fail-fast` <br /> `-x` <br /> `--no-fail-fast` |
| [full_refresh](/reference/resource-configs/full_refresh) | ✅ | boolean <br /> default: False | ✅ (as resource config) | `DBT_ENGINE_FULL_REFRESH` | `--full-refresh` <br /> `--no-full-refresh` |
| [generate_info_schema](/docs/build/dbt-information-schema) (v2.0+) | ✅ | boolean <br /> default: False | ❌ | `DBT_ENGINE_GENERATE_INFO_SCHEMA` | `--generate-info-schema` |
| hints_enabled (v1.12+) | ✅ | boolean <br /> default: True | ✅ | `DBT_ENGINE_HINTS_ENABLED` | `--hints-enabled` <br /> `--no-hints-enabled` |
| [indirect_selection](/reference/node-selection/test-selection-examples#test-selection-syntax-examples) | ❌ | enum <br /> default: eager | ✅ | `DBT_ENGINE_INDIRECT_SELECTION` | `--indirect-selection` |
| [info_schema_dir](/docs/build/dbt-information-schema) (v2.0+) | ✅ | path <br /> default: None (uses `<target>/info_schema/`) | ❌ | `DBT_ENGINE_INFO_SCHEMA_DIR` | `--info-schema-dir` |
| [introspect](/reference/commands/compile#introspective-queries) | ❌ | boolean <br /> default: True | ❌ | `DBT_ENGINE_INTROSPECT` | `--introspect` <br /> `--no-introspect` |
| [log_cache_events](/reference/global-configs/logs#logging-relational-cache-events) | ❌ | boolean <br /> default: False | ❌ | `DBT_ENGINE_LOG_CACHE_EVENTS` | `--log-cache-events` <br /> `--no-log-cache-events` |
| [log_format_file](/reference/global-configs/logs#log-formatting) | ❌ | enum <br /> default: default (text) | ✅ | `DBT_ENGINE_LOG_FORMAT_FILE` | `--log-format-file` |
| [log_format](/reference/global-configs/logs#log-formatting) | ❌ | enum <br /> default: default (text) | ✅ | `DBT_ENGINE_LOG_FORMAT` | `--log-format` |
| [log_level_file](/reference/global-configs/logs#log-level) | ❌ | enum <br /> default: debug | ✅ | `DBT_ENGINE_LOG_LEVEL_FILE` | `--log-level-file` |
| [log_level](/reference/global-configs/logs#log-level) | ❌ | enum <br /> default: info | ✅ | `DBT_ENGINE_LOG_LEVEL` | `--log-level` |
| [log_path](/reference/global-configs/logs) | ❌ | path <br /> default: None (uses `logs/`) | ❌ | `DBT_ENGINE_LOG_PATH` | `--log-path` |
| [manage_state](/docs/deploy/dbt-state-setup) (v1.13+) | ✅ | boolean <br /> default: False | ✅ | `DBT_ENGINE_MANAGE_STATE` | `--manage-state` <br /> `--no-manage-state` |
| [partial_parse](/reference/global-configs/parsing#partial-parsing) | ✅ | boolean <br /> default: True | ✅ | `DBT_ENGINE_PARTIAL_PARSE` | `--partial-parse` <br /> `--no-partial-parse` |
| [populate_cache](/reference/global-configs/cache) | ✅ | boolean <br /> default: True | ✅ | `DBT_ENGINE_POPULATE_CACHE` | `--populate-cache` <br /> `--no-populate-cache` |
| [print](/reference/global-configs/print-output#suppress-print-messages-in-stdout) | ❌ | boolean <br /> default: True | ❌ | `DBT_ENGINE_PRINT` | `--print` <br /> `--no-print` |
| [printer_width](/reference/global-configs/print-output#printer-width) | ❌ | int <br /> default: 80 | ✅ | `DBT_ENGINE_PRINTER_WIDTH` | `--printer-width` |
| [profile](/docs/local/connection-profiles#about-profiles) | ❌ | string <br /> default: None | ✅ (as top-level key) | `DBT_ENGINE_PROFILE`  | [`--profile`](/docs/local/connection-profiles#overriding-profiles-and-targets) |
| [profiles_dir](/docs/local/connection-profiles#about-profiles) | ❌ | path <br /> default: None (current dir, then HOME dir) | ❌ | `DBT_ENGINE_PROFILES_DIR` | `--profiles-dir` |
| [project_dir](/reference/dbt_project.yml) | ❌ | path <br /> default: (empty) | ❌ | `DBT_ENGINE_PROJECT_DIR` | `--project-dir` |
| [quiet](/reference/global-configs/logs#dbt-list-logging) | ✅ | boolean <br /> default: False | ❌ | `DBT_ENGINE_QUIET` | `--quiet` |
| [resource-type](/reference/global-configs/resource-type) (v1.8+) | ✅ | string <br /> default: None | ❌ | `DBT_ENGINE_RESOURCE_TYPES` <br></br> `DBT_ENGINE_EXCLUDE_RESOURCE_TYPES` | `--resource-type` <br></br> `--exclude-resource-type` |
| [sample](/docs/build/sample-flag) | ✅ | string <br /> default: None | ❌ | `DBT_ENGINE_SAMPLE` | `--sample` |
| [send_anonymous_usage_stats](/reference/global-configs/usage-stats) | ❌ | boolean <br /> default: True | ✅ | `DBT_ENGINE_SEND_ANONYMOUS_USAGE_STATS` | `--send-anonymous-usage-stats` <br /> `--no-send-anonymous-usage-stats` |
| [source_freshness_run_project_hooks](/reference/global-configs/behavior-flags/source_freshness_run_project_hooks) | ❌ | boolean <br /> default: True | ✅ | ❌ | ❌ |
| [sqlparse](/reference/global-configs/sqlparse) | ❌ | YAML map <br /> default: MAX_GROUPING_DEPTH and MAX_GROUPING_TOKENS set to null | ❌ | `DBT_ENGINE_SQLPARSE` | `--sqlparse` |
| [state](/reference/node-selection/defer) | ❌ | path <br /> default: none | ❌ | `DBT_ENGINE_STATE`, `DBT_ENGINE_DEFER_STATE` | `--state` <br /> `--defer-state` |
| [static_parser](/reference/global-configs/parsing#static-parser) | ❌ | boolean <br /> default: True | ✅ | `DBT_ENGINE_STATIC_PARSER` | `--static-parser` <br /> `--no-static-parser` |
| [store_failures](/reference/resource-configs/store_failures) | ✅ | boolean <br /> default: False | ✅ (as resource config) | `DBT_ENGINE_STORE_FAILURES` | `--store-failures` <br /> `--no-store-failures` |
| [target_path](/reference/global-configs/json-artifacts) | ❌ | path <br /> default: None (uses `target/`) | ❌ | `DBT_ENGINE_TARGET_PATH` | `--target-path` |
| [target](/docs/local/connection-profiles#about-profiles) | ❌ | string <br /> default: None | ❌ | `DBT_ENGINE_TARGET` | [`--target`](/docs/local/connection-profiles#overriding-profiles-and-targets) |
| [use_colors_file](/reference/global-configs/logs#color) | ❌ | boolean <br /> default: True | ✅ | `DBT_ENGINE_USE_COLORS_FILE` | `--use-colors-file` <br /> `--no-use-colors-file` |
| [use_colors](/reference/global-configs/print-output#print-color) | ❌ | boolean <br /> default: True | ✅ | `DBT_ENGINE_USE_COLORS` | `--use-colors` <br /> `--no-use-colors` |
| [use_experimental_parser](/reference/global-configs/parsing#opt-in-v2-parser) | ❌ | boolean <br /> default: False | ✅ | `DBT_ENGINE_USE_EXPERIMENTAL_PARSER` | `--use-experimental-parser` <br /> `--no-use-experimental-parser` |
| [use_fast_test_edges](/reference/global-configs/fast-test-edges) | ✅ | boolean <br /> default: False | ❌ | `DBT_ENGINE_USE_FAST_TEST_EDGES` | `--use-fast-test-edges` <br /> `--no-use-fast-test-edges` |
| [use_v2_parser](/reference/global-configs/parsing#opt-in-v2-parser) | ✅ | boolean <br /> default: False | ✅ | `DBT_ENGINE_USE_V2_PARSER` | `--use-v2-parser` |
| [version_check](/reference/global-configs/version-compatibility) | ❌ | boolean <br /> default: varies | ✅ | `DBT_ENGINE_VERSION_CHECK` | `--version-check` <br /> `--no-version-check` |
| [warn_error_options](/reference/global-configs/warnings) | ✅ | dict <br /> default: {} | ✅ | `DBT_ENGINE_WARN_ERROR_OPTIONS` | `--warn-error-options` |
| [warn_error](/reference/global-configs/warnings) | ✅ | boolean <br /> default: False | ✅ | `DBT_ENGINE_WARN_ERROR` | `--warn-error` |
| [write_json](/reference/global-configs/json-artifacts) | ✅ | boolean <br /> default: True | ✅ | `DBT_ENGINE_WRITE_JSON` | `--write-json` <br /> `--no-write-json` |

</VersionBlock>

### Common flag examples

Use the `--target` flag to specify which target (environment) to use when running dbt commands. For example:

```bash
dbt run --target dev
dbt run --target prod
dbt build --target staging
```

The `--target` flag allows you to run the same dbt project against different environments without modifying your configuration files. Define the target in your `profiles.yml` file. Learn more about [connection profiles and targets](/docs/local/profiles.yml#%D1%86%D0%B5%D0%BB%D0%B5%D0%B2%D1%8B%D0%B5-%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F-%D0%B2-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F%D1%85).
