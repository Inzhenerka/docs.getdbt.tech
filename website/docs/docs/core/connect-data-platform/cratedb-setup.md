---
title: "Настройка CrateDB"
description: "Прочтите это руководство, чтобы узнать о настройке платформы данных CrateDB в dbt."
id: "cratedb-setup"
meta:
  maintained_by: Crate.io, Inc.
  authors: 'CrateDB maintainers'
  github_repo: 'crate/dbt-cratedb2'
  pypi_package: 'dbt-cratedb2'
  min_core_version: 'v1.0.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: 'Community Forum'
  slack_channel_link: 'https://community.cratedb.com/'
  platform_name: 'CrateDB'
  config_page: '/reference/resource-configs/no-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>

[CrateDB] совместим с PostgreSQL, поэтому его адаптер dbt сильно зависит от
dbt-postgres, который документирован в [настройке профиля PostgreSQL].

Цели CrateDB настраиваются точно так же, см. также [конфигурацию PostgreSQL], с учетом лишь нескольких особенностей, характерных для CrateDB. Соответствующие детали изложены в [использовании dbt с CrateDB],
где также представлена актуальная информация.

## Конфигурация профиля {#profile-configuration}

Цели CrateDB должны быть настроены с использованием такой минимальной конфигурации
настроек в вашем файле [`profiles.yml`].

<File name='~/.dbt/profiles.yml'>

```yaml
cratedb_analytics:
  target: dev
  outputs:
    dev:
      type: cratedb
      host: [clustername].aks1.westeurope.azure.cratedb.net
      port: 5432
      user: [username]
      pass: [password]
      dbname: crate         # Не изменяйте это значение. Единственный каталог CrateDB — `crate`.
      schema: doc           # Определите имя схемы. Схема по умолчанию в CrateDB — `doc`.
```

</File>

[CrateDB]: https://cratedb.com/database
[конфигурация PostgreSQL]: https://docs.getdbt.tech/reference/resource-configs/postgres-configs
[настройка профиля PostgreSQL]: https://docs.getdbt.tech/docs/core/connect-data-platform/postgres-setup
[`profiles.yml`]: https://docs.getdbt.tech/docs/core/connect-data-platform/profiles.yml
[использование dbt с CrateDB]: https://cratedb.com/docs/guide/integrate/dbt/