---
title: Как запустить тесты только на моих источниках?
description: "Используйте команду select source для тестирования источников"
sidebar_label: 'Запуск тестов на всех источниках'
id: testing-sources

---

Чтобы запустить тесты на всех источниках, используйте следующую команду:

```shell
  dbt test --select "source:*"
```

(Вы также можете использовать сокращение `-s` вместо `--select`)

Чтобы запустить тесты на одном источнике (и на всех его таблицах):

```shell
$ dbt test --select source:jaffle_shop
```

А чтобы запустить тесты только на одном источнике <Term id="table" />:

```shell
$ dbt test --select source:jaffle_shop.orders
```