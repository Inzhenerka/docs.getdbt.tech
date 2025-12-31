---
title: "Интеграция Claude с dbt MCP"
sidebar_label: "Интеграция Claude с MCP"
description: "Руководство по настройке Claude с dbt-mcp"
id: "integrate-mcp-claude"
---

import MCPExample from '/snippets/_mcp-config-files.md';

Claude — это AI-ассистент от Anthropic с двумя основными интерфейсами:
- [Claude Code](https://www.anthropic.com/claude-code): инструмент для разработки в терминале/IDE
- [Claude for desktop](https://claude.ai/download): графический интерфейс с поддержкой MCP для доступа к файлам и выполнения команд, а также базовыми возможностями для работы с кодом

## Claude Code {#claude-code}

Вы можете настроить Claude Code как с локальным, так и с удалённым сервером `dbt-mcp`. Мы рекомендуем использовать локальный `dbt-mcp` для задач, ориентированных на разработчиков. Подробнее о возможностях локальных и удалённых серверов см. на странице [About MCP](/docs/dbt-ai/about-mcp#server-access).

### Настройка с локальным сервером dbt MCP {#set-up-with-local-dbt-mcp-server}

Предварительные требования:
- Завершите [настройку локального MCP](/docs/dbt-ai/setup-local-mcp).
- Знайте ваш способ конфигурации (OAuth <Constant name="dbt_core"/> или <Constant name="fusion"/>, либо переменные окружения)

### Области (scopes) Claude Code {#claude-code-scopes}

По умолчанию MCP-сервер устанавливается в области `"local"`, что означает его активность для сессий Claude Code в текущей директории для пользователя, который выполнил установку.

Также возможно установить MCP-сервер:
- В области `"user"`, чтобы он был доступен для всех сессий Claude Code независимо от используемой директории
- В области `"project"`, чтобы создать конфигурационный файл, который можно хранить в системе контроля версий, и тогда все разработчики проекта будут иметь MCP-сервер уже установленным

Чтобы установить сервер в области проекта, выполните следующую команду и закоммитьте файл `.mcp.json`. Убедитесь, что путь к файлу env-переменных одинаков для всех пользователей.
```bash
claude mcp add dbt -s project -- uvx --env-file <path-to-.env-file> dbt-mcp
```

Дополнительную информацию об областях см. в документации [Understanding MCP server scopes](https://docs.anthropic.com/en/docs/claude-code/mcp#understanding-mcp-server-scopes).

### Claude for desktop {#claude-for-desktop}

1. Перейдите в настройки Claude. Нажмите на меню Claude в системной строке меню (не настройки внутри окна Claude) и выберите **Settings…**.
2. В окне настроек перейдите на вкладку **Developer** в левой боковой панели. Этот раздел содержит параметры для настройки MCP-серверов и других функций для разработчиков.
3. Нажмите кнопку **Edit Config** и откройте конфигурационный файл в текстовом редакторе.
4. Добавьте конфигурацию сервера в зависимости от вашего сценария использования. Выберите [корректную JSON-структуру](https://modelcontextprotocol.io/quickstart/user#installing-the-filesystem-server) из следующих вариантов:

    <Expandable alt_header="Local MCP with OAuth">

    #### Локальный MCP с аутентификацией через платформу dbt <Lifecycle status="managed, managed_plus" />

    Конфигурация для пользователей, которым нужна бесшовная OAuth-аутентификация с <Constant name="dbt_platform" />

    <MCPExample />

    </Expandable>

    <Expandable alt_header="Local MCP (CLI only)">

    Локальная конфигурация для пользователей, которым нужно использовать только команды dbt CLI с <Constant name="core" /> или <Constant name="fusion" />

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

    Как найти нужные пути:
    - **DBT_PROJECT_DIR**: полный путь к папке, содержащей файл `dbt_project.yml`
    - **DBT_PATH**: определите, выполнив `which dbt` в Terminal (macOS/Linux) или `where dbt` (Windows) в Powershell

    </Expandable>

    <Expandable alt_header="Local MCP with .env">

    Расширенная конфигурация для пользователей, которым нужны пользовательские переменные окружения

    Использование поля `env` (рекомендуется):
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

    Использование файла .env (альтернатива):
    ```json 
    {
      "mcpServers": {
        "dbt": {
          "command": "uvx",
          "args": ["--env-file", "/path/to/.env", "dbt-mcp"]
        }
      }
    }
    ```

    </Expandable>

5. Сохраните файл. После успешного перезапуска Claude Desktop вы увидите индикатор MCP-сервера в правом нижнем углу поля ввода сообщения.

Для отладки логи Claude Desktop находятся по пути `~/Library/Logs/Claude` для Mac или `%APPDATA%\Claude\logs` для Windows.

#### Использование OAuth или переменных окружения напрямую {#using-oauth-or-environment-variables-directly}

Рекомендуемый способ — настроить переменные окружения напрямую в конфигурационном файле Claude Code без необходимости использовать отдельный файл `.env`:

1. Добавьте MCP-сервер:

  ```bash
  claude mcp add dbt -- uvx dbt-mcp
  ```
2. Откройте редактор конфигурации:

  ```bash
  claude mcp edit dbt
  ```

3. В редакторе конфигурации добавьте переменные окружения в зависимости от вашего сценария использования:

<Tabs>
<TabItem value="CLI only">

Только для <Constant name="core" /> или <Constant name="fusion" /> (без <Constant name="dbt_platform" />):
```json
{
  "command": "uvx",
  "args": ["dbt-mcp"],
  "env": {
    "DBT_PROJECT_DIR": "/path/to/your/dbt/project",
    "DBT_PATH": "/path/to/your/dbt/executable"
  }
}
```

</TabItem>
<TabItem value="OAuth with dbt platform">

Для OAuth-аутентификации (требуется статический поддомен):
```json
{
  "command": "uvx",
  "args": ["dbt-mcp"],
  "env": {
    "DBT_HOST": "https://your-subdomain.us1.dbt.com",
    "DBT_PROJECT_DIR": "/path/to/your/dbt/project",
    "DBT_PATH": "/path/to/your/dbt/executable"
  }
}
```

</TabItem>
</Tabs>

#### Использование файла `.env` {#using-an-env-file}

Если вы предпочитаете управлять переменными окружения в отдельном файле:

```bash
claude mcp add dbt -- uvx --env-file <path-to-.env-file> dbt-mcp
```
Замените `<path-to-.env-file>` на полный путь к вашему файлу `.env`.

## Troubleshooting {#troubleshooting}

- Claude Desktop может возвращать ошибки, такие как `Error: spawn uvx ENOENT` или `Could not connect to MCP server dbt-mcp`. Попробуйте заменить команду и путь к файлу с переменными окружения на полный путь. Для `uvx` определите полный путь, выполнив `which uvx` в Unix-системах, и укажите этот путь в JSON. Например: `"command": "/the/full/path/to/uvx"`.
