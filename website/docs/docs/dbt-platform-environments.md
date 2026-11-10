---
title: "Окружения dbt"
id: "dbt-platform-environments"
description: "Узнайте об окружении разработки dbt для выполнения проекта в IDE"
pagination_next: "docs/platform/migration"
availability: platform_login
---

Окружение определяет, как <Constant name="dbt" /> будет выполнять ваш проект в [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) или [<Constant name="dbt" /> CLI](/docs/platform/dbt-cli-installation) (для разработки), а также в заданиях, запускаемых по расписанию (для развертывания).

Для выполнения dbt окружения определяют три ключевых параметра:

1. Версию <Constant name="dbt" />, которая будет использоваться для выполнения проекта
2. Данные подключения к хранилищу (включая настройки целевой базы данных/схемы)
3. Версию кода, которая будет выполняться

В каждом проекте <Constant name="dbt" /> может быть только одно [окружение разработки](#create-a-development-environment), но количество [окружений развертывания](/docs/deploy/deploy-environments) не ограничено, что позволяет гибко настраивать выполнение заданий по расписанию. 

Используйте окружения, чтобы адаптировать настройки к различным этапам работы над проектом и оптимизировать процесс выполнения, применяя принципы разработки программного обеспечения. 

<Lightbox src="/img/dbt-env.png" width="90%" title="Иерархия окружений dbt: проекты, окружения, подключения и задания оркестрации." />

В следующих разделах подробно описаны различные типы окружений и порядок настройки окружения разработки в <Constant name="dbt" />. 

import CloudEnvInfo from '/snippets/_cloud-environments-info.md';

<CloudEnvInfo setup={'/snippets/_cloud-environments-info.md'} />

## Создание окружения разработки {#create-a-development-environment}

Чтобы создать новое окружение разработки <Constant name="dbt" />:

1. Перейдите в **Orchestration** > **Environments**.
2. Нажмите **+ Create Environment**.
3. Выберите **Development** в качестве типа окружения. Для одного проекта можно создать только одно окружение Development.
4. Заполните поля в разделах **Environment settings** и **User credentials**.
5. (Необязательно) Если в вашем аккаунте включена функция dbt State, появится параметр **Enable dbt State**. Включите его, чтобы сократить количество ненужных повторных сборок узлов. Подробнее см. в разделе [Включение dbt State в Studio](/docs/deploy/dbt-state-enable-studio#enabling-dbt-state-on-a-development-environment).
6. Нажмите **Save**, чтобы создать окружение.

<Lightbox src="/img/docs/dbt-platform/refresh-ide/new-development-environment-fields.png" width="85%" height="200" title="Создание окружения разработки"/>

<a id="set-developer-credentials" />

### Настройка учетных данных пользователя {#set-user-credentials}

Для работы с dbt <Constant name="studio_ide" /> или <Constant name="platform_cli" /> каждому разработчику необходимо настроить [личные учетные данные](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) для подключения к хранилищу. Нажмите на имя своего аккаунта в левом нижнем углу, выберите **Your profile**, затем перейдите в раздел **Credentials**. Это позволяет отдельно настроить целевую базу данных и схему и использовать индивидуальные учетные данные для подключения к хранилищу.
## Окружение развертывания {#deployment-environment}

Окружения развертывания в <Constant name="dbt" /> необходимы для выполнения заданий по расписанию и использования других возможностей (например, отдельных рабочих пространств для разных задач). В одном проекте <Constant name="dbt" /> может быть несколько окружений, что позволяет настроить каждое из них под определенные потребности (например, для экспериментов или тестирования).

Несмотря на возможность иметь несколько окружений, только одно из них может быть «основным» окружением развертывания. Оно считается вашим «производственным» окружением и представляет собой «источник истины» проекта: именно в нем находятся наиболее надежные и окончательные преобразования данных.

Подробнее об окружениях развертывания <Constant name="dbt" /> и их настройке см. на странице [Окружения развертывания](/docs/deploy/deploy-environments). Рекомендации по их использованию приведены в руководстве [Рекомендации по работе с окружениями <Constant name="dbt" />](/guides/set-up-ci).

## Изменение настроек окружения {#change-environment-settings}

import ChangeEnvironment from '/snippets/_change-environment.md';

<ChangeEnvironment />

## Удаление окружения {#delete-an-environment}

import DeleteEnvironment from '/snippets/_delete-environment.md';

<DeleteEnvironment />

import JobMonitoring from '/snippets/_in-progress-top-jobs.md';

<JobMonitoring />

## История настроек окружения {#environment-settings-history}

Вы можете просмотреть историю изменений настроек окружения за последние 90 дней.

Чтобы просмотреть историю изменений: 
1. В главном меню перейдите в **Orchestration** и нажмите **Environments**. 
2. Нажмите на **название окружения**.
3. Нажмите **Settings**. 
4. Нажмите **History**. 

<Lightbox src="/img/docs/deploy/environment-history.png" width="85%" title="Пример элемента интерфейса для просмотра истории окружения." />
