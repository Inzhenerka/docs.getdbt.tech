---
title: "Настройка Doris"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Doris в dbt."
id: "doris-setup"
meta:
  maintained_by: SelectDB
  authors: catpineapple,JNSimba
  github_repo: 'selectdb/dbt-doris'
  pypi_package: 'dbt-doris'
  min_core_version: 'v1.3.0'
  cloud_support: Not Supported
  slack_channel_name: '#db-doris'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Apache Doris / SelectDB'
  config_page: '/reference/resource-configs/doris-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Doris/SelectDB с помощью **dbt-doris** {#connecting-to-dorisselectdb-with-dbt-doris}

### Аутентификация с использованием имени пользователя и пароля {#user-password-authentication}

Настройте ваш профиль dbt для использования Doris:

#### Профиль подключения к Doris {#doris-connection-profile}
<File name='profiles.yml'>

```yaml
dbt-doris:
  target: dev
  outputs:
    dev:
      type: doris
      host: 127.0.0.1
      port: 9030
      schema: database_name
      username: username
      password: password

```

</File>

#### Описание полей профиля {#description-of-profile-fields}

| Опция    | Описание                                                                                                                          | Обязательно? | Пример      |
|----------|-----------------------------------------------------------------------------------------------------------------------------------|-------------|-------------|
| type     | Конкретный адаптер для использования                                                                                               | Обязательно | `doris`     |
| host     | Имя хоста для подключения                                                                                                         | Обязательно | `127.0.0.1` |
| port     | Порт для использования                                                                                                            | Обязательно | `9030`      |
| schema   | Укажите схему (базу данных) для построения моделей, в Doris нет схем для создания коллекции таблиц или представлений, как в PostgreSql | Обязательно | `dbt`       |
| username | Имя пользователя для подключения к Doris                                                                                          | Обязательно | `root`      |
| password | Пароль для аутентификации в Doris                                                                                                 | Обязательно | `password`  |

## Привилегии пользователя базы данных {#database-user-privileges}

Ваш пользователь базы данных Doris/SelectDB должен иметь некоторые возможности для чтения или записи.
Вы можете найти помощь [здесь](https://doris.apache.org/docs/admin-manual/privilege-ldap/user-privilege) с управлением привилегиями в Doris.

| Необходимая привилегия |
|------------------------|
| Select_priv            |
| Load_priv              |
| Alter_priv             |
| Create_priv            |
| Drop_priv              |
