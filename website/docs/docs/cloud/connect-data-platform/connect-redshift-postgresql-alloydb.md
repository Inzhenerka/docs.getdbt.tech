---
title: "Подключение к Redshift, PostgreSQL и AlloyDB"
id: connect-redshift-postgresql-alloydb
description: "Инструкции по настройке подключения Redshift, PostgreSQL и AlloyDB к dbt Cloud"
sidebar_label: "Подключение к Redshift, PostgreSQL и AlloyDB"
---

При создании подключения к базе данных Postgres, Redshift или AlloyDB требуются следующие поля:

| Поле | Описание | Примеры |
| ----- | ----------- | -------- |
| Host Name | Имя хоста базы данных Postgres, Redshift или AlloyDB, к которой нужно подключиться. Это может быть как имя хоста, так и IP-адрес. | `xxx.us-east-1.amazonaws.com` или `hostname.us-east-1.redshift.amazonaws.com` или `workgroup-name.123456789.us-east-1.redshift-serverless.amazonaws.com` |
| Port | Обычно 5432 (Postgres) или 5439 (Redshift) | `5439` |
| Database | Логическая база данных, к которой нужно подключиться и выполнять запросы. | `analytics` |

**Примечание**: При настройке подключения Redshift или Postgres в dbt Cloud параметры, связанные с SSL, недоступны для ввода.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-connection.png" width="70%" title="Настройка подключения к Redshift"/>

### Параметры аутентификации

