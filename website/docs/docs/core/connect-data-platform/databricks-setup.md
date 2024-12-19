---
title: "Настройка Databricks"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Databricks в dbt."
id: "databricks-setup"
meta:
  maintained_by: Databricks
  authors: 'некоторые любители dbt из Bricksters'
  github_repo: 'databricks/dbt-databricks'
  pypi_package: 'dbt-databricks'
  min_core_version: 'v0.18.0'
  cloud_support: Поддерживается
  min_supported_version: 'Databricks SQL или DBR 12+'
  slack_channel_name: '#db-databricks-and-spark'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNGCW8HKL'
  platform_name: 'Databricks'
  config_page: '/reference/resource-configs/databricks-configs'
--- 

<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


`dbt-databricks` является рекомендуемым адаптером для Databricks. Он включает в себя функции, недоступные в `dbt-spark`, такие как:
- Поддержка Unity Catalog
- Нет необходимости устанавливать дополнительные драйверы или зависимости для использования в CLI
- Использование Delta Lake для всех моделей из коробки
- SQL макросы, оптимизированные для работы с [Photon](https://docs.databricks.com/runtime/photon.html)

## Подключение к Databricks

Чтобы подключиться к платформе данных с помощью dbt Core, создайте соответствующие ключи/значения _profile_ и _target_ в файле конфигурации `profiles.yml` для вашего хранилища/кластера Databricks SQL. Этот файл YAML dbt находится в директории `.dbt/` вашего пользовательского/домашнего каталога. Для получения дополнительной информации обратитесь к [Профилям подключения](/docs/core/connect-data-platform/connection-profiles) и [profiles.yml](/docs/core/connect-data-platform/profiles.yml).

`dbt-databricks` может подключаться к хранилищам Databricks SQL и кластерам общего назначения. Хранилища Databricks SQL являются рекомендуемым способом начать работу с Databricks.

Обратитесь к [документации Databricks](https://docs.databricks.com/dev-tools/dbt.html#) для получения дополнительной информации о том, как получить учетные данные для настройки вашего профиля.

### Примеры {#examples}

Вы можете использовать либо аутентификацию на основе токенов, либо аутентификацию на основе клиента OAuth для подключения к Databricks. Обратитесь к следующим примерам для получения дополнительной информации о том, как настроить ваш профиль для каждого типа аутентификации.

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
      token: dapiXXXXXXXXXXXXXXXXXXXXXXX # Обязательно, Личный токен доступа (PAT), если используется аутентификация на основе токенов
      threads: 1_OR_MORE  # Опционально, по умолчанию 1
```

</File>

</TabItem>

<TabItem value="oauth" label="Аутентификация на основе клиента OAuth">


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
      client_id: OAUTH_CLIENT_ID # ID вашего OAuth приложения. Обязательно, если используется аутентификация на основе OAuth
      client_secret: XXXXXXXXXXXXXXXXXXXXXXXXXXX # Секрет клиента OAuth. Обязательно, если используется аутентификация на основе OAuth
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
|   `http_path`   | HTTP путь к вашему SQL хранилищу или кластеру общего назначения. | `/SQL/YOUR/HTTP/PATH`  | 
|  `schema`  |  Имя схемы в каталоге вашего кластера. <br/><br/>Не рекомендуется использовать имена схем, содержащие заглавные или смешанные буквы.  | `MY_SCHEMA`  |

## Параметры аутентификации

Адаптер `dbt-databricks` поддерживает как [аутентификацию на основе токенов](/docs/core/connect-data-platform/databricks-setup?tokenoauth=token#examples), так и [аутентификацию на основе клиента OAuth](/docs/core/connect-data-platform/databricks-setup?tokenoauth=oauth#examples).  

Обратитесь к следующим **обязательным** параметрам для настройки вашего профиля для каждого типа аутентификации:

| Поле     | Тип аутентификации | Описание | Пример | 
| --------- | ------- | ----------- | ---- | 
|  `token`  |  На основе токенов  | Личный токен доступа (PAT) для подключения к Databricks.  | `dapiXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |
|  `client_id`  | На основе OAuth |  ID клиента для вашего OAuth приложения Databricks.<br />  | `OAUTH_CLIENT_ID`  | 
|  `client_secret`  | На основе OAuth |  Секрет клиента для вашего OAuth приложения Databricks. <br />  | `XXXXXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |  
|  `auth_type`  |  На основе OAuth |  Тип авторизации, необходимый для подключения к Databricks. <br /> | `oauth`  |

## Дополнительные параметры

Следующие поля профиля являются опциональными для настройки. Они помогают вам настроить, как будет работать сессия вашего кластера и dbt для вашего подключения.

| Поле профиля  |  Описание  | Пример   |
| ------------- | ------------------- | --------------- |
| `threads`   | Количество потоков, которые должен использовать dbt (по умолчанию `1`) |`8`  | 
| `connect_retries`  | Количество попыток, которые dbt должен предпринять для повторного подключения к Databricks (по умолчанию `1`)  |`3`   | 
| `connect_timeout`     | Сколько секунд до таймаута подключения к Databricks (по умолчанию поведение без таймаутов)  | `1000` | 
| `session_properties`  | Устанавливает свойства сессии Databricks, используемые в подключении. Выполните `SET -v`, чтобы увидеть доступные параметры  |`ansi_mode: true` | 

## Поддерживаемая функциональность

### Delta Lake

Большинство функций dbt Core поддерживаются, но некоторые функции доступны только на Delta Lake.

Функции, доступные только для Delta:
1. Инкрементальные обновления модели по `unique_key` вместо `partition_by` (см. [`merge` стратегию](/reference/resource-configs/databricks-configs#the-merge-strategy))
2. [Снимки](/docs/build/snapshots)


### Unity Catalog

Адаптер `dbt-databricks>=1.1.1` поддерживает 3-уровневое пространство имен Unity Catalog (каталог / схема / отношения), так что вы можете организовать и защитить свои данные так, как вам нравится.