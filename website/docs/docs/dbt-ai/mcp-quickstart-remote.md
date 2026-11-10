---
title: "Подключение к удалённому серверу dbt MCP"
sidebar_label: "Подключение к удалённому серверу dbt MCP"
description: "Подключитесь к удалённому серверу dbt MCP по HTTP без необходимости установки."
id: "mcp-quickstart-remote"
availability: platform_login
---

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';
import MCPRemoteServerUrl from '/snippets/_mcp-remote-server-url.md';
import MCPRemoteOauthBetaCallout from '/snippets/_mcp-remote-oauth-beta-callout.md';
import MCPOauthPreflight from '/snippets/_mcp-oauth-preflight.md';
import MCPCustomConnectorOauth from '/snippets/_mcp-custom-connector-oauth.md';

Удалённый сервер MCP подключается к <Constant name="dbt_platform"/> по HTTP. Самостоятельно развёртывать сервер не требуется &mdash; вместо запуска `uvx dbt-mcp` вы настраиваете MCP-клиент, указав URL и заголовки.

<Lightbox src="/img/mcp/remote-dbt-mcp.jpg" title="Архитектура удалённого сервера dbt MCP" />

## Когда использовать удалённый MCP

Удалённый MCP подходит, если:

- Вы не хотите или не можете устанавливать программное обеспечение (`uvx`, dbt-mcp) на своём компьютере.
- Ваш сценарий предполагает _использование данных_: запрос метрик, изучение метаданных, просмотр зависимостей данных или выполнение SQL на платформе.
- Вам нужен доступ к API <Constant name="semantic_layer"/>, Administrative и Discovery без локального проекта dbt.

:::info Разработка в собственной среде требует самостоятельно развёрнутого MCP
Разработка в собственной среде и рабочие процессы с ИИ-агентами (например, выполнение команд dbt, таких как `dbt run` или `dbt build`, из ИИ-ассистента) требуют **самостоятельно развёрнутого** сервера MCP. Удалённый MCP не поддерживает локально установленные CLI <Constant name="core" /> или <Constant name="fusion" /> и доступ к локальным проектам. Для таких рабочих процессов воспользуйтесь инструкциями [Подключение к <Constant name="dbt_platform"/>](/docs/dbt-ai/mcp-quickstart-oauth) или [Запуск dbt в собственной среде](/docs/dbt-ai/mcp-quickstart-cli).
:::

## Настройка удалённого MCP

Выполните следующие действия, чтобы настроить удалённый сервер MCP.

### 1. Управление функциями ИИ (необязательно)
Функции ИИ включены по умолчанию. Администраторы могут [отключать или включать их в любое время](/docs/platform/manage-dbt-ai).

Удалённый MCP работает и без включённых функций ИИ. Они нужны только для `text_to_sql`: когда функции ИИ отключены, этот инструмент скрыт, а все остальные инструменты работают как обычно.

### 2. Получение учётных данных
Получите следующую информацию в <Constant name="dbt_platform"/>:

