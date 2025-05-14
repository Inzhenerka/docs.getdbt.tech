---
title: "External metadata ingestion"
sidebar_label: "External metadata ingestion"
description: "Connect directly to your data warehouse, giving you visibility into tables, views, and other resources that aren't defined in dbt with dbt Catalog." 
---

# External metadata ingestion <Lifecycle status="Enterprise,Enterprise+" />

<IntroText>

With external metadata ingestion, you can connect directly to your data warehouse, giving you visibility into tables, views, and other resources that aren't defined in dbt with dbt Catalog.

</IntroText>

:::info External metadata ingestion support
Currently, external metadata ingestion is supported for Snowflake only.
:::
  
With external metadata ingestion, you can connect directly to your data warehouse, giving you visibility into tables, views, and other resources, such as models, seeds, snapshots, sources, exposures, and more that aren't defined in dbt. This provides a more complete view of your data environment, enabling better data discovery, impact analysis, and governance. It also makes it easier to understand the full landscape of the warehouse, see how different pieces of data relate to each other, and identify how changes might affect downstream systems.

## Prerequisites

- Have a dbt Cloud account on the [Enterprise or Enterprise+](https://www.getdbt.com/pricing) account.
- Have a [developer licence with Owner](/docs/cloud/manage-access/about-user-access#role-based-access-control) permissions.
- Have [**Global Navigation**](/docs/explore/explore-projects#global-navigation-) enabled.
- Use snowflake as your data platform.
- Stayed tuned! Coming very soon, there’ll be support in future for other adapters!

## Enable external metadata ingestion 

To enable external metadata ingestion  

1. Navigate to your [account settings](/docs/cloud/account-settings) in your dbt Cloud account.
2. Click **Credentials**.
3. Select your project from the window that appears and click **Edit**.
4. Check the box to **Enable External metadata ingestion**.

import Generatemetadata from '/snippets/_generate-metadata.md';

<Generatemetadata />
