---
title: "Доступ к интерфейсу dbt Insights"
description: "Узнайте, как получить доступ к интерфейсу dbt Insights и запускать запросы"
sidebar_label: "Доступ и запуск запросов"
tags: [dbt Insights]
image: /img/docs/dbt-insights/insights-chart.jpg
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Доступ к интерфейсу dbt Insights

<IntroText>
Узнайте, как открыть <Constant name="insights" />, выполнять запросы и просматривать результаты.
</IntroText>

<Constant name="insights" /> предоставляет многофункциональную консоль с навигацией по редактору. В <Constant name="insights" /> вы можете:
- Писать SQL-запросы с возможностью открывать несколько вкладок 
- Использовать автодополнение SQL + dbt и подсветку синтаксиса
- Сохранять SQL-запросы
- Просматривать результаты запроса и подробные сведения о нём на вкладках **Data** или **Details**
- Создавать визуализации результатов запроса на вкладке **Chart**
- Просматривать историю запросов и их статусы (например, Success, Error, Pending) на вкладке **Query history**
- Использовать dbt Copilot в Insights для создания или редактирования SQL-запросов с помощью инструкций на естественном языке
- Использовать интеграцию с [<Constant name="catalog" />](/docs/explore/explore-projects), [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) и [<Constant name="canvas" />](/docs/platform/canvas) для удобного исследования данных, написания кода с помощью ИИ и совместной работы

## Доступ к интерфейсу dbt Insights {#access-the-dbt-insights-interface-1}

