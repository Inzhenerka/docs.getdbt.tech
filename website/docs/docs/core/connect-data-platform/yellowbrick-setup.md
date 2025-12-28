---
title: "Настройка Yellowbrick"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Yellowbrick в dbt."
id: "yellowbrick-setup"
meta:
  maintained_by: Community
  authors: 'InfoCapital team'
  github_repo: 'InfoCapital-AU/dbt-yellowbrick'
  pypi_package: 'dbt-yellowbrick'
  min_core_version: 'v1.7.0'
  cloud_support: Not Supported
  min_supported_version: 'Yellowbrick 5.2'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Yellowbrick Data'
  config_page: '/reference/resource-configs/yellowbrick-configs'
---

:::info Плагин сообщества

Некоторая основная функциональность может быть ограничена.

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
      [role](#role): [опционально, задает роль, которую dbt принимает при выполнении запросов]
      [sslmode](#sslmode): [опционально, задает sslmode, используемый для подключения к базе данных]
      [sslrootcert](#sslrootcert): [опционально, задает значение конфигурации sslrootcert на новый путь к файлу для настройки местоположения файла, содержащего корневые сертификаты]
  
```

</File>

### Примечания к конфигурации

Этот адаптер основан на адаптере dbt-postgres, документированном здесь [Настройка профиля Postgres](/docs/core/connect-data-platform/postgres-setup)

#### роль

Конфигурация `role` управляет ролью пользователя, которую dbt принимает при открытии новых подключений к базе данных.
  
#### sslmode / sslrootcert

Параметры конфигурации ssl управляют тем, как dbt подключается к Yellowbrick с использованием SSL. Обратитесь к [документации Yellowbrick](https://docs.yellowbrick.com/5.2.27/client_tools/config_ssl_for_clients_intro.html) для получения подробностей.
