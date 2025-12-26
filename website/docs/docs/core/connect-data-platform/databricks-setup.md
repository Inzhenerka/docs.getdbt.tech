---
title: "Настройка Databricks"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Databricks в dbt."
id: "databricks-setup"
meta:
  maintained_by: Databricks
  authors: 'some dbt loving Bricksters'
  github_repo: 'databricks/dbt-databricks'
  pypi_package: 'dbt-databricks'
  min_core_version: 'v0.18.0'
  cloud_support: Supported
  min_supported_version: 'Databricks SQL or DBR 12+'
  slack_channel_name: '#db-databricks-and-spark'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNGCW8HKL'
  platform_name: 'Databricks'
  config_page: '/reference/resource-configs/databricks-configs'
--- 

<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

`dbt-databricks` — это рекомендуемый адаптер для Databricks. Он включает функции, недоступные в `dbt-spark`, такие как:
- Поддержка Unity Catalog
- Нет необходимости устанавливать дополнительные драйверы или зависимости для использования в CLI
- Использование Delta Lake для всех моделей по умолчанию
- SQL макросы, оптимизированные для работы с [Photon](https://docs.databricks.com/runtime/photon.html)

## Подключение к Databricks

Чтобы подключиться к платформе данных с помощью dbt Core, создайте соответствующие ключи/значения _profile_ и _target_ в YAML-файле конфигурации `profiles.yml` для вашего Databricks SQL Warehouse/кластера. Этот YAML-файл dbt находится в директории `.dbt/` вашего пользовательского/домашнего каталога. Для получения дополнительной информации обратитесь к [Профили подключения](/docs/core/connect-data-platform/connection-profiles) и [profiles.yml](/docs/core/connect-data-platform/profiles.yml).

`dbt-databricks` может подключаться к Databricks SQL Warehouses и универсальным кластерам. Databricks SQL Warehouses — это рекомендуемый способ начать работу с Databricks.

Обратитесь к [документации Databricks](https://docs.databricks.com/dev-tools/dbt.html#) для получения дополнительной информации о том, как получить учетные данные для настройки вашего профиля.

### Примеры {#examples}

### Examples {#examples}

Вы можете использовать аутентификацию на основе токена или аутентификацию на основе OAuth‑клиента для подключения к Databricks. Обратитесь к следующим примерам, чтобы узнать больше о том, как настроить профиль для каждого типа аутентификации.

Приложение OAuth по умолчанию для dbt-databricks автоматически включено в каждой учетной записи с ожидаемыми настройками. Вы можете найти приложение адаптера в [Account Console](https://accounts.cloud.databricks.com) > [Settings](https://accounts.cloud.databricks.com/settings) > [App Connections](https://accounts.cloud.databricks.com/settings/app-integrations) > dbt adapter for Databricks. Если вы не можете найти приложение адаптера, возможно, dbt отключен в вашей учетной записи. В этом случае обратитесь к данному [руководству](https://docs.databricks.com/en/integrations/enable-disable-oauth.html), чтобы повторно включить dbt-databricks как OAuth‑приложение.

<Tabs queryString="tokenoauth">

<TabItem value="token" label="Аутентификация на основе токенов">

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: CATALOG_NAME #опциональное имя каталога, если вы используете Unity Catalog
      schema: SCHEMA_NAME # Обязательно
      host: YOURORG.databrickshost.com # Обязательно
      http_path: /SQL/YOUR/HTTP/PATH # Обязательно
      token: dapiXXXXXXXXXXXXXXXXXXXXXXX # Обязательно, если используется аутентификация на основе токенов
      threads: 1_OR_MORE  # Опционально, по умолчанию 1
```

</File>

</TabItem>

<TabItem value="oauth-m2m" label="Аутентификация OAuth на основе клиента (M2M)">


<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: CATALOG_NAME # необязательное имя каталога, если вы используете Unity Catalog
      schema: SCHEMA_NAME # обязательно
      host: YOUR_ORG.databrickshost.com # обязательно
      http_path: /SQL/YOUR/HTTP/PATH # обязательно
      auth_type: oauth # обязательно при использовании аутентификации на основе OAuth
      client_id: OAUTH_CLIENT_ID # идентификатор вашего OAuth‑приложения. Обязательно при использовании OAuth. Для Azure Databricks ключ должен называться azure_client_id.
      client_secret: XXXXXXXXXXXXXXXXXXXXXXXXXXX # секрет OAuth‑клиента. Обязателен при использовании OAuth. Для Azure Databricks ключ должен называться azure_client_secret.
      threads: 1_OR_MORE  # необязательно, значение по умолчанию — 1
```
</File>

</TabItem>

<TabItem value="oauth-u2m" label="Аутентификация OAuth на основе клиента (U2M)">

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: CATALOG_NAME # необязательное имя каталога, если вы используете Unity Catalog
      schema: SCHEMA_NAME # обязательно
      host: YOUR_ORG.databrickshost.com # обязательно
      http_path: /SQL/YOUR/HTTP/PATH # обязательно
      auth_type: oauth # обязательно при использовании аутентификации на основе OAuth
      threads: 1_OR_MORE  # необязательно, по умолчанию 1
```
</File>

</TabItem>

</Tabs>

## Параметры хоста

Следующие поля профиля всегда обязательны.

| Поле     | Описание | Пример |
| --------- | ------- | ----------- |
|   `host`  | Имя хоста вашего кластера.<br/><br/>Не включайте префикс `http://` или `https://`. |  `YOURORG.databrickshost.com` | 
|   `http_path`   | HTTP-путь к вашему SQL Warehouse или универсальному кластеру. | `/SQL/YOUR/HTTP/PATH`  | 
|  `schema`  |  Имя схемы в каталоге вашего кластера. <br/><br/>_Не рекомендуется_ использовать имена схем с заглавными или смешанными буквами.  | `MY_SCHEMA`  |

## Параметры аутентификации

Адаптер `dbt-databricks` поддерживает как [аутентификацию на основе токенов](/docs/core/connect-data-platform/databricks-setup?tokenoauth=token#examples), так и [аутентификацию на основе OAuth-клиента](/docs/core/connect-data-platform/databricks-setup?tokenoauth=oauth#examples).

Обратитесь к следующим **обязательным** параметрам для настройки вашего профиля для каждого типа аутентификации:

| Поле     | Тип аутентификации | Описание | Пример | 
| --------- | ------- | ----------- | ---- | 
|  `token`  |  Token-based  | Персональный токен доступа (Personal Access Token, PAT) для подключения к Databricks.  | `dapiXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |
|  `client_id`  | OAuth-based (AWS/GCP) | Идентификатор клиента для вашего OAuth‑приложения Databricks.  | `OAUTH_CLIENT_ID`  | 
|  `client_secret`  | OAuth-based (AWS/GCP) | Клиентский секрет для вашего OAuth‑приложения Databricks. | `XXXXXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |  
|  `azure_client_id`  | OAuth-based (Azure) | Идентификатор клиента для вашего OAuth‑приложения Azure Databricks. | `AZURE_CLIENT_ID`  | 
|  `azure_client_secret`  | OAuth-based (Azure) | Клиентский секрет для вашего OAuth‑приложения Azure Databricks. | `XXXXXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |
|  `auth_type`  |  OAuth-based | Тип авторизации, необходимый для подключения к Databricks. <br /> | `oauth`  |

## Дополнительные параметры

Следующие поля профиля являются опциональными для настройки. Они помогают настроить, как сессия вашего кластера и dbt работают для вашего подключения.

| Поле профиля  |  Описание  | Пример   |
| ------------- | ------------------- | --------------- |
| `threads`   | Количество потоков, которые должен использовать dbt (по умолчанию `1`) |`8`  | 
| `connect_retries`  | Количество попыток повторного подключения к Databricks (по умолчанию `1`)  |`3`   | 
| `connect_timeout`     | Сколько секунд до истечения времени ожидания подключения к Databricks (по умолчанию без ограничений)  | `1000` | 
| `session_properties`  | Устанавливает свойства сессии Databricks, используемые в подключении. Выполните `SET -v`, чтобы увидеть доступные опции  |`ansi_mode: true` | 

## Поддерживаемая функциональность

### Delta Lake

Поддерживается большая часть функциональности <Constant name="core" />, однако некоторые возможности доступны только при использовании Delta Lake.

Возможности, доступные только для Delta:
1. Инкрементальные обновления моделей по `unique_key` вместо `partition_by` (см. [стратегию `merge`](/reference/resource-configs/databricks-configs#the-merge-strategy))
2. [Снимки (Snapshots)](/docs/build/snapshots)

Функции, доступные только в Delta:
1. Инкрементальные обновления моделей по `unique_key` вместо `partition_by` (см. [стратегия `merge`](/reference/resource-configs/databricks-configs#the-merge-strategy))
2. [Снимки](/docs/build/snapshots)

### Unity Catalog

Адаптер `dbt-databricks>=1.1.1` поддерживает 3-уровневое пространство имен Unity Catalog (каталог / схема / отношения), что позволяет организовать и защитить ваши данные так, как вам нужно.