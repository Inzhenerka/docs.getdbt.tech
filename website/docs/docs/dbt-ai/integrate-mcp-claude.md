---
title: "Интеграция Claude с dbt MCP"
sidebar_label: "Интеграция Claude с MCP"
description: "Руководство по настройке Claude с dbt-mcp"
id: "integrate-mcp-claude"
availability: all_users
---

import McpClaudeLocalJsonExpandables from '/snippets/_mcp-claude-local-json-expandables.md';
import StaticSubdomainRequired from '/snippets/_static-subdomain-required.md';
import MCPRemoteOauthBetaCallout from '/snippets/_mcp-remote-oauth-beta-callout.md';
import MCPRemoteServerUrl from '/snippets/_mcp-remote-server-url.md';
import MCPRemoteTokenHeaders from '/snippets/_mcp-remote-token-headers.md';
import MCPOauthPreflight from '/snippets/_mcp-oauth-preflight.md';
import MCPCustomConnectorOauth from '/snippets/_mcp-custom-connector-oauth.md';
import MCPRemoteReadOnlyCredentials from '/snippets/_mcp-remote-read-only-credentials.md';

Claude — это ИИ-ассистент от Anthropic с двумя основными интерфейсами:
- [Claude Desktop](#claude-desktop): графический интерфейс с поддержкой MCP для доступа к файлам и выполнения команд, а также базовыми возможностями работы с кодом.
- [Claude Code](#claude-code): инструмент для разработки в терминале или IDE.

Оба интерфейса могут подключаться к одному из следующих серверов:
- Локально развернутый сервер dbt MCP (работает на вашем компьютере, поддерживает команды CLI, например `dbt run`) 
- Удаленный сервер dbt MCP (HTTP, ориентирован на использование данных). Для OAuth локальная установка не требуется. Аутентификация на основе токена в Claude Desktop использует прокси `mcp-remote` и требует Node.js.

## Предварительные требования

- Вы используете Claude для работы с ИИ или ИИ-агентами
- Для OAuth (с локально развернутым или удаленным сервером) используйте свой [URL доступа со статическим поддоменом](/docs/platform/about-platform/access-regions-ip-addresses).
  - OAuth для удаленного сервера MCP доступен для учетных записей Starter, Enterprise и Enterprise+.
- <MCPRemoteReadOnlyCredentials />

<StaticSubdomainRequired />

## Claude Desktop

[Claude Desktop](https://claude.ai/download) считывает настройки серверов MCP из `claude_desktop_config.json`. Откройте этот файл через **Settings &rarr; Developer &rarr; Edit Config**.

### Настройка подключения к локально развернутому серверу dbt MCP {#desktop-local}

Для быстрой первоначальной установки можно скачать готовый файл `.mcpb`; для более гибкой настройки отредактируйте JSON напрямую.

:::tip
Клонировать репозиторий dbt-mcp не нужно &mdash; для локального развертывания установите [uv](https://docs.astral.sh/uv/getting-started/installation/) и выполните `uvx dbt-mcp` (или воспользуйтесь конфигурациями, приведенными далее на этой странице). Клонируйте репозиторий только в том случае, если хотите [внести вклад в разработку dbt MCP](https://github.com/dbt-labs/dbt-mcp/issues).
:::

#### Быстрая установка с помощью файла .mcpb

1. Перейдите на страницу [последнего релиза dbt MCP](https://github.com/dbt-labs/dbt-mcp/releases/latest) и скачайте файл `dbt-mcp.mcpb`.
2. Дважды щелкните скачанный файл, чтобы открыть его в Claude Desktop.
3. Настройте **<Constant name="dbt_platform"/> Host**. Нужное значение можно найти в вашей учетной записи <Constant name="dbt_platform" />: перейдите в **Account settings** и скопируйте **Access URL**.
4. Включите сервер в Claude Desktop.
5. Задайте Claude вопрос, связанный с данными, и посмотрите, как работает dbt MCP!

#### Расширенная настройка Claude Desktop {#advanced-config-with-claude-desktop}

Используйте расширенную настройку, если хотите самостоятельно определить сервер dbt MCP в конфигурационном файле Claude &mdash; том же JSON-файле, в котором Claude хранит настройки всех серверов MCP в разделе `mcpServers`, с такими полями, как `command`, `args` и `env`. Базовый принцип описан в [примере установки MCP](https://modelcontextprotocol.io/quickstart/user#installing-the-filesystem-server).

Чтобы открыть конфигурационный файл и добавить или заменить запись сервера dbt MCP:
1. В Claude перейдите в **Settings…**
2. В окне настроек выберите вкладку **Developer**.
3. Нажмите **Edit Config** и откройте файл в текстовом редакторе.
4. Добавьте конфигурацию сервера в раздел `mcpServers`. Выберите вариант, подходящий для вашего сценария использования:

    <McpClaudeLocalJsonExpandables />

5. Сохраните файл и перезапустите Claude Desktop. В правом нижнем углу поля ввода сообщения появится индикатор MCP-сервера.

Дополнительные параметры конфигурации (переменные окружения, сервисные токены, настройки доступа к инструментам) описаны в разделе [Настройка самостоятельно размещённого MCP-сервера](/docs/dbt-ai/setup-local-mcp).

### Подключение к удалённому MCP-серверу dbt {#desktop-remote}

Удалённый MCP-сервер dbt работает в <Constant name="dbt_platform" />. Для OAuth Claude Desktop подключается по HTTP через пользовательский коннектор. Для аутентификации по токену используйте прокси `mcp-remote`, описанный на вкладке для токенов. Claude Desktop не принимает `"type": "http"` в `claude_desktop_config.json`.

<MCPRemoteOauthBetaCallout />

Сначала получите свой MCP URL. Он понадобится для обоих способов аутентификации:

<MCPRemoteServerUrl />

Затем перейдите на вкладку, соответствующую вашему способу аутентификации:

<Tabs>
<TabItem value="oauth" label="OAuth (remote)">

_OAuth для удалённого MCP доступен в публичной бета-версии для аккаунтов Starter, Enterprise и Enterprise+._

<MCPOauthPreflight />

Для использования OAuth добавьте dbt в качестве пользовательского коннектора в настройках Claude Desktop. Редактировать `claude_desktop_config.json` не требуется.

<MCPCustomConnectorOauth />

</TabItem>
<TabItem value="token" label="Token-based">

Используйте аутентификацию на основе токенов, если ваш клиент пока не поддерживает OAuth для HTTP-серверов MCP или если вам нужна общая конфигурация либо конфигурация для CI.

:::caution `"type": "http"` недопустим в Claude Desktop
Claude Desktop не поддерживает `"type": "http"` в `claude_desktop_config.json`. Если вставить этот блок (формат, который работает в `.mcp.json` в [Claude Code](#code-remote)), Claude Desktop пропустит сервер и покажет сообщение вроде «Не удалось загрузить некоторые серверы MCP».

Вместо этого используйте конфигурацию прокси `mcp-remote` из шага 2. 
:::

Для подключения к удалённому серверу MCP с аутентификацией на основе токенов в Claude Desktop требуется [Node.js](https://nodejs.org/), чтобы `npx` мог запускать `mcp-remote`.

1. В Claude Desktop перейдите в **Settings &rarr; Developer &rarr; Edit Config**, чтобы открыть `claude_desktop_config.json`.
2. Добавьте запись `dbt-remote` в `mcpServers`:

    ```json
    {
      "mcpServers": {
        "dbt-remote": {
          "command": "npx",
          "args": [
            "mcp-remote",
            "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
            "--header",
            "Authorization: Token YOUR_DBT_ACCESS_TOKEN",
            "--header",
            "x-dbt-prod-environment-id: DBT_PROD_ENV_ID"
          ]
        }
      }
    }
    ```

    Замените `YOUR_DBT_HOST_URL` именем вашего хоста (например, `abc123.us1.dbt.com`), а заполнители токена и идентификатора среды — своими значениями. Чтобы передать необязательные заголовки, такие как `x-dbt-user-id` или `x-dbt-dev-environment-id`, добавьте в массив `args` дополнительные пары `"--header"` и `"Header-Name: value"`.

    <MCPRemoteTokenHeaders />

    :::tip Полный путь к `npx`
    Если Claude Desktop показывает `Server disconnected` или не может найти `npx`, задайте для `"command"` полный путь, полученный с помощью `which npx` (macOS или Linux) или `where npx` (Windows), например `"command": "/opt/homebrew/bin/npx"`.
    :::

3. Сохраните файл и перезапустите Claude Desktop. В разделе **Settings &rarr; Developer** убедитесь, что `dbt-remote` запущен. Задайте Claude вопрос о данных, чтобы убедиться, что сервер подключён.

</TabItem>
</Tabs>

## Claude Code

[Claude Code](https://www.anthropic.com/claude-code) считывает конфигурацию MCP-серверов из `.mcp.json` в корне проекта (корне репозитория вашей рабочей области). Для самостоятельно размещённых серверов можно использовать ту же структуру `command` / `args` / `env`, что и в других клиентах. Для удалённой аутентификации на основе токенов Claude Code поддерживает `"type": "http"` в `.mcp.json`, в отличие от Claude Desktop.

### Настройка с самостоятельно размещённым сервером dbt MCP {#code-local}

:::tip
Клонировать репозиторий dbt-mcp не нужно &mdash; для самостоятельного размещения установите [uv](https://docs.astral.sh/uv/getting-started/installation/) и запустите `uvx dbt-mcp` (или используйте конфигурации ниже на этой странице). Клонируйте репозиторий, только если хотите [внести вклад в dbt MCP](https://github.com/dbt-labs/dbt-mcp/issues).
:::

1. Следуйте инструкциям в разделе [Настройка самостоятельно размещённого MCP](/docs/dbt-ai/setup-local-mcp), чтобы выбрать способ аутентификации:
   - OAuth с <Constant name="dbt_platform" />
   - [Только CLI](/docs/dbt-ai/setup-local-mcp#cli-only)
   - [Переменные окружения](/docs/dbt-ai/setup-local-mcp#environment-variable-configuration) (включая файл `.env`, подключаемый через `--env-file`)
2. Создайте `.mcp.json` в корне проекта и добавьте запись `dbt` в ключ `mcpServers` верхнего уровня. Выберите вариант, подходящий для вашего сценария использования:

    <McpClaudeLocalJsonExpandables anchorSuffix="-claude-code" />

:::note О команде `claude mcp add`
CLI Claude Code позволяет регистрировать MCP-серверы с помощью `claude mcp add`, но обычно записывает их в конфигурацию уровня пользователя (`~/.claude.json`), а не в `.mcp.json` проекта. Для dbt MCP мы рекомендуем сохранять `.mcp.json` в вашем репозитории, чтобы конфигурация действовала на уровне проекта и ею было проще делиться.
:::

### Настройка с удалённым сервером dbt MCP {#code-remote}

Claude Code может подключаться к удалённому серверу dbt MCP по HTTP с помощью `"type": "http"` в `.mcp.json`. Эта структура конфигурации HTTP предназначена для Claude Code (и аналогичных клиентов), а не для `claude_desktop_config.json` в Claude Desktop.

<MCPRemoteOauthBetaCallout />

1. Откройте `.mcp.json` в корне проекта (создайте его, если он ещё не существует).
2. Получите URL вашего MCP-сервера:

    <MCPRemoteServerUrl anchorId="construct-mcp-url-claude-code" />

3. Добавьте запись `dbt` в `.mcp.json`, используя вкладку, соответствующую вашему способу аутентификации:

    <Tabs>
    <TabItem value="oauth" label="OAuth (удалённый сервер)">

    _OAuth для удалённого MCP доступен в публичной бета-версии для учётных записей Starter, Enterprise и Enterprise+._

    <MCPOauthPreflight />

    Добавьте следующую конфигурацию в `.mcp.json` в корне проекта. При первом подключении Claude Code откроет браузер для входа и предоставления разрешений.

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

    Замените `YOUR_DBT_HOST_URL` на имя вашего хоста (например, `abc123.us1.dbt.com`). URL можно найти в <Constant name="dbt_platform"/> в разделе **Account settings** &rarr; **Access URLs** &rarr; **MCP Endpoint URL**.

    Вы также можете зарегистрировать этот же сервер через CLI:

    ```bash
    claude mcp add --transport http dbt https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/
    ```

    </TabItem>
    <TabItem value="token" label="На основе токена">

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

    <MCPRemoteTokenHeaders />

    </TabItem>
    </Tabs>

4. Сохраните файл. Claude Code считывает `.mcp.json` при запуске &mdash; задайте ему вопрос о данных, чтобы проверить подключение.

## Устранение неполадок

<FAQ path="dbt-mcp/troubleshooting/claude-desktop-errors" />

<FAQ path="dbt-mcp/troubleshooting/claude-code" />
