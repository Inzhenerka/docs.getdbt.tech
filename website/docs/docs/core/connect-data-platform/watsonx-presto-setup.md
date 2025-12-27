---
title: "Настройка IBM watsonx.data Presto"
description: "Прочитайте это руководство, чтобы узнать о настройке IBM watsonx.data Presto в dbt."
id: "watsonx-presto-setup"
meta:
  maintained_by: IBM
  authors: Karnati Naga Vivek, Hariharan Ashokan, Biju Palliyath, Gopikrishnan Varadarajulu, Rohan Pednekar
  github_repo: 'IBM/dbt-watsonx-presto'
  pypi_package: 'dbt-watsonx-presto'
  min_core_version: v1.8.0
  cloud_support: 'Not Supported'
  min_supported_version: 'n/a'
  slack_channel_name: '#db-watsonx-presto'
  slack_channel_link: https://getdbt.slack.com/archives/C08C7D53R40
  platform_name: IBM watsonx.data
  config_page: /reference/resource-configs/watsonx-presto-config
---

Адаптер **dbt-watsonx-presto** позволяет использовать dbt для трансформации и управления данными в IBM watsonx.data Presto (Java), используя возможности его распределённого SQL-движка запросов. Перед началом убедитесь, что у вас есть следующее:
<ul>
  <li>Активный движок IBM watsonx.data Presto (Java) с параметрами подключения (host, port, catalog, schema) в SaaS или Software.</li>
  <li>Учётные данные для аутентификации: имя пользователя и пароль или API key.</li>
  <li>Для экземпляров watsonx.data требуется SSL‑проверка для безопасных подключений. Если хост экземпляра использует HTTPS, указывать параметр SSL‑сертификата не требуется. Однако если хост использует небезопасное HTTP‑подключение, необходимо указать путь к файлу SSL‑сертификата.</li>
</ul>

См. руководство [Configuring dbt-watsonx-presto](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=presto-configuration-setting-up-your-profile) для получения инструкций по получению и организации этих данных.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


## Подключение к IBM watsonx.data Presto

Чтобы подключить dbt к watsonx.data Presto (Java), необходимо настроить профиль в файле `profiles.yml`, который находится в каталоге `.dbt/` вашей домашней директории. Ниже приведён пример конфигурации для подключения к экземплярам IBM watsonx.data SaaS и Software:

<File name='~/.dbt/profiles.yml'>

```yaml
my_project:
  outputs:
    software:
      type: watsonx_presto
      method: BasicAuth
      user: [user]
      password: [password]
      host: [hostname]
      catalog: [catalog_name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]
      ssl_verify: path/to/certificate

    saas:
      type: watsonx_presto
      method: BasicAuth
      user: [user]
      password: [api_key]
      host: [hostname]
      catalog: [catalog_name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]

  target: software

```

</File>

## Параметры хоста

Следующие поля профиля необходимы для настройки подключения к watsonx.data Presto (Java). Для экземпляров IBM watsonx.data SaaS или Software вы можете получить значения `hostname` и `port`, нажав **View connect details** на странице сведений о движке Presto (Java).

| Option    | Required/Optional | Description | Example  |
| --------- | ------- | ------- | ----------- |
| `method`  | Required | Указывает метод аутентификации для безопасных подключений. Используйте `BasicAuth` при подключении к экземплярам IBM watsonx.data SaaS или Software. | `BasicAuth` |
|   `user`  | Required | Имя пользователя или адрес электронной почты для аутентификации. | `user` |
| `password`| Required | Пароль или API key для аутентификации. | `password` |
|   `host`  | Required | Имя хоста для подключения к Presto. | `127.0.0.1` |
| `catalog`| Required | Имя каталога в вашем экземпляре Presto. | `Analytics` |
|  `schema` | Required | Имя схемы внутри каталога Presto. | `my_schema`  |
|   `port`  | Required | Порт для подключения к Presto.  | `443`  |
| `ssl_verify` | Optional (default: **true**) | Указывает путь к SSL‑сертификату или логическое значение. Путь к SSL‑сертификату требуется, если экземпляр watsonx.data не является защищённым (HTTP). | `path/to/certificate` или `true` |


### Схемы и базы данных
При выборе каталога и схемы убедитесь, что у пользователя есть права на чтение и запись для обоих. Этот выбор не ограничивает вашу возможность выполнять запросы к каталогу. Вместо этого они служат местом по умолчанию, где будут материализовываться таблицы и представления. Кроме того, используемый в каталоге коннектор Presto должен поддерживать создание таблиц. Это значение по умолчанию можно изменить позже в рамках проекта dbt.

### Проверка SSL
- Если экземпляр Presto использует небезопасное HTTP‑подключение, необходимо установить `ssl_verify` в путь к файлу SSL‑сертификата.
- Если экземпляр использует `HTTPS`, этот параметр не требуется и может быть опущен.

## Дополнительные параметры

Следующие поля профиля являются необязательными. Они позволяют настроить сессию экземпляра и параметры dbt для подключения. 


| Profile field                 |  Description                                                                                                | Example                              |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `threads`                     | Количество потоков, которые должен использовать dbt (значение по умолчанию — `1`).                         | `8`                                  |
| `http_headers`                | HTTP‑заголовки, отправляемые вместе с запросами к Presto, задаются как YAML‑словарь пар (заголовок, значение). | `X-Presto-Routing-Group: my-instance` |
| `http_scheme`                 | HTTP‑схема, используемая для запросов (по умолчанию: `http`, либо `https` при использовании `BasicAuth`).   | `https` или `http`                    |
