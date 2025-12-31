---
title: "Настройка Redshift"
description: "Прочитайте это руководство, чтобы узнать о настройке Redshift warehouse в dbt Fusion."
id: "redshift-setup"
meta:
  maintained_by: dbt Labs
  authors: 'Fusion dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-redshift'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-redshift'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Redshift'
  config_page: '/reference/resource-configs-fusion/redshift-configs'
---

# Настройка Redshift <Lifecycle status='preview' /> {#redshift-setup}

Вы можете настроить адаптер Redshift, запустив `dbt init` в CLI, либо вручную создав файл `profiles.yml` и заполнив в нём поля, соответствующие выбранному типу аутентификации.

Адаптер Redshift для Fusion поддерживает следующие [методы аутентификации](#supported-authentication-types):
- Password
- IAM profile

## Конфигурация Fusion {#configure-fusion}

При выполнении `dbt init` в CLI вам будет предложено ввести следующие поля:
- **Host:** имя хоста вашего кластера Redshift  
- **User:** имя пользователя учётной записи, которая будет подключаться к базе данных  
- **Database:** имя базы данных  
- **Schema:** имя схемы  
- **Port (default: 5439):** порт для вашего окружения Redshift  

В качестве альтернативы вы можете вручную создать файл `profiles.yml` и настроить в нём необходимые поля. Примеры форматирования приведены в разделе [authentication](#supported-authentication-types). Если файл `profiles.yml` уже существует, вам будет предложено либо сохранить текущие значения, либо перезаписать их.

Далее выберите метод аутентификации и следуйте подсказкам на экране, чтобы предоставить требуемую информацию.

## Поддерживаемые типы аутентификации {#supported-authentication-types}

<Tabs>
<TabItem value="Password">

Используйте пароль пользователя Redshift для аутентификации. Также вы можете вручную указать его в открытом виде в конфигурации файла `profiles.yml`.

#### Пример конфигурации с паролем {#example-password-configuration}

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: redshift
      port: 5439
      database: JAFFLE_SHOP
      schema: JAFFLE_TEST
      ra3_node: true
      method: database
      host: ABC123.COM
      user: JANE.SMITH@YOURCOMPANY.COM
      password: ABC123
      threads: 16
```

</File>
</TabItem>

<TabItem value="IAM profile">

Укажите IAM profile, который будет использоваться для подключения сессий Fusion. Вам потребуется предоставить следующую информацию:
- **IAM Profile:** имя профиля  
- **Cluster ID:** уникальный идентификатор вашего AWS-кластера  
- **Region:** регион AWS (например, us-east-1)  
- **Use RA3 node type (y/n):** использовать высокопроизводительный тип узлов AWS RA3  

#### Пример конфигурации с IAM profile {#example-password-configuration-1}

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: redshift
      port: 5439
      database: JAFFLE_SHOP
      schema: JAFFLE_TEST
      ra3_node: false
      method: iam
      host: YOURHOSTNAME.COM
      user: JANE.SMITH@YOURCOMPANY.COM
      iam_profile: YOUR_PROFILE_NAME
      cluster_id: ABC123
      region: us-east-1
      threads: 16
```

</File>
</TabItem>
</Tabs>

## Больше информации {#more-information}

Дополнительную информацию о конфигурации, специфичной для Redshift, см. в [справочном руководстве по адаптеру Redshift](/reference/resource-configs/redshift-configs).
