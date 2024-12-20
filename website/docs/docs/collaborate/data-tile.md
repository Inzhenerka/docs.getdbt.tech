---
title: "Плитка состояния данных"
id: "data-tile"
sidebar_label: "Плитка состояния данных"
description: "Встраивайте плитки состояния данных в свои панели, чтобы передавать сигналы доверия потребителям данных."
image: /img/docs/collaborate/dbt-explorer/data-tile-pass.jpg
---

С помощью плиток состояния данных заинтересованные стороны смогут быстро определить, устарели ли данные или ухудшились ли они. Этот сигнал доверия позволяет командам сразу вернуться в Explorer, чтобы увидеть больше деталей и исследовать проблемы.

Плитка состояния данных:

- Передает сигналы доверия потребителям данных.
- Позволяет перейти в dbt Explorer, где можно глубже изучить проблемы с исходными данными.
- Предоставляет более богатую информацию и упрощает отладку.
- Обновляет существующие, [основанные на заданиях плитки](#job-based-data-health).

Плитки состояния данных полагаются на [экспозиции](/docs/build/exposures), чтобы отображать сигналы доверия на ваших панелях. Когда вы настраиваете экспозиции в своем проекте dbt, вы явно определяете, как конкретные выходные данные, такие как панели или отчеты, зависят от ваших моделей данных.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-pass.jpg" width="60%" title="Пример успешной плитки состояния данных на вашей панели." />
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tiles.png" width="60%" title="Встраивайте плитки состояния данных в свои панели, чтобы передавать сигналы доверия потребителям данных." />
</DocCarousel>

## Предварительные условия

- У вас должна быть учетная запись dbt Cloud на [плане Team или Enterprise](https://www.getdbt.com/pricing/).
- Вы должны быть администратором учетной записи, чтобы настроить [токены сервиса](/docs/dbt-cloud-apis/service-tokens#permissions-for-service-account-tokens).
- У вас должны быть [разрешения на разработку](/docs/cloud/manage-access/seats-and-users).
- В вашем проекте должны быть настроены [экспозиции](/docs/build/exposures) и включена [свежесть источников](/docs/deploy/source-freshness) в задании, которое генерирует эту экспозицию.

## Просмотр экспозиции в dbt Explorer

Сначала убедитесь, что включена [свежесть источников](/docs/deploy/source-freshness) в задании, которое генерирует эту экспозицию.

1. Перейдите в dbt Explorer, нажав на ссылку **Explore** в навигации.
2. На главной странице **Overview** перейдите в левую навигацию.
3. Вкладка **Resources**, нажмите на **Exposures**, чтобы просмотреть список [экспозиций](/docs/build/exposures).
4. Выберите экспозицию панели и перейдите на вкладку **General**, чтобы просмотреть информацию о состоянии данных.
5. На этой вкладке вы увидите:   
   - Название экспозиции. 
   - Статус состояния данных: Свежесть данных пройдена, Качество данных пройдено, Данные могут быть устаревшими, Качество данных ухудшено.
   - Тип ресурса (модель, источник и т.д.).
   - Статус панели: Ошибка, Пройдено, Устарело.
   - Вы также можете увидеть последнее завершенное проверку, время последней проверки и продолжительность последней проверки.
6. Вы можете нажать кнопку **Open Dashboard** в правом верхнем углу, чтобы сразу просмотреть это в вашем аналитическом инструменте.

<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-exposures.jpg" width="95%" title="Просмотр экспозиции в dbt Explorer." />

## Встраивание в вашу панель

После того как вы перешли к экспозиции в dbt Explorer, вам нужно настроить плитку состояния данных и [токен сервиса](/docs/dbt-cloud-apis/service-tokens). Вы можете встроить плитку состояния данных в любой аналитический инструмент, который поддерживает встраивание URL или iFrame.

Следуйте этим шагам, чтобы настроить плитку состояния данных:

1. Перейдите в **Account settings** в dbt Cloud.
2. Выберите **API tokens** в левой боковой панели, затем **Service tokens**.
3. Нажмите на **Create service token** и дайте ему имя.
4. Выберите разрешение [**Metadata Only**](/docs/dbt-cloud-apis/service-tokens). Этот токен будет использоваться для встраивания плитки в вашу панель на следующих шагах.
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-setup.jpg" width="95%" title="Настройте плитку состояния панели и токен сервиса для встраивания плитки состояния данных" />

5. Скопируйте токен **Metadata Only** и сохраните его в безопасном месте. Он понадобится вам на следующих шагах.
6. Вернитесь в dbt Explorer и выберите экспозицию.
7. Под разделом **Data health** разверните переключатель с инструкциями по встраиванию плитки экспозиции (если вы администратор учетной записи с разрешениями на разработку). 
8. В развернутом переключателе вы увидите текстовое поле, куда можно вставить ваш **Metadata Only token**.
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-example.jpg" width="85%" title="Разверните переключатель, чтобы встроить плитку состояния данных в вашу панель." />

9. После того как вы вставили ваш токен, вы можете выбрать либо **URL**, либо **iFrame** в зависимости от того, что вам нужно добавить на вашу панель.

Если ваш аналитический инструмент поддерживает iFrames, вы можете встроить плитку панели в него. 

### Примеры
Следующие примеры показывают, как встроить плитку состояния данных в Tableau и PowerBI.

<Tabs>

<TabItem value="powerbi" label="Пример для PowerBI">

Вы можете встроить iFrame плитки состояния данных в PowerBI, используя PowerBI Pro Online, Fabric PowerBI или PowerBI Desktop. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/power-bi.png" width="80%" title="Встраивание iFrame плитки состояния данных в PowerBI"/>

Следуйте этим шагам, чтобы встроить плитку состояния данных в PowerBI:

1. Создайте панель в PowerBI и подключитесь к вашей базе данных, чтобы загрузить данные.
2. Создайте новую меру PowerBI, щелкнув правой кнопкой мыши на **Data**, **More options**, затем **New measure**.
<Lightbox src="/img/docs/collaborate/dbt-explorer/power-bi-measure.png" width="80%" title="Создание новой меры PowerBI."/>

3. Перейдите в dbt Explorer, выберите экспозицию и разверните переключатель [**Embed data health into your dashboard**](/docs/collaborate/data-tile#embed-in-your-dashboard). 
4. Перейдите на вкладку **iFrame** и скопируйте код iFrame. Убедитесь, что токен Metadata Only уже настроен.
5. В PowerBI вставьте код iFrame, который вы скопировали, в окно расчета меры. Код iFrame должен выглядеть следующим образом:

    ```html
        Website =
        "<iframe src='https://1234.metadata.ACCESS_URL/exposure-tile?uniqueId=exposure.EXPOSURE_NAME&environmentType=staging&environmentId=123456789&token=YOUR_METADATA_TOKEN' title='Exposure status tile' height='400'></iframe>"
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

1. Создайте панель в Tableau и подключитесь к вашей базе данных, чтобы загрузить данные.
2. Убедитесь, что вы скопировали URL или фрагмент iFrame, доступный в разделе **Data health** dbt Explorer, под переключателем **Embed data health into your dashboard**.
3. Вставьте объект **Web Page**.
4. Вставьте URL и нажмите **Ok**.

    ```html
    https://metadata.ACCESS_URL/exposure-tile?uniqueId=exposure.EXPOSURE_NAME&environmentType=production&environmentId=220370&token=<YOUR_METADATA_TOKEN>
    ```

    *Примечание: замените заполнители на ваши фактические значения.*
5. Теперь вы должны увидеть плитку состояния данных, встроенную в вашу панель Tableau.

</TabItem>

<TabItem value="sigma" label="Пример для Sigma">

Следуйте этим шагам, чтобы встроить плитку состояния данных в Sigma:

<Lightbox src="/img/docs/collaborate/dbt-explorer/sigma-example.jpg" width="90%" title="Встраивание плитки состояния данных в Sigma"/>

1. Создайте панель в Sigma и подключитесь к вашей базе данных, чтобы загрузить данные.
2. Убедитесь, что вы скопировали URL или фрагмент iFrame, доступный в разделе **Data health** dbt Explorer, под переключателем **Embed data health into your dashboard**.
3. Добавьте новый встроенный элемент UI в вашу Sigma Workbook в следующем формате:

    ```html
    https://metadata.ACCESS_URL/exposure-tile?uniqueId=exposure.EXPOSURE_NAME&environmentType=production&environmentId=ENV_ID_NUMBER&token=<YOUR_METADATA_TOKEN>
    ```

    *Примечание: замените заполнители на ваши фактические значения.*
4. Теперь вы должны увидеть плитку состояния данных, встроенную в вашу панель Sigma.

</TabItem>

</Tabs>

## Основанное на заданиях состояние данных <Lifecycle status="Legacy"/>

По умолчанию используется [основанная на окружении плитка состояния данных](#view-exposure-in-dbt-explorer) с dbt Explorer.

Этот раздел предназначен для устаревших плиток состояния данных, основанных на заданиях. Если вы используете обновленную плитку экспозиции, основанную на окружении, обратитесь к предыдущему разделу. Разверните следующее, чтобы узнать больше об устаревшей плитке состояния данных, основанной на заданиях.

<Expandable alt_header="Основанное на заданиях состояние данных">  
В dbt Cloud [Discovery API](/docs/dbt-cloud-apis/discovery-api) может поддерживать плитки состояния панели, которые основаны на заданиях. Плитка состояния панели размещается на панели (конкретно: в любом месте, где вы можете встроить iFrame), чтобы дать представление о качестве и свежести данных, поступающих в эту панель. Это делается в dbt [экспозициях](/docs/build/exposures).

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

3. **ID задания.** Помните, что вы можете выбрать ID задания прямо из URL, просматривая соответствующее задание в dbt Cloud.

Вы можете вставить эти три поля в следующий iFrame и затем встроить его **в любом месте, где вы можете встроить iFrame**:

```
<iframe src='https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>' title='Exposure Status Tile'></iframe>
```

:::tip Замените `YOUR_ACCESS_URL` на URL доступа для вашего региона и плана

dbt Cloud размещен в нескольких регионах мира, и каждый регион имеет свой URL доступа. Замените `YOUR_ACCESS_URL` на соответствующий [URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана. Например, если ваша учетная запись размещена в регионе EMEA, вы бы использовали следующий код iFrame:

```
<iframe src='https://metadata.emea.dbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>' title='Exposure Status Tile'></iframe>
```

:::

#### Встраивание с BI инструментами
Плитка состояния панели должна работать в любом месте, где вы можете встроить iFrame. Но ниже приведены некоторые тактические советы о том, как интегрироваться с распространенными BI инструментами.

<Tabs>
<TabItem value="mode" label="Mode">

#### Mode
Mode позволяет вам напрямую [редактировать HTML](https://mode.com/help/articles/report-layout-and-presentation/#html-editor) любого данного отчета, где вы можете встроить iFrame.

Обратите внимание, что Mode также создал свою собственную [интеграцию](https://mode.com/get-dbt/) с dbt Cloud Discovery API!
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

```
https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>
```

:::tip Замените `YOUR_ACCESS_URL` на URL доступа для вашего региона и плана

dbt Cloud размещен в нескольких регионах мира, и каждый регион имеет свой URL доступа. Замените `YOUR_ACCESS_URL` на соответствующий [URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана. Например, если ваша учетная запись размещена в регионе Северной Америки, вы бы использовали следующий код:

```
https://metadata.cloud.getdbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>

```
:::

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/tableau-object.png" width="60%" title="Настройка Tableau с использованием объекта Web page." />
</TabItem>

<TabItem value="sigma" label="Sigma">

#### Sigma

Sigma не требует от вас встраивания iFrame. Добавьте новый встроенный элемент UI в вашу Sigma Workbook в следующем формате:

```
https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>
```

:::tip Замените `YOUR_ACCESS_URL` на URL доступа для вашего региона и плана

dbt Cloud размещен в нескольких регионах мира, и каждый регион имеет свой URL доступа. Замените `YOUR_ACCESS_URL` на соответствующий [URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана. Например, если ваша учетная запись размещена в регионе APAC, вы бы использовали следующий код:

```
https://metadata.au.dbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>

```
:::

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/sigma-embed.gif" width="60%" title="Настройка Sigma с использованием встроенного элемента UI." />
</TabItem>
</Tabs>

</Expandable>