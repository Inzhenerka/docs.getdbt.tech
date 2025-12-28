---
title: "Настройка Azure DevOps с использованием сервисного пользователя"
id: "setup-service-user"
description: "Вы можете настроить Azure DevOps, создав приложение Microsoft Entra ID и добавив его в dbt."
sidebar_label: "Настройка сервисного пользователя"
---

## Обзор сервисного пользователя

:::important

Сервисные пользователи больше не являются рекомендуемым методом аутентификации, и <Constant name="cloud" /> постепенно внедряет новый вариант — [service principal Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals). Как только эта опция станет доступна в настройках вашего аккаунта, вам следует запланировать [миграцию с сервисного пользователя на service principal](/docs/cloud/git/setup-service-principal#migrate-to-service-principal). Service principal — это [рекомендуемый Microsoft тип сервисной учетной записи](https://learn.microsoft.com/en-us/entra/architecture/secure-service-accounts#types-of-microsoft-entra-service-accounts) для аутентификации приложений.

:::

Чтобы использовать нативную интеграцию с Azure DevOps в <Constant name="cloud" />, администратор аккаунта должен настроить приложение Microsoft Entra ID. Мы рекомендуем создавать отдельное [приложение Entra ID, отличное от используемого для SSO](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id).

1. [Зарегистрировать приложение Entra ID](#register-a-microsoft-entra-id-app).
2. [Добавить разрешения для нового приложения](#add-permissions-to-your-new-app).
3. [Добавить дополнительный redirect URI](#add-another-redirect-uri).
4. [Подключить Azure DevOps к новому приложению](#connect-azure-devops-to-your-new-app).
5. [Добавить приложение Entra ID в <Constant name="cloud" />](#add-your-azure-ad-app-to-dbt-cloud).

После добавления приложения Microsoft Entra ID в <Constant name="cloud" />, администратор аккаунта также должен [подключить сервисного пользователя](#connecting-a-service-user) через OAuth. Этот пользователь будет использоваться для headless‑действий в <Constant name="cloud" />, таких как deployment‑запуски и CI.

После того как приложение Microsoft Entra ID добавлено в <Constant name="cloud" /> и сервисный пользователь подключен, разработчики <Constant name="cloud" /> смогут выполнять персональную аутентификацию в <Constant name="cloud" /> через Azure DevOps. Подробнее см. [Аутентификация с Azure DevOps](/docs/cloud/git/authenticate-azure).

Для выполнения шагов на этой странице требуются следующие роли:
- администратор Microsoft Entra ID
- администратор Azure DevOps
- администратор аккаунта <Constant name="cloud" />
- администратор Azure (если среды Entra ID и Azure DevOps не связаны)

## Регистрация приложения Microsoft Entra ID

Администратор Microsoft Entra ID должен выполнить следующие шаги:

1. Войдите в Azure portal и выберите **Microsoft Entra ID**.
2. В левой панели выберите **App registrations**.
3. Нажмите **New registration**. Откроется форма создания нового приложения Entra ID.
4. Укажите имя приложения. Мы рекомендуем использовать, например, `dbt Labs Azure DevOps app`.
5. В качестве Supported Account Types выберите **Accounts in any organizational directory (Any Entra ID directory - Multitenant)**.  
   Многие клиенты спрашивают, почему необходимо выбирать Multitenant вместо Single tenant, и часто ошибаются на этом шаге. Microsoft рассматривает Azure DevOps (ранее Visual Studio) и Microsoft Entra ID как отдельные тенанты, поэтому для корректной работы приложения Entra ID необходимо выбрать Multitenant.
6. Добавьте redirect URI.
    1. Выберите платформу **Web**.
    2. В поле введите `https://YOUR_ACCESS_URL/complete/azure_active_directory`. Обязательно замените `YOUR_ACCESS_URL` на [соответствующий Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.
7. Нажмите **Register**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/ADnavigation.gif" title="Переход к регистрации приложений Entra ID"/>

Вот как должно выглядеть приложение перед регистрацией:

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Регистрация приложения Microsoft Entra ID"/>

## Добавление разрешений для нового приложения

Администратор Entra ID должен предоставить новому приложению доступ к Azure DevOps:

1. В левой панели навигации выберите **API permissions**.
2. Удалите разрешение **Microsoft Graph / User Read**.
3. Нажмите **Add a permission**.
4. Выберите **Azure DevOps**.
5. Выберите разрешение **user_impersonation**. Это единственное доступное разрешение для Azure DevOps.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/user-impersonation.gif" title="Добавление разрешений для приложения"/>

## Добавление дополнительного redirect URI

Администратор Microsoft Entra ID должен добавить еще один redirect URI в приложение Entra ID. Этот redirect URI будет использоваться для аутентификации сервисного пользователя при headless‑действиях в средах деплоя.

Перед добавлением убедитесь, что при [регистрации приложения Microsoft Entra ID](#register-a-microsoft-entra-id-app) в качестве платформы была выбрана **Web**.

1. Перейдите к вашему приложению Microsoft Entra ID.
2. Нажмите на ссылку рядом с **Redirect URIs**.
3. Нажмите **Add URI** и добавьте URI, заменив `YOUR_ACCESS_URL` на [соответствующий Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана:  
   `https://YOUR_ACCESS_URL/complete/azure_active_directory_service_user`
4. Нажмите **Save**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/redirect-uri.gif" title="Добавление redirect URI для сервисного пользователя"/>

## Создание client secret

Администратор Microsoft Entra ID должен выполнить следующие шаги:

1. Перейдите к вашему приложению Microsoft Entra ID.
2. В левой панели навигации выберите **Certificates and Secrets**.
3. Выберите **Client secrets** и нажмите **New client secret**.
4. Задайте описание секрета и выберите срок действия. Нажмите **Add**.
5. Скопируйте значение поля **Value** и безопасно передайте его администратору аккаунта <Constant name="cloud" />, который завершит настройку.

## Подключение Azure DevOps к новому приложению

Администратору Azure потребуется одно из следующих разрешений как в Microsoft Entra ID, так и в Azure DevOps:
- Azure Service Administrator
- Azure Co-administrator

Если ваш аккаунт Azure DevOps уже подключен к Entra ID, вы можете перейти к разделу [Подключение сервисного пользователя](#connecting-a-service-user). Если же вы только настраиваете интеграцию, подключите Azure DevOps к созданному приложению Microsoft Entra ID:

1. В аккаунте Azure DevOps выберите **Organization settings** в левом нижнем углу.
2. Перейдите в раздел Microsoft Entra ID.
3. Нажмите **Connect directory**.
4. Выберите каталог, который нужно подключить.
5. Нажмите **Connect**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/connect AD to Azure DevOps.gif" title="Подключение Azure DevOps и Microsoft Entra ID"/>

## Добавление приложения Microsoft Entra ID в dbt

Администратор аккаунта <Constant name="cloud" /> должен выполнить следующие шаги.

После подключения приложения Microsoft Entra ID и Azure DevOps необходимо предоставить <Constant name="cloud" /> информацию о приложении:

1. Перейдите в настройки аккаунта в <Constant name="cloud" />.
2. Выберите **Integrations**.
3. Прокрутите до раздела Azure DevOps и нажмите на значок карандаша для редактирования интеграции.
4. Заполните форму:
    - **Azure DevOps Organization:** должно в точности совпадать с именем вашей организации Azure DevOps. Не включайте префикс `dev.azure.com/`. ✅ Используйте `my-devops-org` ❌ Не используйте `dev.azure.com/my-devops-org`
    - **Application (client) ID:** указывается из приложения Microsoft Entra ID.
    - **Client Secrets:** скопируйте значение поля **Value** из client secret приложения Microsoft Entra ID и вставьте его в поле **Client Secret** в <Constant name="cloud" />. Администраторы Entra ID отвечают за срок действия секрета, а администраторы dbt должны учитывать дату его истечения для ротации.
    - **Directory(tenant) ID:** указывается из приложения Microsoft Entra ID.
        <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AzureDevopsAppdbtCloud.gif" width="100%" title="Добавление приложения Microsoft Entra ID в dbt"/>

Теперь приложение Microsoft Entra ID должно быть добавлено в ваш аккаунт <Constant name="cloud" />. Участники команды, которые хотят разрабатывать в <Constant name="cloud_ide" /> или использовать CLI <Constant name="cloud" />, могут персонально [авторизовать Azure DevOps из своего профиля](/docs/cloud/git/authenticate-azure).

## Подключение сервисного пользователя

Сервисный пользователь — это псевдо‑пользователь, который настраивается аналогично реальному пользователю‑администратору, но получает разрешения, специально ограниченные для взаимодействия сервис‑к‑сервису. Следует избегать привязки аутентификации к реальному пользователю Azure DevOps, поскольку при его уходе из организации <Constant name="cloud" /> потеряет доступ к репозиториям dbt в Azure DevOps, что приведет к сбоям production‑запусков.

:::info Срок действия аутентификации сервисного пользователя
<Constant name="cloud" /> обновляет аутентификацию сервисного пользователя при каждом запуске, инициированном планировщиком, API или CI. Если в аккаунте не было активных запусков более 90 дней, администратору потребуется вручную обновить аутентификацию сервисного пользователя, отключив и повторно подключив его профиль через OAuth‑процесс, описанный выше, чтобы возобновить headless‑взаимодействия, такие как настройка проектов, deployment‑запуски и CI.
:::

### Разрешения сервисного пользователя

Аккаунт сервисного пользователя должен иметь следующие разрешения Azure DevOps для всех проектов и репозиториев, к которым требуется доступ в <Constant name="cloud" />. Ниже описано, как <Constant name="cloud" /> использует каждое из этих разрешений.

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

Разрешения сервисного пользователя также определяют, какие репозитории команда сможет выбрать при создании dbt‑проекта. Поэтому администратор Azure DevOps должен предоставить сервисному пользователю как минимум доступ Project Reader _до_ создания нового проекта в <Constant name="cloud" />. Если вы мигрируете существующий dbt‑проект на нативную интеграцию с Azure DevOps, сервисный пользователь аккаунта <Constant name="cloud" /> должен иметь корректные разрешения на репозиторий до начала миграции.
</TabItem>

<TabItem value="mfa" label="Отключение MFA для сервисного пользователя">

Хотя для обычных пользовательских аккаунтов часто требуется многофакторная аутентификация (MFA), аутентификация сервисного пользователя не должна требовать дополнительного фактора. Если включить второй фактор для сервисного пользователя, это может прервать production‑запуски и привести к ошибкам при клонировании репозитория. Для корректной работы OAuth‑токена рекомендуется максимально упростить подтверждение личности для сервисных пользователей.

В результате MFA должно быть явно отключено в панели администрирования Office 365 или Microsoft Entra ID для сервисного пользователя. Простого «неподключенного» состояния недостаточно, так как <Constant name="cloud" /> будет запрашивать настройку MFA вместо использования учетных данных по назначению.

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

Вы должны подключить сервисного пользователя до настройки проекта <Constant name="cloud" />, так как разрешения сервисного пользователя определяют, какие проекты <Constant name="cloud" /> может импортировать.

Администратор аккаунта <Constant name="cloud" />, имеющий доступ к аккаунту сервисного пользователя в Azure DevOps, должен выполнить следующие шаги для подключения сервисного пользователя:
1. Войдите в аккаунт сервисного пользователя в Azure DevOps.
2. В <Constant name="cloud" /> перейдите в **Account settings** > **Integrations**.
3. Перейдите в раздел **Azure DevOps** и выберите **Service User**.
4. Введите значения в обязательные поля.
6. Нажмите **Save**.
7. Нажмите **Link Azure service user**.
8. Вы будете перенаправлены в Azure DevOps, где необходимо принять разрешения приложения Microsoft Entra ID.
9. После этого вы будете перенаправлены обратно в <Constant name="cloud" />, и сервисный пользователь будет подключен.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/azure-service-user.png" title="Подключение сервисного пользователя Azure"/>

После подключения <Constant name="cloud" /> отображает email‑адрес сервисного пользователя, чтобы было понятно, учетная запись какого пользователя обеспечивает headless‑действия в средах деплоя. Чтобы изменить подключенный аккаунт, отключите профиль в <Constant name="cloud" />, войдите в альтернативный сервисный аккаунт Azure DevOps и повторно свяжите его с <Constant name="cloud" />.

:::info Personal Access Tokens (PATs)
<Constant name="cloud" /> использует сервисного пользователя для генерации временных токенов доступа — [PATs](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops&tabs=Windows).

Эти токены имеют ограниченную область действия, действительны только 5 минут и становятся недействительными после одного API‑вызова.

Токены ограничены следующими [scopes](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops):
- `vso.code_full`: предоставляет полный доступ к исходному коду и метаданным системы контроля версий (коммиты, ветки и т.д.), а также возможность создавать и управлять репозиториями, pull request’ами и code review, и получать уведомления о событиях контроля версий через service hooks. Также включает ограниченную поддержку Client OM API.
- `vso.project`: предоставляет возможность читать проекты и команды.
- `vso.build_execute`: предоставляет возможность доступа к артефактам сборки, включая результаты сборок, определения и запросы, а также возможность ставить сборки в очередь, обновлять их свойства и получать уведомления о событиях сборки через service hooks.
:::
