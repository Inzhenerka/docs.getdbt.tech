---
title: "Настройка SSO с SAML 2.0"
id: "set-up-sso-saml-2.0"
---

import LoginSlug from '/snippets/_login-slug.md';

# Set up SSO with SAML 2.0 <Lifecycle status="managed, managed_plus" />

<Constant name="cloud" /> В тарифных планах уровня Enterprise поддерживается единый вход (Single Sign-On, SSO) для любого провайдера удостоверений (IdP), совместимого с SAML 2.0.

В настоящее время поддерживаются следующие возможности:
* SSO, инициируемый IdP
* SSO, инициируемый SP
* Автоматическое создание пользователей (Just-in-time provisioning)

В этом документе описываются шаги по интеграции <Constant name="cloud" /> с провайдером удостоверений для настройки единого входа и [ролевой модели управления доступом](/docs/cloud/manage-access/about-user-access#role-based-access-control).

## URI для Auth0

<Snippet path="auth0-uri" />

## Общие интеграции SAML 2.0

Если ваш поставщик удостоверений SAML — это Okta, Google, Azure или OneLogin, перейдите к соответствующему разделу ниже на этой странице. Для всех других поставщиков удостоверений, совместимых с SAML, вы можете использовать инструкции в этом разделе для настройки этого поставщика удостоверений.

### Настройка вашего поставщика удостоверений

Вам потребуется доступ администратора к вашему поставщику удостоверений, совместимому с SAML 2.0, чтобы настроить поставщика удостоверений. Вы можете использовать следующие инструкции с любым поставщиком удостоверений, совместимым с SAML 2.0.

### Создание приложения

1. Войдите в свой SAML 2.0 identity provider и создайте новое приложение.
2. Когда система предложит, настройте приложение со следующими параметрами:
   - **Platform:** Web
   - **Sign on method:** SAML 2.0
   - **App name:** <Constant name="cloud" />
   - **App logo (optional):** При необходимости вы можете [скачать логотип dbt](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing) и использовать его в качестве логотипа для этого приложения.

#### Настройка приложения

<Snippet path="access_url" />

`<LoginSlug />`

При запросе конфигураций приложения SAML 2.0 укажите следующие значения:

* URL единого входа (Single sign on URL): `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
* Audience URI (SP Entity ID): `urn:auth0:<YOUR_AUTH0_ENTITYID>:{login URL slug}`
- Relay State: `<login URL slug>` (Примечание: параметр Relay State может отображаться как необязательный в настройках IdP; однако для конфигурации dbt SSO он **обязателен**.)

Кроме того, вы можете настроить атрибуты IdP, которые передаются от вашего провайдера удостоверений в <Constant name="cloud" />. Для [настройки SCIM](/docs/cloud/manage-access/scim) требуется наличие атрибутов `NameID` и `email`, чтобы сопоставлять входы в систему с корректным пользователем. Если вы используете сопоставление лицензий для групп, необходимо дополнительно настроить атрибут `groups`. Мы рекомендуем использовать следующие значения:

| имя | формат имени | значение | описание |
| ---- | ----------- | ----- | ----------- |
| email | Unspecified | user.email | Адрес электронной почты пользователя |
| first_name | Unspecified | user.first_name | Имя пользователя |
| last_name | Unspecified | user.last_name | Фамилия пользователя |
| NameID | Unspecified | ID | Постоянный идентификатор пользователя |

Значения `NameID` могут быть постоянными (`urn:oasis:names:tc:SAML:2.0:nameid-format:persistent`), а не `unspecified`, если ваш IdP поддерживает такие значения. Использование адреса электронной почты в качестве `NameID` будет работать, однако <Constant name="cloud" /> создаст совершенно нового пользователя, если этот адрес электронной почты изменится. Настройка значения, которое не меняется даже при изменении адреса электронной почты пользователя, считается лучшей практикой.

[Управление доступом на основе ролей](/docs/cloud/manage-access/about-user-access#role-based-access-control) в <Constant name="cloud" /> основано на сопоставлении групп из IdP для назначения пользователей <Constant name="cloud" /> в группы <Constant name="cloud" />. Чтобы использовать управление доступом на основе ролей в <Constant name="cloud" />, также настройте вашего провайдера удостоверений так, чтобы он передавал информацию о членстве в группах в пользовательском атрибуте с именем `groups`:

| имя | формат имени | значение | описание |
| ---- | ----------- | ----- | ----------- |
| groups | Не указано | `<IdP-specific>` | Группы, к которым принадлежит пользователь в IdP |

:::info Примечание
Вы можете использовать выражение атрибута ограниченной группы, чтобы ограничить набор групп
значением <Constant name="cloud" /> для каждого аутентифицированного пользователя. Например, если все ваши группы <Constant name="cloud" /> начинаются
с `DBT_CLOUD_...`, вы можете дополнительно применить фильтр вида `Starts With: DBT_CLOUD_`.
:::
:::

### Сбор секретов интеграции

После подтверждения ваших данных IdP должен отобразить следующие значения для новой интеграции SAML 2.0. Сохраните эти значения в безопасном месте, так как они понадобятся вам для завершения настройки в <Constant name="cloud" />.

- Identity Provider Issuer
- Identity Provider SSO Url
- X.509 Certificate (PEM format required)
  <!-- vale off -->
    - <Expandable alt_header="Example of PEM format" >
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

После создания приложения следуйте инструкциям в разделе [<Constant name="cloud" /> Setup](#dbt-cloud-setup), чтобы завершить интеграцию.

## Интеграция с Okta

Вы можете использовать инструкции в этом разделе для настройки Okta в качестве вашего поставщика удостоверений.

1. Войдите в ваш аккаунт Okta. Используя панель администратора, создайте новое приложение.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app.png"
    title="Создание нового приложения"
/>

2. Выберите следующие конфигурации:
   - **Платформа**: Web
   - **Метод входа**: SAML 2.0

3. Нажмите **Создать**, чтобы продолжить процесс настройки.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app-create.png"
    title="Настройка нового приложения"
/>

### Настройка приложения Okta

<Snippet path="access_url" />

`<LoginSlug />`

1. На странице **Общие настройки** введите следующие данные:

* **Имя приложения**: <Constant name="cloud" />
   * **Логотип приложения** (необязательно): при желании вы можете [скачать логотип dbt](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing)
     и загрузить его в Okta, чтобы использовать в качестве логотипа для этого приложения.

2. Нажмите **Далее**, чтобы продолжить.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-2-general-settings.png"
    title="Настройка общих параметров приложения"
/>

### Настройка параметров SAML

1. На странице **Настройки SAML** введите следующие значения:

* **Single sign on URL**: `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
* **Audience URI (SP Entity ID)**: `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`
* **Relay State**: `<login URL slug>`
* **Name ID format**: `Unspecified` — формат идентификатора NameID не задан
* **Application username**: `Custom` / `user.getInternalProperty("id")` — в качестве имени пользователя приложения используется пользовательское значение
* **Update Application username on**: `Create and update` — обновлять имя пользователя приложения при создании и обновлении

  <Lightbox collapsed={false} src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-top.png" title="Настройка параметров SAML приложения"/>

2. Сопоставьте пользовательские и групповые атрибуты Okta вашей организации с форматом, который ожидает <Constant name="cloud" />, используя формы **Attribute Statements** и **Group Attribute Statements**. Для [настройки SCIM](/docs/cloud/manage-access/scim) требуется атрибут `email`, чтобы связать входы в систему с соответствующими пользователями. Если вы используете сопоставление лицензий для групп, необходимо дополнительно настроить атрибут `groups`.

3. Следующая таблица иллюстрирует ожидаемые заявления атрибутов пользователей:

   | Имя           | Формат имени | Значение                | Описание                |
   | -------------- | ----------- | -------------------- | -------------------------- |
   | `email`        | Не указано | `user.email`      | _Адрес электронной почты пользователя_ |
   | `first_name`   | Не указано | `user.firstName`  | _Имя пользователя_    |
   | `last_name`    | Не указано | `user.lastName`   | _Фамилия пользователя_     |

4. Следующая таблица иллюстрирует ожидаемые **заявления атрибутов групп**:

   | Имя     | Формат имени | Фильтр        | Значение | Описание                           |
   | -------- | ----------- | ------------- | ----- | ------------------------------------- |
   | `groups` | Не указано | Соответствует регулярному выражению | `.*`  | _Группы, к которым принадлежит пользователь_ |

Вместо этого вы можете использовать более строгий Group Attribute Statement, чем тот, который показан в предыдущих шагах. Например, если все ваши группы `<Constant name="cloud" />` начинаются с `DBT_CLOUD_`, вы можете использовать фильтр `Starts With: DBT_CLOUD_`. **Okta возвращает только 100 групп для каждого пользователя, поэтому если ваши пользователи состоят более чем в 100 группах IdP, вам потребуется использовать более строгий фильтр**. Пожалуйста, свяжитесь со службой поддержки, если у вас возникнут какие-либо вопросы.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-bottom.png"
    title="Настройка заявлений атрибутов пользователей и групп приложения"
/>

5. Нажмите **Далее**, чтобы продолжить.

### Завершение настройки Okta

1. Выберите *Я клиент Okta, добавляющий внутреннее приложение*.
2. Выберите *Это внутреннее приложение, которое мы создали*.
3. Нажмите **Завершить**, чтобы завершить настройку приложения.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-4-feedback.png"
    title="Завершение настройки в Okta"
/>

### Просмотр инструкций по настройке

1. На следующей странице нажмите **View Setup Instructions**.
2. В шагах ниже вы укажете эти значения в настройках аккаунта <Constant name="cloud" />, чтобы завершить интеграцию между Okta и <Constant name="cloud" />.

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

3. После создания приложения Okta следуйте инструкциям в разделе [<Constant name="cloud" /> Setup](#dbt-cloud-setup), чтобы завершить интеграцию.

## Интеграция с Google

Используйте этот раздел, если вы настраиваете Google в качестве вашего поставщика удостоверений.

### Настройка приложения Google

<Snippet path="access_url" />

<LoginSlug />

1. Войдите в **Консоль администратора Google** через аккаунт с правами супер администратора.
2. На главной странице консоли администратора перейдите в **Приложения**, затем нажмите **Веб и мобильные приложения**.
3. Нажмите **Добавить**, затем нажмите **Добавить пользовательское SAML приложение**.
4. Нажмите **Далее**, чтобы продолжить.
5. Внесите следующие изменения на странице сведений о приложении:
    - Назовите пользовательское приложение
    - Загрузите логотип приложения (необязательно)
    - Нажмите **Продолжить**.

### Настройка параметров SAML

1. Перейдите на страницу **Google Identity Provider details**.
2. Скачайте **IDP metadata**.
3. Скопируйте **SSO URL** и **Entity ID**, а также скачайте **Certificate** (или **SHA-256 fingerprint**, если требуется).
4. Введите следующие значения в окне **Service Provider Details**:
   * **ACS URL**: `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
   * **Audience URI (SP Entity ID)**: `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`
   * **Start URL**: `<login URL slug>`
5. Установите флажок **Signed response**.
6. Значение **Name ID** по умолчанию — основной адрес электронной почты. Ввод нескольких значений не поддерживается. Если в профиле пользователя есть уникальное и стабильное значение, которое сохраняется при изменении адреса электронной почты, лучше использовать его; в противном случае подойдет email.
7. Используйте страницу **Attribute mapping**, чтобы сопоставить атрибуты Google Directory вашей организации с форматом, который ожидает  
   <Constant name="cloud" />.
8. Нажмите **Add another mapping**, чтобы сопоставить дополнительные атрибуты.

Ожидаемые **Атрибуты**:

| Имя           | Формат имени | Значение                | Описание                |
| -------------- | ----------- | -------------------- | -------------------------- |
| `First name`   | Не указано | `first_name`         | Имя пользователя.  |
| `Last name`    | Не указано | `last_name`          | Фамилия пользователя.     |
| `Primary email`| Не указано | `email`              |  Адрес электронной почты пользователя. |

9. Чтобы использовать [role-based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control) в <Constant name="cloud" />, укажите группы в поле **Group membership** во время настройки:

| Группы Google  | Атрибуты приложения |
| -------------- | -------------- |
| Название групп | `groups` |

10. Нажмите **Завершить**, чтобы продолжить.

### Завершение настройки Google

1. На главной странице консоли администратора перейдите в **Приложения**, затем нажмите **Веб и мобильные приложения**.
2. Выберите ваше SAML приложение.
3. Нажмите **Доступ пользователей**.
4. Чтобы включить или отключить сервис для всех в вашей организации, нажмите **Включить для всех** или **Отключить для всех**, затем нажмите **Сохранить**.
5. Убедитесь, что адреса электронной почты, которые ваши пользователи используют для входа в SAML приложение, совпадают с адресами электронной почты, которые они используют для входа в ваш домен Google.

**Примечание:** Изменения обычно вступают в силу в течение нескольких минут, но могут занять до 24 часов.

### Завершение настройки

После создания приложения Google следуйте инструкциям в разделе [Настройка dbt Cloud](#dbt-cloud-setup).

После создания приложения Google следуйте инструкциям в разделе [<Constant name="cloud" /> Setup](#dbt-cloud-setup).

Если вы используете Microsoft Entra ID (ранее Azure AD), инструкции ниже помогут вам настроить его в качестве вашего поставщика удостоверений.

### Создание корпоративного приложения Microsoft Entra ID

<Snippet path="access_url" />

<LoginSlug />

Следуйте этим шагам, чтобы настроить единый вход (SSO) для <Constant name="cloud" />:

1. Войдите в свою учетную запись Azure.
2. В портале Entra ID выберите **Enterprise applications** и нажмите **+ New application**.
3. Выберите **Create your own application**.
4. Назовите приложение "<Constant name="cloud" />" или другим понятным именем.
5. В качестве типа приложения выберите **Integrate any other application you don't find in the gallery (Non-gallery)**.
6. Нажмите **Create**.
7. Вы сможете найти новое приложение, выбрав **Enterprise applications** и затем **All applications**.
8. Нажмите на приложение, которое вы только что создали.
9. В левом навигационном меню в разделе Manage выберите **Single sign-on**.
10. В разделе Getting Started нажмите **Set up single sign on**.

<Lightbox src="/img/docs/dbt-cloud/access-control/single-sign-on-overview.jpg" width="75%" title="In your Overview page, select 'Set up single sign on" />

11.  Нажмите **SAML** в разделе "Выберите метод одноразовой аутентификации".
<Lightbox src="/img/docs/dbt-cloud/access-control/saml.jpg" width="75%" title="Выберите карточку 'SAML' в разделе 'Выберите метод одноразовой аутентификации'. " />

12.   Нажмите **Редактировать** в разделе Основная конфигурация SAML.

<Lightbox src="/img/docs/dbt-cloud/access-control/basic-saml.jpg" width="75%" title="На странице 'Set up Single Sign-On with SAML' нажмите 'Edit' в карточке 'Basic SAML Configuration'"  />

13. Используйте следующую таблицу для заполнения обязательных полей и подключения к dbt:

   | Поле | Значение |
   | ----- | ----- |
| **Identifier (Entity ID)** | Используйте `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`. |
| **Reply URL (Assertion Consumer Service URL)** | Используйте `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`. |
| **Relay State** | `<login URL slug>` |

14.   Нажмите **Сохранить** в верхней части формы.

### Создание настроек SAML

На странице Настройка одноразовой аутентификации с SAML:

1. Нажмите **Edit** в разделе **User Attributes & Claims**.
2. Нажмите **Unique User Identifier (Name ID)** в разделе **Required claim**.
3. Установите **Name identifier format** в значение **Unspecified**.
4. Установите **Source attribute** в значение **user.objectid**.
5. Удалите все claims в разделе **Additional claims**.
6. Нажмите **Add new claim** и добавьте следующие новые claims:

   | Имя | Исходный атрибут |
   | ----- | ----- |
   | **email** | user.mail |
   | **first_name** | user.givenname |
   | **last_name** | user.surname |

7. Нажмите **Add a group claim** в разделе **User Attributes and Claims**.  
8. Если вы назначаете пользователей напрямую корпоративному приложению, выберите **Security Groups**. Если нет — выберите **Groups assigned to the application**.  
9. Установите **Source attribute** в значение **Group ID**.  
10. В разделе **Advanced options** отметьте **Customize the name of the group claim** и укажите **Name** со значением **groups**.

**Примечание:** Имейте в виду, что ID группы в Entra ID сопоставляется с GUID этой группы. Он должен быть указан в нижнем регистре, чтобы сопоставления работали как ожидается. Поле Исходный атрибут может быть установлено на другое значение по вашему усмотрению.

### Завершение настройки

9. После создания приложения Azure следуйте инструкциям в разделе [<Constant name="cloud" /> Setup](#dbt-cloud-setup), чтобы завершить интеграцию. Названия полей в <Constant name="cloud" /> отличаются от названий полей в приложении Entra ID. Соответствие между ними приведено ниже:

   | Поле <Constant name="cloud" /> | Соответствующее поле Entra ID |
   | ----- | ----- |
   | **Identity Provider SSO URL** | Login URL |
   | **Identity Provider Issuer** | Microsoft Entra Identifier |

## Интеграция с OneLogin

Используйте этот раздел, если вы настраиваете OneLogin в качестве вашего поставщика удостоверений.

Для настройки OneLogin вам потребуется доступ **Администратора**.

### Настройка приложения OneLogin

<Snippet path="access_url" />

<LoginSlug />

1. Войдите в OneLogin и добавьте новое приложение **SAML 2.0**.
2. Настройте приложение со следующими параметрами:
   - **Platform:** Web  
   - **Sign on method:** SAML 2.0  
   - **App name:** <Constant name="cloud" />  
   - **App logo (optional):** При желании вы можете [скачать логотип dbt](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing) и использовать его в качестве логотипа для этого приложения.

### Настройка параметров SAML

3. В разделе **Конфигурация** введите следующие значения:

- **RelayState:** `<login URL slug>`
- **Audience (EntityID):** `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login URL slug>`
- **ACS (Consumer) URL Validator:** `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
- **ACS (Consumer) URL:** `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`

4. Далее перейдите на вкладку **Параметры**. У вас должен быть параметр для атрибутов Email, First Name и Last Name и включите все параметры в утверждения SAML. При добавлении пользовательских параметров убедитесь, что вы выбрали флажок **Включить в утверждение SAML**.

Мы рекомендуем использовать следующие значения:

| имя | формат имени | значение |
| ---- | ----------- | ----- |
| NameID | Unspecified | OneLogin ID |
| email | Unspecified | Email |
| first_name | Unspecified | First Name |
| last_name | Unspecified | Last Name |

[Управление доступом на основе ролей](/docs/cloud/manage-access/about-user-access#role-based-access-control) в <Constant name="cloud" /> основано
на сопоставлении групп из IdP для назначения пользователей <Constant name="cloud" /> в группы <Constant name="cloud" />.
Чтобы использовать управление доступом на основе ролей в <Constant name="cloud" />, также настройте OneLogin так,
чтобы он передавал информацию о членстве в группах в пользовательском атрибуте с именем
`groups`:

| имя | формат имени | значение | описание |
| ---- | ----------- | ----- | ----------- |
| groups | Не указано | Серия групп, которые будут использоваться для вашей организации | Группы, к которым принадлежит пользователь в IdP |

### Сбор секретов интеграции

5. После подтверждения ваших данных перейдите на вкладку **SSO**. OneLogin должен показать вам следующие значения для новой интеграции. Храните эти значения в безопасном месте, так как они понадобятся вам для завершения настройки в dbt Cloud.

5. После подтверждения ваших данных перейдите на вкладку **SSO**. OneLogin должен показать следующие значения для новой интеграции. Сохраните эти значения в надёжном месте — они понадобятся вам для завершения настройки в <Constant name="cloud" />.

- Issuer URL  
- SAML 2.0 Endpoint (HTTP)  
- X.509 Certificate (требуется формат PEM)  
  <!-- vale off -->
    - <Expandable alt_header="Example of PEM format" >
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

6. После создания приложения OneLogin следуйте инструкциям в разделе [Настройка dbt Cloud](#dbt-cloud-setup) для завершения интеграции.

6. После создания приложения OneLogin следуйте инструкциям в разделе [<Constant name="cloud" /> Setup](#dbt-cloud-setup), чтобы завершить интеграцию.

## Настройка dbt

### Передача значений IdP в dbt

Чтобы завершить настройку, выполните следующие шаги в <Constant name="cloud" />:

   | Поле | Значение |
   | ----- | ----- |
| Log&nbsp;in&nbsp;with | SAML 2.0 |
| Identity&nbsp;Provider&nbsp;SSO&nbsp;Url | Вставьте **Identity Provider Single Sign-On URL**, указанный в инструкциях по настройке IdP |
| Identity&nbsp;Provider&nbsp;Issuer | Вставьте **Identity Provider Issuer**, указанный в инструкциях по настройке IdP |
| X.509&nbsp;Certificate | Вставьте **X.509 Certificate**, указанный в инструкциях по настройке IdP; <br />**Примечание:** Когда срок действия сертификата истечёт, администратору IdP потребуется сгенерировать новый сертификат и вставить его в <Constant name="cloud" />, чтобы обеспечить непрерывный доступ к приложению. |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-6-setup-integration.png"
    title="Configuring the application in dbt" />

4. Нажмите **Save**, чтобы завершить настройку интеграции SAML 2.0.  
5. После завершения настройки вы можете перейти по URL, сгенерированному для _slug_ вашей учетной записи, чтобы протестировать вход с помощью вашего провайдера удостоверений. Кроме того, пользователи, добавленные в приложение SAML 2.0, смогут входить в <Constant name="cloud" /> напрямую из IdP.

### Additional configuration options

Раздел **Single sign-on** также содержит дополнительные параметры конфигурации, которые расположены после полей с учетными данными.

- **Sign SAML Auth Request:** <Constant name="cloud" /> будет подписывать SAML-запросы, отправляемые вашему провайдеру удостоверений, когда пользователи пытаются войти в систему. Метаданные для настройки этого параметра в вашем провайдере удостоверений можно скачать по значению, указанному в **SAML Metadata URL**. Мы рекомендуем оставлять этот параметр отключённым в большинстве случаев.

- **Attribute Mappings:** Связывает SAML-атрибуты, которые необходимы <Constant name="cloud" />, с атрибутами, которые ваш провайдер удостоверений включает в SAML-утверждения. Значение должно быть корректным JSON-объектом с ключами `email`, `first_name`, `last_name` или `groups` и значениями в виде строк или списков строк. Например, если ваш провайдер удостоверений не может включить атрибут `email` в утверждения, но включает атрибут с именем `EmailAddress`, то **Attribute Mappings** следует установить в `{ "email": "EmailAddress" }`. Эти сопоставления нужны только в том случае, если вы не можете настроить атрибуты в соответствии с инструкциями на этой странице. Если можете, значение по умолчанию `{}` является допустимым.

<Snippet path="login_url_note" />

### Настройка RBAC

После настройки провайдера идентификации вы сможете настроить [role-based access control](/docs/cloud/manage-access/enterprise-permissions) для своей учетной записи.
