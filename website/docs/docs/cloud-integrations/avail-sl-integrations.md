---
title: "Доступные интеграции"
id: avail-sl-integrations
description: "Откройте для себя разнообразный спектр партнеров, которые бесшовно интегрируются с мощным семантическим слоем dbt, позволяя вам выполнять запросы и извлекать ценные инсайты из вашей экосистемы данных."
tags: [Semantic Layer]
sidebar_label: "Доступные интеграции"
hide_table_of_contents: true
meta:
  api_name: dbt Semantic Layer APIs
---

Существует множество приложений для работы с данными, которые бесшовно интегрируются с семантическим слоем dbt, работающим на базе MetricFlow, от инструментов бизнес-аналитики до ноутбуков, электронных таблиц, каталогов данных и многого другого. Эти интеграции позволяют вам выполнять запросы и извлекать ценные инсайты из вашей экосистемы данных.

Используйте [API семантического слоя dbt](/docs/dbt-cloud-apis/sl-api-overview) для упрощения запросов к метрикам, оптимизации вашего рабочего процесса разработки и уменьшения объема кодирования. Этот подход также обеспечивает управление данными и их согласованность для потребителей данных.

import AvailIntegrations from '/snippets/_sl-partner-links.md';

<AvailIntegrations/>

### Пользовательская интеграция

- [Экспорты](/docs/use-dbt-semantic-layer/exports) позволяют настраивать интеграцию с дополнительными инструментами, которые не подключаются к семантическому слою dbt напрямую, такими как PowerBI.
- [Потребляйте метрики](/docs/use-dbt-semantic-layer/consume-metrics) и разрабатывайте пользовательские интеграции, используя различные языки и инструменты, поддерживаемые через [JDBC](/docs/dbt-cloud-apis/sl-jdbc), ADBC и [GraphQL](/docs/dbt-cloud-apis/sl-graphql) API, а также [библиотеку Python SDK](/docs/dbt-cloud-apis/sl-python). Для получения дополнительной информации ознакомьтесь с [нашими примерами на GitHub](https://github.com/dbt-labs/example-semantic-layer-clients/).
- Подключайтесь к любому инструменту, который поддерживает SQL-запросы. Эти инструменты должны соответствовать одному из двух критериев:
    - Предлагает опцию универсального драйвера JDBC (например, DataGrip) или
    - Совместим с драйвером Arrow Flight SQL JDBC версии 12.0.0 или выше.

## Связанные документы

- <span><a href="https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span>, чтобы узнать, как интегрировать и выполнять запросы к вашим метрикам в последующих инструментах.
- [Синтаксис запросов API семантического слоя dbt](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) 
- [Ячейки семантического слоя dbt в Hex](https://learn.hex.tech/docs/explore-data/cells/data-cells/dbt-metrics-cells) для настройки SQL-ячеек в Hex.
- [Решение ошибки 'Failed APN'](/faqs/Troubleshooting/sl-alpn-error) при подключении к семантическому слою dbt.
- [Курс по семантическому слою dbt по требованию](https://learn.getdbt.com/courses/semantic-layer)
- [Часто задаваемые вопросы о семантическом слое dbt](/docs/use-dbt-semantic-layer/sl-faqs)