import MCPExample from '/snippets/_mcp-config-files.md';

<Expandable alt_header="Самостоятельно размещённый MCP с OAuth" lifecycle="self_service,managed,managed_plus">

Конфигурация для пользователей, которым нужна удобная аутентификация OAuth в <Constant name="dbt_platform" />. 


<MCPExample />

</Expandable>

<Expandable alt_header="Самостоятельно размещённый MCP (только CLI)">

Конфигурация для самостоятельного размещения для пользователей, которым нужно только выполнять команды dbt с <Constant name="core" /> или <Constant name="fusion" />

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

Как определить пути:

- **DBT_PROJECT_DIR**: полный путь к папке, содержащей файл `dbt_project.yml`
- **DBT_PATH**: чтобы определить путь, выполните `which dbt` в терминале (macOS/Linux) или `where dbt` (Windows) в PowerShell

</Expandable>

<Expandable alt_header="Самостоятельно размещённый MCP с .env">

Расширенная конфигурация для пользователей, которым нужны собственные [переменные окружения](/docs/dbt-ai/mcp-environment-variables). Поместите файл `.env` в _корневую папку проекта dbt_ (ту же папку, где находится `dbt_project.yml`) и укажите абсолютный путь с помощью `--env-file`.

Использование поля `env` (конфигурация в одном файле):

:::tip Идентификаторы — это целые числа, а не URL-адреса
`DBT_PROD_ENV_ID`, `DBT_DEV_ENV_ID` и `DBT_USER_ID` должны быть числовыми идентификаторами (например, `54321`), а не полными URL-адресами, скопированными из браузера. `DBT_HOST` принимает как `cloud.getdbt.com`, так и `https://cloud.getdbt.com`.
:::

Использование файла `.env` (укажите абсолютный путь к `.env` в корневой папке проекта dbt):

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "cloud.getdbt.com",
        "DBT_TOKEN": "your-token-here",
        "DBT_PROD_ENV_ID": "12345",
        "DBT_PROJECT_DIR": "/path/to/project",
        "DBT_PATH": "/path/to/dbt"
      }
    }
  }
}
```

Использование файла .env (альтернативный вариант):

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": [
        "--env-file",
        "/absolute/path/to/your-dbt-project/.env",
        "dbt-mcp"
      ]
    }
  }
}
```

</Expandable>
