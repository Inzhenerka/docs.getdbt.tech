---
title: "Настройка Snowflake"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Snowflake в dbt."
id: "snowflake-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-snowflake'
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

<VersionBlock lastVersion="1.8">

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
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: False
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
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: False
```

</VersionBlock>

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
      retry_on_database_errors: False # default: false
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
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
```

</VersionBlock>

Вместе с добавлением параметра `authenticator`, обязательно выполните `alter account set allow_client_mfa_caching = true;` в вашем хранилище Snowflake. Это позволит вам легко проверять аутентификацию с помощью приложения DUO Mobile (если пропустить этот шаг, будут приходить push-уведомления для каждой модели, построенной при каждом `dbt run`).

### Аутентификация с использованием пары ключей

Чтобы использовать аутентификацию с парой ключей, укажите `private_key_path` в вашей конфигурации, избегая использования `password`. При необходимости вы можете добавить `private_key_passphrase`. **Примечание**: принимаются незашифрованные закрытые ключи, поэтому добавляйте парольную фразу только при необходимости. Однако для версий dbt Core 1.5 и 1.6 конфигурации, использующие закрытый ключ в формате PEM (например, ключи, заключенные в теги BEGIN и END), не поддерживаются. В этих версиях вы должны использовать `private_key_path` для указания местоположения файла вашего закрытого ключа.

