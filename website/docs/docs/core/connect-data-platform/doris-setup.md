---
title: "Настройка Doris"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Doris в dbt."
id: "doris-setup"
meta:
  maintained_by: SelectDB
  authors: catpineapple,JNSimba
  github_repo: 'selectdb/dbt-doris'
  pypi_package: 'dbt-doris'
  min_core_version: 'v1.3.0'
  cloud_support: Не поддерживается
  slack_channel_name: '#db-doris'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Apache Doris / SelectDB'
  config_page: '/reference/resource-configs/doris-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Подключение к Doris/SelectDB с помощью **dbt-doris**

### Аутентификация по имени пользователя и паролю

Настройте свой профиль dbt для использования с Doris:

#### Профиль подключения Doris
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

#### Описание полей профиля

| Опция    | Описание                                                                                                                      | Обязательно? | Пример      |
|----------|-------------------------------------------------------------------------------------------------------------------------------|--------------|-------------|
| type     | Конкретный адаптер для использования                                                                                          | Обязательно   | `doris`     |
| host     | Имя хоста для подключения                                                                                                     | Обязательно   | `127.0.0.1` |
| port     | Порт для использования                                                                                                        | Обязательно   | `9030`      |
| schema   | Укажите схему (базу данных), в которую будут создаваться модели. В Doris нет схемы для создания коллекции таблиц или представлений, как в PostgreSQL | Обязательно   | `dbt`       |
| username | Имя пользователя для подключения к Doris                                                                                     | Обязательно   | `root`      |
| password | Пароль для аутентификации в Doris                                                                                            | Обязательно   | `password`  |

## Привилегии пользователя базы данных

Ваш пользователь базы данных Doris/SelectDB будет иметь возможность читать или записывать данные.
Вы можете найти дополнительную информацию [здесь](https://doris.apache.org/docs/admin-manual/privilege-ldap/user-privilege) о управлении привилегиями в Doris.

| Обязательная привилегия |
|-------------------------|
| Select_priv             |
| Load_priv               |
| Alter_priv              |
| Create_priv             |
| Drop_priv               |