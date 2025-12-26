---
title: "Задания развертывания"
description: "Узнайте, как создавать и планировать задания развертывания в dbt для запуска через планировщик. При запуске dbt вы получаете встроенные возможности наблюдаемости, логирования и оповещений."
tags: [scheduler]
---

Вы можете использовать deploy jobs, чтобы собирать production data assets. Deploy jobs упрощают запуск команд dbt для проекта в вашей облачной data platform: по расписанию или по событиям. Каждый запуск job в <Constant name="cloud" /> будет отображаться в истории запусков job, а также в подробном обзоре запуска, где доступны:

- Тип триггера job
- Commit SHA
- Имя окружения
- Информация об источниках (sources) и документации, если применимо
- Детали запуска job, включая тайминги, [данные о времени выполнения моделей](/docs/deploy/run-visibility#model-timing) и [артефакты](/docs/deploy/artifacts)
- Подробные шаги запуска с логами и статусами шагов

Вы можете создать deploy job и настроить его запуск по [расписанию по дням и времени](#schedule-days), задать [кастомное cron-расписание](#cron-schedule) или [запускать job после завершения другой job](#trigger-on-job-completion).


## Предварительные требования

- У вас должна быть [учетная запись <Constant name="cloud" />](https://www.getdbt.com/signup/) и лицензия [Developer seat](/docs/cloud/manage-access/seats-and-users).
    - Для функции [Trigger on job completion](#trigger-on-job-completion) ваш аккаунт <Constant name="cloud" /> должен быть на тарифе [Starter или Enterprise-tier](https://www.getdbt.com/pricing/).
- У вас должен быть dbt‑проект, подключенный к [data platform](/docs/cloud/connect-data-platform/about-connections).
- У вас должны быть [права доступа](/docs/cloud/manage-access/about-user-access) для просмотра, создания, изменения или запуска jobs.
- Вам нужно настроить [deployment environment](/docs/deploy/deploy-environments).

## Создание и расписание jobs {#create-and-schedule-jobs}

1. На странице deployment environment нажмите **Create job** > **Deploy job**, чтобы создать новый deploy job.
2. Параметры в разделе **Job settings**:
    - **Job name** &mdash; Укажите имя deploy job. Например: `Daily build`.
    - (Опционально) **Description** &mdash; Добавьте описание того, что делает job (например, что job потребляет и что она создает).
    - **Environment** &mdash; По умолчанию установлено deployment environment, из которого вы создавали deploy job.
3. Параметры в разделе **Execution settings**:
    - [**Commands**](/docs/deploy/job-commands#built-in-commands) &mdash; По умолчанию включает команду `dbt build`. Нажмите **Add command**, чтобы добавить другие [команды](/docs/deploy/job-commands), которые должны выполняться при запуске job. Во время запуска job [built-in commands](/docs/deploy/job-commands#built-in-commands) «цепочкой» выполняются друг за другом; если один шаг падает, вся job завершится со статусом "Error".
    - [**Generate docs on run**](/docs/deploy/job-commands#checkbox-commands) &mdash; Включите, если хотите [генерировать документацию проекта](/docs/explore/build-and-view-your-docs) при запуске deploy job. Если этот шаг упадет, job всё равно может завершиться успешно, если последующие шаги пройдут.
    - [**Run source freshness**](/docs/deploy/job-commands#checkbox-commands) &mdash; Включите, чтобы выполнить команду `dbt source freshness` перед запуском deploy job. Если этот шаг упадет, job всё равно может завершиться успешно, если последующие шаги пройдут. Подробнее см. [Source freshness](/docs/deploy/source-freshness).
4. Параметры в разделе **Triggers**:
    - **Run on schedule** &mdash; Запускать deploy job по расписанию.
        - **Timing** &mdash; Укажите, как [расписать](#schedule-days) deploy job: **Intervals** (запуск каждые N часов), **Specific hours** (в определенные часы суток) или **Cron schedule** (по [cron синтаксису](#cron-schedule)).
        - **Days of the week** &mdash; По умолчанию установлено каждый день, если в **Timing** выбран **Intervals** или **Specific hours**.
    - **Run when another job finishes** &mdash; Запускать deploy job после завершения другой _upstream_ deploy [job](#trigger-on-job-completion).
        - **Project** &mdash; Укажите родительский проект, в котором находится upstream deploy job.
        - **Job** &mdash; Укажите upstream deploy job.
        - **Completes on** &mdash; Выберите статус(ы) запуска job, при которых deploy job будет поставлена в очередь ([enqueue](/docs/deploy/job-scheduler#scheduler-queue)).

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-triggers-section.png" width="90%" title="Пример раздела Triggers на странице Deploy Job"/>

5. (Опционально) Параметры в разделе **Advanced settings**:
    - **Environment variables** &mdash; Определите [переменные окружения](/docs/build/environment-variables), чтобы настроить поведение проекта при запуске deploy job.
    - **Target name** &mdash; Определите [имя target](/docs/build/custom-target-names), чтобы настроить поведение проекта при запуске deploy job. Переменные окружения и target name часто используются взаимозаменяемо.
    - **Run timeout** &mdash; Отменить deploy job, если время выполнения превышает значение таймаута.
    - **Compare changes against** &mdash; По умолчанию установлено **No deferral**. Выберите **Environment** или **This Job**, чтобы указать <Constant name="cloud" />, с чем нужно сравнивать изменения.

    :::info
    В старых версиях <Constant name="cloud" /> можно было делать deferral только на конкретную job, а не на environment. Deferral на job сравнивает state с кодом проекта из последнего успешного запуска deferred job. Deferral на environment эффективнее, поскольку <Constant name="cloud" /> сравнивает с представлением проекта (которое хранится в `manifest.json`) из последнего успешного запуска deploy job в deferred environment. Учитывая _все_ deploy jobs, которые выполняются в deferred environment, <Constant name="cloud" /> получает более точное и актуальное представление state проекта.
    :::

    - **dbt version** &mdash; По умолчанию наследуется [версия dbt](/docs/dbt-versions/core) из окружения. dbt Labs настоятельно рекомендует не менять настройку по умолчанию. Возможность менять версию на уровне job полезна только при обновлении проекта до следующей версии dbt; иначе несовпадение версий окружения и job может приводить к непредсказуемому поведению.
    - **Threads** &mdash; По умолчанию установлено 4 [потока](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Увеличьте количество потоков, чтобы повысить параллельность выполнения моделей.

    <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/deploy-job-adv-settings.png" width="90%" title="Пример Advanced Settings на странице Deploy Job"/>

### Расписание по дням

Чтобы задать расписание job, включите опцию **Run on schedule**, выберите нужные дни недели и укажите часы или интервалы.

В разделе **Timing** вы можете использовать регулярные интервалы для jobs, которые должны выполняться часто в течение дня, или указывать конкретные часы для jobs, которые должны выполняться в определенное время:

- **Intervals** &mdash; Используйте этот вариант, чтобы задать частоту запуска job в часах. Например, если выбрать **Every 2 hours**, job будет запускаться каждые 2 часа, начиная с полуночи UTC. Это не означает, что первый запуск будет ровно в полночь UTC. Однако последующие запуски всегда будут происходить с одинаковым интервалом. Например, если предыдущий запуск был в 00:04 UTC, следующий будет в 02:04 UTC. Этот вариант полезен, если job нужно запускать несколько раз в день по регулярному интервалу.

- **Specific hours** &mdash; Используйте этот вариант, чтобы задать конкретные часы запуска job. Можно указать список часов (в UTC) через запятую, когда job должна запускаться. Например, если указать `0,12,23,`, job будет запускаться в полночь, в полдень и в 11 вечера UTC. Запуски будут консистентны по часам и дням, так что если job запускается в 00:05, 12:05 и 23:05 UTC, то она будет запускаться в эти же часы каждый день. Этот вариант полезен, если job должна выполняться в определенное время суток и не должна запускаться чаще одного раза в день.


:::info

<Constant name="cloud" /> использует [Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) (UTC) и не выполняет преобразование в ваш часовой пояс и не учитывает переходы на летнее/зимнее время. Например:

- 0 означает 12am (полночь) UTC
- 12 означает 12pm (день) UTC
- 23 означает 11pm UTC

:::

### Cron schedule

Чтобы полностью кастомизировать расписание job, выберите опцию **Cron schedule** и используйте cron‑синтаксис. В этом синтаксисе можно указать минуту, час, день месяца, месяц и день недели, что позволяет задавать сложные расписания (например запуск job в первый понедельник каждого месяца).

**Частота cron**

Чтобы повысить производительность, ограничения частоты расписания зависят от тарифа <Constant name="cloud" />:

- Developer plans: <Constant name="cloud" /> задает минимальный интервал в 10 минут. Это означает, что запуск чаще, чем раз в 10 минут, или с интервалом меньше 10 минут, не поддерживается.
- Starter, Enterprise и Enterprise+ plans: ограничений на частоту выполнения job нет.

**Примеры**

Используйте инструменты вроде [crontab.guru](https://crontab.guru/), чтобы сформировать корректный cron‑синтаксис. Этот инструмент позволяет вводить cron‑фрагменты и получать их расшифровку на обычном языке. Планировщик <Constant name="cloud" /> поддерживает `L` для запуска jobs в последний день месяца.

Примеры cron‑расписаний:

- `0 * * * *`: Каждый час, в 0 минут.
- `*/5 * * * *`: Каждые 5 минут. (Недоступно на Developer plans)
- `5 4 * * *`: Ровно в 4:05 AM UTC.
- `30 */4 * * *`: В минуту 30 каждого 4‑го часа (например 4:30 AM, 8:30 AM, 12:30 PM и т. д., всё UTC).
- `0 0 */2 * *`: В 12:00 AM (полночь) UTC через день.
- `0 0 * * 1`: В полночь UTC каждый понедельник.
- `0 0 L * *`: В 12:00 AM (полночь), в последний день месяца.
- `0 0 L 1,2,3,4,5,6,8,9,10,11,12 *`: В 12:00 AM в последний день месяца, только в январе, феврале, марте, апреле, мае, июне, августе, сентябре, октябре, ноябре и декабре.
- `0 0 L 7 *`: В 12:00 AM в последний день месяца, только в июле.
- `0 0 L * FRI,SAT`: В 12:00 AM в последний день месяца и в пятницу и субботу.
- `0 12 L * *`: В 12:00 PM (день), в последний день месяца.
- `0 7 L * 5`: В 07:00 AM, в последний день месяца и в пятницу.
- `30 14 L * *`: В 02:30 PM, в последний день месяца.

### Триггер по завершению job  <Lifecycle status="self_service,managed,managed_plus" />
Чтобы _связывать_ deploy jobs в цепочку:
1. В разделе **Triggers** включите опцию **Run when another job finishes**.
2. Выберите проект, в котором находится deploy job, после завершения которой вы хотите запускать вашу job.
3. Укажите upstream (родительскую) job, завершение которой будет триггерить вашу job.
   - Это также можно настроить через [Create Job API](/dbt-cloud/api-v2#/operations/Create%20Job).
4. В опции **Completes on** выберите статус(ы) запуска job, при которых deploy job будет поставлена в очередь ([enqueue](/docs/deploy/job-scheduler#scheduler-queue)).

<Lightbox src="/img/docs/deploy/deploy-job-completion.jpg" width="100%" title="Пример Trigger on job completion на странице Deploy job"/>

5. Вы можете настроить конфигурацию, где одна upstream job триггерит несколько downstream (дочерних) jobs, а также jobs в других проектах. Для настройки триггера у вас должны быть соответствующие [permissions](/docs/cloud/manage-access/enterprise-permissions#project-role-permissions) на проект и job.

Если запуск вашей job был триггернут другой job, ссылку на upstream job можно найти в [разделе деталей запуска](/docs/deploy/run-visibility#job-run-details).

## Удаление job

import DeleteJob from '/snippets/_delete-job.md';

<DeleteJob/>

import JobMonitoring from '/snippets/_in-progress-top-jobs.md';

<JobMonitoring />

## История настроек job

Вы можете просматривать историю изменений настроек job за последние 90 дней.

Чтобы посмотреть историю изменений:
1. Перейдите в **Orchestration** в главном меню и нажмите **Jobs**.
2. Нажмите на **название job**.
3. Нажмите **Settings**.
4. Нажмите **History**.

<Lightbox src="/img/docs/deploy/job-history.png" width="100%" title="Пример истории настроек job."/>

## Связанные материалы

- [Artifacts](/docs/deploy/artifacts)
- [Continuous integration (CI) jobs](/docs/deploy/ci-jobs)
- [Webhooks](/docs/deploy/webhooks)
