---
title: "Настройка Athena"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Athena в dbt."
meta:
  maintained_by: dbt Labs
  authors: dbt Labs
  github_repo: 'dbt-labs/dbt-athena'
  pypi_package: 'dbt-athena-community'
  min_core_version: 'v1.3.0'
  cloud_support: Поддерживается
  min_supported_version: 'версия движка 2 и 3'
  slack_channel_name: '#db-athena'
  slack_channel_link: 'https://getdbt.slack.com/archives/C013MLFR7BQ'
  platform_name: 'Athena'
  config_page: '/reference/resource-configs/no-configs'
---

<!--Следующий код использует компонент и встроенный файл частичных markdown docusaurus, который содержит повторно используемый контент, назначенный в метаданных. Для этой страницы частичный файл - _setup-pages-intro.md. Вам нужно включить код 'import' и затем назначить компонент по мере необходимости. -->

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Athena с помощью dbt-athena

Этот плагин не принимает никаких учетных данных напрямую. Вместо этого, [учетные данные определяются автоматически](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html) на основе соглашений AWS CLI/boto3 и сохраненной информации для входа. Вы можете настроить имя профиля AWS для использования через aws_profile_name. Ознакомьтесь с конфигурацией профиля dbt ниже для получения подробной информации.

<File name='~/.dbt/profiles.yml'>

```yaml
default:
  outputs:
    dev:
      type: athena
      s3_staging_dir: [s3_staging_dir]
      s3_data_dir: [s3_data_dir]
      s3_data_naming: [table_unique] # тип соглашения о наименовании, используемого при записи в S3
      region_name: [region_name]
      database: [database name]
      schema: [dev_schema]
      aws_profile_name: [необязательный профиль для использования из вашего файла общих учетных данных AWS.]
      threads: [1 или более]
      num_retries: [0 или более] # количество повторных попыток, выполняемых адаптером. По умолчанию 5
  target: dev
```

</File>