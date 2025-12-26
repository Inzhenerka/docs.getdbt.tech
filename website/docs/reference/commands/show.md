---
title: "О команде dbt show"
sidebar_label: "show"
id: "show"
---

Используйте `dbt show`, чтобы:

- Скомпилировать dbt-SQL определение одного `model`, `test`, `analysis` или произвольного dbt-SQL запроса, переданного через `--inline`
  - `dbt show` не поддерживает модели на [Python (dbt-py)](/docs/build/python-models).
  - Поддерживается выбор только одного узла. [Методы селекторов](/reference/node-selection/methods), [графовые операторы](/reference/node-selection/graph-operators) и другие методы, которые выбирают несколько узлов, использоваться не будут.
- Выполнить этот запрос в хранилище данных
- Предварительно просмотреть результаты в терминале

## Как это работает

По умолчанию `dbt show` отображает первые 5 строк результата запроса. Это поведение можно изменить, передав флаги `limit` или `inline`, где `n` — количество строк для отображения.

При предпросмотре модели dbt всегда компилирует и выполняет скомпилированный запрос напрямую из исходного кода. Он не делает `select` из уже материализованного отношения в базе данных, даже если вы только что выполнили модель. (Возможно, мы добавим такую поддержку в будущем; если вам это интересно, поставьте апвоут или оставьте комментарий в [dbt-core#7391](https://github.com/dbt-labs/dbt-core/issues/7391).)

#### Флаг `limit`
- Флаг `--limit` изменяет сам SQL-запрос, а не только количество отображаемых строк. Использование флага `--limit n` означает, что `n` — это количество строк, которые будут отображены и фактически получены из хранилища данных.
- Это означает, что dbt оборачивает запрос вашей модели в подзапрос или CTE и применяет SQL-оператор `limit n`, благодаря чему хранилище данных обрабатывает и возвращает только указанное количество строк. Это значительно ускоряет работу с большими наборами данных.

#### Флаг `inline`
- Результаты запроса для предпросмотра включаются только в логи dbt и отображаются в терминале; они не материализуются в хранилище данных и не сохраняются ни в одном файле dbt, за исключением случая, когда вы используете `dbt show --inline`.
- Флаг `--inline` позволяет выполнять ad-hoc SQL, то есть dbt не может гарантировать, что запрос не изменит данные в хранилище. Чтобы убедиться, что изменения не вносятся, используйте профиль или роль с правами только на чтение, которые настраиваются непосредственно в вашем хранилище данных. Например: `dbt show --inline "select * from my_table" --profile my-read-only-profile`.

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