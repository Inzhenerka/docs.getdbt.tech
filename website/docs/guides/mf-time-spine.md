---
title: "Quickstart with MetricFlow time spine"
id: "mf-time-spine"
level: 'Intermediate'
icon: 'guides'
tags: ['Quickstart']
hide_table_of_contents: true
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

This guide explains how to configure a time spine using the [dbt Semantic Layer Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) as a reference. 

### What is a time spine table?

A [time spine](/docs/build/metricflow-time-spine) is essential for time-based joins and aggregations in MetricFlow, the engine that powers the dbt Semantic Layer.

To use MetricFlow with time-based metrics and dimensions, you must provide a time spine table. This table serves as the foundation for time-based joins and aggregations. You can either:

- Create a time spine SQL table from scratch, or
- Use an existing table in your project, like a `dim_date` table

And once you have a time spine table, you need to configure it in YAML to tell MetricFlow how to use it. This guide will show you how to do both!

### Prerequisites
Before you start, make sure you have:

- A dbt project set up. If you don't have one, follow the [Semantic Layer quickstart guide](/guides/sl-snowflake-qs?step=1) or the [dbt Cloud quickstart guides)(/guides?tags=Quickstart) guide to help you get started.

## Add a time spine SQL model

Let's get started by assuming you're creating a time spine table from scratch. If you have a dbt project set up already and have your own time spine table (like a `dim_date` type model), you can skip this step and go to [Use an existing dim_date table](https://docs.getdbt.com//guides/mf-time-spine#using-an-existing-dim-date-table).

The time spine table is a dbt model that generates a series of dates (or timestamps) at a specific granularity. In this example, let's create a daily time spine table &mdash; `time_spine_daily.sql`. 

1. Navigate to the `models/marts` directory in your dbt project.
2. Add a new SQL file named `time_spine_daily.sql` with the following content:

<File name='models/marts/time_spine_daily.sql'>

```sql
{{
    config(
        materialized = 'table',
    )
}}

with

base_dates as (
    {{
        dbt.date_spine(
            'day',
            "DATE('2000-01-01')",
            "DATE('2030-01-01')"
        )
    }}
),

final as (
    select
        cast(date_day as date) as date_day
    from base_dates
)

select *
from final
where date_day > dateadd(year, -5, current_date())  -- Keep recent dates only
  and date_day < dateadd(day, 30, current_date());
```
</File>

This generates a table of daily dates ranging from 5 years in the past to 30 days into the future.


## Add YAML configuration for the time spine

Now that you've created the SQL file, configure it in YAML so MetricFlow can recognize and use it.

1. Navigate to the `models/marts` directory.
2. Add a new YAML file named `_models.yml` with the following content:

<File name='models/marts/_models.yml'>

```yaml
models:
  - name: time_spine_daily
    description: A time spine with one row per day, ranging from 5 years in the past to 30 days into the future.
    time_spine:
      standard_granularity_column: date_day  # The base column used for time joins
    columns:
      - name: date_day
        description: The base date column for daily granularity
        granularity: day
```
</File>

This time spine YAML file:
- Defines `date_day` as the base column for daily granularity.
- Configures `time_spine` properties so MetricFlow can use the table

### Using an existing dim_date table

This optional approach reuses an existing table, saving you the effort of creating a new one. However if you created a time spine table from scratch, you can skip this section. 

If your project already includes a `dim_date` or similar table, you can configure it as a time spine:

1. Locate the existing table (`dim_date`).
2. Update `_models.yml` file to configure it as a time spine:

<File name='_models.yml'>

```yaml
models:
  - name: dim_date
    description: An existing date dimension table used as a time spine.
    time_spine:
      standard_granularity_column: date_day
    columns:
      - name: date_day
        granularity: day
```
</File>

This time spine YAML file configures the `time_spine` property so MetricFlow can use the table.

## Run and test the time spine

For the time spine table you created, let's run it and validate the output.

1. Run the following command:
   ```bash
   dbt run --select time_spine_daily
   ```

2. Check that the table:
   - Contains one row per day.
   - Covers the date range you want (5 years back to 30 days forward)

3. (Optional) If you have [metrics](/docs/build/metrics-overview) already defined in your project, you can query the table/metrics using [Semantic Layer commands](/docs/build/metricflow-commands) to validate the time spine. 
   
   Let's say you have a `revenue` metric defined. You can query the table/metrics using the following command:

    ```bash
    dbt sl query --metrics revenue --group-by metric_time
    ```

    This will output results similar to the following in the dbt Cloud IDE:
    <Lightbox src="/img/quickstarts/dbt-cloud/validate-mf-timespine-output.jpg" title="Validate the metrics and time spine output in dbt Cloud IDE" />

4. Double check that the results are correct and returning the expected data.

## Add additional granularities (optional)

To support multiple granularities (like hourly, yearly, monthly), create additional time spine tables and configure them in YAML.

1. Add a new SQL file named `time_spine_yearly.sql` with the following content:
<File name='models/marts/time_spine_yearly.sql'>

```sql
{{
    config(
        materialized = 'table',
    )
}}

with years as (

    {{
        dbt.date_spine(
            'year',
            "to_date('01/01/2000','mm/dd/yyyy')",
            "to_date('01/01/2025','mm/dd/yyyy')"
        )
    }}

),

final as (
    select cast(date_year as date) as date_year
    from years
)

select * from final
-- filter the time spine to a specific range
where date_year >= date_trunc('year', dateadd(year, -4, current_timestamp())) 
  and date_year < date_trunc('year', dateadd(year, 1, current_timestamp()))


```
</File>

2. Then update `_models.yml` file and add the yearly time spine (below the daily time spine config):

<File name='_models.yml'>

```yaml
models:
  - name: time_spine_daily
    ... rest of the daily time spine config ...

- name: time_spine_yearly
    description: time spine one row per house
    time_spine:
      standard_granularity_column: date_year
    columns:
      - name: date_year
        granularity: year
```
</File>

3. Run or preview the model to create the table:
   ```bash
   dbt run --select time_spine_yearly
   dbt show --select time_spine_yearly
   ```

4. Validate the output by querying the generated table:
   ```bash
   dbt sl query --metrics orders --group-by metric_time__year
   ```

:::tip
Try creating a monthly time spine! Duplicate your daily time spine model, adjust it to generate one row per month, and update the YAML file to include `granularity: month`. Give it a try!
:::

## What's next

<ConfettiTrigger>

Congratulations 🎉! You've set up a time spine and are ready to bring the benefits of MetricFlow and the dbt Semantic Layer to your organization. You've learned:

- How to create a time spine table or use an existing table.
- How to configure a time spine in YAML.
- How to add additional granularities to your time spine.

Here are some additional resources to help you continue your journey:

- [MetricFlow time spine](/docs/build/metricflow-time-spine)
- [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl)
- [Build metrics](/docs/build/metrics-overview)
- [Quickstart with dbt Semantic Layer](/guides/sl-snowflake-qs?step=1)

</ConfettiTrigger>

</div>
