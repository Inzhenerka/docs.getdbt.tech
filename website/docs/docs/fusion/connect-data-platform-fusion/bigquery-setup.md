---
title: "Настройка BigQuery"
description: "Прочитайте это руководство, чтобы узнать о настройке BigQuery warehouse в dbt Fusion."
id: "bigquery-setup"
meta:
  maintained_by: dbt Labs
  authors: 'Fusion dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-bigquery'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-bigquery'
  slack_channel_link: 'https://getdbt.slack.com/archives/C99SNSRTK'
  platform_name: 'BigQuery'
  config_page: '/reference/resource-configs/bigquery-configs'
---

# Настройка BigQuery <Lifecycle status='preview' />

Вы можете настроить адаптер BigQuery, выполнив команду `dbt init` в CLI, либо вручную создав файл `profiles.yml` с полями, настроенными в соответствии с выбранным типом аутентификации.

Адаптер BigQuery для Fusion поддерживает следующие [методы аутентификации](#supported-authentication-types):
- Сервисный аккаунт (JSON-файл)
- gcloud OAuth

## Разрешения BigQuery

Для чтения данных, а также создания таблиц и представлений в проекте BigQuery, учетным записям пользователей dbt требуются следующие разрешения:

- BigQuery Data Editor
- BigQuery User
- BigQuery Read Session User (новое в Fusion; требуется для доступа к Storage Read API)

Для работы с BigQuery DataFrames дополнительно требуются следующие разрешения:
- BigQuery Job User
- BigQuery Read Session User
- Notebook Runtime User
- Code Creator
- colabEnterpriseUser

## Конфигурация Fusion

При выполнении `dbt init` в CLI вам будет предложено указать следующие параметры:
- **Project ID:** идентификатор проекта GCP BigQuery
- **Dataset:** имя схемы
- **Location:** регион размещения вашей среды GCP (например, us-east1)

В качестве альтернативы вы можете вручную создать файл `profiles.yml` и настроить в нем необходимые поля. Примеры форматирования приведены в разделе [authentication](#supported-authentication-types). Если файл `profiles.yml` уже существует, вы можете либо сохранить текущие значения полей, либо перезаписать их.

Затем выберите метод аутентификации и следуйте подсказкам в интерфейсе, чтобы предоставить необходимую информацию.

## Поддерживаемые типы аутентификации

<Tabs>

<TabItem value="Сервисный аккаунт (JSON-файл)">

При выборе метода аутентификации **Service account (JSON file)** вам будет предложено указать путь к JSON-файлу. Также вы можете вручную задать этот путь в файле `profiles.yml`.

#### Пример конфигурации с JSON-файлом сервисного аккаунта

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: bigquery
      threads: 16
      database: ABC123
      schema: JAFFLE_SHOP
      method: service-account
      keyfile: /Users/mshaver/Downloads/CustomRoleDefinition.json
      location: us-east1
      dataproc_batch: null
```

</File>

</TabItem>

<TabItem value="gcloud OAuth">

Перед выбором этого метода аутентификации необходимо сначала настроить локальный OAuth для gcloud:

#### Локальная настройка OAuth через gcloud

1. Убедитесь, что команда `gcloud` [установлена на вашем компьютере](https://cloud.google.com/sdk/downloads).
2. Активируйте application-default account с помощью команды:

```shell
gcloud auth application-default login \           
  --scopes=https://www.googleapis.com/auth/bigquery,\
https://www.googleapis.com/auth/drive.readonly,\
https://www.googleapis.com/auth/iam.test,\
https://www.googleapis.com/auth/cloud-platform

# Эта команда использует флаг `--scopes` для запроса доступа к Google Sheets. Это позволяет трансформировать данные в Google Sheets с помощью dbt. Если ваш проект dbt не работает с данными из Google Sheets, вы можете опустить флаг `--scopes`.
```

Откроется окно браузера, в котором вам будет предложено войти в учетную запись Google. После этого dbt будет использовать ваши OAuth-учетные данные для подключения к BigQuery.

#### Пример конфигурации gcloud

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: bigquery
      threads: 16
      database: ABC123
      schema: JAFFLE_SHOP
      method: oauth
      location: us-east1
      dataproc_batch: null

```

</File>

</TabItem>

</Tabs>

## Дополнительная информация

Дополнительную информацию о настройках, специфичных для BigQuery, вы найдете в [справочном руководстве по адаптеру BigQuery](/reference/resource-configs/bigquery-configs).
