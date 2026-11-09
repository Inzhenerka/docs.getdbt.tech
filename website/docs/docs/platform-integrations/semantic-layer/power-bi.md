---
title: "Power BI"
description: "Используйте Power BI для выполнения запросов к dbt Semantic Layer и построения дашбордов на основе доверенных данных."
tags: [Semantic Layer]
sidebar_label: "Power BI"
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

# Power BI <Lifecycle status="preview" />

Интеграция с Power BI позволяет напрямую выполнять запросы к <Constant name="semantic_layer" />, что дает возможность строить дашборды в Power BI на основе доверенных, актуальных данных. Интеграция обеспечивает живое подключение к <Constant name="semantic_layer" /> через Power BI Desktop или Power BI Service.

:::info
Эта интеграция в настоящее время доступна в предварительной версии. Готовность к использованию в производственной среде зависит от участия Microsoft в стандарте Apache Ossie.

Используете Power BI? Вы можете повлиять на будущее этой интеграции. Узнайте у своего представителя Microsoft о поддержке Ossie!
:::

## Предварительные требования

- Вы [настроили <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- Вы используете поддерживаемый [канал выпуска <Constant name="dbt" />](/docs/dbt-versions/dbt-release-tracks) или dbt версии 1.6 или выше.
- Вы установили [Power BI Desktop или Power BI On-premises Data Gateway](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-custom-connectors).
  - Power BI Service не поддерживает пользовательские коннекторы напрямую. Чтобы использовать коннектор в Power BI Service, необходимо установить и настроить его на локальном шлюзе данных (On-premises Data Gateway).
- Для входа вам понадобятся [адрес хоста <Constant name="dbt" />](/docs/use-dbt-semantic-layer/setup-sl#3-view-connection-detail), [идентификатор среды (Environment ID)](/docs/use-dbt-semantic-layer/setup-sl#administer-the-semantic-layer-1) и [сервисный токен](/docs/dbt-apis/service-tokens) или [персональный токен доступа](/docs/dbt-apis/user-tokens). Для этой учетной записи должен быть настроен <Constant name="semantic_layer" />.
- У вас должна быть [учетная запись](https://www.getdbt.com/pricing) <Constant name="dbt" /> на тарифе Starter или Enterprise. Подходит как для мультитенантного (Multi-tenant), так и для однотенантного (Single-tenant) развертывания.

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Установка коннектора {#install-the-connector}

:::important версии Power BI

Коннектор Power BI может быть несовместим с более ранними версиями Power BI Desktop. Для наилучших результатов рекомендуем установить последнюю версию непосредственно из [Microsoft Store](https://apps.microsoft.com/detail/9ntxr16hnw1t?hl=en-US&gl=US) или [Центра загрузки](https://www.microsoft.com/en-us/download/details.aspx?id=58494).

:::

Коннектор Power BI для <Constant name="semantic_layer" /> состоит из пользовательского коннектора Power BI `.pqx` и драйвера ODBC. Установите оба компонента с помощью нашего установщика для Windows, выполнив следующие действия:

1. Скачайте и установите [установщик `.msi`](https://github.com/dbt-labs/semantic-layer-powerbi-connector/releases/download/v1.0.0/dbt.Semantic.Layer.for.Power.BI.zip)

2. Запустите установщик и следуйте инструкциям на экране, чтобы установить драйвер ODBC и коннектор для Power BI Desktop.

### Проверка установки {#verify-installation}

Обратите внимание: пользователям более ранних версий Power BI может потребоваться [настроить коннектор](#configure-the-connector), прежде чем они смогут проверить установку. 

Чтобы проверить установку:

1. Откройте **ODBC Data Sources (64-bit)** на своём компьютере.
2. Перейдите на вкладку **System DSN** и убедитесь, что `dbt Labs ODBC DSN` зарегистрирован. 
3. Перейдите на вкладку **Drivers** и убедитесь, что `dbt Labs ODBC Driver` установлен.
4. Откройте Power BI Desktop, перейдите в **Settings**, затем в **Data Source Settings**. Убедитесь, что коннектор `dbt Semantic Layer` загружен корректно.

Чтобы опубликованные отчеты в Power BI Service могли использовать коннектор, IT-администратор вашей организации должен установить и настроить его в On-premises Data Gateway.

## Для ИТ-администраторов {#for-it-admins}

Этот раздел предназначен для IT-администраторов, которые устанавливают ODBC-драйвер и коннектор в On-premises Data Gateway.

Чтобы опубликованные отчёты могли использовать коннектор в Power BI Service, ИТ-администратор должен установить и настроить его:

1. Установите драйвер ODBC и коннектор в локальный шлюз данных (On-premises Data Gateway). Запустите тот же установщик `.msi`, который использовался для Power BI Desktop, и выполните установку на компьютере, где размещён шлюз.
2. Скопируйте файл коннектора в каталог шлюза:
   1. Найдите файл `.pqx`: `C:\Users\<YourUser>\Documents\Power BI Desktop\Custom Connectors\dbtSemanticLayer.pqx`.
   2. Скопируйте его в каталог пользовательских коннекторов локального шлюза данных Power BI: `C:\Windows\ServiceProfiles\PBIEgwService\Documents\Power BI Desktop\Custom Connectors`.
3. Проверьте установку, выполнив действия из раздела [Установка коннектора](#verify-installation).
4. Включите коннектор в Power BI Enterprise Gateway:
   1. Откройте `EnterpriseGatewayConfigurator.exe`.
   2. Перейдите в раздел **Connectors**. 
   3. Убедитесь, что коннектор `dbt Semantic Layer` установлен и активен.

Для получения дополнительной информации о настройке пользовательских коннекторов в Power BI On-premises Data Gateway обратитесь к [официальной документации Power BI](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-custom-connectors).

## Настройка коннектора {#configure-the-connector}

После установки коннектора вам потребуется настроить учетные данные проекта для подключения к <Constant name="semantic_layer" /> из отчета.

После установки коннектора необходимо настроить учетные данные проекта, чтобы подключиться к <Constant name="semantic_layer" /> из отчета.

1. Создайте пустой отчет.
2. В левом верхнем углу нажмите **Get data**.
3. Найдите <Constant name="semantic_layer" />, затем нажмите **Connect**.
4. Укажите данные подключения. Значения Host и Environment ID можно найти в настройках <Constant name="semantic_layer" /> для вашего проекта <Constant name="dbt" />.
   :::tip 
   Убедитесь, что в разделе **Data Connectivity mode** выбран **DirectQuery**, так как коннектор <Constant name="semantic_layer" /> не поддерживает режим **Import**. Подробнее см. в разделе [Considerations](#considerations). 
   :::
5. Нажмите **OK**, чтобы продолжить.
   <Lightbox src="/img/docs/platform-integrations/sl-pbi/pbi-directquery.jpg" title="Выберите режим DirectQuery" />
6. На следующем экране вставьте свой сервисный или персональный токен, а затем нажмите **Connect**.
7. Вы увидите боковую панель с несколькими «виртуальными» таблицами. `ALL` представляет все определённые вами объекты семантического слоя. Остальные таблицы представляют каждый из ваших сохранённых запросов. Выберите ту, которую хотите загрузить в свой дашборд. Затем нажмите **Load**.
   <Lightbox src="/img/docs/platform-integrations/sl-pbi/pbi-sidepanel.jpg" title="Выберите таблицы на боковой панели" />

После настройки коннектора вы можете настроить опубликованные отчеты в следующем разделе для использования этого подключения.

## Настройка опубликованных отчётов {#configure-published-reports}

После публикации отчета и при первом нажатии **Publish** для конкретного отчета необходимо настроить Power BI Service для использования On-premises Data Gateway вашей организации для доступа к данным из <Constant name="semantic_layer" />:

1. В правом верхнем углу нажмите **Settings > Power BI settings**.
   <Lightbox src="/img/docs/platform-integrations/sl-pbi/pbi-settings.jpg" title="Перейдите в Settings > Power BI Settings" />
2. Перейдите на вкладку **Semantic models** и выберите свой отчёт на боковой панели слева.
3. В разделе **Gateway and cloud connections** выберите **On-premises Data Gateway**, на котором ваш ИТ-администратор установил коннектор <Constant name="semantic_layer" />. 
   - Если в поле Status указано **Not configured correctly**, потребуется настроить подключение.
   <Lightbox src="/img/docs/platform-integrations/sl-pbi/pbi-gateway-cloud-connections.jpg" title="Настройте подключение через шлюз" />
4. Нажмите на стрелку в столбце **Actions**, затем нажмите **Manually add to gateway**.
   <Lightbox src="/img/docs/platform-integrations/sl-pbi/pbi-manual-gateway.jpg" title="Добавьте подключение к шлюзу вручную" />
5. Укажите имя подключения и введите параметры подключения. 
   - Установите для подключения значение **Encrypted** (обязательно). В противном случае серверы <Constant name="semantic_layer" /> отклонят подключение.
   <Lightbox src="/img/docs/platform-integrations/sl-pbi/pbi-encrypted.jpg" title="Установите для подключения значение Encrypted" />
6. Нажмите **Create**. Будет выполнена проверка подключения (если вы не решите её пропустить). Если подключение установлено успешно, оно будет сохранено.

Теперь вы можете вернуться к опубликованному отчету в Power BI Service и убедиться, что данные загружаются корректно.

## Использование коннектора {#use-the-connector}

В этом разделе описывается, как использовать коннектор <Constant name="semantic_layer" /> в Power BI.

Коннектор <Constant name="semantic_layer" /> создает:
- Виртуальную таблицу для каждого сохраненного запроса.
- Таблицу `METRICS.ALL`, содержащую все метрики, при этом измерения и сущности отображаются как обычные столбцы измерений.

Эти таблицы фактически не соответствуют физическим таблицам в вашем хранилище данных. Вместо этого Power BI отправляет запросы к этим таблицам, а серверы <Constant name="semantic_layer" /> (до выполнения запроса в хранилище):
- Парсят SQL.
- Извлекают все запрашиваемые столбцы, group by и фильтры.
- Генерируют SQL для запроса к существующим таблицам. 
- Возвращают данные обратно в Power BI, который «не знает», что все это происходило.

<Lightbox src="/img/docs/platform-integrations/sl-pbi/sl-pbi.jpg" width="90%" title="Схема интеграции с Power BI" />

Это обеспечивает очень гибкие аналитические сценарии, такие как перетаскивание метрик и разрез данных по измерениям и сущностям &mdash; <Constant name="semantic_layer" /> автоматически сгенерирует корректный SQL для запроса к вашему источнику данных.

#### Изменение временной гранулярности

import SlCustomGranularity from '/snippets/_sl-custom-granularity.md';

<SlCustomGranularity />

## Особенности и ограничения {#considerations}

<Expandable alt_header="Не каждый «столбец» METRICS.ALL совместим с любым другим столбцом">

- `METRICS.ALL` объединяет все существующие метрики, сущности и измерения. Запросы должны быть валидными запросами Semantic Layer, иначе они завершатся ошибками компиляции запросов MetricFlow.

- Для таблиц сохраненных запросов все «столбцы» будут совместимы друг с другом, так как по определению сохраненные запросы являются валидными и могут быть разрезаны по любым измерениям, присутствующим в запросе.
</Expandable>

<Expandable alt_header="Коннектор dbt Semantic Layer нативно не поддерживает режим Import">

- Используйте режим `DirectQuery`, чтобы обеспечить совместимость.
- В режиме `Import` выполняется попытка выбрать всю таблицу для импорта в Power BI, а значит, скорее всего, будет сгенерирован SQL, который преобразуется в недопустимый запрос к Semantic Layer: он попытается запросить все метрики, измерения и сущности одновременно.
- Чтобы импортировать данные в отчёт Power BI, выберите допустимую комбинацию столбцов для импорта (такую, которая позволит сформировать допустимый запрос к Semantic Layer).
   - Для этого можно использовать `Table.SelectColumns`: `= Table.SelectColumns(Source{[Item="ALL",Schema="METRICS",Catalog=null]}[Data], {"Total Profit", "Metric Time (Day)"})`
   - Учтите, что все вычисления будут выполняться внутри Power BI, без обращения к серверам Semantic Layer. Это может привести к неверным или расходящимся результатам.
   - Например, Semantic Layer обычно отвечает за агрегацию накопительных метрик до более крупных временных интервалов. Суммирование значений за все недели года для получения годовой детализации на основе запроса к Semantic Layer с недельной детализацией, скорее всего, даст неверные результаты. Вместо этого следует запрашивать данные с нужной детализацией непосредственно у Semantic Layer, чтобы получить точные результаты.

</Expandable>

<Expandable alt_header="Коннектор dbt Semantic Layer игнорирует агрегации, определенные в Power BI">

- Если вы измените тип агрегации метрики с `SUM()` на `COUNT()` или любой другой, ничего не изменится. Это связано с тем, что функции агрегации определяются в Semantic Layer, и они игнорируются при трансляции SQL, сгенерированного Power BI, в запросы Semantic Layer.
- Агрегации в Power BI, такие как `Count (Distinct)`, `Standard Deviation`, `Variance` и `Median`, могут возвращать ошибку и не работать вовсе.

</Expandable>

<Expandable alt_header="Какие действия не поддерживаются?">

Не поддерживаются следующие возможности:
- Пользовательское моделирование
- Соединение таблиц
- Создание пользовательских столбцов внутри таблицы
- Пользовательские Data Analysis Expressions (DAX) или Power Query (PQ)

</Expandable>
