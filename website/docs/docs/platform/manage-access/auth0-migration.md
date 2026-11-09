---
title: "Миграция на Auth0 для SSO"
id: "auth0-migration"
sidebar: "SSO Auth0 Migration"
description: "Необходимые действия для перехода на Auth0 при использовании сервисов SSO в dbt."
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Переход на Auth0 для SSO

dbt Labs сотрудничает с Auth0, чтобы расширить возможности единого входа (SSO) в <Constant name="dbt" />. Auth0 — это платформа управления идентификацией и доступом (IAM) с расширенными функциями безопасности, которую будет использовать <Constant name="dbt" />. Эти изменения потребуют определённых действий от клиентов, у которых уже настроен SSO в <Constant name="dbt" />. В этом руководстве описаны необходимые изменения для каждой среды. 

Если вы ещё не настроили SSO в <Constant name="dbt" />, обратитесь к нашим руководствам по настройке единого входа через [SAML](/docs/platform/manage-access/set-up-sso-saml-2.0), [Okta](/docs/platform/manage-access/set-up-sso-okta), [Google Workspace](/docs/platform/manage-access/set-up-sso-google-workspace) или [Microsoft Entra ID (ранее Azure AD)](/docs/platform/manage-access/set-up-sso-microsoft-entra-id).

## Начало миграции {#start-the-migration}

Функция миграции Auth0 постепенно становится доступной для клиентов, у которых уже включены возможности SSO. Когда опция миграции будет включена для вашей учетной записи, вы увидите **SSO Update Required** в правой части верхнего меню, рядом с иконкой настроек.

Также вы можете начать процесс, нажав на имя своей учетной записи в меню в левом нижнем углу и перейдя в раздел **Account settings** > **SSO & SCIM**. Нажмите кнопку **Begin Migration**, чтобы начать.

:::warning vanity urls

Не используйте vanity URL при настройке параметров SSO. Необходимо использовать универсальный URL, указанный в настройках SSO для вашей среды. Например, если ваш vanity URL — `cloud.MY_COMPANY.getdbt.com`, в качестве `<YOUR_AUTH0_URI>` нужно указать `auth.cloud.getdbt.com`.

:::

В настройках SSO есть два поля, которые понадобятся вам для миграции:
- **Single sign-on URL:** будет иметь формат URL для входа  
  `https://<YOUR_AUTH0_URI>/login/callback?connection=<SLUG>`
- **Audience URI (SP Entity ID):** будет иметь формат  
  `urn:auth0:<YOUR_AUTH0_ENTITYID>:<SLUG>`

После того как вы выберете начало процесса миграции, дальнейшие шаги будут зависеть от настроенного провайдера идентификации. Вы можете сразу перейти к разделу, который соответствует вашей среде. Эти шаги применимы только для клиентов, проходящих миграцию; для новых конфигураций используются существующие [инструкции по настройке](/docs/platform/manage-access/sso-overview).

## SAML 2.0 {#saml-20}

После того как вы решите начать процесс миграции, дальнейшие шаги будут зависеть от настроенного поставщика удостоверений. Вы можете сразу перейти к разделу, соответствующему вашей среде. Эти шаги предназначены только для клиентов, выполняющих миграцию; для новых конфигураций следует использовать существующие [инструкции по настройке](/docs/platform/manage-access/sso-overview).

### SAML 2.0 и Okta {#saml-20-and-okta}

Поля Okta, которые будут обновлены:
- Single sign-on URL &mdash; `https://<YOUR_AUTH0_URI>/login/callback?connection=<SLUG>`
- Audience URI (SP Entity ID) &mdash; `urn:auth0:<YOUR_AUTH0_ENTITYID>:<SLUG>`

Ниже приведены примерные шаги по обновлению. Необходимо выполнить их все, чтобы обеспечить бесперебойный доступ к <Constant name="dbt" />, и согласовать эти изменения с администратором вашего поставщика удостоверений.

1. Замените `<SLUG>` на slug URL входа вашей учётной записи.

Вот пример обновленной настройки SAML 2.0 в Okta.

<Lightbox src="/img/docs/dbt-platform/access-control/new-okta-config.png" title="Конфигурация Okta с новым URL"/>

2. Сохраните конфигурацию, и ваши настройки SAML будут выглядеть примерно так:

<Lightbox src="/img/docs/dbt-platform/access-control/new-okta-completed.png" title="Настройка новой конфигурации Okta завершена"/>

3. Переключите параметр `Enable new SSO authentication`, чтобы убедиться, что трафик маршрутизируется корректно. _Миграция на новый механизм SSO является окончательной и не может быть отменена._

4. Сохраните настройки и протестируйте новую конфигурацию, используя URL для входа SSO, предоставленный на странице настроек.

### SAML 2.0 and Entra ID {#saml-20-and-entra-id}

Поля Entra ID, которые будут обновлены:
- Single sign-on URL &mdash; `https://<YOUR_AUTH0_URI>/login/callback?connection=<SLUG>`
- Audience URI (SP Entity ID) &mdash; `urn:auth0:<YOUR_AUTH0_ENTITYID>:<SLUG>`

Новые значения этих полей можно найти в <Constant name="dbt" />, перейдя в **Account settings** > **SSO & SCIM**.

1. Замените `<SLUG>` на слаг URL входа вашей организации.

2. Найдите приложение <Constant name="dbt" /> SAML2.0 в разделе **Enterprise applications** в Azure. Нажмите **Single sign-on** в меню слева.

