---
title: "Интеграция VS Code с MCP"
sidebar_label: "Интеграция VS Code с MCP"
description: "Руководство по настройке VS Code для работы с dbt-mcp"
id: "integrate-mcp-vscode"
availability: all_users
---

import MCPExample from '/snippets/_mcp-config-files.md';
import MCPRemoteOauthBetaCallout from '/snippets/_mcp-remote-oauth-beta-callout.md';
import MCPRemoteServerUrl from '/snippets/_mcp-remote-server-url.md';
import MCPRemoteTokenHeaders from '/snippets/_mcp-remote-token-headers.md';
import MCPOauthPreflight from '/snippets/_mcp-oauth-preflight.md';
import MCPRemoteReadOnlyCredentials from '/snippets/_mcp-remote-read-only-credentials.md';

[Microsoft Visual Studio Code (VS Code)](https://code.visualstudio.com/mcp) — это мощная и популярная интегрированная среда разработки (IDE).

VS Code может подключаться как к **самостоятельно размещённому** серверу dbt MCP (работает на вашем компьютере, поддерживает команды CLI, такие как `dbt run`), так и к **удалённому** серверу dbt MCP (работает по HTTP, не требует установки, ориентирован на потребление данных). Перед началом убедитесь, что у вас есть:
- VS Code с установленными последними обновлениями.
- Для самостоятельно размещённого MCP: выполнена [настройка самостоятельно размещённого MCP](/docs/dbt-ai/setup-local-mcp) и настроены пути к вашему проекту dbt.
- Для удалённого MCP: ваш **MCP URL** из раздела **Account settings** &rarr; **Access URLs** &rarr; **MCP Endpoint URL** в <Constant name="dbt_platform" />.
- <MCPRemoteReadOnlyCredentials />

## Настройка подключения к самостоятельно размещённому серверу dbt MCP

Чтобы начать, в VS Code:

1. Откройте меню **Settings** и выберите соответствующую вкладку в верхней части страницы в зависимости от вашего сценария:
    - **Workspace**: настраивает сервер в контексте текущего workspace
    - **User**: настраивает сервер в контексте пользователя
    <br />
   **Примечание для пользователей WSL**: если вы используете VS Code с Windows Subsystem for Linux (WSL), необходимо настраивать параметры, специфичные для WSL. Выполните команду **Preferences: Open Remote Settings** из **Command Palette** (F1) или выберите вкладку **Remote** в редакторе **Settings**. Локальные пользовательские настройки используются и в WSL, но могут быть переопределены настройками для WSL. Настройка MCP-серверов в локальных пользовательских настройках не будет корректно работать в среде WSL.

2. Выберите **Features** --> **Chat**

3. Убедитесь, что **MCP** **Enabled**

  <Lightbox src="/img/mcp/vscode_mcp_enabled_image.png" width="60%" title="mcp-vscode-settings" />

4. Откройте палитру команд `Control/Command + Shift + P` и выберите один из вариантов:
     - **MCP: Open Workspace Folder MCP Configuration** &mdash; если вы хотите установить MCP-сервер для данного workspace
     - **MCP: Open User Configuration** &mdash; если вы хотите установить MCP-сервер для пользователя

5. Добавьте конфигурацию сервера (`dbt`) в предоставленный файл `mcp.json` как один из серверов:

:::tip
    Вам не нужно клонировать репозиторий dbt-mcp. Установите [uv](https://docs.astral.sh/uv/getting-started/installation/) и выполните `uvx dbt-mcp` (или используйте конфигурацию ниже); клонирование требуется только для участия в разработке.
    :::

    <Expandable alt_header="Самостоятельно размещаемый MCP с OAuth платформы dbt" >


    Самостоятельно размещаемый MCP с OAuth предназначен для пользователей, которым нужны возможности <Constant name="dbt_platform" />.

    Функции ИИ включены по умолчанию. Администраторы могут [отключить их или снова включить в любое время](/docs/platform/manage-dbt-ai).
    
    Выберите конфигурацию в зависимости от вашего сценария использования:

    <MCPExample />

    </Expandable>

<Expandable alt_header="MCP с самостоятельным размещением (только CLI)">

    Для пользователей, которым нужно только выполнять команды dbt с <Constant name="core" /> или <Constant name="fusion" />

    <VersionBlock lastVersion="1.10">

    ```json
    {
      "servers": {
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

</VersionBlock>

    <VersionBlock firstVersion="1.11">

    ```json
    {
      "servers": {
        "dbt": {
          "command": "uvx",
          "args": ["dbt-mcp"],
          "env": {
            "DBT_ENGINE_PROJECT_DIR": "/path/to/your/dbt/project",
            "DBT_PATH": "/path/to/your/dbt/executable"
          }
        }
      }
    }
    ```

    </VersionBlock>

    **Как определить пути:**
    - <VersionBlock lastVersion="1.10">**DBT_PROJECT_DIR**</VersionBlock><VersionBlock firstVersion="1.11">**DBT_ENGINE_PROJECT_DIR**</VersionBlock>: Полный путь к папке, содержащей файл `dbt_project.yml`
      - macOS/Linux: Выполните `pwd` из папки проекта.
      - Windows: Выполните `cd` из папки проекта в командной строке.
    - **DBT_PATH**: Путь к исполняемому файлу dbt
      - macOS/Linux: Выполните `which dbt`.
      - Windows: Выполните `where dbt`.

    </Expandable>

    <Expandable alt_header="Самостоятельно размещённый MCP с .env">

    Для опытных пользователей, которым нужны пользовательские переменные окружения или аутентификация с помощью сервисного токена. Поместите файл `.env` в _корневую папку проекта dbt_ (ту же папку, где находится `dbt_project.yml`) и укажите абсолютный путь с помощью `--env-file`. Полный список доступных переменных окружения для самостоятельно размещённого MCP-сервера приведён в [справочнике переменных окружения](/docs/dbt-ai/mcp-environment-variables).

    Использование поля `env` (конфигурация в одном файле):

    :::tip Идентификаторы — это целые числа, а не URL-адреса
    `DBT_PROD_ENV_ID`, `DBT_DEV_ENV_ID` и `DBT_USER_ID` должны быть числовыми идентификаторами (например, `54321`), а не полными URL-адресами, скопированными из браузера. `DBT_HOST` принимает как `cloud.getdbt.com`, так и `https://cloud.getdbt.com`.
    :::

    <VersionBlock lastVersion="1.10">

    ```json
    {
      "servers": {
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

С использованием файла `.env` (укажите абсолютный путь к `.env` в корневом каталоге вашего проекта dbt):
    </VersionBlock>

    <VersionBlock firstVersion="1.11">

    ```json
    {
      "servers": {
        "dbt": {
          "command": "uvx",
          "args": ["dbt-mcp"],
          "env": {
            "DBT_ENGINE_HOST": "cloud.getdbt.com",
            "DBT_TOKEN": "your-token-here",
            "DBT_PROD_ENV_ID": "12345",
            "DBT_ENGINE_PROJECT_DIR": "/path/to/project",
            "DBT_PATH": "/path/to/dbt"
          }
        }
      }
    }
    ```

    </VersionBlock>

    С использованием файла `.env` (альтернативный вариант — конфигурация из двух файлов):

    ```json
    {
      "servers": {
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

6. Вы можете запускать, останавливать и настраивать MCP-серверы следующими способами:
      - Выполняя команду `MCP: List Servers` из Command Palette (Control/Command + Shift + P) и выбирая нужный сервер.
      - Используя ключевые слова inline непосредственно в файле `mcp.json`.

  <Lightbox src="/img/mcp/vscode_run_server_keywords_inline.png" width="60%" title="VS Code inline management" />

Теперь вы можете получать доступ к серверу dbt MCP в VS Code через такие интерфейсы, как GitHub Copilot.

## Настройка подключения к удалённому серверу dbt MCP

Удалённый сервер dbt MCP работает в <Constant name="dbt_platform" /> &mdash; `uvx` и самостоятельная установка не требуются. VS Code подключается к нему по HTTP с помощью того же файла `mcp.json`, который используется для серверов, размещённых самостоятельно.

<MCPRemoteOauthBetaCallout />

1. Откройте палитру команд (`Control/Command + Shift + P`) и выберите один из вариантов:
    - **MCP: Open Workspace Folder MCP Configuration** &mdash; для этой рабочей области.
    - **MCP: Open User Configuration** &mdash; для вашего пользователя.
2. Получите URL-адрес MCP:

    <MCPRemoteServerUrl />

3. Добавьте запись `dbt` в ключ верхнего уровня `servers`. (VS Code использует `servers`, а не `mcpServers`.) Выберите вкладку, соответствующую вашему способу аутентификации:

    <Tabs>
    <TabItem value="oauth" label="OAuth (удалённый сервер)">

    _OAuth для удалённого сервера MCP доступен в рамках публичного бета-тестирования для учётных записей Starter, Enterprise и Enterprise+._

    <MCPOauthPreflight />

    Добавьте следующий код в `mcp.json`. При первом подключении к серверу VS Code откроет браузер для входа и предоставления согласия.

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

    Замените `YOUR_DBT_HOST_URL` на имя вашего хоста (например, `abc123.us1.dbt.com`). URL-адрес можно найти в <Constant name="dbt_platform"/> в разделе **Account settings** &rarr; **Access URLs** &rarr; **MCP Endpoint URL**.

    </TabItem>
    <TabItem value="token" label="На основе токена">

    Используйте аутентификацию на основе токена, если ваш клиент ещё не поддерживает OAuth для HTTP-серверов MCP или если вам нужна общая конфигурация либо конфигурация для CI.

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

    <MCPRemoteTokenHeaders />

    </TabItem>
    </Tabs>

4. Сохраните файл. Выполните команду **MCP: List Servers** из палитры команд, чтобы запустить сервер, а затем задайте в Copilot Chat вопрос о данных, чтобы проверить подключение.

## Устранение неполадок

В этом разделе приведены шаги по устранению ошибок, с которыми вы можете столкнуться при интеграции VS Code с MCP.

<FAQ path="dbt-mcp/troubleshooting/uvx" />

<FAQ path="dbt-mcp/troubleshooting/wsl" />

<FAQ path="dbt-mcp/troubleshooting/server-not-starting" />

## Ресурсы {#resources}

- [Документация Microsoft VS Code MCP](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
