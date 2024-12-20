---
title: "Настройка SSO с Okta"
id: "set-up-sso-okta"
---

import SetUpPages from '/snippets/_sso-docs-mt-available.md';

<SetUpPages features={'/snippets/_sso-docs-mt-available.md'}/>

## Okta SSO

dbt Cloud Enterprise поддерживает одноразовую аутентификацию (SSO) через Okta (с использованием SAML). В настоящее время поддерживаются следующие функции:

* Инициированное IdP SSO
* Инициированное SP SSO
* Провизия "по требованию"

Это руководство описывает процесс настройки аутентификации в dbt Cloud с помощью Okta.

## Конфигурация в Okta

### Создание нового приложения

Примечание: Вам потребуется доступ администратора к вашей организации Okta, чтобы следовать этому руководству.

Сначала войдите в свою учетную запись Okta. Используя панель администратора, создайте новое приложение.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app.png"
    title="Создание нового приложения"
/>

На следующем экране выберите следующие настройки:
- **Платформа**: Web
- **Метод входа**: SAML 2.0

Нажмите **Create**, чтобы продолжить процесс настройки.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app-create.png"
    title="Настройка нового приложения"
/>

### Настройка приложения Okta

На странице **Общие настройки** введите следующие данные:

* **Имя приложения**: dbt Cloud
* **Логотип приложения** (необязательно): Вы можете [скачать логотип dbt](https://www.getdbt.com/ui/img/dbt-icon.png) и загрузить его в Okta, чтобы использовать в качестве логотипа для этого приложения.

Нажмите **Next**, чтобы продолжить.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-2-general-settings.png"
    title="Настройка общих параметров приложения"
/>

### Настройка SAML

Страница настроек SAML определяет, как Okta и dbt Cloud будут взаимодействовать. Вам потребуется использовать [соответствующий URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.

Для завершения этого раздела вам потребуется _login slug_. Этот slug контролирует URL, по которому пользователи вашей учетной записи могут войти в ваше приложение через Okta. Обычно login slugs представляют собой название вашей организации в нижнем регистре, разделенное дефисами. Он должен содержать только буквы, цифры и дефисы. Например, _login slug_ для dbt Labs будет `dbt-labs`. Login slugs должны быть уникальными для всех учетных записей dbt Cloud, поэтому выберите slug, который уникально идентифицирует вашу компанию.

<Snippet path="access_url" />

* **URL одноразовой аутентификации**: `https://YOUR_AUTH0_URI/login/callback?connection=<login slug>`
* **Audience URI (SP Entity ID)**: `urn:auth0:<YOUR_AUTH0_ENTITYID>:{login slug}`
* **Relay State**: `<login slug>`

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-top.png"
    title="Настройка параметров SAML приложения"
/>

<!-- TODO : Нужно ли пользователям изменять формат Name ID и имя пользователя приложения на этом экране? -->

Используйте формы **Attribute Statements** и **Group Attribute Statements**, чтобы сопоставить атрибуты пользователей и групп вашей организации в Okta с форматом, который ожидает dbt Cloud.

Ожидаемые **User Attribute Statements**:

| Имя           | Формат имени | Значение                | Описание                |
| -------------- | ----------- | -------------------- | -------------------------- |
| `email`        | Не указан | `user.email`      | _Электронная почта пользователя_ |
| `first_name`   | Не указан | `user.firstName`  | _Имя пользователя_    |
| `last_name`    | Не указан | `user.lastName`   | _Фамилия пользователя_     |


Ожидаемые **Group Attribute Statements**:

| Имя     | Формат имени | Фильтр        | Значение | Описание                           |
| -------- | ----------- | ------------- | ----- | ------------------------------------- |
| `groups` | Не указан | Соответствует регулярному выражению | `.*`  | _Группы, к которым принадлежит пользователь_ |


**Примечание:** Вы можете использовать более строгий Group Attribute Statement, чем показано в примере выше. Например, если все ваши группы dbt Cloud начинаются с `DBT_CLOUD_`, вы можете использовать фильтр, такой как `Starts With: DBT_CLOUD_`. **Okta возвращает только 100 групп для каждого пользователя, поэтому, если ваши пользователи принадлежат более чем 100 группам IdP, вам потребуется использовать более строгий фильтр**. Пожалуйста, свяжитесь с поддержкой, если у вас есть вопросы.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-bottom.png"
    title="Настройка атрибутов пользователей и групп приложения"
/>

Нажмите **Next**, чтобы продолжить.

### Завершение настройки Okta

Выберите *Я клиент Okta, добавляющий внутреннее приложение*, и выберите *Это внутреннее приложение, которое мы создали*. Нажмите **Finish**, чтобы завершить настройку приложения.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-4-feedback.png"
    title="Завершение настройки в Okta"
/>

### Просмотр инструкций по настройке

На следующей странице нажмите **View Setup Instructions**. На следующих шагах вы предоставите эти значения в настройках учетной записи dbt Cloud, чтобы завершить интеграцию между Okta и dbt Cloud.

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

## Конфигурация в dbt Cloud

Чтобы завершить настройку, выполните следующие шаги в dbt Cloud.

### Предоставление учетных данных

Сначала перейдите на страницу **Enterprise &gt; Single Sign On** в разделе настроек учетной записи. Затем нажмите кнопку **Edit** и укажите следующие данные SSO:

:::note Login Slugs

Slug, настроенный здесь, должен иметь такое же значение, как и **Okta RelayState**, настроенный на предыдущих шагах.

:::

| Поле | Значение |
| ----- | ----- |
| **Log&nbsp;in&nbsp;with** | Okta |
| **Identity&nbsp;Provider&nbsp;SSO&nbsp;Url** | Вставьте **URL одноразовой аутентификации провайдера идентификации**, показанный в инструкциях по настройке Okta |
| **Identity&nbsp;Provider&nbsp;Issuer** | Вставьте **Поставщик удостоверений**, показанный в инструкциях по настройке Okta |
| **X.509&nbsp;Certificate** | Вставьте **Сертификат X.509**, показанный в инструкциях по настройке Okta; <br />**Примечание:** Когда срок действия сертификата истечет, администратор Okta должен будет сгенерировать новый, чтобы вставить его в dbt Cloud для непрерывного доступа к приложению. |
| **Slug** | Введите желаемый login slug. Пользователи смогут войти в dbt Cloud, перейдя по адресу `https://YOUR_ACCESS_URL/enterprise-login/LOGIN-SLUG`, заменив `YOUR_ACCESS_URL` на [соответствующий URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана. Login slugs должны быть уникальными для всех учетных записей dbt Cloud, поэтому выберите slug, который уникально идентифицирует вашу компанию. |

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-6-setup-integration.png"
    title="Настройка приложения в dbt Cloud"
/>

21. Нажмите **Save**, чтобы завершить настройку интеграции с Okta. Отсюда вы можете перейти по URL, сгенерированному для _slug_ вашей учетной записи, чтобы протестировать вход с помощью Okta. Кроме того, пользователи, добавленные в приложение Okta, смогут войти в dbt Cloud непосредственно из Okta.

<Snippet path="login_url_note" />

## Настройка RBAC
Теперь, когда вы завершили настройку SSO с Okta, следующими шагами будет настройка [групп RBAC](/docs/cloud/manage-access/about-user-access#role-based-access-control-) для завершения конфигурации управления доступом.