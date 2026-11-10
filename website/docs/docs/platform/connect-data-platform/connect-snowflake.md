---
title: "Подключение к Snowflake"
id: connect-snowflake
description: "Настройка подключения к Snowflake."
sidebar_label: "Подключение к Snowflake"
availability:
  surface: platform
  access: login_required
---

# Подключение к Snowflake <Lifecycle status="ga" /> <ProductCard text="Совместимо с dbt v2" />

import SnowflakeColumn from '/snippets/_snowflake-column-size.md';

<SnowflakeColumn />

Подключения и учётные данные в <Constant name="dbt_platform" /> наследуют права доступа настроенных учётных записей. Вы можете настроить роли и связанные с ними права доступа в Snowflake в соответствии с требованиями вашей компании и детально настроить доступ к объектам баз данных в вашей учётной записи.

Подробнее о настройке ролей в Snowflake см. в разделе [Права доступа в Snowflake](/reference/database-permissions/snowflake-permissions). Сведения о том, какие функции Snowflake поддерживаются в <Constant name="fusion"/> в режиме `strict`, см. в разделе [Поддержка функций Snowflake](/reference/resource-configs/snowflake-function-support).


## Права доступа к вычислительному складу для <Constant name="fusion" />

import FusionSnowflakeWarehousePerms from '/snippets/_v2-warehouse-permissions-snowflake.md';

<FusionSnowflakeWarehousePerms />

Примеры ролей в Snowflake см. в разделе [Права доступа в Snowflake](/reference/database-permissions/snowflake-permissions).

## Поля подключения

При создании подключения к Snowflake необходимо заполнить следующие поля:

