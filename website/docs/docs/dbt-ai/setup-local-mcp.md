---
title: "Настройка локального MCP"
sidebar_label: "Настройка локального MCP"
description: "Узнайте, как настроить локальный сервер dbt-mcp"
id: "setup-local-mcp"
---

import MCPExample from '/snippets/_mcp-config-files.md';

[Локальный сервер dbt MCP](https://github.com/dbt-labs/dbt-mcp) запускается на вашей машине и поддерживает <Constant name="core" />, <Constant name="fusion_engine" /> и <Constant name="cloud_cli" />. Вы можете использовать его как с учетной записью <Constant name="dbt_platform" />, так и без неё.

## Предварительные требования

- [Установите uv](https://docs.astral.sh/uv/getting-started/installation/), чтобы иметь возможность запускать `dbt-mcp` и [связанные зависимости](https://github.com/dbt-labs/dbt-mcp/blob/main/pyproject.toml) в изолированном виртуальном окружении.
- Иметь локальный проект dbt (если вы хотите использовать команды dbt CLI).

## Варианты настройки

Выберите способ настройки, который лучше всего подходит под ваш рабочий процесс:

### OAuth-аутентификация с dbt platform <Lifecycle status="managed, managed_plus" />

Этот метод использует OAuth для аутентификации в вашей учетной записи <Constant name="dbt_platform" />. Это самый простой вариант настройки, который не требует ручного управления токенами или переменными окружения.

:::info Требуются статические поддомены

Только учетные записи со статическими поддоменами (например, `abc123.us1.dbt.com`) могут использовать OAuth с MCP-серверами. Все учетные записи находятся в процессе миграции на статические поддомены до декабря 2025 года. Для получения дополнительной информации обратитесь в службу поддержки.

:::

#### Параметры конфигурации

<MCPExample />

После настройки ваша сессия подключается к учетной записи dbt platform, запускает процесс OAuth-аутентификации, а затем открывает вашу учетную запись, где вы можете выбрать проект, на который хотите ссылаться.

<Lightbox src="/img/mcp/select-project.png" width="60%" title="Выбор проекта dbt platform"/>

После завершения настройки OAuth перейдите к разделу [Проверка конфигурации](#optional-test-your-configuration).

### Только CLI (без dbt platform)

Если вы используете CLI <Constant name="core" /> или <Constant name="fusion" /> и вам не нужен доступ к возможностям <Constant name="dbt_platform" /> (Discovery API, Semantic Layer, Administrative API), вы можете настроить локальный MCP, указав только информацию о вашем проекте dbt.

Добавьте следующую конфигурацию в ваш MCP-клиент (точное расположение файлов см. в соответствующих [руководствах по интеграции](#set-up-your-mcp-client)):

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

#### Определение путей

Следуйте инструкциям для вашей ОС, чтобы определить нужные пути:

<Expandable alt_header="macOS/Linux" >

- **DBT_PROJECT_DIR**: Полный путь к папке с вашим проектом dbt  
   - Пример: `/Users/yourname/dbt-projects/my_project`
   - Это папка, содержащая файл `dbt_project.yml`.

- **DBT_PATH**: Найдите путь к исполняемому файлу dbt, выполнив в терминале:
   ```bash
   which dbt
   ```
   - Пример вывода: `/opt/homebrew/bin/dbt`
   - Используйте именно этот путь в конфигурации.

</Expandable>

<Expandable alt_header="Windows" >

- **DBT_PROJECT_DIR**: Полный путь к папке с вашим проектом dbt  
   - Пример: `C:\Users\yourname\dbt-projects\my_project`
   - Это папка, содержащая файл `dbt_project.yml`.
   - Используйте прямые слеши или экранированные обратные слеши: `C:/Users/yourname/dbt-projects/my_project`

- **DBT_PATH**: Найдите путь к исполняемому файлу dbt, выполнив команду в Command Prompt или PowerShell:
   ```bash
   where dbt
   ```
   - Пример вывода: `C:\Python39\Scripts\dbt.exe`
   - Используйте прямые слеши или экранированные обратные слеши: `C:/Python39/Scripts/dbt.exe`

</Expandable>

После завершения этой настройки перейдите к разделу [Проверка конфигурации](#optional-test-your-configuration).

### Настройка через переменные окружения

Если вам нужно настроить несколько переменных окружения или вы предпочитаете управлять ими отдельно, вы можете использовать переменные окружения. Если вы используете только команды dbt CLI, вам не нужно указывать переменные окружения, специфичные для dbt platform, и наоборот.

Пример файла:

```code
DBT_HOST=cloud.getdbt.com
DBT_PROD_ENV_ID=your-production-environment-id
DBT_DEV_ENV_ID=your-development-environment-id
DBT_USER_ID=your-user-id
DBT_ACCOUNT_ID=your-account-id
DBT_TOKEN=your-service-token
DBT_PROJECT_DIR=/path/to/your/dbt/project
DBT_PATH=/path/to/your/dbt/executable
MULTICELL_ACCOUNT_PREFIX=your-account-prefix
```

Этот файл потребуется для интеграции с инструментами, совместимыми с MCP.

## Настройки API и SQL-инструментов

| Переменная окружения | Обязательна | Описание |
| --- | --- | --- |
| `DBT_HOST` | Обязательна | Имя хоста вашего [инстанса <Constant name="dbt_platform" />](/docs/cloud/about-cloud/access-regions-ip-addresses). **Важно:** для Multi-cell учетных записей не включайте префикс учетной записи в hostname. Значение по умолчанию — `cloud.getdbt.com`. |
| MULTICELL_ACCOUNT_PREFIX | Требуется только для Multi-cell инстансов | Укажите здесь префикс вашей Multi-cell учетной записи (не в DBT_HOST). Если вы не используете Multi-cell, не задавайте это значение. Подробнее о регионах и хостинге см. [здесь](/docs/cloud/about-cloud/access-regions-ip-addresses). |
| DBT_TOKEN | Обязательна | Ваш персональный access token или service token из <Constant name="dbt_platform" />. <br/>**Примечание**: при использовании Semantic Layer рекомендуется использовать персональный access token. Если вы используете service token, убедитесь, что у него есть как минимум разрешения `Semantic Layer Only`, `Metadata Only` и `Developer`. |
| DBT_ACCOUNT_ID | Требуется для инструментов Administrative API | Ваш [ID учетной записи dbt](/faqs/Accounts/find-user-id) |
| DBT_PROD_ENV_ID | Обязательна | ID production-окружения <Constant name="dbt_platform" /> |
| DBT_DEV_ENV_ID | Необязательна | ID development-окружения <Constant name="dbt_platform" /> |
| DBT_USER_ID | Необязательна | Ваш user ID в <Constant name="dbt_platform" /> ([документация](/faqs/Accounts/find-user-id)) |

**Примеры конфигурации Multi-cell:**

✅ **Корректная конфигурация:**
```bash
DBT_HOST=us1.dbt.com
MULTICELL_ACCOUNT_PREFIX=abc123
```

❌ **Некорректная конфигурация (распространённая ошибка):**
```bash
DBT_HOST=abc123.us1.dbt.com  # Не включайте префикс в host!
# MULTICELL_ACCOUNT_PREFIX не задан
```

Если ваш полный URL — `abc123.us1.dbt.com`, разделите его так:
- `DBT_HOST=us1.dbt.com`
- `MULTICELL_ACCOUNT_PREFIX=abc123`

## Настройки dbt CLI

Локальный dbt-mcp поддерживает все варианты dbt, включая <Constant name="core" /> и <Constant name="fusion_engine" />.

| Переменная окружения | Обязательна | Описание | Пример |
| --- | --- | --- | --- |
| `DBT_PROJECT_DIR` | Обязательна | Полный путь к локальному репозиторию вашего проекта dbt. Это папка, содержащая файл `dbt_project.yml`. | macOS/Linux: `/Users/myname/reponame`<br/>Windows: `C:/Users/myname/reponame` |
| DBT_PATH | Обязательна | Полный путь к исполняемому файлу dbt (<Constant name="core" />/<Constant name="fusion" />/<Constant name="cloud_cli" />). См. следующий раздел для поиска этого пути. | macOS/Linux: `/opt/homebrew/bin/dbt`<br/>Windows: `C:/Python39/Scripts/dbt.exe` |
| DBT_CLI_TIMEOUT | Необязательна | Количество секунд до тайм-аута выполнения команд dbt CLI агентом. | По умолчанию 60 секунд. |

### Определение `DBT_PATH`

Следуйте инструкциям для вашей ОС, чтобы найти `DBT_PATH`:

<Expandable alt_header="macOS/Linux" >

Выполните команду в терминале:
```bash
which dbt
```
Пример вывода: `/opt/homebrew/bin/dbt`

</Expandable>

<Expandable alt_header="Windows" >

Выполните команду в Command Prompt или PowerShell:
```bash
where dbt
```
Пример вывода: `C:\Python39\Scripts\dbt.exe`

**Примечание:** используйте прямые слеши в конфигурации: `C:/Python39/Scripts/dbt.exe`

</Expandable>

**Дополнительные примечания:**

- Вы можете задавать любые переменные окружения, поддерживаемые вашим исполняемым файлом dbt, например [поддерживаемые в <Constant name="core" />](/reference/global-configs/about-global-configs#available-flags).
- dbt MCP учитывает стандартные переменные окружения и флаги для сбора статистики использования, описанные [здесь](/reference/global-configs/usage-stats).
- `DBT_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}'` устанавливается автоматически, чтобы MCP-сервер понимал, что при выполнении команды dbt не был выбран ни один узел. При необходимости вы можете переопределить это значение, однако оно обеспечивает более удобную работу при вызове dbt из MCP-сервера, гарантируя выбор корректных узлов.

## Отключение инструментов

Вы можете отключить следующий доступ к инструментам в локальном `dbt-mcp`:

| Название | По умолчанию | Описание |
| ------------------------ | ------- | ------------------------------------------------------------------------------- |
| `DISABLE_DBT_CLI` | `false` | Установите `true`, чтобы отключить MCP-инструменты <Constant name="core" />, <Constant name="cloud_cli" /> и dbt <Constant name="fusion" />. |
| `DISABLE_SEMANTIC_LAYER` | `false` | Установите `true`, чтобы отключить MCP-инструменты dbt Semantic Layer. |
| `DISABLE_DISCOVERY` | `false` | Установите `true`, чтобы отключить MCP-инструменты dbt Discovery API. |
| `DISABLE_ADMIN_API` | `false` | Установите `true`, чтобы отключить MCP-инструменты dbt Administrative API. |
| `DISABLE_SQL` | `true` | Установите `false`, чтобы включить SQL MCP-инструменты. |
| `DISABLE_DBT_CODEGEN` | `true` | Установите `false`, чтобы включить [MCP-инструменты dbt codegen](/docs/dbt-ai/about-mcp#codegen-tools) (требуется пакет dbt-codegen). |
| `DISABLE_TOOLS` | "" | Укажите список имён инструментов, разделённых `,`, чтобы отключить конкретные инструменты. |

#### Использование переменных окружения в конфигурации MCP-клиента

Рекомендуемый способ настройки MCP-клиента — использовать поле `env` в вашем JSON-файле конфигурации. Это позволяет хранить всю конфигурацию в одном файле:

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

#### Использование файла `.env`

Если вы предпочитаете управлять переменными окружения в отдельном файле, вы можете создать файл `.env` и сослаться на него:

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

Однако этот подход требует управления двумя файлами вместо одного.

## (Необязательно) Проверка конфигурации

В командной строке выполните следующее, чтобы проверить настройку:

**Если используется поле `env` в JSON:**
```bash
export DBT_PROJECT_DIR=/path/to/project
export DBT_PATH=/path/to/dbt
uvx dbt-mcp
```

**Если используется файл `.env`:**
```bash
uvx --env-file <path-to-.env-file> dbt-mcp
```

Если ошибок нет, значит конфигурация настроена корректно.

## Настройка MCP-клиента

После завершения конфигурации следуйте соответствующему руководству по интеграции для выбранного инструмента:
- [Claude](/docs/dbt-ai/integrate-mcp-claude)
- [Cursor](/docs/dbt-ai/integrate-mcp-cursor)
- [VS Code](/docs/dbt-ai/integrate-mcp-vscode)

## Отладочные настройки

Эти параметры позволяют настроить уровень логирования MCP-сервера для диагностики и устранения проблем.

| Название | По умолчанию | Описание |
| ------------------------ | ------- | ------------------------------------------------------------------------------- |
| `DBT_MCP_LOG_LEVEL` | `INFO` | Переменная окружения для переопределения уровня логирования MCP-сервера. Возможные значения: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`. |

Чтобы увидеть больше деталей о работе MCP-сервера и упростить отладку, вы можете временно установить уровень логирования `DEBUG`. Рекомендуется использовать его временно, чтобы избежать переполнения диска логами.

## Устранение неполадок

#### Не удаётся найти исполняемый файл `uvx`

Некоторые MCP-клиенты могут не находить `uvx` из JSON-конфигурации. Это приводит к ошибкам вида `Could not connect to MCP server dbt-mcp`, `Error: spawn uvx ENOENT` и подобным.

**Решение:** найдите полный путь к `uvx` и укажите его в конфигурации:

- **macOS/Linux:** выполните `which uvx` в терминале.
- **Windows:** выполните `where uvx` в CMD или PowerShell.

Затем обновите JSON-конфигурацию, указав полный путь:
```json
{
  "mcpServers": {
    "dbt": {
      "command": "/full/path/to/uvx", # Например, на macOS с Homebrew: "command": "/opt/homebrew/bin/uvx"
      "args": ["dbt-mcp"],
      "env": { ... }
    }
  }
}
```
