---
title: "Изменения в поведении"
id: "behavior-changes"
sidebar: "Изменения в поведении"
---

import StateModified from '/snippets/_state-modified-compare.md';

Большинство флагов существуют для настройки поведения во время выполнения с несколькими допустимыми вариантами. Правильный выбор может варьироваться в зависимости от среды, предпочтений пользователя или конкретного вызова.

Другая категория флагов предоставляет существующим проектам окно для миграции поведения во время выполнения, которое изменяется в новых выпусках dbt. Эти флаги помогают нам достичь баланса между этими целями, которые в противном случае могут быть в противоречии, за счет:
- Предоставления лучшего, более разумного и более последовательного поведения по умолчанию для новых пользователей/проектов.
- Предоставления окна для миграции существующих пользователей/проектов &mdash; ничего не меняется в одночасье без предупреждения.
- Обеспечения поддерживаемости программного обеспечения dbt. Каждое разветвление в поведении требует дополнительного тестирования и когнитивной нагрузки, что замедляет будущее развитие. Эти флаги существуют для облегчения миграции от "текущего" к "лучшему", а не для того, чтобы оставаться навсегда.

Эти флаги проходят три фазы разработки:
1. **Введение (по умолчанию отключено):** dbt добавляет логику для поддержки как "старого", так и "нового" поведения. "Новое" поведение ограничено флагом, который по умолчанию отключен, сохраняя старое поведение.
2. **Зрелость (по умолчанию включено):** Значение флага по умолчанию переключается с `false` на `true`, включая новое поведение по умолчанию. Пользователи могут сохранить "старое" поведение и отказаться от "нового" поведения, установив флаг в `false` в своих проектах. При этом они могут видеть предупреждения о прекращении поддержки.
3. **Удаление (обычно включено):** После пометки флага как устаревшего мы удаляем его вместе с поддерживаемым им "старым" поведением из кодовой базы dbt. Мы стремимся поддерживать большинство флагов на неопределенный срок, но не обязуемся поддерживать их вечно. Если мы решим удалить флаг, мы предоставим значительное предварительное уведомление.

## Что такое изменение в поведении? {#what-is-a-behavior-change}

Один и тот же код проекта dbt и одни и те же команды dbt возвращают один результат до изменения в поведении и другой результат после изменения в поведении.