Начиная с [версии dbt 1.7](/docs/dbt-versions/core-upgrade/upgrading-to-v1.7), dbt ввел возможность указывать `private_key` непосредственно в виде строки вместо `private_key_path`. Эта строка `private_key` может быть в формате DER, закодированном в Base64, представляющем байты ключа, или в формате PEM в виде обычного текста. Обратитесь к [документации Snowflake](https://docs.snowflake.com/en/user-guide/key-pair-auth) для получения дополнительной информации о том, как они генерируют ключ.

<VersionBlock lastVersion="1.8">

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
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: False
```

</File>

### Аутентификация SSO

Чтобы использовать аутентификацию SSO для Snowflake, не указывайте `password`, а вместо этого предоставьте конфигурацию `authenticator` для вашей цели. 
`authenticator` может быть одним из 'externalbrowser' или действительным URL-адресом Okta. 

Обратитесь к следующим вкладкам для получения дополнительной информации и примеров:

<Tabs>
<TabItem value="externalbrowser" label="externalbrowser">

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
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: False
```

</File>

</TabItem>

<TabItem value="oktaurl" label="Okta URL">

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

      # SSO config -- The three following fields are REQUIRED
      authenticator: [Okta account URL]
      username: [Okta username]
      password: [Okta password]

      database: [database name] # Snowflake database name
      warehouse: [warehouse name] # Snowflake warehouse name
      schema: [dbt schema]
      threads: [between 1 and 8]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: False
```

</File>

</TabItem>
</Tabs>

</VersionBlock>

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
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
```

</File>

### Аутентификация SSO

Чтобы использовать аутентификацию SSO для Snowflake, не указывайте `password`, а вместо этого предоставьте конфигурацию `authenticator` для вашей цели. 
`authenticator` может быть одним из 'externalbrowser' или действительным URL-адресом Okta. 

Обратитесь к следующим вкладкам для получения дополнительной информации и примеров:

<Tabs>
<TabItem value="externalbrowser" label="externalbrowser">

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
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
```

</File>

</TabItem>

<TabItem value="oktaurl" label="Okta URL">

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

      # SSO config -- The three following fields are REQUIRED
      authenticator: [Okta account URL]
      username: [Okta username]
      password: [Okta password]

      database: [database name] # Snowflake database name
      warehouse: [warehouse name] # Snowflake warehouse name
      schema: [dbt schema]
      threads: [between 1 and 8]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
```

</File>

</TabItem>
</Tabs>

</VersionBlock>

**Примечание**: По умолчанию каждое подключение, которое открывает dbt, потребует повторной аутентификации в браузере. Пакет Snowflake connector поддерживает кэширование вашего токена сессии, но он [в настоящее время поддерживает только Windows и Mac OS](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-use.html#optional-using-connection-caching-to-minimize-the-number-of-prompts-for-authentication).

Обратитесь к [документации Snowflake](https://docs.snowflake.com/en/sql-reference/parameters.html#label-allow-id-token) для получения информации о том, как включить эту функцию в вашем аккаунте.

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
| account | Да | Аккаунт для подключения в соответствии с [документацией Snowflake](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname). См. примечания [ниже](#account) |
| user | Да | Пользователь для входа |
| database | Да | База данных, в которой dbt должен создавать модели |
| warehouse | Да | Хранилище, используемое при построении моделей |
| schema | Да | Схема, в которую по умолчанию строятся модели. Может быть переопределена с помощью [пользовательских схем](/docs/build/custom-schemas) |
| role | Нет (но рекомендуется) | Роль, которую следует принять при выполнении запросов от имени указанного пользователя. |
| client_session_keep_alive | Нет | Если `True`, клиент Snowflake будет поддерживать соединения дольше, чем стандартные 4 часа. Это полезно при выполнении особенно длительных запросов (&gt; 4 часов). По умолчанию: False (см. [примечание ниже](#client_session_keep_alive)) |
| threads | Нет | Количество параллельных моделей, которые должен строить dbt. Установите это значение выше, если используете большее хранилище. По умолчанию=1 |
| query_tag | Нет | Значение, с которым будут помечены все запросы, для последующего поиска в [представлении QUERY_HISTORY](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html) |
| retry_all | Нет | Логический флаг, указывающий, следует ли повторять попытки при всех [ошибках Snowflake connector](https://github.com/snowflakedb/snowflake-connector-python/blob/main/src/snowflake/connector/errors.py) |
| retry_on_database_errors | Нет | Логический флаг, указывающий, следует ли повторять попытки после возникновения ошибок типа [snowflake.connector.errors.DatabaseError](https://github.com/snowflakedb/snowflake-connector-python/blob/ffdd6b3339aa71885878d047141fe9a77c4a4ae3/src/snowflake/connector/errors.py#L361-L364) |
| connect_retries | Нет | Количество попыток повторного подключения после неудачного соединения |
| connect_timeout | Нет | Количество секунд ожидания между неудачными попытками подключения |
| reuse_connections | Нет | Логический флаг, указывающий, следует ли повторно использовать неактивные соединения для уменьшения общего количества открытых соединений. По умолчанию `False`. |

### account
Для AWS-аккаунтов в регионе US West по умолчанию можно использовать `abc123` (без каких-либо других сегментов). Для некоторых AWS-аккаунтов вам придется добавить регион и/или облачную платформу. Например, `abc123.eu-west-1` или `abc123.eu-west-2.aws`. 

Для аккаунтов на базе GCP и Azure необходимо добавить регион и облачную платформу, такие как `gcp` или `azure`, соответственно. Например, `abc123.us-central1.gcp`. Для получения подробной информации см. документацию Snowflake: "[Указание информации о регионе в имени хоста вашего аккаунта](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname)". 

Также обратите внимание, что имя аккаунта Snowflake должно содержать только `account_name` без префикса `organization_name`. Чтобы определить, нужно ли добавлять регион и/или облачную платформу к локатору аккаунта в устаревшем формате, см. документацию Snowflake по "[Форматы локаторов аккаунтов, не относящихся к VPS, по облачной платформе и региону](https://docs.snowflake.com/en/user-guide/admin-account-identifier#non-vps-account-locator-formats-by-cloud-platform-and-region)".

### client_session_keep_alive

Функция `client_session_keep_alive` предназначена для поддержания сессий Snowflake активными сверх типичного лимита тайм-аута в 4 часа. Реализация этой функции в snowflake-connector-python может предотвратить завершение процессов, которые ее используют (читайте: dbt) в определенных сценариях. Если вы столкнетесь с этим в вашем развертывании dbt, пожалуйста, сообщите нам в [GitHub issue](https://github.com/dbt-labs/dbt-core/issues/1271), и обойдите это, отключив keepalive.

### query_tag

[Теги запросов](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) — это параметр Snowflake, который может быть весьма полезен в дальнейшем при поиске в [представлении QUERY_HISTORY](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

### reuse_connections

Во время выполнения узлов (таких как модель и тест) dbt открывает соединения с хранилищем Snowflake. Установка этой конфигурации в `True` сокращает время выполнения, проверяя учетные данные только один раз для каждого потока.

### retry_on_database_errors

Флаг `retry_on_database_errors` вместе с указанием количества `connect_retries` предназначен для настройки повторных попыток после того, как snowflake connector сталкивается с ошибками типа snowflake.connector.errors.DatabaseError. Эти повторные попытки могут быть полезны для обработки ошибок типа "JWT token is invalid" при использовании аутентификации с парой ключей.

### retry_all

Флаг `retry_all` вместе с указанием количества `connect_retries` предназначен для настройки повторных попыток после того, как snowflake connector сталкивается с любой ошибкой.