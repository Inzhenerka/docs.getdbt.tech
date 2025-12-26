---
title: "Настройка SSO с Google Workspace"  
description: "Узнайте, как администраторы dbt могут использовать Single Sign-On (SSO) через Google GSuite для управления доступом к аккаунту dbt."
id: "set-up-sso-google-workspace"
---

# Set up SSO with Google Workspace <Lifecycle status="managed, managed_plus" />

<Constant name="cloud" /> Enterprise-tier plans support Single-Sign On (SSO) via Google GSuite. You will need permissions to create and manage a new Google OAuth2 application, as well as access to enable the Google Admin SDK. Gsuite is a component within Google Cloud Platform (GCP), so you will also need access to a login with permissions to manage the GSuite application within a GCP account.

Некоторые клиенты предпочитают использовать разных облачных провайдеров для настройки прав пользователей и групп и для размещения инфраструктуры. Например, вполне возможно использовать GSuite для управления учетными данными для входа и настройками многофакторной аутентификации (MFA), одновременно размещая рабочие нагрузки с данными в AWS.

В настоящее время поддерживаются следующие функции:

* SSO, инициированное поставщиком услуг
* Создание учетных записей в режиме реального времени

Это руководство описывает процесс настройки аутентификации в <Constant name="cloud" /> с использованием Google GSuite.

## Конфигурация организации GSuite в GCP

<Constant name="cloud" /> использует Client ID и Client Secret для аутентификации пользователей организации GSuite. Ниже описаны шаги по созданию Client ID и Client Secret для использования в <Constant name="cloud" />.

### Создание учетных данных

