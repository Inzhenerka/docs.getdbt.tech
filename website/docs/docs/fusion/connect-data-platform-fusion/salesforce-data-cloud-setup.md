---
title: "Настройка Salesforce Data Cloud"
description: "Прочитайте это руководство, чтобы узнать о настройке Salesforce Data Cloud warehouse в dbt."
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

:::warning Предупреждение
Этот адаптер находится на стадии Alpha и не готов для использования в production. Его следует применять только в sandbox- или тестовых окружениях.

По мере дальнейшей разработки и с учётом вашей обратной связи поведение может меняться &mdash; команды, конфигурация и рабочие процессы могут быть обновлены или удалены в будущих релизах.
:::

Адаптер `dbt-salesforce` доступен через CLI <Constant name="fusion_engine" />. Чтобы получить доступ к адаптеру, [установите dbt Fusion](/docs/fusion/about-fusion-install). В качестве интерфейса для разработки рекомендуется использовать [расширение VS Code](/docs/fusion/install-dbt-extension). Поддержка <Constant name="dbt_platform" /> появится в ближайшее время.

## Предварительные требования {#prerequisites}

Перед тем как подключить dbt к Salesforce Data Cloud, вам потребуется следующее:

- Экземпляр Data Cloud
- [Внешнее клиентское приложение, через которое dbt подключается к Data Cloud](https://help.salesforce.com/s/articleView?id=xcloud.create_a_local_external_client_app.htm&type=5), с [настроенным OAuth](https://help.salesforce.com/s/articleView?id=xcloud.configure_external_client_app_oauth_settings.htm&type=5). OAuth scopes должны включать:
  - `api` — для управления пользовательскими данными через API.
  - `refresh_token`, `offline_access` — для выполнения запросов в любое время, даже когда пользователь не в сети или токены истекли.
  - `cdp_query_api` — для выполнения ANSI SQL‑запросов к данным Data Cloud.
- [Приватный ключ и файл `server.key`](https://developer.salesforce.com/docs/atlas.en-us.252.0.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_key_and_cert.htm)
- Пользователь с разрешением `Data Cloud Admin`

## Конфигурация Fusion {#configure-fusion}

Чтобы подключить dbt к Salesforce Data Cloud, настройте файл `profiles.yml`. Используйте следующую конфигурацию:

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
      username: [username on the Data Cloud Instance]
```
</File>

| Поле профиля | Обязательно | Описание | Пример |
| --- | --- | --- | --- |
| `method` | Yes | Метод аутентификации. В настоящее время поддерживается только `jwt_bearer`. | `jwt_bearer` |
| `client_id` | Yes | Значение `Consumer Key` из настроек вашего connected app. |  |
| `private_key_path` | Yes | Путь к файлу `server.key` на вашем компьютере. | `/Users/dbt_user/Documents/server.key` |
| `login_url` | Yes | URL для входа в экземпляр Salesforce. | [https://login.salesforce.com](https://login.salesforce.com/) |
| `username` | Yes | Имя пользователя в экземпляре Data Cloud. | dbt_user@dbtlabs.com |

<!--Для username в примере выше указано [Data cloud instance], но здесь в примере используется email-->

## Больше информации {#more-information}

Дополнительную информацию о конфигурации, специфичной для Salesforce, см. в [справочнике по настройкам адаптера Salesforce](/reference/resource-configs/data-cloud-configs).
