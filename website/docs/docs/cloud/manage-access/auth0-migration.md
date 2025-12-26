---
title: "Миграция на Auth0 для SSO"
id: "auth0-migration"
sidebar: "SSO Auth0 Migration"
description: "Необходимые действия для миграции на Auth0 для сервисов единого входа (SSO) в dbt."
---

# Миграция на Auth0 для SSO <Lifecycle status="managed,managed_plus" />

dbt Labs сотрудничает с Auth0, чтобы предоставить расширенные возможности для единого входа (SSO) в <Constant name="cloud" />. Auth0 — это платформа управления идентификацией и доступом (IAM) с расширенными функциями безопасности, которая будет использоваться в <Constant name="cloud" />. Эти изменения потребуют определённых действий со стороны клиентов, у которых SSO уже настроен в <Constant name="cloud" />, и в этом руководстве описаны необходимые шаги для каждого окружения.

Если вы ещё не настроили SSO в <Constant name="cloud" />, вместо этого обратитесь к нашим руководствам по настройке единого входа для [SAML](/docs/cloud/manage-access/set-up-sso-saml-2.0), [Okta](/docs/cloud/manage-access/set-up-sso-okta), [Google Workspace](/docs/cloud/manage-access/set-up-sso-google-workspace) или [Microsoft Entra ID (formerly Azure AD)](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id).

## Начало миграции

Функция миграции Auth0 постепенно становится доступной для клиентов, у которых уже включены возможности SSO. Когда опция миграции будет включена для вашей учетной записи, вы увидите **SSO Update Required** в правой части верхнего меню, рядом с иконкой настроек.

Также вы можете начать процесс вручную: нажмите на имя вашей учетной записи в нижнем левом меню и перейдите в **Account settings** > **Single sign-on**. Нажмите кнопку **Begin Migration**, чтобы начать.

:::warning vanity urls

Не используйте vanity URL при настройке параметров SSO. Необходимо использовать универсальный URL, указанный в настройках SSO для вашей среды. Например, если ваш vanity URL — `cloud.MY_COMPANY.getdbt.com`, в качестве `<YOUR_AUTH0_URI>` нужно указать `auth.cloud.getdbt.com`.

:::

В настройках SSO есть два поля, которые понадобятся вам для миграции:
- **Single sign-on URL:** будет иметь формат URL для входа  
  `https://<YOUR_AUTH0_URI>/login/callback?connection=<SLUG>`
- **Audience URI (SP Entity ID):** будет иметь формат  
  `urn:auth0:<YOUR_AUTH0_ENTITYID>:<SLUG>`

После того как вы выберете начало процесса миграции, дальнейшие шаги будут зависеть от настроенного провайдера идентификации. Вы можете сразу перейти к разделу, который соответствует вашей среде. Эти шаги применимы только для клиентов, проходящих миграцию; для новых конфигураций используются существующие [инструкции по настройке](/docs/cloud/manage-access/sso-overview).

## SAML 2.0

Пользователи SAML 2.0 должны обновить несколько полей в конфигурации приложения SSO, чтобы они соответствовали новому URL и URI Auth0. Вы можете сделать это, отредактировав существующие настройки приложения SSO или создав новое для учета настроек Auth0. Один подход не является априори лучше другого, поэтому вы можете выбрать тот, который лучше всего подходит для вашей организации.

### SAML 2.0 и Okta

Поля Okta, которые будут обновлены:
- Single sign-on URL &mdash; `https://<YOUR_AUTH0_URI>/login/callback?connection=<SLUG>`
- Audience URI (SP Entity ID) &mdash; `urn:auth0:<YOUR_AUTH0_ENTITYID>:<SLUG>`

Ниже приведены примерные шаги по обновлению настроек. Вам необходимо выполнить **все** из них, чтобы обеспечить бесперебойный доступ к <Constant name="cloud" />, а также рекомендуется координировать эти изменения с администратором вашего провайдера удостоверений.

1. Замените `<SLUG>` на slug URL входа вашей учётной записи.

Вот пример обновленной настройки SAML 2.0 в Okta.

<Lightbox src="/img/docs/dbt-cloud/access-control/new-okta-config.png" title="Конфигурация Okta с новым URL"/>

2. Сохраните конфигурацию, и ваши настройки SAML будут выглядеть примерно так:

<Lightbox src="/img/docs/dbt-cloud/access-control/new-okta-completed.png" title="Новая конфигурация Okta завершена"/>

3. Переключите параметр `Enable new SSO authentication`, чтобы убедиться, что трафик маршрутизируется корректно. _Миграция на новый механизм SSO является окончательной и не может быть отменена._

4. Сохраните настройки и протестируйте новую конфигурацию, используя URL для входа SSO, предоставленный на странице настроек.

### SAML 2.0 and Entra ID

The Entra ID fields that will be updated are:
- Single sign-on URL &mdash; `https://<YOUR_AUTH0_URI>/login/callback?connection=<SLUG>`
- Audience URI (SP Entity ID) &mdash; `urn:auth0:<YOUR_AUTH0_ENTITYID>:<SLUG>`

