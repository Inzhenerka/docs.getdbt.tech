---
title: "User-defined functions"
description: "Learn how to add user-defined functions (UDFs) to your dbt projects."
id: "udfs"
---

# User-defined functions <Lifecycle status="beta" />

User-defined functions (UDFs) enable you to define and register custom functions in your warehouse. Like [macros](/docs/build/jinja-macros), UDFs promote code reuse, but they are objects in the warehouse so you can reuse the same logic in tools outside dbt, such as BI tools, data science notebooks, and more. 

UDFs are particularly valuable for sharing logic across multiple tools, standardizing complex business calculations, improving performance for compute-intensive operations (since they're compiled and optimized by your warehouse's query engine), and version controlling custom logic within your dbt project.

dbt creates, updates, and renames UDFs as part of DAG execution. The UDF is built in the warehouse before the model that references it. Refer to [listing and selecting UDFs](/docs/build/udfs#listing-and-selecting-udfs) for more info on how to build UDFs in your project.

Refer to [Function properties](/reference/function-properties) or [Function configurations](/reference/function-configs) for more information on the configs/properties for UDFs.

## Prerequisites

* Make sure you're using dbt platform's **Latest Fusion** or **Latest** [release track](/docs/dbt-versions/cloud-release-tracks) or dbt Core v1.11.
* Use one of the following adapters:

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

## Defining UDFs in dbt

You can define SQL and Python UDFs in dbt. Note: Python UDFs are currently supported in Snowflake and BigQuery.

Follow these steps to define UDFs in dbt:

1. Create a SQL or Python file under the `functions` directory. For example, this UDF checks if a string represents a positive integer:

    <Tabs>

    <TabItem value="SQL">
    Define a SQL UDF in a SQL file.

    <File name='functions/is_positive_int.sql'>

    ```sql
    REGEXP_INSTR(a_string, '^[0-9]+$') # syntax for BigQuery, Snowflake, and Redshift

    regexp_instr(a_string, '^[0-9]+$') # syntax for Postgres and Databricks
    ```

    </File>

    </TabItem>
    <TabItem value="Python">
    Define a Python UDF in a Python file. The Python function returns 1 if `a_string` represents a positive integer (like "10", "+8" not allowed).

    <File name='functions/is_positive_int.py'>

    ```py
    import re
    
    def main(a_string):
        return 1 if re.search(r'^[0-9]+$', a_string or '') else 0
    ```
    </File>
    </TabItem>
    </Tabs>

    **Note**: You can specify configs in the SQL file or in the corresponding YAML file in next step (Step 2). 

2. Specify the function name and define the config, properties, return type, and optional arguments in a corresponding YAML file. For example:

    <Tabs>
    <TabItem value="SQL">

    <File name='functions/schema.yml'>

    ```yml
    functions:
      - name: is_positive_int # required
        description: My UDF that determines if a string represents a positive (+) integer # optional
        config:
          schema: udf_schema
          database: udf_db
          volatility: deterministic
        arguments: # optional
          - name: a_string # required if arguments is specified
            data_type: string # required if arguments is specified
            description: The string that I want to check if it's representing a positive integer (like "10") 
        returns: # required
          data_type: integer # required
    ```
    </File>

    <!--other types not yet supported
    <Expandable alt_header="Supported UDF types">

    You can use these values for the `type` property when you define a function in a YAML file.

    - `scalar` - Returns a single value per row
    - `aggregate` - Returns a single value per group, aggregating several rows
    - `table` - Returns a table result
    <br></br>
    For example:

    ```yml
    functions:
	  - name: string 
	    description: string
      	config:
	      type: scalar # default value
    ```

    If not explicitly specified, the `type` config defaults to `scalar`.

    </Expandable>
    -->
    
    The rendered `CREATE` UDF statement depends on which adapter you’re using. For example:

    <Tabs>

    <TabItem value="Snowflake">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
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
    RETURN regexp_instr(a_string, '^[0-9]+$');
    ```
    </TabItem>

    <TabItem value="Postgres">

    ```sql
    CREATE OR REPLACE FUNCTION udf_schema.is_positive_int(a_string text)
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
    
    The following configs are required when defining a Python UDF: 

    - [`runtime_version`](/reference/resource-configs/runtime-version) &mdash; Specify the Python version to run. Supported values are:
      - [Snowflake](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-introduction): `3.10`, `3.11`, `3.12`, and `3.13`
      - [BigQuery](https://cloud.google.com/bigquery/docs/user-defined-functions-python): `3.11`
    - [`entry_point`](/reference/resource-configs/entry-point) &mdash; Specify the Python function to be called.

    
    For example:

    <File name='functions/schema.yml'>

    ```yml
      functions:
        - name: is_positive_int
          description: My UDF that determines if a string represents a positive (+) integer. Returns 1 if a_string represents a positive integer (like "10", "+8" not allowed here). # optional
          config:
            runtime_version: "3.11"   # required
            entry_point: main      
            schema: udf_schema
            database: udf_db
            volatility: deterministic  # behavior is warehouse-specific; see note after this example
          arguments:
            - name: a_string
              data_type: string
          returns:
            data_type: integer
    ```
    </File>
   :::info volatility warehouse-specific
   Something to note is that `volatility` is accepted in dbt for Python UDFs, but the handling  of it is warehouse-specific. BigQuery ignores `volatility` and dbt displays a warning. In Snowflake, `volatility` is applied when creating the UDF. Refer to [volatility](/reference/resource-configs/volatility#warehouse-specific-volatility-keywords) for more information.
    :::

    This `functions/schema.yml` file example generates the following `CREATE` UDF statement:

    <Tabs>

    <TabItem value="Snowflake">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
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

3. Reference the UDF in a model using the `{{ function(...) }}` macro. For example:

    <File name="models/my_model.sql">

    ```sql
    select
        maybe_positive_int_column,
        {{ function('is_positive_int') }}(maybe_positive_int_column) as is_positive_int
    from {{ ref('a_model_i_like') }}
    ```
    </File>

4. Run `dbt compile`. In the following example, the `{{ function('is_positive_int') }}` is replaced by the UDF name `udf_db.udf_schema.is_positive_int`.

    <File name="models/my_model.sql">

    ```sql
    select
        maybe_positive_int_column,
	    udf_db.udf_schema.is_positive_int(maybe_positive_int_column) as is_positive
    from analytics.dbt_schema.a_model_i_like
    ```
    </File>

    In your DAG, a UDF node is created from the SQL/Python and YAML definitions, and there will be a dependency between `is_positive_int` → `my_model`.
   <Lightbox src="/img/docs/building-a-dbt-project/UDF-DAG.png" width="85%" title="The DAG for the UDF node" />

After defining a UDF, if you update the SQL/Python file that contains its function body (`is_positive_int.sql` or `is_positive_int.py` in this example) or its configurations, your changes will be applied to the UDF in the warehouse next time you `build`.

### Setting `volatility` in UDFs

import VolatilityDefinition from '/snippets/_volatility-definition.md';

<VolatilityDefinition />

In dbt, you can use the following values for the `volatility` config:

| Value | Description | Example |
| --- | --- | --- |
| `deterministic` | Always returns the same output for the same input. Safe for aggressive optimizations and caching. | `substr()` &mdash; Produces the same substring when given the same string and parameters. |
| `stable` | Returns the same value within a single query execution, but may change across executions. Not supported by all warehouses. For more information, see [Warehouse-specific volatility keywords](/docs/build/udfs#warehouse-specific-volatility-keywords).| `now()` &mdash; Returns the current timestamp the moment a query starts; constant within a single query but different across runs. |
| `non-deterministic` | May return different results for the same inputs. Warehouses shouldn't cache or reorder assuming stable results. | `first()` &mdash; May return different rows depending on query plan or ordering. <br></br>`random()` &mdash; Produces a random number that varies with each call, even with identical inputs. |

Defining a function's volatility lets the data warehouse do optimizations when executing the function. By default, dbt does not specify a volatility value. If you don’t set volatility, dbt generates a `CREATE` statement without a volatility keyword, and the warehouse’s default behavior applies &mdash; except in Redshift. In Redshift, dbt sets `non-deterministic` (`VOLATILE`) by default if no volatility is specified, because Redshift requires an explicit volatility and `VOLATILE` is the safest assumption.

To set a function's volatility, refer to the following example: 

<File name='functions/schema.yml'>

```yaml
functions:
  - name: is_positive_int
    description: Check whether a string is a positive integer
    config:
      volatility: deterministic # Optional: stable | non-deterministic | deterministic
    arguments:
      - name: a_string
        data_type: string
    returns:
      data_type: boolean
```
</File>

The `volatility` value you define is passed to the adapter, which adds the correct keyword for your data warehouse. 

import Volatility from '/snippets/_warehouse-volatility.md';

<Volatility />


## Using UDFs in unit tests

You can use [unit tests](/docs/build/unit-tests) to validate models that reference UDFs. Before running unit tests, make sure the function exists in your warehouse. To ensure that the function exists for a unit test, run:

```bash
dbt build --select "+my_model_to_test" --empty
```

Following the example in [Defining UDFs in dbt](#defining-udfs-in-dbt), here's an example of a unit test that validates a model that calls a UDF:

<File name="tests/test_is_positive_int.yml">

```yml
unit_tests:
  - name: test_is_positive_int 
    description: "Check my is_positive_int logic captures edge cases"
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

## Listing and selecting UDFs

Use the [`list` command](/reference/commands/list#listing-functions) to list UDFs in your project: `dbt list --select "resource_type:function"` or `dbt list --resource-type function`.

Use the [`build` command](/reference/commands/build#functions) to select UDFs when building a project: `dbt build --select "resource_type:function"`.

For more information about selecting UDFs, see the examples in [Node selector methods](/reference/node-selection/methods#file).

## Limitations
- Creating UDFs in other languages (for example, Java or Scala) is not yet supported. 
- Only <Term id="scalar">scalar</Term> functions are currently supported.

## Related FAQs

<FAQ path="Project/udfs-vs-macros" />
