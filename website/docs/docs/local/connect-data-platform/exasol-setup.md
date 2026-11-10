---
title: "Подключение Exasol к dbt v1"
sidebar_label: "Exasol"
description: "Из этого руководства вы узнаете, как настроить хранилище данных Exasol в dbt."
meta:
  maintained_by: Exasol
  authors: 'Torsten Glunde, Ilija Kutle'
  github_repo: 'exasol/dbt-exasol'
  pypi_package: 'dbt-exasol'
  min_core_version: 'v1.8.0'
  max_core_version: 'v1.10.x'
  cloud_support: Not Supported
  min_supported_version: 'Exasol 6.x'
  slack_channel_name: 'n/a'
  slack_channel_link:
  platform_name: 'Exasol'
  config_page: '/reference/resource-configs/exasol-configs'
availability: local_free
---
import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

### Подключение к Exasol с помощью **dbt-exasol**

#### Аутентификация по имени пользователя и паролю

Настройте профиль dbt для работы с Exasol:

##### Параметры подключения к Exasol

<File name='profiles.yml'>

```yaml
dbt-exasol:
  target: dev
  outputs:
    dev:
      type: exasol
      threads: 1
      dsn: HOST:PORT
      user: USERNAME
      password: PASSWORD
      dbname: db
      schema: SCHEMA
```

</File>

#### Аутентификация OpenID (Exasol SaaS) {#open-id-authentication}

В средах Exasol SaaS для аутентификации можно использовать токены OpenID вместо имени пользователя и пароля:

<File name='profiles.yml'>

```yaml
dbt-exasol:
  target: dev
  outputs:
    dev:
      type: exasol
      threads: 1
      dsn: HOST:PORT
      user: USERNAME
      access_token: YOUR_ACCESS_TOKEN  # или используйте refresh_token
      dbname: db
      schema: SCHEMA
      encryption: True  # обязательно для SaaS
```

</File>

- **`access_token`** &mdash; Персональный токен доступа для аутентификации OpenID
- **`refresh_token`** &mdash; Токен обновления для аутентификации OpenID (альтернатива `access_token`)

:::info
Используйте либо `access_token`, либо `refresh_token`, но не оба одновременно. При использовании аутентификации OpenID в Exasol SaaS требуется шифрование TLS.
:::

#### Необязательные параметры

- **`connection_timeout`** &mdash; по умолчанию используется значение по умолчанию из pyexasol
- **`socket_timeout`** &mdash; по умолчанию используется значение по умолчанию из pyexasol
- **`query_timeout`** &mdash; по умолчанию используется значение по умолчанию из pyexasol
- **`compression`** &mdash; значение по умолчанию: False
- **`encryption`** &mdash; значение по умолчанию: True. Включает шифрование SSL/TLS для защищённых подключений. Обязательно для Exasol SaaS
- **`validate_server_certificate`** &mdash; значение по умолчанию: True. Проверяет сертификат SSL/TLS, если шифрование включено. Устанавливайте False только при разработке и тестировании с самоподписанными сертификатами (не рекомендуется для производственной среды)
- **`protocol_version`** &mdash; значение по умолчанию: v3
- **`row_separator`** &mdash; значение по умолчанию: CRLF для Windows, LF для остальных систем
- **`timestamp_format`** &mdash; значение по умолчанию: `YYYY-MM-DDTHH:MI:SS.FF6`

:::info Проверка сертификатов SSL/TLS
По умолчанию dbt-exasol проверяет сертификаты SSL/TLS, если `encryption=True`. При разработке и тестировании с самоподписанными сертификатами можно выбрать один из следующих вариантов:

- Установить `validate_server_certificate: False` (не рекомендуется для производственной среды)
- Указать отпечаток сертификата в DSN: `dsn: myhost/FINGERPRINT:8563`
- Использовать `dsn: myhost/nocertcheck:8563`, чтобы пропустить проверку (только для тестирования)

Дополнительные сведения см. в [документации PyExasol по безопасности](https://exasol.github.io/pyexasol/master/user_guide/configuration/security.html).
:::
