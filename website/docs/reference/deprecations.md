---
title: "Устаревшие функции"
---

:::note

Устаревшая функциональность продолжает работать в релизе v1.10, однако она больше не поддерживается и будет удалена в одной из будущих версий.

Это означает, что устаревшие возможности сейчас приводят только к предупреждениям, но не блокируют выполнение команд и запусков (если только у вас не настроен режим [warnings as errors](/reference/global-configs/warnings)).

Когда соответствующая функциональность будет окончательно удалена, это приведёт к ошибкам в запусках dbt после обновления, если вы заранее не устраните причины устареваний.

:::

Во время выполнения dbt генерирует различные категории [событий](/reference/events-logging), одна из которых — _deprecations_ (устаревания). Устаревания — это особый тип предупреждений, который сообщает о проблемах в частях вашего проекта, способных привести к ломающим изменениям в будущих версиях dbt. Несмотря на то что сейчас это всего лишь предупреждения, крайне важно устранять их, чтобы в дальнейшем работать безопаснее, получать более точную обратную связь и быть уверенными в обновлениях.

## Определение предупреждений об устаревании

Поиск устареваний в стандартных логах может быть сложной задачей. Однако выявление таких предупреждений — первый шаг к их устранению. Существует несколько способов быстро найти устаревания и автоматически исправить некоторые из них.

### dbt CLI

Чтобы просмотреть устаревания через CLI, выполните команду:

```bash
dbt parse --no-partial-parse --show-all-deprecations
```

Флаг `--no-partial-parse` гарантирует, что будут включены даже те устаревания, которые обнаруживаются только на этапе парсинга. Флаг `--show-all-deprecations` обеспечивает вывод каждого случая устаревания, а не только первого.

```bash
19:15:13 [WARNING]: Deprecated functionality
Summary of encountered deprecations:
- MFTimespineWithoutYamlConfigurationDeprecation: 1 occurrence
```

### Платформа dbt

Если вы используете <Constant name="cloud" />, вы можете просматривать предупреждения об устаревании в разделе **Dashboard** вашего аккаунта.

<Lightbox src="/img/docs/dbt-cloud/deprecation-warnings.png" title="Предупреждения об устаревании на дашборде dbt." />

Откройте конкретную задачу, чтобы увидеть подробности и найти предупреждения в логах (или выполните команду `parse` с флагами из <Constant name="cloud_ide" /> или <Constant name="cloud_cli" />).

<Lightbox src="/img/docs/dbt-cloud/deprecation-list.png" title="Предупреждения об устаревании в логах." />

### Автоматическое исправление

