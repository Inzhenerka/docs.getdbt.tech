---
title: "Salesforce Data Cloud setup"
description: "Read this guide to learn about the Salesforce Data Cloud warehouse setup in dbt."
id: "salesforce-data-cloud-setup"
meta:
  maintained_by: dbt Labs
  authors: 'Fusion dbt maintainers'
  github_repo: 'dbt-labs/dbt-fusion'
  pypi_package: N/A
  min_core_version: N/A
  cloud_support: N/A
  min_supported_version: 'n/a'
  slack_channel_name: N/A
  slack_channel_link: N/A
  platform_name: 'Salesforec Data Cloud'
  config_page: '/reference/resource-configs/data-cloud-configs'
---

:::warning Disclaimer
This adapter is in the Alpha product stage and is not production-ready. It should only be used in sandbox or test environments. 

As we continue to develop and take in your feedback, the experience is subject to change &mdash; commands, configuration, and workflows may be updated or removed in future releases. 
:::

This `dbt-salesforce` adapter is available via CLI in the <Constant name="fusion_engine" />. To access the adapter, [install dbt Fusion](/docs/fusion/about-fusion-install). We recommend using the [VS Code Extension](/docs/fusion/install-dbt-extension) as the development interface. <Constant name="dbt_platform" /> support coming soon. 

## Prerequisites

Before you can connect dbt to the Salesforce Data Cloud, you need the following:

- A Data Cloud instance with a connected app configured for dbt
  - For steps how to create a connected app, refer to [Set up your Salesforce environment directions](https://developer.salesforce.com/blogs/2024/11/how-to-use-the-python-connector-for-data-cloud). Follow the instructions until **Step 2: Retrieve the Consumer Key and Secret** under **Set up your Python Environment**. <!--how to create a Data Cloud instance?-->
- `server.key` file <!--where to download this file?-->
- User with `Data Cloud admin` permission set

## Configure Fusion

To connect dbt to Salesforce Data Cloud, set up your `profiles.yml`. Refer to the following configuration:

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: salesforce
      method: jwt_bearer
      client_id: [Consumer Key of your Data Cloud app]
      private_key_path: [local file path of your server key]
      login_url: "https://login.salesforce.com"
      username: [Data Cloud instance]
```
</File>


| Profile field | Required | Description | Examples |
| --- | --- | --- | --- |
| `method` | Yes | Authentication Method. Currently, only `jwt_bearer` supported. | jwt_bearer |
| `client_id` | Yes | This is the `Consumer Key` from your connected app secrets. |  |
| `private_key_path` | Yes | File path of the `server.key` file in your computer. | /Users/dbt_user/Documents/server.key |
| `login_url` | Yes | Login URL of the Salesforce instance.  | [https://login.salesforce.com](https://login.salesforce.com/) |
| `username` | Yes |  | dbt_user@dbtlabs.com |

<!--For username, the sample above says [Data cloud instance] but the sample here is an email-->

## More information

Find Salesforce-specific configuration information in the [Salesforce adapter reference guide](/reference/resource-configs/data-cloud-configs).