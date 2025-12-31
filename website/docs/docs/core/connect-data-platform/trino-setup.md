---
title: "Настройка Starburst/Trino"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Starburst/Trino в dbt."
id: "trino-setup"
meta:
  maintained_by: Starburst Data, Inc.
  authors: Marius Grama, Przemek Denkiewicz, Michiel de Smet, Damian Owsianny
  github_repo: 'starburstdata/dbt-trino'
  pypi_package: 'dbt-trino'
  min_core_version: 'v0.20.0'
  cloud_support: 'Supported'
  min_supported_version: 'n/a'
  slack_channel_name: '#db-starburst-and-trino'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNNPBQ24R'
  platform_name: 'Starburst/Trino'
  config_page: '/reference/resource-configs/trino-configs'
---

<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>

## Подключение к Starburst/Trino {#connecting-to-starbursttrino}

Чтобы подключиться к платформе данных с помощью dbt Core, создайте соответствующие ключи/значения _profile_ и _target_ в YAML-файле `profiles.yml` для ваших кластеров Starburst/Trino. Этот YAML-файл dbt находится в директории `.dbt/` в вашем домашнем каталоге. Для получения дополнительной информации обратитесь к [Профили подключения](/docs/core/connect-data-platform/connection-profiles) и [profiles.yml](/docs/core/connect-data-platform/profiles.yml).

Параметры для настройки подключения предназначены для кластеров Starburst Enterprise, Starburst Galaxy и Trino. Если не указано иное, под "кластером" подразумевается любой из этих продуктов.

## Параметры хоста {#host-parameters}

Следующие поля профиля всегда обязательны, за исключением `user`, который также обязателен, если вы не используете методы аутентификации `oauth`, `oauth_console`, `cert` или `jwt`.

| Поле     | Пример | Описание |
| --------- | ------- | ----------- |
|   `host`   | `mycluster.mydomain.com`<br/><br/>Формат для Starburst Galaxy:<br/><ul><li>`mygalaxyaccountname-myclustername.trino.galaxy.starburst.io`</li></ul> | Имя хоста вашего кластера.<br/><br/>Не включайте префикс `http://` или `https://`.  |
| `database` | `my_postgres_catalog` | Имя каталога в вашем кластере. |
|  `schema`  | `my_schema`  | Имя схемы в каталоге вашего кластера. <br/><br/>_Не рекомендуется_ использовать имена схем с заглавными или смешанными буквами.  |
|   `port`   | `443`  | Порт для подключения к вашему кластеру. По умолчанию это 443 для кластеров с включенным TLS. |
|   `user`   | Формат для Starburst Enterprise или Trino: <br/> <ul><li>`user.name`</li><li>`user.name@mydomain.com`</li></ul><br/>Формат для Starburst Galaxy:<br/> <ul><li>`user.name@mydomain.com/role`</li></ul> | Имя пользователя (учетной записи) для входа в ваш кластер. При подключении к кластерам Starburst Galaxy вы должны включить роль пользователя в качестве суффикса к имени пользователя. |

### Роли в Starburst Enterprise {#roles-in-starburst-enterprise}
<Snippet path="connect-starburst-trino/roles-starburst-enterprise" />

### Схемы и базы данных {#schemas-and-databases}
<Snippet path="connect-starburst-trino/schema-db-fields" />

## Дополнительные параметры {#additional-parameters}

Следующие поля профиля являются необязательными для настройки. Они позволяют настроить сессию вашего кластера и dbt для вашего подключения.

| Поле профиля                 | Пример                          | Описание                                                                                                 |
| ----------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `threads`                     | `8`                              | Сколько потоков должен использовать dbt (по умолчанию `1`)                                                            |
| `roles`                       | `system: analyst`                | Роли каталога могут быть установлены в необязательном параметре `roles` с использованием следующего формата: `catalog: role`.     |
| `session_properties`          | `query_max_run_time: 4h`         | Устанавливает свойства сессии Trino, используемые в подключении. Выполните `SHOW SESSION`, чтобы увидеть доступные опции       |
| `prepared_statements_enabled` | `true` или `false`                | Включить использование подготовленных операторов Trino (используется в командах `dbt seed`) (по умолчанию: `true`)                   |
| `retries`                     | `10`                             | Настройте, сколько раз все операции с базой данных будут повторяться при возникновении проблем с подключением (по умолчанию: `3`)     |
| `timezone`                    | `Europe/Brussels`                | Часовой пояс для сессии Trino (по умолчанию: локальный часовой пояс на стороне клиента)                                   |
| `http_headers`                | `X-Trino-Client-Info: dbt-trino` | HTTP-заголовки для отправки вместе с запросами к Trino, указанные в виде YAML-словаря пар (заголовок, значение).  |
| `http_scheme`                 | `https` или `http`                | HTTP-схема для использования в запросах к Trino (по умолчанию: `http`, или `https`, если `kerberos`, `ldap` или `jwt`) |

