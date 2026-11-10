import StaticSubdomainRequired from '/snippets/_static-subdomain-required.md';


В этом кратком руководстве используется локальный сервер MCP: он запускается на вашем компьютере с помощью `uvx dbt-mcp`, подключается к <Constant name="dbt_platform"/> для работы с <Constant name="semantic_layer"/>, Discovery и SQL, а также при необходимости запускает dbt локально. 

Если вам нужен только самостоятельно развернутый CLI (с аккаунтом <Constant name="dbt_platform"/> или без него), см. [Запуск самостоятельно развернутого dbt](/docs/dbt-ai/mcp-quickstart-cli) или [Запуск самостоятельно развернутого dbt Wizard](/docs/platform/wizard-overview#get-started).

 Чтобы настроить или отключить отдельные инструменты, см. [Справочник переменных окружения](/docs/dbt-ai/mcp-environment-variables). 

## Предварительные требования {#prerequisites}

- [Установите uv](https://docs.astral.sh/uv/getting-started/installation/)
- [Аккаунт <Constant name="dbt_platform"/>](https://www.getdbt.com/signup)
- Для подключений через OAuth:
  - MCP OAuth доступен на тарифах Starter, Enterprise и Enterprise+.

## Шаг 1. Выберите способ аутентификации и выполните настройку {#step-1-choose-your-auth-method-and-configure}

<Tabs groupId="auth">

<TabItem value="oauth" label="OAuth">

_MCP OAuth доступен в публичной бета-версии для аккаунтов на тарифах Starter, Enterprise и Enterprise+._

OAuth — самый быстрый способ настройки для аккаунтов <Constant name="dbt_platform"/>: вам не нужно копировать токены или управлять ими. При первом подключении открывается окно браузера для аутентификации. 

Для использования OAuth _без_ самостоятельно развернутой установки используйте [удаленный сервер MCP](/docs/dbt-ai/mcp-quickstart-remote). OAuth для удаленного MCP доступен в публичной бета-версии для аккаунтов на тарифах Starter, Enterprise и Enterprise+. Если ваш клиент не поддерживает OAuth или вам нужен доступ по токену, используйте [аутентификацию по токену](/docs/dbt-ai/setup-remote-mcp#token-based-authentication).

<StaticSubdomainRequired />

#### Найдите свой Access URL {#find-your-access-url}

1. Войдите в свой аккаунт <Constant name="dbt_platform"/>.
2. Перейдите в **Account settings** и скопируйте **Access URL** (например, `abc123.us1.dbt.com`). 

:::tip Multi-cell и формат DBT_HOST
- Поле `DBT_HOST` принимает как `abc123.us1.dbt.com`, так и `https://abc123.us1.dbt.com`.

- Если ваш Access URL — `abc123.us1.dbt.com`, разделите его на две переменные:
  - `DBT_HOST=us1.dbt.com`
  - `MULTICELL_ACCOUNT_PREFIX=abc123`
  Не включайте префикс аккаунта в `DBT_HOST`. Подробнее см. в [примерах настройки multi-cell](/docs/dbt-ai/setup-local-mcp#api-and-sql-tool-settings).
:::

#### Добавьте конфигурацию в свой клиент MCP {#add-the-config-to-your-mcp-client}

<Tabs>

<TabItem value="claude-desktop" label="Claude Desktop">

**Вариант A: быстрая установка (рекомендуется)**

1. Перейдите к [последнему релизу dbt MCP](https://github.com/dbt-labs/dbt-mcp/releases/latest) и скачайте `dbt-mcp.mcpb`.
2. Дважды щелкните файл, чтобы открыть его в Claude Desktop.
3. Введите свой **Access URL** в качестве хоста <Constant name="dbt_platform"/>.
4. Включите сервер.

**Вариант B: ручная настройка**

1. В Claude Desktop перейдите в **Settings** → вкладка **Developer** → **Edit Config**.
2. Вставьте следующую конфигурацию, заменив `YOUR-ACCESS-URL` своим Access URL:

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "YOUR-ACCESS-URL"
      }
    }
  }
}
```

3. Сохраните изменения и перезапустите Claude Desktop.

Расположение файла конфигурации:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

</TabItem>

<TabItem value="claude-code" label="Claude Code">

Выполните эту команду, заменив `YOUR-ACCESS-URL` своим Access URL:

```shell
claude mcp add dbt \
-e DBT_HOST=YOUR-ACCESS-URL \
-- uvx dbt-mcp
```

Например, если ваш Access URL — `abc123.us1.dbt.com`:

```shell
claude mcp add dbt \
-e DBT_HOST=abc123.us1.dbt.com \
-- uvx dbt-mcp
```

</TabItem>

<TabItem value="cursor" label="Cursor">

При открытом Cursor нажмите одну из ссылок ниже для автоматической настройки, затем замените значение-заполнитель своим Access URL:

- [Только <Constant name="dbt_platform"/> (OAuth)](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJZT1VSLUFDQ0VTUy1VUkwiLCJESVNBQkxFX0RCVF9DTEkiOiJ0cnVlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D) — только возможности платформы, без CLI
- [<Constant name="dbt_platform"/> + CLI (OAuth)](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJZT1VSLUFDQ0VTUy1VUkwiLCJEQlRfUFJPSkVDVF9ESVIiOiIvcGF0aC90by9wcm9qZWN0IiwiREJUX1BBVEgiOiJwYXRoL3RvL2RidC9leGVjdXRhYmxlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D) — возможности платформы + команды самостоятельно развернутого dbt CLI

После перехода по ссылке замените `YOUR-ACCESS-URL` своим фактическим Access URL (например, `abc123.us1.dbt.com`) и сохраните изменения.

</TabItem>

<TabItem value="vscode" label="VS Code">

1. Откройте **Settings** → **Features** → **Chat** и убедитесь, что **MCP** включен.
2. Откройте палитру команд (`Ctrl/Cmd + Shift + P`) и выберите **MCP: Open User Configuration**.
3. Добавьте следующую конфигурацию в `mcp.json`:

:::note VS Code использует `"servers"`, а не `"mcpServers"`
:::

```json
{
  "servers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "YOUR-ACCESS-URL"
      }
    }
  }
}
```

Замените `YOUR-ACCESS-URL` своим Access URL (например, `abc123.us1.dbt.com`) и сохраните изменения.

</TabItem>

</Tabs>

#### Необязательно: добавьте команды самостоятельно развернутого dbt CLI {#optional-add-self-hosted-dbt-cli-commands}

Чтобы также выполнять команды <Constant name="platform_cli"/> (`dbt run`, `dbt build`, `dbt test` и другие), добавьте эти две переменные в блок `env`:

```json
"DBT_PROJECT_DIR": "/path/to/your/dbt/project",
"DBT_PATH": "/path/to/your/dbt/executable"
```

Найдите `DBT_PATH`, выполнив `which dbt` (macOS/Linux) или `where dbt` (Windows). `DBT_PROJECT_DIR` — это папка, содержащая ваш `dbt_project.yml`.


</TabItem>

<TabItem value="tokens" label="Токены">

Аутентификация по токену дает больше контроля и лучше подходит для общих или командных конфигураций. Вам понадобится сервисный токен или персональный токен доступа (PAT).

:::tip Какой токен использовать?
- **PAT (Personal Access Token):** необходим для использования `execute_sql`. Привязан к вашей учетной записи пользователя.
- **Сервисный токен:** подходит для всех остальных наборов инструментов платформы. Лучше подходит для общих или командных конфигураций.

Подробные рекомендации см. в разделе [Выбор способа аутентификации](/docs/dbt-ai/setup-local-mcp#choose-your-auth-method).
:::

### Найдите свои пути и идентификаторы {#find-your-paths-and-ids}

Вам понадобятся следующие значения. Пошаговые инструкции см. в разделе [Поиск идентификаторов](/docs/dbt-ai/mcp-find-ids).

| Переменная | Где найти |
| --- | --- |
| `DBT_HOST` | Имя хоста <Constant name="dbt_platform"/> в **Account settings** → **Access URL** |
| `DBT_TOKEN` | Сервисный токен или PAT в **Account settings** → **API tokens** |
| `DBT_PROD_ENV_ID` | Идентификатор производственной среды в **Deploy** → **Environments** |
| `DBT_DEV_ENV_ID` | Идентификатор среды разработки (необходим для `execute_sql`) |
| `DBT_USER_ID` | Ваш числовой идентификатор пользователя (необходим для `execute_sql`) |
| `DBT_ACCOUNT_ID` | Идентификатор аккаунта (необходим для инструментов Admin API) |

:::warning Используйте только значения, а не полные URL
Эти переменные принимают имена хостов или числовые идентификаторы, а не полные URL:

```bash
# ✅ Правильно
DBT_HOST=cloud.getdbt.com            # https://cloud.getdbt.com тоже подходит
DBT_PROD_ENV_ID=54321
DBT_USER_ID=123

