---
title: "Настройка dbt Snowflake Native App"
description: "Узнайте, как настроить dbt Snowflake Native App"
pagination_prev: "docs/cloud-integrations/snowflake-native-app"
pagination_next: null
---

# Настройка dbt Snowflake Native App <Lifecycle status='preview' />

[dbt Snowflake Native App](/docs/cloud-integrations/snowflake-native-app) позволяет использовать следующие функции в интерфейсе Snowflake: dbt Explorer, чат-бот **Ask dbt** и функции наблюдаемости оркестрации dbt Cloud.

Настройте как dbt Cloud, так и Snowflake для интеграции. Основные шаги описаны следующим образом:

1. Настройте конфигурацию **Ask dbt**.
1. Настройте Snowflake.
1. Настройте dbt Cloud.
1. Приобретите и установите dbt Snowflake Native App.
1. Настройте приложение.
1. Проверьте успешность установки приложения.
1. Подключите новых пользователей к приложению.

Порядок шагов немного отличается, если вы приобрели публичный листинг Native App; начните с покупки Native App, выполнения предварительных условий, а затем выполните оставшиеся шаги по порядку.

## Предварительные условия
Следующие условия необходимы для dbt Cloud и Snowflake.

### dbt Cloud

- У вас должен быть аккаунт dbt Cloud на тарифном плане Enterprise в регионе AWS или Azure. Если у вас его нет, пожалуйста, [свяжитесь с нами](mailto:sales_snowflake_marketplace@dbtlabs.com), чтобы начать.
    - В настоящее время Semantic Layer недоступен для экземпляров Azure ST, и чат-бот **Ask dbt** не будет работать в dbt Snowflake Native App без него.
