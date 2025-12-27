---
title: "Создание удалённого dbt MCP Server"
description: "Узнайте о новом удалённом dbt MCP-сервере: как он был создан и как использовать его для построения агентов."
slug: building-the-remote-dbt-mcp-server
authors: [devon_fulcher]

tags: [ai, data ecosystem, mcp]
hide_table_of_contents: false

date: 2025-08-26
is_featured: true
---

В апреле мы выпустили локальный [dbt MCP (Model Context Protocol) server](/blog/introducing-dbt-mcp-server) как open source‑проект для подключения AI‑агентов и LLM к доверенным dbt‑ассетам с прямым, управляемым доступом. dbt MCP server предоставляет [универсальный, открытый стандарт](https://docs.anthropic.com/en/docs/mcp) для соединения AI‑систем с вашим структурированным контекстом, что позволяет сохранять точность, управляемость и надежность агентов. Подробнее — в разделе [About dbt Model Context Protocol](/docs/dbt-ai/about-mcp).

С момента релиза локального dbt MCP server сообщество dbt применяло его самыми разными способами, включая агентную разговорную аналитику, исследование дата‑каталога и рефакторинг dbt‑проектов. Однако одним из ключевых отзывов от AI‑инженеров стало то, что локальный dbt MCP server сложно развертывать и хостить для мультиарендных (multi‑tenant) нагрузок, из‑за чего становится трудно строить приложения поверх dbt MCP server.

Именно поэтому мы рады представить новый способ интеграции с dbt MCP — **remote dbt MCP server**. Remote dbt MCP server не требует установки зависимостей или запуска dbt MCP server в вашей инфраструктуре, что делает разработку и запуск агентов проще, чем когда‑либо. Он **доступен уже сегодня в public beta** для пользователей с тарифами dbt Starter, Enterprise или Enterprise+, и готов к использованию для создания AI‑приложений.

<!--truncate-->

## Что такое Remote dbt MCP Server? <Lifecycle status="self_service,managed,managed_plus,beta" />

Чаще всего агенты и MCP‑серверы запускаются локально на вашем компьютере, но подход local‑first накладывает ограничения на типы приложений, которые можно построить. Remote MCP открывает новые сценарии. Например, он позволяет серверным агентам выполнять долгоживущие задачи, использоваться совместно внутри организации и быть доступными через веб‑приложения — все это значительно сложнее (или вовсе невозможно) в локальной агентной архитектуре.

Remote dbt MCP server приносит в эти сценарии **структурированный, управляемый контекст** и позволяет создавать инновационные data‑приложения поверх него. Он дает агенту возможность отвечать на бизнес‑вопросы с помощью [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), находить data‑ассеты через [dbt Discovery API](/docs/dbt-cloud-apis/discovery-api) и выполнять запросы на естественном языке с использованием SQL‑инструментов. Полный список поддерживаемых инструментов вы найдете в документации [здесь](/docs/dbt-ai/about-mcp). Все эти возможности легко интегрируются в разные платформы благодаря стандартизированной спецификации MCP.

Remote dbt MCP server отлично подходит для разработчиков приложений, однако в некоторых случаях все же имеет смысл запускать dbt MCP server локально. В частности, **если вы используете локального coding‑агента, такого как Cursor или Claude Code, мы рекомендуем локальный dbt MCP server.** Это гарантирует, что код, который вы пишете локально, соответствует тому контексту, к которому имеет доступ агент.

## Архитектура Remote dbt MCP Server

Развертывание собственного remote MCP server — нетривиальная задача. Если локальный MCP server должен учитывать только сценарий одного пользователя, то удаленные серверы обязаны управлять одновременными подключениями от множества разных пользователей, а также развертыванием и обслуживанием сервера и инфраструктуры. Кроме того, подключения должны быть безопасно аутентифицированы и изолированы друг от друга. Последние обновления спецификации MCP предлагают новый способ взаимодействия с MCP‑серверами — [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports), который позволяет реализовать stateless‑подключения агентов к удаленным серверам. Streamable HTTP упрощает задачу, но для большинства data‑команд развертывание MCP‑сервера все равно остается сложным. В случае remote dbt MCP server мы берем на себя всю эту сложность, поэтому при разработке агентного приложения вам достаточно просто установить HTTP‑соединение с нашим API.

При этом мы хотели, чтобы remote dbt MCP server обладал функциональностью, аналогичной локальному dbt MCP server, без необходимости полностью переимплементировать инструменты. Для этого мы запустили MCP‑сервер со Streamable HTTP и добавили в него проксированные версии каждого инструмента dbt MCP. Проксированные версии имеют те же параметры, описания и реализацию, что и open source‑версия, обеспечивая единообразный опыт. Разница заключается в том, что эти версии конфигурируются через HTTP‑заголовки, а не через переменные окружения, и напрямую подключаются к нашим внутренним API, что снижает задержки.

<Lightbox src="/img/blog/2025-08-26-building-the-remote-dbt-mcp-server/remote-dbt-mcp.png" title="The remote dbt MCP architecture" />

## Remote dbt MCP Server в действии

Теперь, когда у нас есть общее понимание того, как работает remote dbt MCP server, давайте применим его на практике и создадим простой agent loop с использованием LangGraph на Python. Здесь мы используем LangGraph в качестве примера, но вы можете выбрать любой язык или фреймворк. В каталоге [examples](https://github.com/dbt-labs/dbt-mcp/tree/main/examples) вы найдете дополнительные ресурсы по созданию агентов с dbt MCP server, включая полный пример, показанный ниже.

Реализуемый здесь агент сможет выполнять разговорную аналитику, опираясь на **структурированный, управляемый контекст** из вашего dbt‑проекта. Это означает, что он может принимать вопрос пользователя, искать релевантные метаданные через dbt Discovery API, находить ключевые метрики с помощью dbt Semantic Layer API, исследовать данные и возвращать точный, надежный ответ. Этот пример показывает, как remote dbt MCP server может лежать в основе AI‑приложений, которые сочетают гибкость LLM с надежностью и согласованностью dbt‑ассетов.

Чтобы пример заработал, необходимо установить зависимости LangGraph и задать переменную окружения для Anthropic API key:

```shell
pip install langgraph "langchain[anthropic]" langchain-mcp-adapters
export ANTHROPIC_API_KEY=<your-api-key>
```

Сначала определим URL и заголовки, которые MCP‑клиент будет использовать. Эти значения зависят от конкретного развертывания dbt Cloud. В примере ниже конфигурация задается через переменные окружения. Подробнее о настройке см. в разделе [About dbt Model Context Protocol ](/docs/dbt-ai/about-mcp).

```python
import os

url = f"https://{os.environ.get('DBT_HOST')}/api/ai/v1/mcp/"
headers = {
  "x-dbt-user-id": os.environ.get("DBT_USER_ID"),
  "x-dbt-prod-environment-id": os.environ.get("DBT_PROD_ENV_ID"),
  "x-dbt-dev-environment-id": os.environ.get("DBT_DEV_ENV_ID"),
  "Authorization": f"token {os.environ.get('DBT_TOKEN')}",
}
```

Далее создадим MCP‑клиент, чтобы агент знал, как работать с remote dbt MCP server.

```python
from langchain_mcp_adapters.client import MultiServerMCPClient

client = MultiServerMCPClient(
  {
    "dbt": {
      "url": url,
      "headers": headers,
      "transport": "streamable_http",
    }
  }
)
```

Затем получим список доступных инструментов с remote dbt MCP server.

```python
tools = await client.get_tools()
```

Теперь можно создать LangGraph‑агента.

```python
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import InMemorySaver

agent = create_react_agent(
  model="anthropic:claude-3-7-sonnet-latest",
  tools=tools,
  # This allows the agent to have conversational memory.
  checkpointer=InMemorySaver(),
)
```

Наконец, запустим агента в цикле. В примере используется `print_stream_item`, реализацию которого можно найти в полном примере [здесь](https://github.com/dbt-labs/dbt-mcp/blob/365bc0f4c28b48510d194201370a5500d69cc5ea/examples/langgraph_agent/main.py#L11). Выйти из цикла можно, остановив программу с помощью CTRL+C.

```python
# This config maintains the conversation thread.
config = {"configurable": {"thread_id": "1"}}
while True:
  user_input = input("User > ")
  agent_response = agent.invoke(
    {"messages": {"role": "user", "content": user_input}},
    config
  )
  print_stream_item(item)
```

После реализации агента можно запустить программу и задать вопрос. Вы должны увидеть примерно такой вывод:

```shell
Пользователь > Сколько выручки мы получили в прошлом месяце?
Агент > Я помогу вам узнать выручку за прошлый месяц. Сначала проверю, какие метрики доступны в dbt Semantic Layer.
    using tool: list_metrics
Агент > Я вижу, что у нас доступна метрика "revenue". Давайте получу измерения для этой метрики, чтобы понять, как запросить данные за прошлый месяц:
    using tool: get_dimensions
Агент > Теперь я запрошу метрику выручки за прошлый месяц. Я использую измерение "metric_time" с гранулярностью MONTH:
    using tool: query_metrics
Агент > По результатам общая выручка за прошлый месяц составила **$102,379.00**.
```

## Будущие доработки

Теперь, когда remote dbt MCP доступен в public beta, мы приглашаем вас создавать агентов для взаимодействия с вашими dbt‑ресурсами, привнося **структурированный, управляемый контекст** в AI‑workflow без накладных расходов на локальную настройку. Вот несколько идей для типов агентов, которые можно построить с помощью remote dbt MCP server:

- Ответы на бизнес‑вопросы с использованием точных, управляемых метрик из dbt  
- Обнаружение колонок с PII и автоматическое применение governance‑политик  
- Агент для review PR с целью повышения качества кода и ускорения процесса ревью  
- Исследование метаданных и информации каталога для ускорения data discovery и устранения проблем  
- On‑call агент для поддержки инцидентов и более быстрого устранения сбоев  

Мы продолжаем инвестировать в развитие remote dbt MCP. В ближайшее время появятся такие возможности, как аутентификация на основе OAuth, чтобы сделать аутентификацию и авторизацию в remote MCP еще проще. Если у вас есть отзывы, нужна помощь или вы просто хотите пообщаться, присоединяйтесь к каналу #tools-dbt-mcp в [нашем community Slack](https://www.getdbt.com/community/join-the-community).
