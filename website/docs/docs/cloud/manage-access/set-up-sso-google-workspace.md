---
title: "Настройка SSO с Google Workspace"
description: "Узнайте, как администраторы dbt могут использовать единый вход (SSO) через Google GSuite для управления доступом в аккаунте dbt."
id: "set-up-sso-google-workspace"
---

# Настройка SSO с Google Workspace <Lifecycle status="managed, managed_plus" />

Тарифы уровня Enterprise в <Constant name="cloud" /> поддерживают единый вход (Single-Sign On, SSO) через Google GSuite. Вам понадобятся права на создание и управление новым приложением Google OAuth2, а также доступ для включения Google Admin SDK. GSuite является компонентом Google Cloud Platform (GCP), поэтому вам также потребуется доступ к учетной записи с правами управления приложением GSuite внутри аккаунта GCP.

Некоторые клиенты предпочитают использовать разных облачных провайдеров для настройки прав пользователей и групп и для размещения инфраструктуры. Например, вполне возможно использовать GSuite для управления учетными данными и настройками многофакторной аутентификации (MFA), при этом размещая вычислительные нагрузки с данными в AWS.

В настоящее время поддерживаются следующие возможности:

* SSO, инициируемый поставщиком услуг (SP-initiated SSO)
* Автоматическое создание пользователей (Just-in-time provisioning)

В этом руководстве описан процесс настройки аутентификации в <Constant name="cloud" /> с помощью Google GSuite.

## Конфигурация организации GSuite в GCP

<Constant name="cloud" /> использует Client ID и Client Secret для аутентификации пользователей организации GSuite. Ниже приведены шаги по созданию Client ID и Client Secret для использования в <Constant name="cloud" />.

### Создание учетных данных

