---
title: "Подключение Firebolt к dbt v1"
sidebar_label: "Firebolt"
description: "Прочитайте это руководство, чтобы узнать, как настроить подключение к хранилищу данных Firebolt в dbt."
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
availability: local_free
---

Некоторая основная функциональность может быть ограничена. Если вы заинтересованы в участии, ознакомьтесь с исходным кодом репозитория, указанного ниже.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

Для получения другой информации, включая поддержку функций Firebolt, см. [GitHub README](https://github.com/firebolt-db/dbt-firebolt/blob/main/README.md) и [changelog](https://github.com/firebolt-db/dbt-firebolt/blob/main/CHANGELOG.md).

## Подключение к Firebolt {#connecting-to-firebolt}

Для получения дополнительной информации, включая поддержку возможностей Firebolt, см. [README в GitHub](https://github.com/firebolt-db/dbt-firebolt/blob/main/README.md) и [changelog](https://github.com/firebolt-db/dbt-firebolt/blob/main/CHANGELOG.md).

## Подключение к Firebolt {#supporting-concurrent-development}

## Подключение к Firebolt

Чтобы подключиться к Firebolt из dbt, добавьте [профиль](/docs/local/profiles.yml) в файл `profiles.yml`. Профиль Firebolt имеет следующий синтаксис:

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
| `type`                   | Этот параметр должен быть указан либо в `profiles.yml`, либо в файле `dbt_project.yml`. Значение должно быть `firebolt`. |
| `client_id`                   | Обязательный параметр. Идентификатор вашей [сервисной учётной записи](https://docs.firebolt.io/godocs/Guides/managing-your-organization/service-accounts.html). |
| `client_secret`               | Обязательный параметр. Секрет, связанный с указанным `client_id`. |
| `database`               | Обязательный параметр. Имя базы данных Firebolt, к которой нужно подключиться. |
| `engine_name`            | Обязательный параметр. Имя (не URL) вычислительного движка Firebolt, который будет использоваться в указанной базе данных `database`. Это должен быть движок общего назначения с поддержкой чтения и записи, и он должен быть запущен. В более ранних версиях, если этот параметр не указан, используется движок по умолчанию для указанной базы данных `database`. |
| `account_name`           | Обязательный параметр. Указывает имя аккаунта, в котором находится указанная база данных `database`. |
| `schema`                 | Рекомендуемый параметр. Строка, добавляемая в качестве префикса к именам создаваемых таблиц при использовании [обходного решения для пользовательских схем](/docs/local/connect-data-platform/firebolt-setup#supporting-concurrent-development). |
| `threads`                | Обязательный параметр. Установите более высокое значение для повышения производительности. |
| `host`                   | Необязательный параметр. Имя хоста для подключения. Для всех клиентов это `api.app.firebolt.io`; это значение используется, если параметр не указан. |

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

В своём файле `.dbt/profiles.yml` Sharar задаёт `schema=sh`, а Eric в своём — `schema=er`. Когда каждый из них запускает модель `customers`, в базе данных создаются таблицы с именами `sh_customers` и `er_customers` соответственно. При запуске dbt в production вы будете использовать ещё один файл `profiles.yml` со строковым значением по вашему выбору.
