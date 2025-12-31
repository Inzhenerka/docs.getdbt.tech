---
title: "Доступ к интерфейсу dbt Insights"
description: "Узнайте, как получить доступ к интерфейсу dbt Insights и запускать запросы"
sidebar_label: "Доступ и запуск запросов"
tags: [dbt Insights]
image: /img/docs/dbt-insights/insights-chart.jpg
---

# Доступ к интерфейсу dbt Insights <Lifecycle status="managed,managed_plus" /> {#access-the-dbt-insights-interface}

<IntroText>
Узнайте, как получить доступ к <Constant name="query_page" />, запускать запросы и просматривать результаты.
</IntroText>

<Constant name="query_page" /> предоставляет полноценный консольный интерфейс с удобной навигацией в редакторе. Вы можете ожидать, что <Constant name="query_page" /> позволит:
- Писать SQL‑запросы с возможностью открывать несколько вкладок  
- Использовать автодополнение SQL + dbt и подсветку синтаксиса  
- Сохранять SQL‑запросы  
- Просматривать результаты запроса и его детали во вкладках **Data** и **Details**  
- Создавать визуализации результатов запроса во вкладке **Chart**  
- Просматривать историю запросов и их статусы (например, Success, Error, Pending) во вкладке **Query history**  
- Использовать <Constant name="copilot" /> для генерации или редактирования SQL‑запросов с помощью подсказок на естественном языке  
- Интегрироваться с [<Constant name="copilot" />](/docs/cloud/dbt-copilot), [<Constant name="explorer" />](/docs/explore/explore-projects), [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) и [<Constant name="visual_editor" />](/docs/cloud/canvas), обеспечивая единый опыт исследования данных, написания SQL с поддержкой ИИ и совместной работы

## Доступ к интерфейсу dbt Insights {#access-the-dbt-insights-interface-1}

