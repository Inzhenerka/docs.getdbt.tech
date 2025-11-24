---
title: arguments (for functions)
sidebar_label: "arguments"
id: function-arguments
---
<VersionCallout version="1.11" /> 
import ArgumentsShared from '/snippets/_arguments-shared.md';

<File name='functions/<filename>.yml'>

```yml

functions:
  - name: <function name>
    arguments:
      - name: <arg name>
        data_type: <string> # warehouse-specific
        description: <markdown_string>
        default_value: <string | boolean | integer> # optional, available in Snowflake and Postgres

```

</File>

## Definition

<ArgumentsShared />

For **functions**, you can add `arguments` to a [function property](/reference/function-properties), which defines the parameters for user-defined functions (UDFs) in your warehouse. The `data_type` for function arguments is warehouse-specific (for example, `STRING`, `VARCHAR`, `INTEGER`) and should match the data types supported by your data platform.

## Properties

### name

The name of the argument. This is a required field if `arguments` is specified.

### data_type

The data type that the warehouse expects for this parameter. This is a required field if `arguments` is specified and must match the data types supported by your specific data platform.

:::important Warehouse-specific data types

The `data_type` values are warehouse-specific. Use the data type syntax that your warehouse requires:

- **Snowflake**: `STRING`, `NUMBER`, `BOOLEAN`, `TIMESTAMP_NTZ`, etc.
- **BigQuery**: `STRING`, `INT64`, `BOOL`, `TIMESTAMP`, `ARRAY<STRING>`, etc.
- **Redshift**: `VARCHAR`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, etc.
- **Postgres**: `TEXT`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, etc.

Refer to your warehouse documentation for the complete list of supported data types.

:::

### description

An optional markdown string describing the argument. This is helpful for documentation purposes.

### default_value

The `default_value` is an optional property that you can use to define a default value for a function argument. If no value is provided for that argument, the warehouse uses the specified default. Setting a `default_value` makes the argument optional. This property is supported in [Snowflake](https://docs.snowflake.com/en/developer-guide/udf-stored-procedure-arguments#designating-an-argument-as-optional) and [Postgres](https://www.postgresql.org/docs/current/sql-createfunction.html). 

When using this property, note that the order of your argument definitions is important. Arguments without default values should _not_ come after arguments with default values. For example: 

<File name='functions/schema.yml'>

```yml
functions:
  - name: sum_2_values
    description: Add two values together
    arguments:
      - name: val1 # this argument comes first because it has no default value
        data_type: integer
        description: The first value
      - name: val2
        data_type: integer
        description: The second value
        default_value: 0 
    returns:
      data_type: integer
```

In this example:
- `val1` has no `default_value`, so it’s required.
- `val2` has a `default_value` of `0`, so it’s optional. If you don’t provide a value for `val2`, the function uses `0` instead.

</File>

## Examples

### Simple function arguments

<File name='functions/schema.yml'>

```yml

functions:
  - name: is_positive_int
    arguments:
      - name: a_string
        data_type: string
        description: "The string that I want to check if it's representing a positive integer (like '10')"
    returns:
      data_type: boolean
```

</File>

### Complex data types

<File name='functions/schema.yml'>

```yml

functions:
  - name: calculate_discount
    arguments:
      - name: original_price
        data_type: DECIMAL(10,2)
        description: "The original price before discount"
      - name: discount_percent
        data_type: INTEGER
        description: "The discount percentage to apply"
    returns:
      data_type: DECIMAL(10,2)
      description: "The discounted price"
```

</File>

### Array data types (BigQuery example)

<File name='functions/schema.yml'>

```yml

functions:
  - name: get_tags
    arguments:
      - name: tag_string
        data_type: STRING
        description: "Comma-separated string of tags"
    returns:
      data_type: ARRAY<STRING>
      description: "An array of individual tag strings"
```

</File>

## Related documentation

- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [Arguments (for macros)](/reference/resource-properties/arguments)
- [Returns](/reference/resource-properties/returns)


