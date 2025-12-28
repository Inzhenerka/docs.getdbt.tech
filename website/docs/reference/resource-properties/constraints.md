---
resource_types: [models]
datatype: "{dictionary}"
---

Ограничения — это функция многих платформ данных. Когда они указаны, платформа выполняет дополнительную проверку данных при их добавлении в новую таблицу или вставке в уже существующую таблицу. Если проверка не проходит, создание или обновление таблицы не удается, операция откатывается, и вы увидите четкое сообщение об ошибке.

Когда ограничения применяются, они гарантируют, что вы никогда не увидите недопустимые данные в таблице, материализованной вашей моделью. Применение варьируется в зависимости от платформы данных.

Ограничения требуют объявления и применения контракта модели [contract](/reference/resource-configs/contract).

**Ограничения никогда не применяются к моделям `ephemeral` или тем, которые материализуются как `view`.** Только модели `table` и `incremental` поддерживают применение и соблюдение ограничений.

## Определение ограничений

Ограничения могут быть определены для одного столбца или на уровне модели для одного или нескольких столбцов. Как общее правило, мы рекомендуем определять ограничения для одного столбца непосредственно на этих столбцах.

Если вы определяете несколько ограничений `primary_key` для одной модели, они _должны_ быть определены на уровне модели. Определение нескольких ограничений `primary_key` на уровне столбца не поддерживается.

Структура ограничения:
- `type` (обязательно): одно из `not_null`, `unique`, `primary_key`, `foreign_key`, `check`, `custom`
- `expression`: Свободный текст для уточнения ограничения. Обязательно для некоторых типов ограничений и необязательно для других.
- `name` (необязательно): Удобочитаемое имя для этого ограничения. Поддерживается некоторыми платформами данных.
- `columns` (только на уровне модели): Список имен столбцов, к которым применяется ограничение.

<VersionBlock firstVersion="1.9">

Ограничения внешнего ключа принимают два дополнительных параметра:

- `to`: Входной параметр типа relation, как правило [`ref()`](/reference/dbt-jinja-functions/ref) и [`source()`](/reference/dbt-jinja-functions/source), указывающий на таблицу, на которую ссылается внешний ключ.
- `to_columns`: Список столбцов в этой таблице, содержащих соответствующий первичный или уникальный ключ.

Этот синтаксис определения внешних ключей использует `ref`, что означает автоматический учет зависимостей и корректную работу в разных окружениях. Он доступен в [<Constant name="cloud" /> "Latest"](/docs/dbt-versions/cloud-release-tracks) и [<Constant name="core" /> v1.9+](/docs/dbt-versions/core-upgrade/upgrading-to-v1.9).

