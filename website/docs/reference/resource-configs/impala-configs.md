---
title: "Конфигурации Cloudera Impala"
description: "Конфигурации Impala — прочитайте это подробное руководство, чтобы узнать о настройках в dbt."
id: "impala-configs"
---

## Конфигурирование таблиц

При материализации модели как `table`, вы можете включить несколько дополнительных конфигураций, которые специфичны для плагина dbt-impala, в дополнение к стандартным [конфигурациям моделей](/reference/model-configs).

| Опция  | Описание                                        | Обязательно?               | Пример                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| partition_by | разбиение по столбцу; как правило, для каждого партициона создаётся отдельный каталог | No | partition_by=['name'] |
| sort_by | сортировка по столбцу | No | sort_by=['age'] |
| row_format | формат, который будет использоваться при хранении отдельных строк | No | row_format='delimited' |
| stored_as | базовый формат хранения таблицы | No | stored_as='PARQUET' |
| location | место хранения, как правило путь в HDFS | No | LOCATION='/user/etl/destination' |
| comment | комментарий к таблице | No | comment='this is the cleanest model' |
| serde_properties | свойства SerDe (сериализации/десериализации) таблицы | No | serde_properties="('quoteChar'='\'', 'escapeChar'='\\')" |
| tbl_properties | произвольные метаданные, которые могут быть сохранены с таблицей в виде пар ключ/значение | No | tbl_properties="('dbt_test'='1')" |
| is_cached | true или false — указывает, кэшируется ли таблица | No | is_cached=false (default) |
| cache_pool | имя пула кэша, используемого если is_cached установлено в true | No |  |
| replication_factor | коэффициент репликации кэша, используемый если is_cached установлено в true | No | |  
| external | является ли таблица внешней — true / false | No | external=true |
| table_type | указывает тип таблицы — iceberg / kudu | No | table_type="iceberg" |

Для специфичных для Cloudera опций вышеуказанных параметров смотрите документацию CREATE TABLE (https://docs.cloudera.com/documentation/enterprise/6/6.3/topics/impala_create_table.html)

## Инкрементальные модели

Поддерживаемые режимы для инкрементальной модели:
 - **`append`** (по умолчанию): Вставка новых записей без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Для новых записей вставка данных. При использовании вместе с разделом partition обновление данных для измененной записи и вставка данных для новых записей. 

Неподдерживаемые режимы:
 - **`unique_key`** Этот вариант не поддерживается для инкрементальных моделей в dbt-impala
 - **`merge`**: Слияние не поддерживается базовым хранилищем, и, следовательно, не поддерживается dbt-impala

## Пример: Использование опции конфигурации partition_by

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