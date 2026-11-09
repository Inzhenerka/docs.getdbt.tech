---
title: "Развертывание ваших метрик"
id: deploy-sl
description: "Разверните семантический слой dbt в dbt, запустив задачу для материализации ваших метрик."
sidebar_label: "Разверните метрики"
tags: [Semantic Layer]
pagination_next: "docs/use-dbt-semantic-layer/exports"
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

# Разверните свои метрики

<!-- Приведённый ниже фрагмент можно найти в следующих расположениях файлов в репозитории кода документации:

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-run-prod-job.md
-->
import RunProdJob from '/snippets/_sl-run-prod-job.md';

<RunProdJob/>

## Следующие шаги
После того как вы выполнили задание и развернули <Constant name="semantic_layer" />:
- [Настройте <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) в <Constant name="dbt" />.
- Ознакомьтесь с [доступными интеграциями](/docs/platform-integrations/avail-sl-integrations), такими как Tableau, Google Sheets, Microsoft Excel и другими.
- Начните запрашивать метрики, используя [синтаксис запросов API](/docs/dbt-apis/sl-jdbc#querying-the-api-for-metric-metadata).

## Связанные документы {#related-docs}
- [Оптимизируйте производительность запросов](/docs/use-dbt-semantic-layer/sl-cache) с помощью декларативного кэширования.
- [Проверяйте семантические узлы в CI](/docs/deploy/ci-jobs#semantic-validations-in-ci), чтобы убедиться, что изменения в коде dbt-моделей не нарушают эти метрики.
- Если вы еще этого не сделали, узнайте, как [создавать ваши метрики и семантические модели](/docs/build/build-metrics-intro) в вашем предпочитаемом инструменте разработки.