3. Отредактируйте блок **Basic SAML configuration** и введите значения из вашей учетной записи:
    - Entra ID **Identifier (Entity ID)** = <Constant name="dbt" /> **Audience URI (SP Entity ID)**
    - Entra ID **Reply URL (Assertion Consumer Service URL)** = <Constant name="dbt" /> **Single sign-on URL**

    <Lightbox src="/img/docs/dbt-platform/access-control/edit-entra-saml.png" width="90%" title="Editing the SAML configuration window in Entra ID"/>

4. Сохраните поля, и завершенная конфигурация будет выглядеть примерно так:

    <Lightbox src="/img/docs/dbt-platform/access-control/entra-id-saml.png" width="90%" title="Completed configuration of the SAML fields in Entra ID"/>

3. Включите параметр `Enable new SSO authentication`, чтобы обеспечить корректную маршрутизацию трафика. _Новое действие миграции SSO является окончательным и не может быть отменено._

4. Сохраните настройки и протестируйте новую конфигурацию, используя URL входа SSO, указанный на странице настроек.

## Microsoft Entra ID {#microsoft-entra-id}

Microsoft Entra ID admins using OpenID Connect (ODIC) will need to make a slight adjustment to the existing authentication app in the Azure portal. This migration does not require that the entire app be deleted or recreated; you can edit the existing app. Start by opening the Azure portal and navigating to the Microsoft Entra ID overview.

Ниже приведены шаги по обновлению. Необходимо выполнить их все, чтобы обеспечить бесперебойный доступ к <Constant name="dbt" />, а при внесении этих изменений следует координировать действия с администратором вашего поставщика удостоверений.

1. Нажмите **App Registrations** в меню слева.

<Lightbox src="/img/docs/dbt-platform/access-control/aad-app-registration.png" title="Select App Registrations"/>

2. Выберите нужное приложение **<Constant name="dbt" />** (название может отличаться) из списка. На странице обзора приложения нажмите на гиперссылку рядом с **Redirect URI**

<Lightbox src="/img/docs/dbt-platform/access-control/app-overview.png" title="Click the Redirect URI hyperlink"/>

3. В панели **Web** с **Redirect URIs** нажмите **Add URI** и введите соответствующий `https://<YOUR_AUTH0_URI>/login/callback`. Сохраните настройки и убедитесь, что он учтен в обновленном обзоре приложения.

<Lightbox src="/img/docs/dbt-platform/access-control/redirect-URI.png" title="Enter new redirect URI"/>

4. Перейдите в среду <Constant name="dbt" /> и откройте **Account settings** (Настройки аккаунта). Выберите **SSO & SCIM** в меню слева и нажмите **Edit** (Изменить) в правой части панели SSO. В поле **domain** укажите домен, который ваша организация использует для входа в Microsoft Entra ID. Включите параметр **Enable New SSO Authentication** (Включить новую аутентификацию SSO) и нажмите **Save** (Сохранить). _После включения этого параметра отключить его будет невозможно._

:::warning Domain authorization

Вы должны завершить авторизацию домена до того, как включите `Enable New SSO Authentication`, иначе миграция не будет успешно завершена.

:::


## Google Workspace {#google-workspace}

Администраторам Google Workspace, обновляющим свои SSO API с URL Auth0, не придется делать много, если это существующая настройка. Это можно сделать как новый проект или отредактировав существующую настройку SSO. Дополнительные области не требуются, так как это миграция из существующей настройки. Все области были определены во время первоначальной конфигурации.

Ниже приведены шаги для обновления настроек. Чтобы обеспечить бесперебойный доступ к <Constant name="dbt" />, необходимо выполнить все шаги. При внесении этих изменений следует координировать действия с администратором вашего провайдера удостоверений.

1. Откройте [консоль Google Cloud](https://console.cloud.google.com/) и выберите проект с настройками единого входа для <Constant name="dbt" />. В разделе **Quick Access** на странице проекта выберите **APIs and Services**

<Lightbox src="/img/docs/dbt-platform/access-control/google-cloud-sso.png" title="Консоль Google Cloud"/>

2. Нажмите **Учетные данные** в левой панели и выберите соответствующее имя из **OAuth 2.0 Client IDs**

<Lightbox src="/img/docs/dbt-platform/access-control/sso-project.png" title="Выберите идентификатор клиента OAuth 2.0"/>

3. В окне **Client ID for Web application** найдите поле **Authorized Redirect URIs** и нажмите **Add URI**, затем введите `https://<YOUR_AUTH0_URI>/login/callback`.

Нажмите **Сохранить**, когда закончите.

4. _Для выполнения этих действий в <Constant name="dbt" /> потребуется человек с правами администратора Google Workspace_. В <Constant name="dbt" /> перейдите в **Account settings**, нажмите **SSO & SCIM**, а затем — **Edit** в правой части панели **Single sign-on**. Включите параметр **Enable New SSO Authentication** и выберите **Save**. Откроется окно авторизации Google, в котором потребуется ввести учетные данные администратора. _Миграция необратима: отменить это действие невозможно_. После успешной аутентификации проверьте новую конфигурацию, используя URL для входа через SSO, указанный на странице настроек.

:::warning Авторизация домена

Вы должны завершить авторизацию домена до того, как переключите `Enable New SSO Authentication`, иначе миграция не будет успешно завершена.

:::

