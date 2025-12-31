---
title: "Конфигурации Cloudera Hive"
description: "Конфигурации Cloudera Hive — прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "hive-configs"
---

## Конфигурация таблиц {#configuring-tables}

При материализации модели как `table`, вы можете включить несколько дополнительных конфигураций, которые специфичны для плагина dbt-hive, в дополнение к стандартным [конфигурациям моделей](/reference/model-configs).

| Опция  | Описание                                        | Обязательно?               | Пример                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| partition_by | разбиение по колонке; как правило, для каждого раздела создаётся отдельная директория | No | partition_by=['name'] |
| clustered_by | второй уровень разбиения внутри секции, заданной partitioned column | No | clustered_by=['age'] |
| file_format | базовый формат хранения таблицы; поддерживаемые форматы см. https://cwiki.apache.org/confluence/display/Hive/FileFormats | No | file_format='PARQUET' |
| location | место хранения данных, как правило путь в HDFS | No | LOCATION='/user/etl/destination' |
| comment | комментарий к таблице | No | comment='this is the cleanest model' |
| external | является ли таблица внешней — true / false | No | external=true |
| tbl_properties | произвольные метаданные, которые могут быть сохранены в виде пар ключ/значение у таблицы | No | tbl_properties="('dbt_test'='1')" |
| table_type | указывает тип таблицы | No | table_type="iceberg" |

## Инкрементные модели {#incremental-models}

Поддерживаемые режимы для инкрементной модели:
 - **`append`** (по умолчанию): Вставка новых записей без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Для новых записей вставка данных. При использовании вместе с разделом partition обновление данных для измененной записи и вставка данных для новых записей.

## Пример: Использование опции конфигурации partition_by {#example-using-partition_by-config-option}

<File name='hive_partition_by.sql'>

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

В приведенном выше примере создается пример таблицы с использованием опции partition_by и других конфигураций. Одно из важных замечаний при использовании опции partition_by заключается в том, что в запросе select всегда должен быть указан столбец, используемый в опции partition_by, последним, как это видно для столбца ```city``` в приведенном выше запросе. Если раздел partition_by не совпадает с последним столбцом в операторе select, Hive выдаст ошибку при попытке создать модель.