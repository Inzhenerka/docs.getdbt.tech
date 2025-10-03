<Tabs>

<TabItem value="dbt platform + CLI">

The `DBT_PROJECT_DIR` and `DBT_PATH` fields are required.

The `DBT_HOST` field value can be found in your dbt platform account information under **Access URLs**.

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": [
        "dbt-mcp"
      ],
      "env": {
        "DBT_HOST": "https://<your-dbt-host-with-custom-subdomain>",
        "DBT_PROJECT_DIR": "/path/to/project",
        "DBT_PATH": "path/to/dbt/executable"
      }
    }
  }
}
```

</TabItem>
<TabItem value="dbt platform only" >

When using only the dbt platform, the CLI tools can be disabled. The `DBT_HOST` field value can be found in your dbt platform account information under **Access URLs**.


```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": [
        "dbt-mcp"
      ],
      "env": {
        "DBT_HOST": "https://<your-dbt-host-with-custom-subdomain>",
        "DISABLE_DBT_CLI": "true"
      }
    }
  }
}
```

</TabItem>
</Tabs>