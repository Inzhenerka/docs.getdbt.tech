---
title: "О приватном подключении"
id: about-private-connectivity
description: "Настройка приватных подключений"
sidebar_label: "О приватном подключении"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import PrivateLinkHostnameWarning from '/snippets/_private-connection-hostname-restriction.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';
import PrivateConnectivityMatrix from '/snippets/_private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Приватные подключения обеспечивают безопасную коммуникацию из любой среды <Constant name="cloud" /> к вашей платформе данных, размещённой у облачного провайдера, например [AWS](https://aws.amazon.com/privatelink/) или [Azure](https://azure.microsoft.com/en-us/products/private-link), с использованием технологии приватных подключений этого провайдера. Приватные подключения позволяют клиентам <Constant name="cloud" /> соответствовать требованиям безопасности и комплаенса, поскольку обеспечивают связь между <Constant name="cloud" /> и вашей платформой данных без прохождения через публичный интернет. Эта функция поддерживается в большинстве регионов Северной Америки, Европы и Азии, однако, если у вас есть вопросы о доступности, [свяжитесь с нами](https://www.getdbt.com/contact/).

<CloudProviders type='a data platform' />

<PrivateConnectivityMatrix/>

### Кросс-региональные приватные подключения {#cross-region-private-connections}

dbt Labs использует глобально связанные приватные сети, специально предназначенные для размещения приватных эндпоинтов, которые подключены к средам экземпляров <Constant name="cloud" />. Такая связность позволяет средам <Constant name="cloud" /> подключаться к любому поддерживаемому региону из любого экземпляра <Constant name="cloud" /> в рамках сети одного и того же облачного провайдера. Для обеспечения безопасности доступ к этим эндпоинтам защищён с помощью security groups, сетевых политик и механизмов защиты соединений на уровне приложения, в дополнение к механизмам аутентификации и авторизации, предоставляемым каждой из подключённых платформ.

### Настройка приватных подключений {#configuring-private-connections}

<Constant name="cloud" /> поддерживает следующие платформы данных для использования с функцией приватных подключений. Инструкции по включению приватных подключений для различных провайдеров платформ данных отличаются. Следующие руководства проведут вас через необходимые шаги, включая взаимодействие с [поддержкой dbt](/community/resources/getting-help#dbt-cloud-support) для завершения подключения в приватной сети dbt и настройку эндпоинта в <Constant name="cloud" />.

#### AWS {#aws}
- [Snowflake](/docs/cloud/secure/snowflake-privatelink)
- [Databricks](/docs/cloud/secure/databricks-privatelink)
- [Redshift](/docs/cloud/secure/redshift-privatelink)
- [Postgres](/docs/cloud/secure/postgres-privatelink)
- [VCS](/docs/cloud/secure/vcs-privatelink)

#### Azure {#azure}
- [Snowflake](/docs/cloud/secure/snowflake-private-link)
- [Databricks](/docs/cloud/secure/databricks-private-link)
- [Database for Postgres Flexible Server](/docs/cloud/secure/az-postgres-private-link)
- [Synapse](/docs/cloud/secure/az-synapse-private-link)

#### GCP {#gcp}
- [Snowflake](/docs/cloud/secure/snowflake-psc)
- [BigQuery](/docs/cloud/secure/bigquery-psc)

<PrivateLinkHostnameWarning features={'/snippets/_private-connection-hostname-restriction.md'}/>
