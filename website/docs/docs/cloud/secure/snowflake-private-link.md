---
title: "Configuring Snowflake and Azure Private Link"
id: snowflake-private-link
description: "Configuring Azure Private Link for Snowflake"
sidebar_label: "Azure Private Link for Snowflake"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

The following steps walk you through the setup of an Azure-hosted Snowflake Private Link endpoint in a dbt Cloud multi-tenant environment.

<CloudProviders type='Snowflake' />

:::note Snowflake SSO with Private Link
Users connecting to Snowflake using SSO over an Azure Private Link connection from dbt Cloud will also require access to a Private Link endpoint from their local workstation.

>Currently, for any given Snowflake account, SSO works with only one account URL at a time: either the public account URL or the URL associated with the private connectivity service.

- [Snowflake SSO with Private Connectivity](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-overview#label-sso-private-connectivity)
:::