# ❌ Неправильно — идентификаторы должны быть числами, а не полными URL
DBT_PROD_ENV_ID=https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321
DBT_USER_ID=https://cloud.getdbt.com/settings/profile
```

:::

:::tip Аккаунты multi-cell
Если ваш Access URL — `abc123.us1.dbt.com`, разделите его на две переменные:
- `DBT_HOST=us1.dbt.com`
- `MULTICELL_ACCOUNT_PREFIX=abc123`

Не включайте префикс аккаунта в `DBT_HOST`. Подробнее см. в [примерах настройки multi-cell](/docs/dbt-ai/setup-local-mcp#api-and-sql-tool-settings).
:::

### Добавьте конфигурацию в свой клиент MCP {#add-the-config-to-your-mcp-client-1}

Используйте приведенную ниже конфигурацию, заменив значения-заполнители найденными выше идентификаторами. Включайте только нужные вам переменные:

<Tabs>

<TabItem value="claude-desktop-token" label="Claude Desktop">

1. В Claude Desktop перейдите в **Settings** → вкладка **Developer** → **Edit Config**.
2. Вставьте следующую конфигурацию, заменив значения-заполнители:

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
        "DBT_DEV_ENV_ID": "67890",
        "DBT_USER_ID": "123",
        "DBT_ACCOUNT_ID": "99999"
      }
    }
  }
}
```

