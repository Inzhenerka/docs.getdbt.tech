---
title: "Настройка Yellowbrick"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Yellowbrick в dbt."
id: "yellowbrick-setup"
meta:
  maintained_by: Сообщество
  authors: 'Команда InfoCapital'
  github_repo: 'InfoCapital-AU/dbt-yellowbrick'
  pypi_package: 'dbt-yellowbrick'
  min_core_version: 'v1.7.0'
  cloud_support: Не поддерживается
  min_supported_version: 'Yellowbrick 5.2'
  slack_channel_name: 'н/д'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Yellowbrick Data'
  config_page: '/reference/resource-configs/yellowbrick-configs'
---

:::info Плагин сообщества

Некоторые основные функции могут быть ограничены.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>

## Конфигурация профиля

Цели Yellowbrick должны быть настроены с использованием следующей конфигурации в вашем файле `profiles.yml`.

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: yellowbrick
      host: [hostname]
      user: [username]
      password: [password]
      port: [port]
      dbname: [database name]
      schema: [dbt schema]
      [role](#role): [опционально, установите роль, которую dbt предполагает при выполнении запросов]
      [sslmode](#sslmode): [опционально, установите sslmode, используемый для подключения к базе данных]
      [sslrootcert](#sslrootcert): [опционально, установите значение конфигурации sslrootcert на новый путь к файлу, чтобы настроить расположение файла, содержащего корневые сертификаты]
  
```

</File>

### Примечания по конфигурации

Этот адаптер основан на адаптере dbt-postgres, описанном здесь [Настройка профиля Postgres](/docs/core/connect-data-platform/postgres-setup)

#### role

Конфигурация `role` управляет ролью пользователя, которую dbt предполагает при открытии новых соединений с базой данных.

#### sslmode / sslrootcert

Параметры конфигурации ssl управляют тем, как dbt подключается к Yellowbrick с использованием SSL. Обратитесь к [документации Yellowbrick](https://docs.yellowbrick.com/5.2.27/client_tools/config_ssl_for_clients_intro.html) для получения подробной информации.