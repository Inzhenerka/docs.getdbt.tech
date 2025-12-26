---
title: Какую версию Python я могу использовать?
description: "Поддерживаемые версии Python с dbt Core"
sidebar_label: 'Версия Python'
id: install-python-compatibility
---

import Pythonmatrix from '/snippets/_python-compatibility-matrix.md';

Используйте эту таблицу, чтобы сопоставить версии <Constant name="core" /> с совместимыми версиями Python. Новые [минорные версии dbt](/docs/dbt-versions/core#minor-versions) будут добавлять поддержку новых минорных версий Python 3, когда все зависимости смогут их поддерживать. Кроме того, минорные версии dbt будут прекращать поддержку старых минорных версий Python 3 до наступления их [окончания жизненного цикла](https://endoflife.date/python).

<Pythonmatrix/>

Адаптерные плагины и их зависимости не всегда совместимы с последней версией Python.

Обратите внимание, что это не следует путать с [Python-моделями dbt](/docs/build/python-models#specific-data-platforms). Если вы используете платформу данных, которая поддерживает Snowpark, используйте конфигурацию `python_version`, чтобы запускать модель Snowpark с версиями Python [3.9, 3.10 или 3.11](https://docs.snowflake.com/en/developer-guide/snowpark/python/setup).
