Это краткое руководство поможет вам подключить сервер dbt MCP к локальному проекту dbt. Такая настройка позволит вашему ИИ-ассистенту использовать инструменты команд dbt (`run`, `build`, `test`, `compile` и другие). 

Если вы хотите подключиться к <Constant name="dbt_platform"/> с помощью CLI, см. [краткое руководство по OAuth](/docs/dbt-ai/mcp-quickstart-oauth).

Чтобы подключиться к <Constant name="wizard" />, см. [обзор dbt Wizard](/docs/platform/wizard-overview#get-started).

:::tip Клонировать репозиторий не нужно
Вам не нужно клонировать репозиторий dbt-mcp. Установите [uv](https://docs.astral.sh/uv/getting-started/installation/) и выполните `uvx dbt-mcp` — эта команда загрузит и запустит dbt-mcp.
:::

## Предварительные требования {#prerequisites}

- [Установите uv](https://docs.astral.sh/uv/getting-started/installation/)
- Локальный проект dbt (папка, содержащая файл `dbt_project.yml`)
- Установленный и доступный локально dbt

Полный список переменных окружения и инструкции по включению и отключению наборов инструментов см. в [справочнике переменных окружения](/docs/dbt-ai/mcp-environment-variables).

## Шаг 1. Определите пути {#step-1-find-your-paths}

Перед настройкой MCP-клиента вам понадобятся два значения:

 - `DBT_PROJECT_DIR` — полный путь к папке вашего проекта dbt (где находится `dbt_project.yml`). Например, если ваш проект называется `jaffle_shop`, путь должен быть `/Users/yourname/dbt-projects/jaffle_shop`.
 - `DBT_PATH` — полный путь к исполняемому файлу dbt.

<Tabs>
<TabItem value="mac-linux" label="macOS/Linux">

```bash
# Find DBT_PATH
which dbt
# Example output: /opt/homebrew/bin/dbt

# Find DBT_PROJECT_DIR — run from inside your project folder
pwd
# Example output: /Users/yourname/projects/my_dbt_project
```

</TabItem>

<TabItem value="windows" label="Windows">

```bash
# Find DBT_PATH
where dbt
# Example output: C:\Python39\Scripts\dbt.exe

# Find DBT_PROJECT_DIR — run from inside your project folder
cd
# Example output: C:\Users\yourname\projects\my_dbt_project
```

Примечание: используйте прямые косые черты в конфигурации: `C:/Python39/Scripts/dbt.exe`

</TabItem>

</Tabs>

## Шаг 2. Добавьте сервер в MCP-клиент {#step-2-add-to-your-mcp-client}

Замените пути ниже значениями из шага 1:

<Tabs>

<TabItem value="claude-desktop" label="Claude Desktop">

1. В Claude Desktop перейдите в **Settings** → вкладка **Developer** → **Edit Config**.
2. Вставьте следующую конфигурацию, заменив пути фактическими значениями:

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

3. Сохраните изменения и перезапустите Claude Desktop.

Расположение файла конфигурации:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

</TabItem>

<TabItem value="claude-code" label="Claude Code">

Выполните эту команду, заменив пути фактическими значениями:

```shell
claude mcp add dbt \
-e DBT_PROJECT_DIR=/path/to/your/dbt/project \
-e DBT_PATH=/path/to/your/dbt/executable \
-- uvx dbt-mcp
```

</TabItem>

<TabItem value="cursor" label="Cursor">

Откройте Cursor и нажмите ссылку ниже для автоматической настройки:

[Добавить <Constant name="core"/> или <Constant name="fusion"/> в Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX1BST0pFQ1RfRElSIjoiL3BhdGgvdG8veW91ci9kYnQvcHJvamVjdCIsIkRCVF9QQVRIIjoiL3BhdGgvdG8veW91ci9kYnQvZXhlY3V0YWJsZSJ9LCJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJkYnQtbWNwIl19)

После нажатия:
1. Укажите в `DBT_PROJECT_DIR` полный путь к вашему проекту dbt.
2. Укажите в `DBT_PATH` полный путь к исполняемому файлу dbt (из шага 1).
3. Сохраните конфигурацию.

</TabItem>

<TabItem value="vscode" label="VS Code">

1. Откройте **Settings** → **Features** → **Chat** и убедитесь, что **MCP** включён.
2. Откройте палитру команд (`Ctrl/Cmd + Shift + P`) и выберите **MCP: Open User Configuration**.
3. Добавьте следующую конфигурацию в `mcp.json`, заменив пути фактическими значениями:

:::note VS Code использует `"servers"`, а не `"mcpServers"`
:::

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

4. Сохраните файл.

</TabItem>

</Tabs>

## Шаг 3. Проверьте настройку {#step-3-test-your-setup}

Попросите ИИ-ассистента выполнить команду dbt (например, _«Выполни `dbt compile` для моего проекта»_ или _«Выведи список всех моделей в моём проекте»_). Если dbt MCP работает, ассистент выполнит команду для вашего локального проекта.

<Expandable alt_header="Необязательно: проверка из командной строки">

```bash
uvx dbt-mcp
```

Если ошибок нет, конфигурация верна. Нажмите `Ctrl+C`, чтобы остановить сервер.

</Expandable>

## Доступные возможности {#whats-available}

При настройке только через CLI ваш ИИ-ассистент может использовать:
- `dbt run`, `dbt build`, `dbt test`, `dbt compile`, `dbt list`, `dbt parse`, `dbt show`
- Информацию о происхождении и зависимостях моделей и сведения об узлах вашего локального проекта
- Инструменты Codegen (если включены — см. [справочник переменных окружения](/docs/dbt-ai/mcp-environment-variables))

Для таких возможностей платформы, как <Constant name="semantic_layer" />, Discovery API и запросы к метаданным, требуется учётная запись <Constant name="dbt_platform" />. Чтобы добавить их, см. [Подключение к <Constant name="dbt_platform"/>](/docs/dbt-ai/mcp-quickstart-oauth).

## Устранение неполадок {#troubleshooting}

<FAQ path="dbt-mcp/troubleshooting/uvx" />

<FAQ path="dbt-mcp/troubleshooting/server-not-starting" />

Все темы по устранению неполадок см. в разделе [Часто задаваемые вопросы о dbt MCP и устранение неполадок](/docs/dbt-ai/mcp-troubleshooting).

## Дальнейшие шаги {#next-steps}

- Добавьте возможности <Constant name="dbt_platform" />: см. [Подключение к <Constant name="dbt_platform"/>](/docs/dbt-ai/mcp-quickstart-oauth)
- Настройте наборы инструментов или отключите отдельные инструменты: см. [справочник переменных окружения](/docs/dbt-ai/mcp-environment-variables)
