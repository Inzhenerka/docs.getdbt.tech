---
title: "Настройка Firebolt"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Firebolt в dbt."
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

Некоторая основная функциональность может быть ограничена. Если вы заинтересованы в участии, ознакомьтесь с исходным кодом репозитория, указанного ниже.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

Для получения другой информации, включая поддержку функций Firebolt, см. [GitHub README](https://github.com/firebolt-db/dbt-firebolt/blob/main/README.md) и [changelog](https://github.com/firebolt-db/dbt-firebolt/blob/main/CHANGELOG.md).

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

Чтобы указать значения в качестве переменных окружения, используйте формат `{{ env_var('<variable_name>' }}`. Например, `{{ env_var('DATABASE_NAME' }}`.

| Поле                    | Описание |
|--------------------------|--------------------------------------------------------------------------------------------------------|
| `type`                   | Это поле должно быть включено либо в `profiles.yml`, либо в файл `dbt_project.yml`. Должно быть установлено значение `firebolt`. |
| `client_id`                   | Обязательно. Ваш [идентификатор учетной записи службы](https://docs.firebolt.io/godocs/Guides/managing-your-organization/service-accounts.html). |
| `client_secret`               | Обязательно. Секрет, связанный с указанным `client_id`. |
| `database`               | Обязательно. Имя базы данных Firebolt, к которой нужно подключиться. |
| `engine_name`            | Обязательно в версии 0.21.10 и позже. Опционально в более ранних версиях. Имя (не URL) движка Firebolt, который будет использоваться в указанной `database`. Это должен быть универсальный движок для чтения и записи, и он должен быть запущен. Если не указано в более ранних версиях, используется движок по умолчанию для указанной `database`. |
| `account_name`           | Обязательно. Указывает имя учетной записи, под которой существует указанная `database`. |
| `schema`                 | Рекомендуется. Строка, добавляемая в качестве префикса к именам сгенерированных таблиц при использовании [обходного пути для пользовательских схем](https://docs.getdbt.com/reference/warehouse-profiles/firebolt-profile#supporting-concurrent-development). |
| `threads`                | Обязательно. Установите большее значение для повышения производительности. |
| `host`                   | Опционально. Имя хоста подключения. Для всех клиентов это `api.app.firebolt.io`, которое будет использоваться, если не указано. |

#### Устранение неполадок подключения

Если у вас возникают проблемы с подключением к Firebolt из dbt, убедитесь, что выполнены следующие условия:
- У вас должны быть достаточные права доступа к движку и базе данных.
- Ваша учетная запись службы должна быть привязана к пользователю.
- Движок должен быть запущен.

## Поддержка параллельной разработки

В dbt схемы баз данных используются для разделения сред разработчиков, чтобы параллельная разработка не вызывала конфликтов имен <Term id="table" />. Однако Firebolt в настоящее время не поддерживает схемы баз данных (это в планах). Чтобы обойти это, мы рекомендуем добавить следующий макрос в ваш проект. Этот макрос будет использовать поле `schema` из вашего файла `profiles.yml` в качестве префикса имени таблицы.

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

Для примера того, как это работает, предположим, что Шахар и Эрик работают над одним и тем же проектом.

В своем `.dbt/profiles.yml` Шахар устанавливает `schema=sh`, тогда как Эрик устанавливает `schema=er`. Когда каждый из них запускает модель `customers`, модели будут размещены в базе данных как таблицы с именами `sh_customers` и `er_customers` соответственно. При запуске dbt в производственной среде вы бы использовали еще один `profiles.yml` с выбранной вами строкой.