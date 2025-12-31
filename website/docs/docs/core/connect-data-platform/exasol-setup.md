---
title: "Настройка Exasol"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Exasol в dbt."
meta:
  maintained_by: Community
  authors: 'Torsten Glunde, Ilija Kutle'
  github_repo: 'tglunde/dbt-exasol'
  pypi_package: 'dbt-exasol'
  min_core_version: 'v0.14.0'
  cloud_support: Не поддерживается
  min_supported_version: 'Exasol 6.x'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Exasol'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Плагин сообщества

Некоторая основная функциональность может быть ограничена. Если вы заинтересованы в участии, ознакомьтесь с исходным кодом для каждого из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

### Подключение к Exasol с помощью **dbt-exasol** {#connecting-to-exasol-with-dbt-exasol}

#### Аутентификация с использованием пользователя / пароля {#user-password-authentication}

Настройте ваш профиль dbt для использования Exasol:

##### Информация о подключении к Exasol {#exasol-connection-information}

<File name='profiles.yml'>

```yaml
dbt-exasol:
  target: dev
  outputs:
    dev:
      type: exasol
      threads: 1
      dsn: HOST:PORT
      user: USERNAME
      password: PASSWORD
      dbname: db
      schema: SCHEMA
```
</File>

#### Необязательные параметры {#optional-parameters}

- **`connection_timeout`** &mdash; по умолчанию используется значение по умолчанию pyexasol
- **`socket_timeout`** &mdash; по умолчанию используется значение по умолчанию pyexasol
- **`query_timeout`** &mdash; по умолчанию используется значение по умолчанию pyexasol
- **`compression`** &mdash; по умолчанию: False
- **`encryption`** &mdash; по умолчанию: False
- **`protocol_version`** &mdash; по умолчанию: v3
- **`row_separator`** &mdash; по умолчанию: CRLF для Windows - LF в противном случае
- **`timestamp_format`** &mdash; по умолчанию: `YYYY-MM-DDTHH:MI:SS.FF6`
