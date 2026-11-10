---
title: "Использование MCP-серверов с dbt Wizard CLI"
id: "wizard-mcp"
description: "Подключите dbt Wizard CLI к MCP-серверам, чтобы предоставить ему дополнительные инструменты и контекст."
sidebar_label: "Использование MCP-серверов"
tags: [AI, Wizard]
availability: local_all
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Использование MCP-серверов с <Constant name="wizard"/> CLI <Lifecycle status="beta"/>

<IntroText>
Model Context Protocol (MCP) подключает <Constant name="wizard" /> к внешним инструментам и контексту. Добавьте MCP-сервер, и <Constant name="wizard"/> сможет вызывать его инструменты прямо во время сеанса &mdash; запрашивать у dbt MCP-сервера метаданные проекта с соблюдением правил управления данными, открывать пул-реквесты через GitHub MCP-сервер или подключать любой другой MCP-совместимый сервис.
</IntroText>

<WizardFeedbackCallout />

Общие сведения о самом MCP см. во [введении в Model Context Protocol](https://modelcontextprotocol.io/introduction). Информацию о сервере, который поддерживает dbt, см. в разделе [dbt MCP-сервер](/docs/dbt-ai/about-mcp).

## Расположение файлов и приоритет

MCP-серверы настраиваются в секциях `[mcp_servers.NAME]` файла `config.toml`. Используйте конфигурацию уровня пользователя для серверов, которые нужны во всех локальных проектах, и конфигурацию уровня проекта для серверов, настройки которых должны храниться вместе с доверенным репозиторием.

В следующей таблице перечислены расположения, в которых <Constant name="wizard" /> ищет конфигурацию MCP-серверов. Для новых MCP-серверов используйте предназначенные для этого расположения, а расположения для совместимости сохраняйте только при переносе существующих настроек. Конфигурация MCP уровня проекта загружается только для доверенных проектов. Среди расположений уровня проекта текущий рабочий каталог имеет приоритет над родительскими каталогами. Серверы уровня проекта имеют приоритет над серверами уровня пользователя с тем же именем.

<SimpleTable>

| Расположение | Уровень | Использовать для новых MCP-серверов? | Приоритет |
| --- | --- | --- | --- |
| `.dbt/wizard/config.toml` | Проект | Да. Используйте здесь `[mcp_servers.NAME]` для MCP-серверов, общих для репозитория. | Расположение с наивысшим приоритетом для конфигурации MCP проекта; каталог, ближайший к текущему рабочему, имеет приоритет над родительскими каталогами. |
| `~/.dbt/wizard/config.toml` | Пользователь | Да. Используйте для MCP-серверов, которые нужны во всех локальных проектах. Команда `wizard mcp add` записывает настройки сюда. | Ниже конфигурации проекта, выше импортируемых настроек для совместимости. |
| `.mcp.json` | Проект | Нет. Импорт существующих настроек MCP для совместимости. | Импортируется вместе с конфигурацией проекта из того же каталога. |
| `~/.dbt/wizard/.mcp.json` | Пользователь | Нет. Импорт существующих настроек MCP для совместимости. | Импортируется вместе с конфигурацией пользователя; имеет приоритет над `~/.mcp.json`, если существуют оба файла. |
| `~/.mcp.json` | Пользователь | Нет. Импорт существующих настроек MCP для совместимости. | Резервный вариант уровня пользователя. |

</SimpleTable>

Не определяйте MCP-сервер с одним и тем же именем в нескольких расположениях, если только вы намеренно не хотите переопределить его настройками из расположения с более высоким приоритетом. Если файл совместимости `.mcp.json` и файл `config.toml` в одном каталоге определяют сервер с одинаковым именем, удалите дубликат и оставьте нужную запись в `config.toml`.

## Зачем использовать MCP-сервер

<Constant name="wizard"/> изначально понимает ваш проект dbt. MCP-сервер расширяет его возможности, предоставляя доступ к другим инструментам и системам, от которых зависит ваша работа, чтобы вы могли делать больше, не выходя из [сеанса](/docs/dbt-ai/wizard-how-it-works#sessions). Каждый добавленный сервер предоставляет <Constant name="wizard"/> новый набор инструментов, которые он может вызывать от вашего имени. Например:

- dbt MCP-сервер для доступа к моделям, метрикам и графу зависимостей с соблюдением правил управления данными.
- GitHub-сервер для чтения и проверки пул-реквестов.
- Сервер хранилища данных или другой сервер для получения контекста за пределами dbt.

CLI <Constant name="wizard"/> позволяет добавлять, удалять и настраивать MCP-серверы, проходить аутентификацию, а также задавать правила подтверждения для отдельных инструментов через файл `config.toml`.

:::info MCP-серверы доступны только в CLI
Настраивать MCP-серверы можно только в CLI <Constant name="wizard" />. Вы не можете добавлять собственные MCP-серверы в <Constant name="dbt_platform" /> (<Constant name="studio_ide" /> и приложение на главной странице), но <Constant name="wizard" /> включает встроенные инструменты dbt, такие как [навыки dbt Agent](https://github.com/dbt-labs/dbt-agent-skills) и получение документации по продукту через dbt MCP-сервер.
:::

## Поддерживаемые типы MCP-серверов

<Constant name="wizard" /> поддерживает два транспорта:

<SimpleTable>

| Тип | Описание |
|------|-------------|
| STDIO-сервер (стандартный ввод/вывод; сервер, который работает как программа на вашем компьютере, а не как сервис, к которому вы подключаетесь через интернет) | Работает как локальный процесс, который <Constant name="wizard"/> запускает командой (например, `npx` или `uvx`). Поддерживает переменные окружения. |
| Сервер с транспортом Streamable HTTP | Сервер, доступный по URL. Поддерживает аутентификацию с помощью bearer-токена и OAuth. |

</SimpleTable>

:::note Инструкции сервера
Для обоих транспортов <Constant name="wizard"/> читает поле `instructions`, которое сервер возвращает при инициализации, и использует его как общие указания для работы с инструментами.
:::

## Добавление MCP-сервера

Используйте команду `wizard mcp add` или отредактируйте `~/.dbt/wizard/config.toml` напрямую. В обоих случаях настройки `[mcp_servers.NAME]` записываются на уровне пользователя.

<Tabs>
<TabItem value="stdio" label="Добавление STDIO-сервера">

```bash
wizard mcp add SERVER_NAME --env VAR1=value1 -- COMMAND ARGS
```

Здесь:

- `SERVER_NAME` — выбранное вами имя сервера (например, `filesystem`).
- `--env VAR1=value1` — необязательный параметр, который можно указывать несколько раз; применяется только к STDIO-серверам.
- Всё после `--` — это команда, которую <Constant name="wizard"/> выполняет для запуска сервера, поэтому пробел после `--` указан намеренно.

Например, добавьте MCP-сервер для работы с файловой системой, который запускается локально через `npx`. Этому серверу не нужны переменные окружения, поэтому опустите `--env`:

```bash
wizard mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /Users/you/my-project
```

Чтобы подключить [dbt MCP-сервер](/docs/dbt-ai/about-mcp), используйте приведённый ниже вариант для Streamable HTTP — см. [dbt MCP-сервер](#dbt-mcp-server) в разделе примеров.

</TabItem>

<TabItem value="http" label="Добавление сервера Streamable HTTP">

```bash
wizard mcp add SERVER_NAME --url https://example.com/mcp --bearer-token-env-var MY_TOKEN
```

Чтобы увидеть все подкоманды MCP, выполните `wizard mcp --help`. Полный список флагов см. в [справочнике команд CLI](/docs/dbt-ai/wizard-cli-reference).

</TabItem>

<TabItem value="config" label="Прямое редактирование config.toml">

Вместо команды `wizard mcp add` вы можете самостоятельно отредактировать `config.toml`. <Constant name="wizard"/> хранит конфигурацию MCP уровня пользователя в `~/.dbt/wizard/config.toml` вместе с остальными настройками:

<File name='~/.dbt/wizard/config.toml'>

```toml
# STDIO-сервер (работает локально)
[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/my-project"]

# Сервер Streamable HTTP
[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
bearer_token_env_var = "GITHUB_MCP_TOKEN"
http_headers = { "X-Region" = "us-east-1" }
```

</File>

После редактирования `config.toml` перезапустите `wizard` — MCP-серверы загружаются при запуске сеанса. О порядке применения настроек см. в разделе [Приоритет конфигурации](/docs/dbt-ai/wizard-config#config-precedence).

</TabItem>

</Tabs>

## Ключи конфигурации

Эти ключи можно задать в блоке `[mcp_servers.NAME]` файла `config.toml`.

<SimpleTable>

| Ключ | Применяется к | Описание |
|-----|-----------|-------------|
| `command` | STDIO | Команда для запуска сервера (например, `uvx` или `npx`). |
| `args` | STDIO | Массив аргументов, передаваемых в `command`. |
| `env` | STDIO | Таблица переменных окружения, устанавливаемых при запуске сервера. |
| `env_vars` | STDIO | Имена существующих переменных окружения, которые нужно передать серверу. |
| `url` | HTTP | Конечная точка сервера с транспортом Streamable HTTP. |
| `bearer_token_env_var` | HTTP | Имя переменной окружения, из которой считывается bearer-токен. Передаётся как `Authorization: Bearer TOKEN`. |
| `http_headers` | HTTP | Таблица статических HTTP-заголовков, отправляемых с каждым запросом. |
| `env_http_headers` | HTTP | HTTP-заголовки, значения которых считываются из переменных окружения. |
| `scopes` | HTTP | Массив областей доступа OAuth, запрашиваемых при входе. Переопределяет области доступа, объявленные сервером. |
| `oauth.client_id` | HTTP | Идентификатор клиента OAuth, передаваемый при авторизации и обмене токенами. |
| `oauth_resource` | HTTP | Параметр ресурса OAuth, включаемый в запросы входа ([RFC 8707](https://datatracker.ietf.org/doc/html/rfc8707)). |
| `enabled` | Оба | Определяет, активен ли сервер. По умолчанию `true`. |
| `required` | Оба | Если задано `true`, `wizard exec` завершается с ошибкой, когда не удаётся инициализировать этот сервер. |
| `enabled_tools` | Оба | Список имён инструментов сервера, которые нужно сделать доступными. |
| `disabled_tools` | Оба | Список имён инструментов сервера, которые нужно скрыть. |
| `default_tools_approval_mode` | Оба | Режим подтверждения по умолчанию для инструментов этого сервера: `prompt` (спрашивать перед каждым вызовом) или `auto`/`approve` (выполнять без запроса; эти значения работают одинаково). |
| `startup_timeout_sec` | Оба | Время ожидания запуска сервера и получения списка его инструментов. |
| `tool_timeout_sec` | Оба | Время ожидания выполнения отдельного вызова инструмента. |

</SimpleTable>

Задавайте правила подтверждения для отдельных инструментов с помощью блока `[mcp_servers.NAME.tools.TOOL_NAME]` и параметра `approval_mode` со значением `auto`, `prompt` или `approve`:

```toml
[mcp_servers.github.tools.create_pull_request]
approval_mode = "approve"
```

## Аутентификация на сервере

Если сервер с транспортом Streamable HTTP использует OAuth, необходимо пройти аутентификацию из CLI, прежде чем <Constant name="wizard"/> сможет его использовать. Выполните:

```bash
wizard mcp login SERVER_NAME
wizard mcp logout SERVER_NAME
```

Чтобы запросить определённые области доступа при входе, передайте флаг CLI `--scopes` со списком через запятую. Он запрашивает те же области доступа, что и ключ `scopes` в `config.toml`, но только для этого входа:

```bash
wizard mcp login SERVER_NAME --scopes read,write
```

Для серверов, использующих статический токен, задайте в `bearer_token_env_var` имя переменной окружения, содержащей токен, и экспортируйте эту переменную перед запуском `wizard`.

## Управление MCP-серверами (CLI)

Управляйте настроенными серверами через CLI <Constant name="wizard" /> или напрямую редактируя `config.toml`. CLI предоставляет следующие команды:

<SimpleTable>

| Команда | Назначение |
|---------|-------------|
| `wizard mcp list` | Вывести список настроенных MCP-серверов. Добавьте `--json` для вывода в машиночитаемом формате. |
| `wizard mcp get NAME` | Показать конфигурацию одного сервера. |
| `wizard mcp add NAME ...` | Добавить STDIO-сервер или сервер с транспортом Streamable HTTP. |
| `wizard mcp remove NAME` | Удалить конфигурацию сервера. |
| `wizard mcp login NAME` | Пройти аутентификацию на сервере OAuth. |
| `wizard mcp logout NAME` | Выйти из учётной записи на сервере OAuth. |

</SimpleTable>

## Подтверждения и разрешения для инструментов {#approvals-and-tool-permissions}

Вызовы инструментов MCP подчиняются тем же правилам [подтверждения и изоляции](/docs/dbt-ai/wizard-how-it-works#approval-and-sandboxing), что и остальные действия <Constant name="wizard" />. Задайте `enabled_tools` и `disabled_tools` в `config.toml`, чтобы управлять тем, какие инструменты предоставляет сервер (отдельного флага CLI для этого нет). Так <Constant name="wizard"/> будет вызывать только те инструменты, которые вы разрешили.

## Примеры

Следующие примеры показывают распространённые сценарии добавления MCP-сервера и их настройку.

### dbt MCP-сервер {#dbt-mcp-server}

[dbt MCP-сервер](/docs/dbt-ai/about-mcp) предоставляет <Constant name="wizard"/> доступ к моделям, метрикам, графу зависимостей, сведениям об актуальности данных и API платформы вашего проекта с соблюдением правил управления данными. Подключить его можно двумя способами:

<Tabs>
<TabItem value="local" label="Собственное размещение (учётная запись не требуется)" default>

Работает на вашем компьютере через `uvx` как с учётной записью <Constant name="dbt_platform" />, так и без неё — оптимальный вариант для разработки:

```bash
wizard mcp add dbt -- uvx dbt-mcp
```

Сервер с собственным размещением считывает настройки подключения (такие как `DBT_HOST`, `DBT_TOKEN` и `DBT_PROJECT_DIR`) из переменных окружения, обычно из файла `.env` в корневом каталоге вашего проекта dbt. URL не требуется. Инструкции по настройке см. в разделах [Запуск dbt с собственным размещением](/docs/dbt-ai/mcp-quickstart-cli) и [Настройка MCP с собственным размещением](/docs/dbt-ai/setup-local-mcp).

</TabItem>
<TabItem value="remote" label="Удалённый сервер (учётная запись dbt platform)">

Размещён на dbt platform. Сформируйте URL на основе адреса хоста вашей платформы (`https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/`, например `https://cloud.getdbt.com/api/ai/v1/mcp/`), затем пройдите аутентификацию:

```bash
wizard mcp add dbt --url https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/
wizard mcp login dbt
```

О том, как найти адрес хоста и токен, см. в разделах [Подключение к удалённому dbt MCP-серверу](/docs/dbt-ai/mcp-quickstart-remote) и [Подключения и аутентификация (MCP)](/docs/dbt-ai/wizard-how-it-works#connections-and-authentication-mcp).

</TabItem>
</Tabs>

Затем отправьте запрос <Constant name="wizard"/>:

```
Use the dbt MCP server to find the most recent failed run for the
nightly job and summarize the error.
```

### MCP-сервер Fivetran Agent Context

Подключите <Constant name="wizard"/> к [MCP-серверу Fivetran Agent Context](https://fivetran.com/docs/context-layer/agent-context-mcp), который предоставляет Wizard доступ к контекстному слою Fivetran вашей организации, чтобы он мог отвечать на вопросы с учётом ваших бизнес-определений, метрик и операционных данных. Добавьте его следующей командой:

```bash
wizard mcp add AgentContext \
  --url "https://api.fivetran.ai/mcp"
```
Затем Wizard предложит вам авторизовать подключение. Следуйте подсказкам, чтобы завершить подключение.

Если ваша организация использует системные ключи, сначала задайте API-ключ в переменной окружения, а затем укажите её в команде:

```bash
export FIVETRAN_AI_API_KEY=YOUR_API_KEY
wizard mcp add AgentContext --url "https://api.fivetran.ai/mcp" --bearer-token-env-var FIVETRAN_AI_API_KEY
```

### GitHub MCP-сервер для проверки пул-реквестов

Подключите GitHub MCP-сервер, чтобы <Constant name="wizard"/> мог читать пул-реквесты и оставлять комментарии при проверке:

<File name='~/.dbt/wizard/config.toml'>

```toml
[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
# Это ИМЯ переменной окружения, а не сам токен.
# Не храните настоящий токен в этом файле.
bearer_token_env_var = "GITHUB_MCP_TOKEN"
```

</File>

Затем перед запуском <Constant name="wizard"/> задайте в этой переменной окружения свой настоящий токен:

```bash
export GITHUB_MCP_TOKEN="your-real-token-here"
```

Во время работы <Constant name="wizard"/> считывает токен из окружения и отправляет его как `Authorization: Bearer <the token>`. Храните в `config.toml` только имя переменной, чтобы секрет не попадал в конфигурацию, которую вы сохраняете в репозитории.

```
Review the dbt model changes in PR #482 — check for missing tests on
new columns and confirm downstream refs still resolve.
```

## Связанная документация

- [dbt MCP-сервер](/docs/dbt-ai/about-mcp): сервер, который поддерживает dbt, и доступные в нём инструменты
- [Использование субагентов с <Constant name="wizard" />](/docs/dbt-ai/wizard-subagents): делегирование работы специализированным агентам
- [Конфигурация CLI <Constant name="wizard" />](/docs/dbt-ai/wizard-config): ключи `config.toml` и их приоритет
- [Справочник команд CLI <Constant name="wizard" />](/docs/dbt-ai/wizard-cli-reference): флаги и подкоманды `wizard mcp`
- [Как работает <Constant name="wizard" />](/docs/dbt-ai/wizard-how-it-works): подтверждения и изоляция
