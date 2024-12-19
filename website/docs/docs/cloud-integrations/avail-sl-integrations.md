---
title: "Доступные интеграции"
id: avail-sl-integrations
description: "Откройте для себя разнообразие партнеров, которые бесшовно интегрируются с мощным семантическим слоем dbt, позволяя вам запрашивать и извлекать ценные инсайты из вашей экосистемы данных."
tags: [Семантический слой]
sidebar_label: "Доступные интеграции"
hide_table_of_contents: true
meta:
  api_name: API семантического слоя dbt
---

Существует множество приложений для работы с данными, которые бесшовно интегрируются с семантическим слоем dbt, поддерживаемым MetricFlow, от инструментов бизнес-аналитики до ноутбуков, электронных таблиц, каталогов данных и многого другого. Эти интеграции позволяют вам запрашивать и извлекать ценные инсайты из вашей экосистемы данных.

Используйте [API семантического слоя dbt](/docs/dbt-cloud-apis/sl-api-overview), чтобы упростить запросы метрик, оптимизировать ваш рабочий процесс разработки и сократить объем кода. Этот подход также обеспечивает управление данными и согласованность для потребителей данных.

import AvailIntegrations from '/snippets/_sl-partner-links.md';

<AvailIntegrations/>

### Пользовательская интеграция

- [Экспорты](/docs/use-dbt-semantic-layer/exports) позволяют настраивать интеграцию с дополнительными инструментами, которые не подключаются к семантическому слою dbt по умолчанию, такими как PowerBI.
- [Используйте метрики](/docs/use-dbt-semantic-layer/consume-metrics) и разрабатывайте пользовательские интеграции, используя различные языки и инструменты, поддерживаемые через [JDBC](/docs/dbt-cloud-apis/sl-jdbc), ADBC и [GraphQL](/docs/dbt-cloud-apis/sl-graphql) API, а также [библиотеку Python SDK](/docs/dbt-cloud-apis/sl-python). Для получения дополнительной информации ознакомьтесь с [нашими примерами на GitHub](https://github.com/dbt-labs/example-semantic-layer-clients/).
- Подключайтесь к любому инструменту, который поддерживает SQL-запросы. Эти инструменты должны соответствовать одному из двух критериев:
    - Предлагают общий вариант драйвера JDBC (например, DataGrip) или
    - Совместимы с версией драйвера Arrow Flight SQL JDBC 12.0.0 или выше.

## Связанные документы

- <span><a href="https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span>, чтобы узнать, как интегрировать и запрашивать ваши метрики в downstream-инструментах.
- [Синтаксис запросов API семантического слоя dbt](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) 
- [Ячейки семантического слоя dbt в Hex](https://learn.hex.tech/docs/explore-data/cells/data-cells/dbt-metrics-cells) для настройки SQL-ячейок в Hex.
- [Решение ошибки 'Failed APN'](/faqs/Troubleshooting/sl-alpn-error) при подключении к семантическому слою dbt.
- [Курс по семантическому слою dbt по запросу](https://learn.getdbt.com/courses/semantic-layer)
- [Часто задаваемые вопросы по семантическому слою dbt](/docs/use-dbt-semantic-layer/sl-faqs)