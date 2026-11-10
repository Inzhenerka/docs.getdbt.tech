---
title: "Оркестрация downstream exposures"
sidebar_label: "Оркестрация exposures"
description: "Используйте dbt, чтобы проактивно обновлять базовые источники данных (например, Tableau extracts) во время запланированных dbt jobs."
image: /img/docs/platform-integrations/auto-exposures/explorer-lineage2.png
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Оркестрация зависимых экспозиций <Lifecycle status="beta" /> {#orchestrate-downstream-exposures}

<IntroText>

Используйте [планировщик заданий <Constant name="dbt_platform" />](/docs/deploy/job-scheduler), чтобы заблаговременно обновлять зависимые экспозиции и лежащие в их основе источники данных (экстракты), которые используются в ваших рабочих книгах Tableau.

</IntroText>

<VersionBlock firstVersion="2.0">

:::warning <Constant name="fusion" /> не поддерживается в этой бета-версии

Оркестрация зависимых экспозиций _недоступна_, если ваши развертывания используют [**v2 Stable**](/docs/dbt-versions/dbt-release-tracks). Поддерживаемые задания должны использовать [**v1 Latest**](/docs/dbt-versions/dbt-release-tracks) с движком <Constant name="core" />.

В канале выпуска [**v2 Stable**](/docs/dbt-versions/dbt-release-tracks) оркестрация зависимых экспозиций пока не поддерживается. Установка `DBT_ACTIVE_EXPOSURES` и `DBT_ACTIVE_EXPOSURES_BUILD_AFTER` не включит функции оркестрации (например, обновление экстрактов Tableau) или соответствующие записи в журналах заданий.

Закрытая бета-версия предназначена для учетных записей <Constant name="dbt" /> Enterprise. Для получения доступа обратитесь к представителю, обслуживающему вашу учетную запись.

:::

</VersionBlock>

<VersionBlock lastVersion="1.99">

:::tip Доступно в private beta

Оркестрация экспозиций сейчас доступна в закрытой бета-версии для учетных записей <Constant name="dbt" /> Enterprise. Ваши среды развертывания и задания по расписанию должны использовать [**v1 Latest**](/docs/dbt-versions/dbt-release-tracks) с движком <Constant name="core" /> (а не [канал выпуска **v2 Stable**](/docs/dbt-versions/dbt-release-tracks)). Чтобы присоединиться к бета-тестированию, обратитесь к представителю, обслуживающему вашу учетную запись.

:::

</VersionBlock>

Оркестрация экспозиций интегрируется с [зависимыми экспозициями](/docs/platform-integrations/downstream-exposures-tableau) и использует ваше задание `dbt build`, чтобы обеспечить регулярное обновление экстрактов Tableau.

Вы можете управлять частотой этих обновлений, настраивая переменные окружения в вашем dbt environment.

<Expandable alt_header="Различия между визуализацией и оркестрацией зависимых экспозиций">

В следующей таблице показаны основные различия между визуализацией и оркестрацией downstream exposures:

| Информация | Настройка и визуализация зависимых экспозиций | Оркестрация зависимых экспозиций <Lifecycle status="beta"/> |
| ---- | ---- | ---- |
| Purpose | Автоматически добавляет downstream‑активы в lineage dbt. | Проактивно обновляет базовые источники данных во время запланированных dbt jobs. |
| Benefits | Обеспечивает видимость потоков данных и зависимостей. | Гарантирует, что BI‑инструменты всегда используют актуальные данные без ручного вмешательства. |
| Location  | Отображается в [<Constant name="catalog" />](/docs/explore/explore-projects) | Отображается в [scheduler <Constant name="dbt" />](/docs/deploy/deployments) |
| Поддерживаемый инструмент BI | Tableau | Tableau |
| Use case | Помогает пользователям понять, как используются модели, и снижает количество инцидентов. | Оптимизирует своевременность и снижает затраты за счёт запуска моделей только при необходимости. |
</Expandable>

## Предварительные требования {#prerequisites}

Чтобы оркестрировать downstream exposures, необходимо выполнить следующие условия:

- [Настроили зависимые экспозиции](/docs/platform-integrations/downstream-exposures-tableau) и убедились, что нужные экспозиции включены в граф происхождения данных.
- Проверено, что environment и jobs используют поддерживаемый dbt [release track](/docs/dbt-versions/dbt-release-tracks).
- Наличие аккаунта <Constant name="dbt" /> на тарифе [Enterprise или Enterprise+](https://www.getdbt.com/pricing/).
- Создан production [deployment environment](/docs/deploy/deploy-environments#set-as-production-environment) для каждого проекта, который вы хотите использовать, с как минимум одним успешным запуском job.
- Имеете [права администратора](/docs/platform/manage-access/enterprise-permissions) в <Constant name="dbt" /> для изменения настроек проекта или производственной среды.
- Настроен [Tableau personal access token (PAT)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm), создатель которого имеет права на просмотр и обновление data sources, используемых вашими exposures. PAT наследует права своего создателя. Используйте PAT, созданный:
   - администратором Tableau Server или Tableau Site;
   - владельцем data source или project leader.


## Оркестрация downstream exposures {#orchestrate-downstream-exposures-1}

Чтобы оркестрировать зависимые экспозиции и автоматически обновлять их при выполнении заданий по расписанию в [Latest](/docs/dbt-versions/dbt-release-tracks) с движком <Constant name="core" />:

1. В <Constant name="dbt_platform" /> нажмите **Deploy**, затем **Environments**, и выберите вкладку **Environment variables**.
2. Нажмите **Add variable** и задайте [environment level variable](/docs/build/environment-variables#setting-and-overriding-environment-variables) `DBT_ACTIVE_EXPOSURES` со значением `1` в том environment, где должно происходить обновление.
3. Затем задайте `DBT_ACTIVE_EXPOSURES_BUILD_AFTER`, чтобы контролировать максимальную частоту обновлений (в минутах) между каждым обновлением exposure.
4. По умолчанию установите значение **1440** минут (24 часа). Это означает, что downstream exposures не будут обновлять Tableau extracts чаще этого интервала, даже если связанные модели запускаются чаще.
   <Lightbox src="/img/docs/platform-integrations/auto-exposures/active-exposures-env-var.jpg" width="100%" title="Установите для переменной среды `DBT_ACTIVE_EXPOSURES` значение `1`."/>
5. Запустите производственное задание в [Latest](/docs/dbt-versions/dbt-release-tracks) с <Constant name="core" />. Каждый запуск может инициировать обновление зависимой экспозиции; если задание запускается до истечения настроенного интервала, <Constant name="dbt" /> пропускает обновление зависимой экспозиции и отмечает его как `skipped` в журналах задания.
6. Просмотрите записи о зависимых экспозициях в журналах запуска задания.
   <Lightbox src="/img/docs/platform-integrations/auto-exposures/active-exposure-log.jpg" title="Просмотрите журналы зависимых экспозиций в журналах запуска задания dbt."/>
   - Для диагностики проблем смотрите дополнительные детали в debug logs.
