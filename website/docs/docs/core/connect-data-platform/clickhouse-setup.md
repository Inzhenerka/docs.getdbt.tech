---
title: "ClickHouse setup"
description: "Read this guide to learn about the ClickHouse warehouse setup in dbt."
meta:
  maintained_by: Community
  authors: 'Geoff Genz & Bentsi Leviav'
  github_repo: 'ClickHouse/dbt-clickhouse'
  pypi_package: 'dbt-clickhouse'
  min_core_version: 'v0.19.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-clickhouse'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Clickhouse'
  config_page: '/reference/resource-configs/clickhouse-configs'
---

Some core functionality may be limited. If you're interested in contributing, check out the source code for each
repository listed below.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Supported features

- [x] Table materialization
- [x] View materialization
- [x] Incremental materialization
- [x] Microbatch incremental materialization
- [x] Materialized View materializations (uses the `TO` form of MATERIALIZED VIEW, experimental)
- [x] Seeds
- [x] Sources
- [x] Docs generate
- [x] Tests
- [x] Snapshots
- [x] Most dbt-utils macros (now included in dbt-core)
- [x] Ephemeral materialization
- [x] Distributed table materialization (experimental)
- [x] Distributed incremental materialization (experimental)
- [x] Contracts

## Connecting to ClickHouse with **dbt-clickhouse**

To connect to ClickHouse from dbt, you'll need to add a [profile](/docs/core/connect-data-platform/connection-profiles)
to your `profiles.yml` file. An example of a ClickHouse profile have the following syntax:

```yaml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: clickhouse
      schema: [ default ] # ClickHouse database for dbt models

      # optional
      host: [ localhost ]
      port: [ 8123 ]  # Defaults to 8123, 8443, 9000, 9440 depending on the secure and driver settings 
      user: [ default ] # User for all database operations
      password: [ <empty string> ] # Password for the user
      secure: [ False ] # Use TLS (native protocol) or HTTPS (http protocol)

      # You can find all the configurations options in the ClickHouse documentation: https://clickhouse.com/docs/integrations/dbt
```

## Documentation

See the [ClickHouse website](https://clickhouse.com/docs/integrations/dbt) for the full `dbt-clickhouse` documentation entry.

## Contributing

We welcome contributions from the community to help improve the dbt-ClickHouse adapter. Whether you’re fixing a bug,
adding a new feature, or enhancing documentation, your efforts are greatly appreciated!

Please take a moment to read our [Contribution Guide](https://github.com/ClickHouse/dbt-clickhouse/blob/main/CONTRIBUTING.md) to get started. The guide provides detailed instructions on setting up your environment, running tests, and submitting pull requests.
