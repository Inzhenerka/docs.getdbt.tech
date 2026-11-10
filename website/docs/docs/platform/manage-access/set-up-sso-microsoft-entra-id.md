---
title: "Настройка SSO с Microsoft Entra ID (ранее Azure AD)"
description: "Узнайте, как администраторы dbt могут использовать Microsoft Entra ID для управления доступом в аккаунте dbt."
id: "set-up-sso-microsoft-entra-id"
sidebar_label: "Настройка SSO с Microsoft Entra ID"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

import LoginSlug from '/snippets/_login-slug.md';

# Настройка SSO с Microsoft Entra ID

Тарифные планы уровня Enterprise в <Constant name="dbt" /> поддерживают единый вход через Microsoft Entra ID (ранее Azure AD). 

:::info SCIM доступен для Entra ID
После настройки единого входа (SSO) вы можете [настроить System for Cross-Domain Identity Management (SCIM)](/docs/platform/manage-access/scim-entra-id) с Entra ID, чтобы автоматизировать создание и управление пользователями и группами. 
:::

В настоящее время поддерживаются следующие возможности SSO:

* SSO, инициируемый поставщиком удостоверений (IdP)
* SSO, инициируемый поставщиком услуг (SP)
* Создание пользователей при первом входе (Just-in-time provisioning)

## Конфигурация

<Constant name="dbt" /> поддерживает как однотенантные, так и мультитенантные подключения SSO Microsoft Entra ID (ранее Azure AD). Для большинства корпоративных сценариев при создании приложения Microsoft Entra ID рекомендуется использовать однотенантный вариант.

### Создание приложения {#creating-an-application}

