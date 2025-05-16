---
title: "Snowflake catalog support"
id: snowflake-catalog-support
sidebar_label: "Snowflake catalog support"
description: Understand Snowflake support for Iceberg catalogs.
---

Snowflake has support for Iceberg tables via built-in and external catalogs, including:
- Snowflake built-in catalog (metadata managed by Snowflake’s built-in information schema)
- Polaris/Open Catalog (managed Polaris)*
- Glue Data Catalog*
- Iceberg REST Compatible* 

*_dbt write catalog integration support coming soon._


To use an externally managed catalog (anything outside of the built-in catalog [Horizon](https://docs.snowflake.com/en/user-guide/snowflake-horizon)), you must set up a catalog integration. To do so, you must run a SQL command similar to the following. Please note that Snowflake only supports reading from external catalogs today, but will be launching support for writing, and thus we have written it in this documentation. 

## External catalogs

Example setup for external catalogs. For Snowflake to interact with external catalogs, a catalog integration must be created.

<Tabs>

<TabItem value="Polaris/Open Catalog">

You must set up a catalog integration to use Polaris/Open Catalog (managed Polaris). 

Example code:

```sql

CREATE CATALOG INTEGRATION my_polaris_catalog_int 
  CATALOG_SOURCE = POLARIS 
  TABLE_FORMAT = ICEBERG 
  REST_CONFIG = (
    CATALOG_URI = 'https://<org>-<account>.snowflakecomputing.com/polaris/api/catalog' 
    CATALOG_NAME = '<open_catalog_name>' 
  ) 
  REST_AUTHENTICATION = (
    TYPE = OAUTH 
    OAUTH_CLIENT_ID = '<client_id>' 
    OAUTH_CLIENT_SECRET = '<client_secret>' 
    OAUTH_ALLOWED_SCOPES = ('PRINCIPAL_ROLE:ALL') 
  ) 
  ENABLED = TRUE;

```

Executing this will register the external Polaris catalog with Snowflake. Once configured, dbt can create Iceberg tables in Snowflake that register the existence of the new database object with the catalog as metadata and query Polaris-managed tables. 

</TabItem>

<TabItem value="Glue data catalog" >

To configure Glue Data Catalog as the external catalog, you will need to set up two prerequisites:

- **Create AWS IAM Role for Glue Access:** Configure AWS permissions so Snowflake can read the Glue Catalog. This typically means creating an AWS IAM role that Snowflake will assume, with policies allowing Glue catalog read operations (at minimum, glue:GetTable and glue:GetTables on the relevant Glue databases). Attach a trust policy to enable Snowflake to assume this role (via an external ID).


- **Set up the catalog integration:** In Snowflake, create a catalog integration of type GLUE. This registers the Glue Data Catalog information and the IAM role with Snowflake. For example:

```sql

CREATE CATALOG INTEGRATION my_glue_catalog_int
  CATALOG_SOURCE = GLUE
  CATALOG_NAMESPACE = 'dbt_database' 
  TABLE_FORMAT = ICEBERG
  GLUE_AWS_ROLE_ARN = 'arn:aws:iam::123456789012:role/myGlueRole'
  GLUE_CATALOG_ID = '123456789012'
  GLUE_REGION = 'us-east-2'
  ENABLED = TRUE;

```
Glue Data Catalog supports the Iceberg REST specification so that you can connect to Glue via the Iceberg REST API.

</TabItem>

<TabItem value="Iceberg REST API">

You can set up a catalog integration for or Catalogs that are compatible with the open-source Apache Iceberg™ REST  specification, 

Example code: 

```sql

CREATE CATALOG INTEGRATION my_iceberg_catalog_int
  CATALOG_SOURCE = ICEBERG_REST
  TABLE_FORMAT = ICEBERG
  CATALOG_NAMESPACE = 'dbt_database'
  REST_CONFIG = (
    restConfigParams
  )
  REST_AUTHENTICATION = (
    restAuthenticationParams
  )
  ENABLED = TRUE
  REFRESH_INTERVAL_SECONDS = <value> 
  COMMENT = 'catalog integration for dbt iceberg tables'

```

For Unity Catalog with a bearer token :

```sql

CREATE OR REPLACE CATALOG INTEGRATION my_unity_catalog_int_pat
  CATALOG_SOURCE = ICEBERG_REST
  TABLE_FORMAT = ICEBERG
  CATALOG_NAMESPACE = 'my_namespace'
  REST_CONFIG = (
    CATALOG_URI = 'https://my-api/api/2.1/unity-catalog/iceberg'
    CATALOG_NAME= '<catalog_name>'
  )
  REST_AUTHENTICATION = (
    TYPE = BEARER
    BEARER_TOKEN = '<bearer_token>'
  )
  ENABLED = TRUE;

```

</TabItem>

</Tabs>

After you have created the external catalog integration, you will be able to do two things:

- **Query an externally managed table:** Snowflake can query Iceberg tables whose metadata lives in the external catalog. In this scenario, Snowflake is a "reader" of the external catalog. The table’s data remains in external cloud storage (AWS S3 or GCP Bucket) as defined in the catalog storage configuration. Snowflake will use the catalog integration to fetch metadata via the REST API. Snowflake then reads the data files from cloud storage.

- **Sync Snowflake-managed tables to an external catalog:** You can create a Snowflake Iceberg table that Snowflake manages via a cloud storage location and then register/sync that table to the external catalog. This allows other engines to discover the table. 

## Catalog Configurations for Snowflake

The following table outlines the configuration fields required to set up a catalog integration for [Iceberg tables in Snowflake](/reference/resource-configs/snowflake-configs#iceberg-table-format).

| Field            | Required | Accepted values                                                                         |
|------------------|----------|-----------------------------------------------------------------------------------------|
| `name`           | yes      | Name of catalog integration                                                             |
| `catalog_name`   | yes      | The name of the catalog integration in Snowflake. For example, `my_dbt_iceberg_catalog`)|
| `external_volume`| yes      | `<external_volume_name>`                                                                |
| `table_format`   | yes      | `iceberg`                                                                               |
| `catalog_type`   | yes      | `built_in`, `iceberg_rest`*                                                             |
| `allows_writes`  | yes      | Signals if this catalog allows writes (defaults to `false`)                             |

*Coming soon! Stay tuned for updates.

### Configure catalog integration for managed Iceberg tables

1. Create a `catalogs.yml` at the top level of your dbt project.<br />
<br />An example of Snowflake Horizon as the catalog:

```yaml

catalogs:
  - name: catalog_horizon
    active_write_integration: snowflake_write_integration
    write_integrations:
      - name: snowflake_write_integration
        external_volume: dbt_external_volume
        table_format: iceberg
        catalog_type: built-in

```

2. Apply the catalog configuration at either the model, folder, or project level. <br />
<br />An example of `iceberg_model.sql`:

```yaml

{{
    config(
        materialized='table',
        catalog = catalog_horizon

    )
}}

select * from {{ ref('jaffle_shop_customers') }}


```
3. Execute the dbt model with a `dbt run -s iceberg_model`.

For more information, refer to our documentation on [Snowflake configurations](/reference/resource-configs/snowflake-configs).

## Limitations

For external catalogs, Snowflake only supports `read`, which means it can query the table but cannot insert or modify data. 

The syncing experience will be different depending on the catalog you choose. Some catalogs are automatically refreshed, and you can set parameters to do so with your catalog integration. Other catalogs might require a separate job to manage the metadata sync. 
