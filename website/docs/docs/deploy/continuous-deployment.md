---
title: "Непрерывное развертывание в dbt Cloud"
sidebar_label: "Непрерывное развертывание"
description: "Узнайте о рабочих процессах непрерывного развертывания (CD)"
---

Чтобы помочь вам улучшить преобразования данных и быстрее выпускать продукты на основе данных, вы можете запускать [merge jobs](/docs/deploy/merge-jobs) для реализации рабочего процесса непрерывного развертывания (CD) в dbt Cloud. Merge jobs могут автоматически собирать измененные модели всякий раз, когда pull request (PR) сливается, гарантируя, что последние изменения кода находятся в продакшене. Вам не нужно ждать следующего запланированного задания, чтобы получить последние обновления.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/cd-workflow.png" width="90%" title="Рабочий процесс непрерывного развертывания в dbt Cloud"/>

Вы также можете реализовать непрерывную интеграцию (CI) в dbt Cloud, что может дополнительно сократить время, необходимое для внесения изменений в продакшен, и улучшить качество кода. Чтобы узнать больше, обратитесь к [Непрерывная интеграция в dbt Cloud](/docs/deploy/continuous-integration).

## Как работают merge jobs

Когда вы настраиваете merge jobs, dbt Cloud отслеживает уведомления от вашего [Git-провайдера](/docs/cloud/git/git-configuration-in-dbt-cloud), указывающие на то, что PR был слит. Когда dbt Cloud получает одно из этих уведомлений, оно ставит в очередь новый запуск merge job.

Вы можете настроить merge jobs для выполнения одного из следующих действий при слиянии PR:

| <div style={{width:'350px'}}>Команда для выполнения</div> | Описание использования |
| -------- | ----------------- | 
| `dbt build --select state:modified+` | (По умолчанию) Собирает измененные данные с каждым слиянием. <br /><br />dbt Cloud собирает только измененные модели данных и все, что находится ниже по потоку, аналогично CI заданиям. Это помогает снизить затраты на вычисления и гарантирует, что последние изменения кода всегда отправляются в продакшен. |
| `dbt compile` | Обновляет примененное состояние для эффективных (наиболее легких) запусков CI заданий. <br /><br />dbt Cloud генерирует исполняемый SQL (из исходной модели, тестов и файлов анализа), но не выполняет его. Это гарантирует, что изменения отражены в манифесте для следующего запуска CI задания и отслеживает только соответствующие изменения. |