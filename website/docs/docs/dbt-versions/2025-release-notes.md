---
title: "Примечания к выпускам платформы dbt за 2025 год"
description: "Примечания к выпускам платформы dbt за 2025 год"
id: "2025-release-notes"
sidebar_label: "Примечания к выпускам за 2025 год"
pagination_next: null
pagination_prev: null
availability:
  surface: platform
  access: free
---

Примечания к выпускам <Constant name="dbt" /> с описанием последних и более ранних изменений. Примечания к выпускам относятся к одной из следующих категорий:

- **Новое:** Новые продукты и функции
- **Улучшение:** Повышение производительности и улучшение функций
- **Исправление:** Исправления ошибок и уязвимостей безопасности
- **Изменение поведения:** Изменение существующего поведения, которое не относится к другим категориям, например прекращение поддержки функций или изменение настроек по умолчанию

Примечания к выпускам сгруппированы по месяцам как для мультитенантных сред, так и для сред виртуального частного облака (VPC).

## Декабрь 2025

- **Новое**: [Глобальная навигация](/docs/explore/global-navigation) теперь используется по умолчанию в <Constant name="catalog"/> и обеспечивает единый поиск ресурсов dbt во всех ваших проектах, а также ресурсов Snowflake, не относящихся к dbt. Глобальная навигация теперь общедоступна для всех пользователей. Чтобы открыть <Constant name="catalog"/>, нажмите **Catalog** в навигации верхнего уровня.
- **Улучшение**:  Идентификаторы SSO (slug) в dbt теперь генерируются системой при настройке SSO и не подлежат изменению. Уже используемые конфигурации идентификаторов SSO останутся действительными; они будут доступны только для чтения, без возможности изменения. Если вы удалите существующую конфигурацию SSO и создадите новую, вам будет предоставлен новый идентификатор SSO, сгенерированный системой. Это изменение повышает безопасность и не позволяет задавать в аккаунтах идентификаторы, «выдающие себя» за другие организации.
- **Улучшение**: Для пользователей в регионе по умолчанию (`US1`), которые ранее уже создали аккаунт dbt, расширение dbt для VS Code теперь поддерживает регистрацию с помощью OAuth. Это упрощает регистрацию расширения для пользователей, которые забыли пароль или потеряли доступ к своему аккаунту. Подробнее см. в разделе [Вход или регистрация](/docs/sign-in-dbt-extension).
- **Новое и улучшения:** [Пользовательский интерфейс Studio IDE](/docs/platform/studio-ide/ide-user-interface) в dbt улучшен, чтобы предоставить вам удобный доступ к более мощным инструментам разработки:
  -  Обновлённая панель инструментов объединяет все вкладки действий и сведений о проекте для удобного доступа.
  - Отдельная встроенная вкладка **Commands** для истории команд и журналов.
  - При обновлении среды разработки до <Constant name="fusion_engine" /> в ней появляется новая вкладка **Problems**, которая в реальном времени обнаруживает ошибки, способные помешать успешному выполнению проекта. 
 
## Ноябрь 2025

