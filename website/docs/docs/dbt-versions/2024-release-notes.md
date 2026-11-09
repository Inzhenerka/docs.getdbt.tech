---
title: "Примечания к выпускам платформы dbt за 2024 год"
description: "Примечания к выпускам платформы dbt за 2024 год"
id: "2024-release-notes"
sidebar_label: "Примечания к выпускам за 2024 год"
pagination_next: null
pagination_prev: null
availability:
  surface: platform
  access: free
---

Примечания к выпускам <Constant name="dbt" /> с описанием недавних и более ранних изменений. Примечания к выпускам относятся к одной из следующих категорий:

- **New:** Новые продукты и возможности
- **Enhancement:** Улучшения производительности и расширения функциональности
- **Fix:** Исправления ошибок и уязвимостей безопасности
- **Behavior change:** Изменения существующего поведения, которые не подпадают под другие категории, например, устаревание функций или изменения значений по умолчанию

Примечания к релизам сгруппированы по месяцам как для многоарендных (multi-tenant), так и для сред с виртуальным частным облаком (VPC)\*

\* Официальная дата выпуска этого нового формата примечаний к релизам — 15 мая 2024 года. Исторические примечания к релизам за более ранние даты могут не отражать все функции, выпущенные ранее в этом году, или их доступность в зависимости от типа развертывания.

## Декабрь 2024 {#december-2024}

- **New**: Сохранённые запросы теперь поддерживают [tags](/reference/resource-configs/tags), которые позволяют категоризировать ресурсы и фильтровать их. Добавляйте теги к вашим [saved queries](/docs/build/saved-queries) в файле `semantic_model.yml` или `dbt_project.yml`. Например:
  <File name='dbt_project.yml'>

  ```yml
  [saved-queries](/docs/build/saved-queries):
    jaffle_shop:
      customer_order_metrics:
        +tags: order_metrics
  ```
  </File>