Войдите на портал Azure вашей организации. На странице [**Microsoft Entra ID**](https://portal.azure.com/#home) выберите нужный каталог, а затем зарегистрируйте новое приложение.

1. В разделе **Manage** выберите **App registrations**.
2. Нажмите **+ New Registration**, чтобы начать регистрацию нового приложения.

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/azure/azure-app-registration-empty.png" width="80%" title="Создание новой регистрации приложения"/>

3. Задайте настройки для полей **Name** и **Supported account types**. Выберите значение **Supported account types** в зависимости от того, каким тенантам вы хотите разрешить доступ, и запишите соответствующее значение **Microsoft Entra ID Domain**, которое понадобится позже при [указании учетных данных](#supplying-credentials) в <Constant name="dbt" />:

<SimpleTable>
| Потребность клиента | Supported account types (Azure) | Значение для поля Microsoft Entra ID Domain в dbt |
| ----- | ----- | ----- |
| Только один тенант _(по умолчанию, рекомендуется для большинства корпоративных сценариев)_ | Accounts in this organizational directory only | Основное доменное имя вашего каталога Azure |
| Несколько определенных тенантов Entra ID | Accounts in organizational directories set by Entra admin | `organizations` |
| Любой тенант организации и личные учетные записи Microsoft | Accounts in any organizational directory and personal Microsoft accounts | `common` |
| Только личные учетные записи Microsoft | Personal Microsoft accounts only | `consumers` |
</SimpleTable>

4. (Необязательно) Чтобы обеспечить корректную работу мультитенантной конфигурации, помимо выбора «Multi-tenant» в настройках учетной записи Azure, необходимо внести два важных изменения:

   - Обновите Microsoft Entra ID Domain: в поле «Microsoft Entra ID Domain:» в dbt введите соответствующую строку центра авторизации (`organizations`, `common` или `consumers`), а не доменное имя вашего каталога Azure. Подробнее см. в разделе [Указание учетных данных](#supplying-credentials).
   - Предоставьте согласие администратора для каждого тенанта: поскольку это требование Entra (ранее Azure AD), администратор каждого отдельного тенанта должен предоставить согласие. Если пользователи из других тенантов попытаются войти до выполнения этого действия, они увидят экран «admin approval required». Администратор может решить эту проблему, перейдя по специальному URL-адресу согласия, предоставленному Microsoft для его тенанта (например, `https://login.microsoftonline.com/{TENANT_ID}/adminconsent?client_id={CLIENT_ID}`).

5. Настройте **Redirect URI**. Установите тип **Web** и используйте таблицу ниже, чтобы выбрать подходящие значения Redirect URI для однотенантных и мультитенантных развертываний приложения Entra ID. Для большинства корпоративных сценариев рекомендуется использовать однотенантный Redirect URI. Замените `YOUR_AUTH0_URI` на [соответствующий URI Auth0](/docs/platform/manage-access/sso-overview#auth0-uris) для вашего региона и тарифного плана.

**Примечание:** Тип тенантности вашей платформы dbt не влияет на эту настройку. Эта настройка приложения Entra ID определяет доступ к приложению:
     - **Однотенантное:** доступ к приложению могут получить только пользователи вашего тенанта Entra ID.
     - **Мультитенантное:** доступ к приложению могут получить пользователи _любого_ тенанта Entra ID.


<SimpleTable>
| Тип приложения | Redirect URI |
| ----- | ----- |
| Однотенантное _(рекомендуется)_ | `https://YOUR_AUTH0_URI/login/callback` |
| Мультитенантное | `https://YOUR_AUTH0_URI/login/callback` |
</SimpleTable>

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/azure/azure-new-application-alternative.png" width="70%" title="Настройка новой регистрации приложения"/>

6. Сохраните регистрацию приложения, чтобы продолжить настройку SSO Microsoft Entra ID.

:::info Настройка в новом интерфейсе Microsoft Entra ID (необязательно)

В зависимости от настроек Microsoft Entra ID страница регистрации приложения может отличаться от приведенных выше снимков экрана. Если на странице **New Registration** вам _не_ предлагается настроить Redirect URI, выполните шаги 7–8 ниже после создания регистрации приложения. Если вы уже настроили Redirect URI на предыдущих шагах, перейдите к [шагу 8](#adding-users-to-an-enterprise-application).
:::

7. После регистрации нового приложения без указания Redirect URI нажмите **App registration**, а затем перейдите на вкладку **Authentication** нового приложения.

8. Нажмите **+ Add platform** и введите Redirect URI для вашего приложения. Дополнительные сведения о правильном значении Redirect URI для приложения <Constant name="dbt" /> см. в шаге 4 выше.
    
    :::info Тип платформы

    При выборе типа платформы укажите **Web**, а не **Single-page application (SPA)**. Интеграция SSO <Constant name="dbt" /> обменивает код авторизации на токен с сервера, используя секрет клиента. Поэтому, если добавить **Redirect URI** в разделе **SPA**, Entra ID потребует PKCE и отклонит обмен кода на токен на стороне сервера, что приведет к сбою входа с ошибкой `AADSTS9002325: Proof Key for Code Exchange is required for cross-origin authorization code redemption.`

    :::

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/azure/azure-redirect-uri.png" title="Настройка Redirect URI"/>

### Сопоставление пользователей и групп Azure &lt;-&gt; dbt

:::info

Существует [ограничение](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#important-caveats-for-this-functionality) на количество групп, передаваемых Azure через токен SSO (не более 150). Это означает, что если пользователь состоит более чем в 150 группах, будет казаться, что он не состоит ни в одной. Чтобы избежать этого, настройте [назначения групп](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal?pivots=portal) для приложения <Constant name="dbt" /> в Azure и задайте [утверждение о группах](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#add-group-claims-to-tokens-for-saml-applications-using-sso-configuration), чтобы Azure передавал только соответствующие группы.

:::


Пользователи и группы Azure, которые вы создадите на следующих шагах, сопоставляются с группами, созданными в <Constant name="dbt" />, по имени группы. Дополнительные сведения о настройке пользователей, групп и наборов разрешений в <Constant name="dbt" /> см. в документации по [корпоративным разрешениям](/docs/platform/manage-access/enterprise-permissions).

<Constant name="dbt_platform" /> использует **User principal name** (UPN) в Microsoft Entra ID для идентификации и сопоставления пользователей, входящих в <Constant name="dbt" /> через SSO. UPN обычно имеет формат адреса электронной почты.

### Добавление пользователей в корпоративное приложение {#adding-users-to-an-enterprise-application}

После регистрации приложения необходимо назначить ему пользователей. Добавьте пользователей, которые должны быть доступны в dbt, выполнив следующие шаги:

8. Вернитесь в [**Default Directory**](https://portal.azure.com/#home) (или **Home**) и нажмите **Enterprise Applications**.
9. Нажмите имя приложения, созданного ранее.
10. Нажмите **Assign Users and Groups**.
11. Нажмите **Add User/Group**.
12. При необходимости назначьте дополнительных пользователей и группы.

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/azure/azure-enterprise-app-users.png" title="Добавление пользователей в корпоративное приложение и настройка Redirect URI"/>

:::info Требуется назначение пользователей?
В разделе **Properties** проверьте положение переключателя **User assignment required?** и убедитесь, что оно соответствует вашим требованиям. Большинству клиентов рекомендуется установить значение **Yes**, чтобы входить могли только пользователи и группы, явно назначенные приложению <Constant name="dbt" />. Если установлено значение **No**, любой пользователь сможет получить доступ к приложению по прямой ссылке, как указано в [документации Microsoft Entra ID](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/assign-user-or-group-access-portal#configure-an-application-to-require-user-assignment).
:::

### Настройка разрешений {#configuring-permissions}

13. Вернитесь в [**Default Directory**](https://portal.azure.com/#home) (или **Home**), а затем в **App registration**.
14. Выберите свое приложение, затем выберите **API permissions**.
15. Нажмите **+Add a permission** и добавьте разрешения, указанные в следующей таблице:

<SimpleTable>

| Имя API | Тип | Разрешение | Обязательно? |
| --- | --- | --- | --- |
| Microsoft Graph | Delegated | `User.Read` | Да |
| Microsoft Graph | Delegated | `GroupMember.Read.All` | Да |
| Microsoft Graph | Delegated | `Directory.Read.All` | Необязательно — может потребоваться, если пользователи назначены более чем 200 группам |

</SimpleTable>

Для области доступа по умолчанию требуются только `User.Read` и `GroupMember.Read.All`. Если вы назначаете пользователя более чем 200 группам, может потребоваться предоставить дополнительные разрешения, например `Directory.Read.All`. 

:::info SSO, настроенный до декабря 2025 года
Если вы настроили SSO до декабря 2025 года, существующая конфигурация может запрашивать `Directory.Read.All` вместо `GroupMember.Read.All`. Чтобы использовать обновленные области доступа, удалите и заново создайте [конфигурацию](#configuring-permissions) SSO.
:::

16. Сохраните эти разрешения, затем нажмите **Grant admin consent**, чтобы предоставить согласие администратора для этого каталога от имени всех ваших пользователей.

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/azure/azure-permissions-overview.png" title="Настройка разрешений приложения" />

### Создание секрета клиента

17. В разделе **Manage** нажмите **Certificates & secrets**.
18. Нажмите **+New client secret**.
19. Назовите секрет клиента "<Constant name="dbt" />" (или аналогичным образом), чтобы его можно было идентифицировать.
20. Выберите **730 days (24 months)** в качестве срока действия этого секрета (рекомендуется).
21. Нажмите **Add**, чтобы завершить создание значения секрета клиента (не идентификатора секрета клиента).
22. Сохраните сгенерированный секрет клиента в надежном месте. Позже в процессе настройки мы используем этот секрет клиента в <Constant name="dbt" />, чтобы завершить настройку интеграции.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/azure/azure-secret-config.png" title="Настройка сертификатов и секретов" />

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/azure/azure-secret-saved.png" title="Сохранение секрета клиента" />

</DocCarousel>

### Получение учетных данных клиента

23. Перейдите на страницу **Overview** регистрации приложения.
24. Найдите **Application (client) ID** и **Directory (tenant) ID**, показанные в этой форме, и сохраните их вместе с секретом клиента. Мы используем эти ключи на следующих шагах, чтобы завершить настройку интеграции в <Constant name="dbt" />.

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/azure/azure-overview.png" title="Получение учетных данных. Сохраните их в надежном месте" />

## Настройка dbt

Чтобы завершить настройку, выполните следующие шаги в приложении <Constant name="dbt" />.

### Указание учетных данных {#supplying-credentials}

<LoginSlug />

25. В <Constant name="dbt" /> нажмите имя своего аккаунта в меню слева и выберите **Account settings**.
26. Выберите **SSO & SCIM** в меню.
27. Нажмите **Get started**, если SSO еще не настроен, или **Edit**, если он уже настроен.
28. Укажите следующие данные SSO:

<SimpleTable>
| Поле | Значение |
| ----- | ----- |
| **Log&nbsp;in&nbsp;with** | Microsoft Entra ID Single Tenant или Microsoft Entra ID Multi Tenant, если вы выбрали мультитенантное значение **Supported account types** |
| **Client&nbsp;ID** | Вставьте **Application (client) ID**, сохраненный на предыдущих шагах |
| **Client&nbsp;Secret** | Вставьте **Client Secret** из предыдущих шагов (не забудьте использовать Secret Value, а не Secret ID); <br />**Примечание:** Когда срок действия секрета клиента истечет, администратору Entra ID потребуется сгенерировать новый секрет и вставить его в <Constant name="dbt" />, чтобы обеспечить непрерывный доступ к приложению. |
| **Tenant&nbsp;ID** | Вставьте **Directory (tenant) ID**, сохраненный на предыдущих шагах. (Это поле отображается только при выборе **Microsoft Entra ID Single Tenant**; для мультитенантной конфигурации оно не требуется.) |
| **Microsoft&nbsp;Entra&nbsp;ID&nbsp;Domain** | Для однотенантной конфигурации введите доменное имя вашего каталога Azure (например, `fishtownanalytics.com`). Используйте только основной домен; это не заблокирует доступ для других доменов. Для мультитенантной конфигурации вместо этого введите соответствующую строку центра авторизации (`organizations`, `common` или `consumers`). См. [таблицу Supported account types](#creating-an-application). |
</SimpleTable>
  
<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/azure/azure-cloud-sso.png" title="Настройка SSO Entra ID AD в dbt" />

29.  Нажмите **Save**, чтобы завершить настройку интеграции SSO Microsoft Entra ID. После этого вы можете перейти по URL-адресу входа, сгенерированному для _slug_ вашего аккаунта, и проверить вход через Entra ID.

<Snippet path="login_url_note" />

### Дополнительные параметры конфигурации

Раздел **Single sign-on** также содержит дополнительные параметры конфигурации, расположенные после полей учетных данных.

- **Include all groups:** Получать от поставщика удостоверений все группы, в которые входит пользователь. Если пользователь является участником вложенных групп, будут также включены родительские группы. Когда этот параметр отключен, передаются только группы, непосредственным участником которых является пользователь.  По умолчанию этот параметр включен.

- **Maximum number of groups to retrieve:** Позволяет настроить ограничение на количество групп, получаемых для пользователей.  По умолчанию установлено значение 250 групп, но его можно увеличить, если пользователи состоят в большем количестве групп.

## Настройка RBAC
Теперь, когда настройка SSO с Entra ID завершена, следующим шагом будет настройка
[групп RBAC](/docs/platform/manage-access/enterprise-permissions) для завершения конфигурации управления доступом.

:::tip Настройте SCIM
Теперь, когда вы настроили SSO с Entra ID, вы можете [настроить SCIM](/docs/platform/manage-access/scim-entra-id), чтобы автоматизировать создание и управление пользователями и группами.
:::

## Советы по устранению неполадок


<Expandable alt_header="Возникает ошибка 'AADSTS90094: Admin consent is required'">

Если вы настроили SSO до декабря 2025 года, существующая конфигурация может запрашивать `Directory.Read.All` вместо `GroupMember.Read.All`. Чтобы использовать обновленные области доступа, удалите и заново создайте [конфигурацию](#configuring-permissions) SSO.

</Expandable>

<Expandable alt_header="Несоответствие доменного имени">

Убедитесь, что доменное имя, к которому относятся учетные записи пользователей в Azure, совпадает с доменом, указанным в разделе [Указание учетных данных](#supplying-credentials) при настройке SSO.

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/azure/azure-get-domain.png" title="Получение домена пользователя из Azure" />

</Expandable>

<Expandable alt_header="После входа появляется сообщение 'Server error'">

После завершения процедуры входа в Entra ID вы перенаправляетесь обратно на страницу входа <Constant name="dbt_platform" /> и видите следующее сообщение:
```
Server error! There was a server error. Please try again, or contact support@getdbt.com if this persists.
```

Обычно это происходит, когда Microsoft Entra ID не может найти сертификат подписи SAML, настроенный для приложения. Исходная ошибка (`AADSTS500031: Cannot find signing certificate configured`) пользователю не отображается.

Чтобы убедиться, что причина именно в этом:
1. Откройте в Entra ID **Enterprise Applications → YOUR_APP → Sign-in logs**. 
2. Отфильтруйте записи по статусу **Failure**. 
3. Если вы видите там ошибку `AADSTS500031`, устраните ее, перейдя в **Enterprise Applications → YOUR_APP → Single sign-on → SAML Signing Certificate**, и добавьте отсутствующий сертификат. 
4. Если сертификат существует, но поврежден, создайте новый сертификат, задайте срок действия, отметьте его как **Active**, чтобы заменить существующий, а затем удалите неиспользуемый сертификат.

</Expandable>

Дополнительные сведения об устранении неполадок &mdash; включая запросы «Admin consent required» для новых пользователей, сообщение «Access Denied» после аутентификации SAML и проблемы при изменении Entity ID или ACS URL &mdash; см. в разделе [Часто задаваемые вопросы о SSO и устранение неполадок](/docs/platform/manage-access/sso-faq).

## Узнайте больше из видео
В следующем видео объясняется, как настроить SSO с Microsoft Entra ID:

<video width="100%" height="100%" playsinline controls>
  <source src="/img/docs/dbt-platform/dbt-platform-enterprise/access-control/sso-dbt-entra-id.mp4" type="video/mp4" />
</video>
