---
title: "О команде dbt show"
sidebar_label: "show"
id: "show"
---

Используйте `dbt show` для:
- Компиляции dbt-SQL определения `модели`, `теста`, `анализа` или произвольного dbt-SQL запроса, переданного с помощью `--inline`
  - `dbt show` не поддерживает [Python (dbt-py)](/docs/build/python-models) модели.
- Выполнения этого запроса в хранилище данных
- Предварительного просмотра результатов в терминале

По умолчанию, `dbt show` отображает первые 5 строк из результата запроса. Это можно изменить, передав флаг `--limit n`, где `n` — количество строк для отображения.

Результаты предварительного просмотра запроса не материализуются в хранилище данных и не сохраняются в каком-либо файле dbt. Они включаются только в логи dbt и отображаются в терминале. Обратите внимание, что при предварительном просмотре модели dbt всегда компилирует и выполняет скомпилированный запрос из исходного кода. Он не будет выбирать из уже материализованной базы данных, даже если вы только что запустили модель. (Мы можем поддержать это в будущем; если вам это интересно, проголосуйте или оставьте комментарий в [dbt-core#7391](https://github.com/dbt-labs/dbt-core/issues/7391).)

Пример:

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
13:22:47 Running with dbt=1.5.0
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