---
title: "Навигация по интерфейсу dbt Insights"
description: "Узнайте, как ориентироваться в интерфейсе dbt Insights"
sidebar_label: "Навигация по интерфейсу"
tags: [dbt Insights]
image: /img/docs/dbt-insights/insights-results.jpg
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Навигация по интерфейсу dbt Insights

<IntroText>
Узнайте, как ориентироваться в интерфейсе <Constant name="insights" /> и использовать его основные компоненты.
</IntroText>

<Constant name="insights" /> предоставляет интерактивный интерфейс для написания, выполнения и анализа SQL-запросов. В этом разделе представлены основные компоненты <Constant name="insights" />. 

## Консоль запросов
Консоль запросов — основной компонент <Constant name="insights" />. Она позволяет писать, выполнять и анализировать SQL-запросы. Консоль запросов включает:
1. Редактор консоли запросов, который позволяет писать, выполнять и анализировать SQL-запросы:
  - Поддерживает подсветку синтаксиса и автодополнение 
  - Позволяет переходить по гиперссылке из `ref` в SQL-коде на соответствующую страницу Explorer
2. [Меню консоли запросов](#query-console-menu), которое содержит кнопки **Bookmark (значок)**, **Develop** и **Run**. 
3. [Панель результатов запроса](#query-output-panel), которая расположена под редактором запросов и отображает результаты запроса:
  - Содержит три вкладки: **Data**, **Chart** и **Details**, которые позволяют анализировать выполнение запроса и визуализировать результаты.
4. [Боковое меню консоли запросов](#query-console-sidebar-menu), которое содержит значки **<Constant name="catalog" />**, **Bookmark**, **Query history** и **dbt Copilot**.

1. Редактор Query console, который позволяет писать, запускать и анализировать SQL-запросы:
  - Поддерживает подсветку синтаксиса и подсказки автодополнения  
  - Гиперссылку из SQL-кода `ref` на соответствующую страницу Explorer
2. [Query console menu](#query-console-menu), в котором находятся кнопки **Bookmark (icon)**, **Develop** и **Run**.
3. [Query output panel](#query-output-panel), расположенную под редактором запросов и отображающую результаты выполнения запроса:
  - Содержит три вкладки: **Data**, **Chart** и **Details**, которые позволяют анализировать выполнение запроса и визуализировать результаты.
4. [Query console sidebar menu](#query-console-sidebar-menu), в котором находятся иконки **<Constant name="explorer" />**, **Bookmark**, **Query history** и **<Constant name="copilot" />**.

<Lightbox src="/img/docs/dbt-insights/insights-main.png" title="Основной интерфейс dbt Insights с пустым редактором запросов" />

- Кнопка **Bookmark** &mdash; сохраняйте часто используемые SQL-запросы в избранное для быстрого доступа.
  - При нажатии **Bookmark** появится модальное окно **Bookmark Query Details**, в котором можно добавить заголовок (**Title**) и описание (**Description**).
  - Поручите написание текста dbt Copilot &mdash; используйте ИИ-помощника, чтобы автоматически создать полезное описание для вашей закладки.
  - Откройте созданную закладку с помощью значка **Bookmark** в [боковом меню консоли запросов](#query-console-sidebar-menu). 
 - **Develop**: откройте [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), чтобы продолжить редактирование SQL-запроса.
- Кнопка **Run** &mdash; выполните SQL-запрос и просмотрите результаты на вкладке **Data**.

<a id="semantic-layer-querying" />

## Запросы к Semantic Layer

Возможность выполнения запросов к Semantic Layer в dbt <Constant name="insights" /> позволяет создавать запросы к Semantic Layer без написания SQL-кода. Она помогает создавать запросы на основе доступных метрик, измерений и сущностей. С помощью этой возможности вы можете:

Query Builder в dbt <Constant name="query_page" /> позволяет создавать запросы к Semantic Layer без написания SQL-кода. Он помогает формировать запросы на основе доступных метрик, измерений и сущностей. С помощью Query Builder вы можете:

Чтобы создать запрос в dbt <Constant name="insights" />:

1. В главном меню перейдите в **<Constant name="insights" />**.
2. Нажмите **Build a query**.
3. В раскрывающемся списке Environment выберите **PROD** или **STG**. Хотя в списке есть вариант **DEV**, запросы к средам разработки перенаправляются в соответствии с правилами отложенного разрешения ссылок (deferral), поэтому при его выборе запрос не будет выполняться непосредственно в вашей среде разработки.
4. Выберите, что нужно включить в запрос.
    - Нажмите **Add Metric**, чтобы выбрать метрики для запроса. 
    - Нажмите **Add Group by**, чтобы выбрать измерения для детализации метрики, например временную гранулярность (день, неделя, месяц), регион, продукт или клиента.
    - Нажмите **Add Filter**, чтобы создать фильтр для сужения результатов.
    - Нажмите **Add Order by**, чтобы выбрать порядок сортировки результатов запроса. 
    - Нажмите **Add Limit** и выберите количество результатов, которые вы хотите видеть при выполнении запроса. Если оставить поле пустым, будут возвращены все результаты. 
5. Нажмите **Run**, чтобы выполнить запрос.
    Результаты доступны на вкладке **Data**. Сгенерированный SQL-код можно просмотреть на вкладке **Details**.

    <DocCarousel slidesPerView={1}>

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder-interface.png" title="Запросы к семантическому слою в dbt Insights" />

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder.png" title="Результаты отображаются на вкладке Data" />

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder-sql.png" title="Сгенерированный SQL-код на вкладке Details" />

    </DocCarousel>

## Панель Query output {#query-output-panel}

Панель результатов запроса расположена под редактором запросов и отображает результаты выполнения запроса. На ней доступны следующие вкладки для анализа выполнения запроса и визуализации результатов:
- Вкладка **Data** &mdash; Предварительный просмотр результатов SQL-запроса с разбивкой на страницы.
- Вкладка **Details** &mdash; Краткие сведения о выполненном SQL-запросе:
  - Метаданные запроса &mdash; Заголовок и описание, сгенерированные ИИ dbt Copilot, а также исходный и скомпилированный SQL.
  - Сведения о подключении &mdash; Информация о подключении к соответствующей платформе данных.
  - Сведения о запросе &mdash; Длительность выполнения, статус, количество столбцов и строк.
- Вкладка **Chart** &mdash; Визуализация результатов запроса с помощью встроенных диаграмм. 
  - Используйте значок диаграммы, чтобы выбрать тип диаграммы для визуализации результатов. Доступны **линейная диаграмма, столбчатая диаграмма и точечная диаграмма**.
  - Используйте **Chart settings**, чтобы настроить тип диаграммы и выбрать столбцы для визуализации. 
  - Доступны **линейная диаграмма, столбчатая диаграмма и точечная диаграмма**.
- Кнопка **Download** &mdash; Позволяет экспортировать результаты в CSV

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/dbt-insights/insights-chart-tab.png" width="95%" title="Вкладка Data в dbt Insights" />
<Lightbox src="/img/docs/dbt-insights/insights-chart.png" width="95%" title="Вкладка Chart в dbt Insights" />
<Lightbox src="/img/docs/dbt-insights/insights-details.png" width="95%" title="Вкладка Details в dbt Insights" />
</DocCarousel>

<a id="query-console-menu" />

## Боковое меню Query console {#query-console-sidebar-menu}
Боковое меню Query console содержит следующие разделы и иконки:

### dbt Catalog {#dbt-catalog}

**Значок <Constant name="catalog" />** &mdash; Просматривайте модели, столбцы, метрики и другие объекты вашего проекта во встроенном представлении <Constant name="catalog" />.

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="Иконка dbt Catalog в dbt Insights" />

### Закладки {#bookmark}

Сохраняйте часто используемые запросы и открывайте их с боковой панели консоли запросов.

Чтобы сохранять закладки и управлять ими:

1. Нажмите **Bookmark** в [меню консоли запросов](#query-console-menu), чтобы сохранить текущий запрос. В модальном окне **Bookmark Query Details** укажите название в поле **Title** и описание в поле **Description**.
2. Выберите значок **Bookmark** на боковой панели, чтобы открыть список сохранённых запросов.
3. Выберите сохранённый Insight, чтобы просмотреть сведения о нём или открыть его в редакторе запросов.

Подробнее о совместном доступе к сохранённым Insights и истории версий см. в разделе [Сохранение Insights](/docs/explore/access-dbt-insights#save-your-insights).

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-insights/save-insights-modal.png" width="95%" title="Модальное окно с параметрами закладки запроса" />

<Lightbox src="/img/docs/dbt-insights/manage-bookmarks.png" width="90%" title="Управление закладками запросов" />

<Lightbox src="/img/docs/dbt-insights/view-saved-insights.png" width="95%" title="Список сохранённых Insights" />

</DocCarousel>

### История запросов (Query history) {#query-history}

Просмотр ранее выполненных запросов, их статусов (All, Success, Error или Pending), времени запуска и длительности выполнения. Можно искать запросы и фильтровать их по статусу, а также повторно запускать запросы из истории.

<Lightbox src="/img/docs/dbt-insights/insights-query-history.png" width="90%" title="Иконка Query history в dbt Insights" />

### dbt Copilot {#dbt-copilot}

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';

<CopilotWizardDifferences/>

Используйте dbt Copilot, чтобы изменять или генерировать запросы с помощью инструкций на естественном языке либо общаться с агентом Analyst для получения аналитических выводов на основе ваших данных. 

Использовать dbt Copilot в Insights можно двумя способами:
- **Генерация SQL**: создавайте запросы в <Constant name="insights" /> с помощью инструкций на естественном языке, чтобы исследовать данные и выполнять запросы в интуитивно понятном интерфейсе с богатым контекстом. Подробнее см. в разделе [Создание запросов в dbt Insights](/docs/explore/navigate-dbt-insights).
- **Агент dbt Copilot Analyst** <Lifecycle status='beta' />: задавайте вопросы, чтобы получать интеллектуальный анализ данных с автоматизированными рабочими процессами, аналитическими выводами в рамках установленных правил управления данными и практическими рекомендациями. Эта функция диалогового ИИ позволяет отправлять запросы на естественном языке и получать результаты анализа в реальном времени. 

  Чтобы использовать агента Analyst, включите бета-функции в разделе **Account settings** > **Personal profile** > **Experimental features**. Инструкции по включению см. в разделе [Предварительный доступ к новым функциям платформы dbt](/docs/dbt-versions/experimental-features).

  Примеры вопросов, которые можно задать агенту:

  - _В каком регионе мои продажи растут быстрее всего?_  
  - _Какой была выручка в прошлом месяце?_  
  - _Как мне оптимизировать маркетинговые расходы в следующем квартале?_  
  - _Сколько у меня клиентов, в разбивке по типам клиентов?_  

Агент dbt Copilot Analyst создает план анализа на основе вашего вопроса. Агент dbt Copilot Analyst:

  1. Получает контекст, используя semantic models и метрики проекта.
  2. Генерирует SQL-запросы на основе определений проекта.
  3. Выполняет SQL-запрос и возвращает результаты с контекстом.
  4. Анализирует и суммирует полученные инсайты, предоставляя развернутый ответ.

  Агент может проходить эти шаги несколько раз, если не был получен полный ответ, что позволяет выполнять сложный многошаговый анализ.

Подробнее см. в разделе [dbt Copilot в Insights](/docs/dbt-ai/analyst-agent).



<Lightbox src="/img/docs/dbt-insights/insights-copilot-tabs.png" width="50%" title="dbt Copilot в Insights" />

## Возможности LSP {#lsp-features}

Следующие возможности Language Server Protocol (LSP) доступны для проектов, обновлённых до <Constant name="fusion" />:

- **Live CTE previews:** предварительный просмотр результата CTE для более быстрой валидации и отладки.

    <Lightbox src="/img/docs/dbt-insights/preview-cte.png" width="90%" title="Предварительный просмотр CTE в Insights" />

- **Real-time error detection:** автоматическая валидация SQL-кода для обнаружения ошибок и предупреждений без обращения к хранилищу данных. Включает как ошибки dbt (например, некорректный `ref`), так и SQL‑ошибки (например, неверное имя колонки или синтаксис SQL).

    <Lightbox src="/img/docs/dbt-insights/sql-validation.png" width="90%" title="Обнаружение ошибок в реальном времени" />

- **`ref` suggestions:** автодополнение имён моделей при использовании функции `ref()` для ссылок на другие модели проекта.
  
    <Lightbox src="/img/docs/dbt-insights/ref-autocomplete.png" width="90%" title="Подсказки ref в Insights" />

- **Hover insights:** просмотр контекста по таблицам, колонкам и функциям без выхода из кода. При наведении курсора на элемент SQL отображаются детали, такие как имена колонок и типы данных.

    <DocCarousel slidesPerView={1}>
    <Lightbox src="/img/docs/dbt-insights/column-info.png" width="60%" title="Пример сведений о колонке" />
    <Lightbox src="/img/docs/dbt-insights/column-hover.png" width="60%" title="Пример сведений о колонке" />
    </DocCarousel>
