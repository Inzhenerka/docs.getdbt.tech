---
title: "Model Context Protocol"
sidebar_label: "Model Context Protocol"
description: "Learn about the dbt MCP server"
id: "about-mcp"
---

dbt is now accessible through a [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) (MCP) server, providing a standardized framework that enables users to seamlessly integrate AI applications with dbt and the underlying data warehouses. This ensures a consistent and efficient way to connect, access, and utilize data across various AI tools.

The MCP server has access to the dbt CLI, [API](/docs/dbt-cloud-apis/overview), the [Discovery API](/docs/dbt-cloud-apis/discovery-api), and [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). It provides access to private APIs, text-to-sql, and SQL execution.

Note that access to the Discovery and the Semantic Layer API is limited depending on your [plan type](https://www.getdbt.com/pricing).

For more information on MCP, have a look at [Get started with the Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction).


## Architecture
There are two ways to access the dbt-mcp server: locally hosted or remote hosted on dbt Platform.

<!--TODO need to create -->

## Available Tools

## Supported
| Tools | Local | Remote |
| --- | --- | --- |
| dbt CLI  | ✅ | ❌ |
| Semantic Layer | ✅ | ✅ |
| SQL  | ✅ | ❌ |
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

### SQL commands
* `text_to_sql` - Generate SQL from natural language requests
* `execute_sql` - Execute SQL on dbt Cloud's backend infrastructure with support for Semantic Layer SQL syntax. Note: using a PAT instead of a service token for `DBT_TOKEN` is required for this tool.


## Server Setup

There are two ways to setup dbt MCP, [local](#local) and [remote](#remote). We recommend using the locally hosted dbt-mcp for applications like locally hosted IDE Copilots and remote dbt-mcp for 
custom applications like AI Agents.

- [Local MCP Server Setup Guide](website/docs/docs/dbt-ai/setup-local-mcp.md)
- [Remote MCP Server Setup Guide](website/docs/docs/dbt-ai/setup-remote-mcp.md)

## MCP Integrations 
- [Claude](docs/docs/ai/integrate-mcp-claude)
- [Cursor](docs/docs/ai/integrate-mcp-cursor)
- [VSCode](/docs/docs/ai/integrate-mcp-vscode)

## Troubleshooting

- Some MCP clients may be unable to find `uvx` from the JSON config. If this happens, try finding the full path to `uvx` with `which uvx` on Unix systems and placing this full path in the JSON. For instance: `"command": "/the/full/path/to/uvx"`.

## Further reading
- Refer to our blog on [Introducing the dbt MCP Server](/blog/introducing-dbt-mcp-server#getting-started) for more information.
