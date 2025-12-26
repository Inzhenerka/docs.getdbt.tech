## Матрица возможностей приватного подключения

В следующей таблице показана доступность возможностей приватного подключения для экземпляров <constant name="dbt_platform" /> с [мультиарендной (MT) и одноарендной (ST)](/docs/cloud/about-cloud/tenancy) архитектурой. <br /> <br />
✅ = Доступно | ❌ = В настоящее время не поддерживается | \- = Не применимо <br/>

| Тип подключения                                   | AWS MT | AWS ST | Azure MT | Azure ST | GCP MT |
|:--------------------------------------------------|:------:|:------:|:--------:|:--------:|:--------:|
| <b>INGRESS (в <Constant name="cloud" />)</b>                     |        |        |          |          |          |
| Private <Constant name="cloud" /> Ingress         |   ❌   |   ✅   |    ❌    |    ✅    |    ❌    |
| Dual <Constant name="cloud" /> Ingress            |   ❌   |   ✅   |    ❌    |    ❌    |    ❌    |
| <b>EGRESS – DW (из <Constant name="cloud" />)</b>               |        |        |          |          |          |
| Snowflake                                         |   ✅   |   ✅   |    ✅    |    ✅    |    ✅    |
| - Snowflake Internal Stage                        |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| Databricks                                        |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| Postgres (через load balancer)                    |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| Azure Database for PostgreSQL Flexible Server     |   -    |   -    |    ✅    |    ✅    |    -     |
| Redshift (Interface)                              |   ✅   |   ✅   |    -     |    -     |    -     |
| Redshift (Managed)                                |   ✅   |   ✅   |    -     |    -     |    -     |
| Redshift Severless (Interface)                    |   ✅   |   ✅   |    -     |    -     |    -     |
| Redshift Serverless (Managed)                     |   ✅   |   ✅   |    -     |    -     |    -     |
| Amazon Athena w/ AWS Glue                         |   ❌   |   ✅   |    -     |    -     |    -     |
| Azure Synapse                                     |   -    |   -    |    ✅    |    ✅    |    -     |
| Azure Fabric (cross-tenant not supported by Azure)|   -    |   -    |    ❌    |    ❌    |    -     |
| Google BigQuery                                   |   -    |   -    |    -     |    -     |    ✅    |
| Teradata - Database Server                        |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| <b>EGRESS – VCS (из <Constant name="cloud" />)</b>              |        |        |          |          |          |
| GitHub Enteprise Server                           |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| GitLab Enterprise                                 |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| BitBucket                                         |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| AWS CodeCommit                                    |   ❌   |   ✅   |    -     |    -     |    -     |
| Azure DevOps Repos (not supported by Azure)       |   -    |   -    |    ❌    |    ❌    |    -     |
