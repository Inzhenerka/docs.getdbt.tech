---
title: Как исключить таблицу из снимка актуальности?
description: "Используйте null, чтобы исключить таблицу из снимка актуальности"
sidebar_label: 'Исключить таблицу из снимка актуальности'
id: exclude-table-from-freshness

---

Некоторые таблицы в источнике данных могут обновляться нечасто. Если вы установили свойство `freshness` на уровне источника, эта <Term id="table" /> вероятно не пройдет проверки.

Чтобы обойти это, вы можете установить актуальность таблицы в null (`freshness: null`), чтобы "снять" актуальность для конкретной таблицы:

<File name='models/<filename>.yml'>

```yaml

version: 2

sources:
  - name: jaffle_shop
    database: raw
    config: 
      freshness: # changed to config in v1.9
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}

      loaded_at_field: _etl_loaded_at # changed to config in v1.10

    tables:
      - name: orders
      - name: product_skus
        config:
          freshness: null # не проверять freshness для этой таблицы
```

</File>