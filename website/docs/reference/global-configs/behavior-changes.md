---
title: "Об изменениях поведения"
id: "behavior-changes"
sidebar: "Об изменениях поведения"
description: "Флаги изменения поведения позволяют управлять тем, когда переходить на новое поведение dbt во время выполнения."
---

Изменение поведения — это намеренное обновление dbt, после которого тот же код проекта и те же команды дают другой результат. Например, появляется новая ошибка валидации, меняется сигнатура макроса или нарушается совместимость артефактов или структурированных журналов. Исправления ошибок, новые предупреждения и обратно совместимые дополнения к таким изменениям не относятся.

dbt вводит эти изменения с помощью флагов изменения поведения, чтобы вы могли сами решать, когда переходить на новое поведение.

Примеры изменений поведения:
- dbt начинает выдавать _ошибку_ валидации, которую раньше не выдавал.
- dbt изменяет сигнатуру встроенного макроса. В вашем проекте есть собственная реализация этого макроса. Это может привести к ошибкам, поскольку в вашу реализацию будут передаваться аргументы, которые она не может принять.
- Адаптер dbt переименовывает или удаляет метод, который ранее был доступен у объекта `{{ adapter }}` в контексте dbt-Jinja.

Следующие изменения *не считаются* изменениями поведения:
- Исправление ошибки, из-за которой прежнее поведение было некорректным, нежелательным или недокументированным.
- dbt начинает выдавать _предупреждение_, которое раньше не выдавал.
- dbt обновляет формулировки сообщений для пользователей в событиях журнала.

## Флаги изменений в поведении {#behavior-change-flags}

Эти флаги _должны_ быть установлены в словаре `flags` в `dbt_project.yml`. Они настраивают поведение, тесно связанное с кодом проекта, что означает, что они должны быть определены в системе контроля версий и изменены через pull или merge запросы с тем же тестированием и рецензированием.

### Жизненный цикл флагов

Флаги изменения поведения проходят три этапа развития:

1. **Введение (отключён по умолчанию):** dbt добавляет логику для поддержки как «старого», так и «нового» поведения. «Новое» поведение управляется флагом, который по умолчанию отключён, что сохраняет старое поведение.
2. **Зрелость (включён по умолчанию):** Значение флага по умолчанию меняется, и новое поведение становится поведением по умолчанию. Вы по-прежнему можете сохранить старое поведение, но при этом могут появляться предупреждения о прекращении его поддержки.
3. **Удаление (новое поведение включено всегда):** Старое поведение удаляется из кодовой базы dbt. Большинство флагов поддерживаются бессрочно, но обязательств поддерживать их вечно нет. Об удалении флага будет объявлено заблаговременно.

### Введены в <Constant name="core_v1" />

В этой таблице указано, в каком месяце в канале выпусков **v1 Latest** в <Constant name="dbt" /> и в какой версии <Constant name="core" /> изменение поведения было введено (отключено по умолчанию) или достигло зрелости (включено по умолчанию). Флаги, отмеченные значением 2.0 в столбце **Удаление**, удалены в dbt v2, и новое поведение включено всегда.

