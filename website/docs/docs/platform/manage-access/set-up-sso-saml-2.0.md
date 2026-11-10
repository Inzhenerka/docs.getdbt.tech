---
title: "Настройка SSO с помощью SAML 2.0"
id: "set-up-sso-saml-2.0"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

import LoginSlug from '/snippets/_login-slug.md';

# Настройка SSO с помощью SAML 2.0

Тарифные планы <Constant name="dbt" /> уровня Enterprise поддерживают единый вход (SSO) через любого поставщика удостоверений (IdP), совместимого с SAML 2.0.
В настоящее время поддерживаются следующие возможности:
* SSO, инициированный IdP
* SSO, инициированный SP
* Создание учетных записей при первом входе (Just-in-time provisioning)

В этом документе подробно описаны шаги интеграции <Constant name="dbt" /> с поставщиком
удостоверений для настройки единого входа и [управления доступом на основе ролей](/docs/platform/manage-access/about-user-access#role-based-access-control-).

## URI Auth0 {#auth0-uris}

<Snippet path="auth0-uri" />

## Универсальные интеграции SAML 2.0 {#generic-saml-20-integrations}

Если ваш SAML‑провайдер идентификации — Okta, Google, Azure или OneLogin, перейдите к соответствующему разделу ниже на этой странице. Для всех остальных SAML‑совместимых провайдеров идентификации вы можете использовать инструкции из этого раздела для их настройки.

### Настройка провайдера идентификации {#configure-your-identity-provider}

Для настройки провайдера идентификации вам потребуется доступ администратора к вашему SAML 2.0‑совместимому IdP. Эти инструкции можно использовать с любым провайдером идентификации, поддерживающим SAML 2.0.

### Создание приложения {#creating-the-application}

1. Войдите в ваш SAML 2.0 провайдер идентификации и создайте новое приложение.
2. При появлении запроса настройте приложение со следующими параметрами:
   - **Platform:** Web
   - **Sign on method:** SAML 2.0
- **Название приложения:** <Constant name="dbt" />
   - **Логотип приложения (необязательно):** При желании вы можете [скачать логотип dbt](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing) и использовать его в качестве логотипа этого приложения.

#### Настройка приложения {#configuring-the-application}

<Snippet path="access_url" />

<LoginSlug />

Когда система запросит параметры конфигурации приложения SAML 2.0, укажите следующие значения:

* Single sign on URL: `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
* Audience URI (SP Entity ID): `urn:auth0:<YOUR_AUTH0_ENTITYID>:{login URL slug}`
- Relay State: `<login URL slug>` (Примечание: в настройках IdP параметр Relay State может быть указан как необязательный; для настройки SSO в dbt он _обязателен_.) 

Кроме того, вы можете настроить атрибуты IdP, передаваемые от вашего поставщика удостоверений в <Constant name="dbt" />. Для [настройки SCIM](/docs/platform/manage-access/scim) требуются `NameID` и `email`, чтобы связывать входы в систему с нужным пользователем. Если вы используете сопоставление лицензий для групп, необходимо дополнительно настроить атрибут `groups`. Рекомендуем использовать следующие значения:

Дополнительно вы можете настроить атрибуты IdP, которые будут передаваться из вашего провайдера идентификации в <Constant name="cloud" />. Для [настройки SCIM](/docs/platform/manage-access/scim) требуются атрибуты `NameID` и `email`, чтобы связать входы с корректным пользователем. Если вы используете сопоставление лицензий для групп, необходимо дополнительно настроить атрибут `groups`. Мы рекомендуем использовать следующие значения:

| name | name format | value | description |
| ---- | ----------- | ----- | ----------- |
| email | Unspecified | user.email | Адрес электронной почты пользователя |
| first_name | Unspecified | user.first_name | Имя пользователя |
| last_name | Unspecified | user.last_name | Фамилия пользователя |
| NameID | Unspecified | ID | Неизменяемый идентификатор пользователя |

Значения `NameID` могут быть постоянными (`urn:oasis:names:tc:SAML:2.0:nameid-format:persistent`), а не неопределёнными, если ваш IdP поддерживает такие значения. Использование адреса электронной почты в качестве `NameID` допустимо, но при изменении этого адреса <Constant name="dbt" /> создаёт совершенно нового пользователя. Рекомендуется настроить значение, которое не будет меняться даже при изменении адреса электронной почты пользователя.

[Управление доступом на основе ролей](/docs/platform/manage-access/about-user-access#role-based-access-control-) в <Constant name="dbt" /> использует
сопоставления групп из IdP для назначения пользователей <Constant name="dbt" /> группам <Constant name="dbt" />. Чтобы
использовать управление доступом на основе ролей в <Constant name="dbt" />, также настройте своего поставщика
удостоверений так, чтобы он передавал сведения о членстве в группах в атрибуте пользователя с именем
`groups`:

| name | name format | value | description |
| ---- | ----------- | ----- | ----------- |
| groups | Unspecified | `<IdP-specific>` | Группы, к которым принадлежит пользователь в IdP |

:::info Примечание
Вы можете использовать атрибут групп с ограничением (group attribute statement), чтобы ограничить набор групп,
передаваемых в <Constant name="dbt" /> для каждого аутентифицированного пользователя. Например, если названия всех ваших групп <Constant name="dbt" /> начинаются
с `DBT_CLOUD_...`, вы можете при необходимости применить фильтр вида `Starts With: DBT_CLOUD_`.
:::

### Сбор секретов интеграции {#collect-integration-secrets}

После подтверждения ваших данных IdP должен отобразить следующие значения для
новой интеграции SAML 2.0. Сохраните эти значения в безопасном месте, поскольку они понадобятся
для завершения настройки в <Constant name="dbt" />.

- Identity Provider Issuer
- Identity Provider SSO Url
- X.509 Certificate (требуется формат PEM)
  <!-- vale off -->
    - <Expandable alt_header="Пример формата PEM" >
      ```text
      -----BEGIN CERTIFICATE-----
      MIIC8DCCAdigAwIBAgIQSANTIKwxA1221kqhkiG9w0dbtLabsBAQsFADA0MTIwMAYDVQQD
      EylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0yMzEyMjIwMDU1
      MDNaFw0yNjEyMjIwMDU1MDNaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQg
      U1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAEFAAFRANKIEMIIBCgKCAQEAqfXQGc/D8ofK
      aXbPXftPotqYLEQtvqMymgvhFuUm+bQ9YSpS1zwNQ9D9hWVmcqis6gO/VFw61e0lFnsOuyx+XMKL
      rJjAIsuWORavFqzKFnAz7hsPrDw5lkNZaO4T7tKs+E8N/Qm4kUp5omZv/UjRxN0XaD+o5iJJKPSZ
      PBUDo22m+306DE6ZE8wqxT4jTq4g0uXEitD2ZyKaD6WoPRETZELSl5oiCB47Pgn/mpqae9o0Q2aQ
      LP9zosNZ07IjKkIfyFKMP7xHwzrl5a60y0rSIYS/edqwEhkpzaz0f8QW5pws668CpZ1AVgfP9TtD
      Y1EuxBSDQoY5TLR8++2eH4te0QIDAQABMA0GCSqGSIb3DmAKINgAA4IBAQCEts9ujwaokRGfdtgH
      76kGrRHiFVWTyWdcpl1dNDvGhUtCRsTC76qwvCcPnDEFBebVimE0ik4oSwwQJALExriSvxtcNW1b
      qvnY52duXeZ1CSfwHkHkQLyWBANv8ZCkgtcSWnoHELLOWORLD4aSrAAY2s5hP3ukWdV9zQscUw2b
      GwN0/bTxxQgA2NLZzFuHSnkuRX5dbtrun21USPTHMGmFFYBqZqwePZXTcyxp64f3Mtj3g327r/qZ
      squyPSq5BrF4ivguYoTcGg4SCP7qfiNRFyBUTTERFLYU0n46MuPmVC7vXTsPRQtNRTpJj/b2gGLk
      1RcPb1JosS1ct5Mtjs41
      -----END CERTIFICATE-----
      ```
      </Expandable>
      <!-- vale on -->

### Завершение настройки {#finish-setup}

После создания приложения следуйте инструкциям в разделе [Настройка <Constant name="dbt" />](#dbt-setup),
чтобы завершить интеграцию.

## Интеграция с Okta {#okta-integration}
Используйте инструкции из этого раздела для настройки Okta в качестве провайдера идентификации.

1. Войдите в свою учетную запись Okta. В административной панели создайте новое приложение.

<Lightbox
    collapsed={false}
src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-1-new-app.png"
    title="Создать новое приложение"
/>

2. Выберите следующие параметры:
   - **Platform**: Web
   - **Sign on method**: SAML 2.0

3. Нажмите **Create**, чтобы продолжить процесс настройки.

<Lightbox
    collapsed={false}
src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-1-new-app-create.png"
    title="Настройка нового приложения"
/>

### Настройка приложения Okta {#configure-the-okta-application}

<Snippet path="access_url" />

<LoginSlug />

1. На странице **General Settings** введите следующие данные:

* **Название приложения**: <Constant name="dbt" />
   * **Логотип приложения** (необязательно): При желании вы можете [скачать логотип dbt](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing),
     и загрузить его в Okta, чтобы использовать в качестве логотипа этого приложения.

2. Нажмите **Next**, чтобы продолжить.

<Lightbox
    collapsed={false}
src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-2-general-settings.png"
    title="Настройте общие параметры приложения"
/>

### Настройка параметров SAML {#configure-saml-settings}

1. На странице **SAML Settings** укажите следующие значения:

   * **Single sign on URL**: `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
   * **Audience URI (SP Entity ID)**: `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`
   * **Relay State**: `<login URL slug>`
   * **Name ID format**: `Unspecified`
   * **Application username**: `Custom` / `user.getInternalProperty("id")`
   * **Update Application username on**: `Create and update`

<Lightbox collapsed={false} src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-3-saml-settings-top.png" title="Настройка параметров SAML приложения"/>

2. Сопоставьте атрибуты пользователей и групп вашей организации в Okta с форматом, который
ожидает <Constant name="dbt" />, с помощью форм Attribute Statements и Group Attribute Statements. Для [настройки SCIM](/docs/platform/manage-access/scim) требуется атрибут `email`, чтобы связывать входы в систему с соответствующим пользователем. Если вы используете сопоставление лицензий для групп, необходимо дополнительно настроить атрибут `groups`.

3. Следующая таблица иллюстрирует ожидаемые **User Attribute Statements**:

   | Name           | Name format | Value                | Description                |
   | -------------- | ----------- | -------------------- | -------------------------- |
   | `email`        | Unspecified | `user.email`      | _Адрес электронной почты пользователя_ |
   | `first_name`   | Unspecified | `user.firstName`  | _Имя пользователя_    |
   | `last_name`    | Unspecified | `user.lastName`   | _Фамилия пользователя_     |

4. Следующая таблица иллюстрирует ожидаемые **Group Attribute Statements**:

   | Name     | Name format | Filter        | Value | Description                           |
   | -------- | ----------- | ------------- | ----- | ------------------------------------- |
   | `groups` | Unspecified | Matches regex | `.*`  | _Группы, к которым принадлежит пользователь_ |

Вместо этого можно использовать более строгое правило передачи атрибутов групп (Group Attribute Statement), чем в
примере из предыдущих шагов. Например, если названия всех ваших групп <Constant name="dbt" /> начинаются с
`DBT_CLOUD_`, можно использовать фильтр вида `Starts With: DBT_CLOUD_`. **Okta
возвращает не более 100 групп для каждого пользователя, поэтому, если ваши пользователи входят более чем в 100
групп IdP, необходимо использовать более строгий фильтр**. Обратитесь в
службу поддержки, если у вас возникнут вопросы.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-3-saml-settings-bottom.png"
    title="Настройка правил передачи атрибутов пользователей и групп для приложения"
/>

5. Нажмите **Next**, чтобы продолжить.

### Завершение настройки Okta {#finish-okta-setup}

1. Выберите *I'm an Okta customer adding an internal app*.
2. Выберите *This is an internal app that we have created*.
3. Нажмите **Finish**, чтобы завершить настройку
приложения.

<Lightbox
    collapsed={false}
src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-4-feedback.png"
    title="Завершение настройки в Okta"
/>

### Просмотр инструкций по настройке {#view-setup-instructions}

1. На следующей странице нажмите **View Setup Instructions**.
2. На следующих шагах вы укажете эти значения в настройках аккаунта <Constant name="dbt" />, чтобы завершить
интеграцию между Okta и <Constant name="dbt" />.

<Lightbox
    collapsed={true}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-5-view-instructions.png"
    title="Просмотр настроенного приложения"
/>

<Lightbox
    collapsed={true}
src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-5-instructions.png"
    title="Инструкции по настройке приложения"
/>

3. После создания приложения Okta следуйте инструкциям в разделе [Настройка <Constant name="dbt" />](#dbt-setup),
чтобы завершить интеграцию.

## Интеграция с Google {#google-integration}

Используйте этот раздел, если вы настраиваете Google в качестве провайдера идентификации.

### Настройка приложения Google {#configure-the-google-application}

<Snippet path="access_url" />

<LoginSlug />

1. Войдите в **Google Admin Console** под учетной записью с правами суперадминистратора.
2. На главной странице консоли администратора перейдите в **Apps**, затем нажмите **Web and mobile apps**.
3. Нажмите **Add**, затем выберите **Add custom SAML app**.
4. Нажмите **Next**, чтобы продолжить.
5. На странице App Details выполните следующие действия:
    - Задайте имя пользовательского приложения
    - Загрузите логотип приложения (optional)
    - Нажмите **Continue**.

### Настройка параметров SAML {#configure-saml-settings-1}

1. Перейдите на страницу **Google Identity Provider details**.
2. Загрузите **IDP metadata**.
3. Скопируйте **SSO URL** и **Entity ID**, а также загрузите **Certificate** (или **SHA-256 fingerprint**, если требуется).
4. В окне **Service Provider Details** укажите следующие значения:
   * **ACS URL**: `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
   * **Audience URI (SP Entity ID)**: `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`
   - **Start URL**: `<login URL slug>`
5. Установите флажок **Signed response**.
6. По умолчанию в качестве **Name ID** используется основной адрес электронной почты. Ввод нескольких значений не поддерживается.  Если в профиле пользователя есть уникальное, неизменное значение, которое сохранится при смене адреса электронной почты, лучше использовать его; в противном случае подойдет адрес электронной почты.
7. На странице **Attribute mapping** настройте сопоставление атрибутов Google Directory вашей организации с форматом, который
ожидает <Constant name="dbt" />.
8. Нажмите **Add another mapping**, чтобы сопоставить дополнительные атрибуты.

Ожидаемые **Attributes**:

| Name           | Name format | Value                | Description                |
| -------------- | ----------- | -------------------- | -------------------------- |
| `First name`   | Unspecified | `first_name`         | Имя пользователя.  |
| `Last name`    | Unspecified | `last_name`          | Фамилия пользователя.     |
| `Primary email`| Unspecified | `email`              | Адрес электронной почты пользователя. |

9. Чтобы использовать [управление доступом на основе ролей](/docs/platform/manage-access/about-user-access#role-based-access-control-) в <Constant name="dbt" />, укажите группы в поле **Group membership** при настройке:

| Google groups  | App attributes |
| -------------- | -------------- |
| Name of groups | `groups` |

10. Нажмите **Finish**, чтобы продолжить.

### Завершение настройки Google {#finish-google-setup}

1. На главной странице консоли администратора перейдите в **Apps**, затем нажмите **Web and mobile apps**.
2. Выберите ваше SAML‑приложение.
3. Нажмите **User access**.
4. Чтобы включить или отключить сервис для всех пользователей организации, выберите **On for everyone** или **Off for everyone**, затем нажмите **Save**.
5. Убедитесь, что адреса электронной почты, которые пользователи используют для входа в SAML‑приложение, совпадают с адресами, используемыми для входа в домен Google.

**Примечание:** изменения обычно вступают в силу в течение нескольких минут, но в некоторых случаях могут занять до 24 часов.

### Завершение настройки {#finish-setup-1}

После создания приложения Google следуйте инструкциям в разделе [Настройка <Constant name="cloud" />](#dbt-setup)

После создания приложения Google следуйте инструкциям в разделе [настройка <Constant name="dbt" />](#dbt-setup)

Если вы используете Microsoft Entra ID (ранее Azure AD), приведенные ниже инструкции помогут настроить его в качестве провайдера идентификации.

### Создание корпоративного приложения Microsoft Entra ID {#create-a-microsoft-entra-id-enterprise-application}

<Snippet path="access_url" />

<LoginSlug />

Выполните следующие действия, чтобы настроить единый вход (SSO) в <Constant name="dbt" />:

1. Войдите в свою учетную запись Azure.
2. На портале Entra ID выберите **Enterprise applications** и нажмите **+ New application**.
3. Выберите **Create your own application**.
4. Назовите приложение «<Constant name="dbt" />» или укажите другое понятное имя.
5. Выберите **Integrate any other application you don't find in the gallery (Non-gallery)** в качестве типа приложения.
6. Нажмите **Create**.
7. Чтобы найти новое приложение, нажмите **Enterprise applications** и выберите **All applications**.
8. Нажмите на только что созданное приложение.
9. В левом меню навигации в разделе Manage выберите **Single sign-on**.
10. Нажмите **Set up single sign on** в разделе Getting Started.
<Lightbox src="/img/docs/dbt-platform/access-control/single-sign-on-overview.jpg" width="75%" title="На странице обзора выберите «Set up single sign on»" />

11.  Нажмите **SAML** в разделе «Select a single sign-on method».
<Lightbox src="/img/docs/dbt-platform/access-control/saml.jpg" width="75%" title="Выберите карточку «SAML» в разделе «Select a single sign-on method»." />

12. Нажмите **Edit** в разделе Basic SAML Configuration.

<Lightbox src="/img/docs/dbt-platform/access-control/basic-saml.jpg" width="75%" title="На странице «Настройка единого входа с помощью SAML» нажмите «Изменить» в карточке «Базовая конфигурация SAML»"  />

13. Используйте следующую таблицу для заполнения обязательных полей и подключения к dbt:

   | Field | Value |
   | ----- | ----- |
   | **Identifier (Entity ID)** | Используйте `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`. |
   | **Reply URL (Assertion Consumer Service URL)** | Используйте `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`. |
   | **Relay State** | `<login URL slug>` |

14. Нажмите **Save** в верхней части формы.

### Создание параметров SAML {#creating-saml-settings}

На странице Set up Single Sign-On with SAML:

1. Нажмите **Edit** в разделе User Attributes & Claims.
2. Выберите **Unique User Identifier (Name ID)** в разделе **Required claim.**
3. Установите **Name identifier format** в значение **Unspecified**.
4. Установите **Source attribute** в значение **user.objectid**.
5. Удалите все значения в разделе **Additional claims.**
6. Нажмите **Add new claim** и добавьте следующие утверждения:

   | Name | Source attribute |
   | ----- | ----- |
   | **email** | user.mail |
   | **first_name** | user.givenname |
   | **last_name** | user.surname |

7. В разделе **User Attributes and Claims** нажмите **Add a group claim**.
8. Если вы назначаете пользователей напрямую корпоративному приложению, выберите **Security Groups**. В противном случае выберите **Groups assigned to the application**.
9. Установите **Source attribute** в значение **Group ID**.
10. В разделе **Advanced options** отметьте **Customize the name of the group claim** и задайте **Name** равным **groups**.

**Примечание:** имейте в виду, что Group ID в Entra ID сопоставляется с GUID группы. Для корректной работы сопоставлений он должен быть указан в нижнем регистре. Поле Source Attribute также может быть установлено в другое значение по вашему усмотрению.

### Завершение настройки {#finish-setup-2}

9. После создания приложения Azure следуйте инструкциям в разделе [Настройка <Constant name="dbt" />](#dbt-setup), чтобы завершить интеграцию. Названия полей в <Constant name="dbt" /> отличаются от названий в приложении Entra ID. Они сопоставляются следующим образом:

   | Поле <Constant name="dbt" /> | Соответствующее поле Entra ID |
   | ----- | ----- |
   | **Identity Provider SSO URL** | Login URL |
   | **Identity Provider Issuer** | Microsoft Entra Identifier |

## Интеграция с OneLogin {#onelogin-integration}

Используйте этот раздел, если вы настраиваете OneLogin в качестве провайдера идентификации.

Для настройки OneLogin вам потребуется доступ **Administrator**.

### Настройка приложения OneLogin {#configure-the-onelogin-application}

<Snippet path="access_url" />

<LoginSlug />

1. Войдите в OneLogin и добавьте новое приложение SAML 2.0.
2. Настройте приложение со следующими параметрами:
   - **Platform:** Web
   - **Sign on method:** SAML 2.0
- **Название приложения:** <Constant name="dbt" />
   - **Логотип приложения (необязательно):** При желании вы можете [скачать логотип dbt](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing) и использовать его в качестве логотипа этого приложения.

### Настройка параметров SAML {#configure-saml-settings-2}

3. На вкладке **Configuration** укажите следующие значения:

   - **RelayState:** `<login URL slug>`
   - **Audience (EntityID):** `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`
   - **ACS (Consumer) URL Validator:** `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
   - **ACS (Consumer) URL:** `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`

4. Затем перейдите на вкладку **Parameters**. Необходимо создать параметры для атрибутов Email, First Name и Last Name и включить все параметры в утверждения SAML. При добавлении пользовательских параметров обязательно установите флажок **Include in SAML assertion** и убедитесь, что регистр символов и формат в точности соответствуют приведённым в следующей таблице.

Мы рекомендуем использовать следующие значения:

| имя | формат имени | значение |
| ---- | ----------- | ----- |
| NameID | Unspecified | OneLogin ID |
| email | Unspecified | Email |
| first_name | Unspecified | First Name |
| last_name | Unspecified | Last Name |

[Управление доступом на основе ролей](/docs/platform/manage-access/about-user-access#role-based-access-control-) в <Constant name="dbt" /> использует
сопоставления групп из IdP для назначения пользователей <Constant name="dbt" /> в группы <Constant name="dbt" />. Чтобы
использовать управление доступом на основе ролей в <Constant name="dbt" />, также настройте OneLogin для передачи сведений о членстве в группах в атрибуте пользователя с именем
`groups`:

| имя | формат имени | значение | описание |
| ---- | ----------- | ----- | ----------- |
421 | | groups | Не указано | Набор групп, которые будут использоваться в вашей организации | Группы, к которым принадлежит пользователь в IdP |

### Сбор секретов интеграции {#collect-integration-secrets-1}

### Получите секреты интеграции

5. Подтвердив введённые данные, перейдите на **вкладку SSO**. OneLogin должен отобразить следующие значения для
новой интеграции. Сохраните эти значения в безопасном месте: они понадобятся для завершения настройки в <Constant name="dbt" />.

- Issuer URL
- SAML 2.0 Endpoint (HTTP)
- X.509 Certificate (требуется формат PEM)
  <!-- vale off -->
    - <Expandable alt_header="Пример формата PEM"  anchor_id="pem-details-2">
      ```text
      -----BEGIN CERTIFICATE-----
      MIIC8DCCAdigAwIBAgIQSANTIKwxA1221kqhkiG9w0dbtLabsBAQsFADA0MTIwMAYDVQQD
      EylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0yMzEyMjIwMDU1
      MDNaFw0yNjEyMjIwMDU1MDNaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQg
      U1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAEFAAFRANKIEMIIBCgKCAQEAqfXQGc/D8ofK
      aXbPXftPotqYLEQtvqMymgvhFuUm+bQ9YSpS1zwNQ9D9hWVmcqis6gO/VFw61e0lFnsOuyx+XMKL
      rJjAIsuWORavFqzKFnAz7hsPrDw5lkNZaO4T7tKs+E8N/Qm4kUp5omZv/UjRxN0XaD+o5iJJKPSZ
      PBUDo22m+306DE6ZE8wqxT4jTq4g0uXEitD2ZyKaD6WoPRETZELSl5oiCB47Pgn/mpqae9o0Q2aQ
      LP9zosNZ07IjKkIfyFKMP7xHwzrl5a60y0rSIYS/edqwEhkpzaz0f8QW5pws668CpZ1AVgfP9TtD
      Y1EuxBSDQoY5TLR8++2eH4te0QIDAQABMA0GCSqGSIb3DmAKINgAA4IBAQCEts9ujwaokRGfdtgH
      76kGrRHiFVWTyWdcpl1dNDvGhUtCRsTC76qwvCcPnDEFBebVimE0ik4oSwwQJALExriSvxtcNW1b
      qvnY52duXeZ1CSfwHkHkQLyWBANv8ZCkgtcSWnoHELLOWORLD4aSrAAY2s5hP3ukWdV9zQscUw2b
      GwN0/bTxxQgA2NLZzFuHSnkuRX5dbtrun21USPTHMGmFFYBqZqwePZXTcyxp64f3Mtj3g327r/qZ
      squyPSq5BrF4ivguYoTcGg4SCP7qfiNRFyBUTTERFLYU0n46MuPmVC7vXTsPRQtNRTpJj/b2gGLk
      1RcPb1JosS1ct5Mtjs41
      -----END CERTIFICATE-----
      ```
      </Expandable>
      <!-- vale on -->

### Завершение настройки {#finish-setup-3}

6. После создания приложения OneLogin следуйте инструкциям в разделе [Настройка <Constant name="dbt" />](#dbt-setup),
чтобы завершить интеграцию.

## Настройка dbt {#dbt-setup}

### Передача значений IdP в dbt {#providing-idp-values-to-dbt}

Чтобы завершить настройку, выполните следующие действия в <Constant name="dbt" />:

1. Перейдите в **Account settings** > **SSO & SCIM**.
2. Нажмите **Get started**, если SSO ещё не настроен, или **Edit**, если он уже настроен.
3. Укажите следующие сведения для SSO:

   | Field | Value |
   | ----- | ----- |
   | Log&nbsp;in&nbsp;with | SAML 2.0 |
| Identity&nbsp;Provider&nbsp;SSO&nbsp;Url | Вставьте **Identity Provider Single Sign-On URL**, указанный в инструкциях по настройке IdP |
   | Identity&nbsp;Provider&nbsp;Issuer | Вставьте **Identity Provider Issuer**, указанный в инструкциях по настройке IdP |
   | X.509&nbsp;Certificate | Вставьте **X.509 Certificate**, указанный в инструкциях по настройке IdP; <br />**Примечание:** Когда срок действия сертификата истечёт, администратору IdP потребуется создать новый сертификат и вставить его в <Constant name="dbt" />, чтобы обеспечить бесперебойный доступ к приложению. |
  
    <Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-6-setup-integration.png"
        title="Настройка приложения в dbt" />

4. Нажмите **Save**, чтобы завершить настройку интеграции SAML 2.0.
5. После завершения настройки вы можете перейти по URL-адресу, сформированному на основе _slug_ вашей учётной записи, чтобы проверить вход через вашего поставщика удостоверений. Кроме того, пользователи, добавленные в приложение SAML 2.0, смогут входить в <Constant name="dbt" /> непосредственно из IdP.

### Дополнительные параметры конфигурации {#additional-configuration-options}

В разделе **Single sign-on** также доступны дополнительные параметры конфигурации, расположенные ниже полей с учетными данными.

- **Подписывать запросы аутентификации SAML:** <Constant name="dbt" /> будет подписывать SAML-запросы, отправляемые вашему поставщику удостоверений при попытке пользователей войти в систему.  Метаданные для настройки этой функции у поставщика удостоверений можно скачать по адресу, указанному в поле **SAML Metadata URL**.  В большинстве случаев мы рекомендуем оставлять эту функцию отключённой.

- **Сопоставления атрибутов:** Сопоставьте атрибуты SAML, необходимые <Constant name="dbt" />, с атрибутами, которые ваш поставщик удостоверений включает в утверждения SAML.  Значение должно быть корректным JSON-объектом с ключами `email`, `first_name`, `last_name` или `groups` и значениями в виде строк или списков строк.  Например, если ваш поставщик удостоверений не может включить атрибут `email` в утверждения, но включает атрибут с именем `EmailAddress`, то для параметра **Сопоставления атрибутов** следует задать значение `{ "email": "EmailAddress" }`. Сопоставления нужны только в том случае, если вы не можете настроить атрибуты в соответствии с инструкциями на этой странице. Если можете, допустимо оставить значение по умолчанию — `{}`.

<Snippet path="login_url_note" />

### Настройка RBAC {#setting-up-rbac}

После настройки поставщика удостоверений вы сможете настроить [управление доступом на основе ролей](/docs/platform/manage-access/enterprise-permissions) для своей учетной записи.

Ответы на распространенные вопросы и рекомендации по устранению неполадок — включая ошибку «Access Denied» после аутентификации SAML, изменения ACS URL или Entity ID и проблемы с подтверждением электронной почты — см. в разделе [Часто задаваемые вопросы о SSO и устранение неполадок](/docs/platform/manage-access/sso-faq).
