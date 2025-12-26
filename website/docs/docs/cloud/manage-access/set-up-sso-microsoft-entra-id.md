---
title: "Настройка SSO с Microsoft Entra ID (ранее Azure AD)"
description: "Узнайте, как администраторы dbt могут использовать Microsoft Entra ID для управления доступом в аккаунте dbt."
id: "set-up-sso-microsoft-entra-id"
sidebar_label: "Настройка SSO с Microsoft Entra ID"
---

# Set up SSO with Microsoft Entra ID <Lifecycle status="managed, managed_plus" />

<Constant name="cloud" /> Планы корпоративного уровня поддерживают единый вход (single sign-on) через Microsoft Entra ID (ранее Azure AD). Вам понадобятся права для создания и управления новым приложением Entra ID. В настоящее время поддерживаются следующие возможности:

* SSO, инициированный IdP
* SSO, инициированный SP
* Провизия "по требованию"

## Конфигурация

<Constant name="cloud" /> поддерживает SSO‑подключения Microsoft Entra ID (ранее Azure AD) как в режиме single‑tenant, так и в режиме multi‑tenant. Для большинства корпоративных сценариев рекомендуется использовать single‑tenant flow при создании приложения Microsoft Entra ID.

### Создание приложения

Войдите в портал Azure для вашей организации. Используя страницу [**Microsoft Entra ID**](https://portal.azure.com/#home), вам нужно будет выбрать соответствующий каталог и затем зарегистрировать новое приложение.

1. В разделе **Управление** выберите **Регистрация приложений**.
2. Нажмите **+ Новая регистрация**, чтобы начать создание новой регистрации приложения.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-app-registration-empty.png" width="80%" title="Создание новой регистрации приложения"/>

3. Укажите конфигурации для полей **Имя** и **Поддерживаемые типы учетных записей**, как показано в следующей таблице:

| Поле | Значение |
| ----- | ----- |
| **Name** | <Constant name="cloud" /> |
| **Supported account types** | Учетные записи только в этом организационном каталоге _(single tenant)_ |

4. Настройте **Redirect URI**. В таблице ниже приведены соответствующие значения Redirect URI для однотенантных и мультитенантных развертываний приложений Entra ID. Для большинства корпоративных сценариев рекомендуется использовать однотенантный Redirect URI. Замените `YOUR_AUTH0_URI` на [подходящий Auth0 URI](/docs/cloud/manage-access/sso-overview#auth0-uris) для вашего региона и тарифного плана.

**Примечание:** Тип tenancy вашей платформы dbt не влияет на этот параметр. Данная настройка приложения Entra ID управляет доступом к приложению:
     - **Single-tenant:** Только пользователи из вашего арендатора (tenant) Entra ID могут получить доступ к приложению.
     - **Multi-tenant:** Пользователи из _любого_ арендатора (tenant) Entra ID могут получить доступ к приложению.

| Тип приложения | URI перенаправления |
| ----- | ----- |
| Одноарендный _(рекомендуется)_ | `https://YOUR_AUTH0_URI/login/callback` |
| Многоарендный | `https://YOUR_AUTH0_URI/login/callback` |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-new-application-alternative.png" width="70%" title="Настройка новой регистрации приложения"/>

5. Сохраните регистрацию приложения, чтобы продолжить настройку SSO с Microsoft Entra ID.

:::info Конфигурация с новым интерфейсом Microsoft Entra ID (опционально)

В зависимости от ваших настроек Microsoft Entra ID, ваша страница регистрации приложения может выглядеть иначе, чем показано на предыдущих скриншотах. Если вас _не_ просят настроить URI перенаправления на странице **Новая регистрация**, выполните шаги 6 - 7 ниже после создания регистрации приложения. Если вы смогли настроить URI перенаправления на предыдущих шагах, перейдите к [шагу 8](#adding-users-to-an-enterprise-application).
:::

6. После регистрации нового приложения без указания URI перенаправления, нажмите на **Регистрация приложения** и затем перейдите на вкладку **Аутентификация** для нового приложения.

7. Нажмите **+ Add platform** и укажите Redirect URI для вашего приложения. Подробнее о корректном значении Redirect URI для вашего приложения <Constant name="cloud" /> см. шаг 4 выше.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-redirect-uri.png" title="Настройка URI перенаправления"/>

### Сопоставление пользователей и групп Azure &lt;-&gt; dbt

:::important

В Azure существует [ограничение](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#important-caveats-for-this-functionality) на количество групп, которые могут быть переданы через SSO‑токен (не более 150). Это означает, что если пользователь состоит более чем в 150 группах, для dbt он будет выглядеть так, как будто не состоит ни в одной группе.  

Чтобы избежать этой проблемы, настройте [назначения групп](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal?pivots=portal) для приложения <Constant name="cloud" /> в Azure и задайте [group claim](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#add-group-claims-to-tokens-for-saml-applications-using-sso-configuration), чтобы Azure передавал только релевантные группы.

:::

:::

Пользователи и группы Azure, которые вы создадите в следующих шагах, сопоставляются с группами, созданными в dbt Cloud, на основе имени группы. Обратитесь к документации по [корпоративным разрешениям](enterprise-permissions) для получения дополнительной информации о том, как пользователи, группы и наборы разрешений настроены в dbt Cloud.

Пользователи и группы Azure, которые вы создадите на следующих шагах, сопоставляются с группами, созданными в <Constant name="cloud" />, на основе имени группы. Дополнительную информацию о том, как в <Constant name="cloud" /> настраиваются пользователи, группы и наборы разрешений, см. в документации по [enterprise permissions](enterprise-permissions).

Платформа <Constant name="dbt_platform" /> использует **User principal name** (UPN) в Microsoft Entra ID для идентификации и сопоставления пользователей, входящих в <Constant name="cloud" /> через SSO. Как правило, UPN имеет формат адреса электронной почты.

После регистрации приложения следующим шагом будет назначение пользователей. Добавьте пользователей, которых вы хотите сделать видимыми для dbt, с помощью следующих шагов:

8. Вернитесь в [**Каталог по умолчанию**](https://portal.azure.com/#home) (или **Главная**) и нажмите **Корпоративные приложения**.
9. Нажмите на имя приложения, созданного ранее.
10. Нажмите **Назначить пользователей и группы**.
11. Нажмите **Добавить пользователя/группу**.
12. Назначьте дополнительных пользователей и группы по мере необходимости.

8. Вернитесь в [**Default Directory**](https://portal.azure.com/#home) (или **Home**) и нажмите **Enterprise Applications**.
9. Нажмите на имя приложения, которое вы создали ранее.
10. Нажмите **Assign Users and Groups**.
11. Нажмите **Add User/Group**.
12. Назначьте дополнительных пользователей и группы при необходимости.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-enterprise-app-users.png" title="Добавление пользователей в корпоративное приложение и Redirect URI"/>

:::info Требуется назначение пользователей?
В разделе **Properties** проверьте значение переключателя **User assignment required?** и убедитесь, что оно соответствует вашим требованиям. Большинству клиентов рекомендуется установить значение **Yes**, чтобы только пользователи и группы, явно назначенные для <Constant name="cloud" />, могли входить в систему. Если этот параметр установлен в **No**, любой пользователь сможет получить доступ к приложению при наличии прямой ссылки на приложение, согласно [документации Microsoft Entra ID](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/assign-user-or-group-access-portal#configure-an-application-to-require-user-assignment).
:::
:::

### Настройка разрешений

13. Вернитесь в [**Default Directory**](https://portal.azure.com/#home) (или **Home**), затем перейдите в **App registration**.  
14. Выберите своё приложение и затем выберите **API permissions**.  
15. Нажмите **+Add a permission** и добавьте разрешения, показанные ниже.

| API Name | Type | Permission | Required? |
| --- | --- | --- | --- |
| Microsoft Graph | Delegated | `User.Read` | Yes |
| Microsoft Graph | Delegated | `GroupMember.Read.All` | Yes |
| Microsoft Graph | Delegated | `Directory.AccessAsUser.All` | Optional — may be required if users are assigned to > 200 groups |

По умолчанию scope требует только `User.Read` и `GroupMember.Read.All`. Если пользователь состоит более чем в 200 группах, может потребоваться выдать дополнительные разрешения, такие как `Directory.AccessAsUser.All`.

16. Сохраните эти разрешения, затем нажмите **Предоставить согласие администратора**, чтобы предоставить согласие администратора для этого каталога от имени всех ваших пользователей.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-permissions-overview.png" title="Настройка разрешений приложения" />

### Создание клиентского секрета

17. В разделе **Manage** нажмите **Certificates & secrets**.
18. Нажмите **+ New client secret**.
19. Назовите клиентский секрет «<Constant name="cloud" />» (или аналогичным образом), чтобы его можно было идентифицировать.
20. В качестве срока действия секрета выберите **730 days (24 months)** (рекомендуется).
21. Нажмите **Add**, чтобы завершить создание значения клиентского секрета (не ID клиентского секрета).
22. Сохраните сгенерированный клиентский секрет в безопасном месте. Позже в процессе настройки мы будем использовать этот клиентский секрет в <Constant name="cloud" />, чтобы завершить конфигурацию интеграции.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-config.png" title="Настройка сертификатов и секретов" />
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-saved.png" title="Запись клиентского секрета" />

### Сбор клиентских учетных данных

23. Перейдите на страницу **Overview** (Обзор) для регистрации приложения.
24. Обратите внимание на значения **Application (client) ID** и **Directory (tenant) ID**, показанные на этой странице, и сохраните их вместе с вашим client secret. Мы будем использовать эти ключи на следующих шагах, чтобы завершить настройку интеграции в <Constant name="cloud" />.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-overview.png" title="Сбор учетных данных. Храните их в безопасном месте" />

## Настройка dbt

Чтобы завершить настройку, выполните приведённые ниже шаги в приложении <Constant name="cloud" />.

### Предоставление учетных данных

25. В интерфейсе <Constant name="cloud" /> нажмите на имя вашей учетной записи в меню слева и выберите **Account settings**.
26. В меню выберите **Single sign-on**.
27. Нажмите кнопку **Edit** и укажите следующие параметры SSO:

| Поле | Значение |
| ----- | ----- |
| **Log&nbsp;in&nbsp;with** | Microsoft Entra ID Single Tenant |
| **Client&nbsp;ID** | Вставьте **Application (client) ID**, сохранённый на предыдущих шагах |
| **Client&nbsp;Secret** | Вставьте **Client Secret** (обязательно используйте **Secret Value**, а не **Secret ID**), полученный на предыдущих шагах; <br />**Примечание:** когда срок действия client secret истечёт, администратору Entra ID потребуется создать новый и вставить его в <Constant name="cloud" />, чтобы обеспечить непрерывный доступ приложения. |
| **Tenant&nbsp;ID** | Вставьте **Directory (tenant ID)**, сохранённый на предыдущих шагах |
| **Domain** | Укажите доменное имя вашего каталога Azure (например, `fishtownanalytics.com`). Используйте только основной домен; это не будет блокировать доступ для других доменов. |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-cloud-sso.png" title="Configuring Entra ID AD SSO in dbt" />

28. Нажмите **Save**, чтобы завершить настройку интеграции Microsoft Entra ID SSO. После этого вы можете перейти по URL для входа, сгенерированному для _slug_ вашей учётной записи, чтобы протестировать вход с помощью Entra ID.

<Snippet path="login_url_note" />

### Additional configuration options

Раздел **Single sign-on** также содержит дополнительные параметры конфигурации, которые располагаются ниже полей с учётными данными.

- **Include all groups:** Получать все группы, к которым принадлежит пользователь, от вашего провайдера удостоверений. Если пользователь состоит во вложенных группах, родительские группы также будут включены. Когда эта опция отключена, передаются только группы с прямым членством пользователя. По умолчанию опция включена.

- **Maximum number of groups to retrieve:** Позволяет настроить максимальное количество групп, которые будут получены для пользователей. По умолчанию установлено значение 250 групп, однако его можно увеличить, если количество групп, в которых состоят пользователи, превышает этот предел.

## Setting up RBAC

Теперь, когда вы завершили настройку SSO с Entra ID, следующим шагом будет настройка
[RBAC groups](/docs/cloud/manage-access/enterprise-permissions), чтобы завершить конфигурацию управления доступом.

## Troubleshooting tips

Убедитесь, что имя домена, под которым существуют учетные записи пользователей в Azure, совпадает с доменом, который вы указали в [Предоставление учетных данных](#supplying-credentials) при настройке SSO.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-get-domain.png" title="Получение домена пользователя в Azure" />

## Узнать больше

<WistiaVideo id="e395rnl0cy" paddingTweak="62.25%" />