| Флаг | **v1 Latest**: Введение | **v1 Latest**: Зрелость | <Constant name="core" />: Введение | <Constant name="core" />: Зрелость |  Удаление |
|-----------------------------------------------------------------|------------------|---------------------|-----------------|--------------------|----|
| [require_explicit_package_overrides_for_builtin_materializations](/reference/global-configs/behavior-flags/require_explicit_package_overrides_for_builtin_materializations) | 2024.04 | 2024.06 | 1.6.14, 1.7.14 | 1.8.0 | 2.0 |
| [require_resource_names_without_spaces](/reference/global-configs/behavior-flags/require_resource_names_without_spaces) | 2024.05 | 2025.05 | 1.8.0 | 1.10.0 | 2.0 |
| [source_freshness_run_project_hooks](/reference/global-configs/behavior-flags/source_freshness_run_project_hooks) | 2024.03 | 2025.05 | 1.8.0 | 1.10.0 | 2.0 |
| [skip_nodes_if_on_run_start_fails](/reference/global-configs/behavior-flags/skip_nodes_if_on_run_start_fails) | 2024.10 | 2026.09 | 1.9.0 | 1.12.0 | 2.0 |
| [state_modified_compare_more_unrendered_values](/reference/global-configs/behavior-flags/state_modified_compare_more_unrendered_values) | 2024.10 | 2026.09 | 1.9.0 | 1.12.0 | 2.0 |
| [require_yaml_configuration_for_mf_time_spines](/reference/global-configs/behavior-flags/require_yaml_configuration_for_mf_time_spines) | 2024.10 | 2026.09 | 1.9.0 | 1.12.0 | 2.0 |
| [require_batched_execution_for_custom_microbatch_strategy](/reference/global-configs/behavior-flags/require_batched_execution_for_custom_microbatch_strategy) | 2024.11 | 2026.09 | 1.9.0 | 1.12.0 | 2.0 |
| [require_nested_cumulative_type_params](/reference/global-configs/behavior-flags/require_nested_cumulative_type_params) | 2024.11 | 2026.09 | 1.9.0 | 1.12.0 | 2.0 |
| [enable_truthy_nulls_equals_macro](/reference/global-configs/behavior-flags/enable_truthy_nulls_equals_macro) | 2025.02 | - | 1.9.0 | - | - |
| [validate_macro_args](/reference/global-configs/behavior-flags/validate_macro_args) | 2025.03 | 2026.09 | 1.10.0 | 1.12.0 | - |
| [require_all_warnings_handled_by_warn_error](/reference/global-configs/behavior-flags/require_all_warnings_handled_by_warn_error) | 2025.06 | 2026.09 | 1.10.0 | 1.12.0 | - |
| [require_generic_test_arguments_property](/reference/global-configs/behavior-flags/require_generic_test_arguments_property) | 2025.07 | 2025.08 | 1.10.5 | 1.10.8 | - |
| [require_unique_project_resource_names](/reference/global-configs/behavior-flags/require_unique_project_resource_names) | 2025.12 | - | 1.11.0 | - | - |
| [require_ref_searches_node_package_before_root](/reference/global-configs/behavior-flags/require_ref_searches_node_package_before_root) | 2025.12 | - | 1.11.0 | - | - |
| [require_valid_schema_from_generate_schema_name](/reference/global-configs/behavior-flags/require_valid_schema_from_generate_schema_name) | 2026.1 | - | 1.12.0a1 | - | - |
| [require_sql_header_in_test_configs](/reference/global-configs/behavior-flags/require_sql_header_in_test_configs) | 2026.3 | - | 1.12.0 | - | - |
| [require_corrected_analysis_fqns](/reference/global-configs/behavior-flags/require_corrected_analysis_fqns) | 2026.3 | - | 1.12.0 | - | - |
| [require_source_and_semantic_model_names_without_spaces](/reference/global-configs/behavior-flags/require_source_and_semantic_model_names_without_spaces) | 2026.4 | - | 1.12.0 | - | - |
| [allow_jinja_file_extensions](/reference/global-configs/behavior-flags/allow_jinja_file_extensions) | 2026.5 | - | 1.12.0 | - | - |
| [latest_version_pointer_enabled_by_default](/reference/global-configs/behavior-flags/latest_version_pointer_enabled_by_default) | 2026.5 | - | 1.12.0 | - | - |

### Введены в <Constant name="fusion" /> {#introduced-in-dbt-v2}

Следующие флаги предназначены только для <Constant name="fusion" /> и не имеют аналогов в <Constant name="core" />. Они настраиваются так же — в блоке `flags:` файла `dbt_project.yml`.

