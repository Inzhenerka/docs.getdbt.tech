---
title: "Архитектура семантического слоя dbt"
id: sl-architecture
description: "Архитектура продукта семантического слоя dbt и связанные вопросы."
sidebar_label: "Архитектура семантического слоя"
tags: [Semantic Layer]
---

<Constant name="semantic_layer" /> позволяет вам определять метрики и использовать различные интерфейсы для выполнения запросов к ним. <Constant name="semantic_layer" /> берёт на себя основную работу по определению того, где именно в вашей платформе данных находятся запрашиваемые данные, и генерирует SQL для выполнения запроса (включая выполнение join-ов).

<DocCarousel slidesPerView={1} autoHeight={true}>
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-concept.png" width="80%" title="Эта диаграмма показывает, как dbt Semantic Layer работает с вашим стеком данных." />
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture.jpg" width="85%" title="Диаграмма демонстрирует, как данные проходят через ваш пайплайн с использованием dbt Semantic Layer и какие инструменты интеграции он поддерживает."/>
</DocCarousel>

## Компоненты

<Constant name="semantic_layer" /> включает следующие компоненты:

| Компоненты | Описание | Пользователи <Constant name="core" /> | Планы Developer | Планы Starter | Планы уровня Enterprise | Лицензия |
| --- | --- | :---: | :---: | :---: | :---: | :---: |
| **[MetricFlow](/docs/build/about-metricflow)** | MetricFlow в dbt позволяет централизованно определять семантические модели и метрики с помощью спецификаций YAML. | ✅ | ✅ | ✅ | ✅ | [Лицензия Apache 2.0](https://github.com/dbt-labs/metricflow/blob/main/LICENSE) |
| **dbt Semantic interfaces** | Спецификация конфигурации для определения метрик, измерений, связей между ними и способов выполнения запросов. Репозиторий [dbt-semantic-interfaces](https://github.com/dbt-labs/dbt-semantic-interfaces) доступен под лицензией Apache 2.0. | ❌ | ❌ | ✅ | ✅ | Проприетарная, Cloud (Starter & Enterprise) |
| **Service layer** | Координирует запросы на выполнение и направляет соответствующий запрос к метрикам в целевой движок выполнения запросов. Предоставляется через <Constant name="cloud" /> и доступен всем пользователям dbt версии 1.6 и выше. Сервисный слой включает Gateway‑сервис для выполнения SQL-запросов к платформе данных. | ❌ | ❌ | ✅ | ✅ | Проприетарная, Cloud (Starter, Enterprise, Enterprise+) |
| **[<Constant name="semantic_layer" /> APIs](/docs/dbt-cloud-apis/sl-api-overview)** | Интерфейсы позволяют отправлять запросы к метрикам с использованием API GraphQL и JDBC. Они также служат основой для создания первоклассных интеграций с различными инструментами. | ❌ | ❌ | ✅ | ✅ | Проприетарная, Cloud (Starter, Enterprise, Enterprise+) |

Следующая таблица сравнивает функции, доступные в dbt Cloud и исходно доступные в dbt Core:

В следующей таблице сравниваются возможности, доступные в <Constant name="cloud" />, и возможности, доступные в исходном коде <Constant name="core" />:

| Функциональность | Источник MetricFlow доступен | <Constant name="semantic_layer" /> с <Constant name="cloud" /> |
| ----- | :------: | :------: |
| Определение метрик и семантических моделей в dbt с использованием спецификации MetricFlow | ✅ | ✅ |
| Генерация SQL из набора конфигурационных файлов | ✅ | ✅ |
| Запрос метрик и измерений через интерфейс командной строки (CLI) | ✅ | ✅ |
| Запрос метаданных измерений, сущностей и метрик через CLI | ✅ | ✅ |
| Запрос метрик и измерений через семантические API (ADBC, GQL) | ❌ | ✅ |
| Подключение к интеграциям с другими системами (Tableau, Hex, Mode, Google Sheets и т.д.) | ❌ | ✅ |
| Создание и выполнение экспортов для сохранения запросов метрик в виде таблиц на вашей платформе данных. | ❌ | ✅ |

## Связанные материалы
- [<Constant name="semantic_layer" /> FAQs](/docs/use-dbt-semantic-layer/sl-faqs)
