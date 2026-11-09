---
title: "Настройка кавычек в проектах"
sidebar_label: "кавычки"
datatype: boolean # типа, на самом деле это словарь булевых значений
description: "Прочтите это руководство, чтобы понять конфигурацию кавычек в dbt."
default: true
---
<File name='dbt_project.yml'>

```yml
quoting:
  database: true | false
  schema: true | false
  identifier: true | false
  snowflake_ignore_case: true | false  # v2-only config. Aligns with Snowflake's session parameter QUOTED_IDENTIFIERS_IGNORE_CASE behavior. 
                                       # Ignored by dbt v1 and other adapters.
```

</File>

## Definition {#definition}

При желании вы можете включить квотирование (quoting) в проекте dbt, чтобы управлять тем, будет ли dbt оборачивать имена баз данных, схем или идентификаторов в кавычки при генерации SQL. dbt использует эту настройку в следующих случаях:

* При создании отношений (например, таблиц или представлений)
* При разрешении функции `ref()` в прямую ссылку на отношение

:::info Терминология BigQuery

Обратите внимание, что для конфигурации кавычек в BigQuery здесь следует использовать `database` и `schema`, хотя эти настройки будут применяться к именам `project` и `dataset` соответственно.

:::

## Значение по умолчанию {#default}

Значения по умолчанию зависят от базы данных.
<Tabs
  defaultValue="default"
  values={[
    { label: 'По умолчанию', value: 'default', },
    { label: 'Snowflake', value: 'snowflake', },
  ]
}>
<TabItem value="default">

Для большинства адаптеров кавычки по умолчанию установлены в `true`.

Почему? Работать с `SELECT` одинаково просто как с отношениями, использующими идентификаторы в кавычках, так и без них. Кавычки позволяют использовать зарезервированные слова и специальные символы в именах идентификаторов, однако мы рекомендуем по возможности избегать использования зарезервированных слов и специальных символов в идентификаторах.

  <File name='dbt_project.yml'>

```yml
quoting:
  database: true
  schema: true
  identifier: true

```

</File>
</TabItem>
<TabItem value="snowflake">

Для Snowflake экранирование (quoting) по умолчанию установлено в значение `false`.

Создание связей с идентификаторами в кавычках делает эти идентификаторы чувствительными к регистру. Выбор из них становится гораздо сложнее. Вы можете повторно включить кавычки для идентификаторов связей, которые чувствительны к регистру, являются зарезервированными словами или содержат специальные символы, но мы рекомендуем избегать этого, насколько это возможно.

<File name='dbt_project.yml'>

```yml
quoting:
  database: false
  schema: false
  identifier: false
  snowflake_ignore_case: false  # v2-only config. Aligns with Snowflake's session parameter QUOTED_IDENTIFIERS_IGNORE_CASE behavior. 
                                # Ignored by dbt v1 and other adapters.
```

</File>


</TabItem>

</Tabs>

## Примеры {#examples}

Установите quoting в значение `false` для проекта:
<File name='dbt_project.yml'>

```yml
quoting:
  database: false
  schema: false
  identifier: false      
  snowflake_ignore_case: false  # v2-only config. Aligns with Snowflake's session parameter QUOTED_IDENTIFIERS_IGNORE_CASE behavior. 
                                # Ignored by dbt v1 and other adapters.
```

dbt затем создаст связи без кавычек:

```sql
create table analytics.dbt_alice.dim_customers
```

</File>


## Рекомендации {#recommendations}

### Snowflake {#snowflake}

Если вы используете Snowflake, мы рекомендуем:

- Установите все параметры заключения в кавычки в значение `False` в файле [`dbt_project.yml`](/reference/dbt_project.yml), чтобы без необходимости не заключать имена моделей и столбцов в кавычки и избежать проблем с чувствительностью к регистру.
  - Установка всех параметров заключения в кавычки в значение `False` также означает, что вы не сможете использовать зарезервированные слова в качестве идентификаторов, например имен моделей или таблиц. В любом случае мы рекомендуем избегать использования таких зарезервированных слов.  
- Если вы используете <Constant name="fusion" /> и в вашей среде Snowflake параметр сеанса `QUOTED_IDENTIFIERS_IGNORE_CASE = true` задан, например, в оркестраторе или pre-hook, вам также следует включить заключение в кавычки и `snowflake_ignore_case` в файле `dbt_project.yml`, чтобы сохранить точный регистр имен базы данных, схемы и идентификатора:

  ```yml
  quoting:
    database: true
    schema: true
    identifier: true
    snowflake_ignore_case: true  # Настройка только для v2. Соответствует поведению параметра сеанса Snowflake QUOTED_IDENTIFIERS_IGNORE_CASE. 
                                 # Игнорируется dbt v1 и другими адаптерами.
  ```

  Установка `snowflake_ignore_case: true` гарантирует, что имена колонок и идентификаторов, которые dbt генерирует на этапе компиляции, будут соответствовать поведению Snowflake во время выполнения запросов. Это сохраняет согласованность между логикой на этапе компиляции и во время выполнения. Без этого вы можете столкнуться с ошибками вида «column not found».

