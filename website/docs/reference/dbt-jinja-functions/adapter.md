---
title: "Об объекте adapter"
sidebar_label: "adapter"
id: "adapter"
description: "Обертка для внутреннего адаптера базы данных с помощью Jinja объекта `adapter`."
---

Ваша база данных взаимодействует с dbt с помощью внутреннего объекта адаптера базы данных. Например, BaseAdapter и SnowflakeAdapter. Jinja объект `adapter` является оберткой вокруг этого внутреннего объекта адаптера базы данных.

`adapter` предоставляет возможность вызывать методы адаптера этого внутреннего класса через:
* `{% do adapter.<имя метода> %}` -- вызов внутреннего метода адаптера
* `{{ adapter.<имя метода> }}` -- вызов внутреннего метода адаптера и захват его возвращаемого значения для использования в материализации или других макросах

Например, методы адаптера ниже будут переведены в конкретные SQL-запросы в зависимости от типа адаптера, который использует ваш проект:

- [adapter.dispatch](/reference/dbt-jinja-functions/dispatch)
- [adapter.get_missing_columns](#get_missing_columns)
- [adapter.expand_target_column_types](#expand_target_column_types)
- [adapter.get_relation](#get_relation) или [load_relation](#load_relation)
- [adapter.get_columns_in_relation](#get_columns_in_relation)
- [adapter.create_schema](#create_schema)
- [adapter.drop_schema](#drop_schema)
- [adapter.drop_relation](#drop_relation)
- [adapter.rename_relation](#rename_relation)
- [adapter.quote](#quote)

### Устаревшие функции адаптера

Следующие функции адаптера устарели и будут удалены в будущих версиях.
- [adapter.get_columns_in_table](#get_columns_in_table) **(устарело)**
- [adapter.already_exists](#already_exists) **(устарело)**
- [adapter_macro](#adapter_macro) **(устарело)**

## dispatch

Перемещено на отдельную страницу: [dispatch](/reference/dbt-jinja-functions/dispatch)

## get_missing_columns
__Аргументы__:

 * `from_relation`: Исходная [Relation](/reference/dbt-classes#relation)
 * `to_relation`: Целевая [Relation](/reference/dbt-classes#relation)

Возвращает список [Columns](/reference/dbt-classes#column), который является разницей между столбцами в `from_table` и столбцами в `to_table`, т.е. (`set(from_relation.columns) - set(to_table.columns)`). Полезно для обнаружения новых столбцов в исходной <Term id="table" />.

**Использование**:

<File name='models/example.sql'>

```sql
{%- set target_relation = api.Relation.create(
      database='database_name',
      schema='schema_name',
      identifier='table_name') -%}


{% for col in adapter.get_missing_columns(target_relation, this) %}
  alter table {{this}} add column "{{col.name}}" {{col.data_type}};
{% endfor %}
```

</File>

## expand_target_column_types
__Аргументы__:

 * `from_relation`: Исходная [Relation](/reference/dbt-classes#relation) для использования в качестве шаблона
 * `to_relation`: [Relation](/reference/dbt-classes#relation) для изменения

Расширяет типы столбцов <Term id="table" /> `to_relation`, чтобы они соответствовали схеме `from_relation`. Расширение столбцов ограничено строковыми и числовыми типами в поддерживаемых базах данных. Типичное использование включает расширение типов столбцов (например, с `varchar(16)` до `varchar(32)`) для поддержки операторов вставки.

**Использование**:

<File name='example.sql'>

```sql
{% set tmp_relation = adapter.get_relation(...) %}
{% set target_relation = adapter.get_relation(...) %}

{% do adapter.expand_target_column_types(tmp_relation, target_relation) %}
```

</File>

## get_relation
__Аргументы__:

 * `database`: База данных для получения отношения
 * `schema`: Схема для получения отношения
 * `identifier`: Идентификатор для получения отношения

Возвращает кэшированный объект [Relation](/reference/dbt-classes#relation), идентифицированный `database.schema.identifier`, переданным методу, или `None`, если отношение не существует.

**Использование**:

<File name='example.sql'>

```sql

{%- set source_relation = adapter.get_relation(
      database="analytics",
      schema="dbt_drew",
      identifier="orders") -%}

{{ log("Source Relation: " ~ source_relation, info=true) }}

```

</File>

## load_relation
__Аргументы__:

 * `relation`: [Relation](/reference/dbt-classes#relation) для загрузки

Удобная обертка для [get_relation](#get_relation). Возвращает кэшированную версию объекта [Relation](/reference/dbt-classes#relation), или `None`, если отношение не существует.

**Использование**:

<File name='example.sql'>

```sql

{% set relation_exists = load_relation(ref('my_model')) is not none %}
{% if relation_exists %}
      {{ log("my_model has already been built", info=true) }}
{% else %}
      {{ log("my_model doesn't exist in the warehouse. Maybe it was dropped?", info=true) }}
{% endif %}

```

</File>

## get_columns_in_relation
__Аргументы__:

 * `relation`: [Relation](/reference/dbt-classes#relation) для поиска столбцов

Возвращает список [Columns](/reference/dbt-classes#column) в <Term id="table" />.

**Использование**:

<File name='example.sql'>

```sql

{%- set columns = adapter.get_columns_in_relation(this) -%}

{% for column in columns %}
  {{ log("Column: " ~ column, info=true) }}
{% endfor %}

```

</File>

## create_schema
__Аргументы__:

 * `relation`: Объект отношения с базой данных и схемой для создания. Любой идентификатор на отношении будет проигнорирован.

Создает схему (или эквивалент) в целевой базе данных. Если целевая схема уже существует, то этот метод не выполняет никаких действий.

**Использование:**

<File name='example.sql'>

```sql

{% do adapter.create_schema(api.Relation.create(database=target.database, schema="my_schema")) %}
```

</File>

## drop_schema
__Аргументы__:

 * `relation`: Объект отношения с базой данных и схемой для удаления. Любой идентификатор на отношении будет проигнорирован.

Удаляет схему (или эквивалент) в целевой базе данных. Если целевая схема не существует, то этот метод не выполняет никаких действий. Конкретная реализация зависит от адаптера, но адаптеры должны реализовывать каскадное удаление, так что объекты в схеме также удаляются. **Примечание**: этот метод адаптера является разрушительным, поэтому используйте его с осторожностью!

**Использование:**

<File name='example.sql'>

```sql

{% do adapter.drop_schema(api.Relation.create(database=target.database, schema="my_schema")) %}
```

</File>

## drop_relation
__Аргументы__:

 * `relation`: Отношение для удаления

Удаляет отношение в базе данных. Если целевое отношение не существует, то этот метод не выполняет никаких действий. Конкретная реализация зависит от адаптера, но адаптеры должны реализовывать каскадное удаление, так что связанные <Term id="view">представления</Term> ниже по потоку от удаленного отношения также удаляются. **Примечание**: этот метод адаптера является разрушительным, поэтому используйте его с осторожностью!

Метод `drop_relation` удалит указанное отношение из кэша отношений dbt.

**Использование:**

<File name='example.sql'>

```sql

{% do adapter.drop_relation(this) %}
```

</File>

## rename_relation
__Аргументы__:

 * `from_relation`: Отношение для переименования
 * `to_relation`: Целевое отношение для переименования `from_relation`

Переименовывает отношение в базе данных. Метод `rename_relation` переименует указанное отношение в кэше отношений dbt.

**Использование:**

<File name='example.sql'>

```sql

{%- set old_relation = adapter.get_relation(
      database=this.database,
      schema=this.schema,
      identifier=this.identifier) -%}

{%- set backup_relation = adapter.get_relation(
      database=this.database,
      schema=this.schema,
      identifier=this.identifier ~ "__dbt_backup") -%}

{% do adapter.rename_relation(old_relation, backup_relation) %}
```

</File>

## quote
__Аргументы__:

 * `identifier`: Строка для заключения в кавычки

Заключает `identifier` в правильные кавычки для адаптера при экранировании зарезервированных имен столбцов и т.д.

**Использование:**

<File name='example.sql'>

```sql
select 
      'abc' as {{ adapter.quote('table_name') }},
      'def' as {{ adapter.quote('group by') }} 
```

</File>

## get_columns_in_table

:::danger Устарело

Этот метод устарел и будет удален в будущих версиях. Пожалуйста, используйте [get_columns_in_relation](#get_columns_in_relation) вместо него.

:::

__Аргументы__:

 * `schema_name`: Схема для проверки
 * `table_name`: <Term id="table" /> (или представление), из которого нужно выбрать столбцы

Возвращает список [Columns](/reference/dbt-classes#column) в <Term id="table" />.

<File name='models/example.sql'>

```sql
{% set dest_columns = adapter.get_columns_in_table(schema, identifier) %}
{% set dest_cols_csv = dest_columns | map(attribute='quoted') | join(', ') %}

insert into {{ this }} ({{ dest_cols_csv }}) (
  select {{ dest_cols_csv }}
  from {{ref('another_table')}}
);
```

</File>

## already_exists

:::danger Устарело

Этот метод устарел и будет удален в будущих версиях. Пожалуйста, используйте [get_relation](#get_relation) вместо него.

:::

__Аргументы__:

 * `schema`: Схема для проверки
 * `table`: Отношение для поиска

Возвращает true, если отношение с именем `table` существует в схеме `schema`, иначе false.

<File name='models/example.sql'>

```text
select * from {{ref('raw_table')}}

{% if adapter.already_exists(this.schema, this.name) %}
  where id > (select max(id) from {{this}})
{% endif %}
```

</File>

## adapter_macro

:::danger Устарело

Этот метод устарел и будет удален в будущих версиях. Пожалуйста, используйте [adapter.dispatch](#dispatch) вместо него.

:::

**Использование:**

<File name='macros/concat.sql'>

```sql
{% macro concat(fields) -%}
  {{ adapter_macro('concat', fields) }}
{%- endmacro %}


{% macro default__concat(fields) -%}
    concat({{ fields|join(', ') }})
{%- endmacro %}


{% macro redshift__concat(fields) %}
    {{ fields|join(' || ') }}
{% endmacro %}


{% macro snowflake__concat(fields) %}
    {{ fields|join(' || ') }}
{% endmacro %}
```

</File>