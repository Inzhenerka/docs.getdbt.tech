---
title: "Навигация по интерфейсу dbt Insights"
description: "Узнайте, как ориентироваться в интерфейсе dbt Insights"
sidebar_label: "Навигация по интерфейсу"
tags: [dbt Insights]
image: /img/docs/dbt-insights/insights-results.jpg
---

# Навигация по интерфейсу dbt Insights <Lifecycle status="managed,managed_plus" />

<IntroText>
Узнайте, как ориентироваться в интерфейсе <Constant name="query_page" /> и использовать его основные компоненты.
</IntroText>

<Constant name="query_page" /> предоставляет интерактивный интерфейс для написания, запуска и анализа SQL-запросов. В этом разделе описаны основные компоненты <Constant name="query_page" />.

## Query console
Query console — это основной компонент <Constant name="query_page" />. Он позволяет писать, запускать и анализировать SQL-запросы. Query console включает:

1. Редактор Query console, который позволяет писать, запускать и анализировать SQL-запросы:
  - Поддерживает подсветку синтаксиса и подсказки автодополнения  
  - Гиперссылку из SQL-кода `ref` на соответствующую страницу Explorer
2. [Query console menu](#query-console-menu), в котором находятся кнопки **Bookmark (icon)**, **Develop** и **Run**.
3. [Query output panel](#query-output-panel), расположенную под редактором запросов и отображающую результаты выполнения запроса:
  - Содержит три вкладки: **Data**, **Chart** и **Details**, которые позволяют анализировать выполнение запроса и визуализировать результаты.
4. [Query console sidebar menu](#query-console-sidebar-menu), в котором находятся иконки **<Constant name="explorer" />**, **Bookmark**, **Query history** и **<Constant name="copilot" />**.

<Lightbox src="/img/docs/dbt-insights/insights-main.png" title="Основной интерфейс dbt Insights с пустым редактором запросов" />

### Меню Query console
Меню Query console расположено в правом верхнем углу редактора запросов. В нем находятся кнопки **Bookmark**, **Develop** и **Run**:

- **Bookmark** — сохранение часто используемых SQL-запросов в избранное для быстрого доступа.
  - При нажатии **Bookmark** откроется модальное окно **Bookmark Query Details**, в котором можно указать **Title** и **Description**.
  - Позвольте [<Constant name="copilot" />](/docs/cloud/dbt-copilot) помочь с текстом — используйте AI‑ассистента для автоматической генерации полезного описания закладки.
  - Доступ к созданной закладке можно получить через иконку **Bookmark** в [Query console sidebar menu](#query-console-sidebar-menu).
- **Develop** — открыть [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) или [<Constant name="visual_editor" />](/docs/cloud/canvas), чтобы продолжить редактирование SQL-запроса.
- **Run** — запуск SQL-запроса и просмотр результатов на вкладке **Data**.

## Query Builder <Lifecycle status="beta" />

Query Builder в dbt <Constant name="query_page" /> позволяет создавать запросы к Semantic Layer без написания SQL-кода. Он помогает формировать запросы на основе доступных метрик, измерений и сущностей. С помощью Query Builder вы можете:

- Создавать аналитические запросы на основе заранее определённых метрик semantic layer.
- Использовать фильтры, временные диапазоны и агрегаты, соответствующие semantic model.
- Просматривать сгенерированный SQL-код для каждого запроса по метрике.

Чтобы создать запрос с помощью Query Builder:

1. В главном меню перейдите в **<Constant name="query_page" />**.
2. Нажмите **Build a query**.
3. Выберите, что включить в запрос:
    - Нажмите **Add Metric**, чтобы выбрать метрики для запроса.
    - Нажмите **Add Group by**, чтобы выбрать измерения для разбиения метрик, например временную гранулярность (day, week, month), регион, продукт или клиента.
    - Нажмите **Add Filter**, чтобы добавить фильтр и сузить результаты.
    - Нажмите **Add Order by**, чтобы выбрать порядок сортировки результатов.
    - Нажмите **Add Limit** и укажите количество результатов, которые нужно получить при выполнении запроса. Если оставить поле пустым, будут возвращены все результаты.
4. Нажмите **Run**, чтобы выполнить запрос.  
   Результаты будут доступны на вкладке **Data**. Сгенерированный SQL-код можно посмотреть на вкладке **Details**.

    <DocCarousel slidesPerView={1}>

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder-interface.png" title="Query Builder в dbt Insights" />

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder.png" title="Результаты отображаются на вкладке Data" />

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder-sql.png" title="Сгенерированный SQL-код на вкладке Details" />

    </DocCarousel>

## Панель Query output

Query output panel расположена под редактором запросов и отображает результаты выполнения запроса. Она включает следующие вкладки для анализа выполнения запроса и визуализации результатов:

- **Data** — предварительный просмотр результатов SQL-запроса с постраничной навигацией.
- **Details** — отображает краткую информацию о выполненном SQL-запросе:
  - Метаданные запроса — сгенерированные <Constant name="copilot" /> заголовок и описание, а также исходный и скомпилированный SQL.
  - Сведения о подключении — информация о подключении к платформе данных.
  - Детали запроса — длительность выполнения, статус, количество колонок и строк.
- **Chart** — визуализация результатов запроса с помощью встроенных графиков.
  - Используйте иконку графика, чтобы выбрать тип визуализации. Доступные типы: **line chart**, **bar chart** и **scatterplot**.
  - Используйте **Chart settings** для настройки типа графика и колонок, которые нужно визуализировать.
  - Доступные типы графиков: **line chart**, **bar chart** и **scatterplot**.
- **Download** — позволяет экспортировать результаты в CSV.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/dbt-insights/insights-chart-tab.png" width="95%" title="Вкладка Data в dbt Insights" />
<Lightbox src="/img/docs/dbt-insights/insights-chart.png" width="95%" title="Вкладка Chart в dbt Insights" />
<Lightbox src="/img/docs/dbt-insights/insights-details.png" width="95%" title="Вкладка Details в dbt Insights" />
</DocCarousel>

## Боковое меню Query console
Боковое меню Query console содержит следующие разделы и иконки:

### dbt Catalog

**Иконка <Constant name="explorer" />** — просмотр моделей проекта, колонок, метрик и других объектов с помощью встроенного представления <Constant name="explorer" />.

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="Иконка dbt Catalog в dbt Insights" />

### Закладки

Сохранение и доступ к часто используемым запросам.

<Lightbox src="/img/docs/dbt-insights/manage-bookmarks.png" width="90%" title="Управление закладками запросов" />

### История запросов (Query history)

Просмотр ранее выполненных запросов, их статусов (All, Success, Error или Pending), времени запуска и длительности выполнения. Можно искать запросы и фильтровать их по статусу, а также повторно запускать запросы из истории.

<Lightbox src="/img/docs/dbt-insights/insights-query-history.png" width="90%" title="Иконка Query history в dbt Insights" />

### dbt Copilot

Используйте [AI‑ассистента dbt <Constant name="copilot" />](/docs/cloud/dbt-copilot) для изменения или генерации запросов с помощью запросов на естественном языке, а также для общения с Analyst agent с целью получения инсайтов по данным. Существует два способа использования dbt <Constant name="copilot" /> в <Constant name="query_page" /> для взаимодействия с данными:

<Lightbox src="/img/docs/dbt-insights/insights-copilot-tabs.png" width="90%" title="dbt Copilot в Insights" />

- **Agent** tab <Lifecycle status='private_beta' /> — задавайте вопросы Analyst agent, чтобы получать интеллектуальный анализ данных с автоматизированными рабочими процессами, управляемыми инсайтами и практическими рекомендациями. Это разговорная AI‑функция, позволяющая задавать вопросы на естественном языке и получать анализ в реальном времени. Чтобы запросить доступ к Analyst agent, [присоединитесь к списку ожидания](https://www.getdbt.com/product/dbt-agents#dbt-Agents-signup).

  Примеры вопросов, которые можно задать агенту:

  - _What region are my sales growing the fastest?_  
  - _What was the revenue last month?_  
  - _How should I optimize my marketing spend next quarter?_  
  - _How many customers do I have, broken down by customer type?_

  Analyst agent формирует план анализа на основе вашего вопроса. Агент:

  1. Получает контекст, используя semantic models и метрики проекта.
  2. Генерирует SQL-запросы на основе определений проекта.
  3. Выполняет SQL-запрос и возвращает результаты с контекстом.
  4. Анализирует и суммирует полученные инсайты, предоставляя развернутый ответ.

  Агент может проходить эти шаги несколько раз, если не был получен полный ответ, что позволяет выполнять сложный многошаговый анализ.

  Подробнее см. [Analyze data with the Analyst agent](/docs/cloud/use-dbt-copilot#analyze-data-with-the-analyst-agent).

- **Generate SQL** tab — создание запросов в <Constant name="query_page" /> с помощью запросов на естественном языке для исследования и анализа данных в интуитивном интерфейсе с богатым контекстом. Подробнее см. [Build queries](/docs/cloud/use-dbt-copilot#build-queries).

## Возможности LSP

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
