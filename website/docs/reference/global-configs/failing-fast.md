---
title: "Быстрое завершение"
id: "failing-fast"
sidebar: "Быстрое завершение"
---

Передайте флаг `-x` или `--fail-fast` команде `dbt run`, чтобы dbt немедленно завершал работу, если один из ресурсов не удалось построить. Если другие модели находятся в процессе выполнения, когда первая модель завершилась с ошибкой, dbt прекратит соединения для этих все еще работающих моделей.

Например, вы можете выбрать четыре модели для выполнения, но если ошибка произойдет в первой модели, это помешает выполнению других моделей:

```text
dbt -x run --threads 1
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