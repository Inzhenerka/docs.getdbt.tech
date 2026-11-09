---
title: "Быстрое завершение при ошибке"
id: "failing-fast"
sidebar: "Быстрое завершение при ошибке"
---

Передайте флаг `-x` или `--fail-fast` команде `dbt run`, `dbt build` или `dbt test`, чтобы dbt завершал работу сразу при первом сбое. `fail_fast` — глобальный флаг, поэтому он останавливает выполнение как при ошибках запуска, так и при ошибках тестирования —&mdash; а не только при ошибках запуска. Если в момент первого сбоя другие модели ещё выполняются, dbt закроет соединения для этих моделей.

Полные правила приоритета и сведения об эквивалентной переменной окружения (`DBT_FAIL_FAST`) см. в [строке `fail_fast` в разделе «О глобальных конфигурациях»](/reference/global-configs/about-global-configs#available-flags).

Например, вы можете выбрать для выполнения четыре модели, но если в первой модели произойдет ошибка, это предотвратит выполнение других моделей:

```text
$ dbt run -x --threads 1
Running with dbt=1.0.0
Found 4 models, 1 test, 1 snapshot, 2 analyses, 143 macros, 0 operations, 1 seed file, 0 sources

14:47:39 | Concurrency: 1 threads (target='dev')
14:47:39 |
14:47:39 | 1 of 4 START table model test_schema.model_1........... [RUN]
14:47:40 | 1 of 4 ERROR creating table model test_schema.model_1.. [ERROR in 0.06s]
14:47:40 | 2 of 4 START view model test_schema.model_2............ [RUN]
14:47:40 | CANCEL query model.debug.model_2....................... [CANCEL]
14:47:40 | 2 of 4 ERROR creating view model test_schema.model_2... [ERROR in 0.05s]

Database Error in model model_1 (models/model_1.sql)
  division by zero
  compiled SQL at target/run/debug/models/model_1.sql

Encountered an error:
FailFast Error in model model_1 (models/model_1.sql)
  Failing early due to test failure or runtime error
```