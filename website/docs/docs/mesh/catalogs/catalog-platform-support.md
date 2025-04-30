---
title: "Iceberg catalog platform support"
id: catalog-platform-support
sidebar_label: "Platform support"
description: Understand dbt platform support for Iceberg catalogs.
---

Before using dbt with Iceberg, you will need to decide on a storage layer (S3 Buckets, Azure Blob, GCP Bucket, warehouse-specific, etc) and the catalog you will use for your environments.

There are two types of technical data catalogs to take into account:
- Built-in (native to the data platform)
- External catalogs

Built-in catalogs come with the platform and do not require much, if any, setup. These include the Snowflake catalog and the Unity Catalog by Databricks. External catalogs are managed by a third-party service or the user and require a catalog integration to allow the warehouse to access them for metadata. 

Today, most data platforms support reading from other catalogs, but generally do not support writes. This is changing rapidly, and we will adjust our documentation and feature support as platforms implement updates to their capabilities. 

Delta catalogs like Unity Catalog and Onelake are Iceberg compatible by managing dual metadata for Delta and Iceberg. The data is stored in the Delta table format, but users can access the metadata and data with an Iceberg client.
