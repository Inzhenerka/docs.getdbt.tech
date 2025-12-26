---
title: Почему в выводе dbt так много макросов?
description: "Ваш проект dbt включает множество макросов."
sidebar_label: 'В проекте dbt много макросов'
id: why-so-many-macros

---

Вывод выполнения dbt насчитывает более 100 макросов в вашем проекте!

```shell
$ dbt run
Running with dbt=1.7.0
Found 1 model, 0 tests, 0 snapshots, 0 analyses, 138 macros, 0 operations, 0 seed files, 0 sources
```

Это происходит потому, что dbt поставляется со своим собственным проектом, который также включает макросы! Вы можете узнать больше об этом [здесь](https://discourse.getdbt.com/t/did-you-know-dbt-ships-with-its-own-project/764).