Перед началом работы с <Constant name="insights" /> убедитесь, что выполнены [предварительные требования](/docs/explore/dbt-insights#prerequisites).

1. Чтобы открыть <Constant name="insights" />, выберите **Insights** на боковой панели навигации.
2. Если ваши [учетные данные пользователя](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) еще не настроены, <Constant name="insights" /> предложит вам настроить их. Возможность выполнять запросы к данным зависит от разрешений, предоставленных вашим учетным данным на стороне поставщика хранилища данных.
3. После настройки учетных данных вы сможете писать, выполнять и редактировать SQL-запросы в редакторе <Constant name="insights" /> для существующих моделей вашего проекта.

## Запуск запросов {#run-queries}

Для выполнения запросов в <Constant name="insights" /> можно использовать:
- Стандартный SQL  
- Jinja (функции [`ref`](/reference/dbt-jinja-functions/ref), [`source`](/reference/dbt-jinja-functions/source) и другие функции Jinja)
- Ссылки из `ref` в SQL-коде на соответствующую страницу Explorer
- <Term id="cte">CTE</Term> и <Term id="subquery">подзапросы</Term>  
- Базовые агрегации и соединения 
- Запросы к <Constant name="semantic_layer" /> с использованием Jinja-функций <Constant name="semantic_layer" />

## Пример {#example}

Рассмотрим на примере, как выполнять запросы в <Constant name="insights" />:

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

### Использование dbt Copilot

Чтобы упростить работу, [используйте dbt Copilot в Insights](/docs/explore/navigate-dbt-insights): это поможет сэкономить время и найти другие способы анализа данных. dbt Copilot поможет быстро обновить запрос или сгенерировать новый на основе вашего описания.

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';

<CopilotWizardDifferences/>

1. Нажмите значок **dbt Copilot** на боковой панели консоли запросов.
2. В раскрывающемся меню над полем ввода dbt Copilot выберите **Generate SQL**.
3. Введите запрос на естественном языке и попросите вывести количество уникальных клиентов и общую выручку с разбивкой по годам.
4. Нажмите **↑**, чтобы отправить запрос.
4. В ответ dbt Copilot предоставит:
   - Краткое описание SQL-запроса
   - Объяснение логики
   - Сгенерированный SQL
   - Возможность добавить сгенерированный SQL к существующему запросу (**Add**) или заменить им существующий запрос (**Replace**)
5. Проверьте результат и нажмите **Replace**, чтобы использовать сгенерированный dbt Copilot SQL в редакторе.
6. Нажмите **Run**, чтобы просмотреть результаты.

<Lightbox src="/img/docs/dbt-insights/insights-copilot.png" width="60%" title="dbt Insights с dbt Copilot" />

Далее вы можете:
- Продолжить создание или изменение запроса с помощью dbt Copilot.
- Изучить [результаты](#view-results) на вкладке **Data**.
- [Просмотреть метаданные и сведения о запросе](#view-details) на вкладке **Details**.
- [Визуализировать результаты](#chart-results) на вкладке **Chart**.
- Проверить статус и предыдущие запуски в [**Query history**](#query-history).
- Использовать [**<Constant name="catalog" />**](/docs/explore/explore-projects) для изучения связей между моделями и их контекста.
- Если вы хотите сохранить запрос для дальнейшего использования, нажмите **Save Insight** в [меню консоли запросов](/docs/explore/navigate-dbt-insights#query-console-menu).

:::tip Хотите превратить запрос в модель?
Вы можете открыть [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) или [<Constant name="canvas" />](/docs/platform/canvas) из [меню консоли запросов](/docs/explore/navigate-dbt-insights#query-console-menu), чтобы преобразовать свой SQL в модель dbt, пригодную для повторного использования, &mdash; и всё это в <Constant name="dbt" />!
:::

### Просмотр результатов {#view-results}

Используя тот же пример, вы можете выполнить небольшой exploratory data analysis, запустив запрос и:

- Просмотреть результаты во вкладке **Data** — отображаются постраничные результаты запроса.
- Отсортировать результаты — нажмите на заголовок столбца, чтобы отсортировать данные по нему.
- Экспортировать в CSV — в правом верхнем углу таблицы нажмите кнопку загрузки, чтобы выгрузить датасет.
<Lightbox src="/img/docs/dbt-insights/insights-export-csv.png" width="95%" title="Экспорт в CSV в dbt Insights" />

### Просмотр подробностей {#view-details}
Чтобы просмотреть подробности запроса, нажмите на вкладку **Details**:
- **Метаданные запроса** &mdash; Заголовок и описание, сгенерированные dbt Copilot, исходный SQL и соответствующий скомпилированный SQL.
- **Сведения о подключении** &mdash; Информация о подключении к платформе данных, используемом для запроса.
- **Сведения о запросе** &mdash; Длительность выполнения запроса, статус, количество столбцов и строк.

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

Откройте [<Constant name="catalog" />](/docs/explore/explore-projects) прямо в <Constant name="insights" />, чтобы просматривать ресурсы проекта, такие как модели, столбцы, метрики, измерения и многое другое, — всё это доступно в интерфейсе <Constant name="insights" />. 

Это встроенное представление позволяет вам и вашим пользователям продолжать работу с запросами, получая дополнительную информацию о моделях, семантических моделях, метриках, макросах и других ресурсах. Встроенное представление <Constant name="catalog" /> предоставляет следующие возможности:
- Те же возможности поиска, что и в <Constant name="catalog" />
- Фильтрация отображаемых объектов по типу
- Переход по гиперссылке из `ref` в SQL-коде на соответствующую страницу <Constant name="catalog" />
- Более подробный просмотр ресурсов в полном интерфейсе <Constant name="catalog" /> или их открытие в dbt Copilot.

Чтобы открыть <Constant name="catalog" />, нажмите значок **<Constant name="catalog" />** в [боковом меню консоли запросов](/docs/explore/navigate-dbt-insights#query-console-sidebar-menu).

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="dbt Insights, интегрированный с dbt Catalog" />

### Настройка контекста Jinja {#set-jinja-environment}

Задайте среду компиляции, чтобы управлять тем, как обрабатываются функции Jinja. Эта функция:
- Поддерживает «типизированные» среды, отмеченные как `Production`, `Staging` и/или `Development`.
- Позволяет выполнять запросы <Constant name="semantic_layer" /> к средам staging (среды разработки не поддерживаются).
- По-прежнему использует учетные данные конкретного пользователя, поэтому пользователи должны иметь соответствующие права доступа для выполнения запросов к `PROD` и `STG`. 
- При смене среды меняется контекст представления <Constant name="catalog" /> в <Constant name="insights" />, а также контекст среды при переходе в <Constant name="catalog" /> и <Constant name="canvas" />. Например, если переключиться на `Staging` в <Constant name="insights" /> и выбрать **View in Catalog**, откроется представление `Staging` в <Constant name="catalog" />.

<Lightbox src="/img/docs/dbt-insights/insights-jinja-environment.png" width="90%" title="Настройка окружения для Jinja‑контекста" />

## Сохранение Insights {#save-your-insights}

Insights предоставляет удобный механизм сохранения запросов, которые вы используете чаще всего. Также есть возможность делиться сохранёнными Insights с другими пользователями dbt (и получать доступ к их сохранённым запросам). Нажмите на **иконку закладки** в запросе, чтобы добавить его в список!

- Нажмите **иконку закладки** в правом меню, чтобы управлять сохранёнными Insights. Вы можете просматривать свои личные и общие запросы.

    <Lightbox src="/img/docs/dbt-insights/saved-insights.png" width="90%" title="Управление сохранёнными Insights" />
    
- Просматривайте детали сохранённого Insight, включая описание и дату создания, во вкладке **Overview**.
- Просматривайте историю изменений Insight во вкладке **Version history**. Нажмите на версию, чтобы сравнить её с текущей и увидеть изменения.

## Особенности и ограничения {#considerations}

## Важные замечания 
- <Constant name="insights" /> использует ваши учетные данные для выполнения запросов. Вы можете выполнять запросы к любому объекту в вашем хранилище данных, доступному с учетными данными пользователя, настроенными в **Account settings**. 
- Каждая функция Jinja использует [`defer --favor-state`](/reference/node-selection/defer) для разрешения ссылок Jinja.

<!-- это можно перенести на другую страницу -->

## Часто задаваемые вопросы
- В чем разница между <Constant name="insights" /> и <Constant name="catalog" />?
  - Отличный вопрос! <Constant name="catalog" /> помогает разобраться в структуре, ресурсах, связях и метриках вашего проекта dbt, предоставляя контекст для ваших данных.
  - <Constant name="insights" /> опирается на этот контекст и позволяет писать, выполнять и дорабатывать SQL-запросы непосредственно в <Constant name="dbt" />. Этот инструмент предназначен для разового или исследовательского анализа и дает бизнес-пользователям и аналитикам возможность изучать данные, задавать вопросы и беспрепятственно сотрудничать.
  - <Constant name="catalog" /> предоставляет контекст, а <Constant name="insights" /> позволяет действовать.
