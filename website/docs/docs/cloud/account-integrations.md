---
title: "Интеграции аккаунта в dbt"
sidebar_label: "Интеграции аккаунта"
description: "Узнайте, как настроить интеграции аккаунта для вашей учетной записи dbt."
---

В следующих разделах описаны различные **интеграции аккаунта**, доступные для вашей учетной записи <Constant name="cloud" /> в разделе **Settings** аккаунта.

<Lightbox src="/img/docs/dbt-cloud/account-integrations.png" title="Пример раздела Account integrations в боковой панели" />

## Интеграции с Git

Подключите свою учетную запись <Constant name="cloud" /> к провайдеру <Constant name="git" />, чтобы пользователи <Constant name="cloud" /> могли аутентифицировать ваши персональные учетные записи. <Constant name="cloud" /> будет выполнять действия в <Constant name="git" /> от вашего имени — в репозиториях, к которым у вас есть доступ в соответствии с правами вашего провайдера <Constant name="git" />.

Чтобы настроить интеграцию учетной записи <Constant name="git" />:
1. Перейдите в **Account settings** в боковом меню.
2. В разделе **Settings** нажмите **Integrations**.
3. Выберите провайдера <Constant name="git" /> из списка и нажмите на иконку **Pencil** справа от провайдера.
4. <Constant name="cloud" /> [напрямую подключается](/docs/cloud/git/git-configuration-in-dbt-cloud) к следующим провайдерам <Constant name="git" />:

   - [GitHub](/docs/cloud/git/connect-github)
   - [GitLab](/docs/cloud/git/connect-gitlab)
   - [Azure DevOps](/docs/cloud/git/connect-azure-devops) <Lifecycle status="managed,managed_plus" />

Вы можете подключить свой аккаунт <Constant name="cloud" /> к дополнительным провайдерам <Constant name="git" />, импортировав git‑репозиторий по любому допустимому git URL. Подробнее см. раздел [Import a git repository](/docs/cloud/git/import-a-project-by-git-url).

<Lightbox src="/img/docs/dbt-cloud/account-integration-git.png" width="85%" title="Пример страницы интеграции с Git" />

## Интеграции с OAuth

Подключите свою учетную запись <Constant name="cloud" /> к OAuth‑провайдеру, который интегрирован с <Constant name="cloud" />.

Чтобы настроить интеграцию учетной записи через OAuth:
1. Перейдите в **Account settings** в боковом меню.
2. В разделе **Settings** нажмите **Integrations**.
3. В разделе **OAuth** нажмите **Link**, чтобы [подключить вашу учетную запись Slack](/docs/deploy/job-notifications#set-up-the-slack-integration).
4. Для пользовательских OAuth‑провайдеров в разделе **Custom OAuth integrations** нажмите **Add integration** и выберите [OAuth provider](/docs/cloud/manage-access/sso-overview) из списка. Заполните обязательные поля и нажмите **Save**.

<Lightbox src="/img/docs/dbt-cloud/account-integration-oauth.png" width="85%" title="Пример страницы интеграции OAuth" />
