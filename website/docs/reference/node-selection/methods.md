---
title: "Методы выбора узлов"
sidebar: "Методы выбора узлов"
---

Методы выбора возвращают все ресурсы, которые имеют общие свойства, используя синтаксис `method:value`. Хотя рекомендуется явно указывать метод, вы можете его опустить (значение по умолчанию будет одним из `path`, `file` или `fqn`).

Многие из методов ниже поддерживают подстановочные знаки в стиле Unix:

| Подстановочный знак | Описание                                               |
| ------------------- | ----------------------------------------------------- |
| \*                  | соответствует любому количеству любых символов (включая отсутствие) |
| ?                   | соответствует любому одному символу                   |
| [abc]               | соответствует одному символу, указанному в скобках    |
| [a-z]              | соответствует одному символу из диапазона, указанного в скобках |

Например:
```
dbt list --select "*.folder_name.*"
dbt list --select "package:*_source"
```

### access

Метод `access` выбирает модели на основе их [свойства доступа](/reference/resource-configs/access).

```bash
dbt list --select "access:public"      # список всех публичных моделей
dbt list --select "access:private"       # список всех приватных моделей
dbt list --select "access:protected"       # список всех защищенных моделей
```

### config

Метод `config` используется для выбора моделей, которые соответствуют указанной [конфигурации узла](/reference/configs-and-properties).

```bash
dbt run --select "config.materialized:incremental"    # запустить все модели, которые материализуются инкрементально
dbt run --select "config.schema:audit"              # запустить все модели, которые созданы в схеме `audit`
dbt run --select "config.cluster_by:geo_country"      # запустить все модели, сгруппированные по `geo_country`
```

Хотя большинство значений конфигурации являются строками, вы также можете использовать метод `config` для сопоставления булевых конфигураций, ключей словарей и значений в списках.

Например, учитывая модель с следующими конфигурациями:

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
dbt ls --select "+exposure:*" --resource-type source    # список всех исходных таблиц, находящихся выше всех exposures
```

### file

Метод `file` может быть использован для выбора модели по ее имени файла, включая расширение файла (`.sql`).

```bash
# Эти команды эквивалентны
dbt run --select "file:some_model.sql"
dbt run --select "some_model.sql"
dbt run --select "some_model"
```

### fqn

Метод `fqn` используется для выбора узлов на основе их "полных квалифицированных имен" (FQN) в графе dbt. Вывод по умолчанию команды [`dbt list`](/reference/commands/list) — это список FQN. Формат FQN по умолчанию состоит из имени проекта, подкаталогов в пути и имени файла (без расширения), разделенных точками.

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

Метод `metric` используется для выбора родительских ресурсов указанного [метрика](/docs/build/build-metrics-intro). Используйте в сочетании с оператором `+`.

```bash
dbt build --select "+metric:weekly_active_users"       # построить все ресурсы, находящиеся выше метрики weekly_active_users
dbt ls    --select "+metric:*" --resource-type source  # список всех исходных таблиц, находящихся выше всех метрик
```

### package

Метод `package` используется для выбора моделей, определенных в корневом проекте или установленном пакете dbt. Хотя префикс `package:` не является обязательным, его можно использовать для устранения неоднозначности.

```bash
# Эти три селектора эквивалентны
dbt run --select "package:snowplow"
dbt run --select "snowplow"
dbt run --select "snowplow.*"
```

### path

Метод `path` используется для выбора моделей/источников, определенных в или под определенным путем. Определения моделей находятся в SQL/Python файлах (не YAML), а определения источников — в YAML файлах. Хотя префикс `path` не является обязательным, его можно использовать для устранения неоднозначности.

```bash
# Эти два селектора эквивалентны
dbt run --select "path:models/staging/github"
dbt run --select "models/staging/github"

