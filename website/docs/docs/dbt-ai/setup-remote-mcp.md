---
title: "Set up remote MCP"
sidebar_label: "Set up remote MCP"
description: "Как настроить удалённый MCP-сервер dbt."
id: "setup-remote-mcp"
availability:
  surface: platform
  access: login_required
---

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';
import MCPRemoteServerUrl from '/snippets/_mcp-remote-server-url.md';

Удалённый MCP-сервер использует HTTP-соединение и выполняет вызовы к dbt-mcp, размещённому на облачной платформе <Constant name="dbt_platform" />. Для использования удалённого MCP-сервера не требуется самостоятельное развёртывание; этот вариант идеально подходит для сценариев потребления данных.

<Lightbox src="/img/mcp/remote-dbt-mcp.jpg" title="Архитектура удалённого MCP-сервера dbt" />

## Когда использовать удалённый MCP {#when-to-use-remote-mcp}

Удалённый MCP-сервер — идеальный выбор, если:
- Вы не хотите или не можете устанавливать дополнительное программное обеспечение (`uvx`, `dbt-mcp`) в своей системе.
- Ваш основной сценарий использования — _получение данных_: запросы метрик, изучение метаданных, просмотр происхождения данных.
- Вам нужен доступ к API <Constant name="semantic_layer"/>, Administrative и Discovery без необходимости поддерживать локальный проект dbt.
- Вам не требуется выполнять команды CLI. Удалённый MCP не поддерживает выполнение команд dbt CLI в собственной инфраструктуре (`dbt run`, `dbt build`, `dbt test` и других). Если вам нужно выполнять команды dbt, используйте [MCP-сервер в собственной инфраструктуре](/docs/dbt-ai/setup-local-mcp).

<MCPCreditUsage />

## Выберите способ аутентификации

