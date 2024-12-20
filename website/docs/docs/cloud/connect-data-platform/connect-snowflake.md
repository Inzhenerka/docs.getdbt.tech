---
title: "Подключение Snowflake"
id: connect-snowflake
description: "Настройка подключения Snowflake."
sidebar_label: "Подключение Snowflake"
---

:::note

Подключения и учетные данные dbt Cloud наследуют разрешения настроенных учетных записей. Вы можете настроить роли и связанные с ними разрешения в Snowflake в соответствии с требованиями вашей компании и точно настроить доступ к объектам базы данных в вашей учетной записи. См. [Разрешения Snowflake](/reference/database-permissions/snowflake-permissions) для получения дополнительной информации о настройке ролей в Snowflake.

Обратитесь к [Разрешениям Snowflake](/reference/database-permissions/snowflake-permissions) для получения дополнительной информации о настройке ролей в Snowflake.

:::

Следующие поля обязательны при создании подключения Snowflake

| Поле | Описание | Примеры |
| ----- | ----------- | -------- |
| Account | Учетная запись Snowflake для подключения. Посмотрите [здесь](/docs/core/connect-data-platform/snowflake-setup#account), чтобы определить, как должно выглядеть поле учетной записи в зависимости от вашего региона.| <Snippet path="snowflake-acct-name" /> |
| Role | Обязательное поле, указывающее, какую роль следует принять после подключения к Snowflake | `transformer` |
| Database | Логическая база данных для подключения и выполнения запросов. | `analytics` |
| Warehouse | Виртуальный склад для использования при выполнении запросов. | `transforming` |

## Методы аутентификации

Этот раздел описывает различные методы аутентификации для подключения dbt Cloud к Snowflake. Настройте учетные данные среды развертывания (Production, Staging, General) глобально в разделе [**Connections**](/docs/deploy/deploy-environments#deployment-connection) в **Account settings**. Индивидуальные пользователи настраивают свои учетные данные разработки в разделе [**Credentials**](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#get-started-with-the-cloud-ide) своего профиля пользователя.

### Имя пользователя / Пароль

**Доступно в:** Среды разработки, Среды развертывания

Метод аутентификации `Имя пользователя / Пароль` является самым простым способом аутентификации
учетных данных разработки или развертывания в проекте dbt. Просто введите ваше имя пользователя Snowflake (конкретно, `login_name`) и соответствующий `пароль` пользователя Snowflake, чтобы аутентифицировать dbt Cloud для выполнения запросов в Snowflake от имени пользователя Snowflake.

**Примечание**: Поле схемы в разделе **Учетные данные разработчика** является обязательным.
<Lightbox src="/img/docs/dbt-cloud/snowflake-userpass-auth.png" width="70%" title="Аутентификация Snowflake по имени пользователя/паролю"/>

### Snowflake MFA

**Предварительные условия:**
- Среда разработки в проекте dbt Cloud
- Приложение аутентификации Duo
- Административный доступ к Snowflake (если настройки MFA еще не применены к учетной записи)
- [Административный (запись) доступ](/docs/cloud/manage-access/seats-and-users) к средам dbt Cloud

dbt Cloud поддерживает [многофакторную аутентификацию (MFA)](https://docs.snowflake.com/en/user-guide/security-mfa) Snowflake как еще один вариант имени пользователя и пароля для повышения безопасности входа. Поддержка MFA в Snowflake осуществляется с помощью сервиса Duo Security.

- В dbt Cloud установите следующий [расширенный атрибут](/docs/dbt-cloud-environments#extended-attributes) на странице **Общие настройки** среды разработки в разделе **Расширенные атрибуты**:

   ```yaml
  authenticator: username_password_mfa
   ```

- Чтобы уменьшить количество запросов к пользователю при подключении к Snowflake с MFA, [включите кэширование токенов](https://docs.snowflake.com/en/user-guide/security-mfa#using-mfa-token-caching-to-minimize-the-number-of-prompts-during-authentication-optional) в Snowflake.
- При необходимости, если пользователи пропускают запросы и их учетные записи Snowflake блокируются, вы можете предотвратить автоматические повторные попытки, добавив следующее в тот же раздел **Расширенные атрибуты**:

  ```yaml
  connect_retries: 0
  ```

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/extended-attributes-mfa.jpg" width="70%" title="Настройка имени пользователя и пароля MFA, а также connect_retries в настройках среды разработки." />

### Ключевая пара

**Доступно в:** Среды разработки, Среды развертывания

Метод аутентификации `Keypair` использует [аутентификацию с помощью ключевой пары](https://docs.snowflake.com/en/user-guide/key-pair-auth) Snowflake для аутентификации учетных данных разработки или развертывания для проекта dbt Cloud.

1. После [генерации зашифрованной ключевой пары](https://docs.snowflake.com/en/user-guide/key-pair-auth.html#configuring-key-pair-authentication) обязательно установите `rsa_public_key` для пользователя Snowflake для аутентификации в dbt Cloud:

   ```sql
   alter user jsmith set rsa_public_key='MIIBIjANBgkqh...';   
   ```

2. Наконец, установите поля **Private Key** и **Private Key Passphrase** на странице **Credentials**, чтобы завершить настройку dbt Cloud для аутентификации с Snowflake с использованием ключевой пары.
   - **Примечание:** Разрешены незашифрованные закрытые ключи. Используйте пароль только при необходимости. Начиная с [версии dbt 1.7](/docs/dbt-versions/core-upgrade/upgrading-to-v1.7), dbt ввел возможность указывать `private_key` непосредственно в виде строки вместо `private_key_path`. Эта строка `private_key` может быть в формате DER, закодированном в Base64, представляющем байты ключа, или в формате PEM в виде обычного текста. Обратитесь к [документации Snowflake](https://docs.snowflake.com/en/user-guide/key-pair-auth) для получения дополнительной информации о том, как они генерируют ключ.

3. Чтобы успешно заполнить поле Private Key, _необходимо_ включить закомментированные строки. Если вы получаете ошибку `Could not deserialize key data` или `JWT token`, обратитесь к разделу [Устранение неполадок](#troubleshooting) для получения дополнительной информации.

**Пример:**

```sql
-----BEGIN ENCRYPTED PRIVATE KEY-----
< encrypted private key contents here - line 1 >
< encrypted private key contents here - line 2 >
< ... >
-----END ENCRYPTED PRIVATE KEY-----
```

   <Lightbox src="/img/docs/dbt-cloud/snowflake-keypair-auth.png" width="60%" title="Аутентификация Snowflake с помощью ключевой пары"/>

### Snowflake OAuth

**Доступно в:** Среды разработки, только корпоративные планы

Метод аутентификации OAuth позволяет dbt Cloud выполнять запросы на разработку от имени
пользователя Snowflake без настройки пароля Snowflake в dbt Cloud.

Для получения дополнительной информации о настройке подключения Snowflake OAuth в dbt Cloud, пожалуйста, ознакомьтесь с [документацией по настройке Snowflake OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth).
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/database-connection-snowflake-oauth.png" width="55%" title="Настройка подключения Snowflake OAuth"/>

## Конфигурация

Чтобы узнать, как оптимизировать производительность с помощью специфичных для платформы данных конфигураций в dbt Cloud, обратитесь к [конфигурации, специфичной для Snowflake](/reference/resource-configs/snowflake-configs).

### URL-адрес пользовательского домена

Чтобы подключиться к Snowflake через пользовательский домен (vanity URL) вместо локатора учетной записи, используйте [расширенные атрибуты](/docs/dbt-cloud-environments#extended-attributes) для настройки параметра `host` с пользовательским доменом:

```yaml
host: https://custom_domain_to_snowflake.com
```

Эта конфигурация может конфликтовать с Snowflake OAuth при использовании с PrivateLink. Если пользователи не могут достичь серверов аутентификации Snowflake с точки зрения сети, пожалуйста, [свяжитесь с поддержкой dbt](mailto:support@getdbt.com), чтобы найти обходной путь с этой архитектурой.

## Устранение неполадок

Если вы получаете ошибку `Could not deserialize key data` или `JWT token`, обратитесь к следующим причинам и решениям:

<DetailsToggle alt_header="Ошибка: `Could not deserialize key data`">

Возможная причина и решение ошибки "Could not deserialize key data" в dbt Cloud.
- Это может быть из-за ошибок, таких как неправильное копирование, отсутствие тире или пропуск закомментированных строк.

**Решение**:
- Вы можете скопировать ключ из его источника и вставить его в текстовый редактор, чтобы проверить его перед использованием в dbt Cloud.

</DetailsToggle>

<DetailsToggle alt_header="Ошибка: `JWT token`">

Возможная причина и решение ошибки "JWT token" в dbt Cloud.
- Это может быть временная проблема между Snowflake и dbt Cloud. При подключении к Snowflake dbt получает JWT-токен, действительный только 60 секунд. Если в течение этого времени нет ответа от Snowflake, вы можете увидеть ошибку `JWT token is invalid` в dbt Cloud.
- Публичный ключ был введен неправильно в Snowflake.

**Решения**
- dbt необходимо повторно подключиться к Snowflake.
- Подтвердите и введите публичный ключ Snowflake правильно. Кроме того, вы можете обратиться за помощью в Snowflake или ознакомиться с этой документацией Snowflake для получения дополнительной информации: [Key-Based Authentication Failed with JWT token is invalid Error](https://community.snowflake.com/s/article/Key-Based-Authentication-Failed-with-JWT-token-is-invalid-Error).

</DetailsToggle>