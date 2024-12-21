---
title: "О флагах (глобальные конфигурации)"
id: "about-global-configs"
sidebar: "О флагах (глобальные конфигурации)"
pagination_next: null
---

В dbt "флаги" (также называемые "глобальными конфигурациями") — это настройки для тонкой настройки _как_ dbt выполняет ваш проект. Они отличаются от [конфигураций, специфичных для ресурсов](/reference/configs-and-properties), которые сообщают dbt _что_ выполнять.

Флаги управляют такими вещами, как визуальный вывод логов, следует ли рассматривать определенные предупреждения как ошибки, или следует ли "быстро завершать" выполнение после первой ошибки. Флаги являются "глобальными" конфигурациями, потому что они доступны для всех команд dbt и могут быть установлены в нескольких местах.

Существует значительное пересечение между флагами dbt и опциями командной строки dbt, но есть различия:
- Некоторые флаги могут быть установлены только в [`dbt_project.yml`](/reference/dbt_project.yml) и не могут быть переопределены для конкретных вызовов через опции CLI.
- Если опция CLI поддерживается конкретными командами, а не всеми командами ("глобально"), она обычно не считается "флагом".

### Установка флагов

Существует несколько способов установки флагов, которые зависят от случая использования:
- **[Флаги на уровне проекта в `dbt_project.yml`](/reference/global-configs/project-flags):** Определите контролируемые версией значения по умолчанию для всех, кто запускает этот проект. Также выберите или откажитесь от [изменений поведения](/reference/global-configs/behavior-changes) для управления миграцией от устаревших функций.
- **[Переменные окружения](/reference/global-configs/environment-variable-configs):** Определите различное поведение в разных средах выполнения (разработка против производства против [непрерывной интеграции](/docs/deploy/continuous-integration), или различное поведение для разных пользователей в разработке (на основе личных предпочтений).
- **[Опции командной строки](/reference/global-configs/command-line-options):** Определите поведение, специфичное для _этого вызова_. Поддерживается для всех команд dbt.

Наиболее специфичная настройка "побеждает". Если вы установите один и тот же флаг во всех трех местах, опция CLI будет иметь приоритет, затем переменная окружения, и, наконец, значение в `dbt_project.yml`. Если вы не установите флаг ни в одном из этих мест, будет использовано значение по умолчанию, определенное в dbt.

Большинство флагов можно установить во всех трех местах:
```yaml
# dbt_project.yml
flags:
  # установить значение по умолчанию для выполнения этого проекта -- везде, всегда, кем угодно
  fail_fast: true
```
```bash
# установить эту переменную окружения в 'True' (синтаксис bash)
export DBT_FAIL_FAST=1
dbt run
```
```bash
dbt run --fail-fast # установить в True для этого конкретного вызова
dbt run --no-fail-fast # установить в False
```

Существуют две категории исключений:
1. **Флаги, устанавливающие пути к файлам:** Флаги для путей к файлам, которые имеют отношение к выполнению во время выполнения (например, `--log-path` или `--state`), не могут быть установлены в `dbt_project.yml`. Чтобы переопределить значения по умолчанию, передайте опции CLI или установите переменные окружения (`DBT_LOG_PATH`, `DBT_STATE`). Флаги, которые сообщают dbt, где найти ресурсы проекта (например, `model-paths`), устанавливаются в `dbt_project.yml`, но как ключ верхнего уровня, вне словаря `flags`; эти конфигурации должны быть полностью статичными и никогда не изменяться в зависимости от команды или среды выполнения.
2. **Флаги выбора:** Флаги выбора или отказа от [изменений поведения](/reference/global-configs/behavior-changes) могут быть определены _только_ в `dbt_project.yml`. Они предназначены для установки в системе контроля версий и миграции через pull/merge запросы. Их значения не должны бесконечно расходиться между вызовами, средами или пользователями.

### Доступ к флагам

Пользовательская логика, написанная на Jinja, может проверять значения флагов, используя [контекстную переменную `flags`](/reference/dbt-jinja-functions/flags).

```yaml
# dbt_project.yml

on-run-start:
  - '{{ log("Я остановлюсь при первом признаке проблемы", info = true) if flags.FAIL_FAST }}'
```

Поскольку значения `flags` могут различаться между вызовами, мы настоятельно не рекомендуем использовать `flags` в качестве входных данных для конфигураций или зависимостей (`ref` + `source`), которые dbt разрешает [во время парсинга](/reference/parsing#known-limitations).

## Доступные флаги

| Название флага | Тип | Значение по умолчанию | Поддерживается в проекте? | Переменная окружения | Опция командной строки | Поддерживается в Cloud CLI? |
|-----------|------|---------|-----------------------|----------------------|---------------------|-------------------------|
| [cache_selected_only](/reference/global-configs/cache) | boolean | False | ✅ | `DBT_CACHE_SELECTED_ONLY` | `--cache-selected-only`, `--no-cache-selected-only` | ✅ |
| [debug](/reference/global-configs/logs#debug-level-logging) | boolean | False | ✅ | `DBT_DEBUG` | `--debug`, `--no-debug` | ✅ |
| [defer](/reference/node-selection/defer) | boolean | False | ❌ | `DBT_DEFER` | `--defer`, `--no-defer` | ✅ (включено по умолчанию) |
| [defer_state](/reference/node-selection/defer) | path | None | ❌ | `DBT_DEFER_STATE` | `--defer-state` | ❌ |
| [fail_fast](/reference/global-configs/failing-fast) | boolean | False | ✅ | `DBT_FAIL_FAST` | `--fail-fast`, `-x`, `--no-fail-fast` | ✅ |
| [full_refresh](/reference/resource-configs/full_refresh) | boolean | False | ✅ (как конфигурация ресурса) | `DBT_FULL_REFRESH` | `--full-refresh`, `--no-full-refresh` | ✅ |
| [indirect_selection](/reference/node-selection/test-selection-examples#syntax-examples) | enum | eager | ✅ | `DBT_INDIRECT_SELECTION` | `--indirect-selection` | ❌ |
| [introspect](/reference/commands/compile#introspective-queries) | boolean | True | ❌ | `DBT_INTROSPECT` | `--introspect`, `--no-introspect` | ❌ |
| [log_cache_events](/reference/global-configs/logs#logging-relational-cache-events) | boolean | False | ❌ | `DBT_LOG_CACHE_EVENTS` | `--log-cache-events`, `--no-log-cache-events` | ❌ |
| [log_format_file](/reference/global-configs/logs#log-formatting) | enum | default (text) | ✅ | `DBT_LOG_FORMAT_FILE` | `--log-format-file` | ❌ |
| [log_format](/reference/global-configs/logs#log-formatting) | enum | default (text) | ✅ | `DBT_LOG_FORMAT` | `--log-format` | ❌ |
| [log_level_file](/reference/global-configs/logs#log-level) | enum | debug | ✅ | `DBT_LOG_LEVEL_FILE` | `--log-level-file` | ❌ |
| [log_level](/reference/global-configs/logs#log-level) | enum | info | ✅ | `DBT_LOG_LEVEL` | `--log-level` | ❌ |
| [log_path](/reference/global-configs/logs) | path | None (использует `logs/`) | ❌ | `DBT_LOG_PATH` | `--log-path` | ❌ |
| [partial_parse](/reference/global-configs/parsing#partial-parsing) | boolean | True | ✅ | `DBT_PARTIAL_PARSE` | `--partial-parse`, `--no-partial-parse` | ✅ |
| [populate_cache](/reference/global-configs/cache) | boolean | True | ✅ | `DBT_POPULATE_CACHE` | `--populate-cache`, `--no-populate-cache` | ✅ |
| [print](/reference/global-configs/print-output#suppress-print-messages-in-stdout) | boolean | True | ❌ | `DBT_PRINT` | `--print` | ❌ |
| [printer_width](/reference/global-configs/print-output#printer-width) | int | 80 | ✅ | `DBT_PRINTER_WIDTH` | `--printer-width` | ❌ |
| [profile](/docs/core/connect-data-platform/connection-profiles#about-profiles) | string | None | ✅ (как ключ верхнего уровня) | `DBT_PROFILE`  | `--profile` | ❌ |
| [profiles_dir](/docs/core/connect-data-platform/connection-profiles#about-profiles) | path | None (текущая директория, затем домашняя директория) | ❌ | `DBT_PROFILES_DIR` | `--profiles-dir` | ❌ |
| [project_dir](/reference/dbt_project.yml) | path |  | ❌ | `DBT_PROJECT_DIR` | `--project-dir` | ❌ |
| [quiet](/reference/global-configs/logs#suppress-non-error-logs-in-output) | boolean | False | ❌ | `DBT_QUIET` | `--quiet` | ✅ |
| [resource-type](/reference/global-configs/resource-type) (v1.8+) | string | None | ❌ | `DBT_RESOURCE_TYPES` <br></br> `DBT_EXCLUDE_RESOURCE_TYPES` | `--resource-type` <br></br> `--exclude-resource-type` | ✅ |
| [send_anonymous_usage_stats](/reference/global-configs/usage-stats) | boolean | True | ✅ | `DBT_SEND_ANONYMOUS_USAGE_STATS` | `--send-anonymous-usage-stats`, `--no-send-anonymous-usage-stats` | ❌ |
| [source_freshness_run_project_hooks](/reference/global-configs/behavior-changes#source_freshness_run_project_hooks) | boolean | False | ✅ | ❌ | ❌ | ❌ |
| [state](/reference/node-selection/defer) | path | none | ❌ | `DBT_STATE`, `DBT_DEFER_STATE` | `--state`, `--defer-state` | ❌ |
| [static_parser](/reference/global-configs/parsing#static-parser) | boolean | True | ✅ | `DBT_STATIC_PARSER` | `--static-parser`, `--no-static-parser` | ❌ |
| [store_failures](/reference/resource-configs/store_failures) | boolean | False | ✅ (как конфигурация ресурса) | `DBT_STORE_FAILURES` | `--store-failures`, `--no-store-failures` | ✅ |
| [target_path](/reference/global-configs/json-artifacts) | path | None (использует `target/`) | ❌ | `DBT_TARGET_PATH` | `--target-path` | ❌ |
| [target](/docs/core/connect-data-platform/connection-profiles#about-profiles) | string | None | ❌ | `DBT_TARGET` | `--target` | ❌ |
| [use_colors_file](/reference/global-configs/logs#color) | boolean | True | ✅ | `DBT_USE_COLORS_FILE` | `--use-colors-file`, `--no-use-colors-file` | ❌ |
| [use_colors](/reference/global-configs/print-output#print-color) | boolean | True | ✅ | `DBT_USE_COLORS` | `--use-colors`, `--no-use-colors` | ❌ |
| [use_experimental_parser](/reference/global-configs/parsing#experimental-parser) | boolean | False | ✅ | `DBT_USE_EXPERIMENTAL_PARSER` | `--use-experimental-parser`, `--no-use-experimental-parser` | ❌ |
| [version_check](/reference/global-configs/version-compatibility) | boolean | varies | ✅ | `DBT_VERSION_CHECK` | `--version-check`, `--no-version-check` | ❌ |
| [warn_error_options](/reference/global-configs/warnings) | dict | {} | ✅ | `DBT_WARN_ERROR_OPTIONS` | `--warn-error-options` | ✅ |
| [warn_error](/reference/global-configs/warnings) | boolean | False | ✅ | `DBT_WARN_ERROR` | `--warn-error` | ✅ |
| [write_json](/reference/global-configs/json-artifacts) | boolean | True | ✅ | `DBT_WRITE_JSON` | `--write-json`, `--no-write-json` | ✅ |