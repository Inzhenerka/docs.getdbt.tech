---
title: Legacy snapshot jinja block
description: Read about legacy snapshot jinja blocks and how to migrate to the updated syntax
sidebar: Legacy snapshot jinja block
---

From dbt versions 1.8 and earlier, you were able to configure snapshots using jinja blocks in your `.sql` files. Configuring snapshots this way is considered legacy syntax. It was replaced with a YAML-based configuration in [dbt Cloud's "Latest" release track](/docs/dbt-versions/cloud-release-tracks) and dbt v1.9 for faster and more efficient management. 

This page details how to use the legacy SQL-based configurations and provides a path to migrate to the more efficient YAML configuration. For new snapshots, we recommend using these latest YAML-based configs. If applying them to existing snapshots, you'll need to [migrate over](/reference/snapshot-configs#snapshot-configuration-migration).

The following table outlines the differences between the legacy SQL-based syntax and the updated YAML-based syntax.

| Snapshot syntax | Description |  Example |
| --------------- | ----------- |  ------- |
| [SQL-based](#sql-based-snapshot-syntax) | Legacy syntax for defining snapshots in `.sql` files within a snapshot jinja block. Available in dbt v1.8 and earlier. <!-- Found in `snapshots` directory.<br /><br /> - Avoid defining multiple resources in one file to improve performance. <br /> - Suitable for legacy snapshots.<br /> - Useful for very light transformations, however creating a separate ephemeral model for transformations is best practice and more maintainable.  --> |`{% snapshot orders_snapshot %}` in a `.sql` file using `{{ config() }}` |
| [YAML-based](#yaml-based-snapshot-syntax) | Updated syntax for defining snapshot configurations in YAML files. Found in `snapshots.yml`. Available in dbt Cloud's "Latest" release track and dbt v1.9 and later.<!-- <br /><br /> - More performant and easier to manage.<br /> - Useful for new snapshots or existing snapshots that need to be migrated.<br /> - Use an ephemeral model for transformations and reference with `relation` field. --> |`snapshots.yml`|

### SQL-based snapshot syntax
Legacy syntax for defining snapshots in `.sql` files within a snapshot Jinja block, typically located in your `snapshots` directory.

#### Use cases

- Defining multiple resources in a single file, though it can significantly slow down parsing and compilation.
- Useful for existing snapshots already using this syntax.
- Suitable for performing very light transformations (but creating a separate ephemeral model for transformations is recommended for better maintainability).

#### Example

In this example, we created a snapshot in the `snapshots` directory and used the `{{ config() }}` block within the jinja block to define the snapshot configuration.

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{{ config(
    target_database='analytics',
    target_schema='snapshots',
    unique_key='id',
    strategy='timestamp',
    updated_at='updated_at'
) }}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>

### YAML-based snapshot syntax
Updated syntax for defining snapshot configurations in YAML files.

#### Use cases

- More performant and easier to manage.
- Ideal for new snapshots or existing snapshots that need to be [migrated](/reference/snapshot-configs#snapshot-configuration-migration).
- Create transformations separate from the snapshot file by creating an ephemeral model and referencing it in the snapshot using the `relation` field.

#### Example

In this example, we created a snapshot in the `snapshots` directory (and separately an ephemeral model in the `models` directory). We then used the [`ref` function](/reference/dbt-jinja-functions/ref) to reference the ephemeral model in the `snapshots.yml` file in the `relation` field.

<File name='snapshots.yml'>

```yaml
snapshots:
 - name: orders_snapshot
   relation: ref('orders_ephemeral')
   config:
     unique_key: id
     strategy: timestamp
     updated_at: updated_at
```
</File>

In this second example, we used the `relation` field to reference the source table using the [`source` function](/reference/dbt-jinja-functions/source).

<File name="snapshot/orders_snapshot.yaml">

```yaml
snapshots:
  - name: orders_snapshot
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      database: analytics
      unique_key: id
      strategy: timestamp
      updated_at: updated_at
      dbt_valid_to_current: "to_date('9999-12-31')"

```
</File>

## Legacy snapshot configuration

Although there's a more performant method, you may still want to use the legacy way to define your snapshots if it suits your needs. This page will list out the types of configurations suitable for snapshots and how to migrate from the legacy way to the updated method:

- List out each header so there's a high-level overview of what's covered

### Resource-specific configurations
Resource-specific configurations are applicable to only one dbt resource type rather than multiple resource types. You can define these settings in the project file (`dbt_project.yml`), a property file (`models/properties.yml` for models, similarly for other resources), or within the resource’s file using the `{{ config() }}` macro.

<File name='snapshots/orders_snapshot.sql'>

```sql
{ % snapshot orders_snapshot %}

{{ config(
    target_schema="<string>",
    target_database="<string>",
    unique_key="<column_name_or_expression>",
    strategy="timestamp" | "check",
    updated_at="<column_name>",
    check_cols=["<column_name>"] | "all"
    invalidate_hard_deletes : true | false
) 
}}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>

### General configuration
Use general configurations for broader operational settings applicable across multiple resource types. Like resource-specific configurations, these can also be set in the project file, property files, or within resource-specific files using a config block.

```sql

{{ config(
    enabled=true | false,
    tags="<string>" | ["<string>"],
    alias="<string>", 
    pre_hook="<sql-statement>" | ["<sql-statement>"],
    post_hook="<sql-statement>" | ["<sql-statement>"]
    persist_docs={<dict>}
    grants={<dict>}
) }}
```

## Snapshot strategies
Snapshot "strategies" define how dbt knows if a row has changed. There are two strategies built-in to dbt that require the `strategy` parameter:

- Timestamp — Uses an updated_at column to determine if a row has changed.
- Check — Compares a list of columns between their current and historical values to determine if a row has changed. Uses the `check_cols` parameter.

```sql
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  strategy="timestamp",
  updated_at="column_name"
) }}

select ...

{% endsnapshot %}
```

```sql
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  strategy="check",
  check_cols=[column_name] | "all"
) }}