:::info Цитирование источника
Если исходная таблица Snowflake использует экранированные (quoted) идентификаторы базы данных, схемы или таблицы, вы можете настроить это в файле `source.yml`. Подробнее см. в разделе [configuring quoting](/reference/resource-properties/quoting).
:::

#### Пояснение {#explanation}

dbt по умолчанию пропускает quoting в Snowflake, чтобы имена моделей в нижнем регистре корректно использовались в downstream-запросах и BI-инструментах без необходимости думать о регистре или кавычках.

В отличие от большинства баз данных (которые приводят неэкранированные идентификаторы к нижнему регистру), Snowflake приводит их к верхнему регистру. Когда вы используете quoted-идентификаторы, Snowflake сохраняет их регистр и делает их чувствительными к регистру. Это означает, что если вы создаёте таблицу с экранированными идентификаторами в нижнем регистре, к такой таблице всегда нужно обращаться с кавычками и строго в том же регистре. Это легко может сломать downstream-запросы в BI-инструментах или ad-hoc SQL.

Поскольку в dbt по соглашению используются имена моделей и файлов в нижнем регистре, их экранирование в Snowflake повышает риск поломки downstream-запросов в BI-инструментах или ad-hoc SQL. Если бы dbt, наоборот, использовал имена в верхнем регистре по умолчанию, это могло бы привести к проблемам с безопасными значениями по умолчанию в других базах данных.

<File name='snowflake_casing.sql'>

```sql
/*
Выполните эти запросы, чтобы понять, как Snowflake обрабатывает регистр символов и кавычки.
*/

-- Это вывод примерной модели `orders.sql` с включенными кавычками
create table "analytics"."orders" as (

  select 1 as id

);

/*
    Эти запросы НЕ будут работать! Поскольку таблица выше была создана с кавычками,
    Snowflake создал таблицу orders с нижним регистром схемы и идентификатора.

    Поскольку некавыченные идентификаторы автоматически приводятся к верхнему регистру,
    оба следующих запроса эквивалентны, и ни один из них не будет работать правильно.
*/

select * from analytics.orders;
select * from ANALYTICS.ORDERS;

/*
    Чтобы выполнить запрос к этой таблице, вам нужно будет заключить в кавычки схему и таблицу. Этот
    запрос действительно должен завершиться без ошибки.
*/

select * from "analytics"."orders";


/*
Чтобы избежать этого безумия с кавычками, вы можете отключить экранирование (quoting) для схем и идентификаторов в файле `dbt_project.yml`. Это означает, что вы не сможете использовать зарезервированные слова в качестве имён моделей, но этого всё равно следует избегать. Если экранирование схем и идентификаторов отключено, следующий запрос действительно будет работать:
*/

select * from analytics.orders;
```

</File>

### Redshift

Leave the default quoting values. You can do this  in `dbt_project.yml` by either omitting the `quoting` config or setting `database`, `schema`, and `identifier` to `true`. The `quoting` config only controls whether dbt wraps names in double quotes, so it can't work around Redshift lowercasing mixed-case names. If you need mixed-case names, turn on the Redshift `enable_case_sensitive_identifier` setting and keep `quoting` on. If you set `quoting` to `false`, dbt sends unquoted names, and Redshift lowercases them even when `enable_case_sensitive_identifier` is `true`.

By default, Redshift lowercases database, schema, table, and column names, even when they're quoted. The `enable_case_sensitive_identifier` setting controls this:

- `false` (default): Redshift lowercases all names, whether or not they're quoted.
- `true`: Redshift keeps the case of quoted names. Unquoted names are still lowercased.

You can set this parameter to `true` for a cluster or workgroup. A `SET` command applies only to the current session. Refer to [Turn on case sensitivity](https://docs.aws.amazon.com/redshift/latest/mgmt/zero-etl-setting-up.case-sensitivity.html) and the [parameter reference](https://docs.aws.amazon.com/redshift/latest/dg/r_enable_case_sensitive_identifier.html) in the Amazon Redshift documentation.

The following example shows the difference between setting the parameter to `false` or `true` when run in a Redshift session:

<File name="redshift_casing.sql">

```sql
-- Default: quoted names are still lowercased
SET enable_case_sensitive_identifier TO false;

CREATE TABLE "MixedCasedTable" ("MixedCasedColumn" int);
INSERT INTO "MixedCasedTable" VALUES (1);

-- These work. Redshift stored the names in lowercase.
SELECT mixedcasedcolumn FROM mixedcasedtable;
SELECT "MixedCasedColumn" FROM "MixedCasedTable";

DROP TABLE mixedcasedtable;

-- With the setting on, quoted names keep their case.
SET enable_case_sensitive_identifier TO true;

CREATE TABLE "MixedCasedTable" ("MixedCasedColumn" int);
INSERT INTO "MixedCasedTable" ("MixedCasedColumn") VALUES (1);

-- This works. You must quote the names and match the case.
SELECT "MixedCasedColumn" FROM "MixedCasedTable";

-- This fails: relation "mixedcasedtable" does not exist
SELECT mixedcasedcolumn FROM mixedcasedtable;

DROP TABLE "MixedCasedTable";
```

</File>

### Другие хранилища {#other-warehouses}

Оставьте значения по умолчанию для вашего хранилища.
