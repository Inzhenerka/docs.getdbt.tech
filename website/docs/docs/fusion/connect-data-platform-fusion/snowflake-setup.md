---
title: "Настройка Snowflake"
description: "Прочитайте это руководство, чтобы узнать о настройке Snowflake warehouse в dbt Fusion."
id: "snowflake-setup"
meta:
  maintained_by: dbt Labs
  authors: 'Fusion dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-snowflake'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-snowflake'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Snowflake'
  config_page: '/reference/resource-configs/snowflake-configs'
---

# Настройка Snowflake <Lifecycle status='preview' />

Вы можете настроить адаптер Snowflake, выполнив команду `dbt init` в CLI, либо вручную создав файл `profiles.yml` с полями, соответствующими выбранному типу аутентификации.

Адаптер Snowflake для Fusion поддерживает следующие [методы аутентификации](#supported-authentication-types):
- Password  
- Key pair  
- Single sign-on (SSO)  
- Password with MFA  

:::note
[Snowflake выводит из эксплуатации вход по паролю без MFA](https://docs.snowflake.com/en/user-guide/security-mfa-rollout). Отдельным разработчикам рекомендуется использовать MFA или SSO вместо аутентификации только по паролю. Аутентификация на основе пароля по‑прежнему поддерживается для сервисных пользователей (тип пользователя Snowflake: `LEGACY_SERVICE`).
:::

## Детали конфигурации Snowflake

Информацию, необходимую для настройки адаптера Snowflake, удобно получить через меню аккаунта Snowflake:
1. Нажмите на свое имя в боковой панели Snowflake.  
2. Наведите курсор на поле **Account**.  
3. В поле с названием аккаунта нажмите **View account details**.  
4. Нажмите **Config file** и выберите подходящие **Warehouse** и **Database**.  

<Lightbox src="/img/fusion/connect-adapters/snowflake-account-details.png" width="60%" title="Пример config file в Snowflake." />

## Конфигурация Fusion

При выполнении `dbt init` в CLI вам будет предложено указать следующие параметры:

- **Account:** номер аккаунта Snowflake  
- **User:** ваше имя пользователя Snowflake  
- **Database:** база данных в аккаунте Snowflake, к которой будет подключен проект  
- **Warehouse:** вычислительный warehouse, который будет выполнять задачи проекта  
- **Schema:** схема для разработки / стейджинга / деплоя проекта  
- **Role (Optional):** роль, которую dbt должен использовать при подключении к warehouse  

В качестве альтернативы вы можете вручную создать файл `profiles.yml` и настроить необходимые поля. Примеры форматирования приведены в разделе [authentication](#supported-authentication-types). Если файл `profiles.yml` уже существует, вам будет предложено сохранить текущие значения или перезаписать их.

Далее выберите метод аутентификации и следуйте подсказкам на экране, чтобы указать необходимую информацию.

## Поддерживаемые типы аутентификации

<Tabs>

<TabItem value="Password">

Аутентификация по паролю запрашивает пароль вашего аккаунта Snowflake. Этот вариант становится все менее распространенным, поскольку организации переходят на более безопасные способы аутентификации.

При выборе **Password with MFA** вы будете перенаправлены на страницу входа Snowflake для ввода passkey или пароля из приложения‑аутентификатора.

#### Пример конфигурации с паролем

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: snowflake
      threads: 16
      account: ABC123
      user: JANE.SMITH@YOURCOMPANY.COM
      database: JAFFLE_SHOP
      warehouse: TRANSFORM
      schema: JANE_SMITH
      password: THISISMYPASSWORD
```

</File>

#### Пример конфигурации с паролем и MFA

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: snowflake
      threads: 16
      authenticator: username_password_mfa
      account: ABC123
      user: JANE.SMITH@YOURCOMPANY.COM
      database: JAFFLE_SHOP
      warehouse: TRANFORM
      schema: JANE_SMITH
```

</File>

</TabItem>

<TabItem value="Key pair">

Аутентификация с помощью пары ключей позволяет:
- указать путь к ключу;  
- либо передать ключ в формате PEM в виде plain‑text прямо в конфигурации.

В обоих случаях рекомендуется использовать формат PKCS#8 с шифрованием AES‑256 для аутентификации по паре ключей в Fusion. Fusion не поддерживает устаревшее шифрование 3DES и форматы ключей без заголовков. Использование старых форматов может привести к ошибкам аутентификации.

Если вы столкнулись с ошибкой `Key is PKCS#1 (RSA private key). Snowflake requires PKCS#8`, это означает, что приватный ключ имеет неверный формат. Возможны два варианта:

- (Рекомендуемый способ) Повторно экспортировать ключ с современным шифрованием:

  ```bash
  # Convert to PKCS#8 with AES-256 encryption
  openssl genrsa 2048 | openssl pkcs8 -topk8 -v2 aes-256-cbc -inform PEM -out rsa_key.p8
  ```

- (Временный обходной путь) Добавить заголовок `BEGIN` и завершающую строку `END` к телу PEM‑ключа:

  ```
  -----BEGIN ENCRYPTED PRIVATE KEY-----
  < Your existing encrypted private key contents >
  -----END ENCRYPTED PRIVATE KEY-----
  ```

  После настройки ключа вам будет предложено указать passphrase, если он требуется.

#### Пример конфигурации с парой ключей

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: snowflake
      threads: 16
      account: ABC123
      user: JANE.SMITH@YOURCOMPANY.COM
      database: JAFFLE_SHOP
      warehouse: TRANSFORM
      schema: JANE_SMITH
      private_key: '<Your existing encrypted private key contents>'
      private_key_passphrase: YOURPASSPHRASEHERE
```

</File>

</TabItem>

<TabItem value="Single sign-on">

Single sign-on использует браузер для аутентификации сессии Snowflake.

По умолчанию каждое подключение, которое открывает dbt, будет требовать повторной аутентификации через браузер. Пакет коннектора Snowflake поддерживает кэширование токена сессии, однако [в настоящее время это поддерживается только в Windows и Mac OS](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-use.html#optional-using-connection-caching-to-minimize-the-number-of-prompts-for-authentication).

Дополнительную информацию о включении этой возможности в аккаунте Snowflake см. в [документации Snowflake](https://docs.snowflake.com/en/sql-reference/parameters.html#label-allow-id-token).

#### Пример конфигурации SSO

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: snowflake
      threads: 16
      authenticator: externalbrowser
      account: ABC123
      user: JANE.SMITH@YOURCOMPANY.COM
      database: JAFFLE_SHOP
      warehouse: TRANSFORM
      schema: JANE_SMITH
```
</File>

</TabItem>

</Tabs>

## Больше информации

Дополнительную информацию о настройках, специфичных для Snowflake, см. в [справочнике по конфигурации адаптера Snowflake](/reference/resource-configs/snowflake-configs).
