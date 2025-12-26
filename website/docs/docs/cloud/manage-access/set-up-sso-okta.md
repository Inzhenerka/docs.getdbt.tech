---
title: "Настройка SSO с Okta"
id: "set-up-sso-okta"
---

# Set up SSO with Okta <Lifecycle status="managed, managed_plus" />

<Constant name="cloud" /> Тарифные планы уровня Enterprise поддерживают единый вход (single sign-on) через Okta (с использованием SAML). В настоящее время поддерживаются следующие возможности:

* Инициированное IdP SSO
* Инициированное SP SSO
* Провизия "по требованию"

В этом руководстве описан процесс настройки аутентификации в <Constant name="cloud" /> с использованием Okta.

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

* **App name**: <Constant name="cloud" />
* **App logo** (необязательно): при желании вы можете [скачать логотип dbt](https://www.getdbt.com/ui/img/dbt-icon.png)
  и загрузить его в Okta, чтобы использовать в качестве логотипа для этого приложения.

Нажмите **Next**, чтобы продолжить.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-2-general-settings.png"
    title="Настройка общих параметров приложения"
/>

### Настройка SAML

Страница **SAML Settings** настраивает способ взаимодействия Okta и <Constant name="cloud" />. Вам потребуется использовать [подходящий Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и тарифного плана.

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
сопоставить атрибуты пользователей и групп Okta вашей организации с форматом,
который ожидает <Constant name="cloud" />.

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


**Примечание:** Вы можете использовать более строгий Group Attribute Statement, чем в примере выше. Например, если все ваши группы <Constant name="cloud" /> начинаются с `DBT_CLOUD_`, вы можете использовать фильтр вида `Starts With: DBT_CLOUD_`. **Okta возвращает только 100 групп для каждого пользователя, поэтому, если ваши пользователи состоят более чем в 100 группах IdP, вам потребуется использовать более строгий фильтр**. Если у вас возникнут вопросы, пожалуйста, обратитесь в службу поддержки.

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

На следующей странице нажмите **View Setup Instructions**. В шагах ниже
вам потребуется указать эти значения в настройках аккаунта <Constant name="cloud" />, чтобы завершить
интеграцию между Okta и <Constant name="cloud" />.

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

## Настройка в dbt

Чтобы завершить настройку, выполните следующие шаги в <Constant name="cloud" />.

### Предоставление учетных данных

Сначала перейдите на страницу **Enterprise &gt; Single Sign On** в разделе настроек учетной записи. Затем нажмите кнопку **Edit** и укажите следующие данные SSO:


| Поле | Значение |
| ----- | ----- |
| **Log&nbsp;in&nbsp;with** | Okta |
| **Identity&nbsp;Provider&nbsp;SSO&nbsp;Url** | Вставьте **Identity Provider Single Sign-On URL**, указанный в инструкциях по настройке Okta |
| **Identity&nbsp;Provider&nbsp;Issuer** | Вставьте **Identity Provider Issuer**, указанный в инструкциях по настройке Okta |
| **X.509&nbsp;Certificate** | Вставьте **X.509 Certificate**, указанный в инструкциях по настройке Okta; <br />**Примечание:** когда срок действия сертификата истечёт, администратору Okta потребуется сгенерировать новый сертификат и вставить его в <Constant name="cloud" />, чтобы обеспечить непрерывный доступ к приложению.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-6-setup-integration.png"
    title="настройка приложения в dbt"
/>

21. Нажмите **Save**, чтобы завершить настройку интеграции с Okta. После этого
    вы можете перейти по URL, сгенерированному для _slug_ вашей учетной записи,
    чтобы проверить вход в систему с помощью Okta. Кроме того, пользователи,
    добавленные в приложение Okta, смогут входить в <Constant name="cloud" />
    напрямую из Okta.

<Snippet path="login_url_note" />


## Настройка RBAC
Теперь, когда вы завершили настройку SSO с Okta, следующим шагом будет настройка
[групп RBAC](/docs/cloud/manage-access/about-user-access#role-based-access-control-),
чтобы завершить конфигурацию управления доступом.

## Узнать больше

<WistiaVideo id="xtmk0rrk5k" paddingTweak="62.25%" />
