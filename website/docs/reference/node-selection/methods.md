---
title: "Методы выбора узлов"
sidebar: "Методы выбора узлов"
---

Методы выбора возвращают все ресурсы, которые имеют общие свойства, используя синтаксис `method:value`. Хотя рекомендуется явно указывать метод, вы можете его опустить (значение по умолчанию будет одним из `path`, `file` или `fqn`).

Многие из методов ниже поддерживают подстановочные знаки в стиле Unix:

| Подстановочный знак | Описание                                               |
| ------------------- | ------------------------------------------------------ |
| \*                  | соответствует любому количеству любых символов (включая отсутствие) |
| ?                   | соответствует любому одному символу                    |
| [abc]               | соответствует одному символу из указанных в скобках    |
| [a-z]               | соответствует одному символу из диапазона, указанного в скобках |

Например:
```
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

Метод `file` может быть использован для выбора модели по имени файла, включая расширение файла (`.sql`).

```bash
# Эти команды эквивалентны
dbt run --select "file:some_model.sql"
dbt run --select "some_model.sql"
dbt run --select "some_model"
```

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

### path

Метод `path` используется для выбора моделей/источников, определенных в указанном пути или под ним. Определения моделей находятся в файлах SQL/Python (не YAML), а определения источников — в файлах YAML. Хотя префикс `path` не является обязательным, он может быть использован для устранения неоднозначности селекторов.

```bash
# Эти два селектора эквивалентны
dbt run --select "path:models/staging/github"
dbt run --select "models/staging/github"

# Эти два селектора эквивалентны
dbt run --select "path:models/staging/github/stg_issues.sql"
dbt run --select "models/staging/github/stg_issues.sql"
```

### resource_type

Используйте метод `resource_type` для выбора узлов определенного типа (`model`, `test`, `exposure` и так далее). Это похоже на флаг `--resource-type`, используемый командой [`dbt ls`](/reference/commands/list).

```bash
dbt build --select "resource_type:exposure"    # построить все ресурсы, находящиеся выше exposures
dbt list --select "resource_type:test"         # перечислить все тесты в вашем проекте
dbt list --select "resource_type:source"       # перечислить все источники в вашем проекте
```

### result

Метод `result` связан с методом `state`, описанным выше, и может быть использован для выбора ресурсов на основе их статуса результата из предыдущего запуска. Обратите внимание, что одна из команд dbt [`run`, `test`, `build`, `seed`] должна быть выполнена для создания результата, на котором работает селектор результата. Вы можете использовать селекторы `result` в сочетании с оператором `+`.

```bash
dbt run --select "result:error" --state path/to/artifacts # запустить все модели, которые вызвали ошибки при предыдущем вызове dbt run
dbt test --select "result:fail" --state path/to/artifacts # запустить все тесты, которые не прошли при предыдущем вызове dbt test
dbt build --select "1+result:fail" --state path/to/artifacts # запустить все модели, связанные с неудачными тестами из предыдущего вызова dbt build
dbt seed --select "result:error" --state path/to/artifacts # запустить все seeds, которые вызвали ошибки при предыдущем вызове dbt seed.
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

**Примечание.** Выбор на основе состояния — это мощная, сложная функция. Прочтите о [известных ограничениях и недостатках](/reference/node-selection/state-comparison-caveats) сравнения состояний.

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

### tag

Метод `tag:` используется для выбора моделей, которые соответствуют указанному [тегу](/reference/resource-configs/tags).

```bash
dbt run --select "tag:nightly"    # запустить все модели с тегом `nightly`
```

### test_name

Метод `test_name` используется для выбора тестов на основе имени общего теста, который их определяет. Для получения дополнительной информации о том, как определяются общие тесты, прочтите о [тестах](/docs/build/data-tests).

```bash
dbt test --select "test_name:unique"            # запустить все экземпляры теста `unique`
dbt test --select "test_name:equality"          # запустить все экземпляры теста `dbt_utils.equality`
dbt test --select "test_name:range_min_max"     # запустить все экземпляры пользовательского теста схемы, определенного в локальном проекте, `range_min_max`
```

### test_type

<VersionBlock lastVersion="1.7">

Метод `test_type` используется для выбора тестов на основе их типа, `singular` или `generic`:

```bash
dbt test --select "test_type:generic"        # запустить все общие тесты
dbt test --select "test_type:singular"       # запустить все одиночные тесты
```

</VersionBlock>

<VersionBlock firstVersion="1.8">

Метод `test_type` используется для выбора тестов на основе их типа:

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

</VersionBlock>

### unit_test

<VersionBlock lastVersion="1.7">
Поддерживается в версии v1.8 или новее.
</VersionBlock>
<VersionBlock firstVersion="1.8">

Метод `unit_test` выбирает [юнит-тесты](/docs/build/unit-tests).

```bash
dbt list --select "unit_test:*"                        # перечислить все юнит-тесты 
dbt list --select "+unit_test:orders_with_zero_items"  # перечислить ваш юнит-тест с именем "orders_with_zero_items" и все вышестоящие ресурсы
```

</VersionBlock>

### version

Метод `version` выбирает [версионированные модели](/docs/collaborate/govern/model-versions) на основе их [идентификатора версии](/reference/resource-properties/versions) и [последней версии](/reference/resource-properties/latest_version).

```bash
dbt list --select "version:latest"      # только 'последние' версии
dbt list --select "version:prerelease"  # версии, новее чем 'последняя' версия
dbt list --select "version:old"         # версии, старее чем 'последняя' версия

dbt list --select "version:none"        # модели, которые *не* версионированы
```