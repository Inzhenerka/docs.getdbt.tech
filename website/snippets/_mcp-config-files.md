<Tabs>

<TabItem value="CLI (dbt Core or Fusion) only">

The CLI only option is for users who want to use dbt CLI commands with <Constant name="core" /> or<Constant name="fusion" /> (no <Constant name="dbt_platform" /> features)

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_PROJECT_DIR": "/path/to/your/dbt/project",
        "DBT_PATH": "/path/to/your/dbt/executable"
      }
    }
  }
}
```

#### Locating your paths

- **DBT_PROJECT_DIR**: Full path to your dbt project folder (the folder containing `dbt_project.yml`)
  - macOS/Linux example: `/Users/yourname/dbt-projects/my_project`
  - Windows example: `C:/Users/yourname/dbt-projects/my_project`
  
- **DBT_PATH**: Find your dbt executable by running:
  - macOS/Linux: Run `which dbt` in terminal
  - Windows: Run `where dbt` in Command Prompt or PowerShell
  - Example outputs:
    - macOS: `/opt/homebrew/bin/dbt`
    - Windows: `C:/Python39/Scripts/dbt.exe`

</TabItem>

<TabItem value="dbt platform + CLI">

This option is for users who want both dbt CLI commands and dbt platform features (Discovery API, Semantic Layer, job management).

The `DBT_PROJECT_DIR` and `DBT_PATH` fields are required for CLI access. You can find the `DBT_HOST` field value in your dbt platform account information under **Access URLs**.

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "https://<your-dbt-host-with-custom-subdomain>",
        "DBT_PROJECT_DIR": "/path/to/project",
        "DBT_PATH": "/path/to/dbt/executable"
      }
    }
  }
}
```

**Note:** Replace `<your-dbt-host-with-custom-subdomain>` with your actual host (for example, `https://abc123.us1.dbt.com`). This enables OAuth authentication.

</TabItem>

<TabItem value="dbt platform only">

This option is for users who only want dbt platform features (Discovery API, Semantic Layer, job management) without local CLI commands.

When you use only the dbt platform, the CLI tools are automatically disabled. You can find the `DBT_HOST` field value in your dbt platform account information under **Access URLs**.

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "https://<your-dbt-host-with-custom-subdomain>",
        "DISABLE_DBT_CLI": "true"
      }
    }
  }
}
```

**Note:** Replace `<your-dbt-host-with-custom-subdomain>` with your actual host (for example, `https://abc123.us1.dbt.com`). This enables OAuth authentication without requiring local dbt installation.

</TabItem>
</Tabs>
