---
title: "Настройка Databricks и Azure Private Link"
id: databricks-private-link
description: "Настройка Azure Private Link для Databricks"
sidebar_label: "Azure Private Link для Databricks"
pagination_next: null
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Следующие шаги проведут вас через процесс настройки эндпоинта Databricks Azure Private Link в многопользовательской (multi-tenant) среде <Constant name="cloud" />.

<CloudProviders type='Databricks'/>

## Настройка Azure Private Link {#configure-azure-private-link}

1. Перейдите в ваш рабочий процесс Azure Databricks.  
    Формат пути: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.Databricks/workspaces/<workspace_name>`.
2. На странице обзора рабочего пространства нажмите **JSON view**.
3. Скопируйте значение из поля `resource_id`.  
4. Добавьте необходимую информацию в следующий шаблон и отправьте запрос на создание Azure Private Link в [службу поддержки dbt](/docs/dbt-support#dbt-cloud-support):  
    ```
      Subject: New Azure Multi-Tenant Private Link Request
    - Type: Databricks
    - Databricks instance name:
    - Azure Databricks Workspace URL (for example, adb-################.##.azuredatabricks.net)
    - Databricks Azure resource ID:
    - dbt Azure multi-tenant environment (EMEA):
    - Azure Databricks workspace region (like WestEurope, NorthEurope):
    ```
5. После того как команда поддержки подтвердит, что ресурсы доступны в портале Azure, перейдите в рабочее пространство Azure Databricks и откройте **Networking** > **Private Endpoint Connections**. Затем выделите вариант с именем `dbt` и нажмите **Approve**.

## Создание подключения в dbt {#create-connection-in-dbt}

После завершения настройки в среде Databricks вы сможете настроить приватный эндпоинт в <Constant name="cloud" />:

1. Перейдите в **Settings** → **Create new project** → выберите **Databricks**.
2. Вы увидите две радиокнопки: **Public** и **Private.** Выберите **Private**.
3. Выберите приватный эндпоинт из выпадающего списка (поле hostname/account будет заполнено автоматически).
4. Настройте оставшиеся параметры платформы данных.
5. Протестируйте подключение и сохраните его.
