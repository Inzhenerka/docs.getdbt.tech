---
title: "Настройка Snowflake и AWS PrivateLink"
id: snowflake-privatelink
description: "Настройка AWS PrivateLink для Snowflake"
sidebar_label: "AWS PrivateLink для Snowflake"
---

# Configuring Snowflake PrivateLink <Lifecycle status="managed_plus" />

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Следующие шаги проведут вас через настройку конечной точки Snowflake PrivateLink, размещённой в AWS, в многоарендной среде <Constant name="cloud" />.

<CloudProviders type='Snowflake' />

import SnowflakeOauthWithPL from '/snippets/_snowflake-oauth-with-pl.md'; 

<SnowflakeOauthWithPL />

## Настройка AWS PrivateLink

Чтобы настроить экземпляры Snowflake, размещенные на AWS, для [PrivateLink](https://aws.amazon.com/privatelink):

1. Откройте обращение в службу поддержки Snowflake, чтобы разрешить доступ из AWS или Entra ID аккаунта <Constant name="cloud" />.
- Snowflake предпочитает, чтобы обращение в поддержку открывал непосредственно владелец аккаунта, а не dbt Labs от его имени. Подробнее см. в [статье базы знаний Snowflake](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors).
- Предоставьте им ID вашего аккаунта <Constant name="cloud" /> вместе с любой другой информацией, запрашиваемой в статье.
  - **AWS account ID**: `346425330055` &mdash; _ПРИМЕЧАНИЕ: этот ID аккаунта применяется только к AWS multi-tenant окружениям <Constant name="cloud" />. Для AWS Virtual Private / Single-Tenant ID аккаунтов, пожалуйста, свяжитесь со [службой поддержки](/docs/dbt-support#dbt-cloud-support)._
- Для отправки обращения в поддержку вам потребуется уровень доступа `ACCOUNTADMIN` к экземпляру Snowflake.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink1.png" title="Открыть запрос в Snowflake"/>

2. После того как Snowflake предоставит запрашиваемый доступ, выполните системную функцию Snowflake [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) и скопируйте вывод.

3. Добавьте необходимую информацию в следующий шаблон и отправьте ваш запрос в [dbt Support](/docs/dbt-support#dbt-cloud-support):

```
Subject: New Multi-Tenant (Azure or AWS) PrivateLink Request
- Type: Snowflake
- SYSTEM$GET_PRIVATELINK_CONFIG output:
- *Use privatelink-account-url or regionless-privatelink-account-url?:
- **Create Internal Stage PrivateLink endpoint? (Y/N): 
- dbt AWS multi-tenant environment (US, EMEA, AU):
```

_*По умолчанию <Constant name="cloud" /> будет настроен на использование `privatelink-account-url` из предоставленного вывода [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) в качестве PrivateLink endpoint. По запросу вместо него может быть использован `regionless-privatelink-account-url`._

_** Для использования этой возможности Internal Stage PrivateLink должен быть [включён на аккаунте Snowflake](https://docs.snowflake.com/en/user-guide/private-internal-stages-aws#prerequisites)._

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Create Connection in dbt

После того как <Constant name="cloud" /> завершит настройку поддержки, вы сможете приступить к созданию новых подключений с использованием PrivateLink.

1. Перейдите в **Настройки** → **Создать новый проект** → выберите **Snowflake**.
2. Вы увидите две радиокнопки: **Публичное** и **Частное**. Выберите **Частное**.
3. Выберите частную конечную точку из выпадающего списка (это автоматически заполнит поле имени хоста/учетной записи).
4. Настройте остальные детали платформы данных.
5. Проверьте ваше подключение и сохраните его.

## Настройка Internal Stage PrivateLink в <Constant name="cloud" />

Если для Internal Stage был настроен эндпоинт PrivateLink, ваши окружения dbt должны быть сконфигурированы так, чтобы использовать этот эндпоинт вместо значения по умолчанию, заданного для аккаунта в Snowflake.

1. Obtain the Internal Stage PrivateLink endpoint DNS from dbt Support. For example, `*.vpce-012345678abcdefgh-4321dcba.s3.us-west-2.vpce.amazonaws.com`.
2. In the appropriate dbt project, navigate to **Orchestration** → **Environments**.
3. In any environment that should use the dbt Internal Stage PrivateLink endpoint, set an **Extended Attribute** similar to the following:
```
s3_stage_vpce_dns_name: '*.vpce-012345678abcdefgh-4321dcba.s3.us-west-2.vpce.amazonaws.com'
```
4. Save the changes

<Lightbox src="/img/docs/dbt-cloud/snowflake-internal-stage-dns.png" title="Internal Stage DNS"/>

## Настройка сетевых политик
Если в вашей организации используются [Snowflake Network Policies](https://docs.snowflake.com/en/user-guide/network-policies) для ограничения доступа к аккаунту Snowflake, вам потребуется добавить сетевое правило для <Constant name="cloud" />.

Вы можете запросить VPCE ID в службе поддержки [<Constant name="cloud" /> Support](mailto:support@getdbt.com), которые затем можно использовать для создания сетевой политики. Обратите внимание: при создании endpoint для Internal Stage VPCE ID будет отличаться от VPCE ID основного endpoint сервиса.

:::note Network Policy for Snowflake Internal Stage PrivateLink
Рекомендации по защите как сервиса Snowflake, так и Internal Stage см. в документации Snowflake по [network policies](https://docs.snowflake.com/en/user-guide/network-policies#strategies-for-protecting-both-service-and-internal-stage) и [network rules](https://docs.snowflake.com/en/user-guide/network-rules#incoming-requests).

:::

### Использование интерфейса

Откройте интерфейс Snowflake и выполните следующие шаги:

1. Перейдите на вкладку **Security**.
2. Нажмите **Network Rules**.
3. Нажмите **Add Rule**.
4. Задайте имя правила.
5. Выберите базу данных и схему, в которых будет храниться правило. Эти параметры используются для настройки прав доступа и организационных целей; они не влияют на само правило.
6. Установите тип `AWS VPCE ID`, а режим — `Ingress`.
7. Введите VPCE ID, предоставленный службой поддержки <Constant name="cloud" />, в поле идентификатора и нажмите **Enter**.
8. Нажмите **Create Network Rule**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink2.png" title="Создать сетевое правило"/>

9. На вкладке **Network Policy** отредактируйте политику, в которую вы хотите добавить правило. Это может быть политика на уровне аккаунта или политика, специфичная для пользователей, подключающихся из <Constant name="cloud" />.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink3.png" title="Обновить сетевую политику"/>

### Использование SQL

Для быстрой и автоматизированной настройки сетевых правил через SQL в Snowflake следующие команды позволяют создать и настроить правила доступа для dbt Cloud. Эти примеры SQL демонстрируют, как добавить сетевое правило и обновить вашу сетевую политику соответствующим образом.

Для быстрого и автоматизированного задания сетевых правил с помощью SQL в Snowflake можно использовать следующие команды, которые позволяют создавать и настраивать правила доступа для <Constant name="cloud" />. Эти примеры SQL демонстрируют, как добавить сетевое правило и соответствующим образом обновить сетевую политику.

1. Создайте новое сетевое правило с помощью следующего SQL:
```sql

CREATE NETWORK RULE allow_dbt_cloud_access
  MODE = INGRESS
  TYPE = AWSVPCEID
  VALUE_LIST = ('<VPCE_ID>'); -- Замените '<VPCE_ID>' на фактический ID, предоставленный

```

2. Добавьте правило в сетевую политику с помощью следующего SQL:
```sql

ALTER NETWORK POLICY <network_policy_name>
  ADD ALLOWED_NETWORK_RULE_LIST =('allow_dbt_cloud_access');

```