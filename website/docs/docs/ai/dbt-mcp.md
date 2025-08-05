# dbt MCP Server
<!-- TODO: bring over summary of the blog into this section -->

The MCP (Model Context Protocol) server provides dbt tools for your AI data stack. Read [this](https://docs.getdbt.com/blog/introducing-dbt-mcp-server) blog to learn more. 
Join us in [Github](https://github.com/dbt-labs/dbt-mcp?tab=readme-ov-file) for any comments or questions and in [the community Slack](https://www.getdbt.com/community/join-the-community) in the `#tools-dbt-mcp` channel.

## Architecture
There are two ways to access the dbt-mcp server: locally hosted or remote via dbt Platform.

<!-- need to create -->

## Tools

## Supported
| Feature  | Local | Remote |
| --- | --- | --- |
| dbt CLI commands | ✅ | ❌ |
| Semantic Layer | ✅ | ✅ |
| Generate SQL | ✅ | ❌ |
| Execute SQL on dbt Platform | ✅ | ❌ |
| Metadata Discovery | ✅ | ✅ |
| Disable tools | ✅ | ❌ |


### dbt CLI commands

* `build` - Executes models, tests, snapshots, and seeds in dependency order
* `compile` - Generates executable SQL from models, tests, and analyses without running them
* `docs` - Generates documentation for the dbt project
* `ls` (list) - Lists resources in the dbt project, such as models and tests
* `parse` - Parses and validates the project’s files for syntax correctness
* `run` -  Executes models to materialize them in the database
* `test` - Runs tests to validate data and model integrity
* `show` - Runs a query against the data warehouse

> Allowing your client to utilize dbt commands through this MCP tooling could modify your data models, sources, and warehouse objects. Proceed only if you trust the client and understand the potential impact.


### Semantic Layer
To learn more about the dbt Semantic layer, click [here](/docs/use-dbt-semantic-layer/dbt-sl)

* `list_metrics` - Retrieves all defined metrics
* `get_dimensions` - Gets dimensions associated with specified metrics
* `get_entities` - Gets entities associated with specified metrics
* `query_metrics` - Queries metrics with optional grouping, ordering, filtering, and limiting


### Metadata Discovery
To learn more about the dbt Semantic layer, click [here](/docs/dbt-cloud-apis/discovery-api)

* `get_mart_models` - Gets all mart models
* `get_all_models` - Gets all models
* `get_model_details` - Gets details for a specific model
* `get_model_parents` - Gets parent nodes of a specific model
* `get_model_children` - Gets children models of a specific model

### SQL
* `text_to_sql` - Generate SQL from natural language requests
* `execute_sql` - Execute SQL on dbt Cloud's backend infrastructure with support for Semantic Layer SQL syntax. Note: using a PAT instead of a service token for `DBT_TOKEN` is required for this tool.

# Server Setup

There are two ways to setup dbt MCP, [local](#local) and [remote](#remote). We recommend using the locally hosted dbt-mcp for applications like locally hosted IDE Copilots and remote dbt-mcp for 
custom applications like AI Agents.

## Set up Local Server

1. [Install uv](https://docs.astral.sh/uv/getting-started/installation/)
2. Copy the [`.env.example` file](https://github.com/dbt-labs/dbt-mcp/blob/main/.env.example) locally under a file called `.env` and set it with the following environment variable configuration:

### Tools

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

## Set up Local Server

The remote server uses an HTTP connection and makes calls to dbt-mcp hosted on dbt Platform. 

1. Ensure that you have [AI Features](https://docs.getdbt.com/docs/cloud/enable-dbt-copilot) turned on.
2. Obtain the following information:

- **dbt Cloud host**: Use this to form the full URL. For example, replace `<host>` here: `https://<host>/api/ai/v1/mcp/`. It may look like: `https://cloud.getdbt.com/api/ai/v1/mcp/`.
- **Production environment ID**: This can be found on the `Orchestration` page of dbt Cloud. Use this to set a `x-dbt-prod-environment-id` header.
- **Service token**: To fully utilize Remote MCP, this needs to be configured for the dbt Semantic Layer by following [this](https://docs.getdbt.com/docs/use-dbt-semantic-layer/setup-sl#2-add-a-credential-and-create-service-tokens) guide and have `Developer` permissions. Add this as a `Authorization` header with a value like: `token <token>`. Be sure to replace `<token>` with the value of your token.

Then you can use these values to connect to the remote server with Streamable HTTP MCP transport. Use the example [here](https://github.com/dbt-labs/dbt-mcp/blob/76992ac51a905e9e0d2194774e7246ee288094b9/examples/remote_mcp/main.py) as a reference in Python. A similar implementation is possible with SDKs for many other languages.

You can also connect from MCP clients which support remote MCP with headers. For instance, you can connect Cursor to the remote server with the following configuration. Be sure to replace `<host>`, `<token>`, and `<prod-id>` with your information:

```
{
  "mcpServers": {
    "dbt": {
      "url": "https://<host>/api/ai/v1/mcp/",
      "headers": {
        "Authorization": "token <token>",
        "x-dbt-prod-environment-id": "<prod-id>",
      }
    }
  }
}
```

## Troubleshooting

- Some MCP clients may be unable to find `uvx` from the JSON config. If this happens, try finding the full path to `uvx` with `which uvx` on Unix systems and placing this full path in the JSON. For instance: `"command": "/the/full/path/to/uvx"`.