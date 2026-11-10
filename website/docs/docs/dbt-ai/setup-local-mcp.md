---
title: "Настройка MCP на собственной инфраструктуре"
sidebar_label: "Настройка MCP на собственной инфраструктуре"
description: "Узнайте, как настроить сервер dbt-mcp на собственной инфраструктуре"
id: "setup-local-mcp"
availability:
  surface: local
---

import MCPExample from '/snippets/_mcp-config-files.md';
import StaticSubdomainRequired from '/snippets/_static-subdomain-required.md';

[Локальный MCP-сервер dbt](https://github.com/dbt-labs/dbt-mcp) работает на вашем компьютере и поддерживает <Constant name="core" />, <Constant name="fusion_engine" /> и <Constant name="platform_cli" />. Его можно использовать как с учетной записью <Constant name="dbt_platform" />, так и без нее.

:::note Клонирование не требуется
Для использования локального MCP-сервера не нужно клонировать репозиторий dbt-mcp. [Установите uv](https://docs.astral.sh/uv/getting-started/installation/) и выполните `uvx dbt-mcp` — эта команда загрузит и запустит dbt-mcp. 

Если вы хотите внести свой вклад в dbt MCP, клонируйте [репозиторий dbt-mcp](https://github.com/dbt-labs/dbt-mcp) и присоединяйтесь к разработке!
:::

## Краткий обзор требований к инструментам {#tool-requirements-at-a-glance}

В этой таблице указано, что требуется каждому набору инструментов и может ли он работать с учетной записью <Constant name="dbt_platform" /> или без нее:

| Набор инструментов | Обязательные переменные | Работает с учетной записью <Constant name="dbt_platform" /> | Работает без учетной записи <Constant name="dbt_platform" /> |
| --- | --- | --- | --- |
| dbt CLI | `DBT_PROJECT_DIR`, `DBT_PATH` | Да | Да |
| Semantic Layer | `DBT_HOST`, `DBT_TOKEN`, `DBT_PROD_ENV_ID` | Да | Нет |
| Discovery API | `DBT_HOST`, `DBT_TOKEN`, `DBT_PROD_ENV_ID` | Да | Нет |
| Admin API | `DBT_HOST`, `DBT_TOKEN`, `DBT_ACCOUNT_ID` | Да | Нет |
| Выполнение SQL (`execute_sql`) | Персональный токен доступа, `DBT_DEV_ENV_ID`, `DBT_USER_ID` | Да | Нет |
| Codegen | `DBT_PROJECT_DIR`, `DBT_PATH` и `DISABLE_DBT_CODEGEN=false` | Да | Да |
| LSP / <Constant name="fusion" /> | `DBT_PROJECT_DIR`, `DBT_PATH` и расширение dbt для VS Code | Да | Да |

:::note Наборы инструментов автоматически отключаются при отсутствии обязательных переменных
Если обязательная переменная не задана, dbt-mcp автоматически отключит соответствующий набор инструментов, а не выдаст ошибку. Например, если `DBT_HOST` не настроена, наборы инструментов Semantic Layer, Discovery и Admin API будут недоступны. Чтобы проверить, какие наборы инструментов активны, задайте `DBT_MCP_LOG_LEVEL=DEBUG` в своей среде и проверьте [журналы сервера](#debug-configurations).
:::

## Предварительные требования {#prerequisites}

- [Установите uv](https://docs.astral.sh/uv/getting-started/installation/), чтобы иметь возможность запускать `dbt-mcp` и [связанные зависимости](https://github.com/dbt-labs/dbt-mcp/blob/main/pyproject.toml) в изолированном виртуальном окружении.
- Иметь локальный проект dbt (если вы хотите использовать команды dbt CLI).

## Выберите способ аутентификации {#choose-your-auth-method}

Если вы подключаетесь к функциям <Constant name="dbt_platform" /> (<Constant name="semantic_layer" />, Discovery API, Admin API или выполнение SQL), вам необходимо пройти аутентификацию. Используйте эту таблицу, чтобы выбрать подходящий способ:

| Если вам нужно... | Используйте... |
| --- | --- |
| Максимально быстрая первоначальная настройка | **OAuth** |
| Инструмент `execute_sql` | **Персональный токен доступа (PAT)**. Сервисные токены _не работают_ с `execute_sql` |
| Общая настройка или настройка для команды | **Сервисный токен** |
| CI или автоматизация | **Сервисный токен** |

:::warning Для `execute_sql` требуется PAT
Инструмент `execute_sql` _не работает_ с сервисными токенами. При использовании этого инструмента необходимо указать [персональный токен доступа (PAT)](/docs/dbt-apis/user-tokens) в качестве значения `DBT_TOKEN`.
:::

## Варианты настройки

Выберите способ настройки, который лучше всего подходит под ваш рабочий процесс:

### Аутентификация OAuth на платформе dbt <Lifecycle status="self_service, managed, managed_plus" /> {#dbt-platform-authentication}

Этот метод использует OAuth для аутентификации в вашей учетной записи <Constant name="dbt_platform" />. Это самый простой вариант настройки, который не требует ручного управления токенами или переменными окружения.

<StaticSubdomainRequired />

#### Параметры конфигурации {#configuration-options}

<MCPExample />

После настройки ваш сеанс подключается к аккаунту <Constant name="dbt_platform"/>, запускает процесс аутентификации OAuth, а затем открывает ваш аккаунт, где вы можете выбрать проект, на который хотите сослаться.

<Lightbox src="/img/mcp/select-project.png" width="60%" title="Выбор проекта dbt platform"/>

После завершения настройки OAuth перейдите к разделу [Проверка конфигурации](#optional-test-your-configuration).

### Только CLI (без платформы dbt) {#cli-only}

Этот вариант запускает MCP-сервер локально и подключает его к вашему локальному проекту dbt с помощью `DBT_PROJECT_DIR` и `DBT_PATH`.

Если вы используете <Constant name="core_v1" /> или <Constant name="fusion" /> и вам не нужен доступ к возможностям <Constant name="dbt_platform" /> (Discovery API, Semantic Layer, Administrative API), вы можете настроить локальный MCP, указав только информацию о вашем проекте dbt.

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

#### Определение путей {#locating-your-paths}

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

### Настройка через переменные окружения {#environment-variable-configuration}

Если вам нужно настроить несколько переменных окружения или вы предпочитаете управлять ими отдельно, можно использовать файл `.env` или передать их непосредственно в командной строке. Достаточно указать только переменные, необходимые для вашей конфигурации: переменные dbt CLI, если вы используете только CLI, или переменные <Constant name="dbt_platform" /> для функций платформы. Полный список переменных, сведения о включении и отключении наборов инструментов, а также параметры логирования см. в [справочнике переменных окружения](/docs/dbt-ai/mcp-environment-variables).

:::tip Где разместить файл `.env`
Создайте файл `.env` в _корневом каталоге проекта dbt_ (в той же папке, что и `dbt_project.yml`). При указании файла с помощью `--env-file` всегда _используйте абсолютный путь_, чтобы ваш MCP-клиент мог надежно его найти. Например, `/absolute/path/to/your-dbt-project/.env`.
:::

Выберите пример `.env`, соответствующий вашей конфигурации. Включайте только необходимые переменные:

<Tabs>
<TabItem value="cli-only" label="Только CLI">

Используйте этот вариант, если вы выполняете команды dbt локально и вам не нужны функции <Constant name="dbt_platform" /> (Discovery API, Semantic Layer и т. д.):

```code
DBT_PROJECT_DIR=/path/to/your/dbt/project
DBT_PATH=/path/to/your/dbt/executable
```

</TabItem>
<TabItem value="platform-only" label="Только dbt platform">

Используйте этот вариант, если вам нужны только функции <Constant name="dbt_platform" /> и вы не будете выполнять команды dbt:

```code
DBT_HOST=cloud.getdbt.com
DBT_TOKEN=dbtc_your_token
DBT_PROD_ENV_ID=12345
```

</TabItem>
<TabItem value="both" label="CLI и dbt platform (самый распространенный вариант)">

Используйте этот вариант, если вам нужны и команды dbt CLI, и функции <Constant name="dbt_platform" />:

```code
DBT_PROJECT_DIR=/path/to/your/dbt/project
DBT_PATH=/path/to/your/dbt/executable
DBT_HOST=cloud.getdbt.com
DBT_TOKEN=dbtc_your_token
DBT_PROD_ENV_ID=12345
```

</TabItem>
<TabItem value="full" label="Все переменные">

Полный справочник всех доступных переменных. Для большинства конфигураций нужна лишь часть из них &mdash; подробные сведения о каждой переменной см. в таблицах [Настройки инструментов API и SQL](#api-and-sql-tool-settings) и [Настройки dbt CLI](#cli-only).

```code
DBT_HOST=cloud.getdbt.com
DBT_PROD_ENV_ID=your-production-environment-id
DBT_DEV_ENV_ID=your-development-environment-id
DBT_USER_ID=your-user-id
DBT_ACCOUNT_ID=your-account-id
DBT_TOKEN=your-service-token
DBT_PROJECT_DIR=/path/to/your/dbt/project
DBT_PATH=/path/to/your/dbt/executable
```
</TabItem>
</Tabs>

#### Как передать переменные окружения в dbt-mcp

Ниже приведены несколько способов передачи переменных окружения. Для большинства конфигураций мы рекомендуем использовать файл `.env` с параметром `--env-file`:

<Tabs>
<TabItem value="env-file" label="Файл .env с параметром `--env-file`">

**1. Файл `.env` с параметром `--env-file` (рекомендуется)** (обязательно укажите абсолютный путь в `args`):

Укажите абсолютный путь к файлу в конфигурации MCP-клиента:

```json
{
  "mcpServers": {
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

Замените `/absolute/path/to/your-dbt-project` полным путём к папке, содержащей ваш файл `dbt_project.yml`.
</TabItem>
<TabItem value="inline" label="Непосредственно в конфигурации MCP-клиента">

**2. Непосредственно в конфигурации MCP-клиента**:

Передайте переменные непосредственно в поле `env`, заменив значения своими фактическими значениями. Это позволяет хранить всё в одном файле, но при этом токены будут храниться в конфигурации клиента:

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
</TabItem>
<TabItem value="shell" label="Переменные окружения оболочки">

**3. Переменные окружения оболочки**

Экспортируйте переменные в терминале перед запуском MCP-клиента, заменив значения своими фактическими значениями:

```bash
export DBT_HOST=cloud.getdbt.com
export DBT_TOKEN=your-token-here
export DBT_PROJECT_DIR=/path/to/project
uvx dbt-mcp
```
</TabItem>
</Tabs>

### Настройки инструментов API и SQL {#api-and-sql-tool-settings}

Этот файл потребуется для интеграции с инструментами, совместимыми с MCP.

| Переменная окружения | Обязательность | Описание |
| --- | --- | --- |
| `DBT_HOST` | Обязательно | [Имя хоста вашего экземпляра](/docs/platform/about-platform/access-regions-ip-addresses) <Constant name="dbt_platform" />. Значение по умолчанию — `cloud.getdbt.com`. Для учетных записей multi-cell и multi-tenant со статическим поддоменом используйте полное имя хоста, например `abc123.us1.dbt.com`. |
| `DBT_TOKEN` | Обязательно | Ваш персональный токен доступа или сервисный токен <Constant name="dbt_platform" />. <br/>**Примечание**: если вы используете сервисный токен, назначьте наборы разрешений для включаемых наборов инструментов: `Semantic Layer Only` для инструментов <Constant name="semantic_layer" /> и `Metadata Only` для инструментов Discovery. Сервер, развернутый в собственной инфраструктуре, не проверяет разрешения при запуске. Вместо этого каждый API проверяет права доступа токена, когда инструмент обращается к нему. Токен, предоставляющий доступ только к некоторым наборам инструментов, работает для этих наборов, а вызовы инструментов из остальных наборов завершаются ошибкой по отдельности. [Удаленный MCP-сервер](/docs/dbt-ai/setup-remote-mcp#permissions) также проверяет разрешения при каждом вызове инструмента в дополнение к проверкам при подключении. <br/><br/> Инструмент `execute_sql` требует [персональный токен доступа (PAT)](/docs/dbt-apis/user-tokens) и не работает с сервисными токенами. Мы также рекомендуем использовать PAT для инструментов <Constant name="semantic_layer" />. |
| `DBT_ACCOUNT_ID` | Обязательно для инструментов Administrative API и аутентификации с помощью PAT | Ваш [идентификатор учетной записи dbt](/faqs/Accounts/find-user-id). Также требуется, если в качестве `DBT_TOKEN` используется персональный токен доступа (PAT). |
| `DBT_PROD_ENV_ID` | Обязательно | Идентификатор вашей производственной среды <Constant name="dbt_platform" /> |
| `DBT_DEV_ENV_ID` | Необязательно | Идентификатор вашей среды разработки <Constant name="dbt_platform" /> |
| `DBT_USER_ID` | Необязательно | Ваш идентификатор пользователя <Constant name="dbt_platform" /> ([документация](/faqs/Accounts/find-user-id)) |

:::warning Используйте только значения, а не полные URL-адреса
Распространенная ошибка — вставка полного URL-адреса вместо значения. Эти переменные принимают имена хостов или числовые идентификаторы:

```bash
# ✅ Правильно
DBT_HOST=cloud.getdbt.com            # https://cloud.getdbt.com тоже работает
DBT_PROD_ENV_ID=54321
DBT_USER_ID=123

# ❌ Неправильно — идентификаторы должны быть числами, а не полными URL-адресами
DBT_PROD_ENV_ID=https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321
DBT_USER_ID=https://cloud.getdbt.com/settings/profile
```
:::

**Пример конфигурации префикса поддомена:**

✅ **Корректная конфигурация:**
```bash
DBT_HOST=abc123.us1.dbt.com  # Use the full hostname including the prefix
DBT_ACCOUNT_ID=12345          # Required when using PAT-based auth
```

Вам не нужно задавать `MULTICELL_ACCOUNT_PREFIX` или `DBT_HOST_PREFIX`.

## Переменные окружения

Самостоятельно размещённый dbt-mcp поддерживает все варианты dbt, включая <Constant name="core" /> и <Constant name="fusion_engine" />.

| Переменная окружения | Обязательность | Описание | Пример |
| --- | --- | --- | --- |
| `DBT_PROJECT_DIR` | Обязательная | Полный путь к локальному репозиторию вашего проекта dbt. Это папка, содержащая файл `dbt_project.yml`. | macOS/Linux: `/Users/myname/reponame`<br/>Windows: `C:/Users/myname/reponame` |
| `DBT_PATH` | Обязательная | Полный путь к исполняемому файлу dbt (<Constant name="core" />/<Constant name="fusion" />/<Constant name="platform_cli" />). О том, как его найти, см. в следующем разделе. | macOS/Linux: `/opt/homebrew/bin/dbt`<br/>Windows: `C:/Python39/Scripts/dbt.exe` |
| `DBT_CLI_TIMEOUT` | Необязательная | Задаёт время ожидания в секундах, по истечении которого ваш агент прервёт выполнение команд dbt. | По умолчанию — 60 секунд. |

### Определение `DBT_PATH` {#locating-your-dbt_path}

Следуйте инструкциям для вашей ОС, чтобы найти `DBT_PATH`:

<Expandable alt_header="macOS/Linux"  anchor_id="macoslinux-details-2">

Выполните команду в терминале:
```bash
which dbt
```
Пример вывода: `/opt/homebrew/bin/dbt`

</Expandable>

<Expandable alt_header="Windows"  anchor_id="windows-details-2">

Выполните команду в Command Prompt или PowerShell:
```bash
where dbt
```
Пример вывода: `C:\Python39\Scripts\dbt.exe`

**Примечание:** используйте прямые слеши в конфигурации: `C:/Python39/Scripts/dbt.exe`

</Expandable>

**Дополнительные примечания:**

- Вы можете задать любую переменную окружения, поддерживаемую вашим исполняемым файлом dbt, например [переменные, поддерживаемые в <Constant name="core" />](/reference/global-configs/about-global-configs#available-flags).
- dbt MCP учитывает стандартные переменные окружения и флаги для отслеживания использования, описанные [здесь](/reference/global-configs/usage-stats).
- `DBT_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}'` задаётся автоматически, чтобы сервер MCP мог определить, что при выполнении команды dbt не выбран ни один узел. При необходимости вы можете переопределить это значение, но оно упрощает работу с dbt через сервер MCP, обеспечивая выбор допустимых узлов инструментом.

## Управление доступом к инструментам

В dbt-mcp есть два режима управления доступностью инструментов. Выберите один из подходов:
- режим отключения (отключите то, что вам не нужно)
- режим включения (включите только то, что вам нужно)

:::tip Какой режим выбрать?
- Режим отключения &mdash; используйте, если вам нужна _большая часть_ инструментов и требуется отключить лишь несколько из них. Это поведение по умолчанию.
- Режим включения &mdash; используйте, если вам нужен _только_ небольшой набор инструментов (подход на основе списка разрешённых инструментов).

**Не смешивайте оба режима** для одного и того же набора инструментов. Например, не задавайте одновременно `DISABLE_SEMANTIC_LAYER=true` и `DBT_MCP_ENABLE_SEMANTIC_LAYER=true` &mdash; это может привести к непредсказуемому поведению.
:::

### Режим отключения (по умолчанию) {#disable-mode}

По умолчанию доступны все инструменты. Установите для нужной переменной значение `true`, чтобы отключить соответствующий набор:

| Имя | Значение по умолчанию | Описание |
| --- | --- | --- |
| `DISABLE_DBT_CLI` | `false` | Отключает MCP-инструменты <Constant name="core" />, <Constant name="platform_cli" /> и <Constant name="fusion" />. |
| `DISABLE_SEMANTIC_LAYER` | `false` | Отключает MCP-инструменты dbt Semantic Layer. |
| `DISABLE_DISCOVERY` | `false` | Отключает MCP-инструменты dbt Discovery API. |
| `DISABLE_ADMIN_API` | `false` | Отключает MCP-инструменты dbt Administrative API. |
| `DISABLE_SQL` | `true` | MCP-инструменты SQL отключены по умолчанию. Чтобы включить их, установите значение `false`. |
| `DISABLE_DBT_CODEGEN` | `true` | [MCP-инструменты dbt codegen](/docs/dbt-ai/mcp-available-tools#dbt-codegen) отключены по умолчанию. Чтобы включить их, установите значение `false` (требуется пакет dbt-codegen). |
| `DISABLE_LSP` | `false` | Отключает MCP-инструменты dbt LSP/dbt v2. |
| `DISABLE_MCP_SERVER_METADATA` | `true` | Инструменты метаданных MCP-сервера (например, `get_mcp_server_version`) отключены по умолчанию. Чтобы включить их, установите значение `false`. |
| `DISABLE_TOOLS` | `""` | Список имён конкретных инструментов, которые нужно отключить, разделённых запятыми. |

### Режим включения

Чтобы явно разрешить только определённые наборы инструментов, используйте переменные `DBT_MCP_ENABLE_*`. Если задана хотя бы одна такая переменная, активны только разрешённые наборы:

| Имя | Значение по умолчанию | Описание |
| --- | --- | --- |
| `DBT_MCP_ENABLE_DBT_CLI` | Не задано | Установите значение `true`, чтобы включить инструменты dbt CLI. |
| `DBT_MCP_ENABLE_SEMANTIC_LAYER` | Не задано | Установите значение `true`, чтобы включить инструменты Semantic Layer. |
| `DBT_MCP_ENABLE_DISCOVERY` | Не задано | Установите значение `true`, чтобы включить инструменты Discovery API. |
| `DBT_MCP_ENABLE_ADMIN_API` | Не задано | Установите значение `true`, чтобы включить инструменты Administrative API. |
| `DBT_MCP_ENABLE_SQL` | Не задано | Установите значение `true`, чтобы включить инструменты SQL. |
| `DBT_MCP_ENABLE_DBT_CODEGEN` | Не задано | Установите значение `true`, чтобы включить инструменты dbt codegen. |
| `DBT_MCP_ENABLE_LSP` | Не задано | Установите значение `true`, чтобы включить инструменты LSP/dbt v2. |
| `DBT_MCP_ENABLE_TOOLS` | Не задано | Список имён конкретных инструментов, которые нужно включить, разделённых запятыми. |

### Приоритет

Если задано несколько переменных, они обрабатываются в следующем порядке (начиная с наивысшего приоритета):

1. `DBT_MCP_ENABLE_TOOLS` (включение конкретных инструментов по имени)
2. `DISABLE_TOOLS` (отключение конкретных инструментов по имени)
3. Включение набора инструментов (`DBT_MCP_ENABLE_*=true`)
4. Отключение набора инструментов (`DISABLE_*=true`)
5. Поведение по умолчанию

## (Необязательно) Проверка конфигурации {#optional-test-your-configuration}

В командной строке выполните следующее, чтобы проверить настройку:

**Если используется поле `env` в JSON:**
```bash
export DBT_PROJECT_DIR=/path/to/project
export DBT_PATH=/path/to/dbt
uvx dbt-mcp
```

**Если используется файл `.env`:** (укажите абсолютный путь, например к `.env` в корневом каталоге вашего проекта dbt)
```bash
uvx --env-file /absolute/path/to/your-dbt-project/.env dbt-mcp
```

Если ошибок нет, значит конфигурация настроена корректно.

## Настройка MCP-клиента {#set-up-your-mcp-client}

После завершения конфигурации следуйте соответствующему руководству по интеграции для выбранного инструмента:
- [Claude](/docs/dbt-ai/integrate-mcp-claude)
- [Cursor](/docs/dbt-ai/integrate-mcp-cursor)
- [VS Code](/docs/dbt-ai/integrate-mcp-vscode)

## Отладочные настройки {#debug-configurations}

| Имя | Значение по умолчанию | Описание |
| --- | --- | --- |
| `DBT_MCP_LOG_LEVEL` | `INFO` | Переменная окружения для переопределения уровня логирования сервера MCP. Допустимые значения: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`. |

Чтобы увидеть больше деталей о работе MCP-сервера и упростить отладку, вы можете временно установить уровень логирования `DEBUG`. Рекомендуется использовать его временно, чтобы избежать переполнения диска логами.

## Устранение неполадок {#troubleshooting}

<FAQ path="dbt-mcp/troubleshooting/uvx" />

<FAQ path="dbt-mcp/troubleshooting/oauth" />

Все темы, связанные с устранением неполадок, см. в разделе [Часто задаваемые вопросы о dbt MCP и устранение неполадок](/docs/dbt-ai/mcp-troubleshooting).
