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

# TODO: Changes done only to track which pieces of documentation has been already moved. This is not the final version of this file


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

### Install dbt-core and dbt-clickhouse

```sh
pip install dbt-clickhouse
```

### Provide dbt with the connection details for our ClickHouse instance. 
The full list of connection configuration options is available in the [complete ClickHouse documentation](https://clickhouse.com/docs/en/integrations/dbt). Configure `clickhouse` profile in ~/.dbt/profiles.yml file and provide user, password, schena host properties:

```yaml
clickhouse:
  target: dev
  outputs:
    dev:
      type: clickhouse
      schema: <target_schema>
      host: <host>
      port: 8443 # use 9440 for native
      user: default
      password: <password>
      secure: True
```

### Create a dbt project:

```sh
dbt init project_name
```

Inside `project_name` dir, update your `dbt_project.yml` file to specify a profile name to connect to the ClickHouse server.

```yaml
profile: 'clickhouse'
```

### Execute dbt debug with the CLI tool to confirm whether dbt is able to connect to ClickHouse.
Confirm the response includes Connection test: [OK connection ok] indicating a successful connection.

## Documentation

See the [ClickHouse website](https://clickhouse.com/docs/integrations/dbt) for the full `dbt-clickhouse` documentation entry.
