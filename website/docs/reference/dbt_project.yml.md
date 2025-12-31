---
description: "Справочное руководство по настройке файла dbt_project.yml."
intro_text: "Файл dbt_project.yml является обязательным для всех проектов dbt. Он содержит важную информацию, которая сообщает dbt, как работать с вашим проектом."
---

Каждому [проекту dbt](/docs/build/projects) необходим файл `dbt_project.yml` — именно по нему dbt определяет, что каталог является проектом dbt. Кроме того, в этом файле содержится важная информация, которая сообщает dbt, как именно работать с вашим проектом. Принцип работы следующий:

- dbt использует [YAML](https://yaml.org/) в нескольких местах. Если вы ранее не работали с YAML, полезно изучить, как в нём представлены массивы, словари и строки.
- По умолчанию dbt ищет файл `dbt_project.yml` в текущем рабочем каталоге и его родительских каталогах, однако вы можете указать другой каталог с помощью флага `--project-dir` или переменной окружения `DBT_PROJECT_DIR`.
- Укажите идентификатор вашего проекта <Constant name="cloud" /> в файле `dbt_project.yml`, используя параметр `project-id` в конфигурации `dbt-cloud`. Идентификатор проекта можно найти в URL вашего проекта <Constant name="cloud" />. Например, в `https://YOUR_ACCESS_URL/11/projects/123456` идентификатор проекта — `123456`.

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

[packages-install-path](/reference/project-configs/packages-install-path): directorypath

[clean-targets](/reference/project-configs/clean-targets): [directorypath]

[query-comment](/reference/project-configs/query-comment): string

[require-dbt-version](/reference/project-configs/require-dbt-version): version-range | [version-range]

[flags](/reference/global-configs/project-flags):
  [<global-configs>](/reference/global-configs/project-flags)

[dbt-cloud](/docs/cloud/cloud-cli-installation):
[project-id](/docs/cloud/configure-cloud-cli#configure-the-dbt-cli): project_id # Обязательный параметр  
  [defer-env-id](/docs/cloud/about-cloud-develop-defer#defer-in-dbt-cli): environment_id # Необязательный параметр  
  [account-host](/docs/cloud/about-cloud/access-regions-ip-addresses): account-host # По умолчанию используется `cloud.getdbt.com`; обязателен, если используется другой Access URL  

[exposures](/docs/build/exposures):  
  +[enabled](/reference/resource-configs/enabled): true | false

[quoting](/reference/project-configs/quoting):
  database: true | false
  schema: true | false
  identifier: true | false
  snowflake_ignore_case: true | false  # Fusion-only config. Aligns with Snowflake's session parameter QUOTED_IDENTIFIERS_IGNORE_CASE behavior. 
                                       # Ignored by dbt Core and other adapters.
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

snapshots:
  [<snapshot-configs>](/reference/snapshot-configs)

sources:
  [<source-configs>](/reference/source-configs)
  
data_tests:
  [<test-configs>](/reference/data-test-configs)

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

- Используйте дефисы (`-`) при настройке типов ресурсов с несколькими словами в вашем файле `dbt_project.yml`. Вот пример для [сохраненных запросов](/docs/build/saved-queries#configure-saved-query):

    <File name="dbt_project.yml">

    ```yml
    saved-queries:  # Используйте дефисы для типов ресурсов в файле dbt_project.yml.
      my_saved_query:
        +cache:
          enabled: true
    ```
    </File>

- Используйте подчеркивание (`_`) при настройке типов ресурсов с несколькими словами для YAML-файлов, отличных от `dbt_project.yml`. Например, вот тот же ресурс сохраненных запросов в файле `semantic_models.yml`:

    <File name="models/semantic_models.yml">

    ```yml
    saved_queries:  # Используйте подчеркивания везде, кроме файла dbt_project.yml.
      - name: saved_query_name
        ... # Остальная часть конфигурации сохраненных запросов.
        config:
          cache:
            enabled: true
    ```
    </File>