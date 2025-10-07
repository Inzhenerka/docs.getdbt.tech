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

Set up your profiles.yml in order for dbt to connect to Salesforce Data Cloud. Prior to setting up the Data Cloud profiles.yml, you will need:

- A Data Cloud instance with an Connected app configurated for dbt
- server.key file downloaded 
- User with `Data Cloud admin` permission set

For more information on how to create a Connected App, follow the [Set up your Salesforce environment directions](https://developer.salesforce.com/blogs/2024/11/how-to-use-the-python-connector-for-data-cloud). You can stop when you come across the `Set up your Python Environment` instructions (after you copy the Consumer Key).


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
| client_id | Yes | This is the consumer_key from your Connected App Secrets |  |
| private_key_path | Yes | File Path of Server Key file | /Users/dbt_user/Documents/server.key |
| login_url | Yes | Login Url of Salesforce Instance  | [https://login.salesforce.com](https://login.salesforce.com/) |
| username | Yes |  | dbt_user@dbtlabs.com |


