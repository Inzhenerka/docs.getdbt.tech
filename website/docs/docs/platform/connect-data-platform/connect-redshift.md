---
title: "Подключение Redshift"
id: connect-redshift
description: "Инструкции по настройке подключения Redshift к dbt"
sidebar_label: "Подключение Redshift"
availability:
  surface: platform
  access: login_required
---

# Подключение Redshift <ProductCard text="Совместимо с dbt v2" />
 
<Constant name="dbt_platform" /> поддерживает подключение к Redshift. 

## Права доступа к хранилищу данных для <Constant name="fusion" />

import FusionRedshiftWarehousePerms from '/snippets/_v2-warehouse-permissions-redshift.md';

<FusionRedshiftWarehousePerms />

Примеры SQL-команд для предоставления прав доступа в Redshift см. в разделе [Права доступа в Redshift](/reference/database-permissions/redshift-permissions).

## Поля подключения

При создании подключения используйте следующие поля:

<SimpleTable>
  
| Поле | Обязательное? | Описание | Примеры |
| ----- | -------- | ----------- | -------- |
| Server Hostname | Да | Имя хоста базы данных, к которой нужно подключиться. Это может быть имя хоста или IP-адрес. Чтобы найти имя хоста, см. раздел [Поиск кластера](https://docs.aws.amazon.com/redshift/latest/mgmt/connecting-connection-string.html). | Redshift: `hostname.region.redshift.amazonaws.com` |
| Port | Да | Обычно 5439 (Redshift) | `5439` |
| Database | Нет | Логическая база данных, к которой нужно подключиться и в которой будут выполняться запросы. | `analytics` |
| Retries | Нет | Количество повторных попыток (для каждой SQL-инструкции). Если не задано, по умолчанию используется 3. Максимальное значение — 10. | `4` |

</SimpleTable>

**Примечание**: При настройке подключения к Redshift в <Constant name="dbt" /> параметры SSL недоступны для ввода.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-connection.png" width="70%" title="Настройка подключения к Redshift"/>

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/postgres-redshift-connection.png" width="70%" title="Настройка подключения к Redshift"/>

Ниже приведены поддерживаемые способы аутентификации для Redshift:

- Имя пользователя и пароль
- SSH-туннелирование
- Identity Center через [external Oauth](/docs/platform/manage-access/redshift-external-oauth)
- Аутентификация IAM User через [extended attributes](/docs/dbt-platform-environments#extended-attributes)

- Имя пользователя и пароль
- SSH-туннелирование
- AWS IAM Identity Center через [внешний OAuth](/docs/platform/manage-access/redshift-external-oauth) (Okta или Entra ID) для подключений в среде разработки
- Аутентификация пользователя IAM через [расширенные атрибуты](/docs/dbt-platform-environments#extended-attributes)

На <Constant name="dbt_platform" /> аутентификация пользователя IAM в настоящее время поддерживается только через [расширенные атрибуты](/docs/dbt-platform-environments#extended-attributes). После создания проекта среды разработки и развертывания можно настроить на использование расширенных атрибутов для передачи описанных ниже полей, поскольку некоторые из них не поддерживаются при вводе через текстовые поля.

- для кластера — в поле `user` должен быть указан пользователь базы данных. IAM User используется только для аутентификации, а пользователь базы данных — для авторизации
- для Serverless — выдать IAM User разрешения в Redshift. Поле `user` игнорируется (но всё равно является обязательным)
- в обоих случаях поле `password` будет игнорироваться.

<SimpleTable>
| Profile field | Example | Description |
| ------------- | ------- | ------------ |
| `method` |IAM| Используйте IAM для аутентификации от имени пользователя IAM |
| `cluster_id` | CLUSTER_ID| Требуется для аутентификации IAM только для выделенного кластера, но не для Serverless |
| `user`   | username | Пользователь, выполняющий запросы к базе данных; игнорируется для Serverless (но по-прежнему обязателен) |
| `region`  | us-east-1 | Регион вашего экземпляра Redshift | 
| `access_key_id` | ACCESS_KEY_ID | [Идентификатор ключа доступа](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey) пользователя IAM |
| `secret_access_key` | SECRET_ACCESS_KEY | Секретный ключ доступа пользователя IAM |
</SimpleTable>

<br/>

#### Пример Extended Attributes для IAM User в Redshift Serverless {#example-extended-attributes-for-iam-user-on-redshift-serverless}

Чтобы не вставлять секреты напрямую в extended attributes, используйте [переменные окружения](/docs/build/environment-variables#handling-secrets):

<File name='~/.dbt/profiles.yml'>

```yaml
host: my-production-instance.myregion.redshift-serverless.amazonaws.com
method: iam
region: us-east-2
access_key_id: '{{ env_var(''DBT_ENV_ACCESS_KEY_ID'') }}'
secret_access_key: '{{ env_var(''DBT_ENV_SECRET_ACCESS_KEY'') }}'
```

</File>

И `DBT_ENV_ACCESS_KEY_ID`, и `DBT_ENV_SECRET_ACCESS_KEY` должны быть [заданы](/docs/build/environment-variables) для каждой среды, использующей extended attributes таким образом.

### Подключение через SSH-туннель {#connecting-using-an-ssh-tunnel}

import BastionServer from '/snippets/_bastion-server.md';

<BastionServer redshift='Redshift' />

## Конфигурация

Чтобы оптимизировать производительность с помощью настроек, специфичных для платформы данных, в <Constant name="dbt" />, обратитесь к разделу [Конфигурация для Redshift](/reference/resource-configs/redshift-configs).

## FAQs {#faqs}

<DetailsToggle alt_header="Ошибка базы данных - не удалось подключиться к серверу: время ожидания подключения истекло">
При настройке подключения к базе данных через SSH-туннель требуются следующие компоненты:

- Балансировщик нагрузки (например, ELB или NLB) для управления трафиком.
- Bastion host (или jump server), на котором работает SSH и который служит безопасной точкой входа.
- Сама база данных (например, кластер Redshift).

<Constant name="cloud" /> использует SSH-туннель для подключения через балансировщик нагрузки к базе данных. Это подключение устанавливается в начале выполнения каждого задания dbt. Если соединение туннеля разрывается, выполнение задания завершается с ошибкой.

<Constant name="dbt" /> использует SSH-туннель для подключения к базе данных через балансировщик нагрузки. Это соединение устанавливается в начале каждого запуска задания dbt. Если соединение через туннель обрывается, задание завершается с ошибкой.

- SSH-демон завершает соединение, если оно слишком долго простаивает.
- Балансировщик нагрузки разрывает соединение при простое.
- <Constant name="cloud" /> пытается поддерживать соединение, отправляя проверки каждые 30 секунд, и система завершает соединение, если от SSH-сервиса нет ответа в течение 300 секунд. Это помогает избежать разрывов из-за простоя, если только таймаут балансировщика нагрузки не меньше 30 секунд.

- Демон SSH завершает соединение по тайм-ауту при слишком долгом бездействии.
- Балансировщик нагрузки разрывает соединение при бездействии.
- <Constant name="dbt" /> пытается поддерживать соединение, отправляя проверочные запросы каждые 30 секунд. Если служба SSH не отвечает в течение 300 секунд, система завершает соединение. Это помогает избежать разрывов из-за бездействия, если только тайм-аут балансировщика нагрузки не составляет менее 30 секунд.

Чтобы предотвратить преждевременные разрывы соединения, вы можете изменить настройки на bastion host:

- `ClientAliveCountMax` — настраивает количество проверок перед тем, как клиент будет считаться неактивным. Например, `ClientAliveCountMax 10` выполняет 10 проверок.
- `ClientAliveInterval` — настраивает интервал проверки активности клиента. Например, `ClientAliveInterval 30` выполняет проверку каждые 30 секунд.

Приведённые примеры настроек обеспечивают отключение неактивных SSH-клиентов примерно через 300 секунд, снижая вероятность сбоев туннеля.

</DetailsToggle>