Перед тем как получить доступ к <Constant name="query_page" />, убедитесь, что выполнены [предварительные требования](/docs/explore/dbt-insights#prerequisites).

1. Чтобы открыть <Constant name="query_page" />, выберите пункт **Insights** в боковой панели навигации.
2. Если ваши [developer credentials](/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-cloud-ide) ещё не настроены, <Constant name="query_page" /> предложит настроить их. Возможность выполнять запросы к данным зависит от разрешений провайдера хранилища данных и ваших developer credentials.
3. После настройки учётных данных вы сможете писать, запускать и редактировать SQL‑запросы в редакторе <Constant name="query_page" /> для существующих моделей в вашем проекте.

## Запуск запросов {#run-queries}

Для запуска запросов в <Constant name="query_page" /> можно использовать:
- Стандартный SQL  
- Jinja (функции [`ref`](/reference/dbt-jinja-functions/ref), [`source`](/reference/dbt-jinja-functions/source) и другие Jinja‑функции)
- Ссылки из SQL‑кода `ref` на соответствующие страницы в Explorer  
- <Term id="cte">CTE</Term> и <Term id="subquery">подзапросы</Term>  
- Базовые агрегации и join‑ы  
- Запросы <Constant name="semantic_layer" /> с использованием Jinja‑функций <Constant name="semantic_layer" />

## Пример {#example}

Рассмотрим пример, который показывает, как запускать запросы в <Constant name="query_page" />:

- Один из магазинов [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) хочет посчитать количество уникальных заказов и уникальных клиентов, чтобы понять, можно ли расширить бизнес в других регионах мира.
- Чтобы выразить эту логику в SQL, вы (аналитик, назначенный на этот проект) хотите проанализировать годовые тренды, которые помогут принять решение о расширении. Напишите следующий SQL‑запрос, чтобы вычислить количество уникальных клиентов, городов и общий доход от заказов: <br /><br />
    ```sql
    with 

    orders as (
        select * from {{ ref('orders') }}
    ),

    customers as (
        select * from {{ ref('customers') }}
    )

    select 
        date_trunc('year', ordered_at) as order_year,
        count(distinct orders.customer_id) as unique_customers,
        count(distinct orders.location_id) as unique_cities,
        to_char(sum(orders.order_total), '999,999,999.00') as total_order_revenue
    from orders
    join customers
        on orders.customer_id = customers.customer_id
    group by 1
    order by 1
    ```

### Использование dbt Copilot {#use-dbt-copilot}

Чтобы упростить работу, [используйте <Constant name="copilot" />](/docs/cloud/use-dbt-copilot#build-queries) — это поможет сэкономить время и изучить другие способы анализа данных. <Constant name="copilot" /> может быстро обновить существующий запрос или сгенерировать новый на основе вашего запроса.

1. Нажмите на иконку **<Constant name="copilot" />** в боковой панели Query console, чтобы открыть окно ввода запроса.  
2. Введите подсказку на естественном языке с просьбой показать годовую разбивку по уникальным клиентам и общему доходу, затем нажмите **Submit**.
3. <Constant name="copilot" /> вернёт:
   - Краткое описание запроса  
   - Объяснение логики  
   - Сгенерированный SQL  
   - Опции **Add** или **Replace** для добавления или замены текущего запроса
4. Просмотрите результат и нажмите **Replace**, чтобы использовать SQL, сгенерированный <Constant name="copilot" />, в редакторе.
5. Затем нажмите **Run**, чтобы предварительно посмотреть результаты.

<Lightbox src="/img/docs/dbt-insights/insights-copilot.png" width="95%" title="dbt Insights с dbt Copilot" />

После этого вы можете:
- Продолжить создание или изменение запроса с помощью <Constant name="copilot" />
- Изучить [результаты](#view-results) во вкладке **Data**
- [Просмотреть метаданные и детали запроса](#view-details) во вкладке **Details**
- [Визуализировать результаты](#chart-results) во вкладке **Chart**
- Проверить [**Query history**](#query-history) для просмотра статусов и прошлых запусков
- Использовать [**<Constant name="explorer" />**](#use-dbt-explorer) для изучения lineage и контекста моделей
- Если вы хотите сохранить запрос, нажмите **Save Insight** в [меню Query console](/docs/explore/navigate-dbt-insights#query-console-menu), чтобы сохранить его для дальнейшего использования

:::tip Хотите превратить запрос в модель?
Вы можете открыть [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) или [<Constant name="visual_editor" />](/docs/cloud/canvas) из [меню Query console](/docs/explore/navigate-dbt-insights#query-console-menu), чтобы превратить SQL в переиспользуемую модель dbt — и всё это прямо в <Constant name="cloud" />!
:::

### Просмотр результатов {#view-results}

Используя тот же пример, вы можете выполнить небольшой exploratory data analysis, запустив запрос и:

- Просмотреть результаты во вкладке **Data** — отображаются постраничные результаты запроса.
- Отсортировать результаты — нажмите на заголовок столбца, чтобы отсортировать данные по нему.
- Экспортировать в CSV — в правом верхнем углу таблицы нажмите кнопку загрузки, чтобы выгрузить датасет.
<Lightbox src="/img/docs/dbt-insights/insights-export-csv.png" width="95%" title="Экспорт в CSV в dbt Insights" />

### Просмотр деталей {#view-details}

Откройте вкладку **Details**, чтобы посмотреть детали запроса:
- **Query metadata** — заголовок и описание, сгенерированные <Constant name="copilot" />, исходный SQL и соответствующий скомпилированный SQL.
- **Connection details** — информация о подключении к платформе данных.
- **Query details** — длительность выполнения, статус, количество столбцов и строк.

<Lightbox src="/img/docs/dbt-insights/insights-details.png" width="95%" title="Вкладка Details в dbt Insights" />

### Визуализация результатов {#chart-results}

Визуализируйте результаты запроса, перейдя на вкладку **Chart**, где можно:
- Выбрать тип графика с помощью иконки графика.
- Выбрать **line chart, bar chart или scatterplot**.
- Настроить оси и столбцы для визуализации с помощью иконки **Chart settings**.

<Lightbox src="/img/docs/dbt-insights/insights-chart.png" width="95%" title="Вкладка Chart в dbt Insights" />

### История запросов {#query-history}

Просматривайте историю запросов и их статусы (All, Success, Error или Pending) с помощью иконки **Query history**:
- Выберите запрос, чтобы запустить его повторно и посмотреть результаты.
- Ищите прошлые запросы и фильтруйте их по статусу.
- Наведите курсор на запрос, чтобы посмотреть SQL‑код или скопировать его.

История запросов хранится бессрочно.

<Lightbox src="/img/docs/dbt-insights/insights-query-history.png" width="95%" title="Иконка Query history в dbt Insights" />

### Использование dbt Catalog {#use-dbt-catalog}

Откройте [<Constant name="explorer" />](/docs/explore/explore-projects) напрямую в <Constant name="query_page" />, чтобы просматривать ресурсы проекта — модели, столбцы, метрики, измерения и многое другое — прямо в интерфейсе <Constant name="query_page" />.

Такой интегрированный вид позволяет вам и другим пользователям не прерывать рабочий процесс с запросами, получая при этом больше контекста о моделях, семантических моделях, метриках, макросах и другом. Встроенный <Constant name="explorer" /> предоставляет:
- Те же возможности поиска, что и <Constant name="explorer" />
- Возможность ограничивать отображаемые объекты по типу
- Гиперссылки из SQL‑кода `ref` на соответствующие страницы <Constant name="explorer" />
- Просмотр активов более детально, открыв полный интерфейс <Constant name="explorer" /> или открыв их в <Constant name="copilot" />

Чтобы открыть <Constant name="explorer" />, нажмите на иконку **<Constant name="explorer" />** в [боковом меню Query console](/docs/explore/navigate-dbt-insights#query-console-sidebar-menu).

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="dbt Insights, интегрированный с dbt Catalog" />

### Настройка окружения Jinja {#set-jinja-environment}

Настройте окружение компиляции, чтобы управлять тем, как рендерятся Jinja‑функции. Эта функция:
- Поддерживает «типизированные» окружения, помеченные как `Production`, `Staging` и/или `Development`.
- Позволяет выполнять запросы <Constant name="semantic_layer" /> к staging‑окружениям (development‑окружения не поддерживаются).
- По‑прежнему использует индивидуальные учётные данные пользователей, поэтому у них должен быть соответствующий доступ для выполнения запросов к `PROD` и `STG`.
- При смене окружения меняется контекст для представления <Constant name="explorer" /> в <Constant name="query_page" />, а также контекст окружения при переходе в <Constant name="explorer" /> и <Constant name="visual_editor" />. Например, если переключиться на `Staging` в <Constant name="query_page" /> и выбрать **View in Catalog**, откроется представление `Staging` в <Constant name="explorer" />.

<Lightbox src="/img/docs/dbt-insights/insights-jinja-environment.png" width="90%" title="Настройка окружения для Jinja‑контекста" />

## Сохранение Insights {#save-your-insights}

Insights предоставляет удобный механизм сохранения запросов, которые вы используете чаще всего. Также есть возможность делиться сохранёнными Insights с другими пользователями dbt (и получать доступ к их сохранённым запросам). Нажмите на **иконку закладки** в запросе, чтобы добавить его в список!

- Нажмите **иконку закладки** в правом меню, чтобы управлять сохранёнными Insights. Вы можете просматривать свои личные и общие запросы.

    <Lightbox src="/img/docs/dbt-insights/saved-insights.png" width="90%" title="Управление сохранёнными Insights" />
    
- Просматривайте детали сохранённого Insight, включая описание и дату создания, во вкладке **Overview**.
- Просматривайте историю изменений Insight во вкладке **Version history**. Нажмите на версию, чтобы сравнить её с текущей и увидеть изменения.

## Особенности и ограничения {#considerations}

- <Constant name="query_page" /> использует ваши development credentials для выполнения запросов. Вы можете выполнять запросы к любым объектам в вашем хранилище данных, к которым у вас есть доступ с этими учётными данными.
- Каждая Jinja‑функция использует [`defer --favor-state`](/reference/node-selection/defer) для разрешения Jinja.

<!-- this can move to another page -->

## FAQs {#faqs}
- В чём разница между <Constant name="query_page" /> и <Constant name="explorer" />?
  - Отличный вопрос! <Constant name="explorer" /> помогает понять структуру вашего dbt‑проекта, его ресурсы, lineage и метрики, предоставляя контекст для данных.
  - <Constant name="query_page" /> развивает этот контекст, позволяя писать, запускать и итеративно дорабатывать SQL‑запросы прямо в <Constant name="cloud" />. Он предназначен для ad‑hoc и исследовательской аналитики и помогает бизнес‑пользователям и аналитикам исследовать данные, задавать вопросы и эффективно сотрудничать.
  - <Constant name="explorer" /> даёт контекст, а <Constant name="query_page" /> позволяет действовать.
