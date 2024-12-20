---
title: "Настройка Snowflake PrivateLink"
id: snowflake-privatelink
description: "Настройка PrivateLink для Snowflake"
sidebar_label: "PrivateLink для Snowflake"
---

import SetUpPages from '/snippets/_available-tiers-privatelink.md';
import CloudProviders from '/snippets/_privatelink-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

Следующие шаги проведут вас через настройку конечной точки Snowflake AWS PrivateLink или Azure Private Link в многопользовательской среде dbt Cloud.

<CloudProviders type='Snowflake' />

:::note Snowflake SSO с PrivateLink
Пользователи, подключающиеся к Snowflake с использованием SSO через соединение PrivateLink из dbt Cloud, также потребуют доступа к конечной точке PrivateLink с их локальной рабочей станции.

> В настоящее время для любой учетной записи Snowflake SSO работает только с одним URL-адресом учетной записи одновременно: либо с публичным URL-адресом учетной записи, либо с URL-адресом, связанным с сервисом частного подключения.

- [Snowflake SSO с частным подключением](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-overview#label-sso-private-connectivity)
:::

## О частном подключении для Snowflake

dbt Cloud поддерживает частное подключение для Snowflake с использованием одного из следующих сервисов:

- AWS [PrivateLink](#configure-aws-privatelink)
- Azure [Private Link](#configure-azure-private-link)

## Настройка AWS PrivateLink

Чтобы настроить экземпляры Snowflake, размещенные на AWS, для [PrivateLink](https://aws.amazon.com/privatelink):

1. Откройте запрос в службу поддержки Snowflake, чтобы разрешить доступ из учетной записи dbt Cloud AWS или Entra ID.
- Snowflake предпочитает, чтобы владелец учетной записи открывал запрос в службу поддержки напрямую, а не dbt Labs действовал от их имени. Для получения дополнительной информации обратитесь к [статье базы знаний Snowflake](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors).
- Предоставьте им ваш ID учетной записи dbt Cloud вместе с любой другой информацией, запрашиваемой в статье.
  - **AWS account ID**: `346425330055` &mdash; _ПРИМЕЧАНИЕ: Этот ID учетной записи применяется только к многопользовательским средам AWS dbt Cloud. Для ID учетных записей AWS Virtual Private/Single-Tenant, пожалуйста, свяжитесь с [поддержкой](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support)._
- Вам потребуется доступ `ACCOUNTADMIN` к экземпляру Snowflake для отправки запроса в поддержку.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink1.png" title="Открыть запрос в Snowflake"/>

2. После того как Snowflake предоставит запрашиваемый доступ, выполните системную функцию Snowflake [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) и скопируйте вывод.

3. Добавьте необходимую информацию в следующий шаблон и отправьте ваш запрос в [поддержку dbt](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support):

```
Тема: Новый запрос на Multi-Tenant (Azure или AWS) PrivateLink
- Тип: Snowflake
- Вывод SYSTEM$GET_PRIVATELINK_CONFIG:
- *Использовать privatelink-account-url или regionless-privatelink-account-url?: 
- Многопользовательская среда dbt Cloud 
    - AWS: США, EMEA или AU
    - Azure: только EMEA
```
_*По умолчанию dbt Cloud будет настроен на использование `privatelink-account-url` из предоставленного [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) в качестве конечной точки PrivateLink. По запросу может быть использован `regionless-privatelink-account-url`._

import PrivateLinkSLA from '/snippets/_PrivateLink-SLA.md';

<PrivateLinkSLA />

## Настройка Azure Private Link

Чтобы настроить экземпляры Snowflake, размещенные на Azure, для [Private Link](https://learn.microsoft.com/en-us/azure/private-link/private-link-overview):

1. В вашей учетной записи Snowflake выполните следующие SQL-запросы и скопируйте вывод:

```sql

USE ROLE ACCOUNTADMIN;
SYSTEM$GET_PRIVATELINK_CONFIG;

```

2. Добавьте необходимую информацию в следующий шаблон и отправьте ваш запрос в [поддержку dbt](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support):

```
Тема: Новый запрос на Multi-Tenant (Azure или AWS) PrivateLink
- Тип: Snowflake
- Вывод SYSTEM$GET_PRIVATELINK_CONFIG:
  - Включите privatelink-pls-id
- Многопользовательская среда dbt Cloud Azure: 
```

3. Поддержка dbt предоставит вам `private endpoint resource_id` нашего `private_endpoint` и диапазон `CIDR`, чтобы вы могли завершить [настройку PrivateLink](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors), связавшись с командой поддержки Snowflake.

## Создание подключения в dbt Cloud

После того как поддержка dbt Cloud завершит настройку, вы можете начать создавать новые подключения, используя PrivateLink.

1. Перейдите в **Настройки** → **Создать новый проект** → выберите **Snowflake**.
2. Вы увидите две радиокнопки: **Публичное** и **Частное**. Выберите **Частное**.
3. Выберите частную конечную точку из выпадающего списка (это автоматически заполнит поле имени хоста/учетной записи).
4. Настройте остальные детали платформы данных.
5. Проверьте ваше подключение и сохраните его.

### Включение подключения в Snowflake, размещенном на Azure

:::note

Внутренние этапы AWS private в настоящее время не поддерживаются.

:::

Чтобы завершить настройку, следуйте оставшимся шагам из руководств по настройке Snowflake. Инструкции различаются в зависимости от платформы:

- [Snowflake Azure Private Link](https://docs.snowflake.com/en/user-guide/privatelink-azure)
- [Частные конечные точки Azure для внутренних этапов](https://docs.snowflake.com/en/user-guide/private-internal-stages-azure)

Существуют некоторые нюансы для каждого подключения, и вам потребуется администратор Snowflake. Как администратор Snowflake, вызовите функцию `SYSTEM$AUTHORIZE_STAGE_PRIVATELINK_ACCESS`, используя значение privateEndpointResourceID в качестве аргумента функции. Это авторизует доступ к внутреннему этапу Snowflake через частную конечную точку.

```sql

USE ROLE ACCOUNTADMIN;

-- Azure Private Link
SELECT SYSTEMS$AUTHORIZE_STAGE_PRIVATELINK_ACCESS ( `AZURE PRIVATE ENDPOINT RESOURCE ID` );

```

## Настройка сетевых политик

Если ваша организация использует [сетевые политики Snowflake](https://docs.snowflake.com/en/user-guide/network-policies) для ограничения доступа к вашей учетной записи Snowflake, вам потребуется добавить сетевое правило для dbt Cloud.

Вы можете запросить VPCE ID у [поддержки dbt Cloud](mailto:support@getdbt.com), который вы можете использовать для создания сетевой политики.

### Использование интерфейса

Откройте интерфейс Snowflake и выполните следующие шаги:
1. Перейдите на вкладку **Безопасность**.
2. Нажмите на **Сетевые правила**.
3. Нажмите на **Добавить правило**.
4. Дайте правилу имя.
5. Выберите базу данных и схему, где будет храниться правило. Эти выборы предназначены для настройки разрешений и организационных целей; они не влияют на само правило.
6. Установите тип `AWS VPCE ID` и режим `Ingress`.
7. Введите VPCE ID, предоставленный поддержкой dbt Cloud, в поле идентификатора и нажмите **Enter**.
8. Нажмите **Создать сетевое правило**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink2.png" title="Создать сетевое правило"/>

9. На вкладке **Сетевая политика** отредактируйте политику, к которой вы хотите добавить правило. Это может быть политика на уровне учетной записи или политика, специфичная для пользователей, подключающихся из dbt Cloud.

10. Добавьте новое правило в список разрешенных и нажмите **Обновить сетевую политику**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink3.png" title="Обновить сетевую политику"/>

### Использование SQL

Для быстрой и автоматизированной настройки сетевых правил через SQL в Snowflake следующие команды позволяют создать и настроить правила доступа для dbt Cloud. Эти примеры SQL демонстрируют, как добавить сетевое правило и обновить вашу сетевую политику соответствующим образом.

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