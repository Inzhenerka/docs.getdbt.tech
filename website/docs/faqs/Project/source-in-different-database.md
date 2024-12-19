---
title: Что делать, если мой источник находится в другой базе данных, чем целевая база данных?
description: "Используйте свойство базы данных для определения источника в другой базе данных"
sidebar_label: 'Источник находится в другой базе данных, чем целевая база данных'
id: source-in-different-database

---

Используйте [`свойство database`](/reference/resource-properties/database), чтобы определить базу данных, в которой находится источник.

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: jaffle_shop
    database: raw
    tables:
      - name: orders
      - name: customers

```

</File>