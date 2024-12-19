---
title: "Настройка Redshift"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Redshift в dbt."
id: "redshift-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-redshift'
  pypi_package: 'dbt-redshift'
  min_core_version: 'v0.10.0'
  cloud_support: Поддерживается
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
| `host` | hostname.region.redshift.amazonaws.com или workgroup.account.region.redshift-serverless.amazonaws.com | Хост кластера |
| `port` | 5439 |  |
| `dbname` | my_db | Имя базы данных |
| `schema` | my_schema | Имя схемы |
| `connect_timeout` | 30 | Количество секунд до истечения времени подключения. По умолчанию `None` |
| `sslmode` | prefer | необязательный, устанавливает sslmode для подключения к базе данных. По умолчанию prefer, который будет использовать 'verify-ca' для подключения. Для получения дополнительной информации о `sslmode` смотрите примечание Redshift ниже |
| `role` | None | Необязательный, идентификатор пользователя текущей сессии |
| `autocreate` | false | Необязательный, по умолчанию false. Создает пользователя, если он не существует |
| `db_groups` | ['ANALYSTS'] | Необязательный. Список существующих имен групп базы данных, к которым присоединяется DbUser для текущей сессии |
| `ra3_node` | true | Необязательный, по умолчанию False. Включает источники из разных баз данных |
| `autocommit` | true | Необязательный, по умолчанию True. Включает автокоммит после каждого оператора |
| `retries` | 1 | Количество попыток |

## Параметры аутентификации

Методы аутентификации, которые поддерживает dbt Core на Redshift:

- `Database` &mdash; Аутентификация на основе пароля (по умолчанию, будет использоваться, если `method` не указан)
- `IAM User` &mdash; Аутентификация IAM User через AWS Profile

Нажмите на один из этих методов аутентификации для получения дополнительных сведений о том, как настроить ваш профиль подключения. Каждая вкладка также включает пример файла конфигурации `profiles.yml` для вашего ознакомления.

<Tabs
  defaultValue="database"
  values={[
    {label: 'Database', value: 'database'},
    {label: 'IAM User via AWS Profile (Core)', value: 'iam-user-profile'}]
}>

<TabItem value="database">

Следующая таблица содержит параметры для метода подключения к базе данных (на основе пароля).

| Поле профиля | Пример | Описание |
| ------------- | ------- | ------------ |
| `method` | database | Оставьте этот параметр не настроенным или установите его в database |
| `user` | username | Имя пользователя для входа в ваш кластер |
| `password` | password1 | Пароль для аутентификации |

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

Следующая таблица перечисляет параметры аутентификации для использования IAM аутентификации.

