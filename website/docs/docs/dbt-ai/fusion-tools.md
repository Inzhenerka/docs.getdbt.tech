---
title: "dbt MCP tools for Fusion"
sidebar_label: "MCP Fusion tools"
description: "MCP tools available for the dbt Fusion engine on the CLI and cloud-based platform"
id: "mcp-fusion-tools"
---

dbt makes available Model Context Protocol (MCP) tools for <Constant name="fusion_engine"> via three platforms:
- The cloud-based dbt platform
- [Remote MCP server](/docs/dbt-ai/setup-remote-mcp) on the dbt platform
- The OSS `dbt-mcp` server running [locally on your host](/docs/dbt-ai/setup-local-mcp)

## dbt platform tools

The following <Constant name="tools"> tools are available to agents on the cloud-based dbt platform. It's up to the “agent developer” to select the toolset for their agent.
- compile_sql
- compile_project
- search_models
- search_sources
- search_tests
- get_model_metadata
- get_model_lineage
- get_column_lineage
- get_file_diagnostics
- get_workspace_diagnostics

## Remote MCP server

The dbt remote MCP exposes the following <Constant name="fusion"> tools:
- compile_sql
- get_model_lineage
- get_column_lineage

## Local dbt-mcp server

The following <Constant name="fusion"> tools are available in the  OSS `dbt-mcp` server, with access to a locally running <Constant name="fusion"> LSP when the VS Code extension is installed:
- compile_sql
- search_models
- search_sources
- search_tests
- get_model_metadata
- get_model_lineage
- get_column_lineage

