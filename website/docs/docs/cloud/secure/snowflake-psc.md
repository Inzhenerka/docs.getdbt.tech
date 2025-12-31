---
title: "Настройка Private Service Connect между Snowflake и GCP"
id: snowflake-psc
description: "Настройка GCP Private Service Connect для Snowflake"
sidebar_label: "GCP Private Service Connect для Snowflake"
---

# Настройка Snowflake Private Service Connect <Lifecycle status="managed_plus" /> {#configuring-snowflake-private-service-connect}

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Следующие шаги описывают процесс настройки эндпоинта GCP Snowflake Private Service Connect (PSC) в мультиарендной среде <Constant name="cloud" />.

<CloudProviders type='Snowflake' />

:::warning

Соединения GCP Internal Stage PSC в настоящее время не поддерживаются.

:::

## Настройка GCP Private Service Connect {#configure-gcp-private-service-connect}

Проект dbt Labs в GCP заранее авторизован для подключения к аккаунтам Snowflake. 

Чтобы настроить экземпляры Snowflake, размещённые в GCP, для использования [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect):

1. Выполните системную функцию Snowflake [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) и скопируйте результат.

2. Добавьте необходимую информацию в следующий шаблон и отправьте запрос в [службу поддержки dbt](/docs/dbt-support#dbt-cloud-support):

```
Subject: New Multi-Tenant GCP PSC Request
- Type: Snowflake
- SYSTEM$GET_PRIVATELINK_CONFIG output:
- *Use privatelink-account-url or regionless-privatelink-account-url?: 
- dbt GCP multi-tenant environment:
```
_*По умолчанию <Constant name="cloud" /> будет настроен на использование `privatelink-account-url` из предоставленного вывода [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) в качестве эндпоинта PrivateLink. По запросу вместо него может быть использован `regionless-privatelink-account-url`._


import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Создание подключения в dbt {#create-connection-in-dbt}

После того как служба поддержки <Constant name="cloud" /> завершит настройку, вы сможете начать создавать новые подключения с использованием PrivateLink. 

1. Перейдите в **Settings** → **Create new project** → выберите **Snowflake**. 
2. Вы увидите два переключателя: **Public** и **Private**. Выберите **Private**. 
3. Выберите приватный эндпоинт из выпадающего списка (поле hostname/account будет заполнено автоматически).
4. Настройте остальные параметры платформы данных.
5. Протестируйте подключение и сохраните его.

## Настройка сетевых политик {#configuring-network-policies}

Если в вашей организации используются [Snowflake Network Policies](https://docs.snowflake.com/en/user-guide/network-policies) для ограничения доступа к аккаунту Snowflake, вам потребуется добавить сетевое правило для <Constant name="cloud" />. 

Вы можете запросить диапазон CIDR у [службы поддержки <Constant name="cloud" />](mailto:support@getdbt.com), который затем можно использовать для создания сетевой политики. 

### Использование UI {#using-the-ui}

Откройте интерфейс Snowflake и выполните следующие шаги:
1. Перейдите на вкладку **Security**.
2. Нажмите **Network Rules**.
3. Нажмите **Add Rule**.
4. Задайте имя правила.
5. Выберите базу данных и схему, в которых будет храниться правило. Эти настройки используются для управления правами доступа и организационных целей и не влияют на само правило.
6. Установите тип `IPV4` и режим `Ingress`.
7. Введите диапазон CIDR, предоставленный службой поддержки <Constant name="cloud" />, в поле identifier и нажмите **Enter**.
8. Нажмите **Create Network Rule**.
9. На вкладке **Network Policy** отредактируйте политику, в которую вы хотите добавить правило. Это может быть политика уровня аккаунта или политика, предназначенная для пользователей, подключающихся из <Constant name="cloud" />.
10. Добавьте новое правило в список разрешённых и нажмите **Update Network Policy**.

### Использование SQL {#using-sql}

Для быстрого и автоматизированного создания сетевых правил в Snowflake с помощью SQL можно использовать следующие команды. Эти примеры SQL демонстрируют, как добавить сетевое правило и соответствующим образом обновить сетевую политику для <Constant name="cloud" />.

1. Создайте новое сетевое правило с помощью следующего SQL:
```sql

CREATE NETWORK RULE allow_dbt_cloud_access
  MODE = INGRESS
  TYPE = IPV4
  VALUE_LIST = ('<CIDR_RANGE>'); -- Замените '<CIDR_RANGE>' на фактический CIDR, предоставленный службой поддержки

```

2. Добавьте правило в сетевую политику с помощью следующего SQL:
```sql

ALTER NETWORK POLICY <network_policy_name>
  ADD ALLOWED_NETWORK_RULE_LIST =('allow_dbt_cloud_access');

```
