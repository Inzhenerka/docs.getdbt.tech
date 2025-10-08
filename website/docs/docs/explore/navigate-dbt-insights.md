---
title: "Navigate the dbt Insights interface"
description: "Learn how to navigate the dbt Insights interface"
sidebar_label: "Navigate the interface"
tags: [dbt Insights]
image: /img/docs/dbt-insights/insights-results.jpg
---

# Navigate the dbt Insights interface <Lifecycle status="preview,managed,managed_plus" />

<IntroText>
Learn how to navigate <Constant name="query_page" /> interface and use the main components.
</IntroText>

<Constant name="query_page" /> provides an interactive interface for writing, running, and analyzing SQL queries. This section highlights the main components of <Constant name="query_page" />. 

## Query console
The query console is the main component of <Constant name="query_page" />. It allows you to write, run, and analyze SQL queries. The Query console supports:
1. Query console editor, which allows you to write, run, and analyze SQL queries:
  - It supports syntax highlighting and autocomplete suggestions 
  - Hyperlink from SQL code `ref` to the corresponding Explorer page
2. [Query console menu](#query-console-menu), which contains **Bookmark (icon)**, **Develop**, and **Run** buttons. 
3. [Query output panel](#query-output-panel), below the query editor and displays the results of a query:
  - Has three tabs: **Data**, **Chart**, and **Details**, which allow you to analyze query execution and visualize results.
4. [Query console sidebar menu](#query-console-sidebar-menu), which contains the **<Constant name="explorer" />**, **Bookmark**, **Query history**, and **<Constant name="copilot" />** icons.

<Lightbox src="/img/docs/dbt-insights/insights-main.png" title="dbt Insights main interface with blank query editor" />

### Query console menu
The Query console menu is located at the top right of the Query editor. It contains the **Bookmark**, **Develop**, and **Run** buttons:

- **Bookmark** button &mdash; Save your frequently used SQL queries as favorites for easier access.
  - When you click **Bookmark**, a **Bookmark Query Details** modal (pop up box) will appear where you can add a **Title** and **Description**.
  - Let [<Constant name="copilot" />](/docs/cloud/dbt-copilot) do the writing for you &mdash; use the AI assistant to automatically generate a helpful description for your bookmark.
  - Access the newly created bookmark from the **Bookmark** icon in the [Query console sidebar menu](#query-console-sidebar-menu). 
 - **Develop**: Open the [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [<Constant name="visual_editor" />](/docs/cloud/canvas) to continue editing your SQL query.
- **Run** button &mdash; Run your SQL query and view the results in the **Data** tab.

## Query output panel

The Query output panel is below the query editor and displays the results of a query. It displays the following tabs to analyze query execution and visualize results:
- **Data** tab &mdash; Preview your SQL results, with results paginated.
- **Details** tab &mdash; Generates succinct details of executed SQL query:
  - Query metadata &mdash; <Constant name="copilot" />'s AI-generated title and description. Along with the supplied SQL and compiled SQL.
  - Connection details &mdash; Relevant data platform connection information.
  - Query details &mdash; Query duration, status, column count, row count.
- **Chart** tab &mdash; Visualizes query results with built-in charts. 
  - Use the chart icon to select the type of chart you want to visualize your results. Available chart types are **line chart, bar chart, or scatterplot**.
  - Use the **Chart settings** to customize the chart type and the columns you want to visualize. 
  - Available chart types are **line chart, bar chart, or scatterplot**.
- **Download**  button &mdash; Allows you to export the results to CSV

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/dbt-insights/insights-chart-tab.png" width="95%" title="dbt Insights Data tab" />
<Lightbox src="/img/docs/dbt-insights/insights-chart.png" width="95%" title="dbt Insights Chart tab" />
<Lightbox src="/img/docs/dbt-insights/insights-details.png" width="95%" title="dbt Insights Details tab" />
</DocCarousel>

## Query console sidebar menu
The Query console sidebar menu and icons contains the following options:

### dbt Catalog

**<Constant name="explorer" /> icon** &mdash; View your project's models, columns, metrics, and more using the integrated <Constant name="explorer" /> view.

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="dbt Insights dbt Catalog icon" />

### Bookmark 

Save and access your frequently used queries. 

<Lightbox src="/img/docs/dbt-insights/manage-bookmarks.png" width="90%" title="Manage your query bookmarks" /> 

### Query history

View past queries, their statuses (All, Success, Error, or Pending), start time, and duration. Search for past queries and filter by status. You can also re-run a query from the Query history.

<Lightbox src="/img/docs/dbt-insights/insights-query-history.png" width="90%" title="dbt Insights Query history icon" />

### dbt Copilot

Use [dbt <Constant name="copilot" />'s AI assistant](/docs/cloud/dbt-copilot) to modify or generate queries using natural language prompts or to chat with the <Constant name="copilot" /> agent to gather insights about your data. There are two ways you can use dbt <Constant name="copilot" /> in <Constant name="explorer" /> to interact with your data:

<Lightbox src="/img/docs/dbt-insights/insights-copilot-tabs.png" width="90%" title="dbt Copilot in Insights" />

- **Agent** tab<Lifecycle status='private_beta' /> - Ask questions to the dbt <Constant name="copilot" /> agent to get intelligent data analysis with automated workflows, governed insights, and actionable recommendations. This is a conversational AI feature where you can ask natural language prompts and receive analysis in real-time. Some sample questions: 

  - _What region are my sales growing the fastest?_ 
  - _What was the revenue last month?_
  - _How should I optimize my marketing spend next quarter?_
  - _How many customers do I have, broken down by customer type?_

  The dbt <Constant name="copilot" /> agent creates an analysis plan based on your question. The agent:

  1. Gets context using your semantic models and metrics. 
  2. Generates SQL queries using your project's definitions.  
  3. Executes the SQL query and returns results with context.
  3. Creates visualizations by generating Insights-compatible charts for visual consumption⁠.
  4. Reviews and summarizes the generated insights and provides a comprehensive answer.

  The <Constant name="copilot" /> agent can loop through these steps multiple times if it hasn't reached a complete answer, allowing for complex, multi-step analysis.⁠

  For more information, see [Analyze data with the dbt <Constant name="copilot" /> agent](/docs/cloud/use-dbt-copilot#analyze-data-with-the-copilot-agent).

- **Generate SQL** tab - Build queries in <Constant name="query_page" /> with natural language prompts to explore and query data with an intuitive, context-rich interface. For more information, see [Build queries](/docs/cloud/use-dbt-copilot#build-queries).

