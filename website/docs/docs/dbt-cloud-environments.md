---
title: "Окружения dbt"
id: "dbt-cloud-environments"
description: "Узнайте о среде разработки dbt для выполнения вашего проекта в IDE"
pagination_next: "docs/cloud/migration"
---

Окружение определяет, как <Constant name="cloud" /> будет выполнять ваш проект в [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) или через [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation) (для разработки), а также в запланированных заданиях (для деплоя).

Критически важно, что для выполнения dbt окружения определяют три переменные:

1. Версию <Constant name="core" />, которая будет использоваться для запуска вашего проекта
2. Параметры подключения к хранилищу данных (включая настройки целевой базы данных и схемы)
3. Версию вашего кода, которая будет выполняться

Каждый проект <Constant name="cloud" /> может иметь только одно [окружение разработки](#create-a-development-environment), однако количество [окружений деплоя](/docs/deploy/deploy-environments) не ограничено. Это обеспечивает гибкость и возможность тонкой настройки выполнения запланированных заданий.

Используйте окружения для настройки параметров на разных этапах жизненного цикла проекта и для упрощения процесса выполнения, применяя принципы программной инженерии.

<Lightbox src="/img/dbt-env.png" width="90%" title="Иерархия окружений dbt, показывающая проекты, окружения, подключения и задания оркестрации." />

В следующих разделах подробно описаны различные типы окружений и показано, как интуитивно настроить окружение разработки в <Constant name="cloud" />.

import CloudEnvInfo from '/snippets/_cloud-environments-info.md';

<CloudEnvInfo setup={'/snippets/_cloud-environments-info.md'} />

## Создание окружения разработки {#create-a-development-environment}

Чтобы создать новое окружение разработки <Constant name="cloud" />:

1. Перейдите в **Deploy** -> **Environments**
2. Нажмите **Create Environment**
3. Выберите **Development** в качестве типа окружения
4. Заполните поля в разделах **General Settings** и **Development Credentials**
5. Нажмите **Save**, чтобы создать окружение

### Настройка учетных данных разработчика {#set-developer-credentials}

Для использования dbt <Constant name="cloud_ide" /> или <Constant name="cloud_cli" /> каждому разработчику необходимо настроить [персональные учетные данные для разработки](/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-cloud-ide) для подключения к хранилищу данных в разделе **Profile Settings**. Это позволяет задавать отдельные целевые параметры и поддерживать индивидуальные учетные данные для подключения к вашему хранилищу данных.

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/new-development-environment-fields.png" width="85%" height="200" title="Создание окружения разработки" />

## Окружение деплоя {#deployment-environment}

Окружения деплоя в <Constant name="cloud" /> необходимы для выполнения запланированных заданий и использования других возможностей (например, разных рабочих пространств для разных задач). В рамках одного проекта <Constant name="cloud" /> вы можете иметь множество окружений, что позволяет настраивать каждое пространство под разные цели (например, для экспериментов или тестирования).

Несмотря на то что окружений может быть много, только одно из них может быть «основным» окружением деплоя. Оно считается вашим «production»-окружением и представляет собой «источник истины» проекта — то есть место, где находятся самые надежные и финальные преобразования данных.

Чтобы узнать больше об окружениях деплоя <Constant name="cloud" /> и их настройке, ознакомьтесь со страницей [Deployment environments](/docs/deploy/deploy-environments). Также рекомендуем прочитать руководство по лучшим практикам — [<Constant name="cloud" /> environment best practices](/guides/set-up-ci).

## Удаление окружения {#delete-an-environment}

import DeleteEnvironment from '/snippets/_delete-environment.md';

<DeleteEnvironment />

import JobMonitoring from '/snippets/_in-progress-top-jobs.md';

<JobMonitoring />

## История настроек окружения {#environment-settings-history}

Вы можете просматривать историю изменений настроек окружения за последние 90 дней.

Чтобы посмотреть историю изменений:
1. В главном меню перейдите в **Orchestration** и выберите **Environments**
2. Нажмите на **название окружения**
3. Перейдите в **Settings**
4. Нажмите **History**

<Lightbox src="/img/docs/deploy/environment-history.png" width="85%" title="Пример опции просмотра истории окружения." />
