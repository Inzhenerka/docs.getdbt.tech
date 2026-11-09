---
title: "Настройка Azure DevOps"
id: "setup-service-principal"
description: "Вы можете настроить Azure DevOps, создав приложение Microsoft Entra ID и добавив его в dbt."
sidebar_label: "Настройка субъекта-службы"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Настройка Azure DevOps

## Обзор service principal {#service-principal-overview}

:::note

Если вы впервые настраиваете приложение Entra как service principal, ознакомьтесь с [документацией Microsoft](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal) и выполните необходимые предварительные шаги для подготовки среды.

:::

Чтобы использовать встроенную интеграцию <Constant name="dbt" /> с Azure DevOps, администратору аккаунта необходимо настроить приложение Microsoft Entra ID в качестве субъекта-службы (service principal). Мы рекомендуем настроить отдельное [приложение Entra ID, отличное от используемого для SSO](/docs/platform/manage-access/set-up-sso-microsoft-entra-id).

Service principal приложения представляет собой объект приложения Entra ID. В то время как «service user» представляет реального пользователя в Azure с Entra ID (и соответствующей лицензией), «service principal» — это защищённая идентификация, используемая приложением для неинтерактивного доступа к ресурсам Azure. Service principal проходит аутентификацию с помощью client ID и секрета, а не имени пользователя и пароля (или других форм пользовательской аутентификации). Service principal — это [рекомендуемый Microsoft способ](https://learn.microsoft.com/en-us/entra/architecture/secure-service-accounts#types-of-microsoft-entra-service-accounts) аутентификации приложений.

1. [Зарегистрировать приложение Entra ID](#register-a-microsoft-entra-id-app).
2. [Подключить Azure DevOps к новому приложению](#connect-azure-devops-to-your-new-app).
3. [Добавить приложение Entra ID в <Constant name="cloud" />](#connect-your-microsoft-entra-id-app-to-dbt).

1. [Зарегистрируйте приложение Entra ID](#register-a-microsoft-entra-id-app).
2. [Подключите Azure DevOps к новому приложению](#connect-azure-devops-to-your-new-app).
3. [Добавьте приложение Entra ID в <Constant name="dbt" />](#connect-your-microsoft-entra-id-app-to-dbt).

После добавления приложения Microsoft Entra ID в <Constant name="dbt" /> оно будет выступать в качестве [субъекта-службы (service principal)](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals?tabs=browser), который будет использоваться для выполнения действий без участия пользователя в <Constant name="dbt" />, таких как запуски в среде развертывания и CI. Затем разработчики <Constant name="dbt" /> смогут проходить персональную аутентификацию в <Constant name="dbt" /> через Azure DevOps. Подробнее см. в разделе [Аутентификация через Azure DevOps](/docs/platform/git/authenticate-azure).

Для выполнения шагов на этой странице потребуется участие пользователей со следующими ролями:
- Администратор Microsoft Entra ID
- Администратор Azure DevOps
- Администратор аккаунта <Constant name="dbt" />
- Администратор Azure (если ваши среды Entra ID и Azure DevOps не подключены друг к другу)

Администратор Microsoft Entra ID должен выполнить следующие шаги:

:::info Согласие администратора

Если в вашем тенанте пользователям запрещено самостоятельно предоставлять согласие, после добавления разрешений API администратор Entra ID должен предоставить этому приложению согласие администратора на уровне всего тенанта (Enterprise Applications -> ваше приложение -> Permissions -> Grant admin consent).

:::

## Регистрация приложения Microsoft Entra ID {#register-a-microsoft-entra-id-app}

Администратору Microsoft Entra ID необходимо выполнить следующие действия:

1. Войдите на портал Azure и нажмите **Microsoft Entra ID**.
2. Выберите **App registrations** на панели слева.
3. Выберите **New registration**. Откроется форма создания нового приложения Entra ID.
4. Укажите имя приложения. Рекомендуем использовать «dbt Labs Azure DevOps app».
5. В разделе Supported Account Types выберите **Accounts in any organizational directory (Any Entra ID directory - Multitenant)**.
Многие клиенты спрашивают, почему нужно выбирать Multitenant вместо Single Tenant, и часто допускают ошибку на этом шаге. Microsoft рассматривает Azure DevOps (ранее Visual Studio) и Microsoft Entra ID как отдельные тенанты, поэтому для корректной работы приложения Entra ID необходимо выбрать Multitenant.
6. В разделе **Redirect URI** выберите **Web**. Скопируйте URI перенаправления из <Constant name="dbt" /> и вставьте его в следующее поле. Чтобы найти URI перенаправления в <Constant name="dbt" />:
    1. В <Constant name="dbt" /> перейдите в **Account Settings** -> **Integrations**.
    2. Нажмите **значок редактирования** рядом с **Azure DevOps**.
    3. Скопируйте первое значение **Redirect URIs**, которое имеет вид `https://<YOUR_ACCESS_URL>/complete/azure_active_directory` и НЕ заканчивается на `service_user`.
7. Нажмите **Register**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Регистрация приложения Microsoft Entra ID"/>

<Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/AD app.png" title="Регистрация приложения Microsoft Entra ID"/>

Администратор Microsoft Entra ID должен выполнить следующие шаги:

1. Перейдите в **Microsoft Entra ID**, выберите **App registrations** и откройте ваше приложение.
2. В левой панели навигации выберите **Certificates and Secrets**.
3. Выберите **Client secrets** и нажмите **New client secret**.
4. Укажите описание секрета и срок действия. Нажмите **Add**.
5. Скопируйте значение поля **Value** и безопасно передайте его администратору аккаунта <Constant name="cloud" />, который завершит настройку.

1. Перейдите в **Microsoft Entra ID**, нажмите **App registrations** и выберите своё приложение.
2. Выберите **Certificates and Secrets** на левой панели навигации.
3. Выберите **Client secrets** и нажмите **New client secret**
4. Укажите описание секрета и выберите срок его действия. Нажмите **Add**.
5. Скопируйте содержимое поля **Value** и передайте его по защищённому каналу администратору аккаунта <Constant name="dbt" />, который завершит настройку.

После создания приложения необходимо проверить, существует ли для него service principal. Во многих случаях, если подобная настройка выполнялась ранее, новые приложения получают service principal автоматически при создании.

1. Перейдите в **Microsoft Entra ID**.
2. В разделе **Manage** в левом меню выберите **App registrations**.
3. Откройте приложение для интеграции <Constant name="cloud" /> и Azure DevOps.
4. Найдите поле **Managed application in local directory** и, если доступна соответствующая опция, нажмите **Create Service Principal**. Если поле уже заполнено, значит service principal уже создан.

1. Перейдите в **Microsoft Entra ID**.
2. В разделе **Manage** в меню слева нажмите **App registrations**.
3. Выберите приложение для интеграции <Constant name="dbt" /> с Azure DevOps.
4. Найдите поле **Managed application in local directory** и, если доступна соответствующая опция, нажмите **Create Service Principal**. Если поле уже заполнено, субъект-служба уже назначен.  

    <Lightbox src="/img/docs/platform-integrations/create-service-principal.png" width="80%" title="Пример с выделенной опцией «Create Service Principal»."/>

## Добавление разрешений для service principal {#add-permissions-to-your-service-principal}

Администратор Entra ID должен предоставить новому приложению доступ к Azure DevOps:

1. В левой панели навигации выберите **API permissions**.
2. Удалите разрешение **Microsoft Graph / User Read**.
3. Нажмите **Add a permission**.
4. Выберите **Azure DevOps**.
5. Выберите разрешение **user_impersonation**. Это единственное доступное разрешение для Azure DevOps.

## Подключение Azure DevOps к новому приложению {#connect-azure-devops-to-your-new-app}

Администратору Azure потребуется одна из следующих ролей как в Microsoft Entra ID, так и в Azure DevOps:
- Azure Service Administrator
- Azure Co-administrator

:::note

Вы можете добавить managed identity или service principal только для того тенанта, к которому подключена ваша организация. Необходимо добавить директорию в организацию, чтобы она имела доступ ко всем service principal и другим идентификациям.  
Перейдите в **Organization settings** --> **Microsoft Entra** --> **Connect Directory**, чтобы выполнить подключение.

:::

1. На экране организации Azure DevOps нажмите **Organization settings** в левом нижнем углу.
2. В разделе **General** выберите **Users**.
3. Нажмите **Add users** и в появившейся панели введите имя service principal в первом поле. Затем выберите его из выпадающего списка.
4. В поле **Add to projects** отметьте проекты, которые нужно включить (или выберите все).
5. В поле **Azure DevOps Groups** выберите **Project Administrator**.

<Lightbox src="/img/docs/dbt-platform/connecting-azure-devops/add-service-principal.png" width="80%" title="Пример настройки с субъектом-службой, добавленным в качестве пользователя."/>

## Подключение приложения Microsoft Entra ID к dbt {#connect-your-microsoft-entra-id-app-to-dbt}

Администратор аккаунта <Constant name="dbt" /> должен выполнить следующие действия.

После подключения приложения Microsoft Entra ID к Azure DevOps необходимо предоставить <Constant name="dbt" /> информацию о приложении. Если настройка выполняется впервые, создайте новую конфигурацию. Если вы [переходите с использования служебного пользователя](#migrate-to-service-principal), можно отредактировать существующую конфигурацию, выбрав **Service principal**.

Чтобы создать конфигурацию:
1. Перейдите в настройки аккаунта в <Constant name="cloud" />.
2. Выберите **Integrations**.
3. Прокрутите до раздела Azure DevOps и нажмите **иконку редактирования**.
4. Выберите опцию **Service principal** (конфигурации service user при необходимости автоматически заполнят поля).
5. Заполните или отредактируйте форму (при миграции существующие значения сохраняются):
    - **Azure DevOps Organization:** Должно точно совпадать с именем вашей организации Azure DevOps. Не указывайте префикс `dev.azure.com/`. ✅ Используйте `my-DevOps-org` ❌ Не используйте `dev.azure.com/my-DevOps-org`
    - **Application (client) ID:** Указывается из приложения Microsoft Entra ID.
    - **Client Secret:** Скопируйте значение поля **Value** из client secrets приложения Microsoft Entra ID и вставьте его в поле **Client Secret** в <Constant name="cloud" />. Администраторы Entra ID отвечают за срок действия секрета, а администраторы dbt должны зафиксировать дату истечения для последующей ротации.
    - **Directory(tenant) ID:** Указывается из приложения Microsoft Entra ID.
        <Lightbox src="/img/docs/cloud-integrations/service-principal-fields.png" title="Поля для добавления приложения Entra ID в dbt."/>

Чтобы создать конфигурацию: 
1. Перейдите в настройки своей учетной записи в <Constant name="dbt" />.
2. Выберите **Integrations**.
3. Прокрутите страницу до раздела Azure DevOps и нажмите **значок редактирования**.
4. Выберите вариант **Service principal** (при наличии конфигурации служебного пользователя поля будут заполнены автоматически).
5. Заполните или отредактируйте форму (при миграции существующие настройки сохраняются):
    - **Azure DevOps Organization:** Значение должно точно совпадать с названием вашей организации Azure DevOps. Не включайте префикс `dev.azure.com/` в это поле. ✅ Используйте `my-DevOps-org` ❌ Не используйте `dev.azure.com/my-DevOps-org`
    - **Application (client) ID:** Указан в приложении Microsoft Entra ID.
    - **Client Secret**: Скопируйте значение поля **Value** в разделе секретов клиента приложения Microsoft Entra ID и вставьте его в поле **Client Secret** в <Constant name="dbt" />. Администраторы Entra ID отвечают за срок действия секрета приложения, а администраторам dbt следует зафиксировать дату истечения его срока действия для своевременной ротации.
    - **Directory(tenant) ID:** Указан в приложении Microsoft Entra ID.
        <Lightbox src="/img/docs/platform-integrations/service-principal-fields.png" title="Поля для добавления приложения Entra ID в dbt."/>

Теперь ваше приложение Microsoft Entra ID должно быть добавлено в вашу учетную запись <Constant name="dbt" />. Участники вашей команды, которые хотят разрабатывать в <Constant name="studio_ide" /> или <Constant name="dbt" /> CLI, теперь могут самостоятельно [авторизовать доступ к Azure DevOps из своих профилей](/docs/platform/git/authenticate-azure).

## Миграция с service user на service principal {#migrate-to-service-principal}

Выполните миграцию с service user на service principal, используя существующее приложение. Это займёт всего несколько шагов и не приведёт к перерывам в работе сервиса.

- Проверьте, существует ли у приложения service principal
    - Если нет — создайте service principal для приложения
- Обновите конфигурацию приложения
- Обновите конфигурацию в <Constant name="cloud" />

### Проверка service principal {#verify-the-service-principal}

- Проверьте, есть ли у вашего приложения субъект-служба
    - Если нет, создайте субъект-службу для приложения
- Обновите конфигурацию приложения
- Обновите конфигурацию в <Constant name="dbt" />

Чтобы проверить, есть ли у существующего приложения service principal:

1. В аккаунте Azure перейдите в **Microsoft Entra ID** -> **Manage** -> **App registrations**.
2. Откройте приложение, используемое для интеграции service user с <Constant name="cloud" />.
3. Проверьте, заполнено ли поле **Managed application in local directory**.
    - Если имя указано: service principal уже создан. Перейдите к шагу 4.
    - Если имя отсутствует: перейдите к следующему разделу [Создание service principal](#create-the-service-principal).
4. Следуйте инструкциям по [добавлению разрешений](#add-permissions-to-your-service-principal) для service principal.
5. Следуйте инструкциям по [подключению DevOps к приложению](#connect-azure-devops-to-your-new-app).
6. В аккаунте <Constant name="cloud" />:
    1. Перейдите в **Account settings** и выберите **Integrations**
    2. Нажмите **иконку редактирования** справа от настроек **Azure DevOps**
    3. Измените **Service user** на **Service principal** и нажмите **Save**. Изменять существующие поля не требуется.

Чтобы проверить, есть ли у вашего существующего приложения субъект-служба (service principal):
 
1. В учетной записи Azure перейдите в **Microsoft Entra ID** -> **Manage** -> **App registrations**.
2. Нажмите на приложение для интеграции служебного пользователя с <Constant name="dbt" />. 
3. Проверьте, указано ли имя в поле **Managed application in local directory**. 
    - Если имя указано: субъект-служба уже создан. Перейдите к шагу 4.
    - Если имя не указано: перейдите к следующему разделу — [Создание субъекта-службы](#create-the-service-principal).
4. Следуйте инструкциям по [добавлению разрешений](#add-permissions-to-your-service-principal) для вашего субъекта-службы.
5. Следуйте инструкциям по [подключению DevOps к вашему приложению](#connect-azure-devops-to-your-new-app).
6. В вашей учетной записи <Constant name="dbt" />:
    1. Перейдите в **Account settings** и нажмите **Integrations**
    2. Нажмите **значок редактирования** справа от настроек **Azure DevOps**.
    3. Измените **Service user** на **Service principal** и нажмите **Save**. Изменять существующие поля не требуется.

### Создание service principal {#create-the-service-principal}

Если поле не заполнено, service principal не существует. Чтобы настроить service principal, выполните следующие инструкции.

Если у приложения <Constant name="cloud" /> нет service principal, выполните следующие действия в аккаунте Azure:

Если у вашего приложения <Constant name="dbt" /> нет субъекта-службы (service principal), выполните следующие действия в своей учетной записи Azure:

1. Перейдите в **Microsoft Entra ID**.
2. В разделе **Manage** в меню слева нажмите **App registrations**.
3. Выберите приложение для интеграции <Constant name="dbt" /> и Azure DevOps.
4. Найдите поле **Managed application in local directory** и нажмите **Create Service Principal**. 

    <Lightbox src="/img/docs/platform-integrations/create-service-principal.png" width="80%" title="Пример с выделенным пунктом 'Create Service Principal'."/>

5. Следуйте инструкциям, чтобы [добавить разрешения](#add-permissions-to-your-service-principal) для вашего субъекта-службы.
6. Следуйте инструкциям, чтобы [подключить DevOps к вашему приложению](#connect-azure-devops-to-your-new-app).
7. В своей учетной записи <Constant name="dbt" />:
    1. Перейдите в **Account settings** и нажмите **Integrations**
    2. Нажмите **значок редактирования** справа от настроек **Azure DevOps**.
    3. Измените **Service user** на **Service principal** и нажмите **Save**. Изменять существующие поля не требуется.
