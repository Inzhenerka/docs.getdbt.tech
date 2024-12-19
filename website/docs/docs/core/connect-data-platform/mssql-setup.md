---
title: "Настройка Microsoft SQL Server"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Microsoft SQL Server в dbt."
id: "mssql-setup"
meta:
  maintained_by: Сообщество
  authors: 'Микаэль Эне и сообщество dbt-msft (https://github.com/dbt-msft)'
  github_repo: 'dbt-msft/dbt-sqlserver'
  pypi_package: 'dbt-sqlserver'
  min_core_version: 'v0.14.0'
  cloud_support: Не поддерживается
  min_supported_version: 'SQL Server 2016'
  slack_channel_name: '#db-sqlserver'
  slack_channel_link: 'https://getdbt.slack.com/archives/CMRMDDQ9W'
  platform_name: 'SQL Server'
  config_page: '/reference/resource-configs/mssql-configs'
---

:::info Плагин сообщества

Некоторые основные функции могут быть ограничены. Если вы хотите внести свой вклад, ознакомьтесь с исходным кодом для каждого из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


:::tip Изменение настроек по умолчанию в dbt-sqlserver v1.2 / ODBC Driver 18
Microsoft внесла несколько изменений, связанных с шифрованием соединений. Узнайте больше об изменениях [ниже](#connection-encryption).
:::

### Предварительные требования

На Debian/Ubuntu убедитесь, что у вас есть заголовочные файлы ODBC перед установкой

```bash
sudo apt install unixodbc-dev
```

Скачайте и установите [ODBC Driver 18 для SQL Server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15).
Если у вас уже установлен ODBC Driver 17, то он также будет работать.

#### Поддерживаемые конфигурации

* Адаптер протестирован с SQL Server 2017, SQL Server 2019, SQL Server 2022 и Azure SQL Database.
* Мы тестируем все комбинации с Microsoft ODBC Driver 17 и Microsoft ODBC Driver 18.
* Сравнения, на которых мы проводим наши тесты, это `SQL_Latin1_General_CP1_CI_AS` и `SQL_Latin1_General_CP1_CS_AS`.

Поддержка адаптера не ограничивается матрицей вышеуказанных конфигураций. Если вы заметили проблему с любой другой конфигурацией, дайте нам знать, открыв проблему на [GitHub](https://github.com/dbt-msft/dbt-sqlserver).

## Методы аутентификации и конфигурация профиля

### Общая конфигурация

Для всех методов аутентификации обратитесь к следующим параметрам конфигурации, которые можно установить в вашем файле `profiles.yml`. 
Полная справка по всем параметрам доступна [в конце этой страницы](#reference-of-all-connection-options).

| Параметр конфигурации | Описание | Тип | Пример |
| --------------------- | ---- | ---- | ------- |
| `driver` | ODBC-драйвер для использования | Обязательный | `ODBC Driver 18 for SQL Server` |
| `server` | Имя хоста сервера | Обязательный | `localhost` |
| `port` | Порт сервера | Обязательный | `1433` |
| `database` | Имя базы данных | Обязательный | Не применимо |
| `schema` | Имя схемы | Обязательный | `dbo` |
| `retries` | Количество автоматических попыток повторного выполнения запроса перед его завершением. По умолчанию `1`. Запросы с синтаксическими ошибками не будут повторяться. Эта настройка может быть использована для преодоления временных сетевых проблем. | Необязательный | Не применимо |
| `login_timeout` | Количество секунд, используемых для установления соединения перед его завершением. По умолчанию `0`, что означает, что тайм-аут отключен или использует настройки системы по умолчанию. | Необязательный | Не применимо |
| `query_timeout` | Количество секунд, используемых для ожидания выполнения запроса перед его завершением. По умолчанию `0`, что означает, что тайм-аут отключен или использует настройки системы по умолчанию. | Необязательный | Не применимо |
| `schema_authorization` | Опционально установите это значение на принципала, который должен владеть схемами, созданными dbt. [Узнайте больше о схеме авторизации](#schema-authorization). | Необязательный | Не применимо |
| `encrypt` | Нужно ли шифровать соединение с сервером. По умолчанию `true`. Узнайте больше о [шифровании соединений](#connection-encryption). | Необязательный | Не применимо |
| `trust_cert` | Нужно ли доверять сертификату сервера. По умолчанию `false`. Узнайте больше о [шифровании соединений](#connection-encryption).| Необязательный | Не применимо |

### Шифрование соединения

Microsoft внесла несколько изменений в выпуске ODBC Driver 18, которые влияют на то, как настраивается шифрование соединений.
Чтобы учесть эти изменения, начиная с dbt-sqlserver 1.2.0 или новее, значения по умолчанию для `encrypt` и `trust_cert` изменились.
Обе эти настройки теперь **всегда** будут включены в строку соединения с сервером, независимо от того, оставили ли вы их вне конфигурации профиля или нет.

* Значение по умолчанию для `encrypt` — `true`, что означает, что соединения шифруются по умолчанию.
* Значение по умолчанию для `trust_cert` — `false`, что означает, что сертификат сервера будет проверен. Установив это значение на `true`, будет принят самоподписанный сертификат.

Более подробную информацию о том, как эти значения влияют на ваше соединение и как они используются по-разному в версиях ODBC-драйвера, можно найти в [документации Microsoft](https://learn.microsoft.com/en-us/sql/connect/odbc/dsn-connection-string-attribute?view=sql-server-ver16#encrypt).

### Стандартная аутентификация SQL Server

Учетные данные SQL Server поддерживаются как для локальных серверов, так и для Azure,
и это метод аутентификации по умолчанию для `dbt-sqlserver`.

При работе в Windows вы также можете использовать свои учетные данные Windows для аутентификации.

<Tabs
  defaultValue="password"
  values={[
    {label: 'Учетные данные SQL Server', value: 'password'},
    {label: 'Учетные данные Windows', value: 'windows'}
  ]}
>

<TabItem value="password">

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный на вашей системе)
      server: hostname or IP of your server
      port: 1433
      database: database
      schema: schema_name
      user: username
      password: password
```

</File>

</TabItem>

<TabItem value="windows">

<File name='profiles.yml'>


```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный на вашей системе)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      windows_login: True
```

</File>

</TabItem>

</Tabs>

### Аутентификация Microsoft Entra ID 

Хотя вы можете использовать аутентификацию с именем пользователя и паролем SQL, как упоминалось выше,
вы можете выбрать один из методов аутентификации ниже для Azure SQL.

Следующие дополнительные методы доступны для аутентификации в продуктах Azure SQL:

* Имя пользователя и пароль Microsoft Entra ID (ранее Azure AD)
* Сервисный принципал
* Управляемая идентичность
* Аутентификация на основе окружения
* Аутентификация Azure CLI
* Аутентификация VS Code (доступна через автоматический вариант ниже)
* Аутентификация модуля Azure PowerShell (доступна через автоматический вариант ниже)
* Автоматическая аутентификация

Настройка автоматической аутентификации в большинстве случаев является самым простым выбором и работает для всех вышеперечисленных методов.

<Tabs
  defaultValue="azure_cli"
  values={[
    {label: 'Имя пользователя и пароль Microsoft Entra ID', value: 'meid_password'},
    {label: 'Сервисный принципал', value: 'service_principal'},
    {label: 'Управляемая идентичность', value: 'managed_identity'},
    {label: 'На основе окружения', value: 'environment_based'},
    {label: 'Azure CLI', value: 'azure_cli'},
    {label: 'Автоматически', value: 'auto'}
  ]}
>

<TabItem value="meid_password">

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный на вашей системе)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryPassword
      user: bill.gates@microsoft.com
      password: iheartopensource
```

</File>

</TabItem>

<TabItem value="service_principal">

Идентификатор клиента часто также называется Идентификатором приложения.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный на вашей системе)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ServicePrincipal
      tenant_id: 00000000-0000-0000-0000-000000001234
      client_id: 00000000-0000-0000-0000-000000001234
      client_secret: S3cret!
```

</File>

</TabItem>

<TabItem value="managed_identity">

Как системные, так и пользовательские управляемые идентичности будут работать.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный на вашей системе)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryMsi
```

</File>

</TabItem>

<TabItem value="environment_based">

Этот вариант аутентификации позволяет вам динамически выбирать метод аутентификации в зависимости от доступных переменных окружения.

[Документация Microsoft по EnvironmentCredential](https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python)
объясняет доступные комбинации переменных окружения, которые вы можете использовать.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный на вашей системе)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: environment
```

</File>

</TabItem>

<TabItem value="azure_cli">

Сначала установите [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), затем выполните вход:

`az login`

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный на вашей системе)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: CLI
```

</File>

</TabItem>

<TabItem value="auto">

Этот вариант аутентификации автоматически попытается использовать все доступные методы аутентификации.

Следующие методы пробуются по порядку:

1. Аутентификация на основе окружения
2. Аутентификация управляемой идентичности
3. Аутентификация Visual Studio (*только Windows, игнорируется на других операционных системах*)
4. Аутентификация Visual Studio Code
5. Аутентификация Azure CLI
6. Аутентификация модуля Azure PowerShell

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный на вашей системе)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: auto
```

</File>

</TabItem>

</Tabs>

#### Дополнительные параметры для Microsoft Entra ID на Windows

На системах Windows также доступны следующие дополнительные методы аутентификации для Azure SQL:

* Интерактивная аутентификация Microsoft Entra ID
* Интегрированная аутентификация Microsoft Entra ID
* Аутентификация Visual Studio (доступна через автоматический вариант выше)

<Tabs
  defaultValue="meid_interactive"
  values={[
    {label: 'Интерактивная аутентификация Microsoft Entra ID', value: 'meid_interactive'},
    {label: 'Интегрированная аутентификация Microsoft Entra ID', value: 'meid_integrated'}
  ]}
>

<TabItem value="meid_interactive">

Этот параметр может опционально показывать запросы многофакторной аутентификации.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный на вашей системе)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryInteractive
      user: bill.gates@microsoft.com
```

</File>

</TabItem>

<TabItem value="meid_integrated">

Этот метод использует учетные данные, с которыми вы вошли на текущей машине.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный на вашей системе)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryIntegrated
```

</File>

</TabItem>

</Tabs>

### Автоматическое предоставление принципалов Microsoft Entra ID для прав

В dbt 1.2 или новее вы можете использовать блок конфигурации [grants](https://docs.getdbt.com/reference/resource-configs/grants) для автоматического предоставления/отзыва прав на ваши модели для пользователей или групп. Это полностью поддерживается в этом адаптере и имеет дополнительную функцию.

Установив `auto_provision_aad_principals` в `true` в вашей конфигурации модели, вы можете автоматически предоставить принципалов Microsoft Entra ID (пользователей или группы), которые еще не существуют.

В Azure SQL вы можете войти, используя аутентификацию Microsoft Entra ID, но чтобы предоставить принципалу Microsoft Entra ID определенные права, его необходимо сначала связать с базой данных. ([Документация Microsoft](https://learn.microsoft.com/en-us/azure/azure-sql/database/authentication-aad-configure?view=azuresql))

Обратите внимание, что принципалы не будут автоматически удалены, когда они будут удалены из блока `grants`.

### Авторизация схемы

Вы можете опционально установить принципала, который должен владеть всеми схемами, созданными dbt. Это затем используется в операторе `CREATE SCHEMA` следующим образом:

```sql
CREATE SCHEMA [schema_name] AUTHORIZATION [schema_authorization]
```

Распространенный случай использования — это когда вы аутентифицируетесь с принципалом, который имеет права на основе группы, такой как группа Microsoft Entra ID. Когда этот принципал создает схему, сервер сначала попытается создать индивидуальный логин для этого принципала, а затем связать схему с этим принципалом. Если вы будете использовать Microsoft Entra ID в этом случае,
то это завершится неудачей, поскольку Azure SQL не может автоматически создавать логины для отдельных лиц, входящих в группу AD.

### Справка по всем параметрам соединения

| Параметр конфигурации   | Описание                                                                                                                                        | Обязательный           | Значение по умолчанию |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------- |
| `driver`               | ODBC-драйвер для использования.                                                                                                                            | :white_check_mark: |               |
| `host`                 | Имя хоста сервера базы данных.                                                                                                               | :white_check_mark: |               |
| `port`                 | Порт сервера базы данных.                                                                                                                   |                    | `1433`        |
| `database`             | Имя базы данных для подключения.                                                                                                            | :white_check_mark: |               |
| `schema`               | Схема для использования.                                                                                                                                 | :white_check_mark: |               |
| `authentication`       | Метод аутентификации для использования. Это не требуется для аутентификации Windows.                                                                 |                    | `'sql'`       |
| `UID`                  | Имя пользователя, используемое для аутентификации. Это можно оставить пустым в зависимости от метода аутентификации.                                                        |                    |               |
| `PWD`                  | Пароль, используемый для аутентификации. Это можно оставить пустым в зависимости от метода аутентификации.                                                        |                    |               |
| `windows_login`        | Установите это значение в `true`, чтобы использовать аутентификацию Windows. Это доступно только для SQL Server.                                                           |                    |               |
| `tenant_id`            | Идентификатор арендатора экземпляра Microsoft Entra ID. Это используется только при подключении к Azure SQL с сервисным принципалом.                     |                    |               |
| `client_id`            | Идентификатор клиента сервисного принципала Microsoft Entra. Это используется только при подключении к Azure SQL с сервисным принципалом Microsoft Entra.       |                    |               |
| `client_secret`        | Секрет клиента сервисного принципала Microsoft Entra. Это используется только при подключении к Azure SQL с сервисным принципалом Microsoft Entra.   |                    |               |
| `encrypt`              | Установите это значение в `false`, чтобы отключить использование шифрования. См. [выше](#connection-encryption).                                                         |                    | `true`        |
| `trust_cert`           | Установите это значение в `true`, чтобы доверять сертификату сервера. См. [выше](#connection-encryption).                                                           |                    | `false`       |
| `retries`              | Количество попыток повторного выполнения неудачного соединения.                                                                                                  |                    | `1`           |
| `schema_authorization` | Опционально установите это значение на принципала, который должен владеть схемами, созданными dbt. [Подробности выше](#schema-authorization).                            |                    |               |
| `login_timeout`        | Количество секунд, которые нужно ждать, пока не будет получен ответ от сервера при установлении соединения. `0` означает, что тайм-аут отключен. |                    | `0`           |
| `query_timeout`        | Количество секунд, которые нужно ждать, пока не будет получен ответ от сервера при выполнении запроса. `0` означает, что тайм-аут отключен.         |                    | `0`           |

Допустимые значения для `authentication`:

* `sql`: Аутентификация SQL с использованием имени пользователя и пароля
* `ActiveDirectoryPassword`: Аутентификация Active Directory с использованием имени пользователя и пароля
* `ActiveDirectoryInteractive`: Аутентификация Active Directory с использованием имени пользователя и запросов MFA
* `ActiveDirectoryIntegrated`: Аутентификация Active Directory с использованием учетных данных текущего пользователя
* `ServicePrincipal`: Аутентификация Microsoft Entra ID с использованием сервисного принципала
* `CLI`: Аутентификация Microsoft Entra ID с использованием учетной записи, с которой вы вошли в Azure CLI
* `ActiveDirectoryMsi`: Аутентификация Microsoft Entra ID с использованием управляемой идентичности, доступной в системе
* `environment`: Аутентификация Microsoft Entra ID с использованием переменных окружения, как описано [здесь](https://learn.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python)
* `auto`: Аутентификация Microsoft Entra ID, пробующая предыдущие методы аутентификации, пока не найдет работающий
