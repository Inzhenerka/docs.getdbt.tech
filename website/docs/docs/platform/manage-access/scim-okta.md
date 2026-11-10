---
title: "Настройка SCIM с Okta"
description: "Настройте SCIM для Okta, чтобы автоматизировать подготовку учетных записей пользователей и групп и назначение лицензий."
id: "scim-okta"
sidebar_label: "Настройка SCIM с Okta"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

import ScimAssignGroupPermissions from '/snippets/_scim-assign-group-permissions.md';
import ScimAdminGroupPrereq from '/snippets/_scim-admin-group-prereq.md';


:::info SCIM доступен для Okta
[Сопоставление лицензий](/docs/platform/manage-access/scim-manage-user-licenses) через System for Cross-Domain Identity Management (SCIM) в настоящее время поддерживается только для Okta. Для других поставщиков типами лицензий необходимо [управлять](/docs/platform/manage-access/seats-and-users#mapped-configuration) в пользовательском интерфейсе <Constant name="dbt_platform" />.
:::

## Предварительные требования
- Доступно на [тарифных планах Enterprise и Enterprise+](https://www.getdbt.com/pricing).
- Вы должны использовать Okta в качестве поставщика единого входа (SSO) и подключить его к <Constant name="dbt_platform" />.
- У вас должны быть [разрешения](/docs/platform/manage-access/enterprise-permissions) на настройку параметров аккаунта в <Constant name="dbt_platform" />.
- Прежде чем настраивать параметры SCIM, выполните [настройку SSO с Okta](/docs/platform/manage-access/set-up-sso-okta).
- Выполните [настройку SCIM](/docs/platform/manage-access/scim#set-up-dbt), чтобы получить базовый URL SCIM и токен.
- <ScimAdminGroupPrereq />

## Настройка Okta

1. Войдите в свой аккаунт Okta и выберите **Applications** на боковой панели. Откройте приложение, настроенное для SSO. 
2. Нажмите на приложение и перейдите на вкладку **General**.
3. В разделе **App Settings** нажмите **Edit** и установите флажок **SCIM** в строке **Provisioning**, чтобы включить подготовку учетных записей через SCIM. 
4. Нажмите **Save**, после чего появится вкладка **Provisioning**.
    <Lightbox src="/img/docs/dbt-platform/access-control/scim-provisioned.png" width="80%" title="Включение подготовки учетных записей через SCIM в Okta." />
5. Откройте вкладку **Provisioning** и выберите **Integration**.
6. Нажмите **Edit** и введите в первое поле **SCIM base URL**, полученный при [настройке SCIM](/docs/platform/manage-access/scim#set-up-dbt). Для **Unique identifier field for users** рекомендуем указать `userName`.
7. В разделе **Supported provisioning actions** выберите:
    - **Push New Users**
    - **Push Profile Updates**
    - **Push Groups**
    - **Import New Users and Profile Updates** (необязательно; для пользователей, созданных до настройки SSO/SCIM)
    - **Import Groups** (необязательно)
8. В раскрывающемся списке **Authentication mode** выберите **HTTP Header**.
9. В разделе **Authorization** введите токен из <Constant name="dbt" /> в поле **Bearer**.
    <Lightbox src="/img/docs/dbt-platform/access-control/scim-okta-config.png" width="80%" title="Заполненная конфигурация SCIM в приложении Okta." />
10. Нажмите **Save**, чтобы проверить подключение, после чего вы перейдете на вкладку **Provisioning**.
11. Нажмите **Edit** и убедитесь, что выбраны следующие действия по подготовке учетных записей:
    - **Create Users**
    - **Update User Attributes**
    - **Deactivate Users**
    <Lightbox src="/img/docs/dbt-platform/access-control/provisioning-actions.png" width="70%" title="Убедитесь, что эти параметры обеспечивают корректную подготовку учетных записей пользователей." />

12. Нажмите **Save**, чтобы завершить настройку подготовки учетных записей. 
13. Чтобы завершить настройку групп, перейдите в **Push Groups** и отправьте группы Okta в <Constant name="dbt_platform" />. После этого группы станут доступны в <Constant name="dbt_platform" />.

<ScimAssignGroupPermissions />

Теперь SCIM настроен для интеграции SSO с Okta в <Constant name="dbt_platform" />. Вы можете [управлять лицензиями пользователей с помощью SCIM](/docs/platform/manage-access/scim-manage-user-licenses), чтобы задавать тип лицензии для пользователей при подготовке их учетных записей.


## Формат имени пользователя SCIM

При использовании SCIM с Okta в <Constant name="dbt_platform" /> значение `userName` **должно иметь формат адреса электронной почты**. <Constant name="dbt_platform" /> использует `userName` для поиска существующих пользователей во время синхронизации SCIM. Если Okta передает значение в другом формате (например, внутренний идентификатор Okta вида `00u...` или идентификатор сотрудника), <Constant name="dbt_platform" /> не сможет сопоставить его с существующим пользователем, и подготовка учетной записи завершится ошибкой.

Если в вашей конфигурации Okta поле `Username` сопоставлено с другим атрибутом, задайте значение `Email` в настройках приложения Okta:

1. Откройте приложение SAML, созданное для интеграции с dbt.
2. На вкладке **Sign on** нажмите **Edit** на панели **Settings**.
3. Установите для поля **Application username format** значение **Email**.
4. Нажмите **Save**.

:::info Имя пользователя для SSO и SCIM
При совместном использовании SSO и SCIM с Okta формат SAML **Application username** должен быть **Email**. SCIM требует, чтобы `userName` имел формат адреса электронной почты и совпадал со значением атрибута электронной почты, чтобы пользователи корректно сопоставлялись при входе через SSO и подготовке учетных записей.
:::

## Сопоставление лицензий SCIM

Чтобы автоматизировать назначение лицензионных мест в Okta при подготовке учетных записей пользователей, см. раздел [Управление лицензиями пользователей с помощью SCIM](/docs/platform/manage-access/scim-manage-user-licenses).

## Существующие интеграции с Okta

Если вы добавляете SCIM к существующей интеграции с Okta в <Constant name="dbt_platform" /> (а не настраиваете SCIM и SSO одновременно впервые), учитывайте особенности поведения, описанные ниже. Подробнее о том, что происходит с уже существующими пользователями, см. в разделе [Часто задаваемые вопросы о SCIM](/docs/platform/manage-access/scim-faq):

- Пользователи и группы, уже синхронизированные с <Constant name="dbt" />, перейдут под управление SCIM после завершения настройки SCIM.
- (Рекомендуется) Импортируйте существующие группы и пользователей <Constant name="dbt" /> и управляйте ими с помощью функций Okta **Import Groups** и **Import Users**. Обновите группы в своем IdP, используя те же правила именования, что и для групп <Constant name="dbt" />. Новые пользователи, группы и изменения существующих профилей будут автоматически импортироваться в <Constant name="dbt" />.
    - Убедитесь, что на вкладке **Provisioning settings** в конфигурации SCIM в Okta установлены флажки **Import users and profile updates** и **Import Groups**.
    - Используйте **Import Users**, чтобы синхронизировать всех пользователей из <Constant name="dbt" />, включая ранее удаленных, если вам нужно повторно подготовить их учетные записи. 
    - Подробнее об этой функции см. в [документации Okta](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-import-groups-app-provisioning.htm).

Чтобы задавать тип лицензии для пользователей при подготовке их учетных записей, см. раздел [Управление лицензиями пользователей с помощью SCIM](/docs/platform/manage-access/scim-manage-user-licenses).

## Часто задаваемые вопросы и устранение неполадок

Ответы на распространенные вопросы о подготовке учетных записей через SCIM с Okta, включая процессы подключения пользователей, особенности сопоставления групп SSO и устранение неполадок, см. в разделе [Часто задаваемые вопросы о SCIM и устранение неполадок](/docs/platform/manage-access/scim-faq).
