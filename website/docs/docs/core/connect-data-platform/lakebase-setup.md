---
title: "Настройка Databricks Lakebase"
meta:
  maintained_by: dbt Labs
  authors: dbt Labs
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-postgres'
  min_core_version: 'v1.0.0'
  cloud_support: Supported
  min_supported_version: '?'
  slack_channel_name: '#db-postgres'
  slack_channel_link: 'https://getdbt.slack.com/archives/C0172G2E273'
  platform_name: 'Lakebase'
  config_page: '/reference/resource-configs/postgres-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Конфигурация профиля

Цели Databricks Lakebase настраиваются точно так же, как и [цели Postgres](/docs/core/connect-data-platform/postgres-setup/#profile-configuration).

Используйте следующие ключевые параметры для подключения к Databricks Lakebase:

- `host name`: Можно найти в **Databricks** > **Compute** > **Database instances** > **Connect with PSQL**. Используется формат `instance-123abcdef456.database.cloud.databricks.com`
- `database name`: По умолчанию используйте `databricks_postgres`
- Аутентификация: `dbt-postgres` поддерживает только аутентификацию по имени пользователя и паролю. Вы можете сгенерировать имя пользователя и пароль, [включив Native Postgres Role Login](https://docs.databricks.com/aws/en/oltp/oauth?language=UI#authenticate-with-databricks-identities), и использовать имя роли в качестве имени пользователя. Подробнее об управлении ролями и привилегиями Postgres см. в [документации](https://docs.databricks.com/aws/en/oltp/pg-roles#create-postgres-roles-and-grant-privileges-for-databricks-identities).

В качестве альтернативы вы можете [сгенерировать OAuth‑токен](https://docs.databricks.com/aws/en/oltp/oauth?language=UI#authenticate-with-databricks-identities), который необходимо обновлять каждый час, и использовать его вместе с вашим именем пользователя Databricks.
