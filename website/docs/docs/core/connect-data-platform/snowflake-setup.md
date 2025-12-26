---
title: "Настройка Snowflake"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Snowflake в dbt."
id: "snowflake-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-snowflake'
  min_core_version: 'v0.8.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-snowflake'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Snowflake'
  config_page: '/reference/resource-configs/snowflake-configs'
---

<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>

## Методы аутентификации

### Аутентификация с использованием имени пользователя и пароля

Snowflake может быть настроен с использованием базовой аутентификации по имени пользователя и паролю, как показано ниже.

<VersionBlock firstVersion="1.9">

<File name='~/.dbt/profiles.yml'>

```yaml
my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: [account id]

      # User/password auth
      user: [username]
      password: [password]

      role: [user role]
      database: [database name]
      warehouse: [warehouse name]
      schema: [dbt schema]
      threads: [1 or more]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: True # default: true
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
  ```

</File>

### Аутентификация с использованием имени пользователя, пароля и DUO MFA

Snowflake интегрируется с приложением DUO Mobile для добавления двухфакторной аутентификации к базовой аутентификации по имени пользователя и паролю, как показано ниже.

```yaml
my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: [account id]

      # User/password auth
      user: [username]
      password: [password]
      authenticator: username_password_mfa

      role: [user role]
      database: [database name]
      warehouse: [warehouse name]
      schema: [dbt schema]
      threads: [1 or more]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: True # default: true
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
```

</VersionBlock>

**Примечание:** Чтобы не получать push-уведомления Duo при каждом запуске сборки моделей, включите [кэширование MFA-токенов](https://docs.snowflake.com/en/user-guide/security-mfa#label-mfa-token-caching) в вашем Snowflake warehouse, выполнив команду `alter account set allow_client_mfa_caching = true;` с ролью ACCOUNTADMIN.

### Аутентификация с использованием пары ключей

Чтобы использовать аутентификацию с парой ключей, укажите `private_key_path` в вашей конфигурации, избегая использования `password`. При необходимости вы можете добавить `private_key_passphrase`. **Примечание**: принимаются незашифрованные закрытые ключи, поэтому добавляйте парольную фразу только при необходимости. Однако для версий dbt Core 1.5 и 1.6 конфигурации, использующие закрытый ключ в формате PEM (например, ключи, заключенные в теги BEGIN и END), не поддерживаются. В этих версиях вы должны использовать `private_key_path` для указания местоположения файла вашего закрытого ключа.

dbt может указывать `private_key` напрямую в виде строки вместо использования `private_key_path`. Эта строка `private_key` может быть либо в формате DER, закодированном в Base64 (представляющем байты ключа), либо в текстовом формате PEM. Подробнее о том, как Snowflake генерирует ключи, см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/key-pair-auth).

<VersionBlock firstVersion="1.9">

<File name='~/.dbt/profiles.yml'>

```yaml
my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: [account id]
      user: [username]
      role: [user role]

      # Keypair config
      # For dbt Fusion engine, make sure to read requirements about using PKCS#8 format with AES-256 encryption in the following section.
      private_key_path: [path/to/private.key]
      # or private_key instead of private_key_path
      private_key_passphrase: [passphrase for the private key, if key is encrypted]

      database: [database name]
      warehouse: [warehouse name]
      schema: [dbt schema]
      threads: [1 or more]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: True # default: true
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
```

</File>

#### Форматы ключей для движка dbt Fusion

Fusion требует использования современных форматов ключей и не поддерживает устаревшее шифрование 3DES или ключи без заголовков. Мы рекомендуем использовать формат PKCS#8 с шифрованием AES-256 для аутентификации по ключевой паре в Fusion. Использование более старых форматов ключей может приводить к ошибкам аутентификации.

Если вы сталкиваетесь с ошибкой `Key is PKCS#1 (RSA private key). Snowflake requires PKCS#8`, это означает, что ваш приватный ключ имеет неверный формат. В этом случае у вас есть два варианта:

- **(Рекомендуемое решение)** Повторно экспортировать ключ с использованием современного шифрования:

  ```bash
  # Convert to PKCS#8 with AES-256 encryption
  openssl genrsa 2048 | openssl pkcs8 -topk8 -v2 aes-256-cbc -inform PEM -out rsa_key.p8

  ```

