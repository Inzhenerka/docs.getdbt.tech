---
title: "Navigate the Query page interface"
description: "Learn how to navigate the Query page interface"
sidebar_label: "Navigation interface"
tags: [Query page]
---

# Navigate the Query page interface <Lifecycle status="beta" />

<IntroText>
Learn how to navigate the Query page interface and use the main components.
</IntroText>

:::tip
Available in private beta. To join, please reach out to your account manager. To provide feedback, use this feedback form…
:::

The Query page provides an interactive interface for writing, running, and analyzing SQL queries. This section highlights the main components of the Query page. 

### Query console
- The Query editor is the main component of the Query page. It allows you to write, run, and analyze SQL queries
- The Query editor supports syntax highlighting, code completion, and linting.
- The Query editor also supports asset linking, which allows you to link to specific tables, columns, and metrics in your project.

<Lightbox src="/img/docs/collaborate/query-page/qp-main.png" title="Query page main interface with blank query editor" />

### Ellipsis (`...`), Save and Run buttons
- Click on the **ellipsis** button to share, develop in the [IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud), edit details, or delete query.
- Use the **Save** button to save frequently used SQL queries that you'll often run.
- Use the **Run** button to run your SQL query and view the results in the **Results** tab

<Lightbox src="/img/docs/collaborate/query-page/qp-ellipsis.jpg" title="Query page ellipsis button" />

### Results, Details, and Chart tabs
These tabs help you analyze query execution and visualize results
- **Results** tab: Displays (or previews) your SQL results in a detailed views. Results are limited to 500 rows, support for more rows coming soon!
- **Details** tab: Generates succinct details of executed SQL query:
  - Query metadata: Title, description, supplied SQL, compiled SQL
  - Connection details: Warehouse, database, schema, role, user
  - Query details: Query duration, status, columns, rows
- **Chart** tab: Visualizes query results with built-in charts. 
  - Use the **Chart settings** to customize the chart type and the columns you want to visualize. 
  - Available chart types are line, bar, and dot.
- **Ellipsis** (`...`) button: Allows you to export the results to CSV

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/collaborate/query-page/qp-results.jpg" width="95%" title="Query page Results tab" />
<Lightbox src="/img/docs/collaborate/query-page/qp-details.jpg" width="95%" title="Query page Details tab" />
<Lightbox src="/img/docs/collaborate/query-page/qp-chart.jpg" width="95%" title="Query page Chart tab" />
</DocCarousel>

### dbt Explorer, bookmark, and Query history icons
- Click on the **dbt Explorer** icon to view your project’s tables, columns, metrics, lineage, and more using the integrated Explorer view.
- Click on the **Bookmark** icon to save your frequently used queries as favorites for easier access.
- Click on the **Query history** icon to view past queries, their statuses (like Success, Error, Pending), start time, and duration. Search for past queries and filter by status. You can also re-run a query from the Query history.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/collaborate/query-page/qp-explorer.png" width="90%" title="Query page dbt Explorer icon" />
<Lightbox src="/img/docs/collaborate/query-page/qp-query-history.png" width="90%" title="Query page Query history icon" />
</DocCarousel>
