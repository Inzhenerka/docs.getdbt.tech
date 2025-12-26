---
title: "Настройка dbt Snowflake Native App"
description: "Узнайте, как настроить dbt Snowflake Native App"
pagination_prev: "docs/cloud-integrations/snowflake-native-app"
pagination_next: null
unlisted: true

---

# Настройка dbt Snowflake Native App <Lifecycle status='preview' />

[dbt Snowflake Native App](/docs/cloud-integrations/snowflake-native-app) включает следующие возможности прямо в пользовательском интерфейсе Snowflake: <Constant name="explorer" />, чат-бот **Ask dbt**, а также функции наблюдаемости оркестрации от <Constant name="cloud" />.

Чтобы настроить эту интеграцию, необходимо сконфигурировать как <Constant name="cloud" />, так и Snowflake. Общие шаги настройки выглядят следующим образом:

1. Настройте конфигурацию **Ask dbt**.
1. Настройте Snowflake.
1. Настройте <Constant name="cloud" />.
1. Приобретите и установите dbt Snowflake Native App.
1. Настройте приложение.
1. Убедитесь, что приложение успешно установлено.
1. Подключите новых пользователей к приложению.

Порядок шагов немного отличается, если вы приобрели публичный листинг Native App; начните с покупки Native App, выполнения предварительных условий, а затем выполните оставшиеся шаги по порядку.

## Предварительные требования
Ниже перечислены предварительные требования для <Constant name="cloud" /> и Snowflake.

### dbt

- У вас должна быть учетная запись <Constant name="cloud" /> на тарифном плане уровня Enterprise, размещенная в регионе AWS или Azure. Если у вас ее еще нет, пожалуйста, [свяжитесь с нами](mailto:sales_snowflake_marketplace@dbtlabs.com), чтобы начать работу.
    - В настоящее время <Constant name="semantic_layer" /> недоступен для экземпляров Azure ST, и чат-бот **Ask dbt** не будет работать в dbt Snowflake Native App без него.
