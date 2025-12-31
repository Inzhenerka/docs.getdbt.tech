---
title: "Настройка Microsoft SQL Server"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Microsoft SQL Server в dbt."
id: "mssql-setup"
meta:
  maintained_by: Community
  authors: 'Mikael Ene & dbt-msft community (https://github.com/dbt-msft)'
  github_repo: 'dbt-msft/dbt-sqlserver'
  pypi_package: 'dbt-sqlserver'
  min_core_version: 'v0.14.0'
  cloud_support: Not Supported
  min_supported_version: 'SQL Server 2016'
  slack_channel_name: '#db-sqlserver'
  slack_channel_link: 'https://getdbt.slack.com/archives/CMRMDDQ9W'
  platform_name: 'SQL Server'
  config_page: '/reference/resource-configs/mssql-configs'
---

:::info Плагин сообщества

Некоторая основная функциональность может быть ограничена. Если вы заинтересованы в участии, ознакомьтесь с исходным кодом для каждого из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

:::tip Изменение настроек по умолчанию в dbt-sqlserver v1.2 / ODBC Driver 18
Microsoft внесла несколько изменений, связанных с шифрованием соединений. Подробнее об изменениях читайте [ниже](#connection-encryption).
:::

### Предварительные требования {#prerequisites}

На Debian/Ubuntu убедитесь, что у вас есть заголовочные файлы ODBC перед установкой

```bash
sudo apt install unixodbc-dev
```

Скачайте и установите [Microsoft ODBC Driver 18 для SQL Server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15).
Если у вас уже установлен ODBC Driver 17, он также будет работать.

#### Поддерживаемые конфигурации {#supported-configurations}

* Адаптер тестировался с SQL Server 2017, SQL Server 2019, SQL Server 2022 и Azure SQL Database.
* Мы тестируем все комбинации с Microsoft ODBC Driver 17 и Microsoft ODBC Driver 18.
* Колляции, на которых мы проводим тесты: `SQL_Latin1_General_CP1_CI_AS` и `SQL_Latin1_General_CP1_CS_AS`.

Поддержка адаптера не ограничивается матрицей вышеуказанных конфигураций. Если вы заметите проблему с любой другой конфигурацией, дайте нам знать, открыв проблему на [GitHub](https://github.com/dbt-msft/dbt-sqlserver).

## Методы аутентификации и конфигурация профиля {#authentication-methods-profile-configuration}

### Общая конфигурация {#common-configuration}

Для всех методов аутентификации обратитесь к следующим параметрам конфигурации, которые можно задать в вашем файле `profiles.yml`.
Полная справка по всем параметрам доступна [в конце этой страницы](#reference-of-all-connection-options).

| Параметр конфигурации | Описание | Тип | Пример |
| --------------------- | ---- | ---- | ------- |
| `driver` | ODBC-драйвер для использования | Обязательный | `ODBC Driver 18 for SQL Server` |
| `server` | Имя хоста сервера | Обязательный | `localhost` |
| `port` | Порт сервера | Обязательный | `1433` |
| `database` | Имя базы данных | Обязательный | Не применимо |
| `schema` | Имя схемы | Обязательный | `dbo` |
| `retries` | Количество автоматических попыток повторить запрос перед ошибкой. По умолчанию `1`. Запросы с синтаксическими ошибками не будут повторяться. Этот параметр можно использовать для преодоления временных сетевых проблем. | Необязательный |  Не применимо  |
| `login_timeout` | Количество секунд, используемых для установления соединения перед ошибкой. По умолчанию `0`, что означает, что тайм-аут отключен или используются системные настройки по умолчанию. | Необязательный |  Не применимо  |
| `query_timeout` | Количество секунд, используемых для ожидания запроса перед ошибкой. По умолчанию `0`, что означает, что тайм-аут отключен или используются системные настройки по умолчанию. | Необязательный |  Не применимо  |
| `schema_authorization` | Опционально укажите принципала, который должен владеть схемами, создаваемыми dbt. [Подробнее о авторизации схем](#schema-authorization). | Необязательный |  Не применимо  |
| `encrypt` | Шифровать ли соединение с сервером. По умолчанию `true`. Подробнее о [шифровании соединений](#connection-encryption). | Необязательный |  Не применимо  |
| `trust_cert` | Доверять ли сертификату сервера. По умолчанию `false`. Подробнее о [шифровании соединений](#connection-encryption).| Необязательный |  Не применимо  |

### Шифрование соединений {#connection-encryption}

Microsoft внесла несколько изменений в выпуске ODBC Driver 18, которые влияют на то, как настраивается шифрование соединений.
Чтобы учесть эти изменения, начиная с dbt-sqlserver 1.2.0 или новее, значения по умолчанию для `encrypt` и `trust_cert` были изменены.
Оба этих параметра теперь **всегда** будут включены в строку соединения с сервером, независимо от того, оставили ли вы их в конфигурации профиля или нет.

* Значение по умолчанию для `encrypt` — `true`, что означает, что соединения по умолчанию шифруются.
* Значение по умолчанию для `trust_cert` — `false`, что означает, что сертификат сервера будет проверен. Установив это значение в `true`, будет принят самоподписанный сертификат.

Более подробную информацию о том, как эти значения влияют на ваше соединение и как они используются в разных версиях ODBC-драйвера, можно найти в [документации Microsoft](https://learn.microsoft.com/en-us/sql/connect/odbc/dsn-connection-string-attribute?view=sql-server-ver16#encrypt).

### Стандартная аутентификация SQL Server {#standard-sql-server-authentication}

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
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный в вашей системе)
      server: hostname или IP вашего сервера
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
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный в вашей системе)
      server: hostname или IP вашего сервера
      port: 1433
      database: exampledb
      schema: schema_name
      windows_login: True
```

</File>

</TabItem>

</Tabs>

### Аутентификация Microsoft Entra ID {#microsoft-entra-id-authentication}

Хотя вы можете использовать аутентификацию с именем пользователя и паролем SQL, как указано выше,
вы можете выбрать один из следующих методов аутентификации для Azure SQL.

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
    {label: 'Автоматическая', value: 'auto'}
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
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный в вашей системе)
      server: hostname или IP вашего сервера
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

Идентификатор клиента часто также называют идентификатором приложения.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный в вашей системе)
      server: hostname или IP вашего сервера
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

Будут работать как системно назначенные, так и назначенные пользователем управляемые идентичности.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный в вашей системе)
      server: hostname или IP вашего сервера
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryMsi
```

</File>

</TabItem>

<TabItem value="environment_based">

Этот вариант аутентификации позволяет динамически выбирать метод аутентификации в зависимости от доступных переменных окружения.

[Документация Microsoft по EnvironmentCredential](https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python)
объясняет доступные комбинации переменных окружения, которые вы можете использовать.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный в вашей системе)
      server: hostname или IP вашего сервера
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
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный в вашей системе)
      server: hostname или IP вашего сервера
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
2. Аутентификация с управляемой идентичностью
3. Аутентификация Visual Studio (*только для Windows, игнорируется на других операционных системах*)
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
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный в вашей системе)
      server: hostname или IP вашего сервера
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: auto
```

</File>

</TabItem>

</Tabs>

#### Дополнительные параметры для Microsoft Entra ID на Windows {#additional-options-for-microsoft-entra-id-on-windows}

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

Эта настройка может опционально показывать запросы многофакторной аутентификации.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный в вашей системе)
      server: hostname или IP вашего сервера
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryInteractive
      user: bill.gates@microsoft.com
```

</File>

</TabItem>

<TabItem value="meid_integrated">

Используются учетные данные, с которыми вы вошли в систему на текущем компьютере.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (ODBC-драйвер, установленный в вашей системе)
      server: hostname или IP вашего сервера
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryIntegrated
```

</File>

</TabItem>

</Tabs>

### Автоматическое предоставление принципалов Microsoft Entra ID для грантов {#automatic-microsoft-entra-id-principal-provisioning-for-grants}

В dbt версии 1.2 и новее вы можете использовать блок конфигурации [grants](/reference/resource-configs/grants), чтобы автоматически выдавать или отзывать права доступа к вашим моделям для пользователей или групп. Это полностью поддерживается данным адаптером и дополнительно включает одну расширенную возможность.

Установив `auto_provision_aad_principals` в `true` в конфигурации вашей модели, вы можете автоматически предоставлять принципалов Microsoft Entra ID (пользователей или группы), которые еще не существуют.

В Azure SQL вы можете войти, используя аутентификацию Microsoft Entra ID, но чтобы иметь возможность предоставить принципалу Microsoft Entra ID определенные разрешения, он должен быть сначала связан в базе данных. ([Документация Microsoft](https://learn.microsoft.com/en-us/azure/azure-sql/database/authentication-aad-configure?view=azuresql))

Обратите внимание, что принципалы не будут автоматически удаляться, когда они удаляются из блока `grants`.

### Авторизация схем {#schema-authorization}

Вы можете опционально указать принципала, который должен владеть всеми схемами, создаваемыми dbt. Это затем используется в операторе `CREATE SCHEMA` следующим образом:

```sql
CREATE SCHEMA [schema_name] AUTHORIZATION [schema_authorization]
```

Распространенный случай использования — это использование, когда вы аутентифицируетесь с принципалом, у которого есть разрешения на основе группы, такой как группа Microsoft Entra ID. Когда этот принципал создает схему, сервер сначала попытается создать индивидуальный логин для этого принципала, а затем связать схему с этим принципалом. Если бы вы использовали Microsoft Entra ID в этом случае,
то это не удалось бы, так как Azure SQL не может автоматически создавать логины для отдельных лиц, входящих в группу AD.

### Справка по всем параметрам соединения {#reference-of-all-connection-options}

| Параметр конфигурации   | Описание                                                                                                                                        | Обязательный           | Значение по умолчанию |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------- |
| `driver`               | ODBC-драйвер для использования.                                                                                                                            | :white_check_mark: |               |
| `host`                 | Имя хоста сервера базы данных.                                                                                                               | :white_check_mark: |               |
| `port`                 | Порт сервера базы данных.                                                                                                                   |                    | `1433`        |
| `database`             | Имя базы данных для подключения.                                                                                                            | :white_check_mark: |               |
| `schema`               | Схема для использования.                                                                                                                                 | :white_check_mark: |               |
| `authentication`       | Метод аутентификации для использования. Это не требуется для аутентификации Windows.                                                                 |                    | `'sql'`       |
| `UID`                  | Имя пользователя, используемое для аутентификации. Это можно не указывать в зависимости от метода аутентификации.                                                        |                    |               |
| `PWD`                  | Пароль, используемый для аутентификации. Это можно не указывать в зависимости от метода аутентификации.                                                        |                    |               |
| `windows_login`        | Установите это значение в `true`, чтобы использовать аутентификацию Windows. Это доступно только для SQL Server.                                                           |                    |               |
| `tenant_id`            | Идентификатор арендатора экземпляра Microsoft Entra ID. Это используется только при подключении к Azure SQL с сервисным принципалом.                     |                    |               |
| `client_id`            | Идентификатор клиента сервисного принципала Microsoft Entra. Это используется только при подключении к Azure SQL с сервисным принципалом Microsoft Entra.       |                    |               |
| `client_secret`        | Секрет клиента сервисного принципала Microsoft Entra. Это используется только при подключении к Azure SQL с сервисным принципалом Microsoft Entra.   |                    |               |
| `encrypt`              | Установите это значение в `false`, чтобы отключить использование шифрования. См. [выше](#connection-encryption).                                                         |                    | `true`        |
| `trust_cert`           | Установите это значение в `true`, чтобы доверять сертификату сервера. См. [выше](#connection-encryption).                                                           |                    | `false`       |
| `retries`              | Количество попыток повторить неудачное соединение.                                                                                                  |                    | `1`           |
| `schema_authorization` | Опционально укажите принципала, который должен владеть схемами, создаваемыми dbt. [Подробнее выше](#schema-authorization).                            |                    |               |
| `login_timeout`        | Количество секунд ожидания до получения ответа от сервера при установлении соединения. `0` означает, что тайм-аут отключен. |                    | `0`           |
| `query_timeout`        | Количество секунд ожидания до получения ответа от сервера при выполнении запроса. `0` означает, что тайм-аут отключен.         |                    | `0`           |

Допустимые значения для `authentication`:

* `sql`: Аутентификация SQL с использованием имени пользователя и пароля
* `ActiveDirectoryPassword`: Аутентификация Active Directory с использованием имени пользователя и пароля
* `ActiveDirectoryInteractive`: Аутентификация Active Directory с использованием имени пользователя и запросов MFA
* `ActiveDirectoryIntegrated`: Аутентификация Active Directory с использованием учетных данных текущего пользователя
* `ServicePrincipal`: Аутентификация Microsoft Entra ID с использованием сервисного принципала
* `CLI`: Аутентификация Microsoft Entra ID с использованием учетной записи, с которой вы вошли в Azure CLI
* `ActiveDirectoryMsi`: Аутентификация Microsoft Entra ID с использованием управляемой идентичности, доступной в системе
* `environment`: Аутентификация Microsoft Entra ID с использованием переменных окружения, как задокументировано [здесь](https://learn.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python)
* `auto`: Аутентификация Microsoft Entra ID, пробующая предыдущие методы аутентификации, пока не найдет работающий