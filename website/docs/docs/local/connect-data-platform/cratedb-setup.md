---
title: "Подключение CrateDB к dbt v1"
sidebar_label: "CrateDB"
description: "Прочитайте это руководство, чтобы узнать, как настроить платформу данных CrateDB в dbt."
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
availability: local_free
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
[PostgreSQL configuration]: https://docs.getdbt.com/reference/resource-configs/postgres-configs
[PostgreSQL profile setup]: https://docs.getdbt.com/docs/local/connect-data-platform/postgres-setup
[`profiles.yml`]: https://docs.getdbt.com/docs/local/profiles.yml
[using dbt with CrateDB]: https://cratedb.com/docs/guide/integrate/dbt/
