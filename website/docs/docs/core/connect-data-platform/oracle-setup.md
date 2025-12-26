---
title: "Настройка Oracle"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Oracle в dbt."
id: "oracle-setup"
meta:
  maintained_by: Oracle
  authors: 'Oracle'
  github_repo: 'oracle/dbt-oracle'
  pypi_package: 'dbt-oracle'
  min_core_version: 'v1.2.1'
  cloud_support: Not Supported
  min_supported_version: 'Oracle 12c and higher'
  slack_channel_name: '#db-oracle'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01PWH4TXLY'
  platform_name: 'Oracle'
  config_page: '/reference/resource-configs/oracle-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

### Настройка режима драйвера Python

[python-oracledb](https://oracle.github.io/python-oracledb/) делает установку библиотек Oracle Client необязательной.
Этот драйвер поддерживает 2 режима:

1. **Тонкий режим (предпочтительный)**: Процесс Python напрямую подключается к базе данных Oracle. В этом режиме не требуются библиотеки Oracle Client.
2. **Толстый режим**: Процесс Python связывается с библиотеками Oracle Client. Некоторые расширенные функции базы данных Oracle (например, Advanced Queuing, LDAP-соединения, прокручиваемые курсоры) в настоящее время доступны через библиотеки Oracle Client.

Вы можете настроить режим драйвера, используя переменную окружения `ORA_PYTHON_DRIVER_TYPE`. Используйте **тонкий** режим, так как он значительно упрощает установку.

| Режим драйвера         | Требуются ли библиотеки Oracle Client? | Конфигурация |
|------------------------|----------------------------------------|--------------|
| Тонкий                 | Нет                                    | `ORA_PYTHON_DRIVER_TYPE=thin`|
| Толстый                | Да                                     | `ORA_PYTHON_DRIVER_TYPE=thick` |

Значение по умолчанию для `ORA_PYTHON_DRIVER_TYPE` — `thin`.

<Tabs
defaultValue="thin"
  values={[
    { label: 'Тонкий', value: 'thin'},
    { label: 'Толстый', value: 'thick'}]
}>

<TabItem value="thin">

  ```bash
  export ORA_PYTHON_DRIVER_TYPE=thin # по умолчанию
  ```

</TabItem>

<TabItem value="thick">

  ```bash
  export ORA_PYTHON_DRIVER_TYPE=thick
  ```

### Установка библиотек Oracle Instant Client

В толстом режиме вам понадобятся установленные [библиотеки Oracle Instant Client](https://www.oracle.com/database/technologies/instant-client.html). Они обеспечивают необходимую сетевую связь, позволяя dbt-oracle получить доступ к экземпляру базы данных Oracle.

Поддерживаются версии Oracle Client 23, 21, 19, 18, 12 и 11.2. Рекомендуется использовать последнюю доступную версию клиента: стандартная совместимость версий клиент-сервер Oracle позволяет подключаться как к более старым, так и к более новым базам данных.

<Tabs
  defaultValue="linux"
  values={[
    { label: 'Linux', value: 'linux'},
    { label: 'Windows', value: 'windows'},
    { label: 'MacOS', value:'macos'}]
}>

<TabItem value="linux">

1. Скачайте zip-файл Oracle 23, 21, 19, 18, 12 или 11.2 "Basic" или "Basic Light", соответствующий вашей архитектуре Python 64-бит или 32-бит:
   1. [x86-64 64-бит](https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html)
   2. [x86 32-бит](https://www.oracle.com/database/technologies/instant-client/linux-x86-32-downloads.html)
   3. [ARM (aarch64) 64-бит](https://www.oracle.com/database/technologies/instant-client/linux-arm-aarch64-downloads.html)

2. Распакуйте пакет в одну директорию, доступную вашему приложению. Например:
  ```bash
  mkdir -p /opt/oracle
  cd /opt/oracle
  unzip instantclient-basic-linux.x64-21.6.0.0.0.zip
  ```

3. Установите пакет libaio с помощью sudo или от имени пользователя root. Например:
  ```bash
  sudo yum install libaio
  ```
  В некоторых дистрибутивах Linux этот пакет называется `libaio1`.

4. Если на машине нет другого программного обеспечения Oracle, которое будет затронуто, добавьте Instant Client в путь к библиотекам времени выполнения. Например, с помощью sudo или от имени пользователя root:

 ```bash
sudo sh -c "echo /opt/oracle/instantclient_21_6 > /etc/ld.so.conf.d/oracle-instantclient.conf"
sudo ldconfig
 ```

  В качестве альтернативы установите переменную окружения `LD_LIBRARY_PATH`

  ```bash
  export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_6:$LD_LIBRARY_PATH
  ```

5. Если вы используете дополнительные файлы конфигурации Oracle, такие как tnsnames.ora, sqlnet.ora или oraaccess.xml с Instant Client, поместите файлы в доступную директорию и установите переменную окружения TNS_ADMIN на имя этой директории.

  ```bash
  export TNS_ADMIN=/opt/oracle/your_config_dir
  ```

</TabItem>

<TabItem value="windows">

1. Скачайте zip-файл Oracle 21, 19, 18, 12 или 11.2 "Basic" или "Basic Light": [64-бит](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html) или [32-бит](https://www.oracle.com/database/technologies/instant-client/microsoft-windows-32-downloads.html), соответствующий вашей архитектуре Python.

:::info Пользователи Windows 7
Обратите внимание, что версии Oracle Client 21c и 19c не поддерживаются на Windows 7.
:::

2. Распакуйте пакет в директорию, доступную вашему приложению. Например, распакуйте `instantclient-basic-windows.x64-19.11.0.0.0dbru.zip` в `C:\oracle\instantclient_19_11`.

3. Библиотеки Oracle Instant Client требуют Visual Studio redistributable с 64-битной или 32-битной архитектурой, соответствующей архитектуре Instant Client.
   1. Для Instant Client 21 установите [VS 2019](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170) или более позднюю версию
   2. Для Instant Client 19 установите [VS 2017](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170)
   3. Для Instant Client 18 или 12.2 установите [VS 2013](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2013-vc-120)
   4. Для Instant Client 12.1 установите [VS 2010](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2010-vc-100-sp1-no-longer-supported)
   5. Для Instant Client 11.2 установите [VS 2005 64-bit](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2005-vc-80-sp1-no-longer-supported)

4. Добавьте директорию Oracle Instant Client в переменную окружения `PATH`. Директория должна находиться в `PATH` перед любыми другими директориями Oracle. Перезапустите все открытые окна командной строки.

   ```bash
   SET PATH=C:\oracle\instantclient_19_9;%PATH%
   ```

</TabItem>

<TabItem value="macos">

Проверьте документацию python-oracledb для инструкций по установке на [MacOS ARM64](https://python-oracledb.readthedocs.io/en/latest/user_guide/installation.html#instant-client-scripted-installation-on-macos-arm64) или [MacOS Intel x84-64](https://python-oracledb.readthedocs.io/en/latest/user_guide/installation.html#instant-client-scripted-installation-on-macos-intel-x86-64)

</TabItem>

</Tabs>
</TabItem>
</Tabs>

## Настройка кошелька для Oracle Autonomous Database (ADB-S) в облаке

dbt может подключаться к Oracle Autonomous Database (ADB-S) в Oracle Cloud, используя либо TLS (Transport Layer Security), либо взаимный TLS (mTLS). TLS и mTLS обеспечивают повышенную безопасность для аутентификации и шифрования.
Имя пользователя и пароль базы данных по-прежнему требуются для подключений dbt, которые можно настроить, как объясняется в следующем разделе [Подключение к базе данных Oracle](#connecting-to-oracle-database).

<Tabs
  defaultValue="tls"
  values={[
    { label: 'TLS', value: 'tls'},
    { label: 'Взаимный TLS', value: 'm-tls'}]
}>

<TabItem value="tls">

С TLS dbt может подключаться к Oracle ADB без использования кошелька. Оба режима драйвера python-oracledb поддерживают TLS.

:::info
В толстом режиме dbt может подключаться через TLS только при использовании версий библиотеки Oracle Client 19.14 (или более поздних) или 21.5 (или более поздних).
:::

Обратитесь к документации Oracle, чтобы [подключиться к экземпляру ADB с использованием аутентификации TLS](https://docs.oracle.com/en/cloud/paas/autonomous-database/adbsa/connecting-nodejs-tls.html#GUID-B3809B88-D2FB-4E08-8F9B-65A550F93A07) и к блогу [Легкие подключения без кошелька к Oracle Autonomous Databases в Python](https://blogs.oracle.com/opal/post/easy-way-to-connect-python-applications-to-oracle-autonomous-databases), чтобы включить TLS для вашего экземпляра Oracle ADB.
</TabItem>

<TabItem value="m-tls">

Для взаимных TLS-соединений необходимо скачать кошелек из консоли OCI и настроить драйвер Python для его использования.

#### Установка кошелька и файлов конфигурации сети

Из консоли Oracle Cloud для базы данных скачайте zip-файл кошелька, используя кнопку `DB Connection`. Zip-файл содержит кошелек и файлы конфигурации сети.

:::warning Примечание
Храните файлы кошелька в безопасном месте и делитесь ими только с авторизованными пользователями.
:::

Распакуйте zip-файл кошелька.

<Tabs
defaultValue="thin"
  values={[
    { label: 'Тонкий', value: 'thin'},
    { label: 'Толстый', value: 'thick'}]
}>

<TabItem value="thin">
В тонком режиме нужны только два файла из zip-архива:

- `tnsnames.ora` - Сопоставляет сетевые имена служб, используемые для строк подключения приложений, с вашими службами базы данных

- `ewallet.pem` - Обеспечивает SSL/TLS-соединения в тонком режиме. Храните этот файл в безопасности

После распаковки файлов в безопасную директорию установите переменные окружения **TNS_ADMIN** и **WALLET_LOCATION** на имя директории.

```bash
export WALLET_LOCATION=/path/to/directory_containing_ewallet.pem
export WALLET_PASSWORD=***
export TNS_ADMIN=/path/to/directory_containing_tnsnames.ora
```
При необходимости, если файл `ewallet.pem` зашифрован с использованием пароля кошелька, укажите пароль, используя переменную окружения **WALLET_PASSWORD**

</TabItem>

<TabItem value="thick">
В толстом режиме из zip-архива нужны следующие файлы:

- `tnsnames.ora` - Сопоставляет сетевые имена служб, используемые для строк подключения приложений, с вашими службами базы данных
- `sqlnet.ora` - Настраивает параметры сети Oracle
- `cwallet.sso` - Обеспечивает SSL/TLS-соединения

После распаковки файлов в безопасную директорию установите переменную окружения **TNS_ADMIN** на имя этой директории.

```bash
export TNS_ADMIN=/path/to/directory_containing_tnsnames.ora
```

Затем отредактируйте файл `sqlnet.ora`, чтобы указать на директорию кошелька.

<File name='sqlnet.ora'>

```text
WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="/path/to/wallet/directory")))
SSL_SERVER_DN_MATCH=yes
```

</File>

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## Подключение к базе данных Oracle

## Подключение к базе данных Oracle

Определите следующие обязательные параметры в виде переменных окружения и используйте их в профиле подключения с помощью Jinja-функции [env_var](/reference/dbt-jinja-functions/env_var). При необходимости вы также можете задать их напрямую в файле `profiles.yml`, однако это не рекомендуется.

```bash
export DBT_ORACLE_USER=<username>
export DBT_ORACLE_PASSWORD=***
export DBT_ORACLE_SCHEMA=<username>
export DBT_ORACLE_DATABASE=example_db2022adb
```

Используйте следующий запрос, чтобы получить имя базы данных:
```sql
SELECT SYS_CONTEXT('userenv', 'DB_NAME') FROM DUAL
```

Профиль подключения Oracle для dbt можно настроить, используя любой из следующих методов:

<Tabs
  defaultValue="tns_net_service_name"
  values={[
    { label: 'Использование TNS alias', value: 'tns_net_service_name'},
    { label: 'Использование строки подключения', value:'connect_string'},
    { label: 'Использование имени хоста базы данных', value: 'database_hostname'}]
}>

<TabItem value="tns_net_service_name">

Файл `tnsnames.ora` — это файл конфигурации, содержащий сетевые имена служб, сопоставленные с дескрипторами подключения.
Местоположение директории файла `tnsnames.ora` можно указать с помощью переменной окружения `TNS_ADMIN`.

<File name="tnsnames.ora">

```text
db2022adb_high = (description =
                 (retry_count=20)(retry_delay=3)
                 (address=(protocol=tcps)
                 (port=1522)
                 (host=adb.example.oraclecloud.com))
                 (connect_data=(service_name=example_high.adb.oraclecloud.com))
                 (security=(ssl_server_cert_dn="CN=adb.example.oraclecloud.com,
                 OU=Oracle BMCS US,O=Oracle Corporation,L=Redwood City,ST=California,C=US")))
```

</File>

TNS alias `db2022adb_high` можно определить как переменную окружения и использовать в `profiles.yml`.

```bash
export DBT_ORACLE_TNS_NAME=db2022adb_high
```

<File name='~/.dbt/profiles.yml'>

```yaml
dbt_test:
   target: dev
   outputs:
      dev:
         type: oracle
         user: "{{ env_var('DBT_ORACLE_USER') }}"
         pass: "{{ env_var('DBT_ORACLE_PASSWORD') }}"
         database: "{{ env_var('DBT_ORACLE_DATABASE') }}"
         tns_name: "{{ env_var('DBT_ORACLE_TNS_NAME') }}"
         schema: "{{ env_var('DBT_ORACLE_SCHEMA') }}"
         threads: 4
```
</File>
</TabItem>

<TabItem value="connect_string">

Строка подключения определяет, к какой службе базы данных подключаться. Это может быть:

- [Строка легкого подключения Oracle](https://docs.oracle.com/en/database/oracle/oracle-database/21/netag/configuring-naming-methods.html#GUID-B0437826-43C1-49EC-A94D-B650B6A4A6EE)
- Строка дескриптора подключения Oracle Net
- Сетевое имя службы, сопоставленное с дескриптором подключения

```bash
export DBT_ORACLE_CONNECT_STRING="(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)
                                  (host=adb.example.oraclecloud.com))(connect_data=(service_name=example_high.adb.oraclecloud.com))
                                  (security=(ssl_server_cert_dn=\"CN=adb.example.oraclecloud.com,
                                  OU=Oracle BMCS US,O=Oracle Corporation,L=Redwood City,ST=California,C=US\")))"
```

<File name='~/.dbt/profiles.yml'>

```yaml
dbt_test:
   target: "{{ env_var('DBT_TARGET', 'dev') }}"
   outputs:
      dev:
         type: oracle
         user: "{{ env_var('DBT_ORACLE_USER') }}"
         pass: "{{ env_var('DBT_ORACLE_PASSWORD') }}"
         database: "{{ env_var('DBT_ORACLE_DATABASE') }}"
         schema: "{{ env_var('DBT_ORACLE_SCHEMA') }}"
         connection_string: "{{ env_var('DBT_ORACLE_CONNECT_STRING') }}"
```

</File>
</TabItem>

<TabItem value="database_hostname">

Чтобы подключиться, используя имя хоста базы данных или IP-адрес, необходимо указать следующее:
- host
- port (1521 или 1522)
- protocol (tcp или tcps)
- service

```bash
export DBT_ORACLE_HOST=adb.example.oraclecloud.com
export DBT_ORACLE_SERVICE=example_high.adb.oraclecloud.com
```

<File name='~/.dbt/profiles.yml'>

```yaml
dbt_test:
   target: "{{ env_var('DBT_TARGET', 'dev') }}"
   outputs:
      dev:
         type: oracle
         user: "{{ env_var('DBT_ORACLE_USER') }}"
         pass: "{{ env_var('DBT_ORACLE_PASSWORD') }}"
         protocol: "tcps"
         host: "{{ env_var('DBT_ORACLE_HOST') }}"
         port: 1522
         service: "{{ env_var('DBT_ORACLE_SERVICE') }}"
         database: "{{ env_var('DBT_ORACLE_DATABASE') }}"
         schema: "{{ env_var('DBT_ORACLE_SCHEMA') }}"
         retry_count: 1
         retry_delay: 3
         threads: 4
```
</File>

</TabItem>

</Tabs>

:::info Примечание
Начиная с `dbt-oracle==1.0.2`, установка имени `database` в `profile.yml` является **необязательной**.

Начиная с `dbt-oracle==1.8.0`, ключ database в `profile.yml` **все еще необязателен для всех, кроме одного** из рабочих процессов dbt-oracle.
Если `database` отсутствует в `profile.yml`, сгенерированный каталог, используемый для документации проекта, будет пустым.

С версии `dbt-oracle==1.8` мы обнаруживаем, что ключ `database` отсутствует в `profile.yml`, и выдаем предупреждение о необходимости его добавления для генерации каталога. Сообщение предупреждения также показывает имя базы данных, которое ожидает dbt-oracle. Таким образом, пользователям не нужно беспокоиться о том, "какое" имя базы данных и "как" его получить.
:::

### Конфигурация кавычек

Конфигурация кавычек по умолчанию, используемая dbt-oracle, показана ниже:

<File name='dbt_project.yaml'>

```yaml
quoting:
  database: false
  identifier: false
  schema: false
```
</File>

Это рекомендуется и работает в большинстве случаев.

### Ошибка приблизительного совпадения отношения

Часто пользователи жалуются на ошибку приблизительного совпадения отношения, как показано ниже:

```
Ошибка компиляции в модели <model>
19:09:40    При поиске отношения dbt нашел приблизительное совпадение. Вместо того чтобы угадывать,
19:09:40    какое отношение использовать, dbt продолжит. Пожалуйста, удалите <model> или переименуйте его, чтобы он был менее двусмысленным.
  Искали: <model>
```

Это сообщается в нескольких каналах:

- [Ошибка приблизительного совпадения отношения на StackOverFlow](https://stackoverflow.com/questions/75892325/approximate-relation-match-with-dbt-on-oracle)

- [Проблема на Github #51](https://github.com/oracle/dbt-oracle/issues/51)

- [Проблема на Github #143](https://github.com/oracle/dbt-oracle/issues/143)

- [Проблема на Github #144](https://github.com/oracle/dbt-oracle/issues/144)

Во всех случаях решением было включение кавычек только для базы данных.

Чтобы решить эту проблему `приблизительного совпадения`, используйте следующую конфигурацию кавычек:

<File name='dbt_project.yaml'>

```yaml
quoting:
  database: true
```
</File>

## Модели Python, использующие Oracle Autonomous Database (ADB-S)

Пользователи Oracle's Autonomous Database Serverless (ADB-S) могут запускать модели dbt-py, используя Oracle Machine Learning (OML4PY), который доступен без дополнительной настройки.

### Возможности
- Пользовательская функция на Python выполняется в среде выполнения Python 3.12.1, запущенной в ADB-S
- Доступ к внешним Python-пакетам, доступным в среде выполнения Python. Например, `numpy`, `pandas`, `scikit_learn` и т.д.
- Интеграция с Conda 24.x для создания окружений с пользовательскими Python-пакетами
- Доступ к сессии базы данных внутри Python-функции
- DataFrame read API для чтения `TABLES`, `VIEWS` и произвольных `SELECT`-запросов в виде DataFrame
- DataFrame write API для записи DataFrame в виде `TABLES`
- Поддержка как табличной, так и инкрементальной материализации

### Настройка

#### Необходимые роли

- Пользователь должен быть не-ADMIN для выполнения функции Python
- Пользователю должна быть предоставлена роль `OML_DEVELOPER`

#### URL облачного сервиса OML

URL облачного сервиса OML имеет следующий формат:

```text
https://tenant1-dbt.adb.us-sanjose-1.oraclecloudapps.com
```

В этом примере:
  - `tenant1` — это идентификатор арендатора
  - `dbt` — это имя базы данных
  - `us-sanjose-1` — это регион центра обработки данных
  - `oraclecloudapps.com` — это корневой домен

Добавьте `oml_cloud_service_url` в ваш существующий `~/.dbt/profiles.yml`.

<File name='~/.dbt/profiles.yml'>

```yaml
dbt_test:
   target: dev
   outputs:
      dev:
         type: oracle
         user: "{{ env_var('DBT_ORACLE_USER') }}"
         pass: "{{ env_var('DBT_ORACLE_PASSWORD') }}"
         database: "{{ env_var('DBT_ORACLE_DATABASE') }}"
         tns_name: "{{ env_var('DBT_ORACLE_TNS_NAME') }}"
         schema: "{{ env_var('DBT_ORACLE_SCHEMA') }}"
         oml_cloud_service_url: "https://tenant1-dbt.adb.us-sanjose-1.oraclecloudapps.com"
```
</File>

### Конфигурации моделей Python

| Конфигурация | Тип данных | Примеры                                                                                      |
|--|--------|-----------------------------------------------------------------------------------------------|
| Материализация | Строка | `dbt.config(materialized="incremental")` или `dbt.config(materialized="table")`                |
| Сервис | Строка | `dbt.config(service="HIGH")` или `dbt.config(service="MEDIUM")` или `dbt.config(service="LOW")` |
| Асинхронный режим | Логический    | `dbt.config(async_flag=True)`  
| Тайм-аут в секундах, используется только с **_асинхронным_** режимом (`min: 1800` и `max: 43200`) | Целое число    | `dbt.config(timeout=1800)`  |
| Среда Conda | Строка | `dbt.config(conda_env_name="dbt_py_env")` |

В асинхронном режиме dbt-oracle запланирует задание Python, будет опрашивать статус задания и ждать его завершения.
Без асинхронного режима dbt-oracle немедленно вызовет задание Python в блокирующем режиме.

:::warning Примечание
Используйте `dbt.config(async_flag=True)` для длительных заданий Python.
:::

### Примеры моделей Python

#### Ссылка на другую модель

Используйте `dbt.ref(model_name)`, чтобы ссылаться на SQL или Python модель.

```python
def model(dbt, session):
    # Должно быть либо table, либо incremental (view в настоящее время не поддерживается)
    dbt.config(materialized="table")
    # возвращает oml.core.DataFrame, ссылающийся на модель dbt
    s_df = dbt.ref("sales_cost")
    return s_df
```

#### Ссылка на источник

Используйте `dbt.source(source_schema, table_name)`.

```python
def model(dbt, session):
    # Должно быть либо table, либо incremental (view в настоящее время не поддерживается)
    dbt.config(materialized="table")
    # oml.core.DataFrame, представляющий источник данных
    s_df = dbt.source("sh_database", "channels")
    return s_df

```

#### Инкрементальная материализация

```python
def model(dbt, session):
    # Должно быть либо table, либо incremental
    dbt.config(materialized="incremental")
    # oml.DataFrame, представляющий источник данных
    sales_cost_df = dbt.ref("sales_cost")

    if dbt.is_incremental:
        cr = session.cursor()
        result = cr.execute(f"select max(cost_timestamp) from {dbt.this.identifier}")
        max_timestamp = result.fetchone()[0]
        # фильтруем новые строки
        sales_cost_df = sales_cost_df[sales_cost_df["COST_TIMESTAMP"] > max_timestamp]

    return sales_cost_df
```

#### Конкатенация нового столбца в DataFrame

```python

def model(dbt, session):
    dbt.config(materialized="table")
    dbt.config(async_flag=True)
    dbt.config(timeout=1800)

    sql = f"""SELECT customer.cust_first_name,
       customer.cust_last_name,
       customer.cust_gender,
       customer.cust_marital_status,
       customer.cust_street_address,
       customer.cust_email,
       customer.cust_credit_limit,
       customer.cust_income_level
    FROM sh.customers customer, sh.countries country
    WHERE country.country_iso_code = ''US''
    AND customer.country_id = country.country_id"""

    # session.sync(query) выполнит SQL-запрос и вернет oml.core.DataFrame
    us_potential_customers = session.sync(query=sql)

    # Вычисляем произвольный аномальный балл по кредитному лимиту
    median_credit_limit = us_potential_customers["CUST_CREDIT_LIMIT"].median()
    mean_credit_limit = us_potential_customers["CUST_CREDIT_LIMIT"].mean()
    anomaly_score = (us_potential_customers["CUST_CREDIT_LIMIT"] - median_credit_limit)/(median_credit_limit - mean_credit_limit)

    # Добавляем новый столбец "CUST_CREDIT_ANOMALY_SCORE"
    us_potential_customers = us_potential_customers.concat({"CUST_CREDIT_ANOMALY_SCORE": anomaly_score.round(3)})

    # Возвращаем набор данных потенциальных клиентов как oml.core.DataFrame
    return us_potential_customers

```

### Использование пользовательской среды Conda

1. В качестве пользователя ADMIN создайте среду conda, используя [OML4PY Conda Notebook](https://docs.oracle.com/en/database/oracle/machine-learning/oml4py/1/mlpug/administrative-task-create-and-conda-environments.html):

```bash
conda create -n dbt_py_env -c conda-forge --override-channels --strict-channel-priority python=3.12.1 nltk gensim
```

2. Сохраните эту среду, используя следующую команду из OML4PY Conda Notebook:

```bash
conda upload --overwrite dbt_py_env -t application OML4PY
```

3. Используйте среду в моделях dbt Python:

```python
# Импортируйте пользовательские пакеты из сред Conda
import nltk
import gensim

def model(dbt, session):
    dbt.config(materialized="table")
    dbt.config(conda_env_name="dbt_py_env")  # Ссылаемся на среду conda
    dbt.config(async_flag=True) # Используем асинхронный режим для длительных заданий Python
    dbt.config(timeout=900)
    # oml.core.DataFrame, ссылающийся на модель dbt-sql
    promotion_cost = dbt.ref("direct_sales_channel_promo_cost")
    return promotion_cost
```

## Поддерживаемые функции

- Табличная материализация
- Материализация представлений
- Материализованное представление
- Инкрементальная материализация
- Seeds
- Источники данных
- Единичные тесты
- Общие тесты; Не null, Уникальные, Допустимые значения и Отношения
- Операции
- Анализы
- Экспозиции
- Генерация документации
- Публикация документации проекта в виде веб-сайта
- Модели Python (с версии dbt-oracle 1.5.1)
- Интеграция с Conda для использования любых пакетов Python из репозитория Anaconda
- Поддерживаются все команды dbt

## Неподдерживаемые функции
- Эфемерная материализация