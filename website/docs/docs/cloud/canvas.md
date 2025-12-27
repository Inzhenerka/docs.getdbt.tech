---
title: "О dbt Canvas"
id: canvas
sidebar_label: "О dbt Canvas"
description: "dbt Canvas позволяет быстро создавать и визуализировать dbt‑модели с помощью визуального drag‑and‑drop интерфейса прямо в dbt."
pagination_next: "docs/cloud/canvas-interface"
pagination_prev: null
image: /img/docs/dbt-cloud/canvas/canvas.png
---

import Prerequisites from '/snippets/_canvas-prerequisites.md';

# О Canvas <Lifecycle status='managed,managed_plus'/> 

<p style={{ color: '#717d7d', fontSize: '1.1em' }}>
<Constant name="visual_editor" /> помогает быстро получать доступ к данным и трансформировать их с помощью визуального интерфейса drag-and-drop, а также встроенного ИИ для генерации пользовательского кода.
</p>

<Constant name="visual_editor" /> позволяет организациям получать все преимущества разработки, основанной на коде, — такие как повышенная точность, удобство отладки и простота валидации — при этом сохраняя гибкость и позволяя разным участникам работать в тех инструментах и форматах, которые им наиболее удобны. Пользователи также могут воспользоваться встроенным ИИ для генерации пользовательского кода, что делает процесс разработки сквозным и практически без трения.

Эти модели компилируются напрямую в SQL и неотличимы от других dbt-моделей в ваших проектах:

- Визуальные модели находятся под версионным контролем в вашем провайдере <Constant name="git" />.
- Все модели доступны между проектами в рамках [<Constant name="mesh" />](/best-practices/how-we-mesh/mesh-1-intro).
- Модели могут быть материализованы в продакшене с помощью [оркестрации <Constant name="cloud" />](/docs/deploy/deployments) или собраны напрямую в схеме разработки пользователя.
- Возможна интеграция с [<Constant name="explorer" />](/docs/explore/explore-projects) и [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio).

<Lightbox src="/img/docs/dbt-cloud/canvas/canvas.png" width="90%" title="Создавайте или редактируйте dbt-модели с помощью Canvas, позволяя каждому работать с dbt через интерфейс drag-and-drop внутри dbt." />

<Prerequisites feature={'/snippets/_canvas-prerequisites.md'} />

## Обратная связь

Обратите внимание: всегда проверяйте код и контент, сгенерированные ИИ, так как они могут содержать ошибки или некорректные результаты.

Чтобы оставить обратную связь, пожалуйста, свяжитесь с вашей аккаунт-командой dbt Labs. Мы ценим ваши отзывы и предложения и используем их для улучшения <Constant name="visual_editor" />.

## Ресурсы

Узнайте больше о Canvas:

- Как [использовать Canvas](/docs/cloud/use-canvas)
- [Быстрый старт по Canvas](/guides/canvas)
- [Курс Canvas fundamentals](https://learn.getdbt.com/learn/course/canvas-fundamentals) на платформе [dbt Learn](https://learn.getdbt.com/catalog)
