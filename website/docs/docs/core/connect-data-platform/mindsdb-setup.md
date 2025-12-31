---
title: "Настройка MindsDB"
id: "mindsdb-setup"
meta:
  maintained_by: MindsDB
  authors: 'MindsDB team'
  github_repo: 'mindsdb/dbt-mindsdb'
  pypi_package: 'dbt-mindsdb'
  min_core_version: 'v1.0.1'
  cloud_support: Не поддерживается
  min_supported_version: '?'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'MindsDB'
  config_page: '/reference/resource-configs/mindsdb-configs'
---

:::info Плагин, поддерживаемый поставщиком

Пакет dbt-mindsdb позволяет dbt подключаться к [MindsDB](https://github.com/mindsdb/mindsdb).

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Конфигурации {#configurations}

Базовый `profile.yml` для подключения к MindsDB:

```yml
mindsdb:
  outputs:
    dev:
      database: 'mindsdb'
      host: '127.0.0.1'
      password: ''
      port: 47335
      schema: 'mindsdb'
      type: mindsdb
      username: 'mindsdb'
  target: dev

```
| Ключ     | Обязательный | Описание                                           | Пример                         |
| -------- | ------------ | -------------------------------------------------- | ------------------------------ |
| type     |    ✔️       | Конкретный адаптер для использования               | `mindsdb`                      |
| host     |    ✔️       | MindsDB (имя хоста) для подключения                | `cloud.mindsdb.com`            |
| port     |    ✔️       | Порт для использования                             | `3306`  или `47335`            |
| schema   |    ✔️       | Укажите схему (базу данных) для построения моделей | Источник данных MindsDB        |
| username |    ✔️       | Имя пользователя для подключения к серверу         | `mindsdb` или пользователь mindsdb cloud |
| password |    ✔️       | Пароль для аутентификации на сервере               | `pass`                         |
