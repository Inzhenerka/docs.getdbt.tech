<Tabs>

<TabItem value="dbt platform only">

Этот вариант предназначен для пользователей, которым нужны только возможности dbt platform (Discovery API, Semantic Layer, управление заданиями) без использования локальных CLI‑команд.

Если вы используете только dbt platform, инструменты CLI автоматически отключаются. Значение поля `DBT_HOST` можно найти в информации о вашей учетной записи dbt platform в разделе **Access URLs**.

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "https://<your-dbt-host-with-custom-subdomain>",
      }
    }
  }
}
```

**Примечание:** Замените `<your-dbt-host-with-custom-subdomain>` на ваш реальный хост (например, `abc123.us1.dbt.com`). Это включает аутентификацию OAuth без необходимости локальной установки dbt.

</TabItem>

<TabItem value="dbt platform + CLI">

Этот вариант предназначен для пользователей, которым нужны как команды dbt CLI, так и возможности dbt platform (Discovery API, Semantic Layer, управление заданиями).

Для доступа к CLI обязательны поля `DBT_PROJECT_DIR` и `DBT_PATH`. Значение поля `DBT_HOST` можно найти в информации о вашей учетной записи dbt platform в разделе **Access URLs**.

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

**Примечание:** Замените `<your-dbt-host-with-custom-subdomain>` на ваш реальный хост (например, `https://abc123.us1.dbt.com`). Это включает аутентификацию OAuth.

</TabItem>

</Tabs>
