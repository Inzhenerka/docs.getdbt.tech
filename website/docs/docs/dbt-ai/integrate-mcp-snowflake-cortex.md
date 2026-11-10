---
title: "Интеграция агентов Snowflake Cortex с dbt MCP"
sidebar_label: "Интеграция Snowflake Cortex с MCP"
description: "Подключите агента Snowflake Cortex к удалённому серверу dbt MCP, чтобы он мог выполнять запросы к вашему dbt Semantic Layer."
id: "integrate-mcp-snowflake-cortex"
availability: platform_login
---

import MCPRemoteServerUrl from '/snippets/_mcp-remote-server-url.md';
import MCPRemoteOauthBetaCallout from '/snippets/_mcp-remote-oauth-beta-callout.md';
import StaticSubdomainRequired from '/snippets/_static-subdomain-required.md';
import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';

[Агенты Snowflake Cortex](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents) могут вызывать внешние [серверы MCP](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-mcp-connectors) в качестве инструментов. В этом руководстве описано, как подключить агента Cortex к удалённому серверу dbt MCP, чтобы он мог запрашивать метрики и измерения вашего <Constant name="semantic_layer" /> на обычном английском языке из Snowflake Intelligence.

Подключение использует OAuth: Snowflake самостоятельно регистрируется в <Constant name="dbt_platform" /> с помощью Dynamic Client Registration (DCR) с PKCE, поэтому хранить секрет клиента в Snowflake не требуется. Каждый пользователь самостоятельно предоставляет согласие OAuth при первом использовании агента. Это означает, что агент учитывает существующие разрешения каждого пользователя в dbt и его доступ к проектам.

## Предварительные требования

Перед подключением агента Cortex к удалённому серверу dbt MCP убедитесь, что выполнены следующие требования.

#### В <Constant name="dbt_platform" />

Перед подключением из Snowflake убедитесь, что настроено следующее:
- **Настройка аккаунта**
  - [Включён OAuth для удалённого MCP](/docs/dbt-ai/setup-remote-mcp). Удалённый сервер MCP общедоступен, но способ подключения через OAuth находится в стадии публичного бета-тестирования для аккаунтов тарифов Starter и Enterprise.
  - Настроен [статический поддомен](/docs/platform/about-platform/access-regions-ip-addresses), например `abc123` в `abc123.us1.dbt.com`. Если у вашего аккаунта нет поддомена, обратитесь в службу поддержки.
- **Доступ и разрешения**
  - Доступ к <Constant name="dbt_platform" /> уровня «только чтение» или выше. Агент наследует разрешения каждого подключённого пользователя.
- **Настройка Semantic Layer**
  - Настроен [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) с [метриками и измерениями](/docs/build/build-metrics-intro).
- **Конечная точка MCP**
    <MCPRemoteServerUrl />
    Используйте в SQL для Snowflake часть этого URL, содержащую имя хоста, например `abc123.us1.dbt.com`.

#### В Snowflake
  - В вашем аккаунте и регионе включены Snowflake Intelligence и агенты Cortex.
  - Для вашего аккаунта доступны внешние коннекторы MCP. Уточните доступность у команды Snowflake, сопровождающей ваш аккаунт.
  - У вас есть роль `ACCOUNTADMIN` или роль с правом `CREATE INTEGRATION` на уровне аккаунта.
  - У вас есть база данных, схема и роль для создания сервера MCP и агента.

:::tip Необязательно: выполнение SQL непосредственно в Snowflake
Агенты Cortex могут компилировать и выполнять запросы <Constant name="semantic_layer" /> без дополнительной настройки. Чтобы также разрешить произвольные SQL-запросы к Snowflake, настройте учётные данные для чтения проекта в разделе **Settings → Credentials** в <Constant name="dbt_platform" />. Без этих учётных данных агент по-прежнему может компилировать SQL для <Constant name="semantic_layer" /> и выполнять его непосредственно в Snowflake.
:::

## Параметры

В SQL на этой странице используются плейсхолдеры. Перед выполнением замените каждый из них своим значением:

<SimpleTable>

