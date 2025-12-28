---
title: "Настройка SSO с использованием SAML 2.0"
id: "set-up-sso-saml-2.0"
---

import LoginSlug from '/snippets/_login-slug.md';

# Настройка SSO с использованием SAML 2.0 <Lifecycle status="managed, managed_plus" />

Тарифы уровня Enterprise в <Constant name="cloud" /> поддерживают единый вход (Single Sign-On, SSO) для любого провайдера удостоверений (IdP), совместимого с SAML 2.0.  
В настоящее время поддерживаются следующие возможности:
* SSO, инициируемый IdP
* SSO, инициируемый SP
* Provisioning «just-in-time»

В этом документе описаны шаги по интеграции <Constant name="cloud" /> с провайдером удостоверений для настройки единого входа и [ролевого управления доступом](/docs/cloud/manage-access/about-user-access#role-based-access-control).

## Auth0 URIs

<Snippet path="auth0-uri" />

## Универсальные интеграции SAML 2.0

Если ваш SAML‑провайдер удостоверений — это Okta, Google, Azure или OneLogin, перейдите к соответствующему разделу ниже на этой странице. Для всех остальных провайдеров удостоверений, совместимых с SAML, вы можете использовать инструкции из этого раздела для их настройки.

### Настройка провайдера удостоверений

Для настройки провайдера удостоверений вам потребуется доступ администратора к вашему SAML 2.0‑совместимому IdP. Эти инструкции можно использовать с любым IdP, поддерживающим SAML 2.0.

### Создание приложения

1. Войдите в ваш SAML 2.0‑провайдер удостоверений и создайте новое приложение.
2. При появлении запроса настройте приложение со следующими параметрами:
   - **Platform:** Web  
   - **Sign on method:** SAML 2.0  
   - **App name:** <Constant name="cloud" />  
   - **App logo (optional):** при желании вы можете [скачать логотип dbt](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing) и использовать его в качестве логотипа приложения.

#### Настройка приложения

<Snippet path="access_url" />

<LoginSlug />

Когда система запросит параметры конфигурации SAML 2.0, укажите следующие значения:

* Single sign on URL: `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
* Audience URI (SP Entity ID): `urn:auth0:<YOUR_AUTH0_ENTITYID>:{login URL slug}`
- Relay State: `<login URL slug>` (Примечание: в настройках IdP поле Relay State может отображаться как необязательное, однако для конфигурации SSO в dbt оно является _обязательным_.)

Дополнительно вы можете настроить атрибуты IdP, которые будут передаваться из вашего провайдера удостоверений в <Constant name="cloud" />. Для [настройки SCIM](/docs/cloud/manage-access/scim) требуются атрибуты `NameID` и `email`, чтобы сопоставлять входы с правильными пользователями. Если вы используете сопоставление лицензий по группам, также необходимо настроить атрибут `groups`. Мы рекомендуем использовать следующие значения:

| name | name format | value | description |
| ---- | ----------- | ----- | ----------- |
| email | Unspecified | user.email | Адрес электронной почты пользователя |
| first_name | Unspecified | user.first_name | Имя пользователя |
| last_name | Unspecified | user.last_name | Фамилия пользователя |
| NameID | Unspecified | ID | Постоянный идентификатор пользователя |

Значения `NameID` могут быть постоянными (`urn:oasis:names:tc:SAML:2.0:nameid-format:persistent`), если ваш IdP поддерживает такой формат. Использование адреса электронной почты в качестве `NameID` будет работать, однако <Constant name="cloud" /> создаст нового пользователя, если адрес электронной почты изменится. Лучшей практикой является настройка значения, которое не меняется, даже если электронная почта пользователя обновится.

[Ролевое управление доступом](/docs/cloud/manage-access/about-user-access#role-based-access-control) в <Constant name="cloud" />  
основано на сопоставлении групп из IdP для назначения пользователей <Constant name="cloud" /> в группы <Constant name="cloud" />.  
Чтобы использовать ролевое управление доступом в <Constant name="cloud" />, также настройте ваш провайдер удостоверений на передачу информации о членстве в группах в пользовательском атрибуте с именем `groups`:

| name | name format | value | description |
| ---- | ----------- | ----- | ----------- |
| groups | Unspecified | `<IdP-specific>` | Группы, к которым принадлежит пользователь в IdP |

:::info Примечание
Вы можете использовать ограниченное выражение атрибута групп, чтобы сократить набор групп, передаваемых в <Constant name="cloud" /> для каждого аутентифицированного пользователя. Например, если все ваши группы <Constant name="cloud" /> начинаются с `DBT_CLOUD_...`, вы можете применить фильтр `Starts With: DBT_CLOUD_`.
:::

### Сбор секретов интеграции

После подтверждения деталей IdP должен отобразить следующие значения для новой интеграции SAML 2.0. Сохраните их в надежном месте — они понадобятся для завершения настройки в <Constant name="cloud" />.

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

### Завершение настройки

После создания приложения следуйте инструкциям в разделе [Настройка <Constant name="cloud" />](#dbt-cloud-setup), чтобы завершить интеграцию.

## Интеграция с Okta
В этом разделе описана настройка Okta в качестве провайдера удостоверений.

1. Войдите в свою учетную запись Okta. Используя панель администратора, создайте новое приложение.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app.png"
    title="Создание нового приложения"
/>

2. Выберите следующие параметры:
   - **Platform**: Web  
   - **Sign on method**: SAML 2.0  

3. Нажмите **Create**, чтобы продолжить процесс настройки.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app-create.png"
    title="Настройка нового приложения"
/>

### Настройка приложения Okta

<Snippet path="access_url" />

<LoginSlug />

1. На странице **General Settings** укажите следующие значения:

   * **App name**: <Constant name="cloud" />  
   * **App logo** (необязательно): при желании вы можете [скачать логотип dbt](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing)  
     и загрузить его в Okta для использования в качестве логотипа приложения.

2. Нажмите **Next**, чтобы продолжить.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-2-general-settings.png"
    title="Настройка общих параметров приложения"
/>

### Настройка SAML Settings

1. На странице **SAML Settings** укажите следующие значения:

   * **Single sign on URL**: `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
   * **Audience URI (SP Entity ID)**: `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`
   * **Relay State**: `<login URL slug>`
   * **Name ID format**: `Unspecified`
   * **Application username**: `Custom` / `user.getInternalProperty("id")`
   * **Update Application username on**: `Create and update`

  <Lightbox collapsed={false} src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-top.png" title="Настройка параметров SAML приложения"/>

2. Сопоставьте пользовательские и групповые атрибуты Okta вашей организации с форматом, который ожидает <Constant name="cloud" />, используя формы **Attribute Statements** и **Group Attribute Statements**. Для [настройки SCIM](/docs/cloud/manage-access/scim) требуется атрибут `email` для корректного сопоставления пользователей. Если вы используете сопоставление лицензий по группам, также необходимо настроить атрибут `groups`.

3. В следующей таблице показаны ожидаемые **User Attribute Statements**:

   | Name           | Name format | Value              | Description                 |
   | -------------- | ----------- | ------------------ | --------------------------- |
   | `email`        | Unspecified | `user.email`       | _Адрес электронной почты пользователя_ |
   | `first_name`   | Unspecified | `user.firstName`   | _Имя пользователя_          |
   | `last_name`    | Unspecified | `user.lastName`    | _Фамилия пользователя_      |

4. В следующей таблице показаны ожидаемые **Group Attribute Statements**:

   | Name     | Name format | Filter        | Value | Description                             |
   | -------- | ----------- | ------------- | ----- | --------------------------------------- |
   | `groups` | Unspecified | Matches regex | `.*`  | _Группы, к которым принадлежит пользователь_ |

Вместо примера из предыдущих шагов вы можете использовать более ограничительное выражение для групп. Например, если все ваши группы <Constant name="cloud" /> начинаются с  
`DBT_CLOUD_`, вы можете использовать фильтр `Starts With: DBT_CLOUD_`. **Okta возвращает только 100 групп для каждого пользователя, поэтому если ваши пользователи состоят более чем в 100 группах IdP, необходимо использовать более строгий фильтр**. Если у вас есть вопросы, пожалуйста, свяжитесь со службой поддержки.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-bottom.png"
    title="Настройка пользовательских и групповых атрибутов приложения"
/>

5. Нажмите **Next**, чтобы продолжить.

### Завершение настройки Okta

1. Выберите *I'm an Okta customer adding an internal app*.  
2. Выберите *This is an internal app that we have created*.  
3. Нажмите **Finish**, чтобы завершить настройку приложения.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-4-feedback.png"
    title="Завершение настройки в Okta"
/>

### Просмотр инструкций по настройке

1. На следующей странице нажмите **View Setup Instructions**.  
2. В шагах ниже вы будете использовать эти значения в настройках учетной записи <Constant name="cloud" /> для завершения интеграции между Okta и <Constant name="cloud" />.

<Lightbox
    collapsed={true}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-5-view-instructions.png"
    title="Просмотр настроенного приложения"
/>

<Lightbox
    collapsed={true}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-5-instructions.png"
    title="Инструкции по настройке приложения"
/>

3. После создания приложения Okta следуйте инструкциям в разделе [Настройка <Constant name="cloud" />](#dbt-cloud-setup), чтобы завершить интеграцию.

## Интеграция с Google

Используйте этот раздел, если вы настраиваете Google в качестве провайдера удостоверений.

### Настройка приложения Google

<Snippet path="access_url" />

<LoginSlug />

1. Войдите в **Google Admin Console** под учетной записью с правами суперадминистратора.
2. На главной странице Admin Console перейдите в **Apps**, затем нажмите **Web and mobile apps**.
3. Нажмите **Add**, затем выберите **Add custom SAML app**.
4. Нажмите **Next**, чтобы продолжить.
5. На странице App Details выполните следующие действия:
    - Задайте имя пользовательского приложения
    - Загрузите логотип приложения (необязательно)
    - Нажмите **Continue**.

### Настройка SAML Settings

1. Перейдите на страницу **Google Identity Provider details**.
2. Скачайте **IDP metadata**.
3. Скопируйте **SSO URL** и **Entity ID**, а также скачайте **Certificate** (или **SHA-256 fingerprint**, если требуется).
4. В окне **Service Provider Details** укажите следующие значения:
   * **ACS URL**: `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
   * **Audience URI (SP Entity ID)**: `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`
   - **Start URL**: `<login URL slug>`
5. Установите флажок **Signed response**.
6. По умолчанию **Name ID** — это основной адрес электронной почты. Многозначный ввод не поддерживается. Если в профиле пользователя есть уникальное и стабильное значение, которое сохраняется при изменении адреса электронной почты, рекомендуется использовать его; в противном случае электронная почта тоже подойдет.
7. На странице **Attribute mapping** сопоставьте атрибуты каталога Google вашей организации с форматом, который ожидает <Constant name="cloud" />.
8. Нажмите **Add another mapping**, чтобы добавить дополнительные атрибуты.

Ожидаемые **Attributes**:

| Name            | Name format | Value        | Description                  |
| --------------- | ----------- | ------------ | ---------------------------- |
| `First name`    | Unspecified | `first_name` | Имя пользователя.            |
| `Last name`     | Unspecified | `last_name`  | Фамилия пользователя.        |
| `Primary email` | Unspecified | `email`      | Адрес электронной почты пользователя. |

9. Чтобы использовать [ролевое управление доступом](/docs/cloud/manage-access/about-user-access#role-based-access-control) в <Constant name="cloud" />, укажите группы в поле **Group membership** во время настройки:

| Google groups  | App attributes |
| -------------- | -------------- |
| Name of groups | `groups` |

10. Нажмите **Finish**, чтобы продолжить.

### Завершение настройки Google

1. На главной странице Admin Console перейдите в **Apps**, затем нажмите **Web and mobile apps**.
2. Выберите ваше SAML‑приложение.
3. Нажмите **User access**.
4. Чтобы включить или отключить сервис для всех пользователей в организации, нажмите **On for everyone** или **Off for everyone**, затем нажмите **Save**.
5. Убедитесь, что адреса электронной почты, которые пользователи используют для входа в SAML‑приложение, совпадают с адресами, используемыми для входа в домен Google.

**Примечание:** изменения обычно вступают в силу в течение нескольких минут, но иногда могут занимать до 24 часов.

### Завершение настройки

После создания приложения Google следуйте инструкциям в разделе [Настройка <Constant name="cloud" />](#dbt-cloud-setup).

## Интеграция с Microsoft Entra ID (ранее Azure AD)

Если вы используете Microsoft Entra ID (ранее Azure AD), инструкции ниже помогут настроить его в качестве провайдера удостоверений.

### Создание корпоративного приложения Microsoft Entra ID

<Snippet path="access_url" />

<LoginSlug />

Выполните следующие шаги, чтобы настроить единый вход (SSO) с <Constant name="cloud" />:

1. Войдите в свою учетную запись Azure.
2. В портале Entra ID выберите **Enterprise applications** и нажмите **+ New application**.
3. Выберите **Create your own application**.
4. Назовите приложение «<Constant name="cloud" />» или любым другим описательным именем.
5. В качестве типа приложения выберите **Integrate any other application you don't find in the gallery (Non-gallery)**.
6. Нажмите **Create**.
7. Найти новое приложение можно, выбрав **Enterprise applications** и затем **All applications**.
8. Нажмите на только что созданное приложение.
9. В левом меню в разделе Manage выберите **Single sign-on**.
10. В разделе Getting Started нажмите **Set up single sign on**.
<Lightbox src="/img/docs/dbt-cloud/access-control/single-sign-on-overview.jpg" width="75%" title="На странице Overview выберите «Set up single sign on»" />

11. В разделе «Select a single sign-on method» нажмите **SAML**.
<Lightbox src="/img/docs/dbt-cloud/access-control/saml.jpg" width="75%" title="Выберите карточку «SAML» в разделе «Select a single sign-on method»." />

12. В разделе Basic SAML Configuration нажмите **Edit**.

<Lightbox src="/img/docs/dbt-cloud/access-control/basic-saml.jpg" width="75%" title="На странице «Set up Single Sign-On with SAML» нажмите «Edit» в карточке «Basic SAML Configuration»"  />

13. Используйте следующую таблицу для заполнения обязательных полей и подключения к dbt:

   | Field | Value |
   | ----- | ----- |
   | **Identifier (Entity ID)** | Используйте `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`. |
   | **Reply URL (Assertion Consumer Service URL)** | Используйте `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`. |
   | **Relay State** | `<login URL slug>` |

14. Нажмите **Save** в верхней части формы.

### Создание настроек SAML

На странице **Set up Single Sign-On with SAML**:

1. Нажмите **Edit** в разделе **User Attributes & Claims**.
2. В разделе **Required claim** нажмите **Unique User Identifier (Name ID)**.
3. Установите **Name identifier format** в значение **Unspecified**.
4. Установите **Source attribute** в значение **user.objectid**.
5. Удалите все утверждения в разделе **Additional claims**.
6. Нажмите **Add new claim** и добавьте следующие утверждения:

   | Name | Source attribute |
   | ----- | ----- |
   | **email** | user.mail |
   | **first_name** | user.givenname |
   | **last_name** | user.surname |

7. В разделе **User Attributes and Claims** нажмите **Add a group claim**.
8. Если вы назначаете пользователей напрямую корпоративному приложению, выберите **Security Groups**. Если нет — выберите **Groups assigned to the application**.
9. Установите **Source attribute** в значение **Group ID**.
10. В разделе **Advanced options** отметьте **Customize the name of the group claim** и укажите **Name** как **groups**.

**Примечание:** имейте в виду, что Group ID в Entra ID сопоставляется с GUID группы. Для корректной работы сопоставлений его следует указывать в нижнем регистре. Поле Source Attribute при желании можно установить в другое значение.

### Завершение настройки

9. После создания приложения Azure следуйте инструкциям в разделе [Настройка <Constant name="cloud" />](#dbt-cloud-setup), чтобы завершить интеграцию. Названия полей в <Constant name="cloud" /> отличаются от названий в приложении Entra ID и сопоставляются следующим образом:

   | Поле <Constant name="cloud" /> | Соответствующее поле Entra ID |
   | ----- | ----- |
   | **Identity Provider SSO URL** | Login URL |
   | **Identity Provider Issuer** | Microsoft Entra Identifier |

## Интеграция с OneLogin

Используйте этот раздел, если вы настраиваете OneLogin в качестве провайдера удостоверений.

Для настройки OneLogin вам потребуется доступ **Administrator**.

### Настройка приложения OneLogin

<Snippet path="access_url" />

<LoginSlug />

1. Войдите в OneLogin и добавьте новое приложение SAML 2.0.
2. Настройте приложение со следующими параметрами:
   - **Platform:** Web  
   - **Sign on method:** SAML 2.0  
   - **App name:** <Constant name="cloud" />  
   - **App logo (optional):** при желании вы можете [скачать логотип dbt](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing) и использовать его в качестве логотипа приложения.

### Настройка SAML settings

3. На вкладке **Configuration** укажите следующие значения:

   - **RelayState:** `<login URL slug>`
   - **Audience (EntityID):** `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`
   - **ACS (Consumer) URL Validator:** `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
   - **ACS (Consumer) URL:** `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`

4. Затем перейдите на вкладку **Parameters**. У вас должны быть параметры для атрибутов Email, First Name и Last Name, и все параметры должны включаться в SAML‑утверждения. При добавлении пользовательских параметров убедитесь, что установлен флажок **Include in SAML assertion**.

Мы рекомендуем использовать следующие значения:

| name | name format | value |
| ---- | ----------- | ----- |
| NameID | Unspecified | OneLogin ID |
| email | Unspecified | Email |
| first_name | Unspecified | First Name |
| last_name | Unspecified | Last Name |

[Ролевое управление доступом](/docs/cloud/manage-access/about-user-access#role-based-access-control) в <Constant name="cloud" />  
основано на сопоставлении групп из IdP для назначения пользователей <Constant name="cloud" /> в группы <Constant name="cloud" />.  
Чтобы использовать ролевое управление доступом в <Constant name="cloud" />, также настройте OneLogin на передачу информации о членстве в группах в пользовательском атрибуте с именем `groups`:

| name | name format | value | description |
| ---- | ----------- | ----- | ----------- |
| groups | Unspecified | Series of groups to be used for your organization | Группы, к которым принадлежит пользователь в IdP |

### Сбор секретов интеграции

5. После подтверждения деталей перейдите на вкладку **SSO**. OneLogin отобразит следующие значения для новой интеграции. Сохраните их в надежном месте — они понадобятся для завершения настройки в <Constant name="cloud" />.

- Issuer URL  
- SAML 2.0 Endpoint (HTTP)  
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

### Завершение настройки

6. После создания приложения OneLogin следуйте инструкциям в разделе [Настройка <Constant name="cloud" />](#dbt-cloud-setup), чтобы завершить интеграцию.

## Настройка dbt

### Передача значений IdP в dbt

Чтобы завершить настройку, выполните следующие шаги в <Constant name="cloud" />:

1. Перейдите в **Account Settings**, затем нажмите **Single Sign On**.
2. В правом верхнем углу нажмите **Edit**.
3. Укажите следующие параметры SSO:

   | Field | Value |
   | ----- | ----- |
   | Log&nbsp;in&nbsp;with | SAML 2.0 |
   | Identity&nbsp;Provider&nbsp;SSO&nbsp;Url | Вставьте **Identity Provider Single Sign-On URL**, указанный в инструкциях настройки IdP |
   | Identity&nbsp;Provider&nbsp;Issuer | Вставьте **Identity Provider Issuer**, указанный в инструкциях настройки IdP |
   | X.509&nbsp;Certificate | Вставьте **X.509 Certificate**, указанный в инструкциях настройки IdP; <br />**Примечание:** после истечения срока действия сертификата администратору IdP необходимо сгенерировать новый и вставить его в <Constant name="cloud" />, чтобы обеспечить непрерывный доступ к приложению. |

    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-6-setup-integration.png"
        title="Настройка приложения в dbt" />

4. Нажмите **Save**, чтобы завершить настройку интеграции SAML 2.0.
5. После завершения настройки вы можете перейти по URL, сгенерированному для _slug_ вашей учетной записи, чтобы протестировать вход через провайдера удостоверений. Кроме того, пользователи, добавленные в приложение SAML 2.0, смогут входить в <Constant name="cloud" /> напрямую из IdP.

### Дополнительные параметры конфигурации

Раздел **Single sign-on** также содержит дополнительные параметры конфигурации, которые находятся ниже полей учетных данных.

- **Sign SAML Auth Request:** <Constant name="cloud" /> будет подписывать SAML‑запросы, отправляемые вашему провайдеру удостоверений при попытке входа пользователей. Метаданные для настройки этого параметра в IdP можно скачать по ссылке, указанной в поле **SAML Metadata URL**. Для большинства сценариев рекомендуется оставить этот параметр отключенным.

- **Attribute Mappings:** позволяет сопоставить SAML‑атрибуты, необходимые <Constant name="cloud" />, с атрибутами, которые ваш провайдер удостоверений включает в SAML‑утверждения. Значение должно быть корректным JSON‑объектом с ключами `email`, `first_name`, `last_name` или `groups`, а значениями — строками или списками строк. Например, если ваш провайдер удостоверений не может включить атрибут `email` в утверждения, но включает атрибут `EmailAddress`, то **Attribute Mappings** следует установить в `{ "email": "EmailAddress" }`. Эти сопоставления нужны только в том случае, если вы не можете настроить атрибуты так, как указано в инструкциях на этой странице. Если можете — значение по умолчанию `{}` является допустимым.

<Snippet path="login_url_note" />

### Настройка RBAC

После настройки провайдера удостоверений вы сможете настроить [ролевое управление доступом](/docs/cloud/manage-access/enterprise-permissions) для своей учетной записи.