Чтобы настроить профиль Redshift с использованием IAM аутентификации, установите параметр `method` в `iam`, как показано ниже. Обратите внимание, что пароль не требуется при использовании IAM аутентификации. Для получения дополнительной информации об этом типе аутентификации обратитесь к [документации Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/generating-user-credentials.html) и [документации boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/redshift.html#Redshift.Client.get_cluster_credentials) по созданию учетных данных пользователя с помощью IAM Auth.

Если вы получаете ошибку "Вы должны указать регион" при использовании IAM аутентификации, вероятно, ваши учетные данные AWS неправильно настроены. Попробуйте выполнить `aws configure`, чтобы настроить ключи доступа AWS и выбрать регион по умолчанию. Если у вас есть вопросы, пожалуйста, обратитесь к официальной документации AWS по [настройкам конфигурации и файлов учетных данных](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

| Поле профиля | Пример | Описание |
| ------------- | ------- | ------------ |
| `method` | IAM | используйте IAM для аутентификации через IAM User аутентификацию |
| `iam_profile` | analyst | dbt будет использовать указанный профиль из вашего файла ~/.aws/config |
| `cluster_id` | CLUSTER_ID | Обязательно для IAM аутентификации только для выделенного кластера, не для Serverless |
| `user` | username | Пользователь, выполняющий запрос к базе данных, игнорируется для Serverless (но поле все равно требуется) |
| `region` | us-east-1 | Регион вашего экземпляра Redshift | 

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

#### Указание IAM профиля

Когда конфигурация `iam_profile` установлена, dbt будет использовать указанный профиль из вашего файла `~/.aws/config`, а не использовать имя профиля `default`.

</TabItem>

</Tabs>

## Примечания Redshift

### Изменение `sslmode`

До версии dbt-redshift 1.5 использовался драйвер `psycopg2`. `psycopg2` принимает `disable`, `prefer`, `allow`, `require`, `verify-ca`, `verify-full` в качестве допустимых значений для `sslmode` и не имеет параметра `ssl`, как указано в [документации PostgreSQL](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING:~:text=%2Dencrypted%20connection.-,sslmode,-This%20option%20determines).

В dbt-redshift 1.5 мы перешли на использование `redshift_connector`, который принимает `verify-ca` и `verify-full` в качестве допустимых значений `sslmode` и имеет параметр `ssl` со значением True или False, согласно [документации redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/python-configuration-options.html#:~:text=parameter%20is%20optional.-,sslmode,-Default%20value%20%E2%80%93%20verify).

Для обеспечения обратной совместимости dbt-redshift теперь поддерживает допустимые значения для `sslmode` в `psycopg2`. Мы добавили логику преобразования, сопоставляющую каждое из допустимых значений `sslmode` в `psycopg2` с соответствующими параметрами `ssl` и `sslmode` в `redshift_connector`.

Таблица ниже описывает допустимые параметры `sslmode` и то, как будет установлено соединение в зависимости от каждого варианта:

`sslmode` параметр | Ожидаемое поведение в dbt-redshift | Действия за кулисами
-- | -- | --
disable | Соединение будет установлено без использования ssl | Установить `ssl` = False
allow | Соединение будет установлено с использованием verify-ca | Установить `ssl` = True &  `sslmode` = verify-ca
prefer | Соединение будет установлено с использованием verify-ca | Установить `ssl` = True &  `sslmode` = verify-ca
require | Соединение будет установлено с использованием verify-ca | Установить `ssl` = True &  `sslmode` = verify-ca
verify-ca | Соединение будет установлено с использованием verify-ca | Установить `ssl` = True &  `sslmode` = verify-ca
verify-full | Соединение будет установлено с использованием verify-full | Установить `ssl` = True &  `sslmode` = verify-full

Когда соединение устанавливается с использованием `verify-ca`, будет искаться сертификат CA в `~/redshift-ca-bundle.crt`.

Для получения дополнительной информации об изменениях sslmode, наших дизайнерских решениях и обоснованиях &mdash; пожалуйста, обратитесь к [PR, касающемуся этого изменения](https://github.com/dbt-labs/dbt-redshift/pull/439).

### Параметр `autocommit`

Режим [автокоммита](https://www.psycopg.org/docs/connection.html#connection.autocommit) полезен для выполнения команд, которые выполняются вне транзакции. Объекты соединения, используемые в Python, должны иметь `autocommit = True`, чтобы выполнять операции, такие как `CREATE DATABASE` и `VACUUM`. `autocommit` отключен по умолчанию в `redshift_connector`, но мы изменили этот параметр по умолчанию на `True`, чтобы гарантировать успешное выполнение определенных макросов в вашем проекте dbt.

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

Где это возможно, dbt позволяет использовать ключи `sort` и `dist`. См. раздел о [конфигурациях, специфичных для Redshift](/reference/resource-configs/redshift-configs).

#### retries

Если `dbt-redshift` сталкивается с операционной ошибкой или тайм-аутом при открытии нового соединения, он повторит попытку до количества раз, указанного в `retries`. Если установлено 2 или более попыток, dbt будет ждать 1 секунду перед повторной попыткой. Значение по умолчанию — 1 попытка. Если установлено 0, dbt не будет повторять попытки вообще.