<SimpleTable>
| Если вам нужно... | Используйте... |
| --- | --- |
| Максимально быстрая первоначальная настройка, а ваш MCP-клиент поддерживает OAuth для HTTP-серверов (включая `execute_sql`) | **[OAuth (удалённый MCP)](#oauth-remote-mcp)** <br /> Доступно в рамках публичного бета-тестирования для учётных записей Starter, Enterprise и Enterprise+ |
| `execute_sql` с аутентификацией по токену, автоматизация, общая конфигурация или клиенты без поддержки OAuth | **Аутентификацию по токену** с [персональным токеном доступа (PAT)](/docs/dbt-apis/user-tokens) |
| Общая или командная конфигурация | **Сервисный токен** (аутентификация по токену) |
| CI или автоматизация | **Сервисный токен** (аутентификация по токену) |
</SimpleTable>

:::warning Сервисные токены не работают с `execute_sql`
Если вы подключаетесь с помощью токена, а не OAuth, `execute_sql` работает только с [персональным токеном доступа (PAT)](/docs/dbt-apis/user-tokens). Сервисные токены не подойдут. Чтобы выполнять SQL без создания PAT, используйте [OAuth (удалённый MCP)](#oauth-remote-mcp).
:::

## Разрешения для удалённого MCP {#permissions}

Удалённый MCP проверяет ваши права доступа при подключении, а затем при каждом вызове инструмента проверяет, разрешён ли вам доступ к целевому проекту, среде, заданию или запуску. Эти проверки применяются к OAuth, персональным токенам доступа (PAT) и сервисным токенам. Успешное подключение или отображение инструмента в клиенте не означает, что вы можете использовать этот инструмент для любого ресурса.

Для самого подключения набор разрешений `Developer` не требуется. Попросите администратора выдать права, необходимые для вашей работы:

<SimpleTable>
| Задача | Необходимые права |
| --- | --- |
| Изучать модели и граф зависимостей или генерировать SQL через `text_to_sql` | Право на чтение метаданных выбранного проекта. Для `text_to_sql` также должны быть включены функции ИИ. |
| Использовать инструменты семантического слоя | Право на чтение конфигурации семантического слоя в выбранном проекте. |
| Выполнять обычный SQL через `execute_sql` | Право на чтение конфигурации семантического слоя в проекте, среда разработки и учётные данные хранилища. Подключитесь через OAuth или PAT. |
| Выполнять SQL с выражениями Jinja dbt, например `ref()` или `source()` | Требования для обычного SQL и доступ к разработке. Чтобы разрешать ссылки по состоянию производственной среды, также нужно право на чтение метаданных. |
| Просматривать задания и запуски или управлять ими | Права на чтение или запись для нужного задания или запуска. Для списков без фильтра по проекту нужны соответствующие права на уровне аккаунта. |
</SimpleTable>

Доступные наборы разрешений описаны в разделах [Разрешения Enterprise](/docs/platform/manage-access/enterprise-permissions) и [Сервисные токены](/docs/dbt-apis/service-tokens#permissions-for-service-account-tokens). PAT наследует права создавшего его пользователя. OAuth дополнительно ограничивает доступ согласованными областями и проектами.

Сервисный токен с правом чтения метаданных позволяет генерировать SQL через `text_to_sql`. Выполнять SQL через `execute_sql` с таким токеном нельзя.

## OAuth (remote MCP) <Lifecycle status="beta,self_service,managed,managed_plus" /> {#oauth-remote-mcp}

Если MCP-клиент поддерживает OAuth для серверов по HTTP, через OAuth можно подключиться к удалённому MCP-серверу без копирования токенов API в клиент.

### Предварительные требования {#prerequisites}

- Аккаунт на тарифе Starter, Enterprise или Enterprise+.
- MCP-клиент с поддержкой OAuth для удалённых MCP-серверов по HTTP.
- URL MCP из раздела **Account settings** &rarr; **Access URLs** &rarr; **MCP Endpoint URL** в <Constant name="dbt_platform"/>. Подробнее см. [URL MCP](#mcp-url).

Функции ИИ включены по умолчанию. Администраторы могут [отключать и снова включать их](/docs/platform/manage-dbt-ai). При отключении удалённый MCP остаётся доступным, но инструмент [`text_to_sql`](/docs/dbt-ai/mcp-available-tools#tools-that-require-ai-features) скрывается.

### MCP URL {#mcp-url}

<MCPRemoteServerUrl />

### Как это работает {#how-it-works}

1. Откройте настройки коннекторов или интеграций MCP-клиента и добавьте свой [URL MCP](#mcp-url). Например, для Claude или ChatGPT:
   - **Claude (web)**: **Customize** &rarr; **Connectors** &rarr; **+** &rarr; **Add custom connector**
   - **ChatGPT**: **Settings** &rarr; **Apps** &rarr; **Create App**
   - Для Claude Desktop и Claude Code см. [Интеграция Claude с dbt MCP](/docs/dbt-ai/integrate-mcp-claude).
2. Когда клиент предложит войти, завершите вход в браузере и подтвердите запрошенные области доступа на экране согласия.
3. Вернитесь в MCP-клиент. Последующие запросы будут использовать сеанс OAuth в соответствии с настройками клиента.

`execute_sql` поддерживает OAuth. Добавьте URL MCP в клиент и войдите по его запросу. Персональный токен доступа и дополнительные заголовки не нужны.

### Регистрация MCP-клиента {#register-your-mcp-client}

Для OAuth каждый клиент нужно зарегистрировать в <Constant name="dbt_platform" />. Это можно сделать двумя способами:

- **Динамическая регистрация (по умолчанию)** &mdash; клиенты с поддержкой [Dynamic Client Registration (RFC 7591)](/docs/platform/manage-access/connect-apps-oauth#dynamic-registration) регистрируются при первом подключении без участия администратора. Этот способ поддерживают многие современные MCP-клиенты, включая Claude Desktop, Claude Code, Cursor и VS Code.
- **Ручная регистрация** &mdash; если клиент не поддерживает динамическую регистрацию, администратор аккаунта добавляет его в **Account settings → Integrations → App integrations**. Вручную зарегистрированные клиенты используют [PKCE (RFC 7636)](/docs/platform/manage-access/connect-apps-oauth#manual-registration) вместо секрета клиента. См. [Ручная регистрация](/docs/platform/manage-access/connect-apps-oauth#manual-registration).

Клиенты, зарегистрированные обоими способами, отображаются в разделе **App integrations** в <Constant name="dbt_platform" />. Администраторы могут просматривать и проверять подключённые клиенты.

### Области доступа, которые вы подтверждаете {#scopes-youll-consent-to}

При первом подключении dbt показывает экран согласия со списком областей доступа, которые запрашивает клиент. Эти области **ограничивают уже выданные разрешения** и не предоставляют новых прав. Можно разрешить клиенту доступ ко всем проектам или только к выбранным.

Полный список областей доступа и их описание см. в разделе [Области доступа и согласие](/docs/platform/manage-access/connect-apps-oauth#scopes-and-consent). Информацию о сеансах, токенах обновления, отзыве доступа и журнале аудита см. в разделе [Подключение приложений через OAuth](/docs/platform/manage-access/connect-apps-oauth).

### Пользователи с доступом на чтение и учётные данные хранилища {#read-only-users-and-warehouse-credentials}

Пользователям с доступом на чтение для запросов через удалённый MCP, например через `query_metrics`, нужны учётные данные хранилища. Есть два варианта:

- **Общие учётные данные для аналитики (рекомендуется):** администратор настраивает [учётные данные для аналитики](/docs/platform/wizard-read-only-users#set-up-analytics-credentials) для подключения. Пользователи с доступом на чтение без личных учётных данных используют их автоматически, поэтому им не нужно входить в <Constant name="dbt_platform" />.
- **Личные учётные данные:** пользователи с набором разрешений [Analyst read](/docs/platform/manage-access/enterprise-permissions#analyst-read) могут добавить свои данные в **Your profile** &rarr; **Credentials**. Если личные данные настроены, они имеют приоритет.

Если ни один вариант не настроен, запрос завершится ошибкой и предложит настроить учётные данные или обратиться к администратору.

### Ограничения {#limitations}

- Удалённый MCP не поддерживает локальные команды dbt CLI, включая `dbt run`, `dbt build` и `dbt test`, и не имеет доступа к локальному проекту. Для такой работы используйте [локальный MCP-сервер](/docs/dbt-ai/setup-local-mcp).

Инструкции для конкретных клиентов см. в разделах [Claude](/docs/dbt-ai/integrate-mcp-claude), [Cursor](/docs/dbt-ai/integrate-mcp-cursor), [Snowflake Cortex](/docs/dbt-ai/integrate-mcp-snowflake-cortex) и [VS Code](/docs/dbt-ai/integrate-mcp-vscode).

## Аутентификация по токену {#token-based-authentication}

Чтобы подключиться к удалённому MCP без OAuth, укажите PAT или сервисный токен в конфигурации MCP-клиента. Это подходит для клиентов без поддержки OAuth, а также для общих конфигураций и CI. Для вызова `execute_sql` при аутентификации по токену используйте PAT.

Для каждого вызова инструмента нужно иметь [разрешения на целевой ресурс](#permissions). При подключении по токену в списке могут отображаться инструменты, недоступные этому токену. Их вызовы завершаются ошибкой по отдельности. OAuth также может фильтровать список инструментов по выданным разрешениям.

### Настройка {#setup-instructions}

Функции ИИ включены по умолчанию. Администраторы могут [отключать и снова включать их](/docs/platform/manage-dbt-ai). При отключении удалённый MCP остаётся доступным, но инструмент [`text_to_sql`](/docs/dbt-ai/mcp-available-tools#tools-that-require-ai-features) скрывается.

1. Получите в <Constant name="dbt_platform"/> следующие данные:
  - **Хост <Constant name="dbt_platform"/>**: используйте его для полного URL. Например, подставьте адрес вместо `YOUR_DBT_HOST_URL` в `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/`. Пример: `https://cloud.getdbt.com/api/ai/v1/mcp/`. Для аккаунта с несколькими ячейками хост имеет формат `ACCOUNT_PREFIX.us1.dbt.com`. Подробнее см. [Доступ, регионы и IP-адреса](/docs/platform/about-platform/access-regions-ip-addresses).
  - **ID производственной среды**: найдите его в **Orchestration** → **Environments** в <Constant name="dbt_platform"/> и укажите в заголовке `x-dbt-prod-environment-id`. См. [Как найти идентификаторы dbt MCP](/docs/dbt-ai/mcp-find-ids#dbt-prod-env-id).
  - **Токен**: создайте персональный токен доступа (PAT) или сервисный токен с [правами для нужных инструментов и ресурсов](#permissions). Для сервисного токена назначьте подходящие наборы разрешений. PAT наследует права создавшего его пользователя.
  - Для `execute_sql` нужен [персональный токен доступа (PAT)](/docs/dbt-apis/user-tokens). Сервисный токен для этого инструмента не подходит. PAT также нужен для других инструментов, которые требуют `x-dbt-user-id`.

2. В конфигурации удалённого MCP укажите обязательные заголовки в JSON:

  #### Конфигурация для API и SQL-инструментов \{#configuration-for-apis-and-sql-tools}
  
  <SimpleTable>
  | Заголовок | Обязательный? | Описание |
  | --- | --- | --- |
| Authorization | Да | Ваш [персональный токен доступа (PAT)](/docs/dbt-apis/user-tokens) или [сервисный токен](/docs/dbt-apis/service-tokens) из <Constant name="dbt_platform"/> с [необходимыми разрешениями](#permissions). При использовании <Constant name="semantic_layer" /> рекомендуем использовать PAT. <br /><br /> Значение должно быть в формате `Token YOUR_DBT_ACCESS_TOKEN` или `Bearer YOUR_DBT_ACCESS_TOKEN`, где `YOUR_DBT_ACCESS_TOKEN` необходимо заменить вашим фактическим токеном.  |
  | x-dbt-prod-environment-id | Да | Идентификатор вашей производственной среды в <Constant name="dbt_platform"/>. Пошаговые инструкции см. в разделе [Как найти идентификаторы dbt MCP](/docs/dbt-ai/mcp-find-ids#dbt-prod-env-id). |
  </SimpleTable>
    
  #### Дополнительная настройка для инструментов SQL
  <SimpleTable>
  | Заголовок | Обязательный | Описание |
  | --- | --- | --- |
  | x-dbt-dev-environment-id | Обязателен для `execute_sql` | Идентификатор вашей среды разработки в <Constant name="dbt_platform"/>. Пошаговые инструкции см. в разделе [Как найти идентификаторы dbt MCP](/docs/dbt-ai/mcp-find-ids#dbt-dev-env-id). |
  | x-dbt-user-id | Обязателен для `execute_sql` | Идентификатор вашего пользователя в <Constant name="dbt_platform"/>. Подробнее см. в разделе [Где найти идентификатор пользователя?](/faqs/Accounts/find-user-id). |
  </SimpleTable>
    
  Используйте положительные числовые идентификаторы в заголовках проекта и среды. Заголовки среды разработки и производственной среды должны указывать на среды соответствующего типа в одном и том же проекте. Если инструмент принимает аргумент проекта или среды, он должен соответствовать настроенному целевому объекту. `list_jobs` сохраняет прежнее поведение: явно заданный `project_id` переопределяет настроенный фильтр среды.

  #### Дополнительная настройка для инструментов dbt v2

По умолчанию инструменты <Constant name="fusion"/> берут метаданные моделей и таблиц из среды, указанной в `x-dbt-prod-environment-id`.
  <SimpleTable>
  | Заголовок | Обязательный? | Описание |
  | --- | --- | --- |
| x-dbt-dev-environment-id | Обязательный | ID вашей среды разработки <Constant name="dbt_platform"/>. Пошаговые инструкции см. в разделе [Как найти ID для dbt MCP](/docs/dbt-ai/mcp-find-ids#dbt-dev-env-id). |
  | x-dbt-user-id | Обязательный | Ваш ID пользователя <Constant name="dbt_platform"/>. Подробнее см. в разделе [Где найти мой ID пользователя?](/faqs/Accounts/find-user-id). |
  | x-dbt-fusion-disable-defer | Необязательный | По умолчанию: `false`. Если установлено значение `true`, инструменты <Constant name="fusion"/> не будут использовать отложенные ссылки на производственную среду, а вместо этого будут использовать модели и метаданные таблиц из среды разработки (`x-dbt-dev-environment-id`). |
 </SimpleTable>

  #### Настройка отключения инструментов
  <SimpleTable>
  | Заголовок | Обязательность  | Описание |
  | --- | --- | --- |
  | x-dbt-disable-tools | Необязательный | Список инструментов для отключения, разделённых запятыми. Например: `get_all_models,text_to_sql,list_entities` |
  | x-dbt-disable-toolsets | Необязательный | Список наборов инструментов для отключения, разделённых запятыми. Например: `semantic_layer,sql,discovery` |
  </SimpleTable>
3. Определив, какие заголовки вам нужны, вы можете воспользоваться [примерами](https://github.com/dbt-labs/dbt-mcp/tree/main/examples), чтобы создать собственного агента. 

## Примеры

Протокол MCP не зависит от языка программирования и фреймворка, поэтому используйте любые средства, которые помогают вам создавать агентов. Если вы используете [OAuth (удалённый MCP)](#oauth-remote-mcp) в бета-версии, вам нужен только URL вашего MCP. Если вы используете аутентификацию на основе токенов, добавьте заголовки из примеров ниже. Конфигурация зависит от клиента — выберите свой инструмент на следующих вкладках и замените значения-заполнители своими:


<Tabs groupId="auth-method">
<TabItem value="oauth" label="OAuth">

<Tabs groupId="client">
<TabItem value="claude" label="Claude Code">

```json
{
  "mcpServers": {
    "dbt": {
      "type": "http",
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
    }
  }
}
```

</TabItem>
<TabItem value="cursor" label="Cursor">

```json
{
  "mcpServers": {
    "dbt": {
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
    }
  }
}
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="token" label="Token-based">

<Tabs groupId="client">
<TabItem value="claude" label="Claude Code">

```json
{
  "mcpServers": {
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

</TabItem>
<TabItem value="cursor" label="Cursor">

```json
{
  "mcpServers": {
    "dbt": {
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

</TabItem>
<TabItem value="gemini" label="Gemini">

```json
{
  "mcpServers": {
    "dbt": {
      "httpUrl": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
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

</TabItem>
</Tabs>

</TabItem>
</Tabs>


:::warning Используйте числовые ID
Заголовки `x-dbt-prod-environment-id` и `x-dbt-user-id` принимают только целые числа. В поле `url` адрес хоста должен начинаться с `https://`:

```bash
# ✅ Correct
"url": "https://cloud.getdbt.com/api/ai/v1/mcp"
"x-dbt-prod-environment-id": "54321"
"x-dbt-user-id": "123"

# ❌ Wrong — don't paste full URLs into ID headers
"x-dbt-prod-environment-id": "https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321"
"x-dbt-user-id": "https://cloud.getdbt.com/settings/profile"
```
:::

Для других MCP-клиентов, например Codex или Windsurf, формат ключа указан в документации клиента.

Локальный MCP настраивается через переменные окружения. См. [Справочник по переменным окружения](/docs/dbt-ai/mcp-environment-variables).

## Связанная документация {#related-docs}

Пошаговые инструкции по настройке клиентов, включая Cursor, VS Code и Claude:

- [Интеграция Cursor с MCP](/docs/dbt-ai/integrate-mcp-cursor)
- [Интеграция VS Code с MCP](/docs/dbt-ai/integrate-mcp-vscode)
- [Интеграция Claude с MCP](/docs/dbt-ai/integrate-mcp-claude)
- [Интеграция Snowflake Cortex с MCP](/docs/dbt-ai/integrate-mcp-snowflake-cortex)
