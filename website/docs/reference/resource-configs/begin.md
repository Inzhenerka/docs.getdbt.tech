---
title: "begin"
id: "begin"
sidebar_label: "begin"
resource_types: [models]
description: "dbt uses `begin` to determine when a microbatch incremental model should begin from. When defined on a micorbatch incremental model, `begin` is used as the lower time bound when the model is built for the first time or fully refreshed."
datatype: string
---

<VersionCallout version="1.9" />

## Definition

Set the `begin` config to the timestamp value at which your [microbatch incremental model](/docs/build/incremental-microbatch) data should begin &mdash; at the point the data becomes relevant for the microbatch model.  You can configure `begin` for a [model](/docs/build/models) in your `dbt_project.yml` file, property YAML file, or config block. The value for `begin` must be a string representing an ISO-formatted date _or_ date and time.

## Examples

The following examples set `2024-01-01 00:00:00` as the `begin` config for the `user_sessions` model.

:::tip Did you know? 

If you'd like to configure `begin` to use relative dates, you can use [`modules.datetime`](/reference/dbt-jinja-functions/modules#datetime) and [`modules.pytz`](/reference/dbt-jinja-functions/modules#pytz) to dynamically specify relative timestamps, such as yesterday's date or the start of the current week.

For example, to set `begin` to yesterday's date...

```sql
-- confirming with Grace/core team
{{
    config(
        materialized = 'incremental',
        incremental_strategy='microbatch',
        unique_key = 'run_id',
        begin=(modules.datetime.datetime.utcnow() - modules.datetime.timedelta(days=1)).isoformat(),
        event_time='created_at',
        batch_size='day',
        snowflake_warehouse = set_warehouse_config('large')
    )
}}
```
:::

Example in the `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    user_sessions:
      +begin: "2024-01-01 00:00:00"
```
</File>

Example in a properties YAML file:

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      begin: "2024-01-01 00:00:00"
```

</File>

Example in sql model config block:

<File name="models/user_sessions.sql">

```sql
{{ config(
    begin='2024-01-01 00:00:00'
) }}
```

</File> 
