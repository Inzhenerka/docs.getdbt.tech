---
title: "Настройка SSO с Google Workspace"
description: "Узнайте, как администраторы dbt могут использовать Single Sign-On (SSO) через Google GSuite для управления доступом в аккаунте dbt."
id: "set-up-sso-google-workspace"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Настройка SSO с помощью Google Workspace

Тарифные планы <Constant name="dbt" /> уровня Enterprise поддерживают единый вход (SSO) через Google GSuite. Вам потребуются разрешения на создание нового приложения Google OAuth2 и управление им, а также права для включения Google Admin SDK. GSuite — это компонент Google Cloud Platform (GCP), поэтому вам также понадобится доступ к учетной записи с разрешениями на управление приложением GSuite в аккаунте GCP.

Некоторые клиенты предпочитают использовать разные облачные провайдеры для настройки прав пользователей и групп и для хостинга инфраструктуры. Например, вполне возможно использовать GSuite для управления данными входа и настройкой многофакторной аутентификации (MFA), при этом размещая рабочие нагрузки с данными в AWS.

 В настоящее время поддерживаются следующие возможности:

* SSO, инициируемый провайдером сервиса (SP-initiated SSO)
* Provisioning «по требованию» (Just-in-time provisioning)

В этом руководстве описан процесс настройки аутентификации в <Constant name="dbt" /> с помощью Google GSuite.

## Настройка организации GSuite в GCP {#configuration-of-the-gsuite-organization-within-gcp}

<Constant name="dbt" /> использует Client ID и Client Secret для аутентификации пользователей
организации GSuite. Ниже описаны шаги по созданию Client ID и
Client Secret для использования в <Constant name="dbt" />.

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
| **Тип приложения**   | internal     | обязательно |
| **Название приложения**   | <Constant name="dbt" />    | обязательно |
| **Логотип приложения**   | Скачайте логотип <a href="https://cdn.sanity.io/images/wl0ndo6t/main/333fef4fc72db6f1ce4d1bc0789f355b4f0bbaa2-1280x1280.png" target="_blank" rel="noopener noreferrer">здесь</a> | необязательно |
| **Авторизованные домены** | `getdbt.com` (мультитенантное развертывание в США) `getdbt.com` и `dbt.com` (US Cell 1) `dbt.com` (EMEA или AU) | При развертывании в VPC используйте домен вашего развертывания |
| **Области доступа** | `email, profile, openid` | Областей доступа по умолчанию достаточно |

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/gsuite/gsuite-sso-consent-top.png" title="Настройка экрана согласия GSuite"/>

6. Сохраните настройки **Consent screen**, чтобы вернуться на страницу **Create OAuth client
   id**.
7. При создании учетных данных используйте следующие значения конфигурации, заменив `YOUR_ACCESS_URL` и `YOUR_AUTH0_URI` соответствующими значениями Access URL и Auth0 URI из [настроек вашей учетной записи](/docs/platform/manage-access/sso-overview#auth0-uris).

| Config | Value |
| ------ | ----- |
| **Application type** | Web application |
| **Name** | <Constant name="dbt" /> |
| **Authorized Javascript origins** | `https://YOUR_ACCESS_URL` |
| **Authorized Redirect URIs** | `https://YOUR_AUTH0_URI/login/callback` |

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/gsuite/gsuite-sso-credentials.png" title="Настройка учетных данных GSuite"/>

8. Нажмите **Create**, чтобы создать новые учетные данные. Появится всплывающее окно
   с **Client ID** и **Client Secret**. Обязательно сохраните их — они понадобятся позже!

### Включение Admin SDK {#enabling-the-admin-sdk}

Для запроса информации об участниках групп из GSuite API инструменту <Constant name="dbt" /> необходимо, чтобы в этом приложении был включён
Admin SDK. Чтобы включить Admin SDK для
этого проекта, перейдите на [страницу настроек Admin SDK](https://console.developers.google.com/apis/api/admin.googleapis.com/overview)
и убедитесь, что API включён.

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/7f36f50-Screen_Shot_2019-12-03_at_10.15.01_AM.png" title="Страница «Admin SDK»"/>

## Настройка в dbt {#configuration-in-dbt}

Чтобы завершить настройку, выполните приведённые ниже действия в приложении <Constant name="dbt" />.

### Указание OAuth Client ID и Client Secret {#supply-your-oauth-client-id-and-client-secret}

1. Перейдите в **Account settings** > **SSO & SCIM**.
2. Нажмите **Get started**, если SSO ещё не настроен, или **Edit**, если он уже настроен.
3. Укажите следующие параметры SSO:
    - **Log in with**: GSuite
    - **Client ID**: Вставьте Client ID, созданный на предыдущих шагах
    - **Client Secret**: Вставьте Client Secret, созданный на предыдущих шагах
    - **Domain in GSuite**: Введите доменное имя вашей учётной записи GSuite (например, `dbtlabs.com`).
      Только пользователи с адресом электронной почты в этом домене смогут войти в вашу учётную запись <Constant name="dbt" />
      с помощью аутентификации GSuite. При необходимости можно указать список доменов через запятую,
      пользователям _всех_ этих доменов будет разрешён доступ к вашей учётной записи <Constant name="dbt" /> (например, `dbtlabs.com, fishtowndata.com`)
      
    <Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/gsuite/gsuite-sso-cloud-config.png" title="Настройка SSO через GSuite"/>
4. Нажмите **Save &amp; Authorize**, чтобы авторизоваться с указанными учётными данными. Вы будете
   перенаправлены в процесс OAuth-аутентификации GSuite, где вам предложат войти в <Constant name="dbt" />, используя
   рабочий адрес электронной почты. Если аутентификация пройдёт успешно, вы будете
   перенаправлены обратно в приложение <Constant name="dbt" />.
5. На странице **Credentials** убедитесь, что запись `groups`
   присутствует и содержит группы, в которые вы входите в GSuite. Если
   запись `groups` отсутствует в списке атрибутов IdP, обратитесь к приведённым далее
   инструкциям по устранению неполадок.

    <Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/gsuite/gsuite-sso-cloud-verify.png" title="Проверка групп GSuite"/>

Если информация для проверки выглядит корректно, значит вы успешно завершили настройку SSO с GSuite.

<Snippet path="login_url_note" />

## Настройка RBAC
Теперь, когда вы завершили настройку SSO с GSuite, следующим шагом будет настройка
[групп RBAC](/docs/platform/manage-access/about-user-access#role-based-access-control-), чтобы завершить конфигурацию управления доступом.

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

Если проверка OAuth не завершается успешно, убедитесь, что:
 - В вашем проекте GCP включён Admin SDK
 - Указанные Client ID и Client Secret совпадают со значениями, созданными на
   странице GCP Credentials
 - В настройках OAuth Consent Screen указан Authorized Domain
Если аутентификация через GSuite API проходит успешно, но вы не видите
запись `groups` на странице **Credentials**, возможно, у вас нет
разрешений на доступ к группам в вашей учётной записи GSuite. Попросите
администратора предоставить вашему пользователю GSuite право запрашивать группы или
попросите администратора войти в <Constant name="dbt" /> и авторизовать интеграцию с GSuite.

Дополнительные рекомендации по устранению неполадок, включая проблемы с подтверждением электронной почты, повторные запросы MFA и особенности принудительного применения SSO, см. в разделе [Часто задаваемые вопросы о SSO и устранение неполадок](/docs/platform/manage-access/sso-faq).

## Узнать больше {#learn-more}

<WistiaVideo id="xzksdgiamq" paddingTweak="62.25%" />
