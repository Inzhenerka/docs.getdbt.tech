---
title: "Использование dbt Copilot"
sidebar_label: "Использование dbt Copilot"
description: "Используйте dbt Copilot для генерации документации, тестов, семантических моделей и SQL-кода с нуля, сохраняя при этом возможность изменять или исправлять сгенерированный код."
---

import CopilotResources from '/snippets/_use-copilot-resources.md';
import CopilotEditCode from '/snippets/_use-copilot-edit-code.md';
import CopilotVE from '/snippets/_use-copilot-ve.md';

# Использование dbt Copilot <Lifecycle status="self_service,managed,managed_plus" />

<IntroText>
Используйте <Constant name="copilot" />, чтобы генерировать документацию, тесты, семантические модели и код с нуля, сохраняя при этом возможность изменять или исправлять сгенерированный код.
</IntroText>

На этой странице объясняется, как использовать <Constant name="copilot" /> для следующих задач:

- [Генерация ресурсов](#generate-resources) &mdash; Экономьте время, используя кнопку генерации <Constant name="copilot" /> для создания файлов документации, тестов и семантических моделей в процессе разработки в [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio).
- [Генерация и редактирование SQL прямо в редакторе](#generate-and-edit-sql-inline) &mdash; Используйте запросы на естественном языке для генерации SQL-кода с нуля или для редактирования существующего SQL-файла с помощью сочетаний клавиш или выделения кода в [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio).
- [Создание визуальных моделей](#build-visual-models) &mdash; Используйте <Constant name="copilot" /> для генерации моделей в [<Constant name="visual_editor" />](/docs/cloud/use-canvas) с помощью запросов на естественном языке.
- [Построение запросов](#build-queries) &mdash; Используйте <Constant name="copilot" /> для генерации запросов в [<Constant name="query_page" />](/docs/explore/dbt-insights) для исследовательского анализа данных с помощью запросов на естественном языке.
- [Анализ данных с помощью агента Analyst](#analyze-data-with-the-analyst-agent) &mdash; Используйте <Constant name="copilot" /> для анализа данных и получения контекстуализированных результатов в реальном времени, задавая вопросы агенту Analyst на естественном языке.

:::tip
Рекомендуем ознакомиться с нашим [on-demand курсом dbt Copilot](https://learn.getdbt.com/learn/course/dbt-copilot/welcome-to-dbt-copilot/welcome-5-mins), чтобы узнать, как использовать <Constant name="copilot" /> для генерации ресурсов и не только.
:::

## Generate resources

<CopilotResources/>

## Generate and edit SQL inline

<CopilotEditCode/>

## Build visual models

<Constant name="copilot" /> бесшовно интегрируется с [<Constant name="visual_editor" />](/docs/cloud/canvas) — интерфейсом drag-and-drop, который помогает создавать визуальные модели с использованием запросов на естественном языке. Перед началом убедитесь, что у вас есть [доступ к <Constant name="visual_editor" />](/docs/cloud/use-canvas#access-canvas).

<CopilotVE/>

## Build queries

Используйте <Constant name="copilot" /> для построения запросов в [<Constant name="query_page" />](/docs/explore/dbt-insights) с помощью запросов на естественном языке, чтобы удобно исследовать и выполнять запросы к данным через интуитивный интерфейс с богатым контекстом. Перед началом убедитесь, что у вас есть [доступ к <Constant name="query_page" />](/docs/explore/access-dbt-insights).

Чтобы начать создавать SQL-запросы с помощью запросов на естественном языке в <Constant name="query_page" />:

1. Нажмите на иконку **<Constant name="copilot" />** в боковом меню консоли запросов.
2. Нажмите **Generate SQL**.
3. В поле ввода dbt <Constant name="copilot" /> введите запрос на естественном языке, чтобы <Constant name="copilot" /> сгенерировал нужный SQL-запрос. <!--You can also reference existing models using the `@` symbol. For example, to build a model that calculates the total price of orders, you can enter `@orders` in the prompt and it'll pull in and reference the `orders` model.-->
4. Нажмите **↑**, чтобы отправить запрос. <Constant name="copilot" /> сгенерирует краткое описание SQL-запроса, который будет создан. Чтобы очистить поле ввода, нажмите кнопку **Clear**. Чтобы закрыть окно ввода, снова нажмите на иконку <Constant name="copilot" />.
5. <Constant name="copilot" /> автоматически сгенерирует SQL и предоставит объяснение запроса.
   - Нажмите **Add**, чтобы добавить сгенерированный SQL к существующему запросу.
   - Нажмите **Replace**, чтобы заменить существующий запрос сгенерированным SQL.
6. В меню **Query console** нажмите кнопку **Run**, чтобы предварительно просмотреть данные.
7. Подтвердите результаты или продолжайте дорабатывать модель.

<Lightbox src="/img/docs/dbt-insights/insights-copilot.gif" width="95%" title="dbt Copilot в dbt Insights" />

## Analyze data with the Analyst agent <Lifecycle status='private_beta' />

Используйте dbt <Constant name="copilot" /> для анализа данных и получения контекстуализированных результатов в реальном времени, задавая вопросы на естественном языке агенту Analyst на странице [<Constant name="query_page" />](/docs/explore/dbt-insights). Чтобы запросить доступ к агенту Analyst, [запишитесь в список ожидания](https://www.getdbt.com/product/dbt-agents#dbt-Agents-signup).

Перед началом убедитесь, что у вас есть [доступ к <Constant name="query_page" />](/docs/explore/access-dbt-insights).

1. Нажмите на иконку **<Constant name="copilot" />** в боковом меню консоли запросов.
2. Нажмите **Agent**.
3. В поле ввода dbt <Constant name="copilot" /> введите свой вопрос.
4. Нажмите **↑**, чтобы отправить вопрос.

   Агент преобразует вопросы на естественном языке в структурированные запросы, выполняет их на основе управляемых моделей и метрик dbt и возвращает результаты с указанием источников, предположений и возможных следующих шагов.

   Агент может проходить этот цикл несколько раз, если не удалось сразу получить полный ответ, что позволяет выполнять сложный многошаговый анализ.

5. Подтвердите результаты или продолжайте задавать агенту дополнительные вопросы о ваших данных.

История общения с агентом сохраняется, даже если вы переключаетесь между вкладками в dbt <Constant name="query_page" />. Однако она исчезает, если вы покидаете страницу <Constant name="query_page" /> или закрываете браузер.

<Lightbox src="/img/docs/dbt-insights/insights-copilot-agent.png" width="60%" title="Использование агента Analyst в Insights" />
