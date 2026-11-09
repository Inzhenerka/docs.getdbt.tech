---
title: "Плитка состояния данных"
id: "data-tile"
sidebar_label: "Плитка состояния данных"
description: "Встраивайте плитки состояния данных в свои панели, чтобы передавать сигналы доверия потребителям данных."
image: /img/docs/collaborate/dbt-explorer/data-tile-pass.jpg
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Плитка состояния данных

Плитки состояния данных позволяют заинтересованным сторонам с первого взгляда определить, устарели ли просматриваемые данные или ухудшилось ли их качество. С их помощью команды могут сразу вернуться в <Constant name="catalog" />, чтобы узнать подробности и разобраться в проблемах.

Плитка состояния данных:

- Обобщает [сигналы состояния данных](/docs/explore/data-health-signals) для потребителей данных.
- Содержит прямые ссылки на <Constant name="catalog" />, где можно подробнее изучить проблемы с данными на предыдущих этапах обработки.
- Предоставляет более подробную информацию и упрощает отладку.
- Обновляет существующие [плитки на основе заданий](#job-based-data-health).

Тайлы здоровья данных опираются на [exposures](/docs/build/exposures), чтобы отображать сигналы здоровья данных на ваших дашбордах. Exposure определяет, как конкретные выходные артефакты &mdash; такие как дашборды или отчёты &mdash; зависят от ваших моделей данных. В dbt exposures можно настраивать двумя способами:

- Ручные &mdash; Определяются [вручную](/docs/build/exposures#declaring-an-exposure) и явно задаются в YAML-файлах вашего проекта.
- Автоматические &mdash; Автоматически загружаются для поддерживаемых интеграций <Constant name="dbt" />. <Constant name="dbt" /> автоматически [создаёт и визуализирует нижестоящие экспозиции](/docs/platform-integrations/downstream-exposures), избавляя от необходимости вручную определять их в YAML. Эти нижестоящие экспозиции хранятся в системе метаданных dbt, отображаются в [<Constant name="catalog" />](/docs/explore/explore-projects) и ведут себя как ручные экспозиции, но не существуют в YAML-файлах.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-pass.png" width="60%" title="Пример плитки состояния данных на вашем дашборде, показывающей успешное прохождение проверок." />
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tiles.png" width="60%" title="Встраивайте плитки состояния данных в свои дашборды, чтобы наглядно представлять потребителям данных сводную информацию об их состоянии." />
</DocCarousel>

## Предварительные условия {#prerequisites}

- У вас должна быть учетная запись <Constant name="dbt" /> на [тарифном плане Enterprise](https://www.getdbt.com/pricing/).
- Для настройки [сервисных токенов](/docs/dbt-apis/service-tokens#permissions-for-service-account-tokens) необходимо быть администратором учетной записи.
- У вас должны быть [права на разработку](/docs/platform/manage-access/seats-and-users).
- В вашем проекте должны быть определены [exposures](/docs/build/exposures):
  -  Если вы используете exposures, задаваемые вручную, они должны быть явно определены в ваших YAML-файлах.
  - Если вы используете автоматические downstream exposures, убедитесь, что ваш BI-инструмент [настроен для интеграции](/docs/platform-integrations/downstream-exposures-tableau) с <Constant name="dbt" />.
- В задании, которое создает этот exposure, должна быть включена [проверка актуальности источников](/docs/deploy/source-freshness).
- Для exposure, используемого в плитке состояния данных, [свойство `type`](/docs/build/exposures#available-properties) должно иметь значение `dashboard`. В противном случае в <Constant name="catalog" /> не будет отображаться раскрывающийся список **Встроить плитку состояния данных в ваш дашборд**.

## Просмотр exposure в dbt Catalog {#view-exposure-in-dbt-catalog}

Сначала убедитесь, что включена [свежесть источников](/docs/deploy/source-freshness) в задании, которое генерирует эту экспозицию.

1. Перейдите в <Constant name="catalog" />, нажав ссылку **Catalog** в меню навигации.
2. На главной странице **Overview** перейдите к левому меню навигации.
3. Нажмите **Exposures**, чтобы просмотреть список [экспозиций](/docs/build/exposures).
4. Выберите экспозицию дашборда и перейдите на вкладку **General**, чтобы просмотреть информацию о состоянии данных.
5. На этой вкладке вы увидите:
   - Название экспозиции в верхней части страницы.
   - Тип ресурса (например, **Exposure**) и отметку времени **Updated at**.
   - Раздел **Data health**, в котором указано время последней завершённой проверки — **Last check completed** (время, прошедшее с момента выполнения проверки).
   - Сводку о свежести данных (например, **Data is fresh**) и разбивку по вышестоящим источникам **Sources** (свежие, с задержкой, устаревшие, пропущенные, неактуальные, ненастроенные).
   - Сводку о качестве данных (например, **Data quality passed**) и разбивку по вышестоящим моделям **Models** и тестам **Tests**.
6. Вы можете нажать кнопку **Open in Dashboard** в правом верхнем углу, чтобы сразу открыть дашборд в своём инструменте аналитики.

<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-exposures.png" width="95%" title="Просмотр экспозиции в dbt Catalog." />

## Встраивание в вашу панель {#embed-in-your-dashboard}

Перейдя к экспозиции в <Constant name="catalog" />, вам нужно будет настроить плитку состояния данных и [сервисный токен](/docs/dbt-apis/service-tokens). Вы можете встроить плитку состояния данных в любой аналитический инструмент, поддерживающий встраивание URL или iFrame.

Следуйте этим шагам, чтобы настроить плитку состояния данных:

1. Перейдите в **Account settings** в <Constant name="dbt" />.
2. Выберите **API tokens** на левой боковой панели, а затем **Service tokens**.
3. Нажмите **Create service token** и задайте имя токена.
4. Выберите разрешение [**Metadata Only**](/docs/dbt-apis/service-tokens). Этот токен будет использоваться для встраивания плитки в ваш дашборд на последующих шагах.
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-setup.png" width="95%" title="Настройте плитку статуса дашборда и сервисный токен для встраивания плитки состояния данных" />

5. Скопируйте токен **Metadata Only** и сохраните его в безопасном месте. Он понадобится вам на следующих шагах.
6. Вернитесь в <Constant name="catalog" /> и выберите экспозицию.

   :::tip
      У экспозиции, используемой для плитки состояния данных, [свойство `type`](/docs/build/exposures#available-properties) должно иметь значение `dashboard`. В противном случае раскрывающийся блок **Embed data health tile in your dashboard** не будет отображаться в <Constant name="catalog" />.
   :::

7. Под разделом **Data health** раскройте блок с инструкциями по встраиванию плитки экспозиции (если вы администратор аккаунта с разрешениями на разработку). 
8. В раскрытом блоке вы увидите текстовое поле, в которое можно вставить ваш **токен Metadata Only**.
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-example.png" width="85%" title="Раскройте блок, чтобы встроить плитку состояния данных в ваш дашборд." />

9. После того как вы вставили ваш токен, вы можете выбрать либо **URL**, либо **iFrame** в зависимости от того, что вам нужно добавить на вашу панель.

Если ваш аналитический инструмент поддерживает iFrames, вы можете встроить в него тайл дашборда.

Если ваш инструмент аналитики поддерживает iFrame, вы можете встроить в него плитку дашборда. 

## Примеры
В следующих примерах показано, как встроить плитку состояния данных в Omni, PowerBI, Tableau и Sigma.

<Tabs>
<TabItem value="omni" label="Omni example">

Follow these steps to embed the data health tile in [Omni](https://omni.co/):

<Lightbox src="/img/docs/collaborate/dbt-explorer/omni-example.png" width="90%" title="Embed data health tile in Omni"/>

1. Create a dashboard in Omni.
2. Copy the iFrame snippet available in <Constant name="catalog" />'s **Data health** section, under the **Embed data health into your dashboard** toggle.
3. Add a new Text or Markdown [element](https://docs.omni.co/visualize-present/dashboards/text-markdown) in your Dashboard with the code from step 2, it should be in the following format:

   ```html/text
    <iframe src='https://YOUR_ACCOUNT_PREFIX.metadata.REGION.dbt.com/exposure-tile?uniqueId=exposure.EXPOSURE_NAME&environmentType=production&environmentId=ENV_ID_NUMBER&token=<YOUR_METADATA_TOKEN>' title='Exposure Status Tile'></iframe>
    ```
4. Save the tile and your Omni dashboard should now have a <Constant name="dbt_platform" /> hosted data health tile that is automatically updated based on the state of your dbt environment.

</TabItem>

<TabItem value="powerbi" label="Пример для PowerBI">

Вы можете встроить iFrame плитки состояния данных в PowerBI, используя PowerBI Pro Online, Fabric PowerBI или PowerBI Desktop. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/power-bi.png" width="80%" title="Встраивание iFrame плитки состояния данных в PowerBI"/>

Следуйте этим шагам, чтобы встроить плитку состояния данных в PowerBI:

1. Создайте панель в PowerBI и подключитесь к вашей базе данных, чтобы загрузить данные.
2. Создайте новую меру PowerBI, щелкнув правой кнопкой мыши на **Data**, **More options**, затем **New measure**.
<Lightbox src="/img/docs/collaborate/dbt-explorer/power-bi-measure.png" width="80%" title="Создание новой меры PowerBI."/>

3. Перейдите в <Constant name="catalog" />, выберите экспозицию и разверните раздел [**Встройте индикатор состояния данных в свой дашборд**](/docs/explore/data-tile#embed-in-your-dashboard). 
4. Перейдите на вкладку **iFrame** и скопируйте код iFrame. Убедитесь, что токен Metadata Only уже настроен.
5. В PowerBI вставьте скопированный код iFrame в окно вычисления меры. Код iFrame должен выглядеть следующим образом:

    ```html/text
    <iframe src='https://1234.metadata.ACCESS_URL/exposure-tile?uniqueId=exposure.EXPOSURE_NAME&environmentType=staging&environmentId=123456789&token=YOUR_METADATA_TOKEN' title='Exposure status tile' height='400'></iframe>
    ```

    <Lightbox src="/img/docs/collaborate/dbt-explorer/power-bi-measure-tools.png" width="90%" title="На вкладке 'Measure tools' замените ваши значения на код iFrame."/>

6. PowerBI Desktop не поддерживает рендеринг HTML по умолчанию, поэтому вам нужно установить компонент HTML из PowerBI Visuals Store.
7. Для этого перейдите в **Build visuals**, затем **Get more visuals**.
8. Войдите в систему с вашей учетной записью PowerBI.
9. Существует несколько сторонних HTML визуализаций. Тот, который был протестирован для этого руководства, это [HTML content](https://appsource.microsoft.com/en-us/product/power-bi-visuals/WA200001930?tab=Overview). Установите его, но имейте в виду, что это сторонний плагин, не созданный и не поддерживаемый dbt Labs.
10. Перетащите метрику с кодом iFrame в виджет HTML content в PowerBI. Теперь это должно отображать вашу плитку состояния данных.

<Lightbox src="/img/docs/collaborate/dbt-explorer/power-bi-final.png" width="80%" title="Перетащите метрику с кодом iFrame в виджет HTML content в PowerBI. Теперь это должно отображать вашу плитку состояния данных."/>

*Обратитесь к [этому руководству](https://www.youtube.com/watch?v=SUm9Hnq8Th8) для получения дополнительной информации о встраивании веб-сайта в ваш отчет Power BI.*

</TabItem>

<TabItem value="tableau" label="Пример для Tableau">

Следуйте этим шагам, чтобы встроить плитку состояния данных в Tableau:

<Lightbox src="/img/docs/collaborate/dbt-explorer/tableau-example.png" width="80%" title="Встраивание iFrame плитки состояния данных в Tableau"/>

1. Создайте дашборд в Tableau и подключитесь к своей базе данных, чтобы загрузить данные.
2. Скопируйте URL или фрагмент iFrame из раздела **Data health** в <Constant name="catalog" />, раскрыв пункт **Embed data health into your dashboard**.
3. Вставьте объект **Web Page**.
4. Вставьте скопированный URL и нажмите **Ok**.

   URL, скопированный из <Constant name="catalog" />, выглядит примерно так, как показано ниже, но может содержать дополнительные параметры, специфичные для Tableau (например, `biResourceId` и `autoBiProvider=tableau`), которые необходимы для определения экспозиции:

    ```text/html
    https://metadata.ACCESS_URL/exposure-tile?uniqueId=exposure.EXPOSURE_NAME&environmentType=production&environmentId=220370&token=<YOUR_METADATA_TOKEN>
    ```

5. Теперь вы должны увидеть плитку состояния данных, встроенную в вашу панель мониторинга Tableau.

</TabItem>

<TabItem value="sigma" label="Пример для Sigma">

Следуйте этим шагам, чтобы встроить плитку состояния данных в Sigma:

<Lightbox src="/img/docs/collaborate/dbt-explorer/sigma-example.jpg" width="90%" title="Встраивание плитки состояния данных в Sigma"/>

1. Создайте дашборд в Sigma и подключитесь к своей базе данных, чтобы загрузить данные.
2. Убедитесь, что вы скопировали URL или фрагмент кода iFrame из раздела **Состояние данных** в <Constant name="catalog" />, раскрыв пункт **Встроить сведения о состоянии данных в дашборд**.
3. Добавьте новый встраиваемый элемент интерфейса в свою рабочую книгу Sigma в следующем формате:

    ```html/text
    https://metadata.ACCESS_URL/exposure-tile?uniqueId=exposure.EXPOSURE_NAME&environmentType=production&environmentId=ENV_ID_NUMBER&token=<YOUR_METADATA_TOKEN>
    ```

    *Примечание: замените заполнители на ваши фактические значения.*
4. Теперь вы должны увидеть плитку состояния данных, встроенную в вашу панель Sigma.

</TabItem>

</Tabs>

## Основанное на заданиях состояние данных <Lifecycle status="Legacy"/> {#job-based-data-health}

По умолчанию в <Constant name="catalog" /> используется [плитка состояния данных на основе окружения](#view-exposure-in-dbt-catalog).

Этот раздел предназначен для устаревших плиток состояния данных, основанных на заданиях. Если вы используете обновленную плитку экспозиции, основанную на окружении, обратитесь к предыдущему разделу. Разверните следующее, чтобы узнать больше об устаревшей плитке состояния данных, основанной на заданиях.

<Expandable alt_header="Job-based data health">  
В <Constant name="dbt" /> [Discovery API](/docs/dbt-apis/discovery-api) позволяет отображать на дашбордах индикаторы состояния на основе заданий. Индикатор состояния размещается на дашборде (точнее, в любом месте, где можно встроить iFrame) и позволяет оценить качество и актуальность данных, используемых в этом дашборде. Это реализуется с помощью [экспозиций (exposures)](/docs/build/exposures) в dbt.

#### Функциональность {#functionality}
Плитка состояния панели выглядит следующим образом:

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dashboard-status-tiles/passing-tile.jpeg"/>

Проверка свежести данных не проходит, если какие-либо источники, поступающие в экспозицию, устарели. Проверка качества данных не проходит, если какие-либо тесты dbt не проходят. Состояние ошибки может выглядеть следующим образом:

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dashboard-status-tiles/failing-tile.jpeg"/>

Нажатие на **see details** из плитки состояния панели перенаправляет вас на страницу, где вы можете узнать больше о конкретных источниках, моделях и тестах, поступающих в эту экспозицию.

#### Настройка {#setup}
Сначала убедитесь, что включена [свежесть источников](/docs/deploy/source-freshness) в задании, которое генерирует эту экспозицию.

Для настройки плитки состояния панели вам потребуется:

1. **Токен Metadata Only.**  О том, как настроить токен Metadata-Only, можно узнать [здесь](/docs/dbt-apis/service-tokens).

2. **Название экспозиции.** Вы можете узнать больше о том, как настроить экспозиции [здесь](/docs/build/exposures).

3. **ID задания.** Помните, что вы можете скопировать ID задания прямо из URL при просмотре соответствующего задания в <Constant name="dbt" />.

Вы можете вставить эти три поля в следующий iFrame и затем встроить его **в любом месте, где вы можете встроить iFrame**:

```html/text
<iframe src='https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>' title='Exposure Status Tile'></iframe>
```

:::tip Замените `YOUR_ACCESS_URL` на URL доступа для вашего региона и плана

<Constant name="dbt" /> размещается в нескольких регионах мира, и у каждого региона свой URL-адрес доступа. Замените `YOUR_ACCESS_URL` на соответствующий [URL-адрес доступа](/docs/platform/about-platform/access-regions-ip-addresses) для вашего региона и тарифного плана. Например, если ваша учетная запись размещена в регионе EMEA, используйте следующий код iFrame:

```html/text
<iframe src='https://metadata.emea.dbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>' title='Exposure Status Tile'></iframe>
```

:::

#### Встраивание с BI инструментами {#embedding-with-bi-tools}
Плитка состояния панели должна работать в любом месте, где вы можете встроить iFrame. Но ниже приведены некоторые тактические советы о том, как интегрироваться с распространенными BI инструментами.

<Tabs>
<TabItem value="mode" label="Mode">

#### Mode {#mode}
Mode позволяет вам напрямую [редактировать HTML](https://mode.com/help/articles/report-layout-and-presentation/#html-editor) любого данного отчета, где вы можете встроить iFrame.

Обратите внимание, что Mode также разработал собственную [интеграцию](https://mode.com/get-dbt/) с <Constant name="dbt" /> Discovery API!
</TabItem>

<TabItem value="looker" label="Looker">

#### Looker {#looker}
Looker не позволяет вам напрямую встраивать HTML и вместо этого требует создания [пользовательской визуализации](https://docs.looker.com/admin-options/platform/visualizations). Один из способов сделать это для администраторов:
- Добавьте [новую визуализацию](https://fishtown.looker.com/admin/visualizations) на странице визуализаций для администраторов Looker. Вы можете использовать [этот URL](https://metadata.cloud.getdbt.com/static/looker-viz.js) для настройки визуализации Looker, поддерживаемой iFrame. Это будет выглядеть следующим образом:

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dashboard-status-tiles/looker-visualization.jpeg" title="Настройка визуализации Looker на основе iFrame" />

- После того как вы настроили свою пользовательскую визуализацию, вы можете использовать ее на любой панели! Вы можете настроить ее с названием экспозиции, ID задания и токеном, относящимися к этой панели.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dashboard-status-tiles/custom-looker.jpeg" width="60%"/>
</TabItem>

<TabItem value="tableau" label="Tableau">

#### Tableau {#tableau}
Tableau не требует от вас встраивания iFrame. Вам нужно только использовать объект Web Page на вашей панели Tableau и URL в следующем формате:

```html/text
https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>
```

:::tip Замените `YOUR_ACCESS_URL` на URL доступа для вашего региона и плана

<Constant name="dbt" /> размещается в нескольких регионах мира, и у каждого региона свой URL-адрес доступа. Замените `YOUR_ACCESS_URL` на соответствующий [URL-адрес доступа](/docs/platform/about-platform/access-regions-ip-addresses) для вашего региона и тарифного плана. Например, если ваша учётная запись размещена в регионе Северной Америки, используйте следующий код:

```html/text
https://metadata.cloud.getdbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>

```
:::

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dashboard-status-tiles/tableau-object.png" width="60%" title="Настройте Tableau с помощью объекта «Веб-страница»." />
</TabItem>

<TabItem value="sigma" label="Sigma">

#### Sigma {#sigma}

Sigma не требует от вас встраивания iFrame. Добавьте новый встроенный элемент UI в вашу Sigma Workbook в следующем формате:

```html/text
https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>
```

:::tip Замените `YOUR_ACCESS_URL` на URL доступа для вашего региона и плана

<Constant name="dbt" /> размещается в нескольких регионах мира, и у каждого региона свой URL для доступа. Замените `YOUR_ACCESS_URL` на соответствующий [URL для доступа](/docs/platform/about-platform/access-regions-ip-addresses) для вашего региона и тарифного плана. Например, если ваша учетная запись размещена в регионе APAC, используйте следующий код:

```html/text
https://metadata.au.dbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>

```
:::

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dashboard-status-tiles/sigma-embed.gif" width="60%" title="Настройте Sigma с помощью встроенного элемента интерфейса." />
</TabItem>
</Tabs>

</Expandable>
