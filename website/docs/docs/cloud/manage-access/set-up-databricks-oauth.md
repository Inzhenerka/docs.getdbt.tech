---
title: "Настройка Databricks OAuth"
description: "Узнайте, как администраторы dbt могут использовать Databricks OAuth для управления доступом в аккаунте dbt."
id: "set-up-databricks-oauth"
---

# Настройка Databricks OAuth <Lifecycle status="managed, managed_plus" /> {#set-up-databricks-oauth}

<Constant name="cloud" /> поддерживает developer OAuth ([OAuth для партнерских решений](https://docs.databricks.com/en/integrations/manage-oauth.html)) с Databricks, предоставляя дополнительный уровень безопасности для пользователей dbt Enterprise. Когда вы включаете Databricks OAuth для проекта <Constant name="cloud" />, все разработчики <Constant name="cloud" /> должны проходить аутентификацию через Databricks, чтобы использовать <Constant name="cloud_ide" />. При этом среды деплоя проекта продолжают использовать метод аутентификации Databricks, настроенный на уровне окружения.

Текущее ограничение:
- В текущей реализации требуется перезапуск <Constant name="cloud_ide" /> каждый час (токены доступа истекают через 1 час — [обходное решение](https://docs.databricks.com/en/integrations/manage-oauth.html#override-the-default-token-lifetime-policy-for-dbt-core-power-bi-or-tableau-desktop))

### Настройка Databricks OAuth (администратор Databricks) {#configure-databricks-oauth-databricks-admin}

Для начала необходимо [добавить dbt как OAuth‑приложение](https://docs.databricks.com/en/integrations/configure-oauth-dbt.html) в Databricks. Существует два способа настройки этого приложения (через CLI или интерфейс Databricks UI). Ниже описано, как выполнить настройку через Databricks UI:

1. Войдите в [account console](https://accounts.cloud.databricks.com/?_ga=2.255771976.118201544.1712797799-1002575874.1704693634) и нажмите на иконку **Settings** в боковой панели.

2. На вкладке **App connections** нажмите **Add connection**.

3. Укажите следующие данные:
   - Имя для вашего подключения.
   - Redirect URL для OAuth‑подключения, которые приведены в таблице ниже в этом разделе.
   - В разделе Access scopes — API, к которым должно иметь доступ приложение:
      - Для BI‑приложений требуется scope SQL, чтобы подключенное приложение могло обращаться к Databricks SQL APIs (это необходимо для SQL‑моделей).
      - Для приложений, которым требуется доступ к Databricks APIs не только для выполнения запросов, необходим scope ALL APIs (это требуется при запуске Python‑моделей).
   - Время жизни access token (TTL) в минутах. Значение по умолчанию: 60.
   - Время жизни refresh token (TTL) в минутах. Значение по умолчанию: 10080.
4. Выберите **Generate a client secret**. Скопируйте и надежно сохраните client secret. Позже этот client secret будет недоступен.

Вы можете использовать следующую таблицу для настройки redirect URLs для вашего приложения с <Constant name="cloud" />:

| Регион | Redirect URLs |
| ------ | ----- |
| **US multi-tenant** | https://cloud.getdbt.com/callback <br /> https://cloud.getdbt.com/complete/databricks |
| **US cell 1** | https://us1.dbt.com/callback <br /> https://us1.dbt.com/complete/databricks |
| **EMEA** | https://emea.dbt.com/callback <br /> https://emea.dbt.com/complete/databricks |
| **APAC** | https://au.dbt.com/callback <br /> https://au.dbt.com/complete/databricks |
| **Single tenant** | https://INSTANCE_NAME.getdbt.com/callback <br /> https://INSTANCE_NAME.getdbt.com/complete/databricks |

### Настройка подключения в dbt (администратор проекта dbt) {#configure-the-connection-in-dbt-dbt-project-admin}

После того как OAuth‑приложение в Databricks настроено, необходимо добавить client ID и client secret в <Constant name="cloud" />. Для этого:

1. В <Constant name="cloud" /> нажмите на имя вашего аккаунта в левом меню и выберите **Account settings**.
2. В меню выберите **Projects**.
3. Выберите нужный проект из списка.
4. Нажмите **Connections** и выберите подключение Databricks.
5. Нажмите **Edit**.
6. В разделе **Optional settings** добавьте значения `OAuth Client ID` и `OAuth Client Secret` из OAuth‑приложения Databricks.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth.png" title="Добавление client ID и client secret OAuth‑приложения Databricks в dbt" />

### Аутентификация в Databricks (разработчик Studio IDE) {#authenticating-to-databricks-studio-ide-developer}

После настройки OAuth‑подключения Databricks для проекта <Constant name="cloud" /> каждому пользователю <Constant name="cloud" /> необходимо пройти аутентификацию в Databricks, чтобы использовать <Constant name="cloud_ide" />. Для этого:

1. В <Constant name="cloud" /> нажмите на имя вашего аккаунта в левом меню и выберите **Account settings**.
2. В разделе **Your profile** выберите **Credentials**.
3. Выберите нужный проект из списка и нажмите **Edit**.
4. Выберите `OAuth` в качестве метода аутентификации и нажмите **Save**.
5. Завершите процесс, нажав кнопку **Connect Databricks Account**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth-user.png" title="Подключение к Databricks из профиля пользователя IDE" />

После этого вы будете перенаправлены в Databricks, где потребуется подтвердить подключение. Затем произойдет возврат обратно в <Constant name="cloud" />. Теперь вы будете аутентифицированы как пользователь Databricks и сможете использовать <Constant name="cloud_ide" />.
