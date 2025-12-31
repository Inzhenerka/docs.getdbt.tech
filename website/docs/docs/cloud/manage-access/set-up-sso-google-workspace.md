---
title: "Настройка SSO с Google Workspace"
description: "Узнайте, как администраторы dbt могут использовать Single Sign-On (SSO) через Google GSuite для управления доступом в аккаунте dbt."
id: "set-up-sso-google-workspace"
---

# Настройка SSO с Google Workspace <Lifecycle status="managed, managed_plus" /> {#set-up-sso-with-google-workspace}

Тарифы <Constant name="cloud" /> уровня Enterprise поддерживают Single Sign-On (SSO) через Google GSuite. Вам потребуются права на создание и управление новым Google OAuth2-приложением, а также доступ для включения Google Admin SDK. GSuite является компонентом Google Cloud Platform (GCP), поэтому вам также понадобится учетная запись с правами управления приложением GSuite в рамках аккаунта GCP.

Некоторые клиенты предпочитают использовать разные облачные провайдеры для настройки прав пользователей и групп и для хостинга инфраструктуры. Например, вполне возможно использовать GSuite для управления данными входа и настройкой многофакторной аутентификации (MFA), при этом размещая рабочие нагрузки с данными в AWS.

 В настоящее время поддерживаются следующие возможности:

* SSO, инициируемый провайдером сервиса (SP-initiated SSO)
* Provisioning «по требованию» (Just-in-time provisioning)

В этом руководстве описан процесс настройки аутентификации в <Constant name="cloud" /> с использованием Google GSuite.

## Настройка организации GSuite в GCP {#configuration-of-the-gsuite-organization-within-gcp}

<Constant name="cloud" /> использует Client ID и Client Secret для аутентификации пользователей
организации GSuite. Ниже приведены шаги по созданию Client ID и
Client Secret для использования в <Constant name="cloud" />.

### Создание учетных данных {#creating-credentials}

