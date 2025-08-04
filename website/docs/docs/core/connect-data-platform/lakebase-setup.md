---
title: "Databricks Lakebase setup"
meta:
  maintained_by: dbt Labs
  authors: dbt Labs
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-postgres'
  min_core_version: 'v1.0.0'
  cloud_support: Supported
  min_supported_version: '?'
  slack_channel_name: '#db-postgres'
  slack_channel_link: 'https://getdbt.slack.com/archives/C0172G2E273'
  platform_name: 'Lakebase'
  config_page: '/reference/resource-configs/postgres-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Profile Configuration

Databricks Lakebase targets are configured exactly the same as [Postgres targets](postgres-setup#profile-configuration).

Please Note the following:

- `host name` is found in Databricks > Compute > Database instances > Connect with PSQL in the format `instance-123abcdef456.database.cloud.databricks.com`
- `database name` is databricks_postgres by default
- For authentication, dbt-postgres can only support username/password. You can generate a password either by [enabling Native Postgres Role Login](https://docs.databricks.com/aws/en/oltp/oauth?language=UI#authenticate-with-databricks-identities) (recommended) or [generating an Oauth token that will need to be refreshed every hour](https://docs.databricks.com/aws/en/oltp/oauth?language=UI#authenticate-with-databricks-identities]). 