- **Хост <Constant name="dbt_platform"/>**: составьте URL в формате `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/` (например, `https://cloud.getdbt.com/api/ai/v1/mcp/`). Для аккаунтов multi-cell хост имеет формат `ACCOUNT_PREFIX.us1.dbt.com`. См. [Доступ, регионы и IP-адреса](/docs/platform/about-platform/access-regions-ip-addresses).
- **Идентификатор производственной среды**: находится в разделе **Orchestration** → **Environments** в <Constant name="dbt_platform"/>. Он используется в заголовке `x-dbt-prod-environment-id` (только при настройке с токеном). Пошаговые инструкции см. в разделе [Как найти идентификаторы dbt MCP](/docs/dbt-ai/mcp-find-ids#dbt-prod-env-id).
- **Токен** &mdash; PAT или сервисный токен с разрешениями Semantic Layer и Developer (только при настройке с токеном).
- **Если вы используете `execute_sql` с аутентификацией по токену:** необходимо использовать PAT, а также идентификатор среды разработки и идентификатор пользователя. Подробнее см. в разделе [Как найти идентификаторы dbt MCP](/docs/dbt-ai/mcp-find-ids). При использовании OAuth нужен только URL вашего MCP.

### 3. Выбор способа аутентификации: OAuth или токены

<SimpleTable>
| Тип | Информация | 
| ---- | ---- |
| **[OAuth (удалённый)](/docs/dbt-ai/setup-remote-mcp#oauth-remote-mcp)** |  Токены API в конфигурации клиента не требуются. Нужен MCP-клиент с поддержкой OAuth. Поддерживает `execute_sql`. <br /><br /> Доступен в общедоступной бета-версии для аккаунтов Starter, Enterprise и Enterprise+. |
| **По токену** | PAT или сервисный токен в заголовке `Authorization`. Работает с любым клиентом и требуется для общих конфигураций и CI. Для `execute_sql` необходимо использовать PAT (сервисные токены не подходят). |
</SimpleTable>

<MCPRemoteOauthBetaCallout />

:::tip Пользователи с доступом только для чтения
Пользователи с доступом только для чтения могут запрашивать метрики через удалённый MCP, используя общие [учётные данные для аналитики](/docs/platform/wizard-read-only-users#set-up-analytics-credentials), без необходимости входить в <Constant name="dbt_platform"/> для настройки собственных учётных данных хранилища. См. [Пользователи с доступом только для чтения и учётные данные хранилища](/docs/dbt-ai/setup-remote-mcp#read-only-users-and-warehouse-credentials).
:::

### 4. Получение URL MCP и идентификаторов

<MCPRemoteServerUrl />

В зависимости от способа аутентификации вам также могут понадобиться:

- **Идентификатор производственной среды**: находится в разделе **Orchestration** → **Environments** в <Constant name="dbt_platform"/>. Используется в заголовке `x-dbt-prod-environment-id` при настройке с токеном. Пошаговые инструкции см. в разделе [Как найти идентификаторы dbt MCP](/docs/dbt-ai/mcp-find-ids#dbt-prod-env-id).
- **Токен** &mdash; PAT или сервисный токен с разрешениями Semantic Layer и Developer (только при настройке с токеном).
- **Если вы используете `execute_sql` с аутентификацией по токену:** необходимо использовать PAT, а также идентификатор среды разработки и идентификатор пользователя. Подробнее см. в разделе [Как найти идентификаторы dbt MCP](/docs/dbt-ai/mcp-find-ids). При использовании OAuth нужен только URL вашего MCP.

<MCPCreditUsage />

### 5. Настройка MCP-клиента {#5-configure-your-mcp-client}

Настройте MCP-клиент, указав URL MCP из предыдущего шага. Если вы используете аутентификацию по токену, также добавьте необходимые заголовки.

<Tabs groupId="auth-method">
<TabItem value="oauth" label="OAuth">

_Доступно для аккаунтов Starter, Enterprise и Enterprise+_

<MCPOauthPreflight />

Настройте клиент, указав URL MCP из предыдущего шага. При первом подключении клиент откроет браузер для входа и предоставления согласия. Для использования `execute_sql` не нужны персональный токен доступа или дополнительные заголовки.

Некоторые инструменты (например, Claude Desktop) позволяют добавить dbt как пользовательский коннектор через интерфейс вместо редактирования файла конфигурации:

<MCPCustomConnectorOauth />

Для инструментов, настраиваемых с помощью JSON-файла, выберите вкладку, соответствующую вашему клиенту:

<Tabs groupId="client">
<TabItem value="claude" label="Claude Code">

Добавьте следующий код в `.mcp.json` в корне проекта:

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

Добавьте следующий код в `.cursor/mcp.json` (или воспользуйтесь прямой ссылкой Cursor в разделе [Интеграция Cursor с MCP](/docs/dbt-ai/integrate-mcp-cursor#set-up-with-remote-dbt-mcp-server)):

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
<TabItem value="vscode" label="VS Code">

Добавьте следующий код в `mcp.json` (выполните команду **MCP: Open Workspace Folder MCP Configuration** в палитре команд). VS Code использует ключ `servers`, а не `mcpServers`:

```json
{
  "servers": {
    "dbt": {
      "type": "http",
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
    }
  }
}
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="token" label="По токену">

Установите для параметра сервера `url` значение `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/` и добавьте необходимые заголовки:

- **Обязательные:** `Authorization` (значение `Token YOUR_TOKEN` или `Bearer YOUR_TOKEN`), `x-dbt-prod-environment-id`
- **Для `execute_sql` с аутентификацией по токену или инструментов <Constant name="fusion" />:** также добавьте `x-dbt-dev-environment-id` и `x-dbt-user-id`
- Используйте в заголовках числовые идентификаторы, а не полные URL, скопированные из браузера.

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
<TabItem value="vscode" label="VS Code">

VS Code использует ключ `servers`, а не `mcpServers`:

```json
{
  "servers": {
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
<TabItem value="gemini" label="Gemini">

Gemini использует ключ `httpUrl` вместо `url`:

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

- Полный список заголовков, примеры для Cursor и других клиентов, а также необязательные заголовки см. в разделе [Настройка удалённого MCP](/docs/dbt-ai/setup-remote-mcp).
- Самостоятельно развёрнутый MCP настраивается с помощью переменных окружения; дополнительную информацию см. в [Справочнике переменных окружения](/docs/dbt-ai/mcp-environment-variables).

После настройки MCP-клиента вы можете проверить подключение, задав ИИ-ассистенту вопрос о данных (например, _«Какие модели есть в моём проекте dbt?»_ или _«Какие метрики определены в моём Semantic Layer?»_). Если dbt MCP работает, ответ будет основан на ваших метаданных dbt.
