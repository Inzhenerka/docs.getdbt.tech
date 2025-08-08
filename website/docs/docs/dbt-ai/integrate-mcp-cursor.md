---
title: "Integrate Cursor with dbt MCP"
sidebar_label: "Integrate Cursor with MCP"
description: "Guide to set up Cursor with dbt-mcp"
id: "integrate-mcp-cursor"
---

# Integrate Cursor with dbt MCP <Lifecycle status="beta" />

[Cursor](https://docs.cursor.com/context/model-context-protocol) is an AI-powered code editor, integrated with Microsoft Visual Studio Code (VS Code). 

After setting up your local server, you can now connect the server to Cursor. Log in to Cursor and follow the steps depending on how you're hosting dbt MCP

## Set up with Local dbt MCP server

1. Configure your environment variables in a .env file locally.
2. Click the `Add to Cursor` button below

cursor://anysphere.cursor-deeplink/mcp/install?name=dbt-mcp&config=eyJjb21tYW5kIjoidXZ4IC0tZW52LWZpbGUgPGVudi1maWxlLXBhdGg%252BIGRidC1tY3AifQ%3D%3D

3. Update inputs in the template. 
4. Save, and now you have access to the dbt-mcp!


## Set up with Remote dbt MCP server

1. Click the `Add to Cursor` button below

cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJ1cmwiOiJodHRwczovLzxob3N0Pi9hcGkvYWkvdjEvbWNwLyIsImhlYWRlcnMiOnsiQXV0aG9yaXphdGlvbiI6InRva2VuIDx0b2tlbj4iLCJ4LWRidC1wcm9kLWVudmlyb25tZW50LWlkIjoiPHByb2QtaWQ%252BIn19

2. Provide your URL/headers by updating the host, production environment ID, and service token in template. 
3. Save, and now you have access to the dbt-mcp!