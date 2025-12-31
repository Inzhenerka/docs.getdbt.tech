---
title: "Конфигурации Greenplum"
description: "Конфигурации Greenplum - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "greenplum-configs"
---

## Оптимизация производительности {#performance-optimizations}

Таблицы в Greenplum имеют мощные конфигурации оптимизации для улучшения производительности запросов:

- распределение
- ориентация столбцов
- сжатие
- переключатель `appendonly`
- разделы

Указание этих значений в конфигурациях на уровне модели применяет соответствующие настройки в сгенерированной команде `CREATE TABLE` (кроме разделов). Обратите внимание, что эти настройки не будут иметь эффекта для моделей, установленных как `view`.

### Распределение {#distribution}

В Greenplum вы можете выбрать [ключ распределения](https://gpdb.docs.pivotal.io/6-4/admin_guide/distribution.html), который будет использоваться для сортировки данных по сегментам. Соединение по разделу станет более производительным после указания распределения.

По умолчанию dbt-greenplum распределяет данные `RANDOMLY`. Чтобы реализовать ключ распределения, вам нужно указать параметр `distributed_by` в конфигурации модели:

```sql
{{
    config(
        ...
        distributed_by='<field_name>'
        ...
    )
}}


select ...
```

Также вы можете выбрать опцию `DISTRIBUTED REPLICATED`:

```sql
{{
    config(
        ...
        distributed_replicated=true
        ...
    )
}}


select ...
```

### Ориентация столбцов {#column-orientation}

Greenplum поддерживает два типа [ориентации](https://gpdb.docs.pivotal.io/6-6/admin_guide/ddl/ddl-storage.html#topic39): строковую и столбцовую:

```sql
{{
    config(
        ...
        orientation='column'
        ...
    )
}}


select ...
```

### Сжатие {#compression}

Сжатие позволяет уменьшить время чтения и записи. Greenplum предлагает несколько [алгоритмов](https://gpdb.docs.pivotal.io/6-6/admin_guide/ddl/ddl-storage.html#topic40) для сжатия таблиц с оптимизацией добавления:
- RLE_TYPE (только для таблиц с ориентацией по столбцам)
- ZLIB
- ZSTD
- QUICKLZ

```sql
{{
    config(
        ...
        appendonly='true',
        compresstype='ZLIB',
        compresslevel=3,
        blocksize=32768
        ...
    )
}}


select ...
```

Как вы можете видеть, вы также можете указать `compresslevel` и `blocksize`.

### Разделы {#partition}

Greenplum не поддерживает разделы с конструкцией `create table as` [конструкция](https://gpdb.docs.pivotal.io/6-9/ref_guide/sql_commands/CREATE_TABLE_AS.html), поэтому вам нужно строить модель в два этапа:

1. создать схему таблицы
2. вставить данные

Чтобы реализовать разделы в вашей dbt-модели, вам нужно указать следующие параметры конфигурации:
- `fields_string` - определение имен столбцов, типов и ограничений
- `raw_partition` - спецификация раздела

```sql
{% set fields_string %}
    some_filed int4 null,
    date_field timestamp NULL
{% endset %}


{% set raw_partition %}
   PARTITION BY RANGE (date_field)
   (
       START ('2021-01-01'::timestamp) INCLUSIVE
       END ('2023-01-01'::timestamp) EXCLUSIVE
       EVERY (INTERVAL '1 day'),
       DEFAULT PARTITION default_part
   );
{% endset %}

{{
   config(
       ...
       fields_string=fields_string,
       raw_partition=raw_partition,
       ...
   )
}}

select *
```