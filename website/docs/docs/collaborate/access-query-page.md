---
title: "Access the Query page"
description: "Learn how to access the Query page and run queries"
sidebar_label: "Access and run queries"
tags: [Query page]
---

# Access the Query page interface <Lifecycle status="beta,enterprise,team" />

<IntroText>
Learn how to access the Query page, run queries, and view results.
</IntroText>

:::tip
Query page is available in private beta. To join, please reach out to your account manager. 
:::

The Query page provides a rich console experience with editor navigation. You can expect the Query page to:
- Enable you to write SQL queries, with the option to open multiple tabs 
- Have SQL + dbt autocomplete suggestions and syntax highlighting
- Bookmark SQL queries
- View the results of the query and its details using the **Results** or **Details** tabs
- Create a visualization of your query results using the **Chart** tab
- View the history of queries and their statuses (like Success, Error, Pending) using the **Query history** icon
- Integrate with [dbt Copilot](/docs/cloud/dbt-copilot), [dbt Explorer](/docs/collaborate/explore-projects), [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud), and [Visual Editor](/docs/cloud/visual-editor) to provide a seamless experience for data exploration, AI-assisted writing, and collaboration.

## Access the Query page

Before accessing the Query page, ensure that the [prerequisites](/docs/collaborate/query-page#prerequisites) are met.

1. To access the Query page, select the **Query** option in the navigation sidebar.
2. If your [developer credentials](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#get-started-with-the-cloud-ide) aren’t set up, the Query page will prompt you to set them up. 
3. Once your credentials are set up, you can write, run, and edit SQL queries in the Query page editor for existing models in your project.

## Run queries

To run queries in the Query page, you can use:
- Standard SQL  
- Jinja (`ref`, `source`, `is_incremental`)  
- Links from SQL code `ref` to the corresponding Explorer page
- CTEs and subqueries  
- Basic aggregations and joins 
- Semantic Layer queries using Semantic Layer jinja functions

## Example

Let's use an example to illustrate how to run queries in the Query page:

- A Jaffle shop wants to count unique orders and unique customers to understand whether they can expand their awesome Jaffle shop business to other parts of the world.
- To express this logic in SQL, the analyst assigned to this project will write a SQL query to calculate the number of unique orders and customers. For example: <br /><br />
    ```sql
    with 

    orders as (
        select * from {{ ref('orders') }}
    ),

    customers as (
        select * from {{ ref('customers') }}
    )

    select 
        date_trunc('year', ordered_at) as order_year,
        count(distinct orders.customer_id) as unique_customers,
        count(distinct orders.location_id) as unique_cities,
        to_char(sum(orders.order_total), '999,999,999.00') as total_order_revenue
    from orders
    join customers
        on orders.customer_id = customers.customer_id
    group by 1
    order by 1
    ```

An analyst can now run the query by clicking the **Run** button and:
- Explore and [view the results](#view-results) in the **Results** tab.
- [View the details](#view-details) of the query in the **Details** tab.
- [View the chart results](#chart-results) of the query results in the **Chart** tab.
- [View the history](#query-history) of queries and their statuses (like Success, Error, Pending) using the **Query history** icon.
- [Use dbt Explorer](#use-dbt-explorer) to view the lineage and resources of the query.
- Likewise to promote the query to a model, they can click [**Develop in the IDE**](/docs/collaborate/navigate-query-page) on the top right of the Query page to create a new model using the dbt Cloud IDE or in the [Visual Editor](/docs/cloud/visual-editor).

### View results

Using the same example, an analyst can perform some exploratory data analysis by running the query and:

- Viewing results in **Results** tab: View the paginated results of the query.
- Sorting results: Click on the column header to sort the results by that column.
- Export to CSV: On the top right of the table, click the the three ellipsis (`...`) button and select **Export to CSV** to export the dataset.
<Lightbox src="/img/docs/query-page/qp-export-csv.jpg" width="95%" title="Query page Export to CSV" />

### View details
To view the details of the query, click on the **Details** tab to see:
- Query metadata &mdash; dbt Copilot AI-generated title and description. Along with the supplied SQL and compiled SQL.
- Connection details &mdash; Relevant data platform connection information.
- Query details &mdash; Query duration, status, column count, row count.

<Lightbox src="/img/docs/query-page/qp-details.jpg" width="95%" title="Query page Details tab" />

### Chart results

The Query page also supports charting results. An analyst can:
- Select the chart type and columns to visualize.
- Choose from **line chart, bar chart, or scatterplot**.

<Lightbox src="/img/docs/query-page/qp-chart.jpg" width="95%" title="Query page Chart tab" />

## Query history

The Query page also supports query history, which allows you to view the history of queries and their statuses (like Success, Error, Pending). You can also select a query to re-run to view the results. 

The query history is stored indefinitely.

<Lightbox src="/img/docs/query-page/qp-query-history.png" width="95%" title="Query page Query history icon" />

<!-- add copilot section here if available 

## Query with dbt Copilot

dbt Cloud Copilot is a feature that allows you to query your data with natural language. It is available in the Query page....
-->

### Use dbt Explorer

View dbt Explorer directly in the Query page to access your project lineage and project resources with access to tables, columns, metrics, and dimensions, and more — all integrated in the Query page interface. 

This integrated view allows you to maintain your query workflow, while getting more context on models, semantic models, metrics, macros, and more. The integrated Explorer view provides you with:
- Same search capabilities as Explorer
- Allows you to narrow down displayed objects by type
- Hyperlink from SQL code `ref` to the corresponding Explorer page

To access dbt Explorer, click on the **Explorer** icon on the top right of the Query page.

<Lightbox src="/img/docs/query-page/qp-explorer.png" width="90%" title="Query page integrated with dbt Explorer" />
 

## Considerations 
- You can save and bookmark frequently used queries for yourself. Sharing those queries with others will be available soon.
- The query page uses your development credentials to query. You have the ability to query against any object in any environment.
- Every jinja function uses [`defer --favor-state`](/reference/node-selection/defer) to resolve Jinja.
- Coming soon: The ability to select the environment you use to resolve your `refs`.

<!-- this can move to another page -->

## FAQs
- What’s the difference between Query page and dbt Explorer?
  - That’s a great question! Explorer helps you understand your dbt project's structure, resources, lineage, and metrics, offering context for your data.
  - The Query page builds on that context, allowing you to write, run, and iterate on SQL queries directly in dbt Cloud. It’s designed for ad-hoc or exploratory analysis and empowers business users and analysts to explore data, ask questions, and collaborate seamlessly.
  - Explorer provides the context, while Query page enables action.
