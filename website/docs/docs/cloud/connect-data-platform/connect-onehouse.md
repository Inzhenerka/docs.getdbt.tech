---
title: "Connect Onehouse"
id: connect-onehouse
sidebar_label: "Connect Onehouse"
description: "Setup instructions for connecting Onehouse to dbt Cloud"
pagination_next: null
---


<Constant name="cloud" /> supports connecting to [Onehouse SQL](https://www.onehouse.ai/) using the Apache Spark Connector with the Thrift method.

:::note
Connect to a Onehouse SQL Cluster with the [dbt-spark ](/connect-data-platform/connect-apache-spark)adapter.**
:::

## Requirements

* For <Constant name="cloud" />, ensure your Onehouse SQL endpoint is accessible via external DNS/IP, whitelisting dbt Cloud IPs.
* For dbt Core, you can SSH tunnel into the VPC to access the endpoint, without opening up ports.

## What works 

* All dbt Commands, including: `dbt clean`, `dbt compile`, `dbt debug`, `dbt seed`, and `dbt run`.
* dbt materializations: `table` and `incremental`
* Apache Hudi table types of Merge on Read (MoR) and Copy on Write (CoW). It is recommended to use MoR for mutable workloads.

## Limitations

* dbt materialized type cannot be "view".
* `dbt seed` has row / record limits.
* `dbt seed` only supports CoW tables.

## dbt connection

Fill in the following fields when creating an **Apache Spark** warehouse connection using the Thrift connection method:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Method | The method for connecting to Spark | Thrift |
| Hostname | The hostname of your Onehouse SQL Cluster endpoint | `yourProject.sparkHost.com` |
| Port | The port to connect to Spark on | 10000 |
| Cluster | Onehouse does not use this field | |
| Connection Timeout | Number of seconds after which to timeout a connection | 10 |
| Connection Retries | Number of times to attempt connecting to cluster before failing | 0 |
| Organization | Onehouse does not use this field | |
| User | Optional. Not enabled by default. | dbt_cloud_user |
| Auth | Optional, supply if using Kerberos. Not enabled by default. | `KERBEROS` |
| Kerberos Service Name | Optional, supply if using Kerberos. Not enabled by default. | `hive` |

<Lightbox src="/img/onehouse/onehouse-dbt.png" width="70%" title="Onehouse configuration"/>

## dbt project

When using dbt, ensure you add necessary configurations to dbt_project.yml for the dbt connector to write data correctly.

| Field | Description | Required | Default  | Recommended |
| ----- | ----------- | -------- | -------- | -------- |
| materialized | Type of table materialization | Yes |   |  table |
| file_format | Open table format to write | Yes |   | hudi   |
| location_root | Location of the database in DFS | Yes |   |    |
| hoodie.table.type | Merge on Read or Copy on Write | No | cow  | mor   |

dbt_project.yml template

```yml
      +materialized: table | incremental
      +file_format: hudi
      +location_root: s3://lakehouse/demolake/dbt_ecomm/
      +tblproperties:
         hoodie.table.type: mor | cow
```

A dbt_project.yml example if using jaffle shop would be
```sql
models:
  jaffle_shop:
    +file_format: hudi
    +location_root: s3://lakehouse/demolake/dbt_ecomm/
    +tblproperties:
      hoodie.table.type: mor
    staging:
      +materialized: incremental
    marts:
      +materialized: table
```


