---
title: "Настройка Snowflake и Azure Private Link"
id: snowflake-private-link
description: "Настройка Azure Private Link для Snowflake"
sidebar_label: "Azure Private Link для Snowflake"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Следующие шаги проводят вас через настройку endpoint’а Snowflake Private Link, размещённого в Azure, в многоарендной среде <Constant name="cloud" />.

<CloudProviders type='Snowflake' />

:::note Snowflake OAuth с PrivateLink
Пользователям, которые подключаются к Snowflake с использованием [Snowflake OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth) через AWS PrivateLink из <Constant name="cloud" />, также потребуется доступ к PrivateLink endpoint’у с их локальной рабочей станции. Где это возможно, используйте [Snowflake External OAuth](/docs/cloud/manage-access/snowflake-external-oauth), чтобы обойти это ограничение.

Документация Snowflake:
>В настоящее время для любой учетной записи Snowflake SSO может работать только с одним URL учетной записи одновременно: либо с публичным URL учетной записи, либо с URL, связанным с сервисом приватного подключения

- [Snowflake SSO with Private Connectivity](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-overview#label-sso-private-connectivity)
:::

## Настройка Azure Private Link {#configure-azure-private-link}

Чтобы настроить экземпляры Snowflake, размещённые в Azure, для использования [Private Link](https://learn.microsoft.com/en-us/azure/private-link/private-link-overview):

1. В вашей учетной записи Snowflake выполните следующие SQL-запросы и скопируйте вывод: 

```sql

USE ROLE ACCOUNTADMIN;
SELECT SYSTEM$GET_PRIVATELINK_CONFIG();

```

2. Добавьте необходимую информацию в следующий шаблон и отправьте запрос в [службу поддержки dbt](/docs/dbt-support#dbt-cloud-support): 

```
Subject: New Multi-Tenant Azure PrivateLink Request
- Type: Snowflake
- The output from SYSTEM$GET_PRIVATELINK_CONFIG:
  - Include the privatelink-pls-id
  - Enable Internal Stage Private Link? Y/N (If Y, output must include `privatelink-internal-stage`)
- dbt Azure multi-tenant environment (EMEA):
```

3. Служба поддержки dbt предоставит вам `private endpoint resource_id` нашего `private_endpoint`, а также диапазон `CIDR`, чтобы вы могли завершить [настройку PrivateLink](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors), обратившись в службу поддержки Snowflake. 

4. (Опционально) При включении [Azure private endpoint для Internal Stage](https://docs.snowflake.com/en/user-guide/private-internal-stages-azure) также будет предоставлен `resource_id` для endpoint’а Internal Stage. 

Как администратор Snowflake, вызовите функцию `SYSTEM$AUTHORIZE_STAGE_PRIVATELINK_ACCESS`, передав в качестве аргумента значение resource ID. Это авторизует доступ к внутреннему stage Snowflake через private endpoint. 

```sql

USE ROLE ACCOUNTADMIN;

-- Azure Private Link
SELECT SYSTEMS$AUTHORIZE_STAGE_PRIVATELINK_ACCESS ( `AZURE PRIVATE ENDPOINT RESOURCE ID` );

```

## Настройка Network Policies {#configuring-network-policies}
Если в вашей организации используются [Snowflake Network Policies](https://docs.snowflake.com/en/user-guide/network-policies) для ограничения доступа к учетной записи Snowflake, вам потребуется добавить сетевое правило для <Constant name="cloud" />. 

### Поиск Azure Link ID endpoint’а {#find-the-endpoint-azure-link-id}

Snowflake позволяет определить Azure Link ID настроенных endpoint’ов, выполнив соответствующую команду. Следующий запрос можно использовать для более точного выделения значения Link ID и связанного с ним имени ресурса endpoint’а:

```sql

select
  value:linkIdentifier, REGEXP_SUBSTR(value: endpointId, '([^\/]+$)')
from
  table(
    flatten(
      input => parse_json(system$get_privatelink_authorized_endpoints())
    )
  );

```

### Использование UI {#using-the-ui}

Откройте UI Snowflake и выполните следующие шаги:
1. Перейдите на вкладку **Security**.
2. Нажмите **Network Rules**.
3. Нажмите **+ Network Rule**.
4. Задайте имя правила.
5. Выберите базу данных и схему, в которых будет храниться правило. Эти настройки используются для управления правами и организации и не влияют на само правило.
6. Установите тип `Azure Link ID`, а режим — `Ingress`.
7. В поле identifier введите Azure Link ID, полученный в предыдущем разделе, и нажмите **Enter**.
8. Нажмите **Create Network Rule**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink2.png" title="Создание Network Rule"/>

9. На вкладке **Network Policy** отредактируйте политику, в которую вы хотите добавить правило. Это может быть политика на уровне учетной записи или политика, применяемая только к пользователям, подключающимся из <Constant name="cloud" />.

10. Добавьте новое правило в список разрешённых и нажмите **Update Network Policy**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink3.png" title="Обновление Network Policy"/>

### Использование SQL {#using-sql}

Для быстрой и автоматизированной настройки сетевых правил через SQL в Snowflake следующие команды позволяют создать и настроить правила доступа для <Constant name="cloud" />. Эти SQL-примеры демонстрируют, как добавить сетевое правило и обновить Network Policy.

1. Создайте новое сетевое правило с помощью следующего SQL:
```sql

CREATE NETWORK RULE allow_dbt_cloud_access
  MODE = INGRESS
  TYPE = AZURELINKID
  VALUE_LIST = ('<Azure Link ID>'); -- Замените '<Azure Link ID>' на фактический ID, полученный выше

```

2. Добавьте правило в Network Policy с помощью следующего SQL:
```sql

ALTER NETWORK POLICY <network_policy_name>
  ADD ALLOWED_NETWORK_RULE_LIST =('allow_dbt_cloud_access');

```
