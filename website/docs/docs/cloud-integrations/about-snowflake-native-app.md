---
title: "О приложении dbt Snowflake Native App"
id: "snowflake-native-app"
description: "Обзор нативного приложения dbt Snowflake для аккаунтов dbt"
pagination_prev: null
pagination_next: "docs/cloud-integrations/set-up-snowflake-native-app"
unlisted: true

---

# О приложении dbt Snowflake Native App <Lifecycle status='preview' /> {#about-the-dbt-snowflake-native-app}

dbt Snowflake Native App &mdash; созданное на базе Snowflake Native App Framework и Snowpark Container Services &mdash; расширяет возможности <Constant name="cloud" /> непосредственно в пользовательском интерфейсе Snowflake. Используя свою учетную запись Snowflake, вы сможете получить доступ к следующим трем возможностям:

- **<Constant name="explorer" />** &mdash; Встроенная версия [<Constant name="explorer" />](/docs/explore/explore-projects)
- **Ask dbt** &mdash; Чат-бот с поддержкой dbt, работающий на базе [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), OpenAI и Snowflake Cortex
- **Orchestration observability** &mdash; Просмотр [истории запусков заданий](/docs/deploy/run-visibility) и примеры кода для создания задач Snowflake, которые запускают [deploy jobs](/docs/deploy/deploy-jobs)

Эти возможности позволяют расширить то, что было создано с помощью <Constant name="cloud" />, и предоставить доступ пользователям, которые традиционно работают «ниже по потоку» от dbt‑проекта, таким как BI‑аналитики и технические стейкхолдеры.

Для инструкций по установке обратитесь к [Настройка dbt Snowflake Native App](/docs/cloud-integrations/set-up-snowflake-native-app).

## Архитектура {#architecture}

Существует три инструмента, связанных с работой dbt Snowflake Native App:

| Инструмент                         | Описание |
|------------------------------------|-------------|
| Consumer’s Snowflake account       | Место, где установлен Native App, работающий на базе Snowpark Container Services. <br /><br /> Native App выполняет вызовы API <Constant name="cloud" /> и API Datadog (для логирования), используя [external network access в Snowflake](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview). <br /><br /> Для работы чат-бота **Ask dbt** компонент <Constant name="semantic_layer" /> обращается к Cortex LLM для выполнения запросов и генерации текста на основе промпта. Это настраивается пользователем при конфигурации окружения <Constant name="semantic_layer" />. | 
| dbt product Snowflake account | Место, где размещается пакет приложения Native App, который затем распространяется в аккаунт потребителя. <br /><br /> Таблица событий потребителя расшаривается в этот аккаунт для мониторинга приложения и логирования. |
| Consumer’s <Constant name="cloud" /> account       | Native App взаимодействует с API <Constant name="cloud" /> для работы с метаданными и обработки запросов <Constant name="semantic_layer" />, обеспечивая пользовательские сценарии Native App. <br /> <br /> Аккаунт <Constant name="cloud" /> также обращается к Snowflake-аккаунту потребителя, чтобы использовать warehouse для выполнения dbt-запросов в рамках оркестрации, а также к Cortex LLM Arctic для работы чат-бота **Ask dbt**. |

Следующая диаграмма иллюстрирует архитектуру:

<Lightbox src="/img/docs/cloud-integrations/architecture-dbt-snowflake-native-app.png" title="Архитектура интеграции dbt и Snowflake"/>

## Доступ {#access}

Войдите в dbt Snowflake Native App, используя ваш обычный метод аутентификации Snowflake. Пользователь Snowflake должен иметь соответствующего пользователя dbt Cloud с _[лицензией разработчика](/docs/cloud/manage-access/seats-and-users)_. Ранее это не было обязательным требованием во время [предварительного просмотра](/docs/dbt-versions/product-lifecycles#dbt-cloud).

Войдите в dbt Snowflake Native App, используя ваш обычный метод аутентификации входа в Snowflake. Пользователь Snowflake должен иметь соответствующего пользователя <Constant name="cloud" /> с _[лицензией разработчика](/docs/cloud/manage-access/seats-and-users)_. Ранее это не было обязательным требованием на этапе [Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud).

Если ваш dbt Snowflake Native App уже настроен, при следующем доступе к <Constant name="cloud" /> из приложения вам будет предложено [связать учетные данные](#link-credentials). Это одноразовая процедура.

## Закупки {#procurement}
dbt Snowflake Native App доступен в [Snowflake Marketplace](https://app.snowflake.com/marketplace/listing/GZTYZSRT2UA/dbt-labs-dbt). Его приобретение включает доступ к Native App и учетную запись <Constant name="cloud" /> на тарифном плане Enterprise. Существующие клиенты <Constant name="cloud" /> с тарифом Enterprise также могут получить к нему доступ. Если вам это интересно, свяжитесь с вашим аккаунт-менеджером Enterprise.

Если вы заинтересованы, пожалуйста, [свяжитесь с нами](mailto:sales_snowflake_marketplace@dbtlabs.com) для получения дополнительной информации.

## Поддержка {#support}
Если у вас есть какие-либо вопросы по dbt Snowflake Native App, вы можете [связаться с нашей командой поддержки](mailto:dbt-snowflake-marketplace@dbtlabs.com) для получения помощи. Пожалуйста, предоставьте информацию о вашей установке Native App, включая идентификатор аккаунта <Constant name="cloud" /> и идентификатор аккаунта Snowflake.

## Ограничения {#limitations}
- Native App не поддерживает аккаунты <Constant name="cloud" /> с включёнными [IP Restrictions](/docs/cloud/secure/ip-restrictions).

## Ограничения {#link-credentials}

Каждый пользователь Snowflake, получающий доступ к Native App, также должен иметь доступ к аккаунту <Constant name="cloud" /> с [лицензией разработчика или только для чтения](/docs/cloud/manage-access/seats-and-users). Доступ к функциям будет зависеть от типа лицензии <Constant name="cloud" />.

Для существующих аккаунтов с настроенным Snowflake Native App пользователям будет предложено пройти аутентификацию в <Constant name="cloud" /> при следующем входе в систему. Это одноразовый процесс, если у них уже есть пользователь в <Constant name="cloud" />. Если пользователя <Constant name="cloud" /> нет, доступ будет запрещён, и администратору потребуется [создать его](/docs/cloud/manage-access/invite-users).

1. При попытке получить доступ к платформе <Constant name="cloud" /> из Snowflake Native App вам будет предложено связать аккаунт.

2. Нажмите **Link account**, после чего вам будет предложено ввести учётные данные <Constant name="cloud" />.
