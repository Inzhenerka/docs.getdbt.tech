---
title: "Power BI"
description: "Используйте Power BI для выполнения запросов к dbt Semantic Layer и построения дашбордов на основе доверенных данных."
tags: [Semantic Layer]
sidebar_label: "Power BI"
---

# Power BI <Lifecycle status="self_service,managed,managed_plus,preview" />

Интеграция с Power BI позволяет напрямую выполнять запросы к <Constant name="semantic_layer" />, что дает возможность строить дашборды в Power BI на основе доверенных, актуальных данных. Интеграция обеспечивает живое подключение к <Constant name="semantic_layer" /> через Power BI Desktop или Power BI Service.

## Предварительные требования

- У вас настроен [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- Вы используете поддерживаемый [релизный трек <Constant name="cloud" />](/docs/dbt-versions/cloud-release-tracks) или dbt версии 1.6 и выше.
- У вас установлен [Power BI Desktop или Power BI On-premises Data Gateway](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-custom-connectors).
  - Power BI Service нативно не поддерживает пользовательские коннекторы. Чтобы использовать коннектор в Power BI Service, необходимо установить и настроить его в On-premises Data Gateway.
- Для входа вам потребуется [хост <Constant name="cloud" />](/docs/use-dbt-semantic-layer/setup-sl#3-view-connection-detail), [Environment ID](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) и [service token](/docs/dbt-cloud-apis/service-tokens) или [personal access token](/docs/dbt-cloud-apis/user-tokens). Эта учетная запись должна быть настроена для работы с <Constant name="semantic_layer" />.
- У вас должен быть аккаунт <Constant name="cloud" /> уровня Starter или Enterprise [account](https://www.getdbt.com/pricing). Подходит как для Multi-tenant, так и для Single-tenant развертывания.

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Установка коннектора

Power BI коннектор для <Constant name="semantic_layer" /> состоит из пользовательского Power BI коннектора `.pqx` и ODBC-драйвера. Установите оба компонента с помощью нашего Windows-инсталлятора, следуя шагам ниже:

#### 1. Загрузите и установите [`.msi`-установщик](https://github.com/dbt-labs/semantic-layer-powerbi-connector/releases/download/v1.0.0/dbt.Semantic.Layer.for.Power.BI.zip)
   - Запустите установщик и следуйте инструкциям на экране.
   - В результате ODBC-драйвер и коннектор будут установлены в Power BI Desktop.

#### 2. Проверьте установку
   - Откройте **ODBC Data Sources (64-bit)** на вашем компьютере.
   - Перейдите в раздел **System DSN** и убедитесь, что зарегистрирован `dbt Labs ODBC DSN`. 
   - Перейдите в раздел **Drivers** и убедитесь, что установлен `dbt Labs ODBC Driver`.
   - Откройте Power BI Desktop, перейдите в **Settings**, затем **Data Source Settings**. Убедитесь, что коннектор `dbt Semantic Layer` корректно загружен.

Чтобы опубликованные отчеты в Power BI Service могли использовать коннектор, IT-администратор вашей организации должен установить и настроить его в On-premises Data Gateway.

## Для ИТ-администраторов

Этот раздел предназначен для IT-администраторов, которые устанавливают ODBC-драйвер и коннектор в On-premises Data Gateway.

Чтобы опубликованные отчеты могли использовать коннектор в Power BI Service, IT-администратор должен установить и настроить коннектор.

#### 1. Install the ODBC driver and connector into an On-premises Data Gateway
   - Запустите тот же `.msi`-установщик, который используется для Power BI Desktop.
   - Установите его на машине, где размещен ваш gateway.

#### 2. Copy connector file to Gateway directory
   - Найдите файл `.pqx`: `C:\Users\<YourUser>\Documents\Power BI Desktop\Custom Connectors\dbtSemanticLayer.pqx`.
   - Скопируйте его в каталог пользовательских коннекторов Power BI On-premises Data Gateway: `C:\Windows\ServiceProfiles\PBIEgwService\Documents\Power BI Desktop\Custom Connectors`.
#### 3. Verify installation
   - Выполните шаги проверки из раздела [install the connector](#3-verify-installation).
#### 4. Enable connector in Power BI Enterprise Gateway
   - Откройте `EnterpriseGatewayConfigurator.exe`.
   - Перейдите в раздел **Connectors**. 
   - Убедитесь, что коннектор `dbt Semantic Layer` установлен и активен.

Для получения дополнительной информации о настройке пользовательских коннекторов в Power BI On-premises Data Gateway обратитесь к [официальной документации Power BI](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-custom-connectors).

## Настройка коннектора

После установки коннектора необходимо настроить учетные данные проекта, чтобы подключиться к <Constant name="semantic_layer" /> из отчета.

Чтобы настроить учетные данные проекта в Power BI Desktop:

1. Создайте пустой отчет.
2. В левом верхнем углу нажмите **Get data**.
3. Найдите <Constant name="semantic_layer" /> и нажмите **Connect**.
4. Заполните параметры подключения. Host и Environment ID можно найти в настройках <Constant name="semantic_layer" /> для вашего проекта <Constant name="cloud" />.
   :::tip 
   Убедитесь, что в разделе **Data Connectivity mode** выбран **DirectQuery**, так как коннектор <Constant name="semantic_layer" /> не поддерживает режим **Import**. Подробнее см. в разделе [Considerations](#considerations). 
   :::
5. Нажмите **OK**, чтобы продолжить.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-directquery.jpg" title="Выбор режима DirectQuery" />
6. На следующем экране вставьте ваш service token или personal access token и нажмите **Connect**.
7. Вы увидите боковую панель с несколькими «виртуальными» таблицами. `ALL` представляет все определенные объекты semantic layer. Остальные таблицы соответствуют сохраненным запросам. Выберите таблицу, которую хотите загрузить в дашборд, затем нажмите **Load**.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-sidepanel.jpg" title="Выбор таблиц в боковой панели" />

После настройки коннектора вы можете настроить опубликованные отчеты в следующем разделе для использования этого подключения.

## Настройка опубликованных отчётов

После публикации отчета и при первом нажатии **Publish** для конкретного отчета необходимо настроить Power BI Service для использования On-premises Data Gateway вашей организации для доступа к данным из <Constant name="semantic_layer" />:

1. В правом верхнем углу нажмите **Settings > Power BI settings**.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-settings.jpg" title="Переход в Settings > Power BI Settings" />
2. Перейдите на вкладку **Semantic models** и выберите ваш отчет в боковой панели слева.
3. В разделе **Gateway and cloud connections** выберите **On-premises Data Gateway**, на котором IT-администратор установил коннектор <Constant name="semantic_layer" />. 
   - Если статус **Not configured correctly**, необходимо выполнить дополнительную настройку.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-gateway-cloud-connections.jpg" title="Настройка подключения к gateway" />
4. Нажмите на стрелку в колонке **Actions**, затем выберите **Manually add to gateway**.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-manual-gateway.jpg" title="Ручное добавление в gateway" />
5. Укажите имя подключения и введите параметры подключения. 
   - Установите подключение как **Encrypted** (обязательно). Если этого не сделать, серверы <Constant name="semantic_layer" /> отклонят соединение.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-encrypted.jpg" title="Настройка подключения как Encrypted" />
6. Нажмите **Create**. Будет выполнен тест подключения (если вы не выбрали его пропуск). При успешном подключении настройки будут сохранены.

Теперь вы можете вернуться к опубликованному отчету в Power BI Service и убедиться, что данные загружаются корректно.

## Использование коннектора

В этом разделе описывается, как использовать коннектор <Constant name="semantic_layer" /> в Power BI.

Коннектор <Constant name="semantic_layer" /> создает:
- Виртуальную таблицу для каждого сохраненного запроса.
- Таблицу `METRICS.ALL`, содержащую все метрики, при этом измерения и сущности отображаются как обычные столбцы измерений.

Эти таблицы фактически не соответствуют физическим таблицам в вашем хранилище данных. Вместо этого Power BI отправляет запросы к этим таблицам, а серверы <Constant name="semantic_layer" /> (до выполнения запроса в хранилище):
- Парсят SQL.
- Извлекают все запрашиваемые столбцы, group by и фильтры.
- Генерируют SQL для запроса к существующим таблицам. 
- Возвращают данные обратно в Power BI, который «не знает», что все это происходило.

<Lightbox src="/img/docs/cloud-integrations/sl-pbi/sl-pbi.jpg" width="90%" title="Диаграмма интеграции Power BI" />

Это обеспечивает очень гибкие аналитические сценарии, такие как перетаскивание метрик и разрез данных по измерениям и сущностям &mdash; <Constant name="semantic_layer" /> автоматически сгенерирует корректный SQL для запроса к вашему источнику данных.

## Соображения

<Expandable alt_header="Не каждый «столбец» METRICS.ALL совместим с любым другим столбцом">

- `METRICS.ALL` объединяет все существующие метрики, сущности и измерения. Запросы должны быть валидными запросами Semantic Layer, иначе они завершатся ошибками компиляции запросов MetricFlow.

- Для таблиц сохраненных запросов все «столбцы» будут совместимы друг с другом, так как по определению сохраненные запросы являются валидными и могут быть разрезаны по любым измерениям, присутствующим в запросе.
</Expandable>

<Expandable alt_header="Коннектор dbt Semantic Layer нативно не поддерживает режим Import">

- Используйте режим `DirectQuery` для обеспечения совместимости.
- Режим `Import` пытается выбрать целую таблицу для импорта в Power BI, что, скорее всего, приведет к генерации SQL, который будет некорректным запросом Semantic Layer и попытается одновременно запросить все метрики, измерения и сущности.
- Чтобы импортировать данные в отчет Power BI:
   - Выберите валидную комбинацию столбцов для импорта (ту, которая сгенерирует корректный запрос Semantic Layer).
   - Вы можете использовать `Table.SelectColumns` для этого: `= Table.SelectColumns(Source{[Item="ALL",Schema="METRICS",Catalog=null]}[Data], {"Total Profit", "Metric Time (Day)"})`
   - Имейте в виду, что все вычисления будут выполняться внутри Power BI и не будут проходить через серверы Semantic Layer. Это может привести к некорректным или расходящимся результатам.
   - Например, Semantic Layer обычно отвечает за агрегацию накопительных метрик к более крупной временной гранулярности. Суммирование всех недель в году для получения годовой гранулярности из недельного запроса Semantic Layer, скорее всего, даст некорректный результат. Вместо этого следует напрямую запрашивать Semantic Layer для получения точных данных.

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
