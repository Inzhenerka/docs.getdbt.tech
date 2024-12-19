---
title: "Об объекте адаптера"
sidebar_label: "адаптер"
id: "adapter"
description: "Оборачивает внутренний объект адаптера базы данных с помощью объекта Jinja `adapter`."
---

Ваша база данных взаимодействует с dbt с помощью внутреннего объекта адаптера базы данных. Например, BaseAdapter и SnowflakeAdapter. Объект Jinja `adapter` является оберткой вокруг этого внутреннего объекта адаптера базы данных.

`adapter` предоставляет возможность вызывать методы адаптера этого внутреннего класса через:
* `{% do adapter.<имя метода> %}` -- вызвать внутренний метод адаптера 
* `{{ adapter.<имя метода> }}` -- вызвать внутренний метод адаптера и захватить его возвращаемое значение для использования в материализации или других макросах

Например, методы адаптера ниже будут преобразованы в конкретные SQL-запросы в зависимости от типа адаптера, который использует ваш проект:

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

Следующие функции адаптера устарели и будут удалены в будущих релизах.
- [adapter.get_columns_in_table](#get_columns_in_table) **(устарело)**
- [adapter.already_exists](#already_exists) **(устарело)**
- [adapter_macro](#adapter_macro) **(устарело)**

## dispatch

Перемещено на отдельную страницу: [dispatch](/reference/dbt-jinja-functions/dispatch)

## get_missing_columns
__Аргументы__:

 * `from_relation`: Исходная [Relation](/reference/dbt-classes#relation)
 * `to_relation`: Целевая [Relation](/reference/dbt-classes#relation)

Возвращает список [Columns](/reference/dbt-classes#column), который представляет собой разницу между столбцами в `from_table` и столбцами в `to_table`, т.е. (`set(from_relation.columns) - set(to_table.columns)`).
Полезно для обнаружения новых столбцов в источнике <Term id="table" />.

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

 * `from_relation`: Исходная [Relation](/reference/dbt-classes#relation), используемая в качестве шаблона
 * `to_relation`: [Relation](/reference/dbt-classes#relation), которую нужно изменить

Расширяет типы столбцов в `to_relation` <Term id="table" /> для соответствия схеме `from_relation`. Расширение столбцов ограничено строковыми и числовыми типами в поддерживаемых базах данных. Типичное использование включает расширение типов столбцов (например, с `varchar(16)` до `varchar(32)`) для поддержки операторов вставки.

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

 * `database`: База данных отношения, которое нужно получить
 * `schema`: Схема отношения, которое нужно получить
 * `identifier`: Идентификатор отношения, которое нужно получить

Возвращает кэшированный объект [Relation](/reference/dbt-classes#relation), идентифицированный по `database.schema.identifier`, предоставленному методу, или `None`, если отношение не существует.

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

 * `relation`: [Relation](/reference/dbt-classes#relation), которую нужно загрузить

Удобная обертка для [get_relation](#get_relation). Возвращает кэшированную версию объекта [Relation](/reference/dbt-classes#relation) или `None`, если отношение не существует.

**Использование**:

<File name='example.sql'>

```sql

{% set relation_exists = load_relation(ref('my_model')) is not none %}
{% if relation_exists %}
      {{ log("my_model уже был построен", info=true) }}
{% else %}
      {{ log("my_model не существует в хранилище. Возможно, он был удален?", info=true) }}
{% endif %}

```

</File>

## get_columns_in_relation
__Аргументы__:

 * `relation`: [Relation](/reference/dbt-classes#relation), для которой нужно найти столбцы

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

 * `relation`: Объект отношения с базой данных и схемой для создания. Любой идентификатор в отношении будет проигнорирован.

Создает схему (или эквивалент) в целевой базе данных. Если целевая схема уже существует, то этот метод не выполняет никаких действий.

**Использование:**

<File name='example.sql'>

```sql

{% do adapter.create_schema(api.Relation.create(database=target.database, schema="my_schema")) %}
```

</File>

## drop_schema
__Аргументы__:

 * `relation`: Объект отношения с базой данных и схемой для удаления. Любой идентификатор в отношении будет проигнорирован.

Удаляет схему (или эквивалент) в целевой базе данных. Если целевая схема не существует, то этот метод не выполняет никаких действий. Конкретная реализация зависит от адаптера, но адаптеры должны реализовать каскадное удаление, так что объекты в схеме также будут удалены. **Примечание**: этот метод адаптера является разрушительным, поэтому используйте его с осторожностью!

**Использование:**

<File name='example.sql'>

```sql

{% do adapter.drop_schema(api.Relation.create(database=target.database, schema="my_schema")) %}
```

</File>

## drop_relation
__Аргументы__:

 * `relation`: Отношение для удаления

Удаляет отношение в базе данных. Если целевое отношение не существует, то этот метод не выполняет никаких действий. Конкретная реализация зависит от адаптера, но адаптеры должны реализовать каскадное удаление, так что связанные <Term id="view">представления</Term>, находящиеся ниже удаленного отношения, также будут удалены. **Примечание**: этот метод адаптера является разрушительным, поэтому используйте его с осторожностью!

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
 * `to_relation`: Целевое отношение, в которое нужно переименовать `from_relation`

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

 * `identifier`: Строка для экранирования

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

Этот метод устарел и будет удален в будущем релизе. Пожалуйста, используйте [get_columns_in_relation](#get_columns_in_relation) вместо этого.

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

Этот метод устарел и будет удален в будущем релизе. Пожалуйста, используйте [get_relation](#get_relation) вместо этого.

:::

__Аргументы__:

 * `schema`: Схема для проверки
 * `table`: Отношение, которое нужно найти

Возвращает true, если отношение с именем `table` существует в схеме `schema`, и false в противном случае.

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

Этот метод устарел и будет удален в будущем релизе. Пожалуйста, используйте [adapter.dispatch](#dispatch) вместо этого.

:::

До версии v0.18.0 dbt поддерживал ограниченную версию функциональности `dispatch` через макрос с именем `adapter_macro`.

__Аргументы__:

  * `name`: имя макроса для реализации
  * `*args`
  * `**kwargs`
  
Находит подходящую для адаптера версию именованного макроса и реализует его с предоставленными позиционными и/или ключевыми аргументами. Это наиболее актуально для макросов в открытых пакетах с поддержкой нескольких баз данных.

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