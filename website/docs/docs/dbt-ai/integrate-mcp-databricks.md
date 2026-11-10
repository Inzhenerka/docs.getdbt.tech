---
title: "Интеграция Databricks с dbt MCP"
sidebar_label: "Интеграция Databricks с MCP"
description: "Установите сервер dbt MCP из Databricks Marketplace, чтобы работать со своим проектом dbt в Databricks, в том числе через Genie."
id: "integrate-mcp-databricks"
availability: platform_login
---

Агенты Databricks могут вызывать внешние серверы MCP как инструменты. В этом руководстве описано, как подключить агент Databricks к удалённому серверу dbt MCP, чтобы запрашивать метрики и данные из Semantic Layer на обычном английском языке через [Genie](https://docs.databricks.com/aws/en/genie/) и другие инструменты Databricks.

Для начала установите сервер из [Databricks Marketplace](https://marketplace.databricks.com/details/6d83d4e0-5279-47b7-831c-3cb90a82ecb3/dbt-Labs_dbt-MCP).

Подключение использует OAuth с динамической регистрацией клиентов (Dynamic Client Registration, DCR), поэтому вам не нужно управлять секретом клиента. После установки вы предоставите разрешение на доступ со страницы сервиса MCP.

## Предварительные требования

- Учётная запись <Constant name="dbt_platform" /> с доступом к удалённому серверу dbt MCP. См. [Настройка удалённого сервера MCP](/docs/dbt-ai/setup-remote-mcp).
- URL хоста <Constant name="dbt_platform" />. Его можно найти в **Account settings** или в адресной строке браузера. Например, `https://vu491.us1.dbt.com/`.
- Рабочее пространство Databricks, в котором вы можете устанавливать продукты из Marketplace и создавать объекты в каталоге и схеме.

## Установка из Databricks Marketplace

Выполните следующие действия, чтобы установить сервер dbt MCP из Databricks Marketplace: 

1. Перейдите на [страницу dbt MCP](https://marketplace.databricks.com/details/6d83d4e0-5279-47b7-831c-3cb90a82ecb3/dbt-Labs_dbt-MCP) в Databricks Marketplace.
   - Если вы вошли в Databricks, выберите **Install**.
   - Если нет, выберите **Get access**, затем войдите в Databricks или создайте новую учётную запись.
2. Выберите **Catalog** и **Schema**, затем введите **MCP service name** (например, `dbt_mcp`)
3. Найдите [URL доступа](/docs/platform/about-platform/access-regions-ip-addresses) к <Constant name="dbt_platform" />. Он имеет вид `https://vu491.us1.dbt.com/`. 
4. В поле **Host** оставьте заполнитель `{tenant}` без изменений. Если URL доступа содержит регион, например `us1`, добавьте его, чтобы адрес хоста имел вид `https://{tenant}.us1.dbt.com`. В противном случае оставьте значение по умолчанию — `https://{tenant}.dbt.com`.
5. В поле **Tenant** введите первую часть URL доступа, до первой точки. Для `https://vu491.us1.dbt.com/` введите `vu491`. Теперь строка **Server host** под полем **Tenant** должна соответствовать URL доступа.
6. Оставьте значения остальных полей по умолчанию, примите условия и выберите **Install**.
7. Откройте страницу сервиса MCP и предоставьте разрешение на доступ к <Constant name="dbt_platform" />.
При установке запрашиваются следующие области доступа OAuth: `offline_access account:read projects:query catalog:read projects:develop jobs:run`.
<Lightbox src="/img/mcp/databricks-install-dbt-mcp.png" width="60%" title="Диалоговое окно Install dbt MCP, заполненное для тенанта vu491 в регионе us1" />


## Использование сервера dbt MCP в Databricks

После предоставления разрешения на доступ добавьте сервис MCP в [Genie Code](https://docs.databricks.com/aws/en/genie-code/mcp) или используйте его в других инструментах Databricks с поддержкой MCP. Доступные варианты описаны в [документации Databricks по MCP](https://docs.databricks.com/aws/en/agents/mcp-tools/).

:::info О моделях ИИ в Genie Playground
Некоторые модели в Genie Playground не поддерживают вызовы инструментов, поэтому не могут использовать сервер dbt MCP. Если инструменты не отображаются, попробуйте другую модель.
:::

## Устаревший способ: ручная настройка DCR

Рекомендуем устанавливать сервер из Marketplace — это самый простой способ. Но если вам нужно создать подключение самостоятельно, его можно настроить вручную:

1. В Databricks перейдите в **Connections** и создайте новое подключение.
2. Выберите **HTTP** в качестве типа подключения.
3. Укажите каталог и схему.
4. Выберите **Dynamic Client Registration** в качестве типа учётных данных.
5. Введите адрес хоста, например `https://vu491.us1.dbt.com/`.
6. Задайте область доступа OAuth, например `offline_access account:read projects:query catalog:read projects:develop jobs:run`.
7. Задайте базовый путь `/api/ai/v1/mcp`, затем создайте подключение.
8. Выберите **Login** и предоставьте разрешение на доступ.

## Связанная документация

- [Настройка удалённого сервера MCP](/docs/dbt-ai/setup-remote-mcp)
- [Доступные инструменты MCP](/docs/dbt-ai/mcp-available-tools)
- [Подключение приложений с помощью OAuth](/docs/platform/manage-access/connect-apps-oauth)
