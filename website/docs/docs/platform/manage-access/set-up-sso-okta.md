---
title: "Настройка SSO с Okta"
id: "set-up-sso-okta"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Настройка SSO с Okta

Тарифные планы <Constant name="dbt" /> уровня Enterprise поддерживают единый вход через Okta (с использованием SAML).

:::info SCIM доступен для Okta
После настройки единого входа (SSO) вы можете [настроить System for Cross-Domain Identity Management (SCIM)](/docs/platform/manage-access/scim-okta) с Okta, чтобы автоматизировать создание пользователей и групп, а также назначение лицензий. 
:::

В настоящее время поддерживаются следующие функции SSO:

* SSO, инициируемый IdP
* SSO, инициируемый SP
* Provisioning «just-in-time»

В этом руководстве описан процесс настройки аутентификации в <Constant name="dbt" /> с помощью Okta.

## Конфигурация в Okta {#configuration-in-okta}

### Создание нового приложения {#create-a-new-application}

Примечание: для выполнения шагов этого руководства вам понадобится доступ администратора к вашей организации Okta.

Сначала войдите в свою учетную запись Okta. В панели администратора (Admin dashboard) создайте новое приложение.

<Lightbox
    collapsed={false}
src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-1-new-app.png"
    title="Создать новое приложение"
/>

На следующем экране выберите следующие параметры:
- **Platform**: Web
- **Sign on method**: SAML 2.0

Нажмите **Create**, чтобы продолжить процесс настройки.

<Lightbox
    collapsed={false}
src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-1-new-app-create.png"
    title="Настройка нового приложения"
/>

### Настройка приложения Okta {#configure-the-okta-application}

На странице **General Settings** укажите следующие данные:

* **Название приложения**: <Constant name="dbt" />
* **Логотип приложения** (необязательно): Вы можете [скачать логотип dbt](https://cdn.sanity.io/images/wl0ndo6t/main/333fef4fc72db6f1ce4d1bc0789f355b4f0bbaa2-1280x1280.png),
  и загрузить его в Okta, чтобы использовать в качестве логотипа этого приложения.

Нажмите **Next**, чтобы продолжить.

<Lightbox
    collapsed={false}
src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-2-general-settings.png"
    title="Настройте общие параметры приложения"
/>

### Настройка SAML {#configure-saml-settings}

На странице настроек SAML настраивается взаимодействие между Okta и <Constant name="dbt" />. Используйте [соответствующий URL доступа](/docs/platform/about-platform/access-regions-ip-addresses) для вашего региона и тарифного плана.

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
src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-3-saml-settings-top.png"
    title="Настройте параметры SAML приложения"
/>

:::info Настройка имени пользователя приложения
Настройка **Application username** зависит от того, планируете ли вы использовать SCIM:
- **Только SSO:** используйте уникальное значение, например `Custom` / `user.getInternalProperty("id")` (рекомендовано на предыдущих шагах).
- **SSO и SCIM:** используйте формат **Email**. SCIM требует, чтобы имя пользователя имело формат адреса электронной почты и совпадало со значением атрибута email.
:::

Используйте формы **Attribute Statements** и **Group Attribute Statements**, чтобы
сопоставить атрибуты пользователей и групп Okta вашей организации с форматом,
который ожидает <Constant name="dbt" />.

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


**Примечание:** Вы можете использовать более строгое правило Group Attribute Statement, чем в
примере выше. Например, если названия всех ваших групп <Constant name="dbt" /> начинаются с
`DBT_CLOUD_`, можно использовать фильтр вида `Starts With: DBT_CLOUD_`. **Okta
возвращает не более 100 групп для каждого пользователя, поэтому, если ваши пользователи состоят более чем в 100
группах IdP, необходимо использовать более строгий фильтр**. Обратитесь в
службу поддержки, если у вас возникнут вопросы.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-3-saml-settings-bottom.png"
    title="Настройка правил атрибутов пользователей и групп для приложения"
/>

Нажмите **Next**, чтобы продолжить.

### Завершение настройки в Okta {#finish-okta-setup}

Выберите *I'm an Okta customer adding an internal app*, а затем
*This is an internal app that we have created*. Нажмите **Finish**, чтобы завершить настройку.


<Lightbox
    collapsed={false}
src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-4-feedback.png"
    title="Завершение настройки в Okta"
/>

### Просмотр инструкций по настройке {#view-setup-instructions}

На следующей странице нажмите **View Setup Instructions**. В следующих шагах
вы укажете эти значения в настройках аккаунта <Constant name="dbt" />, чтобы завершить
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

## Конфигурация в dbt {#configuration-in-dbt}

Чтобы завершить настройку, выполните приведенные ниже действия в <Constant name="dbt" />.

### Указание учетных данных {#supplying-credentials}

1. Перейдите в **Account settings** > **SSO & SCIM**.
2. Нажмите **Get started**, если SSO ещё не настроен, или **Edit**, если настройка уже выполнена.
3. Укажите следующие данные SSO:

| Поле | Значение |
| ----- | ----- |
| **Log&nbsp;in&nbsp;with** | Okta |
| **Identity&nbsp;Provider&nbsp;SSO&nbsp;Url** | Вставьте **Identity Provider Single Sign-On URL**, указанный в инструкциях по настройке Okta |
| **Identity&nbsp;Provider&nbsp;Issuer** | Вставьте **Identity Provider Issuer**, указанный в инструкциях по настройке Okta |
| **X.509&nbsp;Certificate** | Вставьте **X.509 Certificate**, указанный в инструкциях по настройке Okta; <br />**Примечание:** Когда срок действия сертификата истечёт, администратору Okta потребуется создать новый сертификат и вставить его в <Constant name="dbt" />, чтобы обеспечить бесперебойный доступ к приложению. |


<Lightbox
    collapsed={false}
src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-6-setup-integration.png"
    title="Настройка приложения в dbt"
/>

4. Нажмите **Save**, чтобы завершить настройку интеграции с Okta. После
    этого вы можете перейти по URL, созданному для _slug_ вашей учетной записи, чтобы
    проверить вход через Okta. Кроме того, пользователи, добавленные в приложение Okta,
    смогут входить в <Constant name="dbt" /> непосредственно из Okta.

<Snippet path="login_url_note" />


## Настройка RBAC
Теперь, когда вы завершили настройку SSO с Okta, следующим шагом будет настройка
[групп RBAC](/docs/platform/manage-access/about-user-access#role-based-access-control-), чтобы завершить конфигурацию управления доступом.

:::tip Настройка SCIM
Теперь, когда вы настроили SSO с Okta, вы можете [настроить SCIM](/docs/platform/manage-access/scim-okta), чтобы автоматизировать создание и обновление пользователей и групп (а также назначение лицензий для Okta).
:::

## Часто задаваемые вопросы и устранение неполадок

Ответы на распространённые вопросы и рекомендации по устранению неполадок, включая проблемы с подтверждением адреса электронной почты, запросами MFA и сопоставлением групп SSO, см. в разделе [Часто задаваемые вопросы о SSO и устранение неполадок](/docs/platform/manage-access/sso-faq).

## Узнать больше {#learn-more}

<WistiaVideo id="xtmk0rrk5k" paddingTweak="62.25%" />
