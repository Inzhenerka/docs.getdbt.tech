---
title: "dbt AI"
sidebar_label: "dbt AI Overview"
description: "Overview of what dbt AI features there are and use cases"
id: "dbt-ai-landing-page"
---

# Overview

As AI becomes a more common part of data workflows, dbt provides tools to help teams integrate AI safely and effectively into their analytics stack. This page consolidates dbt's AI capabilities that enable AI interaction with dbt, supporting use cases like conversational access to data, agent-driven automation, and AI-assisted development.

dbt’s AI features include:

- **dbt** **Model Context Protocol (MCP) Server:** Exposes dbt commands, structured data and metadata from your dbt project in a machine-readable format. External systems—such as LLMs or agents, can use this metadata to access models, metrics, tests, and documentation with full project context.
- **dbt Copilot**: An AI-powered assistant that helps users author models, documentation, and semantic models directly in the dbt platform. dbt Copilot generates suggestions based on the structure and contents of your dbt project and can answer questions about your code using a built-in LLM.
- **Ecosystem integrations**: dbt provides ways to connect your project with external AI systems through APIs and standards like MCP. These integrations enable workflows such as natural language query generation, AI-driven validation, and semantic search.

## Common dbt AI use cases

### Conversational access to data

Use the dbt MCP Server to expose your dbt project to LLMs or chat interfaces. This allows users to query metadata, understand model lineage, and generate SQL or metrics with full awareness of your project structure.

Examples:

- Enabling users to ask natural language questions and receive trusted, governed responses
- Surfacing definitions, dependencies, and context in plain language
- Reducing risk of hallucinations by grounding responses in dbt metadata and semantic layer

### Agent-driven automation

Agents can use dbt metadata via MCP to automate common workflows such as model templating, test generation, or suggest performance improvements.

Examples:

- Generating staging or audit models based on existing patterns
- Creating tests, descriptions, or documentation from schema changes
- Recommending performance optimizations based on lineage or sql

### AI-assisted development

dbt Copilot helps users accelerate development by generating SQL, YAML, and documentation within the dbt platform interface. It uses knowledge of your project’s structure to make suggestions consistent with existing patterns. dbt Copilot also allows users to ask questions about their code and receive context-aware responses from a built-in LLM.

Examples:

- Drafting new models from prompts
- Writing or editing descriptions, tags, and tests
- Asking questions about model logic, inputs, outputs, or project structure to better understand unfamiliar code

These features can be adopted independently or in combination, depending on the maturity of your workflows and the needs of your team. Each is designed to integrate with dbt best practices and preserve trust, consistency, and transparency across your analytics workflows.