# Эти два селектора эквивалентны
dbt run --select "path:models/staging/github/stg_issues.sql"
dbt run --select "models/staging/github/stg_issues.sql"
```

### resource_type

Используйте метод `resource_type`, чтобы выбрать узлы определенного типа (`model`, `test`, `exposure` и т.д.). Это похоже на флаг `--resource-type`, используемый в команде [`dbt ls`](/reference/commands/list).

```bash
dbt build --select "resource_type:exposure"    # построить все ресурсы, находящиеся выше exposures
dbt list --select "resource_type:test"         # список всех тестов в вашем проекте
dbt list --select "resource_type:source"       # список всех источников в вашем проекте
```

### result

Метод `result` связан с методом `state`, описанным выше, и может быть использован для выбора ресурсов на основе их статуса результата из предыдущего запуска. Обратите внимание, что одна из команд dbt [`run`, `test`, `build`, `seed`] должна была быть выполнена, чтобы создать результат, на основе которого работает селектор результата. Вы можете использовать селекторы `result` в сочетании с оператором `+`.

```bash
dbt run --select "result:error" --state path/to/artifacts # запустить все модели, которые вызвали ошибки при предыдущем запуске dbt run
dbt test --select "result:fail" --state path/to/artifacts # запустить все тесты, которые не прошли при предыдущем запуске dbt test
dbt build --select "1+result:fail" --state path/to/artifacts # запустить все модели, связанные с неудачными тестами из предыдущего запуска dbt build
dbt seed --select "result:error" --state path/to/artifacts # запустить все seed, которые вызвали ошибки при предыдущем запуске dbt seed.
```

### saved_query

Метод `saved_query` выбирает [сохраненные запросы](/docs/build/saved-queries).

```bash
dbt list --select "saved_query:*"                    # список всех сохраненных запросов 
dbt list --select "+saved_query:orders_saved_query"  # список вашего сохраненного запроса с именем "orders_saved_query" и всех ресурсов выше
```

### semantic_model

Метод `semantic_model` выбирает [семантические модели](/docs/build/semantic-models).

```bash
dbt list --select "semantic_model:*"        # список всех семантических моделей 
dbt list --select "+semantic_model:orders"  # список вашей семантической модели с именем "orders" и всех ресурсов выше
```

### source

Метод `source` используется для выбора моделей, которые выбирают из указанного [источника](/docs/build/sources#using-sources). Используйте в сочетании с оператором `+`.

```bash
dbt run --select "source:snowplow+"    # запустить все модели, которые выбирают из источников Snowplow
```

### source_status

Еще одним элементом состояния задания является `source_status` предыдущего вызова dbt. После выполнения, например, `dbt source freshness`, dbt создает артефакт `sources.json`, который содержит времена выполнения и даты `max_loaded_at` для источников dbt. Вы можете узнать больше о `sources.json` на странице ['sources'](/reference/artifacts/sources-json).

Следующие команды dbt создают артефакты `sources.json`, результаты которых могут быть использованы в последующих вызовах dbt:  
- `dbt source freshness`

После выполнения одной из вышеуказанных команд вы можете ссылаться на результаты свежести источника, добавив селектор к следующей команде следующим образом:

```bash
# Вы также можете установить переменную окружения DBT_STATE вместо флага --state.
dbt source freshness # должен быть выполнен снова для сравнения текущего состояния с предыдущим
dbt build --select "source_status:fresher+" --state path/to/prod/artifacts
```

### state

**Примечание.** Выбор на основе состояния — это мощная, сложная функция. Ознакомьтесь с [известными проблемами и ограничениями](/reference/node-selection/state-comparison-caveats) для сравнения состояния.

Метод `state` используется для выбора узлов путем их сравнения с предыдущей версией того же проекта, которая представлена [манифестом](/reference/artifacts/manifest-json). Путь к файлу манифеста для сравнения _должен_ быть указан через флаг `--state` или переменную окружения `DBT_STATE`.

`state:new`: Узел с тем же `unique_id` отсутствует в манифесте сравнения

`state:modified`: Все новые узлы, а также любые изменения в существующих узлах.

```bash
dbt test --select "state:new" --state path/to/artifacts      # запустить все тесты на новых моделях + и новые тесты на старых моделях
dbt run --select "state:modified" --state path/to/artifacts  # запустить все модели, которые были изменены
dbt ls --select "state:modified" --state path/to/artifacts   # список всех измененных узлов (не только моделей)
```

Поскольку сравнение состояния является сложным, и каждый проект уникален, dbt поддерживает подселекторы, которые включают подмножество полных критериев `modified`:
- `state:modified.body`: Изменения в теле узла (например, SQL модели, значения seed)
- `state:modified.configs`: Изменения в любых конфигурациях узлов, исключая `database`/`schema`/`alias`
- `state:modified.relation`: Изменения в `database`/`schema`/`alias` (представление базы данных этого узла), независимо от значений `target` или макросов `generate_x_name`
- `state:modified.persisted_descriptions`: Изменения в `description` на уровне отношения или столбца, _если и только если_ `persist_docs` включен на каждом уровне
- `state:modified.macros`: Изменения в верхних макросах (независимо от того, вызываются ли они напрямую или косвенно другим макросом)
- `state:modified.contract`: Изменения в [контракте](/reference/resource-configs/contract) модели, которые в настоящее время включают `name` и `data_type` столбцов. Удаление или изменение типа существующего столбца считается нарушением, и вызовет ошибку.

Помните, что `state:modified` включает _все_ вышеперечисленные критерии, а также некоторые дополнительные специфические для ресурса критерии, такие как изменение `freshness` или правил `quoting` источника или свойства `maturity` exposure. (Посмотрите исходный код для полного набора проверок, используемых при сравнении [источников](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L660-L681), [exposures](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L768-L783) и [выполнимых узлов](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L319-L330).)

Существуют два дополнительных селектора `state`, которые дополняют `state:new` и `state:modified`, представляя инверсии этих функций:
- `state:old` &mdash; Узел с тем же `unique_id` существует в манифесте сравнения
- `state:unmodified` &mdash; Все существующие узлы без изменений

Эти селекторы могут помочь вам сократить время выполнения, исключив неизмененные узлы. В настоящее время подселекторы недоступны, но это может измениться по мере развития случаев использования.

### tag

Метод `tag:` используется для выбора моделей, которые соответствуют указанному [тегу](/reference/resource-configs/tags).

```bash
dbt run --select "tag:nightly"    # запустить все модели с тегом `nightly`
```

### test_name

Метод `test_name` используется для выбора тестов на основе имени общего теста, который его определяет. Для получения дополнительной информации о том, как определяются общие тесты, читайте о [тестах](/docs/build/data-tests).

```bash
dbt test --select "test_name:unique"            # запустить все экземпляры теста `unique`
dbt test --select "test_name:equality"          # запустить все экземпляры теста `dbt_utils.equality`
dbt test --select "test_name:range_min_max"     # запустить все экземпляры пользовательского схемного теста, определенного в локальном проекте, `range_min_max`
```

### test_type

<VersionBlock lastVersion="1.7">

Метод `test_type` используется для выбора тестов на основе их типа, `singular` или `generic`:

```bash
dbt test --select "test_type:generic"        # запустить все общие тесты
dbt test --select "test_type:singular"       # запустить все единичные тесты
```

</VersionBlock>

<VersionBlock firstVersion="1.8">

Метод `test_type` используется для выбора тестов на основе их типа:

- [Единичные тесты](/docs/build/unit-tests)
- [Данные тесты](/docs/build/data-tests):
  - [Единичные](/docs/build/data-tests#singular-data-tests)
  - [Общие](/docs/build/data-tests#generic-data-tests)

```bash
dbt test --select "test_type:unit"           # запустить все единичные тесты
dbt test --select "test_type:data"           # запустить все тесты данных
dbt test --select "test_type:generic"        # запустить все общие тесты данных
dbt test --select "test_type:singular"       # запустить все единичные тесты данных
```

</VersionBlock>

### unit_test

<VersionBlock lastVersion="1.7">
Поддерживается в версии 1.8 или новее.
</VersionBlock>
<VersionBlock firstVersion="1.8">

Метод `unit_test` выбирает [единичные тесты](/docs/build/unit-tests).

```bash
dbt list --select "unit_test:*"                        # список всех единичных тестов 
dbt list --select "+unit_test:orders_with_zero_items"  # список вашего единичного теста с именем "orders_with_zero_items" и всех ресурсов выше
```

</VersionBlock>

### version

Метод `version` выбирает [версионированные модели](/docs/collaborate/govern/model-versions) на основе их [идентификатора версии](/reference/resource-properties/versions) и [последней версии](/reference/resource-properties/latest_version).

```bash
dbt list --select "version:latest"      # только 'последние' версии
dbt list --select "version:prerelease"  # версии, более новые, чем 'последняя' версия
dbt list --select "version:old"         # версии, более старые, чем 'последняя' версия

dbt list --select "version:none"        # модели, которые *не* имеют версии
```