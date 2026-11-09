---
title: "Настройка Snowflake и GCP Private Service Connect"
id: gcp-snowflake
description: "Настройка GCP Private Service Connect для Snowflake."
sidebar_label: "Snowflake"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Настройка Snowflake Private Service Connect

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Следующие шаги помогут вам настроить эндпоинт GCP Snowflake Private Service Connect (PSC) в мультитенантной среде <Constant name="dbt" />.

<CloudProviders type='Snowflake' />

:::warning

Соединения GCP Internal Stage PSC в настоящее время не поддерживаются.

:::

## Настройка GCP Private Service Connect {#configure-gcp-private-service-connect}

Проект dbt Labs в GCP заранее авторизован для подключения к аккаунтам Snowflake. 

Чтобы настроить экземпляры Snowflake, размещённые в GCP, для использования [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect):

1. Выполните системную функцию Snowflake [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) и скопируйте результат.

2. Добавьте необходимую информацию в следующий шаблон и отправьте запрос в [службу поддержки dbt](mailto:support@getdbt.com):

<Expandable alt_header="Support request email template" is_open={true}>

```text
Subject: New Multi-Tenant GCP PSC Request

- Type: Snowflake
- dbt platform account URL:
- SYSTEM$GET_PRIVATELINK_CONFIG output:
- *Use privatelink-account-url or regionless-privatelink-account-url?:
- dbt GCP multi-tenant environment:
```
</Expandable>
_*По умолчанию <Constant name="dbt" /> будет настроен на использование `privatelink-account-url` из предоставленной конфигурации [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) в качестве конечной точки PrivateLink. По запросу вместо него можно использовать `regionless-privatelink-account-url`._


import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Создание подключения в dbt

После того как служба поддержки <Constant name="dbt" /> завершит настройку, вы сможете создавать новые подключения с использованием PrivateLink. 

<PrivateLinkCreateConnection platform="Snowflake" />

## Настройка сетевых политик

Если ваша организация использует [сетевые политики Snowflake](https://docs.snowflake.com/en/user-guide/network-policies) для ограничения доступа к вашей учетной записи Snowflake, необходимо добавить сетевое правило для <Constant name="dbt" />. 

Запросите **идентификатор подключения PSC** в [службе поддержки <Constant name="dbt" />](mailto:support@getdbt.com), чтобы использовать его в сетевом правиле. Snowflake поддерживает [`GCPPSCID` в качестве типа идентификатора сетевого правила](https://docs.snowflake.com/en/sql-reference/sql/create-network-rule), и именно этот подход рекомендуется использовать. Идентификатор подключения PSC однозначно определяет конечную точку подключения вашей организации, тогда как правила на основе IP-адресов используют диапазоны CIDR, которые могут быть общими для нескольких клиентов dbt.

### Использование UI {#using-the-ui}

Откройте интерфейс Snowflake и выполните следующие действия:
1. Перейдите на вкладку **Security**.
2. Нажмите **Network Rules**.
3. Нажмите **Add Rule**.
4. Задайте имя правила.
5. Выберите базу данных и схему, в которых будет храниться правило. Этот выбор используется для настройки разрешений и организации объектов; на само правило он не влияет.
6. Установите тип `GCPPSCID` и режим `Ingress`.
7. Введите идентификатор подключения PSC, предоставленный службой поддержки <Constant name="dbt" />, в поле идентификатора и нажмите **Enter**.
8. Нажмите **Create Network Rule**.
9. На вкладке **Network Policy** отредактируйте политику, в которую хотите добавить правило. Это может быть политика уровня аккаунта или политика для конкретных пользователей, подключающихся из <Constant name="dbt" />.
10. Добавьте новое правило в список разрешённых и нажмите **Update Network Policy**.

### Использование SQL {#using-sql}

Для быстрой автоматизированной настройки сетевых правил с помощью SQL в Snowflake используйте следующие команды, которые позволяют создавать и настраивать правила доступа для <Constant name="dbt" />. Эти примеры SQL показывают, как добавить сетевое правило и соответствующим образом обновить сетевую политику.

1. Создайте новое сетевое правило с помощью следующего SQL:
```sql

CREATE NETWORK RULE allow_dbt_cloud_access
  MODE = INGRESS
TYPE = GCPPSCID
  VALUE_LIST = ('<PSC_CONNECTION_ID>'); -- Замените на идентификатор подключения PSC, полученный от службы поддержки dbt

```

2. Добавьте правило в сетевую политику с помощью следующего SQL:
```sql

ALTER NETWORK POLICY <network_policy_name>
  ADD ALLOWED_NETWORK_RULE_LIST =('allow_dbt_cloud_access');

```
