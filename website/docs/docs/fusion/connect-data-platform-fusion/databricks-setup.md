---
title: "Настройка Databricks"
description: "Прочитайте это руководство, чтобы узнать о настройке Databricks warehouse в dbt Fusion."
id: "databricks-setup"
meta:
  maintained_by: Databricks
  authors: 'some dbt loving Bricksters'
  github_repo: 'databricks/dbt-databricks'
  pypi_package: 'dbt-databricks'
  cloud_support: Supported
  min_supported_version: 'Databricks SQL or DBR 12+'
  slack_channel_name: '#db-databricks-and-spark'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNGCW8HKL'
  platform_name: 'Databricks'
  config_page: '/reference/resource-configs/databricks-configs'
--- 

# Настройка Databricks <Lifecycle status='preview' />

Вы можете настроить адаптер Databricks, запустив `dbt init` в CLI, либо вручную создав файл `profiles.yml` и указав в нём поля, соответствующие выбранному типу аутентификации.

Адаптер Databricks для Fusion поддерживает следующие [методы аутентификации](#supported-authentication-types):
- Personal access token (для индивидуальных пользователей)
- Service Principal token (для сервисных пользователей)
- OAuth

## Детали конфигурации Databricks

Адаптер <Constant name="fusion_engine" /> `dbt-databricks` — это единственный поддерживаемый способ подключения к Databricks.

`dbt-databricks` может подключаться к Databricks SQL Warehouses. Эти хранилища рекомендуется использовать для начала работы с Databricks.

Дополнительную информацию о получении учётных данных для настройки профиля см. в [документации Databricks](https://docs.databricks.com/dev-tools/dbt.html#).

## Настройка Fusion

При выполнении `dbt init` в CLI вам будет предложено указать следующие поля:

- **Host:** имя хоста экземпляра Databricks (без префикса `http` или `https`)
- **HTTP Path:** путь к вашему SQL-серверу или кластеру
- **Schema:** схема для разработки / стейджинга / деплоя проекта
- **Catalog (Optional):** каталог Databricks, содержащий ваши схемы и таблицы

В качестве альтернативы вы можете вручную создать файл `profiles.yml` и настроить необходимые поля. Примеры форматирования см. в разделе [authentication](#supported-authentication-types). Если файл `profiles.yml` уже существует, вам будет предложено сохранить текущие поля или перезаписать их.

Далее выберите метод аутентификации и следуйте инструкциям на экране, чтобы предоставить требуемую информацию.

## Поддерживаемые типы аутентификации

<Tabs>

<TabItem value="Personal access token">

Введите ваш personal access token (PAT) для среды Databricks. Подробнее о получении PAT см. в [документации Databricks](https://docs.databricks.com/aws/en/dev-tools/auth/pat). Databricks считает этот механизм устаревшим, поэтому рекомендуется использовать OAuth вместо PAT.

#### Пример конфигурации с personal access token

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: databricks
      database: TRANSFORMING
      schema: JANE_SMITH
      host: YOUR.HOST.COM
      http_path: YOUR/PATH/HERE
      token: ABC123
      auth_type: databricks_cli
      threads: 16
```

</File>

</TabItem>

<TabItem value="Service Principal token">

Введите Service Principal token для среды Databricks. Подробнее о получении Service Principal token см. в [документации Databricks](https://docs.databricks.com/aws/en/admin/users-groups/service-principals).

#### Пример конфигурации с Service Principal token

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: databricks
      database: TRANSFORMING
      schema: JANE_SMITH
      host: YOUR.HOST.COM
      http_path: YOUR/PATH/HERE
      token: ABC123
      auth_type: databricks_cli
      threads: 16
```

</File>

</TabItem>

<TabItem value="OAuth (Recommended)">

При выборе OAuth будет создано подключение к вашей среде Databricks и автоматически открыт веб-браузер для завершения аутентификации. Пользователям потребуется проходить повторную аутентификацию при запуске каждой новой сессии dbt.

#### Пример конфигурации OAuth

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: databricks
      database: TRANSFORMING
      schema: JANE_SMITH
      host: YOUR.HOST.COM
      http_path: YOUR/PATH/HERE
      auth_type: oauth
      threads: 16
```
</File>

</TabItem>

</Tabs>

## Дополнительная информация

Конфигурационные параметры, специфичные для Databricks, см. в [справочнике по адаптеру Databricks](/reference/resource-configs/databricks-configs).