Некоторые устаревания можно исправить автоматически с помощью скрипта. Подробнее об этом читайте в [посте блога dbt](https://www.getdbt.com/blog/how-to-get-ready-for-the-new-dbt-engine#:~:text=2.%20Resolve%20deprecation%20warnings). Вы можете [скачать скрипт](https://github.com/dbt-labs/dbt-autofix) и следовать инструкциям по установке.

**Скоро**: в IDE появится интерфейс для запуска этого же скрипта и устранения предупреждений об устаревании в <Constant name="cloud" />.

## Список предупреждений об устаревании

Ниже приведены предупреждения об устаревании, существующие в dbt на текущий момент, а также версии, в которых они появились впервые.

### ArgumentsPropertyInGenericTestDeprecation

dbt объявил устаревшей возможность указывать пользовательское свойство верхнего уровня с именем `arguments` в generic-тестах. Это предупреждение возникает только в том случае, если флаг поведения `require_generic_test_arguments_property` установлен в `False`.

#### Устранение ArgumentsPropertyInGenericTestDeprecation

Ранее в пользовательских generic-тестах могло использоваться свойство `arguments`:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
      - my_custom_generic_test:
          arguments: [1,2,3]
          expression: "order_items_subtotal = subtotal"
```

</File>

Теперь необходимо установить флаг `require_generic_test_arguments_property` в `True` и вложить все аргументы теста в новое свойство `arguments`:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
      - my_custom_generic_test:
          arguments: 
            arguments: [1,2,3]
            expression: "order_items_subtotal = subtotal"
```

</File>

В качестве альтернативы исходный ключ `arguments` можно переименовать во что‑то другое, чтобы избежать конфликта с новым ключом `arguments` во фреймворке dbt. Такое переименование также потребуется выполнить в макросе теста, и переименованный ключ всё равно должен находиться внутри свойства `arguments`, чтобы конфигурация была синтаксически корректной. Например:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
      - my_custom_generic_test:
          arguments:
            renamed_arguments: [1,2,3]
            expression: "order_items_subtotal = subtotal"
```

</File>

### ConfigDataPathDeprecation

В [dbt v1.0](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.0) параметр `data-paths` был переименован в [seed-paths](/reference/project-configs/model-paths). Получение этого предупреждения означает, что в вашем `dbt_project.yml` всё ещё используется `data-paths`.

Пример предупреждения:

<File name='CLI'>
```bash
23:14:58  [WARNING]: Deprecated functionality
The `data-paths` config has been renamed to `seed-paths`. Please update your
`dbt_project.yml` configuration to reflect this change.
```
</File>

#### Как устранить предупреждение ConfigDataPathDeprecation

Замените `data-paths` на `seed-paths` в файле `dbt_project.yml`.

### ConfigLogPathDeprecation

Начиная с [dbt v1.5](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.5), указание `log-path` в `dbt_project.yml` было признано устаревшим. Получение этого предупреждения об устаревании означает, что `log-path` всё ещё указан в вашем `dbt_project.yml` и не установлен в значение по умолчанию `logs`.

Пример:

<File name='CLI'>
```bash
23:39:18  [WARNING]: Deprecated functionality
The `log-path` config in `dbt_project.yml` has been deprecated and will no
longer be supported in a future version of dbt-core. If you wish to write dbt
logs to a custom directory, please use the --log-path CLI flag or DBT_LOG_PATH
env var instead.
```
</File>

#### Как устранить предупреждение ConfigLogPathDeprecation

Удалите `log-path` из `dbt_project.yml` и задайте его либо через CLI‑флаг `--log-path`, либо через переменную окружения `DBT_LOG_PATH`, [как описано здесь](/reference/global-configs/logs#log-and-target-paths).


### ConfigSourcePathDeprecation

Начиная с [dbt v1.0](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.0), `source-paths` было переименовано в [model-paths](/reference/project-configs/model-paths). Получение этого предупреждения об устаревании означает, что `source-paths` всё ещё используется в `dbt_project.yml` вашего проекта.

Пример:

<File name='CLI'>
```bash
23:03:47  [WARNING]: Deprecated functionality
The `source-paths` config has been renamed to `model-paths`. Please update your
`dbt_project.yml` configuration to reflect this change.
23:03:47  Registered adapter: postgres=1.9.0
```
</File>

#### Как устранить предупреждение ConfigSourcePathDeprecation

Замените `source-paths` на `model-paths` в `dbt_project.yml`.

### ConfigTargetPathDeprecation

Начиная с [dbt 1.5](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.5), указание `target-path` в `dbt_project.yml` было признано устаревшим. Получение этого предупреждения об устаревании означает, что `target-path` всё ещё указан в вашем `dbt_project.yml` и не установлен в значение по умолчанию `target`.

Пример:

<File name='CLI'>
```bash
23:22:01  [WARNING]: Deprecated functionality
The `target-path` config in `dbt_project.yml` has been deprecated and will no
longer be supported in a future version of dbt-core. If you wish to write dbt
artifacts to a custom directory, please use the --target-path CLI flag or
DBT_TARGET_PATH env var instead.
```
</File>

#### Как устранить предупреждение ConfigTargetPathDeprecation

Удалите `target-path` из `dbt_project.yml` и задайте его либо через CLI‑флаг `--target-path`, либо через переменную окружения [`DBT_TARGET_PATH`](/reference/global-configs/logs#log-and-target-paths).

### CustomKeyInConfigDeprecation

Это предупреждение возникает, когда вы используете пользовательские (custom) ключи конфигурации, которые dbt не распознаёт как часть официальной спецификации конфигураций. Это относится к конфигурационным блокам как в SQL-, так и в YAML‑файлах.

Пример, который приводит к предупреждению:

```yaml
models:
  - name: my_model
    config:
      custom_config_key: value
```

#### Как устранить предупреждение CustomKeyInConfigDeprecation

Поместите пользовательские ключи под `meta` и убедитесь, что `meta` вложен под `config` (аналогично [`PropertyMovedToConfigDeprecation`](#propertymovedtoconfigdeprecation)). Например:

```yaml
models:
  - name: my_model
    config:
      meta:
        custom_config_key: value
```

### CustomKeyInObjectDeprecation

Это предупреждение отображается, когда вы указываете конфигурацию, которую dbt не распознаёт как часть официальной спецификации конфигов. Это могут быть custom configs или определение `meta` как ключей верхнего уровня в списке `columns`.

Ранее, когда можно было определять любые дополнительные поля напрямую под `config`, это могло приводить к конфликтам между уже существующими пользовательскими конфигурациями и официальными конфигурациями фреймворка dbt.

Начиная с dbt Core v1.10 и в <Constant name="fusion_engine" />, ключи конфигурации верхнего уровня будут зарезервированы для официальных конфигураций фреймворка dbt.

import DeprecationWarnings4 from '/snippets/_deprecation-warnings.md';

<DeprecationWarnings4 />

#### Как устранить предупреждение CustomKeyInObjectDeprecation

Поместите пользовательские конфигурации под `meta` и убедитесь, что `meta` вложен под `config` (аналогично [`PropertyMovedToConfigDeprecation`](#propertymovedtoconfigdeprecation)).

Пример, который приводит к предупреждению:

```yaml
models:
  - name: my_model
    config:
      custom_config_key: value
    columns:
      - name: my_column
        meta:
          some_key: some_value
```

Пример решения:

```yaml
models:
  - name: my_model
    config:
      meta:
        custom_config_key: value
    columns:
      - name: my_column
        config:
          meta:
            some_key: some_value
```

Чтобы получить доступ к пользовательским конфигурациям, вложенным в атрибуты `meta`, используйте `config.get('meta')`, а затем обратитесь к словарю meta по имени вашего пользовательского атрибута. Пользователям нужно будет скорректировать код, который обращается к пользовательским ключам конфигурации напрямую как к ключам верхнего уровня.

Пример до того, как пользовательские конфигурации были вложены под meta:

```jinja
{% set my_custom_config = config.get('custom_config_key') %}
```

После того как конфигурации будут вложены:

```jinja
{% set my_custom_config = config.get('meta').custom_config_key %}
```


### CustomOutputPathInSourceFreshnessDeprecation

dbt признал устаревшим флаг `--output` (или `-o`) для переопределения пути, куда записываются результаты source freshness вместо назначения файла `sources.json`.

#### Как устранить предупреждение CustomOutputPathInSourceFreshnessDeprecation

Уберите флаг `--output` или `-o` и связанную с ним конфигурацию пути из любых job, которые запускают команды dbt source freshness.
Альтернативы для изменения расположения только результатов source freshness нет. Однако вы по‑прежнему можете использовать `--target-path`, чтобы записывать _все_ артефакты шага в кастомное место.

### CustomTopLevelKeyDeprecation

Это предупреждение информирует пользователей о том, что они используют пользовательские ключи верхнего уровня в YAML‑файлах, которые не поддерживаются dbt.

import DeprecationWarnings from '/snippets/_deprecation-warnings.md';

<DeprecationWarnings />

#### Как устранить предупреждение CustomTopLevelKeyDeprecation

Переместите пользовательские ключи верхнего уровня в ваших YAML‑файлах под `config.meta`.

Например, когда вы используете пользовательский ключ верхнего уровня, такой как `custom_metdata`:

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    staging:
      +materialized: view
    marts:
      +materialized: table

custom_metadata:
  owner: "data_team"
  description: "This project contains models for our analytics platform"
  last_updated: "2025-07-01"
```

</File>

Вам следует переместить этот ключ под `config.meta`:

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    staging:
      +materialized: view
    marts:
      +materialized: table

config:
  meta:
    custom_metadata:
      owner: "data_team"
      description: "This project contains models for our analytics platform"
      last_updated: "2025-07-01"
```

</File>

### DuplicateNameDistinctNodeTypesDeprecation

dbt выдаёт это предупреждение, когда два неверсионированных ресурса в одном пакете имеют одно и то же имя (например, model и seed, оба с именем `sales`), а флаг `require_unique_project_resource_names` установлен в `False`. Раньше dbt не всегда обнаруживал такие конфликты имён, из‑за чего дублирующиеся имена иногда могли указывать не на тот ресурс.

Когда флаг `require_unique_project_resource_names` установлен в `True`, dbt выбрасывает ошибку `DuplicateResourceNameError`. Подробнее см. [Unique project resource names](/reference/global-configs/behavior-changes#unique-project-resource-names).

#### Как устранить предупреждение DuplicateNameDistinctNodeTypesDeprecation

Переименуйте один из конфликтующих ресурсов, чтобы все имена были уникальными.

### DuplicateYAMLKeysDeprecation

Это предупреждение возникает, когда в `profiles.yml` существуют два одинаковых ключа.

Ранее, если одинаковые ключи присутствовали в [файле `profiles.yml`](/docs/core/connect-data-platform/profiles.yml), dbt использовал последнюю конфигурацию, указанную в файле.

<File name='profiles.yml'>

```yml

my_profile:
  target: 
  outputs:
...

my_profile: # dbt would use this profile key
  target: 
  outputs:
...
```
</File>

Обратите внимание: в одной из будущих версий dbt перестанет поддерживать дублирующиеся ключи с «тихим» перезаписыванием.

#### Как устранить предупреждение DuplicateYAMLKeysDeprecation

Удалите дублирующиеся ключи из файла `profiles.yml`.

### EnvironmentVariableNamespaceDeprecation

Это предупреждение возникает, когда вы используете переменные окружения, которые конфликтуют с зарезервированным пространством имён dbt `DBT_ENGINE`. Ранее и внутренние переменные dbt, и пользовательские переменные использовали префикс `DBT_`. Если переменная окружения, определённая в dbt, сталкивается с пользовательской переменной окружения, проект может сломаться.

Теперь все новые переменные окружения dbt имеют префикс `DBT_ENGINE`, чтобы предотвратить конфликты имён и минимизировать неудобства для пользователей.

#### EnvironmentVariableNamespaceDeprecation

Проверьте ваши пользовательские переменные окружения и убедитесь, что они не конфликтуют с зарезервированным пространством имён dbt `DBT_ENGINE`.

### ExposureNameDeprecation

Начиная с [dbt 1.3](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.3#new-and-changed-documentation), dbt начал разрешать только буквы, цифры и подчёркивания в свойстве `name` у [exposures](/reference/exposure-properties).

Пример:

<File name='CLI'>
```bash
23:55:00  [WARNING]: Deprecated functionality
Starting in v1.3, the 'name' of an exposure should contain only letters,
numbers, and underscores. Exposures support a new property, 'label', which may
contain spaces, capital letters, and special characters. stg_&customers does not
follow this pattern. Please update the 'name', and use the 'label' property for
a human-friendly title. This will raise an error in a future version of
dbt-core.
```
</File>

#### Как устранить предупреждение ExposureNameDeprecation

Убедитесь, что имена ваших exposures содержат только буквы, цифры и подчёркивания. Более человекочитаемое имя можно указать в свойстве [`label`](/reference/exposure-properties#overview) у exposures.

### GenericJSONSchemaValidationDeprecation


Этот тип устаревания — «универсальный» (catch-all) / запасной вариант. dbt пытается обрабатывать все ошибки валидации JSON Schema через конкретные типы deprecation events, но возможно, мы что-то упустили. «Упустить что-то» означает, что либо dbt не обработал конкретный случай через deprecation event, _либо_ JSON Schema некорректна в каком-то месте.

#### Как устранить предупреждение GenericJSONSchemaValidationDeprecation

Если вы видите это предупреждение, к сожалению, сейчас вы мало что можете сделать, но мы продолжаем работать над тем, чтобы уменьшить количество таких случаев. Если вам нужна помощь с конкретным случаем, пожалуйста, [обратитесь в поддержку](mailto:support@getdbt.com) (доступно для клиентов dbt platform в облаке) или в [community Slack](https://www.getdbt.com/community) (для пользователей dbt Core).

### MFCumulativeTypeParamsDeprecation

Начиная с dbt [v1.9](/docs/dbt-versions/core-upgrade/upgrading-to-v1.9), прямое указание `window` и `time_to_grain` в `type_params` у [metric](/reference/global-configs/behavior-changes#cumulative-metrics) стало устаревшим.

Пример:

<File name='CLI'>
```bash
15:36:22  [WARNING]: Cumulative fields `type_params.window` and
`type_params.grain_to_date` has been moved and will soon be deprecated. Please
nest those values under `type_params.cumulative_type_params.window` and
`type_params.cumulative_type_params.grain_to_date`. See documentation on
behavior changes:
https://docs.getdbt.tech/reference/global-configs/behavior-changes.
```
</File>

#### Как устранить предупреждение MFCumulativeTypeParamsDeprecation

Переместите `window` и `time_to_grain` под свойство `cumulative_type_params` внутри `type_params` у соответствующей metric.

### MFTimespineWithoutYamlConfigurationDeprecation

До dbt v1.9 конфигурация time spine для MetricFlow хранилась в файле `metricflow_time_spine.sql`. В [v1.9](/docs/dbt-versions/core-upgrade/upgrading-to-v1.9) dbt представил [YAML‑определение timespine](/docs/build/metricflow-time-spine#configuring-time-spine-in-yaml) для MetricFlow, и затем было решено, что дальше это будет стандартом. Если вы видите это предупреждение об устаревании, значит у вас нет YAML‑определения timespine для MetricFlow.

Пример:

<File name='CLI'>
```bash
19:56:41  [WARNING]: Time spines without YAML configuration are in the process of
deprecation. Please add YAML configuration for your 'metricflow_time_spine'
model. See documentation on MetricFlow time spines:
https://docs.getdbt.tech/docs/build/metricflow-time-spine and behavior change
documentation:
https://docs.getdbt.tech/reference/global-configs/behavior-changes
```
</File>

#### Как устранить предупреждение MFTimespineWithoutYamlConfigurationDeprecation

Определите timespine для MetricFlow в [YAML](/docs/build/metricflow-time-spine#creating-a-time-spine-table).

### MissingArgumentsPropertyInGenericTestDeprecation

dbt признал устаревшим указание именованных аргументов (keyword arguments) как свойств в пользовательских generic data tests или в data tests, которые используют [альтернативный формат `test_name`](/docs/reference/resource-properties/data-tests.md#alternative-format-for-defining-tests). Вместо этого аргументы тестов следует указывать под новым свойством `arguments`.

Это предупреждение об устаревании появляется только когда флаг поведения `require_generic_test_arguments_property` установлен в `True`.


#### Как устранить предупреждение MissingArgumentsPropertyInGenericTestDeprecation

Если ранее вы задавали аргументы как свойства верхнего уровня в пользовательских generic tests:


<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
      - dbt_utils.expression_is_true:
          expression: "order_items_subtotal = subtotal"
```

</File>

Или при использовании альтернативного формата `test_name`:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
    - name: arbitrary_name
      test_name: dbt_utils.expression_is_true
      expression: "order_items_subtotal = subtotal"
      where: "1=1"
```

</File>

Теперь вам нужно помещать аргументы под `arguments`, а конфигурации фреймворка — под `config`:

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

Или с конфигурациями фреймворка:

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

### MissingPlusPrefixDeprecation

import MissingPrefix from '/snippets/_missing-prefix.md';

<MissingPrefix />

Example: 
<File name='CLI'>
```bash
18:16:06  [WARNING][MissingPlusPrefixDeprecation]: Deprecated functionality
Missing '+' prefix on `tags` found at `my_path.sub_path.another_path.tags` in
file `dbt_project.yml`. Hierarchical config
values without a '+' prefix are deprecated in dbt_project.yml.
```
</File>

import DeprecationWarnings2 from '/snippets/_deprecation-warnings.md';

<DeprecationWarnings2 />

#### Как устранить предупреждение MissingPlusPrefixDeprecation

Если ранее вы задавали одну из затронутых конфигураций без префикса `+`, например `materialized`:

<File name='dbt_project.yml'>

```yaml
models: 
  marts:
    materialized: table
```

</File>

Теперь вам нужно задавать её с префиксом `+`, чтобы однозначно различать пути:

<File name='dbt_project.yml'>

```yaml
models: 
  marts:
    +materialized: table
```

</File>

### ModelParamUsageDeprecation

Флаг `--models` / `--model` / `-m` был переименован в `--select` / `--s` ещё в dbt Core v0.21 (октябрь 2021). «Тихое» пропускание этого флага означает игнорирование критериев выбора в вашей команде, из‑за чего может собраться весь DAG, хотя вы хотели выбрать только небольшой поднабор. Поэтому флаг `--models` / `--model` / `-m` будет выдавать предупреждение в dbt Core v1.10 и ошибку в Fusion. Пожалуйста, обновите определения ваших job соответствующим образом.

#### Как устранить предупреждение ModelParamUsageDeprecation

Обновите определения job: уберите флаг `--models` / `--model` / `-m` и замените его на `--select` / `--s`.

### ModulesItertoolsUsageDeprecation

dbt признал устаревшим использование `modules.itertools` в Jinja.

Пример:

<File name='CLI'>
```bash
15:49:33  [WARNING]: Deprecated functionality
Usage of itertools modules is deprecated. Please use the built-in functions
instead.
```
</File>


#### Как устранить предупреждение ModulesItertoolsUsageDeprecation

Если вы сейчас используете функции из модуля `itertools` в Jinja SQL‑шаблонах, вместо этого используйте доступные встроенные [функции dbt](/reference/dbt-jinja-functions) и [методы Jinja](/docs/build/jinja-macros).

Например, следующий SQL‑файл:

<File name='models/itertools_usage.sql'>

```sql
{%- set A = [1, 2] -%}
{%- set B = ['x', 'y', 'z'] -%}
{%- set AB_cartesian = modules.itertools.product(A, B) -%}

{%- for item in AB_cartesian %}
  {{ item }}
{%- endfor -%}
```

</File>

Его следует переписать, используя альтернативные встроенные Jinja‑методы dbt. Например:


<File name='macros/cartesian_product.sql'>

```sql
{%- macro cartesian_product(list1, list2) -%}
  {%- set result = [] -%}
  {%- for item1 in list1 -%}
    {%- for item2 in list2 -%}
      {%- set _ = result.append((item1, item2)) -%}
    {%- endfor -%}
  {%- endfor -%}
  {{ return(result) }}
{%- endmacro -%}
```

</File>

<File name='models/itertools_usage.sql'>

```sql
{%- set A = [1, 2] -%}
{%- set B = ['x', 'y', 'z'] -%}
{%- set AB_cartesian = cartesian_product(A, B) -%}

{%- for item in AB_cartesian %}
  {{ item }}
{%- endfor -%}
```

</File>

### PackageInstallPathDeprecation

Расположение по умолчанию, куда устанавливаются пакеты при запуске `dbt deps`, было изменено с `dbt_modules` на `dbt_packages`. Во время выполнения `dbt clean` dbt обнаружил, что `dbt_modules` указан в свойстве [clean-targets](/reference/project-configs/clean-targets) в `dbt_project.yml`, хотя `dbt_modules` не является значением [`packages-install-path`](/reference/project-configs/packages-install-path).

Пример:

<File name='CLI'>
```bash
22:48:01  [WARNING]: Deprecated functionality
The default package install path has changed from `dbt_modules` to
`dbt_packages`. Please update `clean-targets` in `dbt_project.yml` and
check `.gitignore`. Or, set `packages-install-path: dbt_modules`
If you'd like to keep the current value.
```
</File>

#### Как устранить предупреждение PackageInstallPathDeprecation

Рекомендуемые подходы:
1. Замените `dbt_modules` на `dbt_packages` в спецификации `clean-targets` (и в `.gitignore`).
2. Установите `packages-install-path: dbt_modules`, если вы хотите продолжать устанавливать пакеты в `dbt_modules`.

### PackageMaterializationOverrideDeprecation

Устаревает поведение, при котором установленные пакеты могли переопределять встроенные материализации без явного подтверждения (opt-in) с вашей стороны. Установка флага [`require_explicit_package_overrides_for_builtin_materializations`](/reference/global-configs/behavior-changes#package-override-for-built-in-materialization) в `false` в `dbt_project.yml` позволяла пакетам, совпадающим по имени со встроенной материализацией, продолжать участвовать в порядке поиска и разрешения.

#### Как устранить предупреждение PackageMaterializationOverrideDeprecation

Явно переопределите встроенные материализации в пользу материализации, определённой в пакете: переимплементируйте встроенную материализацию в вашем корневом проекте и оберните реализацию из пакета.

Например:

```jinja

{% materialization table, snowflake %}
    {{ return (package_name.materialization_table_snowflake()) }}
{% endmaterialization %}

```

После того как вы добавите override для вашего пакета, удалите флаг `require_explicit_package_overrides_for_builtin_materializations: false` из `dbt_project.yml`, чтобы устранить предупреждение.

### PackageRedirectDeprecation

Это предупреждение об устаревании означает, что пакет, который сейчас используется в вашем проекте и указан в `packages.yml`, был переименован. Обычно это происходит, когда меняется владелец пакета или его область применения. Вероятно, пакет, на который сейчас ссылается ваш `packages.yml`, больше не поддерживается активно (поскольку разработка переехала на новое имя пакета), и в какой‑то момент пакет со старым именем перестанет работать с dbt.

<File name='CLI'>
```bash
22:31:38  [WARNING]: Deprecated functionality
The `fishtown-analytics/dbt_utils` package is deprecated in favor of
`dbt-labs/dbt_utils`. Please update your `packages.yml` configuration to use
`dbt-labs/dbt_utils` instead.
```
</File>

#### Как устранить предупреждение PackageRedirectDeprecation

Начните ссылаться на новый пакет в `packages.yml` вместо старого пакета.

### ProjectFlagsMovedDeprecation

Свойство `config`, которое можно было настраивать в `profiles.yml`, было признано устаревшим в пользу `flags` в `dbt_project.yaml`. Если вы видите это предупреждение об устаревании, значит dbt обнаружил свойство `config` в вашем `profiles.yml`.

Пример:

<File name='CLI'>
```bash
00:08:12  [WARNING]: Deprecated functionality
User config should be moved from the 'config' key in profiles.yml to the 'flags' key in dbt_project.yml.
```
</File>

#### Как устранить предупреждение ProjectFlagsMovedDeprecation

Удалите `config` из `profiles.yml`. Перенесите любые прежние настройки [`config`](/reference/global-configs/about-global-configs) из `profiles.yml` в `flags` в `dbt_project.yml`.

### PropertyMovedToConfigDeprecation

Некоторые исторические properties полностью переходят в configs.

Сюда входят: `freshness`, `meta`, `tags`, `docs`, `group` и `access`.

Перевод некоторых properties в configs полезен тем, что вы можете задавать их сразу для многих ресурсов в `dbt_project.yml` (дефолты на уровне проекта/папок). Подробнее о разнице между properties и configs — [здесь](/reference/configs-and-properties).

#### Как устранить предупреждение PropertyMovedToConfigDeprecation

Если ранее вы задавали одно из затронутых properties, например `freshness`:

```yaml

sources: 
  - name: ecom
    schema: raw
    description: E-commerce data for the Jaffle Shop
    freshness:
      warn_after:
        count: 24
        period: hour

```

Теперь вам нужно задавать это под `config`:

```yaml

sources: 
  - name: ecom
    schema: raw
    description: E-commerce data for the Jaffle Shop
    config:
      freshness:
        warn_after:
          count: 24
          period: hour

```

### ResourceNamesWithSpacesDeprecation

Начиная с [dbt 1.8](/docs/dbt-versions/core-upgrade/upgrading-to-v1.8#managing-changes-to-legacy-behaviors), использование пробелов в именах ресурсов было признано устаревшим. Если вы получаете это предупреждение об устаревании, значит dbt обнаружил имя ресурса с пробелом.

Пример:

<File name='CLI'>
```bash
16:37:58  [WARNING]: Found spaces in the name of `model.jaffle_shop.stg supplies`
```
</File>

#### Как устранить предупреждение ResourceNamesWithSpacesDeprecation

Переименуйте ресурс-нарушитель, чтобы в его имени больше не было пробела.

### SourceFreshnessProjectHooksNotRun

Если вы видите это, значит флаг поведения `source_freshness_run_project_hooks` установлен в `false`, и при этом определён `on-run-start` или `on-run-end` ([документация](/reference/global-configs/behavior-changes#project-hooks-with-source-freshness)). Ранее project hooks не выполнялись для sources при запуске `dbt source freshness`.

Пример:

<File name='CLI'>
```bash
19:51:56  [WARNING]: In a future version of dbt, the `source freshness` command
will start running `on-run-start` and `on-run-end` hooks by default. For more
information: https://docs.getdbt.tech/reference/global-configs/legacy-behaviors
```
</File>

#### Как устранить предупреждение SourceFreshnessProjectHooksNotRun

Установите `source_freshness_run_project_hooks` в `true`. Инструкции о том, как пропускать project hooks при вызове `dbt source freshness`, см. в [документации по изменениям поведения](/reference/global-configs/behavior-changes#project-hooks-with-source-freshness).

### SourceOverrideDeprecation

Свойство `overrides` для sources признано устаревшим.

import DeprecationWarnings3 from '/snippets/_deprecation-warnings.md';

<DeprecationWarnings3 />

#### Как устранить предупреждение SourceOverrideDeprecation

Удалите свойство `overrides` и вместо этого [включайте или отключайте source](/reference/source-configs.md#configuring-sources) из пакета.

### UnexpectedJinjaBlockDeprecation

Если у вас есть неожиданный Jinja‑блок — «сиротский» Jinja‑блок или Jinja‑блок вне контекста макроса — вы получите предупреждение, и в будущей версии dbt перестанет поддерживать неожиданные Jinja‑блоки. Ранее такие Jinja‑блоки «тихо» игнорировались.

<File name='macros/my_macro.sql'>

```sql

{% endmacro %} # orphaned endmacro jinja block

{% macro hello() %}
hello!
{% endmacro %}

```
</File>

#### Как устранить предупреждение UnexpectedJinjaBlockDeprecation

Удалите неожиданные Jinja‑блоки.

### WEOIncludeExcludeDeprecation

Опции `include` и `exclude` для `warn_error_options` признаны устаревшими и заменены на `error` и `warn` соответственно.

#### Как устранить предупреждение WEOIncludeExcludeDeprecation

Везде, где настроен `warn_error_options`, замените:
- `include` на `error`
- `exclude` на `warn`

Например:

```yaml
...
  flags:
    warn_error_options:
      include:
        - NoNodesForSelectionCriteria
```

Теперь это нужно настраивать так:

```yaml
...
  flags:
    warn_error_options:
      error:
        - NoNodesForSelectionCriteria
```