- Ваш аккаунт dbt Cloud должен иметь разрешение на создание [токена сервиса](/docs/dbt-cloud-apis/service-tokens). Подробности смотрите в разделе [Enterprise permissions](/docs/cloud/manage-access/enterprise-permissions).
- В вашем проекте dbt Cloud настроен [Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) и объявлены метрики.
- Вы настроили [производственную среду развертывания](/docs/deploy/deploy-environments#set-as-production-environment).
    - Был выполнен хотя бы один успешный запуск задания, включающий шаг `docs generate` в среде развертывания.

### Snowflake

- У вас есть доступ **ACCOUNTADMIN** в Snowflake.
- Ваш аккаунт Snowflake должен иметь доступ к интеграции Native App/SPCS и конфигурациям NA/SPCS (публичный предварительный просмотр планируется в конце июня). Если вы не уверены, пожалуйста, проверьте у вашего менеджера аккаунта Snowflake.
- Аккаунт Snowflake должен находиться в регионе AWS. Azure в настоящее время не поддерживается для интеграции Native App/SPCS.
- У вас есть доступ к Snowflake Cortex через ваши разрешения Snowflake, и [Snowflake Cortex доступен в вашем регионе](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions#availability). Без этого Ask dbt не будет работать.

## Настройка конфигурации для Ask dbt

Настройте dbt Cloud и Snowflake Cortex для работы чат-бота **Ask dbt**.

1. В dbt Cloud перейдите к вашим конфигурациям Semantic Layer.

    1. Перейдите в левую панель и нажмите на имя вашего аккаунта. Оттуда выберите **Account settings**.
    1. В левой боковой панели выберите **Projects** и выберите ваш проект dbt из списка проектов.

    1. В панели **Project details** нажмите на ссылку **Edit Semantic Layer Configuration** (которая находится под опцией **GraphQL URL**).
1. В панели **Semantic Layer Configuration Details** определите учетные данные Snowflake (которые вы будете использовать для доступа к Snowflake Cortex) и среду, в которой работает Semantic Layer. Сохраните имя пользователя, роль и среду во временном месте для использования позже.

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

## Настройка dbt Cloud
Соберите следующую информацию из dbt Cloud для настройки приложения.

1. Перейдите в левую панель и нажмите на имя вашего аккаунта. Оттуда выберите **Account settings**. Затем нажмите **API tokens > Service tokens**. Создайте токен сервиса с доступом ко всем проектам, к которым вы хотите получить доступ в dbt Snowflake Native App. Предоставьте следующие наборы разрешений:
    - **Manage marketplace apps**
    - **Job Admin**
    - **Metadata Only**
    - **Semantic Layer Only**

    Убедитесь, что сохранили информацию о токене во временном месте для использования позже при настройке Native App.

    Пример предоставления наборов разрешений для всех проектов:

    <Lightbox src="/img/docs/cloud-integrations/example-snowflake-native-app-service-token.png" title="Пример нового токена сервиса для dbt Snowflake Native App"/>

1. В левой боковой панели выберите **Account** и сохраните эту информацию во временном месте для использования позже при настройке Native App:
    - **Account ID** &mdash; Числовая строка, представляющая ваш аккаунт dbt Cloud.
    - **Access URL** &mdash; Если у вас есть многопользовательский аккаунт в Северной Америке, используйте `cloud.getdbt.com` в качестве URL доступа. Для всех других регионов обратитесь к [Access, Regions, & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) и найдите URL доступа, который вы должны использовать в таблице.

## Установка dbt Snowflake Native App
1. Перейдите к листингу dbt Snowflake Native App:
    - **Частный листинг** (рекомендуется) &mdash; Используйте ссылку из отправленного вам письма.
    - **Публичный листинг** &mdash; Перейдите на [Snowflake Marketplace](https://app.snowflake.com/marketplace/listing/GZTYZSRT2R3).
1. Нажмите **Get** в листинге, чтобы установить dbt Snowflake Native App. Это может занять несколько минут. Когда установка будет завершена, вам будет отправлено письмо.

    Появится сообщение с вопросом, хотите ли вы изменить приложение и предоставить доступ к складу для установки. dbt Labs настоятельно рекомендует не изменять имя приложения, если это не необходимо.
1. Когда dbt Snowflake Native App успешно установлен, нажмите **Configure** в модальном окне.

## Настройка dbt Snowflake Native App

1. На странице **Activate dbt** нажмите **Grant** в **Step 1: Grant Account Privileges**.
1. Когда привилегии успешно предоставлены, нажмите **Review** в **Step 2: Allow Connections**.

    Пройдите шаги **Connect to dbt Cloud External Access Integration**. Вам понадобится информация о вашем аккаунте dbt Cloud, которую вы собрали ранее. Введите ваш Account ID, Access URL и API service token в качестве **Secret value**, когда будет предложено.
1. На странице **Activate dbt** нажмите **Activate**, когда вы установили успешное соединение с dbt Cloud External Access Integration. Это может занять несколько минут, чтобы запустить необходимые службы Snowflake и вычислительные ресурсы.
1. Когда активация завершена, выберите вкладку **Telemetry** и включите опцию для обмена вашими `INFO` логами. Опция может занять некоторое время, чтобы отобразиться. Это связано с тем, что Snowflake необходимо создать таблицу событий, чтобы она могла быть поделена.
1. Когда опция успешно включена, нажмите **Launch app**. Затем войдите в приложение с вашими учетными данными Snowflake.

    Если вас перенаправляет на рабочий лист Snowsight (вместо страницы входа), это означает, что приложение еще не завершило установку. Вы можете решить эту проблему, обычно, обновив страницу.

    Пример dbt Snowflake Native App после настройки:

    <Lightbox src="/img/docs/cloud-integrations/example-dbt-snowflake-native-app.png" title="Пример dbt Snowflake Native App"/>

## Проверка успешной установки приложения

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

<Expandable alt_header="Не удается установить dbt Cloud Snowflake Native app из Snowflake Marketplace" >

dbt Cloud Snowflake Native App недоступен для аккаунтов Snowflake Free Trial.

</Expandable>

<Expandable alt_header="Получено сообщение об ошибке `Unable to access schema dbt_sl_llm` от Ask dbt" >

Проверьте, что пользователю SL предоставлен доступ к схеме `dbt_sl_llm` и убедитесь, что у него есть все необходимые разрешения для чтения и записи из схемы.

</Expandable>

<Expandable alt_header="Необходимо обновить параметры конфигурации dbt, используемые Native App" >

Если произошли изменения в ID аккаунта dbt Cloud, URL доступа или API service token, вам нужно обновить конфигурацию для dbt Snowflake Native App. В Snowflake перейдите на страницу конфигурации приложения и удалите существующие конфигурации. Добавьте новую конфигурацию, а затем выполните `CALL app_public.restart_app();` в базе данных приложения в Snowsight.
</Expandable>

<Expandable alt_header="Поддерживаются ли переменные окружения в Native App?" >

[Переменные окружения](/docs/build/environment-variables), такие как `{{env_var('DBT_WAREHOUSE') }}`, пока не поддерживаются в dbt Semantic Layer. Чтобы использовать функцию 'Ask dbt', вы должны использовать реальные учетные данные.
</Expandable>