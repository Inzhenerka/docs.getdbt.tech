---
title: "Настройка Redshift"
sidebar_label: "Redshift"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища данных Redshift в dbt."
id: "redshift-setup"
meta:
  maintained_by: dbt Labs
  authors: 'dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-redshift'
  min_core_version: 'v0.10.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-redshift'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Redshift'
  config_page: '/reference/resource-configs/redshift-configs'
availability: local_free
---

import RedshiftBrowserIdc from '/snippets/_redshift-browser-identity-center.md';
import RedshiftIdentifierCase from '/snippets/_redshift-identifier-case.md';

<VersionBlock firstVersion="2.0">

# Connect Redshift to <Constant name="fusion" />

You can configure the Redshift adapter by running `dbt init` in your CLI or manually providing the `profiles.yml` file with the fields configured for your authentication type.

The Redshift adapter for <Constant name="fusion" /> supports the following [authentication methods](#supported-authentication-types):
- Password
- IAM profile
- IAM Identity Center (browser)

## Warehouse permissions

import FusionRedshiftWarehousePerms from '/snippets/_v2-warehouse-permissions-redshift.md';

<FusionRedshiftWarehousePerms />

For example SQL grants in Redshift, refer to [Redshift permissions](/reference/database-permissions/redshift-permissions).

## Configure <Constant name="fusion" />

Executing `dbt init` in your CLI will prompt for the following fields:
- **Host:** The hostname of your Redshift cluster
- **User:** Username of the account that will be connecting to the database
- **Database:** The database name
- **Schema:** The schema name
- **Port (default: 5439):** Port for your Redshift environment

Alternatively, you can manually create the `profiles.yml` file and configure the fields. See examples in [authentication](#supported-authentication-types) section for formatting. If there is an existing `profiles.yml` file, you are given the option to retain the existing fields or overwrite them. 

Next, select your authentication method. Follow the on-screen prompts to provide the required information.

## Supported authentication types

<Tabs>
<TabItem value="Password">

Use your Redshift user's password to authenticate. You can also manually enter it in plain text into the `profiles.yml` file configuration.

#### Example password configuration

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

Specify the IAM profile to use to connect your v2 sessions. You will need to provide the following information:
- **IAM Profile:** The profile name
- **Cluster ID:** The unique identifier for your AWS cluster
- **Region:** Your AWS region (for example, us-east-1)
- **Use RA3 node type (y/n):** Use high performance AWS RA3 node

#### Example IAM profile configuration

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

<TabItem value="IAM Identity Center (browser)">

<RedshiftBrowserIdc />

</TabItem>
</Tabs>

## Identifier case

<RedshiftIdentifierCase />

## More information

Find Redshift-specific configuration information in the [Redshift adapter reference guide](/reference/resource-configs/redshift-configs).

</VersionBlock>

<VersionBlock lastVersion="1.99">

# Connect Redshift to <Constant name="core" />

<ProductCard text="dbt v2 compatible" url="/docs/local/connect-data-platform/redshift-setup?version=2" /> connection also available.

import SetUpPages from '/snippets/_setup-pages-intro.md';
import RedshiftDatasharing from '/snippets/_redshift-datasharing.md';

<SetUpPages meta={frontMatter.meta} />

## Конфигурации {#configurations}

| Поле профиля | Пример | Описание |
| ------------- | ------- | ------------ |
| `type` | redshift | Тип хранилища данных, к которому вы подключаетесь|
| `host` | `hostname.region.redshift.amazonaws.com` или `workgroup.account.region.redshift-serverless.amazonaws.com` | Хост кластера|
| `port`  | 5439 | Порт вашей среды Redshift|
| `dbname`  | my_db | Имя базы данных|
| `schema`  | my_schema | Имя схемы|
| `connect_timeout`  | 30 | Время ожидания подключения в секундах. По умолчанию — `None` |
| `sslmode`  | prefer | Необязательный параметр, задающий режим sslmode для подключения к базе данных. По умолчанию — `prefer`, при котором для подключения используется 'verify-ca'. Дополнительные сведения о `sslmode` см. в примечании о Redshift ниже |
| `role`  | None | Необязательный параметр, идентификатор пользователя текущего сеанса |
| `autocreate`  | false | Необязательный параметр, по умолчанию — `False`. Создаёт пользователя, если он не существует |
| `db_groups`  | ['ANALYSTS'] | Необязательный параметр. Список имён существующих групп базы данных, к которым DbUser присоединяется на время текущего сеанса |
| `ra3_node`  | true | Необязательный параметр, по умолчанию — `False`. Позволяет использовать источники из других баз данных. Сохранён для обратной совместимости; в новых проектах используйте вместо него `datasharing`. |
| `datasharing` | true | Необязательный параметр, по умолчанию — `False`. Включает доступ между базами данных и кластерами для [Redshift Datasharing](https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html). Доступен в `dbt-redshift` версии v1.11.0rc1 и более поздних. |
| `autocommit`  | true | Необязательный параметр, по умолчанию — `True`. Включает автоматическую фиксацию транзакции после каждой SQL-инструкции |
| `retries`  | 1 | Количество повторных попыток выполнения каждой SQL-инструкции |
| `retry_all`  | true | Позволяет dbt повторять выполнение всех SQL-инструкций в запросе|
| `tcp_keepalive`  | true | Позволяет dbt предотвращать разрыв неактивных соединений промежуточными межсетевыми экранами или балансировщиками нагрузки |
| `tcp_keepalive_idle`  | 200 | Время бездействия в секундах до отправки первой проверочной посылки keep-alive |
| `tcp_keepalive_interval`  | 200 | Время бездействия в секундах до отправки следующей проверочной посылки |
| `tcp_keepalive_count`  | 5 | Количество отправляемых проверочных посылок |
| `drop_without_cascade`  | false | Необязательный параметр, по умолчанию — `False`. Исключает `CASCADE` из SQL-инструкций `DROP TABLE/VIEW/MATERIALIZED VIEW`. Доступен в `dbt-redshift` версии v1.11.0rc3 и более поздних. |

Для настройки параметров `tcp_keepalive` рекомендуем ознакомиться с [документацией Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/troubleshooting-connections.html), чтобы подобрать конфигурацию, оптимально подходящую для вашего случая.

## Параметры аутентификации {#authentication-parameters}

Методы аутентификации, которые поддерживает dbt Core на Redshift, включают:

Методы аутентификации, которые <Constant name="core" /> поддерживает для Redshift:

<Constant name="core" /> поддерживает следующие методы аутентификации в Redshift: 

- `Database` &mdash; Аутентификация по паролю (используется по умолчанию, если `method` не указан)
- `IAM User` &mdash; Аутентификация пользователя IAM через профиль AWS
- `IAM Identity Center` &mdash; Вход через браузер с использованием AWS IAM Identity Center

Выберите один из этих методов аутентификации, чтобы узнать подробнее о настройке профиля подключения. На каждой вкладке также приведён пример файла конфигурации `profiles.yml` для ознакомления.

<Tabs
  defaultValue="database"
  values={[
    {label: 'Database', value: 'database'},
    {label: 'IAM User via AWS Profile', value: 'iam-user-profile'},
    {label: 'IAM Identity Center (browser)', value: 'browser-identity-center'}]
}>

<TabItem value="database">

Следующая таблица содержит параметры для метода подключения на основе базы данных (пароль).

| Поле профиля | Пример | Описание |
| ------------- | ------- | ------------ |
| `method` | database| Оставьте этот параметр неконфигурированным или установите его в database |
| `user`   | username | Имя пользователя учетной записи для входа в ваш кластер |
| `password`  | password1 | Пароль для аутентификации  |

<br/>

#### Пример profiles.yml для аутентификации базы данных {#example-profilesyml-for-database-authentication}

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: redshift
      host: hostname.region.redshift.amazonaws.com
      user: username
      password: password1
      dbname: analytics
      schema: analytics
      port: 5439

      # Необязательные конфигурации Redshift:
      sslmode: prefer
      role: None
      ra3_node: true
      datasharing: true
      autocommit: true
      threads: 4
      connect_timeout: None

```

</File>

</TabItem>

<TabItem value="iam-user-profile">

Следующая таблица перечисляет параметры аутентификации для использования аутентификации IAM.
  
Чтобы настроить профиль Redshift с использованием аутентификации IAM, установите параметр `method` в `iam`, как показано ниже. Обратите внимание, что пароль не требуется при использовании аутентификации IAM. Для получения дополнительной информации об этом типе аутентификации обратитесь к [документации Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/generating-user-credentials.html) и [документации boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/redshift.html#Redshift.Client.get_cluster_credentials) о генерации учетных данных пользователя с помощью IAM Auth.

Если вы получаете ошибку "You must specify a region" при использовании аутентификации IAM, вероятно, ваши учетные данные AWS настроены неправильно. Попробуйте запустить `aws configure`, чтобы настроить ключи доступа AWS, и выберите регион по умолчанию. Если у вас есть вопросы, пожалуйста, обратитесь к официальной документации AWS о [настройках конфигурации и файлов учетных данных](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

| Поле профиля | Пример | Описание |
| ------------- | ------- | ------------ |
| `method` |IAM| Используйте IAM для аутентификации от имени пользователя IAM |
| `iam_profile` | analyst | dbt будет использовать указанный профиль из вашего файла ~/.aws/config |
| `cluster_id` | cluster_id| Требуется для аутентификации IAM только для выделенного кластера, но не для Serverless |
| `user`   | username | Пользователь, выполняющий запросы к базе данных; игнорируется для Serverless (но поле по-прежнему обязательно) |
| `region`  | us-east-1 | Регион вашего экземпляра Redshift |


<br/>

#### Пример profiles.yml для IAM {#example-profilesyml-for-iam}

<File name='~/.dbt/profiles.yml'>

```yaml
  my-redshift-db:
  target: dev
  outputs:
    dev:
      type: redshift
      method: iam
      cluster_id: CLUSTER_ID
      host: hostname.region.redshift.amazonaws.com
      user: alice
      iam_profile: analyst
      region: us-east-1
      dbname: analytics
      schema: analytics
      port: 5439

      # Необязательные конфигурации Redshift:
      threads: 4
      connect_timeout: None 
      [retries](#retries): 1 
      role: None
      sslmode: prefer
      ra3_node: true
      datasharing: true
      autocommit: true
      autocreate: true
      db_groups: ['ANALYSTS']

```

</File>

#### Указание профиля IAM {#specifying-an-iam-profile}

Когда установлена конфигурация `iam_profile`, dbt будет использовать указанный профиль из вашего файла `~/.aws/config` вместо использования имени профиля `default`.

</TabItem>

<TabItem value="browser-identity-center">

<RedshiftBrowserIdc />

</TabItem>
</Tabs>

## Примечания к Redshift {#redshift-notes}

### Регистр идентификаторов

<RedshiftIdentifierCase />

### Изменение `sslmode`

До dbt-redshift 1.5 в качестве драйвера использовался `psycopg2`. `psycopg2` принимает `disable`, `prefer`, `allow`, `require`, `verify-ca`, `verify-full` в качестве допустимых значений для `sslmode` и не имеет параметра `ssl`, как указано в документации PostgreSQL [doc](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING:~:text=%2Dencrypted%20connection.-,sslmode,-This%20option%20determines).

В dbt-redshift 1.5 мы перешли на использование `redshift_connector`, который принимает `verify-ca` и `verify-full` в качестве допустимых значений для `sslmode` и имеет параметр `ssl` со значением `True` или `False`, согласно документации redshift [doc](https://docs.aws.amazon.com/redshift/latest/mgmt/python-configuration-options.html#:~:text=parameter%20is%20optional.-,sslmode,-Default%20value%20%E2%80%93%20verify).

Для обратной совместимости dbt-redshift теперь поддерживает допустимые значения для `sslmode` в `psycopg2`. Мы добавили логику преобразования, сопоставляющую каждое из значений `sslmode`, принимаемых `psycopg2`, с соответствующими параметрами `ssl` и `sslmode` в `redshift_connector`.

Таблица ниже подробно описывает принимаемые параметры `sslmode` и то, как будет установлено соединение в соответствии с каждым вариантом:

Параметр `sslmode` | Ожидаемое поведение в dbt-redshift | Действия за кулисами
-- | -- | --
disable | Соединение будет установлено без использования ssl | Установить `ssl` = False
allow | Соединение будет установлено с использованием verify-ca | Установить `ssl` = True &  `sslmode` = verify-ca
prefer | Соединение будет установлено с использованием verify-ca | Установить `ssl` = True &  `sslmode` = verify-ca
require | Соединение будет установлено с использованием verify-ca | Установить `ssl` = True &  `sslmode` = verify-ca
verify-ca | Соединение будет установлено с использованием verify-ca | Установить `ssl` = True &  `sslmode` = verify-ca
verify-full | Соединение будет установлено с использованием verify-full | Установить `ssl` = True &  `sslmode` = verify-full

При установлении соединения с использованием `verify-ca`, будет искать сертификат CA в `~/redshift-ca-bundle.crt`.

Для получения более подробной информации об изменениях sslmode, наших дизайнерских решениях и обоснованиях &mdash; пожалуйста, обратитесь к [PR, касающемуся этого изменения](https://github.com/dbt-labs/dbt-redshift/pull/439).

### Параметр `autocommit` {#autocommit-parameter}

[Режим автокоммита](https://www.psycopg.org/docs/connection.html#connection.autocommit) полезен для выполнения команд, которые выполняются вне транзакции. Объекты соединения, используемые в Python, должны иметь `autocommit = True` для выполнения операций, таких как `CREATE DATABASE` и `VACUUM`. По умолчанию `autocommit` отключен в `redshift_connector`, но мы изменили это значение по умолчанию на `True`, чтобы гарантировать успешное выполнение определенных макросов в вашем проекте dbt.

Если необходимо, вы можете определить отдельную цель с `autocommit=True`, как показано ниже:

<File name='~/.dbt/profiles.yml'>

```yaml
profile-to-my-RS-target:
  target: dev
  outputs:
    dev:
      type: redshift
      ...
      autocommit: False
      
  
  profile-to-my-RS-target-with-autocommit-enabled:
  target: dev
  outputs:
    dev:
      type: redshift
      ...
      autocommit: True
  ```

</File>

Чтобы запустить определенные макросы с автокоммитом, загрузите профиль с автокоммитом, используя флаг `--profile`. Для получения дополнительной информации, пожалуйста, обратитесь к этому [PR](https://github.com/dbt-labs/dbt-redshift/pull/475/files).

### `datasharing` {#datasharing}

<RedshiftDatasharing />

### Параметры `profile`, объявленные устаревшими в версии 1.5

- `iam_duration_seconds`

- `keepalives_idle`

### `drop_without_cascade`

Установите `drop_without_cascade: true`, чтобы исключить `CASCADE` из операторов `DROP TABLE`, `DROP VIEW` и `DROP MATERIALIZED VIEW`. Используйте этот параметр, если в вашем проекте нет зависимых объектов (например, используются только представления без привязки к схеме) и вы хотите избежать накладных расходов на разрешение графа зависимостей `CASCADE` при каждом удалении в больших кластерах.

:::info
Этот параметр предназначен для проектов без зависимых объектов. Если зависимый объект существует, а `CASCADE` не указан, Redshift выдаст ошибку.
:::

### Ключи `sort` и `dist`

Где это возможно, dbt позволяет использовать ключи `sort` и `dist`. См. раздел о [специфических конфигурациях Redshift](/reference/resource-configs/redshift-configs).

#### Повторные попытки {#retries}

Если при открытии нового соединения в `dbt-redshift` возникает ошибка выполнения операции или истекает время ожидания, адаптер будет повторять попытки подключения до достижения количества, заданного параметром `retries`. Если задано 2 или более повторных попыток, dbt будет ждать 1 секунду перед каждой повторной попыткой. По умолчанию выполняется 1 повторная попытка. Если задано значение 0, dbt не будет повторять попытки подключения.

</VersionBlock>
