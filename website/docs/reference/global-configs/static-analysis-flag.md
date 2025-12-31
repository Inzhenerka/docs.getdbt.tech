---
title: "Статический анализ"
id: "static-analysis-flag"
description: "Используйте флаг --static-analysis, чтобы переопределить поведение static_analysis на уровне модели для одного запуска."
sidebar: "Статический анализ"
---

Используйте флаг `--static-analysis`, чтобы переопределить поведение `static_analysis`, заданное на уровне модели, для одного запуска. Этот флаг применяется **только** к <Constant name="fusion_engine" />; для <Constant name="core" /> он игнорируется.

Значения:

- `off`: Отключить статический анализ для всех моделей в текущем запуске.
- `unsafe`: Использовать Just-in-time (JIT) статический анализ для всех моделей в текущем запуске.

Если флаг не задан, Fusion использует значения по умолчанию: Ahead-of-time (AOT) статический анализ (`on`) для подходящих моделей и JIT (`unsafe`) для интроспективных веток. Подробнее см. в разделе [Configuring `static_analysis`](/docs/fusion/new-concepts#configuring-static_analysis).

<File name='Usage'>

```shell
dbt run --static-analysis off
dbt run --static-analysis unsafe
```

</File>

## Связанные материалы {#related-docs}

Также ознакомьтесь со страницами про [`static_analysis` (resource config)](/reference/resource-configs/static-analysis) на уровне модели и [About flags](/reference/global-configs/about-global-configs) для получения дополнительных сведений.