1. Перейдите в [API Manager GCP](https://console.developers.google.com/projectselector/apis/credentials)
2. Выберите существующий проект или создайте новый проект для ваших учетных данных API
3. Нажмите **Создать учетные данные** и выберите **OAuth Client ID** в появившемся окне
4. Google требует, чтобы вы настроили экран согласия OAuth для учетных данных OAuth. Нажмите кнопку **Настроить экран согласия**, чтобы создать новый экран согласия, если будет предложено.
5. На странице экрана согласия OAuth настройте следующие параметры ([документация Google](https://support.google.com/cloud/answer/6158849?hl=en#userconsent)):

| Конфигурация            | Значение      | Примечания |
| ----------------------- | ------------- | ---------- |
| **Тип приложения**     | internal      | обязательно |
| **Имя приложения**     | <Constant name="cloud" />    | обязательно |
| **Логотип приложения** | Скачать логотип можно <a href="https://www.getdbt.com/ui/img/dbt-icon.png" target="_blank" rel="noopener noreferrer">здесь</a> | опционально |
| **Разрешённые домены** | `getdbt.com` (US multi-tenant) `getdbt.com` и `dbt.com` (US Cell 1) `dbt.com` (EMEA или AU) | При развёртывании в VPC используйте домен, соответствующий вашему развёртыванию |
| **Scopes** | `email, profile, openid` | Значений scopes по умолчанию достаточно |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-consent-top.png" title="Конфигурация экрана согласия GSuite"/>

6. Сохраните настройки **Consent screen**, чтобы вернуться на страницу **Create OAuth client id**.
7. Используйте следующие значения конфигурации при создании Credentials, заменив `YOUR_ACCESS_URL` и `YOUR_AUTH0_URI` на соответствующие Access URL и Auth0 URI из ваших [настроек аккаунта](/docs/cloud/manage-access/sso-overview#auth0-uris).

| Config | Value |
| ------ | ----- |
| **Application type** | Web application |
| **Name** | <Constant name="cloud" /> |
| **Authorized Javascript origins** | `https://YOUR_ACCESS_URL` |
| **Authorized Redirect URIs** | `https://YOUR_AUTH0_URI/login/callback` |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-credentials.png" title="Конфигурация учетных данных GSuite"/>

8. Нажмите "Создать", чтобы создать новые учетные данные. Появится всплывающее окно с **Идентификатором клиента** и **Секретом клиента**. Запишите их, так как они понадобятся вам позже!

### Включение Admin SDK

Для использования <Constant name="cloud" /> в этом приложении требуется, чтобы был включён Admin SDK, так как он необходим для запроса информации о членстве в группах через GSuite API.  
Чтобы включить Admin SDK для этого проекта, перейдите на страницу [Admin SDK Settings](https://console.developers.google.com/apis/api/admin.googleapis.com/overview) и убедитесь, что данный API включён.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/7f36f50-Screen_Shot_2019-12-03_at_10.15.01_AM.png" title="Страница 'Admin SDK'"/>

## Configuration in dbt

Чтобы завершить настройку, выполните следующие шаги в приложении <Constant name="cloud" />.

### Укажите ваш OAuth Client ID и Client Secret

1. Перейдите на страницу **Enterprise &gt; Single Sign On** в разделе **Account settings**.
2. Нажмите кнопку **Edit** и укажите следующие параметры SSO:
    - **Log in with**: GSuite
    - **Client ID**: Вставьте Client ID, сгенерированный на предыдущих шагах
    - **Client Secret**: Вставьте Client Secret, сгенерированный на предыдущих шагах
    - **Domain in GSuite**: Укажите доменное имя вашего аккаунта GSuite (например, `dbtlabs.com`).
      Только пользователи с адресом электронной почты из этого домена смогут входить
      в ваш аккаунт <Constant name="cloud" /> с использованием аутентификации GSuite.
      При необходимости вы можете указать CSV-список доменов, которым **всем**
      разрешён доступ к вашему аккаунту <Constant name="cloud" /> (например, `dbtlabs.com, fishtowndata.com`)
      
    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-cloud-config.png" title="GSuite SSO Configuration"/>
3. Нажмите **Save &amp; Authorize**, чтобы авторизовать ваши учётные данные. После этого вы будете
   перенаправлены в OAuth-процесс GSuite и увидите приглашение войти в <Constant name="cloud" />
   с использованием вашей рабочей электронной почты. Если аутентификация пройдёт успешно,
   вы будете перенаправлены обратно в приложение <Constant name="cloud" />.
4. На странице **Credentials** убедитесь, что присутствует запись `groups` и что она
   отражает группы, участником которых вы являетесь в GSuite. Если вы не видите
   запись `groups` в списке атрибутов IdP, обратитесь к следующим шагам по устранению
   неполадок.

    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-cloud-verify.png" title="Проверка групп GSuite"/>

Если информация о проверке выглядит корректной, значит, вы завершили настройку SSO GSuite.

<Snippet path="login_url_note" />

## Настройка RBAC
Теперь, когда вы завершили настройку SSO с GSuite, следующие шаги будут заключаться в настройке [групп RBAC](/docs/cloud/manage-access/about-user-access#role-based-access-control-) для завершения конфигурации управления доступом.

## Устранение неполадок

### Ошибка недействительного клиента

Если вы столкнулись с `Ошибка 401: invalid_client` при авторизации с GSuite, дважды проверьте, что:
 - Указанный идентификатор клиента соответствует значению, сгенерированному на странице учетных данных API GCP.
 - Убедитесь, что указанные имена доменов соответствуют тем, которые используются в вашем аккаунте GSuite.

### Ошибки OAuth

### Ошибки OAuth

Если проверка OAuth не завершается успешно, дважды проверьте, что:

- Admin SDK включён в вашем проекте GCP  
- Client ID и Client Secret соответствуют значениям, сгенерированным на странице GCP Credentials  
- В настройках OAuth Consent Screen был указан Authorized Domain  

Если аутентификация с помощью GSuite API проходит успешно, но на странице **Credentials** вы не видите записи `groups`, то, возможно, у вас нет прав на доступ к Groups в вашем аккаунте GSuite. В этом случае либо запросите у администратора, чтобы вашему пользователю GSuite были предоставлены права на запрос групп, либо попросите администратора войти в <Constant name="cloud" /> и авторизовать интеграцию с GSuite.

## Узнать больше

<WistiaVideo id="xzksdgiamq" paddingTweak="62.25%" />
