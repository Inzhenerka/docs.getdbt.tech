---
title: "Databricks adapter behavior changes"
id: "databricks-changes"
sidebar: "Databricks"
---

The following are the current [behavior change flags](/docs/reference/global-configs/behavior-changes.md#behavior-change-flags) that are specific to `dbt-databricks`:

| Flag                          | `dbt-databricks`: Intro | `dbt-databricks`: Maturity |
| ----------------------------- | ----------------------- | -------------------------- |
| [`use_info_schema_for_columns`](#use-information-schema-for-columns) | 1.9.0                   | TBD                        |
| [`use_user_folder_for_python`](#use-users-folder-for-python-model-notebooks)  | 1.9.0                   | TBD                        |
| [`use_materialization_v2`](#use-restructured-materializations)      | 1.10.0                  | TBD                        |

## Use information schema for columns

The `use_info_schema_for_columns` flag is `False` by default.

Setting this flag to `True` will use `information_schema` rather than `describe extended` to get column metadata for Unity Catalog tables. This setting helps you avoid issues where `describe extended` truncates information when the type is a complex struct. However, this setting is not yet the default behavior, as there are performance impacts due to a Databricks metadata limitation because of the need to run `REPAIR TABLE {{relation}} SYNC METADATA` before querying to ensure the `information_schema` is complete. 
Please note that there is no equivalent option for views at this time which means dbt will still need to use `describe extended` for views.

This flag may come default behavior in the future, depending on how information_schema changes.

:::tip Do I need this flag?

If your complex type comes from processing JSON using `from_json`, you have an alternative: use [`parse_json` to create the column as the `variant` type](https://docs.databricks.com/aws/en/sql/language-manual/functions/parse_json).
Depending on how you intend to query or further process the data, the `variant` type might be a reasonable alternative in terms of performance, while not suffering from the issue of type truncation in metadata queries.

:::

## Use user's folder for Python model notebooks

The `use_user_folder_for_python` flag is `False` by default and results in writing uploaded python model notebooks to `/Shared/dbt_python_models/{{schema}}/`. Setting this flag to `True` will write notebooks to `/Users/{{current user}}/{{catalog}}/{{schema}}/` Writing to the `Shared` folder is deprecated by Databricks as it does not align with governance best practices.

We plan to switch the default of this flag to `True` in v1.11.0.

## Use restructured materializations

The `use_materialization_v2` flag is `False` by default and guards significant rewrites of the core materializations in `dbt-databricks` while they are still in an experimental stage.

When set to `True`, `dbt-databricks ` uses the updated logic for all model types (views, tables, incremental, seeds) and optionally enables additional config options for more fine-tuned control.

We plan to switch the default of this flag to `True` in 1.11.0, depending on user feedback.

### Changes to the Seed materialization

The seeds materialization should have the smallest difference between the old and new materialization, as the primary difference is just removing calls to methods that are not supported by Databricks, such as transaction operations.

### Changes to the View materialization

In conjunction with the flag above, there are two model configuration options that can customize how we handle the view materialization when we detect an existing relation at the target location.

* `view_update_via_alter`

When enabled, this config attempts to update the view in place using alter view, instead of using create or replace to replace it. 
This allows continuity of history for the view, keeps the metadata, and helps with Unity Catalog compatibility.

<File name="schema.yml">

```yaml
version: 2
 
models:
  - name: market_summary
    config:
      materialized: view
      view_update_via_alter: true
    
    columns:
      - name: country
        tests:
          - unique
          - not_null
...
```

</File>

:::caution There is currently no support for altering the comment on a view via Databricks SQL.

As such, we must replace the view whenever you change its description

:::

* `use_safer_relation_operations`

When enabled (and if view_update_via_alter isn't set), this config makes dbt model updates more safe by creating a new relation in a staging location, swapping it with the existing relation, and deleting the old relation afterward.

<File name="schema.yml">

```yaml
version: 2
 
models:
  - name: market_summary
    config:
      materialized: view
      use_safer_relation_operations: true
    
    columns:
      - name: country
        tests:
          - unique
          - not_null
...
```

</File>

:::caution This configuration option may increase costs and disrupt Unity Catalog history.

While this approach is equivalent to the default dbt view materialization, it will create additional UC objects, as compared to alternatives.
Since this config does not use atomic 'create or replace...' for any materialization, the history of the object in Unity Catalog may not behave as you expect.
Consider carefully before using this model config broadly.

:::

### Changes to the Table materialization

:::caution This flag may increase storage costs for tables.

As with views, these materialization changes could increase costs.
More temporary objects are used, consistent with other dbt adapters' materializations.
We consider these changes experimental in part because we do not have enough data quantifying the price impact of this change.
The benefits though are improvements in performance, safety, and unblocking features that cannot be delivered with the existing materialization.

:::

When `use_materialization_v2` flag is set to `True`, all paths through the materialization are changed.
The difference that is core to all paths is that we separate table creation from inserting rows into the table.
This change allows us to significantly improve performance when persisting documentation on the table, as setting comments at create time is much more performant than the alternative (setting the comment on each column as a separate `alter table...` operation), but is not allowed in Databricks when we create and insert data into a table in the same statement.
Another benefit of this approach is that several other column features, such as column-level masks, are also incompatible with inserting data as part of create.
While these features are not a part of the 1.10.0 release, they can now be supported in future releases.

#### Constraints

For several feature releases now, dbt-databricks supported both the dbt implementation of constraints and an alternative called `persist_constraints`, that we had implemented prior.
With the `use_materialization_v2` flag, we begin the deprecation of this alternative implementation, and expand our support for the core dbt implementation.
We now support the expression field for primary and foreign keys as a way to supply additional Databricks options, such as using [`RELY` to tell the Databricks optimizer that it may exploit the constraint to rewrite queries](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-table-constraint).

Another change to how constraints work in practice is due to separating out `create` and `insert`.
Previously, we would create a table with data and then attempt to apply the constraints.
This could mean replacing an existing consistent table (created on an earlier dbt run) with one that has data that violates a constraint.
The run would still fail, but only after we had gotten rid of the table that was valid as of the previous run.
As with views, you can select between performance and safety with the `use_safer_relation_operations` flag, but regardless of setting, the new materialization approach does not allow constraint violations into the target table.

#### `use_safer_relation_operations`

When using this model configuration with tables, we create a staging table and once we have successfully inserted the data into the table, we replace the target materialization with renaming.
As Databricks does not yet have transactions supporting rollback, this is much safer in the sense that if we fail at any point prior to renaming, the previously valid table remains in place.
This could mean that you have time to investigate failures without worrying that exposures or work streams that rely on that table are broken in the mean time.
When this configuration is set to false (the default), the target table will still never have constraint-violating data; instead, it could end up with no data, as we could fail data insert due to the constraint.
The primary difference comes down to whether we directly replace the target as opposed to first staging and then renaming.

:::caution This configuration option may increase costs and disrupt Unity Catalog history.

As with views, there is a cost to using additional temporary objects, in the form of creating more UC objects with their own history.
Consider carefully whether you need this behavior.

:::

### Changes to the Incremental materialization

All of the changes described for the Table materialization also apply to Incremental materialization.
In addition, we added a model config to specify whether we should apply detected config changes on incremental runs: `incremental_apply_config_changes`.
Many users have asked for the capability to configure table metadata in Databricks, such as accepting AI-generated comments, and not have dbt overwrite that.
Previously, dbt-databricks assumed that detected config changes to tags, tblproperties, and comments should be applied on incremental runs.
Under the V2 materialization, you have the option of setting `incremental_apply_config_changes` to `False` to turn off this behavior (it defaults to `True` for continuity with past behavior).

<File name="schema.yml">

```yaml
version: 2
 
models:
  - name: incremental_market_updates
    config:
      materialized: incremental
      incremental_apply_config_changes: false
...
```

</File>