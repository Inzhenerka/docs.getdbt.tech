---
title: "Настройка iomete"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища iomete в dbt."
id: "iomete-setup"
meta:
  maintained_by: iomete
  authors: 'Namig Aliyev'
  github_repo: 'iomete/dbt-iomete'
  pypi_package: 'dbt-iomete'
  min_core_version: 'v0.18.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '##db-iomete'
  slack_channel_link: 'https://getdbt.slack.com/archives/C03JFG22EP9'
  platform_name: 'iomete'
  config_page: '/reference/resource-configs/no-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />



Настройка цели iomete

Цели iomete должны быть настроены с использованием следующей конфигурации в вашем файле profiles.yml.

<File name='profiles.yml'>

```yaml
iomete:
  target: dev
  outputs:
    dev:
      type: iomete
      cluster: cluster_name
      host: <region_name>.iomete.com
      port: 443
      schema: database_name
      account_number: iomete_account_number
      user: iomete_user_name
      password: iomete_user_password
```

</File>

##### Описание полей профиля

| Поле          | Описание                                                                                                                             | Обязательно | Пример                |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------|-------------|-----------------------|
| type          | Конкретный адаптер для использования                                                                                                  | Обязательно | `iomete`              |
| cluster       | Кластер для подключения                                                                                                               | Обязательно | `reporting`           |
| host          | Имя хоста подключения. Это комбинация <br/>`account_number` с префиксом `dwh-` <br/>и суффиксом `.iomete.com`.                        | Обязательно | `dwh-12345.iomete.com`|
| port          | Порт для использования.                                                                                                               | Обязательно | `443`                 |
| schema        | Укажите схему (базу данных), в которую будут строиться модели.                                                                        | Обязательно | `dbt_finance`         |
| account_number| Номер аккаунта iomete в одинарных кавычках.                                                                                           | Обязательно | `'1234566789123'`     |
| username      | Имя пользователя iomete для подключения к серверу.                                                                                    | Обязательно | `dbt_user`            |
| password      | Пароль пользователя iomete для подключения к серверу.                                                                                 | Обязательно | `strong_password`     |

## Поддерживаемая функциональность

Поддерживается большая часть функциональности <Constant name="core" />.

Улучшения, специфичные для Iceberg.
1. Объединение результатов `show tables` и `show views`.