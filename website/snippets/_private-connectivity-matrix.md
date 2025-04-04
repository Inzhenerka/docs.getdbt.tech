## Private connectivity feature matrix


| Connectivity Type                                 | AWS MT | AWS ST | Azure MT | Azure ST |
|:--------------------------------------------------|:------:|:------:|:--------:|:--------:|
| <b>INGRESS (to dbt Cloud)</b>                     |        |        |          |          |
| Private dbt Cloud Ingress                         |   ❌   |   ✅   |    ❌    |    ✅    |
| Dual dbt Cloud Ingress                            |   ❌   |   ✅   |    ❌    |    ❌    |
| <b>EGRESS - DW (from dbt Cloud)</b>               |        |        |          |          |
| Snowflake                                         |   ✅   |   ✅   |    ✅    |    ✅    |
| - Snowflake Internal Stage                        |   ❌   |   ⚙️   |    ✅    |    ✅    |
| Databricks                                        |   ✅   |   ✅   |    ✅    |    ✅    |
| Postgres (self-hosted)                            |   ✅   |   ✅   |    ✅    |    ✅    |
| Redshift (Interface)                              |   ✅   |   ✅   |    -     |    -     |
| Redshift (Managed)                                |   ✅   |   ✅   |    -     |    -     | 
| Redshift Severless (Interface)                    |   ✅   |   ✅   |    -     |    -     | 
| Redshift Serverless (Managed)                     |   ✅   |   ✅   |    -     |    -     |
| Amazon Athena w/ AWS Glue                         |   ✅   |   ✅   |    -     |    -     |
| Azure Synapse                                     |   -    |   -    |    ✅    |    ✅    |
| Azure Fabric (cross-tenant not supported by Azure)|   -    |   -    |    ❌    |    ❌    |
| Google BigQuery                                   |   -    |   -    |    -     |    -     |
| Teradata - Database Server                        |   ✅   |   ✅   |    ✅    |    ✅    |
| <b>EGRESS - VCS (from dbt Cloud)</b>              |        |        |          |          |
| GitHub Enteprise Server                           |   ✅   |   ✅   |    ✅    |    ✅    |
| GitLab Enterprise                                 |   ✅   |   ✅   |    ✅    |    ✅    |
| BitBucket                                         |   ✅   |   ✅   |    ✅    |    ✅    |
| AWS CodeCommit                                    |   ❌   |   ✅   |    -     |    -     |
| Azure DevOps Repos (not supported by Azure)       |   -    |   -    |    ❌    |    ❌    |
