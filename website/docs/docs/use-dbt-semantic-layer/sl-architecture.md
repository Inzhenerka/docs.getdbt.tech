---
title: "Архитектура семантического слоя dbt"
id: sl-architecture
description: "Архитектура продукта семантического слоя dbt и связанные вопросы."
sidebar_label: "Архитектура семантического слоя"
tags: [Semantic Layer]
availability: platform_login
---

<Constant name="semantic_layer" /> позволяет вам определять метрики и использовать различные интерфейсы для выполнения запросов к ним. <Constant name="semantic_layer" /> берёт на себя основную работу по определению того, где именно в вашей платформе данных находятся запрашиваемые данные, и генерирует SQL для выполнения запроса (включая выполнение join-ов).

<DocCarousel slidesPerView={1} autoHeight={true}>
<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-concept.png" width="80%" title="Эта схема показывает, как dbt Semantic Layer работает с вашим стеком данных." />
<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-architecture.jpg" width="85%" title="Схема показывает, как проходят ваши данные при использовании dbt Semantic Layer и какие инструменты интеграции он поддерживает."/>
</DocCarousel>

## Компоненты {#components}

<Constant name="semantic_layer" /> включает следующие компоненты:

| Компоненты | Информация | Локальный dbt | Тарифы Developer | Тарифы Starter | Тарифы уровня Enterprise | Лицензия |
| --- | --- | :---: | :---: | :---: | :---: | :---: |
| **[MetricFlow](/docs/build/about-metricflow)** | MetricFlow в dbt позволяет пользователям централизованно определять семантические модели и метрики с помощью спецификаций YAML. | ✅ | ✅ | ✅ |  ✅  | [Лицензия Apache 2.0](https://github.com/dbt-labs/metricflow/blob/main/LICENSE)|
| **dbt Semantic interfaces**| Спецификация конфигурации для определения метрик, измерений и связей между ними. Пакет [dbt-semantic-interfaces](https://github.com/dbt-labs/dbt-semantic-interfaces) доступен по лицензии Apache 2.0. | ✅ | ✅ | ✅ | ✅ | [Лицензия Apache 2.0](https://github.com/dbt-labs/dbt-semantic-interfaces/blob/main/LICENSE) |
| **Сервисный слой** | Координирует запросы и направляет соответствующий запрос метрик в целевой движок выполнения запросов. Предоставляется через <Constant name="dbt" /> и доступен всем пользователям dbt версии 1.6 или более поздней. Сервисный слой включает службу Gateway для выполнения SQL на платформе данных. | ❌ | ❌ | ✅ | ✅ | Проприетарная, Cloud (Starter, Enterprise, Enterprise+)|
| **[API <Constant name="semantic_layer" />](/docs/dbt-apis/sl-api-overview)** | Интерфейсы позволяют пользователям отправлять запросы метрик через API GraphQL и JDBC. Они также служат основой для создания полноценных интеграций с различными инструментами. | ❌ | ❌ | ✅ | ✅ | Проприетарная, Cloud (Starter, Enterprise, Enterprise+)|

Следующая таблица сравнивает функции, доступные в dbt Cloud и исходно доступные в dbt Core:

В следующей таблице сравниваются возможности, доступные в <Constant name="dbt" /> и в <Constant name="core" /> с доступным исходным кодом:

| Возможность | MetricFlow с доступным исходным кодом | <Constant name="semantic_layer" /> с <Constant name="dbt" /> |
| ----- | :------: | :------: |
| Определение метрик и семантических моделей в dbt с использованием спецификации MetricFlow | ✅ | ✅ |
| Генерация SQL на основе набора файлов конфигурации | ✅ | ✅ |
| Запрос метрик и измерений через интерфейс командной строки (CLI) | ✅ | ✅ |
| Запрос метаданных измерений, сущностей и метрик через CLI | ✅ | ✅ |
| Запрос метрик и измерений через семантические API (ADBC, GQL) | ❌ | ✅ |
| Подключение к интеграциям для дальнейшего использования данных (Tableau, Hex, Dot, Mode, Google Sheets и т. д.) | ❌ | ✅ |
| Создание и запуск экспортов (Exports) для сохранения результатов запросов метрик в виде таблиц на вашей платформе данных | ❌ | ✅ |

## Связанные материалы {#feature-comparison}
- [<Constant name="semantic_layer" /> FAQs](/docs/use-dbt-semantic-layer/sl-faqs)
