---
title: "About private connectivity"
id: about-private-connectivity
description: "Configuring private connections"
sidebar_label: "About private connectivity"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import PrivateLinkHostnameWarning from '/snippets/_private-connection-hostname-restriction.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';
import PrivateConnectivityMatrix from '/snippets/_private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Private connections enables secure communication from any dbt Cloud environment to your data platform hosted on a cloud provider, such as [AWS](https://aws.amazon.com/privatelink/) or [Azure](https://azure.microsoft.com/en-us/products/private-link), using that provider’s private connection technology. Private connections allow dbt Cloud customers to meet security and compliance controls as it allows connectivity between dbt Cloud and your data platform without traversing the public internet. This feature is supported in most regions across North America, Europe, and Asia, but [contact us](https://www.getdbt.com/contact/) if you have questions about availability.

<CloudProviders type='a data platform' />

### Cross-region private connections

dbt Labs has a worldwide network of regional VPCs. These VPCs are specifically used to host VPC endpoints, which are connected to dbt Cloud instance environments. To ensure security, access to these endpoints is protected by security groups, network policies, and application connection safeguards. The connected services are also authenticated. Currently, we have multiple customers successfully connecting to their private endpoints in different regions within dbt Cloud.

### Configuring private connections

dbt Cloud supports the following data platforms for use with the private connections feature. Instructions for enabling private connections for the various data platform providers are unique. The following guides will walk you through the necessary steps, including working with [dbt Support](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support) to complete the connection in the dbt private network and setting up the endpoint in dbt Cloud.

- [Snowflake AWS PrivateLink](/docs/cloud/secure/snowflake-privatelink)
- [Snowflake Azure Private Link](/docs/cloud/secure/snowflake-private-link)
- [Databricks AWS PrivateLink](/docs/cloud/secure/databricks-privatelink)
- [Databricks Azure Private Link](/docs/cloud/secure/databricks-private-link)
- [Redshift AWS PrivateLink](/docs/cloud/secure/redshift-privatelink)
- [Postgres AWS PrivateLink](/docs/cloud/secure/postgres-privatelink)
- [VCS](/docs/cloud/secure/vcs-privatelink)

<PrivateLinkHostnameWarning features={'/snippets/_private-connection-hostname-restriction.md'}/>

<PrivateConnectivityMatrix/>
