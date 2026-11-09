---
description: "Справочное руководство по настройке файла dbt_project.yml."
intro_text: "Файл dbt_project.yml является обязательным для всех проектов dbt. Он содержит важную информацию, которая сообщает dbt, как работать с вашим проектом."
---

Каждому [проекту dbt](/docs/build/projects) необходим файл `dbt_project.yml` — именно по нему dbt определяет, что каталог является проектом dbt. Кроме того, в этом файле содержится важная информация, которая сообщает dbt, как именно работать с вашим проектом. Принцип работы следующий:

- dbt использует [YAML](https://yaml.org/) в нескольких местах. Если вы ещё не знакомы с YAML, стоит изучить, как в нём представляются массивы, словари и строки.
- По умолчанию dbt ищет `dbt_project.yml` в текущем рабочем каталоге и его родительских каталогах, но вы можете указать другой каталог с помощью флага `--project-dir` или переменной окружения <VersionBlock lastVersion="1.10">`DBT_PROJECT_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROJECT_DIR`</VersionBlock>.
- Укажите идентификатор проекта <Constant name="dbt" /> в файле `dbt_project.yml` с помощью параметра `project-id` в [блоке конфигурации `dbt-cloud`](/reference/dbt_cloud.yml#the-dbt-cloud-block-in-dbt_projectyml). Идентификатор проекта можно найти в URL вашего проекта <Constant name="dbt" />: например, в `https://YOUR_ACCESS_URL/develop/projects/123456` идентификатор проекта — `123456`.

## Пример {#example}

Следующий пример представляет собой список всех доступных конфигураций в файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
[name](/reference/project-configs/name): string

[config-version](/reference/project-configs/config-version): 2
[version](/reference/project-configs/version): version

[profile](/reference/project-configs/profile): profilename

[model-paths](/reference/project-configs/model-paths): [directorypath]
[seed-paths](/reference/project-configs/seed-paths): [directorypath]
[test-paths](/reference/project-configs/test-paths): [directorypath]
[analysis-paths](/reference/project-configs/analysis-paths): [directorypath]
[macro-paths](/reference/project-configs/macro-paths): [directorypath]
[snapshot-paths](/reference/project-configs/snapshot-paths): [directorypath]
[docs-paths](/reference/project-configs/docs-paths): [directorypath]
[asset-paths](/reference/project-configs/asset-paths): [directorypath]
[function-paths](/reference/project-configs/function-paths): [directorypath]
[osi-paths](/reference/project-configs/osi-paths): [directorypath]
[check-paths](/reference/project-configs/check-paths): [directorypath]
[skill-paths](/reference/project-configs/skill-paths): [directorypath]

[packages-install-path](/reference/project-configs/packages-install-path): directorypath

[clean-targets](/reference/project-configs/clean-targets): [directorypath]

[query-comment](/reference/project-configs/query-comment): string

[require-dbt-version](/reference/project-configs/require-dbt-version): version-range | [version-range]

[flags](/reference/global-configs/project-flags):
  [<global-configs>](/reference/global-configs/project-flags)

[dbt-cloud](/reference/dbt_cloud.yml#the-dbt-cloud-block-in-dbt_projectyml):
  [project-id](/docs/platform/configure-dbt-cli#configure-the-dbt-platform-cli): project_id # Обязательно
  [defer-env-id](/docs/platform/about-defer#defer-in-dbt-platform-cli): environment_id # Необязательно
  [account_id](/reference/dbt_cloud.yml#the-dbt-cloud-block-in-dbt_projectyml): account_id # Необязательно, только для v2; обратите внимание на подчёркивание, в отличие от других полей dbt-cloud
  [account-host](/docs/platform/about-platform/access-regions-ip-addresses): account-host # По умолчанию — 'cloud.getdbt.com'; обязательно при использовании другого URL доступа

[analyses](/docs/build/analyses): # Требуется флаг require_corrected_analysis_fqns; доступно начиная с v1.12
  [<analysis-configs>](/reference/analysis-properties)

[exposures](/docs/build/exposures):  
  +[enabled](/reference/resource-configs/enabled): true | false

[quoting](/reference/project-configs/quoting):
  database: true | false
  schema: true | false
  identifier: true | false
  snowflake_ignore_case: true | false  # v2-only config. Aligns with Snowflake's session parameter QUOTED_IDENTIFIERS_IGNORE_CASE behavior. 
                                       # Ignored by dbt v1 and other adapters.
metrics:
  [<metric-configs>](/docs/build/metrics-overview)

models:
  [<model-configs>](/reference/model-configs)

seeds:
  [<seed-configs>](/reference/seed-configs)

semantic-models:
  [<semantic-model-configs>](/docs/build/semantic-models)

saved-queries:
  [<saved-queries-configs>](/docs/build/saved-queries)

skills:
  [<skill-configs>](/docs/dbt-ai/package-skills#disable-a-skill)

snapshots:
  [<snapshot-configs>](/reference/snapshot-configs)

sources:
  [<source-configs>](/reference/source-configs)
  
checks:
  [<check-configs>](/reference/check-configs)

data_tests:
  [<test-configs>](/reference/data-test-configs)

[info_schema](/docs/build/dbt-information-schema):
  version: 1  # Pins which version of the dbt Information Schema the {{ info_schema() }} macro resolves to

vars:
  [<variables>](/docs/build/project-variables)

[on-run-start](/reference/project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]
[on-run-end](/reference/project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]

[dispatch](/reference/project-configs/dispatch-config):
  - macro_namespace: packagename
    search_order: [packagename]

[restrict-access](/docs/mesh/govern/model-access): true | false

functions:
  [<function-configs>](/reference/function-configs)

```

</File>

## Префикс `+` {#the-prefix}

import PlusPrefix from '/snippets/_plus-prefix.md';

<PlusPrefix />

## Соглашение об именовании {#naming-convention}

Важно следовать правильным конвенциям именования YAML для конфигураций в вашем файле `dbt_project.yml`, чтобы dbt мог правильно их обработать. Это особенно важно для типов ресурсов с более чем одним словом.

- Для типов ресурсов, состоящих из нескольких слов, — `saved-queries` и `semantic-models` — используйте дефисы (`-`) в `dbt_project.yml`. Вот пример для [сохранённых запросов](/docs/build/saved-queries#configure-saved-query):

    <File name="dbt_project.yml">

    ```yml
    saved-queries:  # Используйте дефисы в saved-queries и semantic-models в dbt_project.yml.
      my_saved_query:
        +cache:
          enabled: true
    ```
    </File>

- Для [тестов данных](/docs/build/data-tests) и [модульных тестов](/docs/build/unit-tests) везде используйте символы подчёркивания (`_`), в том числе в `dbt_project.yml`:

    <File name="dbt_project.yml">

    ```yml
    data_tests:  # Используйте подчёркивания для data_tests и unit_tests даже в dbt_project.yml.
      +store_failures: true

    unit_tests:
      +enabled: true
    ```
    </File>

- В YAML-файлах, кроме `dbt_project.yml`, используйте подчёркивания (`_`) в названиях типов ресурсов, состоящих из нескольких слов. Например, тот же ресурс сохранённых запросов в файле свойств:

    <File name="models/saved_queries.yml">

    ```yml
    saved_queries:  # Используйте подчёркивания вне dbt_project.yml.
      - name: saved_query_name
        ... # Остальная часть конфигурации сохраненных запросов.
        config:
          cache:
            enabled: true
    ```
    </File>