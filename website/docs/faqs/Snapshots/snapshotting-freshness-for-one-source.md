---
title: Как сделать снимок свежести только для одного источника?
description: "Используйте флаг select для создания снимка конкретных источников"
sidebar_label: 'Снимок свежести для конкретных источников.'
id: snapshotting-freshness-for-one-source

---

Используйте флаг `--select`, чтобы сделать снимок свежести для конкретных источников. Например:

```shell
# Снимок свежести для всех таблиц Jaffle Shop:
$ dbt source freshness --select source:jaffle_shop

# Снимок свежести для конкретного источника <Term id="table" />:
$ dbt source freshness --select source:jaffle_shop.orders

# Снимок свежести для нескольких конкретных таблиц источников:
$ dbt source freshness --select source:jaffle_shop.orders source:jaffle_shop.customers
```

Смотрите [справочник команды `source freshness`](/reference/commands/source) для получения дополнительной информации.