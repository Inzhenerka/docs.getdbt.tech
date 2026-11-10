---
title: "Настройка Salesforce Data 360"
description: "В этом руководстве описана настройка хранилища Salesforce Data 360 в dbt."
id: "salesforce-data-cloud-setup"
meta:
  maintained_by: dbt Labs
  authors: 'dbt v2 dbt maintainers'
  github_repo: 'dbt-labs/dbt'
  pypi_package: N/A
  min_core_version: N/A
  cloud_support: N/A
  min_supported_version: 'n/a'
  slack_channel_name: N/A
  slack_channel_link: N/A
  platform_name: 'Salesforce Data 360'
  config_page: '/reference/resource-configs/data-cloud-configs'
unlisted: true
availability: local_free
---

# Настройка Salesforce Data 360 <Lifecycle status="beta"/>

Адаптер `dbt-salesforce` доступен через CLI <Constant name="fusion_engine" />. Чтобы получить доступ к адаптеру, [установите <Constant name="fusion" />](/docs/local/install-dbt). В качестве интерфейса разработки рекомендуем использовать [расширение для VS Code](/docs/local/install-dbt?version=2). Поддержка в <Constant name="dbt_platform" /> появится в ближайшее время. 

import SalesforcePrereqs from '/snippets/_salesforce-data-cloud-prereqs.md';

<SalesforcePrereqs />

## Настройка <Constant name="fusion" />

Чтобы подключить dbt к Salesforce Data 360, настройте файл `profiles.yml`. Используйте следующую конфигурацию:

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: salesforce
      method: jwt_bearer
      client_id: [Consumer Key of your Data 360 app]
      private_key_path: [local file path of your server key]
      login_url: "https://login.salesforce.com"
      username: [username on the Data 360 Instance]
```
</File>


| Поле профиля | Обязательно | Описание | Пример |
| --- | --- | --- | --- |
| `method` | Да | Метод аутентификации. В настоящее время поддерживается только `jwt_bearer`. | `jwt_bearer` |
| `client_id` | Да | Значение `Consumer Key` из секретов подключенного приложения. |  |
| `private_key_path` | Да | Путь к файлу `server.key` на вашем компьютере. | `/Users/dbt_user/Documents/server.key` |
| `login_url` | Да | URL для входа в экземпляр Salesforce.  | [https://login.salesforce.com](https://login.salesforce.com/) |
| `username` | Да | Имя пользователя в экземпляре Data 360. | dbt_user@dbtlabs.com |


## Дополнительная информация

Информацию о настройках, специфичных для Salesforce, можно найти в [справочном руководстве по адаптеру Salesforce](/reference/resource-configs/data-cloud-configs).