Поскольку поддержка и применение ограничений [различаются в зависимости от платформы](/reference/resource-properties/constraints#platform-specific-support), dbt предоставляет два необязательных поля, которые можно указать для любого ограничения:

- `warn_unenforced`: Установите в `False`, чтобы отключить предупреждения для ограничений, которые поддерживаются вашей платформой, но фактически не применяются (например, `primary_key` в Snowflake).
- `warn_unsupported`: Установите в `False`, чтобы отключить предупреждения для ограничений, которые вообще не поддерживаются вашей платформой (например, `check` в Redshift).

<File name='models/schema.yml'>

```yml
models:
  - name: <model_name>
    
    # обязательно
    config:
      contract: {enforced: true}
    
    # ограничения на уровне модели
    constraints:
      - type: primary_key
        columns: [first_column, second_column, ...]
        warn_unsupported: True # show a warning if unsupported
      - type: foreign_key # multi_column
        columns: [first_column, second_column, ...]
        to: ref('my_model_to') | source('source', 'source_table')
        to_columns: [other_model_first_column, other_model_second_columns, ...]
      - type: check
        columns: [first_column, second_column, ...]
        expression: "first_column != second_column"
        name: human_friendly_name
      - type: ...
    
    columns:
      - name: first_column
        data_type: string
        
        # ограничения на уровне столбца
        constraints:
          - type: not_null
          - type: unique
          - type: foreign_key
            to: ref('my_model_to') | source('source', 'source_table')
            to_columns: [other_model_column]
            warn_unenforced: False # skips warning if supported but not enforced
          - type: ...
```

</File>

Supported dbt-adapters use these fields when populated, to render out the foreign key constraint instead of `expression`.
  
Для получения дополнительной информации об адаптерах, которые поддерживают ограничения внешних ключей, ознакомьтесь с нашим руководством по [поддержке ограничений платформами](/docs/mesh/govern/model-contracts#platform-constraint-support).

</VersionBlock>

## Поддержка, специфичная для платформы

В транзакционных базах данных возможно определение "ограничений" на допустимые значения определенных столбцов, более строгих, чем просто тип данных этих значений. Например, Postgres поддерживает и применяет все ограничения стандарта ANSI SQL (`not null`, `unique`, `primary key`, `foreign key`), а также гибкое ограничение на уровне строки `check`, которое оценивается в логическое выражение.

Большинство аналитических платформ данных поддерживают и применяют ограничение `not null`, но они либо не поддерживают, либо не применяют остальные. Иногда все же желательно добавить "информационное" ограничение, зная, что оно _не_ применяется, для интеграции с устаревшими инструментами каталогов данных или диаграмм сущность-связь ([dbt-core#3295](https://github.com/dbt-labs/dbt-core/issues/3295)). Некоторые платформы данных могут опционально использовать ограничения первичного или внешнего ключа для оптимизации запросов, если вы укажете дополнительное ключевое слово.

Для этого вы можете указать два дополнительных поля для любого фильтра:
- `warn_unenforced: False`, чтобы пропустить предупреждение об ограничениях, которые поддерживаются, но не применяются этой платформой данных. Ограничение будет включено в шаблонный DDL.
- `warn_unsupported: False`, чтобы пропустить предупреждение об ограничениях, которые не поддерживаются этой платформой данных, и поэтому не будут включены в шаблонный DDL.

<WHCode>

<div warehouse="Postgres">

* Документация по ограничениям PostgreSQL: [здесь](https://www.postgresql.org/docs/current/ddl-constraints.html#id-1.5.4.6.6)

<File name='models/constraints_example.sql'>

```sql
{{
  config(
    materialized = "table"
  )
}}

select 
  1 as id, 
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
```

</File>

<File name='models/schema.yml'>

```yml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: int
        constraints:
          - type: not_null
          - type: primary_key
          - type: check
            expression: "id > 0"
      - name: customer_name
        data_type: text
      - name: first_transaction_date
        data_type: date
```

</File>

Ожидаемый DDL для применения ограничений:
<File name='target/run/.../constraints_example.sql'>

```sql
create table "database_name"."schema_name"."constraints_example__dbt_tmp"
( 
    id integer not null primary key check (id > 0),
    customer_name text,
    first_transaction_date date    
)
;
insert into "database_name"."schema_name"."constraints_example__dbt_tmp" 
(   
    id,
    customer_name,  
    first_transaction_date
) 
(
select 
    1 as id, 
    'My Favorite Customer' as customer_name, 
    cast('2019-01-01' as date) as first_transaction_date
);
```

</File>

</div>

<div warehouse="Redshift">

Redshift в настоящее время применяет только ограничения `not null`; все остальные ограничения являются только метаданными. Кроме того, Redshift не позволяет проверять столбцы при создании таблицы. Подробнее см. в документации Redshift [здесь](https://docs.aws.amazon.com/redshift/latest/dg/t_Defining_constraints.html).

<File name='models/constraints_example.sql'>

```sql
{{
  config(
    materialized = "table"
  )
}}

select 
  1 as id, 
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
```

</File>

<File name='models/schema.yml'>

```yml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: integer
        constraints:
          - type: not_null
          - type: primary_key # не применяется  -- будет предупреждение и включение
          - type: check       # не поддерживается -- будет предупреждение и пропуск
            expression: "id > 0"
        data_tests:
          - unique            # ограничение primary_key не применяется
      - name: customer_name
        data_type: varchar
      - name: first_transaction_date
        data_type: date
```

Обратите внимание, что Redshift ограничивает максимальную длину значений `varchar` до 256 символов по умолчанию (или когда указано без длины). Это означает, что любые строковые данные, превышающие 256 символов, могут быть усечены _или_ вернуть ошибку "значение слишком длинное для типа символов". Чтобы разрешить максимальную длину, используйте `varchar(max)`. Например, `data_type: varchar(max)`.

</File>

Ожидаемый DDL для применения ограничений:
<File name='target/run/.../constraints_example.sql'>

```sql

create table "database_name"."schema_name"."constraints_example__dbt_tmp"
    
(
    id integer not null,
    customer_name varchar,
    first_transaction_date date,
    primary key(id)
)    
;

insert into "database_name"."schema_name"."constraints_example__dbt_tmp"
(   
select
    1 as id,
    'My Favorite Customer' as customer_name,
    cast('2019-01-01' as date) as first_transaction_date
); 
```

</File>


</div>

<div warehouse="Snowflake">

- Документация по ограничениям Snowflake: [здесь](https://docs.snowflake.com/en/sql-reference/constraints-overview.html)
- Типы данных Snowflake: [здесь](https://docs.snowflake.com/en/sql-reference/intro-summary-data-types.html)

Snowflake поддерживает четыре типа ограничений: `unique`, `not null`, `primary key` и `foreign key`.

Важно отметить, что в настоящее время проверяются только `not null` (и свойство `not null` для `primary key`).
Остальные ограничения являются чисто метаданными и не проверяются при вставке данных. Хотя Snowflake не проверяет ограничения `unique`, `primary` или `foreign_key`, вы можете опционально указать Snowflake использовать их для оптимизации запросов, указав [`rely`](https://docs.snowflake.com/en/user-guide/join-elimination) в поле `expression` ограничения.

В настоящее время Snowflake не поддерживает синтаксис `check`, и dbt пропустит конфигурацию `check` и выдаст предупреждающее сообщение, если она установлена на некоторых моделях в проекте dbt.

<File name='models/constraints_example.sql'>

```sql
{{
  config(
    materialized = "table"
  )
}}

select 
  1 as id, 
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
```

</File>

<File name='models/schema.yml'>

```yml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: integer
        description: hello
        constraints:
          - type: not_null
          - type: primary_key # не применяется  -- будет предупреждение и включение
          - type: check       # не поддерживается -- будет предупреждение и пропуск
            expression: "id > 0"
        data_tests:
          - unique            # этот тест нужен, потому что ограничение primary_key не применяется
      - name: customer_name
        data_type: text
      - name: first_transaction_date
        data_type: date
```

</File>

Ожидаемый DDL для применения ограничений:
<File name='target/run/.../constraints_example.sql'>

```sql
create or replace transient table <database>.<schema>.constraints_model        
(
    id integer not null primary key,
    customer_name text,
    first_transaction_date date  
)
as
(
select 
  1 as id, 
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
);
```

</File>

</div>

<div warehouse="BigQuery">

BigQuery позволяет определять и обеспечивать соблюдение ограничений `not null`, а также определять (но _не обеспечивать соблюдение_) ограничения `primary key` и `foreign key` (которые могут использоваться для оптимизации запросов). BigQuery не поддерживает определение или обеспечение соблюдения других ограничений. Подробнее см. в разделе [Platform constraint support](/docs/mesh/govern/model-contracts#platform-constraint-support).

Документация: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language

Типы данных: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types

<File name='models/constraints_example.sql'>

```sql
{{
  config(
    materialized = "table"
  )
}}

select 
  1 as id, 
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
```

</File>

<File name='models/schema.yml'>

```yml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: int
        constraints:
          - type: not_null
          - type: primary_key # не применяется  -- будет предупреждение и включение
          - type: check       # не поддерживается -- будет предупреждение и пропуск
            expression: "id > 0"
        data_tests:
          - unique            # ограничение primary_key не обеспечивается (не проверяется)
      - name: customer_name
        data_type: string
      - name: first_transaction_date
        data_type: date
```

</File>

### Ограничение на уровне столбца для вложенного столбца:

<File name='models/nested_column_constraints_example.sql'>

```sql
{{
  config(
    materialized = "table"
  )
}}

select
  'string' as a,
  struct(
    1 as id,
    'name' as name,
    struct(2 as id, struct('test' as again, '2' as even_more) as another) as double_nested
  ) as b
```

</File>

<File name='models/nested_fields.yml'>

```yml

models:
  - name: nested_column_constraints_example
    config:
      contract: 
        enforced: true
    columns:
      - name: a
        data_type: string
      - name: b.id
        data_type: integer
        constraints:
          - type: not_null
      - name: b.name
        description: test description
        data_type: string
      - name: b.double_nested.id
        data_type: integer
      - name: b.double_nested.another.again
        data_type: string
      - name: b.double_nested.another.even_more
        data_type: integer
        constraints: 
          - type: not_null
```

</File>

### Ожидаемый DDL для применения ограничений:

<File name='target/run/.../constraints_example.sql'>

```sql
create or replace table `<project>`.`<dataset>`.`constraints_model`        
(
    id integer not null,
    customer_name string,
    first_transaction_date date  
)
as
(
select 
  1 as id, 
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
);
```

</File>

</div>

<div warehouse="Databricks">

Databricks позволяет вам определять:

- ограничение `not null`
- и/или дополнительные ограничения `check`, с условными выражениями, включающими один или несколько столбцов

Поскольку Databricks не поддерживает транзакции и не позволяет использовать `create or replace table` с схемой столбцов, таблица сначала создается без схемы, а затем выполняются операторы `alter` для добавления различных ограничений.

Это означает, что:

- Имена и порядок столбцов проверяются, но не их тип
- Если `constraints` и/или `constraint_check` не проходят, таблица с ошибочными данными все равно будет существовать в хранилище

См. [эту страницу](https://docs.databricks.com/tables/constraints.html) с более подробной информацией о поддержке ограничений в Databricks.

<File name='models/constraints_example.sql'>

```sql
{{
  config(
    materialized = "table"
  )
}}

select 
  1 as id, 
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
```

</File>

<File name='models/schema.yml'>

```yml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: int
        constraints:
          - type: not_null
          - type: primary_key # не применяется  -- будет предупреждение и включение
          - type: check       # не поддерживается -- будет предупреждение и пропуск
            expression: "id > 0"
        data_tests:
          - unique            # ограничение primary_key не применяется
      - name: customer_name
        data_type: text
      - name: first_transaction_date
        data_type: date
```

</File>

Ожидаемый DDL для применения ограничений:
<File name='target/run/.../constraints_example.sql'>

```sql
  create or replace table schema_name.my_model 
  using delta 
  as
    select
      1 as id,
      'My Favorite Customer' as customer_name,
      cast('2019-01-01' as date) as first_transaction_date
```

</File>

После чего выполняются операторы

```sql
alter table schema_name.my_model change column id set not null;
alter table schema_name.my_model add constraint 472394792387497234 check (id > 0);
```

</div>

</WHCode>

## Пользовательские ограничения

В <Constant name="cloud" /> и <Constant name="core" /> вы можете использовать пользовательские ограничения (custom constraints) для расширенной настройки таблиц в моделях. Разные хранилища данных поддерживают различный синтаксис и разные возможности.

Пользовательские ограничения позволяют добавлять конфигурацию к конкретным столбцам. Например:

- Установить [политику маскирования](https://docs.snowflake.com/en/user-guide/security-column-intro#what-are-masking-policies) в Snowflake при использовании Create Table As Select (CTAS).

- Другие хранилища данных (такие как [Databricks](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-create-table-using.html) и [BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#column_name_and_column_schema) имеют свои собственные наборы параметров, которые могут быть установлены для столбцов в их операторах CTAS.

Вы можете реализовать ограничения несколькими способами:

<Expandable alt_header="Пользовательские ограничения с тегами">

Вот пример того, как реализовать политики маскирования на основе тегов с контрактами и ограничениями, используя следующий синтаксис:

<File name='models/constraints_example.yml'>

```yaml

models:
  - name: my_model
    config:
      contract:
        enforced: true
      materialized: table
    columns:
      - name: id
        data_type: int
        constraints:
          - type: custom
            expression: "tag (my_tag = 'my_value')" # Пользовательское SQL-выражение, используемое для применения конкретного ограничения к столбцу.

```

</File>

Использование этого синтаксиса требует настройки всех столбцов и их типов, так как это единственный способ отправить create or replace `<cols_info_with_masking> mytable as ...`. Невозможно сделать это с помощью только частичного списка столбцов. Это означает, что необходимо убедиться, что поля столбцов и ограничений полностью определены.

Чтобы сгенерировать YAML со всеми столбцами, вы можете использовать `generate_model_yaml` из [dbt-codegen](https://github.com/dbt-labs/dbt-codegen/tree/0.12.1/?tab=readme-ov-file#generate_model_yaml-source).
</Expandable>

<Expandable alt_header="Пользовательские ограничения без тегов">

В качестве альтернативы, вы можете добавить политику маскирования без тегов:

<File name='models/constraints_example.yml'>
 
```yaml

models:
  - name: my_model
    config:
      contract:
        enforced: true
      materialized: table
    columns:
      - name: id
        data_type: int
        constraints:
          - type: custom
            expression: "masking policy my_policy"

```

</File>
</Expandable>