| Плейсхолдер | Описание |
| --- | --- |
| `YOUR_DBT_HOST_URL` | Хост вашего dbt без `https://` (например, `abc123.us1.dbt.com`). |
| `INTEGRATION_NAME` | Имя API-интеграции Snowflake (например, `dbt_mcp_integration`). |
| `TARGET_DATABASE.TARGET_SCHEMA` | База данных и схема, в которых размещаются сервер MCP и агент. |
| `TARGET_ROLE` | Роль Snowflake, которая использует агента и сервер MCP. |
| `MCP_SERVER_NAME` | Имя объекта внешнего сервера MCP. |
| `AGENT_NAME` | Имя агента Cortex. |
| `CORTEX_MODEL` | Модель оркестрации для агента (например, `claude-4-sonnet`). |

</SimpleTable>

## Настройка подключения

Следующие шаги позволяют зарегистрировать удалённый сервер dbt MCP в Snowflake и подключить его к агенту Cortex. Шаги 1–3 выполняются как SQL-запросы в Snowflake. Шаг 4 начинается в Snowflake Intelligence и перенаправляет каждого пользователя в <Constant name="dbt_platform" /> для завершения авторизации OAuth.

### Шаг 1. Создайте API-интеграцию


В Snowflake выполните этот код от имени роли `ACCOUNTADMIN`. Интеграция определяет, как Snowflake обращается к конечной точке удалённого dbt MCP и выполняет авторизацию OAuth с помощью Dynamic Client Registration с PKCE (без секрета клиента).

```sql
-- Create an API integration for the remote dbt MCP server.
-- Uses OAuth Dynamic Client Registration + PKCE (no client secret).
CREATE API INTEGRATION IF NOT EXISTS INTEGRATION_NAME
  API_PROVIDER = EXTERNAL_MCP
  API_ALLOWED_PREFIXES = ('https://YOUR_DBT_HOST_URL/api/ai/v1/mcp')
  API_USER_AUTHENTICATION = (
    TYPE = OAUTH_DYNAMIC_CLIENT
    OAUTH_CLIENT_AUTH_METHOD = NONE
    OAUTH_TOKEN_ENDPOINT = 'https://YOUR_DBT_HOST_URL/oauth/token'
    OAUTH_AUTHORIZATION_ENDPOINT = 'https://YOUR_DBT_HOST_URL/oauth/authorize'
    OAUTH_RESOURCE_URL = 'https://YOUR_DBT_HOST_URL/api/ai/v1/mcp'
    OAUTH_ALLOWED_SCOPES = ('user_access', 'offline_access')
  )
  ENABLED = TRUE;
```

В `OAUTH_TOKEN_ENDPOINT` и `OAUTH_AUTHORIZATION_ENDPOINT` используется тот же хост, что и в URL вашего MCP. Области доступа `user_access` и `offline_access` позволяют агенту действовать от вашего имени и обновлять сеанс без повторной аутентификации при каждом обращении.

### Шаг 2. Создайте внешний сервер MCP

В Snowflake предоставьте своей роли право создавать внешний сервер MCP, а затем создайте сервер, ссылающийся на интеграцию из шага 1.

```sql
GRANT CREATE EXTERNAL MCP SERVER ON SCHEMA TARGET_DATABASE.TARGET_SCHEMA TO ROLE TARGET_ROLE;

-- Create an external MCP server pointing to the remote dbt MCP endpoint.
CREATE EXTERNAL MCP SERVER IF NOT EXISTS TARGET_DATABASE.TARGET_SCHEMA.MCP_SERVER_NAME
  WITH DISPLAY_NAME = 'dbt Semantic Layer MCP'
  URL = 'https://YOUR_DBT_HOST_URL/api/ai/v1/mcp'
  API_INTEGRATION = INTEGRATION_NAME;
```

### Шаг 3. Создайте агента Cortex

В Snowflake предоставьте своей роли права на создание агента и использование сервера MCP и его интеграции, а затем создайте агента.