- **Изменение поведения**: [dbt Copilot](/docs/platform/wizard-platform) теперь требует, чтобы все входные файлы использовали кодировку UTF-8. Файлы в других кодировках будут вызывать ошибку. Если вы работаете с устаревшими файлами в другой кодировке, преобразуйте их в UTF-8 перед использованием Copilot.
- **Улучшение**: Повышена надёжность работы dbt Copilot с OpenAI. В частности, увеличены тайм-ауты, улучшена логика повторных попыток и обработка сообщений рассуждений при генерации длинного кода, что сокращает число сбоев и повышает долю успешно завершённых операций.
- **Новое**: Адаптер Snowflake теперь поддерживает базовую материализацию таблиц для таблиц Iceberg, зарегистрированных в каталоге Glue через [базу данных, связанную с каталогом](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database#label-catalog-linked-db-create). Подробнее см. в разделе [Glue Data Catalog](/docs/build/iceberg/adapters/snowflake-iceberg-support#external-catalogs).
- **Новое**: С помощью параметра `platform_detection_timeout_seconds` можно управлять временем ожидания коннектора Snowflake при определении облачной платформы, из которой устанавливается подключение. Подробнее см. в разделе [Настройка Snowflake](/docs/local/connect-data-platform/snowflake-setup?version=1.12#platformdetectiontimeout_seconds).
- **Новое**: Конфигурация `cluster_by` теперь поддерживается в динамических таблицах. Подробнее см. в разделе [Кластеризация динамических таблиц](/reference/resource-configs/snowflake-configs#dynamic-table-clustering).
- **Новое**: Если задание превышает настроенное время ожидания, адаптер BigQuery отправляет запрос на отмену задания BigQuery. Подробнее см. в разделе [Подключение BigQuery](/docs/platform/connect-data-platform/connect-bigquery#job-creation-timeout-seconds).

## Октябрь 2025 {#october-2025}

- **Улучшение**: dbt применяет ограничения на суммарный размер журналов в эндпоинтах запусков. Если размер журналов превышает это ограничение, dbt не включает их в ответ и отображает баннер. Подробнее см. в разделе [Просмотр сведений о запусках](/docs/deploy/run-visibility#log-size-limits).
  
- **Новое**: На сайте документации [docs.getdbt.com](http://docs.getdbt.com/) появилось меню LLM Context на всех страницах документации по продуктам и руководств. Это меню предоставляет быстрый доступ к взаимодействию с текущей страницей с помощью LLM. Теперь вы можете:
  - Скопировать страницу в виде исходного Markdown &mdash; это упрощает цитирование или повторное использование содержимого документации.
  - Открыть страницу непосредственно в ChatGPT или Claude &mdash; вы перейдёте в чат с LLM, где автоматически загрузится сообщение с просьбой прочитать страницу, чтобы вы могли начать разговор с учётом её содержимого.
  <Lightbox src="/img/llm-menu.png" width="50%" title="Меню LLM Context на страницах документации" />
- **Улучшение**:  Функция CodeGenCodeLen вновь доступна в <Constant name="studio_ide" />. Она была [временно](#pre-coalesce) удалена в предыдущем выпуске из-за проблем совместимости.

### Анонсы Coalesce 2025

Следующие функции появились или были улучшены в рамках [конференции dbt по аналитической инженерии Coalesce](https://coalesce.getdbt.com/event/21662b38-2c17-4c10-9dd7-964fd652ab44/summary), проходившей с 13 по 16 октября 2025 года:

- **Новое**: [Сервер dbt MCP](/docs/dbt-ai/about-mcp) теперь общедоступен (GA). Подробнее о сервере dbt MCP и dbt Agents читайте в статье блога [Представляем dbt Agents и удалённый сервер dbt MCP: надёжный ИИ для аналитики](https://www.getdbt.com/blog/dbt-agents-remote-dbt-mcp-server-trusted-ai-for-analytics).
- **Закрытая предварительная версия**: [Платформа dbt на базе Fusion](/docs/dbt-versions/upgrade-dbt-platform-version#dbt-v2) теперь доступна в закрытой предварительной версии. Если у вас есть вопросы, обратитесь к менеджеру вашего аккаунта.
  - В разделе [О подключениях к платформам данных](/docs/platform/connect-data-platform/about-connections) перечислены все доступные подключения <Constant name="dbt_platform" /> на базе Fusion и поддерживаемые способы аутентификации для каждого подключения. 
- **Новое**: Для BigQuery, Databricks, Redshift и Snowflake теперь доступны настройки, специфичные для Fusion. Подробнее см. в разделе [Подключение Fusion к вашей платформе данных](/docs/local/profiles.yml).
- **Альфа-версия**: Адаптер `dbt-salesforce` доступен через CLI <Constant name="fusion_engine" />. Обратите внимание: это подключение находится на стадии альфа-версии и не готово к использованию в производственной среде. Подробнее см. в разделе [Настройка Salesforce Data Cloud](/docs/local/connect-data-platform/salesforce-data-cloud-setup).
- **Закрытая предварительная версия**: [Оркестрация с учётом состояния](/docs/deploy/state-aware-about) теперь доступна в закрытой предварительной версии!
  - **Новое**: Теперь вы можете [включить оркестрацию с учётом состояния](/docs/deploy/state-aware-setup), выбрав **Enable Fusion cost optimization features** в настройках задания. Ранее для включения оркестрации с учётом состояния требовалось отключить **Force node selection**.  
  - **Закрытая бета-версия**: [Функция Efficient Testing](/docs/deploy/state-aware-about#efficient-testing-in-state-aware-orchestration) теперь доступна в закрытой бета-версии. Эта функция снижает затраты на хранилище данных, исключая избыточные тесты данных и объединяя несколько тестов в одном запросе.
  - **Новое**: Чтобы сделать оркестрацию с учётом состояния более прозрачной и предоставить больше контроля при необходимости сброса кэшированного состояния, добавлены следующие [улучшения интерфейса](/docs/deploy/state-aware-interface):
    - Диаграмма **Models built and reused** на странице **Account home**
    - Новые диаграммы в разделе **Overview** задания, отображающие **Recent runs**, **Total run duration**, **Models built** и **Models reused**
    - Новая структура просмотра журналов с группировкой по моделям и вкладкой **Reused** для быстрого поиска повторно использованных моделей
    - Метка **Reused** в режиме просмотра lineage **Latest status**, позволяющая видеть повторно использованные модели в DAG
    - Кнопка **Clear cache** на странице **Environments** для сброса кэшированного состояния при необходимости
- **Новое**: [dbt <Constant name="insights" />](/docs/explore/dbt-insights) теперь общедоступен (GA)!
  - **Закрытая бета-версия**: [Analyst agent](/docs/explore/navigate-dbt-insights#dbt-copilot) теперь доступен в dbt <Constant name="insights" />. Analyst agent — это диалоговый ИИ-инструмент, которому можно задавать запросы на естественном языке и получать результаты анализа в реальном времени. Подробнее см. в разделе [Анализ данных с помощью Analyst agent](/docs/dbt-ai/analyst-agent).
  - **Бета-версия**: [Запросы к Semantic Layer](/docs/explore/navigate-dbt-insights#semantic-layer-querying) в dbt <Constant name="insights" /> теперь доступны в бета-версии. Эта функция позволяет создавать SQL-запросы к Semantic Layer, не записывая SQL-код вручную. Она помогает создавать запросы на основе доступных метрик, измерений и сущностей.
  - **Улучшение**: В [dbt <Constant name="insights" />](/docs/explore/dbt-insights) проекты, обновлённые до [<Constant name="fusion_engine" />](/docs/introduction), получают [функции Language Server Protocol (LSP)](/docs/explore/navigate-dbt-insights#lsp-features), а их компиляция выполняется на <Constant name="fusion" />.
- **Новое**: [MetricFlow](/docs/build/about-metricflow) теперь разрабатывается и поддерживается в рамках инициативы [Open Semantic Interchange (OSI)](https://www.snowflake.com/en/blog/open-semantic-interchange-ai-standard/) и распространяется по [лицензии Apache 2.0](https://github.com/dbt-labs/metricflow/blob/main/LICENSE). Подробнее см. в статье блога [Открытие исходного кода MetricFlow](https://www.getdbt.com/blog/open-source-metricflow-governed-metrics).

### До Coalesce {#pre-coalesce}

- **Изменение поведения**: [URL-адреса доступа](/docs/platform/about-platform/access-regions-ip-addresses) к <Constant name="dbt_platform" /> для аккаунтов в мультитенантном регионе США (US MT) переходят с `cloud.getdbt.com` на выделенные домены в `dbt.com` (например, `us1.dbt.com`). Пользователи будут перенаправляться автоматически, поэтому никаких действий не требуется. Это изменение не затрагивает мультитенантные аккаунты в регионах EMEA и APAC; они будут обновлены до конца ноября 2025 года.

  Организациям, использующим списки разрешённых сетевых адресов, следует добавить `YOUR_ACCESS_URL.dbt.com` в свой список разрешений (например, если ваш URL-адрес доступа — `ab123.us1.dbt.com`, добавьте в список разрешений весь домен `ab123.us1.dbt.com`). 
    
  Все интеграции OAuth, Git и публичного API продолжат работать с прежним доменом. Обновлённый URL-адрес доступа можно посмотреть на странице **Account settings** в <Constant name="dbt_platform" />.

  Если у вас есть вопросы, напишите на [support@getdbt.com](mailto:support@getdbt.com).

- **Улучшение**:
  - **Инструменты MCP для <Constant name="fusion" />** &mdash; Добавлены инструменты <Constant name="fusion" />, поддерживающие `compile_sql` и `get_column_lineage` (только для Fusion) как при [удалённом](/docs/dbt-ai/mcp-available-tools#dbt-lsp), так и при [локальном](/docs/dbt-ai/mcp-available-tools#dbt-lsp) использовании. Удалённые инструменты <Constant name="fusion" /> по умолчанию используют механизм defer с вашей производственной средой (заданной через `x-dbt-prod-environment-id`); отключить defer можно с помощью `x-dbt-fusion-disable-defer=true`. Подробнее см. в разделе [Настройка удалённого MCP](/docs/dbt-ai/setup-remote-mcp).
  - **OAuth для самостоятельно размещённого сервера MCP** &mdash; Теперь самостоятельно размещённый сервер dbt MCP может аутентифицироваться на платформе dbt с помощью OAuth (инструкции доступны для [Claude](/docs/dbt-ai/integrate-mcp-claude), [Cursor](/docs/dbt-ai/integrate-mcp-cursor) и [VS Code](/docs/dbt-ai/integrate-mcp-vscode)), что сокращает объём локального управления секретами и стандартизирует настройку. Подробнее см. в разделе [Аутентификация на платформе dbt](/docs/dbt-ai/setup-local-mcp#dbt-platform-authentication).
- **Изменение поведения**: Функция CodeGenCodeLens, позволяющая создавать модели из источников одним нажатием кнопки, временно удалена из <Constant name="studio_ide" /> из-за проблем совместимости. Мы планируем вернуть её в ближайшее время как в IDE, так и в расширение для VS Code.

## Сентябрь 2025

- **Исправление**: Улучшена обработка [метрик со смещением](/docs/build/derived) в [MetricFlow](/docs/build/about-metricflow) для получения более точных результатов при запросах к временным данным. Теперь MetricFlow соединяет данные _после_ агрегации, если гранулярность запроса совпадает с гранулярностью смещения. Ранее при запросах метрик со смещением соединение со смещением применялось _до_ агрегации, из-за чего некоторые значения могли не попадать в итог за весь период.

## Август 2025

- **Исправление**: Исправлена ошибка, из-за которой экспорт [сохранённых запросов](/docs/build/saved-queries) завершался с ошибками `Unable to get saved_query` при выполнении `dbt build`. 
- **Новое**: В GraphQL API <Constant name="semantic_layer" /> появился эндпоинт [`queryRecords`](/docs/dbt-apis/sl-graphql#query-records). С его помощью можно просматривать историю запросов как для Insights, так и для <Constant name="semantic_layer" />.
- **Исправление**: Исправлена ошибка, из-за которой запросы <Constant name="semantic_layer" /> с пробельным символом в конце вызывали ошибку. Эта проблема в основном затрагивала пользователей [Push.ai](https://docs.push.ai/data-sources/semantic-layers/dbt) и теперь устранена. 
- **Новое**: Теперь для аутентификации в Semantic Layer можно использовать [персональные токены доступа (PAT)](/docs/dbt-apis/user-tokens). Это обеспечивает аутентификацию на уровне пользователя и снижает необходимость совместного использования токенов. При аутентификации с помощью PAT запросы выполняются с вашими личными учётными данными. Подробнее см. в разделе [Настройка dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl).

## Июль 2025

- **Новое**: Стала доступна интеграция [Tableau Cloud](https://www.tableau.com/products/cloud-bi) с Semantic Layer. Подробнее см. в разделе [Tableau](/docs/platform-integrations/semantic-layer/tableau).
- **Предварительная версия**: [Интеграция Semantic Layer с Power BI](/docs/platform-integrations/semantic-layer/power-bi) теперь доступна в предварительной версии.
- **Улучшение:** Теперь при создании [сохранённых запросов](/docs/build/saved-queries) можно использовать параметры `limit` и `order_by`. 
- **Улучшение:** Пользователи с [лицензиями](/docs/platform/manage-access/seats-and-users) IT теперь могут редактировать [глобальные настройки подключений](/docs/platform/connect-data-platform/about-connections#connection-management) и управлять ими.
- **Новое**: В Semantic Layer появились эндпоинты [GraphQL](/docs/dbt-apis/sl-graphql) с пагинацией для запросов метаданных. Это ускоряет загрузку интеграций при работе с большими манифестами. Подробнее см. в разделе [Вызовы для получения метаданных](/docs/dbt-apis/sl-graphql#metadata-calls).

## Июнь 2025

- **Новое**: [System for Cross-Domain Identity Management](/docs/platform/manage-access/scim-entra-id) (SCIM) через Microsoft Entra ID теперь общедоступен (GA). Также доступен на прежних тарифах Enterprise. 
- **Улучшение:** Теперь можно задать [среду компиляции](/docs/explore/access-dbt-insights#set-jinja-environment), чтобы управлять обработкой функций Jinja в dbt Insights.
- **Бета-версия**: Движок dbt Fusion поддерживает адаптер BigQuery в бета-версии.
- **Новое:** Теперь можно просматривать историю изменений настроек [проектов](/docs/platform/account-settings), [сред](/docs/dbt-platform-environments) и [заданий](/docs/deploy/deploy-jobs).
- **Новое:** В Semantic Layer и MetricFlow добавлена поддержка последней версии учётных данных BigQuery.
- **Новое:**  Snowflake External OAuth теперь поддерживается для запросов Semantic Layer.
Подключения Snowflake, использующие External OAuth для учётных данных пользователей, теперь могут отправлять запросы из <Constant name="insights" />, <Constant name="platform_cli" /> и <Constant name="studio_ide" /> через Semantic Layer Gateway. Это обеспечивает безопасный доступ с учётом идентификационных данных через таких провайдеров, как Okta или Microsoft Entra ID.
- **Новое:** Теперь вы можете [скачать свой управляемый Git-репозиторий](/docs/platform/git/managed-repository#download-managed-repository) с платформы dbt.
- **Новое**: <Constant name="semantic_layer" /> теперь поддерживает Trino в качестве платформы данных. Подробнее см. в разделе [Настройка <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- **Новое**: Движок dbt Fusion поддерживает Databricks в бета-версии.
- **Улучшение**: Владельцы групп теперь могут указывать несколько адресов электронной почты для уведомлений на уровне моделей, чтобы оповещать больше участников команды. Ранее поддерживался только один адрес. Подробнее см. в разделе [Настройка групп](/docs/deploy/model-notifications#configure-groups).
- **Новое**: В GraphQL API Semantic Layer появился эндпоинт [`Получение сохранённого запроса`](/docs/dbt-apis/sl-graphql#list-a-saved-query).

## Май 2025

### Презентация dbt Launch Showcase 2025
Следующие функции появились или были улучшены в рамках нашей презентации [dbt Launch Showcase](https://www.getdbt.com/resources/webinars/2025-dbt-cloud-launch-showcase), состоявшейся 28 мая 2025 года:

- **Новое**: Движок dbt Fusion — совершенно новый движок dbt, переписанный с нуля для обеспечения невероятной скорости, инструментов снижения затрат и полноценного набора инструментов для работы с SQL. Движок dbt Fusion теперь доступен в бета-версии для пользователей Snowflake.
  - Узнайте больше [о Fusion](/docs/introduction).
  - Ознакомьтесь с [руководством по обновлению](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2), чтобы понять, какие действия нужны для подготовки проектов к Fusion.
  - Начните тестирование уже сегодня с помощью [краткого руководства](/guides/dbt).
  - Узнайте, [в каком направлении мы развиваем движок dbt Fusion](https://getdbt.com/blog/where-we-re-headed-with-the-dbt-fusion-engine). 
- **Новое**: Расширение dbt для VS Code — это новый мощный инструмент, который привносит скорость и продуктивность движка dbt Fusion в редактор Visual Studio Code. Это бесплатное расширение навсегда изменит ваши рабочие процессы разработки в dbt. Расширение dbt для VS Code теперь доступно в бета-версии [вместе с Fusion](https://getdbt.com/blog/get-to-know-the-new-dbt-fusion-engine-and-vs-code-extension). Ознакомьтесь с [инструкциями по установке](/docs/install-dbt-extension) и узнайте больше [о возможностях расширения](/docs/about-dbt-extension), чтобы улучшить свои рабочие процессы dbt уже сегодня! 
- **Новое**: dbt Explorer теперь называется <Constant name="catalog" />! Подробнее об этом изменении читайте [здесь](https://getdbt.com/blog/updated-names-for-dbt-platform-and-features).
	- Глобальная навигация в dbt Catalog обеспечивает поиск ресурсов dbt во всех ваших проектах, а также ресурсов Snowflake, не относящихся к dbt.
	- Загрузка внешних метаданных позволяет подключаться непосредственно к хранилищу данных и получать сведения о таблицах, представлениях и других ресурсах, не определённых в dbt. 
- **Новое**: [dbt Canvas теперь общедоступен](https://getdbt.com/blog/dbt-canvas-is-ga) (GA). Canvas — это интуитивно понятный визуальный редактор, позволяющий любому пользователю создавать модели dbt с помощью простого интерфейса с перетаскиванием элементов. Узнайте больше [о Canvas](/docs/platform/canvas), чтобы ваши команды могли создавать больше и быстрее! 
- **Новое**: [Оркестрация с учётом состояния](/docs/deploy/state-aware-about) теперь доступна в бета-версии! При каждом запуске нового задания в Fusion оркестрация с учётом состояния автоматически определяет, какие модели нужно построить, выявляя изменения в коде или данных.
- **Новое**: Благодаря Hybrid Projects ваша организация может использовать взаимодополняющие рабочие процессы dbt Core и dbt Cloud и бесшовно объединять их за счёт автоматической загрузки артефактов dbt Core в dbt Cloud. [Hybrid Projects](/docs/deploy/hybrid-projects) теперь доступен в предварительной версии для [аккаунтов <Constant name="dbt" /> Enterprise](https://www.getdbt.com/pricing). 
- **Новое**: [System for Cross-Domain Identity Management (SCIM)](/docs/platform/manage-access/scim) через Okta теперь общедоступен (GA).
- **Новое**: dbt теперь выступает в качестве сервера [Model Context Protocol](/docs/dbt-ai/about-mcp) (MCP), обеспечивая бесшовную интеграцию ИИ-инструментов с хранилищами данных через стандартизированный протокол.
- **Новое**: Стало доступно [краткое руководство для аналитиков данных](/guides/analyze-your-data). С помощью встроенных ИИ-инструментов dbt аналитики данных могут создавать модели данных с централизованным управлением, изучать их устройство и самостоятельно выполнять анализ.
- **Новое**: На странице выставления счетов в аккаунте dbt Cloud можно просматривать [учёт использования и лимиты dbt Copilot](/docs/platform/billing/dbt-ai-usage).
- **Новое**: С помощью Copilot можно создать файл `dbt-styleguide.md` для проектов dbt. Сгенерированный шаблон руководства по стилю включает рекомендации по стилю SQL, организации моделей и соглашениям об именовании, конфигурации моделей и практикам тестирования, а также рекомендации по обеспечению соблюдения правил стиля. Подробнее см. в разделе [Навыки dbt Wizard](/docs/dbt-ai/wizard-skills).
- **Новое**: Чат Copilot — это интерактивный интерфейс в Studio IDE, где можно генерировать SQL-код по запросам на естественном языке и задавать вопросы по аналитике. Он учитывает контекст вашего проекта dbt и помогает упростить разработку SQL. Подробнее см. в разделе [dbt Wizard в Studio IDE](/docs/dbt-ai/wizard-ide).
- **Новое**: Используйте dbt Copilot для генерации SQL-запросов в [Insights](/docs/explore/dbt-insights) по запросам на естественном языке, чтобы эффективно исследовать данные в интерфейсе, учитывающем контекст.
- **Новое**: Панель управления затратами платформы dbt была доступна в предварительной версии пользователям Snowflake на тарифах Enterprise и Enterprise Plus. 25 ноября 2025 года мы прекратили её поддержку, чтобы сосредоточиться на создании более масштабируемого и интегрированного решения для анализа затрат, которое ожидается в начале 2026 года.
- **Новое**: Поддержка интеграции с каталогами Apache Iceberg теперь доступна в Snowflake и BigQuery! Это важный шаг к обеспечению межплатформенной совместимости вашего dbt Mesh на базе Iceberg. Узнайте больше об [Iceberg](/docs/build/iceberg/apache-iceberg-support), чтобы начать создавать таблицы Iceberg. 
- **Обновление**: Переименование продуктов и другие изменения. Подробнее см. в статье [Обновлённые названия платформы dbt и её функций](https://getdbt.com/blog/updated-names-for-dbt-platform-and-features).
  <Expandable alt_header="Справочник названий продуктов">
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
  * Изменения тарифных планов. Подробнее см. в разделе [One dbt](https://www.getdbt.com/product/one-dbt).
  </Expandable>


## Апрель 2025

- **Улучшение**: [Python SDK](/docs/dbt-apis/sl-python) теперь поддерживает отложенную загрузку больших полей `dimensions`, `entities` и `measures` в объектах `Metric`. Подробнее см. в разделе [Отложенная загрузка больших полей](/docs/dbt-apis/sl-python#lazy-loading-for-large-fields).
- **Улучшение**: <Constant name="semantic_layer" /> теперь поддерживает SSH-туннелирование для подключений к [Postgres](/docs/platform/connect-data-platform/connect-postgresql-alloydb#connecting-using-an-ssh-tunnel) и [Redshift](/docs/platform/connect-data-platform/connect-redshift#connecting-using-an-ssh-tunnel). Подробнее см. в разделе [Настройка <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- **Изменение поведения**: Пользователи с [набором разрешений `job admin`](/docs/platform/manage-access/enterprise-permissions#job-admin) теперь могут настраивать интеграции для проектов, в том числе интеграцию с [Tableau](/docs/platform-integrations/downstream-exposures-tableau) для заполнения downstream exposures.

## Март 2025

- **Изменение поведения**: С 31 марта 2025 года версии <Constant name="core" /> 1.0, 1.1 и 1.2 больше не поддерживаются в <Constant name="dbt" />. Их больше нельзя выбрать в качестве версий для проектов dbt. Рабочие нагрузки, использующие эти версии, будут автоматически обновлены до v1.3, что может привести к новым сбоям.
- **Улучшение**: Пользователям [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) в однотенантных конфигурациях больше не нужно обращаться к представителю по работе с аккаунтом для включения этой функции. Теперь настройку можно выполнить самостоятельно во всех конфигурациях развёртывания.
- **Новое**: <Constant name="semantic_layer" /> теперь поддерживает Postgres в качестве платформы данных. Подробнее о настройке <Constant name="semantic_layer" /> для Postgres см. в разделе [Настройка <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- **Новое**: Добавлена новая [переменная окружения по умолчанию](/docs/build/environment-variables#dbt-cloud-context) `DBT_CLOUD_INVOCATION_CONTEXT`. 
- **Улучшение**: Пользователи с [лицензиями только для чтения](/docs/platform/manage-access/about-user-access#licenses) теперь могут просматривать раздел [Deploy](/docs/deploy/deployments) своего аккаунта <Constant name="dbt" /> и переходить в его подразделы, но не могут редактировать содержимое или вносить какие-либо изменения. 

#### День разработчика dbt

Следующие функции появились или были улучшены в рамках нашего мероприятия [dbt Developer day](https://www.getdbt.com/resources/webinars/dbt-developer-day), проходившего 19 и 20 марта 2025 года:

- **Новое**: [Флаг `--sample`](/docs/build/sample-flag), теперь доступный для команд `run` и `build`, помогает сократить время сборки и затраты на хранилище данных, запуская dbt в режиме выборки. Он создаёт отфильтрованные ссылки ref и источники с использованием выборки по времени, позволяя разработчикам проверять результаты без построения моделей целиком.
- **Новое**: <Constant name="wizard" />, помощник на базе ИИ, теперь общедоступен в Cloud IDE для всех аккаунтов <Constant name="dbt" /> Enterprise. Подробнее см. в разделе [<Constant name="wizard" />](/docs/platform/wizard-platform).   

#### Также доступно в этом месяце

- **Новое**: Возможность использовать собственный [ключ Azure OpenAI](/docs/platform/manage-dbt-ai#manage-ai-features) для [<Constant name="wizard" />](/docs/platform/wizard-platform) теперь общедоступна. Ваша организация может настроить <Constant name="wizard" /> на использование собственных ключей Azure OpenAI, получив больше контроля над управлением данными и выставлением счетов.
- **Новое**: <Constant name="semantic_layer" /> поддерживает Power BI как [партнёрскую интеграцию](/docs/platform-integrations/avail-sl-integrations), доступную в закрытой бета-версии. Чтобы присоединиться к закрытому бета-тестированию, обратитесь к представителю по работе с вашим аккаунтом. Подробнее см. в разделе об интеграции с [Power BI](/docs/platform-integrations/semantic-layer/power-bi).
- **Новое**: [Каналы выпусков <Constant name="dbt" />](/docs/dbt-versions/dbt-release-tracks) теперь общедоступны. В зависимости от тарифа клиенты могут выбирать каналы Latest, Compatible или Extended, чтобы управлять частотой обновлений сред разработки и развёртывания.
- **Новое:** Встроенная интеграция <Constant name="dbt" /> с Azure DevOps теперь поддерживает [субъекты-службы Entra ID](/docs/platform/git/setup-service-principal). В отличие от служебного пользователя, представляющего реальный объект пользователя в Entra ID, субъект-служба — это защищённая идентичность, связанная с вашим приложением <Constant name="dbt" /> и предназначенная для доступа к ресурсам Azure без участия пользователя. Как можно скорее [переведите своего служебного пользователя](/docs/platform/git/setup-service-principal#migrate-to-service-principal) на субъект-службу для Azure DevOps.


## Февраль 2025

- **Улучшение**: В [Python SDK](/docs/dbt-apis/sl-python) добавлен новый параметр тайм-аута в клиент Semantic Layer и базовые клиенты GraphQL для задания времени ожидания. Задайте числовое значение тайм-аута или используйте параметр `total_timeout` в глобальном объекте `TimeoutOptions`, чтобы отдельно управлять тайм-аутами подключения, выполнения и закрытия. Параметр `ExponentialBackoff.timeout_ms` теперь устарел.
- **Новое**: Интеграция [Azure DevOps](/docs/platform/git/connect-azure-devops) для <Constant name="git" /> теперь поддерживает [приложения субъектов-служб Entra](/docs/platform/git/setup-service-principal) в аккаунтах <Constant name="dbt" /> Enterprise. Microsoft вводит обязательную многофакторную аутентификацию (MFA) для пользовательских аккаунтов, в том числе служебных пользователей, что повлияет на существующие интеграции приложений. Внедрение происходит поэтапно, и dbt Labs рекомендует [перевести существующие интеграции на субъект-службу](/docs/platform/git/setup-service-principal#migrate-to-service-principal), как только эта возможность станет доступна в вашем аккаунте.
- **Новое**: В [dbt CLI](/docs/platform/dbt-cli-installation) добавлена команда `dbt invocation`. Она позволяет просматривать активные вызовы и управлять ими; вызовы представляют собой длительные сеансы в dbt CLI. Подробнее см. в разделе [dbt invocation](/reference/commands/invocation?version=2.0).
- **Новое**: Пользователи теперь могут переключать темы непосредственно из пользовательского меню; функция доступна [в предварительной версии](/docs/dbt-versions/product-lifecycles). Добавлена поддержка **Light mode** (по умолчанию), **Dark mode** и автоматического переключения темы в соответствии с системными настройками. Выбранная тема сохраняется в профиле пользователя и применяется на всех его устройствах.
  - Тёмная тема сейчас доступна на тарифе Developer и в дальнейшем появится на всех [тарифах](https://www.getdbt.com/pricing). Мы будем внедрять её постепенно, поэтому следите за обновлениями. Подробнее см. в разделе [Изменение темы <Constant name="dbt" />](/docs/platform/about-platform/change-your-dbt-theme).
- **Исправление**: Ошибки <Constant name="semantic_layer" /> в Cloud IDE теперь отображаются с правильным форматированием: устранена проблема, из-за которой переносы строк отображались некорректно или затрудняли чтение. Благодаря этому исправлению сообщения об ошибках стали удобнее для чтения и анализа.
- **Исправление**: Исправлена проблема, из-за которой [сохранённые запросы](/docs/build/saved-queries) без [экспортов](/docs/build/saved-queries#configure-exports) завершались с ошибкой `UnboundLocalError`. Ранее попытка обработать сохранённый запрос без экспортов вызывала ошибку из-за неопределённой переменной relation. Экспорты необязательны, и теперь сохранённые запросы без экспортов не завершаются с ошибкой.
- **Новое**: Теперь можно запрашивать псевдонимы метрик через API [GraphQL](/docs/dbt-apis/sl-graphql) и [JDBC](/docs/dbt-apis/sl-jdbc) в <Constant name="semantic_layer" />. 
  - Для JDBC API подробнее см. в разделе [Запрос псевдонима метрики](/docs/dbt-apis/sl-jdbc#query-metric-alias).
  - Для GraphQL API подробнее см. в разделе [Запрос псевдонима метрики](/docs/dbt-apis/sl-graphql#query-metric-alias).
- **Улучшение**: Добавлена поддержка автоматического обновления токенов доступа при истечении срока действия SSO-подключения Snowflake. Ранее пользователи получали ошибку `Connection is not available, request timed out after 30000ms` и должны были ждать 10 минут перед повторной попыткой.
- **Улучшение**: [Формат `dbt_version`](/reference/commands/version#versioning) в dbt Cloud теперь лучше соответствует [правилам семантического версионирования](https://semver.org/). Удалены ведущие нули в месяце и дне (`YYYY.M.D+<suffix>`). Например:
  - Новый формат: `2024.10.8+996c6a8`
  - Прежний формат: `2024.10.08+996c6a8`
