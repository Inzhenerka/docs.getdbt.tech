---
title: "Поддерживаемые функции Snowflake в dbt v2"
sidebar_label: "Функции Snowflake в dbt v2"
id: "snowflake-function-support"
description: "Узнайте, для каких встроенных SQL-функций Snowflake dbt v2 поддерживает проверку типов при статическом анализе."
tags: ['Snowflake', 'dbt v2', 'static_analysis']
---

import SnowflakeFunctionsTable from '/snippets/_functions-table-snowflake.md';


<Constant name="fusion"/> может проверять соответствие аргументов функций Snowflake ожидаемым типам непосредственно в <Constant name="dbt_platform"/>, в CLI или с помощью расширения dbt для VS Code. Чтобы включить эту возможность, задайте [`static_analysis: strict`](/docs/build/about-static-analysis?version=2.0) в конфигурации проекта.

В следующей таблице перечислены _все_ встроенные функции Snowflake и статус поддержки проверки типов для каждой из них. Используйте поиск и фильтры таблицы, чтобы найти нужные функции.

:::info Обновляется еженедельно
Эта таблица еженедельно обновляется на основе [справочника SQL-функций Snowflake](https://docs.snowflake.com/en/sql-reference/functions-all), а затем сверяется со списком функций, поддерживаемых <Constant name="fusion"/>. Если вы заметите несоответствие, будем рады вашему участию — [создайте issue](https://github.com/dbt-labs/dbt/issues) в репозитории <Constant name="core" />!
:::

<SnowflakeFunctionsTable />
