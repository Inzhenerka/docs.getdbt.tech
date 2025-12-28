---
title: "Настройка SSO с Okta"
id: "set-up-sso-okta"
---

# Настройка SSO с Okta <Lifecycle status="managed, managed_plus" />

Тарифы уровня Enterprise в <Constant name="cloud" /> поддерживают единый вход (Single Sign-On) через Okta (с использованием SAML). В настоящее время поддерживаются следующие возможности:

* SSO, инициируемый IdP
* SSO, инициируемый SP
* Provisioning «just-in-time»

В этом руководстве описан процесс настройки аутентификации в <Constant name="cloud" /> с помощью Okta.

## Конфигурация в Okta

### Создание нового приложения

Примечание: для выполнения шагов этого руководства вам понадобится доступ администратора к вашей организации Okta.

Сначала войдите в свою учетную запись Okta. В панели администратора (Admin dashboard) создайте новое приложение.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app.png"
    title="Создание нового приложения"
/>

На следующем экране выберите следующие параметры:
- **Platform**: Web
- **Sign on method**: SAML 2.0

Нажмите **Create**, чтобы продолжить процесс настройки.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app-create.png"
    title="Настройка нового приложения"
/>

### Настройка приложения Okta

На странице **General Settings** укажите следующие данные:

* **App name**: <Constant name="cloud" />
* **App logo** (необязательно): при желании вы можете [скачать логотип dbt](https://www.getdbt.com/ui/img/dbt-icon.png)
  и загрузить его в Okta, чтобы использовать в качестве логотипа приложения.

Нажмите **Next**, чтобы продолжить.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-2-general-settings.png"
    title="Настройка общих параметров приложения"
/>

### Настройка SAML

Страница SAML Settings определяет, как Okta и <Constant name="cloud" /> обмениваются данными. Вам нужно использовать [подходящий Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и тарифного плана.

import LoginSlug from '/snippets/_login-slug.md';

<LoginSlug />

<Snippet path="access_url" />

* **Single sign on URL**: `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
* **Audience URI (SP Entity ID)**: `urn:auth0:<YOUR_AUTH0_ENTITYID>:{login URL slug}`
* **Relay State**: `<login URL slug>`
* **Name ID format**: `Unspecified`
* **Application username**: `Custom` / `user.getInternalProperty("id")`
* **Update Application username on**: `Create and update`

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-top.png"
    title="Настройка параметров SAML приложения"
/>

Используйте формы **Attribute Statements** и **Group Attribute Statements**, чтобы
сопоставить пользовательские и групповые атрибуты Okta вашей организации с форматом,
который ожидает <Constant name="cloud" />.

Ожидаемые **User Attribute Statements**:

| Имя           | Формат имени | Значение                | Описание                     |
| -------------- | ----------- | -------------------- | ------------------------------- |
| `email`        | Не указано | `user.email`      | _Адрес электронной почты пользователя_ |
| `first_name`   | Не указано | `user.firstName`  | _Имя пользователя_              |
| `last_name`    | Не указано | `user.lastName`   | _Фамилия пользователя_          |


Ожидаемые **Group Attribute Statements**:

| Имя     | Формат имени | Фильтр        | Значение | Описание                                   |
| -------- | ----------- | ------------- | ----- | --------------------------------------------- |
| `groups` | Не указано | Соответствует регулярному выражению | `.*`  | _Группы, в которые входит пользователь_       |


**Примечание:** вы можете использовать более строгие условия для Group Attribute Statements, чем показано в примере выше. Например, если все группы <Constant name="cloud" /> в вашей организации начинаются с
`DBT_CLOUD_`, вы можете использовать фильтр `Starts With: DBT_CLOUD_`. **Okta
возвращает не более 100 групп для каждого пользователя, поэтому если ваши пользователи состоят более чем в 100 группах IdP, вам потребуется использовать более ограничивающий фильтр**. Если у вас есть вопросы, пожалуйста, свяжитесь со службой поддержки.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-bottom.png"
    title="Настройка пользовательских и групповых атрибутов приложения"
/>

Нажмите **Next**, чтобы продолжить.

### Завершение настройки в Okta

Выберите *I'm an Okta customer adding an internal app* и затем *This is an
internal app that we have created*. Нажмите **Finish**, чтобы завершить настройку
приложения.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-4-feedback.png"
    title="Завершение настройки в Okta"
/>

### Просмотр инструкций по настройке

На следующей странице нажмите **View Setup Instructions**. В дальнейших шагах
вы будете использовать эти значения в настройках учетной записи <Constant name="cloud" />, чтобы завершить интеграцию между Okta и <Constant name="cloud" />.

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

## Конфигурация в dbt

Чтобы завершить настройку, выполните следующие шаги в <Constant name="cloud" />.

### Указание учетных данных

Сначала перейдите на страницу **Enterprise &gt; Single Sign On** в разделе Account
Settings. Затем нажмите кнопку **Edit** и укажите следующие параметры SSO:

| Поле | Значение |
| ----- | ----- |
| **Войти&nbsp;с&nbsp;помощью** | Okta |
| **Identity&nbsp;Provider&nbsp;SSO&nbsp;Url** | Вставьте значение **Identity Provider Single Sign-On URL**, указанное в инструкциях по настройке Okta |
| **Identity&nbsp;Provider&nbsp;Issuer** | Вставьте значение **Identity Provider Issuer**, указанное в инструкциях по настройке Okta |
| **X.509&nbsp;Certificate** | Вставьте значение **X.509 Certificate**, указанное в инструкциях по настройке Okta; <br />**Примечание:** когда срок действия сертификата истечет, администратору Okta потребуется сгенерировать новый сертификат и вставить его в <Constant name="cloud" />, чтобы обеспечить непрерывный доступ к приложению. |


<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-6-setup-integration.png"
    title="Настройка приложения в dbt"
/>

21. Нажмите **Save**, чтобы завершить настройку интеграции с Okta. После этого
    вы сможете перейти по URL, сгенерированному для _slug_ вашей учетной записи,
    чтобы протестировать вход через Okta. Кроме того, пользователи, добавленные
    в приложение Okta, смогут входить в <Constant name="cloud" /> напрямую из Okta.

<Snippet path="login_url_note" />


## Настройка RBAC
Теперь, когда вы завершили настройку SSO с Okta, следующим шагом будет настройка
[групп RBAC](/docs/cloud/manage-access/about-user-access#role-based-access-control-), чтобы завершить конфигурацию управления доступом.

## Узнать больше

<WistiaVideo id="xtmk0rrk5k" paddingTweak="62.25%" />
