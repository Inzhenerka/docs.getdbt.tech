---
title: "Настройка SSO с Microsoft Entra ID (ранее Azure AD)"
description: "Узнайте, как администраторы dbt могут использовать Microsoft Entra ID для управления доступом в учетной записи dbt."
id: "set-up-sso-microsoft-entra-id"
sidebar_label: "Настройка SSO с Microsoft Entra ID"
---

# Настройка SSO с Microsoft Entra ID <Lifecycle status="managed, managed_plus" /> {#set-up-sso-with-microsoft-entra-id}

Планы уровня <Constant name="cloud" /> Enterprise поддерживают единый вход (single sign-on, SSO) через Microsoft Entra ID (ранее Azure AD). Вам понадобятся права на создание и управление новым приложением Entra ID. В настоящее время поддерживаются следующие возможности:

* SSO, инициируемый IdP  
* SSO, инициируемый SP  
* Just-in-time provisioning  

## Конфигурация {#configuration}

<Constant name="cloud" /> поддерживает как однопользовательские (single-tenant), так и многопользовательские (multi-tenant) подключения SSO Microsoft Entra ID (ранее Azure AD). Для большинства Enterprise-сценариев рекомендуется использовать однопользовательский вариант при создании приложения Microsoft Entra ID.

### Создание приложения {#creating-an-application}

