## Private connectivity feature matrix


| Ingress         | AWS MT (legacy)| AWS MC | AWS ST | Azure MC | Azure ST |
|-----------------|:--------------:|:------:|:------:|:--------:|:--------:|
|Connection Ingress|      ❌       |    ❌   |   ✅   |   ❌     |   ✅     |
| Dual ingress    |     ❌         |    ❌   |  ✅    |   ❌     |   ❌     |
| IP restrictions | ✅             |    ✅   |  ✅    |   ✅     |   ✅     |

|  Egress         | AWS MT (legacy)| AWS MC | AWS ST | Azure MC | Azure ST |
|-----------------|:--------------:|:------:|:------:|:--------:|:--------:|
| Snowflake       |      ✅        |    ✅    |    ✅  |   ✅     |   ✅     |
| Snowflake internal stage|  ❌    |     ❌   |   ⚠️    |   ✅    |    ✅    |
| Databricks      |     ✅         |    ✅    |   ✅   |   -     |   -      |
| Redshift (Interface)|   ✅       |   ✅     |   ✅   |   -     |   -      |
| Redshift (Managed)|      ✅      |    ✅    |    ✅  |   -     |   -      | 
| Redshift Severless (Interface)|✅|   ✅     |    ✅  |   -     |   -      | 
| Redshift Serverless (Managed)|✅ |   ✅    |     ✅  |   -     |   -      | 

| Egress VCS      | AWS MT (legacy)| AWS MC | AWS ST | Azure MC | Azure ST |
|-----------------|:--------------:|:------:|:------:|:--------:|:--------:|
|GitHub Enteprise Server| ✅       |    ✅   |   ✅   |   ✅     |   ✅     |
| GitLab Enterprise|    ✅         |    ✅   |  ✅    |   ✅     |   ✅     |
| BitBucket        | ✅             |    ✅   |  ✅    |   ✅     |   ✅     |
| AWS CodeCommit   | ❌             |    ❌   |  ✅    |   -     |   -     |

  