```sql
GRANT CREATE AGENT ON SCHEMA TARGET_DATABASE.TARGET_SCHEMA TO ROLE TARGET_ROLE;

-- Grant the role access to the MCP server and its underlying integration.
GRANT USAGE ON EXTERNAL MCP SERVER TARGET_DATABASE.TARGET_SCHEMA.MCP_SERVER_NAME TO ROLE TARGET_ROLE;
GRANT USAGE ON INTEGRATION INTEGRATION_NAME TO ROLE TARGET_ROLE;

CREATE AGENT IF NOT EXISTS TARGET_DATABASE.TARGET_SCHEMA.AGENT_NAME
  COMMENT = 'Analytics agent powered by the dbt Semantic Layer via MCP'
  PROFILE = '{"display_name": "dbt Semantic Layer Agent"}'
  FROM SPECIFICATION
  $$
  models:
    orchestration: "CORTEX_MODEL"

  instructions:
    response: 'Answer questions about business data using the dbt Semantic Layer. Present results clearly in plain English with context about what the metrics mean. When data is returned, summarize the key insight before showing details.'
    orchestration: 'Always use the dbt MCP tools to query metrics and dimensions rather than writing raw SQL. First explore available metrics and dimensions if you are unsure what is available, then construct and execute the appropriate semantic layer query.'
    sample_questions:
      - question: 'What are the top 10 products by revenue this quarter?'
      - question: 'How has inventory turnover trended over the last 12 months?'
      - question: 'Which regions have the highest order volume?'

  mcp_servers:
    - server_spec:
        name: "TARGET_DATABASE.TARGET_SCHEMA.MCP_SERVER_NAME"
  $$;
```

Измените `instructions` и `sample_questions` в соответствии с метриками и измерениями вашего <Constant name="semantic_layer" />. Инструкция `orchestration` направляет агента к использованию инструментов dbt <Constant name="semantic_layer" /> (таких как `list_metrics`, `get_dimensions` и `query_metrics`) вместо написания SQL напрямую.

### Шаг 4. Завершите процесс OAuth

Агент не может выполнять запросы к dbt, пока каждый пользователь не авторизует его. Пройдите процесс OAuth один раз для каждого пользователя:

1. В пользовательском интерфейсе Snowflake Intelligence откройте свои коннекторы MCP. В зависимости от версии Snowflake они находятся в разделе **Settings → User → MCP Connectors** или на панели **Connectors** среди источников агента.
2. Найдите созданный вами коннектор **dbt Semantic Layer MCP** и выберите **Connect**.
3. Snowflake перенаправит вас в <Constant name="dbt_platform" />, чтобы вы вошли в систему и подтвердили запрошенные [области доступа](/docs/platform/manage-access/connect-apps-oauth#scopes-and-consent) на экране согласия. Вы можете ограничить подключение конкретным проектом (рекомендуется), чтобы агент видел данные только этого проекта.
4. После подтверждения коннектор получит статус **Connected**, и вы вернётесь в Snowflake.

При первом подключении Snowflake самостоятельно регистрируется в <Constant name="dbt_platform" /> с помощью Dynamic Client Registration, поэтому для регистрации не требуется никаких действий администратора. 

В <Constant name="dbt_platform"/> администраторы могут просматривать сведения о подключённом клиенте и проводить его аудит, а также управлять сеансами и областями доступа в разделе **Account settings → Integrations → App integrations**. Полное описание модели регистрации, предоставления согласия и сеансов см. в разделе [Подключение приложений с помощью OAuth](/docs/platform/manage-access/connect-apps-oauth).

## Проверка подключения

Откройте своего агента в Snowflake Intelligence и задайте один из его примеров вопросов, например _«Какие 10 продуктов принесли наибольшую выручку в этом квартале?»_ Если подключение работает, агент вызовет инструменты dbt <Constant name="semantic_layer" /> и вернёт ответ на основе ваших метрик.

<MCPCreditUsage />

## Устранение неполадок

<FAQ path="dbt-mcp/troubleshooting/snowflake-oauth-fails" />

<FAQ path="dbt-mcp/troubleshooting/snowflake-empty-results" />

<FAQ path="dbt-mcp/troubleshooting/snowflake-permission-errors" />

## Связанная документация

- [Настройка удалённого сервера MCP](/docs/dbt-ai/setup-remote-mcp)
- [Доступные инструменты MCP](/docs/dbt-ai/mcp-available-tools)
- [Подключение приложений с помощью OAuth](/docs/platform/manage-access/connect-apps-oauth)
- [Snowflake: коннекторы MCP](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-mcp-connectors)