The new values for these fields can be found in <Constant name="cloud" /> by navigating to **Account settting** --> **Single sign-on**.

1. Replace `<SLUG>` with your organization’s login URL slug. 

2. Locate your <Constant name="cloud" /> SAML2.0 app in the **Enterprise applications** section of Azure. Click **Single sign-on** on the left side menu.

3. Edit the **Basic SAML configuration** tile and enter the values from your account:
    - Entra ID **Identifier (Entity ID)** = <Constant name="cloud" /> **Audience URI (SP Entity ID)**
    - Entra ID **Reply URL (Assertion Consumer Service URL)** = <Constant name="cloud" /> **Single sign-on URL**

    <Lightbox src="/img/docs/dbt-cloud/access-control/edit-entra-saml.png" width="90%" title="Editing the SAML configuration window in Entra ID"/>

4. Save the fields and the completed configuration will look something like this: 

    <Lightbox src="/img/docs/dbt-cloud/access-control/entra-id-saml.png" width="90%" title="Completed configuration of the SAML fields in Entra ID"/>

3. Toggle the `Enable new SSO authentication` option to ensure the traffic is routed correctly. _The new SSO migration action is final and cannot be undone._

4. Save the settings and test the new configuration using the SSO login URL provided on the settings page.

## Microsoft Entra ID

Microsoft Entra ID admins using OpenID Connect (ODIC) will need to make a slight adjustment to the existing authentication app in the Azure portal. This migration does not require that the entire app be deleted or recreated; you can edit the existing app. Start by opening the Azure portal and navigating to the Microsoft Entra ID overview.

Below are steps to update. You must complete all of them to ensure uninterrupted access to <Constant name="cloud" /> and you should coordinate with your identity provider admin when making these changes.

1. Click **App Registrations** on the left side menu. 

<Lightbox src="/img/docs/dbt-cloud/access-control/aad-app-registration.png" title="Select App Registrations"/>

2. Select the proper **<Constant name="cloud" />** app (name may vary) from the list. From the app overview, click on the hyperlink next to **Redirect URI**

<Lightbox src="/img/docs/dbt-cloud/access-control/app-overview.png" title="Click the Redirect URI hyperlink"/>

3. In the **Web** pane with **Redirect URIs**, click **Add URI** and enter the appropriate `https://<YOUR_AUTH0_URI>/login/callback`. Save the settings and verify it is counted in the updated app overview.

<Lightbox src="/img/docs/dbt-cloud/access-control/redirect-URI.png" title="Enter new redirect URI"/>

4. Navigate to the <Constant name="cloud" /> environment and open the **Account Settings**. Click the **Single Sign-on** option from the left side menu and click the **Edit** option from the right side of the SSO pane. The **domain** field is the domain your organization uses to login to Microsoft Entra ID. Toggle the **Enable New SSO Authentication** option and **Save**. _Once this option is enabled, it cannot be undone._

:::warning Domain authorization

You must complete the domain authorization before you toggle `Enable New SSO Authentication`, or the migration will not complete successfully.

:::


## Google Workspace

Администраторам Google Workspace, обновляющим свои SSO API с URL Auth0, не придется делать много, если это существующая настройка. Это можно сделать как новый проект или отредактировав существующую настройку SSO. Дополнительные области не требуются, так как это миграция из существующей настройки. Все области были определены во время первоначальной конфигурации.

Ниже приведены шаги, которые необходимо выполнить. Вы должны выполнить **все** из них, чтобы обеспечить бесперебойный доступ к <Constant name="cloud" />, и при внесении этих изменений вам следует координировать действия с администратором вашего провайдера удостоверений.

1. Откройте [Google Cloud console](https://console.cloud.google.com/) и выберите проект с настройками единого входа (SSO) для <Constant name="cloud" />. На странице проекта в разделе **Quick Access** выберите **APIs and Services**.

<Lightbox src="/img/docs/dbt-cloud/access-control/google-cloud-sso.png" title="Консоль Google Cloud"/>

2. Нажмите **Учетные данные** в левой панели и выберите соответствующее имя из **OAuth 2.0 Client IDs**

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-project.png" title="Выберите OAuth 2.0 Client ID"/>

3. В окне **Client ID for Web application** найдите поле **Authorized Redirect URIs** и нажмите **Add URI**, затем введите `https://<YOUR_AUTH0_URI>/login/callback`.

Нажмите **Сохранить**, когда закончите.

4. _Для выполнения этих шагов в <Constant name="cloud" /> вам понадобится пользователь с правами администратора Google Workspace_. В <Constant name="cloud" /> перейдите в **Account Settings**, нажмите **Single Sign-on**, а затем нажмите **Edit** в правой части панели SSO. Включите опцию **Enable New SSO Authentication** и нажмите **Save**. Это действие вызовет окно авторизации Google, в котором потребуются учетные данные администратора. _Действие по миграции является окончательным и не может быть отменено_. После успешного прохождения аутентификации протестируйте новую конфигурацию, используя URL для входа через SSO, указанный на странице настроек.

:::warning Авторизация домена

Вы должны завершить авторизацию домена до того, как переключите `Enable New SSO Authentication`, иначе миграция не будет успешно завершена.

:::

