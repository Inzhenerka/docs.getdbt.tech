---
title: "Databricks catalog support"
id: databricks-catalog-support
sidebar_label: "Databricks catalog support"
description: Understand Databricks support for Iceberg catalogs.
---

Databricks is built on [Delta Lake](https://docs.databricks.com/aws/en/delta/) and stores data in the [Delta table](https://docs.databricks.com/aws/en/introduction/delta-comparison#delta-tables-default-data-table-architecture) format. Databricks does not support writing to Iceberg catalogs. However, it does support reading from external Iceberg catalogs and creating tables readable from Iceberg clients stored as Delta tables.

When a dbt model is configured with the table property including UniForm, it will duplicate the Delta metadata for an Iceberg-compatible metadata. This allows external Iceberg compute engines to read from Unity Catalogs. 


Example SQL:

```sql
{{ config(
    tblproperties={
      'delta.enableIcebergCompatV2' = 'true'
      'delta.universalFormat.enabledFormats' = 'iceberg'
    }
 ) }}

```
To set up Databricks for reading and querying external tables, configure [Lakehouse Federation](https://docs.databricks.com/aws/en/query-federation/) and establish the catalog as a foreign catalog. This will be configured outside of dbt, and once completed, it will be another database you can query. 
