<Tabs>

<TabItem value="platform-only" label="dbt platform only">

Этот вариант предназначен для пользователей, которым нужны только функции платформы dbt (Discovery API, Semantic Layer, управление заданиями) без самостоятельно размещаемых команд <Constant name="platform_cli" />.

Если вы используете только dbt platform, инструменты CLI автоматически отключаются. Значение поля `DBT_HOST` можно найти в информации о вашей учетной записи dbt platform в разделе **Access URLs**.


```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "YOUR-ACCESS-URL"
      }
    }
  }
}
```

**Примечание:** Замените `YOUR-ACCESS-URL` на имя хоста из вашего Access URL (например, `abc123.us1.dbt.com`). Допускаются оба варианта: `abc123.us1.dbt.com` и `https://abc123.us1.dbt.com`. Это позволяет использовать аутентификацию OAuth без необходимости самостоятельно размещать dbt.

</TabItem>

<TabItem value="platform-cli" label="dbt platform + CLI">

Этот вариант предназначен для пользователей, которым нужны как команды <Constant name="platform_cli" />, так и возможности платформы dbt (Discovery API, Semantic Layer, управление заданиями).

Для доступа к CLI обязательны поля `DBT_PROJECT_DIR` и `DBT_PATH`. Значение поля `DBT_HOST` можно найти в информации о вашей учетной записи dbt platform в разделе **Access URLs**.

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "YOUR-ACCESS-URL",
        "DBT_PROJECT_DIR": "/path/to/project",
        "DBT_PATH": "/path/to/dbt/executable"
      }
    }
  }
}
```

**Примечание:** Замените `YOUR-ACCESS-URL` именем хоста из вашего Access URL (например, `abc123.us1.dbt.com`). Допускаются оба варианта: `abc123.us1.dbt.com` и `https://abc123.us1.dbt.com`. Это позволяет использовать аутентификацию OAuth.

</TabItem>

</Tabs>
