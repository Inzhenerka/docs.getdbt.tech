---
title: "Integrate Cursor with MCP"
sidebar_label: "Integrate Cursor with MCP"
description: "Guide to set up Cursor with dbt-mcp"
id: "integrate-cursorlaude-mcp"
---

# MCP Setup with Cursor

[Cursor](https://docs.cursor.com/context/model-context-protocol) is an AI-powered code editor, integrated with VSCode(Visual Studio Code). 

After setting up your local server, you can now connect the server to Cursor. 
After logging into Cursor Desktop, follow the following steps based on how dbt-mcp is hosted. We recommend using the linked templates here rather than the one hosted on the Cursor MCP integrations page. 

## Set up with Local dbt-mcp server

1. Click on the following button for access to the setup template

<a href="https://cursor.com/install-mcp?name=dbt&config=eyJjb21tYW5kIjoidXZ4IGRidC1tY3AiLCJlbnYiOnsiREJUX0hPU1QiOiJjbG91ZC5nZXRkYnQuY29tIiwiTVVMVElDRUxMX0FDQ09VTlRfUFJFRklYIjoib3B0aW9uYWwtYWNjb3VudC1wcmVmaXgiLCJEQlRfVE9LRU4iOiJ5b3VyLXNlcnZpY2UtdG9rZW4iLCJEQlRfUFJPRF9FTlZfSUQiOiJ5b3VyLXByb2R1Y3Rpb24tZW52aXJvbm1lbnQtaWQiLCJEQlRfREVWX0VOVl9JRCI6InlvdXItZGV2ZWxvcG1lbnQtZW52aXJvbm1lbnQtaWQiLCJEQlRfVVNFUl9JRCI6InlvdXItdXNlci1pZCIsIkRCVF9QUk9KRUNUX0RJUiI6Ii9wYXRoL3RvL3lvdXIvZGJ0L3Byb2plY3QiLCJEQlRfUEFUSCI6Ii9wYXRoL3RvL3lvdXIvZGJ0L2V4ZWN1dGFibGUiLCJESVNBQkxFX0RCVF9DTEkiOiJmYWxzZSIsIkRJU0FCTEVfU0VNQU5USUNfTEFZRVIiOiJmYWxzZSIsIkRJU0FCTEVfRElTQ09WRVJZIjoiZmFsc2UiLCJESVNBQkxFX1JFTU9URSI6ImZhbHNlIn19"><img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Add dbt MCP server to Cursor" height="32" /></a>

2. Configure your [environment variables](docs/docs/ai/dbt-mcp.md).
3. Save and now you have access to the dbt-mcp!


## Set up with Remote dbt-mcp server

1. Click on the following button for access to the setup template

<a href="https://cursor.com/install-mcp?name=dbt&config=JTdCJTIydXJsJTIyJTNBJTIyaHR0cHMlM0ElMkYlMkYlM0Nob3N0JTNFJTJGYXBpJTJGYWklMkZ2MSUyRm1jcCUyRiUyMiUyQyUyMmhlYWRlcnMlMjIlM0ElN0IlMjJBdXRob3JpemF0aW9uJTIyJTNBJTIydG9rZW4lMjAlM0N0b2tlbiUzRSUyMiUyQyUyMngtZGJ0LXByb2QtZW52aXJvbm1lbnQtaWQlMjIlM0ElMjIlM0Nwcm9kLWlkJTNFJTIyJTdEJTdE"><img src="https://cursor.com/deeplink/mcp-install-light.svg" alt="Add dbt MCP server to Cursor" height="32" /></a>

2. Provide your url/headers by updating the host, production environment id, and service token. 
3. Save and now you have access to the dbt-mcp!
