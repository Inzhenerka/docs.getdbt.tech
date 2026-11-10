---
title: "Обновление до v1.12"
id: upgrading-to-v1.12
description: Новые возможности и изменения в dbt v1.12
displayed_sidebar: "docs"
availability:
  engine: v1
  access: free
---

# Обновление до v1.12

## Ресурсы
- [Список изменений dbt v1.12](https://github.com/dbt-labs/dbt/blob/1.12.latest/CHANGELOG.md)
- [Руководство по установке CLI <Constant name="core" />](/docs/local/install-dbt)
- [Руководство по обновлению платформы dbt](/docs/dbt-versions/upgrade-dbt-platform-version)

## Что нужно знать перед обновлением

dbt Labs стремится обеспечивать обратную совместимость для всех версий 1.x. Любые изменения поведения будут сопровождаться [флагом изменения поведения](/reference/global-configs/behavior-changes#behavior-change-flags), чтобы у существующих проектов было время на миграцию. Если после обновления вы столкнулись с ошибкой, сообщите нам об этом, [создав issue](https://github.com/dbt-labs/dbt/issues/new).

<Constant name="dbt" /> предоставляет функциональность новых версий <Constant name="core" /> через [каналы выпуска](/docs/dbt-versions/dbt-release-tracks) с автоматическим обновлением. Если в <Constant name="dbt" /> вы выбрали канал выпуска **v1 Latest**, вам уже доступны все возможности, исправления и другая функциональность последней версии <Constant name="core" />! Если вы выбрали канал выпуска **v1 Compatible**, вы получите доступ к следующему ежемесячному выпуску **v1 Compatible** после финального релиза dbt v1.12.

## Новые и изменённые возможности и функциональность

### Парсер v2 с явным включением
В dbt v1.12 появился флаг `--use-v2-parser`, который передаёт разбор новому парсеру v2 на Rust вместо парсера v1 на Python. Парсер на Rust значительно быстрее парсера на Python — особенно в крупных проектах, где ускорение может составлять 5–10 раз. Это полезно, если вы хотите ускорить рабочий процесс разработки или сократить время запуска заданий. Использование парсера на Rust — естественный первый шаг к совместимости с v2: вы сможете выявлять и исправлять проблемы в проекте постепенно, а не все сразу.

Этот флаг требует явного включения и не меняет поведение, пока не задан, поэтому он позволяет с минимальным риском проверить совместимость с парсером v2 в dbt v1.12.

:::note
Парсер на Rust находится в стадии бета-тестирования. В пограничных случаях создаваемый им манифест может отличаться от манифеста парсера на Python, что может повлиять на последующее поведение. Чтобы вернуться к прежнему парсеру, уберите `--use-v2-parser` и [сообщите о проблемах](https://github.com/dbt-labs/dbt/issues), чтобы помочь нам устранить различия.
:::

Подробнее о включении флага, связанном поведении и типах ошибок парсера см. в разделе [Парсер v2 с явным включением](/reference/global-configs/parsing#opt-in-v2-parser).

### Новая спецификация `catalogs` для Iceberg

Мы переработали [спецификацию `catalogs.yml`](/docs/build/iceberg/catalogs-yml), чтобы упростить её использование и учесть последние изменения в поддержке Iceberg у поставщиков решений в экосистеме.

Новая спецификация также может использоваться для [кроссплатформенного dbt Mesh](/docs/mesh/cross-platform-mesh).

### Встроенная поддержка приватных пакетов

<Constant name="core" /> теперь поддерживает [приватные пакеты на встроенном уровне](/docs/build/packages#native-private-packages) в `packages.yml` и `dependencies.yml`. Вы можете устанавливать пакеты из приватных репозиториев GitHub, GitLab или Azure DevOps с помощью ключа `private`, не настраивая токен и не указывая полный Git URL. Для аутентификации dbt использует конфигурацию SSH вашей системы. Используйте [ключ `provider`](/docs/build/packages#using-the-provider-key), чтобы указать Git-провайдера и сообщить dbt, какой формат SSH URL нужно сформировать. Например:

```yaml
packages:
  - private: your-org/your-internal-repo
    provider: "github"  # Supported values: "github", "gitlab", "ado"
```

### Расширение возможностей UDF

- В dbt v1.12 добавлена поддержка пользовательских функций (UDF) на JavaScript в Snowflake и BigQuery. Чтобы определить UDF на JavaScript, создайте файл `.js` в каталоге `functions/` и соответствующий YAML-файл с аргументами функции и типом возвращаемого значения. Подробнее см. в разделе [Пользовательские функции](/docs/build/udfs).

- Вы можете определить несколько сигнатур аргументов для одной пользовательской функции (UDF) с помощью свойства `overloads`. Это позволяет вызывать функцию с одним и тем же именем с разными типами входных данных, не создавая отдельные UDF для каждого варианта. Эта возможность поддерживается для SQL UDF в Snowflake и Postgres, а также для Python UDF в Snowflake. Каждая перегрузка ссылается на отдельный файл через `defined_in` и может содержать необязательные `arguments` и `returns`. Все перегрузки объединены в один узел <Term id="dag">DAG</Term>, поэтому они создаются и выбираются вместе. При повторной попытке dbt пропускает успешно выполненные перегрузки и повторно запускает только те, которые завершились с ошибкой. Подробнее см. в разделах [Определение перегруженных UDF](/docs/build/udfs#defining-overloaded-udfs) и [`overloads`](/reference/resource-properties/overloads).

- Вы можете указать публичные сторонние пакеты PyPI для своей Python UDF с помощью необязательной настройки `packages`. Хранилище данных устанавливает эти пакеты при создании UDF, что позволяет использовать в функции возможности внешних библиотек Python. Подробнее см. в разделе [Определение UDF в dbt](/docs/build/udfs#defining-udfs-in-dbt) и в справочнике по настройке [packages](/reference/resource-configs/packages).

- Python UDF теперь поддерживаются в Databricks, помимо Snowflake и BigQuery. Для Python UDF в Databricks требуется [Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/), а настройки `runtime_version` и `entry_point` игнорируются. Подробнее см. в разделе [Пользовательские функции](/docs/build/udfs).

### `latest_version_pointer` для версионируемых моделей
Для версионируемых моделей можно настроить dbt так, чтобы после успешной материализации последней версии автоматически создавалось представление-указатель с базовым именем модели (например, `dim_customers`). Это позволяет запрашивать текущую версию, не поддерживая представление вручную.

Включите эту возможность для проекта с помощью флага [`latest_version_pointer_enabled_by_default: true`](/reference/global-configs/behavior-flags/latest_version_pointer_enabled_by_default) в `dbt_project.yml` или для отдельной модели с помощью настройки [`latest_version_pointer.enabled`](/reference/resource-configs/latest_version_pointer). Имя указателя можно настроить для отдельной модели через `latest_version_pointer.alias` или глобально, переопределив макрос [`generate_latest_version_pointer_alias`](/docs/build/custom-aliases#generate_latest_version_pointer_alias). Подробнее см. в разделе [Версии моделей](/docs/mesh/govern/model-versions#pointing-to-the-latest-version).

### Флаг `--sql` для `dbt run-operation`
Теперь можно использовать флаг `--sql` с `dbt run-operation`, чтобы выполнять разовые инструкции базы данных непосредственно в хранилище данных, не определяя макрос. Это удобно для разовых операций, таких как удаление или изменение таблицы, назначение прав доступа или исправление данных. Инструкция проходит через полный конвейер компиляции Jinja в dbt, поэтому вам доступны `ref()`, `source()`, `var()`, `target` и все остальные переменные контекста. Подробнее см. в разделе [О команде dbt run-operation](/reference/commands/run-operation).

### Настройка модели `on_error`
С помощью настройки [`on_error`](/reference/resource-configs/on_error) можно управлять тем, будут ли запускаться зависимые модели, если модель выше по графу зависимостей завершится с ошибкой. Установите `on_error: continue` для модели, чтобы разрешить попытку запуска зависимых от неё моделей даже в случае её сбоя. По умолчанию (`skip_children`) dbt пропускает все зависимые модели при сбое. Обратите внимание, что [`--fail-fast`](/reference/global-configs/failing-fast) имеет приоритет &mdash; запуски с `--fail-fast` останавливаются при первом сбое, даже если для модели задано `on_error: continue`.

### Поддержка семантического слоя Apache Ossie
- dbt v1.12 поддерживает стандарт [Apache Ossie](https://github.com/apache/ossie) для определения семантических моделей и метрик. Вы можете размещать файлы `.json` в формате Ossie в каталоге `osi/` в корне проекта, и dbt будет разбирать их и включать в манифест вместе с семантическими моделями в собственном формате dbt. Чтобы использовать другой каталог, задайте [`osi-paths`](/reference/project-configs/osi-paths) в `dbt_project.yml`. Поддерживаются версии Ossie `0.1.0` и `0.1.1`; любая другая версия вызывает ошибку разбора. Подробнее см. в разделе [Документы семантического слоя Ossie](/docs/build/ossie-semantic-models).
- Во время разбора dbt записывает файл `osi_document.json` в каталог `target/` рядом с `semantic_manifest.json`. Этот артефакт предоставляет представление <Constant name="semantic_layer" /> вашего проекта в формате Ossie. Подробнее см. в разделе [Семантический манифест](/reference/artifacts/sl-manifest#apache-ossie-document).


Эта возможность не связана с новой спецификацией YAML для <Constant name="semantic_layer" />, описанной ниже, которая меняет способ определения семантических моделей и метрик в собственном формате YAML dbt.

### Новая спецификация YAML для семантического слоя {#new-semantic-layer-yaml-spec}

В dbt v1.12 добавлена поддержка последней спецификации YAML для <Constant name="semantic_layer" />, которая упрощает определение метрик и измерений за счёт размещения семантических аннотаций непосредственно рядом с каждой моделью.

Основные изменения в новой спецификации:
- `semantic_model` размещается непосредственно внутри каждой модели, а не в виде отдельного ключа верхнего уровня.
- Сущности и измерения определяются на уровне столбцов.
- Меры заменены метриками с `type: simple`, определёнными внутри модели.
- `type_params` объявлен устаревшим; его параметры теперь являются ключами верхнего уровня в определении каждой метрики.

Рекомендации по миграции и сравнение последней и прежней спецификаций см. в разделе [Переход на последнюю спецификацию YAML](/docs/build/latest-metrics-spec). Справочную информацию о семантических моделях см. в разделе [Семантические модели](/docs/build/semantic-models).

### Метод `selector` для именованных YAML-селекторов
Вы можете ссылаться на именованный селектор из `selectors.yml` внутри `--select` или `--exclude` с помощью [метода `selector`](/reference/node-selection/methods#selector) (например, `selector:my_selector`). Это упрощает совместное использование повторно используемых YAML-селекторов с другими [методами выбора](/reference/node-selection/methods), [операторами графа](/reference/node-selection/graph-operators) и [операторами множеств](/reference/node-selection/set-operators) в командной строке без дублирования логики.

При использовании прежнего флага `--selector` вместе с `--select` или `--exclude` dbt использует для выбора узлов только `--selector` и игнорирует `--select` и `--exclude`. Начиная с dbt v1.12, dbt также выдаёт предупреждение при таком сочетании флагов. Если вы хотите объединить селектор с `--select` или `--exclude`, используйте вместо этого новый метод `selector:`.

### Поддержка `vars.yml`
Вы можете использовать файл [`vars.yml`](/docs/build/project-variables#defining-variables-in-varsyml) в корне проекта для определения переменных проекта. Это позволяет хранить определения переменных в одном месте и упрощает `dbt_project.yml`. Переменные из `vars.yml` разбираются _до_ `dbt_project.yml`, поэтому на них можно ссылаться в `dbt_project.yml` через `{{ var('...') }}`. Вы по-прежнему можете определять переменные в `dbt_project.yml`, но определять их одновременно в обоих файлах нельзя. Подробности и порядок приоритетов см. в разделе [Переменные проекта](/docs/build/project-variables).


### Улучшенная обработка исключений и сообщения об ошибках

В dbt v1.12 улучшена обработка исключений: сообщения об ошибках стали понятнее, а трассировки стека — проще для интерпретации.

Раньше некоторые внутренние сбои проявлялись как ошибки Python (например, `AttributeError`, `KeyError`, `IndexError`, `RuntimeError`), которые было трудно понять. В dbt v1.12 они заменены ошибками dbt (такими как `CompilationError` и `ParsingError`) с понятным сообщением об ошибке. Если для отладки нужен полный вывод ошибки Python, используйте `--debug` или проверьте журналы.

Основные улучшения:

- **Более понятный вывод по умолчанию**: встроенные исключения Python (`Exception`, `ValueError`, `RuntimeError`) заменены ошибками dbt, поэтому dbt больше не считает их внутренними ошибками и не выводит ненужные трассировки стека.
- **Разбор и проверка конфигурации**: при применении настроек `dbt_project.yml` к ресурсам недопустимые значения полей вызывают `ParsingError` вместо необработанного исключения `InvalidFieldValue`. Если в обобщённом тесте данных значение `config` является строкой или числом, а не набором пар «ключ — значение», возникает `TestConfigNotDictError`.
- **Проверка снимков**: если проверка снимка завершается неудачно, dbt показывает соответствующее сообщение об ошибке без длинного вывода ошибки Python.
- **`dbt run-operation`**: если вызов `run-operation` завершается с ошибкой, сообщение об исключении включается в `run_results.json`, что упрощает анализ сбоев.
- **Обнаружение циклов**: циклы в графе зависимостей вызывают `CompilationError` вместо встроенного `RuntimeError`.
- **Зависимости семантических моделей**: если семантическая модель ссылается на отключённую или отсутствующую модель, dbt вызывает `CompilationError` вместо `IndexError`.
<Expandable alt_header="Другие сценарии с улучшенной обработкой исключений">

- Конкатенация строк в аргументе `doc()` (например, `doc('foo' ~ 'bar')`) пропускается при разрешении блоков doc вместо сбоя с `AttributeError`. 
- Переменная Jinja (например, `doc(my_variable)`) вызывает `DocTargetNotFoundError`.
- Если значение `meta` в `schema.yml` ссылается на неопределённую переменную Jinja, dbt преобразует его в `None`, а не вызывает `TypeError` во время частичного разбора.
- Если `sources`, `tables`, теги `exposure` или `packages` имеют значение `null`, dbt обрабатывает их как пустой список, а не вызывает `TypeError`.
- Если модель с пользовательскими ограничениями контракта оценивается при выборе `state:modified`, dbt возвращает `None` для неизвестных типов ограничений, а не вызывает `KeyError`.
</Expandable>

### Управление изменениями прежнего поведения

В dbt v1.12 появились новые флаги для [управления изменениями прежнего поведения](/reference/global-configs/behavior-changes). Вы можете включить недавно добавленные изменения (отключённые по умолчанию) или отключить устоявшиеся изменения (включённые по умолчанию), задав соответственно значения `true` / `false` в разделе `flags` файла `dbt_project.yml`.

Подробнее о каждом из этих изменений поведения можно прочитать по следующим ссылкам:

- (Устоявшееся, включено по умолчанию) [`require_all_warnings_handled_by_warn_error`](/reference/global-configs/behavior-flags/require_all_warnings_handled_by_warn_error). Все предупреждения, возникающие во время выполнения, теперь направляются в обработчик `--warn-error` / `--warn-error-options`. Это затрагивает только проекты, использующие `warn_error: true` или `--warn-error`.
- (Устоявшееся, включено по умолчанию) [`require_batched_execution_for_custom_microbatch_strategy`](/reference/global-configs/behavior-flags/require_batched_execution_for_custom_microbatch_strategy). dbt теперь выполняет пользовательские стратегии микропакетной обработки пакетами. Если у вас есть пользовательский макрос микропакетной обработки и флаг установлен в `false`, dbt выдаёт предупреждение об устаревании.
- (Устоявшееся, включено по умолчанию) [`require_nested_cumulative_type_params`](/reference/global-configs/behavior-flags/require_nested_cumulative_type_params). dbt теперь выдаёт ошибку (вместо предупреждения), если накопительные метрики используют синтаксис без вложенности. Метрики накопительного типа должны быть вложены в поле `cumulative_type_params`, как требуется начиная с dbt v1.9.
- (Устоявшееся, включено по умолчанию) [`require_yaml_configuration_for_mf_time_spines`](/reference/global-configs/behavior-flags/require_yaml_configuration_for_mf_time_spines). dbt подавляет предупреждение `MFTimespineWithoutYamlConfigurationDeprecation`. Прежняя конфигурация через SQL-файл продолжает работать. Этот флаг не влияет на функциональность.
- (Устоявшееся, включено по умолчанию) [`skip_nodes_if_on_run_start_fails`](/reference/global-configs/behavior-flags/skip_nodes_if_on_run_start_fails). dbt пропускает все выбранные ресурсы при сбое в хуке `on-run-start`.
- (Устоявшееся, включено по умолчанию) [`state_modified_compare_more_unrendered_values`](/reference/global-configs/behavior-flags/state_modified_compare_more_unrendered_values). dbt использует значения до рендеринга при сравнении `state:modified`, уменьшая число ложных срабатываний, когда настройки различаются в зависимости от целевого окружения (например, `prod` и `dev`).
- (Устоявшееся, включено по умолчанию) [`validate_macro_args`](/reference/global-configs/behavior-flags/validate_macro_args). dbt по умолчанию проверяет аргументы макросов.
- (Новое, отключено по умолчанию) [`require_valid_schema_from_generate_schema_name`](/reference/global-configs/behavior-flags/require_valid_schema_from_generate_schema_name). По умолчанию этот флаг установлен в `false`. При таком значении dbt выдаёт предупреждение [`GenerateSchemaNameNullValueDeprecation`](/reference/deprecations#generateschemanamenullvaluedeprecation), если пользовательский макрос `generate_schema_name` возвращает `null`. При значении `true` dbt применяет более строгую проверку и выдаёт ошибку разбора вместо предупреждения.
- (Новое, отключено по умолчанию) [`require_sql_header_in_test_configs`](/reference/global-configs/behavior-flags/require_sql_header_in_test_configs). При значении `true` можно задавать [`sql_header`](/reference/resource-configs/sql_header) в `config` обобщённого теста данных на уровне модели или столбца в файле `properties.yml`. Подробнее см. в разделе [Настройки тестов данных](/reference/data-test-configs).
- (Новое, отключено по умолчанию) [`require_corrected_analysis_fqns`](/reference/global-configs/behavior-flags/require_corrected_analysis_fqns). При значении `true` dbt применяет настройки анализов уровня проекта из `dbt_project.yml`. Ранее dbt игнорировал эти настройки без каких-либо сообщений. Этот флаг также исправляет полные имена (FQN) анализов, удаляя лишний сегмент пути и приводя их в соответствие с другими типами ресурсов (например, `your_project.my_analysis` вместо `your_project.analyses.my_analysis`). Подробнее см. в разделе [Анализы](/docs/build/analyses).
- (Новое, отключено по умолчанию) [`require_source_and_semantic_model_names_without_spaces`](/reference/global-configs/behavior-flags/require_source_and_semantic_model_names_without_spaces). По умолчанию dbt выдаёт предупреждение [`ResourceNamesWithSpacesDeprecation`](/reference/deprecations#resourcenameswithspacesdeprecation), если обнаруживает пробел в имени источника или семантической модели. Если флаг установлен в `true`, dbt выдаёт ошибку.
- (Новое, отключено по умолчанию) [`allow_jinja_file_extensions`](/reference/global-configs/behavior-flags/allow_jinja_file_extensions). При значении `True` dbt распознаёт суффиксы расширений в стиле Jinja (`.j2`, `.jinja`, `.jinja2`) у файлов `.sql` и `.md`. Это позволяет использовать подсветку синтаксиса с учётом Jinja в IDE, которые связывают эти суффиксы с шаблонизацией Jinja.
- (Новое, отключено по умолчанию) [`latest_version_pointer_enabled_by_default`](/reference/global-configs/behavior-flags/latest_version_pointer_enabled_by_default). При значении `true` dbt автоматически создаёт представление-указатель на последнюю версию для каждой версионируемой модели в проекте, не требуя настройки на уровне отдельных моделей.

## Возможности и функциональность отдельных адаптеров

### Snowflake

- Вы можете материализовать модель как [интерактивную таблицу](/reference/resource-configs/snowflake-configs#interactive-tables) Snowflake, задав `materialized: interactive_table`. Интерактивные таблицы оптимизированы для запросов с низкой задержкой и поддерживают как статический, так и динамический (с автоматическим обновлением) варианты в зависимости от того, задан ли [`target_lag`](/reference/resource-configs/snowflake-configs#target-lag-interactive-tables). В отличие от динамических таблиц, [`cluster_by`](/reference/resource-configs/snowflake-configs#cluster-by-interactive-tables) обязателен. <Lifecycle status="beta" />
- Вы можете использовать настройку [`snowflake.quote_args`](/reference/resource-configs/quote_args) для JavaScript UDF, чтобы управлять заключением имён аргументов в кавычки в создаваемой инструкции `CREATE FUNCTION`. При значении `true` (по умолчанию) Snowflake заключает имена аргументов в кавычки, точно сохраняя регистр, поэтому в теле функции нужно обращаться к аргументам в том же регистре, что и в YAML. При значении `false` имена аргументов не заключаются в кавычки, и Snowflake переводит их в верхний регистр, поэтому в теле функции нужно обращаться к ним в верхнем регистре.
- Вы можете задать настройку [`iceberg_version`](/docs/build/iceberg/adapters/snowflake-iceberg-support) для таблиц Snowflake Iceberg, чтобы управлять используемой Snowflake версией формата Iceberg. Установите её в `3` для использования Iceberg V3, который улучшает поддержку типа `VARIANT` и повышает эффективность изменений на уровне строк за счёт отдельного отслеживания удалений вместо перезаписи данных. Значение по умолчанию — `2`. Обратите внимание, что изменить значение `iceberg_version` после создания таблицы нельзя.
- Вы можете настроить параметр [`scheduler`](/reference/resource-configs/snowflake-configs#scheduler) для динамических таблиц Snowflake, чтобы управлять их обновлением. Значение `ENABLE` позволяет Snowflake автоматически обновлять динамическую таблицу, а `DISABLE` означает, что обновлениями управляет dbt во время выполнения модели. Если `scheduler` установлен в `ENABLE`, необходимо также указать [`target_lag`](/reference/resource-configs/snowflake-configs#target-lag). 

    По умолчанию dbt устанавливает `scheduler` в `DISABLE` (в отличие от собственного значения по умолчанию в Snowflake — `ENABLE`), поэтому dbt управляет расписанием обновлений, пока вы явно не включите планировщик Snowflake. Если вы указываете `target_lag`, не задавая `scheduler`, dbt автоматически устанавливает `scheduler` в `ENABLE`.
- Вы можете использовать параметр [`snowflake_initialization_warehouse`](/reference/resource-configs/snowflake-configs#initialization-warehouse), чтобы указать вычислительный ресурс warehouse для первоначального создания и повторной инициализации динамической таблицы отдельно от `snowflake_warehouse`, используемого для обычных инкрементальных обновлений.
- Вы можете создавать динамические таблицы Snowflake как transient (без [периода Fail-safe](https://docs.snowflake.com/en/user-guide/data-failsafe)), задав настройку [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) для моделей. 

    Если `transient` не задан для модели, значение по умолчанию определяется флагом [`snowflake_default_transient_dynamic_tables`](/reference/global-configs/snowflake-changes#the-snowflake_default_transient_dynamic_tables-flag). Установите этот флаг в `true`, чтобы по умолчанию все динамические таблицы были transient.

### BigQuery

- BigQuery теперь поддерживает [параллельное выполнение микропакетов](/docs/build/parallel-batch-execution), как и Snowflake.
- Добавлен флаг [`bigquery_use_standard_sql_for_partitions`](/reference/global-configs/bigquery-changes#the-bigquery_use_standard_sql_for_partitions-flag), который определяет, использует ли `get_partitions_metadata()` стандартный SQL (`INFORMATION_SCHEMA.PARTITIONS`) или устаревший SQL (`$__PARTITIONS_SUMMARY__`). При первом появлении в этом выпуске значение флага по умолчанию было `false`, но затем его изменили на `true` в преддверии [прекращения поддержки устаревшего SQL в BigQuery 1 июня 2026 года](https://docs.cloud.google.com/bigquery/docs/release-notes#February_25_2026). Чтобы вернуться к устаревшему SQL, установите флаг в `false` в `dbt_project.yml`.
- Добавлен флаг [`bigquery_reject_wildcard_metadata_source_freshness`](/reference/global-configs/bigquery-changes#the-bigquery_reject_wildcard_metadata_source_freshness-flag). Если он установлен в `true`, dbt вызывает `DbtRuntimeError` при выполнении проверок актуальности источников на основе метаданных с идентификаторами таблиц, содержащими подстановочные знаки (например, `events_*`), предотвращая некорректные результаты проверки актуальности.
- Вы можете настроить запись ссылок на задания BigQuery в журнал с помощью `job_link_info_level_log`. По умолчанию dbt записывает ссылки на задания на уровне debug. Чтобы записывать их на уровне info, установите `job_link_info_level_log: true` в профиле BigQuery. Благодаря этому ссылки на задания будут видны в журналах dbt, что упростит доступ к консоли BigQuery. Подробнее см. в разделе [Настройка BigQuery](/docs/local/connect-data-platform/bigquery-setup?version=1.12#job_link_info_level_log).
- Вы можете задавать `job_execution_timeout_seconds` для отдельной модели, снимка, seed или теста, помимо настройки на уровне профиля. Значение для отдельного ресурса имеет приоритет над значением по умолчанию, заданным на уровне профиля. Подробнее см. в разделе [Настройка BigQuery](/docs/local/connect-data-platform/bigquery-setup?version=1.12#jobexecutiontimeout_seconds).

### Redshift

- Флаг [`redshift_skip_autocommit_transaction_statements`](/reference/global-configs/redshift-changes#redshift_skip_autocommit_transaction_statements-flag) по умолчанию имеет значение `false`, сохраняя прежнее поведение: отправку инструкций `BEGIN`/`COMMIT`/`ROLLBACK` даже при включённом autocommit. Чтобы пропускать ненужные инструкции управления транзакциями и повысить производительность, установите флаг в `true`.
- Добавлена поддержка параметра сеанса `query_group`, позволяющего dbt помечать запросы для маршрутизации в Redshift Workload Manager и журналирования запросов. Если параметр настроен в профиле, dbt задаёт `query_group` при открытии соединения, и это значение действует в течение всего сеанса. Вы также можете настроить `query_group` на уровне модели, чтобы временно переопределить значение по умолчанию для конкретной модели; dbt восстанавливает прежнее значение по завершении материализации модели. Подробнее см. в разделе [Настройки Redshift](/reference/resource-configs/redshift-configs#session-configuration).

### Databricks

- Вы можете использовать настройку [`row_filter`](/reference/resource-configs/databricks-configs#setting-row-filters), чтобы применить к модели [фильтр строк Unity Catalog](https://docs.databricks.com/aws/en/tables/row-and-column-filters), ограничивающий строки, возвращаемые запросом, на основе SQL UDF. Фильтры строк поддерживаются для материализаций `table`, `incremental`, `materialized_view` и `streaming_table`. Они не поддерживаются для обычных представлений и объектов Hive Metastore.
- В v1.12 внесены два изменения в [`databricks_tags`](/reference/resource-configs/databricks-configs#databricks_tags):
  - Теперь можно установить значение тега в `''` или `None`, чтобы применить тег, содержащий только ключ без значения.
  - Настройки теперь объединяются с добавлением значений на разных уровнях иерархии (например, на уровне проекта и модели), а не полностью заменяют настройки более высокого уровня настройками более низкого. Если один и тот же ключ тега определён на нескольких уровнях, приоритет имеет значение с более низкого уровня.


## Кратко о других изменениях

- dbt теперь время от времени показывает подсказки, которые предлагают способы оптимизации проекта и не блокируют выполнение. Подсказки включены по умолчанию. Отключить их можно с помощью [флага `hints_enabled`](/reference/global-configs/about-global-configs).
- dbt v1.12 теперь допускает имена, специфичные для dbt v2, в [`warn_error_options`](/reference/global-configs/warnings), вместо того чтобы выдавать ошибку. Если в настройках указано имя, специфичное для v2 (например, `StaticAnalysis`, `PackageParsingCompatibility`), <Constant name="core" /> игнорирует его и выводит примечание: `<name> is not being used because it's specific to the dbt Fusion engine.` Это позволяет использовать общие настройки `warn_error_options` в <Constant name="core" /> и <Constant name="fusion" />.
- Макросы, вызываемые командой [`dbt run-operation`](/reference/commands/run-operation), теперь могут ссылаться через `ref()` на модели с уровнем [доступа](/reference/resource-configs/access) `private` или `protected` без возникновения `DbtReferenceError`. Поскольку макросы не входят в систему групп и управления доступом, dbt не проверяет принадлежность к группе, когда макрос, вызванный через `run-operation`, ссылается на модель.
- `dbt seed` теперь поддерживает флаг [`--empty`](/reference/commands/seed#the---empty-flag). Используйте его, чтобы создавать seed-таблицы с правильной схемой, но без загрузки данных.
- <Constant name="core" /> теперь автоматически загружает переменные окружения из файла `.env` в текущем рабочем каталоге. Переменные окружения оболочки имеют приоритет над значениями из `.env`. Новые проекты, созданные с помощью `dbt init`, включают `.env` в стандартный `.gitignore`. Подробнее см. в разделе [О функции env_var](/reference/dbt-jinja-functions/env_var#using-the-env-file).
- `dbt compile` записывает скомпилированный SQL для [снимков](/docs/build/snapshots) в `target/compiled/`, как и для моделей, тестов, анализов и функций. Каждый снимок получает собственный выходной файл с именем на основе идентификатора снимка, поэтому несколько блоков снимков в одном исходном файле не используют один и тот же путь для скомпилированного результата. Подробнее см. в разделе [О команде dbt compile](/reference/commands/compile).
