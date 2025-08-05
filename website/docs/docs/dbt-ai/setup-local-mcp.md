---
title: "Set Up Local MCP"
sidebar_label: "Set Up Local MCP"
description: "Learn how to set up the local dbt-mcp server"
id: "setup-local-mcp"
---


## Set up Local Server

1. [Install uv](https://docs.astral.sh/uv/getting-started/installation/)
2. Copy the [`.env.example` file](https://github.com/dbt-labs/dbt-mcp/blob/main/.env.example) locally under a file called `.env`. You will need this file for integrating with MCP compatible tools. Set it with the following environment variable configuration:

### Setting Environment Variables

You will need to configure environment variables in order to access the tools. 

#### Configuration for Discovery, Semantic Layer, and SQL Tools
<!-- add new columns on what is optional and what isn't -->


| Name                       | Default            | Description                                                                                                                                                                                                                                  |
| -------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DBT_HOST`                 | `cloud.getdbt.com` | Your dbt Cloud instance hostname. This will look like an `Access URL` found [here](https://docs.getdbt.com/docs/cloud/about-cloud/access-regions-ip-addresses). If you are using Multi-cell, do not include the `ACCOUNT_PREFIX` here        |
| `MULTICELL_ACCOUNT_PREFIX` | -                  | If you are using Multi-cell, set this to your `ACCOUNT_PREFIX`. If you are not using Multi-cell, do not set this environment variable. You can learn more [here](https://docs.getdbt.com/docs/cloud/about-cloud/access-regions-ip-addresses) |
| `DBT_TOKEN`                | -                  | Your personal access token or service token from dbt Platform. Note: a service token is required when using the Semantic Layer and this service token should have at least `Semantic Layer Only`, `Metadata Only`, and `Developer` permissions.                |
| `DBT_PROD_ENV_ID`          | -                  | Your dbt Cloud production environment ID|

#### Configuration for SQL Tools
| Name             | Description                               |
| ---------------- | ----------------------------------------- |
| `DBT_DEV_ENV_ID` | Your dbt Cloud development environment ID |
| `DBT_USER_ID`    | Your dbt Cloud user ID                    |
|                  |                                           |

#### Configuration for dbt CLI
| Name              | Description                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `DBT_PROJECT_DIR` | The path to where the repository of your dbt Project is hosted locally. This should look something like `/Users/firstnamelastname/reponame` |
| `DBT_PATH`        | The path to your dbt Core, dbt Cloud CLI, or dbt Fusion executable. You can find your dbt executable by running `which dbt`                 |
| `DBT_CLI_TIMEOUT` | Configure the number of seconds before your agent will timeout dbt CLI commands. Defaults to 10 seconds.                                    |

You can set any environment variable supported by your dbt executable like [for the ones supported in dbt Core](https://docs.getdbt.com/reference/global-configs/about-global-configs#available-flags).

We automatically set `DBT_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}'` so that the MCP server knows if no node is selected when running a dbt command.
You can overwrite it if needed but we believe that it provides a better experience when calling dbt from the MCP server, making sure that the tool is selecting valid nodes.

#### Disabling tools
We support disabling tool access on the local dbt-mcp.  

| Name                     | Default | Description                                                                     |
| ------------------------ | ------- | ------------------------------------------------------------------------------- |
| `DISABLE_DBT_CLI`        | `false` | Set this to `true` to disable dbt Core, dbt Cloud CLI, and dbt Fusion MCP tools |
| `DISABLE_SEMANTIC_LAYER` | `false` | Set this to `true` to disable dbt Semantic Layer MCP tools                    |
| `DISABLE_DISCOVERY`      | `false` | Set this to `true` to disable dbt Discovery API MCP tools                     |
| `DISABLE_SQL`         | `true`  | Set this to `false` to enable SQL MCP tools                                |
| `DISABLE_TOOLS`          | ""      | Set this to a list of tool names delimited by a `,` to disable certain tools    |

#### Connecting via MCP Clients

After going through the [Setup](#setup), you can use dbt-mcp with an MCP client.

Add this configuration to the respective client's config file. Be sure to replace the sections within `<>`:

```json
{
  "mcpServers": {
    "dbt-mcp": {
      "command": "uvx",
      "args": [
        "--env-file",
        "<path-to-.env-file>",
        "dbt-mcp"
      ]
    },
  }
}
```

`<path-to-.env-file>` is where you saved the `.env` file from the Setup step

<!-- we are going to yank a lot of the content out and link to the dbt mcp integrations-->