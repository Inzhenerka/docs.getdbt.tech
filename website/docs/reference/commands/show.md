---
title: "О команде dbt show"
sidebar_label: "show"
id: "show"
---

Используйте `dbt show`, чтобы:
- Скомпилировать определение на dbt-SQL для одного узла `model`, `test`, `analysis` или произвольный запрос на dbt-SQL, переданный через `--inline`
  - `dbt show` не поддерживает модели [Python (dbt-py)](/docs/build/python-models).
  - Поддерживается выбор только одного узла. [Методы выбора](/reference/node-selection/methods), [операторы графа](/reference/node-selection/graph-operators) и другие методы, выбирающие несколько узлов, не применяются.
- Выполнить этот запрос в хранилище данных
- Просмотреть результаты в терминале
<VersionBlock firstVersion="2.0">
- Выполнять запросы к [dbt Information Schema](/docs/build/dbt-information-schema) напрямую из CLI с помощью флага `--info`, без подключения к вашему хранилищу данных
</VersionBlock>

- Скомпилировать dbt-SQL определение одного `model`, `test`, `analysis` или произвольного dbt-SQL запроса, переданного через `--inline`
  - `dbt show` не поддерживает модели на [Python (dbt-py)](/docs/build/python-models).
  - Поддерживается выбор только одного узла. [Методы селекторов](/reference/node-selection/methods), [графовые операторы](/reference/node-selection/graph-operators) и другие методы, которые выбирают несколько узлов, использоваться не будут.
- Выполнить этот запрос в хранилище данных
- Предварительно просмотреть результаты в терминале

## Как это работает {#how-it-works}

При предварительном просмотре модели dbt всегда компилирует запрос из исходного кода и выполняет скомпилированный запрос. Он не считывает данные из уже материализованного объекта базы данных, даже если вы только что запустили модель. (Возможно, мы добавим такую возможность в будущем; если вы в этом заинтересованы, проголосуйте за [dbt-labs/dbt#7391](https://github.com/dbt-labs/dbt/issues/7391) или оставьте комментарий.)

При предпросмотре модели dbt всегда компилирует и выполняет скомпилированный запрос напрямую из исходного кода. Он не делает `select` из уже материализованного отношения в базе данных, даже если вы только что выполнили модель. (Возможно, мы добавим такую поддержку в будущем; если вам это интересно, поставьте апвоут или оставьте комментарий в [dbt-core#7391](https://github.com/dbt-labs/dbt-core/issues/7391).)

#### Флаг `limit` {#limit-flag}
- Флаг `--limit` изменяет сам SQL-запрос, а не только количество отображаемых строк. Использование флага `--limit n` означает, что `n` — это количество строк, которые будут отображены и фактически получены из хранилища данных.
- Это означает, что dbt оборачивает запрос вашей модели в подзапрос или CTE и применяет SQL-оператор `limit n`, благодаря чему хранилище данных обрабатывает и возвращает только указанное количество строк. Это значительно ускоряет работу с большими наборами данных.

<VersionBlock firstVersion="2.0">

#### Флаг `--info`
- Флаг `--info <view>` позволяет выполнять запросы к [информационной схеме dbt](/docs/build/dbt-information-schema) напрямую из CLI. Он считывает данные из промежуточных представлений и не подключается к вашему хранилищу данных. 
- Он эквивалентен `--inline "select * from {{ info_schema('<view>') }}"`.

```shell
dbt show --info models
dbt show --info models --limit 20
```

Вы также можете писать собственные SQL-запросы к информационной схеме с помощью `--inline`:

```shell
dbt show --inline "select name from {{ info_schema('models') }} order by name"
```

</VersionBlock>

### Флаг `--output json`
- Флаг `--output json` возвращает результаты `dbt show` в формате JSON вместо стандартного формата, удобного для чтения человеком, что полезно для использования в скриптах и автоматизации.
- Если вы хотите, чтобы весь вывод терминала (включая логи) был в машиночитаемом формате JSON, вы также можете задать `--log-format json`.

## Пример

```
dbt show --select "model_name.sql"
```

или

```
dbt show --inline "select * from {{ ref('model_name') }}"
```

Ниже приведен пример вывода `dbt show` для модели с именем `stg_orders`:

```bash
dbt show --select "stg_orders"
21:17:38 Running with dbt=1.5.0-b5
21:17:38 Found 5 models, 20 tests, 0 snapshots, 0 analyses, 425 macros, 0 operations, 3 seed files, 0 sources, 0 exposures, 0 metrics, 0 groups
21:17:38
21:17:38 Concurrency: 24 threads (target='dev')
21:17:38
21:17:38 Previewing node 'stg_orders' :
| order_id | customer_id | order_date | status    |
|----------+-------------+------------+--------   |
| 1        |           1 | 2023-01-01 | returned  |
| 2        |           3 | 2023-01-02 | completed |
| 3        |          94 | 2023-01-03 | completed |
| 4        |          50 | 2023-01-04 | completed |
| 5        |          64 | 2023-01-05 | completed |

```

Например, если вы только что создали модель, в которой тест не прошел, вы можете быстро просмотреть ошибки теста прямо в терминале, чтобы найти значения `id`, которые дублируются:

```bash
$ dbt build -s "my_model_with_duplicates"
13:22:47 .0
...
13:22:48 Completed with 1 error and 0 warnings:
13:22:48
13:22:48 Failure in test unique_my_model_with_duplicates (models/schema.yml)
13:22:48   Got 1 result, configured to fail if not 0
13:22:48
13:22:48   compiled code at target/compiled/my_dbt_project/models/schema.yml/unique_my_model_with_duplicates_id.sql
13:22:48
13:22:48 Done. PASS=1 WARN=0 ERROR=1 SKIP=0 TOTAL=2

$ dbt show -s "unique_my_model_with_duplicates_id"
13:22:53 Running with dbt=1.5.0
13:22:53 Found 4 models, 2 tests, 0 snapshots, 0 analyses, 309 macros, 0 operations, 0 seed files, 0 sources, 0 exposures, 0 metrics, 0 groups
13:22:53
13:22:53 Concurrency: 5 threads (target='dev')
13:22:53
13:22:53 Previewing node 'unique_my_model_with_duplicates_id':
| unique_field | n_records |
| ------------ | --------- |
|            1 |         2 |

```
```sh
dbt show --inline "select 1" --output json --log-format json
```
Вы получите результат примерно такого вида:

```json
{
  "data": {
    "is_inline": true,
    "node_name": "inline_query",
    "output_format": "json",
    "preview": "[{\"ID\": 1}]",
    "quiet": false,
    "unique_id": "sql_operation.jaffle_shop.inline_query"
  },
  "info": {
    "code": "Q041",
    "level": "info",
    "msg": "{\n  \"show\": [\n    {\n      \"ID\": 1\n    }\n  ]\n}\n",
    "name": "ShowNode",
    "thread": "MainThread"
  }
}
```
