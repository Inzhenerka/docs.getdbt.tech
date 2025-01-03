---
title: "Настройка Azure DevOps"
id: "setup-azure"
description: "Вы можете настроить Azure DevOps, создав приложение Microsoft Entra ID и добавив его в dbt Cloud."
sidebar_label: "Настройка Azure DevOps"
---

<Snippet path="available-enterprise-tier-only" />

## Обзор

Чтобы использовать нашу нативную интеграцию с Azure DevOps в dbt Cloud, администратору аккаунта необходимо настроить приложение Microsoft Entra ID. Мы рекомендуем настроить отдельное [приложение Entra ID, отличное от используемого для SSO](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id).

1. [Зарегистрируйте приложение Entra ID](#register-a-microsoft-entra-id-app).
2. [Добавьте разрешения для вашего нового приложения](#add-permissions-to-your-new-app).
3. [Добавьте другой URI перенаправления](#add-another-redirect-uri).
4. [Подключите Azure DevOps к вашему новому приложению](#connect-azure-devops-to-your-new-app).
5. [Добавьте ваше приложение Entra ID в dbt Cloud](#add-your-azure-ad-app-to-dbt-cloud).

После того как приложение Microsoft Entra ID добавлено в dbt Cloud, администратору аккаунта также необходимо [подключить сервисного пользователя](/docs/cloud/git/setup-azure#connect-a-service-user) через OAuth, который будет использоваться для выполнения безголовых действий в dbt Cloud, таких как развертывание и CI.

После того как приложение Microsoft Entra ID добавлено в dbt Cloud и сервисный пользователь подключен, разработчики dbt Cloud могут лично аутентифицироваться в dbt Cloud из Azure DevOps. Подробнее об этом см. в разделе [Аутентификация с Azure DevOps](/docs/cloud/git/authenticate-azure).

Для выполнения шагов на этой странице требуются следующие роли:
- администратор Microsoft Entra ID
- администратор Azure DevOps
- администратор аккаунта dbt Cloud
- администратор Azure (если ваши среды Entra ID и Azure DevOps не подключены)

## Регистрация приложения Microsoft Entra ID

Администратору Microsoft Entra ID необходимо выполнить следующие шаги:

1. Войдите в свой портал Azure и нажмите **Microsoft Entra ID**.
2. Выберите **Регистрация приложений** в левой панели.
3. Выберите **Новая регистрация**. Откроется форма для создания нового приложения Entra ID.
4. Укажите имя для вашего приложения. Мы рекомендуем использовать "dbt Labs Azure DevOps app".
5. Выберите **Учетные записи в любом организационном каталоге (любой каталог Entra ID - многопользовательский)** в качестве поддерживаемых типов учетных записей.
Многие клиенты спрашивают, почему нужно выбирать многопользовательский режим вместо одного арендатора, и часто ошибаются на этом шаге. Microsoft рассматривает Azure DevOps (ранее называвшийся Visual Studio) и Microsoft Entra ID как отдельные арендаторы, и для правильной работы этого приложения Entra ID необходимо выбрать многопользовательский режим.
6. Добавьте URI перенаправления, выбрав **Web** и введя в поле `https://YOUR_ACCESS_URL/complete/azure_active_directory`, заменив `YOUR_ACCESS_URL` на [соответствующий URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.
7. Нажмите **Зарегистрировать**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/ADnavigation.gif" title="Навигация к регистрации приложений Entra ID"/>

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

2. Выберите ссылку рядом с **URI перенаправления**.
3. Нажмите **Добавить URI** и добавьте URI, заменив `YOUR_ACCESS_URL` на [соответствующий URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана:
`https://YOUR_ACCESS_URL/complete/azure_active_directory_service_user`
4. Нажмите **Сохранить**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/redirect-uri.gif" title="Добавление URI перенаправления для сервисного пользователя"/>

## Создание клиентского секрета

Администратору Microsoft Entra ID необходимо выполнить следующие шаги:

1. Перейдите к вашему приложению Microsoft Entra ID.
2. Выберите **Сертификаты и секреты** в левой панели навигации.
3. Выберите **Клиентские секреты** и нажмите **Новый клиентский секрет**.
4. Дайте секрету описание и выберите время истечения срока действия. Нажмите **Добавить**.
5. Скопируйте поле **Значение** и безопасно передайте его администратору аккаунта dbt Cloud, который завершит настройку.

## Подключение Azure DevOps к вашему новому приложению

Администратору Azure потребуется одно из следующих разрешений как в среде Microsoft Entra ID, так и в среде Azure DevOps:
- Администратор службы Azure
- Коадминистратор Azure

Если ваш аккаунт Azure DevOps подключен к Entra ID, вы можете перейти к [Подключению сервисного пользователя](#connect-a-service-user). Однако, если вы только начинаете настройку, подключите Azure DevOps к только что созданному приложению Microsoft Entra ID:

1. В вашем аккаунте Azure DevOps выберите **Настройки организации** в нижнем левом углу.
2. Перейдите к Microsoft Entra ID.
3. Нажмите **Подключить каталог**.
4. Выберите каталог, который вы хотите подключить.
5. Нажмите **Подключить**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/connect AD to Azure DevOps.gif" title="Подключение Azure DevOps и Microsoft Entra ID"/>

## Добавление вашего приложения Microsoft Entra ID в dbt Cloud

Администратору аккаунта dbt Cloud необходимо выполнить следующие шаги.

После подключения вашего приложения Microsoft Entra ID и Azure DevOps, вам нужно предоставить dbt Cloud информацию о приложении:

1. Перейдите в настройки вашего аккаунта в dbt Cloud.
2. Выберите **Интеграции**.
3. Прокрутите до раздела Azure DevOps.
4. Заполните форму:
    - **Организация Azure DevOps:** Должна точно соответствовать названию вашей организации Azure DevOps. Не включайте префикс `dev.azure.com/` в это поле. ✅ Используйте `my-devops-org` ❌ Избегайте `dev.azure.com/my-devops-org`
    - **ID приложения (клиента):** Найден в приложении Microsoft Entra ID.
    - **Клиентские секреты:** Скопируйте поле **Значение** в клиентских секретах приложения Microsoft Entra ID и вставьте его в поле **Клиентский секрет** в dbt Cloud. Администраторы Entra ID отвечают за истечение срока действия секрета приложения Entra ID, и администраторы dbt должны отметить дату истечения для ротации.
    - **ID каталога (арендатора):** Найден в приложении Microsoft Entra ID.
        <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AzureDevopsAppdbtCloud.gif" title="Добавление приложения Microsoft Entra ID в dbt Cloud"/>

Ваше приложение Microsoft Entra ID теперь должно быть добавлено в ваш аккаунт dbt Cloud. Люди в вашей команде, которые хотят разрабатывать в dbt Cloud IDE или dbt Cloud CLI, теперь могут лично [авторизовать Azure DevOps из своих профилей](/docs/cloud/git/authenticate-azure).

## Подключение сервисного пользователя

Поскольку Azure DevOps требует, чтобы вся аутентификация была связана с разрешениями пользователя, мы рекомендуем администратору Azure DevOps создать "сервисного пользователя" в Azure DevOps, чьи разрешения будут использоваться для выполнения безголовых действий в dbt Cloud, таких как выбор репозитория проекта dbt Cloud, развертывание и CI. Сервисный пользователь - это псевдопользователь, настроенный так же, как администратор настраивает реального пользователя, но ему предоставляются разрешения, специально предназначенные для взаимодействий между сервисами. Вы должны избегать связывания аутентификации с реальным пользователем Azure DevOps, потому что если этот человек покинет вашу организацию, dbt Cloud потеряет привилегии к репозиториям dbt Azure DevOps, что приведет к сбоям в производственных запусках.

:::info Истечение срока действия аутентификации сервисного пользователя
dbt Cloud будет обновлять аутентификацию для сервисного пользователя при каждом запуске, инициированном планировщиком, API или CI. Если в вашем аккаунте нет активных запусков более 90 дней, администратору потребуется вручную обновить аутентификацию сервисного пользователя, отключив и повторно подключив профиль сервисного пользователя через описанный выше поток OAuth, чтобы возобновить безголовые взаимодействия, такие как настройка проекта, развертывание и CI.

:::

### Разрешения сервисных пользователей

Аккаунт сервисного пользователя должен иметь следующие разрешения Azure DevOps для всех проектов и репозиториев Azure DevOps, которые вы хотите сделать доступными в dbt Cloud. Подробнее о том, как dbt Cloud использует каждое разрешение, читайте в следующих параграфах.

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

Разрешения сервисного пользователя также определяют, какие репозитории команда может выбрать во время настройки проекта dbt, поэтому администратор Azure DevOps должен предоставить как минимум доступ к чтению проекта сервисному пользователю _перед_ созданием нового проекта в dbt Cloud. Если вы мигрируете существующий проект dbt для использования нативной интеграции Azure DevOps, сервисный пользователь аккаунта dbt Cloud должен иметь надлежащие разрешения на репозиторий до миграции.
</TabItem>

<TabItem value="mfa" label="Отключение MFA для сервисного пользователя">

Хотя обычно для обычных учетных записей пользователей требуется многофакторная аутентификация (MFA), аутентификация сервисного пользователя не должна требовать дополнительного фактора. Если вы включите второй фактор для сервисного пользователя, это может прервать производственные запуски и вызвать сбой при клонировании репозитория. Чтобы токен доступа OAuth работал, лучшей практикой является удаление любой дополнительной проверки подлинности для сервисных пользователей.

В результате MFA (многофакторная аутентификация) должна быть явно отключена в административной панели Office 365 или Microsoft Entra ID для служебного пользователя. Простого "отключения подключения" будет недостаточно, так как dbt Cloud будет запрашивать настройку MFA вместо того, чтобы позволить использовать учетные данные по назначению.

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

**Пространство имен:** Git Repositories

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

**Пространство имен:** Git Repositories

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

Вы должны подключить своего сервисного пользователя перед настройкой проекта dbt Cloud, так как разрешения сервисного пользователя определяют, какие проекты dbt Cloud может импортировать.

Администратор аккаунта dbt Cloud с доступом к аккаунту сервисного пользователя Azure DevOps должен выполнить следующие действия для подключения сервисного пользователя:
1. Войдите в аккаунт сервисного пользователя Azure DevOps.
2. В dbt Cloud нажмите **Связать Azure Service User**.
3. Вы будете перенаправлены в Azure DevOps и должны принять разрешения приложения Microsoft Entra ID.
4. Наконец, вы будете перенаправлены в dbt Cloud, и сервисный пользователь будет подключен.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/azure-service-user.png" title="Подключение Azure Service User"/>

После подключения dbt Cloud отображает адрес электронной почты сервисного пользователя, чтобы вы знали, чьи разрешения позволяют выполнять безголовые действия в средах развертывания. Чтобы изменить подключенный аккаунт, отключите профиль в dbt Cloud, войдите в альтернативный аккаунт сервисного пользователя Azure DevOps и повторно свяжите аккаунт в dbt Cloud.

### Использование Azure AD для SSO с dbt Cloud и инструментами Microsoft

Если вы используете Azure AD для SSO с dbt Cloud и инструментами Microsoft, поток SSO может иногда перенаправлять вашего администратора аккаунта на его личный пользовательский аккаунт вместо сервисного пользователя. Если это произойдет, выполните следующие шаги для решения проблемы:

1. Войдите в аккаунт сервисного пользователя Azure DevOps (убедитесь, что он также подключен к dbt Cloud через SSO).
2. При подключении к dbt Cloud выйдите из Azure AD через [портал Azure](https://portal.azure.com/).
3. Отключите сервисного пользователя в dbt Cloud и следуйте шагам для его повторной настройки.
4. Вам будет предложено ввести учетные данные сервисного пользователя.

:::info Личные токены доступа (PATs)
dbt Cloud использует сервисного пользователя для генерации временных токенов доступа, называемых [PATs](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops&tabs=Windows).

Эти токены ограничены по объему, действительны только 5 минут и становятся недействительными после одного вызова API.

Эти токены ограничены следующими [областями](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops):
- `vso.code_full`: Предоставляет полный доступ к исходному коду и метаданным управления версиями (коммиты, ветки и т.д.). Также предоставляет возможность создавать и управлять репозиториями кода, создавать и управлять запросами на слияние и обзорами кода, а также получать уведомления о событиях управления версиями с помощью сервисных хуков. Также включает ограниченную поддержку API клиентской OM.
- `vso.project`: Предоставляет возможность читать проекты и команды.
- `vso.build_execute`: Предоставляет возможность доступа к артефактам сборки, включая результаты сборки, определения и запросы, а также возможность ставить в очередь сборку, обновлять свойства сборки и получать уведомления о событиях сборки с помощью сервисных хуков.
:::