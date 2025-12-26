---
title: "Настройка Azure DevOps с использованием сервисного пользователя"
id: "setup-service-user"
description: "Вы можете настроить Azure DevOps, создав приложение Microsoft Entra ID и добавив его в dbt."
sidebar_label: "Настройка сервисного пользователя"
---

## Service user overview

:::important

Сервисные пользователи больше не рекомендуются как способ аутентификации, и <Constant name="cloud" /> постепенно внедряет новый вариант — [сервисный принципал Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals). Как только эта опция станет доступна в настройках вашего аккаунта, вам следует запланировать [миграцию с сервисного пользователя на сервисный принципал](/docs/cloud/git/setup-service-principal#migrate-to-service-principal). Сервисные принципалы — это [рекомендуемый Microsoft тип сервисной учетной записи](https://learn.microsoft.com/en-us/entra/architecture/secure-service-accounts#types-of-microsoft-entra-service-accounts) для аутентификации приложений.

:::

Чтобы использовать нативную интеграцию с Azure DevOps в <Constant name="cloud" />, администратору аккаунта необходимо настроить приложение Microsoft Entra ID. Мы рекомендуем создать отдельное [приложение Entra ID, отличное от используемого для SSO](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id).

1. [Зарегистрируйте приложение Entra ID](#register-a-microsoft-entra-id-app).
2. [Добавьте разрешения к вашему новому приложению](#add-permissions-to-your-new-app).
3. [Добавьте еще один redirect URI](#add-another-redirect-uri).
4. [Подключите Azure DevOps к вашему новому приложению](#connect-azure-devops-to-your-new-app).
5. [Добавьте приложение Entra ID в <Constant name="cloud" />](#add-your-azure-ad-app-to-dbt-cloud).

После добавления приложения Microsoft Entra ID в <Constant name="cloud" /> администратор аккаунта также должен [подключить сервисного пользователя](#connecting-a-service-user) через OAuth. Этот пользователь будет использоваться для выполнения headless-действий в <Constant name="cloud" />, таких как деплой-запуски и CI.

После того как приложение Microsoft Entra ID добавлено в dbt Cloud и сервисный пользователь подключен, разработчики dbt Cloud могут лично аутентифицироваться в dbt Cloud из Azure DevOps. Подробнее об этом см. в разделе [Аутентификация с Azure DevOps](/docs/cloud/git/authenticate-azure).

После добавления приложения Microsoft Entra ID в <Constant name="cloud" /> и подключения сервисного пользователя разработчики <Constant name="cloud" /> смогут выполнять персональную аутентификацию в <Constant name="cloud" /> через Azure DevOps. Подробнее см. в разделе [Authenticate with Azure DevOps](/docs/cloud/git/authenticate-azure).

Для выполнения шагов, описанных на этой странице, требуются следующие роли:
- администратор Microsoft Entra ID
- администратор Azure DevOps
- администратор аккаунта <Constant name="cloud" />
- администратор Azure (если среды Entra ID и Azure DevOps не связаны между собой)

Администратору Microsoft Entra ID необходимо выполнить следующие шаги:

1. Войдите в свой портал Azure и нажмите **Microsoft Entra ID**.
2. Выберите **Регистрация приложений** в левой панели.
3. Выберите **Новая регистрация**. Откроется форма для создания нового приложения Entra ID.
4. Укажите имя для вашего приложения. Мы рекомендуем использовать "dbt Labs Azure DevOps app".
5. Выберите **Учетные записи в любом организационном каталоге (любой каталог Entra ID - многопользовательский)** в качестве поддерживаемых типов учетных записей.
Многие клиенты спрашивают, почему нужно выбирать многопользовательский режим вместо одного арендатора, и часто ошибаются на этом шаге. Microsoft рассматривает Azure DevOps (ранее называвшийся Visual Studio) и Microsoft Entra ID как отдельные арендаторы, и для правильной работы этого приложения Entra ID необходимо выбрать многопользовательский режим.
6. Добавьте URI перенаправления, выбрав **Web** и введя в поле `https://YOUR_ACCESS_URL/complete/azure_active_directory`, заменив `YOUR_ACCESS_URL` на [соответствующий URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.
7. Нажмите **Зарегистрировать**.

1. Войдите в портал Azure и нажмите **Microsoft Entra ID**.
2. В левой панели выберите **App registrations**.
3. Нажмите **New registration**. Откроется форма создания нового приложения Entra ID.
4. Укажите имя для вашего приложения. Мы рекомендуем использовать **"dbt Labs Azure DevOps app"**.
5. В разделе Supported Account Types выберите **Accounts in any organizational directory (Any Entra ID directory - Multitenant)**.

   Многие пользователи спрашивают, почему необходимо выбирать Multitenant вместо Single tenant, и часто ошибаются на этом шаге. Microsoft рассматривает Azure DevOps (ранее Visual Studio) и Microsoft Entra ID как отдельные тенанты. Чтобы это приложение Entra ID работало корректно, необходимо выбрать вариант Multitenant.

6. Добавьте redirect URI.
    1. В качестве платформы выберите **Web**.
    2. В поле введите `https://YOUR_ACCESS_URL/complete/azure_active_directory`. Обязательно замените `YOUR_ACCESS_URL` на [соответствующий Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.
7. Нажмите **Register**.

Вот как должно выглядеть ваше приложение перед регистрацией:

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Регистрация приложения Microsoft Entra ID"/>

## Добавление разрешений для вашего нового приложения

Администратору Entra ID необходимо предоставить вашему новому приложению доступ к Azure DevOps:

1. Выберите **Разрешения API** в левой панели навигации.
2. Удалите разрешение **Microsoft Graph / User Read**.
3. Нажмите **Добавить разрешение**.
4. Выберите **Azure DevOps**.
5. Выберите разрешение **user_impersonation**. Это единственное доступное разрешение для Azure DevOps.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/user-impersonation.gif" title="Добавление разрешений для приложения"/>

## Добавление другого URI перенаправления

Администратору Microsoft Entra ID необходимо добавить другой URI перенаправления в ваше приложение Entra ID. Этот URI перенаправления будет использоваться для аутентификации сервисного пользователя для безголовых действий в средах развертывания.

1. Перейдите к вашему приложению Microsoft Entra ID.

Администратору Microsoft Entra ID необходимо добавить ещё один redirect URI в ваше приложение Entra ID. Этот redirect URI будет использоваться для аутентификации сервисного пользователя при выполнении headless‑действий в средах развертывания.

Перед тем как добавлять ещё один redirect URI, убедитесь, что при [регистрации приложения Microsoft Entra ID](#register-a-microsoft-entra-id-app) вы выбрали платформу **Web**.

1. Перейдите к вашему приложению Microsoft Entra ID.

2. Выберите ссылку рядом с **Redirect URIs**.
3. Нажмите **Add URI** и добавьте URI, заменив `YOUR_ACCESS_URL` на [подходящий Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и тарифного плана:
`https://YOUR_ACCESS_URL/complete/azure_active_directory_service_user`
4. Нажмите **Сохранить**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/redirect-uri.gif" title="Добавление URI перенаправления для сервисного пользователя"/>

## Создание клиентского секрета

Администратору Microsoft Entra ID необходимо выполнить следующие шаги:

1. Перейдите к вашему приложению Microsoft Entra ID.
2. В левой панели навигации выберите **Certificates and Secrets**.
3. Выберите **Client secrets** и нажмите **New client secret**.
4. Укажите описание секрета и выберите срок его действия. Нажмите **Add**.
5. Скопируйте значение из поля **Value** и безопасно передайте его администратору аккаунта <Constant name="cloud" />, который завершит настройку.

## Подключение Azure DevOps к вашему новому приложению

Администратору Azure потребуется одно из следующих разрешений как в среде Microsoft Entra ID, так и в среде Azure DevOps:
- Администратор службы Azure
- Коадминистратор Azure

Если ваша учётная запись Azure DevOps подключена к Entra ID, вы можете перейти к разделу [Connecting a service user](#connecting-a-service-user). Однако, если вы только начинаете настройку, сначала подключите Azure DevOps к приложению Microsoft Entra ID, которое вы только что создали:

1. В вашем аккаунте Azure DevOps выберите **Настройки организации** в нижнем левом углу.
2. Перейдите к Microsoft Entra ID.
3. Нажмите **Подключить каталог**.
4. Выберите каталог, который вы хотите подключить.
5. Нажмите **Подключить**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/connect AD to Azure DevOps.gif" title="Подключение Azure DevOps и Microsoft Entra ID"/>

## Добавление приложения Microsoft Entra ID в dbt

Администратор аккаунта <Constant name="cloud" /> должен выполнить следующие шаги.

После того как вы подключите приложение Microsoft Entra ID и Azure DevOps, необходимо предоставить <Constant name="cloud" /> информацию об этом приложении:

1. Перейдите в настройки аккаунта в <Constant name="cloud" />.
2. Выберите **Integrations**.
3. Прокрутите страницу до раздела Azure DevOps и нажмите на иконку карандаша, чтобы отредактировать интеграцию.
4. Заполните форму:
    - **Azure DevOps Organization:** Должно в точности совпадать с названием вашей организации Azure DevOps. Не указывайте префикс `dev.azure.com/` в этом поле. ✅ Используйте `my-devops-org` ❌ Не используйте `dev.azure.com/my-devops-org`
    - **Application (client) ID:** Указывается из приложения Microsoft Entra ID.
    - **Client Secrets:** Скопируйте значение из поля **Value** в разделе client secrets приложения Microsoft Entra ID и вставьте его в поле **Client Secret** в <Constant name="cloud" />. Администраторы Entra ID отвечают за срок действия секрета приложения Entra ID, а администраторы dbt должны зафиксировать дату его истечения для последующей ротации.
    - **Directory(tenant) ID:** Указывается из приложения Microsoft Entra ID.
        <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AzureDevopsAppdbtCloud.gif" width="100%" title="Adding a Microsoft Entra ID app to dbt"/>

Теперь ваше приложение Microsoft Entra ID должно быть добавлено в аккаунт <Constant name="cloud" />. Участники вашей команды, которые хотят разрабатывать в <Constant name="cloud_ide" /> или использовать CLI <Constant name="cloud" />, теперь могут индивидуально [авторизовать Azure DevOps из своих профилей](/docs/cloud/git/authenticate-azure).

Поскольку Azure DevOps требует, чтобы вся аутентификация была связана с разрешениями пользователя, мы рекомендуем администратору Azure DevOps создать "сервисного пользователя" в Azure DevOps, чьи разрешения будут использоваться для выполнения безголовых действий в dbt Cloud, таких как выбор репозитория проекта dbt Cloud, развертывание и CI. Сервисный пользователь - это псевдопользователь, настроенный так же, как администратор настраивает реального пользователя, но ему предоставляются разрешения, специально предназначенные для взаимодействий между сервисами. Вы должны избегать связывания аутентификации с реальным пользователем Azure DevOps, потому что если этот человек покинет вашу организацию, dbt Cloud потеряет привилегии к репозиториям dbt Azure DevOps, что приведет к сбоям в производственных запусках.

## Подключение сервисного пользователя

Сервисный пользователь — это псевдопользователь, который настраивается так же, как администратор настраивает обычного пользователя, но ему выдаются разрешения, специально ограниченные для взаимодействий «сервис‑сервис». Не рекомендуется связывать аутентификацию с реальным пользователем Azure DevOps, потому что если этот человек покинет вашу организацию, <Constant name="cloud" /> потеряет доступ к репозиториям dbt в Azure DevOps, и продакшн‑запуски начнут завершаться с ошибками.

:::info Истечение срока аутентификации сервисного пользователя
<Constant name="cloud" /> будет обновлять аутентификацию сервисного пользователя при каждом запуске, инициированном планировщиком, API или CI. Если в вашем аккаунте не было ни одного активного запуска более 90 дней, администратору потребуется вручную обновить аутентификацию сервисного пользователя, отключив и повторно подключив профиль сервисного пользователя через OAuth‑процесс, описанный выше. Это необходимо для возобновления «безголовых» (headless) взаимодействий, таких как настройка проектов, запуск деплоев и CI.
:::

:::

### Разрешения сервисных пользователей

Учетная запись сервисного пользователя должна иметь следующие разрешения Azure DevOps для всех проектов и репозиториев Azure DevOps, к которым требуется доступ в <Constant name="cloud" />. Подробнее о том, как <Constant name="cloud" /> использует каждое из этих разрешений, читайте в следующих разделах.

 - **Чтение проекта**
 - **Просмотр подписок**
 - **Редактирование подписок**
 - **Удаление подписок** *
 - **Вклад в запросы на слияние**
 - **Общий вклад**

\* Примечание: Разрешение **Удаление подписок** может быть включено в **Редактирование подписок** в зависимости от вашей версии Azure.

Некоторые из этих разрешений доступны только через [API Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/organizations/security/namespace-reference?view=azure-devops) или [CLI](https://learn.microsoft.com/en-us/cli/azure/devops?view=azure-cli-latest). Мы также подробно описали использование API Azure DevOps ниже, чтобы ускорить настройку. В качестве альтернативы, вы можете использовать интерфейс Azure DevOps для включения разрешений, но вы не сможете получить наименьший набор разрешений.

<!-- вкладки для разрешений сервисного пользователя и отключения MFA для сервисных пользователей -->
<Tabs>

<TabItem value="permission" label="Требуемые разрешения для сервисных пользователей">

Права доступа сервисного пользователя также определяют, какие репозитории команда сможет выбрать во время настройки dbt‑проекта, поэтому администратор Azure DevOps должен предоставить сервисному пользователю как минимум доступ **Project Reader** _до_ создания нового проекта в <Constant name="cloud" />. Если вы переносите существующий dbt‑проект на использование нативной интеграции с Azure DevOps, сервисный пользователь учетной записи <Constant name="cloud" /> должен иметь соответствующие права доступа к репозиторию до начала миграции.
</TabItem>

<TabItem value="mfa" label="Отключение MFA для сервисного пользователя">

Хотя обычно для обычных учетных записей пользователей требуется многофакторная аутентификация (MFA), аутентификация сервисного пользователя не должна требовать дополнительного фактора. Если вы включите второй фактор для сервисного пользователя, это может прервать производственные запуски и вызвать сбой при клонировании репозитория. Чтобы токен доступа OAuth работал, лучшей практикой является удаление любой дополнительной проверки подлинности для сервисных пользователей.

В результате MFA необходимо **явно отключить** в панели администрирования Office 365 или Microsoft Entra ID для сервисного пользователя. Простого перевода MFA в состояние «не подключено» будет недостаточно, поскольку <Constant name="cloud" /> вместо использования учётных данных по назначению будет запрашивать настройку MFA.

**Чтобы отключить MFA для одного пользователя с помощью консоли администрирования Office 365:**

- Перейдите в центр администрирования Microsoft 365 -> Пользователи -> Активные пользователи -> Выберите пользователя -> Управление многофакторной аутентификацией -> Выберите пользователя -> Отключить многофакторную аутентификацию.

**Чтобы использовать интерфейс Microsoft Entra ID:**

Обратите внимание, что эта процедура включает отключение параметров безопасности в вашей среде Entra ID.

1. Перейдите в центр администрирования Azure. Откройте Microsoft Entra ID и в разделе **Управление** левой навигации нажмите **Свойства**, прокрутите вниз до **Управление параметрами безопасности**, затем выберите **Нет** в "Включить параметры безопасности" и нажмите **Сохранить**.
2. Перейдите в **Microsoft Entra ID** -> Управление -> Пользователи -> нажмите на многоточие (...) и затем на ссылку **Многофакторная аутентификация**. Если ссылка неактивна, убедитесь, что вы отключили **Параметры безопасности** на предыдущем шаге.
3. Если MFA включена для пользователей, выберите пользователя(ей) и выберите **Отключить** в разделе **Быстрые действия**.
4. Выберите **Да**, чтобы подтвердить изменения.

Чтобы снова включить MFA для пользователя, выберите его снова и нажмите **Включить**. Обратите внимание, что после включения может потребоваться пройти настройку MFA для этого пользователя.

</TabItem>

</Tabs>

<!-- Конец вкладок для разрешений сервисного пользователя и отключения MFA для сервисных пользователей -->

<details>
<summary>  <b>Просмотр подписок</b> </summary>
<br></br>

**ID пространства безопасности:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Пространство имен:** ServiceHooks

**Разрешение:**
```json
{
    "bit": 1,
    "displayName": "Просмотр подписок",
    "name": "ViewSubscriptions"
}
```

**Использование:** Для просмотра существующих подписок на сервисные хуки Azure DevOps

**Токен (где применимо - только API):**
- PublisherSecurity для доступа ко всем проектам
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; для доступа к каждому проекту

**UI/API/CLI:** Только API/CLI

**Пример кода CLI**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 1
```

</details>

<details>
<summary>  <b>Редактирование подписок</b> </summary>
<br></br>

**ID пространства безопасности:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Пространство имен:** ServiceHooks

**Разрешение:**
```json
{
    "bit": 2,
    "displayName": "Редактирование подписок",
    "name": "EditSubscriptions"
}

```

**Использование:** Для добавления или обновления существующих подписок на сервисные хуки Azure DevOps

**Токен (где применимо - только API):**
- PublisherSecurity для доступа ко всем проектам
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; для доступа к каждому проекту

**UI/API/CLI:** Только API/CLI

**Пример кода CLI**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 2
```

</details>

<details>
<summary>  <b>Удаление подписок</b> </summary>
<br></br>

**ID пространства безопасности:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Пространство имен:** ServiceHooks

**Разрешение:**
```json
{
    "bit": 4,
    "displayName": "Удаление подписок",
    "name": "DeleteSubscriptions"
}


```

**Использование:** Для удаления любых избыточных подписок на сервисные хуки Azure DevOps

**Токен (где применимо - только API):**
- PublisherSecurity для доступа ко всем проектам
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; для доступа к каждому проекту

**UI/API/CLI:** Только API/CLI

**Пример кода CLI**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 4
```

**Дополнительные заметки:** Это разрешение было устаревшим в последних версиях Azure DevOps. Разрешение на редактирование подписок (бит 2) включает разрешения на удаление.

</details>

<details>
<summary>  <b>Вклад в запросы на слияние</b> </summary>
<br></br>

**ID пространства безопасности:** 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87

**Пространство имён:** <Constant name="git" /> репозитории

**Разрешение:**
```json
{ 	
    "bit": 16384,  
    "displayName": "Вклад в запросы на слияние",
    "name": "PullRequestContribute"
}

```

**Использование:** Для публикации статусов запросов на слияние в Azure DevOps

**Токен (где применимо - только API):**
- repoV2 для доступа ко всем проектам
- repoV2/&lt;azure_devops_project_object_id&gt; для доступа к каждому проекту
- repoV2/&lt;azure_devops_project_object_id&gt;/&lt;azure_devops_repository_object_id&gt; для доступа к каждому репозиторию

**UI/API/CLI:** UI, API и CLI

**Пример кода CLI**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87 --subject <service_account>@xxxxxx.onmicrosoft.com --token repoV2/<azure_devops_project_object_id>/<azure_devops_repository_object_id> --allow-bit 16384
```

**Дополнительные заметки:** Это разрешение автоматически наследуется, если в UI установлено чтение/вклад/администрирование проекта.

</details>

<details>
<summary>  <b>Общий вклад</b> </summary>
<br></br>

**ID пространства безопасности:** 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87

**Пространство имён:** <Constant name="git" /> Репозитории

**Разрешение:**
```json
{
    "bit": 4,
    "displayName": "Общий вклад",
    "name": "GenericContribute"
}


```

**Использование:** Для публикации статусов коммитов в Azure DevOps

**Токен (где применимо - только API):**
- repoV2 для доступа ко всем проектам
- repoV2/&lt;azure_devops_project_object_id&gt; для доступа к каждому проекту
- repoV2/&lt;azure_devops_project_object_id&gt;/&lt;azure_devops_repository_object_id&gt; для доступа к каждому репозиторию

**UI/API/CLI:** UI, API и CLI

**Пример кода CLI**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87 --subject <service_account>@xxxxxx.onmicrosoft.com --token repoV2/<azure_devops_project_object_id>/<azure_devops_repository_object_id> --allow-bit 4
```

**Дополнительные заметки:** Это разрешение автоматически наследуется, если в UI установлено чтение/вклад/администрирование проекта.

</details>

Вы должны подключить сервисного пользователя перед настройкой проекта <Constant name="cloud" />, так как разрешения сервисного пользователя определяют, какие проекты <Constant name="cloud" /> сможет импортировать.

Администратор учетной записи <Constant name="cloud" />, имеющий доступ к учетной записи Azure DevOps сервисного пользователя, должен выполнить следующие шаги, чтобы подключить сервисного пользователя:

1. Войдите в учетную запись Azure DevOps сервисного пользователя.
2. В <Constant name="cloud" /> перейдите в **Account settings** > **Integrations**.
3. Перейдите в раздел **Azure DevOps** и выберите **Service User**.
4. Введите значения для обязательных полей.
6. Нажмите **Save**.
7. Нажмите **Link Azure service user**.
8. Вы будете перенаправлены в Azure DevOps, где необходимо принять разрешения приложения Microsoft Entra ID.
9. После этого вы будете перенаправлены обратно в <Constant name="cloud" />, и сервисный пользователь будет подключен.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/azure-service-user.png" title="Подключение Azure Service User"/>

После подключения <Constant name="cloud" /> отображает адрес электронной почты сервисного пользователя, чтобы вы понимали, от имени какого пользователя и с какими правами выполняются headless‑действия в средах развертывания. Чтобы изменить подключённую учётную запись, отключите профиль в <Constant name="cloud" />, войдите в альтернативную сервисную учётную запись Azure DevOps и снова свяжите эту учётную запись с <Constant name="cloud" />.

:::info Personal Access Tokens (PATs)
<Constant name="cloud" /> использует сервисного пользователя для генерации временных токенов доступа, называемых [PATs](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops&tabs=Windows).

Эти токены ограничены следующими [областями](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops):
- `vso.code_full`: Предоставляет полный доступ к исходному коду и метаданным управления версиями (коммиты, ветки и т.д.). Также предоставляет возможность создавать и управлять репозиториями кода, создавать и управлять запросами на слияние и обзорами кода, а также получать уведомления о событиях управления версиями с помощью сервисных хуков. Также включает ограниченную поддержку API клиентской OM.
- `vso.project`: Предоставляет возможность читать проекты и команды.
- `vso.build_execute`: Предоставляет возможность доступа к артефактам сборки, включая результаты сборки, определения и запросы, а также возможность ставить в очередь сборку, обновлять свойства сборки и получать уведомления о событиях сборки с помощью сервисных хуков.
:::