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
  
External metadata credentials enable ingestion of metadata that exists *outside* your dbt runs like tables, views, or cost information; typically at a higher level than what dbt environments access. This is useful for enriching the dbt Catalog with warehouse-native insights (for example, Snowflake views or access patterns) and creating a unified discovery experience.

These credentials are configured separately from dbt environment credentials and are scoped at the account level, not the project level.

## Prerequisites

- Have a dbt Cloud account on the [Enterprise or Enterprise+](https://www.getdbt.com/pricing) account.
- You must be an [account admin with permission](/docs/cloud/manage-access/enterprise-permissions#account-admin) to edit connections.
    - The credentials must have [sufficient read-level access to fetch metadata](/docs/explore/external-metadata-ingestion#configuration-instructions).
- Have [**Global Navigation**](/docs/explore/explore-projects#global-navigation-) enabled.
- Use snowflake as your data platform.
- Stayed tuned! Coming very soon, there’ll be support in future for other adapters!

## Configuration instructions

1. Navigate to [account Settings](/docs/cloud/account-settings) and then select **Connections**.
2. Locate or create the warehouse connection you want to ingest metadata from.
3. Click **Add Credential** and enter your global metadata credentials.
    - These should have warehouse-level visibility across relevant databases and schemas (see —>here← for permissioning
4. Select **Enable the option for “External metadata ingestion”**.
    - This allows metadata from this connection to populate the dbt Catalog.
    - *Optional*: Enable additional features such as **cost optimization** if you want.
5. **Apply filters** to restrict which metadata is ingested:
    - You can filter by **database**, **schema**, **table**, or **view**.
    - These fields accept **CSV-formatted regular expressions**
        - Example: `DIM` matches `DIM_ORDERS` and `VADIMS_TABLE` (basic "contains" match).
        - Wildcards are supported: `DIM*` matches `DIM_ORDERS`, `DIM_PRODUCTS`, etc.

---

## Credentials Required

Your metadata credentials should have the following minimum permissions (for Snowflake, as an example):

- Roxi to fill in

Note: Use read-only service accounts for least privilege and better auditing.


## Best Practices

The following are best practices for external metadata ingestion, designed to ensure consistent, reliable, and scalable integration of metadata from third-party systems.

- Avoid duplicates: Use one metadata connection per platform if possible (for example, one for Snowflake, one for BigQuery).
    - Having multiple connections pointing to the same warehouse can cause duplicate metadata.
    
- Align with dbt Environment: To unify asset lineage and metadata, ensure the same warehouse connection is used by both the dbt Environment and the external metadata ingestion.

- Use filters to limit ingestion to relevant assets:
    - For example: restrict to production schemas only, or ignore transient/temp schemas.

import Generatemetadata from '/snippets/_generate-metadata.md';

<Generatemetadata />
