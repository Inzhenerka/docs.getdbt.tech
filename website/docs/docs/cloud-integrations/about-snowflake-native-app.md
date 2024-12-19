---
title: "О приложении dbt Snowflake Native"
id: "snowflake-native-app"
description: "Обзор приложения dbt Snowflake Native для учетных записей dbt Cloud"
pagination_prev: null
pagination_next: "docs/cloud-integrations/set-up-snowflake-native-app"
---

# О приложении dbt Snowflake Native <Lifecycle status='preview' />

Приложение dbt Snowflake Native &mdash; основанное на фреймворке Snowflake Native App Framework и Snowpark Container Services &mdash; расширяет ваш опыт работы с dbt Cloud в интерфейсе Snowflake. Вы сможете получить доступ к этим трем функциям с помощью своей учетной записи Snowflake:

- **dbt Explorer** &mdash; Встроенная версия [dbt Explorer](/docs/collaborate/explore-projects)
- **Ask dbt** &mdash; Чат-бот с поддержкой dbt, работающий на основе [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), OpenAI и Snowflake Cortex
- **Наблюдаемость оркестрации** &mdash; Просмотр [истории выполнения задач](/docs/deploy/run-visibility) и пример кода для создания задач Snowflake, которые запускают [развертывания](/docs/deploy/deploy-jobs).

Эти функции позволяют вам расширить возможности, созданные с помощью dbt Cloud, для пользователей, которые традиционно работали с данными, полученными из проекта dbt, таких как аналитики BI и технические заинтересованные стороны.

Для инструкций по установке обратитесь к разделу [Настройка приложения dbt Snowflake Native](/docs/cloud-integrations/set-up-snowflake-native-app).

## Архитектура

Существует три инструмента, связанных с работой приложения dbt Snowflake Native:

| Инструмент                          | Описание |
|-------------------------------------|----------|
| Учетная запись Snowflake потребителя | Место, где установлено приложение Native App, работающее на Snowpark Container Services. <br /><br /> Приложение Native App делает вызовы к API dbt Cloud и API Datadog (для ведения журналов) с использованием [внешнего сетевого доступа Snowflake](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview). <br /><br /> Для работы чат-бота **Ask dbt** слой семантики dbt обращается к LLM Cortex для выполнения запросов и генерации текста на основе подсказки. Это настраивается, когда пользователь настраивает окружение слоя семантики. |
| Учетная запись Snowflake продукта dbt | Место, где размещается пакет приложения Native App, который затем распределяется в учетную запись потребителя. <br /><br /> Таблица событий потребителя делится с этой учетной записью для мониторинга и ведения журналов приложения. |
| Учетная запись dbt Cloud потребителя | Приложение Native App взаимодействует с API dbt Cloud для получения метаданных и обработки запросов слоя семантики, чтобы поддерживать функции приложения Native App. <br /><br /> Учетная запись dbt Cloud также обращается к учетной записи Snowflake потребителя для использования хранилища для выполнения запросов dbt для оркестрации и LLM Cortex Arctic для работы чат-бота **Ask dbt**. |

Следующая диаграмма иллюстрирует архитектуру:

<Lightbox src="/img/docs/cloud-integrations/architecture-dbt-snowflake-native-app.png" title="Архитектура интеграции dbt Cloud и Snowflake"/>

## Доступ

Войдите в приложение dbt Snowflake Native, используя свой обычный метод аутентификации Snowflake. У пользователя Snowflake должна быть соответствующая учетная запись dbt Cloud с _[лицензией разработчика](/docs/cloud/manage-access/seats-and-users)_. Ранее это не было обязательным требованием во время [Предварительного просмотра](/docs/dbt-versions/product-lifecycles#dbt-cloud) функции.

Если ваше приложение Snowflake Native уже настроено, при следующем доступе к dbt Cloud из приложения вам будет предложено [связать учетные данные](#link-credentials). Это одноразовый процесс. Если у вас нет учетной записи dbt Cloud, связанной с лицензией разработчика, вам будет отказано в доступе к среде dbt Cloud, и вам потребуется помощь администратора.

_Пользователи с лицензиями IT или только для чтения не смогут получить доступ к dbt Cloud через приложение Snowflake Native._

Пользователи приложения могут получить доступ ко всей информации, доступной токену службы API.

## Приобретение
Приложение dbt Snowflake Native доступно на [Snowflake Marketplace](https://app.snowflake.com/marketplace/listing/GZTYZSRT2R3). Приобретение включает доступ к приложению Native App и учетной записи dbt Cloud, которая находится на корпоративном плане. Существующие клиенты dbt Cloud Enterprise также могут получить к нему доступ. Если вас это интересует, свяжитесь с вашим менеджером по корпоративным аккаунтам.

Если вас это интересует, пожалуйста, [свяжитесь с нами](mailto:sales_snowflake_marketplace@dbtlabs.com) для получения дополнительной информации.

## Поддержка
Если у вас есть вопросы о приложении dbt Snowflake Native, вы можете [связаться с нашей службой поддержки](mailto:dbt-snowflake-marketplace@dbtlabs.com) для получения помощи. Пожалуйста, предоставьте информацию о вашей установке приложения Native App, включая идентификатор вашей учетной записи dbt Cloud и идентификатор учетной записи Snowflake.

## Ограничения
- Приложение Native App не поддерживает учетные записи dbt Cloud с включенными [ограничениями IP](/docs/cloud/secure/ip-restrictions).

## Связка учетных данных

На ранних этапах предварительного просмотра приложения Snowflake Native пользователи должны были существовать только на платформе Snowflake и могли получить доступ к dbt Cloud через приложение без наличия соответствующего пользователя. Это больше не так, и каждый пользователь Snowflake также должен иметь доступ к учетной записи dbt Cloud с [лицензией разработчика](/docs/cloud/manage-access/seats-and-users).

Для существующих учетных записей с настроенным приложением Snowflake Native пользователи будут приглашены аутентифицироваться в dbt Cloud при следующем входе. Это одноразовый процесс, если у них есть пользователь в dbt Cloud. Если у них нет пользователя dbt Cloud, им будет отказано в доступе, и администратору потребуется [создать его](/docs/cloud/manage-access/invite-users).

1. Когда вы попытаетесь получить доступ к платформе dbt Cloud из приложения Snowflake Native, вам будет предложено связать вашу учетную запись.

<Lightbox src="/img/docs/dbt-cloud/snowflake-link-account-prompt.png" width="90%" title="Запрос приложения Snowflake Native на связывание учетных записей" />

2. Нажмите **Связать учетную запись**, и вам будет предложено ввести учетные данные dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/snowflake-link-dbt-cloud.png" width="90%" title="Запрос на связывание учетных записей" />