---
title: "Мониторинг заданий и оповещений"
id: "monitor-jobs"
description: "Мониторинг заданий в dbt Cloud и настройка оповещений для обеспечения бесперебойной оркестрации и оптимизации преобразований данных"
tags: ["scheduler"]
pagination_next: "docs/deploy/run-visibility"
---

Мониторьте ваши задания в dbt Cloud, чтобы выявлять возможности для улучшения, и настраивайте оповещения, чтобы проактивно уведомлять нужных людей или команды.

Эта часть нашей документации охватывает различные возможности dbt Cloud, которые помогают вам мониторить ваши задания и настраивать оповещения для обеспечения бесперебойной оркестрации, включая:

- [Видимость выполнения](/docs/deploy/run-visibility) &mdash; Просматривайте историю выполнения, чтобы определить, где можно улучшить запланированные задания.
- [Повторное выполнение заданий](/docs/deploy/retry-jobs) &mdash; Повторно запускайте задания с ошибками с начала или с точки сбоя.
- [Уведомления о заданиях](/docs/deploy/job-notifications) &mdash; Получайте уведомления по электронной почте или в Slack, когда выполнение задания успешно, встречает предупреждения, завершается с ошибкой или отменяется.
- [Уведомления о моделях](/docs/deploy/model-notifications) &mdash; Получайте уведомления по электронной почте о любых проблемах, с которыми сталкиваются ваши модели и тесты, как только они возникают при выполнении задания.
- [Вебхуки](/docs/deploy/webhooks) &mdash; Используйте вебхуки для отправки событий о статусах ваших заданий dbt в другие системы.
- [Использование артефактов](/docs/deploy/artifacts) &mdash; dbt Cloud генерирует и сохраняет артефакты для вашего проекта, которые используются для таких функций, как создание документации для вашего проекта и отчетность о свежести ваших источников.
- [Свежесть источников](/docs/deploy/source-freshness) &mdash; Мониторьте управление данными, включая снимки для фиксации свежести ваших источников данных.

Чтобы настроить и добавить плитки здоровья данных для просмотра свежести данных и проверок качества на вашей панели, обратитесь к [плиткам здоровья данных](/docs/collaborate/data-tile).

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="98%" title="Обзор выполнения задания в dbt Cloud, который содержит сводку выполнения, триггер задания, продолжительность выполнения и многое другое."/>

<Lightbox src="/img/docs/dbt-cloud/deployment/run-history.png" width="95%" title="Панель истории выполнения позволяет мониторить состояние вашего проекта dbt и отображает задания, статус заданий, окружение, время выполнения и многое другое."/>

<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.gif" width="85%" title="Доступ к логам шагов выполнения" />

</DocCarousel>