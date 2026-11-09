---
title: "Доступные интеграции"
id: avail-sl-integrations
description: "Откройте для себя разнообразный спектр партнеров, которые бесшовно интегрируются с мощным семантическим слоем dbt, позволяя вам выполнять запросы и извлекать ценные инсайты из вашей экосистемы данных."
tags: [Semantic Layer]
sidebar_label: "Доступные интеграции"
hide_table_of_contents: true
meta:
  api_name: dbt Semantic Layer APIs
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

# Доступные интеграции

Множество приложений для работы с данными легко интегрируются с <Constant name="semantic_layer" />, работающим на базе MetricFlow: от инструментов бизнес-аналитики (таких как [dbt Charts](https://dbtcharts.com/)) до блокнотов, электронных таблиц, каталогов данных и многого другого. Эти интеграции позволяют выполнять запросы и получать ценные аналитические сведения из вашей экосистемы данных.

Используйте [API <Constant name="semantic_layer" />](/docs/dbt-apis/sl-api-overview), чтобы упростить запросы к метрикам, оптимизировать процесс разработки и сократить объём кода. Этот подход также обеспечивает управление данными и их согласованность для потребителей данных.

import AvailIntegrations from '/snippets/_sl-partner-links.md';

<AvailIntegrations/>

### Пользовательская интеграция {#custom-integration}

- Все инструменты BI могут использовать [экспорт](/docs/use-dbt-semantic-layer/exports) с <Constant name="semantic_layer" />, даже если у них нет встроенной интеграции.
- [Используйте метрики](/docs/use-dbt-semantic-layer/consume-metrics) и разрабатывайте собственные интеграции на разных языках и с помощью различных инструментов, используя API [JDBC](/docs/dbt-apis/sl-jdbc), ADBC и [GraphQL](/docs/dbt-apis/sl-graphql), а также [библиотеку Python SDK](/docs/dbt-apis/sl-python). Подробнее см. в [наших примерах на GitHub](https://github.com/dbt-labs/example-semantic-layer-clients/).
- Подключайтесь к любому инструменту, который поддерживает SQL-запросы. Такой инструмент должен соответствовать одному из двух критериев:
    - Предоставлять возможность использования универсального драйвера JDBC (например, DataGrip) или
    - Быть совместимым с драйвером Arrow Flight SQL JDBC версии 12.0.0 или выше.

## Связанные документы {#related-docs}

- [Краткое руководство по началу работы с <Constant name="semantic_layer" />](/guides/sl-qs)
- <span><a href="https://docs.getdbt.com/docs/dbt-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span> — узнайте, как интегрировать метрики и выполнять запросы к ним в инструментах, использующих эти данные.
- [Синтаксис запросов к API <Constant name="semantic_layer" />](/docs/dbt-apis/sl-jdbc#querying-the-api-for-metric-metadata) 
- [Ячейки <Constant name="semantic_layer" /> в Hex](https://learn.hex.tech/docs/explore-data/cells/data-cells/dbt-metrics-cells) — настройте SQL-ячейки в Hex.
- [Устранение ошибки 'Failed APN'](/faqs/Troubleshooting/sl-alpn-error) при подключении к <Constant name="semantic_layer" />.
- [Курс по <Constant name="semantic_layer" /> для самостоятельного изучения](https://learn.getdbt.com/courses/semantic-layer)
- [Часто задаваемые вопросы о <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs)
