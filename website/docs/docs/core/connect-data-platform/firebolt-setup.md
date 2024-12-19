---
title: "Настройка Firebolt"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Firebolt в dbt."
meta:
  maintained_by: Firebolt
  authors: 'Firebolt'
  github_repo: 'firebolt-db/dbt-firebolt'
  pypi_package: 'dbt-firebolt'
  min_core_version: 'v1.1.0'
  cloud_support: Не поддерживается
  min_supported_version: 'n/a'
  slack_channel_name: '#db-firebolt'
  slack_channel_link: 'https://getdbt.slack.com/archives/C03K2PTHHTP'
  platform_name: 'Firebolt'
  config_page: '/reference/resource-configs/firebolt-configs'
---


Некоторые основные функции могут быть ограничены. Если вы хотите внести свой вклад, ознакомьтесь с исходным кодом репозитория, указанного ниже.


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />



Для получения другой информации, включая поддержку функций Firebolt, смотрите [README на GitHub](https://github.com/firebolt-db/dbt-firebolt/blob/main/README.md) и [журнал изменений](https://github.com/firebolt-db/dbt-firebolt/blob/main/CHANGELOG.md).


## Подключение к Firebolt

Чтобы подключиться к Firebolt из dbt, вам нужно добавить [профиль](https://docs.getdbt.com/docs/core/connection-profiles) в ваш файл `profiles.yml`. Профиль Firebolt соответствует следующему синтаксису:

<File name='profiles.yml'>

```yml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: firebolt
      client_id: "<id>"
      client_secret: "<secret>"
      database: "<database-name>"
      engine_name: "<engine-name>"
      account_name: "<account-name>"
      schema: <tablename-prefix>
      threads: 1
      #опциональные поля
      host: "<hostname>"
```

</File>


#### Описание полей профиля Firebolt

Чтобы указать значения в виде переменных окружения, используйте формат `{{ env_var('<variable_name>' }}`. Например, `{{ env_var('DATABASE_NAME' }}`.

| Поле                     | Описание |
|--------------------------|--------------------------------------------------------------------------------------------------------|
| `type`                   | Это должно быть указано либо в `profiles.yml`, либо в файле `dbt_project.yml`. Должно быть установлено на `firebolt`. |
| `client_id`                   | Обязательно. Ваш [идентификатор сервисного аккаунта](https://docs.firebolt.io/godocs/Guides/managing-your-organization/service-accounts.html). |
| `client_secret`               | Обязательно. Секрет, связанный с указанным `client_id`. |
| `database`               | Обязательно. Имя базы данных Firebolt, к которой нужно подключиться. |
| `engine_name`            | Обязательно в версии 0.21.10 и позже. Опционально в более ранних версиях. Имя (не URL) движка Firebolt, который нужно использовать в указанной `database`. Это должен быть универсальный движок с возможностью чтения и записи, и он должен быть запущен. Если не указано в более ранних версиях, используется движок по умолчанию для указанной `database`. |
| `account_name`           | Обязательно. Указывает имя аккаунта, под которым существует указанная `database`. |
| `schema`                 | Рекомендуется. Строка, добавляемая в качестве префикса к именам создаваемых таблиц при использовании [обходного решения с пользовательскими схемами](https://docs.getdbt.com/reference/warehouse-profiles/firebolt-profile#supporting-concurrent-development). |
| `threads`                | Обязательно. Установите более высокое значение для повышения производительности. |
| `host`                   | Опционально. Имя хоста подключения. Для всех клиентов это `api.app.firebolt.io`, которое будет использоваться, если не указано. |


#### Устранение неполадок при подключении

Если вы столкнулись с проблемами подключения к Firebolt из dbt, убедитесь, что выполнены следующие условия:
- У вас должны быть достаточные права для доступа к движку и базе данных.
- Ваш сервисный аккаунт должен быть привязан к пользователю.
- Движок должен быть запущен.


## Поддержка параллельной разработки

В dbt схемы баз данных используются для разделения сред разработчиков, чтобы параллельная разработка не вызывала конфликтов имен <Term id="table" />. Однако Firebolt в настоящее время не поддерживает схемы баз данных (это в планах). Чтобы обойти это, мы рекомендуем добавить следующий макрос в ваш проект. Этот макрос возьмет поле `schema` из вашего файла `profiles.yml` и использует его в качестве префикса для имен таблиц.

```sql
-- macros/generate_alias_name.sql
{% macro generate_alias_name(custom_alias_name=none, node=none) -%}
    {%- if custom_alias_name is none -%}
        {{ node.schema }}__{{ node.name }}
    {%- else -%}
        {{ node.schema }}__{{ custom_alias_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

Для примера, как это работает, предположим, что Шахар и Эрик оба работают над одним проектом.

В своем `.dbt/profiles.yml` Шахар устанавливает `schema=sh`, в то время как Эрик устанавливает `schema=er` в своем. Когда каждый из них запускает модель `customers`, модели будут сохранены в базе данных как таблицы с именами `sh_customers` и `er_customers` соответственно. При запуске dbt в производственной среде вы бы использовали еще один `profiles.yml` с выбранной вами строкой.