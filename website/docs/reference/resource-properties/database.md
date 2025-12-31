---
title: "Определение свойства источника базы данных"
sidebar_label: "database"
resource_types: sources
datatype: database_name
---

<File name='models/<filename>.yml'>

```yml

sources:
  - name: <source_name>
    database: <database_name>
    tables:
      - name: <table_name>
      - ...

```

</File>

## Определение {#definition}
База данных, в которой хранится ваш источник.

Обратите внимание, что для использования этого параметра ваш склад данных должен поддерживать межбазовые запросы.

#### Терминология BigQuery {#bigquery-terminology}

Если вы используете BigQuery, используйте имя _проекта_ в качестве свойства `database:`.

## Значение по умолчанию {#default}
По умолчанию dbt будет искать в вашей целевой базе данных (т.е. в базе данных, в которой вы создаете таблицы и <Term id="view">представления</Term>).

## Примеры {#examples}
### Определение источника, который хранится в базе данных `raw` {#define-a-source-that-is-stored-in-the-raw-database}

<File name='models/<filename>.yml'>

```yml

sources:
  - name: jaffle_shop
    database: raw
    tables:
      - name: orders
      - name: customers

```

</File>