---
title: "Плитка состояния данных"
id: "data-tile"
sidebar_label: "Плитка состояния данных"
description: "Встраивайте плитки состояния данных в свои панели, чтобы передавать сигналы доверия потребителям данных."
image: /img/docs/collaborate/dbt-explorer/data-tile-pass.jpg
---

# Тайл состояния данных <Lifecycle status="managed,managed_plus" />

С помощью тайлов состояния данных заинтересованные стороны могут с первого взгляда понять, являются ли данные, на которые они смотрят, устаревшими или деградировавшими. Это позволяет командам сразу вернуться в <Constant name="explorer" />, чтобы получить больше подробностей и заняться расследованием проблем.

Плитка состояния данных:

- Обобщает [сигналы здоровья данных](/docs/explore/data-health-signals) для потребителей данных.
- Позволяет перейти по глубокой ссылке в <Constant name="explorer" />, где можно подробнее изучить проблемы с вышележащими (upstream) данными.
- Предоставляет более подробную информацию и упрощает отладку.
- Обновляет существующие [тайлы на основе заданий (job-based)](#job-based-data-health).

Тайлы здоровья данных опираются на [exposures](/docs/build/exposures), чтобы отображать сигналы здоровья данных на ваших дашбордах. Exposure определяет, как конкретные выходные артефакты &mdash; такие как дашборды или отчёты &mdash; зависят от ваших моделей данных. В dbt exposures можно настраивать двумя способами:

- **Manual** &mdash; Определяются [вручную](/docs/build/exposures#declaring-an-exposure) и явно задаются в YAML-файлах вашего проекта.
- **Automatic** &mdash; Автоматически подтягиваются для поддерживаемых интеграций <Constant name="cloud" />. <Constant name="cloud" /> автоматически [создаёт и визуализирует downstream exposures](/docs/cloud-integrations/downstream-exposures), устраняя необходимость в ручных YAML-определениях. Эти downstream exposures хранятся в системе метаданных dbt, отображаются в [<Constant name="explorer" />](/docs/explore/explore-projects) и ведут себя так же, как и ручные exposures, однако они не существуют в YAML-файлах.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-pass.jpg" width="60%" title="Пример успешной плитки состояния данных на вашей панели." />
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tiles.png" width="60%" title="Встраивайте плитки состояния данных в свои панели, чтобы передавать сигналы доверия потребителям данных." />
</DocCarousel>

## Предварительные условия

- У вас должна быть учетная запись <Constant name="cloud" /> на тарифе уровня [Enterprise](https://www.getdbt.com/pricing/).
- Вы должны быть администратором учетной записи, чтобы настроить [service tokens](/docs/dbt-cloud-apis/service-tokens#permissions-for-service-account-tokens).
- У вас должны быть [права develop](/docs/cloud/manage-access/seats-and-users).
- В вашем проекте должны быть определены [exposures](/docs/build/exposures):
  - Если вы используете ручные exposures, они должны быть явно определены в ваших YAML-файлах.
  - Если вы используете автоматические downstream exposures, убедитесь, что ваш BI-инструмент [настроен](/docs/cloud-integrations/downstream-exposures-tableau) для работы с <Constant name="cloud" />.
- В задании (job), которое генерирует этот exposure, должна быть включена [source freshness](/docs/deploy/source-freshness).
- Exposure, используемый для плитки data health, должен иметь [`type` property](/docs/build/exposures#available-properties), установленное в значение `dashboard`. В противном случае вы не сможете увидеть выпадающий список **Embed data health tile in your dashboard** в <Constant name="explorer" />.

## Просмотр exposure в dbt Catalog

Сначала убедитесь, что включена [свежесть источников](/docs/deploy/source-freshness) в задании, которое генерирует эту экспозицию.

1. Перейдите в <Constant name="explorer" />, нажав на ссылку **Explore** в навигации.
2. На основной странице **Overview** перейдите к левой панели навигации.
3. На вкладке **Resources** нажмите **Exposures**, чтобы просмотреть список [exposures](/docs/build/exposures).
4. Выберите exposure для дашборда и перейдите на вкладку **General**, чтобы посмотреть информацию о состоянии данных.
5. На этой вкладке вы увидите:  
   - Имя exposure.  
   - Статус data health: Актуальность данных пройдена, Качество данных пройдено, Данные могут быть устаревшими, Качество данных ухудшено.  
   - Тип ресурса (model, source и так далее).  
   - Статус дашборда: Сбой, Пройдено, Устаревший.  
   - Также отображаются время последней выполненной проверки, время последней проверки и её длительность.
6. Вы можете нажать кнопку **Open Dashboard** в правом верхнем углу, чтобы сразу открыть дашборд в вашем аналитическом инструменте.

<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-exposures.jpg" width="95%" title="Просмотреть exposure в dbt Catalog." />

## Встраивание в вашу панель

После того как вы перейдёте к exposure в <Constant name="explorer" />, вам нужно будет настроить **data health tile** и [service token](/docs/dbt-cloud-apis/service-tokens). Вы можете встроить **data health tile** в любой аналитический инструмент, который поддерживает встраивание через URL или iFrame.

Следуйте этим шагам, чтобы настроить плитку состояния данных:

1. Перейдите в **Account settings** в <Constant name="cloud" />.
2. В левой боковой панели выберите **API tokens**, затем — **Service tokens**.
3. Нажмите **Create service token** и задайте для него имя.
4. Выберите разрешение [**Metadata Only**](/docs/dbt-cloud-apis/service-tokens). Этот токен будет использоваться для встраивания плитки в ваш дашборд на следующих шагах.
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-setup.jpg" width="95%" title="Настройте плитку статуса дашборда и сервисный токен, чтобы встроить плитку data health" />

5. Скопируйте токен **Metadata Only** и сохраните его в безопасном месте. Он понадобится вам на следующих шагах.
6. Вернитесь в <Constant name="explorer" /> и выберите exposure.

   :::tip
      Exposure, используемый для плитки состояния данных, должен иметь [`type` property](/docs/build/exposures#available-properties), установленное в значение `dashboard`. В противном случае вы не увидите выпадающий список **Embed data health tile in your dashboard** в <Constant name="explorer" />.
   :::

7. Ниже раздела **Data health** разверните переключатель с инструкциями о том, как встроить плитку exposure (если вы являетесь администратором аккаунта с правами develop).
8. В развернутом блоке вы увидите текстовое поле, куда можно вставить ваш **Metadata Only token**.
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-example.jpg" width="85%" title="Разверните переключатель, чтобы встроить плитку data health в ваш дашборд." />

9. После того как вы вставили ваш токен, вы можете выбрать либо **URL**, либо **iFrame** в зависимости от того, что вам нужно добавить на вашу панель.

Если ваш аналитический инструмент поддерживает iFrames, вы можете встроить в него тайл дашборда.

## Examples
Следующие примеры показывают, как встроить тайл состояния данных (data health tile) в PowerBI, Tableau и Sigma.

<Tabs>

<TabItem value="powerbi" label="Пример для PowerBI">

Вы можете встроить iFrame плитки состояния данных в PowerBI, используя PowerBI Pro Online, Fabric PowerBI или PowerBI Desktop. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/power-bi.png" width="80%" title="Встраивание iFrame плитки состояния данных в PowerBI"/>

Следуйте этим шагам, чтобы встроить плитку состояния данных в PowerBI:

1. Создайте панель в PowerBI и подключитесь к вашей базе данных, чтобы загрузить данные.
2. Создайте новую меру PowerBI, щелкнув правой кнопкой мыши на **Data**, **More options**, затем **New measure**.
<Lightbox src="/img/docs/collaborate/dbt-explorer/power-bi-measure.png" width="80%" title="Создание новой меры PowerBI."/>

3. Перейдите в <Constant name="explorer" />, выберите exposure и разверните переключатель [**Embed data health into your dashboard**](/docs/explore/data-tile#embed-in-your-dashboard).  
4. Перейдите на вкладку **iFrame** и скопируйте iFrame‑код. Убедитесь, что токен **Metadata Only** уже настроен.  
5. В PowerBI вставьте скопированный iFrame‑код в окно расчёта measure. iFrame‑код должен выглядеть следующим образом:

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

1. Создайте дашборд в Tableau и подключитесь к вашей базе данных, чтобы загрузить данные.
2. Убедитесь, что вы скопировали URL или iFrame‑фрагмент, доступный в разделе **Data health** в <Constant name="explorer" />, под переключателем **Embed data health into your dashboard**.
3. Добавьте объект **Web Page**.
4. Вставьте URL и нажмите **Ok**.

    ```text/html
    https://metadata.ACCESS_URL/exposure-tile?uniqueId=exposure.EXPOSURE_NAME&environmentType=production&environmentId=220370&token=<YOUR_METADATA_TOKEN>
    ```

    *Примечание: замените заполнители на ваши фактические значения.*
5. Теперь вы должны увидеть плитку состояния данных, встроенную в вашу панель Tableau.

</TabItem>

<TabItem value="sigma" label="Пример для Sigma">

Следуйте этим шагам, чтобы встроить плитку состояния данных в Sigma:

<Lightbox src="/img/docs/collaborate/dbt-explorer/sigma-example.jpg" width="90%" title="Встраивание плитки состояния данных в Sigma"/>

1. Создайте дашборд в Sigma и подключите его к вашей базе данных, чтобы загрузить данные.
2. Убедитесь, что вы скопировали URL или iFrame‑фрагмент, доступный в разделе **Data health** в <Constant name="explorer" />, под переключателем **Embed data health into your dashboard**.
3. Добавьте новый встроенный UI‑элемент в ваш Sigma Workbook в следующем формате:

    ```html/text
    https://metadata.ACCESS_URL/exposure-tile?uniqueId=exposure.EXPOSURE_NAME&environmentType=production&environmentId=ENV_ID_NUMBER&token=<YOUR_METADATA_TOKEN>
    ```

    *Примечание: замените заполнители на ваши фактические значения.*
4. Теперь вы должны увидеть плитку состояния данных, встроенную в вашу панель Sigma.

</TabItem>

</Tabs>

## Основанное на заданиях состояние данных <Lifecycle status="Legacy"/>

По умолчанию используется [плитка состояния данных на основе окружений](#view-exposure-in-dbt-explorer) в <Constant name="explorer" />.

Этот раздел предназначен для устаревших плиток состояния данных, основанных на заданиях. Если вы используете обновленную плитку экспозиции, основанную на окружении, обратитесь к предыдущему разделу. Разверните следующее, чтобы узнать больше об устаревшей плитке состояния данных, основанной на заданиях.

<Expandable alt_header="Job-based data health">  
В <Constant name="cloud" /> [Discovery API](/docs/dbt-cloud-apis/discovery-api) может использоваться для формирования статусных плиток дашбордов, которые привязаны к джобам. Статусная плитка дашборда размещается на дашборде (а именно — в любом месте, где можно встроить iFrame) и позволяет получить представление о качестве и актуальности данных, которые используются в этом дашборде. Это реализуется с помощью dbt [exposures](/docs/build/exposures).

#### Функциональность
Плитка состояния панели выглядит следующим образом:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/passing-tile.jpeg"/>

Проверка свежести данных не проходит, если какие-либо источники, поступающие в экспозицию, устарели. Проверка качества данных не проходит, если какие-либо тесты dbt не проходят. Состояние ошибки может выглядеть следующим образом:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/failing-tile.jpeg"/>

Нажатие на **see details** из плитки состояния панели перенаправляет вас на страницу, где вы можете узнать больше о конкретных источниках, моделях и тестах, поступающих в эту экспозицию.

#### Настройка
Сначала убедитесь, что включена [свежесть источников](/docs/deploy/source-freshness) в задании, которое генерирует эту экспозицию.

Для настройки плитки состояния панели вам потребуется:

1. **Токен только для метаданных.** Вы можете узнать, как настроить токен только для метаданных [здесь](/docs/dbt-cloud-apis/service-tokens).

2. **Название экспозиции.** Вы можете узнать больше о том, как настроить экспозиции [здесь](/docs/build/exposures).

3. **Job iD.** Помните, что вы можете взять идентификатор job (job ID) напрямую из URL, когда просматриваете соответствующую job в <Constant name="cloud" />.

Вы можете вставить эти три поля в следующий iFrame и затем встроить его **в любом месте, где вы можете встроить iFrame**:

```html/text
<iframe src='https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>' title='Exposure Status Tile'></iframe>
```

:::tip Замените `YOUR_ACCESS_URL` на URL доступа для вашего региона и плана

<Constant name="cloud" /> размещён в нескольких регионах по всему миру, и у каждого региона есть свой собственный URL для доступа. Замените `YOUR_ACCESS_URL` на соответствующий [Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и тарифного плана. Например, если ваш аккаунт размещён в регионе EMEA, вам следует использовать следующий код iFrame:

```html/text
<iframe src='https://metadata.emea.dbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>' title='Exposure Status Tile'></iframe>
```

:::

#### Встраивание с BI инструментами
Плитка состояния панели должна работать в любом месте, где вы можете встроить iFrame. Но ниже приведены некоторые тактические советы о том, как интегрироваться с распространенными BI инструментами.

<Tabs>
<TabItem value="mode" label="Mode">

#### Mode
Mode позволяет вам напрямую [редактировать HTML](https://mode.com/help/articles/report-layout-and-presentation/#html-editor) любого данного отчета, где вы можете встроить iFrame.

Обратите внимание, что Mode также создала собственную [интеграцию](https://mode.com/get-dbt/) с Discovery API <Constant name="cloud" />!
</TabItem>

<TabItem value="looker" label="Looker">

#### Looker
Looker не позволяет вам напрямую встраивать HTML и вместо этого требует создания [пользовательской визуализации](https://docs.looker.com/admin-options/platform/visualizations). Один из способов сделать это для администраторов:
- Добавьте [новую визуализацию](https://fishtown.looker.com/admin/visualizations) на странице визуализаций для администраторов Looker. Вы можете использовать [этот URL](https://metadata.cloud.getdbt.com/static/looker-viz.js) для настройки визуализации Looker, поддерживаемой iFrame. Это будет выглядеть следующим образом:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/looker-visualization.jpeg" title="Настройка визуализации Looker, поддерживаемой iFrame" />

- После того как вы настроили свою пользовательскую визуализацию, вы можете использовать ее на любой панели! Вы можете настроить ее с названием экспозиции, ID задания и токеном, относящимися к этой панели.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/custom-looker.jpeg " width="60%"/>
</TabItem>

<TabItem value="tableau" label="Tableau">

#### Tableau
Tableau не требует от вас встраивания iFrame. Вам нужно только использовать объект Web Page на вашей панели Tableau и URL в следующем формате:

```html/text
https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>
```

:::tip Замените `YOUR_ACCESS_URL` на URL доступа для вашего региона и плана

<Constant name="cloud" /> размещён в нескольких регионах по всему миру, и у каждого региона есть собственный URL для доступа. Замените `YOUR_ACCESS_URL` на соответствующий [Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и тарифного плана. Например, если ваша учётная запись размещена в регионе Северной Америки, вы будете использовать следующий код:

```html/text
https://metadata.cloud.getdbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>

```
:::

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/tableau-object.png" width="60%" title="Настройка Tableau с использованием объекта Web page." />
</TabItem>

<TabItem value="sigma" label="Sigma">

#### Sigma

Sigma не требует от вас встраивания iFrame. Добавьте новый встроенный элемент UI в вашу Sigma Workbook в следующем формате:

```html/text
https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>
```

:::tip Замените `YOUR_ACCESS_URL` на URL доступа для вашего региона и плана

<Constant name="cloud" /> размещён в нескольких регионах по всему миру, и у каждого региона есть собственный URL для доступа. Замените `YOUR_ACCESS_URL` на соответствующий [Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и тарифного плана. Например, если ваш аккаунт размещён в регионе APAC, вы будете использовать следующий код:

```html/text
https://metadata.au.dbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>

```
:::

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/sigma-embed.gif" width="60%" title="Настройка Sigma с использованием встроенного элемента UI." />
</TabItem>
</Tabs>

</Expandable>