3. Сохраните изменения и перезапустите Claude Desktop.

Расположение файла конфигурации:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

</TabItem>

<TabItem value="claude-code-token" label="Claude Code">

Выполните эту команду, заменив значения-заполнители своими фактическими значениями:

```bash
claude mcp add dbt \
-e DBT_HOST=cloud.getdbt.com \
-e DBT_TOKEN=your-token-here \
-e DBT_PROD_ENV_ID=12345 \
-- uvx dbt-mcp
```

Добавьте `-e DBT_DEV_ENV_ID=...` и `-e DBT_USER_ID=...`, если используете `execute_sql`; добавьте `-e DBT_ACCOUNT_ID=...` для Admin API.

</TabItem>

<TabItem value="cursor-token" label="Cursor">

1. В Cursor откройте **Settings** → **MCP** → **Edit config** (или свой файл конфигурации).
2. Вставьте следующую конфигурацию, заменив значения-заполнители:

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
        "DBT_DEV_ENV_ID": "67890",
        "DBT_USER_ID": "123",
        "DBT_ACCOUNT_ID": "99999"
      }
    }
  }
}
```

3. Сохраните конфигурацию.

</TabItem>

<TabItem value="vscode-token" label="VS Code">

1. Откройте **Settings** → **Features** → **Chat** и убедитесь, что **MCP** включен.
2. Откройте палитру команд (`Ctrl/Cmd + Shift + P`) и выберите **MCP: Open User Configuration**.
3. Добавьте следующую конфигурацию в `mcp.json`:

:::note VS Code использует `"servers"`, а не `"mcpServers"`
:::

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
        "DBT_DEV_ENV_ID": "67890",
        "DBT_USER_ID": "123",
        "DBT_ACCOUNT_ID": "99999"
      }
    }
  }
}
```

4. Сохраните `mcp.json` и перезапустите VS Code.  

</TabItem>

</Tabs>

