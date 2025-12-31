---
title: "Заметки о релизах dbt"
description: "Заметки о релизах dbt"
id: "dbt-cloud-release-notes"
sidebar: "dbt release notes"
pagination_next: null
pagination_prev: null
---

<Constant name="cloud" /> release notes содержат информацию о недавних и исторических изменениях. Заметки о релизах относятся к одной из следующих категорий:

- **Новое:** Новые продукты и функции
- **Улучшение:** Улучшение производительности и функций
- **Исправление:** Исправления ошибок и безопасности
- **Изменение поведения:** Изменение существующего поведения, которое не подходит под другие категории, например, устаревание функций или изменения настроек по умолчанию

Релиз‑ноты сгруппированы по месяцам отдельно для мультиарендных (multi-tenant) сред и сред виртуального частного облака (VPC).

## Декабрь 2025 {#december-2025}
- **Улучшение**: теперь SSO‑slug’и dbt генерируются системой автоматически при настройке SSO и не подлежат кастомизации. Конфигурации SSO‑slug’ов, которые уже используются, останутся действительными, но будут доступны только для чтения — изменить их будет нельзя. Если вы удалите существующую конфигурацию SSO и создадите новую, вам будет выдан новый SSO‑slug, сгенерированный системой. Это изменение повышает безопасность и предотвращает возможность настройки slug’ов, которые «имитируют» другие организации.
- **Улучшение**: для пользователей в регионе по умолчанию (`US1`), которые ранее уже создавали аккаунт dbt, расширение dbt для VS Code теперь поддерживает регистрацию через OAuth. Это упрощает регистрацию расширения для пользователей, которые могли забыть пароль или потеряли доступ к своему аккаунту. Подробнее см. [Register the extension](/docs/install-dbt-extension#register-the-extension).
- **Новое и улучшения**: пользовательский интерфейс [Studio IDE](/docs/cloud/studio-ide/ide-user-interface) в dbt был улучшен, чтобы предоставить более мощные инструменты разработки:
  - Новый дизайн панели инструментов, в которой все вкладки действий и информации о проекте сгруппированы для удобного доступа.
  - Отдельная встроенная вкладка **Commands** для истории и логов.
  - При обновлении среды разработки до <Constant name="fusion_engine" /> в окружении появляется новая вкладка **Problems**, которая обеспечивает живое обнаружение ошибок, способных помешать успешному выполнению проекта.

## Ноябрь 2025 {#november-2025}

- **Изменение поведения**: [dbt Copilot](/docs/cloud/dbt-copilot) теперь требует, чтобы все входные файлы использовали кодировку UTF‑8. Файлы с другими кодировками будут возвращать ошибку. Если вы работаете с устаревшими файлами в другой кодировке, преобразуйте их в UTF‑8 перед использованием Copilot.
- **Улучшение**: dbt Copilot стал более надежным при работе с OpenAI. Это включает более длительные тайм‑ауты, улучшенную логику повторных попыток и лучшую обработку reasoning‑сообщений при генерации длинного кода, что приводит к меньшему количеству сбоев и большему числу успешных завершений.
- **Новое**: адаптер Snowflake теперь поддерживает базовую материализацию таблиц для Iceberg‑таблиц, зарегистрированных в каталоге Glue через [catalog-linked database](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database#label-catalog-linked-db-create). Подробнее см. [Glue Data Catalog](/docs/mesh/iceberg/snowflake-iceberg-support#external-catalogs).
- **Новое**: вы можете использовать параметр `platform_detection_timeout_seconds`, чтобы управлять временем ожидания коннектора Snowflake при определении облачной платформы, на которой устанавливается соединение. Подробнее см. [Snowflake setup](/docs/core/connect-data-platform/snowflake-setup#platform_detection_timeout_seconds).
- **Новое**: конфигурация `cluster_by` поддерживается в динамических таблицах. Подробнее см. [Dynamic table clustering](/reference/resource-configs/snowflake-configs#dynamic-table-clustering).
- **Новое**: когда задания превышают настроенный тайм‑аут, адаптер BigQuery отправляет запрос на отмену задания BigQuery. Подробнее см. [Connect BigQuery](/docs/cloud/connect-data-platform/connect-bigquery#job-creation-timeout-seconds).

## Октябрь 2025 {#october-2025}

- **Новое**: на сайте документации [docs.getdbt.com](http://docs.getdbt.com/) появился LLM Context menu на всех страницах документации по продуктам и гайдам. Это меню предоставляет быстрые способы взаимодействия с текущей страницей с помощью LLM. Теперь вы можете:
  - Скопировать страницу в виде «сырого» Markdown &mdash; это упрощает ссылки на контент или его повторное использование.
  - Открыть страницу напрямую в ChatGPT или Claude &mdash; вы будете перенаправлены в чат с LLM, где автоматически загрузится сообщение с просьбой прочитать страницу, что помогает начать диалог с учетом контекста.
  <Lightbox src="/img/llm-menu.png" width="50%" title="LLM Context menu on documentation pages" />
- **Улучшение**: функция CodeGenCodeLen была повторно добавлена в <Constant name="cloud_ide" />. Ранее она была [временно](#pre-coalesce) удалена из‑за проблем совместимости.

### Анонсы Coalesce 2025 {#coalesce-2025-announcements}

Следующие функции являются новыми или улучшенными в рамках аналитической конференции dbt [Coalesce](https://coalesce.getdbt.com/event/21662b38-2c17-4c10-9dd7-964fd652ab44/summary), проходившей 13–16 октября 2025 года:

- **Новое**: [dbt MCP server](/docs/dbt-ai/about-mcp) теперь общедоступен (GA). Подробнее о dbt MCP server и dbt Agents см. в статье [Announcing dbt Agents and the remote dbt MCP Server: Trusted AI for analytics](https://www.getdbt.com/blog/dbt-agents-remote-dbt-mcp-server-trusted-ai-for-analytics).
- **Private preview**: [платформа dbt (powered by Fusion)](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine) доступна в режиме закрытого предварительного просмотра. По вопросам обращайтесь к вашему account manager.
  - Страница [About data platform connections](/docs/cloud/connect-data-platform/about-connections) содержит список всех доступных подключений <Constant name="dbt_platform" /> на Fusion и поддерживаемые методы аутентификации для каждого подключения.
- **Новое**: конфигурации, специфичные для Fusion, теперь доступны для BigQuery, Databricks, Redshift и Snowflake. Подробнее см. [Connect Fusion to your data platform](/docs/fusion/connect-data-platform-fusion/profiles.yml).
- **Alpha**: адаптер `dbt-salesforce` доступен через CLI <Constant name="fusion_engine" />. Обратите внимание, что это соединение находится на стадии Alpha и не готово для продакшена. Подробнее см. [Salesforce Data Cloud setup](/docs/fusion/connect-data-platform-fusion/salesforce-data-cloud-setup).
- **Private preview**: [State-aware orchestration](/docs/deploy/state-aware-about) теперь доступна в закрытом предварительном просмотре.
  - **Новое**: теперь вы можете [включить state-aware orchestration](/docs/deploy/state-aware-setup), выбрав **Enable Fusion cost optimization features** в настройках задания. Ранее для этого требовалось отключить **Force node selection**.
  - **Private beta**: функция [Efficient Testing](/docs/deploy/state-aware-about#efficient-testing-in-state-aware-orchestration) доступна в закрытой бете. Она снижает затраты на вычисления, избегая повторных тестов данных и объединяя несколько тестов в один запрос.
  - **Новое**: для улучшения видимости state‑aware orchestration и большего контроля при необходимости сброса кэшированного состояния добавлены следующие [улучшения UI](/docs/deploy/state-aware-interface):
    - График **Models built and reused** на странице **Account home**
    - Новые графики в разделе **Overview** задания: **Recent runs**, **Total run duration**, **Models built**, **Models reused**
    - Новая структура просмотра логов, сгруппированных по моделям, с вкладкой **Reused**
    - Тег **Reused** в lineage‑представлении **Latest status** для просмотра повторно использованных моделей в DAG
    - Кнопка **Clear cache** на странице **Environments** для сброса кэшированного состояния
- **Новое**: [dbt <Constant name="query_page" />](/docs/explore/dbt-insights) теперь общедоступен (GA).
  - **Private beta**: [Analyst agent](/docs/explore/navigate-dbt-insights#dbt-copilot) доступен в dbt <Constant name="query_page" />. Это разговорная AI‑функция, позволяющая задавать запросы на естественном языке и получать анализ в реальном времени. Подробнее см. [Analyze data with the Analyst agent](/docs/cloud/use-dbt-copilot#analyze-data-with-the-analyst-agent).
  - **Beta**: в dbt <Constant name="query_page" /> появился [Query Builder](/docs/explore/navigate-dbt-insights#query-builder), который позволяет собирать SQL‑запросы к Semantic Layer без написания SQL‑кода.
  - **Улучшение**: в [dbt <Constant name="query_page" />](/docs/explore/dbt-insights) проекты, обновленные до [<Constant name="fusion_engine" />](/docs/fusion), получают поддержку [Language Server Protocol (LSP)](/docs/explore/navigate-dbt-insights#lsp-features), а компиляция выполняется на <Constant name="fusion" />.
- **Новое**: [MetricFlow](/docs/build/about-metricflow) теперь разрабатывается и поддерживается в рамках инициативы [Open Semantic Interchange (OSI)](https://www.snowflake.com/en/blog/open-semantic-interchange-ai-standard/) и распространяется под лицензией [Apache 2.0](https://github.com/dbt-labs/metricflow/blob/main/LICENSE). Подробнее см. пост [Open sourcing MetricFlow](https://www.getdbt.com/blog/open-source-metricflow-governed-metrics).

### Пре-Coalesce {#pre-coalesce}

- **Изменение поведения**: [URL‑адреса доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) <Constant name="dbt_platform" /> для аккаунтов в US multi-tenant (US MT) регионе переводятся с `cloud.getdbt.com` на выделенные домены в `dbt.com` (например, `us1.dbt.com`). Пользователи будут автоматически перенаправлены, никаких действий не требуется. Аккаунты EMEA и APAC MT не затронуты и будут обновлены к концу ноября 2025 года.

  Организациям, использующим allow‑listing сетей, следует добавить `YOUR_ACCESS_URL.dbt.com` в список разрешенных адресов (например, если ваш URL доступа `ab123.us1.dbt.com`, добавьте весь домен `ab123.us1.dbt.com`).

  Все интеграции OAuth, Git и публичные API продолжат работать с прежним доменом. Обновленный URL доступа можно посмотреть на странице **Account settings** в <Constant name="dbt_platform" />.

  По вопросам обращайтесь в [support@getdbt.com](mailto:support@getdbt.com).

- **Улучшение**:
  - **MCP‑инструменты <Constant name="fusion" />** &mdash; добавлены инструменты <Constant name="fusion" />, поддерживающие `compile_sql` и `get_column_lineage` (эксклюзивно для Fusion) для [Remote](/docs/dbt-ai/about-mcp#fusion-tools-remote) и [Local](/docs/dbt-ai/about-mcp#fusion-tools-local) использования. Remote‑инструменты <Constant name="fusion" /> по умолчанию используют prod‑окружение (настраивается через `x-dbt-prod-environment-id`); это поведение можно отключить с помощью `x-dbt-fusion-disable-defer=true`.
  - **Local MCP OAuth** &mdash; теперь вы можете аутентифицировать локальный dbt MCP server в платформе dbt с помощью OAuth (поддержка для [Claude](/docs/dbt-ai/integrate-mcp-claude), [Cursor](/docs/dbt-ai/integrate-mcp-cursor) и [VS Code](/docs/dbt-ai/integrate-mcp-vscode)), что снижает необходимость локального управления секретами и стандартизирует настройку. Подробнее см. [dbt platform authentication](/docs/dbt-ai/setup-local-mcp#dbt-platform-authentication).
- **Изменение поведения**: функция CodeGenCodeLens для создания моделей из источников одним кликом была временно удалена из <Constant name="cloud_ide" /> из‑за проблем совместимости. Планируется повторное внедрение в ближайшем будущем как для IDE, так и для расширения VS Code.

## Сентябрь 2025 {#september-2025}

- **Исправление**: улучшена обработка [offset metrics](/docs/build/derived) в [MetricFlow](/docs/build/about-metricflow) для более точных результатов при запросах временных данных. Теперь MetricFlow выполняет join данных _после_ агрегации, когда grain запроса совпадает с offset grain. Ранее join выполнялся _до_ агрегации, что могло исключать часть значений из общего временного периода.

## Август 2025 {#august-2025}

- **Исправление**: устранена ошибка, из‑за которой экспорт [saved query](/docs/build/saved-queries) завершался неудачей во время `dbt build` с ошибками `Unable to get saved_query`.
- **Новое**: GraphQL API <Constant name="semantic_layer" /> теперь имеет endpoint [`queryRecords`](/docs/dbt-cloud-apis/sl-graphql#query-records), позволяющий просматривать историю запросов как для Insights, так и для запросов <Constant name="semantic_layer" />.
- **Исправление**: устранена ошибка, из‑за которой запросы <Constant name="semantic_layer" /> с пробелом в конце вызывали ошибку. Проблема в основном затрагивала пользователей [Push.ai](https://docs.push.ai/data-sources/semantic-layers/dbt) и теперь исправлена.
- **Новое**: теперь можно использовать [personal access tokens (PATs)](/docs/dbt-cloud-apis/user-tokens) для аутентификации в Semantic Layer. Это позволяет выполнять аутентификацию на уровне пользователя и уменьшает необходимость совместного использования токенов. При использовании PAT запросы выполняются с вашими персональными учетными данными разработки. Подробнее см. [Set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl).

## Июль 2025 {#july-2025}

- **Новое**: интеграция [Tableau Cloud](https://www.tableau.com/products/cloud-bi) с Semantic Layer теперь доступна. Подробнее см. [Tableau](/docs/cloud-integrations/semantic-layer/tableau).
- **Preview**: интеграция Semantic Layer с [Power BI](/docs/cloud-integrations/semantic-layer/power-bi) доступна в режиме Preview.
- **Улучшение**: теперь можно использовать параметры `limit` и `order_by` при создании [saved queries](/docs/build/saved-queries).
- **Улучшение**: пользователи с IT‑[лицензиями](/docs/cloud/manage-access/seats-and-users) теперь могут редактировать и управлять [глобальными настройками подключений](/docs/cloud/connect-data-platform/about-connections#connection-management).
- **Новое**: появились постраничные (paginated) endpoint’ы [GraphQL](/docs/dbt-cloud-apis/sl-graphql) для запросов метаданных в Semantic Layer, что ускоряет интеграции для больших manifest’ов. Подробнее см. [Metadata calls](/docs/dbt-cloud-apis/sl-graphql#metadata-calls).

## Июнь 2025 {#june-2025}

- **Новое**: [System for Cross-Domain Identity Management](/docs/cloud/manage-access/scim#scim-configuration-for-entra-id) (SCIM) через Microsoft Entra ID теперь общедоступен (GA), а также доступен на устаревших Enterprise‑планах.
- **Улучшение**: теперь можно настраивать [compilation environment](/docs/explore/access-dbt-insights#set-jinja-environment) для управления тем, как рендерятся Jinja‑функции в dbt Insights.
- **Beta**: dbt Fusion engine поддерживает адаптер BigQuery в бете.
- **Новое**: теперь доступна история изменений настроек для [проектов](/docs/cloud/account-settings), [окружений](/docs/dbt-cloud-environments) и [заданий](/docs/deploy/deploy-jobs).
- **Новое**: добавлена поддержка последней версии учетных данных BigQuery в Semantic Layer и MetricFlow.
- **Новое**: Snowflake External OAuth теперь поддерживается для запросов Semantic Layer.
Подключения Snowflake с External OAuth могут выполнять запросы для <Constant name="query_page" />, <Constant name="cloud_cli" /> и <Constant name="cloud_ide" /> через Semantic Layer Gateway, обеспечивая безопасный, identity‑aware доступ через провайдеров вроде Okta или Microsoft Entra ID.
- **Новое**: теперь можно [скачать управляемый Git‑репозиторий](/docs/cloud/git/managed-repository#download-managed-repository) из платформы dbt.
- **Новое**: <Constant name="semantic_layer" /> теперь поддерживает Trino как платформу данных. Подробнее см. [Set up the <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- **Новое**: dbt Fusion engine поддерживает Databricks в бете.
- **Улучшение**: владельцы групп теперь могут указывать несколько email‑адресов для уведомлений на уровне моделей, что позволяет оповещать более широкие команды. Ранее поддерживался только один адрес. Подробнее см. [Configure groups](/docs/deploy/model-notifications#configure-groups).
- **Новое**: в GraphQL API Semantic Layer появился endpoint [`List a saved query`](/docs/dbt-cloud-apis/sl-graphql#list-a-saved-query).

## Май 2025 {#may-2025}

### 2025 dbt Launch Showcase {#2025-dbt-launch-showcase}
Следующие функции являются новыми или улучшенными в рамках [dbt Launch Showcase](https://www.getdbt.com/resources/webinars/2025-dbt-cloud-launch-showcase), прошедшего 28 мая 2025 года:

- **Новое**: dbt Fusion engine — это новый движок dbt, полностью переписанный с нуля для обеспечения высокой скорости, инструментов экономии затрат и расширенных возможностей работы с SQL. dbt Fusion engine теперь доступен в бете для пользователей Snowflake.
  - Подробнее [о Fusion](/docs/fusion).
  - Что нужно сделать для подготовки проектов к Fusion — см. [upgrade guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion).
  - Начните тестирование уже сегодня с [quickstart guide](/guides/fusion).
  - Узнайте, [куда мы движемся с dbt Fusion engine](https://getdbt.com/blog/where-we-re-headed-with-the-dbt-fusion-engine).
- **Новое**: расширение dbt для VS Code — это мощный новый инструмент, который приносит скорость и продуктивность dbt Fusion engine прямо в редактор Visual Studio Code. Это бесплатная загрузка, которая меняет рабочие процессы разработки dbt. Расширение dbt для VS Code доступно в бете [вместе с Fusion](https://getdbt.com/blog/get-to-know-the-new-dbt-fusion-engine-and-vs-code-extension). Ознакомьтесь с [инструкциями по установке](/docs/install-dbt-extension) и [описанием возможностей](/docs/about-dbt-extension), чтобы начать работу.
- **Новое**: dbt Explorer теперь называется <Constant name="explorer" />. Подробнее об изменении см. [здесь](https://getdbt.com/blog/updated-names-for-dbt-platform-and-features).
	- dbt Catalog и глобальная навигация предоставляют поиск по ресурсам dbt во всех проектах, а также по не‑dbt ресурсам в Snowflake.
	- Импорт внешних метаданных позволяет напрямую подключаться к хранилищу данных и получать видимость таблиц, представлений и других ресурсов, не определенных в dbt.
- **Новое**: [dbt Canvas теперь общедоступен](https://getdbt.com/blog/dbt-canvas-is-ga) (GA). Canvas — это интуитивный визуальный инструмент редактирования, позволяющий создавать модели dbt с помощью понятного drag‑and‑drop интерфейса. Подробнее см. [Canvas](/docs/cloud/canvas).
- **Новое**: [State-aware orchestration](/docs/deploy/state-aware-about) теперь доступна в бете. При каждом запуске задания в Fusion state-aware orchestration автоматически определяет, какие модели нужно собирать, выявляя изменения в коде или данных.
- **Новое**: Hybrid Projects позволяют организации использовать взаимодополняющие workflows dbt Core и dbt Cloud и бесшовно интегрировать их за счет автоматической загрузки артефактов dbt Core в dbt Cloud. [Hybrid Projects](/docs/deploy/hybrid-projects) доступны в режиме preview для [Enterprise‑аккаунтов <Constant name="cloud" />](https://www.getdbt.com/pricing).
- **Новое**: [SCIM](/docs/cloud/manage-access/scim) через Okta теперь общедоступен (GA).
- **Новое**: dbt теперь выступает в роли сервера [Model Context Protocol](/docs/dbt-ai/about-mcp) (MCP), обеспечивая бесшовную интеграцию AI‑инструментов с хранилищами данных через стандартизированный фреймворк.
- **Новое**: доступен [quickstart guide для аналитиков данных](/guides/analyze-your-data).
- **Новое**: на странице биллинга dbt Cloud теперь можно просматривать [метрики использования и лимиты dbt Copilot](/docs/cloud/billing#dbt-copilot-usage-metering-and-limiting).
- **Новое**: Copilot можно использовать для генерации `dbt-styleguide.md` для проектов dbt.
- **Новое**: Copilot chat — интерактивный интерфейс в Studio IDE для генерации SQL‑кода и аналитических запросов.
- **Новое**: dbt Copilot можно использовать для генерации SQL‑запросов в [Insights](/docs/explore/dbt-insights).
- **Новое**: дашборд Cost management был доступен в preview для пользователей Snowflake на планах Enterprise и Enterprise Plus, но 25 ноября 2025 года был выведен из эксплуатации.
- **Новое**: поддержка интеграции каталогов Apache Iceberg теперь доступна для Snowflake и BigQuery.
- **Обновление**: переименование продуктов и другие изменения. Подробнее см. [Updated names for dbt platform and features](https://getdbt.com/blog/updated-names-for-dbt-platform-and-features).
  <Expandable alt_header="Product names key">
  * Canvas (ранее Visual Editor)
  * Catalog (ранее Explorer)
  * Copilot
  * Cost Management
  * dbt Fusion engine
  * Insights
  * Mesh
  * Orchestrator
  * Studio IDE (ранее Cloud IDE)
  * Semantic Layer
  * Изменения тарифных планов. Подробнее см. [One dbt](https://www.getdbt.com/product/one-dbt).
  </Expandable>


## Апрель 2025 {#april-2025}

- **Улучшение**: [Python SDK](/docs/dbt-cloud-apis/sl-python) теперь поддерживает ленивую загрузку (lazy loading) для больших полей `dimensions`, `entities` и `measures` в объектах `Metric`. Подробнее см. [Lazy loading for large fields](/docs/dbt-cloud-apis/sl-python#lazy-loading-for-large-fields).
- **Улучшение**: <Constant name="semantic_layer" /> теперь поддерживает SSH-туннелирование для подключений [Postgres](/docs/cloud/connect-data-platform/connect-postgresql-alloydb) или [Redshift](/docs/cloud/connect-data-platform/connect-redshift). Подробности см. в разделе [Set up the <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- **Изменение поведения**: Пользователи, которым назначен [набор разрешений `job admin`](/docs/cloud/manage-access/enterprise-permissions#job-admin), теперь имеют доступ к настройке интеграций для проектов, включая интеграцию с [Tableau](/docs/cloud-integrations/downstream-exposures-tableau) для заполнения downstream exposures.

## Март 2025 {#march-2025}

- **Изменение поведения**: Начиная с 31 марта 2025 года версии <Constant name="core" /> 1.0, 1.1 и 1.2 были выведены из эксплуатации в <Constant name="cloud" />. Они больше недоступны для выбора в качестве версий для проектов dbt. Рабочие нагрузки, которые в настоящее время используют эти версии, будут автоматически обновлены до v1.3, что может привести к появлению новых ошибок.
- **Улучшение**: Пользователям [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) в однопользовательских (single-tenant) конфигурациях больше не требуется обращаться к своему аккаунт-менеджеру для включения этой функциональности. Настройка стала self-service и доступна для всех конфигураций арендаторов.
- **Новое**: <Constant name="semantic_layer" /> теперь поддерживает Postgres в качестве платформы данных. Подробнее о настройке <Constant name="semantic_layer" /> для Postgres см. в разделе [Set up the <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- **Новое**: Новое [значение по умолчанию для переменной окружения](/docs/build/environment-variables#dbt-cloud-context) `DBT_CLOUD_INVOCATION_CONTEXT`.
- **Улучшение**: Пользователи с назначенными [лицензиями только для чтения](/docs/cloud/manage-access/about-user-access#licenses) теперь могут просматривать раздел [Deploy](/docs/deploy/deployments) своего аккаунта <Constant name="cloud" /> и переходить в отдельные подразделы, но не могут редактировать или иным образом вносить изменения.

#### dbt Developer day {#dbt-developer-day}

Следующие возможности являются новыми или были улучшены в рамках нашего [dbt Developer Day](https://www.getdbt.com/resources/webinars/dbt-developer-day), который прошёл 19 и 20 марта 2025 года:

- **Новое**: Флаг [`--sample`](/docs/build/sample-flag), теперь доступный для команд `run` и `build`, помогает сократить время сборки и затраты на хранилище, запуская dbt в режиме выборки (sample mode). Он генерирует отфильтрованные refs и sources с использованием временной выборки, позволяя разработчикам проверять результаты без сборки моделей целиком.
- **Новое**: <Constant name="copilot" />, AI‑ассистент, теперь находится в статусе General Availability в Cloud IDE для всех Enterprise‑аккаунтов <Constant name="cloud" />. Подробнее см. в документации [<Constant name="copilot" />](/docs/cloud/dbt-copilot).

#### Также доступно в этом месяце {#also-available-this-month}

- **Новое**: Возможность использовать собственный [ключ Azure OpenAI](/docs/cloud/enable-dbt-copilot#bringing-your-own-openai-api-key-byok) для [<Constant name="copilot" />](/docs/cloud/dbt-copilot) теперь находится в статусе General Availability. Ваша организация может настроить <Constant name="copilot" /> для работы с вашими собственными ключами Azure OpenAI, что даёт больше контроля над управлением данными и биллингом.
- **Новое**: <Constant name="semantic_layer" /> поддерживает Power BI в качестве [партнёрской интеграции](/docs/cloud-integrations/avail-sl-integrations), доступной в рамках private beta. Чтобы присоединиться к private beta, обратитесь к вашему аккаунт‑менеджеру. Подробнее см. в документации по интеграции [Power BI](/docs/cloud-integrations/semantic-layer/power-bi).
- **Новое**: [Release tracks <Constant name="cloud" />](/docs/dbt-versions/cloud-release-tracks) теперь находятся в статусе General Availability. В зависимости от тарифного плана клиенты могут выбрать треки Latest, Compatible или Extended для управления частотой обновлений сред разработки и развертывания.
- **Новое**: Нативная интеграция <Constant name="cloud" /> с Azure DevOps теперь поддерживает [service principals Entra ID](/docs/cloud/git/setup-service-principal). В отличие от service user, который представляет реальный пользовательский объект в Entra ID, service principal — это защищённая идентификация, связанная с вашим приложением <Constant name="cloud" /> для неинтерактивного доступа к ресурсам Azure. Пожалуйста, как можно скорее [мигрируйте вашего service user](/docs/cloud/git/setup-service-principal#migrate-to-service-principal) на использование service principal для Azure DevOps.


## Февраль 2025 {#february-2025}

- **Улучшение**: В [Python SDK](/docs/dbt-cloud-apis/sl-python) добавлен новый параметр тайм-аута для клиента Semantic Layer и для базовых GraphQL‑клиентов, позволяющий задавать тайм-ауты. Вы можете указать значение тайм-аута напрямую или использовать параметр `total_timeout` в глобальном `TimeoutOptions`, чтобы более детально управлять тайм-аутами на подключение, выполнение и закрытие соединения. `ExponentialBackoff.timeout_ms` теперь считается устаревшим.
- **Новое**: Интеграция [Azure DevOps](/docs/cloud/git/connect-azure-devops) для <Constant name="git" /> теперь поддерживает [приложения Entra service principal](/docs/cloud/git/setup-service-principal) в аккаунтах <Constant name="cloud" /> Enterprise. Microsoft вводит обязательное использование MFA для всех пользовательских аккаунтов, включая сервисные, что повлияет на существующие интеграции приложений. Развертывание происходит поэтапно, и dbt Labs рекомендует [мигрировать на service principal](/docs/cloud/git/setup-service-principal#migrate-to-service-principal) в существующих интеграциях, как только эта возможность станет доступна в вашем аккаунте.
- **Новое**: В [dbt CLI](/docs/cloud/cloud-cli-installation) добавлена команда `dbt invocation`. Эта команда позволяет просматривать и управлять активными invocation — долгоживущими сессиями в dbt CLI. Подробнее см. [dbt invocation](/reference/commands/invocation).
- **Новое**: Теперь пользователи могут переключать темы напрямую из пользовательского меню; функция доступна [в Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). Добавлена поддержка **Light mode** (по умолчанию), **Dark mode**, а также автоматического переключения темы на основе системных настроек. Выбранная тема сохраняется в профиле пользователя и применяется на всех устройствах.
  - Dark mode в настоящее время доступен на плане Developer и в будущем будет доступен для всех [планов](https://www.getdbt.com/pricing). Развертывание происходит постепенно — следите за обновлениями. Подробнее см. [Change your <Constant name="cloud" /> theme](/docs/cloud/about-cloud/change-your-dbt-cloud-theme).
- **Исправление**: Ошибки <Constant name="semantic_layer" /> в Cloud IDE теперь отображаются с корректным форматированием. Исправлена проблема, при которой переносы строк отображались некорректно или были трудночитаемы. Это улучшение делает сообщения об ошибках более понятными и удобными для анализа.
- **Исправление**: Исправлена проблема, из‑за которой [saved queries](/docs/build/saved-queries) без [exports](/docs/build/saved-queries#configure-exports) завершались с ошибкой `UnboundLocalError`. Ранее попытка обработать сохранённый запрос без каких-либо экспортов приводила к ошибке из‑за неопределённой переменной relation. Экспорты являются необязательными, и это исправление гарантирует, что saved queries без экспортов больше не завершаются с ошибкой.
- **Новое**: Теперь можно выполнять запросы по metric alias в API <Constant name="semantic_layer" /> — [GraphQL](/docs/dbt-cloud-apis/sl-graphql) и [JDBC](/docs/dbt-cloud-apis/sl-jdbc).
  - Для JDBC API см. [Query metric alias](/docs/dbt-cloud-apis/sl-jdbc#query-metric-alias).
  - Для GraphQL API см. [Query metric alias](/docs/dbt-cloud-apis/sl-graphql#query-metric-alias).
- **Улучшение**: Добавлена поддержка автоматического обновления access token при истечении срока действия SSO‑соединения Snowflake. Ранее пользователи получали ошибку `Connection is not available, request timed out after 30000ms` и были вынуждены ждать 10 минут перед повторной попыткой.
- **Улучшение**: Формат [`dbt_version`](/reference/commands/version#versioning) в dbt Cloud теперь лучше соответствует правилам [семантического версионирования](https://semver.org/). В значениях месяца и дня убраны ведущие нули (`YYYY.M.D+<suffix>`). Например:
  - Новый формат: `2024.10.8+996c6a8`
  - Предыдущий формат: `2024.10.08+996c6a8`
