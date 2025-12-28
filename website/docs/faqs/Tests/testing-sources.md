---
title: Как запустить data-тесты только для источников?
description: "Используйте команду select source для тестирования источников"
sidebar_label: 'Запуск data-тестов для всех источников'
id: testing-sources

---

Чтобы запустить data-тесты для всех источников, используйте следующую команду:

```shell
  dbt test --select "source:*"
```

(Здесь также можно использовать сокращённый вариант `-s` вместо `--select`)

Чтобы запустить data-тесты для одного источника (и всех его таблиц):

```shell
$ dbt test --select source:jaffle_shop
```

И, чтобы запустить data-тесты только для одной таблицы источника <Term id="table" />:

```shell
$ dbt test --select source:jaffle_shop.orders
```
