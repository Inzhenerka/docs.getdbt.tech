---
title: "Настройка Greenplum"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Greenplum в dbt."
id: "greenplum-setup"
meta:
  maintained_by: Сообщество
  authors: 'Марка Порошина, Дмитрий Бевз'
  github_repo: 'markporoshin/dbt-greenplum'
  pypi_package: 'dbt-greenplum'
  min_core_version: 'v1.0.0'
  cloud_support: Не поддерживается
  min_supported_version: 'Greenplum 6.0'
  slack_channel_name: 'н/д'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Greenplum'
  config_page: '/reference/resource-configs/greenplum-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


Для получения дополнительной (и более актуальной) информации смотрите [README](https://github.com/markporoshin/dbt-greenplum#README.md)


## Конфигурация профиля

Цели Greenplum должны быть настроены с использованием следующей конфигурации в вашем файле `profiles.yml`.

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
      threads: [1 или более]
      keepalives_idle: 0 # по умолчанию 0, указывая на системный по умолчанию. См. ниже
      connect_timeout: 10 # по умолчанию 10 секунд
      search_path: [по желанию, переопределите значение по умолчанию для search_path postgres]
      role: [по желанию, установите роль, которую dbt предполагает при выполнении запросов]
      sslmode: [по желанию, установите sslmode, используемый для подключения к базе данных]

```

</File>

### Примечания

Этот адаптер сильно зависит от dbt-postgres, поэтому вы можете узнать больше о конфигурациях здесь [Настройка профиля](postgres-setup)