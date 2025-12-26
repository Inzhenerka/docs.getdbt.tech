---
title: "Использование потоков"
id: "using-threads"
sidebar_label: "Использование потоков"
description: "Понять, что такое потоки и как их использовать."
pagination_next: null
---
Когда dbt выполняется, он создает направленный ациклический граф (DAG) связей между моделями. Количество потоков представляет собой максимальное число путей в графе, над которыми dbt может работать одновременно — увеличение числа потоков может сократить время выполнения вашего проекта.

Например, если вы укажете `threads: 1`, dbt начнет строить только одну модель и завершит ее, прежде чем перейти к следующей. Указание `threads: 8` означает, что dbt будет работать с _до_ 8 моделями одновременно, не нарушая зависимостей – фактическое количество моделей, над которыми он может работать, вероятно, будет ограничено доступными путями через граф зависимостей.

Жёсткого ограничения на максимальное количество потоков, которое вы можете задать, не существует — в целом увеличение числа потоков сокращает время выполнения, однако при этом важно учитывать несколько факторов:

- Увеличение количества потоков повышает нагрузку на ваш data warehouse, что может повлиять на другие инструменты в вашем data stack. Например, если ваш BI‑инструмент использует те же вычислительные ресурсы, что и dbt, его запросы могут становиться в очередь во время выполнения dbt.
- Количество параллельных запросов, которые ваша база данных позволяет выполнять одновременно, также может быть ограничивающим фактором для числа моделей, которые могут собираться параллельно — некоторые модели могут ожидать в очереди освобождения доступного слота для запроса.

В общем, оптимальное количество потоков зависит от вашего хранилища данных и его конфигурации. Лучше всего протестировать разные значения, чтобы найти оптимальное количество потоков для вашего проекта. Мы рекомендуем начать с установки этого значения на 4.

Вы можете использовать другое количество потоков, чем значение, определенное в вашей цели, с помощью опции `--threads` при выполнении команды dbt.

Вы будете задавать количество потоков в файле `profiles.yml` (при локальной разработке с использованием dbt Core и движка dbt Fusion), в определении задания <Constant name="cloud" />, а также в учётных данных для разработки <Constant name="cloud" /> в рамках вашего профиля.

<VersionBlock firstVersion="1.12">
<!-- versioning for 1.12 so it shows up in Latest eventually we might want to firstVersion="2.0"-->

## Fusion engine thread optimization

The <Constant name="fusion_engine" /> handles threading differently than <Constant name="core" />. The legacy `threads` setting doesn't act as a strict limit on the number of threads created. Instead, Fusion manages parallelism dynamically based on the selected warehouse.

### Redshift

In Redshift, the `threads` setting limits the number of queries or statements that can run in parallel. This behavior is the same as <Constant name="core" />, and is important for managing Redshift's concurrency limits and query queue behavior.

### Other warehouses

In other warehouses, Fusion dynamically optimizes thread usage based on the DAG and warehouse concurrency properties.

For more information about Fusion's approach to parallelism, refer to [the dbt Fusion engine](/docs/fusion) page.

</VersionBlock>

## Связанные документы
- [О файле profiles.yml](/docs/core/connect-data-platform/profiles.yml)
- [Планировщик заданий <Constant name="cloud" />](/docs/deploy/job-scheduler)
