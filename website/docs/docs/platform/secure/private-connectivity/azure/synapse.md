---
title: "Настройка Private Link для Azure Synapse"
id: azure-synapse
description: "Настройка Private Link для Azure Synapse."
sidebar_label: "Azure Synapse"
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

Следующие шаги помогут вам настроить частную конечную точку Private Link для Azure Synapse в мультитенантной среде <Constant name="dbt" />.

<CloudProviders type='Azure Synapse' />

## Настройка Azure Private Link

На портале Azure:

1. Перейдите в свою рабочую область Azure Synapse.
2. На странице обзора рабочей области нажмите **JSON view**. 
3. Скопируйте значение поля **Resource ID** в верхней части панели.  
    Формат пути: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.Synapse/workspaces/<workspace_name>`.
4. Заполните следующий шаблон необходимыми сведениями и отправьте запрос на настройку Azure Private Link в [службу поддержки dbt](mailto:support@getdbt.com):

   <Expandable alt_header="Шаблон письма в службу поддержки" is_open={true}>

   ```text
   Subject: New Azure Multi-Tenant Private Link Request

   - Type: Azure Synapse
   - dbt platform account URL:
   - Server name:
   - Azure Synapse workspace resource ID:
   - dbt Azure multi-tenant environment (US or EMEA):
   - Azure Synapse workspace region (for example, WestEurope, NorthEurope):
   ```

   </Expandable>

   <PrivateLinkSLA />

5. Когда наша служба поддержки подтвердит создание конечной точки, перейдите в рабочую область Azure Synapse на портале Azure и откройте **Security** > **Private endpoint connections**. В таблице **Private endpoint connections** выделите запись с именем `dbt` и нажмите **Approve**. Сообщите службе поддержки dbt, что подключение одобрено, чтобы специалисты могли проверить его и сделать доступным для использования в <Constant name="dbt" />.


## Создание подключения в dbt

Выполнив шаг выше, вы можете настроить частную конечную точку в <Constant name="dbt" />:

<PrivateLinkCreateConnection platform="Synapse" />