## Параметры аутентификации {#authentication-parameters}

Методы аутентификации, которые поддерживает <Constant name="core" />:

- `ldap` &mdash; LDAP (имя пользователя и пароль)  
- `kerberos` &mdash; Kerberos
- `jwt` &mdash; JSON Web Token (JWT)
- `certificate` &mdash; Аутентификация на основе сертификатов
- `oauth` &mdash; Открытая аутентификация (OAuth)
- `oauth_console` &mdash; Открытая аутентификация (OAuth) с URL аутентификации, выводимым в консоль 
- `none` &mdash; Нет, без аутентификации

Установите поле `method` на метод аутентификации, который вы собираетесь использовать для подключения. Для общего введения в аутентификацию в Trino см. [Trino Security: Authentication types](https://trino.io/docs/current/security/authentication-types.html).

Нажмите на один из этих методов аутентификации для получения более подробной информации о том, как настроить ваш профиль подключения. Каждая вкладка также включает пример конфигурационного файла `profiles.yml` для вашего ознакомления.

<Tabs
  defaultValue="ldap"
  values={[
    {label: 'LDAP', value: 'ldap'},
    {label: 'Kerberos', value: 'kerberos'},
    {label: 'JWT', value: 'jwt'},
    {label: 'Certificate', value: 'certificate'},
    {label: 'OAuth', value: 'oauth'},
    {label: 'OAuth (console)', value: 'oauth_console'},
    {label: 'None', value: 'none'},
  ]}
>

<TabItem value="ldap">

Следующая таблица перечисляет параметры аутентификации для настройки LDAP.

Для получения дополнительной информации обратитесь к [LDAP аутентификация](https://trino.io/docs/current/security/ldap.html) в документации Trino.

| Поле профиля | Пример | Описание |
| ------------- | ------- | ------------ |
| `method` | `ldap`| Установите LDAP в качестве метода аутентификации. |
| `user`   | Формат для Starburst Enterprise или Trino: <br/> <ul><li>`user.name`</li><li>`user.name@mydomain.com`</li></ul><br/>Формат для Starburst Galaxy:<br/> <ul><li>`user.name@mydomain.com/role`</li></ul> | Имя пользователя (учетной записи) для входа в ваш кластер. При подключении к кластерам Starburst Galaxy вы должны включить роль пользователя в качестве суффикса к имени пользователя. |
| `password`  | `abc123` | Пароль для аутентификации.  |
| `impersonation_user` (необязательно) | `impersonated_tom` | Переопределите предоставленное имя пользователя. Это позволяет вам выдавать себя за другого пользователя. |
<br/>

#### Пример profiles.yml для LDAP {#example-profilesyml-for-ldap}

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: ldap 
      user: [user]
      password: [password]
      host: [hostname]
      database: [database name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]
```

</File>

</TabItem>

<TabItem value="kerberos">

Следующая таблица перечисляет параметры аутентификации для настройки Kerberos.

Для получения дополнительной информации обратитесь к [Kerberos аутентификация](https://trino.io/docs/current/security/kerberos.html) в документации Trino.

| Поле профиля                               | Пример             | Описание                                                      |
| ------------------------------------------- | ------------------- | ---------------------------------------------------------------- |
| `method` | `kerberos`| Установите Kerberos в качестве метода аутентификации. |
| `user`                                      | `commander`         | Имя пользователя для аутентификации                                      |
| `keytab`                                    | `/tmp/trino.keytab` | Путь к keytab                                                   |
| `krb5_config`                               | `/tmp/krb5.conf`    | Путь к конфигурации                                                   |
| `principal`                                 | `trino@EXAMPLE.COM` | Принципал                                                        |
| `service_name` (необязательно)                   | `abc123`            | Имя сервиса (по умолчанию `trino`)                               |
| `hostname_override` (необязательно)              | `EXAMPLE.COM`       | Имя хоста Kerberos для хоста, чье DNS-имя не совпадает        |
| `mutual_authentication` (необязательно)          | `false`             | Логический флаг для взаимной аутентификации                           |
| `force_preemptive` (необязательно)               | `false`             | Логический флаг для предварительного инициирования обмена Kerberos GSS |
| `sanitize_mutual_error_response` (необязательно) | `true`              | Логический флаг для удаления содержимого и заголовков из ответов об ошибках   |
| `delegate`  (необязательно)                      | `false`             | Логический флаг для делегирования учетных данных (`GSS_C_DELEG_FLAG`)       |

<br/>

#### Пример profiles.yml для Kerberos {#example-profilesyml-for-kerberos}

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: kerberos
      user: commander
      keytab: /tmp/trino.keytab
      krb5_config: /tmp/krb5.conf
      principal: trino@EXAMPLE.COM
      host: trino.example.com
      port: 443
      database: analytics
      schema: public
```

</File>

</TabItem>

<TabItem value="jwt">

Следующая таблица перечисляет параметры аутентификации для настройки JSON Web Token.

Для получения дополнительной информации обратитесь к [JWT аутентификация](https://trino.io/docs/current/security/jwt.html) в документации Trino.

| Поле профиля        | Пример        | Описание                |
| -------------------- | -------------- | -------------------------- |
| `method` | `jwt`| Установите JWT в качестве метода аутентификации. |
| `jwt_token` | `aaaaa.bbbbb.ccccc` | Строка JWT. |

<br/>

#### Пример profiles.yml для JWT {#example-profilesyml-for-jwt}

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: jwt 
      jwt_token: [my_long_jwt_token_string]
      host: [hostname]
      database: [database name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]
```

</File>

</TabItem>

<TabItem value="certificate">

Следующая таблица перечисляет параметры аутентификации для настройки сертификатов.

Для получения дополнительной информации обратитесь к [Аутентификация на основе сертификатов](https://trino.io/docs/current/security/certificate.html) в документации Trino.

| Поле профиля        | Пример        | Описание                         |
| -------------------- | -------------- | ----------------------------------- |
| `method` | `certificate`| Установите аутентификацию на основе сертификатов в качестве метода |
| `client_certificate` | `/tmp/tls.crt` | Путь к клиентскому сертификату          |
| `client_private_key` | `/tmp/tls.key` | Путь к закрытому ключу клиента          |
| `cert`               |                | Полный путь к файлу сертификата |

<br/>

#### Пример profiles.yml для сертификатов {#example-profilesyml-for-certificate}

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: certificate 
      cert: [path/to/cert_file]
      client_certificate: [path/to/client/cert]
      client_private_key: [path to client key]
      database: [database name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]
```

</File>

</TabItem>

<TabItem value="oauth">

Единственный параметр аутентификации для настройки OAuth 2.0 — это `method: oauth`. Если вы используете Starburst Enterprise или Starburst Galaxy, вы должны включить OAuth 2.0 в Starburst, прежде чем сможете использовать этот метод аутентификации.

Для получения дополнительной информации обратитесь как к [OAuth 2.0 аутентификация](https://trino.io/docs/current/security/oauth2.html) в документации Trino, так и к [README](https://github.com/trinodb/trino-python-client#oauth2-authentication) для клиента Trino на Python.

Рекомендуется установить `keyring` для кэширования токена OAuth 2.0 между несколькими вызовами dbt, выполнив `python -m pip install 'trino[external-authentication-token-cache]'`. Пакет `keyring` не устанавливается по умолчанию.

#### Пример profiles.yml для OAuth {#example-profilesyml-for-oauth}

```yaml
sandbox-galaxy:
  target: oauth
  outputs:
    oauth:
      type: trino
      method: oauth
      host: bunbundersders.trino.galaxy-dev.io
      catalog: dbt_target
      schema: dataders
      port: 443
```

</TabItem>

<TabItem value="oauth_console">

Единственный параметр аутентификации для настройки OAuth 2.0 — это `method: oauth_console`. Если вы используете Starburst Enterprise или Starburst Galaxy, вы должны включить OAuth 2.0 в Starburst, прежде чем сможете использовать этот метод аутентификации.

Для получения дополнительной информации обратитесь как к [OAuth 2.0 аутентификация](https://trino.io/docs/current/security/oauth2.html) в документации Trino, так и к [README](https://github.com/trinodb/trino-python-client#oauth2-authentication) для клиента Trino на Python.

Единственное отличие между `oauth_console` и `oauth` заключается в следующем:
- `oauth` &mdash; URL аутентификации автоматически открывается в браузере.
- `oauth_console` &mdash; URL выводится в консоль.

Рекомендуется установить `keyring` для кэширования токена OAuth 2.0 между несколькими вызовами dbt, выполнив `python -m pip install 'trino[external-authentication-token-cache]'`. Пакет `keyring` не устанавливается по умолчанию.

#### Пример profiles.yml для OAuth {#example-profilesyml-for-oauth-1}

```yaml
sandbox-galaxy:
  target: oauth_console
  outputs:
    oauth:
      type: trino
      method: oauth_console
      host: bunbundersders.trino.galaxy-dev.io
      catalog: dbt_target
      schema: dataders
      port: 443
```

</TabItem>

<TabItem value="none">

Вам не нужно настраивать аутентификацию (`method: none`), однако dbt Labs настоятельно не рекомендует использовать это в реальных приложениях. Его использование предназначено только для игрушечных целей (например, для экспериментов), таких как локальные примеры, например, запуск Trino и dbt полностью в одном контейнере Docker.

#### Пример profiles.yml без аутентификации {#example-profilesyml-for-no-authentication}

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: none
      user: commander
      host: trino.example.com
      port: 443
      database: analytics
      schema: public
```

</File>

</TabItem>
</Tabs>