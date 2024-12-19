---
title: "Развертывание ваших метрик"
id: deploy-sl
description: "Разверните Семантический уровень dbt в dbt Cloud, запустив задачу для материализации ваших метрик."
sidebar_label: "Развертывание ваших метрик"
tags: [Семантический уровень]
pagination_next: "docs/use-dbt-semantic-layer/exports"
---

<!-- Ниже приведенный фрагмент можно найти в следующих файлах в репозитории документации) 

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-run-prod-job.md
-->

import RunProdJob from '/snippets/_sl-run-prod-job.md';

<RunProdJob/>

## Следующие шаги
После того как вы выполнили задачу и развернули свой Семантический уровень:
- [Настройте свой Семантический уровень](/docs/use-dbt-semantic-layer/setup-sl) в dbt Cloud.
- Ознакомьтесь с [доступными интеграциями](/docs/cloud-integrations/avail-sl-integrations), такими как Tableau, Google Sheets, Microsoft Excel и другими.
- Начните запрашивать ваши метрики с помощью [синтаксиса запросов API](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata).

## Связанные документы
- [Оптимизируйте производительность запросов](/docs/use-dbt-semantic-layer/sl-cache) с помощью декларативного кэширования.
- [Проверяйте семантические узлы в CI](/docs/deploy/ci-jobs#semantic-validations-in-ci), чтобы убедиться, что изменения кода, внесенные в модели dbt, не нарушают эти метрики.
- Если вы еще не сделали этого, узнайте, как [создавать ваши метрики и семантические модели](/docs/build/build-metrics-intro) в вашем инструменте разработки по выбору.