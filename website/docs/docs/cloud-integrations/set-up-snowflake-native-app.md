---
title: "Настройка dbt Snowflake Native App"
description: "Узнайте, как настроить dbt Snowflake Native App"
pagination_prev: "docs/cloud-integrations/snowflake-native-app"
pagination_next: null
unlisted: true

---

# Настройка dbt Snowflake Native App <Lifecycle status='preview' />

[dbt Snowflake Native App](/docs/cloud-integrations/snowflake-native-app) включает следующие возможности непосредственно в интерфейсе Snowflake: <Constant name="explorer" />, чат-бот **Ask dbt**, а также функции наблюдаемости оркестрации из <Constant name="cloud" />.

Для настройки этой интеграции необходимо сконфигурировать как <Constant name="cloud" />, так и Snowflake. Общая последовательность шагов выглядит следующим образом:

1. Настроить конфигурацию **Ask dbt**.
1. Настроить Snowflake.
1. Настроить <Constant name="cloud" />.
1. Приобрести и установить dbt Snowflake Native App.
1. Настроить приложение.
1. Проверить успешную установку приложения.
1. Подключить новых пользователей к приложению.

Порядок шагов немного отличается, если вы приобрели публичный листинг Native App: в этом случае вы начинаете с покупки Native App, выполнения предварительных требований, а затем последовательно выполняете оставшиеся шаги.

## Предварительные требования
Ниже приведены предварительные требования для <Constant name="cloud" /> и Snowflake.

### dbt

- У вас должен быть аккаунт <Constant name="cloud" /> на тарифе уровня Enterprise, размещённый в регионе AWS или Azure. Если у вас его ещё нет, пожалуйста, [свяжитесь с нами](mailto:sales_snowflake_marketplace@dbtlabs.com), чтобы начать.
    - В настоящее время <Constant name="semantic_layer" /> недоступен для Azure ST-инстансов, и чат-бот **Ask dbt** не будет работать в dbt Snowflake Native App без него.
