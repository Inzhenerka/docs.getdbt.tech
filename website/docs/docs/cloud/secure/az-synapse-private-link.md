---
title: "Настройка Private Link для Azure Synapse"
id: az-synapse-private-link
description: "Настройка Private Link для Azure Synapse"
sidebar_label: "Private Link для Azure Synapse"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Следующие шаги описывают процесс настройки конечной точки Private Link для Azure Synapse в многопользовательской (multi-tenant) среде <Constant name="cloud" />.

<CloudProviders type='Azure Synapse' />

## Настройка Azure Private Link {#configure-azure-private-link}

В Azure Portal:

1. Перейдите в ваш workspace Azure Synapse.
2. На странице обзора workspace нажмите **JSON view**. 
3. Скопируйте значение поля **Resource ID** в верхней части панели.  
   Формат пути: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.Synapse/workspaces/<workspace_name>`.
4. Добавьте необходимую информацию в следующий шаблон и отправьте запрос на создание Azure Private Link в [службу поддержки dbt](/docs/dbt-support#dbt-cloud-support): 
    ```
      Subject: New Azure Multi-Tenant Private Link Request
    - Type: Azure Synapse
    - Server name:
    - Azure Synapse workspace resource ID:
    - dbt Azure multi-tenant environment (EMEA):
    - Azure Synapse workspace region (for example, WestEurope, NorthEurope):
    ```
5. После того как команда поддержки подтвердит, что конечная точка создана, перейдите в workspace Azure Synapse в Azure Portal и откройте **Security** > **Private endpoint connections**. В таблице **Private endpoint connections** выделите запись с именем `dbt` и выберите **Approve**. Подтвердите в службе поддержки, что соединение одобрено, чтобы они могли проверить его и сделать доступным для использования в <Constant name="cloud" />.

## Создание подключения в dbt {#create-connection-in-dbt}

После выполнения предыдущего шага вы сможете настроить приватную конечную точку в <Constant name="cloud" />:

1. Перейдите в **Settings** → **Create new project** → выберите **Synapse**. 
2. Вы увидите две радиокнопки: **Default Endpoint** и **PrivateLink Endpoint**. Выберите **PrivateLink Endpoint**. 
3. Выберите приватную конечную точку из выпадающего списка (hostname/account будет заполнен автоматически).
4. Настройте остальные параметры платформы данных.
5. Протестируйте подключение и сохраните его.