| Поле | Описание | Примеры |
| ----- | ----------- | -------- |
| Account | Учётная запись Snowflake, к которой нужно подключиться. Посмотрите [здесь](/docs/local/connect-data-platform/snowflake-setup?version=1.12#account), как должно выглядеть значение поля Account в зависимости от вашего региона.| <Snippet path="snowflake-acct-name" /> |
| Role | Обязательное поле, указывающее роль, которую следует использовать после подключения к Snowflake | `transformer` |
| Database | Логическая база данных, к которой нужно подключиться и в которой будут выполняться запросы. | `analytics` |
| Warehouse | Виртуальный вычислительный склад, используемый для выполнения запросов. | `transforming` |

## Методы аутентификации

В этом разделе описаны различные методы аутентификации для подключения <Constant name="dbt" /> к Snowflake. Учётные данные сред развёртывания (Production, Staging, General) настраиваются глобально в разделе [**Connections**](/docs/deploy/deploy-environments#deployment-connection) настроек **Account settings**. Отдельные пользователи настраивают свои учётные данные в разделе [**Credentials**](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) своего профиля.

:::note Аутентификация Snowflake на платформе dbt

В <Constant name="dbt_platform" /> нельзя создавать новые учётные данные Snowflake с использованием имени пользователя и пароля. Для новых учётных данных разработки и развёртывания по умолчанию используется аутентификация с помощью [пары ключей](#key-pair). Для пользовательских учётных данных на тарифах уровня Enterprise также доступен [Snowflake OAuth](#snowflake-oauth), если он настроен для подключения. Чтобы обновить существующие учётные данные с паролем, см. раздел [Имя пользователя и пароль с MFA](#username-and-password-with-mfa).

:::

### Пара ключей {#key-pair}

**Доступно в:** средах разработки, средах развёртывания

Если вы впервые создаёте учётные данные Snowflake в <Constant name="dbt_platform" />, по умолчанию используется аутентификация с помощью пары ключей. Используйте её для учётных данных как разработки, так и развёртывания. Метод аутентификации `Keypair` использует [аутентификацию с помощью пары ключей](https://docs.snowflake.com/en/user-guide/key-pair-auth) Snowflake для проверки учётных данных разработки или развёртывания проекта <Constant name="dbt" />.

1. После [создания зашифрованной пары ключей](https://docs.snowflake.com/en/user-guide/key-pair-auth.html#configuring-key-pair-authentication) обязательно задайте `rsa_public_key` для пользователя Snowflake, который будет проходить аутентификацию в <Constant name="dbt" />:

   ```sql
   alter user jsmith set rsa_public_key='MIIBIjANBgkqh...';   
   ```

2. Затем заполните поля **Private Key** и **Private Key Passphrase** на странице **Credentials**, чтобы завершить настройку аутентификации <Constant name="dbt" /> в Snowflake с помощью пары ключей.
   - **Примечание:** допускается использование незашифрованных закрытых ключей. Используйте парольную фразу только при необходимости. В dbt можно указать `private_key` непосредственно в виде строки вместо `private_key_path`. Эта строка `private_key` может содержать ключ в формате DER с кодировкой Base64, представляющий байты ключа, или в текстовом формате PEM. Подробнее о создании ключей см. в [документации Snowflake](https://docs.snowflake.com/en/user-guide/key-pair-auth).
   - Указание закрытого ключа с помощью [переменной окружения](/docs/build/environment-variables) (например, `{{ env_var('DBT_PRIVATE_KEY') }}`) не поддерживается. 

3. Для правильного заполнения поля Private Key _обязательно_ включите строки-комментарии. Если вы получаете ошибку `Could not deserialize key data` или `JWT token`, подробнее см. в разделе [Устранение неполадок](#troubleshooting). 

**Пример:**

```sql
-----BEGIN ENCRYPTED PRIVATE KEY-----
< encrypted private key contents here - line 1 >
< encrypted private key contents here - line 2 >
< ... >
-----END ENCRYPTED PRIVATE KEY-----
```

   <Lightbox src="/img/docs/dbt-platform/snowflake-keypair-auth.png" width="60%" title="Аутентификация Snowflake с помощью пары ключей"/>

#### Пара ключей в dbt v2

import FusionKeyPair from '/snippets/_v2-key-pair.md';

<FusionKeyPair />

### Snowflake OAuth

**Доступно в:** средах разработки, только на тарифах уровня Enterprise

Метод аутентификации OAuth позволяет <Constant name="dbt" /> выполнять запросы в среде разработки от имени
пользователя Snowflake без настройки пароля Snowflake в <Constant name="dbt" />. 

Подробнее о настройке подключения Snowflake OAuth в <Constant name="dbt" /> см. в [документации по настройке Snowflake OAuth](/docs/platform/manage-access/set-up-snowflake-oauth).
<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/database-connection-snowflake-oauth.png" width="55%" title="Настройка подключения Snowflake OAuth"/>

:::note Переход с имени пользователя и пароля

Если ваши учётные данные по-прежнему используют имя пользователя и пароль, вы можете просмотреть существующую конфигурацию в разделе **Credentials**, профилях подключений или формах учётных данных развёртывания, но не сможете сохранить изменения, пока не переключите **Auth method** на пару ключей или OAuth. Если учётные данные с паролем всё ещё используются, в верхней части вашей учётной записи также может отображаться предупреждающий баннер.

Чтобы отказаться от использования имени пользователя и пароля, выполните действия из раздела [Пара ключей](#key-pair) или [Snowflake OAuth](#snowflake-oauth).

:::

### Имя пользователя и пароль с MFA {#username-and-password-with-mfa}

**Доступно для:** только существующих учётных данных разработки и развёртывания

Если при планировании перехода вы всё ещё используете имя пользователя и пароль, Snowflake требует [MFA](https://docs.snowflake.com/en/user-guide/security-mfa) для всех входов с паролем. Поддержка MFA в Snowflake обеспечивается сервисом Duo Security.

- В <Constant name="dbt" /> задайте следующий [расширенный атрибут](/docs/dbt-platform-environments#extended-attributes) на странице **General settings** среды разработки в разделе **Extended attributes**:

   ```yaml
  authenticator: username_password_mfa
   ```

- Чтобы уменьшить количество запросов подтверждения при подключении к Snowflake с MFA, [включите кэширование токенов](https://docs.snowflake.com/en/user-guide/security-mfa#using-mfa-token-caching-to-minimize-the-number-of-prompts-during-authentication-optional) в Snowflake.
- Если пользователи пропускают запросы подтверждения и их учётные записи Snowflake блокируются, при необходимости можно отключить автоматические повторные попытки, добавив следующую настройку в тот же раздел **Extended attributes**:

  ```yaml
  connect_retries: 0
  ```

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/extended-attributes-mfa.png" width="70%" title="Настройка имени пользователя и пароля с MFA, а также connect_retries в параметрах среды разработки." />

## Конфигурация

Сведения об оптимизации производительности с помощью настроек <Constant name="dbt" />, специфичных для платформы данных, см. в разделе [Конфигурация для Snowflake](/reference/resource-configs/snowflake-configs).

### URL с пользовательским доменом

Чтобы подключиться к Snowflake через пользовательский домен (vanity URL), а не через идентификатор учётной записи (account locator), используйте [расширенные атрибуты](/docs/dbt-platform-environments#extended-attributes), указав пользовательский домен в параметре `host`:

```yaml
host: https://custom_domain_to_snowflake.com
```

Эта конфигурация может конфликтовать со Snowflake OAuth при использовании PrivateLink. Если пользователи не могут получить доступ к серверам аутентификации Snowflake из-за сетевых ограничений, [обратитесь в службу поддержки dbt](mailto:support@getdbt.com), чтобы найти обходное решение для такой архитектуры.

## Устранение неполадок {#troubleshooting}
<!--возможно, потребуется преобразовать этот раздел в раскрывающийся блок, если появятся дополнительные пункты по устранению неполадок -->

Если вы получаете ошибку `Could not deserialize key data` или `JWT token`, ознакомьтесь со следующими причинами и решениями:

<DetailsToggle alt_header="Ошибка: `Could not deserialize key data`">

Возможная причина и решение ошибки «Could not deserialize key data» в <Constant name="dbt" />.
- Причиной могут быть ошибки при копировании, отсутствие дефисов или пропущенные строки-комментарии.

**Решение**:
- Скопируйте ключ из исходного источника и вставьте его в текстовый редактор, чтобы проверить перед использованием в <Constant name="dbt" />.

</DetailsToggle>

<DetailsToggle alt_header="Ошибка: `JWT token`">

Возможные причины и решения ошибки «JWT token» в <Constant name="dbt" />.
- Это может быть временная проблема взаимодействия между Snowflake и <Constant name="dbt" />. При подключении к Snowflake dbt получает JWT-токен, действительный только в течение 60 секунд. Если за это время Snowflake не ответит, в <Constant name="dbt" /> может появиться ошибка `JWT token is invalid`.
- Открытый ключ был некорректно указан в Snowflake.

**Решения**
- dbt необходимо повторить попытку подключения к Snowflake.
- Проверьте открытый ключ в Snowflake и введите его корректно. Кроме того, вы можете обратиться за помощью в Snowflake или ознакомиться с дополнительными сведениями в этой статье Snowflake: [Ошибка аутентификации по ключу с сообщением JWT token is invalid](https://community.snowflake.com/s/article/Key-Based-Authentication-Failed-with-JWT-token-is-invalid-Error).

</DetailsToggle>
