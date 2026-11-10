---
title: "Интеграции аккаунта в dbt"
sidebar_label: "Интеграции аккаунта"
description: "Узнайте, как настроить интеграции аккаунта для вашей учетной записи dbt."
availability:
  surface: platform
  access: login_required
---

В следующих разделах описаны различные **интеграции аккаунта**, доступные для вашей учетной записи <Constant name="dbt" /> в разделе **Settings** аккаунта.

<Lightbox src="/img/docs/dbt-platform/account-integrations.png" title="Пример раздела интеграций аккаунта на боковой панели" /> 

## Интеграции с Git {#git-integrations}

Подключите свою учетную запись <Constant name="dbt" /> к провайдеру <Constant name="git" />, чтобы пользователи <Constant name="dbt" /> могли аутентифицировать ваши персональные учетные записи. <Constant name="dbt" /> будет выполнять действия в <Constant name="git" /> от вашего имени — в репозиториях, к которым у вас есть доступ в соответствии с правами вашего провайдера <Constant name="git" />.

Чтобы настроить интеграцию учетной записи <Constant name="git" />:
1. Перейдите в **Account settings** в боковом меню.
2. В разделе **Settings** нажмите **Integrations**.
3. Выберите провайдера <Constant name="git" /> из списка и нажмите на иконку **Pencil** справа от провайдера.
4. <Constant name="dbt" /> [напрямую подключается](/docs/platform/git/configure-git) к следующим провайдерам <Constant name="git" />:

   - [GitHub](/docs/platform/git/connect-github)
     - Аккаунты Enterprise и Enterprise+ могут использовать [собственное приложение GitHub](/docs/platform/git/connect-github#custom-github-application) вместо общего.
   - [GitLab](/docs/platform/git/connect-gitlab)
   - [Azure DevOps](/docs/platform/git/connect-azure-devops) <Lifecycle status="managed,managed_plus" />

Вы можете подключить свой аккаунт <Constant name="dbt" /> к другим провайдерам <Constant name="git" />, импортировав репозиторий git по любому допустимому URL git. Дополнительную информацию см. в разделе [Импорт репозитория git](/docs/platform/git/import-a-project-by-git-url).

<Lightbox src="/img/docs/dbt-platform/account-integration-git.png" width="85%" title="Пример страницы интеграции с Git" />

## Интеграции с OAuth {#oauth-integrations}

Подключите свою учетную запись <Constant name="dbt" /> к OAuth‑провайдеру, который интегрирован с <Constant name="dbt" />.

Чтобы настроить интеграцию учетной записи через OAuth:
1. Перейдите в **Account settings** в боковом меню.
2. В разделе **Settings** нажмите **Integrations**.
3. В разделе **OAuth** нажмите **Link**, чтобы [подключить вашу учетную запись Slack](/docs/deploy/job-notifications#set-up-the-slack-integration).
4. Для пользовательских провайдеров OAuth в разделе **Пользовательские интеграции OAuth** нажмите **Добавить интеграцию** и выберите [провайдера OAuth](/docs/platform/manage-access/sso-overview) из списка. Заполните обязательные поля и нажмите **Сохранить**.

<Lightbox src="/img/docs/dbt-platform/account-integration-oauth.png" width="85%" title="Пример страницы интеграции с OAuth" />
