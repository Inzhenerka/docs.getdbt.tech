### Об incremental_predicates

`incremental_predicates` — это продвинутое использование инкрементальных моделей, применяемое в случаях, когда объём данных достаточно велик, чтобы оправдать дополнительные инвестиции в производительность. Этот параметр конфигурации принимает список любых допустимых SQL-выражений. dbt **не проверяет синтаксис** SQL-выражений, указанных здесь.

Ниже приведён пример конфигурации модели в `yml`-файле, который можно встретить при работе со Snowflake:

```yml

models:
  - name: my_incremental_model
    config:
      materialized: incremental
      unique_key: id
      # this will affect how the data is stored on disk, and indexed to limit scans
      cluster_by: ['session_start']  
      incremental_strategy: merge
      # this limits the scan of the existing table to the last 7 days of data
      incremental_predicates: ["DBT_INTERNAL_DEST.session_start > dateadd(day, -7, current_date)"]
      # `incremental_predicates` accepts a list of SQL statements. 
      # `DBT_INTERNAL_DEST` and `DBT_INTERNAL_SOURCE` are the standard aliases for the target table and temporary table, respectively, during an incremental run using the merge strategy. 
```

В качестве альтернативы, те же самые параметры могут быть заданы непосредственно в файле модели:

```sql
-- in models/my_incremental_model.sql

{{
  config(
    materialized = 'incremental',
    unique_key = 'id',
    cluster_by = ['session_start'],  
    incremental_strategy = 'merge',
    incremental_predicates = [
      "DBT_INTERNAL_DEST.session_start > dateadd(day, -7, current_date)"
    ]
  )
}}

...

```

В результате dbt сгенерирует (в файле `dbt.log`) SQL-выражение `merge`, выглядящее примерно так:

```sql
merge into <existing_table> DBT_INTERNAL_DEST
    from <temp_table_with_new_records> DBT_INTERNAL_SOURCE
    on
        -- unique key
        DBT_INTERNAL_DEST.id = DBT_INTERNAL_SOURCE.id
        and
        -- custom predicate: limits data scan in the "old" data / existing table
        DBT_INTERNAL_DEST.session_start > dateadd(day, -7, current_date)
    when matched then update ...
    when not matched then insert ...
```

Чтобы ограничить сканирование данных в _вышестоящих_ (upstream) таблицах, используйте условия непосредственно в SQL-коде инкрементальной модели. Это позволит сократить объём «новых» данных, которые необходимо обрабатывать и трансформировать.

```sql
with large_source_table as (

    select * from {{ ref('large_source_table') }}
    {% if is_incremental() %}
        where session_start >= dateadd(day, -3, current_date)
    {% endif %}

),

...
```
