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
- Если `error` задан как `"all"` или `"*"`, через необязательный параметр `warn` можно указать предупреждения, которые не нужно превращать в ошибки.
- Используйте параметр `silence`, чтобы игнорировать предупреждения. Чтобы подавить определённые предупреждения, которые вы хотите игнорировать, вы можете указать их в параметре `silence`. Это полезно в крупных проектах, где некоторые предупреждения не являются критичными и могут быть проигнорированы, чтобы снизить уровень шума и сохранить логи чистыми.

Вот как вы можете использовать флаг [`--warn-error-options`](#use-warn-error-options-for-targeted-warnings), чтобы повышать _конкретные_ предупреждения до ошибок:
- [Предупреждения тестов](/reference/resource-configs/severity) с флагом `--warn-error-options '{"error": ["LogTestResult"]}'`.
- Jinja [предупреждения об исключениях](/reference/dbt-jinja-functions/exceptions#warn) с `--warn-error-options '{"error": ["JinjaLogWarning"]}'`.
- Отсутствие выбранных узлов с `--warn-error-options '{"error": ["NoNodesForSelectionCriteria"]}'`.
- Предупреждения об устаревании с `--warn-error-options '{"error": ["Deprecations"]}'` (новое в v1.10).

### Конфигурация {#configuration}

Вы можете настраивать предупреждения как ошибки или определять, какие предупреждения следует подавлять, с помощью warn error options через флаг командной строки, переменную окружения или `dbt_project.yml`.

Можно выбрать один из вариантов:

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

## Поведение dbt v2 и коды предупреждений {#dbt-v2-behavior-and-warning-codes}

<Constant name="fusion_engine" /> полностью поддерживает `warn_error_options`. Ниже описаны важные отличия от <Constant name="core" />.

Имена событий dbt Core делятся на три категории:

- **Поддерживаются:** сопоставляются с аналогичными предупреждениями <Constant name="fusion" /> и работают примерно так же.
- **Не будут поддерживаться:** события, поддержку которых не планируется добавлять.
- **Пока не поддерживаются:** имена распознаются, но пока ничего не меняют.

### Коды предупреждений в <Constant name="fusion" /> {#warning-codes-in}

В <Constant name="fusion" /> у каждого предупреждения есть числовой код, например `1092`, и имя события, например `NoNodesForSelectionCriteria`. При выполнении dbt показывает и код, и имя, но `warn_error_options` принимает только имена событий:

```yaml
flags:
  warn_error_options:
    error:
      - NothingToDo   # by name
    silence:
      - FreshnessConfigProblem   # by name
```

Если указать неподдерживаемое имя события, неподдерживаемую группу или числовой код, <Constant name="fusion" /> завершится ошибкой при запуске. Допустимы поддерживаемые имена из Core или v2, а также группы `all` и `*`. Например, `{error: [1092]}` не сработает, а `{error: [NoNodesForSelectionCriteria]}` сработает.

В таблицах на этой странице перечислены не все допустимые имена. У <Constant name="fusion" /> есть собственные предупреждения, например `SemanticModelDeprecated` с кодом `dbt1157`. Для настройки используйте имя из сообщения при выполнении.

### Поддерживаемые псевдонимы событий dbt Core {#supported-legacy-dbt-core-event-name-aliases}

Если в журнале появился код предупреждения, найдите в таблице соответствующее имя события для `warn_error_options`. Столбец с кодом нужен только для поиска предупреждений при выполнении. В самой настройке код использовать нельзя.

| Код dbt v2 (только при выполнении) | Имя события dbt Core (для конфигурации) | Описание |
|---|---|---|
| 1601 | `NoNodesSelected` | Нет выбранных узлов |
| 1601 | `NothingToDo` | Нет выбранных узлов (псевдоним) |
| 1087 | `NodeNotFoundOrDisabled` | Тест или зависимость экспозиции ссылается на отсутствующий или отключённый узел |
| 1085 | `DeprecatedModel` | Дата прекращения поддержки модели прошла, модель следует удалить |
| 1072 | `DeprecatedReference` | Ссылка на модель, поддержка которой уже прекращена |
| 1073 | `UpcomingReferenceDeprecation` | Ссылка на модель, поддержка которой прекратится в будущем |
| 1074 | `JinjaLogWarning` | В макросе Jinja вызван `exceptions.warn()` |
| 1075 | `SnapshotTimestampWarning` | Не совпадает тип столбца с меткой времени снимка |
| 1076 | `PackageRedirectDeprecation` | Пакет перенаправлен на новое имя. Обновите `packages.yml` |
| 1077 | `DepsUnpinned` | Для Git-пакета не закреплена ревизия (`HEAD`, `main` или `master`) |
| 1078 | `FreshnessConfigProblem` | Для источника не настроена актуальность, проверка пропущена |
| 1084 | `WarnStateTargetEqual` | Пути каталогов `--state` и `--target` совпадают |
| 1086 | `WEOIncludeExcludeDeprecation` | В `warn_error_options` использованы устаревшие ключи `include` или `exclude`. Используйте `error` и `warn` |
| 1089 | `NoNodeForYamlKey` | Ключ YAML ссылается на узел, которого нет в проекте |
| 1090 | `MacroNotFoundForPatch` | Запись `patches:` в YAML ссылается на отсутствующий макрос |
| 1091 | `InvalidConcurrentBatchesConfig` | Задан `concurrent_batches`, но модель его не поддерживает |
| 1092 | `NoNodesForSelectionCriteria` | Критерии `--select` не выбрали ни одного узла |
| 1093 | `MicrobatchModelNoEventTimeInputs` | У microbatch-модели нет входных ресурсов с настроенным `event_time` |
| 1094 | `UnversionedBreakingChange` | В модель без версии внесено несовместимое изменение |
| 1095 | `UnsupportedConstraintMaterialization` | Ограничение задано для материализации, которая его не поддерживает |
| 1097 | `UnusedResourceConfigPath` | Путь `+config` в `dbt_project.yml` не соответствует ни одному ресурсу |
| 1098 | `DepsScrubbedPackageName` | Из имени пакета при установке удалены недопустимые символы |
| 1099 | `DepsFoundDuplicatePackage` | Один пакет указан в `packages.yml` несколько раз |
| 1506 | `InvalidMacroAnnotation` | Имя или тип аргумента в YAML-аннотации макроса не соответствует его определению Jinja |
| _без кода_ | `LogTestResult` | Результат теста данных (успех, предупреждение или ошибка) |
| _без кода_ | `RunResultWarning` | Модель или тест завершились со статусом `warn` |
| _без кода_ | `RunResultWarningMessage` | Сообщение к результату запуска со статусом `warn` |

### Неподдерживаемые имена событий <Constant name="core" /> {#unsupported--event-names}

В <Constant name="fusion" /> действительны только прежние имена из списка [Поддерживаемые псевдонимы событий dbt Core](#supported-legacy-dbt-core-event-name-aliases). У <Constant name="core" /> есть и другие имена событий, которые <Constant name="fusion" /> не принимает. Если указать другое имя в `warn_error_options`, при запуске появится предупреждение.

Таблица перечисляет только те неподдерживаемые имена событий <Constant name="core" />, которые <Constant name="fusion" /> распознаёт, чтобы при запуске объяснить, почему они не действуют. Удалите эти записи: соответствующее поведение <Constant name="core" /> удалено, заменено или применяется в <Constant name="fusion" /> безусловно. Другие неподдерживаемые имена тоже вызывают предупреждение при проверке `warn_error_options` на старте.

| Имя события dbt Core | Сообщение |
|---|---|
| `MicrobatchMacroOutsideOfBatchesDeprecation` | <Constant name="fusion" /> поддерживает только новое поведение, при котором это ошибка. |
| `SeedExceedsLimitSamePath` | Предупреждение относится к частичному разбору в <Constant name="core" />. <Constant name="fusion" /> не поддерживает частичный разбор. |
| `SeedIncreased` | Предупреждение относится к частичному разбору в <Constant name="core" />. <Constant name="fusion" /> не поддерживает частичный разбор. |
| `GenerateSchemaNameNullValueDeprecation` | <Constant name="fusion" /> поддерживает только новое поведение, при котором это ошибка. |
| `GenericSemanticLayerDeprecation` | <Constant name="fusion" /> уже использует новую спецификацию семантического слоя, поэтому предупреждение неприменимо. |
| `MFCumulativeTypeParamsDeprecation` | <Constant name="fusion" /> уже использует новую спецификацию семантического слоя, поэтому предупреждение неприменимо. |
| `MFTimespineWithoutYamlConfigurationDeprecation` | <Constant name="fusion" /> уже использует новую спецификацию семантического слоя, поэтому предупреждение неприменимо. |
| `MetricAttributesRenamed` | <Constant name="fusion" /> уже использует новую спецификацию семантического слоя, поэтому предупреждение неприменимо. |
| `TimeDimensionsRequireGranularityDeprecation` | <Constant name="fusion" /> уже использует новую спецификацию семантического слоя, поэтому предупреждение неприменимо. |
| `SourceFreshnessProjectHooksNotRun` | <Constant name="fusion" /> уже использует новое поведение проверок актуальности источников, поэтому предупреждение неприменимо. |
| `SemanticValidationFailure` | <Constant name="fusion" /> не поддерживает семантические модели, поэтому предупреждение неприменимо. |
| `ValidationWarning` | <Constant name="fusion" /> уже строго проверяет допустимые ключи YAML, поэтому предупреждение избыточно. |
| `PackageMaterializationOverrideDeprecation` | <Constant name="fusion" /> уже применяет новое поведение, запрещающее пакетам переопределять встроенные материализации. |
| `TestsConfigDeprecation` | <Constant name="fusion" /> по умолчанию не показывает предупреждение, как и текущая версия <Constant name="core" />. |
| `ProjectFlagsMovedDeprecation` | <Constant name="fusion" /> выдаёт ошибку для этой конфигурации, как и более новые версии <Constant name="core" />. |
| `ConfigSourcePathDeprecation` | Эта настройка окончательно устарела в <Constant name="fusion" />. |
| `ConfigLogPathDeprecation` | Эта настройка окончательно устарела в <Constant name="fusion" />. |
| `ConfigTargetPathDeprecation` | Эта настройка окончательно устарела в <Constant name="fusion" />. |
| `ConfigDataPathDeprecation` | Эта настройка окончательно устарела в <Constant name="fusion" />. |
| `EnvironmentVariableNamespaceDeprecation` | <Constant name="fusion" /> резервирует префикс `DBT_ENGINE_` и отклоняет неизвестные переменные окружения с таким префиксом. |
| `UnusedTables` | <Constant name="fusion" /> не разрешает переопределять источники. Пакетам нужно явно отключать источник. |
| `WrongResourceSchemaFile` | <Constant name="fusion" /> сообщает об этом через `NoNodeForYamlKey`. |
| `PackageNodeDependsOnRootProjectNode` | <Constant name="fusion" /> поддерживает только новое поведение `require_ref_searches_node_package_before_root`, при котором это ошибка. |

### Предупреждения, которые в <Constant name="fusion" /> являются ошибками {#warnings-that-are-hard-errors-in}

Некоторые предупреждения <Constant name="core" /> в <Constant name="fusion" /> всегда считаются ошибками разбора. Если указать их имена в `warn_error_options`, <Constant name="fusion" /> предупредит об этом при запуске. Перенос конфигурации из Core не прерывает запуск, но такие записи не действуют, помечаются как `unsupported` и подлежат удалению:

| Имя события dbt Core | Поведение dbt v2 | Код ошибки dbt v2 |
|---|---|---|
| `DuplicateYAMLKeysDeprecation` | Парсер YAML в <Constant name="fusion" /> отклоняет повторяющиеся ключи с ошибкой разбора | `DuplicateConfigKey` (1059) |
| `CustomKeyInConfigDeprecation` | Строгая проверка схемы отклоняет неизвестные ключи конфигурации | `UnusedConfigKey` (1060) |
| `CustomTopLevelKeyDeprecation` | Неизвестные ключи верхнего уровня вызывают ошибку разбора | `UnusedConfigKey` (1060) |
| `ResourceNamesWithSpacesDeprecation` | Имена ресурсов с пробелами отклоняются при проверке имён | `SchemaError` |
| `InvalidValueForField` | Недопустимые значения полей вызывают ошибку разбора при десериализации | `SerializationError` |
| `GenericJSONSchemaValidationDeprecation` | Сбой проверки схемы JSON вызывает ошибку разбора | `SerializationError` |
| `DuplicateNameDistinctNodeTypesDeprecation` | При разрешении узлов возникает ошибка | `SchemaError` |

### Флаг `--warn-error` при статическом анализе в режиме `baseline` {#enabling---warn-error-with-static-analysis-in-baseline-mode}

Если статический анализ выдаёт предупреждения и включён `--warn-error`, превращающий все предупреждения в ошибки, запуск может неожиданно завершиться сбоем. Лучше явно перечислить категории предупреждений, которые нужно считать ошибками. В режиме `baseline` не используйте для этой цели `error: all`.


### Устаревшие ключи `include` и `exclude` {#deprecated-include-and-exclude-keys}

Ключи `include` и `exclude` в `warn_error_options` устарели в <Constant name="dbt" /> v1.8, но по-прежнему распознаются в <Constant name="fusion" />. При их использовании <Constant name="fusion" /> выдаёт предупреждение `WEOIncludeExcludeDeprecation` (код 1086) и игнорирует эти ключи. Перейдите на `error`, `warn` и `silence`:

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