Для аутентификации пользователи dbt Cloud могут использовать либо **имя пользователя и пароль базы данных**, либо теперь могут использовать **аутентификацию IAM User** для Redshift через [расширенные атрибуты](/docs/dbt-cloud-environments#extended-attributes).

<Tabs
  defaultValue="database"
  values={[
    {label: 'База данных', value: 'database'},
    {label: 'IAM User', value: 'iam-user-inline'},
  ]}
>

<TabItem value="database">

Следующая таблица содержит параметры для метода подключения к базе данных (на основе пароля).

| Поле | Описание | Примеры |
| ------------- | ------- | ------------ |
| `user`   | Имя пользователя для входа в ваш кластер | myuser |
| `password`  | Пароль для аутентификации  | _password1! |

<br/>

</TabItem>

<TabItem value="iam-user-inline">

В Cloud аутентификация IAM User в настоящее время поддерживается только через [расширенные атрибуты](/docs/dbt-cloud-environments#extended-attributes). После создания проекта среды разработки и развертывания могут быть обновлены для использования расширенных атрибутов для передачи полей, описанных ниже, так как некоторые из них не поддерживаются через текстовое поле.

Вам нужно будет создать IAM User, сгенерировать [ключ доступа](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey) и либо:
- в кластере ожидается, что имя пользователя базы данных будет в поле `user`. IAM User используется только для аутентификации, а пользователь базы данных — для авторизации
- в Serverless предоставьте разрешение IAM User в Redshift. Поле `user` игнорируется (но все равно требуется)
- Для обоих случаев поле `password` будет игнорироваться.

| Поле профиля | Пример | Описание |
| ------------- | ------- | ------------ |
| `method` |IAM| использовать IAM для аутентификации через IAM User |
| `cluster_id` | CLUSTER_ID| Обязательно для аутентификации IAM только для выделенного кластера, не для Serverless |
| `user`   | username | Пользователь, выполняющий запросы к базе данных, игнорируется для Serverless (но все равно требуется) |
| `region`  | us-east-1 | Регион вашего экземпляра Redshift | 
| `access_key_id` | ACCESS_KEY_ID | IAM user [идентификатор ключа доступа](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey) |
| `secret_access_key` | SECRET_ACCESS_KEY | Секретный ключ доступа IAM user |

<br/>

#### Пример расширенных атрибутов для IAM User на Redshift Serverless

Чтобы избежать вставки секретов в расширенные атрибуты, используйте [переменные окружения](/docs/build/environment-variables#handling-secrets):

<File name='~/.dbt/profiles.yml'>

```yaml
host: my-production-instance.myregion.redshift-serverless.amazonaws.com
method: iam
region: us-east-2
access_key_id: '{{ env_var(''DBT_ENV_ACCESS_KEY_ID'') }}'
secret_access_key: '{{ env_var(''DBT_ENV_SECRET_ACCESS_KEY'') }}'
```

</File>

Обе переменные `DBT_ENV_ACCESS_KEY_ID` и `DBT_ENV_SECRET_ACCESS_KEY` должны быть [назначены](/docs/build/environment-variables) для каждой среды, использующей расширенные атрибуты.

</TabItem>

</Tabs>


### Подключение через SSH-туннель

Чтобы подключиться к экземпляру Postgres, Redshift или AlloyDB через SSH-туннель, выберите опцию **Использовать SSH-туннель** при создании вашего подключения. При настройке туннеля необходимо указать имя хоста, имя пользователя и порт для [bastion server](#about-the-bastion-server-in-aws).

После сохранения подключения будет сгенерирован и отображен открытый ключ для подключения. Вы можете скопировать этот открытый ключ на bastion server, чтобы авторизовать dbt Cloud для подключения к вашей базе данных через bastion server.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-ssh-tunnel.png" width="70%" title="Сгенерированный открытый ключ для подключения к Redshift"/>

#### О bastion server в AWS

<details>
  <summary>Что такое bastion server?</summary>
  <div>
    <div>
      Bastion server в <a href="https://aws.amazon.com/blogs/security/how-to-record-ssh-sessions-established-through-a-bastion-host/">Amazon Web Services (AWS)</a> — это хост, который позволяет dbt Cloud открывать SSH-соединение. 
      
      <br></br>
    
      dbt Cloud отправляет только запросы и не передает большие объемы данных. Это означает, что bastion server может работать на экземпляре AWS любого размера, например, t2.small или t2.micro.<br></br><br></br>
    
      Убедитесь, что местоположение экземпляра находится в той же виртуальной частной сети (VPC), что и экземпляр Redshift, и настройте группу безопасности для bastion server, чтобы обеспечить возможность подключения к порту хранилища данных.
    </div>
  </div>
</details>


### Настройка Bastion Server в AWS

Чтобы настроить SSH-туннель в dbt Cloud, вам нужно будет предоставить имя хоста/IP вашего bastion server, имя пользователя и порт, который вы выберете, к которому dbt Cloud будет подключаться. Ознакомьтесь со следующими шагами:

- Убедитесь, что bastion server настроен с сетевыми правилами безопасности для принятия подключений от [IP-адресов dbt Cloud](/docs/cloud/about-cloud/access-regions-ip-addresses) на любом порту, который вы настроили.
- Настройте учетную запись пользователя, используя CLI экземпляра bastion server. Следующий пример использует имя пользователя `dbtcloud`:
    
```shell
sudo groupadd dbtcloud
sudo useradd -m -g dbtcloud dbtcloud
sudo su - dbtcloud
mkdir ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```  

- Скопируйте и вставьте сгенерированный dbt Cloud открытый ключ в файл authorized_keys.

Теперь bastion server должен быть готов к использованию dbt Cloud в качестве туннеля в среду Redshift.


## Конфигурация

Чтобы оптимизировать производительность с учетом специфических конфигураций платформы данных в dbt Cloud, обратитесь к [конфигурации, специфичной для Redshift](/reference/resource-configs/redshift-configs).

Чтобы предоставить пользователям или ролям разрешения базы данных (права доступа и привилегии), обратитесь к странице [разрешений Redshift](/reference/database-permissions/redshift-permissions) или странице [разрешений Postgres](/reference/database-permissions/postgres-permissions).

## Часто задаваемые вопросы

<DetailsToggle alt_header="Ошибка базы данных - не удалось подключиться к серверу: время ожидания соединения">
При настройке подключения к базе данных с использованием SSH-туннеля вам понадобятся следующие компоненты:

- Балансировщик нагрузки (например, ELB или NLB) для управления трафиком.
- Bastion host (или jump server), который использует протокол SSH и служит безопасной точкой входа.
- Сама база данных (например, кластер Redshift).

dbt Cloud использует SSH-туннель для подключения через балансировщик нагрузки к базе данных. Это соединение устанавливается в начале любого запуска задания dbt. Если соединение туннеля разрывается, задание завершается с ошибкой.

Сбои туннеля обычно происходят по следующим причинам:

- Демон SSH завершает работу, если он неактивен слишком долго.
- Балансировщик нагрузки разрывает соединение, если оно неактивно.
- dbt Cloud пытается поддерживать соединение активным, проверяя его каждые 30 секунд, и система завершит соединение, если не будет ответа от службы SSH через 300 секунд. Это помогает избежать разрывов из-за неактивности, если только тайм-аут балансировщика нагрузки не меньше 30 секунд.

Bastion hosts могут иметь дополнительные настройки SSH для отключения неактивных клиентов после нескольких проверок без ответа. По умолчанию он проверяет три раза.

Чтобы предотвратить преждевременные отключения, вы можете настроить параметры на bastion host:

- `ClientAliveCountMax ` &mdash; Настраивает количество проверок перед тем, как решить, что клиент неактивен. Например, `ClientAliveCountMax 10` проверяет 10 раз.
- `ClientAliveInterval` &mdash; Настраивает, когда проверять активность клиента. Например, `ClientAliveInterval 30` проверяет каждые 30 секунд.
Примерные настройки обеспечивают отключение неактивных SSH-клиентов примерно через 300 секунд, что снижает вероятность сбоев туннеля.

</DetailsToggle>