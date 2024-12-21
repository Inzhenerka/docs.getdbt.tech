---
title: Что делать, если мой источник находится в другой базе данных, чем целевая база данных?
description: "Используйте свойство database для определения источника в другой базе данных"
sidebar_label: 'Источник в другой базе данных, чем целевая база данных'
id: source-in-different-database

---

Используйте [свойство `database`](/reference/resource-properties/database) для определения базы данных, в которой находится источник.

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