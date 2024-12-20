---
title: "Настройка OAuth для Databricks"
description: "Узнайте, как администраторы dbt Cloud могут использовать OAuth для Databricks для управления доступом в аккаунте dbt Cloud."
id: "set-up-databricks-oauth"
---

# Настройка OAuth для Databricks <Lifecycle status="enterprise" />

dbt Cloud поддерживает OAuth для разработчиков ([OAuth для партнерских решений](https://docs.databricks.com/en/integrations/manage-oauth.html)) с Databricks, предоставляя дополнительный уровень безопасности для пользователей dbt enterprise. Когда вы включаете OAuth для Databricks в проекте dbt Cloud, все разработчики dbt Cloud должны аутентифицироваться с помощью Databricks, чтобы использовать IDE dbt Cloud. Среды развертывания проекта по-прежнему будут использовать метод аутентификации Databricks, установленный на уровне среды.

Текущее ограничение:
- В текущей версии требуется перезапуск IDE каждый час (токены доступа истекают через 1 час - [обходной путь](https://docs.databricks.com/en/integrations/manage-oauth.html#override-the-default-token-lifetime-policy-for-dbt-core-power-bi-or-tableau-desktop))

### Настройка OAuth для Databricks (администратор Databricks)

Для начала вам нужно [добавить dbt как OAuth-приложение](https://docs.databricks.com/en/integrations/configure-oauth-dbt.html) в Databricks. Существует два способа настройки этого приложения (CLI или интерфейс Databricks). Вот как это можно сделать в интерфейсе Databricks:

1. Войдите в [консоль аккаунта](https://accounts.cloud.databricks.com/?_ga=2.255771976.118201544.1712797799-1002575874.1704693634) и нажмите на значок **Settings** в боковой панели.

2. На вкладке **App connections** нажмите **Add connection**.

3. Введите следующие данные:
   - Имя для вашего подключения.
   - URL-адреса перенаправления для вашего OAuth-подключения, которые вы можете найти в таблице далее в этом разделе.
   - Для Access scopes, API, к которым приложение должно иметь доступ:
      - Для BI-приложений требуется SQL scope, чтобы подключенное приложение могло получить доступ к SQL API Databricks (это необходимо для SQL-моделей).
      - Для приложений, которым необходимо получить доступ к API Databricks для целей, отличных от выполнения запросов, требуется ALL APIs scope (это необходимо, если выполняются Python-модели).
   - Время жизни токена доступа (TTL) в минутах. По умолчанию: 60.
   - Время жизни токена обновления (TTL) в минутах. По умолчанию: 10080.
4. Выберите **Generate a client secret**. Скопируйте и надежно сохраните клиентский секрет. Клиентский секрет будет недоступен позже.

Вы можете использовать следующую таблицу для настройки URL-адресов перенаправления для вашего приложения с dbt Cloud:

| Регион | URL-адреса перенаправления |
| ------ | ----- |
| **US multi-tenant** | https://cloud.getdbt.com/callback <br /> https://cloud.getdbt.com/complete/databricks |
| **US cell 1** | https://us1.dbt.com/callback <br /> https://us1.dbt.com/complete/databricks |
| **EMEA** | https://emea.dbt.com/callback <br /> https://emea.dbt.com/complete/databricks |
| **APAC** | https://au.dbt.com/callback <br /> https://au.dbt.com/complete/databricks |
| **Single tenant** | https://INSTANCE_NAME.getdbt.com/callback <br /> https://INSTANCE_NAME.getdbt.com/complete/databricks

### Настройка подключения в dbt Cloud (администратор проекта dbt Cloud)

Теперь, когда у вас настроено OAuth-приложение в Databricks, вам нужно добавить идентификатор клиента и секрет в dbt Cloud. Для этого:
 - В dbt Cloud нажмите на имя вашего аккаунта в левом меню и выберите **Account settings**
 - Выберите **Projects** из меню
 - Выберите ваш проект из списка
 - Выберите **Connection**, чтобы отредактировать детали подключения
 - Добавьте `OAuth Client ID` и `OAuth Client Secret` из OAuth-приложения Databricks в разделе **Optional Settings**

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth.png" title="Добавление идентификатора клиента и секрета OAuth-приложения Databricks в dbt Cloud" />

### Аутентификация в Databricks (разработчик IDE dbt Cloud)

После того как подключение к Databricks через OAuth настроено для проекта dbt Cloud, каждому пользователю dbt Cloud необходимо будет аутентифицироваться с помощью Databricks, чтобы использовать IDE. Для этого:

- В dbt Cloud нажмите на имя вашего аккаунта в левом меню и выберите **Account settings**
- Выберите **Profile settings**.
- Выберите **Credentials**.
- Выберите ваш проект из списка
- Выберите `OAuth` в качестве метода аутентификации и нажмите **Save**
- Завершите, нажав кнопку **Connect Databricks Account**

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth-user.png" title="Подключение к Databricks из профиля пользователя IDE" />

Затем вы будете перенаправлены в Databricks и вам будет предложено одобрить подключение. Это перенаправит вас обратно в dbt Cloud. Теперь вы должны быть аутентифицированным пользователем Databricks, готовым к использованию IDE dbt Cloud.