---
title: "Настройка Databricks OAuth"
description: "Узнайте, как администраторы dbt Cloud могут использовать Databricks OAuth для управления доступом в учетной записи dbt Cloud."
id: "set-up-databricks-oauth"
---

# Настройка Databricks OAuth <Lifecycle status="enterprise" />

dbt Cloud поддерживает OAuth для разработчиков ([OAuth для партнерских решений](https://docs.databricks.com/en/integrations/manage-oauth.html)) с Databricks, предоставляя дополнительный уровень безопасности для пользователей dbt enterprise. Когда вы включаете Databricks OAuth для проекта dbt Cloud, все разработчики dbt Cloud должны пройти аутентификацию в Databricks, чтобы использовать IDE dbt Cloud. Среды развертывания проекта по-прежнему будут использовать метод аутентификации Databricks, установленный на уровне среды.

Текущие ограничения:
- Текущий опыт требует перезапуска IDE каждый час (токены доступа истекают через 1 час - [обходное решение](https://docs.databricks.com/en/integrations/manage-oauth.html#override-the-default-token-lifetime-policy-for-dbt-core-power-bi-or-tableau-desktop))

### Настройка Databricks OAuth (администратор Databricks)

Чтобы начать, вам нужно [добавить dbt как OAuth-приложение](https://docs.databricks.com/en/integrations/configure-oauth-dbt.html) в Databricks. Существует два способа настройки этого приложения (CLI или интерфейс Databricks). Вот как вы можете это сделать в интерфейсе Databricks:

1. Войдите в [консоль учетной записи](https://accounts.cloud.databricks.com/?_ga=2.255771976.118201544.1712797799-1002575874.1704693634) и нажмите на значок **Настройки** в боковом меню.

2. На вкладке **Подключения приложений** нажмите **Добавить подключение**.

3. Введите следующие данные:
   - Имя для вашего подключения.
   - URL-адреса перенаправления для вашего OAuth-подключения, которые вы можете найти в таблице ниже в этом разделе.
   - Для областей доступа, API, к которым приложение должно иметь доступ:
      - Для BI-приложений требуется область SQL, чтобы подключенное приложение могло получить доступ к API Databricks SQL (это необходимо для SQL-моделей).
      - Для приложений, которым необходимо получить доступ к API Databricks для целей, отличных от запросов, требуется область ALL APIs (это необходимо, если вы запускаете Python-модели).
   - Время жизни токена доступа (TTL) в минутах. По умолчанию: 60.
   - Время жизни токена обновления (TTL) в минутах. По умолчанию: 10080.
4. Выберите **Сгенерировать секрет клиента**. Скопируйте и надежно сохраните секрет клиента. Секрет клиента не будет доступен позже.

Вы можете использовать следующую таблицу для настройки URL-адресов перенаправления для вашего приложения с dbt Cloud:

| Регион | URL-адреса перенаправления |
| ------ | ----- |
| **Многоарендный США** | https://cloud.getdbt.com/callback <br /> https://cloud.getdbt.com/complete/databricks |
| **США, ячейка 1** | https://us1.dbt.com/callback <br /> https://us1.dbt.com/complete/databricks |
| **EMEA** | https://emea.dbt.com/callback <br /> https://emea.dbt.com/complete/databricks |
| **APAC** | https://au.dbt.com/callback <br /> https://au.dbt.com/complete/databricks |
| **Одинарный арендатор** | https://INSTANCE_NAME.getdbt.com/callback <br /> https://INSTANCE_NAME.getdbt.com/complete/databricks |

### Настройка подключения в dbt Cloud (администратор проекта dbt Cloud)

Теперь, когда у вас есть настроенное OAuth-приложение в Databricks, вам нужно добавить идентификатор клиента и секрет в dbt Cloud. Для этого:
 - В dbt Cloud нажмите на имя вашей учетной записи в левом меню и выберите **Настройки учетной записи**.
 - Выберите **Проекты** в меню.
 - Выберите ваш проект из списка.
 - Выберите **Подключение**, чтобы отредактировать детали подключения.
 - Добавьте `OAuth Client ID` и `OAuth Client Secret` из OAuth-приложения Databricks в разделе **Дополнительные настройки**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth.png" title="Добавление идентификатора клиента и секрета приложения Databricks OAuth в dbt Cloud" />

### Аутентификация в Databricks (разработчик IDE dbt Cloud)

После того как подключение Databricks через OAuth настроено для проекта dbt Cloud, каждому пользователю dbt Cloud необходимо пройти аутентификацию в Databricks, чтобы использовать IDE. Для этого:

- В dbt Cloud нажмите на имя вашей учетной записи в левом меню и выберите **Настройки учетной записи**.
- Выберите **Настройки профиля**.
- Выберите **Учетные данные**.
- Выберите ваш проект из списка.
- Выберите `OAuth` в качестве метода аутентификации и нажмите **Сохранить**.
- Завершите, нажав кнопку **Подключить учетную запись Databricks**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth-user.png" title="Подключение к Databricks из профиля пользователя IDE" />

После этого вы будете перенаправлены в Databricks и попросите одобрить подключение. Это перенаправит вас обратно в dbt Cloud. Теперь вы должны быть аутентифицированным пользователем Databricks, готовым использовать IDE dbt Cloud.