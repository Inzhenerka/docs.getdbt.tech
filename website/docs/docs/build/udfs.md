---
title: "Пользовательские функции"
description: "Узнайте, как добавлять пользовательские функции (UDF) в ваши dbt‑проекты."
id: "udfs"
---

# Пользовательские функции (User-defined functions)

Пользовательские функции (UDF) позволяют определять и регистрировать собственные функции непосредственно в вашем хранилище данных. Подобно [макросам](/docs/build/jinja-macros), UDF способствуют повторному использованию кода, но в отличие от макросов они являются объектами в хранилище. Это означает, что одну и ту же логику можно использовать не только в dbt, но и в других инструментах — например, в BI-системах, ноутбуках для data science и т.д.

UDF особенно полезны для переиспользования логики в нескольких инструментах, стандартизации сложных бизнес‑расчётов, повышения производительности вычислительно тяжёлых операций (поскольку они компилируются и оптимизируются движком запросов вашего хранилища), а также для контроля версий кастомной логики внутри вашего dbt‑проекта.

dbt создаёт, обновляет и переименовывает UDF в процессе выполнения DAG. UDF создаётся в хранилище до той модели, которая на него ссылается. Подробнее о том, как dbt строит UDF в проекте, см. [listing and building UDFs](/docs/build/udfs#listing-and-building-udfs).

Дополнительную информацию о конфигурациях и свойствах UDF см. в разделах [Function properties](/reference/function-properties) и [Function configurations](/reference/function-configs).

## Предварительные требования

* Убедитесь, что вы используете **Latest Fusion** или **Latest** [release track](/docs/dbt-versions/cloud-release-tracks) платформы dbt либо dbt Core версии v1.11.
* Используйте один из следующих адаптеров:

	<Tabs>
	
	<TabItem value="core" label="dbt Core">
	
	- BigQuery
	- Snowflake
	- Redshift
	- Postgres
	- Databricks
	
	</TabItem>
	
	<TabItem value ="fusion" label ="dbt Fusion engine">
	
	- BigQuery
	- Snowflake
	- Redshift
	- Databricks
	
	</TabItem>
	</Tabs>

:::important UDF support
При разработке UDF важно учитывать следующие ограничения поддержки:

- Python UDF пока не поддерживаются в <Constant name="fusion" />.
- Дополнительные языки (например, Java, JavaScript, Scala) в настоящий момент не поддерживаются.

Полный список поддерживаемых возможностей UDF см. в разделе [Limitations](#limitations) ниже.
:::

## Определение UDF в dbt

В dbt можно определять UDF на SQL и Python. Python UDF в настоящее время поддерживаются в Snowflake и BigQuery при использовании <Constant name="core" />.

Выполните следующие шаги, чтобы определить UDF в dbt:

1. Создайте SQL‑ или Python‑файл в каталоге `functions`. Например, следующая UDF проверяет, представляет ли строка положительное целое число:

    <Tabs>

    <TabItem value="SQL">
    Определение SQL UDF в SQL‑файле.

    <File name='functions/is_positive_int.sql'>

    ```sql
    # syntax for BigQuery, Snowflake, and Databricks
    REGEXP_INSTR(a_string, '^[0-9]+$') 
    
    # syntax for Redshift and Postgres
    SELECT REGEXP_INSTR(a_string, '^[0-9]+$')

    ```

    </File>

    </TabItem>
    <TabItem value="Python">
    Определение Python UDF в Python‑файле.

    <File name='functions/is_positive_int.py'>

    ```py
    import re
    
    def main(a_string):
        return 1 if re.search(r'^[0-9]+$', a_string or '') else 0
    ```
    </File>
    </TabItem>
    </Tabs>

    **Примечание**: конфигурации можно указать либо в config‑блоке SQL‑файла, либо в соответствующем YAML‑файле со свойствами на следующем шаге (шаг 2).

2. Укажите имя функции и задайте конфигурации, свойства, тип возвращаемого значения и (опционально) аргументы в соответствующем YAML‑файле со свойствами. Например:

    <Tabs>
    <TabItem value="SQL">

    <File name='functions/schema.yml'>

    ```yml
    functions:
      - name: is_positive_int       # required
        description: My UDF that returns 1 if a string represents a naked positive integer (like "10", "+8" is not allowed). # optional
        config:
          schema: udf_schema
          database: udf_db
          volatility: deterministic
        arguments:                  # optional
          - name: a_string          # required if arguments is specified
            data_type: string       # required if arguments is specified
            description: The string that I want to check if it's representing a positive integer (like "10") 
            default_value: "'1'"    # optional, available in Snowflake and Postgres
        returns:                    # required
          data_type: integer        # required 
    ```
    </File>
    </TabItem>

    <!--другие типы пока не поддерживаются
    <Expandable alt_header="Поддерживаемые типы UDF">

    Вы можете использовать эти значения для свойства `type`, когда определяете функцию в properties YAML‑файле.

    - `scalar` - Возвращает одно значение на строку
    - `aggregate` - Возвращает одно значение на группу, агрегируя несколько строк
    - `table` - Возвращает табличный результат
    <br></br>
    Например:

    ```yml
    functions:
	  - name: string 
	    description: string
      	config:
	      type: scalar # default value
    ```

    Если не указано явно, конфигурация `type` по умолчанию равна `scalar`.

    </Expandable>
    -->

    <TabItem value="Python">
    
    При определении Python UDF требуются следующие конфигурации:

    - [`runtime_version`](/reference/resource-configs/runtime-version) — версия Python, в которой будет выполняться код. Поддерживаемые значения:
      - [Snowflake](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-introduction): `3.10`, `3.11`, `3.12`, `3.13`
      - [BigQuery](https://cloud.google.com/bigquery/docs/user-defined-functions-python): `3.11`
    - [`entry_point`](/reference/resource-configs/entry-point) — имя Python‑функции, которая будет вызываться.

    Пример:

    <File name='functions/schema.yml'>

    ```yml
      functions:
        - name: is_positive_int # обязательно
          description: Моя UDF, которая возвращает 1, если строка представляет собой «чистое» положительное целое число (например, "10"; "+8" не допускается). # optional
          config:
            runtime_version: "3.11"   # обязательно
            entry_point: main         # обязательно
            schema: udf_schema
            database: udf_db
            volatility: deterministic  
          arguments:                   # опционально
            - name: a_string           # обязательно, если указан arguments
              data_type: string        # обязательно, если указан arguments
              description: Строка, по которой я хочу проверить, что она представляет положительное целое число (например, "10")
              default_value: "'1'"     # опционально; доступно в Snowflake и Postgres
          returns:                     # обязательно
            data_type: integer         # обязательно
    ```
    </File>
    </TabItem>
    </Tabs>

    :::info volatility зависит от хранилища данных
    Обратите внимание, что параметр `volatility` принимается dbt как для SQL‑, так и для Python‑UDF, но его обработка зависит от хранилища. BigQuery игнорирует `volatility`, и dbt выводит предупреждение. В Snowflake `volatility` применяется при создании UDF. Подробнее см. в разделе [volatility](/reference/resource-configs/volatility).
    :::

3. Выполните одну из следующих команд `dbt build`, чтобы собрать UDF и создать их в хранилище:

    Сборка всех UDF:

    ```bash
    dbt build --select "resource_type:function"
    ```

    Или сборка конкретной UDF:

    ```bash
    dbt build --select is_positive_int
    ```

    При выполнении `dbt build` файл `functions/schema.yml` и соответствующий SQL‑ или Python‑файл (например, `functions/is_positive_int.sql` или `functions/is_positive_int.py`) совместно используются для генерации оператора `CREATE FUNCTION`.

    Сгенерированный оператор `CREATE FUNCTION` зависит от используемого адаптера. Например:

    <Tabs>

    <TabItem value="SQL">

    <Tabs>
    <TabItem value="Snowflake">

    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING DEFAULT '1')
    RETURNS INTEGER
    LANGUAGE SQL
    IMMUTABLE
    AS $$
      REGEXP_INSTR(a_string, '^[0-9]+$')
    $$;
    ```

    </TabItem>

    <TabItem value="Redshift">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string VARCHAR)
    RETURNS INTEGER
    IMMUTABLE
    AS $$
      SELECT REGEXP_INSTR(a_string, '^[0-9]+$')
    $$ LANGUAGE SQL;
    ```
    </TabItem>

    <TabItem value="BigQuery">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
    RETURNS INT64
    AS (
      REGEXP_INSTR(a_string, r'^[0-9]+$')
    );

    ```
    </TabItem>

    <TabItem value="Databricks">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
    RETURNS INT
    DETERMINISTIC
    RETURN REGEXP_INSTR(a_string, '^[0-9]+$');
    ```
    </TabItem>

    <TabItem value="Postgres">

    ```sql
    CREATE OR REPLACE FUNCTION udf_schema.is_positive_int(a_string text DEFAULT '1')
    RETURNS int
    LANGUAGE sql
    IMMUTABLE
    AS $$
      SELECT regexp_instr(a_string, '^[0-9]+$')
    $$;
    ```
    </TabItem>
  
    </Tabs>
    </TabItem>

    <TabItem value="Python">
    <Tabs>

    <TabItem value="Snowflake">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING DEFAULT '1')
      RETURNS INTEGER
      LANGUAGE PYTHON
      RUNTIME_VERSION = '3.11'
      HANDLER = 'main'
    AS $$
    import re
    def main(a_string):
      return 1 if re.search(r'^[0-9]+$', a_string or '') else 0
    $$;
    ```
    </TabItem>

    <TabItem value="BigQuery">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
    RETURNS INT64
    LANGUAGE python
    OPTIONS(runtime_version="python-3.11", entry_point="main")
    AS r'''
      import re
      def main(a_string):
        return 1 if re.search(r'^[0-9]+$', a_string or '') else 0
    ''';
    ```
    </TabItem>
    </Tabs>
    </TabItem>
    </Tabs>

4. Используйте UDF в модели с помощью макроса `{{ function(...) }}`. Например:

    <File name="models/my_model.sql">

    ```sql
    select
        maybe_positive_int_column,
        {{ function('is_positive_int') }}(maybe_positive_int_column) as is_positive_int
    from {{ ref('a_model_i_like') }}
    ```
    </File>

5. Выполните `dbt compile`, чтобы увидеть, как UDF подставляется в скомпилированный SQL. В следующем примере `{{ function('is_positive_int') }}` заменяется на имя UDF `udf_db.udf_schema.is_positive_int`.

    <File name="models/my_model.sql">

    ```sql
    select
        maybe_positive_int_column,
	    udf_db.udf_schema.is_positive_int(maybe_positive_int_column) as is_positive
    from analytics.dbt_schema.a_model_i_like
    ```
    </File>

    В DAG создаётся узел UDF на основе SQL/Python‑файла и YAML‑описания, и появляется зависимость `is_positive_int` → `my_model`.

   <Lightbox src="/img/docs/building-a-dbt-project/UDF-DAG.png" width="85%" title="DAG для узла UDF" />

После определения UDF, если вы обновите SQL‑ или Python‑файл с телом функции либо её конфигурации, изменения будут применены к UDF в хранилище при следующем запуске `build`.

## Использование UDF в unit‑тестах

Вы можете использовать [unit tests](/docs/build/unit-tests) для проверки моделей, которые ссылаются на UDF. Перед запуском unit‑тестов убедитесь, что функция существует в хранилище. Чтобы гарантировать это для unit‑теста, выполните:

```bash
dbt build --select "+my_model_to_test" --empty
```

Следуя примеру из раздела [Определение UDF в dbt](#определение-udfs-в-dbt), ниже приведён пример unit‑теста, который проверяет модель, вызывающую UDF:

<File name="tests/test_is_positive_int.yml">

```yml
unit_tests:
  - name: test_is_positive_int 
    description: "Проверьте, что моя логика is_positive_int учитывает крайние случаи"
    model: my_model
    given:
      - input: ref('a_model_i_like')
        rows:
          - { maybe_positive_int_column: 10 }
          - { maybe_positive_int_column: -4 }
          - { maybe_positive_int_column: +8 }
          - { maybe_positive_int_column: 1.0 }
    expect:
      rows:
        - { maybe_positive_int_column: 10,  is_positive: true }
        - { maybe_positive_int_column: -4,  is_positive: false }
        - { maybe_positive_int_column: +8,  is_positive: true }
        - { maybe_positive_int_column: 1.0, is_positive: true }
```
</File>

## Просмотр и сборка UDF

Используйте команду [`list`](/reference/commands/list#listing-functions), чтобы вывести список UDF в проекте:  
`dbt list --select "resource_type:function"` или `dbt list --resource-type function`.

Используйте команду [`build`](/reference/commands/build#functions), чтобы выбирать UDF при сборке проекта:  
`dbt build --select "resource_type:function"`.

Подробнее о выборе UDF см. в примерах в разделе [Node selector methods](/reference/node-selection/methods#file).

## Ограничения

- Создание UDF на других языках (например, Java, JavaScript или Scala) пока не поддерживается.
- Python UDF в настоящее время поддерживаются только в Snowflake и BigQuery. Другие хранилища пока не поддерживаются.
- Поддержка Python UDF в <Constant name="fusion" /> пока недоступна. Актуальные обновления см. в [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements).
- В настоящий момент поддерживаются только функции типов <Term id="scalar">scalar</Term> и <Term id="aggregate">aggregate</Term>. Подробнее см. в разделе [Supported function types](/reference/resource-configs/type#supported-function-types).

## Связанные FAQ

<FAQ path="Project/udfs-vs-macros" />
