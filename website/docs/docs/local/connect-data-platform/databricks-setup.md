---
title: "Настройка Databricks"
sidebar_label: "Databricks"
description: "Из этого руководства вы узнаете, как настроить хранилище Databricks в dbt."
id: "databricks-setup"
meta:
  maintained_by: Databricks
  authors: 'dbt loving Bricksters'
  github_repo: 'databricks/dbt-databricks'
  pypi_package: 'dbt-databricks'
  min_core_version: 'v0.18.0'
  cloud_support: Supported
  min_supported_version: 'Databricks SQL or DBR 12+'
  slack_channel_name: '#db-databricks-and-spark'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNGCW8HKL'
  platform_name: 'Databricks'
  config_page: '/reference/resource-configs/databricks-configs'
  product_badge: "Совместимо с dbt v2"
availability: local_free
--- 

<VersionBlock firstVersion="2.0">

# Подключение Databricks к <Constant name="fusion" />


Вы можете настроить адаптер Databricks, выполнив `dbt init` в интерфейсе командной строки (CLI) или вручную создав файл `profiles.yml` с полями, настроенными для вашего типа аутентификации.

Адаптер Databricks для <Constant name="fusion" /> поддерживает следующие [способы аутентификации](#supported-authentication-types):
- Персональный токен доступа (для отдельных пользователей)
- Токен сервисного принципала (для служебных пользователей)
- OAuth
- Федерация токенов OAuth с использованием OIDC

## Разрешения на доступ к хранилищу для <Constant name="fusion" />

import FusionDatabricksWarehousePerms from '/snippets/_v2-warehouse-permissions-databricks.md';

<FusionDatabricksWarehousePerms />

## Сведения о настройке Databricks

Адаптер `dbt-databricks` для <Constant name="fusion_engine" /> — единственный поддерживаемый способ подключения к Databricks.

`dbt-databricks` может подключаться к хранилищам Databricks SQL Warehouse. Эти хранилища рекомендуется использовать для начала работы с Databricks.

Подробнее о получении учетных данных для настройки профиля см. в [документации Databricks](https://docs.databricks.com/dev-tools/dbt.html#).

## Настройка <Constant name="fusion" />

При выполнении `dbt init` в CLI вам будет предложено заполнить следующие поля:

- **Host:** Имя хоста экземпляра Databricks (без префикса `http` или `https`)
- **HTTP Path:** Путь к вашему SQL-серверу или кластеру
- **Schema:** Схема проекта для разработки, промежуточной среды или развертывания
- **Catalog (необязательно):** Каталог Databricks, содержащий ваши схемы и таблицы


Кроме того, вы можете вручную создать файл `profiles.yml` и настроить поля. Примеры форматирования см. в разделе [аутентификации](#supported-authentication-types). Если файл `profiles.yml` уже существует, вам будет предложено сохранить существующие поля или перезаписать их. 

Затем выберите способ аутентификации. Следуйте инструкциям на экране, чтобы указать необходимые сведения.

## Поддерживаемые типы аутентификации {#supported-authentication-types}

<Tabs>

<TabItem value="Personal access token">

Введите свой персональный токен доступа (PAT) для среды Databricks. Подробнее о получении PAT см. в [документации Databricks](https://docs.databricks.com/aws/en/dev-tools/auth/pat). Databricks считает эту возможность устаревшей и рекомендует использовать OAuth вместо PAT.

#### Пример настройки с персональным токеном доступа

<File name="profiles.yml">

```yaml
default:
  target: dev
  outputs:
    dev:
      type: databricks
      database: TRANSFORMING
      schema: JANE_SMITH
      host: YOUR.HOST.COM
      http_path: YOUR/PATH/HERE
      token: ABC123
      auth_type: databricks_cli
      threads: 16
```

</File>

</TabItem>

<TabItem value="Service Principal token">

Введите токен сервисного принципала для среды Databricks. Подробнее о получении токена сервисного принципала см. в [документации Databricks](https://docs.databricks.com/aws/en/admin/users-groups/service-principals).

#### Пример настройки с токеном сервисного принципала

<File name="profiles.yml">

```yaml
default:
  target: dev
  outputs:
    dev:
      type: databricks
      database: TRANSFORMING
      schema: JANE_SMITH
      host: YOUR.HOST.COM
      http_path: YOUR/PATH/HERE
      token: ABC123
      auth_type: databricks_cli
      threads: 16
```

</File>

</TabItem>

<TabItem value="OAuth (Recommended)">

При выборе OAuth будет создано подключение к вашей среде Databricks и откроется веб-браузер для завершения аутентификации. Пользователям потребуется повторно проходить аутентификацию при запуске каждого нового сеанса dbt.

#### Пример настройки OAuth

<File name="profiles.yml">

```yaml
default:
  target: dev
  outputs:
    dev:
      type: databricks
      database: TRANSFORMING
      schema: JANE_SMITH
      host: YOUR.HOST.COM
      http_path: YOUR/PATH/HERE
      auth_type: oauth
      threads: 16
```
</File>

</TabItem>

<TabItem value="OAuth token federation">

Для использования федерации токенов OAuth можно передать токен OIDC через переменную окружения или файл.

#### Пример настройки OIDC с использованием переменной окружения

Чтобы передать токен OIDC через переменную окружения, задайте `auth_type: env-oidc` в `profiles.yml` и укажите токен OIDC в `DATABRICKS_OIDC_TOKEN`.

<File name="profiles.yml">
  
```yaml
  target: dev
  outputs:
    dev:
      type: databricks
      database: TRANSFORMING
      schema: JANE_SMITH
      host: YOUR.HOST.COM
      http_path: YOUR/PATH/HERE
      auth_type: env-oidc
      client_id: CLIENT_ID
      threads: 16
```

</File>

#### Пример настройки OIDC с использованием файла токена

Чтобы передать токен OIDC через файл токена, задайте `auth_type: file-oidc` в `profiles.yml` и укажите путь к файлу в `oidc_token_filepath`.

Вместо этого можно не указывать `oidc_token_filepath` в `profiles.yml`, а задать путь в переменной окружения `DATABRICKS_OIDC_TOKEN_FILE` или `DATABRICKS_OIDC_TOKEN_FILEPATH`. dbt использует переменную окружения, только если `oidc_token_filepath` отсутствует в `profiles.yml`. Если заданы оба значения, dbt использует только настройку из `profiles.yml` и никогда не обращается к переменной окружения в качестве запасного варианта. Мы рекомендуем задавать путь в `profiles.yml`.

<File name="profiles.yml">

```yaml
default:
  target: dev
  outputs:
    dev:
      type: databricks
      database: TRANSFORMING
      schema: JANE_SMITH
      host: YOUR.HOST.COM
      http_path: YOUR/PATH/HERE
      auth_type: file-oidc
      client_id: CLIENT_ID
      oidc_token_filepath: PATH/TO/TOKEN/FILE
      threads: 16
```

</File>

</TabItem>

</Tabs>

## Необязательные настройки подключения

Добавьте эти необязательные поля в настройки подключения Databricks в `profiles.yml`, чтобы управлять временем ожидания подключения и повторными попытками.

| Поле профиля | Описание | Значение по умолчанию |
| --- | --- | --- |
| `connect_timeout` | Сколько секунд dbt ожидает подключения к Databricks, прежде чем прекратить попытку. Укажите число больше `0`, иначе dbt вернет ошибку. Например, `600` означает 600 секунд (10 минут). Увеличьте это значение, если ваши задания запускаются, пока SQL-хранилище еще запускается. | `200` |
| `connect_retries` | Количество повторных попыток подключения к Databricks после неудачной первой попытки. Повторная попытка выполняется, только если Databricks помечает ошибку как допускающую повторную попытку или если `retry_all` имеет значение `true`. | `1` |
| `retry_all` | Установите `true`, чтобы повторять попытки при любой ошибке подключения. Установите `false`, чтобы повторять попытки только при ошибках, которые Databricks помечает как допускающие повторную попытку. | `false` |

Эти настройки применяются только к установлению подключения. Они не обеспечивают повторное выполнение запросов, завершившихся ошибкой после подключения dbt.

#### Пример

В следующем примере для `connect_timeout` задано значение `600` (10 минут), чтобы dbt мог дождаться запуска SQL-хранилища.

<File name="profiles.yml">

```yaml
outputs:
  dev:
    type: databricks
    # ...остальные поля подключения
    connect_timeout: 600
```

</File>

## Дополнительная информация

Информацию о настройках, специфичных для Databricks, см. в [справочном руководстве по адаптеру Databricks](/reference/resource-configs/databricks-configs).

</VersionBlock>

<VersionBlock lastVersion="1.99">

# Подключение Databricks к <Constant name="core" /> 

Также доступно подключение <ProductCard text="Совместимо с dbt v2" url="/docs/local/connect-data-platform/databricks-setup?version=2" />.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


`dbt-databricks` — рекомендуемый адаптер для Databricks. Он включает возможности, недоступные в `dbt-spark`, например:
- Поддержка Unity Catalog
- Отсутствие необходимости устанавливать дополнительные драйверы или зависимости для использования в CLI
- Использование Delta Lake для всех моделей без дополнительной настройки
- SQL-макросы, оптимизированные для работы с [Photon](https://docs.databricks.com/runtime/photon.html)

## Подключение к Databricks

Чтобы подключиться к платформе данных с помощью <Constant name="core" />, создайте соответствующие YAML-ключи и значения _профиля_ и _целевой среды_ в файле конфигурации `profiles.yml` для вашего хранилища Databricks SQL Warehouse или кластера. Этот YAML-файл dbt находится в каталоге `.dbt/` в домашнем каталоге пользователя. Подробнее см. в разделах [Профили подключения](/docs/local/profiles.yml) и [profiles.yml](/docs/local/profiles.yml).

`dbt-databricks` может подключаться к хранилищам Databricks SQL Warehouse и универсальным кластерам. Хранилища Databricks SQL Warehouse — рекомендуемый способ начать работу с Databricks.

Подробнее о получении учетных данных для настройки профиля см. в [документации Databricks](https://docs.databricks.com/dev-tools/dbt.html#).

### Примеры {#examples}

Для подключения к Databricks можно использовать аутентификацию на основе токенов, клиентскую аутентификацию OAuth или федерацию токенов OAuth с использованием OIDC. В следующих примерах показано, как настроить профиль для каждого типа аутентификации.

Приложение OAuth по умолчанию для dbt-databricks автоматически включено в каждой учетной записи с ожидаемыми настройками.  Приложение адаптера можно найти в [Account Console](https://accounts.cloud.databricks.com) > [Settings](https://accounts.cloud.databricks.com/settings) > [App Connections](https://accounts.cloud.databricks.com/settings/app-integrations) > dbt adapter for Databricks. Если вы не можете найти приложение адаптера, возможно, dbt отключен в вашей учетной записи. Воспользуйтесь этим [руководством](https://docs.databricks.com/en/integrations/enable-disable-oauth.html), чтобы снова включить dbt-databricks в качестве приложения OAuth.

<Tabs queryString="tokenoauth">

<TabItem value="token" label="Аутентификация на основе токенов">

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: CATALOG_NAME #необязательное имя каталога при использовании Unity Catalog]
      schema: SCHEMA_NAME # Обязательно
      host: YOURORG.databrickshost.com # Обязательно
      http_path: /SQL/YOUR/HTTP/PATH # Обязательно
      token: dapiXXXXXXXXXXXXXXXXXXXXXXX # Персональный токен доступа (PAT), обязателен при аутентификации на основе токенов
      threads: 1_OR_MORE  # Необязательно, по умолчанию 1
```

</File>

</TabItem>

<TabItem value="oauth-m2m" label="Клиентская аутентификация OAuth (M2M)">


<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: CATALOG_NAME #необязательное имя каталога при использовании Unity Catalog
      schema: SCHEMA_NAME # Обязательно
      host: YOUR_ORG.databrickshost.com # Обязательно
      http_path: /SQL/YOUR/HTTP/PATH # Обязательно
      auth_type: oauth # Обязательно при аутентификации на основе OAuth
      client_id: OAUTH_CLIENT_ID # Идентификатор вашего приложения OAuth. Обязательно при аутентификации на основе OAuth. Для Azure Databricks ключ должен называться azure_client_id.
      client_secret: XXXXXXXXXXXXXXXXXXXXXXXXXXX # Секрет клиента OAuth. Обязательно при аутентификации на основе OAuth. Для Azure Databricks ключ должен называться azure_client_secret.
      threads: 1_OR_MORE  # Необязательно, по умолчанию 1
```
</File>

</TabItem>

<TabItem value="oauth-u2m" label="Клиентская аутентификация OAuth (U2M)">


<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: CATALOG_NAME #необязательное имя каталога при использовании Unity Catalog
      schema: SCHEMA_NAME # Обязательно
      host: YOUR_ORG.databrickshost.com # Обязательно
      http_path: /SQL/YOUR/HTTP/PATH # Обязательно
      auth_type: oauth # Обязательно при аутентификации на основе OAuth
      threads: 1_OR_MORE  # Необязательно, по умолчанию 1
```
</File>

</TabItem>

<TabItem value="oauth-token-federation" label="Федерация токенов OAuth">

Для использования федерации токенов OAuth можно передать токен OIDC через переменную окружения или файл.

#### Пример настройки OIDC с использованием переменной окружения

Чтобы передать токен OIDC через переменную окружения, задайте `auth_type: env-oidc` в `profiles.yml` и укажите токен OIDC в `DATABRICKS_OIDC_TOKEN`.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: CATALOG_NAME # необязательное имя каталога при использовании Unity Catalog
      schema: SCHEMA_NAME # Обязательно
      host: YOUR_ORG.databrickshost.com # Обязательно
      http_path: /SQL/YOUR/HTTP/PATH # Обязательно
      auth_type: env-oidc # Обязательно при аутентификации OIDC через переменную окружения
      client_id: CLIENT_ID # Идентификатор клиента вашего сервисного принципала. Обязательно при аутентификации OIDC.
      threads: 1_OR_MORE  # Необязательно, по умолчанию 1
```
</File>

#### Пример настройки OIDC с использованием файла токена

Чтобы передать токен OIDC через файл токена, задайте `auth_type: file-oidc` в `profiles.yml` и укажите путь к файлу в `oidc_token_filepath`.

Вместо этого можно не указывать `oidc_token_filepath` в `profiles.yml`, а задать путь в переменной окружения `DATABRICKS_OIDC_TOKEN_FILE` или `DATABRICKS_OIDC_TOKEN_FILEPATH`. dbt использует переменную окружения, только если `oidc_token_filepath` отсутствует в `profiles.yml`. Если заданы оба значения, dbt использует только настройку из `profiles.yml` и никогда не обращается к переменной окружения в качестве запасного варианта. Мы рекомендуем задавать путь в `profiles.yml`.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: CATALOG_NAME #необязательное имя каталога при использовании Unity Catalog
      schema: SCHEMA_NAME # Обязательно
      host: YOUR_ORG.databrickshost.com # Обязательно
      http_path: /SQL/YOUR/HTTP/PATH # Обязательно
      auth_type: file-oidc # Обязательно при аутентификации OIDC через файл
      client_id: CLIENT_ID # Идентификатор клиента вашего сервисного принципала. Обязательно при аутентификации OIDC.
      oidc_token_filepath: /PATH/TO/TOKEN/FILE # Путь к файлу, содержащему токен OIDC
      threads: 1_OR_MORE  # Необязательно, по умолчанию 1
```
</File>

</TabItem>

</Tabs>

## Параметры хоста

Следующие поля профиля обязательны всегда. 

| Поле     | Описание | Пример |
| --------- | ------- | ----------- |
|   `host`  | Имя хоста вашего кластера.<br/><br/>Не включайте префикс `http://` или `https://`. |  `YOURORG.databrickshost.com` | 
|   `http_path`   | HTTP-путь к вашему SQL-хранилищу или универсальному кластеру. | `/SQL/YOUR/HTTP/PATH`  | 
|  `schema`  |  Имя схемы в каталоге вашего кластера. <br/><br/>_Не рекомендуется_ использовать имена схем, содержащие буквы в верхнем или смешанном регистре.  | `MY_SCHEMA`  |

## Параметры аутентификации

Адаптер `dbt-databricks` поддерживает как [аутентификацию на основе токенов](/docs/local/connect-data-platform/databricks-setup?tokenoauth=token#examples), так и [клиентскую аутентификацию OAuth](/docs/local/connect-data-platform/databricks-setup?tokenoauth=oauth#examples).  

Используйте следующие **обязательные** параметры для настройки профиля для каждого типа аутентификации:

| Поле     | Тип аутентификации | Описание | Пример | 
| --------- | ------- | ----------- | ---- | 
|  `token`  |  На основе токенов  | Персональный токен доступа (PAT) для подключения к Databricks.  | `dapiXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |
|  `client_id`  | На основе OAuth (AWS/GCP) |  Идентификатор клиента для вашего приложения OAuth в Databricks  | `OAUTH_CLIENT_ID`  | 
|  `client_secret`  | На основе OAuth (AWS/GCP) |  Секрет клиента для вашего приложения OAuth в Databricks. | `XXXXXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |  
|  `azure_client_id`  | На основе OAuth (Azure) |  Идентификатор клиента для вашего приложения OAuth в Azure Databricks. | `AZURE_CLIENT_ID`  | 
|  `azure_client_secret`  | На основе OAuth (Azure) |  Секрет клиента для вашего приложения OAuth в Azure Databricks. | `XXXXXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |
|  `auth_type`  |  На основе OAuth |  Тип авторизации, необходимый для подключения к Databricks. <br /> | `oauth`  |

## Дополнительные параметры

Следующие поля профиля необязательны. Они помогают настроить работу сеанса кластера и dbt для вашего подключения.

| Поле профиля  |  Описание  | Пример   |
| ------------- | ------------------- | --------------- |
| `threads`   | Количество потоков, которые должен использовать dbt (по умолчанию `1`) |`8`  | 
| `connect_retries`  | Количество повторных попыток подключения dbt к Databricks (по умолчанию `1`)  |`3`   | 
| `connect_timeout`     | Время ожидания подключения к Databricks в секундах (по умолчанию время ожидания не ограничено)  | `1000` | 
| `session_properties`  | Задает свойства сеанса Databricks, используемые при подключении. Выполните `SET -v`, чтобы увидеть доступные параметры  |`ansi_mode: true` |
| `query_tags`  | JSON-строка пар «ключ — значение», добавляемых в качестве [тегов запросов](/reference/resource-configs/databricks-configs#query-tags) для отслеживания и аудита. (Доступно в dbt-databricks 1.11+)  | `'{"team": "analytics"}'` | 

## Поддерживаемые возможности

### Delta Lake

Поддерживается большинство возможностей <Constant name="core" />, однако некоторые функции доступны только
в Delta Lake.

Возможности, доступные только в Delta Lake:
1. Обновление инкрементальных моделей по `unique_key` вместо `partition_by` (см. [стратегию `merge`](/reference/resource-configs/databricks-configs#the-merge-strategy))
2. [Снимки](/docs/build/snapshots)


### Unity Catalog

Адаптер `dbt-databricks>=1.1.1` поддерживает трехуровневое пространство имен Unity Catalog (каталог / схема / отношения), позволяя организовывать и защищать данные так, как вам удобно.

</VersionBlock>
