---
title: "Настройка Private Link для Azure Database for Postgres Flexible Server"
id: az-postgres-private-link
description: "Настройка Private Link для Azure Database for Postgres Flexible Server"
sidebar_label: "Private Link для Azure Database for Postgres Flexible Server"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Следующие шаги проведут вас через процесс настройки endpoint’а Private Link для Azure Database for Postgres Flexible Server в многотенантной среде <Constant name="cloud" />.

<CloudProviders type='Azure Database' />

## Настройка Azure Private Link {#configure-azure-private-link}

В Azure portal:

1. Перейдите к вашему Azure Database for Postgres Flexible Server.
2. На странице обзора сервера нажмите **JSON view**. 
3. Скопируйте значение в поле **Resource ID** в верхней части панели.  
   Формат пути выглядит так: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.DBforPostgreSQL/flexibleServers/<server_name>`.
4. Добавьте необходимую информацию в следующий шаблон и отправьте запрос на создание Azure Private Link в [dbt Support](/docs/dbt-support#dbt-cloud-support): 
    ```
      Subject: New Azure Multi-Tenant Private Link Request
    - Type: Azure Database for Postgres Flexible Server
    - Postgres Flexible Server name:
    - Azure Database for Postgres Flexible Server resource ID:
    - dbt Azure multi-tenant environment (EMEA):
    - Azure Postgres server region (for example, WestEurope, NorthEurope):
    ```
5. После того как команда поддержки подтвердит, что endpoint создан, перейдите к Azure Database for Postgres Flexible Server в Azure Portal и откройте **Settings** > **Networking**. В разделе **Private Endpoints** выделите вариант с именем `dbt` и выберите **Approve**. Подтвердите в Support, что соединение было одобрено, чтобы они могли проверить его и сделать доступным для использования в <Constant name="cloud" />.

## Создание подключения в dbt {#create-connection-in-dbt}

После завершения настройки в среде Azure вы сможете сконфигурировать private endpoint в <Constant name="cloud" />:

1. Перейдите в **Settings** → **Create new project** → выберите **Postgres**. 
2. Вы увидите две radio-кнопки: **Default Endpoint** и **PrivateLink Endpoint**. Выберите **PrivateLink Endpoint**. 
3. Выберите private endpoint из выпадающего списка (hostname/account будет автоматически заполнен).
4. Настройте остальные параметры подключения к платформе данных.
5. Протестируйте соединение и сохраните его.
