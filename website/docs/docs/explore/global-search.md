---
title: "Global search"
sidebar_label: "Global search"
description: "Learn how to search your dbt resources across your entire account global search with dbt Catalog." 
---
:::info 
dbt Explorer is now dbt Catalog! Learn more about the change [here](add link).
:::

# Global search <Lifecycle status='beta' />

<IntroText>

dbt Catalog enables you to widen your search by searching your dbt resources (models, seeds, snapshots, sources, exposures and more so) across your entire account. This broadens the results returned and gives you greater insight into all the assets across your dbt projects.

</IntroText>

With dbt Catalog, you can search your dbt resources with [Global navigation](/docs/explore/global-search#global-navigation) and [External metadata ingestion](/docs/explore/global-search#external-metadata-ingestion).

<Expandable alt_header="Global navigation"> 
  
With dbt Catalog, global navigation provides a search experience that lets you find dbt resources across all your projects, as well as non-dbt resources in Snowflake.

## Prerequisities 

- Have a dbt Cloud account on the [Starter, Enterprise or Enterprise+](https://www.getdbt.com/pricing) account.
- Have a [developer licence with Owner](/docs/cloud/manage-access/about-user-access#role-based-access-control) permissions.
- Navigate to your [account settings](/docs/cloud/account-settings) in your dbt Cloud account and check the box to **Enable Explorer’s Global Navigation**.

## Search resources using global navigation

After you have enabled global navigation in your account settings, you can begin to browse the dbt assets across your entire account!

To search the resources in your projects:

1. Navigate to **Explore** in the left hand side bar.
2. Select dbt and then Snowflake from the menu.

<Lightbox src="/img/docs/collaborate/dbt-explorer/search-resources-in-dbt-catalog.png" width="50%" title="Search resources in dbt Catalog."/>

3. You can also use the search box at the top of the page to locate your assets.

<Lightbox src="/img/docs/collaborate/dbt-explorer/searchbar-search-resources.png" width="80%" title="Search resources in dbt Catalog with search bar."/>

</Expandable>

<Expandable alt_header="External metadata ingestion"> <Lifecycle status="Enterprise,Enterprise+" />

:::info External metadata ingestion support
Currently, external metadata ingestion is supported for Snowflake only.
:::
  
With external metadata ingestion, you can connect directly to your data warehouse, giving you visibility into tables, views, and other resources, such as models, seeds, snapshots, sources, exposures, and more that aren't defined in dbt. This provides a more complete view of your data environment, enabling better data discovery, impact analysis, and governance. It also makes it easier to understand the full landscape of the warehouse, see how different pieces of data relate to each other, and identify how changes might affect downstream systems.

## Prerequisites

- Have a dbt Cloud account on the [Enterprise or Enterprise+](https://www.getdbt.com/pricing) account.
- Have a [developer licence with Owner](/docs/cloud/manage-access/about-user-access#role-based-access-control) permissions.
- Have [**Global Navigation**](/docs/explore/global-search#global-navigation) enabled.
- Use snowflake as your data platform.
- Stayed tuned! Coming very soon, there’ll be support in future for other adapters!

## Enable external metadata ingestion 

To enable external metadata ingestion  

1. Navigate to your [account settings](/docs/cloud/account-settings) in your dbt Cloud account.
2. Click **Credentials**.
3. Select your project from the window that appears and click **Edit**.
4. Check the box to **Enable External metadata ingestion**.

</Expandable>

The following table, outlines the plan types eligible for global navigation and external metadata ingestion.

| Plan type  | Global Navigation | External metadata ingestion |
|------------|-------------------|-----------------------------|
| Core       |        ❌         |             ❌               |  
| Developer  |        ❌         |             ❌               |   
| Starter*   |        ✅         |             ❌               | 
| Enterprise |        ✅         |             ✅               |       
| Enterprise+|        ✅         |             ✅               | 
|Virtual Private Cloud (VPC) |        ✅         |             ✅               | 

*Note: While Global navigation is available on Starter plans, it’s limited to a single project.