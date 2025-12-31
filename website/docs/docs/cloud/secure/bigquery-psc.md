---
title: "Настройка BigQuery и GCP Private Service Connect"
id: bigquery-psc
description: "Настройка GCP Private Service Connect для BigQuery"
sidebar_label: "GCP Private Service Connect для BigQuery"
---

# Настройка BigQuery Private Service Connect <Lifecycle status="managed_plus" /> {#configuring-bigquery-private-service-connect}

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages />

Следующие шаги проведут вас через процесс настройки эндпоинта GCP BigQuery [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect) (PSC) в мультиарендной среде <Constant name="cloud" />.

<CloudProviders type='BigQuery' />

## Включение dbt для GCP Private Service Connect {#enabling-dbt-for-gcp-private-service-connect}

Чтобы dbt мог приватно подключаться к вашему проекту BigQuery через PSC, для вашей учетной записи dbt необходимо включить региональный PSC-эндпоинт. Используя следующий шаблон, отправьте запрос в [службу поддержки dbt](/docs/dbt-support#dbt-cloud-support):

```
Subject: New Multi-Tenant GCP PSC Request
- Type: BigQuery
- BigQuery project region: 
- dbt GCP multi-tenant environment:
```

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## (Необязательно) Создание учетных данных BigQuery {#optional-generate-bigquery-credentials}
Возможно, у вас уже настроены учетные данные для ваших датасетов. Если нет, вы можете следовать шагам из нашего [руководства по быстрому старту BigQuery](/guides/bigquery?step=4), чтобы создать учетные данные.

## Создание подключения в dbt {#create-the-connection-in-dbt}

После того как команда поддержки dbt завершит настройку, вы сможете начать создавать новые подключения с использованием PSC:

1. Перейдите в **Account settings** > **Connections**.
2. На странице **Connections** выберите **BigQuery** и нажмите **Edit**.
3. Вы увидите две радиокнопки: **Default Endpoint** и **PrivateLink Endpoint**. Выберите **PrivateLink Endpoint**.
4. Выберите приватный эндпоинт из выпадающего списка (поле API endpoint будет заполнено автоматически).
5. Введите остальные данные платформы, включая учетные данные BigQuery, которые вы могли создать на предыдущих шагах.
6. Сохраните подключение и протестируйте его в задаче проекта или сессии Studio.
