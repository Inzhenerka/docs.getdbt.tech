---
title: "Интеграция Cursor с dbt MCP"
sidebar_label: "Интеграция Cursor с MCP"
description: "Руководство по настройке Cursor с dbt-mcp"
id: "integrate-mcp-cursor"
availability: all_users
---

import MCPOauthPreflight from '/snippets/_mcp-oauth-preflight.md';
import MCPRemoteReadOnlyCredentials from '/snippets/_mcp-remote-read-only-credentials.md';

[Cursor](https://docs.cursor.com/context/model-context-protocol) — это редактор кода с поддержкой ИИ, созданный на основе Microsoft Visual Studio Code (VS Code).

После настройки вашего MCP-сервера необходимо подключить его к Cursor. Войдите в Cursor и следуйте шагам, соответствующим вашему сценарию использования.

## Настройка с самостоятельно размещённым сервером dbt MCP

Выберите вариант настройки в зависимости от вашего рабочего процесса:
- OAuth для подключений к <Constant name="dbt_platform" />
- Только CLI, если вы используете <Constant name="core" /> или <Constant name="fusion_engine" /> локально. 
- Настройте переменные окружения, если вы используете их в своей учётной записи <Constant name="dbt_platform" />.

### OAuth или CLI {#oauth-or-cli}

Нажмите на одну из следующих ссылок приложений при открытом Cursor, чтобы автоматически сконфигурировать ваш MCP-сервер:

<Tabs>

<TabItem value="CLI only (dbt v1 and dbt v2)">

Конфигурация с самостоятельным размещением для пользователей, которым нужны только команды dbt с <Constant name="core" /> или <Constant name="fusion_engine" /> (без функций <Constant name="dbt_platform" />).

[Добавить <Constant name="core" /> или <Constant name="fusion" /> в Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX1BST0pFQ1RfRElSIjoiL3BhdGgvdG8veW91ci9kYnQvcHJvamVjdCIsIkRCVF9QQVRIIjoiL3BhdGgvdG8veW91ci9kYnQvZXhlY3V0YWJsZSJ9LCJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJkYnQtbWNwIl19)

После нажатия:
1. Укажите в <VersionBlock lastVersion="1.10">`DBT_PROJECT_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROJECT_DIR`</VersionBlock> полный путь к вашему проекту dbt (папке, содержащей `dbt_project.yml`).
2. Укажите в `DBT_PATH` полный путь к исполняемому файлу dbt:
   - macOS/Linux: выполните `which dbt` в терминале.
   - Windows: выполните `where dbt` в командной строке или PowerShell.
3. Сохраните конфигурацию.

</TabItem>

<TabItem value="OAuth с платформой dbt">

_OAuth для локально размещённого сервера dbt MCP доступен для учётных записей Starter, Enterprise и Enterprise+._

Параметры настройки для пользователей, которым нужна аутентификация OAuth в <Constant name="dbt_platform" />.

Функции ИИ включены по умолчанию. Администраторы могут [отключить или снова включить их в любое время](/docs/platform/manage-dbt-ai).

- [Только <Constant name="dbt_platform"/>](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJodHRwczovLzx5b3VyLWRidC1ob3N0LXdpdGgtY3VzdG9tLXN1YmRvbWFpbj4iLCJESVNBQkxFX0RCVF9DTEkiOiJ0cnVlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D)
- [<Constant name="dbt_platform"/> + CLI](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJodHRwczovLzx5b3VyLWRidC1ob3N0LXdpdGgtY3VzdG9tLXN1YmRvbWFpbj4iLCJEQlRfUFJPSkVDVF9ESVIiOiIvcGF0aC90by9wcm9qZWN0IiwiREJUX1BBVEgiOiJwYXRoL3RvL2RidC9leGVjdXRhYmxlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D)

После нажатия на ссылку:
1. Замените `<your-dbt-host-with-custom-subdomain>` фактическим адресом вашего хоста (например, `abc123.us1.dbt.com`).
2. (Для <Constant name="dbt_platform" /> + CLI) Обновите <VersionBlock lastVersion="1.10">`DBT_PROJECT_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROJECT_DIR`</VersionBlock> и `DBT_PATH`, как описано выше.
3. Сохраните конфигурацию.

</TabItem>

</Tabs>

### Пользовательские переменные окружения {#custom-environment-variables}

Используйте этот способ, если вам нужны пользовательские переменные окружения или вы предпочитаете использовать сервисные токены. Полный список доступных переменных окружения для самостоятельно размещённого MCP-сервера приведён в [справочнике переменных окружения](/docs/dbt-ai/mcp-environment-variables).

1. Нажмите на следующую ссылку при открытом Cursor:

    [Добавить в Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJkYnQtbWNwIl0sImVudiI6e319)

2. В шаблоне добавьте необходимые вам переменные окружения в секцию `env`.
3. Сохраните конфигурацию.

#### Использование файла `.env` {#using-an-env-file}

Если вы предпочитаете управлять переменными окружения в отдельном файле, поместите файл `.env` в _корневой каталог вашего проекта dbt_ (ту же папку, где находится `dbt_project.yml`). Нажмите на эту ссылку:

[Добавить в Cursor (с файлом .env)](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt-mcp&config=eyJjb21tYW5kIjoidXZ4IC0tZW52LWZpbGUgPGVudi1maWxlLXBhdGg%252BIGRidC1tY3AifQ%3D%3D)

Затем укажите в `env-file-path` абсолютный путь к вашему файлу `.env` (например, `/absolute/path/to/your-dbt-project/.env`).

## Настройка с удалённым dbt MCP-сервером {#set-up-with-remote-dbt-mcp-server}

1. Нажмите на следующую ссылку приложения при открытом Cursor:

Удалённый MCP поддерживает **OAuth** или заголовки для **аутентификации на основе токена**.

- _OAuth для удалённого MCP доступен в публичной бета-версии для аккаунтов Starter, Enterprise и Enterprise+._
- Для обоих методов URL MCP — `https://<Access URL>/api/ai/v1/mcp`. Найти этот URL можно в <Constant name="dbt_platform"/> в разделе **Account settings** &rarr; **Access URLs** &rarr; **MCP Endpoint URL**.
- <MCPRemoteReadOnlyCredentials />

<MCPOauthPreflight />

Приведённая ниже глубокая ссылка настраивает **аутентификацию на основе токена** (URL и заголовки). Для настройки OAuth следуйте [краткому руководству по удалённому MCP](/docs/dbt-ai/mcp-quickstart-remote#5-configure-your-mcp-client).

1. Откройте Cursor и перейдите по следующей ссылке приложения:

    [Добавить в Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJ1cmwiOiJodHRwczovLzxob3N0Pi9hcGkvYWkvdjEvbWNwLyIsImhlYWRlcnMiOnsiQXV0aG9yaXphdGlvbiI6InRva2VuIDx0b2tlbj4iLCJ4LWRidC1wcm9kLWVudmlyb25tZW50LWlkIjoiPHByb2QtaWQ%252BIn19)

2. Укажите свой URL и заголовки, обновив в шаблоне **хост**, **идентификатор производственной среды** и **сервисный токен**. Используйте `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp` в качестве URL сервера (без завершающей косой черты).
   :::tip Идентификаторы — это целые числа, а не URL
   `DBT_PROD_ENV_ID`, `DBT_USER_ID` и `DBT_DEV_ENV_ID` должны быть числовыми идентификаторами (например, `54321`), а не полными URL. 

   Поле `DBT_HOST` принимает значения как с префиксом `https://`, так и без него. Ниже приведены допустимые примеры:
   ```bash
   DBT_HOST=https://ab123.us1.dbt.com
   DBT_HOST=ab123.us1.dbt.com
   ```
   :::
3. Сохраните настройки — теперь у вас есть доступ к серверу dbt MCP!
