---
title: "About cost management in dbt Cloud"
description: "Manage your data warehouse costs in dbt Cloud"
sidebar_label: About cost management
---

:::note beta documentation

This documentation is for a beta feature. The title, sections, and content within this doc may change frequently during the beta period. The final product may be split into multiple pages, and existing sections may be renamed. This page is intended for beta users only. Please do not share outside of your organization. 

Cost management tools are currently only available for Snowflake.

:::

The cost management dashboard in dbt Cloud give you valuable insight into how your dbt projects impact your data warehouse costs. They will help you optimize your warehouse spending by visualizing how features, including models, tests, snapshots, and other resources, influence costs over time so that you can take action, report to stakeholders, and optimize development workflows.

Currently, only Snowflake is supported. 

This document will cover setup in Snowflake, dbt Cloud, and how to use the cost management dashboard to view your insights.  

## Prerequisites

To configure the cost management tools, you must have the following:

- Proper [permission set](/docs/cloud/manage-access/enterprise-permissions) to configure connections in dbt Cloud. 
- Proper [privileges](https://docs.snowflake.com/en/user-guide/security-access-control-privileges) in Snowflake to create a user and assign them database access.
- The `Admin` or `Cost Management Viewer` permission set assigned in dbt Cloud to view and interact with the cost management dashboard.

## Set up in Snowflake

You must configure metadata credentials for each unique Snowflake account you want the cost management tool to monitor. To configure the proper access in Snowflake: 

1. Identify an existing or new (recommended) service user in your Snowflake account. We recommend configuring a new user for this service, for example, `dbt_cost_management`, for more flexible customization.
2. Grant the user `read` permissions to the [`ORGANIZATION_USAGE`](https://docs.snowflake.com/en/sql-reference/organization-usage) and [`ACCOUNT_USAGE`](https://docs.snowflake.com/en/sql-reference/account-usage) schemas. 
    - (Optional) You can scope this down to the specific tables in the warehouse if preferred using a [Snowflake database role](https://docs.snowflake.com/en/sql-reference/account-usage#enabling-other-roles-to-use-schemas-in-the-snowflake-database) assigned the following access:
        - `ACCOUNT_USAGE.QUERY_HISTORY`
        - `ACCOUNT_USAGE.QUERY_ATTRIBUTION_HISTORY`
        - `ACCOUNT_USAGE.ACCESS_HISTORY`
        - `ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY`
        - `ORGANIZATION_USAGE.USAGE_IN_CURRENCY_DAILY`


To create a user `dbt_cost_user` and a role `dbt_cost_management` and assign it the required permissions over specific tables, you'd execute something that looks like the following example:

```sql

CREATE USER dbt_cost_user
  PASSWORD = 'A_SECURE_PASSWORD'
  DEFAULT_ROLE = dbt_cost_management
  MUST_CHANGE_PASSWORD = FALSE;

CREATE ROLE dbt_cost_management;

GRANT ROLE dbt_cost_management TO USER dbt_cost_user;

GRANT USAGE ON DATABASE SNOWFLAKE TO ROLE dbt_cost_management;
GRANT USAGE ON SCHEMA SNOWFLAKE.ACCOUNT_USAGE TO ROLE dbt_cost_management;

GRANT SELECT ON VIEW SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY TO ROLE dbt_cost_management;
GRANT SELECT ON VIEW SNOWFLAKE.ACCOUNT_USAGE.QUERY_ATTRIBUTION_HISTORY TO ROLE dbt_cost_management;
GRANT SELECT ON VIEW SNOWFLAKE.ACCOUNT_USAGE.ACCESS_HISTORY TO ROLE dbt_cost_management;
GRANT SELECT ON VIEW SNOWFLAKE.ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY TO ROLE dbt_cost_management;

GRANT USAGE ON SCHEMA SNOWFLAKE.ORGANIZATION_USAGE TO ROLE dbt_cost_management;
GRANT SELECT ON VIEW SNOWFLAKE.ORGANIZATION_USAGE.USAGE_IN_CURRENCY_DAILY TO ROLE dbt_cost_management;

GRANT USAGE ON DATABASE SNOWFLAKE TO ROLE dbt_cost_management;
GRANT USAGE ON SCHEMA SNOWFLAKE.YOUR_SCHEMA TO ROLE dbt_cost_management;

GRANT SELECT ON TABLE SNOWFLAKE.YOUR_SCHEMA.YOUR_TABLE TO ROLE dbt_cost_management;
GRANT SELECT ON TABLE SNOWFLAKE.YOUR_SCHEMA.YOUR_TABLE2 TO ROLE dbt_cost_management;
GRANT SELECT ON TABLE SNOWFLAKE.YOUR_SCHEMA.YOUR_TABLE3 TO ROLE dbt_cost_management;

```

For broader, account-wide access, you could assign `IMPORTED PRIVILEGES` to the user:

```sql

CREATE USER dbt_cost_user
  PASSWORD = 'A_SECURE_PASSWORD'
  DEFAULT_ROLE = dbt_cost_management
  MUST_CHANGE_PASSWORD = FALSE;

CREATE ROLE dbt_cost_management;
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE dbt_cost_management;
GRANT ROLE dbt_cost_management TO USER dbt_cost_user;

```

You can also configure the user for key pair authentication with dbt Cloud. Repeat this process for each Snowflake warehouse you want to monitor. 

Once the user is created and assigned proper privileges, it's time to configure the connection in dbt Cloud.

## Set up in dbt Cloud

To configure the metadata connection in dbt Cloud:

1. Navigate to **Account Settings** and click **Connections**.
2. Click on the connection associated with the data warehouse(s) you configured in the Snowflake setup. Do not click **Edit**. This is for the broader settings and will prevent the metadata section from being altered. 
3. Scroll down to the **Platform metadata credentials** and click **Add credentials**.
4. Set the appropriate **Auth method** (username and password or key pair) and fill out all the fields provided.
5. Click **Save**.

    <Lightbox src="/img/docs/dbt-cloud/cost-management/configure-metadata.png" width="70%" title="Fill out the fields with the appropriate information."/>

Repeat this process for each warehouse you want to monitor. After the setup is complete, it will be a few hours before the initial sync completes and information begins to populate the dashboard. 

## Cost management dashboard

The cost management dashboard is available by default to any dbt user with the `Admin` [permission set](/docs/cloud/manage-access/enterprise-permissions) assigned. Since the dashboard contains sensitive financial information, we're introducing a new permissions set to help you control access: `Cost Management Viewer`. 

Assign this permission set to only the users or groups you want to have access to the dashboard. 

Once the information begins to sync, you will see the results by selecting the **Cost management** dashboard option from the left-side menu. 

<Lightbox src="/img/docs/dbt-cloud/cost-management/dashboard.png" width="70%" title="The cost management dashboard."/>

- Hover over the **Last refreshed...** date to see a list of your configured connections and their status.
    <Lightbox src="/img/docs/dbt-cloud/cost-management/connection-status.png" width="70%" title="View your connection status."/>
- Adjust the period you want to monitor.
    <Lightbox src="/img/docs/dbt-cloud/cost-management/time-period.png" width="70%" title="Adjust the period you want to view."/>

The **Overview** dashboard displays general information:
- The top tiles display spend and savings over the selected period.
    <Lightbox src="/img/docs/dbt-cloud/cost-management/warehouse-spend.png" width="70%" title="See your total spending."/>
- The bar chart breaks down costs of dbt execution by project. You can click on the individual bars to view more information.
    <Lightbox src="/img/docs/dbt-cloud/cost-management/project-bar.png" width="70%" title="View your spending over time by project and interact with the data to view more."/>

When you click on a bar or a project, you'll be brought to the **Discover** tab. Here, you can view more detailed information about your spending. 

- View information by environment or the following resource types:
    - Model
    - Test
    - Operation
    - Snapshot
    - Seed
    - Source
- Filter by project and/or resource type and view daily information in the bar graph. 
    <Lightbox src="/img/docs/dbt-cloud/cost-management/resource-type.png" width="70%" title="View individual resources and how they impact your costs."/>
- View a detailed breakdown of your resources and the costs associated. You can filter by resource name and/or type and sort by each individual column. 
    <Lightbox src="/img/docs/dbt-cloud/cost-management/resource-type.png" width="70%" title="Filter and view detailed breakdowns of your resources."/>
- Click into a resource to view it's lineage and how much each node is impacting your costs. You can even open the resrouce in dbt Explorer from this view to better understand your metadata!
    <Lightbox src="/img/docs/dbt-cloud/cost-management/render-lineage.png" width="70%" title="View the resrouces lineage and monitor node costs."/>
