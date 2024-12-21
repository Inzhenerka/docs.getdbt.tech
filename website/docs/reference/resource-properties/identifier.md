## Определение
Имя <Term id="table" /> так, как оно хранится в базе данных.

Этот параметр полезен, если вы хотите использовать имя таблицы источника, которое отличается от имени таблицы в базе данных.

## По умолчанию
По умолчанию dbt будет использовать параметр `name` таблицы в качестве идентификатора.

## Примеры
### Использование более простого имени для таблицы источника, чем в вашей базе данных

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: jaffle_shop
    tables:
      - name: orders
        identifier: api_orders

```

</File>

В модели, использующей данные из источника:
```sql
select * from {{ source('jaffle_shop', 'orders') }}
```

Будет скомпилировано в:
```sql
select * from jaffle_shop.api_orders
```

### Ссылка на шардированные таблицы как источник в BigQuery

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: ga
    tables:
      - name: events
        identifier: "events_*"

```

</File>

В модели, использующей данные из источника:
```sql
select * from {{ source('ga', 'events') }}

-- фильтрация по шардированным таблицам по суффиксу
where _table_suffix > '20200101'
```

Будет скомпилировано в:
```sql
select * from `my_project`.`ga`.`events_*`

-- фильтрация по шардированным таблицам по суффиксу
where _table_suffix > '20200101'
```