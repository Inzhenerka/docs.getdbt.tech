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

⚠️ Disclaimer: This adapter is in the Alpha product stage and thus is not production-ready. It should only be used in sandbox or test environments. 
As we continue to develop and take in your feedback, the experience is subject to change — commands, configuration, and workflows may be updated or removed in future releases. 


## Installing dbt-salesforce
This adapter is available via dbt Fusion CLI. In order to access the adapter, install dbt Fusion and the adapter will be available for usage. We recommend using the VS Code Extension as the development interface. dbt Platform support coming soon. 


## Profile Configuration

Salesforce Data Cloud targets should be set up using the following configuration in your `profiles.yml` file. Prior to setting up the Data Cloud profiles.yml, you will need:

- A Data Cloud instance with an connected app configurated for dbt
- User with `Data Cloud admin` permission set



<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: salesforce
      method: jwt_bearer
      client_id: [client id of your Data Cloud app]
      private_key_path: [local file path of your server key]
      login_url: "https://login.salesforce.com"
      username: [Data Cloud instance]
```
| Profile Field | Required | Description | Examples |
| --- | --- | --- | --- |
| method | Yes | Authentication Method. Currently only jwt_bearer supported | jwt_bearer |
| client_id | Yes | Client ID of the connected app |  |
| private_key_path | Yes | File Path of Server Key file | /Users/dbt_user/Documents/server.key |
| login_url | Yes | Login Url of Salesforce Instance  | [https://login.salesforce.com](https://login.salesforce.com/) |
| username | Yes |  | dbt_user@dbtlabs.com |


