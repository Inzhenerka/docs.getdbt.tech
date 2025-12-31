---
title: "Настройка Microsoft Fabric Data Warehouse"
description: "Прочитайте это руководство, чтобы узнать о настройке Microsoft Fabric Data Warehouse в dbt."
id: fabric-setup
meta:
  maintained_by: Microsoft
  authors: 'Microsoft'
  github_repo: 'Microsoft/dbt-fabric'
  pypi_package: 'dbt-fabric'
  min_core_version: '1.4.0'
  cloud_support: Supported
  platform_name: 'Microsoft Fabric'
  config_page: '/reference/resource-configs/fabric-configs'
---

<Snippet path="warehouse-setups-cloud-callout" />

Ниже приведено руководство по работе с [Fabric Data Warehouse](https://learn.microsoft.com/en-us/fabric/data-warehouse/data-warehousing#synapse-data-warehouse) — новым продуктом в составе Microsoft Fabric. В настоящее время адаптер поддерживает подключение к хранилищу данных (warehouse).

Чтобы узнать, как настроить dbt для работы с Fabric Lakehouse, см. раздел [Microsoft Fabric Lakehouse](/docs/core/connect-data-platform/fabricspark-setup).

Чтобы узнать, как настроить dbt для работы с выделенными SQL-пулами Analytics, см. раздел [Microsoft Azure Synapse Analytics setup](/docs/core/connect-data-platform/azuresynapse-setup).


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

### Предварительные требования {#prerequisites}

На Debian/Ubuntu убедитесь, что у вас есть заголовочные файлы ODBC перед установкой

```bash
sudo apt install unixodbc-dev
```

Скачайте и установите [Microsoft ODBC Driver 18 для SQL Server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15).
Если у вас уже установлен ODBC Driver 17, то он также подойдет.

#### Поддерживаемые конфигурации {#supported-configurations}

* Адаптер протестирован с Microsoft Fabric Data Warehouse (также называемыми warehouses).
* Мы тестируем все комбинации с Microsoft ODBC Driver 17 и Microsoft ODBC Driver 18.
* Сортировки (collations), на которых мы запускаем наши тесты — `Latin1_General_100_BIN2_UTF8`.

Поддержка адаптера не ограничивается матрицей вышеуказанных конфигураций. Если вы заметите проблему с любой другой конфигурацией, дайте нам знать, открыв проблему на [GitHub](https://github.com/microsoft/dbt-fabric).

##### Неподдерживаемые конфигурации {#unsupported-configurations}
Конечные точки SQL analytics доступны только для чтения и поэтому не подходят для рабочих нагрузок трансформации, используйте вместо этого Warehouse.

## Методы аутентификации и конфигурация профиля {#authentication-methods-profile-configuration}

:::info Supported authentication methods

Microsoft Fabric поддерживает два типа аутентификации:

- Microsoft Entra service principal
- Microsoft Entra password

Чтобы лучше разобраться в механизмах аутентификации, ознакомьтесь с нашей страницей [Connect Microsoft Fabric](/docs/cloud/connect-data-platform/connect-microsoft-fabric).

:::

### Common configuration {#common-configuration}

Для всех методов аутентификации обратитесь к следующим параметрам конфигурации, которые можно задать в вашем файле `profiles.yml`.
Полная справка по всем параметрам доступна [в конце этой страницы](#reference-of-all-connection-options).

| Параметр конфигурации | Описание | Тип | Пример |
| --------------------- | ---- | ---- | ------- |
| `driver` | ODBC-драйвер для использования | Обязательный | `ODBC Driver 18 for SQL Server` |
| `server` | Имя хоста сервера | Обязательный | `localhost` |
| `port` | Порт сервера | Обязательный | `1433` |
| `database` | Имя базы данных | Обязательный | Не применимо |
| `schema` | Имя схемы | Обязательный | `dbo` |
| `retries` | Количество автоматических попыток повторить запрос перед неудачей. По умолчанию `1`. Запросы с синтаксическими ошибками не будут повторяться. Этот параметр можно использовать для преодоления временных сетевых проблем. | Необязательный |  Не применимо  |
| `login_timeout` | Количество секунд, используемых для установления соединения перед неудачей. По умолчанию `0`, что означает, что тайм-аут отключен или используются системные настройки по умолчанию. | Необязательный |  Не применимо  |
| `query_timeout` | Количество секунд, используемых для ожидания выполнения запроса перед неудачей. По умолчанию `0`, что означает, что тайм-аут отключен или используются системные настройки по умолчанию. | Необязательный |  Не применимо  |
| `schema_authorization` | Опционально укажите принципала, который должен владеть схемами, создаваемыми dbt. [Подробнее о авторизации схемы](#schema-authorization). | Необязательный |  Не применимо  |
| `encrypt` | Шифровать ли соединение с сервером. По умолчанию `true`. Подробнее о [шифровании соединения](#connection-encryption). | Необязательный |  Не применимо  |
| `trust_cert` | Доверять ли сертификату сервера. По умолчанию `false`. Подробнее о [шифровании соединения](#connection-encryption).| Необязательный |  Не применимо  |

### Шифрование соединения {#connection-encryption}

Microsoft внесла несколько изменений в выпуске ODBC Driver 18, которые влияют на то, как настраивается шифрование соединения.
Чтобы учесть эти изменения, начиная с dbt-sqlserver 1.2.0 или новее, значения по умолчанию для `encrypt` и `trust_cert` изменились.
Оба этих параметра теперь **всегда** будут включены в строку соединения с сервером, независимо от того, оставили ли вы их в конфигурации профиля или нет.

* Значение по умолчанию для `encrypt` — `true`, что означает, что соединения по умолчанию шифруются.
* Значение по умолчанию для `trust_cert` — `false`, что означает, что сертификат сервера будет проверен. Установив это значение в `true`, будет принят самоподписанный сертификат.

Более подробная информация о том, как эти значения влияют на ваше соединение и как они используются в разных версиях ODBC-драйвера, доступна в [документации Microsoft](https://learn.microsoft.com/en-us/sql/connect/odbc/dsn-connection-string-attribute?view=sql-server-ver16#encrypt).

### Стандартная аутентификация SQL Server {#standard-sql-server-authentication}

SQL Server и аутентификация Windows не поддерживаются в Microsoft Fabric Data Warehouse.

### Аутентификация Microsoft Entra ID {#microsoft-entra-id-authentication}

Аутентификация Microsoft Entra ID (ранее Azure AD) является механизмом аутентификации по умолчанию в Microsoft Fabric Data Warehouse.

Следующие дополнительные методы доступны для аутентификации в продуктах Azure SQL:

* Имя пользователя и пароль Microsoft Entra ID
* Сервисный принципал
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
      type: fabric
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

Client ID часто также называется Application ID.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
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

<TabItem value="environment_based">

Эта опция аутентификации позволяет динамически выбирать метод аутентификации в зависимости от доступных переменных окружения.

[Документация Microsoft по EnvironmentCredential](https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python)
объясняет доступные комбинации переменных окружения, которые вы можете использовать.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
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
      type: fabric
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

Эта опция аутентификации автоматически попытается использовать все доступные методы аутентификации.

Следующие методы пробуются по порядку:

1. Аутентификация на основе окружения
2. Аутентификация с управляемой идентичностью. Управляемая идентичность в настоящее время не поддерживается.
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
      type: fabric
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

#### Дополнительные опции для Microsoft Entra ID на Windows {#additional-options-for-microsoft-entra-id-on-windows}

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
      type: fabric
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
      type: fabric
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

### Автоматическое предоставление Microsoft Entra ID для грантов {#automatic-microsoft-entra-id-principal-provisioning-for-grants}

Обратите внимание, что автоматическое назначение принципалов Microsoft Entra ID в настоящее время не поддерживается Microsoft Fabric Data Warehouse. Несмотря на то что в dbt можно использовать блок конфигурации [`grants`](/reference/resource-configs/grants) для автоматической выдачи и отзыва прав доступа на ваши модели для пользователей или групп, хранилище данных на данный момент не поддерживает эту возможность.

Вам нужно добавить сервисный принципал или идентичность Microsoft Entra в рабочее пространство Fabric в качестве администратора.

### Авторизация схемы {#schema-authorization}

Вы можете опционально указать принципала, который должен владеть всеми схемами, создаваемыми dbt. Это затем используется в операторе `CREATE SCHEMA` следующим образом:

```sql
CREATE SCHEMA [schema_name] AUTHORIZATION [schema_authorization]
```

Распространенный случай использования — это использование, когда вы аутентифицируетесь с принципалом, у которого есть разрешения на основе группы, такой как группа Microsoft Entra ID. Когда этот принципал создает схему, сервер сначала попытается создать индивидуальный логин для этого принципала, а затем связать схему с этим принципалом. Если бы вы использовали Microsoft Entra ID в этом случае, то это бы не удалось, так как Azure SQL не может автоматически создавать логины для индивидуальных участников группы AD.

### Справочник по всем параметрам подключения {#reference-of-all-connection-options}

| Параметр конфигурации   | Описание                                                                                                                                        | Обязательный           | Значение по умолчанию |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------- |
| `driver`               | ODBC-драйвер для использования.                                                                                                                            | :white_check_mark: |               |
| `host`                 | Имя хоста сервера базы данных.                                                                                                               | :white_check_mark: |               |
| `port`                 | Порт сервера базы данных.                                                                                                                   |                    | `1433`        |
| `database`             | Имя базы данных для подключения.                                                                                                            | :white_check_mark: |               |
| `schema`               | Схема для использования.                                                                                                                                 | :white_check_mark: |               |
| `authentication`       | Метод аутентификации для использования. Это не требуется для аутентификации Windows.                                                                 |                    | `'sql'`       |
| `UID`                  | Имя пользователя для аутентификации. Это можно не указывать в зависимости от метода аутентификации.                                                        |                    |               |
| `PWD`                  | Пароль для аутентификации. Это можно не указывать в зависимости от метода аутентификации.                                                        |                    |               |
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

* `ActiveDirectoryPassword`: Аутентификация Active Directory с использованием имени пользователя и пароля
* `ActiveDirectoryInteractive`: Аутентификация Active Directory с использованием имени пользователя и запросов MFA
* `ActiveDirectoryIntegrated`: Аутентификация Active Directory с использованием учетных данных текущего пользователя
* `ServicePrincipal`: Аутентификация Microsoft Entra ID с использованием сервисного принципала
* `CLI`: Аутентификация Microsoft Entra ID с использованием учетной записи, в которую вы вошли в Azure CLI
* `environment`: Аутентификация Microsoft Entra ID с использованием переменных окружения, как задокументировано [здесь](https://learn.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python)
* `auto`: Аутентификация Microsoft Entra ID, пробующая предыдущие методы аутентификации, пока не найдет работающий
