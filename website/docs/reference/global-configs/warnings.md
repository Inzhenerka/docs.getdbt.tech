---
title: "Предупреждения"
id: "warnings"
sidebar: "Предупреждения"
toc_max_heading_level: 2
intro_text: "Используйте флаг --warn-error, чтобы повышать все предупреждения до ошибок, или --warn-error-options для более детального управления через параметры."
---

## Используйте `--warn-error`, чтобы повысить все предупреждения до ошибок {#use-warn-error-to-promote-all-warnings-to-errors}

Включение конфигурации `WARN_ERROR` или установка флага `--warn-error` приведёт к тому, что _все_ предупреждения dbt будут преобразованы в ошибки. Каждый раз, когда dbt обычно выдаёт предупреждение, вместо этого будет выброшена ошибка. Примеры таких ситуаций включают: критерии `--select`, которые не выбирают ни одного ресурса, устаревшие (deprecated) элементы, конфигурации без связанных моделей, некорректные конфигурации тестов, а также тесты и проверки свежести данных, которые настроены на возврат предупреждений.

<File name='Usage'>

  ```text
  dbt run --warn-error
  ```

</File>

:::caution Осторожно при использовании в продакшене
Использование флага `--warn-error` или `--warn-error-options '{"error": "all"}'` приведёт к тому, что _все_ текущие и будущие предупреждения будут трактоваться как ошибки.

:::caution Соблюдайте осторожность в производственных средах
Использование флага `--warn-error` или `--warn-error-options '{"error": "all"}'` приведёт к тому, что _все_ текущие и будущие предупреждения будут обрабатываться как ошибки.

Это означает, что если в будущей версии dbt появится новое предупреждение, ваше задание в производственной среде может неожиданно начать завершаться с ошибкой. Рекомендуем с осторожностью использовать этот подход в производственных средах и явно перечислять только те предупреждения, которые вы хотите обрабатывать как ошибки в этих средах.
:::


## Используйте `--warn-error-options` для целевых предупреждений {#use-warn-error-options-for-targeted-warnings}

В некоторых случаях вы можете захотеть преобразовать _все_ предупреждения в ошибки. Однако, когда вы хотите, чтобы _некоторые_ предупреждения оставались предупреждениями и повышать или подавлять только конкретные предупреждения, вы можете вместо этого использовать `--warn-error-options`. Конфигурация `WARN_ERROR_OPTIONS` или флаг `--warn-error-options` дают вам более детальный контроль над тем, _какие именно типы предупреждений_ считаются ошибками.

:::info `WARN_ERROR` и `WARN_ERROR_OPTIONS` являются взаимоисключающими
`WARN_ERROR` и `WARN_ERROR_OPTIONS` являются взаимоисключающими. Вы можете указать только один из них, даже если вы задаёте конфигурацию в нескольких местах (например, через переменную окружения или флаг), иначе вы увидите ошибку использования.
:::

