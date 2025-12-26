---
title: What data tests should I add to my project?
description: "Recommended data tests for project"
sidebar_label: 'Recommended data tests for project'
id: recommended-tests

---
Мы рекомендуем, чтобы у каждой модели был data test на <Term id="primary-key" />, то есть на колонку, которая является `unique` и `not_null`.

Мы также рекомендуем тестировать любые предположения о ваших исходных данных. Например, если вы считаете, что ваши платежи могут быть только одним из трех методов оплаты, вы должны регулярно проверять это предположение — новый метод оплаты может привести к логическим ошибкам в вашем SQL.

В продвинутых проектах dbt мы рекомендуем использовать [sources](/docs/build/sources) и запускать эти тесты целостности данных источника против источников, а не моделей.