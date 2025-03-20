---
title: "Access the Query page"
description: "Learn how to access the Query page and run queries"
sidebar_label: "Access and run queries"
tags: [Query page]
---

# Access the Query page interface <Lifecycle status="beta" />

<IntroText>
Learn how to access the Query page, run queries, and view results.
</IntroText>

:::tip
Available in private beta. To join, please reach out to your account manager. To provide feedback, use this feedback form…
:::

The Query page provides a rich console experience with editor navigation. You can expect the Query page to:
- Have an editor to enable you to write SQL queries, with the option to open multiple tabs 
- View highlighted keywords and parentheses, along with basic code coloring to help with readability 
- Save or run the SQL queries you prefer
- View the results of the query and its details using the **Results** or **Details** tabs
- View the chart of the query results using the **Chart** tab
- View the history of queries and their statuses (like Success, Error, Pending) using the **Query history** icon
- Integrate with dbt Explorer, dbt Cloud IDE, and Visual Editor to provide a seamless experience for your data exploration and collaboration.

## Access the Query page

1. To access the Query page, select the **Query** option in the navigation sidebar.
2. If your [developer credentials](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#get-started-with-the-cloud-ide) aren’t set up, the Query page will prompt you to set them up. 
3. Once your credentials are set up, you can write, run, and edit SQL queries in the Query page editor for existing models in your project.

## Run queries

To run queries in the Query page, you can use:
- Standard SQL  
- Jinja (`ref`, `source`, `is_incremental`)  
- CTEs and subqueries  
- Basic aggregations and joins 

Limitations?

### Example

Let's use an example to illustrate how to run queries in the Query page:

- A Jaffle shop wants to count unique orders and unique customers to understand whether they can expand their Jaffle shop business to other parts of the world.
- To express this logic in SQL, the analyst assigned to this project will:
  - Write a SQL query to calculate the number of unique orders and customers. For example: <br />
    ```sql
    select 
        date_trunc('year', ordered_at) as order_year,
        count(distinct o.customer_id) as unique_customers,
        count(distinct o.order_id) as unique_orders
    from {{ ref('orders') }} o
    join {{ ref('customers') }} c
        on o.customer_id = c.customer_id
    group by 1
    order by 1
    ```

The analyst can now run the query by clicking the **Run** button and:
- Explore and [view the results](#view-results) in the **Results** tab.
- [View the details](#view-details) of the query in the **Details** tab.
- [View the chart results](#chart-results) of the query results in the **Chart** tab.
- [View the history](#query-history) of queries and their statuses (like Success, Error, Pending) using the **Query history** icon.
- [Use dbt Explorer](#use-dbt-explorer) to view the lineage and resources of the query.
- Likewise if they want to promote the query to a model, they [click **Develop in the IDE**](/docs/collaborate/navigate-query-page) on the top right of the Query page to create a new model using the dbt Cloud IDE.

### View results

Using the same example, the analyst can perform some exploratory data analysis by running the query and:

- View results: See up to **500 rows** in a table format.
- Export results: On the top right of the table, click the the three ellipsis (`...`) button and select **Export to CSV** to export the dataset.
  - Note? Any notes here? 
<Lightbox src="/img/docs/collaborate/query-page/qp-results.jpg" width="95%" title="Query page Results tab" />

### View details
To view the details of the query, click on the **Details** tab to see:
- Query metadata: Title, description, supplied SQL, compiled SQL
- Connection details: Warehouse, database, schema, role, user
- Query details: Query duration, status, columns, rows

<Lightbox src="/img/docs/collaborate/query-page/qp-details.jpg" width="95%" title="Query page Details tab" />

### Chart results

The Query page also supports charting results. An analyst can:
- Select the chart type and columns to visualize.
- Choose from **line, bar, or dot charts**.
- Charts work best with numerical or categorical data.

<Lightbox src="/img/docs/collaborate/query-page/qp-chart.jpg" width="95%" title="Query page Chart tab" />

### Query history

The Query page also supports query history. The analyst can view the history of queries and their statuses (like Success, Error, Pending), and select a query to re-run and view the results.

| Feature           | Availability |
|------------------|--------------|
| View or search for past queries | ✅ Yes |
| Filter by status  | ✅ Yes (Success, Error, Pending) |
| Export query history | ❌ No |

How long is history stored?

<Lightbox src="/img/docs/collaborate/query-page/qp-query-history.png" width="95%" title="Query page Query history icon" />

<!-- add copilot section here if available 

## Query with dbt Copilot

dbt Cloud Copilot is a feature that allows you to query your data with natural language. It is available in the Query page....
-->

## Use dbt Explorer

View dbt Explorer directly in the Query page to access your project lineage and project resources with access to tables, columns, metrics, and dimensions, and more — all integrated in the Query page interface. 

This integrated view allows you to maintain your query workflow, while getting more context on models, semantic models, metrics, macros, and more. The integrated Explorer view provides you with:
- Same search capabilities as Explorer
- Allows you to narrow down displayed objects by type

To access dbt Explorer, click on the **Explorer** icon on the top right of the Query page.

<Lightbox src="/img/docs/collaborate/query-page/qp-explorer.png" width="90%" title="Query page integrated with dbt Explorer" />
 
Questions:
- Do we need a job run? 
- Are the following available in the private beta?
  - Automatic highlighting: Selecting an object in the console shows what?

## Considerations 
- Currently, there’s a limit of 500 returned queries (how to bypass or not possible?). Support for more rows coming soon! 
- Although not currently supported, you will have the ability to save, organize, and share frequently used queries – allowing you to promote consistent use across teams without leaving the Query page.
- Query page is available in development environment only, with support for multiple environments coming soon! 
- Any access considerations?
- Export to CSV limitations or control?

<!-- this can move to another page -->

## FAQs
- What’s the difference between Query page and dbt Explorer?
	- That’s a great question! Explorer helps you understand your dbt project's structure, resources, lineage, and metrics, offering context for your data
	The Query page builds on that context, allowing you to write, run, and iterate on SQL queries directly in dbt Cloud. It’s designed for ad-hoc or exploratory analysis and empowers business users and analysts to explore data, ask questions, and collaborate seamlessly.
	Explorer provides the context, while Query page enables action.

- What happens if I exceed the 500-row limit?
- I can’t view my lineage or resources in the integrated dbt Explorer view?
