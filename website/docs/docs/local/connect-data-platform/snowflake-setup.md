---
title: "Настройка Snowflake"
sidebar_label: "Snowflake"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища данных Snowflake в dbt."
id: "snowflake-setup"
meta:
  maintained_by: dbt Labs
  authors: 'dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-snowflake'
  min_core_version: 'v0.8.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-snowflake'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Snowflake'
  config_page: '/reference/resource-configs/snowflake-configs'
availability: local_free
---

<VersionBlock firstVersion="2.0">

# Connect Snowflake to <Constant name="fusion" />

You can configure the Snowflake adapter by running `dbt init` in your CLI or manually providing the `profiles.yml` file with the fields configured for your authentication type. To check out which Snowflake functions are supported in <Constant name="fusion"/> in `strict` mode, refer to [Snowflake function support](/reference/resource-configs/snowflake-function-support).

The Snowflake adapter for <Constant name="fusion" /> supports the following [authentication methods](#supported-authentication-types):
- Password 
- Key pair
- Single sign-on (SSO)
- Password with MFA
- Workload Identity Federation

:::note
[Snowflake is deprecating single-access password login](https://docs.snowflake.com/en/user-guide/security-mfa-rollout). Individual developers should use MFA or SSO instead of password authentication. Password-based login remains supported for service users (Snowflake user type: `LEGACY_SERVICE`).
:::

## Warehouse permissions

import FusionSnowflakeWarehousePerms from '/snippets/_v2-warehouse-permissions-snowflake.md';

<FusionSnowflakeWarehousePerms />

For role examples and SQL grants in Snowflake, you can also refer to [Snowflake permissions](/reference/database-permissions/snowflake-permissions).

## Snowflake configuration details

The information required for configuring the Snowflake adapter can be found conveniently in your Snowflake account menu:
1. Click on your name from the Snowflake sidebar. 
2. Hover over the **Account** field.
3. In the field with your account name, click **View account details**.
4. Click **Config file** and select the appropriate **Warehouse** and **Database**. 

<Lightbox src="/img/v2/connect-adapters/snowflake-account-details.png" width="60%" title="Sample config file in Snowflake." />

## Configure <Constant name="fusion" />

Executing `dbt init` in your CLI will prompt for the following fields:

- **Account:** Snowflake account number
- **User:** Your Snowflake username
- **Database:** The database within your Snowflake account to connect to your project
- **Warehouse:** The compute warehouse that will handle the tasks for your project
- **Schema:** The development/staging/deployment schema for the project
- **Role (Optional):** The role dbt should assume when connecting to the warehouse


Alternatively, you can manually create the `profiles.yml` file and configure the fields. See examples in [authentication](#supported-authentication-types) section for formatting. If there is an existing `profiles.yml` file, you are given the option to retain the existing fields or overwrite them. 

Next, select your authentication method. Follow the on-screen prompts to provide the required information.

## Supported authentication types

<Tabs>

<TabItem value="Password">

Password authentication prompts for your Snowflake account password. This is becoming an increasingly less common option as organizations opt for more secure authentication.

Selecting **Password with MFA** redirects you to the Snowflake account login to provide your passkey or authenticator password.

#### Example password configuration

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

#### Example password with MFA configuration

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
      warehouse: TRANSFORM
      schema: JANE_SMITH
```

</File>

</TabItem>

<TabItem value="Key pair">

Key pair authentication gives you the option to:
- Define the path to the key. 
- Provide the plain-text PEM format key inline.

import FusionKeyPair from '/snippets/_v2-key-pair.md';

<FusionKeyPair />

  Once the key is configured, you will be given the option to provide a passphrase, if required. 

#### Example key pair configuration

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

Single sign-on will leverage your browser to authenticate the Snowflake session.

By default, every connection that dbt opens will require you to re-authenticate in a browser. The Snowflake connector package supports caching your session token, but it [currently only supports Windows and Mac OS](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-use.html#optional-using-connection-caching-to-minimize-the-number-of-prompts-for-authentication).

Refer to the [Snowflake docs](https://docs.snowflake.com/en/sql-reference/parameters.html#label-allow-id-token) for information on enabling this feature in your account.

#### Example SSO configuration

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

<TabItem value="Workload Identity Federation">

Workload Identity Federation (WIF) lets you authenticate to Snowflake from a cloud workload using that platform's identity. Snowflake maps that identity to a service user, so you don't store a password or key. You can use an OpenID Connect (OIDC) token, such as one issued to a GitHub Actions workflow, or a native identity from AWS, Azure, or GCP.

Before you configure dbt, create a Snowflake service user with workload identity. For that setup, refer to the [Snowflake documentation](https://docs.snowflake.com/en/user-guide/workload-identity-federation).

To authenticate with WIF, configure the following fields in your `profiles.yml` file:

<SimpleTable>

| Config | Required? | Description |
| ------ | --------- | ----------- |
| `method` | Yes | Set to `workload_identity`. |
| `workload_identity_provider` | Yes | The identity provider. Must be one of `OIDC`, `AWS`, `AZURE`, or `GCP`. |
| `token` | No | Required for OIDC; pass it with `env_var()`. Omit this field for AWS, Azure, or GCP. |
| `workload_identity_entra_resource` | No | Azure only. Leave this unset unless Snowflake expects a custom Entra app as the token audience. Set it to that app's application ID URI (for example `api://APPLICATION_ID`). |

</SimpleTable>

Do not set the `authenticator` field. Setting both `method` and `authenticator` will prevent the profile from working.

The `user` field is optional. Snowflake uses the service user mapped to this cloud identity.

The following example uses OIDC:

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: snowflake
      threads: 16
      account: ACCOUNT_ID  # Snowflake account identifier
      role: USER_ROLE  # Snowflake role to assume
      database: DATABASE_NAME  # Snowflake database
      warehouse: WAREHOUSE_NAME  # Snowflake warehouse
      schema: SCHEMA_NAME  # dbt schema

      method: workload_identity
      workload_identity_provider: OIDC  # Or AWS, AZURE, or GCP
      token: "{{ env_var('SNOWFLAKE_TOKEN') }}"  # OIDC token
```

</File>

For AWS, Azure, or GCP, use the same configuration, but change the `workload_identity_provider` value and omit `token`. AWS, Azure, and GCP only work when dbt is running in that cloud environment.

</TabItem>

</Tabs>

## More information

Find Snowflake-specific configuration information in the [Snowflake adapter reference guide](/reference/resource-configs/snowflake-configs).

</VersionBlock>

<VersionBlock lastVersion="1.99">

# Connect Snowflake to <Constant name="core" />

<ProductCard text="dbt v2 compatible" url="/docs/local/connect-data-platform/snowflake-setup?version=2" /> connection also available.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>

import SnowflakeColumn from '/snippets/_snowflake-column-size.md';

<SnowflakeColumn />

### Аутентификация с использованием имени пользователя и пароля {#user-password-authentication}

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

### Аутентификация с использованием имени пользователя, пароля и DUO MFA {#user-password-duo-mfa-authentication}

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

### Аутентификация с использованием пары ключей {#key-pair-authentication}

Чтобы использовать аутентификацию с помощью пары ключей, укажите `private_key_path` в конфигурации, не используя `password`. При необходимости можно добавить `private_key_passphrase`. **Примечание**: Незашифрованные закрытые ключи также поддерживаются, поэтому добавляйте парольную фразу только при необходимости. Однако в dbt v1.5 и v1.6 не поддерживаются конфигурации, в которых закрытый ключ указан непосредственно в формате PEM (например, ключи, заключённые между тегами BEGIN и END). В этих версиях необходимо использовать `private_key_path`, чтобы указать расположение файла закрытого ключа.

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
      # For dbt v2, make sure to read requirements about using PKCS#8 format with AES-256 encryption in the following section.
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

#### Форматы ключей для <Constant name="fusion_engine" />

<Constant name="fusion" /> требует использования современных форматов ключей и не поддерживает устаревшее шифрование 3DES и ключи без заголовков.  Для аутентификации по паре ключей в <Constant name="fusion" /> рекомендуем использовать формат PKCS#8 с шифрованием AES-256. Использование устаревших форматов ключей может привести к сбоям аутентификации.

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


### Аутентификация через SSO {#sso-authentication}

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

### Авторизация OAuth {#oauth-authorization}

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

<VersionBlock firstVersion="1.12">

### Федерация удостоверений рабочих нагрузок

Федерация удостоверений рабочих нагрузок (Workload Identity Federation, WIF) позволяет проходить аутентификацию в Snowflake из облачной рабочей нагрузки, используя удостоверение этой платформы. Snowflake сопоставляет это удостоверение со служебным пользователем, поэтому хранить пароль или ключ не требуется. Вы можете использовать токен OpenID Connect (OIDC), например выданный рабочему процессу GitHub Actions, или собственное удостоверение AWS, Azure или GCP.

Прежде чем настраивать dbt, создайте в Snowflake служебного пользователя с удостоверением рабочей нагрузки. Инструкции по настройке приведены в [документации Snowflake](https://docs.snowflake.com/en/user-guide/workload-identity-federation).

Для аутентификации с помощью WIF настройте следующие поля в файле `profiles.yml`:

<SimpleTable>

| Параметр | Обязательный? | Описание |
| ------ | --------- | ----------- |
| `authenticator` | Да | Установите значение `workload_identity`. |
| `workload_identity_provider` | Да | Поставщик удостоверений. Допустимые значения: `OIDC`, `AWS`, `AZURE` или `GCP`. |
| `token` | Нет | Обязателен для OIDC; передавайте его с помощью `env_var()`. Не указывайте это поле для AWS, Azure или GCP. |
| `workload_identity_entra_resource` | Нет | Только для Azure. Не задавайте этот параметр, если Snowflake не ожидает пользовательское приложение Entra в качестве целевой аудитории токена. В таком случае укажите URI идентификатора этого приложения (например, `api://APPLICATION_ID`). |
| `platform_detection_timeout_seconds` | Нет | Установите положительное значение при использовании AWS, Azure или GCP, чтобы коннектор мог определить облачную среду. Значение по умолчанию — `0.0`, при котором определение среды пропускается. |

</SimpleTable>

Поле `user` необязательно. Snowflake использует служебного пользователя, сопоставленного с этим облачным удостоверением.

В следующем примере используется OIDC:

<File name='~/.dbt/profiles.yml'>

```yaml
my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: ACCOUNT_ID  # Идентификатор учетной записи Snowflake
      role: USER_ROLE  # Используемая роль Snowflake
      database: DATABASE_NAME  # База данных Snowflake
      warehouse: WAREHOUSE_NAME  # Виртуальный склад Snowflake
      schema: SCHEMA_NAME  # Схема dbt
      threads: 1

      authenticator: workload_identity
      workload_identity_provider: OIDC  # Или AWS, AZURE или GCP
      token: "{{ env_var('SNOWFLAKE_TOKEN') }}"  # Токен OIDC
```

</File>

Для AWS, Azure или GCP используйте ту же конфигурацию, но измените значение `workload_identity_provider` и не указывайте `token`.

</VersionBlock>

## Настройки

"Базовые" конфигурации для целей Snowflake показаны ниже. Обратите внимание, что вам также следует указать конфигурации, связанные с аутентификацией, в зависимости от используемого метода аутентификации, как описано выше.

### Все конфигурации {#all-configurations}

| Конфигурация | Обязательно? | Описание |
| ------ | --------- | ----------- |
| account | Да | Аккаунт для подключения, указанный в соответствии с [документацией Snowflake](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname). См. примечания [ниже](#snowflake-configuration-details) |
| user | Да | Пользователь для входа в систему. Необязателен при использовании Workload Identity Federation. |
| database | Да | База данных, в которой dbt должен создавать модели |
| warehouse | Да | Вычислительный склад для построения моделей |
| schema | Да | Схема, в которой по умолчанию создаются модели. Можно переопределить с помощью [пользовательских схем](/docs/build/custom-schemas) |
| role | Нет (но рекомендуется) | Роль, используемая при выполнении запросов от имени указанного пользователя. |
| client_session_keep_alive | Нет | Если задано `True`, клиент Snowflake будет поддерживать соединения дольше стандартных 4 часов. Это полезно при выполнении особо длительных запросов (&gt; 4 часов). Значение по умолчанию: False (см. [примечание ниже](#client_session_keep_alive)) |
| threads | Нет | Количество моделей, которые dbt должен строить одновременно. Увеличьте это значение, если используете более мощный вычислительный склад. Значение по умолчанию: 1 |
| query_tag | Нет | Значение, которым помечаются все запросы для последующего поиска в [представлении QUERY_HISTORY](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html) |
| retry_all | Нет | Логический флаг, определяющий, следует ли повторять попытку при любых [ошибках коннектора Snowflake](https://github.com/snowflakedb/snowflake-connector-python/blob/main/src/snowflake/connector/errors.py) |
| retry_on_database_errors | Нет | Логический флаг, определяющий, следует ли повторять попытку при возникновении ошибок типа [snowflake.connector.errors.DatabaseError](https://github.com/snowflakedb/snowflake-connector-python/blob/ffdd6b3339aa71885878d047141fe9a77c4a4ae3/src/snowflake/connector/errors.py#L361-L364) |
| connect_retries | Нет | Количество повторных попыток после неудачного подключения |
| connect_timeout | Нет | Время ожидания в секундах между неудачными попытками подключения |
| reuse_connections | Нет | Логический флаг, определяющий, следует ли повторно использовать простаивающие соединения, чтобы сократить общее количество открываемых соединений. Значение по умолчанию — `True`, если `client_session_keep_alive` имеет значение `False` или не задан; в противном случае — `None` (необходимо задать явно).|
| platform_detection_timeout_seconds | Нет | Время ожидания (в секундах) при определении платформы. Значение по умолчанию — `0.0`. Задайте положительное значение, если используете аутентификацию Workload Identity Federation (WIF).|

### account {#account}
Для AWS-аккаунтов в регионе US West по умолчанию можно использовать `abc123` (без каких-либо других сегментов). Для некоторых AWS-аккаунтов вам придется добавить регион и/или облачную платформу. Например, `abc123.eu-west-1` или `abc123.eu-west-2.aws`. 

Для учетных записей на базе GCP и Azure необходимо добавить регион, а также может потребоваться указать облачную платформу: `.gcp` или `.azure` соответственно. Например, `abc123.us-central1.gcp`. Однако если при попытке подключения возникает ошибка `404`, повторите попытку без указания платформы (например, удалите `.azure`). Подробнее см. в документации Snowflake: «[Указание региона в имени хоста вашей учетной записи](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname)».

Также обратите внимание, что имя аккаунта Snowflake должно содержать только `account_name` без префикса `organization_name`. Чтобы определить, нужно ли добавлять регион и/или облачную платформу к локатору аккаунта в устаревшем формате, см. документацию Snowflake по "[Форматы локаторов аккаунтов, не относящихся к VPS, по облачной платформе и региону](https://docs.snowflake.com/en/user-guide/admin-account-identifier#non-vps-account-locator-formats-by-cloud-platform-and-region)".

### client_session_keep_alive {#clientsessionkeep_alive}

Функция `client_session_keep_alive` предназначена для поддержания сеансов Snowflake активными дольше стандартного времени ожидания, составляющего 4 часа. Реализация этой функции в snowflake-connector-python в определённых сценариях может препятствовать завершению процессов, которые её используют (то есть dbt). Если вы столкнулись с этим при использовании dbt в своей среде, сообщите нам об этом в [задаче на GitHub](https://github.com/dbt-labs/dbt/issues/1271), а в качестве обходного решения отключите keepalive.

### platform_detection_timeout_seconds {#platformdetectiontimeout_seconds}

Коннектор Snowflake использует параметр `platform_detection_timeout_seconds`, чтобы определить, сколько времени ожидать определения облачной платформы для подключения. Этот параметр доступен начиная с версии <Constant name="dbt"/> v1.10.

- Установите значение `0.0` (по умолчанию), чтобы отключить определение облачной платформы и ускорить установление соединения.
- Устанавливайте положительное значение только в том случае, если вы используете аутентификацию WIF, которая требует, чтобы коннектор определял облачное окружение.

- Установите значение `0.0` (по умолчанию), чтобы отключить определение облачной платформы для ускорения подключений.
- Установите положительное значение, если вы используете WIF с AWS, Azure или GCP: в этом случае коннектору необходимо определять облачную среду.

[Теги запросов](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) — это параметр Snowflake, который может быть весьма полезен в дальнейшем при поиске в [представлении QUERY_HISTORY](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

### reuse_connections {#reuse_connections}

Во время выполнения узлов (таких как модель и тест) dbt открывает соединения с хранилищем Snowflake. Установка этой конфигурации в `True` сокращает время выполнения, проверяя учетные данные только один раз для каждого потока.

### retry_on_database_errors {#retryondatabase_errors}

### retry_on_database_errors

Флаг `retry_on_database_errors` вместе с параметром `connect_retries`, задающим количество повторных попыток, позволяет настраивать повторные попытки подключения при возникновении в коннекторе Snowflake ошибок типа snowflake.connector.errors.DatabaseError. Эти повторные попытки могут быть полезны для обработки ошибок типа «JWT token is invalid» при использовании аутентификации с помощью пары ключей.

По умолчанию `retry_on_database_errors` имеет значение `False` при использовании <Constant name="core" /> (например, если вы запускаете dbt локально, установив его с помощью `pip install dbt-snowflake`).

По умолчанию `retry_on_database_errors` имеет значение `False` при использовании <Constant name="core" /> (например, если вы запускаете dbt локально с помощью `pip install dbt-core dbt-snowflake`).
  
However, in the <Constant name="dbt_platform" />, this setting is automatically set to `True`, unless the user explicitly configures it. 

### retry_all {#retry_all}

</VersionBlock>
