---
title: "О приложении dbt Snowflake Native App"
id: "snowflake-native-app"
description: "Обзор приложения dbt Snowflake Native App для учетных записей dbt Cloud"
pagination_prev: null
pagination_next: "docs/cloud-integrations/set-up-snowflake-native-app"
---

# О приложении dbt Snowflake Native App <Lifecycle status='preview' />

Приложение dbt Snowflake Native App &mdash; на базе Snowflake Native App Framework и Snowpark Container Services &mdash; расширяет ваш опыт работы с dbt Cloud в интерфейсе пользователя Snowflake. Вы сможете получить доступ к следующим трем функциям с помощью вашей учетной записи Snowflake:

- **dbt Explorer** &mdash; Встроенная версия [dbt Explorer](/docs/collaborate/explore-projects)
- **Ask dbt** &mdash; Чат-бот с поддержкой dbt, работающий на базе [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), OpenAI и Snowflake Cortex
- **Наблюдаемость оркестрации** &mdash; Просмотр [истории выполнения заданий](/docs/deploy/run-visibility) и пример кода для создания задач Snowflake, которые запускают [задания развертывания](/docs/deploy/deploy-jobs).

Эти функции позволяют расширить возможности, созданные с помощью dbt Cloud, для пользователей, которые традиционно работали с проектом dbt на последующих этапах, таких как аналитики BI и технические заинтересованные стороны.

Для инструкций по установке обратитесь к [Настройка dbt Snowflake Native App](/docs/cloud-integrations/set-up-snowflake-native-app).

## Архитектура

Существует три инструмента, связанных с работой dbt Snowflake Native App:

| Инструмент                         | Описание |
|------------------------------------|-------------|
| Учетная запись Snowflake потребителя | Место, где установлено Native App, работающая на базе Snowpark Container Services. <br /><br /> Native App делает вызовы к API dbt Cloud и API Datadog (для логирования) с использованием [внешнего сетевого доступа Snowflake](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview). <br /><br />Для работы чат-бота **Ask dbt** семантический слой dbt обращается к Cortex LLM для выполнения запросов и генерации текста на основе запроса. Это настраивается, когда пользователь настраивает среду семантического слоя. |
| Учетная запись Snowflake продукта dbt | Место, где размещен пакет приложения Native App, который затем распределяется в учетную запись потребителя. <br /><br />Таблица событий потребителя делится с этой учетной записью для мониторинга и логирования приложения. |
| Учетная запись dbt Cloud потребителя | Native App взаимодействует с API dbt Cloud для метаданных и обработки запросов семантического слоя для обеспечения работы Native App. <br /> <br /> Учетная запись dbt Cloud также вызывает учетную запись Snowflake потребителя для использования хранилища для выполнения запросов dbt для оркестрации и Cortex LLM Arctic для работы чат-бота **Ask dbt**. |

Следующая диаграмма иллюстрирует архитектуру:

<Lightbox src="/img/docs/cloud-integrations/architecture-dbt-snowflake-native-app.png" title="Архитектура интеграции dbt Cloud и Snowflake"/>

## Доступ

Войдите в dbt Snowflake Native App, используя ваш обычный метод аутентификации Snowflake. Пользователь Snowflake должен иметь соответствующего пользователя dbt Cloud с _[лицензией разработчика](/docs/cloud/manage-access/seats-and-users)_. Ранее это не было обязательным требованием во время [предварительного просмотра](/docs/dbt-versions/product-lifecycles#dbt-cloud).

Если ваше приложение Snowflake Native App уже настроено, вам будет предложено [связать учетные данные](#link-credentials) при следующем доступе к dbt Cloud из приложения. Это одноразовый процесс. Если у вас нет учетной записи dbt Cloud, связанной с лицензией разработчика, вам будет отказано в доступе к среде dbt Cloud, и вам потребуется помощь администратора.

_Пользователям с лицензиями IT или только для чтения будет отказано в доступе к dbt Cloud через Snowflake Native App._

Пользователи приложения могут получить доступ ко всей информации, доступной для токена службы API.

## Закупка

Приложение dbt Snowflake Native App доступно на [Snowflake Marketplace](https://app.snowflake.com/marketplace/listing/GZTYZSRT2R3). Покупка включает доступ к Native App и учетной записи dbt Cloud на тарифном плане Enterprise. Существующие клиенты dbt Cloud Enterprise также могут получить к нему доступ. Если вы заинтересованы, свяжитесь с вашим менеджером по работе с корпоративными клиентами.

Если вы заинтересованы, пожалуйста, [свяжитесь с нами](matilto:sales_snowflake_marketplace@dbtlabs.com) для получения дополнительной информации.

## Поддержка

Если у вас есть вопросы о dbt Snowflake Native App, вы можете [связаться с нашей службой поддержки](mailto:dbt-snowflake-marketplace@dbtlabs.com) для получения помощи. Пожалуйста, предоставьте информацию о вашей установке Native App, включая ваш идентификатор учетной записи dbt Cloud и идентификатор учетной записи Snowflake.

## Ограничения

- Native App не поддерживает учетные записи dbt Cloud с включенными [ограничениями IP](/docs/cloud/secure/ip-restrictions).

## Связь учетных данных

На ранних этапах предварительного просмотра Snowflake Native App пользователи должны были существовать только на платформе Snowflake и могли получить доступ к dbt Cloud через приложение без наличия соответствующего пользователя. Это больше не так, и каждый пользователь Snowflake также должен иметь доступ к учетной записи dbt Cloud с [лицензией разработчика](/docs/cloud/manage-access/seats-and-users).

Для существующих учетных записей с настроенным Snowflake Native App пользователям будет предложено пройти аутентификацию в dbt Cloud при следующем входе. Это одноразовый процесс, если у них есть пользователь в dbt Cloud. Если у них нет пользователя dbt Cloud, им будет отказано в доступе, и администратору потребуется [создать его](/docs/cloud/manage-access/invite-users).

1. Когда вы попытаетесь получить доступ к платформе dbt Cloud из Snowflake Native App, вам будет предложено связать вашу учетную запись.

<Lightbox src="/img/docs/dbt-cloud/snowflake-link-account-prompt.png" width="90%" title="Запрос Snowflake Native App на связывание учетных записей" />

2. Нажмите **Link account**, и вам будет предложено ввести ваши учетные данные dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/snowflake-link-dbt-cloud.png" width="90%" title="Запрос на связывание учетных записей" />