| Флаг | Адаптер | Значение по умолчанию | Введение | Становится значением по умолчанию |
|---|---|---|---|---|
| [require_resource_names_without_plus_prefix](/reference/global-configs/behavior-flags/require_resource_names_without_plus_prefix) | Все | `false` | 2.0.0-preview.208 | Пока не определено |
| [use_catalogs_v2](/docs/build/iceberg/catalogs-yml?version=2#new-spec-recommended-) | Все | `true` | 2.0.0-preview.174 | 2.0.0 |
| bigquery_noop_alter_relation_comment | BigQuery | `false` | 2.0.0-preview.124 | Пока не определено |


### Флаги изменения поведения для отдельных адаптеров

В этой таблице указано, в какой версии адаптера dbt изменение поведения было введено (отключено по умолчанию) или достигло зрелости (включено по умолчанию). Флаги, отмеченные значением 2.0 в столбце **Удаление**, удалены в dbt v2, и новое поведение включено всегда.

| Флаг | dbt-ADAPTER: Введение | dbt-ADAPTER: Зрелость | Удаление |
| ----------------------------- | ----------------------- | -------------------------- |-----------------|
| [use_info_schema_for_columns](/reference/global-configs/databricks-changes#use-information-schema-for-columns) | Databricks 1.9.0 | - | 2.0 |
| [use_user_folder_for_python](/reference/global-configs/databricks-changes#use-users-folder-for-python-model-notebooks) | Databricks 1.9.0 | - | 2.0 |
| [use_managed_iceberg](/reference/global-configs/databricks-changes#use-managed-iceberg) | Databricks 1.11.0 | 1.12.0 | - |
| [use_materialization_v2](/reference/global-configs/databricks-changes#use-restructured-materializations) | Databricks 1.10.0 | - | - |
| [use_replace_on_for_insert_overwrite](/reference/global-configs/databricks-changes#use-replace-on-for-insert_overwrite-strategy) | Databricks 1.11.0 | 1.11.0 | - |
| [use_describe_as_json_for_relation_metadata](/reference/global-configs/databricks-changes#use-describe-as-json-for-relation-metadata) | Databricks 1.12.0 | - | - |
| [redshift_skip_autocommit_transaction_statements](/reference/global-configs/redshift-changes#redshift_skip_autocommit_transaction_statements-flag) | Redshift 1.12.0 | - | - |
| [bigquery_use_batch_source_freshness](/reference/global-configs/bigquery-changes#the-bigqueryusebatchsourcefreshness-flag) | BigQuery 1.11.0rc2 | - | - |
| [bigquery_reject_wildcard_metadata_source_freshness](/reference/global-configs/bigquery-changes#the-bigquery_reject_wildcard_metadata_source_freshness-flag) | BigQuery 1.12.0 | - | - |
| [bigquery_use_standard_sql_for_partitions](/reference/global-configs/bigquery-changes#the-bigquery_use_standard_sql_for_partitions-flag) | BigQuery 1.12.0 | 1.12.0 | - |
| [snowflake_default_transient_dynamic_tables](/reference/global-configs/snowflake-changes#the-snowflake_default_transient_dynamic_tables-flag) | Snowflake 1.12.0 | - | - |

## Часто задаваемые вопросы

<Expandable alt_header="Как настроить флаги изменения поведения в моём проекте?" >

В следующем примере показаны текущие флаги и их текущие значения по умолчанию в последних версиях <Constant name="dbt" /> и <Constant name="core" />. Чтобы отказаться от определённого изменения поведения, задайте для соответствующего флага значение `false` в `dbt_project.yml`. Предупреждения об использовании устаревшего поведения, сохранённого при отказе от изменений, будут появляться до тех пор, пока вы не выполните одно из следующих действий:

- Устраните проблему (переключив флаг на `true`)
- Отключите предупреждения с помощью флага `warn_error_options.silence`
<File name='dbt_project.yml'>

```yml
flags:
  require_explicit_package_overrides_for_builtin_materializations: true
  require_resource_names_without_spaces: true
  source_freshness_run_project_hooks: true
  skip_nodes_if_on_run_start_fails: true
  state_modified_compare_more_unrendered_values: true
  require_yaml_configuration_for_mf_time_spines: true
  require_batched_execution_for_custom_microbatch_strategy: true
  require_nested_cumulative_type_params: true
  validate_macro_args: true
  require_all_warnings_handled_by_warn_error: true
  require_generic_test_arguments_property: true
  require_unique_project_resource_names: false
  require_ref_searches_node_package_before_root: false
  require_valid_schema_from_generate_schema_name: false
  enable_truthy_nulls_equals_macro: false
  require_sql_header_in_test_configs: false
  require_corrected_analysis_fqns: false
  require_source_and_semantic_model_names_without_spaces: false
  allow_jinja_file_extensions: false
  latest_version_pointer_enabled_by_default: false
```

</File>

</Expandable>

<Expandable alt_header="Что означает отсутствие даты погашения? ">

Если дата вступления в силу ещё не назначена (в таблице стоит прочерк), точная дата смены значения флага по умолчанию пока неизвестна. До этого пользователи будут видеть предупреждения об устаревании и заранее получат уведомление по электронной почте. Если вы видите такое предупреждение, можно:

- Обновить проект для работы с новым поведением и установить флаг в `true`, чтобы отключить предупреждения.
- Явно установить флаг в `false`. Предупреждения останутся, но прежнее поведение сохранится даже после смены значения флага по умолчанию.

</Expandable>

<Expandable alt_header="Чем флаги изменения поведения отличаются от других изменений?">

Флаги изменения поведения следует отличать от других изменений dbt:
- [Предупреждения об устаревании](/reference/deprecations) сообщают о конструкциях в коде проекта, которые перестанут работать. Флаги поведения часто определяют, когда такие предупреждения станут ошибками.
- [Устаревшие флаги CLI](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2#deprecated-flags) — параметры командной строки, которые удаляются в v2.

Краткое сравнение приведено в разделе [Обзор изменений](/reference/changes-overview).

Если вы переходите на [v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2), некоторые флаги изменения поведения удалены, а соответствующее им новое поведение всегда включено.

</Expandable>
