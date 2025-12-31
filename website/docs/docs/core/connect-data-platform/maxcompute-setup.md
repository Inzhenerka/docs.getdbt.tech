---
title: "Настройка MaxCompute"
description: "Прочитайте это руководство, чтобы узнать, как настроить MaxCompute в dbt."
meta:
  maintained_by: Alibaba Cloud MaxCompute Team
  authors: "Alibaba Cloud MaxCompute Team"
  github_repo: "aliyun/dbt-maxcompute"
  pypi_package: "dbt-maxcompute"
  min_core_version: "v1.8.0"
  cloud_support: Не поддерживается
  platform_name: "MaxCompute"
  config_page: "/reference/resource-configs/no-configs"
---

import SetUpPages from '/snippets/\_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к MaxCompute с помощью **dbt-maxcompute** {#connecting-to-maxcompute-with-dbt-maxcompute}

Ознакомьтесь с конфигурацией профиля dbt ниже для получения подробной информации.

<File name='~/.dbt/profiles.yml'>

```yaml
dbt-maxcompute: # это имя должно совпадать с профилем в файле dbt_project.yml
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: PROJECT_ID
      schema: SCHEMA_NAME
      endpoint: ENDPOINT
      auth_type: access_key
      access_key_id: ACCESS_KEY_ID
      access_key_secret: ACCESS_KEY_SECRET
```

</File>

В настоящее время поддерживаются следующие параметры:

| **Поле**            | **Описание**                                                                                                                 | Обязательно? | **Пример**                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------- |
| `type`              | Указывает тип подключения к базе данных; для подключения к MaxCompute должно быть установлено значение `"maxcompute"`.      | Обязательно  | `maxcompute`                                          |
| `project`           | Имя вашего проекта MaxCompute.                                                                                               | Обязательно  | `dbt-project`                                         |
| `endpoint`          | URL эндпоинта для подключения к MaxCompute.                                                                                  | Обязательно  | `http://service.cn-shanghai.maxcompute.aliyun.com/api` |
| `schema`            | Пространство имён (schema), которое будут использовать модели в MaxCompute.                                                  | Обязательно  | `default`                                             |
| `auth_type`         | Тип аутентификации для доступа к MaxCompute                                                                                  | Обязательно  | `access_key`                                          |
| `access_key_id`     | Access ID для аутентификации в MaxCompute.                                                                                   | Обязательно  | `XXX`                                                 |
| `access_key_secret` | Access Key для аутентификации в MaxCompute.                                                                                  | Обязательно  | `XXX`                                                 |

Другие типы аутентификации описаны в разделе ниже.

## Конфигурация аутентификации {#authentication-configuration}

