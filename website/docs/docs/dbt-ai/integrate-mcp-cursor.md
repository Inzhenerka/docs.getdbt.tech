---
title: "Integrate Cursor with dbt MCP"
sidebar_label: "Integrate Cursor with MCP"
description: "Guide to set up Cursor with dbt-mcp"
id: "integrate-mcp-cursor"
---

# Integrate Cursor with dbt MCP <Lifecycle status="beta" />

[Cursor](https://docs.cursor.com/context/model-context-protocol) is an AI-powered code editor, integrated with Microsoft Visual Studio Code (VS Code). 

After setting up your local server, you can now connect the server to Cursor. Log into Cursor and follow the steps depending on how you're hosting `dbt-mcp`. We recommend using the linked templates rather than the  Cursor MCP-hosted template on their integrations page. 

## Set up with Local dbt MCP server

1. Click [here](https://cursor.com/install-mcp?name=dbt&config=eyJjb21tYW5kIjoidXZ4IGRidC1tY3AiLCJlbnYiOnsiREJUX0hPU1QiOiJjbG91ZC5nZXRkYnQuY29tIiwiTVVMVElDRUxMX0FDQ09VTlRfUFJFRklYIjoib3B0aW9uYWwtYWNjb3VudC1wcmVmaXgiLCJEQlRfVE9LRU4iOiJ5b3VyLXNlcnZpY2UtdG9rZW4iLCJEQlRfUFJPRF9FTlZfSUQiOiJ5b3VyLXByb2R1Y3Rpb24tZW52aXJvbm1lbnQtaWQiLCJEQlRfREVWX0VOVl9JRCI6InlvdXItZGV2ZWxvcG1lbnQtZW52aXJvbm1lbnQtaWQiLCJEQlRfVVNFUl9JRCI6InlvdXItdXNlci1pZCIsIkRCVF9QUk9KRUNUX0RJUiI6Ii9wYXRoL3RvL3lvdXIvZGJ0L3Byb2plY3QiLCJEQlRfUEFUSCI6Ii9wYXRoL3RvL3lvdXIvZGJ0L2V4ZWN1dGFibGUiLCJESVNBQkxFX0RCVF9DTEkiOiJmYWxzZSIsIkRJU0FCTEVfU0VNQU5USUNfTEFZRVIiOiJmYWxzZSIsIkRJU0FCTEVfRElTQ09WRVJZIjoiZmFsc2UiLCJESVNBQkxFX1JFTU9URSI6ImZhbHNlIn19) for access to the setup template.
2. Configure your [environment variables](/docs/dbt-ai/about-mcp).
3. Save and now you have access to the dbt-mcp!


## Set up with Remote dbt MCP server

1. Click [here](https://cursor.com/install-mcp?name=dbt&config=JTdCJTIydXJsJTIyJTNBJTIyaHR0cHMlM0ElMkYlMkYlM0Nob3N0JTNFJTJGYXBpJTJGYWklMkZ2MSUyRm1jcCUyRiUyMiUyQyUyMmhlYWRlcnMlMjIlM0ElN0IlMjJBdXRob3JpemF0aW9uJTIyJTNBJTIydG9rZW4lMjAlM0N0b2tlbiUzRSUyMiUyQyUyMngtZGJ0LXByb2QtZW52aXJvbm1lbnQtaWQlMjIlM0ElMjIlM0Nwcm9kLWlkJTNFJTIyJTdEJTdE) to access the setup template.
2. Provide your url/headers by updating the host, production environment id, and service token. 
3. Save and now you have access to the dbt-mcp!
