---
title: "О команде dbt retry"
sidebar_label: "retry"
id: "retry"
---

Команда `dbt retry` повторно выполняет последнюю команду `dbt`, начиная с узла, на котором произошёл сбой.

- Если до момента ошибки не было выполнено ни одного узла (например, запуск завершился неудачей на раннем этапе из‑за проблем с подключением к хранилищу данных или с правами доступа), `dbt retry` ничего не выполнит, так как нет записанных узлов, с которых можно продолжить.
- В таких случаях мы рекомендуем проверить файл [`run_results.json`](/reference/artifacts/run-results-json) и вручную перезапустить полный job, чтобы узлы были построены.
- После того как хотя бы часть узлов была выполнена, вы можете использовать `dbt retry` для повторного запуска, начиная с любой новой точки сбоя.
- Если ранее выполненная команда завершилась успешно, `dbt retry` завершится как `no operation` (без выполнения каких‑либо действий).

Команда retry работает со следующими командами:

- [`build`](/reference/commands/build)
- [`compile`](/reference/commands/compile)
- [`clone`](/reference/commands/clone)
- [`docs generate`](/reference/commands/cmd-docs#dbt-docs-generate)
- [`seed`](/reference/commands/seed)
- [`snapshot`](/reference/commands/build)
- [`test`](/reference/commands/test)
- [`run`](/reference/commands/run)
- [`run-operation`](/reference/commands/run-operation)

`dbt retry` ссылается на [run_results.json](/reference/artifacts/run-results-json), чтобы определить, с какого места начать. Выполнение `dbt retry` без исправления предыдущих ошибок приведет к <Term id="idempotent" /> результатам.

`dbt retry` повторно использует [селекторы](/reference/node-selection/yaml-selectors) из ранее выполненной команды.

Пример результатов выполнения `dbt retry` после успешного `dbt run`:

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models
 
Nothing to do. Try checking your model configs and model specification args
```

Пример, когда `dbt run` сталкивается с синтаксической ошибкой в модели:

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models

Concurrency: 24 threads (target='dev')
 
1 of 5 START sql view model main.stg_customers ................................. [RUN]
2 of 5 START sql view model main.stg_orders .................................... [RUN]
3 of 5 START sql view model main.stg_payments .................................. [RUN]
1 of 5 OK created sql view model main.stg_customers ............................ [OK in 0.06s]
2 of 5 OK created sql view model main.stg_orders ............................... [OK in 0.06s]
3 of 5 OK created sql view model main.stg_payments ............................. [OK in 0.07s]
4 of 5 START sql table model main.customers .................................... [RUN]
5 of 5 START sql table model main.orders ....................................... [RUN]
4 of 5 ERROR creating sql table model main.customers ........................... [ERROR in 0.03s]
5 of 5 OK created sql table model main.orders .................................. [OK in 0.04s]
 
Finished running 3 view models, 2 table models in 0 hours 0 minutes and 0.15 seconds (0.15s).
  
Completed with 1 error and 0 warnings:
  
Runtime Error in model customers (models/customers.sql)
 Parser Error: syntax error at or near "selct"

Done. PASS=4 WARN=0 ERROR=1 SKIP=0 TOTAL=5
```

Пример последующего неудачного выполнения `dbt retry` без исправления ошибок:

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models

Concurrency: 24 threads (target='dev')

1 of 1 START sql table model main.customers .................................... [RUN]
1 of 1 ERROR creating sql table model main.customers ........................... [ERROR in 0.03s]

Done. PASS=4 WARN=0 ERROR=1 SKIP=0 TOTAL=5
```

Пример успешного выполнения `dbt retry` после исправления ошибок:

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models
 
Concurrency: 24 threads (target='dev')

1 of 1 START sql table model main.customers .................................... [RUN]
1 of 1 OK created sql table model main.customers ............................... [OK in 0.05s]

Finished running 1 table model in 0 hours 0 minutes and 0.09 seconds (0.09s).
 
Completed successfully
  
Done. PASS=1 WARN=0 ERROR=0 SKIP=0 TOTAL=1
```

В каждом сценарии `dbt retry` продолжает выполнение с места ошибки, а не запускает все вышестоящие зависимости заново.