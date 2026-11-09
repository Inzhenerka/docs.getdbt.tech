---
title: "Пользовательские функции"
description: "Узнайте, как добавлять пользовательские функции (UDF) в ваши dbt‑проекты."
id: "udfs"
availability: all_users
---

# Пользовательские функции (User-defined functions) {#user-defined-functions}

Пользовательские функции (UDF) позволяют определять и регистрировать собственные функции непосредственно в вашем хранилище данных. Подобно [макросам](/docs/build/jinja-macros), UDF способствуют повторному использованию кода, но в отличие от макросов они являются объектами в хранилище. Это означает, что одну и ту же логику можно использовать не только в dbt, но и в других инструментах — например, в BI-системах, ноутбуках для data science и т.д.

UDF особенно полезны для переиспользования логики в нескольких инструментах, стандартизации сложных бизнес‑расчётов, повышения производительности вычислительно тяжёлых операций (поскольку они компилируются и оптимизируются движком запросов вашего хранилища), а также для контроля версий кастомной логики внутри вашего dbt‑проекта.

dbt создаёт, обновляет и переименовывает UDF в процессе выполнения DAG. UDF создаётся в хранилище до той модели, которая на него ссылается. Подробнее о том, как dbt строит UDF в проекте, см. [listing and building UDFs](/docs/build/udfs#listing-and-building-udfs).

Дополнительную информацию о конфигурациях и свойствах UDF см. в разделах [Function properties](/reference/function-properties) и [Function configurations](/reference/function-configs).

## Предварительные требования {#prerequisites}

* Убедитесь, что вы используете **v2 Stable** или **v1 Latest** [канала выпуска](/docs/dbt-versions/dbt-release-tracks) платформы dbt либо <Constant name="dbt" /> v1.11+.
* Используйте один из следующих адаптеров:

	<Tabs>
	
	<TabItem value="core" label="dbt v1">
	
	- BigQuery
	- Snowflake
	- Redshift
	- Postgres
	- Databricks
	- [Starburst/Trino](/reference/resource-configs/trino-configs#user-defined-functions) (`dbt-trino` v1.11+)
	
	</TabItem>
	
	<TabItem value ="fusion" label ="dbt v2">
	
	- BigQuery
	- Snowflake
	- Redshift
	- Databricks
	
	</TabItem>
	</Tabs>

:::important UDF support
UDF на JavaScript поддерживаются в <Constant name="dbt" /> v1.12 и выше на Snowflake и BigQuery.

Другие языки (например, Java, Scala) в настоящее время не поддерживаются для UDF.

Полный список поддерживаемых возможностей UDF см. в разделе [Limitations](#limitations) ниже.
:::

## Определение UDF в dbt {#defining-udfs-in-dbt}

В dbt можно определять UDF на SQL, Python и JavaScript (доступны в <Constant name="dbt" /> v1.12+). UDF на Python поддерживаются в Snowflake, BigQuery и Databricks (требуется [Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/)). UDF на JavaScript поддерживаются в Snowflake и BigQuery.

Выполните следующие шаги, чтобы определить UDF в dbt:

1. Создайте файл SQL, Python или JavaScript в каталоге `functions`. Например, эта UDF проверяет, представляет ли строка положительное целое число:

    <Tabs>

    <TabItem value="SQL">
    Определение SQL UDF в SQL‑файле.

    <File name='functions/is_positive_int.sql'>

    ```sql
    # syntax for BigQuery, Snowflake, and Databricks
    REGEXP_INSTR(a_string, '^[0-9]+$')

    # syntax for Redshift and Postgres
    SELECT REGEXP_INSTR(a_string, '^[0-9]+$')

    # syntax for Starburst/Trino
    CASE WHEN regexp_like(a_string, '^[0-9]+$') THEN 1 ELSE 0 END

    ```

    </File>

    </TabItem>
    <TabItem value="Python">
    Определите Python UDF в файле Python.

    <File name='functions/is_positive_int.py'>

    ```py
    import re

    def main(a_string):
        return 1 if re.search(r'^[0-9]+$', a_string or '') else 0
    ```
    </File>

    For Databricks, the contents of the `.py` file become the UDF body verbatim, and Databricks evaluates that body directly instead of calling a named entry point. Write the body so its last statement is a top-level `return` that produces the result. Because of that top-level `return`, the Databricks source is a function _body_, not a runnable `.py` module. For example:

    <File name='functions/is_positive_int.py'>

    ```py
    import re

    def main(a_string):
        return 1 if re.search(r'^[0-9]+$', a_string or '') else 0

    return main(a_string)
    ```
    </File>

    **Note:** Python UDFs on Databricks require [Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/).

    </TabItem>
    <TabItem value="JavaScript">
    Define a JavaScript UDF in a JavaScript file.

    <File name='functions/is_positive_int.js'>

    ```js
    return /^[0-9]+$/.test(a_string) ? 1 : 0;
    ```
    </File>
    </TabItem>
    </Tabs>

**Примечание**: Вы можете указать конфигурации в блоке config в SQL-файле или в соответствующем YAML-файле свойств на шаге 2. 

2. Укажите имя функции и определите конфигурацию, свойства, тип возвращаемого значения и необязательные аргументы в соответствующем YAML-файле свойств.

    <Tabs>
    <TabItem value="SQL">

    <File name='functions/is_positive_int.yml'>

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

    For Starburst/Trino, set the argument's `data_type` to a valid engine [data type](https://trino.io/docs/current/language/types.html) (such as `varchar` instead of `string`) and omit `default_value`. On Starburst Galaxy, set the database and schema values as `database: galaxy` and `schema: functions`.

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
    
    Следующие конфигурации обязательны при определении Python UDF в Snowflake и BigQuery:

    - [`runtime_version`](/reference/resource-configs/runtime-version) — версия Python, в которой будет выполняться код. Поддерживаемые значения:
      - [Snowflake](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-introduction): `3.10`, `3.11`, `3.12`, `3.13`
      - [BigQuery](https://cloud.google.com/bigquery/docs/user-defined-functions-python): `3.11`
    - [`entry_point`](/reference/resource-configs/entry-point) &mdash; Укажите функцию Python, которую нужно вызвать.
    <br></br>

    В Databricks параметры `runtime_version` и `entry_point` принимаются для совместимости между адаптерами, но ни на что не влияют. Databricks самостоятельно управляет средой выполнения Python и напрямую использует тело функции, поэтому dbt выводит предупреждение, если вы задаёте эти параметры.

    You can specify public third-party PyPI packages for your Python UDF with the optional `packages` config. List package names, such as `numpy` and `pandas`, and optionally pin versions, such as `pandas==1.5.0`. The warehouse installs these packages when it creates the UDF, so your UDF can use functionality from external Python libraries. On Snowflake, some packages are installed from the Anaconda repository, and you may need to [accept Anaconda's Terms of Service](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages#using-third-party-packages-from-anaconda) before you can use them.

    The following example shows a Python UDF with the required configs (`runtime_version`, `entry_point`), the optional `packages` config, and other common configs:

    <File name='functions/is_positive_int.yml'>

    ```yml
      functions:
        - name: is_positive_int # обязательно
          description: Моя UDF, которая возвращает 1, если строка представляет собой «чистое» положительное целое число (например, "10"; "+8" не допускается). # optional
          config:
            runtime_version: "3.11"   # обязательно для Snowflake и BigQuery; необязательно и игнорируется в Databricks
            entry_point: main         # обязательно для Snowflake и BigQuery; необязательно и игнорируется в Databricks
            packages:                 # необязательно, только для Python UDF
              - numpy
              - pandas==1.5.0
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
    <TabItem value="JavaScript">

    You can optionally set [`snowflake.quote_args`](/reference/resource-configs/quote_args) to control whether argument names are quoted when creating a JavaScript UDF on Snowflake.

    <File name='functions/is_positive_int.yml'>

    ```yml
    functions:
      - name: is_positive_int                    # required
        description: My UDF that returns 1 if a string represents a naked positive integer (like "10", "+8" is not allowed). # optional
        config:
          snowflake:                             # optional
            quote_args: true                     # optional, JavaScript UDFs on Snowflake only
        arguments:                               # optional
          - name: a_string                       # required if arguments is specified
            data_type: string                    # required if arguments is specified
            description: The string to check     # optional
        returns:                                 # required
          data_type: integer                     # required
    ```
    </File>
    </TabItem>
    </Tabs>

:::info Зависимость volatility от хранилища данных
   	В dbt параметр `volatility` принимается для UDF на SQL, Python и JavaScript, но его обработка зависит от хранилища данных. Для UDF на SQL и Python в BigQuery параметр `volatility` игнорируется, а dbt выводит предупреждение. Для UDF на JavaScript в BigQuery значения `deterministic` и `non-deterministic` применяются при создании UDF; значение `stable` не поддерживается. В Snowflake все поддерживаемые значения `volatility` применяются при создании UDF. Дополнительную информацию см. в разделе [volatility](/reference/resource-configs/volatility).
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

При выполнении `dbt build` файл свойств (`functions/is_positive_int.yml`) и соответствующий файл SQL, Python или JavaScript совместно используются для формирования инструкции `CREATE FUNCTION`.
     
    Сформированная инструкция `CREATE FUNCTION` зависит от используемого адаптера. Например:

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

    <TabItem value="Starburst/Trino">

    ```sql
    CREATE OR REPLACE FUNCTION galaxy.functions.is_positive_int(a_string VARCHAR)
    RETURNS INTEGER
    DETERMINISTIC
    COMMENT 'My UDF that returns 1 if a string represents a naked positive integer (like "10", "+8" is not allowed).'
    RETURN CASE WHEN regexp_like(a_string, '^[0-9]+$') THEN 1 ELSE 0 END;
    ```

    For more information, refer to [Starburst/Trino configurations](/reference/resource-configs/trino-configs#user-defined-functions).

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
      PACKAGES = ('numpy', 'pandas==1.5.0')
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
    OPTIONS(
      runtime_version = "python-3.11",
      entry_point = "main",
      packages = ['numpy', 'pandas==1.5.0']
    )
    AS r'''
      import re
      def main(a_string):
        return 1 if re.search(r'^[0-9]+$', a_string or '') else 0
    ''';
    ```
    </TabItem>

    <TabItem value="Databricks">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
    RETURNS INT
    LANGUAGE PYTHON
    AS $$
      import re
      def main(a_string):
        return 1 if re.search(r'^[0-9]+$', a_string or '') else 0
      return main(a_string)
    $$;
    ```

    Databricks omits the `RUNTIME_VERSION` and `HANDLER` clauses. The runtime is managed internally, and the contents of your `.py` file become the function body verbatim &mdash; including the trailing `return main(a_string)` that produces the result.
    </TabItem>
    </Tabs>
    </TabItem>

    <TabItem value="JavaScript">
    <Tabs>

    <TabItem value="Snowflake">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int("a_string" STRING)
    RETURNS INTEGER
    LANGUAGE JAVASCRIPT
    AS $$
    return /^[0-9]+$/.test(a_string) ? 1 : 0;
    $$;
    ```
    </TabItem>

    <TabItem value="BigQuery">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
    RETURNS INT64
    LANGUAGE js
    AS r'''
    return /^[0-9]+$/.test(a_string) ? 1 : 0;
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

При использовании [`--defer`](/reference/node-selection/defer) `function()` ссылается на существующую UDF в среде, на которую перенаправляются ссылки (например, в production), если функция не выбрана или ещё не создана в вашей целевой среде. Для этого требуется манифест состояния, указанный с помощью `--state` или эквивалентной переменной окружения (например, `DBT_ENGINE_STATE`), который dbt использует, чтобы определить, куда перенаправлять ссылки. Это позволяет успешно запускать модели, зависящие от UDF, в рабочих процессах [непрерывной интеграции](/docs/deploy/continuous-integration) и разработки. Подробнее см. в разделе [Настройка выбора на основе состояния](/reference/node-selection/configure-state).

5. Выполните `dbt compile`, чтобы увидеть, как формируется ссылка на UDF. В следующем примере `{{ function('is_positive_int') }}` заменяется именем UDF `udf_db.udf_schema.is_positive_int`.

    <File name="models/my_model.sql">

    ```sql
    select
        maybe_positive_int_column,
	    udf_db.udf_schema.is_positive_int(maybe_positive_int_column) as is_positive
    from analytics.dbt_schema.a_model_i_like
    ```
    </File>

    В DAG создаётся узел UDF на основе SQL/Python‑файла и YAML‑описания, и появляется зависимость `is_positive_int` → `my_model`.

После определения UDF ваши изменения применяются к UDF в хранилище при следующем запуске `dbt build`, если вы изменили что-либо из следующего:

- Файл SQL, Python или JavaScript, содержащий тело функции (`is_positive_int.sql`, `is_positive_int.py` или `is_positive_int.js` в этих примерах)
- Её конфигурации
- Её свойства, определённые в файле `.yml` (например, `arguments` или `returns`)

dbt обнаруживает все эти изменения при использовании [`state:modified`](/reference/node-selection/methods#state).

### Определение перегруженных UDF

Используйте свойство [`overloads`](/reference/resource-properties/overloads) (доступно в <Constant name="dbt" /> v1.12+), чтобы определить несколько сигнатур аргументов для одной функции. Это позволяет вызывать функцию с одним и тем же именем, передавая входные данные разных типов, без создания отдельных UDF для каждого варианта. `overloads` поддерживается для SQL UDF в Snowflake и Postgres, а также для UDF на Python и JavaScript в Snowflake.

Чтобы определить перегруженные UDF:

1. Добавьте список `overloads` в определение функции в YAML-файле свойств. Каждая запись использует `defined_in` для ссылки на отдельный файл и может содержать необязательные свойства `arguments` и `returns`:

    <File name='functions/is_positive_int.yml'>

    ```yml
    functions:
      - name: is_positive_int
        arguments:
          - name: a_string
            data_type: string
        returns:
          data_type: integer
        overloads:
          - defined_in: is_positive_int_numeric   # references functions/is_positive_int_numeric.sql
            arguments:
              - name: a_num
                data_type: numeric
            returns:              # optional, inherits from root function if omitted
              data_type: integer
    ```

    </File>

2. Создайте отдельный файл для тела каждой перегрузки.

    Например, тело основной функции, принимающей аргумент типа `string`:

    <File name='functions/is_positive_int.sql'>

    ```sql
    # Snowflake syntax
    REGEXP_INSTR(a_string, '^[0-9]+$')
    ```

    </File>

    И тело перегрузки, принимающей аргумент типа `numeric`:

    <File name='functions/is_positive_int_numeric.sql'>

    ```sql
    # Snowflake syntax
    CASE WHEN a_num > 0 THEN 1 ELSE 0 END
    ```

    </File>

Все перегрузки объединяются в один узел DAG (основную функцию), поэтому они создаются и выбираются вместе. При повторной попытке dbt пропускает успешно созданные перегрузки и повторно запускает только те, при создании которых произошла ошибка. При создании функции dbt формирует отдельный оператор `CREATE FUNCTION` для каждой перегрузки, используя одно и то же имя функции, но разные типы аргументов.

Дополнительную информацию см. в разделе [`overloads`](/reference/resource-properties/overloads).

## Использование UDF в unit‑тестах {#using-udfs-in-unit-tests}

Вы можете использовать [unit tests](/docs/build/unit-tests) для проверки моделей, которые ссылаются на UDF. Перед запуском unit‑тестов убедитесь, что функция существует в хранилище. Чтобы гарантировать это для unit‑теста, выполните:

```bash
dbt build --select "+my_model_to_test" --empty
```

Следуя примеру из раздела [Определение UDF в dbt](#defining-udfs-in-dbt), ниже приведён пример unit‑теста, который проверяет модель, вызывающую UDF:

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

## Просмотр и сборка UDF {#listing-and-building-udfs}

Используйте команду [`list`](/reference/commands/list#listing-functions), чтобы вывести список UDF в проекте:  
`dbt list --select "resource_type:function"` или `dbt list --resource-type function`.

Используйте команду [`build`](/reference/commands/build#functions), чтобы выбирать UDF при сборке проекта:  
`dbt build --select "resource_type:function"`.

Подробнее о выборе UDF см. в примерах в разделе [Node selector methods](/reference/node-selection/methods#file).

## Ограничения {#limitations}
- UDF на других языках (например, Java или Scala) пока не поддерживаются.
- UDF на JavaScript поддерживаются только в Snowflake и BigQuery. Использование UDF на JavaScript с неподдерживаемым адаптером вызывает ошибку разбора.
- UDF на Python поддерживаются только в Snowflake, BigQuery и Databricks (при использовании <Constant name="core" /> или <Constant name="fusion" />). Другие хранилища данных пока не поддерживаются для UDF на Python.
- В настоящее время поддерживаются только <Term id="scalar">скалярные</Term> и <Term id="aggregate">агрегатные</Term> функции. Подробнее см. в разделе [Поддерживаемые типы функций](/reference/resource-configs/type#supported-function-types).
- Свойство `overloads` поддерживается для UDF на SQL в Snowflake и Postgres, а также для UDF на Python и JavaScript в Snowflake.

- Создание UDF на других языках (например, Java, JavaScript или Scala) пока не поддерживается.
- Python UDF в настоящее время поддерживаются только в Snowflake и BigQuery. Другие хранилища пока не поддерживаются.
- Поддержка Python UDF в <Constant name="fusion" /> пока недоступна. Актуальные обновления см. в [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements).
- В настоящий момент поддерживаются только функции типов <Term id="scalar">scalar</Term> и <Term id="aggregate">aggregate</Term>. Подробнее см. в разделе [Supported function types](/reference/resource-configs/type#supported-function-types).

## Связанные FAQ {#related-faqs}

<FAQ path="Project/udfs-vs-macros" />
