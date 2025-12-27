---
title: "Настройка DeltaStream"
description: "Прочитайте это руководство, чтобы узнать, как настроить хранилище DeltaStream в dbt."
meta:
  maintained_by: Community
  authors: 'DeltaStream Team'
  github_repo: 'deltastreaminc/dbt-deltastream'
  pypi_package: 'dbt-deltastream'
  min_core_version: 'v1.10.0'
  cloud_support: Not supported
  min_supported_version: '?'
  slack_channel_name: '#db-deltastream'
  platform_name: 'DeltaStream'
  config_page: '/reference/resource-configs/deltastream-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к DeltaStream с помощью **dbt-deltastream**

Чтобы подключиться к DeltaStream из dbt, вам необходимо добавить [профиль](/docs/core/connect-data-platform/connection-profiles)
в файл `profiles.yml`. Профиль DeltaStream должен соответствовать следующему синтаксису:

<File name='profiles.yml'>

```yaml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: deltastream
      
      # Required parameters
      token: [ your-api-token ] # Authentication token for DeltaStream API
      database: [ your-database ] # Target database name
      schema: [ your-schema ] # Target schema name
      organization_id: [ your-org-id ] # Organization identifier
      
      # Optional parameters
      url: [ https://api.deltastream.io/v2 ] # DeltaStream API URL, defaults to https://api.deltastream.io/v2
      timezone: [ UTC ] # Timezone for operations, defaults to UTC
      session_id: [ <empty string> ] # Custom session identifier for debugging purpose
      role: [ <empty string> ] # User role
      store: [ <empty string> ] # Target store name
      compute_pool: [ <empty string> ] # Compute pool name to be used if any else use the default compute pool
```

</File>

### Описание полей профиля DeltaStream

| Поле              | Обязательное | Описание                                                                                                                                                                                                                                                                                                                                                           |
|-------------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`            | ✅            | Должно быть указано либо в `profiles.yml`, либо в файле `dbt_project.yml`. Значение должно быть `deltastream`.                                                                                                                                                                                                                                                    |
| `token`           | ✅            | Токен аутентификации для API DeltaStream. Рекомендуется хранить его в безопасном месте, предпочтительно в виде переменной окружения.                                                                                                                                                                                                                              |
| `database`        | ✅            | Имя целевой базы данных по умолчанию в DeltaStream, в которой будут создаваться модели dbt.                                                                                                                                                                                                                                                                       |
| `schema`          | ✅            | Имя целевой схемы по умолчанию в указанной базе данных.                                                                                                                                                                                                                                                                                                             |
| `organization_id` | ✅            | Идентификатор организации, который определяет, к какой организации DeltaStream вы подключаетесь.                                                                                                                                                                                                                                                                 |
| `url`             | ❌            | URL API DeltaStream. Если не указан, по умолчанию используется `https://api.deltastream.io/v2`.                                                                                                                                                                                                                                                                    |
| `timezone`        | ❌            | Часовой пояс для выполнения операций. Если не указан, по умолчанию используется `UTC`.                                                                                                                                                                                                                                                                            |
| `session_id`      | ❌            | Пользовательский идентификатор сессии для целей отладки. Помогает отслеживать операции в логах DeltaStream.                                                                                                                                                                                                                                                       |
| `role`            | ❌            | Роль пользователя внутри организации DeltaStream. Если не указана, используется роль по умолчанию, связанная с токеном.                                                                                                                                                                                                                                          |
| `store`           | ❌            | Имя целевого хранилища по умолчанию. Хранилища представляют собой подключения к внешним системам (Kafka, PostgreSQL и т.д.) в DeltaStream.                                                                                                                                                                                                                         |
| `compute_pool`    | ❌            | Имя пула вычислительных ресурсов, который будет использоваться для моделей, требующих вычислительных ресурсов. Если не указано, используется пул по умолчанию.                                                                                                                                                                                                   |

## Рекомендации по безопасности

При настройке проекта для продакшена настоятельно рекомендуется использовать переменные окружения для хранения конфиденциальной информации, такой как токен аутентификации:

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: prod
  outputs:
    prod:
      type: deltastream
      token: "{{ env_var('DELTASTREAM_API_TOKEN') }}"
      database: "{{ env_var('DELTASTREAM_DATABASE') }}"
      schema: "{{ env_var('DELTASTREAM_SCHEMA') }}"
      organization_id: "{{ env_var('DELTASTREAM_ORG_ID') }}"
```

</File>

## Устранение проблем с подключением

Если у вас возникают проблемы с подключением к DeltaStream из dbt, проверьте следующее:

### Проблемы с аутентификацией

- Убедитесь, что ваш API-токен действителен и не истёк
- Проверьте, что у токена есть необходимые разрешения для целевой организации
- Убедитесь, что значение `organization_id` соответствует вашей организации DeltaStream
