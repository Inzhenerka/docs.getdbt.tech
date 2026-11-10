---
title: "Настройка Private Link для Microsoft Fabric"
id: azure-fabric
description: "Настройка Azure Private Link для Microsoft Fabric."
sidebar_label: "Microsoft Fabric"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

# Настройка Private Link для Microsoft Fabric <Lifecycle status="beta"/>

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Следующие шаги помогут настроить конечную точку Private Link для Microsoft Fabric в мультитенантной среде <Constant name="dbt" />.

<CloudProviders type='Microsoft Fabric' />

:::note Private Link на уровне рабочей области
Microsoft Fabric предлагает две модели частного подключения. Только **Private Link на уровне рабочей области** поддерживает подключения между тенантами и совместим с <Constant name="dbt" />. Private Link на уровне тенанта предназначен для доступа внутри организации и не поддерживает подключения из внешних сервисов, таких как <Constant name="dbt" />.
:::

## Предварительные требования

Перед настройкой Private Link убедитесь, что выполнены следующие условия:

- У вас есть права Fabric Administrator
- У вас есть подписка Azure с разрешениями на регистрацию поставщиков ресурсов и развертывание шаблонов
- У вас уже создана рабочая область Fabric
- У вас настроен субъект-служба (service principal) с необходимыми разрешениями Fabric (роль Member или Contributor в рабочей области, а также включенный доступ к Fabric API на портале администрирования)

## Настройка Fabric Private Link
Выполните следующие шаги в средах Microsoft Fabric и Azure, прежде чем отправлять запрос в dbt.

### 1. Включите параметр тенанта для Private Link на уровне рабочей области

Прежде чем настраивать Private Link для отдельных рабочих областей, администратор Fabric должен включить Private Link на уровне рабочей области для вашего тенанта.