1. Перейдите в [API Manager](https://console.developers.google.com/projectselector/apis/credentials) в GCP
2. Выберите существующий проект или создайте новый проект для учетных данных API
3. Нажмите **Create Credentials** и в появившемся окне выберите **OAuth Client ID**
4. Google требует настройки экрана согласия OAuth для учетных данных OAuth.
   Нажмите кнопку **Configure consent screen**, чтобы создать
   новый экран согласия, если появится соответствующий запрос.
5. На странице экрана согласия OAuth настройте следующие параметры ([документация Google](https://support.google.com/cloud/answer/6158849?hl=en#userconsent)):

| Configuration          | Value        | notes |
| ---------------------- | ------------ | ------ |
| **Application type**   | internal     | обязательно |
| **Application name**   | <Constant name="cloud" />    | обязательно |
| **Application logo**   | Загрузите логотип <a href="https://www.getdbt.com/ui/img/dbt-icon.png" target="_blank" rel="noopener noreferrer">здесь</a> | опционально |
| **Authorized domains** | `getdbt.com` (US multi-tenant) `getdbt.com` и `dbt.com` (US Cell 1) `dbt.com` (EMEA или AU) | При развертывании в VPC используйте домен вашего развертывания |
| **Scopes** | `email, profile, openid` | Стандартных scope достаточно |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-consent-top.png" title="Настройка экрана согласия GSuite"/>

6. Сохраните настройки **Consent screen**, чтобы вернуться на страницу **Create OAuth client
   id**.
7. Используйте следующие значения конфигурации при создании учетных данных, заменив `YOUR_ACCESS_URL` и `YOUR_AUTH0_URI`,
   которые необходимо подставить в соответствии с Access URL и Auth0 URI из ваших [настроек аккаунта](/docs/cloud/manage-access/sso-overview#auth0-uris).

| Config | Value |
| ------ | ----- |
| **Application type** | Web application |
| **Name** | <Constant name="cloud" /> |
| **Authorized Javascript origins** | `https://YOUR_ACCESS_URL` |
| **Authorized Redirect URIs** | `https://YOUR_AUTH0_URI/login/callback` |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-credentials.png" title="Настройка учетных данных GSuite"/>

8. Нажмите **Create**, чтобы создать новые учетные данные. Появится всплывающее окно
   с **Client ID** и **Client Secret**. Обязательно сохраните их — они понадобятся позже!

### Включение Admin SDK {#enabling-the-admin-sdk}

<Constant name="cloud" /> требует, чтобы для этого приложения был включен Admin SDK,
чтобы запрашивать информацию о членстве в группах через API GSuite. Чтобы включить Admin SDK для
данного проекта, перейдите на страницу [Admin SDK Settings](https://console.developers.google.com/apis/api/admin.googleapis.com/overview)
и убедитесь, что API включен.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/7f36f50-Screen_Shot_2019-12-03_at_10.15.01_AM.png" title="Страница 'Admin SDK'"/>

## Настройка в dbt {#configuration-in-dbt}

Чтобы завершить настройку, выполните следующие шаги в приложении <Constant name="cloud" />.

### Указание OAuth Client ID и Client Secret {#supply-your-oauth-client-id-and-client-secret}

1. Перейдите на страницу **Enterprise &gt; Single Sign On** в разделе **Account settings**.
2. Нажмите кнопку **Edit** и укажите следующие параметры SSO:
    - **Log in with**: GSuite
    - **Client ID**: вставьте Client ID, созданный на предыдущих шагах
    - **Client Secret**: вставьте Client Secret, созданный на предыдущих шагах
    - **Domain in GSuite**: укажите доменное имя вашего аккаунта GSuite (например, `dbtlabs.com`).
      Только пользователи с адресом электронной почты из этого домена смогут входить в ваш
      аккаунт <Constant name="cloud" /> с использованием аутентификации GSuite. При необходимости
      можно указать список доменов в формате CSV, которым _всем_ разрешен доступ
      к вашему аккаунту <Constant name="cloud" /> (например, `dbtlabs.com, fishtowndata.com`)
      
    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-cloud-config.png" title="Конфигурация GSuite SSO"/>
3. Нажмите **Save &amp; Authorize**, чтобы авторизовать ваши учетные данные. Вы будете
   перенаправлены в поток OAuth GSuite и получите запрос на вход в <Constant name="cloud" />
   с использованием вашей рабочей электронной почты. Если аутентификация пройдет успешно,
   вы будете перенаправлены обратно в приложение <Constant name="cloud" />.
4. На странице **Credentials** убедитесь, что присутствует запись `groups`
   и что она отражает группы, членом которых вы являетесь в GSuite. Если
   вы не видите запись `groups` в списке атрибутов IdP, ознакомьтесь со следующими
   шагами по устранению неполадок.

    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-cloud-verify.png" title="Проверка групп GSuite"/>

Если информация для проверки выглядит корректно, значит вы успешно завершили настройку SSO с GSuite.

<Snippet path="login_url_note" />

## Настройка RBAC {#setting-up-rbac}
Теперь, когда вы завершили настройку SSO с GSuite, следующим шагом будет настройка
[групп RBAC](/docs/cloud/manage-access/about-user-access#role-based-access-control-), чтобы завершить конфигурацию управления доступом.

## Устранение неполадок {#troubleshooting}

### Ошибка invalid client {#invalid-client-error}

Если при авторизации через GSuite вы получаете ошибку `Error 401: invalid_client`, проверьте, что:
 - указанный Client ID совпадает со значением, созданным на странице GCP API Credentials;
 - указанные доменные имена совпадают с доменами вашего аккаунта GSuite.

### Ошибки OAuth {#oauth-errors}

Если проверка OAuth не завершается успешно, проверьте, что:
 - Admin SDK включен в вашем проекте GCP;
 - указанные Client ID и Client Secret совпадают со значениями,
   созданными на странице GCP Credentials;
 - в настройках экрана согласия OAuth был указан Authorized Domain.

Если аутентификация с API GSuite проходит успешно, но на странице **Credentials** вы не видите
запись `groups`, возможно, у вас нет прав на доступ к группам в вашем аккаунте GSuite. В этом случае
попросите администратора предоставить вашему пользователю GSuite права на запрос групп либо
попросите администратора войти в <Constant name="cloud" /> и авторизовать интеграцию с GSuite.

## Узнать больше {#learn-more}

<WistiaVideo id="xzksdgiamq" paddingTweak="62.25%" />