`dbt-maxcompute` — это адаптер dbt, который позволяет бесшовно интегрироваться с сервисом MaxCompute от Alibaba Cloud и строить и управлять преобразованиями данных с помощью dbt. Для обеспечения безопасного и гибкого доступа к MaxCompute `dbt-maxcompute` использует библиотеку [credentials-python](https://github.com/aliyun/credentials-python), которая предоставляет полноценную поддержку различных методов аутентификации, поддерживаемых Alibaba Cloud.

С помощью `dbt-maxcompute` вы можете использовать все механизмы аутентификации, предоставляемые `credentials-python`, обеспечивая безопасное и эффективное управление учетными данными. Независимо от того, используете ли вы Access Keys, STS Tokens, RAM Roles или другие расширенные методы аутентификации, `dbt-maxcompute` поддерживает их все.

### Ключевые замечания по конфигурации {#key-notes-on-configuration}

Чтобы избежать неоднозначности в параметрах конфигурации, некоторые имена параметров были изменены по сравнению с теми, которые используются в `credentials-python`. В частности:

- `type` → `auth_type`
- `policy` → `auth_policy`
- `host` → `auth_host`
- `timeout` → `auth_timeout`
- `connect_timeout` → `auth_connect_timeout`
- `proxy` → `auth_proxy`

Эти изменения обеспечивают ясность и единообразие между различными методами аутентификации, сохраняя при этом совместимость с базовой библиотекой `credentials-python`.

## Использование {#usage}

Перед началом работы необходимо зарегистрироваться в Alibaba Cloud и получить свои [учетные данные](https://usercenter.console.aliyun.com/#/manage/ak).

### Типы учетных данных {#credential-type}

#### Access Key {#access-key}

Настройте учетные данные `access_key` через [User Information Management][ak]. Такой ключ имеет полные права доступа к учетной записи, поэтому его необходимо хранить в безопасности. В целях безопасности часто нельзя передавать AccessKey основной учетной записи с полными правами разработчику проекта. В этом случае можно создать [RAM Sub-account][ram], выдать ему соответствующие [права доступа][permissions] и использовать AccessKey этого RAM Sub-account.

```yaml
jaffle_shop: # это имя должно совпадать с профилем в файле dbt_project.yml
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Замените на имя вашего проекта
      schema: default # Замените на имя schema, например dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Замените на ваш endpoint MaxCompute
      auth_type: access_key # тип учетных данных, необязательно, по умолчанию 'access_key'
      access_key_id: accessKeyId # AccessKeyId
      access_key_secret: accessKeySecret # AccessKeySecret
```

#### STS {#sts}

Создайте временные учетные данные безопасности, запросив Temporary Security Credentials (TSC) через сервис Security Token Service (STS).

```yaml
jaffle_shop: # это имя должно совпадать с профилем в файле dbt_project.yml
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Замените на имя вашего проекта
      schema: default # Замените на имя schema, например dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Замените на ваш endpoint MaxCompute
      auth_type: sts # тип учетных данных
      access_key_id: accessKeyId # AccessKeyId
      access_key_secret: accessKeySecret # AccessKeySecret
      security_token: securityToken  # STS Token
```

#### RAM Role ARN {#ram-role-arn}

При указании [RAM Role][RAM Role] учетные данные смогут автоматически запрашивать и обновлять STS Token. Если вы хотите ограничить права ([как создать policy][policy]) STS Token, можно задать значение для `Policy`.

```yaml
jaffle_shop: # это имя должно совпадать с профилем в файле dbt_project.yml
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Замените на имя вашего проекта
      schema: default # Замените на имя schema, например dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Замените на ваш endpoint MaxCompute
      auth_type: ram_role_arn # тип учетных данных
      access_key_id: accessKeyId # AccessKeyId
      access_key_secret: accessKeySecret # AccessKeySecret
      security_token: securityToken  # STS Token
      role_arn: roleArn # Формат: acs:ram::USER_ID:role/ROLE_NAME
      role_session_name: roleSessionName # Имя сессии роли
      auth_policy: policy # Необязательно, ограничение прав STS Token
      role_session_expiration: 3600 # Необязательно, ограничение времени действия STS Token
```

#### OIDC Role ARN {#oidc-role-arn}

При указании [OIDC Role][OIDC Role] учетные данные смогут автоматически запрашивать и обновлять STS Token. Если вы хотите ограничить права ([как создать policy][policy]) STS Token, можно задать значение для `Policy`.

```yaml
jaffle_shop: # это имя должно совпадать с профилем в файле dbt_project.yml
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Замените на имя вашего проекта
      schema: default # Замените на имя schema, например dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Замените на ваш endpoint MaxCompute
      auth_type: oidc_role_arn # тип учетных данных
      access_key_id: accessKeyId # AccessKeyId
      access_key_secret: accessKeySecret # AccessKeySecret
      security_token: securityToken # STS Token
      role_arn: roleArn # Формат: acs:ram::USER_ID:role/ROLE_NAME
      oidc_provider_arn: oidcProviderArn # Формат: acs:ram::USER_Id:oidc-provider/OIDC Providers
      oidc_token_file_path: /Users/xxx/xxx # может быть заменено переменной окружения ALIBABA_CLOUD_OIDC_TOKEN_FILE
      role_session_name: roleSessionName # Имя сессии роли
      auth_policy: policy # Необязательно, ограничение прав STS Token
      role_session_expiration: 3600 # Необязательно, ограничение времени действия STS Token
```

#### ECS RAM Role {#ecs-ram-role}

Экземпляры ECS и ECI поддерживают привязку RAM-роли к экземпляру. Когда инструмент Credentials используется внутри экземпляра, привязанная к нему RAM-роль будет получена автоматически, а STS Token этой роли будет получен через обращение к сервису метаданных для завершения инициализации клиента учетных данных.

Сервер метаданных экземпляра поддерживает два режима доступа: защищённый режим и обычный режим. По умолчанию инструмент Credentials использует защищённый режим (IMDSv2) для получения учетных данных. Если при использовании защищённого режима возникает исключение, можно настроить параметр `disable_imds_v1` для выбора логики обработки ошибок:

- Если значение `false` (значение по умолчанию), будет продолжено использование обычного режима для получения учетных данных.
- Если значение `true`, это означает, что для получения учетных данных можно использовать только защищённый режим, и в случае ошибки будет выброшено исключение.

Поддержка IMDSv2 зависит от конфигурации вашего сервера.

```yaml
jaffle_shop: # это имя должно совпадать с профилем в файле dbt_project.yml
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Замените на имя вашего проекта
      schema: default # Замените на имя schema, например dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Замените на ваш endpoint MaxCompute
      auth_type: ecs_ram_role # тип учетных данных
      role_name: roleName # `role_name` необязателен. Если не задан, будет получен автоматически. Рекомендуется задавать его для уменьшения числа запросов.
      disable_imds_v1: True # Необязательно, принудительное отключение IMDSv1; можно задать через переменную окружения ALIBABA_CLOUD_IMDSV1_DISABLED
```

#### Credentials URI {#credentials-uri}

При указании credentials URI учетные данные будут получены из локального или удалённого URI и смогут автоматически обновляться.

```yaml
jaffle_shop: # это имя должно совпадать с профилем в файле dbt_project.yml
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Замените на имя вашего проекта
      schema: default # Замените на имя schema, например dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Замените на ваш endpoint MaxCompute
      auth_type: credentials_uri # тип учетных данных
      credentials_uri: http://local_or_remote_uri/ # Credentials URI
```

#### Bearer {#bearer}

Если учетные данные требуются для Cloud Call Centre (CCC), необходимо самостоятельно запросить и поддерживать Bearer Token.

```yaml
jaffle_shop: # это имя должно совпадать с профилем в файле dbt_project.yml
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Замените на имя вашего проекта
      schema: default # Замените на имя schema, например dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Замените на ваш endpoint MaxCompute
      auth_type: bearer # тип учетных данных
      bearer_token: bearerToken # BearerToken
```

### Использование цепочки провайдеров учетных данных {#use-the-credential-provider-chain}

```yaml
jaffle_shop: # это имя должно совпадать с профилем в файле dbt_project.yml
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: dbt-example # Замените на имя вашего проекта
      schema: default # Замените на имя schema, например dbt_bilbo
      endpoint: http://service.cn-shanghai.maxcompute.aliyun.com/api # Замените на ваш endpoint MaxCompute
      auth_type: chain
```

Цепочка провайдеров учетных данных по умолчанию ищет доступные учетные данные в следующем порядке:

1. **Учетные данные из переменных окружения**

   Поиск учетных данных в переменных окружения. Если переменные `ALIBABA_CLOUD_ACCESS_KEY_ID` и `ALIBABA_CLOUD_ACCESS_KEY_SECRET` определены и не пусты, программа использует их для создания учетных данных по умолчанию. Если дополнительно определена переменная `ALIBABA_CLOUD_SECURITY_TOKEN`, будут созданы временные учетные данные безопасности (STS). Обратите внимание: такой токен имеет срок действия, поэтому рекомендуется использовать его во временных окружениях.

2. **Файл учетных данных**

   Если существует файл `~/.alibabacloud/credentials.ini` (в Windows: `C:\Users\USER_NAME\.alibabacloud\credentials.ini`), программа автоматически создаёт учетные данные с указанным типом и именем. Файл по умолчанию может отсутствовать, но ошибка разбора приведёт к исключению. Имена конфигурационных элементов должны быть в нижнем регистре. Этот файл может использоваться несколькими проектами и инструментами, так как он находится вне проекта и не будет случайно закоммичен в систему контроля версий. Путь к файлу можно изменить с помощью переменной окружения `ALIBABA_CLOUD_CREDENTIALS_FILE`. Если не указано иное, используется конфигурация `default`. Также можно задать переменную окружения `ALIBABA_CLOUD_PROFILE` для выбора нужной конфигурации.

    ```ini
    [default]                          # настройки по умолчанию
    enable = true                      # Включено; по умолчанию true, если параметр отсутствует
    type = access_key                  # Тип аутентификации: access_key
    access_key_id = foo                # Key
    access_key_secret = bar            # Secret

    [client1]                          # конфигурация с именем `client1`
    type = ecs_ram_role                # Тип аутентификации: ecs_ram_role
    role_name = EcsRamRoleTest         # Имя роли

    [client2]                          # конфигурация с именем `client2`
    enable = false                     # Отключено
    type = ram_role_arn                # Тип аутентификации: ram_role_arn
    region_id = cn-test
    policy = test                      # необязательно, ограничение прав
    access_key_id = foo
    access_key_secret = bar
    role_arn = role_arn
    role_session_name = session_name   # необязательно

    [client3]                          # конфигурация с именем `client3`
    enable = false                     # Отключено
    type = oidc_role_arn               # Тип аутентификации: oidc_role_arn
    region_id = cn-test
    policy = test                      # необязательно, ограничение прав
    access_key_id = foo                # необязательно
    access_key_secret = bar            # необязательно
    role_arn = role_arn
    oidc_provider_arn = oidc_provider_arn
    oidc_token_file_path = /xxx/xxx    # может быть заменено переменной окружения ALIBABA_CLOUD_OIDC_TOKEN_FILE
    role_session_name = session_name   # необязательно
    ```

3. **Instance RAM Role**

   Если учетные данные с более высоким приоритетом отсутствуют, инструмент Credentials попытается получить значение `ALIBABA_CLOUD_ECS_METADATA` (имя RAM-роли экземпляра ECS) из переменных окружения. Если значение существует, программа будет использовать защищённый режим (IMDSv2) для доступа к сервису метаданных ECS и получения STS Token для RAM-роли экземпляра. В случае ошибки в защищённом режиме будет использован обычный режим в качестве запасного варианта. Также можно управлять поведением через переменную окружения `ALIBABA_CLOUD_IMDSV1_DISABLED`:

   - Значение `false`: будет продолжено использование обычного режима.
   - Значение `true`: будет использоваться только защищённый режим, и при ошибке будет выброшено исключение.

   Поддержка IMDSv2 зависит от конфигурации вашего сервера.

4. **Credentials URI**

   Если переменная окружения `ALIBABA_CLOUD_CREDENTIALS_URI` определена и не пуста, программа использует её значение как credentials URI для получения временных учетных данных безопасности.

## Ссылки {#references}

- [Credentials Python](https://github.com/aliyun/credentials-python)
