---
title: Как запускать тесты данных только для источников?
description: "Используйте команду select source, чтобы запускать тесты для источников"
id: testing-sources

---

Чтобы запустить тесты данных для всех источников, используйте следующую команду:

```shell
  dbt test --select "source:*"
```

(Вы также можете использовать сокращение `-s` вместо `--select`)

Чтобы запустить проверки данных для одного источника (и всех его таблиц):

```shell
$ dbt test --select source:jaffle_shop
```

А чтобы запустить **data tests** только для одного источника <Term id="table" />:

```shell
$ dbt test --select source:jaffle_shop.orders
```