1. Перейдите в [API Manager](https://console.developers.google.com/projectselector/apis/credentials) в GCP
2. Выберите существующий проект или создайте новый проект для API Credentials
3. Нажмите **Create Credentials** и в появившемся окне выберите **OAuth Client ID**
4. Google требует настроить экран согласия OAuth (OAuth consent screen) для OAuth‑учетных данных. При необходимости нажмите кнопку **Configure consent screen**, чтобы создать новый экран согласия.
5. На странице OAuth consent screen настройте следующие параметры ([документация Google](https://support.google.com/cloud/answer/6158849?hl=en#userconsent)):

| Configuration          | Value        | notes |
| ---------------------- | ------------ | ------ |
| **Application type**   | internal     | обязательно |
| **Application name**   | <Constant name="cloud" />    | обязательно |
| **Application logo**   | Скачайте логотип <a href="https://www.getdbt.com/ui/img/dbt-icon.png" target="_blank" rel="noopener noreferrer">здесь</a> | опционально |
| **Authorized domains** | `getdbt.com` (US multi-tenant) `getdbt.com` и `dbt.com` (US Cell 1) `dbt.com` (EMEA или AU) | При развертывании в VPC используйте домен вашего развертывания |
| **Scopes** | `email, profile, openid` | Дефолтных scopes достаточно |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-consent-top.png" title="Конфигурация экрана согласия GSuite"/>

6. Сохраните настройки **Consent screen**, чтобы вернуться на страницу **Create OAuth client id**.
7. При создании учетных данных используйте следующие значения конфигурации, заменив `YOUR_ACCESS_URL` и `YOUR_AUTH0_URI` на соответствующие Access URL и Auth0 URI из [настроек вашего аккаунта](/docs/cloud/manage-access/sso-overview#auth0-uris).

| Config | Value |
| ------ | ----- |
| **Application type** | Web application |
| **Name** | <Constant name="cloud" /> |
| **Authorized Javascript origins** | `https://YOUR_ACCESS_URL` |
| **Authorized Redirect URIs** | `https://YOUR_AUTH0_URI/login/callback` |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-credentials.png" title="Конфигурация учетных данных GSuite"/>

8. Нажмите **Create**, чтобы создать новые учетные данные. Появится окно с **Client ID** и **Client Secret**. Сохраните их — они понадобятся позже.

### Включение Admin SDK

<Constant name="cloud" /> требует, чтобы для этого приложения был включен Admin SDK, чтобы запрашивать информацию о членстве в группах из GSuite API. Чтобы включить Admin SDK для этого проекта, перейдите на [страницу настроек Admin SDK](https://console.developers.google.com/apis/api/admin.googleapis.com/overview) и убедитесь, что API включен.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/7f36f50-Screen_Shot_2019-12-03_at_10.15.01_AM.png" title="Страница «Admin SDK»"/>

## Конфигурация в dbt

Для завершения настройки выполните следующие шаги в приложении <Constant name="cloud" />.

### Укажите OAuth Client ID и Client Secret

1. Перейдите на страницу **Enterprise &gt; Single Sign On** в разделе **Account settings**.
2. Нажмите кнопку **Edit** и укажите следующие параметры SSO:
    - **Log in with**: GSuite
    - **Client ID**: вставьте Client ID, созданный на предыдущих шагах
    - **Client Secret**: вставьте Client Secret, созданный на предыдущих шагах
    - **Domain in GSuite**: укажите доменное имя вашего аккаунта GSuite (например, `dbtlabs.com`).
      Только пользователи с email‑адресами из этого домена смогут входить в ваш аккаунт <Constant name="cloud" />
      с использованием аутентификации GSuite. Опционально вы можете указать CSV‑список доменов,
      которые _все_ будут авторизованы для доступа к вашему аккаунту <Constant name="cloud" /> (например, `dbtlabs.com, fishtowndata.com`)
      
    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-cloud-config.png" title="Конфигурация GSuite SSO"/>
3. Нажмите **Save &amp; Authorize**, чтобы авторизовать учетные данные. Вы будете перенаправлены в OAuth‑процесс GSuite и получите запрос на вход в <Constant name="cloud" /> с использованием вашей рабочей почты. Если аутентификация пройдет успешно, вы будете перенаправлены обратно в приложение <Constant name="cloud" />.
4. На странице **Credentials** убедитесь, что присутствует запись `groups` и что она отражает группы, участником которых вы являетесь в GSuite. Если вы не видите запись `groups` в списке атрибутов IdP, обратитесь к следующим шагам раздела Troubleshooting.

    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-cloud-verify.png" title="Проверка групп GSuite"/>

Если информация для проверки выглядит корректно, значит вы завершили настройку SSO с GSuite.

<Snippet path="login_url_note" />

## Настройка RBAC
Теперь, когда вы завершили настройку SSO с GSuite, следующим шагом будет настройка
[RBAC groups](/docs/cloud/manage-access/about-user-access#role-based-access-control-) для завершения конфигурации контроля доступа.

## Troubleshooting

### Ошибка Invalid client

Если при авторизации через GSuite вы получаете ошибку `Error 401: invalid_client`, проверьте следующее:
 - Указанный Client ID совпадает со значением, созданным на странице GCP API Credentials.
 - Убедитесь, что имя(имена) домена совпадают с доменом(доменами) вашего аккаунта GSuite.

### Ошибки OAuth

Если проверка OAuth не завершается успешно, проверьте следующее:
 - Admin SDK включен в вашем проекте GCP
 - Указанные Client ID и Client Secret совпадают со значениями,
   созданными на странице GCP Credentials
 - В конфигурации OAuth Consent Screen был указан Authorized Domain

Если аутентификация с GSuite API проходит успешно, но вы не видите запись
`groups` на странице **Credentials**, возможно, у вас нет прав доступа к группам
в вашем аккаунте GSuite. Либо запросите у администратора предоставление вашему
пользователю GSuite прав на запрос информации о группах, либо попросите администратора
войти в <Constant name="cloud" /> и авторизовать интеграцию с GSuite.

## Узнать больше

<WistiaVideo id="xzksdgiamq" paddingTweak="62.25%" />
