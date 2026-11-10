Для удалённого MCP с аутентификацией по токену задайте следующие заголовки в конфигурации MCP вашего клиента:

- **`Authorization`** _(обязательный)_ — `Token YOUR_DBT_ACCESS_TOKEN` или `Bearer YOUR_DBT_ACCESS_TOKEN`. Используйте [персональный токен доступа (PAT)](/docs/dbt-apis/user-tokens) или [сервисный токен](/docs/dbt-apis/service-tokens) с правами Developer для проекта, которому принадлежит среда, указанная в `x-dbt-prod-environment-id`. Назначьте сервисным токенам набор разрешений `Developer`. PAT наследуют разрешения своих создателей. Без прав Developer подключение завершается ошибкой `401`.
- **`x-dbt-prod-environment-id`** _(обязательный)_ — идентификатор вашей производственной среды <Constant name="dbt_platform" />. Пошаговые инструкции см. в разделе [Как найти идентификаторы dbt MCP](/docs/dbt-ai/mcp-find-ids#dbt-prod-env-id).
- **`x-dbt-dev-environment-id`** — обязателен для `execute_sql` и инструментов <Constant name="fusion" />. Пошаговые инструкции см. в разделе [Как найти идентификаторы dbt MCP](/docs/dbt-ai/mcp-find-ids#dbt-dev-env-id).
- **`x-dbt-user-id`** — обязателен для `execute_sql`. Подробности см. в разделе [Где найти мой идентификатор пользователя?](/faqs/Accounts/find-user-id).

:::warning Используйте числовые идентификаторы, а не полные URL-адреса
В заголовках `x-dbt-prod-environment-id`, `x-dbt-dev-environment-id` и `x-dbt-user-id` ожидаются числовые идентификаторы (например, `54321`), а не полные URL-адреса, скопированные из браузера. URL-адрес хоста MCP должен содержать `https://` независимо от того, задаёте ли вы его в поле `url` или передаёте как аргумент `mcp-remote`.
:::

При аутентификации по токену для `execute_sql` требуется персональный токен доступа (PAT). Сервисные токены не подойдут. Чтобы выполнять SQL без создания PAT, используйте подключение через [OAuth (удалённый MCP)](/docs/dbt-ai/setup-remote-mcp#oauth-remote-mcp). Полный список заголовков см. в разделе [Настройка удалённого MCP](/docs/dbt-ai/setup-remote-mcp#token-based-authentication).
