---
title: Как сделать снимок актуальности только для одного источника?
description: "Используйте флаг select для снимка актуальности конкретных источников"
sidebar_label: 'Снимок актуальности для конкретных источников.'
id: snapshotting-freshness-for-one-source

---

Используйте флаг `--select`, чтобы сделать снимок актуальности для конкретных источников. Например:

```shell
# Сделать снимок актуальности для всех таблиц Jaffle Shop:
$ dbt source freshness --select source:jaffle_shop

# Сделать снимок актуальности для конкретного источника <Term id="table" />:
$ dbt source freshness --select source:jaffle_shop.orders

# Сделать снимок актуальности для нескольких конкретных таблиц источников:
$ dbt source freshness --select source:jaffle_shop.orders source:jaffle_shop.customers
```

Смотрите [справочник по команде `source freshness`](/reference/commands/source) для получения дополнительной информации.