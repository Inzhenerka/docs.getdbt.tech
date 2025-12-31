---
title: "Настройка Azure DevOps"
id: "setup-service-principal"
description: "Вы можете настроить Azure DevOps, создав приложение Microsoft Entra ID и добавив его в dbt."
sidebar_label: "Настройка service principal"
---

# Настройка Azure DevOps <Lifecycle status="managed,managed_plus" /> {#set-up-azure-devops}

## Обзор service principal {#service-principal-overview}

:::note

Если вы впервые настраиваете приложение Entra как service principal, ознакомьтесь с [документацией Microsoft](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal) и выполните необходимые предварительные шаги для подготовки среды.

:::

Чтобы использовать нативную интеграцию <Constant name="cloud" /> с Azure DevOps, администратору аккаунта необходимо настроить приложение Microsoft Entra ID в качестве service principal. Мы рекомендуем настраивать [отдельное приложение Entra ID, не то, которое используется для SSO](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id).

Service principal приложения представляет собой объект приложения Entra ID. В то время как «service user» представляет реального пользователя в Azure с Entra ID (и соответствующей лицензией), «service principal» — это защищённая идентификация, используемая приложением для неинтерактивного доступа к ресурсам Azure. Service principal проходит аутентификацию с помощью client ID и секрета, а не имени пользователя и пароля (или других форм пользовательской аутентификации). Service principal — это [рекомендуемый Microsoft способ](https://learn.microsoft.com/en-us/entra/architecture/secure-service-accounts#types-of-microsoft-entra-service-accounts) аутентификации приложений.

1. [Зарегистрировать приложение Entra ID](#register-a-microsoft-entra-id-app).
2. [Подключить Azure DevOps к новому приложению](#connect-azure-devops-to-your-new-app).
3. [Добавить приложение Entra ID в <Constant name="cloud" />](#connect-your-microsoft-entra-id-app-to-dbt).

После добавления приложения Microsoft Entra ID в <Constant name="cloud" /> оно будет использоваться как [service principal](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals?tabs=browser), который обеспечит выполнение headless-действий в <Constant name="cloud" />, таких как deployment runs и CI. Разработчики <Constant name="cloud" /> смогут затем персонально аутентифицироваться в <Constant name="cloud" /> через Azure DevOps. Подробнее см. [Аутентификация с Azure DevOps](/docs/cloud/git/authenticate-azure).

Для выполнения шагов на этой странице требуются следующие роли:
- администратор Microsoft Entra ID
- администратор Azure DevOps
- администратор аккаунта <Constant name="cloud" />
- администратор Azure (если среды Entra ID и Azure DevOps не связаны)

## Регистрация приложения Microsoft Entra ID {#register-a-microsoft-entra-id-app}

Администратор Microsoft Entra ID должен выполнить следующие шаги:

1. Войдите в портал Azure и выберите **Microsoft Entra ID**.
2. В левой панели выберите **App registrations**.
3. Нажмите **New registration**. Откроется форма создания нового приложения Entra ID.
4. Укажите имя приложения. Мы рекомендуем использовать «dbt Labs Azure DevOps app».
5. В качестве Supported Account Types выберите **Accounts in any organizational directory (Any Entra ID directory - Multitenant)**.  
   Многие пользователи задаются вопросом, почему нужно выбирать Multitenant вместо Single Tenant, и часто ошибаются на этом шаге. Microsoft рассматривает Azure DevOps (ранее Visual Studio) и Microsoft Entra ID как разные тенанты, поэтому для корректной работы приложения Entra ID необходимо выбрать Multitenant.
6. Установите **Redirect URI** в значение **Web**. Скопируйте Redirect URI из <Constant name="cloud" /> и вставьте его в соответствующее поле. Чтобы найти Redirect URI в <Constant name="cloud" />:
    1. В <Constant name="cloud" /> перейдите в **Account Settings** -> **Integrations**.
    2. Нажмите на **иконку редактирования** рядом с **Azure DevOps**.
    3. Скопируйте первое значение **Redirect URIs**, которое выглядит как `https://<YOUR_ACCESS_URL>/complete/azure_active_directory` и **не** оканчивается на `service_user`.
7. Нажмите **Register**.

Перед регистрацией приложение должно выглядеть следующим образом:

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Регистрация приложения Microsoft Entra ID"/>

## Создание client secret {#create-a-client-secret}

Администратор Microsoft Entra ID должен выполнить следующие шаги:

1. Перейдите в **Microsoft Entra ID**, выберите **App registrations** и откройте ваше приложение.
2. В левой панели навигации выберите **Certificates and Secrets**.
3. Выберите **Client secrets** и нажмите **New client secret**.
4. Укажите описание секрета и срок действия. Нажмите **Add**.
5. Скопируйте значение поля **Value** и безопасно передайте его администратору аккаунта <Constant name="cloud" />, который завершит настройку.

## Создание service principal для приложения {#create-the-apps-service-principal}

После создания приложения необходимо проверить, существует ли для него service principal. Во многих случаях, если подобная настройка выполнялась ранее, новые приложения получают service principal автоматически при создании.

1. Перейдите в **Microsoft Entra ID**.
2. В разделе **Manage** в левом меню выберите **App registrations**.
3. Откройте приложение для интеграции <Constant name="cloud" /> и Azure DevOps.
4. Найдите поле **Managed application in local directory** и, если доступна соответствующая опция, нажмите **Create Service Principal**. Если поле уже заполнено, значит service principal уже создан.

    <Lightbox src="/img/docs/cloud-integrations/create-service-principal.png" width="80%" title="Пример с выделенной опцией «Create Service Principal»."/>

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

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/add-service-principal.png" width="80%" title="Пример настройки с добавленным service principal в качестве пользователя."/>

## Подключение приложения Microsoft Entra ID к dbt {#connect-your-microsoft-entra-id-app-to-dbt}

Администратор аккаунта <Constant name="cloud" /> должен выполнить следующие действия.

После подключения приложения Microsoft Entra ID и Azure DevOps необходимо предоставить <Constant name="cloud" /> информацию о приложении. Если это первичная настройка, вы создадите новую конфигурацию. Если вы [мигрируете с service user](#migrate-to-service-principal), вы можете отредактировать существующую конфигурацию и изменить её на **Service principal**.

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

Теперь приложение Microsoft Entra ID должно быть добавлено в ваш аккаунт <Constant name="cloud" />. Участники вашей команды, которые хотят работать в <Constant name="cloud_ide" /> или CLI <Constant name="cloud" />, могут персонально [авторизовать Azure DevOps из своих профилей](/docs/cloud/git/authenticate-azure).

## Миграция на service principal {#migrate-to-service-principal}

Выполните миграцию с service user на service principal, используя существующее приложение. Это займёт всего несколько шагов и не приведёт к перерывам в работе сервиса.

- Проверьте, существует ли у приложения service principal
    - Если нет — создайте service principal для приложения
- Обновите конфигурацию приложения
- Обновите конфигурацию в <Constant name="cloud" />

### Проверка service principal {#verify-the-service-principal}

Для выполнения этих шагов потребуется администратор Entra ID.

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

### Создание service principal {#create-the-service-principal}

Если поле не заполнено, service principal не существует. Чтобы настроить service principal, выполните следующие инструкции.

Если у приложения <Constant name="cloud" /> нет service principal, выполните следующие действия в аккаунте Azure:

1. Перейдите в **Microsoft Entra ID**.
2. В разделе **Manage** в левом меню выберите **App registrations**.
3. Откройте приложение для интеграции <Constant name="cloud" /> и Azure DevOps.
4. Найдите поле **Managed application in local directory** и нажмите **Create Service Principal**.

    <Lightbox src="/img/docs/cloud-integrations/create-service-principal.png" width="80%" title="Пример с выделенной опцией «Create Service Principal»."/>

5. Следуйте инструкциям по [добавлению разрешений](#add-permissions-to-your-service-principal) для service principal.
6. Следуйте инструкциям по [подключению DevOps к приложению](#connect-azure-devops-to-your-new-app).
7. В аккаунте <Constant name="cloud" />:
    1. Перейдите в **Account settings** и выберите **Integrations**
    2. Нажмите **иконку редактирования** справа от настроек **Azure DevOps**
    3. Измените **Service user** на **Service principal** и нажмите **Save**. Изменять существующие поля не требуется.
