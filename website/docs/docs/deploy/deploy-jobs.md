---
title: "Развертывание заданий"
description: "Узнайте, как создавать и планировать задания развертывания в dbt Cloud для выполнения планировщиком. При запуске с dbt Cloud вы получаете встроенную наблюдаемость, ведение журналов и оповещения."
tags: [scheduler]
---

Вы можете использовать задания развертывания для создания производственных данных. Задания развертывания упрощают выполнение команд dbt в проекте на вашей облачной платформе данных, запускаемых по расписанию или по событиям. Каждый запуск задания в dbt Cloud будет иметь запись в истории запусков задания и подробный обзор запуска, который предоставляет вам:

- Тип триггера задания
- Commit SHA
- Имя окружения
- Информация об источниках и документации, если применимо
- Подробности выполнения задания, включая время выполнения, [данные о времени выполнения моделей](/docs/deploy/run-visibility#model-timing) и [артефакты](/docs/deploy/artifacts)
- Подробные шаги выполнения с журналами и статусами шагов выполнения

Вы можете создать задание развертывания и настроить его для выполнения в [запланированные дни и время](#schedule-days), ввести [пользовательский cron-расписание](#cron-schedule) или [запустить задание после завершения другого задания](#trigger-on-job-completion).

## Предварительные требования

- У вас должна быть [учетная запись dbt Cloud](https://www.getdbt.com/signup/) и [лицензия на место разработчика](/docs/cloud/manage-access/seats-and-users).
    - Для функции [Запуск по завершению задания](#trigger-on-job-completion) ваша учетная запись dbt Cloud должна быть на [плане Team или Enterprise](https://www.getdbt.com/pricing/).
- У вас должен быть проект dbt, подключенный к [платформе данных](/docs/cloud/connect-data-platform/about-connections).
- У вас должны быть [разрешения на доступ](/docs/cloud/manage-access/about-user-access) для просмотра, создания, изменения или выполнения заданий.
- Вы должны настроить [окружение развертывания](/docs/deploy/deploy-environments).

## Создание и планирование заданий {#create-and-schedule-jobs}

1. На странице вашего окружения развертывания нажмите **Create job** > **Deploy job**, чтобы создать новое задание развертывания.
2. Опции в разделе **Job settings**:
    - **Job name** &mdash; Укажите имя для задания развертывания. Например, `Daily build`.
    - (Необязательно) **Description** &mdash; Укажите описание того, что делает задание (например, что задание потребляет и что производит).
    - **Environment** &mdash; По умолчанию установлено на окружение развертывания, из которого вы создали задание развертывания.
3. Опции в разделе **Execution settings**:
    - **Commands** &mdash; По умолчанию включает команду `dbt build`. Нажмите **Add command**, чтобы добавить больше [команд](/docs/deploy/job-commands), которые вы хотите вызвать при выполнении задания.
    - **Generate docs on run** &mdash; Включите эту опцию, если хотите [генерировать документацию проекта](/docs/collaborate/build-and-view-your-docs) при выполнении этого задания развертывания.
    - **Run source freshness** &mdash; Включите эту опцию, чтобы вызвать команду `dbt source freshness` перед выполнением задания развертывания. Подробнее см. в разделе [Актуальность источников](/docs/deploy/source-freshness).
4. Опции в разделе **Triggers**:
    - **Run on schedule** &mdash; Выполнять задание развертывания по установленному расписанию.
        - **Timing** &mdash; Укажите, следует ли [планировать](#schedule-days) задание развертывания с использованием **Интервалов**, которые запускают задание каждые указанное количество часов, **Определенные часы**, которые запускают задание в определенное время дня, или **Cron-расписание**, которое запускает задание, указанное с использованием [синтаксиса cron](#cron-schedule).
        - **Days of the week** &mdash; По умолчанию установлено на каждый день, когда для **Timing** выбраны **Интервалы** или **Определенные часы**.
    - **Run when another job finishes** &mdash; Выполнять задание развертывания, когда другое _вышестоящее_ задание развертывания [завершается](#trigger-on-job-completion).
        - **Project** &mdash; Укажите родительский проект, в котором находится это вышестоящее задание развертывания.
        - **Job** &mdash; Укажите вышестоящее задание развертывания.
        - **Completes on** &mdash; Выберите статус(ы) выполнения задания, которые будут [поставлены в очередь](/docs/deploy/job-scheduler#scheduler-queue) для задания развертывания.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-triggers-section.png" width="90%" title="Пример триггеров на странице задания развертывания"/>

5. (Необязательно) Опции в разделе **Advanced settings**:
    - **Environment variables** &mdash; Определите [переменные окружения](/docs/build/environment-variables), чтобы настроить поведение вашего проекта при выполнении задания развертывания.
    - **Target name** &mdash; Определите [имя цели](/docs/build/custom-target-names), чтобы настроить поведение вашего проекта при выполнении задания развертывания. Переменные окружения и имена целей часто используются взаимозаменяемо.
    - **Run timeout** &mdash; Отменить задание развертывания, если время выполнения превышает значение тайм-аута.
    - **Compare changes against** &mdash; По умолчанию установлено на **No deferral**. Выберите либо **Environment**, либо **This Job**, чтобы dbt Cloud знал, с чем сравнивать изменения.

    :::info
    Более старые версии dbt Cloud позволяют откладывать только на конкретное задание вместо окружения. Откладывание на задание сравнивает состояние с кодом проекта, который был выполнен в последнем успешном запуске отложенного задания. В то время как откладывание на окружение более эффективно, так как dbt Cloud будет сравнивать с представлением проекта (которое хранится в `manifest.json`) последнего успешного выполнения задания развертывания, выполненного в отложенном окружении. Учитывая _все_ задания развертывания, выполняемые в отложенном окружении, dbt Cloud получит более точное, актуальное состояние представления проекта.
    :::

    - **dbt version** &mdash; По умолчанию установлено на наследование [версии dbt](/docs/dbt-versions/core) из окружения. dbt Labs настоятельно рекомендует не изменять настройку по умолчанию. Эта опция изменения версии на уровне задания полезна только при обновлении проекта до следующей версии dbt; в противном случае несоответствие версий между окружением и заданием может привести к запутанному поведению.
    - **Threads** &mdash; По умолчанию установлено на 4 [потока](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Увеличьте количество потоков, чтобы увеличить параллельность выполнения моделей.

    <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/deploy-job-adv-settings.png" width="90%" title="Пример расширенных настроек на странице задания развертывания"/>

### Дни расписания

Чтобы установить расписание вашего задания, используйте опцию **Run on schedule**, чтобы выбрать конкретные дни недели и выбрать настраиваемые часы или интервалы.

В разделе **Timing** вы можете использовать регулярные интервалы для заданий, которые нужно запускать часто в течение дня, или настраиваемые часы для заданий, которые нужно запускать в определенное время:

- **Интервалы** &mdash; Используйте эту опцию, чтобы установить, как часто выполняется ваше задание, в часах. Например, если вы выберете **Каждые 2 часа**, задание будет выполняться каждые 2 часа с полуночи по UTC. Это не означает, что оно будет выполняться ровно в полночь по UTC. Однако последующие запуски всегда будут выполняться с одинаковым промежутком времени между ними. Например, если предыдущий запланированный конвейер выполнялся в 00:04 по UTC, следующий запуск будет в 02:04 по UTC. Эта опция полезна, если вам нужно выполнять задания несколько раз в день с регулярными интервалами.

- **Определенные часы** &mdash; Используйте эту опцию, чтобы установить конкретное время, когда должно выполняться ваше задание. Вы можете ввести список часов (в UTC), разделенных запятыми, когда вы хотите, чтобы задание выполнялось. Например, если вы установите `0,12,23,`, задание будет выполняться в полночь, в полдень и в 11 вечера по UTC. Запуски заданий всегда будут согласованы как по часам, так и по дням, поэтому, если ваше задание выполняется в 00:05, 12:05 и 23:05 по UTC, оно будет выполняться в эти же часы каждый день. Эта опция полезна, если вы хотите, чтобы ваши задания выполнялись в определенное время дня и не нужно, чтобы они выполнялись чаще, чем раз в день.

:::info

dbt Cloud использует [Координированное всемирное время](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) (UTC) и не учитывает переводы на ваш конкретный часовой пояс или переход на летнее время. Например:

- 0 означает 12 часов ночи (полночь) по UTC
- 12 означает 12 часов дня (полдень) по UTC
- 23 означает 11 часов вечера по UTC

:::

### Cron-расписание

Чтобы полностью настроить расписание вашего задания, выберите опцию **Cron schedule** и используйте синтаксис cron. С помощью этого синтаксиса вы можете указать минуту, час, день месяца, месяц и день недели, что позволяет вам настроить сложные расписания, такие как выполнение задания в первый понедельник каждого месяца.

**Частота Cron**

Для повышения производительности частота планирования заданий варьируется в зависимости от плана dbt Cloud:

- Планы разработчиков: dbt Cloud устанавливает минимальный интервал в каждые 10 минут для планирования заданий. Это означает, что планирование заданий для выполнения чаще, или с интервалом менее 10 минут, не поддерживается.
- Планы Team и Enterprise: Нет ограничений на частоту выполнения заданий.

**Примеры**

Используйте инструменты, такие как [crontab.guru](https://crontab.guru/), чтобы сгенерировать правильный синтаксис cron. Этот инструмент позволяет вводить фрагменты cron и возвращать их переводы на простой английский. Планировщик заданий dbt Cloud поддерживает использование `L` для планирования заданий на последний день месяца.

Примеры расписаний cron-заданий:

- `0 * * * *`: Каждый час, в минуту 0.
- `*/5 * * * *`: Каждые 5 минут. (Недоступно в планах разработчиков)
- `5 4 * * *`: Ровно в 4:05 утра по UTC.
- `30 */4 * * *`: В минуту 30 каждого 4-го часа (например, 4:30 утра, 8:30 утра, 12:30 дня и так далее, все по UTC).
- `0 0 */2 * *`: В 12:00 ночи (полночь) по UTC через день.
- `0 0 * * 1`: В полночь по UTC каждый понедельник.
- `0 0 L * *`: В 12:00 ночи (полночь) в последний день месяца.
- `0 0 L 1,2,3,4,5,6,8,9,10,11,12 *`: В 12:00 ночи в последний день месяца, только в январе, феврале, марте, апреле, мае, июне, августе, сентябре, октябре, ноябре и декабре.
- `0 0 L 7 *`: В 12:00 ночи в последний день месяца, только в июле.
- `0 0 L * FRI,SAT`: В 12:00 ночи в последний день месяца и в пятницу и субботу.
- `0 12 L * *`: В 12:00 дня (полдень) в последний день месяца.
- `0 7 L * 5`: В 07:00 утра в последний день месяца и в пятницу.
- `30 14 L * *`: В 02:30 дня в последний день месяца.

### Запуск по завершению задания <Lifecycle status="team,enterprise" />

Чтобы _связать_ задания развертывания вместе:
1. В разделе **Triggers** включите опцию **Run when another job finishes**.
2. Выберите проект, в котором находится задание развертывания, которое вы хотите запустить после завершения.
3. Укажите вышестоящее (родительское) задание, которое при завершении запустит ваше задание.
   - Вы также можете использовать [API создания задания](/dbt-cloud/api-v2#/operations/Create%20Job) для этого.
4. В опции **Completes on** выберите статус(ы) выполнения задания, которые будут [поставлены в очередь](/docs/deploy/job-scheduler#scheduler-queue) для задания развертывания.

<Lightbox src="/img/docs/deploy/deploy-job-completion.jpg" width="100%" title="Пример запуска по завершению задания на странице задания развертывания"/>

5. Вы можете настроить конфигурацию, в которой вышестоящее задание запускает несколько нижестоящих (дочерних) заданий и заданий в других проектах. У вас должны быть соответствующие [разрешения](/docs/cloud/manage-access/enterprise-permissions#project-role-permissions) на проект и задание для настройки триггера.

Если другое задание запускает ваше задание, вы можете найти ссылку на вышестоящее задание в [разделе деталей выполнения](/docs/deploy/run-visibility#job-run-details).

## Связанные документы

- [Артефакты](/docs/deploy/artifacts)
- [Задания непрерывной интеграции (CI)](/docs/deploy/ci-jobs)
- [Вебхуки](/docs/deploy/webhooks)