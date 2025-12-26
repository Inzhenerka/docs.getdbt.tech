---
title: Что произойдет, если в моем SQL-запросе ошибка или я получу ошибку базы данных?
description: "Используйте сообщение об ошибке и логи для отладки"
sidebar_label: 'Как отладить SQL или ошибку базы данных'
id: sql-errors

---

Если в вашем SQL есть ошибка, dbt вернет ошибку, которую возвращает ваша база данных.

```shell
$ dbt run --select customers
Running with dbt=1.9.0
Found 3 models, 9 tests, 0 snapshots, 0 analyses, 133 macros, 0 operations, 0 seed files, 0 sources

14:04:12 | Concurrency: 1 threads (target='dev')
14:04:12 |
14:04:12 | 1 of 1 START view model dbt_alice.customers.......................... [RUN]
14:04:13 | 1 of 1 ERROR creating view model dbt_alice.customers................. [ERROR in 0.81s]
14:04:13 |
14:04:13 | Finished running 1 view model in 1.68s.

Completed with 1 error and 0 warnings:

Database Error in model customers (models/customers.sql)
  Syntax error: Expected ")" but got identifier `your-info-12345` at [13:15]
  compiled SQL at target/run/jaffle_shop/customers.sql

Done. PASS=0 WARN=0 ERROR=1 SKIP=0 TOTAL=1
```

Любые модели, зависящие от этой модели, также будут пропущены. Используйте сообщение об ошибке и [скомпилированный SQL](/faqs/Runs/checking-logs) для отладки любых ошибок.