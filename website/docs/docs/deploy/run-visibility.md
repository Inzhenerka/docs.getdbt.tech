---
title: "Видимость выполнения"
description: "Мониторинг ваших заданий для улучшения производительности."
tags: ["scheduler"]
---

Вы можете просматривать историю выполнения и панель времени моделей, чтобы определить, где можно улучшить задания.

## История выполнения

Панель **История выполнения** в dbt Cloud помогает вам следить за состоянием вашего проекта dbt. Она предоставляет детальный обзор всех запусков заданий вашего проекта и предлагает различные фильтры, которые позволяют сосредоточиться на конкретных аспектах. Вы также можете использовать её для просмотра недавних запусков, поиска ошибок и отслеживания прогресса выполняющихся заданий. Доступ к ней можно получить из верхнего меню навигации, нажав **Deploy**, а затем **Run history**.

Панель отображает полную историю выполнения, включая название задания, статус, связанное окружение, триггер задания, commit SHA, схему и информацию о времени.

Разработчики dbt Cloud могут получить доступ к своей истории выполнения за последние 365 дней через пользовательский интерфейс (UI) и API dbt Cloud.

dbt Labs ограничивает самостоятельное извлечение метаданных истории выполнения до 365 дней для улучшения производительности dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/deployment/run-history.png" width="85%" title="Панель истории выполнения позволяет следить за состоянием вашего проекта dbt и отображает задания, статус заданий, окружение, время и многое другое."/>

## Детали выполнения задания

На панели **История выполнения** выберите выполнение, чтобы просмотреть полные детали о нём. Страница деталей выполнения задания отображает триггер задания, commit SHA, время, проведенное в очереди планировщика, все шаги выполнения и их [логи](#access-logs), [время моделей](#model-timing) и многое другое.

Нажмите **Rerun now**, чтобы немедленно перезапустить задание.

Пример завершенного выполнения с конфигурацией для [триггера завершения задания](/docs/deploy/deploy-jobs#trigger-on-job-completion):

<Lightbox src="/img/docs/dbt-cloud/deployment/example-job-details.png" width="65%" title="Пример деталей выполнения" />

### Вкладка сводки выполнения

Вы можете просматривать или загружать логи в процессе выполнения и исторические логи для ваших запусков dbt. Это облегчает команде более эффективное устранение ошибок.

<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.png" width="85%" title="Доступ к логам шагов выполнения" />

### Вкладка родословной

Просматривайте граф родословной, связанный с выполнением задания, чтобы лучше понять зависимости и отношения ресурсов в вашем проекте. Чтобы просмотреть метаданные узла непосредственно в [dbt Explorer](/docs/collaborate/explore-projects), выберите его (двойной клик) на графе.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-lineage.gif" width="85%" title="Пример доступа к dbt Explorer из вкладки родословной" />

### Вкладка времени моделей <Lifecycle status="team,enterprise" />

Вкладка **Время моделей** отображает состав, порядок и время, которое каждая модель занимает в выполнении задания. Визуализация появляется для успешных заданий и выделяет верхние 1% по длительности моделей. Это помогает выявить узкие места в ваших запусках, чтобы вы могли их исследовать и, возможно, внести изменения для улучшения их производительности.

Вы можете найти панель на [странице деталей выполнения задания](#job-run-details).

<Lightbox src="/img/docs/dbt-cloud/model-timing.png" width="85%" title="Вкладка времени моделей отображает верхние 1% по длительности моделей и визуализирует узкие места моделей" />

### Вкладка артефактов

Эта вкладка предоставляет список артефактов, созданных в результате выполнения задания. Файлы сохраняются и доступны для загрузки.

<Lightbox src="/img/docs/dbt-cloud/example-artifacts-tab.png" width="85%" title="Пример вкладки артефактов" />

### Вкладка сравнения <Lifecycle status="enterprise" />

Вкладка **Сравнение** отображается для [запусков CI заданий](/docs/deploy/ci-jobs) с включенной настройкой **Run compare changes**. Она отображает детали о [изменениях, выявленных dbt при сравнении](/docs/deploy/advanced-ci#compare-changes) между тем, что находится в вашей производственной среде, и pull request. Чтобы лучше визуализировать различия, dbt Cloud выделяет изменения в ваших моделях красным (удаления) и зеленым (вставки).

В разделе **Modified** вы можете просмотреть следующее:

- **Обзор** &mdash; Общая сводка об изменениях в моделях, таких как количество добавленных или удаленных первичных ключей.
- **Первичные ключи** &mdash; Подробности об изменениях в записях.
- **Измененные строки** &mdash; Подробности об измененных строках. Нажмите **Show full preview**, чтобы отобразить все столбцы.
- **Столбцы** &mdash; Подробности об изменениях в столбцах.

Чтобы более подробно просмотреть зависимости и отношения ресурсов в вашем проекте, нажмите **View in Explorer**, чтобы запустить [dbt Explorer](/docs/collaborate/explore-projects).

<Lightbox src="/img/docs/dbt-cloud/example-ci-compare-changes-tab.png" width="85%" title="Пример вкладки сравнения" />