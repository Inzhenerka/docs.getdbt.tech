Каждый [dbt проект](/docs/build/projects) требует наличия файла `dbt_project.yml` — именно так dbt определяет, что директория является проектом dbt. Этот файл также содержит важную информацию, которая сообщает dbt, как управлять вашим проектом.

- dbt использует [YAML](https://yaml.org/) в нескольких различных местах. Если вы новичок в YAML, стоит изучить, как представляются массивы, словари и строки.

- По умолчанию dbt ищет файл `dbt_project.yml` в вашей текущей рабочей директории и её родительских директориях, но вы можете установить другую директорию, используя флаг `--project-dir` или переменную окружения `DBT_PROJECT_DIR`.

- Укажите идентификатор вашего проекта dbt Cloud в файле `dbt_project.yml`, используя `project-id` в конфигурации `dbt-cloud`. Найдите ваш идентификатор проекта в URL вашего проекта dbt Cloud: например, в `https://YOUR_ACCESS_URL/11/projects/123456` идентификатор проекта — это `123456`.

- Обратите внимание, что вы не можете установить "свойство" в файле `dbt_project.yml`, если это не конфигурация (примером являются [макросы](/reference/macro-properties)). Это относится ко всем типам ресурсов. Обратитесь к [Конфигурациям и свойствам](/reference/configs-and-properties) для получения более подробной информации.

## Пример

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

[packages-install-path](/reference/project-configs/packages-install-path): directorypath

[clean-targets](/reference/project-configs/clean-targets): [directorypath]

[query-comment](/reference/project-configs/query-comment): string

[require-dbt-version](/reference/project-configs/require-dbt-version): version-range | [version-range]

[flags](/reference/global-configs/project-flags):
  [<global-configs>](/reference/global-configs/project-flags)

[dbt-cloud](/docs/cloud/cloud-cli-installation):
  [project-id](/docs/cloud/configure-cloud-cli#configure-the-dbt-cloud-cli): project_id # Обязательно
  [defer-env-id](/docs/cloud/about-cloud-develop-defer#defer-in-dbt-cloud-cli): environment_id # Необязательно

[quoting](/reference/project-configs/quoting):
  database: true | false
  schema: true | false
  identifier: true | false

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
  [<source-configs>](source-configs)
  
tests:
  [<test-configs>](/reference/data-test-configs)

vars:
  [<variables>](/docs/build/project-variables)

[on-run-start](/reference/project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]
[on-run-end](/reference/project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]

[dispatch](/reference/project-configs/dispatch-config):
  - macro_namespace: packagename
    search_order: [packagename]

[restrict-access](/docs/collaborate/govern/model-access): true | false

```

</File>

## Конвенция именования

Важно следовать правильным конвенциям именования YAML для конфигураций в вашем файле `dbt_project.yml`, чтобы гарантировать, что dbt сможет их правильно обработать. Это особенно актуально для типов ресурсов, состоящих из более чем одного слова.

- Используйте дефисы (`-`), когда настраиваете типы ресурсов с несколькими словами в вашем файле `dbt_project.yml`. Вот пример для [сохранённых запросов](/docs/build/saved-queries#configure-saved-query):

    <File name="dbt_project.yml">

    ```yml
    saved-queries:  # Используйте дефисы для типов ресурсов в файле dbt_project.yml.
      my_saved_query:
        +cache:
          enabled: true
    ```
    </File>

- Используйте подчеркивание (`_`), когда настраиваете типы ресурсов с несколькими словами для YAML файлов, отличных от файла `dbt_project.yml`. Например, вот тот же ресурс сохранённых запросов в файле `semantic_models.yml`:

    <File name="models/semantic_models.yml">

    ```yml
    saved_queries:  # Используйте подчеркивания везде вне файла dbt_project.yml.
      - name: saved_query_name
        ... # Остальная часть конфигурации сохранённых запросов.
        config:
          cache:
            enabled: true
    ```
    </File>