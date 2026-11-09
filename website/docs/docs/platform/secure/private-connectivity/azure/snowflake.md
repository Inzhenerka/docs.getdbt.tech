---
title: "Настройка Snowflake и Azure Private Link"
id: azure-snowflake
description: "Настройка Azure Private Link для Snowflake."
sidebar_label: "Snowflake"
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

Следующие шаги помогут настроить размещенную в Azure конечную точку Snowflake Private Link в мультитенантной среде <Constant name="dbt" />.

<CloudProviders type='Snowflake' />

:::note Snowflake OAuth с Private Link
Пользователям, подключающимся к Snowflake с помощью [Snowflake OAuth](/docs/platform/manage-access/set-up-snowflake-oauth) через соединение Azure Private Link из <Constant name="dbt" />, также необходим доступ к конечной точке Private Link с локальной рабочей станции. По возможности используйте [Snowflake External OAuth](/docs/platform/manage-access/snowflake-external-oauth), чтобы обойти это ограничение.

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

2. Добавьте необходимую информацию в следующий шаблон и отправьте запрос в [службу поддержки dbt](mailto:support@getdbt.com):

<Expandable alt_header="Шаблон письма в службу поддержки" is_open={true}>

```text
Subject: New Azure Multi-Tenant Private Link Request

- Type: Snowflake
- dbt platform account URL:
- The output from SYSTEM$GET_PRIVATELINK_CONFIG:
  - Include the privatelink-pls-id
  - Enable Internal Stage Private Link? Y/N (If Y, output must include privatelink-internal-stage)
- dbt Azure multi-tenant environment (US or EMEA):
```

</Expandable>

<PrivateLinkSLA />

3. Служба поддержки dbt предоставит вам `private endpoint resource_id` нашего `private_endpoint`, чтобы вы могли завершить [настройку PrivateLink](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors), обратившись в службу поддержки Snowflake.

4. (Опционально) При включении [Azure private endpoint для Internal Stage](https://docs.snowflake.com/en/user-guide/private-internal-stages-azure) также будет предоставлен `resource_id` для endpoint’а Internal Stage. 

Как администратор Snowflake, вызовите функцию `SYSTEM$AUTHORIZE_STAGE_PRIVATELINK_ACCESS`, передав в качестве аргумента значение resource ID. Это авторизует доступ к внутреннему stage Snowflake через private endpoint. 

```sql

USE ROLE ACCOUNTADMIN;

-- Azure Private Link
SELECT SYSTEM$AUTHORIZE_STAGE_PRIVATELINK_ACCESS ( 'AZURE_PRIVATE_ENDPOINT_RESOURCE_ID' );

```

## Создание подключения в dbt

После того как служба поддержки dbt завершит настройку, вы сможете создавать новые подключения с использованием Private Link.

<PrivateLinkCreateConnection platform="Snowflake" />

## Настройка сетевых политик
Если ваша организация использует [сетевые политики Snowflake](https://docs.snowflake.com/en/user-guide/network-policies) для ограничения доступа к вашей учетной записи Snowflake, необходимо добавить сетевое правило для <Constant name="dbt" />.

Используйте Azure Link ID, чтобы указать частную конечную точку <Constant name="dbt" /> в сетевом правиле.

### Поиск Azure Link ID endpoint’а {#find-the-endpoint-azure-link-id}

Snowflake позволяет найти Azure Link ID настроенных конечных точек, выполнив команду `SYSTEM$GET_PRIVATELINK_AUTHORIZED_ENDPOINTS`. Используйте следующий код, чтобы извлечь значение Link ID и имя связанного ресурса конечной точки:

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

<Lightbox src="/img/docs/dbt-platform/snowflakeprivatelink2.png" title="Создание сетевого правила"/>

9. На вкладке **Network Policy** отредактируйте политику, в которую хотите добавить правило. Это может быть политика уровня аккаунта или политика для пользователей, подключающихся из <Constant name="dbt" />.

10. Добавьте новое правило в список разрешённых и нажмите **Update Network Policy**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink3.png" title="Обновление Network Policy"/>

<Lightbox src="/img/docs/dbt-platform/snowflakeprivatelink3.png" title="Обновление сетевой политики"/>

Для быстрой и автоматизированной настройки сетевых правил через SQL в Snowflake следующие команды позволяют создать и настроить правила доступа для <Constant name="cloud" />. Эти SQL-примеры демонстрируют, как добавить сетевое правило и обновить Network Policy.

Для быстрой и автоматизированной настройки сетевых правил с помощью SQL в Snowflake следующие команды позволяют создать и настроить правила доступа для <Constant name="dbt" />. Эти примеры SQL показывают, как добавить сетевое правило и соответствующим образом обновить сетевую политику.

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
