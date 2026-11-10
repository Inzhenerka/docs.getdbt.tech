---
title: "О частных подключениях"
id: private-connectivity
description: "Настройка частных подключений."
sidebar_label: "О частных подключениях"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';
import PrivateLinkHostnameWarning from '/snippets/_private-connection-hostname-restriction.md';

<SetUpPages />

Частные подключения обеспечивают безопасную связь между любой средой <Constant name="dbt" /> и вашей платформой данных, размещенной у облачного провайдера, например [AWS](https://aws.amazon.com/privatelink/), [Azure](https://azure.microsoft.com/en-us/products/private-link) или [GCP](https://cloud.google.com/vpc/docs/private-service-connect), с использованием технологии частных подключений этого провайдера. Частные подключения позволяют клиентам <Constant name="dbt" /> выполнять требования безопасности и соответствия нормативным требованиям, обеспечивая связь между <Constant name="dbt" /> и вашей платформой данных без передачи трафика через общедоступный интернет. Эта функция поддерживается в большинстве регионов Северной Америки, Европы и Азии. Если у вас есть вопросы о доступности, [свяжитесь с нами](https://www.getdbt.com/contact/).

<CloudProviders type='Snowflake'/>

## Настройка частной конечной точки


<PrivateLinkHostnameWarning />


## Доступные платформы

Выберите свою облачную платформу, чтобы ознакомиться с вариантами частных подключений, матрицей поддержки и руководствами по настройке.

<div className="grid--3-col">

<Card
    title="AWS"
    body="Amazon Web Services PrivateLink"
    link="/docs/platform/secure/private-connectivity/aws/aws-overview"
    icon="dbt-bit"
/>

<Card
    title="Azure"
    body="Microsoft Azure Private Link"
    link="/docs/platform/secure/private-connectivity/azure/azure-overview"
    icon="dbt-bit"
/>

<Card
    title="GCP"
    body="Google Cloud Platform Private Service Connect"
    link="/docs/platform/secure/private-connectivity/gcp/gcp-overview"
    icon="dbt-bit"
/>

</div>
