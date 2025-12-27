---
title: "Примечания к релизам dbt Cloud за 2024 год"
description: "Примечания к релизам dbt Cloud за 2024 год"
id: "2024-release-notes"
sidebar: "2024 Release Notes"
pagination_next: null
pagination_prev: null
---

Примечания к релизам <Constant name="cloud" /> для недавних и исторических изменений. Примечания к релизам относятся к одной из следующих категорий:

- **New:** Новые продукты и возможности
- **Enhancement:** Улучшения производительности и расширения функциональности
- **Fix:** Исправления ошибок и уязвимостей безопасности
- **Behavior change:** Изменения существующего поведения, которые не подпадают под другие категории, например, устаревание функций или изменения значений по умолчанию

Примечания к релизам сгруппированы по месяцам как для многоарендных (multi-tenant), так и для сред с виртуальным частным облаком (VPC)\*

\* Официальная дата выпуска этого нового формата примечаний к релизам — 15 мая 2024 года. Исторические примечания к релизам за более ранние даты могут не отражать все функции, выпущенные ранее в этом году, или их доступность в зависимости от типа развертывания.

## Декабрь 2024

- **New**: Сохранённые запросы теперь поддерживают [tags](/reference/resource-configs/tags), которые позволяют категоризировать ресурсы и фильтровать их. Добавляйте теги к вашим [saved queries](/docs/build/saved-queries) в файле `semantic_model.yml` или `dbt_project.yml`. Например:
  <File name='dbt_project.yml'>

  ```yml
  [saved-queries](/docs/build/saved-queries):
    jaffle_shop:
      customer_order_metrics:
        +tags: order_metrics
  ```
  </File>
