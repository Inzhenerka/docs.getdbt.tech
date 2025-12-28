---
title: "Настройка Athena"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Athena в dbt."
meta:
  maintained_by: dbt Labs
  authors: dbt Labs
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-athena'
  min_core_version: 'v1.3.0'
  cloud_support: Supported
  min_supported_version: 'engine version 2 and 3'
  slack_channel_name: '#db-athena'
  slack_channel_link: 'https://getdbt.slack.com/archives/C013MLFR7BQ'
  platform_name: 'Athena'
  config_page: '/reference/resource-configs/athena-configs'
---

<!--Следующий код использует компонент и встроенный файл частичных markdown docusaurus, который содержит повторно используемый контент, назначенный в мета-данных. Для этой страницы частичный файл - _setup-pages-intro.md. Вы должны включить код 'import' и затем назначить компонент по мере необходимости. -->

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

:::tip `dbt-athena` против `dbt-athena-community`

`dbt-athena-community` был адаптером, поддерживаемым сообществом, до тех пор пока dbt Labs не взяла на себя его сопровождение в конце 2024 года. Сейчас и `dbt-athena`, и `dbt-athena-community` поддерживаются dbt Labs, однако `dbt-athena-community` фактически является лишь обёрткой над `dbt-athena`, опубликованной для обеспечения обратной совместимости.

:::

## Подключение к Athena с помощью dbt-athena

Этот плагин не принимает учетные данные напрямую. Вместо этого [учетные данные определяются автоматически](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html) на основе соглашений AWS CLI/boto3 и сохраненной информации для входа. Вы можете настроить имя профиля AWS, которое будет использоваться, через aws_profile_name. Ознакомьтесь с конфигурацией профиля dbt ниже для получения подробной информации.

<File name='~/.dbt/profiles.yml'>

```yaml
default:
  outputs:
    dev:
      type: athena
      s3_staging_dir: [s3_staging_dir]
      s3_data_dir: [s3_data_dir]
      s3_data_naming: [table_unique] # тип соглашения об именовании, используемый при записи в S3
      region_name: [region_name]
      database: [database name]
      schema: [dev_schema]
      aws_profile_name: [optional profile to use from your AWS shared credentials file.]
      threads: [1 or more]
      num_retries: [0 or more] # количество повторных попыток, выполняемых адаптером. По умолчанию 5
  target: dev
```

</File>

### Пример конфигурации

<File name='profiles.yml'>

```yaml
default:
  outputs:
    dev:
      type: athena
      s3_staging_dir: s3://dbt_demo_bucket/athena-staging/
      s3_data_dir: s3://dbt_demo_bucket/dbt-data/
      s3_data_naming: schema_table 
      region_name: us-east-1
      database: warehouse 
      schema: dev
      aws_profile_name: demo
      threads: 4 
      num_retries: 3    
  target: dev
```

</File>
