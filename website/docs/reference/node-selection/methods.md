---
title: "Методы выбора узлов"
sidebar: "Методы выбора узлов"
---

Методы выбора возвращают все ресурсы, которые имеют общие свойства, используя синтаксис `method:value`. Хотя рекомендуется явно указывать метод, вы можете его опустить (значение по умолчанию будет одним из `path`, `file` или `fqn`).

<Expandable alt_header="Различия между --select и --selector">

Аргументы `--select` и `--selector` звучат похоже, но это разные вещи. Чтобы понять разницу, см. [Differences between `--select` and `--selector`](/reference/node-selection/yaml-selectors#difference-between---select-and---selector).

</Expandable>

import UsingCommas from '/snippets/_using-commas.md';

<UsingCommas />

| Подстановочный знак | Описание                                               |
| ------------------- | ------------------------------------------------------ |
| \*                  | соответствует любому количеству любых символов (включая отсутствие) |
| ?                   | соответствует любому одному символу                    |
| [abc]               | соответствует одному символу из указанных в скобках    |
| [a-z]               | соответствует одному символу из диапазона, указанного в скобках |

| Wildcard | Описание                                                  |
| -------- | --------------------------------------------------------- |
| \*       | соответствует любому количеству любых символов (включая отсутствие символов) |
| ?        | соответствует любому одному символу                       |
| [abc]    | соответствует одному символу, указанному в скобках        |
| [a-z]    | соответствует одному символу из диапазона, указанного в скобках |

Например:
```bash
dbt list --select "*.folder_name.*"
dbt list --select "package:*_source"
```

### access

Метод `access` выбирает модели на основе их свойства [access](/reference/resource-configs/access).

```bash
dbt list --select "access:public"      # перечислить все публичные модели
dbt list --select "access:private"     # перечислить все приватные модели
dbt list --select "access:protected"   # перечислить все защищенные модели
```

### config

Метод `config` используется для выбора моделей, которые соответствуют указанной [конфигурации узла](/reference/configs-and-properties).

```bash
dbt run --select "config.materialized:incremental"    # запустить все модели, которые материализуются инкрементально
dbt run --select "config.schema:audit"                # запустить все модели, которые создаются в схеме `audit`
dbt run --select "config.cluster_by:geo_country"      # запустить все модели, кластеризованные по `geo_country`
```

Хотя большинство значений конфигурации являются строками, вы также можете использовать метод `config` для соответствия булевым конфигурациям, ключам словарей и значениям в списках.

Например, для модели с следующими конфигурациями:

```bash
{{ config(
  materialized = 'incremental',
  unique_key = ['column_a', 'column_b'],
  grants = {'select': ['reporter', 'analysts']},
  meta = {"contains_pii": true},
  transient = true
) }}

select ...
```

Вы можете выбрать, используя любое из следующих:
```bash
dbt ls -s config.materialized:incremental
dbt ls -s config.unique_key:column_a
dbt ls -s config.grants.select:reporter
dbt ls -s config.meta.contains_pii:true
dbt ls -s config.transient:true
```

### exposure

Метод `exposure` используется для выбора родительских ресурсов указанного [exposure](/docs/build/exposures). Используйте в сочетании с оператором `+`.

```bash
dbt run --select "+exposure:weekly_kpis"                # запустить все модели, которые питают exposure weekly_kpis
dbt test --select "+exposure:*"                         # протестировать все ресурсы, находящиеся выше всех exposures
dbt ls --select "+exposure:*" --resource-type source    # перечислить все исходные таблицы, находящиеся выше всех exposures
```

### file

<VersionBlock lastVersion="1.10">

Метод `file` можно использовать для выбора модели по имени её файла, включая расширение файла (`.sql`).

```bash
# Эти команды эквивалентны
dbt run --select "file:some_model.sql"
dbt run --select "some_model.sql"
dbt run --select "some_model"
```
</VersionBlock>

<VersionBlock firstVersion="1.11">

The `file` method can be used to select a model or a function by its filename, including the file extension (`.sql`).

```bash
# These are equivalent
dbt run --select "file:some_model.sql"
dbt run --select "some_model.sql"
dbt run --select "some_model"

# These are equivalent
dbt build --select "file:my_function.sql"
dbt build --select "my_function.sql"
dbt build --select "my_function"

# To build all models that use the function
dbt build --select "my_function+"
```
</VersionBlock>

### fqn

Метод `fqn` используется для выбора узлов на основе их "полностью квалифицированных имен" (FQN) в графе dbt. Вывод по умолчанию команды [`dbt list`](/reference/commands/list) представляет собой список FQN. Формат FQN по умолчанию состоит из имени проекта, подкаталогов в пути и имени файла (без расширения), разделенных точками.

```bash
dbt run --select "fqn:some_model"
dbt run --select "fqn:your_project.some_model"
dbt run --select "fqn:some_package.some_other_model"
dbt run --select "fqn:some_path.some_model"
dbt run --select "fqn:your_project.some_path.some_model"
```

### group

Метод `group` используется для выбора моделей, определенных в [группе](/reference/resource-configs/group).

```bash
dbt run --select "group:finance" # запустить все модели, которые принадлежат группе finance.
```

### metric

Метод `metric` используется для выбора родительских ресурсов указанной [метрики](/docs/build/build-metrics-intro). Используйте в сочетании с оператором `+`.

```bash
dbt build --select "+metric:weekly_active_users"       # построить все ресурсы, находящиеся выше метрики weekly_active_users
dbt ls    --select "+metric:*" --resource-type source  # перечислить все исходные таблицы, находящиеся выше всех метрик
```

### package

Метод `package` используется для выбора моделей, определенных в корневом проекте или установленном пакете dbt. Хотя префикс `package:` не является обязательным, он может быть использован для устранения неоднозначности селекторов.

```bash
# Эти три селектора эквивалентны
dbt run --select "package:snowplow"
dbt run --select "snowplow"
dbt run --select "snowplow.*"
```

Use the `this` package to select nodes from the current project. From the example, running `dbt run --select "package:this"` from the `snowplow` project runs the exact same set of models as the other three selectors.

Since `this` always refers to the current project, using `package:this` ensures that you're only selecting models from the project you're working in.

### path
<VersionBlock lastVersion="1.10">
Метод `path` используется для выбора моделей и источников, определённых в указанном каталоге или во вложенных в него каталогах.
Определения моделей находятся в SQL/Python-файлах (не в YAML), а определения источников — в YAML-файлах.
Хотя префикс `path` не является строго обязательным, его можно использовать, чтобы сделать селекторы однозначными.

Метод `path` используется для выбора моделей/источников, определенных в указанном пути или под ним. Определения моделей находятся в файлах SQL/Python (не YAML), а определения источников — в файлах YAML. Хотя префикс `path` не является обязательным, он может быть использован для устранения неоднозначности селекторов.

```bash
# Эти два селектора эквивалентны
dbt run --select "path:models/staging/github"
dbt run --select "models/staging/github"

# Эти два селектора эквивалентны
dbt run --select "path:models/staging/github/stg_issues.sql"
dbt run --select "models/staging/github/stg_issues.sql"
```

</VersionBlock>

<VersionBlock firstVersion="1.11">

Метод `path` используется для выбора моделей, источников или функций, определённых в указанном пути или внутри него.  
Определения моделей находятся в SQL/Python-файлах (не в YAML), определения источников — в YAML-файлах. Функции определяются в SQL-файлах. Хотя префикс `path` не является строго обязательным, его можно использовать, чтобы сделать селекторы однозначными.

```bash
# Эти два селектора эквивалентны
dbt run --select "path:models/staging/github"
dbt run --select "models/staging/github"

# Эти два селектора эквивалентны
dbt run --select "path:models/staging/github/stg_issues.sql"
dbt run --select "models/staging/github/stg_issues.sql"

# Эти два селектора эквивалентны
dbt build --select "path:functions/my_function.sql"
dbt build --select "functions/my_function.sql"
```

</VersionBlock>

### resource_type

<VersionBlock lastVersion="1.10">

Используйте метод `resource_type` для выбора узлов определённого типа (`model`, `test`, `exposure` и т.д.). Это похоже на использование флага `--resource-type` в команде [`dbt ls`](/reference/commands/list).

```bash
dbt build --select "resource_type:exposure"    # собрать все ресурсы, находящиеся выше по зависимостям от exposures
dbt list --select "resource_type:test"         # вывести список всех тестов в вашем проекте
dbt list --select "resource_type:source"       # вывести список всех источников в вашем проекте
```
```

</VersionBlock>

<VersionBlock firstVersion="1.11">

Используйте метод `resource_type`, чтобы выбрать узлы определённого типа (`model`, `test`, `exposure`, `function` и т.д.). Это похоже на флаг `--resource-type`, который используется в команде [`dbt ls`](/reference/commands/list).

```bash
dbt build --select "resource_type:exposure"    # build all resources upstream of exposures
dbt build --select "resource_type:function"    # build all functions in your project
dbt list --select "resource_type:test"         # list all tests in your project
dbt list --select "resource_type:source"       # list all sources in your project
```
```

</VersionBlock>

### result

The `result` method is related to the [`state` method](/reference/node-selection/methods#state) and can be used to select resources based on their result status from a prior run. Note that one of the dbt commands [`run`, `test`, `build`, `seed`] must have been performed in order to create the result on which a result selector operates. 

You can use `result` selectors in conjunction with the `+` operator. 

```bash
# run all models that generated errors on the prior invocation of dbt run
dbt run --select "result:error" --state path/to/artifacts 

# run all tests that failed on the prior invocation of dbt test
dbt test --select "result:fail" --state path/to/artifacts 

# run all the models associated with failed tests from the prior invocation of dbt build
dbt build --select "1+result:fail" --state path/to/artifacts

# run all seeds that generated errors on the prior invocation of dbt seed
dbt seed --select "result:error" --state path/to/artifacts 
```

- Only use `result:fail` when you want to re-run tests that failed during the last invocation. This selector is specific to test nodes. Tests don't have downstream nodes in the DAG, so using the `result:fail+` selector will only return the failed test itself and not the model or anything built on top of it.
- On the other hand, `result:error` selects any resource (models, tests, snapshots, and more) that returned an error.
- As an example, to re-run upstream and downstream resources associated with failed tests, you can use one of the following selectors:
  ```bash
  # reruns all the models associated with failed tests from the prior invocation of dbt build
  dbt build --select "1+result:fail" --state path/to/artifacts

  # reruns the models associated with failed tests and all downstream dependencies - especially useful in deferred state workflows
  dbt build --select "1+result:fail+" --state path/to/artifacts
  ```

### saved_query

Метод `saved_query` выбирает [сохраненные запросы](/docs/build/saved-queries).

```bash
dbt list --select "saved_query:*"                    # перечислить все сохраненные запросы 
dbt list --select "+saved_query:orders_saved_query"  # перечислить ваш сохраненный запрос с именем "orders_saved_query" и все вышестоящие ресурсы
```

### semantic_model

Метод `semantic_model` выбирает [семантические модели](/docs/build/semantic-models).

```bash
dbt list --select "semantic_model:*"        # перечислить все семантические модели 
dbt list --select "+semantic_model:orders"  # перечислить вашу семантическую модель с именем "orders" и все вышестоящие ресурсы
```

### source

Метод `source` используется для выбора моделей, которые выбирают из указанного [источника](/docs/build/sources#using-sources). Используйте в сочетании с оператором `+`.

```bash
dbt run --select "source:snowplow+"    # запустить все модели, которые выбирают из источников Snowplow
```

### source_status

Еще один элемент состояния задания — это `source_status` предыдущего вызова dbt. Например, после выполнения `dbt source freshness` dbt создает артефакт `sources.json`, который содержит время выполнения и даты `max_loaded_at` для источников dbt. Подробнее о `sources.json` можно прочитать на странице ['sources'](/reference/artifacts/sources-json).

Следующие команды dbt создают артефакты `sources.json`, результаты которых могут быть использованы в последующих вызовах dbt:  
- `dbt source freshness`

После выполнения одной из вышеуказанных команд вы можете ссылаться на результаты свежести источников, добавив селектор к последующей команде следующим образом:

```bash
# Вы также можете установить переменную окружения DBT_STATE вместо флага --state.
dbt source freshness # необходимо запустить снова для сравнения текущего состояния с предыдущим
dbt build --select "source_status:fresher+" --state path/to/prod/artifacts
```

### state

**N.B.** [State-based selection](/reference/node-selection/state-selection) — это мощная и сложная возможность. Обязательно ознакомьтесь с [known caveats and limitations](/reference/node-selection/state-comparison-caveats), связанными с сравнением состояний.

Метод `state` используется для выбора узлов путем сравнения их с предыдущей версией того же проекта, которая представлена [манифестом](/reference/artifacts/manifest-json). Путь к файлу манифеста для сравнения _должен_ быть указан через флаг `--state` или переменную окружения `DBT_STATE`.

`state:new`: В манифесте для сравнения нет узла с таким же `unique_id`

`state:modified`: Все новые узлы, плюс любые изменения существующих узлов.

```bash
dbt test --select "state:new" --state path/to/artifacts      # запустить все тесты на новых моделях + и новые тесты на старых моделях
dbt run --select "state:modified" --state path/to/artifacts  # запустить все модели, которые были изменены
dbt ls --select "state:modified" --state path/to/artifacts   # перечислить все измененные узлы (не только модели)
```

Поскольку сравнение состояний является сложным, и каждый проект уникален, dbt поддерживает подселекторы, которые включают подмножество полного критерия `modified`:
- `state:modified.body`: Изменения в теле узла (например, SQL модели, значения seed)
- `state:modified.configs`: Изменения в любой конфигурации узла, за исключением `database`/`schema`/`alias`
- `state:modified.relation`: Изменения в `database`/`schema`/`alias` (представление этого узла в базе данных), независимо от значений `target` или макросов `generate_x_name`
- `state:modified.persisted_descriptions`: Изменения в описании на уровне отношения или столбца, _если и только если_ `persist_docs` включен на каждом уровне
- `state:modified.macros`: Изменения в вышестоящих макросах (независимо от того, вызываются ли они напрямую или косвенно другим макросом)
- `state:modified.contract`: Изменения в [контракте](/reference/resource-configs/contract) модели, которые в настоящее время включают `name` и `data_type` `columns`. Удаление или изменение типа существующего столбца считается критическим изменением и вызовет ошибку.

Помните, что `state:modified` включает _все_ вышеуказанные критерии, а также некоторые дополнительные критерии, специфичные для ресурсов, такие как изменение правил `freshness` или `quoting` источника или свойства `maturity` exposure. (Просмотрите исходный код для полного набора проверок, используемых при сравнении [источников](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L660-L681), [exposures](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L768-L783) и [выполняемых узлов](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L319-L330).)

Существуют два дополнительных селектора `state`, которые дополняют `state:new` и `state:modified`, представляя инверсии этих функций:
- `state:old` &mdash; Узел с таким же `unique_id` существует в манифесте для сравнения
- `state:unmodified` &mdash; Все существующие узлы без изменений

Эти селекторы могут помочь вам сократить время выполнения, исключив неизмененные узлы. В настоящее время подселекторы недоступны, но это может измениться по мере развития сценариев использования.

#### `state:modified` node and reference impacts

`state:modified` identifies any new nodes added, changes to existing nodes, and any changes made to:

- [access](/reference/resource-configs/access) permissions
- [`deprecation_date` ](/reference/resource-properties/deprecation_date)
- [`latest_version` ](/reference/resource-properties/latest_version)

If a node changes its group, downstream references may break, potentially causing build failures.

As `group` is a config, and configs are generally included in `state:modified` detection, modifying the group name everywhere it's referenced will flag those nodes as "modified".

Depending on whether partial parsing is enabled, you will catch the breakage as part of CI workflows.

- If you change a group name everywhere it's referenced, and partial parsing is enabled, dbt may only re-parse the changed model.
- If you update a group name in all its references without partial parsing enabled, dbt will re-parse all models and identify any invalid downstream references.

An error along the lines of "there's nothing to do" can occur when you change the group name *and* something is picked up to be run via `dbt build --select state:modified`. This error will be caught at runtime so long as the CI job is selecting `state:modified+` (including downstreams).

Certain factors can affect how references are used or resolved later on, including:

- Modifying access: if permissions or access rules change, some references might stop working.
- Modifying `deprecation_date`: if a reference or model version is marked  deprecated, new warnings might appear that affect how references are  processed.
- Modifying `latest_version`: if there's no tie to a specific version, the reference or model will point to the latest version.
  -  If a newer version is released, the reference will automatically resolve to the new version, potentially changing the behavior or output of the system that relies on it.

dbt handles state comparison for seed files differently depending on their size:

- **Seed files smaller than 1 MiB** &mdash; Included in the `state:modified` selector only when the contents change.
- **Seed files 1 MiB or larger** &mdash; Included in the `state:modified` selector only when the seed file path changes.

#### Overwrites the `manifest.json`

import Overwritesthemanifest from '/snippets/_overwrites-the-manifest.md';

<Overwritesthemanifest />

#### Recommendation

import Recommendationoverwritesthemanifest from '/snippets/_recommendation-overwriting-manifest.md'; 

<Recommendationoverwritesthemanifest />

### tag

Метод `tag:` используется для выбора моделей, которые соответствуют указанному [тегу](/reference/resource-configs/tags).

```bash
dbt run --select "tag:nightly"    # запустить все модели с тегом `nightly`
```

### test_name

Метод `test_name` используется для выбора тестов на основе имени обобщённого теста, который их определяет. Подробнее о том, как определяются обобщённые тесты, читайте в разделе [data tests](/docs/build/data-tests).

```bash
dbt test --select "test_name:unique"            # запустить все экземпляры теста `unique`
dbt test --select "test_name:equality"          # запустить все экземпляры теста `dbt_utils.equality`
dbt test --select "test_name:range_min_max"     # запустить все экземпляры пользовательского теста схемы, определенного в локальном проекте, `range_min_max`
```

### test_type

Метод `test_type` используется для выбора тестов в зависимости от их типа:

- [Модульные тесты](/docs/build/unit-tests)
- [Тесты данных](/docs/build/data-tests):
  - [Сингулярные](/docs/build/data-tests#singular-data-tests)
  - [Обобщённые](/docs/build/data-tests#generic-data-tests)

- [Юнит-тесты](/docs/build/unit-tests)
- [Тесты данных](/docs/build/data-tests):
  - [Одиночные](/docs/build/data-tests#singular-data-tests)
  - [Общие](/docs/build/data-tests#generic-data-tests)

```bash
dbt test --select "test_type:unit"           # запустить все юнит-тесты
dbt test --select "test_type:data"           # запустить все тесты данных
dbt test --select "test_type:generic"        # запустить все общие тесты данных
dbt test --select "test_type:singular"       # запустить все одиночные тесты данных
```

### unit_test

Метод `unit_test` выбирает [юнит-тесты](/docs/build/unit-tests).

```bash
dbt list --select "unit_test:*"                        # перечислить все юнит-тесты 
dbt list --select "+unit_test:orders_with_zero_items"  # перечислить ваш юнит-тест с именем "orders_with_zero_items" и все вышестоящие ресурсы
```

### version

Метод `version` выбирает [versioned models](/docs/mesh/govern/model-versions) на основе их [version identifier](/reference/resource-properties/versions) и [latest version](/reference/resource-properties/latest_version).

```bash
dbt list --select "version:latest"      # только 'последние' версии
dbt list --select "version:prerelease"  # версии, новее чем 'последняя' версия
dbt list --select "version:old"         # версии, старее чем 'последняя' версия

dbt list --select "version:none"        # модели, которые *не* версионированы
```