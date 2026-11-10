:::info
`login.dbt.com` в настоящее время доступен для мультитенантных аккаунтов с собственным доменом аккаунта (например, `abc123.us1.dbt.com`). Поддержка однотенантных аккаунтов появится в ближайшее время. Пока пользователи однотенантных аккаунтов могут входить напрямую через **Access URL** своего аккаунта (например, `MY_COMPANY.us1.dbt.com`).

Клиенты OAuth, такие как [<Constant name="platform_cli"/>](/docs/platform/dbt-cli-installation), [расширение dbt для VS Code](/docs/about-dbt-extension?version=2.0) и [dbt MCP](/docs/dbt-ai/about-mcp), пока не обновлены для использования `login.dbt.com` и продолжают проходить аутентификацию через [**Access URL**](/docs/platform/about-platform/access-regions-ip-addresses) своего аккаунта.

:::
