**Перед подключением**

- Ваш MCP-клиент должен поддерживать OAuth для MCP-серверов, работающих по HTTP. Если такой поддержки нет, используйте [аутентификацию на основе токенов](/docs/dbt-ai/setup-remote-mcp#token-based-authentication).
- При первом подключении клиент открывает браузер для входа в систему. Затем dbt показывает экран согласия с запрашиваемыми областями доступа (конкретными разрешениями, которые клиенту будет позволено использовать) &mdash; описание каждой области доступа см. в разделе [Области доступа и согласие](/docs/platform/manage-access/connect-apps-oauth#scopes-and-consent).
- Большинство современных MCP-клиентов регистрируются самостоятельно при первом подключении с помощью [динамической регистрации (RFC 7591)](/docs/platform/manage-access/connect-apps-oauth#dynamic-registration). Клиенты, которые её не поддерживают, администратор должен зарегистрировать в разделе **Account settings → Integrations → App integrations**. См. раздел [Ручная регистрация](/docs/platform/manage-access/connect-apps-oauth#manual-registration).

Полное описание процесса, сеансов и ограничений см. в разделе [OAuth (удалённый MCP)](/docs/dbt-ai/setup-remote-mcp#oauth-remote-mcp).
