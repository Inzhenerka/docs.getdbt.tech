---
title: "Настройка SCIM"
description: "Настройка SCIM для SSO"
id: "scim"
sidebar: "Set up SCIM"
---

# Настройка SCIM <Lifecycle status="managed, managed_plus" />

System for Cross-Domain Identity Management (SCIM) делает данные пользователей более защищёнными и упрощает жизненный цикл администрирования и работы конечных пользователей за счёт автоматизации управления пользовательскими учётными записями и группами. Вы можете создавать или отключать пользователей в своём Identity Provider (IdP), а SCIM будет автоматически применять эти изменения практически в реальном времени downstream в <Constant name="cloud" />.

## Предварительные требования 

Чтобы настроить SCIM в вашей среде <Constant name="cloud" />:

- У вас должен быть план [Enterprise или Enterprise+](https://www.getdbt.com/pricing).
- В качестве провайдера SSO вы должны использовать Okta или Entra ID, и он должен быть подключён в платформе dbt.
- У вас должны быть права на настройку параметров аккаунта в [<Constant name="cloud" />](/docs/cloud/manage-access/enterprise-permissions) и на изменение настроек приложений в [Okta](https://help.okta.com/en-us/content/topics/security/administrators-admin-comparison.htm).
- Если у вас включены IP-ограничения, необходимо добавить [IP-адреса Okta](https://help.okta.com/en-us/content/topics/security/ip-address-allow-listing.htm) в allowlist.

### Поддерживаемые возможности

В настоящее время SCIM поддерживает следующие возможности:

- Провижининг и депровижининг пользователей
- Обновление профилей пользователей
- Создание и управление группами
- Импорт групп и пользователей

После включения SCIM поведение следующих функций изменится: 
- Пользователи не будут автоматически добавляться в группы по умолчанию
- Ручные действия, такие как приглашение пользователей, обновление информации о пользователях и изменение состава групп, по умолчанию отключены
- Маппинги групп SSO отключаются в пользу управления группами через SCIM

Чтобы переопределить эти изменения при включённом SCIM, можно разрешить ручные обновления в настройках SCIM (не рекомендуется).

При провижининге пользователей поддерживаются следующие атрибуты:
- Username
- Family name
- Given name

В UI <Constant name="cloud" /> поддерживаются следующие IdP:
- [Okta](#scim-configuration-for-okta)
- [Entra ID](#scim-configuration-for-entra-id)

Если вашего IdP нет в списке, его можно поддержать с помощью [API <Constant name="cloud" />](/dbt-cloud/api-v3#/operations/Retrieve%20SCIM%20configuration).

## Настройка dbt

Чтобы получить необходимые конфигурации <Constant name="cloud" /> для использования в Okta или Entra ID:

1. Перейдите в **Account settings** в <Constant name="cloud" />.
2. В левом меню выберите **Single sign-on**.
3. Прокрутите настройки SSO вниз и нажмите **Enable SCIM**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/enable-scim.png" width="60%" title="SCIM включён в настройках конфигурации." />
4. Сохраните значение поля **SCIM base URL** — оно понадобится на следующих шагах.
5. Нажмите **Create SCIM token**.
    :::note
    
    В соответствии с лучшими практиками рекомендуется регулярно ротировать SCIM-токены. Для этого выполните те же шаги, что и при создании нового токена. Чтобы избежать сбоев в работе, обязательно замените токен в вашем IdP до удаления старого токена в <Constant name="cloud" />.

    :::
6. Во всплывающем окне задайте имя токена, по которому его будет легко идентифицировать, и нажмите **Save**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/name-scim-token.png" width="60%" title="Задайте имя токена и идентификатор." />
7. Скопируйте токен и сохраните его в безопасном месте, так как _после закрытия окна он больше не будет доступен_. В случае утери потребуется создать новый токен.
    <Lightbox src="/img/docs/dbt-cloud/access-control/copy-scim-token.png" width="60%" title="Скопируйте токен и сохраните его." />
8. (Опционально) Ручные обновления по умолчанию отключены для всех сущностей, управляемых SCIM, включая возможность вручную приглашать новых пользователей. Это гарантирует синхронизацию SCIM-управляемых сущностей с IdP, и мы рекомендуем оставлять этот параметр отключённым.
   - Однако, если вам необходимо выполнять ручные изменения (например, менять состав группы, управляемой SCIM), вы можете включить этот параметр, нажав **Allow manual updates**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-manual-updates.png" width="70%" title="Включение ручных обновлений в настройках SCIM." />

## Конфигурация SCIM для Okta

Перед настройкой SCIM выполните шаги из руководства [настройки SSO с Okta](/docs/cloud/manage-access/set-up-sso-okta).

### Настройка Okta

1. Войдите в свой аккаунт Okta и найдите приложение, настроенное для SSO-интеграции с <Constant name="cloud" />.
2. Перейдите на вкладку **General** и убедитесь, что опция **Enable SCIM provisioning** включена, иначе вкладка **Provisioning** не будет отображаться.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-provisioned.png" width="60%" title="Включение SCIM provisioning в Okta." />
3. Откройте вкладку **Provisioning** и выберите **Integration**.
4. Вставьте [**SCIM base URL** из <Constant name="cloud" />](#set-up-dbt-cloud) в первое поле, затем укажите предпочитаемое значение **Unique identifier field for users** — мы рекомендуем `userName`.
5. Отметьте следующие **Supported provisioning actions**:
    - Push New Users
    - Push Profile Updates
    - Push Groups
    - Import New Users and Profile Updates (опционально для пользователей, созданных до настройки SSO/SCIM)
6. В выпадающем списке **Authentication mode** выберите **HTTP Header**.
7. В разделе **Authorization** вставьте токен из <Constant name="cloud" /> в поле **Bearer**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-okta-config.png" width="60%" title="Заполненная конфигурация SCIM в приложении Okta." />
8. Убедитесь, что выбраны следующие действия провижининга:
    - Create users
    - Update user attributes
    - Deactivate users
    <Lightbox src="/img/docs/dbt-cloud/access-control/provisioning-actions.png" width="60%" title="Убедитесь, что пользователи корректно провижинятся с этими настройками." />
9. Протестируйте соединение и после завершения нажмите **Save**.

Теперь SCIM для SSO-интеграции с Okta в <Constant name="cloud" /> настроен.

### Формат имени пользователя для SCIM

SCIM требует, чтобы имя пользователя было в формате email-адреса. Если в настройках Okta поле `Username` сопоставлено с другим атрибутом, провижининг пользователей через SCIM завершится ошибкой. Чтобы избежать этого без изменения профилей пользователей, установите в конфигурации приложения Okta значение `Email`:

1. Откройте SAML-приложение, созданное для интеграции с dbt.
2. На вкладке **Sign on** нажмите **Edit** в секции **Settings**.
3. Установите поле **Application username format** в значение **Email**.
4. Нажмите **Save**.

### Существующие интеграции Okta

Если вы добавляете SCIM к уже существующей интеграции Okta в <Constant name="cloud" /> (а не настраиваете SCIM и SSO одновременно с нуля), обратите внимание на следующие моменты:

- Пользователи и группы, уже синхронизированные с <Constant name="cloud" />, станут управляемыми SCIM после завершения настройки.
- (Рекомендуется) Импортируйте и управляйте существующими группами и пользователями <Constant name="cloud" /> с помощью функций **Import Groups** и **Import Users** в Okta. Обновите группы в вашем IdP, используя ту же схему наименований, что и для групп <Constant name="cloud" />. Новые пользователи, группы и изменения существующих профилей будут автоматически импортироваться в <Constant name="cloud" />.
    - Убедитесь, что флажки **Import users and profile updates** и **Import groups** включены на вкладке **Provisioning settings** в конфигурации SCIM для Okta.
    - Используйте **Import Users**, чтобы синхронизировать всех пользователей из <Constant name="cloud" />, включая ранее удалённых, если вам нужно повторно их провижинить.
    - Подробнее об этой функции читайте в [документации Okta](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-import-groups-app-provisioning.htm).

## Конфигурация SCIM для Entra ID 

Перед настройкой SCIM выполните шаги из руководства [настройки SSO с Entra ID](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id).

### Настройка Entra ID

1. Войдите в свой аккаунт Azure и откройте настройки **Entra ID**.
2. В боковом меню в разделе **Manage** выберите **Enterprise Applications**.
3. Нажмите **New Application** и выберите вариант **Create your own application**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/create-your-own.png" width="60%" title="Создание собственного приложения." />
4. Задайте уникальное имя приложения и убедитесь, что выбран пункт **Integrate any other application you don't find in the gallery (Non-gallery)**. Игнорируйте любые подсказки о существующих приложениях и нажмите **Create**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/create-application.png" width="60%" title="Задайте уникальное имя приложения." />
5. На экране **Overview** приложения нажмите **Provision User Accounts**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/provision-user-accounts.png" width="60%" title="Опция Provision user accounts." />
6. В разделе **Create configuration** нажмите **Connect your application**.
7. Заполните форму данными из вашего dbt-аккаунта:
    - **Tenant URL** в Entra ID — это ваш **SCIM base URL** из dbt
    - **Secret token** в Entra ID — это ваш **SCIM token** из dbt
8. Нажмите **Test connection**, а после успешного теста — **Create**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/provisioning-config.png" width="60%" title="Настройка приложения и тестирование соединения." />

### Маппинг атрибутов

Чтобы настроить атрибуты, которые будут синхронизироваться с dbt:

1. В боковом меню экрана **Overview** enterprise-приложения нажмите **Provisioning**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/provisioning.png" width="60%" title="Пункт Provisioning в боковом меню." />
2. В разделе **Manage** снова нажмите **Provisioning**.
3. Разверните раздел **Mappings** и нажмите **Provision Microsoft Entra ID users**.
     <Lightbox src="/img/docs/dbt-cloud/access-control/provision-entra-users.png" width="60%" title="Провижининг пользователей Entra ID." />
4. Установите флажок **Show advanced options**, затем нажмите **Edit attribute list for customappsso**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/customappsso-attributes.png" width="60%" title="Редактирование атрибутов customappsso." />
5. Прокрутите окно **Edit attribute list** вниз и найдите пустое поле, чтобы добавить новую запись со следующими параметрами:
    - **Name:** `emails[type eq "work"].primary`
    - **Type:** `Boolean`
    - **Required:** True
    <Lightbox src="/img/docs/dbt-cloud/access-control/customappsso-entry.png" width="60%" title="Добавление нового поля в список." />
6. Отметьте все поля, перечисленные в шаге 10 ниже, как `Required`.
    <Lightbox src="/img/docs/dbt-cloud/access-control/mark-as-required.png" width="60%" title="Отметьте поля как обязательные." />    
7. Нажмите **Save**.
8. Вернувшись в окно **Attribute mapping**, нажмите **Add new mapping** и заполните поля следующим образом:
    - **Mapping type:** `none`
    - **Default value if null (optional):** `True`
    - **Target attribute:** `emails[type eq "work"].primary`
    - **Match objects using this attribute:** `No`
    - **Matching precedence:** *Оставьте пустым*
    - **Apply this mapping:** `Always`
9. Нажмите **Ok**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/edit-attribute.png" width="60%" title="Отредактируйте атрибут, как показано." />
10. Убедитесь, что настроены следующие маппинги, и удалите все остальные:
    - **UserName:** `userPrincipalName`
    - **active:** `Switch([IsSoftDeleted], , "False", "True", "True", "False")`
    - **emails[type eq "work"].value:** `userPrincipalName`
    - **name.givenName:** `givenName`
    - **name.familyName:** `surname`
    - **externalid:** `mailNickname`
    - **emails[type eq "work"].primary** 
     <Lightbox src="/img/docs/dbt-cloud/access-control/attribute-list.png" width="60%" title="Приведите атрибуты в соответствие со списком." />
11. Нажмите **Save**.

Теперь вы можете начинать назначать пользователей для SCIM-приложения в Entra ID!

## Назначение пользователей SCIM-приложению

Ниже описаны шаги по назначению пользователей и групп SCIM-приложению. Для получения дополнительной информации см. [официальную документацию Microsoft по назначению пользователей или групп Enterprise-приложению в Entra ID](https://learn.microsoft.com/en-us/azure/databricks/admin/users-groups/scim/aad#step-3-assign-users-and-groups-to-the-application). Хотя статья написана для Databricks, шаги полностью идентичны.

1. Перейдите в Enterprise applications и выберите SCIM-приложение.
2. Откройте **Manage** > **Provisioning**.
3. Чтобы синхронизировать пользователей и группы Microsoft Entra ID с dbt, нажмите кнопку **Start provisioning**.
    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/scim-entraid-start-provision.png" width="80%" title="Запуск провижининга для синхронизации пользователей и групп." />
4. Вернитесь на страницу обзора SCIM-приложения и перейдите в **Manage** > **Users and groups**.
5. Нажмите **Add user/group** и выберите пользователей и группы.
       <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/scim-entraid-add-users.png" width="80%" title="Добавление пользователя или группы." />
7. Нажмите кнопку **Assign**.
8. Подождите несколько минут. В <Constant name="dbt_platform" /> убедитесь, что пользователи и группы появились в вашем dbt-аккаунте.
    - Пользователи и группы, которые вы добавляете и назначаете, будут автоматически провижиниться в ваш dbt-аккаунт при следующей синхронизации Microsoft Entra ID.
    - При включении провижининга сразу запускается первоначальная синхронизация Microsoft Entra ID. Последующие синхронизации выполняются каждые 20–40 минут в зависимости от количества пользователей и групп в приложении. Подробнее см. документацию Microsoft Entra ID [Provisioning tips](https://learn.microsoft.com/en-us/azure/databricks/admin/users-groups/scim/aad#provisioning-tips).
    - Вы также можете запустить ручной провижининг вне расписания, нажав **Restart provisioning**.
    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/scim-entraid-manual.png" width="80%" title="Ручной запуск провижининга." />

## Управление лицензиями пользователей с помощью SCIM

Вы можете управлять назначением лицензий пользователей через SCIM, используя пользовательский атрибут в вашей среде IdP. Это обеспечивает корректное распределение лицензий по мере провижининга пользователей в IdP и их онбординга в ваш dbt-аккаунт.
:::note Назначение лицензии Analyst

    Лицензия `Analyst` доступна только для некоторых планов. Назначение лицензии `Analyst` через SCIM приведёт к ошибке обновления пользователя, если данный тип лицензии недоступен для вашего dbt-аккаунта.

:::

Чтобы использовать управление лицензиями через SCIM, включите эту функцию в разделе **SCIM** настроек **Single sign-on**. Этот параметр будет принудительно устанавливать тип лицензии пользователя на основе его SCIM-атрибута и отключит маппинг лицензий и ручную настройку лицензий в dbt.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-managed-licenses.png" width="60%" title="Включение управления распределением лицензий через SCIM." />

_Мы рекомендуем завершить настройку вашего провайдера идентификации до включения этого переключателя в dbt-аккаунте. После его включения все существующие маппинги лицензий в <Constant name="dbt_platform" /> будут игнорироваться. В настоящее время маппинг лицензий через SCIM поддерживается только для Okta._

Рекомендуемые шаги для миграции на маппинг лицензий через SCIM:

1. Настройте SCIM, но оставьте переключатель выключенным, чтобы существующие маппинги лицензий продолжали работать.
2. Настройте атрибуты лицензий в вашем Identity Provider (IdP).
3. Протестируйте, что SCIM-атрибуты используются для установки типа лицензии в <Constant name="dbt_platform" />.
4. Включите переключатель, чтобы игнорировать существующие маппинги лицензий и сделать SCIM источником истины для назначения лицензий пользователям.

### Добавление атрибута типа лицензии для Okta

Чтобы добавить атрибут для типов лицензий в среде Okta:

1. В приложении Okta перейдите на вкладку **Provisioning**, прокрутите до **Attribute Mappings** и нажмите **Go to Profile Editor**.
2. Нажмите **Add Attribute**.
3. Настройте поля атрибута следующим образом (регистр значений должен совпадать):
    - **Date type:** `string`
    - **Display name:** `License Type`
    - **Variable name:** `licenseType`
    - **External name:** `licenseType`
    - **External namespace:** `urn:ietf:params:scim:schemas:extension:dbtLabs:2.0:User`
    - **Description:** Произвольная строка на ваше усмотрение.
    - **Enum:** Установите флажок **Define enumerated list of values**
    - **Attribute members:** Добавьте начальный атрибут и нажимайте **Add another**, пока не будут добавлены все типы лицензий. Мы рекомендуем добавить все значения, даже если вы не используете их сейчас, чтобы они были доступны в будущем.
        | Display name | Value |
        |--------------|-------|
        | **IT**       | `it`  |
        | **Analyst**  | `analyst` |
        | **Developer**| `developer` |
        | **Read Only**| `read_only` |
    - **Attribute type:** Personal

    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-license-attributes.png" width="60%" title="Заполните поля, как показано на изображении. Убедитесь, что регистр совпадает." /> 

4. Нажмите **Save**, чтобы сохранить маппинг атрибута.
5. Теперь пользователям можно назначать типы лицензий в их профилях, и они будут применяться при провижининге.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-license-provisioning.png" width="60%" title="Задание типа лицензии для пользователя в профиле Okta." />