Войдите в портал Azure вашей организации. На странице [**Microsoft Entra ID**](https://portal.azure.com/#home) необходимо выбрать соответствующий каталог, а затем зарегистрировать новое приложение.

1. В разделе **Manage** выберите **App registrations**.
2. Нажмите **+ New Registration**, чтобы начать создание новой регистрации приложения.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-app-registration-empty.png" width="80%" title="Создание новой регистрации приложения"/>

3. Укажите значения для полей **Name** и **Supported account types**, как показано в таблице ниже:

| Поле | Значение |
| ----- | ----- |
| **Name** | <Constant name="cloud" /> |
| **Supported account types** | Accounts in this organizational directory only _(single tenant)_ |

4. Настройте **Redirect URI**. В таблице ниже показаны корректные значения Redirect URI для однопользовательских и многопользовательских развертываний приложений Entra ID. Для большинства корпоративных сценариев следует использовать Redirect URI для single-tenant. Замените `YOUR_AUTH0_URI` на [соответствующий Auth0 URI](/docs/cloud/manage-access/sso-overview#auth0-uris) для вашего региона и плана.

**Примечание:** Тенант вашей платформы dbt не влияет на этот параметр. Эта настройка приложения Entra ID управляет доступом к приложению:
     - **Single-tenant:** Только пользователи из вашего тенанта Entra ID могут получить доступ к приложению.  
     - **Multi-tenant:** Пользователи из _любого_ тенанта Entra ID могут получить доступ к приложению.

| Тип приложения | Redirect URI |
| ----- | ----- |
| Single-tenant _(рекомендуется)_ | `https://YOUR_AUTH0_URI/login/callback` |
| Multi-tenant | `https://YOUR_AUTH0_URI/login/callback` |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-new-application-alternative.png" width="70%" title="Настройка новой регистрации приложения"/>

5. Сохраните регистрацию приложения, чтобы продолжить настройку SSO Microsoft Entra ID.

:::info Конфигурация с новым интерфейсом Microsoft Entra ID (необязательно)

В зависимости от настроек Microsoft Entra ID страница регистрации приложения может выглядеть иначе, чем на приведенных выше скриншотах. Если на странице **New Registration** вам _не_ предлагается настроить Redirect URI, выполните шаги 6–7 ниже после создания регистрации приложения. Если вы смогли задать Redirect URI на предыдущих шагах, переходите сразу к [шагу 8](#adding-users-to-an-enterprise-application).
:::

6. После регистрации нового приложения без указания Redirect URI нажмите **App registration**, а затем перейдите на вкладку **Authentication** для нового приложения.
7. Нажмите **+ Add platform** и укажите Redirect URI для вашего приложения. Подробнее о корректном значении Redirect URI см. шаг 4 выше для вашего приложения <Constant name="cloud" />.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-redirect-uri.png" title="Настройка Redirect URI"/>

### Сопоставление пользователей и групп Azure &lt;-&gt; dbt {#azure-dbt-user-and-group-mapping}

:::important

Существует [ограничение](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#important-caveats-for-this-functionality) на количество групп, которые Azure передает (не более 150) через SSO-токен. Это означает, что если пользователь состоит более чем в 150 группах, может показаться, что он не состоит ни в одной. Чтобы избежать этого, настройте [назначения групп](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal?pivots=portal) для приложения <Constant name="cloud" /> в Azure и задайте [group claim](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#add-group-claims-to-tokens-for-saml-applications-using-sso-configuration), чтобы Azure передавал только релевантные группы.

:::

Пользователи и группы Azure, которые вы создадите на следующих шагах, сопоставляются с группами, созданными в <Constant name="cloud" />, на основе имени группы. Дополнительную информацию о настройке пользователей, групп и наборов разрешений в <Constant name="cloud" /> см. в документации по [enterprise permissions](/docs/cloud/manage-access/enterprise-permissions).

<Constant name="dbt_platform" /> использует **User principal name** (UPN) в Microsoft Entra ID для идентификации и сопоставления пользователей, входящих в <Constant name="cloud" /> через SSO. Обычно UPN имеет формат адреса электронной почты.

### Добавление пользователей в Enterprise application {#adding-users-to-an-enterprise-application}

После регистрации приложения следующим шагом является назначение пользователей. Добавьте пользователей, которые должны иметь доступ к dbt, выполнив следующие действия:

8. Вернитесь в [**Default Directory**](https://portal.azure.com/#home) (или **Home**) и выберите **Enterprise Applications**.
9. Нажмите на имя приложения, созданного ранее.
10. Выберите **Assign Users and Groups**.
11. Нажмите **Add User/Group**.
12. Назначьте дополнительных пользователей и группы по мере необходимости.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-enterprise-app-users.png" title="Добавление пользователей в Enterprise Application"/>

:::info Требуется ли назначение пользователей?
В разделе **Properties** проверьте переключатель **User assignment required?** и убедитесь, что он соответствует вашим требованиям. Большинство клиентов предпочитают значение **Yes**, чтобы только пользователи и группы, явно назначенные в <Constant name="cloud" />, могли выполнять вход. Если установлено **No**, любой пользователь сможет получить доступ к приложению при наличии прямой ссылки, согласно [документации Microsoft Entra ID](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/assign-user-or-group-access-portal#configure-an-application-to-require-user-assignment).
:::

### Настройка разрешений {#configuring-permissions}

13. Вернитесь в [**Default Directory**](https://portal.azure.com/#home) (или **Home**), затем в **App registration**.
14. Выберите ваше приложение и перейдите в **API permissions**.
15. Нажмите **+Add a permission** и добавьте разрешения, указанные ниже.

| API Name | Type | Permission | Required? |
| --- | --- | --- | --- |
| Microsoft Graph | Delegated | `User.Read` | Yes |
| Microsoft Graph | Delegated | `GroupMember.Read.All` | Yes |
| Microsoft Graph | Delegated | `Directory.AccessAsUser.All` | Optional — may be required if users are assigned to > 200 groups |

По умолчанию достаточно областей `User.Read` и `GroupMember.Read.All`. Если пользователь состоит более чем в 200 группах, может потребоваться предоставление дополнительных разрешений, таких как `Directory.AccessAsUser.All`.

16. Сохраните эти разрешения, затем нажмите **Grant admin consent**, чтобы предоставить согласие администратора для этого каталога от имени всех пользователей.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-permissions-overview.png" title="Настройка разрешений приложения" />

### Создание client secret {#creating-a-client-secret}

17. В разделе **Manage** выберите **Certificates & secrets**.
18. Нажмите **+New client secret**.
19. Назовите client secret "<Constant name="cloud" />" (или аналогично), чтобы его было легко идентифицировать.
20. В качестве срока действия выберите **730 days (24 months)** (рекомендуется).
21. Нажмите **Add**, чтобы завершить создание значения client secret (не ID client secret).
22. Сохраните сгенерированный client secret в надежном месте. Позже в процессе настройки мы используем его в <Constant name="cloud" /> для завершения интеграции.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-config.png" title="Настройка certificates & secrets" />
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-saved.png" title="Сохранение client secret" />

### Сбор учетных данных клиента {#collect-client-credentials}

23. Перейдите на страницу **Overview** регистрации приложения.
24. Запишите значения **Application (client) ID** и **Directory (tenant) ID**, отображаемые на этой странице, и сохраните их вместе с client secret. Эти данные будут использованы на следующих шагах для завершения настройки интеграции в <Constant name="cloud" />.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-overview.png" title="Сбор учетных данных. Сохраните их в надежном месте" />

## Настройка dbt {#configuring-dbt}

Чтобы завершить настройку, выполните следующие шаги в приложении <Constant name="cloud" />.

### Указание учетных данных {#supplying-credentials}

25. В <Constant name="cloud" /> нажмите на имя вашей учетной записи в левом меню и выберите **Account settings**.
26. В меню выберите **Single sign-on**.
27. Нажмите кнопку **Edit** и укажите следующие данные SSO:

| Поле | Значение |
| ----- | ----- |
| **Log&nbsp;in&nbsp;with** | Microsoft Entra ID Single Tenant |
| **Client&nbsp;ID** | Вставьте **Application (client) ID**, сохраненный на предыдущих шагах |
| **Client&nbsp;Secret** | Вставьте **Client Secret** (обязательно используйте Secret Value, а не Secret ID), полученный на предыдущих шагах; <br />**Примечание:** После истечения срока действия client secret администратору Entra ID потребуется создать новый и вставить его в <Constant name="cloud" />, чтобы обеспечить бесперебойный доступ. |
| **Tenant&nbsp;ID** | Вставьте **Directory (tenant ID)**, сохраненный на предыдущих шагах |
| **Domain** | Укажите доменное имя вашего каталога Azure (например, `fishtownanalytics.com`). Используйте только основной домен; это не заблокирует доступ для других доменов. |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-cloud-sso.png" title="Настройка SSO Entra ID в dbt" />

28. Нажмите **Save**, чтобы завершить настройку интеграции SSO Microsoft Entra ID. После этого вы можете перейти по URL входа, сгенерированному для _slug_ вашей учетной записи, и протестировать вход с помощью Entra ID.

<Snippet path="login_url_note" />

### Дополнительные параметры конфигурации {#additional-configuration-options}

В разделе **Single sign-on** также доступны дополнительные параметры конфигурации, расположенные ниже полей учетных данных.

- **Include all groups:** Получать все группы, в которых состоит пользователь, от вашего провайдера идентификации. Если пользователь является членом вложенных групп, будут включены и родительские группы. Если опция отключена, передаются только группы с прямым членством пользователя. По умолчанию эта опция включена.

- **Maximum number of groups to retrieve:** Задает настраиваемый лимит количества групп, которые будут получены для пользователей. По умолчанию установлено значение 250 групп, но его можно увеличить, если пользователи состоят в большем количестве групп.

## Настройка RBAC {#setting-up-rbac}

Теперь, когда вы завершили настройку SSO с Entra ID, следующим шагом будет настройка
[RBAC groups](/docs/cloud/manage-access/enterprise-permissions) для завершения конфигурации управления доступом.

## Советы по устранению неполадок {#troubleshooting-tips}

Убедитесь, что доменное имя, под которым существуют учетные записи пользователей в Azure, совпадает с доменом, указанным вами в разделе [Указание учетных данных](#supplying-credentials) при настройке SSO.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-get-domain.png" title="Получение домена пользователя из Azure" />

## Узнать больше {#learn-more}

<WistiaVideo id="e395rnl0cy" paddingTweak="62.25%" />
