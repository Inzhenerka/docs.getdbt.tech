---
title: "Настройка Redshift"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища данных Redshift в dbt."
id: "redshift-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-redshift'
  min_core_version: 'v0.10.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-redshift'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Redshift'
  config_page: '/reference/resource-configs/redshift-configs'
---

<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Конфигурации

| Поле профиля | Пример | Описание |
| ------------- | ------- | ------------ |
| `type` | redshift | Тип хранилища данных, к которому вы подключаетесь |
| `host` | `hostname.region.redshift.amazonaws.com` или `workgroup.account.region.redshift-serverless.amazonaws.com` | Хост кластера |
| `port`  | 5439 | Порт вашего окружения Redshift |
| `dbname`  | my_db | Имя базы данных |
| `schema`  | my_schema | Имя схемы |
| `connect_timeout`  | 30 | Количество секунд до тайм-аута подключения. Значение по умолчанию — `None` |
| `sslmode`  | prefer | Необязательный параметр, задаёт режим SSL для подключения к базе данных. По умолчанию используется `prefer`, при котором для соединения применяется `verify-ca`. Подробнее о параметре `sslmode` см. примечание о Redshift ниже |
| `role`  | None | Необязательный параметр, идентификатор пользователя текущей сессии |
| `autocreate`  | false | Необязательный параметр, по умолчанию `False`. Создаёт пользователя, если он не существует |
| `db_groups`  | ['ANALYSTS'] | Необязательный параметр. Список существующих групп базы данных, в которые DbUser будет добавлен для текущей сессии |
| `ra3_node`  | true | Необязательный параметр, по умолчанию `False`. Включает использование источников из других баз данных |
| `autocommit`  | true | Необязательный параметр, по умолчанию `True`. Включает автоматический коммит после каждого выражения |
| `retries`  | 1 | Количество повторных попыток (для каждого выражения) |
| `retry_all`  | true | Позволяет dbt повторять выполнение всех выражений в запросе |
| `tcp_keepalive`  | true | Позволяет dbt предотвращать разрыв неактивных соединений промежуточными firewall или балансировщиками нагрузки |
| `tcp_keepalive_idle`  | 200 | Количество секунд бездействия перед отправкой первого keep-alive пакета |
| `tcp_keepalive_interval`  | 200 | Количество секунд бездействия перед отправкой следующего keep-alive пакета |
| `tcp_keepalive_count`  | 5 | Количество отправляемых keep-alive пакетов |

Для настройки параметров `tcp_keepalive` рекомендуем ознакомиться с [документацией Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/troubleshooting-connections.html), чтобы подобрать конфигурацию, оптимально подходящую для вашего случая.

## Параметры аутентификации

Методы аутентификации, которые поддерживает dbt Core на Redshift, включают:

Методы аутентификации, которые <Constant name="core" /> поддерживает для Redshift:

Нажмите на один из этих методов аутентификации для получения более подробной информации о том, как настроить ваш профиль подключения. Каждая вкладка также включает пример конфигурационного файла `profiles.yml` для вашего ознакомления.

<Tabs
  defaultValue="database"
  values={[
    {label: 'Database', value: 'database'},
    {label: 'IAM User via AWS Profile (Core)', value: 'iam-user-profile'}]
}>

<TabItem value="database">

Следующая таблица содержит параметры для метода подключения на основе базы данных (пароль).

| Поле профиля | Пример | Описание |
| ------------- | ------- | ------------ |
| `method` | database| Оставьте этот параметр неконфигурированным или установите его в database |
| `user`   | username | Имя пользователя учетной записи для входа в ваш кластер |
| `password`  | password1 | Пароль для аутентификации  |

<br/>

#### Пример profiles.yml для аутентификации базы данных

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
| `method` | IAM | использовать IAM для аутентификации через IAM User authentication |
| `iam_profile` | analyst | dbt будет использовать указанный профиль из вашего файла `~/.aws/config` |
| `cluster_id` | cluster_id | требуется для IAM-аутентификации только для provisioned-кластера, не для Serverless |
| `user` | username | пользователь, выполняющий запросы к базе данных; игнорируется для Serverless (но поле всё равно обязательно) |
| `region` | us-east-1 | регион вашего экземпляра Redshift |


<br/>

#### Пример profiles.yml для IAM

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
      autocommit: true  
      autocreate: true  
      db_groups: ['ANALYSTS']

```

</File>

#### Указание профиля IAM

Когда установлена конфигурация `iam_profile`, dbt будет использовать указанный профиль из вашего файла `~/.aws/config` вместо использования имени профиля `default`.

</TabItem>

</Tabs>

## Примечания к Redshift

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

### Параметр `autocommit`

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

### Устаревшие параметры `profile` в 1.5

- `iam_duration_seconds`

- `keepalives_idle`

### Ключи `sort` и `dist`

Где это возможно, dbt позволяет использовать ключи `sort` и `dist`. См. раздел о [специфических конфигурациях Redshift](/reference/resource-configs/redshift-configs).

#### Повторные попытки

Если `dbt-redshift` сталкивается с операционной ошибкой или истечением времени ожидания при открытии нового соединения, он будет повторять попытку до количества раз, указанного в `retries`. Если установлено 2+ повторных попыток, dbt будет ждать 1 секунду перед повторной попыткой. Значение по умолчанию — 1 повторная попытка. Если установлено значение 0, dbt не будет повторять попытки вообще.