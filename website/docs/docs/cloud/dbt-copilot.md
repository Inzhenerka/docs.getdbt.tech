---
title: "О dbt Copilot"
sidebar_label: "О dbt Copilot"
description: "dbt Copilot — это мощный ассистент на базе ИИ, предназначенный для ускорения аналитических рабочих процессов на протяжении всего ADLC."
pagination_next: "docs/cloud/enable-dbt-copilot"
keywords: ["dbt Copilot", "dbt", "AI", "AI-powered", "dbt"]
---

# О dbt Copilot <Lifecycle status="self_service,managed,managed_plus" /> {#about-dbt-copilot}

<IntroText>
<Constant name="copilot" /> — это мощный AI‑ассистент, полностью интегрированный в работу с <Constant name="cloud" /> и предназначенный для ускорения ваших аналитических процессов.

</IntroText>

<Constant name="copilot" /> встраивает AI‑поддержку на каждом этапе [жизненного цикла разработки аналитики (Analytics Development Life Cycle, ADLC)](https://www.getdbt.com/resources/guides/the-analytics-development-lifecycle) и использует богатые метаданные — фиксируя связи, lineage и контекст &mdash; чтобы вы могли быстро создавать качественные и надёжные data‑продукты.

Благодаря автоматической генерации кода и использованию запросов на естественном языке, <Constant name="copilot" /> может [генерировать код](/docs/cloud/use-dbt-copilot), [документацию](/docs/build/documentation), [data tests](/docs/build/data-tests), [метрики](/docs/build/metrics-overview) и [семантические модели](/docs/build/semantic-models) — буквально по нажатию кнопки — в [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-copilot), [<Constant name="visual_editor" />](/docs/cloud/build-canvas-copilot) и на странице [<Constant name="query_page" />](/docs/explore/dbt-insights).

:::tip
<Constant name="copilot" /> доступен в тарифах Starter, Enterprise и Enterprise+. [Запишитесь на демо](https://www.getdbt.com/contact), чтобы увидеть, как разработка с использованием AI может упростить и ускорить ваш рабочий процесс.
:::

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-copilot-doc.gif" width="100%" title="Пример использования dbt Copilot для генерации документации в IDE" />

## Как работает dbt Copilot {#how-dbt-copilot-works}

<Constant name="copilot" /> повышает эффективность за счёт автоматизации повторяющихся задач, одновременно обеспечивая конфиденциальность и безопасность данных. Он работает следующим образом:

- Доступ к <Constant name="copilot" /> осуществляется через:
  - [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-copilot) — для генерации документации, тестов и семантических моделей.
  - [<Constant name="visual_editor" /> ](/docs/cloud/build-canvas-copilot) — для генерации SQL-кода с использованием запросов на естественном языке. <Lifecycle status="managed,managed_plus" /> 
  - [<Constant name="query_page" />](/docs/explore/dbt-insights) — для генерации SQL-запросов для аналитики с использованием запросов на естественном языке. <Lifecycle status="managed,managed_plus" /> 
- <Constant name="copilot" /> собирает метаданные (например, имена колонок, SQL моделей, документацию), но никогда не получает доступ к данным хранилища на уровне строк.
- Метаданные и пользовательские запросы отправляются провайдеру ИИ (в данном случае OpenAI) через API-вызовы для обработки.
- Сгенерированный ИИ контент возвращается в <Constant name="cloud" />, где вы можете просмотреть его, отредактировать и сохранить в файлах проекта.
- <Constant name="copilot" /> не использует данные хранилища для обучения ИИ-моделей.
- На системах dbt Labs не сохраняются чувствительные данные, за исключением данных об использовании.
- Клиентские данные, включая любые персональные или чувствительные данные, добавленные пользователем в запрос, удаляются OpenAI в течение 30 дней.
- <Constant name="copilot" /> использует руководство по лучшим практикам оформления, чтобы обеспечить единообразие между командами.

:::tip
<Constant name="copilot" /> ускоряет работу, но не заменяет аналитического инженера. Он помогает быстрее создавать более качественные дата-продукты, однако всегда проверяйте контент, сгенерированный ИИ, так как он может содержать ошибки.
:::
