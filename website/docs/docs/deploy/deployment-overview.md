---
title: "Развертывание dbt"
id: "deployments"
sidebar: "Используйте возможности dbt для бесшовного запуска dbt job в продакшене."
hide_table_of_contents: true
tags: ["scheduler"]
pagination_next: "docs/deploy/job-scheduler"
pagination_prev: null
---

<IntroText>

Используйте возможности <Constant name="cloud" />, чтобы без лишних усилий запускать dbt‑задачи в production или staging‑окружениях. Вместо ручного запуска команд dbt из командной строки вы можете воспользоваться [встроенным планировщиком <Constant name="cloud" />](/docs/deploy/job-scheduler), чтобы автоматизировать то, как и когда выполняется dbt. 

</IntroText>

<Constant name="dbt_platform" /> предоставляет самый простой и надёжный способ запускать ваш dbt‑проект в production. Вы можете без труда продвигать высококачественный код из разработки в production и создавать актуальные данные, к которым обращаются инструменты бизнес‑аналитики и конечные пользователи для принятия бизнес‑решений. <Term id="deploying">Развёртывание</Term> с помощью <Constant name="cloud" /> позволяет вам:

- Поддерживать актуальность production‑данных на регулярной основе  
- Обеспечивать эффективность CI‑ и production‑пайплайнов  
- Быстро выявлять первопричины сбоев в окружениях развёртывания  
- Поддерживать высокое качество кода и данных в production  
- Получать прозрачность и обзор [состояния](/docs/explore/data-tile) заданий развёртывания, моделей и тестов  
- Использовать [exports](/docs/use-dbt-semantic-layer/exports) для записи [saved queries](/docs/build/saved-queries) в вашей платформе данных, обеспечивая надёжную и быструю отчётность по метрикам  
- [Визуализировать](/docs/cloud-integrations/downstream-exposures-tableau) и [оркестрировать](/docs/cloud-integrations/orchestrate-exposures) downstream‑exposures, чтобы понимать, как модели используются во внешних инструментах, и проактивно обновлять базовые источники данных во время запланированных dbt‑задач. <Lifecycle status="managed,managed_plus" />  
- Использовать [кэширование Git‑репозиториев <Constant name="cloud" />](/docs/cloud/account-settings#git-repository-caching) для защиты от сбоев сторонних сервисов и повышения надёжности выполнения заданий. <Lifecycle status="managed,managed_plus" />  
- Использовать [Hybrid projects](/docs/deploy/hybrid-projects) для загрузки артефактов <Constant name="cloud" /> в <Constant name="dbt_platform" /> с целью централизованной видимости, перекрёстных ссылок между проектами и более удобной совместной работы. <Lifecycle status="managed_plus" /> <Lifecycle status="Preview"/>

Перед продолжением убедитесь, что вы понимаете подход dbt к [средам развертывания](/docs/deploy/deploy-environments).

Узнайте, как использовать возможности <Constant name="cloud" />, чтобы помочь вашей команде проще и быстрее поставлять в продакшен качественные данные.

## Deploy with dbt

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
    title="State-aware orchestration"
    body="Интеллектуально определяет, какие модели нужно собирать, обнаруживая изменения в коде или данных при каждом запуске задания."
    link="/docs/deploy/state-aware-about"
    icon="dbt-bit"/>

<Card
    title="Continuous integration"
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

## Мониторинг задач и оповещений

<div className="grid--3-col">

<Card
    title="Визуализация и оркестрация exposures"
    body="Узнайте, как использовать dbt для автоматической генерации downstream exposures на основе дашбордов и проактивного обновления базовых источников данных во время запланированных запусков dbt."
    link="/docs/deploy/orchestrate-exposures"
    icon="dbt-bit"/>

<Card
    title="Artifacts"
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
    title="Webhooks"
    body="Create outbound webhooks to send events about your dbt jobs' statuses to other systems in your organization."
    link="/docs/deploy/webhooks"
    icon="dbt-bit"/>

</div> <br />

## Связанные документы

## Гибридные проекты <Lifecycle status="managed" /> <Lifecycle status="Preview"/>

<div className="grid--3-col">

<Card
    title="Hybrid projects"
    body="Используйте гибридные проекты, чтобы загружать артефакты dbt Core в платформу dbt для централизованной видимости, перекрёстных ссылок между проектами и более удобной совместной работы."
    link="/docs/deploy/hybrid-projects"
    icon="dbt-bit"/>

</div> <br />

<!--
<a href="https://docs.getdbt.com/docs/deploy/dbt-cloud-job" target="_blank" class="pagination-nav__label nav-create-account button button--primary">Try deploying with dbt</a> 

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="98%" title="An overview of a dbt job run which contains Run Summary, Job Trigger, Run Duration, and more."/>

<Lightbox src="/img/docs/dbt-cloud/deployment/run-history.jpg" width="95%" title="Run History dashboard allows you to monitor the health of your dbt project and displays jobs, job status, environment, timing, and more."/>


<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.gif" width="85%" title="Access logs for run steps" />

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/job-commands.gif" width="95%" title="Setting up a job and configuring checkbox and dbt commands"/>

</DocCarousel>

## Run dbt in production

If you want to run dbt jobs on a schedule, you can use tools such as <Constant name="cloud" />, Airflow, Prefect, Dagster, automation server, or Cron.-->

## Связанные материалы

- [Использование exports для материализации сохранённых запросов](/docs/use-dbt-semantic-layer/exports)
- [Интеграция с другими инструментами оркестрации](/docs/deploy/deployment-tools)
