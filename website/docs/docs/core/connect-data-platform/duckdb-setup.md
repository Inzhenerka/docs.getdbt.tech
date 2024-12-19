---
title: "Настройка DuckDB"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища DuckDB в dbt."
meta:
  maintained_by: Сообщество
  authors: 'Josh Wills (https://github.com/jwills)'
  github_repo: 'duckdb/dbt-duckdb'
  pypi_package: 'dbt-duckdb'
  min_core_version: 'v1.0.1'
  cloud_support: Не поддерживается
  min_supported_version: 'DuckDB 0.3.2'
  slack_channel_name: '#db-duckdb'
  slack_channel_link: 'https://getdbt.slack.com/archives/C039D1J1LA2'
  platform_name: 'Duck DB'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Плагин сообщества

Некоторые основные функции могут быть ограничены. Если вы хотите внести свой вклад, ознакомьтесь с исходным кодом для каждого из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Подключение к DuckDB с помощью dbt-duckdb

[DuckDB](http://duckdb.org) — это встроенная база данных, аналогичная SQLite, но предназначенная для аналитики в стиле OLAP, а не OLTP. Единственный параметр конфигурации, который требуется в вашем профиле (в дополнение к `type: duckdb`), — это поле `path`, которое должно указывать на путь в вашей локальной файловой системе, где вы хотите, чтобы файл базы данных DuckDB (и связанный с ним журнал предварительной записи) был записан. Вы также можете указать параметр `schema`, если хотите использовать схему, отличную от стандартной (которая называется `main`).

В классе `DuckDBCredentials` также определено поле `database` для согласованности с родительским классом `Credentials`, но по умолчанию оно равно `main`, и установка его на что-то другое, вероятно, приведет к странным последствиям, которые нельзя будет полностью предсказать, поэтому, пожалуйста, избегайте изменения этого параметра.

Начиная с версии 1.2.3, вы можете загружать любые поддерживаемые [расширения DuckDB](https://duckdb.org/docs/extensions/overview), перечислив их в поле `extensions` в вашем профиле. Вы также можете установить любые дополнительные [параметры конфигурации DuckDB](https://duckdb.org/docs/sql/configuration) через поле `settings`, включая параметры, которые поддерживаются в любых загруженных расширениях.

Например, чтобы иметь возможность подключаться к `s3` и читать/записывать файлы `parquet`, используя ключ доступа и секрет AWS, ваш профиль будет выглядеть примерно так:

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: 'file_path/database_name.duckdb'
      extensions:
        - httpfs
        - parquet
      settings:
        s3_region: my-aws-region
        s3_access_key_id: "{{ env_var('S3_ACCESS_KEY_ID') }}"
        s3_secret_access_key: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
```

</File>