---
title: "Power BI"
description: "Use Power BI to query the dbt Semantic Layer and produce dashboards with trusted date."
tags: [Semantic Layer]
sidebar_label: "Power BI"
---

# Power BI <Lifecycle status="enterprise,beta" />

The Power BI integration allows you to use reports to query the dbt Semantic Layer directly and produce your dashboards with trusted data. It provides a live connection to the dbt Semantic Layer through Power BI Desktop or Power BI Service.

:::tip
The Power BI integration is currently in private beta. If you're interested in participating, please reach out to your account representative.
:::

## Prerequisites

- You have [configured the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) 
- You are on a supported [dbt Cloud release track](/dbt-versions/cloud-release-tracks) or on dbt v1.6 or higher.
- You installed [Power BI Desktop or Power BI On-premises Data Gateway](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-custom-connectors)
  - Note that Power BI Service doesn't currently support custom connectors natively. To use the connector in Power BI Service, you must install and configure it on an On-premises Data Gateway.
- You need your [dbt Cloud host](/docs/use-dbt-semantic-layer/setup-sl#3-view-connection-detail), [Environment ID](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) and [service token](/docs/dbt-cloud-apis/service-tokens) to log in. This account should be set up with the dbt Semantic Layer.
- You must have a dbt Cloud Team or Enterprise [account](https://www.getdbt.com/pricing). Suitable for both Multi-tenant and Single-tenant deployment. 
  - Single-tenant accounts should contact their account representative for necessary setup and enablement.

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Install the connector

The dbt Semantic Layer Power BI connector consists of a custom `.pqx` Power BI connector and an ODBC driver. To install both, use our Windows installer by following these steps:

1. Join the private beta
  - Contact your dbt Labs sales representative to request access to the `.msi` installer.
2. Download and install the `.msi` installer
  - Run the installer and follow the on-screen instructions.
  - This will install the ODBC driver and the connector onto your Power BI Desktop.

### Verify installation
Confirm that the connector is properly installed by following these steps:

- Open `ODBC Data Sources (64-bit)` file on your computer.
- Navigate to `System DSN` and verify that the `dbt Labs ODBC DSN` is registered. 
- Navigate to `Drivers` and verify that the `dbt Labs ODBC Driver` is installed.
- Open Power BI Desktop, navigate to `Settings > Data Source Settings`, and verify that the `dbt Semantic Layer` connector is properly loaded.

To allow published reports in Power BI Service to use the connector, an IT admin in your organization needs to install and configure the connector on an On-premises Data Gateway.

## For IT admins

1. If you’re an IT admin trying to install the ODBC driver and connector into an On-premises Data Gateway, run the same `.msi` installer on the computer where your gateway is set up to install them for Power BI Desktop.
2. Copy the `.pqx` Power BI extension, located at `C:\Users\<YourUser>\Documents\Power BI Desktop\Custom Connectors\dbtSemanticLayer.pqx`, into the Power BI On-premises Data Gateway custom connectors directory. Usually, that is `C:\Windows\ServiceProfiles\PBIEgwService\Documents\Power BI Desktop\Custom Connectors`.
3. Confirm that the connector is properly installed by following the [verify installation](#verify-installation) steps earlier. 
4. Open the `EnterpriseGatewayConfigurator.exe`, navigate to `Connectors` and verify that the `dbt Semantic Layer` connector is properly loaded.

For more information on how to set up custom connectors in the Power BI On-premises Data Gateway, refer to Power BI’s [official documentation](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-custom-connectors).

## Configure the connector
After installing the connector, you’ll have to configure your project credentials to connect to the Semantic Layer from a report.

### Power BI Desktop
To configure project credentials in Power BI Desktop:

1. Create a blank report
2. On the top-left, click on `Get data`
3. Search for dbt Semantic Layer, then click Connect
4. Fill in your connection details. You can find your server and environmentId under the Semantic Layer configuration for your dbt Cloud project. Make sure you select DirectQuery, since the Semantic Layer connector does not support Import mode. Click OK to proceed.
   ADD IMG
5. On the next screen, paste your service token then click Connect
   ADD IMG
6. You should see a sidepane with a few “tables” (they’re not actually tables as we’ll see in the following sections). Select the ones you want to load into your dashboard then click Load.
   ADD IMG

## Configure published reports
The first time you hit “Publish” on a given report, you’ll have to configure Power BI Service to use your organization’s On-premises Data Gateway to access data from the dbt Semantic Layer. To do that:
1. On the top right, click on Settings > Power BI Settings
   ADD IMG
2. Navigate to Semantic Models. Then pick your report on the sidebar on the left.
   ADD IMG
3. Under Gateway and cloud connections, select the On-premises Data Gateway where your IT admin has installed the dbt Semantic Layer connector. If the Status is Not configured correctly, you’ll have to configure it.
   ADD IMG
4. Click on the arrow that shows on the right of your gateway. Then, click on Manually add to gateway
   ADD IMG
5. Give a name to your connection and fill in your connection details. Make sure to set the connection as Encrypted. If you fail to do so, our servers will reject the connection.
   ADD IMG
6. Click Create. This will run a connection test (unless you choose to skip it) and, if this succeeds, the connection will be saved.
   ADD IMG
You can now head back to your published report on Power BI Service to assert data loads as expected.

## Use the connector

The dbt Semantic Layer connector will create a fake table for each of your saved queries, plus a `METRICS.ALL` table. All measures in these tables are metrics, and dimensions and entities appear as regular dimension columns.

These tables do not actually map to an underlying table in your data warehouse, even though Power BI thinks it does. In reality, what happens is Power BI will send queries to these tables, and, before actually executing on the warehouse, Semantic Layer servers will parse the SQL, extract all the queried columns, group bys and filters and generate a new piece of SQL that actually queries your existing tables. They’ll then return data back to Power BI, which doesn’t know any of this happened.


ADD DIAGRAM

This allows for very flexible analytics workflows: just drag and drop metrics, slice by dimensions and entities and the Semantic Layer will generate the appropriate SQL to actually query your data source for you.

Due to the way it works, there are a few things to note:

- Not every “column” of `METRICS.ALL` will be compatible with every other column
    - `METRICS.ALL` is an amalgamation of all your existing metrics, entities and dimensions. However, queries to it must translate to valid Semantic Layer queries, otherwise you’ll get query compilation errors raised by Metricflow.
    - Conversely, for saved query tables, all “columns” will be compatible with every other “column” since, by definition, saved queries are valid queries that can be sliced by any of the dimensions present in the query.
- The dbt Semantic Layer connector does not support `Import` mode natively.
    - Since `Import` mode tries to select an entire table to import into Power BI, it will most likely generate SQL that translates to an invalid Semantic Layer query which will try to query all metrics, dimensions and entities at the same time.
    - If you really want to import data into a PowerBI report, you should
        - select a valid combination of columns to import, i.e something that will generate a valid Semantic Layer query
            - You can use `Table.SelectColumns` for this
            - `= Table.SelectColumns(Source{[Item="ALL",Schema="METRICS",Catalog=null]}[Data], {"Total Profit", "Metric Time (Day)"})`
        - be aware that all calculations will happen inside of Power BI, and won’t pass through Semantic Layer servers. This could lead to incorrect or diverging results.
            - For example, the Semantic Layer is usually responsible for rolling up cumulative metrics to coarser time granularities. Doing a sum over all the weeks in a year to get a yearly granularity out of a weekly Semantic Layer query will most likely generate incorrect results. Instead, you should query the Semantic Layer directly to get accurate results.
- The dbt Semantic Layer connector ignores aggregations defined in Power BI.
    - If you change the aggregation type of a metric from `SUM()` to `COUNT()` or anything else, nothing will change. This is because aggregation functions are defined in the Semantic Layer, and we ignore them when translating Power BI generated SQL into Semantic Layer queries.