- **Новое**: [Измерения](/reference/resource-configs/meta) теперь поддерживают свойство конфигурации `meta` в [канале выпусков dbt Cloud **Latest**](/docs/dbt-versions/dbt-release-tracks) и начиная с dbt Core 1.9. Вы можете добавлять метаданные к измерениям, чтобы предоставлять дополнительный контекст и информацию об измерении. Подробнее см. в разделе [meta](/reference/resource-configs/meta).
- **Новое**: [Зависимые экспозиции](/docs/platform-integrations/downstream-exposures-tableau) теперь общедоступны в тарифных планах <Constant name="dbt" /> Enterprise. Зависимые экспозиции напрямую интегрируются с Tableau (поддержка Power BI появится в ближайшее время) и автоматически формируют граф зависимостей нижестоящих ресурсов в dbt Explorer, расширяя его возможности.
- **Новое**: <Constant name="semantic_layer" /> поддерживает Sigma в качестве [партнёрской интеграции](/docs/platform-integrations/avail-sl-integrations), доступной в предварительной версии. Подробнее см. в документации [Sigma](https://help.sigmacomputing.com/docs/configure-a-dbt-semantic-layer-integration).
- **Новое**: <Constant name="semantic_layer" /> теперь поддерживает одноарендаторные развёртывания в Azure. Подробнее о начале работы см. в разделе [Настройка <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- **Исправление**: Устранены периодически возникавшие проблемы в одноарендаторных средах, затрагивавшие <Constant name="semantic_layer" /> и историю запросов.
- **Исправление**: [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) теперь учитывает [атрибут `execution_project`](/docs/local/connect-data-platform/bigquery-setup?version=1.12#quota-project) в BigQuery, в том числе при экспорте.
- **Новое**: [Уведомления о моделях](/docs/deploy/model-notifications) теперь общедоступны в <Constant name="dbt" />. Эти уведомления оповещают владельцев моделей по электронной почте о любых проблемах с моделями и тестами сразу после их возникновения во время выполнения задания.
- **Новое**: Теперь вы можете использовать свой [ключ Azure OpenAI](/docs/dbt-ai/wizard-byok#set-your-api-key) (доступно в бета-версии) для работы с такими функциями <Constant name="dbt" />, как [<Constant name="copilot" />](/docs/platform/wizard-platform). Кроме того, вы можете использовать собственный [ключ OpenAI API](/docs/dbt-ai/wizard-byok#set-your-api-key) или [ключ OpenAI под управлением dbt Labs](/docs/platform/billing/dbt-ai-usage). Подробнее см. в разделе [Интеграции с ИИ](/docs/platform/wizard-platform#supported-ai-providers).
- **Новое**: Параметр конфигурации [`hard_deletes`](/reference/resource-configs/hard-deletes) предоставляет больше возможностей для управления обработкой строк, удалённых из источника. Поддерживаются значения `ignore` (по умолчанию), `invalidate` (заменяет устаревший параметр `invalidate_hard_deletes=true`) и `new_record`. Обратите внимание: при использовании `new_record` в таблице снимка будет создан новый столбец метаданных.

## Ноябрь 2024 {#november-2024}

- **Улучшение**: Индикаторы состояния данных в dbt Explorer теперь доступны для экспозиций и позволяют быстро оценить состояние данных при просмотре ресурсов. Чтобы увидеть значки доверия к данным, перейдите в dbt Explorer и нажмите **Exposures** на вкладке **Resource**. Подробнее см. в разделе [Индикаторы состояния данных для ресурсов](/docs/explore/data-health-signals).
- **Ошибка**: Выявлена и исправлена ошибка в запросах <Constant name="semantic_layer" />, выполнение которых занимает более 10 минут.
- **Исправление**: При экспорте теперь учитываются переопределения переменных окружения задания, заданные в учётных данных. Ранее они игнорировались.
- **Изменение поведения**: Если вы используете пользовательский макрос микропакетной обработки, установите [флаг поведения `require_batched_execution_for_custom_microbatch_strategy`](/reference/global-configs/behavior-flags/require_batched_execution_for_custom_microbatch_strategy) в файле `dbt_project.yml`, чтобы включить пакетное выполнение. Если у вас нет пользовательского макроса микропакетной обработки, устанавливать этот флаг не нужно: dbt автоматически выполняет микропакетную обработку для любой модели, использующей [стратегию microbatch](/docs/build/incremental-microbatch#how-microbatch-compares-to-other-incremental-strategies).
- **Улучшение**: Пользователи, у которых включена функция [сравнения изменений](/docs/deploy/advanced-ci#compare-changes) в Advanced CI, могут повысить производительность сравнений с помощью пользовательского синтаксиса dbt: настроить использование отложенного разрешения ссылок (deferral), исключить определённые крупные модели (или группы моделей с тегами) и многое другое. Примеры настройки команды сравнения см. в разделе [Пользовательские команды сравнения изменений](/docs/deploy/job-commands#compare-changes-custom-commands).
- **Новое**: Проверка SQL в заданиях CI теперь общедоступна в <Constant name="dbt" />. Вы можете включить проверку SQL в своих заданиях CI с помощью [SQLFluff](https://sqlfluff.com/), чтобы автоматически проверять все SQL-файлы проекта на отдельном шаге выполнения перед сборкой в задании CI. Проверка с помощью SQLFluff доступна в [каналах обновлений <Constant name="dbt" />](/docs/dbt-versions/dbt-release-tracks) для учётных записей <Constant name="dbt" /> с тарифом [Team или Enterprise](https://www.getdbt.com/pricing/). Подробнее см. в разделе [Проверка SQL](/docs/deploy/continuous-integration#sql-linting).
- **Новое**: Используйте настройку [`dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current), чтобы задать собственное значение `dbt_valid_to` для актуальных записей снимка (например, дату в будущем). По умолчанию это значение равно `NULL`. Если настройка задана, dbt будет использовать указанное значение вместо `NULL` для `dbt_valid_to` в актуальных записях таблицы снимка. Эта функция доступна в [канале обновлений dbt Cloud **Latest**](/docs/dbt-versions/dbt-release-tracks) (ранее называвшемся  `Versionless`) и в dbt Core версии 1.9 и выше.
- **Новое**: Используйте настройку [`event_time`](/reference/resource-configs/event-time), чтобы указать, «в какой момент времени произошло событие, представленное строкой». Эта настройка обязательна для [инкрементальной микропакетной обработки](/docs/build/incremental-microbatch); её также можно добавить, чтобы обеспечить сравнение пересекающихся временных интервалов при [сравнении изменений в Advanced CI](/docs/deploy/advanced-ci). Доступна в [канале обновлений dbt Cloud **Latest**](/docs/dbt-versions/dbt-release-tracks) (ранее называвшемся `Versionless`) и в dbt Core версии 1.9 и выше.
- **Исправление**: Это обновление улучшает [интеграцию <Constant name="semantic_layer" /> с Tableau](/docs/platform-integrations/semantic-layer/tableau), повышая надёжность разбора запросов. Основные исправления:
  - Сообщения об ошибках для неподдерживаемых соединений между сохранёнными запросами и таблицами ALL.
  - Улучшена обработка запросов при выборе нескольких таблиц в источнике данных.
  - Исправлена ошибка, возникавшая, когда фильтр IN содержал большое количество значений.
  - Улучшены сообщения об ошибках для запросов, которые невозможно корректно разобрать.
- **Улучшение**: <Constant name="semantic_layer" /> поддерживает создание новых учётных данных для пользователей, у которых нет разрешения на создание сервисных токенов.  На боковой панели **Credentials & service tokens** опция **+Add Service Token** недоступна пользователям без соответствующего разрешения. Вместо неё на боковой панели отображается сообщение о том, что у пользователя нет разрешения на создание сервисного токена и ему следует обратиться к администратору. Подробнее см. в разделе [Настройка <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).

## Октябрь 2024 {#october-2024}

<Expandable alt_header="Анонсы Coalesce 2024">

  Документация по новым функциям и возможностям, анонсированным на Coalesce 2024:

Документация по новым возможностям и функциям, анонсированным на Coalesce 2024:

  - Поддержка таблиц Iceberg для [Snowflake](/reference/resource-configs/snowflake-configs#iceberg-table-format)
  - Поддержка адаптеров [Athena](/reference/resource-configs/athena-configs) и [Teradata](/reference/resource-configs/teradata-configs) в dbt Cloud
  - dbt Cloud теперь размещается и в [Azure](/docs/platform/about-platform/access-regions-ip-addresses)
  - Познакомьтесь с [каналами выпусков dbt Cloud](/docs/dbt-versions/dbt-release-tracks), которые автоматически поддерживают ваш проект в актуальном состоянии — с периодичностью, подходящей вашей команде
  - Масштабируемые [инкрементальные модели с микропакетной обработкой](/docs/build/incremental-microbatch)
  - Расширенные [возможности CI](/docs/deploy/advanced-ci)
  - [Линтинг в заданиях CI](/docs/deploy/continuous-integration#sql-linting)
  - dbt Assist теперь называется [dbt Copilot](/docs/platform/wizard-platform)
  - Статья в блоге для разработчиков: [Snowflake Feature Store и dbt: мост между конвейерами данных и машинным обучением](/blog/snowflake-feature-store)
  - [Нижестоящие зависимости (exposures) с Tableau](/docs/explore/view-downstream-exposures)
  - Интеграция Semantic Layer с [настольным Excel и M365](/docs/platform-integrations/semantic-layer/excel)
  - [Плитки состояния данных](/docs/explore/data-tile)
  - [Интеграция Semantic Layer и Cloud IDE](/docs/build/metricflow-commands#metricflow-commands)
  - История запросов в [Explorer](/docs/explore/model-query-history#view-from-project-lineage)
  - Улучшения MetricFlow в Semantic Layer, включая [расширенные возможности детализации и настраиваемый календарь](/docs/build/metricflow-time-spine#custom-calendar) 
  - [Python SDK](/docs/dbt-apis/sl-python) теперь общедоступен 

</Expandable>

- **Изменение поведения:** [Многофакторная аутентификация](/docs/platform/manage-access/mfa) теперь обязательна для всех пользователей, которые входят в систему с именем пользователя и паролем. 
- **Улучшение**: JDBC-драйвер dbt Semantic Layer теперь позволяет использовать постраничную выдачу результатов `semantic_layer.metrics()` и `semantic_layer.dimensions()` для метрик и измерений с помощью параметров `page_size` и `page_number`. Подробнее см. в разделе [Постраничная выдача при вызовах для получения метаданных](/docs/dbt-apis/sl-jdbc#querying-the-api-for-metric-metadata).
- **Улучшение**: JDBC-драйвер dbt Semantic Layer теперь позволяет фильтровать метрики, оставляя только те, которые содержат определённую подстроку, с помощью параметра `search`. Если подстрока не указана, запрос возвращает все метрики. Подробнее см. в разделе [Получение метрик с помощью поиска по подстроке](/docs/dbt-apis/sl-jdbc#querying-the-api-for-metric-metadata).
- **Исправление**: [Интеграция <Constant name="semantic_layer" /> с Excel](/docs/platform-integrations/semantic-layer/excel) теперь корректно отображает ошибки при сбое выполнения запроса. Ранее причина, по которой запрос не выполнялся, оставалась неясной.
- **Исправление:** Ранее POST-запросы к Jobs API с недопустимыми строками `cron` возвращали код состояния HTTP 500, но при этом обновляли соответствующую сущность. Теперь POST-запросы к Jobs API с недопустимыми строками `cron` возвращают код состояния 400 без обновления соответствующей сущности.
- **Исправление:** Исправлена проблема, из-за которой страница просмотра `Source` в dbt Explorer некорректно отображала статус свежести источника, если данные о свежести были старше 30 дней.
- **Исправление:** Интерфейс теперь указывает, когда описание модели унаследовано из комментария в каталоге.
- **Изменение поведения:** Пользовательские API-токены объявлены устаревшими. Если вы всё ещё используете их, перейдите на [персональные токены доступа](/docs/dbt-apis/user-tokens).
- **Новое**: Cloud IDE поддерживает подписанные коммиты <Constant name="git" /> в тарифных планах Enterprise. Вы можете подписывать коммиты <Constant name="git" /> при отправке в репозиторий, чтобы предотвратить подмену авторства и повысить безопасность. Поддерживаемые провайдеры <Constant name="git" /> — GitHub и GitLab. Подробнее см. в разделе [Подписание коммитов <Constant name="git" />](/docs/platform/studio-ide/git-commit-signing.md).
- **Новое:** С <Constant name="mesh" /> теперь можно включать двунаправленные зависимости между проектами. Ранее dbt допускал зависимости только в одном направлении. dbt проверяет наличие циклов между проектами и выдаёт ошибки при их обнаружении. Подробнее см. в разделе [Обнаружение циклов](/docs/mesh/govern/project-dependencies#cycle-detection). Также доступно руководство [Введение в <Constant name="mesh" />](/best-practices/how-we-mesh/mesh-1-intro), которое поможет вам узнать больше о рекомендуемых подходах. 
- **Новое**: [Комплект средств разработки на Python для <Constant name="semantic_layer" />](/docs/dbt-apis/sl-python) теперь [общедоступен](/docs/dbt-versions/product-lifecycles). Он предоставляет пользователям удобный доступ к <Constant name="semantic_layer" /> из Python и позволяет разработчикам взаимодействовать с API <Constant name="semantic_layer" /> для запроса метрик и измерений в нижестоящих инструментах.
- **Улучшение**: Теперь можно добавлять описание к отдельному тесту данных (singular data test). Используйте [свойство `description`](/reference/resource-properties/description) для документирования [отдельных тестов данных](/docs/build/data-tests#singular-data-tests). Для хранения описания теста также можно использовать [блок docs](/docs/build/documentation#using-docs-blocks). Улучшение уже доступно в [канале выпусков **Latest** в dbt Cloud](/docs/dbt-versions/dbt-release-tracks) и будет включено в dbt Core v1.9.
- **Новое**: Представляем [стратегию микропакетной обработки для инкрементальных моделей](/docs/build/incremental-microbatch) (бета-версия), которая уже доступна в [dbt Cloud Latest](/docs/dbt-versions/dbt-release-tracks) и вскоре будет поддерживаться в dbt Core v1.9. Эта стратегия позволяет эффективно обрабатывать большие наборы данных временных рядов пакетами, повышая производительность и устойчивость к сбоям, особенно при работе с данными, которые меняются со временем (например, когда новые записи добавляются ежедневно). Чтобы включить эту возможность в dbt Cloud, задайте переменной окружения `DBT_EXPERIMENTAL_MICROBATCH` значение `true` в своём проекте.
- **Новое**: dbt Semantic Layer поддерживает конфигурации настраиваемого календаря в MetricFlow; эта возможность доступна в статусе [Preview](/docs/dbt-versions/product-lifecycles). Конфигурации настраиваемого календаря позволяют запрашивать данные с использованием нестандартных временных периодов, таких как `fiscal_year` или `retail_month`. О том, как определить эти пользовательские уровни временной детализации в YAML-конфигурации временной шкалы MetricFlow, см. в разделе [Настраиваемый календарь](/docs/build/metricflow-time-spine#custom-calendar).
- **Новое**: В канале выпусков **Latest** в <Constant name="dbt" /> [снимки](/docs/build/snapshots) обновлены: теперь они используют файлы конфигурации YAML вместо SQL-блоков снимков. Эта новая возможность упрощает управление снимками и повышает производительность; вскоре она также появится в <Constant name="core" /> версии 1.9.
  - Кого это затрагивает? Пользователи канала выпусков **Latest** в <Constant name="dbt" /> могут определять снимки с помощью новой спецификации YAML. Пользователи, переходящие на **Latest** и уже имеющие определения снимков, могут сохранить существующие конфигурации или перенести определения снимков в YAML. 
  - Пользователи более ранних версий: никаких действий не требуется; существующие снимки продолжат работать как прежде. Однако мы рекомендуем перейти на канал выпусков **Latest**, чтобы воспользоваться новыми возможностями снимков.
- **Изменение поведения:** Задайте [`state_modified_compare_more_unrendered_values`](/reference/global-configs/behavior-flags/state_modified_compare_more_unrendered_values) значение true, чтобы сократить число ложных срабатываний `state:modified`, когда конфигурации различаются между окружениями `dev` и `prod`.
- **Изменение поведения:** Задайте флагу [`skip_nodes_if_on_run_start_fails`](/reference/global-configs/behavior-flags/skip_nodes_if_on_run_start_fails) значение `True`, чтобы пропускать выполнение всех выбранных ресурсов при сбое хука `on-run-start`.
- **Улучшение**: В канале выпусков **Latest** в dbt Cloud снимки, определённые в SQL-файлах, теперь могут использовать `config`, заданный в YAML-файлах `schema.yml`. Это обновление устраняет прежнее ограничение, из-за которого свойства снимков требовалось определять исключительно в `dbt_project.yml` и/или в блоке `config()` внутри SQL-файла. Это улучшение также войдёт в dbt Core 1.9.
- **Новое**: В канале выпусков **Latest** в dbt Cloud конфигурация `snapshot_meta_column_names` позволяет настраивать имена столбцов метаданных снимков. Эта возможность позволяет организации привести автоматически создаваемые имена столбцов в соответствие со своими соглашениями и будет включена в предстоящий выпуск dbt Core 1.9.
- **Улучшение**: В канале выпусков **Latest** в dbt Cloud `primary_key` модели определяется на основе настроенных тестов данных и/или ограничений в `manifest.json`. Определённый таким образом `primary_key` отображается в dbt Explorer и используется функцией [сравнения изменений](/docs/deploy/run-visibility#compare-tab) в dbt Cloud. Это улучшение также войдёт в dbt Core 1.9. Ознакомьтесь с [порядком, в котором dbt определяет, какие столбцы могут использоваться в качестве первичного ключа модели](https://github.com/dbt-labs/dbt/blob/7940ad5c7858ff11ef100260a372f2f06a86e71f/core/dbt/contracts/graph/nodes.py#L534-L541). 
- **Новое:** В dbt Explorer теперь есть значки индикаторов доверия, доступные в статусе [Preview](/docs/dbt-versions/product-lifecycles). Индикаторы доверия позволяют быстро оценить состояние данных при просмотре моделей dbt в dbt Explorer. Эти значки показывают, находится ли модель в состоянии **Healthy** (исправна), **Caution** (требует внимания), **Degraded** (ухудшенное состояние) или **Unknown** (неизвестно). Для получения достоверных данных о состоянии убедитесь, что ресурс актуален и для него недавно выполнялось задание. Подробнее см. в разделе [Индикаторы состояния данных](/docs/explore/data-health-signals). 
- **Новое:** Нижестоящие зависимости (exposures) теперь доступны в статусе Preview в <Constant name="dbt" />. Эта возможность помогает пользователям понять, как их модели используются в нижестоящих аналитических инструментах, чтобы обоснованно распределять ресурсы и сокращать число инцидентов. Она импортирует и автоматически создаёт exposures на основе дашбордов Tableau с возможностью отбора и настройки пользователем. Подробнее см. в разделе [Нижестоящие зависимости (exposures)](/docs/platform-integrations/downstream-exposures-tableau).

## Сентябрь 2024 {#september-2024}

- **Fix**: В MetricFlow обновлён `get_and_expire`, который заменяет неподдерживаемую команду `GETEX` на `GET` с условным сроком действия, обеспечивая совместимость с Azure Redis 6.0.
- **Enhancement**: [dbt Semantic Layer Python SDK](/docs/dbt-apis/sl-python) теперь поддерживает пользовательскую гранулярность `TimeGranularity` для метрик. Это позволяет определять нестандартные временные гранулярности, такие как `fiscal_year` или `retail_month`, для выполнения запросов по нетипичным временным периодам.
- **New**: Используйте AI-движок <Constant name="copilot" /> для генерации semantic model для ваших моделей — теперь доступно в beta. <Constant name="copilot" /> автоматически создаёт документацию, тесты и теперь semantic models на основе данных вашей модели. Подробнее см. [<Constant name="copilot" />](/docs/platform/wizard-platform).
- **New**: Используйте новый рекомендуемый синтаксис для [определения ограничений `foreign_key`](/reference/resource-properties/constraints) с применением `refs`, доступный в "Latest" release track в dbt Cloud. Вскоре это будет выпущено в dbt Core v1.9. Новый синтаксис корректно фиксирует зависимости и работает в разных окружениях.
- **Enhancement**: Теперь вы можете запускать [Semantic Layer commands](/docs/build/metricflow-commands) в [dbt Cloud IDE](/docs/platform/studio-ide/develop-in-studio). Поддерживаемые команды: `dbt sl list`, `dbt sl list metrics`, `dbt sl list dimension-values`, `dbt sl list saved-queries`, `dbt sl query`, `dbt sl list dimensions`, `dbt sl list entities` и `dbt sl validate`.
- **New**: Интеграция с Microsoft Excel — интеграция <Constant name="semantic_layer" /> — теперь общедоступна (GA). Она позволяет подключаться к Microsoft Excel для запросов метрик и совместной работы с командой. Доступно для [Excel Desktop](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationId=4132ecd1-425d-982d-efb4-de94ebc83f26) и [Excel Online](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationid=4132ecd1-425d-982d-efb4-de94ebc83f26&isWac=True). Подробнее см. [Microsoft Excel](/docs/platform-integrations/semantic-layer/excel).
- **New**: [Data health tile](/docs/explore/data-tile) теперь общедоступен (GA) в dbt Explorer. Data health tiles предоставляют быстрый обзор качества данных, подсвечивая потенциальные проблемы. Вы можете встраивать эти tiles в дашборды для быстрого выявления и устранения проблем с данными в вашем dbt-проекте.
- **New**: Функция истории запросов моделей (Model query history) в dbt Explorer теперь доступна в Preview для клиентов <Constant name="cloud" /> Enterprise. Она позволяет просматривать количество запросов потребления для модели на основе логов запросов хранилища данных, помогая командам сосредоточить усилия и расходы инфраструктуры на действительно используемых data products. Подробнее см. [Model query history](/docs/explore/model-query-history).
- **Enhancement**: Теперь вы можете использовать [Extended Attributes](/docs/dbt-platform-environments#extended-attributes) и [Environment Variables](/docs/build/environment-variables) при подключении к <Constant name="semantic_layer" />. Если значение задано напрямую в учетных данных <Constant name="semantic_layer" />, оно имеет более высокий приоритет, чем Extended Attributes. При использовании environment variables будет применяться значение по умолчанию для окружения. Если вы используете exports, переопределения переменных окружения заданий пока не поддерживаются, но скоро будут.
- **New:** Добавлены два новых значения по умолчанию для [environment variable defaults](/docs/build/environment-variables#dbt-platform-context) — `DBT_CLOUD_ENVIRONMENT_NAME` и `DBT_CLOUD_ENVIRONMENT_TYPE`.
- **New:** [Подключение к хранилищу Amazon Athena](/docs/platform/connect-data-platform/connect-amazon-athena) доступно в режиме public preview для аккаунтов <Constant name="cloud" />, обновлённых до [“Latest” release track](/docs/dbt-versions/dbt-release-tracks).

- **Исправление**: В MetricFlow метод `get_and_expire` обновлён: неподдерживаемая команда `GETEX` заменена на `GET` с условной установкой срока действия, что обеспечивает совместимость с Azure Redis 6.0.
- **Улучшение**: [Python SDK для dbt Semantic Layer](/docs/dbt-apis/sl-python) теперь поддерживает пользовательскую временную детализацию `TimeGranularity` для метрик. Эта возможность позволяет определять для метрик пользовательские уровни временной детализации, например `fiscal_year` или `retail_month`, чтобы запрашивать данные за нестандартные временные периоды.
- **Новое**: Используйте ИИ-движок <Constant name="copilot" /> для создания семантических моделей на основе ваших моделей — эта возможность теперь доступна в бета-версии. <Constant name="copilot" /> автоматически создаёт документацию, тесты, а теперь и семантические модели на основе данных вашей модели. Подробнее см. в разделе [<Constant name="copilot" />](/docs/platform/wizard-platform).
- **Новое**: Используйте новый рекомендуемый синтаксис для [определения ограничений `foreign_key`](/reference/resource-properties/constraints) с помощью `refs`, доступный в канале выпусков **Latest** в dbt Cloud. Вскоре он также появится в dbt Core v1.9. Этот новый синтаксис позволяет учитывать зависимости и работает в разных средах.
- **Улучшение**: Теперь вы можете выполнять [команды Semantic Layer](/docs/build/metricflow-commands) в [dbt Cloud IDE](/docs/platform/studio-ide/develop-in-studio). Поддерживаются команды `dbt sl list`, `dbt sl list metrics`, `dbt sl list dimension-values`, `dbt sl list saved-queries`, `dbt sl query`, `dbt sl list dimensions`, `dbt sl list entities` и `dbt sl validate`. 
- **Новое**: Интеграция <Constant name="semantic_layer" /> с Microsoft Excel теперь общедоступна. Она позволяет подключаться к Microsoft Excel для запроса метрик и совместной работы с командой. Доступна для [Excel Desktop](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationId=4132ecd1-425d-982d-efb4-de94ebc83f26) и [Excel Online](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationid=4132ecd1-425d-982d-efb4-de94ebc83f26&isWac=True). Подробнее см. в разделе [Microsoft Excel](/docs/platform-integrations/semantic-layer/excel).
- **Новое**: [Плитка состояния данных](/docs/explore/data-tile) теперь общедоступна в dbt Explorer. Плитки состояния данных позволяют быстро оценить качество данных и выявить потенциальные проблемы. Вы можете встраивать эти плитки в свои дашборды, чтобы оперативно обнаруживать и устранять проблемы с качеством данных в вашем проекте dbt.
- **Новое**: Функция истории запросов к модели в dbt Explorer теперь доступна в предварительной версии для клиентов <Constant name="dbt" /> Enterprise. История запросов к модели позволяет просматривать количество запросов, использующих модель, на основе журналов запросов хранилища данных. Эта функция предоставляет командам по работе с данными информацию, которая помогает сосредоточить время и затраты на инфраструктуру на ценных и востребованных продуктах данных. Подробнее см. в разделе [История запросов к модели](/docs/explore/model-query-history). 
- **Улучшение**: Теперь при подключении к <Constant name="semantic_layer" /> можно использовать [расширенные атрибуты](/docs/dbt-platform-environments#extended-attributes) и [переменные среды](/docs/build/environment-variables). Если задать значение непосредственно в учётных данных <Constant name="semantic_layer" />, оно будет иметь более высокий приоритет, чем расширенные атрибуты. При использовании переменных среды будет применяться значение по умолчанию для этой среды. Если вы используете экспорт, переопределения переменных среды на уровне задания пока не поддерживаются, но скоро будут доступны.
- **Новое:** Добавлены два новых [значения по умолчанию для переменных среды](/docs/build/environment-variables#dbt-platform-context) &mdash; `DBT_CLOUD_ENVIRONMENT_NAME` и `DBT_CLOUD_ENVIRONMENT_TYPE`.
- **Новое:** [Подключение к хранилищу Amazon Athena](/docs/platform/connect-data-platform/connect-amazon-athena) доступно в публичной предварительной версии для аккаунтов <Constant name="dbt" />, перешедших на [канал выпусков **Latest**](/docs/dbt-versions/dbt-release-tracks).

- **Fix:** Исправлена проблема в [dbt Explorer](/docs/explore/explore-projects), при которой переход в consumer project из публичного узла приводил к отображению случайной публичной модели вместо исходного выбора.
- **New**: Теперь вы можете настраивать метрики с более мелкой временной гранулярностью, например по часам, минутам или даже секундам. Это особенно полезно для более детального анализа и для наборов данных с высокоточной временной информацией, таких как поминутное отслеживание событий. Подробнее см. [dimensions](/docs/build/dimensions).
- **Enhancement**: Microsoft Excel теперь поддерживает [saved selections](/docs/platform-integrations/semantic-layer/excel#using-saved-selections) и [saved queries](/docs/platform-integrations/semantic-layer/excel#using-saved-queries). Saved selections позволяют сохранять выбранные параметры запроса внутри приложения Excel. Приложение также по умолчанию очищает устаревшие данные в [trailing rows](/docs/platform-integrations/semantic-layer/excel#other-settings). Чтобы вернуть результаты и сохранить ранее выбранные данные, снимите флажок **Clear trailing rows**.
- **Behavior change:** GitHub больше не поддерживается для OAuth-входа в <Constant name="cloud" />. Используйте поддерживаемого [SSO или OAuth provider](/docs/platform/manage-access/sso-overview) для безопасного управления доступом к вашему аккаунту <Constant name="cloud" />.

- **Исправление:** Исправлена ошибка в [dbt Explorer](/docs/explore/explore-projects), из-за которой при переходе от публичного узла к проекту-потребителю отображалась случайная публичная модель вместо изначально выбранной. 
- **Новое**: Теперь можно настраивать метрики с более детальной временной гранулярностью: по часам, минутам и даже секундам. Это особенно полезно для более подробного анализа и наборов данных, требующих высокой точности временных данных, например для поминутного отслеживания событий. Подробнее о временной гранулярности см. в разделе [Измерения](/docs/build/dimensions).
- **Улучшение**: Microsoft Excel теперь поддерживает [сохранённые наборы выбранных параметров](/docs/platform-integrations/semantic-layer/excel#using-saved-selections) и [сохранённые запросы](/docs/platform-integrations/semantic-layer/excel#using-saved-queries). Используйте Saved selections, чтобы сохранять выбранные параметры запроса в приложении Excel. Приложение также по умолчанию очищает устаревшие данные в [строках после результатов запроса](/docs/platform-integrations/semantic-layer/excel#other-settings). Чтобы получить результаты и сохранить ранее выбранные данные без изменений, снимите флажок **Clear trailing rows**. 
- **Изменение поведения:** GitHub больше не поддерживается для входа в <Constant name="dbt" /> через OAuth. Используйте поддерживаемого [провайдера SSO или OAuth](/docs/platform/manage-access/sso-overview) для безопасного управления доступом к вашей учётной записи <Constant name="dbt" />.

## Июль 2024
- **Изменение поведения:** `target_schema` больше не является обязательным параметром конфигурации для [снимков](/docs/build/snapshots). Теперь с помощью [параметра schema](/reference/resource-configs/schema) можно задавать разные целевые схемы для снимков в средах разработки и развёртывания.
- **Новое:** [Подключения](/docs/platform/connect-data-platform/about-connections#connection-management) теперь доступны в разделе **Account settings** как глобальная настройка. Ранее они находились в разделе **Project settings**.  Это изменение будет внедряться поэтапно в течение ближайших недель.
- **Новое:** Администраторы теперь могут назначать группам [разрешения на уровне среды](/docs/platform/manage-access/environment-permissions) для определённых ролей.
- **Новое:** [Задания слияния](/docs/deploy/merge-jobs) для реализации рабочих процессов [непрерывного развёртывания (CD)](/docs/deploy/continuous-deployment) теперь общедоступны (GA) в <Constant name="dbt" />. Ранее требовалось либо настраивать собственный GitHub action, либо вручную запускать сборку изменений после каждого слияния pull request.
- **Новое**: Теперь доступна проверка SQL-файлов линтером из <Constant name="dbt" /> CLI. Подробнее см. в разделе [Проверка SQL-файлов линтером](/docs/platform/configure-dbt-cli#lint-sql-files).
- **Изменение поведения:** dbt Cloud IDE автоматически добавляет `--limit 100` к запросам предварительного просмотра, чтобы избежать медленных и дорогостоящих запросов во время разработки. Недавно в dbt Core изменился способ применения `limit`, чтобы гарантировать соблюдение условий `order by`. Из-за этого запросы, уже содержащие условие limit, теперь могут вызывать ошибки при предварительном просмотре в IDE. Чтобы решить эту проблему, dbt Labs планирует вскоре добавить возможность отключать автоматическое применение ограничения. До тех пор dbt Labs рекомендует удалять дублирующее условие limit из запросов при предварительном просмотре, чтобы избежать этих ошибок IDE.

- **Enhancement**: Представлена обновлённая страница обзора dbt Explorer, доступная в beta. Она включает новый дизайн и компоновку главной страницы dbt Explorer, а также новый раздел **Latest updates** для просмотра последних изменений или проблем, связанных с ресурсами проекта. Подробнее см. [Overview page](/docs/explore/explore-projects#catalog-overview).

#### Семантический слой dbt
- **Новое**: Представлена Python-библиотека [`dbt-sl-sdk` — комплект средств разработки (SDK)](https://github.com/dbt-labs/semantic-layer-sdk-python), которая упрощает доступ к семантическому слою dbt из Python. Она позволяет разработчикам взаимодействовать с API семантического слоя dbt и запрашивать метрики и измерения в инструментах, использующих эти данные. Подробнее см. в разделе [Python SDK для семантического слоя dbt](/docs/dbt-apis/sl-python).
- **Новое**: Представлены семантические проверки в конвейерах CI. Автоматически тестируйте семантические узлы (метрики, семантические модели и сохранённые запросы) при проверке кода, добавив в задание CI проверки с обращением к хранилищу данных с помощью команды `dbt sl validate`. Вы также можете проверять изменённые семантические узлы, чтобы убедиться, что изменения кода моделей dbt не нарушают работу этих метрик. Дополнительные команды и сценарии использования описаны в разделе [Семантические проверки в CI](/docs/deploy/ci-jobs#semantic-validations-in-ci).
- **Новое**: Поле `meta` из [свойства конфигурации](/reference/resource-configs/meta) для метрик семантического слоя dbt теперь доступно в [API JDBC и GraphQL](/docs/dbt-apis/sl-api-overview) в поле `meta`.
- **Новое**: В dbt CLI добавлена новая команда `export-all`, которая позволяет экспортировать несколько или все сохранённые запросы. Ранее требовалось явно указывать [список сохранённых запросов](/docs/build/metricflow-commands#list-saved-queries).
- **Улучшение**: <Constant name="semantic_layer" /> теперь обеспечивает более детальное управление благодаря поддержке нескольких наборов учётных данных платформы данных, которые могут соответствовать разным ролям или служебным учётным записям. В тарифных планах <Constant name="dbt" /> Enterprise можно сопоставлять учётные данные со служебными токенами для безопасной аутентификации. Подробнее см. в разделе [Настройка <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl#administer-the-semantic-layer-1).
- **Исправление**: Исправлена ошибка, из-за которой фильтры запросов с символами Unicode (например, китайскими иероглифами) некорректно работали в интеграции <Constant name="semantic_layer" /> с Tableau.
- **Исправление**: Исправлена ошибка разбора некоторых закрытых ключей для BigQuery при выполнении экспорта.
- **Исправление**: Исправлена ошибка, из-за которой при выполнении запроса или экспорта возвращалась ошибка «closed connection».
- **Исправление**: Исправлена проблема в <Constant name="core" />, из-за которой при частичном разборе ошибочно удалялись все сгенерированные метрики в файле, а не только метрики, связанные с изменённой семантической моделью. Теперь затрагиваются только метрики, связанные с изменённой моделью.

- **New**: Представлена Python-библиотека [`dbt-sl-sdk` SDK](https://github.com/dbt-labs/semantic-layer-sdk-python), которая предоставляет удобный доступ к dbt Semantic Layer из Python. Она позволяет разработчикам взаимодействовать с API dbt Semantic Layer и выполнять запросы метрик и измерений в downstream-инструментах. Подробнее см. [dbt Semantic Layer Python SDK](/docs/dbt-apis/sl-python).
- **New**: Введены semantic validations в CI pipelines. Теперь можно автоматически тестировать semantic nodes (метрики, semantic models и saved queries) во время code review, добавляя проверки в CI-задание с помощью команды `dbt sl validate`. Также можно валидировать изменённые semantic nodes, чтобы гарантировать, что изменения в dbt-моделях не нарушают работу метрик. Подробнее см. [Semantic validations in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci).
- **New**: Поле `meta` теперь доступно в свойстве [config](/reference/resource-configs/meta) для метрик dbt Semantic Layer в [JDBC и GraphQL API](/docs/dbt-apis/sl-api-overview) в поле `meta`.
- **New**: Добавлена новая команда dbt CLI — `export-all`, которая позволяет экспортировать несколько или все saved queries. Ранее требовалось явно указывать [список saved queries](/docs/build/metricflow-commands#list-saved-queries).
- **Enhancement**: <Constant name="semantic_layer" /> теперь предоставляет более детальный контроль, поддерживая несколько учетных данных платформ данных, которые могут представлять разные роли или service accounts. Доступно для тарифов <Constant name="cloud" /> Enterprise — вы можете сопоставлять учетные данные с service tokens для безопасной аутентификации. Подробнее см. [Set up <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl#administer-the-semantic-layer-1).
- **Fix**: Исправлена ошибка, из-за которой unicode-фильтры запросов (например, с китайскими символами) не работали корректно в интеграции <Constant name="semantic_layer" /> с Tableau.
- **Fix**: Исправлена ошибка разбора некоторых приватных ключей для BigQuery при выполнении экспорта.
- **Fix**: Устранена ошибка, из-за которой при выполнении запроса или экспорта возвращалась ошибка «closed connection».
- **Fix**: Исправлена проблема в <Constant name="core" />, при которой во время partial parsing все сгенерированные метрики в файле ошибочно удалялись вместо удаления только тех, которые связаны с изменённой semantic model. Теперь затрагиваются только метрики, связанные с модифицированной моделью.

#### Семантический слой dbt
- **Новое:** В MetricFlow добавлена поддержка SQL-оптимизации <Term id="predicate-pushdown"/>. Теперь фильтры по категориальным измерениям будут применяться непосредственно к исходной таблице метрики. Ранее фильтры применялись после выборки из исходной таблицы метрики. Это изменение помогает сократить количество полных сканирований таблиц в некоторых движках выполнения запросов.
- **Новое:** Фильтры `where` по измерениям (включённые в сохранённые запросы) теперь могут использовать кеш при выполнении запросов. Это означает, что теперь вы можете динамически фильтровать данные на дашбордах, не теряя преимуществ кеширования в производительности. Подробнее см. в разделе [Кеширование](/docs/use-dbt-semantic-layer/sl-cache#result-caching).
- **Улучшение:** В [Google Sheets](/docs/platform-integrations/semantic-layer/gsheets) для метрик и измерений в меню Query Builder добавлены значки информации и описания. Нажмите кнопку со значком **Info**, чтобы просмотреть описание метрики или измерения. Эта возможность доступна в следующих разделах меню Query Builder: metric, group by, where, saved selections и saved queries.
- **Улучшение:** В [Google Sheets](/docs/platform-integrations/semantic-layer/gsheets) теперь можно задавать детализацию для всех временных измерений, а не только для времени метрики. Это обновление использует наши [API](/docs/dbt-apis/sl-api-overview), чтобы поддерживать выбор детализации для любого выбранного временного измерения.
- **Улучшение**: Предупреждения MetricFlow о временных шкалах (time spine) теперь предлагают пользователям настроить отсутствующие временные шкалы или шкалы с мелкой детализацией. Если для одного уровня детализации задано несколько временных шкал, отображается сообщение об ошибке.
- **Улучшение**: Теперь отображается ошибка, если не настроена временная шкала с запрошенным или более мелким уровнем детализации. 
- **Улучшение:** Улучшено сообщение об ошибке при выполнении запроса, если учётные данные для семантического слоя не заданы.
- **Улучшение:** Теперь при запросе доступных уровней детализации для накопительных метрик возвращается несколько вариантов (день, неделя, месяц, квартал, год), как и для всех остальных типов метрик. Ранее для накопительных метрик можно было запрашивать данные только с одним уровнем детализации.
- **Исправление:** Устранены ошибки, препятствовавшие выполнению запросов к накопительным метрикам с другими уровнями детализации.
- **Исправление:** Исправлены различные ошибки Tableau, возникавшие при запросе определённых метрик или использовании вычисляемых полей.
- **Исправление:** В Tableau смягчены требования к именованию полей, чтобы улучшить распознавание вычисляемых полей.
- **Исправление:** Исправлена ошибка при обновлении метаданных базы данных для столбцов, которые невозможно преобразовать в Arrow. Теперь эти столбцы будут пропускаться. В основном эта проблема затрагивала пользователей Redshift с пользовательскими типами данных.
- **Исправление:** Исправлены подключения Private Link для Databricks.

- **New:** Добавлена поддержка новой гранулярности для cumulative metrics в MetricFlow. Параметры гранулярности для cumulative metrics немного отличаются от других типов метрик. Для обычных метрик используется функция `date_trunc`. Однако cumulative metrics являются неаддитивными (значения нельзя просто суммировать), поэтому `date_trunc` неприменим для изменения их временной гранулярности.

- **Улучшение:** Теперь доступны обновления интерфейса [создания заданий слияния](/docs/deploy/merge-jobs). Они включают улучшенные поясняющие тексты, новые настройки отложенного разрешения ссылок (deferral) и повышение производительности.
- **Новое**: <Constant name="semantic_layer" /> теперь поддерживает бесшовную интеграцию с Microsoft Excel, доступную в режиме [предварительного ознакомления](/docs/dbt-versions/product-lifecycles). Создавайте запросы к семантическому слою и получайте данные метрик прямо в Excel через специальное меню. Чтобы узнать больше и установить надстройку, ознакомьтесь с разделом [Microsoft Excel](/docs/platform-integrations/semantic-layer/excel).
- **Новое:** [Предупреждения о заданиях](/docs/deploy/job-notifications) теперь общедоступны (GA). Ранее вы могли получать уведомления по электронной почте или в Slack об успешном выполнении, сбое или отмене заданий. Теперь благодаря новой опции **Warns** вы также можете получать уведомления, если во время выполнения заданий возникли предупреждения от тестов или проверок актуальности источников. Это дает больше гибкости в выборе того, _когда_ получать уведомления. 
- **Новое:** Теперь доступна [предварительная версия](/docs/dbt-versions/product-lifecycles) приложения dbt Snowflake Native App. С помощью этого приложения вы можете использовать dbt Explorer, чат-бот **Ask dbt** и функции наблюдаемости оркестрации, расширяя возможности работы с <Constant name="dbt" /> в интерфейсе Snowflake.

#### dbt Semantic Layer {#dbt-semantic-layer-1}

- **Улучшение:** В IDE появилась новая [кнопка <Constant name="git" /> **Prune branches**](/docs/platform/studio-ide/ide-user-interface#prune-branches-modal). Эта кнопка позволяет удалять локальные ветки, которые уже удалены из удалённого репозитория, помогая поддерживать порядок в ветках. Теперь она доступна во всех регионах, а для аккаунтов с выделенной инфраструктурой (single tenant) станет доступна в следующем цикле выпуска.

#### Также доступно в этом месяце: {#also-available-this-month}

Следующие возможности появились или были улучшены в рамках нашего мероприятия [<Constant name="dbt" /> Launch Showcase](https://www.getdbt.com/resources/webinars/dbt-cloud-launch-showcase), состоявшегося 14 мая 2024 года:

- **Новое:** [<Constant name="copilot" />](/docs/platform/wizard-platform) — мощный ИИ-движок, который помогает создавать документацию, тесты и семантические модели, экономя ваше время при подготовке высококачественных данных. Доступен в IDE в рамках закрытого бета-тестирования для части пользователей <Constant name="dbt" /> Enterprise. [Зарегистрируйте свой интерес](https://docs.google.com/forms/d/e/1FAIpQLScPjRGyrtgfmdY919Pf3kgqI5E95xxPXz-8JoVruw-L9jVtxg/viewform), чтобы присоединиться к закрытому бета-тестированию.

- **Новое:** Новый low-code-редактор, который сейчас находится на этапе закрытого бета-тестирования, позволяет аналитикам с небольшим опытом работы с SQL создавать и редактировать модели dbt в визуальном интерфейсе внутри <Constant name="dbt" /> с помощью перетаскивания элементов. Эти модели компилируются непосредственно в SQL и ничем не отличаются от других моделей dbt в ваших проектах: они находятся под контролем версий, доступны из других проектов в <Constant name="mesh" /> и интегрируются с dbt Explorer и Cloud IDE. [Зарегистрируйте свой интерес](https://docs.google.com/forms/d/e/1FAIpQLScPjRGyrtgfmdY919Pf3kgqI5E95xxPXz-8JoVruw-L9jVtxg/viewform), чтобы присоединиться к закрытому бета-тестированию.

- **Новое:** [<Constant name="dbt" /> CLI](/docs/platform/dbt-cli-installation) теперь общедоступен (GA) для всех пользователей. <Constant name="dbt" /> CLI — это интерфейс командной строки, который позволяет взаимодействовать с <Constant name="dbt" />, использовать автоматическое делегирование (deferral), задействовать <Constant name="mesh" /> и многое другое!

- **Новое:** [Модульные тесты](/docs/build/unit-tests) теперь общедоступны (GA) в <Constant name="dbt" />. Модульные тесты позволяют проверять SQL-логику ваших моделей на наборе статических входных данных.

- <Expandable alt_header="Новое: встроенная поддержка Azure Synapse Analytics" lifecycle="preview"> 

  Встроенная поддержка Azure Synapse Analytics в dbt Cloud теперь доступна в режиме [предварительного доступа](/docs/dbt-versions/product-lifecycles)!

  Подробнее см. в разделах [Подключение Azure Synapse Analytics](/docs/platform/connect-data-platform/connect-azure-synapse-analytics) и [Конфигурации Microsoft Azure Synapse DWH](/reference/resource-configs/azuresynapse-configs).

  Также ознакомьтесь с [Quickstart for dbt Cloud and Azure Synapse Analytics](/guides/azure-synapse-analytics?step=1). Руководство проведет вас через следующие шаги:

  - Загрузка примерных данных Jaffle Shop (предоставленных dbt Labs) в Azure Synapse Analytics.
  - Подключение dbt Cloud к Azure Synapse Analytics.
  - Преобразование примерного запроса в модель в вашем dbt-проекте. Модель в dbt — это SELECT-выражение.
  - Добавление тестов к моделям.
  - Документирование моделей.
  - Планирование задания на выполнение.

  </Expandable>

- **Новое:** MetricFlow теперь позволяет добавлять метрики в качестве измерений (dimensions) в фильтры метрик для создания более сложных метрик и получения большего количества инсайтов. Доступно для всех пользователей <Constant name="semantic_layer" />.

- **Новое:** [Промежуточная среда](/docs/deploy/deploy-environments#staging-environment) теперь общедоступна (GA). Используйте промежуточные среды, чтобы предоставлять разработчикам доступ к рабочим процессам и инструментам развертывания, контролируя при этом доступ к производственным данным. Доступно всем пользователям <Constant name="dbt" />.

- **Новое:** Поддержка входа по OAuth через [Databricks](/docs/platform/manage-access/set-up-databricks-oauth) теперь общедоступна (GA) для клиентов с тарифным планом Enterprise.

- <Expandable alt_header="New: GA of dbt Explorer's features" > 

  Текущие возможности dbt Explorer — включая lineage на уровне колонок, анализ производительности моделей и рекомендации по проекту — теперь доступны в статусе GA для планов dbt Cloud Enterprise и Teams. Explorer позволяет проще навигировать по проекту dbt Cloud (модели, источники и их колонки), чтобы лучше понимать его актуальное состояние в production или staging.

  Подробнее о возможностях:
  
  - [Explore проекты](/docs/explore/explore-projects)
  - [Explore нескольких проектов](/docs/explore/explore-multiple-projects) 
  - [Lineage на уровне колонок](/docs/explore/column-level-lineage) 
  - [Производительность моделей](/docs/explore/model-performance) 
  - [Рекомендации по проекту](/docs/explore/project-recommendations) 

  </Expandable>

- **Новое:** Встроенная поддержка Microsoft Fabric в <Constant name="dbt" /> теперь общедоступна (GA). Эта возможность реализована с помощью адаптера [dbt-fabric](https://github.com/Microsoft/dbt-fabric). Подробнее см. в разделах [Подключение Microsoft Fabric](/docs/platform/connect-data-platform/connect-microsoft-fabric) и [Конфигурации Microsoft Fabric DWH](/reference/resource-configs/fabric-configs). Также доступно [руководство по быстрому старту](/guides/microsoft-fabric?step=1), которое поможет вам начать работу. 

- **Новое:** <Constant name="mesh" /> теперь общедоступен (GA) для пользователей <Constant name="dbt" /> с тарифным планом Enterprise. <Constant name="mesh" /> — это подход, который помогает организациям эффективно масштабировать свои команды и ресурсы данных. Он способствует внедрению лучших практик управления и позволяет разделять крупные проекты на части, которыми проще управлять. Чтобы начать работу с <Constant name="mesh" />, прочитайте [руководство по быстрому старту с <Constant name="mesh" />](/guides/mesh-qs?step=1).

- **Новое:** Интеграции <Constant name="semantic_layer" /> с [Tableau Desktop, Tableau Server](/docs/platform-integrations/semantic-layer/tableau) и [Google Sheets](/docs/platform-integrations/semantic-layer/gsheets) теперь общедоступны (GA) для учетных записей <Constant name="dbt" /> с тарифными планами Team или Enterprise. Эти полнофункциональные интеграции позволяют выполнять запросы и получать ценные аналитические сведения из вашей экосистемы данных.

- **Улучшение:** В рамках нашей постоянной работы над улучшением [IDE](/docs/platform/studio-ide/develop-in-studio#considerations) в файловую систему внесены изменения для ускорения разработки в dbt, в том числе введено ограничение размера репозитория <Constant name="git" /> в 10 ГБ.

#### Также доступно в этом месяце: {#also-available-this-month-1}

- **Обновление**: [CLI <Constant name="dbt" />](/docs/platform/dbt-cli-installation) теперь доступен для одноарендных развертываний в Azure, а также во всех [регионах развертывания](/docs/platform/about-platform/access-regions-ip-addresses) как для многоарендных, так и для одноарендных учетных записей.

- **Новинка**: В [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) появилось [декларативное кэширование](/docs/use-dbt-semantic-layer/sl-cache), позволяющее кэшировать часто используемые запросы для повышения производительности и снижения затрат на вычисления при выполнении запросов. Доступно для учетных записей <Constant name="dbt" /> с тарифным планом Team или Enterprise.

- <Expandable alt_header="New: Latest Release Track" > 

  Release Track **Latest** теперь доступен в статусе GA (ранее — Public Preview).

  На этом релизном треке вы получаете автоматические обновления dbt, включая ранний доступ к новым функциям, исправлениям и улучшениям производительности для вашего dbt-проекта. dbt Labs выполняет обновления «за кулисами» в рамках тестирования и повторного деплоя приложения dbt Cloud — так же, как и другие возможности dbt Cloud и SaaS-инструменты, которыми вы пользуетесь. Больше никаких ручных обновлений и никакой необходимости в _отдельном sandbox-проекте_ только для тестирования новых функций.

  Чтобы узнать больше о новой настройке, обратитесь к разделу [Каналы обновлений](/docs/dbt-versions/dbt-release-tracks).

  <Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/choosing-dbt-version/example-environment-settings.png" width="90%" title="Example of the Latest setting"/>

  </Expandable>

- **Изменение поведения:** Добавлен флаг `require_resource_names_without_spaces`, который включается явно и по умолчанию отключён. Если установить его в `True`, dbt вызовет исключение, если обнаружит имя ресурса, содержащее пробел, в вашем проекте или установленном пакете. В одной из будущих версий dbt такое поведение станет стандартным. Подробнее см. в разделе [Запрет пробелов в именах ресурсов](/reference/global-configs/behavior-flags/require_resource_names_without_spaces).

## Апрель 2024 {#april-2024}

- <Expandable alt_header="New: Merge jobs" lifecycle="beta" > 

  Теперь вы можете нативно настраивать workflow непрерывного деплоя (CD) для своих проектов в dbt Cloud. Доступен beta-релиз [Merge jobs](/docs/deploy/merge-jobs) — нового [типа заданий](/docs/deploy/jobs), который позволяет запускать dbt-задания сразу после слияния изменений (через Git pull requests) в production.

  <Lightbox src="/img/docs/dbt-platform/using-dbt-platform/example-create-merge-job.png" width="90%" title="Example of creating a merge job"/>

  </Expandable>
  
- **Изменение поведения:** Добавлен флаг `require_explicit_package_overrides_for_builtin_materializations`, который включается по желанию и по умолчанию отключён. Если установлено значение `True`, dbt будет использовать только встроенные материализации, определённые в корневом проекте или в самом dbt, а не реализации из пакетов. Это поведение станет поведением по умолчанию в мае 2024 года (в dbt Core v1.8 и каналах выпуска dbt Cloud). Подробнее см. в разделе [Переопределение встроенной материализации в пакете](/reference/global-configs/behavior-flags/require_explicit_package_overrides_for_builtin_materializations).

**<Constant name="semantic_layer" />**
- **Новое**: Используйте сохранённые наборы параметров (Saved selections), чтобы [сохранять выбранные параметры запросов](/docs/platform-integrations/semantic-layer/gsheets#using-saved-selections) в [приложении Google Sheets](/docs/platform-integrations/semantic-layer/gsheets). Их можно сделать приватными или общедоступными; они обновляются при загрузке.
- **Новое**: Метрики теперь отображаются по своим меткам как `metric_name`.
- **Улучшение**: [Метрики](/docs/build/metrics-overview) теперь поддерживают [параметр `meta`](/reference/resource-configs/meta) в свойстве [config](/reference/resource-properties/config). Ранее поддерживался только тег `meta`, который теперь объявлен устаревшим.
- **Улучшение**: В приложении Google Sheets добавлена [поддержка](/docs/platform-integrations/semantic-layer/gsheets#using-saved-queries) непосредственного использования сохранённых запросов, определённых в MetricFlow, в качестве отправной точки для работы или для исследования данных.
- **Улучшение**: В приложении Google Sheets добавлена поддержка запросов измерений без метрик. Ранее требовалось указать измерение.
- **Улучшение**: В приложении Google Sheets добавлена поддержка предустановленных временных периодов и сложных фильтров временного диапазона, таких как «между», «после» и «до».
- **Улучшение**: В приложении Google Sheets добавлена поддержка автоматического заполнения значений измерений при выборе фильтра «where», что избавляет от необходимости вводить их вручную.  Ранее значения измерений требовалось вводить вручную.
- **Улучшение**: В приложении Google Sheets добавлена поддержка прямых запросов к сущностям, что повышает гибкость запросов данных.
- **Улучшение**: В приложении Google Sheets добавлена возможность исключать заголовки столбцов, что удобно для заполнения шаблонов только необходимыми данными.
- **Устаревшая функциональность**: В интеграции с Tableau [источник данных `METRICS_AND_DIMENSIONS`](/docs/platform-integrations/semantic-layer/tableau#using-the-integration) объявлен устаревшим для всех учётных записей, которые не используют его активно. Рекомендуем пользователям переходить на источник данных «ALL» для будущих интеграций.

## Март 2024 {#march-2024}

- **Новое:** Сервисы <Constant name="semantic_layer" /> теперь поддерживают использование Privatelink для клиентов, у которых он включён.
- **Новое:** Теперь вы можете разрабатывать и тестировать свой <Constant name="semantic_layer" /> в dbt CLI, если ваши учётные данные пользователя используют SSO.
- **Улучшение:** Теперь можно выбирать сущности для группировки (Group By), фильтрации (Filter By) и сортировки (Order By).
- **Исправление:** `dbt parse` больше не выдаёт ошибку при использовании списка фильтров (вместо одного строкового фильтра) для метрики.
- **Исправление:** `join_to_timespine` теперь корректно применяется к входным мерам метрик конверсии.
- **Исправление:** Исправлена проблема, из-за которой операции экспорта в Redshift не всегда фиксировались в хранилище данных (DWH), что также приводило к сохранению блокировок таблиц.
- **Изменение поведения:** Добавлен флаг `source_freshness_run_project_hooks`, который по умолчанию отключён и требует явного включения. Если установить для него значение `True`, dbt будет выполнять хуки проекта `on-run-*` при запуске команды `source freshness`. В одной из будущих версий dbt это поведение станет поведением по умолчанию. Подробнее см. в разделе [Хуки проекта при проверке актуальности источников](/reference/global-configs/behavior-flags/source_freshness_run_project_hooks).

## Февраль 2024 {#february-2024}

## Февраль 2024

- **Новое:** [Экспорты](/docs/use-dbt-semantic-layer/exports#create-and-execute-exports) позволяют материализовать сохранённый запрос в виде таблицы или представления на вашей платформе данных. Используя экспорты, вы можете унифицировать определения метрик на своей платформе данных и запрашивать их так же, как любую другую таблицу или представление.
- **Новое:** Вы можете получить список своих [экспортов](/docs/use-dbt-semantic-layer/exports) с помощью новой команды `list saved-queries`, добавив `--show-exports`
- **Новое:** <Constant name="semantic_layer" /> и [коннектор Tableau](/docs/platform-integrations/semantic-layer/tableau) теперь поддерживают фильтры относительных дат в Tableau.

- <Expandable alt_header="New: Use exports to write saved queries">

  Теперь вы можете использовать функцию [exports](/docs/use-dbt-semantic-layer/exports) вместе с [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), что позволяет выполнять запросы к надежным метрикам и обеспечивать быструю отчетность. Exports расширяют возможности saved queries, позволяя записывать часто используемые запросы напрямую в вашу data platform с помощью планировщика заданий dbt Cloud.

  Предоставляя таблицы метрик и измерений, exports позволяют интегрироваться с дополнительными инструментами, которые нативно не подключаются к dbt Semantic Layer, например PowerBI.

  Exports доступны для dbt Cloud multi-tenant планов [Team или Enterprise](https://www.getdbt.com/pricing/) на версиях dbt 1.7 или новее. Подробнее см. [exports blog](https://www.getdbt.com/blog/announcing-exports-for-the-dbt-semantic-layer).

  <Lightbox src="/img/docs/dbt-platform/semantic-layer/deploy_exports.png" width="90%" title="Add an environment variable to run exports in your production run." />

  </Expandable>

- <Expandable alt_header="New: Trigger on job completion " lifecycle="team,enterprise" >

  Для планов dbt Cloud Team и Enterprise теперь доступна возможность запускать deploy jobs после завершения других deploy jobs. Вы можете включить эту функцию [в UI](/docs/deploy/deploy-jobs) с помощью опции **Run when another job finishes** в разделе **Triggers** вашего задания или через [Create Job API endpoint](/dbt-cloud/api-v2#/operations/Create%20Job).

  После включения задание будет запускаться после завершения указанного upstream-задания. Вы можете настроить, какие статусы выполнения будут триггерить запуск — только `Success` или все статусы. Если между вашими dbt-проектами есть зависимости, это позволяет _нативно_ оркестрировать задания внутри dbt Cloud — без необходимости настраивать сторонние инструменты.

  </Expandable>

- <Expandable alt_header="Новое: трек релизов Latest" lifecycle="beta">

  _Теперь доступно в выпадающем списке версий dbt в dbt Cloud — начиная с отдельных клиентов и с постепенным расширением доступности в феврале и марте._

  На этом релизном треке вы получаете автоматические обновления dbt, включая ранний доступ к новым функциям, исправлениям и улучшениям производительности для вашего dbt-проекта. dbt Labs выполняет обновления «за кулисами» в рамках тестирования и повторного деплоя приложения dbt Cloud — так же, как и другие возможности dbt Cloud и используемые вами SaaS-инструменты. Больше никаких ручных обновлений и никакой необходимости в _отдельном sandbox-проекте_ для тестирования новых функций.

  Подробнее о новой настройке см. в разделе [Каналы выпуска](/docs/dbt-versions/dbt-release-tracks).

  <Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/choosing-dbt-version/example-environment-settings.png" width="90%" title="Example of the Latest setting"/>

  </Expandable>

- <Expandable alt_header="New: Override dbt version with new User development settings" >

  Теперь вы можете [переопределить версию dbt](/docs/dbt-versions/upgrade-dbt-platform-version#override-dbt-version), настроенную для среды разработки в вашем проекте, и использовать другую версию &mdash; это изменение затронет только вашу учетную запись. Это позволяет тестировать новые возможности dbt, не влияя на работу других участников того же проекта. Когда результаты тестирования вас устроят, вы сможете безопасно обновить версию dbt для своего проекта или проектов.

  Используйте выпадающий список **dbt version**, чтобы указать версию для переопределения. Он доступен на странице credentials проекта в разделе **User development settings**. Например:

  <Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/choosing-dbt-version/example-override-version.png" width="60%" title="Example of overriding the dbt version on your user account"/>

  </Expandable>

- <Expandable alt_header="Enhancement: Edit in primary git branch in IDE">

  Теперь вы можете редактировать, форматировать файлы и проверять их линтером, а также выполнять команды dbt непосредственно в основной ветке git в [dbt Cloud IDE](/docs/platform/studio-ide/develop-in-studio).  Это улучшение доступно для различных репозиториев, включая репозитории с нативной интеграцией, репозитории, импортированные по URL git, и управляемые репозитории.

  В настоящее время улучшение доступно во всех multi-tenant регионах dbt Cloud и вскоре станет доступно для single-tenant аккаунтов.

  Ранее основная ветка подключенного git-репозитория была _только для чтения_ в IDE. Это обновление переводит ветку в состояние _protected_ и разрешает прямое редактирование. При создании коммита dbt Cloud предложит создать новую ветку. Имя новой ветки будет автоматически заполнено как GIT_USERNAME-patch-#, однако вы можете изменить его на собственное.

  Ранее основная ветка отображалась как read-only, теперь же она помечена иконкой замка, обозначающей protected-статус:

  <DocCarousel slidesPerView={1}>

  <Lightbox src="/img/docs/dbt-platform/using-dbt-platform/read-only.png" width="75%" title="Прежний интерфейс режима только для чтения"/>

  <Lightbox src="/img/docs/dbt-platform/using-dbt-platform/protected.png" width="75%" title="Новый интерфейс защищённого режима"/>

  </DocCarousel>

  Когда вы создаете коммит, находясь в основной ветке, открывается модальное окно с предложением создать новую ветку и ввести сообщение коммита:

  <Lightbox src="/img/docs/dbt-platform/using-dbt-platform/create-new-branch.png" width="75%" title="Create new branch window"/>

  </Expandable>

- **Улучшение:** [Интеграция с Google Sheets](/docs/platform-integrations/semantic-layer/gsheets) для <Constant name="semantic_layer" /> теперь отображает примечание в ячейке, из которой были запрошены данные, делая запросы данных более понятными. В интеграции также появился новый параметр **Time Range**, который позволяет быстро выбирать диапазоны дат.
- **Улучшение:** [GraphQL API](/docs/dbt-apis/sl-graphql) включает параметр `requiresMetricTime` для более эффективной обработки метрик, которые необходимо группировать по времени. (Некоторые метрики, определённые в MetricFlow, нельзя просматривать без временного измерения).
- **Улучшение:** Добавлена возможность запрашивать метрики со смещением и накопительные метрики с использованием имени временного измерения вместо `metric_time`. [Задача #1000](https://github.com/dbt-labs/metricflow/issues/1000)
  - Добавлена возможность запрашивать `metric_time` без метрик. [Задача #928](https://github.com/dbt-labs/metricflow/issues/928)
- **Улучшение:** Добавлена поддержка согласованной генерации SQL-запросов, обеспечивающая согласованность генерируемых идентификаторов для идентичных во всём остальном запросов MF. Ранее SQL, генерируемый `MetricFlowEngine`, не был полностью согласованным для идентичных запросов. [Задача 1020](https://github.com/dbt-labs/metricflow/issues/1020)
- **Исправление:** Коннектор Tableau возвращает фильтр по дате при фильтрации по датам. Ранее он ошибочно возвращал фильтр по временной метке.
-  **Исправление:** MetricFlow теперь проверяет наличие элементов `metrics`, `group by` или `saved_query` в каждом запросе. Ранее такая проверка не выполнялась. [Задача 1002](https://github.com/dbt-labs/metricflow/issues/1002)
- **Исправление:** К мерам, использующим `join_to_timespine` в MetricFlow, теперь корректно применяются фильтры после соединения с временной шкалой.
- **Исправление:** Запросы с несколькими уровнями детализации для метрик со смещением:
  - Если запросить метрику со смещением по времени с несколькими экземплярами `metric_time`/`agg_time_dimension`, смещение будет применено только к одному из них. Оно должно применяться ко всем.
  - Если запросить метрику со смещением по времени с одним экземпляром `metric_time`/`agg_time_dimension`, но выполнить фильтрацию по другому, запрос завершится ошибкой.
- **Исправление:** При оценке узлов для соединения MetricFlow отдаёт приоритет рассматриваемому типу соединения перед типом по умолчанию. Например, для запросов уникальных значений тип соединения по умолчанию — `FULL OUTER JOIN`, однако соединения с временной шкалой требуют более подходящего типа `CROSS JOIN`.
- **Исправление:** Исправлена ошибка, которая ранее приводила к сбоям при обращении к сущностям в фильтрах `where`.

## Январь 2024 {#january-2024}

- <Expandable alt_header="Обновления документации за январь">

  Привет от команды dbt Docs: @mirnawong1, @matthewshaver, @nghi-ly и @runleonarun! Прежде всего, мы хотим поблагодарить 10 новых участников сообщества, которые внесли вклад в docs.getdbt.com :pray: Какое же насыщенное начало года! В январе мы объединили 110 PR.

  Вот как мы улучшили работу с [docs.getdbt.com](http://docs.getdbt.com/):

  - Добавили новое поведение при наведении курсора на изображения
  - Добавили новые раскрывающиеся блоки (expandables) для FAQ
  - Убрали устаревшие уведомления и сниппеты в рамках обслуживания сайта документации

  В январе также появилось много нового контента:

  - Новая страница [часто задаваемых вопросов о dbt Mesh](/best-practices/how-we-mesh/mesh-5-faqs)
  - Запуск бета-версии функции [отслеживания происхождения данных на уровне столбцов в Explorer](/docs/explore/column-level-lineage)
  - Публикации в блоге для разработчиков:
    - [Больше времени на код, меньше на ожидание: осваиваем defer в dbt](/blog/defer-to-prod)
    - [Прекращение поддержки dbt Server](/blog/deprecation-of-dbt-server)
    - От сообщества: [Бессерверный стек данных на бесплатных тарифах с dlt + dbt core](/blog/serverless-dlt-dbt-stack)
  - Команда Extrica добавила документацию для [адаптера dbt-extrica, поддерживаемого сообществом](/docs/local/connect-data-platform/extrica-setup)
  - Semantic Layer: новая [документация по метрикам конверсии](/docs/build/conversion) и параметр `fill_nulls_with`, добавленный для всех типов метрик (выпущено на неделе 12 января 2024 года)
  - Новая [команда dbt environment](/reference/commands/dbt-environment?version=2.0) и её флаги для dbt CLI

  В январе также была обновлена часть существующего контента — в соответствии с новыми возможностями продукта или по запросам сообщества:

  - Встроенная поддержка [частичного разбора в dbt Cloud](/docs/platform/account-settings#partial-parsing)
  - Обновлены рекомендации по использованию точек и символов подчёркивания в [руководстве по лучшим практикам оформления моделей](/best-practices/how-we-style/1-how-we-style-our-dbt-models)
  - Обновлена [документация по PrivateLink для VCS](/docs/platform/secure/private-connectivity/aws/aws-self-hosted)
  - В [документацию по разрешениям ролей проектов Enterprise](/docs/platform/manage-access/enterprise-permissions#project-access-for-project-permissions) добавлена новая роль `job_runner`
  - В [команды MetricFlow](/docs/build/metricflow-commands#list-saved-queries) добавлены сохранённые запросы
  - Удалена сильно устаревшая [документация по as_text](https://github.com/dbt-labs/docs.getdbt.com/pull/4726)

  </Expandable>

- **Новое:** Новый тип метрик, позволяющий измерять события конверсии. Например, учитывать пользователей, которые просмотрели веб-страницу, а затем заполнили форму. Подробнее см. в разделе [Метрики конверсии](/docs/build/conversion). 
- **Новое:** Вместо полного имени измерения (например, `order__user__country`) в выражении группировки или фильтрации теперь достаточно указать основную сущность и имя измерения, например `user__county`. 
- **Новое:** Теперь вы можете выполнять [сохранённые запросы](/docs/build/saved-queries), определённые в <Constant name="semantic_layer" />, с помощью [Tableau](/docs/platform-integrations/semantic-layer/tableau), [GraphQL API](/docs/dbt-apis/sl-graphql), [JDBC API](/docs/dbt-apis/sl-jdbc) и [CLI <Constant name="dbt" />](/docs/platform/dbt-cli-installation).

- <Expandable alt_header="Новое: нативная поддержка partial parsing" >

  По умолчанию dbt парсит все файлы в проекте в начале каждого запуска dbt. В зависимости от размера проекта эта операция может занимать значительное время. Благодаря новой функции partial parsing в dbt Cloud вы можете сократить время, необходимое для парсинга проекта. При включении этой функции dbt Cloud парсит только изменённые файлы, а не все файлы проекта. В результате выполнение команд dbt занимает меньше времени.

  Подробнее см. в разделе [Частичный парсинг](/docs/platform/account-settings#partial-parsing).

  <Lightbox src="/img/docs/deploy/account-settings-partial-parsing.png" width="85%" title="Пример опции Partial parsing" />

  </Expandable>

- **Улучшение:** Параметр `label` спецификации YAML теперь доступен для метрик Semantic Layer в [JDBC и GraphQL API](/docs/dbt-apis/sl-api-overview). Это позволяет удобно использовать `label` в качестве отображаемого имени метрики при предоставлении доступа к ней.
- **Улучшение:** Добавлена поддержка `create_metric: true` для меры — сокращённого способа быстрого создания метрик. Это полезно в случаях, когда метрики используются только для построения других метрик.
- **Улучшение:** Добавлена поддержка фильтров с параметрами Tableau. С помощью [коннектора Tableau](/docs/platform-integrations/semantic-layer/tableau) можно создавать и использовать параметры для данных <Constant name="semantic_layer" />.
- **Улучшение:** Добавлена возможность получать `expr` и `agg` для [мер](/docs/build/measures) через [GraphQL API](/docs/dbt-apis/sl-graphql).
- **Улучшение:** Улучшены сообщения об ошибках в интерфейсе командной строки при запросе измерения, недоступного для заданной метрики.
- **Улучшение:** Теперь можно запрашивать сущности через нашу интеграцию с Tableau (аналогично запросам измерений). 
- **Улучшение:** В нашей интеграции с Tableau появился новый источник данных под названием "ALL", который содержит все определённые семантические объекты. Он содержит ту же информацию, что и "METRICS_AND_DIMENSIONS". В будущем мы прекратим поддержку "METRICS_AND_DIMENSIONS" в пользу "ALL", чтобы название было понятнее.

- **Исправление:** Теперь доступна поддержка числовых типов с точностью больше 38 (например, `BIGDECIMAL`) в BigQuery. Ранее такие типы не поддерживались и приводили к ошибке.
- **Исправление:** В некоторых случаях большие числовые измерения интерпретировались Tableau в научной нотации, из‑за чего их было сложно использовать. Теперь они должны отображаться как обычные числа.
- **Исправление:** Теперь значения измерений сохраняются корректно и больше не преобразуются непреднамеренно в строки.
- **Исправление:** Устранены проблемы с конфликтами имён в запросах, использующих несколько производных метрик с одинаковыми входными метриками. Ранее это могло вызывать конфликт имён. Теперь входные метрики дедуплицируются и каждая используется только один раз.
- **Исправление:** Устранены предупреждения, связанные с использованием двух одинаковых входных measure в производной метрике. Ранее это вызывало предупреждение. Теперь входные measure дедуплицируются, что улучшает обработку запросов и их читаемость.
- **Исправление:** Исправлена ошибка, при которой ссылка на сущность в фильтре с использованием объектного синтаксиса не работала. Например, `{{Entity('entity_name')}}` не могло быть корректно разрешено.
