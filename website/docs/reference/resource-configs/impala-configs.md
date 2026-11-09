---
title: "Конфигурации Cloudera Impala"
description: "Конфигурации Impala — прочитайте это подробное руководство, чтобы узнать о настройках в dbt."
id: "impala-configs"
---

## Конфигурирование таблиц {#configuring-tables}

При материализации модели как `table`, вы можете включить несколько дополнительных конфигураций, которые специфичны для плагина dbt-impala, в дополнение к стандартным [конфигурациям моделей](/reference/model-configs).

| Опция  | Описание                                        | Обязательно?               | Пример                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| partition_by | секционирование по столбцу; обычно для каждой секции создаётся отдельный каталог | Нет | partition_by=['name'] |
| sort_by | сортировка по столбцу  | Нет | sort_by=['age'] |
| row_format | формат для хранения отдельных строк | Нет | row_format='delimited' |
| stored_as | базовый формат хранения таблицы | Нет | stored_as='PARQUET' |
| location | расположение хранилища, обычно путь в HDFS | Нет | LOCATION='/user/etl/destination' |
| comment | комментарий к таблице | Нет | comment='this is the cleanest model' |
| serde_properties | свойства SerDes (сериализации и десериализации) таблицы | Нет | serde_properties="('quoteChar'='\'', 'escapeChar'='\\')" |
| tbl_properties | любые метаданные можно хранить вместе с таблицей в виде пар ключ/значение | Нет | tbl_properties="('dbt_test'='1')" |
| is_cached | true или false — указывает, кэшируется ли эта таблица | Нет | is_cached=false (по умолчанию) |
| cache_pool | имя пула кэша, используемого, если is_cached имеет значение true | Нет |  |
| replication_factor | коэффициент репликации кэша, используемый, если is_cached имеет значение true  | Нет | |  
| external | является ли таблица внешней — true / false | Нет | external=true |
| table_type | указывает тип таблицы — iceberg / kudu | Нет | table_type="iceberg" |

Для специфичных для Cloudera опций вышеуказанных параметров смотрите документацию CREATE TABLE (https://docs.cloudera.com/documentation/enterprise/6/6.3/topics/impala_create_table.html)

## Инкрементальные модели {#incremental-models}

Поддерживаемые режимы для инкрементальной модели:
 - **`append`** (по умолчанию): Вставка новых записей без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Для новых записей вставка данных. При использовании вместе с разделом partition обновление данных для измененной записи и вставка данных для новых записей. 

Неподдерживаемые режимы:
 - **`unique_key`** Этот вариант не поддерживается для инкрементальных моделей в dbt-impala
 - **`merge`**: Слияние не поддерживается базовым хранилищем, и, следовательно, не поддерживается dbt-impala

Неподдерживаемые режимы:
 - **`unique_key`** Эта опция не поддерживается для инкрементальных моделей в dbt-impala
 - **`merge`**: Операция Merge не поддерживается используемым хранилищем данных, поэтому она также не поддерживается в dbt-impala

## Пример: использование параметра конфигурации partition_by

<File name='impala_partition_by.sql'>

```sql
{{
    config(
        materialized='table',
        unique_key='id',
        partition_by=['city'],
    )
}}

with source_data as (
     select 1 as id, "Name 1" as name, "City 1" as city,
     union all
     select 2 as id, "Name 2" as name, "City 2" as city,
     union all
     select 3 as id, "Name 3" as name, "City 2" as city,
     union all
     select 4 as id, "Name 4" as name, "City 1" as city,
)

select * from source_data
```

</File>

В приведенном выше примере создается пример таблицы с использованием partition_by и других опций конфигурации. Одно из важных замечаний при использовании опции partition_by заключается в том, что в запросе select всегда должен быть указан столбец, используемый в опции partition_by, последним, как это видно для столбца ```city``` в приведенном выше запросе. Если раздел partition_by не совпадает с последним столбцом в операторе select, Impala выдаст ошибку при попытке создать модель.