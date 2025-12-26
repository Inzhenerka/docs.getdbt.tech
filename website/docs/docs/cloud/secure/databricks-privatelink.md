---
title: "Настройка Databricks и AWS PrivateLink"
id: databricks-privatelink
description: "Настройка AWS PrivateLink для Databricks"
sidebar_label: "AWS PrivateLink для Databricks"
pagination_next: null
---

# Configuring Databricks PrivateLink <Lifecycle status="managed_plus" />

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Следующие шаги проведут вас через настройку конечной точки Databricks AWS PrivateLink в многопользовательской среде <Constant name="cloud" />.

<CloudProviders type='Databricks'/>

## Настройка AWS PrivateLink

1. Найдите ваше [имя экземпляра Databricks](https://docs.databricks.com/en/workspace/workspace-details.html#workspace-instance-names-urls-and-ids)
    - Пример: `cust-success.cloud.databricks.com`

1. Добавьте необходимую информацию в следующий шаблон и отправьте ваш запрос на AWS PrivateLink в [dbt Support](/docs/dbt-support#dbt-cloud-support):  
    ```
    Subject: New AWS Multi-Tenant PrivateLink Request
    - Type: Databricks
    - Databricks instance name:
    - Databricks cluster AWS Region (for example, us-east-1, eu-west-2):
    - dbt AWS multi-tenant environment (US, EMEA, AU):
    ```
    <PrivateLinkSLA />

1. После того как служба поддержки <Constant name="cloud" /> уведомит вас о завершении настройки, [зарегистрируйте VPC endpoint в Databricks](https://docs.databricks.com/administration-guide/cloud-configurations/aws/privatelink.html#step-3-register-privatelink-objects-and-attach-them-to-a-workspace) и подключите его к workspace:
    - [Register your VPC endpoint](https://docs.databricks.com/en/security/network/classic/vpc-endpoints.html) &mdash; Зарегистрируйте VPC endpoint, используя VPC endpoint ID, предоставленный службой поддержки dbt.
    - [Create a Private Access Settings object](https://docs.databricks.com/en/security/network/classic/private-access-settings.html) &mdash; Создайте объект Private Access Settings (PAS) с нужными вам настройками публичного доступа и установите Private Access Level в значение **Endpoint**. Выберите зарегистрированный endpoint, созданный на предыдущем шаге.
    - [Create or update your workspace](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both) &mdash; Создайте workspace или обновите существующий. В разделе **Advanced configurations → Private Link** выберите объект Private Access Settings, созданный на предыдущем шаге.

    :::warning
    Если вы используете существующую рабочую область Databricks, все рабочие нагрузки в этой области должны быть остановлены для включения Private Link. Рабочие нагрузки также не могут быть запущены в течение 20 минут после внесения изменений. Из [документации Databricks](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both):

    "После создания (или обновления) рабочей области подождите, пока она не станет доступной для использования или создания кластеров. Статус рабочей области остается RUNNING, и изменение VPC происходит немедленно. Однако вы не можете использовать или создавать кластеры в течение следующих 20 минут. Если вы создаете или используете кластеры до истечения этого временного интервала, кластеры не запускаются успешно, могут завершиться с ошибкой или вызвать другие неожиданные поведения."

    :::

## Создание подключения в dbt

После того как вы завершили настройку в окружении Databricks, вы сможете сконфигурировать приватный endpoint в <Constant name="cloud" />:

1. Перейдите в **Settings** → **Create new project** → выберите **Databricks**.  
2. Вы увидите два переключателя: **Public** и **Private**. Выберите **Private**.  
3. Выберите приватный endpoint из выпадающего списка (поле hostname/account будет заполнено автоматически).  
4. Настройте остальные параметры платформы данных.  
5. Проверьте подключение и сохраните его.