<Expandable alt_header="Необязательно: добавьте команды самостоятельно развернутого dbt CLI">

Чтобы также выполнять команды dbt (`dbt run`, `dbt build`, `dbt test` и другие), добавьте эти две переменные в блок `env`:

```json
"DBT_PROJECT_DIR": "/path/to/your/dbt/project",
"DBT_PATH": "/path/to/your/dbt/executable"
```

Найдите `DBT_PATH`, выполнив `which dbt` (macOS/Linux) или `where dbt` (Windows). `DBT_PROJECT_DIR` — это папка, содержащая ваш `dbt_project.yml`.

</Expandable>

</TabItem>

</Tabs>

## Шаг 2. Пройдите аутентификацию {#step-2-authenticate}

<Tabs groupId="auth">

<TabItem value="oauth" label="OAuth">

При первом подключении dbt MCP открывает окно браузера для завершения аутентификации OAuth. После входа ваш сеанс сохраняется, и последующие подключения выполняются автоматически.

Если аутентификация не начинается, закройте клиент и выполните:
- macOS/Linux: `rm -f ~/.dbt/mcp.yml ~/.dbt/mcp.lock`
- Windows: `Remove-Item -Force $env:USERPROFILE\.dbt\mcp.yml, $env:USERPROFILE\.dbt\mcp.lock`

Затем перезапустите клиент.

</TabItem>

<TabItem value="tokens" label="Токены">

Дополнительный шаг аутентификации не требуется — ваш токен уже указан в конфигурации. Сервер подключается автоматически при запуске клиента MCP.

</TabItem>

</Tabs>

## Шаг 3. Проверьте настройку {#step-3-test-your-setup}

Задайте своему ИИ-ассистенту вопрос о данных (например, _«Какие модели есть в моем проекте dbt?»_ или _«Какие метрики определены в моем Semantic Layer?»_). Если dbt MCP работает, в ответе будут использованы ваши метаданные dbt.

## Доступные возможности {#whats-available}

При подключении к платформе ваш ИИ-ассистент может использовать:
- Запросы к Semantic Layer
- Discovery для метаданных (происхождение моделей, результаты тестов, свежесть источников)
- Admin API (запуск заданий, получение списка запусков и артефактов)
- Выполнение SQL и преобразование текста в SQL (требуется [PAT](/docs/dbt-apis/user-tokens))
- Все команды dbt, если вы добавили `DBT_PROJECT_DIR` и `DBT_PATH`

Полный список инструментов см. в разделе [Доступные инструменты](/docs/dbt-ai/mcp-available-tools).

:::tip Нужен только самостоятельно развернутый dbt CLI?
Если вам нужно только выполнять команды dbt локально (с аккаунтом <Constant name="dbt_platform"/> или без него), см. [Запуск самостоятельно развернутого dbt](/docs/dbt-ai/mcp-quickstart-cli).
:::

## Устранение неполадок {#troubleshooting}

<FAQ path="dbt-mcp/troubleshooting/uvx" />

<FAQ path="dbt-mcp/troubleshooting/oauth" />

<FAQ path="dbt-mcp/troubleshooting/server-not-starting" />

<FAQ path="dbt-mcp/troubleshooting/execute-sql" />

<FAQ path="dbt-mcp/troubleshooting/toolset-disabled" />

<FAQ path="dbt-mcp/troubleshooting/urls-vs-ids" />

<FAQ path="dbt-mcp/troubleshooting/multicell" />

Все темы по устранению неполадок см. в разделе [Часто задаваемые вопросы о dbt MCP и устранение неполадок](/docs/dbt-ai/mcp-troubleshooting).

## Следующие шаги {#next-steps}

- Выполняйте команды dbt локально: см. [Запуск самостоятельно развернутого dbt](/docs/dbt-ai/mcp-quickstart-cli)
- Настройте отдельные наборы инструментов: см. [Справочник переменных окружения](/docs/dbt-ai/mcp-environment-variables)
- Изучите требования наборов инструментов: см. [Настройка самостоятельно развернутого MCP](/docs/dbt-ai/setup-local-mcp#tool-requirements-at-a-glance)