Примеры изменений в поведении:
- dbt начинает выдавать ошибку валидации, которую ранее не выдавал.
- dbt изменяет сигнатуру встроенного макроса. Ваш проект имеет пользовательскую реализацию этого макроса. Это может привести к ошибкам, так как ваша пользовательская реализация будет получать аргументы, которые она не может принять.
- Адаптер dbt переименовывает или удаляет метод, который ранее был доступен в объекте `{{ adapter }}` в контексте dbt-Jinja.
- dbt вносит критическое изменение в контрактные метаданные, удаляя обязательное поле, изменяя имя или тип существующего поля или удаляя значение по умолчанию существующего поля ([README](https://github.com/dbt-labs/dbt-core/blob/37d382c8e768d1e72acd767e0afdcb1f0dc5e9c5/core/dbt/artifacts/README.md#breaking-changes)).
- dbt удаляет одно из полей из [структурированных логов](/reference/events-logging#structured-logging).

Следующие случаи **не** являются изменениями в поведении:
- Исправление ошибки, когда предыдущее поведение было дефектным, нежелательным или недокументированным.
- dbt начинает выдавать предупреждение, которое ранее не выдавал.
- dbt обновляет язык сообщений, ориентированных на пользователя, в событиях логов.
- dbt вносит некритическое изменение в контрактные метаданные, добавляя новое поле с значением по умолчанию или удаляя поле с значением по умолчанию ([README](https://github.com/dbt-labs/dbt-core/blob/37d382c8e768d1e72acd767e0afdcb1f0dc5e9c5/core/dbt/artifacts/README.md#non-breaking-changes)).

Подавляющее большинство изменений не затрагивает поведение системы. Поскольку внедрение этих изменений не требует каких‑либо действий со стороны пользователей, они включаются в непрерывные релизы <Constant name="cloud" /> и патч‑релизы <Constant name="core" />.

В отличие от этого, миграции изменений в поведении происходят медленно, в течение нескольких месяцев, с помощью флагов изменений в поведении. Флаги слабо связаны с конкретной версией среды выполнения dbt. Устанавливая флаги, пользователи могут контролировать включение (а затем и отключение) этих изменений.

## Флаги изменений в поведении {#behavior-change-flags}

Эти флаги _должны_ быть установлены в словаре `flags` в `dbt_project.yml`. Они настраивают поведение, тесно связанное с кодом проекта, что означает, что они должны быть определены в системе контроля версий и изменены через pull или merge запросы с тем же тестированием и рецензированием.

В следующем примере показаны текущие флаги и их значения по умолчанию в последних версиях <Constant name="cloud" /> и <Constant name="core" />. Чтобы отказаться от конкретного изменения поведения, установите значение соответствующего флага в `False` в файле `dbt_project.yml`. Вы будете продолжать видеть предупреждения о устаревших поведениях, от которых вы отказались, до тех пор, пока вы не выполните одно из следующих действий:

- Решите проблему (переключив флаг на `True`)
- Заглушите предупреждения, используя флаг `warn_error_options.silence`

Вот пример доступных флагов изменений в поведении с их значениями по умолчанию:

<File name='dbt_project.yml'>

```yml
flags:
  require_explicit_package_overrides_for_builtin_materializations: True
  require_model_names_without_spaces: True
  source_freshness_run_project_hooks: True
  restrict_direct_pg_catalog_access: False
  skip_nodes_if_on_run_start_fails: False
  state_modified_compare_more_unrendered_values: False
  require_yaml_configuration_for_mf_time_spines: False
  require_batched_execution_for_custom_microbatch_strategy: False
  require_nested_cumulative_type_params: False
  validate_macro_args: False
  require_all_warnings_handled_by_warn_error: False
  require_generic_test_arguments_property: True
  require_unique_project_resource_names: False
  require_ref_searches_node_package_before_root: False
```

</File>

#### Изменения поведения dbt Core {#dbt-core-behavior-changes}

В этой таблице указано, в каком месяце трека релизов **"Latest"** в <Constant name="cloud" /> и в какой версии <Constant name="core" /> было введено изменение поведения (по умолчанию отключено) или когда оно достигло зрелости (по умолчанию включено).

| Flag                                                            | <Constant name="cloud" /> "Latest": Intro | <Constant name="cloud" /> "Latest": Maturity | <Constant name="core" />: Intro | <Constant name="core" />: Maturity |
|-----------------------------------------------------------------|------------------|---------------------|-----------------|--------------------|
| [require_explicit_package_overrides_for_builtin_materializations](#package-override-for-built-in-materialization) | 2024.04          | 2024.06             | 1.6.14, 1.7.14  | 1.8.0             |
| [require_resource_names_without_spaces](#no-spaces-in-resource-names)                           | 2024.05          | 2025.05                | 1.8.0           | 1.10.0             |
| [source_freshness_run_project_hooks](#project-hooks-with-source-freshness)                              | 2024.03          | 2025.05                | 1.8.0           | 1.10.0             |
| [skip_nodes_if_on_run_start_fails](#failures-in-on-run-start-hooks)                                | 2024.10          | TBD*                | 1.9.0           | TBD*              |
| [state_modified_compare_more_unrendered_values](#source-definitions-for-state)                   | 2024.10          | TBD*                | 1.9.0           | TBD*              |
| [require_yaml_configuration_for_mf_time_spines](#metricflow-time-spine-yaml)                  | 2024.10          | TBD*                | 1.9.0           | TBD*              |
| [require_batched_execution_for_custom_microbatch_strategy](#custom-microbatch-strategy)                  | 2024.11         | TBD*                | 1.9.0           | TBD*              |
| [require_nested_cumulative_type_params](#cumulative-metrics)         |   2024.11         | TBD*                 | 1.9.0           | TBD*            |
| [validate_macro_args](#macro-argument-validation)         | 2025.03           | TBD*                 | 1.10.0          | TBD*            | 
| [require_all_warnings_handled_by_warn_error](#warn-error-handler-for-all-warnings)         |   2025.06         | TBD*                 | 1.10.0          | TBD*            |
| [require_generic_test_arguments_property](#generic-test-arguments-property) | 2025.07 | 2025.08 | 1.10.5 | 1.10.8 |
| [require_unique_project_resource_names](#unique-project-resource-names) | 2025.12 | TBD* | 1.11.0 | TBD* |
| [require_ref_searches_node_package_before_root](#package-ref-search-order) | 2025.12 | TBD* | 1.11.0 | TBD* |

#### Изменения поведения адаптера dbt {#dbt-adapter-behavior-changes}

В этой таблице указано, какая версия адаптера dbt содержит внедрение изменения поведения (отключено по умолчанию) или его зрелость (включено по умолчанию).

| Flag                          | dbt-ADAPTER: Intro | dbt-ADAPTER: Maturity |
| ----------------------------- | ----------------------- | -------------------------- |
| [use_info_schema_for_columns](/reference/global-configs/databricks-changes#use-information-schema-for-columns) | Databricks 1.9.0                   | TBD                        |
| [use_user_folder_for_python](/reference/global-configs/databricks-changes#use-users-folder-for-python-model-notebooks)  | Databricks 1.9.0                   | TBD                        |
| [use_materialization_v2](/reference/global-configs/databricks-changes#use-restructured-materializations)      | Databricks 1.10.0                  | TBD                        |
| [enable_truthy_nulls_equals_macro](/reference/global-configs/snowflake-changes#the-enable_truthy_nulls_equals_macro-flag) | Snowflake 1.9.0 | TBD | 
| [restrict_direct_pg_catalog_access](/reference/global-configs/redshift-changes#the-restrict_direct_pg_catalog_access-flag) | Redshift 1.9.0 | TBD |
| [bigquery_use_batch_source_freshness](/reference/global-configs/bigquery-changes#bigquery-use-batch-source-freshness) | BigQuery 1.11.0rc2 | TBD |

Когда значение Maturity для <Constant name="cloud" /> равно "TBD", это означает, что мы еще не определили точную дату, когда значения по умолчанию для этих флагов изменятся. Затронутые пользователи тем временем будут видеть предупреждения об устаревании, а также получать электронные письма с заблаговременным уведомлением перед датой достижения зрелости. В это время, если вы видите предупреждение об устаревании, вы можете либо:

- Мигрируйте свой проект, чтобы он поддерживал новое поведение, а затем установите флаг в значение `True`, чтобы перестать видеть предупреждения.
- Установите флаг в значение `False`. Вы продолжите видеть предупреждения и сохраните устаревшее поведение даже после даты зрелости (когда значение по умолчанию изменится).

### Ошибки в хуках on-run-start {#failures-in-on-run-start-hooks}

Флаг по умолчанию установлен в `False`.

Установите флаг `skip_nodes_if_on_run_start_fails` в `True`, чтобы пропустить выполнение всех выбранных ресурсов, если произошла ошибка в хуке `on-run-start`.

### Определения источников для state:modified {#source-definitions-for-statemodified}

:::info

<StateModified features={'/snippets/_state-modified-compare.md'}/>

:::

Флаг по умолчанию установлен в `False`.

Установите `state_modified_compare_more_unrendered_values` в `True`, чтобы уменьшить количество ложных срабатываний во время проверок `state:modified` (особенно когда конфигурации различаются в зависимости от целевой среды, например, `prod` против `dev`).

Установка флага в `True` изменяет сравнение `state:modified` с использованием неотрендеренных значений вместо отрендеренных. Это достигается за счет сохранения `unrendered_config` во время парсинга модели и конфигураций `unrendered_database` и `unrendered_schema` во время парсинга источника.

### Переопределение пакета для встроенной материализации {#package-override-for-built-in-materialization}

Установка флага `require_explicit_package_overrides_for_builtin_materializations` в `True` предотвращает это автоматическое переопределение.

Мы прекратили поддержку поведения, при котором установленные пакеты могли переопределять встроенные материализации без вашего явного согласия. Когда этот флаг установлен в `True`, материализация, определенная в пакете, которая совпадает с именем встроенной материализации, больше не будет включена в порядок поиска и разрешения. В отличие от макросов, материализации не используют `search_order`, определенный в конфигурации проекта `dispatch`.

Встроенные материализации включают `'view'`, `'table'`, `'incremental'`, `'materialized_view'` для моделей, а также `'test'`, `'unit'`, `'snapshot'`, `'seed'` и `'clone'`.

Вы все еще можете явно переопределить встроенные материализации в пользу материализации, определенной в пакете, переосуществив встроенную материализацию в вашем корневом проекте и обернув реализацию пакета.

<File name='macros/materialization_view.sql'>

```sql
{% materialization view, snowflake %}
  {{ return(my_installed_package_name.materialization_view_snowflake()) }}
{% endmaterialization %}
```

</File>

В будущем мы можем расширить конфигурацию [`dispatch`](/reference/project-configs/dispatch-config) на уровне проекта, чтобы поддерживать список авторизованных пакетов для переопределения встроенной материализации.

### Без пробелов в именах ресурсов {#no-spaces-in-resource-names}

Флаг `require_resource_names_without_spaces` требует использования имен ресурсов без пробелов.

Имена ресурсов dbt (например, моделей) должны содержать буквы, цифры и символы подчёркивания. Мы настоятельно не рекомендуем использовать другие символы, особенно пробелы. В связи с этим поддержка пробелов в именах ресурсов объявлена устаревшей. Если флаг `require_resource_names_without_spaces` установлен в `True`, dbt будет выбрасывать исключение (вместо предупреждения об устаревании) при обнаружении пробела в имени ресурса.

<File name='models/model name with spaces.sql'>

```sql
-- Этот файл модели следует переименовать в model_name_with_underscores.sql
```

</File>

### Проектные хуки с актуальностью источников {#project-hooks-with-source-freshness}

Установите флаг `source_freshness_run_project_hooks`, чтобы включить или исключить «project hooks» ([`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end)) при выполнении команды `dbt source freshness`. По умолчанию флаг установлен в значение `True` (хуки включены).

Если у вас есть определенные проектные хуки [`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end), которые не должны выполняться до/после команды `source freshness`, вы можете добавить условную проверку в эти хуки:

<File name='dbt_project.yml'>

```yaml
on-run-start:
  - '{{ ... if flags.WHICH != 'freshness' }}'
```
</File>

### YAML для временной оси MetricFlow {#metricflow-time-spine-yaml}

Флаг `require_yaml_configuration_for_mf_time_spines` по умолчанию установлен в `False`.

В предыдущих версиях (dbt Core 1.8 и ранее) конфигурация временной оси MetricFlow хранилась в файле `metricflow_time_spine.sql`.

Когда флаг установлен в значение `True`, dbt продолжит поддерживать конфигурацию через SQL‑файлы. Когда флаг установлен в значение `False`, dbt будет выдавать предупреждение об устаревании, если обнаружит, что time spine MetricFlow настроен в блоке `config` внутри SQL‑файла.

Файл свойств MetricFlow в формате YAML должен содержать поле `time_spine:`. Подробнее см. в разделе [MetricFlow timespine](/docs/build/metricflow-time-spine).

### Стратегия пользовательских микропакетов {#custom-microbatch-strategy}

Флаг `require_batched_execution_for_custom_microbatch_strategy` по умолчанию установлен в `False` и актуален только в том случае, если у вас уже есть пользовательский макрос микропакетов в вашем проекте. Если у вас нет пользовательского макроса микропакетов, вам не нужно устанавливать этот флаг, так как dbt будет автоматически обрабатывать микропакетирование для любой модели, использующей [стратегию микропакетов](/docs/build/incremental-microbatch#how-microbatch-compares-to-other-incremental-strategies).

Установите флаг в `True`, если у вас настроен пользовательский макрос микропакетов в вашем проекте. Когда флаг установлен в `True`, dbt будет выполнять пользовательскую стратегию микропакетов пакетами.

Если у вас есть пользовательский макрос микропакетов и флаг оставлен в `False`, dbt выдаст предупреждение о прекращении поддержки.

Ранее пользователям нужно было устанавливать переменную окружения `DBT_EXPERIMENTAL_MICROBATCH` в `True`, чтобы предотвратить непреднамеренные взаимодействия с существующими пользовательскими стратегиями инкрементального обновления. Но это больше не требуется, так как установка `DBT_EXPERMINENTAL_MICROBATCH` больше не будет влиять на функциональность во время выполнения.

Метрики [типа cumulative](/docs/build/cumulative#parameters) во [выпускной ветке <Constant name="cloud" /> "Latest"](/docs/dbt-versions/cloud-release-tracks), начиная с dbt Core v1.9, должны быть вложены в поле `cumulative_type_params`. В настоящее время dbt выдает предупреждение, если cumulative-метрики вложены некорректно. Чтобы принудительно использовать новый формат (и получать ошибку вместо предупреждения), установите параметр `require_nested_cumulative_type_params` в значение `True`.

[Кумулятивные метрики](/docs/build/cumulative#parameters) вложены в поле `cumulative_type_params` в [треке "Latest" выпуска dbt Cloud](/docs/dbt-versions/cloud-release-tracks), dbt Core v1.9 и новее. В настоящее время dbt будет предупреждать пользователей, если у них неправильно вложены кумулятивные метрики. Чтобы применить новый формат (что приведет к ошибке вместо предупреждения), установите `require_nested_cumulative_type_params` в `True`.

Используйте следующую метрику, настроенную с синтаксисом до v1.9, в качестве примера:

```yaml

    type: cumulative
    type_params:
      measure: order_count
      window: 7 days

```

Если вы выполните `dbt parse` с таким синтаксисом на Core v1.9 или в [треке релизов <Constant name="cloud" /> «Latest»](/docs/dbt-versions/cloud-release-tracks), вы получите предупреждение следующего вида:

```bash
15:36:22  [WARNING]: Cumulative fields `type_params.window` and
`type_params.grain_to_date` has been moved and will soon be deprecated. Please
nest those values under `type_params.cumulative_type_params.window` and
`type_params.cumulative_type_params.grain_to_date`. See documentation on
behavior changes:
https://docs.getdbt.tech/reference/global-configs/behavior-changes
```

Это предупреждение означает, что кумулятивные поля `type_params.window` и `type_params.grain_to_date` были перемещены и в ближайшем будущем будут объявлены устаревшими. Теперь эти значения следует указывать вложенными в `type_params.cumulative_type_params.window` и `type_params.cumulative_type_params.grain_to_date`. Подробности см. в документации по изменениям поведения:  
https://docs.getdbt.tech/reference/global-configs/behavior-changes

```

Если вы установите `require_nested_cumulative_type_params` в `True` и повторно выполните `dbt parse`, вы получите ошибку, подобную следующей:

```bash

21:39:18  Кумулятивные поля `type_params.window` и `type_params.grain_to_date` должны быть вложены под `type_params.cumulative_type_params.window` и `type_params.cumulative_type_params.grain_to_date`. Неверные метрики: orders_last_7_days. См. документацию по изменениям в поведении: https://docs.getdbt.tech/reference/global-configs/behavior-changes.

```

После обновления метрики она будет работать как ожидалось:

```yaml

    type: cumulative
    type_params:
      measure:
        name: order_count
      cumulative_type_params:
        window: 7 days

```

### Macro argument validation

dbt supports optional validation for macro arguments using the `validate_macro_args` flag. By default, the `validate_macro_args` flag is set to `False`, which means that dbt won't validate the names or types of documented macro arguments.

In the past, dbt didn't enforce a standard vocabulary for the [`type`](/reference/resource-properties/arguments#type) field on macro arguments in YAML. Because of this, the `type` field was used for documentation only, and dbt didn't check that:
- the argument names matched those in your macro
- the argument types were valid or consistent with the macro's Jinja definition

Here's an example of a documented macro:
<File name='macros/filename.yml'>

```yaml

macros:
  - name: <macro name>
    arguments:
      - name: <arg name>
        type: <string>
```
</File>

When you set the `validate_macro_args` flag to `True`, dbt will:
- Check that all argument names in your YAML match those in the macro definition
- Raise warnings if the names or types don't match
- Validate that the [`type` values follow the supported format](/reference/resource-properties/arguments#supported-types).
- If no arguments are documented in the YAML, infer them from the macro and include them in the [`manifest.json` file](/reference/artifacts/manifest-json)


### Обработчик предупреждений как ошибок

By default, the `require_all_warnings_handled_by_warn_error` flag is set to `False`.

When you set `require_all_warnings_handled_by_warn_error` to `True`, all warnings raised during a run are routed through the `--warn-error` / `--warn-error-options` handler. This ensures consistent behavior when promoting warnings to errors or silencing them. When the flag is `False`, only some warnings are processed by the handler while others may bypass it.

Note that enabling this for projects that use `--warn-error` (or `--warn-error-options='{"error":"all"}'`) may cause builds to fail on warnings that were previously ignored. We recommend enabling it gradually.

<Expandable alt_header="Recommended steps to enable the flag">

We recommend the following rollout plan when setting the `require_all_warnings_handled_by_warn_error` flag to `True`:

1. Run a full build without partial parsing to surface parse-time warnings, and confirm it finishes successfully:

   ```bash
   dbt build --no-partial-parse
   ```

   - Some warnings are only emitted at parse time.
   - If the build fails because warnings are already treated as errors (via `--warn-error` or `--warn-error-options`), fix those first and re-run.
2. Review the logs:
   - If you have any warnings at this point, it means they weren't handled by `--warn-error`/`--warn-error-options`. Continue to the next step.
   - If there are no warnings, enable the flag in all environments and that's it!
3. Enable `require_all_warnings_handled_by_warn_error` in your development environment and fix any warnings that now surface as errors.
4. Enable the flag in your CI environment (if you have one) and ensure builds pass.
5. Enable the flag in your production environment.

</Expandable>

### Свойство аргументов универсального теста

dbt supports parsing key-value arguments that are inputs to generic tests when specified under the `arguments` property. In the past, dbt didn't support a way to clearly disambiguate between properties that were inputs to generic tests and framework configurations, and only accepted arguments as top-level properties.

In "Latest", the `require_generic_test_arguments_property` flag is set to `True` by default. In dbt Core versions prior to 1.10.8, the default value is `False`. Using the `arguments` property in test definitions is optional in either case.

If you do use `arguments` while the flag is `False`, dbt will recognize it but raise the `ArgumentsPropertyInGenericTestDeprecation` warning. This warning lets you know that the flag will eventually default to `True` across all releases and will be parsed as keyword arguments to the data test.

Here's an example using the new `arguments` property:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
      - dbt_utils.expression_is_true:
          arguments: 
            expression: "order_items_subtotal = subtotal"
```

</File>

Here's an example using the alternative `test_name` format:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
    - name: arbitrary_name
      test_name: dbt_utils.expression_is_true
      arguments:
         expression: "order_items_subtotal = subtotal"
      config:
        where: "1=1"
```

</File>

When you set the `require_generic_test_arguments_property` flag to `True`, dbt will:
- Parse any key-value pairs under `arguments` in generic tests as inputs to the generic test macro.
- Raise a `MissingArgumentsPropertyInGenericTestDeprecation` warning if additional non-config arguments are specified outside of the `arguments` property.

### Уникальные имена ресурсов проекта

The `require_unique_project_resource_names` flag enforces uniqueness of resource names within the same package. dbt resources such as models, seeds, snapshots, analyses, tests, and functions share a common namespace. When two resources in the same package have the same name, dbt must decide which one a `ref()` or `source()` refers to. Previously, this check was not always enforced, which meant duplicate names could result in dbt referencing the wrong resource.

The `require_unique_project_resource_names` flag is set to `False` by default. With this setting, if two unversioned resources in the same package share the same name, dbt continues to run and raises a [`DuplicateNameDistinctNodeTypesDeprecation`](/reference/deprecations#duplicatenamedistinctnodetypesdeprecation) warning. When set to `True`, dbt raises a `DuplicateResourceNameError` error.

For example, if your project contains a model and a seed named `sales`:

```
models/sales.sql
seeds/sales.csv
```

And a model contains:

```sql
select * from {{ ref('sales') }}
```

When the flag is set to `True`, dbt will raise:

```
DuplicateResourceNameError: Found resources with the same name 'sales' in package 'project': 'model.project.sales' and 'seed.project.sales'. Please update one of the resources to have a unique name.
```

When this error is raised, you should rename one of the resources, or refactor the project structure to avoid name conflicts.


### Package `ref` search order

The `require_ref_searches_node_package_before_root` flag controls the search order when dbt resolves `ref()` calls defined within a package. 

The flag is set to `False` by default in "Latest" and <Constant name="core" /> v1.11. When dbt resolves a `ref()` in a package model, it searches for the referenced model in the root project _first_, then in the package where the model is defined. 

For example, the following model in the package `my_package` is imported by the project `my_project`:

<File name='my_package/model_downstream.sql'>

```sql
select * from {{ ref('model_upstream') }}
```
</File>

By default, dbt searches for `model_upstream` in this order:
1. First in `my_project` (root project)
2. Then in `my_package` (where the model is defined)

When you set the `require_ref_searches_node_package_before_root` flag to `True`, dbt searches the package where the model is defined _before_ searching the root project.

Using the same example, dbt searches for `model_upstream` in this order:
1. First in `my_package` (where the model is defined)
2. Then in `my_project` (root project)

The current default behavior is considered a [bug in dbt-core](https://github.com/dbt-labs/dbt-core/issues/11351) because it can _potentially_ lead to unexpected dependency cycles. However, because this is long-standing behavior, changing the default requires setting `require_ref_searches_node_package_before_root` to `True` to avoid breaking existing projects. 

