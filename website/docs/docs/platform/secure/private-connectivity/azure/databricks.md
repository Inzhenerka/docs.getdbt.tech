---
title: "Настройка Databricks и Azure Private Link"
id: azure-databricks
description: "Настройка Azure Private Link для Databricks."
sidebar_label: "Databricks"
pagination_next: null
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Следующие шаги помогут настроить частную конечную точку Azure Private Link для Databricks в мультитенантной среде <Constant name="dbt" />.

<CloudProviders type='Databricks'/>

:::warning Требуется внедрение в VNet

Azure поддерживает частные конечные точки для рабочих областей Databricks только в том случае, если рабочая область использует внедрение в VNet (виртуальную сеть, управляемую клиентом). Рабочие области в стандартной виртуальной сети, управляемой Azure, отклоняют подключения к частным конечным точкам с ошибкой `NonVNetInjectedWorkspaceNotSupported`.

Перед отправкой запроса убедитесь, что ваша рабочая область использует внедрение в VNet. Если это не так, сначала создайте новую рабочую область с включённым внедрением в VNet. Дополнительные сведения см. в разделе [Развёртывание Azure Databricks в собственной виртуальной сети](https://learn.microsoft.com/en-us/azure/databricks/security/network/classic/vnet-inject).

:::

## Настройка Azure Private Link

1. Перейдите в свою рабочую область Azure Databricks. 
    Формат пути: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.Databricks/workspaces/<workspace_name>`.
2. На странице обзора рабочей области нажмите **JSON view**. 
3. Скопируйте значение поля `resource_id`.  
4. Добавьте необходимые сведения в следующий шаблон и отправьте запрос на Azure Private Link в [службу поддержки dbt](mailto:support@getdbt.com):

   <Expandable alt_header="Шаблон письма с запросом в службу поддержки" is_open={true}>

   ```text
   Subject: New Azure Multi-Tenant Private Link Request

   - Type: Databricks
   - dbt platform account URL:
   - Databricks instance name:
   - Azure Databricks Workspace URL (for example, adb-################.##.azuredatabricks.net)
   - Databricks Azure resource ID: /subscriptions/SUB_ID/resourceGroups/RG/providers/Microsoft.Databricks/workspaces/WORKSPACE_NAME
     - Use the full ARM resource ID, replacing SUB_ID, RG, and WORKSPACE_NAME with your values
   - dbt Azure multi-tenant environment (US or EMEA):
   - Azure Databricks workspace region (for example, WestEurope, NorthEurope)
   ```

   </Expandable>

   <PrivateLinkSLA />

5. Когда наша служба поддержки подтвердит, что ресурсы доступны на портале Azure, перейдите в рабочую область Azure Databricks и откройте **Networking** > **Private Endpoint Connections**. Затем выделите элемент с именем `dbt` и выберите **Approve**.

   :::warning Влияние на DNS при одобрении первой частной конечной точки
   Одобрение первого подключения к частной конечной точке для рабочей области Azure Databricks изменяет разрешение DNS для этой рабочей области. Azure добавляет DNS-запись типа `A` для `privatelink.azuredatabricks.net`, которая перенаправляет URL рабочей области на частный IP-адрес вместо общедоступной конечной точки.

   Любые клиенты, включая другие проекты платформы dbt, инструменты или пользователей, которые подключаются к этой рабочей области через общедоступный интернет, **могут потерять подключение** после этого изменения. Перед одобрением согласуйте это изменение со всеми командами, использующими рабочую область. Дополнительные сведения см. в разделе [Настройка зон DNS для служб Azure](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns#azure-services-dns-zone-configuration).
   :::

## Создание подключения в dbt

Завершив настройку в среде Databricks, вы можете настроить частную конечную точку в <Constant name="dbt" />:

<PrivateLinkCreateConnection platform="Databricks" />
