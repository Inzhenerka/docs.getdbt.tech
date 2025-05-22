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

- Have a dbt Cloud account on the [Enterprise or Enterprise+](https://www.getdbt.com/pricing) plan
- You must be an [account admin](https://docs.getdbt.com/docs/cloud/manage-access/enterprise-permissions#account-admin) with permission to edit connections
    - The credentials must have [sufficient read-level access to fetch metadata](/docs/explore/external-metadata-ingestion#configuration-instructions)
- Have [**Global Navigation**](/docs/explore/explore-projects#global-navigation) enabled
- Use snowflake as your data platform
- Stayed tuned! Coming very soon, there’ll be support in future for other adapters!

## Required credentials

External metadata credentials enable ingestion of metadata that exist outside of your dbt runs &mdash; such as tables and views, typically at a broader level than what dbt environments access. This helps hydrate the Catalog with warehouse metadata (currently supported for Snowflake).

These credentials are configured separately from dbt Environment credentials and are scoped at the account level, not the project level.

## Configuration instructions

To enable external metadata ingestion:

1. Navigate to [account settings](/docs/cloud/account-settings)
2. Locate or create the warehouse connection you want to ingest metadata from
3. Click “Add Credential” and enter your global metadata credentials
    - These should have warehouse-level visibility across relevant databases and schemas
4. Enable the option for “External metadata ingestion”
    - This allows metadata from this connection to populate the Catalog
    - *Optional*: Enable additional features such as **cost optimization**
5. Apply filters to restrict which metadata is ingested:
    - You can filter by **database**, **schema**, **table**, or **view**
    - Strongly recommend you filter by certain schemas. See [Best practices](/docs/explore/external-metadata-ingestion#best-practices) for more informtion
    - These fields accept CSV-formatted regular expressions
        - Example: `DIM` matches `DIM_ORDERS` and `DIMENSION_TABLE` (basic "contains" match)
        - Wildcards are supported: `DIM*` matches `DIM_ORDERS`, `DIM_PRODUCTS`, etc.

## Required credentials

Your metadata credentials should have the following minimum permissions. You should do this for each database required for the user. The following example uses Snowflake:

Create role:

```sql
CREATE OR REPLACE ROLE dbt_metadata_role;
```

Grant access to a warehouse to run queries to view metadata:

```sql
GRANT OPERATE, USAGE ON WAREHOUSE "<your-warehouse>" TO ROLE dbt_metadata_role;
```

If you do not have a user already, create a dbt-specific user for metadata access. Replace `your-password` with a strong password and `your-warehouse` with the warehouse name used above:

```sql
CREATE USER dbt_metadata_user
  DISPLAY_NAME = 'dbt Metadata Integration'
  PASSWORD = 'our-password>'
  DEFAULT_ROLE = dbt_metadata_role
  TYPE = 'LEGACY_SERVICE'
  DEFAULT_WAREHOUSE = '<your-warehouse>';
```

Grant the role to the user:

```sql
GRANT ROLE dbt_metadata_role TO USER dbt_metadata_user;
```
## Assign metadata access privileges

Replace `your-database` with the name of a Snowflake database to grant metadata access. Repeat this block for each relevant database:

```sql


SET db_var = '"<your-database>"';

-- Grant access to view the database and its schemas
GRANT USAGE ON DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT USAGE ON ALL SCHEMAS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT USAGE ON FUTURE SCHEMAS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;

-- Grant SELECT privileges to enable metadata introspection and profiling
GRANT SELECT ON ALL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON ALL EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON ALL VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON ALL DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;

-- Grant REFERENCES to enable lineage and dependency analysis
GRANT REFERENCES ON ALL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON FUTURE TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON ALL EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON FUTURE EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON ALL VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON FUTURE VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;

-- Grant MONITOR on dynamic tables (e.g., for freshness or status checks)
GRANT MONITOR ON ALL DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT MONITOR ON FUTURE DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;

```

## Grant access to Snowflake metadata

Grant privileges to read usage stats and lineage from Snowflake’s system-level database:

```sql
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE dbt_metadata_role;
```

## Best practices

Catalog unifies shared assets between dbt and Snowflake. For example, if a Snowflake table represents a dbt model, it's shown as a single asset in the Catalog.

To enable proper unification, the same connection must be used by both the Production Environment and the external metadata ingestion credential.

To avoid duplicate metadata, we recommend using one metadata connection per platform (for example, one for Snowflake, one for BigQuery).

We strongly recommend using “Catalog filters” to limit ingestion to relevant assets. For example, restrict to production schemas only, and exclude transient, temp, or dev schemas.

External metadata ingestion runs once per day at 5 PM UTC.

import Generatemetadata from '/snippets/_generate-metadata.md';

<Generatemetadata />
