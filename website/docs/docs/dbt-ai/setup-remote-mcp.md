---
title: "Set up remote MCP"
sidebar_label: "Set up remote MCP"
description: "Learn how to set up the remote dbt-mcp server"
id: "setup-remote-mcp"
availability:
  surface: platform
  access: login_required
---

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';
import MCPRemoteServerUrl from '/snippets/_mcp-remote-server-url.md';

Удалённый MCP-сервер использует HTTP-соединение и выполняет вызовы к dbt-mcp, размещённому на облачной платформе <Constant name="dbt_platform" />. Для использования удалённого MCP-сервера не требуется самостоятельное развёртывание; этот вариант идеально подходит для сценариев потребления данных.

<Lightbox src="/img/mcp/remote-dbt-mcp.jpg" title="Архитектура удалённого MCP-сервера dbt" />

## Когда использовать удалённый MCP {#when-to-use-remote-mcp}

Удалённый MCP-сервер — идеальный выбор, если:
- Вы не хотите или не можете устанавливать дополнительное программное обеспечение (`uvx`, `dbt-mcp`) в своей системе.
- Ваш основной сценарий использования — _получение данных_: запросы метрик, изучение метаданных, просмотр происхождения данных.
- Вам нужен доступ к API <Constant name="semantic_layer"/>, Administrative и Discovery без необходимости поддерживать локальный проект dbt.
- Вам не требуется выполнять команды CLI. Удалённый MCP не поддерживает выполнение команд dbt CLI в собственной инфраструктуре (`dbt run`, `dbt build`, `dbt test` и других). Если вам нужно выполнять команды dbt, используйте [MCP-сервер в собственной инфраструктуре](/docs/dbt-ai/setup-local-mcp).

<MCPCreditUsage />

## Выберите способ аутентификации

