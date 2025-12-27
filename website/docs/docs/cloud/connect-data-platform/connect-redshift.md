---
title: "Подключение Redshift"
id: connect-redshift
description: "Инструкции по настройке подключения Redshift к dbt"
sidebar_label: "Подключение Redshift"
---

Платформа dbt поддерживает подключение к Redshift.

При создании подключения требуются следующие поля:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Host Name | Имя хоста базы данных, к которой выполняется подключение. Это может быть как hostname, так и IP-адрес. См. [страницы настройки](/docs/core/connect-data-platform/about-core-connections), чтобы узнать hostname для вашего адаптера. | Redshift: `hostname.region.redshift.amazonaws.com` |
| Port | Обычно 5439 (Redshift) | `5439` |
| Database | Логическая база данных, к которой выполняется подключение и в которой будут выполняться запросы. | `analytics` |

**Примечание**: При настройке подключения к Redshift в <Constant name="cloud" /> параметры, связанные с SSL, недоступны для ввода.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-connection.png" width="70%" title="Настройка подключения к Redshift"/>

### Параметры аутентификации

Ниже приведены поддерживаемые способы аутентификации для Redshift:

- Имя пользователя и пароль
- SSH-туннелирование
- Identity Center через [external Oauth](/docs/cloud/manage-access/redshift-external-oauth)
- Аутентификация IAM User через [extended attributes](/docs/dbt-cloud-environments#extended-attributes)

На <Constant name="dbt_platform" /> аутентификация IAM User в настоящее время поддерживается только через [extended attributes](/docs/dbt-cloud-environments#extended-attributes). После создания проекта среды разработки и деплоя можно обновить так, чтобы использовать extended attributes для передачи описанных ниже полей, так как некоторые из них не поддерживаются через текстовые поля.

Вам потребуется создать IAM User, сгенерировать [access key](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey), а также:

- для кластера — в поле `user` должен быть указан пользователь базы данных. IAM User используется только для аутентификации, а пользователь базы данных — для авторизации
- для Serverless — выдать IAM User разрешения в Redshift. Поле `user` игнорируется (но всё равно является обязательным)
- в обоих случаях поле `password` будет игнорироваться.

| Profile field | Example | Description |
| ------------- | ------- | ------------ |
| `method` | IAM | использование IAM для аутентификации через IAM User |
| `cluster_id` | CLUSTER_ID | Требуется для IAM-аутентификации только для provisioned-кластера, не для Serverless |
| `user` | username | Пользователь, выполняющий запросы к базе данных; игнорируется для Serverless (но всё равно обязателен) |
| `region` | us-east-1 | Регион вашего экземпляра Redshift |
| `access_key_id` | ACCESS_KEY_ID | [access key id](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey) IAM User |
| `secret_access_key` | SECRET_ACCESS_KEY | secret access key IAM User |

<br/>

#### Пример Extended Attributes для IAM User в Redshift Serverless

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

### Подключение через SSH-туннель

import BastionServer from '/snippets/_bastion-server.md';

<BastionServer redshift='Redshift' />

## Конфигурация

Чтобы оптимизировать производительность с помощью платформо-специфичных настроек в <Constant name="cloud" />, см. [настройки, специфичные для Redshift](/reference/resource-configs/redshift-configs).

Чтобы выдать пользователям или ролям права доступа к базе данных (права и привилегии), см. страницу [Redshift permissions](/reference/database-permissions/redshift-permissions).

## FAQs

<DetailsToggle alt_header="Database Error - could not connect to server: Connection timed out">
При настройке подключения к базе данных через SSH-туннель требуются следующие компоненты:

- Балансировщик нагрузки (например, ELB или NLB) для управления трафиком.
- Bastion host (или jump server), на котором работает SSH и который служит безопасной точкой входа.
- Сама база данных (например, кластер Redshift).

<Constant name="cloud" /> использует SSH-туннель для подключения через балансировщик нагрузки к базе данных. Это подключение устанавливается в начале выполнения каждого задания dbt. Если соединение туннеля разрывается, выполнение задания завершается с ошибкой.

Сбои туннеля обычно происходят по следующим причинам:

- SSH-демон завершает соединение, если оно слишком долго простаивает.
- Балансировщик нагрузки разрывает соединение при простое.
- <Constant name="cloud" /> пытается поддерживать соединение, отправляя проверки каждые 30 секунд, и система завершает соединение, если от SSH-сервиса нет ответа в течение 300 секунд. Это помогает избежать разрывов из-за простоя, если только таймаут балансировщика нагрузки не меньше 30 секунд.

На bastion host могут быть заданы дополнительные настройки SSH, которые отключают неактивных клиентов после нескольких проверок без ответа. По умолчанию выполняется три проверки.

Чтобы предотвратить преждевременные разрывы соединения, вы можете изменить настройки на bastion host:

- `ClientAliveCountMax` — настраивает количество проверок перед тем, как клиент будет считаться неактивным. Например, `ClientAliveCountMax 10` выполняет 10 проверок.
- `ClientAliveInterval` — настраивает интервал проверки активности клиента. Например, `ClientAliveInterval 30` выполняет проверку каждые 30 секунд.

Приведённые примеры настроек обеспечивают отключение неактивных SSH-клиентов примерно через 300 секунд, снижая вероятность сбоев туннеля.

</DetailsToggle>