- **New**: [Dimensions](/reference/resource-configs/meta) теперь поддерживают свойство конфигурации `meta` в [dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks) и начиная с dbt Core 1.9. Вы можете добавлять метаданные к измерениям, чтобы предоставить дополнительный контекст и информацию. Подробнее см. [meta](/reference/resource-configs/meta).
- **New**: [Downstream exposures](/docs/cloud-integrations/downstream-exposures-tableau) теперь общедоступны (GA) для тарифов <Constant name="cloud" /> Enterprise. Downstream exposures нативно интегрируются с Tableau (поддержка Power BI появится позже) и автоматически создают downstream lineage в dbt Explorer для более богатого пользовательского опыта.
- **New**: <Constant name="semantic_layer" /> поддерживает Sigma в качестве [партнёрской интеграции](/docs/cloud-integrations/avail-sl-integrations), доступной в Preview. Подробнее см. [Sigma](https://help.sigmacomputing.com/docs/configure-a-dbt-semantic-layer-integration).
- **New**: <Constant name="semantic_layer" /> теперь поддерживает развертывания Azure Single-tenant. Подробнее о начале работы см. [Set up the <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- **Fix**: Устранены периодические проблемы в средах Single-tenant, затрагивавшие <Constant name="semantic_layer" /> и историю запросов.
- **Fix**: [The dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) теперь корректно учитывает атрибут BigQuery [`execution_project`](/docs/core/connect-data-platform/bigquery-setup#execution-project), в том числе при экспортах.
- **New**: [Model notifications](/docs/deploy/model-notifications) теперь общедоступны (GA) в <Constant name="cloud" />. Эти уведомления оповещают владельцев моделей по электронной почте о любых проблемах, возникающих при выполнении моделей и тестов во время запуска заданий.
- **New**: Теперь вы можете использовать свой [Azure OpenAI key](/docs/cloud/account-integrations?ai-integration=azure#ai-integrations) (доступно в beta) для использования функций <Constant name="cloud" />, таких как [<Constant name="copilot" />](/docs/cloud/dbt-copilot) и [Ask dbt](/docs/cloud-integrations/snowflake-native-app). Кроме того, вы можете использовать собственный [OpenAI API key](/docs/cloud/account-integrations?ai-integration=openai#ai-integrations) или ключ [OpenAI, управляемый dbt Labs](/docs/cloud/account-integrations?ai-integration=dbtlabs#ai-integrations). Подробнее см. [AI integrations](/docs/cloud/account-integrations#ai-integrations).
- **New**: Конфигурация [`hard_deletes`](/reference/resource-configs/hard-deletes) предоставляет больше контроля над обработкой удалённых строк из источника. Поддерживаемые варианты: `ignore` (по умолчанию), `invalidate` (заменяет устаревший `invalidate_hard_deletes=true`) и `new_record`. Обратите внимание, что `new_record` создаёт новый столбец метаданных в таблице snapshot.

## Ноябрь 2024

- **Enhancement**: Сигналы состояния данных (data health signals) в dbt Explorer теперь доступны для Exposures, обеспечивая быстрый обзор качества данных при просмотре ресурсов. Чтобы увидеть иконки сигналов доверия, перейдите в dbt Explorer и выберите **Exposures** на вкладке **Resource**. Подробнее см. [Data health signals for resources](/docs/explore/data-health-signals).
- **Bug**: Обнаружена и исправлена ошибка в запросах <Constant name="semantic_layer" />, выполнение которых занимало более 10 минут.
- **Fix**: Переопределения переменных окружения задания в учетных данных теперь учитываются для Exports. Ранее они игнорировались.
- **Behavior change**: Если вы используете пользовательский microbatch macro, установите [behavior flag `require_batched_execution_for_custom_microbatch_strategy`](/reference/global-configs/behavior-changes#custom-microbatch-strategy) в `dbt_project.yml`, чтобы включить пакетное выполнение. Если у вас нет пользовательского microbatch macro, устанавливать этот флаг не требуется — dbt автоматически обработает microbatching для любой модели, использующей [microbatch strategy](/docs/build/incremental-microbatch#how-microbatch-compares-to-other-incremental-strategies).
- **Enhancement**: Для пользователей с включённой функцией Advanced CI [compare changes](/docs/deploy/advanced-ci#compare-changes) теперь доступна оптимизация производительности при выполнении сравнений с помощью пользовательского синтаксиса dbt: можно настраивать использование deferral, исключать конкретные крупные модели (или группы моделей с тегами) и многое другое. Примеры см. в [Compare changes custom commands](/docs/deploy/job-commands#compare-changes-custom-commands).
- **New**: SQL linting в CI-заданиях теперь общедоступен (GA) в <Constant name="cloud" />. Вы можете включить SQL linting в своих CI-заданиях с использованием [SQLFluff](https://sqlfluff.com/) для автоматической проверки всех SQL-файлов проекта перед сборкой CI-задания. SQLFluff linting доступен на [<Constant name="cloud" /> release tracks](/docs/dbt-versions/cloud-release-tracks) и для аккаунтов <Constant name="cloud" /> [Team или Enterprise](https://www.getdbt.com/pricing/). Подробнее см. [SQL linting](/docs/deploy/continuous-integration#sql-linting).
- **New**: Используйте конфигурацию [`dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current), чтобы задать пользовательское значение индикатора для `dbt_valid_to` в текущих snapshot-записях (например, будущую дату). По умолчанию это значение равно `NULL`. При настройке dbt будет использовать указанное значение вместо `NULL` для `dbt_valid_to` текущих записей в таблице snapshot. Функция доступна в [dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks) (ранее назывался `Versionless`) и в dbt Core v1.9 и выше.
- **New**: Используйте конфигурацию [`event_time`](/reference/resource-configs/event-time), чтобы указать «в какое время произошла строка». Эта конфигурация обязательна для [Incremental microbatch](/docs/build/incremental-microbatch) и может быть добавлена для корректного сравнения перекрывающихся периодов времени в [Advanced CI compare changes](/docs/deploy/advanced-ci). Доступно в [dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks) (ранее `Versionless`) и в dbt Core v1.9 и выше.
- **Fix**: Это обновление улучшает [интеграцию <Constant name="semantic_layer" /> с Tableau](/docs/cloud-integrations/semantic-layer/tableau), делая разбор запросов более надёжным. Ключевые исправления включают:
  - Сообщения об ошибках для неподдерживаемых join между saved queries и таблицами ALL.
  - Улучшенную обработку запросов при выборе нескольких таблиц в источнике данных.
  - Исправление ошибки при использовании фильтра IN с большим количеством значений.
  - Более информативные сообщения об ошибках для запросов, которые не удаётся корректно разобрать.
- **Enhancement**: <Constant name="semantic_layer" /> поддерживает создание новых учетных данных для пользователей, не имеющих прав на создание service tokens. В боковой панели **Credentials & service tokens** для таких пользователей опция **+Add Service Token** недоступна. Вместо этого отображается сообщение о недостаточных правах с рекомендацией обратиться к администратору. Подробнее см. [Set up <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).

## Октябрь 2024

<Expandable alt_header="Анонсы Coalesce 2024">

  Документация по новым функциям и возможностям, анонсированным на Coalesce 2024:

  - Поддержка таблиц Iceberg для [Snowflake](/reference/resource-configs/snowflake-configs#iceberg-table-format)
  - Поддержка адаптеров [Athena](/reference/resource-configs/athena-configs) и [Teradata](/reference/resource-configs/teradata-configs) в dbt Cloud
  - dbt Cloud теперь размещается в [Azure](/docs/cloud/about-cloud/access-regions-ip-addresses)
  - Обзор [dbt Cloud Release Tracks](/docs/dbt-versions/cloud-release-tracks), которые автоматически поддерживают проект в актуальном состоянии с подходящей для вашей команды периодичностью
  - Масштабируемые [microbatch incremental models](/docs/build/incremental-microbatch)
  - [Advanced CI](/docs/deploy/advanced-ci)
  - [Linting в CI-заданиях](/docs/deploy/continuous-integration#sql-linting)
  - dbt Assist теперь [dbt Copilot](/docs/cloud/dbt-copilot)
  - Блог разработчиков: [Snowflake Feature Store and dbt: A bridge between data pipelines and ML](/blog/snowflake-feature-store)
  - [Downstream exposures с Tableau](/docs/explore/view-downstream-exposures)
  - Интеграция Semantic Layer с [Excel desktop и M365](/docs/cloud-integrations/semantic-layer/excel)
  - [Data health tiles](/docs/explore/data-tile)
  - [Интеграция Semantic Layer и Cloud IDE](/docs/build/metricflow-commands#metricflow-commands)
  - История запросов в [Explorer](/docs/explore/model-query-history#view-query-history-in-explorer)
  - Улучшения Semantic Layer Metricflow, включая [улучшенную гранулярность и пользовательский календарь](/docs/build/metricflow-time-spine#custom-calendar) 
  - [Python SDK](/docs/dbt-cloud-apis/sl-python) теперь общедоступен (GA)

</Expandable>

- **Behavior change:** [Многофакторная аутентификация](/docs/cloud/manage-access/mfa) теперь обязательна для всех пользователей, входящих с использованием имени пользователя и пароля.
- **Enhancement**: JDBC для dbt Semantic Layer теперь позволяет выполнять пагинацию для `semantic_layer.metrics()` и `semantic_layer.dimensions()` с использованием параметров `page_size` и `page_number`. Подробнее см. [Paginate metadata calls](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata).
- **Enhancement**: JDBC для dbt Semantic Layer теперь позволяет фильтровать метрики по наличию определённой подстроки с помощью параметра `search`. Если подстрока не указана, запрос возвращает все метрики. Подробнее см. [Fetch metrics by substring search](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata).
- **Fix**: [Интеграция <Constant name="semantic_layer" /> с Excel](/docs/cloud-integrations/semantic-layer/excel) теперь корректно отображает ошибки при сбое выполнения запроса. Ранее было неясно, почему запрос не выполнялся.
- **Fix:** Ранее POST-запросы к Jobs API с некорректными `cron`-строками возвращали HTTP-статус 500 и при этом обновляли базовую сущность. Теперь такие запросы возвращают статус 400 без обновления сущности.
- **Fix:** Исправлена проблема, из-за которой страница **Source** в dbt Explorer некорректно отображала статус свежести источника, если данные были старше 30 дней.
- **Fix:** Интерфейс теперь указывает, когда описание модели унаследовано из комментария каталога.
- **Behavior change:** Пользовательские API-токены объявлены устаревшими. Обновитесь до [personal access tokens](/docs/dbt-cloud-apis/user-tokens), если вы всё ещё используете старые токены.
- **New**: Cloud IDE поддерживает подписанные коммиты для <Constant name="git" />, доступно для тарифов Enterprise. Вы можете подписывать коммиты <Constant name="git" /> при отправке в репозиторий, чтобы предотвратить подмену личности и повысить безопасность. Поддерживаемые провайдеры <Constant name="git" /> — GitHub и GitLab. Подробнее см. [<Constant name="git" /> commit signing](/docs/cloud/studio-ide/git-commit-signing.md).
- **New:** С <Constant name="mesh" /> теперь можно включать двунаправленные зависимости между проектами. Ранее dbt требовал, чтобы зависимости имели только одно направление. dbt проверяет наличие циклов между проектами и выдаёт ошибки при их обнаружении. Подробнее см. [Cycle detection](/docs/mesh/govern/project-dependencies#cycle-detection). Также доступно руководство [Intro to <Constant name="mesh" />](/best-practices/how-we-mesh/mesh-1-intro).
- **New**: [Python SDK для <Constant name="semantic_layer" />](/docs/dbt-cloud-apis/sl-python) теперь [общедоступен (GA)](/docs/dbt-versions/product-lifecycles). Он предоставляет простой доступ к <Constant name="semantic_layer" /> из Python и позволяет разработчикам взаимодействовать с API для запросов метрик и измерений в downstream-инструментах.
- **Enhancement**: Теперь можно добавлять описание к одиночному data test. Используйте свойство [`description`](/reference/resource-properties/description) для документирования [singular data tests](/docs/build/data-tests#singular-data-tests). Также можно использовать [docs block](/docs/build/documentation#using-docs-blocks) для описания тестов. Улучшение уже доступно в ["Latest" release track в dbt Cloud](/docs/dbt-versions/cloud-release-tracks) и будет включено в dbt Core v1.9.
- **New**: Представлена стратегия [microbatch incremental model](/docs/build/incremental-microbatch) (beta), доступная в [dbt Cloud Latest](/docs/dbt-versions/cloud-release-tracks) и вскоре поддерживаемая в dbt Core v1.9. Стратегия microbatch обеспечивает эффективную пакетную обработку больших временных рядов для повышения производительности и отказоустойчивости, особенно при работе с изменяющимися со временем данными (например, ежедневным добавлением новых записей). Чтобы включить эту функцию в dbt Cloud, установите переменную окружения `DBT_EXPERIMENTAL_MICROBATCH` в значение `true`.
- **New**: dbt Semantic Layer поддерживает пользовательские конфигурации календаря в MetricFlow, доступно в [Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). Пользовательские календари позволяют выполнять запросы с использованием нестандартных периодов времени, таких как `fiscal_year` или `retail_month`. Подробнее см. [custom calendar](/docs/build/metricflow-time-spine#custom-calendar).
- **New**: В "Latest" release track в <Constant name="cloud" /> [Snapshots](/docs/build/snapshots) были обновлены для использования YAML-файлов конфигурации вместо SQL snapshot blocks. Это упрощает управление snapshots и повышает производительность, а также скоро будет выпущено в <Constant name="core" /> 1.9.
  - Кого это касается? Пользователи "Latest" release track в <Constant name="cloud" /> могут определять snapshots с использованием новой YAML-спецификации. Пользователи, обновляющиеся до "Latest" с существующими snapshot-определениями, могут сохранить текущие конфигурации или мигрировать их в YAML.
  - Пользователи старых версий: никаких действий не требуется — существующие snapshots продолжат работать как прежде. Тем не менее, мы рекомендуем обновиться до "Latest" release track, чтобы воспользоваться новыми возможностями snapshots.
- **Behavior change:** Установите [`state_modified_compare_more_unrendered_values`](/reference/global-configs/behavior-changes#source-definitions-for-state) в `true`, чтобы уменьшить количество ложных срабатываний `state:modified`, когда конфигурации различаются между окружениями `dev` и `prod`.
- **Behavior change:** Установите флаг [`skip_nodes_if_on_run_start_fails`](/reference/global-configs/behavior-changes#failures-in-on-run-start-hooks) в `True`, чтобы пропускать выполнение всех выбранных ресурсов, если происходит сбой в `on-run-start` hook.
- **Enhancement**: В "Latest" release track в dbt Cloud snapshots, определённые в SQL-файлах, теперь могут использовать `config`, определённый в YAML-файлах `schema.yml`. Это обновление устраняет прежнее ограничение, требовавшее определять свойства snapshots исключительно в `dbt_project.yml` и/или в блоке `config()` внутри SQL-файла. Это также будет выпущено в dbt Core 1.9.
- **New**: В "Latest" release track в dbt Cloud конфигурация `snapshot_meta_column_names` позволяет настраивать имена метаданных столбцов snapshot. Эта функция позволяет организации привести автоматически создаваемые имена столбцов в соответствие с внутренними соглашениями и будет включена в предстоящий релиз dbt Core 1.9.
- **Enhancement**: "Latest" release track в dbt Cloud автоматически определяет `primary_key` модели на основе настроенных data tests и/или ограничений в `manifest.json`. Определённый `primary_key` отображается в dbt Explorer и используется функцией dbt Cloud [compare changes](/docs/deploy/run-visibility#compare-tab). Это также будет выпущено в dbt Core 1.9. Подробнее см. [порядок, в котором dbt определяет столбцы, используемые в качестве primary key модели](https://github.com/dbt-labs/dbt-core/blob/7940ad5c7858ff11ef100260a372f2f06a86e71f/core/dbt/contracts/graph/nodes.py#L534-L541).
- **New:** dbt Explorer теперь включает иконки trust signals, которые в настоящее время доступны в [Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). Trust signals предоставляют быстрый визуальный обзор состояния данных при просмотре моделей dbt в dbt Explorer. Эти иконки показывают, находится ли модель в состоянии **Healthy**, **Caution**, **Degraded** или **Unknown**. Для получения корректных данных о состоянии убедитесь, что ресурс актуален и недавно выполнялся job. Подробнее см. [Data health signals](/docs/explore/data-health-signals).
- **New:** Downstream exposures теперь доступны в Preview в <Constant name="cloud" />. Downstream exposures помогают пользователям понимать, как их модели используются в downstream аналитических инструментах, чтобы обоснованно инвестировать и снижать количество инцидентов. Функция импортирует и автоматически генерирует exposures на основе дашбордов Tableau с возможностью пользовательской курации. Подробнее см. [Downstream exposures](/docs/cloud-integrations/downstream-exposures-tableau).

## Сентябрь 2024

- **Fix**: В MetricFlow обновлён `get_and_expire`, который заменяет неподдерживаемую команду `GETEX` на `GET` с условным сроком действия, обеспечивая совместимость с Azure Redis 6.0.
- **Enhancement**: [dbt Semantic Layer Python SDK](/docs/dbt-cloud-apis/sl-python) теперь поддерживает пользовательскую гранулярность `TimeGranularity` для метрик. Это позволяет определять нестандартные временные гранулярности, такие как `fiscal_year` или `retail_month`, для выполнения запросов по нетипичным временным периодам.
- **New**: Используйте AI-движок <Constant name="copilot" /> для генерации semantic model для ваших моделей — теперь доступно в beta. <Constant name="copilot" /> автоматически создаёт документацию, тесты и теперь semantic models на основе данных вашей модели. Подробнее см. [<Constant name="copilot" />](/docs/cloud/dbt-copilot).
- **New**: Используйте новый рекомендуемый синтаксис для [определения ограничений `foreign_key`](/reference/resource-properties/constraints) с применением `refs`, доступный в "Latest" release track в dbt Cloud. Вскоре это будет выпущено в dbt Core v1.9. Новый синтаксис корректно фиксирует зависимости и работает в разных окружениях.
- **Enhancement**: Теперь вы можете запускать [Semantic Layer commands](/docs/build/metricflow-commands) в [dbt Cloud IDE](/docs/cloud/studio-ide/develop-in-studio). Поддерживаемые команды: `dbt sl list`, `dbt sl list metrics`, `dbt sl list dimension-values`, `dbt sl list saved-queries`, `dbt sl query`, `dbt sl list dimensions`, `dbt sl list entities` и `dbt sl validate`.
- **New**: Интеграция с Microsoft Excel — интеграция <Constant name="semantic_layer" /> — теперь общедоступна (GA). Она позволяет подключаться к Microsoft Excel для запросов метрик и совместной работы с командой. Доступно для [Excel Desktop](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationId=4132ecd1-425d-982d-efb4-de94ebc83f26) и [Excel Online](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationid=4132ecd1-425d-982d-efb4-de94ebc83f26&isWac=True). Подробнее см. [Microsoft Excel](/docs/cloud-integrations/semantic-layer/excel).
- **New**: [Data health tile](/docs/explore/data-tile) теперь общедоступен (GA) в dbt Explorer. Data health tiles предоставляют быстрый обзор качества данных, подсвечивая потенциальные проблемы. Вы можете встраивать эти tiles в дашборды для быстрого выявления и устранения проблем с данными в вашем dbt-проекте.
- **New**: Функция истории запросов моделей (Model query history) в dbt Explorer теперь доступна в Preview для клиентов <Constant name="cloud" /> Enterprise. Она позволяет просматривать количество запросов потребления для модели на основе логов запросов хранилища данных, помогая командам сосредоточить усилия и расходы инфраструктуры на действительно используемых data products. Подробнее см. [Model query history](/docs/explore/model-query-history).
- **Enhancement**: Теперь вы можете использовать [Extended Attributes](/docs/dbt-cloud-environments#extended-attributes) и [Environment Variables](/docs/build/environment-variables) при подключении к <Constant name="semantic_layer" />. Если значение задано напрямую в учетных данных <Constant name="semantic_layer" />, оно имеет более высокий приоритет, чем Extended Attributes. При использовании environment variables будет применяться значение по умолчанию для окружения. Если вы используете exports, переопределения переменных окружения заданий пока не поддерживаются, но скоро будут.
- **New:** Добавлены два новых значения по умолчанию для [environment variable defaults](/docs/build/environment-variables#dbt-cloud-context) — `DBT_CLOUD_ENVIRONMENT_NAME` и `DBT_CLOUD_ENVIRONMENT_TYPE`.
- **New:** [Подключение к хранилищу Amazon Athena](/docs/cloud/connect-data-platform/connect-amazon-athena) доступно в режиме public preview для аккаунтов <Constant name="cloud" />, обновлённых до [“Latest” release track](/docs/dbt-versions/cloud-release-tracks).

## Август 2024

- **Fix:** Исправлена проблема в [dbt Explorer](/docs/explore/explore-projects), при которой переход в consumer project из публичного узла приводил к отображению случайной публичной модели вместо исходного выбора.
- **New**: Теперь вы можете настраивать метрики с более мелкой временной гранулярностью, например по часам, минутам или даже секундам. Это особенно полезно для более детального анализа и для наборов данных с высокоточной временной информацией, таких как поминутное отслеживание событий. Подробнее см. [dimensions](/docs/build/dimensions).
- **Enhancement**: Microsoft Excel теперь поддерживает [saved selections](/docs/cloud-integrations/semantic-layer/excel#using-saved-selections) и [saved queries](/docs/cloud-integrations/semantic-layer/excel#using-saved-queries). Saved selections позволяют сохранять выбранные параметры запроса внутри приложения Excel. Приложение также по умолчанию очищает устаревшие данные в [trailing rows](/docs/cloud-integrations/semantic-layer/excel#other-settings). Чтобы вернуть результаты и сохранить ранее выбранные данные, снимите флажок **Clear trailing rows**.
- **Behavior change:** GitHub больше не поддерживается для OAuth-входа в <Constant name="cloud" />. Используйте поддерживаемого [SSO или OAuth provider](/docs/cloud/manage-access/sso-overview) для безопасного управления доступом к вашему аккаунту <Constant name="cloud" />.

## Июль 2024

- **Behavior change:** `target_schema` больше не является обязательной конфигурацией для [snapshots](/docs/build/snapshots). Теперь вы можете нацеливать snapshots на разные схемы в средах разработки и развертывания, используя [schema config](/reference/resource-configs/schema).
- **New:** [Connections](/docs/cloud/connect-data-platform/about-connections#connection-management) теперь доступны в разделе **Account settings** как глобальная настройка. Ранее они находились в **Project settings**. Изменение внедряется поэтапно в течение ближайших недель.
- **New:** Администраторы теперь могут назначать [environment-level permissions](/docs/cloud/manage-access/environment-permissions) группам для конкретных ролей.
- **New:** [Merge jobs](/docs/deploy/merge-jobs) для реализации workflows [continuous deployment (CD)](/docs/deploy/continuous-deployment) теперь общедоступны (GA) в <Constant name="cloud" />. Ранее требовалось либо настраивать пользовательский GitHub action, либо вручную собирать изменения при каждом merge pull request.
- **New**: Возможность выполнять lint ваших SQL-файлов из CLI <Constant name="cloud" /> теперь доступна. Подробнее см. [Lint SQL files](/docs/cloud/configure-cloud-cli#lint-sql-files).
- **Behavior change:** dbt Cloud IDE автоматически добавляет `--limit 100` к preview-запросам, чтобы избежать медленных и дорогих запросов во время разработки. Недавно dbt Core изменил способ применения `limit`, чтобы гарантировать корректную обработку `order by`. Из-за этого запросы, уже содержащие `limit`, могут теперь вызывать ошибки в preview IDE. Для решения проблемы dbt Labs планирует вскоре предоставить возможность отключать автоматическое добавление limit. До этого момента dbt Labs рекомендует удалять (дублирующийся) limit из запросов при preview, чтобы избежать ошибок IDE.

- **Enhancement**: Представлена обновлённая страница обзора dbt Explorer, доступная в beta. Она включает новый дизайн и компоновку главной страницы dbt Explorer, а также новый раздел **Latest updates** для просмотра последних изменений или проблем, связанных с ресурсами проекта. Подробнее см. [Overview page](/docs/explore/explore-projects#overview-page).

#### dbt Semantic Layer

- **New**: Представлена Python-библиотека [`dbt-sl-sdk` SDK](https://github.com/dbt-labs/semantic-layer-sdk-python), которая предоставляет удобный доступ к dbt Semantic Layer из Python. Она позволяет разработчикам взаимодействовать с API dbt Semantic Layer и выполнять запросы метрик и измерений в downstream-инструментах. Подробнее см. [dbt Semantic Layer Python SDK](/docs/dbt-cloud-apis/sl-python).
- **New**: Введены semantic validations в CI pipelines. Теперь можно автоматически тестировать semantic nodes (метрики, semantic models и saved queries) во время code review, добавляя проверки в CI-задание с помощью команды `dbt sl validate`. Также можно валидировать изменённые semantic nodes, чтобы гарантировать, что изменения в dbt-моделях не нарушают работу метрик. Подробнее см. [Semantic validations in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci).
- **New**: Поле `meta` теперь доступно в свойстве [config](/reference/resource-configs/meta) для метрик dbt Semantic Layer в [JDBC и GraphQL API](/docs/dbt-cloud-apis/sl-api-overview) в поле `meta`.
- **New**: Добавлена новая команда dbt CLI — `export-all`, которая позволяет экспортировать несколько или все saved queries. Ранее требовалось явно указывать [список saved queries](/docs/build/metricflow-commands#list-saved-queries).
- **Enhancement**: <Constant name="semantic_layer" /> теперь предоставляет более детальный контроль, поддерживая несколько учетных данных платформ данных, которые могут представлять разные роли или service accounts. Доступно для тарифов <Constant name="cloud" /> Enterprise — вы можете сопоставлять учетные данные с service tokens для безопасной аутентификации. Подробнее см. [Set up <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer).
- **Fix**: Исправлена ошибка, из-за которой unicode-фильтры запросов (например, с китайскими символами) не работали корректно в интеграции <Constant name="semantic_layer" /> с Tableau.
- **Fix**: Исправлена ошибка разбора некоторых приватных ключей для BigQuery при выполнении экспорта.
- **Fix**: Устранена ошибка, из-за которой при выполнении запроса или экспорта возвращалась ошибка «closed connection».
- **Fix**: Исправлена проблема в <Constant name="core" />, при которой во время partial parsing все сгенерированные метрики в файле ошибочно удалялись вместо удаления только тех, которые связаны с изменённой semantic model. Теперь затрагиваются только метрики, связанные с модифицированной моделью.

## Июнь 2024

- **New:** Добавлена поддержка новой гранулярности для cumulative metrics в MetricFlow. Параметры гранулярности для cumulative metrics немного отличаются от других типов метрик. Для обычных метрик используется функция `date_trunc`. Однако cumulative metrics являются неаддитивными (значения нельзя просто суммировать), поэтому `date_trunc` неприменим для изменения их временной гранулярности.

  Вместо этого используются агрегатные функции `first()`, `last()` и `avg()` для агрегации cumulative metrics за запрошенный период. По умолчанию используется первое значение периода. Это поведение можно изменить с помощью параметра `period_agg`. Подробнее см. [Granularity options for cumulative metrics](/docs/build/cumulative#granularity-options).

#### dbt Semantic Layer

- **New:** Добавлена поддержка SQL-оптимизации <Term id="predicate-pushdown"/> в MetricFlow. Теперь категориальные фильтры измерений передаются (push down) непосредственно в таблицу-источник метрик. Ранее фильтры применялись после выбора данных из таблицы-источника. Это изменение помогает сократить полные сканирования таблиц в некоторых движках запросов.
- **New:** Включена поддержка `where`-фильтров для измерений (включённых в saved queries) с использованием кэша во время выполнения запросов. Это означает, что теперь вы можете динамически фильтровать дашборды, не теряя преимуществ кэширования. Подробнее см. [caching](/docs/use-dbt-semantic-layer/sl-cache#result-caching).
- **Enhancement:** В [Google Sheets](/docs/cloud-integrations/semantic-layer/gsheets) добавлены иконки информации и описания для опций метрик и измерений в меню Query Builder. Нажмите на кнопку **Info**, чтобы просмотреть описание метрики или измерения. Доступно в следующих разделах меню Query Builder: metric, group by, where, saved selections и saved queries.
- **Enhancement:** В [Google Sheets](/docs/cloud-integrations/semantic-layer/gsheets) теперь можно применять гранулярность ко всем временным измерениям, а не только ко времени метрики. Обновление использует наши [API](/docs/dbt-cloud-apis/sl-api-overview) для поддержки выбора гранулярности для любого выбранного временного измерения.
- **Enhancement**: Предупреждения о time spine в MetricFlow теперь побуждают пользователей настраивать отсутствующие или слишком крупные time spine. Сообщение об ошибке отображается при наличии нескольких time spine для одной гранулярности.
- **Enhancement**: Теперь отображаются ошибки, если для запрошенной или более мелкой гранулярности не настроен time spine.
- **Enhancement:** Улучшено сообщение об ошибке при выполнении запросов, если не заданы учетные данные semantic layer.
- **Enhancement:** Запрос гранулярностей для cumulative metrics теперь возвращает несколько вариантов (day, week, month, quarter, year), как и для всех других типов метрик. Ранее для cumulative metrics был доступен только один вариант.
- **Fix:** Удалены ошибки, препятствовавшие запросам cumulative metrics с другими гранулярностями.
- **Fix:** Исправлены различные ошибки Tableau при запросах некоторых метрик или при использовании вычисляемых полей.
- **Fix:** В Tableau были ослаблены требования к именованию полей для более корректного распознавания вычисляемых полей.
- **Fix:** Исправлена ошибка при обновлении метаданных базы данных для столбцов, которые невозможно преобразовать в Arrow. Такие столбцы теперь пропускаются. В основном это затрагивало пользователей Redshift с пользовательскими типами.
- **Fix:** Исправлены Private Link подключения для Databricks.

#### Также доступно в этом месяце:

- **Улучшение:** Теперь доступны обновления UI при [создании merge jobs](/docs/deploy/merge-jobs). Обновления включают улучшенный вспомогательный текст, новые настройки deferral и улучшения производительности.
- **Новое:** <Constant name="semantic_layer" /> теперь предлагает бесшовную интеграцию с Microsoft Excel, доступную в режиме [preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). Вы можете строить запросы к semantic layer и получать данные по метрикам напрямую в Excel через специальное меню. Подробнее и для установки дополнения см. [Microsoft Excel](/docs/cloud-integrations/semantic-layer/excel).
- **Новое:** [Предупреждения заданий (Job warnings)](/docs/deploy/job-notifications) теперь доступны в статусе GA. Ранее вы могли получать email- или Slack-уведомления о заданиях при их успешном выполнении, ошибке или отмене. Теперь с новой опцией **Warns** вы также можете получать уведомления, когда во время выполнения задания возникали предупреждения из тестов или проверок свежести источников. Это дает больше гибкости в том, _когда_ получать уведомления.
- **Новое:** Теперь доступен [preview](/docs/dbt-versions/product-lifecycles#dbt-cloud) dbt Snowflake Native App. С помощью этого приложения вы можете получать доступ к dbt Explorer, чат-боту **Ask dbt** и функциям наблюдаемости оркестрации, расширяя возможности <Constant name="cloud" /> прямо в интерфейсе Snowflake. Подробнее см. [About the dbt Snowflake Native App](/docs/cloud-integrations/snowflake-native-app) и [Set up the dbt Snowflake Native App](/docs/cloud-integrations/set-up-snowflake-native-app).

## Май 2024

- **Улучшение:** В IDE появился новый [кнопка **Prune branches** <Constant name="git" />](/docs/cloud/studio-ide/ide-user-interface#prune-branches-modal). Эта кнопка позволяет удалять локальные ветки, которые уже были удалены из удаленного репозитория, помогая поддерживать порядок в управлении ветками. Доступно во всех регионах и будет выпущено для single-tenant аккаунтов в следующем релизном цикле.

#### Событие dbt Cloud Launch Showcase

Следующие функции были добавлены или улучшены в рамках мероприятия [<Constant name="cloud" /> Launch Showcase](https://www.getdbt.com/resources/webinars/dbt-cloud-launch-showcase), которое состоялось 14 мая 2024 года:

- **Новое:** [<Constant name="copilot" />](/docs/cloud/dbt-copilot) — это мощный AI-движок, который помогает генерировать документацию, тесты и семантические модели, экономя время при создании высококачественных данных. Доступен в private beta для части пользователей <Constant name="cloud" /> Enterprise и в IDE. [Зарегистрируйте интерес](https://docs.google.com/forms/d/e/1FAIpQLScPjRGyrtgfmdY919Pf3kgqI5E95xxPXz-8JoVruw-L9jVtxg/viewform), чтобы присоединиться к private beta.

- **Новое:** Новый low-code редактор, сейчас в private beta, позволяет аналитикам с ограниченными знаниями SQL создавать или редактировать dbt-модели через визуальный интерфейс drag-and-drop внутри <Constant name="cloud" />. Эти модели компилируются напрямую в SQL и не отличаются от других dbt-моделей в ваших проектах: они находятся под контролем версий, доступны между проектами в <Constant name="mesh" /> и интегрируются с dbt Explorer и Cloud IDE. [Зарегистрируйте интерес](https://docs.google.com/forms/d/e/1FAIpQLScPjRGyrtgfmdY919Pf3kgqI5E95xxPXz-8JoVruw-L9jVtxg/viewform), чтобы присоединиться к private beta.

- **Новое:** [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation) теперь доступен в статусе GA для всех пользователей. <Constant name="cloud" /> CLI — это интерфейс командной строки, который позволяет взаимодействовать с <Constant name="cloud" />, использовать автоматический deferral, работать с <Constant name="mesh" /> и многое другое.

- **Новое:** [Unit tests](/docs/build/unit-tests) теперь доступны в статусе GA в <Constant name="cloud" />. Unit-тесты позволяют проверять логику SQL-моделей на наборе статических входных данных.

- <Expandable alt_header="New: Native support for Azure Synapse Analytics" lifecycle="preview"> 

  Нативная поддержка Azure Synapse Analytics в dbt Cloud теперь доступна в режиме [preview](/docs/dbt-versions/product-lifecycles#dbt-cloud)!

  Подробнее см. [Connect Azure Synapse Analytics](/docs/cloud/connect-data-platform/connect-azure-synapse-analytics) и [Microsoft Azure Synapse DWH configurations](/reference/resource-configs/azuresynapse-configs).

  Также ознакомьтесь с [Quickstart for dbt Cloud and Azure Synapse Analytics](/guides/azure-synapse-analytics?step=1). Руководство проведет вас через следующие шаги:

  - Загрузка примерных данных Jaffle Shop (предоставленных dbt Labs) в Azure Synapse Analytics.
  - Подключение dbt Cloud к Azure Synapse Analytics.
  - Преобразование примерного запроса в модель в вашем dbt-проекте. Модель в dbt — это SELECT-выражение.
  - Добавление тестов к моделям.
  - Документирование моделей.
  - Планирование задания на выполнение.

  </Expandable>

- **Новое:** MetricFlow теперь позволяет добавлять метрики в качестве измерений (dimensions) в фильтры метрик для создания более сложных метрик и получения большего количества инсайтов. Доступно для всех пользователей <Constant name="semantic_layer" />.

- **Новое:** [Staging environment](/docs/deploy/deploy-environments#staging-environment) теперь доступна в статусе GA. Используйте staging-окружения, чтобы предоставлять разработчикам доступ к деплой-воркфлоу и инструментам, при этом контролируя доступ к production-данным. Доступно всем пользователям <Constant name="cloud" />.

- **Новое:** Поддержка входа по OAuth через [Databricks](/docs/cloud/manage-access/set-up-databricks-oauth) теперь доступна в статусе GA для Enterprise-клиентов.

- <Expandable alt_header="New: GA of dbt Explorer's features" > 

  Текущие возможности dbt Explorer — включая lineage на уровне колонок, анализ производительности моделей и рекомендации по проекту — теперь доступны в статусе GA для планов dbt Cloud Enterprise и Teams. Explorer позволяет проще навигировать по проекту dbt Cloud (модели, источники и их колонки), чтобы лучше понимать его актуальное состояние в production или staging.

  Подробнее о возможностях:
  
  - [Explore проекты](/docs/explore/explore-projects)
  - [Explore нескольких проектов](/docs/explore/explore-multiple-projects) 
  - [Lineage на уровне колонок](/docs/explore/column-level-lineage) 
  - [Производительность моделей](/docs/explore/model-performance) 
  - [Рекомендации по проекту](/docs/explore/project-recommendations) 

  </Expandable>

- **Новое:** Нативная поддержка Microsoft Fabric в <Constant name="cloud" /> теперь доступна в статусе GA. Функция реализована с помощью адаптера [dbt-fabric](https://github.com/Microsoft/dbt-fabric). Подробнее см. [Connect Microsoft Fabric](/docs/cloud/connect-data-platform/connect-microsoft-fabric) и [Microsoft Fabric DWH configurations](/reference/resource-configs/fabric-configs). Также доступен [quickstart guide](/guides/microsoft-fabric?step=1), который поможет начать работу.

- **Новое:** <Constant name="mesh" /> теперь доступен в статусе GA для пользователей <Constant name="cloud" /> Enterprise. <Constant name="mesh" /> — это фреймворк, который помогает организациям эффективно масштабировать команды и данные. Он продвигает лучшие практики управления и разбивает крупные проекты на управляемые части. Начните работу с <Constant name="mesh" />, прочитав [<Constant name="mesh" /> quickstart guide](/guides/mesh-qs?step=1).

- **Новое:** Интеграции <Constant name="semantic_layer" /> с [Tableau Desktop, Tableau Server](/docs/cloud-integrations/semantic-layer/tableau) и [Google Sheets](/docs/cloud-integrations/semantic-layer/gsheets) теперь доступны в статусе GA для аккаунтов <Constant name="cloud" /> Team или Enterprise. Эти первоклассные интеграции позволяют выполнять запросы и получать ценные инсайты из вашей экосистемы данных.

- **Улучшение:** В рамках постоянной работы над улучшением [IDE](/docs/cloud/studio-ide/develop-in-studio#considerations), файловая система получила оптимизации для ускорения разработки в dbt, включая введение лимита репозитория <Constant name="git" /> в 10GB.

#### Также доступно в этом месяце:

- **Обновление:** [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation) теперь доступен для Azure single-tenant и доступен во всех [регионах развертывания](/docs/cloud/about-cloud/access-regions-ip-addresses) как для multi-tenant, так и для single-tenant аккаунтов.

- **Новое:** [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) представляет [declarative caching](/docs/use-dbt-semantic-layer/sl-cache), позволяя кэшировать часто используемые запросы для повышения производительности и снижения вычислительных затрат. Доступно для аккаунтов <Constant name="cloud" /> Team или Enterprise.

- <Expandable alt_header="New: Latest Release Track" > 

  Release Track **Latest** теперь доступен в статусе GA (ранее — Public Preview).

  На этом релизном треке вы получаете автоматические обновления dbt, включая ранний доступ к новым функциям, исправлениям и улучшениям производительности для вашего dbt-проекта. dbt Labs выполняет обновления «за кулисами» в рамках тестирования и повторного деплоя приложения dbt Cloud — так же, как и другие возможности dbt Cloud и SaaS-инструменты, которыми вы пользуетесь. Больше никаких ручных обновлений и никакой необходимости в _отдельном sandbox-проекте_ только для тестирования новых функций.

  Подробнее см. [Release Tracks](/docs/dbt-versions/cloud-release-tracks).

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-environment-settings.png" width="90%" title="Example of the Latest setting"/>

  </Expandable>

- **Изменение поведения:** Введен флаг `require_resource_names_without_spaces`, опциональный и отключенный по умолчанию. Если установлен в `True`, dbt выбросит исключение, если обнаружит имя ресурса с пробелом в проекте или установленном пакете. В будущей версии dbt это поведение станет стандартным. Подробнее см. [No spaces in resource names](/reference/global-configs/behavior-changes#no-spaces-in-resource-names).

## Апрель 2024

- <Expandable alt_header="New: Merge jobs" lifecycle="beta" > 

  Теперь вы можете нативно настраивать workflow непрерывного деплоя (CD) для своих проектов в dbt Cloud. Доступен beta-релиз [Merge jobs](/docs/deploy/merge-jobs) — нового [типа заданий](/docs/deploy/jobs), который позволяет запускать dbt-задания сразу после слияния изменений (через Git pull requests) в production.

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-create-merge-job.png" width="90%" title="Example of creating a merge job"/>

  </Expandable>
  
- **Изменение поведения:** Введен флаг `require_explicit_package_overrides_for_builtin_materializations`, опциональный и отключенный по умолчанию. Если установлен в `True`, dbt будет использовать только встроенные materializations, определенные в корневом проекте или в самом dbt, а не реализации из пакетов. Это станет поведением по умолчанию в мае 2024 года (dbt Core v1.8 и release tracks dbt Cloud). Подробнее см. [Package override for built-in materialization](/reference/global-configs/behavior-changes#package-override-for-built-in-materialization).

**<Constant name="semantic_layer" />**
- **Новое:** Используйте Saved selections для [сохранения выборок запросов](/docs/cloud-integrations/semantic-layer/gsheets#using-saved-selections) в приложении [Google Sheets](/docs/cloud-integrations/semantic-layer/gsheets). Они могут быть приватными или публичными и обновляются при загрузке.
- **Новое:** Метрики теперь отображаются по своим labels как `metric_name`.
- **Улучшение:** [Metrics](/docs/build/metrics-overview) теперь поддерживают опцию [`meta`](/reference/resource-configs/meta) в свойстве [config](/reference/resource-properties/config). Ранее поддерживался только теперь уже deprecated тег `meta`.
- **Улучшение:** В приложении Google Sheets добавлена [поддержка](/docs/cloud-integrations/semantic-layer/gsheets#using-saved-queries) перехода и исследования сохраненных запросов, определенных в MetricFlow.
- **Улучшение:** В приложении Google Sheets добавлена поддержка запросов измерений без метрик. Ранее требовалось наличие метрики.
- **Улучшение:** В приложении Google Sheets добавлена поддержка временных пресетов и сложных фильтров временных диапазонов, таких как «between», «after» и «before».
- **Улучшение:** В приложении Google Sheets добавлена поддержка автоматического заполнения значений измерений при выборе фильтра «where», что избавляет от необходимости вводить их вручную.
- **Улучшение:** В приложении Google Sheets добавлена поддержка прямых запросов к entities, расширяя гибкость запросов данных.
- **Улучшение:** В приложении Google Sheets добавлена опция исключения заголовков колонок, что полезно для заполнения шаблонов только необходимыми данными.
- **Устаревание:** Для интеграции с Tableau источник данных [`METRICS_AND_DIMENSIONS`](/docs/cloud-integrations/semantic-layer/tableau#using-the-integration) был объявлен устаревшим для всех аккаунтов, которые активно его не используют. Рекомендуется перейти на источник данных «ALL» для будущих интеграций.

## Март 2024

- **Новое:** Сервисы <Constant name="semantic_layer" /> теперь поддерживают использование Privatelink для клиентов, у которых он включен.
- **Новое:** Теперь вы можете разрабатывать и тестировать <Constant name="semantic_layer" /> в dbt CLI, если ваши developer credentials используют SSO.
- **Улучшение:** Теперь можно выбирать entities для Group By, Filter By и Order By.
- **Исправление:** `dbt parse` больше не показывает ошибку при использовании списка фильтров (вместо строкового фильтра) для метрики.
- **Исправление:** `join_to_timespine` теперь корректно применяется к входным мерам conversion-метрик.
- **Исправление:** Исправлена проблема, при которой экспорты в Redshift не всегда коммитились в DWH, что также приводило к оставшимся блокировкам таблиц.
- **Изменение поведения:** Введен флаг `source_freshness_run_project_hooks`, опциональный и отключенный по умолчанию. Если установлен в `True`, dbt будет включать project hooks `on-run-*` в команду `source freshness`. В будущей версии dbt это станет поведением по умолчанию. Подробнее см. [Project hooks with source freshness](/reference/global-configs/behavior-changes#project-hooks-with-source-freshness).

## Февраль 2024

- **Новое:** [Exports](/docs/use-dbt-semantic-layer/exports#define-exports) позволяют материализовать сохраненный запрос в виде таблицы или представления в вашей data platform. Используя exports, вы можете унифицировать определения метрик в платформе данных и запрашивать их как любые другие таблицы или представления.
- **Новое:** Теперь вы можете получить список своих [exports](/docs/use-dbt-semantic-layer/exports) с помощью новой команды list saved-queries, добавив `--show-exports`.
- **Новое:** <Constant name="semantic_layer" /> и [Tableau Connector](/docs/cloud-integrations/semantic-layer/tableau) теперь поддерживают относительные фильтры дат в Tableau.

- <Expandable alt_header="New: Use exports to write saved queries">

  Теперь вы можете использовать функцию [exports](/docs/use-dbt-semantic-layer/exports) вместе с [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), что позволяет выполнять запросы к надежным метрикам и обеспечивать быструю отчетность. Exports расширяют возможности saved queries, позволяя записывать часто используемые запросы напрямую в вашу data platform с помощью планировщика заданий dbt Cloud.

  Предоставляя таблицы метрик и измерений, exports позволяют интегрироваться с дополнительными инструментами, которые нативно не подключаются к dbt Semantic Layer, например PowerBI.

  Exports доступны для dbt Cloud multi-tenant планов [Team или Enterprise](https://www.getdbt.com/pricing/) на версиях dbt 1.7 или новее. Подробнее см. [exports blog](https://www.getdbt.com/blog/announcing-exports-for-the-dbt-semantic-layer).

  <Lightbox src="/img/docs/dbt-cloud/semantic-layer/deploy_exports.png" width="90%" title="Add an environment variable to run exports in your production run." />

  </Expandable>

- <Expandable alt_header="New: Trigger on job completion " lifecycle="team,enterprise" >

  Для планов dbt Cloud Team и Enterprise теперь доступна возможность запускать deploy jobs после завершения других deploy jobs. Вы можете включить эту функцию [в UI](/docs/deploy/deploy-jobs) с помощью опции **Run when another job finishes** в разделе **Triggers** вашего задания или через [Create Job API endpoint](/dbt-cloud/api-v2#/operations/Create%20Job).

  После включения задание будет запускаться после завершения указанного upstream-задания. Вы можете настроить, какие статусы выполнения будут триггерить запуск — только `Success` или все статусы. Если между вашими dbt-проектами есть зависимости, это позволяет _нативно_ оркестрировать задания внутри dbt Cloud — без необходимости настраивать сторонние инструменты.

  Пример раздела **Triggers** при создании задания:

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-triggers-section.png" width="90%" title="Пример Triggers на странице Deploy Job"/>

  </Expandable>

- <Expandable alt_header="Новое: трек релизов Latest" lifecycle="beta">

  _Теперь доступно в выпадающем списке версий dbt в dbt Cloud — начиная с отдельных клиентов и с постепенным расширением доступности в феврале и марте._

  На этом релизном треке вы получаете автоматические обновления dbt, включая ранний доступ к новым функциям, исправлениям и улучшениям производительности для вашего dbt-проекта. dbt Labs выполняет обновления «за кулисами» в рамках тестирования и повторного деплоя приложения dbt Cloud — так же, как и другие возможности dbt Cloud и используемые вами SaaS-инструменты. Больше никаких ручных обновлений и никакой необходимости в _отдельном sandbox-проекте_ для тестирования новых функций.

  Подробнее см. [Release Tracks](/docs/dbt-versions/cloud-release-tracks).

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-environment-settings.png" width="90%" title="Example of the Latest setting"/>

  </Expandable>

- <Expandable alt_header="New: Override dbt version with new User development settings" >

  Теперь вы можете [переопределить версию dbt](/docs/dbt-versions/upgrade-dbt-version-in-cloud#override-dbt-version), настроенную для development-окружения проекта, и использовать другую версию — влияя только на ваш пользовательский аккаунт. Это позволяет тестировать новые возможности dbt, не затрагивая других участников проекта. После успешного тестирования вы можете безопасно обновить версию dbt для проекта(ов).

  Используйте выпадающий список **dbt version**, чтобы указать версию для переопределения. Он доступен на странице credentials проекта в разделе **User development settings**. Например:

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-override-version.png" width="60%" title="Example of overriding the dbt version on your user account"/>

  </Expandable>

- <Expandable alt_header="Enhancement: Edit in primary git branch in IDE">

  Теперь вы можете редактировать, форматировать или выполнять линтинг файлов и запускать dbt-команды прямо в основной git-ветке в [dbt Cloud IDE](/docs/cloud/studio-ide/develop-in-studio). Это улучшение доступно для различных типов репозиториев, включая нативные интеграции, импортированные git URL и managed repos.

  В настоящее время улучшение доступно во всех multi-tenant регионах dbt Cloud и вскоре станет доступно для single-tenant аккаунтов.

  Ранее основная ветка подключенного git-репозитория была _только для чтения_ в IDE. Это обновление переводит ветку в состояние _protected_ и разрешает прямое редактирование. При создании коммита dbt Cloud предложит создать новую ветку. Имя новой ветки будет автоматически заполнено как GIT_USERNAME-patch-#, однако вы можете изменить его на собственное.

  Ранее основная ветка отображалась как read-only, теперь же она помечена иконкой замка, обозначающей protected-статус:

  <DocCarousel slidesPerView={1}>

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/read-only.png" width="75%" title="Прежний опыт read-only"/>

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/protected.png" width="75%" title="Новый опыт protected"/>

  </DocCarousel>

  Когда вы создаете коммит, находясь в основной ветке, открывается модальное окно с предложением создать новую ветку и ввести сообщение коммита:

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/create-new-branch.png" width="75%" title="Create new branch window"/>

  </Expandable>

- **Улучшение:** Интеграция <Constant name="semantic_layer" /> с [Google Sheets](/docs/cloud-integrations/semantic-layer/gsheets) теперь добавляет заметку в ячейке, из которой был запрошен набор данных, делая запросы более понятными. Также появилась новая опция **Time Range**, позволяющая быстро выбирать диапазоны дат.
- **Улучшение:** В [GraphQL API](/docs/dbt-cloud-apis/sl-graphql) добавлен параметр `requiresMetricTime` для лучшей обработки метрик, которые должны группироваться по времени (некоторые метрики MetricFlow нельзя анализировать без временного измерения).
- **Улучшение:** Включена возможность запрашивать метрики со смещением (offset) и накопительные метрики с использованием имени временного измерения вместо `metric_time`. [Issue #1000](https://github.com/dbt-labs/metricflow/issues/1000)
  - Также включена возможность запрашивать `metric_time` без метрик. [Issue #928](https://github.com/dbt-labs/metricflow/issues/928)
- **Улучшение:** Добавлена поддержка согласованной генерации SQL-запросов, обеспечивающей一致ность ID между идентичными MF-запросами. Ранее SQL, генерируемый `MetricFlowEngine`, мог отличаться для одинаковых запросов. [Issue 1020](https://github.com/dbt-labs/metricflow/issues/1020)
- **Исправление:** Tableau Connector теперь возвращает фильтр по дате при фильтрации по датам. Ранее ошибочно возвращался фильтр по timestamp.
- **Исправление:** MetricFlow теперь валидирует наличие `metrics`, `group by` или `saved_query` в каждом запросе. Ранее валидация отсутствовала. [Issue 1002](https://github.com/dbt-labs/metricflow/issues/1002)
- **Исправление:** Меры с `join_to_timespine` в MetricFlow теперь корректно применяют фильтры после join с time spine.
- **Исправление:** Исправлены проблемы при запросе нескольких гранулярностей с offset-метриками:
  - Если запрашивается offset-метрика с несколькими экземплярами `metric_time`/`agg_time_dimension`, смещение применялось только к одному из них — теперь ко всем.
  - Если запрашивается offset-метрика с одним экземпляром `metric_time`/`agg_time_dimension`, но фильтрация идет по другому, запрос ранее падал.
- **Исправление:** MetricFlow теперь отдает приоритет candidate join type над типом по умолчанию при вычислении join-узлов. Например, тип join по умолчанию для запросов distinct values — `FULL OUTER JOIN`, однако для join с time spine требуется `CROSS JOIN`, который является более подходящим.
- **Исправление:** Исправлена ошибка, которая ранее вызывала сбои при использовании entities в фильтрах `where`.

## Январь 2024

- <Expandable alt_header="Обновления документации за январь">

  Привет от команды dbt Docs: @mirnawong1, @matthewshaver, @nghi-ly и @runleonarun! Прежде всего, мы хотим поблагодарить 10 новых участников сообщества, которые внесли вклад в docs.getdbt.com :pray: Какое же насыщенное начало года! В январе мы объединили 110 PR.

  Вот как мы улучшили работу с [docs.getdbt.com](http://docs.getdbt.com/):

  - Добавили новое поведение при наведении курсора на изображения
  - Добавили новые раскрывающиеся блоки (expandables) для FAQ
  - Убрали устаревшие уведомления и сниппеты в рамках обслуживания сайта документации

  В январе также появилось много нового контента:

  - Новая страница [dbt Mesh FAQs](/best-practices/how-we-mesh/mesh-5-faqs)
  - Бета-запуск функции [построчного lineage на уровне колонок в Explorer](/docs/explore/column-level-lineage)
  - Публикации в блоге для разработчиков:
    - [Больше времени на код, меньше на ожидание: как эффективно использовать defer в dbt](/blog/defer-to-prod)
    - [Прекращение поддержки dbt Server](/blog/deprecation-of-dbt-server)
    - От сообщества: [Serverless data stack с бесплатным уровнем на базе dlt + dbt core](/blog/serverless-dlt-dbt-stack)
  - Команда Extrica добавила документацию для [community-адаптера dbt-extrica](/docs/core/connect-data-platform/extrica-setup)
  - Semantic Layer: новая документация по [conversion metrics](/docs/build/conversion) и добавление параметра `fill_nulls_with` для всех типов метрик (запуск на неделе 12 января 2024)
  - Новая команда [dbt environment](/reference/commands/dbt-environment) и её флаги для dbt CLI

  В январе также была обновлена часть существующего контента — в соответствии с новыми возможностями продукта или по запросам сообщества:

  - Нативная поддержка [partial parsing в dbt Cloud](/docs/cloud/account-settings#partial-parsing)
  - Обновлённые рекомендации по использованию точек и подчёркиваний в [гайде по лучшим практикам для моделей](/best-practices/how-we-style/1-how-we-style-our-dbt-models)
  - Обновлённая документация по [PrivateLink для VCS](/docs/cloud/secure/vcs-privatelink)
  - Добавлена новая роль `job_runner` в [документацию по ролям и правам доступа Enterprise-проектов](/docs/cloud/manage-access/enterprise-permissions#project-role-permissions)
  - Добавлены сохранённые запросы в [команды Metricflow](/docs/build/metricflow-commands#list-saved-queries)
  - Удалена документация по [as_text](https://github.com/dbt-labs/docs.getdbt.com/pull/4726), которая была сильно устаревшей

  </Expandable>

- **Новое:** Новый тип метрик, который позволяет измерять события конверсии. Например, пользователей, которые просмотрели веб‑страницу, а затем заполнили форму. Подробнее см. [Conversion metrics](/docs/build/conversion).  
- **Новое:** Вместо указания полностью квалифицированного имени измерения (например, `order__user__country`) в выражениях group by или filter теперь достаточно указывать основную сущность и имя измерения, например `user__county`.  
- **Новое:** Теперь вы можете выполнять запросы к [сохранённым запросам](/docs/build/saved-queries), которые вы определили в <Constant name="semantic_layer" />, используя [Tableau](/docs/cloud-integrations/semantic-layer/tableau), [GraphQL API](/docs/dbt-cloud-apis/sl-graphql), [JDBC API](/docs/dbt-cloud-apis/sl-jdbc) и [CLI <Constant name="cloud" />](/docs/cloud/cloud-cli-installation).  

- <Expandable alt_header="Новое: нативная поддержка partial parsing" >

  По умолчанию dbt парсит все файлы в проекте в начале каждого запуска dbt. В зависимости от размера проекта эта операция может занимать значительное время. Благодаря новой функции partial parsing в dbt Cloud вы можете сократить время, необходимое для парсинга проекта. При включении этой функции dbt Cloud парсит только изменённые файлы, а не все файлы проекта. В результате выполнение команд dbt занимает меньше времени.

  Подробнее см. [Partial parsing](/docs/cloud/account-settings#partial-parsing).

  <Lightbox src="/img/docs/deploy/account-settings-partial-parsing.png" width="85%" title="Пример опции Partial parsing" />

  </Expandable>

- **Улучшение:** Параметр спецификации YAML `label` теперь доступен для метрик Semantic Layer в [JDBC и GraphQL API](/docs/dbt-cloud-apis/sl-api-overview). Это означает, что вы можете удобно использовать `label` в качестве отображаемого имени метрики при её публикации.
- **Улучшение:** Добавлена поддержка `create_metric: true` для measure — это сокращённый способ быстрого создания метрик. Полезно в случаях, когда метрики используются только для построения других метрик.
- **Улучшение:** Добавлена поддержка параметрических фильтров Tableau. Вы можете использовать [коннектор Tableau](/docs/cloud-integrations/semantic-layer/tableau) для создания и использования параметров с данными <Constant name="semantic_layer" />.
- **Улучшение:** Добавлена поддержка экспонирования `expr` и `agg` для [Measures](/docs/build/measures) в [GraphQL API](/docs/dbt-cloud-apis/sl-graphql).
- **Улучшение:** Улучшены сообщения об ошибках в интерфейсе командной строки при выполнении запросов к измерению, которое недоступно для заданной метрики.
- **Улучшение:** Теперь можно выполнять запросы к сущностям через интеграцию с Tableau (аналогично запросам к измерениям).
- **Улучшение:** В интеграции с Tableau появился новый источник данных с названием «ALL», который содержит все определённые семантические объекты. Он содержит ту же информацию, что и «METRICS_AND_DIMENSIONS». В будущем «METRICS_AND_DIMENSIONS» будет признан устаревшим в пользу «ALL» для большей ясности.

- **Исправление:** Теперь доступна поддержка числовых типов с точностью больше 38 (например, `BIGDECIMAL`) в BigQuery. Ранее такие типы не поддерживались и приводили к ошибке.
- **Исправление:** В некоторых случаях большие числовые измерения интерпретировались Tableau в научной нотации, из‑за чего их было сложно использовать. Теперь они должны отображаться как обычные числа.
- **Исправление:** Теперь значения измерений сохраняются корректно и больше не преобразуются непреднамеренно в строки.
- **Исправление:** Устранены проблемы с конфликтами имён в запросах, использующих несколько производных метрик с одинаковыми входными метриками. Ранее это могло вызывать конфликт имён. Теперь входные метрики дедуплицируются и каждая используется только один раз.
- **Исправление:** Устранены предупреждения, связанные с использованием двух одинаковых входных measure в производной метрике. Ранее это вызывало предупреждение. Теперь входные measure дедуплицируются, что улучшает обработку запросов и их читаемость.
- **Исправление:** Исправлена ошибка, при которой ссылка на сущность в фильтре с использованием объектного синтаксиса не работала. Например, `{{Entity('entity_name')}}` не могло быть корректно разрешено.