{% endsnapshot %}
```

### Timestamp
The timestamp strategy uses an `updated_at` field to determine if a row has changed. If the configured `updated_at` column for a row is more recent than the last time the snapshot ran, then dbt will invalidate the old record and record the new one. If the timestamps are unchanged, then dbt will not take any action.

#### Example

<Expandable alt_header="Timestamp strategy">

<File name='snapshots/timestamp_example.sql'>

```sql
{% snapshot orders_snapshot_timestamp %}

    {{
        config(
          target_schema='snapshots',
          strategy='timestamp',
          unique_key='id',
          updated_at='updated_at',
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>

</Expandable>

### Check
The check strategy is useful for tables which do not have a reliable `updated_at` column. It requires the `check_cols` parameter, which is a list of columns within the results of your snapshot query to check for changes. Alternatively, use all columns using the all value (however this may be less performant).

<File name='snapshots/check_example.sql'>

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>

#### Examples
<Expandable alt_header="Check a list of columns for changes">

<File name='snapshots/check_example.sql'>

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>
</Expandable>

<Expandable alt_header="Check all columns for changes">

<File name='snapshots/check_example.sql'>

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols='all',
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>
</Expandable>

## Examples

This section outlines some examples of how to apply configurations to snapshots using the legacy method.

### Apply configurations to one snapshot only
Use config blocks if you need to apply a configuration to one snapshot only.

<File name='snapshots/postgres_app/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}
    {{
        config(
          unique_key='id',
          strategy='timestamp',
          updated_at='updated_at'
        )
    }}
    -- Pro-Tip: Use sources in snapshots!
    select * from {{ source('jaffle_shop', 'orders') }}
{% endsnapshot %}
```
</File>

### Using the updated_at parameter

The `updated_at` parameter is required if using the timestamp strategy. The `updated_at` parameter is a column within the results of your snapshot query that represents when the record row was last updated.

<File name='snapshots/orders.sql'>

```sql
{{ config(
  strategy="timestamp",
  updated_at="column_name"
) }}
```
</File>

- #### Using a column name `updated_at`:
  <File name='snapshots/orders.sql'>

  ```sql
  {% snapshot orders_snapshot %}

  {{
      config(
        target_schema='snapshots',
        unique_key='id',

        strategy='timestamp',
        updated_at='updated_at'
      )
  }}

  select * from {{ source('jaffle_shop', 'orders') }}

  {% endsnapshot %}
  ```
  </File>

- #### Coalescing two columns to create a reliable `updated_at` column:
  
  Consider a data source that only has an `updated_at` column filled in when a record is updated (so a `null` value indicates that the record hasn't been updated after it was created).
  
  Since the `updated_at` configuration only takes a column name, rather than an expression, you should update your snapshot query to include the coalesced column.

  <File name='snapshots/orders.sql'>

  ```sql
  {% snapshot orders_snapshot %}

  {{
      config(
        target_schema='snapshots',
        unique_key='id',

        strategy='timestamp',
        updated_at='updated_at_for_snapshot'
      )
  }}

  select
      *,
      coalesce(updated_at, created_at) as updated_at_for_snapshot

  from {{ source('jaffle_shop', 'orders') }}

  {% endsnapshot %}
  ```
  </File>

### Using the unique_key parameter
The `unique_key` is a column name or expression that is unique for the inputs of a snapshot. dbt uses [`unique_key`](/reference/resource-configs/unique_key) to match records between a result set and an existing snapshot, so that changes can be captured correctly.

<File name='snapshots/orders.sql'>

```sql
{{ config(
  unique_key="column_name"
) }}
```
</File>

#### Examples

- Using an `id` column as a unique key

  <File name='snapshots/orders.sql'>

  ```sql
  {{
      config(
        unique_key="id"
      )
  }}
  ```
  </File>

  You can also write this in YAML. This might be a good idea if multiple snapshots share the same `unique_key` (though we prefer to apply this configuration in a config block, as above).

- #### Using a combination of two columns as a unique key

  This configuration accepts a valid column expression. As such, you can concatenate two columns together as a unique key if required. It's a good idea to use a separator (e.g. '-') to ensure uniqueness.

  <File name='snapshots/transaction_items_snapshot.sql'>

  ```sql
  {% snapshot transaction_items_snapshot %}

      {{
          config(
            unique_key="transaction_id||'-'||line_item_id",
            ...
          )
      }}

  select
      transaction_id||'-'||line_item_id as id,
      *
  from {{ source('erp', 'transactions') }}

  {% endsnapshot %}
  ```

  </File>

  Though, it's probably a better idea to construct this column in your query and use that as the `unique_key`:

    <File name='snapshots/transaction_items_snapshot.sql'>

    ```sql
    {% snapshot transaction_items_snapshot %}

        {{
            config(
              unique_key="id",
              ...
            )
        }}

    select
        transaction_id || '-' || line_item_id as id,
        *
    from {{ source('erp', 'transactions') }}

    {% endsnapshot %}
    ```
    </File>

## Migrate from legacy to update

This page outlines the steps you need to follow to convert legacy jinja block snapshot configurations into the updaetd YAML-based configuration format.

Why use the updated YAML spec?

- Performance: YAML-based configurations are processed faster by dbt, leading to improved performance, especially during parsing and compilation.
- Maintainability: Centralizing configuration in YAML makes it easier to manage and update snapshot settings without editing the SQL logic directly.
- Consistency: YAML configuration aligns snapshot definitions with other dbt resources, such as models and seeds, leading to a more consistent project structure.


Note: In versions prior to v1.9, the target_schema (required) and target_database (optional) configurations defined a single schema or database to build a snapshot across users and environment. This created problems when testing or developing a snapshot, as there was no clear separation between development and production environments. In v1.9, target_schema became optional, allowing snapshots to be environment-aware. By default, without target_schema or target_database defined, snapshots now use the generate_schema_name or generate_database_name macros to determine where to build. Developers can still set a custom location with schema and database configs, consistent with other resource types.

### How to migrate

1. Move any configurations currently written within the jinja block (like unique_key, strategy, updated_at, and so on) into the YAML file.
   
   The configurations are structured similarly to how you would define a model in `dbt_project.yml.` 

    Here's an example conversion:

    <File name='snapshots.yml'>
      ```yaml
      snapshots:
        - name: orders_snapshot
          schema: snapshots
          unique_key: id
          strategy: timestamp
          updated_at: updated_at
      ```
      </File>

Note: The `unique_key`, strategy, and `updated_at` fields must match the settings previously defined in your jinja block.

2. Before removing the old jinja block, run the dbt snapshot command using the new YAML configuration to confirm that the snapshot behaves as expected.
	- Verify that the data is processed correctly (for example,no data loss or incorrect records).
	- Make surethe performance is either the same or improved compared to the old configuration.
	- After running the new snapshot, inspect the snapshot tables in your data warehouse to confirm the new snapshot records match the old data. 

3. Once you’ve confirmed that the new YAML configuration works properly, safely remove the old snapshot jinja block from your `.sql` file. This keeps your codebase clean and fully migrated to the new method.

4. If your snapshots require more complex transformations, consider using an ephemeral model to handle the transformations before referencing it in the snapshot. An ephemeral model can encapsulate transformations and simplify the snapshot query itself.

    Example of using an ephemeral model:

    <File name='models/ephemeral/orders_ephemeral.sql'>

    ```sql
    {{
      config(materialized='ephemeral')
    }}
    select * from {{ source('jaffle_shop', 'orders') }}
    ```
    </File>

    Example of the snapshot YAML configuration referencing the ephemeral model:

    <File name='snapshots.yml'>

    ```yaml
    snapshots:
      - name: orders_snapshot
        relation: ref('orders_ephemeral')
        target_schema: snapshots
        unique_key: id
        strategy: timestamp
        updated_at: updated_at
    ```
    </File>
 
### Full migration example
Here’s a complete example of migrating from a legacy jinja block snapshot to a YAML-based snapshot configuration:

#### Legacy method (jinja block)
<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}
{{
    config(
      target_schema='snapshots',
      unique_key='id',
      strategy='timestamp',
      updated_at='updated_at',
    )
}}
select * from {{ source('jaffle_shop', 'orders') }}
{% endsnapshot %}
```
 </File>

#### Recommended method (YAML configuration)

<File name='snapshots.yml'>

```yaml
snapshots:
  - name: orders_snapshot
    schema: snapshots
    unique_key: id
    strategy: timestamp
    updated_at: updated_at
  ```
 </File>

By following these steps, you can smoothly transition from legacy jinja-based snapshots to the modern, more efficient YAML-based configurations.