- Ваша учетная запись <Constant name="cloud" /> должна иметь права на создание [service token](/docs/dbt-cloud-apis/service-tokens). Подробнее см. в разделе [Enterprise permissions](/docs/cloud/manage-access/enterprise-permissions).
- У вас есть проект <Constant name="cloud" /> с [настроенным <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) и объявленными метриками.
- Вы настроили [production deployment environment](/docs/deploy/deploy-environments#set-as-production-environment).
    - В этом deployment environment был выполнен как минимум один успешный запуск job, включавший шаг `docs generate`.

### Snowflake

- У вас есть доступ **ACCOUNTADMIN** в Snowflake.
- Ваш аккаунт Snowflake должен иметь доступ к интеграции Native App/SPCS и конфигурациям NA/SPCS (публичный предварительный просмотр планируется в конце июня). Если вы не уверены, пожалуйста, проверьте у вашего менеджера аккаунта Snowflake.
- Аккаунт Snowflake должен находиться в регионе AWS. Azure в настоящее время не поддерживается для интеграции Native App/SPCS.
- У вас есть доступ к Snowflake Cortex через ваши разрешения Snowflake, и [Snowflake Cortex доступен в вашем регионе](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions#availability). Без этого Ask dbt не будет работать.

## Настройка конфигурации для Ask dbt

Настройте <Constant name="cloud" /> и Snowflake Cortex для работы чат-бота **Ask dbt**.

1. В <Constant name="cloud" /> перейдите к конфигурациям вашего <Constant name="semantic_layer" />.

    1. Перейдите в левую панель и нажмите на имя вашего аккаунта. Оттуда выберите **Account settings**.
    1. В левой боковой панели выберите **Projects** и выберите ваш проект dbt из списка проектов.

1. В панели **Project details** нажмите ссылку **Edit <Constant name="semantic_layer" /> Configuration** (она находится под опцией **GraphQL URL**).
1. В панели **<Constant name="semantic_layer" /> Configuration Details** определите учетные данные Snowflake (которые будут использоваться для доступа к Snowflake Cortex) и окружение, в котором запускается <Constant name="semantic_layer" />. Сохраните имя пользователя, роль и окружение во временном месте, чтобы использовать их позже.

    <Lightbox src="/img/docs/cloud-integrations/semantic_layer_configuration.png" width="100%" title="Учетные данные Semantic Layer"/>

1. В Snowflake убедитесь, что вашему пользователю SL и пользователю развертывания предоставлено разрешение на использование Snowflake Cortex. Для получения дополнительной информации обратитесь к [Required Privileges](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions#required-privileges) в документации Snowflake.

    По умолчанию все пользователи должны иметь доступ к Snowflake Cortex. Если это отключено для вас, откройте рабочий лист SQL Snowflake и выполните следующие команды:

    ```sql
    create role cortex_user_role;
    grant database role SNOWFLAKE.CORTEX_USER to role cortex_user_role;
    grant role cortex_user_role to user SL_USER;
    grant role cortex_user_role to user DEPLOYMENT_USER;
    ```

    Убедитесь, что заменили `SNOWFLAKE.CORTEX_USER`, `DEPLOYMENT_USER` и `SL_USER` на соответствующие строки для вашей среды.

## Настройка dbt
Соберите следующую информацию из <Constant name="cloud" />, чтобы настроить приложение.

1. Перейдите в левую панель и нажмите на имя вашего аккаунта. Оттуда выберите **Account settings**. Затем нажмите **API tokens > Service tokens**. Создайте токен сервиса с доступом ко всем проектам, к которым вы хотите получить доступ в dbt Snowflake Native App. Предоставьте следующие наборы разрешений:
    - **Manage marketplace apps**
    - **Job Admin**
    - **Metadata Only**
    - **<Constant name="semantic_layer" /> Only**

    Убедитесь, что сохранили информацию о токене во временном месте для использования позже при настройке Native App.

    Пример предоставления наборов разрешений для всех проектов:

    <Lightbox src="/img/docs/cloud-integrations/example-snowflake-native-app-service-token.png" title="Пример нового токена сервиса для dbt Snowflake Native App"/>

1. В левом боковом меню выберите **Account** и сохраните эту информацию во временном месте, чтобы использовать её позже при настройке Native App:
    - **Account ID** — числовая строка, представляющая вашу учетную запись <Constant name="cloud" />.
    - **Access URL** — если у вас мультиарендный аккаунт в регионе Северной Америки, используйте `cloud.getdbt.com` в качестве URL доступа. Для всех остальных регионов см. раздел [Access, Regions, & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) и найдите в таблице URL доступа, который вам следует использовать.

## Установка dbt Snowflake Native App
1. Перейдите к листингу dbt Snowflake Native App:
    - **Частный листинг** (рекомендуется) &mdash; Используйте ссылку из отправленного вам письма.
    - **Публичный листинг** &mdash; Перейдите на [Snowflake Marketplace](https://app.snowflake.com/marketplace/listing/GZTYZSRT2R3).
1. Нажмите **Get** в листинге, чтобы установить dbt Snowflake Native App. Это может занять несколько минут. Когда установка будет завершена, вам будет отправлено письмо.

    Появится сообщение с вопросом, хотите ли вы изменить приложение и предоставить доступ к складу для установки. dbt Labs настоятельно рекомендует не изменять имя приложения, если это не необходимо.
1. Когда dbt Snowflake Native App успешно установлен, нажмите **Configure** в модальном окне.

## Настройка dbt Snowflake Native App

Выполните шаги **Connect to <Constant name="cloud" /> External Access Integration**. Вам понадобится информация об учетной записи <Constant name="cloud" />, которую вы собрали ранее. При появлении запроса введите ваш account ID, access URL и API service token в качестве значения **Secret value**.  

1. На странице **Activate dbt** нажмите **Activate**, когда вы установите успешное соединение с <Constant name="cloud" /> External Access Integration. На развертывание необходимых сервисов Snowflake и вычислительных ресурсов может потребоваться несколько минут.  
1. После завершения активации перейдите на вкладку **Telemetry** и включите опцию передачи логов уровня `INFO`. Эта опция может появиться не сразу. Это связано с тем, что Snowflake должен создать таблицу событий, чтобы ими можно было делиться.  
1. Когда опция будет успешно включена, нажмите **Launch app**. Затем войдите в приложение, используя свои учетные данные Snowflake.  

    Если вместо страницы входа вас перенаправляет в worksheet Snowsight, это означает, что приложение еще не завершило установку. Обычно эту проблему можно решить, обновив страницу.

    Пройдите шаги **Connect to dbt Cloud External Access Integration**. Вам понадобится информация о вашем аккаунте dbt Cloud, которую вы собрали ранее. Введите ваш Account ID, Access URL и API service token в качестве **Secret value**, когда будет предложено.
1. На странице **Activate dbt** нажмите **Activate**, когда вы установили успешное соединение с dbt Cloud External Access Integration. Это может занять несколько минут, чтобы запустить необходимые службы Snowflake и вычислительные ресурсы.
1. Когда активация завершена, выберите вкладку **Telemetry** и включите опцию для обмена вашими `INFO` логами. Опция может занять некоторое время, чтобы отобразиться. Это связано с тем, что Snowflake необходимо создать таблицу событий, чтобы она могла быть поделена.
1. Когда опция успешно включена, нажмите **Launch app**. Затем войдите в приложение с вашими учетными данными Snowflake.

    Если вас перенаправляет на рабочий лист Snowsight (вместо страницы входа), это означает, что приложение еще не завершило установку. Вы можете решить эту проблему, обычно, обновив страницу.

    Пример dbt Snowflake Native App после настройки:

    <Lightbox src="/img/docs/cloud-integrations/example-dbt-snowflake-native-app.png" title="Пример dbt Snowflake Native App"/>

- **Explore** &mdash; Запустите <Constant name="explorer" /> и убедитесь, что у вас есть доступ к информации о вашем dbt‑проекте.
- **Jobs** &mdash; Просмотрите историю запусков dbt‑задач.
- **Ask dbt** &mdash; Нажмите на любой из предложенных запросов, чтобы задать вопрос чат-боту. В зависимости от количества метрик, определённых в dbt‑проекте, первая загрузка **Ask dbt** может занять несколько минут, так как dbt выполняет построение Retrieval Augmented Generation (RAG). Последующие запуски будут загружаться быстрее.

Чтобы проверить успешность установки приложения, выберите любой из следующих пунктов в боковой панели:

- **Explore** &mdash; Запустите dbt Explorer и убедитесь, что вы можете получить доступ к информации о вашем проекте dbt.
- **Jobs** &mdash; Просмотрите историю выполнения заданий dbt.
- **Ask dbt** &mdash; Нажмите на любой из предложенных запросов, чтобы задать вопрос чат-боту. В зависимости от количества метрик, определенных для проекта dbt, может потребоваться несколько минут для загрузки **Ask dbt** в первый раз, так как dbt строит Retrieval Augmented Generation (RAG). Последующие запуски будут загружаться быстрее.

Пример чат-бота **Ask dbt** с предложенными запросами вверху:

<Lightbox src="/img/docs/cloud-integrations/example-ask-dbt-native-app.png" title="Пример чат-бота Ask dbt"/>

## Подключение новых пользователей
1. В боковой панели Snowflake выберите **Data Products > Apps**. Выберите **dbt** из списка, чтобы открыть страницу конфигурации приложения. Затем нажмите **Manage access** (в правом верхнем углу), чтобы подключить новых пользователей к приложению. Предоставьте роль **APP_USER** соответствующим ролям, которые должны иметь доступ к приложению, но не возможность редактировать конфигурации. Предоставьте **APP_ADMIN** ролям, которые должны иметь доступ к редактированию или удалению конфигураций.

1. Новые пользователи могут получить доступ к приложению либо через URL приложения Snowflake, который был с ними поделён, либо нажав **Launch app** на странице конфигурации приложения.

## Часто задаваемые вопросы

<Expandable alt_header="Не удаётся установить dbt Snowflake Native App из Snowflake Marketplace">

<Constant name="cloud" /> Snowflake Native App недоступно для аккаунтов Snowflake Free Trial.

</Expandable>

<Expandable alt_header="Получено сообщение об ошибке `Unable to access schema dbt_sl_llm` от Ask dbt" >

Проверьте, что пользователю SL предоставлен доступ к схеме `dbt_sl_llm` и убедитесь, что у него есть все необходимые разрешения для чтения и записи из схемы.

</Expandable>

<Expandable alt_header="Необходимо обновить параметры конфигурации dbt, используемые Native App" >

Если идентификатор аккаунта <Constant name="cloud" />, URL доступа или токен API‑сервиса были обновлены, необходимо обновить конфигурацию dbt Snowflake Native App. В Snowflake перейдите на страницу конфигурации приложения и удалите существующие настройки. Затем добавьте новую конфигурацию и выполните команду `CALL app_public.restart_app();` в базе данных приложения в Snowsight.
</Expandable>

<Expandable alt_header="Поддерживаются ли переменные окружения в Native App?" >

[Переменные окружения](/docs/build/environment-variables), такие как `{{env_var('DBT_WAREHOUSE') }}`, пока не поддерживаются в <Constant name="semantic_layer" />. Чтобы использовать функцию **Ask dbt**, необходимо указать фактические учетные данные напрямую.
</Expandable>
