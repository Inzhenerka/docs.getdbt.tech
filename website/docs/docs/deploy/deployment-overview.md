---
title: "Развертывание dbt"
id: "deployments"
sidebar: "Используйте возможности dbt для бесшовного запуска dbt job в продакшене."
hide_table_of_contents: true
tags: ["scheduler"]
pagination_next: "docs/deploy/job-scheduler"
pagination_prev: null
availability: platform_login
---

<IntroText>

Используйте возможности <Constant name="dbt_platform" />, чтобы без труда запускать задания dbt в промышленной или предпромышленной среде. Вместо запуска команд dbt вручную из командной строки вы можете использовать [встроенный планировщик <Constant name="dbt_platform" />](/docs/deploy/job-scheduler), чтобы автоматизировать порядок и время выполнения dbt. 

</IntroText>

<Constant name="dbt_platform" /> предлагает самый простой и надежный способ запуска вашего проекта dbt в промышленной среде. Без труда переносите качественный код из среды разработки в промышленную среду и создавайте актуальные ресурсы данных, к которым обращаются ваши инструменты бизнес-аналитики (например, [dbt Charts](https://dbtcharts.com/)) и конечные пользователи для принятия бизнес-решений. <Term id="deploying">Развертывание</Term> с помощью <Constant name="dbt" /> позволяет:
- Своевременно поддерживать актуальность данных в промышленной среде
- Обеспечивать эффективность конвейеров CI и конвейеров промышленной среды 
- Выявлять первопричины сбоев в средах развертывания
- Поддерживать высокое качество кода и данных в промышленной среде
- Отслеживать [состояние](/docs/explore/data-tile) заданий развертывания, моделей и тестов
- Использовать [экспорт](/docs/use-dbt-semantic-layer/exports) для записи результатов [сохраненных запросов](/docs/build/saved-queries) на вашу платформу данных, обеспечивая надежную и быструю отчетность по метрикам
- [Визуализировать](/docs/platform-integrations/downstream-exposures-tableau) и [оркестрировать](/docs/platform-integrations/orchestrate-exposures) downstream exposures, чтобы понимать, как модели используются в нижестоящих инструментах, и заблаговременно обновлять лежащие в их основе источники данных при выполнении заданий dbt по расписанию. <Lifecycle status="managed,managed_plus" />
- Использовать [кэширование Git-репозитория в <Constant name="dbt" />](/docs/platform/account-settings#git-repository-caching-) для защиты от сбоев сторонних сервисов и повышения надежности выполнения заданий. <Lifecycle status="managed,managed_plus" />
- Использовать [гибридные проекты](/docs/deploy/hybrid-projects) для загрузки артефактов <Constant name="dbt" /> в <Constant name="dbt_platform" />, чтобы обеспечить централизованный обзор, ссылки между проектами и упростить совместную работу. <Lifecycle status="managed_plus" /> <Lifecycle status="preview"/>

- Поддерживать актуальность production‑данных на регулярной основе  
- Обеспечивать эффективность CI‑ и production‑пайплайнов  
- Быстро выявлять первопричины сбоев в окружениях развёртывания  
- Поддерживать высокое качество кода и данных в production  
- Получать прозрачность и обзор [состояния](/docs/explore/data-tile) заданий развёртывания, моделей и тестов  
- Использовать [exports](/docs/use-dbt-semantic-layer/exports) для записи [saved queries](/docs/build/saved-queries) в вашей платформе данных, обеспечивая надёжную и быструю отчётность по метрикам  
- [Визуализировать](/docs/platform-integrations/downstream-exposures-tableau) и [оркестрировать](/docs/platform-integrations/orchestrate-exposures) downstream‑exposures, чтобы понимать, как модели используются во внешних инструментах, и проактивно обновлять базовые источники данных во время запланированных dbt‑задач. <Lifecycle status="managed,managed_plus" />  
- Использовать [кэширование Git‑репозиториев <Constant name="cloud" />](/docs/platform/account-settings#git-repository-caching-) для защиты от сбоев сторонних сервисов и повышения надёжности выполнения заданий. <Lifecycle status="managed,managed_plus" />  
- Использовать [Hybrid projects](/docs/deploy/hybrid-projects) для загрузки артефактов <Constant name="cloud" /> в <Constant name="dbt_platform" /> с целью централизованной видимости, перекрёстных ссылок между проектами и более удобной совместной работы. <Lifecycle status="managed_plus" /> <Lifecycle status="Preview"/>

Узнайте, как использовать возможности <Constant name="dbt" />, чтобы вашей команде было проще своевременно предоставлять качественные данные в промышленной среде.
## Развертывание с dbt

<div className="grid--3-col">

<Card
    title="Планировщик заданий"
    body="Планировщик заданий — это основа выполнения задач на платформе dbt. Он обеспечивает мощный и при этом простой способ построения дата‑пайплайнов как в средах непрерывной интеграции, так и в продуктивных окружениях."
    link="/docs/deploy/job-scheduler"
    icon="dbt-bit"/>

<Card
    title="Развертывание задач"
    body="Создавайте и планируйте задачи для выполнения планировщиком задач. <br /><br />Запускается по расписанию, через API или после завершения другой задачи."
    link="/docs/deploy/deploy-jobs"
    icon="dbt-bit"/>

<Card
title="Состояние dbt"
    body="Интеллектуально определяет, какие модели нужно построить, выявляя изменения в коде или данных при каждом запуске задания."
    link="/docs/deploy/dbt-state-about"
    icon="dbt-bit"/>

<Card
    title="Непрерывная интеграция"
    body="Настройте CI-проверки, чтобы вы могли собирать и тестировать любой изменённый код в staging-окружении при открытии PR и отправке новых коммитов в ваш репозиторий dbt."
    link="/docs/deploy/continuous-integration"
    icon="dbt-bit"/>

<Card
    title="Непрерывное развертывание"
    body="Настройте задачи слияния, чтобы гарантировать, что последние изменения кода всегда находятся в производственной среде, когда запросы на слияние объединяются в ваш Git репозиторий."
    link="/docs/deploy/continuous-deployment"
    icon="dbt-bit"/>

<Card
    title="Команды задач"
    body="Настройте, какие команды dbt выполнять при запуске dbt задачи."
    link="/docs/deploy/job-commands"
    icon="dbt-bit"/>

</div> <br />

## Мониторинг задач и оповещений {#monitor-jobs-and-alerts}

<div className="grid--3-col">

<Card
    title="Визуализация и оркестрация exposures"
    body="Узнайте, как использовать dbt для автоматической генерации downstream exposures на основе дашбордов и проактивного обновления базовых источников данных во время запланированных запусков dbt."
    link="/docs/deploy/orchestrate-exposures"
    icon="dbt-bit"/>

<Card
    title="Артефакты"
    body="dbt генерирует и сохраняет артефакты вашего проекта, которые используются для таких возможностей, как создание документации по проекту и отчетность о свежести источников данных."
    link="/docs/deploy/artifacts"
    icon="dbt-bit"/>

<Card
    title="Уведомления о задачах"
    body="Получайте уведомления по электронной почте или в канале Slack, когда выполнение задачи успешно, завершилось с ошибкой или отменено, чтобы вы могли быстро отреагировать и начать исправление, если необходимо."
    link="/docs/deploy/job-notifications"
    icon="dbt-bit"/>

<Card
    title="Уведомления о моделях"
    body="Получайте уведомления по электронной почте в реальном времени о проблемах, с которыми сталкиваются ваши модели и тесты во время выполнения задачи."
    link="/docs/deploy/model-notifications"
    icon="dbt-bit"/>

<Card
    title="Видимость запусков"
    body="Просматривайте историю запусков и дашборд времени выполнения моделей, чтобы понять, где можно внести улучшения в запланированные задания."
    link="/docs/deploy/run-visibility"
    icon="dbt-bit"/>

<Card
    title="Повторный запуск заданий"
    body="Перезапускайте задания, завершившиеся с ошибкой, с самого начала или с момента сбоя."
    link="/docs/deploy/retry-jobs"
    icon="dbt-bit"/>

<Card
    title="Свежесть источников"
    body="Включите снимки для фиксации свежести ваших источников данных и настройте, как часто эти снимки должны делаться. Это может помочь вам определить, соответствует ли свежесть ваших исходных данных вашим SLA."
    link="/docs/deploy/source-freshness"
    icon="dbt-bit"/>

<Card
    title="Вебхуки"
    body="Создавайте исходящие вебхуки для отправки событий о статусах ваших заданий dbt в другие системы вашей организации."
    link="/docs/deploy/webhooks"
    icon="dbt-bit"/>

</div> <br />

## Связанные документы {#hybrid-projects}

## Гибридные проекты <Lifecycle status="managed" /> <Lifecycle status="preview"/>

<div className="grid--3-col">

<Card
title="Гибридные проекты"
    body="Используйте гибридные проекты для загрузки артефактов dbt на платформу dbt, чтобы обеспечить централизованный обзор, ссылки между проектами и упростить совместную работу."
    link="/docs/deploy/hybrid-projects"
    icon="dbt-bit"/>

</div> <br />

<!--
<a href="https://docs.getdbt.tech/docs/deploy/dbt-cloud-job" target="_blank" class="pagination-nav__label nav-create-account button button--primary">Try deploying with dbt</a> 



## Run dbt in production {#related-docs}

If you want to run dbt jobs on a schedule, you can use tools such as <Constant name="dbt" />, Airflow, Prefect, Dagster, automation server, or Cron.-->

## Связанные материалы

- [Использование exports для материализации сохранённых запросов](/docs/use-dbt-semantic-layer/exports)
- [Интеграция с другими инструментами оркестрации](/docs/deploy/deployment-tools)
