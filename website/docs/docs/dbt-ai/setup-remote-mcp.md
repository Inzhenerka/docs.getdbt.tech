---
title: "Set up remote MCP"
sidebar_label: "Set up remote MCP"
description: "Learn how to set up the remote dbt-mcp server"
id: "setup-remote-mcp"
---

Удалённый MCP-сервер использует HTTP-соединение и выполняет вызовы к dbt-mcp, размещённому в облаке на базе <Constant name="dbt_platform" />. Такая конфигурация не требует локальной установки и идеально подходит для сценариев потребления данных.

## Когда использовать удалённый MCP {#when-to-use-remote-mcp}

Удалённый MCP-сервер является идеальным выбором, когда:
- Вы не хотите или вам запрещено устанавливать дополнительное программное обеспечение (`uvx`, `dbt-mcp`) на вашу систему.
- Ваш основной сценарий использования — _ориентированный на потребление_: запрос метрик, исследование метаданных, просмотр lineage.
- Вам нужен доступ к <Constant name="semantic_layer"/> и API Discovery без необходимости поддерживать локальный проект dbt.
- Вам не нужно выполнять команды CLI. Удалённый MCP не поддерживает команды dbt CLI (`dbt run`, `dbt build`, `dbt test` и другие). Если вам необходимо выполнять команды dbt CLI, используйте вместо этого [локальный MCP-сервер](/docs/dbt-ai/setup-local-mcp).

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';

<MCPCreditUsage />

## Инструкции по настройке {#setup-instructions}

1. Убедитесь, что у вас включены [AI-функции](https://docs.getdbt.tech/docs/cloud/enable-dbt-copilot).
2. Получите следующую информацию из платформы dbt:

  - **Хост dbt Cloud**: Используйте его для формирования полного URL. Например, замените `<host>` здесь: `https://<host>/api/ai/v1/mcp/`. Он может выглядеть так: `https://cloud.getdbt.com/api/ai/v1/mcp/`. Если у вас мульти-региональная (multi-cell) учётная запись, URL хоста будет в формате `<ACCOUNT_PREFIX>.us1.dbt.com`. Дополнительные сведения см. в разделе [Доступ, регионы и IP-адреса](/docs/cloud/about-cloud/access-regions-ip-addresses).
  - **ID production-окружения**: Его можно найти на странице **Orchestration** в <Constant name="dbt_platform"/>. Используйте его для установки заголовка `x-dbt-prod-environment-id`.
  - **Токен**: Сгенерируйте либо персональный токен доступа, либо сервисный токен. С точки зрения разрешений, для полноценного использования удалённого MCP он должен быть настроен с разрешениями Semantic Layer и Developer. Примечание: для использования функциональности, требующей заголовка `x-dbt-user-id`, необходим персональный токен доступа.

3. Для удалённого MCP вы будете передавать заголовки через JSON-объект для настройки необходимых полей:

  **Конфигурация для API и SQL-инструментов**

  | Header | Required | Description |
  | --- | --- | --- |
  | Token | Обязательно | Ваш персональный токен доступа или сервисный токен из <Constant name="dbt_platform"/>. <br/> **Примечание**: При использовании Semantic Layer рекомендуется использовать персональный токен доступа. Если вы используете сервисный токен, убедитесь, что у него есть как минимум разрешения `Semantic Layer Only`, `Metadata Only` и `Developer`. |
  | x-dbt-prod-environment-id | Обязательно | ID вашего production-окружения <Constant name="dbt_platform"/> |

  **Дополнительная конфигурация для SQL-инструментов**
  | Header | Required | Description |
  | --- | --- | --- |
  | x-dbt-dev-environment-id | Обязательно для `execute_sql` | ID вашего development-окружения <Constant name="dbt_platform"/> |
  | x-dbt-user-id | Обязательно для `execute_sql` | ID вашего пользователя <Constant name="dbt_platform"/> ([см. документацию](/faqs/Accounts/find-user-id)) |

  **Дополнительная конфигурация для Fusion-инструментов**

Fusion-инструменты по умолчанию используют окружение, указанное через `x-dbt-prod-environment-id`, для метаданных моделей и таблиц.

  | Header | Required | Description |
  | --- | --- | --- |
  | x-dbt-dev-environment-id | Обязательно| ID вашего development-окружения dbt platform |
  | x-dbt-user-id | Обязательно | ID вашего пользователя <Constant name="dbt_platform"/> ([см. документацию](/faqs/Accounts/find-user-id)) |
  | x-dbt-fusion-disable-defer | Необязательно | Значение по умолчанию: `false`. Если установлено в `true`, инструменты <Constant name="fusion"/> не будут откладывать к production-окружению и вместо этого будут использовать модели и метаданные таблиц из development-окружения (`x-dbt-dev-environment-id`). |


  **Конфигурация для отключения инструментов**
  | Header | Required  | Description |
  | --- | --- | --- |
  | x-dbt-disable-tools | Необязательно | Список инструментов для отключения, разделённый запятыми. Например: `get_all_models,text_to_sql,list_entities` |
  | x-dbt-disable-toolsets | Необязательно | Список наборов инструментов для отключения, разделённый запятыми. Например: `semantic_layer,sql,discovery` |

4. После того как вы определите, какие заголовки вам нужны, вы можете воспользоваться [примерами](https://github.com/dbt-labs/dbt-mcp/tree/main/examples), чтобы создать собственного агента.

Протокол MCP не зависит от языка программирования и фреймворка, поэтому используйте всё, что помогает вам создавать агентов. В качестве альтернативы вы можете подключить удалённый MCP-сервер dbt к MCP-клиентам, которые поддерживают аутентификацию на основе заголовков. Вы можете использовать этот пример конфигурации Cursor, заменив `<host>`, `<token>`, `<prod-id>`, `<user-id>` и `<dev-id>` на свои значения:

  ```
  {
    "mcpServers": {
      "dbt": {
        "url": "https://<host>/api/ai/v1/mcp/",
        "headers": {
         "Authorization": "token <token>",
          "x-dbt-prod-environment-id": "<prod-id>",
          "x-dbt-user-id": "<user-id>",
          "x-dbt-dev-environment-id": "<dev-id>"
        }
      }
    }
  }
  ```
