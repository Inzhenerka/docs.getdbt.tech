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

Вы можете использовать аутентификацию на основе токенов или аутентификацию на основе OAuth-клиента для подключения к Databricks. Обратитесь к следующим примерам для получения дополнительной информации о том, как настроить ваш профиль для каждого типа аутентификации.

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

<TabItem value="oauth" label="Аутентификация на основе OAuth-клиента">

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: CATALOG_NAME #опциональное имя каталога, если вы используете Unity Catalog
      schema: SCHEMA_NAME # Обязательно
      host: YOUR_ORG.databrickshost.com # Обязательно
      http_path: /SQL/YOUR/HTTP/PATH # Обязательно
      auth_type: oauth # Обязательно, если используется аутентификация на основе OAuth
      client_id: OAUTH_CLIENT_ID # ID вашего OAuth-приложения. Обязательно, если используется аутентификация на основе OAuth
      client_secret: XXXXXXXXXXXXXXXXXXXXXXXXXXX # Секрет OAuth-клиента. Обязательно, если используется аутентификация на основе OAuth
      threads: 1_OR_MORE  # Опционально, по умолчанию 1
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
|  `token`  |  На основе токенов  | Личный токен доступа (PAT) для подключения к Databricks.  | `dapiXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |
|  `client_id`  | На основе OAuth |  ID клиента для вашего OAuth-приложения Databricks.<br />  | `OAUTH_CLIENT_ID`  | 
|  `client_secret`  | На основе OAuth |  Секрет клиента для вашего OAuth-приложения Databricks. <br />  | `XXXXXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |  
|  `auth_type`  |  На основе OAuth |  Тип авторизации, необходимый для подключения к Databricks. <br /> | `oauth`  |

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

Большинство функциональности dbt Core поддерживается, но некоторые функции доступны только в Delta Lake.

Функции, доступные только в Delta:
1. Инкрементальные обновления моделей по `unique_key` вместо `partition_by` (см. [стратегия `merge`](/reference/resource-configs/databricks-configs#the-merge-strategy))
2. [Снимки](/docs/build/snapshots)

### Unity Catalog

Адаптер `dbt-databricks>=1.1.1` поддерживает 3-уровневое пространство имен Unity Catalog (каталог / схема / отношения), что позволяет организовать и защитить ваши данные так, как вам нужно.