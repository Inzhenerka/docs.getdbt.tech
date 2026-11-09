---
title: Какую версию Python можно использовать?
description: "Версии Python, поддерживаемые в dbt v1"
sidebar_label: 'Версия Python'
id: install-python-compatibility
---

import Pythonmatrix from '/snippets/_python-compatibility-matrix.md';

Используйте эту таблицу, чтобы сопоставить версии <Constant name="core" /> с совместимыми версиями Python. В новых [минорных версиях dbt](/docs/dbt-versions#how-dbt-v1-uses-semantic-versioning) будет добавляться поддержка новых минорных версий Python3, когда все зависимости смогут их поддерживать. Кроме того, в минорных версиях dbt будет прекращаться поддержка старых минорных версий Python3 до [окончания их жизненного цикла](https://endoflife.date/python).

<Pythonmatrix/>

Адаптерные плагины и их зависимости не всегда совместимы с последней версией Python.

Обратите внимание, что это не следует путать с [Python-моделями dbt](/docs/build/python-models#configuring-python-models). Если вы используете платформу данных, которая поддерживает Snowpark, используйте конфигурацию `python_version`, чтобы запускать модель Snowpark с версиями Python [3.9, 3.10 или 3.11](https://docs.snowflake.com/en/developer-guide/snowpark/python/setup).
