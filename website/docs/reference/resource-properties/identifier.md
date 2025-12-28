---
resource_types: sources
datatype: table_identifier
---

<File name='models/<filename>.yml'>

```yml

sources:
  - name: <source_name>
    database: <database_name>
    tables:
      - name: <table_name>
        identifier: <table_identifier>

```

</File>

## Определение
Имя <Term id="table" />, как оно хранится в базе данных.

Этот параметр полезен, если вы хотите использовать имя исходной таблицы, которое отличается от имени таблицы в базе данных.

## Значение по умолчанию
По умолчанию dbt будет использовать параметр `name` таблицы в качестве идентификатора.

## Примеры
### Использование более простого имени для исходной таблицы, чем в базе данных

<File name='models/<filename>.yml'>

```yml

sources:
  - name: jaffle_shop
    tables:
      - name: orders
        identifier: api_orders

```

</File>

В downstream‑модели:
```sql
select * from {{ source('jaffle_shop', 'orders') }}
```

Будет скомпилировано в:
```sql
select * from jaffle_shop.api_orders
```

### Ссылка на шардированные таблицы как на источник в BigQuery

<File name='models/<filename>.yml'>

```yml

sources:
  - name: ga
    tables:
      - name: events
        identifier: "events_*"

```

</File>

В downstream‑модели:
```sql
select * from {{ source('ga', 'events') }}

-- filter on shards by suffix
where _table_suffix > '20200101'
```

Будет скомпилировано в:
```sql
select * from `my_project`.`ga`.`events_*`

-- filter on shards by suffix
where _table_suffix > '20200101'
```
