---
title: "Оркестрация downstream exposures"
sidebar_label: "Оркестрация exposures"
description: "Используйте dbt, чтобы проактивно обновлять базовые источники данных (например, Tableau extracts) во время запланированных dbt jobs."
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg
---

# Оркестрация downstream exposures <Lifecycle status="managed,managed_plus,beta" />

<IntroText>

Используйте [Cloud job scheduler](/docs/deploy/job-scheduler) в dbt, чтобы проактивно обновлять downstream exposures и базовые источники данных (extracts), которые используются в Tableau Workbooks, во время запланированных dbt jobs.

</IntroText>

:::tip Доступно в private beta
Оркестрация exposures в настоящее время доступна в private beta для Enterprise‑аккаунтов <Constant name="cloud" />. Чтобы присоединиться к бете, обратитесь к вашему account representative.
:::

Оркестрация exposures интегрируется с [downstream exposures](/docs/cloud-integrations/downstream-exposures-tableau) и использует ваш `dbt build` job, чтобы Tableau extracts регулярно обновлялись.

Вы можете управлять частотой этих обновлений, настраивая переменные окружения в вашем dbt environment.

<Expandable alt_header="Differences between visualizing and orchestrating downstream exposures">

В следующей таблице показаны основные различия между визуализацией и оркестрацией downstream exposures:

28 | | Информация | Настройка и визуализация нижестоящих экспозиций | Оркестрация нижестоящих экспозиций <Lifecycle status="beta"/> |
| ---- | ---- | ---- |
| Purpose | Автоматически добавляет downstream‑активы в lineage dbt. | Проактивно обновляет базовые источники данных во время запланированных dbt jobs. |
| Benefits | Обеспечивает видимость потоков данных и зависимостей. | Гарантирует, что BI‑инструменты всегда используют актуальные данные без ручного вмешательства. |
| Location  | Отображается в [<Constant name="explorer" />](/docs/explore/explore-projects) | Отображается в [scheduler <Constant name="cloud" />](/docs/deploy/deployments) |
| Supported BI tool | Tableau | Tableau |
| Use case | Помогает пользователям понять, как используются модели, и снижает количество инцидентов. | Оптимизирует своевременность и снижает затраты за счёт запуска моделей только при необходимости. |
</Expandable>

## Предварительные требования

Чтобы оркестрировать downstream exposures, необходимо выполнить следующие условия:

- [Настроены downstream exposures](/docs/cloud-integrations/downstream-exposures-tableau) и нужные exposures включены в lineage.
- Проверено, что environment и jobs используют поддерживаемый dbt [release track](/docs/dbt-versions/cloud-release-tracks).
- Наличие аккаунта <Constant name="cloud" /> на тарифе [Enterprise или Enterprise+](https://www.getdbt.com/pricing/).
- Создан production [deployment environment](/docs/deploy/deploy-environments#set-as-production-environment) для каждого проекта, который вы хотите использовать, с как минимум одним успешным запуском job.
- Наличие [admin permissions](/docs/cloud/manage-access/enterprise-permissions) в <Constant name="cloud" /> для редактирования настроек проекта или production environment.
- Настроен [Tableau personal access token (PAT)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm), создатель которого имеет права на просмотр и обновление data sources, используемых вашими exposures. PAT наследует права своего создателя. Используйте PAT, созданный:
   - администратором Tableau Server или Tableau Site;
   - владельцем data source или project leader.

## Оркестрация downstream exposures

Чтобы оркестрировать downstream exposures и видеть, как обновление происходит автоматически во время запланированных dbt jobs:

1. В <Constant name="cloud" /> нажмите **Deploy**, затем **Environments**, и выберите вкладку **Environment variables**.
2. Нажмите **Add variable** и задайте [environment level variable](/docs/build/environment-variables#setting-and-overriding-environment-variables) `DBT_ACTIVE_EXPOSURES` со значением `1` в том environment, где должно происходить обновление.
3. Затем задайте `DBT_ACTIVE_EXPOSURES_BUILD_AFTER`, чтобы контролировать максимальную частоту обновлений (в минутах) между каждым обновлением exposure.
4. По умолчанию установите значение **1440** минут (24 часа). Это означает, что downstream exposures не будут обновлять Tableau extracts чаще этого интервала, даже если связанные модели запускаются чаще.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/active-exposures-env-var.jpg" width="100%" title="Установите переменную окружения `DBT_ACTIVE_EXPOSURES` в `1`."/>
5. Запустите job в production. Вы будете видеть обновление при каждом запуске job в production.
   - Если job запускается до истечения заданного интервала, <Constant name="cloud" /> пропускает обновление downstream exposure и помечает его как `skipped` в job logs.
6. Просматривайте логи downstream exposure в dbt run job logs.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/active-exposure-log.jpg" title="Просматривайте логи downstream exposures в логах выполнения dbt job."/ >
   - Для диагностики проблем смотрите дополнительные детали в debug logs.