Предупреждения, которые следует считать ошибками, можно указать с помощью параметра `error`. Названия предупреждений можно найти следующими способами:
  - В [файле types.py в `dbt-labs/dbt`](https://github.com/dbt-labs/dbt/blob/1.latest/core/dbt/events/types.py), где имя каждого класса, наследующего от `WarnLevel`, соответствует названию предупреждения (например, `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).
  - С помощью флага `--log-format json`.

<VersionBlock firstVersion="1.12">

Начиная с версии 1.12, <Constant name="core" /> игнорирует [названия, специфичные для dbt v2](https://github.com/dbt-labs/dbt/blob/1.12.latest/core/dbt/events/fusion_warn_error_options.py), в `warn_error_options` (например, `StaticAnalysis` и `PackageParsingCompatibility`), вместо того чтобы выдавать ошибку, и выводит примечание: `<name> is not being used because it's specific to the dbt Fusion engine.` Это позволяет использовать общие конфигурации `warn_error_options` для <Constant name="core" /> и <Constant name="fusion" />. При этом настоящие опечатки по-прежнему вызывают ошибку.

</VersionBlock>

<VersionBlock firstVersion="2.0">

В <Constant name="fusion_engine" /> у каждого предупреждения есть как числовой код (например, `1092`), так и имя события (например, `NoNodesForSelectionCriteria`). 

Сообщения во время выполнения содержат и то и другое, но `warn_error_options` принимает только _имя_. Используйте имя события, имя, используемое в v2, или поддерживаемую группу (`all`, `*`). Числовые коды не принимаются и вызывают ошибку. 

Чтобы найти имя по коду из журналов, обратитесь к разделу [Поддерживаемые псевдонимы устаревших имен событий dbt-Core](#supported-legacy-dbt-core-event-name-aliases).

</VersionBlock>

Параметру `error` можно присвоить значение `"all"` или `"*"`, чтобы считать все предупреждения ошибками (это поведение аналогично использованию флага `--warn-error`), либо список конкретных названий предупреждений, которые следует считать исключениями.
- When `error` is set to `"all"` or `"*"`, the optional `warn` parameter can be set to exclude specific warnings from being treated as exceptions.
- Используйте параметр `silence`, чтобы игнорировать предупреждения. Чтобы подавить определённые предупреждения, которые вы хотите игнорировать, вы можете указать их в параметре `silence`. Это полезно в крупных проектах, где некоторые предупреждения не являются критичными и могут быть проигнорированы, чтобы снизить уровень шума и сохранить логи чистыми.

Вот как вы можете использовать флаг [`--warn-error-options`](#use-warn-error-options-for-targeted-warnings), чтобы повышать _конкретные_ предупреждения до ошибок:
- [Предупреждения тестов](/reference/resource-configs/severity) с флагом `--warn-error-options '{"error": ["LogTestResult"]}'`.
- Jinja [предупреждения об исключениях](/reference/dbt-jinja-functions/exceptions#warn) с `--warn-error-options '{"error": ["JinjaLogWarning"]}'`.
- Отсутствие выбранных узлов с `--warn-error-options '{"error": ["NoNodesForSelectionCriteria"]}'`.
- Предупреждения об устаревании с `--warn-error-options '{"error": ["Deprecations"]}'` (новое в v1.10).

### Конфигурация {#configuration}

Вы можете настраивать предупреждения как ошибки или определять, какие предупреждения следует подавлять, с помощью warn error options через флаг командной строки, переменную окружения или `dbt_project.yml`.

You can choose to:

- Повышайте все предупреждения до ошибок, используя `{"error": "all"}` или флаг `--warn-error`.
- Повышайте конкретные предупреждения до ошибок, используя `error`, и при необходимости исключайте другие из обработки как ошибки с помощью флага `--warn-error-options`. `warn` указывает dbt продолжать обрабатывать предупреждения как предупреждения.
- Игнорируйте предупреждения, используя `silence` с флагом `--warn-error-options`.

В следующем примере мы отключаем [предупреждение `NoNodesForSelectionCriteria`](https://github.com/dbt-labs/dbt/blob/main/core/dbt/events/types.py#L1227) в файле `dbt_project.yml`, добавляя его в параметр `silence`:

  <File name='dbt_project.yml'>

  ```yaml
...
  flags:
    warn_error_options:
      error: # ранее называлось "include"
      warn: # ранее называлось "exclude"
      silence: # чтобы заглушать или игнорировать предупреждения
        - NoNodesForSelectionCriteria
  ```

  </File>

### Примеры {#examples}
Вот несколько примеров, которые показывают, как настроить `warn_error_options` с помощью флагов или файловой конфигурации.

#### Целевые предупреждения {#target-specific-warnings}
В некоторых примерах используется `NoNodesForSelectionCriteria` — это конкретное предупреждение, которое возникает, когда ваш флаг `--select` не соответствует ни одному узлу/ресурсу в вашем проекте dbt:


- Эта команда повышает все предупреждения до ошибок, за исключением `NoNodesForSelectionCriteria`:
  ```text
  dbt run --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}'
  ```

- Эта команда повышает все предупреждения до ошибок, за исключением предупреждений об устаревании:
  ```text
  dbt run --warn-error-options '{"error": "all", "warn": ["Deprecations"]}'
  ```

- Эта команда повышает только `NoNodesForSelectionCriteria` до уровня ошибки:
  ```text
  dbt run --warn-error-options '{"error": ["NoNodesForSelectionCriteria"]}'
  ```

- Это переводит в категорию ошибок только `NoNodesForSelectionCriteria` с помощью переменной окружения:

  <VersionBlock lastVersion="1.10">
  ```text
  DBT_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}' dbt run
  ```

  </VersionBlock>

  <VersionBlock firstVersion="1.11">

  ```text
  DBT_ENGINE_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}' dbt run
  ```

  </VersionBlock>

Значения для `error`, `warn` и/или `silence` следует передавать в виде массивов. Например, `dbt run --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}'`, а не `dbt run --warn-error-options '{"error": "all", "warn": "NoNodesForSelectionCriteria"}'`.

Следующий пример показывает, как повысить все предупреждения до ошибок, за исключением предупреждения `NoNodesForSelectionCriteria`, используя параметры `silence` и `warn` в файле `dbt_project.yml`:
  <File name='dbt_project.yml'>

  ```yaml
  ...
  flags:
    warn_error_options:
      error: all # ранее называлось "include"
      warn:      # ранее называлось "exclude"
        - NoNodesForSelectionCriteria
      silence:   # чтобы заглушать или игнорировать предупреждения
        - NoNodesForSelectionCriteria
  ```

  </File>

#### Повышение всех предупреждений до ошибок {#promote-all-warnings-to-errors}
Несколько примеров того, как повысить все предупреждения до ошибок:

##### используя флаги команд dbt {#using-dbt-command-flags}

```bash 
dbt run --warn-error
dbt run --warn-error-options '{"error": "all"}'
dbt run --warn-error-options '{"error": "*"}'
```

##### используя переменные окружения {#using-environment-variables}

<VersionBlock lastVersion="1.10">

```bash 
WARN_ERROR=true dbt run 
DBT_WARN_ERROR_OPTIONS='{"error": "all"}' dbt run 
DBT_WARN_ERROR_OPTIONS='{"error": "*"}' dbt run 
```

</VersionBlock>

<VersionBlock firstVersion="1.11">

```bash 
WARN_ERROR=true dbt run 
DBT_ENGINE_WARN_ERROR_OPTIONS='{"error": "all"}' dbt run 
DBT_ENGINE_WARN_ERROR_OPTIONS='{"error": "*"}' dbt run 
```

</VersionBlock>
:::caution
Обратите внимание: использование `warn_error_options: error: "all"` приведёт к тому, что все текущие и будущие предупреждения будут обрабатываться как ошибки.

Это означает, что если в будущей версии dbt появится новое предупреждение, ваше задание в производственной среде может неожиданно начать завершаться с ошибкой. Мы рекомендуем с осторожностью применять такой подход в производственных средах и явно перечислять только те предупреждения, которые вы хотите считать ошибками в этих средах.
:::

<VersionBlock firstVersion="2.0">

## dbt v2 behavior and warning codes

<Constant name="fusion_engine" /> fully supports `warn_error_options`. This section describes important differences from <Constant name="core" /> behavior.

Existing dbt-core event names fall into three categories:

- **Supported** Mapped to similar <Constant name="fusion" /> warning and behave approximately the same.
- **Won't be supported:** Those that we deliberately decided to not ever support.
- **Not supported yet:** Parsed, but do nothing yet.

### Warning codes in <Constant name="fusion" />

In <Constant name="fusion" />, every warning has both a numeric code (for example, `1092`) and an event name (for example, `NoNodesForSelectionCriteria`). Warning messages at runtime show both, but `warn_error_options` only accepts the _name_,  never the code:

```yaml
flags:
  warn_error_options:
    error:
      - NothingToDo   # by name
    silence:
      - FreshnessConfigProblem   # by name
```

Any value that isn't a supported legacy event name, v2-native name, or supported group (`all`, `*`) causes <Constant name="fusion" /> to exit with an error at startup, including numeric codes. For example, `{error: [1092]}` fails, but `{error: [NoNodesForSelectionCriteria]}` works.

Not every valid name appears in the tables on this page. <Constant name="fusion" /> also emits its own warnings (for example, `SemanticModelDeprecated`, code `dbt1157`) that aren't listed here. Use the name shown in the runtime message.

### Supported legacy dbt-core event name aliases

When you see a warning code in your logs, use the following table to find the matching event name to put in `warn_error_options`. The code column is only for looking up warnings you see at runtime &mdash; you can't use the code itself in your config:

| dbt v2 code (runtime only) | dbt-core event name (use this in config) | Description |
|---|---|---|
| 1601 | `NoNodesSelected` | No nodes selected |
| 1601 | `NothingToDo` | No nodes selected (alias) |
| 1087 | `NodeNotFoundOrDisabled` | A test or exposure dependency references a missing or disabled node |
| 1085 | `DeprecatedModel` | A model has passed its deprecation date and should be removed |
| 1072 | `DeprecatedReference` | A reference to a model that has already been deprecated |
| 1073 | `UpcomingReferenceDeprecation` | A reference to a model that will be deprecated on a future date |
| 1074 | `JinjaLogWarning` | Jinja `exceptions.warn()` called in a macro |
| 1075 | `SnapshotTimestampWarning` | Snapshot timestamp column type mismatch |
| 1076 | `PackageRedirectDeprecation` | A package has been redirected to a new name; update your `packages.yml` |
| 1077 | `DepsUnpinned` | A git-sourced package uses an unpinned revision (`HEAD`, `main`, or `master`) |
| 1078 | `FreshnessConfigProblem` | A source has no freshness configuration; freshness check was skipped |
| 1084 | `WarnStateTargetEqual` | The `--state` and `--target` directories are the same path |
| 1086 | `WEOIncludeExcludeDeprecation` | Deprecated `include`/`exclude` keys were used in `warn_error_options`; use `error`/`warn` instead |
| 1089 | `NoNodeForYamlKey` | A YAML key references a node that doesn't exist in the project |
| 1090 | `MacroNotFoundForPatch` | A `patches:` entry in a YAML file references a macro that doesn't exist |
| 1091 | `InvalidConcurrentBatchesConfig` | `concurrent_batches` is configured but not supported for this model |
| 1092 | `NoNodesForSelectionCriteria` | `--select` criteria matched no nodes |
| 1093 | `MicrobatchModelNoEventTimeInputs` | A microbatch model has no upstream inputs with `event_time` configured |
| 1094 | `UnversionedBreakingChange` | A breaking change was made to an unversioned model |
| 1095 | `UnsupportedConstraintMaterialization` | A constraint was defined on a materialization that doesn't support it |
| 1097 | `UnusedResourceConfigPath` | A `+config` path in `dbt_project.yml` doesn't match any resources |
| 1098 | `DepsScrubbedPackageName` | A package name contained characters that were scrubbed during install |
| 1099 | `DepsFoundDuplicatePackage` | The same package was found more than once in `packages.yml` |
| 1506 | `InvalidMacroAnnotation` | A macro's YAML annotation (argument name or type) doesn't match its Jinja definition |
| _no code_ | `LogTestResult` | A data test result (pass/warn/fail) |
| _no code_ | `RunResultWarning` | A model or test run completed with `warn` status |
| _no code_ | `RunResultWarningMessage` | The message accompanying a `warn`-status run result |

### Unsupported <Constant name="core" /> event names

Only the legacy names in [Supported legacy dbt-Core event name aliases](#supported-legacy-dbt-core-event-name-aliases) are valid string aliases in <Constant name="fusion" />. There are many other <Constant name="core" /> warning event names; if you put one of those in `warn_error_options`, <Constant name="fusion" /> will throw a warning at startup.

The table below is not a complete list of unsupported names. It only includes <Constant name="core" /> event names that <Constant name="fusion" /> recognizes by name so it can emit a startup warning explaining why the entry has no effect and prompting you to remove it: the underlying <Constant name="core" /> behavior was removed, replaced, or made unconditional in <Constant name="fusion" />. Many other unsupported <Constant name="core" /> names are not listed here; they still warn during startup validation when used in `warn_error_options`.

| dbt-core event name | Message |
|---|---|
| `MicrobatchMacroOutsideOfBatchesDeprecation` | <Constant name="fusion" /> only supports the newer behavior-change flag, where this case is a hard error. |
| `SeedExceedsLimitSamePath` | This warning comes from partial parsing in <Constant name="core" />, which <Constant name="fusion" /> does not support. |
| `SeedIncreased` | This warning comes from partial parsing in <Constant name="core" />, which <Constant name="fusion" /> does not support. |
| `GenerateSchemaNameNullValueDeprecation` | <Constant name="fusion" /> only supports the newer behavior-change flag, where this case is a hard error. |
| `GenericSemanticLayerDeprecation` | <Constant name="fusion" /> already implements the new semantic layer spec, so this legacy warning no longer applies. |
| `MFCumulativeTypeParamsDeprecation` | <Constant name="fusion" /> already implements the new semantic layer spec, so this legacy warning no longer applies. |
| `MFTimespineWithoutYamlConfigurationDeprecation` | <Constant name="fusion" /> already implements the new semantic layer spec, so this legacy warning no longer applies. |
| `MetricAttributesRenamed` | <Constant name="fusion" /> already implements the new semantic layer spec, so this legacy warning no longer applies. |
| `TimeDimensionsRequireGranularityDeprecation` | <Constant name="fusion" /> already implements the new semantic layer spec, so this legacy warning no longer applies. |
| `SourceFreshnessProjectHooksNotRun` | <Constant name="fusion" /> already uses the newer source freshness behavior, so this legacy warning does not apply. |
| `SemanticValidationFailure` | <Constant name="fusion" /> does not support semantic models, so this warning does not apply. |
| `ValidationWarning` | <Constant name="fusion" /> already validates allowed YAML keys strictly, so this warning would be redundant. |
| `PackageMaterializationOverrideDeprecation` | <Constant name="fusion" /> already enforces the latest behavior, which prevents packages from overriding built-in materializations. |
| `TestsConfigDeprecation` | <Constant name="fusion" /> does not surface this warning by default, which matches current <Constant name="core" /> behavior. |
| `ProjectFlagsMovedDeprecation` | <Constant name="fusion" /> already errors on this configuration, which matches newer <Constant name="core" /> behavior. |
| `ConfigSourcePathDeprecation` | This is now fully deprecated in <Constant name="fusion" />. |
| `ConfigLogPathDeprecation` | This is now fully deprecated in <Constant name="fusion" />. |
| `ConfigTargetPathDeprecation` | This is now fully deprecated in <Constant name="fusion" />. |
| `ConfigDataPathDeprecation` | This is now fully deprecated in <Constant name="fusion" />. |
| `EnvironmentVariableNamespaceDeprecation` | <Constant name="fusion" /> reserves the `DBT_ENGINE_` prefix and rejects unknown environment variables that use it. |
| `UnusedTables` | <Constant name="fusion" /> does not allow source overrides, so packages must disable a source explicitly instead. |
| `WrongResourceSchemaFile` | <Constant name="fusion" /> reports this case under `NoNodeForYamlKey` instead. |
| `PackageNodeDependsOnRootProjectNode` | <Constant name="fusion" /> only supports the newer behavior-change flag `require_ref_searches_node_package_before_root`, where this case is a hard error. |

### Warnings that are hard errors in <Constant name="fusion" />

Some <Constant name="core" /> warning names correspond to behaviors that <Constant name="fusion" /> enforces unconditionally as parse errors. If you reference these names in `warn_error_options`, <Constant name="fusion" /> emits a startup warning explaining that the entry has no effect. You can carry over your `warn_error_options` config from <Constant name="core" /> without breaking, but these configs do nothing (They will throw a warning as `unsupported` and should be removed from the config):

| dbt-Core event name | dbt v2 behavior | dbt v2 error code |
|---|---|---|
| `DuplicateYAMLKeysDeprecation` | <Constant name="fusion" />'s YAML parser rejects duplicate keys as hard parse errors | `DuplicateConfigKey` (1059) |
| `CustomKeyInConfigDeprecation` | Unknown config keys are rejected via strict schema validation | `UnusedConfigKey` (1060) |
| `CustomTopLevelKeyDeprecation` | Unknown top-level schema keys are hard parse errors | `UnusedConfigKey` (1060) |
| `ResourceNamesWithSpacesDeprecation` | Resource names with spaces are rejected during name validation | `SchemaError` |
| `InvalidValueForField` | Field value failures are surfaced as hard parse errors via deserialization | `SerializationError` |
| `GenericJSONSchemaValidationDeprecation` | JSON schema validation failures are hard parse errors | `SerializationError` |
| `DuplicateNameDistinctNodeTypesDeprecation` | Caught as a hard error during node resolution | `SchemaError` |

### Enabling `--warn-error` with static analysis in `baseline` mode

If your project emits static analysis warnings and you use `--warn-error` (which promotes all warnings to errors), your project may fail unexpectedly. We recommend explicitly listing the warning categories you want to enforce rather than using `error: all` when `baseline` mode is active.


### Deprecated `include` and `exclude` keys

The legacy `include` and `exclude` fields for `warn_error_options` were deprecated in <Constant name="dbt" /> v1.8 but are still supported in <Constant name="fusion" />. If you use them, <Constant name="fusion" /> emits a `WEOIncludeExcludeDeprecation` warning (code 1086) and ignores the deprecated keys. Migrate to `error`, `warn`, and `silence` instead:

```yaml
# Before (dbt ≤1.7)
flags:
  warn_error_options:
    include: all
    exclude:
      - NoNodesForSelectionCriteria

# After (dbt ≥1.8 and v2)
flags:
  warn_error_options:
    error: all
    warn:
      - NoNodesForSelectionCriteria
```

</VersionBlock>