- **(Временный обходной путь)** Добавить заголовок `BEGIN` и завершающий блок `END` к вашему PEM‑содержимому:

  ```bash
  -----BEGIN ENCRYPTED PRIVATE KEY-----
  < your existing encrypted private key contents >
  -----END ENCRYPTED PRIVATE KEY-----
  ```


### Аутентификация через SSO

Чтобы использовать аутентификацию SSO для Snowflake, не указывайте `password`, а вместо этого задайте параметр `authenticator` со значением `'externalbrowser'` в конфигурации вашего target.

См. пример ниже:

<File name='~/.dbt/profiles.yml'>

```yaml
my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: [account id] # Snowflake <account_name>
      user: [username] # Snowflake username
      role: [user role] # Snowflake user role

      # SSO config
      authenticator: externalbrowser

      database: [database name] # Snowflake database name
      warehouse: [warehouse name] # Snowflake warehouse name
      schema: [dbt schema]
      threads: [between 1 and 8]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: True # default: true
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
```

</File>

</VersionBlock>

**Примечание**: Чтобы избежать запросов аутентификации для каждого подключения dbt (что может приводить к открытию десятков вкладок SSO), включите [кэширование подключений](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-use#using-connection-caching-to-minimize-the-number-of-prompts-for-authentication-optional) в вашем хранилище Snowflake, выполнив команду `alter account set allow_id_token = true;` с ролью ACCOUNTADMIN.

### Авторизация OAuth

Чтобы узнать, как настроить OAuth в Snowflake, обратитесь к их [документации](https://docs.snowflake.com/en/user-guide/oauth-snowflake-overview). Ваш администратор Snowflake должен сгенерировать [OAuth токен](https://community.snowflake.com/s/article/HOW-TO-OAUTH-TOKEN-GENERATION-USING-SNOWFLAKE-CUSTOM-OAUTH) для работы вашей конфигурации.

Укажите OAUTH_REDIRECT_URI в Snowflake: `http://localhost:PORT_NUMBER`. Например, `http://localhost:8080`.

После того, как ваш администратор Snowflake настроит OAuth, добавьте следующее в ваш файл `profiles.yml`:

```yaml

my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: [account id]
      
      # The following fields are retrieved from the Snowflake configuration
      authenticator: oauth
      oauth_client_id: [OAuth client id]
      oauth_client_secret: [OAuth client secret]
      token: [OAuth refresh token]
```

## Конфигурации

"Базовые" конфигурации для целей Snowflake показаны ниже. Обратите внимание, что вам также следует указать конфигурации, связанные с аутентификацией, в зависимости от используемого метода аутентификации, как описано выше.

### Все конфигурации

| Конфигурация | Обязательно? | Описание |
| ------ | --------- | ----------- |
| account | Yes | Аккаунт, к которому нужно подключаться, в соответствии с [документацией Snowflake](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname). См. примечания [ниже](#account) |
| user | Yes | Пользователь, под которым выполняется вход |
| database | Yes | База данных, в которой dbt должен создавать модели |
| warehouse | Yes | Warehouse, который будет использоваться при сборке моделей |
| schema | Yes | Схема, в которую по умолчанию будут собираться модели. Может быть переопределена с помощью [custom schemas](/docs/build/custom-schemas) |
| role | No (but recommended) | Роль, которая будет использоваться при выполнении запросов от имени указанного пользователя |
| client_session_keep_alive | No | Если `True`, клиент Snowflake будет поддерживать соединения дольше стандартных 4 часов. Это полезно при выполнении особенно длительных запросов (&gt; 4 часов). По умолчанию: False (см. [примечание ниже](#client_session_keep_alive)) |
| threads | No | Количество моделей, которые dbt должен собирать параллельно. Увеличьте значение при использовании более крупного warehouse. По умолчанию = 1 |
| query_tag | No | Значение, которым будут помечаться все запросы, для последующего поиска в представлении [QUERY_HISTORY](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html) |
| retry_all | No | Булев флаг, указывающий, следует ли выполнять повторные попытки при всех ошибках [Snowflake connector](https://github.com/snowflakedb/snowflake-connector-python/blob/main/src/snowflake/connector/errors.py) |
| retry_on_database_errors | No | Булев флаг, указывающий, следует ли выполнять повторные попытки после возникновения ошибок типа [snowflake.connector.errors.DatabaseError](https://github.com/snowflakedb/snowflake-connector-python/blob/ffdd6b3339aa71885878d047141fe9a77c4a4ae3/src/snowflake/connector/errors.py#L361-L364) |
| connect_retries | No | Количество повторных попыток после неудачного подключения |
| connect_timeout | No | Количество секунд ожидания между неудачными попытками подключения |
| reuse_connections | No | Булев флаг, указывающий, следует ли повторно использовать простаивающие соединения для уменьшения общего числа открытых соединений. По умолчанию `False` |
| platform_detection_timeout_seconds | No | Тайм-аут (в секундах) для определения платформы. По умолчанию `0.0`. Установите положительное значение при использовании аутентификации Workload Identity Federation (WIF) |

### account
Для AWS-аккаунтов в регионе US West по умолчанию можно использовать `abc123` (без каких-либо других сегментов). Для некоторых AWS-аккаунтов вам придется добавить регион и/или облачную платформу. Например, `abc123.eu-west-1` или `abc123.eu-west-2.aws`. 

Для аккаунтов на базе GCP и Azure необходимо добавить регион и облачную платформу, такие как `gcp` или `azure`, соответственно. Например, `abc123.us-central1.gcp`. Для получения подробной информации см. документацию Snowflake: "[Указание информации о регионе в имени хоста вашего аккаунта](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname)". 

Также обратите внимание, что имя аккаунта Snowflake должно содержать только `account_name` без префикса `organization_name`. Чтобы определить, нужно ли добавлять регион и/или облачную платформу к локатору аккаунта в устаревшем формате, см. документацию Snowflake по "[Форматы локаторов аккаунтов, не относящихся к VPS, по облачной платформе и региону](https://docs.snowflake.com/en/user-guide/admin-account-identifier#non-vps-account-locator-formats-by-cloud-platform-and-region)".

### client_session_keep_alive

Функция `client_session_keep_alive` предназначена для поддержания сессий Snowflake активными дольше стандартного лимита таймаута в 4 часа. Реализация этой функции в `snowflake-connector-python` может приводить к тому, что процессы, которые её используют (читай: dbt), в некоторых сценариях не завершаются корректно. Если вы столкнулись с этим в своём окружении dbt, пожалуйста, сообщите нам об этом в [GitHub issue](https://github.com/dbt-labs/dbt-core/issues/1271) и используйте обходное решение — отключите keepalive.

### platform_detection_timeout_seconds

Коннектор Snowflake использует параметр `platform_detection_timeout_seconds`, чтобы определить, сколько времени он будет ждать при попытке определить облачную платформу для подключения. Этот параметр доступен начиная с версии <Constant name="core"/> v1.10.

- Установите значение `0.0` (по умолчанию), чтобы отключить определение облачной платформы и ускорить установление соединения.
- Устанавливайте положительное значение только в том случае, если вы используете аутентификацию WIF, которая требует, чтобы коннектор определял облачное окружение.

### query_tag

[Теги запросов](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) — это параметр Snowflake, который может быть весьма полезен в дальнейшем при поиске в [представлении QUERY_HISTORY](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

### reuse_connections

Во время выполнения узлов (таких как модель и тест) dbt открывает соединения с хранилищем Snowflake. Установка этой конфигурации в `True` сокращает время выполнения, проверяя учетные данные только один раз для каждого потока.

### retry_on_database_errors

Флаг `retry_on_database_errors` вместе с указанием количества `connect_retries` предназначен для настройки повторных попыток после того, как snowflake connector сталкивается с ошибками типа snowflake.connector.errors.DatabaseError. Эти повторные попытки могут быть полезны для обработки ошибок типа "JWT token is invalid" при использовании аутентификации с парой ключей.

By default, `retry_on_database_errors` is set to `False` when using <Constant name="core" /> (for example, if you're running dbt locally with `pip install dbt-core dbt-snowflake`).

However, in the <Constant name="dbt_platform" />, this setting is automatically set to `True`, unless the user explicitly configures it. 

### retry_all

Флаг `retry_all` вместе с указанием количества `connect_retries` предназначен для того, чтобы сделать повторы попыток подключения настраиваемыми после того, как коннектор Snowflake столкнётся с любой ошибкой.
