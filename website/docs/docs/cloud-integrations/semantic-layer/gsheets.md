---
title: "Google Sheets"
description: "Интеграция с Google Sheets для запроса ваших метрик в электронной таблице."
tags: [Semantic Layer]
sidebar_label: "Google Sheets"
---

# Google Sheets <Lifecycle status="self_service,managed,managed_plus" />

<Constant name="semantic_layer" /> предоставляет бесшовную интеграцию с Google Sheets через настраиваемое меню. Этот аддон позволяет вам создавать запросы <Constant name="semantic_layer" /> и получать данные по вашим метрикам непосредственно внутри Google Sheets.

## Предварительные требования

- Вы [настроили <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) и используете dbt версии 1.6 или выше.
- Вам необходима учетная запись Google с доступом к Google Sheets и возможностью устанавливать надстройки Google.
- У вас есть [Environment ID в <Constant name="cloud" />](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer).
- У вас есть [service token](/docs/dbt-cloud-apis/service-tokens) или [personal access token](/docs/dbt-cloud-apis/user-tokens) для аутентификации из учетной записи <Constant name="cloud" />.
- У вас должна быть учетная запись <Constant name="cloud" /> уровня Starter или Enterprise ([подробнее о тарифах](https://www.getdbt.com/pricing)). Подходит как для Multi-tenant, так и для Single-tenant развертывания.

Если вы используете [ограничения по IP](/docs/cloud/secure/ip-restrictions), убедитесь, что вы добавили [IP-адреса Google](https://www.gstatic.com/ipranges/goog.txt) в свой список разрешенных IP. В противном случае подключение к Google Sheets не удастся.

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Установка дополнения

1. Перейдите на страницу [<Constant name="semantic_layer" /> for Sheets App](https://gsuite.google.com/marketplace/app/foo/392263010968), чтобы установить надстройку. Также вы можете найти её прямо в Google Sheets, открыв [**Extensions -> Add-on -> Get add-ons**](https://support.google.com/docs/answer/2942256?hl=en&co=GENIE.Platform%3DDesktop&oco=0#zippy=%2Cinstall-add-ons%2Cinstall-an-add-on) и выполнив поиск там.
2. После установки откройте меню **Extensions** и выберите **<Constant name="semantic_layer" /> for Sheets**. В правой части экрана откроется пользовательское меню.
3. [Найдите](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) **Host** и **Environment ID** в <Constant name="cloud" />.
   - Перейдите в **Account Settings** и выберите **Projects** в левой боковой панели.
   - Выберите нужный проект, затем перейдите в настройки **<Constant name="semantic_layer" />**. Эти данные понадобятся вам для аутентификации в Google Sheets на следующем шаге.
   - Вы можете сгенерировать service token, нажав **Generate service token** на странице конфигурации <Constant name="semantic_layer" />, либо перейдя в **API tokens** в <Constant name="cloud" />. В качестве альтернативы вы также можете создать personal access token, перейдя в **API tokens** > **Personal tokens**.  
      <Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-and-gsheets.png" width="70%" title="Access your Environment ID, Host, and URLs in your dbt Semantic Layer settings. Generate a service token in the Semantic Layer settings or API tokens settings" />
4. В Google Sheets выполните аутентификацию, указав ваш Host, **Environment ID** из <Constant name="cloud" /> и service token или personal access token.

5. Начните запрашивать ваши метрики, используя **Конструктор запросов**. Для получения дополнительной информации о функциях меню обратитесь к [функциям Конструктора запросов](#query-builder-functions). Чтобы отменить запрос во время выполнения, нажмите кнопку "Отмена".

import Tools from '/snippets/_sl-excel-gsheets.md';

<Tools 
type="Google Sheets"
bullet_1="Пользовательская операция меню имеет ограничение по времени выполнения — шесть (6) минут."

bullet_2="Если вы используете это расширение, убедитесь, что вы вошли в Chrome под тем же профилем Google, который использовался при настройке аддона. Входите только под одним профилем Google одновременно, так как одновременное использование нескольких профилей Google может привести к проблемам."

bullet_3="Обратите внимание, что в настоящее время доступны только стандартные временные гранулярности; пользовательские временные гранулярности для этой интеграции пока не поддерживаются."
queryBuilder="/img/docs/dbt-cloud/semantic-layer/query-builder.png"
PrivateSelections="Вы также можете сделать эти выборы приватными или публичными. Публичные выборы означают, что ваши вводимые данные доступны в меню всем на листе. 
Приватные выборы означают, что ваши вводимые данные видны только вам. Обратите внимание, что любой, добавленный на лист, все равно может видеть данные из этих приватных выборов, но они не смогут взаимодействовать с выбором в меню или получать выгоду от автоматического обновления."
/>

**Раскрытие политики ограниченного использования**

Использование и передача информации, полученной от Google API, Семантическим слоем dbt для Sheets будет соответствовать [Политике использования данных пользователей Google API Services](https://developers.google.com/terms/api-services-user-data-policy), включая требования ограниченного использования.

Сохранённые выборки позволяют сохранять введённые параметры в **Query Builder**, чтобы вы могли легко возвращаться к ним позже и не собирать часто используемые запросы каждый раз с нуля. Чтобы создать сохранённую выборку:

- Выполните запрос в **Query Builder**.
- Сохраните выборку, нажав на стрелку рядом с кнопкой **Query**, а затем выбрав **Query & Save Selection**.
- Приложение сохранит эти выборки, и вы сможете просматривать и редактировать их через меню «гамбургер» в разделе **Saved Selections**.

Вы также можете сделать эти выборки приватными или публичными:

- **Public selections** — ваши параметры будут доступны в меню всем пользователям листа.
- **Private selections** — ваши параметры будут видны только вам. Обратите внимание: любой пользователь, добавленный к листу, всё равно сможет видеть данные из этих приватных выборок, но не сможет взаимодействовать с выборкой через меню или пользоваться автоматическим обновлением.

### Обновление выборок

Вы можете настроить автоматическое обновление сохранённых выборок каждый раз при загрузке аддона. Для этого при создании сохранённой выборки выберите **Refresh on Load**. Когда вы откроете аддон и у вас будут сохранённые выборки с включённым обновлением, в обновляющихся ячейках вы увидите сообщение «Loading...».

Публичные сохранённые выборки будут обновляться для любого пользователя, который редактирует лист, в то время как приватные выборки будут обновляться только для пользователя, который их создал.

:::tip В чём разница между saved selections и saved queries?

- Saved selections — это сохранённые компоненты, которые можно создавать только при работе с приложением.
- Saved queries, описанные в следующем разделе, — это определённые в коде наборы данных, которые вы создаёте в своём проекте dbt и которые можно удобно использовать для построения выборок. Вы также можете использовать результаты saved query для создания saved selection.
:::

## Использование saved queries

Используйте <a href="/docs/build/saved-queries">saved queries</a>, работающие на базе MetricFlow, чтобы быстро получать результаты из заранее определённых наборов данных. Чтобы получить доступ к saved queries в вашей интеграции:

- Откройте меню «гамбургер» в Google Sheets.
- Перейдите в **Saved Queries**, чтобы увидеть доступные вам запросы.
- Вы также можете выбрать **Build Selection**, что позволит исследовать существующий запрос. Это не изменит исходный запрос, определённый в коде.
  - Если в saved query используется [`where` filter](/docs/build/saved-queries#where-clause), Google Sheets отобразит расширенный синтаксис для этого фильтра.
-->

**Disclosure о политике ограниченного использования**

Использование и передача <Constant name="semantic_layer" /> для Sheets, а также передача информации, полученной из Google APIs, в другие приложения осуществляется в соответствии с [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), включая требования Limited Use.

## FAQs
<FAQ path="Troubleshooting/sl-alpn-error" />
