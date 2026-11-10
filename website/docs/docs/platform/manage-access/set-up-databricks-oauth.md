---
title: "Настройка Databricks OAuth"
description: "Узнайте, как администраторы и пользователи dbt могут использовать Databricks OAuth для управления доступом в аккаунте dbt."
id: "set-up-databricks-oauth"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Настройка Databricks OAuth

Аккаунты <Constant name="dbt_platform" /> на тарифных планах Enterprise и Enterprise+ поддерживают OAuth для разработчиков ([OAuth для партнёрских решений](https://docs.databricks.com/en/integrations/manage-oauth.html)) при работе с Databricks. При включении Databricks OAuth для проекта <Constant name="dbt" /> все разработчики должны проходить аутентификацию в Databricks, чтобы использовать <Constant name="studio_ide" />.

### Аутентификация для разработки и развёртывания

Databricks OAuth использует аутентификацию user-to-machine (U2M, «пользователь — машина») для интерактивной разработки в <Constant name="studio_ide" />. Она применяется только к учётным данным для разработки.

Среды развёртывания используют отдельные учётные данные, настроенные на уровне среды. Они не используют OAuth для разработчиков. Для развёртывания и пакетных заданий настройте учётные данные на основе токенов в [профиле подключения для развёртывания](/docs/platform/about-profiles). Для заданий как в производственных, так и в непроизводственных средах рекомендуется использовать токен [субъекта-службы (service principal)](https://docs.databricks.com/en/admin/users-groups/service-principals.html).

Инструкции по настройке приведены в разделе [Определение среды развёртывания dbt](/guides/set-up-your-databricks-dbt-project#defining-your-dbt-deployment-environment). Дополнительные сведения о средах развёртывания см. в разделе [Среды развёртывания](/docs/deploy/deploy-environments).

### Настройка Databricks OAuth (администратор Databricks)

Для начала добавьте dbt в Databricks в качестве пользовательского OAuth-приложения.

Следующие шаги выполняются в интерфейсе Databricks. В качестве альтернативы используйте [Databricks CLI](https://docs.databricks.com/en/integrations/enable-disable-oauth.html#enable-custom-oauth-applications-using-the-cli). При любом из способов используйте [URL перенаправления для вашего региона](#redirect-urls-by-region).

1. Войдите в [консоль аккаунта](https://accounts.cloud.databricks.com/?_ga=2.255771976.118201544.1712797799-1002575874.1704693634) и нажмите значок **Settings** на боковой панели.

2. На вкладке **App connections** нажмите **Add connection**.

3. Укажите следующие сведения:
   - Название подключения.
   - URL перенаправления для OAuth-подключения. Используйте оба URL, указанных для региона вашего аккаунта.
   - В поле Access scopes укажите API, к которым приложение должно иметь доступ:
      - Для BI-приложений требуется область доступа SQL, позволяющая подключённому приложению обращаться к Databricks SQL API (это необходимо для SQL-моделей).
      - Для приложений, которым нужен доступ к Databricks API не только для выполнения запросов, требуется область доступа ALL APIs (это необходимо при запуске Python-моделей).
   - Время жизни (TTL) токена доступа в минутах. Значение по умолчанию: 60.
   - Время жизни (TTL) токена обновления в минутах. Значение по умолчанию: 10080.
4. Выберите **Generate a client secret**. Скопируйте секрет клиента и сохраните его в безопасном месте. Позже он будет недоступен.

#### URL перенаправления по регионам \{#redirect-urls-by-region}

При настройке Databricks OAuth используйте URL перенаправления, соответствующие региону вашего аккаунта dbt.

<!-- we'll want to remove this callout sometime in 2027 -->
:::info
В рамках перехода на URL, уникальные для каждого аккаунта, некоторым клиентам следует обновить URL перенаправления OAuth и другие настройки интеграций. Прежние региональные URL продолжают поддерживать интеграции до даты окончания поддержки, указанной в [графике перехода](/docs/platform/about-platform/account-url-migration#migration-timeline). Дополнительные сведения о сроках перехода и рекомендации по URL, уникальным для каждого аккаунта, см. в [документации по переходу на новые URL аккаунтов](/docs/platform/about-platform/account-url-migration).
:::

<SimpleTable>

| Регион | URL перенаправления |
| ------ | ----- |
| **США, мультитенантная среда** | https://cloud.getdbt.com/callback <br /> https://cloud.getdbt.com/complete/databricks |
| **США, ячейка 1** | https://us1.dbt.com/callback <br /> https://us1.dbt.com/complete/databricks |
| **EMEA** | https://emea.dbt.com/callback <br /> https://emea.dbt.com/complete/databricks |
| **APAC** | https://au.dbt.com/callback <br /> https://au.dbt.com/complete/databricks |
| **Однотенантная среда** | https://INSTANCE_NAME.getdbt.com/callback <br /> https://INSTANCE_NAME.getdbt.com/complete/databricks

</SimpleTable>

### Настройка подключения в dbt (администратор проекта dbt)

Теперь, когда OAuth-приложение в Databricks настроено, необходимо добавить идентификатор и секрет клиента в <Constant name="dbt" />. Для этого:

1. В <Constant name="dbt" /> нажмите название своего аккаунта в меню слева и выберите **Account settings**.
2. Выберите **Projects** в меню.
3. Выберите свой проект из списка.
4. Нажмите **Connections** и выберите подключение Databricks.
5. Нажмите **Edit**.
6. В разделе **Optional settings** добавьте **OAuth Client ID** и **OAuth Client Secret** из OAuth-приложения Databricks.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dbt-platform-enterprise/DBX-auth/dbt-databricks-oauth.png" title="Добавление учётных данных Databricks OAuth в подключение" />

### Аутентификация в Databricks (разработчик в Studio IDE)

После настройки подключения Databricks OAuth для проекта <Constant name="dbt" /> каждому пользователю <Constant name="dbt" /> потребуется пройти аутентификацию в Databricks, чтобы использовать <Constant name="studio_ide" />. Для этого:

1. В <Constant name="dbt" /> нажмите название своего аккаунта в меню слева и выберите **Account settings**.
2. В разделе **Your profile** выберите **Credentials**.
3. Выберите свой проект из списка и нажмите **Edit**.
4. Выберите **OAuth** в качестве метода аутентификации и нажмите **Save**.
5. В завершение нажмите кнопку **Connect Databricks Account**.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dbt-platform-enterprise/DBX-auth/dbt-databricks-oauth-user.png" title="Подключение аккаунта Databricks в настройках учётных данных для разработки" />

После этого вы будете перенаправлены в Databricks, где вам предложат подтвердить подключение. Затем вы вернётесь в <Constant name="dbt" />. Теперь вы должны быть аутентифицированы в Databricks и готовы к работе в <Constant name="studio_ide" />.

### Процесс OAuth в Studio

После того как пользователь разрешит приложению <Constant name="dbt" /> доступ к Databricks, Databricks передаст приложению <Constant name="dbt" /> токен обновления.

В начале каждого сеанса <Constant name="studio_ide" /> приложение <Constant name="dbt" /> обменивает токен обновления на токен доступа, который используется для подключения к Databricks и выполнения запросов от имени пользователя. <Constant name="dbt" /> не получает новые токены доступа во время активного сеанса. Когда срок действия токена доступа истекает (по умолчанию — через 60 минут), пользователь должен перезапустить <Constant name="studio_ide" />, чтобы продолжить разработку.

Срок действия токена обновления задаётся при настройке OAuth-приложения в Databricks (TTL токена обновления по умолчанию: 10080 минут). Когда срок действия токена обновления пользователя истечёт, ему потребуется снова нажать **Connect Databricks Account**, чтобы повторно пройти аутентификацию.
