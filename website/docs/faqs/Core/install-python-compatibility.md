---
title: Какую версию Python я могу использовать?
description: "Поддерживаемые версии Python для dbt Core"
sidebar_label: 'Версия Python'
id: install-python-compatibility
---

Используйте эту таблицу, чтобы сопоставить версии dbt-core с их совместимыми версиями Python. Новые [минорные версии dbt](/docs/dbt-versions/core#minor-versions) будут добавлять поддержку новых минорных версий Python3, когда все зависимости смогут это поддерживать. Кроме того, минорные версии dbt будут прекращать поддержку старых минорных версий Python3 до их [конца жизни](https://endoflife.date/python).

<Pythonmatrix/>

Плагины адаптеров и их зависимости не всегда совместимы с последней версией Python. Например, dbt-snowflake v0.19 не совместим с Python 3.9, но версии dbt-snowflake 0.20+ совместимы.