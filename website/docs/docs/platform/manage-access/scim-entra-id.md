---
title: "Настройка SCIM с Entra ID"
description: "Настройте SCIM для Microsoft Entra ID, чтобы автоматизировать подготовку пользователей и групп."
id: "scim-entra-id"
sidebar_label: "Настройка SCIM с Entra ID"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

import ScimLicenseMappingCallout from '/snippets/_scim-license-mapping-callout.md';
import ScimAssignGroupPermissions from '/snippets/_scim-assign-group-permissions.md';
import ScimAdminGroupPrereq from '/snippets/_scim-admin-group-prereq.md';


# Настройка SCIM с Entra ID

<Constant name="dbt_platform" /> поддерживает System for Cross-Domain Identity Management (SCIM) с Microsoft Entra ID для подготовки пользователей и групп и обновления профилей.

<ScimLicenseMappingCallout />

## Предварительные требования
- Доступно на [тарифных планах Enterprise или Enterprise+](https://www.getdbt.com/pricing).
- Необходимо использовать Entra ID в качестве поставщика единого входа (SSO) и подключить его в <Constant name="dbt_platform" />.
- У вас должны быть [разрешения](/docs/platform/manage-access/enterprise-permissions) на изменение настроек аккаунта в <Constant name="dbt_platform" />.
- Прежде чем настраивать SCIM, выполните [настройку SSO с Entra ID](/docs/platform/manage-access/set-up-sso-microsoft-entra-id).
- Выполните [настройку SCIM](/docs/platform/manage-access/scim#set-up-dbt), чтобы получить базовый URL и токен SCIM.
- <ScimAdminGroupPrereq />

## Настройка Entra ID

1. Войдите в свой аккаунт Azure и откройте настройки **Entra ID**.
2. На боковой панели в разделе **Manage** нажмите **Enterprise Applications**.
3. Нажмите **New Application** и выберите **Create your own application**.
    <Lightbox src="/img/docs/dbt-platform/access-control/create-your-own.png" width="60%" title="Создание собственного приложения." />
4. Задайте уникальное имя приложения и убедитесь, что выбран вариант **Integrate any other application you don't find in the gallery (Non-gallery)**. Игнорируйте любые предложения использовать существующие приложения. Нажмите **Create**.
    <Lightbox src="/img/docs/dbt-platform/access-control/create-application.png" width="60%" title="Задайте уникальное имя приложения." />
5. На странице **Overview** приложения нажмите **Provision User Accounts**.
    <Lightbox src="/img/docs/dbt-platform/access-control/provision-user-accounts.png" width="60%" title="Пункт «Provision user accounts»." />
6. В разделе **Create configuration** нажмите **Connect your application**.
7. Заполните форму данными из вашего аккаунта dbt:
    - **Tenant URL** в Entra ID — это ваш **SCIM base URL** из dbt.
    - **Secret token** в Entra ID — это ваш **SCIM token** из dbt.
8. Нажмите **Test connection**, а после завершения проверки — **Create**.
    <Lightbox src="/img/docs/dbt-platform/access-control/provisioning-config.png" width="60%" title="Настройте приложение и проверьте подключение." />

## Сопоставление атрибутов

Чтобы сопоставить атрибуты, которые будут синхронизироваться с dbt:

1. В меню на боковой панели страницы **Overview** корпоративного приложения нажмите **Provisioning**. 
    <Lightbox src="/img/docs/dbt-platform/access-control/provisioning.png" width="60%" title="Пункт Provisioning на боковой панели." />
2. В разделе **Manage** снова нажмите **Provisioning**.
3. Разверните раздел **Mappings** и нажмите **Provision Microsoft Entra ID users**.
     <Lightbox src="/img/docs/dbt-platform/access-control/provision-entra-users.png" width="60%" title="Подготовка пользователей Entra ID." />
4. Установите флажок **Show advanced options**, а затем нажмите **Edit attribute list for customappsso**.
    <Lightbox src="/img/docs/dbt-platform/access-control/customappsso-attributes.png" width="60%" title="Нажмите, чтобы изменить атрибуты customappsso." />
5. Прокрутите окно **Edit Attribute List** до конца и найдите пустую строку, в которой можно добавить новую запись со следующими полями: 
    - **Name:** `emails[type eq "work"].primary`
    - **Type:** `Boolean`
    - **Required:** True
    <Lightbox src="/img/docs/dbt-platform/access-control/customappsso-entry.png" width="60%" title="Добавьте новое поле в список записей." />
6. Отметьте все поля, перечисленные в шаге 10 ниже, как `Required`.
    <Lightbox src="/img/docs/dbt-platform/access-control/mark-as-required.png" width="60%" title="Отметьте поля как обязательные." />    
7. Нажмите **Save**.
8. Вернитесь в окно **Attribute mapping**, нажмите **Add new mapping** и заполните поля следующим образом:
    - **Mapping type:** `none`
    - **Default value if null (optional):** `True`
    - **Target attribute:** `emails[type eq "work"].primary`
    - **Match objects using this attribute:** `No`
    - **Matching precedence:** *Оставьте пустым*
    - **Apply this mapping:** `Always`
    <Lightbox src="/img/docs/dbt-platform/access-control/edit-attribute.png" width="60%" title="Заполните поля, как показано на изображении." />
9. Нажмите **Ok**.
10. Убедитесь, что настроены следующие сопоставления, и удалите все остальные:
    - **UserName:** `userPrincipalName` или значение, которое пользователи должны использовать для входа в dbt. 
    - **active:** `Switch([IsSoftDeleted], , "False", "True", "True", "False")`
    - **emails[type eq "work"].value:** чаще всего используется `userPrincipalName`, но это значение должно совпадать со значением, заданным для **UserName**. 
    - **name.givenName:** `givenName`
    - **name.familyName:** `surname`
    - **externalid:** `mailNickname`
    - **emails[type eq "work"].primary** 
     <Lightbox src="/img/docs/dbt-platform/access-control/attribute-list.png" width="60%" title="Измените атрибуты так, чтобы они соответствовали показанному списку." />

    :::info Имя пользователя для SSO и SCIM
    Если вы используете и SSO, и SCIM с Entra ID, сопоставьте **UserName** в SCIM с **userPrincipalName** (или с тем же атрибутом Entra, который пользователи используют для входа в <Constant name="dbt_platform" />). Для **emails[type eq "work"].value** укажите тот же источник.  
    
    Для SCIM необходимо, чтобы значения совпадали: это обеспечивает согласованность подготовки пользователей с SSO. Если **UserName** и **emails[type eq "work"].value** не совпадают, пользователи могут синхронизироваться или сопоставляться некорректно.
    :::

11. Нажмите **Save**.

Теперь можно назначать пользователей вашему приложению SCIM в Entra ID!

## Назначение пользователей приложению SCIM

Ниже описано, как назначить пользователей и группы приложению SCIM. Дополнительные сведения см. в [официальной инструкции Microsoft по назначению пользователей или групп корпоративному приложению в Entra ID](https://learn.microsoft.com/en-us/azure/databricks/admin/users-groups/scim/aad#step-3-assign-users-and-groups-to-the-application). Хотя статья написана для Databricks, шаги полностью совпадают.

1. Перейдите в Enterprise applications и выберите приложение SCIM.
2. Перейдите в **Manage** > **Provisioning**.
3. Чтобы синхронизировать пользователей и группы Microsoft Entra ID с dbt, нажмите **Start provisioning**.
    <Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/access-control/scim-entraid-start-provision.png" width="80%" title="Запустите подготовку для синхронизации пользователей и групп." />
4. Вернитесь на страницу обзора приложения SCIM и перейдите в **Manage** > **Users and groups**.
5. Нажмите **Add user/group** и выберите пользователей и группы. 
       <Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/access-control/scim-entraid-add-users.png" width="80%" title="Добавление пользователя или группы." />
6. Нажмите кнопку **Assign**.
7. Подождите несколько минут. В <Constant name="dbt_platform" /> убедитесь, что пользователи и группы появились в вашем аккаунте dbt.
    - Пользователи и группы, которых вы добавляете и назначаете, будут автоматически созданы в вашем аккаунте dbt во время следующей запланированной синхронизации Microsoft Entra ID.
    - При включении подготовки сразу запускается первоначальная синхронизация Microsoft Entra ID. Последующие синхронизации запускаются каждые 20–40 минут в зависимости от количества пользователей и групп в приложении. Дополнительные сведения см. в документации Microsoft Entra ID [Советы по подготовке](https://learn.microsoft.com/en-us/azure/databricks/admin/users-groups/scim/aad#provisioning-tips).
    - Вы также можете запустить подготовку вручную вне расписания, нажав **Restart provisioning**.
    <Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/access-control/scim-entraid-manual.png" width="80%" title="Запуск подготовки вручную." />

<ScimAssignGroupPermissions />

## Часто задаваемые вопросы и устранение неполадок

Ответы на распространённые вопросы о подготовке через SCIM с Entra ID, включая процессы подключения пользователей, сопоставление атрибутов, проблемы со списками разрешённых IP-адресов и устранение неполадок, см. в разделе [Часто задаваемые вопросы о SCIM и устранение неполадок](/docs/platform/manage-access/scim-faq).
