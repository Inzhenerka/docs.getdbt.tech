---
title: "Настройка Private Link для Azure Database for Postgres Flexible Server"
id: azure-postgres
description: "Настройка Private Link для Azure Database for Postgres Flexible Server."
sidebar_label: "Гибкий сервер Azure Database for PostgreSQL"
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

Следующие шаги помогут настроить конечную точку Private Link для Azure Database for Postgres Flexible Server в мультитенантной среде <Constant name="dbt" />.

<CloudProviders type='Azure Database' />

## Настройка Azure Private Link

На портале Azure:

1. Перейдите к своему экземпляру Azure Database for Postgres Flexible Server.
2. На странице обзора сервера нажмите **JSON view**. 
3. Скопируйте значение поля **Resource ID** в верхней части панели.  
    Формат пути: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.DBforPostgreSQL/flexibleServers/<server_name>`.
4. Заполните следующий шаблон необходимыми сведениями и отправьте запрос на создание Azure Private Link в [службу поддержки dbt](mailto:support@getdbt.com):

   <Expandable alt_header="Шаблон письма в службу поддержки" is_open={true}>

   ```text
   Subject: New Azure Multi-Tenant Private Link Request

   - Type: Azure Database for Postgres Flexible Server
   - dbt platform account URL:
   - Postgres Flexible Server name:
   - Azure Database for Postgres Flexible Server resource ID:
   - dbt Azure multi-tenant environment (US or EMEA):
   - Azure Postgres server region (for example, WestEurope, NorthEurope):
   ```

   </Expandable>

   <PrivateLinkSLA />

5. Когда наша служба поддержки подтвердит создание конечной точки, перейдите к экземпляру Azure Database for Postgres Flexible Server на портале Azure и откройте **Settings** > **Networking**. В разделе **Private Endpoints** выделите элемент с именем `dbt` и выберите **Approve**. Сообщите службе поддержки dbt, что подключение одобрено, чтобы специалисты могли проверить его и сделать доступным для использования в <Constant name="dbt" />.


## Создание подключения в dbt

Завершив настройку в среде Azure, вы можете настроить частную конечную точку в <Constant name="dbt" />:

<PrivateLinkCreateConnection platform="Postgres"  />
