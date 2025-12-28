---
title: "Интеграция VS Code с MCP"
sidebar_label: "Интеграция VS Code с MCP"
description: "Руководство по настройке VS Code для работы с dbt-mcp"
id: "integrate-mcp-vscode"
---

import MCPExample from '/snippets/_mcp-config-files.md';

[Microsoft Visual Studio Code (VS Code)](https://code.visualstudio.com/mcp) — это мощная и популярная интегрированная среда разработки (IDE).

Данные инструкции описывают интеграцию dbt MCP и VS Code. Перед началом убедитесь, что вы:
- Завершили [локальную настройку MCP](/docs/dbt-ai/setup-local-mcp)
- Установили VS Code с последними обновлениями
- (Для локального MCP с CLI) Настроили пути к вашему dbt-проекту

## Настройка с локальным сервером dbt MCP

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

    <Expandable alt_header="Локальный MCP с OAuth платформы dbt" >


    Локальный MCP с OAuth предназначен для пользователей, которые хотят использовать возможности <Constant name="dbt_platform" />.
    
    Выберите конфигурацию в зависимости от вашего сценария использования:

    <MCPExample />

    </Expandable>

    <Expandable alt_header="Локальный MCP (только CLI)">

    Для пользователей, которым нужны только команды dbt CLI с <Constant name="core" /> или <Constant name="fusion" />

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

    **Как найти пути:**
    - **DBT_PROJECT_DIR**: полный путь к папке, содержащей файл `dbt_project.yml`
      - macOS/Linux: выполните `pwd` из папки проекта.
      - Windows: выполните `cd` из папки проекта в Command Prompt.
    - **DBT_PATH**: путь к исполняемому файлу dbt
      - macOS/Linux: выполните `which dbt`.
      - Windows: выполните `where dbt`.

    </Expandable>

    <Expandable alt_header="Локальный MCP с .env">

    Для продвинутых пользователей, которым нужны кастомные переменные окружения или аутентификация через service token

    Использование поля `env` (рекомендуется — конфигурация в одном файле):

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

    Использование файла `.env` (альтернатива — конфигурация в двух файлах):

    ```json
    {
      "servers": {
        "dbt": {
          "command": "uvx",
          "args": ["--env-file", "/path/to/.env", "dbt-mcp"]
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

## Устранение неполадок

В этом разделе приведены шаги по устранению ошибок, с которыми вы можете столкнуться при интеграции VS Code с MCP.

<Expandable alt_header="Не удаётся найти исполняемый файл `uvx`" >

Если вы видите ошибки вроде `Could not connect to MCP server dbt` или `spawn uvx ENOENT`, VS Code, возможно, не может найти исполняемый файл `uvx`.

Чтобы исправить это, используйте полный путь к `uvx` в конфигурации:

1. Найдите полный путь:
   - macOS/Linux: выполните `which uvx` в терминале.
   - Windows: выполните `where uvx` в Command Prompt или PowerShell.

2. Обновите `mcp.json`, указав полный путь:
   ```json
   {
     "servers": {
       "dbt": {
         "command": "/full/path/to/uvx",
         "args": ["dbt-mcp"],
         "env": { ... }
       }
     }
   }
   ```

   Пример для macOS с Homebrew: `"command": "/opt/homebrew/bin/uvx"`

</Expandable>

<Expandable alt_header="Конфигурация не работает в WSL">

Если вы используете VS Code с Windows Subsystem for Linux (WSL), убедитесь, что MCP-сервер настроен в параметрах, специфичных для WSL, а не в локальных пользовательских настройках. Используйте вкладку **Remote** в редакторе **Settings** или выполните **Preferences: Open Remote Settings** из Command Palette.

</Expandable>

<Expandable alt_header="Сервер не запускается" >

Проверьте статус MCP-сервера:
1. Выполните `MCP: List Servers` из Command Palette (Control/Command + Shift + P).
2. Посмотрите, есть ли сообщения об ошибках рядом с сервером dbt.
3. Нажмите на сервер, чтобы посмотреть подробные логи.

Распространённые проблемы:
- Отсутствующие или некорректные пути для `DBT_PROJECT_DIR` или `DBT_PATH`
- Неверные токены аутентификации
- Отсутствующие обязательные переменные окружения

</Expandable>

## Ресурсы

- [Документация Microsoft VS Code MCP](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
