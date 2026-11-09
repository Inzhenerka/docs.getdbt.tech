---
title: "Подключение Greenplum к dbt v1"
sidebar_label: "Greenplum"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища данных Greenplum в dbt."
id: "greenplum-setup"
meta:
  maintained_by: Community
  authors: 'Mark Poroshin, Dmitry Bevz'
  github_repo: 'markporoshin/dbt-greenplum'
  pypi_package: 'dbt-greenplum'
  min_core_version: 'v1.0.0'
  cloud_support: Not Supported
  min_supported_version: 'Greenplum 6.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Greenplum'
  config_page: '/reference/resource-configs/greenplum-configs'
availability: local_free
---


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

Для получения дополнительной (и, скорее всего, более актуальной) информации, смотрите [README](https://github.com/markporoshin/dbt-greenplum#README.md)

## Конфигурация профиля {#profile-configuration}

Цели для Greenplum должны быть настроены с использованием следующей конфигурации в вашем файле `profiles.yml`.

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: greenplum
      host: [hostname]
      user: [username]
      password: [password]
      port: [port]
      dbname: [database name]
      schema: [dbt schema]
      threads: [1 or more]
      keepalives_idle: 0 # по умолчанию 0, что указывает на системное значение по умолчанию. См. ниже
      connect_timeout: 10 # по умолчанию 10 секунд
      search_path: [optional, override the default postgres search_path]
      role: [optional, set the role dbt assumes when executing queries]
      sslmode: [optional, set the sslmode used to connect to the database]

```

</File>

### Примечания {#notes}

Этот адаптер в значительной степени зависит от dbt-postgres, поэтому подробнее о настройках можно прочитать в разделе [Настройка профиля](/docs/local/connect-data-platform/postgres-setup)
