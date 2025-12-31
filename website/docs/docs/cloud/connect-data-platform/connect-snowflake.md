---
title: "Подключение Snowflake"
id: connect-snowflake
description: "Настройка подключения Snowflake."
sidebar_label: "Подключение Snowflake"
---

:::note

Подключения и учетные данные <Constant name="cloud" /> наследуют разрешения настроенных учетных записей. Вы можете настраивать роли и связанные с ними разрешения в Snowflake в соответствии с требованиями вашей компании и более точно управлять доступом к объектам базы данных в вашей учетной записи.

Обратитесь к [Разрешениям Snowflake](/reference/database-permissions/snowflake-permissions) для получения дополнительной информации о настройке ролей в Snowflake.

:::

Следующие поля обязательны при создании подключения Snowflake

| Поле | Описание | Примеры |
| ----- | ----------- | -------- |
| Account | Учетная запись Snowflake для подключения. Посмотрите [здесь](/docs/core/connect-data-platform/snowflake-setup#account), чтобы определить, как должно выглядеть поле учетной записи в зависимости от вашего региона.| <Snippet path="snowflake-acct-name" /> |
| Role | Обязательное поле, указывающее, какую роль следует принять после подключения к Snowflake | `transformer` |
| Database | Логическая база данных для подключения и выполнения запросов. | `analytics` |
| Warehouse | Виртуальный склад для использования при выполнении запросов. | `transforming` |

## Методы аутентификации {#authentication-methods}

В этом разделе описываются различные методы аутентификации для подключения <Constant name="cloud" /> к Snowflake. Учетные данные для сред развертывания (Production, Staging, General) настраиваются глобально в разделе [**Connections**](/docs/deploy/deploy-environments#deployment-connection) в **Account settings**. Отдельные пользователи настраивают свои учетные данные для разработки в разделе [**Credentials**](/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-cloud-ide) своего профиля пользователя.

### Имя пользователя и пароль с MFA {#username-and-password-with-mfa}

:::info Snowflake authentication

Начиная с ноября 2025 года Snowflake начнет поэтапно отключать однофакторную аутентификацию по паролю, и будет принудительно включена многофакторная аутентификация (MFA).

MFA будет обязательной для всей аутентификации типа `Username / Password`.

Чтобы продолжить использование аутентификации по ключевой паре, пользователям необходимо обновить все среды развертывания, которые в настоящее время используют `Username / Password`, до ноября 2025 года.

Для получения дополнительной информации см. [публикацию в блоге Snowflake](https://www.snowflake.com/en/blog/blocking-single-factor-password-authentification/).

:::

:::info Доступность плана Snowflake MFA

MFA в Snowflake доступна для всех [типов планов](https://www.getdbt.com/pricing).

:::

**Доступно в:** средах разработки

Метод аутентификации `Username / Password` — это самый простой способ аутентифицировать
учетные данные разработки в dbt-проекте. Достаточно ввести имя пользователя Snowflake
(а именно `login_name`) и соответствующий `password` этого пользователя Snowflake,
чтобы аутентифицировать <Constant name="cloud" /> для выполнения запросов к Snowflake от имени пользователя Snowflake.

Аутентификация `Username / Password` не поддерживается для учетных данных сред развертывания, так как требуется MFA. В средах развертывания вместо этого используйте аутентификацию по [keypair](/docs/cloud/connect-data-platform/connect-snowflake#key-pair).

**Примечание**: Поле *Schema** в разделе **Developer Credentials** является обязательным.
<Lightbox src="/img/docs/dbt-cloud/snowflake-userpass-auth.png" width="70%" title="Snowflake username/password authentication"/>

**Предварительные требования:**
- Среда разработки в проекте <Constant name="cloud" />
- Приложение аутентификации Duo
- Административный доступ к Snowflake (если настройки MFA еще не были применены к аккаунту)
- [Администраторский (write) доступ](/docs/cloud/manage-access/seats-and-users) к средам <Constant name="cloud" />

[MFA](https://docs.snowflake.com/en/user-guide/security-mfa) требуется Snowflake для всех входов с использованием `Username / Password`. Поддержка MFA в Snowflake реализована с помощью сервиса Duo Security.

- В <Constant name="cloud" /> задайте следующий [extended attribute](/docs/dbt-cloud-environments#extended-attributes) в среде разработки на странице **General settings**, в разделе **Extended attributes**:

   ```yaml
  authenticator: username_password_mfa
   ```

- Чтобы уменьшить количество запросов к пользователю при подключении к Snowflake с MFA, [включите кэширование токенов](https://docs.snowflake.com/en/user-guide/security-mfa#using-mfa-token-caching-to-minimize-the-number-of-prompts-during-authentication-optional) в Snowflake.
- При необходимости, если пользователи пропускают запросы и их учетные записи Snowflake блокируются, вы можете предотвратить автоматические повторные попытки, добавив следующее в тот же раздел **Расширенные атрибуты**:

  ```yaml
  connect_retries: 0
  ```

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/extended-attributes-mfa.png" width="70%" title="Настройте имя пользователя и пароль MFA, а также connect_retries в настройках среды разработки." />

### Ключевая пара {#key-pair}

**Доступно в:** Development environments, Deployment environments

Метод аутентификации `Keypair` использует [аутентификацию по паре ключей Snowflake](https://docs.snowflake.com/en/user-guide/key-pair-auth) для аутентификации учетных данных Development или Deployment в проекте <Constant name="cloud" />.

1. После [генерации зашифрованной пары ключей](https://docs.snowflake.com/en/user-guide/key-pair-auth.html#configuring-key-pair-authentication) обязательно задайте `rsa_public_key` для пользователя Snowflake, под которым будет выполняться аутентификация в <Constant name="cloud" />:

   ```sql
   alter user jsmith set rsa_public_key='MIIBIjANBgkqh...';   
   ```

2. Наконец, задайте поля **Private Key** и **Private Key Passphrase** на странице **Credentials**, чтобы завершить настройку аутентификации <Constant name="cloud" /> в Snowflake с использованием ключевой пары.
   - **Примечание:** Незашифрованные приватные ключи допускаются. Используйте passphrase только при необходимости. dbt может указывать `private_key` напрямую как строку вместо `private_key_path`. Эта строка `private_key` может быть либо в формате DER, закодированном в Base64 (представляющем байты ключа), либо в виде обычного текстового PEM‑формата. Подробнее о том, как Snowflake генерирует ключи, см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/key-pair-auth).
   - Указание приватного ключа с помощью [переменной окружения](/docs/build/environment-variables) (например, `{{ env_var('DBT_PRIVATE_KEY') }}`) не поддерживается.

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

### Snowflake OAuth {#snowflake-oauth}

**Доступно в:** средах разработки, только тарифы уровня Enterprise

Метод аутентификации OAuth позволяет <Constant name="cloud" /> выполнять запросы для разработки от имени пользователя Snowflake без необходимости настраивать пароль Snowflake в <Constant name="cloud" />.

Дополнительные сведения о настройке подключения Snowflake OAuth в <Constant name="cloud" /> см. в [документации по настройке Snowflake OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth).
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/database-connection-snowflake-oauth.png" width="55%" title="Настройка подключения Snowflake OAuth"/>

## Конфигурация {#configuration}

Чтобы узнать, как оптимизировать производительность с помощью конфигураций, специфичных для конкретной платформы данных, в <Constant name="cloud" />, см. [Snowflake-specific configuration](/reference/resource-configs/snowflake-configs).

### URL-адрес пользовательского домена {#custom-domain-url}

Чтобы подключиться к Snowflake через пользовательский домен (vanity URL) вместо локатора учетной записи, используйте [расширенные атрибуты](/docs/dbt-cloud-environments#extended-attributes) для настройки параметра `host` с пользовательским доменом:

```yaml
host: https://custom_domain_to_snowflake.com
```

Эта конфигурация может конфликтовать с Snowflake OAuth при использовании с PrivateLink. Если пользователи не могут достичь серверов аутентификации Snowflake с точки зрения сети, пожалуйста, [свяжитесь с поддержкой dbt](mailto:support@getdbt.com), чтобы найти обходной путь с этой архитектурой.

## Устранение неполадок {#troubleshooting}

Если вы получаете ошибку `Could not deserialize key data` или `JWT token`, обратитесь к следующим причинам и решениям:

<DetailsToggle alt_header="Ошибка: `Could not deserialize key data`">

Возможная причина и решение ошибки **«Could not deserialize key data»** в `<Constant name="cloud" />`.

- Это может происходить из‑за ошибок при копировании ключа: некорректное копирование, отсутствие дефисов или пропуск закомментированных строк.

**Решение**:
- Вы можете скопировать ключ из исходного источника и вставить его в текстовый редактор, чтобы проверить корректность, прежде чем использовать его в `<Constant name="cloud" />`.

</DetailsToggle>

<DetailsToggle alt_header="Ошибка: `JWT token`">

Возможные причины и решения ошибки `JWT token` в <Constant name="cloud" />.

- Это может быть временная проблема взаимодействия между Snowflake и <Constant name="cloud" />. При подключении к Snowflake dbt получает JWT‑токен, который действителен только 60 секунд. Если в течение этого времени от Snowflake не поступает ответ, в <Constant name="cloud" /> может появиться ошибка `JWT token is invalid`.
- Публичный ключ был некорректно указан в Snowflake.

**Решения**
- dbt необходимо повторно подключиться к Snowflake.
- Подтвердите и введите публичный ключ Snowflake правильно. Кроме того, вы можете обратиться за помощью в Snowflake или ознакомиться с этой документацией Snowflake для получения дополнительной информации: [Key-Based Authentication Failed with JWT token is invalid Error](https://community.snowflake.com/s/article/Key-Based-Authentication-Failed-with-JWT-token-is-invalid-Error).

</DetailsToggle>
