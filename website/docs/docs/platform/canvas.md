--- 
title: "О dbt Canvas"
id: canvas      
sidebar_label: "О dbt Canvas"
description: "dbt Canvas позволяет быстро создавать и визуализировать dbt‑модели с помощью визуального drag‑and‑drop интерфейса прямо в dbt."
pagination_next: "docs/platform/canvas-interface"
pagination_prev: null
image: /img/docs/dbt-platform/canvas/canvas.png
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

import Prerequisites from '/snippets/_canvas-prerequisites.md';

# О Canvas {#about-canvas}

<div style={{ color: '#717d7d', fontSize: '1.1em' }}>
<Constant name="canvas" /> позволяет быстро получать и преобразовывать данные в визуальном редакторе с поддержкой перетаскивания.
</div>

<Constant name="canvas" /> сохраняет преимущества разработки с кодом, включая точность, простоту отладки и проверки. При этом участники могут работать в привычной среде. Для запросов на естественном языке и задач с ИИ используйте [dbt Copilot в <Constant name="canvas" />](/docs/platform/build-canvas-copilot).

Эти модели компилируются напрямую в SQL и неотличимы от других dbt-моделей в ваших проектах:
- Визуальные модели находятся под версионным контролем в вашем провайдере <Constant name="git" />.
- Все модели доступны между проектами в рамках [<Constant name="mesh" />](/best-practices/how-we-mesh/mesh-1-intro).
- Модели могут быть материализованы в продакшене с помощью [оркестрации <Constant name="dbt" />](/docs/deploy/deployments) или собраны напрямую в схеме разработки пользователя.
- Интеграция с [<Constant name="catalog" />](/docs/explore/explore-projects) и [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio).

<Lightbox src="/img/docs/dbt-platform/canvas/canvas.png" width="90%" title="Создание и редактирование моделей dbt в визуальном редакторе Canvas с поддержкой перетаскивания" />

<Prerequisites feature={'/snippets/_canvas-prerequisites.md'} />

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';

<CopilotWizardDifferences/>

## Обратная связь {#feedback}

Обратите внимание: всегда проверяйте код и контент, сгенерированные ИИ, так как они могут содержать ошибки или некорректные результаты.

Чтобы оставить обратную связь, пожалуйста, свяжитесь с вашей аккаунт-командой dbt Labs. Мы ценим ваши отзывы и предложения и используем их для улучшения <Constant name="canvas" />.

## Ресурсы {#resources}

Подробнее о <Constant name="canvas" />:

- Как [работать с <Constant name="canvas" />](/docs/platform/use-canvas)
- [Краткое руководство по <Constant name="canvas" />](/guides/canvas)
- [Курс по основам <Constant name="canvas" />](https://learn.getdbt.com/learn/course/canvas-fundamentals) на [dbt Learn](https://learn.getdbt.com/catalog)