<SimpleTable>
| Если вам нужно... | Используйте... |
| --- | --- |
| Максимально быстрая первоначальная настройка, а ваш MCP-клиент поддерживает OAuth для HTTP-серверов (включая `execute_sql`) | **[OAuth (удалённый MCP)](#oauth-remote-mcp)** <br /> Доступно в рамках публичного бета-тестирования для учётных записей Starter, Enterprise и Enterprise+ |
| `execute_sql` с аутентификацией по токену, автоматизация, общая конфигурация или клиенты без поддержки OAuth | **Аутентификацию по токену** с [персональным токеном доступа (PAT)](/docs/dbt-apis/user-tokens) |
| Общая или командная конфигурация | **Сервисный токен** (аутентификация по токену) |
| CI или автоматизация | **Сервисный токен** (аутентификация по токену) |
</SimpleTable>

:::warning Сервисные токены не работают с `execute_sql`
Если вы подключаетесь с помощью токена, а не OAuth, `execute_sql` работает только с [персональным токеном доступа (PAT)](/docs/dbt-apis/user-tokens). Сервисные токены не подойдут. Чтобы выполнять SQL без создания PAT, используйте [OAuth (удалённый MCP)](#oauth-remote-mcp).
:::

## Разрешения для удалённого MCP {#permissions}

Удалённый MCP проверяет ваши права доступа при подключении, а затем при каждом вызове инструмента проверяет, разрешён ли вам доступ к целевому проекту, среде, заданию или запуску. Эти проверки применяются к OAuth, персональным токенам доступа (PAT) и сервисным токенам. Успешное подключение или отображение инструмента в клиенте не означает, что вы можете использовать этот инструмент для любого ресурса.

You don't need the `Developer` permission set just to connect. Ask your admin to grant the permissions needed for your workflow:

<SimpleTable>
| Workflow | Required access |
| --- | --- |
| Explore models and lineage, or generate SQL with `text_to_sql` | Metadata read access on the selected project. `text_to_sql` also requires AI features to be enabled. |
| Use Semantic Layer tools | Semantic Layer configuration read access on the selected project. |
| Run plain SQL with `execute_sql` | Semantic Layer configuration read access on the project, a development environment, and warehouse credentials. Connect with OAuth or a PAT. |
| Run SQL containing dbt Jinja, such as `ref()` or `source()` | The requirements for plain SQL, plus develop access. Production deferral also requires metadata read access. |
| Read or manage jobs and runs | The corresponding jobs or runs read or write permission for the target resource. Unfiltered account-wide listings require account-wide access. |
</SimpleTable>

For available permission sets, refer to [Enterprise permissions](/docs/platform/manage-access/enterprise-permissions) and [Service tokens](/docs/dbt-apis/service-tokens#permissions-for-service-account-tokens). PATs inherit the permissions of the user who created them. OAuth also restricts access to the scopes and projects you consented to.

Service tokens with metadata read access can use `text_to_sql` to generate SQL. They can't use `execute_sql` to run it.

## OAuth (remote MCP) <Lifecycle status="beta,self_service,managed,managed_plus" /> {#oauth-remote-mcp}

OAuth lets you connect to the remote MCP server without copying API tokens into your MCP client, when your client supports OAuth for HTTP-based MCP servers.

### Prerequisites

- Starter, Enterprise, or Enterprise+ account
- An MCP client that supports OAuth for remote (HTTP) MCP servers.
- Your **MCP URL** from **Account settings** &rarr; **Access URLs** &rarr; **MCP Endpoint URL** in <Constant name="dbt_platform"/>. Check out the next section [MCP URL](#mcp-url) for more information.

AI features are enabled by default. Admins can [turn them off or back on anytime](/docs/platform/manage-dbt-ai). Turning them off doesn't disable remote MCP &mdash; it only hides the [`text_to_sql` tool](/docs/dbt-ai/mcp-available-tools#tools-that-require-ai-features).

### MCP URL {#mcp-url}

<MCPRemoteServerUrl />

### How it works

1. In your MCP client, navigate to the connector or integrations settings and add your MCP URL (refer to [MCP URL](#mcp-url)). For example, if you used Claude or ChatGPT, you would go to:
   - **Claude (web)**: **Customize** &rarr; **Connectors** &rarr; **+** &rarr; **Add custom connector**
   - **ChatGPT**: **Settings** &rarr; **Apps** &rarr; **Create App**
   - For Claude Desktop and Claude Code, refer to [Integrate Claude with dbt MCP](/docs/dbt-ai/integrate-mcp-claude).
2. When prompted in your MCP client, complete sign-in in the browser and approve the requested scopes on the consent screen.
3. Return to your MCP client; subsequent requests use the OAuth session according to your client's behavior.

You can use `execute_sql` with OAuth. Add your MCP URL to your client and sign in when your MCP client prompts you. You don't need a personal access token or extra headers.

### Register your MCP client

OAuth requires every client to be registered with <Constant name="dbt_platform" />. There are two paths:

- **Dynamic registration (default)** &mdash; Clients that implement [Dynamic Client Registration (RFC 7591)](/docs/platform/manage-access/connect-apps-oauth#dynamic-registration) self-register the first time a user connects. No admin action required. Most modern MCP clients (such as Claude Desktop, Claude Code, Cursor, and VS Code) support this.
- **Manual registration** &mdash; For clients that don't support dynamic registration, an account admin registers the client in **Account settings → Integrations → App integrations**. Manually registered clients use [PKCE (RFC 7636)](/docs/platform/manage-access/connect-apps-oauth#manual-registration) instead of a client secret. Refer to [Manual registration](/docs/platform/manage-access/connect-apps-oauth#manual-registration) for the admin walkthrough.

Both types appear in **App integrations** in <Constant name="dbt_platform" />, where admins can review and audit each connected client.

### Scopes you'll consent to

The first time you connect, dbt shows a consent screen listing the scopes (the specific permissions the client is allowed to use) the MCP client is requesting. Scopes act as a **filter on your existing permissions** &mdash; they don't grant new access. You can also choose whether the client gets access to all projects or only selected projects.

For the full list of scopes and what each one allows, refer to [Scopes and consent](/docs/platform/manage-access/connect-apps-oauth#scopes-and-consent). For sessions, refresh tokens, revoking access, and audit logging, refer to [Connect apps with OAuth](/docs/platform/manage-access/connect-apps-oauth).

### Read-only users and warehouse credentials {#read-only-users-and-warehouse-credentials}

Read-only users need warehouse credentials to run queries, such as `query_metrics`, through remote MCP. They have two options:

- **Analytics credential (recommended):** An admin sets up one shared [analytics credential](/docs/platform/wizard-read-only-users#set-up-analytics-credentials) on the connection. Read-only users who haven't set up personal credentials use it automatically, so they never need to log in to <Constant name="dbt_platform" />.
- **Personal credentials:** Users with the [Analyst read](/docs/platform/manage-access/enterprise-permissions#analyst-read) permission set can add their own on **Your profile** &rarr; **Credentials**. If they have personal credentials, those take priority.

If a user has neither, the query fails and asks them to set up credentials or contact an admin.

### Limitations

- Remote MCP doesn't support self-hosted dbt CLI commands (like `dbt run`, `dbt build`, `dbt test`, and more) or local project access; use the [self-hosted MCP server](/docs/dbt-ai/setup-local-mcp) for those workflows.

For client-specific steps, refer to [Integrate Claude with MCP](/docs/dbt-ai/integrate-mcp-claude), [Integrate Cursor with MCP](/docs/dbt-ai/integrate-mcp-cursor), [Integrate Snowflake Cortex with MCP](/docs/dbt-ai/integrate-mcp-snowflake-cortex), or [Integrate VS Code with MCP](/docs/dbt-ai/integrate-mcp-vscode).

## Token-based authentication {#token-based-authentication}

Token-based authentication lets you connect to the remote MCP server without OAuth by passing a PAT or service token in your MCP client config. Use it when your client doesn't support OAuth for HTTP-based MCP servers or when you need a shared or CI setup. To use `execute_sql` with token-based authentication, use a PAT.

Each tool call must satisfy the [permissions for its target](#permissions). Token-based connections can show tools that your token can't use; those calls fail individually. OAuth can also filter the tool list based on its granted permissions.

### Setup instructions

AI features are enabled by default. Admins can [turn them off or back on anytime](/docs/platform/manage-dbt-ai). Turning them off doesn't disable remote MCP &mdash; it only hides the [`text_to_sql` tool](/docs/dbt-ai/mcp-available-tools#tools-that-require-ai-features).

1. Obtain the following information from <Constant name="dbt_platform"/>:
  - **<Constant name="dbt_platform"/> host**: Use this to form the full URL. For example, replace `YOUR_DBT_HOST_URL` here: `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/`. It may look like: `https://cloud.getdbt.com/api/ai/v1/mcp/`. If you have a multi-cell account, the host URL will be in the `ACCOUNT_PREFIX.us1.dbt.com` format. For more information, refer to [Access, Regions, & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses).
  - **Production environment ID**: From **Orchestration** → **Environments** in <Constant name="dbt_platform"/>. Use this to set an `x-dbt-prod-environment-id` header. Refer to [How to find your dbt MCP IDs](/docs/dbt-ai/mcp-find-ids#dbt-prod-env-id) for step-by-step instructions.
  - **Token**: Generate either a personal access token (PAT) or a service token with the [permissions for the tools and resources you need](#permissions). For a service token, assign the appropriate permission sets. PATs inherit the permissions of the user who created them.
  - If you plan to use `execute_sql`, you must use a [Personal Access Token (PAT)](/docs/dbt-apis/user-tokens). Service tokens _do not_ work for this tool. For other tools that require `x-dbt-user-id`, a PAT is also required.

2. For the remote MCP, you will pass on headers through the JSON blob to configure required fields:

  #### Configuration for APIs and SQL tools
  
  <SimpleTable>
  | Header | Required | Description |
  | --- | --- | --- |
| Authorization | Да | Ваш [персональный токен доступа (PAT)](/docs/dbt-apis/user-tokens) или [сервисный токен](/docs/dbt-apis/service-tokens) из <Constant name="dbt_platform"/> с [необходимыми разрешениями](#permissions). При использовании <Constant name="semantic_layer" /> рекомендуем использовать PAT. <br /><br /> Значение должно быть в формате `Token YOUR_DBT_ACCESS_TOKEN` или `Bearer YOUR_DBT_ACCESS_TOKEN`, где `YOUR_DBT_ACCESS_TOKEN` необходимо заменить вашим фактическим токеном.  |
  | x-dbt-prod-environment-id | Да | Идентификатор вашей производственной среды в <Constant name="dbt_platform"/>. Пошаговые инструкции см. в разделе [Как найти идентификаторы dbt MCP](/docs/dbt-ai/mcp-find-ids#dbt-prod-env-id). |
  </SimpleTable>
    
  #### Дополнительная настройка для инструментов SQL
  <SimpleTable>
  | Заголовок | Обязательный | Описание |
  | --- | --- | --- |
  | x-dbt-dev-environment-id | Обязателен для `execute_sql` | Идентификатор вашей среды разработки в <Constant name="dbt_platform"/>. Пошаговые инструкции см. в разделе [Как найти идентификаторы dbt MCP](/docs/dbt-ai/mcp-find-ids#dbt-dev-env-id). |
  | x-dbt-user-id | Обязателен для `execute_sql` | Идентификатор вашего пользователя в <Constant name="dbt_platform"/>. Подробнее см. в разделе [Где найти идентификатор пользователя?](/faqs/Accounts/find-user-id). |
  </SimpleTable>
    
  Используйте положительные числовые идентификаторы в заголовках проекта и среды. Заголовки среды разработки и производственной среды должны указывать на среды соответствующего типа в одном и том же проекте. Если инструмент принимает аргумент проекта или среды, он должен соответствовать настроенному целевому объекту. `list_jobs` сохраняет прежнее поведение: явно заданный `project_id` переопределяет настроенный фильтр среды.

  #### Дополнительная настройка для инструментов dbt v2

By default, <Constant name="fusion"/> tools use the environment you set in `x-dbt-prod-environment-id` for model and table metadata.
  <SimpleTable>
  | Header | Required | Description |
  | --- | --- | --- |
| x-dbt-dev-environment-id | Обязательный | ID вашей среды разработки <Constant name="dbt_platform"/>. Пошаговые инструкции см. в разделе [Как найти ID для dbt MCP](/docs/dbt-ai/mcp-find-ids#dbt-dev-env-id). |
  | x-dbt-user-id | Обязательный | Ваш ID пользователя <Constant name="dbt_platform"/>. Подробнее см. в разделе [Где найти мой ID пользователя?](/faqs/Accounts/find-user-id). |
  | x-dbt-fusion-disable-defer | Необязательный | По умолчанию: `false`. Если установлено значение `true`, инструменты <Constant name="fusion"/> не будут использовать отложенные ссылки на производственную среду, а вместо этого будут использовать модели и метаданные таблиц из среды разработки (`x-dbt-dev-environment-id`). |
 </SimpleTable>

  #### Настройка отключения инструментов
  <SimpleTable>
  | Заголовок | Обязательность  | Описание |
  | --- | --- | --- |
  | x-dbt-disable-tools | Необязательный | Список инструментов для отключения, разделённых запятыми. Например: `get_all_models,text_to_sql,list_entities` |
  | x-dbt-disable-toolsets | Необязательный | Список наборов инструментов для отключения, разделённых запятыми. Например: `semantic_layer,sql,discovery` |
  </SimpleTable>
3. Определив, какие заголовки вам нужны, вы можете воспользоваться [примерами](https://github.com/dbt-labs/dbt-mcp/tree/main/examples), чтобы создать собственного агента. 

## Примеры

Протокол MCP не зависит от языка программирования и фреймворка, поэтому используйте любые средства, которые помогают вам создавать агентов. Если вы используете [OAuth (удалённый MCP)](#oauth-remote-mcp) в бета-версии, вам нужен только URL вашего MCP. Если вы используете аутентификацию на основе токенов, добавьте заголовки из примеров ниже. Конфигурация зависит от клиента — выберите свой инструмент на следующих вкладках и замените значения-заполнители своими:


<Tabs groupId="auth-method">
<TabItem value="oauth" label="OAuth">

<Tabs groupId="client">
<TabItem value="claude" label="Claude Code">

```json
{
  "mcpServers": {
    "dbt": {
      "type": "http",
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
    }
  }
}
```

</TabItem>
<TabItem value="cursor" label="Cursor">

```json
{
  "mcpServers": {
    "dbt": {
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
    }
  }
}
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="token" label="Token-based">

<Tabs groupId="client">
<TabItem value="claude" label="Claude Code">

```json
{
  "mcpServers": {
    "dbt": {
      "type": "http",
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
      "headers": {
        "Authorization": "Token YOUR_DBT_ACCESS_TOKEN",
        "x-dbt-prod-environment-id": "DBT_PROD_ENV_ID",
        "x-dbt-user-id": "DBT_USER_ID",
        "x-dbt-dev-environment-id": "DBT_DEV_ENV_ID"
      }
    }
  }
}
```

</TabItem>
<TabItem value="cursor" label="Cursor">

```json
{
  "mcpServers": {
    "dbt": {
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
      "headers": {
        "Authorization": "Token YOUR_DBT_ACCESS_TOKEN",
        "x-dbt-prod-environment-id": "DBT_PROD_ENV_ID",
        "x-dbt-user-id": "DBT_USER_ID",
        "x-dbt-dev-environment-id": "DBT_DEV_ENV_ID"
      }
    }
  }
}
```

</TabItem>
<TabItem value="gemini" label="Gemini">

```json
{
  "mcpServers": {
    "dbt": {
      "httpUrl": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
      "headers": {
        "Authorization": "Token YOUR_DBT_ACCESS_TOKEN",
        "x-dbt-prod-environment-id": "DBT_PROD_ENV_ID",
        "x-dbt-user-id": "DBT_USER_ID",
        "x-dbt-dev-environment-id": "DBT_DEV_ENV_ID"
      }
    }
  }
}
```

</TabItem>
</Tabs>

</TabItem>
</Tabs>


:::warning Use numeric IDs, not full URLs
Header values like `x-dbt-prod-environment-id` and `x-dbt-user-id` expect numeric IDs, not full URLs. The host in the `url` field should include `https://`, but ID headers must be integers only:

```bash
# ✅ Correct
"url": "https://cloud.getdbt.com/api/ai/v1/mcp"
"x-dbt-prod-environment-id": "54321"
"x-dbt-user-id": "123"

# ❌ Wrong — don't paste full URLs into ID headers
"x-dbt-prod-environment-id": "https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321"
"x-dbt-user-id": "https://cloud.getdbt.com/settings/profile"
```
:::

For other MCP clients (Codex, Windsurf, and so on), refer to your client's MCP configuration docs for the correct key format.

For self-hosted MCP, use environment variables to configure your setup; refer to the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables).

## Related docs

Step-by-step client setup (including Cursor, VS Code, and Claude) is in:

- [Integrate Cursor with MCP](/docs/dbt-ai/integrate-mcp-cursor)
- [Integrate VS Code with MCP](/docs/dbt-ai/integrate-mcp-vscode)
- [Integrate Claude with MCP](/docs/dbt-ai/integrate-mcp-claude)
- [Integrate Snowflake Cortex with MCP](/docs/dbt-ai/integrate-mcp-snowflake-cortex)
