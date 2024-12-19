---
title: "О PrivateLink"
id: about-privatelink
description: "Настройка PrivateLink для AWS"
sidebar_label: "О PrivateLink"
---

import SetUpPages from '/snippets/_available-tiers-privatelink.md';
import PrivateLinkHostnameWarning from '/snippets/_privatelink-hostname-restriction.md';
import CloudProviders from '/snippets/_privatelink-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

PrivateLink обеспечивает частное соединение между любой средой dbt Cloud Multi-Tenant и вашей платформой данных, размещенной у облачного провайдера, такого как [AWS](https://aws.amazon.com/privatelink/) или [Azure](https://azure.microsoft.com/en-us/products/private-link), с использованием технологии PrivateLink этого провайдера. PrivateLink позволяет клиентам dbt Cloud соответствовать требованиям безопасности и соблюдения норм, так как обеспечивает соединение между dbt Cloud и вашей платформой данных без прохождения через общедоступный интернет. Эта функция поддерживается в большинстве регионов Северной Америки, Европы и Азии, но [свяжитесь с нами](https://www.getdbt.com/contact/), если у вас есть вопросы о доступности.

<CloudProviders type='платформа данных' />

### PrivateLink между регионами

dbt Labs имеет всемирную сеть региональных VPC. Эти VPC специально используются для размещения конечных точек VPC PrivateLink, которые подключены к средам экземпляров dbt Cloud. Для обеспечения безопасности доступ к этим конечным точкам защищен группами безопасности, сетевыми политиками и мерами по защите соединений приложений. Подключенные сервисы также проходят аутентификацию. В настоящее время у нас есть несколько клиентов, успешно подключающихся к своим конечным точкам PrivateLink в различных регионах AWS в dbt Cloud.

### Настройка PrivateLink

dbt Cloud поддерживает следующие платформы данных для использования с функцией PrivateLink. Инструкции по включению PrivateLink для различных провайдеров платформы данных уникальны. Следующие руководства проведут вас через необходимые шаги, включая работу с [поддержкой dbt](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support) для завершения соединения в частной сети dbt и настройку конечной точки в dbt Cloud.

- [Snowflake](/docs/cloud/secure/snowflake-privatelink)
- [Databricks](/docs/cloud/secure/databricks-privatelink)
- [Redshift](/docs/cloud/secure/redshift-privatelink)
- [Postgres](/docs/cloud/secure/postgres-privatelink)
- [VCS](/docs/cloud/secure/vcs-privatelink)

<PrivateLinkHostnameWarning features={'/snippets/_privatelink-hostname-restriction.md'}/>