- У вашего аккаунта <Constant name="cloud" /> должны быть права на создание [service token](/docs/dbt-cloud-apis/service-tokens). Подробнее см. в разделе [Enterprise permissions](/docs/cloud/manage-access/enterprise-permissions).
- В <Constant name="cloud" /> должен существовать проект с [настроенным <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) и объявленными метриками.
- У вас должна быть настроена [production deployment environment](/docs/deploy/deploy-environments#set-as-production-environment).
    - В этом окружении должен быть как минимум один успешный запуск job, включающий шаг `docs generate`.

### Snowflake

- У вас есть доступ **ACCOUNTADMIN** в Snowflake.
- Ваш аккаунт Snowflake должен иметь доступ к интеграции Native App/SPCS и конфигурациям NA/SPCS (публичный превью планируется в конце июня). Если вы не уверены, уточните у вашего аккаунт-менеджера Snowflake.
- Аккаунт Snowflake должен находиться в регионе AWS. Azure в настоящее время не поддерживается для интеграции Native App/SPCS.
- У вас должен быть доступ к Snowflake Cortex через ваши права в Snowflake, и [Snowflake Cortex должен быть доступен в вашем регионе](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions#availability). Без этого Ask dbt работать не будет.

## Настройка конфигурации для Ask dbt

Настройте <Constant name="cloud" /> и Snowflake Cortex для работы чат-бота **Ask dbt**.

1. В <Constant name="cloud" /> перейдите к конфигурациям <Constant name="semantic_layer" />.

    1. В левой панели навигации нажмите на имя вашего аккаунта. Затем выберите **Account settings**.
    1. В левой боковой панели выберите **Projects** и выберите ваш dbt-проект из списка.
    1. В панели **Project details** нажмите ссылку **Edit <Constant name="semantic_layer" /> Configuration** (она находится ниже параметра **GraphQL URL**).

1. В панели **<Constant name="semantic_layer" /> Configuration Details** определите учётные данные Snowflake (которые будут использоваться для доступа к Snowflake Cortex), а также окружение, в котором выполняется <Constant name="semantic_layer" />. Сохраните имя пользователя, роль и окружение во временном месте — они понадобятся позже.

    <Lightbox src="/img/docs/cloud-integrations/semantic_layer_configuration.png" width="100%" title="Учетные данные Semantic Layer"/>

1. В Snowflake убедитесь, что пользователю SL и пользователю деплоя предоставлены права на использование Snowflake Cortex. Подробнее см. в разделе [Required Privileges](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions#required-privileges) документации Snowflake.

    По умолчанию все пользователи должны иметь доступ к Snowflake Cortex. Если у вас он отключён, откройте SQL worksheet в Snowflake и выполните следующие команды:

    ```sql
    create role cortex_user_role;
    grant database role SNOWFLAKE.CORTEX_USER to role cortex_user_role;
    grant role cortex_user_role to user SL_USER;
    grant role cortex_user_role to user DEPLOYMENT_USER;
    ```

    Обязательно замените `SNOWFLAKE.CORTEX_USER`, `DEPLOYMENT_USER` и `SL_USER` на соответствующие значения для вашей среды.

## Настройка dbt
Соберите следующую информацию из <Constant name="cloud" /> для настройки приложения.

1. В левой панели навигации нажмите на имя вашего аккаунта. Затем выберите **Account settings** и перейдите в **API tokens > Service tokens**. Создайте service token с доступом ко всем проектам, которые вы хотите использовать в dbt Snowflake Native App. Назначьте следующие наборы прав:
    - **Manage marketplace apps**
    - **Job Admin**
    - **Metadata Only**
    - **<Constant name="semantic_layer" /> Only**

    Обязательно сохраните данные токена во временном месте — они понадобятся позже при настройке Native App.

    Ниже приведён пример назначения наборов прав для всех проектов:

    <Lightbox src="/img/docs/cloud-integrations/example-snowflake-native-app-service-token.png" title="Пример service token для dbt Snowflake Native App"/>

1. В левой боковой панели выберите **Account** и сохраните следующую информацию во временном месте для последующей настройки Native App:
    - **Account ID** — числовая строка, представляющая ваш аккаунт <Constant name="cloud" />.
    - **Access URL** — если у вас мультиарендный аккаунт в Северной Америке, используйте `cloud.getdbt.com` в качестве access URL. Для всех остальных регионов см. раздел [Access, Regions, & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) и найдите нужный access URL в таблице.

## Установка dbt Snowflake Native App
1. Перейдите к листингу dbt Snowflake Native App:
    - **Private listing** (рекомендуется) — используйте ссылку из письма, отправленного вам.
    - **Public listing** — перейдите в [Snowflake Marketplace](https://app.snowflake.com/marketplace/listing/GZTYZSRT2R3).
1. Нажмите **Get** на странице листинга, чтобы установить dbt Snowflake Native App. Процесс может занять несколько минут. После завершения установки вам будет отправлено письмо.

    Появится сообщение с предложением изменить приложение и предоставить доступ к warehouse для установки. dbt Labs настоятельно рекомендует не изменять имя приложения, если в этом нет необходимости.
1. После успешной установки dbt Snowflake Native App нажмите **Configure** в модальном окне.

## Настройка dbt Snowflake Native App

1. На странице **Activate dbt** нажмите **Grant** в **Step 1: Grant Account Privileges**.
1. После успешного предоставления прав нажмите **Review** в **Step 2: Allow Connections**.

    Пройдите шаги **Connect to <Constant name="cloud" /> External Access Integration**. Вам понадобится информация об аккаунте <Constant name="cloud" />, которую вы собрали ранее. Введите Account ID, Access URL и API service token в качестве **Secret value**, когда будет предложено.
1. На странице **Activate dbt** нажмите **Activate**, когда соединение с <Constant name="cloud" /> External Access Integration будет успешно установлено. Запуск необходимых сервисов Snowflake и вычислительных ресурсов может занять несколько минут.
1. После завершения активации перейдите на вкладку **Telemetry** и включите отправку логов уровня `INFO`. Отображение этой опции может занять некоторое время, так как Snowflake должен создать таблицу событий для совместного использования.
1. После успешного включения опции нажмите **Launch app**, затем войдите в приложение, используя свои учётные данные Snowflake.

    Если вместо страницы входа происходит перенаправление в Snowsight worksheet, это означает, что установка приложения ещё не завершена. Обычно эту проблему можно решить, обновив страницу.

    Ниже приведён пример dbt Snowflake Native App после завершения настройки:

    <Lightbox src="/img/docs/cloud-integrations/example-dbt-snowflake-native-app.png" title="Пример dbt Snowflake Native App"/>

## Проверка успешной установки приложения

Чтобы убедиться, что приложение установлено корректно, выберите любой из следующих пунктов в боковом меню:

- **Explore** — запустите <Constant name="explorer" /> и убедитесь, что у вас есть доступ к информации о вашем dbt-проекте.
- **Jobs** — просмотрите историю запусков dbt job’ов.
- **Ask dbt** — нажмите на любой из предложенных запросов, чтобы задать вопрос чат-боту. В зависимости от количества метрик, определённых в dbt-проекте, первая загрузка **Ask dbt** может занять несколько минут, так как dbt строит Retrieval Augmented Generation (RAG). Последующие запуски будут происходить быстрее.

Ниже приведён пример чат-бота **Ask dbt** с предложенными запросами в верхней части:

<Lightbox src="/img/docs/cloud-integrations/example-ask-dbt-native-app.png" title="Пример чат-бота Ask dbt"/>

## Подключение новых пользователей
1. В боковом меню Snowflake выберите **Data Products > Apps**. Выберите **dbt** из списка, чтобы открыть страницу конфигурации приложения. Затем нажмите **Manage access** (в правом верхнем углу), чтобы подключить новых пользователей к приложению. Назначьте роль **APP_USER** тем ролям, которым нужен доступ к приложению без возможности редактировать конфигурации. Назначьте **APP_ADMIN** ролям, которые должны иметь возможность редактировать или удалять конфигурации.

1. Новые пользователи могут получить доступ к приложению либо по URL Snowflake app, который был им предоставлен, либо нажав **Launch app** на странице конфигурации приложения.

## FAQs

<Expandable alt_header="Не удаётся установить dbt Snowflake Native App из Snowflake Marketplace" >

<Constant name="cloud" /> Snowflake Native App недоступен для аккаунтов Snowflake Free Trial.

</Expandable>

<Expandable alt_header="Получено сообщение об ошибке `Unable to access schema dbt_sl_llm` в Ask dbt" >

Проверьте, что пользователю SL предоставлен доступ к схеме `dbt_sl_llm`, и убедитесь, что у него есть все необходимые права для чтения и записи в эту схему.

</Expandable>

<Expandable alt_header="Необходимо обновить параметры конфигурации dbt, используемые Native App" >

Если был обновлён Account ID, Access URL или API service token в <Constant name="cloud" />, необходимо обновить конфигурацию dbt Snowflake Native App. В Snowflake перейдите на страницу конфигурации приложения и удалите существующие настройки. Затем добавьте новую конфигурацию и выполните команду `CALL app_public.restart_app();` в базе данных приложения в Snowsight.

</Expandable>

<Expandable alt_header="Поддерживаются ли переменные окружения в Native App?" >

[Переменные окружения](/docs/build/environment-variables), такие как `{{env_var('DBT_WAREHOUSE') }}`, пока не поддерживаются в <Constant name="semantic_layer" />. Для использования функции **Ask dbt** необходимо указывать реальные учётные данные.

</Expandable>
