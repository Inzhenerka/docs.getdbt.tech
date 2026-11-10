---
title: "Поддерживаемые функции BigQuery в dbt v2"
sidebar_label: "Функции BigQuery в dbt v2"
id: "bigquery-function-support"
description: "Узнайте, для каких встроенных SQL-функций BigQuery dbt v2 может проверять типы при статическом анализе."
tags: ['BigQuery', 'dbt v2', 'static_analysis']
---

import BigQueryFunctionsTable from '/snippets/_functions-table-bigquery.md';


<Constant name="fusion"/> может проверять соответствие аргументов функций BigQuery ожидаемым типам непосредственно в <Constant name="dbt_platform"/>, в CLI или с помощью расширения dbt для VS Code. Чтобы включить эту возможность, задайте [`static_analysis: strict`](/docs/build/about-static-analysis?version=2.0) в конфигурации проекта.

В следующей таблице перечислены _все_ встроенные функции BigQuery и статус поддержки проверки типов для каждой из них. Используйте поиск и фильтры таблицы, чтобы найти нужные функции.

:::info Обновляется еженедельно
Эта таблица еженедельно обновляется на основе [справочника по SQL-функциям BigQuery](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/functions-all) и сверяется со списком функций, поддерживаемых <Constant name="fusion"/>. Если вы заметите несоответствие, будем рады вашему вкладу — [создайте issue](https://github.com/dbt-labs/dbt/issues) в репозитории <Constant name="core" />!
:::

<BigQueryFunctionsTable />
