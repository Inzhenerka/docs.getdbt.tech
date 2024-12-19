---
title: "Настройка Azure DevOps"
id: "setup-azure"
description: "Вы можете настроить Azure DevOps, создав приложение Microsoft Entra ID и добавив его в dbt Cloud."
sidebar_label: "Настройка Azure DevOps"
---

<Snippet path="available-enterprise-tier-only" />

## Обзор

Чтобы использовать нашу нативную интеграцию с Azure DevOps в dbt Cloud, администратору аккаунта необходимо настроить приложение Microsoft Entra ID. Мы рекомендуем создать отдельное [приложение Entra ID, чем то, что используется для SSO](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id).

1. [Зарегистрируйте приложение Entra ID](#register-a-microsoft-entra-id-app).
2. [Добавьте разрешения для вашего нового приложения](#add-permissions-to-your-new-app).
3. [Добавьте другой URI перенаправления](#add-another-redirect-uri).
4. [Подключите Azure DevOps к вашему новому приложению](#connect-azure-devops-to-your-new-app).
5. [Добавьте ваше приложение Entra ID в dbt Cloud](#add-your-azure-ad-app-to-dbt-cloud).

После добавления приложения Microsoft Entra ID в dbt Cloud администратору аккаунта также необходимо [подключить сервисного пользователя](/docs/cloud/git/setup-azure#connect-a-service-user) через OAuth, который будет использоваться для выполнения безголовых действий в dbt Cloud, таких как развертывание и CI.

После добавления приложения Microsoft Entra ID в dbt Cloud и подключения сервисного пользователя, разработчики dbt Cloud смогут аутентифицироваться в dbt Cloud из Azure DevOps. Для получения дополнительной информации смотрите [Аутентификация с Azure DevOps](/docs/cloud/git/authenticate-azure).

Для выполнения шагов на этой странице требуются следующие роли:
- Администратор Microsoft Entra ID
- Администратор Azure DevOps
- Администратор аккаунта dbt Cloud
- Администратор Azure (если ваши окружения Entra ID и Azure DevOps не связаны)

## Зарегистрируйте приложение Microsoft Entra ID

Администратору Microsoft Entra ID необходимо выполнить следующие шаги:

1. Войдите в свой портал Azure и нажмите **Microsoft Entra ID**.
2. Выберите **Регистрация приложений** в левой панели.
3. Выберите **Новая регистрация**. Откроется форма для создания нового приложения Entra ID.
4. Укажите имя для вашего приложения. Мы рекомендуем использовать "dbt Labs Azure DevOps app".
5. Выберите **Учетные записи в любом организационном каталоге (Любой каталог Entra ID - Мультиарендатор)** в качестве поддерживаемых типов учетных записей. Многие клиенты спрашивают, почему им нужно выбирать мультиарендатор вместо единого арендатора, и часто ошибаются на этом шаге. Microsoft рассматривает Azure DevOps (ранее называвшийся Visual Studio) и Microsoft Entra ID как отдельные арендаторы, и для правильной работы этого приложения Entra ID необходимо выбрать мультиарендатор.
6. Добавьте URI перенаправления, выбрав **Web**, и введите в поле `https://YOUR_ACCESS_URL/complete/azure_active_directory`, заменив `YOUR_ACCESS_URL` на [соответствующий Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.
7. Нажмите **Зарегистрировать**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/ADnavigation.gif" title="Навигация к регистрации приложений Entra ID"/>

Вот как должно выглядеть ваше приложение перед его регистрацией:

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Регистрация приложения Microsoft Entra ID"/>

## Добавьте разрешения для вашего нового приложения

Администратору Entra ID необходимо предоставить вашему новому приложению доступ к Azure DevOps:

1. Выберите **Разрешения API** в левой навигационной панели.
2. Удалите разрешение **Microsoft Graph / Чтение пользователя**.
3. Нажмите **Добавить разрешение**.
4. Выберите **Azure DevOps**.
5. Выберите разрешение **user_impersonation**. Это единственное разрешение, доступное для Azure DevOps.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/user-impersonation.gif" title="Добавление разрешений к приложению"/>

## Добавьте другой URI перенаправления

Администратору Microsoft Entra ID необходимо добавить другой URI перенаправления к вашему приложению Entra ID. Этот URI перенаправления будет использоваться для аутентификации сервисного пользователя для безголовых действий в средах развертывания.

1. Перейдите к вашему приложению Microsoft Entra ID.
2. Выберите ссылку рядом с **URI перенаправления**.
3. Нажмите **Добавить URI** и добавьте URI, заменив `YOUR_ACCESS_URL` на [соответствующий Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана:
`https://YOUR_ACCESS_URL/complete/azure_active_directory_service_user`
4. Нажмите **Сохранить**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/redirect-uri.gif" title="Добавление URI перенаправления для сервисного пользователя"/>

## Создайте секрет клиента

Администратору Microsoft Entra ID необходимо выполнить следующие шаги:

1. Перейдите к вашему приложению Microsoft Entra ID.
2. Выберите **Сертификаты и секреты** в левой навигационной панели.
3. Выберите **Секреты клиента** и нажмите **Новый секрет клиента**.
4. Укажите описание секрета и выберите время истечения. Нажмите **Добавить**.
5. Скопируйте поле **Значение** и безопасно поделитесь им с администратором аккаунта dbt Cloud, который завершит настройку.

## Подключите Azure DevOps к вашему новому приложению

Администратору Azure потребуется одно из следующих разрешений как в среде Microsoft Entra ID, так и в Azure DevOps:
- Azure Service Administrator
- Azure Co-administrator

Если ваша учетная запись Azure DevOps подключена к Entra ID, вы можете перейти к [Подключению сервисного пользователя](#connect-a-service-user). Однако, если вы только начинаете настройку, подключите Azure DevOps к приложению Microsoft Entra ID, которое вы только что создали:

1. В вашей учетной записи Azure DevOps выберите **Настройки организации** в нижнем левом углу.
2. Перейдите к Microsoft Entra ID.
3. Нажмите **Подключить каталог**.
4. Выберите каталог, который вы хотите подключить.
5. Нажмите **Подключить**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/connect AD to Azure DevOps.gif" title="Подключение Azure DevOps и Microsoft Entra ID"/>

## Добавьте ваше приложение Microsoft Entra ID в dbt Cloud

Администратору аккаунта dbt Cloud необходимо выполнить следующие шаги.

После подключения вашего приложения Microsoft Entra ID и Azure DevOps вам необходимо предоставить dbt Cloud информацию о приложении:

1. Перейдите к настройкам вашего аккаунта в dbt Cloud.
2. Выберите **Интеграции**.
3. Прокрутите до раздела Azure DevOps.
4. Заполните форму:
    - **Организация Azure DevOps:** Должна точно соответствовать имени вашей организации Azure DevOps. Не включайте префикс `dev.azure.com/` в это поле. ✅ Используйте `my-devops-org` ❌ Избегайте `dev.azure.com/my-devops-org`
    - **Идентификатор приложения (клиента):** Найден в приложении Microsoft Entra ID.
    - **Секреты клиента:** Скопируйте поле **Значение** в секрете клиента приложения Microsoft Entra ID и вставьте его в поле **Секрет клиента** в dbt Cloud. Администраторы Entra ID несут ответственность за истечение секрета приложения Entra ID, и администраторы dbt должны отметить дату истечения для ротации.
    - **Идентификатор каталога (арендатора):** Найден в приложении Microsoft Entra ID.
        <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AzureDevopsAppdbtCloud.gif" title="Добавление приложения Microsoft Entra ID в dbt Cloud"/>

Ваше приложение Microsoft Entra ID теперь должно быть добавлено в ваш аккаунт dbt Cloud. Люди в вашей команде, которые хотят разрабатывать в IDE dbt Cloud или dbt Cloud CLI, теперь могут [авторизовать Azure DevOps из своих профилей](/docs/cloud/git/authenticate-azure).

## Подключите сервисного пользователя

Поскольку Azure DevOps требует, чтобы вся аутентификация была связана с разрешениями пользователя, мы рекомендуем администратору Azure DevOps создать "сервисного пользователя" в Azure DevOps, чьи разрешения будут использоваться для выполнения безголовых действий в dbt Cloud, таких как выбор репозитория проекта dbt Cloud, развертывание и CI. Сервисный пользователь — это псевдопользователь, настроенный так же, как администратор настраивает реального пользователя, но ему предоставляются разрешения, специально предназначенные для взаимодействия "сервис к сервису". Вам следует избегать связывания аутентификации с реальным пользователем Azure DevOps, потому что если этот человек покинет вашу организацию, dbt Cloud потеряет привилегии к репозиториям dbt Azure DevOps, что приведет к сбоям в производственных запусках.

:::info Истечение аутентификации сервисного пользователя
dbt Cloud будет обновлять аутентификацию для сервисного пользователя при каждом запуске, инициированном планировщиком, API или CI. Если у вашего аккаунта нет активных запусков более 90 дней, администратору необходимо вручную обновить аутентификацию сервисного пользователя, отключив и повторно подключив профиль сервисного пользователя через поток OAuth, описанный выше, чтобы возобновить безголовые взаимодействия, такие как настройка проекта, развертывание и CI.

:::

### Разрешения сервисных пользователей

Учетная запись сервисного пользователя должна иметь следующие разрешения Azure DevOps для всех проектов и репозиториев Azure DevOps, которые вы хотите сделать доступными в dbt Cloud. Читайте далее о том, как dbt Cloud использует каждое разрешение в следующих абзацах.

 - **Читатель проекта**
 - **ViewSubscriptions**
 - **EditSubscriptions**
 - **DeleteSubscriptions** *
 - **PullRequestContribute**
 - **GenericContribute**

\* Примечание: Разрешение **DeleteSubscriptions** может быть включено в **EditSubscriptions** в зависимости от вашей версии Azure.

Некоторые из этих разрешений доступны только через [API Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/organizations/security/namespace-reference?view=azure-devops) или [CLI](https://learn.microsoft.com/en-us/cli/azure/devops?view=azure-cli-latest). Мы также предоставили более подробную информацию о использовании API Azure DevOps ниже, чтобы помочь ускорить настройку. В качестве альтернативы вы можете использовать интерфейс Azure DevOps для включения разрешений, но вы не сможете получить набор с минимальными разрешениями.

<!-- tabs for service user permissions and turning off MFA for service users -->
<Tabs>

<TabItem value="permission" label="Требуемые разрешения для сервисных пользователей">

Разрешения сервисного пользователя также определяют, из каких репозиториев команда может выбирать во время настройки проекта dbt, поэтому администратор Azure DevOps должен предоставить как минимум доступ Читателя проекта сервисному пользователю _перед_ созданием нового проекта в dbt Cloud. Если вы мигрируете существующий проект dbt для использования нативной интеграции Azure DevOps, сервисный пользователь аккаунта dbt Cloud должен иметь соответствующие разрешения на репозиторий перед миграцией.
</TabItem>

<TabItem value="mfa" label="Отключить MFA для сервисного пользователя">

Хотя обычно требуется многофакторная аутентификация (MFA) для обычных учетных записей пользователей, аутентификация сервисного пользователя не должна требовать дополнительного фактора. Если вы включите второй фактор для сервисного пользователя, это может прервать производственные запуски и вызвать сбой при клонировании репозитория. Чтобы токен доступа OAuth работал, лучшая практика — убрать любое дополнительное бремя доказательства личности для сервисных пользователей.

В результате MFA должна быть явно отключена в панели администрирования Office 365 или Microsoft Entra ID для сервисного пользователя. Просто отключение не будет достаточным, так как dbt Cloud будет предложено настроить MFA вместо того, чтобы позволить использовать учетные данные по назначению.


**Чтобы отключить MFA для одного пользователя с помощью консоли администрирования Office 365:**

- Перейдите в центр администрирования Microsoft 365 -> Пользователи -> Активные пользователи -> Выберите пользователя -> Управление многофакторной аутентификацией -> Выберите пользователя -> Отключить многофакторную аутентификацию.

**Чтобы использовать интерфейс Microsoft Entra ID:**

Обратите внимание, что эта процедура включает отключение стандартных настроек безопасности в вашей среде Entra ID.

1. Перейдите в Центр администрирования Azure. Откройте Microsoft Entra ID и в разделе **Управление** в левой навигации нажмите **Свойства**, прокрутите вниз до **Управление стандартными настройками безопасности** и выберите **Нет** в "Включить стандартные настройки безопасности", затем нажмите **Сохранить**.
2. Перейдите в **Microsoft Entra ID** -> Управление -> Пользователи -> нажмите на многоточие (...) и затем на ссылку **Многофакторная аутентификация**. Если ссылка серого цвета, вам нужно убедиться, что вы отключили **Стандартные настройки безопасности** на предыдущем шаге.
3. Если MFA включена для пользователей, выберите пользователя(ей) и выберите **Отключить** в разделе **Быстрые действия**. 
4. Выберите **Да**, чтобы подтвердить изменения.

Чтобы повторно включить MFA для пользователя, выберите его снова и нажмите **Включить**. Обратите внимание, что вам, возможно, придется пройти настройку MFA для этого пользователя после его включения.

</TabItem>

</Tabs>

<!-- End tabs for service user permissions and turning off MFA for service users-->

<details>
<summary>  <b>ViewSubscriptions</b> </summary>
<br></br>

**Идентификатор пространства безопасности:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Пространство имен:** ServiceHooks

**Разрешение:**
```json
{
    "bit": 1,
    "displayName": "Просмотр подписок",
    "name": "ViewSubscriptions"
}
```

**Используется:** Для просмотра существующих подписок сервисных хуков Azure DevOps

**Токен (где применимо - только API):**
- PublisherSecurity для доступа ко всем проектам
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; для доступа к проекту

**UI/API/CLI:** Только API/CLI

**Пример кода CLI**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 1
```

</details>

<details>
<summary>  <b>EditSubscriptions</b> </summary>
<br></br>

**Идентификатор пространства безопасности:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Пространство имен:** ServiceHooks

**Разрешение:**
```json
{
    "bit": 2,
    "displayName": "Редактировать подписку",
    "name": "EditSubscriptions"
}
```

**Используется:** Для добавления или обновления существующих подписок сервисных хуков Azure DevOps

**Токен (где применимо - только API):**
- PublisherSecurity для доступа ко всем проектам
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; для доступа к проекту

**UI/API/CLI:** Только API/CLI

**Пример кода CLI**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 2
```

</details>

<details>
<summary>  <b>DeleteSubscriptions</b> </summary>
<br></br>

**Идентификатор пространства безопасности:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Пространство имен:** ServiceHooks

**Разрешение:**
```json
{
    "bit": 4,
    "displayName": "Удалить подписки",
    "name": "DeleteSubscriptions"
}
```

**Используется:** Для удаления любых избыточных подписок сервисных хуков Azure DevOps

**Токен (где применимо - только API):**
- PublisherSecurity для доступа ко всем проектам
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; для доступа к проекту

**UI/API/CLI:** Только API/CLI

**Пример кода CLI**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 4
```

**Дополнительные примечания:** Это разрешение было устаревшим в последних версиях Azure DevOps. Разрешение на редактирование подписок (бит 2) имеет разрешения на удаление.

</details>

<details>
<summary>  <b>PullRequestContribute</b> </summary>
<br></br>

**Идентификатор пространства безопасности:** 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87

**Пространство имен:** Git Repositories

**Разрешение:**
```json
{ 	
    "bit": 16384,  
    "displayName": "Вносить изменения в запросы на извлечение",
    "name": "PullRequestContribute"
}
```

**Используется:** Для публикации статусов запросов на извлечение в Azure DevOps

**Токен (где применимо - только API):**
- repoV2 для доступа ко всем проектам
- repoV2/&lt;azure_devops_project_object_id&gt; для доступа к проекту
- repoV2/&lt;azure_devops_project_object_id&gt;/&lt;azure_devops_repository_object_id&gt; для доступа к репозиторию

**UI/API/CLI:** UI, API и CLI

**Пример кода CLI**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87 --subject <service_account>@xxxxxx.onmicrosoft.com --token repoV2/<azure_devops_project_object_id>/<azure_devops_repository_object_id> --allow-bit 16384
```

**Дополнительные примечания:** Это разрешение автоматически наследуется, если в UI установлены разрешения Читателя/Участника/Администратора проекта.

</details>

<details>
<summary>  <b>GenericContribute</b> </summary>
<br></br>

**Идентификатор пространства безопасности:** 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87

**Пространство имен:** Git Repositories

**Разрешение:**
```json
{
    "bit": 4,
    "displayName": "Вносить изменения",
    "name": "GenericContribute"
}
```

**Используется:** Для публикации статусов коммитов в Azure DevOps

**Токен (где применимо - только API):**
- repoV2 для доступа ко всем проектам
- repoV2/&lt;azure_devops_project_object_id&gt; для доступа к одному проекту за раз
- repoV2/&lt;azure_devops_project_object_id&gt;/&lt;azure_devops_repository_object_id&gt; для доступа к одному репозиторию за раз

**UI/API/CLI:** UI, API и CLI

**Пример кода CLI**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87 --subject <service_account>@xxxxxx.onmicrosoft.com --token repoV2/<azure_devops_project_object_id>/<azure_devops_repository_object_id> --allow-bit 4
```

**Дополнительные примечания:** Это разрешение автоматически наследуется, если в UI установлены разрешения Участника/Администратора проекта.

</details>

Вам необходимо подключить сервисного пользователя перед настройкой проекта dbt Cloud, так как разрешения сервисного пользователя определяют, какие проекты dbt Cloud может импортировать.

Администратор аккаунта dbt Cloud с доступом к учетной записи Azure DevOps сервисного пользователя должен выполнить следующее, чтобы подключить сервисного пользователя:
1. Войдите в учетную запись Azure DevOps сервисного пользователя.
2. В dbt Cloud нажмите **Связать сервисного пользователя Azure**.
3. Вы будете перенаправлены в Azure DevOps и должны принять разрешения приложения Microsoft Entra ID.
4. Наконец, вы будете перенаправлены в dbt Cloud, и сервисный пользователь будет подключен.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/azure-service-user.png" title="Подключение сервисного пользователя Azure"/>

После подключения dbt Cloud отображает адрес электронной почты сервисного пользователя, чтобы вы знали, какие разрешения пользователя позволяют выполнять безголовые действия в средах развертывания. Чтобы изменить, какая учетная запись подключена, отключите профиль в dbt Cloud, войдите в альтернативную учетную запись сервисного пользователя Azure DevOps и повторно свяжите учетную запись в dbt Cloud.

### Использование Azure AD для SSO с dbt Cloud и инструментами Microsoft

Если вы используете Azure AD для SSO с dbt Cloud и инструментами Microsoft, поток SSO иногда может перенаправить вашего администратора аккаунта на их личную учетную запись вместо сервисного пользователя. Если это произойдет, выполните следующие шаги для решения проблемы:

1. Войдите в учетную запись Azure DevOps сервисного пользователя (убедитесь, что они также подключены к dbt Cloud через SSO).
2. Когда вы подключены к dbt Cloud, выйдите из Azure AD через [портал Azure](https://portal.azure.com/).
3. Отключите сервисного пользователя в dbt Cloud и выполните шаги для его повторной настройки.
4. Затем вам будет предложено ввести учетные данные сервисного пользователя.

:::info Личные токены доступа (PAT)
dbt Cloud использует сервисного пользователя для генерации временных токенов доступа, называемых [PAT](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops&tabs=Windows). 

Эти токены имеют ограниченный объем, действительны только в течение 5 минут и становятся недействительными после одного вызова API.

Эти токены ограничены следующими [объемами](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops):
- `vso.code_full`: Предоставляет полный доступ к исходному коду и метаданным управления версиями (коммиты, ветки и т. д.). Также предоставляет возможность создавать и управлять репозиториями кода, создавать и управлять запросами на извлечение и кодовыми ревью, а также получать уведомления о событиях управления версиями с помощью сервисных хуков. Также включает ограниченную поддержку для API Client OM.
- `vso.project`: Предоставляет возможность читать проекты и команды.
- `vso.build_execute`: Предоставляет возможность получать доступ к артефактам сборки, включая результаты сборки, определения и запросы, а также возможность ставить сборку в очередь, обновлять свойства сборки и получать уведомления о событиях сборки с помощью сервисных хуков.
:::