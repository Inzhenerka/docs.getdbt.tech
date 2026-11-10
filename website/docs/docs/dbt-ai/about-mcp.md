---
title: "Сервер Model Context Protocol для dbt"
sidebar_label: "MCP-сервер dbt"
description: "Узнайте о MCP-сервере dbt"
id: "about-mcp"
availability: all_users
---

import McpToolsFromReadme from '/snippets/_mcp-tools-from-readme.md';

# О сервере dbt Model Context Protocol (MCP)

<IntroText>

[Сервер dbt MCP](https://github.com/dbt-labs/dbt-mcp) предоставляет стандартизированную среду для интеграции ИИ-приложений с ресурсами данных, управляемыми dbt, на различных платформах данных. Это обеспечивает единообразный и контролируемый доступ к моделям, метрикам, происхождению данных и сведениям об их актуальности во всех ваших ИИ-инструментах.

</IntroText>

Чтобы помогать вам работать с dbt, ассистентам нужны метаданные вашего проекта и, с вашего разрешения, доступ к поддерживаемым действиям, таким как запуск CLI, вызовы API платформы и запросы к <Constant name="semantic_layer" />. Сервер dbt MCP предоставляет эти возможности MCP-клиентам и поддерживает такие сценарии, как доступ к данным в диалоговом режиме, автоматизация рабочих процессов dbt с помощью ИИ-агентов и разработка с поддержкой ИИ. На этой странице рассматриваются локальная и удалённая настройка, доступные инструменты и первые шаги.

Сервер MCP предоставляет доступ к [<Constant name="wizard" />](/docs/platform/wizard-overview), <Constant name="platform_cli"/>, [API](/docs/dbt-apis/overview), [Discovery API](/docs/dbt-apis/discovery-api) и [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). Он обеспечивает доступ к закрытым API, преобразованию текста в SQL и выполнению SQL-запросов.

Подробнее см. [Введение в Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction).

MCP-сервер dbt доступен в двух вариантах: с самостоятельным размещением и удалённый.

- [MCP-сервер с самостоятельным размещением](#local-mcp-server): работает на вашем компьютере и требует установки `uvx` (который устанавливает dbt-mcp локально).
- [Удалённый MCP-сервер](#remote-mcp-server): использует HTTP-соединение и удалённо вызывает dbt-mcp на управляемой платформе <Constant name="dbt_platform" />. Это решение размещается на стороне dbt и идеально подходит для сценариев потребления данных.

Подробнее о типах серверов см. в разделе [Доступ к серверу](#server-access).

## Начало работы {#get-started}

Выберите руководство для вашей конфигурации:

<SimpleTable>
| Задача | Руководство | Доступ к инструментам |
| --- | --- | --- |
| Запрашивать данные и запускать команды <Constant name="platform_cli"/> локально с подключением к аккаунту <Constant name="dbt_platform" /> (<Constant name="semantic_layer" />, Discovery API, Admin API, SQL, Codegen). | [Подключиться к <Constant name="dbt_platform"/>](/docs/dbt-ai/mcp-quickstart-oauth) | Использует [локальный MCP-сервер](#local-mcp-server). |
| Запускать команды <Constant name="platform_cli"/> локально с аккаунтом <Constant name="dbt_platform" /> или без него. Если есть аккаунт, тот же сервер позволяет запрашивать данные и изучать метаданные. | [Запустить dbt локально](/docs/dbt-ai/mcp-quickstart-cli) | Использует [локальный MCP-сервер](#local-mcp-server). |
| Использовать MCP без установки. Данные доступны через инструменты, размещённые в dbt. Команды <Constant name="platform_cli"/> недоступны. | [Подключиться к удалённому MCP-серверу dbt](/docs/dbt-ai/mcp-quickstart-remote) | Использует [удалённый MCP-сервер](#remote-mcp-server). |
</SimpleTable>

Настроить или отключить отдельные инструменты локального MCP-сервера можно через [переменные окружения](/docs/dbt-ai/mcp-environment-variables).

## Доступ к серверу {#server-access}

Вы можете использовать MCP-сервер dbt следующими способами:

- [Локальный MCP-сервер](#local-mcp-server) &mdash; работает на вашем компьютере и требует установки `uvx` (который устанавливает dbt-mcp локально), а затем выполнения `uvx dbt-mcp` для запуска сервера. Клонировать репозиторий не нужно, если только вы не хотите внести вклад в разработку [MCP-сервера dbt](https://github.com/dbt-labs/dbt-mcp).
- [Удалённый MCP-сервер](#remote-mcp-server) &mdash; использует HTTP-соединение и отправляет вызовы к dbt-mcp, размещённому на управляемой платформе <Constant name="dbt_platform" />. Этот вариант не требует локальной установки сервера и идеально подходит для сценариев использования данных.

### Локальный MCP-сервер {#local-mcp-server}

Локальный MCP-сервер обеспечивает наилучшие возможности для рабочих процессов разработки, таких как создание моделей dbt, тестов и документации.

[Локальный MCP-сервер](/docs/dbt-ai/setup-local-mcp) работает на вашем компьютере и требует установки `uvx` (который устанавливает dbt-mcp локально), а затем выполнения `uvx dbt-mcp` для запуска сервера. Клонировать репозиторий не нужно, если только вы не хотите внести вклад в разработку dbt MCP. Локальный MCP-сервер предоставляет:
- Полный доступ к командам dbt (`dbt run`, `dbt build`, `dbt test` и другим)
- Поддержку <Constant name="core" />, <Constant name="platform_cli" /> и <Constant name="fusion_engine" />
- Возможность работать с локальными проектами dbt как с учётной записью <Constant name="dbt_platform" />, так и без неё
- Необязательную интеграцию с API <Constant name="dbt_platform" /> для поиска метаданных и доступа к семантическому слою

### Удаленный MCP server {#remote-mcp-server}

Удалённый MCP-сервер dbt позволяет работать со сценариями потребления данных без самостоятельного размещения сервера. Он не поддерживает локальную разработку и команды <Constant name="platform_cli"/>; для этих рабочих процессов используйте [самостоятельно размещаемый MCP-сервер](/docs/dbt-ai/setup-local-mcp).

[Удалённый MCP-сервер](/docs/dbt-ai/setup-remote-mcp) подключается к <Constant name="dbt_platform" /> по HTTP и не требует установки. Этот вариант подходит, если:
- Вы не хотите устанавливать дополнительное программное обеспечение в своей системе или вам запрещено это делать.
- Ваш сценарий использования в основном связан с потреблением данных (например, с запросами метрик, изучением метаданных или просмотром происхождения данных).

Удалённый MCP-сервер доступен на всех [тарифных планах](https://www.getdbt.com/pricing) <Constant name="dbt_platform" />. Однако доступность базовых [API dbt](/docs/dbt-apis/overview), на которые опираются инструменты сервера, зависит от тарифного плана. Например, это касается Discovery API и API <Constant name="semantic_layer" />. Таким образом, набор инструментов, доступных вам через удалённый MCP-сервер, зависит от вашего тарифного плана.

Для удалённого MCP-сервера действует тот же глобальный лимит частоты запросов по умолчанию, что и для других API dbt (5 000 запросов в минуту с одного IP-адреса). На самостоятельно размещаемый MCP-сервер распространяются общедоступные лимиты Administrative API и Discovery API. Подробности см. в разделе [Лимиты частоты запросов к API](/docs/dbt-apis/rate-limits).

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';

<MCPCreditUsage />

### Поддерживаемые инструменты по типу MCP-сервера
MCP-сервер dbt предоставляет доступ ко многим возможностям dbt, связанным с разработкой, развертыванием и исследованием данных. Ниже приведены категории поддерживаемых инструментов в зависимости от типа MCP-сервера, к которому вы подключаетесь, а также подробная информация о конкретных командах и запросах, доступных LLM.

Для команд <Constant name="platform_cli"/>, Codegen и Administrative API требуется самостоятельно размещенный MCP-сервер; удаленный MCP-сервер поддерживает только инструменты <Constant name="semantic_layer" />, SQL, Discovery, Administrative API и <Constant name="fusion" />.

Обратите внимание, что доступ к [API dbt](/docs/dbt-apis/overview) ограничен в зависимости от вашего [тарифного плана](https://www.getdbt.com/pricing).

<SimpleTable>
| Инструменты | Самостоятельно размещенный | Удаленный |
| --- | --- | --- |
| <Constant name="platform_cli"/> commands  | ✅ | ❌ |
| <Constant name="semantic_layer" /> | ✅ | ✅ |
| SQL  | ✅ | ✅ |
| Metadata Discovery| ✅ | ✅ |
| Administrative API | ✅ | ✅ |
| Codegen Tools | ✅ | ❌ |
| <Constant name="fusion" /> Tools | ✅ | ✅ |
| Product Docs Tools |  ✅ | ✅ |
| MCP Server Metadata Tools | ✅ | ✅ |
</SimpleTable>

## Доступные инструменты

Сервер dbt MCP имеет доступ ко множеству инструментов для разработки, развертывания и поиска ресурсов &mdash; например, к CLI 

Полный список инструментов, доступных для вашего сервера MCP, автоматически загружается из [README сервера dbt MCP на GitHub](https://github.com/dbt-labs/dbt-mcp#tools) при сборке документации, поэтому он остается актуальным с каждым выпуском. 

Чтобы просмотреть полный список инструментов, см. раздел [Доступные инструменты](/docs/dbt-ai/mcp-available-tools).

## MCP‑интеграции {#mcp-integrations}

MCP-сервер dbt интегрируется с любым [MCP-клиентом](https://modelcontextprotocol.io/clients), который поддерживает аутентификацию через OAuth или по токену, а также использование инструментов — в зависимости от вашей конфигурации. Мы подготовили руководства по интеграции для следующих клиентов:
- [Claude](/docs/dbt-ai/integrate-mcp-claude)
- [Cursor](/docs/dbt-ai/integrate-mcp-cursor)
- [VS Code](/docs/dbt-ai/integrate-mcp-vscode)
- [Snowflake Cortex](/docs/dbt-ai/integrate-mcp-snowflake-cortex)
- [Databricks](/docs/dbt-ai/integrate-mcp-databricks)

## Хранение данных {#data-retention}

MCP-сервер dbt не хранит производственные данные и результаты запусков. При вызове инструмента сервер в режиме чтения получает из <Constant name="dbt_platform"/> метаданные, результаты заданий и данные <Constant name="semantic_layer"/>.

Срок доступности запусков и артефактов определяется [политикой хранения данных платформы dbt](https://www.getdbt.com/security). MCP-сервер может читать запуски и артефакты, пока они доступны на платформе.


## Ресурсы
- [Справочник по переменным окружения](/docs/dbt-ai/mcp-environment-variables) &mdash; полный список переменных и настроек инструментов для самостоятельно размещаемого сервера MCP
- Дополнительную информацию см. в нашей статье в блоге [Знакомство с сервером dbt MCP](/blog/introducing-dbt-mcp-server#getting-started).