1. Откройте [портал администрирования Microsoft Fabric](https://app.fabric.microsoft.com/admin-portal).
2. Перейдите в раздел **Tenant settings**.
3. Найдите **Configure workspace-level inbound network rules** и разверните этот параметр.
4. Переведите переключатель в положение **Enabled**.
5. Нажмите **Apply**.

### 2. Настройте сетевые параметры рабочей области

1. Откройте рабочую область Fabric на [портале Microsoft Fabric](https://app.fabric.microsoft.com).
2. Перейдите в **Workspace settings** → **Inbound networking**.
3. Выберите **Allow connections from selected networks and workspace level private links**.
4. Нажмите **Save**.

:::caution Ограничение входящего доступа может заблокировать ваш собственный доступ
При выборе этого параметра разрешены только подключения с одобренных IP-адресов и через Private Link на уровне рабочей области. Если вам или вашей команде необходимо сохранить доступ к этой рабочей области через портал Fabric, добавьте общедоступные IP-адреса вашей организации перед сохранением. Если вы не уверены, какие диапазоны IP-адресов следует добавить, обратитесь к сетевому администратору.

Если вы потеряете доступ, администратор Fabric сможет восстановить его, перейдя на [портал администрирования](https://app.fabric.microsoft.com/admin-portal) → **Tenant settings** → **Advanced networking** → **Configure workspace-level inbound network rules** и переведя переключатель в положение **Disabled**. Это вернет все рабочие области к предыдущей сетевой конфигурации.
:::

### 3. Зарегистрируйте поставщика ресурсов Microsoft.Fabric

Прежде чем создавать ресурсы Fabric Private Link, необходимо зарегистрировать поставщика ресурсов `Microsoft.Fabric` в вашей подписке Azure.

1. На [портале Azure](https://portal.azure.com) перейдите в свою **Subscription** → **Settings** → **Resource providers**.
2. Найдите `Microsoft.Fabric`.
3. Выберите его и нажмите **Register** (или **Re-register**, если он уже зарегистрирован). Дождитесь, пока статус изменится на **Registered**.

### 4. Создайте ресурс Private Link Service

Private Link на уровне рабочей области Fabric использует отдельный ресурс Azure (`Microsoft.Fabric/privateLinkServicesForFabric`), чтобы сделать вашу рабочую область доступной в качестве целевого ресурса для частной конечной точки. Этот ресурс недоступен в каталоге Marketplace на портале Azure, поэтому его необходимо развернуть с помощью пользовательского шаблона.

1. Найдите два идентификатора, которые вам понадобятся:
   - **Workspace ID**: находится в URL рабочей области — `https://app.fabric.microsoft.com/groups/WORKSPACE_ID`. Замените `WORKSPACE_ID` своим значением.
   - **Tenant ID**: находится на [портале Azure](https://portal.azure.com) в разделе **Microsoft Entra ID** → **Overview** → **Tenant ID**. Это тот же идентификатор Directory (tenant) ID, который используется для аутентификации субъекта-службы.
2. На [портале Azure](https://portal.azure.com) найдите **Deploy a custom template** и выберите этот пункт.
3. Нажмите **Build your own template in the editor**.
4. Вставьте следующий шаблон в редактор. Замените `WORKSPACE_NAME`, `WORKSPACE_ID` и `TENANT_ID` своими значениями, затем нажмите **Save**:

   ```json
   {
     "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
     "contentVersion": "1.0.0.0",
     "resources": [
       {
         "type": "Microsoft.Fabric/privateLinkServicesForFabric",
         "apiVersion": "2024-06-01",
         "name": "WORKSPACE_NAME-pls",
         "location": "global",
         "properties": {
           "tenantId": "TENANT_ID",
           "workspaceId": "WORKSPACE_ID"
         }
       }
     ]
   }
   ```

5. Выберите **Subscription** и **Resource group**, затем нажмите **Review + create** → **Create**.
6. После завершения развертывания перейдите в свою **resource group** и выберите **Manage view** → **Show hidden types**, чтобы отобразить ресурс Private Link Service. Нажмите на ресурс, чтобы открыть его, и скопируйте **Resource ID** со страницы обзора. Идентификатор ресурса понадобится при отправке запроса на Private Link.

   Формат пути идентификатора ресурса:
   `/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.Fabric/privateLinkServicesForFabric/NAME`

## Отправка запроса на Private Link в dbt

Добавьте необходимые сведения в следующий шаблон и отправьте запрос на Azure Private Link в [службу поддержки dbt](mailto:support@getdbt.com):

<Expandable alt_header="Шаблон письма с запросом в службу поддержки" is_open={true}>

```text
Subject: New Azure Multi-Tenant Private Link Request

- Type: Microsoft Fabric
- dbt platform account URL:
- Fabric workspace name:
- Fabric Private Link Service resource ID:
  /subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.Fabric/privateLinkServicesForFabric/NAME
- dbt Azure multi-tenant environment (EMEA):
- Azure region of your Fabric workspace (for example, centralus, westeurope):
```

Обязательно замените `SUBSCRIPTION_ID`, `RESOURCE_GROUP` и `NAME` своими значениями.

</Expandable>

## Одобрение подключения Private Link

После того как служба поддержки dbt подтвердит, что частная конечная точка создана на нашей стороне:

1. На [портале Azure](https://portal.azure.com) найдите **Private Link** в верхней строке поиска и выберите **Private Link Center**.
2. На левой боковой панели выберите **Pending connections**.
3. Убедитесь, что в фильтре **Subscription** выбрана нужная подписка (та, в которой находится ваш ресурс Private Link Service).
4. Выберите подключение от <Constant name="dbt" /> (его имя будет содержать `dbt`).
5. Нажмите **Approve** и подтвердите действие.
6. Сообщите службе поддержки dbt, что подключение одобрено, чтобы она могла проверить его и сделать доступным в <Constant name="dbt" />.

:::tip Используйте Private Link Center, а не ресурс PLS
Для одобрения подключения перейдите в службу **Private Link Center**. На панели ресурса Fabric Private Link Service не отображаются подключения, ожидающие одобрения. Чтобы увидеть и одобрить подключение от <Constant name="dbt" />, необходимо перейти в **Private Link Center** → **Pending connections**.
:::

## Создание подключения в dbt

После того как служба поддержки dbt подтвердит доступность конечной точки, настройте подключение в <Constant name="dbt" />:

1. Перейдите в **Settings** → **Create new connection** → выберите **Microsoft Fabric**.
2. Вы увидите два переключателя: **Default Endpoint** и **PrivateLink Endpoint**. Выберите **PrivateLink Endpoint**.
3. Выберите частную конечную точку из раскрывающегося списка. В поле **Server** автоматически подставится частное имя хоста SQL, предоставленное службой поддержки dbt.
4. Настройте остальные параметры подключения:

    <SimpleTable> 
       
    | Поле | Значение |
    |-------|-------|
    | **Port** | Автоматически заполняется значением `1433` |
    | **Database** | Имя вашего хранилища Fabric |
    
    </ SimpleTable>
  
5. Сохраните подключение и перейдите к следующему шагу.

### Настройка аутентификации

На странице **Connection** доступны только поля **Server**, **Port** и **Database**. Настройте следующие параметры позже, когда будете [настраивать учетные данные для разработки](/docs/dbt-platform-environments#set-user-credentials) или [создавать среду развертывания](/docs/deploy/deploy-environments):
    <SimpleTable> 
    | Поле | Значение |
    |-------|-------|
    | **Authentication** | Ваш субъект-служба (Service Principal) |
    | **Tenant ID** | Ваш идентификатор Microsoft Entra Directory (tenant) ID |
    | **Client ID** | Идентификатор приложения (клиента) вашего субъекта-службы |
    | **Client secret** | Секрет клиента вашего субъекта-службы |
    </ SimpleTable>
Добавьте субъект-службу, используемый для аутентификации, в рабочую область Fabric с ролью **Member** или **Contributor**. На портале администрирования Fabric также необходимо включить **Service principals can use Fabric APIs** в разделе **Tenant settings** → **Developer settings**.
