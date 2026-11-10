---
title: "Настройка BigQuery и GCP Private Service Connect"
id: gcp-bigquery
description: "Настройка GCP Private Service Connect для BigQuery."
sidebar_label: "BigQuery"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Настройка Private Service Connect для BigQuery

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages />

Следующие шаги помогут вам настроить конечную точку [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect) (PSC) для GCP BigQuery в многопользовательской среде <Constant name="dbt" />.

<CloudProviders type='BigQuery' />

## Включение GCP Private Service Connect для dbt

Чтобы dbt мог устанавливать частное подключение к вашему проекту BigQuery через PSC, необходимо включить региональную конечную точку PSC для вашей учетной записи dbt. Отправьте запрос в [службу поддержки dbt](mailto:support@getdbt.com), используя следующий шаблон:

<Expandable alt_header="Шаблон письма для обращения в службу поддержки" is_open={true}>

```text
Subject: New Multi-Tenant GCP PSC Request

- Type: BigQuery
- dbt platform account URL:
- BigQuery project region:
- dbt GCP multi-tenant environment:
```

</Expandable>

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## (Необязательно) Создание учетных данных BigQuery
Возможно, у вас уже настроены учетные данные для ваших наборов данных. Если нет, вы можете выполнить шаги из нашего [руководства по быстрому началу работы с BigQuery](/guides/bigquery?step=4), чтобы создать учетные данные. 

## Создание подключения в dbt

После того как служба поддержки dbt завершит настройку, вы сможете создавать новые подключения с использованием PSC: 

<PrivateLinkCreateConnection
  platform="BigQuery"
/>
