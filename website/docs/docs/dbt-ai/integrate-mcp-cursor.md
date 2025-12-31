---
title: "Интеграция Cursor с dbt MCP"
sidebar_label: "Интеграция Cursor с MCP"
description: "Руководство по настройке Cursor с dbt-mcp"
id: "integrate-mcp-cursor"
---

[Cursor](https://docs.cursor.com/context/model-context-protocol) — это AI-ориентированный редактор кода, построенный на базе Microsoft Visual Studio Code (VS Code).

После настройки вашего MCP-сервера необходимо подключить его к Cursor. Войдите в Cursor и следуйте шагам, соответствующим вашему сценарию использования.

## Настройка с локальным dbt MCP-сервером {#set-up-with-local-dbt-mcp-server}

Выберите вариант настройки в зависимости от вашего рабочего процесса:
- OAuth для подключений к <Constant name="dbt_platform" />
- Только CLI, если вы используете <Constant name="core" /> или <Constant name="fusion_engine" /> локально
- Настройка переменных окружения, если вы используете их в своем аккаунте <Constant name="dbt_platform" />

### OAuth или CLI {#oauth-or-cli}

Нажмите на одну из следующих ссылок приложений при открытом Cursor, чтобы автоматически сконфигурировать ваш MCP-сервер:

<Tabs>

<TabItem value="Только CLI (dbt Core и Fusion)">

Локальная конфигурация для пользователей, которые хотят использовать только команды dbt CLI с <Constant name="core" /> или <Constant name="fusion_engine" /> (без функций <Constant name="dbt_platform" />).

[Добавьте dbt Core или Fusion в Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX1BST0pFQ1RfRElSIjoiL3BhdGgvdG8veW91ci9kYnQvcHJvamVjdCIsIkRCVF9QQVRIIjoiL3BhdGgvdG8veW91ci9kYnQvZXhlY3V0YWJsZSJ9LCJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJkYnQtbWNwIl19)

После нажатия:
1. Обновите `DBT_PROJECT_DIR`, указав полный путь к вашему dbt-проекту (папка, содержащая `dbt_project.yml`).
2. Обновите `DBT_PATH`, указав полный путь к исполняемому файлу dbt:
   - macOS/Linux: выполните `which dbt` в терминале.
   - Windows: выполните `where dbt` в Command Prompt или PowerShell.
3. Сохраните конфигурацию.

</TabItem>

<TabItem value="OAuth с платформой dbt">

Настройки конфигурации для пользователей, которым требуется OAuth-аутентификация с <Constant name="dbt_platform" /> <Lifecycle status="managed, managed_plus" />

- [dbt platform](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJodHRwczovLzx5b3VyLWRidC1ob3N0LXdpdGgtY3VzdG9tLXN1YmRvbWFpbj4iLCJESVNBQkxFX0RCVF9DTEkiOiJ0cnVlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D)
- [dbt platform + CLI](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJodHRwczovLzx5b3VyLWRidC1ob3N0LXdpdGgtY3VzdG9tLXN1YmRvbWFpbj4iLCJEQlRfUFJPSkVDVF9ESVIiOiIvcGF0aC90by9wcm9qZWN0IiwiREJUX1BBVEgiOiJwYXRoL3RvL2RidC9leGVjdXRhYmxlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D)

После нажатия:
1. Замените `<your-dbt-host-with-custom-subdomain>` на ваш реальный хост (например, `abc123.us1.dbt.com`).
2. (Для <Constant name="dbt_platform" /> + CLI) Обновите `DBT_PROJECT_DIR` и `DBT_PATH`, как описано выше.
3. Сохраните конфигурацию.

</TabItem>

</Tabs>

### Пользовательские переменные окружения {#custom-environment-variables}

Если вам требуется нестандартная конфигурация переменных окружения или вы предпочитаете использовать service tokens:

1. Нажмите на следующую ссылку при открытом Cursor:

    [Добавить в Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJkYnQtbWNwIl0sImVudiI6e319)

2. В шаблоне добавьте необходимые вам переменные окружения в секцию `env`.
3. Сохраните конфигурацию.

#### Использование файла `.env` {#using-an-env-file}

Если вы предпочитаете управлять переменными окружения в отдельном файле, нажмите на эту ссылку:

[Добавить в Cursor (с файлом .env)](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt-mcp&config=eyJjb21tYW5kIjoidXZ4IC0tZW52LWZpbGUgPGVudi1maWxlLXBhdGg%252BIGRidC1tY3AifQ%3D%3D)

Затем замените `<env-file-path>` на полный путь к вашему файлу `.env`.

## Настройка с удалённым dbt MCP-сервером {#set-up-with-remote-dbt-mcp-server}

1. Нажмите на следующую ссылку приложения при открытом Cursor:

    [Добавить в Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJ1cmwiOiJodHRwczovLzxob3N0Pi9hcGkvYWkvdjEvbWNwLyIsImhlYWRlcnMiOnsiQXV0aG9yaXphdGlvbiI6InRva2VuIDx0b2tlbj4iLCJ4LWRidC1wcm9kLWVudmlyb25tZW50LWlkIjoiPHByb2QtaWQ%252BIn19)

2. Укажите ваш URL и заголовки, обновив **host**, **production environment ID** и **service token** в шаблоне.
3. Сохраните конфигурацию — теперь у вас есть доступ к dbt MCP-серверу!
