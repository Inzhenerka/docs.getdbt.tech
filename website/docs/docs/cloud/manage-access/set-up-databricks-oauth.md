---
title: "Настройка Databricks OAuth"
description: "Узнайте, как администраторы dbt могут использовать Databricks OAuth для управления доступом в аккаунте dbt."
id: "set-up-databricks-oauth"
---

# Настройка Databricks OAuth <Lifecycle status="managed, managed_plus" />

<Constant name="cloud" /> поддерживает developer OAuth ([OAuth for partner solutions](https://docs.databricks.com/en/integrations/manage-oauth.html)) с Databricks, предоставляя дополнительный уровень безопасности для пользователей dbt Enterprise. Когда вы включаете Databricks OAuth для проекта <Constant name="cloud" />, все разработчики <Constant name="cloud" /> должны проходить аутентификацию через Databricks, чтобы использовать <Constant name="cloud_ide" />. При этом среды развертывания проекта продолжат использовать метод аутентификации Databricks, заданный на уровне окружения.

Текущее ограничение:
- В текущей версии требуется перезапуск IDE каждый час (токены доступа истекают через 1 час - [обходной путь](https://docs.databricks.com/en/integrations/manage-oauth.html#override-the-default-token-lifetime-policy-for-dbt-core-power-bi-or-tableau-desktop))

Текущее ограничение:
- Текущий пользовательский опыт требует перезапуска <Constant name="cloud_ide" /> каждый час (токены доступа истекают через 1 час — [обходное решение](https://docs.databricks.com/en/integrations/manage-oauth.html#override-the-default-token-lifetime-policy-for-dbt-core-power-bi-or-tableau-desktop))

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

Вы можете использовать следующую таблицу, чтобы настроить redirect URL для вашего приложения с <Constant name="cloud" />:

| Регион | Redirect URL |
| ------ | ----- |
| **US multi-tenant** | https://cloud.getdbt.com/callback <br /> https://cloud.getdbt.com/complete/databricks |
| **US cell 1** | https://us1.dbt.com/callback <br /> https://us1.dbt.com/complete/databricks |
| **EMEA** | https://emea.dbt.com/callback <br /> https://emea.dbt.com/complete/databricks |
| **APAC** | https://au.dbt.com/callback <br /> https://au.dbt.com/complete/databricks |
| **Single tenant** | https://INSTANCE_NAME.getdbt.com/callback <br /> https://INSTANCE_NAME.getdbt.com/complete/databricks

### Настройка подключения в dbt Cloud (администратор проекта dbt Cloud)

### Настройка подключения в dbt (администратор проекта dbt)

После того как вы настроили OAuth‑приложение в Databricks, необходимо добавить client ID и client secret в <Constant name="cloud" />. Для этого выполните следующие шаги:

1. В <Constant name="cloud" /> нажмите на имя своей учетной записи в левом боковом меню и выберите **Account settings**.
2. В меню выберите **Projects**.
3. Выберите нужный проект из списка.
4. Нажмите **Connections** и выберите подключение Databricks.
5. Нажмите **Edit**.
6. В разделе **Optional settings** добавьте значения `OAuth Client ID` и `OAuth Client Secret` из OAuth‑приложения Databricks.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth.png" title="Adding Databricks OAuth application client ID and secret to dbt" />

### Аутентификация в Databricks (разработчик в Studio IDE)

После того как подключение к Databricks через OAuth настроено для проекта <Constant name="cloud" />, каждому пользователю <Constant name="cloud" /> необходимо пройти аутентификацию в Databricks, чтобы использовать <Constant name="cloud_ide" />. Для этого:

1. В <Constant name="cloud" /> нажмите на имя своей учетной записи в левом боковом меню и выберите **Account settings**.
2. В разделе **Your profile** выберите **Credentials**.
3. Выберите свой проект из списка и нажмите **Edit**.
4. Выберите `OAuth` в качестве метода аутентификации и нажмите **Save**.
5. Завершите процесс, нажав кнопку **Connect Databricks Account**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth-user.png" title="Connecting to Databricks from an IDE user profile" />

После этого вы будете перенаправлены в Databricks, где потребуется подтвердить подключение. Затем произойдет возврат обратно в <Constant name="cloud" />. После этого вы будете аутентифицированным пользователем Databricks и сможете работать в <Constant name="cloud_ide" />.
