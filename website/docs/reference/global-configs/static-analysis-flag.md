---
title: "Статический анализ"
id: "static-analysis-flag"
description: "Используйте флаг --static-analysis, чтобы переопределить поведение static_analysis на уровне модели для одного запуска."
sidebar: "Статический анализ"
---

Используйте флаг `--static-analysis`, чтобы переопределить поведение `static_analysis`, заданное на уровне модели, для одного запуска. Этот флаг применяется только к <Constant name="fusion_engine" />; <Constant name="core" /> его игнорирует.

Значения:

- `baseline` (по умолчанию): выполнять статический анализ SQL для всех моделей в рамках запуска. Это рекомендуемый начальный режим для пользователей, переходящих с <Constant name="core" />.
- `strict`: выполнять статический анализ всего SQL до начала выполнения. Обеспечивает максимальные гарантии проверки &mdash; выполнение не начнётся, пока не будет подтверждена корректность всего проекта.
- `off`: отключить статический анализ для всех моделей в рамках запуска.

Если параметр не задан, <Constant name="fusion" /> по умолчанию использует режим `baseline`, который обеспечивает плавный переход с <Constant name="core" />, при этом выявляя большинство ошибок SQL. Подробнее о постепенном переходе к более строгому анализу см. в разделе [Настройка `static_analysis`](/docs/build/about-static-analysis#configuring-static_analysis).

<File name='Usage'>

```shell
dbt run --static-analysis strict
dbt run --static-analysis baseline
dbt run --static-analysis off
```

</File>

## Связанные материалы {#related-docs}

- [`static_analysis` (конфигурация ресурса)](/reference/resource-configs/static-analysis)
- [О флагах](/reference/global-configs/about-global-configs)
- [Оптимизация статического анализа для разработки и развертывания](/best-practices/optimize-static-analysis-for-development-and-deployment)
