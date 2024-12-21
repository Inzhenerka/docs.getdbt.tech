---
title: "Развертывание ваших метрик"
id: deploy-sl
description: "Разверните Семантический слой dbt в dbt Cloud, запустив задачу для материализации ваших метрик."
sidebar_label: "Развертывание ваших метрик"
tags: [Semantic Layer]
pagination_next: "docs/use-dbt-semantic-layer/exports"
---

import RunProdJob from '/snippets/_sl-run-prod-job.md';

<RunProdJob/>

## Следующие шаги
После того как вы выполнили задачу и развернули Семантический слой:
- [Настройте ваш Семантический слой](/docs/use-dbt-semantic-layer/setup-sl) в dbt Cloud.
- Ознакомьтесь с [доступными интеграциями](/docs/cloud-integrations/avail-sl-integrations), такими как Tableau, Google Sheets, Microsoft Excel и другими.
- Начните выполнять запросы к вашим метрикам с помощью [синтаксиса API-запросов](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata).

## Связанные документы
- [Оптимизируйте производительность запросов](/docs/use-dbt-semantic-layer/sl-cache) с помощью декларативного кэширования.
- [Проверяйте семантические узлы в CI](/docs/deploy/ci-jobs#semantic-validations-in-ci), чтобы убедиться, что изменения в коде dbt-моделей не нарушают эти метрики.
- Если вы еще этого не сделали, узнайте, как [создавать ваши метрики и семантические модели](/docs/build/build-metrics-intro) в вашем предпочитаемом инструменте разработки.