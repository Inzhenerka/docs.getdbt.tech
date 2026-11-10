---
title: "Настройка Azure DevOps с использованием сервисного пользователя"
id: "setup-service-user"
description: "Вы можете настроить Azure DevOps, создав приложение Microsoft Entra ID и добавив его в dbt."
sidebar_label: "Настройка служебного пользователя"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

## Обзор сервисного пользователя {#service-user-overview}

:::important

Служебные пользователи больше не рекомендуются для аутентификации, и <Constant name="dbt" /> внедряет новый способ аутентификации с использованием [субъекта-службы Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals). Как только этот способ станет доступен в настройках вашей учетной записи, запланируйте [переход со служебного пользователя на субъект-службу](/docs/platform/git/setup-service-principal#migrate-to-service-principal). Субъекты-службы — это [рекомендуемый Microsoft тип служебных учетных записей](https://learn.microsoft.com/en-us/entra/architecture/secure-service-accounts#types-of-microsoft-entra-service-accounts) для аутентификации приложений.

:::

Чтобы использовать нашу встроенную интеграцию с Azure DevOps в <Constant name="dbt" />, администратору аккаунта необходимо настроить приложение Microsoft Entra ID. Мы рекомендуем настроить отдельное [приложение Entra ID, отличное от используемого для SSO](/docs/platform/manage-access/set-up-sso-microsoft-entra-id).

1. [Зарегистрируйте приложение Entra ID](#register-a-microsoft-entra-id-app).
2. [Добавьте разрешения для нового приложения](#add-permissions-to-your-new-app).
3. [Добавьте ещё один URI перенаправления](#add-another-redirect-uri).
4. [Подключите Azure DevOps к новому приложению](#connect-azure-devops-to-your-new-app).
5. [Добавьте приложение Entra ID в <Constant name="dbt" />](#add-your-microsoft-entra-id-app-to-dbt).

После добавления приложения Microsoft Entra ID в <Constant name="dbt" /> администратор аккаунта также должен [подключить служебного пользователя](#connect-a-service-user) с помощью OAuth. Эта учётная запись будет использоваться для выполнения действий без участия пользователя в <Constant name="dbt" />, таких как запуски развёртывания и CI.

После добавления приложения Microsoft Entra ID в <Constant name="dbt" /> и подключения служебного пользователя разработчики <Constant name="dbt" /> смогут проходить индивидуальную аутентификацию в <Constant name="dbt" /> через Azure DevOps. Подробнее см. в разделе [Аутентификация через Azure DevOps](/docs/platform/git/authenticate-azure).

Для выполнения действий, описанных на этой странице, необходимы пользователи со следующими ролями:
- Администратор Microsoft Entra ID
- Администратор Azure DevOps
- Администратор аккаунта <Constant name="dbt" />
- Администратор Azure (если ваши среды Entra ID и Azure DevOps не подключены друг к другу)

## Регистрация приложения Microsoft Entra ID {#register-a-microsoft-entra-id-app}

Следующие шаги выполняет администратор Microsoft Entra ID.

1. Войдите на портал Azure и нажмите **Microsoft Entra ID**.
2. Выберите **App registrations** на левой панели.
3. Выберите **New registration**. Откроется форма создания нового приложения Entra ID.
4. Укажите имя приложения. Рекомендуем использовать «dbt Labs Azure DevOps app».
5. Выберите **Accounts in any organizational directory (Any Entra ID directory - Multitenant)** в качестве поддерживаемых типов учетных записей.
Многие клиенты спрашивают, почему нужно выбирать Multitenant вместо Single tenant, и часто допускают ошибку на этом шаге. Microsoft рассматривает Azure DevOps (ранее Visual Studio) и Microsoft Entra ID как отдельные тенанты, поэтому для корректной работы этого приложения Entra ID необходимо выбрать Multitenant.
6. Добавьте URI перенаправления.
    1. Выберите **Web** в качестве платформы.
    2. Введите в поле `https://YOUR_ACCESS_URL/complete/azure_active_directory`. Обязательно замените `YOUR_ACCESS_URL` на [соответствующий URL доступа](/docs/platform/about-platform/access-regions-ip-addresses) для вашего региона и тарифного плана.
7. Нажмите **Register**.

<Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/ADnavigation.gif" title="Переход к регистрации приложений Entra ID"/>

Перед регистрацией приложение должно выглядеть так:
<Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/AD app.png" title="Регистрация приложения Microsoft Entra ID"/>

## Добавление разрешений для нового приложения {#add-permissions-to-your-new-app}

Администратор Microsoft Entra ID должен предоставить приложению доступ к Azure DevOps.


1. В левой панели навигации выберите **API permissions**.
2. Удалите разрешение **Microsoft Graph / User Read**.
3. Нажмите **Add a permission**.
4. Выберите **Azure DevOps**.
5. Выберите разрешение **user_impersonation**. Это единственное доступное разрешение для Azure DevOps.

## Добавление дополнительного redirect URI {#add-another-redirect-uri}

Администратор Microsoft Entra ID должен добавить еще один redirect URI в приложение Entra ID. Этот redirect URI будет использоваться для аутентификации сервисного пользователя при headless‑действиях в средах деплоя.

Перед добавлением URI убедитесь, что при [регистрации приложения](#register-a-microsoft-entra-id-app) вы выбрали платформу **Web**.
<Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/user-impersonation.gif" title="Добавление разрешений приложению"/>


1. Перейдите к вашему приложению Microsoft Entra ID.
2. Нажмите на ссылку рядом с **Redirect URIs**.
3. Нажмите **Add URI** и добавьте URI, заменив `YOUR_ACCESS_URL` на [соответствующий Access URL](/docs/platform/about-platform/access-regions-ip-addresses) для вашего региона и плана:  
   `https://YOUR_ACCESS_URL/complete/azure_active_directory_service_user`
4. Нажмите **Save**.

## Создание секрета клиента {#create-a-client-secret}

Администратор Microsoft Entra ID должен выполнить следующие действия:

<Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/redirect-uri.gif" title="Добавление URI перенаправления для служебного пользователя"/>

1. Перейдите к своему приложению Microsoft Entra ID.
2. Выберите **Certificates and Secrets** на левой панели навигации.
3. Выберите **Client secrets** и нажмите **New client secret**
4. Добавьте описание секрета и выберите срок его действия. Нажмите **Add**.
5. Скопируйте значение поля **Value** и безопасным способом передайте его администратору аккаунта <Constant name="dbt" />, который завершит настройку. 

## Подключение Azure DevOps к новому приложению {#connect-azure-devops-to-your-new-app}

Администратору Azure потребуется одна из следующих ролей как в среде Microsoft Entra ID, так и в среде Azure DevOps:
- Azure Service Administrator
- Azure Co-administrator

Если ваш аккаунт Azure DevOps подключён к Entra ID, можно перейти к разделу [Настройка служебного пользователя](#connect-a-service-user). Однако если вы только начинаете настройку, подключите Azure DevOps к только что созданному приложению Microsoft Entra ID:

1. В аккаунте Azure DevOps выберите **Organization settings** в левом нижнем углу.
2. Перейдите в раздел Microsoft Entra ID.
3. Нажмите **Connect directory**.
4. Выберите каталог, который нужно подключить.
5. Нажмите **Connect**.

<Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/connect AD to Azure DevOps.gif" title="Подключение Azure DevOps к Microsoft Entra ID"/>

## Добавление приложения Microsoft Entra ID в dbt {#add-your-microsoft-entra-id-app-to-dbt}

Администратор аккаунта <Constant name="dbt" /> должен выполнить следующие действия. 

После подключения приложения Microsoft Entra ID к Azure DevOps необходимо предоставить <Constant name="dbt" /> сведения о приложении:

1. Перейдите в настройки своего аккаунта в <Constant name="dbt" />.
2. Выберите **Integrations**.
3. Прокрутите страницу до раздела Azure DevOps и нажмите значок карандаша, чтобы изменить настройки интеграции.
4. Заполните форму:
    - **Azure DevOps Organization:** Значение должно в точности совпадать с названием вашей организации Azure DevOps. Не включайте в это поле префикс `dev.azure.com/`. ✅ Используйте `my-devops-org` ❌ Не используйте `dev.azure.com/my-devops-org`
    - **Application (client) ID:** Указан в приложении Microsoft Entra ID.
    - **Client Secrets:** Скопируйте значение поля **Value** из раздела секретов клиента приложения Microsoft Entra ID и вставьте его в поле **Client Secret** в <Constant name="dbt" />. Администраторы Entra ID отвечают за срок действия секрета приложения Entra ID, а администраторам dbt следует зафиксировать дату истечения срока действия, чтобы своевременно заменить секрет.
    - **Directory(tenant) ID:** Указан в приложении Microsoft Entra ID.
        <Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/AzureDevopsAppdbtCloud.gif" width="100%" title="Добавление приложения Microsoft Entra ID в dbt"/>

Теперь ваше приложение Microsoft Entra ID должно быть добавлено в аккаунт <Constant name="dbt" />. Участники вашей команды, которые хотят разрабатывать в <Constant name="studio_ide" /> или <Constant name="dbt" /> CLI, теперь могут самостоятельно [авторизовать доступ к Azure DevOps в своих профилях](/docs/platform/git/authenticate-azure).

## Настройка сервисного пользователя {#connect-a-service-user}

Сервисный пользователь — это техническая учетная запись, которую администратор создает так же, как учетную запись обычного пользователя, но предоставляет ей разрешения, предназначенные специально для взаимодействия между сервисами. Не следует привязывать аутентификацию к реальному пользователю Azure DevOps: если этот человек покинет вашу организацию, <Constant name="dbt" /> потеряет доступ к репозиториям dbt в Azure DevOps, что приведет к сбоям запусков в производственной среде.

:::info Истечение срока действия аутентификации сервисного пользователя
<Constant name="dbt" /> обновляет аутентификацию сервисного пользователя при каждом запуске, инициированном планировщиком, API или CI. Если в вашей учетной записи нет активных запусков более 90 дней, администратору потребуется вручную обновить аутентификацию сервисного пользователя, отключив и повторно подключив его профиль через описанную выше процедуру OAuth, чтобы возобновить операции без участия пользователя, такие как настройка проектов, запуски развертывания и CI.
:::

Если <Constant name="studio_ide" /> не запускается и отображает сообщение `Failed to start server. The project is not fully set up: Azure Service User not found`, значит, служебный пользователь на уровне аккаунта не подключён. Подробнее см. в разделе [Подключение служебного пользователя](#connect-a-service-user).

Если вместо этого отображается сообщение `Missing Azure user`, значит, личный аккаунт Azure DevOps разработчика не связан с <Constant name="dbt" />. Подробнее см. в разделе [Аутентификация в Azure DevOps](/docs/platform/git/authenticate-azure#troubleshooting).

### Разрешения служебных пользователей

Учётная запись служебного пользователя должна иметь следующие разрешения Azure DevOps для всех проектов и репозиториев Azure DevOps, к которым вы хотите предоставить доступ в <Constant name="dbt" />. Подробнее о том, как <Constant name="dbt" /> использует каждое разрешение, читайте в следующих абзацах.

 - **Project Reader**
 - **ViewSubscriptions**
 - **EditSubscriptions**
 - **DeleteSubscriptions** *
 - **PullRequestContribute**
 - **GenericContribute**

\* Примечание: разрешение **DeleteSubscriptions** может входить в **EditSubscriptions** в зависимости от версии Azure.

Некоторые из этих разрешений доступны только через [Azure DevOps API](https://docs.microsoft.com/en-us/azure/devops/organizations/security/namespace-reference?view=azure-devops) или [CLI](https://learn.microsoft.com/en-us/cli/azure/devops?view=azure-cli-latest). Ниже мы также привели дополнительную информацию об использовании Azure DevOps API, чтобы ускорить настройку. Альтернативно вы можете включить разрешения через UI Azure DevOps, однако в этом случае нельзя добиться минимально необходимого набора разрешений.

<!-- tabs for service user permissions and turning off MFA for service users -->
<Tabs>

<TabItem value="permission" label="Обязательные разрешения для сервисных пользователей">

Разрешения служебного пользователя также определяют, какие репозитории команда сможет выбрать при настройке проекта dbt, поэтому администратор Azure DevOps должен предоставить служебному пользователю как минимум права Project Reader _до_ создания нового проекта в <Constant name="dbt" />. Если вы переводите существующий проект dbt на использование встроенной интеграции с Azure DevOps, служебный пользователь аккаунта <Constant name="dbt" /> должен иметь необходимые разрешения на доступ к репозиторию до начала миграции.
</TabItem>

<TabItem value="mfa" label="Отключение MFA для сервисного пользователя">

Хотя для обычных пользовательских аккаунтов часто требуется многофакторная аутентификация (MFA), аутентификация сервисного пользователя не должна требовать дополнительного фактора. Если включить второй фактор для сервисного пользователя, это может прервать production‑запуски и привести к ошибкам при клонировании репозитория. Для корректной работы OAuth‑токена рекомендуется максимально упростить подтверждение личности для сервисных пользователей.

Поэтому для служебного пользователя необходимо явно отключить MFA в панели администрирования Office 365 или Microsoft Entra ID.  Недостаточно просто оставить MFA «неподключённой», поскольку в этом случае <Constant name="dbt" /> получит запрос на настройку MFA вместо возможности использовать учётные данные по назначению.

**Чтобы отключить MFA для одного пользователя через консоль администрирования Office 365:**

- Перейдите в Microsoft 365 admin center -> Users -> Active users -> выберите пользователя -> Manage multifactor authentication -> выберите пользователя -> Disable multi-factor authentication.

**Использование интерфейса Microsoft Entra ID:**

Обратите внимание: эта процедура включает отключение Security Defaults в среде Entra ID.

1. Перейдите в Azure Admin Center. Откройте Microsoft Entra ID и в разделе **Manage** левой панели выберите **Properties**, прокрутите до **Manage Security defaults**, затем выберите **No** в пункте "Enable Security Defaults" и нажмите **Save**.
2. Перейдите в **Microsoft Entra ID** -> Manage -> Users -> нажмите на многоточие (...) и выберите ссылку **Multi-Factor Authentication**. Если ссылка неактивна, убедитесь, что **Security Defaults** были отключены на предыдущем шаге.
3. Если MFA включена для пользователей, выберите нужного пользователя (или пользователей) и в разделе **Quick steps** нажмите **Disable**.
4. Подтвердите изменения, выбрав **Yes**.

Чтобы снова включить MFA для пользователя, выберите его и нажмите **Enable**. Обратите внимание, что после этого может потребоваться повторная настройка MFA для данного пользователя.

</TabItem>

</Tabs>

<!-- End tabs for service user permissions and turning off MFA for service users-->

<details>
<summary>  <b>ViewSubscriptions</b> </summary>
<br></br>

**Security Namespace ID:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Namespace:** ServiceHooks

**Permission:**
```json
{
    "bit": 1,
    "displayName": "View Subscriptions",
    "name": "ViewSubscriptions"
}
```

**Uses:** Для просмотра существующих подписок service hooks в Azure DevOps

**Token (where applicable - API only):**
- PublisherSecurity для доступа ко всем проектам
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; для доступа к отдельному проекту

**UI/API/CLI:** только API/CLI

**Sample CLI code snippet**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 1
```

</details>

<details>
<summary>  <b>EditSubscriptions</b> </summary>
<br></br>

**Security Namespace ID:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Namespace:** ServiceHooks

**Permission:**
```json
{
    "bit": 2,
    "displayName": "Edit Subscription",
    "name": "EditSubscriptions"
}

```

**Uses:** Для добавления или обновления существующих подписок service hooks в Azure DevOps

**Token (where applicable - API only):**
- PublisherSecurity для доступа ко всем проектам
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; для доступа к отдельному проекту

**UI/API/CLI:** только API/CLI

**Sample CLI code snippet**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 2
```

</details>

<details>
<summary>  <b>DeleteSubscriptions</b> </summary>
<br></br>

**Security Namespace ID:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Namespace:** ServiceHooks

**Permission:**
```json
{
    "bit": 4,
    "displayName": "Delete Subscriptions",
    "name": "DeleteSubscriptions"
}
```

**Uses:** Для удаления избыточных подписок service hooks в Azure DevOps

**Token (where applicable - API only):**
- PublisherSecurity для доступа ко всем проектам
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; для доступа к отдельному проекту

**UI/API/CLI:** только API/CLI

**Sample CLI code snippet**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 4
```

**Additional Notes:** В последних версиях Azure DevOps это разрешение признано устаревшим. Разрешение Edit Subscriptions (bit 2) включает права на удаление.

</details>

<details>
<summary>  <b>PullRequestContribute</b> </summary>
<br></br>

**Security Namespace ID:** 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87

**Namespace:** <Constant name="git" /> Repositories

**Permission:**
```json
{ 	
    "bit": 16384,  
    "displayName": "Contribute to pull requests",
    "name": "PullRequestContribute"
}
```

**Uses:** Для публикации статусов Pull Request в Azure DevOps

**Token (where applicable - API only):**
- repoV2 для доступа ко всем проектам
- repoV2/&lt;azure_devops_project_object_id&gt; для доступа к отдельному проекту
- repoV2/&lt;azure_devops_project_object_id&gt;/&lt;azure_devops_repository_object_id&gt; для доступа к отдельному репозиторию

**UI/API/CLI:** UI, API и CLI

**Sample CLI code snippet**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87 --subject <service_account>@xxxxxx.onmicrosoft.com --token repoV2/<azure_devops_project_object_id>/<azure_devops_repository_object_id> --allow-bit 16384
```

**Additional Notes:** Это разрешение автоматически наследуется, если в UI установлен Project Reader/Contributor/Administrator.

</details>

<details>
<summary>  <b>GenericContribute</b> </summary>
<br></br>

**Security Namespace ID:** 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87

**Namespace:** <Constant name="git" /> Repositories

**Permission:**
```json
{
    "bit": 4,
    "displayName": "Contribute",
    "name": "GenericContribute"
}
```

**Uses:** Для публикации статусов коммитов в Azure DevOps

**Token (where applicable - API only):**
- repoV2 для доступа ко всем проектам
- repoV2/&lt;azure_devops_project_object_id&gt; для доступа к одному проекту
- repoV2/&lt;azure_devops_project_object_id&gt;/&lt;azure_devops_repository_object_id&gt; для доступа к одному репозиторию

**UI/API/CLI:** UI, API и CLI

**Sample CLI code snippet**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87 --subject <service_account>@xxxxxx.onmicrosoft.com --token repoV2/<azure_devops_project_object_id>/<azure_devops_repository_object_id> --allow-bit 4
```

**Additional Notes:** Это разрешение автоматически наследуется, если в UI установлен Project Contributor/Administrator.

</details>

### Подключение служебного пользователя

Перед настройкой проекта <Constant name="dbt" /> необходимо подключить служебного пользователя, поскольку его разрешения определяют, какие проекты <Constant name="dbt" /> может импортировать.

Чтобы подключить служебного пользователя, администратор аккаунта <Constant name="dbt" />, имеющий доступ к аккаунту служебного пользователя в Azure DevOps, должен выполнить следующие действия:
1. Войдите в аккаунт служебного пользователя в Azure DevOps.
2. В <Constant name="dbt" /> перейдите в **Account settings** > **Integrations**. 
3. Перейдите в раздел **Azure DevOps** и выберите **Service User**.
4. Заполните обязательные поля.
6. Нажмите **Save**.
7. Нажмите **Link Azure service user**.
8. Вы будете перенаправлены в Azure DevOps, где необходимо принять разрешения приложения Microsoft Entra ID.
9. Затем вы будете перенаправлены обратно в <Constant name="dbt" />, и служебный пользователь будет подключён.

<Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/azure-service-user.png" title="Подключение служебного пользователя Azure"/>

После подключения <Constant name="dbt" /> отображает адрес электронной почты служебного пользователя, чтобы вы знали, разрешения какого пользователя используются для выполнения действий без участия пользователя в средах развёртывания. Чтобы сменить подключённый аккаунт, отключите профиль в <Constant name="dbt" />, войдите в другой служебный аккаунт Azure DevOps и повторно привяжите аккаунт в <Constant name="dbt" />.

:::info Персональные токены доступа (PAT)
<Constant name="dbt" /> использует служебного пользователя для создания временных токенов доступа, называемых [PAT](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops&tabs=Windows).

Эти токены имеют ограниченную область действия, действительны только 5 минут и становятся недействительными после одного API‑вызова.

Токены ограничены следующими [scopes](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops):
- `vso.code_full`: предоставляет полный доступ к исходному коду и метаданным системы контроля версий (коммиты, ветки и т.д.), а также возможность создавать и управлять репозиториями, pull request’ами и code review, и получать уведомления о событиях контроля версий через service hooks. Также включает ограниченную поддержку Client OM API.
- `vso.project`: предоставляет возможность читать проекты и команды.
- `vso.build_execute`: предоставляет возможность доступа к артефактам сборки, включая результаты сборок, определения и запросы, а также возможность ставить сборки в очередь, обновлять их свойства и получать уведомления о событиях сборки через service hooks.
:::
