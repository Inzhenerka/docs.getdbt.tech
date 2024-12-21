---
title: "Конфигурации Apache Hive"
description: "Конфигурации Apache Hive - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "hive-configs"
---

## Конфигурация таблиц

При материализации модели как `table`, вы можете включить несколько дополнительных конфигураций, которые специфичны для плагина dbt-hive, в дополнение к стандартным [конфигурациям моделей](/reference/model-configs).

| Опция  | Описание                                        | Обязательно?               | Пример                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| partition_by | разделение по столбцу, обычно создается отдельный каталог для каждого раздела | Нет | partition_by=['name'] |
| clustered_by | вторичный уровень деления разделенного столбца  | Нет | clustered_by=['age'] |
| file_format | формат хранения таблицы, см. https://cwiki.apache.org/confluence/display/Hive/FileFormats для поддерживаемых форматов | Нет | file_format='PARQUET' |
| location | место хранения, обычно это путь hdfs | Нет | LOCATION='/user/etl/destination' |
| comment | комментарий для таблицы | Нет | comment='this is the cleanest model' |

## Инкрементные модели

Поддерживаемые режимы для инкрементной модели:
 - **`append`** (по умолчанию): Вставка новых записей без обновления или перезаписи существующих данных.
 - **`insert_overwrite`**: Для новых записей вставка данных. При использовании вместе с разделом partition обновление данных для измененной записи и вставка данных для новых записей.

## Пример: Использование опции конфигурации partition_by

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